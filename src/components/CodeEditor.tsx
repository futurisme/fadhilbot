import { useState, useRef, useEffect, useMemo } from 'react';
import { Copy, Check, RotateCcw, Save, Search, Download, FileCode, CheckCircle2, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { RepoFile } from '../types';

interface CodeEditorProps {
  file: RepoFile;
  onSaveFileContent: (filename: string, newContent: string) => void;
  onResetFileContent: (filename: string) => void;
  isModified: boolean;
  onCopyContent: (content: string, filename: string) => void;
  copiedFilename: string | null;
}

export function CodeEditor({
  file,
  onSaveFileContent,
  onResetFileContent,
  isModified,
  onCopyContent,
  copiedFilename
}: CodeEditorProps) {
  const [content, setContent] = useState(file.content);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync internal content when file changes
  useEffect(() => {
    setContent(file.content);
  }, [file.name, file.content]);

  // Handle Tab key indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newContent);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Sync line numbers scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleSave = () => {
    onSaveFileContent(file.name, content);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleReset = () => {
    onResetFileContent(file.name);
    setContent(file.content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = useMemo(() => content.split('\n'), [content]);
  const lineCount = lines.length;

  const searchMatches = useMemo(() => {
    if (!searchTerm.trim()) return 0;
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (content.match(regex) || []).length;
  }, [content, searchTerm]);

  const isCopied = copiedFilename === file.name;

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg flex flex-col mb-8">
      {/* Editor Header Toolbar */}
      <div className="bg-[#111827] px-4 py-2.5 border-b border-[#1f293d] flex flex-wrap items-center justify-between gap-3">
        {/* Left: File metadata */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#1e293b] text-[#38bdf8]">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                {file.name}
              </span>
              {isModified && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                  Diedit (Belum Simpan)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#94a3b8] hidden sm:block truncate max-w-md">
              {file.description}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
              showSearch
                ? 'bg-[#1e293b] text-[#38bdf8] border-[#38bdf8]/40'
                : 'bg-[#111827] text-[#94a3b8] hover:text-white border-[#1e293b]'
            }`}
            title="Cari kata di file"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cari</span>
          </button>

          {/* Reset button if modified */}
          {isModified && (
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg border border-[#1e293b] bg-[#111827] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white text-xs transition-colors flex items-center gap-1"
              title="Kembalikan kode ke versi semula"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 ${
              saveToast
                ? 'bg-[#10b981] text-white'
                : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
            }`}
            title="Simpan perubahan ke memori proyek (siap unduh ZIP / disalin)"
          >
            {saveToast ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan File</span>
              </>
            )}
          </button>

          {/* Download Single File */}
          <button
            onClick={handleDownload}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#1e293b] bg-[#111827] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white text-xs transition-colors flex items-center gap-1"
            title="Unduh file ini secara terpisah"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh</span>
          </button>

          {/* Copy Code Button */}
          <button
            onClick={() => onCopyContent(content, file.name)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#059669] hover:bg-[#047857] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Salin isi berkas ini untuk dipindahkan ke Wispbyte"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Search Bar */}
      {showSearch && (
        <div className="bg-[#1e293b]/70 border-b border-[#1f293d] px-4 py-2 flex items-center gap-3 text-xs">
          <Search className="w-3.5 h-3.5 text-[#38bdf8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari teks di dalam file..."
            className="bg-[#0f172a] border border-[#334155] rounded px-2.5 py-1 text-white text-xs font-mono focus:outline-none focus:border-[#38bdf8] flex-1 max-w-sm"
          />
          <span className="text-[#94a3b8] font-mono text-[11px]">
            {searchTerm.trim() ? `${searchMatches} kecocokan` : 'Ketik kata untuk mencari'}
          </span>
          <button
            onClick={() => { setShowSearch(false); setSearchTerm(''); }}
            className="text-[#94a3b8] hover:text-white ml-auto text-xs"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Editor Body: Line Numbers + Textarea */}
      <div className="relative flex flex-1 min-h-[460px] max-h-[640px] bg-[#0b0f19] text-xs font-mono">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 py-3 bg-[#080d1a] border-r border-[#1e293b] select-none text-right pr-3 text-[#475569] font-mono overflow-hidden flex flex-col leading-6 tabular-nums"
        >
          {Array.from({ length: lineCount }).map((_, idx) => (
            <div key={idx} className="h-6">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Live Textarea Editor */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          className="flex-1 w-full h-full p-3 bg-transparent text-[#e2e8f0] font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-[#38bdf8]/30 selection:text-white whitespace-pre overflow-auto"
          placeholder="Tulis atau edit kode di sini..."
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="bg-[#0b0f19] px-4 py-2 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-[#64748b] font-mono">
        <div className="flex items-center gap-3">
          <span>{lineCount} baris</span>
          <span>·</span>
          <span>{content.length} karakter</span>
          <span>·</span>
          <span className="text-[#38bdf8] uppercase">{file.language}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#94a3b8] hidden sm:inline">
            Tekan <kbd className="bg-[#1e293b] text-[#cbd5e1] px-1 py-0.5 rounded text-[10px]">Tab</kbd> untuk indentasi 2 spasi
          </span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
