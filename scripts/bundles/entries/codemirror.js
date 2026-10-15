/* CodeMirror 6 is a family of ES modules; the parts the demo uses, as the
   global CM. One copy of @codemirror/state and /view serves them all. */
export { basicSetup } from 'codemirror';
export { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
export { EditorState, Compartment } from '@codemirror/state';
export { indentWithTab } from '@codemirror/commands';
export { openSearchPanel } from '@codemirror/search';
export { javascript } from '@codemirror/lang-javascript';
export { html } from '@codemirror/lang-html';
export { oneDark } from '@codemirror/theme-one-dark';
