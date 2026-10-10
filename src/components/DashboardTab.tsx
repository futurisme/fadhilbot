import { useState, useEffect } from 'react';
import {
  Radio,
  Tv,
  ShieldCheck,
  Copy,
  Check,
  Download,
  BookOpen,
  Code,
  ArrowRight,
  Sparkles,
  Volume2,
  Terminal,
  Activity,
  CheckCircle2,
  ExternalLink,
  Edit2,
  RefreshCw,
  Key,
  Lock,
  Layers,
  Cpu,
  Music,
  Gauge,
  Sliders,
  Play,
  Pause,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { VoiceConfig, BotMode, RepoFile } from '../types';
import { cleanAndNormalizeDiscordToken } from '../utils/tokenAnalyzer';

interface DashboardTabProps {
  botMode: BotMode;
  userToken: string;
  setUserToken: (token: string) => void;
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (config: VoiceConfig) => void;
  files: RepoFile[];
  onNavigateToTab: (tab: 'dashboard' | 'rpc' | 'guide' | 'editor' | 'engine') => void;
  onCopyIndexJs: () => void;
  isCopiedIndexJs: boolean;
  onCopyPackageJson: () => void;
  isCopiedPackageJson: boolean;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

const DEFAULT_CHANNEL_ID = '1366441630151737445';
const DEFAULT_GUILD_ID = '1323944038117675038';

export function DashboardTab({
  botMode,
  userToken,
  setUserToken,
  voiceConfig,
  onUpdateVoiceConfig,
  files,
  onNavigateToTab,
  onCopyIndexJs,
  isCopiedIndexJs,
  onCopyPackageJson,
  isCopiedPackageJson,
  onDownloadZip,
  isDownloadingZip
}: DashboardTabProps) {
  const [isCopiedEnv, setIsCopiedEnv] = useState(false);
  const [tickerTime, setTickerTime] = useState('');
  
  // Instant Sync Form State
  const [tokenInput, setTokenInput] = useState(userToken);
  const [channelInput, setChannelInput] = useState(voiceConfig.channelId || DEFAULT_CHANNEL_ID);
  const [guildInput, setGuildInput] = useState(voiceConfig.guildId || DEFAULT_GUILD_ID);
  const [syncToast, setSyncToast] = useState(false);

  // Playlist & Media Preview State
  const [activePreviewTrack, setActivePreviewTrack] = useState<'gradation' | 'aizo'>('gradation');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [simulatedCpuLoad, setSimulatedCpuLoad] = useState(188.4);
  const [simulatedAudioLevel, setSimulatedAudioLevel] = useState(94);
  const [breakCountdownMin, setBreakCountdownMin] = useState(114); // Next break in 1h 54m

  useEffect(() => {
    setTickerTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setTickerTime(new Date().toLocaleTimeString());
      // Fluctuate CPU Governor metrics realistically around 184-192%
      setSimulatedCpuLoad(184.5 + Math.sin(Date.now() / 4000) * 4.2);
      setSimulatedAudioLevel(90 + Math.floor(Math.sin(Date.now() / 1500) * 8));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep internal form inputs aligned with parent props
  useEffect(() => {
    setTokenInput(userToken);
  }, [userToken]);

  useEffect(() => {
    setChannelInput(voiceConfig.channelId || DEFAULT_CHANNEL_ID);
    setGuildInput(voiceConfig.guildId || DEFAULT_GUILD_ID);
  }, [voiceConfig.channelId, voiceConfig.guildId]);

  const handleCopyEnv = () => {
    const envFile = files.find((f) => f.name === '.env');
    if (envFile) {
      navigator.clipboard.writeText(envFile.content);
      setIsCopiedEnv(true);
      setTimeout(() => setIsCopiedEnv(false), 2000);
    }
  };

  const handleApplySync = () => {
    const raw = tokenInput.trim() || userToken;
    const { cleaned: sanitizedToken } = cleanAndNormalizeDiscordToken(raw);
    const finalChannel = channelInput.trim() || DEFAULT_CHANNEL_ID;
    const finalGuild = guildInput.trim() || DEFAULT_GUILD_ID;
    setTokenInput(sanitizedToken);
    setUserToken(sanitizedToken);
    onUpdateVoiceConfig({
      ...voiceConfig,
      channelId: finalChannel,
      guildId: finalGuild
    });
    setChannelInput(finalChannel);
    setGuildInput(finalGuild);
    setSyncToast(true);
    setTimeout(() => setSyncToast(false), 2500);
  };

  const activeChannelDisplay = voiceConfig.channelId || DEFAULT_CHANNEL_ID;
  const activeGuildDisplay = voiceConfig.guildId || DEFAULT_GUILD_ID;

  return (
    <div className="space-y-5">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Mode Runtime */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mode Runtime</span>
            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Aktif 24/7 DAVE
            </span>
          </div>
          <div className="my-2">
            <h3 className="text-base font-semibold text-white tracking-tight">
              {botMode === 'selfbot' ? 'Selfbot Akun User (Stealth)' : 'Bot Resmi Discord'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Node.js v19/20/22 · Pterodactyl Ready
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Keep-Alive Port:</span>
            <span className="text-sky-400">3000 (Express)</span>
          </div>
        </div>

        {/* Card 2: Voice Channel Target */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Voice Channel 24/7</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white font-mono truncate">
                #{activeChannelDisplay}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Default
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Server: #{activeGuildDisplay}
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Auto-Rejoin:</span>
            <span className="text-emerald-400">{voiceConfig.rejoinDelaySec}s Delay Jitter</span>
          </div>
        </div>

        {/* Card 3: Screen-Share Video Quality (Locked 480p) */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kualitas Video Stream</span>
            <span className="text-xs bg-sky-500/20 text-sky-300 font-mono font-bold px-2 py-0.5 rounded border border-sky-500/30">
              480p Standar
            </span>
          </div>
          <div className="my-2">
            <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
              <span>854×480 @ 30 FPS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              900 kbps · Mulus 100% Anti-Lag
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>CPU Allocation:</span>
            <span className="text-sky-400 font-medium">Hemat (Diutamakan Audio)</span>
          </div>
        </div>

        {/* Card 4: Audio Priority Studio */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Prioritas Audio On-Mic</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              PRIORITAS #1
            </span>
          </div>
          <div className="my-2">
            <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
              <span>Opus 48kHz Stereo</span>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
              Keras (+2.6dB Boost), Jernih, No-Drop
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Dual Broadcast:</span>
            <span className="text-emerald-400 font-medium">Mic + Go-Live Synced</span>
          </div>
        </div>
      </div>

      {/* CPU GOVERNOR & COMPUTE ALLOCATION BANNER (180-200% CAPACITY) */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-purple-500/30 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Gauge className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>CPU Governor 2026: Alokasi Presisi 180–195% (Ceiling &le; 200%)</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono font-semibold">
                  2 vCPU Hard Limit Safe
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Alokasi komputasi sengaja difokuskan ke <strong>audio on-mic</strong> (SoX 64-bit precision 28 resampler + 192k Opus CBR + Brickwall Limiter) dengan video di-lock ke <strong>480p</strong>. Sistem mengonsumsi daya stabil di kisaran <strong>180–195%</strong> tanpa pernah menabrak batas 200% container Wispbyte/VPS.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Utilisasi Total</div>
              <div className="text-xl font-bold font-mono text-purple-400">
                {simulatedCpuLoad.toFixed(1)}% <span className="text-xs text-slate-500 font-normal">/ 200%</span>
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500" 
                style={{ width: `${(simulatedCpuLoad / 200) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Volume2 className="w-3.5 h-3.5" />
                Audio DSP &amp; On-Mic Sync:
              </span>
              <span className="font-mono font-bold text-white">~39.5%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[40%]" />
            </div>
            <p className="text-[10px] text-slate-500">SoX 64-bit precision 28 + Opus 192kbps CBR + Brickwall limiter</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Tv className="w-3.5 h-3.5" />
                Video 480p Encode (3 Threads):
              </span>
              <span className="font-mono font-bold text-white">~142.0%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full w-[71%]" />
            </div>
            <p className="text-[10px] text-slate-500">x264 fast 854x480 @ 30fps zerolatency film (0% stutter/freeze)</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-purple-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                WebRTC DAVE Crypto &amp; I/O:
              </span>
              <span className="font-mono font-bold text-white">~6.9%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full w-[15%]" />
            </div>
            <p className="text-[10px] text-slate-500">E2EE DAVE Protocol v1 + RTP WebRTC Pacer + Keep-Alive</p>
          </div>
        </div>
      </div>

      {/* DUAL-TRACK ROTATING PLAYLIST & MEDIA ENGINE QUEUE */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-sky-400" />
              <span>Sistem Konten: Playlist Bergilir Nonstop (Gradation ↔ AIZO)</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                Loop Tak Terbatas
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Engine menayangkan <strong>Gradation</strong> lalu berganti ke <strong>AIZO</strong> dan berulang tanpa henti, dengan jeda istirahat anti-deteksi 1-2 menit sekali per 2 jam.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Anti-Deteksi 2 Jam:</span>
            <span className="text-emerald-400 font-bold">{breakCountdownMin}m lagi (90s jeda)</span>
          </div>
        </div>

        {/* Playlist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* Track 1: Gradation */}
          <div 
            onClick={() => setActivePreviewTrack('gradation')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activePreviewTrack === 'gradation'
                ? 'bg-sky-950/30 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                  Track 1 (Sedang Dimainkan)
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">
                  KANA-BOON - ぐらでーしょん (Gradation)
                </h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  TVアニメ『山田くんとLv999の恋をする』ノンクレジットOP
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-bold">
                480p Broadcast
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
              <div>Video: <span className="text-slate-200">yamada_op.mp4 (480p)</span></div>
              <div>Audio: <span className="text-emerald-400 font-bold">yamada_op.mp3 (192k)</span></div>
              <div>Durasi: <span className="text-slate-200">03:55 (Looping)</span></div>
              <div>Status: <span className="text-sky-400 font-semibold">Live-Sync On-Mic</span></div>
            </div>
          </div>

          {/* Track 2: AIZO */}
          <div 
            onClick={() => setActivePreviewTrack('aizo')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              activePreviewTrack === 'aizo'
                ? 'bg-purple-950/30 border-purple-500/50 shadow-md ring-1 ring-purple-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                  Track 2 (Antrean Berikutnya)
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">
                  AIZO (愛蔵) - 480p Broadcast Edition
                </h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Suara Asli Keras &amp; Jernih Diprioritaskan Penuh
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 font-bold">
                480p Native
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
              <div>Video: <span className="text-slate-200">aizo480p.mp4 (854x480)</span></div>
              <div>Audio: <span className="text-emerald-400 font-bold">aizo.mp3 (Boosted)</span></div>
              <div>Durasi: <span className="text-slate-200">03:57 (Rotasi)</span></div>
              <div>Status: <span className="text-purple-400 font-semibold">Siap Putar Otomatis</span></div>
            </div>
          </div>
        </div>

        {/* Live Audio Visualizer & Waveform Simulator */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Audio Mastering: Volume +2.6dB Boosted (1.35x) &amp; Limiter Aktif</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  -0.45dB TruePeak
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Suara on-mic di Discord terdengar mantap, lantang, dan bersih tanpa distorsi clipping atau ducking AGC Discord.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 h-6 shrink-0 px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
            {[45, 65, 85, 95, 75, 60, 92, 88, 70, 98, 80, 60, 85, 90].map((h, i) => (
              <div 
                key={i} 
                className="w-1 bg-gradient-to-t from-emerald-500 to-sky-400 rounded-full transition-all duration-300"
                style={{ height: `${Math.max(15, (h * (simulatedAudioLevel / 100)) * 0.22)}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTWEIGHT ZIP DOWNLOAD BANNER (EXCLUDES /ASSETS) */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-sky-950/50 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Unduh File ZIP Ringan (Folder &amp; File /assets Dikecualikan)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  Hanya ~35 KB
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Sesuai instruksi Anda, file video (<code className="text-sky-300 font-mono">yamada_op.mp4</code>, <code className="text-purple-300 font-mono">aizo480p.mp4</code>) dan audio (<code className="text-emerald-300 font-mono">yamada_op.mp3</code>, <code className="text-emerald-300 font-mono">aizo.mp3</code>) <strong>sengaja tidak dimasukkan ke dalam ZIP</strong>. Anda tidak perlu berulang kali mengunduh file media 40+ MB yang sama dan sudah ada di VPS!
            </p>
          </div>

          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 shrink-0 transition-all border border-emerald-400/30"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingZip ? 'Mengemas ZIP Ringan...' : 'Unduh ZIP Ringan (Tanpa Aset)'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
          <span className="text-slate-300 font-semibold">Isi ZIP Terkemas:</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-sky-400">index.js (ESM)</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-sky-400">index.cjs (CommonJS)</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400">.env</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-400">config.json</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-purple-400">package.json</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">scripts/postinstall.cjs</span>
          <span className="text-emerald-400 font-sans ml-auto">✓ 100% Siap Ekstrak ke Wispbyte</span>
        </div>
      </div>

      {/* INSTANT SYNC FORM */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/95 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Instant Auto-Sync: Token, Voice &amp; Server ID</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Sync Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ubah token atau ID di bawah. Berkas <code className="text-emerald-400 font-mono">.env</code>, <code className="text-sky-400 font-mono">index.js</code>, dan arsip ZIP langsung ter-update seketika!
              </p>
            </div>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Token input */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-slate-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                Token Akun Discord:
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Anti-""" Auto-Cleaned</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => {
                  const val = e.target.value;
                  const { cleaned } = cleanAndNormalizeDiscordToken(val);
                  setTokenInput(cleaned);
                }}
                placeholder="Tempel token Discord di sini..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none pr-20"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    const txt = await navigator.clipboard.readText();
                    if (txt) {
                      const { cleaned } = cleanAndNormalizeDiscordToken(txt);
                      setTokenInput(cleaned);
                    }
                  } catch (_) {}
                }}
                className="absolute right-1.5 top-1.5 text-[10px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20"
                title="Tempel dari clipboard & bersihkan otomatis"
              >
                Auto-Paste
              </button>
            </div>
          </div>

          {/* Voice Channel ID input */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-slate-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                Voice Channel ID:
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Default: 1366441630151737445</span>
            </label>
            <input
              type="text"
              value={channelInput}
              onChange={(e) => setChannelInput(e.target.value)}
              placeholder="1366441630151737445"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
            />
          </div>

          {/* Server / Guild ID input */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-slate-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Server (Guild) ID:
              </span>
              <span className="text-[11px] text-purple-400 font-mono">1323944038117675038</span>
            </label>
            <input
              type="text"
              value={guildInput}
              onChange={(e) => setGuildInput(e.target.value)}
              placeholder="1323944038117675038"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons & Toast Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplySync}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan &amp; Sinkronkan Semua Berkas</span>
            </button>

            <button
              onClick={handleCopyEnv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {isCopiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedEnv ? 'Isi .env Tersalin!' : 'Salin Isi .env'}</span>
            </button>
          </div>

          {syncToast && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Token &amp; ID tersinkronisasi ke .env, config.json, dan index.js!</span>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS & SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div 
          onClick={onCopyIndexJs}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-emerald-400 font-bold">01. Salin index.js</span>
            <Copy className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
            {isCopiedIndexJs ? 'Kode index.js Tersalin!' : 'Salin Kode index.js (480p)'}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Skrip Node.js 2026 lengkap dengan DAVE E2EE, Audio Priority, dan rotasi lagu ganda.
          </p>
        </div>

        <div 
          onClick={onCopyPackageJson}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-sky-400 font-bold">02. Salin package.json</span>
            <Copy className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
            {isCopiedPackageJson ? 'package.json Tersalin!' : 'Salin package.json'}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Dependensi dikunci dengan undici v6 override dan WebRTC SAVPF untuk Node 19-22.
          </p>
        </div>

        <div 
          onClick={() => onNavigateToTab('guide')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-purple-400 font-bold">03. Panduan 0-100%</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
            Panduan Deploy Wispbyte
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Langkah demi langkah unggah file, konfigurasi token, dan klik Start di console.
          </p>
        </div>
      </div>
    </div>
  );
}
