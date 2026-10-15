/* Preact 11 only publishes ES modules. This puts the three globals a
   no-build page uses on window: preact, preactHooks and htm, sharing one
   copy of preact. */
import * as preact from 'preact';
import * as preactHooks from 'preact/hooks';
import htm from 'htm';
Object.assign(globalThis, { preact, preactHooks, htm });
