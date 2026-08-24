---
title: "Masterclass: Chatbot de WhatsApp con OCR de tickets y recompensas (caso real desde cero)"
description: "Guía master class paso a paso para construir un chatbot de WhatsApp que recibe fotos de tickets, extrae datos con OCR/IA, valida compras y otorga recompensas. Pensado para alguien que viene de WordPress y arranca desde cero."
pubDate: "2026-07-16"
code: "whatsapp-chatbot-ocr-recompensas"
category: "programacion"
tags:
  ["whatsapp", "chatbot", "ocr", "recompensas", "python", "openai", "automatizacion", "tickets", "principiante"]
difficulty: "intermedio"
readingTime: 22
---

## 🎓 ¿Qué vas a aprender

En esta masterclass construiremos, paso a paso, el sistema que tu cliente necesita:

- 🤖 Cómo funciona un chatbot de WhatsApp por detrás (sin miedo, desde cero)
- 📸 Cómo recibir la foto de un ticket y leerla con OCR + visión IA
- 🗄️ Cómo crear y alimentar una base de datos con los clientes y sus compras
- ✅ Cómo "validar" una compra y otorgar una recompensa automáticamente
- 🧩 Cómo encaja todo esto con la web de WordPress que ya le hiciste
- 🛤️ Una hoja de ruta realista usando lo que aprendas en Platzi

---

# 🚀 Masterclass: Chatbot de WhatsApp con OCR de tickets y recompensas

> 🟢 **Perfil:** Vienes de WordPress, aprendiste con tutoriales y te animaste con Platzi. **💪 Este curso es exactamente para ti.**
> ⏱️ **Duración estimada:** 4–8 semanas de implementación real | 🧰 **Stack sugerido:** Python + OpenAI + WhatsApp API + SQLite/MySQL

---

## 📋 Índice

1. 🧭 [El escenario real y por qué SÍ se puede](#1-🧭-el-escenario-real-y-por-qué-sí-se-puede)
2. 🧩 [Las 5 piezas del sistema](#2-🧩-las-5-piezas-del-sistema)
3. 🗺️ [Arquitectura visual (cómo viaja un mensaje)](#3-🗺️-arquitectura-visual-cómo-viaja-un-mensaje)
4. 📥 [Paso 1: Recibir mensajes de WhatsApp](#4-📥-paso-1-recibir-mensajes-de-whatsapp)
5. 📸 [Paso 2: Recibir la foto del ticket](#5-📸-paso-2-recibir-la-foto-del-ticket)
6. 🔍 [Paso 3: OCR + IA para leer el ticket](#6-🔍-paso-3-ocr--ia-para-leer-el-ticket)
7. 🗄️ [Paso 4: Base de datos y alimentarla](#7-🗄️-paso-4-base-de-datos-y-alimentarla)
8. ✅ [Paso 5: Validar la compra y dar la recompensa](#8-✅-paso-5-validar-la-compra-y-dar-la-recompensa)
9. 🔗 [Paso 6: Conectar con WordPress](#9-🔗-paso-6-conectar-con-wordpress)
10. 🛤️ [Tu hoja de ruta con Platzi](#10-🛤️-tu-hoja-de-ruta-con-platzi)
11. ⚠️ [Riesgos reales y cómo mitigarlos](#11-⚠️-riesgos-reales-y-cómo-mitigarlos)

---

## 1. 🧭 El escenario real y por qué SÍ se puede

Tu cliente ya tiene una web en **WordPress** (hecha por ti, con tutoriales, y quedó contento 🎉). Ahora quiere:

> 💬 Un **chatbot de WhatsApp** que ofrezca **recompensas** a sus clientes. El cliente manda una **foto de su ticket de compra**, el sistema la **lee con OCR**, **guarda los datos en una base de datos** y **valida** la compra para **entregar la recompensa**.

Suena grande, pero se desarma en pedacitos pequeños. Lo que ya hiciste con WordPress demuestra que **sabes aprender y entregar**: este proyecto es la misma película, con otra tecnología. 🍿

La buena noticia: **no necesitas ser ingeniero**. Necesitas entender el flujo y ensamblar servicios que ya existen.

---

## 2. 🧩 Las 5 piezas del sistema

```
 ┌────────────┐   ┌────────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
 │ 1. WhatsApp│ → │ 2. Recibir │ → │ 3. OCR + │ → │ 4. Base  │ → │ 5. Regla │
 │  (entrada) │   │  mensaje   │   │   IA     │   │  datos   │   │ recompensa│
 └────────────┘   └────────────┘   └──────────┘   └──────────┘   └──────────┘
```

| # | Pieza | ¿Para qué? | Herramienta sugerida |
| --- | --- | --- | --- |
| 1️⃣ | Canal WhatsApp | El cliente escribe y manda la foto | API de WhatsApp (Meta) o whatsapp-web.js para arrancar |
| 2️⃣ | Receptor de mensajes | Escucha lo que llega | Un servidor en Python (FastAPI) |
| 3️⃣ | OCR + IA | Lee el ticket y saca datos | OpenAI vision (GPT-4o-mini) o Tesseract |
| 4️⃣ | Base de datos | Guarda clientes y compras | SQLite al inicio, MySQL luego |
| 5️⃣ | Lógica de recompensa | Decide si gana y qué da | Tu código en Python |

---

## 3. 🗺️ Arquitectura visual (cómo viaja un mensaje)

```
👤 Cliente                       🤖 Tu sistema
─────────                       ──────────────
📱 "Hola, quiero mi premio"  →  💬 Bot: "¡Genial! Mándame foto de tu ticket 📸"
📷 (foto del ticket)          →  📥 Servidor recibe la imagen
                                 🔍 IA lee: tienda, fecha, monto, productos
                                 🗄️ Guarda en BD: cliente + compra
                                 ✅ Valida (¿es real? ¿ya la usó?)
                                 🎁 Responde: "¡Ganaste 10% de descuento! 🎉"
```

Ese es **todo** el sistema. Cada cajita la programamos abajo.

---

## 4. 📥 Paso 1: Recibir mensajes de WhatsApp

Para arrancar rápido (sin trámites con Meta), usa **whatsapp-web.js**, que conecta un número real escaneando un QR. Más adelante migras a la **API oficial** si el volumen crece.

```javascript
// bridge.js — conecta WhatsApp y tu backend de Python
const { Client, LocalAuth } = require("whatsapp-web.js");
const axios = require("axios");
const qrcode = require("qrcode-terminal");

const client = new Client({ authStrategy: new LocalAuth() });

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("✅ WhatsApp conectado"));

client.on("message", async (msg) => {
  // Ignorar grupos
  if (msg.isGroupMsg) return;

  const payload = {
    from: msg.from,
    body: msg.body,
    type: msg.type,
  };

  // Si viene imagen (el ticket), la pasamos al backend
  if (msg.type === "image") {
    const media = await msg.downloadMedia();
    payload.image_base64 = media.data;
  }

  const res = await axios.post("http://localhost:8000/webhook", payload);
  if (res.data.reply) await client.sendMessage(msg.from, res.data.reply);
});

client.initialize();
```

Tu backend en Python recibe eso:

```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Incoming(BaseModel):
    from_: str
    body: str = ""
    type: str = "text"
    image_base64: str | None = None

@app.post("/webhook")
async def webhook(data: Incoming):
    # Por ahora, respuesta de prueba
    reply = "¡Hola! 👋 Mándame la foto de tu ticket 📸 para validar tu recompensa."
    return {"reply": reply}
```

> 💡 **Tip Platzi:** Esto es un *webhook*. No es magia: es "alguien me avisa por HTTP cuando llega un mensaje".

---

## 5. 📸 Paso 2: Recibir la foto del ticket

El `bridge.js` ya manda `image_base64` cuando es imagen. En Python la recibimos y la guardamos temporalmente:

```python
import base64, os

TICKET_DIR = "tickets"
os.makedirs(TICKET_DIR, exist_ok=True)

def guardar_ticket(from_, image_base64: str) -> str:
    path = os.path.join(TICKET_DIR, f"{from_}.jpg")
    with open(path, "wb") as f:
        f.write(base64.b64decode(image_base64))
    return path
```

---

## 6. 🔍 Paso 3: OCR + IA para leer el ticket

Aquí está la parte "cuadrada" del proyecto. Tienes dos caminos:

- 🆓 **Tesseract (OCR clásico):** gratis, pero los tickets tienen formatos raros y a veces falla.
- 🤖 **Visión IA (GPT-4o-mini):** le muestras la foto y te devuelve JSON limpio. Mucho más confiable para tickets reales.

Recomendado para tu caso: **visión IA**. Un ejemplo:

```python
from openai import OpenAI

client = OpenAI(api_key="TU_API_KEY")

def leer_ticket(path_imagen: str) -> dict:
    import base64
    with open(path_imagen, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                {"type": "text", "text": """Lee este ticket de compra y devuelve JSON:
                {
                  "tienda": "...",
                  "fecha": "YYYY-MM-DD",
                  "hora": "HH:MM",
                  "monto_total": 0.0,
                  "productos": ["..."],
                  "numero_ticket": "..."
                }
                Si no es un ticket, devuelve {"es_ticket": false}."""}
            ]
        }],
        response_format={"type": "json_object"}
    )
    import json
    return json.loads(resp.choices[0].message.content)
```

📤 Ejemplo de salida:

```json
{
  "tienda": "Farmacia Salud",
  "fecha": "2026-07-15",
  "hora": "18:32",
  "monto_total": 42.50,
  "productos": ["Shampoo", "Vitamina C"],
  "numero_ticket": "F-00123"
}
```

---

## 7. 🗄️ Paso 4: Base de datos y alimentarla

Empieza con **SQLite** (un archivo, cero configuración). Más tarde lo pasas a MySQL para que viva junto a WordPress.

```python
import sqlite3

def init_db():
    conn = sqlite3.connect("recompensas.db")
    c = conn.cursor()
    c.execute("""
      CREATE TABLE IF NOT EXISTS clientes (
        telefono TEXT PRIMARY KEY,
        nombre TEXT,
        puntos INTEGER DEFAULT 0,
        creado_en TEXT
      )
    """)
    c.execute("""
      CREATE TABLE IF NOT EXISTS compras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telefono TEXT,
        tienda TEXT,
        fecha TEXT,
        monto REAL,
        numero_ticket TEXT UNIQUE,
        recompensa_otorgada INTEGER DEFAULT 0
      )
    """)
    conn.commit()
    conn.close()

def registrar_compra(telefono, ticket: dict):
    conn = sqlite3.connect("recompensas.db")
    c = conn.cursor()
    # Evita duplicados por número de ticket
    c.execute("SELECT 1 FROM compras WHERE numero_ticket=?", (ticket["numero_ticket"],))
    if c.fetchone():
        conn.close()
        return "duplicado"

    c.execute(
      "INSERT INTO compras (telefono, tienda, fecha, monto, numero_ticket) VALUES (?,?,?,?,?)",
      (telefono, ticket["tienda"], ticket["fecha"], ticket["monto_total"], ticket["numero_ticket"])
    )
    c.execute("UPDATE clientes SET puntos = puntos + 10 WHERE telefono=?", (telefono,))
    conn.commit()
    conn.close()
    return "ok"
```

---

## 8. ✅ Paso 5: Validar la compra y dar la recompensa

"Validar" no significa 100% a prueba de fraude (eso lo vemos en riesgos). Significa: **¿es un ticket legible, de la tienda correcta y no repetido?**

```python
def procesar(telefono: str, path_imagen: str) -> str:
    ticket = leer_ticket(path_imagen)

    if not ticket.get("es_ticket"):
        return "📛 Eso no parece un ticket. Inténtalo con una foto clara 📸."

    estado = registrar_compra(telefono, ticket)
    if estado == "duplicado":
        return "🔁 Ya registramos ese ticket antes. ¡No vale repetir! 😄"

    # Regla de recompensa simple: monto >= 20 → 10% de descuento
    if ticket["monto_total"] >= 20:
        otorgar_recompensa(telefono, "10% de descuento 🎁")
        return f"🎉 ¡Ticket válido! Ganaste un 10% de descuento. Código: PREMIO-{telefono[-4:]}"
    return "🙏 Gracias, pero tu compra no alcanza para recompensa. ¡Vuelve pronto!"
```

```python
def otorgar_recompensa(telefono, premio):
    conn = sqlite3.connect("recompensas.db") if False else sqlite3.connect("recompensas.db")
    c = conn.cursor()
    c.execute("UPDATE compras SET recompensa_otorgada=1 WHERE telefono=?", (telefono,))
    # Aquí podrías guardar el premio en otra tabla o enviarlo a WordPress
    conn.commit()
    conn.close()
```

---

## 9. 🔗 Paso 6: Conectar con WordPress

Tu cliente ya tiene WordPress. No reinventes: usa la BD de WordPress (MySQL) o expón un **endpoint** en tu bot que WordPress consulte.

Opción simple: tu bot guarda en su propia tabla, y WordPress lee vía una **API REST** que tú creas:

```python
@app.get("/api/cliente/{telefono}")
async def estado_cliente(telefono: str):
    conn = sqlite3.connect("recompensas.db")
    c = conn.cursor()
    c.execute("SELECT puntos FROM clientes WHERE telefono=?", (telefono,))
    row = c.fetchone()
    conn.close()
    return {"telefono": telefono, "puntos": row[0] if row else 0}
```

Luego un plugin/shortcode en WordPress hace `fetch()` a esa URL y muestra los puntos en la web. 🔌

---

## 10. 🛤️ Tu hoja de ruta con Platzi

Aprovecha la promo de BF así:

| Semana | 🎯 Objetivo | 📚 En Platzi busca |
| --- | --- | --- |
| 1️⃣ | Entender HTTP, APIs y webhooks | "Fundamentos de JavaScript", "HTTP" |
| 2️⃣ | Python básico + FastAPI | "Python", "Desarrollo Backend" |
| 3️⃣ | Conectar WhatsApp | "Chatbots con WhatsApp" / tutoriales whatsapp-web.js |
| 4️⃣ | OCR y visión IA | "Inteligencia Artificial", "OpenAI" |
| 5️⃣ | Base de datos (SQLite/MySQL) | "Bases de datos", "SQL" |
| 6️⃣ | Unir todo + recompensas | Proyecto propio 🛠️ |
| 7️⃣+ | Pulir, conectar a WordPress, desplegar | "Deploy", "Docker" |

> 💪 **Recuerda:** hiciste WordPress entero con tutoriales. Este flujo es más acotado. Confía en el proceso.

---

## 11. ⚠️ Riesgos reales y cómo mitigarlos

- 🕵️ **Fraude de tickets:** alguien manda la misma foto dos veces. ✅ Solución: `numero_ticket` único en BD (ya lo hicimos).
- 🖼️ **Foto borrosa:** la IA no lee nada. ✅ Pide "foto clara y bien iluminada" y reintenta.
- 💸 **Costo de IA:** cada foto cuesta unos centavos. ✅ Usa `gpt-4o-mini` y limita intentos.
- 📜 **Políticas de Meta:** la API oficial prohíbe ciertos usos. ✅ Lee las políticas antes de escalar.
- 🔒 **Datos personales:** teléfono = dato sensible. ✅ No los exponas y cumple privacidad.

---

## 🎯 Resumen

- 🤖 El chatbot es un servidor que recibe mensajes y fotos por webhook.
- 📸 El OCR con visión IA convierte la foto del ticket en datos útiles (JSON).
- 🗄️ Una base de datos guarda clientes y compras, evitando duplicados.
- ✅ Una regla simple decide la recompensa y la entrega por WhatsApp.
- 🔗 WordPress se conecta leyendo tu API para mostrar puntos/premios.

Tu cliente confía en ti porque ya le entregaste. 🏆 Este proyecto es el siguiente paso lógico, y con Platzi + tutoriales vas a poder hacerlo.

---

_📘 Guía master class creada como material de referencia y motivación. Los precios, modelos y políticas pueden cambiar; adapta según tu caso real._
