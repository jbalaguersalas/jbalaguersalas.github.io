# Mi web personal

Mi portfolio, publicado en **https://jbalaguersalas.github.io/**

La hice a mano con HTML y CSS, sin frameworks ni JavaScript. Son dos archivos: `index.html` y `style.css`.

## Qué tiene

- **Portada** con una frase que resume lo que hago y una petición de ejemplo a una API, porque lo que más me gusta es el backend.
- **Proyectos**: mis seis trabajos más completos del bootcamp, con su tecnología y enlace al código.
- **Lo que he aprendido**: apuntes que saqué de mis propios proyectos, cada uno con el repo de donde viene.
- **Recorrido**: lo que hice cada mes del bootcamp.
- **Contacto**.

## Diseño

Quería algo que no se pareciera a las plantillas de siempre, así que fui a un estilo de revista: fondo color papel, titulares grandes y estrechos y un solo color de acento, el naranja. Los datos (tecnologías, commits, fechas) van en letra monoespaciada, como en el código.

- Fuentes: **Archivo**, que es variable y me deja estrechar los titulares con `font-stretch`, e **IBM Plex Mono**.
- Si el ordenador tiene el modo oscuro activado, la web cambia de colores sola con `prefers-color-scheme`.
- Está hecha primero para móvil y tiene dos saltos: tablet (720px) y ordenador (1000px).
- Todos los colores están en variables en `:root`, así que cambiar la paleta es tocar seis líneas.

## Cómo verla en local

Abre `index.html` en el navegador. No hace falta instalar nada.
