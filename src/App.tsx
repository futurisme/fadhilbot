/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useCallback } from 'react';
import { BotMode, RepoFile, VoiceConfig } from './types';
import { analyzeDiscordToken } from './utils/tokenAnalyzer';
import { getRepositoryFiles } from './data/repoFiles';
import { exportFilesAsZip } from './utils/zipExporter';
import { RepoNavbar, MainTabType } from './components/RepoNavbar';
import { TokenBanner } from './components/TokenBanner';
import { ErrorDiagnosticBanner } from './components/ErrorDiagnosticBanner';
import { DashboardTab } from './components/DashboardTab';
import { WispbyteGuideTab } from './components/WispbyteGuideTab';
import { FileTree } from './components/FileTree';
import { CodeEditor } from './components/CodeEditor';
import { EngineConfigTab } from './components/EngineConfigTab';
import { RichPresenceTab } from './components/RichPresenceTab';
import { Copy, Check, Radio, ShieldCheck, Download } from 'lucide-react';

// Default initial token (user account credential)
const INITIAL_TOKEN = 'mtq1njmyntizmtaendmuotaing.gij-ke.u0wwkuvmatd21tfxdnlvjb5vmmpmtx9aedirs';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('dashboard');
  const [botMode, setBotMode] = useState<BotMode>('selfbot');
  const [userToken, setUserToken] = useState<string>(INITIAL_TOKEN);
  const [maskToken, setMaskToken] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('index.js');
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [isCopiedAll, setIsCopiedAll] = useState<boolean>(false);
  const [isCopiedIndexJs, setIsCopiedIndexJs] = useState<boolean>(false);
  const [isCopiedPackageJson, setIsCopiedPackageJson] = useState<boolean>(false);

  // Voice 24/7 & YouTube Live state
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    channelId: '1366441630151737445',
    guildId: '1323944038117675038',
    selfDeaf: false,
    selfMute: false,
    autoRejoin: true,
    rejoinDelaySec: 8,
    liveStream: {
      enabled: true,
      youtubeUrl: 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
      title: 'gradation',
      autoLoop: true,
      hourlyBreakEnabled: false,
      breakDurationMinutes: 2.5,
      hourlyIntervalMinutes: 55,
      audioVolume: 1.25,
      streamType: 'screenshare'
    }
  });

  // In-memory file modifications (from the editor)
  const [modifiedContents, setModifiedContents] = useState<Record<string, string>>({});

  // Token analysis
  const tokenAnalysis = useMemo(() => analyzeDiscordToken(userToken), [userToken]);

  // Base repository files (Node.js engine)
  const baseFiles = useMemo(() => {
    return getRepositoryFiles(botMode, userToken, maskToken, voiceConfig);
  }, [botMode, userToken, maskToken, voiceConfig]);

  // Active files reflecting any custom edits made by user in the editor
  const files: RepoFile[] = useMemo(() => {
    return baseFiles.map((bf) => {
      if (modifiedContents[bf.name] !== undefined) {
        return {
          ...bf,
          content: modifiedContents[bf.name],
          size: `${(modifiedContents[bf.name].length / 1024).toFixed(1)} KB`
        };
      }
      return bf;
    });
  }, [baseFiles, modifiedContents]);

  const selectedFile = useMemo(() => {
    return files.find((f) => f.name === selectedFileName) || files[0];
  }, [files, selectedFileName]);

  const modifiedFileNames = useMemo(() => {
    return new Set(Object.keys(modifiedContents));
  }, [modifiedContents]);

  // Handlers for CodeEditor
  const handleSaveFileContent = useCallback((filename: string, newContent: string) => {
    setModifiedContents((prev) => ({
      ...prev,
      [filename]: newContent
    }));
  }, []);

  const handleResetFileContent = useCallback((filename: string) => {
    setModifiedContents((prev) => {
      const next = { ...prev };
      delete next[filename];
      return next;
    });
  }, []);

  const handleCopyContent = useCallback((content: string, filename: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFilename(filename);
    setTimeout(() => setCopiedFilename(null), 2500);
  }, []);

  // Auto-sync token setter: immediately reflects across all files and exported ZIP
  const handleSetUserToken = useCallback((newToken: string) => {
    const trimmed = newToken.trim();
    setUserToken(trimmed);
    // Clear any cached .env so baseFiles with the fresh token takes effect immediately
    setModifiedContents((prev) => {
      const next = { ...prev };
      delete next['.env'];
      delete next['config.json'];
      return next;
    });
  }, []);

  const handleCopyIndexJs = useCallback(() => {
    const file = files.find((f) => f.name === 'index.js') || baseFiles.find((f) => f.name === 'index.js');
    if (file) {
      navigator.clipboard.writeText(file.content);
      setIsCopiedIndexJs(true);
      setTimeout(() => setIsCopiedIndexJs(false), 2500);
    }
  }, [files, baseFiles]);

  const handleCopyPackageJson = useCallback(() => {
    const file = files.find((f) => f.name === 'package.json') || baseFiles.find((f) => f.name === 'package.json');
    if (file) {
      navigator.clipboard.writeText(file.content);
      setIsCopiedPackageJson(true);
      setTimeout(() => setIsCopiedPackageJson(false), 2500);
    }
  }, [files, baseFiles]);

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const targetVoice: VoiceConfig = {
        ...voiceConfig,
        channelId: (voiceConfig.channelId && voiceConfig.channelId.trim() !== '')
          ? voiceConfig.channelId.trim()
          : '1366441630151737445',
        guildId: (voiceConfig.guildId && voiceConfig.guildId.trim() !== '')
          ? voiceConfig.guildId.trim()
          : '1323944038117675038'
      };

      // Always export with raw token (unmasked) for production readiness on Wispbyte
      const cleanFiles = getRepositoryFiles(botMode, userToken.trim(), false, targetVoice);

      const exportFiles = cleanFiles.map((cf) => {
        if (modifiedContents[cf.name] !== undefined && cf.name !== '.env') {
          return {
            ...cf,
            content: modifiedContents[cf.name]
          };
        }
        return cf;
      });

      await exportFilesAsZip(exportFiles, `discord-247-nodejs-${botMode}-wispbyte.zip`);
    } catch (err) {
      console.error('Failed to export zip', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleCopyAllCode = () => {
    const combined = files
      .map((f) => `// ================= [ FILE: ${f.name} ] =================\n${f.content}\n\n`)
      .join('\n');
    navigator.clipboard.writeText(combined);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2500);
  };

  // Handler for updating voice configuration across files with guaranteed defaults
  const handleUpdateVoiceConfig = useCallback((newConfig: VoiceConfig) => {
    const finalChannel = (newConfig.channelId && newConfig.channelId.trim() !== '')
      ? newConfig.channelId.trim()
      : '1366441630151737445';
    const finalGuild = (newConfig.guildId && newConfig.guildId.trim() !== '')
      ? newConfig.guildId.trim()
      : '1323944038117675038';

    const sanitized: VoiceConfig = {
      ...newConfig,
      channelId: finalChannel,
      guildId: finalGuild
    };

    setVoiceConfig(sanitized);

    // Clear cached in-memory .env and config.json so new channel & guild IDs are instantly synced!
    setModifiedContents((prev) => {
      const next = { ...prev };
      delete next['.env'];
      delete next['config.json'];
      return next;
    });
  }, []);

  // Callback from AntiDetection to apply jitter minutes
  const handleApplyJitterConfig = useCallback((minMinutes: number, maxMinutes: number) => {
    const envFile = files.find((f) => f.name === '.env');
    if (envFile) {
      let updatedEnv = envFile.content;
      updatedEnv = updatedEnv.replace(/MIN_JITTER_MINUTES=\d+/, `MIN_JITTER_MINUTES=${minMinutes}`);
      updatedEnv = updatedEnv.replace(/MAX_JITTER_MINUTES=\d+/, `MAX_JITTER_MINUTES=${maxMinutes}`);
      handleSaveFileContent('.env', updatedEnv);
    }
  }, [files, handleSaveFileContent]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      {/* Top Navigation Bar */}
      <RepoNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloadingZip={isDownloadingZip}
        botMode={botMode}
        setBotMode={setBotMode}
        onCopyIndexJs={handleCopyIndexJs}
        isCopiedIndexJs={isCopiedIndexJs}
        voiceChannelConfigured={Boolean(voiceConfig.channelId)}
      />

      {/* Main Workspace Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 w-full">
        {/* Compact Credential Bar */}
        <TokenBanner
          tokenAnalysis={tokenAnalysis}
          userToken={userToken}
          setUserToken={handleSetUserToken}
          maskToken={maskToken}
          setMaskToken={setMaskToken}
          onOpenAuditTab={() => setActiveTab('engine')}
        />

        {/* Compact Diagnostic Status Banner */}
        <ErrorDiagnosticBanner
          onCopyIndexJs={handleCopyIndexJs}
          isCopiedIndexJs={isCopiedIndexJs}
          onCopyPackageJson={handleCopyPackageJson}
          isCopiedPackageJson={isCopiedPackageJson}
        />

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            botMode={botMode}
            userToken={userToken}
            setUserToken={handleSetUserToken}
            voiceConfig={voiceConfig}
            onUpdateVoiceConfig={handleUpdateVoiceConfig}
            files={files}
            onNavigateToTab={setActiveTab}
            onCopyIndexJs={handleCopyIndexJs}
            isCopiedIndexJs={isCopiedIndexJs}
            onCopyPackageJson={handleCopyPackageJson}
            isCopiedPackageJson={isCopiedPackageJson}
            onDownloadZip={handleDownloadZip}
            isDownloadingZip={isDownloadingZip}
          />
        )}

        {/* Tab 2: Rich Presence (Activity) Kustomisasi Lengkap */}
        {activeTab === 'rpc' && (
          <RichPresenceTab
            voiceConfig={voiceConfig}
            onUpdateVoiceConfig={handleUpdateVoiceConfig}
            onNavigateToEditor={() => {
              setSelectedFileName('index.js');
              setActiveTab('editor');
            }}
          />
        )}

        {/* Tab 3: Panduan Lengkap 0 s/d 100% */}
        {activeTab === 'guide' && (
          <WispbyteGuideTab
            userToken={userToken}
            voiceChannelId={voiceConfig.channelId}
            onNavigateToEditor={() => {
              setSelectedFileName('index.js');
              setActiveTab('editor');
            }}
          />
        )}

        {/* Tab 3: Editor Berkas */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Struktur Berkas Proyek:</span>
                <span className="text-slate-400">
                  {files.length} berkas {modifiedFileNames.size > 0 && `(${modifiedFileNames.size} diedit)`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyIndexJs}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  {isCopiedIndexJs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedIndexJs ? 'Tersalin' : 'Salin index.js'}</span>
                </button>

                <button
                  onClick={handleCopyAllCode}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {isCopiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedAll ? 'Semua Tersalin' : 'Salin Semua Berkas'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('engine')}
                  className="px-3 py-1.5 text-xs font-medium text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Atur Voice &amp; Jitter</span>
                </button>
              </div>
            </div>

            {/* File Explorer */}
            <FileTree
              files={files}
              selectedFile={selectedFile}
              onSelectFile={(f) => setSelectedFileName(f.name)}
              modifiedFiles={modifiedFileNames}
            />

            {/* Code Editor */}
            <CodeEditor
              file={selectedFile}
              onSaveFileContent={handleSaveFileContent}
              onResetFileContent={handleResetFileContent}
              isModified={modifiedFileNames.has(selectedFile.name)}
              onCopyContent={handleCopyContent}
              copiedFilename={copiedFilename}
            />
          </div>
        )}

        {/* Tab 4: Engine & Fitur Konfigurasi */}
        {activeTab === 'engine' && (
          <EngineConfigTab
            voiceConfig={voiceConfig}
            onUpdateVoiceConfig={handleUpdateVoiceConfig}
            onApplyJitterConfig={handleApplyJitterConfig}
            tokenAnalysis={tokenAnalysis}
            userToken={userToken}
            setUserToken={handleSetUserToken}
            onNavigateToEditor={() => {
              setSelectedFileName('index.js');
              setActiveTab('editor');
            }}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] py-4 mt-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">WispHost Studio</span>
            <span>·</span>
            <span>Discord 24/7 Self-Host</span>
            <span>·</span>
            <span className="text-emerald-400">Node.js 19/20/22 Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-slate-200 transition-colors">
              Dashboard
            </button>
            <button onClick={() => setActiveTab('rpc')} className="hover:text-purple-300 transition-colors">
              Rich Presence
            </button>
            <button onClick={() => setActiveTab('guide')} className="hover:text-slate-200 transition-colors">
              Panduan Wispbyte
            </button>
            <button onClick={() => setActiveTab('editor')} className="hover:text-slate-200 transition-colors">
              Editor Berkas
            </button>
            <button onClick={() => setActiveTab('engine')} className="hover:text-slate-200 transition-colors">
              Konfigurasi Engine
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
