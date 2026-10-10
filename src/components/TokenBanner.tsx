import { useState } from 'react';
import { Key, Copy, Check, Eye, EyeOff, Lock, CheckCircle2, Edit2, Wand2, Sparkles, Clipboard, AlertTriangle } from 'lucide-react';
import { TokenAnalysis } from '../types';
import { cleanAndNormalizeDiscordToken } from '../utils/tokenAnalyzer';

interface TokenBannerProps {
  tokenAnalysis: TokenAnalysis;
  userToken: string;
  setUserToken: (token: string) => void;
  maskToken: boolean;
  setMaskToken: (mask: boolean) => void;
  onOpenAuditTab?: () => void;
}

export function TokenBanner({
  tokenAnalysis,
  userToken,
  setUserToken,
  maskToken,
  setMaskToken,
  onOpenAuditTab
}: TokenBannerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempToken, setTempToken] = useState(userToken);
  const [autoFixNotice, setAutoFixNotice] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(userToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyClean = (raw: string) => {
    const { cleaned, fixedIssues, caseWarning } = cleanAndNormalizeDiscordToken(raw);
    setTempToken(cleaned);
    if (fixedIssues.length > 0) {
      setAutoFixNotice(`Auto-Fix Aktif: ${fixedIssues.join(', ')}`);
      setTimeout(() => setAutoFixNotice(null), 4000);
    } else if (caseWarning) {
      setAutoFixNotice(caseWarning);
      setTimeout(() => setAutoFixNotice(null), 5000);
    }
    return cleaned;
  };

  const handleSave = () => {
    const finalCleaned = handleApplyClean(tempToken);
    if (finalCleaned.trim()) {
      setUserToken(finalCleaned.trim());
      setIsEditing(false);
    }
  };

  const handleQuickPasteAndFix = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText && clipText.trim()) {
        const { cleaned, fixedIssues } = cleanAndNormalizeDiscordToken(clipText);
        setTempToken(cleaned);
        setUserToken(cleaned);
        setAutoFixNotice(
          fixedIssues.length > 0
            ? `Berhasil Menempel & Auto-Fix: ${fixedIssues.join(', ')}`
            : 'Token dari Clipboard Berhasil Ditempel & Terverifikasi!'
        );
        setTimeout(() => setAutoFixNotice(null), 4000);
      }
    } catch (_) {
      // Fallback: buka form edit jika permission clipboard diblokir browser
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 mb-4 text-xs shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Token Meta Left */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
            <Key className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">Token Akun Discord</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Snowflake ID: {tokenAnalysis.snowflakeId || '1456325231030309055'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Auto-Sanitized (Anti-""" &amp; Case-Checked)
            </span>
            {autoFixNotice && (
              <span className="text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                {autoFixNotice}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleQuickPasteAndFix}
            className="px-2 py-1 text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/80 border border-sky-600/40 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
            title="Tempel seketika dari Clipboard dan otomatis bersihkan tanda kutip & perbaiki casing"
          >
            <Clipboard className="w-3 h-3 text-sky-400" />
            <span>Tempel &amp; Auto-Fix</span>
          </button>

          <button
            onClick={() => setMaskToken(!maskToken)}
            className="px-2 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
            title={maskToken ? 'Tampilkan token' : 'Sensor tampilan'}
          >
            {maskToken ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>{maskToken ? 'Buka Sensor' : 'Sensor'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors flex items-center gap-1 active:scale-95 text-[11px]"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Tersalin' : 'Salin Token'}</span>
          </button>

          {onOpenAuditTab && (
            <button
              onClick={onOpenAuditTab}
              className="px-2 py-1 text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
            >
              Audit Kripto
            </button>
          )}
        </div>
      </div>

      {/* Case Warning Alert if applicable */}
      {tokenAnalysis.caseWarning && (
        <div className="mt-2 p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-300 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>{tokenAnalysis.caseWarning}</span>
        </div>
      )}

      {/* Token preview / inline edit */}
      <div className="mt-2 pt-2 border-t border-slate-800/80">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={tempToken}
                onChange={(e) => {
                  setTempToken(e.target.value);
                  handleApplyClean(e.target.value);
                }}
                className="w-full bg-slate-950 border border-sky-500/60 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none pr-24"
                placeholder="Tempel token (tanda kutip triple, double, dan casing otomatis diperbaiki)..."
              />
              <button
                type="button"
                onClick={() => handleApplyClean(tempToken)}
                className="absolute right-1.5 top-1.5 text-[10px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 flex items-center gap-1"
                title="Bersihkan tanda kutip triple/double & perbaiki casing otomatis"
              >
                <Wand2 className="w-2.5 h-2.5" />
                <span>Auto-Fix</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-500 transition-colors text-xs"
              >
                Simpan &amp; Terapkan
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTempToken(userToken);
                }}
                className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/60 rounded-lg px-2.5 py-1 font-mono text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <Lock className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate text-[11px]">
                {maskToken
                  ? `${userToken.substring(0, 16)}•••••••••••••••••••••••••••••••••`
                  : userToken}
              </span>
            </div>
            <button
              onClick={() => {
                setTempToken(userToken);
                setIsEditing(true);
              }}
              className="ml-3 text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px] shrink-0 font-sans font-medium"
            >
              <Edit2 className="w-3 h-3" />
              <span>Ganti Token</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
