/* X6 as npm and bundler users get it. The dist/x6.min.js UMD file in the
   package leaves out the plugins' graph methods (graph.bindKey, graph.undo,
   graph.copy…) that X6's docs use, so it is rebuilt from the ES modules. */
export * from '@antv/x6';
