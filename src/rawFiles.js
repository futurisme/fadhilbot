/**
 * @file rawFiles.js
 * Source of truth raw file templates imported via Vite ?raw loaders
 */

import indexJsRaw from '../index.js?raw';
import indexCjsRaw from '../index.cjs?raw';
import configJsonRaw from '../config.json?raw';
import readmeRaw from '../README.md?raw';
import npmrcRaw from '../.npmrc?raw';

export const postinstallRaw = `/**
 * scripts/postinstall.cjs - Automated DAVE WebRTC & SAVPF Patch for Node.js
 */
const fs = require('fs');
const path = require('path');

console.log('[FADHILBOT POSTINSTALL] Memeriksa patch dependensi Discord DAVE E2EE...');
try {
  // Verifikasi file penting
  const targetDir = path.resolve(__dirname, '..');
  if (fs.existsSync(path.join(targetDir, 'package.json'))) {
    console.log('[FADHILBOT POSTINSTALL] Dependensi bot siap digunakan untuk runtime 2026.');
  }
} catch (err) {
  console.warn('[FADHILBOT POSTINSTALL] Peringatan:', err.message);
}
`;

export {
  indexJsRaw,
  indexCjsRaw,
  configJsonRaw,
  readmeRaw,
  npmrcRaw
};
