import { useState } from 'react';
import { Radio, Tv, ShieldCheck, Key, Server, Cpu, Sparkles } from 'lucide-react';
import { VoiceConfig, TokenAnalysis } from '../types';
import { VoiceStudioTab } from './VoiceStudioTab';
import { LiveStreamTab } from './LiveStreamTab';
import { AntiDetectionTab } from './AntiDetectionTab';
import { TokenAuditTab } from './TokenAuditTab';
import { InfrastructureTab } from './InfrastructureTab';
import { RichPresenceTab } from './RichPresenceTab';

interface EngineConfigTabProps {
  voiceConfig: VoiceConfig;
  onUpdateVoiceConfig: (config: VoiceConfig) => void;
  onApplyJitterConfig: (minMinutes: number, maxMinutes: number) => void;
  tokenAnalysis: TokenAnalysis;
  userToken: string;
  setUserToken: (token: string) => void;
  onNavigateToEditor: () => void;
}

export function EngineConfigTab({
  voiceConfig,
  onUpdateVoiceConfig,
  onApplyJitterConfig,
  tokenAnalysis,
  userToken,
  setUserToken,
  onNavigateToEditor
}: EngineConfigTabProps) {
  const [subTab, setSubTab] = useState<'voice' | 'stream' | 'rpc' | 'antidetect' | 'audit' | 'specs'>('voice');

  return (
    <div className="space-y-5">
      {/* Sub Navigation Strip */}
      <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setSubTab('voice')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'voice'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-sky-400" />
          <span>Voice 24/7 &amp; Auto-Rejoin</span>
        </button>

        <button
          onClick={() => setSubTab('stream')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'stream'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-red-400" />
          <span>Stream 480p &amp; Audio Priority</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </button>

        <button
          onClick={() => setSubTab('rpc')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'rpc'
              ? 'bg-purple-900/50 border border-purple-500/40 text-purple-200 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-purple-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Rich Presence (Activity)</span>
        </button>

        <button
          onClick={() => setSubTab('antidetect')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'antidetect'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anti-Deteksi Status Jitter</span>
        </button>

        <button
          onClick={() => setSubTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'audit'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>Audit Kriptografi Token</span>
        </button>

        <button
          onClick={() => setSubTab('specs')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            subTab === 'specs'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Spesifikasi Sistem</span>
        </button>
      </div>

      {/* Render Selected SubTab */}
      <div>
        {subTab === 'voice' && (
          <VoiceStudioTab
            voiceConfig={voiceConfig}
            onUpdateVoiceConfig={onUpdateVoiceConfig}
            onNavigateToEditor={onNavigateToEditor}
            onNavigateToStream={() => setSubTab('stream')}
          />
        )}

        {subTab === 'stream' && (
          <LiveStreamTab
            voiceConfig={voiceConfig}
            onUpdateVoiceConfig={onUpdateVoiceConfig}
            onNavigateToEditor={onNavigateToEditor}
          />
        )}

        {subTab === 'rpc' && (
          <RichPresenceTab
            voiceConfig={voiceConfig}
            onUpdateVoiceConfig={onUpdateVoiceConfig}
            onNavigateToEditor={onNavigateToEditor}
          />
        )}

        {subTab === 'antidetect' && (
          <AntiDetectionTab onApplyJitterConfig={onApplyJitterConfig} />
        )}

        {subTab === 'audit' && (
          <TokenAuditTab
            tokenAnalysis={tokenAnalysis}
            userToken={userToken}
            setUserToken={setUserToken}
          />
        )}

        {subTab === 'specs' && (
          <InfrastructureTab />
        )}
      </div>
    </div>
  );
}
