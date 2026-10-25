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

  // Sinkronisasi RPC_CONFIG default langsung ke dalam kode sumber index.js
  const safeRpcName = JSON.stringify(state.rpcName || 'KANA-BOON - ぐらでーしょん');
  const safeRpcType = JSON.stringify((state.rpcType || 'STREAMING').toUpperCase());
  const safeRpcUrl = JSON.stringify(state.rpcUrl || 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ');
  const safeRpcDetails = JSON.stringify(state.rpcDetails || 'Yamada-kun Lv999 OP ↔ AIZO');
  const safeRpcState = JSON.stringify(state.rpcState || 'Di Voice: #Music 24/7 (480p Boosted)');
  const safeRpcStatus = JSON.stringify((state.rpcStatus || 'online').toLowerCase());
  const safeLargeImage = JSON.stringify(state.rpcLargeImage || 'youtube');
  const safeLargeText = JSON.stringify(state.rpcLargeText || '480p Studio Audio Boost (Opus 192k)');
  const safeSmallImage = JSON.stringify(state.rpcSmallImage || 'live');
  const safeSmallText = JSON.stringify(state.rpcSmallText || 'Always ON-MIC Active (+3.4dB)');
  const safeAppId = JSON.stringify(state.rpcAppId || '367827983903490050');
  const safeDynamicTimeline = state.dynamicTimeline ? 'true' : 'false';
  const safeDynamicTrackSync = state.dynamicTrackSync ? 'true' : 'false';

  const rpcConfigReplacement = `const RPC_CONFIG = {
  name: process.env.ACTIVITY_NAME || scannedEnvVars.ACTIVITY_NAME || cfgRpc.activityName || ${safeRpcName},
  type: (process.env.ACTIVITY_TYPE || scannedEnvVars.ACTIVITY_TYPE || cfgRpc.activityType || ${safeRpcType}).toUpperCase(),
  url: process.env.ACTIVITY_URL || scannedEnvVars.ACTIVITY_URL || cfgRpc.activityUrl || ${safeRpcUrl},
  details: process.env.ACTIVITY_DETAILS || scannedEnvVars.ACTIVITY_DETAILS || cfgRpc.details || ${safeRpcDetails},
  state: process.env.ACTIVITY_STATE || scannedEnvVars.ACTIVITY_STATE || cfgRpc.state || ${safeRpcState},
  status: (process.env.ACCOUNT_STATUS || scannedEnvVars.ACCOUNT_STATUS || cfgRpc.status || ${safeRpcStatus}).toLowerCase(),
  largeImage: process.env.ACTIVITY_LARGE_IMAGE || scannedEnvVars.ACTIVITY_LARGE_IMAGE || cfgRpc.largeImage || ${safeLargeImage},
  largeText: process.env.ACTIVITY_LARGE_TEXT || scannedEnvVars.ACTIVITY_LARGE_TEXT || cfgRpc.largeText || ${safeLargeText},
  smallImage: process.env.ACTIVITY_SMALL_IMAGE || scannedEnvVars.ACTIVITY_SMALL_IMAGE || cfgRpc.smallImage || ${safeSmallImage},
  smallText: process.env.ACTIVITY_SMALL_TEXT || scannedEnvVars.ACTIVITY_SMALL_TEXT || cfgRpc.smallText || ${safeSmallText},
  dynamicTimeline: (process.env.DYNAMIC_RPC_TIMELINE || scannedEnvVars.DYNAMIC_RPC_TIMELINE || (cfgRpc.dynamicTimeline !== undefined ? String(cfgRpc.dynamicTimeline) : '${safeDynamicTimeline}')) !== 'false',
  dynamicTrackSync: (process.env.DYNAMIC_RPC_THUMBNAIL_SYNC || scannedEnvVars.DYNAMIC_RPC_THUMBNAIL_SYNC || (cfgRpc.dynamicTrackSync !== undefined ? String(cfgRpc.dynamicTrackSync) : '${safeDynamicTrackSync}')) !== 'false',
  applicationId: process.env.APPLICATION_ID || scannedEnvVars.APPLICATION_ID || cfgRpc.applicationId || ${safeAppId}
};`;

  finalIndexJs = finalIndexJs.replace(/const RPC_CONFIG = \{[\s\S]*?\};/m, rpcConfigReplacement);

  // Sinkronisasi DUAL_ACTIVITY_CONFIG (Slot Game / Non-Musik 1000+ Jam Uptime)
  const safeDualEnabled = state.dualActivityEnabled !== false ? 'true' : 'false';
  const safeDualName = JSON.stringify(state.dualActivityName || 'Minecraft');
  const safeDualType = JSON.stringify((state.dualActivityType || 'PLAYING').toUpperCase());
  const safeDualDetails = JSON.stringify(state.dualActivityDetails || 'Survival Mode (24/7 Dedicated Server)');
  const safeDualState = JSON.stringify(state.dualActivityState || 'Hardcore Base - Mining & Building');
  const safeDualAppId = JSON.stringify(state.dualActivityAppId || '432980957394370572');
  const safeDualLargeImg = JSON.stringify(state.dualActivityLargeImage || 'minecraft_logo');
  const safeDualLargeTxt = JSON.stringify(state.dualActivityLargeText || 'Minecraft Java Edition 1.21.x');
  const safeDualSmallImg = JSON.stringify(state.dualActivitySmallImage || 'diamond_pickaxe');
  const safeDualSmallTxt = JSON.stringify(state.dualActivitySmallText || '100% Unbroken Uptime (1000+ Jam)');
  const safeDualHours = Number(state.dualActivityUptimeHours || 1248);

  const dualConfigReplacement = `const DUAL_ACTIVITY_CONFIG = {
  enabled: (process.env.DUAL_ACTIVITY_ENABLED || scannedEnvVars.DUAL_ACTIVITY_ENABLED || (cfgDualAct.enabled !== undefined ? String(cfgDualAct.enabled) : '${safeDualEnabled}')) !== 'false',
  name: process.env.DUAL_ACTIVITY_NAME || scannedEnvVars.DUAL_ACTIVITY_NAME || cfgDualAct.name || ${safeDualName},
  type: (process.env.DUAL_ACTIVITY_TYPE || scannedEnvVars.DUAL_ACTIVITY_TYPE || cfgDualAct.type || ${safeDualType}).toUpperCase(),
  details: process.env.DUAL_ACTIVITY_DETAILS || scannedEnvVars.DUAL_ACTIVITY_DETAILS || cfgDualAct.details || ${safeDualDetails},
  state: process.env.DUAL_ACTIVITY_STATE || scannedEnvVars.DUAL_ACTIVITY_STATE || cfgDualAct.state || ${safeDualState},
  applicationId: process.env.DUAL_ACTIVITY_APP_ID || scannedEnvVars.DUAL_ACTIVITY_APP_ID || cfgDualAct.applicationId || ${safeDualAppId},
  largeImage: process.env.DUAL_ACTIVITY_LARGE_IMAGE || scannedEnvVars.DUAL_ACTIVITY_LARGE_IMAGE || cfgDualAct.largeImage || ${safeDualLargeImg},
  largeText: process.env.DUAL_ACTIVITY_LARGE_TEXT || scannedEnvVars.DUAL_ACTIVITY_LARGE_TEXT || cfgDualAct.largeText || ${safeDualLargeTxt},
  smallImage: process.env.DUAL_ACTIVITY_SMALL_IMAGE || scannedEnvVars.DUAL_ACTIVITY_SMALL_IMAGE || cfgDualAct.smallImage || ${safeDualSmallImg},
  smallText: process.env.DUAL_ACTIVITY_SMALL_TEXT || scannedEnvVars.DUAL_ACTIVITY_SMALL_TEXT || cfgDualAct.smallText || ${safeDualSmallTxt},
  uptimeMode: process.env.DUAL_ACTIVITY_UPTIME_MODE || cfgDualAct.uptimeMode || 'unbroken_persistent',
  customUptimeHours: parseFloat(process.env.DUAL_ACTIVITY_UPTIME_HOURS || cfgDualAct.customUptimeHours || '${safeDualHours}'),
  persistentStartTimestamp: parseInt(process.env.DUAL_ACTIVITY_START_EPOCH || cfgDualAct.persistentStartTimestamp || '1726000000000', 10)
};`;

  finalIndexJs = finalIndexJs.replace(/const DUAL_ACTIVITY_CONFIG = \{[\s\S]*?\};/m, dualConfigReplacement);

  // Sinkronisasi LOL_CONFIG (Manipulasi Khusus League of Legends di Slot 2)
  const safeLolPhase = JSON.stringify(state.lolPhase || 'champ_select');
  const safeLolMode = JSON.stringify(state.lolMode || 'Ranked Solo/Duo');
  const safeLolChampion = JSON.stringify(state.lolChampion || 'Yasuo');
  const safeLolChampionTitle = JSON.stringify(state.lolChampionTitle || 'The Unforgiven');
  const safeLolRankTier = JSON.stringify(state.lolRankTier || 'Master');
  const safeLolLp = JSON.stringify(state.lolRankLp || '240 LP');
  const safeLolKda = JSON.stringify(state.lolKda || '8/1/6');
  const safeLolLevel = parseInt(state.lolChampionLevel || '14', 10);
  const safeLolCs = parseInt(state.lolCs || '185', 10);
  const safeLolPartyCurrent = parseInt(state.lolPartyCurrent || '1', 10);
  const safeLolPartyMax = parseInt(state.lolPartyMax || '5', 10);
  const safeLolAutoCycle = state.lolAutoCycle ? 'true' : 'false';

  const lolConfigReplacement = `const LOL_CONFIG = {
  phase: process.env.LOL_PHASE || scannedEnvVars.LOL_PHASE || cfgLol.phase || ${safeLolPhase},
  mode: process.env.LOL_MODE || scannedEnvVars.LOL_MODE || cfgLol.mode || ${safeLolMode},
  champion: process.env.LOL_CHAMPION || scannedEnvVars.LOL_CHAMPION || cfgLol.champion || ${safeLolChampion},
  championTitle: process.env.LOL_CHAMPION_TITLE || scannedEnvVars.LOL_CHAMPION_TITLE || cfgLol.championTitle || ${safeLolChampionTitle},
  rankTier: process.env.LOL_RANK_TIER || scannedEnvVars.LOL_RANK_TIER || cfgLol.rankTier || ${safeLolRankTier},
  lp: process.env.LOL_RANK_LP || scannedEnvVars.LOL_RANK_LP || cfgLol.lp || ${safeLolLp},
  kda: process.env.LOL_KDA || scannedEnvVars.LOL_KDA || cfgLol.kda || ${safeLolKda},
  championLevel: parseInt(process.env.LOL_CHAMPION_LEVEL || scannedEnvVars.LOL_CHAMPION_LEVEL || cfgLol.championLevel || '${safeLolLevel}', 10),
  cs: parseInt(process.env.LOL_CS || scannedEnvVars.LOL_CS || cfgLol.cs || '${safeLolCs}', 10),
  partyCurrent: parseInt(process.env.LOL_PARTY_CURRENT || scannedEnvVars.LOL_PARTY_CURRENT || cfgLol.partyCurrent || '${safeLolPartyCurrent}', 10),
  partyMax: parseInt(process.env.LOL_PARTY_MAX || scannedEnvVars.LOL_PARTY_MAX || cfgLol.partyMax || '${safeLolPartyMax}', 10),
  autoCycleSimulation: (process.env.LOL_AUTO_CYCLE || scannedEnvVars.LOL_AUTO_CYCLE || String(cfgLol.autoCycleSimulation || '${safeLolAutoCycle}')) === 'true'
};`;

  finalIndexJs = finalIndexJs.replace(/const LOL_CONFIG = \{[\s\S]*?\};/m, lolConfigReplacement);

  // Sinkronisasi target power CPU governor (0-195%) ke dalam index.js
  const activeCpuPower = state.cpuPower !== undefined ? Number(state.cpuPower) : 195;
  finalIndexJs = finalIndexJs.replace(
    /const parsedTargetCpu = parseFloat\(process\.env\.CPU_TARGET_POWER \|\| scannedEnvVars\.CPU_TARGET_POWER \|\| cfgCpu\.targetUtilization \|\| cfgCpu\.targetPowerPercent \|\| '[0-9.]+'\);/g,
    `const parsedTargetCpu = parseFloat(process.env.CPU_TARGET_POWER || scannedEnvVars.CPU_TARGET_POWER || cfgCpu.targetUtilization || cfgCpu.targetPowerPercent || '${activeCpuPower}');`
  );

  // Sinkronisasi PLAYLIST dinamis langsung ke dalam kode sumber index.js
  const playlistItems = (state.playlist && state.playlist.length > 0) ? state.playlist : [
    {
      id: 'gradation',
      title: 'KANA-BOON - ぐらでーしょん (Gradation) [Yamada-kun Lv999 OP]',
      videoFile: 'assets/yamada_op.mp4',
      audioFile: 'assets/yamada_op.mp3',
      imageFile: 'assets/yamada_op.png',
      imageAsset: 'youtube',
      resolution: '360p-480p Adaptive',
      durationSec: 235
    },
    {
      id: 'aizo',
      title: 'AIZO (愛蔵) - Adaptive Screen-Share Broadcast',
      videoFile: 'assets/aizo480p.mp4',
      audioFile: 'assets/aizo.mp3',
      imageFile: 'assets/aizo.png',
      imageAsset: 'aizo',
      resolution: '360p-480p Adaptive',
      durationSec: 238
    }
  ];

  const playlistArrayJson = JSON.stringify(playlistItems, null, 2);
  const rawPlaylistReplacement = `const rawConfiguredPlaylist = (Array.isArray(loadedConfig?.playlist) && loadedConfig.playlist.length > 0)
  ? loadedConfig.playlist
  : ${playlistArrayJson};

const PLAYLIST = rawConfiguredPlaylist.map((p, idx) => {
  const v = p.videoFile || p.videoAsset || ('assets/track_' + (idx + 1) + '.mp4');
  const a = p.audioFile || p.audioAsset || ('assets/track_' + (idx + 1) + '.mp3');
  const img = p.imageFile || p.imageAsset || ('assets/track_' + (idx + 1) + '.png');
  return {
    id: p.id || ('track_' + (idx + 1)),
    title: p.title || ('Track ' + (idx + 1)),
    videoFile: path.isAbsolute(v) ? v : path.resolve(__dirname, v),
    audioFile: path.isAbsolute(a) ? a : path.resolve(__dirname, a),
    imageFile: path.isAbsolute(img) ? img : path.resolve(__dirname, img),
    imageAsset: p.imageAsset || (p.id === 'aizo' ? 'aizo' : 'youtube'),
    resolution: p.resolution || '360p-480p Adaptive',
    durationSec: parseInt(p.durationSec, 10) || 235
  };
});`;

  finalIndexJs = finalIndexJs.replace(/\/\/ Daftar Playlist Bergilir[\s\S]*?const PLAYLIST = rawConfiguredPlaylist\.map\([\s\S]*?\n\}\);/m, `// Daftar Playlist Bergilir Dinamis\n${rawPlaylistReplacement}`);

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
# [02.1] POWER CPU GOVERNOR (0% - 195% SLIDER, DEFAULT: 195%)
CPU_TARGET_POWER=${state.cpuPower !== undefined ? state.cpuPower : 195}%
CPU_MAX_CEILING=195%
FFMPEG_THREADS=${(state.cpuPower !== undefined ? Number(state.cpuPower) : 195) >= 150 ? 4 : ((state.cpuPower !== undefined ? Number(state.cpuPower) : 195) >= 90 ? 3 : ((state.cpuPower !== undefined ? Number(state.cpuPower) : 195) >= 40 ? 2 : 1))}

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

# [04] PRIORITAS AUDIO ON-MIC MASTERING (Zero-Drop)
AUDIO_BITRATE=${audioBitrate}
AUDIO_BOOST=${audioBoost}
AUDIO_PRIORITY_MODE=${state.audioPriorityMode}

# [05] JEDA ANTI-DETEKSI HUMAN-LIKE (Setiap 2 Jam)
TWO_HOUR_BREAK_ENABLED=${state.breakEnabled}
BREAK_INTERVAL_MINUTES=${breakIntervalMin}
BREAK_DURATION_SECONDS=${breakDurationSec}

# [06] DISCORD RICH PRESENCE (Status Aktivitas Akun, Dynamic Timeline & Full Control)
ACTIVITY_NAME=${state.rpcName || 'KANA-BOON - ぐらでーしょん'}
ACTIVITY_TYPE=${(state.rpcType || 'STREAMING').toUpperCase()}
ACTIVITY_URL=${state.rpcUrl || 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ'}
ACTIVITY_STATE=${state.rpcState || 'Di Voice: #Music 24/7 (480p Boosted)'}
ACTIVITY_DETAILS=${state.rpcDetails || 'Yamada-kun Lv999 OP ↔ AIZO'}
ACTIVITY_LARGE_IMAGE=${state.rpcLargeImage || 'youtube'}
ACTIVITY_LARGE_TEXT=${state.rpcLargeText || '480p Studio Audio Boost (Opus 192k)'}
ACTIVITY_SMALL_IMAGE=${state.rpcSmallImage || 'live'}
ACTIVITY_SMALL_TEXT=${state.rpcSmallText || 'Always ON-MIC Active (+3.4dB)'}
ACCOUNT_STATUS=${(state.rpcStatus || 'online').toLowerCase()}
DYNAMIC_RPC_TIMELINE=${state.dynamicTimeline}
DYNAMIC_RPC_THUMBNAIL_SYNC=${state.dynamicTrackSync}
APPLICATION_ID=${state.rpcAppId || '367827983903490050'}
PLAYLIST_TOTAL_TRACKS=${playlistItems.length}

# [06.1] DUAL ACTIVITY PRESENCE (NON-MUSIK / GAME 1000+ JAM UPTIME TANPA PUTUS)
DUAL_ACTIVITY_ENABLED=${state.dualActivityEnabled !== false}
DUAL_ACTIVITY_NAME=${state.dualActivityName || 'Minecraft'}
DUAL_ACTIVITY_TYPE=${(state.dualActivityType || 'PLAYING').toUpperCase()}
DUAL_ACTIVITY_DETAILS=${state.dualActivityDetails || 'Survival Mode (24/7 Dedicated Server)'}
DUAL_ACTIVITY_STATE=${state.dualActivityState || 'Hardcore Base - Mining & Building'}
DUAL_ACTIVITY_UPTIME_HOURS=${state.dualActivityUptimeHours || 1248}
DUAL_ACTIVITY_APP_ID=${state.dualActivityAppId || '432980957394370572'}
DUAL_ACTIVITY_LARGE_IMAGE=${state.dualActivityLargeImage || 'minecraft_logo'}
DUAL_ACTIVITY_LARGE_TEXT=${state.dualActivityLargeText || 'Minecraft Java Edition 1.21.x'}
DUAL_ACTIVITY_SMALL_IMAGE=${state.dualActivitySmallImage || 'diamond_pickaxe'}
DUAL_ACTIVITY_SMALL_TEXT=${state.dualActivitySmallText || '100% Unbroken Uptime (1000+ Jam)'}

# [06.2] LEAGUE OF LEGENDS REALISTIC RICH PRESENCE MANIPULATION (SLOT 2)
LOL_PHASE=${state.lolPhase || 'champ_select'}
LOL_MODE=${state.lolMode || 'Ranked Solo/Duo'}
LOL_CHAMPION=${state.lolChampion || 'Yasuo'}
LOL_CHAMPION_TITLE=${state.lolChampionTitle || 'The Unforgiven'}
LOL_RANK_TIER=${state.lolRankTier || 'Master'}
LOL_RANK_LP=${state.lolRankLp || '240 LP'}
LOL_KDA=${state.lolKda || '8/1/6'}
LOL_CHAMPION_LEVEL=${state.lolChampionLevel || 14}
LOL_CS=${state.lolCs || 185}
LOL_PARTY_CURRENT=${state.lolPartyCurrent || 1}
LOL_PARTY_MAX=${state.lolPartyMax || 5}
LOL_AUTO_CYCLE=${state.lolAutoCycle ? 'true' : 'false'}

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
    cpuGovernor: {
      targetUtilization: `${activeCpuPower}%`,
      targetPowerPercent: activeCpuPower,
      ceilingMax: '195%',
      priority: 'audio_on_mic_first',
      audioAllocationPercent: `${(activeCpuPower * (118.5 / 195)).toFixed(1)}%`,
      videoAllocationPercent: `${(activeCpuPower * (68.0 / 195)).toFixed(1)}%`,
      webrtcAllocationPercent: `${(activeCpuPower * (8.5 / 195)).toFixed(1)}%`,
      videoDiscriminationEnabled: state.adaptiveDiscrimination,
      aizoAnimationDefense: state.aizoDefense,
      ffmpegThreads: activeCpuPower >= 150 ? 4 : (activeCpuPower >= 90 ? 3 : (activeCpuPower >= 40 ? 2 : 1))
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
        targetUtilization: `${activeCpuPower}%`,
        targetPowerPercent: activeCpuPower,
        ceilingMax: '195%',
        priority: 'audio_on_mic_first',
        audioAllocationPercent: `${(activeCpuPower * (118.5 / 195)).toFixed(1)}%`,
        videoAllocationPercent: `${(activeCpuPower * (68.0 / 195)).toFixed(1)}%`,
        webrtcAllocationPercent: `${(activeCpuPower * (8.5 / 195)).toFixed(1)}%`,
        headroomSafeMargin: `${(200 - activeCpuPower).toFixed(1)}%`,
        videoDiscriminationEnabled: state.adaptiveDiscrimination,
        aizoAnimationDefense: state.aizoDefense,
        ffmpegThreads: activeCpuPower >= 150 ? 4 : (activeCpuPower >= 90 ? 3 : (activeCpuPower >= 40 ? 2 : 1))
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
      activityName: state.rpcName || 'KANA-BOON - ぐらでーしょん',
      activityType: (state.rpcType || 'STREAMING').toUpperCase(),
      activityUrl: state.rpcUrl || 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
      details: state.rpcDetails || 'Yamada-kun Lv999 OP ↔ AIZO',
      state: state.rpcState || 'Di Voice: #Music 24/7 (480p Boosted)',
      status: (state.rpcStatus || 'online').toLowerCase(),
      dynamicTimeline: state.dynamicTimeline,
      dynamicTrackSync: state.dynamicTrackSync,
      largeImage: state.rpcLargeImage || 'youtube',
      largeText: state.rpcLargeText || '480p Studio Audio Boost (Opus 192k)',
      smallImage: state.rpcSmallImage || 'live',
      smallText: state.rpcSmallText || 'Always ON-MIC Active (+3.4dB)',
      applicationId: state.rpcAppId || '367827983903490050',
      playlistTracksCount: playlistItems.length,
      dualActivity: {
        enabled: state.dualActivityEnabled !== false,
        name: state.dualActivityName || 'Minecraft',
        type: (state.dualActivityType || 'PLAYING').toUpperCase(),
        details: state.dualActivityDetails || 'Survival Mode (24/7 Dedicated Server)',
        state: state.dualActivityState || 'Hardcore Base - Mining & Building',
        applicationId: state.dualActivityAppId || '432980957394370572',
        largeImage: state.dualActivityLargeImage || 'minecraft_logo',
        largeText: state.dualActivityLargeText || 'Minecraft Java Edition 1.21.x',
        smallImage: state.dualActivitySmallImage || 'diamond_pickaxe',
        smallText: state.dualActivitySmallText || '100% Unbroken Uptime (1000+ Jam)',
        uptimeMode: 'unbroken_persistent',
        customUptimeHours: Number(state.dualActivityUptimeHours || 1248),
        persistentStartTimestamp: Number(state.dualActivityStartEpoch || 1726000000000),
        antiDisconnectShield: true,
        lolSettings: {
          phase: state.lolPhase || 'champ_select',
          mode: state.lolMode || 'Ranked Solo/Duo',
          champion: state.lolChampion || 'Yasuo',
          championTitle: state.lolChampionTitle || 'The Unforgiven',
          rankTier: state.lolRankTier || 'Master',
          lp: state.lolRankLp || '240 LP',
          kda: state.lolKda || '8/1/6',
          championLevel: Number(state.lolChampionLevel || 14),
          cs: Number(state.lolCs || 185),
          partyCurrent: Number(state.lolPartyCurrent || 1),
          partyMax: Number(state.lolPartyMax || 5),
          autoCycleSimulation: Boolean(state.lolAutoCycle)
        }
      }
    },
    playlist: playlistItems.map((p, idx) => ({
      id: p.id || `track_${idx + 1}`,
      title: p.title || `Track ${idx + 1}`,
      videoAsset: p.videoFile || `assets/track_${idx + 1}.mp4`,
      audioAsset: p.audioFile || `assets/track_${idx + 1}.mp3`,
      imageAsset: p.imageAsset || p.imageFile || 'youtube',
      imageFile: p.imageFile || p.imageAsset || `assets/track_${idx + 1}.png`,
      resolution: p.resolution || '480p',
      durationSec: parseInt(p.durationSec, 10) || 235
    }))
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

  const assetInstructions = `[STRUKTUR ASSET MEDIA DISCORD 24/7 FADHILBOT 2026]
Folder /assets sengaja tidak disertakan file video/audio biner di dalam ZIP agar unduhan super ringan (~35 KB) dan hemat kuota.

Pastikan file media berikut berada di dalam folder 'assets/' pada server Wispbyte / VPS Linux Anda:
${playlistItems.map((p, i) => `${i + 1}. Judul Lagu : ${p.title}
   - Video MP4  : ${p.videoFile}
   - Audio MP3  : ${p.audioFile}
   - Cover Img  : ${p.imageFile || p.imageAsset || 'assets/cover.png'}
   - Durasi     : ${p.durationSec} Detik`).join('\n\n')}

Jika berkas sudah ada sebelumnya di server, Anda TIDAK PERLU mengunggahnya lagi!
Cukup ekstrak file kode (index.js, index.cjs, package.json, .env, config.json) ini langsung ke server.`;

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
    },
    {
      name: 'assets/PETUNJUK_ASET.txt',
      path: 'assets/PETUNJUK_ASET.txt',
      size: formatFileSize(new Blob([assetInstructions]).size),
      content: assetInstructions,
      description: 'Daftar Direktori Media & Aset Lagu Playlist Kustom',
      sync: '100% Sinkron'
    }
  ];

  return files;
}
