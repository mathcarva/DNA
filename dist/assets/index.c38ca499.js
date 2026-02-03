var j=Object.defineProperty,G=Object.defineProperties;var q=Object.getOwnPropertyDescriptors;var L=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable;var v=(e,t,o)=>t in e?j(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,f=(e,t)=>{for(var o in t||(t={}))B.call(t,o)&&v(e,o,t[o]);if(L)for(var o of L(t))Y.call(t,o)&&v(e,o,t[o]);return e},S=(e,t)=>G(e,q(t));var h=(e,t,o)=>(v(e,typeof t!="symbol"?t+"":t,o),o);import{S as H,C as N,V as p,a as E,G as X,D as K,W as Z,s as J,P as Q,t as ee,T as te,b as oe,c as ne,d as w,e as se,A as P,B as _,f as R,g as re,h as ie,i as ae,R as le,U as ce,E as de,j as ue,k as he,m as me,l as ve,n as g,o as $,p as x}from"./vendor.4cc07999.js";const fe=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}};fe();var pe=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"menu"})},we=[];function m(e,t,o,s,n,i,r,l){var a=typeof e=="function"?e.options:e;t&&(a.render=t,a.staticRenderFns=o,a._compiled=!0),s&&(a.functional=!0),i&&(a._scopeId="data-v-"+i);var d;if(r?(d=function(c){c=c||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!c&&typeof __VUE_SSR_CONTEXT__!="undefined"&&(c=__VUE_SSR_CONTEXT__),n&&n.call(this,c),c&&c._registeredComponents&&c._registeredComponents.add(r)},a._ssrRegister=d):n&&(d=l?function(){n.call(this,(a.functional?this.parent:this).$root.$options.shadowRoot)}:n),d)if(a.functional){a._injectStyles=d;var I=a.render;a.render=function(T,C){return d.call(C),I(T,C)}}else{var b=a.beforeCreate;a.beforeCreate=b?[].concat(b,d):[d]}return{exports:e,options:a}}const _e={name:"Menu"},M={};var ge=m(_e,pe,we,!1,ye,"337c773a",null,null);function ye(e){for(let t in M)this[t]=M[t]}var be=function(){return ge.exports}(),Ce=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"mobile-menu"})},Le=[];const Se={name:"MobileMenu"},k={};var Ee=m(Se,Ce,Le,!1,Pe,"cafa9dc0",null,null);function Pe(e){for(let t in k)this[t]=k[t]}var Re=function(){return Ee.exports}(),$e=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"footer"})},xe=[];const Me={name:"Footer"},D={};var ke=m(Me,$e,xe,!1,De,"0cc69dba",null,null);function De(e){for(let t in D)this[t]=D[t]}var We=function(){return ke.exports}(),Ae=`uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float vColorRandom;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
float PI = 3.141592653589793238;

void main()	{

	float alpha = 1. - smoothstep(-0.2,0.5,length(gl_PointCoord - vec2(0.2)));
	alpha *= 0.3;
	vec3 finalColor = uColor1;
	if(vColorRandom > 0.33 && vColorRandom < 0.66){
		finalColor = uColor2;
	}
	if(vColorRandom > 0.66){
		finalColor = uColor3;
	}

	float gradient = smoothstep(0.38,0.55,vUv.y);
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor = vec4(finalColor,1.);
	gl_FragColor = vec4(finalColor,alpha*gradient);
}`,Oe=`uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying float vColorRandom;
uniform sampler2D texture1;

attribute float randoms;
attribute float colorRandoms;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;
  vColorRandom = colorRandoms;
  vec4 mvPosition = modelViewMatrix * vec4( position, .8 );
  gl_PointSize = (13. * randoms + 5.) * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}`,ze="/assets/dna.37c768a7.glb";let Fe={uniforms:{tDiffuse:{value:null},distort:{value:.5},time:{value:0}},vertexShader:"varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}",fragmentShader:`uniform sampler2D tDiffuse;
        uniform float distort;
        uniform float time;
        varying vec2 vUv;

        const float max_distort = 1.;
        const int num_iter = 12;
        const float reci_num_iter_f = 1.0 / float(num_iter);

        vec2 barrelDistortion(vec2 coord, float amt) {
            vec2 cc = coord - 0.5;
            float dist = dot(cc, cc);
            return coord + cc * dist * amt;
        }

        float sat( float t )
        {
            return clamp( t, 0.0, 1.0 );
        }

        float linterp( float t ) {
            return sat( 1.0 - abs( 2.0*t - 1.0 ) );
        }

        float remap( float t, float a, float b ) {
            return sat( (t - a) / (b - a) );
        }

        vec4 spectrum_offset( float t ) {
            vec4 ret;
            float lo = step(t,0.5);
            float hi = 1.0-lo;
            float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
            ret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);

            return pow( ret, vec4(1.0/2.2) );
        }

        void main()
        {
            vec2 zUV=(vUv - vec2(0.5))*0.95 + vec2(0.5);

            vec4 sumcol = vec4(0.0);
            vec4 sumw = vec4(0.0);

            for ( int i=0; i<num_iter;++i )
            {
                float t = float(i) * reci_num_iter_f;
                vec4 w = spectrum_offset( t );
                sumw += w;
                sumcol += w * texture2D( tDiffuse, barrelDistortion(zUV, .2 * max_distort*t ) );
            }

            gl_FragColor = sumcol / sumw;
        }
    `};class Ue{constructor(){h(this,"loadObjects",()=>{this.loader.load(ze,t=>{this.geometry=t.scene.children[0].geometry,this.geometry.center(),this.addObjects(),this.createOrbs(),this.initPost(),this.resize(),window.addEventListener("resize",this.resize),this.render(),this.settings(),this.dna.position.y=-6})});h(this,"resize",()=>{this.width=window.innerWidth,this.height=window.innerHeight,this.renderer.setSize(this.width,this.height),this.composer.setSize(this.width,this.height),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix()});h(this,"render",()=>{this.time=this.clock.getElapsedTime(),this.bloomPass.threshold=this.settings.bloomThreshold,this.bloomPass.strength=this.settings.bloomStrength,this.bloomPass.radius=this.settings.bloomRadius,this.scrollVelocity*=.8;const t=this.baseRotationSpeed+this.scrollVelocity;this.dna.rotation.y+=t,this.material.uniforms.time.value=this.time,this.floatingGroup&&(this.floatingGroup.rotation.y+=3e-4);const o=this.mouse.x*0,s=this.mouse.y*.009+this.camera.position.y,n=new E(o,s,this.camera.position.z-1);this.camera.lookAt(n),requestAnimationFrame(this.render),this.composer.render()});h(this,"goTo",t=>{t==="home"&&this.loadObjects()});this.scene=new H,this.container=document.body,this.clock=new N,this.mouse=new p(0,0),this.targetLook=new E(0,0,0),this.initRenderer(),this.initCamera(),this.initControls(),this.initScrollSync(),this.initMouseParallax(),this.baseRotationSpeed=25e-5,this.scrollVelocity=0,this.loader=new X,this.dracoLoader=new K,this.dracoLoader.setDecoderPath("/draco/javascript/"),this.loader.setDRACOLoader(this.dracoLoader),this.container.appendChild(this.renderer.domElement)}initRenderer(){this.renderer=new Z,this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(2039590,.3),this.renderer.physicallyCorrectLights=!0,this.renderer.outputEncoding=J}initCamera(){this.camera=new Q(70,window.innerWidth/window.innerHeight,.001,1e3),this.camera.position.set(.5,0,6)}initMouseParallax(){window.addEventListener("mousemove",t=>{const o=t.clientX/window.innerWidth*2-1,s=-(t.clientY/window.innerHeight)*2+1;this.mouse.set(o,s)})}initControls(){const t=ee(te);this.controls=new t(this.camera,this.renderer.domElement),this.controls.enableRotate=!1,this.controls.enablePan=!1,this.controls.enableZoom=!1}initScrollSync(){window.addEventListener("scroll",()=>{const t=window.scrollY,o=.002;this.camera.position.y=-t*o;const s=window.scrollY-(this.lastScrollY||0);this.scrollVelocity+=s*5e-4,this.lastScrollY=t,this.camera.updateProjectionMatrix()})}addObjects(){this.material=new oe({extensions:{derivatives:"#extension GL_OES_standard_derivatives : enable"},side:ne,uniforms:{time:{value:0},uColor1:{value:new w(6366580)},uColor2:{value:new w(2700675)},uColor3:{value:new w(1660140)},resolution:{value:new se},uvRate1:{value:new p(1,1)},uOpacity:{value:1}},transparent:!0,vertexShader:Oe,fragmentShader:Ae,depthTest:!1,depthWrite:!1,blending:P}),this.number=this.geometry.attributes.position.array.length;let t=new Float32Array(this.number/3),o=new Float32Array(this.number/3);for(let s=0;s<this.number/3;s++)t[s]=Math.random(),o[s]=Math.random();this.geometry.setAttribute("randoms",new _(t,1)),this.geometry.setAttribute("colorRandoms",new _(o,1)),this.dna=new R(this.geometry,this.material),this.scene.add(this.dna)}createOrbs(){this.floatingGroup=new re;const t=100,o=10,s=new Float32Array(t*3);for(let r=0;r<t;r++){const l=r*3;s[l]=(Math.random()-.5)*o,s[l+1]=(Math.random()-.5)*o,s[l+2]=(Math.random()-.5)*o}const n=new ie;n.setAttribute("position",new _(s,3));const i=new ae({color:16777215,size:.03,transparent:!0,opacity:.25,depthWrite:!1,blending:P});this.floatingParticles=new R(n,i),this.floatingGroup.add(this.floatingParticles),this.scene.add(this.floatingGroup)}initPost(){this.renderScene=new le(this.scene,this.camera),this.bloomPass=new ce(new p(window.innerWidth,window.innerHeight),1.4,.87,.01),this.composer=new de(this.renderer),this.composer.addPass(this.renderScene),this.composer.addPass(this.bloomPass),this.effect1=new ue(Fe),this.composer.addPass(this.effect1)}settings(){this.settings={progress:0,bloomThreshold:0,bloomStrength:.88,bloomRadius:-.01},this.gui=new he,this.gui.add(this.settings,"progress",0,1,.01),this.gui.add(this.settings,"bloomThreshold",0,1,.01),this.gui.add(this.settings,"bloomStrength",0,100,.01),this.gui.add(this.settings,"bloomRadius",0,10,.01)}}var Ve=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"default-layout",attrs:{id:"default-layout"}},[e.isDesktop?e._e():o("MobileMenu"),e.isDesktop?o("Menu"):e._e(),o("transition",{attrs:{name:"fade",mode:"out-in"}},[o("router-view")],1),o("Footer")],1)},Ie=[];const Te={name:"DefaultLayout",components:{Menu:be,MobileMenu:Re,Footer:We},methods:S(f({},me(["setWindowWidth","setSketch"])),{handleResize(){this.setWindowWidth(window.innerWidth)},handleScroll(){const e=window.scrollY||window.pageYOffset;this.sketchInstance&&typeof this.sketchInstance.onScroll=="function"&&this.sketchInstance.onScroll(e)}}),computed:f({},ve(["isDesktop"])),mounted(){this.sketchInstance=new Ue,this.setSketch(this.sketchInstance),window.addEventListener("resize",this.handleResize),window.addEventListener("scroll",this.handleScroll)},beforeDestroy(){window.removeEventListener("resize",this.handleResize),window.removeEventListener("scroll",this.handleScroll)}},W={};var je=m(Te,Ve,Ie,!1,Ge,null,null,null);function Ge(e){for(let t in W)this[t]=W[t]}var qe=function(){return je.exports}(),Be=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"app"}},[o("DefaultLayout")],1)},Ye=[];const He={name:"App",components:{DefaultLayout:qe}},A={};var Ne=m(He,Be,Ye,!1,Xe,null,null,null);function Xe(e){for(let t in A)this[t]=A[t]}var Ke=function(){return Ne.exports}();const Ze="modulepreload",O={},Je="/",Qe=function(t,o){return!o||o.length===0?t():Promise.all(o.map(s=>{if(s=`${Je}${s}`,s in O)return;O[s]=!0;const n=s.endsWith(".css"),i=n?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${i}`))return;const r=document.createElement("link");if(r.rel=n?"stylesheet":Ze,n||(r.as="script",r.crossOrigin=""),r.href=s,document.head.appendChild(r),n)return new Promise((l,a)=>{r.addEventListener("load",l),r.addEventListener("error",a)})})).then(()=>t())};g.use($);const et=[{path:"/",name:"Home",component:()=>Qe(()=>import("./Home.bb1708ea.js"),["assets/Home.bb1708ea.js","assets/vendor.4cc07999.js"])}],tt=new $({mode:"history",routes:et});var ot={state:{sketch:null},getters:{sketch:e=>e.sketch},mutations:{setSketch(e,t){e.sketch=t}},actions:{setSketch({commit:e},t){e("setSketch",t)}}};g.use(x);var nt=new x.Store({state:{windowWidth:window.innerWidth},getters:{isDesktop:e=>e.windowWidth>1024},mutations:{setWindowWidth(e,t){e.windowWidth=t}},actions:{setWindowWidth({commit:e},t){e("setWindowWidth",t)}},modules:{threeModule:ot}});new g({router:tt,store:nt,render:e=>e(Ke)}).$mount("#app");const z=document.querySelector(".menuzito"),u=document.getElementById("menuFullscreen"),F=document.getElementById("menuText");function y(){u.classList.contains("show")?(u.classList.remove("show"),u.classList.add("hiding"),document.body.classList.remove("scroll-lock"),setTimeout(()=>{u.classList.remove("hiding")},700),F.textContent="MENU"):(u.classList.add("show"),document.body.classList.add("scroll-lock"),F.textContent="CLOSE")}z.addEventListener("click",y);z.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),y())});window.addEventListener("keydown",e=>{e.key==="Escape"&&u.classList.contains("show")&&y()});const st=document.querySelectorAll(".menu-fullscreen ul li a"),U=document.querySelector(".menu-fullscreen ul");st.forEach(e=>{e.addEventListener("mouseenter",()=>{U.classList.add("hovering"),e.classList.add("hovered")}),e.addEventListener("mouseleave",()=>{U.classList.remove("hovering"),e.classList.remove("hovered")})});const rt=document.querySelectorAll(".contador"),it=2e3,at=e=>{const t=parseInt(e.getAttribute("data-final"),10),o=e.getAttribute("data-sufixo")||"",s=20,n=it/s,i=t/n;let r=0;const l=setInterval(()=>{r+=i,r>=t?(e.textContent=t+o,clearInterval(l)):e.textContent=Math.round(r)+o},s)},lt=new IntersectionObserver((e,t)=>{e.forEach(o=>{o.isIntersecting&&(at(o.target),t.unobserve(o.target))})},{threshold:.5});rt.forEach(e=>{lt.observe(e)});function V(){const e=document.querySelectorAll(".reveal"),t=window.innerHeight*.85;e.forEach(o=>{if(o.getBoundingClientRect().top<t&&!o.classList.contains("active")){const n=Math.random()*500;o.style.transitionDelay=`${n}ms`,o.classList.add("active")}})}window.addEventListener("scroll",V);window.addEventListener("load",V);const ct=document.querySelectorAll(".btn2, .btn3");ct.forEach(e=>{e.addEventListener("mouseenter",()=>{e.classList.add("hovered"),e.classList.remove("unhovered")}),e.addEventListener("mouseleave",()=>{e.classList.remove("hovered"),e.classList.add("unhovered"),setTimeout(()=>{e.classList.remove("unhovered")},1e3)})});export{m as n};
