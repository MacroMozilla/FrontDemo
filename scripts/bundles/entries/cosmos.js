/* cosmos.gl only publishes ES modules and renders through luma.gl, a peer
   dependency at a different version from deck.gl's, so it is installed in
   the workspace cosmos/ (see its package.json). The global Cosmos carries
   Cosmos.Graph and every other named export of @cosmos.gl/graph.

   Imports run in order: the two luma files keep this bundle's luma.gl from
   clashing with deck.gl's on the same page (see cosmos/luma-before.js). */
import '../cosmos/luma-before.js';
export * from '../cosmos/index.js';
import '../cosmos/luma-after.js';
