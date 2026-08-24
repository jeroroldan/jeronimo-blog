---
title: 'Manejos de fechas'
code: "react"
description: 'Manejos de fechas en javascript'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

## ¿Qué vas a aprender

En este contenido dominarás los conceptos y herramientas del desarrollo frontend moderno:

- El funcionamiento del runtime JavaScript y el ecosistema de paquetes
- Patrones de componentes, estado y renderizado en tu framework de elección
- Optimización de rendimiento, carga y experiencia de usuario
- Pruebas, tipado, arquitectura y escalabilidad de proyectos frontend
- Integración con backends, APIs y despliegue en producción


## 🌟 Reflexión Final {#reflexión-final}

### 🎯 Los Principios Fundamentales del Tiempo en Código

Después de este viaje por el complejo mundo de las fechas y zonas horarias, es momento de reflexionar sobre las lecciones más importantes:

#### 1. **El Tiempo es Relativo, Tu Código Debe Ser Absoluto**

**Analogía**: Imagina que eres un **cartógrafo universal**. No puedes hacer un mapa diciendo "gira a la derecha en la esquina", porque ¿derecha de quién? Necesitas coordenadas absolutas (latitud/longitud).

```typescript
// 🎭 La paradoja temporal
const mismoMomento = new Date("2024-03-15T15:00:00Z")

// Diferentes "realidades" del mismo momento
console.log("En Buenos Aires:", mismoMomento.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }))
console.log("En Tokio:", mismoMomento.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }))
console.log("En Nueva York:", mismoMomento.toLocaleString('en-US', { timeZone: 'America/New_York' }))

// Pero el timestamp es UNIVERSAL
console.log("Timestamp universal:", mismoMomento.getTime())  // ¡Siempre el mismo!
```

**Lección**: UTC es tu **sistema de coordenadas temporal**. Almacena en UTC, muestra en local.

#### 2. **La Complejidad es Inevitable, la Confusión es Opcional**

**Analogía**: Las fechas son como **idiomas humanos** - llenos de excepciones, irregularidades y contexto cultural. No puedes simplificarlos, pero puedes dominarlos.

```typescript
// Las "irregularidades" del tiempo que debes aceptar:
const realidadesDelTiempo = {
  // Los meses NO son 0-indexed en la vida real, pero SÍ en JavaScript
  mesEnVidaReal: "Marzo es el mes 3",
  mesEnJavaScript: "Marzo es el mes 2 (0-indexed)",
  
  // Los timezones cambian (DST)
  horarioVerano: "El mismo lugar puede tener diferentes offsets",
  
  // Los años bisiestos existen
  añoBisiesto: "Febrero puede tener 28 o 29 días",
  
  // Los segundos intercalares existen
  segundosIntercalares: "Algunos minutos tienen 61 segundos",
  
  // Las zonas horarias son políticas, no geográficas
  zonasRaras: "China tiene 1 zona horaria para todo el país"
}
```

**Lección**: No luches contra la complejidad, **abraza las herramientas** que la manejan por ti.

#### 3. **El Contexto es Rey**

**Analogía**: "Nos vemos a las 3" es como decir "nos vemos en la plaza". ¿Cuál plaza? ¿3 AM o PM? ¿En qué zona horaria?

```typescript
// ❌ Sin contexto (ambiguo)
const fechaAmbigua = "2024-03-15 15:00"

// ✅ Con contexto completo (preciso)
const fechaPrecisa = {
  datetime: "2024-03-15T15:00:00",
  timezone: "America/Argentina/Buenos_Aires", 
  utc: "2024-03-15T18:00:00Z",
  intent: "meeting_start",
  creator_timezone: "America/Argentina/Buenos_Aires"
}
```

**Lección**: **Siempre** captura y preserva el contexto temporal.

#### 4. **La Inmutabilidad es Tu Amiga**

**Analogía**: Las fechas son como **fotografías** - representan un momento específico. No deberías "editar" la fotografía original, sino crear una nueva versión.

```typescript
// 🔄 Filosofía de inmutabilidad temporal
class TimePhilosophy {
  // ✅ Crear, no mutar
  addDaysImmutable(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
  }
  
  // ✅ Transformar, no modificar
  transformToTimezone(utcDate: Date, timezone: string): string {
    # Guía Completa: Dominio del Tiempo en JavaScript/TypeScript
## Fechas, Zonas Horarias y Manejo Temporal Across Frameworks
```

## 🌍 Introducción: El Tiempo es Relativo (Einstein tenía razón)

Imagina que eres un **director de orquesta mundial** coordinando músicos en diferentes países. Cuando dices "toquen a las 3 PM", cada músico interpreta diferente:

- 🇦🇷 Músico en Buenos Aires: 3 PM ART
- 🇺🇸 Músico en Nueva York: 3 PM EST
- 🇯🇵 Músico en Tokio: 3 PM JST

**¡Disaster total!** 🎭 Necesitas un **lenguaje temporal universal**.

En programación pasa exactamente lo mismo. Las fechas son **relativas** al contexto, y JavaScript es nuestro director de orquesta.

---

## 📋 Tabla de Contenidos

1. [Conceptos Fundamentales con Analogías](#conceptos-fundamentales)
2. [El Objeto Date: Tu Máquina del Tiempo](#objeto-date)
3. [UTC: El Esperanto del Tiempo](#utc-universal)
4. [Zonas Horarias: Los Dialectos Temporales](#zonas-horarias)
5. [Librerías Modernas: Herramientas de Precisión](#librerías-modernas)
6. [Casos Reales por Framework](#casos-por-framework)
7. [Patrones y Anti-patrones](#patrones-antipatrones)
8. [Problemas Comunes y Soluciones](#problemas-soluciones)
9. [Reflexión Final](#reflexión-final)

---

## 🧭 Conceptos Fundamentales con Analogías {#conceptos-fundamentales}

### 🌐 El Tiempo como Sistema de Coordenadas

**Analogía**: Las fechas son como **direcciones postales**

```typescript
// ❌ Dirección incompleta (ambigua)
const fecha = "25/12/2024"  // ¿DD/MM o MM/DD? ¿Qué zona horaria?

// ✅ Dirección completa (precisa)
const fechaCompleta = new Date("2024-12-25T15:30:00.000Z")  // UTC
const fechaConZona = "2024-12-25T15:30:00-03:00"  // Buenos Aires
```

### 🕰️ Los Tres Pilares del Tiempo

#### 1. **Timestamp Unix (El ADN del Tiempo)**

**Analogía**: Como el número de serie único de cada momento

```typescript
// El momento exacto en el universo (milisegundos desde 1 enero 1970 UTC)
const timestamp = Date.now()  // 1703522400000
const fecha = new Date(timestamp)

console.log(timestamp)  // 1703522400000 (igual en todo el mundo)
console.log(fecha.toString())  // Diferente según la zona horaria local
```

#### 2. **Zona Horaria (El Traductor Local)**

**Analogía**: Como tener el mismo libro en diferentes idiomas

```typescript
const momentoUniversal = new Date("2024-01-15T12:00:00Z")

// El MISMO momento, diferentes "traducciones"
console.log(momentoUniversal.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }))
// "15/1/2024 09:00:00" (UTC-3)

console.log(momentoUniversal.toLocaleString("en-US", { timeZone: "America/New_York" }))
// "1/15/2024, 7:00:00 AM" (UTC-5)

console.log(momentoUniversal.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }))
// "2024/1/15 21:00:00" (UTC+9)
```

#### 3. **Formato (El Vestido del Tiempo)**

**Analogía**: Como diferentes trajes para la misma persona

```typescript
const fecha = new Date("2024-01-15T12:00:00Z")

// Diferentes "outfits" para la misma fecha
const formatoISO = fecha.toISOString()        // "2024-01-15T12:00:00.000Z"
const formatoLocal = fecha.toLocaleDateString() // "1/15/2024"
const formatoCustom = fecha.toLocaleString("es-AR", {
  weekday: "long",
  year: "numeric", 
  month: "long",
  day: "numeric"
})  // "lunes, 15 de enero de 2024"
```

---

## ⏰ El Objeto Date: Tu Máquina del Tiempo {#objeto-date}

### 🔧 Anatomía del Date Object

**Analogía**: Date es como un **reloj suizo complejo** - muchas funciones, pero hay que saber usarlas

```typescript
// 🎯 Creando fechas: Las diferentes formas de "viajar en el tiempo"
class DateExamples {
  demonstrateCreation() {
    // Método 1: Ahora mismo (el presente)
    const ahora = new Date()
    console.log("Ahora:", ahora)

    // Método 2: Desde timestamp (viaje directo)
    const desdeTimestamp = new Date(1703522400000)
  
    // Método 3: Desde string ISO (formato universal)
    const desdeISO = new Date("2024-01-15T12:00:00.000Z")
  
    // Método 4: Construcción manual (pieza por pieza)
    const manual = new Date(2024, 0, 15, 12, 0, 0)  // ⚠️ Mes es 0-indexed!
  
    // Método 5: Desde string local (peligroso)
    const peligroso = new Date("1/15/2024")  // ⚠️ Interpretación varía por navegador
  
    return {
      ahora,
      desdeTimestamp,
      desdeISO,
      manual,
      peligroso
    }
  }

  // 🧭 Navegación temporal
  demonstrateNavigation() {
    const fecha = new Date("2024-01-15T12:00:00.000Z")
  
    // Obtener componentes (getters)
    const componentes = {
      año: fecha.getFullYear(),        // 2024
      mes: fecha.getMonth(),           // 0 (enero, 0-indexed!)
      día: fecha.getDate(),            // 15
      diaSemana: fecha.getDay(),       // 1 (lunes, 0=domingo)
      horas: fecha.getHours(),         // 12 (en zona local)
      minutos: fecha.getMinutes(),     // 0
      timestamp: fecha.getTime()       // 1705320000000
    }
  
    // Versiones UTC (recomendadas para lógica de negocio)
    const componentesUTC = {
      añoUTC: fecha.getUTCFullYear(),  // 2024
      mesUTC: fecha.getUTCMonth(),     // 0
      díaUTC: fecha.getUTCDate(),      // 15
      horasUTC: fecha.getUTCHours()    // 12
    }
  
    return { componentes, componentesUTC }
  }

  // ⚙️ Modificación temporal (mutación)
  demonstrateMutation() {
    const fecha = new Date("2024-01-15T12:00:00.000Z")
  
    // ⚠️ Date es MUTABLE (modifica el objeto original)
    fecha.setDate(20)  // Cambia a día 20
    fecha.setMonth(11) // Cambia a diciembre (mes 11)
    fecha.setFullYear(2025)  // Cambia a 2025
  
    console.log(fecha)  // 2025-12-20T12:00:00.000Z
  
    // 💡 Mejor práctica: crear nueva instancia
    const fechaOriginal = new Date("2024-01-15T12:00:00.000Z")
    const fechaModificada = new Date(fechaOriginal.getTime())
    fechaModificada.setDate(20)
  
    return { fechaOriginal, fechaModificada }
  }
}
```

### 🚨 Trampas Comunes del Date Object

```typescript
class DateTraps {
  // 🪤 Trampa 1: Meses 0-indexed
  monthTrap() {
    // ❌ Esto NO es diciembre!
    const noEsDiciembre = new Date(2024, 12, 25)  // Enero 2025!
  
    // ✅ Diciembre correcto
    const diciembre = new Date(2024, 11, 25)  // Diciembre 2024
  
    return { noEsDiciembre, diciembre }
  }

  // 🪤 Trampa 2: Parsing inconsistente
  parsingTrap() {
    // ❌ Resultados inconsistentes entre navegadores
    const ambigua1 = new Date("1/2/2024")    // ¿1 de febrero o 2 de enero?
    const ambigua2 = new Date("2024-01-02")  // ¿UTC o local?
  
    // ✅ Formatos seguros
    const segura1 = new Date("2024-01-02T00:00:00.000Z")  // UTC explícito
    const segura2 = new Date(2024, 0, 2)  // Constructor explícito
  
    return { ambigua1, ambigua2, segura1, segura2 }
  }

  // 🪤 Trampa 3: Zona horaria implícita
  timezoneTrap() {
    // ❌ Zona horaria del navegador
    const local = new Date("2024-01-15T12:00:00")  // Sin 'Z' = local
  
    // ✅ UTC explícito
    const utc = new Date("2024-01-15T12:00:00Z")
  
    // ✅ Zona específica
    const argentina = new Date("2024-01-15T12:00:00-03:00")
  
    return { local, utc, argentina }
  }
}
```

---

## 🌍 UTC: El Esperanto del Tiempo {#utc-universal}

### 🎯 UTC como Lenguaje Universal

**Analogía**: UTC es como el **inglés en la aviación internacional** - todos los pilotos lo usan sin importar su nacionalidad

```typescript
class UTCMaster {
  // 🌍 El patrón dorado: Store UTC, Display Local
  private eventos: Array<{ id: string; fechaUTC: string; titulo: string }> = []

  // ✅ Almacenar siempre en UTC
  crearEvento(titulo: string, fechaLocal: Date, zonaHoraria: string) {
    // Convertir fecha local a UTC para almacenamiento
    const fechaUTC = new Date(fechaLocal.toISOString())
  
    const evento = {
      id: crypto.randomUUID(),
      fechaUTC: fechaUTC.toISOString(),  // Store in UTC
      titulo,
      metadata: {
        zonaHorariaOriginal: zonaHoraria,
        timestampCreacion: Date.now()
      }
    }
  
    this.eventos.push(evento)
    return evento
  }

  // ✅ Mostrar siempre en zona local del usuario
  obtenerEventos(zonaHorariaUsuario: string) {
    return this.eventos.map(evento => ({
      ...evento,
      fechaLocal: new Date(evento.fechaUTC).toLocaleString("es-AR", {
        timeZone: zonaHorariaUsuario,
        dateStyle: "full",
        timeStyle: "short"
      }),
      fechaRelativa: this.obtenerTiempoRelativo(evento.fechaUTC)
    }))
  }

  // 🕐 Tiempo relativo (muy útil para UX)
  private obtenerTiempoRelativo(fechaUTC: string): string {
    const ahora = new Date()
    const fecha = new Date(fechaUTC)
    const diferencia = ahora.getTime() - fecha.getTime()
  
    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const días = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  
    if (minutos < 1) return "ahora"
    if (minutos < 60) return `hace ${minutos} minutos`
    if (horas < 24) return `hace ${horas} horas`
    if (días < 7) return `hace ${días} días`
  
    return fecha.toLocaleDateString("es-AR")
  }

  // 🔄 Conversiones entre zonas horarias
  convertirZonaHoraria(fechaUTC: string, zonaOrigen: string, zonaDestino: string) {
    const fecha = new Date(fechaUTC)
  
    const enOrigen = fecha.toLocaleString("es-AR", {
      timeZone: zonaOrigen,
      dateStyle: "short",
      timeStyle: "medium"
    })
  
    const enDestino = fecha.toLocaleString("es-AR", {
      timeZone: zonaDestino,
      dateStyle: "short",
      timeStyle: "medium"
    })
  
    return {
      utc: fecha.toISOString(),
      [zonaOrigen]: enOrigen,
      [zonaDestino]: enDestino,
      timestamp: fecha.getTime()
    }
  }
}

// Ejemplo de uso
const eventManager = new UTCMaster()

// Crear evento en Buenos Aires
const eventoBA = eventManager.crearEvento(
  "Reunión de equipo",
  new Date("2024-03-15T14:30:00-03:00"),  // 14:30 Buenos Aires
  "America/Argentina/Buenos_Aires"
)

// Ver eventos desde diferentes zonas horarias
const eventosDesdeBA = eventManager.obtenerEventos("America/Argentina/Buenos_Aires")
const eventosDesdeNY = eventManager.obtenerEventos("America/New_York")
const eventosDesdeTokenio = eventManager.obtenerEventos("Asia/Tokyo")

console.log({
  eventoBA,
  eventosDesdeBA,
  eventosDesdeNY,
  eventosDesdeTokenio
})
```

### 🎪 Casos de Uso Reales con UTC

```typescript
// 🚀 Sistema de reservas globales (ej: Airbnb, Booking)
class ReservasGlobales {
  // ✅ Check-in/Check-out usando UTC + zona horaria local
  crearReserva(
    checkinLocal: string,  // "2024-03-15T15:00:00"
    checkoutLocal: string, // "2024-03-18T11:00:00"
    zonaHorariaPropiedad: string  // "Europe/Madrid"
  ) {
    // Convertir a UTC para almacenamiento
    const checkinUTC = new Date(`${checkinLocal}T00:00:00`).toISOString()
    const checkoutUTC = new Date(`${checkoutLocal}T00:00:00`).toISOString()
  
    return {
      id: crypto.randomUUID(),
      checkin: {
        utc: checkinUTC,
        local: checkinLocal,
        zonaHoraria: zonaHorariaPropiedad
      },
      checkout: {
        utc: checkoutUTC,
        local: checkoutLocal,
        zonaHoraria: zonaHorariaPropiedad
      },
      duracionNoches: this.calcularNoches(checkinUTC, checkoutUTC)
    }
  }

  private calcularNoches(checkinUTC: string, checkoutUTC: string): number {
    const inicio = new Date(checkinUTC)
    const fin = new Date(checkoutUTC)
    const diferencia = fin.getTime() - inicio.getTime()
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24))
  }
}

// 📈 Sistema de trading (mercados financieros)
class TradingSystem {
  // Los mercados tienen horarios específicos por zona horaria
  private mercados = {
    NYSE: { 
      zona: "America/New_York",
      apertura: "09:30",
      cierre: "16:00"
    },
    LSE: {
      zona: "Europe/London", 
      apertura: "08:00",
      cierre: "16:30"
    },
    TSE: {
      zona: "Asia/Tokyo",
      apertura: "09:00", 
      cierre: "15:00"
    }
  }

  esMercadoAbierto(mercado: keyof typeof this.mercados): boolean {
    const config = this.mercados[mercado]
    const ahoraEnMercado = new Date().toLocaleString("en-US", {
      timeZone: config.zona,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit"
    })
  
    const [hora, minutos] = ahoraEnMercado.split(":").map(Number)
    const horaActual = hora * 60 + minutos
  
    const [aperturaH, aperturaM] = config.apertura.split(":").map(Number)
    const [cierreH, cierreM] = config.cierre.split(":").map(Number)
  
    const apertura = aperturaH * 60 + aperturaM
    const cierre = cierreH * 60 + cierreM
  
    return horaActual >= apertura && horaActual <= cierre
  }

  obtenerEstadoMercados() {
    return Object.entries(this.mercados).map(([nombre, config]) => ({
      mercado: nombre,
      abierto: this.esMercadoAbierto(nombre as keyof typeof this.mercados),
      horaLocal: new Date().toLocaleString("es-AR", {
        timeZone: config.zona,
        timeStyle: "short"
      }),
      zona: config.zona
    }))
  }
}
```

---

## 🌏 Zonas Horarias: Los Dialectos Temporales {#zonas-horarias}

### 🗺️ El Mapa Mental de las Zonas Horarias

**Analogía**: Las zonas horarias son como **acentos regionales** - todos hablan el mismo idioma (tiempo), pero con matices locales

```typescript
class TimezoneExpert {
  // 🌍 Identificadores IANA (el estándar de oro)
  private zonasPopulares = {
    // Américas
    "America/Argentina/Buenos_Aires": "Argentina",
    "America/New_York": "USA (East)",
    "America/Los_Angeles": "USA (West)", 
    "America/Chicago": "USA (Central)",
    "America/Sao_Paulo": "Brasil",
    "America/Mexico_City": "México",
  
    // Europa
    "Europe/Madrid": "España",
    "Europe/London": "Reino Unido",
    "Europe/Paris": "Francia", 
    "Europe/Berlin": "Alemania",
    "Europe/Moscow": "Rusia",
  
    // Asia-Pacífico
    "Asia/Tokyo": "Japón",
    "Asia/Shanghai": "China",
    "Asia/Kolkata": "India",
    "Australia/Sydney": "Australia",
  
    // UTC
    "UTC": "Tiempo Universal"
  }

  // 🕰️ Detección automática de zona horaria
  detectarZonaHoraria(): { zona: string; offset: number; nombre: string } {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone
    const fecha = new Date()
    const offset = -fecha.getTimezoneOffset() // en minutos
    const nombre = this.zonasPopulares[zona] || zona
  
    return {
      zona,
      offset: offset / 60, // convertir a horas
      nombre,
      offsetString: this.formatearOffset(offset)
    }
  }

  private formatearOffset(offsetMinutos: number): string {
    const horas = Math.abs(Math.floor(offsetMinutos / 60))
    const minutos = Math.abs(offsetMinutos % 60)
    const signo = offsetMinutos >= 0 ? "+" : "-"
  
    return `UTC${signo}${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`
  }

  // 🌐 Convertidor universal de zonas horarias
  convertirTiempo(
    fecha: Date | string,
    zonaOrigen: string,
    zonaDestino: string
  ) {
    const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha
  
    // Convertir usando Intl.DateTimeFormat (más preciso)
    const formatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone: zonaDestino,
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
  
    const partes = formatter.formatToParts(fechaObj)
    const valores = partes.reduce((acc, parte) => {
      acc[parte.type] = parte.value
      return acc
    }, {} as any)
  
    return {
      original: {
        fecha: fechaObj.toISOString(),
        zona: zonaOrigen
      },
      convertido: {
        fecha: `${valores.year}-${valores.month}-${valores.day}T${valores.hour}:${valores.minute}:${valores.second}`,
        zona: zonaDestino,
        timestamp: fechaObj.getTime()
      },
      diferencia: this.calcularDiferencia(zonaOrigen, zonaDestino, fechaObj)
    }
  }

  private calcularDiferencia(zona1: string, zona2: string, fecha: Date) {
    const fecha1 = new Date(fecha.toLocaleString("sv-SE", { timeZone: zona1 }))
    const fecha2 = new Date(fecha.toLocaleString("sv-SE", { timeZone: zona2 }))
  
    const diferenciaMs = fecha2.getTime() - fecha1.getTime()
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60)
  
    return {
      horas: diferenciaHoras,
      descripcion: diferenciaHoras > 0 
        ? `${zona2} está ${Math.abs(diferenciaHoras)} horas adelante`
        : `${zona2} está ${Math.abs(diferenciaHoras)} horas atrás`
    }
  }

  // ⏰ Planificador de reuniones globales
  planificarReunion(
    fechaHora: string,  // "2024-03-15T14:00:00"
    zonaOrganizador: string,
    participantes: Array<{ nombre: string; zona: string }>
  ) {
    // Crear fecha en zona del organizador
    const fechaBase = new Date(`${fechaHora}${this.getTimezoneOffset(zonaOrganizador)}`)
  
    return {
      organizador: {
        nombre: "Organizador",
        zona: zonaOrganizador,
        hora: fechaBase.toLocaleString("es-AR", {
          timeZone: zonaOrganizador,
          dateStyle: "full",
          timeStyle: "short"
        })
      },
      participantes: participantes.map(participante => ({
        nombre: participante.nombre,
        zona: participante.zona,
        hora: fechaBase.toLocaleString("es-AR", {
          timeZone: participante.zona,
          dateStyle: "full", 
          timeStyle: "short"
        }),
        esHorarioLaboral: this.esHorarioLaboral(fechaBase, participante.zona)
      })),
      utc: fechaBase.toISOString()
    }
  }

  private getTimezoneOffset(zona: string): string {
    // Simplificado - en producción usar librería
    const offsets: { [key: string]: string } = {
      "America/Argentina/Buenos_Aires": "-03:00",
      "America/New_York": "-05:00",
      "Europe/Madrid": "+01:00",
      "Asia/Tokyo": "+09:00"
    }
    return offsets[zona] || "Z"
  }

  private esHorarioLaboral(fecha: Date, zona: string): boolean {
    const horaLocal = new Date(fecha.toLocaleString("sv-SE", { timeZone: zona }))
    const hora = horaLocal.getHours()
    const diaSemana = horaLocal.getDay()
  
    // Lunes a viernes, 9 AM a 6 PM
    return diaSemana >= 1 && diaSemana <= 5 && hora >= 9 && hora <= 18
  }
}

// Ejemplo de uso
const tzExpert = new TimezoneExpert()

// Detectar zona horaria del usuario
const zonaUsuario = tzExpert.detectarZonaHoraria()
console.log("Tu zona horaria:", zonaUsuario)

// Planificar reunión global
const reunion = tzExpert.planificarReunion(
  "2024-03-15T14:00:00",
  "America/Argentina/Buenos_Aires",
  [
    { nombre: "John (NYC)", zona: "America/New_York" },
    { nombre: "Sakura (Tokyo)", zona: "Asia/Tokyo" },
    { nombre: "María (Madrid)", zona: "Europe/Madrid" }
  ]
)

console.log("Planificación de reunión:", reunion)
```

### 🏪 Horario de Comercios por Zona Horaria

```typescript
// 💼 Sistema de horarios comerciales
class BusinessHours {
  private configuraciones = new Map([
    ["America/Argentina/Buenos_Aires", {
      nombre: "Argentina", 
      horarios: { lun: "09:00-18:00", mar: "09:00-18:00", mie: "09:00-18:00", 
                  jue: "09:00-18:00", vie: "09:00-17:00", sab: "10:00-14:00" },
      feriados: ["2024-01-01", "2024-05-01", "2024-12-25"]
    }],
    ["America/New_York", {
      nombre: "USA East",
      horarios: { lun: "08:00-17:00", mar: "08:00-17:00", mie: "08:00-17:00",
                  jue: "08:00-17:00", vie: "08:00-17:00" },
      feriados: ["2024-01-01", "2024-07-04", "2024-12-25"]
    }],
    ["Asia/Tokyo", {
      nombre: "Japón",
      horarios: { lun: "09:00-18:00", mar: "09:00-18:00", mie: "09:00-18:00",
                  jue: "09:00-18:00", vie: "09:00-18:00", sab: "09:00-15:00" },
      feriados: ["2024-01-01", "2024-05-03", "2024-12-23"]
    }]
  ])

  estaAbierto(zona: string, fecha?: Date): { abierto: boolean; motivo: string; proximaApertura?: string } {
    const ahora = fecha || new Date()
    const config = this.configuraciones.get(zona)
  
    if (!config) {
      return { abierto: false, motivo: "Zona no configurada" }
    }

    // Verificar si es feriado
    const fechaStr = ahora.toISOString().split("T")[0]
    if (config.feriados.includes(fechaStr)) {
      return { abierto: false, motivo: "Feriado nacional" }
    }

    // Obtener día y hora en la zona específica
    const fechaLocal = new Date(ahora.toLocaleString("sv-SE", { timeZone: zona }))
    const diaSemana = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"][fechaLocal.getDay()]
    const horaActual = fechaLocal.getHours() * 60 + fechaLocal.getMinutes()

    const horarioDia = config.horarios[diaSemana]
    if (!horarioDia) {
      return { abierto: false, motivo: "Cerrado los " + diaSemana }
    }

    const [apertura, cierre] = horarioDia.split("-")
    const [aperturaH, aperturaM] = apertura.split(":").map(Number)
    const [cierreH, cierreM] = cierre.split(":").map(Number)
  
    const minApertura = aperturaH * 60 + aperturaM
    const minCierre = cierreH * 60 + cierreM

    if (horaActual >= minApertura && horaActual <= minCierre) {
      const minutosParaCierre = minCierre - horaActual
      return { 
        abierto: true, 
        motivo: `Abierto (cierra en ${Math.floor(minutosParaCierre / 60)}h ${minutosParaCierre % 60}m)` 
      }
    }

    // Calcular próxima apertura
    let proximaApertura = new Date(fechaLocal)
    if (horaActual > minCierre) {
      proximaApertura.setDate(proximaApertura.getDate() + 1)
    }
    proximaApertura.setHours(aperturaH, aperturaM, 0, 0)

    return {
      abierto: false,
      motivo: "Fuera de horario",
      proximaApertura: proximaApertura.toLocaleString("es-AR", {
        timeZone: zona,
        dateStyle: "short",
        timeStyle: "short"
      })
    }
  }
}
```

---

## 📚 Librerías Modernas: Herramientas de Precisión {#librerías-modernas}

### 🎯 Date-fns: El Cuchillo Suizo

**Analogía**: Date-fns es como tener una **caja de herramientas especializada** - cada función hace una cosa perfectamente

```typescript
import { 
  format, 
  addDays, 
  subDays, 
  differenceInDays,
  isWeekend,
  startOfWeek,
  endOfWeek,
  zonedTimeToUtc,
  utcToZonedTime
} from 'date-fns'
import { es } from 'date-fns/locale'

class DateFnsExamples {
  // 🎨 Formateo elegante
  formatearFechas() {
    const fecha = new Date("2024-03-15T14:30:00Z")
  
    return {
      iso: format(fecha, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      humano: format(fecha, "PPPP", { locale: es }),          // "viernes, 15 de marzo de 2024"
      corto: format(fecha, "dd/MM/yyyy"),                      // "15/03/2024"
      tiempo: format(fecha, "HH:mm"),                          // "14:30"
      relativo: format(fecha, "'El' do 'de' MMMM", { locale: es }) // "El 15º de marzo"
    }
  }

  // 📅 Manipulación de fechas
  manipularFechas() {
    const hoy = new Date()
  
    return {
      mañana: addDays(hoy, 1),
      ayer: subDays(hoy, 1),
      proximoViernes: addDays(hoy, 5 - hoy.getDay()),
      inicioSemana: startOfWeek(hoy, { weekStartsOn: 1 }), // Lunes
      finSemana: endOfWeek(hoy, { weekStartsOn: 1 }),
      esFinDeSemana: isWeekend(hoy)
    }
  }

  // 🔢 Cálculos de diferencias
  calcularDiferencias() {
    const inicio = new Date("2024-01-01")
    const fin = new Date("2024-12-31")
  
    return {
      díasTranscurridos: differenceInDays(new Date(), inicio),
      díasRestantes: differenceInDays(fin, new Date()),
      duración: differenceInDays(fin, inicio)
    }
  }

  // 🌍 Manejo de zonas horarias con date-fns-tz
  manejarZonasHorarias() {
    const fechaLocal = new Date("2024-03-15T14:30:00")
    const zona = "America/Argentina/Buenos_Aires"
  
    // Convertir fecha local a UTC considerando zona horaria
    const utc = zonedTimeToUtc(fechaLocal, zona)
  
    // Convertir UTC a zona específica
    const enZona = utcToZonedTime(utc, "Asia/Tokyo")
  
    return {
      original: fechaLocal,
      utc: utc,
      enTokyo: enZona,
      formateadoTokyo: format(enZona, "yyyy-MM-dd HH:mm 'JST'")
    }
  }

  // 📊 Generador de rangos de fechas
  generarRangos() {
    const inicio = new Date("2024-01-01")
    const fin = new Date("2024-01-31")
    const rango = []
  
    let fechaActual = inicio
    while (fechaActual <= fin) {
      rango.push({
        fecha: format(fechaActual, "yyyy-MM-dd"),
        diaSemana: format(fechaActual, "EEEE", { locale: es }),
        esLaboral: !isWeekend(fechaActual)
      })
      fechaActual = addDays(fechaActual, 1)
    }
  
    return rango
  }
}
```

### 🌟 Day.js: Ligero y Potente

**Analogía**: Day.js es como un **smartphone** - pequeño, pero hace todo lo que necesitas

```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

// Configurar plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('es')

class DayJsExamples {
  // 🚀 API fluida e intuitiva
  ejemplosBasicos() {
    const ahora = dayjs()
  
    return {
      // Creación
      actual: ahora.format(),
      desde_string: dayjs("2024-03-15").format(),
      desde_timestamp: dayjs(1710504000000).format(),
  
      // Manipulación fluida
      mañana: ahora.add(1, 'day').format('YYYY-MM-DD'),
      proximoMes: ahora.add(1, 'month').format('YYYY-MM-DD'),
      añoPasado: ahora.subtract(1, 'year').format('YYYY-MM-DD'),
  
      // Inicio/fin de períodos
      inicioMes: ahora.startOf('month').format('YYYY-MM-DD'),
      finAño: ahora.endOf('year').format('YYYY-MM-DD'),
  
      // Comparaciones
      esDespues: dayjs("2024-12-25").isAfter(ahora),
      esAntes: dayjs("2024-01-01").isBefore(ahora),
      esMismoMes: dayjs("2024-03-01").isSame(ahora, 'month')
    }
  }

  // 🌍 Zonas horarias simplificadas
  zonasHorarias() {
    const fecha = dayjs("2024-03-15 14:30")
  
    return {
      // Convertir a diferentes zonas
      buenosAires: fecha.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DD HH:mm [ART]"),
      nuevaYork: fecha.tz("America/New_York").format("YYYY-MM-DD HH:mm [EST]"),
      tokio: fecha.tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm [JST]"),
  
      // UTC
      utc: fecha.utc().format("YYYY-MM-DD HH:mm [UTC]"),
  
      // Zona del usuario
      local: fecha.local().format("YYYY-MM-DD HH:mm [LOCAL]")
    }
  }

  // ⏱️ Tiempo relativo
  tiempoRelativo() {
    const ahora = dayjs()
  
    return {
      hace_1_hora: ahora.subtract(1, 'hour').fromNow(),        // "hace una hora"
      en_2_dias: ahora.add(2, 'day').fromNow(),                // "en 2 días"
      hace_1_semana: ahora.subtract(1, 'week').fromNow(),      // "hace una semana"
      diferencia: ahora.subtract(3, 'day').from(ahora)         // "hace 3 días"
    }
  }

  // 📈 Sistema de métricas temporales
  sistemaMetricas() {
    const eventos = [
      { nombre: "Login", timestamp: dayjs().subtract(2, 'hours').valueOf() },
      { nombre: "Purchase", timestamp: dayjs().subtract(30, 'minutes').valueOf() },
      { nombre: "Logout", timestamp: dayjs().subtract(5, 'minutes').valueOf() }
    ]

    return eventos.map(evento => ({
      ...evento,
      fechaFormateada: dayjs(evento.timestamp).format("DD/MM/YYYY HH:mm"),
      tiempoRelativo: dayjs(evento.timestamp).fromNow(),
      duracionSesion: evento.nombre === "Logout" 
        ? dayjs(evento.timestamp).diff(eventos[0].timestamp, 'minute') + " minutos"
        : null
    }))
  }

  // 🎯 Validador de fechas de negocio
  validarFechasNegocio(fecha: string, tipo: 'reunion' | 'entrega' | 'evento') {
    const fechaObj = dayjs(fecha)
    const ahora = dayjs()
  
    const validaciones = {
      esValida: fechaObj.isValid(),
      esFutura: fechaObj.isAfter(ahora),
      esDiaLaboral: ![0, 6].includes(fechaObj.day()), // No domingo ni sábado
      esHorarioLaboral: fechaObj.hour() >= 9 && fechaObj.hour() <= 18,
      noEsMuyLejana: fechaObj.diff(ahora, 'month') <= 6
    }

    const reglas = {
      reunion: ['esValida', 'esFutura', 'esDiaLaboral', 'esHorarioLaboral'],
      entrega: ['esValida', 'esFutura', 'noEsMuyLejana'],
      evento: ['esValida', 'esFutura']
    }

    const reglasAplicables = reglas[tipo]
    const errores = reglasAplicables.filter(regla => !validaciones[regla])

    return {
      valida: errores.length === 0,
      errores,
      detalles: validaciones,
      sugerencia: errores.length > 0 ? this.generarSugerencia(fechaObj, errores) : null
    }
  }

  private generarSugerencia(fecha: dayjs.Dayjs, errores: string[]): string {
    if (errores.includes('esFutura')) {
      return "La fecha debe ser futura"
    }
    if (errores.includes('esDiaLaboral')) {
      const proximoLunes = fecha.day(1).add(fecha.day() > 1 ? 1 : 0, 'week')
      return `Sugerencia: ${proximoLunes.format('DD/MM/YYYY')} (próximo lunes)`
    }
    if (errores.includes('esHorarioLaboral')) {
      const fechaCorregida = fecha.hour(10).minute(0)
      return `Sugerencia: ${fechaCorregida.format('DD/MM/YYYY HH:mm')}`
    }
    return "Revisar fecha proporcionada"
  }
}
```

### 💎 Luxon: El Cadillac de las Fechas

**Analogía**: Luxon es como un **laboratorio de precisión** - máxima exactitud para casos complejos

```typescript
import { DateTime, Duration, Interval } from 'luxon'

class LuxonExamples {
  // 🎯 Creación precisa
  creacionAvanzada() {
    return {
      // Diferentes formas de crear fechas
      ahora: DateTime.now(),
      utc: DateTime.utc(),
      desde_iso: DateTime.fromISO("2024-03-15T14:30:00.000Z"),
      desde_objeto: DateTime.fromObject({
        year: 2024, month: 3, day: 15, hour: 14, minute: 30
      }),
      desde_formato: DateTime.fromFormat("15/03/2024 14:30", "dd/MM/yyyy HH:mm"),
  
      // Con zona horaria específica
      con_zona: DateTime.fromISO("2024-03-15T14:30:00", { zone: "America/Argentina/Buenos_Aires" }),
  
      // Desde timestamp
      desde_timestamp: DateTime.fromMillis(1710504000000)
    }
  }

  // 🌍 Manejo sofisticado de zonas horarias
  zonasHorariasAvanzadas() {
    const fecha = DateTime.fromISO("2024-03-15T14:30:00", { zone: "America/Argentina/Buenos_Aires" })
  
    return {
      // Información de zona horaria
      zonaInfo: {
        nombre: fecha.zoneName,
        offset: fecha.offset,
        offsetString: fecha.offsetNameShort,
        esDST: fecha.isInDST
      },
  
      // Conversiones
      convertido_utc: fecha.toUTC(),
      convertido_tokyo: fecha.setZone("Asia/Tokyo"),
      convertido_madrid: fecha.setZone("Europe/Madrid"),
  
      // Manteniendo hora local
      misma_hora_otro_lugar: fecha.setZone("America/New_York", { keepLocalTime: true }),
  
      // Formateo con zona
      formateado: fecha.toFormat("dd/MM/yyyy HH:mm ZZZZ"),
      iso_con_zona: fecha.toISO(),
      rfc2822: fecha.toRFC2822()
    }
  }

  // ⏱️ Duraciones e intervalos
  duracionesIntervalos() {
    const inicio = DateTime.fromISO("2024-03-15T09:00:00")
    const fin = DateTime.fromISO("2024-03-15T17:30:00")
  
    // Crear intervalo
    const jornada = Interval.fromDateTimes(inicio, fin)
  
    // Duración
    const duracion = Duration.fromObject({ hours: 8, minutes: 30 })
  
    return {
      // Información del intervalo
      intervalo: {
        duracion_total: jornada.length('hours'),
        duracion_formateada: jornada.toDuration().toFormat("h 'horas' m 'minutos'"),
        contiene_mediodia: jornada.contains(DateTime.fromISO("2024-03-15T12:00:00")),
        se_superpone: jornada.overlaps(Interval.fromDateTimes(
          DateTime.fromISO("2024-03-15T16:00:00"),
          DateTime.fromISO("2024-03-15T20:00:00")
        ))
      },
  
      // Operaciones con duración
      duracion_ops: {
        en_horas: duracion.as('hours'),
        en_minutos: duracion.as('minutes'),
        humanizada: duracion.toHuman(),
        iso: duracion.toISO()
      },
  
      // Dividir intervalo
      descansos: jornada.divideEqually(4).map((intervalo, i) => ({
        bloque: i + 1,
        inicio: intervalo.start.toFormat("HH:mm"),
        fin: intervalo.end.toFormat("HH:mm")
      }))
    }
  }

  // 📊 Análisis temporal avanzado
  analisisTemporal() {
    const fechas = [
      "2024-01-15T10:00:00Z",
      "2024-02-20T14:30:00Z", 
      "2024-03-10T09:15:00Z",
      "2024-04-05T16:45:00Z"
    ].map(fecha => DateTime.fromISO(fecha))

    const intervalos = fechas.slice(1).map((fecha, i) => 
      Interval.fromDateTimes(fechas[i], fecha)
    )

    return {
      // Estadísticas
      fecha_mas_temprana: DateTime.min(...fechas),
      fecha_mas_tardia: DateTime.max(...fechas),
  
      // Análisis de intervalos
      intervalo_mas_largo: intervalos.reduce((max, current) => 
        current.length() > max.length() ? current : max
      ),
  
      promedio_dias_entre_fechas: intervalos
        .map(i => i.length('days'))
        .reduce((sum, days) => sum + days, 0) / intervalos.length,
  
      // Distribución por día de semana
      distribucion_dias: fechas.reduce((acc, fecha) => {
        const dia = fecha.toFormat('cccc', { locale: 'es' })
        acc[dia] = (acc[dia] || 0) + 1
        return acc
      }, {} as Record<string, number>),
  
      // Rango total
      rango_total: Interval.fromDateTimes(
        DateTime.min(...fechas),
        DateTime.max(...fechas)
      ).toDuration().toFormat("M 'meses' d 'días'")
    }
  }

  // 🎯 Validador empresarial
  validadorEmpresarial() {
    const politicas = {
      horario_laboral: { inicio: 9, fin: 18 },
      dias_laborales: [1, 2, 3, 4, 5], // Lunes a viernes
      zonas_permitidas: [
        "America/Argentina/Buenos_Aires",
        "America/New_York", 
        "Europe/Madrid"
      ],
      anticipacion_minima: Duration.fromObject({ hours: 24 }),
      anticipacion_maxima: Duration.fromObject({ months: 3 })
    }

    return {
      validarReunion: (fechaISO: string, zona: string) => {
        const fecha = DateTime.fromISO(fechaISO, { zone: zona })
        const ahora = DateTime.now().setZone(zona)
  
        const validaciones = {
          fecha_valida: fecha.isValid,
          zona_permitida: politicas.zonas_permitidas.includes(zona),
          es_futuro: fecha > ahora,
          es_dia_laboral: politicas.dias_laborales.includes(fecha.weekday),
          es_horario_laboral: fecha.hour >= politicas.horario_laboral.inicio && 
                             fecha.hour <= politicas.horario_laboral.fin,
          anticipacion_suficiente: fecha.diff(ahora) >= politicas.anticipacion_minima,
          no_muy_lejano: fecha.diff(ahora) <= politicas.anticipacion_maxima
        }

        const errores = Object.entries(validaciones)
          .filter(([_, valido]) => !valido)
          .map(([error, _]) => error)

        return {
          valida: errores.length === 0,
          errores,
          fecha_normalizada: fecha.toISO(),
          tiempo_hasta_reunion: fecha.diff(ahora).toHuman()
        }
      }
    }
  }
}
```

---

## 🏗️ Casos Reales por Framework {#casos-por-framework}

### ⚡ React.js: Componentes Temporales

```typescript
// 🎯 Hook personalizado para manejo de fechas
import React, { useState, useEffect, useCallback } from 'react'
import { format, differenceInSeconds } from 'date-fns'
import { es } from 'date-fns/locale'

// Hook para tiempo en vivo
const useCurrentTime = (updateInterval = 1000) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, updateInterval)
  
    return () => clearInterval(timer)
  }, [updateInterval])
  
  return currentTime
}

// Hook para countdown
const useCountdown = (targetDate: Date) => {
  const currentTime = useCurrentTime()
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false
  })
  
  useEffect(() => {
    const totalSeconds = differenceInSeconds(targetDate, currentTime)
  
    if (totalSeconds <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
      return
    }
  
    const days = Math.floor(totalSeconds / (3600 * 24))
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
  
    setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
  }, [currentTime, targetDate])
  
  return timeLeft
}

// Hook para zona horaria del usuario
const useUserTimezone = () => {
  const [timezone, setTimezone] = useState(() => 
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  
  const [offset, setOffset] = useState(() => 
    -new Date().getTimezoneOffset() / 60
  )
  
  return { timezone, offset, setTimezone }
}

// Componente de reloj mundial
const WorldClock: React.FC = () => {
  const currentTime = useCurrentTime()
  const { timezone } = useUserTimezone()
  
  const worldZones = [
    { name: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires' },
    { name: 'Nueva York', zone: 'America/New_York' },
    { name: 'Londres', zone: 'Europe/London' },
    { name: 'Tokio', zone: 'Asia/Tokyo' },
    { name: 'Tu zona', zone: timezone }
  ]
  
  return (
    <div className="world-clock">
      <h2>Reloj Mundial</h2>
      <div className="clocks-grid">
        {worldZones.map(({ name, zone }) => (
          <div key={zone} className="clock-item">
            <h3>{name}</h3>
            <div className="time">
              {format(currentTime, 'HH:mm:ss', { 
                timeZone: zone 
              })}
            </div>
            <div className="date">
              {format(currentTime, 'EEEE, dd MMMM', { 
                locale: es,
                timeZone: zone 
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de countdown
const EventCountdown: React.FC<{ eventName: string; eventDate: Date }> = ({ 
  eventName, 
  eventDate 
}) => {
  const countdown = useCountdown(eventDate)
  
  if (countdown.isExpired) {
    return (
      <div className="countdown expired">
        <h3>{eventName}</h3>
        <p>¡El evento ya comenzó!</p>
      </div>
    )
  }
  
  return (
    <div className="countdown active">
      <h3>{eventName}</h3>
      <div className="countdown-display">
        <div className="time-unit">
          <span className="number">{countdown.days}</span>
          <span className="label">días</span>
        </div>
        <div className="time-unit">
          <span className="number">{countdown.hours}</span>
          <span className="label">horas</span>
        </div>
        <div className="time-unit">
          <span className="number">{countdown.minutes}</span>
          <span className="label">min</span>
        </div>
        <div className="time-unit">
          <span className="number">{countdown.seconds}</span>
          <span className="label">seg</span>
        </div>
      </div>
    </div>
  )
}

// Componente selector de fecha inteligente
const SmartDatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedZone, setSelectedZone] = useState('America/Argentina/Buenos_Aires')
  const { timezone: userTimezone } = useUserTimezone()
  
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])
  
  const formatDateInZone = (date: Date, zone: string) => {
    return format(date, "EEEE, dd 'de' MMMM 'a las' HH:mm", {
      locale: es,
      timeZone: zone
    })
  }
  
  return (
    <div className="smart-date-picker">
      <h3>Planificador de Reunión Global</h3>
  
      <div className="date-input">
        <label>Fecha y hora:</label>
        <input 
          type="datetime-local"
          onChange={(e) => handleDateChange(new Date(e.target.value))}
        />
      </div>
  
      <div className="timezone-selector">
        <label>Zona horaria:</label>
        <select 
          value={selectedZone} 
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          <option value="America/Argentina/Buenos_Aires">Buenos Aires</option>
          <option value="America/New_York">Nueva York</option>
          <option value="Europe/Madrid">Madrid</option>
          <option value="Asia/Tokyo">Tokio</option>
        </select>
      </div>
  
      {selectedDate && (
        <div className="date-preview">
          <h4>Vista previa:</h4>
          <div className="zone-times">
            <div>
              <strong>En {selectedZone}:</strong>
              <br />
              {formatDateInZone(selectedDate, selectedZone)}
            </div>
            <div>
              <strong>En tu zona horaria ({userTimezone}):</strong>
              <br />
              {formatDateInZone(selectedDate, userTimezone)}
            </div>
            <div>
              <strong>UTC:</strong>
              <br />
              {selectedDate.toISOString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 🅰️ Angular: Servicios y Pipes Temporales

```typescript
// 🛠️ Servicio de manejo de fechas
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, timer } from 'rxjs'
import { map } from 'rxjs/operators'
import { format, addDays, differenceInMinutes } from 'date-fns'
import { es } from 'date-fns/locale'

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  private currentTime$ = new BehaviorSubject<Date>(new Date())
  private userTimezone: string
  
  constructor() {
    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
    // Actualizar tiempo cada segundo
    timer(0, 1000).subscribe(() => {
      this.currentTime$.next(new Date())
    })
  }
  
  getCurrentTime(): Observable<Date> {
    return this.currentTime$.asObservable()
  }
  
  getTimeInZone(timezone: string): Observable<string> {
    return this.currentTime$.pipe(
      map(date => format(date, 'HH:mm:ss', { timeZone: timezone }))
    )
  }
  
  getUserTimezone(): string {
    return this.userTimezone
  }
  
  setUserTimezone(timezone: string): void {
    this.userTimezone = timezone
  }
  
  formatDateForUser(date: Date, formatString: string = 'PPP'): string {
    return format(date, formatString, { 
      locale: es,
      timeZone: this.userTimezone 
    })
  }
  
  getBusinessHours(date: Date): { isOpen: boolean; nextChange: Date | null } {
    const dayOfWeek = date.getDay()
    const hour = date.getHours()
  
    // Lunes a viernes 9-18
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
    const isBusinessHour = hour >= 9 && hour < 18
    const isOpen = isWeekday && isBusinessHour
  
    let nextChange: Date | null = null
  
    if (isOpen) {
      // Próximo cierre
      nextChange = new Date(date)
      nextChange.setHours(18, 0, 0, 0)
    } else {
      // Próxima apertura
      nextChange = new Date(date)
      if (dayOfWeek === 0) { // Domingo
        nextChange.setDate(nextChange.getDate() + 1)
      } else if (dayOfWeek === 6 || hour >= 18) { // Sábado o después de horario
        nextChange.setDate(nextChange.getDate() + (dayOfWeek === 6 ? 2 : 1))
      }
      nextChange.setHours(9, 0, 0, 0)
    }
  
    return { isOpen, nextChange }
  }
}

// 📅 Pipe personalizado para fechas relativas
import { Pipe, PipeTransform } from '@angular/core'
import { formatDistanceToNow } from 'date-fns'

@Pipe({
  name: 'relativeTime',
  pure: false  // Para que se actualice automáticamente
})
export class RelativeTimePipe implements PipeTransform {
  transform(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
  
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: es 
    })
  }
}

// 🎯 Pipe para formateo de zona horaria
@Pipe({
  name: 'timezone'
})
export class TimezonePipe implements PipeTransform {
  transform(date: Date, timezone: string, formatString: string = 'PPP p'): string {
    return format(date, formatString, { 
      timeZone: timezone,
      locale: es 
    })
  }
}

// 📱 Componente de agenda
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-agenda',
  template: `
    <div class="agenda">
      <h2>Mi Agenda</h2>
  
      <div class="current-time">
        <h3>{{ (dateTimeService.getCurrentTime() | async) | date:'full':'':'es' }}</h3>
        <p>{{ (dateTimeService.getCurrentTime() | async) | relativeTime }}</p>
      </div>
  
      <div class="business-status" [class.open]="businessStatus?.isOpen">
        <span *ngIf="businessStatus?.isOpen; else closed">
          🟢 Oficina abierta
        </span>
        <ng-template #closed>
          🔴 Oficina cerrada
        </ng-template>
        <small *ngIf="businessStatus?.nextChange">
          Próximo cambio: {{ businessStatus.nextChange | relativeTime }}
        </small>
      </div>
  
      <div class="events">
        <h3>Próximos Eventos</h3>
        <div *ngFor="let event of events" class="event-item">
          <h4>{{ event.title }}</h4>
          <p>{{ event.date | timezone:event.timezone }}</p>
          <small>{{ event.date | relativeTime }}</small>
          <div class="timezones">
            <span>BA: {{ event.date | timezone:'America/Argentina/Buenos_Aires':'HH:mm' }}</span>
            <span>NY: {{ event.date | timezone:'America/New_York':'HH:mm' }}</span>
            <span>Madrid: {{ event.date | timezone:'Europe/Madrid':'HH:mm' }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgendaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  businessStatus: { isOpen: boolean; nextChange: Date | null } | null = null
  
  events = [
    {
      title: 'Reunión de equipo',
      date: addDays(new Date(), 1),
      timezone: 'America/Argentina/Buenos_Aires'
    },
    {
      title: 'Llamada con cliente USA',
      date: addDays(new Date(), 2),
      timezone: 'America/New_York'  
    },
    {
      title: 'Demo para Europa',
      date: addDays(new Date(), 3),
      timezone: 'Europe/Madrid'
    }
  ]
  
  constructor(public dateTimeService: DateTimeService) {}
  
  ngOnInit() {
    this.dateTimeService.getCurrentTime()
      .pipe(takeUntil(this.destroy$))
      .subscribe(time => {
        this.businessStatus = this.dateTimeService.getBusinessHours(time)
      })
  }
  
  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
```

### 🟢 Node.js: APIs y Middleware Temporal

```typescript
// 🌍 Middleware de zona horaria
import express from 'express'
import { DateTime } from 'luxon'

interface TimezoneRequest extends express.Request {
  userTimezone?: string
  requestTime?: DateTime
}

const timezoneMiddleware = (req: TimezoneRequest, res: express.Response, next: express.NextFunction) => {
  // Detectar zona horaria desde headers
  const timezone = req.headers['x-timezone'] as string || 
                   req.headers['timezone'] as string ||
                   'UTC'
  
  // Validar zona horaria
  try {
    DateTime.now().setZone(timezone)
    req.userTimezone = timezone
  } catch {
    req.userTimezone = 'UTC'
  }
  
  // Timestamp de la request
  req.requestTime = DateTime.now().setZone(req.userTimezone)
  
  // Headers de respuesta
  res.setHeader('X-Server-Time', DateTime.utc().toISO())
  res.setHeader('X-User-Timezone', req.userTimezone)
  
  next()
}

// 🗓️ Sistema de eventos con zonas horarias
class EventService {
  private events = new Map<string, any>()
  
  async createEvent(eventData: {
    title: string
    startTime: string
    endTime: string
    timezone: string
    attendees: string[]
  }) {
    const startDateTime = DateTime.fromISO(eventData.startTime, { zone: eventData.timezone })
    const endDateTime = DateTime.fromISO(eventData.endTime, { zone: eventData.timezone })
  
    // Validaciones
    if (!startDateTime.isValid || !endDateTime.isValid) {
      throw new Error('Fechas inválidas')
    }
  
    if (startDateTime >= endDateTime) {
      throw new Error('La fecha de inicio debe ser anterior a la de fin')
    }
  
    if (startDateTime < DateTime.now()) {
      throw new Error('No se pueden crear eventos en el pasado')
    }
  
    const event = {
      id: crypto.randomUUID(),
      title: eventData.title,
      startTime: {
        utc: startDateTime.toUTC().toISO(),
        local: startDateTime.toISO(),
        timezone: eventData.timezone
      },
      endTime: {
        utc: endDateTime.toUTC().toISO(), 
        local: endDateTime.toISO(),
        timezone: eventData.timezone
      },
      duration: endDateTime.diff(startDateTime).toFormat("h'h' m'm'"),
      attendees: eventData.attendees,
      createdAt: DateTime.utc().toISO()
    }
  
    this.events.set(event.id, event)
  
    // Programar notificaciones
    await this.scheduleNotifications(event)
  
    return event
  }
  
  async getEventsForUser(userId: string, userTimezone: string) {
    const userEvents = Array.from(this.events.values())
      .filter(event => event.attendees.includes(userId))
      .map(event => ({
        ...event,
        startTimeInUserZone: DateTime.fromISO(event.startTime.utc)
          .setZone(userTimezone)
          .toFormat('dd/MM/yyyy HH:mm'),
        endTimeInUserZone: DateTime.fromISO(event.endTime.utc)
          .setZone(userTimezone)
          .toFormat('dd/MM/yyyy HH:mm'),
        isToday: DateTime.fromISO(event.startTime.utc)
          .setZone(userTimezone)
          .hasSame(DateTime.now().setZone(userTimezone), 'day'),
        minutesUntilStart: Math.max(0, DateTime.fromISO(event.startTime.utc)
          .diff(DateTime.now(), 'minutes').minutes)
      }))
      .sort((a, b) => a.startTime.utc.localeCompare(b.startTime.utc))
  
    return userEvents
  }
  
  private async scheduleNotifications(event: any) {
    const notificationTimes = [
      { minutes: 15, message: 'Tu reunión comienza en 15 minutos' },
      { minutes: 5, message: 'Tu reunión comienza en 5 minutos' },
      { minutes: 0, message: 'Tu reunión está comenzando' }
    ]
  
    for (const notification of notificationTimes) {
      const notificationTime = DateTime.fromISO(event.startTime.utc)
        .minus({ minutes: notification.minutes })
  
      const delay = notificationTime.diff(DateTime.now()).milliseconds
  
      if (delay > 0) {
        setTimeout(() => {
          console.log(`📅 Notificación: ${notification.message} - ${event.title}`)
          // Aquí integrarías con tu sistema de notificaciones
        }, delay)
      }
    }
  }
}

// 📊 API de reportes temporales
class ReportsController {
  private eventService = new EventService()
  
  async getTimeReport(req: TimezoneRequest, res: express.Response) {
    const { period = '7d', timezone = req.userTimezone } = req.query
  
    const endDate = DateTime.now().setZone(timezone!)
    let startDate: DateTime
  
    switch (period) {
      case '24h':
        startDate = endDate.minus({ days: 1 })
        break
      case '7d':
        startDate = endDate.minus({ days: 7 })
        break
      case '30d':
        startDate = endDate.minus({ days: 30 })
        break
      default:
        return res.status(400).json({ error: 'Período inválido' })
    }
  
    // Generar datos del reporte
    const report = {
      period: {
        start: startDate.toISO(),
        end: endDate.toISO(),
        timezone: timezone,
        durationDays: endDate.diff(startDate, 'days').days
      },
      currentTime: {
        utc: DateTime.utc().toISO(),
        userTimezone: endDate.toISO(),
        timestamp: Date.now()
      },
      businessHours: this.calculateBusinessHours(startDate, endDate),
      summary: {
        totalHours: endDate.diff(startDate, 'hours').hours,
        businessHours: this.getBusinessHoursInPeriod(startDate, endDate),
        weekends: this.getWeekendsInPeriod(startDate, endDate)
      }
    }
  
    res.json(report)
  }
  
  private calculateBusinessHours(start: DateTime, end: DateTime): number {
    let current = start.startOf('day')
    let businessHours = 0
  
    while (current < end) {
      if (current.weekday <= 5) { // Lunes a viernes
        const dayStart = current.set({ hour: 9, minute: 0 })
        const dayEnd = current.set({ hour: 18, minute: 0 })
  
        if (dayEnd > start && dayStart < end) {
          const effectiveStart = DateTime.max(dayStart, start)
          const effectiveEnd = DateTime.min(dayEnd, end)
          businessHours += effectiveEnd.diff(effectiveStart, 'hours').hours
        }
      }
      current = current.plus({ days: 1 })
    }
  
    return businessHours
  }
  
  private getBusinessHoursInPeriod(start: DateTime, end: DateTime): number {
    return this.calculateBusinessHours(start, end)
  }
  
  private getWeekendsInPeriod(start: DateTime, end: DateTime): number {
    let weekends = 0
    let current = start.startOf('day')
  
    while (current < end) {
      if (current.weekday >= 6) { // Sábado o domingo
        weekends++
      }
      current = current.plus({ days: 1 })
    }
  
    return weekends
  }
}

// 🚀 Setup de la aplicación
const app = express()

app.use(express.json())
app.use(timezoneMiddleware)

const eventService = new EventService()
const reportsController = new ReportsController()

// Rutas
app.post('/api/events', async (req: TimezoneRequest, res) => {
  try {
    const event = await eventService.createEvent(req.body)
    res.status(201).json(event)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/events', async (req: TimezoneRequest, res) => {
  const { userId } = req.query
  const events = await eventService.getEventsForUser(
    userId as string, 
    req.userTimezone!
  )
  res.json(events)
})

app.get('/api/reports/time', reportsController.getTimeReport.bind(reportsController))

app.listen(3000, () => {
  console.log('🕰️ Servidor temporal ejecutándose en puerto 3000')
})
```

### 🏠 NestJS: Arquitectura Empresarial Temporal

```typescript
// 🛡️ Decorator personalizado para zona horaria
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserTimezone = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest()
    return request.headers['x-timezone'] || 
           request.headers['timezone'] || 
           request.query.timezone || 
           'UTC'
  }
)

// ⏰ Servicio de fecha y hora
import { Injectable, Logger } from '@nestjs/common'
import { DateTime, Duration } from 'luxon'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class DateTimeService {
  private readonly logger = new Logger(DateTimeService.name)
  
  // 🌍 Convertir entre zonas horarias
  convertTimezone(date: string | Date, fromZone: string, toZone: string): {
    original: string
    converted: string
    offset: number
  } {
    const dateTime = DateTime.fromJSDate(
      typeof date === 'string' ? new Date(date) : date
    ).setZone(fromZone)
  
    const converted = dateTime.setZone(toZone)
  
    return {
      original: dateTime.toISO()!,
      converted: converted.toISO()!,
      offset: converted.offset - dateTime.offset
    }
  }
  
  // 📅 Validar fecha de negocio
  validateBusinessDate(date: string, timezone: string): {
    valid: boolean
    errors: string[]
    suggestions?: string[]
  } {
    const dateTime = DateTime.fromISO(date, { zone: timezone })
    const now = DateTime.now().setZone(timezone)
    const errors: string[] = []
    const suggestions: string[] = []
  
    if (!dateTime.isValid) {
      errors.push('Fecha inválida')
      return { valid: false, errors }
    }
  
    if (dateTime <= now) {
      errors.push('La fecha debe ser futura')
      suggestions.push(`Prueba con: ${now.plus({ hours: 1 }).toFormat('yyyy-MM-dd HH:mm')}`)
    }
  
    if (dateTime.weekday > 5) { // Sábado o domingo
      errors.push('Solo días laborales')
      const nextMonday = dateTime.plus({ days: 8 - dateTime.weekday }).set({ hour: 9, minute: 0 })
      suggestions.push(`Próximo lunes: ${nextMonday.toFormat('yyyy-MM-dd HH:mm')}`)
    }
  
    if (dateTime.hour < 9 || dateTime.hour >= 18) {
      errors.push('Fuera de horario laboral (9-18)')
      const corrected = dateTime.set({ hour: 10, minute: 0 })
      suggestions.push(`Horario sugerido: ${corrected.toFormat('yyyy-MM-dd HH:mm')}`)
    }
  
    if (dateTime.diff(now, 'months').months > 6) {
      errors.push('Fecha muy lejana (máximo 6 meses)')
    }
  
    return {
      valid: errors.length === 0,
      errors,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    }
  }
  
  // ⏱️ Calcular duración de trabajo
  calculateWorkingHours(start: string, end: string, timezone: string): {
    totalHours: number
    businessHours: number
    overtimeHours: number
    breakdown: Array<{ date: string; hours: number; type: 'business' | 'overtime' }>
  } {
    const startTime = DateTime.fromISO(start, { zone: timezone })
    const endTime = DateTime.fromISO(end, { zone: timezone })
  
    const totalHours = endTime.diff(startTime, 'hours').hours
    let businessHours = 0
    let overtimeHours = 0
    const breakdown: Array<{ date: string; hours: number; type: 'business' | 'overtime' }> = []
  
    let current = startTime
    while (current < endTime) {
      const dayEnd = current.endOf('day')
      const periodEnd = DateTime.min(dayEnd, endTime)
  
      if (current.weekday <= 5) { // Día laboral
        const businessStart = current.set({ hour: 9, minute: 0 })
        const businessEnd = current.set({ hour: 18, minute: 0 })
  
        // Horas de negocio
        if (current < businessEnd && periodEnd > businessStart) {
          const effectiveStart = DateTime.max(current, businessStart)
          const effectiveEnd = DateTime.min(periodEnd, businessEnd)
          const hours = effectiveEnd.diff(effectiveStart, 'hours').hours
    
          if (hours > 0) {
            businessHours += hours
            breakdown.push({
              date: current.toFormat('yyyy-MM-dd'),
              hours,
              type: 'business'
            })
          }
        }
  
        // Horas extra
        const beforeBusiness = current < businessStart ? 
          DateTime.min(periodEnd, businessStart).diff(current, 'hours').hours : 0
        const afterBusiness = periodEnd > businessEnd ? 
          periodEnd.diff(DateTime.max(current, businessEnd), 'hours').hours : 0
  
        const overtime = beforeBusiness + afterBusiness
        if (overtime > 0) {
          overtimeHours += overtime
          breakdown.push({
            date: current.toFormat('yyyy-MM-dd'),
            hours: overtime,
            type: 'overtime'
          })
        }
      } else {
        // Fin de semana (todo overtime)
        const hours = periodEnd.diff(current, 'hours').hours
        if (hours > 0) {
          overtimeHours += hours
          breakdown.push({
            date: current.toFormat('yyyy-MM-dd'),
            hours,
            type: 'overtime'
          })
        }
      }
  
      current = current.plus({ days: 1 }).startOf('day')
    }
  
    return { totalHours, businessHours, overtimeHours, breakdown }
  }
  
  // 🔄 Tarea programada para limpiar datos antiguos
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldData() {
    this.logger.log('Ejecutando limpieza de datos antiguos...')
    const cutoffDate = DateTime.now().minus({ months: 12 })
    this.logger.log(`Eliminando datos anteriores a: ${cutoffDate.toISO()}`)
    // Aquí iría la lógica de limpieza
  }
  
  // 📊 Tarea para generar reportes diarios
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async generateDailyReports() {
    this.logger.log('Generando reportes diarios...')
    const yesterday = DateTime.now().minus({ days: 1 })
    this.logger.log(`Procesando datos del: ${yesterday.toFormat('yyyy-MM-dd')}`)
    // Aquí iría la lógica de generación de reportes
  }
}

// 🎯 Controlador de eventos
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common'

@Controller('events')
export class EventsController {
  constructor(private readonly dateTimeService: DateTimeService) {}
  
  @Post()
  async createEvent(
    @Body() createEventDto: any,
    @UserTimezone() timezone: string
  ) {
    // Validar fecha
    const validation = this.dateTimeService.validateBusinessDate(
      createEventDto.startTime,
      timezone
    )
  
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
        suggestions: validation.suggestions
      }
    }
  
    // Convertir a UTC para almacenamiento
    const converted = this.dateTimeService.convertTimezone(
      createEventDto.startTime,
      timezone,
      'UTC'
    )
  
    // Aquí iría la lógica de creación del evento
    return {
      success: true,
      event: {
        ...createEventDto,
        startTimeUTC: converted.converted,
        originalTimezone: timezone
      }
    }
  }
  
  @Get('working-hours/:userId')
  async getWorkingHours(
    @Param('userId') userId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @UserTimezone() timezone: string
  ) {
    const workingHours = this.dateTimeService.calculateWorkingHours(
      start,
      end,
      timezone
    )
  
    return {
      userId,
      period: { start, end, timezone },
      ...workingHours
    }
  }
  
  @Get('timezone-info')
  async getTimezoneInfo(@UserTimezone() timezone: string) {
    const now = DateTime.now().setZone(timezone)
  
    return {
      timezone,
      currentTime: now.toISO(),
      offset: now.offsetNameShort,
      isDST: now.isInDST,
      businessHours: {
        isOpen: now.weekday <= 5 && now.hour >= 9 && now.hour < 18,
        nextBusinessDay: now.weekday >= 5 ? 
          now.plus({ days: 8 - now.weekday }).set({ hour: 9 }) :
          now.hour >= 18 ?
            now.plus({ days: 1 }).set({ hour: 9 }) :
            now.set({ hour: 9 })
      }
    }
  }
}

// 🏭 Module principal
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [EventsController],
  providers: [DateTimeService],
  exports: [DateTimeService]
})
export class DateTimeModule {}
```

---

## ⚠️ Patrones y Anti-patrones {#patrones-antipatrones}

### ✅ Patrones Recomendados

```typescript
// 🎯 Patrón 1: Store UTC, Display Local
class EventManagerPattern {
  // ✅ CORRECTO: Almacenar en UTC
  private storeEvent(event: { title: string; dateTime: Date; timezone: string }) {
    return {
      id: crypto.randomUUID(),
      title: event.title,
      dateTimeUTC: event.dateTime.toISOString(),  // UTC para DB
      originalTimezone: event.timezone,
      createdAt: new Date().toISOString()
    }
  }
  
  // ✅ CORRECTO: Mostrar en zona del usuario
  private displayEvent(storedEvent: any, userTimezone: string) {
    const eventDate = new Date(storedEvent.dateTimeUTC)
  
    return {
      ...storedEvent,
      displayTime: eventDate.toLocaleString('es-AR', {
        timeZone: userTimezone,
        dateStyle: 'full',
        timeStyle: 'short'
      }),
      isToday: this.isSameDay(eventDate, new Date(), userTimezone),
      timeUntil: this.getTimeUntil(eventDate)
    }
  }
  
  private isSameDay(date1: Date, date2: Date, timezone: string): boolean {
    const d1 = new Date(date1.toLocaleString('sv-SE', { timeZone: timezone }))
    const d2 = new Date(date2.toLocaleString('sv-SE', { timeZone: timezone }))
  
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }
  
  private getTimeUntil(date: Date): string {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
  
    if (diff < 0) return 'Pasado'
  
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
  
    if (days > 0) return `En ${days} días`
    if (hours > 0) return `En ${hours} horas`
    return `En ${minutes} minutos`
  }
}

// 🎯 Patrón 2: Validation Pipeline
class DateValidationPattern {
  private validators = [
    this.validateFormat,
    this.validateFuture,
    this.validateBusinessHours,
    this.validateTimezone
  ]
  
  validateDate(dateString: string, timezone: string): ValidationResult {
    const context = { dateString, timezone, errors: [], warnings: [] }
  
    for (const validator of this.validators) {
      validator.call(this, context)
      if (context.errors.length > 0) break  // Fail fast
    }
  
    return {
      valid: context.errors.length === 0,
      errors: context.errors,
      warnings: context.warnings,
      normalizedDate: context.normalizedDate
    }
  }
  
  private validateFormat(context: ValidationContext): void {
    try {
      const date = new Date(context.dateString)
      if (isNaN(date.getTime())) {
        context.errors.push('Formato de fecha inválido')
        return
      }
      context.normalizedDate = date
    } catch {
      context.errors.push('Error al parsear fecha')
    }
  }
  
  private validateFuture(context: ValidationContext): void {
    if (!context.normalizedDate) return
  
    if (context.normalizedDate <= new Date()) {
      context.errors.push('La fecha debe ser futura')
    }
  }
  
  private validateBusinessHours(context: ValidationContext): void {
    if (!context.normalizedDate) return
  
    const dateInTimezone = new Date(
      context.normalizedDate.toLocaleString('sv-SE', { 
        timeZone: context.timezone 
      })
    )
  
    const hour = dateInTimezone.getHours()
    const day = dateInTimezone.getDay()
  
    if (day === 0 || day === 6) {
      context.warnings.push('Fecha en fin de semana')
    }
  
    if (hour < 9 || hour >= 18) {
      context.warnings.push('Fuera de horario laboral')
    }
  }
  
  private validateTimezone(context: ValidationContext): void {
    try {
      new Date().toLocaleString('en-US', { timeZone: context.timezone })
    } catch {
      context.errors.push('Zona horaria inválida')
    }
  }
}

// 🎯 Patrón 3: Immutable Date Operations
class ImmutableDatePattern {
  // ✅ CORRECTO: Operaciones inmutables
  addDays(date: Date, days: number): Date {
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() + days)
    return newDate
  }
  
  setTime(date: Date, hours: number, minutes: number = 0): Date {
    const newDate = new Date(date.getTime())
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }
  
  startOfDay(date: Date): Date {
    const newDate = new Date(date.getTime())
    newDate.setHours(0, 0, 0, 0)
    return newDate
  }
  
  endOfDay(date: Date): Date {
    const newDate = new Date(date.getTime())
    newDate.setHours(23, 59, 59, 999)
    return newDate
  }
  
  // 🔄 Fluent API
  createDateBuilder(date: Date) {
    return new DateBuilder(date)
  }
}

class DateBuilder {
  constructor(private date: Date) {}
  
  addDays(days: number): DateBuilder {
    const newDate = new Date(this.date.getTime())
    newDate.setDate(newDate.getDate() + days)
    return new DateBuilder(newDate)
  }
  
  setHour(hour: number): DateBuilder {
    const newDate = new Date(this.date.getTime())
    newDate.setHours(hour, 0, 0, 0)
    return new DateBuilder(newDate)
  }
  
  toTimezone(timezone: string): string {
    return this.date.toLocaleString('sv-SE', { timeZone: timezone })
  }
  
  build(): Date {
    return new Date(this.date.getTime())
  }
}
```

### ❌ Anti-patrones a Evitar

```typescript
// 🚨 Anti-patrón 1: Mutación de fechas
class BadDateMutation {
  // ❌ MALO: Modifica el objeto original
  addDaysBad(date: Date, days: number): Date {
    date.setDate(date.getDate() + days)  // ¡Mutación!
    return date
  }
  
  // ❌ MALO: Efectos secundarios inesperados
  processEvents(events: Array<{ date: Date; title: string }>) {
    return events.map(event => ({
      ...event,
      date: this.addDaysBad(event.date, 1)  // ¡Modifica el array original!
    }))
  }
}

// 🚨 Anti-patrón 2: Parsing inseguro
class BadDateParsing {
  // ❌ MALO: Parsing ambiguo
  parseUserDate(dateString: string): Date {
    return new Date(dateString)  // ¡Inconsistente entre navegadores!
  }
  
  // ❌ MALO: Sin validación
  createEvent(dateStr: string) {
    const date = new Date(dateStr)
    // No verifica si es válida
    return { date, valid: true }
  }
  
  // ❌ MALO: Asume zona horaria
  getEventTime(dateStr: string) {
    const date = new Date(dateStr)
    return date.getHours()  // ¿En qué zona horaria?
  }
}

// 🚨 Anti-patrón 3: Zona horaria hardcodeada
class BadTimezoneHandling {
  // ❌ MALO: Hardcodear zona horaria
  formatForArgentina(date: Date): string {
    const offset = -3  // ¡Asume offset fijo!
    const argDate = new Date(date.getTime() + (offset * 60 * 60 * 1000))
    return argDate.toISOString()
  }
  
  // ❌ MALO: Solo considera una zona
  isBusinessHours(date: Date): boolean {
    const hour = date.getHours()  // ¿Zona horaria del servidor?
    return hour >= 9 && hour <= 18
  }
  
  // ❌ MALO: Conversión manual incorrecta
  convertToUserTime(utcDate: Date, userOffset: number): Date {
    // Ignora DST, cambios de horario, etc.
    return new Date(utcDate.getTime() + (userOffset * 60 * 60 * 1000))
  }
}

// 🚨 Anti-patrón 4: Formato dependiente del navegador
class BadDateFormatting {
  // ❌ MALO: toString() sin parámetros
  displayDate(date: Date): string {
    return date.toString()  // ¡Formato inconsistente!
  }
  
  // ❌ MALO: toLocaleDateString() sin configuración
  showDate(date: Date): string {
    return date.toLocaleDateString()  // ¡Depende del navegador!
  }
  
  // ❌ MALO: Concatenación manual
  formatDateTime(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    // ¡No considera padding, zona horaria, etc.!
  }
}

// 🚨 Anti-patrón 5: Comparaciones incorrectas
class BadDateComparison {
  // ❌ MALO: Comparar strings directamente
  isDateAfter(date1: string, date2: string): boolean {
    return date1 > date2  // ¡Solo funciona con ISO!
  }
  
  // ❌ MALO: No considerar precisión
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime()  // ¡Muy específico!
  }
  
  // ❌ MALO: Comparar con zona horaria mixta
  isEventToday(eventUTC: string): boolean {
    const eventDate = new Date(eventUTC)
    const today = new Date()
    return eventDate.getDate() === today.getDate()  // ¡Zonas diferentes!
  }
}
```
