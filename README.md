# Mi web personal

Mi portfolio, publicado en **https://jbalaguersalas.github.io/**

Soy desarrollador Full Stack junior y en esta web enseño los proyectos que he hecho en el bootcamp de The Bridge. La hice con HTML, CSS y JavaScript, sin frameworks. Para las animaciones uso GSAP con sus plugins ScrollTrigger y Flip, que cargo desde cdnjs. Son tres archivos: `index.html`, `style.css` y `script.js`.

Cuando me atasco con algo, me apoyo en la IA para entender el error y seguir.

## Qué tiene

- **Portada** con un titular en el que la palabra azul va cambiando (APIs, webs, interfaces), un fondo de puntos que se apartan del ratón y una terminal que escribe sola.
- **Proyectos**: nueve tarjetas con filtros (Frontend, JavaScript, TypeScript y Backend). Cada tarjeta tiene un dibujo hecho con HTML y CSS, sin imágenes.
- **Recorrido**: mis tres meses de bootcamp. En el ordenador la sección se queda fija y las tarjetas pasan de lado mientras bajas.
- **Herramientas** y **contacto**, con un botón para copiar mi correo.

## Diseño

Fondo casi negro con un toque azulado, titulares grandes y estrechos y un solo color de acento, el azul `#4da3ff`, el mismo que uso en mi perfil de GitHub. Los datos van en letra monoespaciada, como en el código.

- Fuentes: **Archivo**, que es variable y me deja estrechar los titulares con `font-stretch`, e **IBM Plex Mono**.
- La hice primero para móvil. Los saltos están en 480px, 720px, 900px, 1000px y 1100px.
- Los colores están en variables en `:root`.

## Animaciones

- Los títulos se parten en palabras desde JavaScript y suben una a una al aparecer.
- Las tarjetas llevan una luz azul que sigue al ratón.
- Al filtrar, Flip mueve las tarjetas a su nuevo sitio en vez de saltar.

En el móvil no hay luz en las tarjetas, porque no hay ratón. Si el sistema tiene activado "reducir movimiento", o si GSAP no carga, la web se ve entera sin animaciones.

## Cómo verla en local

Abre `index.html` en el navegador. Necesitas internet para las fuentes y GSAP.
