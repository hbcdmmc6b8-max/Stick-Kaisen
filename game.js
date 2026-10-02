(()=>{"use strict";
const c=document.getElementById("c"),ctx=c.getContext("2d");
const $=id=>document.getElementById(id);
const ui={tech:$("techBtn"),swap:$("techSwapBtn"),custom:$("customBtn"),evolve:$("evolveBtn"),domain:$("domainBtn"),charName:$("charName"),mode:$("modeLabel"),cinema:$("cinema"),cinemaName:$("cinemaName"),cinemaSub:$("cinemaSub"),toast:$("moveToast"),menu:$("mainMenu"),grid:$("characterGrid"),selectedName:$("selectedName"),selectedTechs:$("selectedTechs"),selectMode:$("selectMode"),sandbox:$("sandboxPanel")};
let W=0,H=0,last=0,time=0,shake=0,toastT=0,charIndex=0,techIndex=0;
let gameState="menu",gameMode="battle",selectedIndex=0,slowMo=1;
let customTech=null;
try{customTech=JSON.parse(localStorage.getItem("stickKaisenCustomTech")||"null")}catch(_){}
const sandbox={hp:true,ce:true,aw:true,slow:false};
const key={left:false,right:false,block:false};
const roster=[
 {id:"vessel",name:"VESSEL",accent:"#d9829b",body:"#111217",skin:"#e7c5b4",domain:"SHRINE OF SEVERANCE",sub:"CUT EVERYTHING IN RANGE",techs:["DISMANTLE","CLEAVE"]},
 {id:"honored",name:"HONORED ONE",accent:"#dff7ff",body:"#111217",skin:"#e7c5b4",domain:"INFINITE HORIZON",sub:"BOUNDLESS INFORMATION",techs:["BLUE","RED","HOLLOW"]},
 {id:"shadow",name:"SHADOW MANIPULATOR",accent:"#242a3a",body:"#151a24",skin:"#e7c5b4",domain:"CHIMERA SHADOW GARDEN",sub:"SHADOWS WITHOUT END",techs:["DIVINE DOGS","NUE","RABBIT ESCAPE"]},
 {id:"judge",name:"DEADLY JUDGE",accent:"#c79b4b",body:"#202025",skin:"#d9b9a4",domain:"DEADLOCK COURT",sub:"VERDICT IS ABSOLUTE",techs:["GAVEL","CONFISCATION"]},
 {id:"gambler",name:"RESTLESS GAMBLER",accent:"#55ff9f",body:"#27262c",skin:"#debca5",domain:"FEVER JACKPOT",sub:"HIT THE ODDS",techs:["DOORS","JACKPOT RUSH"]},
 {id:"switcher",name:"SWITCHER",accent:"#f3d75c",body:"#17181b",skin:"#d2ad96",domain:"RESONANT STAGE",sub:"POSITION HAS NO CERTAINTY",techs:["BOOGIE","FAKE CLAP"]},
 {id:"blood",name:"BLOOD BROTHER",accent:"#b51f38",body:"#3b2b49",skin:"#d7b5a3",domain:"CRIMSON CHAMBER",sub:"BLOOD OBEYS",techs:["PIERCING BLOOD","SUPER NOVA","FLOWING RED"]},
 {id:"killer",name:"SORCERER KILLER",accent:"#8aa0a6",body:"#151718",skin:"#d5b09a",domain:"NO DOMAIN",sub:"HEAVENLY RESTRICTION",techs:["CHAIN","RUSH"]},
 {id:"thunder",name:"THUNDER GOD",accent:"#6be8ff",body:"#24313a",skin:"#d8b49e",domain:"STORM ALTAR",sub:"LIGHTNING ANSWERS",techs:["BOLT","CHARGE"]},
 {id:"shaper",name:"SOUL SHAPER",accent:"#8e7cff",body:"#2b2d35",skin:"#c9b3a6",domain:"SOUL MIRROR",sub:"THE SHAPE WITHIN",techs:["TRANSFIGURE","SOUL BURST"]},
 {id:"copycat",name:"COPYCAT",accent:"#d9d9ff",body:"#f0f0f3",skin:"#d8b59f",domain:"BOUNDLESS ARSENAL",sub:"BORROWED TECHNIQUES",techs:["COPY","RING CALL","BEAM"]},
 {id:"heavenly",name:"HEAVENLY FIGHTER",accent:"#76d7b5",body:"#1b2020",skin:"#d6b099",domain:"ZERO PRESSURE HALL",sub:"PHYSICAL LAW FALLS SILENT",techs:["SPLIT STRIKE","AIR STEP"]},
 {id:"swordsman",name:"SIMPLE SWORDSMAN",accent:"#79a7ff",body:"#20242b",skin:"#d5b39e",domain:"SILENT BLADE COURT",sub:"EVERY STEP ENTERS THE DRAW",techs:["DRAW CUT","EVENING MOON"]},
 {id:"medium",name:"MASKED MEDIUM",accent:"#d3925b",body:"#27252a",skin:"#d7b19b",domain:"AUSPICIOUS BEAST SHRINE",sub:"FOUR BEASTS ANSWER THE CALL",techs:["HORN","DRAGON"]},
 {id:"king",name:"KING OF CURSES",accent:"#ff4c5f",body:"#f1d5cf",skin:"#d4a68e",domain:"RUINED SHRINE",sub:"OPEN BARRIER",techs:["DISMANTLE","CLEAVE","DIVINE FLAME"]},
 {id:"ice",name:"ICE STAR",accent:"#b7efff",body:"#e9edf4",skin:"#d5b5a1",domain:"FROZEN SANCTUM",sub:"ABSOLUTE COLD",techs:["FROST CALM","ICE FALL"]},
 {id:"angel",name:"ANGEL",accent:"#fff0a6",body:"#f2f0e8",skin:"#d9b49e",domain:"HEAVENLY LADDER",sub:"CURSED TECHNIQUES ARE EXTINGUISHED",techs:["TRUMPET LIGHT","JACOB"]},
 {id:"speaker",name:"CURSED SPEAKER",accent:"#b7c1d8",body:"#20242a",skin:"#d6b29d",domain:"COMMAND CHAMBER",sub:"WORDS BECOME ABSOLUTE",techs:["STOP","BLAST AWAY"]},
 {id:"nail",name:"NAIL SORCERER",accent:"#e6a7b6",body:"#202126",skin:"#d9b49f",domain:"RESONANCE WORKSHOP",sub:"THE TARGET ECHOES BACK",techs:["NAIL SHOT","RESONANCE"]},
 {id:"rhythm",name:"RHYTHM DANCER",accent:"#ffbd6b",body:"#ece2d7",skin:"#9b6d52",domain:"BEAT ARENA",sub:"THE RHYTHM CONTROLS THE FIELD",techs:["STEP","PRAYER SONG"]},
 {id:"miguel",name:"MIGUEL",accent:"#e5a96e",body:"#f1ece2",skin:"#8a6045",domain:"ROPE SANCTUARY",sub:"CURSED RHYTHM BINDS THE SPACE",techs:["ROPE SNARE","RHYTHM STEP"]},
 {id:"ken",name:"KEN",accent:"#59657c",body:"#2c3038",skin:"#d2ad98",domain:"WOMB OF CHAOS",sub:"BODY HOPPING SORCERY",techs:["CURSE SWARM","GRAVITY","UZUMAKI"]},
 {id:"takaba",name:"TAKABA",accent:"#ffdd4d",body:"#e8e3d8",skin:"#d5af96",domain:"COMEDY STAGE",sub:"THE JOKE BECOMES REAL",techs:["COMEDIAN","GAG IMPACT","SCENE CHANGE"]},
 {id:"geto",name:"GETO",accent:"#4a4c5b",body:"#202126",skin:"#d3ae99",domain:"NIGHT PARADE VAULT",sub:"COUNTLESS CURSES ANSWER",techs:["CURSE SWARM","SPIRIT BLAST","UZUMAKI"]},
 {id:"larue",name:"LARUE",accent:"#d57ab6",body:"#2b252d",skin:"#9a6950",domain:"HEART CHAPEL",sub:"THE HEART CANNOT ESCAPE",techs:["HEART CATCH","CRUSH"]},
 {id:"sukuna",name:"SUKUNA",accent:"#ff5b68",body:"#251518",skin:"#d5a68e",domain:"RUINED SHRINE",sub:"EVOLUTION I",techs:["DISMANTLE","CLEAVE"],evo:1},
 {id:"meguna",name:"MEGUNA",accent:"#f05a68",body:"#151a24",skin:"#d3ab95",domain:"RUINED SHRINE",sub:"EVOLUTION II",techs:["DISMANTLE","CLEAVE","TEN SHADOWS"],evo:2},
 {id:"heian",name:"HEIAN SUKUNA",accent:"#ff3049",body:"#32171a",skin:"#c9967e",domain:"RUINED SHRINE",sub:"EVOLUTION III",techs:["DISMANTLE","CLEAVE","DIVINE FLAME","WORLD CUT"],evo:3}
];
const p={x:220,y:0,vx:0,vy:0,face:1,hp:100,ce:100,aw:0,on:true,attack:0,attackMax:.32,combo:0,comboT:0,dash:0,dashMax:.46,block:false,blockBlend:0,awakened:false,land:0,techAnim:0,techMax:.78,domainAnim:0,domainActive:0,domainMax:2.15,hitstop:0,animSeed:0};
const e={x:700,y:0,vx:0,vy:0,hp:100,on:true,hit:0};
const fx=[];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const easeOut=t=>1-Math.pow(1-clamp(t),3);
const q30=t=>Math.floor(t*30)/30;
const cur=()=>roster[charIndex];
const sukunaChain=["sukuna","meguna","heian"];
function ground(){return H*.79}
function resize(){const r=c.getBoundingClientRect();W=c.width=Math.max(1,r.width*devicePixelRatio);H=c.height=Math.max(1,r.height*devicePixelRatio);ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);W=r.width;H=r.height;p.x=Math.min(Math.max(70,p.x),W*.44);e.x=Math.max(W*.62,Math.min(e.x,W-60));p.y=e.y=ground()}
addEventListener("resize",resize);resize();

function showScreen(name){
  document.querySelectorAll(".menuCard").forEach(el=>el.classList.toggle("active",el.dataset.screen===name));
}
function openMenu(screen="home"){
  gameState="menu";ui.menu.classList.add("show");document.body.classList.add("menu-open");ui.sandbox.classList.remove("show");showScreen(screen);ui.mode.textContent="MENU";
}
function closeMenu(){
  ui.menu.classList.remove("show");document.body.classList.remove("menu-open");gameState="play";ui.mode.textContent=gameMode==="sandbox"?"SANDBOX":"BATTLE";ui.sandbox.classList.toggle("show",gameMode==="sandbox");
}
function renderCharacterGrid(){
  ui.grid.innerHTML="";
  roster.forEach((f,i)=>{
    const card=document.createElement("button");card.className="charCard"+(i===selectedIndex?" selected":"");card.style.setProperty("--accent",f.accent);
    card.innerHTML="<b>"+f.name+"</b><small>"+f.techs.join(" · ")+"</small>"+(f.evo?"<span class='evoTag'>EVOLUTION "+f.evo+"</span>":"");
    card.onclick=()=>{selectedIndex=i;renderCharacterGrid();syncSelected()};
    ui.grid.appendChild(card);
  });
}
function syncSelected(){
  const f=roster[selectedIndex];ui.selectedName.textContent=f.name;ui.selectedTechs.textContent=f.techs.join(" / ")+(f.domain!=="NO DOMAIN"?" · "+f.domain:"");
}
function resetFight(){
  techIndex=0;p.x=Math.max(90,W*.24);e.x=Math.min(W-90,W*.74);p.y=e.y=ground();p.vx=p.vy=e.vx=e.vy=0;p.hp=e.hp=100;p.ce=100;p.aw=0;p.awakened=false;p.domainActive=0;p.domainAnim=0;p.techAnim=0;p.attack=0;
}
function startSelected(){
  charIndex=selectedIndex;ui.charName.textContent=cur().name;resetFight();closeMenu();
}
document.querySelectorAll("[data-menu]").forEach(b=>b.onclick=()=>{
  const a=b.dataset.menu;
  if(a==="home")showScreen("home");
  if(a==="play"){gameMode="battle";ui.selectMode.textContent="BATTLE";renderCharacterGrid();syncSelected();showScreen("select")}
  if(a==="sandbox"){gameMode="sandbox";ui.selectMode.textContent="SANDBOX";renderCharacterGrid();syncSelected();showScreen("select")}
  if(a==="custom")showScreen("custom");
  if(a==="controls")showScreen("controls");
});
$("startFight").onclick=startSelected;
["ctDamage","ctCost","ctRange"].forEach(id=>{$(id).oninput=()=>$(id+"Out").textContent=$(id).value});
$("saveCustom").onclick=()=>{
  customTech={name:$("ctName").value.trim()||"CUSTOM TECH",effect:$("ctEffect").value,damage:+$("ctDamage").value,cost:+$("ctCost").value,range:+$("ctRange").value,use:$("ctUse").value,color:$("ctColor").value};
  localStorage.setItem("stickKaisenCustomTech",JSON.stringify(customTech));$("customSaved").textContent="Saved: "+customTech.name;
};
if(customTech)$("customSaved").textContent="Saved: "+customTech.name;
$("sbHp").onchange=e=>sandbox.hp=e.target.checked;$("sbCe").onchange=e=>sandbox.ce=e.target.checked;$("sbAw").onchange=e=>sandbox.aw=e.target.checked;$("sbSlow").onchange=e=>{sandbox.slow=e.target.checked;slowMo=sandbox.slow?.35:1};$("sbReset").onclick=resetFight;
renderCharacterGrid();syncSelected();openMenu("home");

function toast(s){ui.toast.textContent=s;ui.toast.classList.add("show");toastT=.8}
function particle(px,py,vx,vy,l=.3,type="ce",size=2,color=null){fx.push({x:px,y:py,vx,vy,l,max:l,type,size,color})}
function burst(px,py,n=14,type="ce",size=2,color=null){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=60+Math.random()*280;particle(px,py,Math.cos(a)*s,Math.sin(a)*s,.18+Math.random()*.35,type,size,color)}}
function techniqueColor(move,id=cur().id){
 const exact={
  BLUE:"#2f8cff",RED:"#ff263f",HOLLOW:"#b98cff","PIERCING BLOOD":"#b5122e","SUPER NOVA":"#e02143","FLOWING RED":"#c21734",
  "FROST CALM":"#baf4ff","ICE FALL":"#78dfff",BOLT:"#65e9ff",CHARGE:"#fff16b","TRUMPET LIGHT":"#fff1a6",JACOB:"#fff7cf",
  "DIVINE FLAME":"#ff5a24","WORLD CUT":"#f5f5ff",DISMANTLE:"#f1f1ff",CLEAVE:"#ffb4bd","TEN SHADOWS":"#111827",
  "DIVINE DOGS":"#111827",NUE:"#78dfff","RABBIT ESCAPE":"#f4f4f4","ROPE SNARE":"#e5a96e","RHYTHM STEP":"#ffbd6b",
  "HEART CATCH":"#ff6fbe",CRUSH:"#d94f9f",COMEDIAN:"#ffe04f","GAG IMPACT":"#ffbd55","SCENE CHANGE":"#7fe0ff",
  UZUMAKI:"#5c4778",GRAVITY:"#4f536d","CURSE SWARM":"#382f47","SPIRIT BLAST":"#5d4e73",RESONANCE:"#e6a7b6",
  "NAIL SHOT":"#bfc3cc",STOP:"#d8dce6","BLAST AWAY":"#a9c2ff","SPLIT STRIKE":"#76d7b5","AIR STEP":"#b8fff0",
  "DRAW CUT":"#79a7ff","EVENING MOON":"#bfd2ff",HORN:"#d3925b",DRAGON:"#ef9f55","STEP":"#ffbd6b","PRAYER SONG":"#ffe6a8",
  COPY:"#d9d9ff","RING CALL":"#c8b9ff",BEAM:"#e5dcff","TRANSFIGURE":"#8e7cff","SOUL BURST":"#b298ff",
  GAVEL:"#c79b4b",CONFISCATION:"#e7c978",DOORS:"#55ff9f","JACKPOT RUSH":"#7dffbc",BOOGIE:"#f3d75c","FAKE CLAP":"#fff2a6",
  CHAIN:"#8aa0a6",RUSH:"#d8e1e5"
 };
 return exact[move]||cur().accent;
}
function flash(){const f=$("impact");f.classList.remove("flash");void f.offsetWidth;f.classList.add("flash")}
function hitEnemy(dmg,pow,range=128){if(Math.abs(p.x-e.x)<range&&Math.abs(p.y-e.y)<100&&e.hit<=0){e.hp=Math.max(0,e.hp-dmg);e.vx=p.face*pow;e.vy=-pow*.2;e.hit=.26;p.aw=Math.min(100,p.aw+dmg*1.55);p.hitstop=dmg>=14?.075:.045;shake=dmg>=14?16:9;burst(e.x,e.y-52,dmg>=14?28:15,dmg>=14?"impact":"hit",dmg>=14?3:2);flash();return true}return false}

function attack(){if(p.attack>0||p.techAnim>0||p.domainAnim>0||p.block)return;p.combo=p.comboT>0?(p.combo%4)+1:1;p.comboT=.54;p.attackMax=p.combo===4?.46:.34;p.attack=p.attackMax;p.animSeed=Math.random();const delay=p.combo===4?170:115;setTimeout(()=>{if(p.attack>0)hitEnemy(p.combo===4?15:7,p.combo===4?560:285)},delay)}
function awaken(){if(p.aw<100||p.awakened)return;p.awakened=true;shake=18;burst(p.x,p.y-55,52,"aw",3);flash();toast("CURSED TECHNIQUE RELEASED")}
function technique(){if(!p.awakened){if(p.aw>=100)awaken();return}const f=cur();const move=f.techs[techIndex%f.techs.length];const costs={HOLLOW:45,"JACKPOT RUSH":35,"SUPER NOVA":35,"PIERCING BLOOD":30};const cost=costs[move]||25;if(p.ce<cost||p.attack>0||p.techAnim>0||p.domainAnim>0||p.block)return;p.ce-=cost;p.techMax=move==="HOLLOW"?1.2:.82;p.techAnim=p.techMax;toast(move);
 setTimeout(()=>{if(p.techAnim<=0)return;burst(p.x+p.face*36,p.y-50,18,"techColor",3,techniqueColor(move,f.id));resolveTechnique(f.id,move)},Math.round(p.techMax*430))}
function resolveTechnique(id,move){
 if(id==="vessel"){const dmg=move==="CLEAVE"?22:17;hitEnemy(dmg,move==="CLEAVE"?690:580,move==="CLEAVE"?160:330);for(let i=0;i<34;i++)particle(p.x+p.face*(50+Math.random()*220),p.y-18-Math.random()*130,p.face*(190+Math.random()*420),(Math.random()-.5)*330,.42,"slash",3)}
 else if(id==="honored"){if(move==="BLUE"){hitEnemy(15,260,320);burst(e.x,e.y-55,42,"blue",3);e.vx=-p.face*180}else if(move==="RED"){hitEnemy(21,760,330);burst(e.x,e.y-55,44,"red",3)}else{hitEnemy(30,900,400);burst(e.x,e.y-55,70,"hollow",4)}}
 else if(id==="shadow"){if(move==="DIVINE DOGS"){hitEnemy(18,480,270);burst(e.x,e.y-30,30,"shadow",3)}else if(move==="NUE"){hitEnemy(20,430,340);burst(e.x,e.y-100,45,"lightning",3)}else{burst(p.x,p.y,58,"rabbit",3);p.vx=-p.face*320}}
 else if(id==="judge"){hitEnemy(move==="CONFISCATION"?19:16,move==="CONFISCATION"?480:600,260);burst(e.x,e.y-50,30,"gold",3)}
 else if(id==="gambler"){hitEnemy(move==="JACKPOT RUSH"?24:15,move==="JACKPOT RUSH"?700:430,260);burst(p.x,p.y-55,40,"green",3)}
 else if(id==="switcher"){if(move==="BOOGIE"){const old=p.x;p.x=e.x-p.face*75;e.x=old;burst(p.x,p.y-50,26,"gold",2);burst(e.x,e.y-50,26,"gold",2);shake=12}else{hitEnemy(14,360,210);burst(p.x,p.y-50,22,"gold",2)}}
 else if(id==="blood"){const dmg=move==="SUPER NOVA"?24:move==="PIERCING BLOOD"?20:14;hitEnemy(dmg,move==="PIERCING BLOOD"?760:500,move==="PIERCING BLOOD"?390:280);burst(e.x,e.y-55,40,"blood",3)}
 else if(id==="killer"){hitEnemy(move==="RUSH"?22:18,move==="RUSH"?760:600,230);burst(e.x,e.y-45,24,"steel",3)}
 else if(id==="thunder"){hitEnemy(move==="BOLT"?22:16,610,340);burst(e.x,e.y-65,46,"lightning",3)}
 else if(id==="shaper"){hitEnemy(move==="SOUL BURST"?24:17,570,270);burst(e.x,e.y-55,42,"soul",3)}
 else if(id==="copycat"){hitEnemy(move==="BEAM"?26:move==="RING CALL"?20:16,move==="BEAM"?820:520,360);burst(e.x,e.y-55,move==="BEAM"?60:34,"hollow",3)}
 else if(id==="heavenly"){hitEnemy(move==="SPLIT STRIKE"?22:17,move==="SPLIT STRIKE"?760:520,230);burst(e.x,e.y-45,28,"steel",3)}
 else if(id==="swordsman"){hitEnemy(move==="DRAW CUT"?21:17,690,250);burst(e.x,e.y-50,32,"blue",3)}
 else if(id==="medium"){hitEnemy(move==="DRAGON"?22:17,610,290);burst(e.x,e.y-55,34,"gold",3)}
 else if(id==="king"){const dmg=move==="DIVINE FLAME"?30:move==="CLEAVE"?23:18;hitEnemy(dmg,move==="DIVINE FLAME"?900:700,move==="DISMANTLE"?360:180);burst(e.x,e.y-55,move==="DIVINE FLAME"?70:38,move==="DIVINE FLAME"?"red":"slash",4)}
 else if(id==="ice"){hitEnemy(move==="ICE FALL"?23:18,520,330);burst(e.x,e.y-55,48,"blue",3)}
 else if(id==="angel"){hitEnemy(move==="JACOB"?26:18,620,360);burst(e.x,e.y-80,56,"gold",3)}
 else if(id==="speaker"){hitEnemy(move==="BLAST AWAY"?23:16,move==="BLAST AWAY"?820:320,420);burst(e.x,e.y-55,34,"steel",3)}
 else if(id==="nail"){hitEnemy(move==="RESONANCE"?24:16,560,310);burst(e.x,e.y-55,38,"blood",3)}
 else if(id==="rhythm"){hitEnemy(move==="PRAYER SONG"?22:16,540,290);burst(p.x,p.y-55,42,"gold",3)}
 else if(id==="miguel"){hitEnemy(move==="ROPE SNARE"?18:21,move==="ROPE SNARE"?350:620,300);burst(e.x,e.y-50,34,"gold",3)}
 else if(id==="ken"){const dmg=move==="UZUMAKI"?29:move==="GRAVITY"?22:17;hitEnemy(dmg,move==="GRAVITY"?220:move==="UZUMAKI"?850:480,360);burst(e.x,e.y-55,move==="UZUMAKI"?70:40,move==="GRAVITY"?"shadow":"soul",4)}
 else if(id==="takaba"){const dmg=move==="GAG IMPACT"?23:move==="SCENE CHANGE"?20:16;hitEnemy(dmg,move==="SCENE CHANGE"?300:620,330);burst(e.x,e.y-50,44,"gold",3)}
 else if(id==="geto"){const dmg=move==="UZUMAKI"?28:move==="SPIRIT BLAST"?22:17;hitEnemy(dmg,move==="UZUMAKI"?840:560,350);burst(e.x,e.y-55,move==="UZUMAKI"?68:38,"shadow",4)}
 else if(id==="larue"){if(move==="HEART CATCH"){const ox=e.x;e.x=p.x+p.face*95;e.vx=(p.x-ox)*.2;burst(e.x,e.y-50,36,"blood",3)}else{hitEnemy(22,650,240);burst(e.x,e.y-50,34,"blood",3)}}
 else if(id==="sukuna"||id==="meguna"||id==="heian"){const dmg=move==="WORLD CUT"?34:move==="DIVINE FLAME"?31:move==="CLEAVE"?24:move==="TEN SHADOWS"?23:19;hitEnemy(dmg,move==="WORLD CUT"?980:move==="DIVINE FLAME"?900:720,move==="DISMANTLE"?390:220);burst(e.x,e.y-55,move==="WORLD CUT"?80:move==="DIVINE FLAME"?70:42,move==="DIVINE FLAME"?"red":move==="TEN SHADOWS"?"shadow":"slash",4)}
}
function nextTechnique(){if(!p.awakened)return;techIndex=(techIndex+1)%cur().techs.length;toast(cur().techs[techIndex])}
function useCustom(){
 if(!customTech){toast("CREATE A CUSTOM TECHNIQUE FIRST");return}
 const t=customTech,use=t.use;
 if(use==="ground"&&!p.on||use==="air"&&p.on||use==="awakened"&&!p.awakened||use==="domain"&&p.domainActive<=0||use==="dash"&&p.dash<=0){toast("CONDITION NOT MET");return}
 if(p.ce<t.cost){toast("NOT ENOUGH CE");return}
 p.ce-=t.cost;p.techMax=.72;p.techAnim=.72;toast(t.name);
 setTimeout(()=>{if(t.effect==="teleport"){p.x=e.x-p.face*70;hitEnemy(t.damage,520,t.range)}
 else if(t.effect==="rush"){p.vx=p.face*880;hitEnemy(t.damage,700,t.range)}
 else{hitEnemy(t.damage,t.effect==="beam"?760:t.effect==="slash"?650:520,t.range)}
 burst(e.x,e.y-55,42,"custom",3)},260)
}
function evolve(){
 const i=sukunaChain.indexOf(cur().id);if(i<0){toast("NO EVOLUTION");return}if(i>=sukunaChain.length-1){toast("FINAL FORM");return}
 const nextId=sukunaChain[i+1],idx=roster.findIndex(r=>r.id===nextId);if(idx<0)return;
 charIndex=idx;selectedIndex=idx;techIndex=0;ui.charName.textContent=cur().name;p.awakened=true;p.aw=100;shake=22;burst(p.x,p.y-55,64,"aw",4);flash();toast("EVOLUTION: "+cur().name)
}
function startDomain(){if(cur().domain==="NO DOMAIN"){toast("NO DOMAIN");return}if(!p.awakened||p.ce<80||p.domainAnim>0||p.domainActive>0)return;p.ce-=80;p.domainAnim=p.domainMax;p.vx=0;shake=10;ui.cinemaName.textContent=cur().domain;ui.cinemaSub.textContent=cur().sub;ui.cinema.classList.add("show");setTimeout(()=>flash(),620);setTimeout(()=>{if(p.domainAnim>0){p.domainActive=8;burst(p.x,p.y-60,90,"domain",4);shake=24}},1420)}
function cycleChar(){if(p.domainAnim>0)return;charIndex=(charIndex+1)%roster.length;techIndex=0;p.aw=0;p.awakened=false;p.ce=100;p.domainActive=0;p.techAnim=0;p.attack=0;p.hp=100;e.hp=100;ui.charName.textContent=cur().name;burst(p.x,p.y-55,26,"switch",3);toast(cur().name)}
function jump(){if(p.on&&!p.block&&p.domainAnim<=0){p.vy=-625;p.on=false;p.land=0}}
function dash(){if(p.dash<=0&&!p.block&&p.domainAnim<=0){p.vx=p.face*820;p.dashMax=.46;p.dash=p.dashMax;burst(p.x-p.face*12,p.y-22,15,"dust",2)}}
function action(a){if(gameState!=="play"&&a!=="menu")return;if(a==="jump")jump();if(a==="attack")attack();if(a==="tech")technique();if(a==="techswap")nextTechnique();if(a==="custom")useCustom();if(a==="evolve")evolve();if(a==="domain")startDomain();if(a==="menu")openMenu("home");if(a==="dash")dash();if(a==="block")p.block=true}
document.querySelectorAll("[data-hold]").forEach(b=>{const k=b.dataset.hold;b.onpointerdown=q=>{q.preventDefault();key[k]=true};b.onpointerup=b.onpointercancel=()=>key[k]=false});
document.querySelectorAll("[data-action]").forEach(b=>{b.onpointerdown=q=>{q.preventDefault();action(b.dataset.action)};b.onpointerup=b.onpointercancel=()=>{if(b.dataset.action==="block")p.block=false}});
addEventListener("keydown",q=>{if(q.repeat)return;if(q.key==="Escape"){openMenu("home");return}if(gameState!=="play")return;if(q.key==="a"||q.key==="ArrowLeft")key.left=true;if(q.key==="d"||q.key==="ArrowRight")key.right=true;if(q.key==="w"||q.key==="ArrowUp"||q.key===" ")jump();if(q.key==="j")attack();if(q.key==="k")technique();if(q.key==="i")nextTechnique();if(q.key==="r")useCustom();if(q.key==="e")evolve();if(q.key==="u")startDomain();if(q.key==="Shift")dash();if(q.key==="l")p.block=true});
addEventListener("keyup",q=>{if(q.key==="a"||q.key==="ArrowLeft")key.left=false;if(q.key==="d"||q.key==="ArrowRight")key.right=false;if(q.key==="l")p.block=false});

function physics(o,dt){const was=o.on;o.vy+=1500*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.vx*=Math.pow(.0015,dt);if(o.y>=ground()){o.y=ground();o.vy=0;o.on=true;if(!was&&o===p){p.land=.18;burst(p.x,p.y,8,"dust",2)}}o.x=Math.max(45,Math.min(W-45,o.x))}
function limb(ax,ay,bx,by,cx,cy,w=7,col="#101114"){ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx,cy);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke()}
function pose(o){const d=o.face,run=Math.min(1,Math.abs(o.vx)/260),phase=q30(time)*13,step=Math.sin(phase)*run;let z={bodyX:0,bodyY:-56,headY:-86,la:[-d*15,-44,-d*26,-27],ra:[d*15,-44,d*27,-28],ll:[-12,-19,-19,0],rl:[12,-19,20,0],rot:0};
 if(run>.08&&o.on&&o.attack<=0&&o.techAnim<=0&&o.domainAnim<=0){const bounce=Math.abs(Math.sin(phase)),id=cur().id;
   const gait=id==="judge"||id==="swordsman"?.72:id==="gambler"||id==="switcher"?1.2:id==="killer"||id==="heavenly"?1.35:id==="honored"?0.82:1;
   const stride=25*gait,arm=19*gait,lean=id==="killer"||id==="heavenly"?.045:id==="honored"?-.008:.018;
   z.bodyX=d*(3+2*Math.sin(phase*2))*gait;z.bodyY=-56+bounce*(id==="gambler"?5:id==="judge"?1.5:3);z.headY=-86+bounce*2;
   z.ll=[-d*step*14,-17,d*step*stride,0];z.rl=[d*step*14,-17,-d*step*stride,0];
   z.la=[-d*15,-45,d*step*arm,-28];z.ra=[d*15,-45,-d*step*arm,-28];z.rot=d*Math.sin(phase)*lean;
   if(id==="honored"){z.la=[-d*10,-44,-d*15,-25];z.ra=[d*10,-44,d*15,-25]}
   if(id==="judge"){z.la=[-d*10,-44,-d*18,-29];z.ra=[d*10,-44,d*15,-30]}
   if(id==="gambler"){z.bodyX+=d*3;z.rot+=d*.03}
   if(id==="king"){z.bodyY-=2;z.headY-=2}
 }
 if(!o.on){const rise=clamp(-o.vy/620,-1,1);z.bodyY=-59;z.headY=-90;z.ll=[-13,-23,-27,-5];z.rl=[13,-23,29,-11];z.la=[-d*14,-49,-d*(26+8*rise),-34];z.ra=[d*14,-49,d*(28+7*rise),-38]}
 if(o.land>0){const t=1-o.land/.18,s=Math.sin(t*Math.PI);z.bodyY=-56+10*s;z.headY=-86+8*s;z.ll=[-15,-16,-31,0];z.rl=[15,-16,31,0]}
 const bb=o.blockBlend;if(bb>.01){const t=ease(bb);z.bodyX=-d*6*t;z.la=[-d*(10-3*t),-48,d*(2+20*t),-40-30*t];z.ra=[d*9,-48,d*(20+10*t),-35-23*t];z.rot=-d*.035*t}
 if(o.dash>0){const t=q30(1-o.dash/o.dashMax),s=easeOut(clamp(t*2));z.bodyX=d*(7+12*s);z.headY=-82;z.rot=d*.075;z.la=[-d*8,-48,-d*(18+20*s),-30];z.ra=[d*8,-48,-d*(12+20*s),-24];z.ll=[-10,-18,-d*(12+18*s),0];z.rl=[10,-18,d*(20+15*s),0]}
 if(o.attack>0){const t=q30(1-o.attack/o.attackMax),n=o.combo||1,wind=clamp(t/.22),strike=easeOut(clamp((t-.18)/.38)),rec=clamp((t-.72)/.28),ext=Math.sin(strike*Math.PI)*64;z.rot=d*(wind*.05-strike*.08+rec*.03);if(n===1){z.ra=[d*12,-46,d*(18+ext),-43];z.la=[-d*12,-46,-d*(22+12*wind),-35]}if(n===2){z.la=[-d*12,-46,d*(13+ext),-55];z.ra=[d*12,-46,d*4,-30]}if(n===3){z.ra=[d*12,-45,d*(18+ext*.82),-24];z.bodyX=d*9*strike;z.ll=[-12,-18,-d*24,0]}if(n===4){z.ra=[d*12,-47,d*(20+ext),-66];z.ll=[-10,-18,-d*18,0];z.rl=[10,-18,d*(20+ext*.38),-9];z.bodyY=-61}}
 if(o.techAnim>0){const t=q30(1-o.techAnim/o.techMax),cast=ease(clamp((t-.1)/.55));z.bodyX=-d*7+d*12*cast;z.ra=[d*10,-48,d*(18+32*cast),-61+21*cast];z.la=[-d*10,-48,-d*(18+14*cast),-63+12*cast];z.rot=-d*.055+d*.095*cast}
 if(o.domainAnim>0){const t=q30(1-o.domainAnim/o.domainMax),s=Math.sin(t*Math.PI*4)*.8;z.bodyY=-58;z.headY=-90;z.la=[-d*8,-49,-6+s*3,-68];z.ra=[d*8,-49,6-s*3,-68];z.ll=[-13,-18,-22,0];z.rl=[13,-18,22,0];z.rot=Math.sin(t*18)*.012}
 return z}

function hair(id,bx,hy){
 ctx.strokeStyle="#11131a";ctx.lineWidth=2;
 if(id==="honored"){ctx.fillStyle="#f4fbff";ctx.beginPath();const pts=[[-20,-4],[-27,-20],[-13,-18],[-9,-34],[0,-23],[8,-36],[12,-20],[26,-24],[19,-5]];pts.forEach((p,i)=>i?ctx.lineTo(bx+p[0],hy+p[1]):ctx.moveTo(bx+p[0],hy+p[1]));ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#0b0c10";ctx.fillRect(bx-18,hy-4,36,8);return}
 const styles={
  vessel:{fill:"#d9829b",spikes:10,len:31},shadow:{fill:"#11131a",spikes:13,len:34},judge:{fill:"#222",spikes:6,len:23},gambler:{fill:"#4a4250",spikes:9,len:31},switcher:{fill:"#191919",spikes:8,len:28},blood:{fill:"#16151b",spikes:9,len:29},killer:{fill:"#171717",spikes:6,len:24},thunder:{fill:"#bdefff",spikes:10,len:32},shaper:{fill:"#8c91a1",spikes:7,len:26}
 };
 const st=styles[id]||styles.vessel;ctx.fillStyle=st.fill;ctx.beginPath();ctx.moveTo(bx-18,hy-4);for(let i=0;i<=st.spikes;i++){const px=bx-20+i*(40/st.spikes),py=hy-(i%2?st.len:st.len*.58);ctx.lineTo(px,py)}ctx.lineTo(bx+18,hy-4);ctx.quadraticCurveTo(bx,hy-14,bx-18,hy-4);ctx.closePath();ctx.fill();ctx.stroke();
 if(id==="blood"){ctx.strokeStyle="#5b1d2d";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx-15,hy+3);ctx.lineTo(bx+15,hy+3);ctx.stroke()}
 if(id==="judge"){ctx.fillStyle="#222";ctx.fillRect(bx-18,hy-11,36,10)}
 if(id==="switcher"){ctx.strokeStyle="#111";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(bx+12,hy-17);ctx.lineTo(bx+24,hy-30);ctx.stroke()}
}
function drawFace(id,z,d){
 const bx=z.bodyX,hy=z.headY;
 const blink=(time%3.6)>3.46 || (time%7.9)>7.78;
 const angry=["sukuna","meguna","heian","king","killer","judge"].includes(id);
 const eyeY=hy+1, sep=7;
 ctx.strokeStyle="#11131a";ctx.fillStyle="#11131a";ctx.lineCap="round";
 if(id==="honored"){
   ctx.strokeStyle="#f7fbff";ctx.globalAlpha=.32;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(bx-11,hy+1);ctx.lineTo(bx+11,hy+1);ctx.stroke();ctx.globalAlpha=1;return;
 }
 if(blink){
   ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(bx-sep-3,eyeY);ctx.lineTo(bx-sep+3,eyeY);ctx.moveTo(bx+sep-3,eyeY);ctx.lineTo(bx+sep+3,eyeY);ctx.stroke();
 }else{
   ctx.beginPath();ctx.ellipse(bx-sep,eyeY,2.4,3,0,0,Math.PI*2);ctx.ellipse(bx+sep,eyeY,2.4,3,0,0,Math.PI*2);ctx.fill();
   if(["thunder","angel","ice"].includes(id)){ctx.fillStyle=cur().accent;ctx.beginPath();ctx.arc(bx-sep,eyeY,1,0,Math.PI*2);ctx.arc(bx+sep,eyeY,1,0,Math.PI*2);ctx.fill()}
 }
 ctx.strokeStyle="#17181c";ctx.lineWidth=1.6;
 ctx.beginPath();
 ctx.moveTo(bx-sep-4,hy-6+(angry?2:0));ctx.lineTo(bx-sep+3,hy-7-(angry?1:0));
 ctx.moveTo(bx+sep-3,hy-7-(angry?1:0));ctx.lineTo(bx+sep+4,hy-6+(angry?2:0));ctx.stroke();
 ctx.strokeStyle="#6b4b43";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(bx-3,hy+10);ctx.quadraticCurveTo(bx,hy+12+(angry?-2:1),bx+4,hy+10);ctx.stroke();
 if(id==="blood"){ctx.strokeStyle="#7a1d2a";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx-13,hy+5);ctx.lineTo(bx+13,hy+5);ctx.stroke()}
 if(id==="sukuna"||id==="meguna"||id==="heian"){
   ctx.fillStyle="#5b1721";
   if(!blink){ctx.beginPath();ctx.ellipse(bx-12,hy-7,1.8,2.2,0,0,Math.PI*2);ctx.ellipse(bx+12,hy-7,1.8,2.2,0,0,Math.PI*2);ctx.fill()}
 }
}
function outfitExtras(id,z,d){
 if(id==="vessel"){ctx.strokeStyle="#a7192d";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-13+z.bodyX,z.bodyY-5);ctx.lineTo(z.bodyX,z.bodyY+5);ctx.lineTo(14+z.bodyX,z.bodyY-5);ctx.stroke()}
 if(id==="judge"){ctx.strokeStyle="#d7d7d7";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(z.bodyX,z.bodyY+3);ctx.lineTo(z.bodyX,z.bodyY+22);ctx.stroke();ctx.strokeStyle="#9a7d3b";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(d*18,-38);ctx.lineTo(d*42,-20);ctx.stroke()}
 if(id==="gambler"){ctx.strokeStyle="#ececec";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(z.bodyX-8,z.bodyY+2);ctx.lineTo(z.bodyX+8,z.bodyY+2);ctx.stroke()}
 if(id==="killer"){ctx.strokeStyle="#777";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-13,-31);ctx.lineTo(15,-43);ctx.stroke()}
 if(id==="thunder"){ctx.strokeStyle="#6be8ff";ctx.lineWidth=2;ctx.globalAlpha=.6;ctx.beginPath();ctx.moveTo(-14,-54);ctx.lineTo(0,-45);ctx.lineTo(-8,-35);ctx.lineTo(15,-25);ctx.stroke();ctx.globalAlpha=1}
 if(id==="copycat"){ctx.strokeStyle="#111";ctx.lineWidth=4;ctx.beginPath();ctx.arc(d*25,-37,12,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#d8d8ff";ctx.beginPath();ctx.arc(d*25,-37,5,0,Math.PI*2);ctx.fill()}
 if(id==="heavenly"){ctx.strokeStyle="#7cae9c";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-14,-31);ctx.lineTo(17,-44);ctx.stroke()}
 if(id==="swordsman"){ctx.strokeStyle="#aab6c8";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-d*15,-34);ctx.lineTo(-d*38,-6);ctx.stroke()}
 if(id==="medium"){ctx.fillStyle="#d8c7b8";ctx.fillRect(z.bodyX-17,z.headY-4,34,9)}
 if(id==="king"){ctx.strokeStyle="#231416";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(z.bodyX-12,z.headY+3);ctx.lineTo(z.bodyX+12,z.headY+3);ctx.stroke();ctx.fillStyle="#6b1620";ctx.fillRect(z.bodyX-3,z.headY+8,6,3)}
 if(id==="ice"){ctx.strokeStyle="#b7efff";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-15,-45);ctx.lineTo(15,-45);ctx.stroke()}
 if(id==="angel"){ctx.strokeStyle="#fff0a6";ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.bodyX,z.headY-26,20,0,Math.PI*2);ctx.stroke()}
 if(id==="speaker"){ctx.fillStyle="#3c4250";ctx.fillRect(z.bodyX-18,z.headY+6,36,7)}
 if(id==="nail"){ctx.strokeStyle="#999";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(d*18,-36);ctx.lineTo(d*36,-26);ctx.stroke()}
 if(id==="rhythm"){ctx.strokeStyle="#ffbd6b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-16,-50);ctx.lineTo(16,-28);ctx.stroke()}
 if(id==="miguel"){ctx.strokeStyle="#e5a96e";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,-48);ctx.lineTo(18,-30);ctx.stroke();ctx.strokeStyle="#f0e6d9";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(d*12,-42);ctx.quadraticCurveTo(d*28,-55,d*40,-32);ctx.stroke()}
 if(id==="ken"){ctx.strokeStyle="#6e7687";ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.bodyX,z.headY+2,18,Math.PI*.1,Math.PI*.9);ctx.stroke()}
 if(id==="takaba"){ctx.strokeStyle="#ffdd4d";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-15,-45);ctx.lineTo(15,-32);ctx.stroke()}
 if(id==="geto"){ctx.strokeStyle="#444b5b";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-15,-45);ctx.lineTo(15,-45);ctx.stroke()}
 if(id==="larue"){ctx.strokeStyle="#d57ab6";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-14,-50);ctx.lineTo(14,-28);ctx.stroke()}
 if(id==="sukuna"){ctx.strokeStyle="#581b25";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(z.bodyX-15,z.headY+4);ctx.lineTo(z.bodyX+15,z.headY+4);ctx.moveTo(z.bodyX,z.headY-15);ctx.lineTo(z.bodyX,z.headY+15);ctx.stroke()}
 if(id==="meguna"){ctx.strokeStyle="#7a1d2a";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(z.bodyX-15,z.headY+4);ctx.lineTo(z.bodyX+15,z.headY+4);ctx.stroke()}
 if(id==="heian"){ctx.strokeStyle="#6d1621";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(z.bodyX-16,z.headY+3);ctx.lineTo(z.bodyX+16,z.headY+3);ctx.moveTo(z.bodyX-8,z.headY-12);ctx.lineTo(z.bodyX+8,z.headY+13);ctx.stroke();ctx.strokeStyle="#32171a";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-16,-48);ctx.lineTo(-28,-34);ctx.moveTo(16,-48);ctx.lineTo(28,-34);ctx.stroke()}
}
function fighter(o){const f=cur(),id=f.id,z=pose(o),d=o.face;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(z.rot);ctx.lineCap="round";ctx.lineJoin="round";
 if(o.domainActive>0){ctx.strokeStyle=f.accent;ctx.globalAlpha=.22+.1*Math.sin(time*11);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-56,52+Math.sin(time*7)*6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}
 ctx.strokeStyle=f.body;ctx.lineWidth=id==="honored"?12:9;ctx.beginPath();ctx.moveTo(z.bodyX,z.bodyY);ctx.lineTo(z.bodyX,-20);ctx.stroke();
 outfitExtras(id,z,d);
 limb(z.bodyX,-49,z.la[0]+z.bodyX,z.la[1],z.la[2]+z.bodyX,z.la[3],7,f.body);limb(z.bodyX,-49,z.ra[0]+z.bodyX,z.ra[1],z.ra[2]+z.bodyX,z.ra[3],7,f.body);limb(z.bodyX,-20,z.ll[0]+z.bodyX,z.ll[1],z.ll[2]+z.bodyX,z.ll[3],7,f.body);limb(z.bodyX,-20,z.rl[0]+z.bodyX,z.rl[1],z.rl[2]+z.bodyX,z.rl[3],7,f.body);
 ctx.fillStyle=f.skin;ctx.beginPath();ctx.arc(z.bodyX,z.headY,18,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#101114";ctx.lineWidth=3;ctx.stroke();hair(id,z.bodyX,z.headY);
 drawFace(id,z,d);
 if(o.blockBlend>.1){ctx.strokeStyle=f.accent;ctx.globalAlpha=.3+.2*o.blockBlend;ctx.lineWidth=2+o.blockBlend*2;ctx.beginPath();ctx.arc(d*25,-50,31,-1.15,1.15);ctx.stroke();ctx.globalAlpha=1}
 if(o.techAnim>0)drawTechCharge(id,z,d,1-o.techAnim/o.techMax);
 ctx.restore()}
function drawTechCharge(id,z,d,t){const move=cur().techs[techIndex];const s=easeOut(t),tc=techniqueColor(move,id);ctx.globalAlpha=clamp(t*2);ctx.strokeStyle=tc;ctx.fillStyle=tc;ctx.lineWidth=3;
 if(id==="honored"){ctx.beginPath();ctx.arc(d*(40+18*s),-49,8+25*s,0,Math.PI*2);ctx.stroke()}
 else if(id==="shadow"){ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(0,2,28+70*s,8+18*s,0,0,Math.PI*2);ctx.fill()}
 else if(id==="switcher"){ctx.beginPath();ctx.arc(0,-50,30+12*Math.sin(t*18),0,Math.PI*2);ctx.stroke()}
 else if(id==="blood"){ctx.beginPath();ctx.arc(d*(36+15*s),-48,6+18*s,0,Math.PI*2);ctx.fill()}
 else if(id==="thunder"){for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-20+i*12,-65);ctx.lineTo(10+i*6,-25);ctx.stroke()}}
 else if(id==="judge"){ctx.strokeRect(d*18,-66,30*s,24*s)}
 else{ctx.beginPath();ctx.arc(d*(35+18*s),-48,8+20*s,0,Math.PI*2);ctx.stroke()}
 ctx.globalAlpha=1}
function dummy(o){ctx.save();ctx.translate(o.x,o.y);ctx.lineCap="round";ctx.strokeStyle=o.hit>0?"#555":"#171717";ctx.lineWidth=7;const recoil=o.hit>0?Math.sin(o.hit*30)*14:0;ctx.rotate(recoil*.013);ctx.beginPath();ctx.arc(0,-82,18,0,Math.PI*2);ctx.moveTo(0,-64);ctx.lineTo(recoil,-20);ctx.moveTo(recoil,-20);ctx.lineTo(-19,0);ctx.moveTo(recoil,-20);ctx.lineTo(22,0);ctx.moveTo(0,-54);ctx.lineTo(-24,-34);ctx.moveTo(0,-54);ctx.lineTo(24,-34);ctx.stroke();ctx.restore()}

function drawStage(){
 if(p.domainActive>0){drawDomainStage(cur().id);return}
 let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#d9dde1");g.addColorStop(.54,"#b7bbc0");g.addColorStop(.55,"#878b90");g.addColorStop(1,"#5f646a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.strokeStyle="#a6aab0";ctx.lineWidth=1;for(let i=0;i<W;i+=84){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H*.55);ctx.stroke()}
 ctx.fillStyle="#7a7e83";for(let i=0;i<7;i++){const bx=(i*173+60)%W,bh=40+(i%3)*28;ctx.fillRect(bx,H*.55-bh,45,bh)}
 ctx.strokeStyle="#555a60";for(let y=H*.62;y<H;y+=46){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 ctx.fillStyle="#44484d";ctx.fillRect(0,ground()+2,W,4)
}
function drawDomainStage(id){const f=cur();
 if(id==="honored"){let g=ctx.createRadialGradient(W/2,H*.4,20,W/2,H*.4,Math.max(W,H));g.addColorStop(0,"#effcff");g.addColorStop(.2,"#75c7ff");g.addColorStop(.58,"#152457");g.addColorStop(1,"#02040c");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<110;i++){ctx.globalAlpha=.2+(i%5)*.12;ctx.fillStyle="#fff";ctx.fillRect((i*97+time*18)%W,(i*53)%H,2+(i%3),2+(i%3))}ctx.globalAlpha=1}
 else if(id==="shadow"){ctx.fillStyle="#04060b";ctx.fillRect(0,0,W,H);ctx.fillStyle="#111827";for(let i=0;i<18;i++){ctx.beginPath();ctx.ellipse((i*91+Math.sin(time+i)*22)%W,ground()+8,80,18+(i%3)*6,0,0,Math.PI*2);ctx.fill()}}
 else if(id==="judge"){ctx.fillStyle="#15120e";ctx.fillRect(0,0,W,H);ctx.strokeStyle="#8d6d32";ctx.lineWidth=2;for(let i=0;i<8;i++){ctx.strokeRect(30+i*(W-60)/8,70,40,H-140)}}
 else if(id==="gambler"){ctx.fillStyle="#09140f";ctx.fillRect(0,0,W,H);ctx.fillStyle="#55ff9f";ctx.globalAlpha=.2;for(let i=0;i<20;i++)ctx.fillRect((i*87+time*50)%W,(i*61)%H,36,12);ctx.globalAlpha=1}
 else if(id==="blood"){ctx.fillStyle="#18070b";ctx.fillRect(0,0,W,H);ctx.strokeStyle="#651226";for(let i=0;i<15;i++){ctx.beginPath();ctx.arc((i*79)%W,(i*47)%H,20+(i%4)*9,0,Math.PI*2);ctx.stroke()}}
 else if(id==="thunder"){ctx.fillStyle="#061016";ctx.fillRect(0,0,W,H);ctx.strokeStyle="#6be8ff";ctx.globalAlpha=.4;for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo((i*107)%W,0);ctx.lineTo((i*77+60)%W,H);ctx.stroke()}ctx.globalAlpha=1}
 else if(id==="shaper"||id==="copycat"){ctx.fillStyle=id==="copycat"?"#11101a":"#0d0a16";ctx.fillRect(0,0,W,H);ctx.strokeStyle=f.accent;ctx.globalAlpha=.25;for(let i=0;i<18;i++){ctx.beginPath();ctx.arc((i*83)%W,(i*59)%H,12+(i%5)*7,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1}
 else if(id==="king"){ctx.fillStyle="#190407";ctx.fillRect(0,0,W,H);ctx.strokeStyle="#6d1822";ctx.lineWidth=3;for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(i*W/9,0);ctx.lineTo(W-i*W/11,H);ctx.stroke()}}
 else if(id==="ice"){let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#dff8ff");g.addColorStop(1,"#102a36");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.strokeStyle="#b7efff";for(let i=0;i<20;i++){ctx.beginPath();ctx.moveTo((i*67)%W,0);ctx.lineTo((i*97)%W,H);ctx.stroke()}}
 else if(["heavenly","swordsman","medium","angel","speaker","nail","rhythm","miguel","takaba","geto","larue"].includes(id)){
   const palettes={heavenly:["#07110f","#76d7b5"],swordsman:["#08101c","#79a7ff"],medium:["#160e08","#d3925b"],angel:["#15130a","#fff0a6"],speaker:["#0d1016","#b7c1d8"],nail:["#170d11","#e6a7b6"],rhythm:["#171006","#ffbd6b"],miguel:["#160e08","#e5a96e"],takaba:["#171405","#ffdd4d"],geto:["#0d0a12","#5d4e73"],larue:["#160b13","#d57ab6"]},pal=palettes[id];
   ctx.fillStyle=pal[0];ctx.fillRect(0,0,W,H);ctx.strokeStyle=pal[1];ctx.globalAlpha=.24;
   for(let i=0;i<18;i++){ctx.beginPath();ctx.arc((i*89+time*18)%W,(i*57)%H,18+(i%4)*7,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1;
 }
 else{ctx.fillStyle=id==="switcher"?"#171407":"#17080b";ctx.fillRect(0,0,W,H);ctx.strokeStyle=f.accent;ctx.globalAlpha=.25;for(let i=0;i<W;i+=65){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+80,H);ctx.stroke()}ctx.globalAlpha=1}
 ctx.fillStyle="#111";ctx.fillRect(0,ground()+2,W,4)
}
function drawDomainOpening(){if(p.domainAnim<=0)return;const t=1-p.domainAnim/p.domainMax,qt=q30(t),f=cur();ctx.save();ctx.fillStyle="rgba(0,0,0,"+clamp(qt*1.9,0,.82)+")";ctx.fillRect(0,0,W,H);const cx=p.x,cy=p.y-58;
 if(qt>.1){ctx.strokeStyle=f.accent;ctx.lineWidth=2+qt*10;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(cx,cy,30+easeOut(qt)*Math.max(W,H)*.9,0,Math.PI*2);ctx.stroke()}
 if(qt>.32){ctx.globalAlpha=.18;ctx.fillStyle=f.accent;for(let i=0;i<14;i++){ctx.beginPath();ctx.arc(cx+Math.cos(i*1.7)*qt*150,cy+Math.sin(i*2.1)*qt*95,12+qt*24,0,Math.PI*2);ctx.fill()}}
 if(qt>.62){ctx.globalAlpha=.4;ctx.strokeStyle="#fff";ctx.lineWidth=1;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(i*.78)*W,cy+Math.sin(i*.78)*H);ctx.stroke()}}
 ctx.restore()}

function update(dt){time+=dt;if(gameState!=="play")return;if(gameMode==="sandbox"){if(sandbox.hp)p.hp=100;if(sandbox.ce)p.ce=100;if(sandbox.aw){p.aw=100;p.awakened=true}}if(toastT>0){toastT-=dt;if(toastT<=0)ui.toast.classList.remove("show")}if(p.hitstop>0){p.hitstop-=dt;return}
 const locked=p.domainAnim>0,move=(key.right?1:0)-(key.left?1:0);if(move&&!p.block&&p.attack<=0&&p.techAnim<=0&&!locked){p.face=move;p.vx+=move*1850*dt}p.vx=Math.max(-350,Math.min(350,p.vx));p.block=key.block||p.block;p.blockBlend+=((p.block?1:0)-p.blockBlend)*Math.min(1,dt*20);
 p.attack=Math.max(0,p.attack-dt);p.comboT=Math.max(0,p.comboT-dt);p.dash=Math.max(0,p.dash-dt);p.land=Math.max(0,p.land-dt);p.techAnim=Math.max(0,p.techAnim-dt);p.domainAnim=Math.max(0,p.domainAnim-dt);p.domainActive=Math.max(0,p.domainActive-dt);e.hit=Math.max(0,e.hit-dt);p.ce=Math.min(100,p.ce+(p.awakened?5.5:9)*dt);
 physics(p,dt);physics(e,dt);if(p.domainAnim<=0)ui.cinema.classList.remove("show");
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.l-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.94;f.vy+=(f.type==="dust"?100:340)*dt;if(f.l<=0)fx.splice(i,1)}
 $("pHP").style.width=p.hp+"%";$("eHP").style.width=e.hp+"%";$("ce").style.width=p.ce+"%";$("aw").style.width=p.aw+"%";$("ceText").textContent=Math.round(p.ce);$("awText").textContent=p.awakened?"CT UNLOCKED":Math.round(p.aw)+"%";
 ui.tech.className="tech "+(p.awakened?"active":p.aw>=100?"ready":"locked");ui.tech.textContent=p.awakened?cur().techs[techIndex]:p.aw>=100?"AWAKEN":"CT LOCKED";if(p.awakened){const tc=techniqueColor(cur().techs[techIndex]);ui.tech.style.borderColor=tc;ui.tech.style.color=tc;ui.tech.style.boxShadow="0 0 20px "+tc+"66"}else{ui.tech.style.borderColor="";ui.tech.style.color="";ui.tech.style.boxShadow=""};
 ui.swap.textContent=p.awakened?"NEXT CT":"CT "+cur().techs.length;ui.domain.className="domain "+(p.domainActive>0?"active":p.awakened&&p.ce>=80&&cur().domain!=="NO DOMAIN"?"ready":"");ui.domain.textContent=p.domainActive>0?"DOMAIN ACTIVE":"DOMAIN";
 ui.evolve.style.display=sukunaChain.includes(cur().id)?"":"none";ui.mode.textContent=p.domainActive>0?"DOMAIN":gameMode==="sandbox"?"SANDBOX":"BATTLE";
}
function draw(){ctx.save();if(shake>.2){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.82}drawStage();
 for(const f of fx){ctx.globalAlpha=Math.max(0,f.l/f.max);const col=f.color||{aw:"#ed2445",dust:"#d7d7d7",hit:"#161616",impact:"#fff",blue:"#45b9ff",red:"#ff4058",hollow:"#d9b9ff",shadow:"#121722",lightning:"#6be8ff",rabbit:"#eee",gold:"#d5b75d",green:"#55ff9f",blood:"#b51f38",steel:"#8aa0a6",soul:"#8e7cff",domain:cur().accent,switch:"#55c9ff",slash:"#f1f1ff",custom:customTech?customTech.color:"#8f6cff",techColor:cur().accent}[f.type]||cur().accent;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=f.size||2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x-f.vx*.04,f.y-f.vy*.04);ctx.stroke()}
 ctx.globalAlpha=1;fighter(p);dummy(e);drawDomainOpening();ctx.restore()}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0)*slowMo;last=t;update(dt);draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();