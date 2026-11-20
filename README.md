# Mi web personal

Mi portfolio como desarrollador full stack. Lo hice durante el bootcamp de Full Stack de The Bridge para tener en un solo sitio los proyectos que he ido haciendo.

Está publicada con GitHub Pages: <https://jbalaguersalas.github.io/>

## Qué hay en la web

Es una sola página con cuatro partes. El menú de arriba lleva a cada una:

- **Inicio**: mi foto, una frase sobre lo que hago y dos botones, uno para ir a los proyectos y otro a mi GitHub.
- **Proyectos**: seis tarjetas que enlazan a su repositorio. Las dos primeras están destacadas con el borde azul:
  - [API gimnasio FitVal](https://github.com/jbalaguersalas/api-gimnasio-fitval): NestJS, PostgreSQL, login con JWT y Docker.
  - [API Rastro](https://github.com/jbalaguersalas/api-rastro): Express, TypeScript, MongoDB y GitHub Actions.
  - [API de libros y pedidos](https://github.com/jbalaguersalas/nestjs-postgresql-supabase-render): NestJS con Supabase, desplegada en Render.
  - [Base de datos de un gimnasio](https://github.com/jbalaguersalas/Proyecto-SQL-Gimnasio): modelo relacional y consultas en PostgreSQL.
  - [Web minimalista en Docker](https://github.com/jbalaguersalas/-Pr-ctica-Docker-Web-Minimalista): una web maquetada y servida con nginx desde un contenedor.
  - [Currículum web](https://github.com/jbalaguersalas/web-cv): un CV en HTML y CSS.
- **Herramientas**: lo que uso, en cuatro grupos: backend, bases de datos, frontend y flujo de trabajo.
- **Contacto**: un botón para escribirme y otro a GitHub.

## Cómo está hecha

Solo HTML y CSS, sin frameworks ni JavaScript. Hay tres archivos: `index.html`, `style.css` y `avatar.jpg`.

- **Diseño oscuro con azul.** Los colores están en variables en `:root`: fondo negro (`--fondo`), tarjetas casi negras (`--tarjeta`) y un azul (`--azul: #4da3ff`) para los enlaces, los bordes y los botones.
- **Tipografías** de Google Fonts: Sora para los títulos y Manrope para el texto.
- **Efectos al pasar el ratón**: las tarjetas se iluminan con un borde azul y una sombra, y los botones cambian de color con una transición de 0,3 segundos.
- **Proyectos en rejilla** de dos columnas con CSS Grid.
- **Responsive**: por debajo de 700px la foto se pone encima del texto y los proyectos pasan a una columna.
- **Accesibilidad**: si el sistema tiene activado "reducir movimiento", quito las transiciones con `prefers-reduced-motion`.
- **Al compartir el enlace**: las etiquetas `og:` del `head` hacen que salga con título, descripción y foto.

## Cómo verla

En <https://jbalaguersalas.github.io/>, o descargando el repositorio y abriendo `index.html` en el navegador.

## Qué aprendí

**A publicar una web gratis con GitHub Pages.** Si el repositorio se llama `usuario.github.io`, GitHub publica el `index.html` de la rama `main` en esa dirección.

**A organizar los colores con variables.** Si quiero cambiar el azul, lo cambio en un sitio y se actualiza en toda la página.

**A contar mis proyectos en pocas líneas.** Cada tarjeta tiene una frase y unas etiquetas. Tuve que elegir qué era lo más importante de cada uno.
