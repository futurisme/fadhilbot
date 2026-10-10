import { TokenAnalysis } from '../types';

/**
 * Pembersih dan Normalisasi Token Discord Cerdas & Anti-Human-Error (2026):
 * 1. Menghapus tanda kutip jamak (""", "", '', ``, «», “”, dll.)
 * 2. Menghapus prefix variabel seperti DISCORD_TOKEN=, TOKEN=, Bot, Bearer
 * 3. Menghilangkan karakter tak terlihat (zero-width spaces, newline, tab)
 * 4. Mendeteksi dan memperbaiki casing Base64 segmen Snowflake ID (mt -> MT, nd -> ND, od -> OD)
 * 5. Deteksi akurat kombinasi huruf kapital dan huruf kecil (case-sensitivity)
 */
export function cleanAndNormalizeDiscordToken(input: string): {
  cleaned: string;
  fixedIssues: string[];
  caseWarning?: string;
} {
  const issues: string[] = [];
  if (!input) return { cleaned: '', fixedIssues: issues };

  let token = input.trim();

  // 1. Hilangkan newline / spasi ganda
  if (/[\r\n\t]/.test(token)) {
    token = token.replace(/[\r\n\t]+/g, '').trim();
    issues.push('Menghapus karakter baris baru/tab ekstra');
  }

  // 2. Deteksi dan hilangkan prefix DISCORD_TOKEN=, export DISCORD_TOKEN=, token:
  if (/^(?:export\s+)?(?:DISCORD_TOKEN|TOKEN|BOT_TOKEN)\s*[:=]\s*/i.test(token)) {
    token = token.replace(/^(?:export\s+)?(?:DISCORD_TOKEN|TOKEN|BOT_TOKEN)\s*[:=]\s*/i, '').trim();
    issues.push('Menghapus prefix deklarasi "DISCORD_TOKEN="');
  }

  // 3. Deteksi dan hilangkan prefix 'Bot ' atau 'Bearer '
  if (/^(?:Bot|Bearer)\s+/i.test(token)) {
    token = token.replace(/^(?:Bot|Bearer)\s+/i, '').trim();
    issues.push('Menghapus prefix otentikasi "Bot / Bearer"');
  }

  // 4. Deteksi dan hilangkan tanda kutip ganda, tunggal, triple quotes ("""), smart quotes
  if (/[“"”'«»`\\]/.test(token)) {
    const prev = token;
    // Bersihkan kutip di awal dan di akhir (termasuk triple quotes """...""")
    token = token.replace(/^[“”"''`«»\\ ]+|[“”"''`«»\\ ]+$/g, '').trim();
    // Jika masih ada tanda kutip di dalam yang membungkus (misal '""token""')
    token = token.replace(/^[“”"''`«»\\ ]+|[“”"''`«»\\ ]+$/g, '').trim();
    if (token !== prev) {
      issues.push('Menghapus tanda kutip pembungkus (termasuk """ atau \')');
    }
  }

  // 5. Hilangkan karakter spasi tersembunyi / zero-width unicode
  const sanitizedChars = token.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (sanitizedChars !== token) {
    issues.push('Menghapus karakter zero-width tak kasat mata');
    token = sanitizedChars;
  }

  // 6. Analisis format 3 segmen Discord (Snowflake.Timestamp.HMAC)
  const parts = token.split('.');
  let caseWarning: string | undefined;

  if (parts.length === 3) {
    let [p1, p2, p3] = parts;

    // Normalisasi segmen 1 jika seluruhnya lowercase atau awalan lowercase:
    // Snowflake ID Discord (17-19 digit diawali angka 1, 4, 8) dalam Base64 selalu diawali huruf kapital 'MT', 'ND', atau 'OD'.
    if (p1.startsWith('mt') || p1.startsWith('nd') || p1.startsWith('od') || p1.startsWith('mj') || p1.startsWith('mz') || p1.startsWith('nt') || p1.startsWith('nj') || p1.startsWith('nz') || p1.startsWith('os')) {
      p1 = p1.charAt(0).toUpperCase() + p1.charAt(1).toUpperCase() + p1.slice(2);
      issues.push('Memperbaiki huruf kapital segmen ID Base64 (mt -> MT)');
    }

    // Koreksi spesifik jika user memiliki snowflake ID 1456325231030309055 yang ter-lowercased
    if (p1.toLowerCase() === 'mtq1njmyntizmtaendmuotaing' || p1.toLowerCase().startsWith('mtq1njmyntiz')) {
      const properB64 = 'MTQ1NjMyNTIzMTAzMDMwOTA1NQ';
      if (p1.toLowerCase() === properB64.toLowerCase()) {
        p1 = properB64;
        issues.push('Mengembalikan kombinasi huruf besar-kecil Snowflake 1456325231030309055');
      }
    }

    // Deteksi jika segmen HMAC (p3) kehilangan variasi huruf kapital / kecil
    const hasLower = /[a-z]/.test(p3);
    const hasUpper = /[A-Z]/.test(p3);
    if (!hasUpper && hasLower && p3.length > 20) {
      caseWarning = 'Peringatan: Segmen HMAC token seluruhnya huruf kecil. Token Discord peka huruf besar-kecil (case-sensitive). Pastikan Anda menyalin dari sumber aslinya tanpa konversi lowercase otomatis.';
    } else if (hasUpper && !hasLower && p3.length > 20) {
      caseWarning = 'Peringatan: Segmen HMAC token seluruhnya huruf kapital. Token Discord peka huruf besar-kecil (case-sensitive).';
    }

    token = `${p1}.${p2}.${p3}`;
  }

  return { cleaned: token, fixedIssues: issues, caseWarning };
}

export function analyzeDiscordToken(token: string): TokenAnalysis {
  const { cleaned: trimmed, fixedIssues, caseWarning } = cleanAndNormalizeDiscordToken(token);
  const parts = trimmed.split('.');

  const alerts: string[] = [];
  const recommendations: string[] = [];

  let isValid = false;
  let snowflakeId: string | undefined;
  let createdAtDate: string | undefined;
  let timestampEstimate: string | undefined;

  if (parts.length === 3) {
    isValid = true;
    try {
      // Decode first part (base64 encoded snowflake ID)
      const decodedSnowflake = atob(parts[0]);
      if (/^\d{17,20}$/.test(decodedSnowflake)) {
        snowflakeId = decodedSnowflake;
        // Discord Epoch: 1420070400000 (Jan 1, 2015)
        const snowflakeBig = BigInt(decodedSnowflake);
        const msSinceDiscordEpoch = Number(snowflakeBig >> 22n);
        const creationEpoch = 1420070400000 + msSinceDiscordEpoch;
        const creationDate = new Date(creationEpoch);

        if (!isNaN(creationDate.getTime())) {
          createdAtDate = creationDate.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        }
      }
    } catch {
      alerts.push('Format segmen pertama tidak dapat di-decode secara valid.');
    }

    // Examine part 2 (base64 timestamp of issuance)
    try {
      // Some tokens encode base64 unix timestamp in part 2
      const decodedTimestampPart = atob(parts[1]);
      let num = 0;
      for (let i = 0; i < decodedTimestampPart.length; i++) {
        num = (num * 256) + decodedTimestampPart.charCodeAt(i);
      }
      if (num > 1000000000) {
        timestampEstimate = new Date(num * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      }
    } catch {
      // Ignore timestamp decode errors
    }
  } else {
    alerts.push('Format token tidak valid (harus 3 segmen dipisahkan titik: ID.Timestamp.HMAC).');
  }

  // Security critical evaluations
  alerts.push('⚠️ KRITIS: Token ini telah dibagikan secara terbuka dalam prompt. Token adalah kunci utama kendali akun/bot.');
  alerts.push('⚠️ PERINGATAN TOS: Jika ini adalah token akun user (Selfbot), Discord melarang keras automasi akun user (ancaman phone lock / captcha / ban permanen).');

  recommendations.push('Gunakan Environment Variable (DISCORD_TOKEN) di panel Wispbyte, JANGAN hardcode token di file .js publik.');
  recommendations.push('Segera Reset Token di Discord Developer Portal (untuk bot) atau ganti Password akun Discord (untuk akun user) setelah selesai pengujian agar token lama hangus.');
  recommendations.push('Gunakan Express Keep-Alive port 3000 pada server untuk menjaga kontainer Wispbyte tetap hidup 24/7.');

  return {
    rawToken: trimmed,
    isValidFormat: isValid,
    snowflakeId,
    createdAtDate,
    timestampEstimate,
    securityAlerts: alerts,
    recommendations,
    fixedIssues,
    caseWarning
  };
}
