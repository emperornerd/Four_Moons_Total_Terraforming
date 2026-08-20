console.log('SCRIPT PARSE START');

const TILE=40,MAP_W=80,MAP_H=60,WORLD_W=MAP_W*TILE,WORLD_H=MAP_H*TILE;
const PLAYER_SPEED=3,NPC_SPEED=0.6,INTERACT_RANGE=48;
const TILE_COLORS={0:'#2a2e32',1:'#2a2e32',2:'#2a2e32',3:'#2a2e32',4:'#2a2e32'};

// ============================================================
// TUNING (see js/config.js for the editable values)
// ============================================================
const GAME_CONFIG=(window.GAME_CONFIG&&typeof window.GAME_CONFIG==='object')?window.GAME_CONFIG:{};
const AP_PER_DAY=(GAME_CONFIG.AP_PER_DAY==null||GAME_CONFIG.AP_PER_DAY<0)?3:Math.round(GAME_CONFIG.AP_PER_DAY);
// Make the title-screen / help AP readouts reflect the configured value
// immediately on page load (before the game starts), so the splash never
// shows the hardcoded fallback.
for(const id of ['ap-num-title','ap-num-help']){const el=document.getElementById(id);if(el)el.textContent=AP_PER_DAY;}
const TIME_SPEED=(GAME_CONFIG.TIME_SPEED==null)?1:Math.max(0.01,GAME_CONFIG.TIME_SPEED);
const BASE_FRAMES_PER_GAME_HOUR=600; // original speed before TIME_SPEED was introduced
const FRAMES_PER_GAME_HOUR=Math.round(BASE_FRAMES_PER_GAME_HOUR/(TIME_SPEED*2));

// Stat maxes (single source of truth — HUD bar scaling + clamping).
const STAT_MAXES=Object.assign({credits:500,approval:100,fear:100,loyalty:100,military:50,institutions:100,population:150,media:100},GAME_CONFIG.STAT_MAXES||{});
// Starting stat values.
const STARTING=Object.assign({credits:100,approval:25,fear:15,loyalty:30,military:25,institutions:90,population:120,media:30},GAME_CONFIG.STARTING||{});
// Stat display metadata (icon/label/desc) for the Stats & Goals window.
const STAT_INFO=Object.assign({},GAME_CONFIG.STAT_INFO||{});

// Lose-condition thresholds.
const LOSE=Object.assign({bankruptcy:-150,bankruptcyClamp:-200,approvalFearFloor:20,legalOverload:200,legalOverloadCount:5},GAME_CONFIG.LOSE||{});
// Military overthrow danger tuning.
const MILITARY=Object.assign({dangerZoneBelow:10,chanceAtDanger:2,chanceAtMin:40,chanceAtZero:50,fearBaseline:null,modifierCap:0.5,rollEveryHours:1,warnBelow:5,warnEveryHours:2,coupInPhase4:true,messages:{}},GAME_CONFIG.MILITARY||{});
// Daily upkeep tuning.
const UPKEEP=Object.assign({base:5,militaryDiv:5,loyaltyFloor:30,loyaltyDiv:5,fearFloor:40,fearDiv:10},GAME_CONFIG.UPKEEP||{});
// Gargoyliani gauge tuning.
const GARGOYLIANI=Object.assign({max:100,billRate:0.3,flipFloor:50,flipMaxChance:95},GAME_CONFIG.GARGOYLIANI||{});
// Random-event cadence (frames, not scaled by TIME_SPEED).
const EVENT_CFG=Object.assign({intervalMin:2000,intervalMax:4000,doNothing:{defaultLabel:'Do Nothing (0 AP)',defaultPenalty:{approval:-2,loyalty:-1},buffering:{approval:'fear',fear:'fear',loyalty:'loyalty',military:'military',population:'fear',media:'approval',institutions:'approval'},rangeLow:0.34,rangeHigh:0.66,shiftHigh:1,shiftLow:1}},GAME_CONFIG.EVENT||{});
// "Do Nothing" event-response tuning (nested under EVENT in config).
const DO_NOTHING=Object.assign({label:'Do Nothing (0 AP)',defaultPenalty:{approval:-2,loyalty:-1},buffering:{approval:'fear',fear:'fear',loyalty:'loyalty',military:'military',population:'fear',media:'approval',institutions:'approval'},rangeLow:0.34,rangeHigh:0.66,shiftHigh:1,shiftLow:1},(EVENT_CFG&&EVENT_CFG.doNothing)||{});
// Institutional regeneration tuning.
const INSTITUTIONS=Object.assign({regenPerTick:1,regenEveryHours:4,regenStartPhase:2,regenCap:100},GAME_CONFIG.INSTITUTIONS||{});
// Media-pressure tuning (see config.js MEDIA).
const MEDIA=Object.assign({tickEveryHours:4,bufferFloor:30,bufferCeil:65,approvalDrain:1,fearDrain:1,approvalGain:1},GAME_CONFIG.MEDIA||{});
// Player legal-exposure tuning.
const LEGAL=Object.assign({noEventsDay1:true,exposureMax:250,dangerPct:75,eventIntervalMin:18000,eventIntervalMax:36000,phaseWeight:[0.5,0.5,1,1],upkeepPerSevPoint:2,sevLow:1,sevMed:2,sevHigh:3,settleCap:50,instFreqFloor:0.5,instFreqMax:4.0,instSeverityFloor:0.8,instSeverityMax:2.0,instCalmBelow:25,eventWeights:{exposure:1,seizure:1,ally:1,caseExpansion:1,warrant:1},crimeSpawnChance:{murder:0.85,deportation:0.8,suppression:0.55,swindling:0.45,election:0.6},crimeTemplates:{murder:['Civil Rights Complaint','Incitement Charges','Obstruction of Justice'],deportation:['Civil Rights Complaint','Incitement Charges'],suppression:['Obstruction of Justice','Perjury Allegation'],swindling:['Embezzlement Investigation','Bribery Indictment','Racketeering Probe','Tax Evasion Audit'],election:['Campaign Finance Violation','Bribery Indictment']}},GAME_CONFIG.LEGAL||{});
// NPC density.
const NPC_CFG=Object.assign({startingCount:46,maxCount:60,maxPerType:{}},GAME_CONFIG.NPC||{});

// ============================================================
// PHASES
// ============================================================
const PHASE_GOALS=GAME_CONFIG.PHASE_GOALS||{0:{approval:50,loyalty:35},1:{institutions:25},2:{population:50},3:{credits:500}};
const PHASES=[
  {name:'PHASE I — THE RETURN',goal:'Build approval to '+PHASE_GOALS[0].approval+'+ and loyalty to '+PHASE_GOALS[0].loyalty+'+',check:s=>s.approval>=PHASE_GOALS[0].approval&&s.loyalty>=PHASE_GOALS[0].loyalty,
   intro:'You are a loser. Not just any loser\u2014THE loser. You lost so badly that even Gargoyliani looks competent by comparison. You\u2019re standing in a parking lot on a dying asteroid that smells like regret and space-cheese. The establishment thinks you\u2019re finished. Your own party is already writing your obituary (and applying for your parking spot).'},
  {name:'PHASE II — THE UNDERMINING',goal:'Break institutions below '+PHASE_GOALS[1].institutions+'%',check:s=>s.institutions<=PHASE_GOALS[1].institutions,
   intro:'You\u2019re in power! Somehow. It\u2019s like giving a toddler the nuclear codes. The courts could stop you, the press could expose you, the military could coup you, and your own advisors are already selling tell-all books. Time to break everything before it breaks you.'},
  {name:'PHASE III — THE CLEANSING',goal:'Reduce population below '+PHASE_GOALS[2].population,check:s=>s.population<=PHASE_GOALS[2].population,
   intro:'The gloves are off, and so are the masks, the pretenses, and basic humanoid decency. It\u2019s purge time! Everyone who ever looked at you funny, everyone who knows too much, everyone with a suspicious glow\u2014they all gotta go. This isn\u2019t policy anymore. This is a very expensive tantrum.'},
  {name:'PHASE IV — THE CARVE-UP',goal:'SELL EVERYTHING to reach '+PHASE_GOALS[3].credits+'+ credits',check:s=>s.credits>=PHASE_GOALS[3].credits,
   intro:'No more pretending. You\u2019re not even trying to hide it anymore. The galaxy is a fire sale and everything must go! Sell the oceans, sell the air, sell the concept of gravity\u2014someone will buy it. Your friends get rich, you get richer, and everyone else gets a commemorative mug that says \u2018I Survived the Blovius Era (Barely).\u2019'},
];

// ============================================================
// CARVE-UP (Phase IV) — the assets you sell to your friends.
// Sell every one of them AND reach the credit goal to win.
// ============================================================
function soldAssetCount(){return CARVE_UP_ASSETS.filter(a=>soldAssets[a]===true).length;}
function allAssetsSold(){return CARVE_UP_ASSETS.every(a=>soldAssets[a]===true);}

// Blovius Rex's first-term low points, dredged up at the Four Moons Total
// Terraforming venue. Satirical at Rex's expense — a bucket of humiliations,
// each a clear, humiliating parallel to a real first-term low, skinned for Rex.
// Mechanical no-ops: pure flavor for the scene of the crime.
let rexMemoryIdx=-1;
function pickMemory(){
  let arr=REX_LOW_POINTS;
  // True random pick that never repeats the immediately previous memory.
  let idx;
  if(arr.length<=1){
    idx=0;
  }else{
    idx=Math.floor(Math.random()*arr.length);
    if(idx===rexMemoryIdx)idx=(idx+1)%arr.length;
  }
  rexMemoryIdx=idx;
  return arr[idx];
}

// ============================================================
// BUILDINGS
// ============================================================

// ============================================================
// NPC TYPES
// ============================================================

// Weighted random NPC-type pick (honors optional `weight` on each type; default 1).
function pickType(){
  let total=0;
  for(let t of NPC_TYPES)total+=(t.weight||1);
  let r=Math.random()*total;
  for(let t of NPC_TYPES){r-=(t.weight||1);if(r<=0)return t;}
  return NPC_TYPES[NPC_TYPES.length-1];
}

// Number of the given NPC type currently alive. Used to enforce per-type caps.
function countType(type){
  let c=0;
  for(let n of npcs)if(n.type===type)c++;
  return c;
}

// Is the given type already at its configured cap (NPC_CFG.maxPerType)?
// Types with no cap entry (or a null/false cap) are never "at cap".
function typeAtCap(def){
  let cap=NPC_CFG.maxPerType&&NPC_CFG.maxPerType[def.type];
  if(!cap)return false;
  return countType(def.type)>=cap;
}

// Weighted pick that skips types already at their per-type cap. Falls back to
// a normal pick if a non-capped type can't be found (safe guard).
function pickUncappedType(){
  for(let tries=0;tries<NPC_TYPES.length+5;tries++){
    let def=pickType();
    if(!typeAtCap(def))return def;
  }
  return pickType();
}

// ============================================================
// FAKE POLICIES (used by randomized events)
// Default content here acts as a fallback when data/fake_policies.js
// is absent; otherwise it is replaced at startup by buildRuntimeData().
// ============================================================
let FAKE_POLICIES=[
  {policy:'FREE MOONS FOR EVERYONE!',result:'The sheep cheer. Beautiful sheep. The policy doesn\u2019t exist. Neither did their hope, honestly.'},
  {policy:'MANDATORY SMILING ON TUESDAYS',result:'Citizens smile on Tuesdays now. They\u2019re not happy. They\u2019re just smiling because you said so. Tremendous compliance.'},
  {policy:'NATIONAL BAN ON RAIN',result:'It\u2019s still raining. But now it\u2019s illegal rain. Very unconstitutional rain. The clouds are traitors.'},
  {policy:'EVERY CITIZEN GETS A FREE TANK',result:'Tanks for everyone! The streets are gridlocked. No one can drive. But they look VERY patriotic stuck in traffic.'},
  {policy:'BAN ALL NUMBERS ABOVE 7',result:'Math is broken. The stock market crashes. Economists weep. You\u2019re not sure what comes after 7 but it\u2019s banned.'},
  {policy:'MANDATORY 4-HOUR NAP PER DAY',result:'Productivity plummets. Everyone is asleep. The opposition is asleep. This is actually working beautifully.'},
  {policy:'GARGOYLIANI AS NATIONAL TREASURE',result:'Gargoyliani cries ectoplasm tears of joy. The bill passes unanimously. Nobody dares object. Especially not the ectoplasm.'},
  {policy:'ALL WALLS MUST BE GOLD',result:'Every wall is now gold. At YOUR expense. The treasury weeps but the interiors are STUNNING.'},
  {policy:'OFFICIAL STATE BIRD: THE VULTURE',result:'Vultures circle overhead. Citizens assume it\u2019s a threat. Good. The vultures are confused but well-fed.'},
  {policy:'FREE HAT FRIDAYS',result:'Everyone gets a hat on Friday. The hats have your face on them. The faces are slightly off-center. It\u2019s the thought that counts.'},
  {policy:'LEGALIZE COMPETITION',result:'Nobody knows what this means. But it sounds progressive. Approval goes up because words are nice. Policy goes nowhere.'},
  {policy:'TAX OXYGEN',result:'Citizens hold their breath. Then stop. Because they need oxygen. You\u2019ve discovered the ultimate revenue stream.'},
];

// ============================================================


// ============================================================
// EVENTS
// The runtime EVENTS array is built from window.EVENTS_DATA
// (editable text/metadata in data/events.js) merged with the
// executable apply() effects in EVENTS_APPLY below.
// ============================================================
let EVENTS = [];

// EVENTS_APPLY - executable effects for each event choice, keyed by slug + choice index.
// Merged with window.EVENTS_DATA at startup (see buildRuntimeEvents).

// ============================================================
// PLAYER LEGAL-EVENT SYSTEM
// A separate pool of consequences that fires when you have
// outstanding legal issues. How often and how hard they hit
// scales with how much you owe and how strong the institutions
// are. There is always a floor so wiping the courts never makes
// the law fully vanish — ignoring your trouble is always worse.
// ============================================================

// Weighted pick over the consequence pool (weights from config).
const LEGAL_EVENT_WEIGHTS = Object.assign({exposure:1,seizure:1,ally:1,caseExpansion:1,warrant:1},LEGAL.eventWeights||{});

function legalSevPoints(issue){ return issue.sev==='high' ? LEGAL.sevHigh : issue.sev==='med' ? LEGAL.sevMed : LEGAL.sevLow; }

function totalLegalCost(){ return legalIssues.reduce((a,l)=>a+l.cost,0); }
function totalSeverity(){ return legalIssues.reduce((a,l)=>a+legalSevPoints(l),0); }

// Institution multiplier for legal-event FREQUENCY.
// Flat floor while institutions <= instCalmBelow, then ramps up to
// instFreqMax at 100. Reference point is the Phase II pass threshold:
// reaching it never makes events worse than the floor.
function legalInstFreqMultiplier(){
  const calm=LEGAL.instCalmBelow;
  let i=clampVal(S.institutions,0,100);
  if(i<=calm)return LEGAL.instFreqFloor;
  return LEGAL.instFreqFloor + (i-calm)/(100-calm)*(LEGAL.instFreqMax-LEGAL.instFreqFloor);
}

// Institution multiplier for per-event SEVERITY (magnitude of stat hits).
function legalInstSeverityMultiplier(){
  const calm=LEGAL.instCalmBelow;
  let i=clampVal(S.institutions,0,100);
  if(i<=calm)return LEGAL.instSeverityFloor;
  return LEGAL.instSeverityFloor + (i-calm)/(100-calm)*(LEGAL.instSeverityMax-LEGAL.instSeverityFloor);
}

function weightedLegalKind(){
  let total=0;
  for(const k in LEGAL_EVENT_WEIGHTS) total+=LEGAL_EVENT_WEIGHTS[k];
  let r=Math.random()*total;
  for(const k in LEGAL_EVENT_WEIGHTS){
    r-=LEGAL_EVENT_WEIGHTS[k];
    if(r<=0)return k;
  }
  return 'exposure';
}

function fireLegalEvent(){
  if(legalIssues.length===0)return;
  if(LEGAL.noEventsDay1&&dayCount<=1)return;
  // Base frequency scales with how much legal trouble you owe, then is
  // multiplied by institutional health (the death-spiral lever).
  let debtFactor=1+clampVal(totalLegalCost()/100,0,3);
  let freqMul=legalInstFreqMultiplier();
  let phaseW=(LEGAL.phaseWeight&&phase>=0&&phase<LEGAL.phaseWeight.length)?LEGAL.phaseWeight[phase]:1;
  if(Math.random() > clampVal(freqMul*debtFactor*phaseW*0.5,0,1))return;
  let kind=weightedLegalKind();
  let sevMul=legalInstSeverityMultiplier();
  let msg=LEGAL_EVENT_TEXTS[kind];
  let hits='';
  if(kind==='exposure'){
    let a=ir(3,6);let m=ir(2,5);
    S.approval-=Math.round(a*sevMul);S.media-=Math.round(m*sevMul);
    hits=' Approval -'+Math.round(a*sevMul)+'. Media -'+Math.round(m*sevMul)+'.';
  }else if(kind==='seizure'){
    let c=ir(20,45);
    S.credits-=Math.round(c*sevMul);
    hits=' -$'+Math.round(c*sevMul)+'.';
  }else if(kind==='ally'){
    let l=ir(3,6);
    S.loyalty-=Math.round(l*sevMul);
    hits=' Loyalty -'+Math.round(l*sevMul)+'.';
  }else if(kind==='caseExpansion'){
    // Resurvey an existing issue upward when possible, else file a new one.
    let upgraded=false;
    for(let li of legalIssues){ if(li.sev==='low'){ li.sev='med'; upgraded=true; break; } else if(li.sev==='med'){ li.sev='high'; upgraded=true; break; } }
    if(!upgraded) spawnLegal();
    hits=' A case deepens. New paperwork filed.';
  }else if(kind==='warrant'){
    // Rare — pushes toward the game-over threshold.
    let l=ir(5,8);S.loyalty-=Math.round(l*sevMul);
    spawnLegal();
    hits=' Loyalty -'+Math.round(l*sevMul)+'. A warrant pursues you.';
  }
  clampAll();
  log('[LEGAL] '+msg+hits,'bad');
  toast(msg+hits,'bad');
  updateHUD();
  updateLegal();
}

// ============================================================
// CRIME-DRIVEN LEGAL EXPOSURE
// Certain actions are crimes. When you commit them there is a
// chance (by severity) a matching legal issue gets filed — but
// never more than one open issue per crime tag.
// ============================================================
const LEGAL_CRIME_CHANCE = Object.assign({murder:0.85,deportation:0.8,suppression:0.55,swindling:0.45,election:0.6},LEGAL.crimeSpawnChance||{});

// 'legal' on an action is either a crime tag string ("murder") or an
// array of tags. Returns a short log string, or null if nothing spawned.
function applyCrimeLegal(legal, s){
  if(!legal)return null;
  const tags = Array.isArray(legal)?legal:[legal];
  for(const tag of tags){
    const templates = (LEGAL.crimeTemplates&&LEGAL.crimeTemplates[tag])?LEGAL.crimeTemplates[tag]:null;
    const chance = LEGAL_CRIME_CHANCE[tag]!=null?LEGAL_CRIME_CHANCE[tag]:0.5;
    if(!templates||templates.length===0)continue;
    // Skip if this tag already has an open issue under one of its templates.
    let alreadyOpen=false;
    for(const nm of templates){ if(legalIssues.find(l=>l.name===nm)){ alreadyOpen=true; break; } }
    if(alreadyOpen)continue;
    if(Math.random()>chance)continue;
    const t = pick(templates);
    legalIssues.push({name:t, cost:(LEGAL_TEMPLATES.find(x=>x.name===t)||{baseCost:14,growth:0.3}).baseCost, growth:(LEGAL_TEMPLATES.find(x=>x.name===t)||{baseCost:14,growth:0.3}).growth, turns:0, sev:'low'});
    log('LEGAL: '+t+' filed!','bad');
    toast('You thought nobody would notice. '+t+' filed.','bad');
    return t;
  }
  return null;
}

// Merge data/events.js (EVENTS_DATA) with the apply effects to
// produce the runtime EVENTS array used by the event system.
function buildRuntimeEvents(){
  const source = (window.EVENTS_DATA && window.EVENTS_DATA.length) ? window.EVENTS_DATA : null;
  if(!source){ EVENTS = []; return; }
  EVENTS = source.map(ed => {
    const applyList = EVENTS_APPLY[ed.slug] || [];
    return {
      slug: ed.slug,
      phase: ed.phase,
      title: ed.title,
      desc: ed.desc,
      doNothing: (ed.doNothing&&typeof ed.doNothing==='object')?ed.doNothing:null,
      choices: ed.choices.map((c, ci) => ({
        label: c.label,
        ap: c.ap,
        cost: c.cost,
        eff: c.eff,
        legalExposure: c.legalExposure,
        apply: applyList[ci] || (()=>{ return ''; })
      }))
    };
  });
}

// Merge all optional data globals (from data/*.js) into the runtime
// structures, falling back to the defaults defined above when a data
// file is absent. Safe to call on both file:// and http(s).
function buildRuntimeData(){
  if(window.AMBIENT && window.AMBIENT.length) AMBIENT = window.AMBIENT;
  if(window.FAKE_POLICIES && window.FAKE_POLICIES.length) FAKE_POLICIES = window.FAKE_POLICIES;
  if(window.GREETINGS){
    for(const t of NPC_TYPES){
      if(window.GREETINGS[t.type]) t.greet = window.GREETINGS[t.type];
    }
  }
  buildRuntimeEvents();
}


// ============================================================
// UTILITIES
// ============================================================
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function ir(a,b){return rand(a,b)}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function clampVal(v,lo,hi){return Math.max(lo,Math.min(hi,v))}

// Parse a descriptive cost string into resource requirements:
//   "$10"               -> {credits:10}
//   "2 military"        -> {military:2}
//   "3 fear, 2 military"-> {fear:3, military:2}
// Used to gate actions so you can't spend more military/fear than you have.
// Credits costs are NOT enforced (going bankrupt is its own lose condition).
function resourceCost(cost){
  let req={credits:0,fear:0,military:0};
  if(!cost)return req;
  let parts=String(cost).split(',');
  for(let raw of parts){
    let p=raw.trim();
    let m=p.match(/^\$?(\d+)\s*(.*)$/);
    if(!m)continue;
    let n=parseInt(m[1],10);
    let unit=m[2].trim().toLowerCase();
    if(unit.includes('military'))req.military=n;
    else if(unit.includes('fear'))req.fear=n;
    else if(!unit)req.credits=n; // bare number with no unit -> treat as credits if prefixed $
    else if(p.charAt(0)==='$')req.credits=n;
  }
  return req;
}

// Can the player currently afford the military/fear requirement?
function canPayResourceCost(cost){
  let req=resourceCost(cost);
  return S.military>=req.military&&S.fear>=req.fear;
}

// ============================================================
// DOOR HELPERS
// ============================================================
// Returns the door rect in pixel coords: {x1,y1,x2,y2}
// Also returns the building interior rect (where player can stand inside)
function getDoorRect(b){
  if(!b.door)return null;
  let bx=b.x*TILE, by=b.y*TILE, bw=b.w*TILE, bh=b.h*TILE;
  let gap=b.door.gap*TILE;
  let cx, cy;
  switch(b.door.side){
    case 'bottom': cx=bx+bw/2-gap/2; cy=by+bh-TILE*0.5; return {x1:cx,y1:by+bh-TILE,x2:cx+gap,y2:by+bh+TILE*1.5};
    case 'top':    cx=bx+bw/2-gap/2; cy=by;              return {x1:cx,y1:by-TILE*1.5,x2:cx+gap,y2:by+TILE*0.5};
    case 'left':   cy=by+bh/2-gap/2; cx=bx;              return {x1:bx-TILE*1.5,y1:cy,x2:bx+TILE*0.5,y2:cy+gap};
    case 'right':  cy=by+bh/2-gap/2; cx=bx+bw;           return {x1:bx+bw-TILE*0.5,y1:cy,x2:bx+bw+TILE*1.5,y2:cy+gap};
  }
  return null;
}

function isInRect(px,py,r){return r&&px>=r.x1&&px<=r.x2&&py>=r.y1&&py<=r.y2;}

// Check if point is inside the building walls (not the door)
function isInsideBuilding(px,py,b){
  let bx=b.x*TILE-10, by=b.y*TILE-10, bw=b.w*TILE+20, bh=b.h*TILE+20;
  if(px<bx||px>bx+bw||py<by||py>by+bh)return false;
  // If inside building bounds, check if we're at the door
  let dr=getDoorRect(b);
  if(dr&&isInRect(px,py,dr))return false; // at door, not "inside wall"
  return true;
}

// ============================================================
// STATE
// ============================================================
let S={};
let ap=AP_PER_DAY;
let phase=0;
let dayCount=1;
let hourOfDay=8;
let gameTime=0;
let legalIssues=[];
let usedActions={}; // building-id:action-label -> used today; reset each day
let worldCanvas,worldCtx,entCanvas,entCtx;
let camera={x:0,y:0};
let keys={};
let npcs=[];
let particles=[];
let panelOpen=false;
let eventOpen=false;
let currentEvent=null;
let phaseTransitionOpen=false;
let statsOpen=false;
let interactTarget=null;
let spriteImg=null;
let spriteLoaded=false;
let nextEventTimer=EVENT_CFG.intervalMin;
let usedEventIdx=[];
let map=null;
let gargoyleBills=0;
let gargoyleMax=GARGOYLIANI.max;
let militaryNextRoll=0;
let militaryNextWarn=0;
let legalEventTimer=LEGAL.eventIntervalMin;
let instHourTick=0;
let soldAssets={};          // carve-up assets sold (Phase IV), persistent across days
let phaseSnapshots={};      // per-phase start snapshots, for "Retry Phase" on death

// Deep-copy the player's progress at the current moment (phase-start baseline).
function captureSnapshot(){
  return {
    S:Object.assign({},S),
    legalIssues:legalIssues.map(l=>({name:l.name,cost:l.cost,growth:l.growth,turns:l.turns,sev:l.sev})),
    gargoyleBills,
    soldAssets:Object.assign({},soldAssets),
    phase,dayCount,gameTime,
    usedEventIdx:[].concat(usedEventIdx),
    militaryNextRoll,militaryNextWarn,
  };
}
// Save the snapshot for the given phase index (the moment the player starts that phase).
function capturePhaseSnapshot(p){
  phaseSnapshots[p]=captureSnapshot();
}

// ============================================================
// LEGAL ISSUES
// ============================================================
const LEGAL_TEMPLATES=[
  {name:'Campaign Finance Violation',baseCost:12,growth:0.25},
  {name:'Embezzlement Investigation',baseCost:20,growth:0.4},
  {name:'Defamation Lawsuit',baseCost:8,growth:0.15},
  {name:'Obstruction of Justice',baseCost:25,growth:0.5},
  {name:'Tax Evasion Audit',baseCost:15,growth:0.3},
  {name:'Incitement Charges',baseCost:10,growth:0.2},
  {name:'Racketeering Probe',baseCost:30,growth:0.55},
  {name:'Civil Rights Complaint',baseCost:14,growth:0.3},
  {name:'Bribery Indictment',baseCost:18,growth:0.35},
  {name:'Perjury Allegation',baseCost:11,growth:0.2},
];

function spawnLegal(){
  let t=pick(LEGAL_TEMPLATES);
  if(legalIssues.find(l=>l.name===t.name))return;
  legalIssues.push({name:t.name,cost:t.baseCost,growth:t.growth,turns:0,sev:'low'});
  log('LEGAL: '+t.name+' filed!','bad');
}

// Cheap per-frame refresh of the bar + value + warn/danger state only.
// Does NOT rebuild the item list (safe to call 60x/sec).
function renderLegalGauge(fill,val,gauge){
  if(!fill||!val||!gauge)return;
  let total=legalIssues.reduce((a,l)=>a+l.cost,0);
  let pct=clampVal(total/(LEGAL.exposureMax||250)*100,0,100);
  fill.style.width=pct+'%';
  val.textContent='$'+Math.round(total);
  let warn=pct>=LEGAL.dangerPct;
  gauge.classList.toggle('warn',warn);
  fill.classList.toggle('danger',warn);
}

function renderLegalList(el){
  if(!el)return;
  let total=legalIssues.reduce((a,l)=>a+l.cost,0);
  el.innerHTML='';
  if(!legalIssues.length)return;
  for(let i=0;i<legalIssues.length;i++){
    let l=legalIssues[i];
    let d=document.createElement('div');
    d.className='legal-item';
    d.innerHTML='<span>'+l.name+'</span><span class="sev '+l.sev+'"> $'+l.cost+'</span>';
    d.title='Settle this in the Courthouse';
    el.appendChild(d);
  }
  let sum=document.createElement('div');
  sum.className='legal-total';
  sum.innerHTML='<b>Total: $'+Math.round(total)+'</b>';
  el.appendChild(sum);
}

function updateLegalGauge(){
  renderLegalGauge(document.getElementById('legal-fill'),document.getElementById('legal-val'),document.getElementById('legal-ticker'));
  renderLegalGauge(document.getElementById('p-legal-fill'),document.getElementById('p-legal-val'),document.getElementById('p-legal-ticker'));
}

// Refresh the legal-exposure bar + list. SAFE to call every frame
// (no cost growth here). Grows nothing, but rebuilds the list DOM.
function updateLegalBar(){
  renderLegalGauge(document.getElementById('legal-fill'),document.getElementById('legal-val'),document.getElementById('legal-ticker'));
  renderLegalGauge(document.getElementById('p-legal-fill'),document.getElementById('p-legal-val'),document.getElementById('p-legal-ticker'));
  renderLegalList(document.getElementById('legal-items'));
  renderLegalList(document.getElementById('p-legal-items'));
}

// Grow outstanding judgments (severity escalates over turns) and refresh
// the display. Called on the daily cadence, not per-frame.
function updateLegal(){
  for(let l of legalIssues){l.turns++;l.cost=Math.round(l.cost+l.growth*8);if(l.turns>8)l.sev='high';else if(l.turns>4)l.sev='med';}
  updateLegalBar();
}

// Pay down the outstanding legal balance by the Courthouse settle amount.
// Returns the amount actually paid (0 if nothing was outstanding).
function payLegal(amount){
  if(legalIssues.length===0)return 0;
  let owed=totalLegalCost();
  let amt=Math.min(amount,Math.round(owed));
  if(S.credits<amt)amt=Math.max(0,Math.round(S.credits));
  if(amt<=0){toast('You can\u2019t pay anything toward these judgments right now.','bad');return 0;}
  S.credits-=amt;
  // Dole the payment out across issues, oldest (highest cost) first.
  legalIssues.sort((a,b)=>b.cost-a.cost);
  let left=amt;
  for(let i=legalIssues.length-1;i>=0&&left>0;i--){
    let l=legalIssues[i];
    if(l.cost<=left){left-=l.cost;log('PAID $'+l.cost+' \u2014 '+l.name+' settled.','good');legalIssues.splice(i,1);}
    else{l.cost=Math.round(l.cost-left);left=0;}
  }
  log('Paid $'+amt+' toward your legal judgments at the Courthouse.','good');
  S.approval-=ir(1,2);
  updateLegal();
  updateHUD();
  return amt;
}

// ============================================================
// GARGOYLIANI LEGAL GAUGE
// ============================================================
function addGargoyleBill(amount){
  gargoyleBills+=amount;
  if(gargoyleBills>gargoyleMax)gargoyleBills=gargoyleMax;
  updateGargoyle();
}


function getGargoyleFlipChance(){
  if(gargoyleBills<=0)return 0;
  let pct=gargoyleBills/gargoyleMax*100;
  if(pct<GARGOYLIANI.flipFloor)return 0;
  let chance=(pct-GARGOYLIANI.flipFloor)/(100-GARGOYLIANI.flipFloor)*GARGOYLIANI.flipMaxChance;
  return Math.round(chance);
}

function renderGargoyle(fill,val,gauge,threat){
  if(!fill||!val||!gauge)return;
  let pct=clampVal(gargoyleBills/gargoyleMax*100,0,100);
  fill.style.width=pct+'%';
  val.textContent='$'+Math.round(gargoyleBills);
  let risk=getGargoyleFlipChance();
  if(pct>=80){fill.classList.add('danger');gauge.classList.add('warn');}
  else if(pct>=GARGOYLIANI.flipFloor){fill.classList.remove('danger');gauge.classList.add('warn');}
  else{fill.classList.remove('danger');gauge.classList.remove('warn');}
  // Create the flip-risk line if it doesn't exist yet (desktop gauge has none
  // in markup; the P-menu copy ships with a static #p-gargoyle-threat div).
  if(!threat){
    threat=document.createElement('div');
    threat.id=(gauge.id==='p-gargoyle-gauge')?'p-gargoyle-threat':'gargoyle-threat';
    gauge.appendChild(threat);
  }
  if(risk>0){
    threat.textContent='\u26A0 FLIP RISK TODAY: '+risk+'%';
    threat.style.color='#ff4040';
    threat.style.animation=risk>=60?'gargoylePulse 1s infinite':'none';
  }else{
    threat.textContent='';
  }
}

function updateGargoyle(){
  renderGargoyle(
    document.getElementById('gargoyle-fill'),
    document.getElementById('gargoyle-val'),
    document.getElementById('gargoyle-gauge'),
    document.getElementById('gargoyle-threat')
  );
  // Also refresh the copy shown in the P menu (Stats & Goals).
  renderGargoyle(
    document.getElementById('p-gargoyle-fill'),
    document.getElementById('p-gargoyle-val'),
    document.getElementById('p-gargoyle-gauge'),
    document.getElementById('p-gargoyle-threat')
  );
  // Click a gauge for a quick readout (both desktop and P-menu copies).
  let risk=getGargoyleFlipChance();
  let pct=clampVal(gargoyleBills/gargoyleMax*100,0,100);
  for(const id of ['gargoyle-gauge','p-gargoyle-gauge']){
    const gauge=document.getElementById(id);
    if(gauge)gauge.onclick=()=>{
      if(gargoyleBills<=0){toast('Gargoyliani has no pending legal issues. For now.','');return;}
      toast('Gargoyliani\u2019s legal exposure: $'+Math.round(gargoyleBills)+' ('+Math.round(pct)+'%). Daily flip risk: '+(risk?risk+'%':'zero — under '+GARGOYLIANI.flipFloor+'%.')+' Visit the COURTHOUSE and contribute to his defense fund to lower it.','bad');
    };
  }
}

// ============================================================
// ACTION LOG
// ============================================================
let logHistory=[];          // full record (for the expandable popup)
function log(msg,type){
  logHistory.push({day:dayCount,hour:hourOfDay,msg:msg,type:type||''});
  let el=document.getElementById('log-entries');
  if(el){
    while(el.firstChild)el.removeChild(el.firstChild);
    let n=Math.min(logHistory.length,50);
    for(let i=0;i<n;i++){
      let e=logHistory[logHistory.length-1-i];   // newest first (top)
      let d=document.createElement('div');
      d.className='log-entry '+(e.type||'');
      d.innerHTML='<span class="log-time">'+e.day+'d'+e.hour+'h</span> '+e.msg;
      el.appendChild(d);
    }
    el.scrollTop=0;
  }
}

function toggleLog(){
  let overlay=document.getElementById('log-overlay');
  let backdrop=document.getElementById('log-backdrop');
  let open=overlay.style.display==='flex';
  overlay.style.display=open?'none':'flex';
  backdrop.style.display=open?'none':'block';
  if(!open){
    let full=document.getElementById('log-full');
    if(full){
      full.innerHTML='';
      let frag=document.createDocumentFragment();
      for(let i=logHistory.length-1;i>=0;i--){
        let e=logHistory[i];
        let d=document.createElement('div');
        d.className='log-entry '+(e.type||'');
        d.innerHTML='<span class="log-time">'+e.day+'d'+e.hour+'h</span> '+e.msg;
        frag.appendChild(d);
      }
      full.appendChild(frag);
      full.scrollTop=0;   // show newest (top)
    }
  }
}

// ============================================================
// STATS & GOALS (also the pause screen — click any stat or press P)
// ============================================================
function statProgress(stat, target, invert){
  let v=S[stat];
  let max=STAT_MAXES[stat];
  let prog;
  if(invert){ // need to get BELOW target
    prog = (max - v) / (max - target); // 0 at v==max, 1 at v<=target
    prog=clampVal(prog,0,1);
  } else {
    prog = v / target; // 1 at v>=target
    prog=clampVal(prog,0,1);
  }
  return {v:Math.round(v),target,prog};
}

function renderGoals(){
  let el=document.getElementById('goals-panel');
  if(!el)return;
  el.innerHTML='';
  for(let pi=0;pi<PHASES.length;pi++){
    let ph=PHASES[pi];
    let row=document.createElement('div');
    let done = pi<phase; // already passed
    let current = pi===phase;
    let flag=done?'\u2714':current?'\u25B8':'';
    row.className='goal-row'+(current?' current':done?' done':'');
    let html='<span class="goal-flag'+(done?' done':'')+'">'+flag+'</span>';
    html+='<span class="goal-name">'+ph.name.split('\u2014')[0].trim()+'</span>';
    if(pi===3){
      // Phase IV: credits + assets
      let v=S.credits;let target=PHASE_GOALS[3].credits;
      let cProg=clampVal(v/target,0,1);
      let sold=soldAssetCount();let total=CARVE_UP_ASSETS.length;
      html+='<span class="goal-text">'+ph.goal+'</span>';
      html+='<span class="goal-bar"><span class="goal-fill" style="width:'+(cProg*100)+'%"></span></span>';
      html+='<span class="goal-prog">$'+Math.round(v)+'/'+target+' &middot; assets '+sold+'/'+total+'</span>';
    } else {
      // generic: extract target stat(s) from PHASE_GOALS
      let g=PHASE_GOALS[pi]||{};
      let keys=Object.keys(g);
      let parts=[];
      for(let k of keys){
        let invert=(k==='institutions'||k==='population');
        let p=statProgress(k,g[k],invert);
        parts.push('<span class="goal-bar"><span class="goal-fill" style="width:'+(p.prog*100)+'%"></span></span><span class="goal-prog">'+p.v+'/'+p.target+(invert?' below':'')+'</span>');
      }
      html+='<span class="goal-text">'+ph.goal+'</span>'+parts.join('');
    }
    row.innerHTML=html;
    el.appendChild(row);
  }
}

function renderStats(){
  let el=document.getElementById('stats-panel');
  if(!el)return;
  el.innerHTML='';
  const order=['credits','approval','fear','loyalty','military','institutions','population','media'];
  for(let s of order){
    let info=STAT_INFO[s]||{icon:s[0].toUpperCase(),label:s,desc:''};
    let v=Math.round(S[s]);let max=STAT_MAXES[s];
    let row=document.createElement('div');
    row.className='statrow';
    row.style.display='grid';
    row.style.gridTemplateColumns='22px 110px 1fr 70px 20px';
    row.style.alignItems='center';
    row.style.gap='8px';
    row.innerHTML='<span class="sic">'+info.icon+'</span><span class="sname">'+info.label+'</span><span class="sbar"><span class="sfill" style="width:'+clampVal(v/max*100,0,100)+'%;background:'+(hudStatColor(s))+';display:block;height:100%"></span></span><span class="sval">'+v+'<span class="smax">/'+max+'</span></span><button class="qbtn" title="What does '+info.label+' do?">?</button>';
    if(info.desc){
      let d=document.createElement('div');
      d.className='sdesc';
      d.textContent=info.desc;
      row.appendChild(d);
    }
    el.appendChild(row);
  }
}

function hudStatColor(s){
  const map={credits:'#c0a000',approval:'#c02020',fear:'#ff4040',loyalty:'#4040c0',military:'#20c020',institutions:'#c06020',population:'#c0c020',media:'#2080c0'};
  return map[s]||'#c08020';
}

function toggleStatsWindow(){
  let overlay=document.getElementById('stats-overlay');
  let backdrop=document.getElementById('stats-backdrop');
  if(!overlay)return;
  statsOpen = overlay.style.display!=='flex';
  overlay.style.display=statsOpen?'flex':'none';
  backdrop.style.display=statsOpen?'block':'none';
  if(statsOpen){
    renderGoals();
    renderStats();
    // Refresh the legal / gargoyle readouts so the P-menu panels show the
    // current values the moment the window opens (the game loop skips these
    // while the game is paused).
    updateGargoyle();
    updateLegalBar();
    // ? buttons toggle their inline description
    let rows=document.getElementById('stats-panel').querySelectorAll('.statrow');
    rows.forEach(row=>{
      const q=row.querySelector('.qbtn');
      const dsc=row.querySelector('.sdesc');
      if(q&&dsc){
        q.addEventListener('click',(e)=>{
          e.stopPropagation();
          let open=dsc.classList.toggle('open');
          row.classList.toggle('open-row',open);
          q.textContent=open?'\u2013':'?';
        });
      }
    });
  }
}

// ============================================================
// TOAST
// ============================================================
function toast(msg,type){
  let t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:'+(60+rand(0,40))+'px;left:50%;transform:translateX(-50%);background:rgba(8,0,0,.92);border:1px solid '+(type==='bad'?'#8a2a2a':type==='good'?'#2a8a2a':'#c02020')+';border-radius:3px;padding:4px 12px;font-size:12px;z-index:40;color:'+(type==='bad'?'#c04040':type==='good'?'#40c040':'#aaa')+';pointer-events:none;animation:fadeIn .2s;max-width:500px;text-align:center';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .5s';setTimeout(()=>t.remove(),500);},6000);
}

// ============================================================
// HUD
// ============================================================
function updateHUD(){
  let stats=['credits','approval','fear','loyalty','military','institutions','population','media'];
  let maxes=STAT_MAXES;
  let phaseCritical=[];
  if(phase===0){phaseCritical.push('approval','loyalty');}
  else if(phase===1){phaseCritical.push('institutions');}
  else if(phase===2){phaseCritical.push('population');}
  else if(phase===3){phaseCritical.push('credits');}
  let dangerThresholds=Object.assign({credits:-120,approval:3,loyalty:3,military:10,population:5},GAME_CONFIG.DANGER||{});
  for(let s of stats){
    let v=Math.round(S[s]);
    let el=document.getElementById('val-'+s);
    let bar=document.getElementById('bar-'+s);
    let statEl=el?el.closest('.stat'):null;
    if(el)el.textContent=v;
    if(bar)bar.style.width=clampVal(v/maxes[s]*100,0,100)+'%';
    if(s==='credits'&&el){el.className='stat-val'+(v<0?' debt':'');}
    if(statEl){
      statEl.classList.remove('phase-critical','danger');
      if(phaseCritical.includes(s)){
        let met=PHASES[phase].check(S);
        if(!met)statEl.classList.add('phase-critical');
      }
      if(dangerThresholds[s]!==undefined&&v<=dangerThresholds[s])statEl.classList.add('danger');
    }
  }
  let pp=document.getElementById('ap-pips');
  if(pp){
    pp.innerHTML='';
    for(let i=0;i<AP_PER_DAY;i++){
      let d=document.createElement('div');
      d.className='ap-pip '+(i<ap?'filled':'spent');
      pp.appendChild(d);
    }
  }
  let pn=document.getElementById('phase-name');
  let pg=document.getElementById('phase-goal');
  if(pn)pn.textContent=PHASES[phase].name;
  if(pg){
    if(phase===3){
      let sold=soldAssetCount();
      let assetsLeft=CARVE_UP_ASSETS.length-sold;
      pg.innerHTML='SELL EVERYTHING to reach '+PHASE_GOALS[3].credits+'+ credits. Sold '+sold+'/'+CARVE_UP_ASSETS.length+' assets '+(assetsLeft?'(visit the FIRE SALE EMPORIUM)':'')+' \u2014 '+(allAssetsSold()?('credits needed to finish: '+Math.max(0,PHASE_GOALS[3].credits-S.credits)):assetsLeft+' remaining to sell: '+CARVE_UP_ASSETS.filter(a=>!soldAssets[a]).join(', '));
    } else {
      pg.textContent=PHASES[phase].goal;
    }
  }
}

// ============================================================
// MAP GENERATION
// ============================================================


// ============================================================
// NPC CLASS
// ============================================================
// Detect whether a character actually renders as a filled glyph on this
// device. A missing emoji renders as a hollow "tofu" box, which inks far
// fewer pixels than the real glyph — so we compare pixel coverage.
let emojiSupportCache={};
function emojiSupported(ch){
  if(emojiSupportCache[ch]!==undefined)return emojiSupportCache[ch];
  let ok=true;
  try{
    let c=document.createElement('canvas');c.width=c.height=64;
    let cx=c.getContext('2d');
    cx.font='48px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
    cx.fillStyle='#000';cx.fillRect(0,0,64,64);
    cx.fillStyle='#fff';
    cx.fillText(ch,32,32);
    let d=cx.getImageData(0,0,64,64).data;
    let inked=0;
    for(let i=3;i<d.length;i+=4)if(d[i]>50)inked++;   // count opaque (non-background) pixels
    // A real glyph fills a good chunk of its cell; a tofu box (hollow outline)
    // leaves most of the cell transparent.
    ok=inked > (64*64)*0.20;
  }catch(e){ok=true;}
  emojiSupportCache[ch]=ok;
  return ok;
}

class NPC{
  constructor(def,x,y){
    Object.assign(this,def);this.x=x;this.y=y;this.vx=0;this.vy=0;this.wanderTimer=rand(60,200);this.bob=0;this.bobDir=1;this.interactedToday=false;this.lastKind=null;this.lastResult=null;
    // Fall back to a plain letter if the primary icon emoji doesn't render.
    if(this.iconFallback&&this.icon&&!emojiSupported(this.icon))this.icon=this.iconFallback;
  }
  update(){
    this.wanderTimer--;
    if(this.wanderTimer<=0){
      if(Math.random()<0.4){this.vx=0;this.vy=0;}
      else{let a=Math.random()*Math.PI*2;this.vx=Math.cos(a)*NPC_SPEED;this.vy=Math.sin(a)*NPC_SPEED;}
      this.wanderTimer=rand(60,200);
    }
    let nx=this.x+this.vx,ny=this.y+this.vy;
    if(nx<TILE*3||nx>WORLD_W-TILE*3||ny<TILE*3||ny>WORLD_H-TILE*3){this.vx*=-1;this.vy*=-1;return;}
    let blocked=false;
    for(let b of BUILDINGS){
      if(nx>b.x*TILE-10&&nx<(b.x+b.w)*TILE+10&&ny>b.y*TILE-10&&ny<(b.y+b.h)*TILE+10){blocked=true;break;}
    }
    if(!blocked){this.x=nx;this.y=ny;}
    else{this.vx*=-1;this.vy*=-1;}
    this.bob+=this.bobDir*0.12;
    if(this.bob>2||this.bob<-2)this.bobDir*=-1;
  }
  draw(ctx){
    let dx=this.x-camera.x,dy=this.y-camera.y+this.bob;
    ctx.fillStyle=this.color;
    ctx.beginPath();ctx.arc(dx,dy,15,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(dx,dy,15,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;
    ctx.fillStyle='#fff';ctx.font='bold 18px "VT323",monospace';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(this.icon,dx,dy);ctx.textAlign='left';ctx.textBaseline='alphabetic';
    // Name label: dark outline + solid white so it stays readable over the map.
    ctx.font='bold 16px "VT323",monospace';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(this.name,dx,dy+29);
    ctx.fillStyle='#ffffff';ctx.fillText(this.name,dx,dy+29);ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.lineWidth=1;
  }
}

// ============================================================
// PLAYER
// ============================================================
let player={x:11*TILE,y:43*TILE,speed:PLAYER_SPEED,bob:0,bobDir:1};

function updatePlayer(){
  if(panelOpen||eventOpen||phaseTransitionOpen)return;
  let dx=0,dy=0;
  if(keys['ArrowLeft']||keys['KeyA'])dx-=1;
  if(keys['ArrowRight']||keys['KeyD'])dx+=1;
  if(keys['ArrowUp']||keys['KeyW'])dy-=1;
  if(keys['ArrowDown']||keys['KeyS'])dy+=1;
  if(dx&&dy){dx*=0.707;dy*=0.707;}
  // Mobile/touch joystick input (from js/touch.js via getJoyVector).
  // True analog: the joystick vector is applied continuously (not snapped to
  // 8-way like the keys), with a deadzone so a centered stick doesn't jitter
  // and the vector re-normalized so diagonal pushes aren't slower.
  let joyDx=0,joyDy=0;
  if(typeof window.getJoyVector==='function'){
    let jv=window.getJoyVector();
    if(jv&&jv.active){
      let jx=jv.dx||0, jy=jv.dy||0;
      let mag=Math.hypot(jx,jy);
      if(mag>0.03){ // ignore near-center jitter
        if(mag>1){jx/=mag;jy/=mag;mag=1;}
        joyDx=jx;joyDy=jy;
      }
    }
  }
  let nx=player.x+(dx+joyDx)*player.speed,ny=player.y+(dy+joyDy)*player.speed;
  nx=clampVal(nx,TILE*2,WORLD_W-TILE*2);
  ny=clampVal(ny,TILE*2,WORLD_H-TILE*2);

  let blocked=false;
  let doorTarget=null;
  for(let b of BUILDINGS){
    if(isInsideBuilding(nx,ny,b)){
      let dr=getDoorRect(b);
      if(dr&&isInRect(nx,ny,dr)){
        doorTarget=b;
      } else {
        blocked=true;
      }
    }
    let dr=getDoorRect(b);
    if(dr){
      let approach={x1:dr.x1-TILE,y1:dr.y1-TILE,x2:dr.x2+TILE,y2:dr.y2+TILE};
      if(isInRect(nx,ny,approach)){
        doorTarget=b;
      }
    }
  }

  if(!blocked||doorTarget){
    player.x=nx;player.y=ny;
    if(doorTarget){
      interactTarget=doorTarget;
    } else if(dx||dy||joyDx||joyDy){
      // Check if still near any door
      let nearDoor=false;
      for(let b of BUILDINGS){
        let dr=getDoorRect(b);
        if(dr){
          let approach={x1:dr.x1-TILE,y1:dr.y1-TILE,x2:dr.x2+TILE,y2:dr.y2+TILE};
          if(isInRect(player.x,player.y,approach)){nearDoor=true;interactTarget=b;break;}
        }
      }
      if(!nearDoor)interactTarget=null;
    }
  } else {
    // Blocked by wall - still check if near a door for interaction
    for(let b of BUILDINGS){
      let dr=getDoorRect(b);
      if(dr){
        let approach={x1:dr.x1-TILE*1.5,y1:dr.y1-TILE*1.5,x2:dr.x2+TILE*1.5,y2:dr.y2+TILE*1.5};
        if(isInRect(player.x,player.y,approach)){
          // Snap player to the door approach zone edge
          let snapX=clampVal(player.x,approach.x1+1,approach.x2-1);
          let snapY=clampVal(player.y,approach.y1+1,approach.y2-1);
          // Only snap if it gets us closer to the door without hitting walls
          if(!isInsideBuilding(snapX,snapY,b)){
            player.x=snapX;player.y=snapY;
          }
          interactTarget=b;
          break;
        }
      }
    }
  }
  player.bob+=player.bobDir*0.1;
  if(player.bob>2||player.bob<-2)player.bobDir*=-1;

  // Check NPC proximity for free interactions. The nearest in-range NPC
  // always wins over a building door when both are in play (so walk away from
  // lingering NPCs to enter a building).
  let closest=null,cd=INTERACT_RANGE;
  for(let n of npcs){let d=Math.hypot(player.x-n.x,player.y-n.y);if(d<cd){cd=d;closest=n;}}
  if(closest){interactTarget=closest;}
}



// ============================================================
// PARTICLES
// ============================================================

// ============================================================
// CAMERA
// ============================================================

// Show only the $ (money) component of a cost string on action buttons.
// Resource costs (fear/military/loyalty) are still enforced by
// canPayResourceCost behind the scenes, but are hidden from the label
// so the player chooses by theme, not by spreadsheet.
function displayCost(cost){
  if(!cost||cost==='free'||cost==='$0')return cost||'';
  let parts=String(cost).split(',');
  let kept=[];
  for(let p of parts){
    let t=p.trim();
    if(!t)continue;
    if(/\$\d/.test(t))kept.push(t);      // dollar portion
    // ignore resource tokens (fear/military/loyalty)
  }
  let out=kept.join(', ');
  return out||'';
}

// ============================================================
// INTERACTION: BUILDINGS
// ============================================================
function openBuildingPanel(b){
  panelOpen=true;
  let p=document.getElementById('panel');
  let unlocked=phase>=b.unlockPhase;
  let name=unlocked?b.upgradedName:b.name;
  document.getElementById('panel-title').textContent=b.icon+' '+name;
  document.getElementById('panel-desc').innerHTML=unlocked?(b.desc+'<br><br>AP: '+ap+'/'+AP_PER_DAY+' \u2014 Choose your action.'):('LOCKED until Phase '+(b.unlockPhase+1)+'.');
  let opts=document.getElementById('panel-opts');
  opts.innerHTML='';
  if(!unlocked){p.style.display='block';return;}
  for(let a of b.actions){
    let actionKey=b.id+':'+a.label;
    let usedToday=!a.ignoreDailyCap&&usedActions[actionKey]===true;
    let soldHere=(a.once&&a.asset&&soldAssets[a.asset]===true);
    // Optional per-action gate: a function returning a truthy reason string
    // when the button should be disabled (e.g. the Courthouse settle action
    // disables itself when nothing is owed, so it can't waste AP).
    let disabledReason=(typeof a.disabledWhen==='function')?(a.disabledWhen()||null):null;
    let btn=document.createElement('button');
    btn.className='pbtn';
    let canAfford=!usedToday&&!soldHere&&!disabledReason&&ap>=a.ap&&S.credits>=0&&canPayResourceCost(a.cost);
    btn.disabled=!canAfford;
    let costDisplay=displayCost((typeof a.costFn==='function')?a.costFn():(a.cost));
    btn.innerHTML=(a.label+(soldHere?' <span class="cost">SOLD</span>':usedToday?'<br><span class="flavor">Done for today.</span>':disabledReason?'<br><span class="flavor">'+disabledReason+'</span>':(a.ap?' <span class="cost">'+a.ap+' AP'+(costDisplay&&costDisplay!=='free'&&costDisplay!=='$0'?' + '+costDisplay:'')+'</span>':costDisplay&&costDisplay!=='free'&&costDisplay!=='$0'?' <span class="cost">'+costDisplay+'</span>':'')+(a.flavor?'<br><span class="flavor">'+a.flavor+'</span>':'')));
    btn.onclick=()=>{
      if((typeof a.disabledWhen==='function'&&a.disabledWhen())||ap<a.ap||!canPayResourceCost(a.cost))return;
      let creditsBefore=S.credits;
      let result=a.apply(S);
      if(a.legalExposure)applyCrimeLegal(a.legalExposure,S);
      let creditsSpent=creditsBefore-S.credits;
      if(creditsSpent>0&&!a.noGargoyleBill)addGargoyleBill(Math.round(creditsSpent*GARGOYLIANI.billRate));
      ap-=a.ap;
      if(a.once&&a.asset){soldAssets[a.asset]=true;}
      else if(!a.ignoreDailyCap){usedActions[actionKey]=true;}
      clampAll();
      log(result||a.label,'good');
      toast(result||a.label,'good');
      spawnP(player.x,player.y,'#c02020',6);
      closePanel();
      updateHUD();
      updateGargoyle();
      checkPhase();
      checkLose();
    };
    opts.appendChild(btn);
  }
  p.style.display='block';
}

// ============================================================
// INTERACTION: NPCs
// ============================================================
// Render a single AP-costing full-action button and return it. The "core"
// callback applies the action's stat changes (including any legal exposure)
// and returns the flavor text. The button deducts AP, computes the
// Gargoyliani bill from credits actually spent, and runs finishNPCAction.
// It's disabled when the AP or resource cost can't be met.
function makeFullActionButton(label,cost,apCost,core,n){
  let btn=document.createElement('button');
  btn.className='pbtn';
  let costDisplay=displayCost(cost);
  let canAfford=ap>=apCost&&canPayResourceCost(cost)&&S.credits>=0;
  btn.disabled=!canAfford;
  btn.innerHTML=label+' <span class="cost">'+apCost+' AP'+(costDisplay&&costDisplay!=='free'&&costDisplay!=='$0'?' + '+costDisplay:'')+'</span>';
  btn.onclick=()=>{
    if(ap<apCost||!canPayResourceCost(cost))return;
    ap-=apCost;
    let creditsBefore=S.credits;
    let result=core();
    let creditsSpent=creditsBefore-S.credits;
    if(creditsSpent>0)addGargoyleBill(Math.round(creditsSpent*GARGOYLIANI.billRate));
    finishNPCAction(n,result);
  };
  return btn;
}

// Common post-full-action cleanup: mark interacted-this-day, log, toast, and
// refresh the world/state. Core flavor text comes from `result`.
function finishNPCAction(n,result){
  clampAll();
  n.interactedToday=true;n.lastKind='full';n.lastResult=result;
  log(result,'good');
  toast(result,'good');
  spawnP(n.x,n.y,n.color,6);
  closePanel();
  updateHUD();
  updateGargoyle();
  checkPhase();
  checkLose();
}

function openNPCPanel(n){
  panelOpen=true;
  let p=document.getElementById('panel');
  document.getElementById('panel-title').textContent=n.icon+' '+n.name;
  let opts=document.getElementById('panel-opts');
  opts.innerHTML='';
  // If we've already interacted with this NPC today, respond read-only using
  // the outcome of that interaction — no new action options, no stat changes.
  if(n.interactedToday){
    document.getElementById('panel-desc').textContent = n.lastResult
      ? n.lastResult
      : 'You\u2019ve already dealt with them today. They have nothing else to say.';
    p.style.display='block';
    return;
  }
  document.getElementById('panel-desc').textContent=pick(n.greet);
  // Build the list of AP-costing full actions. NPCs may declare a generic
  // single full action (fullApply/fullCost, used by all pre-existing types)
  // OR a list of distinct full actions (fullActions, used by e.g.
  // Real Scientists). Each is rendered as its own gated button.
  let fullActs = (Array.isArray(n.fullActions)&&n.fullActions.length) ? n.fullActions : null;
  let quickName=n.quickLabel||'Quick Touch';
  let fullName=((n.fullEff||'').split('(')[0].trim())||'Interact';
  if(fullActs){
    for(let fa of fullActs){
      if(ap<fa.ap||!canPayResourceCost(fa.cost))continue;
      let b=makeFullActionButton(fa.label,fa.cost,fa.ap,()=>{
        let result=fa.apply(S);
        if(fa.legalExposure)applyCrimeLegal(fa.legalExposure,S);
        return result;
      },n);
      opts.appendChild(b);
    }
  } else if(n.fullApply){
    if(n.fullCost<=ap){
      let b=makeFullActionButton(fullName,n.cost,n.fullCost,()=>{
        let result=n.fullApply(S);
        if(n.legalExposure)applyCrimeLegal(n.legalExposure,S);
        return result;
      },n);
      opts.appendChild(b);
    }
  }
  let qb=document.createElement('button');
  qb.className='pbtn';
  qb.innerHTML='Quick: '+quickName+' <span class="cost">FREE</span><br><span class="flavor">Small effect, no AP</span>';
  qb.onclick=()=>{
    let result=n.quickEff(S);
    clampAll();
    n.interactedToday=true;n.lastKind='quick';n.lastResult=result;
    log(result,'');
    toast(result,'');
    closePanel();
    updateHUD();
    checkPhase();
    checkLose();
  };
  opts.appendChild(qb);
  p.style.display='block';
}

function closePanel(){panelOpen=false;document.getElementById('panel').style.display='none';}
function toggleHelp(){let h=document.getElementById('help-overlay');let bd=document.getElementById('help-backdrop');let open=h.style.display==='flex';h.style.display=open?'none':'flex';bd.style.display=open?'none':'block';}
document.getElementById('panel-close').onclick=closePanel;

// ============================================================
// INTERACTION: PROMPT
// ============================================================
function updatePrompt(){
  let el=document.getElementById('interact-prompt');
  if(interactTarget&&!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!statsOpen){
    el.style.display='block';
    let displayName=interactTarget.actions?(phase>=interactTarget.unlockPhase?interactTarget.upgradedName:interactTarget.name):interactTarget.name;
    el.innerHTML='Press <span class="key">E</span> \u2014 '+displayName;
  } else el.style.display='none';
  // Mobile: keep the on-screen ACT button (js/touch.js) in sync.
  if(typeof window.setActTarget==='function'){
    let target=(interactTarget&&!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!statsOpen)?interactTarget:null;
    window.setActTarget(target);
  }
}

// ============================================================
// EVENT SYSTEM
// ============================================================
function triggerEvent(){
  if(eventOpen||panelOpen||phaseTransitionOpen)return;
  let eligible=EVENTS.filter((e,i)=>e.phase.includes(phase)&&!usedEventIdx.includes(i));
  if(!eligible.length){usedEventIdx=[];eligible=EVENTS.filter(e=>e.phase.includes(phase));}
  if(!eligible.length)return;
  eventOpen=true;
  let ev=pick(eligible);
  currentEvent=ev;
  let evIdx=EVENTS.indexOf(ev);
  usedEventIdx.push(evIdx);
  document.getElementById('evt-title').textContent=ev.title;
  document.getElementById('evt-desc').textContent=ev.desc;
  let opts=document.getElementById('evt-opts');
  opts.innerHTML='';
  for(let c of ev.choices){
    let btn=document.createElement('button');
    btn.className='pbtn';
    let canAfford=ap>=c.ap&&canPayResourceCost(c.cost);
    btn.disabled=!canAfford;
    btn.innerHTML=c.label+(c.ap?' <span class="cost">'+c.ap+' AP'+(c.cost?' + '+displayCost(c.cost):'')+'</span>':'');
    btn.onclick=()=>{
      if(ap<c.ap||!canPayResourceCost(c.cost))return;
      ap-=c.ap;
      let creditsBefore=S.credits;
      let result=c.apply(S);
      if(c.legalExposure)applyCrimeLegal(c.legalExposure,S);
      let creditsSpent=creditsBefore-S.credits;
      if(creditsSpent>0)addGargoyleBill(Math.round(creditsSpent*GARGOYLIANI.billRate));
      clampAll();
      log('[EVENT] '+result,'event');
      toast(result,'neutral');
      document.getElementById('event-popup').style.display='none';
      eventOpen=false;
      spawnP(player.x,player.y,'#c02020',10);
      updateHUD();
      updateGargoyle();
      checkPhase();
      checkLose();
    };
    opts.appendChild(btn);
  }
  // Always offer a 0-AP "Do Nothing" path so a player with no AP can resolve
  // the event. It's always a net negative (see applyDoNothing).
  let dn=document.createElement('button');
  dn.className='pbtn';
  dn.innerHTML=(ev.doNothing&&ev.doNothing.label||DO_NOTHING.label)+' <span class="cost">0 AP</span><br><span class="flavor">'+(ev.doNothing&&ev.doNothing.flavor||'Just let it blow over. Nothing ever helps, right?')+'</span>';
  dn.onclick=()=>{ if(eventOpen)applyDoNothing(ev); };
  opts.appendChild(dn);
  document.getElementById('event-popup').style.display='block';
}

// ============================================================
// EVENT "DO NOTHING"
// A 0-AP passive response. Always net-negative (spending AP is
// usually good). Penalties target the stats the event is about,
// and are nudged ± a point by the player's current relevant stat
// (high fear keeps the crowd in line, etc.).
// ============================================================
function scalePenalty(delta,modifiedStat,badAt){
  // delta is negative (a penalty). Return the adjusted delta.
  let d=delta;
  let buffer=DO_NOTHING.buffering[modifiedStat]||modifiedStat;
  // If the event authors a "worsens when high" stat, high value increases
  // the penalty instead of softening it (rare, thematic).
  if(badAt&&badAt[modifiedStat]&&S[modifiedStat]>STAT_MAXES[modifiedStat]*DO_NOTHING.rangeHigh){
    d-=DO_NOTHING.shiftLow; // more negative
    return d;
  }
  let val=S[buffer]||0;
  let ratio=val/(STAT_MAXES[buffer]||1);
  if(ratio>=DO_NOTHING.rangeHigh){
    d+=DO_NOTHING.shiftHigh; // soften (toward zero)
  }else if(ratio<=DO_NOTHING.rangeLow){
    d-=DO_NOTHING.shiftLow; // worsen
  }
  return d;
}

function applyDoNothing(ev){
  if(!eventOpen||!ev)return;
  let dn=(ev.doNothing&&typeof ev.doNothing==='object')?ev.doNothing:({stats:{},flavor:''});
  let hasAuthored=dn.stats&&Object.keys(dn.stats).length>0;
  let stats=hasAuthored?dn.stats:DO_NOTHING.defaultPenalty;
  let parts=[];
  for(let k in stats){
    let base=stats[k];
    if(!base)continue;
    let adj=scalePenalty(base,k,dn.badAt);
    S[k]=(S[k]|0)+adj;
    parts.push((k.charAt(0).toUpperCase()+k.slice(1))+' '+adj);
  }
  clampAll();
  let flavor=dn.flavor||'You did nothing. The galaxy noticed.';
  log('[EVENT] '+flavor+(parts.length?' ('+parts.join(', ')+')':''),'bad');
  toast(flavor+(parts.length?' ('+parts.join(', ')+')':''),'bad');
  document.getElementById('event-popup').style.display='none';
  eventOpen=false;
  currentEvent=null;
  spawnP(player.x,player.y,'#c04040',8);
  updateHUD();
  updateGargoyle();
  checkPhase();
  checkLose();
}

// ============================================================
// PHASE SYSTEM
// ============================================================
function checkPhase(){
  if(phase===3&&allAssetsSold()&&S.credits>=PHASE_GOALS[3].credits){winGame();return;}
  if(phase<PHASES.length-1&&PHASES[phase].check(S)){
    phaseTransitionOpen=true;
    let pt=document.getElementById('phase-transition');
    phase++;
    document.getElementById('pt-title').textContent='PHASE '+(phase+1)+' UNLOCKED';
    document.getElementById('pt-title').style.color='#c02020';
    document.getElementById('pt-text').textContent=PHASES[phase].intro;
    document.getElementById('pt-goal').textContent=PHASES[phase].goal;
    let btn=document.getElementById('pt-btn');
    btn.textContent='ENTER '+PHASES[phase].name;
    btn.onclick=()=>{
      capturePhaseSnapshot(phase);
      pt.style.display='none';
      phaseTransitionOpen=false;
      updateHUD();
    };
    pt.style.display='flex';
    log('=== '+PHASES[phase].name+' ===','event');
  }
}

// ============================================================
// WIN — the "carve-up" is complete. You sold the galaxy.
// A victory overlay pulls a random, appropriately condemnatory
// closing joke from the pool (this is, after all, a satire of
// how evil fascism is). The game stops.
// ============================================================

function winGame(){
  gameStarted=false;
  phaseTransitionOpen=false;
  eventOpen=false;
  panelOpen=false;
  let v=document.getElementById('victory');
  document.getElementById('vic-text').textContent=pick(VICTORY_TEXTS);
  let s=S;
  let statsHtml='';
  statsHtml+='<div>Days of Tyranny: <span style="color:#d4a017">'+dayCount+'</span></div>';
  statsHtml+='<div>Final Approval: <span style="color:#c04040">'+Math.round(s.approval)+'%</span> (the people, sadly, never got the choice)</div>';
  statsHtml+='<div>Fortunes Gained: <span style="color:#d4a017">$'+Math.round(s.credits)+'</span> (paid in someone else\u2019s future)</div>';
  statsHtml+='<div>Institutions Broken: <span style="color:#c04040">'+Math.round(100-s.institutions)+'%</span></div>';
  statsHtml+='<div>Population Purged: <span style="color:#c04040">'+Math.round(STARTING.population-s.population)+'</span> (give or take)</div>';
  statsHtml+='<div>Fear: <span style="color:#c04040">'+Math.round(s.fear)+'</span>% and climbing</div>';
  document.getElementById('vic-stats').innerHTML=statsHtml;
  v.style.display='flex';
}

// ============================================================
// LOSE CONDITIONS
// ============================================================
function checkLose(){
  if(gameStarted&&gameTime>=militaryNextRoll){
    militaryNextRoll=gameTime+FRAMES_PER_GAME_HOUR*MILITARY.rollEveryHours;
    if(checkMilitaryDanger())return;
  }
  if(S.credits<=LOSE.bankruptcy){gameOver('You went bankrupt. The creditors came. They took the tower. They took the golden toilets. They took everything. The most spectacular downfall in galactic history. Gargoyliani calls to say he\u2019s \u2018available for legal work.\u2019 You hang up.');return;}
  if(S.approval<=0&&S.fear<LOSE.approvalFearFloor){gameOver('Nobody supports you. Nobody fears you. You are nothing. The streets swallowed you whole. The interpretative dancers dedicate a performance to your downfall. It wins a Moonie.');return;}
  if(S.loyalty<=0){gameOver('Everyone deserted you. Every last one. You are alone in the tower. Completely alone. Even the goons left. They took the baseball bats. Gerald\u2019s wife sends a \u2018sorry for your loss\u2019 card. It\u2019s sarcastic.');return;}
  if(S.population<=0){gameOver('There is nobody left. You ruled over nothing. What have you done? The four moons stare down at you. They\u2019ve seen things. But this? This is new.');return;}
  let totalLegalCost=legalIssues.reduce((a,l)=>a+l.cost,0);
  if(totalLegalCost>S.credits+LOSE.legalOverload&&legalIssues.length>=LOSE.legalOverloadCount){gameOver('The legal system caught up. 50 counts. The most counts ever. You are finished. Gargoyliani\u2019s 47 voicemails are entered into evidence. All of them.');return;}
}

// ============================================================
// MILITARY DANGER
// While military is below the danger zone there is a rolling
// chance each game-hour that the military overthrows you. The
// chance scales up as military drops and fear weakens.
// ============================================================
function militaryBaseChance(){
  let mil=Math.floor(S.military);
  if(mil>=MILITARY.dangerZoneBelow)return 0;
  if(mil<=0)return MILITARY.chanceAtZero;
  // Linear between the danger edge (military 9) and military 1.
  let zoneTop=MILITARY.dangerZoneBelow-1; // 9
  return MILITARY.chanceAtDanger+(zoneTop-mil)*(MILITARY.chanceAtMin-MILITARY.chanceAtDanger)/(zoneTop-1);
}

function militaryFearMult(){
  let baseline=(MILITARY.fearBaseline==null)?STARTING.fear:MILITARY.fearBaseline;
  let cap=MILITARY.modifierCap||0.5;
  let mult;
  if(S.fear>=baseline){
    // Higher fear = safer: fear 25 (baseline+10) => x0.9.
    mult=1-cap*((S.fear-baseline)/50);
  }else{
    // Lower fear = riskier, scales faster: fear 5 (baseline-10) => x1.25.
    mult=1+cap*((baseline-S.fear)/20);
  }
  if(mult<1-cap)mult=1-cap;
  if(mult>1+cap)mult=1+cap;
  return mult;
}

function checkMilitaryDanger(){
  if(!MILITARY.coupInPhase4&&phase===3)return;
  if(S.military>=MILITARY.dangerZoneBelow)return;
  let base=militaryBaseChance();
  let final=base*militaryFearMult();
  if(Math.random()*100<final){
    let msg=(MILITARY.messages&&MILITARY.messages.overthrown)||'The military has had enough. They dragged you out by your feet, still shouting about the size of your crowd. Total terraforming: FAILED.';
    gameOver(msg);
    return true;
  }
  // Extra warnings when military is dangerously low.
  if(S.military>=1&&S.military<MILITARY.warnBelow&&gameTime>=militaryNextWarn){
    let m=(S.military<Math.max(1,MILITARY.warnBelow/2))?(MILITARY.messages&&MILITARY.messages.warnCritical)||'Your military is nearly non-existent. Overthrow is imminent.':(MILITARY.messages&&MILITARY.messages.warnLow)||'Your military is dangerously low. The troops are going to mutiny.';
    toast(m,'bad');
    log('MILITARY: '+m,'bad');
    militaryNextWarn=gameTime+FRAMES_PER_GAME_HOUR*MILITARY.warnEveryHours;
  }
  return false;
}

function gameOver(text){
  let o=document.getElementById('overlay');
  document.getElementById('ol-title').textContent='REMOVED';
  document.getElementById('ol-title').style.color='#c02020';
  document.getElementById('ol-text').textContent=text;
  let statsHtml='';
  statsHtml+='<div>Phase: <span style="color:#d4a017">'+PHASES[phase].name+'</span></div>';
  statsHtml+='<div>Days Survived: <span style="color:#d4a017">'+dayCount+'</span></div>';
  statsHtml+='<div>Approval: <span style="color:'+(S.approval>=PHASE_GOALS[0].approval?'#40c040':'#c04040')+'">'+Math.round(S.approval)+'%</span></div>';
  statsHtml+='<div>Credits: <span style="color:#d4a017">'+Math.round(S.credits)+'</span></div>';
  statsHtml+='<div>Fear: <span style="color:#c04040">'+Math.round(S.fear)+'</span></div>';
  statsHtml+='<div>Loyalty: <span style="color:#4040c0">'+Math.round(S.loyalty)+'</span></div>';
  document.getElementById('ol-stats').innerHTML=statsHtml;
  o.style.display='flex';
}

// "Retry Phase" — restore the exact state from the start of the phase the
// player died in and resume play. Falls back to a full reload if no snapshot.
function restoreFromPhaseSnapshot(){
  const snap=phaseSnapshots[phase];
  if(!snap){location.reload();return;}
  document.getElementById('overlay').style.display='none';
  document.getElementById('log-overlay').style.display='none';
  document.getElementById('log-backdrop').style.display='none';
  document.getElementById('stats-overlay').style.display='none';
  document.getElementById('stats-backdrop').style.display='none';
  initGame(snap);
  gameStarted=true;
  document.body.classList.add('game-running');
  requestAnimationFrame(gameLoop);
}

// ============================================================
// AMBIENT
// Default content here acts as a fallback when data/ambient.js is
// absent; otherwise it is replaced at startup by buildRuntimeData().
// ============================================================

// ============================================================
// DAY / AP SYSTEM
// ============================================================
// Reset per-day interaction caps: NPCs become interactable again and
// every building action becomes available again.
function resetDailyInteractions(){
  usedActions={};
  for(let n of npcs){
    n.interactedToday=false;
    n.lastKind=null;
    n.lastResult=null;
  }
}

function endDay(){
  dayCount++;
  hourOfDay=8;
  ap=AP_PER_DAY;
  resetDailyInteractions();
  let cost=UPKEEP.base+Math.floor(S.military/UPKEEP.militaryDiv);
  if(S.loyalty>UPKEEP.loyaltyFloor)cost+=Math.floor((S.loyalty-UPKEEP.loyaltyFloor)/UPKEEP.loyaltyDiv);
  if(S.fear>UPKEEP.fearFloor)cost+=Math.floor((S.fear-UPKEEP.fearFloor)/UPKEEP.fearDiv);
  let sevTotal=legalIssues.length?totalSeverity():0;
  if(sevTotal>0)cost+=sevTotal*LEGAL.upkeepPerSevPoint;
  S.credits-=cost;
  log('Day '+dayCount+'. Daily upkeep: -$'+cost+(sevTotal>0?' (includes $'+(sevTotal*LEGAL.upkeepPerSevPoint)+' keeping '+sevTotal+' points of legal trouble quiet)':'')+' (Gargoyliani claims this is \u2018normal.\u2019 It is not.)','bad');
  if(S.credits<-50){S.loyalty-=ir(2,4);log('Unpaid staff losing loyalty! They\u2019re updating their resumes.','bad');}
  if(S.credits<-100){S.military-=ir(1,3);log('Deserters leaving unpaid posts! They\u2019re taking the good office chairs.','bad');}
  if(dayCount>3&&Math.random()<0.2){S.approval-=ir(1,2);log('Opposition gaining ground. They have signs. Nice ones, too.','bad');}
  if(S.fear>20&&Math.random()<0.25){S.fear-=ir(1,2);log('Fear fading. Time for a reminder.','');}
  if(S.loyalty>30&&Math.random()<0.15){S.loyalty-=ir(1,2);log('Inner circle grumbling. They\u2019ll stop. Or else.','bad');}
  if(S.population<120&&Math.random()<0.1){let p=ir(1,3);S.population+=p;log('Population growing (+'+p+'). More people to impress. Or deport.','');}
  updateLegal();
  if(dayCount>=2&&Math.random()<0.12)spawnLegal();
  if(dayCount>=4&&Math.random()<0.08)spawnLegal();
  // Nightly pressure: if you're carrying legal trouble, the law rears up.
  if(legalIssues.length>0&&dayCount>1)fireLegalEvent();
  let flipChance=getGargoyleFlipChance();
  if(flipChance>0){
    if(Math.random()*100<flipChance){
      gameOver(pick(GARGOYLE_FLIP_TEXTS));
      return;
    }
    log('Gargoyliani survived the night. He\u2019s watching the exits. Flip risk today was '+flipChance+'%. Tomorrow the dice roll again.','bad');
    updateGargoyle();
  }
}

let gameStarted=false;

// ============================================================
// GAME LOOP
// ============================================================
function gameLoop(){
  if(!gameStarted)return;
  if(!worldCanvas||!map){requestAnimationFrame(gameLoop);return;}
  let ol=document.getElementById('overlay');
  if(ol.style.display==='flex'){requestAnimationFrame(gameLoop);return;}
  if(!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!statsOpen){
    gameTime++;
    let newHour=8+Math.floor(gameTime/FRAMES_PER_GAME_HOUR)%14;
    if(newHour<hourOfDay){endDay();}
    hourOfDay=newHour;
    if(gameTime%(FRAMES_PER_GAME_HOUR*4)===0){
      S.approval+=Math.random()<0.25?-1:0;
      S.fear+=Math.random()<0.2?-1:0;
      clampAll();
    }
    // Media pressure — if you're not controlling the press, approval and fear
    // drain on the sliding scale; if you've got the narrative, approval is spared.
    if(gameTime%(FRAMES_PER_GAME_HOUR*MEDIA.tickEveryHours)===0&&gameTime>0){
      let mediaHit=false;
      if(S.media<MEDIA.bufferFloor){
        S.approval-=MEDIA.approvalDrain;S.fear-=MEDIA.fearDrain;mediaHit=true;
      }else if(S.media>MEDIA.bufferCeil){
        S.approval+=MEDIA.approvalGain;mediaHit=true;
      }
      clampAll();
      if(mediaHit)log('The media hums. '+(S.media<MEDIA.bufferFloor?'The presses run wild. The people sour and the state\u2019s fear thins. Approval -'+MEDIA.approvalDrain+', Fear -'+MEDIA.fearDrain+'. Get the narrative under control.':'The narrative holds. Your moment on the ticker smooths it all over. Approval +'+MEDIA.approvalGain+'.'),S.media<MEDIA.bufferFloor?'bad':'good');
    }
    // Institutional regen: a game-hour tick, active only from Phase III+.
    if(phase>=INSTITUTIONS.regenStartPhase){
      instHourTick++;
      if(instHourTick>=INSTITUTIONS.regenEveryHours){
        instHourTick=0;
        if(S.institutions<INSTITUTIONS.regenCap){
          S.institutions=clampVal(S.institutions+INSTITUTIONS.regenPerTick,0,STAT_MAXES.institutions);
          if(Math.random()<0.5)log('Institutions regenerating (+'+INSTITUTIONS.regenPerTick+'). The system is healing. That is a threat.','bad');
        }
      }
    }
    // Legal-event roller: only when you owe the law something.
    if(legalIssues.length>0&&dayCount>(LEGAL.noEventsDay1?1:0)){
      legalEventTimer--;
      if(legalEventTimer<=0){
        fireLegalEvent();
        legalEventTimer=rand(LEGAL.eventIntervalMin,LEGAL.eventIntervalMax);
      }
    }
    nextEventTimer--;
    if(nextEventTimer<=0){triggerEvent();nextEventTimer=rand(EVENT_CFG.intervalMin,EVENT_CFG.intervalMax);}
    if(gameTime%(FRAMES_PER_GAME_HOUR*20)===0&&npcs.length<NPC_CFG.maxCount){
      let def=pickUncappedType();
      npcs.push(new NPC(def,rand(TILE*4,WORLD_W-TILE*4),rand(TILE*4,WORLD_H-TILE*4)));
    }
    if(gameTime%(Math.round(FRAMES_PER_GAME_HOUR*12.5))===0&&Math.random()<0.25)toast(pick(AMBIENT),'');
    updatePlayer();
    updateCamera();
    updateHUD();
    updateGargoyle();
    updateLegalGauge();
    let clk=document.getElementById('clock');
    if(clk)clk.textContent='DAY '+dayCount+' — '+String(hourOfDay).padStart(2,'0')+':00';
    if(minimapOpen)drawMinimap();
    clampAll();
    checkLose();
  }
  updatePrompt();
  drawWorld();
  entCtx.clearRect(0,0,entCanvas.width,entCanvas.height);
  for(let n of npcs)n.update(),n.draw(entCtx);
  drawPlayer();
  drawNearestBuildingArrow();
  for(let i=particles.length-1;i>=0;i--){particles[i].update();particles[i].draw(entCtx);if(particles[i].life<=0)particles.splice(i,1);}
  requestAnimationFrame(gameLoop);
}

function clampAll(){
  S.credits=Math.round(clampVal(S.credits,LOSE.bankruptcyClamp,STAT_MAXES.credits));
  S.approval=clampVal(S.approval,0,STAT_MAXES.approval);
  S.fear=clampVal(S.fear,0,STAT_MAXES.fear);
  S.loyalty=clampVal(S.loyalty,0,STAT_MAXES.loyalty);
  S.military=clampVal(S.military,0,STAT_MAXES.military);
  S.institutions=clampVal(S.institutions,0,STAT_MAXES.institutions);
  S.population=clampVal(S.population,0,STAT_MAXES.population);
  S.media=clampVal(S.media,0,STAT_MAXES.media);
}

// ============================================================
// INPUT
// ============================================================
// MINIMAP
// ============================================================
let minimapOpen=false;
function toggleMinimap(){
  minimapOpen=!minimapOpen;
  document.getElementById('minimap-wrap').style.display=minimapOpen?'block':'none';
  if(minimapOpen)drawMinimap();
}

// ============================================================
document.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(e.code==='Enter'&&!gameStarted){
    beginGame();
    return;
  }
  if(e.code==='Enter'&&gameStarted&&phaseTransitionOpen){
    let btn=document.getElementById('pt-btn');
    if(btn&&btn.onclick)btn.onclick();
    return;
  }
  if(e.code==='KeyP'){
    if(gameStarted&&!panelOpen&&!eventOpen&&!phaseTransitionOpen){toggleStatsWindow();return;}
  }
  if(e.code==='Escape'){
    if(document.getElementById('stats-overlay')&&document.getElementById('stats-overlay').style.display==='flex'){toggleStatsWindow();return;}
    if(document.getElementById('log-overlay').style.display==='flex'){toggleLog();return;}
    if(document.getElementById('help-overlay').style.display==='flex'){document.getElementById('help-overlay').style.display='none';document.getElementById('help-backdrop').style.display='none';return;}
    if(minimapOpen){toggleMinimap();return;}
    closePanel();
    if(eventOpen&&currentEvent){applyDoNothing(currentEvent);}
    return;
  }
  if(e.code==='KeyM'&&!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!statsOpen){toggleMinimap();return;}
  if(e.code==='Slash'&&!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!minimapOpen&&!statsOpen){toggleHelp();return;}
  if((e.code==='KeyE'||e.code==='Space')&&!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!statsOpen){
    if(interactTarget){
      if(interactTarget.actions)openBuildingPanel(interactTarget);
      else if(interactTarget.fullApply||interactTarget.fullActions)openNPCPanel(interactTarget);
    }
  }
});
document.addEventListener('keyup',e=>{keys[e.code]=false;});

// ============================================================
// INIT
// ============================================================
function resize(){
  worldCanvas.width=window.innerWidth;worldCanvas.height=window.innerHeight;
  entCanvas.width=window.innerWidth;entCanvas.height=window.innerHeight;
}

function initGame(fromSnap){
  dbgLog('initGame: starting');
  for(const id of ['ap-num-help','ap-num-title']){const el=document.getElementById(id);if(el)el.textContent=AP_PER_DAY;}
  // Clicking any HUD stat opens the Stats & Goals / pause window.
  document.querySelectorAll('#hud .stat').forEach(st=>{
    st.style.cursor='pointer';
    st.addEventListener('click',(e)=>{
      if(gameStarted&&!panelOpen&&!eventOpen&&!phaseTransitionOpen)toggleStatsWindow();
    });
  });
  buildRuntimeData();
  if(fromSnap){ // Retry Phase: restore this phase's start state
    S=Object.assign({},fromSnap.S);
    legalIssues=fromSnap.legalIssues.map(l=>({name:l.name,cost:l.cost,growth:l.growth,turns:l.turns,sev:l.sev}));
    gargoyleBills=fromSnap.gargoyleBills;
    soldAssets=Object.assign({},fromSnap.soldAssets);
    phase=fromSnap.phase;dayCount=fromSnap.dayCount;gameTime=fromSnap.gameTime;
    usedEventIdx=[].concat(fromSnap.usedEventIdx);
    militaryNextRoll=fromSnap.militaryNextRoll;
    militaryNextWarn=fromSnap.militaryNextWarn;
  }else{ // fresh run
    S={credits:STARTING.credits,approval:STARTING.approval,fear:STARTING.fear,loyalty:STARTING.loyalty,military:STARTING.military,institutions:STARTING.institutions,population:STARTING.population,media:STARTING.media};
    phase=0;dayCount=1;gameTime=0;
    usedEventIdx=[];
    gargoyleBills=0;
    soldAssets={};
    militaryNextRoll=FRAMES_PER_GAME_HOUR*MILITARY.rollEveryHours;
    militaryNextWarn=0;
  }
  ap=AP_PER_DAY;hourOfDay=8;
  nextEventTimer=rand(EVENT_CFG.intervalMin,EVENT_CFG.intervalMax);panelOpen=false;eventOpen=false;phaseTransitionOpen=false;currentEvent=null;statsOpen=false;
  legalEventTimer=rand(LEGAL.eventIntervalMin,LEGAL.eventIntervalMax);instHourTick=0;
  logHistory=[];rexMemoryIdx=-1;
  resetDailyInteractions();
  worldCanvas=document.getElementById('world');
  entCanvas=document.getElementById('entities');
  if(!worldCanvas||!entCanvas){dbgLog('ERROR: canvas elements not found!');return;}
  worldCtx=worldCanvas.getContext('2d');
  entCtx=entCanvas.getContext('2d');
  dbgLog('initGame: canvas ok, resizing');
  resize();
  window.addEventListener('resize',resize);
  spriteImg=new Image();
  spriteImg.onload=()=>{spriteLoaded=true;dbgLog('sprite loaded OK');};
  spriteImg.onerror=()=>{dbgLog('sprite FAILED to load');};
  spriteImg.src='img/rex.jpg';
  dbgLog('initGame: generating map');
  map=generateMap();
  dbgLog('initGame: map generated, spawning NPCs');
  npcs=[];particles=[];
  for(let i=0;i<NPC_CFG.startingCount;i++){
    let def=pickUncappedType();
    let nx,ny,ok=false;
    for(let t=0;t<50;t++){
      nx=rand(TILE*4,WORLD_W-TILE*4);ny=rand(TILE*4,WORLD_H-TILE*4);
      ok=true;
      for(let b of BUILDINGS)if(nx>b.x*TILE-20&&nx<(b.x+b.w)*TILE+20&&ny>b.y*TILE-20&&ny<(b.y+b.h)*TILE+20){ok=false;break;}
      if(ok)break;
    }
    if(ok)npcs.push(new NPC(def,nx,ny));
  }
  dbgLog('initGame: spawned '+npcs.length+' NPCs');
  player.x=11*TILE;player.y=43*TILE;
  dbgLog('initGame: player at '+player.x+','+player.y);
  if(fromSnap){
    log('Phase retry: your recent defeat was clearly stolen from you. A glitch. Fake news.','event');
    log(PHASES[phase].name+' \u2014 starting over, but this time you\u2019ll win. Tremendously.','event');
  }else{
    log('You stand at the entrance of Four Moons Total Terraforming, right where it all went wrong.','event');
    log('Gargoyliani is at the podium. Ectoplasm dripping. Again.','event');
    log('This is your lowest moment. Time to come back. Tremendously.','event');
    setTimeout(()=>toast('WASD to move. Walk to buildings (look for ENTRY markers) and press E to act.',  'good'),1000);
    setTimeout(()=>toast('You have '+AP_PER_DAY+' AP per day. Each day, walk to buildings and spend AP to gain power.',  'good'),4000);
    setTimeout(()=>toast('NPCs (icons on map) give free quick interactions when you walk near them.',  'good'),7000);
  }
  updateHUD();
  updateGargoyle();
  updateLegal();
  capturePhaseSnapshot(phase);
  dbgLog('initGame: complete');
}

function beginGame(){
  try{
    document.getElementById('title-screen').style.display='none';
    initGame();
    gameStarted=true;
    document.body.classList.add('game-running');
    requestAnimationFrame(gameLoop);
  }catch(e){
    console.error('GAME FAILED:',e);
    alert('Error: '+e.message+'\n'+e.stack);
  }
}

// ============================================================
// DEBUG
// ============================================================
let debugLogLines=[];
function dbgLog(msg){
  debugLogLines.push(msg);
  if(debugLogLines.length>100)debugLogLines.shift();
  let el=document.getElementById('debug-log');
  if(el){el.textContent=debugLogLines.join('\n');el.scrollTop=el.scrollHeight;}
}

function updateDebug(){
  let el=document.getElementById('dbg-content');
  if(!el||document.getElementById('debug-panel').style.display!=='block')return;
  let rows=[];
  let r=(k,v,cls)=>rows.push('<div class="dbg-row"><span class="k">'+k+'</span><span class="v '+(cls||'')+'">'+v+'</span></div>');
  r('gameStarted',gameStarted,gameStarted?'ok':'err');
  r('gameTime',gameTime,gameTime>0?'ok':'err');
  r('dayCount',dayCount);
  r('hourOfDay',hourOfDay);
  r('ap',ap+'/'+AP_PER_DAY,ap>0?'ok':'warn');
  r('phase',phase+' ('+PHASES[phase].name+')');
  r('panelOpen',panelOpen,panelOpen?'warn':'ok');
  r('eventOpen',eventOpen,eventOpen?'warn':'ok');
  r('phaseTransitionOpen',phaseTransitionOpen);
  r('interactTarget',interactTarget?interactTarget.name:'null',interactTarget?'ok':'');
  r('worldCanvas',worldCanvas?worldCanvas.width+'x'+worldCanvas.height:'NULL',worldCanvas?'ok':'err');
  r('entCanvas',entCanvas?entCanvas.width+'x'+entCanvas.height:'NULL',entCanvas?'ok':'err');
  r('map',map?'exists ('+MAP_W+'x'+MAP_H+')':'NULL',map?'ok':'err');
  r('spriteLoaded',spriteLoaded,spriteLoaded?'ok':'warn');
  r('player',Math.round(player.x)+','+Math.round(player.y));
  r('camera',Math.round(camera.x)+','+Math.round(camera.y));
  r('npcCount',npcs.length,npcs.length>0?'ok':'warn');
  r('particleCount',particles.length);
  if(typeof S==='object'&&S!==null){
    r('--- stats ---','');
    r('credits',S.credits,S.credits>50?'ok':S.credits>0?'warn':'err');
    r('approval',S.approval,S.approval>40?'ok':S.approval>10?'warn':'err');
    r('fear',S.fear);
    r('loyalty',S.loyalty,S.loyalty>20?'ok':'err');
    r('military',S.military,S.military>10?'ok':'warn');
    r('institutions',S.institutions,S.institutions<30?'ok':'warn');
    r('population',S.population,S.population>20?'ok':'err');
    r('media',S.media);
  } else {
    r('S state','NULL','err');
  }
  r('legalIssues',legalIssues.length);
  r('nextEventTimer',nextEventTimer);
  r('AP_PER_DAY',AP_PER_DAY);
  r('usedActionsCount',Object.keys(usedActions).length);
  r('--- building locks (today) ---','');
  for(const b of BUILDINGS){
    for(const a of b.actions){
      const key=b.id+':'+a.label;
      const locked=a.ignoreDailyCap?false:(usedActions[key]===true);
      r(b.id+' > '+a.label+(a.ignoreDailyCap?' (always)':''),locked?'DONE':'live',locked?'warn':'ok');
      if(locked)r('   key','"'+key+'"');
    }
  }
  el.innerHTML=rows.join('');
}

function debugLoop(){
  if(document.getElementById('debug-panel').style.display==='block')updateDebug();
  setTimeout(debugLoop,200);
}
setTimeout(debugLoop,500);
