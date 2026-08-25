# Sección "Aprende visualmente": Galería/carrusel de imágenes en la Home

## Contexto
Blog en **Astro** (`src/pages/index.astro` = home). La home ya tiene secciones (hero, beneficios de lectura, posts recientes, categorías, newsletter) con un design system en `src/styles/global.css` (glassmorphism, variables `--accent`, dark mode vía `body.dark-mode`).

**Intención del usuario**: cuando no tenga ganas de leer, quiere una sección con **imágenes que ayuden a aprender cosas de distintos temas**. Es decir, un carrusel ("slides") de imágenes educativas, cada una con un caption que explique el tema que enseña. Debe ser un placeholder rellenable: funciona ya con imágenes de muestra y luego el usuario reemplaza el contenido.

## Plan

### 1. Nuevo componente `src/components/Gallery.astro`
Carrusel de imágenes autónomo, reutilizable y accesible:
- **Props**:
  - `title` (string) — p.ej. "Aprende visualmente".
  - `subtitle?` (string) — p.ej. "Cuando no quieras leer, mira y aprende de distintos temas".
  - `images` (array de `{ src: ImageMetadata, alt: string, caption: string, href?: string }`):
    - `caption`: texto corto que explica qué enseña la imagen (el tema).
    - `href?`: opcional, enlaza el slide a un post/categoría relacionada.
- Render con `<Image>` de `astro:assets` (optimización), track horizontal con `transform: translateX(...)`.
- **Controles**: botones prev/next, indicadores (dots), autoplay (~6s, pausa en hover/focus), flechas del teclado y swipe táctil.
- **Accesibilidad**: `aria-roledescription="slide"`, `aria-label` en botones, `aria-live` para el estado actual, respeto a `prefers-reduced-motion` (desactiva autoplay).
- **Estilos** en `<style>` scoped, siguiendo el design system (glass-card, variables de color, dark mode). Cada slide muestra la imagen + caption superpuesto/debajo.

### 2. Integrar en `src/pages/index.astro`
- Importar ~5 imágenes de muestra desde `src/assets` (ej. `iot-01.jpg`, `iot-02.jpg`, `iot-03.jpg`, `amigos.jpg`, `cuestionar.jpg`).
- Insertar `<Gallery .../>` entre "Posts Recientes" y "Explora por tema".
- `images` con `caption` descriptivos por tema y `alt` adecuados; el usuario reemplaza el array cuando tenga sus imágenes/captions reales.

### 3. Verificación
- `npm run build` (o `npm run dev`) para confirmar compilación y funcionamiento del carrusel.
- Comprobar responsividad, dark mode y que los captions se lean bien.
