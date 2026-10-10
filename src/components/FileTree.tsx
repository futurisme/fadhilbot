import { FileCode, FileText, Settings, Key, Shield, FolderGit2, Check, Sparkles } from 'lucide-react';
import { RepoFile } from '../types';

interface FileTreeProps {
  files: RepoFile[];
  selectedFile: RepoFile;
  onSelectFile: (file: RepoFile) => void;
  modifiedFiles: Set<string>;
}

export function FileTree({ files, selectedFile, onSelectFile, modifiedFiles }: FileTreeProps) {
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.js')) return <FileCode className="w-4 h-4 text-amber-400" />;
    if (filename.endsWith('.json')) return <Settings className="w-4 h-4 text-[#38bdf8]" />;
    if (filename.startsWith('.env')) return <Key className="w-4 h-4 text-emerald-400" />;
    if (filename.endsWith('.md')) return <FileText className="w-4 h-4 text-[#a855f7]" />;
    return <FileCode className="w-4 h-4 text-[#94a3b8]" />;
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden mb-6 shadow-md">
      {/* Header */}
      <div className="bg-[#111827] px-4 py-2.5 border-b border-[#1f293d] flex items-center justify-between text-xs text-[#94a3b8]">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[#38bdf8]" />
          <span className="font-semibold text-white">Struktur Berkas Proyek Wispbyte</span>
          <span className="text-[#64748b]">· {files.length} file</span>
        </div>
        <div className="text-[11px] text-[#64748b] hidden sm:block font-mono">
          Klik berkas untuk membuka di Editor
        </div>
      </div>

      {/* Fast Tabs / Files Row */}
      <div className="divide-y divide-[#1e293b]">
        {files.map((file) => {
          const isSelected = selectedFile.name === file.name;
          const isModified = modifiedFiles.has(file.name);

          return (
            <button
              key={file.name}
              onClick={() => onSelectFile(file)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-4 transition-all text-xs ${
                isSelected
                  ? 'bg-[#1e293b] text-white border-l-2 border-[#38bdf8]'
                  : 'hover:bg-[#151f32] text-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-[200px]">
                {getFileIcon(file.name)}
                <span className={`font-mono font-medium ${isSelected ? 'text-[#38bdf8]' : 'text-white'}`}>
                  {file.name}
                </span>
                {isModified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Ada modifikasi belum disimpan" />
                )}
              </div>

              <div className="hidden md:block flex-1 truncate text-[#94a3b8] text-left text-[11px]">
                {file.description}
              </div>

              <div className="flex items-center gap-4 text-[#64748b] shrink-0 font-mono text-[11px]">
                <span className="w-16 text-right text-[#94a3b8]">{file.size}</span>
                <span className="text-[10px] text-[#38bdf8] uppercase bg-[#1e293b] px-1.5 py-0.5 rounded">
                  {file.language}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
