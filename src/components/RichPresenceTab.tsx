import { useState } from 'react';
import {
  Sparkles,
  Tv,
  Gamepad2,
  Headphones,
  Eye,
  Trophy,
  Check,
  Copy,
  ExternalLink,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Activity
} from 'lucide-react';
import { VoiceConfig, RichPresenceCustomConfig } from '../types';

interface RichPresenceTabProps {
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (config: VoiceConfig) => void;
  onNavigateToEditor?: () => void;
}

export function RichPresenceTab({
  voiceConfig,
  onUpdateVoiceConfig,
  onNavigateToEditor
}: RichPresenceTabProps) {
  const currentRpc: RichPresenceCustomConfig = voiceConfig.richPresence || {
    name: 'YouTube Live Screen-Share',
    type: 'STREAMING',
    url: voiceConfig.liveStream?.youtubeUrl || 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
    details: 'KANA-BOON - ぐらでーしょん (Yamada-kun Lv999 OP)',
    state: 'Menyiarkan Musik 24/7 (480p Boosted)',
    largeImage: 'youtube',
    largeText: '480p Studio Audio Boost (Opus 192k)',
    smallImage: 'live',
    smallText: 'Always ON-MIC Active',
    status: 'online'
  };

  const [rpcState, setRpcState] = useState<RichPresenceCustomConfig>(currentRpc);
  const [appliedToast, setAppliedToast] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleApply = () => {
    onUpdateVoiceConfig({
      ...voiceConfig,
      richPresence: rpcState
    });
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  const handleCopyEnv = () => {
    const snippet = `# Discord Rich Presence (Activity) Settings
ACTIVITY_NAME=${rpcState.name}
ACTIVITY_TYPE=${rpcState.type}
ACTIVITY_URL=${rpcState.url}
ACTIVITY_DETAILS=${rpcState.details}
ACTIVITY_STATE=${rpcState.state}
ACTIVITY_LARGE_IMAGE=${rpcState.largeImage}
ACTIVITY_LARGE_TEXT=${rpcState.largeText}
ACTIVITY_SMALL_IMAGE=${rpcState.smallImage}
ACTIVITY_SMALL_TEXT=${rpcState.smallText}
`;
    navigator.clipboard.writeText(snippet);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Kustomisasi Lengkap Discord Rich Presence (Activity)</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  Live Sync
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Atur status profil resmi akun saat online 24/7. Anda dapat memilih tipe siaran (*Streaming* dengan badge ungu LIVE, *Playing*, atau *Listening*), teks judul, detail lagu, hingga ikon aset.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyEnv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiedToast ? 'Tersalin!' : 'Salin Variabel RPC'}</span>
            </button>
            <button
              onClick={handleApply}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{appliedToast ? 'Tersimpan!' : 'Terapkan Pengaturan'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
        {/* Left: Customization Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Parameter Aktivitas Discord Akun</span>
          </h3>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Pilihan Preset Cepat (One-Click Setup):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setRpcState({
                  name: 'YouTube Live Screen-Share',
                  type: 'STREAMING',
                  url: 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
                  details: 'KANA-BOON - ぐらでーしょん (Yamada-kun Lv999 OP)',
                  state: 'Menyiarkan Musik 24/7 (480p Boosted)',
                  largeImage: 'youtube',
                  largeText: '480p Studio Audio Boost (Opus 192k)',
                  smallImage: 'live',
                  smallText: 'Always ON-MIC Active',
                  status: 'online'
                })}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-left transition-colors text-[11px]"
              >
                <div className="font-semibold text-purple-300">🌸 Yamada OP</div>
                <div className="text-[10px] text-slate-400 truncate">ぐらでーしょん 480p</div>
              </button>

              <button
                type="button"
                onClick={() => setRpcState({
                  name: 'AIZO Broadcast Stream',
                  type: 'STREAMING',
                  url: 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
                  details: 'AIZO (愛蔵) - 480p High-Fidelity',
                  state: 'Audio Priority High (180-195% CPU)',
                  largeImage: 'youtube',
                  largeText: 'Opus 48kHz Stereo Studio Mode',
                  smallImage: 'live',
                  smallText: '24/7 Loop Active',
                  status: 'online'
                })}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-left transition-colors text-[11px]"
              >
                <div className="font-semibold text-sky-300">💎 AIZO Loop</div>
                <div className="text-[10px] text-slate-400 truncate">愛蔵 480p Boosted</div>
              </button>

              <button
                type="button"
                onClick={() => setRpcState({
                  name: 'Lo-Fi Chill Beats 24/7',
                  type: 'LISTENING',
                  url: 'https://open.spotify.com',
                  details: 'Lofi Hip Hop Radio - Beats to relax/study to',
                  state: 'Always ON-MIC Green Ring Active',
                  largeImage: 'spotify',
                  largeText: 'Studio Limiter -0.35dB TruePeak',
                  smallImage: 'headphones',
                  smallText: '48kHz Libopus',
                  status: 'online'
                })}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-left transition-colors text-[11px]"
              >
                <div className="font-semibold text-emerald-300">🎧 Lo-Fi Beats</div>
                <div className="text-[10px] text-slate-400 truncate">Listening Mode</div>
              </button>

              <button
                type="button"
                onClick={() => setRpcState({
                  name: 'Visual Studio Code',
                  type: 'PLAYING',
                  url: '',
                  details: 'Developing discord-247-engine',
                  state: 'Workspace: fadhilbot / 2 Cores 180%',
                  largeImage: 'vscode',
                  largeText: 'TypeScript & Node.js 22 LTS',
                  smallImage: 'code',
                  smallText: 'DAVE E2EE Active',
                  status: 'online'
                })}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-left transition-colors text-[11px]"
              >
                <div className="font-semibold text-amber-300">💻 VS Code</div>
                <div className="text-[10px] text-slate-400 truncate">Developer Mode</div>
              </button>
            </div>
          </div>

          {/* Activity Type Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Tipe Aktivitas (Presence Type):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'STREAMING', label: 'Streaming (LIVE)', icon: Tv, color: 'text-purple-400' },
                { type: 'PLAYING', label: 'Playing Game', icon: Gamepad2, color: 'text-emerald-400' },
                { type: 'LISTENING', label: 'Listening Spotify', icon: Headphones, color: 'text-sky-400' },
                { type: 'WATCHING', label: 'Watching Video', icon: Eye, color: 'text-amber-400' }
              ].map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = rpcState.type === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setRpcState({ ...rpcState, type: opt.type as any })}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${opt.color}`} />
                    <span className="font-semibold text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Nama Aplikasi / Game:</label>
              <input
                type="text"
                value={rpcState.name}
                onChange={(e) => setRpcState({ ...rpcState, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
                placeholder="YouTube Live Screen-Share"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Status Akun (User Status):</label>
              <select
                value={rpcState.status}
                onChange={(e) => setRpcState({ ...rpcState, status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
              >
                <option value="online">Online (Hijau)</option>
                <option value="idle">Idle (Kuning / Istirahat)</option>
                <option value="dnd">Do Not Disturb (Merah)</option>
              </select>
            </div>
          </div>

          {/* Details & State */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Baris Detail (Judul Lagu / Aktivitas):</label>
            <input
              type="text"
              value={rpcState.details}
              onChange={(e) => setRpcState({ ...rpcState, details: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
              placeholder="KANA-BOON - ぐらでーしょん (Gradation)"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Baris State (Lokasi / Sub-Status):</label>
            <input
              type="text"
              value={rpcState.state}
              onChange={(e) => setRpcState({ ...rpcState, state: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
              placeholder="Menyiarkan Musik 24/7 (480p Boosted)"
            />
          </div>

          {/* Stream URL */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">URL Streaming (Untuk Badge LIVE Ungu):</label>
            <input
              type="text"
              value={rpcState.url}
              onChange={(e) => setRpcState({ ...rpcState, url: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none"
              placeholder="https://youtu.be/..."
            />
          </div>

          {/* Large Image & Small Image Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Asset Gambar Besar (Key &amp; Tooltip):</label>
              <input
                type="text"
                value={rpcState.largeImage}
                onChange={(e) => setRpcState({ ...rpcState, largeImage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                placeholder="youtube"
              />
              <input
                type="text"
                value={rpcState.largeText}
                onChange={(e) => setRpcState({ ...rpcState, largeText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs mt-1"
                placeholder="480p Studio Audio Boost"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Asset Gambar Kecil (Badge Icon):</label>
              <input
                type="text"
                value={rpcState.smallImage}
                onChange={(e) => setRpcState({ ...rpcState, smallImage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                placeholder="live"
              />
              <input
                type="text"
                value={rpcState.smallText}
                onChange={(e) => setRpcState({ ...rpcState, smallText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs mt-1"
                placeholder="Always ON-MIC Active"
              />
            </div>
          </div>
        </div>

        {/* Right: Pixel-Perfect Live Discord Preview Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              Live Preview Kartu Profil Discord
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% Akurat</span>
          </div>

          {/* Discord Card Mockup */}
          <div className="rounded-2xl bg-[#111214] border border-[#232428] p-4 text-white shadow-2xl font-sans relative overflow-hidden">
            {/* Header banner gradient */}
            <div className="h-16 -mx-4 -mt-4 bg-gradient-to-r from-purple-800 via-indigo-700 to-sky-700 relative">
              <div className="absolute top-2 right-3 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full text-[10px] text-white/90 font-mono">
                <span>DAVE E2EE</span>
              </div>
            </div>

            {/* Avatar & Status Indicator */}
            <div className="relative -mt-8 mb-3 flex items-end justify-between">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#5865F2] border-4 border-[#111214] flex items-center justify-center font-bold text-xl text-white shadow-md">
                  F
                </div>
                <div className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-[#111214] ${
                  rpcState.status === 'online' ? 'bg-[#23a55a]' : rpcState.status === 'idle' ? 'bg-[#f0b232]' : 'bg-[#f23f43]'
                }`} />
              </div>

              {rpcState.type === 'STREAMING' && (
                <div className="bg-[#593695] text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>STREAMING</span>
                </div>
              )}
            </div>

            {/* User display */}
            <div className="border-b border-[#232428] pb-3 mb-3">
              <h4 className="font-bold text-base text-white leading-tight">fadhilbot</h4>
              <p className="text-xs text-[#949ba4] font-mono">fadhilbot#0000</p>
            </div>

            {/* Rich Presence Activity Box */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-[#b5bac1] tracking-wider">
                {rpcState.type === 'STREAMING' ? 'STREAMING DI YOUTUBE' : `SEDANG ${rpcState.type}`}
              </div>

              <div className="flex items-start gap-3 bg-[#1e1f22] p-3 rounded-xl border border-[#2b2d31]">
                {/* Large & Small Asset Icon */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-red-600/90 flex items-center justify-center text-white shadow-inner font-bold text-xs overflow-hidden">
                    <Tv className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 border-2 border-[#1e1f22] flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                    ●
                  </div>
                </div>

                {/* Activity Details */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="font-bold text-sm text-white truncate" title={rpcState.name}>
                    {rpcState.name}
                  </div>
                  <div className="text-xs text-[#dbdee1] truncate font-medium" title={rpcState.details}>
                    {rpcState.details}
                  </div>
                  <div className="text-xs text-[#949ba4] truncate" title={rpcState.state}>
                    {rpcState.state}
                  </div>
                  <div className="text-[11px] text-[#949ba4] font-mono pt-0.5">
                    00:03:42 berlalu
                  </div>
                </div>
              </div>

              {/* Watch Button */}
              {rpcState.type === 'STREAMING' && (
                <a
                  href={rpcState.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-[#2b2d31] hover:bg-[#35373c] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#3b3e45]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tonton Siaran</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
