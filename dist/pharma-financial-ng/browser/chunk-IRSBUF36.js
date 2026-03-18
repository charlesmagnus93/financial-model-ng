import{c as ve}from"./chunk-E5OG5KJK.js";import{b as ye}from"./chunk-HDOSR7CS.js";import{Ba as _e,C as ee,Ca as C,E as te,Fa as q,H as pe,Ha as X,I as ge,Ka as be,Sa as xe,Za as we,fa as fe,j as N,l as P,m as R,n as ce,q as W,t as ue,ua as me}from"./chunk-DAMIWXFY.js";import{Ab as K,Db as D,Eb as Q,Fb as m,Gb as _,Hb as Y,Ia as r,Ib as se,Jb as oe,Qb as j,S as ie,Sb as b,T as $,Ta as M,Tb as x,U as F,Ua as H,Vb as re,Xa as L,Z as E,Za as f,ac as de,db as h,ea as c,eb as l,fa as u,fb as A,ia as T,ib as B,ic as w,jc as k,nb as p,oa as V,ob as g,pa as ae,pb as y,qb as O,qc as he,rb as z,rc as Z,sb as I,tb as S,tc as U,uc as G,vc as J,xb as v,yb as s,zb as le}from"./chunk-ICC5UB75.js";var Ee=["header"],ke=["expandicon"],$e=["collapseicon"],Fe=["content"],Me=["*",[["p-header"]]],He=["*","p-header"],Le=(t,o)=>({"p-fieldset p-component":!0,"p-fieldset-toggleable":t,"p-fieldset-expanded":o}),Ae=t=>({transitionParams:t,height:"0"}),Be=t=>({value:"hidden",params:t}),Oe=t=>({transitionParams:t,height:"*"}),ze=t=>({value:"visible",params:t});function Qe(t,o){t&1&&y(0,"PlusIcon",11),t&2&&(l("styleClass","p-fieldset-toggler"),h("data-pc-section","togglericon"))}function je(t,o){t&1&&I(0)}function Ne(t,o){if(t&1&&(p(0,"span",12),f(1,je,1,0,"ng-container",6),g()),t&2){let e=s(3);h("data-pc-section","togglericon"),r(),l("ngTemplateOutlet",e.expandIconTemplate||e._expandIconTemplate)}}function Pe(t,o){if(t&1&&(O(0),f(1,Qe,1,2,"PlusIcon",9)(2,Ne,2,2,"span",10),z()),t&2){let e=s(2);r(),l("ngIf",!e.expandIconTemplate&&!e._expandIconTemplate),r(),l("ngIf",e.expandIconTemplate||e._expandIconTemplate)}}function Re(t,o){t&1&&y(0,"MinusIcon",11),t&2&&(l("styleClass","p-fieldset-toggler"),h("aria-hidden",!0)("data-pc-section","togglericon"))}function We(t,o){t&1&&I(0)}function qe(t,o){if(t&1&&(p(0,"span",12),f(1,We,1,0,"ng-container",6),g()),t&2){let e=s(3);h("data-pc-section","togglericon"),r(),l("ngTemplateOutlet",e.collapseIconTemplate||e._collapseIconTemplate)}}function Xe(t,o){if(t&1&&(O(0),f(1,Re,1,3,"MinusIcon",9)(2,qe,2,2,"span",10),z()),t&2){let e=s(2);r(),l("ngIf",!e.collapseIconTemplate&&!e._collapseIconTemplate),r(),l("ngIf",e.collapseIconTemplate||e._collapseIconTemplate)}}function Ke(t,o){t&1&&I(0)}function Ye(t,o){if(t&1){let e=S();O(0),p(1,"button",7),v("click",function(n){c(e);let a=s();return u(a.toggle(n))})("keydown",function(n){c(e);let a=s();return u(a.onKeyDown(n))}),f(2,Pe,3,2,"ng-container",8)(3,Xe,3,2,"ng-container",8)(4,Ke,1,0,"ng-container",6),g(),z()}if(t&2){let e=s(),i=Y(4);r(),h("id",e.id+"_header")("aria-controls",e.id+"_content")("aria-expanded",!e.collapsed)("aria-label",e.buttonAriaLabel),r(),l("ngIf",e.collapsed),r(),l("ngIf",!e.collapsed),r(),l("ngTemplateOutlet",i)}}function Ze(t,o){t&1&&I(0)}function Ue(t,o){if(t&1&&(p(0,"span",13),se(1),g(),K(2,1),f(3,Ze,1,0,"ng-container",6)),t&2){let e=s();h("data-pc-section","legendtitle"),r(),oe(e.legend),r(2),l("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function Ge(t,o){t&1&&I(0)}var Je=({dt:t})=>`
.p-fieldset {
    background: ${t("fieldset.background")};
    border: 1px solid ${t("fieldset.border.color")};
    border-radius: ${t("fieldset.border.radius")};
    color: ${t("fieldset.color")};
    padding:  ${t("fieldset.padding")};
    margin: 0;
}

.p-fieldset-legend {
    background: ${t("fieldset.legend.background")};
    border-radius: ${t("fieldset.legend.border.radius")};
    border-width: ${t("fieldset.legend.border.width")};
    border-style: solid;
    border-color: ${t("fieldset.legend.border.color")};
    color: ${t("fieldset.legend.color")};
    padding: ${t("fieldset.legend.padding")};
    transition: background ${t("fieldset.transition.duration")}, color ${t("fieldset.transition.duration")}, outline-color ${t("fieldset.transition.duration")}, box-shadow ${t("fieldset.transition.duration")};
}

.p-fieldset-toggleable > .p-fieldset-legend {
    padding: 0;
}

.p-fieldset-toggle-button {
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    display: flex;
    gap: ${t("fieldset.legend.gap")};
    align-items: center;
    justify-content: center;
    padding: ${t("fieldset.legend.padding")};
    background: transparent;
    border: 0 none;
    border-radius: ${t("fieldset.legend.border.radius")};
    transition: background ${t("fieldset.transition.duration")}, color ${t("fieldset.transition.duration")}, outline-color ${t("fieldset.transition.duration")}, box-shadow ${t("fieldset.transition.duration")};
    outline-color: transparent;
}

.p-fieldset-legend-label {
    font-weight: ${t("fieldset.legend.font.weight")};
}

.p-fieldset-toggle-button:focus-visible {
    box-shadow: ${t("fieldset.legend.focus.ring.shadow")};
    outline: ${t("fieldset.legend.focus.ring.width")} ${t("fieldset.legend.focus.ring.style")} ${t("fieldset.legend.focus.ring.color")};
    outline-offset: ${t("fieldset.legend.focus.ring.offset")};
}

.p-fieldset-toggleable > .p-fieldset-legend:hover {
    color: ${t("fieldset.legend.hover.color")};
    background: ${t("fieldset.legend.hover.background")};
}

.p-fieldset-toggle-icon {
    color: ${t("fieldset.toggle.icon.color")};
    transition: color ${t("fieldset.transition.duration")};
}

.p-fieldset-toggleable > .p-fieldset-legend:hover .p-fieldset-toggle-icon {
    color: ${t("fieldset.toggle.icon.hover.color")};
}

.p-fieldset .p-fieldset-content {
    padding: ${t("fieldset.content.padding")};
}

/* For PrimeNG */
.p-fieldset-toggleable.p-fieldset-expanded > .p-fieldset-content-container:not(.ng-animating) {
    overflow: visible
}

.p-fieldset-toggleable .p-fieldset-content-container {
    overflow: hidden;
}
`,et={root:({props:t})=>["p-fieldset p-component",{"p-fieldset-toggleable":t.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",content:"p-fieldset-content"},Ce=(()=>{class t extends q{name="fieldset";theme=Je;classes=et;static \u0275fac=(()=>{let e;return function(n){return(e||(e=T(t)))(n||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var tt=(()=>{class t extends X{legend;toggleable;collapsed=!1;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";collapsedChange=new V;onBeforeToggle=new V;onAfterToggle=new V;get id(){return me("pn_id_")}get buttonAriaLabel(){return this.legend}animating;_componentStyle=E(Ce);headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(e){if(this.animating)return!1;this.animating=!0,this.onBeforeToggle.emit({originalEvent:e,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),this.onAfterToggle.emit({originalEvent:e,collapsed:this.collapsed}),e.preventDefault()}onKeyDown(e){(e.code==="Enter"||e.code==="Space")&&(this.toggle(e),e.preventDefault())}expand(){this.collapsed=!1,this.collapsedChange.emit(this.collapsed)}collapse(){this.collapsed=!0,this.collapsedChange.emit(this.collapsed)}getBlockableElement(){return this.el.nativeElement.children[0]}onToggleDone(){this.animating=!1}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"expandicon":this._expandIconTemplate=e.template;break;case"collapseicon":this._collapseIconTemplate=e.template;break;case"content":this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=T(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["p-fieldset"]],contentQueries:function(i,n,a){if(i&1&&(D(a,Ee,4),D(a,ke,4),D(a,$e,4),D(a,Fe,4),D(a,_e,4)),i&2){let d;m(d=_())&&(n.headerTemplate=d.first),m(d=_())&&(n.expandIconTemplate=d.first),m(d=_())&&(n.collapseIconTemplate=d.first),m(d=_())&&(n.contentTemplate=d.first),m(d=_())&&(n.templates=d)}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",w],collapsed:[2,"collapsed","collapsed",w],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions"},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[j([Ce]),L],ngContentSelectors:He,decls:9,vars:28,consts:[["legendContent",""],[3,"ngClass","ngStyle"],[1,"p-fieldset-legend"],[4,"ngIf","ngIfElse"],["role","region",1,"p-fieldset-content-container"],[1,"p-fieldset-content"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",1,"p-fieldset-toggle-button",3,"click","keydown"],[4,"ngIf"],[3,"styleClass",4,"ngIf"],["class","p-fieldset-toggler",4,"ngIf"],[3,"styleClass"],[1,"p-fieldset-toggler"],[1,"p-fieldset-legend-label"]],template:function(i,n){if(i&1){let a=S();le(Me),p(0,"fieldset",1)(1,"legend",2),f(2,Ye,5,7,"ng-container",3)(3,Ue,4,3,"ng-template",null,0,de),g(),p(5,"div",4),v("@fieldsetContent.done",function(){return c(a),u(n.onToggleDone())}),p(6,"div",5),K(7),f(8,Ge,1,0,"ng-container",6),g()()()}if(i&2){let a=Y(4);B(n.styleClass),l("ngClass",x(17,Le,n.toggleable,!n.collapsed&&n.toggleable))("ngStyle",n.style),h("id",n.id)("data-pc-name","fieldset")("data-pc-section","root"),r(),h("data-pc-section","legend"),r(),l("ngIf",n.toggleable)("ngIfElse",a),r(3),l("@fieldsetContent",n.collapsed?b(22,Be,b(20,Ae,n.transitionOptions)):b(26,ze,b(24,Oe,n.animating?n.transitionOptions:"0ms"))),h("id",n.id+"_content")("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("data-pc-section","toggleablecontent"),r(),h("data-pc-section","content"),r(2),l("ngTemplateOutlet",n.contentTemplate||n._contentTemplate)}},dependencies:[W,N,P,ce,R,xe,ye,ve,C],encapsulation:2,data:{animation:[he("fieldsetContent",[G("hidden",U({height:"0"})),G("visible",U({height:"*"})),J("visible <=> hidden",[Z("{{transitionParams}}")]),J("void => *",Z(0))])]},changeDetection:0})}return t})(),zt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=H({type:t});static \u0275inj=F({imports:[tt,C,C]})}return t})();var nt=["sliderHandle"],it=["sliderHandleStart"],at=["sliderHandleEnd"],lt=(t,o,e,i)=>({"p-slider p-component":!0,"p-disabled":t,"p-slider-horizontal":o,"p-slider-vertical":e,"p-slider-animate":i}),st=(t,o)=>({position:"absolute","inset-inline-start":t,width:o}),ot=(t,o)=>({position:"absolute",bottom:t,height:o}),rt=t=>({position:"absolute",height:t}),dt=t=>({position:"absolute",width:t}),ne=(t,o)=>({position:"absolute","inset-inline-start":t,bottom:o}),Se=t=>({"p-slider-handle-active":t});function ct(t,o){if(t&1&&y(0,"span",8),t&2){let e=s();l("ngStyle",x(2,st,e.offset!==null&&e.offset!==void 0?e.offset+"%":e.handleValues[0]+"%",e.diff?e.diff+"%":e.handleValues[1]-e.handleValues[0]+"%")),h("data-pc-section","range")}}function ut(t,o){if(t&1&&y(0,"span",8),t&2){let e=s();l("ngStyle",x(2,ot,e.offset!==null&&e.offset!==void 0?e.offset+"%":e.handleValues[0]+"%",e.diff?e.diff+"%":e.handleValues[1]-e.handleValues[0]+"%")),h("data-pc-section","range")}}function ht(t,o){if(t&1&&y(0,"span",8),t&2){let e=s();l("ngStyle",b(2,rt,e.handleValue+"%")),h("data-pc-section","range")}}function pt(t,o){if(t&1&&y(0,"span",8),t&2){let e=s();l("ngStyle",b(2,dt,e.handleValue+"%")),h("data-pc-section","range")}}function gt(t,o){if(t&1){let e=S();p(0,"span",9,0),v("touchstart",function(n){c(e);let a=s();return u(a.onDragStart(n))})("touchmove",function(n){c(e);let a=s();return u(a.onDrag(n))})("touchend",function(n){c(e);let a=s();return u(a.onDragEnd(n))})("mousedown",function(n){c(e);let a=s();return u(a.onMouseDown(n))})("keydown",function(n){c(e);let a=s();return u(a.onKeyDown(n))}),g()}if(t&2){let e=s();A("transition",e.dragging?"none":null),l("ngStyle",x(12,ne,e.orientation=="horizontal"?e.handleValue+"%":null,e.orientation=="vertical"?e.handleValue+"%":null))("pAutoFocus",e.autofocus),h("tabindex",e.disabled?null:e.tabindex)("aria-valuemin",e.min)("aria-valuenow",e.value)("aria-valuemax",e.max)("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("aria-orientation",e.orientation)("data-pc-section","handle")}}function ft(t,o){if(t&1){let e=S();p(0,"span",10,1),v("keydown",function(n){c(e);let a=s();return u(a.onKeyDown(n,0))})("mousedown",function(n){c(e);let a=s();return u(a.onMouseDown(n,0))})("touchstart",function(n){c(e);let a=s();return u(a.onDragStart(n,0))})("touchmove",function(n){c(e);let a=s();return u(a.onDrag(n))})("touchend",function(n){c(e);let a=s();return u(a.onDragEnd(n))}),g()}if(t&2){let e=s();A("transition",e.dragging?"none":null),l("ngStyle",x(13,ne,e.rangeStartLeft,e.rangeStartBottom))("ngClass",b(16,Se,e.handleIndex==0))("pAutoFocus",e.autofocus),h("tabindex",e.disabled?null:e.tabindex)("aria-valuemin",e.min)("aria-valuenow",e.value?e.value[0]:null)("aria-valuemax",e.max)("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("aria-orientation",e.orientation)("data-pc-section","startHandler")}}function mt(t,o){if(t&1){let e=S();p(0,"span",11,2),v("keydown",function(n){c(e);let a=s();return u(a.onKeyDown(n,1))})("mousedown",function(n){c(e);let a=s();return u(a.onMouseDown(n,1))})("touchstart",function(n){c(e);let a=s();return u(a.onDragStart(n,1))})("touchmove",function(n){c(e);let a=s();return u(a.onDrag(n))})("touchend",function(n){c(e);let a=s();return u(a.onDragEnd(n))}),g()}if(t&2){let e=s();A("transition",e.dragging?"none":null),l("ngStyle",x(12,ne,e.rangeEndLeft,e.rangeEndBottom))("ngClass",b(15,Se,e.handleIndex==1)),h("tabindex",e.disabled?null:e.tabindex)("aria-valuemin",e.min)("aria-valuenow",e.value?e.value[1]:null)("aria-valuemax",e.max)("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("aria-orientation",e.orientation)("data-pc-section","endHandler")}}var _t=({dt:t})=>`
.p-slider {
    position: relative;
    background: ${t("slider.track.background")};
    border-radius: ${t("slider.border.radius")};
}

.p-slider-handle {
    cursor: grab;
    touch-action: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${t("slider.handle.height")};
    width: ${t("slider.handle.width")};
    background: ${t("slider.handle.background")};
    border-radius: ${t("slider.handle.border.radius")};
    transition: background ${t("slider.transition.duration")}, color ${t("slider.transition.duration")}, border-color ${t("slider.transition.duration")}, box-shadow ${t("slider.transition.duration")}, outline-color ${t("slider.transition.duration")};
    outline-color: transparent;
}

.p-slider-handle::before {
    content: "";
    width: ${t("slider.handle.content.width")};
    height: ${t("slider.handle.content.height")};
    display: block;
    background: ${t("slider.handle.content.background")};
    border-radius: ${t("slider.handle.content.border.radius")};
    box-shadow: ${t("slider.handle.content.shadow")};
    transition: background ${t("slider.transition.duration")};
}

.p-slider:not(.p-disabled) .p-slider-handle:hover {
    background: ${t("slider.handle.hover.background")};
}

.p-slider:not(.p-disabled) .p-slider-handle:hover::before {
    background: ${t("slider.handle.content.hover.background")};
}

.p-slider-handle:focus-visible {
    border-color: ${t("slider.handle.focus.border.color")};
    box-shadow: ${t("slider.handle.focus.ring.shadow")};
    outline: ${t("slider.handle.focus.ring.width")} ${t("slider.handle.focus.ring.style")} ${t("slider.handle.focus.ring.color")};
    outline-offset: ${t("slider.handle.focus.ring.offset")};
}

.p-slider-range {
    display: block;
    background: ${t("slider.range.background")};
    border-radius: ${t("slider.border.radius")};
}

.p-slider.p-slider-horizontal {
    height: ${t("slider.track.size")};
}

.p-slider-horizontal .p-slider-range {
    top: 0;
    inset-inline-start: 0;
    height: 100%;
}

.p-slider-horizontal .p-slider-handle {
    top: 50%;
    margin-top: calc(-1 * calc(${t("slider.handle.height")} / 2));
    margin-inline-start: calc(-1 * calc(${t("slider.handle.width")} / 2));
}

.p-slider-vertical {
    min-height: 100px;
    width: ${t("slider.track.size")};
}

.p-slider-vertical .p-slider-handle {
    inset-inline-start: 50%;
    margin-inline-start: calc(-1 * calc(${t("slider.handle.width")} / 2));
    margin-bottom: calc(-1 * calc(${t("slider.handle.height")} / 2));
}

.p-slider-vertical .p-slider-range {
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
}
`,bt={handle:{position:"absolute"},range:{position:"absolute"}},yt={root:({props:t})=>["p-slider p-component",{"p-disabled":t.disabled,"p-slider-horizontal":t.orientation==="horizontal","p-slider-vertical":t.orientation==="vertical"}],range:"p-slider-range",handle:"p-slider-handle"},Ve=(()=>{class t extends q{name="slider";theme=_t;classes=yt;inlineStyles=bt;static \u0275fac=(()=>{let e;return function(n){return(e||(e=T(t)))(n||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var vt={provide:we,useExisting:ie(()=>Te),multi:!0},Te=(()=>{class t extends X{animate;disabled;min=0;max=100;orientation="horizontal";step;range;style;styleClass;ariaLabel;ariaLabelledBy;tabindex=0;autofocus;onChange=new V;onSlideEnd=new V;sliderHandle;sliderHandleStart;sliderHandleEnd;_componentStyle=E(Ve);value;values;handleValue;handleValues=[];diff;offset;bottom;onModelChange=()=>{};onModelTouched=()=>{};dragging;dragListener;mouseupListener;initX;initY;barWidth;barHeight;sliderHandleClick;handleIndex=0;startHandleValue;startx;starty;ngZone=E(ae);onMouseDown(e,i){this.disabled||(this.dragging=!0,this.updateDomData(),this.sliderHandleClick=!0,this.range&&this.handleValues&&this.handleValues[0]===this.max?this.handleIndex=0:this.handleIndex=i,this.bindDragListeners(),e.target.focus(),e.preventDefault(),this.animate&&te(this.el.nativeElement.children[0],"p-slider-animate"))}onDragStart(e,i){if(!this.disabled){var n=e.changedTouches[0];this.startHandleValue=this.range?this.handleValues[i]:this.handleValue,this.dragging=!0,this.range&&this.handleValues&&this.handleValues[0]===this.max?this.handleIndex=0:this.handleIndex=i,this.orientation==="horizontal"?(this.startx=parseInt(n.clientX,10),this.barWidth=this.el.nativeElement.children[0].offsetWidth):(this.starty=parseInt(n.clientY,10),this.barHeight=this.el.nativeElement.children[0].offsetHeight),this.animate&&te(this.el.nativeElement.children[0],"p-slider-animate"),e.preventDefault()}}onDrag(e){if(!this.disabled){var i=e.changedTouches[0],n=0;this.orientation==="horizontal"?n=Math.floor((parseInt(i.clientX,10)-this.startx)*100/this.barWidth)+this.startHandleValue:n=Math.floor((this.starty-parseInt(i.clientY,10))*100/this.barHeight)+this.startHandleValue,this.setValueFromHandle(e,n),e.preventDefault()}}onDragEnd(e){this.disabled||(this.dragging=!1,this.range?this.onSlideEnd.emit({originalEvent:e,values:this.values}):this.onSlideEnd.emit({originalEvent:e,value:this.value}),this.animate&&ee(this.el.nativeElement.children[0],"p-slider-animate"),e.preventDefault())}onBarClick(e){this.disabled||(this.sliderHandleClick||(this.updateDomData(),this.handleChange(e),this.range?this.onSlideEnd.emit({originalEvent:e,values:this.values}):this.onSlideEnd.emit({originalEvent:e,value:this.value})),this.sliderHandleClick=!1)}onKeyDown(e,i){switch(this.handleIndex=i,e.code){case"ArrowDown":case"ArrowLeft":this.decrementValue(e,i),e.preventDefault();break;case"ArrowUp":case"ArrowRight":this.incrementValue(e,i),e.preventDefault();break;case"PageDown":this.decrementValue(e,i,!0),e.preventDefault();break;case"PageUp":this.incrementValue(e,i,!0),e.preventDefault();break;case"Home":this.updateValue(this.min,e),e.preventDefault();break;case"End":this.updateValue(this.max,e),e.preventDefault();break;default:break}}decrementValue(e,i,n=!1){let a;this.range?this.step?a=this.values[i]-this.step:a=this.values[i]-1:this.step?a=this.value-this.step:!this.step&&n?a=this.value-10:a=this.value-1,this.updateValue(a,e),e.preventDefault()}incrementValue(e,i,n=!1){let a;this.range?this.step?a=this.values[i]+this.step:a=this.values[i]+1:this.step?a=this.value+this.step:!this.step&&n?a=this.value+10:a=this.value+1,this.updateValue(a,e),e.preventDefault()}handleChange(e){let i=this.calculateHandleValue(e);this.setValueFromHandle(e,i)}bindDragListeners(){ue(this.platformId)&&this.ngZone.runOutsideAngular(()=>{let e=this.el?this.el.nativeElement.ownerDocument:this.document;this.dragListener||(this.dragListener=this.renderer.listen(e,"mousemove",i=>{this.dragging&&this.ngZone.run(()=>{this.handleChange(i)})})),this.mouseupListener||(this.mouseupListener=this.renderer.listen(e,"mouseup",i=>{this.dragging&&(this.dragging=!1,this.ngZone.run(()=>{this.range?this.onSlideEnd.emit({originalEvent:i,values:this.values}):this.onSlideEnd.emit({originalEvent:i,value:this.value}),this.animate&&ee(this.el.nativeElement.children[0],"p-slider-animate")}))}))})}unbindDragListeners(){this.dragListener&&(this.dragListener(),this.dragListener=null),this.mouseupListener&&(this.mouseupListener(),this.mouseupListener=null)}setValueFromHandle(e,i){let n=this.getValueFromHandle(i);this.range?this.step?this.handleStepChange(n,this.values[this.handleIndex]):(this.handleValues[this.handleIndex]=i,this.updateValue(n,e)):this.step?this.handleStepChange(n,this.value):(this.handleValue=i,this.updateValue(n,e)),this.cd.markForCheck()}handleStepChange(e,i){let n=e-i,a=i,d=this.step;n<0?a=i+Math.ceil(e/d-i/d)*d:n>0&&(a=i+Math.floor(e/d-i/d)*d),this.updateValue(a),this.updateHandleValue()}writeValue(e){this.range?this.values=e||[0,0]:this.value=e||0,this.updateHandleValue(),this.updateDiffAndOffset(),this.cd.markForCheck()}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.disabled=e,this.cd.markForCheck()}get rangeStartLeft(){return this.isVertical()?null:this.handleValues[0]>100?"100%":this.handleValues[0]+"%"}get rangeStartBottom(){return this.isVertical()?this.handleValues[0]+"%":"auto"}get rangeEndLeft(){return this.isVertical()?null:this.handleValues[1]+"%"}get rangeEndBottom(){return this.isVertical()?this.handleValues[1]+"%":"auto"}isVertical(){return this.orientation==="vertical"}updateDomData(){let e=this.el.nativeElement.children[0].getBoundingClientRect();this.initX=e.left+pe(),this.initY=e.top+ge(),this.barWidth=this.el.nativeElement.children[0].offsetWidth,this.barHeight=this.el.nativeElement.children[0].offsetHeight}calculateHandleValue(e){return this.orientation==="horizontal"?fe(this.el.nativeElement)?(this.initX+this.barWidth-e.pageX)*100/this.barWidth:(e.pageX-this.initX)*100/this.barWidth:(this.initY+this.barHeight-e.pageY)*100/this.barHeight}updateHandleValue(){this.range?(this.handleValues[0]=(this.values[0]<this.min?0:this.values[0]-this.min)*100/(this.max-this.min),this.handleValues[1]=(this.values[1]>this.max?100:this.values[1]-this.min)*100/(this.max-this.min)):this.value<this.min?this.handleValue=0:this.value>this.max?this.handleValue=100:this.handleValue=(this.value-this.min)*100/(this.max-this.min),this.step&&this.updateDiffAndOffset()}updateDiffAndOffset(){this.diff=this.getDiff(),this.offset=this.getOffset()}getDiff(){return Math.abs(this.handleValues[0]-this.handleValues[1])}getOffset(){return Math.min(this.handleValues[0],this.handleValues[1])}updateValue(e,i){if(this.range){let n=e;this.handleIndex==0?(n<this.min?(n=this.min,this.handleValues[0]=0):n>this.values[1]&&n>this.max&&(n=this.max,this.handleValues[0]=100),this.sliderHandleStart?.nativeElement.focus()):(n>this.max?(n=this.max,this.handleValues[1]=100,this.offset=this.handleValues[1]):n<this.min?(n=this.min,this.handleValues[1]=0):n<this.values[0]&&(this.offset=this.handleValues[1]),this.sliderHandleEnd?.nativeElement.focus()),this.step?this.updateHandleValue():this.updateDiffAndOffset(),this.values[this.handleIndex]=this.getNormalizedValue(n);let a=[this.minVal,this.maxVal];this.onModelChange(a),this.onChange.emit({event:i,values:this.values})}else e<this.min?(e=this.min,this.handleValue=0):e>this.max&&(e=this.max,this.handleValue=100),this.value=this.getNormalizedValue(e),this.onModelChange(this.value),this.onChange.emit({event:i,value:this.value}),this.sliderHandle?.nativeElement.focus();this.updateHandleValue()}getValueFromHandle(e){return(this.max-this.min)*(e/100)+this.min}getDecimalsCount(e){return e&&Math.floor(e)!==e&&e.toString().split(".")[1].length||0}getNormalizedValue(e){let i=this.getDecimalsCount(this.step);return i>0?+parseFloat(e.toString()).toFixed(i):Math.floor(e)}ngOnDestroy(){this.unbindDragListeners(),super.ngOnDestroy()}get minVal(){return Math.min(this.values[1],this.values[0])}get maxVal(){return Math.max(this.values[1],this.values[0])}static \u0275fac=(()=>{let e;return function(n){return(e||(e=T(t)))(n||t)}})();static \u0275cmp=M({type:t,selectors:[["p-slider"]],viewQuery:function(i,n){if(i&1&&(Q(nt,5),Q(it,5),Q(at,5)),i&2){let a;m(a=_())&&(n.sliderHandle=a.first),m(a=_())&&(n.sliderHandleStart=a.first),m(a=_())&&(n.sliderHandleEnd=a.first)}},inputs:{animate:[2,"animate","animate",w],disabled:[2,"disabled","disabled",w],min:[2,"min","min",k],max:[2,"max","max",k],orientation:"orientation",step:[2,"step","step",k],range:[2,"range","range",w],style:"style",styleClass:"styleClass",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",tabindex:[2,"tabindex","tabindex",k],autofocus:[2,"autofocus","autofocus",w]},outputs:{onChange:"onChange",onSlideEnd:"onSlideEnd"},features:[j([vt,Ve]),L],decls:8,vars:18,consts:[["sliderHandle",""],["sliderHandleStart",""],["sliderHandleEnd",""],[3,"click","ngStyle","ngClass"],["class","p-slider-range",3,"ngStyle",4,"ngIf"],["class","p-slider-handle","role","slider",3,"transition","ngStyle","pAutoFocus","touchstart","touchmove","touchend","mousedown","keydown",4,"ngIf"],["class","p-slider-handle","role","slider",3,"transition","ngStyle","ngClass","pAutoFocus","keydown","mousedown","touchstart","touchmove","touchend",4,"ngIf"],["class","p-slider-handle","role","slider",3,"transition","ngStyle","ngClass","keydown","mousedown","touchstart","touchmove","touchend",4,"ngIf"],[1,"p-slider-range",3,"ngStyle"],["role","slider",1,"p-slider-handle",3,"touchstart","touchmove","touchend","mousedown","keydown","ngStyle","pAutoFocus"],["role","slider",1,"p-slider-handle",3,"keydown","mousedown","touchstart","touchmove","touchend","ngStyle","ngClass","pAutoFocus"],["role","slider",1,"p-slider-handle",3,"keydown","mousedown","touchstart","touchmove","touchend","ngStyle","ngClass"]],template:function(i,n){i&1&&(p(0,"div",3),v("click",function(d){return n.onBarClick(d)}),f(1,ct,1,5,"span",4)(2,ut,1,5,"span",4)(3,ht,1,4,"span",4)(4,pt,1,4,"span",4)(5,gt,2,15,"span",5)(6,ft,2,18,"span",6)(7,mt,2,17,"span",7),g()),i&2&&(B(n.styleClass),l("ngStyle",n.style)("ngClass",re(13,lt,n.disabled,n.orientation=="horizontal",n.orientation=="vertical",n.animate)),h("data-pc-name","slider")("data-pc-section","root"),r(),l("ngIf",n.range&&n.orientation=="horizontal"),r(),l("ngIf",n.range&&n.orientation=="vertical"),r(),l("ngIf",!n.range&&n.orientation=="vertical"),r(),l("ngIf",!n.range&&n.orientation=="horizontal"),r(),l("ngIf",!n.range),r(),l("ngIf",n.range),r(),l("ngIf",n.range))},dependencies:[W,N,P,R,be,C],encapsulation:2,changeDetection:0})}return t})(),an=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=H({type:t});static \u0275inj=F({imports:[Te,C,C]})}return t})();export{tt as a,zt as b,Te as c,an as d};
