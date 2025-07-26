---
title: 'Prompt Engineering para Desarrolladores'
description: 'Guía Maestra: Prompt Engineering para Desarrolladores'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Maestra: Prompt Engineering para Desarrolladores

## El Arte de Comunicarse con IA - De Novato a Maestro

---

## 🎯 Introducción: El Código de la Comunicación

Imagina que la IA es como un **developer senior extremadamente talentoso** pero que sufre de **amnesia temporal** - cada conversación es como si fuera la primera vez que se conocen. Tu trabajo como prompt engineer es ser el **product manager perfecto** que sabe exactamente cómo comunicar lo que necesita.

**Analogía Central**: Hacer prompts es como **escribir tickets de Jira para un genio**: si eres vago en los requerimientos, obtienes código que "funciona" pero no es lo que necesitabas. Si eres específico y claro, obtienes exactamente lo que querías.

---

## 📋 Tabla de Contenidos

1. [Fundamentos: El Lenguaje de la Precisión](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#fundamentos)
2. [Anatomía del Prompt Perfecto](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#anatomia-prompt)
3. [Técnicas Avanzadas de Comunicación](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#tecnicas-avanzadas)
4. [Debugging y Troubleshooting](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#debugging-troubleshooting)
5. [Casos de Uso por Especialidad](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#casos-especialidad)
6. [Prompts para Diferentes Contextos](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#prompts-contextos)
7. [Patrones y Templates Reutilizables](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#patrones-templates)
8. [Errores Comunes y Cómo Evitarlos](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#errores-comunes)
9. [Estrategias de Iteración](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#estrategias-iteracion)
10. [Reflexión Final: El Maestro del Prompt](https://claude.ai/chat/38335f73-2407-449f-8696-17546082ee36#reflexion-final)

---

## 🎪 Fundamentos: El Lenguaje de la Precisión {#fundamentos}

### 🎭 Los 5 Pilares del Prompt Engineering

**Analogía**: Estos pilares son como los **5 sentidos del desarrollador** - todos necesarios para percibir completamente el problema.

#### 1. **CONTEXTO** 🌍 (Los Anteojos de la IA)

```
❌ MALO: "Ayúdame con este error"
✅ BUENO: "Soy desarrollador React Native con Expo, tengo 2 años de experiencia. Mi app de e-commerce está crasheando al hacer login con Google OAuth en dispositivos Android específicamente."
```

#### 2. **OBJETIVO** 🎯 (El GPS del Resultado)

```
❌ MALO: "Haz que funcione"
✅ BUENO: "Necesito que el login con Google funcione en Android sin crashes, manteniendo la sesión persistente y redirigiendo al usuario a la pantalla Home después del login exitoso."
```

#### 3. **ESPECIFICIDAD** 🔬 (El Microscopio del Detalle)

```
❌ MALO: "Mi código no funciona"
✅ BUENO: "En el archivo LoginScreen.js, línea 47, la función handleGoogleLogin() lanza un TypeError: 'Cannot read property 'user' of undefined' cuando GoogleSignIn.signIn() retorna una respuesta exitosa pero el objeto user está vacío."
```

#### 4. **FORMATO** 📋 (El Molde del Output)

```
❌ MALO: "Dame la solución"
✅ BUENO: "Proporciona: 1) El código corregido con comentarios, 2) Explicación del problema en 2-3 líneas, 3) Pasos para implementar, 4) Cómo testear que funciona."
```

#### 5. **LIMITACIONES** ⚠️ (Las Reglas del Juego)

```
❌ MALO: [Sin mencionar restricciones]
✅ BUENO: "Restricciones: No puedo usar librerías externas nuevas, debe funcionar en React Native 0.72, el backend ya está configurado y no se puede modificar, debe ser compatible con iOS y Android."
```

### 🧠 Modelo Mental: El Prompt como Conversation Starter

**Analogía**: Imagina que estás en **Speed Dating con un Senior Developer**. Tienes 30 segundos para explicar tu problema de manera que:

1. Entienda el contexto inmediatamente
2. Se emocione por ayudarte
3. Sepa exactamente qué hacer
4. Tenga toda la información necesaria

```typescript
// ❌ Speed Dating Fallido
"Hola, tengo un problema con mi app"

// ✅ Speed Dating Exitoso  
"Hola! Soy dev React Native, mi app de delivery tiene un bug crítico: los pedidos se duplican cuando el usuario hace tap doble en el botón 'Ordenar'. Stack: RN 0.72 + Redux Toolkit + Firebase. ¿Puedes ayudarme a implementar debouncing sin afectar la UX?"
```

---

## 🔬 Anatomía del Prompt Perfecto {#anatomia-prompt}

### 🏗️ Estructura STAR-C (Situation, Task, Action, Result, Constraints)

**Analogía**: Es como escribir un **case study de consultoría** - cada sección tiene un propósito específico.

```markdown
## Template del Prompt Perfecto

### 🎭 SITUACIÓN (Quién eres y dónde estás)
"Soy [tu rol] trabajando en [tipo de proyecto] usando [tecnologías]. 
Tengo [nivel de experiencia] y estoy en [etapa del proyecto]."

### 🎯 TAREA (Qué necesitas lograr)
"Necesito [objetivo específico] para [propósito business/técnico] 
que debe [criterios de éxito medibles]."

### ⚡ ACCIÓN (Qué has intentado)
"Ya intenté [métodos/soluciones anteriores] pero obtuve [resultados específicos].
El código actual es: [código relevante]"

### 🏆 RESULTADO (Qué esperas obtener)
"Espero recibir [formato específico de respuesta] que incluya [elementos necesarios]
y me permita [próximos pasos]."

### ⚠️ RESTRICCIONES (Las reglas del juego)
"Limitaciones: [tecnológicas/tiempo/recursos/compatibilidad]"
```

### 🎯 Ejemplo Aplicado: Bug de Performance

```markdown
### 🎭 SITUACIÓN
Soy desarrollador full-stack Jr con 1 año de experiencia en React/Node.js. 
Trabajo en una startup de fintech, nuestra app web tiene 10K usuarios activos.

### 🎯 TAREA  
Necesito optimizar la carga de la dashboard principal que actualmente tarda 8-12 segundos 
en renderizar 500 transacciones, afectando la retención de usuarios (métricas muestran 40% de bounce rate).

### ⚡ ACCIÓN
Intenté implementar React.memo y useMemo en los componentes TransactionRow, 
pero solo redujo el tiempo a 7 segundos. También probé pagination básica pero el PM quiere mantener scroll infinito.

Código actual:
```javascript
const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  
  useEffect(() => {
    fetch('/api/transactions?limit=500')
      .then(res => res.json())
      .then(setTransactions)
  }, [])
  
  return transactions.map(t => <TransactionRow key={t.id} transaction={t} />)
}
```

### 🏆 RESULTADO

Necesito:

1. Código optimizado que cargue en <3 segundos
2. Explicación de técnicas aplicadas
3. Checklist de performance para casos similares
4. Métricas para medir la mejora

### ⚠️ RESTRICCIONES

* No puedo cambiar el backend API
* Debe mantener scroll infinito
* Compatible con React 18
* No puedo usar librerías pesadas (bundle ya está en 2MB)

```

---

## 🚀 Técnicas Avanzadas de Comunicación {#tecnicas-avanzadas}

### 🎯 Técnica 1: Chain of Thought Prompting

**Analogía**: Es como pedirle a un mentor que **"piense en voz alta"** mientras resuelve el problema contigo.

```markdown
## ❌ Prompt Directo
"¿Cómo optimizo esta query SQL?"

## ✅ Chain of Thought
"Ayúdame a optimizar esta query SQL paso a paso:

1. PRIMERO, analiza qué está haciendo la query actualmente
2. LUEGO, identifica los bottlenecks potenciales  
3. DESPUÉS, sugiere optimizaciones específicas
4. FINALMENTE, explica el impacto esperado de cada cambio

Query actual:
```sql
SELECT u.name, COUNT(o.id) as order_count, SUM(oi.price * oi.quantity) as total_spent
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id  
WHERE o.created_at >= '2023-01-01'
GROUP BY u.id, u.name
ORDER BY total_spent DESC;
```

Contexto: Base de datos PostgreSQL, 100K usuarios, 500K órdenes, query tarda 15 segundos."

```

### 🎯 Técnica 2: Role Playing

**Analogía**: Es como **contratar un consultor especializado** para cada tipo de problema.

```markdown
## Prompt con Role Playing

"Actúa como un Senior DevOps Engineer con 10 años de experiencia en AWS y Kubernetes.

Necesito tu ayuda para diagnosticar por qué mi aplicación Node.js en EKS tiene memory leaks que causan restart cada 2 horas.

Síntomas observados:
- Memory usage crece de 200MB a 2GB en 2 horas
- No hay picos de tráfico correlacionados
- Logs no muestran errores obvios
- Sucede solo en producción, no en staging

Como un DevOps senior, ¿cuál sería tu metodología sistemática para diagnosticar y resolver este problema?"
```

### 🎯 Técnica 3: Few-Shot Learning

**Analogía**: Es como **mostrar ejemplos** de lo que consideras una buena respuesta antes de hacer tu pregunta.

```markdown
## Few-Shot Prompting

"Te voy a mostrar ejemplos de cómo me gusta recibir ayuda con bugs, luego te haré una pregunta similar:

EJEMPLO 1:
Problema: "Mi API Express devuelve 500 en producción"
Tu respuesta ideal:
```

🔍 DIAGNÓSTICO: Error 500 sugiere excepción no manejada en el servidor

🛠️ PASOS DE DEBUG:

1. Revisar logs del servidor: `pm2 logs` o `docker logs`
2. Verificar variables de entorno en producción
3. Testear endpoint localmente con datos de prod

🔧 CÓDIGO PARA INVESTIGAR: [middleware de error handling específico]

📊 MÉTRICAS A MONITOREAR:

* Response time, error rate, memory usage

```

EJEMPLO 2:
Problema: "React component no re-renderiza"  
Tu respuesta ideal:
[Similar estructura...]

Ahora mi problema actual:
"Mi app React Native se cuelga cuando navego de pantalla A a pantalla B, pero solo en dispositivos iOS con iOS 16+. ¿Puedes ayudarme con el mismo formato de respuesta?"
```

### 🎯 Técnica 4: Constraint-Based Prompting

**Analogía**: Es como **ponerle reglas a un videojuego** - las limitaciones fuerzan creatividad.

```markdown
## Constraint-Based Prompting

"Necesito resolver un problema de autenticación en mi app, pero tienes estas restricciones estrictas:

RESTRICCIONES TÉCNICAS:
- Solo puedes sugerir soluciones que usen máximo 50 líneas de código
- No puedes usar ninguna librería externa nueva
- La solución debe funcionar sin cambiar el backend
- Debe ser compatible con navegadores IE11+

RESTRICCIONES DE FORMATO:
- Tu respuesta debe tener exactamente 3 opciones
- Cada opción debe tener: título, código, pros/contras
- Todo debe caber en menos de 500 palabras

PROBLEMA:
Los usuarios deben permanecer logueados por 30 días, pero el token JWT expira en 1 hora y no puedo cambiar el backend que lo genera."
```

---

## 🐛 Debugging y Troubleshooting {#debugging-troubleshooting}

### 🕵️ Framework SHERLOCK para Debugging

**Analogía**: Eres **Sherlock Holmes investigando un crimen**. Cada pista importa, y la secuencia de investigación es crucial.

```markdown
## S.H.E.R.L.O.C.K Framework

### 🔍 S - SYMPTOMS (Síntomas)
"¿QUÉ está pasando exactamente?"
- Comportamiento observado vs esperado
- Cuándo ocurre (patrón temporal)
- Frecuencia y consistencia

### 📚 H - HISTORY (Historia) 
"¿CUÁNDO empezó a pasar?"
- Último deployment/cambio
- Diferencias entre ambientes
- Timeline de eventos

### 🌍 E - ENVIRONMENT (Entorno)
"¿DÓNDE está pasando?"
- Dispositivos/browsers afectados
- Versiones específicas
- Configuraciones de sistema

### 🔄 R - REPRODUCTION (Reproducción)
"¿CÓMO recrearlo?"
- Pasos mínimos para reproducir
- Condiciones necesarias
- Datos de prueba

### 📊 L - LOGS (Logs y Evidencia)
"¿QUÉ dicen los datos?"
- Error messages exactos
- Stack traces completos
- Métricas de performance

### 🧩 O - OBSERVATIONS (Observaciones)
"¿QUÉ patrones notas?"
- Comportamientos inconsistentes
- Correlaciones con otros sistemas
- Anomalías en métricas

### 🎯 C - CONTEXT (Contexto)
"¿CUÁL es el impacto business?"
- Usuarios afectados
- Funcionalidad comprometida
- Urgencia del fix

### 🔑 K - KNOWLEDGE (Conocimiento)
"¿QUÉ se ha intentado?"
- Soluciones previas probadas
- Hipótesis descartadas
- Limitaciones conocidas
```

### 🎯 Aplicación Práctica del Framework

```markdown
## Ejemplo: Bug Report Perfecto

Actúa como un Senior Developer ayudándome a debuggear usando el framework SHERLOCK:

### 🔍 SYMPTOMS
Mi app React Native crashea instantáneamente al abrir en dispositivos Android, pero funciona perfecto en iOS y en el simulador Android.

### 📚 HISTORY  
Empezó después de integrar react-native-camera hace 3 días. Before that, funcionaba en todos los dispositivos.

### 🌍 ENVIRONMENT
- Dispositivos afectados: Samsung Galaxy S21, Pixel 6 (Android 12+)
- Funcionando: iPhone 13, Android Emulator, Xiaomi Mi 9 (Android 10)
- React Native 0.72.4, Expo SDK 49

### 🔄 REPRODUCTION
1. npx expo run:android
2. App se instala correctamente  
3. Al tocar el ícono, splash screen aparece por 1 segundo
4. App crashea instantáneamente sin error visible

### 📊 LOGS
```

AndroidRuntime: FATAL EXCEPTION: main Process: com.myapp.example, PID: 12847 java.lang.UnsatisfiedLinkError: couldn't find DSO to load: librnvcamera.so

```

### 🧩 OBSERVATIONS
- Solo afecta Android 12+
- El crash es inmediato, no progresivo
- La librería camera funciona en otros proyectos

### 🎯 CONTEXT
- Affecting 60% of our Android users
- Blocking production release scheduled for tomorrow
- Critical feature: camera is core functionality

### 🔑 KNOWLEDGE
Intenté:
- expo install --fix
- Limpiar cache: npx expo r -c
- Reinstalar node_modules
- Rollback a commit anterior (funcionó, confirmando que es la camera lib)

Como Senior Developer, ¿cuál sería tu approach metodológico para resolver esto?"
```

---

## 🎭 Casos de Uso por Especialidad {#casos-especialidad}

### 🎨 Frontend Development

```markdown
## Template: Frontend Performance Optimization

"Actúa como un React Performance Expert.

CONTEXTO: App de e-commerce React con 50+ componentes, bundle size 3MB, Core Web Vitals en rojo.

PROBLEMA ESPECÍFICO: [tu problema específico]

ANÁLISIS QUE NECESITO:
1. 🔍 Root cause analysis del performance issue
2. 🛠️ Specific code optimizations
3. 📊 Metrics to track improvement
4. 🚀 Implementation priority order

FORMATO DE RESPUESTA:
```

🎯 PROBLEMA IDENTIFICADO: [1-2 líneas explicando la causa raíz]

🔧 SOLUCIÓN IMPLEMENTABLE: [Código específico con before/after]

📈 IMPACTO ESPERADO: [Métricas cuantificables]

⚡ QUICK WINS (1-2 horas): [Cambios inmediatos]

🏗️ LONG TERM (1-2 sprints): [Refactors estructurales]

```

MI PROBLEMA ACTUAL:
[Describe tu problema específico aquí]"
```

### 🔧 Backend Development

```markdown
## Template: API Design & Performance

"Actúa como un Senior Backend Architect especializado en APIs REST.

CONTEXTO: Microservicio Node.js/Express manejando 10K requests/minute, PostgreSQL database, deployed en AWS ECS.

DESAFÍO ACTUAL: [tu problema específico]

NECESITO TU EXPERTISE EN:
1. 🏗️ Architecture review and recommendations
2. 🔍 Performance bottleneck identification  
3. 📐 Scalability considerations
4. 🛡️ Security implications
5. 🧪 Testing strategy

ESTRUCTURA DE RESPUESTA:
```

📊 ASSESSMENT ACTUAL: [Análisis del estado current]

🎯 ARQUITECTURA RECOMENDADA: [Design patterns y best practices]

⚡ OPTIMIZACIONES INMEDIATAS: [Quick wins implementables hoy]

🔮 ROADMAP A 6 MESES: [Estrategia de escalamiento]

🧪 TESTING CHECKLIST: [Qué y cómo testear]

```

MI SITUACIÓN ESPECÍFICA:
[Detalla tu problema de backend aquí]"
```

### 📱 Mobile Development

```markdown
## Template: React Native Troubleshooting

"Actúa como un React Native Expert con experiencia en apps de producción con 1M+ downloads.

CONTEXTO DEL PROYECTO:
- App: [tipo de app]
- Stack: React Native [versión] + [state management] + [navegación]
- Plataformas: iOS [versión] / Android [versión]
- Usuarios: [cantidad] activos

PROBLEMA CRÍTICO: [tu problema]

ANÁLISIS REQUERIDO:
1. 🔍 Platform-specific considerations
2. 🏗️ Architecture review
3. 📱 Performance optimization
4. 🚀 Deployment strategy
5. 🐛 Common pitfalls to avoid

DELIVERABLES ESPERADOS:
```

🎯 DIAGNOSIS: [Root cause en 2-3 líneas]

📱 PLATFORM CONSIDERATIONS: iOS: [específico para iOS] Android: [específico para Android]

💻 CODE SOLUTION: [Implementación step-by-step]

🧪 TESTING PROTOCOL: [Cómo validar la fix]

📈 MONITORING: [Métricas post-deploy]

```

DETALLE DE MI PROBLEMA:
[Tu situación específica aquí]"
```

### ☁️ DevOps & Infrastructure

```markdown
## Template: DevOps Problem Solving

"Actúa como un Senior DevOps Engineer con expertise en [AWS/GCP/Azure] y Kubernetes.

INFRASTRUCTURE CONTEXT:
- Cloud: [provider]
- Container orchestration: [Docker/K8s]
- CI/CD: [pipeline tools]
- Monitoring: [tools]
- Scale: [traffic/users]

INCIDENT DESCRIPTION: [tu problema]

NECESITO TU APPROACH COMO DEVOPS SENIOR:
1. 🚨 Incident classification and urgency
2. 🔍 Systematic diagnostic approach
3. 🛠️ Immediate mitigation steps
4. 🔧 Root cause resolution
5. 📋 Prevention measures

RESPONSE STRUCTURE:
```

🚨 SEVERITY ASSESSMENT: [P0/P1/P2 classification and why]

🔥 IMMEDIATE ACTIONS (next 30 minutes): [Mitigation steps to stop bleeding]

🕵️ DIAGNOSTIC PLAN (next 2 hours): [Investigation methodology]

🔧 RESOLUTION STRATEGY (next 24 hours): [Permanent fix implementation]

🛡️ PREVENTION MEASURES (next sprint): [How to avoid recurrence]

📊 MONITORING IMPROVEMENTS: [Better observability]

```

MI INCIDENT ACTUAL:
[Describe tu problema de infraestructura]"
```

---

## 🎪 Prompts para Diferentes Contextos {#prompts-contextos}

### 🚀 Code Review Request

```markdown
## Prompt: Code Review Inteligente

"Actúa como un Tech Lead experimentado haciendo code review.

CONTEXTO: Pull Request para [feature/bugfix] en [proyecto tipo].

CÓDIGO A REVISAR:
```[lenguaje]
[tu código aquí]
```

REVIEW CRITERIA:

1. 🏗️ Architecture & Design Patterns
2. 🔒 Security vulnerabilities
3. ⚡ Performance implications
4. 🧪 Testability
5. 📖 Code readability & maintainability
6. 🔄 Reusability potential

OUTPUT FORMAT:

```
⭐ OVERALL RATING: [1-5 stars] - [reasoning]

✅ STRENGTHS:
- [Point 1]
- [Point 2]

⚠️ CONCERNS:
- [Issue 1] - [Severity: High/Medium/Low]
- [Issue 2] - [Severity: High/Medium/Low]

🔧 SPECIFIC IMPROVEMENTS:
[Line-by-line suggestions with code examples]

🚀 NEXT STEPS:
[Action items before merge]
```

CONTEXTO ADICIONAL: [Menciona cualquier constraint o contexto específico]"

```

### 🎯 Architecture Decision

```markdown
## Prompt: Architectural Guidance

"Actúa como un Solution Architect ayudándome a tomar una decisión técnica crítica.

BUSINESS CONTEXT:
- Empresa: [tipo/tamaño]
- Producto: [descripción]
- Timeline: [urgencia]
- Budget constraints: [limitaciones]

DECISION TO MAKE:
[Tu dilema arquitectónico específico]

OPTIONS BEING CONSIDERED:
1. [Opción A] - [pros/cons básicos]
2. [Opción B] - [pros/cons básicos]  
3. [Opción C o "otra que sugieras"]

EVALUATION CRITERIA:
1. 🚀 Time to market
2. 💰 Cost (development + maintenance)
3. 📈 Scalability potential
4. 🛡️ Security requirements
5. 👥 Team skill alignment
6. 🔄 Future flexibility

DECISION FRAMEWORK:
```

📊 COMPARISON MATRIX: [Scoring each option 1-5 on each criteria]

🎯 RECOMMENDATION: [Your top choice with reasoning]

⚠️ RISKS & MITIGATIONS: [What could go wrong and how to prevent it]

🗺️ IMPLEMENTATION ROADMAP: [Phase-by-phase approach]

📋 SUCCESS METRICS: [How to measure if decision was right]

```

SPECIFIC CONSTRAINTS:
[Cualquier limitación técnica o business]"
```

### 🐛 Emergency Debugging

```markdown
## Prompt: Production Emergency

"🚨 PRODUCTION EMERGENCY - Actúa como un Senior SRE en incident response mode.

INCIDENT STATUS:
- Severity: [P0/P1/P2]
- Start time: [cuando empezó]
- User impact: [cuántos usuarios afectados]
- Business impact: [revenue/reputation impact]

SYMPTOMS:
[Qué está roto exactamente]

MONITORING DATA:
[Logs, métricas, alerts que tienes]

WHAT I'VE TRIED:
[Pasos ya tomados]

NEED YOUR INCIDENT RESPONSE PROTOCOL:

```

⏱️ IMMEDIATE (next 5 minutes): [Stop the bleeding actions]

🔍 INVESTIGATE (next 30 minutes):
[Diagnostic steps in priority order]

🛠️ RESOLVE (next 2 hours): [Fix implementation strategy]

📢 COMMUNICATE (ongoing): [Stakeholder update template]

📋 POST-MORTEM PREP: [What to document for learning]

```

CONSTRAINT: Team is stretched thin, CEO is asking questions, customers are complaining on social media."
```

---

## 🎨 Patrones y Templates Reutilizables {#patrones-templates}

### 🧩 Template Universal: CONTEXT-GOAL-CONSTRAINTS-FORMAT

```markdown
## Universal Problem Solving Template

### 🌍 CONTEXT
"Soy [rol] con [experiencia] trabajando en [tipo de proyecto] para [tipo de empresa/cliente].
Tech stack: [tecnologías principales]
Team size: [tamaño del equipo]
Project stage: [MVP/Growth/Scale/Maintenance]"

### 🎯 GOAL  
"Necesito [objetivo específico] para [business reason] que debe [success criteria cuantificables].
Priority: [P0/P1/P2] because [reasoning]"

### ⚠️ CONSTRAINTS
"Limitaciones:
- Time: [deadline y urgencia]
- Technical: [limitaciones de stack/legacy]
- Business: [budget/política/compliance]  
- Team: [skills/availability]"

### 📋 FORMAT
"Quiero recibir:
1. [Específico deliverable 1]
2. [Específico deliverable 2]  
3. [Específico deliverable 3]
Formato: [código/explicación/checklist/etc.]
Longitud: [corto/detallado]"

### 🎪 MY SPECIFIC SITUATION
[Aquí describes tu problema específico]
```

### 🔄 Template: Iterative Problem Solving

```markdown
## Multi-Round Problem Solving

"Vamos a resolver esto en iteraciones como un pair programming session.

ROUND 1 - UNDERSTANDING:
Primero, necesito que reformules mi problema en tus propias palabras para confirmar que entendiste correctamente.

ROUND 2 - OPTIONS:  
Luego, dame 3 enfoques diferentes (conservador, balanceado, innovador) con pros/cons.

ROUND 3 - DEEP DIVE:
Después profundizaremos en el enfoque que elija con implementación detallada.

ROUND 4 - VALIDATION:
Finalmente, revisaremos la solución y prepararemos testing/deployment.

MI PROBLEMA INICIAL:
[Tu situación específica]

¿Empezamos con ROUND 1?"
```

### 🎯 Template: Learning-Oriented Request

```markdown
## Teaching-Focused Prompt

"Actúa como un Senior Developer que está mentoring a un junior.

MI NIVEL: [Junior/Mid/Senior] en [tecnología]
OBJETIVO DE APRENDIZAJE: No solo resolver mi problema, sino entender los principios para casos similares.

TEACHING APPROACH:
1. 🎯 Explica el problema y por qué ocurre
2. 🏗️ Muestra la solución paso a paso
3. 🧠 Conecta con conceptos fundamentales
4. 🔄 Da ejercicios similares para practicar
5. 📚 Sugiere recursos para profundizar

MI PROBLEMA ESPECÍFICO:
[Tu situación]

ADDITIONAL CONTEXT:
Mi objetivo es convertirme en [senior/tech lead/architect] en [timeframe], así que trata este como una oportunidad de enseñanza, no solo resolución rápida."
```

---

## ⚠️ Errores Comunes y Cómo Evitarlos {#errores-comunes}

### 🚫 Los 7 Pecados Capitales del Prompt Engineering

#### 1. **El Pecado de la Vaguedad** 🌫️

**Analogía**: Es como pedirle direcciones diciendo "llévame a un lugar bonito".

```markdown
❌ PECADO:
"Mi app no funciona bien, ayúdame"

✅ REDENCIÓN:
"Mi app React Native (v0.72) tiene un memory leak que causa crashes después de 5 minutos de uso intensivo en Android (probado en Samsung S21). El heap crece de 150MB a 1.2GB. Stack trace muestra referencias a FlatList con 1000+ items. ¿Puedes ayudarme a implementar virtualization o identificar el leak?"
```

#### 2. **El Pecado de la Impaciencia** ⚡

**Analogía**: Es como interrumpir al doctor antes de que termine el diagnóstico.

```markdown
❌ PECADO:
[Enviar múltiples prompts seguidos sin esperar respuesta completa]
"Dame el código"
"Rápido necesito la solución"  
"Solo el fix, sin explicaciones"

✅ REDENCIÓN:
"Tómate el tiempo que necesites para dar una respuesta completa. Prefiero una solución bien explicada que me enseñe, aunque tome más tiempo, que un quick fix que no entiendo."
```

#### 3. **El Pecado de la Falta de Contexto** 🌍

**Analogía**: Es como llamar al soporte técnico y decir "no funciona" sin mencionar qué dispositivo usas.

```markdown
❌ PECADO:
"Este código tiene un bug:
```javascript
const result = data.map(item => item.value)
```

✅ REDENCIÓN: "Este código de mi componente React causa un error 'Cannot read property value of undefined' cuando el API retorna un array vacío en el 10% de los casos. Context: e-commerce app, este map está en un useEffect que procesa productos del carrito. Stack: React 18, TypeScript.
