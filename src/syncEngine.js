/**
 * @file syncEngine.js
 * 100% Pure JavaScript Source Code & Configuration Synchronization Engine
 * Menghubungkan seluruh input pengguna di antarmuka web langsung ke dalam kode sumber,
 * konfigurasi JSON, dan berkas lingkungan (.env) tanpa perantara TypeScript.
 */

import {
  indexJsRaw,
  indexCjsRaw,
  configJsonRaw,
  readmeRaw,
  npmrcRaw,
  postinstallRaw
} from './rawFiles.js';

/**
 * Format ukuran byte menjadi format ringkas (KB/MB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Validasi dan analisis token Discord secara instan
 * @param {string} token 
 */
export function analyzeDiscordToken(token) {
  const clean = (token || '').trim();
  const parts = clean.split('.');
  const isValidFormat = parts.length === 3 && parts[0].length >= 18;

  let snowflakeId = null;
  let createdAt = null;

  if (isValidFormat) {
    try {
      const decodedId = atob(parts[0]);
      if (/^\d{17,20}$/.test(decodedId)) {
        snowflakeId = decodedId;
        const discordEpoch = 1420070400000n;
        const snowflakeBig = BigInt(decodedId);
        const timestamp = Number((snowflakeBig >> 22n) + discordEpoch);
        createdAt = new Date(timestamp).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (_) {}
  }

  return {
    isValid: isValidFormat,
    snowflakeId,
    createdAt
  };
}

/**
 * Bangun seluruh daftar berkas repositori yang 100% tersinkronisasi
 * @param {Object} state - State reaktif dari seluruh modul UI
 * @returns {Array<{name: string, path: string, size: string, content: string, description: string, sync: string}>}
 */
export function generateSynchronizedFiles(state) {
  const rawToken = (state.userToken || '').trim();
  const channelId = (state.voiceChannelId || '').trim() || '1366441630151737445';
  const guildId = (state.voiceGuildId || '').trim() || '1323944038117675038';
  const audioBitrate = state.audioBitrate || 96;
  const audioBoost = Number(state.audioBoost || 1.48).toFixed(2);
  const videoFps = state.videoFps || 24;
  const videoMin = state.videoMin || '360p';
  const videoMax = state.videoMax || '480p';
  const videoBitrate = state.videoBitrate || 540;
  const breakIntervalMin = state.breakIntervalMin || 120;
  const breakDurationSec = state.breakDurationSec || 90;

  // 1. Sinkronisasi index.js
  let finalIndexJs = indexJsRaw;
  if (rawToken && rawToken !== 'MASUKKAN_TOKEN_DISCORD_ANDA_DISINI') {
    finalIndexJs = finalIndexJs.replace(
      /: '1366441630151737445';/g,
      `: '${channelId}';`
    );
    if (guildId) {
      finalIndexJs = finalIndexJs.replace(
        /: '1323944038117675038';/g,
        `: '${guildId}';`
      );
    }
  }

  // Sinkronisasi bitrate audio optimal untuk rute Malang/Indonesia
  finalIndexJs = finalIndexJs.replace(
    /process\.env\.AUDIO_BITRATE \|\| '192'/g,
    `process.env.AUDIO_BITRATE || '${audioBitrate}'`
  );

  // 2. Berkas .env dinamis
  const envContent = `# ================================================================
# FADHILBOT 2026 - KONFIGURASI DISCORD 24/7 STREAM & AUDIO ENGINE
# Dihasilkan secara langsung oleh Fadhilbot Control Studio (100% HTML/JS)
# ================================================================

# [01] OTENTIKASI & IDENTITAS BOT (${state.botMode === 'selfbot' ? 'Akun Pengguna' : 'Bot Resmi'})
DISCORD_TOKEN=${rawToken || 'MASUKKAN_TOKEN_DISCORD_ANDA_DISINI'}
PORT=3000

# [02] TARGET SERVER & VOICE ROOM
VOICE_CHANNEL_ID=${channelId}
VOICE_GUILD_ID=${guildId}
GUILD_ID=${guildId}
VOICE_AUTO_REJOIN=${state.autoRejoin}
VOICE_REJOIN_DELAY_SEC=${state.rejoinDelaySec}

# [03] ENGINE STREAM VIDEO ADAPTIF (360p-480p @ 22-24 FPS)
ENABLE_STREAM=${state.streamEnabled}
AUTO_LOOP=${state.autoLoop}
VIDEO_RESOLUTION_MIN=${videoMin}
VIDEO_RESOLUTION_MAX=${videoMax}
VIDEO_WIDTH=${videoMax === '480p' ? 854 : 640}
VIDEO_HEIGHT=${videoMax === '480p' ? 480 : 360}
VIDEO_FPS=${videoFps}
VIDEO_BITRATE=${videoBitrate}
ADAPTIVE_VIDEO_DISCRIMINATION=${state.adaptiveDiscrimination}
AIZO_HEAVY_DEFENSE=${state.aizoDefense}
STREAM_PLAYLIST_MODE=${state.playlistMode}
FFMPEG_THREADS=4

# [04] PRIORITAS AUDIO ON-MIC MASTERING (Zero-Drop)
AUDIO_BITRATE=${audioBitrate}
AUDIO_BOOST=${audioBoost}
AUDIO_PRIORITY_MODE=${state.audioPriorityMode}

# [05] JEDA ANTI-DETEKSI HUMAN-LIKE (Setiap 2 Jam)
TWO_HOUR_BREAK_ENABLED=${state.breakEnabled}
BREAK_INTERVAL_MINUTES=${breakIntervalMin}
BREAK_DURATION_SECONDS=${breakDurationSec}

# [06] DISCORD RICH PRESENCE (Status Aktivitas Akun & Dynamic Timeline)
ACTIVITY_NAME=${state.rpcName || 'KANA-BOON - ぐらでーしょん'}
ACTIVITY_TYPE=${state.rpcType || 'STREAMING'}
ACTIVITY_URL=${state.rpcUrl || 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ'}
ACTIVITY_STATE=${state.rpcState || 'Di Voice: #Music 24/7 (480p Boosted)'}
ACTIVITY_DETAILS=${state.rpcDetails || 'Yamada-kun Lv999 OP ↔ AIZO'}
ACTIVITY_LARGE_IMAGE=youtube
ACTIVITY_LARGE_TEXT=480p Studio Audio Boost (Opus 192k)
ACTIVITY_SMALL_IMAGE=live
ACTIVITY_SMALL_TEXT=Always ON-MIC Active (+3.4dB)
ACCOUNT_STATUS=${state.rpcStatus || 'online'}
DYNAMIC_RPC_TIMELINE=${state.dynamicTimeline}
DYNAMIC_RPC_THUMBNAIL_SYNC=${state.dynamicTrackSync}

# [07] FITUR 2026: HARDWARE ACCEL, RTCP-PLI & DAVE v2 KEY RATCHET
HARDWARE_ACCELERATION=${state.hardwareAccel}
RTCP_PLI_FRAME_DROPPING=${state.rtcpPli}
DAVE_MLS_AUTO_ROTATION=${state.daveRatchet}
DAVE_ROTATION_INTERVAL_MINUTES=60

# [08] OPTIMASI LATENSI MALANG, JAWA TIMUR & ANTI-GANGGUAN DISCORD WEBRTC
VOICE_RTC_REGION=${state.malangRtcRegion}
ANTI_JAMMING_SHIELD=${state.antiJamming}
MALANG_PEERING_OPTIMIZED=${state.malangPeering}
VOICE_KEEPALIVE_MODE=safe_pulse
ISP_PEERING_TARGET=${state.ispTarget}
DNS_PROFILE=${state.dnsProfile}
`;

  // 3. Berkas config.json dinamis
  let baseConfig = {};
  try {
    baseConfig = JSON.parse(configJsonRaw);
  } catch (_) {
    baseConfig = {};
  }

  const finalConfigObj = {
    ...baseConfig,
    server: {
      keepAlivePort: 3000,
      healthEndpoint: '/health',
      metricsEndpoint: '/cpu-metrics'
    },
    malangRouting: {
      targetRegion: 'Malang, Jawa Timur, Indonesia',
      rtcRegion: state.malangRtcRegion,
      expectedPingMs: state.malangRtcRegion === 'singapore' ? '18-35ms' : state.malangRtcRegion === 'hongkong' ? '55-75ms' : '150-250ms',
      antiJammingShield: state.antiJamming,
      audioBitrateKbps: audioBitrate,
      peeringISPs: ['Telkom IndiHome', 'Biznet Networks', 'MyRepublic', 'FirstMedia'],
      submarineCableTransit: ['Matrix Cable System (Surabaya Landing)', 'SEA-ME-WE 3/5', 'Telkom IGG'],
      dnsProfile: state.dnsProfile
    },
    voice: {
      ...(typeof baseConfig.voice === 'object' && baseConfig.voice !== null ? baseConfig.voice : {}),
      enabled: true,
      channelId: channelId,
      guildId: guildId,
      autoRejoin: state.autoRejoin,
      rejoinDelaySec: state.rejoinDelaySec,
      onMicPriority: true,
      permanentSpeaking: true
    },
    mediaEngine: {
      ...(typeof baseConfig.mediaEngine === 'object' && baseConfig.mediaEngine !== null ? baseConfig.mediaEngine : {}),
      priorityMode: state.audioPriorityMode,
      videoResolution: {
        mode: state.adaptiveDiscrimination ? 'adaptive_discrimination' : 'fixed',
        min: videoMin,
        max: videoMax,
        widthMin: videoMin === '360p' ? 640 : 854,
        heightMin: videoMin === '360p' ? 360 : 480,
        widthMax: 854,
        heightMax: 480
      },
      fps: {
        min: 22,
        max: videoFps,
        default: videoFps,
        stability: 'zero_stutter'
      },
      videoBitrateKbps: {
        min: 300,
        max: videoBitrate,
        aizoSpecialized: 300,
        adaptive: state.adaptiveDiscrimination
      },
      audio: {
        bitrateKbps: audioBitrate,
        codec: 'libopus',
        channels: 2,
        sampleRate: 48000,
        audioBoost: parseFloat(audioBoost),
        boostDb: `+${((parseFloat(audioBoost) - 1) * 7).toFixed(1)}dB`,
        antiDuckingLock: true,
        zeroDropGuarantee: true
      },
      cpuGovernor: {
        targetUtilization: '185-195%',
        ceilingMax: '200%',
        priority: 'audio_on_mic_first',
        audioAllocationPercent: '118.5%',
        videoDiscriminationEnabled: state.adaptiveDiscrimination,
        aizoAnimationDefense: state.aizoDefense,
        ffmpegThreads: 4
      },
      hardwareAcceleration: {
        mode: state.hardwareAccel,
        supportedTypes: ['VA-API', 'NVENC', 'QuickSync'],
        cpuSavingPercent: 55
      },
      rtcpLossProtection: {
        enabled: state.rtcpPli,
        dynamicPliDropping: true,
        priority: 'audio_crystalline_zero_drop'
      },
      daveMLS: {
        version: 'v2',
        autoRatchetRotation: state.daveRatchet,
        ratchetIntervalMinutes: 60
      }
    },
    richPresence: {
      ...(typeof baseConfig.richPresence === 'object' && baseConfig.richPresence !== null ? baseConfig.richPresence : {}),
      activityName: state.rpcName,
      activityType: state.rpcType,
      activityUrl: state.rpcUrl,
      details: state.rpcDetails,
      state: state.rpcState,
      status: state.rpcStatus,
      dynamicTimeline: state.dynamicTimeline,
      dynamicTrackSync: state.dynamicTrackSync
    }
  };

  const configJsonContent = JSON.stringify(finalConfigObj, null, 2);

  // 4. File package.json bot runtime
  const packageJsonBot = JSON.stringify({
    name: 'fadhilbot-24-7-audio-stream',
    version: '2026.10.11',
    description: 'Discord 24/7 Audio-Priority & 480p Adaptive Stream Engine (DAVE v2 E2EE, Malang Peering Optimized)',
    main: 'index.js',
    type: 'module',
    scripts: {
      start: 'node index.js',
      selfbot: 'node index.js',
      postinstall: 'node scripts/postinstall.cjs'
    },
    dependencies: {
      '@lng2004/discord.js-selfbot-v13': '^3.7.2',
      '@dank074/discord-video-stream': '^7.0.0',
      '@snazzah/davey': '^0.1.12',
      dotenv: '^17.2.3',
      express: '^4.21.2'
    },
    engines: {
      node: '>=18.0.0'
    }
  }, null, 2);

  // Buat array berkas terstruktur
  const files = [
    {
      name: '.env',
      path: '.env',
      size: formatFileSize(new Blob([envContent]).size),
      content: envContent,
      description: 'Variabel Lingkungan (Token, ID Channel, Bitrate & Region)',
      sync: '100% Sinkron'
    },
    {
      name: 'config.json',
      path: 'config.json',
      size: formatFileSize(new Blob([configJsonContent]).size),
      content: configJsonContent,
      description: 'Konfigurasi Media Engine, Audio DSP, RPC & Malang Routing',
      sync: '100% Sinkron'
    },
    {
      name: 'index.js',
      path: 'index.js',
      size: formatFileSize(new Blob([finalIndexJs]).size),
      content: finalIndexJs,
      description: 'Engine Utama Discord 24/7 (DAVE v2, Anti-Jamming & WebRTC)',
      sync: '100% Sinkron'
    },
    {
      name: 'index.cjs',
      path: 'index.cjs',
      size: formatFileSize(new Blob([indexCjsRaw]).size),
      content: indexCjsRaw,
      description: 'Jembatan CJS Loader untuk Wispbyte Pterodactyl',
      sync: '100% Sinkron'
    },
    {
      name: 'package.json',
      path: 'package.json',
      size: formatFileSize(new Blob([packageJsonBot]).size),
      content: packageJsonBot,
      description: 'Dependensi Node.js & Skrip Start Bot',
      sync: '100% Sinkron'
    },
    {
      name: 'README.md',
      path: 'README.md',
      size: formatFileSize(new Blob([readmeRaw]).size),
      content: readmeRaw,
      description: 'Dokumentasi Lengkap Fitur, Arsitektur & Panduan VPS',
      sync: '100% Sinkron'
    },
    {
      name: '.npmrc',
      path: '.npmrc',
      size: formatFileSize(new Blob([npmrcRaw]).size),
      content: npmrcRaw,
      description: 'Konfigurasi Instalasi Bebas Audit & Fund',
      sync: '100% Sinkron'
    },
    {
      name: 'scripts/postinstall.cjs',
      path: 'scripts/postinstall.cjs',
      size: formatFileSize(new Blob([postinstallRaw]).size),
      content: postinstallRaw,
      description: 'Skrip Otomasi Patch DAVE WebRTC pada Node Modules',
      sync: '100% Sinkron'
    }
  ];

  return files;
}
