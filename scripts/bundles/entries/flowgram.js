/* FlowGram's free-layout editor, the two plugins its starter template uses,
   and the React it renders through, as one global: FlowGram. */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
export * from '@flowgram.ai/free-layout-editor';
export { createMinimapPlugin, MinimapRender } from '@flowgram.ai/minimap-plugin';
export { createFreeSnapPlugin } from '@flowgram.ai/free-snap-plugin';
export { React, ReactDOM };
