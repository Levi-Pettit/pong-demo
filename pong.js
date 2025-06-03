// pong.js 
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const paddleWidth = 10, paddleHeight = 80;
let ly = (canvas.height - paddleHeight) / 2;
let ry = (canvas.height - paddleHeight) / 2;
let ball = { x: canvas.width/2, y: canvas.height/2, vx: 3, vy: 2, r: 8 };
function draw() {
  // clear
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // left paddle
  ctx.fillStyle = "#fff";
  ctx.fillRect(10, ly, paddleWidth, paddleHeight);
  // right paddle
  ctx.fillRect(canvas.width - 20, ry, paddleWidth, paddleHeight);
  // ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
  ctx.fill();
}
function update() {
  // basic ball movement + wall bounce
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    ball.vy = -ball.vy;
  }
  // simple paddle collision
  if (
    (ball.x - ball.r < 20 && ball.y > ly && ball.y < ly + paddleHeight) ||
    (ball.x + ball.r > canvas.width - 20 && ball.y > ry && ball.y < ry + paddleHeight)
  ) {
    ball.vx = -ball.vx;
  }
  // reset if out of bounds
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
  }
  // basic AI for right paddle
  ry += (ball.y - (ry + paddleHeight/2)) * 0.05;
}
// player control (mouse)
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  ly = e.clientY - rect.top - paddleHeight/2;
  if (ly < 0) ly = 0;
  if (ly + paddleHeight > canvas.height) ly = canvas.height - paddleHeight;
});
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
