/* luma.gl registers itself as globalThis.luma when its module runs, and
   throws if another version is already there. cosmos.gl's luma.gl (9.3) and
   deck.gl's (9.4) live in separate bundles on one page, so this bundle puts
   any luma.gl already registered aside while its own starts... */
globalThis.__lumaAside = { had: 'luma' in globalThis, luma: globalThis.luma };
delete globalThis.luma;
