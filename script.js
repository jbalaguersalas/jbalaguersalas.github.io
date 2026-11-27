// Web de Shema. Sin GSAP o con movimiento reducido, todo se ve igual pero quieto.
(function () {
  const raiz = document.documentElement;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conRaton = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const tieneGsap = typeof window.gsap !== "undefined";
  const css = getComputedStyle(raiz);
  const token = (n) => css.getPropertyValue(n).trim();
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Copiar correo ---------- */
  const copiar = $("#copiar");
  const aviso = $("#aviso");
  if (copiar) {
    let espera;
    copiar.addEventListener("click", async () => {
      clearTimeout(espera);
      try {
        await navigator.clipboard.writeText("paysecuredev@protonmail.com");
        aviso.textContent = "Correo copiado.";
        copiar.textContent = "Copiado";
      } catch (e) {
        aviso.textContent = "No he podido copiarlo. El correo es paysecuredev@protonmail.com";
      }
      espera = setTimeout(() => { aviso.textContent = ""; copiar.textContent = "Copiar correo"; }, 2500);
    });
  }

  /* ---------- Líneas de código: cada línea en su span ---------- */
  $$(".panel pre").forEach((pre) => {
    pre.innerHTML = pre.innerHTML.split("\n").map((l) => `<span class="ln">${l || " "}</span>`).join("");
    const barra = document.createElement("span");
    barra.className = "barrido";
    pre.prepend(barra);
  });
  /* ---------- Filtros ---------- */
  const filtros = $$(".filtro");
  const tarjetas = $$(".tarjeta");
  const linea = $(".filtro-linea");
  function moverLinea(boton) {
    if (!linea || !boton) return;
    linea.style.transform = `translateX(${boton.offsetLeft}px) scaleX(${boton.offsetWidth / 100})`;
  }
  moverLinea($(".filtro.activo"));
  if (document.fonts) document.fonts.ready.then(() => moverLinea($(".filtro.activo")));
  // Los enlaces que abren otra pestaña lo dicen para los lectores de pantalla
  $$('a[target="_blank"]').forEach((a) => a.insertAdjacentHTML("beforeend", '<span class="oculto"> (se abre en otra pestaña)</span>'));
  window.addEventListener("resize", () => moverLinea($(".filtro.activo")));

  // El número de cada filtro se cuenta solo, para que no se desfase al añadir proyectos
  filtros.forEach((b) => {
    const f = b.dataset.filtro, sup = $("sup", b);
    if (sup) sup.textContent = f === "todos" ? tarjetas.length : tarjetas.filter((t) => t.dataset.tipo.split(" ").includes(f)).length;
  });
  const titulosRejilla = $$(".rejilla-titulo");
  function aplicarFiltro(filtro) {
    tarjetas.forEach((t) => {
      const tipos = t.dataset.tipo.split(" ");
      t.classList.toggle("oculta", filtro !== "todos" && !tipos.includes(filtro));
    });
    // Si un grupo se queda sin tarjetas, su título también se esconde
    titulosRejilla.forEach((ti) => {
      const rejilla = ti.nextElementSibling;
      ti.classList.toggle("vacio", !!rejilla && !$$(".tarjeta:not(.oculta)", rejilla).length);
    });
  }
  let flipTl = null;
  filtros.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;
      filtros.forEach((b) => {
        b.classList.toggle("activo", b === boton);
        b.setAttribute("aria-pressed", b === boton ? "true" : "false");
      });
      moverLinea(boton);
      if (!(tieneGsap && window.Flip) || quieto) return aplicarFiltro(filtro);
      // Primero se van las que sobran, luego el resto se recoloca y entran las nuevas
      const salen = tarjetas.filter((t) => !t.classList.contains("oculta") && filtro !== "todos" && !t.dataset.tipo.split(" ").includes(filtro));
      // Si había una animación a medias, se termina al instante en vez de cortarla
      gsap.getTweensOf(tarjetas).forEach((tw) => tw.progress(1));
      if (flipTl) flipTl.progress(1);
      gsap.to(salen, {
        opacity: 0, scale: 0.94, duration: 0.2, ease: "power2.in",
        onComplete: () => {
          const estado = Flip.getState(tarjetas);
          aplicarFiltro(filtro);
          gsap.set(salen, { opacity: 1, scale: 1 });
          flipTl = Flip.from(estado, {
            duration: 0.6, ease: "expo.inOut", absolute: true,
            onComplete: () => ScrollTrigger.refresh(),
            onEnter: (el) => gsap.fromTo(el, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }),
          });
        },
      });
    });
  });

  /* ---------- Desplazarse a una sección (con Lenis se cambia por su versión suave) ---------- */
  let irA = (el) => el.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "center" });

  /* ---------- Tecnologías: cuántas prácticas usan cada una, y al pulsar se iluminan ---------- */
  const usaTec = (t, tec) => {
    const n = tec.toLowerCase();
    return $$(".chips span", t).some((s) => s.textContent.trim().toLowerCase() === n) || t.dataset.tipo.split(" ").includes(n);
  };
  let quitarResalte;
  function limpiarResalte() {
    clearTimeout(quitarResalte);
    tarjetas.forEach((t) => t.classList.remove("resaltada", "apagada"));
  }
  $$(".tec").forEach((b) => {
    const tec = b.textContent.trim();
    const n = tarjetas.filter((t) => usaTec(t, tec)).length;
    if (!n) {
      const s = document.createElement("span");
      s.className = "tec"; s.textContent = tec;
      return b.replaceWith(s);
    }
    b.dataset.n = n;
    b.insertAdjacentHTML("beforeend", `<sup aria-hidden="true">${n}</sup>`);
    b.setAttribute("aria-label", `${tec}: ver ${n === 1 ? "la práctica" : `las ${n} prácticas`} que la usan`);
    b.addEventListener("click", () => {
      const todos = $('.filtro[data-filtro="todos"]');
      if (todos && !todos.classList.contains("activo")) todos.click();
      limpiarResalte();
      tarjetas.forEach((t) => t.classList.add(usaTec(t, tec) ? "resaltada" : "apagada"));
      irA(tarjetas.find((t) => t.classList.contains("resaltada")));
      quitarResalte = setTimeout(limpiarResalte, 5000);
    });
  });
  filtros.forEach((f) => f.addEventListener("click", limpiarResalte));

  /* ---------- Actividad de GitHub en directo ---------- */
  const actividad = $("#actividad");
  const numPrs = $("#num-prs");
  const USUARIO = "jbalaguersalas";
  const leerCache = (k) => { try { const v = JSON.parse(sessionStorage.getItem(k)); return v && Date.now() - v.t < 600000 ? v.d : null; } catch (e) { return null; } };
  const guardarCache = (k, d) => { try { sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* sin almacenamiento */ } };
  async function pedir(url, k) {
    const c = leerCache(k);
    if (c) return c;
    const r = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    guardarCache(k, d);
    return d;
  }
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  function haceCuanto(fecha) {
    const s = (new Date(fecha) - Date.now()) / 1000;
    const pasos = [[60, "second"], [60, "minute"], [24, "hour"], [7, "day"], [4.35, "week"], [12, "month"], [Infinity, "year"]];
    let v = s;
    for (const [lim, u] of pasos) { if (Math.abs(v) < lim) return rtf.format(Math.round(v), u); v /= lim; }
  }
  const svg = (d) => `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICONOS = {
    push: svg('<path d="M8 13V3M4 7l4-4 4 4"/>'),
    merge: svg('<circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="8" r="1.5"/><path d="M4 5v6M4 5c0 3 2 3 6.5 3"/>'),
    pr: svg('<circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="12.5" r="1.5"/><path d="M4 5v6M12 11V6.5c0-1.5-1-2.5-2.5-2.5H7"/>'),
    nuevo: svg('<path d="M8 3v10M3 8h10"/>'),
    otro: svg('<circle cx="8" cy="8" r="2"/>'),
  };
  function describir(e) {
    const p = e.payload || {};
    switch (e.type) {
      case "PushEvent": {
        const n = p.size || (p.commits || []).length;
        return [ICONOS.push, n > 1 ? `Subió ${n} commits a` : "Subió cambios a"];
      }
      case "PullRequestEvent":
        if (p.action === "merged" || (p.action === "closed" && p.pull_request && p.pull_request.merged)) return [ICONOS.merge, "Fusionó un pull request en"];
        return [ICONOS.pr, p.action === "opened" ? "Abrió un pull request en" : "Pull request en"];
      case "CreateEvent":
        return [ICONOS.nuevo, p.ref_type === "repository" ? "Creó el repositorio" : "Creó una rama en"];
      default: return [ICONOS.otro, "Actividad en"];
    }
  }
  if (actividad) {
    pedir(`https://api.github.com/users/${USUARIO}/events/public?per_page=30`, "gh-eventos").then((eventos) => {
      const vistos = new Set();
      const lista = eventos.filter((e) => {
        const clave = e.type + e.repo.name;
        if (vistos.has(clave)) return false;
        vistos.add(clave); return true;
      }).slice(0, 4);
      if (!lista.length) throw new Error("vacío");
      actividad.innerHTML = lista.map((e) => {
        const [icono, que] = describir(e);
        const repo = e.repo.name.replace(`${USUARIO}/`, "");
        return `<li><a href="https://github.com/${e.repo.name}" target="_blank" rel="noopener"><span class="act-icono" aria-hidden="true">${icono}</span><span class="act-texto"><span class="act-que">${que}</span><span class="act-repo">${repo}</span><span class="act-cuando">${haceCuanto(e.created_at)}</span></span><span class="oculto"> (se abre en otra pestaña)</span></a></li>`;
      }).join("");
      if (window.gsap && !quieto) gsap.from($$("li", actividad), { opacity: 0, y: 10, duration: 0.5, stagger: 0.08, ease: "power2.out" });
    }).catch(() => {
      actividad.innerHTML = '<li><span class="act-icono" aria-hidden="true">•</span><span class="act-texto"><span class="act-que">Ahora mismo no puedo cargar mi actividad.</span><span class="act-cuando">Puedes verla en mi perfil de GitHub.</span></span></li>';
    });
    // Pull requests fusionados en todos los repos (los míos y los del equipo)
    pedir(`https://api.github.com/search/issues?q=author:${USUARIO}+type:pr+is:merged&per_page=1`, "gh-prs").then((r) => {
      if (numPrs && r.total_count) { numPrs.dataset.cuenta = r.total_count; numPrs.textContent = r.total_count; }
    }).catch(() => { /* se queda el número escrito en el HTML */ });
  }

  /* ---------- Luz que sigue al cursor en paneles, fichas y muro ---------- */
  $$(".panel, .muro, .carta").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - r.left}px`);
      el.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Varita mágica: la página de juguete cambia de color ---------- */
  const varita = $(".panel-varita");
  if (varita) {
    const bloques = $$(".varita-pagina .v", varita);
    let ultimo = null, ultimaChispa = 0;
    const pintar = (b) => {
      b.dataset.c = String(((Number(b.dataset.c) || 0) % 4) + 1);
      b.classList.add("toque");
      setTimeout(() => b.classList.remove("toque"), 250);
    };
    varita.addEventListener("pointermove", (e) => {
      varita.classList.add("usada");
      const bajo = document.elementFromPoint(e.clientX, e.clientY);
      if (bajo && bloques.includes(bajo) && bajo !== ultimo) { pintar(bajo); ultimo = bajo; }
      const ahora = performance.now();
      if (!quieto && tieneGsap && ahora - ultimaChispa > 28) {
        ultimaChispa = ahora;
        const r = varita.getBoundingClientRect();
        const ch = document.createElement("span");
        ch.className = "chispa";
        ch.style.left = `${e.clientX - r.left}px`;
        ch.style.top = `${e.clientY - r.top}px`;
        ch.style.background = token(`--v${1 + Math.floor(Math.random() * 4)}`);
        varita.appendChild(ch);
        gsap.to(ch, {
          x: gsap.utils.random(-24, 24), y: gsap.utils.random(-30, 10), scale: 0, opacity: 0,
          duration: gsap.utils.random(0.5, 0.9), ease: "power2.out", onComplete: () => ch.remove(),
        });
      }
    });
    varita.addEventListener("pointerleave", () => (ultimo = null));
  }

  /* ---------- Barra: se esconde al bajar, vuelve al subir ---------- */
  const barra = $(".barra");
  let ultimaY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    barra.classList.toggle("oculta", y > ultimaY && y > 300);
    barra.classList.toggle("con-fondo", y > 80);
    ultimaY = y;
  }, { passive: true });

  const enlaces = $$(".barra-nav a");
  const vigilante = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) enlaces.forEach((a) => a.classList.toggle("actual", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["proyectos", "recorrido", "contacto"].forEach((id) => { const s = document.getElementById(id); if (s) vigilante.observe(s); });

  /* ---------- Banda ASCII al estilo Soren ----------
     Manchas de luz inventadas flotan por la banda. Cada celda elige un carácter según
     lo iluminada que esté: poca luz es ".", mucha luz es "@". Cerca del cursor los
     caracteres se revuelven como en una terminal, y a veces una fila entera "falla". */
  const lienzo = $("#ascii");
  if (lienzo) {
    const ctx = lienzo.getContext("2d");
    const rampa = " .:*!)(%&@";
    const revuelto = "@#%&*+=<>/\\{}[]01$";
    const celdaX = 11, celdaY = 20;
    let ancho = 0, alto = 0, cols = 0, filas = 0, t = 0, visible = true;
    const raton = { x: -999, y: -999 };
    const colBajo = token("--linea-fuerte"), colMedio = token("--texto-2"), colAlto = token("--crema"), colLuz = token("--lavanda");
    const manchas = [
      { x: 0.18, y: 0.45, r: 0.36, vx: 0.21, vy: 0.33, f: 0.0 },
      { x: 0.52, y: 0.55, r: 0.30, vx: -0.17, vy: 0.27, f: 1.7 },
      { x: 0.82, y: 0.40, r: 0.34, vx: 0.13, vy: -0.23, f: 3.1 },
      { x: 0.35, y: 0.30, r: 0.20, vx: -0.29, vy: 0.19, f: 4.4 },
    ];
    let franja = -1, franjaHasta = 0;
    function medir() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = lienzo.clientWidth; alto = lienzo.clientHeight;
      lienzo.width = ancho * dpr; lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 15px ${token("--f-mono")}`;
      ctx.textBaseline = "top";
      cols = Math.ceil(ancho / celdaX); filas = Math.ceil(alto / celdaY);
    }
    function luz(u, v) {
      let s = 0;
      for (const m of manchas) {
        const cx = m.x + Math.sin(t * m.vx + m.f) * 0.14;
        const cy = m.y + Math.cos(t * m.vy + m.f) * 0.22;
        const dx = (u - cx) * (ancho / alto) * 0.35, dy = v - cy;
        s += Math.exp(-(dx * dx + dy * dy) / (m.r * m.r));
      }
      s += 0.12 * Math.sin(u * 9 + t * 0.6) * Math.cos(v * 5 - t * 0.4);
      return Math.max(0, Math.min(1, s * 0.9));
    }
    function dibujar() {
      ctx.clearRect(0, 0, ancho, alto);
      if (!quieto && t > franjaHasta && Math.random() < 0.015) { franja = Math.floor(Math.random() * filas); franjaHasta = t + 0.3; }
      if (t > franjaHasta) franja = -1;
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const x = c * celdaX, y = f * celdaY;
          const v = luz(c / cols, f / filas);
          const i = Math.min(rampa.length - 1, Math.floor(v * rampa.length));
          const dx = x - raton.x, dy = (y - raton.y) * 1.4;
          const cerca = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 170);
          if (cerca > 0.05 || f === franja) {
            const revolver = Math.random() < 0.35 + cerca * 0.55;
            ctx.fillStyle = cerca > 0.55 ? colAlto : colLuz;
            ctx.fillText(revolver ? revuelto[Math.floor(Math.random() * revuelto.length)] : rampa[Math.max(1, i)], x, y);
          } else if (i > 0) {
            ctx.fillStyle = v > 0.75 ? colAlto : v > 0.4 ? colMedio : colBajo;
            ctx.fillText(rampa[i], x, y);
          }
        }
      }
    }
    let pedido = 0;
    function bucle() {
      t += 0.018; dibujar();
      pedido = visible ? requestAnimationFrame(bucle) : 0;
    }
    medir(); dibujar();
    if (document.fonts) document.fonts.ready.then(() => { medir(); dibujar(); });
    window.addEventListener("resize", () => { medir(); dibujar(); });
    lienzo.parentElement.addEventListener("pointermove", (e) => {
      const r = lienzo.getBoundingClientRect();
      raton.x = e.clientX - r.left; raton.y = e.clientY - r.top;
      if (quieto) dibujar();
    });
    lienzo.parentElement.addEventListener("pointerleave", () => { raton.x = raton.y = -999; if (quieto) dibujar(); });
    if (!quieto) {
      new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (visible && !pedido) pedido = requestAnimationFrame(bucle);
      }).observe(lienzo);
      pedido = requestAnimationFrame(bucle);
    }
  }

  /* ---------- Agenda: la fila del centro se enciende ---------- */
  const vigilaFilas = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => en.target.classList.toggle("activa", en.isIntersecting));
  }, { rootMargin: "-35% 0px -35% 0px" });
  $$(".fila").forEach((f) => (quieto ? f.classList.add("activa") : vigilaFilas.observe(f)));

  /* ---------- Linterna del retrato (funciona también sin GSAP) ---------- */
  const portada = $(".portada");
  const fotoLuz = $(".foto-luz");
  if (portada && fotoLuz && conRaton) {
    portada.addEventListener("pointermove", (e) => {
      const r = fotoLuz.getBoundingClientRect();
      fotoLuz.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      fotoLuz.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  }

  raiz.classList.add("listo");
  if (!tieneGsap || quieto) return;

  /* ================= GSAP ================= */
  gsap.registerPlugin(ScrollTrigger, Flip);

  // Scroll suave con Lenis, sincronizado con ScrollTrigger
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    irA = (el) => lenis.scrollTo(el, { duration: 1.4, offset: -120 });
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const destino = id === "#inicio" ? 0 : $(id);
        if (destino === null) return;
        e.preventDefault();
        lenis.scrollTo(destino, { duration: 1.4 });
        if (destino !== 0) { destino.setAttribute("tabindex", "-1"); destino.focus({ preventScroll: true }); }
      });
    });
  }

  gsap.to(".progreso", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  /* ---------- Portada ---------- */
  const letras = $$(".letra");
  const letrasIn = $$(".letra-in");
  const entrada = gsap.timeline({ defaults: { ease: "expo.out" } });
  entrada
    .from(".foto-mueve", { opacity: 0, scale: 1.18, duration: 2, ease: "power3.out" }, 0)
    .fromTo(".foto-luz", { "--radio-luz": "0px" }, { "--radio-luz": "220px", duration: 1.6, ease: "power2.out" }, 0.5)
    .from(letrasIn, { yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.06 }, 0.2)
    .from(".portada-fila i", { scaleX: 0, duration: 1.2, stagger: 0.12 }, 0.8)
    .from(".portada-fila p", { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.8)
    .from(".portada-pie > *", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 1)
    .from(".barra > *", { opacity: 0, duration: 0.8, stagger: 0.06, ease: "power2.out" }, 1.1);

  const salida = { trigger: ".portada", start: "top top", end: "bottom top", scrub: 0.6 };
  gsap.set(".portada-foto", { x: 0, xPercent: -50 });
  gsap.to(".portada-foto", { yPercent: 18, scale: 0.9, opacity: 0.35, ease: "none", scrollTrigger: salida });
  letras.forEach((l, i) => {
    gsap.to(l, { x: (i - 2) * 60, yPercent: [-22, 14, -8, 18, -14][i], rotate: (i - 2) * 3, ease: "none", scrollTrigger: salida });
  });
  gsap.to(".portada-fila, .portada-pie", { y: -60, opacity: 0, ease: "none", scrollTrigger: { ...salida, end: "60% top" } });

  if (conRaton) {
    const fotoX = gsap.quickTo(".foto-mueve", "x", { duration: 1.2, ease: "power3.out" });
    const fotoY = gsap.quickTo(".foto-mueve", "y", { duration: 1.2, ease: "power3.out" });
    const nomX = gsap.quickTo(".palabra", "x", { duration: 1, ease: "power3.out" });
    const olas = letrasIn.map((l) => gsap.quickTo(l, "y", { duration: 0.6, ease: "power3.out" }));
    const escalas = letrasIn.map((l) => gsap.quickTo(l, "scaleY", { duration: 0.6, ease: "power3.out" }));
    portada.addEventListener("pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      fotoX(nx * -30); fotoY(ny * -20); nomX(nx * 18);
      const cajas = letras.map((l) => l.getBoundingClientRect());
      cajas.forEach((r, i) => {
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const fuerza = Math.max(0, 1 - d / 320);
        olas[i](-fuerza * 0.06 * r.height);
        escalas[i](1 + fuerza * 0.05);
      });
    });
    portada.addEventListener("pointerleave", () => {
      fotoX(0); fotoY(0); nomX(0);
      olas.forEach((f) => f(0)); escalas.forEach((f) => f(1));
    });
  }

  /* ---------- Botones magnéticos con rebote ---------- */
  if (conRaton) {
    $$(".pildora").forEach((b) => {
      const mx = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
      const my = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      b.addEventListener("pointerleave", () => { mx(0); my(0); });
    });
  }

  /* ---------- Titulares serif: suben palabra a palabra ---------- */
  $$("h2.serif").forEach((h) => {
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = h.textContent.trim().split(/\s+/).map((p) => `<span class="pal" aria-hidden="true"><span>${p}</span></span>`).join(" ");
    gsap.from($$(".pal > span", h), {
      yPercent: 110, duration: 1.1, stagger: 0.05, ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 85%" },
    });
  });
  gsap.utils.toArray(".sobre-texto, .cabeza p, .agenda-lado p").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  /* ---------- Fichas de "sobre mí": entran escalonadas y se inclinan con el ratón ---------- */
  const fichas = $$(".carta");
  gsap.from(fichas, {
    y: 80, opacity: 0, rotation: (i) => [-5, 0, 5][i], duration: 1.2, stagger: 0.12, ease: "expo.out",
    scrollTrigger: { trigger: ".abanico", start: "top 82%" },
  });
  gsap.from(".meses li, .carta-datos div, .grupo, .carta-lista li", {
    opacity: 0, x: -14, duration: 0.6, stagger: 0.05, ease: "power2.out",
    scrollTrigger: { trigger: ".abanico", start: "top 75%" },
  });
  gsap.from(".reparto-barra span", {
    scaleX: 0, duration: 1, stagger: 0.12, ease: "expo.out",
    scrollTrigger: { trigger: ".reparto", start: "top 85%" },
  });
  // Los números cuentan desde cero cuando aparecen
  $$(".carta-datos dd[data-cuenta]").forEach((dd) => {
    const n = { v: 0 };
    ScrollTrigger.create({
      trigger: dd, start: "top 90%", once: true,
      onEnter: () => gsap.to(n, {
        v: Number(dd.dataset.cuenta), duration: 1.4, ease: "power2.out",
        onUpdate: () => (dd.textContent = Math.round(n.v)),
        onComplete: () => (dd.textContent = dd.dataset.cuenta),
      }),
    });
  });
  if (conRaton) {
    fichas.forEach((c) => {
      const rx = gsap.quickTo(c, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(c, "rotationY", { duration: 0.5, ease: "power3.out" });
      const py = gsap.quickTo(c, "y", { duration: 0.5, ease: "power3.out" });
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        py(-10);
      });
      c.addEventListener("pointerleave", () => { rx(0); ry(0); py(0); });
    });
  }

  /* ---------- Tarjetas de proyecto ---------- */
  ScrollTrigger.batch(".tarjeta", {
    start: "top 88%", once: true,
    onEnter: (lote) => {
      gsap.from(lote, { opacity: 0, y: 70, duration: 1, stagger: 0.08, ease: "expo.out" });
      lote.forEach((t, k) => {
        const lineas = $$(".ln", t);
        if (lineas.length) gsap.from(lineas, { opacity: 0, x: -10, duration: 0.5, stagger: 0.045, delay: 0.25 + k * 0.08, ease: "power2.out" });
      });
    },
  });
  if (conRaton) {
    $$(".tarjeta").forEach((t) => {
      const panel = $(".panel", t);
      const rx = gsap.quickTo(panel, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(panel, "rotationY", { duration: 0.5, ease: "power3.out" });
      const py = gsap.quickTo(panel, "y", { duration: 0.5, ease: "power3.out" });
      t.addEventListener("pointermove", (e) => {
        const r = panel.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        py(-6);
      });
      t.addEventListener("pointerleave", () => { rx(0); ry(0); py(0); });

      // El barrido recorre las líneas como un depurador
      const barrido = $(".barrido", t);
      const lineas = $$(".ln", t);
      let paso;
      if (barrido && lineas.length) {
        t.addEventListener("pointerenter", () => {
          const alto = lineas[0].offsetHeight;
          if (paso) paso.kill();
          paso = gsap.timeline({ repeat: -1 });
          lineas.forEach((l, i) => paso.to(barrido, { y: i * alto, duration: 0.18, ease: "power2.out" }).to({}, { duration: 0.35 }));
        });
        t.addEventListener("pointerleave", () => { if (paso) paso.kill(); gsap.to(barrido, { y: 0, duration: 0.2 }); });
      }
    });
  }

  /* ---------- Muro de herramientas ---------- */
  gsap.from(".muro > *", {
    opacity: 0, y: 12, duration: 0.6, stagger: 0.03, ease: "power2.out",
    scrollTrigger: { trigger: ".muro", start: "top 80%" },
  });

  /* ---------- Contacto ---------- */
  gsap.from(".contacto-dentro", {
    scale: 0.9, opacity: 0.3, ease: "none",
    scrollTrigger: { trigger: ".contacto", start: "top bottom", end: "top 30%", scrub: true },
  });
  const letrasContacto = $$(".contacto-titulo span");
  gsap.from(letrasContacto, {
    yPercent: 100, opacity: 0, duration: 1, stagger: 0.04, ease: "expo.out",
    scrollTrigger: { trigger: ".contacto-titulo", start: "top 85%" },
  });
  if (conRaton) {
    const tituloC = $(".contacto-titulo");
    const sube = letrasContacto.map((l) => gsap.quickTo(l, "y", { duration: 0.5, ease: "power3.out" }));
    tituloC.addEventListener("pointermove", (e) => {
      letrasContacto.map((l) => l.getBoundingClientRect()).forEach((r, i) => {
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        sube[i](-Math.max(0, 1 - d / 200) * 0.12 * r.height);
      });
    });
    tituloC.addEventListener("pointerleave", () => sube.forEach((f) => f(0)));
  }

  /* ---------- Nombre gigante del pie ---------- */
  gsap.from(".pie-gigante span", {
    yPercent: 100, duration: 1.2, stagger: 0.06, ease: "expo.out",
    scrollTrigger: { trigger: ".pie-gigante", start: "top 95%" },
  });
})();
