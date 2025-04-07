const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/maplibre-gl-DO6gGska.js","assets/index-BgsFx2Wg.js","assets/index-rmaeoW9k.css"])))=>i.map(i=>d[i]);
import{r as c,_ as K,a as Y,j as _}from"./index-BgsFx2Wg.js";import{P as J}from"./papaparse.min-DWsfLRAl.js";const Ve={dataURL:"https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1RLwN8Q0x34xLsVAnqlRaTVWT6gezOa4O87UYgpCz137eIiZ7zHnNbEPi6ELEPgpKQoehHxse74n-/pub?output=csv",latField:"",lngField:"",nameField:"name",descField:"description",mapStyle:"Light",pinColor:"007cbf",mapCenter:[0,0],mapZoom:1,mapPitch:0,mapBearing:0},Q=c.createContext(null);function X(e,t){const n=Array.isArray(e)?e[0]:e?e.x:0,r=Array.isArray(e)?e[1]:e?e.y:0,o=Array.isArray(t)?t[0]:t?t.x:0,i=Array.isArray(t)?t[1]:t?t.y:0;return n===o&&r===i}function x(e,t){if(e===t)return!0;if(!e||!t)return!1;if(Array.isArray(e)){if(!Array.isArray(t)||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!x(e[n],t[n]))return!1;return!0}else if(Array.isArray(t))return!1;if(typeof e=="object"&&typeof t=="object"){const n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(const o of n)if(!t.hasOwnProperty(o)||!x(e[o],t[o]))return!1;return!0}return!1}function I(e){return{longitude:e.center.lng,latitude:e.center.lat,zoom:e.zoom,pitch:e.pitch,bearing:e.bearing,padding:e.padding}}function O(e,t){const n=t.viewState||t,r={};if("longitude"in n&&"latitude"in n&&(n.longitude!==e.center.lng||n.latitude!==e.center.lat)){const o=e.center.constructor;r.center=new o(n.longitude,n.latitude)}return"zoom"in n&&n.zoom!==e.zoom&&(r.zoom=n.zoom),"bearing"in n&&n.bearing!==e.bearing&&(r.bearing=n.bearing),"pitch"in n&&n.pitch!==e.pitch&&(r.pitch=n.pitch),n.padding&&e.padding&&!x(n.padding,e.padding)&&(r.padding=n.padding),r}const ee=["type","source","source-layer","minzoom","maxzoom","filter","layout"];function D(e){if(!e)return null;if(typeof e=="string"||("toJS"in e&&(e=e.toJS()),!e.layers))return e;const t={};for(const r of e.layers)t[r.id]=r;const n=e.layers.map(r=>{let o=null;"interactive"in r&&(o=Object.assign({},r),delete o.interactive);const i=t[r.ref];if(i){o=o||Object.assign({},r),delete o.ref;for(const a of ee)a in i&&(o[a]=i[a])}return o||r});return{...e,layers:n}}const Z={version:8,sources:{},layers:[]},V={mousedown:"onMouseDown",mouseup:"onMouseUp",mouseover:"onMouseOver",mousemove:"onMouseMove",click:"onClick",dblclick:"onDblClick",mouseenter:"onMouseEnter",mouseleave:"onMouseLeave",mouseout:"onMouseOut",contextmenu:"onContextMenu",touchstart:"onTouchStart",touchend:"onTouchEnd",touchmove:"onTouchMove",touchcancel:"onTouchCancel"},H={movestart:"onMoveStart",move:"onMove",moveend:"onMoveEnd",dragstart:"onDragStart",drag:"onDrag",dragend:"onDragEnd",zoomstart:"onZoomStart",zoom:"onZoom",zoomend:"onZoomEnd",rotatestart:"onRotateStart",rotate:"onRotate",rotateend:"onRotateEnd",pitchstart:"onPitchStart",pitch:"onPitch",pitchend:"onPitchEnd"},B={wheel:"onWheel",boxzoomstart:"onBoxZoomStart",boxzoomend:"onBoxZoomEnd",boxzoomcancel:"onBoxZoomCancel",resize:"onResize",load:"onLoad",render:"onRender",idle:"onIdle",remove:"onRemove",data:"onData",styledata:"onStyleData",sourcedata:"onSourceData",error:"onError"},te=["minZoom","maxZoom","minPitch","maxPitch","maxBounds","projection","renderWorldCopies"],ne=["scrollZoom","boxZoom","dragRotate","dragPan","keyboard","doubleClickZoom","touchZoomRotate","touchPitch"];class R{constructor(t,n,r){this._map=null,this._internalUpdate=!1,this._hoveredFeatures=null,this._propsedCameraUpdate=null,this._styleComponents={},this._onEvent=o=>{const i=this.props[B[o.type]];i?i(o):o.type==="error"&&console.error(o.error)},this._onCameraEvent=o=>{if(this._internalUpdate)return;o.viewState=this._propsedCameraUpdate||I(this._map.transform);const i=this.props[H[o.type]];i&&i(o)},this._onCameraUpdate=o=>this._internalUpdate?o:(this._propsedCameraUpdate=I(o),O(o,this.props)),this._onPointerEvent=o=>{(o.type==="mousemove"||o.type==="mouseout")&&this._updateHover(o);const i=this.props[V[o.type]];i&&(this.props.interactiveLayerIds&&o.type!=="mouseover"&&o.type!=="mouseout"&&(o.features=this._hoveredFeatures||this._queryRenderedFeatures(o.point)),i(o),delete o.features)},this._MapClass=t,this.props=n,this._initialize(r)}get map(){return this._map}setProps(t){const n=this.props;this.props=t;const r=this._updateSettings(t,n),o=this._updateSize(t),i=this._updateViewState(t);this._updateStyle(t,n),this._updateStyleComponents(t),this._updateHandlers(t,n),(r||o||i&&!this._map.isMoving())&&this.redraw()}static reuse(t,n){const r=R.savedMaps.pop();if(!r)return null;const o=r.map,i=o.getContainer();for(n.className=i.className;i.childNodes.length>0;)n.appendChild(i.childNodes[0]);o._container=n;const a=o._resizeObserver;a&&(a.disconnect(),a.observe(n)),r.setProps({...t,styleDiffing:!1}),o.resize();const{initialViewState:s}=t;return s&&(s.bounds?o.fitBounds(s.bounds,{...s.fitBoundsOptions,duration:0}):r._updateViewState(s)),o.isStyleLoaded()?o.fire("load"):o.once("style.load",()=>o.fire("load")),o._update(),r}_initialize(t){const{props:n}=this,{mapStyle:r=Z}=n,o={...n,...n.initialViewState,container:t,style:D(r)},i=o.initialViewState||o.viewState||o;if(Object.assign(o,{center:[i.longitude||0,i.latitude||0],zoom:i.zoom||0,pitch:i.pitch||0,bearing:i.bearing||0}),n.gl){const s=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=()=>(HTMLCanvasElement.prototype.getContext=s,n.gl)}const a=new this._MapClass(o);i.padding&&a.setPadding(i.padding),n.cursor&&(a.getCanvas().style.cursor=n.cursor),a.transformCameraUpdate=this._onCameraUpdate,a.on("style.load",()=>{var s;this._styleComponents={light:a.getLight(),sky:a.getSky(),projection:(s=a.getProjection)==null?void 0:s.call(a),terrain:a.getTerrain()},this._updateStyleComponents(this.props)}),a.on("sourcedata",()=>{this._updateStyleComponents(this.props)});for(const s in V)a.on(s,this._onPointerEvent);for(const s in H)a.on(s,this._onCameraEvent);for(const s in B)a.on(s,this._onEvent);this._map=a}recycle(){const n=this.map.getContainer().querySelector("[mapboxgl-children]");n==null||n.remove(),R.savedMaps.push(this)}destroy(){this._map.remove()}redraw(){const t=this._map;t.style&&(t._frame&&(t._frame.cancel(),t._frame=null),t._render())}_updateSize(t){const{viewState:n}=t;if(n){const r=this._map;if(n.width!==r.transform.width||n.height!==r.transform.height)return r.resize(),!0}return!1}_updateViewState(t){const n=this._map,r=n.transform;if(!n.isMoving()){const i=O(r,t);if(Object.keys(i).length>0)return this._internalUpdate=!0,n.jumpTo(i),this._internalUpdate=!1,!0}return!1}_updateSettings(t,n){const r=this._map;let o=!1;for(const i of te)if(i in t&&!x(t[i],n[i])){o=!0;const a=r[`set${i[0].toUpperCase()}${i.slice(1)}`];a==null||a.call(r,t[i])}return o}_updateStyle(t,n){if(t.cursor!==n.cursor&&(this._map.getCanvas().style.cursor=t.cursor||""),t.mapStyle!==n.mapStyle){const{mapStyle:r=Z,styleDiffing:o=!0}=t,i={diff:o};"localIdeographFontFamily"in t&&(i.localIdeographFontFamily=t.localIdeographFontFamily),this._map.setStyle(D(r),i)}}_updateStyleComponents({light:t,projection:n,sky:r,terrain:o}){var s,u;const i=this._map,a=this._styleComponents;i.style._loaded&&(t&&!x(t,a.light)&&(a.light=t,i.setLight(t)),n&&!x(n,a.projection)&&n!==((s=a.projection)==null?void 0:s.type)&&(a.projection=typeof n=="string"?{type:n}:n,(u=i.setProjection)==null||u.call(i,a.projection)),r&&!x(r,a.sky)&&(a.sky=r,i.setSky(r)),o!==void 0&&!x(o,a.terrain)&&(!o||i.getSource(o.source))&&(a.terrain=o,i.setTerrain(o)))}_updateHandlers(t,n){const r=this._map;for(const o of ne){const i=t[o]??!0,a=n[o]??!0;x(i,a)||(i?r[o].enable(i):r[o].disable())}}_queryRenderedFeatures(t){const n=this._map,{interactiveLayerIds:r=[]}=this.props;try{return n.queryRenderedFeatures(t,{layers:r.filter(n.getLayer.bind(n))})}catch{return[]}}_updateHover(t){var o;const{props:n}=this;if(n.interactiveLayerIds&&(n.onMouseMove||n.onMouseEnter||n.onMouseLeave)){const i=t.type,a=((o=this._hoveredFeatures)==null?void 0:o.length)>0,s=this._queryRenderedFeatures(t.point),u=s.length>0;!u&&a&&(t.type="mouseleave",this._onPointerEvent(t)),this._hoveredFeatures=s,u&&!a&&(t.type="mouseenter",this._onPointerEvent(t)),t.type=i}else this._hoveredFeatures=null}}R.savedMaps=[];const oe=["setMaxBounds","setMinZoom","setMaxZoom","setMinPitch","setMaxPitch","setRenderWorldCopies","setProjection","setStyle","addSource","removeSource","addLayer","removeLayer","setLayerZoomRange","setFilter","setPaintProperty","setLayoutProperty","setLight","setTerrain","setFog","remove"];function re(e){if(!e)return null;const t=e.map,n={getMap:()=>t};for(const r of ie(t))!(r in n)&&!oe.includes(r)&&(n[r]=t[r].bind(t));return n}function ie(e){const t=new Set;let n=e;for(;n;){for(const r of Object.getOwnPropertyNames(n))r[0]!=="_"&&typeof e[r]=="function"&&r!=="fire"&&r!=="setEventedParent"&&t.add(r);n=Object.getPrototypeOf(n)}return Array.from(t)}const ae=typeof document<"u"?c.useLayoutEffect:c.useEffect;function se(e,t){const{RTLTextPlugin:n,maxParallelImageRequests:r,workerCount:o,workerUrl:i}=t;if(n&&e.getRTLTextPluginStatus&&e.getRTLTextPluginStatus()==="unavailable"){const{pluginUrl:a,lazy:s=!0}=typeof n=="string"?{pluginUrl:n}:n;e.setRTLTextPlugin(a,u=>{u&&console.error(u)},s)}r!==void 0&&e.setMaxParallelImageRequests(r),o!==void 0&&e.setWorkerCount(o),i!==void 0&&e.setWorkerUrl(i)}const N=c.createContext(null);function ce(e,t){const n=c.useContext(Q),[r,o]=c.useState(null),i=c.useRef(),{current:a}=c.useRef({mapLib:null,map:null});c.useEffect(()=>{const f=e.mapLib;let g=!0,l;return Promise.resolve(f||K(()=>import("./maplibre-gl-DO6gGska.js").then(m=>m.m),__vite__mapDeps([0,1,2]))).then(m=>{if(!g)return;if(!m)throw new Error("Invalid mapLib");const y="Map"in m?m:m.default;if(!y.Map)throw new Error("Invalid mapLib");if(se(y,e),!y.supported||y.supported(e))e.reuseMaps&&(l=R.reuse(e,i.current)),l||(l=new R(y.Map,e,i.current)),a.map=re(l),a.mapLib=y,o(l),n==null||n.onMapMount(a.map,e.id);else throw new Error("Map is not supported by this browser")}).catch(m=>{const{onError:y}=e;y?y({type:"error",target:null,originalEvent:null,error:m}):console.error(m)}),()=>{g=!1,l&&(n==null||n.onMapUnmount(e.id),e.reuseMaps?l.recycle():l.destroy())}},[]),ae(()=>{r&&r.setProps(e)}),c.useImperativeHandle(t,()=>a.map,[r]);const s=c.useMemo(()=>({position:"relative",width:"100%",height:"100%",...e.style}),[e.style]),u={height:"100%"};return c.createElement("div",{id:e.id,ref:i,style:s},r&&c.createElement(N.Provider,{value:a},c.createElement("div",{"mapboxgl-children":"",style:u},e.children)))}const le=c.forwardRef(ce),ue=/box|flex|grid|column|lineHeight|fontWeight|opacity|order|tabSize|zIndex/;function w(e,t){if(!e||!t)return;const n=e.style;for(const r in t){const o=t[r];Number.isFinite(o)&&!ue.test(r)?n[r]=`${o}px`:n[r]=o}}c.memo(c.forwardRef((e,t)=>{const{map:n,mapLib:r}=c.useContext(N),o=c.useRef({props:e});o.current.props=e;const i=c.useMemo(()=>{let d=!1;c.Children.forEach(e.children,L=>{L&&(d=!0)});const p={...e,element:d?document.createElement("div"):null},v=new r.Marker(p);return v.setLngLat([e.longitude,e.latitude]),v.getElement().addEventListener("click",L=>{var C,E;(E=(C=o.current.props).onClick)==null||E.call(C,{type:"click",target:v,originalEvent:L})}),v.on("dragstart",L=>{var E,b;const C=L;C.lngLat=i.getLngLat(),(b=(E=o.current.props).onDragStart)==null||b.call(E,C)}),v.on("drag",L=>{var E,b;const C=L;C.lngLat=i.getLngLat(),(b=(E=o.current.props).onDrag)==null||b.call(E,C)}),v.on("dragend",L=>{var E,b;const C=L;C.lngLat=i.getLngLat(),(b=(E=o.current.props).onDragEnd)==null||b.call(E,C)}),v},[]);c.useEffect(()=>(i.addTo(n.getMap()),()=>{i.remove()}),[]);const{longitude:a,latitude:s,offset:u,style:f,draggable:g=!1,popup:l=null,rotation:m=0,rotationAlignment:y="auto",pitchAlignment:h="auto"}=e;return c.useEffect(()=>{w(i.getElement(),f)},[f]),c.useImperativeHandle(t,()=>i,[]),(i.getLngLat().lng!==a||i.getLngLat().lat!==s)&&i.setLngLat([a,s]),u&&!X(i.getOffset(),u)&&i.setOffset(u),i.isDraggable()!==g&&i.setDraggable(g),i.getRotation()!==m&&i.setRotation(m),i.getRotationAlignment()!==y&&i.setRotationAlignment(y),i.getPitchAlignment()!==h&&i.setPitchAlignment(h),i.getPopup()!==l&&i.setPopup(l),Y.createPortal(e.children,i.getElement())}));function W(e){return new Set(e?e.trim().split(/\s+/):[])}const fe=c.memo(c.forwardRef((e,t)=>{const{map:n,mapLib:r}=c.useContext(N),o=c.useMemo(()=>document.createElement("div"),[]),i=c.useRef({props:e});i.current.props=e;const a=c.useMemo(()=>{const s={...e},u=new r.Popup(s);return u.setLngLat([e.longitude,e.latitude]),u.once("open",f=>{var g,l;(l=(g=i.current.props).onOpen)==null||l.call(g,f)}),u},[]);if(c.useEffect(()=>{const s=u=>{var f,g;(g=(f=i.current.props).onClose)==null||g.call(f,u)};return a.on("close",s),a.setDOMContent(o).addTo(n.getMap()),()=>{a.off("close",s),a.isOpen()&&a.remove()}},[]),c.useEffect(()=>{w(a.getElement(),e.style)},[e.style]),c.useImperativeHandle(t,()=>a,[]),a.isOpen()&&((a.getLngLat().lng!==e.longitude||a.getLngLat().lat!==e.latitude)&&a.setLngLat([e.longitude,e.latitude]),e.offset&&!x(a.options.offset,e.offset)&&a.setOffset(e.offset),(a.options.anchor!==e.anchor||a.options.maxWidth!==e.maxWidth)&&(a.options.anchor=e.anchor,a.setMaxWidth(e.maxWidth)),a.options.className!==e.className)){const s=W(a.options.className),u=W(e.className);for(const f of s)u.has(f)||a.removeClassName(f);for(const f of u)s.has(f)||a.addClassName(f);a.options.className=e.className}return Y.createPortal(e.children,o)}));function M(e,t,n,r){const o=c.useContext(N),i=c.useMemo(()=>e(o),[]);return c.useEffect(()=>{const a=t,s=null,u=typeof t=="function"?t:null,{map:f}=o;return f.hasControl(i)||(f.addControl(i,a==null?void 0:a.position),s&&s(o)),()=>{u&&u(o),f.hasControl(i)&&f.removeControl(i)}},[]),i}function de(e){const t=M(({mapLib:n})=>new n.AttributionControl(e),{position:e.position});return c.useEffect(()=>{w(t._container,e.style)},[e.style]),null}c.memo(de);function me(e){const t=M(({mapLib:n})=>new n.FullscreenControl({container:e.containerId&&document.getElementById(e.containerId)}),{position:e.position});return c.useEffect(()=>{w(t._controlContainer,e.style)},[e.style]),null}c.memo(me);function ge(e,t){const n=c.useRef({props:e}),r=M(({mapLib:o})=>{const i=new o.GeolocateControl(e),a=i._setupUI;return i._setupUI=()=>{i._container.hasChildNodes()||a()},i.on("geolocate",s=>{var u,f;(f=(u=n.current.props).onGeolocate)==null||f.call(u,s)}),i.on("error",s=>{var u,f;(f=(u=n.current.props).onError)==null||f.call(u,s)}),i.on("outofmaxbounds",s=>{var u,f;(f=(u=n.current.props).onOutOfMaxBounds)==null||f.call(u,s)}),i.on("trackuserlocationstart",s=>{var u,f;(f=(u=n.current.props).onTrackUserLocationStart)==null||f.call(u,s)}),i.on("trackuserlocationend",s=>{var u,f;(f=(u=n.current.props).onTrackUserLocationEnd)==null||f.call(u,s)}),i},{position:e.position});return n.current.props=e,c.useImperativeHandle(t,()=>r,[]),c.useEffect(()=>{w(r._container,e.style)},[e.style]),null}c.memo(c.forwardRef(ge));function he(e){const t=M(({mapLib:n})=>new n.NavigationControl(e),{position:e.position});return c.useEffect(()=>{w(t._container,e.style)},[e.style]),null}const ye=c.memo(he);function pe(e){const t=M(({mapLib:i})=>new i.ScaleControl(e),{position:e.position}),n=c.useRef(e),r=n.current;n.current=e;const{style:o}=e;return e.maxWidth!==void 0&&e.maxWidth!==r.maxWidth&&(t.options.maxWidth=e.maxWidth),e.unit!==void 0&&e.unit!==r.unit&&t.setUnit(e.unit),c.useEffect(()=>{w(t._container,o)},[o]),null}c.memo(pe);function ve(e){const t=M(({mapLib:n})=>new n.TerrainControl(e),{position:e.position});return c.useEffect(()=>{w(t._container,e.style)},[e.style]),null}c.memo(ve);function Ce(e){const t=M(({mapLib:n})=>new n.LogoControl(e),{position:e.position});return c.useEffect(()=>{w(t._container,e.style)},[e.style]),null}c.memo(Ce);function P(e,t){if(!e)throw new Error(t)}let _e=0;function Le(e,t,n){if(e.style&&e.style._loaded){const r={...n};return delete r.id,delete r.children,e.addSource(t,r),e.getSource(t)}return null}function Ee(e,t,n){var a,s,u;P(t.id===n.id,"source id changed"),P(t.type===n.type,"source type changed");let r="",o=0;for(const f in t)f!=="children"&&f!=="id"&&!x(n[f],t[f])&&(r=f,o++);if(!o)return;const i=t.type;if(i==="geojson")e.setData(t.data);else if(i==="image")e.updateImage({url:t.url,coordinates:t.coordinates});else switch(r){case"coordinates":(a=e.setCoordinates)==null||a.call(e,t.coordinates);break;case"url":(s=e.setUrl)==null||s.call(e,t.url);break;case"tiles":(u=e.setTiles)==null||u.call(e,t.tiles);break;default:console.warn(`Unable to update <Source> prop: ${r}`)}}function Se(e){const t=c.useContext(N).map.getMap(),n=c.useRef(e),[,r]=c.useState(0),o=c.useMemo(()=>e.id||`jsx-source-${_e++}`,[]);c.useEffect(()=>{if(t){const a=()=>setTimeout(()=>r(s=>s+1),0);return t.on("styledata",a),a(),()=>{var s;if(t.off("styledata",a),t.style&&t.style._loaded&&t.getSource(o)){const u=(s=t.getStyle())==null?void 0:s.layers;if(u)for(const f of u)f.source===o&&t.removeLayer(f.id);t.removeSource(o)}}}},[t]);let i=t&&t.style&&t.getSource(o);return i?Ee(i,e,n.current):i=Le(t,o,e),n.current=e,i&&c.Children.map(e.children,a=>a&&c.cloneElement(a,{source:o}))||null}function xe(e,t,n,r){if(P(n.id===r.id,"layer id changed"),P(n.type===r.type,"layer type changed"),n.type==="custom"||r.type==="custom")return;const{layout:o={},paint:i={},filter:a,minzoom:s,maxzoom:u,beforeId:f}=n;if(f!==r.beforeId&&e.moveLayer(t,f),o!==r.layout){const g=r.layout||{};for(const l in o)x(o[l],g[l])||e.setLayoutProperty(t,l,o[l]);for(const l in g)o.hasOwnProperty(l)||e.setLayoutProperty(t,l,void 0)}if(i!==r.paint){const g=r.paint||{};for(const l in i)x(i[l],g[l])||e.setPaintProperty(t,l,i[l]);for(const l in g)i.hasOwnProperty(l)||e.setPaintProperty(t,l,void 0)}x(a,r.filter)||e.setFilter(t,a),(s!==r.minzoom||u!==r.maxzoom)&&e.setLayerZoomRange(t,s,u)}function be(e,t,n){if(e.style&&e.style._loaded&&(!("source"in n)||e.getSource(n.source))){const r={...n,id:t};delete r.beforeId,e.addLayer(r,n.beforeId)}}let we=0;function Me(e){const t=c.useContext(N).map.getMap(),n=c.useRef(e),[,r]=c.useState(0),o=c.useMemo(()=>e.id||`jsx-layer-${we++}`,[]);if(c.useEffect(()=>{if(t){const a=()=>r(s=>s+1);return t.on("styledata",a),a(),()=>{t.off("styledata",a),t.style&&t.style._loaded&&t.getLayer(o)&&t.removeLayer(o)}}},[t]),t&&t.style&&t.getLayer(o))try{xe(t,o,e,n.current)}catch(a){console.warn(a)}else be(t,o,e);return n.current=e,null}const Re={Dark:"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",Light:"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",Voyager:"https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",Contrast:"https://demotiles.maplibre.org/style.json",OSM:{version:8,sources:{osm:{type:"raster",tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256}},layers:[{id:"osm-layer",type:"raster",source:"osm"}]}};var $={},z={},U=34,T=10,A=13;function G(e){return new Function("d","return {"+e.map(function(t,n){return JSON.stringify(t)+": d["+n+'] || ""'}).join(",")+"}")}function Ne(e,t){var n=G(e);return function(r,o){return t(n(r),o,e)}}function q(e){var t=Object.create(null),n=[];return e.forEach(function(r){for(var o in r)o in t||n.push(t[o]=o)}),n}function S(e,t){var n=e+"",r=n.length;return r<t?new Array(t-r+1).join(0)+n:n}function Fe(e){return e<0?"-"+S(-e,6):e>9999?"+"+S(e,6):S(e,4)}function Te(e){var t=e.getUTCHours(),n=e.getUTCMinutes(),r=e.getUTCSeconds(),o=e.getUTCMilliseconds();return isNaN(e)?"Invalid Date":Fe(e.getUTCFullYear())+"-"+S(e.getUTCMonth()+1,2)+"-"+S(e.getUTCDate(),2)+(o?"T"+S(t,2)+":"+S(n,2)+":"+S(r,2)+"."+S(o,3)+"Z":r?"T"+S(t,2)+":"+S(n,2)+":"+S(r,2)+"Z":n||t?"T"+S(t,2)+":"+S(n,2)+"Z":"")}function je(e){var t=new RegExp('["'+e+`
\r]`),n=e.charCodeAt(0);function r(l,m){var y,h,d=o(l,function(p,v){if(y)return y(p,v-1);h=p,y=m?Ne(p,m):G(p)});return d.columns=h||[],d}function o(l,m){var y=[],h=l.length,d=0,p=0,v,L=h<=0,C=!1;l.charCodeAt(h-1)===T&&--h,l.charCodeAt(h-1)===A&&--h;function E(){if(L)return z;if(C)return C=!1,$;var j,k=d,F;if(l.charCodeAt(k)===U){for(;d++<h&&l.charCodeAt(d)!==U||l.charCodeAt(++d)===U;);return(j=d)>=h?L=!0:(F=l.charCodeAt(d++))===T?C=!0:F===A&&(C=!0,l.charCodeAt(d)===T&&++d),l.slice(k+1,j-1).replace(/""/g,'"')}for(;d<h;){if((F=l.charCodeAt(j=d++))===T)C=!0;else if(F===A)C=!0,l.charCodeAt(d)===T&&++d;else if(F!==n)continue;return l.slice(k,j)}return L=!0,l.slice(k,h)}for(;(v=E())!==z;){for(var b=[];v!==$&&v!==z;)b.push(v),v=E();m&&(b=m(b,p++))==null||y.push(b)}return y}function i(l,m){return l.map(function(y){return m.map(function(h){return g(y[h])}).join(e)})}function a(l,m){return m==null&&(m=q(l)),[m.map(g).join(e)].concat(i(l,m)).join(`
`)}function s(l,m){return m==null&&(m=q(l)),i(l,m).join(`
`)}function u(l){return l.map(f).join(`
`)}function f(l){return l.map(g).join(e)}function g(l){return l==null?"":l instanceof Date?Te(l):t.test(l+="")?'"'+l.replace(/"/g,'""')+'"':l}return{parse:r,parseRows:o,format:a,formatBody:s,formatRows:u,formatRow:f,formatValue:g}}var ke=je(","),Pe=ke.parse;function ze(e){if(!e.ok)throw new Error(e.status+" "+e.statusText);return e.text()}function Ue(e,t){return fetch(e,t).then(ze)}function Ae(e){return function(t,n,r){return arguments.length===2&&typeof n=="function"&&(r=n,n=void 0),Ue(t,n).then(function(o){return e(o,r)})}}var Ie=Ae(Pe);const He=async({url:e,setIsLoading:t,setError:n,setHeaders:r,setCsvData:o})=>{if(e){t(!0),n(null);try{const i=await fetch(e);if(!i.ok)throw new Error(`Failed to fetch CSV: ${i.status}`);const a=await i.text();J.parse(a,{complete:s=>{const u=s.data;u.length>0&&(r(u[0]),o(u)),t(!1)},error:s=>{n(`Error parsing CSV: ${s.message}`),t(!1)}})}catch(i){n(`Error fetching CSV: ${i instanceof Error?i.message:String(i)}`),t(!1)}}},Oe=({data:e,latField:t,lngField:n,nameField:r,descField:o})=>({type:"FeatureCollection",features:e.map(u=>{const f=parseFloat(u[t]),g=parseFloat(u[n]);return isNaN(f)||isNaN(g)?null:{type:"Feature",geometry:{type:"Point",coordinates:[g,f]},properties:{name:r?u[r]:"",description:o?u[o]:""}}}).filter(u=>u!==null)}),Be=({params:e,updateCustomProp:t,className:n})=>{var m,y;console.log("params",e);const[r,o]=c.useState(null),[i,a]=c.useState(!0),[s,u]=c.useState(null),[f,g]=c.useState(null);c.useEffect(()=>{(async()=>{try{if(e.dataURL&&e.dataURL.length>10&&e.latField!==""&&e.lngField!==""){const d=await Ie(e.dataURL),p=Oe({data:d,latField:e.latField??"",lngField:e.lngField??"",nameField:e.nameField,descField:e.descField});o(p),a(!1)}}catch(d){console.error("Failed to parse mapFields parameter:",d),u("Invalid mapFields parameter in URL"),a(!1)}})()},[e.dataURL,e.latField,e.lngField,e.nameField,e.descField]);const l=c.useCallback(h=>{var p;const d=(p=h.features)==null?void 0:p[0];if(d&&d.geometry.type==="Point"){const[v,L]=d.geometry.coordinates;g({longitude:v,latitude:L,name:d.properties.name,description:d.properties.description})}},[]);return _.jsxs("div",{className:"relative "+n,children:[i&&_.jsx("div",{className:"flex items-center justify-center absolute z-10 h-full w-full bg-white bg-opacity-80",children:_.jsxs("div",{className:"flex flex-col items-center gap-2",children:[_.jsx("div",{className:"w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"}),_.jsx("p",{className:"text-gray-700 font-medium",children:"Loading map data..."})]})}),s&&_.jsx("div",{className:"flex items-center justify-center absolute z-10 h-full w-full bg-white bg-opacity-80",children:_.jsxs("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded",children:[_.jsx("p",{className:"font-bold",children:"Error"}),_.jsx("p",{children:s})]})}),!i&&_.jsxs(le,{initialViewState:{longitude:Number((m=e.mapCenter)==null?void 0:m[0])||0,latitude:Number((y=e.mapCenter)==null?void 0:y[1])||0,zoom:Number(e.mapZoom)||1,pitch:Number(e.mapPitch)||0,bearing:Number(e.mapBearing)||0},style:{width:"100%",height:"100%"},mapStyle:Re[e.mapStyle],interactiveLayerIds:r?["points"]:[],onClick:l,onMouseEnter:h=>{var d,p;((p=(d=h.features)==null?void 0:d[0])==null?void 0:p.layer.id)==="points"&&(h.target.getCanvas().style.cursor="pointer")},onMouseLeave:h=>{h.target.getCanvas().style.cursor=""},attributionControl:{customAttribution:"© Need a map like this -> <a href='https://geomapi.com/'>geomapi.com</a>"},onIdle:h=>{if(t&&t instanceof Function){const d=h.target,p=d.getCenter(),v=d.getZoom().toFixed(2);console.log("Center:",p,"Zoom:",v),t("mapZoom",v),t("mapCenter",[+p.lng.toFixed(4),+p.lat.toPrecision(4)]),t("mapPitch",d.getPitch().toFixed(2)),t("mapBearing",d.getBearing().toFixed(2))}},children:[_.jsx(ye,{position:"top-right"}),r&&_.jsx(Se,{id:"points-source",type:"geojson",data:r,children:_.jsx(Me,{id:"points",type:"circle",source:"points-source",paint:{"circle-radius":6,"circle-color":e.pinColor?`#${e.pinColor}`:"#007cbf","circle-stroke-width":2,"circle-stroke-color":"#ffffff","circle-opacity":.9}})}),f&&_.jsx(fe,{longitude:f.longitude,latitude:f.latitude,anchor:"bottom",onClose:()=>g(null),closeButton:!0,closeOnClick:!1,className:"map-popup",children:_.jsxs("div",{className:"p-1",children:[_.jsx("h3",{className:"font-bold text-gray-800",children:f.name}),f.description&&_.jsx("p",{className:"text-sm text-gray-600 mt-1",children:f.description})]})})]})]})};export{Be as M,Re as a,Ve as d,He as f};
