import { useState } from 'react';
import { CheckCircle2, Copy, Check, ChevronDown, ChevronUp, ShieldCheck, X } from 'lucide-react';

interface ErrorDiagnosticBannerProps {
  onCopyIndexJs: () => void;
  isCopiedIndexJs: boolean;
  onCopyPackageJson: () => void;
  isCopiedPackageJson: boolean;
}

export function ErrorDiagnosticBanner({
  onCopyIndexJs,
  isCopiedIndexJs,
  onCopyPackageJson,
  isCopiedPackageJson
}: ErrorDiagnosticBannerProps) {
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-3.5 mb-5 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left info */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">
                Protokol Discord DAVE E2EE, WebRTC &amp; Node.js 22 Siap
              </span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                Kebal Error 2012 (delay/bound onwrite), 2015, Close Code 4017 &amp; Node 22 Stream Shield
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Engine diperkuat dengan <strong>Timers/Promises Compatibility Shield</strong>, <strong>Continuous WebRTC Loop (-stream_loop -1)</strong>, Keyframe IDR 1-detik (<code className="text-emerald-400 font-mono">-g 30</code>), dan <code className="text-sky-300 font-mono">tune: zerolatency</code> untuk mencegah layar blank &amp; Error 2012.
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpenDetails(!isOpenDetails)}
            className="px-2.5 py-1 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
          >
            <span>{isOpenDetails ? 'Tutup Rincian' : 'Rincian Teknis'}</span>
            {isOpenDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onCopyIndexJs}
            className="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition-colors flex items-center gap-1 active:scale-95"
          >
            {isCopiedIndexJs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedIndexJs ? 'Tersalin' : 'Salin index.js'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded"
            title="Sembunyikan pesan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Technical Detail */}
      {isOpenDetails && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-slate-300 font-sans text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-400">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-white font-medium block mb-1">
                Penyebab Error 2012 &amp; bound onwrite:
              </span>
              <p className="text-[11px] leading-relaxed">
                Di Node.js 22+, stream Writable memvalidasi parameter delay secara ketat. Jika callback stream (<code className="text-amber-400 font-mono">bound onwrite</code>) terintersepsi oleh <code className="text-sky-300 font-mono">timers/promises</code>, stream akan berhenti seketika sehingga Discord memunculkan <strong>Error 2012 (Video Viewer Timeout)</strong>. Shield 0.4 &amp; postinstall otomatis menyembuhkan kondisi ini.
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-white font-medium block mb-1">
                Penyebab Utama Error 2015 / 4017:
              </span>
              <p className="text-[11px] leading-relaxed">
                Discord kini mewajibkan enkripsi DAVE (Discord Audio &amp; Video End-to-End Encryption). Client tanpa handshake DAVE akan ditolak gateway dan mengalami timeout suara setelah 20 detik.
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-white font-medium block mb-1">
                Tips Auto-Update di Panel Wispbyte:
              </span>
              <p className="text-[11px] leading-relaxed">
                Di tab <strong>Startup</strong> panel Wispbyte, pastikan variabel <code className="text-emerald-400 font-mono">AUTO_UPDATE</code> diset ke <code className="text-white font-mono">1</code> agar server otomatis menarik kode teranyar saat direstart.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
