/* Reagraph with the React it renders through, as one global: Reagraph.
   Reagraph.React / Reagraph.ReactDOM plus every named export of reagraph. */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
export * from 'reagraph';
export { React, ReactDOM };
