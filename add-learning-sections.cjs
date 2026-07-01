const fs = require('fs');
const path = require('path');

const blogDir = 'C:\\Users\\jeron\\Desktop\\blog-jero\\src\\content\\blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md')).sort();

function getLearningSection(title, desc) {
  const combined = (title + ' ' + desc).toLowerCase();
  
  if (combined.match(/\bapi\b|\brest\b|\bgraphql\b|\bgrpc\b|\bhttp\b|\bendpoint\b/)) {
    return `## ¿Qué vas a aprender

En esta masterclass profundizarás en el diseño, construcción y evolución de APIs profesionales:

- Los estilos arquitectónicos y cuándo elegir cada uno según el problema
- Protocolos de red y cómo impactan en el rendimiento de tus servicios
- Modelado de recursos, versionado y contratos que sobreviven al tiempo
- Autenticación, autorización y protección contra vulnerabilidades comunes
- Criterios para diseñar APIs mantenibles, escalables y seguras

Al finalizar podrás diseñar APIs con criterio arquitectónico sólido, no solo escribir endpoints.
`;
  }
  else if (combined.match(/\banálisis\s+técnico\b|\bindicador\b|\bsma\b|\bema\b|\bmedias?\s+móvil\b|\btrading\s+técnico\b|\bpatrón\b/)) {
    return `## ¿Qué vas a aprender

En esta guía recorrerás los conceptos del análisis técnico aplicado a los mercados financieros:

- Cómo interpretar gráficos de precio y volumen para tomar decisiones informadas
- Las principales figuras y patrones de reversal y continuación
- Indicadores técnicos clave y cómo combinarlos para filtrar señales
- Cómo construir y validar una estrategia de trading con datos históricos
- Psicología del trading: gestión del riesgo y disciplina operativa
`;
  }
  else if (combined.match(/\blaravel\b|\belocuent\b|\bmigration\b|\bblade\b|\bartisan\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás los conceptos y herramientas esenciales del ecosistema Laravel:

- El ciclo de vida de una petición HTTP en Laravel y cómo funciona el framework internamente
- Eloquent ORM: consultas, relaciones, scopes y patrones avanzados
- Validaciones, Form Requests y flujos de datos seguros
- Migraciones, seeders, factories y manejo de base de datos
- Arquitectura de servicios, repositorios y pruebas automatizadas
`;
  }
  else if (combined.match(/\bia\s+generativa\b|\bgenerativa\b|\b\bia\b|\binteligencia\s+artificial\b|\bmachine\s+learning\b|\bdeep\s+learning\b|\bllm\b|\bgpt\b|\bclaude\b|\bopenai\b|\blangchain\b|\brag\b|\bagente\b/)) {
    return `## ¿Qué vas a aprender

En este contenido explorarás los pilares y aplicaciones de la inteligencia artificial moderna:

- Los fundamentos conceptuales que diferencian a cada enfoque de IA
- Cómo funcionan los modelos de lenguaje y cómo interactuar con ellos
- Técnicas de prompting y frameworks de agentes autónomos
- RAG, herramientas MCP y cómo conectar la IA con datos reales
- Aplicaciones prácticas para desarrollo, negocios y productividad
`;
  }
  else if (combined.match(/\bjavascript\b|\breact\b|\bvue\b|\bangular\b|\bnode\b|\btypescript\b|\bfrontend\b|\bnext\b|\bvite\b|\bwebpack\b|\bsvelte\b|\bremix\b|\bexpo\b|\bastro\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás los conceptos y herramientas del desarrollo frontend moderno:

- El funcionamiento del runtime JavaScript y el ecosistema de paquetes
- Patrones de componentes, estado y renderizado en tu framework de elección
- Optimización de rendimiento, carga y experiencia de usuario
- Pruebas, tipado, arquitectura y escalabilidad de proyectos frontend
- Integración con backends, APIs y despliegue en producción
`;
  }
  else if (combined.match(/\bbackend\b|\bapi\b|\bpython\b|\bgo\b|\bjava\b|\bmicroservicio\b|\brest\b|\bgrpc\b|\bserver\b|\bphp\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás la arquitectura y las prácticas del desarrollo backend moderno:

- Diseño de APIs RESTful y protocolos de comunicación
- Modelado de datos, bases de datos relacionales y NoSQL
- Arquitectura de aplicaciones, patrones y separación de responsabilidades
- Seguridad, autenticación, autorización y protección de servicios
- Escalabilidad, caching, colas y despliegue en producción
`;
  }
  else if (combined.match(/\bdocker\b|\bkubernetes\b|\bk8s\b|\bcicd\b|\bdevops\b|\bterraform\b|\bobservabilidad\b|\bsre\b|\bhelm\b|\bnginx\b|\baws\b|\bcloud\b|\bazure\b|\bgcp\b|\bgithub\b|\bpipeline\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás las prácticas y herramientas de DevOps y operaciones modernas:

- Contenerización con Docker y orquestación con Kubernetes
- Pipelines de CI/CD, despliegues automatizados y rollbacks seguros
- Infraestructura como código: Terraform, provisionamiento y configuración
- Observabilidad: métricas, logs, trazas y alertas
- Escalabilidad, seguridad en producción y cultura DevOps aplicada
`;
  }
  else if (combined.match(/\bbase\s+de\s+datos\b|\bsql\b|\bpostgres\b|\bmysql\b|\bmongodb\b|\bredis\b|\bprisma\b|\beloquent\b|\bbases?\s+de\s+dato\b|\bmodelado\s+de\s+datos\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás el modelado, diseño y gestión de bases de datos:

- Tipos de bases de datos y cuándo usar cada una según el problema
- Modelado relacional: entidades, relaciones, normalización y claves
- Consultas SQL avanzadas, índices y optimización de rendimiento
- Transacciones, ACID, aislamiento y consistencia en sistemas distribuidos
- ORMs, migraciones y mejores prácticas en producción
`;
  }
  else if (combined.match(/\bsystem\s+design\b|\bdiseño\s+de\s+sistema\b|\barquitectura\s+de\s+software\b|\bdistribuido\b|\bescalab\b|\balta\s+disponibilidad\b|\barquitecto\b/)) {
    return `## ¿Qué vas a aprender

En este contenido desarrollarás la visión arquitectónica necesaria para construir sistemas escalables:

- Patrones arquitectónicos y cómo elegir el adecuado para cada contexto
- Balanceo de carga, caching, colas y bases de datos distribuidas
- Consistencia, particionamiento y tolerancia a fallos
- Diseño de APIs, contratos y comunicación entre servicios
- Trade-offs, medición de rendimiento y toma de decisiones técnicas
`;
  }
  else if (combined.match(/\btesting\b|\bprueba\b|\bunitario\b|\be2e\b|\bjest\b|\bcypress\b|\bplaywright\b|\bpytest\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás las estrategias y herramientas de pruebas de software:

- Principios de testing: piramidal, cobertura y tipos de pruebas
- Pruebas unitarias, integración y end-to-end con herramientas modernas
- Mocking, spies y simulación de dependencias externas
- TDD: flujo de trabajo y pruebas en productos reales
- Integración en pipelines y calidad continua
`;
  }
  else if (combined.match(/\bgit\b|\bgithub\b|\bgitlab\b|\bcontrol\s+de\s+versiones\b|\bpull\s+request\b|\bbranch\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás el flujo de trabajo y las prácticas de control de versiones:

- Modelos de branching, estrategias de ramificación y flujos de trabajo colaborativos
- Resolución de conflictos, merges y operaciones avanzadas con Git
- Pull requests, code reviews y automatización con GitHub Actions
- Versionado semántico, releases y gestión de proyectos
- Buenas prácticas para equipos de cualquier tamaño
`;
  }
  else if (combined.match(/\bseguridad\b|\bowasp\b|\bvulnerabilidad\b|\bauth\b|\bjwt\b|\boauth\b|\bpentest\b|\bhack\b/)) {
    return `## ¿Qué vas a aprender

En este contenido desarrollarás una visión integral de la seguridad informática:

- Los vectores de ataque más comunes y cómo prevenirlos
- Autenticación, autorización y gestión de sesiones seguras
- Seguridad en APIs, validación de entradas y protección contra inyecciones
- Cifrado, gestión de secretos y cumplimiento normativo
- Monitorización, respuesta a incidentes y cultura de seguridad
`;
  }
  else if (combined.match(/\bdiseño\b|\bfigma\b|\binterfaz\b|\busuario\b|\bexperiencia\b|\bvisual\b|\bprototipo\b|\bui\b|\bux\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás los principios y herramientas del diseño digital:

- Fundamentos de UI/UX y jerarquía visual aplicada a interfaces reales
- Diseño de sistemas, componentes reutilizables y patrones de interacción
- Accesibilidad, responsive y experiencia multi-dispositivo
- Flujos de trabajo colaborativos entre diseño y desarrollo
- Prácticas de prototipado, testing con usuarios y entrega a producción
`;
  }
  else if (combined.match(/\bingl[ees]\b|\bidioma\b|\benglish\b|\bgramática\b|\bverb\b|\bspeaking\b|\bconversa\b|\bfluidez\b|\bvocabulario\b|\bpronunci\b/)) {
    return `## ¿Qué vas a aprender

En este contenido desarrollarás tus habilidades en inglés de manera práctica y progresiva:

- Comprensión oral y lectura contextual con estrategias efectivas
- Expresión oral, fluidez y construcción de frases naturales
- Gramática aplicada sin memorización mecánica
- Vocabulario situacional: laboral, tecnológico y cotidiano
- Consejos de listening, pronunciación y coaching de exposición
`;
  }
  else if (combined.match(/\btrading\b|\bbolsa\b|\bforex\b|\bacción\b|\binversión\b|\bfinanzas\b|\bopción\b|\bfuturo\b|\bactivo\b|\bbroker\b|\brentabilidad\b|\bdivisa\b|\bcambio\b|\bblue\b|\bmep\b/)) {
    return `## ¿Qué vas a aprender

En este contenido desarrollarás los conocimientos para operar en mercados financieros con criterio:

- Tipos de activos, mercados y participantes del ecosistema financiero
- Análisis fundamental y técnico aplicado a la toma de decisiones
- Gestión de riesgo, posicionamiento y psicología del trader
- Estrategias probadas para diferentes perfiles y horizontes temporales
- Herramientas, plataformas y framework para operar de forma consistente
`;
  }
  else if (combined.match(/\bseducción\b|\batracción\b|\bcita\b|\brelación\b|\bcarisma\b|\blenguaje\s+corporal\b|\bconversación\b|\bhabilidades\s+sociales\b|\bconexión\s+interpersonal\b|\befecto\s+halo\b/)) {
    return `## ¿Qué vas a aprender

En este contenido desarrollarás tus habilidades sociales y de conexión interpersonal:

- Psicología de la atracción y principios de influencia aplicados éticamente
- Comunicación no verbal, lectura de señales y presencia magnética
- Habilidades conversacionales: iniciación, profundidad y cierre
- Construcción de confianza auténtica y vulnerabilidad como herramienta
- Errores comunes, anti-patrones y cómo corregirlos en la práctica
`;
  }
  else if (combined.match(/\bemprend\b|\bnegocio\b|\bempres\b|\bstartup\b|\bfreelance\b|\bventas\b|\bmarketing\b|\bmonetiz\b|\bproducto\b|\bsaas\b|\bescalar\b|\bliderazgo\b/)) {
    return `## ¿Qué vas a aprender

En este contenido desarrollarás la visión estratégica para construir y escalar negocios:

- Validación de ideas, modelo de negocio y propuesta de valor
- Estrategias de crecimiento, monetización y retención de clientes
- Gestión financiera, pricing y optimización de recursos
- Liderazgo, cultura organizacional y toma de decisiones bajo incertidumbre
- Casos reales, errores comunes y lecciones aplicables
`;
  }
  else if (combined.match(/\bdiscipline\b|\bhábito\b|\bproductividad\b|\bfoco\b|\bmentalidad\b|\bobjetivo\b|\bcrecimiento\b|\bconstancia\b|\bsistema\b/)) {
    return `## ¿Qué vas a aprender

En este contenido construirás el sistema operativo personal para lograr resultados sostenibles:

- La psicología detrás de los hábitos y cómo rediseñar tu comportamiento
- Sistemas de disciplina que no dependen de la motivación
- Gestión del tiempo, foco profundo y eliminación de distracciones
- Mentalidad de crecimiento y reestructuración de creencias limitantes
- Prácticas concretas, rutinas y métricas de progreso
`;
  }
  else if (combined.match(/\bfitness\b|\bgim\b|\bejercicio\b|\bmúsc\b|\bentrena\b|\bnutrici\b|\bsalud\b|\bdieta\b|\bcuerpo\b|\bbienestar\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás los fundamentos y las estrategias para alcanzar tu mejor versión física:

- Bases de fisiología del ejercicio y principios del entrenamiento
- Rutinas estructuradas según tu objetivo y nivel
- Nutrición aplicada: macronutrientes, déficit/superávit y suplementación
- Descanso, recuperación y consistencia como pilares del progreso
- Errores comunes, mitos y cómo optimizar tus resultados a largo plazo
`;
  }
  else if (combined.match(/\bangular\b|\breact\b|\bvue\b|\bsvelte\b|\bnext\b|\bexpo\b|\breact\s+native\b|\bfrontend\b|\bcomponente\b|\bhook\b|\brouter\b|\bredux\b|\bcontext\b|\bstate\b|\bcss\b|\btailwind\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás los conceptos y herramientas del desarrollo frontend moderno:

- El ciclo de vida, renderizado y actualizaciones en tu framework de elección
- Patrones de componentes, estado, routing y comunicación entre vistas
- Optimización de rendimiento, carga y experiencia de usuario
- Testing, tipado y arquitectura de proyectos escalables
- Integración con backends, APIs y despliegue en producción
`;
  }
  else if (combined.match(/\bblockchain\b|\bcripto\b|\bbitcoin\b|\bweb3\b|\bdefi\b|\bsmart\s+contract\b|\bnft\b|\btoken\b/)) {
    return `## ¿Qué vas a aprender

En este contenido entenderás el ecosistema blockchain y las tecnologías descentralizadas:

- Fundamentos de blockchain, criptografía y consenso distribuido
- Cómo funcionan las criptomonedas, tokens y smart contracts
- Arquitectura de dApps, wallets y protocolos DeFi
- Seguridad, privacidad y riesgos del ecosistema
- Casos de uso reales y el futuro de la web descentralizada
`;
  }
  else if (combined.match(/\bn8n\b|\bautomatización\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás las herramientas y flujos de automatización:

- Arquitectura de workflows, nodos y conexiones
- Integración con APIs, bases de datos y servicios en la nube
- Manejo de errores, reintentos y despliegues en producción
- Patrones avanzados: bifurcaciones, bucles y condicionales
- Casos de uso reales para equipos y negocios
`;
  }
  else if (combined.match(/\bnestjs\b|\bnest\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás el framework NestJS y sus patrones arquitectónicos:

- Módulos, controladores, servicios y providers
- Inyección de dependencias, decoradores y ciclo de vida
- Pruebas unitarias, e2e y arquitectura escalable
- Integración con bases de datos, colas y microservicios
- Despliegue en producción y monitoreo
`;
  }
  else if (combined.match(/\bgit\b|\bgithub\b/)) {
    return `## ¿Qué vas a aprender

En este contenido dominarás el flujo de trabajo y las prácticas de control de versiones:

- Modelos de branching, estrategias de ramificación y flujos de trabajo colaborativos
- Resolución de conflictos, merges y operaciones avanzadas con Git
- Pull requests, code reviews y automatización con GitHub Actions
- Versionado semántico, releases y gestión de proyectos
- Buenas prácticas para equipos de cualquier tamaño
`;
  }
  else {
    return `## ¿Qué vas a aprender

En este contenido explorarás los conceptos clave y su aplicación práctica:

- Fundamentos teóricos y contexto necesario para entender el tema
- Aplicaciones prácticas y casos de uso reales
- Herramientas, técnicas y mejores prácticas recomendadas
- Ejemplos guiados paso a paso
- Errores comunes, anti-patrones y cómo evitarlos
`;
  }
}

function processFile(fileName) {
  const filePath = path.join(blogDir, fileName);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already has the EXACT section (use regex to be precise)
  if (/^## ¿Qué vas a aprender\s*\r?\n/m.test(content)) {
    return false;
  }
  
  // Extract title from frontmatter
  const titleMatch = content.match(/^title:\s*['"]?(.*?)['"]?\s*$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const descMatch = content.match(/^description:\s*['"]?(.*?)['"]?\s*$/m);
  const desc = descMatch ? descMatch[1].trim() : '';
  
  const section = getLearningSection(title, desc);
  
  // Find the closing `---` of frontmatter
  const frontmatterEndMatch = content.match(/^---\s*\n([\s\S]*?)^---\s*\n/m);
  
  if (!frontmatterEndMatch) {
    content = section + '\n\n' + content;
  } else {
    const idx = frontmatterEndMatch.index + frontmatterEndMatch[0].length;
    content = content.slice(0, idx) + '\n' + section + '\n\n' + content.slice(idx);
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

let updated = 0;
let skipped = 0;
for (const file of files) {
  if (processFile(file)) {
    updated++;
    console.log('UPDATED: ' + file);
  } else {
    skipped++;
  }
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
