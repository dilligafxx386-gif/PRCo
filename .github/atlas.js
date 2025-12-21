const canvas = document.getElementById('atlasCanvas');
const ctx    = canvas.getContext('2d');
const addBtn = document.getElementById('addSticky');

// sizes
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

// view matrix
let scale = 1,  ox = 0, oy = 0;
let isDown = false, startX, startY, startOx, startOy;

// mini-map off by default (toggle in ⚙️ later)
let showMini = true;
const miniSize = 120, miniMargin = 10;

// stickies + lines
let stickies = JSON.parse(localStorage.getItem('atlasStickies')||'[]');
let lines    = JSON.parse(localStorage.getItem('atlasLines')||'[]');

// smooth pan
canvas.addEventListener('mousedown', e => { isDown = true; startX = e.clientX; startY = e.clientY; startOx = ox; startOy = oy; });
addEventListener('mousemove', e => { if (!isDown) return; ox = startOx + (e.clientX - startX); oy = startOy + (e.clientY - startY); draw(); });
addEventListener('mouseup', () => isDown = false);
canvas.addEventListener('mouseleave', () => isDown = false);

// wheel zoom (centered on cursor)
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const mx = e.clientX, my = e.clientY;
  const ws = 1 - e.deltaY * 0.001;
  scale *= ws;
  scale = Math.max(0.2, Math.min(scale, 5));
  ox = mx - (mx - ox) * ws;
  oy = my - (my - oy) * ws;
  draw();
});

// touch zoom + pan
let touchDist = 0;
canvas.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    touchDist = Math.hypot(dx, dy);
  } else if (e.touches.length === 1) {
    isDown = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY; startOx = ox; startOy = oy;
  }
});
addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const newDist = Math.hypot(dx, dy);
    if (touchDist > 0 && newDist > 0) {
      const ws = newDist / touchDist;
      scale *= ws;
      scale = Math.max(0.2, Math.min(scale, 5));
      touchDist = newDist;
      draw();
    }
  } else if (isDown && e.touches.length === 1) {
    ox = startOx + (e.touches[0].clientX - startX);
    oy = startOy + (e.touches[0].clientY - startY);
    draw();
  }
});
addEventListener('touchend', () => { isDown = false; touchDist = 0; });

// add sticky
addBtn.addEventListener('click', () => {
  const txt = prompt('NOTE TEXT:');
  if (!txt) return;
  stickies.push({x:-ox/scale + 200, y:-oy/scale + 200, w:150, h:80, text:txt, color:Math.random()>.5?'#ffb000':'#66ccff'});
  saveAll(); draw();
});

// draw loop
function draw(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(ox,oy);
  ctx.scale(scale,scale);

  // grid
  ctx.strokeStyle = 'rgba(255,176,0,.1)';
  ctx.lineWidth = 1/scale;
  ctx.beginPath();
  for(let x=0;x<4000;x+=50){ctx.moveTo(x,0);ctx.lineTo(x,4000);}
  for(let y=0;y<4000;y+=50){ctx.moveTo(0,y);ctx.lineTo(4000,y);}
  ctx.stroke();

  // stickies
  stickies.forEach(s=>{
    ctx.fillStyle = s.color; ctx.fillRect(s.x,s.y,s.w,s.h);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2/scale; ctx.strokeRect(s.x,s.y,s.w,s.h);
    ctx.fillStyle = '#000'; ctx.font = `${14/scale}px Courier`;
    wrapText(ctx,s.text,s.x+5,s.y+18,140,18*scale);
  });

  // mini-map
  if(showMini) drawMiniMap();

  ctx.restore();
}
function wrapText(ctx,text,x,y,maxW,lineH){
  const words = text.split(' ');
  let line = '';
  for(let n=0;n<words.length;n++){
    const test = line + words[n] + ' ';
    if(ctx.measureText(test).width > maxW && n>0){ ctx.fillText(line,x,y); line = words[n] + ' '; y += lineH; }
    else line = test;
  }
  ctx.fillText(line,x,y);
}
function drawMiniMap(){
  const sx = miniSize / 4000, sy = miniSize / 4000;
  const mx = canvas.width - miniSize - miniMargin, my = miniMargin;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.fillRect(mx,my,miniSize,miniSize);
  ctx.strokeStyle = 'var(--phosphor)';
  ctx.strokeRect(mx,my,miniSize,miniSize);
  // viewport rect
  const vx = -ox/scale*sx + mx, vy = -oy/scale*sy + my,
        vw = canvas.width/scale*sx, vh = canvas.height/scale*sy;
  ctx.strokeStyle = '#fff'; ctx.strokeRect(vx,vy,vw,vh);
}
function saveAll(){
  localStorage.setItem('atlasStickies', JSON.stringify(stickies));
  localStorage.setItem('atlasLines', JSON.stringify(lines));
}

// initial draw
draw();
