# Mi web personal

Mi portfolio, publicado en **https://jbalaguersalas.github.io/**

Estoy empezando en el desarrollo web y en esta página enseño las prácticas que he hecho en el bootcamp Full Stack de The Bridge. La hice con HTML, CSS y JavaScript, sin frameworks. Para las animaciones uso GSAP con sus plugins ScrollTrigger y Flip, que cargo desde cdnjs. Son tres archivos: `index.html`, `style.css` y `script.js`.

Uso mucho la IA para aprender: me explica los errores y me ayuda cuando me atasco.

## Qué tiene

- **Portada** con un titular en el que la palabra azul va cambiando (web, frontend, backend), un fondo de puntos que se apartan del ratón y una terminal que escribe sola. Los puntos solo se repintan mientras se mueve el ratón.
- **Proyectos**: nueve tarjetas con filtros (Frontend, JavaScript, TypeScript y Backend). Cada tarjeta tiene un dibujo hecho con HTML y CSS, sin imágenes.
- **Recorrido**: lo que vi en cada mes del bootcamp.
- **Herramientas** y **contacto**, con un botón para copiar mi correo.

## Diseño

Fondo casi negro con un toque azulado, titulares grandes y estrechos y un solo color de acento, el azul `#4da3ff`, el mismo que uso en mi perfil de GitHub. Los datos van en letra monoespaciada, como en el código.

- Fuentes: **Archivo**, que es variable y me deja estrechar los titulares con `font-stretch`, e **IBM Plex Mono**.
- La hice primero para móvil. Los saltos están en 480px, 720px, 900px y 1100px.
- Los colores están en variables en `:root`.

## Animaciones

- Los títulos se parten en palabras desde JavaScript y suben una a una al aparecer.
- Las tarjetas suben un poco al pasar el ratón y llevan una luz azul que lo sigue.
- Las animaciones de entrada duran menos de un segundo para que no haya que esperar.
- Al filtrar, Flip mueve las tarjetas a su nuevo sitio en vez de saltar.

En el móvil no hay luz en las tarjetas, porque no hay ratón. Si el sistema tiene activado "reducir movimiento", o si GSAP no carga, la web se ve entera sin animaciones.

## Cómo verla en local

Abre `index.html` en el navegador. Necesitas internet para las fuentes y GSAP.
