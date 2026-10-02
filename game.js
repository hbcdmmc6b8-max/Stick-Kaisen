(()=>{"use strict";
const c=document.getElementById("c"),ctx=c.getContext("2d");
const $=id=>document.getElementById(id);
const ui={tech:$("techBtn"),swap:$("techSwapBtn"),custom:$("customBtn"),evolve:$("evolveBtn"),domain:$("domainBtn"),charName:$("charName"),mode:$("modeLabel"),cinema:$("cinema"),cinemaName:$("cinemaName"),cinemaSub:$("cinemaSub"),toast:$("moveToast"),menu:$("mainMenu"),grid:$("characterGrid"),selectedName:$("selectedName"),selectedTechs:$("selectedTechs"),selectMode:$("selectMode"),sandbox:$("sandboxPanel")};
let W=0,H=0,last=0,time=0,shake=0,toastT=0,charIndex=0,techIndex=0,cinemaZoom=1,stagePulse=0;
let gameState="menu",gameMode="battle",selectedIndex=0,slowMo=1,customCooldown=0,enemyIndex=1,stageId="city",cpuLevel=0,pausedFromGame=false,customDomain=null,cpuTechCooldown=0,matchOver=false,customDomainActive=false,domainClash=null,domainPulseT=0;
const settings={shake:1,vfx:1,reducedFlash:false};
try{customDomain=JSON.parse(localStorage.getItem("stickKaisenCustomDomain")||"null")}catch(_){customDomain=null}
const OWNER_MODE=new URLSearchParams(location.search).get("owner")==="1"||localStorage.getItem("stickKaisenOwner")==="1";
if(new URLSearchParams(location.search).get("owner")==="1")localStorage.setItem("stickKaisenOwner","1");
let customTech=null;
try{customTech=JSON.parse(localStorage.getItem("stickKaisenCustomTech")||"null")}catch(_){}
const sandbox={hp:true,ce:true,aw:true,slow:false,domain:false,cooldown:false,hitboxes:false,dummyBlock:false,dummyMove:false,dummyMaxHp:100,dummyCount:1,stageDamage:true};
const key={left:false,right:false,block:false};
const roster=[
 {id:"vessel",name:"VESSEL",accent:"#d9829b",body:"#111217",skin:"#e7c5b4",domain:"SHRINE OF SEVERANCE",sub:"CUT EVERYTHING IN RANGE",techs:["DISMANTLE","CLEAVE"]},
 {id:"honored",name:"HONORED ONE",accent:"#dff7ff",body:"#111217",skin:"#e7c5b4",domain:"INFINITE HORIZON",sub:"BOUNDLESS INFORMATION",techs:["BLUE","RED","HOLLOW"]},
 {id:"shadow",name:"SHADOW MANIPULATOR",accent:"#242a3a",body:"#151a24",skin:"#e7c5b4",domain:"CHIMERA SHADOW GARDEN",sub:"SHADOWS WITHOUT END",techs:["DIVINE DOGS","NUE","RABBIT ESCAPE"]},
 {id:"judge",name:"DEADLY JUDGE",accent:"#c79b4b",body:"#202025",skin:"#d9b9a4",domain:"DEADLOCK COURT",sub:"VERDICT IS ABSOLUTE",techs:["GAVEL","CONFISCATION"]},
 {id:"gambler",name:"RESTLESS GAMBLER",accent:"#55ff9f",body:"#27262c",skin:"#debca5",domain:"FEVER JACKPOT",sub:"HIT THE ODDS",techs:["DOORS","JACKPOT RUSH"]},
 {id:"switcher",name:"SWITCHER",accent:"#f3d75c",body:"#17181b",skin:"#d2ad96",domain:"RESONANT STAGE",sub:"POSITION HAS NO CERTAINTY",techs:["BOOGIE","FAKE CLAP"]},
 {id:"blood",name:"BLOOD BROTHER",accent:"#b51f38",body:"#3b2b49",skin:"#d7b5a3",domain:"CRIMSON CHAMBER",sub:"BLOOD OBEYS",techs:["PIERCING BLOOD","SUPER NOVA","FLOWING RED"]},
 {id:"killer",name:"SORCERER KILLER",accent:"#8aa0a6",body:"#151718",skin:"#d5b09a",domain:"EMPTY HEAVEN COURT",sub:"CURSED ENERGY HAS NO HOLD HERE",techs:["CHAIN","RUSH"]},
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
 {id:"heian",name:"HEIAN SUKUNA",accent:"#ff3049",body:"#32171a",skin:"#c9967e",domain:"RUINED SHRINE",sub:"EVOLUTION III",techs:["DISMANTLE","CLEAVE","DIVINE FLAME","WORLD CUT"],evo:3},
 {id:"modulo",name:"MODULO YUJI",accent:"#ff2a3d",body:"#090a0d",skin:"#111217",domain:"MODULO SHRINE",sub:"OWNER // ABSOLUTE CURSED CONTROL",techs:["BLACK FLASH","DISMANTLE Ω","CLEAVE Ω","DIVINE FLAME Ω","WORLD CUT Ω","HOMING PIERCING BLOOD"],owner:true},
 {id:"yuka",name:"YUKA OKKOTSU",accent:"#6179ff",body:"#121826",skin:"#111217",domain:"TEN SHADOWS NEXUS",sub:"SHADOWS ANSWER THE NEW GENERATION",techs:["SAVAGE JAW STRIKE","DIVINE DOGS","MAHORAGA CALL"]},
 {id:"tsurugi",name:"TSURUGI OKKOTSU",accent:"#d8dde8",body:"#1b1d23",skin:"#111217",domain:"MACULATION FIELD",sub:"AUTOMATIC INTERCEPTION",techs:["BATTO DRAW","MACULATION","HONOYAGI RUSH"]},
 {id:"maru",name:"MARU",accent:"#70e6d1",body:"#17222a",skin:"#111217",domain:"CHAOS HARMONY",sub:"ORDER AND DISORDER COLLIDE",techs:["CHAOTIC LIFT","GRAVITY SHIFT","MENTAL CHAOS","HARMONY"]},
 {id:"cross",name:"CROSS",accent:"#5cd0e8",body:"#151c26",skin:"#111217",domain:"TWIN CHAOS",sub:"HARMONY WITHOUT MERCY",techs:["CHAOS","HARMONY","GRAVITY BREAK"]},
 {id:"dabura",name:"DABURA KARABA",accent:"#ffe36f",body:"#171714",skin:"#111217",domain:"RADIANT ABYSS",sub:"LIGHT TURNS AGAINST THE WORLD",techs:["LIGHT BEAM","LIGHT STEP","DARKNESS REVERSAL"]},
 {id:"usami",name:"KOU USAMI",accent:"#9dc8ff",body:"#1d222b",skin:"#111217",domain:"SPATIAL TRANSFERENCE",sub:"POSITION IS NEVER FIXED",techs:["SPACE SHIFT","BARRIER STEP","TRANSFER STRIKE"]},
 {id:"jabaloma",name:"JABALOMA",accent:"#ff9f68",body:"#2a1d17",skin:"#111217",domain:"KALYAN RING",sub:"PRESSURE WITHOUT ESCAPE",techs:["HEAVY RUSH","CRUSH FIELD","BREAK STEP"]},
 {id:"kyoko",name:"KYOKO TOMOE",accent:"#e690ff",body:"#24182a",skin:"#111217",domain:"VIOLET THREAD HALL",sub:"EVERY PATH RETURNS",techs:["THREAD CUT","SNARE ARC","RETURN LINE"]},
 {id:"dapa",name:"DAPA",accent:"#7ef0a5",body:"#14231a",skin:"#111217",domain:"RUMELIAN GROVE",sub:"ALIEN CURSED FLOW",techs:["ROLLUCA BURST","THIRD EYE","RUSH"]},
 {id:"osuki",name:"OSUKI",accent:"#ffb86a",body:"#261c13",skin:"#111217",domain:"RUMELIAN WARPATH",sub:"NO SAFE DISTANCE",techs:["WAR STEP","HEAVY PALM","ROLLUCA SHOT"]}
];
const p={x:220,y:0,vx:0,vy:0,face:1,hp:100,ce:100,aw:0,on:true,attack:0,attackMax:.32,combo:0,comboT:0,dash:0,dashMax:.46,block:false,blockBlend:0,awakened:false,land:0,techAnim:0,techMax:.78,domainAnim:0,domainActive:0,domainMax:2.15,hitstop:0,animSeed:0};
const e={x:700,y:0,vx:0,vy:0,hp:100,on:true,hit:0,face:-1,block:false,blockBlend:0,attack:0,attackMax:.34,combo:1,comboT:0,dash:0,dashMax:.46,land:0,techAnim:0,techMax:.82,domainAnim:0,domainActive:0,domainMax:2.15,aw:100,awakened:true,ce:100,hitstop:0};
const fx=[];const stageScars=[];const extraDummies=[{x:0,y:0,vx:0,vy:0,hp:100,on:true,hit:0},{x:0,y:0,vx:0,vy:0,hp:100,on:true,hit:0}];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const easeOut=t=>1-Math.pow(1-clamp(t),3);
const q30=t=>Math.floor(t*30)/30;
const cur=()=>roster[charIndex];
const enemyCur=()=>roster[enemyIndex]||roster[1];
const sukunaChain=["sukuna","meguna","heian"];
function ground(){return H*.79}
function resize(){const r=c.getBoundingClientRect();W=c.width=Math.max(1,r.width*devicePixelRatio);H=c.height=Math.max(1,r.height*devicePixelRatio);ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);W=r.width;H=r.height;p.x=Math.min(Math.max(70,p.x),W*.44);e.x=Math.max(W*.62,Math.min(e.x,W-60));p.y=e.y=ground()}
addEventListener("resize",resize);resize();

function showScreen(name){
  document.querySelectorAll(".menuCard").forEach(el=>el.classList.toggle("active",el.dataset.screen===name));
}
function openMenu(screen="home"){
  pausedFromGame=gameState==="play";gameState="menu";ui.menu.classList.add("show");document.body.classList.add("menu-open");ui.sandbox.classList.remove("show");showScreen(screen);ui.mode.textContent=pausedFromGame?"PAUSED":"MENU";
}
function closeMenu(){
  ui.menu.classList.remove("show");document.body.classList.remove("menu-open");gameState="play";ui.mode.textContent=gameMode==="sandbox"?"SANDBOX":"BATTLE";ui.sandbox.classList.toggle("show",gameMode==="sandbox");
}
function renderOpponentSelect(){
 const sel=$("opponentSelect");if(!sel)return;sel.innerHTML="";
 roster.forEach((f,i)=>{if(f.owner&&!OWNER_MODE)return;const o=document.createElement("option");o.value=i;o.textContent=f.name;sel.appendChild(o)});
 if([...sel.options].some(o=>+o.value===enemyIndex))sel.value=String(enemyIndex);
}
function renderCharacterGrid(){
  ui.grid.innerHTML="";
  roster.forEach((f,i)=>{
    if(f.owner&&!OWNER_MODE)return;
    const card=document.createElement("button");card.className="charCard"+(i===selectedIndex?" selected":"");card.style.setProperty("--accent",f.accent);
    card.innerHTML="<b>"+f.name+"</b><small>"+f.techs.join(" · ")+"</small>"+(f.owner?"<span class='evoTag'>OWNER ONLY</span>":f.evo?"<span class='evoTag'>EVOLUTION "+f.evo+"</span>":"");
    card.onclick=()=>{selectedIndex=i;renderCharacterGrid();syncSelected()};
    ui.grid.appendChild(card);
  });
}
function syncSelected(){
  const f=roster[selectedIndex];ui.selectedName.textContent=f.name;ui.selectedTechs.textContent=f.techs.join(" / ")+(f.domain!=="NO DOMAIN"?" · "+f.domain:"");
  renderOpponentSelect();
}
function resetFight(){
  techIndex=0;p.x=Math.max(90,W*.24);e.x=Math.min(W-90,W*.74);p.y=e.y=ground();p.vx=p.vy=e.vx=e.vy=0;p.hp=100;e.hp=gameMode==="sandbox"?sandbox.dummyMaxHp:100;p.ce=100;p.aw=0;p.awakened=false;p.domainActive=0;p.domainAnim=0;p.techAnim=0;p.attack=0;
  e.ce=100;e.aw=100;e.awakened=true;e.domainActive=0;e.domainAnim=0;e.techAnim=0;e.attack=0;e.block=false;e.blockBlend=0;e.face=-1;cpuTechCooldown=0;matchOver=false;customDomainActive=false;domainClash=null;domainPulseT=0;stageScars.length=0;
  extraDummies.forEach((d,i)=>{d.x=Math.min(W-70,W*(.58+i*.14));d.y=ground();d.vx=d.vy=0;d.hp=sandbox.dummyMaxHp;d.on=true;d.hit=0});
  if($("matchEnd"))$("matchEnd").classList.remove("show");
}
function startSelected(){
  charIndex=selectedIndex;
  enemyIndex=+$("opponentSelect").value||1;
  stageId=$("stageSelect").value||"city";
  cpuLevel=+$("difficultySelect").value||0;
  ui.charName.textContent=cur().name;
  const cpuName=document.querySelector(".fighter.right span");if(cpuName)cpuName.textContent=enemyCur().name;
  resetFight();closeMenu();
}
document.querySelectorAll("[data-menu]").forEach(b=>b.onclick=()=>{
  const a=b.dataset.menu;
  if(a==="home")showScreen("home");
  if(a==="play"){gameMode="battle";ui.selectMode.textContent="BATTLE";renderCharacterGrid();syncSelected();showScreen("select")}
  if(a==="sandbox"){gameMode="sandbox";ui.selectMode.textContent="SANDBOX";renderCharacterGrid();syncSelected();showScreen("select")}
  if(a==="custom")showScreen("custom");
  if(a==="customdomain")showScreen("customdomain");
  if(a==="controls")showScreen("controls");
  if(a==="settings")showScreen("settings");
});
$("startFight").onclick=startSelected;
["ctDamage","ctCost","ctRange","ctHits","ctKnock"].forEach(id=>{$(id).oninput=()=>$(id+"Out").textContent=$(id).value});
$("ctCooldown").oninput=()=>$("ctCooldownOut").textContent=$("ctCooldown").value+"s";
$("ctCharge").oninput=()=>$("ctChargeOut").textContent=$("ctCharge").value+"s";
$("saveCustom").onclick=()=>{
  customTech={name:$("ctName").value.trim()||"CUSTOM TECH",effect:$("ctEffect").value,damage:+$("ctDamage").value,cost:+$("ctCost").value,range:+$("ctRange").value,hits:+$("ctHits").value,knock:+$("ctKnock").value,cooldown:+$("ctCooldown").value,charge:+$("ctCharge").value,use:$("ctUse").value,color:$("ctColor").value};
  localStorage.setItem("stickKaisenCustomTech",JSON.stringify(customTech));$("customSaved").textContent="Saved: "+customTech.name;
};
if(customTech)$("customSaved").textContent="Saved: "+customTech.name;
if($("cdCost"))$("cdCost").oninput=()=>$("cdCostOut").textContent=$("cdCost").value;
if($("cdDuration"))$("cdDuration").oninput=()=>$("cdDurationOut").textContent=$("cdDuration").value+"s";
if($("saveCustomDomain"))$("saveCustomDomain").onclick=()=>{
 customDomain={name:$("cdName").value.trim()||"CURSED SANCTUM",sub:$("cdSub").value.trim()||"MY RULES DEFINE THIS SPACE",color:$("cdColor").value,cost:+$("cdCost").value,duration:+$("cdDuration").value,buff:$("cdBuff").value,sureHit:$("cdSureHit").value,style:$("cdStyle").value};
 localStorage.setItem("stickKaisenCustomDomain",JSON.stringify(customDomain));$("customDomainSaved").textContent="Saved: "+customDomain.name;
};
if(customDomain&&$("customDomainSaved"))$("customDomainSaved").textContent="Saved: "+customDomain.name;
if($("setShake"))$("setShake").oninput=e=>{settings.shake=+e.target.value/100;$("setShakeOut").textContent=e.target.value+"%"};
if($("setVfx"))$("setVfx").oninput=e=>{settings.vfx=+e.target.value/100;$("setVfxOut").textContent=e.target.value+"%"};
if($("setFlash"))$("setFlash").onchange=e=>settings.reducedFlash=e.target.checked;
$("sbHp").onchange=e=>sandbox.hp=e.target.checked;
$("sbCe").onchange=e=>sandbox.ce=e.target.checked;
$("sbAw").onchange=e=>sandbox.aw=e.target.checked;
$("sbSlow").onchange=e=>{sandbox.slow=e.target.checked;slowMo=sandbox.slow?.35:1};
$("sbDomain").onchange=e=>sandbox.domain=e.target.checked;
$("sbCooldown").onchange=e=>sandbox.cooldown=e.target.checked;
$("sbHitboxes").onchange=e=>sandbox.hitboxes=e.target.checked;
$("sbDummyBlock").onchange=e=>sandbox.dummyBlock=e.target.checked;
$("sbDummyMove").onchange=e=>sandbox.dummyMove=e.target.checked;
$("sbStageDamage").onchange=e=>sandbox.stageDamage=e.target.checked;
$("sbDummyCount").oninput=e=>{sandbox.dummyCount=+e.target.value;$("sbDummyCountOut").textContent=e.target.value};
$("sbDummyHp").oninput=e=>{sandbox.dummyMaxHp=+e.target.value;$("sbDummyHpOut").textContent=e.target.value;e.hp=Math.min(e.hp,sandbox.dummyMaxHp)};
$("sbReset").onclick=resetFight;
$("sbRefill").onclick=()=>{p.hp=100;p.ce=100;p.aw=100;e.hp=sandbox.dummyMaxHp;p.awakened=true;customCooldown=0;toast("SANDBOX REFILLED")};
$("rematchBtn").onclick=()=>{resetFight();closeMenu()};
$("matchMenuBtn").onclick=()=>{if($("matchEnd"))$("matchEnd").classList.remove("show");pausedFromGame=false;openMenu("home")};
renderCharacterGrid();syncSelected();openMenu("home");

function toast(s){ui.toast.textContent=s;ui.toast.classList.add("show");toastT=.8}
function particle(px,py,vx,vy,l=.3,type="ce",size=2,color=null){fx.push({x:px,y:py,vx,vy,l,max:l,type,size,color})}
function burst(px,py,n=14,type="ce",size=2,color=null){n=Math.max(1,Math.round(n*settings.vfx));for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=60+Math.random()*280;particle(px,py,Math.cos(a)*s,Math.sin(a)*s,.18+Math.random()*.35,type,size,color)}}
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
  COPY:"#8fd6ff","RING CALL":"#ffd36b",BEAM:"#f4f7ff","TRANSFIGURE":"#8e7cff","SOUL BURST":"#b298ff",
  GAVEL:"#c79b4b",CONFISCATION:"#e7c978",DOORS:"#55ff9f","JACKPOT RUSH":"#7dffbc",BOOGIE:"#f3d75c","FAKE CLAP":"#fff2a6",
  CHAIN:"#8aa0a6",RUSH:"#d8e1e5","SAVAGE JAW STRIKE":"#6d82ff","MAHORAGA CALL":"#d9d9d9","BATTO DRAW":"#e9edf7",MACULATION:"#b8c4d8","HONOYAGI RUSH":"#f3f5ff","CHAOTIC LIFT":"#70e6d1","GRAVITY SHIFT":"#4c6a7d","MENTAL CHAOS":"#95f0df",HARMONY:"#b6fff1",CHAOS:"#5cd0e8","GRAVITY BREAK":"#48657a","LIGHT BEAM":"#fff17a","LIGHT STEP":"#fffbd0","DARKNESS REVERSAL":"#242033","SPACE SHIFT":"#9dc8ff","BARRIER STEP":"#c8e1ff","TRANSFER STRIKE":"#78aaff","HEAVY RUSH":"#ff9f68","CRUSH FIELD":"#c86d42","BREAK STEP":"#ffc18f","THREAD CUT":"#e690ff","SNARE ARC":"#cf6be8","RETURN LINE":"#f2b1ff","ROLLUCA BURST":"#7ef0a5","THIRD EYE":"#afffd0","WAR STEP":"#ffb86a","HEAVY PALM":"#f09045","ROLLUCA SHOT":"#ffd39a","BLACK FLASH":"#ff182f","DISMANTLE Ω":"#f5f5ff","CLEAVE Ω":"#ff8a98","DIVINE FLAME Ω":"#ff4b1f","WORLD CUT Ω":"#ffffff","HOMING PIERCING BLOOD":"#c30f2d"
 };
 return exact[move]||cur().accent;
}
function flash(){if(settings.reducedFlash)return;const f=$("impact");f.classList.remove("flash");void f.offsetWidth;f.classList.add("flash")}
function damageStage(x,intensity=1){
 if(gameMode==="sandbox"&&!sandbox.stageDamage)return;
 stageScars.push({x,y:ground()+2,r:12+intensity*10,l:5+intensity*2,max:5+intensity*2});
 if(stageScars.length>28)stageScars.shift();
 for(let i=0;i<Math.round(5+intensity*4);i++)particle(x+(Math.random()-.5)*35,ground()-3,(Math.random()-.5)*180,-80-Math.random()*180,.45,"dust",2);
}
function activeTargets(){return gameMode==="sandbox"?[e,...extraDummies.slice(0,Math.max(0,sandbox.dummyCount-1))]:[e]}
function hitEnemy(dmg,pow,range=128){
 if(customDomainActive&&p.domainActive>0&&customDomain){
   if(customDomain.buff==="damage")dmg*=1.45;
   if(customDomain.buff==="range")range*=1.55;
 }
 let hit=false;
 for(const target of activeTargets()){
  if(Math.abs(p.x-target.x)<range&&Math.abs(p.y-target.y)<100&&target.hit<=0){
   const guarding=target===e&&gameMode==="sandbox"&&sandbox.dummyBlock;
   let tdmg=guarding?Math.max(1,Math.round(dmg*.2)):dmg,tPow=guarding?pow*.18:pow;
   target.hp=Math.max(0,target.hp-tdmg);target.vx=p.face*tPow;target.vy=-tPow*.2;target.hit=.26;
   p.aw=Math.min(100,p.aw+Math.min(40,tdmg*1.55));p.hitstop=tdmg>=14?.075:.045;shake=tdmg>=14?16:9;
   burst(target.x,target.y-52,tdmg>=14?28:15,tdmg>=14?"impact":"hit",tdmg>=14?3:2);if(tdmg>=14)damageStage(target.x,Math.min(3,tdmg/12));flash();hit=true;
  }
 }
 return hit
}

function hitPlayer(dmg,pow,range=128){
 if(Math.abs(p.x-e.x)<range&&Math.abs(p.y-e.y)<100&&p.hitstop<=0){
  const guarding=p.block;dmg=guarding?Math.max(1,Math.round(dmg*.22)):dmg;pow=guarding?pow*.2:pow;
  p.hp=Math.max(0,p.hp-dmg);p.vx=-e.face*pow;p.vy=-pow*.16;p.hitstop=.04;shake=dmg>=14?13:7;burst(p.x,p.y-52,dmg>=14?22:12,"impact",3);flash();return true
 }return false
}
function attack(){if(p.attack>0||p.techAnim>0||p.domainAnim>0||p.block)return;p.combo=p.comboT>0?(p.combo%4)+1:1;p.comboT=.54;p.attackMax=p.combo===4?.46:.34;p.attack=p.attackMax;p.animSeed=Math.random();const delay=p.combo===4?170:115;setTimeout(()=>{if(p.attack>0)hitEnemy(p.combo===4?15:7,p.combo===4?560:285)},delay)}
function awaken(){if(p.aw<100||p.awakened)return;p.awakened=true;shake=18;burst(p.x,p.y-55,52,"aw",3);flash();toast("CURSED TECHNIQUE RELEASED")}
function technique(){if(!p.awakened){if(p.aw>=100||cur().id==="modulo"){p.aw=100;awaken()}return}const f=cur();const move=f.techs[techIndex%f.techs.length];const costs={HOLLOW:45,"JACKPOT RUSH":35,"SUPER NOVA":35,"PIERCING BLOOD":30};const cost=f.id==="modulo"?0:(costs[move]||25);if(p.ce<cost||p.attack>0||p.techAnim>0||p.domainAnim>0||p.block)return;p.ce-=cost;p.techMax=move==="HOLLOW"?1.2:.82;p.techAnim=p.techMax;toast(move);
 setTimeout(()=>{if(p.techAnim<=0)return;burst(p.x+p.face*36,p.y-50,18,"techColor",3,techniqueColor(move,f.id));resolveTechnique(f.id,move)},Math.round(p.techMax*430))}
function resolveTechnique(id,move){
 if(id==="modulo"){
   const mega=1000000;
   if(move==="BLACK FLASH"){
     p.x=Math.min(W-70,Math.max(70,e.x-p.face*58));p.vx=0;
     shake=34;cinemaZoom=1.12;flash();
     burst(e.x,e.y-52,74,"techColor",5,"#ff182f");
     burst(e.x,e.y-52,38,"techColor",3,"#090909");
     hitEnemy(25,780,125);
   }else if(move==="HOMING PIERCING BLOOD"){
     const sx=p.x+p.face*28,sy=p.y-54,steps=16;
     for(let i=0;i<steps;i++)setTimeout(()=>{
       const t=(i+1)/steps,x=sx+(e.x-sx)*t,y=sy+((e.y-55)-sy)*t;
       particle(x,y,0,0,.22,"techColor",4,"#c30f2d");
       if(i===steps-1){hitEnemy(24,620,9999);burst(e.x,e.y-55,42,"techColor",4,"#c30f2d")}
     },i*22);
   }else{
     const base=move==="WORLD CUT Ω"?34:move==="DIVINE FLAME Ω"?31:move==="CLEAVE Ω"?24:19;
     const dmg=base*mega,range=move==="DISMANTLE Ω"?9999:move==="WORLD CUT Ω"?9999:420;
     const pow=move==="WORLD CUT Ω"?1400:move==="DIVINE FLAME Ω"?1200:980;
     hitEnemy(dmg,pow,range);
     const col=move==="DIVINE FLAME Ω"?"#ff4b1f":move==="WORLD CUT Ω"?"#ffffff":move==="CLEAVE Ω"?"#ff8a98":"#f5f5ff";
     burst(e.x,e.y-55,move==="WORLD CUT Ω"?120:82,"techColor",5,col);shake=30;cinemaZoom=1.08;flash();
   }
 }
 else if(id==="vessel"){const dmg=move==="CLEAVE"?22:17;hitEnemy(dmg,move==="CLEAVE"?690:580,move==="CLEAVE"?160:330);for(let i=0;i<34;i++)particle(p.x+p.face*(50+Math.random()*220),p.y-18-Math.random()*130,p.face*(190+Math.random()*420),(Math.random()-.5)*330,.42,"slash",3)}
 else if(id==="honored"){if(move==="BLUE"){hitEnemy(15,260,320);burst(e.x,e.y-55,42,"blue",3);e.vx=-p.face*180}else if(move==="RED"){hitEnemy(21,760,330);burst(e.x,e.y-55,44,"red",3)}else{hitEnemy(30,900,400);burst(e.x,e.y-55,70,"hollow",4)}}
 else if(id==="shadow"){if(move==="DIVINE DOGS"){hitEnemy(18,480,270);burst(e.x,e.y-30,30,"shadow",3)}else if(move==="NUE"){hitEnemy(20,430,340);burst(e.x,e.y-100,45,"lightning",3)}else{burst(p.x,p.y,58,"rabbit",3);p.vx=-p.face*320}}
 else if(id==="judge"){hitEnemy(move==="CONFISCATION"?19:16,move==="CONFISCATION"?480:600,260);burst(e.x,e.y-50,30,"gold",3)}
 else if(id==="gambler"){hitEnemy(move==="JACKPOT RUSH"?24:15,move==="JACKPOT RUSH"?700:430,260);burst(p.x,p.y-55,40,"green",3)}
 else if(id==="switcher"){if(move==="BOOGIE"){const old=p.x;p.x=e.x-p.face*75;e.x=old;burst(p.x,p.y-50,26,"gold",2);burst(e.x,e.y-50,26,"gold",2);shake=12}else{hitEnemy(14,360,210);burst(p.x,p.y-50,22,"gold",2)}}
 else if(id==="blood"){const dmg=move==="SUPER NOVA"?24:move==="PIERCING BLOOD"?20:14;hitEnemy(dmg,move==="PIERCING BLOOD"?760:500,move==="PIERCING BLOOD"?390:280);burst(e.x,e.y-55,40,"blood",3)}
 else if(id==="killer"){hitEnemy(move==="RUSH"?22:18,move==="RUSH"?760:600,230);burst(e.x,e.y-45,24,"steel",3)}
 else if(id==="thunder"){hitEnemy(move==="BOLT"?22:16,610,340);burst(e.x,e.y-65,46,"lightning",3)}
 else if(id==="shaper"){hitEnemy(move==="SOUL BURST"?24:17,570,270);burst(e.x,e.y-55,42,"soul",3)}
 else if(id==="copycat"){hitEnemy(move==="BEAM"?26:move==="RING CALL"?20:16,move==="BEAM"?820:520,360);burst(e.x,e.y-55,move==="BEAM"?60:34,"techColor",3,techniqueColor(move,id))}
 else if(id==="heavenly"){hitEnemy(move==="SPLIT STRIKE"?22:17,move==="SPLIT STRIKE"?760:520,230);burst(e.x,e.y-45,28,"steel",3)}
 else if(id==="swordsman"){hitEnemy(move==="DRAW CUT"?21:17,690,250);burst(e.x,e.y-50,32,"blue",3)}
 else if(id==="medium"){hitEnemy(move==="DRAGON"?22:17,610,290);burst(e.x,e.y-55,34,"gold",3)}
 else if(id==="king"){const dmg=move==="DIVINE FLAME"?30:move==="CLEAVE"?23:18;hitEnemy(dmg,move==="DIVINE FLAME"?900:700,move==="DISMANTLE"?360:180);burst(e.x,e.y-55,move==="DIVINE FLAME"?70:38,move==="DIVINE FLAME"?"red":"slash",4)}
 else if(id==="ice"){hitEnemy(move==="ICE FALL"?23:18,520,330);burst(e.x,e.y-55,48,"techColor",3,techniqueColor(move,id))}
 else if(id==="angel"){hitEnemy(move==="JACOB"?26:18,620,360);burst(e.x,e.y-80,56,"techColor",3,techniqueColor(move,id))}
 else if(id==="speaker"){hitEnemy(move==="BLAST AWAY"?23:16,move==="BLAST AWAY"?820:320,420);burst(e.x,e.y-55,34,"techColor",3,techniqueColor(move,id))}
 else if(id==="nail"){hitEnemy(move==="RESONANCE"?24:16,560,310);burst(e.x,e.y-55,38,"techColor",3,techniqueColor(move,id))}
 else if(id==="rhythm"){hitEnemy(move==="PRAYER SONG"?22:16,540,290);burst(p.x,p.y-55,42,"techColor",3,techniqueColor(move,id))}
 else if(id==="miguel"){hitEnemy(move==="ROPE SNARE"?18:21,move==="ROPE SNARE"?350:620,300);burst(e.x,e.y-50,34,"techColor",3,techniqueColor(move,id))}
 else if(id==="ken"){const dmg=move==="UZUMAKI"?29:move==="GRAVITY"?22:17;hitEnemy(dmg,move==="GRAVITY"?220:move==="UZUMAKI"?850:480,360);burst(e.x,e.y-55,move==="UZUMAKI"?70:40,move==="GRAVITY"?"shadow":"soul",4)}
 else if(id==="takaba"){const dmg=move==="GAG IMPACT"?23:move==="SCENE CHANGE"?20:16;hitEnemy(dmg,move==="SCENE CHANGE"?300:620,330);burst(e.x,e.y-50,44,"techColor",3,techniqueColor(move,id))}
 else if(id==="geto"){const dmg=move==="UZUMAKI"?28:move==="SPIRIT BLAST"?22:17;hitEnemy(dmg,move==="UZUMAKI"?840:560,350);burst(e.x,e.y-55,move==="UZUMAKI"?68:38,"techColor",4,techniqueColor(move,id))}
 else if(id==="larue"){if(move==="HEART CATCH"){const ox=e.x;e.x=p.x+p.face*95;e.vx=(p.x-ox)*.2;burst(e.x,e.y-50,36,"techColor",3,techniqueColor(move,id))}else{hitEnemy(22,650,240);burst(e.x,e.y-50,34,"techColor",3,techniqueColor(move,id))}}
 else if(id==="yuka"){if(move==="SAVAGE JAW STRIKE"){hitEnemy(22,620,170);burst(e.x,e.y-45,34,"techColor",3,techniqueColor(move,id))}else if(move==="DIVINE DOGS"){hitEnemy(19,520,260);burst(e.x,e.y-35,36,"shadow",3)}else{hitEnemy(30,760,420);burst(e.x,e.y-60,64,"shadow",4)}}
 else if(id==="tsurugi"){hitEnemy(move==="HONOYAGI RUSH"?25:move==="MACULATION"?20:18,move==="HONOYAGI RUSH"?780:560,240);burst(e.x,e.y-50,34,"techColor",3,techniqueColor(move,id))}
 else if(id==="maru"||id==="cross"){const dmg=move==="MENTAL CHAOS"?16:move==="HARMONY"?14:22;hitEnemy(dmg,move==="GRAVITY SHIFT"||move==="GRAVITY BREAK"?260:520,360);if(move.includes("GRAVITY"))e.vy=-520;burst(e.x,e.y-55,44,"techColor",3,techniqueColor(move,id))}
 else if(id==="dabura"){const dmg=move==="DARKNESS REVERSAL"?26:move==="LIGHT BEAM"?23:17;hitEnemy(dmg,move==="LIGHT STEP"?720:620,430);burst(e.x,e.y-55,52,"techColor",4,techniqueColor(move,id))}
 else if(id==="usami"){if(move==="SPACE SHIFT"){const old=p.x;p.x=e.x-p.face*80;e.x=old;burst(p.x,p.y-50,28,"techColor",3,techniqueColor(move,id))}else{hitEnemy(move==="TRANSFER STRIKE"?23:17,650,300);burst(e.x,e.y-50,36,"techColor",3,techniqueColor(move,id))}}
 else if(id==="jabaloma"||id==="dapa"||id==="osuki"){hitEnemy(move.includes("HEAVY")?24:move.includes("CRUSH")?23:18,650,300);burst(e.x,e.y-50,38,"techColor",3,techniqueColor(move,id))}
 else if(id==="kyoko"){hitEnemy(move==="THREAD CUT"?21:18,560,340);burst(e.x,e.y-50,40,"techColor",3,techniqueColor(move,id))}
 else if(id==="sukuna"||id==="meguna"||id==="heian"){const dmg=move==="WORLD CUT"?34:move==="DIVINE FLAME"?31:move==="CLEAVE"?24:move==="TEN SHADOWS"?23:19;hitEnemy(dmg,move==="WORLD CUT"?980:move==="DIVINE FLAME"?900:720,move==="DISMANTLE"?390:220);burst(e.x,e.y-55,move==="WORLD CUT"?80:move==="DIVINE FLAME"?70:42,move==="DIVINE FLAME"?"red":move==="TEN SHADOWS"?"shadow":"slash",4)}
}
function nextTechnique(){if(!p.awakened)return;techIndex=(techIndex+1)%cur().techs.length;toast(cur().techs[techIndex])}
function useCustom(){
 if(!customTech){toast("CREATE A CUSTOM TECHNIQUE FIRST");return}
 const t=customTech,use=t.use,hits=Math.max(1,t.hits||1),charge=Math.max(.05,t.charge||.7);
 if(customCooldown>0&&!sandbox.cooldown){toast("CUSTOM COOLDOWN "+customCooldown.toFixed(1)+"s");return}
 if(use==="ground"&&!p.on||use==="air"&&p.on||use==="awakened"&&!p.awakened||use==="domain"&&p.domainActive<=0||use==="dash"&&p.dash<=0){toast("CONDITION NOT MET");return}
 if(p.ce<t.cost&&!sandbox.ce){toast("NOT ENOUGH CE");return}
 if(!sandbox.ce)p.ce-=t.cost;p.techMax=charge;p.techAnim=charge;toast(t.name);
 const fire=()=>{
   const perHit=Math.max(1,Math.round(t.damage/hits)),pow=t.knock||520,spacing=70;
   for(let n=0;n<hits;n++)setTimeout(()=>{
     if(t.effect==="teleport"){p.x=e.x-p.face*70;hitEnemy(perHit,pow,t.range)}
     else if(t.effect==="rush"){p.vx=p.face*880;hitEnemy(perHit,pow,t.range)}
     else if(t.effect==="trap"){if(Math.abs(p.x-e.x)<t.range)hitEnemy(perHit,pow*.45,t.range)}
     else hitEnemy(perHit,t.effect==="beam"?Math.max(pow,760):t.effect==="slash"?Math.max(pow,650):pow,t.range);
     burst(e.x,e.y-55,20,"custom",3,t.color);
   },n*spacing);
   if(!sandbox.cooldown)customCooldown=t.cooldown||0;
 };
 setTimeout(fire,Math.round(charge*560));
}
function evolve(){
 const i=sukunaChain.indexOf(cur().id);if(i<0){toast("NO EVOLUTION");return}if(i>=sukunaChain.length-1){toast("FINAL FORM");return}
 const nextId=sukunaChain[i+1],idx=roster.findIndex(r=>r.id===nextId);if(idx<0)return;
 charIndex=idx;selectedIndex=idx;techIndex=0;ui.charName.textContent=cur().name;p.awakened=true;p.aw=100;shake=22;burst(p.x,p.y-55,64,"aw",4);flash();toast("EVOLUTION: "+cur().name)
}
function startCustomDomain(){
 if(!customDomain){toast("CREATE A CUSTOM DOMAIN FIRST");return}
 if(p.domainAnim>0||p.domainActive>0||p.ce<customDomain.cost)return;
 p.ce-=customDomain.cost;p.domainAnim=p.domainMax;p.vx=0;cinemaZoom=1.18;shake=12;customDomainActive=true;domainPulseT=.8;
 ui.cinemaName.textContent=customDomain.name;ui.cinemaSub.textContent=customDomain.sub;ui.cinema.classList.add("show");
 setTimeout(()=>{if(p.domainAnim>0){p.domainActive=customDomain.duration;burst(p.x,p.y-60,110,"domain",4,customDomain.color);shake=24}},1200)
}
function startDomain(){
 if(cur().domain==="NO DOMAIN"){toast("NO DOMAIN");return}
 if(!p.awakened||p.ce<80||p.domainAnim>0||p.domainActive>0||domainClash)return;
 customDomainActive=false;
 const clash=gameMode==="battle"&&cpuLevel>=2&&enemyCur().domain!=="NO DOMAIN"&&Math.random()<(cpuLevel===3?.8:.55);
 if(clash){
   p.ce-=40;e.ce=Math.max(0,e.ce-40);domainClash={t:1.15,max:1.15};
   ui.cinemaName.textContent="DOMAIN CLASH";ui.cinemaSub.textContent=cur().domain+"  VS  "+enemyCur().domain;ui.cinema.classList.add("show");
   cinemaZoom=1.16;shake=26;burst(W*.5,H*.42,120,"domain",4,"#ffffff");toast("DOMAIN CLASH");
   setTimeout(()=>{
     if(!domainClash)return;
     const playerPower=1+(p.aw/100)+p.ce/160;
     const cpuPower=.8+cpuLevel*.48+e.ce/180;
     const playerWins=playerPower+Math.random()*.35>=cpuPower+Math.random()*.35;
     domainClash=null;ui.cinema.classList.remove("show");flash();
     if(playerWins){p.ce=Math.max(0,p.ce-40);p.domainAnim=p.domainMax;p.vx=0;ui.cinemaName.textContent=cur().domain;ui.cinemaSub.textContent=cur().sub;ui.cinema.classList.add("show");setTimeout(()=>{p.domainActive=8;burst(p.x,p.y-60,110,"domain",4,cur().accent);shake=26},900)}
     else{e.domainActive=6;p.domainActive=0;toast("CPU DOMAIN WON THE CLASH");shake=24}
   },950);
   return
 }
 p.ce-=80;p.domainAnim=p.domainMax;p.vx=0;cinemaZoom=1.18;stagePulse=1;shake=10;ui.cinemaName.textContent=cur().domain;ui.cinemaSub.textContent=cur().sub;ui.cinema.classList.add("show");burst(p.x,p.y-60,26,"domain",3,cur().accent);
 setTimeout(()=>{flash();shake=16},520);setTimeout(()=>{if(p.domainAnim>0){p.domainActive=8;burst(p.x,p.y-60,110,"domain",4,cur().accent);shake=26;cinemaZoom=1.04;stagePulse=1}},1420)
}
function cycleChar(){if(p.domainAnim>0)return;charIndex=(charIndex+1)%roster.length;techIndex=0;p.aw=0;p.awakened=false;p.ce=100;p.domainActive=0;p.techAnim=0;p.attack=0;p.hp=100;e.hp=100;ui.charName.textContent=cur().name;burst(p.x,p.y-55,26,"switch",3);toast(cur().name)}
function jump(){if(p.on&&!p.block&&p.domainAnim<=0){p.vy=-625;p.on=false;p.land=0}}
function dash(){if(p.dash<=0&&!p.block&&p.domainAnim<=0){p.vx=p.face*820;p.dashMax=.46;p.dash=p.dashMax;burst(p.x-p.face*12,p.y-22,15,"dust",2)}}
function action(a){if(gameState!=="play"&&a!=="menu")return;if(a==="jump")jump();if(a==="attack")attack();if(a==="tech")technique();if(a==="techswap")nextTechnique();if(a==="custom")useCustom();if(a==="evolve")evolve();if(a==="domain")startDomain();if(a==="customdomain")startCustomDomain();if(a==="menu"){if(gameState==="play")openMenu("home");else if(pausedFromGame)closeMenu()};if(a==="dash")dash();if(a==="block")p.block=true}
document.querySelectorAll("[data-hold]").forEach(b=>{const k=b.dataset.hold;b.onpointerdown=q=>{q.preventDefault();key[k]=true};b.onpointerup=b.onpointercancel=()=>key[k]=false});
document.querySelectorAll("[data-action]").forEach(b=>{b.onpointerdown=q=>{q.preventDefault();action(b.dataset.action)};b.onpointerup=b.onpointercancel=()=>{if(b.dataset.action==="block")p.block=false}});
addEventListener("keydown",q=>{if(q.repeat)return;if(q.key==="Escape"){if(gameState==="play")openMenu("home");else if(pausedFromGame)closeMenu();return}if(gameState!=="play")return;if(q.key==="a"||q.key==="ArrowLeft")key.left=true;if(q.key==="d"||q.key==="ArrowRight")key.right=true;if(q.key==="w"||q.key==="ArrowUp"||q.key===" ")jump();if(q.key==="j")attack();if(q.key==="k")technique();if(q.key==="i")nextTechnique();if(q.key==="r")useCustom();if(q.key==="e")evolve();if(q.key==="u")startDomain();if(q.key==="o")startCustomDomain();if(q.key==="Shift")dash();if(q.key==="l")p.block=true});
addEventListener("keyup",q=>{if(q.key==="a"||q.key==="ArrowLeft")key.left=false;if(q.key==="d"||q.key==="ArrowRight")key.right=false;if(q.key==="l")p.block=false});

function physics(o,dt){const was=o.on;o.vy+=1500*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.vx*=Math.pow(.0015,dt);if(o.y>=ground()){o.y=ground();o.vy=0;o.on=true;if(!was&&o===p){p.land=.18;burst(p.x,p.y,8,"dust",2)}}o.x=Math.max(45,Math.min(W-45,o.x))}
function limb(ax,ay,bx,by,cx,cy,w=7,col="#101114"){ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx,cy);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke()}
function pose(o,forcedId=null){const d=o.face,run=Math.min(1,Math.abs(o.vx)/260),phase=q30(time)*13,step=Math.sin(phase)*run;let z={bodyX:0,bodyY:-56,headY:-86,la:[-d*15,-44,-d*26,-27],ra:[d*15,-44,d*27,-28],ll:[-12,-19,-19,0],rl:[12,-19,20,0],rot:0};
 if(run>.08&&o.on&&o.attack<=0&&o.techAnim<=0&&o.domainAnim<=0){const bounce=Math.abs(Math.sin(phase)),id=forcedId||cur().id;
   const slow=["judge","swordsman","geto","ken"].includes(id),fast=["killer","heavenly","thunder","miguel"].includes(id),swagger=["gambler","switcher","takaba","larue"].includes(id);
   const gait=slow?.72:swagger?1.18:fast?1.35:id==="honored"?.82:1;
   const stride=25*gait,arm=19*gait,lean=fast?.05:id==="honored"?-.008:swagger?.032:.018;
   z.bodyX=d*(3+2*Math.sin(phase*2))*gait;z.bodyY=-56+bounce*(swagger?4.5:slow?1.7:3);z.headY=-86+bounce*(fast?2.8:2);
   const hip=16,footStride=20*gait,liftL=step>0?-7*Math.abs(step):0,liftR=step<0?-7*Math.abs(step):0;
   z.ll=[-d*hip,-17,d*step*footStride,liftL];z.rl=[d*hip,-17,-d*step*footStride,liftR];
   z.la=[-d*15,-45,d*step*arm,-28];z.ra=[d*15,-45,-d*step*arm,-28];z.rot=d*Math.sin(phase)*lean;
   if(id==="honored"){z.la=[-d*10,-44,-d*15,-25];z.ra=[d*10,-44,d*15,-25]}
   if(id==="judge"||id==="ken"){z.la=[-d*10,-44,-d*18,-29];z.ra=[d*10,-44,d*15,-30]}
   if(id==="gambler"||id==="takaba"){z.bodyX+=d*3;z.rot+=d*.03}
   if(id==="sukuna"||id==="meguna"||id==="heian"||id==="king"){z.bodyY-=2;z.headY-=2}
   if(id==="miguel"){z.rot+=d*Math.sin(phase*.5)*.025;z.la=[-d*14,-44,d*step*24,-29];z.ra=[d*14,-44,-d*step*24,-29]}
   if(id==="larue"){z.la=[-d*12,-45,d*step*12,-24];z.ra=[d*12,-45,-d*step*12,-31]}
   if(id==="modulo"){z.bodyY-=3;z.headY-=3;z.rot=d*.045;z.la=[-d*13,-47,-d*(18+step*10),-25];z.ra=[d*13,-47,d*(28-step*12),-36];z.ll=[-d*17,-18,d*step*30,0];z.rl=[d*17,-18,-d*step*30,-3]}
 }
 if(run<=.08&&o.on&&o.attack<=0&&o.techAnim<=0&&o.domainAnim<=0&&o.blockBlend<.05&&o.dash<=0){
   const id=forcedId||cur().id,b=Math.sin(q30(time)*2.6),b2=Math.sin(q30(time)*1.3);
   z.bodyY=-56+b*1.4;z.headY=-86+b*1.1;z.rot=d*b2*.008;
   if(id==="honored"){z.la=[-d*9,-45,-d*15,-22];z.ra=[d*9,-45,d*15,-22];z.rot=-d*.012}
   else if(id==="judge"){z.la=[-d*10,-45,-d*18,-29];z.ra=[d*10,-45,d*18,-29];z.rot=0}
   else if(id==="gambler"){z.bodyX=d*4;z.la=[-d*10,-44,-d*21,-25];z.ra=[d*10,-44,d*21,-25];z.rot=d*.025}
   else if(id==="switcher"){z.la=[-d*12,-45,-d*4,-27];z.ra=[d*12,-45,d*4,-27]}
   else if(id==="blood"){z.la=[-d*11,-45,-d*21,-34];z.ra=[d*11,-45,d*22,-35]}
   else if(id==="killer"||id==="heavenly"){z.bodyX=d*5;z.rot=d*.035;z.la=[-d*13,-45,-d*25,-31];z.ra=[d*13,-45,d*18,-28]}
   else if(id==="thunder"){z.la=[-d*12,-45,-d*22,-26];z.ra=[d*12,-45,d*28,-37];z.rot=d*.02}
   else if(id==="copycat"){z.la=[-d*11,-45,-d*18,-28];z.ra=[d*11,-45,d*28,-39]}
   else if(id==="miguel"){z.rot=d*b2*.03;z.la=[-d*13,-44,-d*25,-26];z.ra=[d*13,-44,d*23,-33]}
   else if(id==="takaba"){z.bodyX=d*(3+b2*2);z.rot=d*.04;z.la=[-d*12,-44,-d*29,-24];z.ra=[d*12,-44,d*8,-18]}
   else if(id==="geto"||id==="ken"){z.la=[-d*10,-45,-d*17,-27];z.ra=[d*10,-45,d*17,-27];z.rot=-d*.01}
   else if(id==="larue"){z.bodyX=d*2;z.la=[-d*12,-45,-d*28,-35];z.ra=[d*12,-45,d*22,-24]}
   else if(id==="sukuna"||id==="meguna"||id==="heian"||id==="king"){z.bodyY-=2;z.headY-=2;z.la=[-d*14,-46,-d*25,-32];z.ra=[d*14,-46,d*26,-33];z.rot=d*.012}
   else if(id==="modulo"){z.bodyY-=4;z.headY-=4;z.bodyX=d*5;z.rot=d*.045;z.la=[-d*12,-47,-d*30,-28];z.ra=[d*12,-47,d*24,-35];z.ll=[-15,-18,-22,0];z.rl=[15,-18,24,0]}
 }
 if(!o.on){const rise=clamp(-o.vy/620,-1,1);z.bodyY=-59;z.headY=-90;z.ll=[-13,-23,-27,-5];z.rl=[13,-23,29,-11];z.la=[-d*14,-49,-d*(26+8*rise),-34];z.ra=[d*14,-49,d*(28+7*rise),-38]}
 if(o.land>0){const t=1-o.land/.18,s=Math.sin(t*Math.PI);z.bodyY=-56+10*s;z.headY=-86+8*s;z.ll=[-15,-16,-31,0];z.rl=[15,-16,31,0]}
 const bb=o.blockBlend;if(bb>.01){const t=ease(bb);z.bodyX=-d*6*t;z.la=[-d*(10-3*t),-48,d*(2+20*t),-40-30*t];z.ra=[d*9,-48,d*(20+10*t),-35-23*t];z.rot=-d*.035*t}
 if(o.dash>0){const t=q30(1-o.dash/o.dashMax),s=easeOut(clamp(t*2));z.bodyX=d*(7+12*s);z.headY=-82;z.rot=d*.075;z.la=[-d*8,-48,-d*(18+20*s),-30];z.ra=[d*8,-48,-d*(12+20*s),-24];z.ll=[-10,-18,-d*(12+18*s),0];z.rl=[10,-18,d*(20+15*s),0]}
 if(o.attack>0){const t=q30(1-o.attack/o.attackMax),n=o.combo||1,wind=clamp(t/.22),strike=easeOut(clamp((t-.18)/.38)),rec=clamp((t-.72)/.28),ext=Math.sin(strike*Math.PI)*64;z.rot=d*(wind*.05-strike*.08+rec*.03);if(n===1){z.ra=[d*12,-46,d*(18+ext),-43];z.la=[-d*12,-46,-d*(22+12*wind),-35]}if(n===2){z.la=[-d*12,-46,d*(13+ext),-55];z.ra=[d*12,-46,d*4,-30]}if(n===3){z.ra=[d*12,-45,d*(18+ext*.82),-24];z.bodyX=d*9*strike;z.ll=[-12,-18,-d*24,0]}if(n===4){z.ra=[d*12,-47,d*(20+ext),-66];z.ll=[-10,-18,-d*18,0];z.rl=[10,-18,d*(20+ext*.38),-9];z.bodyY=-61}}
 if(o.techAnim>0){const t=q30(1-o.techAnim/o.techMax),cast=ease(clamp((t-.1)/.55));z.bodyX=-d*7+d*12*cast;z.ra=[d*10,-48,d*(18+32*cast),-61+21*cast];z.la=[-d*10,-48,-d*(18+14*cast),-63+12*cast];z.rot=-d*.055+d*.095*cast}
 if(o.domainAnim>0){const t=q30(1-o.domainAnim/o.domainMax),s=Math.sin(t*Math.PI*4)*.8;z.bodyY=-58;z.headY=-90;z.la=[-d*8,-49,-6+s*3,-68];z.ra=[d*8,-49,6-s*3,-68];z.ll=[-13,-18,-22,0];z.rl=[13,-18,22,0];z.rot=Math.sin(t*18)*.012}
 return z}

function hair(id,bx,hy,o){const sway=Math.sin(q30(time)*3.2)*((Math.abs(o.vx)>20)?2.2:1.1);hy+=sway;
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
 if(id==="honored"){ctx.strokeStyle="#202228";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-13,-56);ctx.lineTo(-18,-18);ctx.moveTo(13,-56);ctx.lineTo(18,-18);ctx.stroke()}
 if(id==="shadow"||id==="meguna"){ctx.fillStyle="#0b0d12";ctx.beginPath();ctx.ellipse(0,2,22,5,0,0,Math.PI*2);ctx.fill()}
 if(id==="blood"){ctx.strokeStyle="#e7e7e7";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-14,-44);ctx.lineTo(14,-44);ctx.stroke()}
 if(id==="copycat"){ctx.strokeStyle="#ddd";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-15,-42);ctx.lineTo(15,-42);ctx.stroke()}
 if(id==="nail"){ctx.strokeStyle="#5a3a32";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-15,-42);ctx.lineTo(15,-42);ctx.stroke()}
 if(id==="takaba"){ctx.fillStyle="#ffdd4d";ctx.beginPath();ctx.arc(-12,-42,4,0,Math.PI*2);ctx.fill()}
 if(id==="geto"){ctx.strokeStyle="#2d3038";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,-51);ctx.lineTo(-25,-28);ctx.moveTo(18,-51);ctx.lineTo(25,-28);ctx.stroke()}
 if(id==="larue"){ctx.strokeStyle="#f0b0d8";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-46,14,0,Math.PI);ctx.stroke()}
 if(id==="yuka"){ctx.strokeStyle="#6179ff";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-14,-46);ctx.lineTo(14,-32);ctx.stroke()}
 if(id==="tsurugi"){ctx.strokeStyle="#d8dde8";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-d*16,-34);ctx.lineTo(-d*42,-5);ctx.stroke()}
 if(id==="maru"||id==="cross"){ctx.strokeStyle=id==="maru"?"#70e6d1":"#5cd0e8";ctx.lineWidth=3;ctx.beginPath();ctx.arc(z.bodyX,z.headY-9,5,0,Math.PI*2);ctx.stroke()}
 if(id==="dabura"){ctx.strokeStyle="#ffe36f";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-48,18,0,Math.PI*2);ctx.stroke()}
 if(id==="usami"){ctx.strokeStyle="#9dc8ff";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-15,-50);ctx.lineTo(15,-30);ctx.stroke()}
 if(id==="jabaloma"){ctx.strokeStyle="#ff9f68";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-17,-44);ctx.lineTo(17,-44);ctx.stroke()}
 if(id==="kyoko"){ctx.strokeStyle="#e690ff";ctx.lineWidth=2;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*8,-52);ctx.lineTo(i*13,-22);ctx.stroke()}}
 if(id==="dapa"||id==="osuki"){ctx.strokeStyle=id==="dapa"?"#7ef0a5":"#ffb86a";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-45,15,0,Math.PI*2);ctx.stroke()}
 if(id==="modulo"){
   ctx.strokeStyle="#b1182b";ctx.lineWidth=10;ctx.beginPath();ctx.arc(z.bodyX,z.headY+2,25,Math.PI*1.02,Math.PI*1.98);ctx.stroke();
   ctx.strokeStyle="#22242b";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(z.bodyX-18,z.headY+13);ctx.lineTo(z.bodyX-14,-42);ctx.moveTo(z.bodyX+18,z.headY+13);ctx.lineTo(z.bodyX+14,-42);ctx.stroke();
   ctx.strokeStyle="#ff2a3d";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-15,-46);ctx.lineTo(15,-31);ctx.stroke();
 }
}
function fighter(o,f=cur()){const id=f.id,z=pose(o,id),d=o.face;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(z.rot);ctx.lineCap="round";ctx.lineJoin="round";
 if(o.domainActive>0){ctx.strokeStyle=f.accent;ctx.globalAlpha=.22+.1*Math.sin(time*11);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-56,52+Math.sin(time*7)*6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}
 ctx.strokeStyle=f.body;ctx.lineWidth=id==="honored"?12:9;ctx.beginPath();ctx.moveTo(z.bodyX,z.bodyY);ctx.lineTo(z.bodyX,-20);ctx.stroke();
 const leftLegFront=z.ll[2]>z.rl[2],backLeg=leftLegFront?z.rl:z.ll,frontLeg=leftLegFront?z.ll:z.rl;
 const leftArmFront=z.la[2]>z.ra[2],backArm=leftArmFront?z.ra:z.la,frontArm=leftArmFront?z.la:z.ra;
 limb(z.bodyX,-20,backLeg[0]+z.bodyX,backLeg[1],backLeg[2]+z.bodyX,backLeg[3],7,f.body);
 limb(z.bodyX,-49,backArm[0]+z.bodyX,backArm[1],backArm[2]+z.bodyX,backArm[3],7,f.body);
 outfitExtras(id,z,d);
 ctx.fillStyle="#0f1116";ctx.beginPath();ctx.arc(z.bodyX,z.headY,18,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#0f1116";ctx.lineWidth=3;ctx.stroke();hair(id,z.bodyX,z.headY,o);
 limb(z.bodyX,-49,frontArm[0]+z.bodyX,frontArm[1],frontArm[2]+z.bodyX,frontArm[3],7,f.body);
 limb(z.bodyX,-20,frontLeg[0]+z.bodyX,frontLeg[1],frontLeg[2]+z.bodyX,frontLeg[3],7,f.body);
 if(o.blockBlend>.1){ctx.strokeStyle=f.accent;ctx.globalAlpha=.3+.2*o.blockBlend;ctx.lineWidth=2+o.blockBlend*2;ctx.beginPath();ctx.arc(d*25,-50,31,-1.15,1.15);ctx.stroke();ctx.globalAlpha=1}
 if(o===p&&o.techAnim>0)drawTechCharge(id,z,d,1-o.techAnim/o.techMax);
 ctx.restore()}
function drawTechCharge(id,z,d,t){
 const move=cur().techs[techIndex],tc=techniqueColor(move,id),s=easeOut(t),pulse=.7+.3*Math.sin(time*22);
 ctx.save();ctx.globalAlpha=clamp(t*2);ctx.strokeStyle=tc;ctx.fillStyle=tc;ctx.lineWidth=2.5;

 const slashMoves=["DISMANTLE","CLEAVE","WORLD CUT","DISMANTLE Ω","CLEAVE Ω","WORLD CUT Ω","DRAW CUT","EVENING MOON","SPLIT STRIKE","NAIL SHOT"];
 const beamMoves=["BLUE","RED","HOLLOW","BEAM","PIERCING BLOOD","HOMING PIERCING BLOOD","TRUMPET LIGHT","JACOB","SPIRIT BLAST"];
 const summonMoves=["DIVINE DOGS","NUE","RABBIT ESCAPE","TEN SHADOWS","CURSE SWARM","RING CALL","HORN","DRAGON"];
 const rushMoves=["RUSH","JACKPOT RUSH","RHYTHM STEP","AIR STEP","STEP","BOOGIE"];
 const burstMoves=["SUPER NOVA","SOUL BURST","UZUMAKI","GRAVITY","GAG IMPACT","CRUSH","DIVINE FLAME","DIVINE FLAME Ω","BLACK FLASH"];

 if(move==="HOLLOW"){
   ctx.globalAlpha=.9;
   ctx.beginPath();ctx.arc(d*(42+24*s),-50,10+22*s,0,Math.PI*2);ctx.stroke();
   ctx.globalAlpha=.32;ctx.beginPath();ctx.arc(d*(42+24*s),-50,20+34*s,0,Math.PI*2);ctx.fill();
 }else if(move==="BLUE"){
   for(let i=0;i<3;i++){ctx.globalAlpha=.65-i*.14;ctx.beginPath();ctx.arc(d*(40+15*s),-50,8+s*(12+i*7),0,Math.PI*2);ctx.stroke()}
 }else if(move==="RED"){
   ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(d*(42+18*s),-49,8+18*s*pulse,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=.32;ctx.beginPath();ctx.arc(d*(42+18*s),-49,20+28*s,0,Math.PI*2);ctx.stroke();
 }else if(slashMoves.includes(move)){
   ctx.globalAlpha=.8;
   for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(d*(10+i*8),-68+i*13);ctx.lineTo(d*(55+34*s+i*10),-38+i*7);ctx.stroke()}
 }else if(beamMoves.includes(move)){
   ctx.globalAlpha=.7;
   ctx.beginPath();ctx.arc(d*(40+15*s),-50,6+10*s,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=.35;
   for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(d*20,-62+i*8);ctx.lineTo(d*(60+45*s),-62+i*8);ctx.stroke()}
 }else if(summonMoves.includes(move)){
   ctx.globalAlpha=.42;ctx.beginPath();ctx.ellipse(0,1,26+64*s,7+13*s,0,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=.8;
   for(let i=0;i<5;i++){ctx.beginPath();ctx.arc((i-2)*12,-12-Math.sin(time*5+i)*6,3+i%2*2,0,Math.PI*2);ctx.stroke()}
 }else if(rushMoves.includes(move)){
   ctx.globalAlpha=.65;
   for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-d*(8+i*8),-70+i*10);ctx.lineTo(-d*(42+36*s+i*7),-70+i*10);ctx.stroke()}
 }else if(burstMoves.includes(move)){
   ctx.globalAlpha=.5;
   for(let i=0;i<8;i++){const a=i*Math.PI/4+time*2;ctx.beginPath();ctx.moveTo(d*26,-48);ctx.lineTo(d*26+Math.cos(a)*(18+35*s),-48+Math.sin(a)*(18+35*s));ctx.stroke()}
   ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(d*26,-48,7+12*s*pulse,0,Math.PI*2);ctx.fill();
 }else if(move==="ROPE SNARE"||move==="HEART CATCH"){
   ctx.globalAlpha=.7;
   ctx.beginPath();ctx.moveTo(d*10,-45);ctx.bezierCurveTo(d*25,-72,d*52,-18,d*(70+25*s),-50);ctx.stroke();
   ctx.beginPath();ctx.moveTo(d*12,-38);ctx.bezierCurveTo(d*30,-12,d*55,-78,d*(72+22*s),-42);ctx.stroke();
 }else if(move==="STOP"||move==="BLAST AWAY"||move==="CONFISCATION"||move==="GAVEL"){
   ctx.globalAlpha=.7;ctx.strokeRect(d*18,-67,d*(28+24*s),26+8*s);
 }else{
   ctx.globalAlpha=.65;
   for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(d*(34+15*s),-48,7+i*5+s*5,0,Math.PI*2);ctx.stroke()}
 }
 ctx.restore();
}
function dummy(o){ctx.save();ctx.translate(o.x,o.y);ctx.lineCap="round";ctx.strokeStyle=o.hit>0?"#555":"#171717";ctx.lineWidth=7;const recoil=o.hit>0?Math.sin(o.hit*30)*14:0;ctx.rotate(recoil*.013);ctx.beginPath();ctx.arc(0,-82,18,0,Math.PI*2);ctx.moveTo(0,-64);ctx.lineTo(recoil,-20);ctx.moveTo(recoil,-20);ctx.lineTo(-19,0);ctx.moveTo(recoil,-20);ctx.lineTo(22,0);ctx.moveTo(0,-54);ctx.lineTo(-24,-34);ctx.moveTo(0,-54);ctx.lineTo(24,-34);ctx.stroke();ctx.restore()}

function drawStage(){
 if(p.domainActive>0){if(customDomainActive&&customDomain)drawCustomDomainStage();else drawDomainStage(cur().id);return}
 if(stageId==="school"){
   const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#9fb8c8");g.addColorStop(.58,"#d7ddd9");g.addColorStop(.59,"#76806f");g.addColorStop(1,"#4a5149");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
   ctx.fillStyle="#5e665b";for(let i=0;i<7;i++)ctx.fillRect(i*170,H*.42,110,ground()-H*.42);ctx.strokeStyle="#d9ded8";for(let i=0;i<W;i+=70){ctx.beginPath();ctx.moveTo(i,H*.42);ctx.lineTo(i,ground());ctx.stroke()}ctx.fillStyle="#363b36";ctx.fillRect(0,ground()+2,W,4);return
 }
 if(stageId==="subway"){
   ctx.fillStyle="#d8d2c6";ctx.fillRect(0,0,W,H);ctx.fillStyle="#44464b";ctx.fillRect(0,H*.18,W,H*.14);ctx.fillStyle="#6b6f74";for(let i=0;i<W;i+=120)ctx.fillRect(i,0,10,ground());ctx.fillStyle="#31343a";ctx.fillRect(0,ground()+2,W,4);return
 }
 if(stageId==="rooftop"){
   const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#8aa0b8");g.addColorStop(1,"#d3d9df");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle="#7d838b";for(let i=0;i<9;i++)ctx.fillRect(i*140,H*.5-(i%3)*30,95,ground()-H*.5+(i%3)*30);ctx.fillStyle="#34383e";ctx.fillRect(0,ground()+2,W,4);return
 }
 if(stageId==="shrine"){
   const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2a2024");g.addColorStop(1,"#69433f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.strokeStyle="#b74242";ctx.lineWidth=8;for(let i=0;i<6;i++){const x=70+i*170;ctx.beginPath();ctx.moveTo(x,H*.24);ctx.lineTo(x,ground());ctx.moveTo(x-35,H*.3);ctx.lineTo(x+35,H*.3);ctx.stroke()}ctx.fillStyle="#251d1c";ctx.fillRect(0,ground()+2,W,4);return
 }
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#e2e6eb");sky.addColorStop(.48,"#bcc2c8");sky.addColorStop(.55,"#8b9097");sky.addColorStop(1,"#595e65");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 // distant skyline
 ctx.globalAlpha=.34;ctx.fillStyle="#798089";
 for(let i=0;i<14;i++){const bw=34+(i%4)*12,bh=45+(i%5)*24,bx=(i*97-time*3)% (W+120)-40;ctx.fillRect(bx,H*.54-bh,bw,bh)}
 ctx.globalAlpha=.68;ctx.fillStyle="#6a7078";
 for(let i=0;i<9;i++){const bw=45+(i%3)*15,bh=64+(i%4)*34,bx=(i*151+38-time*7)% (W+180)-60;ctx.fillRect(bx,H*.57-bh,bw,bh);ctx.fillStyle="#9aa0a6";for(let wy=0;wy<bh-18;wy+=16)for(let wx=8;wx<bw-8;wx+=14){ctx.globalAlpha=.12;ctx.fillRect(bx+wx,H*.57-bh+10+wy,5,7)}ctx.globalAlpha=.68;ctx.fillStyle="#6a7078"}
 ctx.globalAlpha=1;
 // street / plaza perspective
 const road=ctx.createLinearGradient(0,H*.55,0,H);road.addColorStop(0,"#868b91");road.addColorStop(1,"#555a60");ctx.fillStyle=road;ctx.fillRect(0,H*.55,W,H*.45);
 ctx.strokeStyle="#6a6f76";ctx.lineWidth=1;
 for(let y=H*.61;y<H;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 for(let i=-6;i<12;i++){ctx.beginPath();ctx.moveTo(W*.5,H*.55);ctx.lineTo(i*110,H);ctx.stroke()}
 // subtle reflection / combat floor highlight
 const rg=ctx.createRadialGradient(W*.5,ground(),20,W*.5,ground(),W*.55);rg.addColorStop(0,"#d8dde01e");rg.addColorStop(1,"#00000000");ctx.fillStyle=rg;ctx.fillRect(0,H*.55,W,H*.45);
 ctx.fillStyle="#3f444a";ctx.fillRect(0,ground()+2,W,4);
 // atmospheric lines
 ctx.globalAlpha=.12;ctx.strokeStyle="#fff";for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo((i*173+time*11)%W,0);ctx.lineTo((i*173+90+time*11)%W,H*.5);ctx.stroke()}ctx.globalAlpha=1
}
function drawCustomDomainStage(){
 const c=customDomain?.color||"#ff3049",style=customDomain?.style||"rings";ctx.fillStyle="#050508";ctx.fillRect(0,0,W,H);ctx.strokeStyle=c;ctx.fillStyle=c;
 if(style==="rings"){ctx.globalAlpha=.3;for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(W*.5,H*.45,40+i*34+Math.sin(time*2+i)*8,0,Math.PI*2);ctx.stroke()}}
 else if(style==="slashes"){ctx.globalAlpha=.36;for(let i=0;i<20;i++){ctx.beginPath();ctx.moveTo((i*83+time*60)%W,0);ctx.lineTo(W-(i*57)%W,H);ctx.stroke()}}
 else if(style==="void"){const g=ctx.createRadialGradient(W*.5,H*.45,20,W*.5,H*.45,Math.max(W,H));g.addColorStop(0,c+"88");g.addColorStop(.35,"#11111a");g.addColorStop(1,"#010102");ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 else{ctx.globalAlpha=.32;for(let i=0;i<7;i++){const x=70+i*160;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x,H*.22);ctx.lineTo(x,ground());ctx.moveTo(x-36,H*.3);ctx.lineTo(x+36,H*.3);ctx.stroke()}}
 ctx.globalAlpha=1;ctx.fillStyle="#111";ctx.fillRect(0,ground()+2,W,4)
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
 else if(id==="modulo"){ctx.fillStyle="#030305";ctx.fillRect(0,0,W,H);ctx.strokeStyle="#ff182f";ctx.globalAlpha=.42;for(let i=0;i<22;i++){ctx.beginPath();ctx.moveTo((i*67+time*40)%W,0);ctx.lineTo(W-(i*91)%W,H);ctx.stroke()}ctx.globalAlpha=1}
 else if(["heavenly","swordsman","medium","angel","speaker","nail","rhythm","miguel","takaba","geto","larue"].includes(id)){
   const palettes={heavenly:["#07110f","#76d7b5"],swordsman:["#08101c","#79a7ff"],medium:["#160e08","#d3925b"],angel:["#15130a","#fff0a6"],speaker:["#0d1016","#b7c1d8"],nail:["#170d11","#e6a7b6"],rhythm:["#171006","#ffbd6b"],miguel:["#160e08","#e5a96e"],takaba:["#171405","#ffdd4d"],geto:["#0d0a12","#5d4e73"],larue:["#160b13","#d57ab6"]},pal=palettes[id];
   ctx.fillStyle=pal[0];ctx.fillRect(0,0,W,H);ctx.strokeStyle=pal[1];ctx.globalAlpha=.24;
   for(let i=0;i<18;i++){ctx.beginPath();ctx.arc((i*89+time*18)%W,(i*57)%H,18+(i%4)*7,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1;
 }
 else{ctx.fillStyle=id==="switcher"?"#171407":"#17080b";ctx.fillRect(0,0,W,H);ctx.strokeStyle=f.accent;ctx.globalAlpha=.25;for(let i=0;i<W;i+=65){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+80,H);ctx.stroke()}ctx.globalAlpha=1}
 ctx.fillStyle="#111";ctx.fillRect(0,ground()+2,W,4)
}
function drawDomainOpening(){if(p.domainAnim<=0)return;const t=1-p.domainAnim/p.domainMax,qt=q30(t),f=cur(),id=f.id;ctx.save();const cx=p.x,cy=p.y-58;
 // cinematic crop and zoom feeling
 ctx.fillStyle="rgba(0,0,0,"+clamp(qt*1.7,0,.78)+")";ctx.fillRect(0,0,W,H);
 const bar=Math.max(0,(1-Math.abs(qt-.52)*2))*H*.095;ctx.fillStyle="#000";ctx.fillRect(0,0,W,bar);ctx.fillRect(0,H-bar,W,bar);
 // barrier shock ring
 if(qt>.08){ctx.strokeStyle=f.accent;ctx.lineWidth=2+qt*12;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(cx,cy,24+easeOut(qt)*Math.max(W,H),0,Math.PI*2);ctx.stroke()}
 // character-specific symbols / motifs
 ctx.globalAlpha=.34;ctx.strokeStyle=f.accent;ctx.fillStyle=f.accent;ctx.lineWidth=2.5;
 if(id==="honored"){for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(cx,cy,35+i*22+qt*25,0,Math.PI*2);ctx.stroke()}}
 else if(id==="shadow"||id==="meguna"){for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(cx+Math.cos(i)*90*qt,cy+45+Math.sin(i*1.6)*26,30+qt*35,8+qt*12,0,0,Math.PI*2);ctx.fill()}}
 else if(["sukuna","heian","king"].includes(id)){for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(cx-180,cy-90+i*28);ctx.lineTo(cx+200,cy+95-i*22);ctx.stroke()}}
 else if(id==="judge"){ctx.strokeRect(cx-78,cy-70,156,110);ctx.beginPath();ctx.moveTo(cx-45,cy-40);ctx.lineTo(cx+45,cy-40);ctx.moveTo(cx,cy-40);ctx.lineTo(cx,cy+38);ctx.stroke()}
 else if(id==="gambler"){for(let i=0;i<8;i++){ctx.strokeRect(cx-120+i*32,cy-40+Math.sin(i)*14,22,36)}}
 else if(id==="blood"){for(let i=0;i<9;i++){ctx.beginPath();ctx.arc(cx+Math.cos(i*.8)*110*qt,cy+Math.sin(i*.8)*70*qt,8+i%3*4,0,Math.PI*2);ctx.fill()}}
 else if(id==="ice"){for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(i*.63)*190,cy+Math.sin(i*.63)*190);ctx.stroke()}}
 else if(id==="angel"){for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(cx,cy-20,40+i*18,Math.PI*1.05,Math.PI*1.95);ctx.stroke()}}
 else if(id==="takaba"){for(let i=0;i<6;i++){ctx.strokeRect(cx-120+i*45,cy-65+(i%2)*36,30,24)}}
 else if(id==="larue"){for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(cx-80+i*40,cy+30);ctx.bezierCurveTo(cx-110+i*40,cy-10,cx-30+i*40,cy-20,cx-80+i*40,cy-70);ctx.stroke()}}
 else if(id==="modulo"){ctx.globalAlpha=.58;for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(cx-220,cy-120+i*22);ctx.lineTo(cx+260,cy+110-i*19);ctx.stroke()}ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(cx,cy,50+qt*90,0,Math.PI*2);ctx.stroke()}
 else{for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(cx+Math.cos(i*1.7)*qt*150,cy+Math.sin(i*2.1)*qt*95,10+qt*22,0,Math.PI*2);ctx.stroke()}}
 // white impact spokes near full open
 if(qt>.58){ctx.globalAlpha=.5;ctx.strokeStyle="#fff";ctx.lineWidth=1;for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(i*.52)*W,cy+Math.sin(i*.52)*H);ctx.stroke()}}
 // quick inverse frame
 if(qt>.47&&qt<.54){ctx.globalAlpha=.16;ctx.fillStyle="#fff";ctx.fillRect(0,0,W,H)}
 ctx.restore()}

function cpuTechnique(){
 if(cpuTechCooldown>0||cpuLevel<2||e.hp<=0||p.hp<=0)return;
 const f=enemyCur(),move=f.techs[Math.floor(Math.random()*f.techs.length)],col=techniqueColor(move,f.id),dist=Math.abs(p.x-e.x);
 cpuTechCooldown=cpuLevel===3?2.1:3.4;e.techAnim=.55;burst(e.x,e.y-52,24,"techColor",3,col);
 setTimeout(()=>{
  if(gameState!=="play"||e.hp<=0)return;
  if(/BOOGIE|SPACE SHIFT|SCENE CHANGE/.test(move)){const old=e.x;e.x=p.x+e.face*80;p.x=old;burst(e.x,e.y-50,24,"techColor",3,col);return}
  if(/GRAVITY/.test(move)){p.vy=-420;p.vx*=.25;hitPlayer(10+cpuLevel*3,260,520);return}
  if(/RABBIT|DOORS|CURSE SWARM|DIVINE DOGS|MAHORAGA/.test(move)){hitPlayer(11+cpuLevel*3,420,430);burst(p.x,p.y-45,42,"shadow",3);return}
  if(/BLUE/.test(move)){p.vx+=(e.x-p.x)*2.2;hitPlayer(12+cpuLevel*3,240,520);return}
  if(/RED|BLAST AWAY|DIVINE FLAME|LIGHT BEAM|BEAM/.test(move)){hitPlayer(13+cpuLevel*4,760,560);burst(p.x,p.y-52,48,"techColor",4,col);return}
  if(/BLOOD|SHOT|JACOB|UZUMAKI|DISMANTLE|WORLD CUT|THREAD|ROLLUCA|CHAOS|HARMONY/.test(move)){hitPlayer(12+cpuLevel*4,600,600);burst(p.x,p.y-52,40,"techColor",3,col);return}
  if(dist<250)hitPlayer(10+cpuLevel*4,520,250);
 },240)
}
function update(dt){time+=dt;if(stagePulse>0)stagePulse=Math.max(0,stagePulse-dt*1.6);if(customCooldown>0)customCooldown=Math.max(0,customCooldown-dt);if(cpuTechCooldown>0)cpuTechCooldown=Math.max(0,cpuTechCooldown-dt);if(gameState!=="play")return;if(gameMode==="sandbox"){if(sandbox.hp)p.hp=100;if(sandbox.ce)p.ce=100;if(sandbox.aw){p.aw=100;p.awakened=true}if(sandbox.domain&&p.awakened){p.ce=100;if(p.domainActive>0)p.domainActive=Math.max(p.domainActive,7.8)}if(sandbox.dummyMove&&e.hit<=0){const target=W*.68+Math.sin(time*.8)*W*.16;e.vx+=(target-e.x)*dt*4}}if(gameMode==="battle"&&cpuLevel>0&&e.hp>0&&p.hp>0){
   const dist=p.x-e.x;e.face=dist<0?-1:1;
   const ad=Math.abs(dist),spd=cpuLevel===3?1500:cpuLevel===2?1150:850;
   if(ad>115&&e.attack<=0){e.vx+=Math.sign(dist)*spd*dt}
   if(ad<125&&e.attack<=0&&Math.random()<dt*(1.4+cpuLevel*.7)){e.attack=.32;setTimeout(()=>{if(e.attack>0)hitPlayer(5+cpuLevel*3,260+cpuLevel*90,135)},105)}
   e.attack=Math.max(0,e.attack-dt);e.blockBlend+=((e.block?1:0)-e.blockBlend)*Math.min(1,dt*18);
   if(cpuLevel>=2&&ad<190&&Math.random()<dt*.7)e.block=Math.random()<.55;else if(Math.random()<dt*2)e.block=false;
   if(cpuLevel>=2&&Math.random()<dt*(cpuLevel===3?.7:.38))cpuTechnique();
 }
 if(toastT>0){toastT-=dt;if(toastT<=0)ui.toast.classList.remove("show")}if(p.hitstop>0){p.hitstop-=dt;return}
 const locked=p.domainAnim>0,move=(key.right?1:0)-(key.left?1:0),speedMul=customDomainActive&&p.domainActive>0&&customDomain?.buff==="speed"?1.45:1;if(move&&!p.block&&p.attack<=0&&p.techAnim<=0&&!locked){p.face=move;p.vx+=move*1850*speedMul*dt}p.vx=Math.max(-350,Math.min(350,p.vx));p.block=key.block||p.block;p.blockBlend+=((p.block?1:0)-p.blockBlend)*Math.min(1,dt*20);
 p.attack=Math.max(0,p.attack-dt);p.comboT=Math.max(0,p.comboT-dt);p.dash=Math.max(0,p.dash-dt);p.land=Math.max(0,p.land-dt);p.techAnim=Math.max(0,p.techAnim-dt);p.domainAnim=Math.max(0,p.domainAnim-dt);p.domainActive=Math.max(0,p.domainActive-dt);e.hit=Math.max(0,e.hit-dt);let regen=(p.awakened?5.5:9);if(customDomain&&p.domainActive>0&&customDomain.buff==="ce")regen*=2.4;p.ce=Math.min(100,p.ce+regen*dt);
 if(customDomainActive&&p.domainActive>0&&customDomain){
   domainPulseT-=dt;if(domainPulseT<=0){domainPulseT=.8;
    if(customDomain.sureHit==="pulse"){for(const t of activeTargets()){if(t.hp>0){t.hp=Math.max(0,t.hp-3);burst(t.x,t.y-48,12,"domain",2,customDomain.color)}}}
    else if(customDomain.sureHit==="snare"){for(const t of activeTargets())t.vx*=.15}
    else if(customDomain.sureHit==="drain"&&gameMode==="battle"){e.ce=Math.max(0,e.ce-8)}
   }
 }
 physics(p,dt);physics(e,dt);if(gameMode==="sandbox"){for(const d of extraDummies.slice(0,Math.max(0,sandbox.dummyCount-1))){physics(d,dt);d.hit=Math.max(0,d.hit-dt);d.hp=Math.min(d.hp,sandbox.dummyMaxHp)}e.hp=Math.min(e.hp,sandbox.dummyMaxHp);}if(p.domainAnim<=0)ui.cinema.classList.remove("show");
 if(!matchOver&&(p.hp<=0||e.hp<=0)){matchOver=true;gameState="menu";const win=e.hp<=0;$("matchEndTitle").textContent=win?"YOU WIN":"KO";$("matchEndSub").textContent=win?enemyCur().name+" DEFEATED":cur().name+" DEFEATED";$("matchEnd").classList.add("show");key.left=key.right=key.block=false}
 for(let i=stageScars.length-1;i>=0;i--){stageScars[i].l-=dt;if(stageScars[i].l<=0)stageScars.splice(i,1)}
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.l-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.94;f.vy+=(f.type==="dust"?100:340)*dt;if(f.l<=0)fx.splice(i,1)}
 $("pHP").style.width=p.hp+"%";$("eHP").style.width=e.hp+"%";$("ce").style.width=p.ce+"%";$("aw").style.width=p.aw+"%";$("ceText").textContent=Math.round(p.ce);$("awText").textContent=p.awakened?"CT UNLOCKED":Math.round(p.aw)+"%";
 ui.tech.className="tech "+(p.awakened?"active":p.aw>=100?"ready":"locked");ui.tech.textContent=p.awakened?cur().techs[techIndex]:p.aw>=100?"AWAKEN":"CT LOCKED";if(p.awakened){const tc=techniqueColor(cur().techs[techIndex]);ui.tech.style.borderColor=tc;ui.tech.style.color=tc;ui.tech.style.boxShadow="0 0 20px "+tc+"66"}else{ui.tech.style.borderColor="";ui.tech.style.color="";ui.tech.style.boxShadow=""};
 ui.swap.textContent=p.awakened?"NEXT CT":"CT "+cur().techs.length;ui.domain.className="domain "+(p.domainActive>0?"active":p.awakened&&p.ce>=80&&cur().domain!=="NO DOMAIN"?"ready":"");ui.domain.textContent=p.domainActive>0?"DOMAIN ACTIVE":"DOMAIN";
 ui.evolve.style.display=sukunaChain.includes(cur().id)?"":"none";ui.mode.textContent=p.domainActive>0?"DOMAIN":gameMode==="sandbox"?"SANDBOX":"BATTLE";
}
function drawPreview(){
 const pc=$("previewCanvas");if(!pc)return;const active=document.querySelector('.menuCard[data-screen="select"].active');if(!active)return;
 const x=pc.getContext("2d"),f=roster[selectedIndex],w=pc.width,h=pc.height,t=time;x.clearRect(0,0,w,h);
 const g=x.createRadialGradient(w*.5,h*.42,20,w*.5,h*.42,w*.55);g.addColorStop(0,f.accent+"44");g.addColorStop(1,"#07080b");x.fillStyle=g;x.fillRect(0,0,w,h);
 x.save();x.translate(w*.5,h*.76);x.lineCap="round";x.lineJoin="round";const bob=Math.sin(t*2.4)*3;
 x.strokeStyle=f.body;x.lineWidth=12;x.beginPath();x.moveTo(0,-130+bob);x.lineTo(0,-55);x.stroke();
 x.lineWidth=9;x.beginPath();x.moveTo(0,-110+bob);x.lineTo(-38,-82+bob);x.lineTo(-55,-45+bob);x.moveTo(0,-110+bob);x.lineTo(38,-88+bob);x.lineTo(52,-58+bob);x.moveTo(0,-55);x.lineTo(-24,-15);x.lineTo(-34,25);x.moveTo(0,-55);x.lineTo(24,-15);x.lineTo(36,25);x.stroke();
 x.fillStyle="#0f1116";x.beginPath();x.arc(0,-160+bob,28,0,Math.PI*2);x.fill();
 x.fillStyle=f.accent;x.beginPath();x.moveTo(-28,-169+bob);for(let i=0;i<9;i++)x.lineTo(-28+i*7,-186-(i%2)*18+bob);x.lineTo(28,-168+bob);x.closePath();x.fill();
 if(f.id==="modulo"){x.strokeStyle="#b1182b";x.lineWidth=14;x.beginPath();x.arc(0,-157+bob,39,Math.PI*1.05,Math.PI*1.95);x.stroke()}
 if(/DRAW|BATTO|CHAIN|SWORD/.test(f.techs.join(" "))||["swordsman","tsurugi","killer"].includes(f.id)){x.strokeStyle="#d9dde8";x.lineWidth=6;x.beginPath();x.moveTo(35,-90+bob);x.lineTo(78,-28);x.stroke()}
 x.strokeStyle=f.accent;x.globalAlpha=.55;x.lineWidth=3;x.beginPath();x.arc(0,-105,70+Math.sin(t*3)*8,0,Math.PI*2);x.stroke();x.restore();
 $("previewName").textContent=f.name;$("previewDomain").textContent=f.domain;
}
function draw(){ctx.save();if(cinemaZoom>1.001){ctx.translate(W*.5,H*.5);ctx.scale(cinemaZoom,cinemaZoom);ctx.translate(-W*.5,-H*.5);cinemaZoom+=(1-cinemaZoom)*.08}if(shake>.2){ctx.translate((Math.random()-.5)*shake*settings.shake,(Math.random()-.5)*shake*settings.shake);shake*=.82}drawStage();
 for(const f of fx){ctx.globalAlpha=Math.max(0,f.l/f.max);const col=f.color||{aw:"#ed2445",dust:"#d7d7d7",hit:"#161616",impact:"#fff",blue:"#45b9ff",red:"#ff4058",hollow:"#d9b9ff",shadow:"#121722",lightning:"#6be8ff",rabbit:"#eee",gold:"#d5b75d",green:"#55ff9f",blood:"#b51f38",steel:"#8aa0a6",soul:"#8e7cff",domain:cur().accent,switch:"#55c9ff",slash:"#f1f1ff",custom:customTech?customTech.color:"#8f6cff",techColor:cur().accent}[f.type]||cur().accent;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=f.size||2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x-f.vx*.04,f.y-f.vy*.04);ctx.stroke()}
 ctx.globalAlpha=1;fighter(p,cur());if(gameMode==="battle")fighter(e,enemyCur());else{dummy(e);for(const d of extraDummies.slice(0,Math.max(0,sandbox.dummyCount-1)))dummy(d)}
 if(p.domainActive<=0&&stageScars.length){ctx.save();ctx.strokeStyle="#2f3338";ctx.lineWidth=2;for(const sc of stageScars){ctx.globalAlpha=Math.min(.55,sc.l/sc.max);for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(sc.x,sc.y);ctx.lineTo(sc.x+Math.cos(i*1.26)*sc.r*(1+i*.22),sc.y-Math.sin(i*1.26)*sc.r*.45);ctx.stroke()}}ctx.restore()}
 if(gameMode==="sandbox"&&sandbox.hitboxes){ctx.save();ctx.lineWidth=2;ctx.strokeStyle="#57ff83";ctx.strokeRect(p.x-34,p.y-105,68,105);ctx.strokeStyle=sandbox.dummyBlock?"#ffd65a":"#ff596f";ctx.strokeRect(e.x-34,e.y-105,68,105);ctx.strokeStyle="#6bbcff";ctx.setLineDash([6,5]);ctx.strokeRect(Math.min(p.x,e.x),p.y-112,Math.abs(e.x-p.x),114);ctx.restore()}
 drawDomainOpening();ctx.restore();drawPreview()}
function loop(t){const dt=Math.min(.033,(t-last)/1000||0)*slowMo;last=t;update(dt);draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();