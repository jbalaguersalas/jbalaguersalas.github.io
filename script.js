// ===== Ajustes =====
const pideMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const usaRaton = window.matchMedia("(pointer: fine)").matches;
const gsapHaCargado = window.gsap && window.ScrollTrigger && window.Flip;
const hayAnimaciones = gsapHaCargado && !pideMenosMovimiento;

const miCorreo = "josebala115@gmail.com";
const colorAzul = "77, 163, 255";
const colorPuntoApagado = "rgba(230, 235, 242, 0.11)";

// Le digo al <head> que el script ha cargado bien
document.documentElement.classList.add("listo");

activarFiltros();
activarBotonCopiar();
activarBarraDeArriba();

if (hayAnimaciones) {
  gsap.registerPlugin(ScrollTrigger, Flip);
  empezarAnimaciones();
} else {
  // Sin GSAP o con "reducir movimiento" la web se ve entera, sin animar
  document.documentElement.classList.remove("js");
}


// ===== Filtros de proyectos =====
function activarFiltros() {
  const botonesFiltro = document.querySelectorAll(".filtro");
  const tarjetas = document.querySelectorAll(".tarjeta");

  botonesFiltro.forEach((botonPulsado) => {
    botonPulsado.addEventListener("click", () => {
      const filtroElegido = botonPulsado.dataset.filtro;

      botonesFiltro.forEach((boton) => {
        boton.classList.remove("activo");
        boton.setAttribute("aria-pressed", "false");
      });
      botonPulsado.classList.add("activo");
      botonPulsado.setAttribute("aria-pressed", "true");

      // Flip guarda dónde está cada tarjeta para luego animar el cambio.
      // Antes saco las tarjetas que todavía no habían aparecido con el scroll, si no se quedan invisibles.
      let posicionesAntes = null;
      if (hayAnimaciones) {
        gsap.set(tarjetas, { opacity: 1, y: 0 });
        posicionesAntes = Flip.getState(tarjetas);
      }

      tarjetas.forEach((tarjeta) => {
        const tiposDeLaTarjeta = tarjeta.dataset.tipo.split(" ");
        const seQueda = filtroElegido === "todos" || tiposDeLaTarjeta.includes(filtroElegido);
        tarjeta.classList.toggle("fuera", !seQueda);
      });

      if (posicionesAntes) {
        Flip.from(posicionesAntes, {
          duration: 0.7,
          ease: "expo.out",
          absolute: true,
          stagger: 0.03,
          onEnter: (tarjetasQueEntran) => {
            gsap.fromTo(tarjetasQueEntran, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 });
          },
          onLeave: (tarjetasQueSalen) => {
            gsap.to(tarjetasQueSalen, { opacity: 0, scale: 0.9, duration: 0.3 });
          },
          onComplete: () => {
            // Flip a veces deja alguna tarjeta movida, así que las devuelvo a su sitio
            gsap.set(tarjetas, { x: 0, y: 0 });
            ScrollTrigger.refresh();
          },
        });
      }
    });
  });
}


// ===== Botón de copiar el correo =====
function activarBotonCopiar() {
  const botonCopiar = document.getElementById("copiar");
  const textoDelBoton = botonCopiar.querySelector("span");
  const mensajeAviso = document.getElementById("aviso");

  botonCopiar.addEventListener("click", () => {
    navigator.clipboard.writeText(miCorreo)
      .then(() => {
        textoDelBoton.textContent = "¡Copiado!";
        mensajeAviso.textContent = "Correo copiado";
      })
      .catch(() => {
        // Si el navegador no deja copiar, al menos enseño el correo
        mensajeAviso.textContent = miCorreo;
      });

    setTimeout(() => {
      textoDelBoton.textContent = "Copiar correo";
      mensajeAviso.textContent = "";
    }, 2500);
  });
}


// ===== Barra de arriba y barra de progreso =====
function activarBarraDeArriba() {
  const barraDeArriba = document.querySelector(".barra");
  const barraDeProgreso = document.querySelector(".progreso");
  let scrollAnterior = 0;

  window.addEventListener("scroll", () => {
    const scrollActual = window.scrollY;
    const estaBajando = scrollActual > scrollAnterior;

    // Fondo oscuro en cuanto bajas un poco
    barraDeArriba.classList.toggle("solida", scrollActual > 40);
    // Se esconde si bajas y vuelve si subes
    barraDeArriba.classList.toggle("oculta", estaBajando && scrollActual > 400);
    scrollAnterior = scrollActual;

    const scrollMaximo = document.body.scrollHeight - window.innerHeight;
    const porcentajeLeido = scrollActual / scrollMaximo;
    barraDeProgreso.style.transform = "scaleX(" + porcentajeLeido + ")";
  });

  // Marca en el menú la sección que estás viendo
  const enlacesDelMenu = document.querySelectorAll(".barra nav a");
  const vigilanteDeSecciones = new IntersectionObserver((secciones) => {
    secciones.forEach((seccion) => {
      if (!seccion.isIntersecting) return;
      enlacesDelMenu.forEach((enlace) => {
        const esLaSeccionActual = enlace.getAttribute("href") === "#" + seccion.target.id;
        enlace.classList.toggle("actual", esLaSeccionActual);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  document.querySelectorAll("section[id]").forEach((seccion) => vigilanteDeSecciones.observe(seccion));
}


// ===== Animaciones con GSAP =====
function empezarAnimaciones() {
  partirTitulosEnPalabras();

  // Coloco la portada abajo para que suba al cargar la página.
  // El CSS la tiene escondida hasta este momento para que no se vea un parpadeo.
  gsap.set(".titular .trozo, .contacto-titulo .trozo", { yPercent: 115 });
  gsap.set(".aparece", { opacity: 0, y: 24 });
  gsap.set(".rotador span", { yPercent: 110, opacity: 0 });
  gsap.set(".titular", { opacity: 1 });

  dibujarFondoDePuntos();
  seguirRatonConLaLuz();
  animarAlHacerScroll();
  animarRecorrido();
  animarEntradaDePortada();
}


// ===== Entrada de la portada =====
function animarEntradaDePortada() {
  const entradaPortada = gsap.timeline();
  entradaPortada.to(".titular .trozo", { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" });
  entradaPortada.to(".rotador span:first-child", { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out" }, "<0.3");
  entradaPortada.to(".aparece", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" }, "<0.2");

  escribirTerminal();
  setTimeout(cambiarPalabraDeColor, 3000);
}


// ===== La terminal escribe línea a línea =====
function escribirTerminal() {
  const terminal = document.getElementById("terminal");
  const lineasDeLaTerminal = terminal.innerHTML.split("\n");
  const cursorParpadeante = '<span class="cursor-terminal"></span>';
  const esperaEntreLineas = 150;

  terminal.innerHTML = cursorParpadeante;
  lineasDeLaTerminal.forEach((linea, numeroDeLinea) => {
    setTimeout(() => {
      const lineasEscritas = lineasDeLaTerminal.slice(0, numeroDeLinea + 1).join("\n");
      terminal.innerHTML = lineasEscritas + cursorParpadeante;
    }, 500 + numeroDeLinea * esperaEntreLineas);
  });
}


// ===== La palabra de color del titular va cambiando =====
function cambiarPalabraDeColor() {
  const palabras = document.querySelectorAll(".rotador span");
  let palabraVisible = 0;

  setInterval(() => {
    const palabraQueSale = palabras[palabraVisible];
    palabraVisible = (palabraVisible + 1) % palabras.length;
    const palabraQueEntra = palabras[palabraVisible];

    gsap.to(palabraQueSale, { yPercent: -110, opacity: 0, duration: 0.7, ease: "expo.inOut" });
    gsap.fromTo(palabraQueEntra, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.inOut" });
  }, 2500);
}


// ===== Partir los títulos en palabras =====
// Meto cada palabra en un span para poder subirlas una a una
function partirTitulosEnPalabras() {
  document.querySelectorAll(".partir").forEach((titulo) => {
    const textoDelTitulo = titulo.textContent;
    const palabras = textoDelTitulo.split(" ");

    titulo.setAttribute("aria-label", textoDelTitulo);
    titulo.innerHTML = palabras
      .map((palabra) => '<span class="palabra" aria-hidden="true"><span>' + palabra + "</span></span>")
      .join(" ");
  });
}


// ===== Fondo de puntos de la portada =====
// Una rejilla de puntos en un canvas. Los que están cerca del ratón se apartan y se ponen azules.
function dibujarFondoDePuntos() {
  const lienzo = document.getElementById("puntos");
  const pincel = lienzo.getContext("2d");
  const portada = document.querySelector(".portada");

  const separacionEntrePuntos = 34;
  const radioDelRaton = 160;
  const cuantoSeApartan = 22;
  const suavidad = 0.15;

  let listaDePuntos = [];
  let posicionRaton = { x: -1000, y: -1000 };
  let portadaVisible = true;

  function crearPuntos() {
    lienzo.width = portada.offsetWidth;
    lienzo.height = portada.offsetHeight;
    listaDePuntos = [];

    for (let x = separacionEntrePuntos / 2; x < lienzo.width; x += separacionEntrePuntos) {
      for (let y = separacionEntrePuntos / 2; y < lienzo.height; y += separacionEntrePuntos) {
        listaDePuntos.push({ x: x, y: y, xOriginal: x, yOriginal: y });
      }
    }
  }

  function pintarPuntos() {
    if (!portadaVisible) return;
    pincel.clearRect(0, 0, lienzo.width, lienzo.height);

    listaDePuntos.forEach((punto) => {
      const distanciaX = punto.xOriginal - posicionRaton.x;
      const distanciaY = punto.yOriginal - posicionRaton.y;
      const distanciaAlRaton = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

      // cercania va de 0 (lejos) a 1 (justo debajo del ratón)
      let cercania = 0;
      let destinoX = punto.xOriginal;
      let destinoY = punto.yOriginal;

      if (distanciaAlRaton < radioDelRaton && distanciaAlRaton > 0) {
        cercania = 1 - distanciaAlRaton / radioDelRaton;
        destinoX += (distanciaX / distanciaAlRaton) * cercania * cuantoSeApartan;
        destinoY += (distanciaY / distanciaAlRaton) * cercania * cuantoSeApartan;
      }

      // Cada punto se acerca poco a poco a donde tiene que estar
      punto.x += (destinoX - punto.x) * suavidad;
      punto.y += (destinoY - punto.y) * suavidad;

      if (cercania > 0) {
        const opacidad = 0.25 + cercania * 0.75;
        pincel.fillStyle = "rgba(" + colorAzul + ", " + opacidad + ")";
      } else {
        pincel.fillStyle = colorPuntoApagado;
      }

      const tamanoDelPunto = 1 + cercania * 1.6;
      pincel.beginPath();
      pincel.arc(punto.x, punto.y, tamanoDelPunto, 0, Math.PI * 2);
      pincel.fill();
    });
  }

  crearPuntos();
  gsap.ticker.add(pintarPuntos);
  window.addEventListener("resize", crearPuntos);

  portada.addEventListener("mousemove", (evento) => {
    const cajaPortada = portada.getBoundingClientRect();
    posicionRaton.x = evento.clientX - cajaPortada.left;
    posicionRaton.y = evento.clientY - cajaPortada.top;
  });

  portada.addEventListener("mouseleave", () => {
    posicionRaton = { x: -1000, y: -1000 };
  });

  // Si la portada no se ve, no pinto nada para no gastar
  const vigilanteDePortada = new IntersectionObserver((entradas) => {
    portadaVisible = entradas[0].isIntersecting;
  });
  vigilanteDePortada.observe(portada);
}


// ===== Luz de las tarjetas =====
// Una luz azul suave sigue al ratón por encima de cada tarjeta
function seguirRatonConLaLuz() {
  if (!usaRaton) return;

  document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    tarjeta.addEventListener("mousemove", (evento) => {
      const cajaTarjeta = tarjeta.getBoundingClientRect();
      tarjeta.style.setProperty("--x", evento.clientX - cajaTarjeta.left + "px");
      tarjeta.style.setProperty("--y", evento.clientY - cajaTarjeta.top + "px");
    });
  });
}


// ===== Cosas que aparecen al hacer scroll =====
function animarAlHacerScroll() {
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

  document.querySelectorAll(".titulo .num, .titulo > p").forEach((textoPequeno) => {
    gsap.from(textoPequeno, {
      opacity: 0,
      y: 20,
      duration: 0.9,
      scrollTrigger: { trigger: textoPequeno, start: "top 90%" },
    });
  });

  // La cinta de tecnologías gira un poco mientras bajas
  gsap.to(".cinta", {
    rotate: 1.2,
    scrollTrigger: { trigger: ".cinta", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Números que suben de 0 a su valor
  document.querySelectorAll(".contador").forEach((contador) => {
    const valorDelContador = { actual: 0 };
    contador.textContent = "0";

    gsap.to(valorDelContador, {
      actual: Number(contador.dataset.fin),
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => {
        contador.textContent = Math.round(valorDelContador.actual);
      },
      scrollTrigger: { trigger: contador, start: "top 90%" },
    });
  });

  gsap.from(".numero", {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "expo.out",
    scrollTrigger: { trigger: ".numeros", start: "top 85%" },
  });

  gsap.from(".filtro", {
    y: 20,
    opacity: 0,
    stagger: 0.05,
    duration: 0.7,
    scrollTrigger: { trigger: ".filtros", start: "top 90%" },
  });

  // Las tarjetas salen por grupos según van entrando en pantalla
  gsap.set(".tarjeta", { y: 70, opacity: 0 });
  ScrollTrigger.batch(".tarjeta", {
    start: "top 90%",
    once: true,
    onEnter: (grupoDeTarjetas) => {
      gsap.to(grupoDeTarjetas, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out" });
    },
  });

  // Las ramas de git del dibujo de Rastro se pintan solas
  const dibujoDeRamas = document.querySelector(".visual-ramas");
  ScrollTrigger.create({
    trigger: dibujoDeRamas,
    start: "top 75%",
    once: true,
    onEnter: () => dibujoDeRamas.classList.add("dibujado"),
  });

  document.querySelectorAll(".grupo").forEach((grupoDeHerramientas) => {
    gsap.from(grupoDeHerramientas.querySelectorAll(".mono, li"), {
      y: 30,
      opacity: 0,
      stagger: 0.06,
      duration: 0.8,
      scrollTrigger: { trigger: grupoDeHerramientas, start: "top 88%" },
    });
  });

  // Contacto
  gsap.to(".contacto-titulo .trozo", {
    yPercent: 0,
    duration: 1.2,
    stagger: 0.12,
    ease: "expo.out",
    scrollTrigger: { trigger: ".contacto-titulo", start: "top 85%" },
  });

  gsap.from(".contacto > p, .contacto-acciones, .redes", {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    scrollTrigger: { trigger: ".contacto-acciones", start: "top 95%" },
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
function animarRecorrido() {
  const tamanosDePantalla = gsap.matchMedia();
  const seccionRecorrido = document.querySelector(".recorrido");
  const pistaDeTarjetas = document.querySelector(".pista");

  tamanosDePantalla.add("(min-width: 1000px)", () => {
    seccionRecorrido.classList.add("horizontal");

    // Lo que tiene que moverse la pista para que se vea entera la última tarjeta
    const distanciaAMover = () => pistaDeTarjetas.scrollWidth - window.innerWidth + window.innerWidth * 0.06;

    const moverPista = gsap.to(pistaDeTarjetas, {
      x: () => -distanciaAMover(),
      ease: "none",
      scrollTrigger: {
        trigger: ".recorrido-fijo",
        start: "top top",
        end: () => "+=" + distanciaAMover(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // containerAnimation sirve para usar ScrollTrigger dentro del movimiento de lado
    document.querySelectorAll(".etapa").forEach((etapa) => {
      gsap.from(etapa, {
        opacity: 0.25,
        scale: 0.94,
        scrollTrigger: { trigger: etapa, containerAnimation: moverPista, start: "left 95%", end: "left 60%", scrub: true },
      });

      gsap.from(etapa.querySelector(".etapa-mes"), {
        xPercent: 40,
        scrollTrigger: { trigger: etapa, containerAnimation: moverPista, start: "left right", end: "right left", scrub: true },
      });
    });

    // Si la pantalla se hace pequeña, quito la clase
    return () => seccionRecorrido.classList.remove("horizontal");
  });

  tamanosDePantalla.add("(max-width: 999px)", () => {
    gsap.from(".etapa", {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      scrollTrigger: { trigger: ".pista", start: "top 85%" },
    });
  });
}
