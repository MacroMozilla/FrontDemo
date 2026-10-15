/* Imported first, so that Excalidraw looks for its fonts in vendor/excalidraw/
   (where build.mjs copies them) before it falls back to its CDN. */
globalThis.EXCALIDRAW_ASSET_PATH = new URL('./', import.meta.url).href;
