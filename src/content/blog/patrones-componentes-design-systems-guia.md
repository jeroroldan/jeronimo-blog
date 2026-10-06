---
title: "Patrones y Componentes en Sistemas de Diseño: de Átomos a Tokens"
description: "Guía paso a paso de design systems: patrón vs componente, Atomic Design, patrones de lenguaje, funcionales y perceptivos, anatomía y estados de componentes, UI Kit y design tokens globales, alias y de componente."
pubDate: "2026-10-06"
code: "patrones-componentes-ds"
language: "es"
category: "diseno"
tags: ["design-systems", "componentes", "atomic-design", "design-tokens", "ui-kit", "figma"]
type: "guia"
level: "intermedio"
difficulty: "intermedio"
readingTime: 15
---

# 🧱 Patrones y Componentes en Sistemas de Diseño: de Átomos a Tokens

Tres FASES usables: defines patrones, construyes componentes y escalas con UI Kit y tokens.

## 🗺️ Mapa de 3 FASES

FASE 1 → Defines patrones (PARTE 1) → FASE 2 → Construyes componentes (PARTE 2) → FASE 3 → Escalas con kit y tokens (PARTE 3).

👀 Cómo leerlo: 3 fases de izquierda a derecha, de fácil a difícil.

### 📚 Pre-training: 7 términos antes de empezar

| Término | Significado en 1 línea |
|---------|------------------------|
| Patrón | Solución a un problema que se repite |
| Componente | Pieza UI reutilizable y versionada |
| Átomo y molécula | Pieza mínima y su primera unión |
| Variante y estado | Versión y momento del componente |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| Término | Significado en 1 línea |
|---------|------------------------|
| UI Kit | Librería ordenada de componentes |
| Design token | Decisión de diseño con nombre único |
| Microcopy | Texto corto que guía al usuario |

👀 Cómo leer las tablas: izquierda el nombre, derecha la idea corta.

## 🧬 PARTE 1: Piensa en Patrones (Nivel 1/5)

1. ❓ PRETEST — Tu app tiene 5 botones distintos y 3 tonos de error. ¿Te falta un patrón o un componente? (Activa previas | Media)
> Respuesta esperada: ambos, el patrón define la solución y el componente la ejecuta igual siempre.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Sin patrones cada pantalla reinventa la rueda. Vas a lograr clasificar 1 caso en patrón y subirlo por la escalera atómica. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Toma 1 pantalla tuya y etiqueta 3 átomos: 1 color, 1 texto y 1 botón. Ya ves en atómico. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el patrón es la receta, el componente es el plato servido igual siempre. Definición: Atomic Design sube de átomos a moléculas, organismos, plantillas y páginas. Analogía de principios: la constitución del producto, todo diseño la obedece. Analogía de lenguaje: la voz del barista que siempre saluda igual. Analogía de perceptivos: el uniforme del equipo, color y tipo que se reconocen. (Pre-training + señalización | Media)

| Nivel atómico | Ejemplo real |
|---------------|--------------|
| Átomo | Color primario y texto de botón |
| Molécula | Icono más campo de búsqueda |
| Organismo | Cabecera con logo y menú |
| Plantilla y página | Grilla con contenido real |

👀 Cómo leer la tabla: izquierda el nivel, derecha su ejemplo. Más: funcionales describen flujos como login en 3 pasos; documentar un patrón pide nombre, problema, ejemplo bueno y malo. Ejemplo numérico: 5 pantallas con 1 patrón de formulario ahorran 12 decisiones repetidas. Por qué funciona: nombrar igual alinea diseño y código. Cuándo falla: si documentas 40 patrones que nadie consulta. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: errores inconsistentes. I Do: defino patrón de error con tono, color e icono únicos. We Do: ¿patrón o componente? → patrón la regla, componente su ejecución. You Do: punto 7. Visual: Problema repetido → Regla escrita → Componente único. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Crear 8 botones parecidos porque cada diseñador inventó el suyo. → Corrección: 1 patrón de botón documentado y 1 solo componente base. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Elige 1 problema repetido de tu producto y escríbelo como patrón: nombre, problema y ejemplo bueno.
> Respuesta esperada: patrón en 3 líneas coherentes. Ejemplo: confirmación destructiva con doble paso. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué diferencia patrón de componente y qué 5 niveles tiene lo atómico? (Nivel Bloom: recordar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — El patrón decide una vez para no decidir cien veces.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Etiqueté 3 átomos [ ] Escribí 1 patrón [ ] Sé los 5 niveles. Siguiente: convertir patrones en componentes duros. (Metacognición | Media)

## 🧩 PARTE 2: Construye Componentes Duros (Nivel 3/5)

1. ❓ PRETEST — Tu botón se ve bien pero nadie sabe su foco por teclado. ¿Está terminado? (Activa previas | Media)
> Respuesta esperada: no, le faltan estados, accesibilidad y documentación mínima.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — El componente a medias genera deuda en cada pantalla. Vas a lograr definir anatomía, variantes, estados y accesibilidad de 1 componente. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Abre tu botón y lista sus estados: reposo, hover, activo, foco y deshabilitado. Ya auditaste 1 componente. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el componente es el ladrillo certificado, misma medida en todo edificio. Definición: utilidad de negocio, menos tiempo por pantalla y menos bugs visuales. Analogía de tipos: base como el tornillo, compuesto como el mueble, layout como el plano del cuarto. Analogía de anatomía: el despiece del motor, cada parte con nombre y rol. (Pre-training + señalización | Media)

| Requisito mínimo | Qué incluye |
|------------------|-------------|
| Anatomía | Partes nombradas y qué hace cada una |
| Variantes | Tamaños y énfasis permitidos |
| Estados | Reposo, hover, activo, foco, disabled |
| Accesibilidad | Contraste, foco visible y lector |

👀 Cómo leer la tabla: izquierda el requisito, derecha su contenido. Más: cada componente lleva cuándo usar y cuándo no, más ejemplo en Figma con auto-layout. Por qué funciona: lo completo se reusa sin preguntar al autor. Cuándo falla: si agregas 20 variantes para casos únicos. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: tarjeta de producto usada en 6 pantallas. I Do: defino anatomía de imagen, título, precio y botón con 2 variantes y 5 estados. We Do: ¿qué falta para accesibilidad? → foco visible y nombre para lector. You Do: punto 7. Visual: Anatomía → Variantes y estados → Documentación mínima. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Componente con 15 variantes y cero estados de foco ni disabled. → Corrección: congela variantes a 3 y completa los 5 estados antes de publicar. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Audita 1 componente tuyo distinto a la tarjeta: lista anatomía, variantes, estados y 1 hueco de accesibilidad.
> Respuesta esperada: auditoría en 4 líneas con 1 hueco detectado y su arreglo. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué 4 mínimos tiene un componente y qué diferencia base de layout? (Nivel Bloom: comprender) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Componente terminado es anatomía más estados más accesibilidad documentada.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Audité 1 componente [ ] Listé 5 estados [ ] Detecté 1 hueco. Siguiente: escalar todo con kit y tokens. (Metacognición | Media)

## 🎨 PARTE 3: Escala con Kit y Tokens (Nivel 5/5)

1. ❓ PRETEST — Cambias el color primario en 30 pantallas de Figma y en 3 apps. ¿Cuántos lugares tocas? (Activa previas | Media)
> Respuesta esperada: uno solo, el token global, y todo hereda el cambio.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Sin tokens cada cambio es cacería manual. Vas a lograr nombrar 3 niveles de tokens y documentar 1 componente con Do y Don't. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Nombra tu color primario como token global y úsalo en 1 botón. Ya conectaste decisión con ejecución. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: los tokens son el diccionario oficial, 1 palabra significa 1 solo valor. Definición: globales guardan valores crudos, alias dan intención por tema, componente fija el uso final. Analogía del UI Kit: la ferretería ordenada donde cada cajón tiene etiqueta. Analogía de Do y Don't: el semáforo del componente, 1 ejemplo que sí y 1 que no. (Pre-training + señalización | Media)

| Nivel de token | Ejemplo con nombre |
|----------------|--------------------|
| Global | Azul 600 como valor crudo |
| Alias de tema | Primario apunta al azul 600 |
| Componente | Fondo de botón usa primario |
| Plataforma | Mismo nombre en CSS, iOS y Android |

👀 Cómo leer la tabla: izquierda el nivel, derecha su ejemplo. Más: documentar el kit pide comportamiento, Do y Don't visuales y specs técnicas. Por qué funciona: 1 nombre sincroniza Figma y las 3 plataformas. Cuándo falla: si creas alias por pantalla en vez de por intención. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: modo oscuro en 2 semanas. I Do: creo alias que cambian por tema sin tocar componentes. We Do: ¿qué documento del botón? → Do con primario y Don't con gris apagado. You Do: punto 7. Visual: Global → Alias por tema → Componente. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Valores pegados a mano en cada archivo y kit sin Do ni Don't que nadie respeta. → Corrección: todo valor nace de un token y cada componente muestra su mal uso. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA MIXTA — Mezcla las 3 PARTES: toma tu componente auditado, nómbrale 3 tokens en sus 3 niveles y documéntalo con 1 Do y 1 Don't.
> Respuesta esperada: 3 tokens encadenados más Do y Don't coherentes. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: explicá patrón, átomos, anatomía, UI Kit y los 3 niveles de tokens. (Nivel Bloom: aplicar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Un nombre por decisión sincroniza diseño y código en todas partes.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Nombré 3 tokens [ ] Documenté Do y Don't [ ] Mezclé las 3 PARTES. Siguiente: tokeniza 1 pantalla real esta semana. (Metacognición | Media)
