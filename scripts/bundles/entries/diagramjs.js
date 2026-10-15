/* diagram-js only publishes ES modules: the diagram, the editing modules the
   demo switches on, and for the demo's own renderer the BaseRenderer it
   extends and tiny-svg (which diagram-js draws with), as the global DJS. */
export { default as Diagram } from 'diagram-js';
export { default as BendpointsModule } from 'diagram-js/lib/features/bendpoints';
export { default as ConnectModule } from 'diagram-js/lib/features/connect';
export { default as LassoToolModule } from 'diagram-js/lib/features/lasso-tool';
export { default as ModelingModule } from 'diagram-js/lib/features/modeling';
export { default as MoveModule } from 'diagram-js/lib/features/move';
export { default as OutlineModule } from 'diagram-js/lib/features/outline';
export { default as ResizeModule } from 'diagram-js/lib/features/resize';
export { default as RulesModule } from 'diagram-js/lib/features/rules';
export { default as SelectionModule } from 'diagram-js/lib/features/selection';
export { default as MoveCanvasModule } from 'diagram-js/lib/navigation/movecanvas';
export { default as ZoomScrollModule } from 'diagram-js/lib/navigation/zoomscroll';
export { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
export { default as BaseRenderer } from 'diagram-js/lib/draw/BaseRenderer';
