---
title: "Guía Maestra: Programación Agente con OpenCode"
description: "Aprende a dominar OpenCode, la terminal que te permite programar mediante prompts, alternando entre planificación y construcción de forma fluida."
code: "opencode"
pubDate: 2026-04-29
author: "Antigravity"
tags: ["AI", "OpenCode", "Programming", "Terminal", "Productivity"]
heroImage: "../../assets/blog-placeholder-4.jpg"
---

# 🤖 Guía Maestra: Domina OpenCode y la Era de la Programación Agente

> **"No estás escribiendo código; estás dirigiendo a un equipo de expertos que lo escriben por ti."**

Imagina que tu terminal no solo ejecutara comandos, sino que entendiera tus intenciones. OpenCode es esa interfaz (TUI) que transforma tu flujo de trabajo en una conversación estratégica. Deja de saltar entre el editor y la terminal; hoy vamos a aprender a vivir y construir directamente en el *prompt*.

---

## 🎯 Objetivos de Aprendizaje
Al finalizar esta guía, serás capaz de:
1.  Instalar y configurar OpenCode con tus modelos de IA preferidos.
2.  Dominar el flujo de trabajo binario: **Plan** vs. **Build**.
3.  Automatizar tareas recurrentes mediante **Skills** y **Agentes Personalizados**.
4.  Gestionar cambios de forma segura con `undo` y control de sesiones.

---

## 🧩 1. El Concepto: El Piloto Autónomo
OpenCode no es un simple autocompletador. Es un **agente**.

### 💡 Analogía: El Arquitecto y el Constructor
Imagina que estás construyendo una casa:
- **Modo Plan (El Arquitecto)**: Dibujas los planos, decides los materiales y discutes la viabilidad sin poner un solo ladrillo.
- **Modo Build (El Constructor)**: Sigues los planos al pie de la letra, cortas madera, pones ladrillos y te aseguras de que todo encaje.
- **OpenCode**: Es la oficina donde ambos se reúnen. Tú eres el dueño del proyecto que supervisa a ambos.

---

## 🛠️ 2. El Ciclo de Vida de un Proyecto en OpenCode
 
### Paso 1: Inicialización (`init`)
Antes de empezar, OpenCode necesita contexto.
- **Comando**: `opencode init`
- **Resultado**: Se crea un archivo `agents.md`. Este es el "manual de instrucciones" donde le explicas a la IA la estructura de tu proyecto y tus preferencias.
- **Nota del video**: Permite inicializar entornos y organizar el trabajo mediante múltiples sesiones (12:17, 14:02).
 
### Paso 2: El Modo Plan (Diseño)
Usa el modo **Plan** para definir *qué* vas a hacer.
- **Acción**: Presiona `Tab` para entrar en Plan.
- **Prompt**: "Quiero añadir un sistema de login con JWT a mi API".
- **Resultado**: La IA te dará una lista de pasos y cambios necesarios sin modificar archivos todavía.
 
### Paso 3: El Modo Build (Ejecución)
Una vez aceptado el plan, presiona `Tab` de nuevo para entrar en **Build**.
- **Acción**: "Ejecuta el plan propuesto".
- **Resultado**: La IA escribirá el código, creará archivos y, si se lo permites, ejecutará tests para validar.
- **Flujo de trabajo**: Desarrolla software paso a paso alternando entre planificación y construcción (20:15).

---

## ⚖️ Guía de Decisión: ¿Qué modelo elegir?

| Modelo | Ideal para... | Coste |
| :--- | :--- | :--- |
| **GitHub Copilot** | Programación diaria, sugerencias rápidas. | Suscripción activa. |
| **Claude 3.5 Sonnet** | Lógica compleja, refactorización profunda. | Tokens / API Key. |
| **Modelos Locales**  | Privacidad total, sin conexión a internet.   | Gratis (Llama 3, etc).|
| **Modelos Gratuitos** | Pruebas rápidas, tareas sencillas.           | Gratis (incluidos). |

> **✨ La ventaja Open Source**: A diferencia de otras herramientas, OpenCode no te ata a una sola empresa. Puedes saltar entre OpenAI, Anthropic o modelos que corren en tu propio hardware en segundos. ([0:09] en el video)

---

---

## ⚠️ 3. Errores Comunes del "Prompt Engineering"

❌ **Error**: Saltar directamente al modo **Build** sin un plan claro.
✅ **Realidad**: La IA puede alucinar o romper dependencias si no tiene una hoja de ruta.
💡 **Por qué importa**: Un buen plan en `agents.md` reduce los errores de construcción en un 80%.

❌ **Error**: Olvidar hacer commit de los cambios sugeridos.
✅ **Realidad**: OpenCode tiene una función de `undo`, pero nada sustituye a un buen historial de Git.

---

## 🚀 4. Técnicas Avanzadas: Skills y Agentes

### Skills (Habilidades)
Son instrucciones reutilizables. Si siempre usas el mismo estilo de testing (ej: Jest + Testing Library), guárdalo como una **Skill**. OpenCode la invocará automáticamente cuando detecte que vas a escribir un test.
También puedes crear skills para diseño de interfaces (UI), optimización SEO o despliegues en la nube, mejorando aspectos específicos de tu proyecto ([51:31] en el video).

### Agentes Personalizados
Puedes crear un agente que solo se encargue de la documentación o uno que sea un experto en seguridad. Esto evita que el agente principal se sobrecargue con demasiadas instrucciones.

### 🌐 Integración con MCP (Model Context Protocol)
Esta es una de las funciones más potentes. MCP permite que OpenCode se conecte con herramientas externas:
- **Navegadores**: Para buscar documentación actualizada.
- **Servicios de Terceros**: Para interactuar con APIs externas directamente desde la terminal.

### 🧪 Testing Automatizado con TestSprite
La IA no solo escribe código; puede probarlo. Integrando herramientas como TestSprite, OpenCode puede analizar tu base de código de forma autónoma, detectar vulnerabilidades y generar reportes de calidad sin intervención humana. ([45:16] en el video)

---

## 🚀 5. Ejercicio Práctico: Tu Primer Script Agente

### Paso 1: El "I Do"
1.  Inicia un proyecto vacío: `mkdir test-opencode && cd test-opencode`.
2.  Ejecuta `opencode init`.
3.  En modo **Plan**, pide: "Crea un script de Node que salude al usuario".

### Paso 2: El "We Do"
1.  Cambiamos a modo **Build**.
2.  Pedimos: "Implementa el script y añade un archivo package.json".
3.  Verificamos que los archivos se hayan creado correctamente.

### Paso 3: El "You Do"
1.  **Tu Desafío**: Pide a OpenCode que añada una **Skill** llamada `standard-logger` que use la librería `winston`.
2.  Luego, pide que refactorice el script de saludo para que use esa nueva Skill.
3.  Si algo sale mal, usa el comando `undo`.

---

## 🧠 Pausa de Reflexión
- ¿En qué se diferencia el modo **Plan** de simplemente chatear con ChatGPT?
- ¿Cómo crees que cambia tu productividad al no tener que salir de la terminal para buscar errores?

---

## 📝 Resumen Ejecutivo
1.  **Planifica antes de construir**: Usa el `Tab` sabiamente.
2.  **Contexto es Rey**: Mantén tu `agents.md` actualizado.
3.  **Usa Skills**: No repitas instrucciones; enséñale a tu agente una vez.
4.  **Aprovecha MCP**: Conecta tu terminal al mundo exterior (navegador, APIs).
5.  **Mantenimiento**: Si notas lentitud, revisa el espacio en disco; las sesiones guardadas pueden ocupar bastante lugar.

> **✨ Pro Tip**: Usa la tecla `Tab` no solo para cambiar de modo, sino como un recordatorio mental: ¿Estoy diseñando (Plan) o estoy fabricando (Build)? Esta disciplina mental te hará un desarrollador 10x.
