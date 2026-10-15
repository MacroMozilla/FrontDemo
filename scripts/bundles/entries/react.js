/* React stopped publishing browser builds in version 19. This puts one copy
   each of React and ReactDOM (with createRoot from react-dom/client) on
   window, as the old UMD files did. */
import * as React from 'react';
import * as ReactDOMBase from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
globalThis.React = React;
globalThis.ReactDOM = Object.assign({}, ReactDOMBase, ReactDOMClient);
