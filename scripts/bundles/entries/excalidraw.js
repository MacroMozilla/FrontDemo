/* Excalidraw with the React it renders through. Built as an ES module so
   its language packs and export helpers stay in chunks that load only when
   used. The fonts it draws with are copied next to this file. */
import './excalidraw-assets.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
export * from '@excalidraw/excalidraw';
export { React, ReactDOM };
