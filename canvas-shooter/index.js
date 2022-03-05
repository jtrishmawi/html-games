const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.getElementById("scoreEl");
const bigScoreEl = document.getElementById("bigScoreEl");
const modalEl = document.getElementById("modalEl");
const startGameBtn = document.getElementById("startGameBtn");

class Player {
  constructor({ x, y, radius, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile {
  constructor({ x, y, radius, color, velocity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor({ x, y, radius, color, velocity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Particle {
  static friction = 0.98;
  constructor({ x, y, radius, color, velocity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= Particle.friction;
    this.velocity.y *= Particle.friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

const player = new Player({
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: "white",
});

let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * 26 + 4;

    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(
      new Enemy({
        x,
        y,
        radius,
        color,
        velocity,
      })
    );
  }, 1000);
}

let animationId;
let score = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    //remove from edges of screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
    projectile.update();
  });

  enemies.forEach((enemy, index) => {
    enemy.update();

    //remove from edges of screen
    if (
      enemy.x + enemy.radius < 0 ||
      enemy.x - enemy.radius > canvas.width ||
      enemy.y + enemy.radius < 0 ||
      enemy.y - enemy.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }

    //end game
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      bigScoreEl.innerHTML = score;
      modalEl.style.display = "flex";
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // when projectile touches enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        // create explosion
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle({
              x: projectile.x,
              y: projectile.y,
              radius: Math.random() * 2,
              color: enemy.color,
              velocity: {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              },
            })
          );
        }
        if (enemy.radius - 10 > 5) {
          // update score
          score += 100;
          scoreEl.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          // update score
          score += 250;
          scoreEl.innerHTML = score;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  projectiles.push(
    new Projectile({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 5,
      color: "white",
      velocity,
    })
  );
});

addEventListener("resize", (e) => {
  canvas.width = e.currentTarget.innerWidth;
  canvas.height = e.currentTarget.innerHeight;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
});

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});
