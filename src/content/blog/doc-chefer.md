---
title: 'Registro GPS en segundo plano — diagnóstico, diseño y plan de implementación'
code: 'desarollo'
description: 'diagnóstico, diseño y plan de implementación'
pubDate: 'Nov 3 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---



# Registro GPS en segundo plano — diagnóstico, diseño y plan de implementación

**Proyecto:** `als_wm_app_mobile` (Waste-Management / WAIOT Driver)
**Stack relevante:** Expo SDK 51, React Native 0.74.2, `expo-location@17.0.1`, `expo-task-manager@11.8.2`
**Fecha:** 2026-11-03
**Estado:** solución app-side implementada; validación final en dispositivos nativos pendiente. Las secciones de diseño y los fragmentos de código explican la solución y pueden no coincidir textualmente con el código final.

---

## Índice

- [1. Resumen ejecutivo](#1-resumen-ejecutivo)
- [2. Alcance y fuentes revisadas](#2-alcance-y-fuentes-revisadas)
- [3. Cómo funciona hoy](#3-cómo-funciona-hoy)
  - [3.1 Flujo actual](#31-flujo-actual)
  - [3.2 Suspender, abortar y finalizar](#32-suspender-abortar-y-finalizar)
- [4. Por qué se pierden los puntos](#4-por-qué-se-pierden-los-puntos)
  - [4.1 iOS](#41-ios)
  - [4.2 Android](#42-android)
  - [4.3 Pérdida de datos en ambos sistemas](#43-pérdida-de-datos-en-ambos-sistemas)
- [5. Casos de la vida real](#5-casos-de-la-vida-real)
  - [Caso 1 — El chofer bloquea el teléfono en el soporte](#caso-1--el-chofer-bloquea-el-teléfono-en-el-soporte)
  - [Caso 2 — Usa Waze o Google Maps en paralelo](#caso-2--usa-waze-o-google-maps-en-paralelo)
  - [Caso 3 — Ruta de 6 horas con zonas sin señal](#caso-3--ruta-de-6-horas-con-zonas-sin-señal)
  - [Caso 4 — Suspende la ruta para almorzar](#caso-4--suspende-la-ruta-para-almorzar)
  - [Caso 5 — Termina la ruta y cierra la app](#caso-5--termina-la-ruta-y-cierra-la-app)
  - [Caso 6 — Reinicio del teléfono o batería agotada](#caso-6--reinicio-del-teléfono-o-batería-agotada)
  - [Caso 7 — Dos rutas el mismo día y la primera quedó sin subir](#caso-7--dos-rutas-el-mismo-día-y-la-primera-quedó-sin-subir)
  - [Caso 8 — Vehículo detenido en un atasco o en una parada larga](#caso-8--vehículo-detenido-en-un-atasco-o-en-una-parada-larga)
  - [Caso 9 — Xiaomi / Samsung con ahorro de batería agresivo](#caso-9--xiaomi--samsung-con-ahorro-de-batería-agresivo)
  - [Caso 10 — Permiso “Solo mientras uso la app”](#caso-10--permiso-solo-mientras-uso-la-app)
- [6. Qué acierta y qué no la observación original](#6-qué-acierta-y-qué-no-la-observación-original)
- [7. Diseño propuesto](#7-diseño-propuesto)
  - [7.1 Principios](#71-principios)
  - [7.2 Configuración nativa](#72-configuración-nativa)
  - [7.3 Modelo de datos del buffer](#73-modelo-de-datos-del-buffer)
  - [7.4 Tarea de background](#74-tarea-de-background)
  - [7.5 Controlador de start/stop](#75-controlador-de-startstop)
  - [7.6 Flush: cuándo y cómo](#76-flush-cuándo-y-cómo)
  - [7.7 Ciclo de vida y máquina de estados](#77-ciclo-de-vida-y-máquina-de-estados)
  - [7.8 Integración en pantallas](#78-integración-en-pantallas)
  - [7.9 UI del mapa](#79-ui-del-mapa)
  - [7.10 Autenticación y identidad del dispositivo](#710-autenticación-y-identidad-del-dispositivo)
  - [7.11 Permisos](#711-permisos)
- [8. Garantías, errores y límites](#8-garantías-errores-y-límites)
  - [8.1 At-least-once, no exactly-once](#81-at-least-once-no-exactly-once)
  - [8.2 Reintentos y backoff](#82-reintentos-y-backoff)
  - [8.3 Reloj y zonas horarias](#83-reloj-y-zonas-horarias)
  - [8.4 Precisión y filtros](#84-precisión-y-filtros)
  - [8.5 Batería](#85-batería)
  - [8.6 Almacenamiento](#86-almacenamiento)
- [9. Cambios por archivo](#9-cambios-por-archivo)
- [10. Backend](#10-backend)
- [11. Pruebas](#11-pruebas)
  - [11.1 Unitarias](#111-unitarias)
  - [11.2 Integración](#112-integración)
  - [11.3 Matriz manual (dispositivos reales)](#113-matriz-manual-dispositivos-reales)
- [12. Despliegue](#12-despliegue)
  - [Métricas sugeridas](#métricas-sugeridas)
- [13. Riesgos y limitaciones](#13-riesgos-y-limitaciones)
- [14. Decisiones abiertas](#14-decisiones-abiertas)
- [15. Checklist de implementación](#15-checklist-de-implementación)
- [16. Anexo: cómo verificar rápido que el fix funciona](#16-anexo-cómo-verificar-rápido-que-el-fix-funciona)
- [17. Glosario técnico ampliado](#17-glosario-técnico-ampliado)
  - [17.1 Ubicación, GPS y muestreo](#171-ubicación-gps-y-muestreo)
  - [17.2 iOS](#172-ios)
  - [17.3 Android](#173-android)
  - [17.4 Ejecución en background y tareas](#174-ejecución-en-background-y-tareas)
  - [17.5 Persistencia, estado y buffer](#175-persistencia-estado-y-buffer)
  - [17.6 Red, APIs y sistemas distribuidos](#176-red-apis-y-sistemas-distribuidos)
  - [17.7 Expo, build y despliegue](#177-expo-build-y-despliegue)
  - [17.8 Seguridad, identidad y privacidad](#178-seguridad-identidad-y-privacidad)
  - [17.9 Términos propios de este proyecto](#179-términos-propios-de-este-proyecto)
  - [17.10 Acrónimos y siglas](#1710-acrónimos-y-siglas)

### Ruta de lectura recomendada

- **Solo quiero entender el problema:** §3, §4 y §5.
- **Voy a implementar el fix:** §7, §9 y §15.
- **Necesito decidir alcance o prioridades:** §6, §10 y §14.
- **Busco vocabulario o contexto técnico:** §17.
- **Voy a probar o desplegar:** §11 y §12.

---

## 1. Resumen ejecutivo

El problema reportado —“al iniciar una ruta y bloquear la pantalla, poner la app en background o suspender la ruta no se toman los puntos GPS”— tiene una causa principal real: **el muestreo corre con `Location.watchPositionAsync`, un watcher de JavaScript atado al ciclo de vida de la pantalla `RouteNavigation`**. Cuando el sistema suspende el runtime de JS, el watcher deja de recibir posiciones. En iOS esto es determinista, no una sospecha: expo-location crea ese `CLLocationManager` con `allowsBackgroundLocationUpdates = NO` (`node_modules/expo-location/ios/EXLocation/EXLocation.m:505`). En Android el proceso puede seguir vivo un rato, pero sin un foreground service el sistema lo congela o lo mata, y los fabricantes con ahorro de batería agresivo lo matan antes.

La solución correcta es mover el muestreo a una **tarea de background con `expo-task-manager`**, persistir las muestras en **AsyncStorage** con contexto por ruta, y enviarlas de forma **at-least-once** con flush en eventos de ciclo de vida. `expo-task-manager` ya está instalado pero nunca se usa.

Ahora bien: **la observación original no se puede aplicar tal cual**. Tiene tres afirmaciones incorrectas para este repo y omite varios riesgos que harían fallar la implementación:

1. “Suspender la ruta desmonta la pantalla”: no la desmonta en ese momento. `suspendConfirm` navega a `RouteEnd` y recién ~5 segundos después `RouteEnd` redirige a `RouteCollect`. Mientras tanto el watcher actual sigue muestreando una ruta ya suspendida. Además, “detener solo en `endRoute`” dejaría el GPS y el foreground service activos después de suspender o abortar.
2. “Llamar `startTracking` al iniciar la ruta, no en `useEffect` de `RouteNavigation`”: hay 4–5 puntos de entrada distintos; el mount de `RouteNavigation` es el único choke point confiable, siempre que se haga con guard de idempotencia.
3. “`locationReport({ ...ctx, samples })`”: la firma real es posicional (`Service.ts:583-599`) y los nombres de contexto no coinciden.

Y faltan, entre otros: buffer único que contamina rutas, flush concurrente que duplica, pérdida del trazo del mapa, token no persistido para el headless task, `FOREGROUND_SERVICE_LOCATION` ausente, y `runtimeVersion` sin bumpear.

El resultado esperado del rediseño:

- El vehículo sigue registrando posiciones con la pantalla bloqueada, la app en background o el teléfono en el bolsillo.
- Si no hay red, las muestras quedan en disco y se envían después, sin perderlas al cerrar o matar la app.
- Suspender, abortar y finalizar detienen el registro de forma explícita y hacen flush.
- Reanudar vuelve a iniciar el tracking sin duplicar watchers.
- El mapa sigue mostrando el trazo en foreground, pero ese trazo ya no es la fuente de verdad del envío.
- El backend recibe lotes idempotentes y el informe de ruta no muestra huecos inexplicables.

---

## 2. Alcance y fuentes revisadas

Archivos principales:

| Archivo | Qué contiene hoy |
|---|---|
| `source/src/screens/RouteNavigation.tsx` | Watcher de muestreo + watcher de UI + `Report()` + suspend/abort |
| `source/src/components/MapViewerNavigation.tsx` | `endRoute()` y dibujo del trazo con `positionSamples` |
| `source/src/redux/slices/positionSamplesSlice.ts` | Muestras en memoria (`positionSamples` y `drawnSamples`) |
| `source/src/redux/middleware/middleware.ts` | Envío con reintentos y cola offline |
| `source/src/redux/slices/offlineSlice.ts` | Cola offline en memoria, sin persistencia |
| `source/src/services/Service.ts` | `locationReport()` y endpoints de ruta |
| `source/src/shared/axios-instance.ts` | Token en memoria + restauración desde Keychain |
| `source/src/redux/actions/loginAction.ts` / `loginQRAction.ts` | Persistencia del token |
| `source/app.config.ts` | Config nativa (sin plugin de `expo-location`) |
| `source/index.ts` / `source/App.tsx` | Entry point y ciclo de red |
| `source/.easignore`, `.gitignore` | `android/` e `ios/` no se versionan; EAS prebuilds |

Versiones instaladas: `expo ^51.0.38`, `expo-location ~17.0.1`, `expo-task-manager ~11.8.2`, `react-native 0.74.2`.

---

## 3. Cómo funciona hoy

### 3.1 Flujo actual

```
RouteNavigation (mount)
│
├── Watcher A — muestreo
│     Location.watchPositionAsync({ accuracy: Highest, timeInterval: 10000, distanceInterval: 0 })
│     ├── sample si speed > 0.1 m/s
│     ├── primer sample si el vehículo está detenido
│     ├── sample si se movió > 50 m desde el último
│     └── cada 180 s: Report() si hay muestras
│
├── Watcher B — solo UI
│     Location.watchPositionAsync({ accuracy: Balanced, timeInterval: 2000, distanceInterval: 5 })
│     └── setLocationNew(location) para el mapa
│
└── unmount
      ├── Report()
      └── remove() de ambos watchers
```

`Report()` (`RouteNavigation.tsx:344-369`):

1. Toma `store.getState().positionSamples.positionSamples`.
2. Despacha `actionLocationReport({ metadata, idVehicle, timestamp, routeId, employee_id, route_plan_type_code, samples })`.
3. **Inmediatamente** despacha `clearPositionSamples()`.
4. Intenta `AsyncStorage.removeItem('positionSamplesState')`, una clave que nadie escribe.

El middleware (`middleware.ts:88-136`) intenta el POST con 3 reintentos de 1 segundo. Si falla, hace `next(action)`, que encola la acción en `offlineSlice.offlineQueue`. Esa cola **vive solo en memoria**. Además, `restoreConnectionMiddleware` (`middleware.ts:247-262`) procesa la cola y después hace `dequeueAction()` aunque algunos ítems hayan fallado.

### 3.2 Suspender, abortar y finalizar

- **Suspender:** `suspendConfirm` (`:502-512`) despacha `actionSuspendRoute` sin esperar la respuesta y navega a `RouteEnd` con `routeEnd: 'routeSuspend'`.
- **Abortar:** `abortConfirm` (`:423-450`) espera la API y navega a `RouteEnd` con `routeEnd: 'routeAbort'`.
- **Finalizar:** `MapViewerNavigation.endRoute` (`:322-326`) llama `report()`, despacha `actionEndRoute` y navega a `RouteEnd` con `routeEnd: 'routeSuccess'`.
- `RouteEndScreen` muestra un contador de 5 segundos y luego hace `navigation.navigate('RouteCollect', { from: true, routeId })`.

En un stack de React Navigation, volver a una pantalla existente desmonta las pantallas intermedias. Por eso `RouteNavigation` se desmonta **cuando `RouteEnd` redirige**, no en el instante de suspender/abortar/finalizar. Durante esos 5 segundos el watcher A sigue vivo y sigue agregando muestras de una ruta que ya no está en curso.

---

## 4. Por qué se pierden los puntos

### 4.1 iOS

`watchPositionAsync` usa `locationManagerWithOptions`, y esa función crea el manager con:

```objc
locMgr.allowsBackgroundLocationUpdates = NO;
```

(`node_modules/expo-location/ios/EXLocation/EXLocation.m:505`)

Eso significa que **aunque se agregue `UIBackgroundModes: ['location']` al Info.plist, ese watcher no entrega posiciones en background**. La task de background, en cambio, sí lo activa:

```objc
locationManager.allowsBackgroundLocationUpdates = YES;
```

(`node_modules/expo-location/ios/EXLocation/TaskConsumers/EXLocationTaskConsumer.m:59`)

Además, con la app en segundo plano iOS suspende el runtime de JS. Los callbacks de `watchPositionAsync` dejan de ejecutarse; los timers de `setTimeout`/`setInterval` también. No hay forma de “mantener vivo” el watcher desde JS.

Dato adicional: en iOS `timeInterval` **no existe**; es una opción Android-only (`Location.types.d.ts`). El muestreo iOS se rige por `distanceInterval`. Con `distanceInterval: 10` y el vehículo detenido, no hay fixes nuevos.

### 4.2 Android

Android no suspende el JS de la misma forma que iOS, pero sin un **foreground service** el proceso es un candidato ideal para que el sistema lo congele o lo mate:

- Doze / App Standby.
- Cached app freezer.
- Ahorro de batería del fabricante (Xiaomi, Samsung, Huawei, Oppo, etc.).
- El usuario “barre” la app de recientes.

Cuando eso pasa, el watcher muere con el proceso. Aunque el proceso sobreviva un rato, la falta de notificación persistente hace que el conductor no sepa si el registro sigue activo.

`targetSdkVersion` es 34 (`source/android/build.gradle:8`). En Android 14, un foreground service de tipo `location` requiere:

- `android.permission.FOREGROUND_SERVICE`
- `android.permission.FOREGROUND_SERVICE_LOCATION`
- `android:foregroundServiceType="location"` en el service

El manifest actual tiene `FOREGROUND_SERVICE` pero **no** `FOREGROUND_SERVICE_LOCATION`. La librería declara el service con `foregroundServiceType="location"`, pero el permiso específico lo agrega el config plugin de `expo-location`, que hoy no está en `app.config.ts`.

### 4.3 Pérdida de datos en ambos sistemas

Aunque el watcher siguiera vivo, el diseño actual pierde datos por otras razones:

1. **Redux no se persiste.** No hay `redux-persist` ni `store.subscribe`. Si el proceso muere, las muestras desaparecen.
2. **`Report()` limpia antes de confirmar.** El POST es asíncrono y las muestras se borran en el acto.
3. **La cola offline es solo memoria.** Si el POST falla y el proceso muere, la cola desaparece.
4. **`dequeueAction()` vacía toda la cola** aunque algunos ítems hayan fallado.
5. **El `AsyncStorage.removeItem('positionSamplesState')` es código muerto**: nadie escribe esa clave.
6. **Un solo buffer y un solo contexto** en el diseño propuesto por la observación original provocaría mezcla de rutas.

---

## 5. Casos de la vida real

### Caso 1 — El chofer bloquea el teléfono en el soporte

**Hoy:** sale a ruta, el teléfono se bloquea a los 30 segundos, iOS suspende el JS, `watchPositionAsync` deja de entregar. Cuando vuelve a abrir la app, el mapa se actualiza, pero el tramo recorrido con la pantalla apagada no existe.

**Con el rediseño:** la task de background sigue recibiendo fixes con la pantalla bloqueada. Las muestras se acumulan en disco y se envían cada 60–180 segundos o al volver a foreground. El tramo aparece completo.

**Cómo verificarlo:** ruta de 10 minutos en un iPhone real con la pantalla bloqueada; comparar el recorrido del informe contra el track de la app.

### Caso 2 — Usa Waze o Google Maps en paralelo

**Hoy:** al abrir otra app de navegación, `RouteNavigation` queda en background. En iOS el muestreo se corta de inmediato. En Android puede sobrevivir unos minutos, pero sin foreground service es cuestión de tiempo.

**Con el rediseño:** el foreground service muestra “Ruta en curso — Registrando la ubicación del vehículo” y el muestreo continúa. El conductor puede alternar apps sin perder puntos.

**Detalle de producto:** la notificación persistente es también una señal de confianza. Si el conductor la ve, sabe que la app está registrando. Si no la ve, va a pensar que está apagada.

### Caso 3 — Ruta de 6 horas con zonas sin señal

**Hoy:** las muestras se acumulan en Redux. Cuando `Report()` dispara y falla, la acción queda en una cola en memoria. Si el teléfono se queda sin batería, se reinicia o el sistema mata la app, se pierden todas las muestras no enviadas.

**Con el rediseño:** el buffer está en AsyncStorage. Al recuperar señal se hace flush desde `AppState`, desde `NetInfo` o desde el próximo arranque. Se pierde como máximo el último lote que estaba en vuelo, y aun así el backend puede deduplicar.

**Cuidado:** el buffer no es infinito. Hay que poner un tope (por ejemplo, 10 000 muestras o 7 días) y una política de descarte visible, para no llenar el almacenamiento.

### Caso 4 — Suspende la ruta para almorzar

**Hoy:** el conductor suspende, ve la pantalla de “Ruta suspendida”, y durante 5 segundos el watcher sigue registrando. Después `RouteEnd` redirige y recién ahí se desmonta. No hay un `stopTracking` explícito; el corte depende del desmontaje. Si el usuario se queda en `RouteEnd` o navega de otra forma, el comportamiento es ambiguo.

**Con el rediseño:** “suspender” significa **detener el registro y hacer flush**. Al reanudar, `startTracking` vuelve a arrancar de forma idempotente. Es importante que esta semántica sea explícita y esté escrita en el manual del conductor.

**Pregunta abierta:** ¿suspender debe pausar el registro o solo pausar el envío? Para una ruta de recolección, lo esperable es pausar el registro: el vehículo no está trabajando esa ruta.

### Caso 5 — Termina la ruta y cierra la app

**Hoy:** `MapViewerNavigation.endRoute` llama `report()`, despacha `actionEndRoute` y navega. Si el POST falla y el conductor cierra la app desde recientes, las muestras se pierden.

**Con el rediseño:** `stopTracking()` detiene el servicio y hace flush. Si no hay red, el lote queda en disco con su contexto y se envía después. El cierre de la app ya no es una sentencia de muerte para los datos.

### Caso 6 — Reinicio del teléfono o batería agotada

**Hoy:** Redux se reinicia vacío. Lo único que sobrevive es lo que ya se envió. Además, si el conductor inició sesión con QR, el token no está en Keychain (`loginQRAction.ts:14`), así que una task headless que despierte después de un reinicio no puede autenticarse.

**Con el rediseño:** el buffer sobrevive en AsyncStorage y el token se guarda siempre en Keychain mientras la sesión esté activa. La task puede hacer el POST aunque el proceso haya arrancado de cero.

**Matiz:** no todos los fabricantes relanzan la task después de un reinicio. El buffer igual se envía la próxima vez que el conductor abra la app.

### Caso 7 — Dos rutas el mismo día y la primera quedó sin subir

**Hoy:** no hay buffer persistente, así que el escenario no existe formalmente. Pero con el diseño de la observación original (una sola clave `positionSamplesBuffer` y una sola `routeTrackingContext`) existiría un bug grave: al iniciar la segunda ruta se sobrescribe el contexto y las muestras pendientes de la primera se enviarían con el `routeId` de la segunda, o se perderían.

**Con el rediseño:** el buffer se organiza por `routeId`, cada lote conserva su propio contexto, y el flush agrupa por ruta. Cambiar de ruta no contamina lotes anteriores.

### Caso 8 — Vehículo detenido en un atasco o en una parada larga

**Hoy:** el sampler solo agrega una muestra cuando arranca la marcha o cuando se movió 50 m. Con el vehículo quieto no hay latidos. El informe muestra un hueco y operaciones cree que el GPS se apagó.

**Con el rediseño:** el buffer no resuelve esto por sí solo. En iOS, con `distanceInterval: 10`, no hay fixes mientras no haya movimiento. En Android, `timeInterval` puede seguir entregando, pero `distanceInterval` también filtra. La solución de fondo es un **heartbeat**: emitir una muestra cada N minutos aunque la velocidad sea 0, o generarlo del lado del backend a partir de la última posición conocida. Es un tema separado, pero hay que decidirlo antes de prometer “no se pierde ningún punto”.

### Caso 9 — Xiaomi / Samsung con ahorro de batería agresivo

**Hoy:** el proceso muere aunque la app esté en foreground service (o ni siquiera llega a tenerlo). El conductor no entiende por qué “la app dejó de tomar puntos”.

**Con el rediseño:** el foreground service ayuda, pero no es inmune. Hay que:

- Pedir al conductor que desactive la optimización de batería para la app.
- Detectar y avisar si la app no está exenta (`PowerManager.isIgnoringBatteryOptimizations` vía un módulo nativo o una librería).
- Monitorear en Sentry/telemetría los arranques de task y la antigüedad del último fix.

### Caso 10 — Permiso “Solo mientras uso la app”

**Hoy:** el permiso de background se pide en onboarding (`PermissionsScreen.tsx`), pero si el usuario lo revoca después, `RouteNavigation` sigue con `watchPositionAsync` y no falla de forma visible.

**Con el rediseño:** `startTracking` debe verificar foreground y background antes de arrancar. Si falta el de background, hay que mostrar un modal con “Abrir ajustes” y decidir si se permite iniciar la ruta en modo degradado. En Android 11+ el permiso de background se concede desde ajustes; no alcanza con un diálogo.

---

## 6. Qué acierta y qué no la observación original

| Afirmación original | Veredicto | Evidencia |
|---|---|---|
| El muestreo corre con `watchPositionAsync` atado a `RouteNavigation` | ✅ Correcto | `RouteNavigation.tsx:143-223` |
| Al bloquear/background el sistema suspende el JS y el watcher deja de recibir | ✅ Correcto en iOS; parcial en Android | iOS: `EXLocation.m:505`; Android: sin FGS el proceso se congela/mata |
| `expo-task-manager` está instalado y nunca se usa | ✅ Correcto | `package.json:52`, sin imports |
| Falta `UIBackgroundModes` en iOS | ✅ Correcto | `app.config.ts` no tiene el plugin |
| `Report()` limpia sin esperar confirmación y se pierde parte de lo capturado | ✅ Correcto, pero incompleto | `RouteNavigation.tsx:364`; Redux no persistido; cola offline en memoria |
| “Suspender la ruta desmonta la pantalla, entonces se corta” | ❌ Incorrecto en el instante | `suspendConfirm` navega a `RouteEnd`; el desmontaje ocurre ~5 s después |
| “Llamar `stopTracking` solo en `endRoute`” | ❌ Incorrecto para esta app | Dejaría tracking activo tras suspender/abortar |
| `locationReport({ ...ctx, samples, timestamp })` | ❌ Firma incorrecta | `Service.ts:583-599` es posicional |
| “Quitar el watcher A y el muestreo de `RouteNavigation`” | ⚠️ Correcto a medias | Si se quita, se pierde el trazo del mapa (`MapViewerNavigation.tsx:940-952`) |
| “Llamar `startTracking` al iniciar la ruta, no en `useEffect`” | ⚠️ Incompleto | Hay 4–5 entry points; conviene un choke point idempotente |
| “Buffer único en AsyncStorage” | ⚠️ Riesgo | Contamina rutas si no se guarda contexto por lote/ruta |
| “Con esto quedan resueltos background y pérdida por cierre” | ⚠️ Parcial | Falta token en Keychain, `runtimeVersion`, FGS permission, dedupe, heartbeat |

---

## 7. Diseño propuesto

### 7.1 Principios

1. **Una sola fuente de muestreo para el envío:** la task de background. Redux deja de ser la fuente de verdad.
2. **El mapa es solo UI:** el watcher de 2 segundos puede seguir existiendo para la experiencia visual, pero no para reportar.
3. **Persistencia antes de red:** primero se escribe en disco, después se intenta enviar. Nunca al revés.
4. **Contexto por ruta:** cada lote guarda `routeId`, `vehicleId`, `employeeId`, `routePlanTypeCode` y el identificador de dispositivo. Cambiar de ruta no reescribe lotes anteriores.
5. **Idempotencia:** el envío es at-least-once. El backend debe deduplicar; el cliente no puede garantizar exactly-once.
6. **Ciclo de vida explícito:** start al entrar/reanudar; stop + flush al suspender, abortar, finalizar o cerrar sesión. El desmontaje de pantalla no detiene el tracking.
7. **Sin `watchPositionAsync` en background:** la task es la única que corre con la pantalla bloqueada.

### 7.2 Configuración nativa

`source/app.config.ts` hoy no tiene el plugin de `expo-location`. Hay que agregarlo:

```ts
plugins: [
  // ...plugins existentes
  [
    'expo-location',
    {
      isIosBackgroundLocationEnabled: true,
      isAndroidBackgroundLocationEnabled: true,
      isAndroidForegroundServiceEnabled: true,
      locationWhenInUsePermission:
        'Se usa tu ubicación para registrar la ruta.',
      locationAlwaysAndWhenInUsePermission:
        'Se usa tu ubicación para registrar la ruta aun con la app en segundo plano.',
    },
  ],
],
```

El plugin es el que agrega:

- `UIBackgroundModes: ['location']` en iOS.
- `FOREGROUND_SERVICE_LOCATION` en Android.
- Los textos de permisos de iOS.

Si además se declara `ios.infoPlist.UIBackgroundModes` y los permisos Android a mano, no rompe, pero duplica la fuente de verdad. Mejor dejar que el plugin lo haga y mantener `app.config.ts` mínimo.

Permisos que deben quedar en Android:

```ts
android: {
  permissions: [
    // ...existentes
    'ACCESS_FINE_LOCATION',
    'ACCESS_COARSE_LOCATION',
    'ACCESS_BACKGROUND_LOCATION',
    'FOREGROUND_SERVICE',
    'FOREGROUND_SERVICE_LOCATION',
    'POST_NOTIFICATIONS',
  ],
},
```

`POST_NOTIFICATIONS` (Android 13+) no es obligatorio para que el servicio corra, pero sin él la notificación persistente puede no mostrarse, y el conductor pierde la señal visual de que el registro está activo.

**Importante sobre el build:**

- `android/` e `ios/` están en `.easignore` y en `.gitignore`; EAS los genera con prebuild.
- Un `npx expo run:android` local con un `android/` viejo **no** toma los cambios de `app.config.ts`. Hay que correr `npx expo prebuild --clean` (o borrar `android/`) antes de compilar.
- No hay carpeta `ios/` en el repo, así que iOS también sale del config.
- Esto **no funciona en Expo Go**. Requiere dev build o EAS build.

### 7.3 Modelo de datos del buffer

En lugar de un único array y un único contexto, se propone un mapa de lotes por ruta:

```ts
// source/src/tasks/types.ts
export type TrackingContext = {
  routeId: number;
  vehicleId: number;
  employeeId: number;
  routePlanTypeCode?: string;
  deviceId: string;
  startedAt: number;
};

export type BufferedSample = {
  // id local para borrar selectivamente y para deduplicar en cliente
  id: string;
  timestamp: string; // timestamp real del fix, no el de envío
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number | null;
};

export type PendingBatch = {
  context: TrackingContext;
  samples: BufferedSample[];
};

// clave = String(routeId)
export type BatchMap = Record<string, PendingBatch>;
```

Claves de AsyncStorage:

| Clave | Contenido |
|---|---|
| `@routeTracking/activeContext` | Contexto de la ruta que está registrando ahora, o `null` |
| `@routeTracking/batches` | `BatchMap` con todos los lotes pendientes |
| `@routeTracking/lastFlushAt` | Último flush exitoso, para espaciar |
| `@routeTracking/deviceId` | Identificador estable de instalación |

Ventajas:

- Si la ruta A queda sin subir y empieza la ruta B, el lote A conserva su contexto y se envía con `route_id` correcto.
- El flush puede agrupar por `routeId` y hacer un POST por lote.
- Al cerrar sesión se puede limpiar todo sin ambigüedad.

### 7.4 Tarea de background

Archivo nuevo: `source/src/tasks/locationTask.ts`.

Debe importarse en el entry point (`source/index.ts`) **fuera de cualquier componente**, antes de `registerRootComponent`:

```ts
// source/index.ts
import './src/tasks/locationTask';

import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
```

Esquema de la task:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';

import { locationReport } from '../services/Service';
import type { BatchMap, BufferedSample, TrackingContext } from './types';

export const LOCATION_TASK = 'ROUTE_LOCATION_TASK';

const ACTIVE_CONTEXT_KEY = '@routeTracking/activeContext';
const BATCHES_KEY = '@routeTracking/batches';
const LAST_FLUSH_KEY = '@routeTracking/lastFlushAt';

const MAX_ACCURACY_METERS = 50;
const FLUSH_EVERY_MS = 60_000; // ajustar según batería y necesidad operativa

let bufferLock: Promise<unknown> = Promise.resolve();
let flushInFlight: Promise<void> | null = null;

// Serializa lecturas/escrituras del buffer dentro del mismo runtime JS.
function withBufferLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = bufferLock.then(fn, fn);
  bufferLock = run.catch(() => undefined);
  return run;
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function flushBuffer(): Promise<void> {
  if (flushInFlight) return flushInFlight;
  flushInFlight = withBufferLock(doFlush).finally(() => {
    flushInFlight = null;
  });
  return flushInFlight;
}

async function doFlush(): Promise<void> {
  const [batches, activeContext] = await Promise.all([
    readJson<BatchMap>(BATCHES_KEY, {}),
    readJson<TrackingContext | null>(ACTIVE_CONTEXT_KEY, null),
  ]);

  const sentIds = new Set<string>();

  for (const [routeId, batch] of Object.entries(batches)) {
    if (!batch.samples.length) continue;

    try {
      await locationReport(
        // Conserva la clave legacy para compatibilidad; el valor ya no es un IMEI.
        { imei: batch.context.deviceId },
        String(batch.context.vehicleId),
        new Date().toISOString(),
        batch.samples.map(({ timestamp, latitude, longitude, speed }) => ({
          timestamp,
          latitude,
          longitude,
          speed,
        })),
        String(batch.context.routeId),
        String(batch.context.employeeId),
        batch.context.routePlanTypeCode,
      );

      for (const sample of batch.samples) sentIds.add(sample.id);
    } catch (error) {
      // Se conserva el lote para el próximo intento.
      // Loguear sin coordenadas (privacidad).
      console.warn('location flush failed', { routeId, error: String(error) });
    }
  }

  if (!sentIds.size) return;

  await withBufferLock(async () => {
    const current = await readJson<BatchMap>(BATCHES_KEY, {});
    for (const [routeId, batch] of Object.entries(current)) {
      const remaining = batch.samples.filter((s) => !sentIds.has(s.id));
      if (remaining.length === 0 && (!activeContext || String(activeContext.routeId) !== routeId)) {
        delete current[routeId];
      } else {
        current[routeId] = { ...batch, samples: remaining };
      }
    }
    await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify(current));
    await AsyncStorage.setItem(LAST_FLUSH_KEY, String(Date.now()));
  });
}

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('location task error', error.message);
    return;
  }

  const locations = (data as { locations?: any[] } | undefined)?.locations ?? [];
  if (!locations.length) return;

  await withBufferLock(async () => {
    const activeContext = await readJson<TrackingContext | null>(ACTIVE_CONTEXT_KEY, null);
    if (!activeContext) return; // ruta detenida: ignorar fixes tardíos

    const batches = await readJson<BatchMap>(BATCHES_KEY, {});
    const key = String(activeContext.routeId);
    const batch = batches[key] ?? { context: activeContext, samples: [] };

    for (const loc of locations) {
      const accuracy = loc.coords.accuracy ?? null;
      if (accuracy != null && accuracy > MAX_ACCURACY_METERS) continue;

      // Descartar fixes anteriores al inicio de esta ruta activa.
      // Evita atribuir a la ruta B una posición vieja de la ruta A.
      if (loc.timestamp < batch.context.startedAt) continue;

      batch.samples.push({
        id: `${activeContext.routeId}:${loc.timestamp}:${loc.coords.latitude}:${loc.coords.longitude}`,
        timestamp: new Date(loc.timestamp).toISOString(),
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        speed: Math.max(loc.coords.speed ?? 0, 0),
        accuracy,
      });
    }

    batches[key] = batch;
    await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
  });

  const lastFlush = Number((await AsyncStorage.getItem(LAST_FLUSH_KEY)) ?? 0);
  if (Date.now() - lastFlush >= FLUSH_EVERY_MS) {
    await flushBuffer();
  }
});
```

Notas de implementación:

- `data.locations` es la forma que entrega `expo-location` en la task; cada elemento es un `LocationObject`.
- El `id` del sample permite borrar solo lo enviado y sirve como dedupe local.
- `startedAt` se persiste en `TrackingContext` para descartar fixes anteriores al inicio de la ruta activa.
- El lock es a nivel de módulo y protege los accesos al buffer dentro del runtime JS.
- No loguear latitud/longitud en producción.

### 7.5 Controlador de start/stop

Archivo nuevo: `source/src/tasks/trackingController.ts`.

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { LOCATION_TASK, flushBuffer } from './locationTask';
import type { BatchMap, TrackingContext } from './types';

const ACTIVE_CONTEXT_KEY = '@routeTracking/activeContext';
const BATCHES_KEY = '@routeTracking/batches';

export async function startTracking(context: TrackingContext): Promise<void> {
  const foreground = await Location.getForegroundPermissionsAsync();
  if (foreground.status !== 'granted') {
    const requested = await Location.requestForegroundPermissionsAsync();
    if (requested.status !== 'granted') {
      throw new Error('Permiso de ubicación en primer plano requerido');
    }
  }

  const background = await Location.getBackgroundPermissionsAsync();
  if (background.status !== 'granted') {
    const requested = await Location.requestBackgroundPermissionsAsync();
    if (requested.status !== 'granted') {
      throw new Error('Permiso de ubicación en segundo plano requerido');
    }
  }

  await AsyncStorage.setItem(ACTIVE_CONTEXT_KEY, JSON.stringify(context));

  const batches = JSON.parse((await AsyncStorage.getItem(BATCHES_KEY)) ?? '{}') as BatchMap;
  if (!batches[String(context.routeId)]) {
    batches[String(context.routeId)] = { context, samples: [] };
    await AsyncStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
  }

  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) return;

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High, // iOS: nearest 10 m
    timeInterval: 10_000, // solo Android
    distanceInterval: 10,
    pausesUpdatesAutomatically: false, // iOS
    showsBackgroundLocationIndicator: true, // iOS
    activityType: Location.ActivityType.AutomotiveNavigation, // iOS
    foregroundService: {
      notificationTitle: 'Ruta en curso',
      notificationBody: 'Registrando la ubicación del vehículo',
    },
    // Opcional iOS: agrupar entregas en background para ahorrar batería.
    // deferredUpdatesInterval: 60_000,
    // deferredUpdatesDistance: 0,
  });
}

export async function stopTracking(options: { flush?: boolean } = {}): Promise<void> {
  const { flush = true } = options;

  // Primero invalidar el contexto activo para que los fixes tardíos no se
  // atribuyan a la ruta que se está cerrando.
  await AsyncStorage.removeItem(ACTIVE_CONTEXT_KEY);

  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  }

  if (flush) {
    await flushBuffer();
  }
}
```

Detalles:

- `startTracking` es idempotente: si la task ya está corriendo, solo actualiza el contexto.
- Si se cambia de ruta sin haber hecho stop, conviene hacer `await stopTracking()` antes de `startTracking` para evitar que un fix viejo caiga en la ruta nueva.
- `hasStartedLocationUpdatesAsync` requiere que la task esté definida; por eso `index.ts` importa `locationTask` primero.
- Si el permiso de background se deniega, hay que decidir el flujo de producto (ver decisiones abiertas).
- `Location.Accuracy.High` en Android es alta precisión; en iOS equivale a “nearest 10 m”. Para máxima precisión existe `Highest`, pero consume más batería.

### 7.6 Flush: cuándo y cómo

El flush debe dispararse en estos puntos:

| Disparador | Por qué |
|---|---|
| Cada 60–180 s dentro de la task | Envío incremental mientras hay fixes |
| `AppState` → `active` | Al volver a foreground, drenar lo acumulado |
| `NetInfo` → conectado | Aprovechar la restauración de red |
| Arranque de la app | Recuperar lotes de un cierre anterior |
| Inicio de una nueva ruta | Drenar lotes viejos antes de empezar |
| `stopTracking()` | Suspender, abortar, finalizar |
| Logout | Drenar y después limpiar |

Implementación en `App.tsx`:

```ts
import { AppState } from 'react-native';
import { flushBuffer } from './src/tasks/locationTask';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void flushBuffer();
    }
  });
  return () => subscription.remove();
}, []);
```

En el bloque de `NetInfo` que ya existe, después de `dispatch(actionRestoreConnection())`:

```ts
void flushBuffer();
```

Y una vez al arrancar:

```ts
useEffect(() => {
  void flushBuffer();
}, []);
```

**Sobre la concurrencia:** el `flushInFlight` evita dos POST simultáneos dentro del mismo runtime. Pero si el proceso muere justo después de que el backend recibió el lote y antes de borrarlo de AsyncStorage, el próximo flush lo reenvía. Eso es inevitable en un sistema distribuido: la solución es **deduplicación en el backend**.

**Sobre el tamaño:** AsyncStorage en Android tiene límites prácticos (unos pocos MB). Un día de ruta a 10 segundos son ~8 640 muestras; con ~150 bytes por muestra, ~1.3 MB. Es manejable, pero hay que poner un tope y una política de descarte. Una alternativa es guardar cada lote en una clave separada (`@routeTracking/batch/<routeId>`) para no reescribir todo el mapa en cada fix.

### 7.7 Ciclo de vida y máquina de estados

```
                    ┌─────────────────────────────┐
                    │  Ruta no iniciada / cerrada │
                    └──────────────┬──────────────┘
                                   │ startTracking(ctx)
                                   ▼
                    ┌─────────────────────────────┐
                    │  TRACKING ACTIVO            │
                    │  - task recibe fixes        │
                    │  - buffer por routeId       │
                    │  - flush periódico          │
                    └───┬───────────┬─────────┬───┘
                        │           │         │
             suspender  │    abortar│         │ finalizar
                        ▼           ▼         ▼
                    ┌─────────────────────────────┐
                    │  stopTracking()             │
                    │  - limpia contexto activo   │
                    │  - detiene updates          │
                    │  - flush del lote           │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │  Ruta suspendida/abortada/  │
                    │  finalizada                 │
                    │  (lote puede quedar pendiente│
                    │   si no hay red)            │
                    └──────────────┬──────────────┘
                                   │ reanudar / nueva ruta
                                   ▼
                             startTracking(ctx)
```

Regla de oro: **el desmontaje de `RouteNavigation` no detiene el tracking**. Solo lo detienen las acciones de negocio (suspender, abortar, finalizar, logout) y el sistema operativo.

### 7.8 Integración en pantallas

#### `RouteNavigation.tsx`

1. **Eliminar** el watcher A completo (`:143-223`), el `REPORT_INTERVAL` y la lógica de muestreo/reporte.
2. **Eliminar** `Report()` (`:344-369`) y la llamada a `reportRef.current?.()` en el cleanup del watcher B (`:339`).
3. **Mantener** el watcher B solo para UI. Opcionalmente, alimentar `drawnSamples` para que el trazo siga apareciendo:

```ts
const subscription = await Location.watchPositionAsync(
  { accuracy: Location.Accuracy.Balanced, timeInterval: 2000, distanceInterval: 5 },
  (location) => {
    setLocationNew(location);
    dispatch(
      addDrawnSample({
        timestamp: new Date(location.timestamp).toISOString(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        speed: Math.max(location.coords.speed ?? 0, 0),
      }),
    );
  },
);
```

Si se reutiliza `addPositionSample`, hay que limitar el array (por ejemplo, últimas 5 000 muestras) para que no crezca indefinidamente durante una ruta de 8 horas.

4. **Iniciar tracking** cuando `dataRoute` esté disponible:

```ts
useEffect(() => {
  if (!dataRoute) return;

  const context: TrackingContext = {
    routeId,
    vehicleId: idVehicle ?? dataRoute.vehicle_id,
    employeeId: employee_id ?? dataRoute.employee_id,
    routePlanTypeCode: dataRoute.route_plan_type_code,
    deviceId: await getDeviceId(), // ver sección de auth/device id
    startedAt: Date.now(),
  };

  startTracking(context).catch((error) => {
    // Mostrar modal: permiso denegado, servicio no disponible, etc.
    setTrackingError(String(error));
  });
}, [dataRoute, routeId, idVehicle, employee_id]);
```

5. **No detener en el unmount.** En el cleanup, como mucho `void flushBuffer()`. El stop lo hacen las acciones de negocio.

#### `suspendConfirm`

```ts
const suspendConfirm = useCallback(
  async (id: any, type: any, description: any) => {
    // Detener primero el registro; el flush sigue en background.
    void stopTracking();
    dispatch(actionSuspendRoute({ id, type, description }));
    navigation.navigate('RouteEnd', { routeId: id, routeEnd: 'routeSuspend' });
    setNavigationEnabled(false);
  },
  [description, dispatch, navigation],
);
```

Si se quiere garantizar el flush antes de navegar, se puede `await stopTracking()` y mostrar un loader. Para la UX del conductor, probablemente convenga no bloquear: el lote queda en disco igual.

#### `abortConfirm`

Mismo criterio: `void stopTracking()` antes o después de la llamada a la API, pero siempre cuando el aborto se confirma localmente (incluso offline).

#### `MapViewerNavigation.endRoute`

```ts
const endRoute = useCallback(
  (routeId: number) => {
    void stopTracking();
    dispatch(actionEndRoute({ routeId }));
    navigation.navigate('RouteEnd', { routeId, routeEnd: 'routeSuccess' });
  },
  [dispatch, navigation],
);
```

Ya no hace falta `report()`: el flush de `stopTracking` envía el lote.

#### Logout

En `logoutAction.ts`, antes de limpiar credenciales:

```ts
await stopTracking();
await clearTrackingBuffer(); // borra batches y contexto activo
```

#### `RouteCollect` / `RouteDetail` / `DownloadLocationScreen`

No necesitan cambios si el start se hace en el mount de `RouteNavigation`. Si se prefiere arrancar antes de navegar (para no perder los primeros metros), se puede llamar `startTracking` en los helpers que hacen `navigate('RouteNavigation')`, pero entonces hay que duplicar la lógica en 4–5 lugares. El choke point del mount es más mantenible.

### 7.9 UI del mapa

`MapViewerNavigation` dibuja `positionSamples`/`drawnSamples` (`:940-952`). Si se elimina el muestreo de Redux, el trazo desaparece. Opciones:

1. **Recomendada:** watcher B en foreground alimenta solo `drawnSamples`; la task alimenta el buffer de envío. Son dos caminos independientes y el mapa no depende de la red.
2. Alternativa: al volver a foreground, leer el buffer y reconstruir `drawnSamples` con las muestras de la ruta activa. Es más complejo y puede duplicar puntos con el watcher B.
3. Alternativa: mantener `addPositionSample` en el watcher B y no usarlo para reportar. Es la opción 1 con el reducer actual.

En cualquiera de las tres, **`Report()` deja de leer Redux**. Si queda el path viejo, se duplican los envíos.

### 7.10 Autenticación y identidad del dispositivo

El token de axios vive en una variable de módulo y se restaura desde Keychain (`axios-instance.ts`). Eso funciona en una task headless **solo si el token fue persistido**. Hoy:

- `loginAction.ts:28-31`: guarda en Keychain solo si `rememberMe`.
- `loginQRAction.ts:14`: nunca guarda en Keychain.

Corrección:

```ts
// loginAction.ts
setHttpToken(token);
await Keychain.setGenericPassword('token', token, {
  accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
}); // siempre y accesible por la task cuando el dispositivo vuelve a bloquearse
if (rememberMe) {
  await AsyncStorage.setItem('userData', JSON.stringify(userData));
}
```

```ts
// loginQRAction.ts
setHttpToken(token);
await Keychain.setGenericPassword('token', token, {
  accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
});
```

Y en logout, `clearHttpToken()` ya hace `Keychain.resetGenericPassword()`.

**Device ID / IMEI:** el código actual envía `imei: 353001231023132341`, un literal numérico de 18 dígitos que supera `Number.MAX_SAFE_INTEGER`; JS ya lo envía redondeado. Además, el IMEI real no es accesible en Android 10+ ni en iOS sin permisos privilegiados. Opciones:

- `expo-application.getAndroidId()` / `getIosIdForVendorAsync()`.
- Un UUID generado una vez y guardado en AsyncStorage.
- El id del GPS del vehículo, si el backend lo conoce.

Lo importante es que sea **string**, estable y no un IMEI hardcodeado.

### 7.11 Permisos

Flujo recomendado al iniciar tracking:

1. `getForegroundPermissionsAsync()` → si no está, `requestForegroundPermissionsAsync()`.
2. `getBackgroundPermissionsAsync()` → si no está, `requestBackgroundPermissionsAsync()`.
3. Si background no se concede:
   - Mostrar modal explicando que sin “Permitir todo el tiempo” no se registra en background.
   - Botón “Abrir ajustes” (`Linking.openSettings()`).
   - Decidir si se permite iniciar la ruta en modo degradado o se bloquea.

En Android 11+, el permiso de background se concede desde la pantalla de ajustes; el diálogo de la app no alcanza. En iOS, “Always” requiere un flujo de dos pasos y puede requerir volver a la app.

---

## 8. Garantías, errores y límites

### 8.1 At-least-once, no exactly-once

El cliente puede garantizar que cada muestra se envía **al menos una vez**. No puede garantizar que se envíe exactamente una vez sin una transacción distribuida. Los escenarios de duplicado son:

- El POST llega al backend, pero la app muere antes de borrar el lote.
- Dos flush concurrentes (mitigado con `flushInFlight`, no eliminado si hay dos procesos).
- El backend responde timeout pero procesó el request.

Solución: **deduplicación en el backend** por `(route_id, timestamp, latitude, longitude)` o por un `client_sample_id` que viaje en el payload.

### 8.2 Reintentos y backoff

- No reintentar en loop infinito dentro de la task: consumiría batería y datos.
- El flush periódico ya es un reintento natural.
- Si el backend responde 401, no tiene sentido reintentar hasta renovar sesión; registrar el error y dejar el lote.
- Si responde 4xx por payload inválido, mover el lote a una “dead letter” local o descartarlo con log, para no bloquear los demás.

### 8.3 Reloj y zonas horarias

- Usar el timestamp del fix (`loc.timestamp`) para cada muestra.
- Usar ISO 8601 con offset/UTC.
- No confiar en el reloj del dispositivo para ordenar en el backend; usar `reported_at` del servidor para la lectura.
- Un dispositivo con hora mal configurada puede generar timestamps fuera de orden. El backend debe tolerarlo.

### 8.4 Precisión y filtros

- Descartar `accuracy > 50 m` es razonable en ciudad, pero puede descartar puntos válidos en zonas rurales con GPS pobre. Considerar un umbral configurable o aceptar el punto con una marca de calidad.
- Mantener el bounding box (`MIN_LATITUDE`, `MAX_LATITUDE`, `MIN_LONGITUDE`, `MAX_LONGITUDE`) que ya usa el código actual.
- No descartar el primer fix de una ruta solo por precisión; puede ser el único durante un tiempo.

### 8.5 Batería

- `Accuracy.High` + `distanceInterval: 10` es un buen equilibrio.
- `Highest` mejora precisión pero consume más.
- En iOS, `deferredUpdatesInterval`/`deferredUpdatesDistance` permiten agrupar entregas en background.
- El watcher B de UI a 2 segundos es caro; si el mapa no necesita tanta frecuencia, bajarlo a 5 segundos.
- El foreground service con notificación es obligatorio para la confiabilidad, pero también consume batería. Hay que comunicarlo.

### 8.6 Almacenamiento

- Poner un tope al buffer (por ejemplo, 10 000 muestras o 7 días).
- Si se supera, descartar las más viejas y registrar una métrica.
- Guardar lotes por ruta en claves separadas si el mapa completo se vuelve pesado.
- Limpiar en logout y al finalizar una ruta una vez enviada.

---

## 9. Cambios por archivo

La tabla explica no solo **qué** se modificó, sino también **por qué** y **para qué**. “Para qué” describe el efecto esperado en la app.

| Archivo | Qué se cambió | Por qué | Para qué |
|---|---|---|---|
| `source/app.config.ts` | Se agregó el plugin `expo-location`, los permisos de background/foreground service y se subió `runtimeVersion` a `1.0.1`. | La configuración anterior no declaraba background location en iOS y Android 14 requiere el permiso específico del foreground service. Además, el binario nativo cambia. | Generar builds que puedan mantener el GPS activo con la app en segundo plano y evitar distribuir este JS por OTA a binarios incompatibles. |
| `source/index.ts` | Se importa `locationTask` antes de registrar la app. | Expo exige definir la tarea en el ámbito global antes de que el sistema intente ejecutarla. | Permitir que el sistema operativo invoque la tarea incluso sin una pantalla montada. |
| `source/src/tasks/types.ts` | Se agregaron tipos para contexto de tracking, muestras y lotes por ruta; el contexto guarda `startedAt`. | Un array global no identifica de forma segura a qué ruta pertenece cada punto, y un fix tardío puede llegar después de cambiar de ruta. | Mantener separados ruta, vehículo y empleado, y rechazar posiciones anteriores al inicio de la ruta activa. |
| `source/src/tasks/storage.ts` | Se centralizaron las claves de AsyncStorage, lectura tolerante de JSON y un lock cooperativo. | El buffer es compartido entre callbacks de la tarea, los flush y el controlador; una lectura/escritura simultánea podría sobrescribir muestras. | Persistir datos entre procesos y serializar las operaciones locales sobre el buffer. |
| `source/src/tasks/deviceId.ts` | Se obtiene un ID de Android/iOS y se persiste; si no está disponible, se crea uno de instalación. | El IMEI literal existente no identifica correctamente el equipo, no es accesible para apps normales y pierde precisión como número de JavaScript. | Enviar un identificador estable como string, sin fingir que es un IMEI real. |
| `source/src/tasks/locationTask.ts` | Se definió `ROUTE_LOCATION_TASK`; valida y agrega fixes al lote de su ruta; limita el buffer, divide envíos en chunks de 500 y borra solo muestras confirmadas. El flush omite la red si NetInfo indica desconexión. | `watchPositionAsync` vive en el runtime de la pantalla; Redux no sobrevive a la muerte del proceso. Borrar antes de confirmar el POST podía perder puntos. | Capturar ubicaciones en background, conservarlas offline y reintentarlas al recuperar conexión, con envíos de tamaño acotado y semántica at-least-once. |
| `source/src/tasks/trackingController.ts` | Se agregaron `startTracking`, `stopTracking` y `clearTrackingBuffer`; solicita permisos, configura location updates y cancela inicios que queden obsoletos. | El inicio/parada debe ser uniforme y un permiso pendiente no debe permitir que una ruta ya suspendida arranque después. | Controlar el ciclo de vida de la task y detenerla en acciones de negocio sin detenerla por desmontar una pantalla. |
| `source/src/screens/RouteNavigation.tsx` | Se eliminó el watcher de muestreo y `Report()`; al cargar los datos se inicia el controlador. Se conservó el watcher visual y se usa solo para `drawnSamples`. Se detiene al suspender/abortar. | El watcher anterior dependía del ciclo de vida de JS y además enviaba/borraba las muestras. El mapa, sin embargo, necesita seguir dibujando posiciones mientras la pantalla está visible. | Separar el origen de reportes (task persistente) del origen visual (watcher foreground), sin perder el trazo normal del mapa ni enviar puntos dos veces. |
| `source/src/components/MapViewerNavigation.tsx` | Al finalizar la ruta se llama `stopTracking()` y se quitó la prop/callback `report`. | El reporte manual duplicaría el envío que ahora hace el buffer; finalizar también debe apagar el servicio GPS. | Cerrar el ciclo de tracking desde la acción de negocio de finalización. |
| `source/App.tsx` | Se intenta hacer flush al arrancar, al volver a `active` y cuando NetInfo informa conexión. | Una task puede dejar lotes pendientes si el proceso se cerró o no había red. | Reanudar los envíos sin depender de que llegue otra posición GPS. |
| `source/src/redux/actions/loginAction.ts` | Se persiste siempre el token en Keychain con `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`; `rememberMe` sigue controlando la persistencia de `userData`. | El runtime headless necesita autenticar el POST aunque el teléfono esté bloqueado; el Keychain debe permitir acceso después del primer desbloqueo y no migrar el secreto a otro dispositivo. | Autorizar los envíos de background durante una sesión activa sin guardar el token en AsyncStorage. |
| `source/src/redux/actions/loginQRAction.ts` | Se guarda también el token del login QR con la misma política de Keychain. | Antes el login QR dejaba el token solo en memoria, que desaparece cuando muere el proceso JS. | Permitir que una ruta iniciada por QR pueda enviar puntos desde la task. |
| `source/src/redux/actions/logoutAction.ts` | Antes de limpiar credenciales, se detiene el GPS, se intenta flush y se elimina el buffer; luego se borra el token en memoria/Keychain. | No debe quedar una tarea de tracking activa después de cerrar sesión ni muestras del usuario anterior en el almacenamiento local. | Cerrar sesión sin dejar GPS encendido o datos de ruta asociados al siguiente usuario. |
| `source/src/redux/slices/positionSamplesSlice.ts` | Se agregó `addDrawnSample`, que solo cambia los puntos del mapa y limita el array a 5.000 elementos. | La nueva fuente de reportes ya no debe poblar ni depender de `positionSamples`; el watcher visual puede seguir recibiendo posiciones durante rutas largas. | Conservar el trazo visible sin convertir Redux en el buffer de envío ni dejar que crezca indefinidamente. |
| `source/src/test/screens/RouteNavigation.test.tsx` y `source/src/test/components/MapViewerRouteNavigation.test.tsx` | Se mockearon el ID/controlador de tracking, se adaptó el watcher a una promesa y se quitó la prop `report`. | Los tests de pantallas no deben iniciar permisos/servicios nativos reales y las interfaces cambiaron al eliminar el reporte manual. | Mantener los tests de UI aislados de Expo Location/Task Manager. |
| `source/src/test/screens/RouteDetail.test.tsx` y `source/src/test/components/Header.test.tsx` | Se agregó un mock de `expo-task-manager`. | `App` ahora importa el módulo que define la task y los tests no disponen del servicio nativo. | Poder importar `App` en Jest sin requerir el runtime nativo. |
| `source/src/services/Service.ts` y `source/src/redux/middleware/middleware.ts` | No se modificaron. | El fix debía permanecer en la app y conservar el endpoint/firma existente; el camino viejo dejó de despachar `actionLocationReport`. | Evitar cambios de contrato con el backend y no introducir un segundo canal de envío. |

### Lectura rápida de los efectos

- **Antes:** pantalla → watcher JavaScript → Redux en memoria → `Report()` → API.
- **Ahora:** sistema operativo → task background → AsyncStorage por ruta → flush → misma API.
- **El mapa:** watcher de foreground → `drawnSamples` limitado; ya no es la fuente de envío.
- **Entrega:** se conserva el lote hasta confirmar el POST. Si el servidor recibió el lote y la app murió antes de borrarlo, puede haber reenvío; el backend aún debe deduplicar.

---

## 10. Backend

Aunque el foco sea la app, el rediseño no queda completo sin estos puntos:

1. **Idempotencia de `inform-position`:** aceptar duplicados sin duplicar puntos. Deduplicar por `(route_id, timestamp, latitude, longitude)` o por un `client_sample_id` enviado en cada muestra.
2. **`ORDER BY reported_at` en la lectura del informe:** hoy el punto está pendiente según el informe original. Sin eso, los lotes que llegan tarde desordenan el recorrido.
3. **Heartbeat:** decidir si lo genera el cliente (muestra cada N minutos con velocidad 0) o el backend (relleno a partir de la última posición). El buffer no resuelve los huecos por vehículo detenido.
4. **IMEI:** dejar de depender del IMEI hardcodeado. Usar `vehicle_id`, un `device_id` de instalación o el id del GPS. Si se mantiene la clave `imei` por compatibilidad, documentar que ahora contiene un id de dispositivo y no un IMEI real.
5. **Retención:** definir cuánto tiempo se guardan las muestras y los lotes fallidos.
6. **Rate limiting:** si varios vehículos envían lotes grandes al recuperar señal, el endpoint tiene que soportarlo. Considerar límite de muestras por request (por ejemplo, 500) y paginación del buffer.

---

## 11. Pruebas

### 11.1 Unitarias

- Filtro de precisión: descarta `accuracy > 50`, acepta `accuracy <= 50`.
- Filtro de bounding box.
- Descarte de fixes anteriores a `startedAt`.
- Append al lote correcto según `activeContext`.
- Cambio de ruta: el lote anterior conserva su `routeId`.
- Flush agrupa por ruta y hace un POST por lote.
- Si un POST falla, las muestras de ese lote se conservan.
- Si un POST tiene éxito, solo se borran las muestras enviadas.
- Dos `flushBuffer()` concurrentes hacen un solo POST.
- `startTracking` es idempotente si la task ya está corriendo.
- `stopTracking` limpia el contexto activo pero conserva lotes pendientes.
- Logout limpia todo.
- Cap del buffer descarta las muestras más viejas.

### 11.2 Integración

- Mockear `expo-location`, `expo-task-manager` y AsyncStorage.
- Simular la ejecución de la task con un lote de `locations`.
- Simular `AppState` a `active` y verificar flush.
- Simular `NetInfo` conectado y verificar flush.
- Simular 401 y verificar que el lote no se borra.

### 11.3 Matriz manual (dispositivos reales)

| Escenario | iOS | Android | Resultado esperado |
|---|---|---|---|
| Pantalla bloqueada 10 min en movimiento | ✅ | ✅ | Track continuo, sin huecos |
| App en background 10 min | ✅ | ✅ | Track continuo |
| Abrir Waze/Google Maps 10 min | ✅ | ✅ | Track continuo |
| Force kill desde recientes | ✅ | ✅ | Se conserva lo último flusheado; al abrir, se envía lo pendiente |
| Reinicio del teléfono en ruta | ✅ | ✅ | Al abrir la app, flush del lote |
| Modo avión 20 min y luego online | ✅ | ✅ | Lote se envía al recuperar red |
| Ahorro de batería OEM | ✅ | ✅ | FGS sobrevive o se detecta y avisa |
| Permiso “Solo mientras uso” | ✅ | ✅ | Modal de ajustes; no arranca en silencio |
| Notificaciones denegadas (Android 13+) | — | ✅ | El servicio corre; se advierte que no se ve la notificación |
| Suspender y reanudar | ✅ | ✅ | Stop + flush; resume reinicia |
| Abortar | ✅ | ✅ | Stop + flush |
| Finalizar | ✅ | ✅ | Stop + flush |
| Dos rutas offline el mismo día | ✅ | ✅ | Cada lote se envía con su `routeId` |
| Login QR + force kill | ✅ | ✅ | La task headless autentica con Keychain |
| Batería baja / low power mode iOS | ✅ | — | Se registra con menor frecuencia, sin perder el lote |

**Nota:** los simuladores no reproducen el comportamiento real de background, Doze ni los OEM. Las pruebas de aceptación deben hacerse en dispositivos físicos, al menos un iPhone y dos Android de marcas distintas.

---

## 12. Despliegue

1. **Implementar** los cambios de código y config.
2. **Regenerar nativo:** `npx expo prebuild --clean` (verificar que el plugin local `withMapboxConfig` se reaplique y que Mapbox siga funcionando).
3. **Compilar** con EAS (dev build para QA; preview/production después).
4. **Bumpear `runtimeVersion`** (por ejemplo, de `1.0.0` a `1.1.0`). Si no se bumpea, un OTA con el nuevo código puede llegar a un binario viejo sin `UIBackgroundModes` ni `FOREGROUND_SERVICE_LOCATION`, y `startLocationUpdatesAsync` va a fallar.
5. **Bumpear `version`/`versionCode`** según corresponda.
6. **QA interno** con la matriz manual.
7. **Piloto** con un grupo reducido de conductores y vehículos; comparar informes contra recorridos reales.
8. **Rollout gradual**; monitorear Sentry y métricas de buffer.
9. **Comunicación a conductores:** explicar la notificación persistente, el permiso “Permitir todo el tiempo” y la desactivación del ahorro de batería.

**Expo Go no sirve para probar esto.** Se necesita dev build o build nativo.

### Métricas sugeridas

- `tracking_started` / `tracking_stopped` por ruta.
- `tracking_permission_denied` (foreground/background).
- `location_task_error`.
- `location_flush_success` / `location_flush_failure` con código HTTP.
- `location_buffer_size` y `location_buffer_age_minutes`.
- `location_samples_per_route`.
- Alerta si una ruta en progreso no recibe muestras durante X minutos.

No loguear coordenadas en producción; usar `routeId`, conteos y códigos de error.

---

## 13. Riesgos y limitaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El OEM mata la app igual | Pérdida de puntos | FGS + instrucciones de batería + flush frecuente + buffer persistente |
| El conductor niega “Always” | No hay background | Modal de ajustes; decidir si se bloquea la ruta |
| El conductor deniega notificaciones (Android 13+) | No ve el FGS | Aviso en la app; no impide el servicio |
| Buffer crece demasiado | Storage/lentitud | Tope + claves por ruta + limpieza |
| Duplicados por reintentos | Informe con puntos repetidos | Dedupe backend |
| Reloj del dispositivo mal | Timestamps raros | `reported_at` del servidor para ordenar |
| Batería | Queja de conductores | `High` + distancia 10 m + deferred updates en iOS |
| Dos rutas seguidas | Mezcla de contexto | Lotes por `routeId` + `startedAt` |
| Token no persistido | 401 en headless | Keychain siempre |
| OTA a binario viejo | Crash o tracking no arranca | Bump de `runtimeVersion` + build nativo |
| `Report()` viejo conviviendo con la task | Doble envío | Eliminar el path de Redux para reporte |

---

## 14. Decisiones abiertas

1. **¿Qué significa “suspender ruta”?**
   Recomendación: detener el registro y hacer flush. Reanudar vuelve a iniciar. Confirmar con producto/operaciones.

2. **¿Se permite iniciar una ruta sin permiso de background?**
   Opciones: bloquear con modal de ajustes (más seguro) o permitir modo degradado con advertencia (menos fricción). Recomendación: bloquear para rutas, porque el objetivo del producto es el registro continuo.

3. **¿El backend acepta contexto por lote y deduplica?**
   Sin esto, el diseño at-least-once duplica puntos. Definir clave de deduplicación y contrato de `metadata` (`imei` vs `device_id`).

4. **¿Quién genera el heartbeat con el vehículo detenido?**
   Cliente o backend. El buffer no lo resuelve. Recomendación: backend a partir de la última posición, o muestra periódica del cliente si el sistema lo permite.

5. **¿Cada cuánto se hace flush?**
   60 s es más oportuno; 180 s ahorra batería/datos. Depende de la tolerancia a perder el último tramo si el teléfono muere.

6. **¿Qué texto y en qué idioma va la notificación del foreground service?**
   “Ruta en curso” / “Registrando la ubicación del vehículo”. Confirmar con UX y con los conductores.

7. **¿Se elimina `expo-background-fetch`?**
   Está instalado y no se usa. No es necesario para este diseño. Se puede dejar o limpiar en una tarea aparte.

8. **¿Se persiste también la cola offline general?**
   El mismo problema de fondo (cola en memoria) afecta a suspend/abort/end/collect. Fuera del alcance inmediato, pero conviene planificarlo.

---

## 15. Checklist de implementación

- [x] Agregar plugin `expo-location` en `app.config.ts`.
- [x] Agregar `FOREGROUND_SERVICE_LOCATION` y `POST_NOTIFICATIONS`.
- [x] Bumpear `runtimeVersion`.
- [x] Crear `locationTask.ts`, `trackingController.ts`, storage y device ID.
- [x] Importar la task en `index.ts`.
- [x] Implementar buffer por `routeId` con lock.
- [x] Implementar flush con `flushInFlight`.
- [x] Integrar start en `RouteNavigation` al cargar `dataRoute`.
- [x] Integrar stop + flush en suspend, abort, end y logout.
- [x] Quitar watcher A y `Report()` de `RouteNavigation`.
- [x] Mantener watcher B solo para UI / trazo.
- [x] Flush en `AppState active`, `NetInfo` y arranque.
- [x] Persistir token en Keychain en login normal y QR.
- [x] Reemplazar IMEI hardcodeado por `deviceId`.
- [ ] Tests unitarios e integración.
- [ ] Matriz manual en dispositivos reales.
- [ ] Dedupe y `ORDER BY reported_at` en backend.
- [ ] Comunicación a conductores.
- [ ] Monitoreo y piloto.

---

## 16. Anexo: cómo verificar rápido que el fix funciona

1. Instalar un dev build nuevo (no Expo Go).
2. Iniciar una ruta y confirmar que aparece la notificación persistente.
3. Bloquear la pantalla y caminar/recorrer 5 minutos.
4. Abrir la app: el trazo debe incluir el tramo con pantalla bloqueada.
5. Activar modo avión, recorrer 5 minutos, desactivarlo.
6. Esperar el flush (o volver a foreground) y verificar en el backend que llegaron los puntos.
7. Matar la app desde recientes, volver a abrirla: el lote pendiente debe enviarse.
8. Suspender la ruta: el servicio debe detenerse y el lote debe enviarse.
9. Reanudar: el servicio debe volver a arrancar sin duplicar watchers.
10. Repetir en un Android con ahorro de batería agresivo y en un iPhone con “Always”.

Si los pasos 3–7 funcionan en dispositivos reales, el núcleo del problema está resuelto. Lo que quede pendiente es heartbeat, dedupe y ordenamiento en el backend.

---

## 17. Glosario técnico ampliado

Los términos están agrupados por tema. Entre paréntesis se indica la sección del documento donde se aplican, cuando ayuda a ubicarlos.

### 17.1 Ubicación, GPS y muestreo

- **GPS (Global Positioning System):** sistema de posicionamiento por satélite. El teléfono combina GPS, Wi-Fi y torres celulares para estimar la posición.
- **GNSS (Global Navigation Satellite System):** término general que incluye GPS, GLONASS, Galileo y BeiDou. Cuando se habla de “GPS” en la app, en realidad se usa GNSS.
- **A-GPS (Assisted GPS):** asistencia de la red celular para que el GPS encuentre satélites más rápido. Explica por qué el primer fix puede tardar más en interiores o en frío.
- **Fix / posición:** una lectura concreta de latitud, longitud, precisión y timestamp. En este documento, “fix” y “muestra GPS” se usan como sinónimos.
- **Timestamp del fix:** momento en que el dispositivo obtuvo la posición (`loc.timestamp`), no el momento en que se envía al backend. Es el dato correcto para reconstruir el recorrido.
- **Latitud / longitud:** coordenadas geográficas en grados decimales. En el código se validan contra `MIN_LATITUDE`, `MAX_LATITUDE`, `MIN_LONGITUDE` y `MAX_LONGITUDE`.
- **Precisión (`accuracy`):** radio de incertidumbre en metros. Un `accuracy` de 10 m significa que la posición real está, con alta probabilidad, dentro de un círculo de 10 m. Cuanto más alto el número, peor la lectura.
- **Velocidad (`speed`):** velocidad instantánea en m/s que reporta el sistema. Puede venir `null` o negativa si no es válida; el código la normaliza con `Math.max(speed ?? 0, 0)`.
- **Rumbo / heading:** dirección de movimiento en grados. No se usa para el informe actual, pero está disponible en `LocationObject`.
- **Altitud / altitudAccuracy:** altura sobre el nivel del mar y su margen de error. No es relevante para este caso, pero viene en el objeto de ubicación.
- **Track / traza / recorrido:** conjunto ordenado de posiciones que forma el camino dibujado en el mapa y el que se reconstruye en el informe.
- **Sample / muestra:** un punto individual del track, con timestamp, coordenadas, velocidad y precisión. En el buffer se guarda como `BufferedSample`.
- **Polyline:** representación codificada de una secuencia de coordenadas. El proyecto la usa para rutas FIXED_PATH (`decodePolyline`).
- **Bounding box:** rectángulo geográfico mínimo/máximo de latitud y longitud. Sirve para descartar coordenadas imposibles o de otro país.
- **Geofence / geocerca:** área virtual; el sistema avisa cuando el dispositivo entra o sale. No se usa en este fix, pero explica por qué expo-location tiene consumidores de geofencing.
- **Drift / salto de posición:** error del GPS que ubica el punto a decenas o cientos de metros. El filtro de `accuracy` y el bounding box ayudan a mitigarlo.
- **Cold start / TTFF (Time To First Fix):** tiempo que tarda el GPS en obtener la primera posición tras encenderse o tras mucho tiempo sin señal. Puede ser de varios minutos.
- **Distance interval (`distanceInterval`):** distancia mínima en metros entre entregas de ubicación. En iOS es el filtro principal; con 10 m, el vehículo detenido no genera fixes.
- **Time interval (`timeInterval`):** intervalo mínimo en milisegundos entre entregas. Es **Android-only** en expo-location; en iOS se ignora.
- **Precisión deseada (`accuracy` / `desiredAccuracy`):** configuración de cuánta precisión pedirle al GPS. `High` en iOS equivale a “nearest 10 m”; `Highest` es la máxima precisión y consume más batería.
- **Activity type (`AutomotiveNavigation`):** pista que se le da a iOS sobre el tipo de actividad para ajustar el comportamiento del GPS. En este caso, navegación vehicular.
- **Pausas automáticas (`pausesUpdatesAutomatically`):** iOS puede pausar las actualizaciones si cree que el usuario se detuvo. Para una ruta de recolección se configura en `false`.
- **Indicador de background (`showsBackgroundLocationIndicator`):** muestra el indicador del sistema cuando la app usa ubicación en segundo plano. Es obligatorio para transparencia en iOS.
- **Significant location changes:** mecanismo de iOS de bajo consumo que despierta la app ante cambios importantes de celda. La task de expo-location lo combina con `startUpdatingLocation`.
- **Deferred updates:** en iOS, la task nativa puede acumular ubicaciones y entregarlas en lote (`deferredUpdatesInterval`, `deferredUpdatesDistance`) para ahorrar batería.
- **Watcher:** suscripción de ubicación en JavaScript (`watchPositionAsync`). Vive en el runtime de JS y muere cuando el sistema lo suspende o el proceso se cierra.
- **Suscripción / subscription:** objeto que devuelve `watchPositionAsync` y que se debe liberar con `.remove()` para no dejar el GPS encendido.
- **Heartbeat / latido:** muestra o señal periódica que demuestra que el registro sigue activo aunque el vehículo esté detenido. Sin heartbeat, un hueco en el informe puede significar “sin movimiento” o “GPS apagado”, y no se distingue.

### 17.2 iOS

- **Core Location:** framework de Apple para ubicación. `CLLocationManager` es su clase principal.
- **`CLLocationManager`:** objeto nativo que pide y recibe ubicaciones. expo-location crea uno para `watchPositionAsync` y otro para la task de background.
- **`allowsBackgroundLocationUpdates`:** propiedad de `CLLocationManager` que habilita recibir ubicaciones con la app en segundo plano. En `watchPositionAsync` está en `NO`; en la task de background está en `YES`.
- **`UIBackgroundModes`:** arreglo del `Info.plist` que declara los modos de background que usa la app. Para ubicación se agrega `location`.
- **`Info.plist`:** archivo de configuración de la app iOS. El config plugin de expo-location lo modifica durante el prebuild.
- **`NSLocationWhenInUseUsageDescription`:** texto que iOS muestra al pedir permiso “mientras uso la app”. Es obligatorio para ubicación en foreground.
- **`NSLocationAlwaysAndWhenInUseUsageDescription`:** texto para el permiso “siempre”. Sin este permiso, la task no puede registrar en background.
- **Permiso “Always” / “Permitir todo el tiempo”:** autorización de iOS para usar ubicación incluso con la app cerrada o en background. Se puede degradar si el usuario elige “while using”.
- **Low Power Mode:** modo de ahorro de energía de iOS. Reduce la frecuencia de actualizaciones y puede posponer tareas; el buffer persistente evita perder lo ya capturado.
- **Suspensión de la app:** estado en el que iOS congela el runtime de JS. Los timers y callbacks de JS no corren; solo las APIs nativas con background modes siguen despertando la app.
- **Background fetch:** mecanismo de iOS para despertar la app periódicamente y hacer trabajo corto. No es confiable para tracking continuo; por eso se usa location updates.
- **App Store review:** revisión de Apple. Usar ubicación en background exige justificación clara y textos de permiso; si no, puede rechazar la app.

### 17.3 Android

- **Foreground Service (FGS):** servicio de Android que corre con una notificación persistente y tiene prioridad para no ser matado. Es lo que mantiene el tracking vivo en background.
- **`foregroundServiceType`:** atributo del service que declara qué tipo de trabajo hace. Para ubicación debe ser `location`.
- **`FOREGROUND_SERVICE`:** permiso base para iniciar un foreground service.
- **`FOREGROUND_SERVICE_LOCATION`:** permiso específico de Android 14 para un FGS de tipo ubicación. Sin él, el servicio puede lanzar `SecurityException`.
- **`POST_NOTIFICATIONS`:** permiso de Android 13+ para mostrar notificaciones. Sin él, la notificación del FGS puede no verse; el servicio igual puede correr, pero el conductor pierde la señal visual.
- **`ACCESS_FINE_LOCATION`:** permiso de ubicación precisa.
- **`ACCESS_COARSE_LOCATION`:** permiso de ubicación aproximada.
- **`ACCESS_BACKGROUND_LOCATION`:** permiso de ubicación en background (Android 10+). En Android 11+ se concede desde ajustes, no con un simple diálogo.
- **“Allow all the time” / “Permitir todo el tiempo”:** opción de Android para ubicación en background. Si el usuario elige “solo mientras uso la app”, la task no recibe fixes en background.
- **Doze:** modo de bajo consumo de Android que pospone trabajo en background cuando el dispositivo está quieto. Un FGS está exento en general, pero la red y otros recursos pueden limitarse.
- **App Standby:** clasificación de apps por uso que limita el trabajo en background de las menos usadas.
- **Cached app freezer:** mecanismo de Android 11+ que congela procesos en caché. Un FGS evita que la app entre en ese estado.
- **Optimización de batería del OEM:** capa adicional de fabricantes (Xiaomi, Samsung, Huawei, Oppo, Vivo) que puede matar la app aunque tenga FGS. Requiere instrucciones manuales al conductor.
- **Wake lock:** bloqueo que impide que la CPU duerma. El proyecto ya declara `WAKE_LOCK`; no alcanza por sí solo para el tracking.
- **`targetSdkVersion`:** versión de Android contra la que se compila y que activa comportamientos nuevos. Hoy es 34 (Android 14), por eso importa `FOREGROUND_SERVICE_LOCATION`.
- **Manifest (`AndroidManifest.xml`):** archivo donde se declaran permisos, services, activities y metadatos. El manifest local se genera con prebuild.
- **Process death:** muerte del proceso de la app por el sistema, el usuario o un crash. Es el escenario que el buffer persistente debe sobrevivir.
- **Headless JS:** mecanismo de React Native/Android para ejecutar JavaScript sin interfaz, usado por las tareas de background.

### 17.4 Ejecución en background y tareas

- **Runtime de JS:** instancia de JavaScript (Hermes o JSC) donde corre React Native. En iOS se suspende con la app en background; en Android puede congelarse o morir con el proceso.
- **Task de background:** tarea registrada con `TaskManager.defineTask` que el sistema despierta para entregar datos, aunque la app no esté en primer plano.
- **`TaskManager.defineTask`:** API de `expo-task-manager` que asocia un nombre de tarea con una función. Debe ejecutarse en el ámbito global del entry point, no dentro de un componente.
- **Task consumer:** implementación nativa que sabe ejecutar un tipo de tarea. expo-location tiene un consumidor para `location`.
- **Registro de task:** alta de la tarea en el sistema. Si no se registra antes de `startLocationUpdatesAsync`, el arranque falla.
- **`AppState`:** API de React Native que informa `active`, `background` e `inactive`. Se usa para hacer flush al volver a foreground y para saber si la app está visible.
- **Ciclo de vida (lifecycle):** secuencia montar → focus → background → foreground → desmontar. En este diseño, el desmontaje no debe detener el tracking.
- **Throttling:** limitación de frecuencia con la que el sistema entrega eventos o permite trabajo. Explica por qué no conviene pedir updates cada segundo.
- **Watchdog:** mecanismo que vigila si una tarea dejó de reportar y dispara una alerta o un reinicio. No está implementado; es una mejora posible.
- **Task manager (SO):** componente del sistema operativo que decide cuándo despertar una app para una tarea registrada.

### 17.5 Persistencia, estado y buffer

- **AsyncStorage:** almacenamiento clave-valor asíncrono de React Native. Persiste entre sesiones y procesos, pero no está cifrado; no sirve para tokens.
- **Buffer:** colección temporal de muestras pendientes de envío. En este diseño vive en AsyncStorage, no en memoria.
- **Batch / lote:** grupo de muestras que se envían juntas en un request. Se agrupa por `routeId` para no mezclar rutas.
- **Contexto (`TrackingContext`):** datos que identifican a qué ruta pertenece un lote: `routeId`, `vehicleId`, `employeeId`, `routePlanTypeCode` y `deviceId`.
- **Snapshot:** copia de los datos en un instante. El flush toma un snapshot para enviar sin bloquear la escritura de nuevas muestras.
- **Redux store:** estado global en memoria de la app. Se pierde cuando el proceso muere; por eso no puede ser la única fuente de las muestras.
- **Reducer:** función pura que recibe el estado anterior y una acción, y devuelve el estado nuevo. `positionSamplesSlice` y `offlineSlice` son reducers.
- **Acción (`action`):** objeto con `type` y `payload` que describe un cambio. `actionLocationReport` es una acción.
- **Dispatch:** envío de una acción al store. `dispatch(clearPositionSamples())` borra las muestras del estado.
- **Middleware:** capa que intercepta acciones antes o después del reducer. `locationReportMiddleware` hace el POST y decide si encolar.
- **Selector:** función que lee una parte del estado. `useSelector((state) => state.positionSamples.drawnSamples)` es un selector.
- **Hidratación / hydration:** reconstruir el estado de la app a partir de datos persistidos. Hoy no existe para Redux.
- **Persistencia:** guardar datos para que sobrevivan al cierre del proceso. AsyncStorage y Keychain son mecanismos de persistencia; Redux no.
- **Serialización:** convertir objetos a texto/JSON para guardarlos. El buffer se serializa con `JSON.stringify`.
- **`JSON.parse` / `JSON.stringify`:** funciones para convertir entre texto y objetos. Un JSON corrupto puede romper el buffer; por eso `readJson` atrapa errores y devuelve un fallback.
- **Cuota de almacenamiento:** límite de datos que puede guardar la app. AsyncStorage en Android tiene límites prácticos de unos pocos MB.
- **TTL (Time To Live):** tiempo de vida de un dato antes de descartarse. Se puede aplicar a lotes viejos del buffer.
- **Dead code:** código que ya no se ejecuta o no tiene efecto. `AsyncStorage.removeItem('positionSamplesState')` es un ejemplo.

### 17.6 Red, APIs y sistemas distribuidos

- **API:** interfaz de programación que expone el backend. La app consume endpoints HTTP.
- **Endpoint:** URL concreta de la API. `POST /driver/route-executions/inform-position` es el endpoint de muestras.
- **Request / response:** petición del cliente y respuesta del servidor.
- **Payload / body:** datos que viajan en el request. Incluye `metadata`, `samples`, `vehicle_id`, `route_id`, etc.
- **HTTP:** protocolo de comunicación. Los códigos de estado indican el resultado.
- **HTTP 200:** éxito. El lote se puede borrar del buffer.
- **HTTP 401:** no autorizado. Token ausente, vencido o inválido; reintentar sin renovar sesión no sirve.
- **HTTP 4xx:** error del cliente (payload inválido, permisos, ruta inexistente). No se arregla reintentando igual.
- **HTTP 5xx:** error del servidor. Tiene sentido reintentar más tarde.
- **Timeout:** el servidor no respondió a tiempo. Es ambiguo: puede haber procesado el request o no. Por eso se necesita idempotencia.
- **Retry / reintento:** volver a intentar un request que falló.
- **Backoff:** espera creciente entre reintentos para no saturar al servidor. También ahorra batería.
- **Backoff exponencial:** cada reintento espera el doble que el anterior, con un máximo.
- **Idempotencia:** propiedad de un endpoint de producir el mismo efecto si se llama una o varias veces con el mismo payload.
- **Idempotency key / `client_sample_id`:** identificador único que viaja en el request para que el backend detecte duplicados.
- **Deduplicación / dedupe:** eliminar o ignorar registros repetidos. Sin dedupe, un reintento puede duplicar puntos en el informe.
- **At-least-once:** garantía de que cada muestra se intenta enviar al menos una vez; puede haber duplicados.
- **At-most-once:** garantía de que se envía como máximo una vez; puede haber pérdidas.
- **Exactly-once:** garantía de que se envía exactamente una vez. Es muy costosa de implementar de punta a punta; en la práctica se logra con at-least-once + idempotencia.
- **Cola / queue:** estructura FIFO de elementos pendientes. La cola offline actual es un array en memoria.
- **Dead letter queue (DLQ):** cola separada para requests que fallaron definitivamente, para no bloquear los demás.
- **Rate limiting:** límite de requests por unidad de tiempo que impone el servidor. Los lotes grandes al recuperar señal pueden chocar con este límite.
- **Batching:** agrupar varias muestras en un solo request para reducir tráfico.
- **Heartbeat:** señal periódica de vida. En este contexto, muestra o evento que indica que el GPS sigue activo aunque el vehículo no se mueva.
- **`reported_at`:** timestamp del servidor cuando recibe la muestra. Sirve para ordenar el informe aunque los lotes lleguen tarde o desordenados.
- **`ORDER BY`:** cláusula SQL para ordenar resultados. El informe debería ordenar por `reported_at` (o por el timestamp del fix, según el contrato).
- **UTC:** tiempo universal coordinado. Evita ambigüedades de zona horaria.
- **ISO 8601:** formato estándar de fecha/hora (`2026-11-03T12:34:56.000Z`). El código usa `toISOString()`.
- **Clock skew:** diferencia entre el reloj del dispositivo y el del servidor. Puede generar timestamps futuros o pasados.
- **Consistencia eventual:** los datos pueden tardar en estar completos, pero convergen. Un informe puede consultarse antes de que lleguen todos los lotes.
- **Offline-first:** diseño que asume que la red puede faltar y prioriza guardar localmente para enviar después.
- **Race condition:** dos operaciones que se intercalan y producen un resultado incorrecto. Ejemplo: el flush borra muestras mientras la task agrega una nueva.
- **Mutex / lock:** mecanismo para que solo una operación acceda a un recurso a la vez. `withBufferLock` es un lock cooperativo.
- **In-flight:** request o tarea que ya comenzó y todavía no terminó. `flushInFlight` evita dos flush simultáneos.
- **Concurrencia:** ejecución de varias tareas que comparten recursos. Task, AppState y stop pueden llamar a flush a la vez.
- **Transacción:** operación atómica que se completa o se revierte entera. AsyncStorage no ofrece transacciones; por eso el diseño tolera duplicados.
- **Throughput:** cantidad de datos procesados por unidad de tiempo. Relevante para el backend cuando muchos vehículos sincronizan a la vez.

### 17.7 Expo, build y despliegue

- **Expo SDK:** conjunto de paquetes y APIs de Expo. El proyecto usa SDK 51.
- **Expo Go:** app de desarrollo que incluye un conjunto fijo de módulos nativos. No sirve para este fix porque no tiene la config nativa de background.
- **Dev client / development build:** build propio de la app que incluye los módulos y la config nativa del proyecto. Es lo que hay que usar para probar background.
- **Prebuild:** proceso que genera las carpetas `android/` e `ios/` a partir de `app.config.ts`. Se ejecuta con `npx expo prebuild`.
- **Config plugin:** módulo que modifica la configuración nativa durante el prebuild (permisos, Info.plist, manifest, services). El plugin de `expo-location` es el que agrega `UIBackgroundModes` y `FOREGROUND_SERVICE_LOCATION`.
- **EAS (Expo Application Services):** servicios en la nube de Expo para builds, updates y distribución.
- **EAS Build:** build nativo en la nube. Es el camino recomendado para este cambio.
- **EAS Update / OTA:** actualización de JavaScript sin volver a publicar en las tiendas. Solo funciona si el binario es compatible.
- **`runtimeVersion`:** clave que determina qué binarios pueden recibir un OTA. Si cambia la config nativa, hay que bumpearla para no enviar código nuevo a binarios viejos.
- **Channel:** canal de distribución de updates (development, preview, production).
- **`versionCode` / `versionName`:** versión numérica y visible de la app en Android. Se incrementan en cada release.
- **Manifest / `Info.plist`:** archivos nativos de configuración de Android e iOS. El prebuild los regenera.
- **Gradle:** sistema de build de Android. `android/build.gradle` define `targetSdkVersion`, `compileSdkVersion`, etc.
- **CocoaPods:** gestor de dependencias nativas de iOS. Se usa en el prebuild de iOS.
- **Autolinking:** mecanismo que enlaza automáticamente los módulos nativos instalados. `expo-task-manager` ya está enlazado.
- **Native module:** código nativo expuesto a JavaScript. `expo-location` y `expo-task-manager` son módulos nativos.
- **Sentry:** plataforma de monitoreo de errores. El proyecto ya la integra.
- **Feature flag:** interruptor para activar o desactivar una funcionalidad sin publicar de nuevo. Útil para un rollout gradual del nuevo tracking.
- **Piloto / canary:** liberar el cambio a un grupo reducido antes de todos los usuarios.

### 17.8 Seguridad, identidad y privacidad

- **Token:** credencial que autentica al usuario ante la API. En este proyecto es un JWT o similar enviado como `Bearer`.
- **Bearer token:** esquema de autenticación donde el token se envía en el header `Authorization: Bearer <token>`.
- **Keychain:** almacenamiento seguro de iOS. `react-native-keychain` también lo abstrae en Android usando Keystore.
- **`setGenericPassword` / `getGenericPassword`:** API de `react-native-keychain` para guardar y recuperar credenciales. En el proyecto se guarda `username: 'token'`.
- **Secure storage:** almacenamiento cifrado para secretos. AsyncStorage no lo es.
- **IMEI (International Mobile Equipment Identity):** identificador físico del teléfono. No es accesible para apps normales en Android 10+ ni en iOS, y no debe usarse como identidad.
- **Device ID / installation ID:** identificador estable de la instalación de la app, generado por la app o provisto por el sistema. Es la alternativa correcta al IMEI.
- **UUID:** identificador único universal. Se puede generar una vez y guardar en AsyncStorage para identificar la instalación.
- **PII (Personally Identifiable Information):** datos que permiten identificar a una persona. Las coordenadas y los recorridos son datos sensibles; no deben loguearse en producción.
- **Anonimización / minimización:** guardar solo lo necesario y evitar datos personales en logs. Aplica a coordenadas, rutas y empleados.
- **Permiso en runtime:** autorización que el usuario concede mientras usa la app (ubicación, notificaciones, cámara). Puede revocarse en cualquier momento.
- **Consentimiento:** aceptación explícita del usuario para usar ubicación en background. La app debe explicar para qué y permitir revocarlo.

### 17.9 Términos propios de este proyecto

- **Ruta / route execution:** entidad del backend que representa una ruta asignada a un vehículo y un empleado. Tiene `routeId`, estado y sitios.
- **`RouteNavigation`:** pantalla de navegación activa. Hoy contiene los dos watchers y `Report()`.
- **`RouteDetail`:** pantalla de detalle/inicio/reanudación de una ruta.
- **`RouteCollect`:** pantalla de listado de rutas del día.
- **`RouteEnd` / `RouteEndScreen`:** pantalla de confirmación posterior a suspender, abortar o finalizar. Redirige a `RouteCollect` a los 5 segundos.
- **Suspender:** acción de negocio que pausa la ruta. Debe detener el tracking y hacer flush.
- **Reanudar / resume:** volver a poner la ruta en progreso. Debe iniciar tracking de nuevo.
- **Abortar:** cancelar la ruta. Debe detener el tracking y hacer flush.
- **Finalizar / end:** completar la ruta. Debe detener el tracking y hacer flush.
- **Omitir / ignore / skip:** acciones sobre un sitio de la ruta. No afectan al tracking directamente.
- **Collect / visit:** marcar un sitio como recolectado o visitado.
- **`route_plan_type_code`:** tipo de plan de ruta. `FIXED_PATH` usa polyline y markers de puntos GPS; otros planes usan la navegación dinámica.
- **`positionSamples`:** array de muestras pendientes en Redux. Hoy es la fuente de `Report()`.
- **`drawnSamples`:** array de muestras que se dibujan en el mapa. No se limpia con `clearPositionSamples()`; se limpia con `clearDrawnSamples()`.
- **`Report()`:** función actual que toma las muestras de Redux, las envía y las borra. Debe desaparecer del camino de envío.
- **`inform-position`:** endpoint del backend que recibe las muestras (`locationReport`).
- **`locationReport()`:** función de `Service.ts` que hace el POST. Firma posicional: `(metadata, vehicle_id, timestamp, samples, routeId, employee_id, route_plan_type_code)`.
- **`flush`:** enviar al backend las muestras acumuladas en el buffer.
- **`flushBuffer()`:** función propuesta que lee el buffer, agrupa por ruta, envía y borra solo lo confirmado.
- **`startTracking()` / `stopTracking()`:** funciones propuestas para iniciar y detener la task, con permisos y flush.
- **`LOCATION_TASK`:** nombre constante de la task (`ROUTE_LOCATION_TASK`).
- **`activeContext`:** contexto de la ruta que está registrando en este momento. Si es `null`, la task ignora los fixes.
- **`PendingBatch`:** lote pendiente de una ruta, con su contexto y sus muestras.
- **`startedAt`:** timestamp de inicio de la ruta activa. Sirve para descartar fixes viejos que llegaron tarde.
- **Choke point:** único lugar por donde pasan todos los flujos de inicio de ruta. En este diseño, el mount de `RouteNavigation`.
- **`withBufferLock`:** lock cooperativo propuesto para serializar lecturas/escrituras del buffer.
- **`flushInFlight`:** promesa que evita lanzar dos flush simultáneos.
- **`clearTrackingBuffer()`:** función propuesta para borrar todos los lotes al cerrar sesión.
- **`getDeviceId()`:** función propuesta para obtener un id estable de instalación.

### 17.10 Acrónimos y siglas

| Sigla | Significado | Contexto |
|---|---|---|
| GPS | Global Positioning System | Ubicación por satélite |
| GNSS | Global Navigation Satellite System | Familia de sistemas (GPS, Galileo, etc.) |
| A-GPS | Assisted GPS | Asistencia de red para el primer fix |
| FGS | Foreground Service | Servicio Android con notificación persistente |
| OEM | Original Equipment Manufacturer | Fabricante del teléfono (Xiaomi, Samsung, etc.) |
| OTA | Over-The-Air | Actualización de JS sin tienda |
| EAS | Expo Application Services | Builds y updates en la nube |
| SDK | Software Development Kit | Conjunto de herramientas/paquetes |
| API | Application Programming Interface | Interfaz del backend |
| RN | React Native | Framework de la app |
| JS | JavaScript | Lenguaje del runtime |
| TS | TypeScript | Lenguaje tipado del proyecto |
| UI | User Interface | Interfaz visual |
| UX | User Experience | Experiencia de usuario |
| QA | Quality Assurance | Pruebas de calidad |
| PII | Personally Identifiable Information | Datos personales/sensibles |
| UTC | Coordinated Universal Time | Zona horaria de referencia |
| ISO | International Organization for Standardization | Organismo que define formatos como ISO 8601 |
| HTTP | Hypertext Transfer Protocol | Protocolo de red |
| JSON | JavaScript Object Notation | Formato de serialización |
| UUID | Universally Unique Identifier | Identificador único |
| TTL | Time To Live | Tiempo de vida de un dato |
| DLQ | Dead Letter Queue | Cola de mensajes fallidos |
| JWT | JSON Web Token | Formato común de token de autenticación |
| DB | Database | Base de datos |
| CI/CD | Continuous Integration / Continuous Delivery | Automatización de builds y despliegues |
| TTFF | Time To First Fix | Tiempo hasta la primera posición GPS |
