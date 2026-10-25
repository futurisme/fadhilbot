/**
 * @file zipExporter.js
 * In-browser ZIP bundling and lightweight package exporter using JSZip
 */

import JSZip from 'jszip';

/**
 * Export files as a downloadable ZIP package
 * @param {Array<{name: string, path: string, content: string}>} files
 * @param {string} filename
 */
export async function exportFilesAsZip(files, filename = 'fadhilbot-clean.zip') {
  const zip = new JSZip();

  for (const file of files) {
    const filePath = (file.path || file.name || '').replace(/^[\\/]+/, '');
    zip.file(filePath, file.content);
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Calculate the exact compressed byte size of the synchronized file bundle
 * @param {Array<{name: string, path: string, content: string}>} files
 * @returns {Promise<number>}
 */
export async function calculateExactZipSize(files) {
  if (!files || files.length === 0) return 0;
  const zip = new JSZip();

  for (const file of files) {
    const filePath = (file.path || file.name || '').replace(/^[\\/]+/, '');
    zip.file(filePath, file.content);
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  return blob.size;
}
