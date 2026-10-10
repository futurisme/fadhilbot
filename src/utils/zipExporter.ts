import JSZip from 'jszip';
import { RepoFile } from '../types';

/**
 * Ekspor file repositori sebagai file ZIP ringan.
 * CATATAN PENTING: Sesuai preferensi pengguna, folder dan file /assets (video .mp4 & audio .mp3)
 * sengaja DIKECUALIKAN dari ZIP agar unduhan super cepat (hanya puluhan KB) dan pengguna
 * tidak perlu berulang kali mengunduh file video/audio berat yang sudah ada di VPS/lokal.
 */
export async function exportFilesAsZip(files: RepoFile[], zipFilename = 'fadhilbot-audio-priority-480p.zip'): Promise<void> {
  const zip = new JSZip();

  // Masukkan hanya file kode, skrip, dan konfigurasi (KECUALIKAN file di dalam folder assets)
  files.forEach(file => {
    const isAsset = file.path.startsWith('assets/') || 
                    file.path.startsWith('/assets/') || 
                    file.path.includes('/assets/') ||
                    file.name.endsWith('.mp4') || 
                    file.name.endsWith('.mp3');

    if (!isAsset) {
      zip.file(file.path, file.content);
    }
  });

  // Sertakan panduan cepat penempatan aset agar pengguna tahu struktur folder di VPS
  zip.file('assets/PETUNJUK_ASET.txt', 
`[STRUKTUR ASSET MEDIA DISCORD 24/7]
Folder /assets sengaja tidak disertakan dalam file ZIP ini untuk menghemat kuota & waktu unduh.

Pastikan file media berikut berada di dalam folder 'assets/' pada server Wispbyte / VPS Anda:
1. assets/yamada_op.mp4  (Video Track 1 - KANA-BOON Gradation)
2. assets/yamada_op.mp3  (Audio Asli Jernih & Boosted Track 1)
3. assets/aizo480p.mp4   (Video Track 2 - AIZO 480p)
4. assets/aizo.mp3       (Audio Asli Jernih & Boosted Track 2)

Jika file sudah ada di server Wispbyte sebelumnya, Anda TIDAK PERLU mengunggahnya lagi!
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

