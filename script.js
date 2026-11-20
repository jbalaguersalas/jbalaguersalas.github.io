// ===== Ajustes =====
const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tieneRaton = window.matchMedia("(pointer: fine)").matches;
const hayGsap = window.gsap && window.ScrollTrigger && window.Flip;

// Esto le dice al <head> que el script ha cargado bien
document.documentElement.classList.add("listo");

filtros();
botonCopiar();
barraDeArriba();

if (hayGsap && !sinAnimaciones) {
  gsap.registerPlugin(ScrollTrigger, Flip);
  animaciones();
} else {
  // Sin GSAP o con "reducir movimiento" se ve todo normal, sin animar
  document.documentElement.classList.remove("js");
}


// ===== Filtros de proyectos =====
function filtros() {
  const botones = document.querySelectorAll(".filtro");
  const tarjetas = document.querySelectorAll(".tarjeta");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;

      botones.forEach((b) => {
        b.classList.remove("activo");
        b.setAttribute("aria-pressed", "false");
      });
      boton.classList.add("activo");
      boton.setAttribute("aria-pressed", "true");

      // Flip guarda dónde está cada tarjeta para luego animar el cambio
      // Antes saco las tarjetas que aún no habían aparecido con el scroll, si no se quedan invisibles
      let estado;
      if (hayGsap && !sinAnimaciones) {
        gsap.set(tarjetas, { opacity: 1, y: 0 });
        estado = Flip.getState(tarjetas);
      }

      tarjetas.forEach((tarjeta) => {
        const tipos = tarjeta.dataset.tipo.split(" ");
        if (filtro === "todos" || tipos.includes(filtro)) {
          tarjeta.classList.remove("fuera");
        } else {
          tarjeta.classList.add("fuera");
        }
      });

      if (estado) {
        Flip.from(estado, {
          duration: 0.7,
          ease: "expo.out",
          absolute: true,
          stagger: 0.03,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
          onComplete: () => {
            // Flip a veces deja la tarjeta movida, así que la devuelvo a su sitio
            gsap.set(tarjetas, { x: 0, y: 0 });
            ScrollTrigger.refresh();
          },
        });
      }
    });
  });
}


// ===== Botón de copiar el correo =====
function botonCopiar() {
  const boton = document.getElementById("copiar");
  const texto = boton.querySelector("span");
  const aviso = document.getElementById("aviso");

  boton.addEventListener("click", () => {
    navigator.clipboard.writeText("josebala115@gmail.com")
      .then(() => {
        texto.textContent = "¡Copiado!";
        aviso.textContent = "Correo copiado";
      })
      .catch(() => {
        // Si el navegador no deja copiar, al menos enseño el correo
        aviso.textContent = "josebala115@gmail.com";
      });

    setTimeout(() => {
      texto.textContent = "Copiar correo";
      aviso.textContent = "";
    }, 2500);
  });
}


// ===== Barra de arriba y barra de progreso =====
function barraDeArriba() {
  const barra = document.querySelector(".barra");
  const progreso = document.querySelector(".progreso");
  let scrollAnterior = 0;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    // Fondo oscuro al bajar un poco
    barra.classList.toggle("solida", y > 40);
    // Se esconde si bajas y vuelve si subes
    barra.classList.toggle("oculta", y > scrollAnterior && y > 400);
    scrollAnterior = y;

    const total = document.body.scrollHeight - window.innerHeight;
    progreso.style.transform = "scaleX(" + y / total + ")";
  });

  // Marca en el menú la sección que estás viendo
  const enlaces = document.querySelectorAll(".barra nav a");
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        enlaces.forEach((a) => {
          a.classList.toggle("actual", a.getAttribute("href") === "#" + entrada.target.id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  document.querySelectorAll("section[id]").forEach((s) => observador.observe(s));
}


// ===== Animaciones con GSAP =====
function animaciones() {
  partirTitulos();

  // Escondo lo de la portada para que entre después de la carga
  gsap.set(".titular .trozo, .contacto-titulo .trozo", { yPercent: 115 });
  gsap.set(".aparece", { opacity: 0, y: 24 });
  gsap.set(".rotador span", { yPercent: 110, opacity: 0 });

  cursor();
  fondoDePuntos();
  tarjetas3d();
  botonesMagneticos();
  alHacerScroll();
  recorrido();
  pantallaDeCarga();
}


// ===== Pantalla de carga =====
function pantallaDeCarga() {
  const cargador = document.querySelector(".cargador");
  const numero = document.getElementById("carga");
  document.body.classList.add("cargando");

  // Si ya la has visto en esta visita, va más rápido
  let tiempo = 1.6;
  try {
    if (sessionStorage.getItem("visto")) tiempo = 0.5;
    sessionStorage.setItem("visto", "si");
  } catch (e) {}

  const contador = { valor: 0 };
  const tl = gsap.timeline({ onComplete: terminarCarga });

  tl.from(".cargador-nombre span", { yPercent: 100, opacity: 0, stagger: 0.1, duration: 0.8, ease: "expo.out" }, 0);
  tl.to(contador, {
    valor: 100,
    duration: tiempo,
    ease: "power2.inOut",
    onUpdate: () => (numero.textContent = Math.round(contador.valor)),
  }, 0);
  tl.to(".cargador-barra i", { scaleX: 1, duration: tiempo, ease: "power2.inOut" }, 0);
  tl.to(cargador, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "+=0.15");

  function terminarCarga() {
    cargador.remove();
    document.body.classList.remove("cargando");
    ScrollTrigger.refresh();
    entrarPortada();
  }
}


// ===== Entrada de la portada =====
function entrarPortada() {
  const tl = gsap.timeline();
  tl.to(".titular .trozo", { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" });
  tl.to(".rotador span:first-child", { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" }, "<0.15");
  tl.to(".aparece", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" }, "<0.2");

  escribirTerminal();
  setTimeout(cambiarPalabra, 3000);
}


// ===== La terminal escribe línea a línea =====
function escribirTerminal() {
  const terminal = document.getElementById("terminal");
  const lineas = terminal.innerHTML.split("\n");
  const cursorTerminal = '<span class="cursor-terminal"></span>';

  terminal.innerHTML = cursorTerminal;
  lineas.forEach((linea, i) => {
    setTimeout(() => {
      terminal.innerHTML = lineas.slice(0, i + 1).join("\n") + cursorTerminal;
    }, 500 + i * 150);
  });
}


// ===== La palabra naranja va cambiando =====
function cambiarPalabra() {
  const palabras = document.querySelectorAll(".rotador span");
  let actual = 0;

  setInterval(() => {
    const vieja = palabras[actual];
    actual = (actual + 1) % palabras.length;
    const nueva = palabras[actual];

    gsap.to(vieja, { yPercent: -110, opacity: 0, duration: 0.7, ease: "expo.inOut" });
    gsap.fromTo(nueva, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.inOut" });
  }, 2500);
}


// ===== Partir los títulos en palabras =====
// Cada palabra va dentro de un span para poder subirlas una a una
function partirTitulos() {
  document.querySelectorAll(".partir").forEach((titulo) => {
    const palabras = titulo.textContent.split(" ");
    titulo.setAttribute("aria-label", titulo.textContent);
    titulo.innerHTML = palabras
      .map((p) => '<span class="palabra" aria-hidden="true"><span>' + p + "</span></span>")
      .join(" ");
  });
}


// ===== Cursor =====
function cursor() {
  if (!tieneRaton) return;

  const aro = document.querySelector(".cursor");
  const punto = document.querySelector(".cursor-punto");

  // quickTo es como gsap.to pero pensado para llamarlo muchas veces seguidas
  const aroX = gsap.quickTo(aro, "x", { duration: 0.5, ease: "power3" });
  const aroY = gsap.quickTo(aro, "y", { duration: 0.5, ease: "power3" });
  const puntoX = gsap.quickTo(punto, "x", { duration: 0.1 });
  const puntoY = gsap.quickTo(punto, "y", { duration: 0.1 });

  window.addEventListener("mousemove", (e) => {
    document.body.classList.add("con-cursor");
    aroX(e.clientX);
    aroY(e.clientY);
    puntoX(e.clientX);
    puntoY(e.clientY);
  });

  // Encima de las tarjetas pone "Ver", encima de enlaces y botones solo crece
  document.querySelectorAll("a, button").forEach((el) => {
    let clase = "encima";
    if (el.classList.contains("tarjeta")) clase = "ver";
    el.addEventListener("mouseenter", () => aro.classList.add(clase));
    el.addEventListener("mouseleave", () => aro.classList.remove(clase));
  });
}


// ===== Fondo de puntos de la portada =====
// Una rejilla de puntos en un canvas. Los que están cerca del ratón se apartan y se ponen naranjas.
function fondoDePuntos() {
  const canvas = document.getElementById("puntos");
  const ctx = canvas.getContext("2d");
  const portada = document.querySelector(".portada");
  const hueco = 34;
  const radio = 160;
  let puntos = [];
  let raton = { x: -1000, y: -1000 };
  let seVe = true;

  function crearPuntos() {
    canvas.width = portada.offsetWidth;
    canvas.height = portada.offsetHeight;
    puntos = [];
    for (let x = hueco / 2; x < canvas.width; x += hueco) {
      for (let y = hueco / 2; y < canvas.height; y += hueco) {
        puntos.push({ x: x, y: y, xInicial: x, yInicial: y });
      }
    }
  }

  function dibujar() {
    if (!seVe) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    puntos.forEach((p) => {
      const dx = p.xInicial - raton.x;
      const dy = p.yInicial - raton.y;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      let cerca = 0;
      let destinoX = p.xInicial;
      let destinoY = p.yInicial;

      if (distancia < radio && distancia > 0) {
        cerca = 1 - distancia / radio;
        destinoX += (dx / distancia) * cerca * 22;
        destinoY += (dy / distancia) * cerca * 22;
      }

      // Se mueven poco a poco hacia su sitio
      p.x += (destinoX - p.x) * 0.15;
      p.y += (destinoY - p.y) * 0.15;

      if (cerca > 0) {
        ctx.fillStyle = "rgba(255, 107, 53, " + (0.25 + cerca * 0.75) + ")";
      } else {
        ctx.fillStyle = "rgba(237, 237, 234, 0.11)";
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1 + cerca * 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  crearPuntos();
  gsap.ticker.add(dibujar);
  window.addEventListener("resize", crearPuntos);

  portada.addEventListener("mousemove", (e) => {
    const caja = portada.getBoundingClientRect();
    raton.x = e.clientX - caja.left;
    raton.y = e.clientY - caja.top;
  });
  portada.addEventListener("mouseleave", () => {
    raton = { x: -1000, y: -1000 };
  });

  // Si la portada no se ve, no dibujo nada para no gastar
  new IntersectionObserver((entradas) => {
    seVe = entradas[0].isIntersecting;
  }).observe(portada);
}


// ===== Tarjetas: luz e inclinación con el ratón =====
function tarjetas3d() {
  if (!tieneRaton) return;

  document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    gsap.set(tarjeta, { transformPerspective: 1100 });
    const giroX = gsap.quickTo(tarjeta, "rotationX", { duration: 0.6, ease: "power3" });
    const giroY = gsap.quickTo(tarjeta, "rotationY", { duration: 0.6, ease: "power3" });
    // La grande se inclina menos porque si no queda raro
    const fuerza = tarjeta.classList.contains("grande") ? 3 : 6;

    tarjeta.addEventListener("mousemove", (e) => {
      const caja = tarjeta.getBoundingClientRect();
      const x = e.clientX - caja.left;
      const y = e.clientY - caja.top;

      tarjeta.style.setProperty("--x", x + "px");
      tarjeta.style.setProperty("--y", y + "px");
      giroY((x / caja.width - 0.5) * fuerza);
      giroX((0.5 - y / caja.height) * fuerza);
    });

    tarjeta.addEventListener("mouseleave", () => {
      giroX(0);
      giroY(0);
    });
  });
}


// ===== Botones que se van hacia el ratón =====
function botonesMagneticos() {
  if (!tieneRaton) return;

  document.querySelectorAll(".magnetico").forEach((boton) => {
    boton.addEventListener("mousemove", (e) => {
      const caja = boton.getBoundingClientRect();
      const x = e.clientX - caja.left - caja.width / 2;
      const y = e.clientY - caja.top - caja.height / 2;
      gsap.to(boton, { x: x * 0.3, y: y * 0.35, duration: 0.4 });
    });
    boton.addEventListener("mouseleave", () => {
      gsap.to(boton, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    });
  });
}


// ===== Cosas que aparecen al hacer scroll =====
function alHacerScroll() {
  // Títulos palabra a palabra
  document.querySelectorAll(".partir").forEach((titulo) => {
    gsap.from(titulo.querySelectorAll(".palabra > span"), {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.06,
      ease: "expo.out",
      scrollTrigger: { trigger: titulo, start: "top 85%" },
    });
  });

  document.querySelectorAll(".titulo .num, .titulo > p").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 20, duration: 0.9, scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // La cinta gira un poco mientras bajas
  gsap.to(".cinta", {
    rotate: 1.2,
    scrollTrigger: { trigger: ".cinta", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Números que suben de 0 a su valor
  document.querySelectorAll(".contador").forEach((el) => {
    const numero = { valor: 0 };
    el.textContent = "0";
    gsap.to(numero, {
      valor: el.dataset.fin,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => (el.textContent = Math.round(numero.valor)),
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  gsap.from(".numero", {
    y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".numeros", start: "top 85%" },
  });

  gsap.from(".filtro", {
    y: 20, opacity: 0, stagger: 0.05, duration: 0.7,
    scrollTrigger: { trigger: ".filtros", start: "top 90%" },
  });

  // Tarjetas y apuntes: batch los saca por grupos según van entrando en pantalla
  gsap.set(".tarjeta, .apunte", { y: 70, opacity: 0 });
  ScrollTrigger.batch(".tarjeta, .apunte", {
    start: "top 90%",
    once: true,
    onEnter: (grupo) => gsap.to(grupo, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out" }),
  });

  // Las ramas de git del dibujo de Rastro se pintan solas
  ScrollTrigger.create({
    trigger: ".visual-ramas",
    start: "top 75%",
    once: true,
    onEnter: () => document.querySelector(".visual-ramas").classList.add("dibujado"),
  });

  document.querySelectorAll(".grupo").forEach((grupo) => {
    gsap.from(grupo.querySelectorAll(".mono, li"), {
      y: 30, opacity: 0, stagger: 0.06, duration: 0.8,
      scrollTrigger: { trigger: grupo, start: "top 88%" },
    });
  });

  // Contacto
  gsap.to(".contacto-titulo .trozo", {
    yPercent: 0, duration: 1.2, stagger: 0.12, ease: "expo.out",
    scrollTrigger: { trigger: ".contacto-titulo", start: "top 85%" },
  });
  gsap.from(".contacto > p, .contacto-acciones, .redes", {
    y: 30, opacity: 0, stagger: 0.1, duration: 0.9,
    scrollTrigger: { trigger: ".contacto-acciones", start: "top 95%" },
  });

  // Mi nombre gigante del pie sube despacio
  gsap.from(".pie-grande", {
    yPercent: 40,
    scrollTrigger: { trigger: "footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  // La portada se va apagando al bajar
  gsap.to(".titular, .portada-pie", {
    yPercent: -12,
    opacity: 0.25,
    ease: "none",
    scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom top", scrub: true },
  });
}


// ===== Recorrido =====
// En pantallas grandes la sección se queda fija y las tarjetas pasan de lado.
// En el móvil solo aparecen hacia arriba.
function recorrido() {
  const mm = gsap.matchMedia();
  const seccion = document.querySelector(".recorrido");
  const pista = document.querySelector(".pista");

  mm.add("(min-width: 1000px)", () => {
    seccion.classList.add("horizontal");

    // Lo que tiene que moverse la pista para que se vea la última tarjeta
    const cuanto = () => pista.scrollWidth - window.innerWidth + window.innerWidth * 0.06;

    const mover = gsap.to(pista, {
      x: () => -cuanto(),
      ease: "none",
      scrollTrigger: {
        trigger: ".recorrido-fijo",
        start: "top top",
        end: () => "+=" + cuanto(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // containerAnimation sirve para usar ScrollTrigger dentro del scroll de lado
    document.querySelectorAll(".etapa").forEach((etapa) => {
      gsap.from(etapa, {
        opacity: 0.25,
        scale: 0.94,
        scrollTrigger: { trigger: etapa, containerAnimation: mover, start: "left 95%", end: "left 60%", scrub: true },
      });
      gsap.from(etapa.querySelector(".etapa-mes"), {
        xPercent: 40,
        scrollTrigger: { trigger: etapa, containerAnimation: mover, start: "left right", end: "right left", scrub: true },
      });
    });

    // Al hacer la pantalla pequeña se quita la clase
    return () => seccion.classList.remove("horizontal");
  });

  mm.add("(max-width: 999px)", () => {
    gsap.from(".etapa", {
      y: 60, opacity: 0, stagger: 0.12, duration: 1,
      scrollTrigger: { trigger: ".pista", start: "top 85%" },
    });
  });
}
