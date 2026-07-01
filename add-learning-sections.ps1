param(
    [string]$File
)

$blogDir = "C:\Users\jeron\Desktop\blog-jero\src\content\blog"
$fPath = Join-Path $blogDir $File
$content = [System.IO.File]::ReadAllText($fPath, [System.Text.Encoding]::UTF8)
$lines = $content -split "`r?`n"

# Check if already has the section (exactly one occurrence)
$sectionMatches = [regex]::Matches($content, "## Qu[ée]\s+vas\s+a\s+aprender\s*\r?\n")
if ($sectionMatches.Count -ge 1) {
    Write-Output "SKIP: $File"
    exit 0
}

# Extract title from frontmatter
$title = ""
foreach ($line in $lines) {
    if ($line -match "^title:\s*(.+)$") {
        $title = $Matches[1].Trim().TrimStart("'").TrimEnd("'").TrimStart('"').TrimEnd('"')
        break
    }
}
if (-not $title) {
    foreach ($line in $lines) {
        if ($line -match "^#\s+(.+)$") {
            $title = $Matches[1].Trim().TrimStart("#").Trim()
            break
        }
    }
}

# Extract description from frontmatter
$desc = ""
foreach ($line in $lines) {
    if ($line -match "^description:\s*(.+)$") {
        $desc = $Matches[1].Trim().TrimStart("'").TrimEnd("'").TrimStart('"').TrimEnd('"')
        break
    }
}

$lowerTitle = $title.ToLower()
$lowerDesc = $desc.ToLower()
$combined = $lowerTitle + " " + $lowerDesc

function Get-LearningSection {
    param($t, $d, $combined)
    
    if ($combined -match "api|rest|graphql|grpc|http|endpoint") {
        return @"
##  vas a aprender

En esta masterclass profundizar s en el dise o, construcci n y evoluci n de APIs profesionales:

- Los estilos arquitect nicos y cu ndo elegir cada uno seg n el problema
- Protocolos de red y c mo impactan en el rendimiento de tus servicios
- Modelado de recursos, versionado y contratos que sobreviven al tiempo
- Autenticaci n, autorizaci n y protecci n contra vulnerabilidades comunes
- Criterios para dise ar APIs mantenibles, escalables y seguras

Al finalizar podr s dise ar APIs con criterio arquitect nico s lido, no solo escribir endpoints.
"@
    }
    elseif ($combined -match "analisis.*t[eé]cnico|indicador|sma|ema|medias? m[oó]vil|trading.*t[eé]cnico|patr[oó]n") {
        return @"
##  vas a aprender

En esta gu a recorrer s los conceptos del an lisis t cnico aplicado a los mercados financieros:

- C mo interpretar gr ficos de precio y volumen para tomar decisiones informadas
- Las principales figuras y patrones de reversal y continuaci n
- Indicadores t cnicos clave y c mo combinarlos para filtrar se ales
- C mo construir y validar una estrategia de trading con datos hist ricos
- Psicolog a del trading: gesti n del riesgo y disciplina operativa
"@
    }
    elseif ($combined -match "laravel|elocuent|migration|blade|artisan|validad|lara") {
        return @"
##  vas a aprender

En este contenido dominar s los conceptos y herramientas esenciales del ecosistema Laravel:

- El ciclo de vida de una petici n HTTP en Laravel y c mo funciona el framework internamente
- Eloquent ORM: consultas, relaciones, scopes y patrones avanzados
- Validaciones, Form Requests y flujos de datos seguros
- Migraciones, seeders, factories y manejo de base de datos
- Arquitectura de servicios, repositorios y pruebas automatizadas
"@
    }
    elseif ($combined -match "ia.?generativa|generativa|\bia\b|inteligencia artificial|machine learning|deep learning|llm|gpt|claude|openai|langchain|rag|agente|agent") {
        return @"
##  vas a aprender

En este contenido explorar s los pilares y aplicaciones de la inteligencia artificial moderna:

- Los fundamentos conceptuales que diferencian a cada enfoque de IA
- C mo funcionan los modelos de lenguaje y c mo interactuar con ellos
- T cnicas de prompting y frameworks de agentes aut nomos
- RAG, herramientas MCP y c mo conectar la IA con datos reales
- Aplicaciones pr cticas para desarrollo, negocios y productividad
"@
    }
    elseif ($combined -match "javascript|react|vue|angular|angular|node|typescript|frontend|next|vite|webpack|svelte|remix|expo|astro") {
        return @"
##  vas a aprender

En este contenido dominar s los conceptos y herramientas del desarrollo frontend moderno:

- El funcionamiento del runtime JavaScript y el ecosistema de paquetes
- Patrones de componentes, estado y renderizado en tu framework de elecci n
- Optimizaci n de rendimiento, carga y experiencia de usuario
- Pruebas, tipado, arquitectura y escalabilidad de proyectos frontend
- Integraci n con backends, APIs y despliegue en producci n
"@
    }
    elseif ($combined -match "backend|api|python|go|java|node|microservicio|rest|grpc|server|php") {
        return @"
##  vas a aprender

En este contenido dominar s la arquitectura y las pr cticas del desarrollo backend moderno:

- Dise o de APIs RESTful y protocolos de comunicaci n
- Modelado de datos, bases de datos relacionales y NoSQL
- Arquitectura de aplicaciones, patrones y separaci n de responsabilidades
- Seguridad, autenticaci n, autorizaci n y protecci n de servicios
- Escalabilidad, caching, colas y despliegue en producci n
"@
    }
    elseif ($combined -match "docker|kubernetes|k8s|cicd|devops|terraform|observabilidad|sre|helm|nginx|aws|cloud|azure|gcp|github|pipeline") {
        return @"
##  vas a aprender

En este contenido dominar s las pr cticas y herramientas de DevOps y operaciones modernas:

- Contenerizaci n con Docker y orquestaci n con Kubernetes
- Pipelines de CI/CD, despliegues automatizados y rollbacks seguros
- Infraestructura como c digo: Terraform, provisionamiento y configuraci n
- Observabilidad: m tricas, logs, trazas y alertas
- Escalabilidad, seguridad en producci n y cultura DevOps aplicada
"@
    }
    elseif ($combined -match "base.*dat|sql|postgres|mysql|mongodb|redis|prisma|eloquent|bases? de dato|modelado.*datos") {
        return @"
##  vas a aprender

En este contenido dominar s el modelado, dise o y gesti n de bases de datos:

- Tipos de bases de datos y cu ndo usar cada una seg n el problema
- Modelado relacional: entidades, relaciones, normalizaci n y claves
- Consultas SQL avanzadas,  ndices y optimizaci n de rendimiento
- Transacciones, ACID, aislamiento y consistencia en sistemas distribuidos
- ORMs, migraciones y mejores pr cticas en producci n
"@
    }
    elseif ($combined -match "system.*design|dise?o.*sistema|arquitectura.*software|distribuido|escalab|alta.*disponibilidad|arquitecto") {
        return @"
##  vas a aprender

En este contenido desarrollar s la visi n arquitect nica necesaria para construir sistemas escalables:

- Patrones arquitect nicos y c mo elegir el adecuado para cada contexto
- Balanceo de carga, caching, colas y bases de datos distribuidas
- Consistencia, particionamiento y tolerancia a fallos
- Dise o de APIs, contratos y comunicaci n entre servicios
- Trade-offs, medici n de rendimiento y toma de decisiones t cnicas
"@
    }
    elseif ($combined -match "testing|prueba|unitario|e2e|jest|cypress|playwright|pytest") {
        return @"
##  vas a aprender

En este contenido dominar s las estrategias y herramientas de pruebas de software:

- Principios de testing: piramidal, cobertura y tipos de pruebas
- Pruebas unitarias, integraci n y end-to-end con herramientas modernas
- Mocking, spies y simulaci n de dependencias externas
- TDD: flujo de trabajo y pruebas en productos reales
- Integraci n en pipelines y calidad continua
"@
    }
    elseif ($combined -match "git|github|gitlab|control.*versi|pull request|branch") {
        return @"
##  vas a aprender

En este contenido dominar s el flujo de trabajo y las pr cticas de control de versiones:

- Modelos de branching, estrategias de ramificaci n y flujos de trabajo colaborativos
- Resoluci n de conflictos, merges y operaciones avanzadas con Git
- Pull requests, code reviews y automatizaci n con GitHub Actions
- Versionado sem ntico, releases y gesti n de proyectos
- Buenas pr cticas para equipos de cualquier tama o
"@
    }
    elseif ($combined -match "seguridad|owasp|vulnerabilidad|auth|jwt|oauth|pentest|hack") {
        return @"
##  vas a aprender

En este contenido desarrollar s una visi n integral de la seguridad inform tica:

- Los vectores de ataque m s comunes y c mo prevenirlos
- Autenticaci n, autorizaci n y gesti n de sesiones seguras
- Seguridad en APIs, validaci n de entradas y protecci n contra inyecciones
- Cifrado, gesti n de secretos y cumplimiento normativo
- Monitorizaci n, respuesta a incidentes y cultura de seguridad
"@
    }
    elseif ($combined -match "dise?o|figma|interfaz|usuario|experiencia|visual|prototipo|l mina|componente.*fuego|design.*sistem") {
        return @"
##  vas a aprender

En este contenido dominar s los principios y herramientas del dise o digital:

- Fundamentos de UI/UX y jerarqu a visual aplicada a interfaces reales
- Dise o de sistemas, componentes reutilizables y patrones de interacci n
- Accesibilidad, responsive y experiencia multi-dispositivo
- Flujos de trabajo colaborativos entre dise o y desarrollo
- Pr cticas de prototipado, testing con usuarios y entrega a producci n
"@
    }
    elseif ($combined -match "ingl[ees]|idioma|english|gram[ma]tica|verb|speaking|conversa|fluidez|vocabulario|pronunci") {
        return @"
##  vas a aprender

En este contenido desarrollar s tus habilidades en ingl s de manera pr ctica y progresiva:

- Comprensi n oral y lectura contextual con estrategias efectivas
- Expresi n oral, fluidez y construcci n de frases naturales
- Gram tica aplicada sin memorizaci n mec nica
- Vocabulario situacional: laboral, tecnol gico y cotidiano
- Consejos de listening, pronunciaci n y coaching de exposici n
"@
    }
    elseif ($combined -match "trading|bolsa|forex|acci[oó]n|inversi[oó]n|finanzas|opci[oó]n|futuro|activo|broker|rentabilidad|divisa|cambio|blue|mep") {
        return @"
##  vas a aprender

En este contenido desarrollar s los conocimientos para operar en mercados financieros con criterio:

- Tipos de activos, mercados y participantes del ecosistema financiero
- An lisis fundamental y t cnico aplicado a la toma de decisiones
- Gesti n de riesgo, posicionamiento y psicolog a del trader
- Estrategias probadas para diferentes perfiles y horizontes temporales
- Herramientas, plataformas y framework para operar de forma consistente
"@
    }
    elseif ($combined -match "seducci[oó]n|atracci[oó]n|cita|relaci[oó]n|carisma|lenguaje.*corporal|conversaci[oó]n.*mujer|habilidades.*social|conexi[oó]n.*interperson|efecto.*halo|selfie") {
        return @"
##  vas a aprender

En este contenido desarrollar s tus habilidades sociales y de conexi n interpersonal:

- Psicolog a de la atracci n y principios de influencia aplicados  ticamente
- Comunicaci n no verbal, lectura de se ales y presencia magn tica
- Habilidades conversacionales: iniciaci n, profundidad y cierre
- Construcci n de confianza aut ntica y vulnerabilidad como herramienta
- Errores comunes, anti-patrones y c mo corregirlos en la pr ctica
"@
    }
    elseif ($combined -match "emprend|negocio|empres|startup|freelance|ventas|marketing|monetiz|producto|saas|escalar|administraci[oó]n.*empres|liderazgo|administrativo|negocio.*digital") {
        return @"
##  vas a aprender

En este contenido desarrollar s la visi n estrat gica para construir y escalar negocios:

- Validaci n de ideas, modelo de negocio y propuesta de valor
- Estrategias de crecimiento, monetizaci n y retenci n de clientes
- Gesti n financiera, pricing y optimizaci n de recursos
- Liderazgo, cultura organizacional y toma de decisiones bajo incertidumbre
- Casos reales, errores comunes y lecciones aplicables
"@
    }
    elseif ($combined -match "disciplina|h[aá]bito|productividad|foco|meta|mentalidad|objetivo|crecimiento|constancia|sistema|construir.*h[aá]bito|karma|metodo.*aprendizaje|aprendizaje.*acelerado") {
        return @"
##  vas a aprender

En este contenido construir s el sistema operativo personal para lograr resultados sostenibles:

- La psicolog a detr s de los h bitos y c mo redise ar tu comportamiento
- Sistemas de disciplina que no dependen de la motivaci n
- Gesti n del tiempo, foco profundo y eliminaci n de distracciones
- Mentalidad de crecimiento y reestructuraci n de creencias limitantes
- Pr cticas concretas, rutinas y m tricas de progreso
"@
    }
    elseif ($combined -match "fitness|gim|ejercicio|m[sc]sculo|entrena|nutrici|salud|dieta|peso|cuerpo|bienestar") {
        return @"
##  vas a aprender

En este contenido dominar s los fundamentos y las estrategias para alcanzar tu mejor versi n f sica:

- Bases de fisiolog a del ejercicio y principios del entrenamiento
- Rutinas estructuradas seg n tu objetivo y nivel
- Nutrici n aplicada: macronutrientes, d cit/super vit y suplementaci n
- Descanso, recuperaci n y consistencia como pilares del progreso
- Errores comunes, mitos y c mo optimizar tus resultados a largo plazo
"@
    }
    elseif ($combined -match "angular|react|vue|svelte|next|expo|react.?native|javascript|frontend|component|hook|router|angular.*signal|redux|context|state|css|tailwind|ui|ux") {
        return @"
##  vas a aprender

En este contenido dominar s los conceptos y herramientas del desarrollo frontend moderno:

- El ciclo de vida, renderizado y actualizaciones en tu framework de elecci n
- Patrones de componentes, estado, routing y comunicaci n entre vistas
- Optimizaci n de rendimiento, carga y experiencia de usuario
- Testing, tipado y arquitectura de proyectos escalables
- Integraci n con backends, APIs y despliegue en producci n
"@
    }
    elseif ($combined -match "blockchain|cripto|bitcoin|web3|defi|smart.*contract|nft|token") {
        return @"
##  vas a aprender

En este contenido entender s el ecosistema blockchain y las tecnolog as descentralizadas:

- Fundamentos de blockchain, criptograf a y consenso distribuido
- C mo funcionan las criptomonedas, tokens y smart contracts
- Arquitectura de dApps, wallets y protocolos DeFi
- Seguridad, privacidad y riesgos del ecosistema
- Casos de uso reales y el futuro de la web descentralizada
"@
    }
    elseif ($combined -match "python|ia\.|n8n|automatizaci[oó]n|automatizar|workflow|flujo.*automatizad|mcp|openai|langchain|agente|tool") {
        return @"
##  vas a aprender

En este contenido dominar s las herramientas y t cnicas de automatizaci n e inteligencia artificial aplicada:

- Fundamentos de programaci n y scripting para productividad
- Dise o de flujos automatizados y orquestaci n de tareas
- Integraci n de APIs, servicios en la nube y bases de datos
- Dise o y despliegue de agentes de IA aut nomos
- Casos de uso reales y framework para automatizar procesos
"@
    }
    elseif ($combined -match "dise?o|figma|interfaz|usuario|experiencia|visual|prototipo|ui|ux") {
        return @"
##  vas a aprender

En este contenido dominar s los principios y herramientas del dise o digital:

- Fundamentos de UI/UX y jerarqu a visual aplicada a interfaces reales
- Dise o de sistemas, componentes reutilizables y patrones de interacci n
- Accesibilidad, responsive y experiencia multi-dispositivo
- Flujos de trabajo colaborativos entre dise o y desarrollo
- Pr cticas de prototipado, testing con usuarios y entrega a producci n
"@
    }
    elseif ($combined -match "trading|bolsa|forex|acci[oó]n|inversi[oó]n|finanzas|opci[oó]n|futuro|activo|broker|rentabilidad") {
        return @"
##  vas a aprender

En este contenido desarrollar s los conocimientos para operar en mercados financieros con criterio:

- Tipos de activos, mercados y participantes del ecosistema financiero
- An lisis fundamental y t cnico aplicado a la toma de decisiones
- Gesti n de riesgo, posicionamiento y psicolog a del trader
- Estrategias probadas para diferentes perfiles y horizontes temporales
- Herramientas, plataformas y framework para operar de forma consistente
"@
    }
    elseif ($combined -match "seducci[oó]n|atracci[oó]n|cita|relaci[oó]n|carisma|lenguaje.*corporal|conversaci[oó]n.*mujer|habilidades.*social|conexi[oó]n.*interperson|efecto.*halo|selfie") {
        return @"
##  vas a aprender

En este contenido desarrollar s tus habilidades sociales y de conexi n interpersonal:

- Psicolog a de la atracci n y principios de influencia aplicados  ticamente
- Comunicaci n no verbal, lectura de se ales y presencia magn tica
- Habilidades conversacionales: iniciaci n, profundidad y cierre
- Construcci n de confianza aut ntica y vulnerabilidad como herramienta
- Errores comunes, anti-patrones y c mo corregirlos en la pr ctica
"@
    }
    elseif ($combined -match "emprend|negocio|empres|startup|freelance|ventas|marketing|monetiz|producto|saas|escalar|liderazgo|negocio.*digital") {
        return @"
##  vas a aprender

En este contenido desarrollar s la visi n estrat gica para construir y escalar negocios:

- Validaci n de ideas, modelo de negocio y propuesta de valor
- Estrategias de crecimiento, monetizaci n y retenci n de clientes
- Gesti n financiera, pricing y optimizaci n de recursos
- Liderazgo, cultura organizacional y toma de decisiones bajo incertidumbre
- Casos reales, errores comunes y lecciones aplicables
"@
    }
    elseif ($combined -match "disciplina|h[aá]bito|productividad|foco|meta|mentalidad|objetivo|crecimiento|constancia|sistema|construir.*h[aá]bito|karma|metodo.*aprendizaje|aprendizaje.*acelerado") {
        return @"
##  vas a aprender

En este contenido construir s el sistema operativo personal para lograr resultados sostenibles:

- La psicolog a detr s de los h bitos y c mo redise ar tu comportamiento
- Sistemas de disciplina que no dependen de la motivaci n
- Gesti n del tiempo, foco profundo y eliminaci n de distracciones
- Mentalidad de crecimiento y reestructuraci n de creencias limitantes
- Pr cticas concretas, rutinas y m tricas de progreso
"@
    }
    elseif ($combined -match "ng-rx|react.?native|react|redux|signal|hook|useEffect|context.*api|router") {
        return @"
##  vas a aprender

En este contenido dominar s los conceptos avanzados de React y React Native:

- Ciclo de vida, renderizado y actualizaciones en React
- Hooks personalizados, estado y comunicaci n entre componentes
- Patrones de optimizaci n, memoizaci n y rendimiento
- Arquitectura de state management y flujos de datos
- Testing, accesibilidad y mejores pr cticas en producci n
"@
    }
    elseif ($combined -match "typescript|type|interface|enum") {
        return @"
##  vas a aprender

En este contenido dominar s TypeScript y sus herramientas de tipado:

- Interfaces, types y enums: cu ndo usar cada uno
- Tipos avanzados: unions, intersections, mapped types y condicionales
- Patrones de tipado para APIs, formularios y estado global
- Mejores pr cticas y anti-patrones en proyectos reales
- Estrategias de migraci n desde JavaScript y mantenibilidad a largo plazo
"@
    }
    elseif ($combined -match "n8n|automatizaci[oó]n") {
        return @"
##  vas a aprender

En este contenido dominar s las herramientas y flujos de automatizaci n con n8n:

- Arquitectura de workflows, nodos y conexiones
- Integraci n con APIs, bases de datos y servicios en la nube
- Manejo de errores, reintentos y despliegues en producci n
- Patrones avanzados: bifurcaciones, bucles y condicionales
- Casos de uso reales para equipos y negocios
"@
    }
    elseif ($combined -match "nestjs|nest") {
        return @"
##  vas a aprender

En este contenido dominar s el framework NestJS y sus patrones arquitect nicos:

- M dulos, controladores, servicios y providers
- Inyecci n de dependencias, decoradores y ciclo de vida
- Pruebas unitarias, e2e y arquitectura escalable
- Integraci n con bases de datos, colas y microservicios
- Despliegue en producci n y monitoreo
"@
    }
    elseif ($combined -match "git|github|control.*versi") {
        return @"
##  vas a aprender

En este contenido dominar s el flujo de trabajo y las pr cticas de control de versiones:

- Modelos de branching, estrategias de ramificaci n y flujos de trabajo colaborativos
- Resoluci n de conflictos, merges y operaciones avanzadas con Git
- Pull requests, code reviews y automatizaci n con GitHub Actions
- Versionado sem ntico, releases y gesti n de proyectos
- Buenas pr cticas para equipos de cualquier tama o
"@
    }
    elseif ($combined -match "rust|go\b|node\b|express|backend|api") {
        return @"
##  vas a aprender

En este contenido dominar s las tecnolog as y patrones del backend moderno:

- Dise o de APIs RESTful y protocolos de comunicaci n
- Modelado de datos, bases de datos relacionales y NoSQL
- Arquitectura de aplicaciones, patrones y separaci n de responsabilidades
- Seguridad, autenticaci n, autorizaci n y protecci n de servicios
- Escalabilidad, caching, colas y despliegue en producci n
"@
    }
    elseif ($combined -match "fitness|gim|ejercicio|m[sc]sculo|entrena|nutrici|salud|dieta|peso|cuerpo|bienestar") {
        return @"
##  vas a aprender

En este contenido dominar s los fundamentos y las estrategias para alcanzar tu mejor versi n f sica:

- Bases de fisiolog a del ejercicio y principios del entrenamiento
- Rutinas estructuradas seg n tu objetivo y nivel
- Nutrici n aplicada: macronutrientes, d cit/super vit y suplementaci n
- Descanso, recuperaci n y consistencia como pilares del progreso
- Errores comunes, mitos y c mo optimizar tus resultados a largo plazo
"@
    }
    elseif ($combined -match "blockchain|cripto|bitcoin|web3|defi|smart.*contract|nft|token") {
        return @"
##  vas a aprender

En este contenido entender s el ecosistema blockchain y las tecnolog as descentralizadas:

- Fundamentos de blockchain, criptograf a y consenso distribuido
- C mo funcionan las criptomonedas, tokens y smart contracts
- Arquitectura de dApps, wallets y protocolos DeFi
- Seguridad, privacidad y riesgos del ecosistema
- Casos de uso reales y el futuro de la web descentralizada
"@
    }
    else {
        return @"
##  vas a aprender

En este contenido explorar s los conceptos claves y su aplicaci n pr ctica:

- Fundamentos te ricos y contexto necesario para entender el tema
- Aplicaciones pr cticas y casos de uso reales
- Herramientas, t cnicas y mejores pr cticas recomendadas
- Ejemplos guiados paso a paso
- Errores comunes, anti-patrones y c mo evitarlos
"@
    }
}

$section = Get-LearningSection -t $title -d $desc -combined $combined

# Find the closing `---` of frontmatter (after the opening `---`)
$frontmatterEnd = -1
$firstSep = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^---$") {
        if ($firstSep -eq -1) {
            $firstSep = $i
        } else {
            $frontmatterEnd = $i
            break
        }
    }
}

if ($frontmatterEnd -eq -1) {
    Write-Output "WARNING: No frontmatter end found in $File, appending at top"
    $newContent = $section + "`r`n" + "`r`n" + $content
    [System.IO.File]::WriteAllText($fPath, $newContent, New-Object System.Text.UTF8Encoding($false))
    Write-Output "UPDATED: $File"
    exit 0
}

# Build new content: before + section + after
$beforeLines = $lines[0..($frontmatterEnd)]
$afterLines = $lines[($frontmatterEnd + 1)..($lines.Count - 1)]

$sectionLines = $section -split "`r?`n"

$newLines = @()
$newLines += $beforeLines
$newLines += ""
$newLines += $sectionLines
$newLines += ""
$newLines += $afterLines

$newContent = $newLines -join "`r`n"

# Write using UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($fPath, $newContent, $utf8NoBom)
Write-Output "UPDATED: $File"
