/**
 * @file rawFiles.js
 * 100% Pure JavaScript Module
 * Mengimpor berkas asli repositori Fadhilbot secara mentah via Vite ?raw
 */

import indexJsRaw from '../index.js?raw';
import indexCjsRaw from '../index.cjs?raw';
import configJsonRaw from '../config.json?raw';
import envExampleRaw from '../.env.example?raw';
import readmeRaw from '../README.md?raw';
import npmrcRaw from '../.npmrc?raw';
import postinstallRaw from '../scripts/postinstall.cjs?raw';

export {
  indexJsRaw,
  indexCjsRaw,
  configJsonRaw,
  envExampleRaw,
  readmeRaw,
  npmrcRaw,
  postinstallRaw
};
