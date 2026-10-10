import { BotMode, RepoFile, VoiceConfig } from '../types';
import indexJsRaw from '../../index.js?raw';
import indexCjsRaw from '../../index.cjs?raw';
import packageJsonRaw from '../../package.json?raw';
import configJsonRaw from '../../config.json?raw';
import envExampleRaw from '../../.env.example?raw';
import readmeRaw from '../../README.md?raw';
import postinstallRaw from '../../scripts/postinstall.cjs?raw';
import npmrcRaw from '../../.npmrc?raw';

export function getRepositoryFiles(
  mode: BotMode,
  userToken: string,
  maskToken: boolean,
  voiceConfig?: VoiceConfig
): RepoFile[] {
  const DEFAULT_VOICE_CHANNEL_ID = '1366441630151737445';
  const DEFAULT_GUILD_ID = '1323944038117675038';

  const effectiveChannelId = (voiceConfig?.channelId && voiceConfig.channelId.trim() !== '')
    ? voiceConfig.channelId.trim()
    : DEFAULT_VOICE_CHANNEL_ID;

  const effectiveGuildId = (voiceConfig?.guildId && voiceConfig.guildId.trim() !== '')
    ? voiceConfig.guildId.trim()
    : DEFAULT_GUILD_ID;

  const rawToken = userToken.trim();
  const displayToken = maskToken 
    ? (rawToken.length > 15 ? `${rawToken.substring(0, 15)}...[PROTECTED_TOKEN]` : rawToken)
    : rawToken;

  const isSelfbot = mode === 'selfbot';

  const defaultVoice: VoiceConfig = voiceConfig || {
    channelId: DEFAULT_VOICE_CHANNEL_ID,
    guildId: DEFAULT_GUILD_ID,
    selfDeaf: false,
    selfMute: false,
    autoRejoin: true,
    rejoinDelaySec: 8,
    liveStream: {
      enabled: true,
      youtubeUrl: 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
      title: '山田くんとLv999の恋をする OP - KANA-BOON「ぐらでーしょん」',
      autoLoop: true,
      hourlyBreakEnabled: true,
      breakDurationMinutes: 1.5,
      hourlyIntervalMinutes: 120,
      audioVolume: 1.45,
      streamType: 'screenshare'
    }
  };

  // 1. Sinkronisasi token dan ID ke dalam index.js
  let finalIndexJs = indexJsRaw;
  if (rawToken && rawToken !== 'MASUKKAN_TOKEN_DISCORD_ANDA_DISINI') {
    finalIndexJs = finalIndexJs.replace(
      /: '1366441630151737445';/g,
      `: '${effectiveChannelId}';`
    );
    if (effectiveGuildId) {
      finalIndexJs = finalIndexJs.replace(
        /: '1323944038117675038';/g,
        `: '${effectiveGuildId}';`
      );
    }
  }

  // 2. Sinkronisasi ke dalam index.cjs
  let finalIndexCjs = indexCjsRaw;
  if (rawToken && rawToken !== 'MASUKKAN_TOKEN_DISCORD_ANDA_DISINI') {
    finalIndexCjs = finalIndexCjs.replace(
      /: '1366441630151737445';/g,
      `: '${effectiveChannelId}';`
    );
    if (effectiveGuildId) {
      finalIndexCjs = finalIndexCjs.replace(
        /: '1323944038117675038';/g,
        `: '${effectiveGuildId}';`
      );
    }
  }

  // 3. .env aktif yang sinkron dengan input form
  const envContent = `# ================================================================
# KONFIGURASI DISCORD 24/7 AUDIO SUPREMACY & ADAPTIVE 360p-480p ENGINE (2026)
# ================================================================

DISCORD_TOKEN=${displayToken}
PORT=3000

# Voice 24/7 Channel Target
VOICE_CHANNEL_ID=${effectiveChannelId}
VOICE_GUILD_ID=${effectiveGuildId}
GUILD_ID=${effectiveGuildId}
VOICE_AUTO_REJOIN=${defaultVoice.autoRejoin}
VOICE_REJOIN_DELAY_SEC=${defaultVoice.rejoinDelaySec}

# Prioritas Mutlak #1 Audio On-Mic MP3 & Adaptive Video Screen-Share (360p-480p @ 22-24 FPS)
ENABLE_STREAM=true
AUTO_LOOP=true
VIDEO_RESOLUTION_MIN=360p
VIDEO_RESOLUTION_MAX=480p
VIDEO_WIDTH=854
VIDEO_HEIGHT=480
VIDEO_FPS_MIN=22
VIDEO_FPS_MAX=24
VIDEO_FPS=24
VIDEO_BITRATE=550
VIDEO_BITRATE_MAX=680
AUDIO_BITRATE=192
AUDIO_BOOST=1.45
AUDIO_PRIORITY=extreme_zero_drop
ADAPTIVE_VIDEO_DISCRIMINATION=true
FFMPEG_THREADS=3

# Anti-Deteksi Discord: Jeda Istirahat 1-2 Menit Setiap 2 Jam
TWO_HOUR_BREAK_ENABLED=true
BREAK_INTERVAL_MINUTES=120
BREAK_DURATION_SECONDS=90
`;

  // 4. config.json tersinkronisasi
  let parsedConfig: Record<string, unknown> = {};
  try {
    parsedConfig = JSON.parse(configJsonRaw);
  } catch (_) {
    parsedConfig = {};
  }

  // Inject updated channel IDs
  const finalConfigObj = {
    ...parsedConfig,
    voice: {
      ...(typeof parsedConfig.voice === 'object' && parsedConfig.voice !== null ? parsedConfig.voice : {}),
      channelId: effectiveChannelId,
      guildId: effectiveGuildId,
      autoRejoin: defaultVoice.autoRejoin,
      rejoinDelaySec: defaultVoice.rejoinDelaySec,
      onMicPriority: true,
      permanentSpeaking: true
    }
  };
  const finalConfigJson = JSON.stringify(finalConfigObj, null, 2);

  return [
    {
      name: 'index.js',
      path: 'index.js',
      type: 'file',
      size: `${(finalIndexJs.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'feat(stream): 480p standard, audio priority over CPU, alternating playlist loop & 2hr break',
      lastCommitDate: 'Just now',
      content: finalIndexJs,
      language: 'javascript',
      description: 'Skrip utama Node.js 2026: Go-Live 480p, audio on-mic boosted, rotasi lagu berulang (Gradation + AIZO), dan anti-deteksi 2 jam'
    },
    {
      name: 'index.cjs',
      path: 'index.cjs',
      type: 'file',
      size: `${(finalIndexCjs.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'feat(stream): native CommonJS entry point with audio-first 480p engine',
      lastCommitDate: 'Just now',
      content: finalIndexCjs,
      language: 'javascript',
      description: 'Skrip alternatif CommonJS native (bebas error type module di Pterodactyl/Wispbyte)'
    },
    {
      name: 'scripts/postinstall.cjs',
      path: 'scripts/postinstall.cjs',
      type: 'file',
      size: `${(postinstallRaw.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'fix(webrtc): patch WebRTC GLIBC, PacingHandler setBitrate & BaseMediaStream safeDelay',
      lastCommitDate: 'Just now',
      content: postinstallRaw,
      language: 'javascript',
      description: 'Skrip otomatis postinstall untuk patch WebRTC GLIBC dan pencegahan Discord Error 2012'
    },
    {
      name: 'package.json',
      path: 'package.json',
      type: 'file',
      size: `${(packageJsonRaw.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'feat: configure start scripts, DAVE E2EE, and undici v6 overrides',
      lastCommitDate: 'Just now',
      content: packageJsonRaw,
      language: 'json',
      description: 'Daftar dependensi dengan DAVE E2EE & WebRTC SAVPF'
    },
    {
      name: '.env',
      path: '.env',
      type: 'file',
      size: `${(envContent.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'config: synced token, 480p resolution, audio-priority, and default voice channel settings',
      lastCommitDate: 'Just now',
      content: envContent,
      language: 'shell',
      description: 'Konfigurasi token tersinkronisasi, channel ID, resolusi 480p, dan audio boost'
    },
    {
      name: '.env.example',
      path: '.env.example',
      type: 'file',
      size: `${(envExampleRaw.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'docs: template environment configuration with 480p and audio priority defaults',
      lastCommitDate: 'Just now',
      content: envExampleRaw,
      language: 'shell',
      description: 'Template contoh .env dengan default ID resmi dan konfigurasi 480p'
    },
    {
      name: 'config.json',
      path: 'config.json',
      type: 'file',
      size: `${(finalConfigJson.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'feat: centralized 480p mediaEngine, playlist rotation and 2-hour anti-detection settings',
      lastCommitDate: 'Just now',
      content: finalConfigJson,
      language: 'json',
      description: 'Pengaturan terpusat playlist bergilir, batas CPU Governor, dan timer anti-deteksi'
    },
    {
      name: '.npmrc',
      path: '.npmrc',
      type: 'file',
      size: `${(npmrcRaw.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'config: suppress engine strict warnings on Node 19',
      lastCommitDate: 'Just now',
      content: npmrcRaw,
      language: 'shell',
      description: 'Konfigurasi npm untuk kompatibilitas Node 19 & bypass audit'
    },
    {
      name: 'README.md',
      path: 'README.md',
      type: 'file',
      size: `${(readmeRaw.length / 1024).toFixed(1)} KB`,
      lastCommitMessage: 'docs: complete documentation for Audio-Priority 480p Screen-Share Engine 2026',
      lastCommitDate: 'Just now',
      content: readmeRaw,
      language: 'markdown',
      description: 'Panduan lengkap hosting 24/7 di Wispbyte dengan arsitektur audio priority 480p'
    }
  ];
}
