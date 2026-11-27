# Mi web personal

Mi portfolio, publicado en **https://jbalaguersalas.github.io/**

Estoy empezando en el desarrollo web y en esta página enseño las prácticas que he hecho en el bootcamp Full Stack de The Bridge. La hice con HTML, CSS y JavaScript, sin frameworks. Para las animaciones uso GSAP con ScrollTrigger y Flip, y Lenis para el scroll suave. Son tres archivos: `index.html`, `style.css` y `script.js`.

Uso mucho la IA para aprender: me explica los errores y me ayuda cuando me atasco.

## Qué tiene

- **Portada**: mi nombre en grande sobre mi foto. Donde las letras tocan la foto, los colores se invierten. Una luz sigue al ratón por la foto y las letras hacen una ola cuando pasas cerca.
- **Banda ASCII**: una franja de caracteres que dibujan luz y sombra en movimiento. Cerca del ratón los caracteres se revuelven como en una terminal.
- **Sobre mí**: tres fichas con mi nivel, lo que he practicado y cómo aprendo.
- **Proyectos**: nueve tarjetas con filtros. Dos llevan capturas reales de la práctica que se desplazan al pasar el ratón, la de la varita mágica es una página de juguete que cambia de color y el resto enseña un trozo del código.
- **Recorrido**: lo que vi cada mes del bootcamp, como una agenda.
- **Herramientas**, **contacto** con un botón para copiar mi correo, y un pie con mi nombre gigante.

## Diseño

Me inspiré en la web de Griffin y en las plantillas Keynote y Soren que vi en godly.design.

- Colores: negro cálido, crema y un solo acento lavanda. Están todos en variables en `:root`.
- Fuentes: **Instrument Sans** para el nombre y los textos, **Newsreader** para los titulares e **IBM Plex Mono** para el código.
- Funciona en móvil: la portada se recoloca y los filtros se pueden deslizar.

## Accesibilidad

- Si el sistema tiene activado "reducir movimiento", o si GSAP no carga, la web se ve entera y quieta.
- Todo se puede usar con el teclado y tiene un enlace para saltar a los proyectos.
- Los enlaces que abren otra pestaña lo avisan a los lectores de pantalla.

## Cómo verla en local

Abre `index.html` en el navegador. Necesitas internet para las fuentes, GSAP y Lenis.
