var SigmaLib=(()=>{var Xi=Object.create;var Ot=Object.defineProperty;var qi=Object.getOwnPropertyDescriptor;var Yi=Object.getOwnPropertyNames;var Ki=Object.getPrototypeOf,Zi=Object.prototype.hasOwnProperty;var Ra=(a,n)=>()=>{try{return n||a((n={exports:{}}).exports,n),n.exports}catch(t){throw n=0,t}},Qi=(a,n)=>{for(var t in n)Ot(a,t,{get:n[t],enumerable:!0})},wa=(a,n,t,e)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of Yi(n))!Zi.call(a,r)&&r!==t&&Ot(a,r,{get:()=>n[r],enumerable:!(e=qi(n,r))||e.enumerable});return a};var Me=(a,n,t)=>(t=a!=null?Xi(Ki(a)):{},wa(n||!a||!a.__esModule?Ot(t,"default",{value:a,enumerable:!0}):t,a)),Ji=a=>wa(Ot({},"__esModule",{value:!0}),a);var Ke=Ra((zd,kn)=>{"use strict";var Ye=typeof Reflect=="object"?Reflect:null,Ca=Ye&&typeof Ye.apply=="function"?Ye.apply:function(n,t,e){return Function.prototype.apply.call(n,t,e)},Ht;Ye&&typeof Ye.ownKeys=="function"?Ht=Ye.ownKeys:Object.getOwnPropertySymbols?Ht=function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Ht=function(n){return Object.getOwnPropertyNames(n)};function eo(a){console&&console.warn&&console.warn(a)}var ka=Number.isNaN||function(n){return n!==n};function J(){J.init.call(this)}kn.exports=J;kn.exports.once=ro;J.EventEmitter=J;J.prototype._events=void 0;J.prototype._eventsCount=0;J.prototype._maxListeners=void 0;var La=10;function $t(a){if(typeof a!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof a)}Object.defineProperty(J,"defaultMaxListeners",{enumerable:!0,get:function(){return La},set:function(a){if(typeof a!="number"||a<0||ka(a))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+a+".");La=a}});J.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};J.prototype.setMaxListeners=function(n){if(typeof n!="number"||n<0||ka(n))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+n+".");return this._maxListeners=n,this};function Pa(a){return a._maxListeners===void 0?J.defaultMaxListeners:a._maxListeners}J.prototype.getMaxListeners=function(){return Pa(this)};J.prototype.emit=function(n){for(var t=[],e=1;e<arguments.length;e++)t.push(arguments[e]);var r=n==="error",i=this._events;if(i!==void 0)r=r&&i.error===void 0;else if(!r)return!1;if(r){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=i[n];if(l===void 0)return!1;if(typeof l=="function")Ca(l,this,t);else for(var u=l.length,d=Ma(l,u),e=0;e<u;++e)Ca(d[e],this,t);return!0};function Fa(a,n,t,e){var r,i,o;if($t(t),i=a._events,i===void 0?(i=a._events=Object.create(null),a._eventsCount=0):(i.newListener!==void 0&&(a.emit("newListener",n,t.listener?t.listener:t),i=a._events),o=i[n]),o===void 0)o=i[n]=t,++a._eventsCount;else if(typeof o=="function"?o=i[n]=e?[t,o]:[o,t]:e?o.unshift(t):o.push(t),r=Pa(a),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(n)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=a,s.type=n,s.count=o.length,eo(s)}return a}J.prototype.addListener=function(n,t){return Fa(this,n,t,!1)};J.prototype.on=J.prototype.addListener;J.prototype.prependListener=function(n,t){return Fa(this,n,t,!0)};function to(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Ia(a,n,t){var e={fired:!1,wrapFn:void 0,target:a,type:n,listener:t},r=to.bind(e);return r.listener=t,e.wrapFn=r,r}J.prototype.once=function(n,t){return $t(t),this.on(n,Ia(this,n,t)),this};J.prototype.prependOnceListener=function(n,t){return $t(t),this.prependListener(n,Ia(this,n,t)),this};J.prototype.removeListener=function(n,t){var e,r,i,o,s;if($t(t),r=this._events,r===void 0)return this;if(e=r[n],e===void 0)return this;if(e===t||e.listener===t)--this._eventsCount===0?this._events=Object.create(null):(delete r[n],r.removeListener&&this.emit("removeListener",n,e.listener||t));else if(typeof e!="function"){for(i=-1,o=e.length-1;o>=0;o--)if(e[o]===t||e[o].listener===t){s=e[o].listener,i=o;break}if(i<0)return this;i===0?e.shift():no(e,i),e.length===1&&(r[n]=e[0]),r.removeListener!==void 0&&this.emit("removeListener",n,s||t)}return this};J.prototype.off=J.prototype.removeListener;J.prototype.removeAllListeners=function(n){var t,e,r;if(e=this._events,e===void 0)return this;if(e.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):e[n]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete e[n]),this;if(arguments.length===0){var i=Object.keys(e),o;for(r=0;r<i.length;++r)o=i[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(t=e[n],typeof t=="function")this.removeListener(n,t);else if(t!==void 0)for(r=t.length-1;r>=0;r--)this.removeListener(n,t[r]);return this};function Ga(a,n,t){var e=a._events;if(e===void 0)return[];var r=e[n];return r===void 0?[]:typeof r=="function"?t?[r.listener||r]:[r]:t?ao(r):Ma(r,r.length)}J.prototype.listeners=function(n){return Ga(this,n,!0)};J.prototype.rawListeners=function(n){return Ga(this,n,!1)};J.listenerCount=function(a,n){return typeof a.listenerCount=="function"?a.listenerCount(n):Na.call(a,n)};J.prototype.listenerCount=Na;function Na(a){var n=this._events;if(n!==void 0){var t=n[a];if(typeof t=="function")return 1;if(t!==void 0)return t.length}return 0}J.prototype.eventNames=function(){return this._eventsCount>0?Ht(this._events):[]};function Ma(a,n){for(var t=new Array(n),e=0;e<n;++e)t[e]=a[e];return t}function no(a,n){for(;n+1<a.length;n++)a[n]=a[n+1];a.pop()}function ao(a){for(var n=new Array(a.length),t=0;t<n.length;++t)n[t]=a[t].listener||a[t];return n}function ro(a,n){return new Promise(function(t,e){function r(o){a.removeListener(n,i),e(o)}function i(){typeof a.removeListener=="function"&&a.removeListener("error",r),t([].slice.call(arguments))}za(a,n,i,{once:!0}),n!=="error"&&io(a,r,{once:!0})})}function io(a,n,t){typeof a.on=="function"&&za(a,"error",n,t)}function za(a,n,t,e){if(typeof a.on=="function")e.once?a.once(n,t):a.on(n,t);else if(typeof a.addEventListener=="function")a.addEventListener(n,function r(i){e.once&&a.removeEventListener(n,r),t(i)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof a)}});var ta=Ra((Qd,Dr)=>{Dr.exports=function(n){return n!==null&&typeof n=="object"&&typeof n.addUndirectedEdgeWithKey=="function"&&typeof n.dropNode=="function"&&typeof n.multi=="boolean"}});var Nd={};Qi(Nd,{DEFAULT_STYLES:()=>Qn,Graph:()=>ee,Sigma:()=>Wi});var Oa=Me(Ke(),1);function oo(){let a=arguments[0];for(let n=1,t=arguments.length;n<t;n++)if(arguments[n])for(let e in arguments[n])a[e]=arguments[n][e];return a}var ie=oo;typeof Object.assign=="function"&&(ie=Object.assign);function ge(a,n,t,e){let r=a._nodes.get(n),i=null;return r&&(e==="mixed"?i=r.out&&r.out[t]||r.undirected&&r.undirected[t]:e==="directed"?i=r.out&&r.out[t]:i=r.undirected&&r.undirected[t]),i}function oe(a){return typeof a=="object"&&a!==null}function Ha(a){let n;for(n in a)return!1;return!0}function fe(a,n,t){Object.defineProperty(a,n,{enumerable:!1,configurable:!1,writable:!0,value:t})}function xe(a,n,t){let e={enumerable:!0,configurable:!0};typeof t=="function"?e.get=t:(e.value=t,e.writable=!1),Object.defineProperty(a,n,e)}function Wa(a){return!(!oe(a)||a.attributes&&!Array.isArray(a.attributes))}function so(){let a=Math.floor(Math.random()*256)&255;return()=>a++}function Ee(){let a=arguments,n=null,t=-1;return{[Symbol.iterator](){return this},next(){let e=null;do{if(n===null){if(t++,t>=a.length)return{done:!0};n=a[t][Symbol.iterator]()}if(e=n.next(),e.done){n=null;continue}break}while(!0);return e}}}function Qe(){return{[Symbol.iterator](){return this},next(){return{done:!0}}}}var xt=class extends Error{constructor(n){super(),this.name="GraphError",this.message=n}},U=class a extends xt{constructor(n){super(n),this.name="InvalidArgumentsGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,a.prototype.constructor)}},B=class a extends xt{constructor(n){super(n),this.name="NotFoundGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,a.prototype.constructor)}},j=class a extends xt{constructor(n){super(n),this.name="UsageGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,a.prototype.constructor)}};function $a(a,n){this.key=a,this.attributes=n,this.clear()}$a.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={}};function Va(a,n){this.key=a,this.attributes=n,this.clear()}Va.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={}};function ja(a,n){this.key=a,this.attributes=n,this.clear()}ja.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={}};function Je(a,n,t,e,r){this.key=n,this.attributes=r,this.undirected=a,this.source=t,this.target=e}Je.prototype.attach=function(){let a="out",n="in";this.undirected&&(a=n="undirected");let t=this.source.key,e=this.target.key;this.source[a][e]=this,!(this.undirected&&t===e)&&(this.target[n][t]=this)};Je.prototype.attachMulti=function(){let a="out",n="in",t=this.source.key,e=this.target.key;this.undirected&&(a=n="undirected");let r=this.source[a],i=r[e];if(typeof i>"u"){r[e]=this,this.undirected&&t===e||(this.target[n][t]=this);return}i.previous=this,this.next=i,r[e]=this,this.target[n][t]=this};Je.prototype.detach=function(){let a=this.source.key,n=this.target.key,t="out",e="in";this.undirected&&(t=e="undirected"),delete this.source[t][n],delete this.target[e][a]};Je.prototype.detachMulti=function(){let a=this.source.key,n=this.target.key,t="out",e="in";this.undirected&&(t=e="undirected"),this.previous===void 0?this.next===void 0?(delete this.source[t][n],delete this.target[e][a]):(this.next.previous=void 0,this.source[t][n]=this.next,this.target[e][a]=this.next):(this.previous.next=this.next,this.next!==void 0&&(this.next.previous=this.previous))};var Xa=0,qa=1,lo=2,Ya=3;function Ae(a,n,t,e,r,i,o){let s,l,u,d;if(e=""+e,t===Xa){if(s=a._nodes.get(e),!s)throw new B(`Graph.${n}: could not find the "${e}" node in the graph.`);u=r,d=i}else if(t===Ya){if(r=""+r,l=a._edges.get(r),!l)throw new B(`Graph.${n}: could not find the "${r}" edge in the graph.`);let h=l.source.key,c=l.target.key;if(e===h)s=l.target;else if(e===c)s=l.source;else throw new B(`Graph.${n}: the "${e}" node is not attached to the "${r}" edge (${h}, ${c}).`);u=i,d=o}else{if(l=a._edges.get(e),!l)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`);t===qa?s=l.source:s=l.target,u=r,d=i}return[s,u,d]}function uo(a,n,t){a.prototype[n]=function(e,r,i){let[o,s]=Ae(this,n,t,e,r,i);return o.attributes[s]}}function ho(a,n,t){a.prototype[n]=function(e,r){let[i]=Ae(this,n,t,e,r);return i.attributes}}function co(a,n,t){a.prototype[n]=function(e,r,i){let[o,s]=Ae(this,n,t,e,r,i);return o.attributes.hasOwnProperty(s)}}function fo(a,n,t){a.prototype[n]=function(e,r,i,o){let[s,l,u]=Ae(this,n,t,e,r,i,o);return s.attributes[l]=u,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function go(a,n,t){a.prototype[n]=function(e,r,i,o){let[s,l,u]=Ae(this,n,t,e,r,i,o);if(typeof u!="function")throw new U(`Graph.${n}: updater should be a function.`);let d=s.attributes,h=u(d[l]);return d[l]=h,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function vo(a,n,t){a.prototype[n]=function(e,r,i){let[o,s]=Ae(this,n,t,e,r,i);return delete o.attributes[s],this.emit("nodeAttributesUpdated",{key:o.key,type:"remove",attributes:o.attributes,name:s}),this}}function po(a,n,t){a.prototype[n]=function(e,r,i){let[o,s]=Ae(this,n,t,e,r,i);if(!oe(s))throw new U(`Graph.${n}: provided attributes are not a plain object.`);return o.attributes=s,this.emit("nodeAttributesUpdated",{key:o.key,type:"replace",attributes:o.attributes}),this}}function mo(a,n,t){a.prototype[n]=function(e,r,i){let[o,s]=Ae(this,n,t,e,r,i);if(!oe(s))throw new U(`Graph.${n}: provided attributes are not a plain object.`);return ie(o.attributes,s),this.emit("nodeAttributesUpdated",{key:o.key,type:"merge",attributes:o.attributes,data:s}),this}}function yo(a,n,t){a.prototype[n]=function(e,r,i){let[o,s]=Ae(this,n,t,e,r,i);if(typeof s!="function")throw new U(`Graph.${n}: provided updater is not a function.`);return o.attributes=s(o.attributes),this.emit("nodeAttributesUpdated",{key:o.key,type:"update",attributes:o.attributes}),this}}var bo=[{name:a=>`get${a}Attribute`,attacher:uo},{name:a=>`get${a}Attributes`,attacher:ho},{name:a=>`has${a}Attribute`,attacher:co},{name:a=>`set${a}Attribute`,attacher:fo},{name:a=>`update${a}Attribute`,attacher:go},{name:a=>`remove${a}Attribute`,attacher:vo},{name:a=>`replace${a}Attributes`,attacher:po},{name:a=>`merge${a}Attributes`,attacher:mo},{name:a=>`update${a}Attributes`,attacher:yo}];function xo(a){bo.forEach(function({name:n,attacher:t}){t(a,n("Node"),Xa),t(a,n("Source"),qa),t(a,n("Target"),lo),t(a,n("Opposite"),Ya)})}function _o(a,n,t){a.prototype[n]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=ge(this,o,s,t),!i)throw new B(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}return i.attributes[r]}}function To(a,n,t){a.prototype[n]=function(e){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>1){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let i=""+e,o=""+arguments[1];if(r=ge(this,i,o,t),!r)throw new B(`Graph.${n}: could not find an edge for the given path ("${i}" - "${o}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,r=this._edges.get(e),!r)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}return r.attributes}}function So(a,n,t){a.prototype[n]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=ge(this,o,s,t),!i)throw new B(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}return i.attributes.hasOwnProperty(r)}}function Eo(a,n,t){a.prototype[n]=function(e,r,i){let o;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let s=""+e,l=""+r;if(r=arguments[2],i=arguments[3],o=ge(this,s,l,t),!o)throw new B(`Graph.${n}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,o=this._edges.get(e),!o)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}function Ao(a,n,t){a.prototype[n]=function(e,r,i){let o;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let s=""+e,l=""+r;if(r=arguments[2],i=arguments[3],o=ge(this,s,l,t),!o)throw new B(`Graph.${n}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,o=this._edges.get(e),!o)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}if(typeof i!="function")throw new U(`Graph.${n}: updater should be a function.`);return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}function Do(a,n,t){a.prototype[n]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=ge(this,o,s,t),!i)throw new B(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}function Ro(a,n,t){a.prototype[n]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=ge(this,o,s,t),!i)throw new B(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}if(!oe(r))throw new U(`Graph.${n}: provided attributes are not a plain object.`);return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}function wo(a,n,t){a.prototype[n]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=ge(this,o,s,t),!i)throw new B(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}if(!oe(r))throw new U(`Graph.${n}: provided attributes are not a plain object.`);return ie(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}function Co(a,n,t){a.prototype[n]=function(e,r){let i;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new j(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new j(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+e,s=""+r;if(r=arguments[2],i=ge(this,o,s,t),!i)throw new B(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new j(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(e=""+e,i=this._edges.get(e),!i)throw new B(`Graph.${n}: could not find the "${e}" edge in the graph.`)}if(typeof r!="function")throw new U(`Graph.${n}: provided updater is not a function.`);return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this}}var Lo=[{name:a=>`get${a}Attribute`,attacher:_o},{name:a=>`get${a}Attributes`,attacher:To},{name:a=>`has${a}Attribute`,attacher:So},{name:a=>`set${a}Attribute`,attacher:Eo},{name:a=>`update${a}Attribute`,attacher:Ao},{name:a=>`remove${a}Attribute`,attacher:Do},{name:a=>`replace${a}Attributes`,attacher:Ro},{name:a=>`merge${a}Attributes`,attacher:wo},{name:a=>`update${a}Attributes`,attacher:Co}];function ko(a){Lo.forEach(function({name:n,attacher:t}){t(a,n("Edge"),"mixed"),t(a,n("DirectedEdge"),"directed"),t(a,n("UndirectedEdge"),"undirected")})}var Po=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function Fo(a,n,t,e){let r=!1;for(let i in n){if(i===e)continue;let o=n[i];if(r=t(o.key,o.attributes,o.source.key,o.target.key,o.source.attributes,o.target.attributes,o.undirected),a&&r)return o.key}}function Io(a,n,t,e){let r,i,o,s=!1;for(let l in n)if(l!==e){r=n[l];do{if(i=r.source,o=r.target,s=t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected),a&&s)return r.key;r=r.next}while(r!==void 0)}}function Pn(a,n){let t=Object.keys(a),e=t.length,r,i=0;return{[Symbol.iterator](){return this},next(){do if(r)r=r.next;else{if(i>=e)return{done:!0};let o=t[i++];if(o===n){r=void 0;continue}r=a[o]}while(!r);return{done:!1,value:{edge:r.key,attributes:r.attributes,source:r.source.key,target:r.target.key,sourceAttributes:r.source.attributes,targetAttributes:r.target.attributes,undirected:r.undirected}}}}}function Go(a,n,t,e){let r=n[t];if(!r)return;let i=r.source,o=r.target;if(e(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected)&&a)return r.key}function No(a,n,t,e){let r=n[t];if(!r)return;let i=!1;do{if(i=e(r.key,r.attributes,r.source.key,r.target.key,r.source.attributes,r.target.attributes,r.undirected),a&&i)return r.key;r=r.next}while(r!==void 0)}function Fn(a,n){let t=a[n];if(t.next!==void 0)return{[Symbol.iterator](){return this},next(){if(!t)return{done:!0};let r={edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected};return t=t.next,{done:!1,value:r}}};let e=!1;return{[Symbol.iterator](){return this},next(){return e===!0?{done:!0}:(e=!0,{done:!1,value:{edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected}})}}}function Mo(a,n){if(a.size===0)return[];if(n==="mixed"||n===a.type)return Array.from(a._edges.keys());let t=n==="undirected"?a.undirectedSize:a.directedSize,e=new Array(t),r=n==="undirected",i=a._edges.values(),o=0,s,l;for(;s=i.next(),s.done!==!0;)l=s.value,l.undirected===r&&(e[o++]=l.key);return e}function Ka(a,n,t,e){if(n.size===0)return;let r=t!=="mixed"&&t!==n.type,i=t==="undirected",o,s,l=!1,u=n._edges.values();for(;o=u.next(),o.done!==!0;){if(s=o.value,r&&s.undirected!==i)continue;let{key:d,attributes:h,source:c,target:f}=s;if(l=e(d,h,c.key,f.key,c.attributes,f.attributes,s.undirected),a&&l)return d}}function zo(a,n){if(a.size===0)return Qe();let t=n!=="mixed"&&n!==a.type,e=n==="undirected",r=a._edges.values();return{[Symbol.iterator](){return this},next(){let i,o;for(;;){if(i=r.next(),i.done)return i;if(o=i.value,!(t&&o.undirected!==e))break}return{value:{edge:o.key,attributes:o.attributes,source:o.source.key,target:o.target.key,sourceAttributes:o.source.attributes,targetAttributes:o.target.attributes,undirected:o.undirected},done:!1}}}}function In(a,n,t,e,r,i){let o=n?Io:Fo,s;if(t!=="undirected"&&(e!=="out"&&(s=o(a,r.in,i),a&&s)||e!=="in"&&(s=o(a,r.out,i,e?void 0:r.key),a&&s))||t!=="directed"&&(s=o(a,r.undirected,i),a&&s))return s}function Wo(a,n,t,e){let r=[];return In(!1,a,n,t,e,function(i){r.push(i)}),r}function Bo(a,n,t){let e=Qe();return a!=="undirected"&&(n!=="out"&&typeof t.in<"u"&&(e=Ee(e,Pn(t.in))),n!=="in"&&typeof t.out<"u"&&(e=Ee(e,Pn(t.out,n?void 0:t.key)))),a!=="directed"&&typeof t.undirected<"u"&&(e=Ee(e,Pn(t.undirected))),e}function Gn(a,n,t,e,r,i,o){let s=t?No:Go,l;if(n!=="undirected"&&(typeof r.in<"u"&&e!=="out"&&(l=s(a,r.in,i,o),a&&l)||typeof r.out<"u"&&e!=="in"&&(e||r.key!==i)&&(l=s(a,r.out,i,o),a&&l))||n!=="directed"&&typeof r.undirected<"u"&&(l=s(a,r.undirected,i,o),a&&l))return l}function Uo(a,n,t,e,r){let i=[];return Gn(!1,a,n,t,e,r,function(o){i.push(o)}),i}function Oo(a,n,t,e){let r=Qe();return a!=="undirected"&&(typeof t.in<"u"&&n!=="out"&&e in t.in&&(r=Ee(r,Fn(t.in,e))),typeof t.out<"u"&&n!=="in"&&e in t.out&&(n||t.key!==e)&&(r=Ee(r,Fn(t.out,e)))),a!=="directed"&&typeof t.undirected<"u"&&e in t.undirected&&(r=Ee(r,Fn(t.undirected,e))),r}function Ho(a,n){let{name:t,type:e,direction:r}=n;a.prototype[t]=function(i,o){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return[];if(!arguments.length)return Mo(this,e);if(arguments.length===1){i=""+i;let s=this._nodes.get(i);if(typeof s>"u")throw new B(`Graph.${t}: could not find the "${i}" node in the graph.`);return Wo(this.multi,e==="mixed"?this.type:e,r,s)}if(arguments.length===2){i=""+i,o=""+o;let s=this._nodes.get(i);if(!s)throw new B(`Graph.${t}:  could not find the "${i}" source node in the graph.`);if(!this._nodes.has(o))throw new B(`Graph.${t}:  could not find the "${o}" target node in the graph.`);return Uo(e,this.multi,r,s,o)}throw new U(`Graph.${t}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function $o(a,n){let{name:t,type:e,direction:r}=n,i="forEach"+t[0].toUpperCase()+t.slice(1,-1);a.prototype[i]=function(u,d,h){if(!(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)){if(arguments.length===1)return h=u,Ka(!1,this,e,h);if(arguments.length===2){u=""+u,h=d;let c=this._nodes.get(u);if(typeof c>"u")throw new B(`Graph.${i}: could not find the "${u}" node in the graph.`);return In(!1,this.multi,e==="mixed"?this.type:e,r,c,h)}if(arguments.length===3){u=""+u,d=""+d;let c=this._nodes.get(u);if(!c)throw new B(`Graph.${i}:  could not find the "${u}" source node in the graph.`);if(!this._nodes.has(d))throw new B(`Graph.${i}:  could not find the "${d}" target node in the graph.`);return Gn(!1,e,this.multi,r,c,d,h)}throw new U(`Graph.${i}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)}};let o="map"+t[0].toUpperCase()+t.slice(1);a.prototype[o]=function(){let u=Array.prototype.slice.call(arguments),d=u.pop(),h;if(u.length===0){let c=0;e!=="directed"&&(c+=this.undirectedSize),e!=="undirected"&&(c+=this.directedSize),h=new Array(c);let f=0;u.push((v,y,m,g,p,b,x)=>{h[f++]=d(v,y,m,g,p,b,x)})}else h=[],u.push((c,f,v,y,m,g,p)=>{h.push(d(c,f,v,y,m,g,p))});return this[i].apply(this,u),h};let s="filter"+t[0].toUpperCase()+t.slice(1);a.prototype[s]=function(){let u=Array.prototype.slice.call(arguments),d=u.pop(),h=[];return u.push((c,f,v,y,m,g,p)=>{d(c,f,v,y,m,g,p)&&h.push(c)}),this[i].apply(this,u),h};let l="reduce"+t[0].toUpperCase()+t.slice(1);a.prototype[l]=function(){let u=Array.prototype.slice.call(arguments);if(u.length<2||u.length>4)throw new U(`Graph.${l}: invalid number of arguments (expecting 2, 3 or 4 and got ${u.length}).`);if(typeof u[u.length-1]=="function"&&typeof u[u.length-2]!="function")throw new U(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let d,h;u.length===2?(d=u[0],h=u[1],u=[]):u.length===3?(d=u[1],h=u[2],u=[u[0]]):u.length===4&&(d=u[2],h=u[3],u=[u[0],u[1]]);let c=h;return u.push((f,v,y,m,g,p,b)=>{c=d(c,f,v,y,m,g,p,b)}),this[i].apply(this,u),c}}function Vo(a,n){let{name:t,type:e,direction:r}=n,i="find"+t[0].toUpperCase()+t.slice(1,-1);a.prototype[i]=function(l,u,d){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return!1;if(arguments.length===1)return d=l,Ka(!0,this,e,d);if(arguments.length===2){l=""+l,d=u;let h=this._nodes.get(l);if(typeof h>"u")throw new B(`Graph.${i}: could not find the "${l}" node in the graph.`);return In(!0,this.multi,e==="mixed"?this.type:e,r,h,d)}if(arguments.length===3){l=""+l,u=""+u;let h=this._nodes.get(l);if(!h)throw new B(`Graph.${i}:  could not find the "${l}" source node in the graph.`);if(!this._nodes.has(u))throw new B(`Graph.${i}:  could not find the "${u}" target node in the graph.`);return Gn(!0,e,this.multi,r,h,u,d)}throw new U(`Graph.${i}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)};let o="some"+t[0].toUpperCase()+t.slice(1,-1);a.prototype[o]=function(){let l=Array.prototype.slice.call(arguments),u=l.pop();return l.push((h,c,f,v,y,m,g)=>u(h,c,f,v,y,m,g)),!!this[i].apply(this,l)};let s="every"+t[0].toUpperCase()+t.slice(1,-1);a.prototype[s]=function(){let l=Array.prototype.slice.call(arguments),u=l.pop();return l.push((h,c,f,v,y,m,g)=>!u(h,c,f,v,y,m,g)),!this[i].apply(this,l)}}function jo(a,n){let{name:t,type:e,direction:r}=n,i=t.slice(0,-1)+"Entries";a.prototype[i]=function(o,s){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return Qe();if(!arguments.length)return zo(this,e);if(arguments.length===1){o=""+o;let l=this._nodes.get(o);if(!l)throw new B(`Graph.${i}: could not find the "${o}" node in the graph.`);return Bo(e,r,l)}if(arguments.length===2){o=""+o,s=""+s;let l=this._nodes.get(o);if(!l)throw new B(`Graph.${i}:  could not find the "${o}" source node in the graph.`);if(!this._nodes.has(s))throw new B(`Graph.${i}:  could not find the "${s}" target node in the graph.`);return Oo(e,r,l,s)}throw new U(`Graph.${i}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function Xo(a){Po.forEach(n=>{Ho(a,n),$o(a,n),Vo(a,n),jo(a,n)})}var qo=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function Zt(){this.A=null,this.B=null}Zt.prototype.wrap=function(a){this.A===null?this.A=a:this.B===null&&(this.B=a)};Zt.prototype.has=function(a){return this.A!==null&&a in this.A||this.B!==null&&a in this.B};function yt(a,n,t,e,r){for(let i in e){let o=e[i],s=o.source,l=o.target,u=s===t?l:s;if(n&&n.has(u.key))continue;let d=r(u.key,u.attributes);if(a&&d)return u.key}}function Nn(a,n,t,e,r){if(n!=="mixed"){if(n==="undirected")return yt(a,null,e,e.undirected,r);if(typeof t=="string")return yt(a,null,e,e[t],r)}let i=new Zt,o;if(n!=="undirected"){if(t!=="out"){if(o=yt(a,null,e,e.in,r),a&&o)return o;i.wrap(e.in)}if(t!=="in"){if(o=yt(a,i,e,e.out,r),a&&o)return o;i.wrap(e.out)}}if(n!=="directed"&&(o=yt(a,i,e,e.undirected,r),a&&o))return o}function Yo(a,n,t){if(a!=="mixed"){if(a==="undirected")return Object.keys(t.undirected);if(typeof n=="string")return Object.keys(t[n])}let e=[];return Nn(!1,a,n,t,function(r){e.push(r)}),e}function bt(a,n,t){let e=Object.keys(t),r=e.length,i=0;return{[Symbol.iterator](){return this},next(){let o=null;do{if(i>=r)return a&&a.wrap(t),{done:!0};let s=t[e[i++]],l=s.source,u=s.target;if(o=l===n?u:l,a&&a.has(o.key)){o=null;continue}}while(o===null);return{done:!1,value:{neighbor:o.key,attributes:o.attributes}}}}}function Ko(a,n,t){if(a!=="mixed"){if(a==="undirected")return bt(null,t,t.undirected);if(typeof n=="string")return bt(null,t,t[n])}let e=Qe(),r=new Zt;return a!=="undirected"&&(n!=="out"&&(e=Ee(e,bt(r,t,t.in))),n!=="in"&&(e=Ee(e,bt(r,t,t.out)))),a!=="directed"&&(e=Ee(e,bt(r,t,t.undirected))),e}function Zo(a,n){let{name:t,type:e,direction:r}=n;a.prototype[t]=function(i){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return[];i=""+i;let o=this._nodes.get(i);if(typeof o>"u")throw new B(`Graph.${t}: could not find the "${i}" node in the graph.`);return Yo(e==="mixed"?this.type:e,r,o)}}function Qo(a,n){let{name:t,type:e,direction:r}=n,i="forEach"+t[0].toUpperCase()+t.slice(1,-1);a.prototype[i]=function(u,d){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return;u=""+u;let h=this._nodes.get(u);if(typeof h>"u")throw new B(`Graph.${i}: could not find the "${u}" node in the graph.`);Nn(!1,e==="mixed"?this.type:e,r,h,d)};let o="map"+t[0].toUpperCase()+t.slice(1);a.prototype[o]=function(u,d){let h=[];return this[i](u,(c,f)=>{h.push(d(c,f))}),h};let s="filter"+t[0].toUpperCase()+t.slice(1);a.prototype[s]=function(u,d){let h=[];return this[i](u,(c,f)=>{d(c,f)&&h.push(c)}),h};let l="reduce"+t[0].toUpperCase()+t.slice(1);a.prototype[l]=function(u,d,h){if(arguments.length<3)throw new U(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let c=h;return this[i](u,(f,v)=>{c=d(c,f,v)}),c}}function Jo(a,n){let{name:t,type:e,direction:r}=n,i=t[0].toUpperCase()+t.slice(1,-1),o="find"+i;a.prototype[o]=function(u,d){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return;u=""+u;let h=this._nodes.get(u);if(typeof h>"u")throw new B(`Graph.${o}: could not find the "${u}" node in the graph.`);return Nn(!0,e==="mixed"?this.type:e,r,h,d)};let s="some"+i;a.prototype[s]=function(u,d){return!!this[o](u,d)};let l="every"+i;a.prototype[l]=function(u,d){return!this[o](u,(c,f)=>!d(c,f))}}function es(a,n){let{name:t,type:e,direction:r}=n,i=t.slice(0,-1)+"Entries";a.prototype[i]=function(o){if(e!=="mixed"&&this.type!=="mixed"&&e!==this.type)return Qe();o=""+o;let s=this._nodes.get(o);if(typeof s>"u")throw new B(`Graph.${i}: could not find the "${o}" node in the graph.`);return Ko(e==="mixed"?this.type:e,r,s)}}function ts(a){qo.forEach(n=>{Zo(a,n),Qo(a,n),Jo(a,n),es(a,n)})}function Vt(a,n,t,e,r){let i=e._nodes.values(),o=e.type,s,l,u,d,h,c,f;for(;s=i.next(),s.done!==!0;){let v=!1;if(l=s.value,o!=="undirected"){d=l.out;for(u in d){h=d[u];do{if(c=h.target,v=!0,f=r(l.key,c.key,l.attributes,c.attributes,h.key,h.attributes,h.undirected),a&&f)return h;h=h.next}while(h)}}if(o!=="directed"){d=l.undirected;for(u in d)if(!(n&&l.key>u)){h=d[u];do{if(c=h.target,c.key!==u&&(c=h.source),v=!0,f=r(l.key,c.key,l.attributes,c.attributes,h.key,h.attributes,h.undirected),a&&f)return h;h=h.next}while(h)}}if(t&&!v&&(f=r(l.key,null,l.attributes,null,null,null,null),a&&f))return null}}function ns(a,n){let t={key:a};return Ha(n.attributes)||(t.attributes=ie({},n.attributes)),t}function as(a,n,t){let e={key:n,source:t.source.key,target:t.target.key};return Ha(t.attributes)||(e.attributes=ie({},t.attributes)),a==="mixed"&&t.undirected&&(e.undirected=!0),e}function rs(a){if(!oe(a))throw new U('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in a))throw new U("Graph.import: serialized node is missing its key.");if("attributes"in a&&(!oe(a.attributes)||a.attributes===null))throw new U("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function is(a){if(!oe(a))throw new U('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in a))throw new U("Graph.import: serialized edge is missing its source.");if(!("target"in a))throw new U("Graph.import: serialized edge is missing its target.");if("attributes"in a&&(!oe(a.attributes)||a.attributes===null))throw new U("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in a&&typeof a.undirected!="boolean")throw new U("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}var os=so(),ss=new Set(["directed","undirected","mixed"]),Ba=new Set(["domain","_events","_eventsCount","_maxListeners"]),ls=[{name:a=>`${a}Edge`,generateKey:!0},{name:a=>`${a}DirectedEdge`,generateKey:!0,type:"directed"},{name:a=>`${a}UndirectedEdge`,generateKey:!0,type:"undirected"},{name:a=>`${a}EdgeWithKey`},{name:a=>`${a}DirectedEdgeWithKey`,type:"directed"},{name:a=>`${a}UndirectedEdgeWithKey`,type:"undirected"}],us={allowSelfLoops:!0,multi:!1,type:"mixed"};function ds(a,n,t){if(t&&!oe(t))throw new U(`Graph.addNode: invalid attributes. Expecting an object but got "${t}"`);if(n=""+n,t=t||{},a._nodes.has(n))throw new j(`Graph.addNode: the "${n}" node already exist in the graph.`);let e=new a.NodeDataClass(n,t);return a._nodes.set(n,e),a.emit("nodeAdded",{key:n,attributes:t}),e}function Ua(a,n,t){let e=new a.NodeDataClass(n,t);return a._nodes.set(n,e),a.emit("nodeAdded",{key:n,attributes:t}),e}function Za(a,n,t,e,r,i,o,s){if(!e&&a.type==="undirected")throw new j(`Graph.${n}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);if(e&&a.type==="directed")throw new j(`Graph.${n}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);if(s&&!oe(s))throw new U(`Graph.${n}: invalid attributes. Expecting an object but got "${s}"`);if(i=""+i,o=""+o,s=s||{},!a.allowSelfLoops&&i===o)throw new j(`Graph.${n}: source & target are the same ("${i}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let l=a._nodes.get(i),u=a._nodes.get(o);if(!l)throw new B(`Graph.${n}: source node "${i}" not found.`);if(!u)throw new B(`Graph.${n}: target node "${o}" not found.`);let d={key:null,undirected:e,source:i,target:o,attributes:s};if(t)r=a._edgeKeyGenerator();else if(r=""+r,a._edges.has(r))throw new j(`Graph.${n}: the "${r}" edge already exists in the graph.`);if(!a.multi&&(e?typeof l.undirected[o]<"u":typeof l.out[o]<"u"))throw new j(`Graph.${n}: an edge linking "${i}" to "${o}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);let h=new Je(e,r,l,u,s);a._edges.set(r,h);let c=i===o;return e?(l.undirectedDegree++,u.undirectedDegree++,c&&(l.undirectedLoops++,a._undirectedSelfLoopCount++)):(l.outDegree++,u.inDegree++,c&&(l.directedLoops++,a._directedSelfLoopCount++)),a.multi?h.attachMulti():h.attach(),e?a._undirectedSize++:a._directedSize++,d.key=r,a.emit("edgeAdded",d),r}function hs(a,n,t,e,r,i,o,s,l){if(!e&&a.type==="undirected")throw new j(`Graph.${n}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`);if(e&&a.type==="directed")throw new j(`Graph.${n}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`);if(s){if(l){if(typeof s!="function")throw new U(`Graph.${n}: invalid updater function. Expecting a function but got "${s}"`)}else if(!oe(s))throw new U(`Graph.${n}: invalid attributes. Expecting an object but got "${s}"`)}i=""+i,o=""+o;let u;if(l&&(u=s,s=void 0),!a.allowSelfLoops&&i===o)throw new j(`Graph.${n}: source & target are the same ("${i}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let d=a._nodes.get(i),h=a._nodes.get(o),c,f;if(!t&&(c=a._edges.get(r),c)){if((c.source.key!==i||c.target.key!==o)&&(!e||c.source.key!==o||c.target.key!==i))throw new j(`Graph.${n}: inconsistency detected when attempting to merge the "${r}" edge with "${i}" source & "${o}" target vs. ("${c.source.key}", "${c.target.key}").`);f=c}if(!f&&!a.multi&&d&&(f=e?d.undirected[o]:d.out[o]),f){let p=[f.key,!1,!1,!1];if(l?!u:!s)return p;if(l){let b=f.attributes;f.attributes=u(b),a.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes})}else ie(f.attributes,s),a.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:s});return p}s=s||{},l&&u&&(s=u(s));let v={key:null,undirected:e,source:i,target:o,attributes:s};if(t)r=a._edgeKeyGenerator();else if(r=""+r,a._edges.has(r))throw new j(`Graph.${n}: the "${r}" edge already exists in the graph.`);let y=!1,m=!1;d||(d=Ua(a,i,{}),y=!0,i===o&&(h=d,m=!0)),h||(h=Ua(a,o,{}),m=!0),c=new Je(e,r,d,h,s),a._edges.set(r,c);let g=i===o;return e?(d.undirectedDegree++,h.undirectedDegree++,g&&(d.undirectedLoops++,a._undirectedSelfLoopCount++)):(d.outDegree++,h.inDegree++,g&&(d.directedLoops++,a._directedSelfLoopCount++)),a.multi?c.attachMulti():c.attach(),e?a._undirectedSize++:a._directedSize++,v.key=r,a.emit("edgeAdded",v),[r,!0,y,m]}function Ze(a,n){a._edges.delete(n.key);let{source:t,target:e,attributes:r}=n,i=n.undirected,o=t===e;i?(t.undirectedDegree--,e.undirectedDegree--,o&&(t.undirectedLoops--,a._undirectedSelfLoopCount--)):(t.outDegree--,e.inDegree--,o&&(t.directedLoops--,a._directedSelfLoopCount--)),a.multi?n.detachMulti():n.detach(),i?a._undirectedSize--:a._directedSize--,a.emit("edgeDropped",{key:n.key,attributes:r,source:t.key,target:e.key,undirected:i})}var ee=class a extends Oa.EventEmitter{constructor(n){if(super(),n=ie({},us,n),typeof n.multi!="boolean")throw new U(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${n.multi}".`);if(!ss.has(n.type))throw new U(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${n.type}".`);if(typeof n.allowSelfLoops!="boolean")throw new U(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${n.allowSelfLoops}".`);let t=n.type==="mixed"?$a:n.type==="directed"?Va:ja;fe(this,"NodeDataClass",t);let e="geid_"+os()+"_",r=0,i=()=>{let o;do o=e+r++;while(this._edges.has(o));return o};fe(this,"_attributes",{}),fe(this,"_nodes",new Map),fe(this,"_edges",new Map),fe(this,"_directedSize",0),fe(this,"_undirectedSize",0),fe(this,"_directedSelfLoopCount",0),fe(this,"_undirectedSelfLoopCount",0),fe(this,"_edgeKeyGenerator",i),fe(this,"_options",n),Ba.forEach(o=>fe(this,o,this[o])),xe(this,"order",()=>this._nodes.size),xe(this,"size",()=>this._edges.size),xe(this,"directedSize",()=>this._directedSize),xe(this,"undirectedSize",()=>this._undirectedSize),xe(this,"selfLoopCount",()=>this._directedSelfLoopCount+this._undirectedSelfLoopCount),xe(this,"directedSelfLoopCount",()=>this._directedSelfLoopCount),xe(this,"undirectedSelfLoopCount",()=>this._undirectedSelfLoopCount),xe(this,"multi",this._options.multi),xe(this,"type",this._options.type),xe(this,"allowSelfLoops",this._options.allowSelfLoops),xe(this,"implementation",()=>"graphology")}_resetInstanceCounters(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0}hasNode(n){return this._nodes.has(""+n)}hasDirectedEdge(n,t){if(this.type==="undirected")return!1;if(arguments.length===1){let e=""+n,r=this._edges.get(e);return!!r&&!r.undirected}else if(arguments.length===2){n=""+n,t=""+t;let e=this._nodes.get(n);return e?e.out.hasOwnProperty(t):!1}throw new U(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasUndirectedEdge(n,t){if(this.type==="directed")return!1;if(arguments.length===1){let e=""+n,r=this._edges.get(e);return!!r&&r.undirected}else if(arguments.length===2){n=""+n,t=""+t;let e=this._nodes.get(n);return e?e.undirected.hasOwnProperty(t):!1}throw new U(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasEdge(n,t){if(arguments.length===1){let e=""+n;return this._edges.has(e)}else if(arguments.length===2){n=""+n,t=""+t;let e=this._nodes.get(n);return e?typeof e.out<"u"&&e.out.hasOwnProperty(t)||typeof e.undirected<"u"&&e.undirected.hasOwnProperty(t):!1}throw new U(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}directedEdge(n,t){if(this.type==="undirected")return;if(n=""+n,t=""+t,this.multi)throw new j("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");let e=this._nodes.get(n);if(!e)throw new B(`Graph.directedEdge: could not find the "${n}" source node in the graph.`);if(!this._nodes.has(t))throw new B(`Graph.directedEdge: could not find the "${t}" target node in the graph.`);let r=e.out&&e.out[t]||void 0;if(r)return r.key}undirectedEdge(n,t){if(this.type==="directed")return;if(n=""+n,t=""+t,this.multi)throw new j("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");let e=this._nodes.get(n);if(!e)throw new B(`Graph.undirectedEdge: could not find the "${n}" source node in the graph.`);if(!this._nodes.has(t))throw new B(`Graph.undirectedEdge: could not find the "${t}" target node in the graph.`);let r=e.undirected&&e.undirected[t]||void 0;if(r)return r.key}edge(n,t){if(this.multi)throw new j("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.edge: could not find the "${n}" source node in the graph.`);if(!this._nodes.has(t))throw new B(`Graph.edge: could not find the "${t}" target node in the graph.`);let r=e.out&&e.out[t]||e.undirected&&e.undirected[t]||void 0;if(r)return r.key}areDirectedNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areDirectedNeighbors: could not find the "${n}" node in the graph.`);return this.type==="undirected"?!1:t in e.in||t in e.out}areOutNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areOutNeighbors: could not find the "${n}" node in the graph.`);return this.type==="undirected"?!1:t in e.out}areInNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areInNeighbors: could not find the "${n}" node in the graph.`);return this.type==="undirected"?!1:t in e.in}areUndirectedNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areUndirectedNeighbors: could not find the "${n}" node in the graph.`);return this.type==="directed"?!1:t in e.undirected}areNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areNeighbors: could not find the "${n}" node in the graph.`);return this.type!=="undirected"&&(t in e.in||t in e.out)||this.type!=="directed"&&t in e.undirected}areInboundNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areInboundNeighbors: could not find the "${n}" node in the graph.`);return this.type!=="undirected"&&t in e.in||this.type!=="directed"&&t in e.undirected}areOutboundNeighbors(n,t){n=""+n,t=""+t;let e=this._nodes.get(n);if(!e)throw new B(`Graph.areOutboundNeighbors: could not find the "${n}" node in the graph.`);return this.type!=="undirected"&&t in e.out||this.type!=="directed"&&t in e.undirected}inDegree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.inDegree: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:t.inDegree}outDegree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.outDegree: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:t.outDegree}directedDegree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.directedDegree: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:t.inDegree+t.outDegree}undirectedDegree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.undirectedDegree: could not find the "${n}" node in the graph.`);return this.type==="directed"?0:t.undirectedDegree}inboundDegree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.inboundDegree: could not find the "${n}" node in the graph.`);let e=0;return this.type!=="directed"&&(e+=t.undirectedDegree),this.type!=="undirected"&&(e+=t.inDegree),e}outboundDegree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.outboundDegree: could not find the "${n}" node in the graph.`);let e=0;return this.type!=="directed"&&(e+=t.undirectedDegree),this.type!=="undirected"&&(e+=t.outDegree),e}degree(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.degree: could not find the "${n}" node in the graph.`);let e=0;return this.type!=="directed"&&(e+=t.undirectedDegree),this.type!=="undirected"&&(e+=t.inDegree+t.outDegree),e}inDegreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.inDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:t.inDegree-t.directedLoops}outDegreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.outDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:t.outDegree-t.directedLoops}directedDegreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.directedDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:t.inDegree+t.outDegree-t.directedLoops*2}undirectedDegreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.undirectedDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="directed"?0:t.undirectedDegree-t.undirectedLoops*2}inboundDegreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.inboundDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);let e=0,r=0;return this.type!=="directed"&&(e+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!=="undirected"&&(e+=t.inDegree,r+=t.directedLoops),e-r}outboundDegreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.outboundDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);let e=0,r=0;return this.type!=="directed"&&(e+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!=="undirected"&&(e+=t.outDegree,r+=t.directedLoops),e-r}degreeWithoutSelfLoops(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.degreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);let e=0,r=0;return this.type!=="directed"&&(e+=t.undirectedDegree,r+=t.undirectedLoops*2),this.type!=="undirected"&&(e+=t.inDegree+t.outDegree,r+=t.directedLoops*2),e-r}source(n){n=""+n;let t=this._edges.get(n);if(!t)throw new B(`Graph.source: could not find the "${n}" edge in the graph.`);return t.source.key}target(n){n=""+n;let t=this._edges.get(n);if(!t)throw new B(`Graph.target: could not find the "${n}" edge in the graph.`);return t.target.key}extremities(n){n=""+n;let t=this._edges.get(n);if(!t)throw new B(`Graph.extremities: could not find the "${n}" edge in the graph.`);return[t.source.key,t.target.key]}opposite(n,t){n=""+n,t=""+t;let e=this._edges.get(t);if(!e)throw new B(`Graph.opposite: could not find the "${t}" edge in the graph.`);let r=e.source.key,i=e.target.key;if(n===r)return i;if(n===i)return r;throw new B(`Graph.opposite: the "${n}" node is not attached to the "${t}" edge (${r}, ${i}).`)}hasExtremity(n,t){n=""+n,t=""+t;let e=this._edges.get(n);if(!e)throw new B(`Graph.hasExtremity: could not find the "${n}" edge in the graph.`);return e.source.key===t||e.target.key===t}isUndirected(n){n=""+n;let t=this._edges.get(n);if(!t)throw new B(`Graph.isUndirected: could not find the "${n}" edge in the graph.`);return t.undirected}isDirected(n){n=""+n;let t=this._edges.get(n);if(!t)throw new B(`Graph.isDirected: could not find the "${n}" edge in the graph.`);return!t.undirected}isSelfLoop(n){n=""+n;let t=this._edges.get(n);if(!t)throw new B(`Graph.isSelfLoop: could not find the "${n}" edge in the graph.`);return t.source===t.target}addNode(n,t){return ds(this,n,t).key}mergeNode(n,t){if(t&&!oe(t))throw new U(`Graph.mergeNode: invalid attributes. Expecting an object but got "${t}"`);n=""+n,t=t||{};let e=this._nodes.get(n);return e?(t&&(ie(e.attributes,t),this.emit("nodeAttributesUpdated",{type:"merge",key:n,attributes:e.attributes,data:t})),[n,!1]):(e=new this.NodeDataClass(n,t),this._nodes.set(n,e),this.emit("nodeAdded",{key:n,attributes:t}),[n,!0])}updateNode(n,t){if(t&&typeof t!="function")throw new U(`Graph.updateNode: invalid updater function. Expecting a function but got "${t}"`);n=""+n;let e=this._nodes.get(n);if(e){if(t){let i=e.attributes;e.attributes=t(i),this.emit("nodeAttributesUpdated",{type:"replace",key:n,attributes:e.attributes})}return[n,!1]}let r=t?t({}):{};return e=new this.NodeDataClass(n,r),this._nodes.set(n,e),this.emit("nodeAdded",{key:n,attributes:r}),[n,!0]}dropNode(n){n=""+n;let t=this._nodes.get(n);if(!t)throw new B(`Graph.dropNode: could not find the "${n}" node in the graph.`);let e;if(this.type!=="undirected"){for(let r in t.out){e=t.out[r];do Ze(this,e),e=e.next;while(e)}for(let r in t.in){e=t.in[r];do Ze(this,e),e=e.next;while(e)}}if(this.type!=="directed")for(let r in t.undirected){e=t.undirected[r];do Ze(this,e),e=e.next;while(e)}this._nodes.delete(n),this.emit("nodeDropped",{key:n,attributes:t.attributes})}dropEdge(n){let t;if(arguments.length>1){let e=""+arguments[0],r=""+arguments[1];if(t=ge(this,e,r,this.type),!t)throw new B(`Graph.dropEdge: could not find the "${e}" -> "${r}" edge in the graph.`)}else if(n=""+n,t=this._edges.get(n),!t)throw new B(`Graph.dropEdge: could not find the "${n}" edge in the graph.`);return Ze(this,t),this}dropDirectedEdge(n,t){if(arguments.length<2)throw new j("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new j("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");n=""+n,t=""+t;let e=ge(this,n,t,"directed");if(!e)throw new B(`Graph.dropDirectedEdge: could not find a "${n}" -> "${t}" edge in the graph.`);return Ze(this,e),this}dropUndirectedEdge(n,t){if(arguments.length<2)throw new j("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new j("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");let e=ge(this,n,t,"undirected");if(!e)throw new B(`Graph.dropUndirectedEdge: could not find a "${n}" -> "${t}" edge in the graph.`);return Ze(this,e),this}clear(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")}clearEdges(){let n=this._nodes.values(),t;for(;t=n.next(),t.done!==!0;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")}getAttribute(n){return this._attributes[n]}getAttributes(){return this._attributes}hasAttribute(n){return this._attributes.hasOwnProperty(n)}setAttribute(n,t){return this._attributes[n]=t,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:n}),this}updateAttribute(n,t){if(typeof t!="function")throw new U("Graph.updateAttribute: updater should be a function.");let e=this._attributes[n];return this._attributes[n]=t(e),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:n}),this}removeAttribute(n){return delete this._attributes[n],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:n}),this}replaceAttributes(n){if(!oe(n))throw new U("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=n,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this}mergeAttributes(n){if(!oe(n))throw new U("Graph.mergeAttributes: provided attributes are not a plain object.");return ie(this._attributes,n),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:n}),this}updateAttributes(n){if(typeof n!="function")throw new U("Graph.updateAttributes: provided updater is not a function.");return this._attributes=n(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this}updateEachNodeAttributes(n,t){if(typeof n!="function")throw new U("Graph.updateEachNodeAttributes: expecting an updater function.");if(t&&!Wa(t))throw new U("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");let e=this._nodes.values(),r,i;for(;r=e.next(),r.done!==!0;)i=r.value,i.attributes=n(i.key,i.attributes);this.emit("eachNodeAttributesUpdated",{hints:t||null})}updateEachEdgeAttributes(n,t){if(typeof n!="function")throw new U("Graph.updateEachEdgeAttributes: expecting an updater function.");if(t&&!Wa(t))throw new U("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");let e=this._edges.values(),r,i,o,s;for(;r=e.next(),r.done!==!0;)i=r.value,o=i.source,s=i.target,i.attributes=n(i.key,i.attributes,o.key,s.key,o.attributes,s.attributes,i.undirected);this.emit("eachEdgeAttributesUpdated",{hints:t||null})}forEachAdjacencyEntry(n){if(typeof n!="function")throw new U("Graph.forEachAdjacencyEntry: expecting a callback.");Vt(!1,!1,!1,this,n)}forEachAdjacencyEntryWithOrphans(n){if(typeof n!="function")throw new U("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");Vt(!1,!1,!0,this,n)}forEachAssymetricAdjacencyEntry(n){if(typeof n!="function")throw new U("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");Vt(!1,!0,!1,this,n)}forEachAssymetricAdjacencyEntryWithOrphans(n){if(typeof n!="function")throw new U("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");Vt(!1,!0,!0,this,n)}nodes(){return Array.from(this._nodes.keys())}forEachNode(n){if(typeof n!="function")throw new U("Graph.forEachNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)r=e.value,n(r.key,r.attributes)}findNode(n){if(typeof n!="function")throw new U("Graph.findNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)if(r=e.value,n(r.key,r.attributes))return r.key}mapNodes(n){if(typeof n!="function")throw new U("Graph.mapNode: expecting a callback.");let t=this._nodes.values(),e,r,i=new Array(this.order),o=0;for(;e=t.next(),e.done!==!0;)r=e.value,i[o++]=n(r.key,r.attributes);return i}someNode(n){if(typeof n!="function")throw new U("Graph.someNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)if(r=e.value,n(r.key,r.attributes))return!0;return!1}everyNode(n){if(typeof n!="function")throw new U("Graph.everyNode: expecting a callback.");let t=this._nodes.values(),e,r;for(;e=t.next(),e.done!==!0;)if(r=e.value,!n(r.key,r.attributes))return!1;return!0}filterNodes(n){if(typeof n!="function")throw new U("Graph.filterNodes: expecting a callback.");let t=this._nodes.values(),e,r,i=[];for(;e=t.next(),e.done!==!0;)r=e.value,n(r.key,r.attributes)&&i.push(r.key);return i}reduceNodes(n,t){if(typeof n!="function")throw new U("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new U("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");let e=t,r=this._nodes.values(),i,o;for(;i=r.next(),i.done!==!0;)o=i.value,e=n(e,o.key,o.attributes);return e}nodeEntries(){let n=this._nodes.values();return{[Symbol.iterator](){return this},next(){let t=n.next();if(t.done)return t;let e=t.value;return{value:{node:e.key,attributes:e.attributes},done:!1}}}}export(){let n=new Array(this._nodes.size),t=0;this._nodes.forEach((r,i)=>{n[t++]=ns(i,r)});let e=new Array(this._edges.size);return t=0,this._edges.forEach((r,i)=>{e[t++]=as(this.type,i,r)}),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:n,edges:e}}import(n,t=!1){if(n instanceof a)return n.forEachNode((l,u)=>{t?this.mergeNode(l,u):this.addNode(l,u)}),n.forEachEdge((l,u,d,h,c,f,v)=>{t?v?this.mergeUndirectedEdgeWithKey(l,d,h,u):this.mergeDirectedEdgeWithKey(l,d,h,u):v?this.addUndirectedEdgeWithKey(l,d,h,u):this.addDirectedEdgeWithKey(l,d,h,u)}),this;if(!oe(n))throw new U("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(n.attributes){if(!oe(n.attributes))throw new U("Graph.import: invalid attributes. Expecting a plain object.");t?this.mergeAttributes(n.attributes):this.replaceAttributes(n.attributes)}let e,r,i,o,s;if(n.nodes){if(i=n.nodes,!Array.isArray(i))throw new U("Graph.import: invalid nodes. Expecting an array.");for(e=0,r=i.length;e<r;e++){o=i[e],rs(o);let{key:l,attributes:u}=o;t?this.mergeNode(l,u):this.addNode(l,u)}}if(n.edges){let l=!1;if(this.type==="undirected"&&(l=!0),i=n.edges,!Array.isArray(i))throw new U("Graph.import: invalid edges. Expecting an array.");for(e=0,r=i.length;e<r;e++){s=i[e],is(s);let{source:u,target:d,attributes:h,undirected:c=l}=s,f;"key"in s?(f=t?c?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:c?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey,f.call(this,s.key,u,d,h)):(f=t?c?this.mergeUndirectedEdge:this.mergeDirectedEdge:c?this.addUndirectedEdge:this.addDirectedEdge,f.call(this,u,d,h))}}return this}nullCopy(n){let t=new a(ie({},this._options,n));return t.replaceAttributes(ie({},this.getAttributes())),t}emptyCopy(n){let t=this.nullCopy(n);return this._nodes.forEach((e,r)=>{let i=ie({},e.attributes);e=new t.NodeDataClass(r,i),t._nodes.set(r,e)}),t}copy(n){if(n=n||{},typeof n.type=="string"&&n.type!==this.type&&n.type!=="mixed")throw new j(`Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${n.type}" because this would mean losing information about the current graph.`);if(typeof n.multi=="boolean"&&n.multi!==this.multi&&n.multi!==!0)throw new j("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if(typeof n.allowSelfLoops=="boolean"&&n.allowSelfLoops!==this.allowSelfLoops&&n.allowSelfLoops!==!0)throw new j("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");let t=this.emptyCopy(n),e=this._edges.values(),r,i;for(;r=e.next(),r.done!==!0;)i=r.value,Za(t,"copy",!1,i.undirected,i.key,i.source.key,i.target.key,ie({},i.attributes));return t}toJSON(){return this.export()}toString(){return"[object Graph]"}inspect(){let n={};this._nodes.forEach((i,o)=>{n[o]=i.attributes});let t={},e={};this._edges.forEach((i,o)=>{let s=i.undirected?"--":"->",l="",u=i.source.key,d=i.target.key,h;i.undirected&&u>d&&(h=u,u=d,d=h);let c=`(${u})${s}(${d})`;o.startsWith("geid_")?this.multi&&(typeof e[c]>"u"?e[c]=0:e[c]++,l+=`${e[c]}. `):l+=`[${o}]: `,l+=c,t[l]=i.attributes});let r={};for(let i in this)this.hasOwnProperty(i)&&!Ba.has(i)&&typeof this[i]!="function"&&typeof i!="symbol"&&(r[i]=this[i]);return r.attributes=this._attributes,r.nodes=n,r.edges=t,fe(r,"constructor",this.constructor),r}};typeof Symbol<"u"&&(ee.prototype[Symbol.for("nodejs.util.inspect.custom")]=ee.prototype.inspect);ls.forEach(a=>{["add","merge","update"].forEach(n=>{let t=a.name(n),e=n==="add"?Za:hs;a.generateKey?ee.prototype[t]=function(r,i,o){return e(this,t,!0,(a.type||this.type)==="undirected",null,r,i,o,n==="update")}:ee.prototype[t]=function(r,i,o,s){return e(this,t,!1,(a.type||this.type)==="undirected",r,i,o,s,n==="update")}})});xo(ee);ko(ee);Xo(ee);ts(ee);var jt=class extends ee{constructor(n){let t=ie({type:"directed"},n);if("multi"in t&&t.multi!==!1)throw new U("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(t.type!=="directed")throw new U('DirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}},Xt=class extends ee{constructor(n){let t=ie({type:"undirected"},n);if("multi"in t&&t.multi!==!1)throw new U("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(t.type!=="undirected")throw new U('UndirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}},qt=class extends ee{constructor(n){let t=ie({multi:!0},n);if("multi"in t&&t.multi!==!0)throw new U("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");super(t)}},Yt=class extends ee{constructor(n){let t=ie({type:"directed",multi:!0},n);if("multi"in t&&t.multi!==!0)throw new U("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(t.type!=="directed")throw new U('MultiDirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}},Kt=class extends ee{constructor(n){let t=ie({type:"undirected",multi:!0},n);if("multi"in t&&t.multi!==!0)throw new U("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(t.type!=="undirected")throw new U('MultiUndirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}};function et(a){a.from=function(n,t){let e=ie({},n.options,t),r=new a(e);return r.import(n),r}}et(ee);et(jt);et(Xt);et(qt);et(Yt);et(Kt);ee.Graph=ee;ee.DirectedGraph=jt;ee.UndirectedGraph=Xt;ee.MultiGraph=qt;ee.MultiDirectedGraph=Yt;ee.MultiUndirectedGraph=Kt;ee.InvalidArgumentsGraphError=U;ee.NotFoundGraphError=B;ee.UsageGraphError=j;function en(a,n){(n==null||n>a.length)&&(n=a.length);for(var t=0,e=Array(n);t<n;t++)e[t]=a[t];return e}function tn(a,n){if(a){if(typeof a=="string")return en(a,n);var t={}.toString.call(a).slice(8,-1);return t==="Object"&&a.constructor&&(t=a.constructor.name),t==="Map"||t==="Set"?Array.from(a):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?en(a,n):void 0}}function cs(a){if(Array.isArray(a))return a}function fs(a,n){var t=a==null?null:typeof Symbol<"u"&&a[Symbol.iterator]||a["@@iterator"];if(t!=null){var e,r,i,o,s=[],l=!0,u=!1;try{if(i=(t=t.call(a)).next,n===0){if(Object(t)!==t)return;l=!1}else for(;!(l=(e=i.call(t)).done)&&(s.push(e.value),s.length!==n);l=!0);}catch(d){u=!0,r=d}finally{try{if(!l&&t.return!=null&&(o=t.return(),Object(o)!==o))return}finally{if(u)throw r}}return s}}function gs(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Q(a,n){return cs(a)||fs(a,n)||tn(a,n)||gs()}function z(a,n){var t=typeof Symbol<"u"&&a[Symbol.iterator]||a["@@iterator"];if(!t){if(Array.isArray(a)||(t=tn(a))||n&&a&&typeof a.length=="number"){t&&(a=t);var e=0,r=function(){};return{s:r,n:function(){return e>=a.length?{done:!0}:{done:!1,value:a[e++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,s=!1;return{s:function(){t=t.call(a)},n:function(){var l=t.next();return o=l.done,l},e:function(l){s=!0,i=l},f:function(){try{o||t.return==null||t.return()}finally{if(s)throw i}}}}function ve(){return Float32Array.of(1,0,0,0,1,0,0,0,1)}function Qt(a,n,t){return a[0]=n,a[4]=typeof t=="number"?t:n,a}function Qa(a,n){var t=Math.sin(n),e=Math.cos(n);return a[0]=e,a[1]=t,a[3]=-t,a[4]=e,a}function Ja(a,n,t){return a[6]=n,a[7]=t,a}function Ce(a,n){var t=a[0],e=a[1],r=a[2],i=a[3],o=a[4],s=a[5],l=a[6],u=a[7],d=a[8],h=n[0],c=n[1],f=n[2],v=n[3],y=n[4],m=n[5],g=n[6],p=n[7],b=n[8];return a[0]=h*t+c*i+f*l,a[1]=h*e+c*o+f*u,a[2]=h*r+c*s+f*d,a[3]=v*t+y*i+m*l,a[4]=v*e+y*o+m*u,a[5]=v*r+y*s+m*d,a[6]=g*t+p*i+b*l,a[7]=g*e+p*o+b*u,a[8]=g*r+p*s+b*d,a}function Mn(a,n){var t=Math.cos(n),e=Math.sin(n);return{x:t*a.x+e*a.y,y:-e*a.x+t*a.y}}function nt(a,n){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:1,e=a[0],r=a[1],i=a[3],o=a[4],s=a[6],l=a[7],u=n.x,d=n.y;return{x:u*e+d*i+s*t,y:u*r+d*o+l*t}}function vs(a,n){var t=a.height/a.width,e=n.height/n.width;return t<1&&e>1||t>1&&e<1?1:Math.min(Math.max(e,1/e),Math.max(1/t,t))}function Le(a,n,t,e,r){var i=a.angle,o=a.ratio,s=a.x,l=a.y,u=n.width,d=n.height,h=ve(),c=Math.min(u,d)-2*e,f=vs(n,t);return r?(Ce(h,Ja(ve(),s,l)),Ce(h,Qt(ve(),o)),Ce(h,Qa(ve(),i)),Ce(h,Qt(ve(),u/c/2/f,d/c/2/f))):(Ce(h,Qt(ve(),2*(c/u)*f,2*(c/d)*f)),Ce(h,Qa(ve(),-i)),Ce(h,Qt(ve(),1/o)),Ce(h,Ja(ve(),-s,-l))),h}function er(a,n,t){var e=nt(a,{x:Math.cos(n.angle),y:Math.sin(n.angle)},0),r=e.x,i=e.y;return 1/Math.sqrt(Math.pow(r,2)+Math.pow(i,2))/t.width}function zn(a,n,t,e,r){var i=Math.floor(n/r*e),o=Math.floor(a.drawingBufferHeight/r-t/r*e);return[i,o]}var Tt={black:"#000000",silver:"#C0C0C0",gray:"#808080",grey:"#808080",white:"#FFFFFF",maroon:"#800000",red:"#FF0000",purple:"#800080",fuchsia:"#FF00FF",green:"#008000",lime:"#00FF00",olive:"#808000",yellow:"#FFFF00",navy:"#000080",blue:"#0000FF",teal:"#008080",aqua:"#00FFFF",darkblue:"#00008B",mediumblue:"#0000CD",darkgreen:"#006400",darkcyan:"#008B8B",deepskyblue:"#00BFFF",darkturquoise:"#00CED1",mediumspringgreen:"#00FA9A",springgreen:"#00FF7F",cyan:"#00FFFF",midnightblue:"#191970",dodgerblue:"#1E90FF",lightseagreen:"#20B2AA",forestgreen:"#228B22",seagreen:"#2E8B57",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",limegreen:"#32CD32",mediumseagreen:"#3CB371",turquoise:"#40E0D0",royalblue:"#4169E1",steelblue:"#4682B4",darkslateblue:"#483D8B",mediumturquoise:"#48D1CC",indigo:"#4B0082",darkolivegreen:"#556B2F",cadetblue:"#5F9EA0",cornflowerblue:"#6495ED",rebeccapurple:"#663399",mediumaquamarine:"#66CDAA",dimgray:"#696969",dimgrey:"#696969",slateblue:"#6A5ACD",olivedrab:"#6B8E23",slategray:"#708090",slategrey:"#708090",lightslategray:"#778899",lightslategrey:"#778899",mediumslateblue:"#7B68EE",lawngreen:"#7CFC00",chartreuse:"#7FFF00",aquamarine:"#7FFFD4",skyblue:"#87CEEB",lightskyblue:"#87CEFA",blueviolet:"#8A2BE2",darkred:"#8B0000",darkmagenta:"#8B008B",saddlebrown:"#8B4513",darkseagreen:"#8FBC8F",lightgreen:"#90EE90",mediumpurple:"#9370DB",darkviolet:"#9400D3",palegreen:"#98FB98",darkorchid:"#9932CC",yellowgreen:"#9ACD32",sienna:"#A0522D",brown:"#A52A2A",darkgray:"#A9A9A9",darkgrey:"#A9A9A9",lightblue:"#ADD8E6",greenyellow:"#ADFF2F",paleturquoise:"#AFEEEE",lightsteelblue:"#B0C4DE",powderblue:"#B0E0E6",firebrick:"#B22222",darkgoldenrod:"#B8860B",mediumorchid:"#BA55D3",rosybrown:"#BC8F8F",darkkhaki:"#BDB76B",mediumvioletred:"#C71585",indianred:"#CD5C5C",peru:"#CD853F",chocolate:"#D2691E",tan:"#D2B48C",lightgray:"#D3D3D3",lightgrey:"#D3D3D3",thistle:"#D8BFD8",orchid:"#DA70D6",goldenrod:"#DAA520",palevioletred:"#DB7093",crimson:"#DC143C",gainsboro:"#DCDCDC",plum:"#DDA0DD",burlywood:"#DEB887",lightcyan:"#E0FFFF",lavender:"#E6E6FA",darksalmon:"#E9967A",violet:"#EE82EE",palegoldenrod:"#EEE8AA",lightcoral:"#F08080",khaki:"#F0E68C",aliceblue:"#F0F8FF",honeydew:"#F0FFF0",azure:"#F0FFFF",sandybrown:"#F4A460",wheat:"#F5DEB3",beige:"#F5F5DC",whitesmoke:"#F5F5F5",mintcream:"#F5FFFA",ghostwhite:"#F8F8FF",salmon:"#FA8072",antiquewhite:"#FAEBD7",linen:"#FAF0E6",lightgoldenrodyellow:"#FAFAD2",oldlace:"#FDF5E6",magenta:"#FF00FF",deeppink:"#FF1493",orangered:"#FF4500",tomato:"#FF6347",hotpink:"#FF69B4",coral:"#FF7F50",darkorange:"#FF8C00",lightsalmon:"#FFA07A",orange:"#FFA500",lightpink:"#FFB6C1",pink:"#FFC0CB",gold:"#FFD700",peachpuff:"#FFDAB9",navajowhite:"#FFDEAD",moccasin:"#FFE4B5",bisque:"#FFE4C4",mistyrose:"#FFE4E1",blanchedalmond:"#FFEBCD",papayawhip:"#FFEFD5",lavenderblush:"#FFF0F5",seashell:"#FFF5EE",cornsilk:"#FFF8DC",lemonchiffon:"#FFFACD",floralwhite:"#FFFAF0",snow:"#FFFAFA",lightyellow:"#FFFFE0",ivory:"#FFFFF0"},tr=new Int8Array(4),Jt=new Int32Array(tr.buffer,0,1),nr=new Float32Array(tr.buffer,0,1),ps=/^\s*rgba?\s*\(/,ms=/^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;function nn(a){var n=0,t=0,e=0,r=1,i=a.toLowerCase();if(i==="transparent")return{r:0,g:0,b:0,a:0};if(i in Tt)return nn(Tt[i]);if(a[0]==="#")a.length===4?(n=parseInt(a.charAt(1)+a.charAt(1),16),t=parseInt(a.charAt(2)+a.charAt(2),16),e=parseInt(a.charAt(3)+a.charAt(3),16)):(n=parseInt(a.charAt(1)+a.charAt(2),16),t=parseInt(a.charAt(3)+a.charAt(4),16),e=parseInt(a.charAt(5)+a.charAt(6),16)),a.length===9&&(r=parseInt(a.charAt(7)+a.charAt(8),16)/255);else if(ps.test(a)){var o=a.match(ms);o&&(n=+o[1],t=+o[2],e=+o[3],o[4]&&(r=+o[4]))}return{r:n,g:t,b:e,a:r}}function ar(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=nn(a),e=t.r,r=t.g,i=t.b,o=t.a;return n?[e/255*o,r/255*o,i/255*o,o]:[e/255,r/255,i/255,o]}var tt={};for(_t in Tt)tt[_t]=pe(Tt[_t]),tt[Tt[_t]]=tt[_t];var _t;function ys(a,n,t,e,r){return Jt[0]=e<<24|t<<16|n<<8|a,r&&(Jt[0]=Jt[0]&4278190079),nr[0]}function pe(a){if(a=a.toLowerCase(),typeof tt[a]<"u")return tt[a];var n=nn(a),t=n.r,e=n.g,r=n.b,i=n.a;i=i*255|0;var o=ys(t,e,r,i,!0);return tt[a]=o,o}function ke(a,n){nr[0]=pe(a);var t=Jt[0];n&&(t=t|16777216);var e=t&255,r=t>>8&255,i=t>>16&255,o=t>>24&255;return[e,r,i,o]}function at(a){var n=a>>>8&255,t=a>>>16&255,e=a>>>24&255,r=a&255;return(r<<24|e<<16|t<<8|n)>>>0}function Wn(a,n,t,e){return(t<<24|n<<16|a<<8|e)>>>0}function rr(a,n,t,e,r,i){var o=zn(a,t,e,r,i),s=Q(o,2),l=s[0],u=s[1],d=new Uint8Array(4);a.bindFramebuffer(a.FRAMEBUFFER,n),a.readPixels(l,u,1,1,a.RGBA,a.UNSIGNED_BYTE,d);var h=Q(d,4),c=h[0],f=h[1],v=h[2],y=h[3];return[c,f,v,y]}function ir(a){var n=nn(a),t=n.r,e=n.g,r=n.b,i=n.a,o=(t/255).toFixed(6),s=(e/255).toFixed(6),l=(r/255).toFixed(6),u=i.toFixed(6);return"vec4(".concat(o,", ").concat(s,", ").concat(l,", ").concat(u,")")}function bs(a,n){if(typeof a!="object"||!a)return a;var t=a[Symbol.toPrimitive];if(t!==void 0){var e=t.call(a,n||"default");if(typeof e!="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(a)}function lr(a){var n=bs(a,"string");return typeof n=="symbol"?n:n+""}function S(a,n,t){return(n=lr(n))in a?Object.defineProperty(a,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[n]=t,a}function or(a,n){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(a);n&&(e=e.filter(function(r){return Object.getOwnPropertyDescriptor(a,r).enumerable})),t.push.apply(t,e)}return t}function W(a){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?or(Object(t),!0).forEach(function(e){S(a,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):or(Object(t)).forEach(function(e){Object.defineProperty(a,e,Object.getOwnPropertyDescriptor(t,e))})}return a}function q(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function sr(a,n){for(var t=0;t<n.length;t++){var e=n[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(a,lr(e.key),e)}}function Y(a,n,t){return n&&sr(a.prototype,n),t&&sr(a,t),Object.defineProperty(a,"prototype",{writable:!1}),a}function ze(a){return ze=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(n){return n.__proto__||Object.getPrototypeOf(n)},ze(a)}function ur(){try{var a=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(ur=function(){return!!a})()}function xs(a){if(a===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _s(a,n){if(n&&(typeof n=="object"||typeof n=="function"))return n;if(n!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return xs(a)}function te(a,n,t){return n=ze(n),_s(a,ur()?Reflect.construct(n,t||[],ze(a).constructor):n.apply(a,t))}function Bn(a,n){return Bn=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},Bn(a,n)}function ne(a,n){if(typeof n!="function"&&n!==null)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(n&&n.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),Object.defineProperty(a,"prototype",{writable:!1}),n&&Bn(a,n)}function Ts(a){if(Array.isArray(a))return en(a)}function Ss(a){if(typeof Symbol<"u"&&a[Symbol.iterator]!=null||a["@@iterator"]!=null)return Array.from(a)}function Es(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function V(a){return Ts(a)||Ss(a)||tn(a)||Es()}function K(a){"@babel/helpers - typeof";return K=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},K(a)}function De(a){return K(a)==="object"&&a!==null&&"attribute"in a}function dr(){var a=`
float sdf_circle(vec2 uv, float size) {
  return length(uv) - size;
}
`;return{name:"circle",glsl:a,uniforms:[]}}function hr(a){var n,t=WebGL2RenderingContext,e=t.UNSIGNED_BYTE,r=(n=a?.color)!==null&&n!==void 0?n:{attribute:"color"};if(!De(r)){var i=r,o=`
vec4 layer_fill() {
  return `.concat(ir(i),`;
}
`);return{name:"fill",uniforms:[],attributes:[],glsl:o}}var s=r.attribute,l=`
vec4 layer_fill(vec4 v_fillColor) {
  return v_fillColor;
}
`;return{name:"fill",uniforms:[],attributes:[{name:"fillColor",size:4,type:e,normalized:!0,source:s}],glsl:l}}function As(a,n){if(typeof a=="string"){var t=ar(a).map(function(u){return u.toFixed(6)}),e=Q(t,4),r=e[0],i=e[1],o=e[2],s=e[3];return{glsl:"vec4(".concat(r,", ").concat(i,", ").concat(o,", ").concat(s,")"),attributes:[],needsNodeColors:!1}}if("node"in a&&a.node)return{glsl:a.node==="source"?"v_sourceColor":"v_targetColor",attributes:[],needsNodeColors:!0};var l=a;return{glsl:"v_".concat(n),attributes:[{name:"a_".concat(n),size:4,type:WebGL2RenderingContext.UNSIGNED_BYTE,normalized:!0,source:l.attribute,defaultValue:l.default}],needsNodeColors:!1}}function We(a){var n=a?.color;if(n===void 0){var t=`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return v_color;
}
`;return{name:"plain",glsl:t,uniforms:[],attributes:[]}}var e=As(n,"plainColor"),r=`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return `.concat(e.glsl,`;
}
`);return{name:"plain",glsl:r,uniforms:[],attributes:e.attributes,needsNodeColors:e.needsNodeColors}}function cr(){var a=`
// Position at parameter t \u2208 [0, 1]
vec2 path_straight_position(float t, vec2 source, vec2 target) {
  return mix(source, target, t);
}

// Total length of the path (analytical - more efficient than sampling)
float path_straight_length(vec2 source, vec2 target) {
  return length(target - source);
}
`;return{name:"straight",segments:1,minBodyLengthRatio:0,linearParameterization:!0,glsl:a,uniforms:[],attributes:[]}}function fr(a){var n=a??{},t=n.segments,e=t===void 0?32:t,r=`
const float LOOP_PI = 3.141592653589793;

float loopWorldRadius() {
  float nodeWorldRadius = v_sourceNodeSize * u_correctionRatio / u_sizeRatio;
  return max(v_loopRadius * nodeWorldRadius, 0.001);
}

// Cubic B\xE9zier with P0 = P3 = source.
// Control points extend outward orthogonal to the node surface at exit/entry angles.
vec2 path_loop_position(float t, vec2 source, vec2 target) {
  float R = loopWorldRadius();
  float angle = v_loopAngle + (v_loopFixedOrientation > 0.5 ? u_cameraAngle : 0.0);
  float halfSpread = v_loopSpread * 0.5;

  float exitAngle = angle - halfSpread;
  float entryAngle = angle + halfSpread;

  // Control point distance: at t=0.5 the B\xE9zier reaches 0.75 * cpDist * cos(halfSpread)
  // from source. Solve for cpDist so the loop tip reaches exactly R.
  float cpDist = R / (0.75 * cos(halfSpread));

  vec2 cp1 = source + cpDist * vec2(cos(exitAngle), sin(exitAngle));
  vec2 cp2 = source + cpDist * vec2(cos(entryAngle), sin(entryAngle));

  float u = 1.0 - t;
  vec2 d1 = cp1 - source;
  vec2 d2 = cp2 - source;
  return source + 3.0 * t * u * (u * d1 + t * d2);
}

// Approximate arc length via chord sampling
float path_loop_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_loop_position(0.0, source, target);
  const int STEPS = 16;
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) / float(STEPS);
    vec2 cur = path_loop_position(t, source, target);
    len += length(cur - prev);
    prev = cur;
  }
  return len;
}
`;return{name:"loop",segments:e,glsl:r,needsNodeSize:!0,uniforms:[],attributes:[{name:"loopRadius",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopAngle",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopSpread",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopFixedOrientation",size:1,type:WebGL2RenderingContext.FLOAT}],variables:{loopRadius:{type:"number",default:4},loopAngle:{type:"number",default:Math.PI/4},loopSpread:{type:"number",default:80*Math.PI/180},loopFixedOrientation:{type:"number",default:0}},spread:{variable:"loopRadius",compute:function(o){return o+4}}}}var br=Me(Ke());function gr(a){return K(a)==="object"&&"glsl"in a&&!("attributes"in a)}function vr(a){return K(a)==="object"&&"glsl"in a&&!("attributes"in a)}var St={shapes:[dr()],variables:{},layers:[hr()],label:{},backdrop:{},labelAttachments:{}},rt={paths:[cr(),fr()],extremities:[],variables:{},layers:[We()],defaultHead:"none",defaultTail:"none",label:{}},an=["nodes","topNodes"],rn=["edges","topEdges"],on=[].concat(rn,an),pr={nodes:St,edges:rt,depthLayers:V(on)};var Ds=function(n){return n},Rs=function(n){return n*n},ws=function(n){return n*(2-n)},Cs=function(n){return(n*=2)<1?.5*n*n:-.5*(--n*(n-2)-1)},Ls=function(n){return n*n*n},ks=function(n){return--n*n*n+1},Ps=function(n){return(n*=2)<1?.5*n*n*n:.5*((n-=2)*n*n+2)},Fs=function(n){return n===0?0:Math.pow(2,10*(n-1))},Is=function(n){return n===1?1:1-Math.pow(2,-10*n)},Gs=function(n){return n===0?0:n===1?1:n<.5?Math.pow(2,10*(2*n-1))/2:(2-Math.pow(2,-10*(2*n-1)))/2},Un={linear:Ds,quadraticIn:Rs,quadraticOut:ws,quadraticInOut:Cs,cubicIn:Ls,cubicOut:ks,cubicInOut:Ps,exponentialIn:Fs,exponentialOut:Is,exponentialInOut:Gs};function sn(a){return a?typeof a=="function"?a:Un[a]:Un.linear}function Hn(a){return K(a)==="object"&&a!==null&&"attribute"in a}function xr(a){return typeof a=="function"}function $n(a){return K(a)==="object"&&a!==null&&"when"in a&&typeof a.when=="function"&&"then"in a}function Vn(a){return K(a)==="object"&&a!==null&&"whenState"in a&&"then"in a}function jn(a){return K(a)==="object"&&a!==null&&"whenData"in a&&"then"in a}var Ns={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,isDragged:!1},Ms={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,parallelIndex:0,parallelCount:1},zs={isIdle:!0,isPanning:!1,isZooming:!1,isDragging:!1,hasHovered:!1,hasHighlighted:!1};function _r(a){return W(W({},Ns),a)}function Tr(a){return W(W({},Ms),a)}function Xn(a){return W(W({},zs),a)}var Ws={x:{attribute:"x"},y:{attribute:"y"},size:{whenState:"isHovered",then:{attribute:"size",defaultValue:12},else:{attribute:"size",defaultValue:10}},color:{attribute:"color",defaultValue:"#666"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"},labelVisibility:{whenState:"isHovered",then:"visible",else:"auto"},backdropVisibility:{whenState:"isHovered",then:"visible",else:"hidden"},backdropColor:"#ffffff",backdropShadowColor:"rgba(0, 0, 0, 0.5)",backdropShadowBlur:12,backdropPadding:6},Bs={size:{attribute:"size",defaultValue:1},color:{attribute:"color",defaultValue:"#ccc"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"}};var At={nodes:W(W({},Ws),{},{depth:{whenState:"isHovered",then:"topNodes",else:"nodes"}}),edges:W(W({},Bs),{},{depth:{whenState:["isHighlighted","isHovered"],then:"topEdges",else:"edges"}})};function Us(a){return"min"in a||"max"in a||"minValue"in a||"maxValue"in a||"easing"in a}function Os(a){return"dict"in a}function Dt(a,n){return typeof a=="string"?n[a]===!0:Array.isArray(a)?a.every(function(t){return n[t]===!0}):K(a)==="object"&&a!==null?Object.entries(a).every(function(t){var e=Q(t,2),r=e[0],i=e[1];return n[r]===i}):!1}function Hs(a,n){var t=n[a.attribute];return t===void 0?a.defaultValue:t}function $s(a,n,t){var e,r,i,o,s=n[a.attribute];if(s===void 0)return a.defaultValue;var l=Number(s);if(isNaN(l))return a.defaultValue;if(a.min===void 0&&a.max===void 0)return l;var u=(e=a.minValue)!==null&&e!==void 0?e:l,d=(r=a.maxValue)!==null&&r!==void 0?r:l;if(d===u){var h;return(h=a.min)!==null&&h!==void 0?h:l}var c=(l-u)/(d-u);c=Math.max(0,Math.min(1,c));var f=sn(a.easing);c=f(c);var v=(i=a.min)!==null&&i!==void 0?i:0,y=(o=a.max)!==null&&o!==void 0?o:1;return v+c*(y-v)}function Vs(a,n){var t=n[a.attribute];if(t===void 0)return a.defaultValue;var e=String(t);return e in a.dict?a.dict[e]:a.defaultValue}function js(a,n,t){return Os(a)?Vs(a,n):Us(a)?$s(a,n):Hs(a,n)}function qn(a,n){return typeof a=="string"?!!n[a]:Array.isArray(a)?a.every(function(t){return!!n[t]}):K(a)==="object"&&a!==null?Object.entries(a).every(function(t){var e=Q(t,2),r=e[0],i=e[1];return n[r]===i}):!1}function Et(a,n,t,e,r,i){if(a==null)return i;if(K(a)!=="object"&&typeof a!="function")return a;if($n(a)){var o=a.when(n,t,e,r)?a.then:a.else;return o===void 0?i:Et(o,n,t,e,r,i)}if(Vn(a)){var s=Dt(a.whenState,t)?a.then:a.else;return s===void 0?i:Et(s,n,t,e,r,i)}if(jn(a)){var l=qn(a.whenData,n)?a.then:a.else;return l===void 0?i:Et(l,n,t,e,r,i)}if(xr(a)){var u=a(n,t,e,r);return u??i}if(Hn(a)){var d=js(a,n);return d??i}return a}function _e(a){if(a==null)return"static";if($n(a))return"graph-state";if(Vn(a)){var n=_e(a.then),t=a.else!==void 0?_e(a.else):"static";return me("item-state",me(n,t))}if(jn(a)){var e=_e(a.then),r=a.else!==void 0?_e(a.else):"static";return me(e,r)}return xr(a)?"graph-state":(Hn(a),"static")}function me(a,n){return a==="graph-state"||n==="graph-state"?"graph-state":a==="item-state"||n==="item-state"?"item-state":"static"}function ln(a){if(!a)return{dependency:"static",xAttribute:null,yAttribute:null};var n=Array.isArray(a)?a:[a],t="static",e=null,r=null,i=z(n),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;if("matchData"in s&&"cases"in s)for(var l=s.cases,u=0,d=Object.values(l);u<d.length;u++)for(var h=d[u],c=0,f=Object.values(h);c<f.length;c++){var v=f[c];t=me(t,_e(v))}else if("matchState"in s&&"cases"in s){t=me(t,"item-state");for(var y=s.cases,m=0,g=Object.values(y);m<g.length;m++)for(var p=g[m],b=0,x=Object.values(p);b<x.length;b++){var _=x[b];t=me(t,_e(_))}}else if("when"in s&&"then"in s)t="graph-state";else if("whenState"in s){t=me(t,"item-state");var T=s.then;if(T&&K(T)==="object")for(var A=0,E=Object.values(T);A<E.length;A++){var R=E[A];t=me(t,_e(R))}var L=s.else;if(L&&K(L)==="object")for(var k=0,w=Object.values(L);k<w.length;k++){var F=w[k];t=me(t,_e(F))}}else if("whenData"in s){var C=s.then;if(C&&K(C)==="object")for(var N=0,G=Object.values(C);N<G.length;N++){var M=G[N];t=me(t,_e(M))}var P=s.else;if(P&&K(P)==="object")for(var D=0,I=Object.values(P);D<I.length;D++){var H=I[D];t=me(t,_e(H))}}else for(var O=0,$=Object.entries(s);O<$.length;O++){var X=Q($[O],2),Z=X[0],re=X[1];if(!Kn.has(Z)&&(t=me(t,_e(re)),(Z==="x"||Z==="y")&&Hn(re))){var ce=re.attribute;Z==="x"&&!e&&(e=ce),Z==="y"&&!r&&(r=ce)}}}}catch(be){i.e(be)}finally{i.f()}return{dependency:t,xAttribute:e,yAttribute:r}}var Re={size:10,color:"#666",opacity:1,shape:"circle",rotationAlignment:"viewport",labelRotationAlignment:"viewport",visibility:"visible",depth:"nodes",zIndex:0,label:"",labelColor:"#000",labelSize:12,labelFont:"sans-serif",labelVisibility:"auto",labelPosition:"right",labelAngle:0,labelDepth:"nodes",backdropVisibility:"hidden",backdropColor:"transparent",backdropShadowColor:"transparent",backdropShadowBlur:0,backdropPadding:0,backdropBorderColor:"transparent",backdropBorderWidth:0,backdropCornerRadius:0,backdropLabelPadding:-1,backdropArea:"both",labelAttachment:null,labelAttachmentPlacement:"below"},Yn={size:1,color:"#ccc",opacity:1,path:"straight",selfLoopPath:"loop",parallelSpread:.25,tail:"none",head:"none",visibility:"visible",depth:"edges",zIndex:0,label:"",labelColor:"#666",labelVisibility:"auto",labelDepth:"edges"},Kn=new Set(["when","whenState","whenData","then","else"]),mr=Object.keys(Re),Xs=Object.values(Re),yr=Object.keys(Yn),qs=Object.values(Yn);function it(a,n,t,e,r,i,o){for(var s in n){var l;if(!Kn.has(s)){var u=(l=a[s])!==null&&l!==void 0?l:o[s];a[s]=Et(n[s],t,e,r,i,u)}}"depth"in n&&!("labelDepth"in n)&&(a.labelDepth=a.depth)}function Sr(a,n,t,e,r,i,o){var s=z(n),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;if("matchData"in u&&"cases"in u){var d,h=String((d=t[u.matchData])!==null&&d!==void 0?d:""),c=u.cases;h in c&&it(a,c[h],t,e,r,i,o)}else if("matchState"in u&&"cases"in u){var f,v=String((f=e[u.matchState])!==null&&f!==void 0?f:""),y=u.cases;v in y&&it(a,y[v],t,e,r,i,o)}else if("when"in u&&"then"in u){var m=u.when;if(!m(t,e,r,i))continue;it(a,u.then,t,e,r,i,o)}else if("whenState"in u&&"then"in u){if(!Dt(u.whenState,e))continue;it(a,u.then,t,e,r,i,o)}else if("whenData"in u&&"then"in u){if(!qn(u.whenData,t))continue;it(a,u.then,t,e,r,i,o)}else it(a,u,t,e,r,i,o)}}catch(g){s.e(g)}finally{s.f()}}function un(a,n,t,e,r,i){for(var o=i||{},s=o,l=0,u=mr.length;l<u;l++)s[mr[l]]=Xs[l];if(s.x=void 0,s.y=void 0,s.labelBackgroundColor=void 0,s.labelBackgroundPadding=void 0,s.labelCursor=void 0,!a){var d,h,c,f,v;return s.x=(d=n.x)!==null&&d!==void 0?d:0,s.y=(h=n.y)!==null&&h!==void 0?h:0,o.size=(c=n.size)!==null&&c!==void 0?c:10,o.color=(f=n.color)!==null&&f!==void 0?f:"#666",o.label=(v=n.label)!==null&&v!==void 0?v:"",o}var y=Array.isArray(a)?a:[a];return Sr(s,y,n,t,e,r,Re),o}function dn(a,n,t,e,r,i){for(var o=i||{},s=o,l=0,u=yr.length;l<u;l++)s[yr[l]]=qs[l];if(!a){var d,h,c;return o.size=(d=n.size)!==null&&d!==void 0?d:1,o.color=(h=n.color)!==null&&h!==void 0?h:"#ccc",o.label=(c=n.label)!==null&&c!==void 0?c:"",o}var f=Array.isArray(a)?a:[a];return Sr(s,f,n,t,e,r,Yn),typeof s.labelPosition=="number"&&(s.labelPosition=void 0),o}function Ys(a,n,t){var e,r;if(a==null)return t;if(typeof a=="function")return(e=a(n))!==null&&e!==void 0?e:t;if(K(a)==="object"&&"when"in a){var i,o=a,s=o.when(n),l=s?o.then:o.else;return l===void 0?t:typeof l=="function"?(i=l(n))!==null&&i!==void 0?i:t:l??t}if(K(a)==="object"&&"whenState"in a){var u,d=a,h=Dt(d.whenState,n),c=h?d.then:d.else;return c===void 0?t:typeof c=="function"?(u=c(n))!==null&&u!==void 0?u:t:c??t}return(r=a)!==null&&r!==void 0?r:t}function Zn(a,n){var t={};if(!a)return t;var e=Array.isArray(a)?a:[a],r=z(e),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;if("when"in o&&"then"in o){var s=o.when(n),l=s?o.then:o.else;l&&K(l)==="object"&&On(t,l,n)}else if("whenState"in o&&"then"in o){var u=Dt(o.whenState,n),d=u?o.then:o.else;d&&K(d)==="object"&&On(t,d,n)}else On(t,o,n)}}catch(h){r.e(h)}finally{r.f()}return t}function On(a,n,t){for(var e=0,r=Object.entries(n);e<r.length;e++){var i=Q(r[e],2),o=i[0],s=i[1];Kn.has(o)||(a[o]=Ys(s,t))}}var Rt=(function(a){function n(){var t;return q(this,n),t=te(this,n),t.rawEmitter=t,t}return ne(n,a),Y(n)})(br.EventEmitter),Qn=At;var Jn=pr;function ea(a,n){var t=n.size;if(t!==0){var e=a.length;a.length+=t;var r=0;n.forEach(function(i){a[e+r]=i,r++})}}function Er(a){a=a||{};for(var n=0,t=arguments.length<=1?0:arguments.length-1;n<t;n++){var e=n+1<1||arguments.length<=n+1?void 0:arguments[n+1];e&&Object.assign(a,e)}return a}function ot(a,n){for(var t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&n[t]!==a[t])return!0;return!1}function Ar(a,n){var t=a,e=n;for(var r in t)if(Object.prototype.hasOwnProperty.call(t,r)&&t[r]!==e[r])return!1;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)&&e[i]!==t[i])return!1;return!0}function Be(a,n,t){t?a.add(n):a.delete(n)}var Rr=Me(ta());var wr={easing:"quadraticInOut",duration:150};function Pe(a){return a.labelVisibility==="visible"&&a.visibility!=="hidden"}function na(a){return a.backdropVisibility==="visible"&&a.visibility!=="hidden"}function hn(a){return[a.rotationAlignment==="graph"?1:0,a.labelRotationAlignment==="graph"?1:0]}function aa(a,n,t){var e=a[n];if(e)for(var r=0;r<e.length;r++){var i=e[r];if(!(t<i.offset||t>=i.offset+i.count)){if(i.count===1)e.splice(r,1);else if(t===i.offset)i.offset++,i.count--;else if(t===i.offset+i.count-1)i.count--;else{var o=t+1,s=i.offset+i.count-o;i.count=t-i.offset,e.splice(r+1,0,{offset:o,count:s})}return}}}function ra(a,n,t){if(!a[n]){a[n]=[{offset:t,count:1}];return}for(var e=a[n],r=e.length,i=0;i<e.length;i++)if(t<e[i].offset){r=i;break}var o=r>0?e[r-1]:null,s=r<e.length?e[r]:null,l=o&&o.offset+o.count===t,u=s&&t+1===s.offset;l&&u?(o.count+=1+s.count,e.splice(r,1)):l?o.count++:u?(s.offset--,s.count++):e.splice(r,0,{offset:t,count:1})}function Cr(a){if(!(0,Rr.default)(a))throw new Error("Sigma: invalid graph instance.")}function cn(a){var n=Q(a.x,2),t=n[0],e=n[1],r=Q(a.y,2),i=r[0],o=r[1],s=Math.max(e-t,o-i),l=(e+t)/2,u=(o+i)/2;(s===0||Math.abs(s)===1/0||isNaN(s))&&(s=1),isNaN(l)&&(l=0),isNaN(u)&&(u=0);var d=function(c){return{x:.5+(c.x-l)/s,y:.5+(c.y-u)/s}};return d.applyTo=function(h){h.x=.5+(h.x-l)/s,h.y=.5+(h.y-u)/s},d.inverse=function(h){return{x:l+s*(h.x-.5),y:u+s*(h.y-.5)}},d.ratio=s,d}var fn={hideEdgesOnMove:!1,hideLabelsOnMove:!1,renderLabels:!0,renderEdgeLabels:!1,edgeLabelAnchors:"nodeLabels",enableEdgeEvents:!1,nodeLabelEvents:!1,edgeLabelEvents:!1,pickingDownSizingRatio:2,nodePickingPadding:0,edgePickingPadding:4,labelPickingPadding:10,stagePadding:30,minEdgeThickness:1.7,antiAliasingFeather:1,antialiasEdges:!0,antialiasNodes:!0,dragTimeout:100,draggedEventsTolerance:3,inertiaDuration:200,inertiaRatio:3,zoomDuration:250,zoomingRatio:1.7,doubleClickTimeout:300,doubleClickZoomingRatio:2.2,doubleClickZoomingDuration:200,tapMoveTolerance:10,zoomToSizeRatioFunction:Math.sqrt,itemSizesReference:"positions",autoRescale:!0,autoRescaleContent:"positions",enableNodeDrag:!1,getDraggedNodes:function(n){return[n]},dragPositionToAttributes:null,labelDensity:1,labelGridCellSize:100,labelRenderedSizeThreshold:6,labelPixelSnapping:!0,minCameraRatio:null,maxCameraRatio:null,enableCameraZooming:!0,enableCameraPanning:!0,enableCameraRotation:!0,enableCameraMouseRotation:!0,cameraPanBoundaries:null,gestureTarget:"graph",sharedGestureWheelMessage:"Use Ctrl + scroll to zoom the graph",sharedGestureAppleWheelMessage:"Use \u2318 + scroll to zoom the graph",sharedGestureTouchMessage:"Use two fingers to move the graph",allowInvalidContainer:!1,DEBUG_displayPickingLayer:!1,DEBUG_logShaders:!1,DEBUG_logRenderStats:!1,DEBUG_gpuTimerQueries:!1};function gn(a){if(typeof a.labelDensity!="number"||a.labelDensity<0)throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");var n=a.minCameraRatio,t=a.maxCameraRatio;if(typeof n=="number"&&typeof t=="number"&&t<n)throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.")}function Lr(a){return Er({},fn,a)}var Ks=new Set(["italic","oblique"]),Zs=new Set(["bold","bolder","lighter"]);function vn(a){for(var n="normal",t="normal",e=a.trim(),r=e.split(/\s+/),i=0,o=0;o<r.length;o++){var s=r[o].toLowerCase();if(Ks.has(s))t=s,i=o+1;else if(Zs.has(s)||/^\d{3}$/.test(s))n=s,i=o+1;else if(s==="normal")i=o+1;else break}var l=r.slice(i).join(" ");return{family:l||e,weight:n,style:t}}function st(a,n,t){var e=document.createElement(a);if(n)for(var r in n)e.style[r]=n[r];if(t)for(var i in t)e.setAttribute(i,t[i]);return e}function wt(){return typeof window.devicePixelRatio<"u"?window.devicePixelRatio:1}var Br=Me(Ke());function Qs(a){var n=a.type===WebGL2RenderingContext.FLOAT&&!a.normalized,t=a.type===WebGL2RenderingContext.UNSIGNED_BYTE&&a.size===4&&a.normalized;if(!n&&!t)throw new Error('Attribute "'.concat(a.name,'" is invalid: only non-normalized FLOAT and normalized UNSIGNED_BYTE with size 4 are supported.'));return a.normalized?1:a.size}function ia(a){var n=0;return a.forEach(function(t){return n+=Qs(t)}),n}function Ur(a,n,t){var e=a==="VERTEX"?n.VERTEX_SHADER:n.FRAGMENT_SHADER,r=n.createShader(e);if(r===null)throw new Error("loadShader: error while creating the shader");n.shaderSource(r,t),n.compileShader(r);var i=n.getShaderParameter(r,n.COMPILE_STATUS);if(!i){var o=n.getShaderInfoLog(r);throw n.deleteShader(r),new Error(`loadShader: error while compiling the shader:
`.concat(o,`
`).concat(t))}return r}function sa(a,n){return Ur("VERTEX",a,n)}function la(a,n){return Ur("FRAGMENT",a,n)}function ua(a,n){var t=a.createProgram();if(t===null)throw new Error("loadProgram: error while creating the program.");var e,r;for(e=0,r=n.length;e<r;e++)a.attachShader(t,n[e]);a.linkProgram(t);var i=a.getProgramParameter(t,a.LINK_STATUS);if(!i){var o=a.getProgramInfoLog(t);throw a.deleteProgram(t),new Error("loadProgram: error while linking the program: ".concat(o))}return t}function kr(a){var n=a.gl,t=a.buffer,e=a.program,r=a.vertexShader,i=a.fragmentShader;n.deleteShader(r),n.deleteShader(i),n.deleteProgram(e),n.deleteBuffer(t)}function ae(a){return a%1===0?a.toFixed(1):a.toString()}var _n=new Map,Or=new Map,Js=0;function Hr(a,n){var t,e=(t=a.variables)===null||t===void 0||(t=t[n.source||n.name.replace(/^a_/,"")])===null||t===void 0?void 0:t.default,r=typeof e=="number"?e:typeof n.defaultValue=="number"?n.defaultValue:0;return ae(r)}function Tn(a,n,t){var e,r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:function(o){return"v_".concat(o.name.replace(/^a_/,""))},i=[n,t].concat(V(a.uniforms.filter(function(o){return o.type==="float"}).map(function(o){var s;return ae((s=o.value)!==null&&s!==void 0?s:0)})),V(((e=a.attributes)!==null&&e!==void 0?e:[]).map(r)));return"sdf_".concat(a.name,"(").concat(i.join(", "),")")}function el(a){var n,t=a.name,e=a.uniforms.filter(function(o){return o.type==="float"&&o.value!==void 0&&o.value!==0}).map(function(o){return"".concat(o.name.replace("u_",""),"=").concat(o.value)}).sort(),r=((n=a.attributes)!==null&&n!==void 0?n:[]).map(function(o){var s;return"".concat(o.name,"@").concat((s=o.source)!==null&&s!==void 0?s:"","=").concat(Hr(a,o))}),i=[].concat(V(e),V(r));return i.length>0&&(t+="#"+i.join("#")),t}function tl(a){var n=el(a);if(!_n.has(n)){var t={},e=z(a.uniforms),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;i.type==="float"&&i.value!==void 0&&(t[i.name]=i.value)}}catch(o){e.e(o)}finally{e.f()}_n.set(n,{shape:a,uniformValues:t,slug:n}),Or.set(n,Js++)}return n}function Ft(a){var n;return(n=Or.get(a))!==null&&n!==void 0?n:-1}function $r(a){var n=[],t=new Set,e=new Set,r=/mat2 rotate2D\(float angle\)\s*\{[^}]+\}/,i=z(a),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;if(!e.has(s.name)){e.add(s.name);var l=s.glsl;r.test(l)&&(t.has("rotate2D")?l=l.replace(r,""):t.add("rotate2D")),n.push(l)}}}catch(u){i.e(u)}finally{i.f()}return n.join(`
`)}function nl(){return $r(Array.from(_n.values()).map(function(a){return a.shape}))}function al(a){var n=Array.from(_n.entries());if(n.length===0)return`
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`;var t=n.map(function(e,r){var i=Q(e,2),o=i[0],s=i[1].shape,l=Tn(s,"uv","size",function(u){var d=u.name.replace(/^a_/,"");return a!=null&&a.has(d)?"g_".concat(d):Hr(s,u)});return"    case ".concat(r,": return ").concat(l,"; // ").concat(o)}).join(`
`);return`
float querySDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
`.concat(t,`
    default: return length(uv) - size;
  }
}
`)}function da(a){return $r(a)}function It(a){return V(new Map(a.flatMap(function(n){return n.uniforms}).map(function(n){return[n.name,n]})).values())}function rl(a,n){if(a.length===0)return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;var t=function(h){return Tn(h,"uv","size")},e=function(h){var c,f;return(c=h.inradiusFactorGLSL)!==null&&c!==void 0?c:ae((f=h.inradiusFactor)!==null&&f!==void 0?f:1)};if(a.length===1){var r=a[0];return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = `.concat(t(r),`;
  context.inradiusFactor = `).concat(e(r),`;
}
`)}var i=a.map(function(d,h){return"    case ".concat(h,": // ").concat(d.name,`
      context.sdf = `).concat(t(d),`;
      context.inradiusFactor = `).concat(e(d),`;
      break;`)}).join(`
`),o=a[0],s="",l="shapeId";if(n&&n.length>1){var u=n.map(function(d,h){return"    case ".concat(d,": return ").concat(h,"; // ").concat(a[h].name)}).join(`
`);s=`
int globalToLocalShapeId(int globalId) {
  switch (globalId) {
`.concat(u,`
    default: return 0;
  }
}
`),l="globalToLocalShapeId(shapeId)"}return"".concat(s,`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  switch (`).concat(l,`) {
`).concat(i,`
    default:
      context.sdf = `).concat(t(o),`;
      context.inradiusFactor = `).concat(e(o),`;
  }
}
`)}var ut={right:0,left:1,above:2,below:3,over:4},dt=5,ha=3,Vr=`
float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;
`,il=`
mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
`,jr=`
vec2 getLabelDirection(float positionMode) {
  if (positionMode < 0.5) return vec2(1.0, 0.0);   // Right
  if (positionMode < 1.5) return vec2(-1.0, 0.0);  // Left
  if (positionMode < 2.5) return vec2(0.0, -1.0);  // Above
  if (positionMode < 3.5) return vec2(0.0, 1.0);   // Below
  return vec2(0.0);                                 // Over (centered)
}
`,ol=`
float sdfBox(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,sl=`
float sdfRotatedBox(vec2 p, vec2 halfSize, float angle) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfBox(rotatedP, halfSize);
}
`,ll=`
float sdfRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 d = abs(p) - halfSize + radius;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`,ul=`
float sdfRoundedRotatedBox(vec2 p, vec2 halfSize, float angle, float radius) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfRoundedBox(rotatedP, halfSize, radius);
}
`,Xr=`
vec2 labelBoxCenter(float positionMode, float labelStart, vec2 halfSize, float textHalfY) {
  if (positionMode < 0.5) return vec2(labelStart + halfSize.x, 0.0);    // right
  if (positionMode < 1.5) return vec2(-(labelStart + halfSize.x), 0.0); // left
  if (positionMode < 2.5) return vec2(0.0, -(labelStart + textHalfY));  // above
  if (positionMode < 3.5) return vec2(0.0, labelStart + textHalfY);     // below
  return vec2(0.0);                                                     // over
}
`,ca=2,we=`
vec4 readNodeData(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(ca,`;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`),Oe=`
vec4 readNodeFlags(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(ca,` + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`),dl=`
vec4 readNodeColor(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(ca,` + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  vec4 texel = texelFetch(nodeDataTexture, coord, 0);
  float r = floor(texel.b / 65536.0);
  float g = floor(mod(texel.b, 65536.0) / 256.0);
  float b = mod(texel.b, 256.0);
  return vec4(r / 255.0, g / 255.0, b / 255.0, texel.a);
}
`),ht=`
vec4 readFrameTexel(sampler2D frameTexture, int frameTextureWidth, int index) {
  ivec2 coord = ivec2(index % frameTextureWidth, index / frameTextureWidth);
  return texelFetch(frameTexture, coord, 0);
}
`;function hl(a,n){var t=function(o){return Tn(o,"uv","size")};if(a.length===1)return{code:Pr(t(a[0])),multiShape:!1};var e=a.map(function(i,o){return"    case ".concat(n?n[o]:o,": return ").concat(t(i),";")}).join(`
`),r=`
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
`.concat(e,`
    default: return `).concat(t(a[0]),`;
  }
}
int g_shapeId;
`).concat(Pr("queryShapeSDF(g_shapeId, uv, size)"),`
`);return{code:r,multiShape:!0}}function Pr(a){return`
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (`.concat(a,` < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}
`)}function cl(a,n){for(;!{}.hasOwnProperty.call(a,n)&&(a=ze(a))!==null;);return a}function oa(){return oa=typeof Reflect<"u"&&Reflect.get?Reflect.get.bind():function(a,n,t){var e=cl(a,n);if(e){var r=Object.getOwnPropertyDescriptor(e,n);return r.get?r.get.call(arguments.length<3?a:t):r.value}},oa.apply(null,arguments)}function se(a,n,t,e){var r=oa(ze(1&e?a.prototype:a),n,t);return 2&e&&typeof r=="function"?function(i){return r.apply(t,i)}:r}var fl=1024,gl=1.5,vl=4096,qr=-1,Sn=(function(){function a(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:fl;q(this,a),S(this,"texture",null),S(this,"dirty",!1),S(this,"dirtyRangeStart",1/0),S(this,"dirtyRangeEnd",-1),S(this,"indexMap",new Map),S(this,"freeIndices",[]),S(this,"nextIndex",0),this.gl=n,this.TEXELS_PER_ITEM=t,this.capacity=this.roundUpToPowerOfTwo(e);var r=this.computeTextureDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.data=new Float32Array(this.textureWidth*this.textureHeight*4),this.createTexture()}return Y(a,[{key:"computeTextureDimensions",value:function(t){var e=t*this.TEXELS_PER_ITEM,r=Math.min(e,vl),i=Math.ceil(e/r);return{width:r,height:i}}},{key:"roundUpToPowerOfTwo",value:function(t){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,t))))}},{key:"createTexture",value:function(){var t=this.gl;this.texture=t.createTexture(),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,this.textureWidth,this.textureHeight,0,t.RGBA,t.FLOAT,this.data),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.bindTexture(t.TEXTURE_2D,null)}},{key:"resize",value:function(t){if(!(t<=this.capacity)){var e=this.roundUpToPowerOfTwo(Math.ceil(t*gl)),r=this.gl,i=this.computeTextureDimensions(e),o=new Float32Array(i.width*i.height*4);o.set(this.data),this.texture&&r.deleteTexture(this.texture),this.data=o,this.capacity=e,this.textureWidth=i.width,this.textureHeight=i.height,this.createTexture(),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.nextIndex}}},{key:"allocate",value:function(t){var e=this.indexMap.get(t);if(e!==void 0)return e;var r;return this.freeIndices.length>0?r=this.freeIndices.pop():(r=this.nextIndex++,r>=this.capacity&&this.resize(r+1)),this.indexMap.set(t,r),r}},{key:"free",value:function(t){var e=this.indexMap.get(t);if(e!==void 0){this.indexMap.delete(t),this.freeIndices.push(e);for(var r=e*this.TEXELS_PER_ITEM*4,i=0;i<this.TEXELS_PER_ITEM*4;i++)this.data[r+i]=0;this.markDirty(e)}}},{key:"getIndex",value:function(t){var e;return(e=this.indexMap.get(t))!==null&&e!==void 0?e:-1}},{key:"has",value:function(t){return this.indexMap.has(t)}},{key:"markDirty",value:function(t){this.dirty=!0,this.dirtyRangeStart=Math.min(this.dirtyRangeStart,t),this.dirtyRangeEnd=Math.max(this.dirtyRangeEnd,t+1)}},{key:"upload",value:function(){if(!(!this.dirty||!this.texture)){var t=this.gl,e=this.textureWidth;t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture);var r=this.dirtyRangeStart*this.TEXELS_PER_ITEM,i=Math.min(this.dirtyRangeEnd*this.TEXELS_PER_ITEM,this.capacity*this.TEXELS_PER_ITEM);if(r<i)for(var o=Math.floor(r/e),s=Math.floor((i-1)/e),l=o;l<=s;l++){var u=l*e,d=Math.min(u+e,this.capacity*this.TEXELS_PER_ITEM),h=Math.max(r,u),c=Math.min(i,d);if(h<c){var f=h-u,v=c-h,y=this.data.subarray(h*4,c*4);t.texSubImage2D(t.TEXTURE_2D,0,f,l,v,1,t.RGBA,t.FLOAT,y)}}t.bindTexture(t.TEXTURE_2D,null),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}}},{key:"bind",value:function(t){var e=this.gl;e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.texture)}},{key:"getTexture",value:function(){return this.texture}},{key:"getCapacity",value:function(){return this.capacity}},{key:"getTextureWidth",value:function(){return this.textureWidth}},{key:"getTextureHeight",value:function(){return this.textureHeight}},{key:"getTexelsPerItem",value:function(){return this.TEXELS_PER_ITEM}},{key:"getCount",value:function(){return this.indexMap.size}},{key:"getHighWaterMark",value:function(){return this.nextIndex}},{key:"isDirty",value:function(){return this.dirty}},{key:"clear",value:function(){this.indexMap.clear(),this.freeIndices=[],this.nextIndex=0,this.data.fill(0),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.capacity}},{key:"restore",value:function(){this.createTexture(),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}},{key:"kill",value:function(){this.texture&&(this.gl.deleteTexture(this.texture),this.texture=null),this.indexMap.clear(),this.freeIndices=[]}}])})();function ye(a){var n={},t={},e=0,r=z(a),i;try{for(r.s();!(i=r.n()).done;){var o=i.value,s=z(o.attributes),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.name.replace(/^a_/,"");d in n||(n[d]=e,t[d]=u,e+=u.size)}}catch(h){s.e(h)}finally{s.f()}}}catch(h){r.e(h)}finally{r.f()}return{floatsPerItem:e,texelsPerItem:Math.max(1,Math.ceil(e/4)),offsets:n,specs:t}}var En=(function(a){function n(t,e,r){var i;return q(this,n),i=te(this,n,[t,e.texelsPerItem,r]),i.floatsPerItem=e.floatsPerItem,i}return ne(n,a),Y(n,[{key:"updateAllAttributes",value:function(e,r){var i=this.indexMap.get(e);i===void 0&&(i=this.allocate(e));for(var o=i*this.TEXELS_PER_ITEM*4,s=Math.min(r.length,this.floatsPerItem),l=0;l<s;l++)this.data[o+l]=r[l];this.markDirty(i)}},{key:"updateAllAttributesAtRow",value:function(e,r){e>=this.capacity&&this.resize(e+1);for(var i=e*this.TEXELS_PER_ITEM*4,o=Math.min(r.length,this.floatsPerItem),s=0;s<o;s++)this.data[i+s]=r[s];this.markDirty(e)}}])})(Sn);function An(a,n,t){for(var e=[],r=new Set,i=0;i<a.length;i++){var o=a[i],s=z(o.attributes),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.name.replace(/^a_/,"");if(!r.has(d)){r.add(d);var h=n.offsets[d];if(h!==void 0){var c=t?.get(i);e.push({sourceKey:u.source||d,packedOffset:h,size:u.size,isColor:u.size===4&&!!u.normalized,defaultNum:typeof u.defaultValue=="number"?u.defaultValue:u.defaultValue===!0?1:0,defaultColor:typeof u.defaultValue=="string"?u.defaultValue:"",sourceIndex:i,hasLifecycleHook:!!(c!=null&&c.getAttributeData)})}}}}catch(f){s.e(f)}finally{s.f()}}return e}function Dn(a,n,t,e,r,i){t.fill(0);for(var o=0,s=a.length;o<s;o++){var l=a[o],u=l.packedOffset,d=void 0;if(l.hasLifecycleHook){var h=r.get(l.sourceIndex-i);d=h.getAttributeData(n,l.sourceKey),d===null&&(d=n[l.sourceKey])}else d=n[l.sourceKey];if(l.isColor){var c=typeof d=="string"?d:l.defaultColor||e,f=ke(c),v=Q(f,4),y=v[0],m=v[1],g=v[2],p=v[3];t[u]=y/255,t[u+1]=m/255,t[u+2]=g/255,t[u+3]=p/255}else if(l.size===1)t[u]=typeof d=="number"?d:typeof d=="boolean"?d?1:0:l.defaultNum;else{var b=Array.isArray(d)?d:null;if(b)for(var x=0;x<l.size;x++){var _;t[u+x]=(_=b[x])!==null&&_!==void 0?_:0}}}}var pn=["r","g","b","a"];function lt(a,n){var t=a.offsets,e=a.specs,r=a.texelsPerItem,i=a.floatsPerItem,o=Object.keys(t);if(o.length===0||i===0)return{fetchCode:"",varyingAssignments:""};var s=n.varPrefix,l=n.baseTexelExpr,u=n.textureWidthUniform,d=n.textureSamplerUniform,h=n.outputPrefix,c=h===void 0?"v_":h,f=[];f.push("  int ".concat(s,"BaseTexel = ").concat(l,";")),f.push("");for(var v=0;v<r;v++)f.push("  ivec2 ".concat(s,"Coord").concat(v," = ivec2((").concat(s,"BaseTexel + ").concat(v,") % ").concat(u,", (").concat(s,"BaseTexel + ").concat(v,") / ").concat(u,");")),f.push("  vec4 ".concat(s,"Texel").concat(v," = texelFetch(").concat(d,", ").concat(s,"Coord").concat(v,", 0);"));f.push("");for(var y=[],m=function(){var x=p[g],_=e[x],T=t[x],A=Math.floor(T/4),E=T%4,R="".concat(s,"Texel").concat(A),L="".concat(s,"Texel").concat(A+1),k="".concat(s,"Fetched_").concat(x);if(_.size===1)f.push("  float ".concat(k," = ").concat(R,".").concat(pn[E],";"));else if(_.size===4&&E===0)f.push("  vec4 ".concat(k," = ").concat(R,";"));else{var w=E+_.size;if(w<=4){var F="vec".concat(_.size),C=pn.slice(E,w).join("");f.push("  ".concat(F," ").concat(k," = ").concat(R,".").concat(C,";"))}else{var N=_.size===4?"vec4":"vec".concat(_.size),G=pn.slice(E).map(function(D){return"".concat(R,".").concat(D)}),M=pn.slice(0,w-4).map(function(D){return"".concat(L,".").concat(D)}),P=[].concat(V(G),V(M)).join(", ");f.push("  ".concat(N," ").concat(k," = ").concat(N,"(").concat(P,");"))}}y.push("  ".concat(c).concat(x," = ").concat(k,";"))},g=0,p=o;g<p.length;g++)m();return{fetchCode:f.join(`
`),varyingAssignments:y.join(`
`)}}function fa(a,n,t){if(!(!n||t.type==="sampler2D"))switch(t.type){case"float":a.uniform1f(n,t.value);break;case"int":case"bool":a.uniform1i(n,t.value);break;case"vec2":a.uniform2fv(n,t.value);break;case"vec3":a.uniform3fv(n,t.value);break;case"vec4":a.uniform4fv(n,t.value);break;case"mat3":a.uniformMatrix3fv(n,!1,t.value);break;case"mat4":a.uniformMatrix4fv(n,!1,t.value);break}}var pl=S(S(S(S(S(S(S(S({},WebGL2RenderingContext.BOOL,1),WebGL2RenderingContext.BYTE,1),WebGL2RenderingContext.UNSIGNED_BYTE,1),WebGL2RenderingContext.SHORT,2),WebGL2RenderingContext.UNSIGNED_SHORT,2),WebGL2RenderingContext.INT,4),WebGL2RenderingContext.UNSIGNED_INT,4),WebGL2RenderingContext.FLOAT,4);function mn(a){var n=a.match(/^(#version[^\n]*\n)/);return n?n[1]+`#define PICKING_MODE
`+a.slice(n[1].length):`#define PICKING_MODE
`+a}var He=(function(){function a(n,t,e){q(this,a),S(this,"floats",new Float32Array),S(this,"ints",new Uint32Array),S(this,"constantArray",new Float32Array),S(this,"capacity",0),S(this,"verticesCount",0),S(this,"bufferGeneration",0),S(this,"uploadedGeneration",new Map),S(this,"constantBufferGeneration",0),S(this,"uploadedConstantGeneration",new Map),S(this,"renderOffset",0),S(this,"renderCount",-1),S(this,"debugStats",{drawCalls:0,verticesDrawn:0,bufferUploadBytes:0}),S(this,"shadersLogged",!1),S(this,"pickProgram",null);var r=this.getDefinition();if(this.VERTICES=r.VERTICES,this.VERTEX_SHADER_SOURCE=r.VERTEX_SHADER_SOURCE,this.FRAGMENT_SHADER_SOURCE=r.FRAGMENT_SHADER_SOURCE,this.UNIFORMS=r.UNIFORMS,this.ATTRIBUTES=r.ATTRIBUTES,this.METHOD=r.METHOD,this.CONSTANT_ATTRIBUTES="CONSTANT_ATTRIBUTES"in r?r.CONSTANT_ATTRIBUTES:[],this.CONSTANT_DATA="CONSTANT_DATA"in r?r.CONSTANT_DATA:[],this.isInstanced="CONSTANT_ATTRIBUTES"in r,this.ATTRIBUTES_ITEMS_COUNT=ia(this.ATTRIBUTES),this.STRIDE=this.VERTICES*this.ATTRIBUTES_ITEMS_COUNT,this.renderer=e,this.normalProgram=this.getProgramInfo("normal",n,r.VERTEX_SHADER_SOURCE,r.FRAGMENT_SHADER_SOURCE,null),this.pickProgram=this.getProgramInfo("pick",n,mn(r.VERTEX_SHADER_SOURCE),mn(r.FRAGMENT_SHADER_SOURCE),null),this.isInstanced){var i=ia(this.CONSTANT_ATTRIBUTES);if(this.CONSTANT_DATA.length!==this.VERTICES)throw new Error("Program: error while getting constant data (expected ".concat(this.VERTICES," items, received ").concat(this.CONSTANT_DATA.length," instead)"));this.constantArray=new Float32Array(this.CONSTANT_DATA.length*i);for(var o=0;o<this.CONSTANT_DATA.length;o++){var s=this.CONSTANT_DATA[o];if(s.length!==i)throw new Error("Program: error while getting constant data (one vector has ".concat(s.length," items instead of ").concat(i,")"));for(var l=0;l<s.length;l++)this.constantArray[o*i+l]=s[l]}this.STRIDE=this.ATTRIBUTES_ITEMS_COUNT}}return Y(a,[{key:"kill",value:function(){kr(this.normalProgram),this.pickProgram&&kr(this.pickProgram)}},{key:"resetDebugStats",value:function(){this.debugStats.drawCalls=0,this.debugStats.verticesDrawn=0,this.debugStats.bufferUploadBytes=0}},{key:"getProgramInfo",value:function(t,e,r,i,o){var s=e.createBuffer();if(s===null)throw new Error("Program: error while creating the WebGL buffer.");var l=sa(e,r),u=la(e,i),d=ua(e,[l,u]),h={};this.UNIFORMS.forEach(function(v){var y=e.getUniformLocation(d,v);y&&(h[v]=y)});var c={};this.ATTRIBUTES.forEach(function(v){c[v.name]=e.getAttribLocation(d,v.name)});var f;if(this.isInstanced&&(this.CONSTANT_ATTRIBUTES.forEach(function(v){c[v.name]=e.getAttribLocation(d,v.name)}),f=e.createBuffer(),f===null))throw new Error("Program: error while creating the WebGL constant buffer.");return{name:t,program:d,gl:e,frameBuffer:o,buffer:s,constantBuffer:f||{},uniformLocations:h,attributeLocations:c,isPicking:t==="pick",vertexShader:l,fragmentShader:u}}},{key:"bindProgram",value:function(t){var e=this,r=0,i=t.gl,o=t.buffer;if(this.isInstanced){if(i.bindBuffer(i.ARRAY_BUFFER,t.constantBuffer),r=0,this.CONSTANT_ATTRIBUTES.forEach(function(d){return r+=e.bindAttribute(d,t,r,!1)}),this.uploadedConstantGeneration.get(t.constantBuffer)!==this.constantBufferGeneration){var l;i.bufferData(i.ARRAY_BUFFER,this.constantArray,i.STATIC_DRAW),this.uploadedConstantGeneration.set(t.constantBuffer,this.constantBufferGeneration),(l=this.renderer)!==null&&l!==void 0&&l.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.constantArray.byteLength)}if(i.bindBuffer(i.ARRAY_BUFFER,t.buffer),r=this.renderOffset*this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT,this.ATTRIBUTES.forEach(function(d){return r+=e.bindAttribute(d,t,r,!0)}),this.uploadedGeneration.get(o)!==this.bufferGeneration){var u;i.bufferData(i.ARRAY_BUFFER,this.floats,i.DYNAMIC_DRAW),this.uploadedGeneration.set(o,this.bufferGeneration),(u=this.renderer)!==null&&u!==void 0&&u.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength)}}else if(i.bindBuffer(i.ARRAY_BUFFER,o),r=0,this.ATTRIBUTES.forEach(function(d){return r+=e.bindAttribute(d,t,r)}),this.uploadedGeneration.get(o)!==this.bufferGeneration){var s;i.bufferData(i.ARRAY_BUFFER,this.floats,i.DYNAMIC_DRAW),this.uploadedGeneration.set(o,this.bufferGeneration),(s=this.renderer)!==null&&s!==void 0&&s.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength)}i.bindBuffer(i.ARRAY_BUFFER,null)}},{key:"unbindProgram",value:function(t){var e=this;this.isInstanced?(this.CONSTANT_ATTRIBUTES.forEach(function(r){return e.unbindAttribute(r,t,!1)}),this.ATTRIBUTES.forEach(function(r){return e.unbindAttribute(r,t,!0)})):this.ATTRIBUTES.forEach(function(r){return e.unbindAttribute(r,t)})}},{key:"bindAttribute",value:function(t,e,r,i){var o=pl[t.type];if(typeof o!="number")throw new Error('Program.bind: yet unsupported attribute type "'.concat(t.type,'"'));var s=e.attributeLocations[t.name],l=e.gl;if(s!==-1){l.enableVertexAttribArray(s);var u=this.isInstanced?(i?this.ATTRIBUTES_ITEMS_COUNT:ia(this.CONSTANT_ATTRIBUTES))*Float32Array.BYTES_PER_ELEMENT:this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT;l.vertexAttribPointer(s,t.size,t.type,t.normalized||!1,u,r),this.isInstanced&&i&&l.vertexAttribDivisor(s,1)}return t.size*o}},{key:"unbindAttribute",value:function(t,e,r){var i=e.attributeLocations[t.name],o=e.gl;i!==-1&&(o.disableVertexAttribArray(i),this.isInstanced&&r&&o.vertexAttribDivisor(i,0))}},{key:"reallocate",value:function(t){t!==this.capacity&&(this.capacity=t,this.verticesCount=this.VERTICES*t,this.floats=new Float32Array(this.isInstanced?this.capacity*this.ATTRIBUTES_ITEMS_COUNT:this.verticesCount*this.ATTRIBUTES_ITEMS_COUNT),this.ints=new Uint32Array(this.floats.buffer),this.invalidateBuffers())}},{key:"invalidateBuffers",value:function(){this.bufferGeneration++,this.constantBufferGeneration++}},{key:"hasNothingToRender",value:function(){return this.verticesCount===0}},{key:"setTypedUniform",value:function(t,e){var r;fa(e.gl,(r=e.uniformLocations[t.name])!==null&&r!==void 0?r:null,t)}},{key:"renderProgram",value:function(t,e){var r=e.gl,i=e.program,o=e.isPicking;o?r.disable(r.BLEND):r.enable(r.BLEND),r.useProgram(i),this.setUniforms(t,e),this.drawWebGL(this.METHOD,e)}},{key:"render",value:function(t,e,r){var i;if(!this.shadersLogged&&(i=this.renderer)!==null&&i!==void 0&&i.getSetting("DEBUG_logShaders")&&(this.shadersLogged=!0,console.log("[sigma] DEBUG_logShaders: ".concat(this.constructor.name),{normal:{vertexShaderSource:this.VERTEX_SHADER_SOURCE,fragmentShaderSource:this.FRAGMENT_SHADER_SOURCE},pick:{vertexShaderSource:mn(this.VERTEX_SHADER_SOURCE),fragmentShaderSource:mn(this.FRAGMENT_SHADER_SOURCE)}})),!this.hasNothingToRender()){this.renderOffset=e??0,this.renderCount=r??-1;var o=this.normalProgram.gl;if(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,t.width*t.pixelRatio,t.height*t.pixelRatio),this.bindProgram(this.normalProgram),this.renderProgram(t,this.normalProgram),this.unbindProgram(this.normalProgram),this.pickProgram&&t.pickingFrameBuffer){var s=Math.ceil(t.width*t.pixelRatio/t.downSizingRatio),l=Math.ceil(t.height*t.pixelRatio/t.downSizingRatio);o.bindFramebuffer(o.FRAMEBUFFER,t.pickingFrameBuffer),o.viewport(0,0,s,l),this.bindProgram(this.pickProgram),this.renderProgram(t,this.pickProgram),this.unbindProgram(this.pickProgram),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,t.width*t.pixelRatio,t.height*t.pixelRatio)}}}},{key:"drawWebGL",value:function(t,e){var r,i=e.gl,o=this.renderCount>=0?this.renderCount:this.capacity;(r=this.renderer)!==null&&r!==void 0&&r.getSetting("DEBUG_logRenderStats")&&(this.debugStats.drawCalls++,this.debugStats.verticesDrawn+=o*this.VERTICES),this.isInstanced?i.drawArraysInstanced(t,0,this.VERTICES,o):i.drawArrays(t,this.renderOffset*this.VERTICES,o*this.VERTICES)}}])})(),Ge=2,Gt=7,Yr={below:0,above:1,left:2,right:3};function ml(){var a=`#version 300 es
precision highp float;

uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;

uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

// Atlas size is fixed at 2048\xD72048 \u2014 matches AttachmentManager.ATLAS_SIZE.
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;           // node-data texture index
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // attachment dimensions (CSS px)
in float a_positionMode;        // label position: 0=right 1=left 2=above 3=below 4=over
in float a_attachmentPlacement; // 0=below 1=above 2=left 3=right (relative to label)
in float a_labelWidth;          // label width (CSS px)
in float a_labelHeight;         // label height: font line box (CSS px)
in float a_textHeight;          // actual glyph height (CSS px)
in float a_labelAngle;          // label rotation angle (radians)

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

`.concat(we,`
`).concat(Oe,`
`).concat(ht,`
`).concat(Xr,`
`).concat(il,`

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; we just read the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  vec3 nodeClip = u_matrix * vec3(nodePos, 1.0);

  // Node radius in physical pixels (matches label/background).
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusPixels = nodeRadiusGraphSpace * matrixScaleX * u_resolution.x / 2.0;

  // CSS-px inputs -> physical px, scaled by the zoom-dependent label ratio, so
  // the attachment stays glued to the label box exactly as the label scales.
  float zoomScale = u_zoomLabelSizeRatio;
  vec2 labelHalf = vec2(a_labelWidth, a_labelHeight) * 0.5 * zoomScale * u_pixelRatio;
  vec2 attachHalf = a_attachmentSize * 0.5 * zoomScale * u_pixelRatio;
  float gap = `).concat(Ge.toFixed(1),` * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Graph-aligned labels add the camera angle so the attachment orbits with the box.
  mat2 labelRotMat = rotate2D(a_labelAngle - labelRotation * u_cameraAngle);

  // Label box center relative to the node center (pre-rotation). The shape-aware
  // edge distance comes from the frame texture, so placement matches the label.
  vec2 boxCenter = vec2(0.0);
  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * 0.5 * zoomScale * u_pixelRatio;
    boxCenter = labelBoxCenter(a_positionMode, labelStart, labelHalf, textHalf);
  }

  // Horizontal anchor of below/above attachments tracks the label position, so
  // the attachment hangs from the label edge nearest the node (or is centered
  // when the label itself is node-centered): right->left, left->right, else center.
  float anchorX = 0.0;
  if (a_positionMode < 0.5) anchorX = -labelHalf.x + attachHalf.x;       // right label
  else if (a_positionMode < 1.5) anchorX = labelHalf.x - attachHalf.x;   // left label

  // Attachment center relative to the box (pre-rotation, Y-down). This offset
  // depends only on the box, the gap and the attachment size \u2014 never the shape.
  vec2 attachCenter;
  if (a_attachmentPlacement < 0.5) {
    // below
    attachCenter = boxCenter + vec2(anchorX, labelHalf.y + gap + attachHalf.y);
  } else if (a_attachmentPlacement < 1.5) {
    // above
    attachCenter = boxCenter + vec2(anchorX, -(labelHalf.y + gap + attachHalf.y));
  } else if (a_attachmentPlacement < 2.5) {
    // left, top-aligned
    attachCenter = boxCenter + vec2(-(labelHalf.x + gap + attachHalf.x), -labelHalf.y + attachHalf.y);
  } else {
    // right, top-aligned
    attachCenter = boxCenter + vec2(labelHalf.x + gap + attachHalf.x, -labelHalf.y + attachHalf.y);
  }

  // Rotate the whole assembly by the label angle, around the node center.
  vec2 rotatedCenter = labelRotMat * attachCenter;
  vec2 cornerOffset = labelRotMat * (a_quadCorner * attachHalf);

  // Node center in screen px (Y-down).
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;

  // Snap node center to the pixel grid so label/backdrop/attachment move as one.
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left to integer pixels so atlas texels map 1:1.
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - attachHalf;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + attachHalf;

  vec2 vertexScreen = centerScreen + cornerOffset;
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`);return a}var yl=`#version 300 es
precision highp float;

uniform sampler2D u_atlasTexture;

in vec2 v_texCoord;

layout(location = 0) out vec4 fragColor;
#ifdef PICKING_MODE
layout(location = 1) out vec4 pickColor;
#endif

void main() {
  // Canvas textures are premultiplied; output directly for (ONE, 1-SRC_ALPHA) blending
  vec4 color = texture(u_atlasTexture, v_texCoord);
  if (color.a < 0.01) discard;
  fragColor = color;
#ifdef PICKING_MODE
  pickColor = vec4(0.0); // Attachments are not pickable
#endif
}
`;function bl(a,n,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:dt,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=ml(),h=yl,c=(function(f){function v(){var y;q(this,v);for(var m=arguments.length,g=new Array(m),p=0;p<m;p++)g[p]=arguments[p];return y=te(this,v,[].concat(g)),S(y,"totalCount",0),S(y,"bufferCapacity",0),y}return ne(v,f),Y(v,[{key:"getDefinition",value:function(){var m=WebGL2RenderingContext,g=m.FLOAT,p=m.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:h,METHOD:p,UNIFORMS:["u_matrix","u_resolution","u_labelPixelSnapping","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_atlasTexture"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:g},{name:"a_atlasRect",size:4,type:g},{name:"a_attachmentSize",size:2,type:g},{name:"a_positionMode",size:1,type:g},{name:"a_attachmentPlacement",size:1,type:g},{name:"a_labelWidth",size:1,type:g},{name:"a_labelHeight",size:1,type:g},{name:"a_textHeight",size:1,type:g},{name:"a_labelAngle",size:1,type:g}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:g}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processAttachment",value:function(m,g){var p=this.floats,b=m*this.STRIDE;p[b++]=g.nodeIndex,p[b++]=g.atlasX,p[b++]=g.atlasY,p[b++]=g.atlasW,p[b++]=g.atlasH,p[b++]=g.attachWidth,p[b++]=g.attachHeight,p[b++]=g.positionMode,p[b++]=g.attachmentPlacement,p[b++]=g.labelWidth,p[b++]=g.labelHeight,p[b++]=g.textHeight,p[b++]=g.labelAngle}},{key:"setUniforms",value:function(m,g){var p=g.gl,b=g.uniformLocations;p.uniformMatrix3fv(b.u_matrix,!1,m.matrix),p.uniform2f(b.u_resolution,m.width*m.pixelRatio,m.height*m.pixelRatio),p.uniform1f(b.u_labelPixelSnapping,m.labelPixelSnapping),p.uniform1f(b.u_sizeRatio,m.sizeRatio),p.uniform1f(b.u_correctionRatio,m.correctionRatio),p.uniform1f(b.u_cameraAngle,m.cameraAngle),p.uniform1f(b.u_pixelRatio,m.pixelRatio),p.uniform1f(b.u_labelMargin,v.labelMargin),p.uniform1f(b.u_zoomLabelSizeRatio,1/u(m.zoomRatio)),p.uniform1i(b.u_nodeDataTexture,m.nodeDataTextureUnit),p.uniform1i(b.u_nodeDataTextureWidth,m.nodeDataTextureWidth),p.uniform1i(b.u_nodeFrameTexture,m.nodeFrameTextureUnit),p.uniform1i(b.u_nodeFrameTextureWidth,m.nodeFrameTextureWidth),p.uniform1i(b.u_atlasTexture,Gt)}},{key:"reallocateAttachments",value:function(m){this.totalCount=m,m>this.bufferCapacity&&(this.bufferCapacity=Math.max(m,Math.ceil(this.bufferCapacity*1.5)||10),se(v,"reallocate",this,3)([this.bufferCapacity]))}},{key:"hasNothingToRender",value:function(){return this.totalCount===0}},{key:"drawWebGL",value:function(m,g){var p=g.gl;this.totalCount!==0&&p.drawArraysInstanced(m,0,this.VERTICES,this.totalCount)}}])})(He);return S(c,"labelMargin",l),new c(a,n,t)}var Fe=5;function Rn(a,n){return[].concat(V(n),V(a.map(function(t){var e;return{attributes:(e=t.attributes)!==null&&e!==void 0?e:[]}})))}function ct(a,n){var t=ye(Rn(a,n)),e=new Set(a.flatMap(function(u){var d;return(d=u.attributes)!==null&&d!==void 0?d:[]}).map(function(u){return u.name.replace(/^a_/,"")})),r={},i={},o=z(e),s;try{for(o.s();!(s=o.n()).done;){var l=s.value;r[l]=t.offsets[l],i[l]=t.specs[l]}}catch(u){o.e(u)}finally{o.f()}return W(W({},t),{},{offsets:r,specs:i})}function xl(a,n){var t=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pickingPadding","u_nodeDataTexture","u_layerAttributeTexture"]),e=new Set,r=a.flatMap(function(f){return f.uniforms}).filter(function(f){return t.has(f.name)||e.has(f.name)?!1:(e.add(f.name),!0)}).map(function(f){return"uniform ".concat(f.type," ").concat(f.name,";")}).join(`
`),i=n.flatMap(function(f){return f.uniforms}).filter(function(f){return t.has(f.name)||e.has(f.name)?!1:(e.add(f.name),!0)}).map(function(f){return"uniform ".concat(f.type," ").concat(f.name,";")}).join(`
`),o=Rn(a,n),s=new Set,l=o.flatMap(function(f){return f.attributes}).filter(function(f){var v=f.name.replace(/^a_/,"");return s.has(v)?!1:(s.add(v),!0)}).map(function(f){var v=f.name.replace(/^a_/,""),y=f.size===1?"float":"vec".concat(f.size);return"out ".concat(y," v_").concat(v,";")}).join(`
`),u=lt(ye(o),{varPrefix:"layer",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),d=u.fetchCode,h=u.varyingAssignments,c=`#version 300 es

// Standard node attributes (per instance) - minimal buffer usage
in float a_nodeIndex;  // Index into node data texture AND layer attribute texture
in vec4 a_id;          // Node ID for picking
in float a_opacity;    // Node opacity, applied once to the final fragment

// Constant attributes (per vertex, same for all instances)
in vec2 a_quadCorner;  // (-1,-1), (1,-1), (1,1), (-1,1) for quad corners

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;

// Layer attribute texture uniforms
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

`.concat(r,`
`).concat(i,`

// Standard varyings
out vec2 v_uv;                    // Normalized coordinates [-1, 1]
out vec4 v_id;
out float v_opacity;
out float v_antialiasingWidth;    // Width for antialiasing in UV space
out float v_pixelSize;            // Node size in pixels (for pixel-mode borders)
out float v_pixelToUV;            // Conversion factor: multiply by this to convert screen pixels to UV units
out float v_shapeId;              // Shape ID for multi-shape programs

// Layer varyings
`).concat(l,`

// Node-data fetch helpers (geometry texel + rotation-flags texel)
`).concat(we,`
`).concat(Oe,`

void main() {
  // Fetch node geometry: vec4(x, y, size, shapeId).
  int nodeIdx = int(a_nodeIndex);

  // Hidden nodes are flagged with a negative row by NodeProgram.process(). Push
  // the whole quad outside the clip volume: every vertex lands at the same
  // out-of-range position, so the primitive is fully clipped and rasterizes
  // nothing \u2014 neither to the frame buffer nor to the picking buffer.
  if (nodeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    return;
  }

  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_position = nodeData.xy;
  float a_size = nodeData.z;
  v_shapeId = nodeData.w;  // Pass shape ID to fragment shader

  // Per-node rotation alignment: 0 = viewport (screen-upright), 1 = graph.
  float nodeRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).r;

`).concat(d,`

  // Calculate the actual size in pixels
  float size = a_size * u_correctionRatio / u_sizeRatio * 2.0;

  // In PICKING_MODE, inflate the quad by nodePickingPadding pixels on each side
  #ifdef PICKING_MODE
    float paddedSize = size + u_pickingPadding * u_correctionRatio;
    vec2 offset = a_quadCorner * paddedSize;
  #else
    vec2 offset = a_quadCorner * size;
  #endif
  // Counter-rotate the quad offset so viewport-aligned nodes stay upright as the
  // camera turns. Graph-aligned nodes (nodeRotation=1) skip it and turn with the
  // camera. The angle scales by (1 - nodeRotation) so both fall out of one path.
  {
    float ca = u_cameraAngle * (1.0 - nodeRotation);
    float c = cos(ca);
    float s = sin(ca);
    offset = mat2(c, s, -s, c) * offset;
  }
  vec2 position = a_position + offset;

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  // In PICKING_MODE, UV is scaled beyond [-1, 1] to match the inflated quad
  #ifdef PICKING_MODE
    v_uv = a_quadCorner * (paddedSize / size);
  #else
    v_uv = a_quadCorner;
  #endif

  // Pass ID to fragment shader
  v_id = a_id;
  v_opacity = a_opacity;

  // Pass pixel size for layers that need pixel-mode calculations
  // Multiply by 2 because 'size' is half-width (offset from center), not full diameter
  v_pixelSize = size * 2.0;

  // Conversion factor from screen pixels to UV units
  // Same derivation as v_antialiasingWidth which represents ~1 pixel in UV space
  // P pixels in UV space = P * u_correctionRatio / size
  v_pixelToUV = u_correctionRatio / size;

  // We use an antialiasing width of 1px (so v_pixelToUV)
  v_antialiasingWidth = v_pixelToUV;

  // Pass layer attributes to fragment shader (fetched from texture)
`).concat(h,`
}
`);return c}function _l(a,n,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!0,r=n.map(function(v,y){var m="layer_".concat(v.name),g=[].concat(V(v.attributes.map(function(p){return"v_".concat(p.name.replace(/^a_/,""))})),V(v.uniforms.map(function(p){return p.name}))).join(", ");return"  // Layer ".concat(y+1,": ").concat(v.name,`
  color = blendOver(color, `).concat(m,"(").concat(g,"));")}).join(`

`),i=new Set(["u_correctionRatio"]),o=new Set,s=a.flatMap(function(v){return v.uniforms}).filter(function(v){return i.has(v.name)||o.has(v.name)?!1:(o.add(v.name),!0)}).map(function(v){return"uniform ".concat(v.type," ").concat(v.name,";")}).join(`
`),l=n.flatMap(function(v){return v.uniforms}).filter(function(v){return i.has(v.name)||o.has(v.name)?!1:(o.add(v.name),!0)}).map(function(v){return"uniform ".concat(v.type," ").concat(v.name,";")}).join(`
`),u=new Set,d=Rn(a,n).flatMap(function(v){return v.attributes}).filter(function(v){var y=v.name.replace(/^a_/,"");return u.has(y)?!1:(u.add(y),!0)}).map(function(v){var y=v.name.replace(/^a_/,""),m=v.size===1?"float":"vec".concat(v.size);return"in ".concat(m," v_").concat(y,";")}).join(`
`),h=da(a),c=rl(a,t),f=`#version 300 es
precision highp float;

// Standard varyings
in vec2 v_uv;
in vec4 v_id;
in float v_opacity;
in float v_antialiasingWidth;
in float v_pixelSize;
in float v_pixelToUV;
in float v_shapeId;  // Shape ID for multi-shape programs

// Standard uniforms (needed for some layer calculations like pixel-mode borders)
uniform float u_correctionRatio;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Shape uniforms
`.concat(s,`

// Layer uniforms
`).concat(l,`

// Layer varyings
`).concat(d,`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// LayerContext struct - provides rendering context to all layers
struct LayerContext {
  float sdf;             // Signed distance from shape boundary (negative inside)
  vec2 uv;               // UV coordinates [-1, 1], center at (0,0)
  float shapeSize;       // Effective shape size (~diameter) in UV space (1.0 - aaWidth)
  float shapeHalfSize;   // Effective shape half size (~radius) in UV space
  float pixelSize;       // Node full size (~diameter) in screen pixels
  float aaWidth;         // Anti-aliasing width for smooth transitions
  float correctionRatio; // Scaling factor for consistent rendering across zoom levels
  float pixelToUV;       // Conversion factor: multiply screen pixels by this to get UV units
  float inradiusFactor;  // Ratio of inradius to circumradius (shape depth factor)
};

LayerContext context;  // Global instance, populated before layer calls

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// SDF shape functions
`).concat(h,`

// Shape selector function (sets context.sdf and context.inradiusFactor)
`).concat(c,`

// Layer functions
`).concat(n.map(function(v){return v.glsl}).join(`

`),`

void main() {
  // 1. Setup LayerContext (available to all layer functions)
  context.shapeSize = 1.0 - v_antialiasingWidth;
  context.shapeHalfSize = context.shapeSize * 0.5;
  context.pixelSize = v_pixelSize;
  context.uv = v_uv;
  context.aaWidth = v_antialiasingWidth;
  context.correctionRatio = u_correctionRatio;
  context.pixelToUV = v_pixelToUV;

  // Query shape SDF based on shapeId (sets context.sdf and context.inradiusFactor)
  queryNodeSDF(int(v_shapeId), v_uv, context.shapeSize);

  // 2. Early discard for pixels fully outside the shape (with AA margin)
  // In PICKING_MODE, allow extra fragments up to the picking padding distance
  #ifdef PICKING_MODE
    if (context.sdf > u_pickingPadding * v_pixelToUV + context.aaWidth) discard;
  #else
    if (context.sdf > context.aaWidth) discard;
  #endif

  // 3. Apply layers sequentially with "over" compositing
  vec4 color = vec4(0.0);

`).concat(r,`

  #ifdef PICKING_MODE
    // Picking pass: output node ID for pixels within the picking area.
    if (context.sdf > u_pickingPadding * v_pixelToUV) discard;
    fragColor = v_id;
  #else
`).concat(e?`    // Visual pass: apply antialiasing at shape boundary, node opacity once
    // smoothstep provides smooth transition from opaque to transparent
    float alpha = smoothstep(context.aaWidth, -context.aaWidth, context.sdf) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) shape boundary, node opacity applied once
    float alpha = (context.sdf < 0.0 ? 1.0 : 0.0) * v_opacity;`,`
    // Mix with transparent to fade both color AND alpha together (avoids bright halo)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`);return f}function Tl(a,n){var t=new Set;return t.add("u_matrix"),t.add("u_sizeRatio"),t.add("u_correctionRatio"),t.add("u_cameraAngle"),t.add("u_pickingPadding"),t.add("u_nodeDataTexture"),t.add("u_nodeDataTextureWidth"),t.add("u_layerAttributeTexture"),t.add("u_layerAttributeTextureWidth"),t.add("u_layerAttributeTexelsPerNode"),a.forEach(function(e){e.uniforms.forEach(function(r){return t.add(r.name)})}),n.forEach(function(e){e.uniforms.forEach(function(r){return t.add(r.name)})}),Array.from(t)}function Sl(a){var n=WebGL2RenderingContext,t=n.UNSIGNED_BYTE,e=n.FLOAT;return[{name:"a_nodeIndex",size:1,type:e},{name:"a_id",size:4,type:t,normalized:!0},{name:"a_opacity",size:1,type:e}]}function Fr(a){var n=a.shapes,t=a.layers,e=a.shapeGlobalIds,r=a.antialias,i=r===void 0?!0:r;return{vertexShader:xl(n,t),fragmentShader:_l(n,t,e,i),uniforms:Tl(n,t),attributes:Sl()}}function Kr(a,n,t){var e=ct(a,n),r=e.specs;return Object.keys(r).map(function(i){return"flat ".concat(t," ").concat(r[i].size===1?"float":"vec".concat(r[i].size)," v_").concat(i,";")}).join(`
`)}function El(a){var n,t,e=a.shapes,r=a.layers,i=a.shapeGlobalIds,o=lt(ct(e,r),{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),s=e.length===1?"float inradiusFactor = ".concat(ae((n=e[0].inradiusFactor)!==null&&n!==void 0?n:1),";"):"float inradiusFactor = ".concat(ae((t=e[0].inradiusFactor)!==null&&t!==void 0?t:1),`;
  switch (int(shapeId)) {
`).concat(e.map(function(u,d){var h,c=i?i[d]:d;return"    case ".concat(c,": inradiusFactor = ").concat(ae((h=u.inradiusFactor)!==null&&h!==void 0?h:1),"; break;")}).join(`
`),`
    default: break;
  }`),l=`#version 300 es

in float a_nodeIndex;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in vec4 a_backdropColor;
in vec4 a_backdropShadowColor;
in float a_backdropShadowBlur;
in float a_backdropPadding;
in vec4 a_backdropBorderColor;
in vec4 a_backdropExtra; // [borderWidth, cornerRadius, labelPadding, area]
in vec2 a_labelBoxOffset;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

out vec2 v_uv;
out vec2 v_nodeCenter;
out float v_nodeRadius;
out vec2 v_labelCenter;
out vec2 v_labelHalfSize;
out float v_aaWidth;
out float v_shapeId;
out float v_nodeRotation;
out float v_labelAngle;
out vec4 v_backdropColor;
out vec4 v_backdropShadowColor;
out float v_backdropShadowBlur;
out float v_backdropPadding;
out vec4 v_backdropBorderColor;
out float v_backdropBorderWidth;
out float v_backdropCornerRadius;
out float v_backdropArea;
`.concat(Kr(e,r,"out"),`

`).concat(we,`
`).concat(Oe,`
`).concat(ht,`

void main() {
  int nodeIdx = int(a_nodeIndex);
`).concat(o.fetchCode,`
`).concat(o.varyingAssignments,`

  // Node data: (x, y, size, shapeId). shapeId (global) is forwarded to the
  // fragment shader, which keeps the shape SDF for the outline.
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;
  float shapeId = nodeData.w;

  // Per-node rotation alignment (0 = viewport, 1 = graph). nodeRotation drives
  // the fragment's shape outline; labelRotation turns the label box with camera.
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;
  v_nodeRotation = nodeRotation;

  `).concat(Vr,`
  // CSS pixel attributes are multiplied by u_pixelRatio to match nodeRadiusPixels,
  // which is already in physical pixels (nodeRadiusNDC * u_resolution.x / 2.0).
  float padding = a_backdropPadding * u_pixelRatio;
  float shadowBlur = a_backdropShadowBlur * u_pixelRatio;
  // Unpack a_backdropExtra: [borderWidth, cornerRadius, labelPadding, area]
  float borderWidth = a_backdropExtra.x * u_pixelRatio;
  float cornerRadius = a_backdropExtra.y * u_pixelRatio;
  float labelPad = a_backdropExtra.z * u_pixelRatio;
  float backdropArea = a_backdropExtra.w;
  // Use 2x shadowBlur so the Gaussian fully decays before the quad edge
  float totalExpansion = shadowBlur * 2.0 + borderWidth;
  float enlargedRadius = nodeRadiusPixels + padding;

  // Circumscribed radius for the quad bounds. Non-circular shapes reach past
  // their inradius out to their circumradius (= enlargedRadius / inradiusFactor),
  // in any direction once rotated. The axis-aligned quad must contain that, or
  // the fill/shadow gets clipped (square corners, triangle tip, etc.).
  `).concat(s,`
  float boundRadius = enlargedRadius / inradiusFactor;

  // Apply zoom-dependent label size scaling
  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Only apply labelPad when a label is actually present
  float effectiveLabelPad = labelW > 0.0 ? labelPad : 0.0;
  vec2 labelHalfSize = vec2(labelW * 0.5 + effectiveLabelPad, labelH * 0.5 + effectiveLabelPad);
  vec2 labelOffset = vec2(0.0);

  // Effective label angle: intrinsic angle plus the camera angle when the label
  // is graph-aligned, so the box orbits the node in lockstep with the frame-pass.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 snapDelta = vec2(0.0);

  if (labelW > 0.0) {
    // labelW > 0.0 means this node's label is displayed, so the frame-pass wrote
    // its edge distance this frame.
    float edgeDistPixels = nodeRadiusPixels * readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;
    // labelMargin matches the label shader's margin (gap from node edge to text)
    float labelStart = edgeDistPixels + labelMargin;
    // Above/below center on the actual glyph height, not the font line box, so
    // the box stays aligned with the rendered text (matches labelBoxCenter()).
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;

    // Snap node center to pixel grid so label/backdrop/attachment move as a unit
    vec2 nodeScreen = vec2(
      (nodeClip.x + 1.0) * u_resolution.x,
      (1.0 - nodeClip.y) * u_resolution.y
    ) * 0.5;
    snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

    if (a_positionMode < 0.5) {
      // Right: box spans from node center to text end + padding
      float boxRightEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(boxRightEdge * 0.5, 0.0);
      labelHalfSize.x = boxRightEdge * 0.5;
    } else if (a_positionMode < 1.5) {
      // Left: mirror of right
      float boxLeftEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(-boxLeftEdge * 0.5, 0.0);
      labelHalfSize.x = boxLeftEdge * 0.5;
    } else if (a_positionMode < 2.5) {
      // Above: text bottom at labelStart, centered horizontally
      labelOffset = vec2(0.0, -(labelStart + textHalf));
    } else if (a_positionMode < 3.5) {
      // Below: text top at labelStart, centered horizontally
      labelOffset = vec2(0.0, labelStart + textHalf);
    }
    // over (>=4): labelOffset stays (0,0) \u2014 text centered on the node.

    // The attachment-cover shift is in label space (like the attachment itself),
    // so rotate it together with the position offset \u2014 otherwise the box drifts
    // off the attachment as the label angle grows.
    labelOffset = labelRotMat * (labelOffset + a_labelBoxOffset * zoomScale * u_pixelRatio);
  }

  // For node-only mode, zero out label dimensions
  if (backdropArea > 0.5 && backdropArea < 1.5) {
    labelHalfSize = vec2(0.0);
    labelOffset = vec2(0.0);
  }

  vec2 minBound, maxBound;

  bool hasLabelBounds = labelW > 0.0 && (backdropArea > 1.5 || backdropArea < 0.5);

  if (hasLabelBounds) {
    // Union with label bounds (area=both) or label-only bounds (area=label)
    vec2 labelMin, labelMax;

    if (a_labelAngle != 0.0) {
      vec2 corner1 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, -labelHalfSize.y);
      vec2 corner2 = labelOffset + labelRotMat * vec2(labelHalfSize.x, -labelHalfSize.y);
      vec2 corner3 = labelOffset + labelRotMat * vec2(labelHalfSize.x, labelHalfSize.y);
      vec2 corner4 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, labelHalfSize.y);
      labelMin = min(min(corner1, corner2), min(corner3, corner4));
      labelMax = max(max(corner1, corner2), max(corner3, corner4));
    } else {
      labelMin = labelOffset - labelHalfSize;
      labelMax = labelOffset + labelHalfSize;
    }

    if (backdropArea > 1.5) {
      // Label-only: bounds from label rect only
      minBound = labelMin - totalExpansion;
      maxBound = labelMax + totalExpansion;
    } else {
      // Both: union of node + label
      minBound = min(-vec2(boundRadius), labelMin) - totalExpansion;
      maxBound = max(vec2(boundRadius), labelMax) + totalExpansion;
    }
  } else {
    // Node-only or no visible label
    float totalRadius = boundRadius + totalExpansion;
    minBound = -vec2(totalRadius);
    maxBound = vec2(totalRadius);
  }

  vec2 quadSize = maxBound - minBound;
  vec2 quadCenter = (minBound + maxBound) * 0.5;

  vec2 localPos = quadCenter + a_quadCorner * quadSize * 0.5 + snapDelta;
  vec2 ndcOffset = localPos * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);

  v_uv = localPos;
  v_nodeCenter = vec2(0.0);
  v_nodeRadius = nodeRadiusPixels;
  v_labelCenter = labelOffset;
  v_labelHalfSize = labelHalfSize;
  v_aaWidth = 1.0;
  v_shapeId = shapeId;
  v_labelAngle = labelAngle;
  v_backdropColor = a_backdropColor;
  v_backdropShadowColor = a_backdropShadowColor;
  v_backdropShadowBlur = a_backdropShadowBlur;
  v_backdropPadding = a_backdropPadding;
  v_backdropBorderColor = a_backdropBorderColor;
  v_backdropBorderWidth = borderWidth;
  v_backdropCornerRadius = cornerRadius;
  v_backdropArea = backdropArea;
}
`);return l}function Al(a){var n=a.shapes,t=a.layers,e=a.shapeGlobalIds,r=da(n),i=It(n).map(function(c){return"uniform ".concat(c.type," ").concat(c.name,";")}).join(`
`),o=function(f){return Tn(f,"nodeUV","1.0")},s;if(n.length===1)s="float nodeSdfNormalized = ".concat(o(n[0]),";");else{var l=n.map(function(c,f){var v=e?e[f]:f;return"    case ".concat(v,": nodeSdfNormalized = ").concat(o(c),"; break;")}).join(`
`),u=o(n[0]);s=`float nodeSdfNormalized;
  int shapeId = int(v_shapeId);
  switch (shapeId) {
`.concat(l,`
    default: nodeSdfNormalized = `).concat(u,`;
  }`)}var d=`float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  float ca = u_cameraAngle * v_nodeRotation;
  float ca_c = cos(ca);
  float ca_s = sin(ca);
  vec2 rotatedScreenUV = mat2(ca_c, -ca_s, ca_s, ca_c) * screenUV;
  vec2 nodeUV = vec2(rotatedScreenUV.x, -rotatedScreenUV.y) / effectiveRadius;`,h=`#version 300 es
precision highp float;

in vec2 v_uv;
in vec2 v_nodeCenter;
in float v_nodeRadius;
in vec2 v_labelCenter;
in vec2 v_labelHalfSize;
in float v_aaWidth;
in float v_shapeId;
in float v_nodeRotation;
in float v_labelAngle;
in vec4 v_backdropColor;
in vec4 v_backdropShadowColor;
in float v_backdropShadowBlur;
in float v_backdropPadding;
in vec4 v_backdropBorderColor;
in float v_backdropBorderWidth;
in float v_backdropCornerRadius;
in float v_backdropArea;
`.concat(Kr(n,t,"in"),`

uniform float u_cameraAngle;
`).concat(i,`

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragPicking;

`).concat(r,`
`).concat(ol,`
`).concat(sl,`
`).concat(ll,`
`).concat(ul,`

void main() {
  vec4 backdropColor = v_backdropColor;
  vec4 shadowColor = v_backdropShadowColor;
  float shadowBlur = v_backdropShadowBlur;
  float padding = v_backdropPadding;
  vec4 borderColor = v_backdropBorderColor;
  float borderWidth = v_backdropBorderWidth;
  float cornerRadius = v_backdropCornerRadius;

  float enlargedRadius = v_nodeRadius + padding;
  vec2 screenUV = v_uv - v_nodeCenter;
  `).concat(d,`

  // Query the correct shape SDF based on shapeId
  `).concat(s,`
  float nodeSdfPixels = nodeSdfNormalized * effectiveRadius - cornerRadius;

  // Label SDF with optional corner radius and rotation
  float labelSdfPixels;
  if (v_labelHalfSize.x > 0.0) {
    vec2 labelP = v_uv - v_labelCenter;
    labelSdfPixels = sdfRoundedRotatedBox(labelP, v_labelHalfSize, v_labelAngle, cornerRadius);
  } else {
    labelSdfPixels = 10000.0;
  }

  // Select area: 0=both, 1=node, 2=label
  float combinedSdf;
  if (v_backdropArea > 1.5) {
    combinedSdf = labelSdfPixels;
  } else if (v_backdropArea > 0.5) {
    combinedSdf = nodeSdfPixels;
  } else {
    combinedSdf = min(nodeSdfPixels, labelSdfPixels);
  }

  // Fill + border composite
  float outerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf);
  vec4 background;
  if (borderWidth > 0.5) {
    float innerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf + borderWidth);
    float fillAlpha = innerEdge * backdropColor.a;
    vec4 fill = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
    float borderAlpha = (outerEdge - innerEdge) * borderColor.a;
    vec4 border = vec4(borderColor.rgb * borderAlpha, borderAlpha);
    background = fill + border * (1.0 - fill.a);
  } else {
    float fillAlpha = outerEdge * backdropColor.a;
    background = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
  }

  // Gaussian-like shadow falloff (mimics canvas shadowBlur)
  vec4 shadow = vec4(0.0);
  float sigma = shadowBlur / 2.5;
  if (sigma > 0.001) {
    float shadowDist = max(0.0, combinedSdf);
    float shadowAlpha = exp(-(shadowDist * shadowDist) / (2.0 * sigma * sigma)) * shadowColor.a;
    shadow = vec4(shadowColor.rgb * shadowAlpha, shadowAlpha);
  }

  fragColor = background + shadow * (1.0 - background.a);
  fragPicking = vec4(0.0);
}
`);return h}function Dl(a){var n=["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"],t=z(It(a)),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;n.includes(r.name)||n.push(r.name)}}catch(i){t.e(i)}finally{t.f()}return n}function Rl(a){return{vertexShader:El(a),fragmentShader:Al(a),uniforms:Dl(a.shapes)}}function wl(a,n,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=e.shapes,u=e.layers,d=e.getAttributeTexture,h=e.shapeGlobalIds;if(l.length===0)throw new Error("createBackdropProgram: at least one shape must be provided in 'shapes'");var c=(r=s.margin)!==null&&r!==void 0?r:5,f=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},v={shapes:l,layers:u,shapeGlobalIds:h},y=Rl(v),m=(function(g){function p(){var b;q(this,p);for(var x=arguments.length,_=new Array(x),T=0;T<x;T++)_[T]=arguments[T];return b=te(this,p,[].concat(_)),S(b,"totalBackdropCount",0),S(b,"bufferCapacity",0),b}return ne(p,g),Y(p,[{key:"getDefinition",value:function(){var x=WebGL2RenderingContext,_=x.FLOAT,T=x.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:y.vertexShader,FRAGMENT_SHADER_SOURCE:y.fragmentShader,METHOD:T,UNIFORMS:y.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:_},{name:"a_labelWidth",size:1,type:_},{name:"a_labelHeight",size:1,type:_},{name:"a_textHeight",size:1,type:_},{name:"a_positionMode",size:1,type:_},{name:"a_labelAngle",size:1,type:_},{name:"a_backdropColor",size:4,type:_},{name:"a_backdropShadowColor",size:4,type:_},{name:"a_backdropShadowBlur",size:1,type:_},{name:"a_backdropPadding",size:1,type:_},{name:"a_backdropBorderColor",size:4,type:_},{name:"a_backdropExtra",size:4,type:_},{name:"a_labelBoxOffset",size:2,type:_}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:_}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processBackdrop",value:function(x,_){var T=this.floats,A=this.STRIDE,E=x*A;T[E++]=_.nodeIndex,T[E++]=_.labelWidth,T[E++]=_.labelHeight,T[E++]=_.textHeight,T[E++]=ut[_.position],T[E++]=_.labelAngle,T[E++]=_.backdropColor[0],T[E++]=_.backdropColor[1],T[E++]=_.backdropColor[2],T[E++]=_.backdropColor[3],T[E++]=_.backdropShadowColor[0],T[E++]=_.backdropShadowColor[1],T[E++]=_.backdropShadowColor[2],T[E++]=_.backdropShadowColor[3],T[E++]=_.backdropShadowBlur,T[E++]=_.backdropPadding,T[E++]=_.backdropBorderColor[0],T[E++]=_.backdropBorderColor[1],T[E++]=_.backdropBorderColor[2],T[E++]=_.backdropBorderColor[3],T[E++]=_.backdropBorderWidth,T[E++]=_.backdropCornerRadius,T[E++]=_.backdropLabelPadding,T[E++]=_.backdropArea,T[E++]=_.labelBoxOffset[0],T[E++]=_.labelBoxOffset[1]}},{key:"setUniforms",value:function(x,_){var T=_.gl,A=_.uniformLocations;T.uniformMatrix3fv(A.u_matrix,!1,x.matrix),T.uniform1f(A.u_sizeRatio,x.sizeRatio),T.uniform1f(A.u_correctionRatio,x.correctionRatio),T.uniform1f(A.u_cameraAngle,x.cameraAngle),T.uniform2f(A.u_resolution,x.width*x.pixelRatio,x.height*x.pixelRatio),T.uniform1f(A.u_pixelRatio,x.pixelRatio),T.uniform1f(A.u_labelMargin,p.labelMargin),T.uniform1f(A.u_zoomLabelSizeRatio,1/f(x.zoomRatio)),T.uniform1f(A.u_labelPixelSnapping,x.labelPixelSnapping),T.uniform1i(A.u_nodeDataTexture,x.nodeDataTextureUnit),T.uniform1i(A.u_nodeDataTextureWidth,x.nodeDataTextureWidth),T.uniform1i(A.u_nodeFrameTexture,x.nodeFrameTextureUnit),T.uniform1i(A.u_nodeFrameTextureWidth,x.nodeFrameTextureWidth);var E=d();A.u_layerAttributeTexture&&E&&(E.bind(Fe),T.uniform1i(A.u_layerAttributeTexture,Fe),T.uniform1i(A.u_layerAttributeTextureWidth,E.getTextureWidth()),T.uniform1i(A.u_layerAttributeTexelsPerNode,E.getTexelsPerItem()));var R=z(It(l)),L;try{for(R.s();!(L=R.n()).done;){var k=L.value;this.setTypedUniform(k,_)}}catch(w){R.e(w)}finally{R.f()}}},{key:"hasNothingToRender",value:function(){return this.totalBackdropCount===0}},{key:"drawWebGL",value:function(x,_){var T=_.gl;this.totalBackdropCount!==0&&(this.isInstanced?T.drawArraysInstanced(x,0,this.VERTICES,this.totalBackdropCount):T.drawArrays(x,0,this.totalBackdropCount*this.VERTICES))}},{key:"reallocate",value:function(x){this.totalBackdropCount=x,x>this.bufferCapacity&&(this.bufferCapacity=Math.max(x,Math.ceil(this.bufferCapacity*1.5)||10),se(p,"reallocate",this,3)([this.bufferCapacity]))}}])})(He);return S(m,"labelMargin",c),new m(a,n,t)}var Zr=(function(a){function n(){var t;q(this,n);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return t=te(this,n,[].concat(r)),S(t,"totalCharacterCount",0),S(t,"bufferCapacity",0),t}return ne(n,a),Y(n,[{key:"processLabel",value:function(e,r,i){if(i.hidden||!i.text)return 0;for(var o=i.text,s=o.length,l=0;l<s;l++){var u=o[l];this.processCharacter(r+l,i,u,l)}return s}},{key:"hasNothingToRender",value:function(){return this.totalCharacterCount===0}},{key:"drawWebGL",value:function(e,r){var i=r.gl;this.totalCharacterCount!==0&&(this.isInstanced?i.drawArraysInstanced(e,0,this.VERTICES,this.totalCharacterCount):i.drawArrays(e,0,this.totalCharacterCount*this.VERTICES))}},{key:"reallocate",value:function(e){this.totalCharacterCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||1e3),se(n,"reallocate",this,3)([this.bufferCapacity]))}}])})(He);function Cl(){var a=`#version 300 es

in float a_nodeIndex;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec4 v_id;
out vec4 v_color;

`.concat(we,`
`).concat(Oe,`
`).concat(ht,`
`).concat(Xr,`

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;

  // Shape-aware edge distance, read once from the shared frame texture.
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  `).concat(Vr,`

  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;
#ifdef PICKING_MODE
  float padding = u_pickingPadding * u_pixelRatio;
#else
  float padding = a_padding * u_pixelRatio;
#endif

  if (labelW <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    v_color = vec4(0.0);
    return;
  }

  vec2 labelHalfSize = vec2(labelW * 0.5 + padding, labelH * 0.5 + padding);
  vec2 labelOffset = vec2(0.0);

  // Graph-aligned labels add the camera angle so the rect orbits with the text.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;
    // Box center uses the text half-size; the padding expands the quad below.
    labelOffset = labelRotMat * labelBoxCenter(a_positionMode, labelStart, vec2(labelW * 0.5, labelH * 0.5), textHalf);
  }

  // Rotate the rect with the label so it stays aligned with the (rotated) text.
  vec2 localPos = labelOffset + labelRotMat * (a_quadCorner * labelHalfSize);
  vec2 ndcOffset = (localPos + snapDelta) * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);
  v_id = a_id;
  v_color = a_color;
}
`);return a}var Ll=`#version 300 es
precision highp float;

in vec4 v_id;
in vec4 v_color;

out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    fragColor = v_id;
  #else
    if (v_color.a <= 0.0) discard;
    // v_color is non-premultiplied RGBA (0-1); convert to premultiplied for blending
    fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  #endif
}
`;function kl(a,n,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:dt,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=Cl(),h=(function(c){function f(){var v;q(this,f);for(var y=arguments.length,m=new Array(y),g=0;g<y;g++)m[g]=arguments[g];return v=te(this,f,[].concat(m)),S(v,"totalCount",0),S(v,"bufferCapacity",0),v}return ne(f,c),Y(f,[{key:"getDefinition",value:function(){var y=WebGL2RenderingContext,m=y.FLOAT,g=y.UNSIGNED_BYTE,p=y.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:Ll,METHOD:p,UNIFORMS:["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:m},{name:"a_id",size:4,type:g,normalized:!0},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_labelWidth",size:1,type:m},{name:"a_labelHeight",size:1,type:m},{name:"a_textHeight",size:1,type:m},{name:"a_positionMode",size:1,type:m},{name:"a_labelAngle",size:1,type:m},{name:"a_padding",size:1,type:m}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:m}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processLabelBackground",value:function(y,m){var g=this.floats,p=this.ints,b=y*this.STRIDE;g[b++]=m.nodeIndex,p[b++]=m.id,g[b++]=m.color,g[b++]=m.labelWidth,g[b++]=m.labelHeight,g[b++]=m.textHeight,g[b++]=m.positionMode,g[b++]=m.labelAngle,g[b++]=m.padding}},{key:"setUniforms",value:function(y,m){var g=m.gl,p=m.uniformLocations;g.uniformMatrix3fv(p.u_matrix,!1,y.matrix),g.uniform1f(p.u_sizeRatio,y.sizeRatio),g.uniform1f(p.u_correctionRatio,y.correctionRatio),g.uniform1f(p.u_cameraAngle,y.cameraAngle),g.uniform2f(p.u_resolution,y.width*y.pixelRatio,y.height*y.pixelRatio),g.uniform1f(p.u_pixelRatio,y.pixelRatio),g.uniform1f(p.u_labelMargin,f.labelMargin),g.uniform1f(p.u_zoomLabelSizeRatio,1/u(y.zoomRatio)),g.uniform1f(p.u_labelPixelSnapping,y.labelPixelSnapping),g.uniform1f(p.u_pickingPadding,y.labelPickingPadding),g.uniform1i(p.u_nodeDataTexture,y.nodeDataTextureUnit),g.uniform1i(p.u_nodeDataTextureWidth,y.nodeDataTextureWidth),g.uniform1i(p.u_nodeFrameTexture,y.nodeFrameTextureUnit),g.uniform1i(p.u_nodeFrameTextureWidth,y.nodeFrameTextureWidth)}},{key:"hasNothingToRender",value:function(){return this.totalCount===0}},{key:"drawWebGL",value:function(y,m){var g=m.gl;this.totalCount!==0&&g.drawArraysInstanced(g.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}},{key:"reallocate",value:function(y){this.totalCount=y,y>this.bufferCapacity&&(this.bufferCapacity=Math.max(y,Math.ceil(this.bufferCapacity*1.5)||10),se(f,"reallocate",this,3)([this.bufferCapacity]))}}])})(He);return S(h,"labelMargin",l),new h(a,n,t)}var Te={fontSize:64,buffer:8,radius:24,cutoff:.25,maxTextureSize:2048,debounceTimeout:100},Ct=2,kt=1e20;function Pl(a,n,t,e,r){var i=a+r*4,o=document.createElement("canvas");o.width=i,o.height=i;var s=o.getContext("2d",{willReadFrequently:!0});return s.font="".concat(e," ").concat(t," ").concat(a,"px ").concat(n),s.textBaseline="alphabetic",s.textAlign="left",s.fillStyle="black",{ctx:s,canvasSize:i,gridOuter:new Float64Array(i*i),gridInner:new Float64Array(i*i),f:new Float64Array(i),z:new Float64Array(i+1),v:new Uint16Array(i)}}function Fl(a,n,t,e,r){var i=a.ctx,o=a.canvasSize,s=i.measureText(n),l=s.width,u=s.actualBoundingBoxAscent,d=s.actualBoundingBoxDescent,h=s.actualBoundingBoxLeft,c=s.actualBoundingBoxRight,f=Math.ceil(u),v=Math.ceil(h),y=Math.max(0,Math.min(o-t,Math.ceil(h)+Math.ceil(c))),m=Math.min(o-t,f+Math.ceil(d)),g=y+2*t,p=m+2*t,b=Math.max(g*p,0),x=new Uint8ClampedArray(b),_={data:x,width:g,height:p,glyphWidth:y,glyphHeight:m,glyphTop:f,glyphLeft:v,glyphAdvance:l};if(y===0||m===0)return _;var T=a.gridInner,A=a.gridOuter;i.clearRect(t,t,y,m),i.fillText(n,t+v,t+f);var E=i.getImageData(t,t,y,m);A.fill(kt,0,b),T.fill(0,0,b);for(var R=0;R<m;R++)for(var L=0;L<y;L++){var k=E.data[4*(R*y+L)+3]/255;if(k!==0){var w=(R+t)*g+L+t;if(k===1)A[w]=0,T[w]=kt;else{var F=.5-k;A[w]=F>0?F*F:0,T[w]=F<0?F*F:0}}}Ir(A,0,0,g,p,g,a.f,a.v,a.z),Ir(T,t,t,y,m,g,a.f,a.v,a.z);for(var C=0;C<b;C++){var N=Math.sqrt(A[C])-Math.sqrt(T[C]);x[C]=Math.round(255-255*(N/e+r))}return _}function Ir(a,n,t,e,r,i,o,s,l){for(var u=n;u<n+e;u++)Gr(a,t*i+u,i,r,o,s,l);for(var d=t;d<t+r;d++)Gr(a,d*i+n,1,e,o,s,l)}function Gr(a,n,t,e,r,i,o){i[0]=0,o[0]=-kt,o[1]=kt,r[0]=a[n];for(var s=1,l=0,u=0;s<e;s++){r[s]=a[n+s*t];var d=s*s;do{var h=i[l];u=(r[s]-r[h]+d-h*h)/(s-h)/2}while(u<=o[l]&&--l>-1);l++,i[l]=s,o[l]=u,o[l+1]=kt}for(var c=0,f=0;c<e;c++){for(;o[f+1]<c;)f++;var v=i[f],y=c-v;a[n+c*t]=r[v]+y*y}}var Ue=(function(a){function n(){var t,e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return q(this,n),t=te(this,n),S(t,"fonts",new Map),S(t,"textures",[]),S(t,"cursor",{x:0,y:0,rowHeight:0,atlasIndex:0}),S(t,"pendingGlyphs",[]),S(t,"debounceTimer",null),t.options=W(W({},Te),e),t.canvas=document.createElement("canvas"),t.canvas.width=t.options.maxTextureSize,t.canvas.height=t.options.maxTextureSize,t.ctx=t.canvas.getContext("2d",{willReadFrequently:!0}),t.measureCanvas=document.createElement("canvas"),t.measureCtx=t.measureCanvas.getContext("2d"),t.textures.push(t.ctx.getImageData(0,0,1,1)),t}return ne(n,a),Y(n,[{key:"getFontKey",value:function(e){return"".concat(e.family,"-").concat(e.weight,"-").concat(e.style)}},{key:"registerFont",value:function(e){var r=this.getFontKey(e);if(this.fonts.has(r))return r;var i=Pl(this.options.fontSize,e.family,e.weight,e.style,this.options.buffer);return this.fonts.set(r,{descriptor:e,generator:i,glyphs:new Map}),r}},{key:"ensureGlyphs",value:function(e,r){var i=this.fonts.get(r);if(!i)throw new Error('Font "'.concat(r,'" is not registered. Call registerFont() first.'));var o=!1,s=z(e),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.codePointAt(0);d!==void 0&&(i.glyphs.has(d)||(this.pendingGlyphs.push({fontKey:r,charCode:d}),o=!0))}}catch(h){s.e(h)}finally{s.f()}o&&this.scheduleTextureGeneration()}},{key:"measureText",value:function(e,r){var i=this.fonts.get(r);if(!i)throw new Error('Font "'.concat(r,'" is not registered.'));var o=i.descriptor,s=o.family,l=o.weight,u=o.style;return this.measureCtx.font="".concat(u," ").concat(l," ").concat(this.options.fontSize,"px ").concat(s),this.measureCtx.measureText(e).width}},{key:"getGlyph",value:function(e,r){var i=this.fonts.get(r);if(i)return i.glyphs.get(e)}},{key:"getTextures",value:function(){return this.textures}},{key:"getFontCount",value:function(){return this.fonts.size}},{key:"getGlyphCount",value:function(){var e=0,r=z(this.fonts.values()),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;e+=o.glyphs.size}}catch(s){r.e(s)}finally{r.f()}return e}},{key:"hasPendingGlyphs",value:function(){return this.pendingGlyphs.length>0}},{key:"flush",value:function(){this.debounceTimer&&(clearTimeout(this.debounceTimer),this.debounceTimer=null),this.generateTextures()}},{key:"destroy",value:function(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.fonts.clear(),this.textures=[],this.pendingGlyphs=[],this.removeAllListeners()}},{key:"scheduleTextureGeneration",value:function(){var e=this;this.debounceTimer===null&&(this.options.debounceTimeout===null?this.generateTextures():this.debounceTimer=setTimeout(function(){e.debounceTimer=null,e.generateTextures()},this.options.debounceTimeout))}},{key:"generateTextures",value:function(){if(this.pendingGlyphs.length!==0){var e=this.options,r=e.maxTextureSize,i=e.buffer,o=e.radius,s=e.cutoff,l=z(this.pendingGlyphs),u;try{for(l.s();!(u=l.n()).done;){var d=u.value,h=d.fontKey,c=d.charCode,f=this.fonts.get(h);if(!(!f||f.glyphs.has(c))){var v=String.fromCodePoint(c),y=Fl(f.generator,v,i,o,s),m=y.width,g=y.height;this.cursor.x+m+Ct>r&&(this.cursor.x=0,this.cursor.y+=this.cursor.rowHeight+Ct,this.cursor.rowHeight=0),this.cursor.y+g+Ct>r&&(this.finalizeCurrentTexture(),this.cursor={x:0,y:0,rowHeight:0,atlasIndex:this.cursor.atlasIndex+1},this.ctx.clearRect(0,0,r,r));for(var p=y.data,b=new Uint8ClampedArray(m*g*4),x=0;x<p.length;x++){var _=x*4;b[_]=255,b[_+1]=255,b[_+2]=255,b[_+3]=p[x]}var T=new ImageData(b,m,g);this.ctx.putImageData(T,this.cursor.x,this.cursor.y);var A={charCode:c,width:y.glyphWidth,height:y.glyphHeight,bearingX:-y.glyphLeft-i,bearingY:y.glyphTop+i,advance:y.glyphAdvance,atlasX:this.cursor.x,atlasY:this.cursor.y,atlasWidth:m,atlasHeight:g,atlasIndex:this.cursor.atlasIndex};f.glyphs.set(c,A),this.cursor.x+=m+Ct,this.cursor.rowHeight=Math.max(this.cursor.rowHeight,g)}}}catch(E){l.e(E)}finally{l.f()}this.finalizeCurrentTexture(),this.pendingGlyphs=[],this.emit(n.ATLAS_UPDATED_EVENT,{textures:this.textures,glyphCount:this.getGlyphCount()})}}},{key:"finalizeCurrentTexture",value:function(){var e=this.options.maxTextureSize,r=this.cursor.y>0||this.cursor.rowHeight>0,i=Math.min(e,Math.max(this.cursor.x,r?e:1)),o=Math.min(e,this.cursor.y+this.cursor.rowHeight+Ct),s=this.ctx.getImageData(0,0,i,o);this.cursor.atlasIndex>=this.textures.length?this.textures.push(s):this.textures[this.cursor.atlasIndex]=s}}])})(Br.EventEmitter);S(Ue,"ATLAS_UPDATED_EVENT","atlasUpdated");var Il=Te.fontSize;function Gl(){var a=`  // -------------------------------------------------------------------------
  // Step 3: Calculate position offset from the shared edge distance
  // -------------------------------------------------------------------------
  vec2 positionOffset = vec2(0.0);

  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    float boundaryDistPixels = nodeRadiusPixels * edgeDist;
    positionOffset = screenDir * (boundaryDistPixels + margin);
  }`,n=`#version 300 es

// ============================================================================
// Attributes
// ============================================================================

// Per-character (instanced)
in float a_nodeIndex;        // Index into node data texture
in vec2 a_charOffset;        // Character offset from label origin (pixels)
in vec2 a_charSize;          // Character dimensions (pixels)
in vec4 a_texCoords;         // Atlas coords: (x, y, width, height) in pixels
in vec4 a_color;             // Text color (RGBA)
in float a_margin;           // Gap between node edge and label (pixels)
in float a_positionMode;     // Position: 0=right, 1=left, 2=above, 3=below, 4=over
in float a_labelWidth;       // Total label width (pixels)
in float a_labelHeight;      // Label height (pixels)
in float a_verticalCenter;   // Vertical center offset from baseline (pixels)
in float a_textHeight;       // Actual text height: maxAscent + maxDescent (pixels)
in float a_labelAngle;       // Label rotation angle (radians)

// Per-vertex (constant quad corners)
in vec2 a_quadCorner;        // Quad corner: [-1,-1], [1,-1], [-1,1], [1,1]

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pixelRatio;

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
out float v_fontScale;

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float ATLAS_FONT_SIZE = `.concat(ae(Il),`;

// ============================================================================
// Helper Functions
// ============================================================================

`).concat(we,`
`).concat(Oe,`
`).concat(ht,`
`).concat(jr,`

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Step 0: Fetch node data + shared edge distance from textures
  // -------------------------------------------------------------------------
  // Node-data texture format: vec4(x, y, size, shapeId)
  // 2D texture layout: texCoord = (index % width, index / width)
  int nodeIdx = int(a_nodeIndex);
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_anchorPosition = nodeData.xy;
  float a_nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; the label just reads the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  // Apply zoom-dependent label size scaling
  // Positional values are in CSS pixels; multiply by u_pixelRatio to convert to
  // physical pixels, which is what the NDC conversion (/ u_resolution) expects.
  float zoomScale = u_zoomLabelSizeRatio;
  float margin = a_margin * zoomScale * u_pixelRatio;
  vec2 charOffset = a_charOffset * zoomScale * u_pixelRatio;
  vec2 charSize = a_charSize * zoomScale * u_pixelRatio;
  float labelWidth = a_labelWidth * zoomScale * u_pixelRatio;
  float labelHeight = a_labelHeight * zoomScale;

  // Font scale: ratio of CSS label size to the base atlas font size.
  // Divided by u_pixelRatio because the atlas is generated at ATLAS_FONT_SIZE * pixelRatio,
  // which cancels out the u_pixelRatio in the fragment shader's gamma formula and keeps
  // the anti-aliasing band width consistent across pixel densities.
  v_fontScale = a_labelHeight * zoomScale / (ATLAS_FONT_SIZE * u_pixelRatio);

  // -------------------------------------------------------------------------
  // Step 1: Transform node position to clip space
  // -------------------------------------------------------------------------
  vec3 anchorClip = u_matrix * vec3(a_anchorPosition, 1.0);

  // -------------------------------------------------------------------------
  // Step 2: Convert node size to screen pixels
  // -------------------------------------------------------------------------
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = a_nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
  float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;

`).concat(a,`

  // -------------------------------------------------------------------------
  // Step 4: Calculate final vertex position
  // -------------------------------------------------------------------------
  vec2 cornerOffset = (a_quadCorner + 1.0) * 0.5;
  vec2 charPixelPos = positionOffset + charOffset + cornerOffset * charSize;

  // Apply text alignment based on position mode
  float verticalCenter = a_verticalCenter * zoomScale * u_pixelRatio;
  float textHeight = a_textHeight * zoomScale * u_pixelRatio;
  float baselineToDescent = textHeight / 2.0 - verticalCenter;
  float baselineToAscent = textHeight / 2.0 + verticalCenter;

  if (a_positionMode < 0.5) {
    // Right: vertically center
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 1.5) {
    // Left: right-align and vertically center
    charPixelPos.x -= labelWidth;
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 2.5) {
    // Above: center horizontally, bottom of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y -= baselineToDescent;
  } else if (a_positionMode < 3.5) {
    // Below: center horizontally, top of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += baselineToAscent;
  } else {
    // Over: center both
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += verticalCenter;
  }

  // Apply label angle rotation. Graph-aligned labels add the camera angle so the
  // whole label orbits the node in lockstep with the frame-pass edge distance.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);
  charPixelPos = labelRotMat * charPixelPos;

  // Snap node center to pixel grid so label/backdrop/attachment move as a unit
  vec2 nodeScreen = vec2(
    (anchorClip.x + 1.0) * u_resolution.x,
    (1.0 - anchorClip.y) * u_resolution.y
  ) * 0.5;
  charPixelPos += (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Convert to NDC (flip Y: screen Y-down -> clip Y-up)
  vec2 ndcOffset = vec2(charPixelPos.x, -charPixelPos.y) * 2.0 / u_resolution;
  gl_Position = vec4(anchorClip.xy + ndcOffset, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 5: Texture coordinates
  // -------------------------------------------------------------------------
  v_texCoord = (a_texCoords.xy + cornerOffset * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 6: Pass color
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
}
`);return n}function Nl(){var a=`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
in float v_fontScale;

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Labels are not pickable - discard all fragments in picking mode
    discard;
  #else
    // Sample SDF value from atlas (high = inside glyph, low = outside)
    float sdfValue = texture(u_atlas, v_texCoord).a;

    // Edge threshold: 1.0 - cutoff = 0.75 for default cutoff=0.25
    // This is where the glyph edge is located in the SDF
    float edgeThreshold = 1.0 - u_sdfBuffer;

    // Gamma controls the anti-aliasing band width.
    // Scale inversely with font scale so small labels get a wider AA band
    // (smoother) and large labels get a tighter band (sharper).
    float gamma = u_gamma / (u_pixelRatio * v_fontScale);

    // Pure gamma-based anti-aliasing using smoothstep
    // The AA band extends from (threshold - gamma) to (threshold + gamma)
    float alpha = smoothstep(edgeThreshold - gamma, edgeThreshold + gamma, sdfValue);

    // Premultiplied alpha output for correct blending
    float finalAlpha = v_color.a * alpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  #endif
}
`;return a}function Ml(){return["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_pixelRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_zoomLabelSizeRatio","u_labelPixelSnapping"]}function zl(){return{vertexShader:Gl(),fragmentShader:Nl(),uniforms:Ml()}}function Wl(a,n,t,e){var r,i,o=e.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:dt,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=zl(),h=(function(c){function f(v,y,m){var g,p,b,x;if(q(this,f),x=te(this,f,[v,y,m]),S(x,"atlasTexture",null),S(x,"atlasNeedsUpdate",!1),S(x,"labelGlyphCache",new Map),x.atlasFontSize=Te.fontSize*wt(),x.atlasManager=new Ue({fontSize:x.atlasFontSize}),x.gamma=.025,x.sdfBuffer=Te.cutoff,x.atlasTexture=v.createTexture(),!x.atlasTexture)throw new Error("NodeLabelProgram: failed to create atlas texture");v.bindTexture(v.TEXTURE_2D,x.atlasTexture),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_S,v.CLAMP_TO_EDGE),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_T,v.CLAMP_TO_EDGE),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MIN_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MAG_FILTER,v.LINEAR),v.bindTexture(v.TEXTURE_2D,null),x.atlasManager.on(Ue.ATLAS_UPDATED_EVENT,function(){x.atlasNeedsUpdate=!0});var _={family:((g=s.font)===null||g===void 0?void 0:g.family)||"sans-serif",weight:((p=s.font)===null||p===void 0?void 0:p.weight)||"normal",style:((b=s.font)===null||b===void 0?void 0:b.style)||"normal"};return x.defaultFontKey=x.atlasManager.registerFont(_),x}return ne(f,c),Y(f,[{key:"getDefinition",value:function(){var y=WebGL2RenderingContext,m=y.FLOAT,g=y.UNSIGNED_BYTE,p=y.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d.vertexShader,FRAGMENT_SHADER_SOURCE:d.fragmentShader,METHOD:p,UNIFORMS:d.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:m},{name:"a_charOffset",size:2,type:m},{name:"a_charSize",size:2,type:m},{name:"a_texCoords",size:4,type:m},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_margin",size:1,type:m},{name:"a_positionMode",size:1,type:m},{name:"a_labelWidth",size:1,type:m},{name:"a_labelHeight",size:1,type:m},{name:"a_verticalCenter",size:1,type:m},{name:"a_textHeight",size:1,type:m},{name:"a_labelAngle",size:1,type:m}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:m}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"prepareLabelGlyphs",value:function(y,m){if(m.hidden||!m.text){this.labelGlyphCache.delete(y);return}var g=m.text,p=m.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(g,p);var b=[],x=[],_=0,T=0,A=0,E=z(g),R;try{for(E.s();!(R=E.n()).done;){var L=R.value,k=L.codePointAt(0);if(k===void 0){b.push(void 0),x.push(_);continue}var w=this.atlasManager.getGlyph(k,p);b.push(w),x.push(_),w&&(_+=w.advance,T=Math.max(T,w.bearingY),A=Math.max(A,w.atlasHeight-w.bearingY))}}catch(F){E.e(F)}finally{E.f()}this.labelGlyphCache.set(y,{glyphs:b,xOffsets:x,totalWidth:_,totalHeight:T+A,verticalCenterOffset:(T-A)/2})}},{key:"processCharacter",value:function(y,m,g,p){var b=this.floats,x=this.STRIDE,_=y*x,T=this.labelGlyphCache.get(m.parentKey);if(!T||!T.glyphs[p]){for(var A=0;A<x;A++)b[_+A]=0;return}var E=T.glyphs[p],R=T.xOffsets[p],L=m.size/this.atlasFontSize,k=pe(m.color),w=_;b[w++]=m.nodeIndex,b[w++]=(R+E.bearingX)*L,b[w++]=-E.bearingY*L,b[w++]=E.atlasWidth*L,b[w++]=E.atlasHeight*L,b[w++]=E.atlasX,b[w++]=E.atlasY,b[w++]=E.atlasWidth,b[w++]=E.atlasHeight,b[w++]=k,b[w++]=m.margin,b[w++]=ut[m.position],b[w++]=T.totalWidth*L,b[w++]=m.size,b[w++]=T.verticalCenterOffset*L,b[w++]=T.totalHeight*L,b[w++]=m.labelAngle}},{key:"processLabel",value:function(y,m,g){return this.prepareLabelGlyphs(y,g),se(f,"processLabel",this,3)([y,m,g])}},{key:"updateAtlasTexture",value:function(){if(this.atlasNeedsUpdate){var y=this.normalProgram.gl,m=this.atlasManager.getTextures();if(m.length!==0){var g=m[0];y.bindTexture(y.TEXTURE_2D,this.atlasTexture),y.texImage2D(y.TEXTURE_2D,0,y.RGBA,g.width,g.height,0,y.RGBA,y.UNSIGNED_BYTE,g.data),y.bindTexture(y.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}}}},{key:"setUniforms",value:function(y,m){var g=m.gl,p=m.uniformLocations;g.uniformMatrix3fv(p.u_matrix,!1,y.matrix),g.uniform1f(p.u_sizeRatio,y.sizeRatio),g.uniform1f(p.u_correctionRatio,y.correctionRatio),g.uniform1f(p.u_cameraAngle,y.cameraAngle),g.uniform2f(p.u_resolution,y.width*y.pixelRatio,y.height*y.pixelRatio);var b=this.atlasManager.getTextures();b.length>0?g.uniform2f(p.u_atlasSize,b[0].width,b[0].height):g.uniform2f(p.u_atlasSize,1,1),g.activeTexture(g.TEXTURE0),g.bindTexture(g.TEXTURE_2D,this.atlasTexture),g.uniform1i(p.u_atlas,0),p.u_nodeDataTexture!==void 0&&g.uniform1i(p.u_nodeDataTexture,y.nodeDataTextureUnit),p.u_nodeDataTextureWidth!==void 0&&g.uniform1i(p.u_nodeDataTextureWidth,y.nodeDataTextureWidth),g.uniform1i(p.u_nodeFrameTexture,y.nodeFrameTextureUnit),g.uniform1i(p.u_nodeFrameTextureWidth,y.nodeFrameTextureWidth),g.uniform1f(p.u_gamma,this.gamma),g.uniform1f(p.u_sdfBuffer,this.sdfBuffer),g.uniform1f(p.u_pixelRatio,y.pixelRatio),g.uniform1f(p.u_zoomLabelSizeRatio,1/f.zoomToLabelSizeRatioFunction(y.zoomRatio)),g.uniform1f(p.u_labelPixelSnapping,y.labelPixelSnapping)}},{key:"renderProgram",value:function(y,m){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),se(f,"renderProgram",this,3)([y,m])}},{key:"registerFont",value:function(y){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"normal",g=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"normal";return this.atlasManager.registerFont({family:y,weight:m,style:g})}},{key:"getAtlasManager",value:function(){return this.atlasManager}},{key:"measureLabel",value:function(y,m,g){var p=g||this.defaultFontKey;this.atlasManager.ensureGlyphs(y,p),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();var b=0,x=0,_=0,T=z(y),A;try{for(T.s();!(A=T.n()).done;){var E=A.value,R=E.codePointAt(0);if(R!==void 0){var L=this.atlasManager.getGlyph(R,p);L&&(b+=L.advance,x=Math.max(x,L.bearingY),_=Math.max(_,L.atlasHeight-L.bearingY))}}}catch(w){T.e(w)}finally{T.f()}var k=m/this.atlasFontSize;return{width:b*k,height:m,textHeight:(x+_)*k}}},{key:"ensureGlyphsReady",value:function(y,m){var g=m||this.defaultFontKey,p=z(y),b;try{for(p.s();!(b=p.n()).done;){var x=b.value;this.atlasManager.ensureGlyphs(x,g)}}catch(_){p.e(_)}finally{p.f()}this.atlasManager.flush()}},{key:"kill",value:function(){var y=this.normalProgram.gl;this.atlasTexture&&(y.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),se(f,"kill",this,3)([])}}])})(Zr);return S(h,"labelMargin",l),S(h,"zoomToLabelSizeRatioFunction",u),new h(a,n,t)}var Bl=`#version 300 es
precision highp float;

in float v_edgeDist;

// R32F target: only the .r channel is stored.
out vec4 fragColor;

void main() {
  fragColor = vec4(v_edgeDist, 0.0, 0.0, 0.0);
}
`;function Ul(a,n,t){var e=da(a),r=It(a).map(function(v){return"uniform ".concat(v.type," ").concat(v.name,";")}).join(`
`),i=hl(a,t),o=i.code,s=i.multiShape,l=ct(a,n),u=Object.keys(l.specs).map(function(v){return"float v_".concat(v,";")}).join(`
`),d=lt(l,{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),h=d.fetchCode,c=d.varyingAssignments,f=`#version 300 es
precision highp float;

uniform float u_cameraAngle;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;
`.concat(r,`

in float a_nodeIndex;     // node-data texture index (also the target frame texel)
in float a_positionMode;  // 0=right 1=left 2=above 3=below 4=over
in float a_labelAngle;    // intrinsic label angle (radians)

out float v_edgeDist;

// Shape attributes (plain globals: this pass is vertex-only)
`).concat(u,`

`).concat(we,`
`).concat(Oe,`
`).concat(e,`
`).concat(o,`
`).concat(jr,`

void main() {
  int nodeIdx = int(a_nodeIndex);
`).concat(h,`
`).concat(c,`
  `).concat(s?`// Multi-shape: the shape id lives in the node-data texture's .w channel:
  g_shapeId = int(readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).w);`:"// Single-shape mode, shape id not needed",`

  // Per-node rotation alignment (0 = viewport, 1 = graph).
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;

  // Effective angle: intrinsic (style-given) plus the camera angle when the label
  // is graph-aligned. The companions place the box at this same angle.
  float effectiveAngle = a_labelAngle - labelRotation * u_cameraAngle;

  // The "over" mode (4) sits on the node center, so it has no edge distance.
  float edgeDist = 0.0;
  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    // Rotate by the effective label angle. Inlined rather than via rotate2D()
    // because the shape SDFs (getShapeGLSLForShapes) already define that helper
    // for multi-shape programs, and redefining it would be a GLSL error.
    float ea_c = cos(effectiveAngle);
    float ea_s = sin(effectiveAngle);
    vec2 rotatedScreenDir = mat2(ea_c, -ea_s, ea_s, ea_c) * screenDir;
    // Screen (Y-down) -> SDF (Y-up).
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);
    // Counter-rotate into the shape's local frame for graph-aligned nodes, so the
    // boundary is queried against the shape's actual on-screen orientation.
    float nodeCa = -u_cameraAngle * nodeRotation;
    float nc = cos(nodeCa), ns = sin(nodeCa);
    sdfDir = mat2(nc, -ns, ns, nc) * sdfDir;
    edgeDist = findEdgeDistance(sdfDir, 1.0);
  }
  v_edgeDist = edgeDist;

  // Scatter to this node's texel center in the frame texture.
  float x = mod(a_nodeIndex, u_frameTextureWidth);
  float y = floor(a_nodeIndex / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`);return f}var Qr=(function(){function a(n,t){q(this,a),S(this,"uniformLocations",{});var e=t.shapes,r=t.layers,i=t.shapeGlobalIds;if(e.length===0)throw new Error("NodeLabelFramePass: at least one shape must be provided");this.gl=n,this.shapeUniforms=It(e),this.hasAttributeData=Object.keys(ct(e,r).offsets).length>0,this.vertexShader=sa(n,Ul(e,r,i)),this.fragmentShader=la(n,Bl),this.program=ua(n,[this.vertexShader,this.fragmentShader]);var o=["u_cameraAngle","u_nodeDataTexture","u_nodeDataTextureWidth","u_frameTextureWidth","u_frameTextureHeight","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"].concat(V(this.shapeUniforms.map(function(g){return g.name}))),s=z(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;this.uniformLocations[u]=n.getUniformLocation(this.program,u)}}catch(g){s.e(g)}finally{s.f()}var d=a.FLOATS_PER_POINT*4;this.vao=n.createVertexArray(),this.buffer=n.createBuffer(),n.bindVertexArray(this.vao),n.bindBuffer(n.ARRAY_BUFFER,this.buffer);var h=z([["a_nodeIndex",0],["a_positionMode",4],["a_labelAngle",8]]),c;try{for(h.s();!(c=h.n()).done;){var f=Q(c.value,2),v=f[0],y=f[1],m=n.getAttribLocation(this.program,v);m>=0&&(n.enableVertexAttribArray(m),n.vertexAttribPointer(m,1,n.FLOAT,!1,d,y))}}catch(g){h.e(g)}finally{h.f()}n.bindVertexArray(null)}return Y(a,[{key:"run",value:function(t,e,r,i,o){if(e!==0){var s=this.gl;s.useProgram(this.program),s.bindVertexArray(this.vao),s.bindBuffer(s.ARRAY_BUFFER,this.buffer),s.bufferData(s.ARRAY_BUFFER,t.subarray(0,e*a.FLOATS_PER_POINT),s.DYNAMIC_DRAW);var l=this.uniformLocations;s.uniform1f(l.u_cameraAngle,i.cameraAngle),s.uniform1i(l.u_nodeDataTexture,i.nodeDataTextureUnit),s.uniform1i(l.u_nodeDataTextureWidth,i.nodeDataTextureWidth),s.uniform1f(l.u_frameTextureWidth,r.getTextureWidth()),s.uniform1f(l.u_frameTextureHeight,r.getTextureHeight()),this.hasAttributeData&&o&&(o.bind(Fe),l.u_layerAttributeTexture&&s.uniform1i(l.u_layerAttributeTexture,Fe),l.u_layerAttributeTextureWidth&&s.uniform1i(l.u_layerAttributeTextureWidth,o.getTextureWidth()),l.u_layerAttributeTexelsPerNode&&s.uniform1i(l.u_layerAttributeTexelsPerNode,o.getTexelsPerItem()));var u=z(this.shapeUniforms),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;fa(s,this.uniformLocations[h.name],h)}}catch(c){u.e(c)}finally{u.f()}r.bindAsRenderTarget(),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.drawArrays(s.POINTS,0,e),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindVertexArray(null)}}},{key:"kill",value:function(){var t=this.gl;t.deleteProgram(this.program),t.deleteShader(this.vertexShader),t.deleteShader(this.fragmentShader),t.deleteBuffer(this.buffer),t.deleteVertexArray(this.vao)}}])})();S(Qr,"FLOATS_PER_POINT",3);function Jr(a,n,t,e,r){var i,o=e.label,s=o===void 0?{}:o,l=e.shapes;if(l.length===0)throw new Error("createNodeProgram: at least one shape must be provided in 'shapes'");var u={},d=[],h;l.forEach(function(A,E){var R=tl(A);E===0&&(h=R),u[A.name]=E,d[E]=Ft(R)});var c=V(e.layers),f=Fr({shapes:l,layers:c,shapeGlobalIds:l.length>1?d:void 0,antialias:r}),v=Wl(a,null,t,{label:s}),y=wl(a,null,t,{shapes:l,layers:c,getAttributeTexture:function(){return T.getAttributeTexture()},label:s,shapeGlobalIds:l.length>1?d:void 0}),m=kl(a,n,t,{label:s}),g=e.labelAttachments&&Object.keys(e.labelAttachments).length>0?bl(a,null,t,{label:s}):null,p=new Qr(a,{shapes:l,layers:c,shapeGlobalIds:l.length>1?d:void 0}),b=Rn(l,c),x=ye(b),_=(i=(function(A){function E(R,L,k){var w;q(this,E),w=te(this,E,[R,L,k]),S(w,"layerLifecycles",new Map),S(w,"layersNeedingRegeneration",new Set),S(w,"attrDescriptors",[]),w._pickingBuffer=L;var F=_.layerTextures.get(R);F||(F=new En(R,x),_.layerTextures.set(R,F)),w.layerAttributeTexture=F;var C=_.textureRefCounts.get(R)||0;_.textureRefCounts.set(R,C+1),w.packedAttributeData=new Float32Array(x.floatsPerItem),c.forEach(function(G,M){if(G.lifecycle){var P={gl:R,renderer:{refresh:function(){return k.refresh()}},getUniformLocation:function(H){return R.getUniformLocation(w.normalProgram.program,H)},requestShaderRegeneration:function(){w.layersNeedingRegeneration.add(M)},requestRefresh:function(){k.refresh()}},D=G.lifecycle(P);w.layerLifecycles.set(M,D)}}),w.layerLifecycles.forEach(function(G){var M;(M=G.init)===null||M===void 0||M.call(G)});var N=new Map;return w.layerLifecycles.forEach(function(G,M){G.getAttributeData&&N.set(M,G)}),w.attrDescriptors=An(b,x,N),w}return ne(E,A),Y(E,[{key:"getDefinition",value:function(){var L=WebGL2RenderingContext,k=L.FLOAT,w=L.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:f.vertexShader,FRAGMENT_SHADER_SOURCE:f.fragmentShader,METHOD:w,UNIFORMS:f.uniforms,ATTRIBUTES:f.attributes,CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:k}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"maybeRegenerateShaders",value:function(){var L=this;if(this.layersNeedingRegeneration.size!==0){c=c.map(function(M,P){if(L.layersNeedingRegeneration.has(P)){var D=L.layerLifecycles.get(P);if(D!=null&&D.regenerate){var I=D.regenerate();return W(W({},I),{},{lifecycle:M.lifecycle})}}return M}),this.layersNeedingRegeneration.clear(),f=Fr({shapes:l,layers:c,shapeGlobalIds:l.length>1?d:void 0,antialias:this.renderer.getSetting("antialiasNodes")});var k=this.normalProgram.gl,w=this.normalProgram,F=w.program,C=w.buffer,N=w.vertexShader,G=w.fragmentShader;k.deleteProgram(F),k.deleteBuffer(C),k.deleteShader(N),k.deleteShader(G),this.normalProgram=this.getProgramInfo("normal",k,f.vertexShader,f.fragmentShader,this._pickingBuffer)}}},{key:"allocateNode",value:function(L){this.layerAttributeTexture.allocate(L)}},{key:"freeNode",value:function(L){this.layerAttributeTexture.free(L)}},{key:"getAttributeTexture",value:function(){return this.layerAttributeTexture}},{key:"uploadLayerTexture",value:function(){this.layerAttributeTexture.upload()}},{key:"process",value:function(L,k,w,F,C){var N=k*this.STRIDE;if(w.visibility==="hidden"){for(var G=N+this.STRIDE;N<G;N++)this.floats[N]=0;this.floats[k*this.STRIDE]=qr;return}this.processVisibleItem(at(L),N,w,F,C)}},{key:"processVisibleItem",value:function(L,k,w,F,C){var N,G=this.floats,M=this.ints;if(G[k++]=F,M[k++]=L,G[k++]=(N=w.opacity)!==null&&N!==void 0?N:1,x.floatsPerItem!==0){var P=this.packedAttributeData;Dn(this.attrDescriptors,w,P,w.color,this.layerLifecycles,0),this.layerAttributeTexture.updateAllAttributes(C,P)}}},{key:"setUniforms",value:function(L,k){var w=this,F=k.gl,C=k.uniformLocations;C.u_matrix&&F.uniformMatrix3fv(C.u_matrix,!1,L.matrix),C.u_sizeRatio&&F.uniform1f(C.u_sizeRatio,L.sizeRatio),C.u_correctionRatio&&F.uniform1f(C.u_correctionRatio,L.correctionRatio),C.u_pickingPadding&&F.uniform1f(C.u_pickingPadding,L.nodePickingPadding),C.u_cameraAngle&&F.uniform1f(C.u_cameraAngle,L.cameraAngle),C.u_nodeDataTexture&&F.uniform1i(C.u_nodeDataTexture,L.nodeDataTextureUnit),C.u_nodeDataTextureWidth&&F.uniform1i(C.u_nodeDataTextureWidth,L.nodeDataTextureWidth),C.u_layerAttributeTexture&&(this.layerAttributeTexture.bind(Fe),F.uniform1i(C.u_layerAttributeTexture,Fe)),C.u_layerAttributeTextureWidth&&F.uniform1i(C.u_layerAttributeTextureWidth,this.layerAttributeTexture.getTextureWidth()),C.u_layerAttributeTexelsPerNode&&F.uniform1i(C.u_layerAttributeTexelsPerNode,this.layerAttributeTexture.getTexelsPerItem()),l.forEach(function(N){N.uniforms.forEach(function(G){w.setTypedUniform(G,k)})}),c.forEach(function(N){N.uniforms.forEach(function(G){w.setTypedUniform(G,k)})})}},{key:"renderProgram",value:function(L,k){this.maybeRegenerateShaders();var w=k.gl,F=k.program;w.useProgram(F),k===this.normalProgram&&this.layerLifecycles.forEach(function(C){var N;(N=C.beforeRender)===null||N===void 0||N.call(C)}),se(E,"renderProgram",this,3)([L,k])}},{key:"kill",value:function(){this.layerLifecycles.forEach(function(w){var F;(F=w.kill)===null||F===void 0||F.call(w)}),this.layerLifecycles.clear();var L=this.normalProgram.gl,k=(_.textureRefCounts.get(L)||1)-1;k<=0?(this.layerAttributeTexture.kill(),_.layerTextures.delete(L),_.textureRefCounts.delete(L)):_.textureRefCounts.set(L,k),se(E,"kill",this,3)([])}}])})(He),S(i,"layerTextures",new WeakMap),S(i,"textureRefCounts",new WeakMap),i),T=new _(a,null,t);return{nodeProgram:T,labelProgram:v,backdropProgram:y,labelBackgroundProgram:m,attachmentProgram:g,framePass:p,shapeSlug:h,shapeNameToIndex:l.length>1?u:void 0,shapeGlobalIds:l.length>1?d:void 0}}var Ie=6;function Nt(a){var n=a.offsets,t=a.specs,e=a.floatsPerItem,r=Object.keys(n);if(r.length===0||e===0)return{uniformDeclarations:"",uniformNames:[],vertexVaryingDeclarations:"",fragmentVaryingDeclarations:"",fetchCode:"",varyingAssignments:""};var i=`
uniform sampler2D u_edgeAttributeTexture;
uniform int u_edgeAttributeTextureWidth;
uniform int u_edgeAttributeTexelsPerEdge;`,o=["u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"],s=r.map(function(f){var v=t[f].size===1?"float":"vec".concat(t[f].size);return"".concat(v," v_").concat(f,";")}),l=s.map(function(f){return"out ".concat(f)}).join(`
`),u=s.map(function(f){return"in ".concat(f)}).join(`
`),d=lt(a,{varPrefix:"attr",baseTexelExpr:"edgeIdx * u_edgeAttributeTexelsPerEdge",textureWidthUniform:"u_edgeAttributeTextureWidth",textureSamplerUniform:"u_edgeAttributeTexture"}),h=d.fetchCode,c=d.varyingAssignments;return{uniformDeclarations:i,uniformNames:o,vertexVaryingDeclarations:l,fragmentVaryingDeclarations:u,fetchCode:h,varyingAssignments:c}}function Ol(a){return`
float findSourceClampT_`.concat(a,`(vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  float lo = 0.0, hi = 0.5;
  float nodeExtent = sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // Counter-rotate the query point so viewport-aligned nodes (rotateAlign=0) are
  // clamped against their on-screen orientation; graph-aligned nodes skip it.
  float ca = u_cameraAngle * (1.0 - sourceRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_`).concat(a,`_position(mid, source, target);
    vec2 localPos = rot * ((pos - source) / nodeExtent);
    float sdf = querySDF(sourceShapeId, localPos, effectiveSize);
    if (sdf < 0.0) lo = mid;
    else hi = mid;
  }

  float pathLen = path_`).concat(a,`_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 + marginT;
}
`)}function Hl(a){return`
float findTargetClampT_`.concat(a,`(vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  float lo = 0.5, hi = 1.0;
  float nodeExtent = targetSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // See findSourceClampT_ for the rotation rationale.
  float ca = u_cameraAngle * (1.0 - targetRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_`).concat(a,`_position(mid, source, target);
    vec2 localPos = rot * ((pos - target) / nodeExtent);
    float sdf = querySDF(targetShapeId, localPos, effectiveSize);
    if (sdf < 0.0) hi = mid;
    else lo = mid;
  }

  float pathLen = path_`).concat(a,`_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 - marginT;
}
`)}function ei(a){return`
// Auto-generated numerical tangent (from position via finite differences)
vec2 path_`.concat(a,`_tangent(float t, vec2 source, vec2 target) {
  float epsilon = 0.001;
  float t1 = max(0.0, t - epsilon);
  float t2 = min(1.0, t + epsilon);
  vec2 p1 = path_`).concat(a,`_position(t1, source, target);
  vec2 p2 = path_`).concat(a,`_position(t2, source, target);
  return normalize(p2 - p1);
}

// Auto-generated normal (perpendicular to tangent)
vec2 path_`).concat(a,`_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_`).concat(a,`_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`)}function $l(a){return`
// Auto-generated path length (samples position 16 times)
float path_`.concat(a,`_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_`).concat(a,`_position(0.0, source, target);
  for (int i = 1; i <= 16; i++) {
    float t = float(i) / 16.0;
    vec2 curr = path_`).concat(a,`_position(t, source, target);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}
`)}function Vl(a){return`
// Auto-generated closest_t (coarse sample + ternary search)
float path_`.concat(a,`_closest_t(vec2 p, vec2 source, vec2 target) {
  // Coarse search: find best among 10 samples
  float bestT = 0.0;
  float bestDist = 1e10;
  for (int i = 0; i <= 10; i++) {
    float t = float(i) / 10.0;
    vec2 pos = path_`).concat(a,`_position(t, source, target);
    float d = length(p - pos);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
    }
  }

  // Refine with ternary search
  float lo = max(0.0, bestT - 0.1);
  float hi = min(1.0, bestT + 0.1);
  for (int i = 0; i < 10; i++) {
    float mid1 = lo + (hi - lo) / 3.0;
    float mid2 = hi - (hi - lo) / 3.0;
    float d1 = length(p - path_`).concat(a,`_position(mid1, source, target));
    float d2 = length(p - path_`).concat(a,`_position(mid2, source, target));
    if (d1 < d2) {
      hi = mid2;
    } else {
      lo = mid1;
    }
  }
  return (lo + hi) * 0.5;
}
`)}function jl(a){return`
// Auto-generated signed distance (via closest_t + normal)
float path_`.concat(a,`_distance(vec2 p, vec2 source, vec2 target) {
  float closestT = path_`).concat(a,`_closest_t(p, source, target);
  vec2 closest = path_`).concat(a,`_position(closestT, source, target);
  vec2 diff = p - closest;
  float dist = length(diff);
  if (dist < 0.0001) return 0.0;

  // Get normal at closest point
  vec2 normal = path_`).concat(a,`_normal(closestT, source, target);
  return dist * sign(dot(diff, normal));
}
`)}function Xl(a){return`
// Auto-generated t_at_distance (binary search)
float path_`.concat(a,`_t_at_distance(float targetDist, vec2 source, vec2 target) {
  if (targetDist <= 0.0) return 0.0;

  float totalLen = path_`).concat(a,`_length(source, target);
  if (targetDist >= totalLen) return 1.0;

  // Binary search for t
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;

    // Compute arc length from 0 to mid
    float arcLen = 0.0;
    vec2 prev = path_`).concat(a,`_position(0.0, source, target);
    for (int j = 1; j <= 8; j++) {
      float t = mid * float(j) / 8.0;
      vec2 curr = path_`).concat(a,`_position(t, source, target);
      arcLen += length(curr - prev);
      prev = curr;
    }

    if (arcLen < targetDist) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}
`)}function yn(a,n){var t=new RegExp("\\b(float|vec[234]|void|int|bool)\\s+".concat(n,"\\s*\\("));return t.test(a)}function ti(a,n){var t=[];return yn(n,"path_".concat(a,"_length"))||t.push($l(a)),yn(n,"path_".concat(a,"_closest_t"))||t.push(Vl(a)),yn(n,"path_".concat(a,"_distance"))||t.push(jl(a)),yn(n,"path_".concat(a,"_t_at_distance"))||t.push(Xl(a)),t.length>0?`
// ============================================================================
// Auto-generated fallback functions (path only provided position)
// ============================================================================
`.concat(t.join(`
`)):""}function ni(a){var n,t,e,r=a.paths,i=a.layers,o=(n=a.extremities)!==null&&n!==void 0?n:[];if(r.length===0)throw new Error("At least one path is required in 'paths'");if(i.length===0)throw new Error("At least one layer is required in 'layers'");var s=(t=a.defaultHead)!==null&&t!==void 0?t:"none",l=(e=a.defaultTail)!==null&&e!==void 0?e:"none";return{paths:r,extremities:o,layers:i,path:r[0],layer:i[0],defaultHead:s,defaultTail:l}}var ai=WebGL2RenderingContext,Pt=ai.FLOAT,Nr=ai.UNSIGNED_BYTE;function ql(a,n,t){var e=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"]),r=new Set(e);return a.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),n.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),t.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),Array.from(r)}function ga(a){var n=new Set,t=[],e=z(a),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;n.has(i.name)||(n.add(i.name),t.push("// Path: ".concat(i.name)),t.push(i.glsl),t.push(ei(i.name)),t.push(ti(i.name,i.glsl)))}}catch(o){e.e(o)}finally{e.f()}return t.join(`

`)}function Yl(a){var n=[],t=z(a),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;n.push("// Extremity: ".concat(r.name)),n.push(r.glsl)}}catch(i){t.e(i)}finally{t.f()}return n.join(`

`)}var Kl=[{queryName:"queryPathPosition",pathFunc:"position",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathTangent",pathFunc:"tangent",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathNormal",pathFunc:"normal",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathLength",pathFunc:"length",returnType:"float",params:"vec2 source, vec2 target",args:"source, target"},{queryName:"queryPathClosestT",pathFunc:"closest_t",returnType:"float",params:"vec2 p, vec2 source, vec2 target",args:"p, source, target"}];function Zl(a,n){var t=n.queryName,e=n.pathFunc,r=n.returnType,i=n.params,o=n.args;if(a.length===1)return"".concat(r," ").concat(t,"(int pathId, ").concat(i,`) {
  return path_`).concat(a[0].name,"_").concat(e,"(").concat(o,`);
}`);var s=a.map(function(l,u){return"    case ".concat(u,": return path_").concat(l.name,"_").concat(e,"(").concat(o,");")}).join(`
`);return"".concat(r," ").concat(t,"(int pathId, ").concat(i,`) {
  switch (pathId) {
`).concat(s,`
    default: return path_`).concat(a[0].name,"_").concat(e,"(").concat(o,`);
  }
}`)}function va(a){return Kl.map(function(n){return Zl(a,n)}).join(`

`)}function Ql(a){if(a.length===1)return`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  return extremity_`.concat(a[0].name,`(uv, lengthRatio, widthRatio);
}`);var n=a.map(function(t,e){return"    case ".concat(e,": return extremity_").concat(t.name,"(uv, lengthRatio, widthRatio);")}).join(`
`);return`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  switch (extremityId) {
`.concat(n,`
    default: return extremity_`).concat(a[0].name,`(uv, lengthRatio, widthRatio);
  }
}`)}function Jl(a){var n=[],t=z(a),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;n.push(Ol(r.name)),n.push(Hl(r.name))}}catch(s){t.e(s)}finally{t.f()}if(a.length===1)n.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_`.concat(a[0].name,`(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_`).concat(a[0].name,`(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`));else{var i=a.map(function(s,l){return"    case ".concat(l,": return findSourceClampT_").concat(s.name,"(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);")}).join(`
`),o=a.map(function(s,l){return"    case ".concat(l,": return findTargetClampT_").concat(s.name,"(source, target, targetSize, targetShapeId, targetRotateAlign, margin);")}).join(`
`);n.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
`.concat(i,`
    default: return findSourceClampT_`).concat(a[0].name,`(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
`).concat(o,`
    default: return findTargetClampT_`).concat(a[0].name,`(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`))}return n.join(`

`)}function eu(a,n,t,e,r){var i=ye([].concat(V(a),V(t))),o=Nt(i),s=ct(e,r),l=Object.keys(s.offsets),u=function(A){var E=s.specs[A].size;return E===1?"float":"vec".concat(E)},d=l.map(function(T){return"".concat(u(T)," v_source_").concat(T,`;
`).concat(u(T)," v_target_").concat(T,";")}).join(`
`),h=lt(s,{varPrefix:"srcNodeAttr",baseTexelExpr:"srcIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_source_"}),c=lt(s,{varPrefix:"tgtNodeAttr",baseTexelExpr:"tgtIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_target_"}),f=l.map(function(T){return"".concat(u(T)," g_").concat(T,";")}).join(`
`),v=l.map(function(T){return"  g_".concat(T," = v_source_").concat(T,";")}).join(`
`),y=l.map(function(T){return"  g_".concat(T," = v_target_").concat(T,";")}).join(`
`),m=new Set,g=[],p=function(A){m.has(A.name)||(m.add(A.name),g.push("uniform ".concat(A.type," ").concat(A.name,";")))};a.forEach(function(T){return T.uniforms.forEach(p)}),n.forEach(function(T){return T.uniforms.forEach(p)});var b=n.map(function(T){return ae(T.widthFactor)}).join(", "),x=Math.max.apply(Math,V(a.map(function(T){return T.minBodyLengthRatio||0}))),_=`#version 300 es

// Node and edge data textures
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;

// Edge attribute texture (for path-specific attributes like curvature)
`.concat(o.uniformDeclarations,`

// Node attribute texture (for node shape attributes)
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

// Render params needed for clamping
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;

// Edge-frame texture dimensions, for scattering each point to its texel
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;

// Custom path/extremity uniforms
`).concat(g.join(`
`),`

// Path attribute varyings \u2014 assigned so path functions can read them as globals
`).concat(o.vertexVaryingDeclarations,`

// Node size varyings \u2014 read by path functions like loop
out float v_sourceNodeSize;
out float v_targetNodeSize;

// Node shape attributes per endpoint, and the ones querySDF reads
`).concat(d,`
`).concat(f,`

// Scattered output written to the edge-frame texel: [tStart, tEnd, straightenFactor, pathLength]
out vec4 v_clamp;

// Extremity width factor array (needed for extremityScale computation)
const float EXTREMITY_WIDTH_FACTORS[`).concat(n.length,"] = float[](").concat(b,`);

// Node-data fetch helpers (geometry texel + rotation-flags texel)
`).concat(we,`
`).concat(Oe,`

// Shape SDFs for node boundary clamping
`).concat(nl(),`
`).concat(al(new Set(l)),`

// Path functions
`).concat(ga(a),`
`).concat(va(a),`
`).concat(Jl(a),`

void main() {
  // One point per edge-data row; the row index is the edge-frame texel target.
  int edgeIdx = gl_VertexID;
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes and assign to path-function globals
`).concat(o.fetchCode,`
`).concat(o.varyingAssignments,`

  // Fetch node shape attributes for both endpoints
`).concat(h.fetchCode,`
`).concat(h.varyingAssignments,`
`).concat(c.fetchCode,`
`).concat(c.varyingAssignments,`

  // Fetch node geometry (texel 0) and rotation flags (texel 1).
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;
  float a_sourceShapeId = srcNodeData.w;
  float a_targetShapeId = tgtNodeData.w;
  // Per-node rotation alignment (0 = viewport, 1 = graph), for boundary clamping.
  float a_sourceRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx).r;
  float a_targetRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx).r;

  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = `).concat(ae(x),`;

  // Thickness in WebGL units (needed to compute clamping margin and extremity lengths)
  float pixelsThickness = max(a_thickness, u_minEdgeThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // SDF clamping: find where the edge body meets the node boundaries. Always
  // searched (ungated) so labels get a true boundary clamp; the body re-applies
  // its extremity gating in-shader.
`).concat(v,`
  float tStart = queryFindSourceClampT(pathId, a_source, a_sourceSize, int(a_sourceShapeId), a_sourceRotateAlign, a_target, 0.0);
`).concat(y,`
  float tEnd = queryFindTargetClampT(pathId, a_source, a_target, a_targetSize, int(a_targetShapeId), a_targetRotateAlign, 0.0);

  // straightenFactor (frame .z) is consumed only by the body, which runs to the
  // node center when an extremity is absent. Derive the straightening math from
  // these gated clamps \u2014 not the ungated boundary ones above \u2014 so it matches the
  // geometry it drives. The ungated tStart/tEnd remain what labels read.
  float bodyTStart = tailLengthRatio > 0.0 ? tStart : 0.0;
  float bodyTEnd = headLengthRatio > 0.0 ? tEnd : 1.0;

  // Path length and zone boundaries (needed for straightening check)
  float pathLength = queryPathLength(pathId, a_source, a_target);
  float visibleLength = pathLength * (bodyTEnd - bodyTStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  float tTailEnd = bodyTStart + tailLengthT;
  float tHeadStart = bodyTEnd - headLengthT;
  if (tTailEnd > tHeadStart) {
    float mid = (bodyTStart + bodyTEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Straighten factor: blend toward straight line when path twists in extremity zones
  float straightenFactor = 0.0;
  {
    float maxDeviation = 0.0;
    if (tailLengthT > 0.0001) {
      vec2 tailTang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
      vec2 tailChord = queryPathPosition(pathId, bodyTStart, a_source, a_target)
                     - queryPathPosition(pathId, tTailEnd, a_source, a_target);
      float tailChordLen = length(tailChord);
      if (tailChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(-tailTang, tailChord / tailChordLen));
      }
    }
    if (headLengthT > 0.0001) {
      vec2 headTang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
      vec2 headChord = queryPathPosition(pathId, bodyTEnd, a_source, a_target)
                     - queryPathPosition(pathId, tHeadStart, a_source, a_target);
      float headChordLen = length(headChord);
      if (headChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(headTang, headChord / headChordLen));
      }
    }
    straightenFactor = smoothstep(0.035, 0.5, maxDeviation);
  }

  // When straightening, blend the ungated tStart/tEnd (the label-facing clamps)
  // toward straight-line clamp positions.
  if (straightenFactor > 0.001) {
    if (tailLengthRatio > 0.0) {
`).concat(v,`
      float srcExtent = a_sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
      float srcEffective = 1.0 - u_correctionRatio / srcExtent;
      float srcCa = u_cameraAngle * (1.0 - a_sourceRotateAlign);
      mat2 srcRot = mat2(cos(srcCa), -sin(srcCa), sin(srcCa), cos(srcCa));
      float lo = 0.0, hi = 0.5;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = srcRot * ((pos - a_source) / srcExtent);
        float sdf = querySDF(int(a_sourceShapeId), localPos, srcEffective);
        if (sdf < 0.0) lo = mid; else hi = mid;
      }
      tStart = mix(tStart, (lo + hi) * 0.5, straightenFactor);
    }
    if (headLengthRatio > 0.0) {
`).concat(y,`
      float tgtExtent = a_targetSize * u_correctionRatio / u_sizeRatio * 2.0;
      float tgtEffective = 1.0 - u_correctionRatio / tgtExtent;
      float tgtCa = u_cameraAngle * (1.0 - a_targetRotateAlign);
      mat2 tgtRot = mat2(cos(tgtCa), -sin(tgtCa), sin(tgtCa), cos(tgtCa));
      float lo = 0.5, hi = 1.0;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = tgtRot * ((pos - a_target) / tgtExtent);
        float sdf = querySDF(int(a_targetShapeId), localPos, tgtEffective);
        if (sdf < 0.0) hi = mid; else lo = mid;
      }
      tEnd = mix(tEnd, (lo + hi) * 0.5, straightenFactor);
    }
  }

  v_clamp = vec4(tStart, tEnd, straightenFactor, pathLength);

  // Scatter this point to its edge's texel center in the frame texture.
  float x = mod(float(edgeIdx), u_frameTextureWidth);
  float y = floor(float(edgeIdx) / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`);return _}var bn=0,Mr=1,xn=2;function tu(a,n,t){var e=[];t&&(e.push([bn,0,-1],[bn,0,1]),e.push([bn,1,-1],[bn,1,1]));for(var r=0;r<=a;r++){var i=r/a;e.push([Mr,i,-1],[Mr,i,1])}return n&&(e.push([xn,0,-1],[xn,0,1]),e.push([xn,1,-1],[xn,1,1])),{data:e,attributes:[{name:"a_zone",size:1,type:Pt},{name:"a_zoneT",size:1,type:Pt},{name:"a_side",size:1,type:Pt}],verticesPerEdge:e.length}}function nu(a,n,t,e){var r=ye([].concat(V(a),V(t))),i=Nt(r),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture"]),s=new Set,l=[],u=function(g){!o.has(g.name)&&!s.has(g.name)&&(s.add(g.name),l.push("uniform ".concat(g.type," ").concat(g.name,";")))};a.forEach(function(m){return m.uniforms.forEach(u)}),n.forEach(function(m){return m.uniforms.forEach(u)}),t.forEach(function(m){return m.uniforms.forEach(u)});var d=e.map(function(m){var g=m.size===1?"float":"vec".concat(m.size);return"in ".concat(g," ").concat(m.name,";")}).join(`
`),h=n.map(function(m){return ae(m.widthFactor)}).join(", "),c=Math.max.apply(Math,V(a.map(function(m){return m.minBodyLengthRatio||0}))),f=t.some(function(m){return m.needsNodeColors}),v=a.some(function(m){return m.needsNodeSize}),y=`#version 300 es

// Constant attributes (per vertex)
`.concat(d,`

// Per-edge attributes
// Edge data (source/target indices, thickness, extremity ratios, path/extremity IDs)
// is fetched from edge data texture via edge index
in float a_edgeIndex;   // Index into edge data texture
in vec4 a_color;        // Edge color
in vec4 a_id;           // Edge ID for picking
in float a_opacity;     // Edge opacity

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture;
uniform int u_edgeFrameTextureWidth;

// Edge path attribute texture uniforms
`).concat(i.uniformDeclarations,`

// Custom uniforms
`).concat(l.join(`
`),`

// Standard varyings
out vec4 v_color;
out float v_opacity;
out vec4 v_id;
out float v_thickness;       // Edge body thickness (in consistent units)
out float v_t;
out float v_tStart;
out float v_tEnd;
out float v_side;
out float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
out vec2 v_source;
out vec2 v_target;
out float v_edgeLength;
`).concat(v?`
out float v_sourceNodeSize;  // Source node size (mirrored in labels/generator.ts as plain float)
out float v_targetNodeSize;  // Target node size (mirrored in labels/generator.ts as plain float)`:"",`
`).concat(f?`
out vec4 v_sourceColor;
out vec4 v_targetColor;`:"",`
// Zone varyings
out float v_zone;            // 0=tail, 1=body, 2=head
out float v_zoneT;           // Position within zone [0,1]
out float v_headLengthRatio; // Head length as ratio of thickness
out float v_tailLengthRatio; // Tail length as ratio of thickness
out float v_headWidthRatio;  // Head width factor
out float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat out int v_pathId;
flat out int v_headId;
flat out int v_tailId;

// Path/layer attribute varyings (fetched from edge attribute texture)
`).concat(i.vertexVaryingDeclarations,`

const float bias = 255.0 / 254.0;

// Width factor array for extremities (shared pool for head/tail)
const float EXTREMITY_WIDTH_FACTORS[`).concat(n.length,"] = float[](").concat(h,`);

// All path functions
`).concat(ga(a),`

// Path selector functions
`).concat(va(a),`

// Node-data fetch helper (geometry texel of the two-texel node stride)
`).concat(we,`
`).concat(f?dl:"",`
// Per-edge clamp from the frame-pass (tStart, tEnd, straightenFactor, pathLength)
`).concat(ht,`

void main() {
  // Fetch edge data from edge texture (2 texels per edge)
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, (headId << 4) | tailId
  int edgeIdx = int(a_edgeIndex);

  // Hidden edges are flagged with a negative row by EdgeProgram.process(). Push
  // the whole primitive outside the clip volume: every vertex lands at the same
  // out-of-range position, so it is fully clipped and rasterizes nothing \u2014
  // neither to the frame buffer nor to the picking buffer.
  if (edgeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    return;
  }

  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  // edgeData0.w is now reserved (curvature moved to path attribute texture)
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes from edge attribute texture
`).concat(i.fetchCode,`

  // Assign path/layer attribute varyings
`).concat(i.varyingAssignments,`

  // Fetch source and target node geometry (texel 0 of the two-texel node stride)
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
`).concat(v?`
  // Assign node size varyings early (path functions like loops need them during clamping)
  v_sourceNodeSize = srcNodeData.z;
  v_targetNodeSize = tgtNodeData.z;`:"",`
`).concat(f?`
  v_sourceColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  v_targetColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);`:"",`

  // Convert thickness to WebGL units
  float minThickness = u_minEdgeThickness;
  float pixelsThickness = max(a_thickness, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Extremity parameters from ID lookups (shared pool)
  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = `).concat(ae(c),`;

  // Per-edge values from the frame-pass texture (read by edge index).
  // tStart/tEnd are the ungated boundary clamps: re-apply the body's extremity
  // gating here (no extremity \u2192 body runs to the node center, 0/1).
  vec4 frameClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  float tStart           = a_tailLengthRatio > 0.0 ? frameClamp.x : 0.0;
  float tEnd             = a_headLengthRatio > 0.0 ? frameClamp.y : 1.0;
  float straightenFactor = frameClamp.z;
  float pathLength       = frameClamp.w;

  // Anti-aliasing width (~1 pixel, normalized by thickness)
  float antialiasingWidth = u_correctionRatio / webGLThickness;

  float visibleLength = pathLength * (tEnd - tStart);

  // Compute extremity lengths in world units
  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  // Handle short edges: scale down extremities if needed
  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  // Convert lengths to t-values
  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  // Zone boundaries in t-space
  float tTailEnd = tStart + tailLengthT;
  float tHeadStart = tEnd - headLengthT;

  // Ensure body has non-negative length
  if (tTailEnd > tHeadStart) {
    float mid = (tStart + tEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Convert to webGL units for geometry expansion
  float aaWidthWebGL = antialiasingWidth * webGLThickness;

  // Extra geometry width for picking padding (0 in visual mode)
  #ifdef PICKING_MODE
    float pickingPaddingWebGL = u_pickingPadding * u_correctionRatio;
  #else
    float pickingPaddingWebGL = 0.0;
  #endif

  // Straight-line direction and normal (for blending when straightenFactor > 0)
  vec2 straightDir = length(a_target - a_source) > 0.0001
    ? normalize(a_target - a_source) : vec2(1.0, 0.0);
  vec2 straightNormal = vec2(-straightDir.y, straightDir.x);

  // Zone-based vertex processing using path selectors
  vec2 position;
  vec2 normal;
  float t;
  float zone = a_zone;
  float zoneT = a_zoneT;
  float side = a_side;

  // Scaled extremity width factors (geometry must be at least as wide as body)
  float scaledTailWidth = max(tailWidthFactor * extremityScale, 1.0);
  float scaledHeadWidth = max(headWidthFactor * extremityScale, 1.0);

  if (zone < 0.5) {
    // TAIL ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tStart, a_source, a_target),
                         queryPathPosition(pathId, tTailEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tStart, tTailEnd, zoneT);

  } else if (zone < 1.5) {
    // BODY ZONE: follows path curvature with width = 1.0
    t = mix(tTailEnd, tHeadStart, zoneT);
    normal = queryPathNormal(pathId, t, a_source, a_target);
    float halfWidth = webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = queryPathPosition(pathId, t, a_source, a_target) + normal * side * halfWidth;

  } else {
    // HEAD ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tHeadStart, a_source, a_target),
                         queryPathPosition(pathId, tEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tHeadStart, tEnd, zoneT);
  }

  // Blend toward straight line based on path twist in extremity zones
  if (straightenFactor > 0.001) {
    float zoneWidth = zone < 0.5 ? webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      zone < 1.5 ? webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    vec2 straightPos = mix(a_source, a_target, t) + straightNormal * side * zoneWidth;
    position = mix(position, straightPos, straightenFactor);
  }

  gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0.0, 1.0);

  // Pass varyings to fragment shader
  v_color = a_color;
  v_color.a *= bias;
  v_opacity = a_opacity;
  v_id = a_id;
  v_thickness = webGLThickness;
  v_t = t;
  v_tStart = tStart;
  v_tEnd = tEnd;
  v_side = side;
  v_antialiasingWidth = antialiasingWidth;
  v_source = a_source;
  v_target = a_target;
  v_edgeLength = pathLength;

  // Zone varyings
  v_zone = zone;
  v_zoneT = zoneT;
  v_headLengthRatio = headLengthRatio * extremityScale;
  v_tailLengthRatio = tailLengthRatio * extremityScale;
  // Scale extremity width proportionally with length when crushed
  v_headWidthRatio = headWidthFactor * extremityScale;
  v_tailWidthRatio = tailWidthFactor * extremityScale;

  // Multi-path varyings
  v_pathId = pathId;
  v_headId = headId;
  v_tailId = tailId;
}
`);return y}function au(a,n,t,e){var r=ye([].concat(V(a),V(t))),i=Nt(r),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding"]),s=new Set,l=[],u=function(p){!o.has(p.name)&&!s.has(p.name)&&(s.add(p.name),l.push("uniform ".concat(p.type," ").concat(p.name,";")))};a.forEach(function(g){return g.uniforms.forEach(u)}),n.forEach(function(g){return g.uniforms.forEach(u)}),t.forEach(function(g){return g.uniforms.forEach(u)});var d=n.map(function(g){var p;return ae((p=g.baseRatio)!==null&&p!==void 0?p:.5)}).join(", "),h=function(p){var b,x;return n.length>1?"EXTREMITY_BASE_RATIOS[".concat(p,"]"):ae((b=(x=n[0])===null||x===void 0?void 0:x.baseRatio)!==null&&b!==void 0?b:.5)},c=n.some(function(g){return De(g.length)?!0:g.length>0}),f=t.some(function(g){return g.needsNodeColors}),v=a.some(function(g){return g.needsNodeSize}),y=t.map(function(g,p){return"  // Layer ".concat(p+1,": ").concat(g.name,`
  color = blendOver(color, layer_`).concat(g.name,"(context));")}).join(`

`),m=`#version 300 es
precision highp float;

// Standard varyings
in vec4 v_color;
in float v_opacity;
in vec4 v_id;
in float v_thickness;       // Edge body thickness
in float v_t;
in float v_tStart;
in float v_tEnd;
in float v_side;
in float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
in vec2 v_source;
in vec2 v_target;
in float v_edgeLength;
`.concat(v?`
in float v_sourceNodeSize;   // Source node size (mirrored in labels/generator.ts as plain float)
in float v_targetNodeSize;   // Target node size (mirrored in labels/generator.ts as plain float)`:"",`
`).concat(f?`
in vec4 v_sourceColor;
in vec4 v_targetColor;`:"",`
// Zone varyings
in float v_zone;            // 0=tail, 1=body, 2=head
in float v_zoneT;           // Position within zone [0,1]
in float v_headLengthRatio; // Head length as ratio of thickness (scaled for short edges)
in float v_tailLengthRatio; // Tail length as ratio of thickness (scaled for short edges)
in float v_headWidthRatio;  // Head width factor
in float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat in int v_pathId;
flat in int v_headId;
flat in int v_tailId;

// Path/layer attribute varyings (from vertex shader texture fetch)
`).concat(i.fragmentVaryingDeclarations,`

// Standard uniforms (needed by some path types)
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Custom uniforms
`).concat(l.join(`
`),`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

`).concat(n.length>1?`// Base ratio array for extremities (shared pool for head/tail)
const float EXTREMITY_BASE_RATIOS[`.concat(n.length,"] = float[](").concat(d,");"):"",`

// EdgeContext struct
struct EdgeContext {
  float t;                   // Position along path [0, 1]
  float sdf;                 // Signed distance from centerline
  vec2 position;             // World position
  vec2 tangent;              // Path tangent
  vec2 normal;               // Path normal
  float thickness;           // Edge thickness
  float aaWidth;             // Anti-aliasing width
  float edgeLength;          // Total path length
  float tStart;              // Clamped start t
  float tEnd;                // Clamped end t
  float distanceFromSource;  // Arc distance from source
  float distanceToTarget;    // Arc distance to target
};

EdgeContext context;

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// All path functions
`).concat(ga(a),`

// Path selector functions
`).concat(va(a),`

// All extremity functions
`).concat(Yl(n),`

// Extremity SDF selector (shared pool for head/tail)
`).concat(Ql(n),`

// Layer functions
`).concat(t.map(function(g){return g.glsl}).join(`

`),`

// Helper: Compute arc length using path selector
float computeArcLengthMulti(int pathId, float t0, float t1, vec2 source, vec2 target, int samples) {
  float arcLen = 0.0;
  vec2 prev = queryPathPosition(pathId, t0, source, target);
  for (int i = 1; i <= samples; i++) {
    float t = t0 + (t1 - t0) * float(i) / float(samples);
    vec2 curr = queryPathPosition(pathId, t, source, target);
    arcLen += length(curr - prev);
    prev = curr;
  }
  return arcLen;
}

void main() {
  // Compute normalized t within visible edge (0 = start, 1 = end)
  float tNorm = (v_t - v_tStart) / max(v_tEnd - v_tStart, 0.0001);

  // Edge body half-thickness
  float halfThickness = v_thickness * 0.5;

  // Convert normalized AA width to webGL units (~1 pixel)
  float aaWidthWebGL = v_antialiasingWidth * v_thickness;

  // Distance from centerline based on v_side interpolation
  float zoneWidthFactor = v_zone < 0.5 ? v_tailWidthRatio :
                          v_zone < 1.5 ? 1.0 :
                          v_headWidthRatio;
  // In PICKING_MODE, inflate halfGeometryWidth to match the inflated vertex geometry
  #ifdef PICKING_MODE
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL + u_pickingPadding * aaWidthWebGL;
  #else
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL;
  #endif
  float distFromCenter = abs(v_side) * halfGeometryWidth;

  // Populate EdgeContext (for layer functions)
  context.t = tNorm;
  context.sdf = distFromCenter - halfThickness;
  context.position = queryPathPosition(v_pathId, v_t, v_source, v_target);
  context.tangent = queryPathTangent(v_pathId, v_t, v_source, v_target);
  context.normal = vec2(-context.tangent.y, context.tangent.x);
  context.thickness = v_thickness;
  context.aaWidth = aaWidthWebGL;
  context.edgeLength = v_edgeLength;
  context.tStart = v_tStart;
  context.tEnd = v_tEnd;

  // Compute arc distances
  float visibleLength = v_edgeLength * (v_tEnd - v_tStart);
  float pathT = v_t;
  float pathTNorm = tNorm;
`).concat(a.every(function(g){return g.linearParameterization})?`  // All paths have linear parameterization: t maps directly to arc distance
  context.distanceFromSource = pathTNorm * visibleLength;
  context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;`:a.every(function(g){return!g.linearParameterization})?`  // No paths have linear parameterization: use numerical integration
  context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
  context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);`:`  // Mixed parameterization: use analytical for linear paths, numerical for others
  if (`.concat(a.filter(function(g){return g.linearParameterization}).map(function(g){return"v_pathId == ".concat(a.indexOf(g))}).join(" || "),`) {
    context.distanceFromSource = pathTNorm * visibleLength;
    context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;
  } else {
    context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
    context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);
  }`),`

  // Compute SDF based on zone using extremity selector (shared pool)
  float bodySDF = distFromCenter - halfThickness;
  float finalSDF;

`).concat(c?`  // Base ratios, from baseRatioLookup
  float headBaseRatio = `.concat(h("v_headId"),`;
  float tailBaseRatio = `).concat(h("v_tailId"),`;

  if (v_zone < 0.5) {
    // TAIL ZONE: v_zoneT goes 0 (tip) to 1 (base)
    vec2 uv = vec2((1.0 - v_zoneT) * v_tailLengthRatio, v_side * v_tailWidthRatio * 0.5);
    float tailSDF = queryExtremitySDF(v_tailId, uv, v_tailLengthRatio, v_tailWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT > 1 - baseRatio)
    if (v_zoneT > 1.0 - tailBaseRatio) {
      finalSDF = min(tailSDF, bodySDF);
    } else {
      finalSDF = tailSDF;
    }
  } else if (v_zone < 1.5) {
    // BODY ZONE: distance from centerline
    finalSDF = bodySDF;
  } else {
    // HEAD ZONE: v_zoneT goes 0 (base) to 1 (tip)
    vec2 uv = vec2(v_zoneT * v_headLengthRatio, v_side * v_headWidthRatio * 0.5);
    float headSDF = queryExtremitySDF(v_headId, uv, v_headLengthRatio, v_headWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT < baseRatio)
    if (v_zoneT < headBaseRatio) {
      finalSDF = min(headSDF, bodySDF);
    } else {
      finalSDF = headSDF;
    }
  }`):`  // No extremity draws tail/head geometry, so every vertex is body zone.
  finalSDF = bodySDF;`,`

  #ifdef PICKING_MODE
    // Picking pass: output edge ID for pixels within the picking area
    if (finalSDF > u_pickingPadding * aaWidthWebGL) discard;
    fragColor = v_id;
  #else
`).concat(e?`    // Visual pass: anti-aliased edge with layers, edge opacity applied once
    float alpha = smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) edge with layers, edge opacity applied once
    float alpha = (finalSDF < 0.0 ? 1.0 : 0.0) * v_opacity;`,`
    if (alpha < 0.01) discard;

    // Apply layers sequentially with "over" compositing
    vec4 color = vec4(0.0);

`).concat(y,`

    // Mix with transparent to fade both color AND alpha (pre-multiplied alpha for correct blending)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`);return m}function ru(a,n,t){var e=De(n.length)?!0:n.length>0,r=De(t.length)?!0:t.length>0;if(a.generateConstantData){var i=a.generateConstantData();return{data:i.data,attributes:i.attributes,verticesPerEdge:i.verticesPerEdge}}return tu(a.segments,e,r)}function zr(a){var n,t=ni(a),e=t.paths,r=t.extremities,i=t.layers,o=(n=a.antialias)!==null&&n!==void 0?n:!0,s=new Map,l=new Map,u=new Map,d=z(e),h;try{for(d.s();!(h=d.n()).done;){var c=h.value,f=z(r),v;try{for(f.s();!(v=f.n()).done;){var y=v.value,m=z(r),g;try{for(m.s();!(g=m.n()).done;){var p=g.value,b="".concat(c.name,":").concat(y.name,":").concat(p.name),x=ru(c,y,p);s.set(b,x.verticesPerEdge),l.set(b,x.data);var _=z(x.attributes),T;try{for(_.s();!(T=_.n()).done;){var A=T.value;u.has(A.name)||u.set(A.name,A)}}catch(X){_.e(X)}finally{_.f()}}}catch(X){m.e(X)}finally{m.f()}}}catch(X){f.e(X)}finally{f.f()}}}catch(X){d.e(X)}finally{d.f()}var E=Array.from(u.values()),R={};E.forEach(function(X,Z){R[X.name]=Z});var L=0,k="",w=z(s),F;try{for(w.s();!(F=w.n()).done;){var C=Q(F.value,2),N=C[0],G=C[1];G>L&&(L=G,k=N)}}catch(X){w.e(X)}finally{w.f()}var M=l.get(k)||[],P=k.split(":"),D=Q(P,1),I=D[0],H=e.find(function(X){return X.name===I}),O=[];H!=null&&H.generateConstantData?O=H.generateConstantData().attributes:O=[{name:"a_zone"},{name:"a_zoneT"},{name:"a_side"}];var $=M.map(function(X){var Z=new Array(E.length).fill(0);return O.forEach(function(re,ce){var be=R[re.name];be!==void 0&&ce<X.length&&(Z[be]=X[ce])}),Z});return{vertexShader:nu(e,r,i,E),fragmentShader:au(e,r,i,o),uniforms:ql(e,r,i),attributes:iu(),verticesPerEdge:L,constantData:$,constantAttributes:E,vertexCountsPerCombination:s,constantDataPerCombination:l}}function iu(a,n,t){return[{name:"a_edgeIndex",size:1,type:Pt},{name:"a_color",size:4,type:Nr,normalized:!0},{name:"a_id",size:4,type:Nr,normalized:!0},{name:"a_opacity",size:1,type:Pt}]}var ou=`#version 300 es
precision highp float;

in vec4 v_clamp;

// RGBA32F target: stores (tStart, tEnd, straightenFactor, pathLength).
out vec4 fragColor;

void main() {
  fragColor = v_clamp;
}
`,su=(function(){function a(n,t){q(this,a),S(this,"uniformLocations",{});var e=t.paths,r=t.extremities,i=t.layers,o=t.nodeShapes,s=t.nodeLayers;this.gl=n,this.hasAttributeData=ye([].concat(V(e),V(i))).floatsPerItem>0,this.hasNodeAttributeData=Object.keys(ct(o,s).offsets).length>0,this.vertexShader=sa(n,eu(e,r,i,o,s)),this.fragmentShader=la(n,ou),this.program=ua(n,[this.vertexShader,this.fragmentShader]);var l=new Set;this.customUniforms=[];for(var u=0,d=[].concat(V(e),V(r));u<d.length;u++){var h=d[u],c=z(h.uniforms),f;try{for(c.s();!(f=c.n()).done;){var v=f.value;l.has(v.name)||(l.add(v.name),this.customUniforms.push(v))}}catch(b){c.e(b)}finally{c.f()}}var y=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_minEdgeThickness","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode","u_frameTextureWidth","u_frameTextureHeight"].concat(V(this.customUniforms.map(function(b){return b.name}))),m=z(y),g;try{for(m.s();!(g=m.n()).done;){var p=g.value;this.uniformLocations[p]=n.getUniformLocation(this.program,p)}}catch(b){m.e(b)}finally{m.f()}this.vao=n.createVertexArray()}return Y(a,[{key:"run",value:function(t,e,r,i,o){if(r!==0){var s=this.gl,l=this.uniformLocations;s.useProgram(this.program),s.bindVertexArray(this.vao),l.u_sizeRatio&&s.uniform1f(l.u_sizeRatio,t.sizeRatio),l.u_correctionRatio&&s.uniform1f(l.u_correctionRatio,t.correctionRatio),l.u_cameraAngle&&s.uniform1f(l.u_cameraAngle,t.cameraAngle),l.u_minEdgeThickness&&s.uniform1f(l.u_minEdgeThickness,t.minEdgeThickness),l.u_nodeDataTexture&&s.uniform1i(l.u_nodeDataTexture,t.nodeDataTextureUnit),l.u_nodeDataTextureWidth&&s.uniform1i(l.u_nodeDataTextureWidth,t.nodeDataTextureWidth),l.u_edgeDataTexture&&s.uniform1i(l.u_edgeDataTexture,t.edgeDataTextureUnit),l.u_edgeDataTextureWidth&&s.uniform1i(l.u_edgeDataTextureWidth,t.edgeDataTextureWidth),l.u_frameTextureWidth&&s.uniform1f(l.u_frameTextureWidth,e.getTextureWidth()),l.u_frameTextureHeight&&s.uniform1f(l.u_frameTextureHeight,e.getTextureHeight()),this.hasAttributeData&&i&&(i.bind(Ie),l.u_edgeAttributeTexture&&s.uniform1i(l.u_edgeAttributeTexture,Ie),l.u_edgeAttributeTextureWidth&&s.uniform1i(l.u_edgeAttributeTextureWidth,i.getTextureWidth()),l.u_edgeAttributeTexelsPerEdge&&s.uniform1i(l.u_edgeAttributeTexelsPerEdge,i.getTexelsPerItem())),this.hasNodeAttributeData&&o&&(o.bind(Fe),l.u_layerAttributeTexture&&s.uniform1i(l.u_layerAttributeTexture,Fe),l.u_layerAttributeTextureWidth&&s.uniform1i(l.u_layerAttributeTextureWidth,o.getTextureWidth()),l.u_layerAttributeTexelsPerNode&&s.uniform1i(l.u_layerAttributeTexelsPerNode,o.getTexelsPerItem()));var u=z(this.customUniforms),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;fa(s,this.uniformLocations[h.name],h)}}catch(c){u.e(c)}finally{u.f()}e.bindAsRenderTarget(),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.drawArrays(s.POINTS,0,r),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindVertexArray(null)}}},{key:"kill",value:function(){var t=this.gl;t.deleteProgram(this.program),t.deleteShader(this.vertexShader),t.deleteShader(this.fragmentShader),t.deleteVertexArray(this.vao)}}])})();function Lt(a,n,t,e,r,i){if(a.length===1)return"".concat(e," ").concat(n,"(int pathId, ").concat(r,`) {
  return path_`).concat(a[0].name,"_").concat(t,"(").concat(i,`);
}`);var o=a.map(function(s,l){return"    case ".concat(l,": return path_").concat(s.name,"_").concat(t,"(").concat(i,");")}).join(`
`);return"".concat(e," ").concat(n,"(int pathId, ").concat(r,`) {
  switch (pathId) {
`).concat(o,`
    default: return path_`).concat(a[0].name,"_").concat(t,"(").concat(i,`);
  }
}`)}var lu=`
vec3 computeEdgeLabelBodyBounds(
  float tStart, float tEnd, float pathLength,
  float webGLThickness, float headLengthRatio, float tailLengthRatio
) {
  float visibleLength = pathLength * (tEnd - tStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float totalNeededLength = headLength + tailLength;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    float extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float bodyStartDist = tStart * pathLength + tailLength;
  float bodyEndDist = tEnd * pathLength - headLength;
  return vec3(bodyStartDist, bodyEndDist, max(bodyEndDist - bodyStartDist, 0.0));
}
`;function uu(a,n){var t=ae(a),e=ae(n);return`
float computeEdgeLabelAlpha(float bodyLength, float textWidthWebGL) {
  float ratio = textWidthWebGL > 0.0001 ? min(bodyLength / textWidthWebGL, 1.0) : 1.0;
  if (ratio < `.concat(t,`) return 0.0;
  if (ratio < `).concat(e,") return (ratio - ").concat(t,") / (").concat(e," - ").concat(t,`);
  return 1.0;
}
`)}var du=`
float computeEdgeLabelPerpOffset(
  float positionMode,
  float halfThickness, float marginWebGL, float halfTextHeight,
  vec2 source, vec2 target, mat3 matrix
) {
  float magnitude = halfThickness + marginWebGL + halfTextHeight;
  if (positionMode == 1.0) return magnitude;
  if (positionMode == 2.0) return -magnitude;
  if (positionMode == 3.0) {
    vec3 sc = matrix * vec3(source, 1.0);
    vec3 tc = matrix * vec3(target, 1.0);
    return sc.x < tc.x ? magnitude : -magnitude;
  }
  return 0.0;
}
`;function ri(a){var n=a.paths,t=a.minVisibilityThreshold,e=a.fullVisibilityThreshold,r=n.some(function(s){return s.hasSharpCorners}),i=n.map(function(s){return"// --- Path: ".concat(s.name,` ---
`).concat(s.glsl,`

// Tangent/normal functions: analytical if provided, otherwise numerical
`).concat(s.analyticalTangentGlsl||ei(s.name),`

// Auto-generated fallbacks for any missing path functions
`).concat(ti(s.name,s.glsl),`

// Corner skip helpers (for paths with sharp corners like step/taxi)
`).concat(s.cornerSkipGlsl||"",`
`)}).join(`
`),o=r?`// Corner function selectors (only some paths have sharp corners)
vec2 queryGetCornerTs(int pathId, vec2 source, vec2 target) {
  switch (pathId) {
`.concat(n.map(function(s,l){return s.hasSharpCorners?"    case ".concat(l,": return path_").concat(s.name,"_getCornerTs(source, target);"):"    case ".concat(l,": return vec2(-1.0, -1.0); // No corners for ").concat(s.name)}).join(`
`),`
    default: return vec2(-1.0, -1.0);
  }
}

vec2 queryGetCornerConcavity(int pathId, vec2 source, vec2 target, float perpOffset) {
  switch (pathId) {
`).concat(n.map(function(s,l){return s.hasSharpCorners?"    case ".concat(l,": return path_").concat(s.name,"_getCornerConcavity(source, target, perpOffset);"):"    case ".concat(l,": return vec2(0.0, 0.0); // No corners for ").concat(s.name)}).join(`
`),`
    default: return vec2(0.0, 0.0);
  }
}`):"";return`
// ============================================================================
// Node data fetch (geometry texel) and per-edge clamp fetch (edge-frame texture)
// ============================================================================

`.concat(we,`
`).concat(ht,`

// ============================================================================
// Path Functions (one block per path)
// ============================================================================

`).concat(i,`

// ============================================================================
// Path Query Selectors (dispatch by pathId)
// ============================================================================

`).concat(Lt(n,"queryPathPosition","position","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(Lt(n,"queryPathTangent","tangent","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(Lt(n,"queryPathNormal","normal","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(Lt(n,"queryPathLength","length","float","vec2 source, vec2 target","source, target"),`

`).concat(Lt(n,"queryPathTAtDistance","t_at_distance","float","float dist, vec2 source, vec2 target","dist, source, target"),`

`).concat(o,`

// ============================================================================
// Shared helpers (body bounds, alpha ramp, perpendicular offset)
// ============================================================================

`).concat(lu,`
`).concat(uu(t,e),`
`).concat(du,`
`)}var hu=Te.fontSize,cu=new Map,ii=24,Wr=(ii+1)*2;function fu(a){var n=a.paths,t=a.fontSizeMode,e=a.headLengthRatio,r=a.tailLengthRatio,i=a.minVisibilityThreshold,o=a.fullVisibilityThreshold,s=t==="scaled",l=We(),u=ye([].concat(V(n),[l])),d=Nt(u),h=`#version 300 es

// Per-instance attributes
in float a_edgeIndex;
in float a_edgeAttrIndex;
in float a_baseFontSize;
in float a_totalTextWidth;
in float a_positionMode;
in float a_margin;
in float a_padding;
in vec4 a_color;
in vec4 a_id;

// Per-vertex (constant) attribute: strip vertex index
in float a_vertexIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
`.concat(s?"uniform float u_zoomSizeRatio;":"",`

`).concat(d.uniformDeclarations,`

out vec4 v_color;
out vec4 v_id;
out float v_alphaModifier;

const float ATLAS_FONT_SIZE = `).concat(ae(hu),`;
const float HEAD_RATIO = `).concat(ae(e),`;
const float TAIL_RATIO = `).concat(ae(r),`;
const int RIBBON_SEGMENTS = `).concat(ii,`;

// Path attribute varyings (declared as plain locals since this shader has no FS inputs for them)
`).concat(d.vertexVaryingDeclarations.replace(/out /g,""),`

// Node size variables used by some path functions (self-loops, etc.)
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
`).concat(ri({paths:n,minVisibilityThreshold:i,fullVisibilityThreshold:o}),`

void main() {
  int vIdx = int(a_vertexIndex);
  int pairIdx = vIdx / 2;
  int side = vIdx - pairIdx * 2; // 0 = left/bottom, 1 = right/top

  // --- Fetch edge data (2 texels per edge) ---
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 e0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 e1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, e0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, e1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  int pathId = int(edgeData1.z);

  // --- Fetch path attributes (curvature, etc.) ---
  {
    int edgeIdx = int(a_edgeAttrIndex);
`).concat(d.fetchCode,`
`).concat(d.varyingAssignments,`
  }

  // --- Fetch node data: geometry (texel 0) + rotation flags (texel 1) ---
  vec4 srcN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcN.xy;
  vec2 target = tgtN.xy;
  float sourceSize = srcN.z;
  float targetSize = tgtN.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;

  // --- Pixel-to-graph conversion (fixed font mode) ---
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // --- Body bounds (shared with edge label shader) ---
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, HEAD_RATIO, TAIL_RATIO
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // --- Text dimensions ---
  float baseFontSize = a_baseFontSize;
  `).concat(s?`float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  float textWidthWebGL = a_totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float marginWebGL = a_margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  float textWidthWebGL = a_totalTextWidth * fontScale * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;
  float marginWebGL = a_margin * pixelToGraph;`,`
  float paddingWebGL = a_padding * pixelToGraph;

  // --- Alpha modifier (shared with edge label shader) ---
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);
  if (alphaModifier <= 0.0 || textWidthWebGL <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    v_alphaModifier = 0.0;
    return;
  }

  // --- Perpendicular offset (shared with edge label shader) ---
  float halfThickness = webGLThickness * 0.5;
  float perpOffset = computeEdgeLabelPerpOffset(
    a_positionMode, halfThickness, marginWebGL, halfTextHeight, source, target, u_matrix
  );

  // --- Ribbon span (clipped to body) ---
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;
  float halfTextWebGL = textWidthWebGL * 0.5;
  float labelStartDist = max(bodyCenterDist - halfTextWebGL, bodyStartDist);
  float labelEndDist = min(bodyCenterDist + halfTextWebGL, bodyEndDist);

  // Sample centerline at this pair, then apply perpendicular offset.
  // The ribbon follows the centerline path (simple & robust); for curved edges
  // this closely matches the offset path the characters sit on.
  float u = float(pairIdx) / float(RIBBON_SEGMENTS);
  float arcDist = mix(labelStartDist, labelEndDist, u);
  float t = queryPathTAtDistance(pathId, arcDist, source, target);
  vec2 pos = queryPathPosition(pathId, t, source, target);
  vec2 tan = queryPathTangent(pathId, t, source, target);
  vec2 perp = vec2(-tan.y, tan.x);

  vec2 centerPos = pos + perp * perpOffset;

  float halfRibbon = halfTextHeight + paddingWebGL;
  float sideSign = side == 0 ? -1.0 : 1.0;
  vec2 ribbonPos = centerPos + perp * (sideSign * halfRibbon);

  vec3 clipPos = u_matrix * vec3(ribbonPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  v_color = a_color;
  v_id = a_id;
  v_alphaModifier = alphaModifier;
}
`);return h}var gu=`#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_id;
in float v_alphaModifier;

out vec4 fragColor;

void main() {
#ifdef PICKING_MODE
  if (v_alphaModifier <= 0.0) discard;
  fragColor = v_id;
#else
  float alpha = v_color.a * v_alphaModifier;
  if (alpha <= 0.0) discard;
  fragColor = vec4(v_color.rgb * alpha, alpha);
#endif
}
`;function vu(a,n,t,e){var r=e.shaderConfig,i=r.paths,o=r.fontSizeMode;if(i.length===0)throw new Error("createEdgeLabelBackgroundProgram: shaderConfig must declare at least one path");var s=We(),l=ye([].concat(V(i),[s])),u=An([].concat(V(i),[s]),l),d=fu(r),h=(function(c){function f(v,y,m){var g;return q(this,f),g=te(this,f,[v,y,m]),S(g,"totalCount",0),S(g,"bufferCapacity",0),S(g,"edgeAttributeTexture",null),g.edgeAttributeTexture=new En(v,l),g.packedAttributeData=new Float32Array(l.floatsPerItem),g}return ne(f,c),Y(f,[{key:"getDefinition",value:function(){for(var y=WebGL2RenderingContext,m=y.FLOAT,g=y.UNSIGNED_BYTE,p=y.TRIANGLE_STRIP,b=[],x=0;x<Wr;x++)b.push([x]);var _=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_resolution","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth"];return o==="scaled"&&_.push("u_zoomSizeRatio"),l.floatsPerItem>0&&_.push("u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"),{VERTICES:Wr,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:gu,METHOD:p,UNIFORMS:_,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:m},{name:"a_edgeAttrIndex",size:1,type:m},{name:"a_baseFontSize",size:1,type:m},{name:"a_totalTextWidth",size:1,type:m},{name:"a_positionMode",size:1,type:m},{name:"a_margin",size:1,type:m},{name:"a_padding",size:1,type:m},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_id",size:4,type:g,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:"a_vertexIndex",size:1,type:m}],CONSTANT_DATA:b}}},{key:"processEdgeLabelBackground",value:function(y,m,g){var p=0;if(this.edgeAttributeTexture&&l.floatsPerItem>0){p=this.edgeAttributeTexture.allocate(m);var b=this.packedAttributeData;Dn(u,g.edgeAttributes,b,"",cu,0),this.edgeAttributeTexture.updateAllAttributes(m,b)}var x=this.floats,_=this.ints,T=y*this.STRIDE;x[T++]=g.edgeIndex,x[T++]=p,x[T++]=g.baseFontSize,x[T++]=g.totalTextWidth,x[T++]=g.positionMode,x[T++]=g.margin,x[T++]=g.padding,x[T++]=g.color,_[T++]=g.id}},{key:"setUniforms",value:function(y,m){var g=m.gl,p=m.uniformLocations;if(g.uniformMatrix3fv(p.u_matrix,!1,y.matrix),g.uniform1f(p.u_sizeRatio,y.sizeRatio),g.uniform1f(p.u_correctionRatio,y.correctionRatio),g.uniform1f(p.u_pixelRatio,y.pixelRatio),g.uniform1f(p.u_cameraAngle,y.cameraAngle),g.uniform2f(p.u_resolution,y.width,y.height),p.u_nodeDataTexture!==void 0&&g.uniform1i(p.u_nodeDataTexture,y.nodeDataTextureUnit),p.u_nodeDataTextureWidth!==void 0&&g.uniform1i(p.u_nodeDataTextureWidth,y.nodeDataTextureWidth),p.u_edgeDataTexture!==void 0&&g.uniform1i(p.u_edgeDataTexture,y.edgeDataTextureUnit),p.u_edgeDataTextureWidth!==void 0&&g.uniform1i(p.u_edgeDataTextureWidth,y.edgeDataTextureWidth),p.u_edgeFrameTexture!==void 0&&g.uniform1i(p.u_edgeFrameTexture,y.edgeFrameTextureUnit),p.u_edgeFrameTextureWidth!==void 0&&g.uniform1i(p.u_edgeFrameTextureWidth,y.edgeFrameTextureWidth),o==="scaled"&&p.u_zoomSizeRatio!==void 0){var b=this.renderer.getSetting("zoomToSizeRatioFunction");g.uniform1f(p.u_zoomSizeRatio,1/b(y.zoomRatio))}this.edgeAttributeTexture&&l.floatsPerItem>0&&p.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(Ie),g.uniform1i(p.u_edgeAttributeTexture,Ie),g.uniform1i(p.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),g.uniform1i(p.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()))}},{key:"renderProgram",value:function(y,m){this.edgeAttributeTexture&&l.floatsPerItem>0&&this.edgeAttributeTexture.upload(),se(f,"renderProgram",this,3)([y,m])}},{key:"kill",value:function(){this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),se(f,"kill",this,3)([])}},{key:"drawWebGL",value:function(y,m){var g=m.gl;this.totalCount!==0&&g.drawArraysInstanced(g.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}},{key:"reallocate",value:function(y){this.totalCount=y,y>this.bufferCapacity&&(this.bufferCapacity=Math.max(y,Math.ceil(this.bufferCapacity*1.5)||10),se(f,"reallocate",this,3)([this.bufferCapacity]))}}])})(He);return new h(a,n,t)}function oi(a){var n,t,e,r,i;return{paths:a.paths,headLengthRatio:(n=a.headLengthRatio)!==null&&n!==void 0?n:0,tailLengthRatio:(t=a.tailLengthRatio)!==null&&t!==void 0?t:0,fontSizeMode:(e=a.fontSizeMode)!==null&&e!==void 0?e:"fixed",minVisibilityThreshold:(r=a.minVisibilityThreshold)!==null&&r!==void 0?r:.7,fullVisibilityThreshold:(i=a.fullVisibilityThreshold)!==null&&i!==void 0?i:.8}}var pu=Te.fontSize,mu=17/64;function yu(a){var n=a.paths,t=a.hasBorder,e=t===void 0?!1:t,r=a.fontSizeMode,i=r===void 0?"fixed":r,o=a.minVisibilityThreshold,s=o===void 0?.5:o,l=a.fullVisibilityThreshold,u=l===void 0?.6:l,d=i==="scaled",h=n.some(function(m){return m.hasSharpCorners}),c=We(),f=ye([].concat(V(n),[c])),v=Nt(f),y=`#version 300 es

// ============================================================================
// Attributes - Per Character (Instanced)
// ============================================================================

// Edge geometry: indices for texture lookup
// Edge data (source/target node indices, thickness, head/tail ratios) is fetched from edge data texture
// Edge path attributes (curvature, etc.) are fetched from edge attribute texture
in float a_edgeIndex;       // Index into edge data texture
in float a_edgeAttrIndex;   // Index into edge attribute texture (for curvature, etc.)
in float a_baseFontSize;    // Base font size in pixels (per-label)

// Character metrics (in glyph units = atlas font size pixels)
in vec4 a_charMetrics;      // (charTextOffset, charAdvance, totalTextWidth, positionMode)
in vec4 a_charDims;         // (charSize.x, charSize.y, charOffset.x, charOffset.y)

// Atlas texture coordinates
in vec4 a_texCoords;        // (x, y, width, height) in atlas pixels

// Label parameters
in vec2 a_labelParams;      // (margin, unused)

// Appearance
in vec4 a_color;            // Character color (RGBA, normalized)
`.concat(e?"in vec4 a_borderColor;      // Border color (RGBA, normalized)":"",`

// ============================================================================
// Attributes - Per Vertex (Constant)
// ============================================================================

in vec2 a_quadCorner;       // Quad corner: (0,0), (1,0), (0,1), (1,1)

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;    // Required by node shape SDFs
// u_sdfBufferPixels kept for ABI compatibility but unused in shader
uniform float u_sdfBufferPixels;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture; // Shared texture with node position/size/shape data
uniform int u_nodeDataTextureWidth;  // Width of 2D node data texture for coordinate calculation
uniform sampler2D u_edgeDataTexture; // Shared texture with edge data
uniform int u_edgeDataTextureWidth;  // Width of 2D edge data texture for coordinate calculation
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
`).concat(d?"uniform float u_zoomSizeRatio;  // Zoom-based size ratio from zoomToSizeRatioFunction":"",`

// Edge path attribute texture uniforms (for curvature and other path attributes)
`).concat(v.uniformDeclarations,`

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
`).concat(e?"out vec4 v_borderColor;":"",`
out float v_edgeFade;  // 0 = fully visible, 1 = fully faded (outside body)
out float v_alphaModifier;  // 0-1 based on label visibility ratio
out float v_fontScale;  // Ratio of rendered font size to atlas font size
`).concat(e?"out float v_positionMode;  // Position mode for conditional border (0=over needs border)":"",`

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float FADE_WIDTH_PIXELS = 15.0;  // Width of fade gradient in pixels
const float ATLAS_FONT_SIZE = `).concat(ae(pu),`;  // Base font size used in SDF atlas
const float VERTICAL_CENTER_RATIO = `).concat(ae(mu),`;  // Baseline to visual center ratio

// ============================================================================
// Path Attribute Variables (set in main, used by path functions)
// ============================================================================
// Path attributes are fetched from the edge attribute texture and stored in
// variables with v_ prefix (e.g., v_curvature) for path functions to access.
`).concat(v.vertexVaryingDeclarations.replace(/out /g,""),`

// Node size variables (set in main, used by some path functions like loops).
// These mirror the v_sourceNodeSize / v_targetNodeSize varyings in generator.ts,
// but are plain floats here since the label shader is vertex-only.
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
`).concat(ri({paths:n,minVisibilityThreshold:s,fullVisibilityThreshold:u}),`

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Fetch edge data from edge texture (2 texels per edge)
  // -------------------------------------------------------------------------
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, extremityIds
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  // edgeData0.w is reserved
  float headLengthRatio = edgeData1.x;
  float tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);  // Path type for multi-path support
  float baseFontSize = a_baseFontSize;

  // -------------------------------------------------------------------------
  // Fetch path attributes from edge attribute texture
  // -------------------------------------------------------------------------
  // Note: The fetch code uses 'edgeIdx' variable, so we set it to the attribute texture index
  {
    int edgeIdx = int(a_edgeAttrIndex);  // Use attribute texture index for path attributes
`).concat(v.fetchCode,`
`).concat(v.varyingAssignments,`
  }

  // -------------------------------------------------------------------------
  // Fetch node data from node texture (geometry texel + rotation-flags texel)
  // -------------------------------------------------------------------------
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcNodeData.xy;
  vec2 target = tgtNodeData.xy;
  float sourceSize = srcNodeData.z;
  float targetSize = tgtNodeData.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;
  float charTextOffset = a_charMetrics.x;
  float charAdvance = a_charMetrics.y;
  float totalTextWidth = a_charMetrics.z;
  float positionMode = a_charMetrics.w;
  vec2 charSize = a_charDims.xy;
  vec2 charOffset = a_charDims.zw;
  float margin = a_labelParams.x;

  // -------------------------------------------------------------------------
  // Compute pixel-to-graph conversion (for fixed font size mode)
  // -------------------------------------------------------------------------
  // This converts screen pixels to graph units such that N pixels on screen
  // becomes N pixels regardless of zoom level.
  // matrixScaleX is how much the matrix scales graph units to clip space
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  // -------------------------------------------------------------------------
  // Step 1: Convert thickness to WebGL units
  // -------------------------------------------------------------------------
  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // -------------------------------------------------------------------------
  // Step 2: Compute body bounds (truncated at node boundaries + extremities)
  // -------------------------------------------------------------------------
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, headLengthRatio, tailLengthRatio
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // -------------------------------------------------------------------------
  // Step 3: Compute font scale and text dimensions
  // -------------------------------------------------------------------------
  // Font size modes:
  // - "fixed": Constant pixel size regardless of zoom, using pixelToGraph conversion
  // - "scaled": Scales with zoom using zoomToSizeRatioFunction
  `).concat(d?`// Scaled mode: font scales with zoom
  float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  // Convert glyph-unit metrics to WebGL units (scales with zoom)
  float textWidthWebGL = totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float charOffsetWebGL = charTextOffset * fontScale * u_correctionRatio / u_sizeRatio;
  float charAdvanceWebGL = charAdvance * fontScale * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: font stays constant in screen pixels
  float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  // Convert glyph-unit metrics to graph units using pixelToGraph (zoom-independent)
  float textWidthWebGL = totalTextWidth * fontScale * pixelToGraph;
  float charOffsetWebGL = charTextOffset * fontScale * pixelToGraph;
  float charAdvanceWebGL = charAdvance * fontScale * pixelToGraph;`,`

  // Font scale varying for fragment shader gamma scaling.
  // Ratio of rendered font size to atlas font size \u2014 used to tighten the
  // anti-aliasing band for large labels so they stay sharp.
  v_fontScale = fontScale;

  // -------------------------------------------------------------------------
  // Step 4: Alpha modifier from how much of the label fits in the body
  // -------------------------------------------------------------------------
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);

  // -------------------------------------------------------------------------
  // Step 5: Compute character center offset (truncation check moved to after curvature adjustment)
  // -------------------------------------------------------------------------
  // Character center position relative to label center (on centerline, before curvature adjustment)
  float charCenterOffset = charOffsetWebGL + charAdvanceWebGL * 0.5 - textWidthWebGL * 0.5;

  // -------------------------------------------------------------------------
  // Step 6: Compute perpendicular offset based on position mode
  // -------------------------------------------------------------------------
  // Position modes: 0=over, 1=above, 2=below, 3=auto
  // Needed early for curvature-adaptive character spacing in Step 7
  float halfThickness = webGLThickness * 0.5;
  `).concat(d?`// Scaled mode: margin and text height scale with zoom (same factor as font)
  float marginWebGL = margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: margin and text height stay constant in screen pixels
  float marginWebGL = margin * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;`,`
  float perpOffset = computeEdgeLabelPerpOffset(
    positionMode, halfThickness, marginWebGL, halfTextHeight, source, target, u_matrix
  );

  // -------------------------------------------------------------------------
  // Step 7: Position character on path using offset path traversal
  // -------------------------------------------------------------------------
  // Body center in arc distance
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;

  // For "over" mode (perpOffset = 0), use simple centerline placement
  // For above/below modes, walk along the offset path to find correct position
  float charT;

  if (perpOffset == 0.0) {
    // Simple case: place on centerline
    float charArcDist = bodyCenterDist + charCenterOffset;
    charT = queryPathTAtDistance(pathId, charArcDist, source, target);
  } else {
    // Offset path traversal: walk along the offset curve to find character position
    // This ensures even character spacing regardless of curvature

    // Start from body center on offset path
    float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);

    `).concat(h?`// -----------------------------------------------------------------------
    // Corner skip setup for step/taxi edges with above/below labels
    // -----------------------------------------------------------------------
    // At concave corners (inner side of the bend), characters would bunch up
    // because the offset path has near-zero arc length. We detect corner
    // crossings during the offset path traversal and add skip distance.

    // Get corner t values and concavity
    vec2 cornerTs = queryGetCornerTs(pathId, source, target);
    vec2 concavity = queryGetCornerConcavity(pathId, source, target, perpOffset);

    // Skip distance in graph units, proportional to on-screen font size
    // For fixed mode: use pixelToGraph so gap stays constant regardless of zoom
    // For scaled mode: use the same conversion as text width
    `.concat(d?"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;":"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * pixelToGraph;",`

    // Corner t values for detecting crossings during traversal
    float corner1T = cornerTs.x;
    float corner2T = cornerTs.y;
    bool corner1IsConcave = concavity.x > 0.5;
    bool corner2IsConcave = concavity.y > 0.5;`):"",`

    // Target distance along offset path from center
    float targetOffsetDist = abs(charCenterOffset);

    // Handle center character (charCenterOffset \u2248 0) - no search needed
    if (targetOffsetDist < 0.0001) {
      charT = centerT;
    } else {
      vec2 centerPos = queryPathPosition(pathId, centerT, source, target);
      vec2 centerNormal = queryPathNormal(pathId, centerT, source, target);
      vec2 offsetCenter = centerPos + centerNormal * perpOffset;

      float searchDir = charCenterOffset > 0.0 ? 1.0 : -1.0;

      // Search bounds (t values for body start and end)
      float tBodyStart = queryPathTAtDistance(pathId, bodyStartDist, source, target);
      float tBodyEnd = queryPathTAtDistance(pathId, bodyEndDist, source, target);

      // Walk along offset path to find character position
      float accumDist = 0.0;
      vec2 prevOffsetPos = offsetCenter;
      float prevT = centerT;
      float foundT = centerT;

      // Search range depends on direction
      float tSearchEnd = searchDir > 0.0 ? tBodyEnd : tBodyStart;

      `).concat(h?`// Track which concave corners we've crossed to add skip distance
      bool crossedCorner1 = false;
      bool crossedCorner2 = false;
      float effectiveTargetDist = targetOffsetDist;`:"",`

      const int STEPS = 32;
      for (int i = 1; i <= STEPS; i++) {
        // Step along centerline t, from center toward target
        float stepT = centerT + searchDir * float(i) * abs(tSearchEnd - centerT) / float(STEPS);

        `).concat(h?`// Check for concave corner crossings and add skip distance
        // Corner 1 crossing check
        if (corner1IsConcave && !crossedCorner1) {
          bool crossingCorner1 = (searchDir > 0.0)
            ? (prevT < corner1T && stepT >= corner1T)
            : (prevT > corner1T && stepT <= corner1T);
          if (crossingCorner1) {
            crossedCorner1 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }

        // Corner 2 crossing check
        if (corner2IsConcave && !crossedCorner2) {
          bool crossingCorner2 = (searchDir > 0.0)
            ? (prevT < corner2T && stepT >= corner2T)
            : (prevT > corner2T && stepT <= corner2T);
          if (crossingCorner2) {
            crossedCorner2 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }`:"",`

        // Compute offset position at this t
        vec2 stepPos = queryPathPosition(pathId, stepT, source, target);
        vec2 stepNormal = queryPathNormal(pathId, stepT, source, target);
        vec2 offsetPos = stepPos + stepNormal * perpOffset;

        // Distance along offset path
        float segDist = length(offsetPos - prevOffsetPos);

        `).concat(h?`if (accumDist + segDist >= effectiveTargetDist) {
          // Interpolate within segment to find exact t
          float remaining = effectiveTargetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`:`if (accumDist + segDist >= targetOffsetDist) {
          // Interpolate within segment to find exact t
          float remaining = targetOffsetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`,`

        accumDist += segDist;
        prevOffsetPos = offsetPos;
        prevT = stepT;
        // Update foundT to last valid position in case loop exhausts without finding target
        foundT = stepT;
      }

      charT = foundT;
    }
  }

  // Get position and tangent at final character position
  vec2 pathPos = queryPathPosition(pathId, charT, source, target);
  vec2 tangent = queryPathTangent(pathId, charT, source, target);

  // Compute perpendicular direction (90 degrees from tangent)
  vec2 perpDir = vec2(-tangent.y, tangent.x);

  // Apply perpendicular offset to path position
  vec2 offsetPathPos = pathPos + perpDir * perpOffset;

  // -------------------------------------------------------------------------
  // Step 8: Build character quad
  // -------------------------------------------------------------------------
  // Character size in screen pixels
  vec2 charSizePixels = charSize * fontScale;

  // Character offset from origin to the atlas region's top-left corner.
  // bearingX/bearingY already include the SDF buffer.
  vec2 charOffsetPixels = charOffset * fontScale;

  // The character's local X offset from pathPos (which is at character center)
  float charLocalX = -charAdvance * 0.5 * fontScale;

  // Build quad position:
  // - Start at character origin (charLocalX on X axis, 0 on Y axis = baseline)
  // - Add bearing offset to get to atlas region corner
  // - Add quad corner * size to get vertex position
  vec2 quadPos;
  quadPos.x = charLocalX + charOffsetPixels.x + a_quadCorner.x * charSizePixels.x;
  // charOffset.y = -bearingY (negated), so -charOffsetPixels.y = bearingY * fontScale
  // (distance from baseline to atlas region top, positive = upward)
  // Quad corner (0,0) = bottom-left, (1,1) = top-right
  quadPos.y = -charOffsetPixels.y - charSizePixels.y * (1.0 - a_quadCorner.y);

  // Center vertically on the path by offsetting by half the visual text height
  // VERTICAL_CENTER_RATIO is the distance from baseline to visual center as a ratio of atlas font size
  float verticalCenterOffset = VERTICAL_CENTER_RATIO * ATLAS_FONT_SIZE * fontScale;
  quadPos.y -= verticalCenterOffset;

  // -------------------------------------------------------------------------
  // Step 9: Rotate quad to align with tangent
  // -------------------------------------------------------------------------
  // Rotation matrix from tangent
  // tangent = (cos(angle), sin(angle)), so we can build rotation directly
  mat2 rotation = mat2(tangent.x, tangent.y, -tangent.y, tangent.x);

  // Convert pixel offset to WebGL units for rotation
  `).concat(d?"vec2 quadPosWebGL = quadPos * u_correctionRatio / u_sizeRatio; // Scaled mode":"vec2 quadPosWebGL = quadPos * pixelToGraph; // Fixed mode: use pixelToGraph for zoom-independent size",`

  // Rotate around character center on path
  vec2 rotatedOffset = rotation * quadPosWebGL;

  // Final position in graph space (using offset path position for above/below modes)
  vec2 worldPos = offsetPathPos + rotatedOffset;

  // -------------------------------------------------------------------------
  // Step 10: Transform to clip space
  // -------------------------------------------------------------------------
  vec3 clipPos = u_matrix * vec3(worldPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 11: Texture coordinates
  // -------------------------------------------------------------------------
  // Flip Y for texture coordinates (texture Y goes down, quad Y goes up)
  vec2 texCorner = vec2(a_quadCorner.x, 1.0 - a_quadCorner.y);
  v_texCoord = (a_texCoords.xy + texCorner * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 12: Pass color, border color, and alpha modifier
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
`).concat(e?`  v_borderColor = a_borderColor;
  v_borderColor.a *= bias;
  v_positionMode = positionMode;`:"",`
  v_alphaModifier = alphaModifier;

  // -------------------------------------------------------------------------
  // Step 13: Compute edge fade for soft truncation
  // -------------------------------------------------------------------------
  // Convert fade width from pixels to WebGL units
  `).concat(d?"float fadeWidthWebGL = FADE_WIDTH_PIXELS * u_correctionRatio / u_sizeRatio;":"float fadeWidthWebGL = FADE_WIDTH_PIXELS * pixelToGraph;",`

  // Compute the arc position of THIS VERTEX (not just character center)
  // The quad extends from charCenter - advance/2 to charCenter + advance/2
  // a_quadCorner.x is 0 for left edge, 1 for right edge
  float vertexLocalOffset = (a_quadCorner.x - 0.5) * charAdvanceWebGL;
  float vertexArcOffset = charCenterOffset + vertexLocalOffset;

  // Compute distance from body edges (positive = inside body, negative = outside)
  float halfBody = bodyLength * 0.5;
  float distFromStart = vertexArcOffset + halfBody;  // Distance from body start edge
  float distFromEnd = halfBody - vertexArcOffset;    // Distance from body end edge
  float distFromEdge = min(distFromStart, distFromEnd);

  // Compute fade: 0 = fully visible (deep inside body), 1 = fully faded (at body edge)
  // Fade goes from 0 (at 2*fadeWidth inside) to 1 (at body edge)
  // This ensures text is fully transparent before reaching extremities
  v_edgeFade = 1.0 - smoothstep(0.0, fadeWidthWebGL * 2.0, distFromEdge);
}
`);return y}function bu(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},n=a.hasBorder,t=n===void 0?!1:n,e=`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
`.concat(t?"in vec4 v_borderColor;":"",`
in float v_edgeFade;  // 0 = fully visible, 1 = fully faded
in float v_alphaModifier;  // 0-1 based on label visibility ratio
in float v_fontScale;  // Ratio of rendered font size to atlas font size
`).concat(t?"in float v_positionMode;  // Position mode (0=over, 1=above, 2=below, 3=auto)":"",`

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;
`).concat(t?"uniform float u_borderWidth;  // Border width in SDF units (normalized)":"",`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Edge labels are not pickable - discard all fragments in picking mode
    discard;
  #else
  // SDF stores normalized distance: 0.5 = on edge, >0.5 = inside glyph
  float sdfValue = texture(u_atlas, v_texCoord).a;

  // Edge threshold accounting for SDF buffer padding
  float edge = 1.0 - u_sdfBuffer;

  // Scale gamma inversely with font scale so small labels get a wider AA band
  // (smoother) and large labels get a tighter band (sharper).
  float aaWidth = u_gamma / (u_pixelRatio * v_fontScale);

  // Apply edge fade for soft truncation at body boundaries
  // Also apply visibility-based alpha modifier for short edge labels
  float edgeAlpha = (1.0 - v_edgeFade) * v_alphaModifier;

`).concat(t?`  // Fill alpha: fully opaque inside the glyph
  float fillAlpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Only apply border for "over" position mode (v_positionMode == 0.0)
  // Labels positioned above/below/auto don't overlap the edge line and don't need borders
  if (v_positionMode < 0.5) {
    // Border rendering: compute alpha for both fill and border regions
    // Border extends from (edge - borderWidth) to edge
    float borderEdge = edge - u_borderWidth;

    // Border alpha: opaque in the border region (between borderEdge and edge)
    float borderAlpha = smoothstep(borderEdge - aaWidth, borderEdge + aaWidth, sdfValue);

    // Composite: fill on top of border
    // Border is visible where borderAlpha > 0 but fillAlpha < 1
    vec3 borderColorPremult = v_borderColor.rgb * v_borderColor.a * borderAlpha * edgeAlpha;
    vec3 fillColorPremult = v_color.rgb * v_color.a * fillAlpha * edgeAlpha;

    // Blend fill over border (fill replaces border where fill is opaque)
    float finalBorderAlpha = borderAlpha * (1.0 - fillAlpha);
    vec3 finalColor = fillColorPremult + v_borderColor.rgb * v_borderColor.a * finalBorderAlpha * edgeAlpha;
    float finalAlpha = (v_color.a * fillAlpha + v_borderColor.a * finalBorderAlpha) * edgeAlpha;

    fragColor = vec4(finalColor, finalAlpha);
  } else {
    // No border for above/below/auto positions - simple text rendering
    float finalAlpha = v_color.a * fillAlpha * edgeAlpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  }`:`  // Smooth transition from transparent to opaque at glyph edge
  float alpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Premultiplied alpha output
  float finalAlpha = v_color.a * alpha * edgeAlpha;
  fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);`,`
  #endif
}
`);return e}function xu(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"fixed",e=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_sdfBufferPixels","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"];t==="scaled"&&e.push("u_zoomSizeRatio"),n&&e.push("u_borderWidth");var r=z(a),i;try{for(r.s();!(i=r.n()).done;){var o=i.value,s=z(o.uniforms),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;e.includes(u.name)||e.push(u.name)}}catch(d){s.e(d)}finally{s.f()}}}catch(d){r.e(d)}finally{r.f()}return e}function _u(a){var n=a.hasBorder,t=n===void 0?!1:n,e=a.fontSizeMode,r=e===void 0?"fixed":e;return{vertexShader:yu(a),fragmentShader:bu({hasBorder:t}),uniforms:xu(a.paths,t,r)}}var Tu=new Map;function Su(a){switch(a){case"over":return 0;case"above":return 1;case"below":return 2;case"auto":return 3;default:return 0}}function Eu(a,n,t,e){var r=e.color,i=e.margin,o=e.textBorder,s=oi(e),l=s.paths,u=s.fontSizeMode,d=s.minVisibilityThreshold,h=s.fullVisibilityThreshold,c=!!o,f=_u({paths:l,hasBorder:c,fontSizeMode:u,minVisibilityThreshold:d,fullVisibilityThreshold:h}),v=(function(y){function m(g,p,b){var x;q(this,m),x=te(this,m,[g,p,b]),S(x,"atlasTexture",null),S(x,"atlasNeedsUpdate",!1),S(x,"labelGlyphCache",new Map),S(x,"edgeAttributeTexture",null);var _=We();if(x.attributeLayout=ye([].concat(V(l),[_])),x.attrDescriptors=An([].concat(V(l),[_]),x.attributeLayout),x.edgeAttributeTexture=new En(g,x.attributeLayout),x.packedAttributeData=new Float32Array(x.attributeLayout.floatsPerItem),x.atlasManager=new Ue,x.gamma=.025,x.sdfBuffer=Te.cutoff,x.atlasTexture=g.createTexture(),!x.atlasTexture)throw new Error("EdgeLabelProgram: failed to create atlas texture");g.bindTexture(g.TEXTURE_2D,x.atlasTexture),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR),g.bindTexture(g.TEXTURE_2D,null),x.atlasManager.on(Ue.ATLAS_UPDATED_EVENT,function(){x.atlasNeedsUpdate=!0,setTimeout(function(){return x.renderer.refresh()},0)});var T={family:"sans-serif",weight:"normal",style:"normal"};return x.defaultFontKey=x.atlasManager.registerFont(T),x}return ne(m,y),Y(m,[{key:"getDefinition",value:function(){var p=WebGL2RenderingContext,b=p.FLOAT,x=p.UNSIGNED_BYTE,_=p.TRIANGLE_STRIP,T=new Set,A=[],E=z(l),R;try{for(E.s();!(R=E.n()).done;){var L=R.value,k=z(L.attributes),w;try{for(k.s();!(w=k.n()).done;){var F=w.value,C=F.name.startsWith("a_")?F.name:"a_".concat(F.name);T.has(C)||(T.add(C),A.push({name:C,size:F.size,type:F.type}))}}catch(N){k.e(N)}finally{k.f()}}}catch(N){E.e(N)}finally{E.f()}return{VERTICES:4,VERTEX_SHADER_SOURCE:f.vertexShader,FRAGMENT_SHADER_SOURCE:f.fragmentShader,METHOD:_,UNIFORMS:f.uniforms,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:b},{name:"a_edgeAttrIndex",size:1,type:b},{name:"a_baseFontSize",size:1,type:b},{name:"a_charMetrics",size:4,type:b},{name:"a_charDims",size:4,type:b},{name:"a_texCoords",size:4,type:b},{name:"a_labelParams",size:2,type:b},{name:"a_color",size:4,type:x,normalized:!0}].concat(V(c?[{name:"a_borderColor",size:4,type:x,normalized:!0}]:[]),V(A.filter(function(N){return!["a_curvature","curvature"].includes(N.name)}))),CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:b}],CONSTANT_DATA:[[0,0],[1,0],[0,1],[1,1]]}}},{key:"prepareLabelGlyphs",value:function(p,b){if(b.hidden||!b.text){this.labelGlyphCache.delete(p);return}var x=b.text,_=b.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(x,_);var T=[],A=[],E=0,R=z(x),L;try{for(R.s();!(L=R.n()).done;){var k=L.value,w=k.codePointAt(0);if(w===void 0){T.push(void 0),A.push(E);continue}var F=this.atlasManager.getGlyph(w,_);T.push(F),A.push(E),F&&(E+=F.advance)}}catch(C){R.e(C)}finally{R.f()}this.labelGlyphCache.set(p,{glyphs:T,xOffsets:A,totalWidth:E})}},{key:"processCharacter",value:function(p,b,x,_){var T,A,E,R=this.floats,L=this.STRIDE,k=p*L,w=this.labelGlyphCache.get(b.parentKey);if(!w||!w.glyphs[_]){for(var F=0;F<L;F++)R[k+F]=0;return}var C=w.glyphs[_],N=w.xOffsets[_],G=m.labelColor,M=G&&K(G)==="object"&&"color"in G&&G.color?G.color:b.color,P=pe(M),D=k;R[D++]=b.edgeIndex,R[D++]=(T=(A=this.edgeAttributeTexture)===null||A===void 0?void 0:A.getIndex(b.parentKey))!==null&&T!==void 0?T:0,R[D++]=b.size,R[D++]=N,R[D++]=C.advance,R[D++]=w.totalWidth,R[D++]=Su(b.position),R[D++]=C.atlasWidth,R[D++]=C.atlasHeight,R[D++]=C.bearingX,R[D++]=-C.bearingY,R[D++]=C.atlasX,R[D++]=C.atlasY,R[D++]=C.atlasWidth,R[D++]=C.atlasHeight;var I=(E=m.labelMargin)!==null&&E!==void 0?E:b.margin;if(R[D++]=I,R[D++]=0,R[D++]=P,c&&o){var H;typeof o.color=="string"?H=o.color:H=o.color.color||"#ffffff",R[D++]=pe(H)}var O=new Set,$=z(l),X;try{for($.s();!(X=$.n()).done;){var Z=X.value,re=z(Z.attributes),ce;try{for(re.s();!(ce=re.n()).done;){var be=ce.value,mt=be.name.startsWith("a_")?be.name.slice(2):be.name;if(mt!=="curvature"&&!O.has(mt)){O.add(mt);for(var Ut=0;Ut<be.size;Ut++)R[D++]=0}}}catch(qe){re.e(qe)}finally{re.f()}}}catch(qe){$.e(qe)}finally{$.f()}}},{key:"processEdgeLabel",value:function(p,b,x){if(this.prepareLabelGlyphs(p,x),this.edgeAttributeTexture&&!x.hidden&&x.text){this.edgeAttributeTexture.allocate(p);var _=this.packedAttributeData;Dn(this.attrDescriptors,x.edgeAttributes,_,"",Tu,0),this.edgeAttributeTexture.updateAllAttributes(p,_)}return se(m,"processLabel",this,3)([p,b,x])}},{key:"updateAtlasTexture",value:function(){if(this.atlasNeedsUpdate){var p=this.normalProgram.gl,b=this.atlasManager.getTextures();if(b.length!==0){var x=b[0];p.bindTexture(p.TEXTURE_2D,this.atlasTexture),p.texImage2D(p.TEXTURE_2D,0,p.RGBA,x.width,x.height,0,p.RGBA,p.UNSIGNED_BYTE,x.data),p.bindTexture(p.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}}}},{key:"setUniforms",value:function(p,b){var x=b.gl,_=b.uniformLocations,T=this.atlasManager.getTextures(),A=T.length>0?[T[0].width,T[0].height]:[1,1];if(x.uniformMatrix3fv(_.u_matrix,!1,p.matrix),x.uniform1f(_.u_sizeRatio,p.sizeRatio),x.uniform1f(_.u_correctionRatio,p.correctionRatio),x.uniform1f(_.u_pixelRatio,p.pixelRatio),x.uniform1f(_.u_cameraAngle,p.cameraAngle),x.uniform1f(_.u_sdfBufferPixels,Te.buffer),x.uniform2f(_.u_resolution,p.width,p.height),x.uniform2f(_.u_atlasSize,A[0],A[1]),x.uniform1f(_.u_gamma,this.gamma),x.uniform1f(_.u_sdfBuffer,this.sdfBuffer),x.activeTexture(x.TEXTURE0),x.bindTexture(x.TEXTURE_2D,this.atlasTexture),x.uniform1i(_.u_atlas,0),_.u_nodeDataTexture!==void 0&&x.uniform1i(_.u_nodeDataTexture,p.nodeDataTextureUnit),_.u_nodeDataTextureWidth!==void 0&&x.uniform1i(_.u_nodeDataTextureWidth,p.nodeDataTextureWidth),_.u_edgeDataTexture!==void 0&&x.uniform1i(_.u_edgeDataTexture,p.edgeDataTextureUnit),_.u_edgeDataTextureWidth!==void 0&&x.uniform1i(_.u_edgeDataTextureWidth,p.edgeDataTextureWidth),_.u_edgeFrameTexture!==void 0&&x.uniform1i(_.u_edgeFrameTexture,p.edgeFrameTextureUnit),_.u_edgeFrameTextureWidth!==void 0&&x.uniform1i(_.u_edgeFrameTextureWidth,p.edgeFrameTextureWidth),c&&o&&_.u_borderWidth!==void 0){var E=o.width/Te.buffer*this.sdfBuffer;x.uniform1f(_.u_borderWidth,E)}if(this.edgeAttributeTexture&&_.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(Ie),x.uniform1i(_.u_edgeAttributeTexture,Ie),x.uniform1i(_.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),x.uniform1i(_.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem())),u==="scaled"&&_.u_zoomSizeRatio!==void 0){var R=this.renderer.getSetting("zoomToSizeRatioFunction"),L=1/R(p.zoomRatio);x.uniform1f(_.u_zoomSizeRatio,L)}}},{key:"renderProgram",value:function(p,b){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),this.edgeAttributeTexture&&this.edgeAttributeTexture.upload(),se(m,"renderProgram",this,3)([p,b])}},{key:"registerFont",value:function(p){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"normal",x=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"normal";return this.atlasManager.registerFont({family:p,weight:b,style:x})}},{key:"getAtlasManager",value:function(){return this.atlasManager}},{key:"ensureGlyphsReady",value:function(p,b){var x=b||this.defaultFontKey,_=z(p),T;try{for(_.s();!(T=_.n()).done;){var A=T.value;this.atlasManager.ensureGlyphs(A,x)}}catch(E){_.e(E)}finally{_.f()}this.atlasManager.flush()}},{key:"measureLabelAtlasWidth",value:function(p,b){var x=b||this.defaultFontKey;this.atlasManager.ensureGlyphs(p,x),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();var _=0,T=z(p),A;try{for(T.s();!(A=T.n()).done;){var E=A.value,R=E.codePointAt(0);if(R!==void 0){var L=this.atlasManager.getGlyph(R,x);L&&(_+=L.advance)}}}catch(k){T.e(k)}finally{T.f()}return _}},{key:"measureLabel",value:function(p,b,x){var _=this.measureLabelAtlasWidth(p,x),T=b/Te.fontSize;return{width:_*T,height:b,textHeight:b}}},{key:"kill",value:function(){var p=this.normalProgram.gl;this.atlasTexture&&(p.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),se(m,"kill",this,3)([])}}])})(Zr);return S(v,"labelColor",r),S(v,"labelMargin",i),new v(a,n,t)}function Au(){var a=`
// No extremity - always returns positive (outside)
float extremity_none(vec2 uv, float lengthRatio, float widthRatio) {
  return 1.0;
}
`;return{name:"none",glsl:a,length:0,widthFactor:1,margin:0,uniforms:[],attributes:[]}}function si(a,n,t,e,r,i,o){var s,l,u=ni(e),d=u.paths,h=u.layers,c=u.defaultHead,f=u.defaultTail,v=[Au()].concat(V(u.extremities)),y={},m={};d.forEach(function(F,C){return y[F.name]=C}),v.forEach(function(F,C){return m[F.name]=C});var g=(s=m[c])!==null&&s!==void 0?s:0,p=(l=m[f])!==null&&l!==void 0?l:0,b=null,x=ye([].concat(V(d),V(h))),_=(function(F){function C(N,G,M){var P;q(this,C),b||(b=zr({paths:d,extremities:v,layers:h,antialias:r})),P=te(this,C,[N,G,M]),S(P,"layerLifecycles",new Map),S(P,"needsShaderRegeneration",!1),S(P,"edgeAttributeTexture",null),S(P,"layout",x),S(P,"attrDescriptors",[]),S(P,"lifecycleIndexOffset",d.length),P._pickingBuffer=G,P.edgeAttributeTexture=new En(N,P.layout),P.packedAttributeData=new Float32Array(P.layout.floatsPerItem),h.forEach(function(I,H){if(I.lifecycle){var O={gl:N,renderer:{refresh:function(){return M.refresh()}},getUniformLocation:function(X){return N.getUniformLocation(P.normalProgram.program,X)},requestShaderRegeneration:function(){P.needsShaderRegeneration=!0},requestRefresh:function(){M.refresh()}};P.layerLifecycles.set(H,I.lifecycle(O))}}),P.layerLifecycles.forEach(function(I){var H;return(H=I.init)===null||H===void 0?void 0:H.call(I)});var D=new Map;return P.layerLifecycles.forEach(function(I,H){I.getAttributeData&&D.set(d.length+H,I)}),P.attrDescriptors=An([].concat(V(d),V(h)),P.layout,D),P}return ne(C,F),Y(C,[{key:"getAttributeTexture",value:function(){return this.edgeAttributeTexture}},{key:"resolveEdgeIds",value:function(G,M,P){var D=G,I=0,H=g,O=p,$=M?D.selfLoopPath:P&&D.parallelPath?D.parallelPath:D.path;$&&y[$]!==void 0&&(I=y[$]),D.head&&D.head!=="none"&&m[D.head]!==void 0&&(H=m[D.head]),D.tail&&D.tail!=="none"&&m[D.tail]!==void 0&&(O=m[D.tail]);var X=v[H],Z=v[O];return{pathId:I,headId:H,tailId:O,headLengthRatio:De(X.length)?0:X.length,tailLengthRatio:De(Z.length)?0:Z.length}}},{key:"getDefinition",value:function(){var G=WebGL2RenderingContext,M=G.TRIANGLE_STRIP,P=M,D=b;return{VERTICES:D.verticesPerEdge,VERTEX_SHADER_SOURCE:D.vertexShader,FRAGMENT_SHADER_SOURCE:D.fragmentShader,METHOD:P,UNIFORMS:D.uniforms,ATTRIBUTES:D.attributes,CONSTANT_ATTRIBUTES:D.constantAttributes,CONSTANT_DATA:D.constantData}}},{key:"maybeRegenerateShaders",value:function(){var G=this;if(this.needsShaderRegeneration){this.needsShaderRegeneration=!1;var M=h.map(function(X,Z){var re=G.layerLifecycles.get(Z);return re!=null&&re.regenerate?re.regenerate():X});b=zr({paths:d,extremities:v,layers:M,antialias:this.renderer.getSetting("antialiasEdges")});var P=this.normalProgram.gl,D=this.normalProgram,I=D.program,H=D.buffer,O=D.vertexShader,$=D.fragmentShader;P.deleteProgram(I),P.deleteBuffer(H),P.deleteShader(O),P.deleteShader($),this.normalProgram=this.getProgramInfo("normal",P,b.vertexShader,b.fragmentShader,this._pickingBuffer)}}},{key:"process",value:function(G,M,P,D,I,H){var O=M*this.STRIDE;if(I.visibility==="hidden"||P.visibility==="hidden"||D.visibility==="hidden"){for(var $=O+this.STRIDE;O<$;O++)this.floats[O]=0;this.floats[M*this.STRIDE]=qr;return}this.processVisibleItem(at(G),O,P,D,I,H)}},{key:"processVisibleItem",value:function(G,M,P,D,I,H){var O,$=this.floats,X=this.ints;$[M++]=H,$[M++]=pe(I.color),X[M++]=G,$[M++]=(O=I.opacity)!==null&&O!==void 0?O:1;var Z=this.packedAttributeData;Dn(this.attrDescriptors,I,Z,I.color,this.layerLifecycles,this.lifecycleIndexOffset),this.edgeAttributeTexture.updateAllAttributesAtRow(H,Z)}},{key:"setUniforms",value:function(G,M){var P=this,D=M.gl,I=M.uniformLocations;I.u_matrix&&D.uniformMatrix3fv(I.u_matrix,!1,G.matrix),I.u_sizeRatio&&D.uniform1f(I.u_sizeRatio,G.sizeRatio),I.u_correctionRatio&&D.uniform1f(I.u_correctionRatio,G.correctionRatio),I.u_zoomRatio&&D.uniform1f(I.u_zoomRatio,G.zoomRatio),I.u_pixelRatio&&D.uniform1f(I.u_pixelRatio,G.pixelRatio),I.u_cameraAngle&&D.uniform1f(I.u_cameraAngle,G.cameraAngle),I.u_feather&&D.uniform1f(I.u_feather,G.antiAliasingFeather),I.u_minEdgeThickness&&D.uniform1f(I.u_minEdgeThickness,G.minEdgeThickness),I.u_pickingPadding&&D.uniform1f(I.u_pickingPadding,G.edgePickingPadding),I.u_nodeDataTexture&&D.uniform1i(I.u_nodeDataTexture,G.nodeDataTextureUnit),I.u_nodeDataTextureWidth&&D.uniform1i(I.u_nodeDataTextureWidth,G.nodeDataTextureWidth),I.u_edgeDataTexture&&D.uniform1i(I.u_edgeDataTexture,G.edgeDataTextureUnit),I.u_edgeDataTextureWidth&&D.uniform1i(I.u_edgeDataTextureWidth,G.edgeDataTextureWidth),I.u_edgeFrameTexture&&D.uniform1i(I.u_edgeFrameTexture,G.edgeFrameTextureUnit),I.u_edgeFrameTextureWidth&&D.uniform1i(I.u_edgeFrameTextureWidth,G.edgeFrameTextureWidth),this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&(this.edgeAttributeTexture.bind(Ie),I.u_edgeAttributeTexture&&D.uniform1i(I.u_edgeAttributeTexture,Ie),I.u_edgeAttributeTextureWidth&&D.uniform1i(I.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),I.u_edgeAttributeTexelsPerEdge&&D.uniform1i(I.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()));var H=new Set;d.forEach(function(O){O.uniforms.forEach(function($){H.has($.name)||(H.add($.name),P.setTypedUniform($,M))})}),v.forEach(function(O){O.uniforms.forEach(function($){H.has($.name)||(H.add($.name),P.setTypedUniform($,M))})}),h.forEach(function(O){O.uniforms.forEach(function($){H.has($.name)||(H.add($.name),P.setTypedUniform($,M))})})}},{key:"renderProgram",value:function(G,M){this.maybeRegenerateShaders(),this.layerLifecycles.forEach(function(P){var D;return(D=P.beforeRender)===null||D===void 0?void 0:D.call(P)}),se(C,"renderProgram",this,3)([G,M])}},{key:"uploadAttributeTexture",value:function(){this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&this.edgeAttributeTexture.upload()}},{key:"kill",value:function(){this.layerLifecycles.forEach(function(G){var M;return(M=G.kill)===null||M===void 0?void 0:M.call(G)}),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),se(C,"kill",this,3)([])}}])})(He),T=v[g],A=v[p],E=W({paths:d,headLengthRatio:De(T.length)?0:T.length,tailLengthRatio:De(A.length)?0:A.length},e.label),R=oi(E),L=Eu(a,null,t,E),k=vu(a,n,t,{shaderConfig:R}),w=new su(a,{paths:d,extremities:v,layers:h,nodeShapes:i,nodeLayers:o});return{edgeProgram:new _(a,null,t),labelProgram:L,labelBackgroundProgram:k,framePass:w}}function Du(a){return K(a)==="object"&&"uniforms"in a&&Array.isArray(a.uniforms)}function Ru(a){return K(a)==="object"&&"uniforms"in a&&"attributes"in a&&"glsl"in a}function wu(a){return K(a)==="object"&&"uniforms"in a&&"attributes"in a&&"segments"in a}function Cu(a){return K(a)==="object"&&"uniforms"in a&&"attributes"in a&&"length"in a}function Lu(a){return K(a)==="object"&&"uniforms"in a&&"attributes"in a&&"glsl"in a}function ku(a){return K(a)==="object"&&"glsl"in a&&"name"in a&&!("uniforms"in a)}function Pu(a){return K(a)==="object"&&"glsl"in a&&"name"in a&&!("uniforms"in a)}function Fu(a){return K(a)==="object"&&"glsl"in a&&"name"in a&&!("uniforms"in a)}function Iu(a){if(Du(a))return a;if(ku(a))return{name:a.name,glsl:a.glsl,inradiusFactor:a.inradiusFactor,uniforms:[]};throw new Error("Invalid node shape specification: ".concat(JSON.stringify(a)))}function Gu(a){if(Ru(a))return a;if(gr(a))return{name:a.name,glsl:a.glsl,uniforms:[],attributes:[]};throw new Error("Invalid node layer specification: ".concat(JSON.stringify(a)))}function Nu(a){if(wu(a))return a;if(Pu(a))return{name:a.name,glsl:a.glsl,segments:a.segments,uniforms:[],attributes:[]};throw new Error("Invalid edge path specification: ".concat(JSON.stringify(a)))}function Mu(a){if(Lu(a))return a;if(vr(a))return{name:a.name,glsl:a.glsl,uniforms:[],attributes:[]};throw new Error("Invalid edge layer specification: ".concat(JSON.stringify(a)))}function zu(a){if(Cu(a))return a;if(Fu(a))return{name:a.name,glsl:a.glsl,length:a.length,widthFactor:a.widthFactor,margin:0,uniforms:[],attributes:[]};throw new Error("Invalid edge extremity specification: ".concat(JSON.stringify(a)))}function li(a){var n,t,e=(n=a?.shapes)!==null&&n!==void 0?n:St.shapes,r=(t=a?.layers)!==null&&t!==void 0?t:St.layers,i=e.map(Iu),o=r.map(Gu);if(i.length===0)throw new Error("At least one node shape must be specified.");if(o.length===0)throw new Error("At least one node layer must be specified.");return{shapes:i,layers:o}}function Wu(a){var n,t,e,r=(n=a?.paths)!==null&&n!==void 0?n:rt.paths,i=(t=a?.extremities)!==null&&t!==void 0?t:rt.extremities,o=(e=a?.layers)!==null&&e!==void 0?e:rt.layers,s=r.map(Nu),l=i.map(zu).filter(function(d){return d!==null}),u=o.map(Mu);if(s.length===0)throw new Error("At least one edge path must be specified.");if(u.length===0)throw new Error("At least one edge layer must be specified.");return{paths:s,extremities:l,layers:u}}function ui(a,n){var t={},e=z(a),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;i.variables&&Object.assign(t,i.variables)}}catch(o){e.e(o)}finally{e.f()}return Object.assign(t,n||{}),t}function di(a,n,t,e,r){var i=li(e),o=i.shapes,s=i.layers,l=ui(o,e?.variables),u=Jr(a,n,t,{shapes:o,layers:s,label:e?.label,backdrop:e?.backdrop,labelAttachments:e?.labelAttachments},r);return W(W({},u),{},{variables:l})}function hi(a,n,t,e,r,i){var o=Wu(e),s=o.paths,l=o.extremities,u=o.layers,d=li(i),h=d.shapes,c=d.layers,f=ui(s,e?.variables),v=si(a,n,t,{paths:s,extremities:l,layers:u,defaultHead:e?.defaultHead,defaultTail:e?.defaultTail,label:e?.label},r,h,c);return W(W({},v),{},{variables:f,paths:s})}var Bu=2;function ci(a,n,t){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:Bu,r=n.canvas,i=r.width,o=r.height,s=t.x,l=t.y,u=t.rowHeight,d=t.maxRowWidth,h={},c=[],f=z(a),v;try{for(f.s();!(v=f.n()).done;){var y=v.value,m=y.width+e,g=y.height+e;if(m>i||g>o||s+m>i&&l+u+g>o){c.push(y);continue}s+m>i&&(d=Math.max(d,s),s=0,l+=u,u=g),y.draw(n,s,l),h[y.key]={x:s,y:l,width:y.width,height:y.height},s+=m,u=Math.max(u,g)}}catch(p){f.e(p)}finally{f.f()}return d=Math.max(d,s),{atlas:h,cursor:{x:s,y:l,rowHeight:u,maxRowWidth:d},remaining:c}}function ue(a,n,t,e){var r=Object.defineProperty;try{r({},"",{})}catch{r=0}ue=function(i,o,s,l){function u(d,h){ue(i,d,function(c){return this._invoke(d,h,c)})}o?r?r(i,o,{value:s,enumerable:!l,configurable:!l,writable:!l}):i[o]=s:(u("next",0),u("throw",1),u("return",2))},ue(a,n,t,e)}function de(){var a,n,t=typeof Symbol=="function"?Symbol:{},e=t.iterator||"@@iterator",r=t.toStringTag||"@@toStringTag";function i(f,v,y,m){var g=v&&v.prototype instanceof s?v:s,p=Object.create(g.prototype);return ue(p,"_invoke",(function(b,x,_){var T,A,E,R=0,L=_||[],k=!1,w={p:0,n:0,v:a,a:F,f:F.bind(a,4),d:function(C,N){return T=C,A=0,E=a,w.n=N,o}};function F(C,N){for(A=C,E=N,n=0;!k&&R&&!G&&n<L.length;n++){var G,M=L[n],P=w.p,D=M[2];C>3?(G=D===N)&&(E=M[(A=M[4])?5:(A=3,3)],M[4]=M[5]=a):M[0]<=P&&((G=C<2&&P<M[1])?(A=0,w.v=N,w.n=M[1]):P<D&&(G=C<3||M[0]>N||N>D)&&(M[4]=C,M[5]=N,w.n=D,A=0))}if(G||C>1)return o;throw k=!0,N}return function(C,N,G){if(R>1)throw TypeError("Generator is already running");for(k&&N===1&&F(N,G),A=N,E=G;(n=A<2?a:E)||!k;){T||(A?A<3?(A>1&&(w.n=-1),F(A,E)):w.n=E:w.v=E);try{if(R=2,T){if(A||(C="next"),n=T[C]){if(!(n=n.call(T,E)))throw TypeError("iterator result is not an object");if(!n.done)return n;E=n.value,A<2&&(A=0)}else A===1&&(n=T.return)&&n.call(T),A<2&&(E=TypeError("The iterator does not provide a '"+C+"' method"),A=1);T=a}else if((n=(k=w.n<0)?E:b.call(x,w))!==o)break}catch(M){T=a,A=1,E=M}finally{R=1}}return{value:n,done:k}}})(f,y,m),!0),p}var o={};function s(){}function l(){}function u(){}n=Object.getPrototypeOf;var d=[][e]?n(n([][e]())):(ue(n={},e,function(){return this}),n),h=u.prototype=s.prototype=Object.create(d);function c(f){return Object.setPrototypeOf?Object.setPrototypeOf(f,u):(f.__proto__=u,ue(f,r,"GeneratorFunction")),f.prototype=Object.create(h),f}return l.prototype=u,ue(h,"constructor",u),ue(u,"constructor",l),l.displayName="GeneratorFunction",ue(u,r,"GeneratorFunction"),ue(h),ue(h,r,"Generator"),ue(h,e,function(){return this}),ue(h,"toString",function(){return"[object Generator]"}),(de=function(){return{w:i,m:c}})()}function fi(a,n,t,e,r,i,o){try{var s=a[i](o),l=s.value}catch(u){return void t(u)}s.done?n(l):Promise.resolve(l).then(e,r)}function gt(a){return function(){var n=this,t=arguments;return new Promise(function(e,r){var i=a.apply(n,t);function o(l){fi(i,e,r,o,s,"next",l)}function s(l){fi(i,e,r,o,s,"throw",l)}o(void 0)})}}var wn=new Map,gi=!1;function Uu(a){return new Promise(function(n,t){var e=new FileReader;e.onload=function(){return n(e.result)},e.onerror=t,e.readAsDataURL(a)})}function Ou(a){if(!wn.has(a)){var n=fetch(a).then(function(t){return t.blob()}).then(Uu).catch(function(){return wn.delete(a),null});wn.set(a,n)}return wn.get(a)}function Hu(a){return pa.apply(this,arguments)}function pa(){return pa=gt(de().m(function a(n){var t,e,r;return de().w(function(i){for(;;)switch(i.n){case 0:return t=document.createElement("div"),t.innerHTML=n,e=Array.from(t.querySelectorAll("img[src]")),r=e.filter(function(o){return!o.getAttribute("src").startsWith("data:")}),i.n=1,Promise.all(r.map((function(){var o=gt(de().m(function s(l){var u;return de().w(function(d){for(;;)switch(d.n){case 0:return d.n=1,Ou(l.getAttribute("src"));case 1:u=d.v,u&&l.setAttribute("src",u);case 2:return d.a(2)}},s)}));return function(s){return o.apply(this,arguments)}})()));case 1:return i.a(2,t.innerHTML)}},a)})),pa.apply(this,arguments)}function vi(a){return ma.apply(this,arguments)}function ma(){return ma=gt(de().m(function a(n){var t,e,r,i,o,s,l,u,d,h,c,f,v,y=arguments;return de().w(function(m){for(;;)switch(m.n){case 0:if(t=y.length>1&&y[1]!==void 0?y[1]:1,e=n instanceof SVGElement?new XMLSerializer().serializeToString(n):n,r=new DOMParser,i=r.parseFromString(e,"image/svg+xml"),o=i.querySelector("svg"),o){m.n=1;break}return m.a(2,null);case 1:if(s=parseFloat(o.getAttribute("width")||""),l=parseFloat(o.getAttribute("height")||""),(!(s>0)||!(l>0))&&(u=o.getAttribute("viewBox"),u&&(d=u.trim().split(/[\s,]+/),s=parseFloat(d[2]),l=parseFloat(d[3]))),!(!(s>0)||!(l>0))){m.n=2;break}return console.warn("Sigma: SVG label attachment has no parseable dimensions \u2014 skipped."),m.a(2,null);case 2:return h=Math.ceil(s*t),c=Math.ceil(l*t),f=new Blob([e],{type:"image/svg+xml"}),v=URL.createObjectURL(f),m.a(2,new Promise(function(g){var p=new Image;p.onload=function(){var b=document.createElement("canvas");b.width=h,b.height=c,b.getContext("2d").drawImage(p,0,0,h,c),URL.revokeObjectURL(v);try{b.getContext("2d").getImageData(0,0,1,1)}catch(x){if(x instanceof DOMException&&x.name==="SecurityError"){gi||(gi=!0,console.warn('Sigma: A label attachment was skipped because the rendered canvas is tainted. SVG with <foreignObject> (used by the "html" attachment type) is blocked in Chromium and Safari. Use type: "canvas" with Canvas 2D rendering instead.')),g(null);return}throw x}g(b)},p.onerror=function(){URL.revokeObjectURL(v),g(null)},p.src=v}))}},a)})),ma.apply(this,arguments)}function $u(a,n){var t=document.createElement("div");t.style.cssText="position:fixed;left:-99999px;top:0;visibility:hidden;width:max-content;height:max-content",t.innerHTML=(n?"<style>".concat(n,"</style>"):"")+a,document.body.appendChild(t);var e=t.getBoundingClientRect(),r=e.width,i=e.height;return document.body.removeChild(t),{width:Math.ceil(r),height:Math.ceil(i)}}function Vu(a,n,t,e){return ya.apply(this,arguments)}function ya(){return ya=gt(de().m(function a(n,t,e,r){var i,o,s,l,u,d,h,c,f=arguments;return de().w(function(v){for(;;)switch(v.n){case 0:return i=f.length>4&&f[4]!==void 0?f[4]:1,o=n instanceof HTMLElement?n.outerHTML:n,v.n=1,Hu(o);case 1:return s=v.v,(e==null||r==null)&&(l=$u(s,t),e=e??l.width,r=r??l.height),u=Math.ceil(e*i),d=Math.ceil(r*i),h=t?"<style>".concat(t,"</style>"):"",c='<svg xmlns="http://www.w3.org/2000/svg" '+'width="'.concat(u,'" height="').concat(d,'" viewBox="0 0 ').concat(e," ").concat(r,'">')+'<foreignObject width="'.concat(e,'" height="').concat(r,'">')+'<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">'.concat(h).concat(s,"</body>")+"</foreignObject></svg>",v.a(2,vi(c,1))}},a)})),ya.apply(this,arguments)}function ju(a){return ba.apply(this,arguments)}function ba(){return ba=gt(de().m(function a(n){var t,e=arguments,r;return de().w(function(i){for(;;)switch(i.n){case 0:t=e.length>1&&e[1]!==void 0?e[1]:1,r=n.type,i.n=r==="canvas"?1:r==="svg"?2:r==="html"?3:4;break;case 1:return i.a(2,n.canvas);case 2:return i.a(2,vi(n.svg,t));case 3:return i.a(2,Vu(n.html,n.css,n.width,n.height,t));case 4:return i.a(2)}},a)})),ba.apply(this,arguments)}var ft=2048,pi=(function(){function a(n,t,e){q(this,a),S(this,"cache",new Map),S(this,"pending",new Set),S(this,"atlas",{}),S(this,"glTexture",null),S(this,"dirty",!0),this.gl=n,this.renderers=t,this.scheduleRender=e,this.packCanvas=document.createElement("canvas"),this.packCanvas.width=ft,this.packCanvas.height=ft,this.packCtx=this.packCanvas.getContext("2d")}return Y(a,[{key:"renderAttachment",value:function(t,e,r){var i=this,o="".concat(t,":").concat(e);if(!(this.cache.has(o)||this.pending.has(o))){var s=this.renderers[e];if(s){var l=s(r);if(l){this.pending.add(o);var u=r.pixelRatio;Promise.resolve(l).then((function(){var d=gt(de().m(function h(c){var f;return de().w(function(v){for(;;)switch(v.n){case 0:if(i.pending.has(o)){v.n=1;break}return v.a(2);case 1:if(i.pending.delete(o),c){v.n=2;break}return v.a(2);case 2:return v.n=3,ju(c,u);case 3:if(f=v.v,!(!f||f.width===0||f.height===0)){v.n=4;break}return v.a(2);case 4:i.cache.set(o,{image:f,width:f.width,height:f.height}),i.dirty=!0,i.scheduleRender();case 5:return v.a(2)}},h)}));return function(h){return d.apply(this,arguments)}})())}}}}},{key:"regenerateAtlas",value:function(){if(this.dirty){this.dirty=!1;var t=[];if(this.cache.forEach(function(u,d){t.push({key:d,width:u.width,height:u.height,draw:function(c,f,v){c.drawImage(u.image,f,v)}})}),t.length===0){this.atlas={},this.deleteGLTexture();return}var e={x:0,y:0,rowHeight:0,maxRowWidth:0};this.packCtx.clearRect(0,0,ft,ft);var r=ci(t,this.packCtx,e),i=r.atlas,o=r.remaining;this.atlas=i,o.length>0&&console.warn("Sigma: ".concat(o.length," label attachment(s) could not fit in the ").concat(ft,"x").concat(ft," atlas and will not be rendered.")),this.deleteGLTexture();var s=this.gl,l=s.createTexture();s.activeTexture(s.TEXTURE0+Gt),s.bindTexture(s.TEXTURE_2D,l),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,this.packCanvas),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.glTexture=l}}},{key:"bindTexture",value:function(t){if(this.glTexture){var e=this.gl;e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.glTexture)}}},{key:"getEntry",value:function(t,e){var r="".concat(t,":").concat(e);return this.atlas[r]||null}},{key:"invalidateNode",value:function(t){var e="".concat(t,":"),r=z(this.cache.keys()),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;o.startsWith(e)&&(this.cache.delete(o),this.dirty=!0)}}catch(d){r.e(d)}finally{r.f()}var s=z(this.pending),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;u.startsWith(e)&&this.pending.delete(u)}}catch(d){s.e(d)}finally{s.f()}}},{key:"restore",value:function(){this.glTexture=null,this.dirty=!0}},{key:"clear",value:function(){this.cache.clear(),this.pending.clear(),this.atlas={},this.dirty=!0,this.deleteGLTexture()}},{key:"kill",value:function(){this.clear(),this.packCanvas=null,this.packCtx=null,this.gl=null}},{key:"deleteGLTexture",value:function(){this.glTexture&&(this.gl.deleteTexture(this.glTexture),this.glTexture=null)}}])})(),xa=(function(){function a(n){q(this,a),S(this,"buckets",new Map),S(this,"keyDepth",new Map);var t=z(n),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;this.buckets.set(r,new Set)}}catch(i){t.e(i)}finally{t.f()}}return Y(a,[{key:"has",value:function(t){return this.keyDepth.has(t)}},{key:"getBucket",value:function(t){return this.buckets.get(t)}},{key:"set",value:function(t,e){var r,i=this.keyDepth.get(t);if(i!==e){var o=this.buckets.get(e);if(!o)throw new Error('Sigma: "'.concat(e,'" is not a declared depth layer'));i!==void 0&&((r=this.buckets.get(i))===null||r===void 0||r.delete(t)),o.add(t),this.keyDepth.set(t,e)}}},{key:"remove",value:function(t){var e=this.keyDepth.get(t);e!==void 0&&(this.buckets.get(e).delete(t),this.keyDepth.delete(t))}},{key:"clearAll",value:function(){var t=z(this.buckets.values()),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;r.clear()}}catch(i){t.e(i)}finally{t.f()}this.keyDepth.clear()}},{key:"getSorted",value:function(t,e){var r=this.buckets.get(t);return!r||r.size===0?[]:V(r).sort(function(i,o){return e(i)-e(o)})}}])})(),mi=(function(a){function n(t,e){return q(this,n),te(this,n,[t,2,e])}return ne(n,a),Y(n,[{key:"updateNode",value:function(e,r,i,o,s,l,u,d){var h=this.indexMap.get(e);if(h===void 0)throw new Error('Node "'.concat(e,'" not allocated in NodeDataTexture'));var c=ke(d),f=Q(c,4),v=f[0],y=f[1],m=f[2],g=f[3],p=h*2*4;this.data[p]=r,this.data[p+1]=i,this.data[p+2]=o,this.data[p+3]=s,this.data[p+4]=l,this.data[p+5]=u,this.data[p+6]=v*65536+y*256+m,this.data[p+7]=g/255,this.markDirty(h)}}])})(Sn),Xu=1024,qu=1.5,Yu=4096,_a=(function(){function a(n,t){var e;if(q(this,a),S(this,"texture",null),S(this,"framebuffer",null),!n.getExtension("EXT_color_buffer_float"))throw new Error("sigma: EXT_color_buffer_float is required for label/edge placement but is unavailable in this WebGL2 context.");this.gl=n,this.channels=t.channels,this.capacity=this.roundUpToPowerOfTwo((e=t.initialCapacity)!==null&&e!==void 0?e:Xu);var r=this.computeDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.create()}return Y(a,[{key:"roundUpToPowerOfTwo",value:function(t){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,t))))}},{key:"computeDimensions",value:function(t){var e=Math.min(t,Yu),r=Math.ceil(t/e);return{width:e,height:r}}},{key:"create",value:function(){var t=this.gl,e=this.channels===1?t.R32F:t.RGBA32F,r=this.channels===1?t.RED:t.RGBA;if(this.texture=t.createTexture(),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,e,this.textureWidth,this.textureHeight,0,r,t.FLOAT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.framebuffer=t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.texture,0),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE)throw new Error("sigma: float framebuffer for frame-pass placement is incomplete.");t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindTexture(t.TEXTURE_2D,null)}},{key:"ensureCapacity",value:function(t){if(!(t<=this.capacity)){var e=this.gl;this.capacity=this.roundUpToPowerOfTwo(Math.ceil(t*qu));var r=this.computeDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.texture&&e.deleteTexture(this.texture),this.framebuffer&&e.deleteFramebuffer(this.framebuffer),this.create()}}},{key:"bindAsRenderTarget",value:function(){var t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.viewport(0,0,this.textureWidth,this.textureHeight)}},{key:"bind",value:function(t){var e=this.gl;e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.texture)}},{key:"getTexture",value:function(){return this.texture}},{key:"getTextureWidth",value:function(){return this.textureWidth}},{key:"getTextureHeight",value:function(){return this.textureHeight}},{key:"restore",value:function(){this.gl.getExtension("EXT_color_buffer_float"),this.create()}},{key:"kill",value:function(){var t=this.gl;this.texture&&(t.deleteTexture(this.texture),this.texture=null),this.framebuffer&&(t.deleteFramebuffer(this.framebuffer),this.framebuffer=null)}}])})(),yi=(function(a){function n(t,e){return q(this,n),te(this,n,[t,2,e])}return ne(n,a),Y(n,[{key:"updateEdge",value:function(e,r,i,o,s,l){var u=arguments.length>6&&arguments[6]!==void 0?arguments[6]:0,d=arguments.length>7&&arguments[7]!==void 0?arguments[7]:0,h=arguments.length>8&&arguments[8]!==void 0?arguments[8]:0,c=this.indexMap.get(e);if(c===void 0)throw new Error('Edge "'.concat(e,'" not allocated in EdgeDataTexture'));var f=c*this.TEXELS_PER_ITEM*4;this.data[f+0]=r,this.data[f+1]=i,this.data[f+2]=o,this.data[f+3]=0,this.data[f+4]=s,this.data[f+5]=l,this.data[f+6]=u,this.data[f+7]=(d&15)<<4|h&15,this.markDirty(c)}}])})(Sn);var Ph=Me(Ke()),Fh=Me(ta());function Ku(a,n){if(a==null)return{};var t={};for(var e in a)if({}.hasOwnProperty.call(a,e)){if(n.indexOf(e)!==-1)continue;t[e]=a[e]}return t}function bi(a,n){if(a==null)return{};var t,e,r=Ku(a,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(a);for(e=0;e<i.length;e++)t=i[e],n.indexOf(t)===-1&&{}.propertyIsEnumerable.call(a,t)&&(r[t]=a[t])}return r}var Zu=["factor"],Qu=["factor"],xi=1.5,Ta={x:.5,y:.5,angle:0,ratio:1},_i=(function(a){function n(){var t;q(this,n);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return t=te(this,n,[].concat(r)),S(t,"minRatio",null),S(t,"maxRatio",null),S(t,"enabled",!0),S(t,"enabledZooming",!0),S(t,"enabledPanning",!0),S(t,"enabledRotation",!0),S(t,"constrainState",null),S(t,"state",W({},Ta)),S(t,"previousState",W({},Ta)),S(t,"nextFrame",null),S(t,"currentAnimationFrom",null),S(t,"currentAnimationTo",null),S(t,"animationCallback",null),t}return ne(n,a),Y(n,[{key:"x",get:function(){return this.state.x}},{key:"y",get:function(){return this.state.y}},{key:"angle",get:function(){return this.state.angle}},{key:"ratio",get:function(){return this.state.ratio}},{key:"getState",value:function(){return W({},this.state)}},{key:"getPreviousState",value:function(){return W({},this.previousState)}},{key:"getBoundedRatio",value:function(e){var r=e;return typeof this.minRatio=="number"&&(r=Math.max(r,this.minRatio)),typeof this.maxRatio=="number"&&(r=Math.min(r,this.maxRatio)),r}},{key:"validateState",value:function(e){var r=this.getState();return this.enabledPanning&&typeof e.x=="number"&&(r.x=e.x),this.enabledPanning&&typeof e.y=="number"&&(r.y=e.y),this.enabledZooming&&typeof e.ratio=="number"&&(r.ratio=this.getBoundedRatio(e.ratio)),this.enabledRotation&&typeof e.angle=="number"&&(r.angle=e.angle),this.constrainState?this.constrainState(r):r}},{key:"isAnimating",value:function(){return this.nextFrame!==null}},{key:"setState",value:function(e){if(!this.enabled)return this;var r=this.validateState(e);return Ar(this.state,r)?this:(this.previousState=this.state,this.state=r,this.emit("updated",this.getState()),this)}},{key:"updateState",value:function(e){return this.setState(e(this.getState())),this}},{key:"animate",value:function(e,r){var i=this;return this.enabled?new Promise(function(o){return i.runAnimation(e,W(W({},wr),r),o)}):Promise.resolve()}},{key:"cancelAnimation",value:function(){return this.nextFrame!==null&&(cancelAnimationFrame(this.nextFrame),this.nextFrame=null),this.resolveAnimation(),this.emitAnimationEnd(!1),this}},{key:"zoomIn",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=e.factor,i=r===void 0?xi:r,o=bi(e,Zu);return this.animate({ratio:this.ratio/i},o)}},{key:"zoomOut",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=e.factor,i=r===void 0?xi:r,o=bi(e,Qu);return this.animate({ratio:this.ratio*i},o)}},{key:"reset",value:function(e){return this.animate(Ta,e)}},{key:"runAnimation",value:function(e,r,i){var o=this,s=sn(r.easing),l=Date.now(),u=this.getState(),d=this.validateState(e),h=function(){if(!o.enabled){o.cancelAnimation();return}var f=r.duration>0?(Date.now()-l)/r.duration:1;if(f>=1){o.nextFrame=null,o.setState(d),o.resolveAnimation(),o.emitAnimationEnd(!0);return}var v=s(f);o.setState({x:u.x+(d.x-u.x)*v,y:u.y+(d.y-u.y)*v,angle:u.angle+(d.angle-u.angle)*v,ratio:u.ratio+(d.ratio-u.ratio)*v}),o.nextFrame=requestAnimationFrame(h)};this.cancelAnimation(),this.currentAnimationFrom=u,this.currentAnimationTo=d,this.animationCallback=i,this.emit("animationStart",{from:u,to:d}),h()}},{key:"resolveAnimation",value:function(){var e=this.animationCallback;this.animationCallback=null,e&&e()}},{key:"emitAnimationEnd",value:function(e){var r=this.currentAnimationFrom,i=this.currentAnimationTo;!r||!i||(this.currentAnimationFrom=null,this.currentAnimationTo=null,this.emit("animationEnd",{from:r,to:i,completed:e}))}}],[{key:"from",value:function(e){var r=new n;return r.setState(e)}}])})(Rt);function he(a,n){var t=n.getBoundingClientRect();return{x:a.clientX-t.left,y:a.clientY-t.top}}function Se(a,n){var t=W(W({},he(a,n)),{},{sigmaDefaultPrevented:!1,preventSigmaDefault:function(){t.sigmaDefaultPrevented=!0},original:a});return t}function $e(a){var n="x"in a?a:W(W({},a.touches[0]||a.previousTouches[0]),{},{original:a.original,sigmaDefaultPrevented:a.sigmaDefaultPrevented,preventSigmaDefault:function(){a.sigmaDefaultPrevented=!0,n.sigmaDefaultPrevented=!0}});return n}function Ju(a,n){var t=Se(a,n);return t.delta=Gi(a),t}var ed=2;function Ln(a){for(var n=[],t=0,e=Math.min(a.length,ed);t<e;t++)n.push(a[t]);return n}function Mt(a,n,t){var e={touches:Ln(a.touches).map(function(r){return he(r,t)}),previousTouches:n.map(function(r){return he(r,t)}),sigmaDefaultPrevented:!1,preventSigmaDefault:function(){e.sigmaDefaultPrevented=!0},original:a};return e}function Gi(a){if(typeof a.deltaY<"u")return a.deltaY*-3/360;if(typeof a.detail<"u")return a.detail/-9;throw new Error("Captor: could not extract delta from event.")}var Ni=(function(a){function n(t,e){var r;return q(this,n),r=te(this,n),r.container=t,r.renderer=e,r}return ne(n,a),Y(n)})(Rt),td=["doubleClickTimeout","doubleClickZoomingDuration","doubleClickZoomingRatio","dragTimeout","draggedEventsTolerance","enableCameraMouseRotation","gestureTarget","inertiaDuration","inertiaRatio","zoomDuration","zoomingRatio"],nd=td.reduce(function(a,n){return W(W({},a),{},S({},n,fn[n]))},{});function zt(a){return a instanceof PointerEvent&&a.pointerType==="touch"}var ad=(function(a){function n(t,e){var r;return q(this,n),r=te(this,n,[t,e]),S(r,"enabled",!0),S(r,"draggedEvents",0),S(r,"downStartTime",null),S(r,"lastMouseX",null),S(r,"lastMouseY",null),S(r,"isMouseDown",!1),S(r,"isMoving",!1),S(r,"isPanningStage",!1),S(r,"movingTimeout",null),S(r,"startCameraState",null),S(r,"clicks",0),S(r,"doubleClickTimeout",null),S(r,"isRightMouseDown",!1),S(r,"startRotationAngle",null),S(r,"startCameraAngle",null),S(r,"currentWheelDirection",0),S(r,"lastWheelAnimationId",0),S(r,"settings",nd),r.handleRightClick=r.handleRightClick.bind(r),r.handleDown=r.handleDown.bind(r),r.handleUp=r.handleUp.bind(r),r.handleMove=r.handleMove.bind(r),r.handleWheel=r.handleWheel.bind(r),r.handleLeave=r.handleLeave.bind(r),r.handleEnter=r.handleEnter.bind(r),t.addEventListener("contextmenu",r.handleRightClick,{capture:!1}),t.addEventListener("pointerdown",r.handleDown,{capture:!1}),t.addEventListener("wheel",r.handleWheel,{capture:!1,passive:!1}),t.addEventListener("pointerleave",r.handleLeave,{capture:!1}),t.addEventListener("pointerenter",r.handleEnter,{capture:!1}),document.addEventListener("pointermove",r.handleMove,{capture:!1}),document.addEventListener("pointerup",r.handleUp,{capture:!1}),r}return ne(n,a),Y(n,[{key:"kill",value:function(){var e=this.container;e.removeEventListener("contextmenu",this.handleRightClick),e.removeEventListener("pointerdown",this.handleDown),e.removeEventListener("wheel",this.handleWheel),e.removeEventListener("pointerleave",this.handleLeave),e.removeEventListener("pointerenter",this.handleEnter),document.removeEventListener("pointermove",this.handleMove),document.removeEventListener("pointerup",this.handleUp)}},{key:"handleClick",value:function(e){var r=this;if(this.enabled){if(this.clicks++,this.clicks===2)return this.clicks=0,typeof this.doubleClickTimeout=="number"&&(clearTimeout(this.doubleClickTimeout),this.doubleClickTimeout=null),this.handleDoubleClick(e);setTimeout(function(){r.clicks=0,r.doubleClickTimeout=null},this.settings.doubleClickTimeout),this.draggedEvents<this.settings.draggedEventsTolerance&&this.emit("click",Se(e,this.container))}}},{key:"handleRightClick",value:function(e){this.enabled&&(this.settings.enableCameraMouseRotation&&e.preventDefault(),this.emit("rightClick",Se(e,this.container)))}},{key:"handleDoubleClick",value:function(e){if(this.enabled){e.preventDefault(),e.stopPropagation();var r=Se(e,this.container);if(this.emit("doubleClick",r),!r.sigmaDefaultPrevented){var i=this.renderer.getCamera(),o=i.getBoundedRatio(i.getState().ratio/this.settings.doubleClickZoomingRatio);i.animate(this.renderer.getViewportZoomedState(he(e,this.container),o),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}}},{key:"handleDown",value:function(e){if(!(!this.enabled||zt(e))){if(e.button===0){this.startCameraState=this.renderer.getCamera().getState();var r=he(e,this.container),i=r.x,o=r.y;this.lastMouseX=i,this.lastMouseY=o,this.draggedEvents=0,this.downStartTime=Date.now(),this.isMouseDown=!0}if(e.button===2&&this.settings.enableCameraMouseRotation){var s=he(e,this.container),l=s.x,u=s.y,d=this.container.offsetWidth/2,h=this.container.offsetHeight/2;this.startRotationAngle=Math.atan2(u-h,l-d),this.startCameraAngle=this.renderer.getCamera().getState().angle,this.isRightMouseDown=!0}this.emit("mousedown",Se(e,this.container))}}},{key:"handleUp",value:function(e){var r=this;if(!(!this.enabled||zt(e)||!this.isMouseDown&&!this.isRightMouseDown)){if(this.isRightMouseDown){this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.emit("mouseup",Se(e,this.container));return}var i=this.renderer.getCamera();this.isMouseDown=!1,this.isPanningStage&&(this.isPanningStage=!1,this.renderer._setPanning(!1)),typeof this.movingTimeout=="number"&&(clearTimeout(this.movingTimeout),this.movingTimeout=null);var o=he(e,this.container),s=o.x,l=o.y,u=i.getState(),d=i.getPreviousState();this.isMoving?i.animate({x:u.x+this.settings.inertiaRatio*(u.x-d.x),y:u.y+this.settings.inertiaRatio*(u.y-d.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"}):(this.lastMouseX!==s||this.lastMouseY!==l)&&i.setState({x:u.x,y:u.y}),this.isMoving=!1,setTimeout(function(){var h=r.draggedEvents>0;r.draggedEvents=0;var c=r.renderer.getSetting("hideEdgesOnMove")||r.renderer.getSetting("hideLabelsOnMove");h&&c&&r.renderer.refresh()},0),this.emit("mouseup",Se(e,this.container)),(e.target===this.container||e.composedPath()[0]===this.container)&&this.handleClick(e)}}},{key:"handleMove",value:function(e){var r=this;if(!(!this.enabled||zt(e))){var i=Se(e,this.container);if(this.emit("mousemovebody",i),(e.target===this.container||e.composedPath()[0]===this.container)&&this.emit("mousemove",i),this.isMouseDown&&this.draggedEvents++,!i.sigmaDefaultPrevented){if(this.isMouseDown){this.isMoving=!0,typeof this.movingTimeout=="number"&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(function(){r.movingTimeout=null,r.isMoving=!1},this.settings.dragTimeout);var o=this.renderer.getCamera(),s=he(e,this.container),l=s.x,u=s.y,d=this.renderer.viewportToFramedGraph({x:this.lastMouseX,y:this.lastMouseY}),h=this.renderer.viewportToFramedGraph({x:l,y:u}),c=d.x-h.x,f=d.y-h.y,v=o.getState(),y=v.x+c,m=v.y+f;this.isPanningStage||(this.isPanningStage=!0,this.renderer._setPanning(!0)),o.setState({x:y,y:m}),this.lastMouseX=l,this.lastMouseY=u,e.preventDefault(),e.stopPropagation()}if(this.isRightMouseDown){var g=he(e,this.container),p=g.x,b=g.y,x=this.container.offsetWidth/2,_=this.container.offsetHeight/2,T=Math.atan2(b-_,p-x),A=T-this.startRotationAngle,E=this.renderer.getCamera();E.setState({angle:this.startCameraAngle+A}),e.preventDefault(),e.stopPropagation()}}}}},{key:"handleLeave",value:function(e){zt(e)||this.emit("mouseleave",Se(e,this.container))}},{key:"handleEnter",value:function(e){zt(e)||this.emit("mouseenter",Se(e,this.container))}},{key:"handleWheel",value:function(e){var r=this,i=this.renderer.getCamera();if(!(!this.enabled||!i.enabledZooming)){var o=Ju(e,this.container);if(this.emit("wheel",o),!o.sigmaDefaultPrevented){var s=this.settings.gestureTarget;if(s!=="page"){if(s==="shared"&&!e.ctrlKey&&!e.metaKey){this.renderer._showGestureHint("wheel");return}var l=Gi(e);if(l){e.preventDefault(),e.stopPropagation();var u=i.getState().ratio,d=l>0?1/this.settings.zoomingRatio:this.settings.zoomingRatio,h=i.getBoundedRatio(u*d),c=l>0?1:-1,f=Date.now();if(u!==h&&!(this.currentWheelDirection===c&&this.lastWheelTriggerTime&&f-this.lastWheelTriggerTime<this.settings.zoomDuration/5)){var v=++this.lastWheelAnimationId;i.animate(this.renderer.getViewportZoomedState(he(e,this.container),h),{easing:"quadraticOut",duration:this.settings.zoomDuration}).then(function(){r.lastWheelAnimationId===v&&(r.currentWheelDirection=0)}),this.currentWheelDirection=c,this.lastWheelTriggerTime=f}}}}}}},{key:"setSettings",value:function(e){this.settings=e}}])})(Ni),rd=["dragTimeout","gestureTarget","inertiaDuration","inertiaRatio","doubleClickTimeout","doubleClickZoomingRatio","doubleClickZoomingDuration","tapMoveTolerance"],id=rd.reduce(function(a,n){return W(W({},a),{},S({},n,fn[n]))},{}),od=(function(a){function n(t,e){var r;return q(this,n),r=te(this,n,[t,e]),S(r,"enabled",!0),S(r,"isMoving",!1),S(r,"hasMoved",!1),S(r,"isPanningStage",!1),S(r,"isZoomingStage",!1),S(r,"touchMode",0),S(r,"startTouchesPositions",[]),S(r,"lastTouches",[]),S(r,"lastTap",null),S(r,"settings",id),r.handleStart=r.handleStart.bind(r),r.handleLeave=r.handleLeave.bind(r),r.handleMove=r.handleMove.bind(r),t.addEventListener("touchstart",r.handleStart,{capture:!1}),t.addEventListener("touchcancel",r.handleLeave,{capture:!1}),document.addEventListener("touchend",r.handleLeave,{capture:!1,passive:!1}),document.addEventListener("touchmove",r.handleMove,{capture:!1,passive:!1}),r}return ne(n,a),Y(n,[{key:"kill",value:function(){var e=this.container;e.removeEventListener("touchstart",this.handleStart),e.removeEventListener("touchcancel",this.handleLeave),document.removeEventListener("touchend",this.handleLeave),document.removeEventListener("touchmove",this.handleMove)}},{key:"getDimensions",value:function(){return{width:this.container.offsetWidth,height:this.container.offsetHeight}}},{key:"doesCapture",value:function(e){var r=this.settings.gestureTarget;return r==="graph"?!0:r==="page"?!1:e>=2}},{key:"syncStageFlags",value:function(){var e=this.touchMode===1&&this.hasMoved,r=this.touchMode===2;e!==this.isPanningStage&&(this.isPanningStage=e,this.renderer._setPanning(e)),r!==this.isZoomingStage&&(this.isZoomingStage=r,this.renderer._setZooming(r))}},{key:"handleStart",value:function(e){var r=this;if(this.enabled){var i=Ln(e.touches);if(this.touchMode=i.length,this.startCameraState=this.renderer.getCamera().getState(),this.startTouchesPositions=i.map(function(f){return he(f,r.container)}),this.touchMode===2){var o=Q(this.startTouchesPositions,2),s=o[0],l=s.x,u=s.y,d=o[1],h=d.x,c=d.y;this.startTouchesAngle=Math.atan2(c-u,h-l),this.startTouchesDistance=Math.sqrt(Math.pow(h-l,2)+Math.pow(c-u,2))}this.syncStageFlags(),this.emit("touchdown",Mt(e,this.lastTouches,this.container)),this.lastTouches=i,this.lastTouchesPositions=this.startTouchesPositions,e.cancelable&&(this.doesCapture(e.touches.length)||this.renderer._hasNodeDrag())&&e.preventDefault()}}},{key:"handleLeave",value:function(e){if(!(!this.enabled||!this.startTouchesPositions.length)){switch(e.cancelable&&this.doesCapture(this.touchMode)&&e.preventDefault(),this.movingTimeout&&(this.isMoving=!1,clearTimeout(this.movingTimeout)),this.touchMode){case 2:if(e.touches.length===1){this.handleStart(e);break}case 1:if(this.isMoving){var r=this.renderer.getCamera(),i=r.getState(),o=r.getPreviousState();r.animate({x:i.x+this.settings.inertiaRatio*(i.x-o.x),y:i.y+this.settings.inertiaRatio*(i.y-o.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"})}this.hasMoved=!1,this.isMoving=!1,this.touchMode=0;break}if(this.syncStageFlags(),this.emit("touchup",Mt(e,this.lastTouches,this.container)),!e.touches.length){var s=he(this.lastTouches[0],this.container),l=this.startTouchesPositions[0],u=Math.pow(s.x-l.x,2)+Math.pow(s.y-l.y,2);if(!e.touches.length&&u<Math.pow(this.settings.tapMoveTolerance,2))if(this.lastTap&&Date.now()-this.lastTap.time<this.settings.doubleClickTimeout){var d=Mt(e,this.lastTouches,this.container);if(this.emit("doubletap",d),this.lastTap=null,!d.sigmaDefaultPrevented&&this.settings.gestureTarget!=="page"){var h=this.renderer.getCamera(),c=h.getBoundedRatio(h.getState().ratio/this.settings.doubleClickZoomingRatio);h.animate(this.renderer.getViewportZoomedState(s,c),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}else{var f=Mt(e,this.lastTouches,this.container);this.emit("tap",f),this.lastTap={time:Date.now(),position:f.touches[0]||f.previousTouches[0]}}}this.lastTouches=Ln(e.touches),this.startTouchesPositions=[]}}},{key:"handleMove",value:function(e){var r=this;if(!(!this.enabled||!this.startTouchesPositions.length)){var i=this.doesCapture(e.touches.length);i&&e.preventDefault();var o=Ln(e.touches),s=o.map(function(O){return he(O,r.container)}),l=this.lastTouches;this.lastTouches=o,this.lastTouchesPositions=s;var u=Mt(e,l,this.container);if(this.emit("touchmove",u),!u.sigmaDefaultPrevented&&(this.hasMoved||(this.hasMoved=s.some(function(O,$){var X=r.startTouchesPositions[$];return X&&(O.x!==X.x||O.y!==X.y)})),!!this.hasMoved)){if(!i){this.settings.gestureTarget==="shared"&&this.renderer._showGestureHint("touch");return}this.isMoving=!0,this.syncStageFlags(),this.movingTimeout&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(function(){r.isMoving=!1},this.settings.dragTimeout);var d=this.renderer.getCamera(),h=this.startCameraState,c=this.renderer.getSetting("stagePadding");switch(this.touchMode){case 1:{var f=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0]),v=f.x,y=f.y,m=this.renderer.viewportToFramedGraph(s[0]),g=m.x,p=m.y;d.setState({x:h.x+v-g,y:h.y+y-p});break}case 2:{var b={x:.5,y:.5,angle:0,ratio:1},x=s[0],_=x.x,T=x.y,A=s[1],E=A.x,R=A.y,L=Math.atan2(R-T,E-_)-this.startTouchesAngle,k=Math.hypot(R-T,E-_)/this.startTouchesDistance,w=d.getBoundedRatio(h.ratio/k);b.ratio=w,b.angle=h.angle+L;var F=this.getDimensions(),C=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0],{cameraState:h}),N=Math.min(F.width,F.height)-2*c,G=N/F.width,M=N/F.height,P=w/N,D=_-N/2/G,I=T-N/2/M,H=Mn({x:D,y:I},b.angle);D=H.x,I=H.y,b.x=C.x-D*P,b.y=C.y+I*P,d.setState(b);break}}}}}},{key:"setSettings",value:function(e){this.settings=e}}])})(Ni),sd=(function(){function a(n,t,e,r){q(this,a),S(this,"pendingNode",null),S(this,"session",null),this.graph=n,this.viewportToGraph=t,this.setNodesState=e,this.emit=r}return Y(a,[{key:"start",value:function(t,e,r,i,o){var s=r(t),l=!1;if(this.emit("nodeDragStart",{node:t,allDraggedNodes:s,event:e,preventSigmaDefault:function(){l=!0}}),l)return!1;var u=new Map,d=z(s),h;try{for(d.s();!(h=d.n()).done;){var c=h.value;u.set(c,{x:this.graph.getNodeAttribute(c,i),y:this.graph.getNodeAttribute(c,o)})}}catch(f){d.e(f)}finally{d.f()}return this.session={node:t,allNodes:s,startPosition:this.viewportToGraph(e),startNodePositions:u,xAttr:i,yAttr:o},this.setNodesState(s,{isDragged:!0}),!0}},{key:"applyMove",value:function(t,e){var r=this.session,i=r.allNodes,o=r.startNodePositions,s=r.startPosition,l=r.xAttr,u=r.yAttr,d=this.viewportToGraph(t),h={x:d.x-s.x,y:d.y-s.y},c=z(i),f;try{for(c.s();!(f=c.n()).done;){var v=f.value,y=o.get(v);if(!(!y||!this.graph.hasNode(v))){var m={x:y.x+h.x,y:y.y+h.y};e?this.graph.mergeNodeAttributes(v,e(m,v)):(this.graph.setNodeAttribute(v,l,m.x),this.graph.setNodeAttribute(v,u,m.y))}}}catch(g){c.e(g)}finally{c.f()}}},{key:"end",value:function(){if(this.pendingNode=null,!this.session)return null;var t=this.session,e=t.node,r=t.allNodes;return this.setNodesState(r,{isDragged:!1}),this.session=null,{node:e,allNodes:r}}},{key:"removeNode",value:function(t){t===this.pendingNode&&(this.pendingNode=null),this.session&&(this.session.node===t?(this.setNodesState(this.session.allNodes,{isDragged:!1}),this.session=null):this.session.allNodes.includes(t)&&(this.session.allNodes=this.session.allNodes.filter(function(e){return e!==t}),this.session.startNodePositions.delete(t)))}},{key:"clear",value:function(){this.pendingNode=null,this.session=null}}])})(),ld=(function(){function a(n,t){q(this,a),S(this,"groups",new Map),S(this,"edgeToGroupKey",new Map),this.graph=n,this.onGroupChanged=t}return Y(a,[{key:"getGroupKey",value:function(t){var e=this.graph.source(t),r=this.graph.target(t);return e<r?"".concat(e,"\0").concat(r):"".concat(r,"\0").concat(e)}},{key:"sortGroup",value:function(t,e){var r=this,i=e.split("\0")[0];t.sort(function(o,s){var l=r.graph.source(o)===i||!r.graph.isDirected(o)?0:1,u=r.graph.source(s)===i||!r.graph.isDirected(s)?0:1;return l-u})}},{key:"register",value:function(t){var e=this.getGroupKey(t),r=this.groups.get(e);r||(r=[],this.groups.set(e,r)),r.includes(t)||r.push(t),this.edgeToGroupKey.set(t,e),this.sortGroup(r,e),this.onGroupChanged(r,r.length)}},{key:"unregister",value:function(t){var e=this.edgeToGroupKey.get(t);if(e){this.edgeToGroupKey.delete(t);var r=this.groups.get(e);if(r){var i=r.indexOf(t);i!==-1&&r.splice(i,1),r.length===0?this.groups.delete(e):this.onGroupChanged(r,r.length)}}}},{key:"getGroup",value:function(t){var e,r=this.edgeToGroupKey.get(t);return r?(e=this.groups.get(r))!==null&&e!==void 0?e:[]:[]}},{key:"getSiblings",value:function(t){return this.getGroup(t).filter(function(e){return e!==t})}},{key:"rebuild",value:function(){var t=this;this.groups.clear(),this.edgeToGroupKey.clear(),this.graph.forEachEdge(function(l){var u=t.getGroupKey(l),d=t.groups.get(u);d||(d=[],t.groups.set(u,d)),d.push(l),t.edgeToGroupKey.set(l,u)});var e=z(this.groups),r;try{for(e.s();!(r=e.n()).done;){var i=Q(r.value,2),o=i[0],s=i[1];this.sortGroup(s,o),this.onGroupChanged(s,s.length)}}catch(l){e.e(l)}finally{e.f()}}},{key:"clear",value:function(){this.groups.clear(),this.edgeToGroupKey.clear()}}])})();function Ti(a,n){var t;if(a===!1||a==="extend"||a==="separate")return a;var e=a[n];return e!==void 0?e:(t=a.default)!==null&&t!==void 0?t:!1}function Si(a){return a===!1?!1:a==="extend"||a==="separate"?!0:Object.values(a).some(function(n){return n==="extend"||n==="separate"})}function Ei(a){return a==="separate"?!0:a===!1||a==="extend"?!1:a.default==="separate"?!0:Object.values(a).includes("separate")}var le={node:{parent:null,eventSuffix:"Node",payloadKey:"node",isEnabled:function(){return!0},writesPickingThisFrame:function(){return!0},setHover:function(n,t,e){return n.setNodeState(t,{isHovered:e})},getCursor:function(n,t){var e;return(e=n.nodeDataCache[t])===null||e===void 0?void 0:e.cursor},isHitValid:function(n,t){var e;return((e=n.nodeDataCache[t])===null||e===void 0?void 0:e.visibility)!=="hidden"}},edge:{parent:null,eventSuffix:"Edge",payloadKey:"edge",isEnabled:function(n){return!!n.settings.enableEdgeEvents},writesPickingThisFrame:function(n){return!!n.settings.enableEdgeEvents},setHover:function(n,t,e){return n.setEdgeState(t,{isHovered:e})},getCursor:function(n,t){var e;return(e=n.edgeDataCache[t])===null||e===void 0?void 0:e.cursor}},nodeLabel:{parent:"node",eventSuffix:"NodeLabel",payloadKey:"node",isEnabled:function(n){return Ei(n.settings.nodeLabelEvents)},writesPickingThisFrame:function(n){return Si(n.settings.nodeLabelEvents)},setHover:function(n,t,e){return n.setNodeState(t,{isLabelHovered:e})},getCursor:function(n,t){var e;return(e=n.nodeDataCache[t])===null||e===void 0?void 0:e.labelCursor},resolveForVerb:function(n,t,e){var r=Ti(e.settings.nodeLabelEvents,t);return r===!1?null:r==="extend"?{kind:"node",key:n.key}:n}},edgeLabel:{parent:"edge",eventSuffix:"EdgeLabel",payloadKey:"edge",isEnabled:function(n){return Ei(n.settings.edgeLabelEvents)},writesPickingThisFrame:function(n){return Si(n.settings.edgeLabelEvents)},setHover:function(n,t,e){return n.setEdgeState(t,{isLabelHovered:e})},getCursor:function(n,t){var e;return(e=n.edgeDataCache[t])===null||e===void 0?void 0:e.labelCursor},resolveForVerb:function(n,t,e){var r=Ti(e.settings.edgeLabelEvents,t);return r===!1?null:r==="extend"?{kind:"edge",key:n.key}:n}}},Xe=["node","edge","nodeLabel","edgeLabel"];function ud(){return{lookup:[null],idsByKind:{node:new Map,edge:new Map,nodeLabel:new Map,edgeLabel:new Map},nextId:1}}function je(a,n,t){var e;return(e=a.idsByKind[n].get(t))!==null&&e!==void 0?e:0}function Sa(a,n){var t=z(Xe),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;if(r===n||le[r].parent===n){var i=z(a.idsByKind[r].values()),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;a.lookup[s]=null}}catch(c){i.e(c)}finally{i.f()}a.idsByKind[r]=new Map}}}catch(c){t.e(c)}finally{t.f()}var l=1,u=z(Xe),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;if(h===n)break;l+=a.idsByKind[h].size}}catch(c){u.e(c)}finally{u.f()}a.nextId=l}function Ai(a,n,t){var e=a.nextId++;return a.idsByKind[n].set(t,e),a.lookup[e]={kind:n,key:t},e}function dd(a,n){var t=z(Xe),e;try{for(t.s();!(e=t.n()).done;){var r=e.value;if(le[r].parent!==null){var i=z(a.idsByKind[r].values()),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;a.lookup[s]=null}}catch(_){i.e(_)}finally{i.f()}a.idsByKind[r]=new Map}}}catch(_){t.e(_)}finally{t.f()}a.nextId=1;var l=z(Xe),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;if(le[d].parent===null){var h=z(a.idsByKind[d].values()),c;try{for(h.s();!(c=h.n()).done;){var f=c.value;f>=a.nextId&&(a.nextId=f+1)}}catch(_){h.e(_)}finally{h.f()}}}}catch(_){l.e(_)}finally{l.f()}var v=z(Xe),y;try{for(v.s();!(y=v.n()).done;){var m=y.value,g=le[m];if(!(g.parent===null||!g.isEnabled(n))){var p=z(a.idsByKind[g.parent].keys()),b;try{for(p.s();!(b=p.n()).done;){var x=b.value;a.idsByKind[m].set(x,a.nextId),a.lookup[a.nextId]={kind:m,key:x},a.nextId++}}catch(_){p.e(_)}finally{p.f()}}}}catch(_){v.e(_)}finally{v.f()}}function hd(a,n){var t=z(Xe),e;try{for(t.s();!(e=t.n()).done;){var r=e.value,i=a[r],o=n[r];if(i!==o){if(i.size!==o.size)return!1;var s=z(i),l;try{for(s.s();!(l=s.n()).done;){var u=Q(l.value,2),d=u[0],h=u[1];if(o.get(d)!==h)return!1}}catch(c){s.e(c)}finally{s.f()}}}}catch(c){t.e(c)}finally{t.f()}return!0}function Di(a,n,t){le[n.kind].setHover(a,n.key,t)}function cd(a,n){return le[n.kind].getCursor(a,n.key)}function Wt(a,n){return"".concat(n).concat(le[a].eventSuffix)}function Bt(a,n){return W(W({},n),{},S({},le[a.kind].payloadKey,a.key))}function fd(a,n,t){var e=le[n.kind].resolveForVerb;return e?e(n,t,a):n}function gd(a,n){var t=le[n.kind].isHitValid;return t?t(a,n.key):!0}function Ea(a){return Xe.filter(function(n){return n===a||le[n].parent===a})}function Mi(a,n,t){return n&&(n=fd(a,n,t)),n&&!gd(a,n)&&(n=null),n}function Aa(a,n,t){var e=t==="wheel"?a.stateManager.hovered:a.getHitAtPosition(n);return Mi(a,e,t)}function vd(a,n){return!a||!n?a===n:a.kind===n.kind&&a.key===n.key}function zi(a,n,t){var e={event:t,preventSigmaDefault:function(){return t.preventSigmaDefault()}},r=a.dragManager.session,i=r?{kind:"node",key:r.node}:Mi(a,n,"enter"),o=a.stateManager,s=o.hovered;vd(s,i)||(s&&(Di(a,s,!1),a.emit(Wt(s.kind,"leave"),Bt(s,e))),o.setHovered(i),i&&(Di(a,i,!0),a.emit(Wt(i.kind,"enter"),Bt(i,e))),a.updateContainerCursor())}function pd(a,n,t,e){e.handleResize=function(){return a.scheduleRefresh()},window.addEventListener("resize",e.handleResize),e.handleMove=function(i){a.hoverResolver.pointerMoved($e(i))},e.handleMoveBody=function(i){var o=$e(i),s=a.dragManager;if(s.pendingNode&&!s.session){var l=a.nodeStyleAnalysis,u=l.xAttribute,d=l.yAttribute,h=a.settings;s.start(s.pendingNode,o,h.getDraggedNodes,u||"x",d||"y"),s.pendingNode=null}s.session&&(s.applyMove(o,a.settings.dragPositionToAttributes),a.emit("nodeDrag",{node:s.session.node,allDraggedNodes:s.session.allNodes,event:o}),o.preventSigmaDefault()),a.emit("moveBody",{event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}})},e.handleLeave=function(i){var o=$e(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}};a.hoverResolver.pointerLeft(),zi(a,null,o),a.emit("leaveStage",s)},e.handleEnter=function(i){var o=$e(i);a.emit("enterStage",{event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}})};var r=function(o){return function(s){var l=$e(s),u={event:l,preventSigmaDefault:function(){return l.preventSigmaDefault()}},d=Aa(a,l,o);if(d){a.emit(Wt(d.kind,o),Bt(d,u));return}a.emit("".concat(o,"Stage"),u)}};e.handleClick=r("click"),e.handleRightClick=r("rightClick"),e.handleDoubleClick=r("doubleClick"),e.handleWheel=r("wheel"),e.handleDown=function(i){var o=$e(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}},l=Aa(a,o,"down");if(l){l.kind==="node"&&a.settings.enableNodeDrag&&(a.dragManager.pendingNode=l.key),a.emit(Wt(l.kind,"down"),Bt(l,s));return}a.emit("downStage",s)},e.handleUp=function(i){var o=$e(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}},l=a.dragManager.end();l&&a.emit("nodeDragEnd",W({node:l.node,allDraggedNodes:l.allNodes},s));var u=Aa(a,o,"up");if(u){a.emit(Wt(u.kind,"up"),Bt(u,s));return}a.emit("upStage",s)},n.on("mousemove",e.handleMove),n.on("mousemovebody",e.handleMoveBody),n.on("click",e.handleClick),n.on("rightClick",e.handleRightClick),n.on("doubleClick",e.handleDoubleClick),n.on("wheel",e.handleWheel),n.on("mousedown",e.handleDown),n.on("mouseup",e.handleUp),n.on("mouseleave",e.handleLeave),n.on("mouseenter",e.handleEnter),t.on("touchdown",e.handleDown),t.on("touchdown",e.handleMove),t.on("touchup",e.handleUp),t.on("touchmove",e.handleMove),t.on("tap",e.handleClick),t.on("doubletap",e.handleDoubleClick),t.on("touchmove",e.handleMoveBody)}function md(a,n){var t=a.graph,e=new Set(["x","y","zIndex","type"]);n.eachNodeAttributesUpdatedGraphUpdate=function(r){var i,o=(i=r.hints)===null||i===void 0?void 0:i.attributes,s=!o||o.some(function(l){return e.has(l)});a.refresh({partialGraph:{nodes:t.nodes()},skipIndexation:!s,schedule:!0})},n.eachEdgeAttributesUpdatedGraphUpdate=function(r){var i,o=(i=r.hints)===null||i===void 0?void 0:i.attributes,s=o&&["zIndex","type"].some(function(l){return o?.includes(l)});a.refresh({partialGraph:{edges:t.edges()},skipIndexation:!s,schedule:!0})},n.addNodeGraphUpdate=function(r){a.addNode(r.key),a.refresh({partialGraph:{nodes:[r.key]},skipIndexation:!1,schedule:!0})},n.updateNodeGraphUpdate=function(r){a.refresh({partialGraph:{nodes:[r.key]},skipIndexation:!1,schedule:!0})},n.dropNodeGraphUpdate=function(r){a.removeNode(r.key),a.refresh({schedule:!0})},n.addEdgeGraphUpdate=function(r){var i=r.key;a.edgeGroups.register(i),a.addEdge(i);var o=a.edgeGroups.getSiblings(i),s=z(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;a.addEdge(u)}}catch(d){s.e(d)}finally{s.f()}a.refresh({partialGraph:{edges:[i].concat(V(o))},schedule:!0})},n.updateEdgeGraphUpdate=function(r){a.refresh({partialGraph:{edges:[r.key]},skipIndexation:!1,schedule:!0})},n.dropEdgeGraphUpdate=function(r){var i=r.key,o=a.edgeGroups.getSiblings(i);a.edgeGroups.unregister(i),a.removeEdge(i);var s=z(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;a.addEdge(u)}}catch(d){s.e(d)}finally{s.f()}a.refresh({schedule:!0})},n.clearEdgesGraphUpdate=function(){a.clearEdgeState(),a.clearEdgeIndices(),a.refresh({schedule:!0})},n.clearGraphUpdate=function(){a.clearEdgeState(),a.clearNodeState(),a.clearEdgeIndices(),a.clearNodeIndices(),a.refresh({schedule:!0})},t.on("nodeAdded",n.addNodeGraphUpdate),t.on("nodeDropped",n.dropNodeGraphUpdate),t.on("nodeAttributesUpdated",n.updateNodeGraphUpdate),t.on("eachNodeAttributesUpdated",n.eachNodeAttributesUpdatedGraphUpdate),t.on("edgeAdded",n.addEdgeGraphUpdate),t.on("edgeDropped",n.dropEdgeGraphUpdate),t.on("edgeAttributesUpdated",n.updateEdgeGraphUpdate),t.on("eachEdgeAttributesUpdated",n.eachEdgeAttributesUpdatedGraphUpdate),t.on("edgesCleared",n.clearEdgesGraphUpdate),t.on("cleared",n.clearGraphUpdate)}function yd(a,n){a.removeListener("nodeAdded",n.addNodeGraphUpdate),a.removeListener("nodeDropped",n.dropNodeGraphUpdate),a.removeListener("nodeAttributesUpdated",n.updateNodeGraphUpdate),a.removeListener("eachNodeAttributesUpdated",n.eachNodeAttributesUpdatedGraphUpdate),a.removeListener("edgeAdded",n.addEdgeGraphUpdate),a.removeListener("edgeDropped",n.dropEdgeGraphUpdate),a.removeListener("edgeAttributesUpdated",n.updateEdgeGraphUpdate),a.removeListener("eachEdgeAttributesUpdated",n.eachEdgeAttributesUpdatedGraphUpdate),a.removeListener("edgesCleared",n.clearEdgesGraphUpdate),a.removeListener("cleared",n.clearGraphUpdate)}var bd={x:.5,y:.5,angle:0,ratio:1},xd=8,_d=.001;function Td(a){var n=a.coords,t=a.nodeData,e=a.dimensions,r=a.stagePadding,i=a.zoomToSizeRatioFunction,o=a.itemSizesReference,s=a.fitLabels,l=a.nodeLabelBox,u=Object.keys(n);if(!u.length)return a.extent;for(var d=i(1)||1,h=o==="positions",c=e.width,f=e.height,v=a.extent,y=0;y<xd;y++){for(var m=cn(v),g={width:v.x[1]-v.x[0]||1,height:v.y[1]-v.y[0]||1},p=Le(bd,e,g,r),b=Ri(p,m({x:0,y:0}),c,f),x=Ri(p,m({x:1,y:0}),c,f),_=Math.hypot(x.x-b.x,x.y-b.y)||1,T=1/0,A=-1/0,E=1/0,R=-1/0,L=0,k=u.length;L<k;L++){var w=u[L],F=t[w],C=F.size/d*(h?_:1),N=-C,G=C,M=-C,P=C;if(s){var D=l(F,C);D&&(D.minX<N&&(N=D.minX),D.maxX>G&&(G=D.maxX),D.minY<M&&(M=D.minY),D.maxY>P&&(P=D.maxY))}var I=n[w],H=I.x,O=I.y;T=Math.min(T,H+N/_),A=Math.max(A,H+G/_),E=Math.min(E,O-P/_),R=Math.max(R,O-M/_)}var $={x:[T,A],y:[E,R]},X=Math.max($.x[1]-$.x[0],$.y[1]-$.y[0])||1,Z=Math.max(Math.abs($.x[0]-v.x[0]),Math.abs($.x[1]-v.x[1]),Math.abs($.y[0]-v.y[0]),Math.abs($.y[1]-v.y[1]));if(v=$,Z/X<_d)break}return v}function Ri(a,n,t,e){var r=nt(a,n);return{x:(1+r.x)*t/2,y:(1-r.y)*e/2}}var Sd=typeof navigator<"u"&&/Mac|iP(hone|ad|od)/.test(navigator.platform),Ed=1500,Ad=`.sigma-gesture-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
  background: #00000066;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: opacity 0.1s;
}`;function wi(a){var n,t,e=st("style");e.textContent=a,document.head.appendChild(e);var r=((n=(t=e.sheet)===null||t===void 0?void 0:t.cssRules.length)!==null&&n!==void 0?n:0)>0;return e.remove(),r}var Ve=null;function Dd(){return Ve===null&&(Ve=Ad,wi("@scope {}")&&(Ve=`@scope {
`.concat(Ve,`
}`)),wi("@layer sigma-gesture-hint {}")&&(Ve=`@layer sigma-gesture-hint {
`.concat(Ve,`
}`))),Ve}var Rd=(function(){function a(n){q(this,a),S(this,"hideTimeout",null),this.styleElement=st("style"),this.styleElement.textContent=Dd(),n.appendChild(this.styleElement),this.element=st("div",{opacity:"0"},{class:"sigma-gesture-hint"}),n.appendChild(this.element)}return Y(a,[{key:"show",value:function(t,e){var r=this,i=t==="touch"?e.sharedGestureTouchMessage:Sd?e.sharedGestureAppleWheelMessage:e.sharedGestureWheelMessage;i&&(this.element.textContent=i,this.element.style.opacity="1",typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.hideTimeout=window.setTimeout(function(){r.hideTimeout=null,r.element.style.opacity="0"},Ed))}},{key:"kill",value:function(){typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.styleElement.remove(),this.element.remove()}}])})(),wd=(function(){function a(n){q(this,a),S(this,"readBuffer",null),S(this,"fence",null),S(this,"result",new Uint8Array(4)),S(this,"generation",0),S(this,"readGeneration",0),S(this,"lastEvent",null),S(this,"active",!1),S(this,"dirty",!1),S(this,"rafId",null),S(this,"killed",!1),this.options=n}return Y(a,[{key:"pointerMoved",value:function(t){this.lastEvent=t,this.active=!0,!this.options.isRenderPending()&&this.request()}},{key:"pointerLeft",value:function(){this.active=!1,this.dirty=!1}},{key:"frameRendered",value:function(){this.request()}},{key:"invalidate",value:function(){this.generation++}},{key:"request",value:function(){if(!(this.killed||!this.active||!this.lastEvent)){if(this.fence){this.dirty=!0;return}this.startRead()}}},{key:"startRead",value:function(){var t=this.options,e=t.gl,r=t.getFrameBuffer,i=t.getPixelRatio,o=t.getDownSizingRatio;this.readGeneration=this.generation;var s=this.lastEvent,l=zn(e,s.x,s.y,i(),o()),u=Q(l,2),d=u[0],h=u[1];this.readBuffer||(this.readBuffer=e.createBuffer()),e.bindFramebuffer(e.FRAMEBUFFER,r()),e.bindBuffer(e.PIXEL_PACK_BUFFER,this.readBuffer),e.bufferData(e.PIXEL_PACK_BUFFER,4,e.STREAM_READ),e.readPixels(d,h,1,1,e.RGBA,e.UNSIGNED_BYTE,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),this.fence=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0),e.flush(),this.schedulePoll(s)}},{key:"schedulePoll",value:function(t){var e=this;this.rafId=requestAnimationFrame(function(){e.rafId=null,e.poll(t)})}},{key:"poll",value:function(t){var e=this.options,r=e.gl,i=e.onIndex;if(!(this.killed||!this.fence)){var o=r.clientWaitSync(this.fence,0,0);if(o===r.TIMEOUT_EXPIRED){this.schedulePoll(t);return}if(r.deleteSync(this.fence),this.fence=null,o!==r.WAIT_FAILED&&this.readGeneration===this.generation){r.bindBuffer(r.PIXEL_PACK_BUFFER,this.readBuffer),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,this.result),r.bindBuffer(r.PIXEL_PACK_BUFFER,null);var s=Q(this.result,4),l=s[0],u=s[1],d=s[2],h=s[3];this.active&&i(Wn(l,u,d,h),t)}this.dirty&&(this.dirty=!1,this.active&&this.lastEvent&&!this.options.isRenderPending()&&this.startRead())}}},{key:"reset",value:function(){this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null,this.fence=null,this.readBuffer=null,this.dirty=!1}},{key:"kill",value:function(){this.killed=!0,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null;var t=this.options.gl;this.fence&&t.deleteSync(this.fence),this.fence=null,this.readBuffer&&t.deleteBuffer(this.readBuffer),this.readBuffer=null}}])})(),Ci=(function(){function a(n,t){q(this,a),this.key=n,this.size=t}return Y(a,null,[{key:"compare",value:function(t,e){return t.size>e.size?-1:t.size<e.size||t.key>e.key?1:-1}}])})(),Cn=(function(){function a(){q(this,a),S(this,"width",0),S(this,"height",0),S(this,"cellSize",0),S(this,"columns",0),S(this,"rows",0),S(this,"cells",{})}return Y(a,[{key:"resizeAndClear",value:function(t,e){this.width=t.width,this.height=t.height,this.cellSize=e,this.columns=Math.ceil(t.width/e),this.rows=Math.ceil(t.height/e),this.cells={}}},{key:"getIndex",value:function(t){var e=Math.floor(t.x/this.cellSize),r=Math.floor(t.y/this.cellSize);return r*this.columns+e}},{key:"add",value:function(t,e,r){var i=new Ci(t,e),o=this.getIndex(r),s=this.cells[o];s||(s=[],this.cells[o]=s),s.push(i)}},{key:"organize",value:function(){for(var t in this.cells){var e=this.cells[t];e.sort(Ci.compare)}}},{key:"getLabelsToDisplay",value:function(t,e,r){var i=this.cellSize*this.cellSize,o=i/t/t,s=o*e/i,l=Math.ceil(s),u=[];if(r)for(var d=Math.max(0,Math.floor(r.x1/this.cellSize)),h=Math.min(this.columns-1,Math.floor(r.x2/this.cellSize)),c=Math.max(0,Math.floor(r.y1/this.cellSize)),f=Math.min(this.rows-1,Math.floor(r.y2/this.cellSize)),v=c;v<=f;v++)for(var y=d;y<=h;y++){var m=v*this.columns+y,g=this.cells[m];if(g)for(var p=0;p<Math.min(l,g.length);p++)u.push(g[p].key)}else for(var b in this.cells)for(var x=this.cells[b],_=0;_<Math.min(l,x.length);_++)u.push(x[_].key);return u}}])})();function Cd(a){var n=a.graph,t=a.hoveredNode,e=a.highlightedNodes,r=a.displayedNodeLabels,i=new Set,o=new Set(e);t&&o.add(t);var s=z(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;n.hasNode(u)&&n.forEachEdge(u,function(f){i.add(f)})}}catch(f){s.e(f)}finally{s.f()}var d=z(r),h;try{var c=function(){var v=h.value;if(o.has(v))return 1;n.forEachEdge(v,function(y,m,g,p){var b=g===v?p:g;r.has(b)&&i.add(y)})};for(d.s();!(h=d.n()).done;)c()}catch(f){d.e(f)}finally{d.f()}return Array.from(i)}var vt=150,pt=50,Ld={both:0,node:1,label:2},kd={over:0,above:1,below:2,auto:3},Li=12,Pd=3,Fd=(function(){function a(n){q(this,a),S(this,"labelGrid",new Cn),S(this,"edgeAnchorGrid",new Cn),S(this,"displayedNodeLabels",new Set),S(this,"displayedEdgeLabels",new Set),S(this,"edgeLabelCandidates",[]),S(this,"renderedNodeLabels",new Set),S(this,"labelSizeCache",new Map),S(this,"framePassPoints",new Float32Array(0)),S(this,"labelsDirty",!0),this.internals=n}return Y(a,[{key:"resetFrame",value:function(){this.displayedNodeLabels=new Set,this.renderedNodeLabels=new Set,this.labelSizeCache.clear()}},{key:"clearEdgeLabels",value:function(){this.displayedEdgeLabels=new Set}},{key:"resetLabelGrid",value:function(){this.labelGrid=new Cn,this.edgeAnchorGrid=new Cn}},{key:"processWebGLLabels",value:function(t){for(var e,r=this.internals,i=r.labelProgram,o=r.primitives,s=r.nodeDataCache,l=(o==null||(e=o.nodes)===null||e===void 0||(e=e.label)===null||e===void 0||(e=e.font)===null||e===void 0?void 0:e.family)||"sans-serif",u=new Map,d=0,h=t.length;d<h;d++){var c=t[d],f=s[c];if(!(f.visibility==="hidden"||!f.label)){var v=f.labelFont||l,y=u.get(v);y?y.push(f.label):u.set(v,[f.label])}}var m=z(u),g;try{for(m.s();!(g=m.n()).done;){var p=Q(g.value,2),b=p[0],x=p[1],_=vn(b),T=_.family,A=_.weight,E=_.style,R=i.registerFont(T,A,E);i.ensureGlyphsReady(x,R)}}catch(L){m.e(L)}finally{m.f()}}},{key:"measureNodeLabel",value:function(t){var e,r;if(!t.label)return{width:0,height:0,textHeight:0};var i=this.internals,o=i.labelProgram,s=i.primitives,l=(e=t.labelSize)!==null&&e!==void 0?e:14,u=t.labelFont||(s==null||(r=s.nodes)===null||r===void 0||(r=r.label)===null||r===void 0||(r=r.font)===null||r===void 0?void 0:r.family)||"sans-serif",d="".concat(t.label,"|").concat(l,"|").concat(u);if(this.labelSizeCache.has(d))return this.labelSizeCache.get(d);var h=vn(u),c=h.family,f=h.weight,v=h.style,y=o.registerFont(c,f,v),m=o.measureLabel(t.label,l,y);return this.labelSizeCache.set(d,m),m}},{key:"nodeLabelBox",value:function(t,e){var r,i,o,s,l;if(t.visibility==="hidden"||t.labelVisibility==="hidden")return null;var u=this.measureNodeLabel(t),d=u.width,h=u.height,c=u.textHeight;if(!d)return null;var f=(r=(i=this.internals.primitives)===null||i===void 0||(i=i.nodes)===null||i===void 0||(i=i.label)===null||i===void 0?void 0:i.margin)!==null&&r!==void 0?r:dt,v=e+f,y=t.labelBackgroundColor?(o=t.labelBackgroundPadding)!==null&&o!==void 0?o:ha:0,m=d/2,g=h/2,p=m+y,b=g+y,x=c/2,_=0,T=0;switch((s=t.labelPosition)!==null&&s!==void 0?s:"right"){case"left":_=-(v+m);break;case"above":T=-(v+x);break;case"below":T=v+x;break;case"over":break;default:_=v+m}var A=(l=t.labelAngle)!==null&&l!==void 0?l:0,E=Mn({x:_,y:T},A),R=E.x,L=E.y,k=Math.abs(Math.cos(A)),w=Math.abs(Math.sin(A)),F=k*p+w*b,C=w*p+k*b;return{minX:R-F,maxX:R+F,minY:L-C,maxY:L+C}}},{key:"computeDisplayedNodeLabels",value:function(){var t=this.internals.getCameraState(),e=this.internals.getDimensions(),r=e.width,i=e.height,o=this.internals.viewportToFramedGraph({x:-vt,y:-pt}),s=this.internals.viewportToFramedGraph({x:r+vt,y:-pt}),l=this.internals.viewportToFramedGraph({x:-vt,y:i+pt}),u=this.internals.viewportToFramedGraph({x:r+vt,y:i+pt}),d=Math.min(o.x,s.x,l.x,u.x),h=Math.max(o.x,s.x,l.x,u.x),c=Math.min(o.y,s.y,l.y,u.y),f=Math.max(o.y,s.y,l.y,u.y),v=Le({x:.5,y:.5,ratio:1,angle:0},{width:r,height:i},this.internals.getGraphDimensions(),this.internals.getStagePadding()),y=function(D){var I=nt(v,D);return{x:(1+I.x)*r/2,y:(1-I.y)*i/2}},m=y({x:d,y:c}),g=y({x:h,y:c}),p=y({x:d,y:f}),b=y({x:h,y:f}),x={x1:Math.min(m.x,g.x,p.x,b.x),y1:Math.min(m.y,g.y,p.y,b.y),x2:Math.max(m.x,g.x,p.x,b.x),y2:Math.max(m.y,g.y,p.y,b.y)},_=this.internals,T=_.settings,A=_.nodeDataCache,E=_.nodesWithForcedLabels,R=this.labelGrid.getLabelsToDisplay(t.ratio,T.labelDensity,x);ea(R,E);for(var L=0,k=R.length;L<k;L++){var w=R[L],F=A[w];if(!this.displayedNodeLabels.has(w)&&!(F.visibility==="hidden"||F.labelVisibility==="hidden")&&F.label&&!(F.x<d||F.x>h||F.y<c||F.y>f)){var C=this.internals.framedGraphToViewport(F),N=C.x,G=C.y,M=this.internals.scaleSize(F.size);!Pe(F)&&M<T.labelRenderedSizeThreshold||N<-vt-M||N>r+vt+M||G<-pt-M||G>i+pt+M||this.displayedNodeLabels.add(w)}}}},{key:"buildFramePassPoints",value:function(){var t=this.internals,e=t.nodeDataCache,r=t.nodeDataTexture;if(!r)return{data:this.framePassPoints,count:0};var i=this.displayedNodeLabels.size*3;this.framePassPoints.length<i&&(this.framePassPoints=new Float32Array(i));var o=this.framePassPoints,s=0,l=z(this.displayedNodeLabels),u;try{for(l.s();!(u=l.n()).done;){var d,h,c=u.value,f=e[c];if(f){var v=r.getIndex(c);v<0||(o[s*3]=v,o[s*3+1]=(d=ut[f.labelPosition||Re.labelPosition])!==null&&d!==void 0?d:0,o[s*3+2]=(h=f.labelAngle)!==null&&h!==void 0?h:0,s++)}}}catch(y){l.e(y)}finally{l.f()}return{data:o,count:s}}},{key:"renderWebGLLabels",value:function(t,e){var r=this.internals,i=r.nodeDataCache,o=r.labelProgram,s=r.primitives,l=r.nodeDataTexture,u=[],d=z(this.displayedNodeLabels),h;try{for(d.s();!(h=d.n()).done;){var c=h.value;if(!this.renderedNodeLabels.has(c)){var f=i[c];e&&f.labelDepth!==e||(this.renderedNodeLabels.add(c),u.push(c))}}}catch(ce){d.e(ce)}finally{d.f()}if(u.length!==0){if(this.labelsDirty){for(var v,y,m,g=0,p=0,b=u.length;p<b;p++){var x=i[u[p]];g+=x.label.length}o.reallocate(g);for(var _=14,T=(v=s==null||(y=s.nodes)===null||y===void 0||(y=y.label)===null||y===void 0?void 0:y.margin)!==null&&v!==void 0?v:dt,A=Re.labelPosition,E=(s==null||(m=s.nodes)===null||m===void 0||(m=m.label)===null||m===void 0||(m=m.font)===null||m===void 0?void 0:m.family)||"sans-serif",R=new Map,L=0,k=0,w=u.length;k<w;k++){var F,C,N,G,M=u[k],P=i[M],D=P.labelFont||E,I=R.get(D);if(I===void 0){var H=vn(D),O=H.family,$=H.weight,X=H.style;I=o.registerFont(O,$,X),R.set(D,I)}var Z={text:P.label,x:P.x,y:P.y,size:(F=P.labelSize)!==null&&F!==void 0?F:_,color:P.labelColor,nodeSize:P.size,margin:T,position:(C=P.labelPosition)!==null&&C!==void 0?C:A,hidden:!1,forceLabel:Pe(P),type:"default",zIndex:(N=P.zIndex)!==null&&N!==void 0?N:0,parentType:"node",parentKey:M,fontKey:I,labelAngle:(G=P.labelAngle)!==null&&G!==void 0?G:0,nodeIndex:l.getIndex(M)},re=o.processLabel(M,L,Z);L+=re}o.invalidateBuffers()}o.render(t)}}},{key:"renderBackdrops",value:function(t,e){var r=this.internals,i=r.backdropProgram,o=r.nodeDataCache,s=r.nodesWithBackdrop,l=r.attachmentManager,u=r.pixelRatio,d=r.nodeDataTexture,h=[],c=z(s),f;try{for(c.s();!(f=c.n()).done;){var v,y=f.value,m=o[y];if(!(!m||m.visibility==="hidden")&&!(e&&m.depth!==e)){var g=(v=d?.getIndex(y))!==null&&v!==void 0?v:-1;g<0||h.push({key:y,nodeIndex:g})}}}catch(Ne){c.e(Ne)}finally{c.f()}if(h.length!==0){i.reallocate(h.length);for(var p=0;p<h.length;p++){var b,x,_,T,A,E,R,L,k=h[p],w=k.key,F=k.nodeIndex,C=o[w],N=this.displayedNodeLabels.has(w),G=N?this.measureNodeLabel(C):{width:0,height:0,textHeight:0},M=G.textHeight,P=G.width,D=G.height,I=0,H=0;if(N&&C.labelAttachment&&l){var O=l.getEntry(w,C.labelAttachment);if(O){var $=C.labelAttachmentPlacement||"below";if($==="below"||$==="above"){var X=O.height/u;D+=X+Ge,P=Math.max(P,O.width/u),H=$==="below"?(X+Ge)/2:-(X+Ge)/2}else{var Z=O.width/u;P+=Z+Ge,D=Math.max(D,O.height/u),I=$==="right"?(Z+Ge)/2:-(Z+Ge)/2}}}var re=C.backdropColor?ke(C.backdropColor):[255,255,255,255],ce=C.backdropShadowColor?ke(C.backdropShadowColor):[0,0,0,128],be=re.map(function(Ne){return Ne/255}),mt=ce.map(function(Ne){return Ne/255}),Ut=(b=C.backdropShadowBlur)!==null&&b!==void 0?b:12,qe=(x=C.backdropPadding)!==null&&x!==void 0?x:6,Bi=C.backdropBorderColor?ke(C.backdropBorderColor):[0,0,0,0],Ui=Bi.map(function(Ne){return Ne/255}),Oi=(_=C.backdropBorderWidth)!==null&&_!==void 0?_:0,Hi=(T=C.backdropCornerRadius)!==null&&T!==void 0?T:0,Da=(A=C.backdropLabelPadding)!==null&&A!==void 0?A:-1,$i=Da<0?qe:Da,Vi=(E=Ld[(R=C.backdropArea)!==null&&R!==void 0?R:"both"])!==null&&E!==void 0?E:0,ji={key:w,nodeIndex:F,label:C.label,labelWidth:P,labelHeight:D,textHeight:M,type:"default",position:C.labelPosition||Re.labelPosition,labelAngle:(L=C.labelAngle)!==null&&L!==void 0?L:0,backdropColor:be,backdropShadowColor:mt,backdropShadowBlur:Ut,backdropPadding:qe,backdropBorderColor:Ui,backdropBorderWidth:Oi,backdropCornerRadius:Hi,backdropLabelPadding:$i,backdropArea:Vi,labelBoxOffset:[I,H]};i.processBackdrop(p,ji)}i.invalidateBuffers(),i.render(t)}}},{key:"renderLabelBackgrounds",value:function(t,e){var r=this.internals,i=r.labelBackgroundProgram,o=r.nodeDataCache,s=r.nodeDataTexture,l=le.nodeLabel.writesPickingThisFrame(this.internals),u=[],d=z(this.displayedNodeLabels),h;try{for(d.s();!(h=d.n()).done;){var c=h.value,f=o[c];!f||f.visibility==="hidden"||e&&f.labelDepth!==e||!l&&!f.labelBackgroundColor||u.push(c)}}catch(F){d.e(F)}finally{d.f()}if(u.length!==0){i.reallocate(u.length);for(var v=0;v<u.length;v++){var y,m,g,p,b=u[v],x=o[b],_=(y=s?.getIndex(b))!==null&&y!==void 0?y:-1;if(!(_<0)){var T=this.measureNodeLabel(x),A=T.width,E=T.height,R=T.textHeight,L=je(this.internals.pickingState,"nodeLabel",b)||je(this.internals.pickingState,"node",b),k=x.labelBackgroundColor?pe(x.labelBackgroundColor):pe("transparent"),w={nodeIndex:_,id:at(L),color:k,labelWidth:A,labelHeight:E,textHeight:R,positionMode:(m=ut[x.labelPosition||Re.labelPosition])!==null&&m!==void 0?m:0,labelAngle:(g=x.labelAngle)!==null&&g!==void 0?g:0,padding:(p=x.labelBackgroundPadding)!==null&&p!==void 0?p:ha};i.processLabelBackground(v,w)}}i.invalidateBuffers(),i.render(t)}}},{key:"cacheAttachments",value:function(t){var e=this.internals,r=e.attachmentManager,i=e.pixelRatio,o=e.nodeDataCache,s=e.nodesWithBackdrop,l=e.graph;if(r){var u=z(s),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;if(this.displayedNodeLabels.has(h)){var c=o[h];if(!(!c||c.visibility==="hidden")&&!(t&&c.depth!==t)&&c.labelAttachment){var f=l.getNodeAttributes(h),v=this.measureNodeLabel(c),y=v.width,m=v.height,g={node:h,attributes:f,pixelRatio:i,labelWidth:y,labelHeight:m};r.renderAttachment(h,c.labelAttachment,g)}}}}catch(p){u.e(p)}finally{u.f()}r.regenerateAtlas()}}},{key:"renderAttachments",value:function(t,e){var r=this.internals,i=r.attachmentManager,o=r.attachmentProgram,s=r.nodeDataCache,l=r.nodesWithBackdrop,u=r.pixelRatio,d=r.nodeDataTexture;if(!(!i||!o)){var h=0;o.reallocateAttachments(l.size);var c=z(l),f;try{for(c.s();!(f=c.n()).done;){var v,y,m,g,p=f.value;if(this.displayedNodeLabels.has(p)){var b=s[p];if(!(!b||b.visibility==="hidden")&&!(e&&b.labelDepth!==e)&&b.labelAttachment){var x=i.getEntry(p,b.labelAttachment);if(x){var _=(v=d?.getIndex(p))!==null&&v!==void 0?v:-1;if(!(_<0)){var T=this.measureNodeLabel(b),A=T.width,E=T.height,R=T.textHeight,L=(y=Yr[b.labelAttachmentPlacement||"below"])!==null&&y!==void 0?y:0;o.processAttachment(h,{nodeIndex:_,atlasX:x.x,atlasY:x.y,atlasW:x.width,atlasH:x.height,attachWidth:x.width/u,attachHeight:x.height/u,positionMode:(m=ut[b.labelPosition||Re.labelPosition])!==null&&m!==void 0?m:0,attachmentPlacement:L,labelWidth:A,labelHeight:E,textHeight:R,labelAngle:(g=b.labelAngle)!==null&&g!==void 0?g:0}),h++}}}}}}catch(k){c.e(k)}finally{c.f()}h!==0&&(o.reallocateAttachments(h),i.bindTexture(Gt),o.invalidateBuffers(),o.render(t))}}},{key:"computeDisplayedEdgeLabels",value:function(){var t=this.internals,e=t.graph,r=t.stateManager,i=t.settings,o=t.edgesWithForcedLabels,s=r.getHighlightedNodes(),l=i.edgeLabelAnchors==="allNodes"?new Set(this.edgeAnchorGrid.getLabelsToDisplay(this.internals.getCameraState().ratio,i.labelDensity)):this.displayedNodeLabels,u=r.hovered,d=Cd({graph:e,hoveredNode:u?.kind==="node"?u.key:null,displayedNodeLabels:l,highlightedNodes:s});ea(d,o),this.edgeLabelCandidates=d,this.displayedEdgeLabels=new Set}},{key:"filterEdgeLabelsForDepth",value:function(t){for(var e=this.internals,r=e.graph,i=e.nodeDataCache,o=e.edgeDataCache,s=[],l=new Set,u=0,d=this.edgeLabelCandidates.length;u<d;u++){var h=this.edgeLabelCandidates[u];if(!l.has(h)){l.add(h);var c=r.extremities(h),f=i[c[0]],v=i[c[1]],y=o[h];!y||!f||!v||y.visibility==="hidden"||y.labelVisibility==="hidden"||f.visibility==="hidden"||v.visibility==="hidden"||t&&y.labelDepth!==t||y.label&&s.push(h)}}return s}},{key:"renderEdgeLabels",value:function(t,e){var r=this.internals,i=r.graph,o=r.nodeDataCache,s=r.edgeDataCache,l=r.primitives,u=r.edgeLabelProgram,d=r.nodeDataTexture,h=r.edgeDataTexture,c=this.filterEdgeLabelsForDepth(e),f=z(c),v;try{for(f.s();!(v=f.n()).done;){var y=v.value;this.displayedEdgeLabels.add(y)}}catch(Z){f.e(Z)}finally{f.f()}if(c.length!==0){if(this.labelsDirty){var m,g,p=0,b=z(c),x;try{for(b.s();!(x=b.n()).done;){var _=x.value;p+=s[_].label.length}}catch(Z){b.e(Z)}finally{b.f()}u.reallocate(p);var T=(m=l==null||(g=l.edges)===null||g===void 0||(g=g.label)===null||g===void 0?void 0:g.margin)!==null&&m!==void 0?m:5,A="over",E=0,R=z(c),L;try{for(R.s();!(L=R.n()).done;){var k,w,F=L.value,C=i.extremities(F),N=C[0],G=C[1],M=o[N],P=o[G],D=s[F],I=d.getIndex(N),H=d.getIndex(G),O=h.getIndex(F),$={text:D.label,x:(M.x+P.x)/2,y:(M.y+P.y)/2,size:Li,color:D.labelColor,nodeSize:0,nodeIndex:-1,margin:T,position:(k=D.labelPosition)!==null&&k!==void 0?k:A,hidden:!1,forceLabel:Pe(D),type:"default",zIndex:(w=D.zIndex)!==null&&w!==void 0?w:0,parentType:"edge",parentKey:F,fontKey:"",labelAngle:0,sourceX:M.x,sourceY:M.y,targetX:P.x,targetY:P.y,sourceSize:M.size,targetSize:P.size,sourceShape:M.shape||"circle",targetShape:P.shape||"circle",edgeSize:D.size,offset:0,edgeAttributes:D,sourceNodeIndex:I,targetNodeIndex:H,edgeIndex:O},X=u.processEdgeLabel(F,E,$);E+=X}}catch(Z){R.e(Z)}finally{R.f()}u.invalidateBuffers()}u.render(t)}}},{key:"renderEdgeLabelBackgrounds",value:function(t,e){var r,i,o=this.internals,s=o.edgeLabelBackgroundProgram,l=o.edgeLabelProgram,u=o.edgeDataCache,d=o.primitives,h=o.edgeDataTexture;if(h){var c=le.edgeLabel.writesPickingThisFrame(this.internals),f=(r=d==null||(i=d.edges)===null||i===void 0||(i=i.label)===null||i===void 0?void 0:i.margin)!==null&&r!==void 0?r:5,v="over",y=this.filterEdgeLabelsForDepth(e),m=[],g=z(y),p;try{for(g.s();!(p=g.n()).done;){var b=p.value;!c&&!u[b].labelBackgroundColor||m.push(b)}}catch(M){g.e(M)}finally{g.f()}if(m.length!==0){s.reallocate(m.length);for(var x=0;x<m.length;x++){var _,T,A,E=m[x],R=u[E],L=R.label,k=l.measureLabelAtlasWidth(L),w=(_=R.labelPosition)!==null&&_!==void 0?_:v,F=typeof w=="string"&&(T=kd[w])!==null&&T!==void 0?T:0,C=je(this.internals.pickingState,"edgeLabel",E)||je(this.internals.pickingState,"edge",E),N=R.labelBackgroundColor?pe(R.labelBackgroundColor):pe("transparent"),G={edgeIndex:h.getIndex(E),baseFontSize:Li,totalTextWidth:k,positionMode:F,margin:f,padding:(A=R.labelBackgroundPadding)!==null&&A!==void 0?A:Pd,color:N,id:at(C),edgeAttributes:R};s.processEdgeLabelBackground(x,E,G)}s.invalidateBuffers(),s.render(t)}}}}])})(),Id=(function(){function a(n,t,e,r){q(this,a),S(this,"nodeStates",new Map),S(this,"edgeStates",new Map),S(this,"hovered",null),S(this,"dirtyNodes",new Set),S(this,"dirtyEdges",new Set),S(this,"graphStateChanged",!1),S(this,"graphStateFlagsDirty",!1),this.scheduleRefresh=n,this.customNodeStateDefaults=t,this.customEdgeStateDefaults=e,this.customGraphStateDefaults=r,this.graphState=Xn(r)}return Y(a,[{key:"getNodeState",value:function(t){t=""+t;var e=this.nodeStates.get(t);return e||(e=_r(this.customNodeStateDefaults),this.nodeStates.set(t,e)),e}},{key:"getEdgeState",value:function(t){t=""+t;var e=this.edgeStates.get(t);return e||(e=Tr(this.customEdgeStateDefaults),this.edgeStates.set(t,e)),e}},{key:"getGraphState",value:function(){return this.flushGraphStateFlags(),this.graphState}},{key:"getHighlightedNodes",value:function(){var t=new Set,e=z(this.nodeStates),r;try{for(e.s();!(r=e.n()).done;){var i=Q(r.value,2),o=i[0],s=i[1];s.isHighlighted&&t.add(o)}}catch(l){e.e(l)}finally{e.f()}return t}},{key:"setNodeState",value:function(t,e){t=""+t;var r=this.getNodeState(t);if(ot(r,e)){var i=W(W({},r),e);this.nodeStates.set(t,i),this.dirtyNodes.add(t),this.updateHoveredNodeTracking(t,r,i),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}}},{key:"setEdgeState",value:function(t,e){t=""+t;var r=this.getEdgeState(t);if(ot(r,e)){var i=W(W({},r),e);this.edgeStates.set(t,i),this.dirtyEdges.add(t),this.updateHoveredEdgeTracking(t,r,i),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}}},{key:"setGraphState",value:function(t){if(ot(this.graphState,t)){var e=W(W({},this.graphState),t);e.isIdle=!e.isPanning&&!e.isZooming&&!e.isDragging,this.graphState=e,this.graphStateChanged=!0,this.scheduleRefresh()}}},{key:"setNodesState",value:function(t,e){var r=!1,i=z(t),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s=""+s;var l=this.getNodeState(s);if(ot(l,e)){var u=W(W({},l),e);this.nodeStates.set(s,u),this.dirtyNodes.add(s),this.updateHoveredNodeTracking(s,l,u),r=!0}}}catch(d){i.e(d)}finally{i.f()}r&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}},{key:"setEdgesState",value:function(t,e){var r=!1,i=z(t),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s=""+s;var l=this.getEdgeState(s);if(ot(l,e)){var u=W(W({},l),e);this.edgeStates.set(s,u),this.dirtyEdges.add(s),this.updateHoveredEdgeTracking(s,l,u),r=!0}}}catch(d){i.e(d)}finally{i.f()}r&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}},{key:"removeNode",value:function(t){this.nodeStates.delete(t),this.dirtyNodes.delete(t),this.clearHoveredFor("node",t)}},{key:"removeEdge",value:function(t){this.edgeStates.delete(t),this.dirtyEdges.delete(t),this.clearHoveredFor("edge",t)}},{key:"pruneNodes",value:function(t){var e=z(this.nodeStates.keys()),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;t(i)||this.removeNode(i)}}catch(o){e.e(o)}finally{e.f()}}},{key:"pruneEdges",value:function(t){var e=z(this.edgeStates.keys()),r;try{for(e.s();!(r=e.n()).done;){var i=r.value;t(i)||this.removeEdge(i)}}catch(o){e.e(o)}finally{e.f()}}},{key:"clearNodes",value:function(){this.nodeStates.clear(),this.dirtyNodes.clear(),this.clearHoveredForKinds(Ea("node"))}},{key:"clearEdges",value:function(){this.edgeStates.clear(),this.dirtyEdges.clear(),this.clearHoveredForKinds(Ea("edge"))}},{key:"resetGraphState",value:function(){this.graphState=Xn(this.customGraphStateDefaults),this.graphStateChanged=!1,this.graphStateFlagsDirty=!1}},{key:"clearDirtyTracking",value:function(){this.dirtyNodes.clear(),this.dirtyEdges.clear(),this.graphStateChanged=!1}},{key:"setHovered",value:function(t){this.hovered=t}},{key:"clearHoveredFor",value:function(t,e){this.hovered&&this.hovered.key===e&&Ea(t).includes(this.hovered.kind)&&(this.hovered=null)}},{key:"clearHoveredForKinds",value:function(t){this.hovered&&t.includes(this.hovered.kind)&&(this.hovered=null)}},{key:"updateGraphStateFromNodes",value:function(){var t,e=!1,r=!1,i=!1,o=z(this.nodeStates),s;try{for(o.s();!(s=o.n()).done;){var l=Q(s.value,2),u=l[1];if(u.isHovered&&(e=!0),u.isHighlighted&&(r=!0),u.isDragged&&(i=!0),e&&r&&i)break}}catch(h){o.e(h)}finally{o.f()}!e&&((t=this.hovered)===null||t===void 0?void 0:t.kind)==="edge"&&(e=!0);var d=!this.graphState.isPanning&&!this.graphState.isZooming&&!i;(this.graphState.hasHovered!==e||this.graphState.hasHighlighted!==r||this.graphState.isDragging!==i||this.graphState.isIdle!==d)&&(this.graphStateChanged=!0),this.graphState=W(W({},this.graphState),{},{hasHovered:e,hasHighlighted:r,isDragging:i,isIdle:d})}},{key:"updateGraphStateFromEdges",value:function(){var t,e=((t=this.hovered)===null||t===void 0?void 0:t.kind)==="node";if(!e){var r=z(this.edgeStates),i;try{for(r.s();!(i=r.n()).done;){var o=Q(i.value,2),s=o[1];if(s.isHovered){e=!0;break}}}catch(l){r.e(l)}finally{r.f()}}this.graphState.hasHovered!==e&&(this.graphStateChanged=!0),this.graphState=W(W({},this.graphState),{},{hasHovered:e})}},{key:"flushGraphStateFlags",value:function(){this.graphStateFlagsDirty&&(this.updateGraphStateFromNodes(),this.updateGraphStateFromEdges(),this.graphStateFlagsDirty=!1)}},{key:"updateHoveredNodeTracking",value:function(t,e,r){var i;if(e.isHovered!==r.isHovered)if(r.isHovered){var o;if(((o=this.hovered)===null||o===void 0?void 0:o.kind)==="node"&&this.hovered.key!==t){var s=this.hovered.key,l=this.getNodeState(s);this.nodeStates.set(s,W(W({},l),{},{isHovered:!1})),this.dirtyNodes.add(s)}this.hovered={kind:"node",key:t}}else((i=this.hovered)===null||i===void 0?void 0:i.kind)==="node"&&this.hovered.key===t&&(this.hovered=null)}},{key:"updateHoveredEdgeTracking",value:function(t,e,r){var i;if(e.isHovered!==r.isHovered)if(r.isHovered){var o;if(((o=this.hovered)===null||o===void 0?void 0:o.kind)==="edge"&&this.hovered.key!==t){var s=this.hovered.key,l=this.getEdgeState(s);this.edgeStates.set(s,W(W({},l),{},{isHovered:!1})),this.dirtyEdges.add(s)}this.hovered={kind:"edge",key:t}}else((i=this.hovered)===null||i===void 0?void 0:i.kind)==="edge"&&this.hovered.key===t&&(this.hovered=null)}}])})(),ki=1,Pi=2,Fi=3,Ii=4,Gd=(function(a){function n(t,e){var r,i,o,s,l,u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};q(this,n),l=te(this,n),S(l,"nodeReducer",null),S(l,"edgeReducer",null),S(l,"stageCanvas",null),S(l,"mouseLayer",null),S(l,"gestureHint",null),S(l,"extraElements",{}),S(l,"webGLContext",null),S(l,"pickingFrameBuffer",null),S(l,"pickingTexture",null),S(l,"pickingDepthBuffer",null),S(l,"activeListeners",{}),S(l,"nodeVariableEntries",[]),S(l,"edgeVariableEntries",[]),S(l,"edgePathsByName",new Map),S(l,"nodeProgramIndex",{}),S(l,"edgeProgramIndex",{}),S(l,"edgeTextureIndexCache",{}),S(l,"nodeGraphCoords",{}),S(l,"nodeExtent",{x:[0,1],y:[0,1]}),S(l,"matrix",ve()),S(l,"invMatrix",ve()),S(l,"correctionRatio",1),S(l,"frameId",0),S(l,"customBBox",null),S(l,"gpuTimerExt",void 0),S(l,"activeGpuTimerQuery",null),S(l,"pendingGpuTimerQueries",[]),S(l,"normalizationFunction",cn({x:[0,1],y:[0,1]})),S(l,"graphToViewportRatio",1),S(l,"pickingState",ud()),S(l,"prevNodeVisibilities",{}),S(l,"width",0),S(l,"height",0),S(l,"autoRescaleFrozen",!1),S(l,"stylesDeclaration",null),S(l,"resolvedStageStyle",{}),S(l,"renderFrame",null),S(l,"contextLost",!1),S(l,"pendingProcess","full"),S(l,"needToRefreshState",!1),S(l,"checkEdgesEventsFrame",null),S(l,"edgeStyleAnalysis",{dependency:"static",xAttribute:null,yAttribute:null}),S(l,"depthLayers",V(on)),S(l,"customLayerPrograms",new Map),S(l,"nodeShapeSlug",null),S(l,"sdfAtlas",null),S(l,"depthRanges",{nodes:{},edges:{}}),S(l,"nodeBaseDepth",{}),S(l,"edgeBaseDepth",{});var d=u.primitives,h=u.styles,c=u.settings,f=c===void 0?{}:c,v=u.nodeReducer,y=u.edgeReducer,m=u.customNodeState,g=u.customEdgeState,p=u.customGraphState;l.stateManager=new Id(function(){return l.scheduleStateRefresh()},m,g,p);var b=d??Jn;l.stylesDeclaration=h?{nodes:(r=h.nodes)!==null&&r!==void 0?r:At.nodes,edges:(i=h.edges)!==null&&i!==void 0?i:At.edges,stage:h.stage}:At,l.nodeReducer=v??null,l.edgeReducer=y??null;var x=ln(l.stylesDeclaration.nodes);l.nodeReducer&&(x.dependency="graph-state"),l.edgeStyleAnalysis=ln(l.stylesDeclaration.edges),l.edgeReducer&&(l.edgeStyleAnalysis.dependency="graph-state"),l.stylesDeclaration.stage&&(l.resolvedStageStyle=Zn(l.stylesDeclaration.stage,l.stateManager.graphState));var _=Lr(f);if(gn(_),_.enableNodeDrag){var T=x.xAttribute,A=x.yAttribute;if((!T||!A)&&!_.dragPositionToAttributes)throw new Error('Sigma: `enableNodeDrag` is true but position attribute names could not be inferred from styles. Either use attribute bindings for x/y in your node styles (e.g. `x: { attribute: "x" }`), or provide a `dragPositionToAttributes` setting.')}if(Cr(t),!(e instanceof HTMLElement))throw new Error("Sigma: container should be an html element.");l.container=e,l.edgeGroups=new ld(t,function(P,D){for(var I=0;I<P.length;I++){var H=l.stateManager.getEdgeState(P[I]);H.parallelIndex=I,H.parallelCount=D}});var E=new sd(t,l.viewportToGraph.bind(l),l.setNodesState.bind(l),function(P,D){return l.emit(P,D)});if(l.depthLayers=(o=b.depthLayers)!==null&&o!==void 0?o:V(on),!(h!=null&&h.nodes)&&!an.every(function(P){return l.depthLayers.includes(P)}))throw new Error("Sigma: depthLayers must include ".concat(an.join(", ")," for the built-in node styles."));if(!(h!=null&&h.edges)&&!rn.every(function(P){return l.depthLayers.includes(P)}))throw new Error("Sigma: depthLayers must include ".concat(rn.join(", ")," for the built-in edge styles."));l.itemBuckets={nodes:new xa(l.depthLayers),edges:new xa(l.depthLayers)},l.initWebGLContext(),l.mouseLayer=st("div",{position:"absolute",touchAction:"none",userSelect:"none"},{class:"sigma-mouse"}),l.container.appendChild(l.mouseLayer),l.resolvedStageStyle.background&&(l.container.style.backgroundColor=l.resolvedStageStyle.background),l.resolvedStageStyle.cursor&&(l.container.style.cursor=l.resolvedStageStyle.cursor);var R=new mi(l.webGLContext),L=new _a(l.webGLContext,{channels:1}),k=new yi(l.webGLContext),w=new _a(l.webGLContext,{channels:4}),F=l.webGLContext,C=new wd({gl:F,getFrameBuffer:function(){return l.pickingFrameBuffer},getPixelRatio:function(){return l.internals.pixelRatio},getDownSizingRatio:function(){return l.internals.settings.pickingDownSizingRatio},isRenderPending:function(){return l.renderFrame!==null},onIndex:function(D,I){var H;return zi(l.internals,(H=l.pickingState.lookup[D])!==null&&H!==void 0?H:null,I)}}),N=l.initPrograms(b,_),G=b==null||(s=b.nodes)===null||s===void 0?void 0:s.labelAttachments,M=null;return G&&Object.keys(G).length>0&&(M=new pi(F,G,function(){return l.scheduleRender()})),l.internals=W(W({nodeDataCache:{},edgeDataCache:{},nodesWithForcedLabels:new Set,nodesWithBackdrop:new Set,edgesWithForcedLabels:new Set,settings:_,primitives:b,pixelRatio:wt(),graph:t,stateManager:l.stateManager,dragManager:E,hoverResolver:C,nodeStyleAnalysis:x,pickingState:l.pickingState},N),{},{attachmentManager:M,nodeDataTexture:R,nodeFrameTexture:L,edgeDataTexture:k,edgeFrameTexture:w,getDimensions:function(){return l.getDimensions()},getGraphDimensions:function(){return l.getGraphDimensions()},getStagePadding:function(){return l.getStagePadding()},getCameraState:function(){return l.camera.getState()},getHitAtPosition:function(D){return l.getHitAtPosition(D)},setNodeState:function(D,I){return l.setNodeState(D,I)},setEdgeState:function(D,I){return l.setEdgeState(D,I)},updateContainerCursor:function(){return l.updateContainerCursor()},scheduleRefresh:function(){return l.scheduleRefresh()},viewportToFramedGraph:function(D){return l.viewportToFramedGraph(D)},viewportToGraph:function(D){return l.viewportToGraph(D)},framedGraphToViewport:function(D){return l.framedGraphToViewport(D)},scaleSize:function(D){return l.scaleSize(D)},emit:function(D,I){return l.emit(D,I)}}),l.labelRenderer=new Fd(l.internals),l.resize(),l.initializeWebGLLabels(),l.camera=new _i,l.bindCameraHandlers(),l.mouseCaptor=new ad(l.mouseLayer,l),l.mouseCaptor.setSettings(l.internals.settings),l.touchCaptor=new od(l.mouseLayer,l),l.touchCaptor.setSettings(l.internals.settings),l.bindEventHandlers(),l.bindGraphHandlers(),l.handleSettingsUpdate(),l.refresh(),l}return ne(n,a),Y(n,[{key:"initializeWebGLLabels",value:function(){this.sdfAtlas=new Ue,this.sdfAtlas.registerFont({family:"sans-serif",weight:"normal",style:"normal"})}},{key:"resetWebGLTexture",value:function(){var e=this.webGLContext;if(!this.pickingFrameBuffer)return this;var r=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),i=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);e.bindFramebuffer(e.FRAMEBUFFER,this.pickingFrameBuffer),this.pickingTexture&&e.deleteTexture(this.pickingTexture);var o=e.createTexture();o&&(e.bindTexture(e.TEXTURE_2D,o),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,i,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0),this.pickingTexture=o),this.pickingDepthBuffer&&e.deleteRenderbuffer(this.pickingDepthBuffer);var s=e.createRenderbuffer();return s&&(e.bindRenderbuffer(e.RENDERBUFFER,s),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,r,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,s),this.pickingDepthBuffer=s),e.bindFramebuffer(e.FRAMEBUFFER,null),this}},{key:"bindCameraHandlers",value:function(){var e=this;return this.activeListeners.camera=function(){e.refreshMatrices(),e.labelRenderer.labelsDirty=!0,e.scheduleRender()},this.activeListeners.cameraAnimationStart=function(r){var i=r.from,o=r.to;i.ratio!==o.ratio&&e.stateManager.setGraphState({isZooming:!0})},this.activeListeners.cameraAnimationEnd=function(){e.stateManager.setGraphState({isZooming:!1})},this.camera.on("updated",this.activeListeners.camera),this.camera.on("animationStart",this.activeListeners.cameraAnimationStart),this.camera.on("animationEnd",this.activeListeners.cameraAnimationEnd),this}},{key:"unbindCameraHandlers",value:function(){return this.camera.removeListener("updated",this.activeListeners.camera),this.camera.removeListener("animationStart",this.activeListeners.cameraAnimationStart),this.camera.removeListener("animationEnd",this.activeListeners.cameraAnimationEnd),this}},{key:"getHitAtPosition",value:function(e){var r;if(this.contextLost)return null;var i=this.webGLContext;i.bindFramebuffer(i.FRAMEBUFFER,this.pickingFrameBuffer);var o=rr(i,this.pickingFrameBuffer,e.x,e.y,this.internals.pixelRatio,this.internals.settings.pickingDownSizingRatio),s=Wn.apply(void 0,V(o));return(r=this.pickingState.lookup[s])!==null&&r!==void 0?r:null}},{key:"bindEventHandlers",value:function(){return pd(this.internals,this.mouseCaptor,this.touchCaptor,this.activeListeners),this}},{key:"bindGraphHandlers",value:function(){return md({graph:this.internals.graph,edgeGroups:this.edgeGroups,addNode:this.addNode.bind(this),updateNode:this.updateNode.bind(this),removeNode:this.removeNode.bind(this),addEdge:this.addEdge.bind(this),updateEdge:this.updateEdge.bind(this),removeEdge:this.removeEdge.bind(this),clearEdgeState:this.clearEdgeState.bind(this),clearNodeState:this.clearNodeState.bind(this),clearEdgeIndices:this.clearEdgeIndices.bind(this),clearNodeIndices:this.clearNodeIndices.bind(this),refresh:this.refresh.bind(this)},this.activeListeners),this}},{key:"unbindGraphHandlers",value:function(){yd(this.internals.graph,this.activeListeners)}},{key:"getNodeShapeId",value:function(e){return this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&e.shape&&e.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[e.shape]]:Ft(e.shape||"circle")}},{key:"processNodes",value:function(){var e=this,r=this.internals.graph,i=this.internals.settings,o=this.getDimensions(),s=i.autoRescale,l=i.autoRescaleContent,u=this.nodeExtent;if(s===!1){var d=o.width,h=o.height;u={x:[-d/2,d/2],y:[-h/2,h/2]}}else(s!=="once"||!this.autoRescaleFrozen)&&(u=this.computeNodeExtent(),l!=="positions"&&!this.customBBox&&(u=Td({extent:u,coords:this.nodeGraphCoords,nodeData:this.internals.nodeDataCache,dimensions:o,stagePadding:this.getStagePadding(),zoomToSizeRatioFunction:i.zoomToSizeRatioFunction,itemSizesReference:i.itemSizesReference,fitLabels:l==="labels",nodeLabelBox:function(H,O){return e.labelRenderer.nodeLabelBox(H,O)}})),s==="once"&&(this.autoRescaleFrozen=!0));this.nodeExtent=u,this.normalizationFunction=cn(this.customBBox||this.nodeExtent);var c=new _i,f=Le(c.getState(),o,this.getGraphDimensions(),this.getStagePadding());this.labelRenderer.labelGrid.resizeAndClear(o,i.labelGridCellSize),this.labelRenderer.edgeAnchorGrid.resizeAndClear(o,i.labelGridCellSize);var v=i.renderEdgeLabels&&i.edgeLabelAnchors==="allNodes",y=!1;Sa(this.pickingState,"node");for(var m=r.nodes(),g=0,p=m.length;g<p;g++){var b=m[g],x=this.internals.nodeDataCache[b],_=this.nodeGraphCoords[b];x.x=_.x,x.y=_.y,this.normalizationFunction.applyTo(x),x.visibility!==this.prevNodeVisibilities[b]&&(y=!0),typeof x.label=="string"&&x.visibility!=="hidden"&&x.labelVisibility!=="hidden"&&this.labelRenderer.labelGrid.add(b,x.size,this.framedGraphToViewport(x,{matrix:f})),v&&x.visibility!=="hidden"&&this.labelRenderer.edgeAnchorGrid.add(b,x.size,this.framedGraphToViewport(x,{matrix:f}))}this.labelRenderer.labelGrid.organize(),this.labelRenderer.edgeAnchorGrid.organize(),this.nodeProgram.reallocate(m.length);var T=0;this.depthRanges.nodes={},this.nodeBaseDepth={};var A=this.internals.nodeDataCache,E=z(this.depthLayers),R;try{for(E.s();!(R=E.n()).done;){var L=R.value,k=this.itemBuckets.nodes.getSorted(L,function(I){return A[I].zIndex});if(k.length!==0){this.depthRanges.nodes[L]=[{offset:T,count:k.length}];var w=z(k),F;try{for(w.s();!(F=w.n()).done;){var C=F.value;this.nodeBaseDepth[C]=L,this.nodeProgram.allocateNode(C),Ai(this.pickingState,"node",C),this.addNodeToProgram(C,T++)}}catch(I){w.e(I)}finally{w.f()}}}}catch(I){E.e(I)}finally{E.f()}this.nodeProgram.invalidateBuffers();for(var N=0,G=m.length;N<G;N++)this.prevNodeVisibilities[m[N]]=this.internals.nodeDataCache[m[N]].visibility;this.labelRenderer.processWebGLLabels(m);var M=z(this.customLayerPrograms.values()),P;try{for(M.s();!(P=M.n()).done;){var D=P.value.program;D.cacheData&&D.cacheData()}}catch(I){M.e(I)}finally{M.f()}return y}},{key:"processEdges",value:function(){var e=this.internals.graph,r=e.edges();this.edgeProgram.reallocate(r.length);var i=0;Sa(this.pickingState,"edge"),this.depthRanges.edges={},this.edgeBaseDepth={};var o=this.internals.edgeDataCache,s=z(this.depthLayers),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=this.itemBuckets.edges.getSorted(u,function(v){return o[v].zIndex});if(d.length!==0){this.depthRanges.edges[u]=[{offset:i,count:d.length}];var h=z(d),c;try{for(h.s();!(c=h.n()).done;){var f=c.value;this.edgeBaseDepth[f]=u,Ai(this.pickingState,"edge",f),this.addEdgeToProgram(f,i++)}}catch(v){h.e(v)}finally{h.f()}}}}catch(v){s.e(v)}finally{s.f()}this.edgeProgram.invalidateBuffers()}},{key:"updateNodeDepthRanges",value:function(e,r,i){var o=this.nodeProgramIndex[e];o!==void 0&&(aa(this.depthRanges.nodes,r,o),ra(this.depthRanges.nodes,i,o))}},{key:"updateEdgeDepthRanges",value:function(e,r,i){var o=this.edgeProgramIndex[e];o!==void 0&&(aa(this.depthRanges.edges,r,o),ra(this.depthRanges.edges,i,o))}},{key:"handleSettingsUpdate",value:function(){var e=this,r=this.internals.settings;return this.camera.minRatio=r.minCameraRatio,this.camera.maxRatio=r.maxCameraRatio,this.camera.enabledZooming=r.enableCameraZooming,this.camera.enabledPanning=r.enableCameraPanning,this.camera.enabledRotation=r.enableCameraRotation,r.cameraPanBoundaries?this.camera.constrainState=function(i){return e.cleanCameraState(i,r.cameraPanBoundaries&&K(r.cameraPanBoundaries)==="object"?r.cameraPanBoundaries:{})}:this.camera.constrainState=null,this.camera.setState(this.camera.getState()),this.mouseLayer.style.touchAction=r.gestureTarget==="graph"?"none":r.gestureTarget==="shared"?"pan-x pan-y":"auto",r.gestureTarget!=="shared"&&this.gestureHint&&(this.gestureHint.kill(),this.gestureHint=null),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor.setSettings(this.internals.settings),this}},{key:"cleanCameraState",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=r.tolerance,o=i===void 0?0:i,s=r.boundaries,l=W({},e),u=s||this.nodeExtent,d=Q(u.x,2),h=d[0],c=d[1],f=Q(u.y,2),v=f[0],y=f[1],m=[this.graphToViewport({x:h,y:v},{cameraState:e}),this.graphToViewport({x:c,y:v},{cameraState:e}),this.graphToViewport({x:h,y},{cameraState:e}),this.graphToViewport({x:c,y},{cameraState:e})],g=1/0,p=-1/0,b=1/0,x=-1/0;m.forEach(function(C){var N=C.x,G=C.y;g=Math.min(g,N),p=Math.max(p,N),b=Math.min(b,G),x=Math.max(x,G)});var _=p-g,T=x-b,A=this.getDimensions(),E=A.width,R=A.height,L=0,k=0;if(_>=E?p<E-o?L=p-(E-o):g>o&&(L=g-o):p>E+o?L=p-(E+o):g<-o&&(L=g+o),T>=R?x<R-o?k=x-(R-o):b>o&&(k=b-o):x>R+o?k=x-(R+o):b<-o&&(k=b+o),L||k){var w=this.viewportToFramedGraph({x:0,y:0},{cameraState:e}),F=this.viewportToFramedGraph({x:L,y:k},{cameraState:e});L=F.x-w.x,k=F.y-w.y,l.x+=L,l.y+=k}return l}},{key:"refreshMatrices",value:function(){var e=this.camera.getState(),r=this.getDimensions(),i=this.getGraphDimensions(),o=this.getStagePadding();this.matrix=Le(e,r,i,o),this.invMatrix=Le(e,r,i,o,!0),this.correctionRatio=er(this.matrix,e,r),this.graphToViewportRatio=this.getGraphToViewportRatio()}},{key:"processData",value:function(){var e;this.emit("beforeProcess"),(e=this.internals.attachmentManager)===null||e===void 0||e.clear();var r=W({},this.pickingState.idsByKind),i=this.processNodes();(this.pendingProcess==="full"||i)&&this.processEdges(),dd(this.pickingState,this.internals),hd(r,this.pickingState.idsByKind)||this.internals.hoverResolver.invalidate(),this.pendingProcess="none",this.emit("afterProcess")}},{key:"render",value:function(){var e=this;if(this.contextLost)return this;this.emit("beforeRender");var r=function(){return e.internals.hoverResolver.frameRendered(),e.emit("afterRender"),e};if(this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null),this.resize(),(this.pendingProcess!=="none"||this.needToRefreshState)&&(this.labelRenderer.labelsDirty=!0),this.pendingProcess!=="none"&&this.processData(),this.needToRefreshState&&this.refreshState(),this.needToRefreshState=!1,this.stateManager.clearDirtyTracking(),this.pendingProcess!=="none"&&this.processData(),this.clear(),this.resetWebGLTexture(),!this.internals.graph.order)return r();var i=this.mouseCaptor,o=this.camera.isAnimating()||i.isMoving||i.draggedEvents||i.currentWheelDirection;this.refreshMatrices(),this.frameId++;var s=this.internals.settings.DEBUG_logRenderStats?this.getDebugPrograms():null;s&&s.forEach(function(O){return O.resetDebugStats()}),this.internals.settings.DEBUG_gpuTimerQueries&&this.beginGpuTimerQuery(),this.internals.nodeFrameTexture.ensureCapacity(this.internals.nodeDataTexture.getCapacity()),this.internals.edgeFrameTexture.ensureCapacity(this.internals.edgeDataTexture.getCapacity());var l=this.getRenderParams(),u=le.edge.writesPickingThisFrame(this.internals)?l:W(W({},l),{},{pickingFrameBuffer:null});this.labelRenderer.resetFrame();var d=this.webGLContext,h=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),c=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);if(d.bindFramebuffer(d.FRAMEBUFFER,this.pickingFrameBuffer),d.viewport(0,0,h,c),d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT),d.bindFramebuffer(d.FRAMEBUFFER,null),d.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT),this.internals.nodeDataTexture.upload(),this.internals.edgeDataTexture.upload(),this.nodeProgram.uploadLayerTexture(),this.edgeProgram.uploadAttributeTexture(),this.emit("afterTexturesUpload"),this.internals.nodeDataTexture.bind(Fi),this.internals.edgeDataTexture.bind(Ii),this.edgeFramePass.run(l,this.internals.edgeFrameTexture,this.internals.edgeDataTexture.getHighWaterMark(),this.edgeProgram.getAttributeTexture(),this.nodeProgram.getAttributeTexture()),this.internals.edgeFrameTexture.bind(ki),this.internals.settings.renderLabels){this.labelRenderer.computeDisplayedNodeLabels();var f=this.labelRenderer.buildFramePassPoints(),v=f.data,y=f.count;this.nodeFramePass.run(v,y,this.internals.nodeFrameTexture,l,this.nodeProgram.getAttributeTexture()),this.internals.nodeFrameTexture.bind(Pi)}this.internals.settings.renderEdgeLabels&&this.labelRenderer.computeDisplayedEdgeLabels();var m=z(this.customLayerPrograms.values()),g;try{for(m.s();!(g=m.n()).done;){var p=g.value.program;p.preRender&&p.preRender(l)}}catch(O){m.e(O)}finally{m.f()}d.bindFramebuffer(d.FRAMEBUFFER,null),d.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),d.blendFunc(d.ONE,d.ONE_MINUS_SRC_ALPHA);var b=!this.internals.settings.hideLabelsOnMove||!o,x=z(this.depthLayers),_;try{for(x.s();!(_=x.n()).done;){var T=_.value,A=z(this.customLayerPrograms.values()),E;try{for(A.s();!(E=A.n()).done;){var R=E.value;R.depth===T&&R.program.render(l)}}catch(O){A.e(O)}finally{A.f()}var L=this.depthRanges.edges[T];if(L&&(!this.internals.settings.hideEdgesOnMove||!o)){var k=z(L),w;try{for(k.s();!(w=k.n()).done;){var F=w.value,C=F.offset,N=F.count;N>0&&this.edgeProgram.render(u,C,N)}}catch(O){k.e(O)}finally{k.f()}}this.internals.settings.renderEdgeLabels&&b&&(this.labelRenderer.renderEdgeLabelBackgrounds(le.edgeLabel.writesPickingThisFrame(this.internals)?l:W(W({},l),{},{pickingFrameBuffer:null}),T),this.labelRenderer.renderEdgeLabels(l,T)),this.labelRenderer.cacheAttachments(T),this.labelRenderer.renderBackdrops(W(W({},l),{},{pickingFrameBuffer:null}),T);var G=this.depthRanges.nodes[T];if(G){var M=z(G),P;try{for(M.s();!(P=M.n()).done;){var D=P.value,I=D.offset,H=D.count;H>0&&this.nodeProgram.render(l,I,H)}}catch(O){M.e(O)}finally{M.f()}}b&&(this.labelRenderer.renderAttachments(W(W({},l),{},{pickingFrameBuffer:null}),T),this.labelRenderer.renderLabelBackgrounds(le.nodeLabel.writesPickingThisFrame(this.internals)?l:W(W({},l),{},{pickingFrameBuffer:null}),T),this.internals.settings.renderLabels&&this.labelRenderer.renderWebGLLabels(l,T))}}catch(O){x.e(O)}finally{x.f()}return this.labelRenderer.labelsDirty=!1,this.internals.settings.DEBUG_displayPickingLayer&&(d.bindFramebuffer(d.READ_FRAMEBUFFER,this.pickingFrameBuffer),d.bindFramebuffer(d.DRAW_FRAMEBUFFER,null),d.blitFramebuffer(0,0,h,c,0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio,d.COLOR_BUFFER_BIT,d.NEAREST)),this.internals.settings.DEBUG_gpuTimerQueries&&this.endGpuTimerQuery(),this.pollGpuTimerQueries(),s&&this.logRenderStats(s),r()}},{key:"getDebugPrograms",value:function(){return[this.nodeProgram,this.edgeProgram,this.internals.labelProgram,this.internals.edgeLabelProgram,this.internals.edgeLabelBackgroundProgram,this.internals.backdropProgram,this.internals.labelBackgroundProgram,this.internals.attachmentProgram].filter(function(e){return e!==null})}},{key:"logRenderStats",value:function(e){var r={},i=z(e),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;r[s.constructor.name]=W({},s.debugStats)}}catch(l){i.e(l)}finally{i.f()}console.log("[sigma] DEBUG_logRenderStats: frame #".concat(this.frameId)),console.table(r)}},{key:"getGpuTimerExtension",value:function(){return this.gpuTimerExt===void 0&&(this.gpuTimerExt=this.webGLContext.getExtension("EXT_disjoint_timer_query_webgl2"),this.gpuTimerExt||console.warn("Sigma: DEBUG_gpuTimerQueries is enabled, but this browser/driver doesn't support EXT_disjoint_timer_query_webgl2.")),this.gpuTimerExt}},{key:"beginGpuTimerQuery",value:function(){var e=this.getGpuTimerExtension();if(e){var r=this.webGLContext,i=r.createQuery();i&&(r.beginQuery(e.TIME_ELAPSED_EXT,i),this.activeGpuTimerQuery=i)}}},{key:"endGpuTimerQuery",value:function(){!this.gpuTimerExt||!this.activeGpuTimerQuery||(this.webGLContext.endQuery(this.gpuTimerExt.TIME_ELAPSED_EXT),this.pendingGpuTimerQueries.push({query:this.activeGpuTimerQuery,frameId:this.frameId}),this.activeGpuTimerQuery=null)}},{key:"pollGpuTimerQueries",value:function(){if(this.pendingGpuTimerQueries.length!==0){var e=this.webGLContext,r=this.gpuTimerExt;if(!r){this.pendingGpuTimerQueries.forEach(function(h){var c=h.query;return e.deleteQuery(c)}),this.pendingGpuTimerQueries=[];return}var i=e.getParameter(r.GPU_DISJOINT_EXT),o=[],s=z(this.pendingGpuTimerQueries),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;if(!e.getQueryParameter(u.query,e.QUERY_RESULT_AVAILABLE)){o.push(u);continue}if(!i){var d=e.getQueryParameter(u.query,e.QUERY_RESULT);console.log("[sigma] DEBUG_gpuTimerQueries: frame #".concat(u.frameId," GPU time = ").concat((d/1e6).toFixed(2),"ms"))}e.deleteQuery(u.query)}}catch(h){s.e(h)}finally{s.f()}this.pendingGpuTimerQueries=o}}},{key:"postEvaluateNode",value:function(e,r,i){var o=e;o.x===void 0&&(o.x=r.x),o.y===void 0&&(o.y=r.y),e.highlighted=i.isHighlighted;for(var s=0,l=this.nodeVariableEntries.length;s<l;s++){var u,d,h=Q(this.nodeVariableEntries[s],2),c=h[0],f=h[1];o[c]=(u=(d=o[c])!==null&&d!==void 0?d:r[c])!==null&&u!==void 0?u:f.default}}},{key:"addNode",value:function(e){var r=this.internals.graph.getNodeAttributes(e),i=this.stateManager.getNodeState(e),o=this.internals.nodeDataCache[e]||{};if(un(this.stylesDeclaration.nodes,r,i,this.stateManager.graphState,this.internals.graph,o),this.postEvaluateNode(o,r,i),this.nodeReducer){var s=this.nodeReducer(e,o,r,i,this.stateManager.graphState,this.internals.graph);o=W(W({},o),s)}if(typeof o.x!="number"||typeof o.y!="number")throw new Error('Sigma: could not find a valid position (x, y) for node "'.concat(e,'". ')+"Provide coordinates via node attributes, styles, or a nodeReducer.");this.internals.nodeShapeMap?(!o.shape||!(o.shape in this.internals.nodeShapeMap))&&(o.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(o.shape=this.nodeShapeSlug),this.internals.nodeDataCache[e]=o,this.nodeGraphCoords[e]={x:o.x,y:o.y},Be(this.internals.nodesWithForcedLabels,e,Pe(o)),Be(this.internals.nodesWithBackdrop,e,na(o)),this.itemBuckets.nodes.set(e,o.depth)}},{key:"updateNode",value:function(e){this.addNode(e);var r=this.internals.nodeDataCache[e];this.normalizationFunction.applyTo(r)}},{key:"removeNode",value:function(e){this.itemBuckets.nodes.remove(e),delete this.internals.nodeDataCache[e],delete this.nodeGraphCoords[e],delete this.nodeProgramIndex[e],this.internals.dragManager.removeNode(e),this.stateManager.removeNode(e),this.internals.nodesWithForcedLabels.delete(e),this.internals.nodesWithBackdrop.delete(e)}},{key:"postEvaluateEdge",value:function(e,r){for(var i=e,o=0,s=this.edgeVariableEntries.length;o<s;o++){var l,u,d=Q(this.edgeVariableEntries[o],2),h=d[0],c=d[1];i[h]=(l=(u=i[h])!==null&&u!==void 0?u:r[h])!==null&&l!==void 0?l:c.default}}},{key:"applyEdgeSpread",value:function(e,r,i){var o;if(!(i.parallelCount<=1)){var s=this.internals.graph.source(e),l=this.internals.graph.target(e),u=s===l,d=u?r.selfLoopPath||r.path:r.parallelPath||r.path,h=d?this.edgePathsByName.get(d):void 0;if(h!=null&&h.spread){var c=(o=r.parallelSpread)!==null&&o!==void 0?o:.25,f=h.spread.compute(i.parallelIndex,i.parallelCount,c);!u&&this.internals.graph.isDirected(e)&&s>l&&(f=-f),r[h.spread.variable]=f}}}},{key:"addEdge",value:function(e){var r=this.internals.graph.getEdgeAttributes(e),i=this.stateManager.getEdgeState(e),o={};if(dn(this.stylesDeclaration.edges,r,i,this.stateManager.graphState,this.internals.graph,o),this.postEvaluateEdge(o,r),this.edgeReducer){var s=this.edgeReducer(e,o,r,i,this.stateManager.graphState,this.internals.graph);o=W(W({},o),s)}this.applyEdgeSpread(e,o,i),this.internals.edgeDataCache[e]=o,Be(this.internals.edgesWithForcedLabels,e,Pe(o)),this.itemBuckets.edges.set(e,o.depth)}},{key:"updateEdge",value:function(e){this.addEdge(e)}},{key:"removeEdge",value:function(e){this.itemBuckets.edges.remove(e),delete this.internals.edgeDataCache[e],delete this.edgeProgramIndex[e],delete this.edgeTextureIndexCache[e],this.internals.edgeDataTexture.free(e),this.stateManager.removeEdge(e),this.internals.edgesWithForcedLabels.delete(e)}},{key:"clearNodeIndices",value:function(){this.labelRenderer.resetLabelGrid(),this.autoRescaleFrozen||(this.nodeExtent={x:[0,1],y:[0,1]}),this.internals.nodeDataCache={},this.nodeGraphCoords={},this.edgeProgramIndex={},this.internals.nodesWithForcedLabels.clear(),this.internals.nodesWithBackdrop.clear(),this.prevNodeVisibilities={},this.itemBuckets.nodes.clearAll(),this.depthRanges.nodes={},this.nodeBaseDepth={}}},{key:"clearEdgeIndices",value:function(){this.internals.edgeDataCache={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},this.internals.edgesWithForcedLabels.clear(),Sa(this.pickingState,"edge"),this.itemBuckets.edges.clearAll(),this.depthRanges.edges={},this.edgeBaseDepth={},this.edgeGroups.clear()}},{key:"clearIndices",value:function(){this.clearEdgeIndices(),this.clearNodeIndices()}},{key:"clearNodeState",value:function(){this.labelRenderer.resetFrame(),this.internals.nodesWithBackdrop.clear(),this.internals.dragManager.clear(),this.autoRescaleFrozen=!1,this.stateManager.clearNodes()}},{key:"clearEdgeState",value:function(){this.labelRenderer.clearEdgeLabels(),this.stateManager.clearEdges()}},{key:"clearState",value:function(){this.clearEdgeState(),this.clearNodeState(),this.stateManager.resetGraphState()}},{key:"addNodeToProgram",value:function(e,r){var i,o=this.internals.nodeDataCache[e];this.internals.nodeDataTexture.allocate(e),(i=this.internals.nodeDataTexture).updateNode.apply(i,[e,o.x,o.y,o.size,this.getNodeShapeId(o)].concat(V(hn(o)),[o.color]));var s=this.internals.nodeDataTexture.getIndex(e);this.nodeProgram.process(je(this.pickingState,"node",e),r,o,s,e),this.nodeProgramIndex[e]=r}},{key:"addEdgeToProgram",value:function(e,r){var i,o,s=this.internals.edgeDataCache[e],l=this.internals.graph.source(e),u=this.internals.graph.target(e),d=this.internals.edgeDataTexture.allocate(e);this.edgeTextureIndexCache[e]=d;var h=l===u,c=!h&&((i=(o=this.stateManager.getEdgeState(e))===null||o===void 0?void 0:o.parallelCount)!==null&&i!==void 0?i:1)>1,f=this.edgeProgram.resolveEdgeIds(s,h,c),v=f.pathId,y=f.headId,m=f.tailId,g=f.headLengthRatio,p=f.tailLengthRatio;this.internals.edgeDataTexture.updateEdge(e,this.internals.nodeDataTexture.getIndex(l),this.internals.nodeDataTexture.getIndex(u),s.size,g,p,v,y,m),this.edgeProgram.process(je(this.pickingState,"edge",e),r,this.internals.nodeDataCache[l],this.internals.nodeDataCache[u],s,d),this.edgeProgramIndex[e]=r}},{key:"getRenderParams",value:function(){return{frameId:this.frameId,matrix:this.matrix,invMatrix:this.invMatrix,width:this.width,height:this.height,pixelRatio:this.internals.pixelRatio,zoomRatio:this.camera.ratio,cameraAngle:this.camera.angle,sizeRatio:1/this.scaleSize(),correctionRatio:this.correctionRatio,downSizingRatio:this.internals.settings.pickingDownSizingRatio,minEdgeThickness:this.internals.settings.minEdgeThickness,antiAliasingFeather:this.internals.settings.antiAliasingFeather,nodePickingPadding:this.internals.settings.nodePickingPadding,edgePickingPadding:this.internals.settings.edgePickingPadding,labelPickingPadding:this.internals.settings.labelPickingPadding,nodeDataTextureUnit:Fi,nodeDataTextureWidth:this.internals.nodeDataTexture.getTextureWidth(),nodeFrameTextureUnit:Pi,nodeFrameTextureWidth:this.internals.nodeFrameTexture.getTextureWidth(),edgeDataTextureUnit:Ii,edgeDataTextureWidth:this.internals.edgeDataTexture.getTextureWidth(),edgeFrameTextureUnit:ki,edgeFrameTextureWidth:this.internals.edgeFrameTexture.getTextureWidth(),pickingFrameBuffer:this.pickingFrameBuffer,labelPixelSnapping:this.internals.settings.labelPixelSnapping?1:0}}},{key:"getStagePadding",value:function(){var e=this.internals.settings,r=e.stagePadding,i=e.autoRescale;return i&&r||0}},{key:"getLayerElement",value:function(e){if(e==="mouse")return this.mouseLayer;var r=this.extraElements[e];if(!r)throw new Error('Sigma: layer "'.concat(e,'" does not exist'));return r}},{key:"initWebGLContext",value:function(){var e=this,r=this.createWebGLContext("stage");this.stageCanvas=this.extraElements.stage,this.webGLContext=r,this.stageCanvas.addEventListener("webglcontextlost",function(i){e.webGLContext&&(i.preventDefault(),e.contextLost=!0,e.renderFrame&&(cancelAnimationFrame(e.renderFrame),e.renderFrame=null),e.gpuTimerExt=void 0,e.activeGpuTimerQuery=null,e.pendingGpuTimerQueries=[],e.emit("webglContextLost"))}),this.stageCanvas.addEventListener("webglcontextrestored",function(){requestAnimationFrame(function(){e.webGLContext&&!e.webGLContext.isContextLost()&&e.restoreWebGLContext()})}),this.initPickingFramebuffer()}},{key:"initPickingFramebuffer",value:function(){var e=this.webGLContext,r=e.createFramebuffer();if(!r)throw new Error("Sigma: cannot create picking frame buffer");e.bindFramebuffer(e.FRAMEBUFFER,r);var i=e.createTexture();if(!i)throw new Error("Sigma: cannot create picking texture");e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0);var o=e.createRenderbuffer();if(!o)throw new Error("Sigma: cannot create picking depth buffer");if(e.bindRenderbuffer(e.RENDERBUFFER,o),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,1,1),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,o),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("Sigma: picking framebuffer is not complete");e.bindFramebuffer(e.FRAMEBUFFER,null),this.pickingFrameBuffer=r,this.pickingTexture=i,this.pickingDepthBuffer=o}},{key:"initPrograms",value:function(e,r){var i=this,o=this.webGLContext,s=di(o,this.pickingFrameBuffer,i,e?.nodes,r.antialiasNodes),l=s.nodeProgram,u=s.labelProgram,d=s.backdropProgram,h=s.labelBackgroundProgram,c=s.attachmentProgram,f=s.framePass,v=s.shapeSlug,y=s.shapeNameToIndex,m=s.shapeGlobalIds,g=s.variables;this.nodeProgram=l,this.nodeFramePass=f,this.nodeVariableEntries=Object.entries(g),v&&(this.nodeShapeSlug=v);var p=hi(o,this.pickingFrameBuffer,i,e?.edges,r.antialiasEdges,e?.nodes),b=p.edgeProgram,x=p.labelProgram,_=p.labelBackgroundProgram,T=p.framePass,A=p.variables,E=p.paths;return this.edgeProgram=b,this.edgeFramePass=T,this.edgeVariableEntries=Object.entries(A),this.edgePathsByName=new Map(E.map(function(R){return[R.name,R]})),{labelProgram:u,edgeLabelProgram:x,edgeLabelBackgroundProgram:_,backdropProgram:d,labelBackgroundProgram:h,attachmentProgram:c,nodeShapeMap:y??null,nodeGlobalShapeIds:m??null}}},{key:"restoreWebGLContext",value:function(){var e,r,i,o,s,l=this.internals;this.initPickingFramebuffer(),(e=l.nodeDataTexture)===null||e===void 0||e.restore(),(r=l.nodeFrameTexture)===null||r===void 0||r.restore(),(i=l.edgeDataTexture)===null||i===void 0||i.restore(),(o=l.edgeFrameTexture)===null||o===void 0||o.restore(),(s=l.attachmentManager)===null||s===void 0||s.restore(),l.hoverResolver.reset(),Object.assign(l,this.initPrograms(l.primitives,l.settings));var u=z(this.customLayerPrograms.values()),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;h.program.kill(),h.program=h.factory(this.webGLContext)}}catch(c){u.e(c)}finally{u.f()}this.contextLost=!1,this.emit("webglContextRestored"),this.refresh()}},{key:"createLayer",value:function(e,r){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(this.extraElements[e])throw new Error('Sigma: a layer named "'.concat(e,'" already exists'));var o=st(r,{position:"absolute"},{class:"sigma-".concat(e)});return i.style&&Object.assign(o.style,i.style),this.extraElements[e]=o,"beforeLayer"in i&&i.beforeLayer?this.getLayerElement(i.beforeLayer).before(o):"afterLayer"in i&&i.afterLayer?this.getLayerElement(i.afterLayer).after(o):this.container.appendChild(o),o}},{key:"createCanvas",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createLayer(e,"canvas",r)}},{key:"createWebGLContext",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=this.createCanvas(e,r);r.hidden&&i.remove();var o=i.getContext("webgl2",W({preserveDrawingBuffer:!1,antialias:!1,depth:!0},r));if(!o)throw new Error("Sigma: WebGL 2 is not supported by your browser. Please use a modern browser (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+).");return o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o}},{key:"killLayer",value:function(e){if(e==="stage"||e==="mouse")throw new Error('Sigma: cannot kill built-in layer "'.concat(e,'"'));var r=this.extraElements[e];if(!r)throw new Error("Sigma: cannot kill layer ".concat(e,", which does not exist"));return r.remove(),delete this.extraElements[e],this}},{key:"getWebGLContext",value:function(){if(!this.webGLContext)throw new Error("Sigma: WebGL context is not available");return this.webGLContext}},{key:"getNodeDataTexture",value:function(){if(!this.internals.nodeDataTexture)throw new Error("Sigma: node data texture is not available");return this.internals.nodeDataTexture}},{key:"getNormalizationFunction",value:function(){return this.normalizationFunction}},{key:"addCustomLayerProgram",value:function(e,r,i){var o;if(!this.depthLayers.includes(r))throw new Error('Sigma: cannot add custom layer program at depth "'.concat(r,'", ')+"it must be declared in primitives.depthLayers. Current layers: ".concat(this.depthLayers.join(", ")));return(o=this.customLayerPrograms.get(e))===null||o===void 0||o.program.kill(),this.customLayerPrograms.set(e,{depth:r,factory:i,program:i(this.webGLContext)}),this.refresh(),this}},{key:"removeCustomLayerProgram",value:function(e){var r=this.customLayerPrograms.get(e);return r&&(r.program.kill(),this.customLayerPrograms.delete(e),this.scheduleRender()),this}},{key:"getCamera",value:function(){return this.camera}},{key:"setCamera",value:function(e){return this.camera.cancelAnimation(),this.unbindCameraHandlers(),this.camera=e,this.bindCameraHandlers(),this.scheduleRender(),this}},{key:"getContainer",value:function(){return this.container}},{key:"getGraph",value:function(){return this.internals.graph}},{key:"setGraph",value:function(e){return e===this.internals.graph?this:(this.stateManager.pruneNodes(function(r){return e.hasNode(r)}),this.stateManager.pruneEdges(function(r){return e.hasEdge(r)}),this.unbindGraphHandlers(),this.checkEdgesEventsFrame!==null&&(cancelAnimationFrame(this.checkEdgesEventsFrame),this.checkEdgesEventsFrame=null),this.internals.graph=e,this.autoRescaleFrozen=!1,this.bindGraphHandlers(),this.refresh(),this)}},{key:"getMouseCaptor",value:function(){return this.mouseCaptor}},{key:"getTouchCaptor",value:function(){return this.touchCaptor}},{key:"getDimensions",value:function(){return{width:this.width,height:this.height}}},{key:"getGraphDimensions",value:function(){var e=this.customBBox||this.nodeExtent;return{width:e.x[1]-e.x[0]||1,height:e.y[1]-e.y[0]||1}}},{key:"getNodeDisplayData",value:function(e){var r=this.internals.nodeDataCache[e];return r?Object.assign({},r):void 0}},{key:"getEdgeDisplayData",value:function(e){var r=this.internals.edgeDataCache[e];return r?Object.assign({},r):void 0}},{key:"getNodeState",value:function(e){return this.stateManager.getNodeState(e)}},{key:"getEdgeState",value:function(e){return this.stateManager.getEdgeState(e)}},{key:"getGraphState",value:function(){return this.stateManager.getGraphState()}},{key:"setNodeState",value:function(e,r){return this.stateManager.setNodeState(e,r),this}},{key:"setEdgeState",value:function(e,r){return this.stateManager.setEdgeState(e,r),this}},{key:"setGraphState",value:function(e){return this.stateManager.setGraphState(e),this}},{key:"_setPanning",value:function(e){this.stateManager.setGraphState({isPanning:e})}},{key:"_setZooming",value:function(e){this.stateManager.setGraphState({isZooming:e})}},{key:"_hasNodeDrag",value:function(){var e=this.internals.dragManager;return!!(e.pendingNode||e.session)}},{key:"_showGestureHint",value:function(e){var r=this.internals.settings;r.gestureTarget==="shared"&&(this.gestureHint=this.gestureHint||new Rd(this.container),this.gestureHint.show(e,r))}},{key:"setNodesState",value:function(e,r){return this.stateManager.setNodesState(e,r),this}},{key:"setEdgesState",value:function(e,r){return this.stateManager.setEdgesState(e,r),this}},{key:"updateContainerCursor",value:function(){var e=this.stateManager.hovered,r=this.resolvedStageStyle.cursor||"";this.container.style.cursor=e&&cd(this.internals,e)||r}},{key:"refreshStageStyle",value:function(){this.resolvedStageStyle=Zn(this.stylesDeclaration.stage,this.stateManager.graphState),this.resolvedStageStyle.background!==void 0&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.updateContainerCursor()}},{key:"getNodeDisplayedLabels",value:function(){return new Set(this.labelRenderer.displayedNodeLabels)}},{key:"getEdgeDisplayedLabels",value:function(){return new Set(this.labelRenderer.displayedEdgeLabels)}},{key:"getSettings",value:function(){return W({},this.internals.settings)}},{key:"getSetting",value:function(e){return this.internals.settings[e]}},{key:"getStyles",value:function(){return W({},this.stylesDeclaration)}},{key:"getPrimitives",value:function(){return W({},this.internals.primitives)}},{key:"setSetting",value:function(e,r){return this.internals.settings[e]=r,gn(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}},{key:"updateSetting",value:function(e,r){return this.setSetting(e,r(this.internals.settings[e])),this}},{key:"setSettings",value:function(e){return this.internals.settings=W(W({},this.internals.settings),e),gn(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}},{key:"resize",value:function(e){var r=this.width,i=this.height;if(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.internals.pixelRatio=wt(),this.width===0)if(this.internals.settings.allowInvalidContainer)this.width=1;else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(this.height===0)if(this.internals.settings.allowInvalidContainer)this.height=1;else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(!e&&r===this.width&&i===this.height)return this;this.labelRenderer.labelsDirty=!0;for(var o=0,s=[this.mouseLayer].concat(V(Object.values(this.extraElements)));o<s.length;o++){var l=s[o];l.style.width=this.width+"px",l.style.height=this.height+"px"}return this.webGLContext&&(this.stageCanvas.setAttribute("width",this.width*this.internals.pixelRatio+"px"),this.stageCanvas.setAttribute("height",this.height*this.internals.pixelRatio+"px"),this.webGLContext.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio)),this.emit("resize"),this}},{key:"clear",value:function(){return this.emit("beforeClear"),this.webGLContext.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER,null),this.webGLContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT),this.emit("afterClear"),this}},{key:"scheduleStateRefresh",value:function(){this.needToRefreshState=!0,this.scheduleRender()}},{key:"refreshState",value:function(){var e=this,r;this.stateManager.flushGraphStateFlags();var i=this.stateManager.graphStateChanged&&this.internals.nodeStyleAnalysis.dependency==="graph-state",o=this.stateManager.graphStateChanged&&this.edgeStyleAnalysis.dependency==="graph-state",s=!1;if(i)this.internals.graph.forEachNode(function(v){e.refreshNodeState(v)&&(s=!0)});else if(this.internals.nodeStyleAnalysis.dependency!=="static"){var l=z(this.stateManager.dirtyNodes),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;this.refreshNodeState(d)&&(s=!0)}}catch(v){l.e(v)}finally{l.f()}}if(o)this.internals.graph.forEachEdge(function(v){e.refreshEdgeState(v)&&(s=!0)});else if(this.edgeStyleAnalysis.dependency!=="static"){var h=z(this.stateManager.dirtyEdges),c;try{for(h.s();!(c=h.n()).done;){var f=c.value;this.refreshEdgeState(f)&&(s=!0)}}catch(v){h.e(v)}finally{h.f()}}this.stateManager.graphStateChanged&&(r=this.stylesDeclaration)!==null&&r!==void 0&&r.stage&&this.refreshStageStyle(),this.stateManager.clearDirtyTracking(),s&&(this.pendingProcess="full")}},{key:"refreshNodeState",value:function(e){var r=this.internals.nodeDataCache[e];if(!r||this.nodeReducer){var i,o,s,l,u=(i=this.internals.nodeDataCache[e])===null||i===void 0?void 0:i.depth,d=(o=this.internals.nodeDataCache[e])===null||o===void 0?void 0:o.zIndex,h=(s=this.internals.nodeDataCache[e])===null||s===void 0?void 0:s.labelAttachment;this.updateNode(e);var c=this.internals.nodeDataCache[e];this.internals.attachmentManager&&c.labelAttachment!==h&&this.internals.attachmentManager.invalidateNode(e);var f;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&c.shape&&c.shape in this.internals.nodeShapeMap?f=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[c.shape]]:f=Ft(c.shape||"circle"),(l=this.internals.nodeDataTexture).updateNode.apply(l,[e,c.x,c.y,c.size,f].concat(V(hn(c)),[c.color])),u&&c.depth!==u&&this.updateNodeDepthRanges(e,u,c.depth);var v=this.nodeProgramIndex[e];return v!==void 0&&(this.addNodeToProgram(e,v),this.nodeProgram.invalidateBuffers()),d!==void 0&&c.zIndex!==d}var y=this.internals.graph.getNodeAttributes(e),m=this.stateManager.getNodeState(e),g=r.size,p=r.shape,b=r.depth,x=r.zIndex,_=r.labelAttachment,T=r.rotationAlignment,A=r.labelRotationAlignment,E=r.color;un(this.stylesDeclaration.nodes,y,m,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateNode(r,y,m);var R=this.nodeGraphCoords[e],L=r.x!==R.x||r.y!==R.y;if(L&&(R.x=r.x,R.y=r.y),this.normalizationFunction.applyTo(r),this.internals.nodeShapeMap?(!r.shape||!(r.shape in this.internals.nodeShapeMap))&&(r.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(r.shape=this.nodeShapeSlug),this.internals.attachmentManager&&r.labelAttachment!==_&&this.internals.attachmentManager.invalidateNode(e),Be(this.internals.nodesWithForcedLabels,e,Pe(r)),Be(this.internals.nodesWithBackdrop,e,na(r)),L||r.size!==g||r.shape!==p||r.rotationAlignment!==T||r.labelRotationAlignment!==A||r.color!==E){var k,w;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&r.shape&&r.shape in this.internals.nodeShapeMap?w=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[r.shape]]:w=Ft(r.shape||"circle"),(k=this.internals.nodeDataTexture).updateNode.apply(k,[e,r.x,r.y,r.size,w].concat(V(hn(r)),[r.color]))}this.itemBuckets.nodes.set(e,r.depth),r.depth!==b&&this.updateNodeDepthRanges(e,b,r.depth);var F=this.nodeProgramIndex[e];return F!==void 0&&(this.addNodeToProgram(e,F),this.nodeProgram.invalidateBuffers()),r.zIndex!==x}},{key:"refreshEdgeState",value:function(e){var r=this.internals.edgeDataCache[e];if(!r||this.edgeReducer){var i=r?.depth,o=r?.zIndex;this.updateEdge(e);var s=this.internals.edgeDataCache[e];i&&s.depth!==i&&this.updateEdgeDepthRanges(e,i,s.depth);var l=this.edgeProgramIndex[e];return l!==void 0&&(this.addEdgeToProgram(e,l),this.edgeProgram.invalidateBuffers()),o!==void 0&&s.zIndex!==o}var u=this.internals.graph.getEdgeAttributes(e),d=this.stateManager.getEdgeState(e),h=r.depth,c=r.zIndex,f=r.size,v=r.path,y=r.selfLoopPath,m=r.parallelPath,g=r.head,p=r.tail;dn(this.stylesDeclaration.edges,u,d,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateEdge(r,u),this.applyEdgeSpread(e,r,d),Be(this.internals.edgesWithForcedLabels,e,Pe(r)),this.itemBuckets.edges.set(e,r.depth),r.depth!==h&&this.updateEdgeDepthRanges(e,h,r.depth);var b=this.edgeProgramIndex[e];if(b!==void 0){var x=r.size!==f||r.path!==v||r.selfLoopPath!==y||r.parallelPath!==m||r.head!==g||r.tail!==p;if(x)this.addEdgeToProgram(e,b),this.edgeProgram.invalidateBuffers();else{var _=this.internals.graph.source(e),T=this.internals.graph.target(e),A=this.internals.nodeDataCache[_],E=this.internals.nodeDataCache[T],R=this.edgeTextureIndexCache[e];this.edgeProgram.process(je(this.pickingState,"edge",e),b,A,E,r,R),this.edgeProgram.invalidateBuffers()}}return r.zIndex!==c}},{key:"refresh",value:function(e){var r=this,i=e?.skipIndexation!==void 0?e?.skipIndexation:!1,o=e?.schedule!==void 0?e.schedule:!1,s=!e||!e.partialGraph;if(s)this.clearEdgeIndices(),this.clearNodeIndices(),this.internals.graph.forEachNode(function(A){return r.addNode(A)}),this.edgeGroups.rebuild(),this.internals.graph.forEachEdge(function(A){return r.addEdge(A)}),this.pendingProcess="full";else{for(var l,u,d=((l=e.partialGraph)===null||l===void 0?void 0:l.nodes)||[],h=0,c=d?.length||0;h<c;h++){var f,v,y=""+d[h],m=(f=this.internals.nodeDataCache[y])===null||f===void 0?void 0:f.labelAttachment;if(this.updateNode(y),this.internals.attachmentManager&&((v=this.internals.nodeDataCache[y])!==null&&v!==void 0&&v.labelAttachment||m)&&this.internals.attachmentManager.invalidateNode(y),i){var g=this.nodeProgramIndex[y];if(g===void 0)throw new Error('Sigma: node "'.concat(y,`" can't be repaint`));this.addNodeToProgram(y,g)}}i&&d.length>0&&(this.nodeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0);for(var p=(e==null||(u=e.partialGraph)===null||u===void 0?void 0:u.edges)||[],b=0,x=p.length;b<x;b++){var _=""+p[b];if(this.updateEdge(_),i){var T=this.edgeProgramIndex[_];if(T===void 0)throw new Error('Sigma: edge "'.concat(_,`" can't be repaint`));this.addEdgeToProgram(_,T)}}i&&p.length>0&&(this.edgeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0),!i&&this.pendingProcess!=="full"&&(this.pendingProcess=p.length>0?"full":"nodes")}return o?this.scheduleRender():this.render(),this}},{key:"scheduleRender",value:function(){var e=this;return this.renderFrame||(this.renderFrame=requestAnimationFrame(function(){e.render()})),this}},{key:"scheduleRefresh",value:function(e){return this.refresh(W(W({},e),{},{schedule:!0}))}},{key:"getViewportZoomedState",value:function(e,r){var i=this.camera.getState(),o=i.ratio,s=i.angle,l=i.x,u=i.y,d=this.internals.settings,h=d.minCameraRatio,c=d.maxCameraRatio;typeof c=="number"&&(r=Math.min(r,c)),typeof h=="number"&&(r=Math.max(r,h));var f=r/o,v={x:this.width/2,y:this.height/2},y=this.viewportToFramedGraph(e),m=this.viewportToFramedGraph(v);return{angle:s,x:(y.x-m.x)*(1-f)+l,y:(y.y-m.y)*(1-f)+u,ratio:r}}},{key:"viewRectangle",value:function(){var e=this.viewportToFramedGraph({x:0,y:0}),r=this.viewportToFramedGraph({x:this.width,y:0}),i=this.viewportToFramedGraph({x:0,y:this.height});return{x1:e.x,y1:e.y,x2:r.x,y2:r.y,height:r.y-i.y}}},{key:"framedGraphToViewport",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=!!r.cameraState||!!r.viewportDimensions||!!r.graphDimensions||!!r.padding,o=r.matrix||(i?Le(r.cameraState||this.camera.getState(),r.viewportDimensions||this.getDimensions(),r.graphDimensions||this.getGraphDimensions(),r.padding||this.getStagePadding()):this.matrix),s=nt(o,e);return{x:(1+s.x)*this.width/2,y:(1-s.y)*this.height/2}}},{key:"viewportToFramedGraph",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=!!r.cameraState||!!r.viewportDimensions||!!r.graphDimensions||!!r.padding,o=r.matrix||(i?Le(r.cameraState||this.camera.getState(),r.viewportDimensions||this.getDimensions(),r.graphDimensions||this.getGraphDimensions(),r.padding||this.getStagePadding(),!0):this.invMatrix),s=nt(o,{x:e.x/this.width*2-1,y:1-e.y/this.height*2});return isNaN(s.x)&&(s.x=0),isNaN(s.y)&&(s.y=0),s}},{key:"viewportToGraph",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.normalizationFunction.inverse(this.viewportToFramedGraph(e,r))}},{key:"graphToViewport",value:function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.framedGraphToViewport(this.normalizationFunction(e),r)}},{key:"graphToFramedGraph",value:function(e){return this.normalizationFunction(e)}},{key:"framedGraphToGraph",value:function(e){return this.normalizationFunction.inverse(e)}},{key:"getGraphToViewportRatio",value:function(){var e={x:0,y:0},r={x:1,y:1},i=Math.sqrt(Math.pow(e.x-r.x,2)+Math.pow(e.y-r.y,2)),o=this.graphToViewport(e),s=this.graphToViewport(r),l=Math.sqrt(Math.pow(o.x-s.x,2)+Math.pow(o.y-s.y,2));return l/i}},{key:"computeNodeExtent",value:function(){var e=this.nodeGraphCoords,r=Object.keys(e);if(!r.length)return{x:[0,1],y:[0,1]};for(var i=1/0,o=-1/0,s=1/0,l=-1/0,u=0,d=r.length;u<d;u++){var h=e[r[u]],c=h.x,f=h.y;c<i&&(i=c),c>o&&(o=c),f<s&&(s=f),f>l&&(l=f)}return{x:[i,o],y:[s,l]}}},{key:"getBBox",value:function(){return this.nodeExtent}},{key:"getCustomBBox",value:function(){return this.customBBox}},{key:"setCustomBBox",value:function(e){return this.customBBox=e,this.scheduleRender(),this}},{key:"kill",value:function(){var e,r,i;this.emit("kill"),this.removeAllListeners(),this.camera.cancelAnimation(),this.unbindCameraHandlers(),window.removeEventListener("resize",this.activeListeners.handleResize),this.mouseCaptor.kill(),this.touchCaptor.kill(),this.internals.hoverResolver.kill(),this.unbindGraphHandlers(),this.clearIndices(),this.clearState(),this.internals.nodeDataCache={},this.internals.edgeDataCache={},this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null);for(var o=this.container;o.firstChild;)o.removeChild(o.firstChild);this.nodeProgram.kill(),this.nodeFramePass.kill(),this.edgeProgram.kill(),this.edgeFramePass.kill(),this.internals.labelProgram.kill(),this.internals.edgeLabelProgram.kill(),this.internals.edgeLabelBackgroundProgram.kill(),this.internals.backdropProgram.kill(),this.internals.labelBackgroundProgram.kill(),(e=this.internals.attachmentProgram)===null||e===void 0||e.kill(),(r=this.internals.attachmentManager)===null||r===void 0||r.kill(),this.internals.attachmentProgram=null,this.internals.attachmentManager=null;var s=z(this.customLayerPrograms.values()),l;try{for(s.s();!(l=s.n()).done;){var u=l.value.program;u.kill()}}catch(c){s.e(c)}finally{s.f()}if(this.customLayerPrograms.clear(),this.sdfAtlas&&(this.sdfAtlas=null),this.internals.nodeDataTexture&&(this.internals.nodeDataTexture.kill(),this.internals.nodeDataTexture=null),this.internals.nodeFrameTexture&&(this.internals.nodeFrameTexture.kill(),this.internals.nodeFrameTexture=null),this.internals.edgeDataTexture&&(this.internals.edgeDataTexture.kill(),this.internals.edgeDataTexture=null),this.internals.edgeFrameTexture&&(this.internals.edgeFrameTexture.kill(),this.internals.edgeFrameTexture=null),this.webGLContext){var d;(d=this.webGLContext.getExtension("WEBGL_lose_context"))===null||d===void 0||d.loseContext(),this.webGLContext=null}(i=this.gestureHint)===null||i===void 0||i.kill(),this.gestureHint=null,this.mouseLayer.remove();for(var h in this.extraElements)this.extraElements[h].remove();this.extraElements={}}},{key:"scaleSize",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:this.camera.ratio;return e/this.internals.settings.zoomToSizeRatioFunction(r)*(this.getSetting("itemSizesReference")==="positions"?r*this.graphToViewportRatio:1)}},{key:"getStageCanvas",value:function(){return this.stageCanvas}},{key:"getMouseLayer",value:function(){return this.mouseLayer}}])})(Rt),Wi=Gd;var Wh=Me(Ke());return Ji(Nd);})();
/*! Bundled license information:

sigma/dist/edge-data-texture-7146018b.esm.js:
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
