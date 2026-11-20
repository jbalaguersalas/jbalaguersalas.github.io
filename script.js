// ===== Ajustes =====
const usuario = "jbalaguersalas";
const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Con esta clase el CSS sabe que hay JavaScript y puede esconder cosas para animarlas
document.documentElement.classList.add("js");


// ===== Barra de progreso al hacer scroll =====
const barra = document.querySelector(".progreso");

window.addEventListener("scroll", () => {
  const total = document.body.scrollHeight - window.innerHeight;
  barra.style.width = (window.scrollY / total) * 100 + "%";
});


// ===== Terminal: las líneas salen una a una =====
const terminal = document.getElementById("terminal");
const lineas = terminal.innerHTML.split("\n");

if (!sinAnimaciones) {
  terminal.innerHTML = "";
  lineas.forEach((linea, i) => {
    setTimeout(() => {
      terminal.innerHTML = lineas.slice(0, i + 1).join("\n") + '<span class="cursor-terminal"></span>';
    }, 900 + i * 180);
  });
}


// ===== Contadores que suben de 0 a su número =====
function contar(elemento) {
  const fin = Number(elemento.dataset.fin);
  if (sinAnimaciones) {
    elemento.textContent = fin;
    return;
  }
  let actual = 0;
  const paso = Math.max(1, Math.ceil(fin / 40));
  const intervalo = setInterval(() => {
    actual = Math.min(actual + paso, fin);
    elemento.textContent = actual;
    if (actual === fin) clearInterval(intervalo);
  }, 30);
}


// ===== Aparecer al hacer scroll =====
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add("visible");
    if (entrada.target.classList.contains("contador")) contar(entrada.target);
    observador.unobserve(entrada.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".revelar, .contador").forEach((el) => observador.observe(el));


// ===== Luz que sigue al ratón en los proyectos =====
document.querySelectorAll(".proyecto").forEach((proyecto) => {
  proyecto.addEventListener("mousemove", (e) => {
    const caja = proyecto.getBoundingClientRect();
    proyecto.style.setProperty("--x", e.clientX - caja.left + "px");
    proyecto.style.setProperty("--y", e.clientY - caja.top + "px");
  });
});


// ===== Datos en directo de GitHub =====
function haceCuanto(fecha) {
  const minutos = Math.round((Date.now() - new Date(fecha)) / 60000);
  if (minutos < 60) return `hace ${minutos} min`;
  if (minutos < 1440) return `hace ${Math.round(minutos / 60)} h`;
  return `hace ${Math.round(minutos / 1440)} días`;
}

// Número de repos públicos
fetch(`https://api.github.com/users/${usuario}`)
  .then((res) => res.json())
  .then((datos) => {
    if (datos.public_repos) document.getElementById("repos").dataset.fin = datos.public_repos;
  })
  .catch(() => {});

// Último repo en el que he subido algo
fetch(`https://api.github.com/users/${usuario}/repos?sort=pushed&per_page=1`)
  .then((res) => res.json())
  .then(([repo]) => {
    document.getElementById("ultimo-push").textContent = `Último push ${haceCuanto(repo.pushed_at)} · ${repo.name}`;
  })
  .catch(() => {});

// Gráfica de contribuciones de las últimas 16 semanas
fetch(`https://github-contributions-api.jogruber.de/v4/${usuario}?y=last`)
  .then((res) => res.json())
  .then((datos) => {
    document.getElementById("contribuciones").dataset.fin = datos.total.lastYear;

    const dias = datos.contributions.filter((d) => new Date(d.date) <= new Date()).slice(-112);
    const cuadros = document.getElementById("cuadros");

    // Huecos para que la primera columna empiece en domingo
    const hueco = new Date(dias[0].date).getDay();
    for (let i = 0; i < hueco; i++) cuadros.innerHTML += "<span></span>";

    dias.forEach((dia, i) => {
      const plural = dia.count === 1 ? "contribución" : "contribuciones";
      cuadros.innerHTML += `<span class="nivel-${dia.level}" style="--i:${i}" title="${dia.count} ${plural} el ${dia.date}"></span>`;
    });

    document.getElementById("actividad").hidden = false;
  })
  .catch(() => {});
