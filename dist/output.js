document.write('<!doctype html><meta charset=UTF-8><meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0" name=viewport><title>Market Street Tycoon</title><style>#c2d{height:100vh;aspect-ratio:160/144;position:absolute;image-rendering:pixelated;background-color:#000}body,html{margin:0;background-color:#111;display:flex;justify-content:center;align-items:center;height:100%;user-select:none}@media (max-width:900px){body{background:#f7cebd}#gamepad{position:fixed;top:0;left:0;height:100vh;width:100vw}b{position:absolute;display:inline-flex;border:2px solid;border-radius:7vmax;height:7vmax;width:7vmax;font-size:3vmax;color:#3f2e28;justify-content:center;align-items:center;font-family:monospace;transition:50ms ease-in-out}b:active{color:#f7cebd;transform:scale(1.2)}#down,#up{left:8vmax;bottom:20vmax}#down{bottom:7vmax}#left,#right{left:1.5vmax;bottom:13.5vmax}#right{left:14.5vmax}#ok{right:8vmax;bottom:13.5vmax}}@media (orientation:portrait){body{align-items:flex-start;padding-top:20vh}#c2d{height:auto;width:100vw}#ok{right:7vmax}}</style><div id=gamepad><b id=up>▲</b><b id=down>▼</b><b id=left>◀</b><b id=right>▶</b><b id=ok>OK</b></div><canvas id=c2d></canvas><canvas id=f height=20 hidden style="border:1px solid" width=250></canvas>');let d={apples:{data:"@X@@C@RSERRBWRGx\u007f@",size:6,padding:6,y:0},bread:{data:"hmmEmoomm}}momm}hmmExmmGx\u007f\u007fG@@@@",size:8,padding:9,y:-1},oil:{data:"@mm@@m@@XC@[[[X[[C_[{x\u007f\u007fG",size:7,padding:9,y:-1}};function l(a){a.h.clearRect(0,0,a.h.canvas.width,a.h.canvas.height)}
function n(a,b,c,e,h="white",g="left"){l(a);a.h.font="10px sans";a.h.textBaseline="middle";a.h.textAlign=g;g="center"==g?125:"right"==g?250:0;a.h.fillText(b,g,5);b=a.h.getImageData(0,0,250,32);for(let k=0;250>k;k++)for(let m=0;32>m;m++)if(80<b.data[4*(250*m+k)+1]||80<b.data[4*(250*m+k)+2]||80<b.data[4*(250*m+k)+3])a.g.fillStyle=h,a.h.fillRect(k,m,1,1),a.g.fillRect(k+c-g,m+e,1,1)}function p(){var a=q;a.g.fillStyle="#00000099";a.g.fillRect(0,0,160,144)}
function r(a,b,c,e,h=0){let g=e,k=0,m=0;for(a.g.rect(b-g,c,e<<1,1);g>k;)m-=--g-++k,0>m&&(m+=g++),e=Math.round(h*g),a.g.rect(b-k+e,c-g,k<<1,1),a.g.rect(b-k-e,c+g,k<<1,1),e=Math.round(h*k),a.g.rect(b-g+e,c-k,g<<1,1),a.g.rect(b-g-e,c+k,g<<1,1)}function t(){var a=q;for(let h=0;10>=h;h++)for(let g=0;6>=g;g++){var b=a,c=26*g-(h%2?18:5),e=16*h-5;b.g.strokeStyle="#3f2e28";b.g.fillStyle="#7d736e";b.g.fillRect(c,e,26,16);b.g.strokeRect(c+1,e+1,25,15)}a.g.fillStyle="#40312a";a.g.fillRect(0,90,160,54)}
function u(a,b,c,e,h){var g=[[.25,"#6d412e"],[.75,"#b77e62"],[1,"#6d412e"]];let k=a.g.createLinearGradient(b,c,e,h);g.forEach(([m,E],F)=>{0!=F&&k.addColorStop(g[F-1][0],E);k.addColorStop(m,E)});return k}
function v(){var a=q;a.g.fillStyle=u(a,30,0,38,0);a.g.fillRect(30,23,8,85);a.g.fillStyle=u(a,122,0,130,0);a.g.fillRect(122,23,8,85);a.g.fillStyle=u(a,0,23,0,27);a.g.fillRect(18,23,124,4);for(let b=0;7>b;b++)a.g.beginPath(),a.g.fillStyle=b%2?"#b77e62":"#752a1a",r(a,32+16*b,32,8),a.g.fill(),a.g.beginPath(),a.g.fillStyle=b%2?"#f7cebd":"#c3472c",r(a,32+16*b,30,8),a.g.rect(24+16*b,22,16,8),a.g.fill()}
function w(){var a=q;for(let b=0;3>b;b++)a.g.fillStyle="#6d412e",a.g.fillRect(35+30*b,76,30,36),a.g.fillStyle="#b77e62",a.g.fillRect(30*b+36,100,28,3),a.g.fillRect(30*b+36,104,28,3),a.g.fillRect(30*b+36,108,28,3),a.g.fillStyle="#3f2e28",a.g.fillRect(30*b+36,77,28,22)}function x(a,b,c,e){var h=q;h.g.strokeStyle=c;h.g.fillStyle=c;let g=10*e.length;h.g.strokeRect(a-g/2,b,g,13);n(h,e,a,b+2,c,"center")}
function y(a,b,c){var e=q;let h=[];a.data.replace(/./g,g=>{g=g.charCodeAt();h.push(g&7);h.push(g>>3&7)});for(let g=0;g<a.size;g++)for(let k=0;k<a.size;k++)if(h[g*a.size+k]){let m=3*(h[g*a.size+k]-1);e.g.fillStyle="#"+"000c422a615bea0ddd642".substring(m,m+3);e.g.fillRect(b+k,c+g,1,1)}}function z(a){var b=q;b.g.fillStyle="#f7cebd";b.g.fillRect(3,3,50,12);b.g.fillRect(107,3,50,12);n(b,`Week ${a.J}`,5,5,"#3f2e28");n(b,`${a.v}$`,155,5,"#3f2e28","right")}
function A(a){var b=q;b.g.beginPath();b.g.fillStyle="#00000055";a.forEach(c=>{let e=120+c.height+Math.round(Math.sin(c.step/2)),h=Math.round(c.step);r(b,h+17,e,10,.7);r(b,h,e+20,15,.7);c.step+=c.speed;-40>c.step?c.step=200:200<c.step&&(c.step=-40)});b.g.fill()}function B(){var a=q;let b=performance.now()-a.time;a.time=performance.now();a.j=.99*a.j+1E3/b*.01;a.g.fillText(`${Math.round(a.j)}FPS`,10,134)}
class C{constructor(){this.j=60;this.time=0;this.g=c2d.getContext("2d");c2d.addEventListener("click",()=>{alert(`Use the ${900<screen.width?"arrow keys and Enter":"game pad below"} to control the game.`)},{once:!0});this.h=f.getContext("2d");this.g.canvas.height=144;this.g.canvas.width=160}}let q=new C;function D(a,b){var c=[];a.g.M?.();a.g=b;a.g.K?.(...c)}class G{constructor(a,...b){this.g=a;this.g.K?.(...b)}}let H,I;function J(a,b,c){b=b.targetTouches[0]?.target?.id;c?b&&(a.C=b):a.C=""}
class K{constructor(){this.I=this.m=this.B=this.A=this.o=this.s=!1;this.h=new Map;this.C="";this.g={s:this.s,o:this.o,A:this.A,B:this.B,m:this.m,I:this.I};document.addEventListener("keydown",a=>{this.h.set(a.code,!0)});document.addEventListener("keyup",a=>{this.h.set(a.code,!1)});this.j=new DOMPoint;document.addEventListener("touchstart",a=>J(this,a,!0));document.addEventListener("touchend",a=>J(this,a,!1))}}
let L=new K,M=["apples","bread","oil"],N="Catarina Leonor Bento Marcos Apar\u00edcia Isabel Manuel Gra\u00e7a Teresa Vicente Jacinta Jo\u00e3o Diogo Luciana Sim\u00e3o Gil".split(" "),O=()=>{let a=N.pop();N.unshift(a);return a};class P{constructor(){this.u=[];this.i={};this.l={};this.J=1;M.forEach(b=>{this.i[b]=30;this.l[b]=5});this.v=20;var a={H:"apples",L:O(),l:10,i:10};this.u.push(a);a={H:"apples",L:O(),l:20,i:24};this.u.push(a)}}let Q,R,S=[],T={E:-5,F:-4,G:-2,a:0,b:2,c:3,d:5,e:7,"-":-999};
"GddGddGccGccGeeGeeFddFddEaaGddGddaddGddaddGdbG--".split("").forEach(a=>{S.push(-T[a])});
let U=0,V=0,W=()=>{if(V+.3*U<Q.currentTime){var a=S[U],b=V+.3*U;let h=Q.createOscillator();var c=Q.createGain(),e=Q.createBiquadFilter();e.type="bandpass";e.frequency.setValueAtTime(800,b);h.type="square";h.connect(c);c.connect(e).connect(Q.destination);c.gain.setValueAtTime(.01,b);e=.8;c.gain.linearRampToValueAtTime(.3,b+.3*e);c.gain.setValueAtTime(.3,b+.3*e);c.gain.setValueAtTime(.3,b+.3*(1.5-e));c.gain.linearRampToValueAtTime(.01,b+.3*1.5);h.frequency.setValueAtTime(440/1.06**a,b);e=R=Q.createBufferSource();
a=.3*Q.sampleRate;c=Q.createBuffer(1,a,Q.sampleRate);let g=c.getChannelData(0);for(let k=0;k<a;k++)g[k]=2*Math.random()-1;e.buffer=c;a=Q.createBiquadFilter();a.type="bandpass";a.frequency.setValueAtTime(500,b);c=Q.createGain();c.gain.setValueAtTime(.01,b);e=.47;c.gain.exponentialRampToValueAtTime(.3,b+.3*e);c.gain.setValueAtTime(.3,b+.3*(.9-e));c.gain.exponentialRampToValueAtTime(.01,b+.3);R.connect(a).connect(c).connect(Q.destination);R.start();h.start(b);h.stop(b+.3*1.5);U++;U==S.length&&(V=Q.currentTime+
.3,U=0)}setTimeout(W,10)};
class X{constructor(a){this.h=[];this.g=a;for(a=20;a--;){let b=.5<Math.random()?1:-1;this.h.push({height:Math.round(10*Math.random()-5),step:Math.round(160*Math.random()*b),speed:(.5*Math.random()+.5)*b})}}K(){Q=new AudioContext;V=Q.currentTime;W()}D(){t();v();w();Object.entries(this.g.i).forEach(([a,b],c)=>{a=d[a];let e=Math.floor(27/a.padding);b=Math.min(b,e*Math.ceil(25/a.padding));for(let h=0;h<b;h++)y(a,37+h%e*a.padding+30*c+(7>a.padding?Math.floor(h/e)%2*a.padding/2:0),73+Math.floor(h/e)*(a.padding-
1)-a.y)});z(this.g);A(this.h);B()}}function aa(a){L.s&&!L.g.s&&0<a.selection&&a.selection--;L.o&&!L.g.o&&a.selection<a.g.u.length&&a.selection++;var b=L.A&&!L.g.A,c=L.B&&!L.g.B;(b||c)&&a.selection<Object.keys(a.g.i).length&&(c=Object.entries(a.g.i)[a.selection])&&void 0!=a.g.l[c[0]]&&(a.g.l[c[0]]=Math.max(0,a.g.l[c[0]]+(b?-1:1)));L.m&&!L.g.m&&((b=a.g.u[a.selection])&&0<b.i&&b.l<=a.g.v&&(a.g.v-=b.l,a.g.i[b.H]+=b.i,b.i=0),a.selection==a.g.u.length&&D(I,new X(a.g)))}
class ba{constructor(a){this.selection=0;this.g=a}D(){t();p();n(q,`Week ${this.g.J} - Manage Stock`,1,1,"indianred");n(q,`${this.g.v}$`,160,1,"green","right");M.forEach((a,b)=>{let c=24*b+24,e=this.g.i[a];e&&(n(q,a,1,1+c,"gray"),n(q,`${e}`,1,c+11,"gray"),["-","+"].map((h,g)=>x(100+53*g,c+5,this.selection===b?"white":"gray",h)),n(q,`${this.g.l[a]}$`,127,c+7,"gray","center"))});x(80,129,this.selection===this.g.u.length?"white":"gray","next");aa(this)}}
function ca(a){L.s&&!L.g.s&&0<a.h&&a.h--;L.o&&!L.g.o&&a.h<a.g.u.length&&a.h++;if(L.m&&!L.g.m){let b=a.g.u[a.h];b&&0<b.i&&b.l<=a.g.v&&(a.g.v-=b.l,a.g.i[b.H]+=b.i,b.i=0);a.h==a.g.u.length&&D(I,new ba(a.g))}}
class da{constructor(a){this.h=0;this.g=a}D(){t();p();n(q,`Week ${this.g.J} - Suppliers`,1,1,"indianred");n(q,`${this.g.v}$`,160,1,"green","right");this.g.u.forEach((a,b)=>{let c=24*b+24;n(q,a.L,1,1+c,"gray");let e=`${a.i} ${a.H}   ${a.l}$`;n(q,a.i?e:"soldout",1,c+11,"gray");x(140,c+5,this.h===b?"white":"gray","BUY")});x(80,129,this.h===this.g.u.length?"white":"gray","next");ca(this)}}class ea{constructor(){this.g=new P;I=new G(new da(this.g),...[])}D(a){I.g.D(a)}}let fa=new ea;
class ha{constructor(){this.g=!0}D(){t();p();n(q,"Market Street Tycoon",10,40);n(q,"Start",10,60,this.g?"white":"gray");n(q,"Toggle Fullscreen",10,70,this.g?"gray":"white");if(L.s&&!L.g.s||L.o&&!L.g.o)this.g=!this.g;L.m&&!L.g.m&&(this.g?D(H,fa):document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen())}}H=new G(new ha,...[]);let Y=0,Z=1E3/60;
(function ia(a){let c=a-Y;if(c>=Z){Y=a-c%Z;L.g.s=L.s;L.g.o=L.o;L.g.A=L.A;L.g.B=L.B;L.g.m=L.m;L.g.I=L.I;a=navigator.getGamepads()[0];let e=L.h.get("KeyA")||L.h.get("ArrowLeft")||"left"===L.C||a?.buttons[14].pressed?-1:0,h=L.h.get("KeyD")||L.h.get("ArrowRight")||"right"===L.C||a?.buttons[15].pressed?1:0,g=L.h.get("KeyW")||L.h.get("ArrowUp")||"up"===L.C||a?.buttons[12].pressed?-1:0,k=L.h.get("KeyS")||L.h.get("ArrowDown")||"down"===L.C||a?.buttons[13].pressed?1:0;L.j.x=e+h||a?.axes[0]||0;L.j.y=g+k||a?.axes[1]||
0;.1>Math.hypot(L.j.x,L.j.y)&&(L.j.x=0,L.j.y=0);L.s=0>L.j.y;L.o=0<L.j.y;L.A=0>L.j.x;L.B=0<L.j.x;L.m=!!(L.h.get("Enter")||"ok"===L.C||a?.buttons[0].pressed||a?.buttons[9].pressed);L.I=!(!L.h.get("Escape")&&!a?.buttons[8].pressed);a=q;l(a);a.g.clearRect(0,0,160,144);H.g.D(c)}requestAnimationFrame(ia)})(0);