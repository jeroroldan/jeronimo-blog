---
title: "Programación Agéntica con IA"
code: "IA"
description: "Resumen Completo - Conceptos Arquitectónicos de Laravel"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 🧠 Master Class: Programación Agéntica con IA

### Conceptos fundamentales — lo que no cambia aunque las herramientas sí

> **Filosofía de esta guía:** Entender el _porqué_ antes que el _cómo_.  
> Las herramientas cambian cada semana. Los principios, no.

---

## Tabla de Contenidos

1. [¿Qué es realmente un Agente?](#1-qué-es-realmente-un-agente)
2. [El System Prompt — La Constitución](#2-el-system-prompt--la-constitución)
3. [Las Tools — La diferencia entre hablar y actuar](#3-las-tools--la-diferencia-entre-hablar-y-actuar)
4. [El Contexto — El recurso más escaso](#4-el-contexto--el-recurso-más-escaso)
5. [La Memoria — Cómo el agente aprende y persiste](#5-la-memoria--cómo-el-agente-aprende-y-persiste)
6. [Las Skills — Expertise empaquetado](#6-las-skills--expertise-empaquetado)
7. [MCP — El puente seguro al mundo exterior](#7-mcp--el-puente-seguro-al-mundo-exterior)
8. [La estrategia ganadora](#8-la-estrategia-ganadora)

---

## 1. ¿Qué es realmente un Agente?

### La diferencia fundamental

Un **chatbot** responde preguntas. Un **agente** completa objetivos.

Cuando le preguntás a un chatbot "¿cómo refactorizo este código?", te explica cómo hacerlo. Cuando le das esa misma tarea a un agente, él lo hace: abre el archivo, lo analiza, escribe el nuevo código, ejecuta los tests, corrige los errores, y te avisa cuando terminó.

La diferencia no es de inteligencia. Es de **autonomía y capacidad de actuar**.

### El loop que define a todo agente

Todo agente, sin importar la herramienta, funciona con el mismo ciclo:

```
Recibe objetivo → Razona → Decide acción → Ejecuta → Observa resultado → Razona de nuevo → ...
```

Este loop se repite hasta que el agente considera que el objetivo está cumplido o que no puede avanzar más. Entender esto es fundamental porque te permite predecir cómo va a comportarse el agente ante cualquier situación.

### Agentes locales vs remotos — y por qué la distinción se está borrando

Un **agente local** (como Claude Code o Cursor) corre en tu máquina. Tiene acceso directo a tus archivos, puede abrir tu terminal, ver tu pantalla, interactuar con tu editor. La latencia es baja porque todo pasa en tu computadora.

Un **agente remoto** corre en la nube. No tiene acceso directo a nada tuyo; necesita que le habilités acceso explícitamente a través de APIs o protocolos seguros.

La razón por la que esta distinción se está borrando es que los agentes locales ahora pueden llamar servicios remotos (MCPs en la nube), y los agentes remotos pueden controlar máquinas locales mediante sandboxes. La arquitectura converge hacia: **el agente corre donde sea conveniente, y accede a los recursos donde estén**.

### Lo que tenés que entender antes de usar un agente

Antes de delegar una tarea a un agente, respondé estas tres preguntas:

1. **¿Qué necesita saber?** — Contexto, reglas del proyecto, convenciones del equipo
2. **¿Qué puede hacer?** — Qué herramientas tiene habilitadas, a qué sistemas puede acceder
3. **¿Cómo sabe que terminó?** — Cuál es el criterio de éxito

Sin respuestas claras a las tres, el agente va a hacer algo, pero probablemente no lo que vos querías.

---

## 2. El System Prompt — La Constitución

### Qué es y por qué es el pilar más importante

El system prompt es el conjunto de instrucciones que recibe el agente antes de que vos le digas nada. Es lo primero que lee, es lo que define su identidad, sus reglas y sus límites.

Pensalo como la **constitución de un país**: no le dice al gobierno exactamente qué hacer en cada situación, pero establece los principios que deben guiar todas sus decisiones. El agente puede tomar miles de decisiones pequeñas durante una tarea; el system prompt es lo que garantiza que todas esas decisiones vayan en la misma dirección.

### Los fabricantes te dan uno por defecto, pero podés personalizarlo

Claude Code, Cursor, y todas las herramientas agénticas tienen un system prompt que el fabricante escribió. Ese prompt genérico hace que la herramienta funcione razonablemente bien para cualquier proyecto.

El problema es que "razonablemente bien para cualquier proyecto" no es lo mismo que "excelente para tu proyecto específico". Tu proyecto tiene convenciones propias, decisiones de arquitectura ya tomadas, tecnologías elegidas, cosas que el equipo acordó no hacer. El agente genérico no sabe nada de eso.

Cuando personalizás el system prompt, le estás transmitiendo ese conocimiento institucional. La diferencia en calidad de output es enorme.

### Qué debe tener un system prompt efectivo

Un buen system prompt tiene cuatro componentes:

**El rol:** No solo "sos un asistente de programación". Algo más específico: "Sos un senior engineer especializado en arquitecturas event-driven para el equipo de plataforma de la empresa X". Cuanto más específico el rol, más coherentes las decisiones del agente.

**El contexto del proyecto:** El stack tecnológico, la arquitectura elegida, las dependencias principales, el entorno donde corre. El agente necesita saber en qué mundo está operando.

**Las convenciones:** Las reglas del equipo. Nombres de archivos, estructura de directorios, estilo de código, patrones preferidos. Esto evita que el agente haga código "correcto" pero inconsistente con el resto del proyecto.

**Las restricciones:** Lo que explícitamente NO debe hacer. No instalar dependencias sin aprobación. No modificar archivos de configuración críticos. No hacer commits directamente a main. Los límites son tan importantes como las instrucciones.

### El error más común

La mayoría de los desarrolladores usa el system prompt por defecto y luego pasa el día corrigiendo al agente para que siga las convenciones del proyecto. Es un ciclo frustrante y evitable.

Invertí una hora en escribir un buen system prompt al inicio del proyecto. Ese tiempo se recupera en las primeras dos horas de trabajo con el agente.

---

## 3. Las Tools — La diferencia entre hablar y actuar

### Por qué las tools son lo que hacen a un agente un agente

Un LLM sin tools solo puede generar texto. Puede describir perfectamente cómo resolver un problema, pero no puede resolverlo. Las tools son las que le dan manos.

Cuando el agente tiene una tool de lectura de archivos, puede ver tu código. Cuando tiene una tool de escritura, puede modificarlo. Cuando tiene acceso al terminal, puede ejecutar comandos. Cuando tiene acceso a internet, puede buscar documentación actualizada.

Cada tool que habilitás expande lo que el agente puede hacer. Pero también expande lo que el agente puede hacer _mal_. Por eso la selección y configuración de tools es una decisión de diseño, no solo técnica.

### Los dos tipos de tools

**Tools de lectura (solo observan):**
Leer archivos, buscar en el codebase, consultar bases de datos en modo readonly, revisar logs, listar directorios. Estas tools son de bajo riesgo porque el agente puede usarlas libremente sin consecuencias permanentes. Si lee algo que no debería, no pasa nada grave.

**Tools de escritura (modifican el mundo):**
Escribir archivos, ejecutar comandos, hacer commits, enviar emails, modificar registros en una base de datos, llamar APIs que tienen efectos secundarios. Estas tools son de alto riesgo porque sus efectos son permanentes o difíciles de revertir.

La regla práctica: dale al agente todas las tools de lectura que necesite, pero sé muy cuidadoso con las de escritura. Un agente que puede leer todo pero no puede escribir nada todavía es muy útil; un agente que puede escribir sin restricciones puede causar daños reales.

### El principio de menor privilegio

Este principio viene de seguridad informática y aplica perfectamente a los agentes: dale al agente exactamente las permissions que necesita para la tarea, no más.

Si la tarea es analizar el código y sugerir mejoras, el agente solo necesita tools de lectura. Si la tarea es implementar una feature, necesita leer y escribir archivos, pero no necesariamente acceso a la base de datos de producción.

Hay una tentación de darle al agente acceso a todo "para que no tenga limitaciones". Resistí esa tentación. Un agente con menos tools es más predecible, más seguro, y más fácil de debuggear cuando algo sale mal.

### Cómo el agente decide qué tool usar

El agente no tiene un script rígido que dice "primero usa esta tool, luego esta otra". Razona sobre qué tool le va a dar la información que necesita en cada momento.

Si estás refactorizando un módulo, el agente primero va a querer leer el archivo. Luego probablemente va a buscar otros archivos que lo usan. Luego va a escribir la nueva versión. Luego va a ejecutar los tests. Luego, si fallan, va a leer el output del test y ajustar el código.

Este proceso se parece mucho a cómo un programador humano trabaja. La diferencia es que el agente lo hace más rápido y no se cansa.

---

## 4. El Contexto — El recurso más escaso

### Qué es el contexto y por qué tiene límite

El contexto es toda la información que el LLM tiene disponible en un momento dado para tomar decisiones: el system prompt, la conversación hasta ahora, los resultados de las tools que usó, los archivos que leyó, los errores que encontró.

El LLM tiene una ventana de contexto finita, que se mide en tokens (aproximadamente palabras o fragmentos de palabras). Claude, por ejemplo, puede manejar alrededor de 200,000 tokens. Suena mucho, pero en una sesión larga de desarrollo se puede llenar.

El límite existe por razones técnicas y económicas: procesar más tokens es más caro y más lento. Pero más importante que el límite técnico es el **límite de calidad**: cuando el contexto está muy lleno, el modelo empieza a "prestar menos atención" a las cosas que están lejos en el texto. Es como cuando vos estás leyendo un documento larguísimo y los detalles del principio empiezan a mezclarse.

### Contexto estático vs contexto dinámico

Esta distinción es crucial para usar agentes eficientemente.

El **contexto estático** es la información que siempre está presente desde el inicio: el system prompt, las convenciones del equipo, la descripción del proyecto. Es el "conocimiento base" del agente. No cambia durante la sesión.

El **contexto dinámico** es la información que el agente descubre y acumula mientras trabaja: los archivos que va leyendo, los resultados de los tests, los errores que encuentra, las decisiones que va tomando. Empieza vacío y crece a medida que el agente avanza.

El problema de gestión del contexto casi siempre viene del contexto dinámico: el agente lee archivos grandes, los resultados de los tests son extensos, hay muchas iteraciones. El contexto estático generalmente no es el cuello de botella.

### La estrategia: contexto lazy (bajo demanda)

El error que cometen muchos desarrolladores es intentar cargar todo el contexto relevante al inicio: "te voy a pasar todos los archivos del proyecto para que los tengas en cuenta".

Esto es contraproducente por dos razones. Primero, llena el contexto con información que quizás el agente nunca necesite. Segundo, "distrae" al modelo con demasiada información simultánea.

La estrategia correcta es **lazy loading del contexto**: el agente empieza con el mínimo necesario y va cargando información adicional a medida que la necesita. Si está trabajando en el módulo de autenticación, no necesita saber los detalles del módulo de pagos. Los va a cargar si resultan relevantes.

Esta estrategia imita cómo trabaja un programador humano experto: no lee todo el codebase antes de empezar, lee lo que necesita cuando lo necesita.

### Qué hacer cuando el contexto se llena

Cuando el contexto está por llenarse en una sesión larga, tenés tres opciones:

**Resumir el historial:** Pedirle al modelo que haga un resumen de lo que se hizo hasta ahora, guardar ese resumen, y empezar una nueva sesión con ese resumen como punto de partida. Perdés algo de detalle pero mantenés lo esencial.

**Dividir la tarea:** Si la tarea es tan larga que no cabe en un contexto, probablemente es demasiado grande. Dividila en subtareas más pequeñas que el agente pueda completar en sesiones independientes.

**Ser selectivo con lo que entra:** No todos los resultados de las tools necesitan estar en el contexto indefinidamente. Un resultado de búsqueda que ya usaste puede ser descartado. Un archivo que ya terminaste de modificar puede salir del contexto activo.

---

## 5. La Memoria — Cómo el agente aprende y persiste

### El problema fundamental: el agente no recuerda

Cada vez que iniciás una nueva sesión con un agente, empieza desde cero. No recuerda la conversación de ayer, no sabe qué decisiones tomaste la semana pasada, no conoce los errores que encontraste el mes pasado. Esto no es un bug, es como funciona la tecnología actualmente.

La **memoria** es el conjunto de mecanismos que usamos para darle al agente continuidad entre sesiones. Sin memoria, el agente es brillante pero amnésico. Con memoria bien implementada, el agente mejora con el tiempo.

### Los cuatro tipos de memoria

**Memoria de proyecto** — La más importante. Son las convenciones, decisiones de arquitectura, y reglas del equipo que siempre deben estar presentes. Vive en un archivo `agents.md` en la raíz del proyecto. Todo el equipo lo mantiene. El agente lo lee al inicio de cada sesión. Es la forma más simple y efectiva de memoria.

**Memoria de sesión** — Información relevante solo mientras trabajás en algo específico. "Estoy refactorizando el módulo de auth, el contexto es X, las decisiones intermedias son Y". Se puede guardar en un archivo temporal que el agente lee al retomar el trabajo. Muy útil para tareas que llevan varios días.

**Memoria de tarea** — El estado de una tarea específica en progreso. Qué pasos se completaron, cuál es el siguiente, qué decisiones se tomaron en el camino. Permite al agente retomar una tarea larga desde donde la dejó sin empezar de cero.

**Memoria de largo plazo** — Aprendizajes acumulados: patrones que funcionaron bien, errores que se cometieron, soluciones a problemas recurrentes. Es la más difícil de implementar correctamente porque requiere decidir qué vale la pena recordar.

### El archivo `agents.md` — la pieza más importante

De todos los mecanismos de memoria, el más simple y más poderoso es un archivo `agents.md` en la raíz del proyecto.

Este archivo contiene todo lo que el agente necesita saber sobre cómo se trabaja en este proyecto: el stack, la arquitectura, las convenciones de código, las decisiones que ya se tomaron y por qué, las cosas que el equipo acordó no hacer. Es la memoria institucional del proyecto en formato que el agente puede leer.

La ventaja de este enfoque es su simplicidad: es un archivo de texto plano, lo puede editar cualquier miembro del equipo, se versiona con Git como cualquier otro archivo, y el agente puede leerlo con cualquier herramienta de lectura de archivos.

Cuando empezás un proyecto nuevo, crear el `agents.md` es una de las primeras inversiones que debería hacer el equipo. Cuando algo cambia en el proyecto (nueva convención, nueva decisión de arquitectura), actualizar el `agents.md` debería ser parte del proceso normal de trabajo.

### La diferencia entre documentación para humanos y memoria para agentes

La documentación técnica tradicional está escrita para humanos: tiene contexto implícito, usa términos que se asumen conocidos, tiene un estilo narrativo. Los agentes necesitan instrucciones más explícitas, más directas, y sin ambigüedad.

"El código debe ser limpio" no le sirve al agente. "Las funciones no pueden superar 50 líneas, los archivos no pueden superar 200 líneas, y cada función debe hacer exactamente una cosa" sí le sirve.

---

## 6. Las Skills — Expertise empaquetado

### Qué es una skill y cómo se diferencia de una tool

Una **tool** le da al agente la capacidad de hacer algo (leer archivos, ejecutar comandos). Una **skill** le da al agente el _conocimiento_ de cómo hacerlo bien en un contexto específico.

Un agente sin skills puede escribir código. Un agente con la skill de "diseño frontend para este proyecto" sabe que debe usar este sistema de colores, estas fuentes, estos patrones de componentes, y evitar estos anti-patrones que el equipo identificó en el pasado.

Las skills son expertise empaquetado y reutilizable. Las escribís una vez y las aplicás en múltiples proyectos o múltiples sesiones dentro del mismo proyecto.

### Cómo se estructura una skill

Una skill típicamente vive en un archivo Markdown (`SKILL.md`) dentro de una carpeta dedicada. Contiene:

**Cuándo activarse:** Una descripción clara de en qué situaciones esta skill es relevante. Esto permite detectar automáticamente qué skills aplicar según la tarea que el usuario describe.

**Las instrucciones específicas:** El conocimiento concreto. No principios vagos, sino guías específicas y aplicables. En lugar de "escribe código testeable", la skill de testing dice "usa Vitest, los archivos de test van junto al archivo que testean con extensión `.spec.ts`, y cada test sigue el patrón Arrange-Act-Assert".

**Ejemplos:** Los agentes aprenden mejor con ejemplos concretos que con instrucciones abstractas. Una skill bien escrita incluye ejemplos del output esperado.

### Skills de comportamiento vs skills de conocimiento

Hay dos categorías de skills según lo que aportan:

Las **skills de comportamiento** definen cómo el agente debe proceder: cómo estructurar su razonamiento, qué preguntas hacer antes de actuar, cómo comunicar sus decisiones. Son transversales y aplican a muchas tareas.

Las **skills de conocimiento** aportan expertise de dominio: cómo diseñar interfaces en este proyecto, cómo estructurar queries en esta base de datos, cómo manejar errores según las convenciones del equipo. Son específicas de un área.

Los mejores sistemas de skills combinan ambas.

### Por qué las skills escalán mejor que el system prompt

Podrías poner todo en el system prompt: las convenciones, el expertise de testing, las guías de diseño frontend, las reglas de base de datos. El problema es que el system prompt se vuelve enorme, difícil de mantener, y llena el contexto innecesariamente con información que quizás no es relevante para la tarea actual.

Las skills son modulares: se cargan solo cuando son relevantes. Si estás trabajando en una tarea de backend puro, la skill de diseño frontend no entra al contexto. Esto mantiene el contexto más pequeño y el sistema más mantenible.

---

## 7. MCP — El puente seguro al mundo exterior

### El problema que MCP resuelve

Los agentes necesitan acceder a sistemas externos: bases de datos, APIs, servicios de terceros, herramientas internas del equipo. Pero darle al agente acceso directo a esos sistemas presenta problemas serios:

¿Cómo pasás las credenciales de forma segura? ¿Cómo controlás qué puede hacer el agente en esos sistemas? ¿Cómo auditás qué acciones tomó? ¿Cómo limitás el acceso para que el agente no pueda borrar datos de producción aunque quiera?

El **Model Context Protocol (MCP)** es la respuesta a estos problemas. Es un protocolo estándar que actúa como intermediario controlado entre el agente y los sistemas externos.

### Cómo funciona conceptualmente

Imaginá que el agente es un nuevo empleado en tu empresa. No le das acceso directo a todos los sistemas con credenciales de administrador. En cambio, creás una cuenta con permisos específicos para su rol: puede leer ciertas tablas, no puede borrar nada, puede usar ciertos endpoints de la API pero no otros.

El MCP es ese sistema de permisos, pero para agentes. Creás un "servidor MCP" que envuelve el sistema externo y expone exactamente las operaciones que el agente puede realizar. El agente llama al servidor MCP, el servidor MCP verifica los permisos, ejecuta la operación, y devuelve el resultado.

### La diferencia entre una tool normal y un MCP

Una **tool normal** es código que corre en el mismo proceso que el agente o en la máquina local. Tiene acceso directo a los recursos de esa máquina. Es flexible pero puede ser insegura si no está bien controlada.

Un **MCP** es un servidor independiente. Puede correr en otra máquina, en la nube, en un contenedor aislado. El agente no tiene acceso directo al sistema externo; solo puede comunicarse con el servidor MCP a través de un protocolo bien definido. Esto permite:

- Credenciales que el agente nunca ve directamente
- Auditoría de todas las operaciones realizadas
- Rate limiting para evitar que el agente haga demasiadas requests
- Restricción de operaciones (solo lectura, solo ciertos recursos, etc.)
- Reutilización: el mismo servidor MCP puede ser usado por múltiples agentes

### Cuándo usar MCP y cuándo una tool normal

Usá **tools normales** para operaciones locales de bajo riesgo: leer archivos del proyecto, ejecutar comandos permitidos, buscar en el codebase. Son más simples de implementar y no necesitan la infraestructura adicional de un servidor.

Usá **MCP** cuando el agente necesita acceder a sistemas externos o sensibles: bases de datos (especialmente de producción), APIs de terceros con credenciales, servicios internos de la empresa, herramientas que manejan datos sensibles. La capa adicional de control vale el esfuerzo de implementación.

### MCPs disponibles vs MCPs personalizados

Existe un ecosistema creciente de servidores MCP ya construidos para herramientas populares: GitHub, Slack, Notion, bases de datos SQL, etc. Antes de construir uno propio, vale la pena ver si ya existe uno para el sistema que necesitás.

Cuando el sistema que necesitás es interno o tiene requisitos específicos de seguridad, entonces construís un MCP personalizado que expone exactamente las operaciones necesarias para tu caso de uso.

---

## 8. La estrategia ganadora

### El estado actual de la programación agéntica

Estamos en un momento particular en la evolución de esta tecnología. Los agentes son tremendamente capaces, pero todavía no son perfectos. Tienen limitaciones de contexto, a veces toman decisiones inesperadas, y necesitan guía.

La estrategia ganadora no es intentar que el agente sea completamente autónomo ni tampoco micromanejarlo en cada paso. Es encontrar el punto de colaboración donde el humano define el qué y el agente decide el cómo.

### La combinación que funciona hoy

La mejor práctica actual, basada en experiencia real de equipos que usan agentes en producción, combina dos cosas:

**Una memoria base sólida:** El `agents.md` con las convenciones del equipo, el system prompt personalizado para el proyecto, y skills bien documentadas para las áreas de expertise principales. Esto es el trabajo de configuración inicial que pagás una vez y te devuelve valor indefinidamente.

**Documentación estructurada en el repositorio:** No documentación escrita para los humanos del equipo, sino documentación escrita pensando en que el agente la va a leer. Decisiones de arquitectura con su razonamiento. ADRs (Architecture Decision Records). Guías de contribución específicas y sin ambigüedad.

La diferencia entre un equipo que lucha con sus agentes y uno que los usa fluidamente generalmente se reduce a esto: cuánto invirtieron en esta capa de documentación pensada para agentes.

### Los tres errores más comunes

**Error 1 — Darle demasiado contexto de entrada.** Pasarle al agente todos los archivos del proyecto "para que entienda todo". Esto satura el contexto y paradójicamente hace que el agente trabaje peor. La solución es confiar en que el agente va a pedir lo que necesita.

**Error 2 — No invertir en el system prompt.** Usar el prompt por defecto y luego corregir al agente constantemente. Cada corrección que hacés en el chat es una instrucción que debería estar en el system prompt o en el `agents.md`. Cuando te encontrás repitiendo la misma corrección, es señal de que tenés que actualizar tu memoria base.

**Error 3 — Darle tools de escritura sin restricciones.** Especialmente en agentes que tienen acceso a sistemas de producción. El principio de menor privilegio existe por una razón: los agentes cometen errores, y un agente con acceso irrestricto puede cometer errores costosos.

### Lo que viene

La distinción entre "usar un agente" y "programar un agente" se va a difuminar. Los desarrolladores que entiendan estos conceptos fundamentales vanastar en mejor posición para adapatarse a cualquier herramienta nueva que aparezca, porque todas van a construirse sobre los mismos pilares.

Las herramientas van a cambiar. Los pilares, no.

---

## Resumen ejecutivo

| Pilar             | Qué es                                  | Por qué importa                                 |
| ----------------- | --------------------------------------- | ----------------------------------------------- |
| **Agente**        | LLM con tools y un loop de razonamiento | Distingue entre asistir y actuar                |
| **System Prompt** | Instrucciones base, la "constitución"   | Define el comportamiento en cada decisión       |
| **Tools**         | Capacidades concretas de acción         | Sin tools, el agente solo habla                 |
| **Contexto**      | Información disponible en un momento    | Es finito; gestionarlo bien es clave            |
| **Memoria**       | Persistencia entre sesiones             | El agente es amnésico sin ella                  |
| **Skills**        | Expertise empaquetado y modular         | Conocimiento específico sin saturar el contexto |
| **MCP**           | Acceso controlado a sistemas externos   | Seguridad y auditoría sin sacrificar capacidad  |

---

_Lo que distingue a un equipo que usa agentes con fluidez de uno que los usa con frustración no es la herramienta elegida. Es cuánto tiempo invirtieron en entender estos conceptos y en construir la capa de memoria y configuración que los hace funcionar bien._
