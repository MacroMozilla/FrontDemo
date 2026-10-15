/* Vue Flow from its ES modules, as the global VueFlowCore, rendering through
   the page's Vue (vendor/vue.js; see SHARED in build.mjs). Its own browser
   build, dist/vue-flow-core.iife.js, throws "production is not defined"
   whenever it checks for development mode. */
export * from '@vue-flow/core';
