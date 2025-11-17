const canvas = document.getElementById('campo');
const ctx = canvas.getContext('2d');

// Campo
function desenharCampo() {
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 10);
  ctx.lineTo(canvas.width / 2, canvas.height - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.stroke();
}

// Jogador (bola maior)
const jogador = {
  x: 100,
  y: canvas.height / 2,
  raio: 25,
  cor: 'blue',
  dx: 0,
  dy: 0,
  velocidade: 4
};

// Bola do jogo (bola menor)
const bola = {
  x: 300,
  y: canvas.height / 2,
  raio: 15,
  cor: 'white',
  dx: 0,
  dy: 0,
  MAX_SPEED: 8
};

let chutarForca = 5;

function desenharBola(obj) {
  ctx.beginPath();
  ctx.fillStyle = obj.cor;
  ctx.arc(obj.x, obj.y, obj.raio, 0, Math.PI * 2);
  ctx.fill();
}

function moverJogador() {
  jogador.x += jogador.dx;
  jogador.y += jogador.dy;
  jogador.x = Math.min(Math.max(jogador.x, 10 + jogador.raio), canvas.width - 10 - jogador.raio);
  jogador.y = Math.min(Math.max(jogador.y, 10 + jogador.raio), canvas.height - 10 - jogador.raio);
}

function moverBola() {
  bola.x += bola.dx;
  bola.y += bola.dy;
  bola.dx *= 0.95;
  bola.dy *= 0.95;
  if (Math.abs(bola.dx) < 0.1) bola.dx = 0;
  if (Math.abs(bola.dy) < 0.1) bola.dy = 0;
  if(bola.x + bola.raio > canvas.width - 10 || bola.x - bola.raio < 10){
    bola.dx = -bola.dx;
    bola.x = bola.x + bola.raio > canvas.width - 10 ? canvas.width - 10 - bola.raio : 10 + bola.raio;
  }
  if(bola.y + bola.raio > canvas.height - 10 || bola.y - bola.raio < 10){
    bola.dy = -bola.dy;
    bola.y = bola.y + bola.raio > canvas.height - 10 ? canvas.height - 10 - bola.raio : 10 + bola.raio;
  }
}

function checarColisao() {
  let dx = bola.x - jogador.x;
  let dy = bola.y - jogador.y;
  let distancia = Math.sqrt(dx * dx + dy * dy);
  if(distancia < bola.raio + jogador.raio){
    let angulo = Math.atan2(dy, dx);
    let forca = 2;
    bola.dx = Math.cos(angulo) * forca;
    bola.dy = Math.sin(angulo) * forca;
    bola.x = jogador.x + Math.cos(angulo) * (bola.raio + jogador.raio);
    bola.y = jogador.y + Math.sin(angulo) * (bola.raio + jogador.raio);
  }
}

function chutar() {
  if(jogador.dx !== 0 || jogador.dy !== 0){
    let angulo = Math.atan2(jogador.dy, jogador.dx);
    bola.dx += Math.cos(angulo) * chutarForca;
    bola.dy += Math.sin(angulo) * chutarForca;
    if (bola.dx > bola.MAX_SPEED) bola.dx = bola.MAX_SPEED;
    if (bola.dx < -bola.MAX_SPEED) bola.dx = -bola.MAX_SPEED;
    if (bola.dy > bola.MAX_SPEED) bola.dy = bola.MAX_SPEED;
    if (bola.dy < -bola.MAX_SPEED) bola.dy = -bola.MAX_SPEED;
  }
}

const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  atualizarDirecao();
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
  atualizarDirecao();
});

function atualizarDirecao(){
  jogador.dx = 0;
  jogador.dy = 0;
  if(keys['ArrowUp']) jogador.dy = -jogador.velocidade;
  if(keys['ArrowDown']) jogador.dy = jogador.velocidade;
  if(keys['ArrowLeft']) jogador.dx = -jogador.velocidade;
  if(keys['ArrowRight']) jogador.dx = jogador.velocidade;
}

document.getElementById('btnChutar').addEventListener('click', () => {
  chutar();
});

function loop(){
  desenharCampo();
  moverJogador();
  moverBola();
  checarColisao();
  desenharBola(jogador);
  desenharBola(bola);
  requestAnimationFrame(loop);
}

loop();