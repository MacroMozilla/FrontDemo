/* pdf.js only publishes ES modules since version 4; as the global pdfjsLib,
   which is what its old browser build was called. This is its "legacy"
   build, the one pdf.js points to for browsers without the newest
   JavaScript built-ins (the modern build needs Map#getOrInsertComputed). */
export * from 'pdfjs-dist/legacy/build/pdf.mjs';
