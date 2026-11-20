# Mi web personal

Mi portfolio, publicado en **https://jbalaguersalas.github.io/**

La hice a mano con HTML, CSS y un poco de JavaScript, sin frameworks. Son tres archivos: `index.html`, `style.css` y `script.js`.

## Qué tiene

- **Portada** con una frase que resume lo que hago y una petición de ejemplo a una API, porque lo que más me gusta es el backend.
- **Proyectos**: mis seis trabajos más completos del bootcamp, con su tecnología y enlace al código.
- **Lo que he aprendido**: apuntes que saqué de mis propios proyectos, cada uno con el repo de donde viene.
- **Recorrido**: lo que hice cada mes del bootcamp.
- **Contacto**.

## Diseño

Quería algo que no se pareciera a las plantillas de siempre, así que fui a un estilo de revista: fondo negro, titulares grandes y estrechos y un solo color de acento, el naranja. Los datos (tecnologías, commits, fechas) van en letra monoespaciada, como en el código.

- Fuentes: **Archivo**, que es variable y me deja estrechar los titulares con `font-stretch`, e **IBM Plex Mono**.
- Está hecha primero para móvil y tiene dos saltos: tablet (720px) y ordenador (1000px).
- Todos los colores están en variables en `:root`, así que cambiar la paleta es tocar siete líneas.

## Cómo verla en local

Abre `index.html` en el navegador. No hace falta instalar nada.

## Lo que hace `script.js`

- Saca las líneas de la terminal de la portada una a una, como si estuviera escribiendo.
- Pide a la API de GitHub cuántos repos tengo y cuál fue mi último push, y lo pone en la portada.
- Pinta mi gráfica de contribuciones de las últimas 16 semanas con los datos de `github-contributions-api.jogruber.de`.
- Hace que las secciones aparezcan al bajar con `IntersectionObserver`, sube los contadores de 0 a su número y mueve la luz naranja de los proyectos con el ratón.

Si alguna petición falla, la web sigue funcionando con los datos que ya trae el HTML. Y si el sistema tiene activado "reducir movimiento", no hay animaciones.
