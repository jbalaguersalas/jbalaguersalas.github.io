// ===== Ajustes =====
const pideMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const usaRaton = window.matchMedia("(pointer: fine)").matches;
const gsapHaCargado = window.gsap && window.ScrollTrigger && window.Flip;
const hayAnimaciones = gsapHaCargado && !pideMenosMovimiento;

const miCorreo = "josebala115@gmail.com";
const colorAzul = "77, 163, 255";
const colorPuntoApagado = "rgba(230, 235, 242, 0.11)";

// Animaciones cortas para que la página se sienta ágil y no haya que esperar
const entradaRapida = { duration: 0.7, ease: "power3.out" };

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
            gsap.set(tarjetas, { clearProps: "transform,translate" });
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
  animarEntradaDePortada();
}


// ===== Entrada de la portada =====
function animarEntradaDePortada() {
  const entradaPortada = gsap.timeline();
  entradaPortada.to(".titular .trozo", { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" });
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
  }, 2200);
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
      ...entradaRapida,
      yPercent: 110,
      stagger: 0.04,
      scrollTrigger: { trigger: titulo, start: "top 88%" },
    });
  });

  document.querySelectorAll(".titulo .num, .titulo > p").forEach((textoPequeno) => {
    gsap.from(textoPequeno, {
      ...entradaRapida,
      opacity: 0,
      y: 16,
      scrollTrigger: { trigger: textoPequeno, start: "top 92%" },
    });
  });

  gsap.from(".filtro", {
    ...entradaRapida,
    y: 12,
    opacity: 0,
    stagger: 0.04,
    scrollTrigger: { trigger: ".filtros", start: "top 92%" },
  });

  // Las tarjetas salen por grupos según van entrando en pantalla.
  // Al terminar borro el transform para que funcione el efecto de subir al pasar el ratón (está en el CSS).
  gsap.set(".tarjeta, .etapa", { y: 40, opacity: 0 });
  ScrollTrigger.batch(".tarjeta, .etapa", {
    start: "top 92%",
    once: true,
    onEnter: (grupoDeTarjetas) => {
      gsap.to(grupoDeTarjetas, {
        ...entradaRapida,
        y: 0,
        opacity: 1,
        stagger: 0.07,
        clearProps: "transform,translate",
      });
    },
  });

  // Las ramas de git del dibujo de Rastro se pintan solas
  const dibujoDeRamas = document.querySelector(".visual-ramas");
  ScrollTrigger.create({
    trigger: dibujoDeRamas,
    start: "top 80%",
    once: true,
    onEnter: () => dibujoDeRamas.classList.add("dibujado"),
  });

  document.querySelectorAll(".grupo").forEach((grupoDeHerramientas) => {
    gsap.from(grupoDeHerramientas.querySelectorAll(".mono, li"), {
      ...entradaRapida,
      y: 16,
      opacity: 0,
      stagger: 0.04,
      scrollTrigger: { trigger: grupoDeHerramientas, start: "top 90%" },
    });
  });

  // Contacto
  gsap.to(".contacto-titulo .trozo", {
    ...entradaRapida,
    yPercent: 0,
    scrollTrigger: { trigger: ".contacto-titulo", start: "top 88%" },
  });

  gsap.from(".contacto > p, .contacto-acciones, .redes", {
    ...entradaRapida,
    y: 16,
    opacity: 0,
    stagger: 0.06,
    scrollTrigger: { trigger: ".contacto-acciones", start: "top 95%" },
  });
}
