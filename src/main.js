/**
 * @file main.js
 * 100% Pure JavaScript Entry Point
 */

import './style.css';
import { initApp } from './app.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
