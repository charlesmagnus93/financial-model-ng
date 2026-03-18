import{Ba as Y,Ca as M,Fa as ee,Ha as oe,Ma as T,Za as ie,ab as ne,j as U,l as Z,n as K,oa as J,pa as W,q as X}from"./chunk-DAMIWXFY.js";import{Db as S,Eb as A,Fb as w,Gb as $,Ia as s,Qb as R,Rb as H,S as z,Sb as G,T as E,Ta as x,U as D,Ua as N,Xa as f,Z as L,Za as g,da as O,db as r,ea as C,eb as c,fa as y,ga as _,hb as V,ia as d,ib as p,ic as k,jc as P,nb as u,oa as v,ob as b,pb as h,qb as F,rb as B,ta as q,tb as Q,xb as j,yb as I}from"./chunk-ICC5UB75.js";var ce=(()=>{class e extends T{static \u0275fac=(()=>{let i;return function(o){return(i||(i=d(e)))(o||e)}})();static \u0275cmp=x({type:e,selectors:[["CheckIcon"]],features:[f],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z","fill","currentColor"]],template:function(n,o){n&1&&(_(),u(0,"svg",0),h(1,"path",1),b()),n&2&&(p(o.getClassNames()),r("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role))},encapsulation:2})}return e})();var ae=(()=>{class e extends T{static \u0275fac=(()=>{let i;return function(o){return(i||(i=d(e)))(o||e)}})();static \u0275cmp=x({type:e,selectors:[["MinusIcon"]],features:[f],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(n,o){n&1&&(_(),u(0,"svg",0),h(1,"path",1),b()),n&2&&(p(o.getClassNames()),r("aria-label",o.ariaLabel)("aria-hidden",o.ariaHidden)("role",o.role))},encapsulation:2})}return e})();var se=["checkboxicon"],he=["input"],de=()=>({"p-checkbox-input":!0}),pe=e=>({checked:e,class:"p-checkbox-icon"});function ue(e,a){if(e&1&&h(0,"span",8),e&2){let i=I(3);c("ngClass",i.checkboxIcon),r("data-pc-section","icon")}}function be(e,a){e&1&&h(0,"CheckIcon",9),e&2&&(c("styleClass","p-checkbox-icon"),r("data-pc-section","icon"))}function ke(e,a){if(e&1&&(F(0),g(1,ue,1,2,"span",7)(2,be,1,2,"CheckIcon",6),B()),e&2){let i=I(2);s(),c("ngIf",i.checkboxIcon),s(),c("ngIf",!i.checkboxIcon)}}function xe(e,a){e&1&&h(0,"MinusIcon",9),e&2&&(c("styleClass","p-checkbox-icon"),r("data-pc-section","icon"))}function fe(e,a){if(e&1&&(F(0),g(1,ke,3,2,"ng-container",4)(2,xe,1,2,"MinusIcon",6),B()),e&2){let i=I();s(),c("ngIf",i.checked),s(),c("ngIf",i._indeterminate())}}function me(e,a){}function ge(e,a){e&1&&g(0,me,0,0,"ng-template")}var Ce=({dt:e})=>`
.p-checkbox {
    position: relative;
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    width: ${e("checkbox.width")};
    height: ${e("checkbox.height")};
}

.p-checkbox-input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    outline: 0 none;
    border: 1px solid transparent;
    border-radius: ${e("checkbox.border.radius")};
}

.p-checkbox-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${e("checkbox.border.radius")};
    border: 1px solid ${e("checkbox.border.color")};
    background: ${e("checkbox.background")};
    width: ${e("checkbox.width")};
    height: ${e("checkbox.height")};
    transition: background ${e("checkbox.transition.duration")}, color ${e("checkbox.transition.duration")}, border-color ${e("checkbox.transition.duration")}, box-shadow ${e("checkbox.transition.duration")}, outline-color ${e("checkbox.transition.duration")};
    outline-color: transparent;
    box-shadow: ${e("checkbox.shadow")};
}

.p-checkbox-icon {
    transition-duration: ${e("checkbox.transition.duration")};
    color: ${e("checkbox.icon.color")};
    font-size: ${e("checkbox.icon.size")};
    width: ${e("checkbox.icon.size")};
    height: ${e("checkbox.icon.size")};
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    border-color: ${e("checkbox.hover.border.color")};
}

.p-checkbox-checked .p-checkbox-box {
    border-color: ${e("checkbox.checked.border.color")};
    background: ${e("checkbox.checked.background")};
}

.p-checkbox-checked .p-checkbox-icon {
    color: ${e("checkbox.icon.checked.color")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    background: ${e("checkbox.checked.hover.background")};
    border-color: ${e("checkbox.checked.hover.border.color")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
    color: ${e("checkbox.icon.checked.hover.color")};
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: ${e("checkbox.focus.border.color")};
    box-shadow: ${e("checkbox.focus.ring.shadow")};
    outline: ${e("checkbox.focus.ring.width")} ${e("checkbox.focus.ring.style")} ${e("checkbox.focus.ring.color")};
    outline-offset: ${e("checkbox.focus.ring.offset")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: ${e("checkbox.checked.focus.border.color")};
}

p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
    border-color: ${e("checkbox.invalid.border.color")};
}

.p-checkbox.p-variant-filled .p-checkbox-box {
    background: ${e("checkbox.filled.background")};
}

.p-checkbox-checked.p-variant-filled .p-checkbox-box {
    background: ${e("checkbox.checked.background")};
}

.p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    background: ${e("checkbox.checked.hover.background")};
}

.p-checkbox.p-disabled {
    opacity: 1;
}

.p-checkbox.p-disabled .p-checkbox-box {
    background: ${e("checkbox.disabled.background")};
    border-color: ${e("checkbox.checked.disabled.border.color")};
}

.p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
    color: ${e("checkbox.icon.disabled.color")};
}

.p-checkbox-sm,
.p-checkbox-sm .p-checkbox-box {
    width: ${e("checkbox.sm.width")};
    height: ${e("checkbox.sm.height")};
}

.p-checkbox-sm .p-checkbox-icon {
    font-size: ${e("checkbox.icon.sm.size")};
    width: ${e("checkbox.icon.sm.size")};
    height: ${e("checkbox.icon.sm.size")};
}

.p-checkbox-lg,
.p-checkbox-lg .p-checkbox-box {
    width: ${e("checkbox.lg.width")};
    height: ${e("checkbox.lg.height")};
}

.p-checkbox-lg .p-checkbox-icon {
    font-size: ${e("checkbox.icon.lg.size")};
    width: ${e("checkbox.icon.lg.size")};
    height: ${e("checkbox.icon.lg.size")};
}
`,ye={root:({instance:e,props:a})=>["p-checkbox p-component",{"p-checkbox-checked":e.checked,"p-disabled":a.disabled,"p-invalid":a.invalid,"p-variant-filled":a.variant?a.variant==="filled":e.config.inputStyle==="filled"||e.config.inputVariant==="filled"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},re=(()=>{class e extends ee{name="checkbox";theme=Ce;classes=ye;static \u0275fac=(()=>{let i;return function(o){return(i||(i=d(e)))(o||e)}})();static \u0275prov=E({token:e,factory:e.\u0275fac})}return e})();var _e={provide:ie,useExisting:z(()=>le),multi:!0},le=(()=>{class e extends oe{value;name;disabled;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;style;inputStyle;styleClass;inputClass;indeterminate=!1;size;formControl;checkboxIcon;readonly;required;autofocus;trueValue=!0;falseValue=!1;variant;onChange=new v;onFocus=new v;onBlur=new v;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.model===this.trueValue:W(this.value,this.model)}get containerClass(){return{"p-checkbox p-component":!0,"p-checkbox-checked p-highlight":this.checked,"p-disabled":this.disabled,"p-variant-filled":this.variant==="filled"||this.config.inputStyle()==="filled"||this.config.inputVariant()==="filled","p-checkbox-sm p-inputfield-sm":this.size==="small","p-checkbox-lg p-inputfield-lg":this.size==="large"}}_indeterminate=q(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;model;onModelChange=()=>{};onModelTouched=()=>{};focused=!1;_componentStyle=L(re);ngAfterContentInit(){this.templates.forEach(i=>{switch(i.getType()){case"icon":this._checkboxIconTemplate=i.template;break;case"checkboxicon":this._checkboxIconTemplate=i.template;break}})}ngOnChanges(i){super.ngOnChanges(i),i.indeterminate&&this._indeterminate.set(i.indeterminate.currentValue)}updateModel(i){let n,o=this.injector.get(ne,null,{optional:!0,self:!0}),t=o&&!this.formControl?o.value:this.model;this.binary?(n=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.model=n,this.onModelChange(n)):(this.checked||this._indeterminate()?n=t.filter(l=>!J(l,this.value)):n=t?[...t,this.value]:[this.value],this.onModelChange(n),this.model=n,this.formControl&&this.formControl.setValue(n)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:n,originalEvent:i})}handleChange(i){this.readonly||this.updateModel(i)}onInputFocus(i){this.focused=!0,this.onFocus.emit(i)}onInputBlur(i){this.focused=!1,this.onBlur.emit(i),this.onModelTouched()}focus(){this.inputViewChild.nativeElement.focus()}writeValue(i){this.model=i,this.cd.markForCheck()}registerOnChange(i){this.onModelChange=i}registerOnTouched(i){this.onModelTouched=i}setDisabledState(i){setTimeout(()=>{this.disabled=i,this.cd.markForCheck()})}static \u0275fac=(()=>{let i;return function(o){return(i||(i=d(e)))(o||e)}})();static \u0275cmp=x({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(n,o,t){if(n&1&&(S(t,se,4),S(t,Y,4)),n&2){let l;w(l=$())&&(o.checkboxIconTemplate=l.first),w(l=$())&&(o.templates=l)}},viewQuery:function(n,o){if(n&1&&A(he,5),n&2){let t;w(t=$())&&(o.inputViewChild=t.first)}},inputs:{value:"value",name:"name",disabled:[2,"disabled","disabled",k],binary:[2,"binary","binary",k],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",P],inputId:"inputId",style:"style",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",k],size:"size",formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",k],required:[2,"required","required",k],autofocus:[2,"autofocus","autofocus",k],trueValue:"trueValue",falseValue:"falseValue",variant:"variant"},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[R([_e,re]),f,O],decls:6,vars:29,consts:[["input",""],[3,"ngClass"],["type","checkbox",3,"focus","blur","change","value","checked","disabled","readonly","ngClass"],[1,"p-checkbox-box"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"styleClass",4,"ngIf"],["class","p-checkbox-icon",3,"ngClass",4,"ngIf"],[1,"p-checkbox-icon",3,"ngClass"],[3,"styleClass"]],template:function(n,o){if(n&1){let t=Q();u(0,"div",1)(1,"input",2,0),j("focus",function(m){return C(t),y(o.onInputFocus(m))})("blur",function(m){return C(t),y(o.onInputBlur(m))})("change",function(m){return C(t),y(o.handleChange(m))}),b(),u(3,"div",3),g(4,fe,3,2,"ng-container",4)(5,ge,1,0,null,5),b()()}n&2&&(V(o.style),p(o.styleClass),c("ngClass",o.containerClass),r("data-p-highlight",o.checked)("data-p-checked",o.checked)("data-p-disabled",o.disabled),s(),V(o.inputStyle),p(o.inputClass),c("value",o.value)("checked",o.checked)("disabled",o.disabled)("readonly",o.readonly)("ngClass",H(26,de)),r("id",o.inputId)("name",o.name)("tabindex",o.tabindex)("required",o.required?!0:null)("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel),s(3),c("ngIf",!o.checkboxIconTemplate&&!o._checkboxIconTemplate),s(),c("ngTemplateOutlet",o.checkboxIconTemplate||o._checkboxIconTemplate)("ngTemplateOutletContext",G(27,pe,o.checked)))},dependencies:[X,U,Z,K,ce,ae,M],encapsulation:2,changeDetection:0})}return e})(),Pe=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=N({type:e});static \u0275inj=D({imports:[le,M,M]})}return e})();export{ce as a,ae as b,le as c,Pe as d};
