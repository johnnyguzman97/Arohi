// Grab elements & context
const canvas       = document.getElementById('gameCanvas');
const ctx          = canvas.getContext('2d');
const startOverlay = document.getElementById('startOverlay');
const startBtn     = document.getElementById('startBtn');
const messageEl    = document.getElementById('message');

// Load Mapple image
const catImg = new Image();
catImg.src   = 'assets/mapple.png';

// Game values
typeof speed === 'undefined' && (speed = 2);
let cat = { x: 50, y: canvas.height / 2, width: 80, height: 80 };
let heart = { x: canvas.width - 100, y: canvas.height / 2, size: 30 };
let walkAngle = 0;
let caught = false;

// Draw a heart
function drawHeart(x, y, size) {
  ctx.save();
  ctx.beginPath();
  const t = size * 0.3;
  ctx.moveTo(x, y + t);
  ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + t);
  ctx.bezierCurveTo(x - size/2, y + (size + t)/2, x, y + (size + t)/2, x, y + size);
  ctx.bezierCurveTo(x, y + (size + t)/2, x + size/2, y + (size + t)/2, x + size/2, y + t);
  ctx.bezierCurveTo(x + size/2, y, x, y, x, y + t);
  ctx.closePath();
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.restore();
}

// Move cat toward heart
function updateCat() {
  const dx = heart.x - cat.x;
  const dy = heart.y - cat.y;
  const d = Math.hypot(dx, dy);
  if (d > speed) {
    cat.x += (dx / d) * speed;
    cat.y += (dy / d) * speed;
  }
}

// Check collision
function isCaught() {
  const dx = cat.x - heart.x;
  const dy = cat.y - heart.y;
  return Math.hypot(dx, dy) < (cat.width/2 + heart.size/2) * 0.5;
}

// Main loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw heart
  drawHeart(heart.x, heart.y, heart.size);

  // Bobbing effect
  walkAngle += 0.15;
  const bob = Math.sin(walkAngle) * 5;

  // Draw cat
  ctx.drawImage(
    catImg,
    cat.x - cat.width/2,
    cat.y - cat.height/2 + bob,
    cat.width,
    cat.height
  );

  updateCat();

  if (!caught && isCaught()) {
    caught = true;
    messageEl.classList.remove('hidden');
    // Confetti on catch
    confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 } });
  }

  if (!caught) requestAnimationFrame(loop);
}

// Start on button click
startBtn.addEventListener('click', () => {
  startOverlay.classList.add('hidden');
  loop();
});