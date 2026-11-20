# Mi web personal

Mi portfolio, publicado en **https://jbalaguersalas.github.io/**

La hice con HTML, CSS y JavaScript, sin frameworks. Para las animaciones uso GSAP con sus plugins ScrollTrigger y Flip, que cargo desde cdnjs. Son tres archivos: `index.html`, `style.css` y `script.js`.

## Qué tiene

- **Pantalla de carga** con un contador hasta 100. Si recargas la página en la misma visita, dura menos.
- **Portada** con un titular en el que la palabra naranja va cambiando (APIs, interfaces, extensiones, webs), un fondo de puntos que se apartan del ratón y una terminal que escribe sola.
- **Proyectos**: nueve tarjetas con filtros (Backend, Frontend, TypeScript y Herramientas). La más grande es PaySecure, mi extensión de navegador. Cada tarjeta tiene un dibujo hecho con HTML y CSS, sin imágenes.
- **Recorrido**: mis tres meses de bootcamp. En el ordenador la sección se queda fija y las tarjetas pasan de lado mientras bajas.
- **Herramientas**, **apuntes** de lo que aprendí en cada repo y **contacto**, con un botón para copiar mi correo.

## Diseño

Fondo negro, titulares grandes y estrechos y un solo color de acento, el naranja. Los datos van en letra monoespaciada, como en el código.

- Fuentes: **Archivo**, que es variable y me deja estrechar los titulares con `font-stretch`, e **IBM Plex Mono**.
- La hice primero para móvil. Los saltos están en 720px, 900px, 1000px y 1100px.
- Los colores están en variables en `:root`.

## Animaciones

- Los títulos se parten en palabras desde JavaScript y suben una a una al aparecer.
- Las tarjetas se inclinan un poco con el ratón y llevan una luz que lo sigue.
- Al filtrar, Flip mueve las tarjetas a su nuevo sitio en vez de saltar.
- El cursor es un círculo que crece encima de los enlaces. En las tarjetas pone "Ver".
- Los botones de contacto se van un poco hacia el ratón.

En el móvil no hay cursor ni inclinación, porque no hay ratón. Si el sistema tiene activado "reducir movimiento", o si GSAP no carga, la web se ve entera sin animaciones.

## Cómo verla en local

Abre `index.html` en el navegador. Necesitas internet para las fuentes y GSAP.
