import { useState } from 'react';
import { ShieldAlert, AlertTriangle, Key, CheckCircle2, RefreshCw, Copy, Check, ExternalLink, Lock } from 'lucide-react';
import { TokenAnalysis } from '../types';

interface TokenAuditTabProps {
  tokenAnalysis: TokenAnalysis;
  userToken: string;
  setUserToken: (t: string) => void;
}

export function TokenAuditTab({ tokenAnalysis, userToken, setUserToken }: TokenAuditTabProps) {
  const [copied, setCopied] = useState(false);
  const parts = userToken.split('.');

  const handleCopy = () => {
    navigator.clipboard.writeText(userToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          Audit Keamanan &amp; Analisis Kriptografi Token Discord
        </h2>
        <p className="text-sm text-[#94a3b8] mt-1">
          Analisis struktural mendalam terhadap token yang Anda berikan, evaluasi risiko keamanan, serta rekomendasi pencegahan pemblokiran akun.
        </p>
      </div>

      {/* Token Anatomy breakdown */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#38bdf8]" />
          Anatomi Struktur 3 Bagian Token Discord
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <span className="text-[11px] text-[#38bdf8] block font-semibold mb-1">
              Bagian 1: Base64 Snowflake ID
            </span>
            <code className="text-emerald-400 block bg-[#0f172a] p-2 rounded break-all border border-[#1e293b]">
              {parts[0] || 'MTQxMjM0NTY3ODkwMTIzNA'}
            </code>
            <div className="mt-2 text-[#94a3b8] font-sans">
              <strong>Hasil Decode:</strong>
              <div className="text-white font-mono mt-0.5">{tokenAnalysis.snowflakeId || 'ID Tidak Terdeteksi'}</div>
              <p className="mt-1 text-[11px]">Ini adalah ID entitas akun/aplikasi di database Discord.</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <span className="text-[11px] text-amber-400 block font-semibold mb-1">
              Bagian 2: Timestamp Pembuatan
            </span>
            <code className="text-amber-400 block bg-[#0f172a] p-2 rounded break-all border border-[#1e293b]">
              {parts[1] || 'XXXXXX'}
            </code>
            <div className="mt-2 text-[#94a3b8] font-sans">
              <strong>Waktu Pembuatan Token:</strong>
              <div className="text-white font-mono mt-0.5">{tokenAnalysis.createdAtDate || 'Tidak Ada'}</div>
              <p className="mt-1 text-[11px]">Dihitung dari Discord Epoch (1 Januari 2015).</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <span className="text-[11px] text-rose-400 block font-semibold mb-1">
              Bagian 3: HMAC Signature Secret
            </span>
            <code className="text-rose-400 block bg-[#0f172a] p-2 rounded break-all border border-[#1e293b]">
              {parts[2] || 'SAMPLE_SECRET_SIGNATURE_HASH'}
            </code>
            <div className="mt-2 text-[#94a3b8] font-sans">
              <strong>Kunci Rahasia (HMAC):</strong>
              <div className="text-white font-mono mt-0.5">SHA256 HMAC Hash</div>
              <p className="mt-1 text-[11px]">Hanya server Discord yang dapat memverifikasi signature ini.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Security Warning Matrix */}
      <div className="bg-[#0f172a] border border-rose-500/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-rose-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Matriks Risiko &amp; Kebijakan Discord (ToS Warning)
        </h3>

        <div className="space-y-3 text-xs text-[#cbd5e1]">
          <div className="p-3 bg-[#080d1a] border border-rose-500/20 rounded-lg">
            <strong className="text-rose-400 block mb-1">1. Risiko Kebocoran Token (Credential Exposure)</strong>
            <p className="text-[#94a3b8]">
              Token yang dimasukkan dalam teks publik/chat dapat diindeks oleh bot pencari kredensial. Siapapun yang memiliki token ini memiliki hak akses penuh ke akun/bot tanpa memerlukan password atau kode 2FA.
            </p>
            <div className="mt-2 text-amber-400 font-medium">
              Solusi: Segera reset token di Discord Developer Portal atau ganti kata sandi Discord Anda setelah selesai menguji.
            </div>
          </div>

          <div className="p-3 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <strong className="text-amber-400 block mb-1">2. Kebijakan Automasi Akun Pengguna (Self-Bot Ban)</strong>
            <p className="text-[#94a3b8]">
              Discord Terms of Service melarang penggunaan skrip pada akun pengguna biasa jika melakukan perilaku spamming atau interaksi tidak natural.
            </p>
            <div className="mt-2 text-emerald-400 font-medium">
              Solusi: Gunakan modul anti-deteksi status jitter di tab "Anti-Deteksi Status" yang telah otomatis diaktifkan di dalam kode index.js.
            </div>
          </div>

          <div className="p-3 bg-[#080d1a] border border-[#1e293b] rounded-lg">
            <strong className="text-[#38bdf8] block mb-1">3. Praktik Terbaik di Hosting Wispbyte</strong>
            <p className="text-[#94a3b8]">
              Jangan simpan token langsung di dalam berkas index.js publik. Selalu manfaatkan tab Startup Environment Variable pada panel Wispbyte untuk menyimpan kredensial secara terlindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
