import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, Copy, Check, Radio, Play, Sliders, ArrowRight } from 'lucide-react';
import { VoiceConfig } from '../types';

interface VoiceStudioTabProps {
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (config: VoiceConfig) => void;
  onNavigateToEditor: () => void;
  onNavigateToStream?: () => void;
}

export function VoiceStudioTab({ voiceConfig, onUpdateVoiceConfig, onNavigateToEditor, onNavigateToStream }: VoiceStudioTabProps) {
  const [channelId, setChannelId] = useState(voiceConfig.channelId);
  const [guildId, setGuildId] = useState(voiceConfig.guildId || '');
  const [selfDeaf, setSelfDeaf] = useState(voiceConfig.selfDeaf);
  const [selfMute, setSelfMute] = useState(voiceConfig.selfMute);
  const [autoRejoin, setAutoRejoin] = useState(voiceConfig.autoRejoin);
  const [rejoinDelaySec, setRejoinDelaySec] = useState(voiceConfig.rejoinDelaySec);
  const [appliedToast, setAppliedToast] = useState(false);

  // Simulator state
  const [simVoiceState, setSimVoiceState] = useState<'connected' | 'rejoining' | 'disconnected'>('connected');
  const [simCountdown, setSimCountdown] = useState(0);
  const [simLogs, setSimLogs] = useState<Array<{ time: string; text: string; type: 'info' | 'warn' | 'success' }>>([
    { time: '14:00:00', text: 'Voice 24/7 DAVE Engine aktif (WebRTC SAVPF E2EE protocol)', type: 'info' },
    { time: '14:00:03', text: 'Berhasil terhubung ke Voice Channel target (Always ON-MIC: ACTIVE, Speaking: ON, Self-Deaf: FALSE)', type: 'success' }
  ]);

  const DEFAULT_CHANNEL_ID = '1366441630151737445';
  const DEFAULT_GUILD_ID = '1323944038117675038';

  const handleApply = () => {
    const finalChannel = channelId.trim() || DEFAULT_CHANNEL_ID;
    const finalGuild = guildId.trim() || DEFAULT_GUILD_ID;
    const updated: VoiceConfig = {
      channelId: finalChannel,
      guildId: finalGuild,
      selfDeaf,
      selfMute,
      autoRejoin,
      rejoinDelaySec,
      liveStream: voiceConfig.liveStream
    };
    setChannelId(finalChannel);
    setGuildId(finalGuild);
    onUpdateVoiceConfig(updated);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  const handleSimulateKick = () => {
    if (simVoiceState === 'rejoining') return;

    const jitter = Math.floor(Math.random() * 4) + 3;
    const totalDelay = rejoinDelaySec + jitter;
    const now = new Date().toLocaleTimeString();

    setSimVoiceState('rejoining');
    setSimCountdown(totalDelay);

    setSimLogs((prev) => [
      {
        time: now,
        text: `[EVENT] Akun dikeluarkan/disconnect dari VC! Pemicu Auto-Rejoin diaktifkan.`,
        type: 'warn'
      },
      {
        time: now,
        text: `[ANTI-BAN SHIELD] Menunggu ${totalDelay} detik (${rejoinDelaySec}s base + ${jitter}s random jitter) sebelum rejoin...`,
        type: 'info'
      },
      ...prev.slice(0, 5)
    ]);

    // Timer simulation
    let currentCount = totalDelay;
    const interval = setInterval(() => {
      currentCount--;
      setSimCountdown(currentCount);

      if (currentCount <= 0) {
        clearInterval(interval);
        setSimVoiceState('connected');
        setSimLogs((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            text: `[SUKSES] Berhasil rejoin otomatis ke Voice Channel! Koneksi kembali normal.`,
            type: 'success'
          },
          ...prev.slice(0, 5)
        ]);
      }
    }, 1000);
  };

  const isChannelIdValid = channelId.trim() === '' || /^\d{17,20}$/.test(channelId.trim());

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 md:p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-[#0284c7]/10 border border-[#0284c7]/20 text-[#38bdf8]">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Voice Chat 24/7 &amp; Smart Auto-Rejoin Engine (2026)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-2xl mt-1">
              Menjaga akun tetap nongkrong di Voice Channel server Discord 24 jam penuh. Jika koneksi terputus atau akun di-kick, sistem otomatis melakukan <strong className="text-emerald-400">rejoin dengan anti-spam exponential jitter</strong> agar aman 100% dari banned.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleApply}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
                appliedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
              }`}
            >
              {appliedToast ? <Check className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
              <span>{appliedToast ? 'Tersimpan ke Kode!' : 'Terapkan Pengaturan Voice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Channel & Server Inputs */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#38bdf8]" />
              Metode Penentuan Voice Channel &amp; Server
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Auto-Resolve Guild
            </span>
          </div>

          {/* Voice Channel ID Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Voice Channel ID</span>
                <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-[#64748b] font-mono">Variabel: VOICE_CHANNEL_ID</span>
            </div>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="1366441630151737445 (Default otomatis jika kosong)"
              className={`w-full bg-[#080d1a] border rounded-lg px-3.5 py-2 text-xs font-mono text-white focus:outline-none ${
                isChannelIdValid ? 'border-[#1e293b] focus:border-[#38bdf8]' : 'border-rose-500 text-rose-300'
              }`}
            />
            {!isChannelIdValid && (
              <p className="text-[11px] text-rose-400">
                Format Channel ID harus berupa 17-20 digit angka snowflake Discord.
              </p>
            )}
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Default Otomatis:</strong> Jika dibiarkan kosong, sistem otomatis memakai Voice Channel <code className="text-white font-mono bg-black/40 px-1 rounded">1366441630151737445</code>.
              </span>
            </p>
          </div>

          {/* Optional Guild ID Input */}
          <div className="space-y-1.5 pt-2 border-t border-[#1e293b]">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#94a3b8]">
                Server (Guild) ID <span className="text-[#64748b] font-normal">(Default otomatis jika kosong)</span>
              </label>
              <span className="text-[11px] text-[#64748b] font-mono">Variabel: VOICE_GUILD_ID</span>
            </div>
            <input
              type="text"
              value={guildId}
              onChange={(e) => setGuildId(e.target.value)}
              placeholder="1323944038117675038 (Default otomatis jika kosong)"
              className="w-full bg-[#080d1a] border border-[#1e293b] rounded-lg px-3.5 py-2 text-xs font-mono text-[#cbd5e1] focus:outline-none focus:border-[#38bdf8]"
            />
            <p className="text-[11px] text-[#64748b] flex items-center gap-1">
              <span>Default Server ID: <code className="text-slate-300 font-mono">1323944038117675038</code>.</span>
            </p>
          </div>

          {/* Safe Guardrail Toggles */}
          <div className="pt-2 border-t border-[#1e293b] space-y-3">
            <h4 className="text-xs font-semibold text-white">Parameter Keamanan &amp; Efisiensi Wispbyte:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Self-Deaf Toggle */}
              <div
                onClick={() => setSelfDeaf(!selfDeaf)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                  selfDeaf ? 'bg-[#080d1a] border-emerald-500/40 text-white' : 'bg-[#080d1a] border-[#1e293b] text-[#94a3b8]'
                }`}
              >
                <div className={`p-1.5 rounded-md mt-0.5 ${selfDeaf ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1e293b] text-[#64748b]'}`}>
                  <VolumeX className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>Self-Deafen (Tuli Mandiri)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Rekomendasi</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    Menghemat 99% bandwidth &amp; CPU di container Wispbyte serta mencegah deteksi voice traffic.
                  </p>
                </div>
              </div>

              {/* Self-Mute Toggle */}
              <div
                onClick={() => setSelfMute(!selfMute)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                  selfMute ? 'bg-[#080d1a] border-emerald-500/40 text-white' : 'bg-[#080d1a] border-[#1e293b] text-[#94a3b8]'
                }`}
              >
                <div className={`p-1.5 rounded-md mt-0.5 ${selfMute ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1e293b] text-[#64748b]'}`}>
                  <MicOff className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>Self-Mute (Bisu Mandiri)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded">Aman Ban</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">
                    Mencegah transmisi paket microphone palsu yang memicu filter spam Discord.
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-Rejoin Parameters */}
            <div className="p-3.5 bg-[#080d1a] border border-[#1e293b] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Auto-Rejoin Otomatis jika Terputus / Di-Kick</div>
                  <p className="text-[11px] text-[#94a3b8]">
                    Memakai event <code>voiceStateUpdate</code> untuk mendeteksi pemutusan secara instan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRejoin(!autoRejoin)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${autoRejoin ? 'bg-emerald-600' : 'bg-[#1e293b]'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${autoRejoin ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              {autoRejoin && (
                <div className="pt-2 border-t border-[#1e293b] space-y-1.5">
                  <div className="flex justify-between text-xs text-[#94a3b8] font-mono">
                    <span>Jeda Dasar Rejoin (Anti-Spam Delay):</span>
                    <span className="text-[#38bdf8] font-bold">{rejoinDelaySec} Detik (+ Random Jitter 3-6s)</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={rejoinDelaySec}
                    onChange={(e) => setRejoinDelaySec(Number(e.target.value))}
                    className="w-full accent-[#38bdf8] bg-[#1e293b] rounded h-1.5 cursor-pointer"
                  />
                  <p className="text-[10px] text-[#64748b]">
                    Anti-Ban Shield: Jeda ini mencegah bot mengirim ratusan reconnect request dalam hitungan detik saat moderator server melakukan kick, sehingga akun tidak terkena rate-limit lock.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Simulator & Guide */}
        <div className="space-y-6">
          {/* Simulator Box */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Simulasi Auto-Rejoin Realtime
                </h3>
                <span className="text-[10px] font-mono text-[#64748b]">@discordjs/voice</span>
              </div>

              {/* Status Indicator */}
              <div className="p-3.5 bg-[#080d1a] border border-[#1e293b] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${simVoiceState === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <div>
                    <div className="text-[11px] text-[#64748b]">Status Voice Akun</div>
                    <div className="text-xs font-bold text-white uppercase font-mono">
                      {simVoiceState === 'connected' ? (
                        <span className="text-emerald-400">CONNECTED (24/7)</span>
                      ) : (
                        <span className="text-amber-400">REJOINING ({simCountdown}s)</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono">
                  <span className="text-[#64748b] block">Channel Target:</span>
                  <span className="text-[#38bdf8] truncate max-w-[100px] block">
                    {channelId ? `#${channelId.slice(0, 8)}...` : 'Belum diatur'}
                  </span>
                </div>
              </div>

              {/* Action test button */}
              <button
                onClick={handleSimulateKick}
                disabled={simVoiceState === 'rejoining'}
                className="w-full mt-3 py-2 px-3 text-xs bg-[#1e293b] hover:bg-[#334155] disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulasi Akun Terputus / Di-Kick</span>
              </button>
            </div>

            {/* Live Simulation Log */}
            <div className="mt-4 pt-3 border-t border-[#1e293b]">
              <div className="text-[10px] text-[#64748b] font-mono mb-1.5">Log Event Voice:</div>
              <div className="space-y-1 font-mono text-[10px] max-h-36 overflow-y-auto">
                {simLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[#94a3b8] leading-tight">
                    <span className="text-[#64748b] shrink-0">[{log.time}]</span>
                    <span className={log.type === 'warn' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-[#38bdf8]'}>
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Guide on how to copy channel ID in Discord */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#38bdf8]" />
              Cara Mengambil Voice Channel ID di Discord
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#94a3b8] leading-relaxed">
              <li>
                Di Discord, buka <strong className="text-white">User Settings</strong> &gt; <strong className="text-white">Advanced</strong>.
              </li>
              <li>
                Nyalakan toggle <strong className="text-emerald-400">Developer Mode</strong>.
              </li>
              <li>
                Cari Voice Channel target di server Discord manapun yang ingin Anda masuki.
              </li>
              <li>
                Klik kanan nama channel tersebut, lalu klik <strong className="text-[#38bdf8]">Copy Channel ID</strong> (Salin ID Saluran).
              </li>
              <li>
                Tempelkan ID tersebut ke kolom di atas lalu klik <strong className="text-white">Terapkan Pengaturan Voice</strong>!
              </li>
            </ol>
          </div>

          {/* YouTube Live Screen-Share Promotion Card */}
          {onNavigateToStream && (
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-[#6366f1]/30 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  YouTube Live Screen-Share Aktif!
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono">
                  GO-LIVE 24/7
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                Akun akan otomatis Go-Live share-screen video <strong>Yamada-kun OP</strong> dengan audio jernih &amp; keras begitu masuk Voice Channel.
              </p>
              <button
                onClick={onNavigateToStream}
                className="w-full py-1.5 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-xs text-white font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Kelola Live Stream (YouTube)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
