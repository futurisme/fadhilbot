/**
 * @file zipExporter.js
 * 100% Pure JavaScript ZIP Export Engine
 * Menggunakan JSZip untuk mengompres dan mengunduh berkas sumber Fadhilbot secara instan.
 */

import JSZip from 'jszip';

/**
 * Ekspor berkas repositori sebagai file ZIP ringan (~35 KB).
 * Berkas media besar (/assets/*.mp4 & *.mp3) dikecualikan sesuai standar self-host VPS
 * dan digantikan dengan petunjuk penempatan media agar unduhan secepat kilat.
 * 
 * @param {Array<{name: string, path: string, content: string}>} files
 * @param {string} zipFilename
 */
export async function exportFilesAsZip(files, zipFilename = 'fadhilbot-selfhost-2026-clean.zip') {
  const zip = new JSZip();

  files.forEach((file) => {
    const isAsset = file.path.startsWith('assets/') ||
      file.path.startsWith('/assets/') ||
      file.path.includes('/assets/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.mp3');

    if (!isAsset) {
      zip.file(file.path, file.content);
    }
  });

  // Petunjuk penempatan aset media pada container Linux/Pterodactyl/Wispbyte
  zip.file(
    'assets/PETUNJUK_ASET.txt',
    `[STRUKTUR ASSET MEDIA DISCORD 24/7 FADHILBOT 2026]
Folder /assets sengaja tidak disertakan di dalam ZIP ini agar unduhan super ringan (~35 KB) dan hemat kuota.

Pastikan file media berikut berada di dalam folder 'assets/' pada server Wispbyte / VPS Linux Anda:
1. assets/yamada_op.mp4  (Video Track 1 - KANA-BOON Gradation)
2. assets/yamada_op.mp3  (Audio Asli Jernih & Boosted Track 1)
3. assets/aizo480p.mp4   (Video Track 2 - AIZO 480p)
4. assets/aizo.mp3       (Audio Asli Jernih & Boosted Track 2)

Jika berkas sudah ada sebelumnya di server, Anda TIDAK PERLU mengunggahnya lagi!
Cukup ekstrak file kode (index.js, index.cjs, package.json, .env, config.json) ini langsung ke server.`
  );

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
