import { useState } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink, Terminal } from 'lucide-react';
import { RepoFile } from '../types';

interface CodeViewerProps {
  file: RepoFile;
  onCopyFile: (content: string, filename: string) => void;
  copiedFilename: string | null;
}

export function CodeViewer({ file, onCopyFile, copiedFilename }: CodeViewerProps) {
  const [showRaw, setShowRaw] = useState(false);
  const isCopied = copiedFilename === file.name;

  const lines = file.content.split('\n');

  const handleDownload = () => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden mb-8 shadow-sm">
      {/* Code Header Toolbar */}
      <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-[#58a6ff]" />
          <span className="font-mono text-xs sm:text-sm font-semibold text-white">
            {file.path}
          </span>
          <span className="text-xs text-[#8b949e]">
            ({lines.length} baris · {file.size})
          </span>
          <span className="hidden sm:inline-block text-[11px] text-[#7ee787] bg-[#7ee787]/10 border border-[#7ee787]/20 px-2 py-0.5 rounded font-mono">
            {file.language}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-2.5 py-1 text-xs text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md transition-colors"
          >
            {showRaw ? 'Tampilan Terformat' : 'Tampilan Mentah (Raw)'}
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-1 text-xs text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md transition-colors flex items-center gap-1.5"
            title="Unduh file tunggal ini"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh</span>
          </button>

          <button
            onClick={() => onCopyFile(file.content, file.name)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#238636] hover:bg-[#2ea043] rounded-md transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Salin isi file ini ke clipboard"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="font-semibold">Kode Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin File Ini</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Purpose description banner */}
      <div className="bg-[#1c2128] px-4 py-2 border-b border-[#30363d] text-xs text-[#8b949e] flex items-center justify-between">
        <span>Fungsi: <strong className="text-[#c9d1d9] font-normal">{file.description}</strong></span>
        <span className="text-[11px] text-[#58a6ff]">Klik tombol Salin di atas untuk transfer ke Wispbyte</span>
      </div>

      {/* Code Content */}
      {showRaw ? (
        <textarea
          readOnly
          value={file.content}
          className="w-full h-[500px] p-4 bg-[#0d1117] text-[#c9d1d9] font-mono text-xs resize-none focus:outline-none"
        />
      ) : (
        <div className="overflow-x-auto max-h-[640px] text-xs font-mono select-text bg-[#0d1117]">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-[#161b22]/70 group">
                  <td className="w-12 py-0.5 px-3 text-right text-[#484f58] select-none border-r border-[#21262d] font-mono text-[11px] tabular-nums group-hover:text-[#8b949e]">
                    {idx + 1}
                  </td>
                  <td className="py-0.5 px-4 whitespace-pre text-[#c9d1d9] overflow-x-visible">
                    {formatSyntax(line, file.language)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Simple fast syntax colorizer for JavaScript/JSON/Shell/Markdown
function formatSyntax(line: string, language: string) {
  if (!line) return <span>&nbsp;</span>;

  // Comments
  if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*') || line.trim().startsWith('*/')) {
    return <span className="text-[#8b949e] italic">{line}</span>;
  }
  if (line.trim().startsWith('#')) {
    return <span className="text-[#8b949e] italic">{line}</span>;
  }

  // Keywords & Strings simple highlight
  if (language === 'javascript') {
    if (line.includes('require(') || line.includes('import ') || line.includes('const ') || line.includes('let ') || line.includes('function ')) {
      return (
        <span className="text-[#c9d1d9]">
          {line.replace(/(const|let|var|function|return|if|else|new|async|await|require)/g, '§KEY§$1§END§')
            .split('§')
            .map((part, i) => {
              if (part.startsWith('KEY§')) return <span key={i} className="text-[#ff7b72] font-semibold">{part.replace('KEY§', '')}</span>;
              if (part === 'END') return null;
              return <span key={i}>{part}</span>;
            })}
        </span>
      );
    }
    if (line.includes('console.log') || line.includes('console.error')) {
      return <span className="text-[#79c0ff]">{line}</span>;
    }
  }

  if (language === 'shell') {
    if (line.includes('=')) {
      const [key, ...rest] = line.split('=');
      return (
        <span>
          <span className="text-[#79c0ff] font-semibold">{key}</span>=
          <span className="text-[#a5d6ff]">{rest.join('=')}</span>
        </span>
      );
    }
  }

  if (language === 'json') {
    if (line.includes('":')) {
      const parts = line.split('":');
      return (
        <span>
          <span className="text-[#7ee787]">{parts[0]}"</span>:
          <span className="text-[#a5d6ff]">{parts.slice(1).join('":')}</span>
        </span>
      );
    }
  }

  return <span>{line}</span>;
}
