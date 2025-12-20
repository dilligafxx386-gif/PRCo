const canvas = document.getElementById('atlasCanvas');
const ctx    = canvas.getContext('2d');
const addBtn = document.getElementById('addSticky');

// make canvas full size
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

// view offset & zoom
let ox = 0, oy = 0, zoom = 1;
let isDown = false, startX, startY, startOx, startOy;

// load saved stickies
const stickies = JSON.parse(localStorage.getItem('atlasStickies') || '[]');

// drag-pan
canvas.addEventListener('mousedown', e => { isDown = true; startX = e.clientX; startY = e.clientY; startOx = ox; startOy = oy; });
addEventListener('mousemove', e => { if (!isDown) return; ox = startOx + (e.clientX - startX); oy = startOy + (e.clientY - startY); draw(); });
addEventListener('mouseup', () => isDown = false);
canvas.addEventListener('mouseleave', () => isDown = false);

// touch support
canvas.addEventListener('touchstart', e => { const t = e.touches[0]; isDown = true; startX = t.clientX; startY = t.clientY; startOx = ox; startOy = oy; });
addEventListener('touchmove', e => { if (!isDown) return; const t = e.touches[0]; ox = startOx + (t.clientX - startX); oy = startOy + (t.clientY - startY); draw(); });
addEventListener('touchend', () => isDown = false);

// add sticky
addBtn.addEventListener('click', () => {
  const txt = prompt('NOTE TEXT:');
  if (!txt) return;
  stickies.push({x:-ox + 200, y:-oy + 200, w:150, h:80, text:txt, color:Math.random()>.5?'#ffb000':'#66ccff'});
  saveStickies(); draw();
});

// draw loop
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(ox,oy);
  // grid
  ctx.strokeStyle = 'rgba(255,176,0,.1)';
  ctx.beginPath();
  for(let x=0;x<4000;x+=50){ctx.moveTo(x,0);ctx.lineTo(x,4000);}
  for(let y=0;y<4000;y+=50){ctx.moveTo(0,y);ctx.lineTo(4000,y);}
  ctx.stroke();
  // stickies
  stickies.forEach(s=>{
    ctx.fillStyle = s.color; ctx.fillRect(s.x,s.y,s.w,s.h);
    ctx.strokeStyle = '#000'; ctx.strokeRect(s.x,s.y,s.w,s.h);
    ctx.fillStyle = '#000'; ctx.font = '14px Courier';
    wrapText(ctx,s.text,s.x+5,s.y+18,140,18);
  });
  ctx.restore();
}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  const words = text.split(' ');
  let line = '';
  for(let n=0;n<words.length;n++){
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0){ ctx.fillText(line,x,y); line = words[n] + ' '; y += lineHeight; }
    else line = testLine;
  }
  ctx.fillText(line,x,y);
}
function saveStickies(){ localStorage.setItem('atlasStickies', JSON.stringify(stickies)); }

// initial draw
draw();