---
title: 'Master Class: Cómo crear un bot de WhatsApp con Meta Cloud API (Guía 2026)'
code: 'IA'
description: 'Guía práctica para emprendimientos, negocios y organismos públicos/privados que quieren automatizar WhatsApp de forma seria, económica y escalable.'
pubDate: 'Aug 26 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Master Class: Cómo crear un bot de WhatsApp con Meta Cloud API (Guía 2026)

> Guía práctica para emprendimientos, negocios y organismos públicos/privados que quieren automatizar WhatsApp de forma seria, económica y escalable.

---

## 0. Antes de empezar: el mapa mental

Para no perderte, tené siempre presente esta cadena de dependencias. Todo lo demás en esta guía es detalle de cada eslabón:

```
Cuenta de Meta Business (Portfolio)
        │
        ▼
App de Meta for Developers (con producto "WhatsApp" agregado)
        │
        ▼
WABA – WhatsApp Business Account (contiene números, plantillas, calidad)
        │
        ▼
Número de teléfono verificado (dedicado, no puede estar en la app normal de WhatsApp)
        │
        ▼
Tokens de acceso (temporal → permanente vía System User)
        │
        ▼
Webhook (tu servidor recibe mensajes entrantes y eventos)
        │
        ▼
Templates (mensajes salientes fuera de la ventana de 24 h)
```

Si en algún punto de la configuración te trabás, ubicá en qué eslabón estás parado: el 90% de los errores de gente que recién arranca son de orden (por ejemplo, intentar mandar un template antes de que Meta lo apruebe, o usar el número personal en vez de uno dedicado).

---

## 1. Conceptos fundamentales (sin jerga)

### 1.1 ¿Qué es la WhatsApp Business Platform?

Es la infraestructura de Meta para que un software (no una persona con el celular en la mano) pueda enviar y recibir mensajes de WhatsApp de forma automatizada, a escala, con reglas de negocio (plantillas aprobadas, ventanas de tiempo, categorías de mensaje, etc.).

Existían dos versiones:

- **On-Premise API**: vos alojabas el servidor. **Meta la discontinuó el 23 de octubre de 2025.** Ya no existe como opción para proyectos nuevos.
- **Cloud API**: alojada por Meta. Es la **única opción vigente hoy**. No necesitás servidores propios para el "motor" de WhatsApp, solo un backend liviano que hable con la API vía HTTPS.

**Conclusión práctica:** si alguien te ofrece o te pide "instalar WhatsApp API en tu servidor", desconfiá: es información vieja.

### 1.2 Términos que vas a usar todo el tiempo

| Término | Qué es | Analogía |
|---|---|---|
| **Business Portfolio / Business Manager** | La cuenta "paraguas" de Meta que agrupa tus activos (páginas, WABAs, apps, cuentas de anuncios) | La carpeta de la empresa |
| **App (Meta for Developers)** | El "conector" técnico: tiene el App ID, App Secret, y ahí agregás el producto WhatsApp | La llave técnica |
| **WABA (WhatsApp Business Account)** | Contiene tus números, plantillas, calificación de calidad y límites de envío | La cuenta de WhatsApp de la empresa (puede tener varios números, ej. Ventas y Soporte) |
| **Número de teléfono** | El número que hablará con tus clientes. Debe ser dedicado (no puede tener WhatsApp normal activo) | La línea telefónica |
| **Access Token** | Credencial para autenticar tus llamadas a la API | La contraseña de la API |
| **System User** | Un "usuario robot" dentro del Business Manager que genera tokens permanentes | El empleado técnico que nunca se enferma |
| **Webhook** | URL de tu servidor donde Meta te avisa en tiempo real: mensajes entrantes, estados de entrega, cambios de calidad | El timbre que te avisa que llegó algo |
| **Template (plantilla)** | Mensaje preaprobado por Meta que podés enviar fuera de la ventana de 24 h | El "guion" autorizado |
| **Ventana de servicio de 24 h** | Desde que el usuario te escribe, tenés 24 h para responder con texto libre gratis | El horario de atención "abierto" |
| **Tier / Límite de mensajería** | Cuántos contactos únicos por día podés contactar de forma proactiva | El "límite de crédito" que sube con buen comportamiento |

### 1.3 Categorías de mensaje (esto define cuánto pagás y qué podés enviar)

Desde julio de 2025 el modelo de cobro **es por mensaje entregado**, ya no por "conversación abierta de 24 h". Hay 4 categorías:

| Categoría | Para qué sirve | ¿Se cobra? |
|---|---|---|
| **Service (Servicio)** | Respuestas de texto libre dentro de la ventana de 24 h iniciada por el usuario | Gratis (hoy; Meta anunció que empieza a cobrarse desde el 1 de octubre de 2026 — revisá la fecha vigente antes de presupuestar) |
| **Utility (Utilidad)** | Confirmaciones de pedido, envíos, turnos, alertas de cuenta — ligadas a una acción del usuario | Se cobra, pero es gratis si se envía dentro de la ventana de 24 h abierta |
| **Authentication (Autenticación)** | Códigos OTP / verificación de login | Se cobra siempre, tarifa más baja, con descuentos por volumen |
| **Marketing** | Promociones, novedades, re-enganche | Se cobra siempre, tarifa más alta, sin descuento por volumen |

**Tip de especialista:** la categoría se define **en la plantilla**, no en el momento de enviar. Diseñá bien tus templates desde el inicio para no pagar de más (por ejemplo, un recordatorio de turno debe ir como Utility, jamás como Marketing).

**Dato clave para performance marketing:** si un usuario llega por un anuncio "Click-to-WhatsApp" (Facebook/Instagram Ads), todos los mensajes con ese usuario son gratis durante **72 horas**, incluidas plantillas de marketing. Es la palanca más fuerte para campañas pagas.

### 1.4 Tiers de mensajería (anti-spam)

Las cuentas nuevas arrancan limitadas a **1.000 contactos únicos iniciados por vos cada 24 h** (Tier 1). Si mantenés buena calidad, subís automáticamente:

| Tier | Contactos únicos/24h |
|---|---|
| Tier 1 | 1.000 |
| Tier 2 | 10.000 |
| Tier 3 | 100.000 |
| Tier 4 | Ilimitado |

La progresión depende del volumen sostenido y de tu **Quality Rating** (calidad percibida por los usuarios: bloqueos, reportes, tasa de lectura). Cuidar la calidad desde el día 1 es más importante que apurar el volumen.

### 1.5 El modelo "Shared Account" (importante si contratás un proveedor)

Antes existía el modelo "On-Behalf-Of", donde una agencia podía operar tu WhatsApp sin que vos tuvieras tu propia WABA. **Ese modelo ya no existe.** Hoy, sí o sí, **la WABA debe ser de tu propiedad** dentro de tu Business Portfolio, incluso si trabajás con un proveedor (BSP) o agencia. Esto es bueno para vos: tus datos, tu número y tu reputación de calidad quedan bajo tu control, y podés cambiar de proveedor sin perder el número ni el historial.

📌 **Regla de oro:** nunca aceptes que un tercero cree "su" WABA para "tu" negocio. Exigí que la WABA quede en tu propio Business Portfolio, con vos como administrador.

---

## 2. Configuración paso a paso en Meta (ruta de menor fricción, 2026)

### 2.1 Requisitos previos

- [ ] Una cuenta personal de Facebook (para acceder a Meta Business Suite)
- [ ] Documentación legal de tu negocio/organismo (CUIT/RUT/registro, según país) para la verificación
- [ ] Un número de teléfono dedicado, capaz de recibir SMS o llamada, que **no** tenga WhatsApp ni WhatsApp Business instalado actualmente (o que estés dispuesto a migrar/desconectar)
- [ ] Un dominio o servidor donde vas a alojar el webhook (puede ser un servicio serverless, no hace falta infraestructura pesada)

### 2.2 Los 4 grandes pasos

| Paso | Qué hacés | Tiempo estimado |
|---|---|---|
| 1. Crear/verificar Business Portfolio | En [business.facebook.com](https://business.facebook.com) creás la cuenta "paraguas" con datos legales de tu empresa | 15 min de carga + 1 a 4 días de revisión de Meta |
| 2. Crear la App y agregar el producto WhatsApp | En [developers.facebook.com](https://developers.facebook.com) creás una App tipo "Business" y le agregás el producto "WhatsApp" | 10 min |
| 3. Configurar número y WABA | Desde el panel **App Dashboard → WhatsApp → API Setup**, agregás tu número de producción (esto genera la WABA automáticamente) | 20-30 min + verificación del número por SMS/llamada |
| 4. Generar token permanente y conectar webhook | Creás un **System User**, le das permisos sobre la App y el WABA, generás el token permanente y configurás la URL del webhook | 30-60 min |

**Ruta más rápida en 2026 — Embedded Signup:** si vas a usar una plataforma (no-code o BSP), casi todas ofrecen el flujo **"Embedded Signup"**: un botón de "Conectar con Facebook" que en 2-3 clics crea la App, la WABA y conecta el número sin que toques el panel de desarrolladores manualmente. Es la vía recomendada si tu objetivo es velocidad y no te importa aprender el detalle técnico de entrada. Si querés entender bien lo que pasa "debajo del capó" (recomendado si vas a escalar), hacé al menos una vez el proceso manual.

### 2.3 Detalle de tokens (fuente frecuente de errores)

| Tipo de token | Duración | Uso |
|---|---|---|
| Token temporal (desde el panel de Meta Developers) | 24 h | Solo para pruebas rápidas en Postman/curl. **Nunca en producción.** |
| Token permanente (vía System User) | No expira (revocable) | El que usa tu backend en producción |

**Cómo generar el token permanente:**
1. Meta Business Suite → Configuración del negocio → Usuarios → **Usuarios del sistema**.
2. Creá un System User con rol "Admin" (o "Empleado" con permisos acotados si preferís principio de mínimo privilegio).
3. Asigná ese System User a tu App y a tu WABA con permiso de `whatsapp_business_messaging` y `whatsapp_business_management`.
4. Generá el token desde la sección del System User, eligiendo esos mismos permisos y sin fecha de expiración.
5. Guardalo en un gestor de secretos (nunca hardcodeado en el repo).

### 2.4 Checklist de configuración completa

- [ ] Business Portfolio verificado
- [ ] App creada con producto WhatsApp agregado
- [ ] WABA generada y número de producción verificado (no de prueba)
- [ ] Perfil de negocio completo: nombre visible, foto, descripción, horario, categoría, sitio web
- [ ] Método de pago cargado en el Business Portfolio (obligatorio para pasar de número de prueba a producción)
- [ ] System User creado con permisos correctos
- [ ] Token permanente generado y guardado en un secret manager
- [ ] Webhook configurado con URL propia (HTTPS válido) y **verify token**
- [ ] Suscripción del webhook a los campos: `messages`, `message_template_status_update`, `account_alerts` (mínimo)
- [ ] Al menos 1 plantilla enviada a revisión y aprobada
- [ ] Prueba end-to-end: enviar y recibir un mensaje real con el número de producción

---

## 3. Lo más importante (y más ignorado) de la documentación oficial

Estos son los puntos donde el 80% de los proyectos se traban o pierden dinero, y que casi nadie lee hasta que ya es tarde:

1. **El número no puede tener WhatsApp activo en el celular.** Si ya usás ese número en la app de WhatsApp o WhatsApp Business, tenés que migrarlo o desvincularlo antes. Decidí esto ANTES de comprometer el número públicamente (tarjetas, cartelería, etc.).

2. **Las plantillas se aprueban por contenido, no por intención.** Meta rechaza templates con lenguaje ambiguo, links acortados sospechosos, o variables `{{1}}` mal explicadas. Regla práctica: sé literal, evitá URLs acortadas propias de marketing agresivo, y no metas variables donde podría inferirse contenido prohibido (salud, finanzas sensibles, etc.).

3. **La categoría de la plantilla la fija Meta, no vos.** Podés declarar "Utility" y que Meta la reclasifique como "Marketing" si detecta intención promocional. Esto cambia el costo. Revisá siempre la categoría final aprobada, no solo la que enviaste.

4. **El Quality Rating es acumulativo y afecta tu límite de envío (Tier).** Bloqueos y reportes de usuarios bajan tu calidad; puede llevar a "flagged" o incluso restricción del número. No compres bases de contactos ni mandes mensajes fríos sin opt-in explícito.

5. **El webhook debe responder rápido (HTTP 200 en pocos segundos)**, si no, Meta lo considera fallido y reintenta, lo que puede duplicar procesamiento. Separá "recibir el evento" de "procesarlo" (colas, procesamiento asíncrono).

6. **Verificá siempre la firma del webhook (`X-Hub-Signature-256`).** Es un error de seguridad muy común dejar el endpoint abierto sin validar que la petición viene realmente de Meta.

7. **Los números de prueba (test number) tienen límites muy bajos** (pocos destinatarios fijos) y **no representan el comportamiento real de producción**. No diseñes tu arquitectura basándote solo en pruebas con el número de test.

8. **Un WABA puede tener hasta 250 plantillas y hasta 20 números** (ampliable). Un Business Portfolio arranca limitado a 2 números registrados (ampliable hasta 20) y hasta 20 WABAs. Planificá la estructura si vas a tener múltiples marcas o áreas (ej. Ventas, Soporte, RRHH).

9. **La ventana de 72 h de anuncios Click-to-WhatsApp es distinta de la ventana de servicio de 24 h.** No las confundas al diseñar automatizaciones de marketing con pauta.

10. **El pricing depende del país del destinatario, no del tuyo.** Si tu negocio está en Argentina pero le hablás a un cliente en Alemania, pagás la tarifa alemana (mucho más cara). Esto es crítico para presupuestar campañas internacionales.

11. **Meta actualiza tarifas trimestralmente** (1 de enero, abril, julio, octubre). No asumas que un precio de hace 6 meses sigue vigente; revisá el rate card oficial antes de presupuestar campañas grandes.

12. **La verificación de negocio (Business Verification) es el cuello de botella real**, no la parte técnica. La configuración técnica se hace en horas; la verificación puede tardar de 1 a 5 días hábiles. Arrancá ese trámite antes de escribir una sola línea de código.

**Documentación oficial de referencia:**
- Cloud API — Get Started: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- WhatsApp Business Accounts (WABA): https://developers.facebook.com/documentation/business-messaging/whatsapp/whatsapp-business-accounts
- Mensajes y plantillas: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates
- Webhooks: https://developers.facebook.com/docs/graph-api/webhooks/getting-started
- Precios oficiales (rate cards): https://developers.facebook.com/docs/whatsapp/pricing
- Políticas de negocio de WhatsApp (uso aceptable): https://business.whatsapp.com/policy

---

## 4. Comparativa de stacks (de cero código a código ligero)

| Nivel | Stack | Complejidad | Costo aprox. | Velocidad para producción | Ideal para |
|---|---|---|---|---|---|
| **1. Cero código** | Plataformas no-code con Embedded Signup (ej. Manychat, Landbot, Chatfuel, Wati, Zoko, tipo builder visual) | Muy baja | Suscripción mensual ($15–$100+ USD) + costo Meta por mensaje | Días (a veces horas) | Emprendedores, comercios chicos, primer piloto, no-técnicos |
| **2. Low-code / automatización visual** | n8n, Make (Integromat), Zapier + conector WhatsApp Cloud API | Baja-media | Gratis (self-hosted n8n) a bajo costo | Días | Equipos con 1 persona "técnica no dev", integraciones con CRMs/planillas |
| **3. BSP con SDK/API propia** | Twilio, 360dialog, Gupshup, MessageBird, Message Central, etc. | Media | Fee mensual + margen sobre precio Meta | 1-2 semanas | Negocios en crecimiento que necesitan lógica custom pero no quieren lidiar con Meta directamente |
| **4. Código ligero directo a Meta Cloud API** | Backend propio (Node.js/Python) + framework tipo `whatsapp-cloud-api`, `baileys`-alternativas oficiales, o simplemente `fetch`/`requests` a la Graph API | Media-alta | Solo el costo de Meta por mensaje + hosting (bajo, ej. $5-20/mes) | 2-4 semanas | Startups técnicas, organismos con equipo dev propio, quien quiere control total y menor costo variable |
| **5. Infraestructura enterprise** | Backend propio + colas (SQS/RabbitMQ), NLU propio o LLM integrado, multi-agente, integraciones ERP/CRM complejas | Alta | Variable, requiere equipo dedicado | 1-3 meses | Organismos públicos grandes, empresas con alto volumen y compliance estricto |

### 🎯 Recomendación del especialista para EMPEZAR

**Si tu objetivo es aprender rápido y validar en producción sin quemar semanas:**

1. **Primera semana:** montá el flujo con una plataforma no-code que use Embedded Signup (nivel 1). Esto te obliga a pasar por toda la configuración real de Meta (WABA, número, templates) sin curva técnica, y ya tenés algo funcionando en producción.
2. **Semana 2-4, en paralelo:** aprendé la Cloud API "a mano" con un backend chico (Node.js + Express, o Python + FastAPI) conectado directo a la Graph API, usando el mismo WABA. Esto te da control total y te prepara para escalar sin depender de terceros ni pagar márgenes de BSP.
3. **A partir de ahí**, decidís con datos reales (volumen, complejidad de lógica, presupuesto) si te quedás en low-code, migrás a un BSP, o seguís 100% con código propio.

Este camino te da lo mejor de los dos mundos: velocidad inmediata + aprendizaje real de la plataforma, sin quedar atado a un solo proveedor.

---

## 5. Buenas prácticas de arquitectura, seguridad, costos y escalabilidad

### 5.1 Arquitectura mínima recomendada

```
Usuario WhatsApp
     │
     ▼
Meta Cloud API  ──(webhook POST)──▶  Tu endpoint HTTPS
                                          │
                                          ▼
                                   Cola / cola liviana (opcional al inicio)
                                          │
                                          ▼
                                 Lógica de negocio (bot / router de intents)
                                          │
                                          ▼
                              Base de datos (conversación, estado, usuarios)
                                          │
                                          ▼
                          Llamada a Graph API (enviar respuesta / template)
```

Para un MVP, no necesitás colas ni microservicios: un solo servicio que responda rápido al webhook y procese en el mismo request ya alcanza. Escalá esa arquitectura solo cuando el volumen lo justifique.

### 5.2 Seguridad — checklist no negociable

- [ ] Validar la firma `X-Hub-Signature-256` en cada webhook recibido
- [ ] Servir el webhook solo por HTTPS (certificado válido, no autofirmado)
- [ ] Guardar tokens y secretos en variables de entorno / secret manager, nunca en el código versionado
- [ ] Rotar el token del System User si sospechás compromiso
- [ ] Implementar rate limiting propio para evitar que un bug en tu bot dispare envíos masivos accidentales
- [ ] Loggear (sin guardar contenido sensible en texto plano) los eventos de entrega y fallas para auditoría
- [ ] Cumplir con normativa de datos personales de tu país/región (en LATAM: habeas data / leyes de protección de datos personales) al almacenar conversaciones
- [ ] Pedir opt-in explícito antes de enviar mensajes proactivos (esto también protege tu Quality Rating)

### 5.3 Costos — cómo estimar antes de lanzar

1. Definí cuántos mensajes de cada categoría vas a enviar por mes (Utility, Authentication, Marketing).
2. Fijate la tarifa vigente para el país de tus destinatarios en el rate card oficial de Meta (cambia trimestralmente).
3. Recordá: los mensajes de **Service** dentro de la ventana de 24 h son gratis hoy, pero **desde el 1° de octubre de 2026 Meta empieza a cobrarlos** según el cronograma anunciado — confirmá la fecha exacta vigente antes de armar tu presupuesto anual.
4. Si vas a usar un BSP, sumá su fee mensual y/o margen por mensaje al costo base de Meta.
5. Los mensajes de Utility y Authentication enviados **dentro** de una ventana de 24 h abierta por el usuario suelen ser gratis o de menor costo: diseñá tus flujos para aprovechar esa ventana en vez de disparar templates innecesariamente.

### 5.4 Escalabilidad inicial

- Empezá en **Tier 1** (1.000 contactos/día) a propósito: es más que suficiente para un piloto y te obliga a cuidar la calidad desde el día uno.
- Monitoreá el **Quality Rating** en el panel de WhatsApp Manager semanalmente.
- Separá lógicamente tus números por función si tu volumen crece (ej. un número para atención, otro para marketing), ya que cada número tiene su propia calidad y límites.
- Diseñá tus templates pensando en reutilización (variables genéricas) para no acumular decenas de plantillas casi idénticas y toparte con el límite de 250 por WABA.
- Si preveés picos (ej. Black Friday, campañas de un organismo público), pedí el aumento de tier con anticipación: la progresión automática necesita historial sostenido, no es instantánea.

---

## 6. Ejemplo de flujo mínimo viable (menú + respuesta + template de utilidad)

Objetivo: un bot que saluda, muestra un menú con botones, responde a la opción elegida y — como ejemplo de mensaje proactivo — envía un template de utilidad (ej. confirmación).

### 6.1 Diagrama del flujo

```
Usuario envía "Hola"
        │
        ▼
Bot responde con mensaje interactivo (lista o botones):
   1) Ver horarios
   2) Hablar con un asesor
   3) Consultar mi pedido
        │
        ├─ Opción 1 → Responde texto con horarios (dentro de ventana 24h, gratis)
        ├─ Opción 2 → Marca conversación como "requiere humano", notifica al equipo
        └─ Opción 3 → Pide número de pedido → Envía template de Utility con el estado
```

### 6.2 Ejemplo de payload — mensaje interactivo de botones (saliente, dentro de ventana de 24h)

```json
{
  "messaging_product": "whatsapp",
  "to": "5493410000000",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": {
      "text": "¡Hola! 👋 Soy el asistente virtual de [Tu Negocio]. ¿En qué te ayudo?"
    },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "opt_horarios", "title": "Ver horarios" } },
        { "type": "reply", "reply": { "id": "opt_asesor", "title": "Hablar con asesor" } },
        { "type": "reply", "reply": { "id": "opt_pedido", "title": "Consultar pedido" } }
      ]
    }
  }
}
```

### 6.3 Ejemplo de template de Utilidad (mensaje proactivo, requiere aprobación previa de Meta)

**Definición del template** (se crea una vez en WhatsApp Manager y se manda a aprobar):

```
Nombre: confirmacion_pedido
Categoría: UTILITY
Idioma: es_AR
Cuerpo:
"Hola {{1}}, tu pedido #{{2}} fue confirmado y está en preparación.
Tiempo estimado de entrega: {{3}}."
```

**Envío del template ya aprobado:**

```json
{
  "messaging_product": "whatsapp",
  "to": "5493410000000",
  "type": "template",
  "template": {
    "name": "confirmacion_pedido",
    "language": { "code": "es_AR" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Julieta" },
          { "type": "text", "text": "48213" },
          { "type": "text", "text": "30-45 minutos" }
        ]
      }
    ]
  }
}
```

### 6.4 Lógica mínima del backend (pseudocódigo)

```
al recibir webhook:
    si tipo == "interactive" y button_reply.id == "opt_horarios":
        enviar_texto(usuario, "Atendemos de lunes a sábado de 9 a 20 h.")
    si tipo == "interactive" y button_reply.id == "opt_asesor":
        marcar_conversacion(usuario, estado="requiere_humano")
        notificar_equipo(usuario)
    si tipo == "interactive" y button_reply.id == "opt_pedido":
        guardar_estado(usuario, esperando="numero_pedido")
    si tipo == "text" y estado_usuario == "esperando numero_pedido":
        pedido = buscar_pedido(texto_usuario)
        enviar_template("confirmacion_pedido", usuario, [pedido.nombre, pedido.numero, pedido.eta])
    si tipo == "text" y contenido == "hola" (primer contacto):
        enviar_menu_botones(usuario)
```

Este es el **piloto mínimo**: con esto ya tenés un bot funcional, con lógica de menú, escalamiento a humano y un template de utilidad real. A partir de acá se agregan integraciones (CRM, base de pedidos, IA generativa para lenguaje libre, etc.).

---

## 7. Checklist final — de la idea a producción

- [ ] Business Portfolio verificado
- [ ] App + WABA + número de producción configurados
- [ ] Token permanente generado (System User) y guardado seguro
- [ ] Webhook validado con firma de Meta
- [ ] Al menos 1 template aprobado (categoría correcta)
- [ ] Flujo mínimo (menú + respuesta + template) probado end-to-end con usuarios reales
- [ ] Opt-in claro para mensajes proactivos
- [ ] Monitoreo de Quality Rating y Tier configurado
- [ ] Presupuesto mensual estimado según categorías y países de destino
- [ ] Plan de escalamiento a humano cuando el bot no resuelve
- [ ] Cumplimiento de protección de datos personales revisado

---

## 8. Recursos oficiales para profundizar

- Documentación general: https://developers.facebook.com/docs/whatsapp
- Cloud API Reference: https://developers.facebook.com/docs/whatsapp/cloud-api
- WhatsApp Flows (formularios dentro del chat): https://developers.facebook.com/docs/whatsapp/flows
- Políticas comerciales de WhatsApp: https://business.whatsapp.com/policy
- Centro de ayuda de WhatsApp Business: https://www.facebook.com/business/help

---

*Guía elaborada con información vigente a agosto de 2026. Las tarifas y políticas de Meta se actualizan trimestralmente: antes de presupuestar o firmar contratos con proveedores, verificá siempre los valores vigentes en la documentación oficial.*