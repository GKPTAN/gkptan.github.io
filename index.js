// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado — iniciando scripts");

  // tratar elemento(s) de e-mail (há duplicates no HTML)
  const emailEls = document.querySelectorAll("#email");
  if (emailEls.length === 0) {
    console.warn("Nenhum #email encontrado");
  } else {
    emailEls.forEach((el) =>
      el.addEventListener("click", (event) => {
        event.preventDefault();
        const email = "alnath165@gmail.com";
        const spansCopy = document.querySelectorAll(".copy");
        navigator.clipboard
          .writeText(email)
          .then(() => {
            if (spansCopy) {
              spansCopy.forEach((sp) => {
                sp.style.opacity = "1";
              });
              setTimeout(() => {
                spansCopy.forEach((sp) => {
                  sp.style.opacity = "0";
                });
              }, 3000);
            }
          })
          .catch((error) => console.error("erro ao copiar e-mail: ", error));
      })
    );
  }

  function updateNavVisibility() {
    try {
      const widthWindow = window.innerWidth;
      const navTop = document.querySelector("#nav-top");
      const footer = document.querySelector("#rodape");

      if (!navTop || !footer) {
        console.warn("nav-top ou rodape não encontrado no DOM");
        return;
      }

      console.log("updateNavVisibility — largura:", widthWindow);
      if (widthWindow <= 768) {
        navTop.style.display = "none";
        footer.style.display = "block";
      } else {
        navTop.style.display = "block";
        footer.style.display = "none";
      }
    } catch (err) {
      console.error("Erro em updateNavVisibility:", err);
    }
  }

  updateNavVisibility();
  window.addEventListener("resize", updateNavVisibility);
});

// Ajuste dinâmico de colunas do grid de projetos (3 → 2 → 1)
document.addEventListener("DOMContentLoaded", () => {
  const lists = Array.from(
    document.querySelectorAll(
      ".projects .events .list-projects, .projects .cursos .list-repositories"
    )
  );
  if (!lists.length) return;

  function px(v) {
    return Math.round(parseFloat(v) || 0);
  }

  function adjustList(list) {
    const cs = getComputedStyle(list);
    const gap = px(cs.gap || cs.columnGap || "0");
    const available = list.clientWidth;

    // tentar a maior quantidade de colunas possível (3 → 1) mantendo cada coluna >= 300px
    for (let cols = 3; cols >= 1; cols--) {
      const colWidth = Math.floor((available - gap * (cols - 1)) / cols);
      if (colWidth >= 300) {
        // usar cols colunas; as colunas terão 1fr, itens têm width:100% e min/max controlados pelo CSS
        list.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        return;
      }
    }

    // fallback: forçar 1 coluna se não couber 300px por coluna
    list.style.gridTemplateColumns = `repeat(1, 1fr)`;
  }

  function adjustAll() {
    lists.forEach(adjustList);
  }

  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(adjustAll, 80);
  });
  window.addEventListener("load", adjustAll);
  adjustAll();
});
// ...existing code...

const canvas = document.getElementById("lightningCanvas");
const ctx = canvas.getContext("2d");

// ===== ESTADO =====
let lightningAlpha = 0;
let flashAlpha = 0;
let lightningPoints = [];
let animating = false;

// ===== RESIZE =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===== GERAR RAIO =====
function generateLightning(x, y, length) {
  const points = [{ x, y }];
  const segments = 15 + Math.random() * 10;

  for (let i = 0; i < segments; i++) {
    x += (Math.random() - 0.5) * 50;
    y += length / segments;
    points.push({ x, y });
  }

  return points;
}

// ===== DESENHAR RAIO =====
function drawLightning(points) {
  ctx.globalAlpha = lightningAlpha;

  // Halo roxo
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = "rgba(190, 61, 197, 0.6)";
  ctx.lineWidth = 6;
  ctx.shadowBlur = 40;
  ctx.shadowColor = "rgba(170, 61, 197, 1)";
  ctx.stroke();

  // Azul
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = "rgba(125, 184, 214, 0.9)";
  ctx.lineWidth = 3;
  ctx.shadowBlur = 25;
  ctx.shadowColor = "rgba(125, 184, 214, 1)";
  ctx.stroke();

  // Núcleo branco
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "white";
  ctx.stroke();

  ctx.globalAlpha = 1;
}

// ===== CLARÃO =====
function drawSkyFlash(x, y) {
  const radius = Math.max(canvas.width, canvas.height) * 0.7;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  gradient.addColorStop(0, `rgba(125, 184, 214, ${flashAlpha})`);
  gradient.addColorStop(0.4, `rgba(125, 184, 214, ${flashAlpha * 0.4})`);
  gradient.addColorStop(1, "rgba(125, 184, 214, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ===== LOOP DE ANIMAÇÃO =====
function animate() {
  if (!animating) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (flashAlpha > 0) {
    drawSkyFlash(canvas.width / 2, canvas.height / 3);
    flashAlpha -= 0.01;
  }

  if (lightningAlpha > 0) {
    drawLightning(lightningPoints);
    lightningAlpha -= 0.04;
  }

  if (lightningAlpha <= 0 && flashAlpha <= 0) {
    animating = false;
    scheduleNextLightning();
    return;
  }

  requestAnimationFrame(animate);
}

// ===== DISPARAR RAIO =====
function triggerLightning() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.3;
  const length = 250 + Math.random() * 300;

  lightningPoints = generateLightning(x, y, length);
  lightningAlpha = 1;
  flashAlpha = 0.35;
  animating = true;

  animate();
}

// ===== INTERVALO ALEATÓRIO =====
function scheduleNextLightning() {
  const delay = Math.random() * 3000 + 2000;
  setTimeout(triggerLightning, delay);
}

// ===== INICIAR =====
scheduleNextLightning();
