// ============================================================
// RENDER & ENGINE
// Pure draw/map/particle/camera helpers, extracted from js/game.js
// for readability. Loads BEFORE js/game.js (they are called at runtime).
// Shared globals (camera, worldCanvas, map, particles, player, phase,
// BUILDINGS) are declared in js/game.js - resolution happens at call
// time, so cross-file order only matters for PARSE-time references.
// ============================================================
function generateMap(){
  let m=[];
  for(let y=0;y<MAP_H;y++){
    m[y]=[];
    for(let x=0;x<MAP_W;x++){
      if(x<=1||y<=1||x>=MAP_W-2||y>=MAP_H-2){m[y][x]=3;continue;}
      if((x>=20&&x<=22)||(x>=35&&x<=37)||(x>=50&&x<=52)||(x>=65&&x<=67)){m[y][x]=1;continue;}
      if((y>=5&&y<=6)||(y>=18&&y<=19)||(y>=30&&y<=31)||(y>=42&&y<=43)){m[y][x]=1;continue;}
      let nearRoad=false;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        let ny=y+dy,nx=x+dx;
        if(ny>=0&&ny<MAP_H&&nx>=0&&nx<MAP_W&&m[ny]&&m[ny][nx]===1)nearRoad=true;
      }
      if(nearRoad){m[y][x]=2;continue;}
      m[y][x]=0;
    }
  }
  for(let b of BUILDINGS)for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(y>=0&&y<MAP_H&&x>=0&&x<MAP_W)m[y][x]=0;
  return m;
}

function drawWorld(){
  let vw=worldCanvas.width,vh=worldCanvas.height;
  worldCtx.fillStyle='#000';
  worldCtx.fillRect(0,0,vw,vh);
  let sx=Math.max(0,Math.floor(camera.x/TILE));
  let sy=Math.max(0,Math.floor(camera.y/TILE));
  let ex=Math.min(MAP_W,Math.ceil((camera.x+vw)/TILE)+1);
  let ey=Math.min(MAP_H,Math.ceil((camera.y+vh)/TILE)+1);
  for(let y=sy;y<ey;y++){
    for(let x=sx;x<ex;x++){
      let t=map[y][x];
      let dx=x*TILE-camera.x,dy=y*TILE-camera.y;
      worldCtx.fillStyle=TILE_COLORS[t];
      worldCtx.fillRect(dx,dy,TILE,TILE);
      if(t===2){worldCtx.fillStyle='#3a3830';worldCtx.fillRect(dx+2,dy+2,TILE-4,TILE-4);}
    }
  }
  for(let b of BUILDINGS){
    let dx=b.x*TILE-camera.x,dy=b.y*TILE-camera.y;
    let dw=b.w*TILE,dh=b.h*TILE;
    let unlocked=phase>=b.unlockPhase;
    // Building floor - clearly distinct from terrain
    worldCtx.fillStyle=unlocked?'#1a1218':'#111';
    worldCtx.fillRect(dx,dy,dw,dh);
    // Thick bright border
    worldCtx.strokeStyle=unlocked?b.color:'#333';
    worldCtx.lineWidth=3;
    worldCtx.strokeRect(dx+1,dy+1,dw-2,dh-2);
    worldCtx.lineWidth=1;
    // Interior tile pattern (unlocked only)
    if(unlocked){
      worldCtx.fillStyle='rgba(200,160,60,.08)';
      for(let wy=b.y+1;wy<b.y+b.h-1;wy++)for(let wx=b.x+1;wx<b.x+b.w-1;wx+=2){
        worldCtx.fillRect(wx*TILE-camera.x+6,wy*TILE-camera.y+6,TILE-12,TILE-12);
      }
    }
    // Draw door marker
    if(b.door&&unlocked){
      let dr=getDoorRect(b);
      if(dr){
        worldCtx.fillStyle='rgba(200,30,30,.3)';
        worldCtx.fillRect(dr.x1-camera.x,dr.y1-camera.y,dr.x2-dr.x1,dr.y2-dr.y1);
        worldCtx.strokeStyle='#ff4040';
        worldCtx.lineWidth=2;
        worldCtx.strokeRect(dr.x1-camera.x,dr.y1-camera.y,dr.x2-dr.x1,dr.y2-dr.y1);
        worldCtx.lineWidth=1;
        worldCtx.font='bold 10px "VT323",monospace';
        worldCtx.textAlign='center';
        worldCtx.fillStyle='#ff6060';
        worldCtx.fillText('ENTRY',(dr.x1+dr.x2)/2-camera.x,(dr.y1+dr.y2)/2-camera.y+3);
        worldCtx.textAlign='left';
      }
    }
    worldCtx.font='bold 14px "VT323",monospace';
    worldCtx.textAlign='center';
    let label=b.icon+' '+(phase>=b.unlockPhase?b.upgradedName:b.name);
    if(!unlocked)label+=' [LOCKED]';
    let tw=worldCtx.measureText(label).width;
    worldCtx.fillStyle='rgba(0,0,0,.85)';
    worldCtx.fillRect(dx+dw/2-tw/2-6,dy-20,tw+12,22);
    worldCtx.strokeStyle=unlocked?'#c02020':'#555';
    worldCtx.lineWidth=1;
    worldCtx.strokeRect(dx+dw/2-tw/2-6,dy-20,tw+12,22);
    worldCtx.fillStyle=unlocked?'#e04040':'#888';
    worldCtx.fillText(label,dx+dw/2,dy-4);
  }
  worldCtx.textAlign='left';
}

function drawPlayer(){
  let dx=player.x-camera.x,dy=player.y-camera.y+player.bob;
  let t=gameTime*0.05;
  let pulse=1+Math.sin(t)*0.15;
  // Outer glow ring
  entCtx.strokeStyle='rgba(200,30,30,'+(0.25+Math.sin(t)*0.15)+')';
  entCtx.lineWidth=2;
  entCtx.beginPath();entCtx.arc(dx,dy,27*pulse,0,Math.PI*2);entCtx.stroke();
  // Inner circle
  entCtx.fillStyle='#c02020';
  entCtx.beginPath();entCtx.arc(dx,dy,15,0,Math.PI*2);entCtx.fill();
  entCtx.strokeStyle='#ff4040';entCtx.lineWidth=2.5;
  entCtx.beginPath();entCtx.arc(dx,dy,15,0,Math.PI*2);entCtx.stroke();
  entCtx.lineWidth=1;
  // Crosshairs
  entCtx.strokeStyle='rgba(255,60,60,0.7)';
  entCtx.lineWidth=1.5;
  let ch=33;
  entCtx.beginPath();entCtx.moveTo(dx-ch,dy);entCtx.lineTo(dx-21,dy);entCtx.stroke();
  entCtx.beginPath();entCtx.moveTo(dx+21,dy);entCtx.lineTo(dx+ch,dy);entCtx.stroke();
  entCtx.beginPath();entCtx.moveTo(dx,dy-ch);entCtx.lineTo(dx,dy-21);entCtx.stroke();
  entCtx.beginPath();entCtx.moveTo(dx,dy+21);entCtx.lineTo(dx,dy+ch);entCtx.stroke();
  entCtx.lineWidth=1;
  // R letter
  entCtx.fillStyle='#fff';entCtx.font='bold 21px "VT323",monospace';entCtx.textAlign='center';entCtx.textBaseline='middle';
  entCtx.fillText('R',dx,dy);
  // Name label
  entCtx.font='16px "VT323",monospace';
  let nl='REX';let nw=entCtx.measureText(nl).width;
  entCtx.fillStyle='rgba(0,0,0,.7)';
  entCtx.fillRect(dx-nw/2-4,dy+21,nw+8,20);
  entCtx.fillStyle='#c02020';entCtx.fillText(nl,dx,dy+34);
  entCtx.textAlign='left';entCtx.textBaseline='alphabetic';
}

function drawNearestBuildingArrow(){
  if(interactTarget)return;
  let best=null,bestD=Infinity;
  for(let b of BUILDINGS){
    if(phase<b.unlockPhase)continue;
    let bx=b.x*TILE+b.w*TILE/2, by=b.y*TILE+b.h*TILE+TILE*2;
    let d=Math.hypot(player.x-bx,player.y-by);
    if(d<bestD){bestD=d;best=b;}
  }
  if(!best||bestD<200)return;
  let bx=best.x*TILE+best.w*TILE/2-camera.x;
  let by=best.y*TILE+best.h*TILE+TILE*2-camera.y;
  let angle=Math.atan2(by-(player.y-camera.y),bx-(player.x-camera.x));
  let arrowDist=50;
  let ax=(player.x-camera.x)+Math.cos(angle)*arrowDist;
  let ay=(player.y-camera.y)+Math.sin(angle)*arrowDist;
  entCtx.save();
  entCtx.translate(ax,ay);
  entCtx.rotate(angle);
  entCtx.fillStyle='rgba(212,160,23,0.6)';
  entCtx.beginPath();
  entCtx.moveTo(10,0);
  entCtx.lineTo(-5,-6);
  entCtx.lineTo(-5,6);
  entCtx.closePath();
  entCtx.fill();
  entCtx.font='9px "VT323",monospace';
  entCtx.fillStyle='rgba(212,160,23,0.5)';
  entCtx.textAlign='center';
  entCtx.fillText(best.upgradedName.split('—')[0].trim(),0,-10);
  entCtx.restore();
}

class Particle{
  constructor(x,y,color,life){this.x=x;this.y=y;this.color=color;this.vx=(Math.random()-.5)*2;this.vy=(Math.random()-.5)*2;this.life=life||30;this.ml=this.life;this.sz=rand(2,4);}
  update(){this.x+=this.vx;this.y+=this.vy;this.vy+=0.02;this.life--;}
  draw(ctx){ctx.globalAlpha=this.life/this.ml;ctx.fillStyle=this.color;ctx.fillRect(this.x-camera.x-this.sz/2,this.y-camera.y-this.sz/2,this.sz,this.sz);ctx.globalAlpha=1;}
}

function spawnP(x,y,c,n){for(let i=0;i<n;i++)particles.push(new Particle(x,y,c,rand(15,35)));}

function updateCamera(){
  let tx=player.x-worldCanvas.width/2,ty=player.y-worldCanvas.height/2;
  camera.x+=(tx-camera.x)*0.08;camera.y+=(ty-camera.y)*0.08;
  camera.x=clampVal(camera.x,0,WORLD_W-worldCanvas.width);
  camera.y=clampVal(camera.y,0,WORLD_H-worldCanvas.height);
}

function drawMinimap(){
  let c=document.getElementById('minimap');
  if(!c)return;
  let ctx=c.getContext('2d');
  let cw=c.width,ch=c.height;
  let sx=WORLD_W/cw,sy=WORLD_H/ch;
  ctx.fillStyle='#0c0c0c';
  ctx.fillRect(0,0,cw,ch);
  // Draw buildings
  for(let b of BUILDINGS){
    let bx=b.x*TILE/sx,by=b.y*TILE/sy;
    let bw=b.w*TILE/sx,bh=b.h*TILE/sy;
    let unlocked=phase>=b.unlockPhase;
    ctx.fillStyle=unlocked?b.color:'#222';
    ctx.fillRect(bx,by,bw,bh);
    ctx.strokeStyle=unlocked?'rgba(200,30,30,.5)':'#333';
    ctx.lineWidth=1;
    ctx.strokeRect(bx,by,bw,bh);
    if(b.door&&unlocked){
      ctx.fillStyle='#40c040';
      if(b.door.side==='bottom')ctx.fillRect(bx+bw/2-2,by+bh-2,4,3);
    }
  }
  // Player
  let px=player.x/sx,py=player.y/sy;
  ctx.fillStyle='#ff4040';
  ctx.beginPath();
  ctx.arc(px,py,3,0,Math.PI*2);
  ctx.fill();
  ctx.strokeStyle='#fff';
  ctx.lineWidth=1;
  ctx.stroke();
}
