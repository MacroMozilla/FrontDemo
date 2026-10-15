/* AutoAnimate only publishes ES modules. The module as the global
   AutoAnimateNS, and the function itself as autoAnimate. */
import autoAnimate from '@formkit/auto-animate';
export * from '@formkit/auto-animate';
export { autoAnimate as default };
globalThis.autoAnimate = autoAnimate;
