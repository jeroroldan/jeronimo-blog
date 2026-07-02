# Plan: Master Class - Estratega de Eficiencia Operativa con IA

## Estado actual
- Proyecto: Astro Blog (`blog-jero`) con colección de skills educativos en `src/skills/`.
- Existente: `src/skills/skill.md` (Alpha Quant Research Workflow) define el formato de skill educativo.
- Objetivo: Crear una master class premium sobre IA para escalar empresas, siguiendo el mismo formato.

## Brechas / Necesidad
El usuario quiere una guía extremadamente completa (mínimo 25.000 palabras) sobre cómo utilizar IA para escalar empresas sin aumentar costos fijos, orientada a CEOs, directores, gerentes y pymes en crecimiento.

## Formato objetivo
- Múltiples archivos `src/skills/*.md` siguiendo el frontmatter de `skill.md`.
- Cada archivo es una guía/curso independiente pero integrada en la master class.
- Agrupación lógica por módulos pedagógicos.

## Acción propuesta

### Archivos a crear

1. **`src/skills/ia-mentalidad-estratega.md`**
   - Contenido: Introducción + Módulo 1
   - Temas:
     - Qué está cambiando con la IA, ventaja competitiva, empresas operadas por IA
     - Mentalidad del Estratega de IA: qué hace, diferencias entre automatizar/transformar
     - Errores comunes, caso práctico, ejercicios
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Mentalidad y Estrategia"
     - category: "ia-empresarial"
     - tags: ["ia", "estrategia-empresarial", "automatizacion", "agentes-ia", "directores"]
     - difficulty: "intermedio"
     - readingTime: 60
   - Proporción objetivo: ~4.500 palabras

2. **`src/skills/ia-mapeo-arquitectura-procesos.md`**
   - Contenido: Módulos 2 y 3
   - Temas:
     - Mapeo de Procesos Empresariales (SIPOC, VSM, BPM, cuellos de botella)
     - Arquitectura de Automatización Empresarial (RPA, LLMs, APIs, integraciones CRM/ERP/WhatsApp/Google Workspace/M365)
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Mapeo y Arquitectura de Procesos"
     - category: "ia-empresarial"
     - tags: ["ia", "mapeo-procesos", "bpm", "automatizacion", "arquitectura-ia"]
     - difficulty: "intermedio-avanzado"
     - readingTime: 75
   - Proporción objetivo: ~6.000 palabras

3. **`src/skills/ia-agentes-autonomos.md`**
   - Contenido: Módulos 4 y 5
   - Temas:
     - Arquitectura de Agentes Autónomos (qué es, tipos, memoria, contexto, razonamiento, patrones)
     - Agentes para Empresas (ventas, marketing, SEO, finanzas, operaciones, RRHH, atención al cliente, compliance)
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Arquitectura y Agentes Autónomos"
     - category: "ia-empresarial"
     - tags: ["ia", "agentes-ia", "automatizacion-inteligente", "multiagentes"]
     - difficulty: "avanzado"
     - readingTime: 90
   - Proporción objetivo: ~7.500 palabras

4. **`src/skills/ia-marketing-seo-automatizacion.md`**
   - Contenido: Módulos 6 y 7
   - Temas:
     - IA para Marketing y SEO (keywords, clusters, contenido, embudos, email, LinkedIn, Google, YouTube, TikTok, lead scoring, agentes de contenido)
     - Automatización Core del Negocio (back office, front office, facturación, cobranza, KPIs, SLA, bots)
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Marketing, SEO y Automatización Core"
     - category: "ia-empresarial"
     - tags: ["ia", "marketing", "seo", "automatizacion", "lead-scoring"]
     - difficulty: "intermedio"
     - readingTime: 85
   - Proporción objetivo: ~6.500 palabras

5. **`src/skills/ia-reduccion-costos-escalabilidad.md`**
   - Contenido: Módulos 8 y 9
   - Temas:
     - Reducción de Costos (detección de desperdicios, framework de ahorro, ROI, TCO, payback)
     - Cómo Escalar sin Aumentar Costos Fijos (capacidad instalada, delegación, indicadores, roadmap)
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Reducción de Costos y Escalabilidad"
     - category: "ia-empresarial"
     - tags: ["ia", "reduccion-costos", "escalabilidad", "roi", "productividad"]
     - difficulty: "intermedio"
     - readingTime: 70
   - Proporción objetivo: ~5.500 palabras

6. **`src/skills/ia-sistema-operativo-implementacion.md`**
   - Contenido: Módulos 10 y 11
   - Temas:
     - Diseño de un Sistema Operativo Empresarial con IA (framework, capas, gobernanza, seguridad)
     - Implementación Paso a Paso (diagnóstico, quick wins, roadmap 90/180/12 meses, gestión del cambio)
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Sistema Operativo e Implementación"
     - category: "ia-empresarial"
     - tags: ["ia", "transformacion-digital", "implementacion", "gestion-cambio", "sistema-operativo"]
     - difficulty: "intermedio"
     - readingTime: 80
   - Proporción objetivo: ~6.000 palabras

7. **`src/skills/ia-casos-estudio-herramientas.md`**
   - Contenido: Módulos 12, 13 y 14
   - Temas:
     - Casos de Estudio (servicios, constructora, despacho jurídico, consultora, agencia, industrial, retail, eCommerce)
     - Herramientas Recomendadas (comparativa OpenAI, Claude, Gemini, n8n, Make, CrewAI, HubSpot, Odoo, etc.)
     - Framework Personal de Consultoría (cómo vender proyectos, discovery, workshop, implementación)
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Casos de Estudio, Herramientas y Consultoría"
     - category: "ia-empresarial"
     - tags: ["ia", "casos-estudio", "herramientas", "consultoria", "roi"]
     - difficulty: "todos"
     - readingTime: 95
   - Proporción objetivo: ~8.000 palabras

8. **`src/skills/ia-futuro-playbook.md`**
   - Contenido: Módulo 15 + Appendix/Playbooks
   - Temas:
     - Futuro de las Empresas con IA (agentes autónomos, organizaciones híbridas, predicciones 5 y 10 años)
     - Playbooks rápidos, checklists, prompts profesionales, FAQ, errores frecuentes
   - Frontmatter sugerido:
     - title: "MASTERCLASS: Estratega de Eficiencia Operativa con IA — Futuro y Playbooks Finales"
     - category: "ia-empresarial"
     - tags: ["ia", "futuro", "playbooks", "agentes-autonomos", "estrategia-ia"]
     - difficulty: "todos"
     - readingTime: 90
   - Proporción objetivo: ~7.500 palabras

### Requisitos cuantitativos a cumplir por archivo
| Recurso | Mínimo global |
|---------|---------------|
| Palabras totales | 25.000+ |
| Ejemplos reales | 100+ |
| Casos empresariales | 50+ |
| Diagramas Mermaid | 80+ |
| Tablas | 100+ |
| Checklists | 100+ |
| Prompts profesionales | 100+ |
| Matrices (RACI, Eisenhower, SWOT, etc.) | 20+ |

### Estructura obligatoria por capítulo dentro de cada archivo
- Resumen ejecutivo
- Checklist
- Ejercicio
- Caso práctico
- Prompt listo para usar
- Errores comunes
- Recomendaciones
- Tabla de contenidos enlada global

## Pregunta aclaratoria
> ¿Prefieres que la master class se divida en **7 archivos separados** como propongo (uno por grupo de módulos), o prefieres un **único archivo masivo** `src/skills/estratega-eficiencia-operativa-ia.md` con toda la guía?

## Criterios de éxito
- 7 archivos nuevos creados en `src/skills/`
- Cada archivo tiene frontmatter compatible con `skill.md`
- Contenido total supera 25.000 palabras
- Cada capítulo incluye diagramas Mermaid, tablas, checklists y ejercicios
- Lenguaje ejecutivo, nivel MBA, sin contenido superficial
