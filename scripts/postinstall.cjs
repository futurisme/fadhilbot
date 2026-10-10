const fs = require('fs');
const path = require('path');

// 1. Native WebRTC GLIBC compatibility & Selfbot Package Aliasing
try {
  const nm = path.join(__dirname, '..', 'node_modules');
  const djs = path.join(nm, 'discord.js-selfbot-v13');
  const lngDir = path.join(nm, '@lng2004');
  const lng = path.join(lngDir, 'discord.js-selfbot-v13');

  // Alias @lng2004/discord.js-selfbot-v13 <-> discord.js-selfbot-v13
  if (fs.existsSync(djs) && !fs.existsSync(lng)) {
    fs.mkdirSync(lngDir, { recursive: true });
    fs.mkdirSync(lng, { recursive: true });
    fs.writeFileSync(path.join(lng, 'package.json'), JSON.stringify({
      name: '@lng2004/discord.js-selfbot-v13',
      version: '3.7.2',
      main: '../../discord.js-selfbot-v13/src/index.js'
    }, null, 2));
    fs.writeFileSync(path.join(lng, 'index.js'), "module.exports = require('../../discord.js-selfbot-v13');\n");
    console.log('[POSTINSTALL] Auto-aliased @lng2004/discord.js-selfbot-v13 -> discord.js-selfbot-v13');
  } else if (fs.existsSync(lng) && !fs.existsSync(djs)) {
    fs.mkdirSync(djs, { recursive: true });
    fs.writeFileSync(path.join(djs, 'package.json'), JSON.stringify({
      name: 'discord.js-selfbot-v13',
      version: '3.7.1',
      main: '../@lng2004/discord.js-selfbot-v13/src/index.js'
    }, null, 2));
    fs.writeFileSync(path.join(djs, 'index.js'), "module.exports = require('../@lng2004/discord.js-selfbot-v13');\n");
    console.log('[POSTINSTALL] Auto-aliased discord.js-selfbot-v13 -> @lng2004/discord.js-selfbot-v13');
  }

  const src = path.join(__dirname, '..', 'node_modules', '@node-datachannel', 'linux-x64-gnu', 'node_datachannel.node');
  const dst = path.join(__dirname, '..', 'node_modules', '@lng2004', 'ndc-linux-x64-gnu', 'node_datachannel.node');
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log('[POSTINSTALL] Native WebRTC GLIBC compatibility verified.');
  }
} catch (e) {
  console.warn('[POSTINSTALL WARN] Failed establishing selfbot alias / WebRTC native addon:', e.message);
}

// 2. Patch @dank074/discord-video-stream WebRtcWrapper.js to prevent "this._videoPacer?.setBitrate is not a function" (Discord Error 2012)
try {
  const wrapperPaths = [
    path.join(__dirname, '..', 'node_modules', '@dank074', 'discord-video-stream', 'dist', 'client', 'voice', 'WebRtcWrapper.js'),
    path.join(__dirname, '..', 'node_modules', '@dank074', 'discord-video-stream', 'src', 'client', 'voice', 'WebRtcWrapper.ts')
  ];

  for (const wrapperPath of wrapperPaths) {
    if (fs.existsSync(wrapperPath)) {
      let content = fs.readFileSync(wrapperPath, 'utf8');
      if (content.includes('this._videoPacer?.setBitrate(') && !content.includes('typeof this._videoPacer?.setBitrate')) {
        content = content.replace(
          /this\._videoPacer\?\.setBitrate\(/g,
          '(typeof this._videoPacer?.setBitrate === "function") && this._videoPacer.setBitrate('
        );
        fs.writeFileSync(wrapperPath, content, 'utf8');
        console.log(`[POSTINSTALL] Patched PacingHandler setBitrate safety in ${path.basename(wrapperPath)}.`);
      }
    }
  }
} catch (e) {
  console.warn('[POSTINSTALL WARN] Failed patching WebRtcWrapper:', e.message);
}

// 3. Patch @dank074/discord-video-stream BaseMediaStream.js & .ts to fix "delay must be number" stream stall & Discord Error 2012
try {
  const mediaStreamPaths = [
    path.join(__dirname, '..', 'node_modules', '@dank074', 'discord-video-stream', 'dist', 'media', 'BaseMediaStream.js'),
    path.join(__dirname, '..', 'node_modules', '@dank074', 'discord-video-stream', 'src', 'media', 'BaseMediaStream.ts')
  ];

  for (const mediaStreamPath of mediaStreamPaths) {
    if (fs.existsSync(mediaStreamPath)) {
      let content = fs.readFileSync(mediaStreamPath, 'utf8');
      let modified = false;

      // 3.1 Shield timers/promises import so function callbacks (bound onwrite) are safely handled
      const timerImportRegex = /import\s*{\s*setTimeout(?:\s+as\s+\w+)?\s*}\s*from\s*["'](?:node:)?timers\/promises["'];?/;
      if (timerImportRegex.test(content) && !content.includes('function safeDelay')) {
        content = content.replace(
          timerImportRegex,
          `function safeDelay(delay) {
  const ms = (typeof delay === "number" && !isNaN(delay) && delay > 0) ? Math.min(Math.round(delay), 250) : 0;
  return new Promise((resolve) => {
    if (ms <= 0) return resolve();
    globalThis.setTimeout(resolve, ms);
  });
}`
        );
        modified = true;
      }

      // 3.2 Guarantee callback(null) and safe sleep duration via globalThis.setTimeout
      const sleepRegex = /(?:const\s+safeSleep\s*=\s*[^;]+;\s*if\s*\(safeSleep\s*>\s*0\)\s*{\s*)?setTimeout\s*\(\s*(?:safeSleep|sleep)\s*\)\.then\(\s*\(\)\s*=>\s*callback\([^)]*\)\s*\)(?:\.catch\([^)]*\))?;?(?:\s*}\s*else\s*{\s*callback\([^)]*\);\s*})?/;
      if (sleepRegex.test(content)) {
        content = content.replace(
          sleepRegex,
          `const safeSleep = (typeof sleep === "number" && !isNaN(sleep) && sleep > 0) ? Math.min(Math.round(sleep), 250) : 0;
            if (safeSleep > 0) {
              globalThis.setTimeout(() => {
                try { callback(null); } catch (_) {}
              }, safeSleep);
            } else {
              try { callback(null); } catch (_) {}
            }`
        );
        modified = true;
      }

      // 3.3 Safe frametime delay using safeDelay
      const frameDelayRegex = /await\s+setTimeout\([^;]+;?/;
      if (frameDelayRegex.test(content)) {
        content = content.replace(
          frameDelayRegex,
          'await safeDelay(frametime);'
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(mediaStreamPath, content, 'utf8');
        console.log(`[POSTINSTALL] Patched BaseMediaStream stream timing & Error 2012 safety in ${path.basename(mediaStreamPath)}.`);
      }
    }
  }
} catch (e) {
  console.warn('[POSTINSTALL WARN] Failed patching BaseMediaStream:', e.message);
}
