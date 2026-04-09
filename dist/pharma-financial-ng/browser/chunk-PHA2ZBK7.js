import{$ as Wt,$a as Bn,A as ji,Ab as Ve,C as Hi,Db as ht,Fb as ft,G as zi,Gb as pt,Ia as $,Ib as Jt,Ja as Zi,Jb as Qt,Ka as ct,Ma as ae,Na as p,O as Wi,Pa as Yt,Qb as O,R as U,S as te,Sb as jn,T as v,Ta as K,U as N,Ua as L,Va as _,W as I,Wa as Vn,Xa as C,Y as k,Z as m,Za as ke,a as D,ab as Xi,b as ee,ba as Gi,ca as Ki,d as Ht,da as W,db as q,eb as x,ec as Hn,fb as Ji,fc as Ge,g as kn,ga as Gt,gb as We,gc as tr,hb as Qi,hc as nr,ia as w,ib as Ae,j as we,jc as R,ka as Kt,kc as zn,la as qi,lc as ue,mc as Ie,na as Yi,nb as Fe,nc as gt,o as zt,oa as se,ob as Te,p as $n,pa as qt,pb as fe,qb as Zt,ra as Se,rb as Xt,sa as G,sb as er,t as Le,ta as ne,vb as Un,wb as dt,xa as Pe,xb as pe,yb as le,z as Ui,zb as $e}from"./chunk-HZQEWPQG.js";var j=new I("");var or=null;function Be(){return or}function ys(t){or??=t}var Wn=class{},mt=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:()=>m(sr),providedIn:"platform"})}return t})(),bs=new I(""),sr=(()=>{class t extends mt{_location;_history;_doc=m(j);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return Be().getBaseHref(this._doc)}onPopState(e){let n=Be().getGlobalEventTarget(this._doc,"window");return n.addEventListener("popstate",e,!1),()=>n.removeEventListener("popstate",e)}onHashChange(e){let n=Be().getGlobalEventTarget(this._doc,"window");return n.addEventListener("hashchange",e,!1),()=>n.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,n,r){this._history.pushState(e,n,r)}replaceState(e,n,r){this._history.replaceState(e,n,r)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:()=>new t,providedIn:"platform"})}return t})();function en(t,i){return t?i?t.endsWith("/")?i.startsWith("/")?t+i.slice(1):t+i:i.startsWith("/")?t+i:`${t}/${i}`:t:i}function ir(t){let i=t.search(/#|\?|$/);return t[i-1]==="/"?t.slice(0,i-1)+t.slice(i):t}function ce(t){return t&&t[0]!=="?"?`?${t}`:t}var Ke=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:()=>m(ar),providedIn:"root"})}return t})(),tn=new I(""),ar=(()=>{class t extends Ke{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,n){super(),this._platformLocation=e,this._baseHref=n??this._platformLocation.getBaseHrefFromDOM()??m(j).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return en(this._baseHref,e)}path(e=!1){let n=this._platformLocation.pathname+ce(this._platformLocation.search),r=this._platformLocation.hash;return r&&e?`${n}${r}`:n}pushState(e,n,r,o){let s=this.prepareExternalUrl(r+ce(o));this._platformLocation.pushState(e,n,s)}replaceState(e,n,r,o){let s=this.prepareExternalUrl(r+ce(o));this._platformLocation.replaceState(e,n,s)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(n){return new(n||t)(k(mt),k(tn,8))};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),lr=(()=>{class t{_subject=new we;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let n=this._locationStrategy.getBaseHref();this._basePath=_s(ir(rr(n))),this._locationStrategy.onPopState(r=>{this._subject.next({url:this.path(!0),pop:!0,state:r.state,type:r.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,n=""){return this.path()==this.normalize(e+ce(n))}normalize(e){return t.stripTrailingSlash(Ds(this._basePath,rr(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,n="",r=null){this._locationStrategy.pushState(r,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+ce(n)),r)}replaceState(e,n="",r=null){this._locationStrategy.replaceState(r,"",e,n),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+ce(n)),r)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(n=>{this._notifyUrlChangeListeners(n.url,n.state)}),()=>{let n=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(n,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",n){this._urlChangeListeners.forEach(r=>r(e,n))}subscribe(e,n,r){return this._subject.subscribe({next:e,error:n??void 0,complete:r??void 0})}static normalizeQueryParams=ce;static joinWithSlash=en;static stripTrailingSlash=ir;static \u0275fac=function(n){return new(n||t)(k(Ke))};static \u0275prov=v({token:t,factory:()=>vs(),providedIn:"root"})}return t})();function vs(){return new lr(k(Ke))}function Ds(t,i){if(!t||!i.startsWith(t))return i;let e=i.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:i}function rr(t){return t.replace(/\/index.html$/,"")}function _s(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var Cs=(()=>{class t extends Ke{_platformLocation;_baseHref="";_removeListenerFns=[];constructor(e,n){super(),this._platformLocation=e,n!=null&&(this._baseHref=n)}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}path(e=!1){let n=this._platformLocation.hash??"#";return n.length>0?n.substring(1):n}prepareExternalUrl(e){let n=en(this._baseHref,e);return n.length>0?"#"+n:n}pushState(e,n,r,o){let s=this.prepareExternalUrl(r+ce(o))||this._platformLocation.pathname;this._platformLocation.pushState(e,n,s)}replaceState(e,n,r,o){let s=this.prepareExternalUrl(r+ce(o))||this._platformLocation.pathname;this._platformLocation.replaceState(e,n,s)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(n){return new(n||t)(k(mt),k(tn,8))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var sn=function(t){return t[t.Decimal=0]="Decimal",t[t.Percent=1]="Percent",t[t.Currency=2]="Currency",t[t.Scientific=3]="Scientific",t}(sn||{});var H={Decimal:0,Group:1,List:2,PercentSign:3,PlusSign:4,MinusSign:5,Exponential:6,SuperscriptingExponent:7,PerMille:8,Infinity:9,NaN:10,TimeSeparator:11,CurrencyDecimal:12,CurrencyGroup:13};function Oe(t,i){let e=Un(t),n=e[dt.NumberSymbols][i];if(typeof n>"u"){if(i===H.CurrencyDecimal)return e[dt.NumberSymbols][H.Decimal];if(i===H.CurrencyGroup)return e[dt.NumberSymbols][H.Group]}return n}function Yn(t,i){return Un(t)[dt.NumberFormats][i]}var Es=/^(\d+)?\.((\d+)(-(\d+))?)?$/,ur=22,nn=".",yt="0",ws=";",Ss=",",Gn="#";var As="%";function fr(t,i,e,n,r,o,s=!1){let a="",l=!1;if(!isFinite(t))a=Oe(e,H.Infinity);else{let u=Ts(t);s&&(u=Fs(u));let c=i.minInt,d=i.minFrac,f=i.maxFrac;if(o){let E=o.match(Es);if(E===null)throw new Error(`${o} is not a valid digit info`);let A=E[1],M=E[3],oe=E[5];A!=null&&(c=Kn(A)),M!=null&&(d=Kn(M)),oe!=null?f=Kn(oe):M!=null&&d>f&&(f=d)}Is(u,d,f);let h=u.digits,y=u.integerLen,g=u.exponent,b=[];for(l=h.every(E=>!E);y<c;y++)h.unshift(0);for(;y<0;y++)h.unshift(0);y>0?b=h.splice(y,h.length):(b=h,h=[0]);let S=[];for(h.length>=i.lgSize&&S.unshift(h.splice(-i.lgSize,h.length).join(""));h.length>i.gSize;)S.unshift(h.splice(-i.gSize,h.length).join(""));h.length&&S.unshift(h.join("")),a=S.join(Oe(e,n)),b.length&&(a+=Oe(e,r)+b.join("")),g&&(a+=Oe(e,H.Exponential)+"+"+g)}return t<0&&!l?a=i.negPre+a+i.negSuf:a=i.posPre+a+i.posSuf,a}function pr(t,i,e){let n=Yn(i,sn.Percent),r=mr(n,Oe(i,H.MinusSign));return fr(t,r,i,H.Group,H.Decimal,e,!0).replace(new RegExp(As,"g"),Oe(i,H.PercentSign))}function gr(t,i,e){let n=Yn(i,sn.Decimal),r=mr(n,Oe(i,H.MinusSign));return fr(t,r,i,H.Group,H.Decimal,e)}function mr(t,i="-"){let e={minInt:1,minFrac:0,maxFrac:0,posPre:"",posSuf:"",negPre:"",negSuf:"",gSize:0,lgSize:0},n=t.split(ws),r=n[0],o=n[1],s=r.indexOf(nn)!==-1?r.split(nn):[r.substring(0,r.lastIndexOf(yt)+1),r.substring(r.lastIndexOf(yt)+1)],a=s[0],l=s[1]||"";e.posPre=a.substring(0,a.indexOf(Gn));for(let c=0;c<l.length;c++){let d=l.charAt(c);d===yt?e.minFrac=e.maxFrac=c+1:d===Gn?e.maxFrac=c+1:e.posSuf+=d}let u=a.split(Ss);if(e.gSize=u[1]?u[1].length:0,e.lgSize=u[2]||u[1]?(u[2]||u[1]).length:0,o){let c=r.length-e.posPre.length-e.posSuf.length,d=o.indexOf(Gn);e.negPre=o.substring(0,d).replace(/'/g,""),e.negSuf=o.slice(d+c).replace(/'/g,"")}else e.negPre=i+e.posPre,e.negSuf=e.posSuf;return e}function Fs(t){if(t.digits[0]===0)return t;let i=t.digits.length-t.integerLen;return t.exponent?t.exponent+=2:(i===0?t.digits.push(0,0):i===1&&t.digits.push(0),t.integerLen+=2),t}function Ts(t){let i=Math.abs(t)+"",e=0,n,r,o,s,a;for((r=i.indexOf(nn))>-1&&(i=i.replace(nn,"")),(o=i.search(/e/i))>0?(r<0&&(r=o),r+=+i.slice(o+1),i=i.substring(0,o)):r<0&&(r=i.length),o=0;i.charAt(o)===yt;o++);if(o===(a=i.length))n=[0],r=1;else{for(a--;i.charAt(a)===yt;)a--;for(r-=o,n=[],s=0;o<=a;o++,s++)n[s]=Number(i.charAt(o))}return r>ur&&(n=n.splice(0,ur-1),e=r-1,r=1),{digits:n,exponent:e,integerLen:r}}function Is(t,i,e){if(i>e)throw new Error(`The minimum number of digits after fraction (${i}) is higher than the maximum (${e}).`);let n=t.digits,r=n.length-t.integerLen,o=Math.min(Math.max(i,r),e),s=o+t.integerLen,a=n[s];if(s>0){n.splice(Math.max(t.integerLen,s));for(let d=s;d<n.length;d++)n[d]=0}else{r=Math.max(0,r),t.integerLen=1,n.length=Math.max(1,s=o+1),n[0]=0;for(let d=1;d<s;d++)n[d]=0}if(a>=5)if(s-1<0){for(let d=0;d>s;d--)n.unshift(0),t.integerLen++;n.unshift(1),t.integerLen++}else n[s-1]++;for(;r<Math.max(0,o);r++)n.push(0);let l=o!==0,u=i+t.integerLen,c=n.reduceRight(function(d,f,h,y){return f=f+d,y[h]=f<10?f:f-10,l&&(y[h]===0&&h>=u?y.pop():l=!1),f>=10?1:0},0);c&&(n.unshift(c),t.integerLen++)}function Kn(t){let i=parseInt(t);if(isNaN(i))throw new Error("Invalid integer literal when parsing "+t);return i}var qn=/\s+/,cr=[],Zn=(()=>{class t{_ngEl;_renderer;initialClasses=cr;rawClass;stateMap=new Map;constructor(e,n){this._ngEl=e,this._renderer=n}set klass(e){this.initialClasses=e!=null?e.trim().split(qn):cr}set ngClass(e){this.rawClass=typeof e=="string"?e.trim().split(qn):e}ngDoCheck(){for(let n of this.initialClasses)this._updateState(n,!0);let e=this.rawClass;if(Array.isArray(e)||e instanceof Set)for(let n of e)this._updateState(n,!0);else if(e!=null)for(let n of Object.keys(e))this._updateState(n,!!e[n]);this._applyStateDiff()}_updateState(e,n){let r=this.stateMap.get(e);r!==void 0?(r.enabled!==n&&(r.changed=!0,r.enabled=n),r.touched=!0):this.stateMap.set(e,{enabled:n,changed:!0,touched:!0})}_applyStateDiff(){for(let e of this.stateMap){let n=e[0],r=e[1];r.changed?(this._toggleClass(n,r.enabled),r.changed=!1):r.touched||(r.enabled&&this._toggleClass(n,!1),this.stateMap.delete(n)),r.touched=!1}}_toggleClass(e,n){e=e.trim(),e.length>0&&e.split(qn).forEach(r=>{n?this._renderer.addClass(this._ngEl.nativeElement,r):this._renderer.removeClass(this._ngEl.nativeElement,r)})}static \u0275fac=function(n){return new(n||t)(p(G),p(ae))};static \u0275dir=_({type:t,selectors:[["","ngClass",""]],inputs:{klass:[0,"class","klass"],ngClass:"ngClass"}})}return t})();var rn=class{$implicit;ngForOf;index;count;constructor(i,e,n,r){this.$implicit=i,this.ngForOf=e,this.index=n,this.count=r}get first(){return this.index===0}get last(){return this.index===this.count-1}get even(){return this.index%2===0}get odd(){return!this.even}},yr=(()=>{class t{_viewContainer;_template;_differs;set ngForOf(e){this._ngForOf=e,this._ngForOfDirty=!0}set ngForTrackBy(e){this._trackByFn=e}get ngForTrackBy(){return this._trackByFn}_ngForOf=null;_ngForOfDirty=!0;_differ=null;_trackByFn;constructor(e,n,r){this._viewContainer=e,this._template=n,this._differs=r}set ngForTemplate(e){e&&(this._template=e)}ngDoCheck(){if(this._ngForOfDirty){this._ngForOfDirty=!1;let e=this._ngForOf;!this._differ&&e&&(this._differ=this._differs.find(e).create(this.ngForTrackBy))}if(this._differ){let e=this._differ.diff(this._ngForOf);e&&this._applyChanges(e)}}_applyChanges(e){let n=this._viewContainer;e.forEachOperation((r,o,s)=>{if(r.previousIndex==null)n.createEmbeddedView(this._template,new rn(r.item,this._ngForOf,-1,-1),s===null?void 0:s);else if(s==null)n.remove(o===null?void 0:o);else if(o!==null){let a=n.get(o);n.move(a,s),dr(a,r)}});for(let r=0,o=n.length;r<o;r++){let a=n.get(r).context;a.index=r,a.count=o,a.ngForOf=this._ngForOf}e.forEachIdentityChange(r=>{let o=n.get(r.currentIndex);dr(o,r)})}static ngTemplateContextGuard(e,n){return!0}static \u0275fac=function(n){return new(n||t)(p(Yt),p(ct),p(tr))};static \u0275dir=_({type:t,selectors:[["","ngFor","","ngForOf",""]],inputs:{ngForOf:"ngForOf",ngForTrackBy:"ngForTrackBy",ngForTemplate:"ngForTemplate"}})}return t})();function dr(t,i){t.context.$implicit=i.item}var Xn=(()=>{class t{_viewContainer;_context=new on;_thenTemplateRef=null;_elseTemplateRef=null;_thenViewRef=null;_elseViewRef=null;constructor(e,n){this._viewContainer=e,this._thenTemplateRef=n}set ngIf(e){this._context.$implicit=this._context.ngIf=e,this._updateView()}set ngIfThen(e){hr(e,!1),this._thenTemplateRef=e,this._thenViewRef=null,this._updateView()}set ngIfElse(e){hr(e,!1),this._elseTemplateRef=e,this._elseViewRef=null,this._updateView()}_updateView(){this._context.$implicit?this._thenViewRef||(this._viewContainer.clear(),this._elseViewRef=null,this._thenTemplateRef&&(this._thenViewRef=this._viewContainer.createEmbeddedView(this._thenTemplateRef,this._context))):this._elseViewRef||(this._viewContainer.clear(),this._thenViewRef=null,this._elseTemplateRef&&(this._elseViewRef=this._viewContainer.createEmbeddedView(this._elseTemplateRef,this._context)))}static ngIfUseIfTypeGuard;static ngTemplateGuard_ngIf;static ngTemplateContextGuard(e,n){return!0}static \u0275fac=function(n){return new(n||t)(p(Yt),p(ct))};static \u0275dir=_({type:t,selectors:[["","ngIf",""]],inputs:{ngIf:"ngIf",ngIfThen:"ngIfThen",ngIfElse:"ngIfElse"}})}return t})(),on=class{$implicit=null;ngIf=null};function hr(t,i){if(t&&!t.createEmbeddedView)throw new U(2020,!1)}var Jn=(()=>{class t{_ngEl;_differs;_renderer;_ngStyle=null;_differ=null;constructor(e,n,r){this._ngEl=e,this._differs=n,this._renderer=r}set ngStyle(e){this._ngStyle=e,!this._differ&&e&&(this._differ=this._differs.find(e).create())}ngDoCheck(){if(this._differ){let e=this._differ.diff(this._ngStyle);e&&this._applyChanges(e)}}_setStyle(e,n){let[r,o]=e.split("."),s=r.indexOf("-")===-1?void 0:Zi.DashCase;n!=null?this._renderer.setStyle(this._ngEl.nativeElement,r,o?`${n}${o}`:n,s):this._renderer.removeStyle(this._ngEl.nativeElement,r,s)}_applyChanges(e){e.forEachRemovedItem(n=>this._setStyle(n.key,null)),e.forEachAddedItem(n=>this._setStyle(n.key,n.currentValue)),e.forEachChangedItem(n=>this._setStyle(n.key,n.currentValue))}static \u0275fac=function(n){return new(n||t)(p(G),p(nr),p(ae))};static \u0275dir=_({type:t,selectors:[["","ngStyle",""]],inputs:{ngStyle:"ngStyle"}})}return t})(),Qn=(()=>{class t{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let n=this._viewContainerRef;if(this._viewRef&&n.remove(n.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let r=this._createContextForwardProxy();this._viewRef=n.createEmbeddedView(this.ngTemplateOutlet,r,{injector:this.ngTemplateOutletInjector??void 0})}}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,n,r)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,n,r):!1,get:(e,n,r)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,n,r)}})}static \u0275fac=function(n){return new(n||t)(p(Yt))};static \u0275dir=_({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[W]})}return t})();function br(t,i){return new U(2100,!1)}var Os=(()=>{class t{_locale;constructor(e){this._locale=e}transform(e,n,r){if(!vr(e))return null;r||=this._locale;try{let o=Dr(e);return gr(o,r,n)}catch(o){throw br(t,o.message)}}static \u0275fac=function(n){return new(n||t)(p(Hn,16))};static \u0275pipe=Vn({name:"number",type:t,pure:!0})}return t})(),Ms=(()=>{class t{_locale;constructor(e){this._locale=e}transform(e,n,r){if(!vr(e))return null;r||=this._locale;try{let o=Dr(e);return pr(o,r,n)}catch(o){throw br(t,o.message)}}static \u0275fac=function(n){return new(n||t)(p(Hn,16))};static \u0275pipe=Vn({name:"percent",type:t,pure:!0})}return t})();function vr(t){return!(t==null||t===""||t!==t)}function Dr(t){if(typeof t=="string"&&!isNaN(Number(t)-parseFloat(t)))return Number(t);if(typeof t!="number")throw new Error(`${t} is not a number`);return t}var Me=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();function ei(t,i){i=encodeURIComponent(i);for(let e of t.split(";")){let n=e.indexOf("="),[r,o]=n==-1?[e,""]:[e.slice(0,n),e.slice(n+1)];if(r.trim()===i)return decodeURIComponent(o)}return null}var _r="browser",Cr="server";function vt(t){return t===_r}function ti(t){return t===Cr}var bt=class{};var xc=(()=>{class t{static \u0275prov=v({token:t,providedIn:"root",factory:()=>new ni(m(j),window)})}return t})(),ni=class{document;window;offset=()=>[0,0];constructor(i,e){this.document=i,this.window=e}setOffset(i){Array.isArray(i)?this.offset=()=>i:this.offset=i}getScrollPosition(){return[this.window.scrollX,this.window.scrollY]}scrollToPosition(i){this.window.scrollTo(i[0],i[1])}scrollToAnchor(i){let e=xs(this.document,i);e&&(this.scrollToElement(e),e.focus())}setHistoryScrollRestoration(i){this.window.history.scrollRestoration=i}scrollToElement(i){let e=i.getBoundingClientRect(),n=e.left+this.window.pageXOffset,r=e.top+this.window.pageYOffset,o=this.offset();this.window.scrollTo(n-o[0],r-o[1])}};function xs(t,i){let e=t.getElementById(i)||t.getElementsByName(i)[0];if(e)return e;if(typeof t.createTreeWalker=="function"&&t.body&&typeof t.body.attachShadow=="function"){let n=t.createTreeWalker(t.body,NodeFilter.SHOW_ELEMENT),r=n.currentNode;for(;r;){let o=r.shadowRoot;if(o){let s=o.getElementById(i)||o.querySelector(`[name="${i}"]`);if(s)return s}r=n.nextNode()}}return null}function Er(t,i){return t?t.classList?t.classList.contains(i):new RegExp("(^| )"+i+"( |$)","gi").test(t.className):!1}function Dt(t,i){if(t&&i){let e=n=>{Er(t,n)||(t.classList?t.classList.add(n):t.className+=" "+n)};[i].flat().filter(Boolean).forEach(n=>n.split(" ").forEach(e))}}function Ls(){return window.innerWidth-document.documentElement.offsetWidth}function qe(t){for(let i of document?.styleSheets)try{for(let e of i?.cssRules)for(let n of e?.style)if(t.test(n))return{name:n,value:e.style.getPropertyValue(n).trim()}}catch{}return null}function Vc(t="p-overflow-hidden"){let i=qe(/-scrollbar-width$/);i?.name&&document.body.style.setProperty(i.name,Ls()+"px"),Dt(document.body,t)}function Ue(t,i){if(t&&i){let e=n=>{t.classList?t.classList.remove(n):t.className=t.className.replace(new RegExp("(^|\\b)"+n.split(" ").join("|")+"(\\b|$)","gi")," ")};[i].flat().filter(Boolean).forEach(n=>n.split(" ").forEach(e))}}function Bc(t="p-overflow-hidden"){let i=qe(/-scrollbar-width$/);i?.name&&document.body.style.removeProperty(i.name),Ue(document.body,t)}function wr(t){let i={width:0,height:0};return t&&(t.style.visibility="hidden",t.style.display="block",i.width=t.offsetWidth,i.height=t.offsetHeight,t.style.display="none",t.style.visibility="visible"),i}function Sr(){let t=window,i=document,e=i.documentElement,n=i.getElementsByTagName("body")[0],r=t.innerWidth||e.clientWidth||n.clientWidth,o=t.innerHeight||e.clientHeight||n.clientHeight;return{width:r,height:o}}function Ps(){let t=document.documentElement;return(window.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}function ks(){let t=document.documentElement;return(window.pageYOffset||t.scrollTop)-(t.clientTop||0)}function Uc(t,i,e=!0){var n,r,o,s;if(t){let a=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:wr(t),l=a.height,u=a.width,c=i.offsetHeight,d=i.offsetWidth,f=i.getBoundingClientRect(),h=ks(),y=Ps(),g=Sr(),b,S,E="top";f.top+c+l>g.height?(b=f.top+h-l,E="bottom",b<0&&(b=h)):b=c+f.top+h,f.left+u>g.width?S=Math.max(0,f.left+y+d-u):S=f.left+y,t.style.top=b+"px",t.style.left=S+"px",t.style.transformOrigin=E,e&&(t.style.marginTop=E==="bottom"?`calc(${(r=(n=qe(/-anchor-gutter$/))==null?void 0:n.value)!=null?r:"2px"} * -1)`:(s=(o=qe(/-anchor-gutter$/))==null?void 0:o.value)!=null?s:"")}}function jc(t,i){t&&(typeof i=="string"?t.style.cssText=i:Object.entries(i||{}).forEach(([e,n])=>t.style[e]=n))}function Ar(t,i){if(t instanceof HTMLElement){let e=t.offsetWidth;if(i){let n=getComputedStyle(t);e+=parseFloat(n.marginLeft)+parseFloat(n.marginRight)}return e}return 0}function Hc(t,i,e=!0){var n,r,o,s;if(t){let a=t.offsetParent?{width:t.offsetWidth,height:t.offsetHeight}:wr(t),l=i.offsetHeight,u=i.getBoundingClientRect(),c=Sr(),d,f,h="top";u.top+l+a.height>c.height?(d=-1*a.height,h="bottom",u.top+d<0&&(d=-1*u.top)):d=l,a.width>c.width?f=u.left*-1:u.left+a.width>c.width?f=(u.left+a.width-c.width)*-1:f=0,t.style.top=d+"px",t.style.left=f+"px",t.style.transformOrigin=h,e&&(t.style.marginTop=h==="bottom"?`calc(${(r=(n=qe(/-anchor-gutter$/))==null?void 0:n.value)!=null?r:"2px"} * -1)`:(s=(o=qe(/-anchor-gutter$/))==null?void 0:o.value)!=null?s:"")}}function Ye(t){return typeof HTMLElement=="object"?t instanceof HTMLElement:t&&typeof t=="object"&&t!==null&&t.nodeType===1&&typeof t.nodeName=="string"}function ii(t){let i=t;return t&&typeof t=="object"&&(t.hasOwnProperty("current")?i=t.current:t.hasOwnProperty("el")&&(t.el.hasOwnProperty("nativeElement")?i=t.el.nativeElement:i=t.el)),Ye(i)?i:void 0}function zc(t,i){let e=ii(t);if(e)e.appendChild(i);else throw new Error("Cannot append "+i+" to "+t)}function an(t,i={}){if(Ye(t)){let e=(n,r)=>{var o,s;let a=(o=t?.$attrs)!=null&&o[n]?[(s=t?.$attrs)==null?void 0:s[n]]:[];return[r].flat().reduce((l,u)=>{if(u!=null){let c=typeof u;if(c==="string"||c==="number")l.push(u);else if(c==="object"){let d=Array.isArray(u)?e(n,u):Object.entries(u).map(([f,h])=>n==="style"&&(h||h===0)?`${f.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${h}`:h?f:void 0);l=d.length?l.concat(d.filter(f=>!!f)):l}}return l},a)};Object.entries(i).forEach(([n,r])=>{if(r!=null){let o=n.match(/^on(.+)/);o?t.addEventListener(o[1].toLowerCase(),r):n==="p-bind"||n==="pBind"?an(t,r):(r=n==="class"?[...new Set(e("class",r))].join(" ").trim():n==="style"?e("style",r).join(";").trim():r,(t.$attrs=t.$attrs||{})&&(t.$attrs[n]=r),t.setAttribute(n,r))}})}}function Wc(t,i={},...e){if(t){let n=document.createElement(t);return an(n,i),n.append(...e),n}}function Gc(t,i){if(t){t.style.opacity="0";let e=+new Date,n="0",r=function(){n=`${+t.style.opacity+(new Date().getTime()-e)/i}`,t.style.opacity=n,e=+new Date,+n<1&&(window.requestAnimationFrame&&requestAnimationFrame(r)||setTimeout(r,16))};r()}}function $s(t,i){return Ye(t)?Array.from(t.querySelectorAll(i)):[]}function Vs(t,i){return Ye(t)?t.matches(i)?t:t.querySelector(i):null}function Kc(t,i){t&&document.activeElement!==t&&t.focus(i)}function qc(t,i){if(Ye(t)){let e=t.getAttribute(i);return isNaN(e)?e==="true"||e==="false"?e==="true":e:+e}}function Fr(t,i=""){let e=$s(t,`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${i}`),n=[];for(let r of e)getComputedStyle(r).display!="none"&&getComputedStyle(r).visibility!="hidden"&&n.push(r);return n}function Yc(t,i){let e=Fr(t,i);return e.length>0?e[0]:null}function ri(t){if(t){let i=t.offsetHeight,e=getComputedStyle(t);return i-=parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)+parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),i}return 0}function Tr(t){if(t){let i=t.parentNode;return i&&i instanceof ShadowRoot&&i.host&&(i=i.host),i}return null}function Zc(t){var i;if(t){let e=(i=Tr(t))==null?void 0:i.childNodes,n=0;if(e)for(let r=0;r<e.length;r++){if(e[r]===t)return n;e[r].nodeType===1&&n++}}return-1}function Xc(t,i){let e=Fr(t,i);return e.length>0?e[e.length-1]:null}function Ir(t){if(t){let i=t.getBoundingClientRect();return{top:i.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:i.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}return{top:"auto",left:"auto"}}function oi(t,i){if(t){let e=t.offsetHeight;if(i){let n=getComputedStyle(t);e+=parseFloat(n.marginTop)+parseFloat(n.marginBottom)}return e}return 0}function Jc(){if(window.getSelection)return window.getSelection().toString();if(document.getSelection)return document.getSelection().toString()}function Bs(t){return!!(t!==null&&typeof t<"u"&&t.nodeName&&Tr(t))}function Qc(t,i){var e;if(t)switch(t){case"document":return document;case"window":return window;case"body":return document.body;case"@next":return i?.nextElementSibling;case"@prev":return i?.previousElementSibling;case"@parent":return i?.parentElement;case"@grandparent":return(e=i?.parentElement)==null?void 0:e.parentElement;default:if(typeof t=="string")return document.querySelector(t);let r=ii((o=>!!(o&&o.constructor&&o.call&&o.apply))(t)?t():t);return r?.nodeType===9||Bs(r)?r:void 0}}function si(t){if(t){let i=t.offsetWidth,e=getComputedStyle(t);return i-=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight)+parseFloat(e.borderLeftWidth)+parseFloat(e.borderRightWidth),i}return 0}function Us(t){return!!(t&&t.offsetParent!=null)}function ed(t){return!Us(t)}function td(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}function nd(t){return t?getComputedStyle(t).direction==="rtl":!1}function id(){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0}function Or(t){var i;t&&("remove"in Element.prototype?t.remove():(i=t.parentNode)==null||i.removeChild(t))}function rd(t,i){let e=ii(t);if(e)e.removeChild(i);else throw new Error("Cannot remove "+i+" from "+t)}function od(t,i){let e=getComputedStyle(t).getPropertyValue("borderTopWidth"),n=e?parseFloat(e):0,r=getComputedStyle(t).getPropertyValue("paddingTop"),o=r?parseFloat(r):0,s=t.getBoundingClientRect(),l=i.getBoundingClientRect().top+document.body.scrollTop-(s.top+document.body.scrollTop)-n-o,u=t.scrollTop,c=t.clientHeight,d=oi(i);l<0?t.scrollTop=u+l:l+d>c&&(t.scrollTop=u+l-c+d)}function sd(t,i="",e){Ye(t)&&e!==null&&e!==void 0&&t.setAttribute(i,e)}function Mr(){let t=new Map;return{on(i,e){let n=t.get(i);return n?n.push(e):n=[e],t.set(i,n),this},off(i,e){let n=t.get(i);return n&&n.splice(n.indexOf(e)>>>0,1),this},emit(i,e){let n=t.get(i);n&&n.slice().map(r=>{r(e)})},clear(){t.clear()}}}function z(t){return t==null||t===""||Array.isArray(t)&&t.length===0||!(t instanceof Date)&&typeof t=="object"&&Object.keys(t).length===0}function ai(t,i,e=new WeakSet){if(t===i)return!0;if(!t||!i||typeof t!="object"||typeof i!="object"||e.has(t)||e.has(i))return!1;e.add(t).add(i);let n=Array.isArray(t),r=Array.isArray(i),o,s,a;if(n&&r){if(s=t.length,s!=i.length)return!1;for(o=s;o--!==0;)if(!ai(t[o],i[o],e))return!1;return!0}if(n!=r)return!1;let l=t instanceof Date,u=i instanceof Date;if(l!=u)return!1;if(l&&u)return t.getTime()==i.getTime();let c=t instanceof RegExp,d=i instanceof RegExp;if(c!=d)return!1;if(c&&d)return t.toString()==i.toString();let f=Object.keys(t);if(s=f.length,s!==Object.keys(i).length)return!1;for(o=s;o--!==0;)if(!Object.prototype.hasOwnProperty.call(i,f[o]))return!1;for(o=s;o--!==0;)if(a=f[o],!ai(t[a],i[a],e))return!1;return!0}function js(t,i){return ai(t,i)}function xr(t){return!!(t&&t.constructor&&t.call&&t.apply)}function T(t){return!z(t)}function ln(t,i){if(!t||!i)return null;try{let e=t[i];if(T(e))return e}catch{}if(Object.keys(t).length){if(xr(i))return i(t);if(i.indexOf(".")===-1)return t[i];{let e=i.split("."),n=t;for(let r=0,o=e.length;r<o;++r){if(n==null)return null;n=n[e[r]]}return n}}return null}function li(t,i,e){return e?ln(t,e)===ln(i,e):js(t,i)}function cd(t,i){if(t!=null&&i&&i.length){for(let e of i)if(li(t,e))return!0}return!1}function dd(t,i){let e=-1;if(T(t))try{e=t.findLastIndex(i)}catch{e=t.lastIndexOf([...t].reverse().find(i))}return e}function me(t,i=!0){return t instanceof Object&&t.constructor===Object&&(i||Object.keys(t).length!==0)}function ie(t,...i){return xr(t)?t(...i):t}function Re(t,i=!0){return typeof t=="string"&&(i||t!=="")}function Rr(t){return Re(t)?t.replace(/(-|_)/g,"").toLowerCase():t}function un(t,i="",e={}){let n=Rr(i).split("."),r=n.shift();return r?me(t)?un(ie(t[Object.keys(t).find(o=>Rr(o)===r)||""],e),n.join("."),e):void 0:ie(t,e)}function cn(t,i=!0){return Array.isArray(t)&&(i||t.length!==0)}function hd(t){return t instanceof Date&&t.constructor===Date}function Nr(t){return T(t)&&!isNaN(t)}function fd(t=""){return T(t)&&t.length===1&&!!t.match(/\S| /)}function Y(t,i){if(i){let e=i.test(t);return i.lastIndex=0,e}return!1}function je(t){return t&&t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":")}function Z(t){if(t&&/[\xC0-\xFF\u0100-\u017E]/.test(t)){let e={A:/[\xC0-\xC5\u0100\u0102\u0104]/g,AE:/[\xC6]/g,C:/[\xC7\u0106\u0108\u010A\u010C]/g,D:/[\xD0\u010E\u0110]/g,E:/[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g,G:/[\u011C\u011E\u0120\u0122]/g,H:/[\u0124\u0126]/g,I:/[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g,IJ:/[\u0132]/g,J:/[\u0134]/g,K:/[\u0136]/g,L:/[\u0139\u013B\u013D\u013F\u0141]/g,N:/[\xD1\u0143\u0145\u0147\u014A]/g,O:/[\xD2-\xD6\xD8\u014C\u014E\u0150]/g,OE:/[\u0152]/g,R:/[\u0154\u0156\u0158]/g,S:/[\u015A\u015C\u015E\u0160]/g,T:/[\u0162\u0164\u0166]/g,U:/[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g,W:/[\u0174]/g,Y:/[\xDD\u0176\u0178]/g,Z:/[\u0179\u017B\u017D]/g,a:/[\xE0-\xE5\u0101\u0103\u0105]/g,ae:/[\xE6]/g,c:/[\xE7\u0107\u0109\u010B\u010D]/g,d:/[\u010F\u0111]/g,e:/[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g,g:/[\u011D\u011F\u0121\u0123]/g,i:/[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g,ij:/[\u0133]/g,j:/[\u0135]/g,k:/[\u0137,\u0138]/g,l:/[\u013A\u013C\u013E\u0140\u0142]/g,n:/[\xF1\u0144\u0146\u0148\u014B]/g,p:/[\xFE]/g,o:/[\xF2-\xF6\xF8\u014D\u014F\u0151]/g,oe:/[\u0153]/g,r:/[\u0155\u0157\u0159]/g,s:/[\u015B\u015D\u015F\u0161]/g,t:/[\u0163\u0165\u0167]/g,u:/[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g,w:/[\u0175]/g,y:/[\xFD\xFF\u0177]/g,z:/[\u017A\u017C\u017E]/g};for(let n in e)t=t.replace(e[n],n)}return t}function dn(t){return Re(t)?t.replace(/(_)/g,"-").replace(/[A-Z]/g,(i,e)=>e===0?i:"-"+i.toLowerCase()).toLowerCase():t}function ui(t){return Re(t)?t.replace(/[A-Z]/g,(i,e)=>e===0?i:"."+i.toLowerCase()).toLowerCase():t}var hn={};function _t(t="pui_id_"){return hn.hasOwnProperty(t)||(hn[t]=0),hn[t]++,`${t}${hn[t]}`}function Hs(){let t=[],i=(s,a,l=999)=>{let u=r(s,a,l),c=u.value+(u.key===s?0:l)+1;return t.push({key:s,value:c}),c},e=s=>{t=t.filter(a=>a.value!==s)},n=(s,a)=>r(s,a).value,r=(s,a,l=0)=>[...t].reverse().find(u=>a?!0:u.key===s)||{key:s,value:l},o=s=>s&&parseInt(s.style.zIndex,10)||0;return{get:o,set:(s,a,l)=>{a&&(a.style.zIndex=String(i(s,!0,l)))},clear:s=>{s&&(e(o(s)),s.style.zIndex="")},getCurrent:s=>n(s,!0)}}var md=Hs();var Lr=["*"];var P=(()=>{class t{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static IN="in";static LESS_THAN="lt";static LESS_THAN_OR_EQUAL_TO="lte";static GREATER_THAN="gt";static GREATER_THAN_OR_EQUAL_TO="gte";static BETWEEN="between";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static DATE_IS="dateIs";static DATE_IS_NOT="dateIsNot";static DATE_BEFORE="dateBefore";static DATE_AFTER="dateAfter"}return t})(),Id=(()=>{class t{static AND="and";static OR="or"}return t})(),Od=(()=>{class t{filter(e,n,r,o,s){let a=[];if(e)for(let l of e)for(let u of n){let c=ln(l,u);if(this.filters[o](c,r,s)){a.push(l);break}}return a}filters={startsWith:(e,n,r)=>{if(n==null||n.trim()==="")return!0;if(e==null)return!1;let o=Z(n.toString()).toLocaleLowerCase(r);return Z(e.toString()).toLocaleLowerCase(r).slice(0,o.length)===o},contains:(e,n,r)=>{if(n==null||typeof n=="string"&&n.trim()==="")return!0;if(e==null)return!1;let o=Z(n.toString()).toLocaleLowerCase(r);return Z(e.toString()).toLocaleLowerCase(r).indexOf(o)!==-1},notContains:(e,n,r)=>{if(n==null||typeof n=="string"&&n.trim()==="")return!0;if(e==null)return!1;let o=Z(n.toString()).toLocaleLowerCase(r);return Z(e.toString()).toLocaleLowerCase(r).indexOf(o)===-1},endsWith:(e,n,r)=>{if(n==null||n.trim()==="")return!0;if(e==null)return!1;let o=Z(n.toString()).toLocaleLowerCase(r),s=Z(e.toString()).toLocaleLowerCase(r);return s.indexOf(o,s.length-o.length)!==-1},equals:(e,n,r)=>n==null||typeof n=="string"&&n.trim()===""?!0:e==null?!1:e.getTime&&n.getTime?e.getTime()===n.getTime():e==n?!0:Z(e.toString()).toLocaleLowerCase(r)==Z(n.toString()).toLocaleLowerCase(r),notEquals:(e,n,r)=>n==null||typeof n=="string"&&n.trim()===""?!1:e==null?!0:e.getTime&&n.getTime?e.getTime()!==n.getTime():e==n?!1:Z(e.toString()).toLocaleLowerCase(r)!=Z(n.toString()).toLocaleLowerCase(r),in:(e,n)=>{if(n==null||n.length===0)return!0;for(let r=0;r<n.length;r++)if(li(e,n[r]))return!0;return!1},between:(e,n)=>n==null||n[0]==null||n[1]==null?!0:e==null?!1:e.getTime?n[0].getTime()<=e.getTime()&&e.getTime()<=n[1].getTime():n[0]<=e&&e<=n[1],lt:(e,n,r)=>n==null?!0:e==null?!1:e.getTime&&n.getTime?e.getTime()<n.getTime():e<n,lte:(e,n,r)=>n==null?!0:e==null?!1:e.getTime&&n.getTime?e.getTime()<=n.getTime():e<=n,gt:(e,n,r)=>n==null?!0:e==null?!1:e.getTime&&n.getTime?e.getTime()>n.getTime():e>n,gte:(e,n,r)=>n==null?!0:e==null?!1:e.getTime&&n.getTime?e.getTime()>=n.getTime():e>=n,is:(e,n,r)=>this.filters.equals(e,n,r),isNot:(e,n,r)=>this.filters.notEquals(e,n,r),before:(e,n,r)=>this.filters.lt(e,n,r),after:(e,n,r)=>this.filters.gt(e,n,r),dateIs:(e,n)=>n==null?!0:e==null?!1:e.toDateString()===n.toDateString(),dateIsNot:(e,n)=>n==null?!0:e==null?!1:e.toDateString()!==n.toDateString(),dateBefore:(e,n)=>n==null?!0:e==null?!1:e.getTime()<n.getTime(),dateAfter:(e,n)=>n==null?!0:e==null?!1:(e.setHours(0,0,0,0),e.getTime()>n.getTime())};register(e,n){this.filters[e]=n}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Md=(()=>{class t{clickSource=new we;clickObservable=this.clickSource.asObservable();add(e){e&&this.clickSource.next(e)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Rd=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275cmp=K({type:t,selectors:[["p-header"]],standalone:!1,ngContentSelectors:Lr,decls:1,vars:0,template:function(n,r){n&1&&($e(),Ve(0))},encapsulation:2})}return t})(),xd=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275cmp=K({type:t,selectors:[["p-footer"]],standalone:!1,ngContentSelectors:Lr,decls:1,vars:0,template:function(n,r){n&1&&($e(),Ve(0))},encapsulation:2})}return t})(),Pr=(()=>{class t{template;type;name;constructor(e){this.template=e}getType(){return this.name}static \u0275fac=function(n){return new(n||t)(p(ct))};static \u0275dir=_({type:t,selectors:[["","pTemplate",""]],inputs:{type:"type",name:[0,"pTemplate","name"]}})}return t})(),xe=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[Me]})}return t})(),Nd=(()=>{class t{static STARTS_WITH="startsWith";static CONTAINS="contains";static NOT_CONTAINS="notContains";static ENDS_WITH="endsWith";static EQUALS="equals";static NOT_EQUALS="notEquals";static NO_FILTER="noFilter";static LT="lt";static LTE="lte";static GT="gt";static GTE="gte";static IS="is";static IS_NOT="isNot";static BEFORE="before";static AFTER="after";static CLEAR="clear";static APPLY="apply";static MATCH_ALL="matchAll";static MATCH_ANY="matchAny";static ADD_RULE="addRule";static REMOVE_RULE="removeRule";static ACCEPT="accept";static REJECT="reject";static CHOOSE="choose";static UPLOAD="upload";static CANCEL="cancel";static PENDING="pending";static FILE_SIZE_TYPES="fileSizeTypes";static DAY_NAMES="dayNames";static DAY_NAMES_SHORT="dayNamesShort";static DAY_NAMES_MIN="dayNamesMin";static MONTH_NAMES="monthNames";static MONTH_NAMES_SHORT="monthNamesShort";static FIRST_DAY_OF_WEEK="firstDayOfWeek";static TODAY="today";static WEEK_HEADER="weekHeader";static WEAK="weak";static MEDIUM="medium";static STRONG="strong";static PASSWORD_PROMPT="passwordPrompt";static EMPTY_MESSAGE="emptyMessage";static EMPTY_FILTER_MESSAGE="emptyFilterMessage";static SHOW_FILTER_MENU="showFilterMenu";static HIDE_FILTER_MENU="hideFilterMenu";static SELECTION_MESSAGE="selectionMessage";static ARIA="aria";static SELECT_COLOR="selectColor";static BROWSE_FILES="browseFiles"}return t})();var zs=Object.defineProperty,Ws=Object.defineProperties,Gs=Object.getOwnPropertyDescriptors,fn=Object.getOwnPropertySymbols,Vr=Object.prototype.hasOwnProperty,Br=Object.prototype.propertyIsEnumerable,kr=(t,i,e)=>i in t?zs(t,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[i]=e,he=(t,i)=>{for(var e in i||(i={}))Vr.call(i,e)&&kr(t,e,i[e]);if(fn)for(var e of fn(i))Br.call(i,e)&&kr(t,e,i[e]);return t},ci=(t,i)=>Ws(t,Gs(i)),ye=(t,i)=>{var e={};for(var n in t)Vr.call(t,n)&&i.indexOf(n)<0&&(e[n]=t[n]);if(t!=null&&fn)for(var n of fn(t))i.indexOf(n)<0&&Br.call(t,n)&&(e[n]=t[n]);return e};var Ks=Mr(),X=Ks;function $r(t,i){cn(t)?t.push(...i||[]):me(t)&&Object.assign(t,i)}function qs(t){return me(t)&&t.hasOwnProperty("value")&&t.hasOwnProperty("type")?t.value:t}function Ys(t){return t.replaceAll(/ /g,"").replace(/[^\w]/g,"-")}function di(t="",i=""){return Ys(`${Re(t,!1)&&Re(i,!1)?`${t}-`:t}${i}`)}function Ur(t="",i=""){return`--${di(t,i)}`}function Zs(t=""){let i=(t.match(/{/g)||[]).length,e=(t.match(/}/g)||[]).length;return(i+e)%2!==0}function jr(t,i="",e="",n=[],r){if(Re(t)){let o=/{([^}]*)}/g,s=t.trim();if(Zs(s))return;if(Y(s,o)){let a=s.replaceAll(o,c=>{let f=c.replace(/{|}/g,"").split(".").filter(h=>!n.some(y=>Y(h,y)));return`var(${Ur(e,dn(f.join("-")))}${T(r)?`, ${r}`:""})`}),l=/(\d+\s+[\+\-\*\/]\s+\d+)/g,u=/var\([^)]+\)/g;return Y(a.replace(u,"0"),l)?`calc(${a})`:a}return s}else if(Nr(t))return t}function Xs(t,i,e){Re(i,!1)&&t.push(`${i}:${e};`)}function Ze(t,i){return t?`${t}{${i}}`:""}var Hd=t=>{var i;let e=F.getTheme(),n=hi(e,t,void 0,"variable"),r=(i=n?.match(/--[\w-]+/g))==null?void 0:i[0],o=hi(e,t,void 0,"value");return{name:r,variable:n,value:o}},Xe=(...t)=>hi(F.getTheme(),...t),hi=(t={},i,e,n)=>{if(i){let{variable:r,options:o}=F.defaults||{},{prefix:s,transform:a}=t?.options||o||{},u=Y(i,/{([^}]*)}/g)?i:`{${i}}`;return n==="value"||z(n)&&a==="strict"?F.getTokenValue(i):jr(u,void 0,s,[r.excludedKeyRegex],e)}return""};function Js(t,i={}){let e=F.defaults.variable,{prefix:n=e.prefix,selector:r=e.selector,excludedKeyRegex:o=e.excludedKeyRegex}=i,s=(u,c="")=>Object.entries(u).reduce((d,[f,h])=>{let y=Y(f,o)?di(c):di(c,dn(f)),g=qs(h);if(me(g)){let{variables:b,tokens:S}=s(g,y);$r(d.tokens,S),$r(d.variables,b)}else d.tokens.push((n?y.replace(`${n}-`,""):y).replaceAll("-",".")),Xs(d.variables,Ur(y),jr(g,y,n,[o]));return d},{variables:[],tokens:[]}),{variables:a,tokens:l}=s(t,n);return{value:a,tokens:l,declarations:a.join(""),css:Ze(r,a.join(""))}}var de={regex:{rules:{class:{pattern:/^\.([a-zA-Z][\w-]*)$/,resolve(t){return{type:"class",selector:t,matched:this.pattern.test(t.trim())}}},attr:{pattern:/^\[(.*)\]$/,resolve(t){return{type:"attr",selector:`:root${t}`,matched:this.pattern.test(t.trim())}}},media:{pattern:/^@media (.*)$/,resolve(t){return{type:"media",selector:`${t}{:root{[CSS]}}`,matched:this.pattern.test(t.trim())}}},system:{pattern:/^system$/,resolve(t){return{type:"system",selector:"@media (prefers-color-scheme: dark){:root{[CSS]}}",matched:this.pattern.test(t.trim())}}},custom:{resolve(t){return{type:"custom",selector:t,matched:!0}}}},resolve(t){let i=Object.keys(this.rules).filter(e=>e!=="custom").map(e=>this.rules[e]);return[t].flat().map(e=>{var n;return(n=i.map(r=>r.resolve(e)).find(r=>r.matched))!=null?n:this.rules.custom.resolve(e)})}},_toVariables(t,i){return Js(t,{prefix:i?.prefix})},getCommon({name:t="",theme:i={},params:e,set:n,defaults:r}){var o,s,a,l,u,c,d;let{preset:f,options:h}=i,y,g,b,S,E,A,M;if(T(f)&&h.transform!=="strict"){let{primitive:oe,semantic:Q,extend:Ce}=f,Ee=Q||{},{colorScheme:Mt}=Ee,Rt=ye(Ee,["colorScheme"]),xt=Ce||{},{colorScheme:Nt}=xt,lt=ye(xt,["colorScheme"]),ut=Mt||{},{dark:Lt}=ut,Pt=ye(ut,["dark"]),kt=Nt||{},{dark:$t}=kt,Vt=ye(kt,["dark"]),Bt=T(oe)?this._toVariables({primitive:oe},h):{},Ut=T(Rt)?this._toVariables({semantic:Rt},h):{},jt=T(Pt)?this._toVariables({light:Pt},h):{},ki=T(Lt)?this._toVariables({dark:Lt},h):{},$i=T(lt)?this._toVariables({semantic:lt},h):{},Vi=T(Vt)?this._toVariables({light:Vt},h):{},Bi=T($t)?this._toVariables({dark:$t},h):{},[Qo,es]=[(o=Bt.declarations)!=null?o:"",Bt.tokens],[ts,ns]=[(s=Ut.declarations)!=null?s:"",Ut.tokens||[]],[is,rs]=[(a=jt.declarations)!=null?a:"",jt.tokens||[]],[os,ss]=[(l=ki.declarations)!=null?l:"",ki.tokens||[]],[as,ls]=[(u=$i.declarations)!=null?u:"",$i.tokens||[]],[us,cs]=[(c=Vi.declarations)!=null?c:"",Vi.tokens||[]],[ds,hs]=[(d=Bi.declarations)!=null?d:"",Bi.tokens||[]];y=this.transformCSS(t,Qo,"light","variable",h,n,r),g=es;let fs=this.transformCSS(t,`${ts}${is}`,"light","variable",h,n,r),ps=this.transformCSS(t,`${os}`,"dark","variable",h,n,r);b=`${fs}${ps}`,S=[...new Set([...ns,...rs,...ss])];let gs=this.transformCSS(t,`${as}${us}color-scheme:light`,"light","variable",h,n,r),ms=this.transformCSS(t,`${ds}color-scheme:dark`,"dark","variable",h,n,r);E=`${gs}${ms}`,A=[...new Set([...ls,...cs,...hs])],M=ie(f.css,{dt:Xe})}return{primitive:{css:y,tokens:g},semantic:{css:b,tokens:S},global:{css:E,tokens:A},style:M}},getPreset({name:t="",preset:i={},options:e,params:n,set:r,defaults:o,selector:s}){var a,l,u;let c,d,f;if(T(i)&&e.transform!=="strict"){let h=t.replace("-directive",""),y=i,{colorScheme:g,extend:b,css:S}=y,E=ye(y,["colorScheme","extend","css"]),A=b||{},{colorScheme:M}=A,oe=ye(A,["colorScheme"]),Q=g||{},{dark:Ce}=Q,Ee=ye(Q,["dark"]),Mt=M||{},{dark:Rt}=Mt,xt=ye(Mt,["dark"]),Nt=T(E)?this._toVariables({[h]:he(he({},E),oe)},e):{},lt=T(Ee)?this._toVariables({[h]:he(he({},Ee),xt)},e):{},ut=T(Ce)?this._toVariables({[h]:he(he({},Ce),Rt)},e):{},[Lt,Pt]=[(a=Nt.declarations)!=null?a:"",Nt.tokens||[]],[kt,$t]=[(l=lt.declarations)!=null?l:"",lt.tokens||[]],[Vt,Bt]=[(u=ut.declarations)!=null?u:"",ut.tokens||[]],Ut=this.transformCSS(h,`${Lt}${kt}`,"light","variable",e,r,o,s),jt=this.transformCSS(h,Vt,"dark","variable",e,r,o,s);c=`${Ut}${jt}`,d=[...new Set([...Pt,...$t,...Bt])],f=ie(S,{dt:Xe})}return{css:c,tokens:d,style:f}},getPresetC({name:t="",theme:i={},params:e,set:n,defaults:r}){var o;let{preset:s,options:a}=i,l=(o=s?.components)==null?void 0:o[t];return this.getPreset({name:t,preset:l,options:a,params:e,set:n,defaults:r})},getPresetD({name:t="",theme:i={},params:e,set:n,defaults:r}){var o;let s=t.replace("-directive",""),{preset:a,options:l}=i,u=(o=a?.directives)==null?void 0:o[s];return this.getPreset({name:s,preset:u,options:l,params:e,set:n,defaults:r})},applyDarkColorScheme(t){return!(t.darkModeSelector==="none"||t.darkModeSelector===!1)},getColorSchemeOption(t,i){var e;return this.applyDarkColorScheme(t)?this.regex.resolve(t.darkModeSelector===!0?i.options.darkModeSelector:(e=t.darkModeSelector)!=null?e:i.options.darkModeSelector):[]},getLayerOrder(t,i={},e,n){let{cssLayer:r}=i;return r?`@layer ${ie(r.order||"primeui",e)}`:""},getCommonStyleSheet({name:t="",theme:i={},params:e,props:n={},set:r,defaults:o}){let s=this.getCommon({name:t,theme:i,params:e,set:r,defaults:o}),a=Object.entries(n).reduce((l,[u,c])=>l.push(`${u}="${c}"`)&&l,[]).join(" ");return Object.entries(s||{}).reduce((l,[u,c])=>{if(c?.css){let d=je(c?.css),f=`${u}-variables`;l.push(`<style type="text/css" data-primevue-style-id="${f}" ${a}>${d}</style>`)}return l},[]).join("")},getStyleSheet({name:t="",theme:i={},params:e,props:n={},set:r,defaults:o}){var s;let a={name:t,theme:i,params:e,set:r,defaults:o},l=(s=t.includes("-directive")?this.getPresetD(a):this.getPresetC(a))==null?void 0:s.css,u=Object.entries(n).reduce((c,[d,f])=>c.push(`${d}="${f}"`)&&c,[]).join(" ");return l?`<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${je(l)}</style>`:""},createTokens(t={},i,e="",n="",r={}){return Object.entries(t).forEach(([o,s])=>{let a=Y(o,i.variable.excludedKeyRegex)?e:e?`${e}.${ui(o)}`:ui(o),l=n?`${n}.${o}`:o;me(s)?this.createTokens(s,i,a,l,r):(r[a]||(r[a]={paths:[],computed(u,c={}){var d,f;return this.paths.length===1?(d=this.paths[0])==null?void 0:d.computed(this.paths[0].scheme,c.binding):u&&u!=="none"?(f=this.paths.find(h=>h.scheme===u))==null?void 0:f.computed(u,c.binding):this.paths.map(h=>h.computed(h.scheme,c[h.scheme]))}}),r[a].paths.push({path:l,value:s,scheme:l.includes("colorScheme.light")?"light":l.includes("colorScheme.dark")?"dark":"none",computed(u,c={}){let d=/{([^}]*)}/g,f=s;if(c.name=this.path,c.binding||(c.binding={}),Y(s,d)){let y=s.trim().replaceAll(d,S=>{var E;let A=S.replace(/{|}/g,""),M=(E=r[A])==null?void 0:E.computed(u,c);return cn(M)&&M.length===2?`light-dark(${M[0].value},${M[1].value})`:M?.value}),g=/(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g,b=/var\([^)]+\)/g;f=Y(y.replace(b,"0"),g)?`calc(${y})`:y}return z(c.binding)&&delete c.binding,{colorScheme:u,path:this.path,paths:c,value:f.includes("undefined")?void 0:f}}}))}),r},getTokenValue(t,i,e){var n;let o=(l=>l.split(".").filter(c=>!Y(c.toLowerCase(),e.variable.excludedKeyRegex)).join("."))(i),s=i.includes("colorScheme.light")?"light":i.includes("colorScheme.dark")?"dark":void 0,a=[(n=t[o])==null?void 0:n.computed(s)].flat().filter(l=>l);return a.length===1?a[0].value:a.reduce((l={},u)=>{let c=u,{colorScheme:d}=c,f=ye(c,["colorScheme"]);return l[d]=f,l},void 0)},getSelectorRule(t,i,e,n){return e==="class"||e==="attr"?Ze(T(i)?`${t}${i},${t} ${i}`:t,n):Ze(t,T(i)?Ze(i,n):n)},transformCSS(t,i,e,n,r={},o,s,a){if(T(i)){let{cssLayer:l}=r;if(n!=="style"){let u=this.getColorSchemeOption(r,s);i=e==="dark"?u.reduce((c,{type:d,selector:f})=>(T(f)&&(c+=f.includes("[CSS]")?f.replace("[CSS]",i):this.getSelectorRule(f,a,d,i)),c),""):Ze(a??":root",i)}if(l){let u={name:"primeui",order:"primeui"};me(l)&&(u.name=ie(l.name,{name:t,type:n})),T(u.name)&&(i=Ze(`@layer ${u.name}`,i),o?.layerNames(u.name))}return i}return""}},F={defaults:{variable:{prefix:"p",selector:":root",excludedKeyRegex:/^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi},options:{prefix:"p",darkModeSelector:"system",cssLayer:!1}},_theme:void 0,_layerNames:new Set,_loadedStyleNames:new Set,_loadingStyles:new Set,_tokens:{},update(t={}){let{theme:i}=t;i&&(this._theme=ci(he({},i),{options:he(he({},this.defaults.options),i.options)}),this._tokens=de.createTokens(this.preset,this.defaults),this.clearLoadedStyleNames())},get theme(){return this._theme},get preset(){var t;return((t=this.theme)==null?void 0:t.preset)||{}},get options(){var t;return((t=this.theme)==null?void 0:t.options)||{}},get tokens(){return this._tokens},getTheme(){return this.theme},setTheme(t){this.update({theme:t}),X.emit("theme:change",t)},getPreset(){return this.preset},setPreset(t){this._theme=ci(he({},this.theme),{preset:t}),this._tokens=de.createTokens(t,this.defaults),this.clearLoadedStyleNames(),X.emit("preset:change",t),X.emit("theme:change",this.theme)},getOptions(){return this.options},setOptions(t){this._theme=ci(he({},this.theme),{options:t}),this.clearLoadedStyleNames(),X.emit("options:change",t),X.emit("theme:change",this.theme)},getLayerNames(){return[...this._layerNames]},setLayerNames(t){this._layerNames.add(t)},getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(t){return this._loadedStyleNames.has(t)},setLoadedStyleName(t){this._loadedStyleNames.add(t)},deleteLoadedStyleName(t){this._loadedStyleNames.delete(t)},clearLoadedStyleNames(){this._loadedStyleNames.clear()},getTokenValue(t){return de.getTokenValue(this.tokens,t,this.defaults)},getCommon(t="",i){return de.getCommon({name:t,theme:this.theme,params:i,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getComponent(t="",i){let e={name:t,theme:this.theme,params:i,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return de.getPresetC(e)},getDirective(t="",i){let e={name:t,theme:this.theme,params:i,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return de.getPresetD(e)},getCustomPreset(t="",i,e,n){let r={name:t,preset:i,options:this.options,selector:e,params:n,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}};return de.getPreset(r)},getLayerOrderCSS(t=""){return de.getLayerOrder(t,this.options,{names:this.getLayerNames()},this.defaults)},transformCSS(t="",i,e="style",n){return de.transformCSS(t,i,n,e,this.options,{layerNames:this.setLayerNames.bind(this)},this.defaults)},getCommonStyleSheet(t="",i,e={}){return de.getCommonStyleSheet({name:t,theme:this.theme,params:i,props:e,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},getStyleSheet(t,i,e={}){return de.getStyleSheet({name:t,theme:this.theme,params:i,props:e,defaults:this.defaults,set:{layerNames:this.setLayerNames.bind(this)}})},onStyleMounted(t){this._loadingStyles.add(t)},onStyleUpdated(t){this._loadingStyles.add(t)},onStyleLoaded(t,{name:i}){this._loadingStyles.size&&(this._loadingStyles.delete(i),X.emit(`theme:${i}:load`,t),!this._loadingStyles.size&&X.emit("theme:load"))}};var Qs=0,Hr=(()=>{class t{document=m(j);use(e,n={}){let r=!1,o=e,s=null,{immediate:a=!0,manual:l=!1,name:u=`style_${++Qs}`,id:c=void 0,media:d=void 0,nonce:f=void 0,first:h=!1,props:y={}}=n;if(this.document){if(s=this.document.querySelector(`style[data-primeng-style-id="${u}"]`)||c&&this.document.getElementById(c)||this.document.createElement("style"),!s.isConnected){o=e;let g=this.document.head;h&&g.firstChild?g.insertBefore(s,g.firstChild):g.appendChild(s),an(s,{type:"text/css",media:d,nonce:f,"data-primeng-style-id":u})}return s.textContent!==o&&(s.textContent=o),{id:c,name:u,el:s,css:o}}}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Je={_loadedStyleNames:new Set,getLoadedStyleNames(){return this._loadedStyleNames},isStyleNameLoaded(t){return this._loadedStyleNames.has(t)},setLoadedStyleName(t){this._loadedStyleNames.add(t)},deleteLoadedStyleName(t){this._loadedStyleNames.delete(t)},clearLoadedStyleNames(){this._loadedStyleNames.clear()}},ea=({dt:t})=>`
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
`,ta=({dt:t})=>`
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
`,B=(()=>{class t{name="base";useStyle=m(Hr);theme=void 0;css=void 0;classes={};inlineStyles={};load=(e,n={},r=o=>o)=>{let o=r(ie(e,{dt:Xe}));return o?this.useStyle.use(je(o),D({name:this.name},n)):{}};loadCSS=(e={})=>this.load(this.css,e);loadTheme=(e={},n="")=>this.load(this.theme,e,(r="")=>F.transformCSS(e.name||this.name,`${r}${n}`));loadGlobalCSS=(e={})=>this.load(ta,e);loadGlobalTheme=(e={},n="")=>this.load(ea,e,(r="")=>F.transformCSS(e.name||this.name,`${r}${n}`));getCommonTheme=e=>F.getCommon(this.name,e);getComponentTheme=e=>F.getComponent(this.name,e);getDirectiveTheme=e=>F.getDirective(this.name,e);getPresetTheme=(e,n,r)=>F.getCustomPreset(this.name,e,n,r);getLayerOrderThemeCSS=()=>F.getLayerOrderCSS(this.name);getStyleSheet=(e="",n={})=>{if(this.css){let r=ie(this.css,{dt:Xe}),o=je(`${r}${e}`),s=Object.entries(n).reduce((a,[l,u])=>a.push(`${l}="${u}"`)&&a,[]).join(" ");return`<style type="text/css" data-primeng-style-id="${this.name}" ${s}>${o}</style>`}return""};getCommonThemeStyleSheet=(e,n={})=>F.getCommonStyleSheet(this.name,e,n);getThemeStyleSheet=(e,n={})=>{let r=[F.getStyleSheet(this.name,e,n)];if(this.theme){let o=this.name==="base"?"global-style":`${this.name}-style`,s=ie(this.theme,{dt:Xe}),a=je(F.transformCSS(o,s)),l=Object.entries(n).reduce((u,[c,d])=>u.push(`${c}="${d}"`)&&u,[]).join(" ");r.push(`<style type="text/css" data-primeng-style-id="${o}" ${l}>${a}</style>`)}return r.join("")};static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var na=(()=>{class t{theme=ne(void 0);csp=ne({nonce:void 0});isThemeChanged=!1;document=m(j);baseStyle=m(B);constructor(){gt(()=>{X.on("theme:change",e=>{ue(()=>{this.isThemeChanged=!0,this.theme.set(e)})})}),gt(()=>{let e=this.theme();this.document&&e&&(this.isThemeChanged||this.onThemeChange(e),this.isThemeChanged=!1)})}ngOnDestroy(){F.clearLoadedStyleNames(),X.clear()}onThemeChange(e){F.setTheme(e),this.document&&this.loadCommonTheme()}loadCommonTheme(){if(this.theme()!=="none"&&!F.isStyleNameLoaded("common")){let{primitive:e,semantic:n,global:r,style:o}=this.baseStyle.getCommonTheme?.()||{},s={nonce:this.csp?.()?.nonce};this.baseStyle.load(e?.css,D({name:"primitive-variables"},s)),this.baseStyle.load(n?.css,D({name:"semantic-variables"},s)),this.baseStyle.load(r?.css,D({name:"global-variables"},s)),this.baseStyle.loadGlobalTheme(D({name:"global-style"},s),o),F.setLoadedStyleName("common")}}setThemeConfig(e){let{theme:n,csp:r}=e||{};n&&this.theme.set(n),r&&this.csp.set(r)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),pi=(()=>{class t extends na{ripple=ne(!1);platformId=m(Pe);inputStyle=ne(null);inputVariant=ne(null);overlayOptions={};csp=ne({nonce:void 0});filterMatchModeOptions={text:[P.STARTS_WITH,P.CONTAINS,P.NOT_CONTAINS,P.ENDS_WITH,P.EQUALS,P.NOT_EQUALS],numeric:[P.EQUALS,P.NOT_EQUALS,P.LESS_THAN,P.LESS_THAN_OR_EQUAL_TO,P.GREATER_THAN,P.GREATER_THAN_OR_EQUAL_TO],date:[P.DATE_IS,P.DATE_IS_NOT,P.DATE_BEFORE,P.DATE_AFTER]};translation={startsWith:"Starts with",contains:"Contains",notContains:"Not contains",endsWith:"Ends with",equals:"Equals",notEquals:"Not equals",noFilter:"No Filter",lt:"Less than",lte:"Less than or equal to",gt:"Greater than",gte:"Greater than or equal to",is:"Is",isNot:"Is not",before:"Before",after:"After",dateIs:"Date is",dateIsNot:"Date is not",dateBefore:"Date is before",dateAfter:"Date is after",clear:"Clear",apply:"Apply",matchAll:"Match All",matchAny:"Match Any",addRule:"Add Rule",removeRule:"Remove Rule",accept:"Yes",reject:"No",choose:"Choose",upload:"Upload",cancel:"Cancel",pending:"Pending",fileSizeTypes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],chooseYear:"Choose Year",chooseMonth:"Choose Month",chooseDate:"Choose Date",prevDecade:"Previous Decade",nextDecade:"Next Decade",prevYear:"Previous Year",nextYear:"Next Year",prevMonth:"Previous Month",nextMonth:"Next Month",prevHour:"Previous Hour",nextHour:"Next Hour",prevMinute:"Previous Minute",nextMinute:"Next Minute",prevSecond:"Previous Second",nextSecond:"Next Second",am:"am",pm:"pm",dateFormat:"mm/dd/yy",firstDayOfWeek:0,today:"Today",weekHeader:"Wk",weak:"Weak",medium:"Medium",strong:"Strong",passwordPrompt:"Enter a password",emptyMessage:"No results found",searchMessage:"Search results are available",selectionMessage:"{0} items selected",emptySelectionMessage:"No selected item",emptySearchMessage:"No results found",emptyFilterMessage:"No results found",fileChosenMessage:"Files",noFileChosenMessage:"No file chosen",aria:{trueLabel:"True",falseLabel:"False",nullLabel:"Not Selected",star:"1 star",stars:"{star} stars",selectAll:"All items selected",unselectAll:"All items unselected",close:"Close",previous:"Previous",next:"Next",navigation:"Navigation",scrollTop:"Scroll Top",moveTop:"Move Top",moveUp:"Move Up",moveDown:"Move Down",moveBottom:"Move Bottom",moveToTarget:"Move to Target",moveToSource:"Move to Source",moveAllToTarget:"Move All to Target",moveAllToSource:"Move All to Source",pageLabel:"{page}",firstPageLabel:"First Page",lastPageLabel:"Last Page",nextPageLabel:"Next Page",prevPageLabel:"Previous Page",rowsPerPageLabel:"Rows per page",previousPageLabel:"Previous Page",jumpToPageDropdownLabel:"Jump to Page Dropdown",jumpToPageInputLabel:"Jump to Page Input",selectRow:"Row Selected",unselectRow:"Row Unselected",expandRow:"Row Expanded",collapseRow:"Row Collapsed",showFilterMenu:"Show Filter Menu",hideFilterMenu:"Hide Filter Menu",filterOperator:"Filter Operator",filterConstraint:"Filter Constraint",editRow:"Row Edit",saveEdit:"Save Edit",cancelEdit:"Cancel Edit",listView:"List View",gridView:"Grid View",slide:"Slide",slideNumber:"{slideNumber}",zoomImage:"Zoom Image",zoomIn:"Zoom In",zoomOut:"Zoom Out",rotateRight:"Rotate Right",rotateLeft:"Rotate Left",listLabel:"Option List",selectColor:"Select a color",removeLabel:"Remove",browseFiles:"Browse Files",maximizeLabel:"Maximize"}};zIndex={modal:1100,overlay:1e3,menu:1e3,tooltip:1100};translationSource=new we;translationObserver=this.translationSource.asObservable();getTranslation(e){return this.translation[e]}setTranslation(e){this.translation=D(D({},this.translation),e),this.translationSource.next(this.translation)}setConfig(e){let{csp:n,ripple:r,inputStyle:o,inputVariant:s,theme:a,overlayOptions:l,translation:u,filterMatchModeOptions:c}=e||{};n&&this.csp.set(n),r&&this.ripple.set(r),o&&this.inputStyle.set(o),s&&this.inputVariant.set(s),l&&(this.overlayOptions=l),u&&this.setTranslation(u),c&&(this.filterMatchModeOptions=c),a&&this.setThemeConfig({theme:a,csp:n})}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),ia=new I("PRIME_NG_CONFIG");function fh(...t){let i=t?.map(n=>({provide:ia,useValue:n,multi:!1})),e=Xi(()=>{let n=m(pi);t?.forEach(r=>n.setConfig(r))});return Wt([...i,e])}var zr=(()=>{class t extends B{name="common";static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),re=(()=>{class t{document=m(j);platformId=m(Pe);el=m(G);injector=m(Kt);cd=m(Ge);renderer=m(ae);config=m(pi);baseComponentStyle=m(zr);baseStyle=m(B);scopedStyleEl;rootEl;dt;get styleOptions(){return{nonce:this.config?.csp().nonce}}get _name(){return this.constructor.name.replace(/^_/,"").toLowerCase()}get componentStyle(){return this._componentStyle}attrSelector=_t("pc");themeChangeListeners=[];_getHostInstance(e){if(e)return e?this.hostName?e.name===this.hostName?e:this._getHostInstance(e.parentInstance):e.parentInstance:void 0}_getOptionValue(e,n="",r={}){return un(e,n,r)}ngOnInit(){this.document&&this._loadStyles()}ngAfterViewInit(){this.rootEl=this.el?.nativeElement,this.rootEl&&this.rootEl?.setAttribute(this.attrSelector,"")}ngOnChanges(e){if(this.document&&!ti(this.platformId)){let{dt:n}=e;n&&n.currentValue&&(this._loadScopedThemeStyles(n.currentValue),this._themeChangeListener(()=>this._loadScopedThemeStyles(n.currentValue)))}}ngOnDestroy(){this._unloadScopedThemeStyles(),this.themeChangeListeners.forEach(e=>X.off("theme:change",e))}_loadStyles(){let e=()=>{Je.isStyleNameLoaded("base")||(this.baseStyle.loadGlobalCSS(this.styleOptions),Je.setLoadedStyleName("base")),this._loadThemeStyles()};e(),this._themeChangeListener(()=>e())}_loadCoreStyles(){!Je.isStyleNameLoaded("base")&&this._name&&(this.baseComponentStyle.loadCSS(this.styleOptions),this.componentStyle&&this.componentStyle?.loadCSS(this.styleOptions),Je.setLoadedStyleName(this.componentStyle?.name))}_loadThemeStyles(){if(!F.isStyleNameLoaded("common")){let{primitive:e,semantic:n,global:r,style:o}=this.componentStyle?.getCommonTheme?.()||{};this.baseStyle.load(e?.css,D({name:"primitive-variables"},this.styleOptions)),this.baseStyle.load(n?.css,D({name:"semantic-variables"},this.styleOptions)),this.baseStyle.load(r?.css,D({name:"global-variables"},this.styleOptions)),this.baseStyle.loadGlobalTheme(D({name:"global-style"},this.styleOptions),o),F.setLoadedStyleName("common")}if(!F.isStyleNameLoaded(this.componentStyle?.name)&&this.componentStyle?.name){let{css:e,style:n}=this.componentStyle?.getComponentTheme?.()||{};this.componentStyle?.load(e,D({name:`${this.componentStyle?.name}-variables`},this.styleOptions)),this.componentStyle?.loadTheme(D({name:`${this.componentStyle?.name}-style`},this.styleOptions),n),F.setLoadedStyleName(this.componentStyle?.name)}if(!F.isStyleNameLoaded("layer-order")){let e=this.componentStyle?.getLayerOrderThemeCSS?.();this.baseStyle.load(e,D({name:"layer-order",first:!0},this.styleOptions)),F.setLoadedStyleName("layer-order")}this.dt&&(this._loadScopedThemeStyles(this.dt),this._themeChangeListener(()=>this._loadScopedThemeStyles(this.dt)))}_loadScopedThemeStyles(e){let{css:n}=this.componentStyle?.getPresetTheme?.(e,`[${this.attrSelector}]`)||{},r=this.componentStyle?.load(n,D({name:`${this.attrSelector}-${this.componentStyle?.name}`},this.styleOptions));this.scopedStyleEl=r?.el}_unloadScopedThemeStyles(){this.scopedStyleEl?.remove()}_themeChangeListener(e=()=>{}){Je.clearLoadedStyleNames(),X.on("theme:change",e),this.themeChangeListeners.push(e)}cx(e,n){let r=this.parent?this.parent.componentStyle?.classes?.[e]:this.componentStyle?.classes?.[e];return typeof r=="function"?r({instance:this}):typeof r=="string"?r:e}sx(e){let n=this.componentStyle?.inlineStyles?.[e];return typeof n=="function"?n({instance:this}):typeof n=="string"?n:D({},n)}get parent(){return this.parentInstance}static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,inputs:{dt:"dt"},features:[O([zr,B]),W]})}return t})();var gi=(()=>{class t{static zindex=1e3;static calculatedScrollbarWidth=null;static calculatedScrollbarHeight=null;static browser;static addClass(e,n){e&&n&&(e.classList?e.classList.add(n):e.className+=" "+n)}static addMultipleClasses(e,n){if(e&&n)if(e.classList){let r=n.trim().split(" ");for(let o=0;o<r.length;o++)e.classList.add(r[o])}else{let r=n.split(" ");for(let o=0;o<r.length;o++)e.className+=" "+r[o]}}static removeClass(e,n){e&&n&&(e.classList?e.classList.remove(n):e.className=e.className.replace(new RegExp("(^|\\b)"+n.split(" ").join("|")+"(\\b|$)","gi")," "))}static removeMultipleClasses(e,n){e&&n&&[n].flat().filter(Boolean).forEach(r=>r.split(" ").forEach(o=>this.removeClass(e,o)))}static hasClass(e,n){return e&&n?e.classList?e.classList.contains(n):new RegExp("(^| )"+n+"( |$)","gi").test(e.className):!1}static siblings(e){return Array.prototype.filter.call(e.parentNode.children,function(n){return n!==e})}static find(e,n){return Array.from(e.querySelectorAll(n))}static findSingle(e,n){return this.isElement(e)?e.querySelector(n):null}static index(e){let n=e.parentNode.childNodes,r=0;for(var o=0;o<n.length;o++){if(n[o]==e)return r;n[o].nodeType==1&&r++}return-1}static indexWithinGroup(e,n){let r=e.parentNode?e.parentNode.childNodes:[],o=0;for(var s=0;s<r.length;s++){if(r[s]==e)return o;r[s].attributes&&r[s].attributes[n]&&r[s].nodeType==1&&o++}return-1}static appendOverlay(e,n,r="self"){r!=="self"&&e&&n&&this.appendChild(e,n)}static alignOverlay(e,n,r="self",o=!0){e&&n&&(o&&(e.style.minWidth=`${t.getOuterWidth(n)}px`),r==="self"?this.relativePosition(e,n):this.absolutePosition(e,n))}static relativePosition(e,n,r=!0){let o=E=>{if(E)return getComputedStyle(E).getPropertyValue("position")==="relative"?E:o(E.parentElement)},s=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:this.getHiddenElementDimensions(e),a=n.offsetHeight,l=n.getBoundingClientRect(),u=this.getWindowScrollTop(),c=this.getWindowScrollLeft(),d=this.getViewport(),h=o(e)?.getBoundingClientRect()||{top:-1*u,left:-1*c},y,g;l.top+a+s.height>d.height?(y=l.top-h.top-s.height,e.style.transformOrigin="bottom",l.top+y<0&&(y=-1*l.top)):(y=a+l.top-h.top,e.style.transformOrigin="top");let b=l.left+s.width-d.width,S=l.left-h.left;s.width>d.width?g=(l.left-h.left)*-1:b>0?g=S-b:g=l.left-h.left,e.style.top=y+"px",e.style.left=g+"px",r&&(e.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static absolutePosition(e,n,r=!0){let o=e.offsetParent?{width:e.offsetWidth,height:e.offsetHeight}:this.getHiddenElementDimensions(e),s=o.height,a=o.width,l=n.offsetHeight,u=n.offsetWidth,c=n.getBoundingClientRect(),d=this.getWindowScrollTop(),f=this.getWindowScrollLeft(),h=this.getViewport(),y,g;c.top+l+s>h.height?(y=c.top+d-s,e.style.transformOrigin="bottom",y<0&&(y=d)):(y=l+c.top+d,e.style.transformOrigin="top"),c.left+a>h.width?g=Math.max(0,c.left+f+u-a):g=c.left+f,e.style.top=y+"px",e.style.left=g+"px",r&&(e.style.marginTop=origin==="bottom"?"calc(var(--p-anchor-gutter) * -1)":"calc(var(--p-anchor-gutter))")}static getParents(e,n=[]){return e.parentNode===null?n:this.getParents(e.parentNode,n.concat([e.parentNode]))}static getScrollableParents(e){let n=[];if(e){let r=this.getParents(e),o=/(auto|scroll)/,s=a=>{let l=window.getComputedStyle(a,null);return o.test(l.getPropertyValue("overflow"))||o.test(l.getPropertyValue("overflowX"))||o.test(l.getPropertyValue("overflowY"))};for(let a of r){let l=a.nodeType===1&&a.dataset.scrollselectors;if(l){let u=l.split(",");for(let c of u){let d=this.findSingle(a,c);d&&s(d)&&n.push(d)}}a.nodeType!==9&&s(a)&&n.push(a)}}return n}static getHiddenElementOuterHeight(e){e.style.visibility="hidden",e.style.display="block";let n=e.offsetHeight;return e.style.display="none",e.style.visibility="visible",n}static getHiddenElementOuterWidth(e){e.style.visibility="hidden",e.style.display="block";let n=e.offsetWidth;return e.style.display="none",e.style.visibility="visible",n}static getHiddenElementDimensions(e){let n={};return e.style.visibility="hidden",e.style.display="block",n.width=e.offsetWidth,n.height=e.offsetHeight,e.style.display="none",e.style.visibility="visible",n}static scrollInView(e,n){let r=getComputedStyle(e).getPropertyValue("borderTopWidth"),o=r?parseFloat(r):0,s=getComputedStyle(e).getPropertyValue("paddingTop"),a=s?parseFloat(s):0,l=e.getBoundingClientRect(),c=n.getBoundingClientRect().top+document.body.scrollTop-(l.top+document.body.scrollTop)-o-a,d=e.scrollTop,f=e.clientHeight,h=this.getOuterHeight(n);c<0?e.scrollTop=d+c:c+h>f&&(e.scrollTop=d+c-f+h)}static fadeIn(e,n){e.style.opacity=0;let r=+new Date,o=0,s=function(){o=+e.style.opacity.replace(",",".")+(new Date().getTime()-r)/n,e.style.opacity=o,r=+new Date,+o<1&&(window.requestAnimationFrame&&requestAnimationFrame(s)||setTimeout(s,16))};s()}static fadeOut(e,n){var r=1,o=50,s=n,a=o/s;let l=setInterval(()=>{r=r-a,r<=0&&(r=0,clearInterval(l)),e.style.opacity=r},o)}static getWindowScrollTop(){let e=document.documentElement;return(window.pageYOffset||e.scrollTop)-(e.clientTop||0)}static getWindowScrollLeft(){let e=document.documentElement;return(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}static matches(e,n){var r=Element.prototype,o=r.matches||r.webkitMatchesSelector||r.mozMatchesSelector||r.msMatchesSelector||function(s){return[].indexOf.call(document.querySelectorAll(s),this)!==-1};return o.call(e,n)}static getOuterWidth(e,n){let r=e.offsetWidth;if(n){let o=getComputedStyle(e);r+=parseFloat(o.marginLeft)+parseFloat(o.marginRight)}return r}static getHorizontalPadding(e){let n=getComputedStyle(e);return parseFloat(n.paddingLeft)+parseFloat(n.paddingRight)}static getHorizontalMargin(e){let n=getComputedStyle(e);return parseFloat(n.marginLeft)+parseFloat(n.marginRight)}static innerWidth(e){let n=e.offsetWidth,r=getComputedStyle(e);return n+=parseFloat(r.paddingLeft)+parseFloat(r.paddingRight),n}static width(e){let n=e.offsetWidth,r=getComputedStyle(e);return n-=parseFloat(r.paddingLeft)+parseFloat(r.paddingRight),n}static getInnerHeight(e){let n=e.offsetHeight,r=getComputedStyle(e);return n+=parseFloat(r.paddingTop)+parseFloat(r.paddingBottom),n}static getOuterHeight(e,n){let r=e.offsetHeight;if(n){let o=getComputedStyle(e);r+=parseFloat(o.marginTop)+parseFloat(o.marginBottom)}return r}static getHeight(e){let n=e.offsetHeight,r=getComputedStyle(e);return n-=parseFloat(r.paddingTop)+parseFloat(r.paddingBottom)+parseFloat(r.borderTopWidth)+parseFloat(r.borderBottomWidth),n}static getWidth(e){let n=e.offsetWidth,r=getComputedStyle(e);return n-=parseFloat(r.paddingLeft)+parseFloat(r.paddingRight)+parseFloat(r.borderLeftWidth)+parseFloat(r.borderRightWidth),n}static getViewport(){let e=window,n=document,r=n.documentElement,o=n.getElementsByTagName("body")[0],s=e.innerWidth||r.clientWidth||o.clientWidth,a=e.innerHeight||r.clientHeight||o.clientHeight;return{width:s,height:a}}static getOffset(e){var n=e.getBoundingClientRect();return{top:n.top+(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0),left:n.left+(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0)}}static replaceElementWith(e,n){let r=e.parentNode;if(!r)throw"Can't replace element";return r.replaceChild(n,e)}static getUserAgent(){if(navigator&&this.isClient())return navigator.userAgent}static isIE(){var e=window.navigator.userAgent,n=e.indexOf("MSIE ");if(n>0)return!0;var r=e.indexOf("Trident/");if(r>0){var o=e.indexOf("rv:");return!0}var s=e.indexOf("Edge/");return s>0}static isIOS(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}static isAndroid(){return/(android)/i.test(navigator.userAgent)}static isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints>0}static appendChild(e,n){if(this.isElement(n))n.appendChild(e);else if(n&&n.el&&n.el.nativeElement)n.el.nativeElement.appendChild(e);else throw"Cannot append "+n+" to "+e}static removeChild(e,n){if(this.isElement(n))n.removeChild(e);else if(n.el&&n.el.nativeElement)n.el.nativeElement.removeChild(e);else throw"Cannot remove "+e+" from "+n}static removeElement(e){"remove"in Element.prototype?e.remove():e.parentNode.removeChild(e)}static isElement(e){return typeof HTMLElement=="object"?e instanceof HTMLElement:e&&typeof e=="object"&&e!==null&&e.nodeType===1&&typeof e.nodeName=="string"}static calculateScrollbarWidth(e){if(e){let n=getComputedStyle(e);return e.offsetWidth-e.clientWidth-parseFloat(n.borderLeftWidth)-parseFloat(n.borderRightWidth)}else{if(this.calculatedScrollbarWidth!==null)return this.calculatedScrollbarWidth;let n=document.createElement("div");n.className="p-scrollbar-measure",document.body.appendChild(n);let r=n.offsetWidth-n.clientWidth;return document.body.removeChild(n),this.calculatedScrollbarWidth=r,r}}static calculateScrollbarHeight(){if(this.calculatedScrollbarHeight!==null)return this.calculatedScrollbarHeight;let e=document.createElement("div");e.className="p-scrollbar-measure",document.body.appendChild(e);let n=e.offsetHeight-e.clientHeight;return document.body.removeChild(e),this.calculatedScrollbarWidth=n,n}static invokeElementMethod(e,n,r){e[n].apply(e,r)}static clearSelection(){if(window.getSelection)window.getSelection().empty?window.getSelection().empty():window.getSelection().removeAllRanges&&window.getSelection().rangeCount>0&&window.getSelection().getRangeAt(0).getClientRects().length>0&&window.getSelection().removeAllRanges();else if(document.selection&&document.selection.empty)try{document.selection.empty()}catch{}}static getBrowser(){if(!this.browser){let e=this.resolveUserAgent();this.browser={},e.browser&&(this.browser[e.browser]=!0,this.browser.version=e.version),this.browser.chrome?this.browser.webkit=!0:this.browser.webkit&&(this.browser.safari=!0)}return this.browser}static resolveUserAgent(){let e=navigator.userAgent.toLowerCase(),n=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:n[1]||"",version:n[2]||"0"}}static isInteger(e){return Number.isInteger?Number.isInteger(e):typeof e=="number"&&isFinite(e)&&Math.floor(e)===e}static isHidden(e){return!e||e.offsetParent===null}static isVisible(e){return e&&e.offsetParent!=null}static isExist(e){return e!==null&&typeof e<"u"&&e.nodeName&&e.parentNode}static focus(e,n){e&&document.activeElement!==e&&e.focus(n)}static getFocusableSelectorString(e=""){return`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`}static getFocusableElements(e,n=""){let r=this.find(e,this.getFocusableSelectorString(n)),o=[];for(let s of r){let a=getComputedStyle(s);this.isVisible(s)&&a.display!="none"&&a.visibility!="hidden"&&o.push(s)}return o}static getFocusableElement(e,n=""){let r=this.findSingle(e,this.getFocusableSelectorString(n));if(r){let o=getComputedStyle(r);if(this.isVisible(r)&&o.display!="none"&&o.visibility!="hidden")return r}return null}static getFirstFocusableElement(e,n=""){let r=this.getFocusableElements(e,n);return r.length>0?r[0]:null}static getLastFocusableElement(e,n){let r=this.getFocusableElements(e,n);return r.length>0?r[r.length-1]:null}static getNextFocusableElement(e,n=!1){let r=t.getFocusableElements(e),o=0;if(r&&r.length>0){let s=r.indexOf(r[0].ownerDocument.activeElement);n?s==-1||s===0?o=r.length-1:o=s-1:s!=-1&&s!==r.length-1&&(o=s+1)}return r[o]}static generateZIndex(){return this.zindex=this.zindex||999,++this.zindex}static getSelection(){return window.getSelection?window.getSelection().toString():document.getSelection?document.getSelection().toString():document.selection?document.selection.createRange().text:null}static getTargetElement(e,n){if(!e)return null;switch(e){case"document":return document;case"window":return window;case"@next":return n?.nextElementSibling;case"@prev":return n?.previousElementSibling;case"@parent":return n?.parentElement;case"@grandparent":return n?.parentElement.parentElement;default:let r=typeof e;if(r==="string")return document.querySelector(e);if(r==="object"&&e.hasOwnProperty("nativeElement"))return this.isExist(e.nativeElement)?e.nativeElement:void 0;let s=(a=>!!(a&&a.constructor&&a.call&&a.apply))(e)?e():e;return s&&s.nodeType===9||this.isExist(s)?s:null}}static isClient(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}static getAttribute(e,n){if(e){let r=e.getAttribute(n);return isNaN(r)?r==="true"||r==="false"?r==="true":r:+r}}static calculateBodyScrollbarWidth(){return window.innerWidth-document.documentElement.offsetWidth}static blockBodyScroll(e="p-overflow-hidden"){document.body.style.setProperty("--scrollbar-width",this.calculateBodyScrollbarWidth()+"px"),this.addClass(document.body,e)}static unblockBodyScroll(e="p-overflow-hidden"){document.body.style.removeProperty("--scrollbar-width"),this.removeClass(document.body,e)}static createElement(e,n={},...r){if(e){let o=document.createElement(e);return this.setAttributes(o,n),o.append(...r),o}}static setAttribute(e,n="",r){this.isElement(e)&&r!==null&&r!==void 0&&e.setAttribute(n,r)}static setAttributes(e,n={}){if(this.isElement(e)){let r=(o,s)=>{let a=e?.$attrs?.[o]?[e?.$attrs?.[o]]:[];return[s].flat().reduce((l,u)=>{if(u!=null){let c=typeof u;if(c==="string"||c==="number")l.push(u);else if(c==="object"){let d=Array.isArray(u)?r(o,u):Object.entries(u).map(([f,h])=>o==="style"&&(h||h===0)?`${f.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}:${h}`:h?f:void 0);l=d.length?l.concat(d.filter(f=>!!f)):l}}return l},a)};Object.entries(n).forEach(([o,s])=>{if(s!=null){let a=o.match(/^on(.+)/);a?e.addEventListener(a[1].toLowerCase(),s):o==="pBind"?this.setAttributes(e,s):(s=o==="class"?[...new Set(r("class",s))].join(" ").trim():o==="style"?r("style",s).join(";").trim():s,(e.$attrs=e.$attrs||{})&&(e.$attrs[o]=s),e.setAttribute(o,s))}})}}static isFocusableElement(e,n=""){return this.isElement(e)?e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n}`):!1}}return t})(),Wr=class{element;listener;scrollableParents;constructor(i,e=()=>{}){this.element=i,this.listener=e}bindScrollListener(){this.scrollableParents=gi.getScrollableParents(this.element);for(let i=0;i<this.scrollableParents.length;i++)this.scrollableParents[i].addEventListener("scroll",this.listener)}unbindScrollListener(){if(this.scrollableParents)for(let i=0;i<this.scrollableParents.length;i++)this.scrollableParents[i].removeEventListener("scroll",this.listener)}destroy(){this.unbindScrollListener(),this.element=null,this.listener=null,this.scrollableParents=null}};var Gr=(()=>{class t extends re{autofocus=!1;_autofocus=!1;focused=!1;platformId=m(Pe);document=m(j);host=m(G);ngAfterContentChecked(){this.autofocus===!1?this.host.nativeElement.removeAttribute("autofocus"):this.host.nativeElement.setAttribute("autofocus",!0),this.focused||this.autoFocus()}ngAfterViewChecked(){this.focused||this.autoFocus()}autoFocus(){vt(this.platformId)&&this._autofocus&&setTimeout(()=>{let e=gi.getFocusableElements(this.host?.nativeElement);e.length===0&&this.host.nativeElement.focus(),e.length>0&&e[0].focus(),this.focused=!0})}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["","pAutoFocus",""]],inputs:{autofocus:[2,"autofocus","autofocus",R],_autofocus:[0,"pAutoFocus","_autofocus"]},features:[C]})}return t})(),Lh=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();var ra=({dt:t})=>`
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
`,oa={root:({props:t,instance:i})=>["p-badge p-component",{"p-badge-circle":T(t.value)&&String(t.value).length===1,"p-badge-dot":z(t.value)&&!i.$slots.default,"p-badge-sm":t.size==="small","p-badge-lg":t.size==="large","p-badge-xl":t.size==="xlarge","p-badge-info":t.severity==="info","p-badge-success":t.severity==="success","p-badge-warn":t.severity==="warn","p-badge-danger":t.severity==="danger","p-badge-secondary":t.severity==="secondary","p-badge-contrast":t.severity==="contrast"}]},Kr=(()=>{class t extends B{name="badge";theme=ra;classes=oa;static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var mi=(()=>{class t extends re{styleClass=Se();style=Se();badgeSize=Se();size=Se();severity=Se();value=Se();badgeDisabled=Se(!1,{transform:R});_componentStyle=m(Kr);containerClass=Ie(()=>{let e="p-badge p-component";return T(this.value())&&String(this.value()).length===1&&(e+=" p-badge-circle"),this.badgeSize()==="large"?e+=" p-badge-lg":this.badgeSize()==="xlarge"?e+=" p-badge-xl":this.badgeSize()==="small"&&(e+=" p-badge-sm"),z(this.value())&&(e+=" p-badge-dot"),this.styleClass()&&(e+=` ${this.styleClass()}`),this.severity()&&(e+=` p-badge-${this.severity()}`),e});static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275cmp=K({type:t,selectors:[["p-badge"]],hostVars:6,hostBindings:function(n,r){n&2&&(Qi(r.style()),Ae(r.containerClass()),Ji("display",r.badgeDisabled()?"none":null))},inputs:{styleClass:[1,"styleClass"],style:[1,"style"],badgeSize:[1,"badgeSize"],size:[1,"size"],severity:[1,"severity"],value:[1,"value"],badgeDisabled:[1,"badgeDisabled"]},features:[O([Kr]),C],decls:1,vars:1,template:function(n,r){n&1&&Jt(0),n&2&&Qt(r.value())},dependencies:[Me,xe],encapsulation:2,changeDetection:0})}return t})(),qr=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[mi,xe,xe]})}return t})();var aa=["*"],la=`
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
`,ua=(()=>{class t extends B{name="baseicon";inlineStyles=la;static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var pn=(()=>{class t extends re{label;spin=!1;styleClass;role;ariaLabel;ariaHidden;ngOnInit(){super.ngOnInit(),this.getAttributes()}getAttributes(){let e=z(this.label);this.role=e?void 0:"img",this.ariaLabel=e?void 0:this.label,this.ariaHidden=e}getClassNames(){return`p-icon ${this.styleClass?this.styleClass+" ":""}${this.spin?"p-icon-spin":""}`}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275cmp=K({type:t,selectors:[["ng-component"]],hostAttrs:[1,"p-component","p-iconwrapper"],inputs:{label:"label",spin:[2,"spin","spin",R],styleClass:"styleClass"},features:[O([ua]),C],ngContentSelectors:aa,decls:1,vars:0,template:function(n,r){n&1&&($e(),Ve(0))},encapsulation:2,changeDetection:0})}return t})();var Yr=(()=>{class t extends pn{pathId;ngOnInit(){this.pathId="url(#"+_t()+")"}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275cmp=K({type:t,selectors:[["SpinnerIcon"]],features:[C],decls:6,vars:7,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,r){n&1&&(Gt(),Fe(0,"svg",0)(1,"g"),fe(2,"path",1),Te(),Fe(3,"defs")(4,"clipPath",2),fe(5,"rect",3),Te()()()),n&2&&(Ae(r.getClassNames()),q("aria-label",r.ariaLabel)("aria-hidden",r.ariaHidden)("role",r.role),$(),q("clip-path",r.pathId),$(3),x("id",r.pathId))},encapsulation:2})}return t})();var df=(()=>{class t extends pn{static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275cmp=K({type:t,selectors:[["TimesIcon"]],features:[C],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z","fill","currentColor"]],template:function(n,r){n&1&&(Gt(),Fe(0,"svg",0),fe(1,"path",1),Te()),n&2&&(Ae(r.getClassNames()),q("aria-label",r.ariaLabel)("aria-hidden",r.ariaHidden)("role",r.role))},encapsulation:2})}return t})();var ca=({dt:t})=>`
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
`,da={root:"p-ink"},Zr=(()=>{class t extends B{name="ripple";theme=ca;classes=da;static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Xr=(()=>{class t extends re{zone=m(qt);_componentStyle=m(Zr);animationListener;mouseDownListener;timeout;constructor(){super(),gt(()=>{vt(this.platformId)&&(this.config.ripple()?this.zone.runOutsideAngular(()=>{this.create(),this.mouseDownListener=this.renderer.listen(this.el.nativeElement,"mousedown",this.onMouseDown.bind(this))}):this.remove())})}ngAfterViewInit(){super.ngAfterViewInit()}onMouseDown(e){let n=this.getInk();if(!n||this.document.defaultView?.getComputedStyle(n,null).display==="none")return;if(Ue(n,"p-ink-active"),!ri(n)&&!si(n)){let a=Math.max(Ar(this.el.nativeElement),oi(this.el.nativeElement));n.style.height=a+"px",n.style.width=a+"px"}let r=Ir(this.el.nativeElement),o=e.pageX-r.left+this.document.body.scrollTop-si(n)/2,s=e.pageY-r.top+this.document.body.scrollLeft-ri(n)/2;this.renderer.setStyle(n,"top",s+"px"),this.renderer.setStyle(n,"left",o+"px"),Dt(n,"p-ink-active"),this.timeout=setTimeout(()=>{let a=this.getInk();a&&Ue(a,"p-ink-active")},401)}getInk(){let e=this.el.nativeElement.children;for(let n=0;n<e.length;n++)if(typeof e[n].className=="string"&&e[n].className.indexOf("p-ink")!==-1)return e[n];return null}resetInk(){let e=this.getInk();e&&Ue(e,"p-ink-active")}onAnimationEnd(e){this.timeout&&clearTimeout(this.timeout),Ue(e.currentTarget,"p-ink-active")}create(){let e=this.renderer.createElement("span");this.renderer.addClass(e,"p-ink"),this.renderer.appendChild(this.el.nativeElement,e),this.renderer.setAttribute(e,"aria-hidden","true"),this.renderer.setAttribute(e,"role","presentation"),this.animationListener||(this.animationListener=this.renderer.listen(e,"animationend",this.onAnimationEnd.bind(this)))}remove(){let e=this.getInk();e&&(this.mouseDownListener&&this.mouseDownListener(),this.animationListener&&this.animationListener(),this.mouseDownListener=null,this.animationListener=null,Or(e))}ngOnDestroy(){this.config&&this.config.ripple()&&this.remove(),super.ngOnDestroy()}static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["","pRipple",""]],hostAttrs:[1,"p-ripple"],features:[O([Zr]),C]})}return t})(),_f=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();var ha=["content"],fa=["loadingicon"],pa=["icon"],ga=["*"],Qr=t=>({class:t});function ma(t,i){t&1&&er(0)}function ya(t,i){if(t&1&&fe(0,"span",8),t&2){let e=le(3);x("ngClass",e.iconClass()),q("aria-hidden",!0)("data-pc-section","loadingicon")}}function ba(t,i){if(t&1&&fe(0,"SpinnerIcon",9),t&2){let e=le(3);x("styleClass",e.spinnerIconClass())("spin",!0),q("aria-hidden",!0)("data-pc-section","loadingicon")}}function va(t,i){if(t&1&&(Zt(0),ke(1,ya,1,3,"span",6)(2,ba,1,4,"SpinnerIcon",7),Xt()),t&2){let e=le(2);$(),x("ngIf",e.loadingIcon),$(),x("ngIf",!e.loadingIcon)}}function Da(t,i){}function _a(t,i){if(t&1&&ke(0,Da,0,0,"ng-template",10),t&2){let e=le(2);x("ngIf",e.loadingIconTemplate||e._loadingIconTemplate)}}function Ca(t,i){if(t&1&&(Zt(0),ke(1,va,3,2,"ng-container",2)(2,_a,1,1,null,5),Xt()),t&2){let e=le();$(),x("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate),$(),x("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)("ngTemplateOutletContext",jn(3,Qr,e.iconClass()))}}function Ea(t,i){if(t&1&&fe(0,"span",8),t&2){let e=le(2);Ae(e.icon),x("ngClass",e.iconClass()),q("data-pc-section","icon")}}function wa(t,i){}function Sa(t,i){if(t&1&&ke(0,wa,0,0,"ng-template",10),t&2){let e=le(2);x("ngIf",!e.icon&&(e.iconTemplate||e._iconTemplate))}}function Aa(t,i){if(t&1&&(Zt(0),ke(1,Ea,1,4,"span",11)(2,Sa,1,1,null,5),Xt()),t&2){let e=le();$(),x("ngIf",e.icon&&!e.iconTemplate&&!e._iconTemplate),$(),x("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)("ngTemplateOutletContext",jn(3,Qr,e.iconClass()))}}function Fa(t,i){if(t&1&&(Fe(0,"span",12),Jt(1),Te()),t&2){let e=le();q("aria-hidden",e.icon&&!e.label)("data-pc-section","label"),$(),Qt(e.label)}}function Ta(t,i){if(t&1&&fe(0,"p-badge",13),t&2){let e=le();x("value",e.badge)("severity",e.badgeSeverity)}}var Ia=({dt:t})=>`
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
`,Oa={root:({instance:t,props:i})=>["p-button p-component",{"p-button-icon-only":t.hasIcon&&!i.label&&!i.badge,"p-button-vertical":(i.iconPos==="top"||i.iconPos==="bottom")&&i.label,"p-button-loading":i.loading,"p-button-link":i.link,[`p-button-${i.severity}`]:i.severity,"p-button-raised":i.raised,"p-button-rounded":i.rounded,"p-button-text":i.text,"p-button-outlined":i.outlined,"p-button-sm":i.size==="small","p-button-lg":i.size==="large","p-button-plain":i.plain,"p-button-fluid":i.fluid}],loadingIcon:"p-button-loading-icon",icon:({props:t})=>["p-button-icon",{[`p-button-icon-${t.iconPos}`]:t.label}],label:"p-button-label"},Jr=(()=>{class t extends B{name="button";theme=Ia;classes=Oa;static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Ma=(()=>{class t extends re{type="button";iconPos="left";icon;badge;label;disabled;loading=!1;loadingIcon;raised=!1;rounded=!1;text=!1;plain=!1;severity;outlined=!1;link=!1;tabindex;size;variant;style;styleClass;badgeClass;badgeSeverity="secondary";ariaLabel;autofocus;fluid;onClick=new se;onFocus=new se;onBlur=new se;contentTemplate;loadingIconTemplate;iconTemplate;_buttonProps;get buttonProps(){return this._buttonProps}set buttonProps(e){this._buttonProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([n,r])=>this[`_${n}`]!==r&&(this[`_${n}`]=r))}get hasFluid(){let n=this.el.nativeElement.closest("p-fluid");return z(this.fluid)?!!n:this.fluid}_componentStyle=m(Jr);templates;_contentTemplate;_iconTemplate;_loadingIconTemplate;ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}ngOnChanges(e){super.ngOnChanges(e);let{buttonProps:n}=e;if(n){let r=n.currentValue;for(let o in r)this[o]=r[o]}}spinnerIconClass(){return Object.entries(this.iconClass()).filter(([,e])=>!!e).reduce((e,[n])=>e+` ${n}`,"p-button-loading-icon")}iconClass(){return{[`p-button-loading-icon pi-spin ${this.loadingIcon??""}`]:this.loading,"p-button-icon":!0,"p-button-icon-left":this.iconPos==="left"&&this.label,"p-button-icon-right":this.iconPos==="right"&&this.label,"p-button-icon-top":this.iconPos==="top"&&this.label,"p-button-icon-bottom":this.iconPos==="bottom"&&this.label}}get buttonClass(){return{"p-button p-component":!0,"p-button-icon-only":(this.icon||this.iconTemplate||this._iconTemplate||this.loadingIcon||this.loadingIconTemplate||this._loadingIconTemplate)&&!this.label,"p-button-vertical":(this.iconPos==="top"||this.iconPos==="bottom")&&this.label,"p-button-loading":this.loading,"p-button-loading-label-only":this.loading&&!this.icon&&this.label&&!this.loadingIcon&&this.iconPos==="left","p-button-link":this.link,[`p-button-${this.severity}`]:this.severity,"p-button-raised":this.raised,"p-button-rounded":this.rounded,"p-button-text":this.text||this.variant=="text","p-button-outlined":this.outlined||this.variant=="outlined","p-button-sm":this.size==="small","p-button-lg":this.size==="large","p-button-plain":this.plain,"p-button-fluid":this.hasFluid,[`${this.styleClass}`]:this.styleClass}}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275cmp=K({type:t,selectors:[["p-button"]],contentQueries:function(n,r,o){if(n&1&&(ht(o,ha,5),ht(o,fa,5),ht(o,pa,5),ht(o,Pr,4)),n&2){let s;ft(s=pt())&&(r.contentTemplate=s.first),ft(s=pt())&&(r.loadingIconTemplate=s.first),ft(s=pt())&&(r.iconTemplate=s.first),ft(s=pt())&&(r.templates=s)}},inputs:{type:"type",iconPos:"iconPos",icon:"icon",badge:"badge",label:"label",disabled:[2,"disabled","disabled",R],loading:[2,"loading","loading",R],loadingIcon:"loadingIcon",raised:[2,"raised","raised",R],rounded:[2,"rounded","rounded",R],text:[2,"text","text",R],plain:[2,"plain","plain",R],severity:"severity",outlined:[2,"outlined","outlined",R],link:[2,"link","link",R],tabindex:[2,"tabindex","tabindex",zn],size:"size",variant:"variant",style:"style",styleClass:"styleClass",badgeClass:"badgeClass",badgeSeverity:"badgeSeverity",ariaLabel:"ariaLabel",autofocus:[2,"autofocus","autofocus",R],fluid:[2,"fluid","fluid",R],buttonProps:"buttonProps"},outputs:{onClick:"onClick",onFocus:"onFocus",onBlur:"onBlur"},features:[O([Jr]),C,W],ngContentSelectors:ga,decls:7,vars:14,consts:[["pRipple","",3,"click","focus","blur","ngStyle","disabled","ngClass","pAutoFocus"],[4,"ngTemplateOutlet"],[4,"ngIf"],["class","p-button-label",4,"ngIf"],[3,"value","severity",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngClass",4,"ngIf"],[3,"styleClass","spin",4,"ngIf"],[3,"ngClass"],[3,"styleClass","spin"],[3,"ngIf"],[3,"class","ngClass",4,"ngIf"],[1,"p-button-label"],[3,"value","severity"]],template:function(n,r){n&1&&($e(),Fe(0,"button",0),pe("click",function(s){return r.onClick.emit(s)})("focus",function(s){return r.onFocus.emit(s)})("blur",function(s){return r.onBlur.emit(s)}),Ve(1),ke(2,ma,1,0,"ng-container",1)(3,Ca,3,5,"ng-container",2)(4,Aa,3,5,"ng-container",2)(5,Fa,2,3,"span",3)(6,Ta,1,2,"p-badge",4),Te()),n&2&&(x("ngStyle",r.style)("disabled",r.disabled||r.loading)("ngClass",r.buttonClass)("pAutoFocus",r.autofocus),q("type",r.type)("aria-label",r.ariaLabel)("data-pc-name","button")("data-pc-section","root")("tabindex",r.tabindex),$(2),x("ngTemplateOutlet",r.contentTemplate||r._contentTemplate),$(),x("ngIf",r.loading),$(),x("ngIf",!r.loading),$(),x("ngIf",!r.contentTemplate&&!r._contentTemplate&&r.label),$(),x("ngIf",!r.contentTemplate&&!r._contentTemplate&&r.badge))},dependencies:[Me,Zn,Xn,Qn,Jn,Xr,Gr,Yr,qr,mi,xe],encapsulation:2,changeDetection:0})}return t})(),Gf=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[Me,Ma,xe,xe]})}return t})();var uo=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,n){this._renderer=e,this._elementRef=n}setProperty(e,n){this._renderer.setProperty(this._elementRef.nativeElement,e,n)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(n){return new(n||t)(p(ae),p(G))};static \u0275dir=_({type:t})}return t})(),An=(()=>{class t extends uo{static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,features:[C]})}return t})(),He=new I("");var Ra={provide:He,useExisting:te(()=>co),multi:!0};function xa(){let t=Be()?Be().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var Na=new I(""),co=(()=>{class t extends uo{_compositionMode;_composing=!1;constructor(e,n,r){super(e,n),this._compositionMode=r,this._compositionMode==null&&(this._compositionMode=!xa())}writeValue(e){let n=e??"";this.setProperty("value",n)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(n){return new(n||t)(p(ae),p(G),p(Na,8))};static \u0275dir=_({type:t,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(n,r){n&1&&pe("input",function(s){return r._handleInput(s.target.value)})("blur",function(){return r.onTouched()})("compositionstart",function(){return r._compositionStart()})("compositionend",function(s){return r._compositionEnd(s.target.value)})},standalone:!1,features:[O([Ra]),C]})}return t})();function Ci(t){return t==null||Ei(t)===0}function Ei(t){return t==null?null:Array.isArray(t)||typeof t=="string"?t.length:t instanceof Set?t.size:null}var ze=new I(""),nt=new I(""),La=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,eo=class{static min(i){return ho(i)}static max(i){return Pa(i)}static required(i){return ka(i)}static requiredTrue(i){return $a(i)}static email(i){return Va(i)}static minLength(i){return Ba(i)}static maxLength(i){return Ua(i)}static pattern(i){return ja(i)}static nullValidator(i){return mn()}static compose(i){return bo(i)}static composeAsync(i){return Do(i)}};function ho(t){return i=>{if(i.value==null||t==null)return null;let e=parseFloat(i.value);return!isNaN(e)&&e<t?{min:{min:t,actual:i.value}}:null}}function Pa(t){return i=>{if(i.value==null||t==null)return null;let e=parseFloat(i.value);return!isNaN(e)&&e>t?{max:{max:t,actual:i.value}}:null}}function ka(t){return Ci(t.value)?{required:!0}:null}function $a(t){return t.value===!0?null:{required:!0}}function Va(t){return Ci(t.value)||La.test(t.value)?null:{email:!0}}function Ba(t){return i=>{let e=i.value?.length??Ei(i.value);return e===null||e===0?null:e<t?{minlength:{requiredLength:t,actualLength:e}}:null}}function Ua(t){return i=>{let e=i.value?.length??Ei(i.value);return e!==null&&e>t?{maxlength:{requiredLength:t,actualLength:e}}:null}}function ja(t){if(!t)return mn;let i,e;return typeof t=="string"?(e="",t.charAt(0)!=="^"&&(e+="^"),e+=t,t.charAt(t.length-1)!=="$"&&(e+="$"),i=new RegExp(e)):(e=t.toString(),i=t),n=>{if(Ci(n.value))return null;let r=n.value;return i.test(r)?null:{pattern:{requiredPattern:e,actualValue:r}}}}function mn(t){return null}function fo(t){return t!=null}function po(t){return Bn(t)?zt(t):t}function go(t){let i={};return t.forEach(e=>{i=e!=null?D(D({},i),e):i}),Object.keys(i).length===0?null:i}function mo(t,i){return i.map(e=>e(t))}function Ha(t){return!t.validate}function yo(t){return t.map(i=>Ha(i)?i:e=>i.validate(e))}function bo(t){if(!t)return null;let i=t.filter(fo);return i.length==0?null:function(e){return go(mo(e,i))}}function vo(t){return t!=null?bo(yo(t)):null}function Do(t){if(!t)return null;let i=t.filter(fo);return i.length==0?null:function(e){let n=mo(e,i).map(po);return Ui(n).pipe(Le(go))}}function _o(t){return t!=null?Do(yo(t)):null}function to(t,i){return t===null?[i]:Array.isArray(t)?[...t,i]:[t,i]}function Co(t){return t._rawValidators}function Eo(t){return t._rawAsyncValidators}function yi(t){return t?Array.isArray(t)?t:[t]:[]}function yn(t,i){return Array.isArray(t)?t.includes(i):t===i}function no(t,i){let e=yi(i);return yi(t).forEach(r=>{yn(e,r)||e.push(r)}),e}function io(t,i){return yi(i).filter(e=>!yn(t,e))}var bn=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(i){this._rawValidators=i||[],this._composedValidatorFn=vo(this._rawValidators)}_setAsyncValidators(i){this._rawAsyncValidators=i||[],this._composedAsyncValidatorFn=_o(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(i){this._onDestroyCallbacks.push(i)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(i=>i()),this._onDestroyCallbacks=[]}reset(i=void 0){this.control&&this.control.reset(i)}hasError(i,e){return this.control?this.control.hasError(i,e):!1}getError(i,e){return this.control?this.control.getError(i,e):null}},J=class extends bn{name;get formDirective(){return null}get path(){return null}},be=class extends bn{_parent=null;name=null;valueAccessor=null},vn=class{_cd;constructor(i){this._cd=i}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}},za={"[class.ng-untouched]":"isUntouched","[class.ng-touched]":"isTouched","[class.ng-pristine]":"isPristine","[class.ng-dirty]":"isDirty","[class.ng-valid]":"isValid","[class.ng-invalid]":"isInvalid","[class.ng-pending]":"isPending"},up=ee(D({},za),{"[class.ng-submitted]":"isSubmitted"}),cp=(()=>{class t extends vn{constructor(e){super(e)}static \u0275fac=function(n){return new(n||t)(p(be,2))};static \u0275dir=_({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(n,r){n&2&&We("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)},standalone:!1,features:[C]})}return t})(),dp=(()=>{class t extends vn{constructor(e){super(e)}static \u0275fac=function(n){return new(n||t)(p(J,10))};static \u0275dir=_({type:t,selectors:[["","formGroupName",""],["","formArrayName",""],["","ngModelGroup",""],["","formGroup",""],["form",3,"ngNoForm",""],["","ngForm",""]],hostVars:16,hostBindings:function(n,r){n&2&&We("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)("ng-submitted",r.isSubmitted)},standalone:!1,features:[C]})}return t})();var Ct="VALID",gn="INVALID",Qe="PENDING",Et="DISABLED",Ne=class{},Dn=class extends Ne{value;source;constructor(i,e){super(),this.value=i,this.source=e}},wt=class extends Ne{pristine;source;constructor(i,e){super(),this.pristine=i,this.source=e}},St=class extends Ne{touched;source;constructor(i,e){super(),this.touched=i,this.source=e}},et=class extends Ne{status;source;constructor(i,e){super(),this.status=i,this.source=e}},bi=class extends Ne{source;constructor(i){super(),this.source=i}},vi=class extends Ne{source;constructor(i){super(),this.source=i}};function wi(t){return(Fn(t)?t.validators:t)||null}function Wa(t){return Array.isArray(t)?vo(t):t||null}function Si(t,i){return(Fn(i)?i.asyncValidators:t)||null}function Ga(t){return Array.isArray(t)?_o(t):t||null}function Fn(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}function wo(t,i,e){let n=t.controls;if(!(i?Object.keys(n):n).length)throw new U(1e3,"");if(!n[e])throw new U(1001,"")}function So(t,i,e){t._forEachChild((n,r)=>{if(e[r]===void 0)throw new U(1002,"")})}var tt=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(i,e){this._assignValidators(i),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(i){this._rawValidators=this._composedValidatorFn=i}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(i){this._rawAsyncValidators=this._composedAsyncValidatorFn=i}get parent(){return this._parent}get status(){return ue(this.statusReactive)}set status(i){ue(()=>this.statusReactive.set(i))}_status=Ie(()=>this.statusReactive());statusReactive=ne(void 0);get valid(){return this.status===Ct}get invalid(){return this.status===gn}get pending(){return this.status==Qe}get disabled(){return this.status===Et}get enabled(){return this.status!==Et}errors;get pristine(){return ue(this.pristineReactive)}set pristine(i){ue(()=>this.pristineReactive.set(i))}_pristine=Ie(()=>this.pristineReactive());pristineReactive=ne(!0);get dirty(){return!this.pristine}get touched(){return ue(this.touchedReactive)}set touched(i){ue(()=>this.touchedReactive.set(i))}_touched=Ie(()=>this.touchedReactive());touchedReactive=ne(!1);get untouched(){return!this.touched}_events=new we;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(i){this._assignValidators(i)}setAsyncValidators(i){this._assignAsyncValidators(i)}addValidators(i){this.setValidators(no(i,this._rawValidators))}addAsyncValidators(i){this.setAsyncValidators(no(i,this._rawAsyncValidators))}removeValidators(i){this.setValidators(io(i,this._rawValidators))}removeAsyncValidators(i){this.setAsyncValidators(io(i,this._rawAsyncValidators))}hasValidator(i){return yn(this._rawValidators,i)}hasAsyncValidator(i){return yn(this._rawAsyncValidators,i)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(i={}){let e=this.touched===!1;this.touched=!0;let n=i.sourceControl??this;this._parent&&!i.onlySelf&&this._parent.markAsTouched(ee(D({},i),{sourceControl:n})),e&&i.emitEvent!==!1&&this._events.next(new St(!0,n))}markAllAsTouched(i={}){this.markAsTouched({onlySelf:!0,emitEvent:i.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(i))}markAsUntouched(i={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let n=i.sourceControl??this;this._forEachChild(r=>{r.markAsUntouched({onlySelf:!0,emitEvent:i.emitEvent,sourceControl:n})}),this._parent&&!i.onlySelf&&this._parent._updateTouched(i,n),e&&i.emitEvent!==!1&&this._events.next(new St(!1,n))}markAsDirty(i={}){let e=this.pristine===!0;this.pristine=!1;let n=i.sourceControl??this;this._parent&&!i.onlySelf&&this._parent.markAsDirty(ee(D({},i),{sourceControl:n})),e&&i.emitEvent!==!1&&this._events.next(new wt(!1,n))}markAsPristine(i={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let n=i.sourceControl??this;this._forEachChild(r=>{r.markAsPristine({onlySelf:!0,emitEvent:i.emitEvent})}),this._parent&&!i.onlySelf&&this._parent._updatePristine(i,n),e&&i.emitEvent!==!1&&this._events.next(new wt(!0,n))}markAsPending(i={}){this.status=Qe;let e=i.sourceControl??this;i.emitEvent!==!1&&(this._events.next(new et(this.status,e)),this.statusChanges.emit(this.status)),this._parent&&!i.onlySelf&&this._parent.markAsPending(ee(D({},i),{sourceControl:e}))}disable(i={}){let e=this._parentMarkedDirty(i.onlySelf);this.status=Et,this.errors=null,this._forEachChild(r=>{r.disable(ee(D({},i),{onlySelf:!0}))}),this._updateValue();let n=i.sourceControl??this;i.emitEvent!==!1&&(this._events.next(new Dn(this.value,n)),this._events.next(new et(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(ee(D({},i),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!0))}enable(i={}){let e=this._parentMarkedDirty(i.onlySelf);this.status=Ct,this._forEachChild(n=>{n.enable(ee(D({},i),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:i.emitEvent}),this._updateAncestors(ee(D({},i),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(n=>n(!1))}_updateAncestors(i,e){this._parent&&!i.onlySelf&&(this._parent.updateValueAndValidity(i),i.skipPristineCheck||this._parent._updatePristine({},e),this._parent._updateTouched({},e))}setParent(i){this._parent=i}getRawValue(){return this.value}updateValueAndValidity(i={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let n=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Ct||this.status===Qe)&&this._runAsyncValidator(n,i.emitEvent)}let e=i.sourceControl??this;i.emitEvent!==!1&&(this._events.next(new Dn(this.value,e)),this._events.next(new et(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._parent&&!i.onlySelf&&this._parent.updateValueAndValidity(ee(D({},i),{sourceControl:e}))}_updateTreeValidity(i={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(i)),this.updateValueAndValidity({onlySelf:!0,emitEvent:i.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Et:Ct}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(i,e){if(this.asyncValidator){this.status=Qe,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1};let n=po(this.asyncValidator(this));this._asyncValidationSubscription=n.subscribe(r=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(r,{emitEvent:e,shouldHaveEmitted:i})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let i=this._hasOwnPendingAsyncValidator?.emitEvent??!1;return this._hasOwnPendingAsyncValidator=null,i}return!1}setErrors(i,e={}){this.errors=i,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(i){let e=i;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((n,r)=>n&&n._find(r),this)}getError(i,e){let n=e?this.get(e):this;return n&&n.errors?n.errors[i]:null}hasError(i,e){return!!this.getError(i,e)}get root(){let i=this;for(;i._parent;)i=i._parent;return i}_updateControlsErrors(i,e,n){this.status=this._calculateStatus(),i&&this.statusChanges.emit(this.status),(i||n)&&this._events.next(new et(this.status,e)),this._parent&&this._parent._updateControlsErrors(i,e,n)}_initObservables(){this.valueChanges=new se,this.statusChanges=new se}_calculateStatus(){return this._allControlsDisabled()?Et:this.errors?gn:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(Qe)?Qe:this._anyControlsHaveStatus(gn)?gn:Ct}_anyControlsHaveStatus(i){return this._anyControls(e=>e.status===i)}_anyControlsDirty(){return this._anyControls(i=>i.dirty)}_anyControlsTouched(){return this._anyControls(i=>i.touched)}_updatePristine(i,e){let n=!this._anyControlsDirty(),r=this.pristine!==n;this.pristine=n,this._parent&&!i.onlySelf&&this._parent._updatePristine(i,e),r&&this._events.next(new wt(this.pristine,e))}_updateTouched(i={},e){this.touched=this._anyControlsTouched(),this._events.next(new St(this.touched,e)),this._parent&&!i.onlySelf&&this._parent._updateTouched(i,e)}_onDisabledChange=[];_registerOnCollectionChange(i){this._onCollectionChange=i}_setUpdateStrategy(i){Fn(i)&&i.updateOn!=null&&(this._updateOn=i.updateOn)}_parentMarkedDirty(i){let e=this._parent&&this._parent.dirty;return!i&&!!e&&!this._parent._anyControlsDirty()}_find(i){return null}_assignValidators(i){this._rawValidators=Array.isArray(i)?i.slice():i,this._composedValidatorFn=Wa(this._rawValidators)}_assignAsyncValidators(i){this._rawAsyncValidators=Array.isArray(i)?i.slice():i,this._composedAsyncValidatorFn=Ga(this._rawAsyncValidators)}},_n=class extends tt{constructor(i,e,n){super(wi(e),Si(n,e)),this.controls=i,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(i,e){return this.controls[i]?this.controls[i]:(this.controls[i]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(i,e,n={}){this.registerControl(i,e),this.updateValueAndValidity({emitEvent:n.emitEvent}),this._onCollectionChange()}removeControl(i,e={}){this.controls[i]&&this.controls[i]._registerOnCollectionChange(()=>{}),delete this.controls[i],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(i,e,n={}){this.controls[i]&&this.controls[i]._registerOnCollectionChange(()=>{}),delete this.controls[i],e&&this.registerControl(i,e),this.updateValueAndValidity({emitEvent:n.emitEvent}),this._onCollectionChange()}contains(i){return this.controls.hasOwnProperty(i)&&this.controls[i].enabled}setValue(i,e={}){So(this,!0,i),Object.keys(i).forEach(n=>{wo(this,!0,n),this.controls[n].setValue(i[n],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)}patchValue(i,e={}){i!=null&&(Object.keys(i).forEach(n=>{let r=this.controls[n];r&&r.patchValue(i[n],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(i={},e={}){this._forEachChild((n,r)=>{n.reset(i?i[r]:null,{onlySelf:!0,emitEvent:e.emitEvent})}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e)}getRawValue(){return this._reduceChildren({},(i,e,n)=>(i[n]=e.getRawValue(),i))}_syncPendingControls(){let i=this._reduceChildren(!1,(e,n)=>n._syncPendingControls()?!0:e);return i&&this.updateValueAndValidity({onlySelf:!0}),i}_forEachChild(i){Object.keys(this.controls).forEach(e=>{let n=this.controls[e];n&&i(n,e)})}_setUpControls(){this._forEachChild(i=>{i.setParent(this),i._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(i){for(let[e,n]of Object.entries(this.controls))if(this.contains(e)&&i(n))return!0;return!1}_reduceValue(){let i={};return this._reduceChildren(i,(e,n,r)=>((n.enabled||this.disabled)&&(e[r]=n.value),e))}_reduceChildren(i,e){let n=i;return this._forEachChild((r,o)=>{n=e(n,r,o)}),n}_allControlsDisabled(){for(let i of Object.keys(this.controls))if(this.controls[i].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(i){return this.controls.hasOwnProperty(i)?this.controls[i]:null}};var Di=class extends _n{};var Ft=new I("",{providedIn:"root",factory:()=>Tn}),Tn="always";function In(t,i){return[...i.path,t]}function Cn(t,i,e=Tn){Ai(t,i),i.valueAccessor.writeValue(t.value),(t.disabled||e==="always")&&i.valueAccessor.setDisabledState?.(t.disabled),qa(t,i),Za(t,i),Ya(t,i),Ka(t,i)}function En(t,i,e=!0){let n=()=>{};i.valueAccessor&&(i.valueAccessor.registerOnChange(n),i.valueAccessor.registerOnTouched(n)),Sn(t,i),t&&(i._invokeOnDestroyCallbacks(),t._registerOnCollectionChange(()=>{}))}function wn(t,i){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(i)})}function Ka(t,i){if(i.valueAccessor.setDisabledState){let e=n=>{i.valueAccessor.setDisabledState(n)};t.registerOnDisabledChange(e),i._registerOnDestroy(()=>{t._unregisterOnDisabledChange(e)})}}function Ai(t,i){let e=Co(t);i.validator!==null?t.setValidators(to(e,i.validator)):typeof e=="function"&&t.setValidators([e]);let n=Eo(t);i.asyncValidator!==null?t.setAsyncValidators(to(n,i.asyncValidator)):typeof n=="function"&&t.setAsyncValidators([n]);let r=()=>t.updateValueAndValidity();wn(i._rawValidators,r),wn(i._rawAsyncValidators,r)}function Sn(t,i){let e=!1;if(t!==null){if(i.validator!==null){let r=Co(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==i.validator);o.length!==r.length&&(e=!0,t.setValidators(o))}}if(i.asyncValidator!==null){let r=Eo(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==i.asyncValidator);o.length!==r.length&&(e=!0,t.setAsyncValidators(o))}}}let n=()=>{};return wn(i._rawValidators,n),wn(i._rawAsyncValidators,n),e}function qa(t,i){i.valueAccessor.registerOnChange(e=>{t._pendingValue=e,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&Ao(t,i)})}function Ya(t,i){i.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&Ao(t,i),t.updateOn!=="submit"&&t.markAsTouched()})}function Ao(t,i){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),i.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function Za(t,i){let e=(n,r)=>{i.valueAccessor.writeValue(n),r&&i.viewToModelUpdate(n)};t.registerOnChange(e),i._registerOnDestroy(()=>{t._unregisterOnChange(e)})}function Xa(t,i){t==null,Ai(t,i)}function Ja(t,i){return Sn(t,i)}function Fi(t,i){if(!t.hasOwnProperty("model"))return!1;let e=t.model;return e.isFirstChange()?!0:!Object.is(i,e.currentValue)}function Qa(t){return Object.getPrototypeOf(t.constructor)===An}function el(t,i){t._syncPendingControls(),i.forEach(e=>{let n=e.control;n.updateOn==="submit"&&n._pendingChange&&(e.viewToModelUpdate(n._pendingValue),n._pendingChange=!1)})}function Ti(t,i){if(!i)return null;Array.isArray(i);let e,n,r;return i.forEach(o=>{o.constructor===co?e=o:Qa(o)?n=o:r=o}),r||n||e||null}function tl(t,i){let e=t.indexOf(i);e>-1&&t.splice(e,1)}function ro(t,i){let e=t.indexOf(i);e>-1&&t.splice(e,1)}function oo(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var At=class extends tt{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(i=null,e,n){super(wi(e),Si(n,e)),this._applyFormState(i),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Fn(e)&&(e.nonNullable||e.initialValueIsDefault)&&(oo(i)?this.defaultValue=i.value:this.defaultValue=i)}setValue(i,e={}){this.value=this._pendingValue=i,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(n=>n(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)}patchValue(i,e={}){this.setValue(i,e)}reset(i=this.defaultValue,e={}){this._applyFormState(i),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),this._pendingChange=!1}_updateValue(){}_anyControls(i){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(i){this._onChange.push(i)}_unregisterOnChange(i){ro(this._onChange,i)}registerOnDisabledChange(i){this._onDisabledChange.push(i)}_unregisterOnDisabledChange(i){ro(this._onDisabledChange,i)}_forEachChild(i){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(i){oo(i)?(this.value=this._pendingValue=i.value,i.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=i}};var nl=t=>t instanceof At,il=(()=>{class t extends J{_parent;ngOnInit(){this._checkParentType(),this.formDirective.addFormGroup(this)}ngOnDestroy(){this.formDirective&&this.formDirective.removeFormGroup(this)}get control(){return this.formDirective.getFormGroup(this)}get path(){return In(this.name==null?this.name:this.name.toString(),this._parent)}get formDirective(){return this._parent?this._parent.formDirective:null}_checkParentType(){}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,standalone:!1,features:[C]})}return t})();var rl={provide:be,useExisting:te(()=>Ii)},so=Promise.resolve(),Ii=(()=>{class t extends be{_changeDetectorRef;callSetDisabledState;control=new At;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new se;constructor(e,n,r,o,s,a){super(),this._changeDetectorRef=s,this.callSetDisabledState=a,this._parent=e,this._setValidators(n),this._setAsyncValidators(r),this.valueAccessor=Ti(this,o)}ngOnChanges(e){if(this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let n=e.name.previousValue;this.formDirective.removeControl({name:n,path:this._getPath(n)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),Fi(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){Cn(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){so.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let n=e.isDisabled.currentValue,r=n!==0&&R(n);so.then(()=>{r&&!this.control.disabled?this.control.disable():!r&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?In(e,this._parent):[e]}static \u0275fac=function(n){return new(n||t)(p(J,9),p(ze,10),p(nt,10),p(He,10),p(Ge,8),p(Ft,8))};static \u0275dir=_({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[O([rl]),C,W]})}return t})();var fp=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["form",3,"ngNoForm","",3,"ngNativeValidate",""]],hostAttrs:["novalidate",""],standalone:!1})}return t})(),ol={provide:He,useExisting:te(()=>sl),multi:!0},sl=(()=>{class t extends An{writeValue(e){let n=e??"";this.setProperty("value",n)}registerOnChange(e){this.onChange=n=>{e(n==""?null:parseFloat(n))}}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["input","type","number","formControlName",""],["input","type","number","formControl",""],["input","type","number","ngModel",""]],hostBindings:function(n,r){n&1&&pe("input",function(s){return r.onChange(s.target.value)})("blur",function(){return r.onTouched()})},standalone:!1,features:[O([ol]),C]})}return t})();var Oi=new I(""),al={provide:be,useExisting:te(()=>ll)},ll=(()=>{class t extends be{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(e){}model;update=new se;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,n,r,o,s){super(),this._ngModelWarningConfig=o,this.callSetDisabledState=s,this._setValidators(e),this._setAsyncValidators(n),this.valueAccessor=Ti(this,r)}ngOnChanges(e){if(this._isControlChanged(e)){let n=e.form.previousValue;n&&En(n,this,!1),Cn(this.form,this,this.callSetDisabledState),this.form.updateValueAndValidity({emitEvent:!1})}Fi(e,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&En(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_isControlChanged(e){return e.hasOwnProperty("form")}static \u0275fac=function(n){return new(n||t)(p(ze,10),p(nt,10),p(He,10),p(Oi,8),p(Ft,8))};static \u0275dir=_({type:t,selectors:[["","formControl",""]],inputs:{form:[0,"formControl","form"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},exportAs:["ngForm"],standalone:!1,features:[O([al]),C,W]})}return t})(),ul={provide:J,useExisting:te(()=>Fo)},Fo=(()=>{class t extends J{callSetDisabledState;get submitted(){return ue(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=Ie(()=>this._submittedReactive());_submittedReactive=ne(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];form=null;ngSubmit=new se;constructor(e,n,r){super(),this.callSetDisabledState=r,this._setValidators(e),this._setAsyncValidators(n)}ngOnChanges(e){e.hasOwnProperty("form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}ngOnDestroy(){this.form&&(Sn(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get control(){return this.form}get path(){return[]}addControl(e){let n=this.form.get(e.path);return Cn(n,e,this.callSetDisabledState),n.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),n}getControl(e){return this.form.get(e.path)}removeControl(e){En(e.control||null,e,!1),tl(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}getFormArray(e){return this.form.get(e.path)}updateModel(e,n){this.form.get(e.path).setValue(n)}onSubmit(e){return this._submittedReactive.set(!0),el(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new bi(this.control)),e?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this._submittedReactive.set(!1),this.form._events.next(new vi(this.form))}_updateDomValue(){this.directives.forEach(e=>{let n=e.control,r=this.form.get(e.path);n!==r&&(En(n||null,e),nl(r)&&(Cn(r,e,this.callSetDisabledState),e.control=r))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let n=this.form.get(e.path);Xa(n,e),n.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){if(this.form){let n=this.form.get(e.path);n&&Ja(n,e)&&n.updateValueAndValidity({emitEvent:!1})}}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm&&this._oldForm._registerOnCollectionChange(()=>{})}_updateValidators(){Ai(this.form,this),this._oldForm&&Sn(this._oldForm,this)}static \u0275fac=function(n){return new(n||t)(p(ze,10),p(nt,10),p(Ft,8))};static \u0275dir=_({type:t,selectors:[["","formGroup",""]],hostBindings:function(n,r){n&1&&pe("submit",function(s){return r.onSubmit(s)})("reset",function(){return r.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[O([ul]),C,W]})}return t})(),cl={provide:J,useExisting:te(()=>To)},To=(()=>{class t extends il{name=null;constructor(e,n,r){super(),this._parent=e,this._setValidators(n),this._setAsyncValidators(r)}_checkParentType(){Oo(this._parent)}static \u0275fac=function(n){return new(n||t)(p(J,13),p(ze,10),p(nt,10))};static \u0275dir=_({type:t,selectors:[["","formGroupName",""]],inputs:{name:[0,"formGroupName","name"]},standalone:!1,features:[O([cl]),C]})}return t})(),dl={provide:J,useExisting:te(()=>Io)},Io=(()=>{class t extends J{_parent;name=null;constructor(e,n,r){super(),this._parent=e,this._setValidators(n),this._setAsyncValidators(r)}ngOnInit(){Oo(this._parent),this.formDirective.addFormArray(this)}ngOnDestroy(){this.formDirective?.removeFormArray(this)}get control(){return this.formDirective.getFormArray(this)}get formDirective(){return this._parent?this._parent.formDirective:null}get path(){return In(this.name==null?this.name:this.name.toString(),this._parent)}static \u0275fac=function(n){return new(n||t)(p(J,13),p(ze,10),p(nt,10))};static \u0275dir=_({type:t,selectors:[["","formArrayName",""]],inputs:{name:[0,"formArrayName","name"]},standalone:!1,features:[O([dl]),C]})}return t})();function Oo(t){return!(t instanceof To)&&!(t instanceof Fo)&&!(t instanceof Io)}var hl={provide:be,useExisting:te(()=>fl)},fl=(()=>{class t extends be{_ngModelWarningConfig;_added=!1;viewModel;control;name=null;set isDisabled(e){}model;update=new se;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,n,r,o,s){super(),this._ngModelWarningConfig=s,this._parent=e,this._setValidators(n),this._setAsyncValidators(r),this.valueAccessor=Ti(this,o)}ngOnChanges(e){this._added||this._setUpControl(),Fi(e,this.viewModel)&&(this.viewModel=this.model,this.formDirective.updateModel(this,this.model))}ngOnDestroy(){this.formDirective&&this.formDirective.removeControl(this)}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}get path(){return In(this.name==null?this.name:this.name.toString(),this._parent)}get formDirective(){return this._parent?this._parent.formDirective:null}_setUpControl(){this.control=this.formDirective.addControl(this),this._added=!0}static \u0275fac=function(n){return new(n||t)(p(J,13),p(ze,10),p(nt,10),p(He,10),p(Oi,8))};static \u0275dir=_({type:t,selectors:[["","formControlName",""]],inputs:{name:[0,"formControlName","name"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},standalone:!1,features:[O([hl]),C,W]})}return t})();var pl={provide:He,useExisting:te(()=>Ro),multi:!0};function Mo(t,i){return t==null?`${i}`:(i&&typeof i=="object"&&(i="Object"),`${t}: ${i}`.slice(0,50))}function gl(t){return t.split(":")[0]}var Ro=(()=>{class t extends An{value;_optionMap=new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;writeValue(e){this.value=e;let n=this._getOptionId(e),r=Mo(n,e);this.setProperty("value",r)}registerOnChange(e){this.onChange=n=>{this.value=this._getOptionValue(n),e(this.value)}}_registerOption(){return(this._idCounter++).toString()}_getOptionId(e){for(let n of this._optionMap.keys())if(this._compareWith(this._optionMap.get(n),e))return n;return null}_getOptionValue(e){let n=gl(e);return this._optionMap.has(n)?this._optionMap.get(n):e}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["select","formControlName","",3,"multiple",""],["select","formControl","",3,"multiple",""],["select","ngModel","",3,"multiple",""]],hostBindings:function(n,r){n&1&&pe("change",function(s){return r.onChange(s.target.value)})("blur",function(){return r.onTouched()})},inputs:{compareWith:"compareWith"},standalone:!1,features:[O([pl]),C]})}return t})(),pp=(()=>{class t{_element;_renderer;_select;id;constructor(e,n,r){this._element=e,this._renderer=n,this._select=r,this._select&&(this.id=this._select._registerOption())}set ngValue(e){this._select!=null&&(this._select._optionMap.set(this.id,e),this._setElementValue(Mo(this.id,e)),this._select.writeValue(this._select.value))}set value(e){this._setElementValue(e),this._select&&this._select.writeValue(this._select.value)}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,"value",e)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static \u0275fac=function(n){return new(n||t)(p(G),p(ae),p(Ro,9))};static \u0275dir=_({type:t,selectors:[["option"]],inputs:{ngValue:"ngValue",value:"value"},standalone:!1})}return t})(),ml={provide:He,useExisting:te(()=>xo),multi:!0};function ao(t,i){return t==null?`${i}`:(typeof i=="string"&&(i=`'${i}'`),i&&typeof i=="object"&&(i="Object"),`${t}: ${i}`.slice(0,50))}function yl(t){return t.split(":")[0]}var xo=(()=>{class t extends An{value;_optionMap=new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;writeValue(e){this.value=e;let n;if(Array.isArray(e)){let r=e.map(o=>this._getOptionId(o));n=(o,s)=>{o._setSelected(r.indexOf(s.toString())>-1)}}else n=(r,o)=>{r._setSelected(!1)};this._optionMap.forEach(n)}registerOnChange(e){this.onChange=n=>{let r=[],o=n.selectedOptions;if(o!==void 0){let s=o;for(let a=0;a<s.length;a++){let l=s[a],u=this._getOptionValue(l.value);r.push(u)}}else{let s=n.options;for(let a=0;a<s.length;a++){let l=s[a];if(l.selected){let u=this._getOptionValue(l.value);r.push(u)}}}this.value=r,e(r)}}_registerOption(e){let n=(this._idCounter++).toString();return this._optionMap.set(n,e),n}_getOptionId(e){for(let n of this._optionMap.keys())if(this._compareWith(this._optionMap.get(n)._value,e))return n;return null}_getOptionValue(e){let n=yl(e);return this._optionMap.has(n)?this._optionMap.get(n)._value:e}static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["select","multiple","","formControlName",""],["select","multiple","","formControl",""],["select","multiple","","ngModel",""]],hostBindings:function(n,r){n&1&&pe("change",function(s){return r.onChange(s.target)})("blur",function(){return r.onTouched()})},inputs:{compareWith:"compareWith"},standalone:!1,features:[O([ml]),C]})}return t})(),gp=(()=>{class t{_element;_renderer;_select;id;_value;constructor(e,n,r){this._element=e,this._renderer=n,this._select=r,this._select&&(this.id=this._select._registerOption(this))}set ngValue(e){this._select!=null&&(this._value=e,this._setElementValue(ao(this.id,e)),this._select.writeValue(this._select.value))}set value(e){this._select?(this._value=e,this._setElementValue(ao(this.id,e)),this._select.writeValue(this._select.value)):this._setElementValue(e)}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,"value",e)}_setSelected(e){this._renderer.setProperty(this._element.nativeElement,"selected",e)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static \u0275fac=function(n){return new(n||t)(p(G),p(ae),p(xo,9))};static \u0275dir=_({type:t,selectors:[["option"]],inputs:{ngValue:"ngValue",value:"value"},standalone:!1})}return t})();function bl(t){return typeof t=="number"?t:parseFloat(t)}var vl=(()=>{class t{_validator=mn;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let n=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(n),this._validator=this._enabled?this.createValidator(n):mn,this._onChange&&this._onChange()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,features:[W]})}return t})();var Dl={provide:ze,useExisting:te(()=>_l),multi:!0},_l=(()=>{class t extends vl{min;inputName="min";normalizeInput=e=>bl(e);createValidator=e=>ho(e);static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275dir=_({type:t,selectors:[["input","type","number","min","","formControlName",""],["input","type","number","min","","formControl",""],["input","type","number","min","","ngModel",""]],hostVars:1,hostBindings:function(n,r){n&2&&q("min",r._enabled?r.min:null)},inputs:{min:"min"},standalone:!1,features:[O([Dl]),C]})}return t})();var No=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})(),_i=class extends tt{constructor(i,e,n){super(wi(e),Si(n,e)),this.controls=i,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;at(i){return this.controls[this._adjustIndex(i)]}push(i,e={}){this.controls.push(i),this._registerControl(i),this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}insert(i,e,n={}){this.controls.splice(i,0,e),this._registerControl(e),this.updateValueAndValidity({emitEvent:n.emitEvent})}removeAt(i,e={}){let n=this._adjustIndex(i);n<0&&(n=0),this.controls[n]&&this.controls[n]._registerOnCollectionChange(()=>{}),this.controls.splice(n,1),this.updateValueAndValidity({emitEvent:e.emitEvent})}setControl(i,e,n={}){let r=this._adjustIndex(i);r<0&&(r=0),this.controls[r]&&this.controls[r]._registerOnCollectionChange(()=>{}),this.controls.splice(r,1),e&&(this.controls.splice(r,0,e),this._registerControl(e)),this.updateValueAndValidity({emitEvent:n.emitEvent}),this._onCollectionChange()}get length(){return this.controls.length}setValue(i,e={}){So(this,!1,i),i.forEach((n,r)=>{wo(this,!1,r),this.at(r).setValue(n,{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)}patchValue(i,e={}){i!=null&&(i.forEach((n,r)=>{this.at(r)&&this.at(r).patchValue(n,{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(i=[],e={}){this._forEachChild((n,r)=>{n.reset(i[r],{onlySelf:!0,emitEvent:e.emitEvent})}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e)}getRawValue(){return this.controls.map(i=>i.getRawValue())}clear(i={}){this.controls.length<1||(this._forEachChild(e=>e._registerOnCollectionChange(()=>{})),this.controls.splice(0),this.updateValueAndValidity({emitEvent:i.emitEvent}))}_adjustIndex(i){return i<0?i+this.length:i}_syncPendingControls(){let i=this.controls.reduce((e,n)=>n._syncPendingControls()?!0:e,!1);return i&&this.updateValueAndValidity({onlySelf:!0}),i}_forEachChild(i){this.controls.forEach((e,n)=>{i(e,n)})}_updateValue(){this.value=this.controls.filter(i=>i.enabled||this.disabled).map(i=>i.value)}_anyControls(i){return this.controls.some(e=>e.enabled&&i(e))}_setUpControls(){this._forEachChild(i=>this._registerControl(i))}_allControlsDisabled(){for(let i of this.controls)if(i.enabled)return!1;return this.controls.length>0||this.disabled}_registerControl(i){i.setParent(this),i._registerOnCollectionChange(this._onCollectionChange)}_find(i){return this.at(i)??null}};function lo(t){return!!t&&(t.asyncValidators!==void 0||t.validators!==void 0||t.updateOn!==void 0)}var mp=(()=>{class t{useNonNullable=!1;get nonNullable(){let e=new t;return e.useNonNullable=!0,e}group(e,n=null){let r=this._reduceControls(e),o={};return lo(n)?o=n:n!==null&&(o.validators=n.validator,o.asyncValidators=n.asyncValidator),new _n(r,o)}record(e,n=null){let r=this._reduceControls(e);return new Di(r,n)}control(e,n,r){let o={};return this.useNonNullable?(lo(n)?o=n:(o.validators=n,o.asyncValidators=r),new At(e,ee(D({},o),{nonNullable:!0}))):new At(e,n,r)}array(e,n,r){let o=e.map(s=>this._createControl(s));return new _i(o,n,r)}_reduceControls(e){let n={};return Object.keys(e).forEach(r=>{n[r]=this._createControl(e[r])}),n}_createControl(e){if(e instanceof At)return e;if(e instanceof tt)return e;if(Array.isArray(e)){let n=e[0],r=e.length>1?e[1]:null,o=e.length>2?e[2]:null;return this.control(n,r,o)}else return this.control(e)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var yp=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Ft,useValue:e.callSetDisabledState??Tn}]}}static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[No]})}return t})(),bp=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Oi,useValue:e.warnOnNgModelWithFormControl??"always"},{provide:Ft,useValue:e.callSetDisabledState??Tn}]}}static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({imports:[No]})}return t})();var El=({dt:t})=>`
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
`,wl={root:({instance:t,props:i})=>["p-inputtext p-component",{"p-filled":t.filled,"p-inputtext-sm":i.size==="small","p-inputtext-lg":i.size==="large","p-invalid":i.invalid,"p-variant-filled":i.variant==="filled","p-inputtext-fluid":i.fluid}]},Lo=(()=>{class t extends B{name="inputtext";theme=El;classes=wl;static \u0275fac=(()=>{let e;return function(r){return(e||(e=w(t)))(r||t)}})();static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Op=(()=>{class t extends re{ngModel;variant;fluid;pSize;filled;_componentStyle=m(Lo);get hasFluid(){let n=this.el.nativeElement.closest("p-fluid");return z(this.fluid)?!!n:this.fluid}constructor(e){super(),this.ngModel=e}ngAfterViewInit(){super.ngAfterViewInit(),this.updateFilledState(),this.cd.detectChanges()}ngDoCheck(){this.updateFilledState()}onInput(){this.updateFilledState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length||this.ngModel&&this.ngModel.model}static \u0275fac=function(n){return new(n||t)(p(Ii,8))};static \u0275dir=_({type:t,selectors:[["","pInputText",""]],hostAttrs:[1,"p-inputtext","p-component"],hostVars:14,hostBindings:function(n,r){if(n&1&&pe("input",function(s){return r.onInput(s)}),n&2){let o;We("p-filled",r.filled)("p-variant-filled",((o=r.variant)!==null&&o!==void 0?o:r.config.inputStyle()||r.config.inputVariant())==="filled")("p-inputtext-fluid",r.hasFluid)("p-inputtext-sm",r.pSize==="small")("p-inputfield-sm",r.pSize==="small")("p-inputtext-lg",r.pSize==="large")("p-inputfield-lg",r.pSize==="large")}},inputs:{variant:"variant",fluid:[2,"fluid","fluid",R],pSize:"pSize"},features:[O([Lo]),C]})}return t})(),Mp=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=L({type:t});static \u0275inj=N({})}return t})();var rt=class{},ot=class{},ge=class t{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(i){i?typeof i=="string"?this.lazyInit=()=>{this.headers=new Map,i.split(`
`).forEach(e=>{let n=e.indexOf(":");if(n>0){let r=e.slice(0,n),o=e.slice(n+1).trim();this.addHeaderEntry(r,o)}})}:typeof Headers<"u"&&i instanceof Headers?(this.headers=new Map,i.forEach((e,n)=>{this.addHeaderEntry(n,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(i).forEach(([e,n])=>{this.setHeaderEntries(e,n)})}:this.headers=new Map}has(i){return this.init(),this.headers.has(i.toLowerCase())}get(i){this.init();let e=this.headers.get(i.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(i){return this.init(),this.headers.get(i.toLowerCase())||null}append(i,e){return this.clone({name:i,value:e,op:"a"})}set(i,e){return this.clone({name:i,value:e,op:"s"})}delete(i,e){return this.clone({name:i,value:e,op:"d"})}maybeSetNormalizedName(i,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,i)}init(){this.lazyInit&&(this.lazyInit instanceof t?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(i=>this.applyUpdate(i)),this.lazyUpdate=null))}copyFrom(i){i.init(),Array.from(i.headers.keys()).forEach(e=>{this.headers.set(e,i.headers.get(e)),this.normalizedNames.set(e,i.normalizedNames.get(e))})}clone(i){let e=new t;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof t?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([i]),e}applyUpdate(i){let e=i.name.toLowerCase();switch(i.op){case"a":case"s":let n=i.value;if(typeof n=="string"&&(n=[n]),n.length===0)return;this.maybeSetNormalizedName(i.name,e);let r=(i.op==="a"?this.headers.get(e):void 0)||[];r.push(...n),this.headers.set(e,r);break;case"d":let o=i.value;if(!o)this.headers.delete(e),this.normalizedNames.delete(e);else{let s=this.headers.get(e);if(!s)return;s=s.filter(a=>o.indexOf(a)===-1),s.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,s)}break}}addHeaderEntry(i,e){let n=i.toLowerCase();this.maybeSetNormalizedName(i,n),this.headers.has(n)?this.headers.get(n).push(e):this.headers.set(n,[e])}setHeaderEntries(i,e){let n=(Array.isArray(e)?e:[e]).map(o=>o.toString()),r=i.toLowerCase();this.headers.set(r,n),this.maybeSetNormalizedName(i,r)}forEach(i){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>i(this.normalizedNames.get(e),this.headers.get(e)))}};var Rn=class{encodeKey(i){return Po(i)}encodeValue(i){return Po(i)}decodeKey(i){return decodeURIComponent(i)}decodeValue(i){return decodeURIComponent(i)}};function Sl(t,i){let e=new Map;return t.length>0&&t.replace(/^\?/,"").split("&").forEach(r=>{let o=r.indexOf("="),[s,a]=o==-1?[i.decodeKey(r),""]:[i.decodeKey(r.slice(0,o)),i.decodeValue(r.slice(o+1))],l=e.get(s)||[];l.push(a),e.set(s,l)}),e}var Al=/%(\d[a-f0-9])/gi,Fl={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function Po(t){return encodeURIComponent(t).replace(Al,(i,e)=>Fl[e]??i)}function On(t){return`${t}`}var De=class t{map;encoder;updates=null;cloneFrom=null;constructor(i={}){if(this.encoder=i.encoder||new Rn,i.fromString){if(i.fromObject)throw new U(2805,!1);this.map=Sl(i.fromString,this.encoder)}else i.fromObject?(this.map=new Map,Object.keys(i.fromObject).forEach(e=>{let n=i.fromObject[e],r=Array.isArray(n)?n.map(On):[On(n)];this.map.set(e,r)})):this.map=null}has(i){return this.init(),this.map.has(i)}get(i){this.init();let e=this.map.get(i);return e?e[0]:null}getAll(i){return this.init(),this.map.get(i)||null}keys(){return this.init(),Array.from(this.map.keys())}append(i,e){return this.clone({param:i,value:e,op:"a"})}appendAll(i){let e=[];return Object.keys(i).forEach(n=>{let r=i[n];Array.isArray(r)?r.forEach(o=>{e.push({param:n,value:o,op:"a"})}):e.push({param:n,value:r,op:"a"})}),this.clone(e)}set(i,e){return this.clone({param:i,value:e,op:"s"})}delete(i,e){return this.clone({param:i,value:e,op:"d"})}toString(){return this.init(),this.keys().map(i=>{let e=this.encoder.encodeKey(i);return this.map.get(i).map(n=>e+"="+this.encoder.encodeValue(n)).join("&")}).filter(i=>i!=="").join("&")}clone(i){let e=new t({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(i),e}init(){this.map===null&&(this.map=new Map),this.cloneFrom!==null&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(i=>this.map.set(i,this.cloneFrom.map.get(i))),this.updates.forEach(i=>{switch(i.op){case"a":case"s":let e=(i.op==="a"?this.map.get(i.param):void 0)||[];e.push(On(i.value)),this.map.set(i.param,e);break;case"d":if(i.value!==void 0){let n=this.map.get(i.param)||[],r=n.indexOf(On(i.value));r!==-1&&n.splice(r,1),n.length>0?this.map.set(i.param,n):this.map.delete(i.param)}else{this.map.delete(i.param);break}}}),this.cloneFrom=this.updates=null)}};var xn=class{map=new Map;set(i,e){return this.map.set(i,e),this}get(i){return this.map.has(i)||this.map.set(i,i.defaultValue()),this.map.get(i)}delete(i){return this.map.delete(i),this}has(i){return this.map.has(i)}keys(){return this.map.keys()}};function Tl(t){switch(t){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function ko(t){return typeof ArrayBuffer<"u"&&t instanceof ArrayBuffer}function $o(t){return typeof Blob<"u"&&t instanceof Blob}function Vo(t){return typeof FormData<"u"&&t instanceof FormData}function Il(t){return typeof URLSearchParams<"u"&&t instanceof URLSearchParams}var Tt="Content-Type",Nn="Accept",Li="X-Request-URL",Uo="text/plain",jo="application/json",Ho=`${jo}, ${Uo}, */*`,it=class t{url;body=null;headers;context;reportProgress=!1;withCredentials=!1;responseType="json";method;params;urlWithParams;transferCache;constructor(i,e,n,r){this.url=e,this.method=i.toUpperCase();let o;if(Tl(this.method)||r?(this.body=n!==void 0?n:null,o=r):o=n,o&&(this.reportProgress=!!o.reportProgress,this.withCredentials=!!o.withCredentials,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),this.transferCache=o.transferCache),this.headers??=new ge,this.context??=new xn,!this.params)this.params=new De,this.urlWithParams=e;else{let s=this.params.toString();if(s.length===0)this.urlWithParams=e;else{let a=e.indexOf("?"),l=a===-1?"?":a<e.length-1?"&":"";this.urlWithParams=e+l+s}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||ko(this.body)||$o(this.body)||Vo(this.body)||Il(this.body)?this.body:this.body instanceof De?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||Vo(this.body)?null:$o(this.body)?this.body.type||null:ko(this.body)?null:typeof this.body=="string"?Uo:this.body instanceof De?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?jo:null}clone(i={}){let e=i.method||this.method,n=i.url||this.url,r=i.responseType||this.responseType,o=i.transferCache??this.transferCache,s=i.body!==void 0?i.body:this.body,a=i.withCredentials??this.withCredentials,l=i.reportProgress??this.reportProgress,u=i.headers||this.headers,c=i.params||this.params,d=i.context??this.context;return i.setHeaders!==void 0&&(u=Object.keys(i.setHeaders).reduce((f,h)=>f.set(h,i.setHeaders[h]),u)),i.setParams&&(c=Object.keys(i.setParams).reduce((f,h)=>f.set(h,i.setParams[h]),c)),new t(e,n,s,{params:c,headers:u,context:d,reportProgress:l,responseType:r,withCredentials:a,transferCache:o})}},_e=function(t){return t[t.Sent=0]="Sent",t[t.UploadProgress=1]="UploadProgress",t[t.ResponseHeader=2]="ResponseHeader",t[t.DownloadProgress=3]="DownloadProgress",t[t.Response=4]="Response",t[t.User=5]="User",t}(_e||{}),st=class{headers;status;statusText;url;ok;type;constructor(i,e=200,n="OK"){this.headers=i.headers||new ge,this.status=i.status!==void 0?i.status:e,this.statusText=i.statusText||n,this.url=i.url||null,this.ok=this.status>=200&&this.status<300}},It=class t extends st{constructor(i={}){super(i)}type=_e.ResponseHeader;clone(i={}){return new t({headers:i.headers||this.headers,status:i.status!==void 0?i.status:this.status,statusText:i.statusText||this.statusText,url:i.url||this.url||void 0})}},at=class t extends st{body;constructor(i={}){super(i),this.body=i.body!==void 0?i.body:null}type=_e.Response;clone(i={}){return new t({body:i.body!==void 0?i.body:this.body,headers:i.headers||this.headers,status:i.status!==void 0?i.status:this.status,statusText:i.statusText||this.statusText,url:i.url||this.url||void 0})}},ve=class extends st{name="HttpErrorResponse";message;error;ok=!1;constructor(i){super(i,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${i.url||"(unknown url)"}`:this.message=`Http failure response for ${i.url||"(unknown url)"}: ${i.status} ${i.statusText}`,this.error=i.error||null}},zo=200,Ol=204;function Mi(t,i){return{body:i,headers:t.headers,context:t.context,observe:t.observe,params:t.params,reportProgress:t.reportProgress,responseType:t.responseType,withCredentials:t.withCredentials,transferCache:t.transferCache}}var Wo=(()=>{class t{handler;constructor(e){this.handler=e}request(e,n,r={}){let o;if(e instanceof it)o=e;else{let l;r.headers instanceof ge?l=r.headers:l=new ge(r.headers);let u;r.params&&(r.params instanceof De?u=r.params:u=new De({fromObject:r.params})),o=new it(e,n,r.body!==void 0?r.body:null,{headers:l,context:r.context,params:u,reportProgress:r.reportProgress,responseType:r.responseType||"json",withCredentials:r.withCredentials,transferCache:r.transferCache})}let s=$n(o).pipe(Hi(l=>this.handler.handle(l)));if(e instanceof it||r.observe==="events")return s;let a=s.pipe(ji(l=>l instanceof at));switch(r.observe||"body"){case"body":switch(o.responseType){case"arraybuffer":return a.pipe(Le(l=>{if(l.body!==null&&!(l.body instanceof ArrayBuffer))throw new U(2806,!1);return l.body}));case"blob":return a.pipe(Le(l=>{if(l.body!==null&&!(l.body instanceof Blob))throw new U(2807,!1);return l.body}));case"text":return a.pipe(Le(l=>{if(l.body!==null&&typeof l.body!="string")throw new U(2808,!1);return l.body}));case"json":default:return a.pipe(Le(l=>l.body))}case"response":return a;default:throw new U(2809,!1)}}delete(e,n={}){return this.request("DELETE",e,n)}get(e,n={}){return this.request("GET",e,n)}head(e,n={}){return this.request("HEAD",e,n)}jsonp(e,n){return this.request("JSONP",e,{params:new De().append(n,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,n={}){return this.request("OPTIONS",e,n)}patch(e,n,r={}){return this.request("PATCH",e,Mi(r,n))}post(e,n,r={}){return this.request("POST",e,Mi(r,n))}put(e,n,r={}){return this.request("PUT",e,Mi(r,n))}static \u0275fac=function(n){return new(n||t)(k(rt))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Ml=/^\)\]\}',?\n/;function Bo(t){if(t.url)return t.url;let i=Li.toLocaleLowerCase();return t.headers.get(i)}var Go=new I(""),Mn=(()=>{class t{fetchImpl=m(Ri,{optional:!0})?.fetch??((...e)=>globalThis.fetch(...e));ngZone=m(qt);destroyRef=m(qi);destroyed=!1;constructor(){this.destroyRef.onDestroy(()=>{this.destroyed=!0})}handle(e){return new kn(n=>{let r=new AbortController;return this.doRequest(e,r.signal,n).then(xi,o=>n.error(new ve({error:o}))),()=>r.abort()})}doRequest(e,n,r){return Ht(this,null,function*(){let o=this.createRequestInit(e),s;try{let h=this.ngZone.runOutsideAngular(()=>this.fetchImpl(e.urlWithParams,D({signal:n},o)));Rl(h),r.next({type:_e.Sent}),s=yield h}catch(h){r.error(new ve({error:h,status:h.status??0,statusText:h.statusText,url:e.urlWithParams,headers:h.headers}));return}let a=new ge(s.headers),l=s.statusText,u=Bo(s)??e.urlWithParams,c=s.status,d=null;if(e.reportProgress&&r.next(new It({headers:a,status:c,statusText:l,url:u})),s.body){let h=s.headers.get("content-length"),y=[],g=s.body.getReader(),b=0,S,E,A=typeof Zone<"u"&&Zone.current,M=!1;if(yield this.ngZone.runOutsideAngular(()=>Ht(this,null,function*(){for(;;){if(this.destroyed){yield g.cancel(),M=!0;break}let{done:Q,value:Ce}=yield g.read();if(Q)break;if(y.push(Ce),b+=Ce.length,e.reportProgress){E=e.responseType==="text"?(E??"")+(S??=new TextDecoder).decode(Ce,{stream:!0}):void 0;let Ee=()=>r.next({type:_e.DownloadProgress,total:h?+h:void 0,loaded:b,partialText:E});A?A.run(Ee):Ee()}}})),M){r.complete();return}let oe=this.concatChunks(y,b);try{let Q=s.headers.get(Tt)??"";d=this.parseBody(e,oe,Q)}catch(Q){r.error(new ve({error:Q,headers:new ge(s.headers),status:s.status,statusText:s.statusText,url:Bo(s)??e.urlWithParams}));return}}c===0&&(c=d?zo:0),c>=200&&c<300?(r.next(new at({body:d,headers:a,status:c,statusText:l,url:u})),r.complete()):r.error(new ve({error:d,headers:a,status:c,statusText:l,url:u}))})}parseBody(e,n,r){switch(e.responseType){case"json":let o=new TextDecoder().decode(n).replace(Ml,"");return o===""?null:JSON.parse(o);case"text":return new TextDecoder().decode(n);case"blob":return new Blob([n],{type:r});case"arraybuffer":return n.buffer}}createRequestInit(e){let n={},r=e.withCredentials?"include":void 0;if(e.headers.forEach((o,s)=>n[o]=s.join(",")),e.headers.has(Nn)||(n[Nn]=Ho),!e.headers.has(Tt)){let o=e.detectContentTypeHeader();o!==null&&(n[Tt]=o)}return{body:e.serializeBody(),method:e.method,headers:n,credentials:r}}concatChunks(e,n){let r=new Uint8Array(n),o=0;for(let s of e)r.set(s,o),o+=s.length;return r}static \u0275fac=function(n){return new(n||t)};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Ri=class{};function xi(){}function Rl(t){t.then(xi,xi)}function xl(t,i){return i(t)}function Nl(t,i,e){return(n,r)=>Ki(e,()=>i(n,o=>t(o,r)))}var Pi=new I(""),Ko=new I(""),qo=new I("",{providedIn:"root",factory:()=>!0});var Ln=(()=>{class t extends rt{backend;injector;chain=null;pendingTasks=m(Yi);contributeToStability=m(qo);constructor(e,n){super(),this.backend=e,this.injector=n}handle(e){if(this.chain===null){let n=Array.from(new Set([...this.injector.get(Pi),...this.injector.get(Ko,[])]));this.chain=n.reduceRight((r,o)=>Nl(r,o,this.injector),xl)}if(this.contributeToStability){let n=this.pendingTasks.add();return this.chain(e,r=>this.backend.handle(r)).pipe(zi(()=>this.pendingTasks.remove(n)))}else return this.chain(e,n=>this.backend.handle(n))}static \u0275fac=function(n){return new(n||t)(k(ot),k(Gi))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})();var Ll=/^\)\]\}',?\n/,Pl=RegExp(`^${Li}:`,"m");function kl(t){return"responseURL"in t&&t.responseURL?t.responseURL:Pl.test(t.getAllResponseHeaders())?t.getResponseHeader(Li):null}var Ni=(()=>{class t{xhrFactory;constructor(e){this.xhrFactory=e}handle(e){if(e.method==="JSONP")throw new U(-2800,!1);let n=this.xhrFactory;return(n.\u0275loadImpl?zt(n.\u0275loadImpl()):$n(null)).pipe(Wi(()=>new kn(o=>{let s=n.build();if(s.open(e.method,e.urlWithParams),e.withCredentials&&(s.withCredentials=!0),e.headers.forEach((g,b)=>s.setRequestHeader(g,b.join(","))),e.headers.has(Nn)||s.setRequestHeader(Nn,Ho),!e.headers.has(Tt)){let g=e.detectContentTypeHeader();g!==null&&s.setRequestHeader(Tt,g)}if(e.responseType){let g=e.responseType.toLowerCase();s.responseType=g!=="json"?g:"text"}let a=e.serializeBody(),l=null,u=()=>{if(l!==null)return l;let g=s.statusText||"OK",b=new ge(s.getAllResponseHeaders()),S=kl(s)||e.url;return l=new It({headers:b,status:s.status,statusText:g,url:S}),l},c=()=>{let{headers:g,status:b,statusText:S,url:E}=u(),A=null;b!==Ol&&(A=typeof s.response>"u"?s.responseText:s.response),b===0&&(b=A?zo:0);let M=b>=200&&b<300;if(e.responseType==="json"&&typeof A=="string"){let oe=A;A=A.replace(Ll,"");try{A=A!==""?JSON.parse(A):null}catch(Q){A=oe,M&&(M=!1,A={error:Q,text:A})}}M?(o.next(new at({body:A,headers:g,status:b,statusText:S,url:E||void 0})),o.complete()):o.error(new ve({error:A,headers:g,status:b,statusText:S,url:E||void 0}))},d=g=>{let{url:b}=u(),S=new ve({error:g,status:s.status||0,statusText:s.statusText||"Unknown Error",url:b||void 0});o.error(S)},f=!1,h=g=>{f||(o.next(u()),f=!0);let b={type:_e.DownloadProgress,loaded:g.loaded};g.lengthComputable&&(b.total=g.total),e.responseType==="text"&&s.responseText&&(b.partialText=s.responseText),o.next(b)},y=g=>{let b={type:_e.UploadProgress,loaded:g.loaded};g.lengthComputable&&(b.total=g.total),o.next(b)};return s.addEventListener("load",c),s.addEventListener("error",d),s.addEventListener("timeout",d),s.addEventListener("abort",d),e.reportProgress&&(s.addEventListener("progress",h),a!==null&&s.upload&&s.upload.addEventListener("progress",y)),s.send(a),o.next({type:_e.Sent}),()=>{s.removeEventListener("error",d),s.removeEventListener("abort",d),s.removeEventListener("load",c),s.removeEventListener("timeout",d),e.reportProgress&&(s.removeEventListener("progress",h),a!==null&&s.upload&&s.upload.removeEventListener("progress",y)),s.readyState!==s.DONE&&s.abort()}})))}static \u0275fac=function(n){return new(n||t)(k(bt))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Yo=new I(""),$l="XSRF-TOKEN",Vl=new I("",{providedIn:"root",factory:()=>$l}),Bl="X-XSRF-TOKEN",Ul=new I("",{providedIn:"root",factory:()=>Bl}),Ot=class{},jl=(()=>{class t{doc;cookieName;lastCookieString="";lastToken=null;parseCount=0;constructor(e,n){this.doc=e,this.cookieName=n}getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=ei(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(n){return new(n||t)(k(j),k(Vl))};static \u0275prov=v({token:t,factory:t.\u0275fac})}return t})(),Hl=/^(?:https?:)?\/\//i;function zl(t,i){if(!m(Yo)||t.method==="GET"||t.method==="HEAD"||Hl.test(t.url))return i(t);let e=m(Ot).getToken(),n=m(Ul);return e!=null&&!t.headers.has(n)&&(t=t.clone({headers:t.headers.set(n,e)})),i(t)}var Pn=function(t){return t[t.Interceptors=0]="Interceptors",t[t.LegacyInterceptors=1]="LegacyInterceptors",t[t.CustomXsrfConfiguration=2]="CustomXsrfConfiguration",t[t.NoXsrfProtection=3]="NoXsrfProtection",t[t.JsonpSupport=4]="JsonpSupport",t[t.RequestsMadeViaParent=5]="RequestsMadeViaParent",t[t.Fetch=6]="Fetch",t}(Pn||{});function Zo(t,i){return{\u0275kind:t,\u0275providers:i}}function Wl(...t){let i=[Wo,Ni,Ln,{provide:rt,useExisting:Ln},{provide:ot,useFactory:()=>m(Go,{optional:!0})??m(Ni)},{provide:Pi,useValue:zl,multi:!0},{provide:Yo,useValue:!0},{provide:Ot,useClass:jl}];for(let e of t)i.push(...e.\u0275providers);return Wt(i)}function Gl(t){return Zo(Pn.Interceptors,t.map(i=>({provide:Pi,useValue:i,multi:!0})))}function Kl(){return Zo(Pn.Fetch,[Mn,{provide:Go,useExisting:Mn},{provide:ot,useExisting:Mn}])}var Xo=class t{static isArray(i,e=!0){return Array.isArray(i)&&(e||i.length!==0)}static isObject(i,e=!0){return typeof i=="object"&&!Array.isArray(i)&&i!=null&&(e||Object.keys(i).length!==0)}static equals(i,e,n){return n?this.resolveFieldData(i,n)===this.resolveFieldData(e,n):this.equalsByValue(i,e)}static equalsByValue(i,e){if(i===e)return!0;if(i&&e&&typeof i=="object"&&typeof e=="object"){var n=Array.isArray(i),r=Array.isArray(e),o,s,a;if(n&&r){if(s=i.length,s!=e.length)return!1;for(o=s;o--!==0;)if(!this.equalsByValue(i[o],e[o]))return!1;return!0}if(n!=r)return!1;var l=this.isDate(i),u=this.isDate(e);if(l!=u)return!1;if(l&&u)return i.getTime()==e.getTime();var c=i instanceof RegExp,d=e instanceof RegExp;if(c!=d)return!1;if(c&&d)return i.toString()==e.toString();var f=Object.keys(i);if(s=f.length,s!==Object.keys(e).length)return!1;for(o=s;o--!==0;)if(!Object.prototype.hasOwnProperty.call(e,f[o]))return!1;for(o=s;o--!==0;)if(a=f[o],!this.equalsByValue(i[a],e[a]))return!1;return!0}return i!==i&&e!==e}static resolveFieldData(i,e){if(i&&e){if(this.isFunction(e))return e(i);if(e.indexOf(".")==-1)return i[e];{let n=e.split("."),r=i;for(let o=0,s=n.length;o<s;++o){if(r==null)return null;r=r[n[o]]}return r}}else return null}static isFunction(i){return!!(i&&i.constructor&&i.call&&i.apply)}static reorderArray(i,e,n){let r;i&&e!==n&&(n>=i.length&&(n%=i.length,e%=i.length),i.splice(n,0,i.splice(e,1)[0]))}static insertIntoOrderedArray(i,e,n,r){if(n.length>0){let o=!1;for(let s=0;s<n.length;s++)if(this.findIndexInList(n[s],r)>e){n.splice(s,0,i),o=!0;break}o||n.push(i)}else n.push(i)}static findIndexInList(i,e){let n=-1;if(e){for(let r=0;r<e.length;r++)if(e[r]==i){n=r;break}}return n}static contains(i,e){if(i!=null&&e&&e.length){for(let n of e)if(this.equals(i,n))return!0}return!1}static removeAccents(i){return i&&(i=i.normalize("NFKD").replace(new RegExp("\\p{Diacritic}","gu"),"")),i}static isDate(i){return Object.prototype.toString.call(i)==="[object Date]"}static isEmpty(i){return i==null||i===""||Array.isArray(i)&&i.length===0||!this.isDate(i)&&typeof i=="object"&&Object.keys(i).length===0}static isNotEmpty(i){return!this.isEmpty(i)}static compare(i,e,n,r=1){let o=-1,s=this.isEmpty(i),a=this.isEmpty(e);return s&&a?o=0:s?o=r:a?o=-r:typeof i=="string"&&typeof e=="string"?o=i.localeCompare(e,n,{numeric:!0}):o=i<e?-1:i>e?1:0,o}static sort(i,e,n=1,r,o=1){let s=t.compare(i,e,r,n),a=n;return(t.isEmpty(i)||t.isEmpty(e))&&(a=o===1?n:o),a*s}static merge(i,e){if(!(i==null&&e==null)){{if((i==null||typeof i=="object")&&(e==null||typeof e=="object"))return D(D({},i||{}),e||{});if((i==null||typeof i=="string")&&(e==null||typeof e=="string"))return[i||"",e||""].join(" ")}return e||i}}static isPrintableCharacter(i=""){return this.isNotEmpty(i)&&i.length===1&&i.match(/\S| /)}static getItemValue(i,...e){return this.isFunction(i)?i(...e):i}static findLastIndex(i,e){let n=-1;if(this.isNotEmpty(i))try{n=i.findLastIndex(e)}catch{n=i.lastIndexOf([...i].reverse().find(e))}return n}static findLast(i,e){let n;if(this.isNotEmpty(i))try{n=i.findLast(e)}catch{n=[...i].reverse().find(e)}return n}static deepEquals(i,e){if(i===e)return!0;if(i&&e&&typeof i=="object"&&typeof e=="object"){var n=Array.isArray(i),r=Array.isArray(e),o,s,a;if(n&&r){if(s=i.length,s!=e.length)return!1;for(o=s;o--!==0;)if(!this.deepEquals(i[o],e[o]))return!1;return!0}if(n!=r)return!1;var l=i instanceof Date,u=e instanceof Date;if(l!=u)return!1;if(l&&u)return i.getTime()==e.getTime();var c=i instanceof RegExp,d=e instanceof RegExp;if(c!=d)return!1;if(c&&d)return i.toString()==e.toString();var f=Object.keys(i);if(s=f.length,s!==Object.keys(e).length)return!1;for(o=s;o--!==0;)if(!Object.prototype.hasOwnProperty.call(e,f[o]))return!1;for(o=s;o--!==0;)if(a=f[o],!this.deepEquals(i[a],e[a]))return!1;return!0}return i!==i&&e!==e}static minifyCSS(i){return i&&i.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,"").replace(/ {2,}/g," ").replace(/ ([{:}]) /g,"$1").replace(/([;,]) /g,"$1").replace(/ !/g,"!").replace(/: /g,":")}static toFlatCase(i){return this.isString(i)?i.replace(/(-|_)/g,"").toLowerCase():i}static isString(i,e=!0){return typeof i=="string"&&(e||i!=="")}},Jo=0;function Og(t="pn_id_"){return Jo++,`${t}${Jo}`}function ql(){let t=[],i=(o,s)=>{let a=t.length>0?t[t.length-1]:{key:o,value:s},l=a.value+(a.key===o?0:s)+2;return t.push({key:o,value:l}),l},e=o=>{t=t.filter(s=>s.value!==o)},n=()=>t.length>0?t[t.length-1].value:0,r=o=>o&&parseInt(o.style.zIndex,10)||0;return{get:r,set:(o,s,a)=>{s&&(s.style.zIndex=String(i(o,a)))},clear:o=>{o&&(e(r(o)),o.style.zIndex="")},getCurrent:()=>n(),generateZIndex:i,revertZIndex:e}}var Mg=ql(),Rg=t=>!!t;export{j as a,Be as b,ys as c,Wn as d,bs as e,Ke as f,ar as g,lr as h,Cs as i,Zn as j,yr as k,Xn as l,Jn as m,Qn as n,Os as o,Ms as p,Me as q,ei as r,_r as s,vt as t,ti as u,bt as v,xc as w,ge as x,De as y,ve as z,Wo as A,Wl as B,Gl as C,Kl as D,Er as E,Dt as F,Vc as G,Ue as H,Bc as I,Sr as J,Ps as K,ks as L,Uc as M,jc as N,Ar as O,Hc as P,zc as Q,Wc as R,Gc as S,$s as T,Vs as U,Kc as V,qc as W,Fr as X,Yc as Y,ri as Z,Zc as _,Xc as $,Ir as aa,oi as ba,Jc as ca,Qc as da,si as ea,Us as fa,ed as ga,td as ha,nd as ia,id as ja,rd as ka,od as la,sd as ma,z as na,js as oa,T as pa,ln as qa,li as ra,cd as sa,dd as ta,cn as ua,hd as va,fd as wa,_t as xa,P as ya,Id as za,Od as Aa,Md as Ba,Rd as Ca,xd as Da,Pr as Ea,xe as Fa,Nd as Ga,Hd as Ha,B as Ia,fh as Ja,re as Ka,gi as La,Wr as Ma,Gr as Na,Lh as Oa,pn as Pa,Yr as Qa,df as Ra,Xr as Sa,_f as Ta,Ma as Ua,Gf as Va,Xo as Wa,Og as Xa,Mg as Ya,Rg as Za,He as _a,co as $a,eo as ab,be as bb,cp as cb,dp as db,_n as eb,At as fb,Ii as gb,fp as hb,sl as ib,ll as jb,Fo as kb,To as lb,Io as mb,fl as nb,Ro as ob,pp as pb,gp as qb,_l as rb,mp as sb,yp as tb,bp as ub,Op as vb,Mp as wb};
