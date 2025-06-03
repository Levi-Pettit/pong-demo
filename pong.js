const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 8;

let leftY  = (canvas.height - PADDLE_HEIGHT) / 2;
let rightY = (canvas.height - PADDLE_HEIGHT) / 2;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 3,
  vy: 2
};

let leftScore = 0;
let rightScore = 0;

function drawPaddles() {
  ctx.fillStyle = "#0f0"; // left paddle green
  ctx.fillRect(10, leftY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = "#f00"; // right paddle red
  ctx.fillRect(canvas.width - 10 - PADDLE_WIDTH, rightY, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

function drawNet() {
  ctx.fillStyle = "#555";
  const netWidth = 2;
  const netHeight = 8;
  for (let y = 0; y < canvas.height; y += netHeight * 2) {
    ctx.fillRect((canvas.width - netWidth) / 2, y, netWidth, netHeight);
  }
}

function clearCanvas() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateScoreboard() {
  scoreboard.textContent = `${leftScore} : ${rightScore}`;
}

function resetBall(winner) {
  if (winner === "left")  leftScore++;
  if (winner === "right") rightScore++;
  updateScoreboard();
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = (winner === "left" ? 3 : -3);
  ball.vy = 2 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
    ball.vy = -ball.vy;
  }

  if (
    ball.x - BALL_RADIUS < 10 + PADDLE_WIDTH &&
    ball.y > leftY &&
    ball.y < leftY + PADDLE_HEIGHT
  ) {
    ball.vx = -ball.vx;
    ball.vy += (Math.random() - 0.5) * 0.5;
  }

  if (
    ball.x + BALL_RADIUS > canvas.width - 10 - PADDLE_WIDTH &&
    ball.y > rightY &&
    ball.y < rightY + PADDLE_HEIGHT
  ) {
    ball.vx = -ball.vx;
    ball.vy += (Math.random() - 0.5) * 0.5;
  }

  if (ball.x - BALL_RADIUS < 0) {
    resetBall("right");
  } else if (ball.x + BALL_RADIUS > canvas.width) {
    resetBall("left");
  }

  const paddleCenter = rightY + PADDLE_HEIGHT / 2;
  if (ball.y < paddleCenter - 10) {
    rightY -= 4;
  } else if (ball.y > paddleCenter + 10) {
    rightY += 4;
  }
  if (rightY < 0) rightY = 0;
  if (rightY + PADDLE_HEIGHT > canvas.height) rightY = canvas.height - PADDLE_HEIGHT;
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  leftY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
  if (leftY < 0) leftY = 0;
  if (leftY + PADDLE_HEIGHT > canvas.height) leftY = canvas.height - PADDLE_HEIGHT;
});

function draw() {
  clearCanvas();
  drawNet();
  drawPaddles();
  drawBall();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

updateScoreboard();
requestAnimationFrame(gameLoop);
