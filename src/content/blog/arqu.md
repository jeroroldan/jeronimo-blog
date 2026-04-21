---
title: "Design Patterns — De Principiante a Experto"
description: "Masterclass completa de Design Patterns con ejemplos en TypeScript, analogías del mundo real y hoja de ruta para dominar los 23 patrones GoF."
pubDate: "2026-04-21"
code: "arqu"
category: "arquitectura"
tags:
  [
    "design-patterns",
    "patrones-de-diseno",
    "typescript",
    "javascript",
    "arquitectura-software",
    "solid",
    "refactorizacion",
  ]
difficulty: "intermedio"
readingTime: 25
---

# 🏗️ MASTERCLASS: Design Patterns — De Principiante a Experto

> **"Un patrón de diseño no es código que copias — es una solución probada que internalizas."**
> — Adaptado de GoF (Gang of Four)

---

## 📋 Tabla de Contenidos

1. [¿Por qué importan los Design Patterns?](#por-que-importan)
2. [Patrones Creacionales](#patrones-creacionales)
3. [Patrones Estructurales](#patrones-estructurales)
4. [Patrones de Comportamiento](#patrones-de-comportamiento)
5. [Hoja de Ruta para el Dominio](#hoja-de-ruta)

---

## ¿Por qué importan los Design Patterns? {#por-que-importan}

### La Analogía del Arquitecto

Imagina que eres arquitecto. Cada vez que un cliente te pide una cocina, no reinventas el concepto de "cocina". Sabés que necesita: ventilación, acceso al agua, espacio de trabajo, almacenamiento. Ese **vocabulario compartido** te permite comunicarte con otros arquitectos al instante.

Los Design Patterns son exactamente eso: **vocabulario compartido entre desarrolladores** para describir soluciones a problemas recurrentes.

### Los 3 Tipos

| Tipo               | Pregunta que responde  | Analogía                |
| ------------------ | ---------------------- | ----------------------- |
| **Creacionales**   | ¿Cómo creo objetos?    | Recetas de cocina       |
| **Estructurales**  | ¿Cómo organizo clases? | Planos arquitectónicos  |
| **Comportamiento** | ¿Cómo se comunican?    | Protocolos diplomáticos |

### ⚡ Consejo de Experto #1

> **No memorices patrones. Memoriza los PROBLEMAS que resuelven.** Cuando encuentres el problema en producción, el patrón vendrá solo a tu mente.

---

# PARTE I: PATRONES CREACIONALES

> _"El problema no es crear objetos — es controlar CÓMO y CUÁNDO se crean."_

---

## Sección 1: Singleton

### El Problema Real

Necesitás que exista **una sola instancia** de una clase en todo tu sistema. Un segundo objeto causaría inconsistencias.

**Ejemplos del mundo real:** Logger, conexión a base de datos, configuración de la aplicación.

### La Analogía

El gobierno de un país. No puede haber dos presidentes simultáneos — todas las decisiones deben pasar por un único punto de autoridad.

### Implementación en TypeScript

```typescript
class DatabaseConnection {
  private static _instance: DatabaseConnection | null = null;
  private _connection: { host: string; db: string } | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection._instance) {
      DatabaseConnection._instance = new DatabaseConnection();
      DatabaseConnection._instance._connection = DatabaseConnection.createConnection();
    }
    return DatabaseConnection._instance;
  }

  private static createConnection(): { host: string; db: string } {
    console.log("🔌 Conectando a la base de datos... (solo ocurre UNA vez)");
    return { host: "localhost", db: "myapp" };
  }

  public query(sql: string): string {
    return `Ejecutando: ${sql} en ${JSON.stringify(this._connection)}`;
  }
}

// Prueba
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2);  // true — ¡son el mismo objeto!
console.log(db1.query("SELECT * FROM users"));
```

### Implementación en Java

```java
public class ConfigManager {
    private static ConfigManager instance;
    private Map<String, String> config = new HashMap<>();

    private ConfigManager() {
        // Constructor privado — nadie puede hacer new ConfigManager()
        config.put("timeout", "30");
        config.put("maxRetries", "3");
    }

    public static synchronized ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }

    public String get(String key) {
        return config.get(key);
    }
}
```

### Implementación en TypeScript

```typescript
class DatabaseConnection {
  private static _instance: DatabaseConnection | null = null;
  private _connection: { host: string; db: string } | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection._instance) {
      DatabaseConnection._instance = new DatabaseConnection();
      DatabaseConnection._instance._connection = DatabaseConnection.createConnection();
    }
    return DatabaseConnection._instance;
  }

  private static createConnection(): { host: string; db: string } {
    console.log("🔌 Conectando a la base de datos... (solo ocurre UNA vez)");
    return { host: "localhost", db: "myapp" };
  }

  public query(sql: string): string {
    return `Ejecutando: ${sql} en ${JSON.stringify(this._connection)}`;
  }
}

// Prueba
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2);  // true — ¡son el mismo objeto!
console.log(db1.query("SELECT * FROM users"));
```

### ⚠️ Trampas Comunes

- **Thread safety**: En entornos multihilo, usá `synchronized` o `double-checked locking`
- **Testing**: Los singletons dificultan los tests unitarios. Considerá usar inyección de dependencias como alternativa.

### ✅ Cuándo usarlo

- Conexiones a recursos costosos (DB, red)
- Configuración global de la app
- Loggers centralizados

### ❌ Cuándo NO usarlo

- Cuando el estado mutable causa problemas en tests
- Cuando necesitás múltiples instancias en el futuro (usá Factory en su lugar)

---

## Sección 2: Factory Method

### El Problema Real

Querés crear objetos sin especificar la clase exacta. El tipo de objeto se decide en runtime.

### La Analogía

Una pizzería franquicia. La casa central define que se debe "hacer una pizza", pero cada sucursal (Buenos Aires, Madrid, NYC) implementa su propia versión con ingredientes locales.

### Implementación

```typescript
interface Notification {
  send(message: string): string;
}

class EmailNotification implements Notification {
  constructor(private email: string) {}

  send(message: string): string {
    return `📧 Email a ${this.email}: ${message}`;
  }
}

class SMSNotification implements Notification {
  constructor(private phone: string) {}

  send(message: string): string {
    return `📱 SMS a ${this.phone}: ${message}`;
  }
}

class PushNotification implements Notification {
  constructor(private deviceId: string) {}

  send(message: string): string {
    return `🔔 Push a device ${this.deviceId}: ${message}`;
  }
}

class NotificationFactory {
  static create(channel: string, target: string): Notification {
    const channels: Record<string, new (target: string) => Notification> = {
      email: EmailNotification,
      sms: SMSNotification,
      push: PushNotification,
    };
    if (!channels[channel]) {
      throw new Error(`Canal desconocido: ${channel}`);
    }
    return new channels[channel](target);
  }
}

// Uso
const notif = NotificationFactory.create("email", "user@example.com");
console.log(notif.send("Tu pedido fue enviado!"));
// 📧 Email a user@example.com: Tu pedido fue enviado!
```

### ⚡ Consejo de Experto #2

> **El Factory Method brilla cuando el tipo de objeto depende de configuración externa, flags de feature, o input del usuario.** Si siempre creás el mismo tipo, un simple constructor es suficiente.

---

## Sección 3: Abstract Factory

### El Problema Real

Necesitás crear **familias de objetos relacionados** que deben ser compatibles entre sí.

### La Analogía

Una fábrica de muebles que tiene dos líneas de producción: **Victoriana** y **Moderna**. Podés pedir silla + mesa + sofá, pero todos deben ser del mismo estilo. No mezclés una silla victoriana con una mesa moderna.

### Implementación

```typescript
interface Button {
  render(): string;
}

interface Checkbox {
  render(): string;
}

interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Familia Windows
class WindowsButton implements Button {
  render(): string { return "[ Windows Button ]"; }
}

class WindowsCheckbox implements Checkbox {
  render(): string { return "[x] Windows Checkbox"; }
}

class WindowsFactory implements UIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
}

// Familia MacOS
class MacButton implements Button {
  render(): string { return "( Mac Button )"; }
}

class MacCheckbox implements Checkbox {
  render(): string { return "(✓) Mac Checkbox"; }
}

class MacFactory implements UIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
}

// Aplicación — no sabe qué familia está usando
function renderUI(factory: UIFactory): void {
  const btn = factory.createButton();
  const chk = factory.createCheckbox();
  console.log(btn.render());
  console.log(chk.render());
}

// En runtime, elegimos la familia
const os = Deno.build.os;
const factory: UIFactory = os === "darwin" ? new MacFactory() : new WindowsFactory();
renderUI(factory);
```

---

## Sección 4: Builder

### El Problema Real

Necesitás construir objetos **complejos paso a paso**, con muchas configuraciones opcionales. Los constructores con 10 parámetros son una pesadilla.

### La Analogía

Hacer una hamburguesa en Five Guys. No pedís todo de una vez al inicio. Vas construyendo: pan → carne → queso → aderezos → extras. El resultado final depende de tus elecciones en cada paso.

### Anti-patrón (el telescoping constructor)

```python
# ❌ MAL — ¿Qué significa cada argumento?
pizza = Pizza("grande", True, False, True, "mozzarella", "tomate", True, 2, False)
```

### Con Builder

```typescript
class Pizza {
  size: string | null = null;
  cheese = false;
  pepperoni = false;
  mushrooms = false;
  extraSauce = false;
  crust = "normal";

  toString(): string {
    const toppings: string[] = [];
    if (this.cheese) toppings.push("queso");
    if (this.pepperoni) toppings.push("pepperoni");
    if (this.mushrooms) toppings.push("hongos");
    const extras = toppings.join(", ") || "sin toppings";
    return `Pizza ${this.size} (${this.crust}) con ${extras}${this.extraSauce ? " + extra salsa" : ""}`;
  }
}

class PizzaBuilder {
  private _pizza = new Pizza();

  size(size: string): PizzaBuilder {
    this._pizza.size = size;
    return this;
  }

  withCheese(): PizzaBuilder {
    this._pizza.cheese = true;
    return this;
  }

  withPepperoni(): PizzaBuilder {
    this._pizza.pepperoni = true;
    return this;
  }

  withMushrooms(): PizzaBuilder {
    this._pizza.mushrooms = true;
    return this;
  }

  extraSauce(): PizzaBuilder {
    this._pizza.extraSauce = true;
    return this;
  }

  thinCrust(): PizzaBuilder {
    this._pizza.crust = "delgada";
    return this;
  }

  build(): Pizza {
    if (!this._pizza.size) {
      throw new Error("El tamaño es obligatorio");
    }
    return this._pizza;
  }
}

// ✅ BIEN — Legible, claro, fluido
const pizza = new PizzaBuilder()
  .size("grande")
  .withCheese()
  .withPepperoni()
  .extraSauce()
  .thinCrust()
  .build();

console.log(pizza.toString());
// Pizza grande (delgada) con queso, pepperoni + extra salsa
```

### ⚡ Consejo de Experto #3

> **El Builder es ideal cuando tenés objetos con más de 4-5 parámetros opcionales.** En Python, las dataclasses con defaults son una alternativa moderna. En Java, considera Lombok's `@Builder`.

---

## Sección 5: Prototype

### El Problema Real

Crear objetos nuevos **clonando instancias existentes** en lugar de instanciarlas desde cero. Útil cuando la inicialización es costosa.

### La Analogía

Clonar una oveja. En lugar de crear una oveja desde ADN genérico (costoso), tomás una oveja existente y la copiás. La copia tiene todas las características de la original.

### Implementación

```typescript
interface Equipment {
  weapon: string;
  armor: string;
}

class GameCharacter {
  constructor(
    public name: string,
    public level: number,
    public skills: string[],
    public equipment: Equipment
  ) {}

  clone(): GameCharacter {
    return new GameCharacter(
      this.name,
      this.level,
      [...this.skills],
      { ...this.equipment }
    );
  }

  toString(): string {
    return `${this.name} (Lv.${this.level}) | Skills: ${this.skills.join(", ")}`;
  }
}

// Personaje base como "plantilla"
const baseWarrior = new GameCharacter(
  "Guerrero",
  1,
  ["Golpe Básico", "Defensa"],
  { weapon: "Espada de madera", armor: "Cuero" }
);

// Clonar y personalizar — sin reinicializar desde cero
const player1 = baseWarrior.clone();
player1.name = "Aragorn";
player1.skills.push("Ataque Especial");

const player2 = baseWarrior.clone();
player2.name = "Boromir";

console.log(baseWarrior.toString());  // Guerrero (Lv.1) | Skills: Golpe Básico, Defensa
console.log(player1.toString());   // Aragorn (Lv.1)  | Skills: Golpe Básico, Defensa, Ataque Especial
console.log(player2.toString());   // Boromir (Lv.1)  | Skills: Golpe Básico, Defensa
```

### ⚠️ Shallow vs Deep Copy — Error Clásico

```typescript
const original = { list: [1, 2, 3] };

// Shallow copy
const shallow = { ...original };

// Deep copy
const deep = JSON.parse(JSON.stringify(original));

original.list.push(99);

console.log(shallow.list);  // [1, 2, 3, 99] ← PELIGRO: compartió referencia
console.log(deep.list);     // [1, 2, 3]     ← SEGURO: copia independiente
```

---

# PARTE II: PATRONES ESTRUCTURALES

> _"La estructura es lo que convierte código funcional en código mantenible."_

---

## Sección 12-13: Adapter

### El Problema Real

Querés usar una clase existente pero su interfaz no coincide con lo que necesitás. No podés modificarla (es código de terceros, legacy, o una librería).

### La Analogía

Un adaptador de enchufe de viaje. Tu notebook americana tiene un enchufe de 2 patas planas. El tomacorriente europeo tiene 2 patas redondas. El adaptador no cambia la electricidad ni tu notebook — **es el intermediario** que hace compatibles dos interfaces incompatibles.

### Implementación

```typescript
// Sistema legacy que NO podemos modificar
class LegacyPaymentSystem {
  makePayment(amountCents: number, currencyCode: string): { status: string; amount: number; currency: string; transactionId: string } {
    return {
      status: "OK",
      amount: amountCents,
      currency: currencyCode,
      transactionId: "TXN-001"
    };
  }
}

// Nueva interfaz que espera nuestro sistema
interface ModernPaymentInterface {
  processPayment(amount: number, currency: string): boolean;
}

// Adapter — convierte una interfaz en otra
class PaymentAdapter implements ModernPaymentInterface {
  constructor(private legacySystem: LegacyPaymentSystem) {}

  processPayment(amount: number, currency: string): boolean {
    const amountCents = Math.floor(amount * 100);
    const result = this.legacySystem.makePayment(amountCents, currency.toUpperCase());
    return result.status === "OK";
  }
}

// Nuestro código solo conoce la interfaz moderna
function checkout(paymentProcessor: ModernPaymentInterface, total: number): void {
  const success = paymentProcessor.processPayment(total, "usd");
  console.log(success ? "✅ Pago exitoso" : "❌ Pago fallido");
}

// Usamos el legacy system a través del adapter
const legacy = new LegacyPaymentSystem();
const adapter = new PaymentAdapter(legacy);
checkout(adapter, 29.99);  // ✅ Pago exitoso
```

### ⚡ Consejo de Experto #4

> **El Adapter es el patrón más usado en integraciones con sistemas externos.** Cada vez que integrés una API de terceros, estás (o deberías estar) usando un Adapter. Aísla el código externo detrás de tu propia interfaz.

---

## Sección 14: Bridge

### El Problema Real

Tenés **dos jerarquías de clases que crecen independientemente** y su combinación causa explosión combinatoria.

### La Analogía

Un control remoto y un televisor. El control remoto (abstracción) y el TV (implementación) son independientes. Podés tener un control básico o avanzado, y un TV Samsung o LG — cualquier combinación funciona sin crear una clase por cada par.

### Sin Bridge — Explosión de Clases

```
# ❌ MAL: CreceN×M clases
RemotoBasicoSamsung
RemotoBasicoLG
RemotoAvanzadoSamsung
RemotoAvanzadoLG
RemotoBasicoSony...
```

### Con Bridge

```typescript
interface Device {
  powerOn(): void;
  setVolume(level: number): void;
  setChannel(channel: number): void;
}

class SamsungTV implements Device {
  powerOn(): void { console.log("Samsung: Encendiendo..."); }
  setVolume(level: number): void { console.log(`Samsung Vol: ${level}`); }
  setChannel(channel: number): void { console.log(`Samsung Canal: ${channel}`); }
}

class LGTV implements Device {
  powerOn(): void { console.log("LG: Iniciando sistema webOS..."); }
  setVolume(level: number): void { console.log(`LG Audio: ${level}`); }
  setChannel(channel: number): void { console.log(`LG Sintonizando: ${channel}`); }
}

// Abstracción (el "lado del control remoto")
class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    this.device.powerOn();
  }

  volumeUp(current: number): void {
    this.device.setVolume(current + 10);
  }
}

class AdvancedRemote extends RemoteControl {
  mute(): void {
    this.device.setVolume(0);
  }

  goToChannel(channel: number): void {
    this.device.setChannel(channel);
  }
}

// N + M clases en lugar de N × M
const samsung = new SamsungTV();
const lg = new LGTV();

const basicRemote = new RemoteControl(samsung);
basicRemote.togglePower();     // Samsung: Encendiendo...

const advancedRemote = new AdvancedRemote(lg);
advancedRemote.togglePower();  // LG: Iniciando sistema webOS...
advancedRemote.mute();          // LG Audio: 0
```

---

## Sección 15: Composite

### El Problema Real

Necesitás tratar **objetos individuales y composiciones de objetos** de manera uniforme. Trabajar con estructuras de árbol.

### La Analogía

El sistema de archivos. Una **carpeta** puede contener archivos o más carpetas. Un **archivo** es una hoja. Podés pedirle el "tamaño" a cualquiera — al archivo te da su tamaño, a la carpeta te da la suma de todos sus hijos. La interfaz es la misma.

```typescript
abstract class FileSystemItem {
  constructor(public name: string) {}

  abstract getSize(): number;
  abstract display(indent?: number): void;
}

class File extends FileSystemItem {
  constructor(name: string, private size: number) {
    super(name);
  }

  getSize(): number {
    return this.size;
  }

  display(indent = 0): void {
    console.log(" ".repeat(indent) + `📄 ${this.name} (${this.size} KB)`);
  }
}

class Folder extends FileSystemItem {
  private children: FileSystemItem[] = [];

  add(item: FileSystemItem): Folder {
    this.children.push(item);
    return this;
  }

  getSize(): number {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  display(indent = 0): void {
    console.log(" ".repeat(indent) + `📁 ${this.name}/ (${this.getSize()} KB)`);
    this.children.forEach(child => child.display(indent + 2));
  }
}

// Construcción del árbol
const root = new Folder("proyecto");
const src = new Folder("src");
src.add(new File("main.ts", 10)).add(new File("utils.ts", 5));

const tests = new Folder("tests");
tests.add(new File("test_main.ts", 8));

root.add(src).add(tests).add(new File("README.md", 2));

root.display();
// 📁 proyecto/ (25 KB)
//   📁 src/ (15 KB)
//     📄 main.ts (10 KB)
//     📄 utils.ts (5 KB)
//   📁 tests/ (8 KB)
//     📄 test_main.ts (8 KB)
//   📄 README.md (2 KB)
```

---

## Sección 16: Decorator

### El Problema Real

Querés agregar funcionalidad a un objeto **sin modificar su clase** y sin usar herencia (que es estática y rígida).

### La Analogía

El café en una cafetería. Empezás con un espresso base. Le agregás leche → cappuccino. Le agregás vainilla → vanilla cappuccino. Cada "decorador" agrega algo sin cambiar el café original.

```typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number { return 1.0; }
  description(): string { return "Café"; }
}

class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost(): number { return this.coffee.cost(); }
  description(): string { return this.coffee.description(); }
}

class MilkDecorator extends CoffeeDecorator {
  cost(): number { return this.coffee.cost() + 0.5; }
  description(): string { return this.coffee.description() + " + Leche"; }
}

class VanillaDecorator extends CoffeeDecorator {
  cost(): number { return this.coffee.cost() + 0.75; }
  description(): string { return this.coffee.description() + " + Vainilla"; }
}

class WhipDecorator extends CoffeeDecorator {
  cost(): number { return this.coffee.cost() + 0.4; }
  description(): string { return this.coffee.description() + " + Crema"; }
}

let myCoffee: Coffee = new SimpleCoffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new VanillaDecorator(myCoffee);
myCoffee = new WhipDecorator(myCoffee);

console.log(myCoffee.description());  // Café + Leche + Vainilla + Crema
console.log(`$${myCoffee.cost().toFixed(2)}`);  // $2.65
```

### ⚡ Consejo de Experto #5

> **Python tiene decoradores de función nativos (`@functools.wraps`). Son literalmente este patrón aplicado a funciones.** Cuando uses `@property`, `@staticmethod`, o un middleware en Django/Flask, estás usando Decorator Pattern.

---

## Sección 17: Facade

### El Problema Real

Un subsistema complejo tiene muchas clases y operaciones. Querés proveer una **interfaz simplificada** para las operaciones más comunes.

### La Analogía

El control de un avión. Para despegar, detrás de escena hay cientos de sistemas: motores, flaps, tren de aterrizaje, sistemas de comunicación, presurización. El piloto interactúa con una **interfaz simplificada** (controles de la cabina) que coordina todo eso.

```typescript
class DVDPlayer {
  on(): void { console.log("DVD: Encendido"); }
  play(movie: string): void { console.log(`DVD: Reproduciendo '${movie}'`); }
  stop(): void { console.log("DVD: Detenido"); }
  off(): void { console.log("DVD: Apagado"); }
}

class Projector {
  on(): void { console.log("Proyector: Encendido"); }
  wideScreenMode(): void { console.log("Proyector: Modo widescreen"); }
  off(): void { console.log("Proyector: Apagado"); }
}

class SoundSystem {
  on(): void { console.log("Sonido: Sistemaendido"); }
  setVolume(level: number): void { console.log(`Sonido: Volumen en ${level}`); }
  surroundSound(): void { console.log("Sonido: Modo surround activado"); }
  off(): void { console.log("Sonido: Apagado"); }
}

class Lights {
  dim(level: number): void { console.log(`Luces: Atenuadas al ${level}%`); }
  on(): void { console.log("Luces: Al 100%"); }
}

class HomeTheaterFacade {
  private dvd = new DVDPlayer();
  private projector = new Projector();
  private sound = new SoundSystem();
  private lights = new Lights();

  watchMovie(movie: string): void {
    console.log("🎬 Preparando cine en casa...");
    this.lights.dim(10);
    this.projector.on();
    this.projector.wideScreenMode();
    this.sound.on();
    this.sound.surroundSound();
    this.sound.setVolume(8);
    this.dvd.on();
    this.dvd.play(movie);
  }

  endMovie(): void {
    console.log("🏠 Cerrando el cine en casa...");
    this.dvd.stop();
    this.dvd.off();
    this.sound.off();
    this.projector.off();
    this.lights.on();
  }
}

// Uso elegante
const theater = new HomeTheaterFacade();
theater.watchMovie("Inception");
```

---

## Sección 18: Flyweight

### El Problema Real

Tenés **millones de objetos similares** que consumen demasiada memoria. La mayor parte de su estado es compartible.

### La Analogía

Los caracteres en un editor de texto. Si abrís un documento con 100,000 letras 'a', no creás 100,000 objetos distintos. Tenés **un objeto** para la letra 'a' (con su fuente, tamaño, color) y solo almacenás la posición de cada ocurrencia.

```typescript
class CharacterFlyweight {
  constructor(
    public char: string,
    public font: string,
    public size: number
  ) {}
}

class FlyweightFactory {
  private static flyweights = new Map<string, CharacterFlyweight>();

  static get(char: string, font: string, size: number): CharacterFlyweight {
    const key = `${char}_${font}_${size}`;
    if (!FlyweightFactory.flyweights.has(key)) {
      FlyweightFactory.flyweights.set(key, new CharacterFlyweight(char, font, size));
    }
    return FlyweightFactory.flyweights.get(key)!;
  }

  static count(): number {
    return FlyweightFactory.flyweights.size;
  }
}

class CharacterContext {
  constructor(
    char: string,
    font: string,
    size: number,
    public x: number,
    public y: number
  ) {
    this.flyweight = FlyweightFactory.get(char, font, size);
  }
  flyweight: CharacterFlyweight;
}

// Simulación: documento con 10,000 caracteres
const document: CharacterContext[] = [];
const text = "Hola mundo".repeat(1000);

for (let i = 0; i < text.length; i++) {
  const ctx = new CharacterContext(text[i], "Arial", 12, i * 8, 0);
  document.push(ctx);
}

console.log(`Caracteres en documento: ${document.length}`);
console.log(`Flyweights únicos creados: ${FlyweightFactory.count()}`);
// Caracteres en documento: 10000
// Flyweights únicos creados: 8  ← ¡Solo 8 objetos para 10,000 caracteres!
```

---

## Sección 19: Proxy

### El Problema Real

Querés controlar el acceso a un objeto — para añadir seguridad, lazy loading, logging, o caching.

### La Analogía

Un asistente ejecutivo. Antes de que llegues al CEO, pasás por el asistente. Este puede: verificar si tenés cita (seguridad), decirte que el CEO está ocupado (control de acceso), tomar nota de tu visita (logging), o decirte que el CEO ya tiene respuesta a tu pregunta (caché).

```typescript
interface DataService {
  fetchData(query: string): string;
}

// Servicio real (costoso)
class RealDataService implements DataService {
  fetchData(query: string): string {
    console.log(`🌐 Consultando base de datos para: '${query}'`);
    return `Resultado de BD para: ${query}`;
  }
}

// Proxy con caché
class CachedDataServiceProxy implements DataService {
  private cache = new Map<string, string>();
  private callCount = 0;

  constructor(private service: RealDataService) {}

  fetchData(query: string): string {
    this.callCount++;

    if (this.cache.has(query)) {
      console.log(`⚡ Cache hit para: '${query}'`);
      return this.cache.get(query)!;
    }

    const result = this.service.fetchData(query);
    this.cache.set(query, result);
    return result;
  }

  stats(): void {
    console.log(`Total llamadas: ${this.callCount}, Cache hits: ${this.cache.size}`);
  }
}

// Proxy con control de acceso
class SecureDataServiceProxy implements DataService {
  constructor(
    private service: DataService,
    private allowedUsers: string[]
  ) {}

  fetchData(query: string, user: string = "anonymous"): string {
    if (!this.allowedUsers.includes(user)) {
      throw new Error(`Usuario '${user}' no tiene acceso`);
    }
    return this.service.fetchData(query);
  }
}

// Uso
const real = new RealDataService();
const proxy = new CachedDataServiceProxy(real);

proxy.fetchData("SELECT * FROM users");   // 🌐 Consulta BD
proxy.fetchData("SELECT * FROM users");   // ⚡ Cache hit
proxy.fetchData("SELECT * FROM orders");  // 🌐 Consulta BD
proxy.fetchData("SELECT * FROM users");   // ⚡ Cache hit
proxy.stats();
```

---

# PARTE III: PATRONES DE COMPORTAMIENTO

> _"El comportamiento es lo que diferencia un sistema que funciona de uno que colabora elegantemente."_

---

## Sección 22: Chain of Responsibility

### El Problema Real

Una solicitud debe ser procesada por una cadena de handlers. Cada uno decide si la procesa o la pasa al siguiente.

### La Analogía

El sistema judicial. Una demanda va primero al juzgado de primera instancia. Si se apela, va a la cámara de apelaciones. Si se apela de nuevo, a la Corte Suprema. Cada nivel puede resolver o pasar al siguiente.

```typescript
class Request {
  constructor(public amount: number, public level: string) {}
}

abstract class ApprovalHandler {
  protected next: ApprovalHandler | null = null;

  constructor(protected name: string, protected limit: number) {}

  setNext(handler: ApprovalHandler): ApprovalHandler {
    this.next = handler;
    return handler;
  }

  handle(request: Request): string {
    if (request.amount <= this.limit) {
      return `✅ ${this.name} aprobó $${request.amount.toFixed(2)}`;
    } else if (this.next) {
      return this.next.handle(request);
    } else {
      return `❌ Ningún handler puede aprobar $${request.amount.toFixed(2)}`;
    }
  }
}

class TeamLead extends ApprovalHandler {
  constructor() { super("Team Lead", 1_000); }
}

class Manager extends ApprovalHandler {
  constructor() { super("Manager", 10_000); }
}

class Director extends ApprovalHandler {
  constructor() { super("Director", 100_000); }
}

class CEO extends ApprovalHandler {
  constructor() { super("CEO", Infinity); }
}

const lead = new TeamLead();
const manager = new Manager();
const director = new Director();
const ceo = new CEO();

lead.setNext(manager).setNext(director).setNext(ceo);

[500, 5_000, 50_000, 500_000].forEach(amount => {
  console.log(lead.handle(new Request(amount, "normal")));
});
```

---

## Sección 23: Command

### El Problema Real

Encapsular una **operación como un objeto**. Esto permite: deshacer/rehacer, colas de operaciones, logging, y transacciones.

### La Analogía

Un restaurante. El mesero toma tu **pedido** (command) y lo lleva a la cocina. El pedido es un objeto: tiene la información completa, puede ser cancelado, puede guardarse para análisis posterior.

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class TextEditor {
  text = "";
}

class WriteCommand implements Command {
  constructor(private editor: TextEditor, private text: string) {}

  execute(): void {
    this.editor.text += this.text;
  }

  undo(): void {
    this.editor.text = this.editor.text.slice(0, -this.text.length);
  }
}

class DeleteCommand implements Command {
  private deleted = "";

  constructor(private editor: TextEditor, private chars: number) {}

  execute(): void {
    this.deleted = this.editor.text.slice(-this.chars);
    this.editor.text = this.editor.text.slice(0, -this.chars);
  }

  undo(): void {
    this.editor.text += this.deleted;
  }
}

class EditorHistory {
  private history: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    if (this.history.length > 0) {
      this.history.pop()!.undo();
    }
  }
}

const editor = new TextEditor();
const history = new EditorHistory();

history.execute(new WriteCommand(editor, "Hola"));
history.execute(new WriteCommand(editor, " Mundo"));
console.log(`"${editor.text}"`);  // "Hola Mundo"

history.undo();
console.log(`"${editor.text}"`);  // "Hola"

history.undo();
console.log(`"${editor.text}"`);  // ""
```

---

## Sección 24: Iterator

### El Problema Real

Proveer una forma de **recorrer una colección** sin exponer su representación interna.

### La Analogía

El índice de un libro. No necesitás saber si el libro está impreso, en PDF, en audio — el índice te provee una forma uniforme de navegar los capítulos.

```typescript
class TreeNode {
  children: TreeNode[] = [];

  constructor(public value: number) {}

  addChild(node: TreeNode): TreeNode {
    this.children.push(node);
    return this;
  }
}

class BreadthFirstIterator implements Iterator<number> {
  private queue: TreeNode[] = [];

  constructor(root: TreeNode) {
    this.queue = [root];
  }

  next(): IteratorResult<number> {
    if (this.queue.length === 0) {
      return { done: true, value: undefined as any };
    }
    const node = this.queue.shift()!;
    this.queue.push(...node.children);
    return { done: false, value: node.value };
  }
}

class DepthFirstIterator implements Iterator<number> {
  private stack: TreeNode[] = [];

  constructor(root: TreeNode) {
    this.stack = [root];
  }

  next(): IteratorResult<number> {
    if (this.stack.length === 0) {
      return { done: true, value: undefined as any };
    }
    const node = this.stack.pop()!;
    this.stack.push(...node.children.reverse());
    return { done: false, value: node.value };
  }
}

const root = new TreeNode(1);
const n2 = new TreeNode(2);
const n3 = new TreeNode(3);
root.addChild(n2).addChild(n3);
n2.addChild(new TreeNode(4)).addChild(new TreeNode(5));
n3.addChild(new TreeNode(6));

console.log("BFS:", [...new BreadthFirstIterator(root)]);  // [1, 2, 3, 4, 5, 6]
console.log("DFS:", [...new DepthFirstIterator(root)]);  // [1, 2, 4, 5, 3, 6]
```

---

## Sección 25: Mediator

### El Problema Real

Muchos objetos se comunican entre sí, creando dependencias caóticas. Un **mediador centraliza** la comunicación.

### La Analogía

El controlador de tráfico aéreo. Los aviones no se hablan entre sí directamente — todos hablan con la torre de control, que coordina el tráfico. Si los aviones se coordinaran directamente, sería un caos (y muy peligroso).

```typescript
interface Mediator {
  notify(sender: object, event: string, data?: string): void;
}

class ChatRoom implements Mediator {
  private users = new Map<string, User>();

  register(user: User): void {
    this.users.set(user.name, user);
    user.mediator = this;
  }

  notify(sender: object, event: string, data: string = ""): void {
    if (event === "message") {
      const senderName = (sender as User).name;
      this.users.forEach((user, name) => {
        if (name !== senderName) {
          user.receive(`[${senderName}]: ${data}`);
        }
      });
    } else if (event === "private") {
      const [targetName, message] = data.split("|");
      if (this.users.has(targetName)) {
        this.users.get(targetName)!.receive(`[Privado de ${(sender as User).name}]: ${message}`);
      }
    }
  }
}

class User {
  mediator: Mediator | null = null;

  constructor(public name: string) {}

  send(message: string): void {
    console.log(`${this.name} dice: ${message}`);
    this.mediator!.notify(this, "message", message);
  }

  privateTo(target: string, message: string): void {
    this.mediator!.notify(this, "private", `${target}|${message}`);
  }

  receive(message: string): void {
    console.log(`  → ${this.name} recibe: ${message}`);
  }
}

const room = new ChatRoom();
const alice = new User("Alice");
const bob = new User("Bob");
const charlie = new User("Charlie");
[alice, bob, charlie].forEach(u => room.register(u));

alice.send("¡Hola a todos!");
bob.privateTo("Alice", "Hola Alice, hablamos después");
```

---

## Sección 26: Memento

### El Problema Real

Necesitás **guardar y restaurar el estado** de un objeto sin violar encapsulamiento.

### La Analogía

Los checkpoints en un videojuego. El juego guarda tu estado exacto (posición, vida, items) en un punto. Si morís, volvés al último checkpoint. El jugador no necesita saber cómo se almacena ese estado.

```typescript
interface GameState {
  level: number;
  health: number;
  position: [number, number];
  inventory: string[];
}

class GameMemento {
  private state: GameState;

  constructor(state: GameState) {
    this.state = { ...state, inventory: [...state.inventory] };
  }

  restore(): GameState {
    return { ...this.state, inventory: [...this.state.inventory] };
  }
}

class Game {
  state: GameState = { level: 1, health: 100, position: [0, 0], inventory: [] };

  save(): GameMemento {
    console.log(`💾 Guardando checkpoint: ${JSON.stringify(this.state)}`);
    return new GameMemento(this.state);
  }

  load(memento: GameMemento): void {
    this.state = memento.restore();
    console.log(`⏮️  Estado restaurado: ${JSON.stringify(this.state)}`);
  }

  takeDamage(dmg: number): void {
    this.state.health -= dmg;
  }

  move(x: number, y: number): void {
    this.state.position = [x, y];
  }
}

class SaveManager {
  private saves: GameMemento[] = [];

  save(game: Game): void {
    this.saves.push(game.save());
  }

  undo(game: Game): void {
    if (this.saves.length > 1) {
      this.saves.pop();
      game.load(this.saves[this.saves.length - 1]);
    }
  }
}

const game = new Game();
const saves = new SaveManager();
saves.save(game);

game.move(10, 5);
game.takeDamage(30);
saves.save(game);

game.move(20, 15);
game.takeDamage(80);
console.log(`Estado actual: ${JSON.stringify(game.state)}`);  // Health: -10 — ¡muerto!

saves.undo(game);  // Volvemos al checkpoint anterior
console.log(`Tras cargar: ${JSON.stringify(game.state)}`);  // Health: 70
```

---

## Sección 27: Observer

### El Problema Real

Cuando un objeto cambia de estado, otros objetos dependientes deben ser notificados automáticamente.

### La Analogía

Suscripción a un canal de YouTube. El canal (Subject) no sabe cuántos suscriptores tiene ni quiénes son exactamente. Cuando sube un video, **notifica a todos los suscriptores**. Cada suscriptor (Observer) reacciona a su manera (ve el video, lo ignora, lo comparte).

```typescript
interface Observer {
  update(event: string, data: any): void;
}

class Observable {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notifyAll(event: string, data: any): void {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

class StockMarket extends Observable {
  private prices = new Map<string, number>();

  updatePrice(symbol: string, price: number): void {
    const oldPrice = this.prices.get(symbol) || price;
    this.prices.set(symbol, price);
    const change = oldPrice ? ((price - oldPrice) / oldPrice * 100) : 0;
    this.notifyAll("price_change", { symbol, price, changePct: change });
  }
}

class PriceAlert implements Observer {
  constructor(private symbol: string, private threshold: number) {}

  update(event: string, data: any): void {
    if (data.symbol === this.symbol && data.price > this.threshold) {
      console.log(`🚨 ALERTA: ${this.symbol} superó $${this.threshold} → $${data.price.toFixed(2)}`);
    }
  }
}

class PortfolioTracker implements Observer {
  constructor(private holdings: Record<string, number>) {}

  update(event: string, data: any): void {
    const symbol = data.symbol;
    if (symbol in this.holdings) {
      const value = this.holdings[symbol] * data.price;
      const chg = data.changePct;
      console.log(`💼 Portfolio: ${symbol} → $${data.price.toFixed(2)} (${chg >= 0 ? "+" : ""}${chg.toFixed(1)}%) | Valor: $${value.toFixed(2)}`);
    }
  }
}

const market = new StockMarket();
const alert = new PriceAlert("AAPL", 150.0);
const portfolio = new PortfolioTracker({ AAPL: 10, GOOG: 2 });

market.subscribe(alert);
market.subscribe(portfolio);

market.updatePrice("AAPL", 148.50);
market.updatePrice("AAPL", 152.00);
market.updatePrice("GOOG", 2800.00);
```

---

## Sección 28: State

### El Problema Real

Un objeto **cambia su comportamiento** según su estado interno. El objeto parece cambiar de clase.

### La Analogía

Un semáforo. El mismo objeto (semáforo) se comporta diferente según su estado (rojo/verde/amarillo). La transición entre estados sigue reglas definidas.

```typescript
interface OrderState {
  confirm(order: Order): void;
  ship(order: Order): void;
  deliver(order: Order): void;
  cancel(order: Order): void;
}

class PendingState implements OrderState {
  confirm(order: Order): void {
    console.log("✅ Pedido confirmado");
    order.state = new ConfirmedState();
  }
  ship(order: Order): void { console.log("❌ Debes confirmar primero"); }
  deliver(order: Order): void { console.log("❌ Debes confirmar y enviar primero"); }
  cancel(order: Order): void {
    console.log("🚫 Pedido cancelado desde pendiente");
    order.state = new CancelledState();
  }
}

class ConfirmedState implements OrderState {
  confirm(order: Order): void { console.log("⚠️ Ya está confirmado"); }
  ship(order: Order): void {
    console.log("📦 Pedido enviado");
    order.state = new ShippedState();
  }
  deliver(order: Order): void { console.log("❌ Debe enviarse primero"); }
  cancel(order: Order): void {
    console.log("🚫 Pedido cancelado (confirmado)");
    order.state = new CancelledState();
  }
}

class ShippedState implements OrderState {
  confirm(order: Order): void { console.log("❌ Ya fue enviado"); }
  ship(order: Order): void { console.log("⚠️ Ya está enviado"); }
  deliver(order: Order): void {
    console.log("🎉 Pedido entregado");
    order.state = new DeliveredState();
  }
  cancel(order: Order): void { console.log("❌ No se puede cancelar en tránsito"); }
}

class DeliveredState implements OrderState {
  confirm(order: Order): void { console.log("❌ Ya fue entregado"); }
  ship(order: Order): void { console.log("❌ Ya fue entregado"); }
  deliver(order: Order): void { console.log("⚠️ Ya fue entregado"); }
  cancel(order: Order): void { console.log("❌ No se puede cancelar post-entrega"); }
}

class CancelledState implements OrderState {
  confirm(order: Order): void { console.log("❌ Pedido cancelado, no se puede reactivar"); }
  ship(order: Order): void { console.log("❌ Pedido cancelado"); }
  deliver(order: Order): void { console.log("❌ Pedido cancelado"); }
  cancel(order: Order): void { console.log("⚠️ Ya está cancelado"); }
}

class Order {
  state: OrderState = new PendingState();

  constructor(public orderId: string) {}

  confirm(): void { this.state.confirm(this); }
  ship(): void { this.state.ship(this); }
  deliver(): void { this.state.deliver(this); }
  cancel(): void { this.state.cancel(this); }
}

const order = new Order("ORD-001");
order.ship();
order.confirm();
order.ship();
order.deliver();
order.cancel();
```

---

## Sección 29: Strategy

### El Problema Real

Definir una **familia de algoritmos intercambiables**. El cliente elige el algoritmo en runtime.

### La Analogía

GPS con opciones de ruta. El destino es el mismo, pero podés elegir: **ruta más rápida**, **ruta sin autopistas**, **ruta más económica**. Cada estrategia te lleva al mismo lugar de forma diferente.

```typescript
interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    const arr = [...data];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    console.log("  (usando BubbleSort - O(n²))");
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    if (data.length <= 1) return data;
    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const middle = data.filter(x => x === pivot);
    const right = data.filter(x => x > pivot);
    console.log("  (usando QuickSort - O(n log n))");
    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class Sorter {
  private strategy: SortStrategy;

  constructor(strategy?: SortStrategy) {
    this.strategy = strategy || new QuickSort();
  }

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

const data = [64, 34, 25, 12, 22, 11, 90];
const sorter = new Sorter();

console.log("Con QuickSort:");
console.log(sorter.sort(data));

sorter.setStrategy(new BubbleSort());
console.log("Con BubbleSort:");
console.log(sorter.sort(data));
```

### ⚡ Consejo de Experto #6

> **Strategy y Dependency Injection son hermanos.** Cuando inyectás un repositorio, un logger, o un servicio de pagos en tu clase, estás usando Strategy. Es el fundamento de código testeable.

---

## Sección 30: Template Method

### El Problema Real

Definir el **esqueleto de un algoritmo** en una clase base, dejando que las subclases implementen los pasos específicos.

### La Analogía

Una receta de cocina en una franquicia. McDonald's define: (1) calentar plancha, (2) cocinar carne, (3) armar hamburguesa, (4) empaquetar. Cada local implementa "armar hamburguesa" diferente (BigMac vs Quarter Pounder), pero el esqueleto es el mismo.

```typescript
abstract class DataProcessor {
  process(filename: string): void {
    let data = this.readData(filename);
    data = this.validate(data);
    data = this.transform(data);
    this.save(data);
    this.sendReport(data);
  }

  abstract readData(filename: string): any[];
  validate(data: any[]): any[] { return data.filter(row => row); }
  abstract transform(data: any[]): any[];
  abstract save(data: any[]): void;
  sendReport?(data: any[]): void {}
}

class CSVProcessor extends DataProcessor {
  readData(filename: string): any[] {
    console.log(`📂 Leyendo CSV: ${filename}`);
    return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
  }

  transform(data: any[]): any[] {
    console.log("🔄 Normalizando nombres...");
    return data.map(row => ({ ...row, name: (row.name as string).toUpperCase() }));
  }

  save(data: any[]): void {
    console.log(`💾 Guardando ${data.length} registros en DB`);
  }
}

class JSONProcessor extends DataProcessor {
  readData(filename: string): any[] {
    console.log(`📂 Leyendo JSON: ${filename}`);
    return [{ id: 1, score: 85 }, { id: 2, score: 92 }];
  }

  transform(data: any[]): any[] {
    console.log("🔄 Calculando grades...");
    return data.map(row => ({ ...row, grade: row.score >= 90 ? "A" : "B" }));
  }

  save(data: any[]): void {
    console.log(`💾 Exportando ${data.length} registros a JSON`);
  }

  sendReport(data: any[]): void {
    console.log(`📧 Reporte enviado: ${data.length} registros procesados`);
  }
}

const csvProc = new CSVProcessor();
csvProc.process("usuarios.csv");
console.log();
const jsonProc = new JSONProcessor();
jsonProc.process("scores.json");
```

---

## Sección 31: Visitor

### El Problema Real

Añadir nuevas operaciones a una jerarquía de clases sin modificarlas. Separa el algoritmo de la estructura de datos.

### La Analogía

Un auditor fiscal. Visita diferentes tipos de negocios (restaurante, tienda, banco) y aplica el cálculo de impuestos apropiado para cada tipo. El auditor (visitor) contiene la lógica; los negocios (visited) solo lo reciben.

```typescript
interface ASTNode {
  accept(visitor: Visitor): any;
}

class NumberNode implements ASTNode {
  constructor(public value: number) {}
  accept(visitor: Visitor): any { return visitor.visitNumber(this); }
}

class AddNode implements ASTNode {
  constructor(public left: ASTNode, public right: ASTNode) {}
  accept(visitor: Visitor): any { return visitor.visitAdd(this); }
}

class MultiplyNode implements ASTNode {
  constructor(public left: ASTNode, public right: ASTNode) {}
  accept(visitor: Visitor): any { return visitor.visitMultiply(this); }
}

interface Visitor {
  visitNumber(node: NumberNode): any;
  visitAdd(node: AddNode): any;
  visitMultiply(node: MultiplyNode): any;
}

class EvaluatorVisitor implements Visitor {
  visitNumber(node: NumberNode): number { return node.value; }
  visitAdd(node: AddNode): number { return node.left.accept(this) as number + node.right.accept(this) as number; }
  visitMultiply(node: MultiplyNode): number { return node.left.accept(this) as number * node.right.accept(this) as number; }
}

class PrinterVisitor implements Visitor {
  visitNumber(node: NumberNode): string { return node.value.toString(); }
  visitAdd(node: AddNode): string { return `(${node.left.accept(this)} + ${node.right.accept(this)})`; }
  visitMultiply(node: MultiplyNode): string { return `(${node.left.accept(this)} × ${node.right.accept(this)})`; }
}

const tree = new MultiplyNode(
  new AddNode(new NumberNode(3), new NumberNode(4)),
  new NumberNode(2)
);

const evaluator = new EvaluatorVisitor();
const printer = new PrinterVisitor();

console.log(tree.accept(printer));
console.log(tree.accept(evaluator));
```

---

# Hoja de Ruta para el Dominio {#hoja-de-ruta}

## Nivel 1: Reconocimiento (Semanas 1-2)

- [ ] Lee cada patrón una vez
- [ ] Identifica el **problema** que resuelve
- [ ] Anota una analogía propia

## Nivel 2: Implementación (Semanas 3-4)

- [ ] Implementa cada patrón desde cero (sin copiar)
- [ ] Modifica el ejemplo para un caso de tu trabajo

## Nivel 3: Aplicación (Mes 2)

- [ ] Identifica patrones en código que ya usás (Spring, Django, React)
- [ ] Refactorizá un módulo propio usando un patrón apropiado

## Nivel 4: Dominio (Mes 3+)

- [ ] Explicá cada patrón a un colega sin leer notas
- [ ] Cuestioná cuándo NO usar un patrón
- [ ] Combiná patrones (ej: Factory + Singleton, Observer + Command)

---

## Guía de Selección Rápida

```
¿Problema de CREACIÓN?
├── Una sola instancia → Singleton
├── Tipo depende del runtime → Factory Method
├── Familia de objetos → Abstract Factory
├── Objeto con muchos parámetros → Builder
└── Clonar objetos costosos → Prototype

¿Problema de ESTRUCTURA?
├── Interfaz incompatible → Adapter
├── Dos jerarquías independientes → Bridge
├── Árbol de objetos uniformes → Composite
├── Añadir funcionalidad sin modificar → Decorator
├── Simplificar subsistema complejo → Facade
├── Millones de objetos similares → Flyweight
└── Controlar acceso → Proxy

¿Problema de COMPORTAMIENTO?
├── Cadena de handlers → Chain of Responsibility
├── Operaciones como objetos (undo/redo) → Command
├── Recorrer colecciones → Iterator
├── Comunicación centralizada → Mediator
├── Guardar/restaurar estado → Memento
├── Notificar cambios a múltiples → Observer
├── Comportamiento según estado → State
├── Algoritmos intercambiables → Strategy
├── Esqueleto de algoritmo → Template Method
└── Operaciones sobre estructura → Visitor
```

---

## Los 10 Mandamientos del Experto en Design Patterns

1. **No aplicarás patrones donde no hay problema.** Over-engineering es tan dañino como spaghetti code.
2. **Aprenderás el problema antes que la solución.** El patrón es la consecuencia, no el objetivo.
3. **Combinarás patrones.** Los sistemas reales raramente usan uno solo.
4. **Leerás código open source.** Spring, Django, JUnit están llenos de patrones en producción.
5. **Escribirás tests antes de refactorizar.** Los patrones sin tests son una trampa.
6. **Cuestionarás si la herencia es la respuesta.** Composición > Herencia en el 80% de casos.
7. **Nombrarás tus clases con el patrón.** `UserRepository`, `NotificationFactory`, `OrderObserver`.
8. **Revisarás tu propio código con ojos frescos.** Los patrones emergen al refactorizar.
9. **Enseñarás lo que aprendiste.** Explicar es la prueba máxima de comprensión.
10. **Aceptarás que los patrones evolucionan.** Lo que era un Singleton en 2000 hoy es un IoC container.

---

> _"Cualquier tonto puede escribir código que una computadora entiende. Los buenos programadores escriben código que los humanos entienden."_
> — Martin Fowler

---

_Masterclass creada con ejemplos en TypeScript. Los conceptos son transferibles a cualquier lenguaje orientado a objetos._
