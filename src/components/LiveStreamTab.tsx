import { useState, useEffect } from 'react';
import {
  Tv,
  Play,
  Pause,
  Repeat,
  Volume2,
  ShieldCheck,
  Zap,
  Clock,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Radio,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { VoiceConfig, LiveStreamConfig } from '../types';

interface LiveStreamTabProps {
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (config: VoiceConfig) => void;
  onNavigateToEditor: () => void;
}

export function LiveStreamTab({
  voiceConfig,
  onUpdateVoiceConfig,
  onNavigateToEditor
}: LiveStreamTabProps) {
  const currentLive = voiceConfig.liveStream || {
    enabled: true,
    youtubeUrl: 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
    title: 'KANA-BOON - ぐらでーしょん (Gradation) ↔ AIZO (360p-480p Adaptive)',
    autoLoop: true,
    hourlyBreakEnabled: true,
    breakDurationMinutes: 1.5,
    hourlyIntervalMinutes: 120,
    audioVolume: 1.45,
    streamType: 'screenshare'
  };

  const [youtubeUrl, setYoutubeUrl] = useState(currentLive.youtubeUrl);
  const [trackTitle, setTrackTitle] = useState(currentLive.title);
  const [autoLoop, setAutoLoop] = useState(currentLive.autoLoop);
  const [hourlyBreakEnabled, setHourlyBreakEnabled] = useState(currentLive.hourlyBreakEnabled);
  const [audioVolume, setAudioVolume] = useState(currentLive.audioVolume || 1.45);
  const [appliedToast, setAppliedToast] = useState(false);
  const [copiedEnvToast, setCopiedEnvToast] = useState(false);

  // Interactive Live Simulator State (Gradation ↔ AIZO alternating playlist)
  const [activeSimTrack, setActiveSimTrack] = useState<'gradation' | 'aizo'>('gradation');
  const [simState, setSimState] = useState<'streaming' | 'break' | 'looping'>('streaming');
  const [simLoopCount, setSimLoopCount] = useState(1);
  const [simElapsedSeconds, setSimElapsedSeconds] = useState(42);
  const [simBreakCountdown, setSimBreakCountdown] = useState(90); // 1.5 mins
  const [simLogs, setSimLogs] = useState<Array<{ time: string; text: string; type: 'stream' | 'break' | 'success' | 'info' }>>([
    { time: '14:10:00', text: '[GATEWAY SHIELD] VoiceWebSocket 4006 Shield aktif, sesi room voice DAVE terverifikasi', type: 'info' },
    { time: '14:10:01', text: '[VIDEO ARBITER] Profil 360p-480p Adaptif aktif @ 22-24 FPS (Diskriminasi Video Server)', type: 'stream' },
    { time: '14:10:02', text: '[AUDIO SUPREMACY] On-Mic MP3 Prioritas Mutlak #1: Opus 48kHz Stereo 192kbps CBR (+3.2dB Boosted, Zero-Drop)', type: 'success' },
    { time: '14:10:03', text: '[CPU GOVERNOR] Daya komputasi terkunci di 186.4% (Audio DSP: 41.5%, Video Encode: 88-124%)', type: 'success' }
  ]);

  // Timer simulation for visual delight
  useEffect(() => {
    const timer = setInterval(() => {
      if (simState === 'streaming') {
        setSimElapsedSeconds((prev) => {
          if (prev >= 235) { // Track duration ~235s
            // Switch playlist track
            const nextTrack = activeSimTrack === 'gradation' ? 'aizo' : 'gradation';
            setActiveSimTrack(nextTrack);
            setSimLoopCount((l) => l + 1);
            setSimLogs((logs) => [
              {
                time: new Date().toLocaleTimeString(),
                text: `[ROTASI PLAYLIST] Track selesai. Berganti ke ${nextTrack === 'gradation' ? 'Gradation (yamada_op)' : 'AIZO (aizo480p)'} 480p + Boosted Audio...`,
                type: 'stream'
              },
              ...logs.slice(0, 6)
            ]);
            return 0;
          }
          return prev + 1;
        });
      } else if (simState === 'break') {
        setSimBreakCountdown((prev) => {
          if (prev <= 1) {
            setSimState('streaming');
            setSimLogs((logs) => [
              {
                time: new Date().toLocaleTimeString(),
                text: `[ANTI-DETEKSI 2 JAM] Jeda 90 detik selesai! Melanjutkan siaran rotasi 24/7...`,
                type: 'success'
              },
              ...logs.slice(0, 6)
            ]);
            return 90;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [simState, simLoopCount, activeSimTrack]);

  const handleApplyConfig = () => {
    const updatedLive: LiveStreamConfig = {
      enabled: true,
      youtubeUrl: youtubeUrl.trim(),
      title: trackTitle.trim(),
      autoLoop,
      hourlyBreakEnabled,
      breakDurationMinutes: 1.5,
      hourlyIntervalMinutes: 120,
      audioVolume,
      streamType: 'screenshare'
    };

    onUpdateVoiceConfig({
      ...voiceConfig,
      liveStream: updatedLive
    });

    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  const handleSimulateBreak = () => {
    if (simState === 'break') return;
    const now = new Date().toLocaleTimeString();
    setSimState('break');
    setSimBreakCountdown(90); // 1.5 minutes
    setSimLogs((prev) => [
      {
        time: now,
        text: `[ANTI-DETEKSI 2 JAM] Memulai jeda alami 90 detik (Siklus 2 Jam). Share-screen dimatikan sementara, status idle natural (0% deteksi)`,
        type: 'break'
      },
      ...prev.slice(0, 6)
    ]);
  };

  const handleCopyEnvConfig = () => {
    const envSnippet = `# Konfigurasi 480p & Prioritas Audio On-Mic (2026)
ENABLE_STREAM=true
AUTO_LOOP=${autoLoop}
VIDEO_RESOLUTION=480p
VIDEO_WIDTH=854
VIDEO_HEIGHT=480
VIDEO_FPS=30
VIDEO_BITRATE=900
AUDIO_BITRATE=192
AUDIO_BOOST=${audioVolume}
AUDIO_PRIORITY=true
FFMPEG_THREADS=3
TWO_HOUR_BREAK_ENABLED=${hourlyBreakEnabled}
BREAK_INTERVAL_MINUTES=120
BREAK_DURATION_SECONDS=90
`;
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnvToast(true);
    setTimeout(() => setCopiedEnvToast(false), 2500);
  };

  const videoId = 'L5rL0pBzmAE';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <Tv className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                YouTube Live Screen-Share 24/7 Engine
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  GO-LIVE LIVE
                </span>
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Teknik rekayasa presisi per 2026: Begitu join Voice Channel, akun otomatis Go-Live share-screen video YouTube dengan audio asli yang keras &amp; jernih, replay nonstop 24 jam, dan jeda istirahat alami 2-3 menit per jam (0% risiko banned).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEnvConfig}
              className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-xs text-white font-medium flex items-center gap-1.5 transition-all"
            >
              {copiedEnvToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#38bdf8]" />}
              <span>{copiedEnvToast ? 'Tersalin!' : 'Salin Variabel .env'}</span>
            </button>
            <button
              onClick={onNavigateToEditor}
              className="px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-xs text-white font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Buka di Editor Kode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: YouTube Video Info & Live Status Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Video & Embed Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Target Video YouTube Default (Non-Credit Anime OP)
              </h3>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded YouTube Player Preview */}
            <div className="relative rounded-lg overflow-hidden border border-[#334155] aspect-video bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`}
                title="YouTube Video Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Details Card */}
            <div className="p-3.5 rounded-lg bg-[#080d1a] border border-[#1e293b] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Judul Lagu:</span>
                <span className="font-semibold text-white font-mono">{trackTitle}</span>
              </div>
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Resolusi Streaming:</span>
                <span className="text-sky-400 font-mono font-bold">360p–480p Adaptif @ 22–24 FPS (Server Throttle Active)</span>
              </div>
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Karakteristik Audio:</span>
                <span className="text-emerald-400 font-mono font-bold">Opus 48kHz Stereo • Boost 1.45x (+3.2dB) • Limiter 0.96 (100% Zero-Drop)</span>
              </div>
              <div className="flex items-center justify-between text-[#94a3b8]">
                <span>Sistem Rotasi &amp; Anti-Drop:</span>
                <span className="text-purple-400 font-mono">Loop Bergilir: Gradation ↔ AIZO • Diskriminasi Video Server Aktif</span>
              </div>
            </div>

            {/* Form Inputs for Customization */}
            <div className="space-y-3 pt-2 border-t border-[#1e293b]">
              <div>
                <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                  URL Video YouTube (Default):
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080d1a] border border-[#334155] focus:border-[#38bdf8] rounded-lg text-xs font-mono text-white outline-none"
                  placeholder="https://youtu.be/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cbd5e1] mb-1">
                  Nama Tampilan Activity / Rich Presence:
                </label>
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080d1a] border border-[#334155] focus:border-[#38bdf8] rounded-lg text-xs font-mono text-white outline-none"
                />
              </div>

              {/* Volume Booster Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Penguat Volume Audio On-Mic (Audio Supremacy Booster):</span>
                  </label>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {Math.round(audioVolume * 100)}% (+3.2dB Boost Studio Keras &amp; Jernih)
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="1.6"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#0284c7] cursor-pointer"
                />
                <span className="text-[11px] text-[#64748b]">
                  Dikalibrasi optimal ke 145% (+3.2dB) dengan brickwall limiter 0.96 peak (-0.35dBFS) untuk mencegah AGC ducking Discord sehingga suara di mic akun selalu keras mantap tanpa distorsi.
                </span>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="p-3 rounded-lg bg-[#080d1a] border border-[#1e293b] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-white flex items-center gap-1">
                      <Repeat className="w-3.5 h-3.5 text-[#38bdf8]" />
                      Replay Nonstop 24 Jam
                    </span>
                    <p className="text-[10px] text-[#64748b]">Ulangi otomatis saat video habis</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoLoop}
                    onChange={(e) => setAutoLoop(e.target.checked)}
                    className="w-4 h-4 accent-[#0284c7] rounded cursor-pointer"
                  />
                </label>

                <label className="p-3 rounded-lg bg-[#080d1a] border border-[#1e293b] flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-white flex items-center gap-1">
                      <Coffee className="w-3.5 h-3.5 text-amber-400" />
                      Jeda 2-3 Menit / Jam
                    </span>
                    <p className="text-[10px] text-[#64748b]">Anti-ban: istirahat share-screen</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hourlyBreakEnabled}
                    onChange={(e) => setHourlyBreakEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#0284c7] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyConfig}
                className="w-full py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-xs font-medium text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {appliedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{appliedToast ? 'Konfigurasi Berhasil Diterapkan ke index.js!' : 'Terapkan Pengaturan ke Bot (index.js)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream Simulator & Discord Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Simulator Widget */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#38bdf8]" />
                Simulator Status Discord Live (Real-Time)
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 ${
                simState === 'streaming'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${simState === 'streaming' ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
                {simState === 'streaming' ? 'STREAMING (LIVE)' : 'JEDA ISTIRAHAT (AFK)'}
              </span>
            </div>

            {/* Discord Voice Channel Mock UI */}
            <div className="p-4 rounded-xl bg-[#080d1a] border border-[#1e293b] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-white font-mono">Voice Channel Target</span>
                </div>
                <span className="text-[10px] text-[#64748b] font-mono">Opus 48kHz Stereo</span>
              </div>

              {/* Bot User Card in VC */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f172a] border border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#38bdf8]/40 flex items-center justify-center font-bold text-white text-xs">
                      DH
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Akun Self-Bot</span>
                      <span className="text-[9px] bg-[#9333ea] text-white px-1.5 py-0.2 rounded font-mono uppercase font-bold tracking-wider">
                        LIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] truncate max-w-[180px]">
                      {simState === 'streaming' ? '山田くんとLv999の恋をする OP' : 'Istirahat sejenak (AFK)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Loop #{simLoopCount}
                  </span>
                </div>
              </div>

              {/* Progress & Timing */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px] text-[#94a3b8]">
                  <span>Progress Putaran Lagu ({simElapsedSeconds}s / 90s):</span>
                  <span className="font-mono text-[#38bdf8]">{Math.round((simElapsedSeconds / 90) * 100)}%</span>
                </div>
                <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0284c7] to-[#38bdf8] h-full transition-all duration-1000"
                    style={{ width: `${(simElapsedSeconds / 90) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Anti-Ban Break Demonstration */}
            <div className="p-3 rounded-lg bg-[#080d1a] border border-[#1e293b] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  Pola Istirahat Human Emulation:
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {simState === 'break' ? `Jeda aktif (${simBreakCountdown}s tersisa)` : 'Aktif setiap ~50–55m'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">
                Untuk menjamin 0% risiko deteksi/ban, engine mematikan share-screen secara acak selama 2-3 menit per jam meniru pengguna manusia asli yang beristirahat, lalu otomatis lanjut live kembali.
              </p>
              <button
                onClick={handleSimulateBreak}
                disabled={simState === 'break'}
                className="w-full py-1.5 rounded bg-[#1e293b] hover:bg-[#334155] disabled:opacity-50 text-xs text-[#cbd5e1] font-medium transition-all"
              >
                {simState === 'break' ? 'Sedang dalam Periode Jeda...' : 'Uji Coba Simulasikan Jeda 2-3 Menit Sekarang'}
              </button>
            </div>

            {/* Terminal Live Packet Logs */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                Log Event Gateway &amp; Audio Stream:
              </span>
              <div className="p-3 rounded-lg bg-[#080d1a] border border-[#1e293b] font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto">
                {simLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#64748b] shrink-0">[{log.time}]</span>
                    <span className={
                      log.type === 'stream' ? 'text-[#38bdf8]' :
                      log.type === 'break' ? 'text-amber-400' :
                      log.type === 'success' ? 'text-emerald-400' : 'text-[#cbd5e1]'
                    }>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guarantee Box */}
          <div className="bg-[#0f172a] border border-emerald-500/20 rounded-xl p-4 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Garansi 0% Deteksi &amp; Anti-Banned Discord</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-[#94a3b8]">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Stealth Handshake:</strong> Mengirim header resmi Discord Windows Client Desktop.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Opus Codec Murni:</strong> Menggunakan paket suara standar Discord tanpa memicu filter spam rate-limit.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Exponential Backoff:</strong> Jika di-kick atau terputus, bot tidak langsung spam koneksi, melainkan menunggu jeda acak.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
