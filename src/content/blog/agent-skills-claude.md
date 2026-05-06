---
title: "Agent Skills Claude"
code: "skills-claude"
description: "Guía Completa de Agent Skills en Claude: Capacidades Modulares para IA"
pubDate: "Jul 22 2022"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# Guía Completa de Agent Skills en Claude: Capacidades Modulares para IA

## Introducción: De Agentes Genéricos a Especialistas

Imagina que Claude no solo responde preguntas, sino que se convierte en un experto en PowerPoint, Excel o tu dominio específico. Eso son Agent Skills: módulos que extienden las capacidades de Claude con conocimientos especializados. Inspirado en la documentación de Anthropic, esta guía explora qué son, cómo funcionan y cómo crear tus propios skills para transformar Claude en un asistente personalizado.

En 2026, los skills convierten IA general en especialista, reduciendo repetición y aumentando precisión.

## Analogía Central: Del Herramientas de Caja a Módulos Especializados

**Skills tradicionales** son como herramientas en una caja: útiles, pero debes recordar cómo usar cada una. **Agent Skills** son módulos plug-and-play: Claude los activa automáticamente cuando relevantes, como un mecánico que elige la herramienta perfecta sin pensar.

- **Sin skills**: "Recuérdame siempre cómo crear tablas en Excel."
- **Con skills**: Claude usa automáticamente el skill de Excel para análisis avanzado.

Esta modularidad transforma interacciones reactivas en proactivas.

## ¿Qué son Agent Skills?

Skills son capacidades modulares que empaquetan instrucciones, metadata y recursos opcionales. Claude los usa automáticamente cuando relevantes, convirtiendo agentes genéricos en especialistas.

**Beneficios Clave**:

- **Especializar Claude**: Adaptar para tareas específicas.
- **Reducir repetición**: Crear una vez, usar siempre.
- **Componer capacidades**: Combinar skills para flujos complejos.

**Nota**: No elegible para Zero Data Retention; retención estándar.

## Uso de Skills

### Pre-built vs Custom

- **Pre-built**: De Anthropic (PowerPoint, Excel, Word, PDF). Disponibles en API y claude.ai.
- **Custom**: Tus propios skills. Crea en Claude Code, sube via API o claude.ai.

**Inicio Rápido**:

- Pre-built: Tutorial quickstart para API.
- Custom: Cookbook para crear skills propios.

## Cómo Funcionan los Skills

Skills usan entorno VM con acceso filesystem, permitiendo carga progresiva: metadata siempre, instrucciones al activar, recursos cuando necesario.

### Tres Niveles de Contenido

| Nivel                      | Cuando Carga      | Costo Tokens            | Contenido                      |
| -------------------------- | ----------------- | ----------------------- | ------------------------------ |
| **Nivel 1: Metadata**      | Siempre (startup) | ~100 tokens/skill       | `name` y `description` de YAML |
| **Nivel 2: Instrucciones** | Al activar skill  | <5k tokens              | Cuerpo SKILL.md                |
| **Nivel 3: Recursos**      | Según necesidad   | Ilimitado efectivamente | Archivos empaquetados          |

**Arquitectura**: Claude lee via bash, ejecuta scripts sin cargar código en contexto.

**Ejemplo**: Skill PDF:

1. Startup: Metadata cargada.
2. Request: "Extrae texto de PDF".
3. Claude lee SKILL.md via bash.
4. Ejecuta según instrucciones.

## Estructura de un Skill

Cada skill requiere SKILL.md con frontmatter YAML:

````yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---

# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
````

For advanced form filling, see [FORMS.md](FORMS.md).

```

**Campos Requeridos**: `name` (64 chars, lowercase/hyphens), `description` (1024 chars).

**Mejores Prácticas**: Describe qué hace y cuándo usar.

## Dónde Funcionan los Skills

### Claude API

Requiere headers beta. Especifica `skill_id` en `container`. Pre-built usan IDs como `pptx`.

### Claude Code

Solo custom skills, filesystem-based.

### Claude.ai

Pre-built automáticos; custom via upload zip.

## Seguridad y Consideraciones

**Advertencia**: Usa solo de fuentes confiables. Skills maliciosos pueden invocar tools o ejecutar código harmful.

**Riesgos**:
- Data exfiltration.
- Acceso no autorizado.
- Tool misuse.

**Recomendaciones**:
- Audita thoroughly.
- Evita fuentes externas.
- Trata como instalar software.

## Skills Disponibles

### Pre-built
- **PowerPoint (pptx)**: Crear presentaciones, editar slides.
- **Excel (xlsx)**: Spreadsheets, análisis de datos.
- **Word (docx)**: Documentos, formato.
- **PDF (pdf)**: Generar PDFs formateados.

### Open-source
- **Claude API**: Referencia API, SDK docs para 8 lenguajes.

### Custom
Ejemplos en cookbook.

## Limitaciones

- **Cross-surface**: No sync entre API, claude.ai, Code.
- **Sharing**: claude.ai individual; API workspace-wide; Code personal/proyecto.
- **Runtime**: Restricciones de network/packages según superficie.

## Errores Comunes

❌ **Error común**: Skills grandes consumen tokens innecesarios.
✅ **Realidad**: Usa carga progresiva; limita a lo esencial.
💡 **Por qué importa**: Contexto limitado se llena rápido.

❌ **Otro error**: Skills sin descripción clara.
✅ **Solución**: Incluye triggers específicos (ej. "cuando menciones PDFs").
💡 **Impacto**: Claude no activa el skill.

## Checklist de Creación

Antes de desplegar:

- [ ] Frontmatter válido (name, description).
- [ ] Instrucciones claras y step-by-step.
- [ ] Recursos empaquetados eficientemente.
- [ ] Auditado por seguridad.
- [ ] Probado en superficie objetivo.
- [ ] Documentación de límites.

## Conclusión: Skills para un Claude Especialista

Agent Skills convierten Claude de asistente general en experto personalizado. Comienza con pre-built, crea custom para tu dominio y escala capacidades. En 2026, skills son clave para IA productiva.

Recuerda: Skills no son prompts; son expertise empaquetada, activada automáticamente.

*Guía basada en documentación de Anthropic sobre Agent Skills.*
```
