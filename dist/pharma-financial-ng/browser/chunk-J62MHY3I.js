import{$ as Gt,$a as Vn,A as ji,Ab as Ve,C as Hi,Db as ht,Fb as ft,G as zi,Gb as pt,Ia as V,Ib as Jt,Ja as Zi,Jb as Qt,Ka as ct,Ma as le,Na as p,O as Gi,Pa as Yt,Qb as M,R as U,S as pe,Sb as Un,T as v,Ta as W,U as N,Ua as L,Va as _,W as I,Wa as $n,Xa as E,Y as P,Z as m,Za as ke,a as D,ab as Xi,b as Q,ba as Wi,ca as Ki,d as Ht,da as ee,db as ne,eb as x,ec as jn,fb as Ji,fc as ze,g as Pn,ga as Wt,gb as He,gc as tr,hb as Qi,hc as nr,ia as A,ib as Ae,j as we,jc as R,ka as Kt,kc as Hn,la as qi,lc as ce,mc as Ie,na as Yi,nb as Fe,nc as gt,o as zt,oa as ae,ob as Te,p as kn,pa as qt,pb as ge,qb as Zt,ra as Se,rb as Xt,sa as G,sb as er,t as Le,ta as te,vb as Bn,wb as dt,xa as Pe,xb as me,yb as ue,z as Ui,zb as $e}from"./chunk-HZQEWPQG.js";var j=new I("");var or=null;function Be(){return or}function bs(t){or??=t}var zn=class{},mt=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:()=>m(sr),providedIn:"platform"})}return t})(),vs=new I(""),sr=(()=>{class t extends mt{_location;_history;_doc=m(j);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return Be().getBaseHref(this._doc)}onPopState(e){let i=Be().getGlobalEventTarget(this._doc,"window");return i.addEventListener("popstate",e,!1),()=>i.removeEventListener("popstate",e)}onHashChange(e){let i=Be().getGlobalEventTarget(this._doc,"window");return i.addEventListener("hashchange",e,!1),()=>i.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,i,r){this._history.pushState(e,i,r)}replaceState(e,i,r){this._history.replaceState(e,i,r)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:()=>new t,providedIn:"platform"})}return t})();function en(t,n){return t?n?t.endsWith("/")?n.startsWith("/")?t+n.slice(1):t+n:n.startsWith("/")?t+n:`${t}/${n}`:t:n}function ir(t){let n=t.search(/#|\?|$/);return t[n-1]==="/"?t.slice(0,n-1)+t.slice(n):t}function de(t){return t&&t[0]!=="?"?`?${t}`:t}var Ge=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:()=>m(ar),providedIn:"root"})}return t})(),tn=new I(""),ar=(()=>{class t extends Ge{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,i){super(),this._platformLocation=e,this._baseHref=i??this._platformLocation.getBaseHrefFromDOM()??m(j).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return en(this._baseHref,e)}path(e=!1){let i=this._platformLocation.pathname+de(this._platformLocation.search),r=this._platformLocation.hash;return r&&e?`${i}${r}`:i}pushState(e,i,r,o){let s=this.prepareExternalUrl(r+de(o));this._platformLocation.pushState(e,i,s)}replaceState(e,i,r,o){let s=this.prepareExternalUrl(r+de(o));this._platformLocation.replaceState(e,i,s)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(i){return new(i||t)(P(mt),P(tn,8))};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),lr=(()=>{class t{_subject=new we;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let i=this._locationStrategy.getBaseHref();this._basePath=Cs(ir(rr(i))),this._locationStrategy.onPopState(r=>{this._subject.next({url:this.path(!0),pop:!0,state:r.state,type:r.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,i=""){return this.path()==this.normalize(e+de(i))}normalize(e){return t.stripTrailingSlash(_s(this._basePath,rr(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,i="",r=null){this._locationStrategy.pushState(r,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+de(i)),r)}replaceState(e,i="",r=null){this._locationStrategy.replaceState(r,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+de(i)),r)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(i=>{this._notifyUrlChangeListeners(i.url,i.state)}),()=>{let i=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(i,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",i){this._urlChangeListeners.forEach(r=>r(e,i))}subscribe(e,i,r){return this._subject.subscribe({next:e,error:i??void 0,complete:r??void 0})}static normalizeQueryParams=de;static joinWithSlash=en;static stripTrailingSlash=ir;static \u0275fac=function(i){return new(i||t)(P(Ge))};static \u0275prov=v({token:t,factory:()=>Ds(),providedIn:"root"})}return t})();function Ds(){return new lr(P(Ge))}function _s(t,n){if(!t||!n.startsWith(t))return n;let e=n.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:n}function rr(t){return t.replace(/\/index.html$/,"")}function Cs(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var Es=(()=>{class t extends Ge{_platformLocation;_baseHref="";_removeListenerFns=[];constructor(e,i){super(),this._platformLocation=e,i!=null&&(this._baseHref=i)}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}path(e=!1){let i=this._platformLocation.hash??"#";return i.length>0?i.substring(1):i}prepareExternalUrl(e){let i=en(this._baseHref,e);return i.length>0?"#"+i:i}pushState(e,i,r,o){let s=this.prepareExternalUrl(r+de(o))||this._platformLocation.pathname;this._platformLocation.pushState(e,i,s)}replaceState(e,i,r,o){let s=this.prepareExternalUrl(r+de(o))||this._platformLocation.pathname;this._platformLocation.replaceState(e,i,s)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(i){return new(i||t)(P(mt),P(tn,8))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var sn=function(t){return t[t.Decimal=0]="Decimal",t[t.Percent=1]="Percent",t[t.Currency=2]="Currency",t[t.Scientific=3]="Scientific",t}(sn||{});var H={Decimal:0,Group:1,List:2,PercentSign:3,PlusSign:4,MinusSign:5,Exponential:6,SuperscriptingExponent:7,PerMille:8,Infinity:9,NaN:10,TimeSeparator:11,CurrencyDecimal:12,CurrencyGroup:13};function Oe(t,n){let e=Bn(t),i=e[dt.NumberSymbols][n];if(typeof i>"u"){if(n===H.CurrencyDecimal)return e[dt.NumberSymbols][H.Decimal];if(n===H.CurrencyGroup)return e[dt.NumberSymbols][H.Group]}return i}function qn(t,n){return Bn(t)[dt.NumberFormats][n]}var ws=/^(\d+)?\.((\d+)(-(\d+))?)?$/,ur=22,nn=".",yt="0",Ss=";",As=",",Gn="#";var Fs="%";function fr(t,n,e,i,r,o,s=!1){let a="",l=!1;if(!isFinite(t))a=Oe(e,H.Infinity);else{let u=Is(t);s&&(u=Ts(u));let c=n.minInt,d=n.minFrac,f=n.maxFrac;if(o){let C=o.match(ws);if(C===null)throw new Error(`${o} is not a valid digit info`);let S=C[1],O=C[3],se=C[5];S!=null&&(c=Wn(S)),O!=null&&(d=Wn(O)),se!=null?f=Wn(se):O!=null&&d>f&&(f=d)}Os(u,d,f);let h=u.digits,y=u.integerLen,g=u.exponent,b=[];for(l=h.every(C=>!C);y<c;y++)h.unshift(0);for(;y<0;y++)h.unshift(0);y>0?b=h.splice(y,h.length):(b=h,h=[0]);let w=[];for(h.length>=n.lgSize&&w.unshift(h.splice(-n.lgSize,h.length).join(""));h.length>n.gSize;)w.unshift(h.splice(-n.gSize,h.length).join(""));h.length&&w.unshift(h.join("")),a=w.join(Oe(e,i)),b.length&&(a+=Oe(e,r)+b.join("")),g&&(a+=Oe(e,H.Exponential)+"+"+g)}return t<0&&!l?a=n.negPre+a+n.negSuf:a=n.posPre+a+n.posSuf,a}function pr(t,n,e){let i=qn(n,sn.Percent),r=mr(i,Oe(n,H.MinusSign));return fr(t,r,n,H.Group,H.Decimal,e,!0).replace(new RegExp(Fs,"g"),Oe(n,H.PercentSign))}function gr(t,n,e){let i=qn(n,sn.Decimal),r=mr(i,Oe(n,H.MinusSign));return fr(t,r,n,H.Group,H.Decimal,e)}function mr(t,n="-"){let e={minInt:1,minFrac:0,maxFrac:0,posPre:"",posSuf:"",negPre:"",negSuf:"",gSize:0,lgSize:0},i=t.split(Ss),r=i[0],o=i[1],s=r.indexOf(nn)!==-1?r.split(nn):[r.substring(0,r.lastIndexOf(yt)+1),r.substring(r.lastIndexOf(yt)+1)],a=s[0],l=s[1]||"";e.posPre=a.substring(0,a.indexOf(Gn));for(let c=0;c<l.length;c++){let d=l.charAt(c);d===yt?e.minFrac=e.maxFrac=c+1:d===Gn?e.maxFrac=c+1:e.posSuf+=d}let u=a.split(As);if(e.gSize=u[1]?u[1].length:0,e.lgSize=u[2]||u[1]?(u[2]||u[1]).length:0,o){let c=r.length-e.posPre.length-e.posSuf.length,d=o.indexOf(Gn);e.negPre=o.substring(0,d).replace(/'/g,""),e.negSuf=o.slice(d+c).replace(/'/g,"")}else e.negPre=n+e.posPre,e.negSuf=e.posSuf;return e}function Ts(t){if(t.digits[0]===0)return t;let n=t.digits.length-t.integerLen;return t.exponent?t.exponent+=2:(n===0?t.digits.push(0,0):n===1&&t.digits.push(0),t.integerLen+=2),t}function Is(t){let n=Math.abs(t)+"",e=0,i,r,o,s,a;for((r=n.indexOf(nn))>-1&&(n=n.replace(nn,"")),(o=n.search(/e/i))>0?(r<0&&(r=o),r+=+n.slice(o+1),n=n.substring(0,o)):r<0&&(r=n.length),o=0;n.charAt(o)===yt;o++);if(o===(a=n.length))i=[0],r=1;else{for(a--;n.charAt(a)===yt;)a--;for(r-=o,i=[],s=0;o<=a;o++,s++)i[s]=Number(n.charAt(o))}return r>ur&&(i=i.splice(0,ur-1),e=r-1,r=1),{digits:i,exponent:e,integerLen:r}}function Os(t,n,e){if(n>e)throw new Error(`The minimum number of digits after fraction (${n}) is higher than the maximum (${e}).`);let i=t.digits,r=i.length-t.integerLen,o=Math.min(Math.max(n,r),e),s=o+t.integerLen,a=i[s];if(s>0){i.splice(Math.max(t.integerLen,s));for(let d=s;d<i.length;d++)i[d]=0}else{r=Math.max(0,r),t.integerLen=1,i.length=Math.max(1,s=o+1),i[0]=0;for(let d=1;d<s;d++)i[d]=0}if(a>=5)if(s-1<0){for(let d=0;d>s;d--)i.unshift(0),t.integerLen++;i.unshift(1),t.integerLen++}else i[s-1]++;for(;r<Math.max(0,o);r++)i.push(0);let l=o!==0,u=n+t.integerLen,c=i.reduceRight(function(d,f,h,y){return f=f+d,y[h]=f<10?f:f-10,l&&(y[h]===0&&h>=u?y.pop():l=!1),f>=10?1:0},0);c&&(i.unshift(c),t.integerLen++)}function Wn(t){let n=parseInt(t);if(isNaN(n))throw new Error("Invalid integer literal when parsing "+t);return n}var Kn=/\s+/,cr=[],Yn=(()=>{class t{_ngEl;_renderer;initialClasses=cr;rawClass;stateMap=new Map;constructor(e,i){this._ngEl=e,this._renderer=i}set klass(e){this.initialClasses=e!=null?e.trim().split(Kn):cr}set ngClass(e){this.rawClass=typeof e=="string"?e.trim().split(Kn):e}ngDoCheck(){for(let i of this.initialClasses)this._updateState(i,!0);let e=this.rawClass;if(Array.isArray(e)||e instanceof Set)for(let i of e)this._updateState(i,!0);else if(e!=null)for(let i of Object.keys(e))this._updateState(i,!!e[i]);this._applyStateDiff()}_updateState(e,i){let r=this.stateMap.get(e);r!==void 0?(r.enabled!==i&&(r.changed=!0,r.enabled=i),r.touched=!0):this.stateMap.set(e,{enabled:i,changed:!0,touched:!0})}_applyStateDiff(){for(let e of this.stateMap){let i=e[0],r=e[1];r.changed?(this._toggleClass(i,r.enabled),r.changed=!1):r.touched||(r.enabled&&this._toggleClass(i,!1),this.stateMap.delete(i)),r.touched=!1}}_toggleClass(e,i){e=e.trim(),e.length>0&&e.split(Kn).forEach(r=>{i?this._renderer.addClass(this._ngEl.nativeElement,r):this._renderer.removeClass(this._ngEl.nativeElement,r)})}static \u0275fac=function(i){return new(i||t)(p(G),p(le))};static \u0275dir=_({type:t,selectors:[["","ngClass",""]],inputs:{klass:[0,"class","klass"],ngClass:"ngClass"}})}return t})();var rn=class{$implicit;ngForOf;index;count;constructor(n,e,i,r){this.$implicit=n,this.ngForOf=e,this.index=i,this.count=r}get first(){return this.index===0}get last(){return this.index===this.count-1}get even(){return this.index%2===0}get odd(){return!this.even}},yr=(()=>{class t{_viewContainer;_template;_differs;set ngForOf(e){this._ngForOf=e,this._ngForOfDirty=!0}set ngForTrackBy(e){this._trackByFn=e}get ngForTrackBy(){return this._trackByFn}_ngForOf=null;_ngForOfDirty=!0;_differ=null;_trackByFn;constructor(e,i,r){this._viewContainer=e,this._template=i,this._differs=r}set ngForTemplate(e){e&&(this._template=e)}ngDoCheck(){if(this._ngForOfDirty){this._ngForOfDirty=!1;let e=this._ngForOf;!this._differ&&e&&(this._differ=this._differs.find(e).create(this.ngForTrackBy))}if(this._differ){let e=this._differ.diff(this._ngForOf);e&&this._applyChanges(e)}}_applyChanges(e){let i=this._viewContainer;e.forEachOperation((r,o,s)=>{if(r.previousIndex==null)i.createEmbeddedView(this._template,new rn(r.item,this._ngForOf,-1,-1),s===null?void 0:s);else if(s==null)i.remove(o===null?void 0:o);else if(o!==null){let a=i.get(o);i.move(a,s),dr(a,r)}});for(let r=0,o=i.length;r<o;r++){let a=i.get(r).context;a.index=r,a.count=o,a.ngForOf=this._ngForOf}e.forEachIdentityChange(r=>{let o=i.get(r.currentIndex);dr(o,r)})}static ngTemplateContextGuard(e,i){return!0}static \u0275fac=function(i){return new(i||t)(p(Yt),p(ct),p(tr))};static \u0275dir=_({type:t,selectors:[["","ngFor","","ngForOf",""]],inputs:{ngForOf:"ngForOf",ngForTrackBy:"ngForTrackBy",ngForTemplate:"ngForTemplate"}})}return t})();function dr(t,n){t.context.$implicit=n.item}var Zn=(()=>{class t{_viewContainer;_context=new on;_thenTemplateRef=null;_elseTemplateRef=null;_thenViewRef=null;_elseViewRef=null;constructor(e,i){this._viewContainer=e,this._thenTemplateRef=i}set ngIf(e){this._context.$implicit=this._context.ngIf=e,this._updateView()}set ngIfThen(e){hr(e,!1),this._thenTemplateRef=e,this._thenViewRef=null,this._updateView()}set ngIfElse(e){hr(e,!1),this._elseTemplateRef=e,this._elseViewRef=null,this._updateView()}_updateView(){this._context.$implicit?this._thenViewRef||(this._viewContainer.clear(),this._elseViewRef=null,this._thenTemplateRef&&(this._thenViewRef=this._viewContainer.createEmbeddedView(this._thenTemplateRef,this._context))):this._elseViewRef||(this._viewContainer.clear(),this._thenViewRef=null,this._elseTemplateRef&&(this._elseViewRef=this._viewContainer.createEmbeddedView(this._elseTemplateRef,this._context)))}static ngIfUseIfTypeGuard;static ngTemplateGuard_ngIf;static ngTemplateContextGuard(e,i){return!0}static \u0275fac=function(i){return new(i||t)(p(Yt),p(ct))};static \u0275dir=_({type:t,selectors:[["","ngIf",""]],inputs:{ngIf:"ngIf",ngIfThen:"ngIfThen",ngIfElse:"ngIfElse"}})}return t})(),on=class{$implicit=null;ngIf=null};function hr(t,n){if(t&&!t.createEmbeddedView)throw new U(2020,!1)}var Xn=(()=>{class t{_ngEl;_differs;_renderer;_ngStyle=null;_differ=null;constructor(e,i,r){this._ngEl=e,this._differs=i,this._renderer=r}set ngStyle(e){this._ngStyle=e,!this._differ&&e&&(this._differ=this._differs.find(e).create())}ngDoCheck(){if(this._differ){let e=this._differ.diff(this._ngStyle);e&&this._applyChanges(e)}}_setStyle(e,i){let[r,o]=e.split("."),s=r.indexOf("-")===-1?void 0:Zi.DashCase;i!=null?this._renderer.setStyle(this._ngEl.nativeElement,r,o?`${i}${o}`:i,s):this._renderer.removeStyle(this._ngEl.nativeElement,r,s)}_applyChanges(e){e.forEachRemovedItem(i=>this._setStyle(i.key,null)),e.forEachAddedItem(i=>this._setStyle(i.key,i.currentValue)),e.forEachChangedItem(i=>this._setStyle(i.key,i.currentValue))}static \u0275fac=function(i){return new(i||t)(p(G),p(nr),p(le))};static \u0275dir=_({type:t,selectors:[["","ngStyle",""]],inputs:{ngStyle:"ngStyle"}})}return t})(),Jn=(()=>{class t{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let i=this._viewContainerRef;if(this._viewRef&&i.remove(i.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let r=this._createContextForwardProxy();this._viewRef=i.createEmbeddedView(this.ngTemplateOutlet,r,{injector:this.ngTemplateOutletInjector??void 0})}}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,i,r)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,i,r):!1,get:(e,i,r)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,i,r)}})}static \u0275fac=function(i){return new(i||t)(p(Yt))};static \u0275dir=_({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[ee]})}return t})();function br(t,n){return new U(2100,!1)}var Ms=(()=>{class t{_locale;constructor(e){this._locale=e}transform(e,i,r){if(!vr(e))return null;r||=this._locale;try{let o=Dr(e);return gr(o,r,i)}catch(o){throw br(t,o.message)}}static \u0275fac=function(i){return new(i||t)(p(jn,16))};static \u0275pipe=$n({name:"number",type:t,pure:!0})}return t})(),Rs=(()=>{class t{_locale;constructor(e){this._locale=e}transform(e,i,r){if(!vr(e))return null;r||=this._locale;try{let o=Dr(e);return pr(o,r,i)}catch(o){throw br(t,o.message)}}static \u0275fac=function(i){return new(i||t)(p(jn,16))};static \u0275pipe=$n({name:"percent",type:t,pure:!0})}return t})();function vr(t){return!(t==null||t===""||t!==t)}function Dr(t){if(typeof t=="string"&&!isNaN(Number(t)-parseFloat(t)))return Number(t);if(typeof t!="number")throw new Error(`${t} is not a number`);return t}var Me=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();function Qn(t,n){n=encodeURIComponent(n);for(let e of t.split(";")){let i=e.indexOf("="),[r,o]=i==-1?[e,""]:[e.slice(0,i),e.slice(i+1)];if(r.trim()===n)return decodeURIComponent(o)}return null}var _r="browser",Cr="server";function vt(t){return t===_r}function ei(t){return t===Cr}var bt=class{};var Oc=(()=>{class t{static \u0275prov=v({token:t,providedIn:"root",factory:()=>new ti(m(j),window)})}return t})(),ti=class{document;window;offset=()=>[0,0];constructor(n,e){this.document=n,this.window=e}setOffset(n){Array.isArray(n)?this.offset=()=>n:this.offset=n}getScrollPosition(){return[this.window.scrollX,this.window.scrollY]}scrollToPosition(n){this.window.scrollTo(n[0],n[1])}scrollToAnchor(n){let e=Ns(this.document,n);e&&(this.scrollToElement(e),e.focus())}setHistoryScrollRestoration(n){this.window.history.scrollRestoration=n}scrollToElement(n){let e=n.getBoundingClientRect(),i=e.left+this.window.pageXOffset,r=e.top+this.window.pageYOffset,o=this.offset();this.window.scrollTo(i-o[0],r-o[1])}};function Ns(t,n){let e=t.getElementById(n)||t.getElementsByName(n)[0];if(e)return e;if(typeof t.createTreeWalker=="function"&&t.body&&typeof t.body.attachShadow=="function"){let i=t.createTreeWalker(t.body,NodeFilter.SHOW_ELEMENT),r=i.currentNode;for(;r;){let o=r.shadowRoot;if(o){let s=o.getElementById(n)||o.querySelector(`[name="${n}"]`);if(s)return s}r=i.nextNode()}}return null}function Er(t,n){return t?t.classList?t.classList.contains(n):new RegExp("(^| )"+n+"( |$)","gi").test(t.className):!1}function Dt(t,n){if(t&&n){let e=i=>{Er(t,i)||(t.classList?t.classList.add(i):t.className+=" "+i)};[n].flat().filter(Boolean).forEach(i=>i.split(" ").forEach(e))}}function Ps(){return window.innerWidth-document.documentElement.offsetWidth}function We(t){for(let n of document?.styleSheets)try{for(let e of n?.cssRules)for(let i of e?.style)if(t.test(i))return{name:i,value:e.style.getPropertyValue(i).trim()}}catch{}return null}function Pc(t="p-overflow-hidden"){let n=We(/-scrollbar-width$/);n?.name&&document.body.style.setProperty(n.name,Ps()+"px"),Dt(document.body,t)}function Ue(t,n){if(t&&n){let e=i=>{t.classList?t.classList.remove(i):t.className=t.className.replace(new RegExp("(^|\\b)"+i.split(" ").join("|")+"(\\b|$)","gi")," ")};[n].flat().filter(Boolean).forEach(i=>i.split(" ").forEach(e))}}function kc(t="p-overflow-hidden"){let n=We(/-scrollbar-width$/);n?.name&&document.body.style.removeProperty(n.name),Ue(document.body,t)}function wr(t){let n={width:0,height:0};return t&&(t.style.visibility="hidden",t.style.display="block",n.width=t.offsetWidth,n.height=t.offsetHeight,t.style.display="none",t.style.visibility="visible"),n}function Sr(){let t=window,n=document,e=n.documentElement,i=n.getElementsByTagName("body")[0],r=t.innerWidth||e.clientWidth||i.clientWidth,o=t.innerHeight||e.clientHeight||i.clientHeight;return{width:r,height:o}}function ks(){let t=document.documentElement;return(window.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}function $s(){let t=document.documentElement;return(window.pageYOffset||t.scrollTop)-(t.clientTop||0)}function $c(t,n,e=!0){var i,r,o,s;if(t){let a=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:wr(t),l=a.height,u=a.width,c=n.offsetHeight,d=n.offsetWidth,f=n.getBoundingClientRect(),h=$s(),y=ks(),g=Sr(),b,w,C="top";f.top+c+l>g.height?(b=f.top+h-l,C="bottom",b<0&&(b=h)):b=c+f.top+h,f.left+u>g.width?w=Math.max(0,f.left+y+d-u):w=f.left+y,t.style.top=b+"px",t.style.left=w+"px",t.style.transformOrigin=C,e&&(t.style.marginTop=C==="bottom"?`calc(${(r=(i=We(/-anchor-gutter$/))==null?void 0:i.value)!=null?r:"2px"} * -1)`:(s=(o=We(/-anchor-gutter$/))==null?void 0:o.value)!=null?s:"")}}function Vc(t,n){t&&(typeof n=="string"?t.style.cssText=n:Object.entries(n||{}).forEach(([e,i])=>t.style[e]=i))}function Ar(t,n){if(t instanceof HTMLElement){let e=t.offsetWidth;if(n){let i=getComputedStyle(t);e+=parseFloat(i.marginLeft)+parseFloat(i.marginRight)}return e}return 0}function Bc(t,n,e=!0){var i,r,o,s;if(t){let a=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:wr(t),l=n.offsetHeight,u=n.getBoundingClientRect(),c=Sr(),d,f,h="top";u.top+l+a.height>c.height?(d=-1*a.height,h="bottom",u.top+d<0&&(d=-1*u.top)):d=l,a.width>c.width?f=u.left*-1:u.left+a.width>c.width?f=(u.left+a.width-c.width)*-1:f=0,t.style.top=d+"px",t.style.left=f+"px",t.style.transformOrigin=h,e&&(t.style.marginTop=h==="bottom"?`calc(${(r=(i=We(/-anchor-gutter$/))==null?void 0:i.value)!=null?r:"2px"} * -1)`:(s=(o=We(/-anchor-gutter$/))==null?void 0:o.value)!=null?s:"")}}function Ke(t){return typeof HTMLElement=="object"?t instanceof HTMLElement:t&&typeof t=="object"&&t!==null&&t.nodeType===1&&typeof t.nodeName=="string"}function ni(t){let n=t;return t&&typeof t=="object"&&(t.hasOwnProperty("current")?n=t.current:t.hasOwnProperty("el")&&(t.el.hasOwnProperty("nativeElement")?n=t.el.nativeElement:n=t.el)),Ke(n)?n:void 0}function Uc(t,n){let e=ni(t);if(e)e.appendChild(n);else throw new Error("Cannot append "+n+" to "+t)}function an(t,n={}){if(Ke(t)){let e=(i,r)=>{var o,s;let a=(o=t?.$attrs)!=null&&o[i]?[(s=t?.$attrs)==null?void 0:s[i]]:[];return[r].flat().reduce((l,u)=>{if(u!=null){let c=typeof u;if(c==="string"||c==="number")l.push(u);else if(c==="object"){let d=Array.isArray(u)?e(i,u):Object.entries(u).map(([f,h])=>i==="style"&&(h||h===0)?`${f.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${h}`:h?f:void 0);l=d.length?l.concat(d.filter(f=>!!f)):l}}return l},a)};Object.entries(n).forEach(([i,r])=>{if(r!=null){let o=i.match(/^on(.+)/);o?t.addEventListener(o[1].toLowerCase(),r):i==="p-bind"||i==="pBind"?an(t,r):(r=i==="class"?[...new Set(e("class",r))].join(" ").trim():i==="style"?e("style",r).join(";").trim():r,(t.$attrs=t.$attrs||{})&&(t.$attrs[i]=r),t.setAttribute(i,r))}})}}function jc(t,n={},...e){if(t){let i=document.createElement(t);return an(i,n),i.append(...e),i}}function Hc(t,n){if(t){t.style.opacity="0";let e=+new Date,i="0",r=function(){i=`${+t.style.opacity+(new Date().getTime()-e)/n}`,t.style.opacity=i,e=+new Date,+i<1&&(window.requestAnimationFrame&&requestAnimationFrame(r)||setTimeout(r,16))};r()}}function Vs(t,n){return Ke(t)?Array.from(t.querySelectorAll(n)):[]}function Bs(t,n){return Ke(t)?t.matches(n)?t:t.querySelector(n):null}function zc(t,n){t&&document.activeElement!==t&&t.focus(n)}function Gc(t,n){if(Ke(t)){let e=t.getAttribute(n);return isNaN(e)?e==="true"||e==="false"?e==="true":e:+e}}function Fr(t,n=""){let e=Vs(t,`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n}`),i=[];for(let r of e)getComputedStyle(r).display!="none"&&getComputedStyle(r).visibility!="hidden"&&i.push(r);return i}function Wc(t,n){let e=Fr(t,n);return e.length>0?e[0]:null}function ii(t){if(t){let n=t.offsetHeight,e=getComputedStyle(t);return n-=parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)+parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),n}return 0}function Tr(t){if(t){let n=t.parentNode;return n&&n instanceof ShadowRoot&&n.host&&(n=n.host),n}return null}function Kc(t){var n;if(t){let e=(n=Tr(t))==null?void 0:n.childNodes,i=0;if(e)for(let r=0;r<e.length;r++){if(e[r]===t)return i;e[r].nodeType===1&&i++}}return-1}function qc(t,n){let e=Fr(t,n);return e.length>0?e[e.length-1]:null}function Ir(t){if(t){let n=t.getBoundingClientRect();return{top:n.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:n.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}return{top:"auto",left:"auto"}}function ri(t,n){if(t){let e=t.offsetHeight;if(n){let i=getComputedStyle(t);e+=parseFloat(i.marginTop)+parseFloat(i.marginBottom)}return e}return 0}function Yc(){if(window.getSelection)return window.getSelection().toString();if(document.getSelection)return document.getSelection().toString()}function Us(t){return!!(t!==null&&typeof t<"u"&&t.nodeName&&Tr(t))}function Zc(t,n){var e;if(t)switch(t){case"document":return document;case"window":return window;case"body":return document.body;case"@next":return n?.nextElementSibling;case"@prev":return n?.previousElementSibling;case"@parent":return n?.parentElement;case"@grandparent":return(e=n?.parentElement)==null?void 0:e.parentElement;default:if(typeof t=="string")return document.querySelector(t);let r=ni((o=>!!(o&&o.constructor&&o.call&&o.apply))(t)?t():t);return r?.nodeType===9||Us(r)?r:void 0}}function oi(t){if(t){let n=t.offsetWidth,e=getComputedStyle(t);return n-=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight)+parseFloat(e.borderLeftWidth)+parseFloat(e.borderRightWidth),n}return 0}function js(t){return!!(t&&t.offsetParent!=null)}function Xc(t){return!js(t)}function Jc(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}function Qc(t){return t?getComputedStyle(t).direction==="rtl":!1}function ed(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0}function Or(t){var n;t&&("remove"in Element.prototype?t.remove():(n=t.parentNode)==null||n.removeChild(t))}function td(t,n){let e=ni(t);if(e)e.removeChild(n);else throw new Error("Cannot remove "+n+" from "+t)}function nd(t,n){let e=getComputedStyle(t).getPropertyValue("borderTopWidth"),i=e?parseFloat(e):0,r=getComputedStyle(t).getPropertyValue("paddingTop"),o=r?parseFloat(r):0,s=t.getBoundingClientRect(),l=n.getBoundingClientRect().top+document.body.scrollTop-(s.top+document.body.scrollTop)-i-o,u=t.scrollTop,c=t.clientHeight,d=ri(n);l<0?t.scrollTop=u+l:l+d>c&&(t.scrollTop=u+l-c+d)}function id(t,n="",e){Ke(t)&&e!==null&&e!==void 0&&t.setAttribute(n,e)}function Mr(){let t=new Map;return{on(n,e){let i=t.get(n);return i?i.push(e):i=[e],t.set(n,i),this},off(n,e){let i=t.get(n);return i&&i.splice(i.indexOf(e)>>>0,1),this},emit(n,e){let i=t.get(n);i&&i.slice().map(r=>{r(e)})},clear(){t.clear()}}}function z(t){return t==null||t===""||Array.isArray(t)&&t.length===0||!(t instanceof Date)&&typeof t=="object"&&Object.keys(t).length===0}function si(t,n,e=new WeakSet){if(t===n)return!0;if(!t||!n||typeof t!="object"||typeof n!="object"||e.has(t)||e.has(n))return!1;e.add(t).add(n);let i=Array.isArray(t),r=Array.isArray(n),o,s,a;if(i&&r){if(s=t.length,s!=n.length)return!1;for(o=s;o--!==0;)if(!si(t[o],n[o],e))return!1;return!0}if(i!=r)return!1;let l=t instanceof Date,u=n instanceof Date;if(l!=u)return!1;if(l&&u)return t.getTime()==n.getTime();let c=t instanceof RegExp,d=n instanceof RegExp;if(c!=d)return!1;if(c&&d)return t.toString()==n.toString();let f=Object.keys(t);if(s=f.length,s!==Object.keys(n).length)return!1;for(o=s;o--!==0;)if(!Object.prototype.hasOwnProperty.call(n,f[o]))return!1;for(o=s;o--!==0;)if(a=f[o],!si(t[a],n[a],e))return!1;return!0}function Hs(t,n){return si(t,n)}function xr(t){return!!(t&&t.constructor&&t.call&&t.apply)}function T(t){return!z(t)}function ln(t,n){if(!t||!n)return null;try{let e=t[n];if(T(e))return e}catch{}if(Object.keys(t).length){if(xr(n))return n(t);if(n.indexOf(".")===-1)return t[n];{let e=n.split("."),i=t;for(let r=0,o=e.length;r<o;++r){if(i==null)return null;i=i[e[r]]}return i}}return null}function ai(t,n,e){return e?ln(t,e)===ln(n,e):Hs(t,n)}function ad(t,n){if(t!=null&&n&&n.length){for(let e of n)if(ai(t,e))return!0}return!1}function ld(t,n){let e=-1;if(T(t))try{e=t.findLastIndex(n)}catch{e=t.lastIndexOf([...t].reverse().find(n))}return e}function ye(t,n=!0){return t instanceof Object&&t.constructor===Object&&(n||Object.keys(t).length!==0)}function ie(t,...n){return xr(t)?t(...n):t}function Re(t,n=!0){return typeof t=="string"&&(n||t!=="")}function Rr(t){return Re(t)?t.replace(/(-|_)/g,"").toLowerCase():t}function un(t,n="",e={}){let i=Rr(n).split("."),r=i.shift();return r?ye(t)?un(ie(t[Object.keys(t).find(o=>Rr(o)===r)||""],e),i.join("."),e):void 0:ie(t,e)}function cn(t,n=!0){return Array.isArray(t)&&(n||t.length!==0)}function ud(t){return t instanceof Date&&t.constructor===Date}function Nr(t){return T(t)&&!isNaN(t)}function cd(t=""){return T(t)&&t.length===1&&!!t.match(/\S| /)}function K(t,n){if(n){let e=n.test(t);return n.lastIndex=0,e}return!1}function je(t){return t&&t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":")}function q(t){if(t&&/[\xC0-\xFF\u0100-\u017E]/.test(t)){let e={A:/[\xC0-\xC5\u0100\u0102\u0104]/g,AE:/[\xC6]/g,C:/[\xC7\u0106\u0108\u010A\u010C]/g,D:/[\xD0\u010E\u0110]/g,E:/[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g,G:/[\u011C\u011E\u0120\u0122]/g,H:/[\u0124\u0126]/g,I:/[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g,IJ:/[\u0132]/g,J:/[\u0134]/g,K:/[\u0136]/g,L:/[\u0139\u013B\u013D\u013F\u0141]/g,N:/[\xD1\u0143\u0145\u0147\u014A]/g,O:/[\xD2-\xD6\xD8\u014C\u014E\u0150]/g,OE:/[\u0152]/g,R:/[\u0154\u0156\u0158]/g,S:/[\u015A\u015C\u015E\u0160]/g,T:/[\u0162\u0164\u0166]/g,U:/[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g,W:/[\u0174]/g,Y:/[\xDD\u0176\u0178]/g,Z:/[\u0179\u017B\u017D]/g,a:/[\xE0-\xE5\u0101\u0103\u0105]/g,ae:/[\xE6]/g,c:/[\xE7\u0107\u0109\u010B\u010D]/g,d:/[\u010F\u0111]/g,e:/[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g,g:/[\u011D\u011F\u0121\u0123]/g,i:/[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g,ij:/[\u0133]/g,j:/[\u0135]/g,k:/[\u0137,\u0138]/g,l:/[\u013A\u013C\u013E\u0140\u0142]/g,n:/[\xF1\u0144\u0146\u0148\u014B]/g,p:/[\xFE]/g,o:/[\xF2-\xF6\xF8\u014D\u014F\u0151]/g,oe:/[\u0153]/g,r:/[\u0155\u0157\u0159]/g,s:/[\u015B\u015D\u015F\u0161]/g,t:/[\u0163\u0165\u0167]/g,u:/[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g,w:/[\u0175]/g,y:/[\xFD\xFF\u0177]/g,z:/[\u017A\u017C\u017E]/g};for(let i in e)t=t.replace(e[i],i)}return t}function dn(t){return Re(t)?t.replace(/(_)/g,"-").replace(/[A-Z]/g,(n,e)=>e===0?n:"-"+n.toLowerCase()).toLowerCase():t}function li(t){return Re(t)?t.replace(/[A-Z]/g,(n,e)=>e===0?n:"."+n.toLowerCase()).toLowerCase():t}var hn={};function _t(t="pui_id_"){return hn.hasOwnProperty(t)||(hn[t]=0),hn[t]++,`${t}${hn[t]}`}function zs(){let t=[],n=(s,a,l=999)=>{let u=r(s,a,l),c=u.value+(u.key===s?0:l)+1;return t.push({key:s,value:c}),c},e=s=>{t=t.filter(a=>a.value!==s)},i=(s,a)=>r(s,a).value,r=(s,a,l=0)=>[...t].reverse().find(u=>a?!0:u.key===s)||{key:s,value:l},o=s=>s&&parseInt(s.style.zIndex,10)||0;return{get:o,set:(s,a,l)=>{a&&(a.style.zIndex=String(n(s,!0,l)))},clear:s=>{s&&(e(o(s)),s.style.zIndex="")},getCurrent:s=>i(s,!0)}}var fd=zs();var Lr=["*"];var $=(()=>{class t{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static IN="in";static LESS_THAN="lt";static LESS_THAN_OR_EQUAL_TO="lte";static GREATER_THAN="gt";static GREATER_THAN_OR_EQUAL_TO="gte";static BETWEEN="between";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static DATE_IS="dateIs";static DATE_IS_NOT="dateIsNot";static DATE_BEFORE="dateBefore";static DATE_AFTER="dateAfter"}return t})(),Ad=(()=>{class t{static AND="and";static OR="or"}return t})(),Fd=(()=>{class t{filter(e,i,r,o,s){let a=[];if(e)for(let l of e)for(let u of i){let c=ln(l,u);if(this.filters[o](c,r,s)){a.push(l);break}}return a}filters={startsWith:(e,i,r)=>{if(i==null||i.trim()==="")return!0;if(e==null)return!1;let o=q(i.toString()).toLocaleLowerCase(r);return q(e.toString()).toLocaleLowerCase(r).slice(0,o.length)===o},contains:(e,i,r)=>{if(i==null||typeof i=="string"&&i.trim()==="")return!0;if(e==null)return!1;let o=q(i.toString()).toLocaleLowerCase(r);return q(e.toString()).toLocaleLowerCase(r).indexOf(o)!==-1},notContains:(e,i,r)=>{if(i==null||typeof i=="string"&&i.trim()==="")return!0;if(e==null)return!1;let o=q(i.toString()).toLocaleLowerCase(r);return q(e.toString()).toLocaleLowerCase(r).indexOf(o)===-1},endsWith:(e,i,r)=>{if(i==null||i.trim()==="")return!0;if(e==null)return!1;let o=q(i.toString()).toLocaleLowerCase(r),s=q(e.toString()).toLocaleLowerCase(r);return s.indexOf(o,s.length-o.length)!==-1},equals:(e,i,r)=>i==null||typeof i=="string"&&i.trim()===""?!0:e==null?!1:e.getTime&&i.getTime?e.getTime()===i.getTime():e==i?!0:q(e.toString()).toLocaleLowerCase(r)==q(i.toString()).toLocaleLowerCase(r),notEquals:(e,i,r)=>i==null||typeof i=="string"&&i.trim()===""?!1:e==null?!0:e.getTime&&i.getTime?e.getTime()!==i.getTime():e==i?!1:q(e.toString()).toLocaleLowerCase(r)!=q(i.toString()).toLocaleLowerCase(r),in:(e,i)=>{if(i==null||i.length===0)return!0;for(let r=0;r<i.length;r++)if(ai(e,i[r]))return!0;return!1},between:(e,i)=>i==null||i[0]==null||i[1]==null?!0:e==null?!1:e.getTime?i[0].getTime()<=e.getTime()&&e.getTime()<=i[1].getTime():i[0]<=e&&e<=i[1],lt:(e,i,r)=>i==null?!0:e==null?!1:e.getTime&&i.getTime?e.getTime()<i.getTime():e<i,lte:(e,i,r)=>i==null?!0:e==null?!1:e.getTime&&i.getTime?e.getTime()<=i.getTime():e<=i,gt:(e,i,r)=>i==null?!0:e==null?!1:e.getTime&&i.getTime?e.getTime()>i.getTime():e>i,gte:(e,i,r)=>i==null?!0:e==null?!1:e.getTime&&i.getTime?e.getTime()>=i.getTime():e>=i,is:(e,i,r)=>this.filters.equals(e,i,r),isNot:(e,i,r)=>this.filters.notEquals(e,i,r),before:(e,i,r)=>this.filters.lt(e,i,r),after:(e,i,r)=>this.filters.gt(e,i,r),dateIs:(e,i)=>i==null?!0:e==null?!1:e.toDateString()===i.toDateString(),dateIsNot:(e,i)=>i==null?!0:e==null?!1:e.toDateString()!==i.toDateString(),dateBefore:(e,i)=>i==null?!0:e==null?!1:e.getTime()<i.getTime(),dateAfter:(e,i)=>i==null?!0:e==null?!1:(e.setHours(0,0,0,0),e.getTime()>i.getTime())};register(e,i){this.filters[e]=i}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Td=(()=>{class t{clickSource=new we;clickObservable=this.clickSource.asObservable();add(e){e&&this.clickSource.next(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Id=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=W({type:t,selectors:[["p-header"]],standalone:!1,ngContentSelectors:Lr,decls:1,vars:0,template:function(i,r){i&1&&($e(),Ve(0))},encapsulation:2})}return t})(),Od=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=W({type:t,selectors:[["p-footer"]],standalone:!1,ngContentSelectors:Lr,decls:1,vars:0,template:function(i,r){i&1&&($e(),Ve(0))},encapsulation:2})}return t})(),Pr=(()=>{class t{template;type;name;constructor(e){this.template=e}getType(){return this.name}static \u0275fac=function(i){return new(i||t)(p(ct))};static \u0275dir=_({type:t,selectors:[["","pTemplate",""]],inputs:{type:"type",name:[0,"pTemplate","name"]}})}return t})(),xe=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[Me]})}return t})(),Md=(()=>{class t{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static NO_FILTER="noFilter";static LT="lt";static LTE="lte";static GT="gt";static GTE="gte";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static CLEAR="clear";static APPLY="apply";static MATCH_ALL="matchAll";static MATCH_ANY="matchAny";static ADD_RULE="addRule";static REMOVE_RULE="removeRule";static ACCEPT="accept";static REJECT="reject";static CHOOSE="choose";static UPLOAD="upload";static CANCEL="cancel";static PENDING="pending";static FILE_SIZE_TYPES="fileSizeTypes";static DAY_NAMES="dayNames";static DAY_NAMES_SHORT="dayNamesShort";static DAY_NAMES_MIN="dayNamesMin";static MONTH_NAMES="monthNames";static MONTH_NAMES_SHORT="monthNamesShort";static FIRST_DAY_OF_WEEK="firstDayOfWeek";static TODAY="today";static WEEK_HEADER="weekHeader";static WEAK="weak";static MEDIUM="medium";static STRONG="strong";static PASSWORD_PROMPT="passwordPrompt";static EMPTY_MESSAGE="emptyMessage";static EMPTY_FILTER_MESSAGE="emptyFilterMessage";static SHOW_FILTER_MENU="showFilterMenu";static HIDE_FILTER_MENU="hideFilterMenu";static SELECTION_MESSAGE="selectionMessage";static ARIA="aria";static SELECT_COLOR="selectColor";static BROWSE_FILES="browseFiles"}return t})();var Gs=Object.defineProperty,Ws=Object.defineProperties,Ks=Object.getOwnPropertyDescriptors,fn=Object.getOwnPropertySymbols,Vr=Object.prototype.hasOwnProperty,Br=Object.prototype.propertyIsEnumerable,kr=(t,n,e)=>n in t?Gs(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,fe=(t,n)=>{for(var e in n||(n={}))Vr.call(n,e)&&kr(t,e,n[e]);if(fn)for(var e of fn(n))Br.call(n,e)&&kr(t,e,n[e]);return t},ui=(t,n)=>Ws(t,Ks(n)),be=(t,n)=>{var e={};for(var i in t)Vr.call(t,i)&&n.indexOf(i)<0&&(e[i]=t[i]);if(t!=null&&fn)for(var i of fn(t))n.indexOf(i)<0&&Br.call(t,i)&&(e[i]=t[i]);return e};var qs=Mr(),Y=qs;function $r(t,n){cn(t)?t.push(...n||[]):ye(t)&&Object.assign(t,n)}function Ys(t){return ye(t)&&t.hasOwnProperty("value")&&t.hasOwnProperty("type")?t.value:t}function Zs(t){return t.replaceAll(/ /g,"").replace(/[^\w]/g,"-")}function ci(t="",n=""){return Zs(`${Re(t,!1)&&Re(n,!1)?`${t}-`:t}${n}`)}function Ur(t="",n=""){return`--${ci(t,n)}`}function Xs(t=""){let n=(t.match(/{/g)||[]).length,e=(t.match(/}/g)||[]).length;return(n+e)%2!==0}function jr(t,n="",e="",i=[],r){if(Re(t)){let o=/{([^}]*)}/g,s=t.trim();if(Xs(s))return;if(K(s,o)){let a=s.replaceAll(o,c=>{let f=c.replace(/{|}/g,"").split(".").filter(h=>!i.some(y=>K(h,y)));return`var(${Ur(e,dn(f.join("-")))}${T(r)?`, ${r}`:""})`}),l=/(\d+\s+[\+\-\*\/]\s+\d+)/g,u=/var\([^)]+\)/g;return K(a.replace(u,"0"),l)?`calc(${a})`:a}return s}else if(Nr(t))return t}function Js(t,n,e){Re(n,!1)&&t.push(`${n}:${e};`)}function qe(t,n){return t?`${t}{${n}}`:""}var Bd=t=>{var n;let e=F.getTheme(),i=di(e,t,void 0,"variable"),r=(n=i?.match(/--[\w-]+/g))==null?void 0:n[0],o=di(e,t,void 0,"value");return{name:r,variable:i,value:o}},Ye=(...t)=>di(F.getTheme(),...t),di=(t={},n,e,i)=>{if(n){let{variable:r,options:o}=F.defaults||{},{prefix:s,transform:a}=t?.options||o||{},u=K(n,/{([^}]*)}/g)?n:`{${n}}`;return i==="value"||z(i)&&a==="strict"?F.getTokenValue(n):jr(u,void 0,s,[r.excludedKeyRegex],e)}return""};function Qs(t,n={}){let e=F.defaults.variable,{prefix:i=e.prefix,selector:r=e.selector,excludedKeyRegex:o=e.excludedKeyRegex}=n,s=(u,c="")=>Object.entries(u).reduce((d,[f,h])=>{let y=K(f,o)?ci(c):ci(c,dn(f)),g=Ys(h);if(ye(g)){let{variables:b,tokens:w}=s(g,y);$r(d.tokens,w),$r(d.variables,b)}else d.tokens.push((i?y.replace(`${i}-`,""):y).replaceAll("-",".")),Js(d.variables,Ur(y),jr(g,y,i,[o]));return d},{variables:[],tokens:[]}),{variables:a,tokens:l}=s(t,i);return{value:a,tokens:l,declarations:a.join(""),css:qe(r,a.join(""))}}var he={regex:{rules:{class:{pattern:/^\.([a-zA-Z][\w-]*)$/,resolve(t){return{type:"class",selector:t,matched:this.pattern.test(t.trim())}}},attr:{pattern:/^\[(.*)\]$/,resolve(t){return{type:"attr",selector:`:root${t}`,matched:this.pattern.test(t.trim())}}},media:{pattern:/^@media (.*)$/,resolve(t){return{type:"media",selector:`${t}{:root{[CSS]}}`,matched:this.pattern.test(t.trim())}}},system:{pattern:/^system$/,resolve(t){return{type:"system",selector:"@media (prefers-color-scheme: dark){:root{[CSS]}}",matched:this.pattern.test(t.trim())}}},custom:{resolve(t){return{type:"custom",selector:t,matched:!0}}}},resolve(t){let n=Object.keys(this.rules).filter(e=>e!=="custom").map(e=>this.rules[e]);return[t].flat().map(e=>{var i;return(i=n.map(r=>r.resolve(e)).find(r=>r.matched))!=null?i:this.rules.custom.resolve(e)})}},_toVariables(t,n){return Qs(t,{prefix:n?.prefix})},getCommon({name:t="",theme:n={},params:e,set:i,defaults:r}){var o,s,a,l,u,c,d;let{preset:f,options:h}=n,y,g,b,w,C,S,O;if(T(f)&&h.transform!=="strict"){let{primitive:se,semantic:J,extend:Ce}=f,Ee=J||{},{colorScheme:Mt}=Ee,Rt=be(Ee,["colorScheme"]),xt=Ce||{},{colorScheme:Nt}=xt,lt=be(xt,["colorScheme"]),ut=Mt||{},{dark:Lt}=ut,Pt=be(ut,["dark"]),kt=Nt||{},{dark:$t}=kt,Vt=be(kt,["dark"]),Bt=T(se)?this._toVariables({primitive:se},h):{},Ut=T(Rt)?this._toVariables({semantic:Rt},h):{},jt=T(Pt)?this._toVariables({light:Pt},h):{},ki=T(Lt)?this._toVariables({dark:Lt},h):{},$i=T(lt)?this._toVariables({semantic:lt},h):{},Vi=T(Vt)?this._toVariables({light:Vt},h):{},Bi=T($t)?this._toVariables({dark:$t},h):{},[es,ts]=[(o=Bt.declarations)!=null?o:"",Bt.tokens],[ns,is]=[(s=Ut.declarations)!=null?s:"",Ut.tokens||[]],[rs,os]=[(a=jt.declarations)!=null?a:"",jt.tokens||[]],[ss,as]=[(l=ki.declarations)!=null?l:"",ki.tokens||[]],[ls,us]=[(u=$i.declarations)!=null?u:"",$i.tokens||[]],[cs,ds]=[(c=Vi.declarations)!=null?c:"",Vi.tokens||[]],[hs,fs]=[(d=Bi.declarations)!=null?d:"",Bi.tokens||[]];y=this.transformCSS(t,es,"light","variable",h,i,r),g=ts;let ps=this.transformCSS(t,`${ns}${rs}`,"light","variable",h,i,r),gs=this.transformCSS(t,`${ss}`,"dark","variable",h,i,r);b=`${ps}${gs}`,w=[...new Set([...is,...os,...as])];let ms=this.transformCSS(t,`${ls}${cs}color-scheme:light`,"light","variable",h,i,r),ys=this.transformCSS(t,`${hs}color-scheme:dark`,"dark","variable",h,i,r);C=`${ms}${ys}`,S=[...new Set([...us,...ds,...fs])],O=ie(f.css,{dt:Ye})}return{primitive:{css:y,tokens:g},semantic:{css:b,tokens:w},global:{css:C,tokens:S},style:O}},getPreset({name:t="",preset:n={},options:e,params:i,set:r,defaults:o,selector:s}){var a,l,u;let c,d,f;if(T(n)&&e.transform!=="strict"){let h=t.replace("-directive",""),y=n,{colorScheme:g,extend:b,css:w}=y,C=be(y,["colorScheme","extend","css"]),S=b||{},{colorScheme:O}=S,se=be(S,["colorScheme"]),J=g||{},{dark:Ce}=J,Ee=be(J,["dark"]),Mt=O||{},{dark:Rt}=Mt,xt=be(Mt,["dark"]),Nt=T(C)?this._toVariables({[h]:fe(fe({},C),se)},e):{},lt=T(Ee)?this._toVariables({[h]:fe(fe({},Ee),xt)},e):{},ut=T(Ce)?this._toVariables({[h]:fe(fe({},Ce),Rt)},e):{},[Lt,Pt]=[(a=Nt.declarations)!=null?a:"",Nt.tokens||[]],[kt,$t]=[(l=lt.declarations)!=null?l:"",lt.tokens||[]],[Vt,Bt]=[(u=ut.declarations)!=null?u:"",ut.tokens||[]],Ut=this.transformCSS(h,`${Lt}${kt}`,"light","variable",e,r,o,s),jt=this.transformCSS(h,Vt,"dark","variable",e,r,o,s);c=`${Ut}${jt}`,d=[...new Set([...Pt,...$t,...Bt])],f=ie(w,{dt:Ye})}return{css:c,tokens:d,style:f}},getPresetC({name:t="",theme:n={},params:e,set:i,defaults:r}){var o;let{preset:s,options:a}=n,l=(o=s?.components)==null?void 0:o[t];return this.getPreset({name:t,preset:l,options:a,params:e,set:i,defaults:r})},getPresetD({name:t="",theme:n={},params:e,set:i,defaults:r}){var o;let s=t.replace("-directive",""),{preset:a,options:l}=n,u=(o=a?.directives)==null?void 0:o[s];return this.getPreset({name:s,preset:u,options:l,params:e,set:i,defaults:r})},applyDarkColorScheme(t){return!(t.darkModeSelector==="none"||t.darkModeSelector===!1)},getColorSchemeOption(t,n){var e;return this.applyDarkColorScheme(t)?this.regex.resolve(t.darkModeSelector===!0?n.options.darkModeSelector:(e=t.darkModeSelector)!=null?e:n.options.darkModeSelector):[]},getLayerOrder(t,n={},e,i){let{cssLayer:r}=n;return r?`@layer ${ie(r.order||"primeui",e)}`:""},getCommonStyleSheet({name:t="",theme:n={},params:e,props:i={},set:r,defaults:o}){let s=this.getCommon({name:t,theme:n,params:e,set:r,defaults:o}),a=Object.entries(i).reduce((l,[u,c])=>l.push(`${u}="${c}"`)&&l,[]).join(" ");return Object.entries(s||{}).reduce((l,[u,c])=>{if(c?.css){let d=je(c?.css),f=`${u}-variables`;l.push(`<style type="text/css" data-primevue-style-id="${f}" ${a}>${d}</style>`)}return l},[]).join("")},getStyleSheet({name:t="",theme:n={},params:e,props:i={},set:r,defaults:o}){var s;let a={name:t,theme:n,params:e,set:r,defaults:o},l=(s=t.includes("-directive")?this.getPresetD(a):this.getPresetC(a))==null?void 0:s.css,u=Object.entries(i).reduce((c,[d,f])=>c.push(`${d}="${f}"`)&&c,[]).join(" ");return l?`<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${je(l)}</style>`:""},createTokens(t={},n,e="",i="",r={}){return Object.entries(t).forEach(([o,s])=>{let a=K(o,n.variable.excludedKeyRegex)?e:e?`${e}.${li(o)}`:li(o),l=i?`${i}.${o}`:o;ye(s)?this.createTokens(s,n,a,l,r):(r[a]||(r[a]={paths:[],computed(u,c={}){var d,f;return this.paths.length===1?(d=this.paths[0])==null?void 0:d.computed(this.paths[0].scheme,c.binding):u&&u!=="none"?(f=this.paths.find(h=>h.scheme===u))==null?void 0:f.computed(u,c.binding):this.paths.map(h=>h.computed(h.scheme,c[h.scheme]))}}),r[a].paths.push({path:l,value:s,scheme:l.includes("colorScheme.light")?"light":l.includes("colorScheme.dark")?"dark":"none",computed(u,c={}){let d=/{([^}]*)}/g,f=s;if(c.name=this.path,c.binding||(c.binding={}),K(s,d)){let y=s.trim().replaceAll(d,w=>{var C;let S=w.replace(/{|}/g,""),O=(C=r[S])==null?void 0:C.computed(u,c);return cn(O)&&O.length===2?`light-dark(${O[0].value},${O[1].value})`:O?.value}),g=/(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g,b=/var\([^)]+\)/g;f=K(y.replace(b,"0"),g)?`calc(${y})`:y}return z(c.binding)&&delete c.binding,{colorScheme:u,path:this.path,paths:c,value:f.includes("undefined")?void 0:f}}}))}),r},getTokenValue(t,n,e){var i;let o=(l=>l.split(".").filter(c=>!K(c.toLowerCase(),e.variable.excludedKeyRegex)).join("."))(n),s=n.includes("colorScheme.light")?"light":n.includes("colorScheme.dark")?"dark":void 0,a=[(i=t[o])==null?void 0:i.computed(s)].flat().filter(l=>l);return a.length===1?a[0].value:a.reduce((l={},u)=>{let c=u,{colorScheme:d}=c,f=be(c,["colorScheme"]);return l[d]=f,l},void 0)},getSelectorRule(t,n,e,i){return e==="class"||e==="attr"?qe(T(n)?`${t}${n},${t} ${n}`:t,i):qe(t,T(n)?qe(n,i):i)},transformCSS(t,n,e,i,r={},o,s,a){if(T(n)){let{cssLayer:l}=r;if(i!=="style"){let u=this.getColorSchemeOption(r,s);n=e==="dark"?u.reduce((c,{type:d,selector:f})=>(T(f)&&(c+=f.includes("[CSS]")?f.replace("[CSS]",n):this.getSelectorRule(f,a,d,n)),c),""):qe(a??":root",n)}if(l){let u={name:"primeui",order:"primeui"};ye(l)&&(u.name=ie(l.name,{name:t,type:i})),T(u.name)&&(n=qe(`@layer ${u.name}`,n),o?.layerNames(u.name))}return n}return""}},F={defaults:{variable:{prefix:"p",selector:":root",excludedKeyRegex:/^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi},options:{prefix:"p",darkModeSelector:"system",cssLayer:!1}},_theme:void 0,_layerNames:new Set,_loadedStyleNames:new Set,_loadingStyles:new Set,_tokens:{},update(t={}){let{theme:n}=t;n&&(this._theme=ui(fe({},n),{options:fe(fe({},this.defaults.options),n.options)}),this._tokens=he.createTokens(this.preset,this.defaults),this.clearLoadedStyleNames())},get theme(){return this._theme},get preset(){var t;return((t=this.theme)==null?void 0:t.preset)||{}},get options(){var t;return((t=this.theme)==null?void 0:t.options)||{}},get tokens(){return this._tokens},getTheme(){return this.theme},setTheme(t){this.update({theme:t}),Y.emit("theme:change",t)},getPreset(){return this.preset},setPreset(t){this._theme=ui(fe({},this.theme),{preset:t}),this._tokens=he.createTokens(t,this.defaults),this.clearLoadedStyleNames(),Y.emit("preset:change",t),Y.emit("theme:change",this.theme)},getOptions(){return this.options},setOptions(t){this._theme=ui(fe({},this.theme),{options:t}),this.clearLoadedStyleNames(),Y.emit("options:change",t),Y.emit("theme:change",this.theme)},getLayerNames(){return[...this._layerNames]},setLayerNames(t){this._layerNames.add(t)},getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(t){return this._loadedStyleNames.has(t)},setLoadedStyleName(t){this._loadedStyleNames.add(t)},deleteLoadedStyleName(t){this._loadedStyleNames.delete(t)},clearLoadedStyleNames(){this._loadedStyleNames.clear()},getTokenValue(t){return he.getTokenValue(this.tokens,t,this.defaults)},getCommon(t="",n){return he.getCommon({name:t,theme:this.theme,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getComponent(t="",n){let e={name:t,theme:this.theme,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return he.getPresetC(e)},getDirective(t="",n){let e={name:t,theme:this.theme,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return he.getPresetD(e)},getCustomPreset(t="",n,e,i){let r={name:t,preset:n,options:this.options,selector:e,params:i,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return he.getPreset(r)},getLayerOrderCSS(t=""){return he.getLayerOrder(t,this.options,{names:this.getLayerNames()},this.defaults)},transformCSS(t="",n,e="style",i){return he.transformCSS(t,n,i,e,this.options,{layerNames:this.setLayerNames.bind(this)},this.defaults)},getCommonStyleSheet(t="",n,e={}){return he.getCommonStyleSheet({name:t,theme:this.theme,params:n,props:e,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getStyleSheet(t,n,e={}){return he.getStyleSheet({name:t,theme:this.theme,params:n,props:e,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},onStyleMounted(t){this._loadingStyles.add(t)},onStyleUpdated(t){this._loadingStyles.add(t)},onStyleLoaded(t,{name:n}){this._loadingStyles.size&&(this._loadingStyles.delete(n),Y.emit(`theme:${n}:load`,t),!this._loadingStyles.size&&Y.emit("theme:load"))}};var ea=0,Hr=(()=>{class t{document=m(j);use(e,i={}){let r=!1,o=e,s=null,{immediate:a=!0,manual:l=!1,name:u=`style_${++ea}`,id:c=void 0,media:d=void 0,nonce:f=void 0,first:h=!1,props:y={}}=i;if(this.document){if(s=this.document.querySelector(`style[data-primeng-style-id="${u}"]`)||c&&this.document.getElementById(c)||this.document.createElement("style"),!s.isConnected){o=e;let g=this.document.head;h&&g.firstChild?g.insertBefore(s,g.firstChild):g.appendChild(s),an(s,{type:"text/css",media:d,nonce:f,"data-primeng-style-id":u})}return s.textContent!==o&&(s.textContent=o),{id:c,name:u,el:s,css:o}}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Ze={_loadedStyleNames:new Set,getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(t){return this._loadedStyleNames.has(t)},setLoadedStyleName(t){this._loadedStyleNames.add(t)},deleteLoadedStyleName(t){this._loadedStyleNames.delete(t)},clearLoadedStyleNames(){this._loadedStyleNames.clear()}},ta=({dt:t})=>`
*,
::before,
::after {
    box-sizing: border-box;
}

/* Non ng overlay animations */
.p-connected-overlay {
    opacity: 0;
    transform: scaleY(0.8);
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-visible {
    opacity: 1;
    transform: scaleY(1);
}

.p-connected-overlay-hidden {
    opacity: 0;
    transform: scaleY(1);
    transition: opacity 0.1s linear;
}

/* NG based overlay animations */
.p-connected-overlay-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-connected-overlay-leave-to {
    opacity: 0;
}

.p-connected-overlay-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-leave-active {
    transition: opacity 0.1s linear;
}

/* Toggleable Content */
.p-toggleable-content-enter-from,
.p-toggleable-content-leave-to {
    max-height: 0;
}

.p-toggleable-content-enter-to,
.p-toggleable-content-leave-from {
    max-height: 1000px;
}

.p-toggleable-content-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.p-toggleable-content-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}

.p-disabled,
.p-disabled * {
    cursor: default;
    pointer-events: none;
    user-select: none;
}

.p-disabled,
.p-component:disabled {
    opacity: ${t("disabled.opacity")};
}

.pi {
    font-size: ${t("icon.size")};
}

.p-icon {
    width: ${t("icon.size")};
    height: ${t("icon.size")};
}

.p-unselectable-text {
    user-select: none;
}

.p-overlay-mask {
    background: ${t("mask.background")};
    color: ${t("mask.color")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-mask-enter {
    animation: p-overlay-mask-enter-animation ${t("mask.transition.duration")} forwards;
}

.p-overlay-mask-leave {
    animation: p-overlay-mask-leave-animation ${t("mask.transition.duration")} forwards;
}
/* Temporarily disabled, distrupts PrimeNG overlay animations */
/* @keyframes p-overlay-mask-enter-animation {
    from {
        background: transparent;
    }
    to {
        background: ${t("mask.background")};
    }
}
@keyframes p-overlay-mask-leave-animation {
    from {
        background: ${t("mask.background")};
    }
    to {
        background: transparent;
    }
}*/

.p-iconwrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
`,na=({dt:t})=>`
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}

.p-hidden-accessible input,
.p-hidden-accessible select {
    transform: scale(0);
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: ${t("scrollbar.width")};
}

/* @todo move to baseiconstyle.ts */

.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,B=(()=>{class t{name="base";useStyle=m(Hr);theme=void 0;css=void 0;classes={};inlineStyles={};load=(e,i={},r=o=>o)=>{let o=r(ie(e,{dt:Ye}));return o?this.useStyle.use(je(o),D({name:this.name},i)):{}};loadCSS=(e={})=>this.load(this.css,e);loadTheme=(e={},i="")=>this.load(this.theme,e,(r="")=>F.transformCSS(e.name||this.name,`${r}${i}`));loadGlobalCSS=(e={})=>this.load(na,e);loadGlobalTheme=(e={},i="")=>this.load(ta,e,(r="")=>F.transformCSS(e.name||this.name,`${r}${i}`));getCommonTheme=e=>F.getCommon(this.name,e);getComponentTheme=e=>F.getComponent(this.name,e);getDirectiveTheme=e=>F.getDirective(this.name,e);getPresetTheme=(e,i,r)=>F.getCustomPreset(this.name,e,i,r);getLayerOrderThemeCSS=()=>F.getLayerOrderCSS(this.name);getStyleSheet=(e="",i={})=>{if(this.css){let r=ie(this.css,{dt:Ye}),o=je(`${r}${e}`),s=Object.entries(i).reduce((a,[l,u])=>a.push(`${l}="${u}"`)&&a,[]).join(" ");return`<style type="text/css" data-primeng-style-id="${this.name}" ${s}>${o}</style>`}return""};getCommonThemeStyleSheet=(e,i={})=>F.getCommonStyleSheet(this.name,e,i);getThemeStyleSheet=(e,i={})=>{let r=[F.getStyleSheet(this.name,e,i)];if(this.theme){let o=this.name==="base"?"global-style":`${this.name}-style`,s=ie(this.theme,{dt:Ye}),a=je(F.transformCSS(o,s)),l=Object.entries(i).reduce((u,[c,d])=>u.push(`${c}="${d}"`)&&u,[]).join(" ");r.push(`<style type="text/css" data-primeng-style-id="${o}" ${l}>${a}</style>`)}return r.join("")};static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var ia=(()=>{class t{theme=te(void 0);csp=te({nonce:void 0});isThemeChanged=!1;document=m(j);baseStyle=m(B);constructor(){gt(()=>{Y.on("theme:change",e=>{ce(()=>{this.isThemeChanged=!0,this.theme.set(e)})})}),gt(()=>{let e=this.theme();this.document&&e&&(this.isThemeChanged||this.onThemeChange(e),this.isThemeChanged=!1)})}ngOnDestroy(){F.clearLoadedStyleNames(),Y.clear()}onThemeChange(e){F.setTheme(e),this.document&&this.loadCommonTheme()}loadCommonTheme(){if(this.theme()!=="none"&&!F.isStyleNameLoaded("common")){let{primitive:e,semantic:i,global:r,style:o}=this.baseStyle.getCommonTheme?.()||{},s={nonce:this.csp?.()?.nonce};this.baseStyle.load(e?.css,D({name:"primitive-variables"},s)),this.baseStyle.load(i?.css,D({name:"semantic-variables"},s)),this.baseStyle.load(r?.css,D({name:"global-variables"},s)),this.baseStyle.loadGlobalTheme(D({name:"global-style"},s),o),F.setLoadedStyleName("common")}}setThemeConfig(e){let{theme:i,csp:r}=e||{};i&&this.theme.set(i),r&&this.csp.set(r)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),fi=(()=>{class t extends ia{ripple=te(!1);platformId=m(Pe);inputStyle=te(null);inputVariant=te(null);overlayOptions={};csp=te({nonce:void 0});filterMatchModeOptions={text:[$.STARTS_WITH,$.CONTAINS,$.NOT_CONTAINS,$.ENDS_WITH,$.EQUALS,$.NOT_EQUALS],numeric:[$.EQUALS,$.NOT_EQUALS,$.LESS_THAN,$.LESS_THAN_OR_EQUAL_TO,$.GREATER_THAN,$.GREATER_THAN_OR_EQUAL_TO],date:[$.DATE_IS,$.DATE_IS_NOT,$.DATE_BEFORE,$.DATE_AFTER]};translation={startsWith:"Starts with",contains:"Contains",notContains:"Not contains",endsWith:"Ends with",equals:"Equals",notEquals:"Not equals",noFilter:"No Filter",lt:"Less than",lte:"Less than or equal to",gt:"Greater than",gte:"Greater than or equal to",is:"Is",isNot:"Is not",before:"Before",after:"After",dateIs:"Date is",dateIsNot:"Date is not",dateBefore:"Date is before",dateAfter:"Date is after",clear:"Clear",apply:"Apply",matchAll:"Match All",matchAny:"Match Any",addRule:"Add Rule",removeRule:"Remove Rule",accept:"Yes",reject:"No",choose:"Choose",upload:"Upload",cancel:"Cancel",pending:"Pending",fileSizeTypes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],chooseYear:"Choose Year",chooseMonth:"Choose Month",chooseDate:"Choose Date",prevDecade:"Previous Decade",nextDecade:"Next Decade",prevYear:"Previous Year",nextYear:"Next Year",prevMonth:"Previous Month",nextMonth:"Next Month",prevHour:"Previous Hour",nextHour:"Next Hour",prevMinute:"Previous Minute",nextMinute:"Next Minute",prevSecond:"Previous Second",nextSecond:"Next Second",am:"am",pm:"pm",dateFormat:"mm/dd/yy",firstDayOfWeek:0,today:"Today",weekHeader:"Wk",weak:"Weak",medium:"Medium",strong:"Strong",passwordPrompt:"Enter a password",emptyMessage:"No results found",searchMessage:"Search results are available",selectionMessage:"{0} items selected",emptySelectionMessage:"No selected item",emptySearchMessage:"No results found",emptyFilterMessage:"No results found",fileChosenMessage:"Files",noFileChosenMessage:"No file chosen",aria:{trueLabel:"True",falseLabel:"False",nullLabel:"Not Selected",star:"1 star",stars:"{star} stars",selectAll:"All items selected",unselectAll:"All items unselected",close:"Close",previous:"Previous",next:"Next",navigation:"Navigation",scrollTop:"Scroll Top",moveTop:"Move Top",moveUp:"Move Up",moveDown:"Move Down",moveBottom:"Move Bottom",moveToTarget:"Move to Target",moveToSource:"Move to Source",moveAllToTarget:"Move All to Target",moveAllToSource:"Move All to Source",pageLabel:"{page}",firstPageLabel:"First Page",lastPageLabel:"Last Page",nextPageLabel:"Next Page",prevPageLabel:"Previous Page",rowsPerPageLabel:"Rows per page",previousPageLabel:"Previous Page",jumpToPageDropdownLabel:"Jump to Page Dropdown",jumpToPageInputLabel:"Jump to Page Input",selectRow:"Row Selected",unselectRow:"Row Unselected",expandRow:"Row Expanded",collapseRow:"Row Collapsed",showFilterMenu:"Show Filter Menu",hideFilterMenu:"Hide Filter Menu",filterOperator:"Filter Operator",filterConstraint:"Filter Constraint",editRow:"Row Edit",saveEdit:"Save Edit",cancelEdit:"Cancel Edit",listView:"List View",gridView:"Grid View",slide:"Slide",slideNumber:"{slideNumber}",zoomImage:"Zoom Image",zoomIn:"Zoom In",zoomOut:"Zoom Out",rotateRight:"Rotate Right",rotateLeft:"Rotate Left",listLabel:"Option List",selectColor:"Select a color",removeLabel:"Remove",browseFiles:"Browse Files",maximizeLabel:"Maximize"}};zIndex={modal:1100,overlay:1e3,menu:1e3,tooltip:1100};translationSource=new we;translationObserver=this.translationSource.asObservable();getTranslation(e){return this.translation[e]}setTranslation(e){this.translation=D(D({},this.translation),e),this.translationSource.next(this.translation)}setConfig(e){let{csp:i,ripple:r,inputStyle:o,inputVariant:s,theme:a,overlayOptions:l,translation:u,filterMatchModeOptions:c}=e||{};i&&this.csp.set(i),r&&this.ripple.set(r),o&&this.inputStyle.set(o),s&&this.inputVariant.set(s),l&&(this.overlayOptions=l),u&&this.setTranslation(u),c&&(this.filterMatchModeOptions=c),a&&this.setThemeConfig({theme:a,csp:i})}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),ra=new I("PRIME_NG_CONFIG");function ch(...t){let n=t?.map(i=>({provide:ra,useValue:i,multi:!1})),e=Xi(()=>{let i=m(fi);t?.forEach(r=>i.setConfig(r))});return Gt([...n,e])}var zr=(()=>{class t extends B{name="common";static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),re=(()=>{class t{document=m(j);platformId=m(Pe);el=m(G);injector=m(Kt);cd=m(ze);renderer=m(le);config=m(fi);baseComponentStyle=m(zr);baseStyle=m(B);scopedStyleEl;rootEl;dt;get styleOptions(){return{nonce:this.config?.csp().nonce}}get _name(){return this.constructor.name.replace(/^_/,"").toLowerCase()}get componentStyle(){return this._componentStyle}attrSelector=_t("pc");themeChangeListeners=[];_getHostInstance(e){if(e)return e?this.hostName?e.name===this.hostName?e:this._getHostInstance(e.parentInstance):e.parentInstance:void 0}_getOptionValue(e,i="",r={}){return un(e,i,r)}ngOnInit(){this.document&&this._loadStyles()}ngAfterViewInit(){this.rootEl=this.el?.nativeElement,this.rootEl&&this.rootEl?.setAttribute(this.attrSelector,"")}ngOnChanges(e){if(this.document&&!ei(this.platformId)){let{dt:i}=e;i&&i.currentValue&&(this._loadScopedThemeStyles(i.currentValue),this._themeChangeListener(()=>this._loadScopedThemeStyles(i.currentValue)))}}ngOnDestroy(){this._unloadScopedThemeStyles(),this.themeChangeListeners.forEach(e=>Y.off("theme:change",e))}_loadStyles(){let e=()=>{Ze.isStyleNameLoaded("base")||(this.baseStyle.loadGlobalCSS(this.styleOptions),Ze.setLoadedStyleName("base")),this._loadThemeStyles()};e(),this._themeChangeListener(()=>e())}_loadCoreStyles(){!Ze.isStyleNameLoaded("base")&&this._name&&(this.baseComponentStyle.loadCSS(this.styleOptions),this.componentStyle&&this.componentStyle?.loadCSS(this.styleOptions),Ze.setLoadedStyleName(this.componentStyle?.name))}_loadThemeStyles(){if(!F.isStyleNameLoaded("common")){let{primitive:e,semantic:i,global:r,style:o}=this.componentStyle?.getCommonTheme?.()||{};this.baseStyle.load(e?.css,D({name:"primitive-variables"},this.styleOptions)),this.baseStyle.load(i?.css,D({name:"semantic-variables"},this.styleOptions)),this.baseStyle.load(r?.css,D({name:"global-variables"},this.styleOptions)),this.baseStyle.loadGlobalTheme(D({name:"global-style"},this.styleOptions),o),F.setLoadedStyleName("common")}if(!F.isStyleNameLoaded(this.componentStyle?.name)&&this.componentStyle?.name){let{css:e,style:i}=this.componentStyle?.getComponentTheme?.()||{};this.componentStyle?.load(e,D({name:`${this.componentStyle?.name}-variables`},this.styleOptions)),this.componentStyle?.loadTheme(D({name:`${this.componentStyle?.name}-style`},this.styleOptions),i),F.setLoadedStyleName(this.componentStyle?.name)}if(!F.isStyleNameLoaded("layer-order")){let e=this.componentStyle?.getLayerOrderThemeCSS?.();this.baseStyle.load(e,D({name:"layer-order",first:!0},this.styleOptions)),F.setLoadedStyleName("layer-order")}this.dt&&(this._loadScopedThemeStyles(this.dt),this._themeChangeListener(()=>this._loadScopedThemeStyles(this.dt)))}_loadScopedThemeStyles(e){let{css:i}=this.componentStyle?.getPresetTheme?.(e,`[${this.attrSelector}]`)||{},r=this.componentStyle?.load(i,D({name:`${this.attrSelector}-${this.componentStyle?.name}`},this.styleOptions));this.scopedStyleEl=r?.el}_unloadScopedThemeStyles(){this.scopedStyleEl?.remove()}_themeChangeListener(e=()=>{}){Ze.clearLoadedStyleNames(),Y.on("theme:change",e),this.themeChangeListeners.push(e)}cx(e,i){let r=this.parent?this.parent.componentStyle?.classes?.[e]:this.componentStyle?.classes?.[e];return typeof r=="function"?r({instance:this}):typeof r=="string"?r:e}sx(e){let i=this.componentStyle?.inlineStyles?.[e];return typeof i=="function"?i({instance:this}):typeof i=="string"?i:D({},i)}get parent(){return this.parentInstance}static \u0275fac=function(i){return new(i||t)};static \u0275dir=_({type:t,inputs:{dt:"dt"},features:[M([zr,B]),ee]})}return t})();var pi=(()=>{class t{static zindex=1e3;static calculatedScrollbarWidth=null;static calculatedScrollbarHeight=null;static browser;static addClass(e,i){e&&i&&(e.classList?e.classList.add(i):e.className+=" "+i)}static addMultipleClasses(e,i){if(e&&i)if(e.classList){let r=i.trim().split(" ");for(let o=0;o<r.length;o++)e.classList.add(r[o])}else{let r=i.split(" ");for(let o=0;o<r.length;o++)e.className+=" "+r[o]}}static removeClass(e,i){e&&i&&(e.classList?e.classList.remove(i):e.className=e.className.replace(new RegExp("(^|\\b)"+i.split(" ").join("|")+"(\\b|$)","gi")," "))}static removeMultipleClasses(e,i){e&&i&&[i].flat().filter(Boolean).forEach(r=>r.split(" ").forEach(o=>this.removeClass(e,o)))}static hasClass(e,i){return e&&i?e.classList?e.classList.contains(i):new RegExp("(^| )"+i+"( |$)","gi").test(e.className):!1}static siblings(e){return Array.prototype.filter.call(e.parentNode.children,function(i){return i!==e})}static find(e,i){return Array.from(e.querySelectorAll(i))}static findSingle(e,i){return this.isElement(e)?e.querySelector(i):null}static index(e){let i=e.parentNode.childNodes,r=0;for(var o=0;o<i.length;o++){if(i[o]==e)return r;i[o].nodeType==1&&r++}return-1}static indexWithinGroup(e,i){let r=e.parentNode?e.parentNode.childNodes:[],o=0;for(var s=0;s<r.length;s++){if(r[s]==e)return o;r[s].attributes&&r[s].attributes[i]&&r[s].nodeType==1&&o++}return-1}static appendOverlay(e,i,r="self"){r!=="self"&&e&&i&&this.appendChild(e,i)}static alignOverlay(e,i,r="self",o=!0){e&&i&&(o&&(e.style.minWidth=`${t.getOuterWidth(i)}px`),r==="self"?this.relativePosition(e,i):this.absolutePosition(e,i))}static relativePosition(e,i,r=!0){let o=C=>{if(C)return getComputedStyle(C).getPropertyValue("position")==="relative"?C:o(C.parentElement)},s=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:this.getHiddenElementDimensions(e),a=i.offsetHeight,l=i.getBoundingClientRect(),u=this.getWindowScrollTop(),c=this.getWindowScrollLeft(),d=this.getViewport(),h=o(e)?.getBoundingClientRect()||{top:-1*u,left:-1*c},y,g;l.top+a+s.height>d.height?(y=l.top-h.top-s.height,e.style.transformOrigin="bottom",l.top+y<0&&(y=-1*l.top)):(y=a+l.top-h.top,e.style.transformOrigin="top");let b=l.left+s.width-d.width,w=l.left-h.left;s.width>d.width?g=(l.left-h.left)*-1:b>0?g=w-b:g=l.left-h.left,e.style.top=y+"px",e.style.left=g+"px",r&&(e.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static absolutePosition(e,i,r=!0){let o=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:this.getHiddenElementDimensions(e),s=o.height,a=o.width,l=i.offsetHeight,u=i.offsetWidth,c=i.getBoundingClientRect(),d=this.getWindowScrollTop(),f=this.getWindowScrollLeft(),h=this.getViewport(),y,g;c.top+l+s>h.height?(y=c.top+d-s,e.style.transformOrigin="bottom",y<0&&(y=d)):(y=l+c.top+d,e.style.transformOrigin="top"),c.left+a>h.width?g=Math.max(0,c.left+f+u-a):g=c.left+f,e.style.top=y+"px",e.style.left=g+"px",r&&(e.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static getParents(e,i=[]){return e.parentNode===null?i:this.getParents(e.parentNode,i.concat([e.parentNode]))}static getScrollableParents(e){let i=[];if(e){let r=this.getParents(e),o=/(auto|scroll)/,s=a=>{let l=window.getComputedStyle(a,null);return o.test(l.getPropertyValue("overflow"))||o.test(l.getPropertyValue("overflowX"))||o.test(l.getPropertyValue("overflowY"))};for(let a of r){let l=a.nodeType===1&&a.dataset.scrollselectors;if(l){let u=l.split(",");for(let c of u){let d=this.findSingle(a,c);d&&s(d)&&i.push(d)}}a.nodeType!==9&&s(a)&&i.push(a)}}return i}static getHiddenElementOuterHeight(e){e.style.visibility="hidden",e.style.display="block";let i=e.offsetHeight;return e.style.display="none",e.style.visibility="visible",i}static getHiddenElementOuterWidth(e){e.style.visibility="hidden",e.style.display="block";let i=e.offsetWidth;return e.style.display="none",e.style.visibility="visible",i}static getHiddenElementDimensions(e){let i={};return e.style.visibility="hidden",e.style.display="block",i.width=e.offsetWidth,i.height=e.offsetHeight,e.style.display="none",e.style.visibility="visible",i}static scrollInView(e,i){let r=getComputedStyle(e).getPropertyValue("borderTopWidth"),o=r?parseFloat(r):0,s=getComputedStyle(e).getPropertyValue("paddingTop"),a=s?parseFloat(s):0,l=e.getBoundingClientRect(),c=i.getBoundingClientRect().top+document.body.scrollTop-(l.top+document.body.scrollTop)-o-a,d=e.scrollTop,f=e.clientHeight,h=this.getOuterHeight(i);c<0?e.scrollTop=d+c:c+h>f&&(e.scrollTop=d+c-f+h)}static fadeIn(e,i){e.style.opacity=0;let r=+new Date,o=0,s=function(){o=+e.style.opacity.replace(",",".")+(new Date().getTime()-r)/i,e.style.opacity=o,r=+new Date,+o<1&&(window.requestAnimationFrame&&requestAnimationFrame(s)||setTimeout(s,16))};s()}static fadeOut(e,i){var r=1,o=50,s=i,a=o/s;let l=setInterval(()=>{r=r-a,r<=0&&(r=0,clearInterval(l)),e.style.opacity=r},o)}static getWindowScrollTop(){let e=document.documentElement;return(window.pageYOffset||e.scrollTop)-(e.clientTop||0)}static getWindowScrollLeft(){let e=document.documentElement;return(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}static matches(e,i){var r=Element.prototype,o=r.matches||r.webkitMatchesSelector||r.mozMatchesSelector||r.msMatchesSelector||function(s){return[].indexOf.call(document.querySelectorAll(s),this)!==-1};return o.call(e,i)}static getOuterWidth(e,i){let r=e.offsetWidth;if(i){let o=getComputedStyle(e);r+=parseFloat(o.marginLeft)+parseFloat(o.marginRight)}return r}static getHorizontalPadding(e){let i=getComputedStyle(e);return parseFloat(i.paddingLeft)+parseFloat(i.paddingRight)}static getHorizontalMargin(e){let i=getComputedStyle(e);return parseFloat(i.marginLeft)+parseFloat(i.marginRight)}static innerWidth(e){let i=e.offsetWidth,r=getComputedStyle(e);return i+=parseFloat(r.paddingLeft)+parseFloat(r.paddingRight),i}static width(e){let i=e.offsetWidth,r=getComputedStyle(e);return i-=parseFloat(r.paddingLeft)+parseFloat(r.paddingRight),i}static getInnerHeight(e){let i=e.offsetHeight,r=getComputedStyle(e);return i+=parseFloat(r.paddingTop)+parseFloat(r.paddingBottom),i}static getOuterHeight(e,i){let r=e.offsetHeight;if(i){let o=getComputedStyle(e);r+=parseFloat(o.marginTop)+parseFloat(o.marginBottom)}return r}static getHeight(e){let i=e.offsetHeight,r=getComputedStyle(e);return i-=parseFloat(r.paddingTop)+parseFloat(r.paddingBottom)+parseFloat(r.borderTopWidth)+parseFloat(r.borderBottomWidth),i}static getWidth(e){let i=e.offsetWidth,r=getComputedStyle(e);return i-=parseFloat(r.paddingLeft)+parseFloat(r.paddingRight)+parseFloat(r.borderLeftWidth)+parseFloat(r.borderRightWidth),i}static getViewport(){let e=window,i=document,r=i.documentElement,o=i.getElementsByTagName("body")[0],s=e.innerWidth||r.clientWidth||o.clientWidth,a=e.innerHeight||r.clientHeight||o.clientHeight;return{width:s,height:a}}static getOffset(e){var i=e.getBoundingClientRect();return{top:i.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:i.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}static replaceElementWith(e,i){let r=e.parentNode;if(!r)throw"Can't replace element";return r.replaceChild(i,e)}static getUserAgent(){if(navigator&&this.isClient())return navigator.userAgent}static isIE(){var e=window.navigator.userAgent,i=e.indexOf("MSIE ");if(i>0)return!0;var r=e.indexOf("Trident/");if(r>0){var o=e.indexOf("rv:");return!0}var s=e.indexOf("Edge/");return s>0}static isIOS(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}static isAndroid(){return/(android)/i.test(navigator.userAgent)}static isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}static appendChild(e,i){if(this.isElement(i))i.appendChild(e);else if(i&&i.el&&i.el.nativeElement)i.el.nativeElement.appendChild(e);else throw"Cannot append "+i+" to "+e}static removeChild(e,i){if(this.isElement(i))i.removeChild(e);else if(i.el&&i.el.nativeElement)i.el.nativeElement.removeChild(e);else throw"Cannot remove "+e+" from "+i}static removeElement(e){"remove"in Element.prototype?e.remove():e.parentNode.removeChild(e)}static isElement(e){return typeof HTMLElement=="object"?e instanceof HTMLElement:e&&typeof e=="object"&&e!==null&&e.nodeType===1&&typeof e.nodeName=="string"}static calculateScrollbarWidth(e){if(e){let i=getComputedStyle(e);return e.offsetWidth-e.clientWidth-parseFloat(i.borderLeftWidth)-parseFloat(i.borderRightWidth)}else{if(this.calculatedScrollbarWidth!==null)return this.calculatedScrollbarWidth;let i=document.createElement("div");i.className="p-scrollbar-measure",document.body.appendChild(i);let r=i.offsetWidth-i.clientWidth;return document.body.removeChild(i),this.calculatedScrollbarWidth=r,r}}static calculateScrollbarHeight(){if(this.calculatedScrollbarHeight!==null)return this.calculatedScrollbarHeight;let e=document.createElement("div");e.className="p-scrollbar-measure",document.body.appendChild(e);let i=e.offsetHeight-e.clientHeight;return document.body.removeChild(e),this.calculatedScrollbarWidth=i,i}static invokeElementMethod(e,i,r){e[i].apply(e,r)}static clearSelection(){if(window.getSelection)window.getSelection().empty?window.getSelection().empty():window.getSelection().removeAllRanges&&window.getSelection().rangeCount>0&&window.getSelection().getRangeAt(0).getClientRects().length>0&&window.getSelection().removeAllRanges();else if(document.selection&&document.selection.empty)try{document.selection.empty()}catch{}}static getBrowser(){if(!this.browser){let e=this.resolveUserAgent();this.browser={},e.browser&&(this.browser[e.browser]=!0,this.browser.version=e.version),this.browser.chrome?this.browser.webkit=!0:this.browser.webkit&&(this.browser.safari=!0)}return this.browser}static resolveUserAgent(){let e=navigator.userAgent.toLowerCase(),i=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:i[1]||"",version:i[2]||"0"}}static isInteger(e){return Number.isInteger?Number.isInteger(e):typeof e=="number"&&isFinite(e)&&Math.floor(e)===e}static isHidden(e){return!e||e.offsetParent===null}static isVisible(e){return e&&e.offsetParent!=null}static isExist(e){return e!==null&&typeof e<"u"&&e.nodeName&&e.parentNode}static focus(e,i){e&&document.activeElement!==e&&e.focus(i)}static getFocusableSelectorString(e=""){return`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`}static getFocusableElements(e,i=""){let r=this.find(e,this.getFocusableSelectorString(i)),o=[];for(let s of r){let a=getComputedStyle(s);this.isVisible(s)&&a.display!="none"&&a.visibility!="hidden"&&o.push(s)}return o}static getFocusableElement(e,i=""){let r=this.findSingle(e,this.getFocusableSelectorString(i));if(r){let o=getComputedStyle(r);if(this.isVisible(r)&&o.display!="none"&&o.visibility!="hidden")return r}return null}static getFirstFocusableElement(e,i=""){let r=this.getFocusableElements(e,i);return r.length>0?r[0]:null}static getLastFocusableElement(e,i){let r=this.getFocusableElements(e,i);return r.length>0?r[r.length-1]:null}static getNextFocusableElement(e,i=!1){let r=t.getFocusableElements(e),o=0;if(r&&r.length>0){let s=r.indexOf(r[0].ownerDocument.activeElement);i?s==-1||s===0?o=r.length-1:o=s-1:s!=-1&&s!==r.length-1&&(o=s+1)}return r[o]}static generateZIndex(){return this.zindex=this.zindex||999,++this.zindex}static getSelection(){return window.getSelection?window.getSelection().toString():document.getSelection?document.getSelection().toString():document.selection?document.selection.createRange().text:null}static getTargetElement(e,i){if(!e)return null;switch(e){case"document":return document;case"window":return window;case"@next":return i?.nextElementSibling;case"@prev":return i?.previousElementSibling;case"@parent":return i?.parentElement;case"@grandparent":return i?.parentElement.parentElement;default:let r=typeof e;if(r==="string")return document.querySelector(e);if(r==="object"&&e.hasOwnProperty("nativeElement"))return this.isExist(e.nativeElement)?e.nativeElement:void 0;let s=(a=>!!(a&&a.constructor&&a.call&&a.apply))(e)?e():e;return s&&s.nodeType===9||this.isExist(s)?s:null}}static isClient(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}static getAttribute(e,i){if(e){let r=e.getAttribute(i);return isNaN(r)?r==="true"||r==="false"?r==="true":r:+r}}static calculateBodyScrollbarWidth(){return window.innerWidth-document.documentElement.offsetWidth}static blockBodyScroll(e="p-overflow-hidden"){document.body.style.setProperty("--scrollbar-width",this.calculateBodyScrollbarWidth()+"px"),this.addClass(document.body,e)}static unblockBodyScroll(e="p-overflow-hidden"){document.body.style.removeProperty("--scrollbar-width"),this.removeClass(document.body,e)}static createElement(e,i={},...r){if(e){let o=document.createElement(e);return this.setAttributes(o,i),o.append(...r),o}}static setAttribute(e,i="",r){this.isElement(e)&&r!==null&&r!==void 0&&e.setAttribute(i,r)}static setAttributes(e,i={}){if(this.isElement(e)){let r=(o,s)=>{let a=e?.$attrs?.[o]?[e?.$attrs?.[o]]:[];return[s].flat().reduce((l,u)=>{if(u!=null){let c=typeof u;if(c==="string"||c==="number")l.push(u);else if(c==="object"){let d=Array.isArray(u)?r(o,u):Object.entries(u).map(([f,h])=>o==="style"&&(h||h===0)?`${f.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${h}`:h?f:void 0);l=d.length?l.concat(d.filter(f=>!!f)):l}}return l},a)};Object.entries(i).forEach(([o,s])=>{if(s!=null){let a=o.match(/^on(.+)/);a?e.addEventListener(a[1].toLowerCase(),s):o==="pBind"?this.setAttributes(e,s):(s=o==="class"?[...new Set(r("class",s))].join(" ").trim():o==="style"?r("style",s).join(";").trim():s,(e.$attrs=e.$attrs||{})&&(e.$attrs[o]=s),e.setAttribute(o,s))}})}}static isFocusableElement(e,i=""){return this.isElement(e)?e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i}`):!1}}return t})(),Gr=class{element;listener;scrollableParents;constructor(n,e=()=>{}){this.element=n,this.listener=e}bindScrollListener(){this.scrollableParents=pi.getScrollableParents(this.element);for(let n=0;n<this.scrollableParents.length;n++)this.scrollableParents[n].addEventListener("scroll",this.listener)}unbindScrollListener(){if(this.scrollableParents)for(let n=0;n<this.scrollableParents.length;n++)this.scrollableParents[n].removeEventListener("scroll",this.listener)}destroy(){this.unbindScrollListener(),this.element=null,this.listener=null,this.scrollableParents=null}};var Wr=(()=>{class t extends re{autofocus=!1;_autofocus=!1;focused=!1;platformId=m(Pe);document=m(j);host=m(G);ngAfterContentChecked(){this.autofocus===!1?this.host.nativeElement.removeAttribute("autofocus"):this.host.nativeElement.setAttribute("autofocus",!0),this.focused||this.autoFocus()}ngAfterViewChecked(){this.focused||this.autoFocus()}autoFocus(){vt(this.platformId)&&this._autofocus&&setTimeout(()=>{let e=pi.getFocusableElements(this.host?.nativeElement);e.length===0&&this.host.nativeElement.focus(),e.length>0&&e[0].focus(),this.focused=!0})}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["","pAutoFocus",""]],inputs:{autofocus:[2,"autofocus","autofocus",R],_autofocus:[0,"pAutoFocus","_autofocus"]},features:[E]})}return t})(),Rh=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();var oa=({dt:t})=>`
.p-badge {
    display: inline-flex;
    border-radius: ${t("badge.border.radius")};
    justify-content: center;
    padding: ${t("badge.padding")};
    background: ${t("badge.primary.background")};
    color: ${t("badge.primary.color")};
    font-size: ${t("badge.font.size")};
    font-weight: ${t("badge.font.weight")};
    min-width: ${t("badge.min.width")};
    height: ${t("badge.height")};
    line-height: ${t("badge.height")};
}

.p-badge-dot {
    width: ${t("badge.dot.size")};
    min-width: ${t("badge.dot.size")};
    height: ${t("badge.dot.size")};
    border-radius: 50%;
    padding: 0;
}

.p-badge-circle {
    padding: 0;
    border-radius: 50%;
}

.p-badge-secondary {
    background: ${t("badge.secondary.background")};
    color: ${t("badge.secondary.color")};
}

.p-badge-success {
    background: ${t("badge.success.background")};
    color: ${t("badge.success.color")};
}

.p-badge-info {
    background: ${t("badge.info.background")};
    color: ${t("badge.info.color")};
}

.p-badge-warn {
    background: ${t("badge.warn.background")};
    color: ${t("badge.warn.color")};
}

.p-badge-danger {
    background: ${t("badge.danger.background")};
    color: ${t("badge.danger.color")};
}

.p-badge-contrast {
    background: ${t("badge.contrast.background")};
    color: ${t("badge.contrast.color")};
}

.p-badge-sm {
    font-size: ${t("badge.sm.font.size")};
    min-width: ${t("badge.sm.min.width")};
    height: ${t("badge.sm.height")};
    line-height: ${t("badge.sm.height")};
}

.p-badge-lg {
    font-size: ${t("badge.lg.font.size")};
    min-width: ${t("badge.lg.min.width")};
    height: ${t("badge.lg.height")};
    line-height: ${t("badge.lg.height")};
}

.p-badge-xl {
    font-size: ${t("badge.xl.font.size")};
    min-width: ${t("badge.xl.min.width")};
    height: ${t("badge.xl.height")};
    line-height: ${t("badge.xl.height")};
}

/* For PrimeNG (directive)*/

.p-overlay-badge {
    position: relative;
}

.p-overlay-badge > .p-badge {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
    margin: 0;
}
`,sa={root:({props:t,instance:n})=>["p-badge p-component",{"p-badge-circle":T(t.value)&&String(t.value).length===1,"p-badge-dot":z(t.value)&&!n.$slots.default,"p-badge-sm":t.size==="small","p-badge-lg":t.size==="large","p-badge-xl":t.size==="xlarge","p-badge-info":t.severity==="info","p-badge-success":t.severity==="success","p-badge-warn":t.severity==="warn","p-badge-danger":t.severity==="danger","p-badge-secondary":t.severity==="secondary","p-badge-contrast":t.severity==="contrast"}]},Kr=(()=>{class t extends B{name="badge";theme=oa;classes=sa;static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var gi=(()=>{class t extends re{styleClass=Se();style=Se();badgeSize=Se();size=Se();severity=Se();value=Se();badgeDisabled=Se(!1,{transform:R});_componentStyle=m(Kr);containerClass=Ie(()=>{let e="p-badge p-component";return T(this.value())&&String(this.value()).length===1&&(e+=" p-badge-circle"),this.badgeSize()==="large"?e+=" p-badge-lg":this.badgeSize()==="xlarge"?e+=" p-badge-xl":this.badgeSize()==="small"&&(e+=" p-badge-sm"),z(this.value())&&(e+=" p-badge-dot"),this.styleClass()&&(e+=` ${this.styleClass()}`),this.severity()&&(e+=` p-badge-${this.severity()}`),e});static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275cmp=W({type:t,selectors:[["p-badge"]],hostVars:6,hostBindings:function(i,r){i&2&&(Qi(r.style()),Ae(r.containerClass()),Ji("display",r.badgeDisabled()?"none":null))},inputs:{styleClass:[1,"styleClass"],style:[1,"style"],badgeSize:[1,"badgeSize"],size:[1,"size"],severity:[1,"severity"],value:[1,"value"],badgeDisabled:[1,"badgeDisabled"]},features:[M([Kr]),E],decls:1,vars:1,template:function(i,r){i&1&&Jt(0),i&2&&Qt(r.value())},dependencies:[Me,xe],encapsulation:2,changeDetection:0})}return t})(),qr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[gi,xe,xe]})}return t})();var la=["*"],ua=`
.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,ca=(()=>{class t extends B{name="baseicon";inlineStyles=ua;static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var pn=(()=>{class t extends re{label;spin=!1;styleClass;role;ariaLabel;ariaHidden;ngOnInit(){super.ngOnInit(),this.getAttributes()}getAttributes(){let e=z(this.label);this.role=e?void 0:"img",this.ariaLabel=e?void 0:this.label,this.ariaHidden=e}getClassNames(){return`p-icon ${this.styleClass?this.styleClass+" ":""}${this.spin?"p-icon-spin":""}`}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275cmp=W({type:t,selectors:[["ng-component"]],hostAttrs:[1,"p-component","p-iconwrapper"],inputs:{label:"label",spin:[2,"spin","spin",R],styleClass:"styleClass"},features:[M([ca]),E],ngContentSelectors:la,decls:1,vars:0,template:function(i,r){i&1&&($e(),Ve(0))},encapsulation:2,changeDetection:0})}return t})();var Yr=(()=>{class t extends pn{pathId;ngOnInit(){this.pathId="url(#"+_t()+")"}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275cmp=W({type:t,selectors:[["SpinnerIcon"]],features:[E],decls:6,vars:7,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,r){i&1&&(Wt(),Fe(0,"svg",0)(1,"g"),ge(2,"path",1),Te(),Fe(3,"defs")(4,"clipPath",2),ge(5,"rect",3),Te()()()),i&2&&(Ae(r.getClassNames()),ne("aria-label",r.ariaLabel)("aria-hidden",r.ariaHidden)("role",r.role),V(),ne("clip-path",r.pathId),V(3),x("id",r.pathId))},encapsulation:2})}return t})();var lf=(()=>{class t extends pn{static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275cmp=W({type:t,selectors:[["TimesIcon"]],features:[E],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z","fill","currentColor"]],template:function(i,r){i&1&&(Wt(),Fe(0,"svg",0),ge(1,"path",1),Te()),i&2&&(Ae(r.getClassNames()),ne("aria-label",r.ariaLabel)("aria-hidden",r.ariaHidden)("role",r.role))},encapsulation:2})}return t})();var da=({dt:t})=>`
/* For PrimeNG */
.p-ripple {
    overflow: hidden;
    position: relative;
}

.p-ink {
    display: block;
    position: absolute;
    background: ${t("ripple.background")};
    border-radius: 100%;
    transform: scale(0);
}

.p-ink-active {
    animation: ripple 0.4s linear;
}

.p-ripple-disabled .p-ink {
    display: none !important;
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
`,ha={root:"p-ink"},Zr=(()=>{class t extends B{name="ripple";theme=da;classes=ha;static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Xr=(()=>{class t extends re{zone=m(qt);_componentStyle=m(Zr);animationListener;mouseDownListener;timeout;constructor(){super(),gt(()=>{vt(this.platformId)&&(this.config.ripple()?this.zone.runOutsideAngular(()=>{this.create(),this.mouseDownListener=this.renderer.listen(this.el.nativeElement,"mousedown",this.onMouseDown.bind(this))}):this.remove())})}ngAfterViewInit(){super.ngAfterViewInit()}onMouseDown(e){let i=this.getInk();if(!i||this.document.defaultView?.getComputedStyle(i,null).display==="none")return;if(Ue(i,"p-ink-active"),!ii(i)&&!oi(i)){let a=Math.max(Ar(this.el.nativeElement),ri(this.el.nativeElement));i.style.height=a+"px",i.style.width=a+"px"}let r=Ir(this.el.nativeElement),o=e.pageX-r.left+this.document.body.scrollTop-oi(i)/2,s=e.pageY-r.top+this.document.body.scrollLeft-ii(i)/2;this.renderer.setStyle(i,"top",s+"px"),this.renderer.setStyle(i,"left",o+"px"),Dt(i,"p-ink-active"),this.timeout=setTimeout(()=>{let a=this.getInk();a&&Ue(a,"p-ink-active")},401)}getInk(){let e=this.el.nativeElement.children;for(let i=0;i<e.length;i++)if(typeof e[i].className=="string"&&e[i].className.indexOf("p-ink")!==-1)return e[i];return null}resetInk(){let e=this.getInk();e&&Ue(e,"p-ink-active")}onAnimationEnd(e){this.timeout&&clearTimeout(this.timeout),Ue(e.currentTarget,"p-ink-active")}create(){let e=this.renderer.createElement("span");this.renderer.addClass(e,"p-ink"),this.renderer.appendChild(this.el.nativeElement,e),this.renderer.setAttribute(e,"aria-hidden","true"),this.renderer.setAttribute(e,"role","presentation"),this.animationListener||(this.animationListener=this.renderer.listen(e,"animationend",this.onAnimationEnd.bind(this)))}remove(){let e=this.getInk();e&&(this.mouseDownListener&&this.mouseDownListener(),this.animationListener&&this.animationListener(),this.mouseDownListener=null,this.animationListener=null,Or(e))}ngOnDestroy(){this.config&&this.config.ripple()&&this.remove(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=_({type:t,selectors:[["","pRipple",""]],hostAttrs:[1,"p-ripple"],features:[M([Zr]),E]})}return t})(),bf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();var fa=["content"],pa=["loadingicon"],ga=["icon"],ma=["*"],Qr=t=>({class:t});function ya(t,n){t&1&&er(0)}function ba(t,n){if(t&1&&ge(0,"span",8),t&2){let e=ue(3);x("ngClass",e.iconClass()),ne("aria-hidden",!0)("data-pc-section","loadingicon")}}function va(t,n){if(t&1&&ge(0,"SpinnerIcon",9),t&2){let e=ue(3);x("styleClass",e.spinnerIconClass())("spin",!0),ne("aria-hidden",!0)("data-pc-section","loadingicon")}}function Da(t,n){if(t&1&&(Zt(0),ke(1,ba,1,3,"span",6)(2,va,1,4,"SpinnerIcon",7),Xt()),t&2){let e=ue(2);V(),x("ngIf",e.loadingIcon),V(),x("ngIf",!e.loadingIcon)}}function _a(t,n){}function Ca(t,n){if(t&1&&ke(0,_a,0,0,"ng-template",10),t&2){let e=ue(2);x("ngIf",e.loadingIconTemplate||e._loadingIconTemplate)}}function Ea(t,n){if(t&1&&(Zt(0),ke(1,Da,3,2,"ng-container",2)(2,Ca,1,1,null,5),Xt()),t&2){let e=ue();V(),x("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),V(),x("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)("ngTemplateOutletContext",Un(3,Qr,e.iconClass()))}}function wa(t,n){if(t&1&&ge(0,"span",8),t&2){let e=ue(2);Ae(e.icon),x("ngClass",e.iconClass()),ne("data-pc-section","icon")}}function Sa(t,n){}function Aa(t,n){if(t&1&&ke(0,Sa,0,0,"ng-template",10),t&2){let e=ue(2);x("ngIf",!e.icon&&(e.iconTemplate||e._iconTemplate))}}function Fa(t,n){if(t&1&&(Zt(0),ke(1,wa,1,4,"span",11)(2,Aa,1,1,null,5),Xt()),t&2){let e=ue();V(),x("ngIf",e.icon&&!e.iconTemplate&&!e._iconTemplate),V(),x("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)("ngTemplateOutletContext",Un(3,Qr,e.iconClass()))}}function Ta(t,n){if(t&1&&(Fe(0,"span",12),Jt(1),Te()),t&2){let e=ue();ne("aria-hidden",e.icon&&!e.label)("data-pc-section","label"),V(),Qt(e.label)}}function Ia(t,n){if(t&1&&ge(0,"p-badge",13),t&2){let e=ue();x("value",e.badge)("severity",e.badgeSeverity)}}var Oa=({dt:t})=>`
.p-button {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: ${t("button.primary.color")};
    background: ${t("button.primary.background")};
    border: 1px solid ${t("button.primary.border.color")};
    padding-block: ${t("button.padding.y")};
    padding-inline: ${t("button.padding.x")};
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background ${t("button.transition.duration")}, color ${t("button.transition.duration")}, border-color ${t("button.transition.duration")},
            outline-color ${t("button.transition.duration")}, box-shadow ${t("button.transition.duration")};
    border-radius: ${t("button.border.radius")};
    outline-color: transparent;
    gap: ${t("button.gap")};
}

.p-button-icon,
.p-button-icon:before,
.p-button-icon:after {
    line-height: inherit;
}

.p-button:disabled {
    cursor: default;
}

.p-button-icon-right {
    order: 1;
}

.p-button-icon-right:dir(rtl) {
    order: -1;
}

.p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
    order: 1;
}

.p-button-icon-bottom {
    order: 2;
}

.p-button-icon-only {
    width: ${t("button.icon.only.width")};
    padding-inline-start: 0;
    padding-inline-end: 0;
    gap: 0;
}

.p-button-icon-only.p-button-rounded {
    border-radius: 50%;
    height: ${t("button.icon.only.width")};
}

.p-button-icon-only .p-button-label {
    visibility: hidden;
    width: 0;
}

.p-button-sm {
    font-size: ${t("button.sm.font.size")};
    padding-block: ${t("button.sm.padding.y")};
    padding-inline: ${t("button.sm.padding.x")};
}

.p-button-sm .p-button-icon {
    font-size: ${t("button.sm.font.size")};
}

.p-button-sm.p-button-icon-only {
    width: ${t("button.sm.icon.only.width")};
}

.p-button-sm.p-button-icon-only.p-button-rounded {
    height: ${t("button.sm.icon.only.width")};
}

.p-button-lg {
    font-size: ${t("button.lg.font.size")};
    padding-block: ${t("button.lg.padding.y")};
    padding-inline: ${t("button.lg.padding.x")};
}

.p-button-lg .p-button-icon {
    font-size: ${t("button.lg.font.size")};
}

.p-button-lg.p-button-icon-only {
    width: ${t("button.lg.icon.only.width")};
}

.p-button-lg.p-button-icon-only.p-button-rounded {
    height: ${t("button.lg.icon.only.width")};
}

.p-button-vertical {
    flex-direction: column;
}

.p-button-label {
    font-weight: ${t("button.label.font.weight")};
}

.p-button-fluid {
    width: 100%;
}

.p-button-fluid.p-button-icon-only {
    width: ${t("button.icon.only.width")};
}

.p-button:not(:disabled):hover {
    background: ${t("button.primary.hover.background")};
    border: 1px solid ${t("button.primary.hover.border.color")};
    color: ${t("button.primary.hover.color")};
}

.p-button:not(:disabled):active {
    background: ${t("button.primary.active.background")};
    border: 1px solid ${t("button.primary.active.border.color")};
    color: ${t("button.primary.active.color")};
}

.p-button:focus-visible {
    box-shadow: ${t("button.primary.focus.ring.shadow")};
    outline: ${t("button.focus.ring.width")} ${t("button.focus.ring.style")} ${t("button.primary.focus.ring.color")};
    outline-offset: ${t("button.focus.ring.offset")};
}

.p-button .p-badge {
    min-width: ${t("button.badge.size")};
    height: ${t("button.badge.size")};
    line-height: ${t("button.badge.size")};
}

.p-button-raised {
    box-shadow: ${t("button.raised.shadow")};
}

.p-button-rounded {
    border-radius: ${t("button.rounded.border.radius")};
}

.p-button-secondary {
    background: ${t("button.secondary.background")};
    border: 1px solid ${t("button.secondary.border.color")};
    color: ${t("button.secondary.color")};
}

.p-button-secondary:not(:disabled):hover {
    background: ${t("button.secondary.hover.background")};
    border: 1px solid ${t("button.secondary.hover.border.color")};
    color: ${t("button.secondary.hover.color")};
}

.p-button-secondary:not(:disabled):active {
    background: ${t("button.secondary.active.background")};
    border: 1px solid ${t("button.secondary.active.border.color")};
    color: ${t("button.secondary.active.color")};
}

.p-button-secondary:focus-visible {
    outline-color: ${t("button.secondary.focus.ring.color")};
    box-shadow: ${t("button.secondary.focus.ring.shadow")};
}

.p-button-success {
    background: ${t("button.success.background")};
    border: 1px solid ${t("button.success.border.color")};
    color: ${t("button.success.color")};
}

.p-button-success:not(:disabled):hover {
    background: ${t("button.success.hover.background")};
    border: 1px solid ${t("button.success.hover.border.color")};
    color: ${t("button.success.hover.color")};
}

.p-button-success:not(:disabled):active {
    background: ${t("button.success.active.background")};
    border: 1px solid ${t("button.success.active.border.color")};
    color: ${t("button.success.active.color")};
}

.p-button-success:focus-visible {
    outline-color: ${t("button.success.focus.ring.color")};
    box-shadow: ${t("button.success.focus.ring.shadow")};
}

.p-button-info {
    background: ${t("button.info.background")};
    border: 1px solid ${t("button.info.border.color")};
    color: ${t("button.info.color")};
}

.p-button-info:not(:disabled):hover {
    background: ${t("button.info.hover.background")};
    border: 1px solid ${t("button.info.hover.border.color")};
    color: ${t("button.info.hover.color")};
}

.p-button-info:not(:disabled):active {
    background: ${t("button.info.active.background")};
    border: 1px solid ${t("button.info.active.border.color")};
    color: ${t("button.info.active.color")};
}

.p-button-info:focus-visible {
    outline-color: ${t("button.info.focus.ring.color")};
    box-shadow: ${t("button.info.focus.ring.shadow")};
}

.p-button-warn {
    background: ${t("button.warn.background")};
    border: 1px solid ${t("button.warn.border.color")};
    color: ${t("button.warn.color")};
}

.p-button-warn:not(:disabled):hover {
    background: ${t("button.warn.hover.background")};
    border: 1px solid ${t("button.warn.hover.border.color")};
    color: ${t("button.warn.hover.color")};
}

.p-button-warn:not(:disabled):active {
    background: ${t("button.warn.active.background")};
    border: 1px solid ${t("button.warn.active.border.color")};
    color: ${t("button.warn.active.color")};
}

.p-button-warn:focus-visible {
    outline-color: ${t("button.warn.focus.ring.color")};
    box-shadow: ${t("button.warn.focus.ring.shadow")};
}

.p-button-help {
    background: ${t("button.help.background")};
    border: 1px solid ${t("button.help.border.color")};
    color: ${t("button.help.color")};
}

.p-button-help:not(:disabled):hover {
    background: ${t("button.help.hover.background")};
    border: 1px solid ${t("button.help.hover.border.color")};
    color: ${t("button.help.hover.color")};
}

.p-button-help:not(:disabled):active {
    background: ${t("button.help.active.background")};
    border: 1px solid ${t("button.help.active.border.color")};
    color: ${t("button.help.active.color")};
}

.p-button-help:focus-visible {
    outline-color: ${t("button.help.focus.ring.color")};
    box-shadow: ${t("button.help.focus.ring.shadow")};
}

.p-button-danger {
    background: ${t("button.danger.background")};
    border: 1px solid ${t("button.danger.border.color")};
    color: ${t("button.danger.color")};
}

.p-button-danger:not(:disabled):hover {
    background: ${t("button.danger.hover.background")};
    border: 1px solid ${t("button.danger.hover.border.color")};
    color: ${t("button.danger.hover.color")};
}

.p-button-danger:not(:disabled):active {
    background: ${t("button.danger.active.background")};
    border: 1px solid ${t("button.danger.active.border.color")};
    color: ${t("button.danger.active.color")};
}

.p-button-danger:focus-visible {
    outline-color: ${t("button.danger.focus.ring.color")};
    box-shadow: ${t("button.danger.focus.ring.shadow")};
}

.p-button-contrast {
    background: ${t("button.contrast.background")};
    border: 1px solid ${t("button.contrast.border.color")};
    color: ${t("button.contrast.color")};
}

.p-button-contrast:not(:disabled):hover {
    background: ${t("button.contrast.hover.background")};
    border: 1px solid ${t("button.contrast.hover.border.color")};
    color: ${t("button.contrast.hover.color")};
}

.p-button-contrast:not(:disabled):active {
    background: ${t("button.contrast.active.background")};
    border: 1px solid ${t("button.contrast.active.border.color")};
    color: ${t("button.contrast.active.color")};
}

.p-button-contrast:focus-visible {
    outline-color: ${t("button.contrast.focus.ring.color")};
    box-shadow: ${t("button.contrast.focus.ring.shadow")};
}

.p-button-outlined {
    background: transparent;
    border-color: ${t("button.outlined.primary.border.color")};
    color: ${t("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):hover {
    background: ${t("button.outlined.primary.hover.background")};
    border-color: ${t("button.outlined.primary.border.color")};
    color: ${t("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):active {
    background: ${t("button.outlined.primary.active.background")};
    border-color: ${t("button.outlined.primary.border.color")};
    color: ${t("button.outlined.primary.color")};
}

.p-button-outlined.p-button-secondary {
    border-color: ${t("button.outlined.secondary.border.color")};
    color: ${t("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):hover {
    background: ${t("button.outlined.secondary.hover.background")};
    border-color: ${t("button.outlined.secondary.border.color")};
    color: ${t("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):active {
    background: ${t("button.outlined.secondary.active.background")};
    border-color: ${t("button.outlined.secondary.border.color")};
    color: ${t("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-success {
    border-color: ${t("button.outlined.success.border.color")};
    color: ${t("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):hover {
    background: ${t("button.outlined.success.hover.background")};
    border-color: ${t("button.outlined.success.border.color")};
    color: ${t("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):active {
    background: ${t("button.outlined.success.active.background")};
    border-color: ${t("button.outlined.success.border.color")};
    color: ${t("button.outlined.success.color")};
}

.p-button-outlined.p-button-info {
    border-color: ${t("button.outlined.info.border.color")};
    color: ${t("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):hover {
    background: ${t("button.outlined.info.hover.background")};
    border-color: ${t("button.outlined.info.border.color")};
    color: ${t("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):active {
    background: ${t("button.outlined.info.active.background")};
    border-color: ${t("button.outlined.info.border.color")};
    color: ${t("button.outlined.info.color")};
}

.p-button-outlined.p-button-warn {
    border-color: ${t("button.outlined.warn.border.color")};
    color: ${t("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):hover {
    background: ${t("button.outlined.warn.hover.background")};
    border-color: ${t("button.outlined.warn.border.color")};
    color: ${t("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):active {
    background: ${t("button.outlined.warn.active.background")};
    border-color: ${t("button.outlined.warn.border.color")};
    color: ${t("button.outlined.warn.color")};
}

.p-button-outlined.p-button-help {
    border-color: ${t("button.outlined.help.border.color")};
    color: ${t("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):hover {
    background: ${t("button.outlined.help.hover.background")};
    border-color: ${t("button.outlined.help.border.color")};
    color: ${t("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):active {
    background: ${t("button.outlined.help.active.background")};
    border-color: ${t("button.outlined.help.border.color")};
    color: ${t("button.outlined.help.color")};
}

.p-button-outlined.p-button-danger {
    border-color: ${t("button.outlined.danger.border.color")};
    color: ${t("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):hover {
    background: ${t("button.outlined.danger.hover.background")};
    border-color: ${t("button.outlined.danger.border.color")};
    color: ${t("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):active {
    background: ${t("button.outlined.danger.active.background")};
    border-color: ${t("button.outlined.danger.border.color")};
    color: ${t("button.outlined.danger.color")};
}

.p-button-outlined.p-button-contrast {
    border-color: ${t("button.outlined.contrast.border.color")};
    color: ${t("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):hover {
    background: ${t("button.outlined.contrast.hover.background")};
    border-color: ${t("button.outlined.contrast.border.color")};
    color: ${t("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):active {
    background: ${t("button.outlined.contrast.active.background")};
    border-color: ${t("button.outlined.contrast.border.color")};
    color: ${t("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-plain {
    border-color: ${t("button.outlined.plain.border.color")};
    color: ${t("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):hover {
    background: ${t("button.outlined.plain.hover.background")};
    border-color: ${t("button.outlined.plain.border.color")};
    color: ${t("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):active {
    background: ${t("button.outlined.plain.active.background")};
    border-color: ${t("button.outlined.plain.border.color")};
    color: ${t("button.outlined.plain.color")};
}

.p-button-text {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.primary.color")};
}

.p-button-text:not(:disabled):hover {
    background: ${t("button.text.primary.hover.background")};
    border-color: transparent;
    color: ${t("button.text.primary.color")};
}

.p-button-text:not(:disabled):active {
    background: ${t("button.text.primary.active.background")};
    border-color: transparent;
    color: ${t("button.text.primary.color")};
}

.p-button-text.p-button-secondary {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):hover {
    background: ${t("button.text.secondary.hover.background")};
    border-color: transparent;
    color: ${t("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):active {
    background: ${t("button.text.secondary.active.background")};
    border-color: transparent;
    color: ${t("button.text.secondary.color")};
}

.p-button-text.p-button-success {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):hover {
    background: ${t("button.text.success.hover.background")};
    border-color: transparent;
    color: ${t("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):active {
    background: ${t("button.text.success.active.background")};
    border-color: transparent;
    color: ${t("button.text.success.color")};
}

.p-button-text.p-button-info {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):hover {
    background: ${t("button.text.info.hover.background")};
    border-color: transparent;
    color: ${t("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):active {
    background: ${t("button.text.info.active.background")};
    border-color: transparent;
    color: ${t("button.text.info.color")};
}

.p-button-text.p-button-warn {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):hover {
    background: ${t("button.text.warn.hover.background")};
    border-color: transparent;
    color: ${t("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):active {
    background: ${t("button.text.warn.active.background")};
    border-color: transparent;
    color: ${t("button.text.warn.color")};
}

.p-button-text.p-button-help {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):hover {
    background: ${t("button.text.help.hover.background")};
    border-color: transparent;
    color: ${t("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):active {
    background: ${t("button.text.help.active.background")};
    border-color: transparent;
    color: ${t("button.text.help.color")};
}

.p-button-text.p-button-danger {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):hover {
    background: ${t("button.text.danger.hover.background")};
    border-color: transparent;
    color: ${t("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):active {
    background: ${t("button.text.danger.active.background")};
    border-color: transparent;
    color: ${t("button.text.danger.color")};
}

.p-button-text.p-button-plain {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):hover {
    background: ${t("button.text.plain.hover.background")};
    border-color: transparent;
    color: ${t("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):active {
    background: ${t("button.text.plain.active.background")};
    border-color: transparent;
    color: ${t("button.text.plain.color")};
}

.p-button-text.p-button-contrast {
    background: transparent;
    border-color: transparent;
    color: ${t("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):hover {
    background: ${t("button.text.contrast.hover.background")};
    border-color: transparent;
    color: ${t("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):active {
    background: ${t("button.text.contrast.active.background")};
    border-color: transparent;
    color: ${t("button.text.contrast.color")};
}

.p-button-link {
    background: transparent;
    border-color: transparent;
    color: ${t("button.link.color")};
}

.p-button-link:not(:disabled):hover {
    background: transparent;
    border-color: transparent;
    color: ${t("button.link.hover.color")};
}

.p-button-link:not(:disabled):hover .p-button-label {
    text-decoration: underline;
}

.p-button-link:not(:disabled):active {
    background: transparent;
    border-color: transparent;
    color: ${t("button.link.active.color")};
}

/* For PrimeNG */
.p-button-icon-right {
    order: 1;
}

p-button[iconpos='right'] spinnericon {
    order: 1;
}
`,Ma={root:({instance:t,props:n})=>["p-button p-component",{"p-button-icon-only":t.hasIcon&&!n.label&&!n.badge,"p-button-vertical":(n.iconPos==="top"||n.iconPos==="bottom")&&n.label,"p-button-loading":n.loading,"p-button-link":n.link,[`p-button-${n.severity}`]:n.severity,"p-button-raised":n.raised,"p-button-rounded":n.rounded,"p-button-text":n.text,"p-button-outlined":n.outlined,"p-button-sm":n.size==="small","p-button-lg":n.size==="large","p-button-plain":n.plain,"p-button-fluid":n.fluid}],loadingIcon:"p-button-loading-icon",icon:({props:t})=>["p-button-icon",{[`p-button-icon-${t.iconPos}`]:t.label}],label:"p-button-label"},Jr=(()=>{class t extends B{name="button";theme=Oa;classes=Ma;static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Ra=(()=>{class t extends re{type="button";iconPos="left";icon;badge;label;disabled;loading=!1;loadingIcon;raised=!1;rounded=!1;text=!1;plain=!1;severity;outlined=!1;link=!1;tabindex;size;variant;style;styleClass;badgeClass;badgeSeverity="secondary";ariaLabel;autofocus;fluid;onClick=new ae;onFocus=new ae;onBlur=new ae;contentTemplate;loadingIconTemplate;iconTemplate;_buttonProps;get buttonProps(){return this._buttonProps}set buttonProps(e){this._buttonProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([i,r])=>this[`_${i}`]!==r&&(this[`_${i}`]=r))}get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return z(this.fluid)?!!i:this.fluid}_componentStyle=m(Jr);templates;_contentTemplate;_iconTemplate;_loadingIconTemplate;ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}ngOnChanges(e){super.ngOnChanges(e);let{buttonProps:i}=e;if(i){let r=i.currentValue;for(let o in r)this[o]=r[o]}}spinnerIconClass(){return Object.entries(this.iconClass()).filter(([,e])=>!!e).reduce((e,[i])=>e+` ${i}`,"p-button-loading-icon")}iconClass(){return{[`p-button-loading-icon pi-spin ${this.loadingIcon??""}`]:this.loading,"p-button-icon":!0,"p-button-icon-left":this.iconPos==="left"&&this.label,"p-button-icon-right":this.iconPos==="right"&&this.label,"p-button-icon-top":this.iconPos==="top"&&this.label,"p-button-icon-bottom":this.iconPos==="bottom"&&this.label}}get buttonClass(){return{"p-button p-component":!0,"p-button-icon-only":(this.icon||this.iconTemplate||this._iconTemplate||this.loadingIcon||this.loadingIconTemplate||this._loadingIconTemplate)&&!this.label,"p-button-vertical":(this.iconPos==="top"||this.iconPos==="bottom")&&this.label,"p-button-loading":this.loading,"p-button-loading-label-only":this.loading&&!this.icon&&this.label&&!this.loadingIcon&&this.iconPos==="left","p-button-link":this.link,[`p-button-${this.severity}`]:this.severity,"p-button-raised":this.raised,"p-button-rounded":this.rounded,"p-button-text":this.text||this.variant=="text","p-button-outlined":this.outlined||this.variant=="outlined","p-button-sm":this.size==="small","p-button-lg":this.size==="large","p-button-plain":this.plain,"p-button-fluid":this.hasFluid,[`${this.styleClass}`]:this.styleClass}}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275cmp=W({type:t,selectors:[["p-button"]],contentQueries:function(i,r,o){if(i&1&&(ht(o,fa,5),ht(o,pa,5),ht(o,ga,5),ht(o,Pr,4)),i&2){let s;ft(s=pt())&&(r.contentTemplate=s.first),ft(s=pt())&&(r.loadingIconTemplate=s.first),ft(s=pt())&&(r.iconTemplate=s.first),ft(s=pt())&&(r.templates=s)}},inputs:{type:"type",iconPos:"iconPos",icon:"icon",badge:"badge",label:"label",disabled:[2,"disabled","disabled",R],loading:[2,"loading","loading",R],loadingIcon:"loadingIcon",raised:[2,"raised","raised",R],rounded:[2,"rounded","rounded",R],text:[2,"text","text",R],plain:[2,"plain","plain",R],severity:"severity",outlined:[2,"outlined","outlined",R],link:[2,"link","link",R],tabindex:[2,"tabindex","tabindex",Hn],size:"size",variant:"variant",style:"style",styleClass:"styleClass",badgeClass:"badgeClass",badgeSeverity:"badgeSeverity",ariaLabel:"ariaLabel",autofocus:[2,"autofocus","autofocus",R],fluid:[2,"fluid","fluid",R],buttonProps:"buttonProps"},outputs:{onClick:"onClick",onFocus:"onFocus",onBlur:"onBlur"},features:[M([Jr]),E,ee],ngContentSelectors:ma,decls:7,vars:14,consts:[["pRipple","",3,"click","focus","blur","ngStyle","disabled","ngClass","pAutoFocus"],[4,"ngTemplateOutlet"],[4,"ngIf"],["class","p-button-label",4,"ngIf"],[3,"value","severity",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngClass",4,"ngIf"],[3,"styleClass","spin",4,"ngIf"],[3,"ngClass"],[3,"styleClass","spin"],[3,"ngIf"],[3,"class","ngClass",4,"ngIf"],[1,"p-button-label"],[3,"value","severity"]],template:function(i,r){i&1&&($e(),Fe(0,"button",0),me("click",function(s){return r.onClick.emit(s)})("focus",function(s){return r.onFocus.emit(s)})("blur",function(s){return r.onBlur.emit(s)}),Ve(1),ke(2,ya,1,0,"ng-container",1)(3,Ea,3,5,"ng-container",2)(4,Fa,3,5,"ng-container",2)(5,Ta,2,3,"span",3)(6,Ia,1,2,"p-badge",4),Te()),i&2&&(x("ngStyle",r.style)("disabled",r.disabled||r.loading)("ngClass",r.buttonClass)("pAutoFocus",r.autofocus),ne("type",r.type)("aria-label",r.ariaLabel)("data-pc-name","button")("data-pc-section","root")("tabindex",r.tabindex),V(2),x("ngTemplateOutlet",r.contentTemplate||r._contentTemplate),V(),x("ngIf",r.loading),V(),x("ngIf",!r.loading),V(),x("ngIf",!r.contentTemplate&&!r._contentTemplate&&r.label),V(),x("ngIf",!r.contentTemplate&&!r._contentTemplate&&r.badge))},dependencies:[Me,Yn,Zn,Jn,Xn,Xr,Wr,Yr,qr,gi,xe],encapsulation:2,changeDetection:0})}return t})(),Hf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[Me,Ra,xe,xe]})}return t})();var uo=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(i){return new(i||t)(p(le),p(G))};static \u0275dir=_({type:t})}return t})(),_i=(()=>{class t extends uo{static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275dir=_({type:t,features:[E]})}return t})(),et=new I("");var xa={provide:et,useExisting:pe(()=>co),multi:!0};function Na(){let t=Be()?Be().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var La=new I(""),co=(()=>{class t extends uo{_compositionMode;_composing=!1;constructor(e,i,r){super(e,i),this._compositionMode=r,this._compositionMode==null&&(this._compositionMode=!Na())}writeValue(e){let i=e??"";this.setProperty("value",i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(i){return new(i||t)(p(le),p(G),p(La,8))};static \u0275dir=_({type:t,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(i,r){i&1&&me("input",function(s){return r._handleInput(s.target.value)})("blur",function(){return r.onTouched()})("compositionstart",function(){return r._compositionStart()})("compositionend",function(s){return r._compositionEnd(s.target.value)})},standalone:!1,features:[M([xa]),E]})}return t})();function Ci(t){return t==null||Ei(t)===0}function Ei(t){return t==null?null:Array.isArray(t)||typeof t=="string"?t.length:t instanceof Set?t.size:null}var tt=new I(""),nt=new I(""),Pa=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,eo=class{static min(n){return ka(n)}static max(n){return $a(n)}static required(n){return Va(n)}static requiredTrue(n){return Ba(n)}static email(n){return Ua(n)}static minLength(n){return ja(n)}static maxLength(n){return Ha(n)}static pattern(n){return za(n)}static nullValidator(n){return ho()}static compose(n){return bo(n)}static composeAsync(n){return Do(n)}};function ka(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e<t?{min:{min:t,actual:n.value}}:null}}function $a(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e>t?{max:{max:t,actual:n.value}}:null}}function Va(t){return Ci(t.value)?{required:!0}:null}function Ba(t){return t.value===!0?null:{required:!0}}function Ua(t){return Ci(t.value)||Pa.test(t.value)?null:{email:!0}}function ja(t){return n=>{let e=n.value?.length??Ei(n.value);return e===null||e===0?null:e<t?{minlength:{requiredLength:t,actualLength:e}}:null}}function Ha(t){return n=>{let e=n.value?.length??Ei(n.value);return e!==null&&e>t?{maxlength:{requiredLength:t,actualLength:e}}:null}}function za(t){if(!t)return ho;let n,e;return typeof t=="string"?(e="",t.charAt(0)!=="^"&&(e+="^"),e+=t,t.charAt(t.length-1)!=="$"&&(e+="$"),n=new RegExp(e)):(e=t.toString(),n=t),i=>{if(Ci(i.value))return null;let r=i.value;return n.test(r)?null:{pattern:{requiredPattern:e,actualValue:r}}}}function ho(t){return null}function fo(t){return t!=null}function po(t){return Vn(t)?zt(t):t}function go(t){let n={};return t.forEach(e=>{n=e!=null?D(D({},n),e):n}),Object.keys(n).length===0?null:n}function mo(t,n){return n.map(e=>e(t))}function Ga(t){return!t.validate}function yo(t){return t.map(n=>Ga(n)?n:e=>n.validate(e))}function bo(t){if(!t)return null;let n=t.filter(fo);return n.length==0?null:function(e){return go(mo(e,n))}}function vo(t){return t!=null?bo(yo(t)):null}function Do(t){if(!t)return null;let n=t.filter(fo);return n.length==0?null:function(e){let i=mo(e,n).map(po);return Ui(i).pipe(Le(go))}}function _o(t){return t!=null?Do(yo(t)):null}function to(t,n){return t===null?[n]:Array.isArray(t)?[...t,n]:[t,n]}function Co(t){return t._rawValidators}function Eo(t){return t._rawAsyncValidators}function mi(t){return t?Array.isArray(t)?t:[t]:[]}function mn(t,n){return Array.isArray(t)?t.includes(n):t===n}function no(t,n){let e=mi(n);return mi(t).forEach(r=>{mn(e,r)||e.push(r)}),e}function io(t,n){return mi(n).filter(e=>!mn(t,e))}var yn=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=vo(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=_o(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control&&this.control.reset(n)}hasError(n,e){return this.control?this.control.hasError(n,e):!1}getError(n,e){return this.control?this.control.getError(n,e):null}},Z=class extends yn{name;get formDirective(){return null}get path(){return null}},ve=class extends yn{_parent=null;name=null;valueAccessor=null},bn=class{_cd;constructor(n){this._cd=n}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},Wa={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},sp=Q(D({},Wa),{"[class.ng-submitted]":"isSubmitted"}),ap=(()=>{class t extends bn{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(p(ve,2))};static \u0275dir=_({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(i,r){i&2&&He("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)},standalone:!1,features:[E]})}return t})(),lp=(()=>{class t extends bn{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(p(Z,10))};static \u0275dir=_({type:t,selectors:[["","formGroupName",""],["","formArrayName",""],["","ngModelGroup",""],["","formGroup",""],["form",3,"ngNoForm",""],["","ngForm",""]],hostVars:16,hostBindings:function(i,r){i&2&&He("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)("ng-submitted",r.isSubmitted)},standalone:!1,features:[E]})}return t})();var Ct="VALID",gn="INVALID",Xe="PENDING",Et="DISABLED",Ne=class{},vn=class extends Ne{value;source;constructor(n,e){super(),this.value=n,this.source=e}},wt=class extends Ne{pristine;source;constructor(n,e){super(),this.pristine=n,this.source=e}},St=class extends Ne{touched;source;constructor(n,e){super(),this.touched=n,this.source=e}},Je=class extends Ne{status;source;constructor(n,e){super(),this.status=n,this.source=e}},yi=class extends Ne{source;constructor(n){super(),this.source=n}},bi=class extends Ne{source;constructor(n){super(),this.source=n}};function wi(t){return(Sn(t)?t.validators:t)||null}function Ka(t){return Array.isArray(t)?vo(t):t||null}function Si(t,n){return(Sn(n)?n.asyncValidators:t)||null}function qa(t){return Array.isArray(t)?_o(t):t||null}function Sn(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}function wo(t,n,e){let i=t.controls;if(!(n?Object.keys(i):i).length)throw new U(1e3,"");if(!i[e])throw new U(1001,"")}function So(t,n,e){t._forEachChild((i,r)=>{if(e[r]===void 0)throw new U(1002,"")})}var Qe=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,e){this._assignValidators(n),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return ce(this.statusReactive)}set status(n){ce(()=>this.statusReactive.set(n))}_status=Ie(()=>this.statusReactive());statusReactive=te(void 0);get valid(){return this.status===Ct}get invalid(){return this.status===gn}get pending(){return this.status==Xe}get disabled(){return this.status===Et}get enabled(){return this.status!==Et}errors;get pristine(){return ce(this.pristineReactive)}set pristine(n){ce(()=>this.pristineReactive.set(n))}_pristine=Ie(()=>this.pristineReactive());pristineReactive=te(!0);get dirty(){return!this.pristine}get touched(){return ce(this.touchedReactive)}set touched(n){ce(()=>this.touchedReactive.set(n))}_touched=Ie(()=>this.touchedReactive());touchedReactive=te(!1);get untouched(){return!this.touched}_events=new we;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(no(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(no(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(io(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(io(n,this._rawAsyncValidators))}hasValidator(n){return mn(this._rawValidators,n)}hasAsyncValidator(n){return mn(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let e=this.touched===!1;this.touched=!0;let i=n.sourceControl??this;this._parent&&!n.onlySelf&&this._parent.markAsTouched(Q(D({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new St(!0,i))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(n))}markAsUntouched(n={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=n.sourceControl??this;this._forEachChild(r=>{r.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:i})}),this._parent&&!n.onlySelf&&this._parent._updateTouched(n,i),e&&n.emitEvent!==!1&&this._events.next(new St(!1,i))}markAsDirty(n={}){let e=this.pristine===!0;this.pristine=!1;let i=n.sourceControl??this;this._parent&&!n.onlySelf&&this._parent.markAsDirty(Q(D({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new wt(!1,i))}markAsPristine(n={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=n.sourceControl??this;this._forEachChild(r=>{r.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),this._parent&&!n.onlySelf&&this._parent._updatePristine(n,i),e&&n.emitEvent!==!1&&this._events.next(new wt(!0,i))}markAsPending(n={}){this.status=Xe;let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Je(this.status,e)),this.statusChanges.emit(this.status)),this._parent&&!n.onlySelf&&this._parent.markAsPending(Q(D({},n),{sourceControl:e}))}disable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Et,this.errors=null,this._forEachChild(r=>{r.disable(Q(D({},n),{onlySelf:!0}))}),this._updateValue();let i=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new vn(this.value,i)),this._events.next(new Je(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(Q(D({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!0))}enable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Ct,this._forEachChild(i=>{i.enable(Q(D({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(Q(D({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(n,e){this._parent&&!n.onlySelf&&(this._parent.updateValueAndValidity(n),n.skipPristineCheck||this._parent._updatePristine({},e),this._parent._updateTouched({},e))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Ct||this.status===Xe)&&this._runAsyncValidator(i,n.emitEvent)}let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new vn(this.value,e)),this._events.next(new Je(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!n.onlySelf&&this._parent.updateValueAndValidity(Q(D({},n),{sourceControl:e}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Et:Ct}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,e){if(this.asyncValidator){this.status=Xe,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1};let i=po(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(r=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(r,{emitEvent:e,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,e={}){this.errors=n,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(n){let e=n;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((i,r)=>i&&i._find(r),this)}getError(n,e){let i=e?this.get(e):this;return i&&i.errors?i.errors[n]:null}hasError(n,e){return!!this.getError(n,e)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,e,i){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||i)&&this._events.next(new Je(this.status,e)),this._parent&&this._parent._updateControlsErrors(n,e,i)}_initObservables(){this.valueChanges=new ae,this.statusChanges=new ae}_calculateStatus(){return this._allControlsDisabled()?Et:this.errors?gn:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Xe)?Xe:this._anyControlsHaveStatus(gn)?gn:Ct}_anyControlsHaveStatus(n){return this._anyControls(e=>e.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,e){let i=!this._anyControlsDirty(),r=this.pristine!==i;this.pristine=i,this._parent&&!n.onlySelf&&this._parent._updatePristine(n,e),r&&this._events.next(new wt(this.pristine,e))}_updateTouched(n={},e){this.touched=this._anyControlsTouched(),this._events.next(new St(this.touched,e)),this._parent&&!n.onlySelf&&this._parent._updateTouched(n,e)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){Sn(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){let e=this._parent&&this._parent.dirty;return!n&&!!e&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=Ka(this._rawValidators)}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=qa(this._rawAsyncValidators)}},Dn=class extends Qe{constructor(n,e,i){super(wi(e),Si(i,e)),this.controls=n,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(n,e){return this.controls[n]?this.controls[n]:(this.controls[n]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(n,e,i={}){this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(n,e={}){this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),delete this.controls[n],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(n,e,i={}){this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),delete this.controls[n],e&&this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(n){return this.controls.hasOwnProperty(n)&&this.controls[n].enabled}setValue(n,e={}){So(this,!0,n),Object.keys(n).forEach(i=>{wo(this,!0,i),this.controls[i].setValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)}patchValue(n,e={}){n!=null&&(Object.keys(n).forEach(i=>{let r=this.controls[i];r&&r.patchValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(n={},e={}){this._forEachChild((i,r)=>{i.reset(n?n[r]:null,{onlySelf:!0,emitEvent:e.emitEvent})}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e)}getRawValue(){return this._reduceChildren({},(n,e,i)=>(n[i]=e.getRawValue(),n))}_syncPendingControls(){let n=this._reduceChildren(!1,(e,i)=>i._syncPendingControls()?!0:e);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){Object.keys(this.controls).forEach(e=>{let i=this.controls[e];i&&n(i,e)})}_setUpControls(){this._forEachChild(n=>{n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(n){for(let[e,i]of Object.entries(this.controls))if(this.contains(e)&&n(i))return!0;return!1}_reduceValue(){let n={};return this._reduceChildren(n,(e,i,r)=>((i.enabled||this.disabled)&&(e[r]=i.value),e))}_reduceChildren(n,e){let i=n;return this._forEachChild((r,o)=>{i=e(i,r,o)}),i}_allControlsDisabled(){for(let n of Object.keys(this.controls))if(this.controls[n].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(n){return this.controls.hasOwnProperty(n)?this.controls[n]:null}};var vi=class extends Dn{};var Ft=new I("",{providedIn:"root",factory:()=>An}),An="always";function Fn(t,n){return[...n.path,t]}function _n(t,n,e=An){Ai(t,n),n.valueAccessor.writeValue(t.value),(t.disabled||e==="always")&&n.valueAccessor.setDisabledState?.(t.disabled),Za(t,n),Ja(t,n),Xa(t,n),Ya(t,n)}function Cn(t,n,e=!0){let i=()=>{};n.valueAccessor&&(n.valueAccessor.registerOnChange(i),n.valueAccessor.registerOnTouched(i)),wn(t,n),t&&(n._invokeOnDestroyCallbacks(),t._registerOnCollectionChange(()=>{}))}function En(t,n){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(n)})}function Ya(t,n){if(n.valueAccessor.setDisabledState){let e=i=>{n.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(e),n._registerOnDestroy(()=>{t._unregisterOnDisabledChange(e)})}}function Ai(t,n){let e=Co(t);n.validator!==null?t.setValidators(to(e,n.validator)):typeof e=="function"&&t.setValidators([e]);let i=Eo(t);n.asyncValidator!==null?t.setAsyncValidators(to(i,n.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let r=()=>t.updateValueAndValidity();En(n._rawValidators,r),En(n._rawAsyncValidators,r)}function wn(t,n){let e=!1;if(t!==null){if(n.validator!==null){let r=Co(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==n.validator);o.length!==r.length&&(e=!0,t.setValidators(o))}}if(n.asyncValidator!==null){let r=Eo(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==n.asyncValidator);o.length!==r.length&&(e=!0,t.setAsyncValidators(o))}}}let i=()=>{};return En(n._rawValidators,i),En(n._rawAsyncValidators,i),e}function Za(t,n){n.valueAccessor.registerOnChange(e=>{t._pendingValue=e,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&Ao(t,n)})}function Xa(t,n){n.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&Ao(t,n),t.updateOn!=="submit"&&t.markAsTouched()})}function Ao(t,n){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),n.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function Ja(t,n){let e=(i,r)=>{n.valueAccessor.writeValue(i),r&&n.viewToModelUpdate(i)};t.registerOnChange(e),n._registerOnDestroy(()=>{t._unregisterOnChange(e)})}function Qa(t,n){t==null,Ai(t,n)}function el(t,n){return wn(t,n)}function Fi(t,n){if(!t.hasOwnProperty("model"))return!1;let e=t.model;return e.isFirstChange()?!0:!Object.is(n,e.currentValue)}function tl(t){return Object.getPrototypeOf(t.constructor)===_i}function nl(t,n){t._syncPendingControls(),n.forEach(e=>{let i=e.control;i.updateOn==="submit"&&i._pendingChange&&(e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function Ti(t,n){if(!n)return null;Array.isArray(n);let e,i,r;return n.forEach(o=>{o.constructor===co?e=o:tl(o)?i=o:r=o}),r||i||e||null}function il(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function ro(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function oo(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var At=class extends Qe{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,e,i){super(wi(e),Si(i,e)),this._applyFormState(n),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Sn(e)&&(e.nonNullable||e.initialValueIsDefault)&&(oo(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,e={}){this.value=this._pendingValue=n,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)}patchValue(n,e={}){this.setValue(n,e)}reset(n=this.defaultValue,e={}){this._applyFormState(n),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),this._pendingChange=!1}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){ro(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){ro(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){oo(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}};var rl=t=>t instanceof At,ol=(()=>{class t extends Z{_parent;ngOnInit(){this._checkParentType(),this.formDirective.addFormGroup(this)}ngOnDestroy(){this.formDirective&&this.formDirective.removeFormGroup(this)}get control(){return this.formDirective.getFormGroup(this)}get path(){return Fn(this.name==null?this.name:this.name.toString(),this._parent)}get formDirective(){return this._parent?this._parent.formDirective:null}_checkParentType(){}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275dir=_({type:t,standalone:!1,features:[E]})}return t})();var sl={provide:ve,useExisting:pe(()=>Ii)},so=Promise.resolve(),Ii=(()=>{class t extends ve{_changeDetectorRef;callSetDisabledState;control=new At;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new ae;constructor(e,i,r,o,s,a){super(),this._changeDetectorRef=s,this.callSetDisabledState=a,this._parent=e,this._setValidators(i),this._setAsyncValidators(r),this.valueAccessor=Ti(this,o)}ngOnChanges(e){if(this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let i=e.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),Fi(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){_n(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){so.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let i=e.isDisabled.currentValue,r=i!==0&&R(i);so.then(()=>{r&&!this.control.disabled?this.control.disable():!r&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?Fn(e,this._parent):[e]}static \u0275fac=function(i){return new(i||t)(p(Z,9),p(tt,10),p(nt,10),p(et,10),p(ze,8),p(Ft,8))};static \u0275dir=_({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[M([sl]),E,ee]})}return t})();var cp=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=_({type:t,selectors:[["form",3,"ngNoForm","",3,"ngNativeValidate",""]],hostAttrs:["novalidate",""],standalone:!1})}return t})();var Oi=new I(""),al={provide:ve,useExisting:pe(()=>ll)},ll=(()=>{class t extends ve{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(e){}model;update=new ae;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,i,r,o,s){super(),this._ngModelWarningConfig=o,this.callSetDisabledState=s,this._setValidators(e),this._setAsyncValidators(i),this.valueAccessor=Ti(this,r)}ngOnChanges(e){if(this._isControlChanged(e)){let i=e.form.previousValue;i&&Cn(i,this,!1),_n(this.form,this,this.callSetDisabledState),this.form.updateValueAndValidity({emitEvent:!1})}Fi(e,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&Cn(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_isControlChanged(e){return e.hasOwnProperty("form")}static \u0275fac=function(i){return new(i||t)(p(tt,10),p(nt,10),p(et,10),p(Oi,8),p(Ft,8))};static \u0275dir=_({type:t,selectors:[["","formControl",""]],inputs:{form:[0,"formControl","form"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},exportAs:["ngForm"],standalone:!1,features:[M([al]),E,ee]})}return t})(),ul={provide:Z,useExisting:pe(()=>Fo)},Fo=(()=>{class t extends Z{callSetDisabledState;get submitted(){return ce(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=Ie(()=>this._submittedReactive());_submittedReactive=te(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];form=null;ngSubmit=new ae;constructor(e,i,r){super(),this.callSetDisabledState=r,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){e.hasOwnProperty("form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}ngOnDestroy(){this.form&&(wn(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get control(){return this.form}get path(){return[]}addControl(e){let i=this.form.get(e.path);return _n(i,e,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),i}getControl(e){return this.form.get(e.path)}removeControl(e){Cn(e.control||null,e,!1),il(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}getFormArray(e){return this.form.get(e.path)}updateModel(e,i){this.form.get(e.path).setValue(i)}onSubmit(e){return this._submittedReactive.set(!0),nl(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new yi(this.control)),e?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this._submittedReactive.set(!1),this.form._events.next(new bi(this.form))}_updateDomValue(){this.directives.forEach(e=>{let i=e.control,r=this.form.get(e.path);i!==r&&(Cn(i||null,e),rl(r)&&(_n(r,e,this.callSetDisabledState),e.control=r))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let i=this.form.get(e.path);Qa(i,e),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){if(this.form){let i=this.form.get(e.path);i&&el(i,e)&&i.updateValueAndValidity({emitEvent:!1})}}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm&&this._oldForm._registerOnCollectionChange(()=>{})}_updateValidators(){Ai(this.form,this),this._oldForm&&wn(this._oldForm,this)}static \u0275fac=function(i){return new(i||t)(p(tt,10),p(nt,10),p(Ft,8))};static \u0275dir=_({type:t,selectors:[["","formGroup",""]],hostBindings:function(i,r){i&1&&me("submit",function(s){return r.onSubmit(s)})("reset",function(){return r.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[M([ul]),E,ee]})}return t})(),cl={provide:Z,useExisting:pe(()=>To)},To=(()=>{class t extends ol{name=null;constructor(e,i,r){super(),this._parent=e,this._setValidators(i),this._setAsyncValidators(r)}_checkParentType(){Oo(this._parent)}static \u0275fac=function(i){return new(i||t)(p(Z,13),p(tt,10),p(nt,10))};static \u0275dir=_({type:t,selectors:[["","formGroupName",""]],inputs:{name:[0,"formGroupName","name"]},standalone:!1,features:[M([cl]),E]})}return t})(),dl={provide:Z,useExisting:pe(()=>Io)},Io=(()=>{class t extends Z{_parent;name=null;constructor(e,i,r){super(),this._parent=e,this._setValidators(i),this._setAsyncValidators(r)}ngOnInit(){Oo(this._parent),this.formDirective.addFormArray(this)}ngOnDestroy(){this.formDirective?.removeFormArray(this)}get control(){return this.formDirective.getFormArray(this)}get formDirective(){return this._parent?this._parent.formDirective:null}get path(){return Fn(this.name==null?this.name:this.name.toString(),this._parent)}static \u0275fac=function(i){return new(i||t)(p(Z,13),p(tt,10),p(nt,10))};static \u0275dir=_({type:t,selectors:[["","formArrayName",""]],inputs:{name:[0,"formArrayName","name"]},standalone:!1,features:[M([dl]),E]})}return t})();function Oo(t){return!(t instanceof To)&&!(t instanceof Fo)&&!(t instanceof Io)}var hl={provide:ve,useExisting:pe(()=>fl)},fl=(()=>{class t extends ve{_ngModelWarningConfig;_added=!1;viewModel;control;name=null;set isDisabled(e){}model;update=new ae;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,i,r,o,s){super(),this._ngModelWarningConfig=s,this._parent=e,this._setValidators(i),this._setAsyncValidators(r),this.valueAccessor=Ti(this,o)}ngOnChanges(e){this._added||this._setUpControl(),Fi(e,this.viewModel)&&(this.viewModel=this.model,this.formDirective.updateModel(this,this.model))}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}get path(){return Fn(this.name==null?this.name:this.name.toString(),this._parent)}get formDirective(){return this._parent?this._parent.formDirective:null}_setUpControl(){this.control=this.formDirective.addControl(this),this._added=!0}static \u0275fac=function(i){return new(i||t)(p(Z,13),p(tt,10),p(nt,10),p(et,10),p(Oi,8))};static \u0275dir=_({type:t,selectors:[["","formControlName",""]],inputs:{name:[0,"formControlName","name"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},standalone:!1,features:[M([hl]),E,ee]})}return t})();var pl={provide:et,useExisting:pe(()=>Ro),multi:!0};function Mo(t,n){return t==null?`${n}`:(n&&typeof n=="object"&&(n="Object"),`${t}: ${n}`.slice(0,50))}function gl(t){return t.split(":")[0]}var Ro=(()=>{class t extends _i{value;_optionMap=new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;writeValue(e){this.value=e;let i=this._getOptionId(e),r=Mo(i,e);this.setProperty("value",r)}registerOnChange(e){this.onChange=i=>{this.value=this._getOptionValue(i),e(this.value)}}_registerOption(){return(this._idCounter++).toString()}_getOptionId(e){for(let i of this._optionMap.keys())if(this._compareWith(this._optionMap.get(i),e))return i;return null}_getOptionValue(e){let i=gl(e);return this._optionMap.has(i)?this._optionMap.get(i):e}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["select","formControlName","",3,"multiple",""],["select","formControl","",3,"multiple",""],["select","ngModel","",3,"multiple",""]],hostBindings:function(i,r){i&1&&me("change",function(s){return r.onChange(s.target.value)})("blur",function(){return r.onTouched()})},inputs:{compareWith:"compareWith"},standalone:!1,features:[M([pl]),E]})}return t})(),dp=(()=>{class t{_element;_renderer;_select;id;constructor(e,i,r){this._element=e,this._renderer=i,this._select=r,this._select&&(this.id=this._select._registerOption())}set ngValue(e){this._select!=null&&(this._select._optionMap.set(this.id,e),this._setElementValue(Mo(this.id,e)),this._select.writeValue(this._select.value))}set value(e){this._setElementValue(e),this._select&&this._select.writeValue(this._select.value)}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,"value",e)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static \u0275fac=function(i){return new(i||t)(p(G),p(le),p(Ro,9))};static \u0275dir=_({type:t,selectors:[["option"]],inputs:{ngValue:"ngValue",value:"value"},standalone:!1})}return t})(),ml={provide:et,useExisting:pe(()=>xo),multi:!0};function ao(t,n){return t==null?`${n}`:(typeof n=="string"&&(n=`'${n}'`),n&&typeof n=="object"&&(n="Object"),`${t}: ${n}`.slice(0,50))}function yl(t){return t.split(":")[0]}var xo=(()=>{class t extends _i{value;_optionMap=new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;writeValue(e){this.value=e;let i;if(Array.isArray(e)){let r=e.map(o=>this._getOptionId(o));i=(o,s)=>{o._setSelected(r.indexOf(s.toString())>-1)}}else i=(r,o)=>{r._setSelected(!1)};this._optionMap.forEach(i)}registerOnChange(e){this.onChange=i=>{let r=[],o=i.selectedOptions;if(o!==void 0){let s=o;for(let a=0;a<s.length;a++){let l=s[a],u=this._getOptionValue(l.value);r.push(u)}}else{let s=i.options;for(let a=0;a<s.length;a++){let l=s[a];if(l.selected){let u=this._getOptionValue(l.value);r.push(u)}}}this.value=r,e(r)}}_registerOption(e){let i=(this._idCounter++).toString();return this._optionMap.set(i,e),i}_getOptionId(e){for(let i of this._optionMap.keys())if(this._compareWith(this._optionMap.get(i)._value,e))return i;return null}_getOptionValue(e){let i=yl(e);return this._optionMap.has(i)?this._optionMap.get(i)._value:e}static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["select","multiple","","formControlName",""],["select","multiple","","formControl",""],["select","multiple","","ngModel",""]],hostBindings:function(i,r){i&1&&me("change",function(s){return r.onChange(s.target)})("blur",function(){return r.onTouched()})},inputs:{compareWith:"compareWith"},standalone:!1,features:[M([ml]),E]})}return t})(),hp=(()=>{class t{_element;_renderer;_select;id;_value;constructor(e,i,r){this._element=e,this._renderer=i,this._select=r,this._select&&(this.id=this._select._registerOption(this))}set ngValue(e){this._select!=null&&(this._value=e,this._setElementValue(ao(this.id,e)),this._select.writeValue(this._select.value))}set value(e){this._select?(this._value=e,this._setElementValue(ao(this.id,e)),this._select.writeValue(this._select.value)):this._setElementValue(e)}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,"value",e)}_setSelected(e){this._renderer.setProperty(this._element.nativeElement,"selected",e)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static \u0275fac=function(i){return new(i||t)(p(G),p(le),p(xo,9))};static \u0275dir=_({type:t,selectors:[["option"]],inputs:{ngValue:"ngValue",value:"value"},standalone:!1})}return t})();var No=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})(),Di=class extends Qe{constructor(n,e,i){super(wi(e),Si(i,e)),this.controls=n,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;at(n){return this.controls[this._adjustIndex(n)]}push(n,e={}){this.controls.push(n),this._registerControl(n),this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}insert(n,e,i={}){this.controls.splice(n,0,e),this._registerControl(e),this.updateValueAndValidity({emitEvent:i.emitEvent})}removeAt(n,e={}){let i=this._adjustIndex(n);i<0&&(i=0),this.controls[i]&&this.controls[i]._registerOnCollectionChange(()=>{}),this.controls.splice(i,1),this.updateValueAndValidity({emitEvent:e.emitEvent})}setControl(n,e,i={}){let r=this._adjustIndex(n);r<0&&(r=0),this.controls[r]&&this.controls[r]._registerOnCollectionChange(()=>{}),this.controls.splice(r,1),e&&(this.controls.splice(r,0,e),this._registerControl(e)),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}get length(){return this.controls.length}setValue(n,e={}){So(this,!1,n),n.forEach((i,r)=>{wo(this,!1,r),this.at(r).setValue(i,{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)}patchValue(n,e={}){n!=null&&(n.forEach((i,r)=>{this.at(r)&&this.at(r).patchValue(i,{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(n=[],e={}){this._forEachChild((i,r)=>{i.reset(n[r],{onlySelf:!0,emitEvent:e.emitEvent})}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e)}getRawValue(){return this.controls.map(n=>n.getRawValue())}clear(n={}){this.controls.length<1||(this._forEachChild(e=>e._registerOnCollectionChange(()=>{})),this.controls.splice(0),this.updateValueAndValidity({emitEvent:n.emitEvent}))}_adjustIndex(n){return n<0?n+this.length:n}_syncPendingControls(){let n=this.controls.reduce((e,i)=>i._syncPendingControls()?!0:e,!1);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){this.controls.forEach((e,i)=>{n(e,i)})}_updateValue(){this.value=this.controls.filter(n=>n.enabled||this.disabled).map(n=>n.value)}_anyControls(n){return this.controls.some(e=>e.enabled&&n(e))}_setUpControls(){this._forEachChild(n=>this._registerControl(n))}_allControlsDisabled(){for(let n of this.controls)if(n.enabled)return!1;return this.controls.length>0||this.disabled}_registerControl(n){n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)}_find(n){return this.at(n)??null}};function lo(t){return!!t&&(t.asyncValidators!==void 0||t.validators!==void 0||t.updateOn!==void 0)}var fp=(()=>{class t{useNonNullable=!1;get nonNullable(){let e=new t;return e.useNonNullable=!0,e}group(e,i=null){let r=this._reduceControls(e),o={};return lo(i)?o=i:i!==null&&(o.validators=i.validator,o.asyncValidators=i.asyncValidator),new Dn(r,o)}record(e,i=null){let r=this._reduceControls(e);return new vi(r,i)}control(e,i,r){let o={};return this.useNonNullable?(lo(i)?o=i:(o.validators=i,o.asyncValidators=r),new At(e,Q(D({},o),{nonNullable:!0}))):new At(e,i,r)}array(e,i,r){let o=e.map(s=>this._createControl(s));return new Di(o,i,r)}_reduceControls(e){let i={};return Object.keys(e).forEach(r=>{i[r]=this._createControl(e[r])}),i}_createControl(e){if(e instanceof At)return e;if(e instanceof Qe)return e;if(Array.isArray(e)){let i=e[0],r=e.length>1?e[1]:null,o=e.length>2?e[2]:null;return this.control(i,r,o)}else return this.control(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var pp=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Ft,useValue:e.callSetDisabledState??An}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[No]})}return t})(),gp=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Oi,useValue:e.warnOnNgModelWithFormControl??"always"},{provide:Ft,useValue:e.callSetDisabledState??An}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[No]})}return t})();var vl=({dt:t})=>`
.p-inputtext {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${t("inputtext.color")};
    background: ${t("inputtext.background")};
    padding-block: ${t("inputtext.padding.y")};
    padding-inline: ${t("inputtext.padding.x")};
    border: 1px solid ${t("inputtext.border.color")};
    transition: background ${t("inputtext.transition.duration")}, color ${t("inputtext.transition.duration")}, border-color ${t("inputtext.transition.duration")}, outline-color ${t("inputtext.transition.duration")}, box-shadow ${t("inputtext.transition.duration")};
    appearance: none;
    border-radius: ${t("inputtext.border.radius")};
    outline-color: transparent;
    box-shadow: ${t("inputtext.shadow")};
}

.p-inputtext.ng-invalid.ng-dirty {
    border-color: ${t("inputtext.invalid.border.color")};
}

.p-inputtext:enabled:hover {
    border-color: ${t("inputtext.hover.border.color")};
}

.p-inputtext:enabled:focus {
    border-color: ${t("inputtext.focus.border.color")};
    box-shadow: ${t("inputtext.focus.ring.shadow")};
    outline: ${t("inputtext.focus.ring.width")} ${t("inputtext.focus.ring.style")} ${t("inputtext.focus.ring.color")};
    outline-offset: ${t("inputtext.focus.ring.offset")};
}

.p-inputtext.p-invalid {
    border-color: ${t("inputtext.invalid.border.color")};
}

.p-inputtext.p-variant-filled {
    background: ${t("inputtext.filled.background")};
}
    
.p-inputtext.p-variant-filled:enabled:hover {
    background: ${t("inputtext.filled.hover.background")};
}

.p-inputtext.p-variant-filled:enabled:focus {
    background: ${t("inputtext.filled.focus.background")};
}

.p-inputtext:disabled {
    opacity: 1;
    background: ${t("inputtext.disabled.background")};
    color: ${t("inputtext.disabled.color")};
}

.p-inputtext::placeholder {
    color: ${t("inputtext.placeholder.color")};
}

.p-inputtext.ng-invalid.ng-dirty::placeholder {
    color: ${t("inputtext.invalid.placeholder.color")};
}

.p-inputtext-sm {
    font-size: ${t("inputtext.sm.font.size")};
    padding-block: ${t("inputtext.sm.padding.y")};
    padding-inline: ${t("inputtext.sm.padding.x")};
}

.p-inputtext-lg {
    font-size: ${t("inputtext.lg.font.size")};
    padding-block: ${t("inputtext.lg.padding.y")};
    padding-inline: ${t("inputtext.lg.padding.x")};
}

.p-inputtext-fluid {
    width: 100%;
}
`,Dl={root:({instance:t,props:n})=>["p-inputtext p-component",{"p-filled":t.filled,"p-inputtext-sm":n.size==="small","p-inputtext-lg":n.size==="large","p-invalid":n.invalid,"p-variant-filled":n.variant==="filled","p-inputtext-fluid":n.fluid}]},Lo=(()=>{class t extends B{name="inputtext";theme=vl;classes=Dl;static \u0275fac=(()=>{let e;return function(r){return(e||(e=A(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Fp=(()=>{class t extends re{ngModel;variant;fluid;pSize;filled;_componentStyle=m(Lo);get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return z(this.fluid)?!!i:this.fluid}constructor(e){super(),this.ngModel=e}ngAfterViewInit(){super.ngAfterViewInit(),this.updateFilledState(),this.cd.detectChanges()}ngDoCheck(){this.updateFilledState()}onInput(){this.updateFilledState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length||this.ngModel&&this.ngModel.model}static \u0275fac=function(i){return new(i||t)(p(Ii,8))};static \u0275dir=_({type:t,selectors:[["","pInputText",""]],hostAttrs:[1,"p-inputtext","p-component"],hostVars:14,hostBindings:function(i,r){if(i&1&&me("input",function(s){return r.onInput(s)}),i&2){let o;He("p-filled",r.filled)("p-variant-filled",((o=r.variant)!==null&&o!==void 0?o:r.config.inputStyle()||r.config.inputVariant())==="filled")("p-inputtext-fluid",r.hasFluid)("p-inputtext-sm",r.pSize==="small")("p-inputfield-sm",r.pSize==="small")("p-inputtext-lg",r.pSize==="large")("p-inputfield-lg",r.pSize==="large")}},inputs:{variant:"variant",fluid:[2,"fluid","fluid",R],pSize:"pSize"},features:[M([Lo]),E]})}return t})(),Tp=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();var rt=class{},ot=class{},X=class t{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(n){n?typeof n=="string"?this.lazyInit=()=>{this.headers=new Map,n.split(`
`).forEach(e=>{let i=e.indexOf(":");if(i>0){let r=e.slice(0,i),o=e.slice(i+1).trim();this.addHeaderEntry(r,o)}})}:typeof Headers<"u"&&n instanceof Headers?(this.headers=new Map,n.forEach((e,i)=>{this.addHeaderEntry(i,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(n).forEach(([e,i])=>{this.setHeaderEntries(e,i)})}:this.headers=new Map}has(n){return this.init(),this.headers.has(n.toLowerCase())}get(n){this.init();let e=this.headers.get(n.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(n){return this.init(),this.headers.get(n.toLowerCase())||null}append(n,e){return this.clone({name:n,value:e,op:"a"})}set(n,e){return this.clone({name:n,value:e,op:"s"})}delete(n,e){return this.clone({name:n,value:e,op:"d"})}maybeSetNormalizedName(n,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,n)}init(){this.lazyInit&&(this.lazyInit instanceof t?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(n=>this.applyUpdate(n)),this.lazyUpdate=null))}copyFrom(n){n.init(),Array.from(n.headers.keys()).forEach(e=>{this.headers.set(e,n.headers.get(e)),this.normalizedNames.set(e,n.normalizedNames.get(e))})}clone(n){let e=new t;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof t?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([n]),e}applyUpdate(n){let e=n.name.toLowerCase();switch(n.op){case"a":case"s":let i=n.value;if(typeof i=="string"&&(i=[i]),i.length===0)return;this.maybeSetNormalizedName(n.name,e);let r=(n.op==="a"?this.headers.get(e):void 0)||[];r.push(...i),this.headers.set(e,r);break;case"d":let o=n.value;if(!o)this.headers.delete(e),this.normalizedNames.delete(e);else{let s=this.headers.get(e);if(!s)return;s=s.filter(a=>o.indexOf(a)===-1),s.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,s)}break}}addHeaderEntry(n,e){let i=n.toLowerCase();this.maybeSetNormalizedName(n,i),this.headers.has(i)?this.headers.get(i).push(e):this.headers.set(i,[e])}setHeaderEntries(n,e){let i=(Array.isArray(e)?e:[e]).map(o=>o.toString()),r=n.toLowerCase();this.headers.set(r,i),this.maybeSetNormalizedName(n,r)}forEach(n){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>n(this.normalizedNames.get(e),this.headers.get(e)))}};var On=class{encodeKey(n){return Po(n)}encodeValue(n){return Po(n)}decodeKey(n){return decodeURIComponent(n)}decodeValue(n){return decodeURIComponent(n)}};function _l(t,n){let e=new Map;return t.length>0&&t.replace(/^\?/,"").split("&").forEach(r=>{let o=r.indexOf("="),[s,a]=o==-1?[n.decodeKey(r),""]:[n.decodeKey(r.slice(0,o)),n.decodeValue(r.slice(o+1))],l=e.get(s)||[];l.push(a),e.set(s,l)}),e}var Cl=/%(\d[a-f0-9])/gi,El={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function Po(t){return encodeURIComponent(t).replace(Cl,(n,e)=>El[e]??n)}function Tn(t){return`${t}`}var oe=class t{map;encoder;updates=null;cloneFrom=null;constructor(n={}){if(this.encoder=n.encoder||new On,n.fromString){if(n.fromObject)throw new U(2805,!1);this.map=_l(n.fromString,this.encoder)}else n.fromObject?(this.map=new Map,Object.keys(n.fromObject).forEach(e=>{let i=n.fromObject[e],r=Array.isArray(i)?i.map(Tn):[Tn(i)];this.map.set(e,r)})):this.map=null}has(n){return this.init(),this.map.has(n)}get(n){this.init();let e=this.map.get(n);return e?e[0]:null}getAll(n){return this.init(),this.map.get(n)||null}keys(){return this.init(),Array.from(this.map.keys())}append(n,e){return this.clone({param:n,value:e,op:"a"})}appendAll(n){let e=[];return Object.keys(n).forEach(i=>{let r=n[i];Array.isArray(r)?r.forEach(o=>{e.push({param:i,value:o,op:"a"})}):e.push({param:i,value:r,op:"a"})}),this.clone(e)}set(n,e){return this.clone({param:n,value:e,op:"s"})}delete(n,e){return this.clone({param:n,value:e,op:"d"})}toString(){return this.init(),this.keys().map(n=>{let e=this.encoder.encodeKey(n);return this.map.get(n).map(i=>e+"="+this.encoder.encodeValue(i)).join("&")}).filter(n=>n!=="").join("&")}clone(n){let e=new t({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(n),e}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(n=>this.map.set(n,this.cloneFrom.map.get(n))),this.updates.forEach(n=>{switch(n.op){case"a":case"s":let e=(n.op==="a"?this.map.get(n.param):void 0)||[];e.push(Tn(n.value)),this.map.set(n.param,e);break;case"d":if(n.value!==void 0){let i=this.map.get(n.param)||[],r=i.indexOf(Tn(n.value));r!==-1&&i.splice(r,1),i.length>0?this.map.set(n.param,i):this.map.delete(n.param)}else{this.map.delete(n.param);break}}}),this.cloneFrom=this.updates=null)}};var Mn=class{map=new Map;set(n,e){return this.map.set(n,e),this}get(n){return this.map.has(n)||this.map.set(n,n.defaultValue()),this.map.get(n)}delete(n){return this.map.delete(n),this}has(n){return this.map.has(n)}keys(){return this.map.keys()}};function wl(t){switch(t){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function ko(t){return typeof ArrayBuffer<"u"&&t instanceof ArrayBuffer}function $o(t){return typeof Blob<"u"&&t instanceof Blob}function Vo(t){return typeof FormData<"u"&&t instanceof FormData}function Sl(t){return typeof URLSearchParams<"u"&&t instanceof URLSearchParams}var Tt="Content-Type",Rn="Accept",Li="X-Request-URL",Uo="text/plain",jo="application/json",Ho=`${jo}, ${Uo}, */*`,it=class t{url;body=null;headers;context;reportProgress=!1;withCredentials=!1;responseType="json";method;params;urlWithParams;transferCache;constructor(n,e,i,r){this.url=e,this.method=n.toUpperCase();let o;if(wl(this.method)||r?(this.body=i!==void 0?i:null,o=r):o=i,o&&(this.reportProgress=!!o.reportProgress,this.withCredentials=!!o.withCredentials,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),this.transferCache=o.transferCache),this.headers??=new X,this.context??=new Mn,!this.params)this.params=new oe,this.urlWithParams=e;else{let s=this.params.toString();if(s.length===0)this.urlWithParams=e;else{let a=e.indexOf("?"),l=a===-1?"?":a<e.length-1?"&":"";this.urlWithParams=e+l+s}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||ko(this.body)||$o(this.body)||Vo(this.body)||Sl(this.body)?this.body:this.body instanceof oe?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||Vo(this.body)?null:$o(this.body)?this.body.type||null:ko(this.body)?null:typeof this.body=="string"?Uo:this.body instanceof oe?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?jo:null}clone(n={}){let e=n.method||this.method,i=n.url||this.url,r=n.responseType||this.responseType,o=n.transferCache??this.transferCache,s=n.body!==void 0?n.body:this.body,a=n.withCredentials??this.withCredentials,l=n.reportProgress??this.reportProgress,u=n.headers||this.headers,c=n.params||this.params,d=n.context??this.context;return n.setHeaders!==void 0&&(u=Object.keys(n.setHeaders).reduce((f,h)=>f.set(h,n.setHeaders[h]),u)),n.setParams&&(c=Object.keys(n.setParams).reduce((f,h)=>f.set(h,n.setParams[h]),c)),new t(e,i,s,{params:c,headers:u,context:d,reportProgress:l,responseType:r,withCredentials:a,transferCache:o})}},_e=function(t){return t[t.Sent=0]="Sent",t[t.UploadProgress=1]="UploadProgress",t[t.ResponseHeader=2]="ResponseHeader",t[t.DownloadProgress=3]="DownloadProgress",t[t.Response=4]="Response",t[t.User=5]="User",t}(_e||{}),st=class{headers;status;statusText;url;ok;type;constructor(n,e=200,i="OK"){this.headers=n.headers||new X,this.status=n.status!==void 0?n.status:e,this.statusText=n.statusText||i,this.url=n.url||null,this.ok=this.status>=200&&this.status<300}},It=class t extends st{constructor(n={}){super(n)}type=_e.ResponseHeader;clone(n={}){return new t({headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0})}},at=class t extends st{body;constructor(n={}){super(n),this.body=n.body!==void 0?n.body:null}type=_e.Response;clone(n={}){return new t({body:n.body!==void 0?n.body:this.body,headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0})}},De=class extends st{name="HttpErrorResponse";message;error;ok=!1;constructor(n){super(n,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${n.url||"(unknown url)"}`:this.message=`Http failure response for ${n.url||"(unknown url)"}: ${n.status} ${n.statusText}`,this.error=n.error||null}},zo=200,Al=204;function Mi(t,n){return{body:n,headers:t.headers,context:t.context,observe:t.observe,params:t.params,reportProgress:t.reportProgress,responseType:t.responseType,withCredentials:t.withCredentials,transferCache:t.transferCache}}var Nn=(()=>{class t{handler;constructor(e){this.handler=e}request(e,i,r={}){let o;if(e instanceof it)o=e;else{let l;r.headers instanceof X?l=r.headers:l=new X(r.headers);let u;r.params&&(r.params instanceof oe?u=r.params:u=new oe({fromObject:r.params})),o=new it(e,i,r.body!==void 0?r.body:null,{headers:l,context:r.context,params:u,reportProgress:r.reportProgress,responseType:r.responseType||"json",withCredentials:r.withCredentials,transferCache:r.transferCache})}let s=kn(o).pipe(Hi(l=>this.handler.handle(l)));if(e instanceof it||r.observe==="events")return s;let a=s.pipe(ji(l=>l instanceof at));switch(r.observe||"body"){case"body":switch(o.responseType){case"arraybuffer":return a.pipe(Le(l=>{if(l.body!==null&&!(l.body instanceof ArrayBuffer))throw new U(2806,!1);return l.body}));case"blob":return a.pipe(Le(l=>{if(l.body!==null&&!(l.body instanceof Blob))throw new U(2807,!1);return l.body}));case"text":return a.pipe(Le(l=>{if(l.body!==null&&typeof l.body!="string")throw new U(2808,!1);return l.body}));case"json":default:return a.pipe(Le(l=>l.body))}case"response":return a;default:throw new U(2809,!1)}}delete(e,i={}){return this.request("DELETE",e,i)}get(e,i={}){return this.request("GET",e,i)}head(e,i={}){return this.request("HEAD",e,i)}jsonp(e,i){return this.request("JSONP",e,{params:new oe().append(i,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,i={}){return this.request("OPTIONS",e,i)}patch(e,i,r={}){return this.request("PATCH",e,Mi(r,i))}post(e,i,r={}){return this.request("POST",e,Mi(r,i))}put(e,i,r={}){return this.request("PUT",e,Mi(r,i))}static \u0275fac=function(i){return new(i||t)(P(rt))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Fl=/^\)\]\}',?\n/;function Bo(t){if(t.url)return t.url;let n=Li.toLocaleLowerCase();return t.headers.get(n)}var Go=new I(""),In=(()=>{class t{fetchImpl=m(Ri,{optional:!0})?.fetch??((...e)=>globalThis.fetch(...e));ngZone=m(qt);destroyRef=m(qi);destroyed=!1;constructor(){this.destroyRef.onDestroy(()=>{this.destroyed=!0})}handle(e){return new Pn(i=>{let r=new AbortController;return this.doRequest(e,r.signal,i).then(xi,o=>i.error(new De({error:o}))),()=>r.abort()})}doRequest(e,i,r){return Ht(this,null,function*(){let o=this.createRequestInit(e),s;try{let h=this.ngZone.runOutsideAngular(()=>this.fetchImpl(e.urlWithParams,D({signal:i},o)));Tl(h),r.next({type:_e.Sent}),s=yield h}catch(h){r.error(new De({error:h,status:h.status??0,statusText:h.statusText,url:e.urlWithParams,headers:h.headers}));return}let a=new X(s.headers),l=s.statusText,u=Bo(s)??e.urlWithParams,c=s.status,d=null;if(e.reportProgress&&r.next(new It({headers:a,status:c,statusText:l,url:u})),s.body){let h=s.headers.get("content-length"),y=[],g=s.body.getReader(),b=0,w,C,S=typeof Zone<"u"&&Zone.current,O=!1;if(yield this.ngZone.runOutsideAngular(()=>Ht(this,null,function*(){for(;;){if(this.destroyed){yield g.cancel(),O=!0;break}let{done:J,value:Ce}=yield g.read();if(J)break;if(y.push(Ce),b+=Ce.length,e.reportProgress){C=e.responseType==="text"?(C??"")+(w??=new TextDecoder).decode(Ce,{stream:!0}):void 0;let Ee=()=>r.next({type:_e.DownloadProgress,total:h?+h:void 0,loaded:b,partialText:C});S?S.run(Ee):Ee()}}})),O){r.complete();return}let se=this.concatChunks(y,b);try{let J=s.headers.get(Tt)??"";d=this.parseBody(e,se,J)}catch(J){r.error(new De({error:J,headers:new X(s.headers),status:s.status,statusText:s.statusText,url:Bo(s)??e.urlWithParams}));return}}c===0&&(c=d?zo:0),c>=200&&c<300?(r.next(new at({body:d,headers:a,status:c,statusText:l,url:u})),r.complete()):r.error(new De({error:d,headers:a,status:c,statusText:l,url:u}))})}parseBody(e,i,r){switch(e.responseType){case"json":let o=new TextDecoder().decode(i).replace(Fl,"");return o===""?null:JSON.parse(o);case"text":return new TextDecoder().decode(i);case"blob":return new Blob([i],{type:r});case"arraybuffer":return i.buffer}}createRequestInit(e){let i={},r=e.withCredentials?"include":void 0;if(e.headers.forEach((o,s)=>i[o]=s.join(",")),e.headers.has(Rn)||(i[Rn]=Ho),!e.headers.has(Tt)){let o=e.detectContentTypeHeader();o!==null&&(i[Tt]=o)}return{body:e.serializeBody(),method:e.method,headers:i,credentials:r}}concatChunks(e,i){let r=new Uint8Array(i),o=0;for(let s of e)r.set(s,o),o+=s.length;return r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Ri=class{};function xi(){}function Tl(t){t.then(xi,xi)}function Il(t,n){return n(t)}function Ol(t,n,e){return(i,r)=>Ki(e,()=>n(i,o=>t(o,r)))}var Pi=new I(""),Wo=new I(""),Ko=new I("",{providedIn:"root",factory:()=>!0});var xn=(()=>{class t extends rt{backend;injector;chain=null;pendingTasks=m(Yi);contributeToStability=m(Ko);constructor(e,i){super(),this.backend=e,this.injector=i}handle(e){if(this.chain===null){let i=Array.from(new Set([...this.injector.get(Pi),...this.injector.get(Wo,[])]));this.chain=i.reduceRight((r,o)=>Ol(r,o,this.injector),Il)}if(this.contributeToStability){let i=this.pendingTasks.add();return this.chain(e,r=>this.backend.handle(r)).pipe(zi(()=>this.pendingTasks.remove(i)))}else return this.chain(e,i=>this.backend.handle(i))}static \u0275fac=function(i){return new(i||t)(P(ot),P(Wi))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Ml=/^\)\]\}',?\n/,Rl=RegExp(`^${Li}:`,"m");function xl(t){return"responseURL"in t&&t.responseURL?t.responseURL:Rl.test(t.getAllResponseHeaders())?t.getResponseHeader(Li):null}var Ni=(()=>{class t{xhrFactory;constructor(e){this.xhrFactory=e}handle(e){if(e.method==="JSONP")throw new U(-2800,!1);let i=this.xhrFactory;return(i.\u0275loadImpl?zt(i.\u0275loadImpl()):kn(null)).pipe(Gi(()=>new Pn(o=>{let s=i.build();if(s.open(e.method,e.urlWithParams),e.withCredentials&&(s.withCredentials=!0),e.headers.forEach((g,b)=>s.setRequestHeader(g,b.join(","))),e.headers.has(Rn)||s.setRequestHeader(Rn,Ho),!e.headers.has(Tt)){let g=e.detectContentTypeHeader();g!==null&&s.setRequestHeader(Tt,g)}if(e.responseType){let g=e.responseType.toLowerCase();s.responseType=g!=="json"?g:"text"}let a=e.serializeBody(),l=null,u=()=>{if(l!==null)return l;let g=s.statusText||"OK",b=new X(s.getAllResponseHeaders()),w=xl(s)||e.url;return l=new It({headers:b,status:s.status,statusText:g,url:w}),l},c=()=>{let{headers:g,status:b,statusText:w,url:C}=u(),S=null;b!==Al&&(S=typeof s.response>"u"?s.responseText:s.response),b===0&&(b=S?zo:0);let O=b>=200&&b<300;if(e.responseType==="json"&&typeof S=="string"){let se=S;S=S.replace(Ml,"");try{S=S!==""?JSON.parse(S):null}catch(J){S=se,O&&(O=!1,S={error:J,text:S})}}O?(o.next(new at({body:S,headers:g,status:b,statusText:w,url:C||void 0})),o.complete()):o.error(new De({error:S,headers:g,status:b,statusText:w,url:C||void 0}))},d=g=>{let{url:b}=u(),w=new De({error:g,status:s.status||0,statusText:s.statusText||"Unknown Error",url:b||void 0});o.error(w)},f=!1,h=g=>{f||(o.next(u()),f=!0);let b={type:_e.DownloadProgress,loaded:g.loaded};g.lengthComputable&&(b.total=g.total),e.responseType==="text"&&s.responseText&&(b.partialText=s.responseText),o.next(b)},y=g=>{let b={type:_e.UploadProgress,loaded:g.loaded};g.lengthComputable&&(b.total=g.total),o.next(b)};return s.addEventListener("load",c),s.addEventListener("error",d),s.addEventListener("timeout",d),s.addEventListener("abort",d),e.reportProgress&&(s.addEventListener("progress",h),a!==null&&s.upload&&s.upload.addEventListener("progress",y)),s.send(a),o.next({type:_e.Sent}),()=>{s.removeEventListener("error",d),s.removeEventListener("abort",d),s.removeEventListener("load",c),s.removeEventListener("timeout",d),e.reportProgress&&(s.removeEventListener("progress",h),a!==null&&s.upload&&s.upload.removeEventListener("progress",y)),s.readyState!==s.DONE&&s.abort()}})))}static \u0275fac=function(i){return new(i||t)(P(bt))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),qo=new I(""),Nl="XSRF-TOKEN",Ll=new I("",{providedIn:"root",factory:()=>Nl}),Pl="X-XSRF-TOKEN",kl=new I("",{providedIn:"root",factory:()=>Pl}),Ot=class{},$l=(()=>{class t{doc;cookieName;lastCookieString="";lastToken=null;parseCount=0;constructor(e,i){this.doc=e,this.cookieName=i}getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Qn(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(i){return new(i||t)(P(j),P(Ll))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Vl=/^(?:https?:)?\/\//i;function Bl(t,n){if(!m(qo)||t.method==="GET"||t.method==="HEAD"||Vl.test(t.url))return n(t);let e=m(Ot).getToken(),i=m(kl);return e!=null&&!t.headers.has(i)&&(t=t.clone({headers:t.headers.set(i,e)})),n(t)}var Ln=function(t){return t[t.Interceptors=0]="Interceptors",t[t.LegacyInterceptors=1]="LegacyInterceptors",t[t.CustomXsrfConfiguration=2]="CustomXsrfConfiguration",t[t.NoXsrfProtection=3]="NoXsrfProtection",t[t.JsonpSupport=4]="JsonpSupport",t[t.RequestsMadeViaParent=5]="RequestsMadeViaParent",t[t.Fetch=6]="Fetch",t}(Ln||{});function Yo(t,n){return{\u0275kind:t,\u0275providers:n}}function Ul(...t){let n=[Nn,Ni,xn,{provide:rt,useExisting:xn},{provide:ot,useFactory:()=>m(Go,{optional:!0})??m(Ni)},{provide:Pi,useValue:Bl,multi:!0},{provide:qo,useValue:!0},{provide:Ot,useClass:$l}];for(let e of t)n.push(...e.\u0275providers);return Gt(n)}function jl(t){return Yo(Ln.Interceptors,t.map(n=>({provide:Pi,useValue:n,multi:!0})))}function Hl(){return Yo(Ln.Fetch,[In,{provide:Go,useExisting:In},{provide:ot,useExisting:In}])}var Zo=class t{static isArray(n,e=!0){return Array.isArray(n)&&(e||n.length!==0)}static isObject(n,e=!0){return typeof n=="object"&&!Array.isArray(n)&&n!=null&&(e||Object.keys(n).length!==0)}static equals(n,e,i){return i?this.resolveFieldData(n,i)===this.resolveFieldData(e,i):this.equalsByValue(n,e)}static equalsByValue(n,e){if(n===e)return!0;if(n&&e&&typeof n=="object"&&typeof e=="object"){var i=Array.isArray(n),r=Array.isArray(e),o,s,a;if(i&&r){if(s=n.length,s!=e.length)return!1;for(o=s;o--!==0;)if(!this.equalsByValue(n[o],e[o]))return!1;return!0}if(i!=r)return!1;var l=this.isDate(n),u=this.isDate(e);if(l!=u)return!1;if(l&&u)return n.getTime()==e.getTime();var c=n instanceof RegExp,d=e instanceof RegExp;if(c!=d)return!1;if(c&&d)return n.toString()==e.toString();var f=Object.keys(n);if(s=f.length,s!==Object.keys(e).length)return!1;for(o=s;o--!==0;)if(!Object.prototype.hasOwnProperty.call(e,f[o]))return!1;for(o=s;o--!==0;)if(a=f[o],!this.equalsByValue(n[a],e[a]))return!1;return!0}return n!==n&&e!==e}static resolveFieldData(n,e){if(n&&e){if(this.isFunction(e))return e(n);if(e.indexOf(".")==-1)return n[e];{let i=e.split("."),r=n;for(let o=0,s=i.length;o<s;++o){if(r==null)return null;r=r[i[o]]}return r}}else return null}static isFunction(n){return!!(n&&n.constructor&&n.call&&n.apply)}static reorderArray(n,e,i){let r;n&&e!==i&&(i>=n.length&&(i%=n.length,e%=n.length),n.splice(i,0,n.splice(e,1)[0]))}static insertIntoOrderedArray(n,e,i,r){if(i.length>0){let o=!1;for(let s=0;s<i.length;s++)if(this.findIndexInList(i[s],r)>e){i.splice(s,0,n),o=!0;break}o||i.push(n)}else i.push(n)}static findIndexInList(n,e){let i=-1;if(e){for(let r=0;r<e.length;r++)if(e[r]==n){i=r;break}}return i}static contains(n,e){if(n!=null&&e&&e.length){for(let i of e)if(this.equals(n,i))return!0}return!1}static removeAccents(n){return n&&(n=n.normalize("NFKD").replace(new RegExp("\\p{Diacritic}","gu"),"")),n}static isDate(n){return Object.prototype.toString.call(n)==="[object Date]"}static isEmpty(n){return n==null||n===""||Array.isArray(n)&&n.length===0||!this.isDate(n)&&typeof n=="object"&&Object.keys(n).length===0}static isNotEmpty(n){return!this.isEmpty(n)}static compare(n,e,i,r=1){let o=-1,s=this.isEmpty(n),a=this.isEmpty(e);return s&&a?o=0:s?o=r:a?o=-r:typeof n=="string"&&typeof e=="string"?o=n.localeCompare(e,i,{numeric:!0}):o=n<e?-1:n>e?1:0,o}static sort(n,e,i=1,r,o=1){let s=t.compare(n,e,r,i),a=i;return(t.isEmpty(n)||t.isEmpty(e))&&(a=o===1?i:o),a*s}static merge(n,e){if(!(n==null&&e==null)){{if((n==null||typeof n=="object")&&(e==null||typeof e=="object"))return D(D({},n||{}),e||{});if((n==null||typeof n=="string")&&(e==null||typeof e=="string"))return[n||"",e||""].join(" ")}return e||n}}static isPrintableCharacter(n=""){return this.isNotEmpty(n)&&n.length===1&&n.match(/\S| /)}static getItemValue(n,...e){return this.isFunction(n)?n(...e):n}static findLastIndex(n,e){let i=-1;if(this.isNotEmpty(n))try{i=n.findLastIndex(e)}catch{i=n.lastIndexOf([...n].reverse().find(e))}return i}static findLast(n,e){let i;if(this.isNotEmpty(n))try{i=n.findLast(e)}catch{i=[...n].reverse().find(e)}return i}static deepEquals(n,e){if(n===e)return!0;if(n&&e&&typeof n=="object"&&typeof e=="object"){var i=Array.isArray(n),r=Array.isArray(e),o,s,a;if(i&&r){if(s=n.length,s!=e.length)return!1;for(o=s;o--!==0;)if(!this.deepEquals(n[o],e[o]))return!1;return!0}if(i!=r)return!1;var l=n instanceof Date,u=e instanceof Date;if(l!=u)return!1;if(l&&u)return n.getTime()==e.getTime();var c=n instanceof RegExp,d=e instanceof RegExp;if(c!=d)return!1;if(c&&d)return n.toString()==e.toString();var f=Object.keys(n);if(s=f.length,s!==Object.keys(e).length)return!1;for(o=s;o--!==0;)if(!Object.prototype.hasOwnProperty.call(e,f[o]))return!1;for(o=s;o--!==0;)if(a=f[o],!this.deepEquals(n[a],e[a]))return!1;return!0}return n!==n&&e!==e}static minifyCSS(n){return n&&n.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":")}static toFlatCase(n){return this.isString(n)?n.replace(/(-|_)/g,"").toLowerCase():n}static isString(n,e=!0){return typeof n=="string"&&(e||n!=="")}},Xo=0;function Ag(t="pn_id_"){return Xo++,`${t}${Xo}`}function Gl(){let t=[],n=(o,s)=>{let a=t.length>0?t[t.length-1]:{key:o,value:s},l=a.value+(a.key===o?0:s)+2;return t.push({key:o,value:l}),l},e=o=>{t=t.filter(s=>s.value!==o)},i=()=>t.length>0?t[t.length-1].value:0,r=o=>o&&parseInt(o.style.zIndex,10)||0;return{get:r,set:(o,s,a)=>{s&&(s.style.zIndex=String(n(o,a)))},clear:o=>{o&&(e(r(o)),o.style.zIndex="")},getCurrent:()=>i(),generateZIndex:n,revertZIndex:e}}var Fg=Gl(),Tg=t=>!!t;var Jo={production:!0,apiBaseUrl:"https://api.example.com",googleClientId:""};var Qo=class t{constructor(n){this.http=n}baseUrl=Jo.apiBaseUrl;request(n,e,i,r,o){let s=`${this.baseUrl}${e.startsWith("/")?e:"/"+e}`,a=new X;o&&Object.keys(o).forEach(c=>{a=a.set(c,o[c])}),i&&!a.has("Content-Type")&&(a=a.set("Content-Type","application/json"));let l=new oe;r&&Object.keys(r).forEach(c=>{r[c]!==null&&r[c]!==void 0&&(l=l.set(c,r[c].toString()))});let u={headers:a,params:l};switch(n){case"GET":return this.http.get(s,u);case"POST":return this.http.post(s,i,u);case"PUT":return this.http.put(s,i,u);case"PATCH":return this.http.patch(s,i,u);case"DELETE":return this.http.delete(s,u);default:throw new Error(`Unsupported HTTP method: ${n}`)}}get(n,e,i){return this.request("GET",n,void 0,e,i)}post(n,e,i,r){return this.request("POST",n,e,i,r)}postBlob(n,e,i,r){let o=`${this.baseUrl}${n.startsWith("/")?n:"/"+n}`,s=new X;r&&Object.keys(r).forEach(l=>{s=s.set(l,r[l])}),e&&!s.has("Content-Type")&&(s=s.set("Content-Type","application/json"));let a=new oe;return i&&Object.keys(i).forEach(l=>{i[l]!==null&&i[l]!==void 0&&(a=a.set(l,i[l].toString()))}),this.http.post(o,e,{headers:s,params:a,responseType:"blob"})}put(n,e,i,r){return this.request("PUT",n,e,i,r)}patch(n,e,i,r){return this.request("PATCH",n,e,i,r)}delete(n,e,i){return this.request("DELETE",n,void 0,e,i)}setBaseUrl(n){this.baseUrl=n}getBaseUrl(){return this.baseUrl}static \u0275fac=function(e){return new(e||t)(P(Nn))};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})};export{j as a,Be as b,bs as c,zn as d,vs as e,Ge as f,ar as g,lr as h,Es as i,Yn as j,yr as k,Zn as l,Xn as m,Jn as n,Ms as o,Rs as p,Me as q,Qn as r,_r as s,vt as t,ei as u,bt as v,Oc as w,oe as x,De as y,Nn as z,Ul as A,jl as B,Hl as C,Er as D,Dt as E,Pc as F,Ue as G,kc as H,Sr as I,ks as J,$s as K,$c as L,Vc as M,Ar as N,Bc as O,Uc as P,jc as Q,Hc as R,Vs as S,Bs as T,zc as U,Gc as V,Fr as W,Wc as X,ii as Y,Kc as Z,qc as _,Ir as $,ri as aa,Yc as ba,Zc as ca,oi as da,js as ea,Xc as fa,Jc as ga,Qc as ha,ed as ia,td as ja,nd as ka,id as la,z as ma,Hs as na,T as oa,ln as pa,ai as qa,ad as ra,ld as sa,cn as ta,ud as ua,cd as va,_t as wa,$ as xa,Ad as ya,Fd as za,Td as Aa,Id as Ba,Od as Ca,Pr as Da,xe as Ea,Md as Fa,Bd as Ga,B as Ha,ch as Ia,re as Ja,pi as Ka,Gr as La,Wr as Ma,Rh as Na,pn as Oa,Yr as Pa,lf as Qa,Xr as Ra,bf as Sa,Ra as Ta,Hf as Ua,Zo as Va,Ag as Wa,Fg as Xa,Tg as Ya,Jo as Za,Qo as _a,et as $a,co as ab,eo as bb,ve as cb,ap as db,lp as eb,Dn as fb,At as gb,Ii as hb,cp as ib,ll as jb,Fo as kb,To as lb,Io as mb,fl as nb,Ro as ob,dp as pb,hp as qb,fp as rb,pp as sb,gp as tb,Fp as ub,Tp as vb};
