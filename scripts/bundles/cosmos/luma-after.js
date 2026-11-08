/* ...and then puts it back (or leaves none), so a deck.gl loaded later
   starts its own without finding this one. luma.gl only reads the global
   at start-up; each copy keeps using its own module-level instance. */
const aside = globalThis.__lumaAside;
delete globalThis.__lumaAside;
if (aside.had) globalThis.luma = aside.luma; else delete globalThis.luma;
