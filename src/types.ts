export type BotMode = 'selfbot' | 'official';

export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: string;
  lastCommitMessage: string;
  lastCommitDate: string;
  content: string;
  language: string;
  description: string;
}

export interface TokenAnalysis {
  rawToken: string;
  isValidFormat: boolean;
  snowflakeId?: string;
  createdAtDate?: string;
  timestampEstimate?: string;
  securityAlerts: string[];
  recommendations: string[];
  fixedIssues?: string[];
  caseWarning?: string;
}

export interface LiveStreamConfig {
  enabled: boolean;
  youtubeUrl: string;
  title: string;
  autoLoop: boolean;
  hourlyBreakEnabled: boolean;
  breakDurationMinutes: number; // 2-3 mins
  hourlyIntervalMinutes: number; // ~50-55 mins
  audioVolume: number; // 1.0 - 1.5
  streamType: 'screenshare' | 'camera';
}

export interface VoiceConfig {
  channelId: string;
  guildId?: string;
  selfDeaf: boolean;
  selfMute: boolean;
  autoRejoin: boolean;
  rejoinDelaySec: number;
  liveStream?: LiveStreamConfig;
  richPresence?: RichPresenceCustomConfig;
}

export interface RichPresenceCustomConfig {
  name: string;
  type: 'STREAMING' | 'PLAYING' | 'LISTENING' | 'WATCHING' | 'COMPETING';
  url: string;
  details: string;
  state: string;
  largeImage: string;
  largeText: string;
  smallImage: string;
  smallText: string;
  status: 'online' | 'idle' | 'dnd';
}

