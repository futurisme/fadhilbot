import { useState } from 'react';
import {
  Server,
  Key,
  Radio,
  FolderUp,
  Sliders,
  Play,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Zap,
  HelpCircle,
  Terminal,
  Cpu,
  Layers,
  AlertTriangle,
  RotateCcw,
  HardDrive,
  Activity,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface WispbyteGuideTabProps {
  userToken: string;
  voiceChannelId?: string;
  onNavigateToEditor?: () => void;
}

export function WispbyteGuideTab({ userToken, voiceChannelId }: WispbyteGuideTabProps) {
  const [platformType, setPlatformType] = useState<'vps' | 'wispbyte'>('vps');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSubView, setActiveSubView] = useState<'steps' | 'troubleshoot'>('steps');

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStepCompletion = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  // -------------------------------------------------------------
  // UBUNTU 24.04 CLOUD VPS STEPS (1 CORE, 1GB RAM - DOMAINESIA)
  // -------------------------------------------------------------
  const vpsStepsList = [
    {
      id: 1,
      title: 'Koneksi SSH & Alokasi SWAP Memory (Krusial 1GB RAM)',
      shortTitle: 'SSH & Swap',
      icon: Terminal,
      category: 'Infrastruktur VPS',
      badge: 'Langkah 1',
      description: 'Menghubungkan terminal SSH ke VPS Ubuntu 24.04 dan membuat file Swap 2GB agar RAM 1GB tidak crash.',
      checklistText: 'Sudah login via SSH dan Swap 2GB aktif (verifikasi: swapon --show)',
      actionUrl: 'https://my.domainesia.com/dashboard/productdetails&id=336765',
      actionLabel: 'Buka Dashboard DomaiNesia',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200">
            <strong className="block font-semibold mb-1 text-amber-300">⚠️ PENTING UNTUK VPS 1 CORE &amp; 1 GB RAM:</strong>
            Spesifikasi VPS Anda (1 Core CPU, 1 GB Memory) sangat rawan terkena <em>Linux OOM (Out Of Memory) Killer</em> saat kompilasi WebRTC native. Membuat <strong>2 GB Swap File</strong> adalah langkah wajib nomor satu agar server tidak pernah hang atau crash!
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">1. Buka Terminal SSH (di Windows Terminal, PowerShell, atau tombol "Launch Console"):</span>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-sky-300">
              <code>ssh root@202.155.95.208</code>
              <button
                onClick={() => copyText('ssh root@202.155.95.208', 'vps-ssh-cmd')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 shrink-0 ml-2"
              >
                {copiedId === 'vps-ssh-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-ssh-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 italic">Masukkan password root yang dikirimkan via email oleh DomaiNesia atau atur di tab Password.</p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">2. Jalankan Perintah Pembuatan 2 GB Swap File (Sekali Eksekusi):</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
{`fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab`}
              </pre>
              <button
                onClick={() => copyText("fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab", 'vps-swap-cmd')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-swap-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-swap-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-200 block">3. Verifikasi Status Swap:</span>
            <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300">
              <code>free -h</code>
              <button
                onClick={() => copyText('free -h', 'vps-free-cmd')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                {copiedId === 'vps-free-cmd' ? 'Tersalin' : 'Salin'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Pastikan baris <code className="text-white">Swap:</code> menampilkan total <code className="text-emerald-400">2.0Gi</code>.</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Update Ubuntu 24.04 & Pasang Node.js 22 LTS, FFmpeg, Git',
      shortTitle: 'Install Node 22',
      icon: Cpu,
      category: 'Runtime & Compiler',
      badge: 'Langkah 2',
      description: 'Memasang Node.js v22 LTS resmi via NodeSource serta FFmpeg untuk pemrosesan video H.264 & Opus.',
      checklistText: 'Node.js v22.x dan ffmpeg sudah terpasang (verifikasi: node -v && ffmpeg -version)',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">1. Update Paket &amp; Pasang Dependensi Kompilasi:</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-sky-300 overflow-x-auto whitespace-pre-wrap">
{`apt update && apt upgrade -y && apt install -y curl git ffmpeg build-essential python3 unzip`}
              </pre>
              <button
                onClick={() => copyText('apt update && apt upgrade -y && apt install -y curl git ffmpeg build-essential python3 unzip', 'vps-apt-cmd')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-apt-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-apt-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">2. Pasang Node.js 22 LTS Resmi (NodeSource Repository):</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
{`curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs`}
              </pre>
              <button
                onClick={() => copyText('curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs', 'vps-node22-cmd')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-node22-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-node22-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-slate-200 block">3. Verifikasi Versi Node.js &amp; FFmpeg:</span>
            <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300">
              <code>node -v && npm -v && ffmpeg -version | head -n 1</code>
              <button
                onClick={() => copyText('node -v && npm -v && ffmpeg -version | head -n 1', 'vps-verif-cmd')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                {copiedId === 'vps-verif-cmd' ? 'Tersalin' : 'Salin'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Harus menampilkan versi <code className="text-white">v22.x.x</code> dan versi FFmpeg terpasang.</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Clone Repository & Konfigurasi Berkas .env',
      shortTitle: 'Clone & .env',
      icon: FolderUp,
      category: 'Deployment Code',
      badge: 'Langkah 3',
      description: 'Menyalin seluruh project ke direktori /root/fadhilbot dan menuliskan konfigurasi kredensial bot.',
      checklistText: 'Folder /root/fadhilbot sudah ada dan file .env terisi dengan token Discord',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">1. Clone Repository GitHub ke /root/fadhilbot:</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-sky-300 overflow-x-auto whitespace-pre-wrap">
{`git clone https://github.com/futurisme/fadhilbot.git /root/fadhilbot && cd /root/fadhilbot`}
              </pre>
              <button
                onClick={() => copyText('git clone https://github.com/futurisme/fadhilbot.git /root/fadhilbot && cd /root/fadhilbot', 'vps-clone-cmd')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-clone-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-clone-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">2. Buat File .env Secara Otomatis (Sudah Termasuk Token Anda):</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre-wrap">
{`cat << 'EOF' > /root/fadhilbot/.env
DISCORD_TOKEN=${userToken || 'MASUKKAN_TOKEN_DISCORD_ANDA'}
VOICE_CHANNEL_ID=${voiceChannelId || '1366441630151737445'}
GUILD_ID=1323944038117675038
YOUTUBE_STREAM_URL=https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ
YOUTUBE_TRACK_TITLE=山田くんとLv999の恋をする OP - KANA-BOON「ぐらでーしょん」
AUTO_LOOP=true
PORT=3000
EOF`}
              </pre>
              <button
                onClick={() => copyText(`cat << 'EOF' > /root/fadhilbot/.env\nDISCORD_TOKEN=${userToken || 'MASUKKAN_TOKEN_DISCORD_ANDA'}\nVOICE_CHANNEL_ID=${voiceChannelId || '1366441630151737445'}\nGUILD_ID=1323944038117675038\nYOUTUBE_STREAM_URL=https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ\nYOUTUBE_TRACK_TITLE=山田くんとLv999の恋をする OP - KANA-BOON「ぐらでーしょん」\nAUTO_LOOP=true\nPORT=3000\nEOF`, 'vps-dotenv-cmd')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-dotenv-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-dotenv-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Install Dependencies & Jalankan Auto-Patch Postinstall',
      shortTitle: 'npm install',
      icon: Layers,
      category: 'Build & Patch',
      badge: 'Langkah 4',
      description: 'Mengunduh paket node_modules dan otomatis memicu scripts/postinstall.cjs untuk memperbaiki Error 2012 & GLIBC.',
      checklistText: 'npm install selesai dan postinstall memunculkan log patch sukses',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">1. Masuk ke Direktori &amp; Jalankan npm install:</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
{`cd /root/fadhilbot && npm install`}
              </pre>
              <button
                onClick={() => copyText('cd /root/fadhilbot && npm install', 'vps-npmi-cmd')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-npmi-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-npmi-cmd' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-slate-300">
            <span className="font-semibold text-white block">Output Sukses yang Harus Muncul:</span>
            <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-sky-300 space-y-0.5">
              <div>[POSTINSTALL] Native WebRTC GLIBC compatibility verified.</div>
              <div>[POSTINSTALL] Patched BaseMediaStream stream timing &amp; Error 2012 safety in BaseMediaStream.js.</div>
            </div>
            <p className="text-[11px] text-slate-400">Skrip postinstall otomatis mengamankan timing stream dan mencegah crash "delay argument must be number".</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Pasang PM2 & Jalankan Bot 24/7 (1-Core Memory Shield)',
      shortTitle: 'PM2 Daemon',
      icon: Play,
      category: 'Proses Latar Belakang',
      badge: 'Langkah 5',
      description: 'Menjadikan bot berjalan sebagai service daemon 24/7 di background, auto-restart saat crash atau VPS reboot.',
      checklistText: 'PM2 online berstatus "online" dan autorestart diaktifkan di systemd',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">1. Pasang PM2 Secara Global:</span>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-sky-300">
              <code>npm install -g pm2</code>
              <button
                onClick={() => copyText('npm install -g pm2', 'vps-pm2-install')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-pm2-install' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-pm2-install' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">2. Jalankan Bot dengan Batasan Memori Ringan Khusus 1 Core:</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
{`pm2 start index.js --name "fadhilbot" --max-memory-restart 500M --node-args="--max-old-space-size=400"`}
              </pre>
              <button
                onClick={() => copyText('pm2 start index.js --name "fadhilbot" --max-memory-restart 500M --node-args="--max-old-space-size=400"', 'vps-pm2-start')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-pm2-start' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-pm2-start' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">Parameter <code className="text-white">--max-old-space-size=400</code> membatasi heap V8 agar tidak melampaui RAM 1GB.</p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">3. Kunci Auto-Start Saat VPS Reboot (Systemd Integration):</span>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre-wrap">
{`pm2 startup && pm2 save`}
              </pre>
              <button
                onClick={() => copyText('pm2 startup && pm2 save', 'vps-pm2-save')}
                className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-pm2-save' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-pm2-save' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 italic">Jika PM2 memunculkan perintah `sudo env PATH=...`, salin dan jalankan perintah tersebut sekali lagi di terminal, lalu ketik `pm2 save`.</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Pantau Siaran Real-Time & Verifikasi Uptime',
      shortTitle: 'Live Logs & Uptime',
      icon: Activity,
      category: 'Monitoring',
      badge: 'Langkah 6',
      description: 'Mengecek console live streaming bot di Discord voice channel dan menguji health check HTTP port 3000.',
      checklistText: 'Stream Go-Live aktif di Discord dengan suara lantang dan status PM2 online',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">1. Cek Live Streaming Log (Tekan Ctrl+C untuk keluar dari log):</span>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400">
              <code>pm2 logs fadhilbot --lines 50</code>
              <button
                onClick={() => copyText('pm2 logs fadhilbot --lines 50', 'vps-pm2-logs')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
              >
                {copiedId === 'vps-pm2-logs' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'vps-pm2-logs' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200 block">2. Cek Endpoint Keep-Alive HTTP (Port 3000):</span>
            <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-sky-300">
              <code>curl -s http://localhost:3000 | grep -o '"status":"ONLINE"'</code>
              <button
                onClick={() => copyText('curl -s http://localhost:3000 | grep -o \'"status":"ONLINE"\'', 'vps-curl-test')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                {copiedId === 'vps-curl-test' ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-slate-300 space-y-1">
            <strong className="text-emerald-400 block font-semibold">🎉 Siaran Go-Live Screen Share Aktif!</strong>
            <p>Buka Discord dan masuk ke Voice Channel <strong>#Gaming</strong>. Anda akan melihat tile stream menyiarkan video HD 720p 30FPS dengan suara stabil keras tanpa redup!</p>
          </div>
        </div>
      )
    }
  ];

  // -------------------------------------------------------------
  // WISPBYTE CONTAINER STEPS (ORIGINAL)
  // -------------------------------------------------------------
  const wispbyteStepsList = [
    {
      id: 1,
      title: 'Pendaftaran & Buat Server di Wispbyte',
      shortTitle: 'Buat Server',
      icon: Server,
      category: 'Infrastruktur',
      badge: 'Langkah 1',
      description: 'Menyiapkan container Pterodactyl gratis khusus Node.js untuk menampung script 24 jam.',
      checklistText: 'Server Node.js di Wispbyte sudah dibuat dan berstatus Ready',
      actionUrl: 'https://wispbyte.com',
      actionLabel: 'Buka Wispbyte.com',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-white block">Instruksi Detail:</span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Kunjungi portal resmi Wispbyte di <a href="https://wispbyte.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">wispbyte.com</a>.</li>
              <li>Login menggunakan akun Discord Anda atau daftar email gratis.</li>
              <li>Pada dashboard utama, klik tombol <strong className="text-emerald-400">+ Create Server</strong>.</li>
              <li>Pilih Software <strong>NodeJS</strong> dengan RAM 256 MB - 512 MB.</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Salin Konfigurasi & Upload File Project',
      shortTitle: 'Upload Files',
      icon: FolderUp,
      category: 'File Manager',
      badge: 'Langkah 2',
      description: 'Upload berkas index.js, package.json, scripts/, dan assets/ ke File Manager.',
      checklistText: 'Semua berkas dan folder assets sudah terunggah ke File Manager',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p className="text-slate-300">Download ZIP dari studio ini dan extract/upload seluruh isinya ke File Manager container Wispbyte.</p>
        </div>
      )
    },
    {
      id: 3,
      title: 'Konfigurasi Variabel Startup (.env)',
      shortTitle: 'Startup Config',
      icon: Key,
      category: 'Environment',
      badge: 'Langkah 3',
      description: 'Mengisi DISCORD_TOKEN dan VOICE_CHANNEL_ID pada tab Startup Variables Wispbyte.',
      checklistText: 'Variabel lingkungan DISCORD_TOKEN dan VOICE_CHANNEL_ID sudah tersimpan',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p className="text-slate-300">Pastikan file <code>.env</code> atau Startup Variables di panel terisi dengan token Discord akun Anda.</p>
        </div>
      )
    },
    {
      id: 4,
      title: 'Nyalakan Server & Verifikasi Log Konsol',
      shortTitle: 'Start Server',
      icon: Play,
      category: 'Eksekusi',
      badge: 'Langkah 4',
      description: 'Menekan tombol Start dan memastikan status konsol menampilkan siaran aktif.',
      checklistText: 'Log konsol menampilkan [BROADCAST ENGINE] dan audio terhubung',
      content: (
        <div className="space-y-4 text-xs leading-relaxed">
          <p className="text-slate-300">Tekan Start pada Console Wispbyte dan perhatikan output boot.</p>
        </div>
      )
    }
  ];

  const currentStepsList = platformType === 'vps' ? vpsStepsList : wispbyteStepsList;
  const currentStepData = currentStepsList.find((s) => s.id === currentStep) || currentStepsList[0];
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / currentStepsList.length) * 100);

  return (
    <div className="space-y-5">
      {/* Top Header & Platform Selector */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Panduan Deploy 24/7 (0 s/d 100% Berhasil)
              </h2>
              <span className="text-xs text-emerald-400 font-mono">· Edisi 2026</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Pilih platform infrastruktur yang Anda gunakan saat ini untuk mendapatkan panduan langkah demi langkah yang tepat dan bebas crash.
            </p>
          </div>

          {/* Sub-view toggle (Steps vs Troubleshoot) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveSubView('steps')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubView === 'steps'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Langkah Berurutan
            </button>
            <button
              onClick={() => setActiveSubView('troubleshoot')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubView === 'troubleshoot'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pusat Solusi Error
            </button>
          </div>
        </div>

        {/* Platform Host Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Target Host:</span>

          <button
            onClick={() => {
              setPlatformType('vps');
              setCurrentStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              platformType === 'vps'
                ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400 font-semibold'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-sky-300" />
            <span>Ubuntu 24.04 Cloud VPS (DomaiNesia · 1 Core 1GB RAM)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 border border-sky-400/40 text-sky-200">Rekomendasi</span>
          </button>

          <button
            onClick={() => {
              setPlatformType('wispbyte');
              setCurrentStep(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              platformType === 'wispbyte'
                ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-400 font-semibold'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-300" />
            <span>Wispbyte Pterodactyl Container</span>
          </button>
        </div>
      </div>

      {activeSubView === 'steps' ? (
        <>
          {/* Stepper Progress Bar */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-semibold text-white">Langkah {currentStep} dari {currentStepsList.length}:</span>
                <span className="text-sky-400 font-medium">{currentStepData.title}</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                {completedCount} dari {currentStepsList.length} Selesai ({progressPercent}%)
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Dots / Buttons */}
            <div className={`grid grid-cols-${currentStepsList.length} gap-1.5 pt-1`}>
              {currentStepsList.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = completedSteps[step.id];

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`py-1.5 px-1 rounded text-center transition-all flex flex-col items-center gap-1 ${
                      isActive
                        ? 'bg-sky-600/20 border border-sky-500/50 text-white'
                        : isCompleted
                        ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400'
                        : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[10px]">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] hidden sm:block truncate max-w-full">
                      {step.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Content Card */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            {/* Step Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <currentStepData.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {currentStepData.badge}: {currentStepData.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              {currentStepData.actionUrl && (
                <a
                  href={currentStepData.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{currentStepData.actionLabel}</span>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                </a>
              )}
            </div>

            {/* Step Dynamic Content */}
            <div className="py-2">
              {currentStepData.content}
            </div>

            {/* Interactive Step Completion Checkbox & Nav Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(completedSteps[currentStep])}
                  onChange={() => toggleStepCompletion(currentStep)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <span className={completedSteps[currentStep] ? 'text-emerald-400 font-semibold' : ''}>
                  {currentStepData.checklistText}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>

                <button
                  onClick={() => setCurrentStep((prev) => Math.min(currentStepsList.length, prev + 1))}
                  disabled={currentStep === currentStepsList.length}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Pusat Solusi Error */
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Daftar Error Paling Umum &amp; Solusi Cepat</span>
            </h3>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
              <strong className="text-rose-400 block font-mono">1. Unhandled Rejection: "delay" argument must be number / Error 2012</strong>
              <p className="text-slate-300">
                <strong>Solusi:</strong> Kode terbaru di repo ini sudah menggunakan fungsi <code>safeDelay</code> dan bypass timer promises di <code>BaseMediaStream.js</code> serta <code>scripts/postinstall.cjs</code>. Jalankan <code>npm install</code> ulang di server Anda untuk menerapkan patch.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
              <strong className="text-amber-400 block font-mono">2. Suara Melengking / Mengecil / Menghilang di Voice Channel</strong>
              <p className="text-slate-300">
                <strong>Solusi:</strong> Diatasi dengan Studio Audio Mastering: flag FFmpeg <code>-application audio</code> (Opus 48kHz stereo CBR 160kbps), SoX 64-bit high-precision resampler, dan brickwall limiter <code>alimiter=limit=0.96</code> serta volume boost +1.22x. Mencegah harmonic distortion/melengking, mencegah AGC ducking, serta mengunci akun selalu On-Mic, unmuted, dan undeafened.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
              <strong className="text-sky-400 block font-mono">3. Lonjakan CPU &gt; 200% di VPS 1 Core</strong>
              <p className="text-slate-300">
                <strong>Solusi:</strong> Opsi <code>-re</code> (real-time 1x rate) dan <code>-threads 2</code> telah ditambahkan ke <code>customInputOptions</code> pada <code>index.js</code>. Beban CPU turun menjadi ~10-25% stabil.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
              <strong className="text-purple-400 block font-mono">4. Server Mati / Killed Saat npm install di VPS 1GB RAM</strong>
              <p className="text-slate-300">
                <strong>Solusi:</strong> Buat <strong>2GB Swap File</strong> dengan perintah pada Langkah 1: <code>fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile && echo '/swapfile none swap sw 0 0' &gt;&gt; /etc/fstab</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
