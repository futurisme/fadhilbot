import { Terminal, Download, Copy, Check, Radio, BookOpen, LayoutDashboard, Code, Cpu, Sparkles } from 'lucide-react';
import { BotMode } from '../types';

export type MainTabType = 'dashboard' | 'rpc' | 'guide' | 'editor' | 'engine';

interface RepoNavbarProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
  botMode: BotMode;
  setBotMode: (mode: BotMode) => void;
  onCopyIndexJs: () => void;
  isCopiedIndexJs: boolean;
  voiceChannelConfigured: boolean;
}

export function RepoNavbar({
  activeTab,
  setActiveTab,
  onDownloadZip,
  isDownloadingZip,
  botMode,
  setBotMode,
  onCopyIndexJs,
  isCopiedIndexJs,
  voiceChannelConfigured
}: RepoNavbarProps) {
  return (
    <header className="border-b border-slate-800 bg-[#090d16] sticky top-0 z-30 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Clean Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight font-sans">
                WispHost Studio
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                · Node.js 24/7 Engine
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Streamlined 5-Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('rpc')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rpc'
                ? 'bg-purple-900/50 border border-purple-500/40 text-purple-200 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Rich Presence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Panduan Deploy</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Editor Berkas</span>
          </button>

          <button
            onClick={() => setActiveTab('engine')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'engine'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Konfigurasi Engine</span>
            {voiceChannelConfigured && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mode Switcher */}
          <div className="p-0.5 bg-slate-900 border border-slate-800 rounded-lg hidden lg:flex items-center text-xs">
            <button
              onClick={() => setBotMode('selfbot')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                botMode === 'selfbot'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Akun User (Stealth)
            </button>
            <button
              onClick={() => setBotMode('official')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                botMode === 'official'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bot Resmi
            </button>
          </div>

          {/* Quick Copy index.js */}
          <button
            onClick={onCopyIndexJs}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            title="Salin kode index.js siap pakai"
          >
            {isCopiedIndexJs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span className="hidden sm:inline">{isCopiedIndexJs ? 'index.js Tersalin' : 'Salin index.js'}</span>
          </button>

          {/* Download ZIP (Lightweight - Excludes /assets) */}
          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            title="Unduh ZIP Ringan (~35 KB): Berkas di /assets sengaja dikecualikan sesuai permintaan agar hemat kuota dan tidak berulang kali mengunduh file media yang sudah ada"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap border border-emerald-400/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingZip ? 'Mengemas...' : 'Unduh ZIP (Tanpa /assets)'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="flex md:hidden px-4 border-t border-slate-800 overflow-x-auto text-xs py-1.5 bg-[#090d16] gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('rpc')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap ${activeTab === 'rpc' ? 'bg-purple-900/50 text-purple-200 border border-purple-500/30 font-medium' : 'text-slate-400'}`}
        >
          Rich Presence
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap ${activeTab === 'guide' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
        >
          Panduan (0-100%)
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap ${activeTab === 'editor' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
        >
          Editor Berkas
        </button>
        <button
          onClick={() => setActiveTab('engine')}
          className={`py-1.5 px-3 rounded-md whitespace-nowrap ${activeTab === 'engine' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
        >
          Engine &amp; Fitur
        </button>
      </div>
    </header>
  );
}
