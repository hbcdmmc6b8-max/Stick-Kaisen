(()=>{"use strict";
const c=document.getElementById("c"),x=c.getContext("2d"),techBtn=document.getElementById("techBtn");
let W=0,H=0,last=0,shake=0,time=0;
const key={left:false,right:false,block:false};
const p={x:220,y:0,vx:0,vy:0,face:1,hp:100,ce:100,aw:0,on:true,attack:0,combo:0,comboT:0,dash:0,block:false,awakened:false,awFlash:0,land:0};
const e={x:700,y:0,vx:0,vy:0,hp:100,on:true,hit:0};
const fx=[];
function ground(){return H*.78}
function resize(){const r=c.getBoundingClientRect();W=c.width=Math.max(1,r.width*devicePixelRatio);H=c.height=Math.max(1,r.height*devicePixelRatio);x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);W=r.width;H=r.height;p.x=Math.min(p.x,W*.42);e.x=Math.max(W*.62,Math.min(e.x,W-55));p.y=e.y=ground()}
addEventListener("resize",resize);resize();
function particle(px,py,vx,vy,l=.3,type="ce"){fx.push({x:px,y:py,vx,vy,l,max:l,type})}
function burst(px,py,n=14,type="ce"){for(let i=0;i<n;i++){let a=Math.random()*6.28,s=60+Math.random()*260;particle(px,py,Math.cos(a)*s,Math.sin(a)*s,.2+Math.random()*.25,type)}}
function flash(){const f=document.getElementById("impact");f.classList.remove("flash");void f.offsetWidth;f.classList.add("flash")}
function hitEnemy(dmg,pow){if(Math.abs(p.x-e.x)<112&&Math.abs(p.y-e.y)<90&&e.hit<=0){e.hp=Math.max(0,e.hp-dmg);e.vx=p.face*pow;e.vy=-pow*.22;e.hit=.22;p.aw=Math.min(100,p.aw+dmg*1.7);shake=dmg>12?12:7;burst(e.x,e.y-55,dmg>12?24:12,dmg>12?"slash":"hit");flash()}}
function attack(){if(p.attack>0||p.block)return;p.combo=p.comboT>0?(p.combo%4)+1:1;p.comboT=.48;p.attack=.24;setTimeout(()=>hitEnemy(p.combo===4?14:7,p.combo===4?520:270),75)}
function awaken(){if(p.aw<100||p.awakened)return;p.awakened=true;p.awFlash=.75;shake=15;burst(p.x,p.y-55,42,"aw");flash()}
function tech(){if(!p.awakened){if(p.aw>=100)awaken();return}if(p.ce<25||p.attack>0||p.block)return;p.ce-=25;p.attack=.48;setTimeout(()=>{if(Math.abs(p.x-e.x)<235){hitEnemy(18,620);for(let i=0;i<26;i++)particle(p.x+p.face*(55+Math.random()*165),p.y-35-Math.random()*95,p.face*(170+Math.random()*350),(Math.random()-.5)*260,.4,"slash")}},145)}
function jump(){if(p.on&&!p.block){p.vy=-620;p.on=false;p.land=0}}
function dash(){if(p.dash<=0&&!p.block){p.vx=p.face*760;p.dash=.62;burst(p.x-p.face*12,p.y-25,10,"dust")}}
function action(a){if(a==="jump")jump();if(a==="attack")attack();if(a==="tech")tech();if(a==="dash")dash();if(a==="block")p.block=true}
document.querySelectorAll("[data-hold]").forEach(b=>{const k=b.dataset.hold;b.onpointerdown=q=>{q.preventDefault();key[k]=true};b.onpointerup=b.onpointercancel=()=>key[k]=false});
document.querySelectorAll("[data-action]").forEach(b=>{b.onpointerdown=q=>{q.preventDefault();action(b.dataset.action)};b.onpointerup=b.onpointercancel=()=>{if(b.dataset.action==="block")p.block=false}});
addEventListener("keydown",q=>{if(q.repeat)return;if(q.key==="a"||q.key==="ArrowLeft")key.left=true;if(q.key==="d"||q.key==="ArrowRight")key.right=true;if(q.key==="w"||q.key==="ArrowUp")jump();if(q.key==="j")attack();if(q.key==="k")tech();if(q.key==="Shift")dash();if(q.key==="l")p.block=true});
addEventListener("keyup",q=>{if(q.key==="a"||q.key==="ArrowLeft")key.left=false;if(q.key==="d"||q.key==="ArrowRight")key.right=false;if(q.key==="l")p.block=false});
function physics(o,dt){const was=o.on;o.vy+=1500*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.vx*=Math.pow(.0015,dt);if(o.y>=ground()){o.y=ground();o.vy=0;o.on=true;if(!was&&o===p){p.land=.16;burst(p.x,p.y,5,"dust")}}o.x=Math.max(45,Math.min(W-45,o.x))}
function limb(ax,ay,bx,by,cx,cy,w=7){x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.lineTo(cx,cy);x.strokeStyle="#101114";x.lineWidth=w;x.stroke()}
function vessel(o){const dir=o.face,run=Math.min(1,Math.abs(o.vx)/250),phase=time*13,step=Math.sin(phase)*run;
 let bodyX=0,bodyY=-55,headY=-84,la=[-dir*15,-43,-dir*25,-27],ra=[dir*15,-43,dir*27,-28],ll=[-12,-18,-18,0],rl=[12,-18,20,0];
 if(run>.1&&o.on){bodyX=dir*5;ll=[-dir*step*13,-17,dir*step*23,0];rl=[dir*step*13,-17,-dir*step*23,0];la=[-dir*15,-45,dir*step*18,-28];ra=[dir*15,-45,-dir*step*18,-28]}
 if(!o.on){bodyY=-58;headY=-88;ll=[-13,-22,-25,-5];rl=[13,-22,28,-10];la=[-dir*14,-48,-dir*28,-33];ra=[dir*14,-48,dir*30,-38]}
 if(o.land>0){bodyY=-48;headY=-77;ll=[-15,-16,-29,0];rl=[15,-16,29,0]}
 if(o.block){bodyX=-dir*3;la=[-dir*8,-48,dir*16,-67];ra=[dir*8,-48,dir*25,-55]}
 if(o.dash>.38){bodyX=dir*14;headY=-79;la=[-dir*8,-48,-dir*34,-30];ra=[dir*8,-48,-dir*24,-24];ll=[-10,-18,-dir*24,0];rl=[10,-18,dir*28,0]}
 if(o.attack>0){const n=o.combo||1,t=1-o.attack/.24;if(n===1){ra=[dir*13,-46,dir*52,-43]}else if(n===2){la=[-dir*12,-46,dir*50,-55]}else if(n===3){ra=[dir*12,-45,dir*42,-24]}else{ra=[dir*12,-47,dir*58,-62];ll=[-10,-18,-dir*18,0];rl=[10,-18,dir*35,-10]}}
 x.save();x.translate(o.x,o.y);x.lineCap="round";x.lineJoin="round";
 if(o.awakened){x.strokeStyle="#7a58ff";x.globalAlpha=.22+.08*Math.sin(time*8);x.lineWidth=3;x.beginPath();x.arc(0,-52,44+Math.sin(time*5)*4,0,6.28);x.stroke();x.globalAlpha=1}
 // red hood/collar
 x.strokeStyle="#a7192d";x.lineWidth=9;x.beginPath();x.moveTo(-13+bodyX,bodyY-5);x.lineTo(0+bodyX,bodyY+5);x.lineTo(14+bodyX,bodyY-5);x.stroke();
 // torso
 x.strokeStyle="#101114";x.lineWidth=9;x.beginPath();x.moveTo(bodyX,bodyY);x.lineTo(bodyX,-20);x.stroke();
 limb(bodyX,-49,la[0]+bodyX,la[1],la[2]+bodyX,la[3]);limb(bodyX,-49,ra[0]+bodyX,ra[1],ra[2]+bodyX,ra[3]);limb(bodyX,-20,ll[0]+bodyX,ll[1],ll[2]+bodyX,ll[3]);limb(bodyX,-20,rl[0]+bodyX,rl[1],rl[2]+bodyX,rl[3]);
 // head
 x.fillStyle="#e7c5b4";x.beginPath();x.arc(bodyX,headY,18,0,6.28);x.fill();x.strokeStyle="#101114";x.lineWidth=3;x.stroke();
 // pink spiky hair
 x.fillStyle="#d9829b";x.strokeStyle="#151519";x.lineWidth=2;x.beginPath();x.moveTo(bodyX-17,headY-6);x.lineTo(bodyX-24,headY-22);x.lineTo(bodyX-11,headY-18);x.lineTo(bodyX-8,headY-31);x.lineTo(bodyX+1,headY-20);x.lineTo(bodyX+9,headY-31);x.lineTo(bodyX+12,headY-17);x.lineTo(bodyX+25,headY-20);x.lineTo(bodyX+17,headY-5);x.quadraticCurveTo(bodyX,headY-13,bodyX-17,headY-6);x.fill();x.stroke();
 // face
 x.fillStyle="#111";x.fillRect(bodyX+dir*4,headY-2,3,2);
 if(o.block){x.strokeStyle="#fff";x.globalAlpha=.32;x.lineWidth=2;x.beginPath();x.arc(dir*24,-48,31,-1.1,1.1);x.stroke();x.globalAlpha=1}
 x.restore()}
function dummy(o){x.save();x.translate(o.x,o.y);x.lineCap="round";x.strokeStyle=o.hit>0?"#555":"#171717";x.lineWidth=7;const recoil=o.hit>0?Math.sin(o.hit*25)*12:0;x.rotate(recoil*.01);x.beginPath();x.arc(0,-82,18,0,6.28);x.moveTo(0,-64);x.lineTo(recoil,-20);x.moveTo(recoil,-20);x.lineTo(-19,0);x.moveTo(recoil,-20);x.lineTo(22,0);x.moveTo(0,-54);x.lineTo(-24,-34);x.moveTo(0,-54);x.lineTo(24,-34);x.stroke();x.restore()}
function drawStage(){let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#d8dadd");g.addColorStop(.56,"#b9bcc0");g.addColorStop(.57,"#85898e");g.addColorStop(1,"#65696e");x.fillStyle=g;x.fillRect(0,0,W,H);x.strokeStyle="#a9acb0";x.lineWidth=1;for(let i=0;i<W;i+=80){x.beginPath();x.moveTo(i,0);x.lineTo(i,H*.56);x.stroke()}x.strokeStyle="#5d6166";for(let y=H*.62;y<H;y+=45){x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}x.fillStyle="#4d5054";x.fillRect(0,ground()+2,W,3)}
function update(dt){time+=dt;const move=(key.right?1:0)-(key.left?1:0);if(move&&!p.block&&p.attack<=0){p.face=move;p.vx+=move*1800*dt}p.vx=Math.max(-340,Math.min(340,p.vx));p.block=key.block||p.block;p.attack=Math.max(0,p.attack-dt);p.comboT=Math.max(0,p.comboT-dt);p.dash=Math.max(0,p.dash-dt);p.land=Math.max(0,p.land-dt);p.awFlash=Math.max(0,p.awFlash-dt);e.hit=Math.max(0,e.hit-dt);p.ce=Math.min(100,p.ce+(p.awakened?6:9)*dt);physics(p,dt);physics(e,dt);
 for(let i=fx.length-1;i>=0;i--){let f=fx[i];f.l-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.94;f.vy+=f.type==="dust"?100:360*dt;if(f.l<=0)fx.splice(i,1)}
 document.getElementById("pHP").style.width=p.hp+"%";document.getElementById("eHP").style.width=e.hp+"%";document.getElementById("ce").style.width=p.ce+"%";document.getElementById("aw").style.width=p.aw+"%";document.getElementById("ceText").textContent=Math.round(p.ce);document.getElementById("awText").textContent=p.awakened?"CT UNLOCKED":Math.round(p.aw)+"%";
 techBtn.className="tech "+(p.awakened?"active":p.aw>=100?"ready":"locked");techBtn.textContent=p.awakened?"CT 1":p.aw>=100?"AWAKEN":"CT LOCKED"}
function draw(){x.save();if(shake>.2){x.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.82}drawStage();for(const f of fx){x.globalAlpha=Math.max(0,f.l/f.max);x.strokeStyle=f.type==="aw"?"#ed2445":f.type==="dust"?"#d7d7d7":f.type==="hit"?"#171717":"#6d46ff";x.lineWidth=f.type==="slash"?4:2;x.beginPath();x.moveTo(f.x,f.y);x.lineTo(f.x-f.vx*.035,f.y-f.vy*.035);x.stroke()}x.globalAlpha=1;vessel(p);dummy(e);x.restore()}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
})();