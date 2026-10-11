/**
 * @file app.js
 * 100% Pure JavaScript Application Core & Reactive Controller
 * Desktop-Only Anime-Jepang-Modern-Clean Web UI (Per 2026-10-11)
 * Tanpa TypeScript, tanpa ketergantungan TSX/React.
 */

import { generateSynchronizedFiles, analyzeDiscordToken } from './syncEngine.js';
import { exportFilesAsZip } from './zipExporter.js';

// Initial state
const state = {
  botMode: 'selfbot',
  userToken: 'mtq1njmyntizmtaendmuotaing.gij-ke.u0wwkuvmatd21tfxdnlvjb5vmmpmtx9aedirs',
  maskToken: true,
  voiceChannelId: '1366441630151737445',
  voiceGuildId: '1323944038117675038',
  autoRejoin: true,
  rejoinDelaySec: 8,
  streamEnabled: true,
  autoLoop: true,
  videoMin: '360p',
  videoMax: '480p',
  videoFps: 24,
  videoBitrate: 540,
  adaptiveDiscrimination: true,
  aizoDefense: true,
  playlistMode: 'alternating',
  audioBoost: 1.48,
  audioPriorityMode: 'extreme_zero_drop',
  audioBitrate: 96,
  breakEnabled: true,
  breakIntervalMin: 120,
  breakDurationSec: 90,
  rpcName: 'KANA-BOON - ぐらでーしょん',
  rpcType: 'STREAMING',
  rpcUrl: 'https://youtu.be/L5rL0pBzmAE?si=xf2mlt5z4RFJikLJ',
  rpcDetails: 'Yamada-kun Lv999 OP ↔ AIZO',
  rpcState: 'Di Voice: #Music 24/7 (480p Boosted)',
  rpcStatus: 'online',
  dynamicTimeline: true,
  dynamicTrackSync: true,
  hardwareAccel: 'auto',
  rtcpPli: true,
  daveRatchet: true,
  malangRtcRegion: 'singapore',
  antiJamming: true,
  malangPeering: true,
  ispTarget: 'all_indonesia',
  dnsProfile: 'cloudflare_1111',
  activeTab: 'credentials',
  selectedFile: '.env',
  activeMalangSubTab: 'prompt',
  isDownloadingZip: false
};

// Current synchronized files cache
let currentFiles = [];

/**
 * Inisialisasi Aplikasi
 */
export function initApp() {
  bindDOMEvents();
  refreshStateAndUI();
}

/**
 * Refresh seluruh state, validasi, file sinkronisasi, dan DOM
 */
function refreshStateAndUI() {
  currentFiles = generateSynchronizedFiles(state);
  updateCredentialsUI();
  updateStreamUI();
  updateRpcUI();
  updateMalangUI();
  updateExportUI();
}

/**
 * Hubungkan event listeners DOM
 */
function bindDOMEvents() {
  // 1. Tab Navigasi Utama
  document.querySelectorAll('[data-tab-target]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-tab-target');
      switchTab(target);
    });
  });

  // 2. Mode Switch (Akun User / Bot Resmi)
  const btnModeSelf = document.getElementById('btnModeSelf');
  const btnModeBot = document.getElementById('btnModeBot');
  if (btnModeSelf && btnModeBot) {
    btnModeSelf.addEventListener('click', () => {
      state.botMode = 'selfbot';
      btnModeSelf.classList.add('active-self');
      btnModeBot.classList.remove('active-bot');
      refreshStateAndUI();
    });
    btnModeBot.addEventListener('click', () => {
      state.botMode = 'official';
      btnModeBot.classList.add('active-bot');
      btnModeSelf.classList.remove('active-self');
      refreshStateAndUI();
    });
  }

  // 3. Tombol Unduh ZIP Cepat (Header & Tab Ekspor)
  const btnDownloadZip = document.getElementById('btnDownloadZip');
  const btnDownloadZipExport = document.getElementById('btnDownloadZipExport');
  const triggerZipDownload = async () => {
    if (state.isDownloadingZip) return;
    state.isDownloadingZip = true;
    updateZipButtonsState(true);
    try {
      currentFiles = generateSynchronizedFiles(state);
      await exportFilesAsZip(currentFiles, `fadhilbot-${state.botMode}-2026-clean.zip`);
    } catch (err) {
      console.error('Gagal mengunduh zip:', err);
    } finally {
      state.isDownloadingZip = false;
      updateZipButtonsState(false);
    }
  };

  if (btnDownloadZip) btnDownloadZip.addEventListener('click', triggerZipDownload);
  if (btnDownloadZipExport) btnDownloadZipExport.addEventListener('click', triggerZipDownload);

  // 4. Salin .env Cepat di Header
  const btnCopyEnvHeader = document.getElementById('btnCopyEnvHeader');
  if (btnCopyEnvHeader) {
    btnCopyEnvHeader.addEventListener('click', () => {
      const envFile = currentFiles.find((f) => f.name === '.env');
      if (envFile) {
        copyToClipboard(envFile.content, btnCopyEnvHeader, 'Tersalin!', 'Salin .env');
      }
    });
  }

  // 5. Input Kredensial & Token
  const inputToken = document.getElementById('inputToken');
  const btnToggleMaskToken = document.getElementById('btnToggleMaskToken');
  const btnPasteToken = document.getElementById('btnPasteToken');
  const btnClearToken = document.getElementById('btnClearToken');

  if (inputToken) {
    inputToken.value = state.userToken;
    inputToken.addEventListener('input', (e) => {
      state.userToken = e.target.value;
      refreshStateAndUI();
    });
  }

  if (btnToggleMaskToken) {
    btnToggleMaskToken.addEventListener('click', () => {
      state.maskToken = !state.maskToken;
      inputToken.type = state.maskToken ? 'password' : 'text';
      btnToggleMaskToken.textContent = state.maskToken ? '👁️ Lihat' : '🔒 Sembunyi';
    });
  }

  if (btnPasteToken) {
    btnPasteToken.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          state.userToken = text.trim();
          inputToken.value = state.userToken;
          refreshStateAndUI();
        }
      } catch (_) {}
    });
  }

  if (btnClearToken) {
    btnClearToken.addEventListener('click', () => {
      state.userToken = '';
      inputToken.value = '';
      refreshStateAndUI();
    });
  }

  // Channel ID & Guild ID
  const inputChannelId = document.getElementById('inputChannelId');
  const inputGuildId = document.getElementById('inputGuildId');
  const btnPresetResmi = document.getElementById('btnPresetResmi');

  if (inputChannelId) {
    inputChannelId.value = state.voiceChannelId;
    inputChannelId.addEventListener('input', (e) => {
      state.voiceChannelId = e.target.value;
      refreshStateAndUI();
    });
  }

  if (inputGuildId) {
    inputGuildId.value = state.voiceGuildId;
    inputGuildId.addEventListener('input', (e) => {
      state.voiceGuildId = e.target.value;
      refreshStateAndUI();
    });
  }

  if (btnPresetResmi) {
    btnPresetResmi.addEventListener('click', () => {
      state.voiceChannelId = '1366441630151737445';
      state.voiceGuildId = '1323944038117675038';
      if (inputChannelId) inputChannelId.value = state.voiceChannelId;
      if (inputGuildId) inputGuildId.value = state.voiceGuildId;
      refreshStateAndUI();
    });
  }

  // Auto Rejoin & Slider
  const chkAutoRejoin = document.getElementById('chkAutoRejoin');
  const rangeRejoinDelay = document.getElementById('rangeRejoinDelay');

  if (chkAutoRejoin) {
    chkAutoRejoin.checked = state.autoRejoin;
    chkAutoRejoin.addEventListener('change', (e) => {
      state.autoRejoin = e.target.checked;
      refreshStateAndUI();
    });
  }

  if (rangeRejoinDelay) {
    rangeRejoinDelay.value = state.rejoinDelaySec;
    rangeRejoinDelay.addEventListener('input', (e) => {
      state.rejoinDelaySec = Number(e.target.value);
      const valLabel = document.getElementById('valRejoinDelay');
      if (valLabel) valLabel.textContent = `${state.rejoinDelaySec} Detik`;
      refreshStateAndUI();
    });
  }

  // 6. Stream & Audio DSP Controls
  setupButtonGroup('grpResolution', (val) => {
    state.videoMin = val;
    state.videoMax = val;
    refreshStateAndUI();
  });

  setupButtonGroup('grpFps', (val) => {
    state.videoFps = Number(val);
    refreshStateAndUI();
  });

  setupButtonGroup('grpPlaylist', (val) => {
    state.playlistMode = val;
    refreshStateAndUI();
  });

  setupButtonGroup('grpHardwareAccel', (val) => {
    state.hardwareAccel = val;
    refreshStateAndUI();
  });

  const rangeVideoBitrate = document.getElementById('rangeVideoBitrate');
  if (rangeVideoBitrate) {
    rangeVideoBitrate.value = state.videoBitrate;
    rangeVideoBitrate.addEventListener('input', (e) => {
      state.videoBitrate = Number(e.target.value);
      const valLabel = document.getElementById('valVideoBitrate');
      if (valLabel) valLabel.textContent = `${state.videoBitrate} kbps`;
      refreshStateAndUI();
    });
  }

  const rangeAudioGain = document.getElementById('rangeAudioGain');
  if (rangeAudioGain) {
    rangeAudioGain.value = state.audioBoost;
    rangeAudioGain.addEventListener('input', (e) => {
      state.audioBoost = parseFloat(e.target.value);
      const valLabel = document.getElementById('valAudioGain');
      const db = ((state.audioBoost - 1) * 7.08).toFixed(1);
      if (valLabel) valLabel.textContent = `${state.audioBoost.toFixed(2)}x (+${db}dB)`;
      refreshStateAndUI();
    });
  }

  const chkRtcpPli = document.getElementById('chkRtcpPli');
  if (chkRtcpPli) {
    chkRtcpPli.checked = state.rtcpPli;
    chkRtcpPli.addEventListener('change', (e) => {
      state.rtcpPli = e.target.checked;
      refreshStateAndUI();
    });
  }

  const chkDaveRatchet = document.getElementById('chkDaveRatchet');
  if (chkDaveRatchet) {
    chkDaveRatchet.checked = state.daveRatchet;
    chkDaveRatchet.addEventListener('change', (e) => {
      state.daveRatchet = e.target.checked;
      refreshStateAndUI();
    });
  }

  // 7. Rich Presence Controls
  setupButtonGroup('grpRpcType', (val) => {
    state.rpcType = val;
    refreshStateAndUI();
  });

  setupButtonGroup('grpRpcStatus', (val) => {
    state.rpcStatus = val;
    refreshStateAndUI();
  });

  bindTextInput('inputRpcName', 'rpcName');
  bindTextInput('inputRpcUrl', 'rpcUrl');
  bindTextInput('inputRpcDetails', 'rpcDetails');
  bindTextInput('inputRpcState', 'rpcState');

  const chkDynamicTimeline = document.getElementById('chkDynamicTimeline');
  if (chkDynamicTimeline) {
    chkDynamicTimeline.checked = state.dynamicTimeline;
    chkDynamicTimeline.addEventListener('change', (e) => {
      state.dynamicTimeline = e.target.checked;
      refreshStateAndUI();
    });
  }

  const chkDynamicTrackSync = document.getElementById('chkDynamicTrackSync');
  if (chkDynamicTrackSync) {
    chkDynamicTrackSync.checked = state.dynamicTrackSync;
    chkDynamicTrackSync.addEventListener('change', (e) => {
      state.dynamicTrackSync = e.target.checked;
      refreshStateAndUI();
    });
  }

  // 8. Malang Routing & Prompt Subtabs
  document.querySelectorAll('[data-malang-subtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-malang-subtab');
      state.activeMalangSubTab = target;
      document.querySelectorAll('[data-malang-subtab]').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      document.querySelectorAll('.malang-subtab-panel').forEach((panel) => {
        panel.style.display = panel.id === `malangPanel_${target}` ? 'block' : 'none';
      });
    });
  });

  setupButtonGroup('grpRtcRegion', (val) => {
    state.malangRtcRegion = val;
    refreshStateAndUI();
  });

  setupButtonGroup('grpAudioBitrate', (val) => {
    state.audioBitrate = Number(val);
    refreshStateAndUI();
  });

  const chkAntiJamming = document.getElementById('chkAntiJamming');
  if (chkAntiJamming) {
    chkAntiJamming.checked = state.antiJamming;
    chkAntiJamming.addEventListener('change', (e) => {
      state.antiJamming = e.target.checked;
      refreshStateAndUI();
    });
  }

  const chkMalangPeering = document.getElementById('chkMalangPeering');
  if (chkMalangPeering) {
    chkMalangPeering.checked = state.malangPeering;
    chkMalangPeering.addEventListener('change', (e) => {
      state.malangPeering = e.target.checked;
      refreshStateAndUI();
    });
  }

  // Copy Prompt Presets
  setupPromptCopyButtons();

  // 9. Tab Ekspor & File Code Inspector
  setupExportFileSelector();
}

/**
 * Switch Active Tab
 * @param {string} tabKey 
 */
function switchTab(tabKey) {
  state.activeTab = tabKey;
  document.querySelectorAll('[data-tab-target]').forEach((btn) => {
    const isTarget = btn.getAttribute('data-tab-target') === tabKey;
    btn.classList.toggle('active', isTarget);
  });
  document.querySelectorAll('.tab-content').forEach((panel) => {
    const isPanel = panel.id === `tabContent_${tabKey}`;
    panel.classList.toggle('active', isPanel);
  });
  if (tabKey === 'export') {
    updateExportUI();
  }
}

/**
 * Setup Button Groups (Radio-like selection)
 */
function setupButtonGroup(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const buttons = container.querySelectorAll('[data-val]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active', 'active-indigo'));
      btn.classList.add(btn.dataset.theme === 'indigo' ? 'active-indigo' : 'active');
      const val = btn.getAttribute('data-val');
      onSelect(val);
    });
  });
}

function bindTextInput(elemId, stateKey) {
  const elem = document.getElementById(elemId);
  if (!elem) return;
  elem.value = state[stateKey];
  elem.addEventListener('input', (e) => {
    state[stateKey] = e.target.value;
    refreshStateAndUI();
  });
}

function updateCredentialsUI() {
  const analysis = analyzeDiscordToken(state.userToken);
  const badgeValid = document.getElementById('tokenValidationBadge');
  if (badgeValid) {
    if (analysis.isValid) {
      badgeValid.textContent = `✓ Format Valid (${analysis.createdAt || 'Discord User'})`;
      badgeValid.className = 'card-badge-success';
    } else {
      badgeValid.textContent = 'Format Perlu Dicek';
      badgeValid.className = 'card-badge-purple';
    }
  }
}

function updateStreamUI() {
  const strip = document.getElementById('streamSummaryStrip');
  if (strip) {
    strip.textContent = `Resolusi: ${state.videoMin}-${state.videoMax} @ ${state.videoFps} FPS | Bitrate: ${state.videoBitrate}k | GPU: ${state.hardwareAccel.toUpperCase()} | BOOST: ${state.audioBoost.toFixed(2)}x`;
  }
}

function updateRpcUI() {
  // Update Discord Live Preview Mockup
  const previewTitle = document.getElementById('previewTrackTitle');
  const previewDetails = document.getElementById('previewTrackDetails');
  const previewState = document.getElementById('previewTrackState');
  const previewAvatarStatus = document.getElementById('previewAvatarStatus');
  const previewTypeBadge = document.getElementById('previewTypeBadge');

  if (previewTitle) previewTitle.textContent = state.rpcName || 'KANA-BOON - ぐらでーしょん';
  if (previewDetails) previewDetails.textContent = state.rpcDetails || 'Yamada-kun Lv999 OP ↔ AIZO';
  if (previewState) previewState.textContent = state.rpcState || 'Di Voice: #Music 24/7 (480p Boosted)';
  if (previewTypeBadge) previewTypeBadge.textContent = `SEDANG ${state.rpcType}`;

  if (previewAvatarStatus) {
    if (state.rpcStatus === 'online') previewAvatarStatus.style.background = '#23a55a';
    else if (state.rpcStatus === 'idle') previewAvatarStatus.style.background = '#f0b232';
    else previewAvatarStatus.style.background = '#f23f43';
  }
}

function updateMalangUI() {
  const pingBadge = document.getElementById('malangPingBadge');
  if (pingBadge) {
    if (state.malangRtcRegion === 'singapore') {
      pingBadge.textContent = '18–35 ms (Tercepat ke Malang)';
      pingBadge.style.color = '#10b981';
    } else if (state.malangRtcRegion === 'hongkong') {
      pingBadge.textContent = '55–75 ms';
      pingBadge.style.color = '#f59e0b';
    } else {
      pingBadge.textContent = '180–260 ms (Tinggi)';
      pingBadge.style.color = '#ef4444';
    }
  }
}

function updateExportUI() {
  const fileListContainer = document.getElementById('fileListContainer');
  const codeViewer = document.getElementById('codeViewerPre');
  const activeFileName = document.getElementById('activeFileName');
  const activeFileSize = document.getElementById('activeFileSize');
  const btnCopyFileContent = document.getElementById('btnCopyFileContent');

  if (!fileListContainer) return;
  fileListContainer.innerHTML = '';

  const activeFile = currentFiles.find((f) => f.name === state.selectedFile) || currentFiles[0];

  currentFiles.forEach((file) => {
    const itemBtn = document.createElement('button');
    itemBtn.className = `file-item-btn ${file.name === activeFile.name ? 'active' : ''}`;
    itemBtn.innerHTML = `<span>${file.name}</span><span style="font-size: 9px; opacity: 0.7;">${file.size}</span>`;
    itemBtn.addEventListener('click', () => {
      state.selectedFile = file.name;
      updateExportUI();
    });
    fileListContainer.appendChild(itemBtn);
  });

  if (codeViewer) codeViewer.textContent = activeFile.content;
  if (activeFileName) activeFileName.textContent = activeFile.name;
  if (activeFileSize) activeFileSize.textContent = `(${activeFile.size})`;

  if (btnCopyFileContent) {
    btnCopyFileContent.onclick = () => {
      copyToClipboard(activeFile.content, btnCopyFileContent, 'Tersalin!', 'Salin Isi Berkas');
    };
  }
}

function setupExportFileSelector() {
  const btnCopyFileContent = document.getElementById('btnCopyFileContent');
  if (btnCopyFileContent) {
    btnCopyFileContent.addEventListener('click', () => {
      const activeFile = currentFiles.find((f) => f.name === state.selectedFile) || currentFiles[0];
      if (activeFile) {
        copyToClipboard(activeFile.content, btnCopyFileContent, 'Tersalin!', 'Salin Isi Berkas');
      }
    });
  }
}

function setupPromptCopyButtons() {
  document.querySelectorAll('[data-copy-prompt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const promptId = btn.getAttribute('data-copy-prompt');
      const box = document.getElementById(`promptText_${promptId}`);
      if (box) {
        copyToClipboard(box.textContent, btn, '✓ Tersalin!', 'Salin Prompt');
      }
    });
  });
}

function copyToClipboard(text, btnElement, successText, originalText) {
  navigator.clipboard.writeText(text);
  if (btnElement) {
    btnElement.textContent = successText;
    btnElement.style.color = '#10b981';
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.color = '';
    }, 2000);
  }
}

function updateZipButtonsState(isPackaging) {
  const btn1 = document.getElementById('btnDownloadZip');
  const btn2 = document.getElementById('btnDownloadZipExport');
  const text = isPackaging ? 'Mengemas...' : 'Unduh ZIP (35KB)';
  if (btn1) {
    btn1.textContent = text;
    btn1.disabled = isPackaging;
  }
  if (btn2) {
    btn2.textContent = text;
    btn2.disabled = isPackaging;
  }
}
