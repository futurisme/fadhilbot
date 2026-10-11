/**
 * ====================================================================
 * FADHILBOT 2026 - COMMONJS COMPATIBILITY RUNNER
 * Target Platform: Wispbyte.com / Pterodactyl Container / Linux VM
 * Compatibility: Node.js 18.x, 19.x, 20.x, 22.x LTS
 * ====================================================================
 * Note: The previous redundant 52.4 KB duplicate of index.js has been
 * refactored into a high-performance modern bridge that boots the unified
 * ES module engine dynamically while preserving full Bun/ZMQ shields.
 */

// 0.0 Anti-ZMQ & FFmpeg Exit Code 8 Shield
globalThis.Bun = { version: '1.2.4' };

console.log('----------------------------------------------------');
console.log(' [FADHILBOT] Booting Unified Engine via Modern CJS Bridge');
console.log(' Single Source of Truth: ./index.js');
console.log('----------------------------------------------------');

import('./index.js').catch((err) => {
  console.error('[FATAL] Failed to boot unified Fadhilbot engine:', err);
  process.exit(1);
});
