// ============================================================
// TOUCH / MOBILE INPUT
// Virtual joystick + on-screen ACT button + mobile HUD shortcuts.
// Loaded AFTER js/game.js — sets up listeners and exposes the
// joystick vector used by updatePlayer() (in js/game.js) at runtime.
// Desktop keyboard input is untouched — this layer is additive.
// ============================================================

// Module-level joystick vector (normalized 0..1 per axis).
// updatePlayer() reads this via getJoyVector().
let JOY = { dx: 0, dy: 0, active: false };
function getJoyVector(){
  return JOY;
}
// Wired in game.js updatePlayer via the global getJoyVector.
window.getJoyVector = getJoyVector;

// Detect touch-capable devices so we can show the touch UI
// without breaking desktop (which still relies on keyboard).
let isTouchDevice = (()=>{
  if('ontouchstart' in window)return true;
  if(navigator.maxTouchPoints>0)return true;
  return window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
})();

// ============================================================
// GESTURE PREVENTION
// We prevent unwanted pinch-zoom / page scroll ONLY on the raw game
// canvas (via CSS touch-action:none in touch-mode). DOM overlays
// (log/help/stats panels) must keep normal touch scrolling, so we do
// NOT blanket-block touchmove — that would break their scrollbars.
// ============================================================
function preventGesture(ev){
  if(ev.cancelable)ev.preventDefault();
}
// There's nothing to select on the world; kill long-press context menu +
// double-tap zoom bounce on the game container.
const gameArea=document.getElementById('game-container');
if(gameArea){
  gameArea.addEventListener('contextmenu',(e)=>e.preventDefault());
}
// Belt-and-suspenders for iOS gesture (pinch/scale) on the whole page.
document.addEventListener('gesturestart',preventGesture,{passive:false});
document.addEventListener('gesturechange',preventGesture,{passive:false});
document.addEventListener('gestureend',preventGesture,{passive:false});

// ============================================================
// VIRTUAL JOYSTICK — draggable on the left side of the screen.
// ============================================================
const joystick=document.getElementById('joystick');
const knob=document.getElementById('joystick-knob');
const JOY_RADIUS=50;
let joyPointerId=null;     // id of the single touch/pointer driving the joystick
let joyCenter={x:0,y:0};   // screen center of the joystick base

function updateKnob(){
  knob.style.transform='translate('+(JOY.dx*JOY_RADIUS)+'px,'+(JOY.dy*JOY_RADIUS)+'px)';
}

if(joystick){
  // Use Pointer Events when the browser supports them (modern mobile browsers).
  // We exclusively drive the joystick through ONE input path, otherwise the
  // same touch fires both touch* and pointer* events and double-handles input.
  // setPointerCapture keeps tracking the drag even when the thumb slides off
  // the pad — this is the fix for "movement dies as soon as I leave the circle".
  if(window.PointerEvent){
    joystick.addEventListener('pointerdown',(ev)=>{
      if(ev.pointerType!=='touch'&&ev.pointerType!=='pen')return;
      joyPointerId=ev.pointerId;
      const base=joystick.getBoundingClientRect();
      joyCenter={x:base.left+base.width/2,y:base.top+base.height/2};
      try{joystick.setPointerCapture(ev.pointerId);}catch(e){}
      JOY.active=true;
      updateJoystick(ev.clientX,ev.clientY);
      if(ev.cancelable)ev.preventDefault();
    },{passive:false});

    joystick.addEventListener('pointermove',(ev)=>{
      if(!JOY.active||ev.pointerId!==joyPointerId)return;
      if(ev.pointerType!=='touch'&&ev.pointerType!=='pen')return;
      updateJoystick(ev.clientX,ev.clientY);
      if(ev.cancelable)ev.preventDefault();
    },{passive:false});

    const endPointer=(ev)=>{
      if(!JOY.active||ev.pointerId!==joyPointerId)return;
      if(ev.pointerType!=='touch'&&ev.pointerType!=='pen'&&ev.pointerType!=='mouse')return;
      endJoystick();
    };
    joystick.addEventListener('pointerup',endPointer);
    joystick.addEventListener('pointercancel',endPointer);
    // No 'pointerleave' handler: with pointer capture active the pad keeps
    // receiving moves off-element, so leaving the visual circle must NOT stop
    // the drag. Only pointerup/cancel (finger lifted) ends it.
  }else{
    // Fallback: Touch Events only (very old WebKit / IE mobile without Pointer Events).
    joystick.addEventListener('touchstart',(ev)=>{
      const t=ev.changedTouches[0];
      joyPointerId=t.identifier;
      const base=joystick.getBoundingClientRect();
      joyCenter={x:base.left+base.width/2,y:base.top+base.height/2};
      JOY.active=true;
      updateJoystick(t.clientX,t.clientY);
      if(ev.cancelable)ev.preventDefault();
    },{passive:false});

    joystick.addEventListener('touchmove',(ev)=>{
      if(!JOY.active)return;
      let t=null;
      for(let i=0;i<ev.changedTouches.length;i++){
        if(ev.changedTouches[i].identifier===joyPointerId){t=ev.changedTouches[i];break;}
      }
      if(t)updateJoystick(t.clientX,t.clientY);
      if(ev.cancelable)ev.preventDefault();
    },{passive:false});

    const endTouch=(ev)=>{
      for(let i=0;i<ev.changedTouches.length;i++){
        if(ev.changedTouches[i].identifier===joyPointerId){
          endJoystick();
          break;
        }
      }
    };
    joystick.addEventListener('touchend',endTouch);
    joystick.addEventListener('touchcancel',endTouch);
  }
}

function updateJoystick(x,y){
  let dx=x-joyCenter.x, dy=y-joyCenter.y;
  let len=Math.hypot(dx,dy);
  if(len>JOY_RADIUS){dx*=JOY_RADIUS/len;dy*=JOY_RADIUS/len;len=JOY_RADIUS;}
  JOY.dx=dx/JOY_RADIUS;
  JOY.dy=dy/JOY_RADIUS;
  updateKnob();
}
function endJoystick(){
  JOY.dx=0;JOY.dy=0;JOY.active=false;
  if(knob)knob.style.transform='translate(0px,0px)';  // reset the knob to center
  joyPointerId=null;
}

// ============================================================
// ON-SCREEN "ACT" BUTTON — mobile equivalent of E / Space.
// Its visibility is driven from game.js's updatePrompt(), which
// sets ACT_STATE. The click handler mirrors the E-key logic.
// ============================================================
let ACT_TARGET=null;
let ACT_VISIBLE=false;
function setActTarget(t){
  ACT_TARGET=t;
  ACT_VISIBLE=!!t;
  const b=document.getElementById('interact-btn');
  const lbl=document.getElementById('interact-btn-label');
  if(b)b.style.display=(t&&touchUIOn)?'flex':'none';
  // Mirror the desktop "Press E — <name>" prompt on the round tap button.
  if(lbl){
    if(t){
      const nm=t.actions?(phase>=t.unlockPhase?t.upgradedName:t.name):t.name;
      lbl.textContent=nm.trim();
    }else{
      lbl.textContent='ACT';
    }
  }
}
window.setActTarget=setActTarget;

const interactBtn=document.getElementById('interact-btn');
if(interactBtn){
  interactBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    if(panelOpen||eventOpen||phaseTransitionOpen||statsOpen)return;
    if(ACT_TARGET){
      if(ACT_TARGET.actions)openBuildingPanel(ACT_TARGET);
      else if(ACT_TARGET.fullApply||ACT_TARGET.fullActions)openNPCPanel(ACT_TARGET);
    }
  });
}

// ============================================================
// MOBILE HUD SHORTCUTS — P (stats), ? (help), M (minimap), close.
// ============================================================
const touchPause=document.getElementById('touch-pause');
if(touchPause){
  touchPause.addEventListener('click',(e)=>{
    e.stopPropagation();
    if(gameStarted&&!panelOpen&&!eventOpen&&!phaseTransitionOpen)toggleStatsWindow();
  });
}
const touchHelp=document.getElementById('touch-help');
if(touchHelp){
  touchHelp.addEventListener('click',(e)=>{
    e.stopPropagation();
    if(!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!minimapOpen&&!statsOpen)toggleHelp();
  });
}
const touchMinimap=document.getElementById('touch-minimap');
if(touchMinimap){
  touchMinimap.addEventListener('click',(e)=>{
    e.stopPropagation();
    if(!panelOpen&&!eventOpen&&!phaseTransitionOpen&&!statsOpen)toggleMinimap();
  });
}
const touchClose=document.getElementById('touch-close-btn');
if(touchClose){
  touchClose.addEventListener('click',(e)=>{
    e.stopPropagation();
    if(statsOpen){toggleStatsWindow();return;}
    if(document.getElementById('log-overlay').style.display==='flex'){toggleLog();return;}
    if(document.getElementById('help-overlay').style.display==='flex'){document.getElementById('help-overlay').style.display='none';document.getElementById('help-backdrop').style.display='none';return;}
    if(minimapOpen){toggleMinimap();return;}
    closePanel();
    if(eventOpen&&currentEvent){applyDoNothing(currentEvent);}
  });
}

// ============================================================
// APPLY TOUCH-ONLY STYLING — show mobile controls only on touch devices
// and narrow screens. Desktop keeps its keyboard HUD.
// ============================================================
let touchUIOn=false;
function isTouchUI(){return touchUIOn;}
function applyTouchUI(){
  touchUIOn = isTouchDevice || window.innerWidth<=820;
  document.body.classList.toggle('touch-mode',touchUIOn);
  // When leaving touch mode, force the ACT button off (it can't appear
  // on a wide desktop even if there is an interact target).
  if(!touchUIOn){
    const b=document.getElementById('interact-btn');
    if(b)b.style.display='none';
  }else if(ACT_TARGET){
    const b=document.getElementById('interact-btn');
    if(b)b.style.display='flex';
  }
}
// Re-evaluate on resize (orientation change / tablet split screen).
window.addEventListener('resize',applyTouchUI);
document.addEventListener('DOMContentLoaded',applyTouchUI);
// Apply once immediately (scripts run near end of body anyway).
applyTouchUI();

// ============================================================
// Ensure the "Press E" prompt ignores the joystick death zone so the
// ACT button stays the mobile affordance (visual only — handled by CSS
// and setActTarget in updatePrompt).
// ============================================================
