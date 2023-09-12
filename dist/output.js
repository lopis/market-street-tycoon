document.write('<!doctype html><meta charset=UTF-8><meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0" name=viewport><title>Market Street Tycoon</title><link rel="shortcut icon" type=image/x-icon><style>#c2d{height:100vh;aspect-ratio:160/144;position:absolute;image-rendering:pixelated;background-color:#000}body,html{margin:0;background-color:#111;display:flex;justify-content:center;align-items:center;height:100%;user-select:none}@media (max-width:900px){body{background:#f7cebd}#gamepad{position:fixed;top:0;left:0;height:100vh;width:100vw}b{position:absolute;display:inline-flex;border:2px solid;border-radius:7vmax;height:7vmax;width:7vmax;font-size:3vmax;color:#b85930;justify-content:center;align-items:center;font-family:monospace;transition:50ms ease-in-out}b:active{color:#f7cebd;transform:scale(1.2)}#down,#up{left:8vmax;bottom:20vmax}#down{bottom:7vmax}#left,#right{left:1.5vmax;bottom:13.5vmax}#right{left:14.5vmax}#ok{right:8vmax;bottom:13.5vmax}}@media (orientation:portrait){body{align-items:flex-start;padding-top:20vh}#gamepad{top:-10vw;left:4vw}#c2d{height:auto;width:100vw}#ok{right:7vmax}}</style><div id=gamepad><b id=up>▲</b><b id=down>▼</b><b id=left>◀</b><b id=right>▶</b><b id=ok>OK</b></div><canvas id=c2d></canvas><canvas id=font height=20 hidden style="border:1px solid" width=250></canvas>');let g,l,n,p=(a,b,c)=>{let d=a.createOscillator(),e=a.createGain(),f=a.createBiquadFilter();f.type="bandpass";f.frequency.setValueAtTime(800,c);d.type="square";d.connect(e);e.connect(f).connect(a.destination);e.gain.setValueAtTime(.01,c);e.gain.linearRampToValueAtTime(.3,c+.2);e.gain.setValueAtTime(.3,c+.2);e.gain.setValueAtTime(.3,c+.175);e.gain.linearRampToValueAtTime(.01,c+.375);d.frequency.setValueAtTime(440/1.06**b,c);return d},q=[],t={E:-5,F:-4,G:-2,a:0,b:2,c:3,d:5,e:7,"-":-999};
"GddGddGccGccGeeGeeFddFddEaaGddGddaddGddaddGdbG--".split("").forEach(a=>{q.push(-t[a])});
let u=!0,v=0,w=0,x=(a=!1)=>{if(u){if(w+.25*v<g.currentTime){var b=w+.25*v;let e=p(g,q[v],b);var c=n=g.createBufferSource(),d=.25*g.sampleRate;let f=g.createBuffer(1,d,g.sampleRate),h=f.getChannelData(0);for(let k=0;k<d;k++)h[k]=2*Math.random()-1;c.buffer=f;c=g.createBiquadFilter();c.type="bandpass";c.frequency.setValueAtTime(500,b);d=g.createGain();d.gain.setValueAtTime(.01,b);d.gain.exponentialRampToValueAtTime(.3,b+.1175);d.gain.setValueAtTime(.3,b+.25*(.9-.47));d.gain.exponentialRampToValueAtTime(.01,
b+.25);n.connect(c).connect(d).connect(g.destination);n.start();e.start(b);e.stop(b+.375);v++;if(v==q.length){if(!a)return;w=g.currentTime+.25;v=0}}setTimeout(x,.25)}},y=a=>{l||(l=new AudioContext);let b=l.currentTime;a=p(l,a,b);a.start(b);a.stop(b+.25)},z="apples bread oil wood eggs pies ceramics gems spice".split(" "),A="Catarina Leonor Bento Marcos Apar\u00edcia Isabel Manuel Gra\u00e7a Teresa Vicente Jacinta Jo\u00e3o Diogo Sim\u00e3o Luciana Gil".split(" "),B=()=>{let a=A.pop();A.unshift(a);
return a};function C(a){a.s=a.s.filter(b=>0<b.j)}
function aa(a){for(a.s.some(c=>a.o>=c.l)||a.s.push({v:"wood",O:B(),l:a.o,j:Math.ceil(a.o/2)});3>a.s.length;){var b=["apples","bread","oil","wood"];2<a.A.apples&&2<a.A.bread&&2<a.A.eggs&&b.push("pies");Object.values(a.A).some(d=>2<d)&&(b.push("ceramics"),b.push("spice"));2<a.A.ceramics&&b.push("gems");2<a.A.gems&&b.push("gems");b=b[Math.floor(Math.random()*(b.length-.01))];let c=Math.round(15*(a.A[b]||0)/100*Math.random()+5);a.s.push({v:b,O:B(),l:c*(a.S[b]||1),j:c})}}
function ba(a,b,c){a.history[a.B]={M:b,P:c}}
class ca{constructor(){this.s=[];this.j={};this.l={};this.R={};this.A={};this.M={bread:1,apples:.6,oil:.5,wood:1,ceramics:.5,pies:.8,gems:.8,spice:1};this.S={bread:6,apples:8,oil:16,wood:3,ceramics:20,pies:10,gems:30};this.T={bread:1,apples:.4,oil:0,wood:0,ceramics:0,pies:1,gems:0};this.B=1;this.history=[];this.o=15;let a=Array(A.length);for(;0!=A.length;){let b=Math.round(Math.random()*(a.length-1));for(;a[b];)b=(b+1)%a.length;a[b]=A.pop()}A=a;this.s=[{v:"apples",O:B(),l:15,j:6},{v:"bread",O:B(),
l:15,j:5},{v:"oil",O:B(),l:64,j:4}]}save(){localStorage.setItem("market_street_tycoon_history",JSON.stringify({history:this.history,s:this.s,o:this.o,j:this.j}))}delete(){localStorage.removeItem("market_street_tycoon_history")}}function D(a,b){var c=[];a.g.U?.();a.g=b;a.g.L?.(...c)}class E{constructor(a,...b){this.g=a;this.g.L?.(...b)}}let F,G;function H(a,b,c){b=b.targetTouches[0]?.target?.id;c?b&&(a.m=b):a.m=""}
function I(a,b){var c=J;c.I&&!c.g.I&&0<a.selection&&(a.selection--,y(2));c.C&&!c.g.C&&a.selection<b&&(a.selection++,y(2))}
class da{constructor(){this.N=this.u=this.H=this.D=this.C=this.I=!1;this.h=new Map;this.m="";this.g={I:this.I,C:this.C,D:this.D,H:this.H,u:this.u,N:this.N};document.addEventListener("keydown",a=>{this.h.set(a.code,!0)});document.addEventListener("keyup",a=>{this.h.set(a.code,!1)});this.i=new DOMPoint;document.addEventListener("touchstart",a=>H(this,a,!0));document.addEventListener("touchend",a=>H(this,a,!1))}}
let J=new da,K={apples:{data:"@X@@C@RSERRBWRGx\u007f@",size:6,padding:6,y:0},bread:{data:"hmmEmoomm}}momm}hmmExmmGx\u007f\u007fG@@@@",size:8,padding:9,y:-1},oil:{data:"@mm@@m@@XC@[[[X[[C_[{x\u007f\u007fG",size:7,padding:9,y:-1},wood:{data:"@II@HIIAHIIAH\u007f\u007fAxmmGx}oGxmmG@\u007f\u007f@",size:8,padding:8,y:-1},pies:{data:"@@@@x\u007f\u007fGojjzWUU}\u007f\u007f\u007f\u007f\u007f\u007f\u007f\u007fx\u007f\u007fG@@@@",size:8,padding:9,y:0},ceramics:{data:"PRRB@RR@PRRBQRRJJIIQRRRRQRRJHIIA",size:8,
padding:9,y:-1},gems:{data:"@@@@`d@hdlh`dhE@@EE@E@mE@",size:7,padding:10,y:-1},spice:{data:"@@@@@PG@@Rz@PRWGRRzzPRWG@@@@@@@@",size:8,padding:8,y:-1},eggs:{data:"hEhmEmmhmEhE@",size:5,padding:5,y:0}};function ea(a){I(a,a.h.length);let b=J.D&&!J.g.D,c=J.H&&!J.g.H;if(b||c)a.selection<a.h.length?(y(b?2:-2),fa(a,b)):(y(2),a.m=!a.m);J.u&&!J.g.u&&2===a.i&&(a.selection==a.h.length&&(a.m?D(G,new L(a.g,!0)):(a.i=0,setTimeout(()=>{D(G,new ha(a.g))},1200))),y(-2))}
function fa(a,b){a.active=[a.selection,b?"\u2013":"+"];setTimeout(()=>{a.active=[-1,""]},100);let c=a.h[a.selection];c&&void 0!=a.g.l[c]&&(a.g.l[c]=Math.max(1,a.g.l[c]+(b?-1:1)))}
class ia{constructor(a){this.selection=0;this.active=[-1,""];this.h=[];this.i=2;this.J=this.m=!1;this.g=a}L(){this.h=z.filter(a=>{let b=this.g.j[a];this.g.l[a]||(this.g.l[a]=1);return!!b});this.m=this.J=!this.h.length}K(a=0){M(this.g.B);O("Manage stock",this.g);this.J&&P(Q,"Your stock is empty",12,80,48,"#FFFFFF88","center");let b=0;Q.g.save();Q.g.rect(0,12,160,112);Q.g.clip();Q.g.translate(0,60*-Math.max(0,Math.min(this.h.length-2,this.selection)));this.h.forEach(c=>{let d=60*b+15;var e=this.g.j[c];
let f=this.g.R[c]||0;e&&(R(Q,K[c],3,d+1),P(Q,c,10,14,d+1,"#FFFFFF88"),P(Q,`Stock: ${e}`,10,1,d+12,"#FFFFFF88"),P(Q,`Avg cost: ${f}`,10,1,d+24,"#FFFFFF88"),e=1+Math.round(4*(this.g.A[c]||0)/100),P(Q,`Reputation: ${"\u2605".repeat(e)}${"\u2729".repeat(5-e)}`,10,1,d+36,"#FFFFFF88"),["\u2013","+"].map((h,k)=>S(100+53*k,d+5,this.selection===b?"white":"#FFFFFF88",h,this.active[0]===b&&this.active[1]===h)),P(Q,`${this.g.l[c]}$`,10,127,d+7,"#FFFFFF88","center"),b++)});Q.g.restore();!this.J&&S(130,129,this.m||
this.selection!==this.h.length?"#FFFFFF88":"white","next");S(30,129,this.m&&this.selection===this.h.length?"white":"#FFFFFF88","back");2!=this.i&&(this.i=Math.min(1,this.i+a/1E3),T(1-this.i));ea(this)}}function ja(a){I(a,a.g.s.length);J.u&&!J.g.u&&(a.active=a.selection,setTimeout(()=>{a.active=-1},100),a.selection==a.g.s.length&&(y(-2),D(G,new ia(a.g))),ka(a))}
function ka(a){let b=a.g.s[a.selection];if(b)if(0<b.j&&b.l<=a.g.o){y(-2);a.g.o-=b.l;var c=a.g.l[b.v]||0,d=a.g.j[b.v]||0;a.g.R[b.v]=Math.round(10*(a.g.R[b.v]&&c?(b.l+c*d)/(b.j+d):b.l/b.j))/10;a.g.j[b.v]=d+b.j;b.j=0}else y(5)}
class L{constructor(a,b=!1){this.selection=0;this.active=-1;this.i=!1;this.h=0;this.g=a;this.i=b}L(){C(this.g);this.g.save();this.i||aa(this.g)}K(a=0){this.h+=a;M(this.g.B);O("Suppliers",this.g);this.g.s.forEach((b,c)=>{let d=28*c+15;R(Q,K[b.v],3,d+6);P(Q,b.O,10,14,1+d,"#FFFFFF88");let e=`${b.j}  ${b.v}   ${b.l}$`;P(Q,b.j?e:"soldout",10,14,d+13,"#FFFFFF88");S(140,d+5,this.selection===c?"white":"#FFFFFF88","BUY",this.active===c)});S(130,129,this.selection===this.g.s.length?"white":"#FFFFFF88","next");
1<this.g.B&&500<this.h&&3E3>this.h&&P(Q,"Game saved",10,5,132,"#00000088");ja(this)}}
class la{constructor(a){this.total=this.h=this.selection=0;this.i={};this.g=a}U(){this.g.o+=this.total}L(){let a=this.g.history[this.g.B];Object.keys(a.P).map(b=>{let c=a.P[b]=Math.round(a.P[b]||0);a.M[b]=1E4*(a.M[b]||0)/20;this.total+=c*(this.g.l[b]||0);let d=Math.max(0,(this.g.j[b]||0)-c),e=Math.floor((this.g.T[b]||0)*d);this.g.j[b]=d-e;this.i[b]=e;this.g.A[b]=(this.g.A[b]||0)+c})}K(a=0){M(this.g.B);O("Summary",this.g,this.total);if(0===this.g.o+this.total)["You ran out of money.","GAME OVER"].map((d,
e)=>{P(Q,d,12,80,48+15*e,"#FFFFFF88","center")}),S(80,129,"white","return");else{S(130,129,"white","next");let d=this.g.history[this.g.B];Q.g.save();Q.g.rect(0,12,160,112);Q.g.clip();var b=Object.entries(d.P),c=60*Math.max(0,b.length-2);this.selection>c/20&&(this.selection=Math.round(c/20));Q.g.translate(0,20*-this.selection);b.map((e,f)=>{f=60*f+15;let h=e[0];e=e[1];R(Q,K[h],3,f);var k=Math.round(Math.min(10,10*(d.M[h]||0)));P(Q,`${h}`,10,12,f,"#FFFFFF88");P(Q,`Demand:  ${"\u25ae".repeat(k)}${"\u25af".repeat(10-
k)}`,10,2,f+12,"#FFFFFF88");k=this.g.l[h]||0;P(Q,`Sales:  ${e} x ${k}$ = ${e*k}$`,10,2,f+24,"#FFFFFF88");P(Q,`Spoiled:  ${this.g.T[h]?this.i[h]:"does not spoil"}`,10,2,f+36,"#FFFFFF88")});Q.g.restore();1>this.h&&(this.h=Math.min(1,this.h+a/1E3),T(this.h));if(2<b.length){let {width:e,height:f}=S(150,32,"#FFFFFF88","\u25b2");S(150,92,"#FFFFFF88","\u25bc");c=60-f;a=Math.floor(2*c/b.length);b=Math.round((c-a)*this.selection/b.length);Q.g.fillStyle="white";Q.g.fillRect(150-e/2,32+f+b,e,a)}}I(this,99);
J.u&&!J.g.u&&(0===this.g.o+this.total&&(this.g.delete(),document.dispatchEvent(new Event("restart"))),this.g.B++,y(-2),D(G,new L(this.g)))}}
class ha{constructor(a){this.J=[];this.m={};this.i={};this.time=this.h=0;this.g=a;for(a=20;a--;){let b=.5<Math.random()?1:-1;this.J.push({height:Math.round(10*Math.random()-5),step:Math.round(160*Math.random()*b),speed:(.5*Math.random()+.5)*b})}}L(){g=new AudioContext;w=g.currentTime;w=v=0;u=!0;x(!1);z.map(a=>{if(this.g.j[a]){let b=(this.g.S[a]||0)/(this.g.l[a]||1),c=this.g.M[a]||0;this.m[a]=b*c*Math.max(.2,(this.g.A[a]||0)/100)*20/1E4;this.i[a]=0;console.log(b,c)}})}K(a=0){ma();na();oa();pa(this.g.j,
this.i);qa(this.g,this.i);ra(this.J);sa();ta(this.time);1E4>this.time&&(this.time+=a,Object.entries(this.m).forEach(([b,c])=>{let d=this.i[b]||0;d<(this.g.j[b]||0)&&(this.i[b]=d+c*a)}));1E4<this.time?0<this.h?this.h=Math.max(0,this.h-a/1E3):(ba(this.g,this.m,this.i),D(G,new la(this.g))):1>this.h&&(this.h=Math.min(1,this.h+a/1E3));T(this.h)}}function M(a){var b=Q;let c=["#4621ac","#631909","#17812e","#1155bb"];b.g.fillStyle=c[a%c.length];b.g.fillRect(0,0,160,144)}
function O(a,b,c=-1){var d=Q;d.g.fillStyle="#00000088";d.g.fillRect(0,0,160,12);P(d,`Week ${b.B} - ${a}`,10,1,1,"#c3472c");a=b.o;P(d,`${1E3>a?a:1E6>a?`${Math.round(a/100)/10}k`:`${Math.round(a/1E6)/10}M`}$`,10,160,1,"#17812e","right");-1!=c&&P(d,`+ ${c}$`,10,160,13,"#17812e","right")}
function P(a,b,c,d,e,f="white",h="left",k=70){var m=`${c}px sans`;U(a);a.h.font=m;a.h.textBaseline="middle";a.h.textAlign=h;h="center"==h?125:"right"==h?250:0;a.h.fillText(b,h,c/2);b=a.h.getImageData(0,0,250,32);for(c=0;250>c;c++)for(m=0;32>m;m++)if(b.data[4*(250*m+c)+1]>k||b.data[4*(250*m+c)+2]>k||b.data[4*(250*m+c)+3]>k)a.g.fillStyle=f,a.h.fillRect(c,m,1,1),a.g.fillRect(c+d-h,m+e,1,1)}
function R(a,b,c,d){let e=[];[...b.data].map(f=>{f=f.charCodeAt(0);e.push(f&7);e.push(f>>3&7)});for(let f=0;f<b.size;f++)for(let h=0;h<b.size;h++)if(e[f*b.size+h]){let k=3*(e[f*b.size+h]-1);a.g.fillStyle="#"+"533c422c415bea0ddd642".substring(k,k+3);a.g.fillRect(c+h,d+f,1,1)}}function S(a,b,c,d,e=!1){var f=Q;e=e?1:0;f.g.strokeStyle=c;f.g.fillStyle=c;c=10*d.length;f.g.translate(e,e);f.g.fillRect(a-c/2,b,c,13);P(f,d,10,a,b+2,"#322722","center");f.g.translate(-e,-e);return{width:c,height:13}}
function T(a){var b=Q;let c=4;for(;c--;){let d=4;for(;d--;){let e=Math.round(-(Math.cos(Math.PI*a)-1)/2*(160+32*d)),f=36*d;b.g.fillStyle="#c3472c";b.g.fillRect(20*c-e,f,17,36);b.g.fillRect(160-20*(c+1)+e,f,17,36);b.g.fillStyle="#631909";b.g.fillRect(160-20*(c+1)+17+e,f,3,36);b.g.fillRect(20*c-e+17,f,3,36)}}}
function ma(){var a=Q;for(let e=0;10>=e;e++)for(let f=0;6>=f;f++){var b=a,c=26*f-(e%2?18:5),d=16*e-5;b.g.fillStyle="#322722";b.g.fillRect(c,d,26,16);b.g.fillStyle="#7d736e";b.g.fillRect(c+1,d+1,25,15)}a.g.fillStyle="#40312a";a.g.fillRect(0,90,160,54)}
function na(){var a=Q;a.g.fillStyle=V(a,30,0,38,0);a.g.fillRect(30,23,8,85);a.g.fillStyle=V(a,122,0,130,0);a.g.fillRect(122,23,8,85);a.g.fillStyle=V(a,0,23,0,27);a.g.fillRect(18,23,124,4);for(let b=0;7>b;b++)a.g.beginPath(),a.g.fillStyle=b%2?"#b77e62":"#631909",W(a,32+16*b,32,8),a.g.fill(),a.g.beginPath(),a.g.fillStyle=b%2?"#f7cebd":"#c3472c",W(a,32+16*b,30,8),a.g.rect(24+16*b,22,16,8),a.g.fill()}
function oa(){var a=Q;for(let b=0;3>b;b++)a.g.fillStyle="#6d412e",a.g.fillRect(35+30*b,76,30,36),a.g.fillStyle="#b77e62",a.g.fillRect(30*b+36,100,28,3),a.g.fillRect(30*b+36,104,28,3),a.g.fillRect(30*b+36,108,28,3),a.g.fillStyle="#322722",a.g.fillRect(30*b+36,77,28,22)}
function pa(a,b){var c=Q;let d=Object.entries(a).filter(([,e])=>!!e);d.forEach(([e,f],h)=>{f=Math.ceil(f-b[e]);e=K[e];let k=Math.floor(27/e.padding);h=3===d.length?h:1===d.length?1:2*h;let m=Math.min(f,k*Math.ceil(25/e.padding));for(let r=0;r<f;r++){let N=Math.floor(r/m);R(c,e,37+r%k*e.padding+30*h+N%2*e.padding*.5,90-Math.floor(r%m/k)*(e.padding-1)-e.y-N*e.padding);r&&0==r%m&&(c.g.fillStyle="#b77e62",c.g.fillRect(37+30*h+r%2*2,74-N*e.size,23,23))}})}
function qa(a,b){var c=Q;b=Object.entries(b).reduce((d,[e,f])=>d+(a.l[e]||0)*Math.floor(f),0);c.g.fillStyle="#f7cebd";c.g.fillRect(3,3,50,12);c.g.fillRect(107,3,50,12);P(c,`Week ${a.B}`,10,5,5,"#322722");P(c,`${a.o+b}$`,10,155,5,"#322722","right")}
function ra(a){var b=Q;b.g.beginPath();b.g.fillStyle="#00000055";a.forEach(c=>{let d=120+c.height+Math.round(Math.sin(c.step/2)),e=Math.round(c.step);W(b,e+17,d,10,.7);W(b,e,d+20,15,.7);c.step+=c.speed;-40>c.step?c.step=200:200<c.step&&(c.step=-40)});b.g.fill()}function sa(){var a=Q;let b=performance.now()-a.time;a.time=performance.now();a.i=.99*a.i+1E3/b*.01;a.g.fillText(`${Math.round(a.i)}FPS`,10,134)}
function ta(a){var b=Q;b.g.beginPath();b.g.fillStyle="#f7cebd";W(b,80,8,7);b.g.fill();a=2*Math.PI*a/1E4-Math.PI/2;ua(b,80+6*Math.cos(a),8+6*Math.sin(a))}function U(a){a.h.clearRect(0,0,a.h.canvas.width,a.h.canvas.height)}function ua(a,b,c){let d=80,e=8;b=Math.round(b);c=Math.round(c);b-=80;c-=8;let f=Math.max(Math.abs(b),Math.abs(c));b/=f;c/=f;let h=[];for(a.g.fillStyle="#322722";f--;)h.push([d,e]),d+=b,e+=c;a.g.beginPath();h.map(([k,m])=>{a.g.rect(Math.round(k),Math.round(m),1,1)});a.g.fill()}
function W(a,b,c,d,e=0){let f=d,h=0,k=0;for(a.g.rect(b-f,c,d<<1,1);f>h;)k-=--f-++h,0>k&&(k+=f++),d=Math.round(e*f),a.g.rect(b-h+d,c-f,h<<1,1),a.g.rect(b-h-d,c+f,h<<1,1),d=Math.round(e*h),a.g.rect(b-f+d,c-h,f<<1,1),a.g.rect(b-f-d,c+h,f<<1,1)}function V(a,b,c,d,e){var f=[[.25,"#6d412e"],[.75,"#b77e62"],[1,"#6d412e"]];let h=a.g.createLinearGradient(b,c,d,e);f.forEach(([k,m],r)=>{0!=r&&h.addColorStop(f[r-1][0],m);h.addColorStop(k,m)});return h}
class va{constructor(){this.i=60;this.time=0;this.g=c2d.getContext("2d");this.h=font.getContext("2d",{V:!0});this.g.canvas.height=144;this.g.canvas.width=160}}let Q=new va;class wa{constructor(a){this.g=new ca;if(!a){a=this.g;let f=localStorage.getItem("market_street_tycoon_history");if(f){var {history:b,s:c,o:d,j:e}=JSON.parse(f);a.history=b;a.s=c;a.o=d;a.j=e;a.B=b.length}}G=new E(new L(this.g),...[])}L(){document.addEventListener("restart",()=>{D(F,X)})}K(a){G.g.K(a)}}
function xa(a){["\ud835\udd44\ud835\udd52\ud835\udd63\ud835\udd5c\ud835\udd56\ud835\udd65","\ud835\udd4a\ud835\udd65\ud835\udd63\ud835\udd56\ud835\udd56\ud835\udd65","\ud835\udd4b\ud835\udd6a\ud835\udd54\ud835\udd60\ud835\udd60\ud835\udd5f"].map((c,d)=>{P(Q,c,20,80,8+16*d,"#ea0","center",100)});let b=["New Game","Continue","FullScreen","Help","About"];localStorage.getItem("market_street_tycoon_history")||b.splice(1,1);b.map((c,d)=>{P(Q,`${a.selection==d?"\u25b8":" "} ${c}`,10,10,70+13*d,a.selection==
d?"white":"#FFFFFF88")})}function Y(a,b=9){a.map((c,d)=>{P(Q,c,b,10,12+12*d,"#f7cebd","left",100)})}
class ya{constructor(){this.selection=0;this.h=this.g=!1}K(){M(1);this.h?(Y("Game made by lopis;for js13k 2023;;github.com/lopis;js13kgames.com;;\u2665".split(";"),13),S(80,129,"#ffeae0","return")):this.g?(Q.g.save(),Q.g.rect(0,12,160,114),Q.g.clip(),Q.g.translate(0,6*-this.selection),Y("You're a merchant in the;village market, trying to;succed. Buy goods from the;region and resell them for;the best price, depending;on customer demand.;Your reputation increases;the more you sell each item;and unlocks new suppliers.;;Use the arrow keys and Enter; to control the game.".split(";")),Q.g.restore(),
S(80,129,"#ffeae0","return")):xa(this);I(this,this.h||this.g?100:4);J.u&&!J.g.u&&(this.h||this.g?(this.selection=0,this.g=this.h=!1):1>=this.selection?D(F,new wa(0===this.selection)):2==this.selection?document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen():3==this.selection?(this.selection=0,this.g=!0):(this.selection=0,this.h=!0))}}let X=new ya;document.querySelector('link[type="image/x-icon"]').href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E\ud83c\udf4e%3C/text%3E%3C/svg%3E";
F=new E(X,...[]);let Z=0,za=1E3/60;
(function Aa(a){let c=a-Z;if(c>=za){Z=a;a=J;a.g.I=a.I;a.g.C=a.C;a.g.D=a.D;a.g.H=a.H;a.g.u=a.u;a.g.N=a.N;let d=navigator.getGamepads&&navigator.getGamepads()[0],e=a.h.get("KeyA")||a.h.get("ArrowLeft")||"left"===a.m||d?.buttons[14].pressed?-1:0,f=a.h.get("KeyD")||a.h.get("ArrowRight")||"right"===a.m||d?.buttons[15].pressed?1:0,h=a.h.get("KeyW")||a.h.get("ArrowUp")||"up"===a.m||d?.buttons[12].pressed?-1:0,k=a.h.get("KeyS")||a.h.get("ArrowDown")||"down"===a.m||d?.buttons[13].pressed?1:0;a.i.x=e+f||d?.axes[0]||
0;a.i.y=h+k||d?.axes[1]||0;.1>Math.hypot(a.i.x,a.i.y)&&(a.i.x=0,a.i.y=0);a.I=0>a.i.y;a.C=0<a.i.y;a.D=0>a.i.x;a.H=0<a.i.x;a.u=!!(a.h.get("Enter")||"ok"===a.m||d?.buttons[0].pressed||d?.buttons[9].pressed);a.N=!(!a.h.get("Escape")&&!d?.buttons[8].pressed);a=Q;U(a);a.g.clearRect(0,0,160,144);F.g.K(c)}requestAnimationFrame(Aa)})(0);