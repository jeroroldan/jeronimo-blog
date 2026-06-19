# Plan: Agregar blogs de inglés para trabajar en Estados Unidos

## Estado actual
El usuario ya cuenta con 9 blogs de inglés:
- `ingles.md` – Números en inglés
- `ingles-it.md` – Inglés para IT (muy completo: vocabulario técnico, meetings, code reviews, email profesional)
- `infgle.md` – Masterclass 80/20 (principiante)
- `aprendizage-intensivo-ingles.md` – Aprendizaje intensivo
- `guia-ingles.md` – Dominar inglés nivel intermedio (20 estrategias)
- `brain-english-fluency.md` – Entrenamiento cerebral para fluidez
- `guia-aprender-idioma-autodidacta.md` – Guía general autodidacta
- `metodo-aprendizaje-idiomas-6-pasos.md` – Método 6 pasos
- `ingles43.md` – Vocabulario esencial (palabras más usadas)

## Brechas detectadas para el objetivo "trabajar en EE.UU."
El contenido cubre bien fundamentos, vocabulario técnico y estrategias de aprendizaje, pero **falta** material específico orientado a:
1. Entrevistas de trabajo en inglés (behavioral + técnico)
2. Inglés para LinkedIn/CV y aplicación remota
3. Inglés para el primer onboarding y day-to-day laboral
4. Inglés conversacional para networking y small talk profesional
5. Cultura laboral estadounidense (comunicación indirecta, feedback, reuniones)
6. Inglés para servicios/trámites cotidianos en EE.UU.

## Acción propuesta
Agregar 6 blogs nuevos en `src/content/blog/`, siguiendo el formato y frontmatter del proyecto (`title`, `description`, `pubDate`, `code`, `category`, `tags`, `difficulty`, `readingTime`), manteniendo el tono práctico y accionable del usuario.

### Archivos nuevos a crear:
1. **`ingles-entrevistas-trabajo.md`**
   - Behavioral questions STAR method
   - Preguntas técnicas comunes y cómo responderlas
   - Cómo explicar proyectos y experiencia en inglés
   - Preguntas para hacerle al entrevistador
   - Errores comunes y tips de pronunciación en entrevistas

2. **`ingles-linkedin-cv-remote.md`**
   - Cómo escribir un CV en inglés para EE.UU.
   - LinkedIn profile optimization en inglés
   - Cober letters templates para diferentes roles
   - Networking en LinkedIn: mensajes y conexiones
   - Plataformas para aplicar a trabajos remotos en dólares

3. **`ingles-onboarding-day-one.md`**
   - Inglés para la primera semana: presentaciones, reuniones diarias
   - Cómo entender acentos diversos (india, latinoamericano, etc.)
   - Tomar notas y pedir aclaraciones sin miedo
   - Vocabulario del primer día (HR terms, benefits, tools)

4. **`ingles-small-talk-networking.md`**
   - Rompehielos para conferencias y eventos de tecnología
   - Cómo mantener conversaciones casuales en la oficina
   - Temas seguros vs temas riesgosos en EE.UU.
   - Invitaciones sociales y cómo aceptarlas/declinarlas con naturalidad

5. **`ingles-cultura-laboral-us.md`**
   - Comunicación indirecta vs directa en EE.UU.
   - Cómo dar y recibir feedback profesional
   - Jerarquía plana: cómo hablar con jefes y colegas
   - Horarios, puntualidad y normas no escritas

6. **`ingles-vida-cotidiana-eeuu.md`**
   - Inglés para abrir cuenta bancaria, celular, seguros
   - Llamadas a servicios (Internet, electricidad, doctor)
   - Interacciones con policía/tránsito
   - Compras, restaurantes y socialización informal

## Criterios de éxito
- 6 archivos nuevos creados en `src/content/blog/`
- Cada blog tiene >200 líneas con contenido práctico, ejemplos y ejercicios
- Frontmatter compatible con `src/content.config.ts`
- Estructura y tono similares a los blogs existentes
