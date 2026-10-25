/**
 * @file main.js
 * Browser entry point for Fadhilbot Control Studio
 */

import { initApp } from './app.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}
