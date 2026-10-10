import { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Activity, Clock, Sliders, CheckCircle2, AlertTriangle, Play, RefreshCw, Cpu, Check } from 'lucide-react';

interface AntiDetectionTabProps {
  onApplyJitterConfig: (minMinutes: number, maxMinutes: number) => void;
}

export function AntiDetectionTab({ onApplyJitterConfig }: AntiDetectionTabProps) {
  const [minJitter, setMinJitter] = useState<number>(14);
  const [maxJitter, setMaxJitter] = useState<number>(32);
  const [appliedToast, setAppliedToast] = useState<boolean>(false);

  // Live Simulator state
  const [simStatus, setSimStatus] = useState<'online' | 'idle'>('online');
  const [simNextSwitchIn, setSimNextSwitchIn] = useState<number>(18);
  const [simLog, setSimLog] = useState<Array<{ time: string; status: string; interval: number }>>([
    { time: '14:10:00', status: 'online', interval: 22 },
    { time: '14:32:00', status: 'idle', interval: 17 },
    { time: '14:49:00', status: 'online', interval: 26 },
  ]);

  const handleSimulateTrigger = () => {
    const nextStatus = simStatus === 'online' ? 'idle' : 'online';
    const nextInterval = Math.floor(Math.random() * (maxJitter - minJitter + 1)) + minJitter;
    const now = new Date().toLocaleTimeString();

    setSimStatus(nextStatus);
    setSimNextSwitchIn(nextInterval);
    setSimLog((prev) => [
      { time: now, status: nextStatus, interval: nextInterval },
      ...prev.slice(0, 4)
    ]);
  };

  const handleSaveToConfig = () => {
    onApplyJitterConfig(minJitter, maxJitter);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Sistem Anti-Deteksi &amp; Emulasi Perilaku Manusia (Human Jitter)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-2xl mt-1">
              Solusi cerdas menghindari algoritma pendeteksi bot Discord: otomatis merotasi status antara <strong className="text-emerald-400">online</strong> dan <strong className="text-amber-400">idle</strong> secara acak setiap belasan/puluhan menit untuk menciptakan jejak aktivitas yang 100% natural.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSaveToConfig}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
                appliedToast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
              }`}
            >
              {appliedToast ? <Check className="w-4 h-4" /> : <Sliders className="w-4 h-4" />}
              <span>{appliedToast ? 'Terapkan ke Kode .env!' : 'Terapkan Parameter'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Card & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parameter Tuning */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#38bdf8]" />
            Konfigurasi Rentang Waktu Acak
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Atur batas minimum dan maksimum jeda waktu acak (dalam menit) sebelum status berpindah antara <em>online</em> dan <em>idle</em>.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-[#94a3b8] mb-1 font-mono">
                <span>Minimum Jitter:</span>
                <span className="text-[#38bdf8] font-bold">{minJitter} Menit</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={minJitter}
                onChange={(e) => setMinJitter(Number(e.target.value))}
                className="w-full accent-[#38bdf8] bg-[#1e293b] rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#94a3b8] mb-1 font-mono">
                <span>Maksimum Jitter:</span>
                <span className="text-[#38bdf8] font-bold">{maxJitter} Menit</span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                value={maxJitter}
                onChange={(e) => setMaxJitter(Number(e.target.value))}
                className="w-full accent-[#38bdf8] bg-[#1e293b] rounded h-1.5 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-[#080d1a] border border-[#1e293b] rounded-lg text-xs font-mono space-y-1">
            <div className="text-[#64748b]">Rumus Interval Jitter:</div>
            <div className="text-emerald-400">
              Random Interval = [{minJitter} ~ {maxJitter}] menit
            </div>
            <div className="text-[#94a3b8] text-[11px] pt-1">
              Rata-rata frekuensi: ~{Math.round((minJitter + maxJitter) / 2)} menit per siklus.
            </div>
          </div>
        </div>

        {/* Center: Live Simulator */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Simulasi Status Realtime
              </h3>
              <span className="text-[11px] font-mono text-[#64748b]">Mesin v2.8 Stealth</span>
            </div>

            <div className="p-4 bg-[#080d1a] border border-[#1e293b] rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full relative ${simStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`}>
                  <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${simStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <div>
                  <div className="text-xs text-[#94a3b8]">Status Profil Discord</div>
                  <div className="text-base font-bold text-white uppercase font-mono tracking-wide">
                    {simStatus === 'online' ? (
                      <span className="text-emerald-400">ONLINE (Aktif)</span>
                    ) : (
                      <span className="text-amber-400">IDLE (Tidur/AFK)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[11px] text-[#64748b] block">Rotasi Berikutnya:</span>
                <span className="text-xs text-[#38bdf8] font-bold">~{simNextSwitchIn} menit</span>
              </div>
            </div>

            <button
              onClick={handleSimulateTrigger}
              className="w-full mt-3 py-2 px-3 text-xs bg-[#1e293b] hover:bg-[#334155] text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Tes Pemicu Transisi Status Manual</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e293b]">
            <div className="text-[11px] text-[#64748b] font-mono mb-2">Riwayat Log Jitter:</div>
            <div className="space-y-1 font-mono text-[11px]">
              {simLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between text-[#94a3b8]">
                  <span>[{log.time}]</span>
                  <span className={log.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}>
                    STATUS -&gt; {log.status.toUpperCase()}
                  </span>
                  <span className="text-[#64748b]">{log.interval}m delay</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Why This Works */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Mengapa Teknik Ini Mencegah Banned?
          </h3>

          <div className="space-y-2 text-xs text-[#94a3b8] leading-relaxed">
            <div className="p-2.5 bg-[#080d1a] border border-[#1e293b] rounded-lg">
              <strong className="text-white block mb-0.5">1. Memecah Pola Robotik</strong>
              Discord menganalisis anomali di mana akun non-stop <code className="text-emerald-400">online</code> 24 jam tanpa sedetik pun idle. Status jitter meniru manusia yang beranjak makan, istirahat, atau berganti jendela aplikasi.
            </div>

            <div className="p-2.5 bg-[#080d1a] border border-[#1e293b] rounded-lg">
              <strong className="text-white block mb-0.5">2. Client Handshake Otentik</strong>
              Header WebSocket menyamar sebagai <em>Discord Desktop Client Windows</em> resmi, bukan pustaka bot headless yang mudah di-flag.
            </div>

            <div className="p-2.5 bg-[#080d1a] border border-[#1e293b] rounded-lg">
              <strong className="text-white block mb-0.5">3. Zero-Spam / Zero-Abuse</strong>
              Skrip hanya memelihara presensi dan status kesehatan server, tanpa aksi berbahaya seperti spam DM atau auto-reaction massal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
