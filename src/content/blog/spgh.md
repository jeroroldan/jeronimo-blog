---
title: "Masterclass de Ingeniería de Software Moderna: De Programador a Arquitecto de Sistemas Escalables"
description: "Guía definitiva para transformar tu mentalidad de programación a ingeniería de software, cubriendo código limpio, arquitectura, escalabilidad, mejores prácticas y el futuro del desarrollo de software."
pubDate: "2022-07-22"
heroImage: "../../assets/blog-placeholder-1.jpg"

---

# 🏗️ MASTERCLASS: Ingeniería de Software Moderna
### De Programador a Arquitecto de Sistemas Escalables

> *"Cualquiera puede escribir código que una computadora entienda. Los buenos ingenieros escriben código que los humanos puedan entender."* — Martin Fowler

---

## 📋 Tabla de Contenidos

1. [Código Limpio](#1-código-limpio)
2. [Arquitectura Frontend](#2-arquitectura-frontend)
3. [Arquitectura Backend](#3-arquitectura-backend)
4. [Fundamentos de Escalabilidad](#4-fundamentos-de-escalabilidad)
5. [Pensamiento de Diseño de Software](#5-pensamiento-de-diseño-de-software)
6. [Sistemas Modulares](#6-sistemas-modulares)
7. [Ingeniería Cloud-Ready](#7-ingeniería-cloud-ready)
8. [Caso de Estudio Práctico](#8-caso-de-estudio-práctico)
9. [Errores Comunes de Ingeniería](#9-errores-comunes-de-ingeniería)
10. [El Futuro de la Ingeniería de Software](#10-el-futuro-de-la-ingeniería-de-software)

---

# 1. Código Limpio

## ¿Qué significa realmente "Código Limpio"?

El código limpio no es simplemente código que "funciona". Es código que:

- **Se lee como prosa**: cualquier desarrollador puede entenderlo sin necesitar al autor
- **Expresa intención**: el nombre de cada función, variable y clase comunica su propósito
- **Es fácil de modificar**: cambiar una parte no rompe otras
- **Es testeable**: las piezas son lo suficientemente pequeñas y bien definidas para probarse en aislamiento
- **Es consistente**: sigue convenciones predecibles en toda la base de código

### La diferencia entre un programador y un ingeniero

| Programador | Ingeniero |
|-------------|-----------|
| Escribe código que funciona | Escribe código que otros pueden mantener |
| Resuelve el problema inmediato | Piensa en el sistema completo |
| Optimiza para hoy | Diseña para el mañana |
| Teme el cambio | Abraza el cambio con buenas abstracciones |
| "Si funciona, no lo toques" | Refactoriza continuamente |

---

## 1.1 Legibilidad vs. Inteligencia

El código "inteligente" es el enemigo del equipo. Cuando escribes código para lucirte, en realidad estás creando deuda técnica.

### ❌ Código "inteligente" (anti-patrón)

```typescript
// ¿Qué hace esto?
const r = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const v = (d: {s: string; e: string}[]) => d.map(x => new Date(x.e).getTime() - new Date(x.s).getTime());
```

### ✅ Código legible (patrón correcto)

```typescript
function calcularPromedio(numeros: number[]): number {
  const suma = numeros.reduce((acumulado, numero) => acumulado + numero, 0);
  return suma / numeros.length;
}

function calcularDuracionesEnMs(eventos: { inicio: string; fin: string }[]): number[] {
  return eventos.map(evento => {
    const fechaInicio = new Date(evento.inicio).getTime();
    const fechaFin = new Date(evento.fin).getTime();
    return fechaFin - fechaInicio;
  });
}
```

> **Regla de oro**: Si necesitas un comentario para explicar qué hace el código, el nombre de la función o variable está mal puesto. El código debe explicarse a sí mismo.

---

## 1.2 Convenciones de Nomenclatura

El nombrado es una de las habilidades más subestimadas en ingeniería. Nombres pobres son la fuente número uno de confusión en bases de código grandes.

### Principios de nombrado

| Tipo | Convención | Ejemplo bueno | Ejemplo malo |
|------|-----------|---------------|--------------|
| Variables | `camelCase`, descriptiva | `usuariosActivos` | `u`, `data`, `temp` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_REINTENTOS` | `n`, `val` |
| Funciones | Verbo + sustantivo | `obtenerUsuarioPorId()` | `get()`, `hacer()` |
| Clases | `PascalCase`, sustantivo | `GestorDePagos` | `Helper`, `Manager2` |
| Booleanos | Prefijo `es`, `tiene`, `puede` | `esAdmin`, `tienePermiso` | `admin`, `flag` |
| Interfaces | Descripción del contrato | `RepositorioDeUsuario` | `IUser`, `UserInterface` |

### ❌ Ejemplos de mal nombrado

```typescript
// ¿Qué es "d"? ¿Qué hace "proc"? ¿Qué devuelve "check"?
function proc(d: any): any {
  const r = check(d);
  if (!r) return null;
  return upd(d, r);
}
```

### ✅ Nombrado expresivo

```typescript
function procesarSolicitudDePago(solicitud: SolicitudDePago): ResultadoDePago | null {
  const validacion = validarDatosDePago(solicitud);
  if (!validacion.esValida) return null;
  return actualizarEstadoDePago(solicitud, validacion);
}
```

---

## 1.3 Diseño de Funciones

Las funciones son las unidades fundamentales del código limpio. Una función bien diseñada tiene estas características:

### La regla de "hacer una sola cosa"

```typescript
// ❌ Función que hace demasiado (God Function)
async function registrarUsuario(datos: DatosRegistro): Promise<void> {
  // Valida datos
  if (!datos.email.includes('@')) throw new Error('Email inválido');
  if (datos.contraseña.length < 8) throw new Error('Contraseña muy corta');
  
  // Hashea contraseña
  const salt = await bcrypt.genSalt(10);
  const hashContraseña = await bcrypt.hash(datos.contraseña, salt);
  
  // Guarda en base de datos
  const usuario = await db.usuarios.create({
    email: datos.email,
    contraseña: hashContraseña,
    creadoEn: new Date()
  });
  
  // Envía email de bienvenida
  await emailService.send({
    para: datos.email,
    asunto: 'Bienvenido',
    cuerpo: `Hola ${datos.nombre}, bienvenido a la plataforma`
  });
  
  // Registra en analytics
  analytics.track('usuario_registrado', { userId: usuario.id });
  
  // Crea sesión
  await sessionService.crear(usuario.id);
}
```

```typescript
// ✅ Responsabilidades separadas y componibles
async function registrarUsuario(datos: DatosRegistro): Promise<ResultadoRegistro> {
  validarDatosDeRegistro(datos);
  
  const contraseñaHasheada = await hashearContraseña(datos.contraseña);
  const usuario = await crearUsuarioEnBD({ ...datos, contraseña: contraseñaHasheada });
  
  await Promise.all([
    enviarEmailDeBienvenida(usuario),
    registrarEventoDeAnalytics('usuario_registrado', usuario.id)
  ]);
  
  const sesion = await crearSesion(usuario.id);
  return { usuario, sesion };
}

function validarDatosDeRegistro(datos: DatosRegistro): void {
  if (!esEmailValido(datos.email)) throw new ErrorDeValidacion('Email inválido');
  if (!esContraseñaSegura(datos.contraseña)) throw new ErrorDeValidacion('Contraseña muy corta');
}

async function hashearContraseña(contraseña: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(contraseña, salt);
}
```

### Número de argumentos

| Argumentos | Evaluación |
|-----------|-----------|
| 0 | Ideal |
| 1-2 | Excelente |
| 3 | Aceptable, revisar |
| 4+ | Señal de alarma, usar objeto |

```typescript
// ❌ Demasiados argumentos
function crearPedido(
  userId: string,
  productId: string,
  cantidad: number,
  descuento: number,
  moneda: string,
  direccionEnvio: string
): Pedido { ... }

// ✅ Usar un objeto descriptor
interface CrearPedidoDTO {
  userId: string;
  productId: string;
  cantidad: number;
  descuento?: number;
  moneda: string;
  direccionEnvio: string;
}

function crearPedido(datos: CrearPedidoDTO): Pedido { ... }
```

---

## 1.4 Principio de Responsabilidad Única (SRP)

El SRP es el principio más importante del diseño de software. Una clase o módulo debe tener **una sola razón para cambiar**.

```typescript
// ❌ Clase con múltiples responsabilidades
class Usuario {
  constructor(private datos: DatosUsuario) {}
  
  // Responsabilidad 1: Lógica de negocio
  puedeAccederA(recurso: string): boolean { ... }
  
  // Responsabilidad 2: Persistencia
  async guardarEnBD(): Promise<void> { ... }
  
  // Responsabilidad 3: Presentación
  formatearParaAPI(): object { ... }
  
  // Responsabilidad 4: Comunicación
  async enviarNotificacion(mensaje: string): Promise<void> { ... }
}
```

```typescript
// ✅ Responsabilidades separadas en clases dedicadas
class Usuario {
  constructor(public readonly datos: DatosUsuario) {}
  puedeAccederA(recurso: string): boolean { ... }
}

class RepositorioDeUsuario {
  async guardar(usuario: Usuario): Promise<void> { ... }
  async buscarPorId(id: string): Promise<Usuario | null> { ... }
}

class SerializadorDeUsuario {
  paraAPI(usuario: Usuario): UsuarioDTO { ... }
  paraBase64(usuario: Usuario): string { ... }
}

class ServicioDeNotificaciones {
  async enviarA(usuario: Usuario, mensaje: string): Promise<void> { ... }
}
```

---

## 1.5 Code Smells (Olores de Código)

Los "code smells" son patrones que indican problemas profundos en el diseño.

### Los 10 olores más comunes

| Code Smell | Descripción | Solución |
|-----------|-------------|----------|
| **God Class** | Clase que sabe y hace todo | Descomponer en clases pequeñas |
| **Long Method** | Función de 50+ líneas | Extraer sub-funciones |
| **Magic Numbers** | Números sin contexto | Usar constantes con nombre |
| **Dead Code** | Código que nunca se ejecuta | Eliminarlo |
| **Duplicate Code** | Mismo código en múltiples lugares | Extraer y reutilizar |
| **Feature Envy** | Función que usa más datos de otra clase que de la propia | Mover la función |
| **Data Clumps** | Grupos de datos que siempre van juntos | Crear una clase/tipo |
| **Long Parameter List** | +4 parámetros en una función | Agrupar en objeto |
| **Comments explaining what** | Comentarios que explican el "qué" en vez del "por qué" | Mejor nombrado |
| **Primitive Obsession** | Usar tipos primitivos en vez de objetos de dominio | Value Objects |

### Magic Numbers (ejemplo de refactoring)

```typescript
// ❌ Magic Numbers
function calcularDescuento(precio: number, tipo: number): number {
  if (tipo === 1) return precio * 0.10;
  if (tipo === 2) return precio * 0.20;
  if (tipo === 3) return precio * 0.35;
  return 0;
}

// ✅ Constantes con significado
const DESCUENTOS = {
  CLIENTE_NUEVO: 0.10,
  CLIENTE_RECURRENTE: 0.20,
  CLIENTE_VIP: 0.35,
} as const;

enum TipoCliente {
  NUEVO = 'NUEVO',
  RECURRENTE = 'RECURRENTE',
  VIP = 'VIP',
}

function calcularDescuento(precio: number, tipoCliente: TipoCliente): number {
  return precio * (DESCUENTOS[tipoCliente] ?? 0);
}
```

---

## 1.6 Manejo de Errores

El manejo de errores es la diferencia entre una aplicación de producción y un prototipo.

```typescript
// ❌ Manejo de errores pobre
async function obtenerUsuario(id: string) {
  try {
    const usuario = await db.find(id);
    return usuario;
  } catch (e) {
    console.log(e);
    return null; // Silencia el error, el caller no sabe qué pasó
  }
}
```

```typescript
// ✅ Errores como ciudadanos de primera clase
class ErrorDeNegocio extends Error {
  constructor(
    mensaje: string,
    public readonly codigo: string,
    public readonly statusHttp: number = 400
  ) {
    super(mensaje);
    this.name = 'ErrorDeNegocio';
  }
}

class UsuarioNoEncontrado extends ErrorDeNegocio {
  constructor(id: string) {
    super(`Usuario con id "${id}" no encontrado`, 'USUARIO_NO_ENCONTRADO', 404);
  }
}

async function obtenerUsuario(id: string): Promise<Usuario> {
  const usuario = await repositorioUsuario.buscarPorId(id);
  
  if (!usuario) {
    throw new UsuarioNoEncontrado(id);
  }
  
  return usuario;
}

// En el handler HTTP
async function handleObtenerUsuario(req: Request, res: Response): Promise<void> {
  try {
    const usuario = await obtenerUsuario(req.params.id);
    res.json(usuario);
  } catch (error) {
    if (error instanceof ErrorDeNegocio) {
      res.status(error.statusHttp).json({ codigo: error.codigo, mensaje: error.message });
    } else {
      logger.error('Error inesperado', { error, params: req.params });
      res.status(500).json({ codigo: 'ERROR_INTERNO', mensaje: 'Error interno del servidor' });
    }
  }
}
```

---

## 1.7 Refactoring: Ejemplo del Mundo Real

Veamos un refactoring completo de una función típica de backend que "fue creciendo":

### Antes (código heredado real)

```typescript
// Versión original después de 6 meses de "features rápidas"
async function procesarPago(req: any, res: any) {
  let ok = false;
  try {
    const d = req.body;
    if (!d.amount || !d.card || !d.userId) {
      res.status(400).send('bad request');
      return;
    }
    if (d.amount <= 0) {
      res.status(400).send('amount invalid');
      return;
    }
    const u = await db.query(`SELECT * FROM users WHERE id = '${d.userId}'`);  // SQL INJECTION!!
    if (!u.rows.length) {
      res.send({ ok: false });
      return;
    }
    if (u.rows[0].blocked) {
      res.send({ ok: false, msg: 'blocked' });
      return;
    }
    const p = await stripe.charge({ amount: d.amount * 100, source: d.card });
    if (p.status === 'succeeded') {
      await db.query(`INSERT INTO payments VALUES ('${uuid()}', '${d.userId}', ${d.amount}, 'completed', NOW())`);
      ok = true;
      // TODO: send email
    }
    res.send({ ok });
  } catch(e) {
    console.log('error', e);
    res.status(500).send('error');
  }
}
```

### Después (código limpio y seguro)

```typescript
// --- Capa de Validación ---
interface ProcesarPagoDTO {
  monto: number;
  tokenTarjeta: string;
  usuarioId: string;
}

function validarSolicitudDePago(datos: unknown): ProcesarPagoDTO {
  const esquema = z.object({
    monto: z.number().positive('El monto debe ser positivo'),
    tokenTarjeta: z.string().min(1, 'Token de tarjeta requerido'),
    usuarioId: z.string().uuid('ID de usuario inválido'),
  });
  return esquema.parse(datos);
}

// --- Capa de Dominio ---
class ServicioDePagos {
  constructor(
    private readonly repositorioUsuarios: RepositorioUsuarios,
    private readonly repositorioPagos: RepositorioPagos,
    private readonly pasarelaDePago: PasarelaDePago,
    private readonly serviciodeNotificaciones: ServicioNotificaciones,
    private readonly logger: Logger
  ) {}

  async procesarPago(datos: ProcesarPagoDTO): Promise<ResultadoPago> {
    const usuario = await this.obtenerUsuarioActivo(datos.usuarioId);
    const cargo = await this.cobrarAlUsuario(datos.monto, datos.tokenTarjeta);
    const pago = await this.registrarPago(usuario.id, datos.monto, cargo.id);
    
    // No esperamos el email para responder al usuario
    this.serviciodeNotificaciones
      .enviarConfirmacionDePago(usuario, pago)
      .catch(err => this.logger.warn('Error enviando email de confirmación', { err, pagoId: pago.id }));
    
    return { exitoso: true, pagoId: pago.id };
  }

  private async obtenerUsuarioActivo(usuarioId: string): Promise<Usuario> {
    const usuario = await this.repositorioUsuarios.buscarPorId(usuarioId);
    if (!usuario) throw new UsuarioNoEncontrado(usuarioId);
    if (usuario.estaBloqueado) throw new UsuarioBloqueado(usuarioId);
    return usuario;
  }

  private async cobrarAlUsuario(monto: number, tokenTarjeta: string): Promise<CargoStripe> {
    const cargo = await this.pasarelaDePago.cobrar({
      monto: monto * 100, // Stripe usa centavos
      fuente: tokenTarjeta,
    });
    if (cargo.estado !== 'exitoso') {
      throw new ErrorDePago(`Pago rechazado: ${cargo.mensajeError}`);
    }
    return cargo;
  }

  private async registrarPago(usuarioId: string, monto: number, referenciaExterna: string): Promise<Pago> {
    return this.repositorioPagos.crear({
      usuarioId,
      monto,
      referenciaExterna,
      estado: EstadoPago.COMPLETADO,
    });
  }
}

// --- Handler HTTP (delgado) ---
async function handleProcesarPago(req: Request, res: Response): Promise<void> {
  try {
    const datos = validarSolicitudDePago(req.body);
    const resultado = await servicioDePagos.procesarPago(datos);
    res.status(200).json(resultado);
  } catch (error) {
    manejarErrorHTTP(error, res);
  }
}
```

**¿Qué mejoró?**
- Se eliminó SQL Injection usando un ORM/repositorio
- Errores tipados y específicos
- Cada función hace una sola cosa
- El handler HTTP es delgado (no contiene lógica de negocio)
- El email falla silenciosamente sin afectar la respuesta
- Código completamente testeable

---

# 2. Arquitectura Frontend

## ¿Por qué importa la arquitectura frontend?

Un frontend sin arquitectura empieza bien y termina siendo un proyecto imposible de mantener. Los síntomas típicos:

- Componentes de 1000+ líneas
- Estado global que nadie entiende
- Cambiar una pantalla rompe otra
- No hay forma de testear sin levantar toda la app
- El onboarding de nuevos devs toma semanas

---

## 2.1 Arquitectura de Componentes

### La jerarquía de componentes

```
UI Components (átomos)
    ↓
Feature Components (moléculas)
    ↓
Page Components (organismos)
    ↓
Layouts
    ↓
App Shell
```

### Atomic Design en la práctica

```typescript
// 🔵 Átomo: el bloque más pequeño e independiente
// components/ui/Button.tsx
interface ButtonProps {
  variante: 'primario' | 'secundario' | 'peligro';
  tamaño: 'sm' | 'md' | 'lg';
  estaCargando?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variante, tamaño, estaCargando, onClick, children }: ButtonProps) {
  return (
    <button
      className={cn(estilosBase, variantes[variante], tamaños[tamaño])}
      onClick={onClick}
      disabled={estaCargando}
    >
      {estaCargando ? <Spinner /> : children}
    </button>
  );
}

// 🟡 Molécula: combina átomos con lógica local
// components/ui/SearchInput.tsx
export function SearchInput({ onBuscar }: { onBuscar: (query: string) => void }) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(query);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar..." />
      <Button variante="primario" tamaño="md">Buscar</Button>
    </form>
  );
}

// 🟠 Feature Component: lógica de negocio + datos
// features/productos/components/ListaProductos.tsx
export function ListaProductos() {
  const { productos, estaCargando, error } = useProductos();
  
  if (estaCargando) return <ProductosSkeleton />;
  if (error) return <ErrorState error={error} />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {productos.map(producto => (
        <TarjetaProducto key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
```

---

## 2.2 Arquitectura Feature-Based (Escalable)

La arquitectura basada en features es el estándar en proyectos de escala mediana-grande.

### Estructura de carpetas enterprise

```
src/
├── app/                        # Configuración global de la app
│   ├── providers.tsx           # Context providers, configuración
│   ├── router.tsx              # Definición de rutas
│   └── store.ts                # Store global (si aplica)
│
├── features/                   # 💡 El corazón del proyecto
│   ├── autenticacion/
│   │   ├── api/                # Llamadas a la API de este dominio
│   │   │   └── auth.api.ts
│   │   ├── components/         # Componentes específicos del feature
│   │   │   ├── FormLogin.tsx
│   │   │   └── FormRegistro.tsx
│   │   ├── hooks/              # Hooks de este feature
│   │   │   └── useAuth.ts
│   │   ├── store/              # Estado de este feature
│   │   │   └── auth.store.ts
│   │   ├── types/              # Tipos e interfaces del feature
│   │   │   └── auth.types.ts
│   │   └── index.ts            # Barrel export (API pública del feature)
│   │
│   ├── productos/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── index.ts
│   │
│   └── pedidos/
│       └── ...
│
├── shared/                     # Código compartido entre features
│   ├── components/             # Componentes UI reutilizables (design system)
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── DataTable/
│   ├── hooks/                  # Hooks genéricos
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── lib/                    # Utilidades y configuraciones
│   │   ├── api-client.ts       # Instancia configurada de axios/fetch
│   │   └── date-utils.ts
│   └── types/                  # Tipos globales
│       └── api.types.ts
│
└── pages/                      # Páginas (para Next.js)
    ├── dashboard.tsx
    └── productos/
        ├── index.tsx
        └── [id].tsx
```

---

## 2.3 Gestión de Estado

Uno de los temas más confusos del frontend. La regla fundamental:

> **Usa el estado más local posible que resuelva tu problema.**

### Pirámide del estado

```
                    🌐 Estado del Servidor
                   (React Query / SWR / RTK Query)
                 ↗ Datos remotos, cache, sincronización
                
              🏪 Estado Global de UI
             (Zustand / Redux / Jotai)
           ↗ Estado compartido entre features lejanas
           
        🧩 Estado de Feature / Contexto
       (React Context con useState)
     ↗ Estado compartido en un árbol de componentes
     
  📦 Estado Local de Componente
  (useState / useReducer)
↗ El primer recurso, el más simple
```

### Ejemplo: Estado del servidor con React Query

```typescript
// features/productos/hooks/useProductos.ts
export function useProductos(filtros?: FiltrosProducto) {
  return useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => productosApi.listar(filtros),
    staleTime: 5 * 60 * 1000, // Considera datos frescos por 5 minutos
    select: (data) => data.productos, // Transforma antes de devolver
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productosApi.crear,
    onSuccess: () => {
      // Invalida la cache y re-fetching automático
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

// Uso en componente
function ListaProductos() {
  const { data: productos, isLoading, error } = useProductos();
  const { mutate: crearProducto, isPending } = useCrearProducto();
  
  // ...
}
```

### Ejemplo: Estado global con Zustand (simple y moderno)

```typescript
// features/carrito/store/carrito.store.ts
interface CarritoStore {
  items: ItemCarrito[];
  agregarItem: (producto: Producto) => void;
  eliminarItem: (productoId: string) => void;
  vaciarCarrito: () => void;
  total: number;
}

export const useCarritoStore = create<CarritoStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        
        agregarItem: (producto) => set((estado) => {
          const itemExistente = estado.items.find(i => i.productoId === producto.id);
          
          if (itemExistente) {
            return {
              items: estado.items.map(i =>
                i.productoId === producto.id
                  ? { ...i, cantidad: i.cantidad + 1 }
                  : i
              )
            };
          }
          
          return { items: [...estado.items, { productoId: producto.id, cantidad: 1, producto }] };
        }),
        
        eliminarItem: (productoId) => set((estado) => ({
          items: estado.items.filter(i => i.productoId !== productoId)
        })),
        
        vaciarCarrito: () => set({ items: [] }),
        
        get total() {
          return get().items.reduce(
            (sum, item) => sum + item.producto.precio * item.cantidad,
            0
          );
        },
      }),
      { name: 'carrito-storage' } // Persiste en localStorage
    )
  )
);
```

---

## 2.4 Rendering Strategies (SSR, SSG, ISR)

### Comparación de estrategias de rendering

```
                    Usuario hace request
                          │
         ┌────────────────┼────────────────┐
         ↓                ↓                ↓
        SPA              SSR              SSG
   (Solo cliente)   (En el servidor)  (Pre-generado)
         │                │                │
  Descarga JS       Genera HTML      Sirve HTML
  Ejecuta en        en tiempo         estático
  browser           real              del CDN
         │                │                │
  Primera carga      Rápido para     Rapidísimo
  lenta, luego       SEO y perf.     en CDN
  rápido
```

| Estrategia | Cuándo usarla | Ejemplos |
|------------|--------------|---------|
| **CSR/SPA** | Apps autenticadas, dashboards internos | Admin panels, apps de productividad |
| **SSR** | Contenido dinámico + SEO importante | E-commerce, noticias, redes sociales |
| **SSG** | Contenido raramente cambiante | Blogs, docs, landing pages |
| **ISR** | Contenido semi-dinámico a escala | Catálogos, portafolios, directorios |
| **Edge Rendering** | Personalización geográfica | Precios por país, A/B testing |

### ISR en Next.js (el balance perfecto)

```typescript
// app/productos/[id]/page.tsx (Next.js 14 App Router)
export async function generateStaticParams() {
  // Pre-genera las páginas de los 100 productos más populares
  const productosPopulares = await productosApi.obtenerMasVistos(100);
  return productosPopulares.map(p => ({ id: p.id }));
}

export const revalidate = 3600; // Re-genera cada hora

export default async function PaginaProducto({ params }: { params: { id: string } }) {
  const producto = await productosApi.obtenerPorId(params.id);
  
  if (!producto) notFound();
  
  return <DetalleProducto producto={producto} />;
}
```

---

## 2.5 Abstracción de API en Frontend

Nunca llames `fetch` directamente en tus componentes o hooks. Crea una capa de abstracción.

```typescript
// shared/lib/api-client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) authStore.getState().cerrarSesion();
    return Promise.reject(transformarErrorApi(error));
  }
);

// features/productos/api/productos.api.ts
export const productosApi = {
  listar: (filtros?: FiltrosProducto): Promise<ProductosResponse> =>
    apiClient.get('/productos', { params: filtros }),
  
  obtenerPorId: (id: string): Promise<Producto> =>
    apiClient.get(`/productos/${id}`),
  
  crear: (datos: CrearProductoDTO): Promise<Producto> =>
    apiClient.post('/productos', datos),
  
  actualizar: (id: string, datos: ActualizarProductoDTO): Promise<Producto> =>
    apiClient.patch(`/productos/${id}`, datos),
  
  eliminar: (id: string): Promise<void> =>
    apiClient.delete(`/productos/${id}`),
};
```

---

# 3. Arquitectura Backend

## 3.1 Arquitectura en Capas

La arquitectura en capas es el patrón más común y probado para backends:

```
┌─────────────────────────────────────────┐
│           HTTP Controllers              │  ← Recibe requests, valida input
│         (Presentation Layer)            │
├─────────────────────────────────────────┤
│             Use Cases /                 │  ← Orquesta lógica de negocio
│           Service Layer                 │
├─────────────────────────────────────────┤
│             Domain Layer                │  ← Entidades y reglas de negocio puras
│        (Business Logic)                 │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │  ← DB, APIs externas, cache
│      (Repositories, Adapters)           │
└─────────────────────────────────────────┘
```

### Flujo de una Request

```
Request HTTP
    │
    ▼
[Middleware] → Autenticación, logging, rate limiting
    │
    ▼
[Controller] → Parsea body, valida DTO, llama al service
    │
    ▼
[Service] → Orquesta: llama a repositorios, aplica lógica
    │
    ▼
[Repository] → Abstrae el acceso a datos (DB, cache)
    │
    ▼
[Database / Cache / API Externa]
    │
    ▼
[Service] → Transforma resultado a dominio
    │
    ▼
[Controller] → Serializa respuesta
    │
    ▼
Response HTTP
```

---

## 3.2 NestJS: Arquitectura Backend Moderna

NestJS implementa arquitectura en capas, inyección de dependencias, y módulos de forma opinada.

### Estructura de un módulo NestJS escalable

```
src/
├── modules/
│   ├── usuarios/
│   │   ├── controllers/
│   │   │   └── usuarios.controller.ts
│   │   ├── services/
│   │   │   └── usuarios.service.ts
│   │   ├── repositories/
│   │   │   └── usuarios.repository.ts
│   │   ├── dto/
│   │   │   ├── crear-usuario.dto.ts
│   │   │   └── actualizar-usuario.dto.ts
│   │   ├── entities/
│   │   │   └── usuario.entity.ts
│   │   ├── guards/
│   │   │   └── solo-admin.guard.ts
│   │   └── usuarios.module.ts
│   │
│   └── pagos/
│       └── ...
│
├── common/
│   ├── decorators/
│   ├── filters/         # Exception handlers globales
│   ├── guards/          # Auth guards
│   ├── interceptors/    # Logging, transformación de respuesta
│   └── pipes/           # Validación global
│
└── app.module.ts
```

### Controller delgado con DTO

```typescript
// modules/usuarios/controllers/usuarios.controller.ts
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(Rol.ADMIN)
  async listar(@Query() filtros: FiltrarUsuariosDto): Promise<UsuarioDTO[]> {
    return this.usuariosService.listar(filtros);
  }

  @Get(':id')
  async obtenerUno(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioDTO> {
    return this.usuariosService.obtenerPorId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearUsuarioDto): Promise<UsuarioDTO> {
    return this.usuariosService.crear(dto);
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarUsuarioDto,
    @CurrentUser() usuario: UsuarioAutenticado
  ): Promise<UsuarioDTO> {
    this.verificarAutorizacion(id, usuario);
    return this.usuariosService.actualizar(id, dto);
  }
}
```

### DTO con validación (class-validator)

```typescript
// modules/usuarios/dto/crear-usuario.dto.ts
export class CrearUsuarioDto {
  @IsEmail({}, { message: 'El email no es válido' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe tener mayúsculas, minúsculas y números'
  })
  contraseña: string;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol = Rol.USUARIO;
}
```

### Service con lógica de negocio

```typescript
// modules/usuarios/services/usuarios.service.ts
@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuariosRepo: UsuariosRepository,
    private readonly hashService: HashService,
    private readonly emailService: EmailService,
    private readonly logger: Logger
  ) {}

  async crear(dto: CrearUsuarioDto): Promise<UsuarioDTO> {
    await this.verificarEmailUnico(dto.email);
    
    const contraseñaHasheada = await this.hashService.hash(dto.contraseña);
    
    const usuario = await this.usuariosRepo.crear({
      ...dto,
      contraseña: contraseñaHasheada,
    });

    await this.emailService.enviarBienvenida(usuario).catch(err => {
      this.logger.warn('Error enviando email de bienvenida', { err, usuarioId: usuario.id });
    });

    return UsuarioDTO.desde(usuario);
  }

  private async verificarEmailUnico(email: string): Promise<void> {
    const existe = await this.usuariosRepo.existePorEmail(email);
    if (existe) throw new ConflictException('El email ya está registrado');
  }
}
```

### Repository Pattern

```typescript
// modules/usuarios/repositories/usuarios.repository.ts
@Injectable()
export class UsuariosRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>
  ) {}

  async crear(datos: Partial<UsuarioEntity>): Promise<UsuarioEntity> {
    const usuario = this.repo.create(datos);
    return this.repo.save(usuario);
  }

  async buscarPorId(id: string): Promise<UsuarioEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async buscarPorEmail(email: string): Promise<UsuarioEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async existePorEmail(email: string): Promise<boolean> {
    return this.repo.exists({ where: { email } });
  }

  async listar(filtros: FiltrosUsuario): Promise<[UsuarioEntity[], number]> {
    const query = this.repo.createQueryBuilder('usuario')
      .where('usuario.activo = :activo', { activo: true });
    
    if (filtros.rol) query.andWhere('usuario.rol = :rol', { rol: filtros.rol });
    if (filtros.busqueda) {
      query.andWhere('(usuario.nombre ILIKE :busqueda OR usuario.email ILIKE :busqueda)', {
        busqueda: `%${filtros.busqueda}%`
      });
    }
    
    return query
      .take(filtros.limite ?? 20)
      .skip(filtros.pagina ? (filtros.pagina - 1) * (filtros.limite ?? 20) : 0)
      .getManyAndCount();
  }
}
```

---

## 3.3 Autenticación y Autorización

### JWT + Refresh Tokens (patrón de producción)

```typescript
// Estrategia: Access Token de corta vida + Refresh Token de larga vida
// Access Token: 15 minutos (en memoria del cliente)
// Refresh Token: 7 días (en cookie httpOnly)

@Injectable()
export class AuthService {
  async login(credenciales: LoginDto): Promise<TokensResponse> {
    const usuario = await this.validarCredenciales(credenciales);
    return this.generarTokens(usuario);
  }

  async refrescarTokens(refreshToken: string): Promise<TokensResponse> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    
    const tokenGuardado = await this.refreshTokenRepo.buscar(payload.sub);
    if (!tokenGuardado || tokenGuardado.token !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }
    
    // Rotación de refresh tokens (seguridad)
    await this.refreshTokenRepo.revocar(refreshToken);
    
    const usuario = await this.usuariosService.obtenerPorId(payload.sub);
    return this.generarTokens(usuario);
  }

  private async generarTokens(usuario: Usuario): Promise<TokensResponse> {
    const payload: JwtPayload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);
    
    await this.refreshTokenRepo.guardar(usuario.id, refreshToken);
    
    return { accessToken, refreshToken };
  }
}
```

### RBAC (Control de Acceso Basado en Roles)

```typescript
// common/decorators/roles.decorator.ts
export const Roles = (...roles: Rol[]) => SetMetadata('roles', roles);

// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<Rol[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!rolesRequeridos?.length) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return rolesRequeridos.includes(user.rol);
  }
}

// Uso en controlador
@Delete(':id')
@Roles(Rol.ADMIN, Rol.SUPER_ADMIN)
async eliminar(@Param('id') id: string): Promise<void> {
  return this.service.eliminar(id);
}
```

---

# 4. Fundamentos de Escalabilidad

## ¿Qué significa realmente escalar?

**Escalabilidad** es la capacidad de un sistema de manejar más carga de trabajo agregando recursos.

> El mito más común: "Voy a diseñar esto para manejar 1 millón de usuarios desde el día 1." — Esto es casi siempre un error (premature optimization).

### Escalado Vertical vs Horizontal

```
ESCALADO VERTICAL (Scale Up)
────────────────────────────
Servidor original:    Servidor mejorado:
┌──────────┐         ┌──────────┐
│ CPU: 2   │    →    │ CPU: 32  │
│ RAM: 8GB │         │ RAM: 128GB│
│ Disco:500│         │ Disco:4TB│
└──────────┘         └──────────┘
  Simple, límite físico, costoso

ESCALADO HORIZONTAL (Scale Out)
────────────────────────────────
                    ┌──────────┐
                    │Servidor 1│
                    └──────────┘
Servidor único → Load Balancer → ┌──────────┐
                    │Servidor 2│
                    └──────────┘
                    ┌──────────┐
                    │Servidor 3│
                    └──────────┘
  Más complejo, sin límite teórico
```

| Criterio | Vertical | Horizontal |
|----------|---------|-----------|
| Complejidad | Baja | Alta |
| Costo | Alto por unidad | Más eficiente a escala |
| Límite | Físico (hardware) | Prácticamente ilimitado |
| Downtime en upgrade | Sí | No (rolling deploys) |
| Recomendado para | Bases de datos, inicio | APIs, microservicios |

---

## 4.1 Caching: El Multiplicador de Performance

El cache es la herramienta de escalabilidad más poderosa y mal utilizada.

### Jerarquía de cache

```
Browser Cache (ms)
    ↓
CDN Cache (10-50ms)
    ↓
API Gateway Cache (1-5ms)
    ↓
Application Cache - Redis (1-10ms)
    ↓
Database Query Cache (10-100ms)
    ↓
Database (100-500ms)
    ↓
Disk/Network (500ms+)
```

### Redis: Patrones de uso en producción

```typescript
// Cache-Aside Pattern (el más común)
async function obtenerProducto(id: string): Promise<Producto> {
  const claveCache = `producto:${id}`;
  
  // 1. Intenta obtener del cache
  const cacheado = await redis.get(claveCache);
  if (cacheado) {
    return JSON.parse(cacheado);
  }
  
  // 2. Si no está, obtiene de la DB
  const producto = await productosRepo.buscarPorId(id);
  if (!producto) throw new NotFoundException(`Producto ${id} no encontrado`);
  
  // 3. Guarda en cache con TTL
  await redis.setex(claveCache, 3600, JSON.stringify(producto)); // 1 hora
  
  return producto;
}

// Invalidación de cache al actualizar
async function actualizarProducto(id: string, datos: ActualizarProductoDTO): Promise<Producto> {
  const producto = await productosRepo.actualizar(id, datos);
  
  // Invalida cache específico
  await redis.del(`producto:${id}`);
  
  // También invalida listas que podrían contener este producto
  await redis.del('productos:listado:*'); // Pattern matching
  
  return producto;
}

// Rate Limiting con Redis
async function verificarRateLimit(clienteId: string): Promise<void> {
  const clave = `rate_limit:${clienteId}`;
  const limite = 100; // requests por minuto
  
  const contador = await redis.incr(clave);
  
  if (contador === 1) {
    await redis.expire(clave, 60); // Primera request: establece TTL de 1 minuto
  }
  
  if (contador > limite) {
    throw new TooManyRequestsException('Límite de requests excedido');
  }
}
```

---

## 4.2 Load Balancing

```
Requests del mundo
        │
        ▼
  ┌─────────────┐
  │ Load Balancer│  ← Nginx, HAProxy, AWS ALB
  └──────┬──────┘
         │
   ┌─────┼─────┐
   ↓     ↓     ↓
[App1] [App2] [App3]  ← Instancias idénticas
   │     │     │
   └─────┼─────┘
         ↓
   [Base de Datos]
   [Cache Redis]
   [Almacenamiento]
```

### Algoritmos de balanceo

| Algoritmo | Descripción | Cuándo usar |
|-----------|-------------|------------|
| **Round Robin** | Distribución circular | Requests similares en tiempo |
| **Least Connections** | Al servidor con menos conexiones | Requests de duración variable |
| **IP Hash** | Mismo cliente → mismo servidor | Sesiones sin Redis |
| **Weighted** | Más tráfico a servidores potentes | Servidores heterogéneos |

---

## 4.3 Colas de Mensajes: Procesamiento Asíncrono

Para operaciones costosas que no necesitan respuesta inmediata.

```
Cliente envía → API responde "201 Accepted" (inmediato)
                     │
                     ↓
              ┌─────────────┐
              │    Queue     │  ← RabbitMQ / Redis / SQS
              │  (BullMQ)   │
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              │   Worker 1  │  ← Procesa en background
              └─────────────┘
              ┌─────────────┐
              │   Worker 2  │  ← Más workers para escalar
              └─────────────┘
```

```typescript
// Productor: API agrega trabajo a la cola
@Injectable()
export class ProcesadorDeImagenesService {
  constructor(
    @InjectQueue('imagenes') private readonly colaImagenes: Queue
  ) {}

  async procesarImagenDeProducto(productoId: string, urlImagen: string): Promise<void> {
    await this.colaImagenes.add('redimensionar', {
      productoId,
      urlImagen,
    }, {
      attempts: 3,                    // Reintentos automáticos
      backoff: { type: 'exponential', delay: 2000 }, // Espera exponencial entre reintentos
      removeOnComplete: 100,          // Mantiene últimos 100 jobs completados
      removeOnFail: 200,              // Mantiene últimos 200 jobs fallidos para debug
    });
  }
}

// Worker: procesa el trabajo
@Processor('imagenes')
export class WorkerDeImagenes {
  @Process('redimensionar')
  async redimensionarImagen(job: Job<{ productoId: string; urlImagen: string }>): Promise<void> {
    const { productoId, urlImagen } = job.data;
    
    const imagenProcesada = await sharp(urlImagen)
      .resize(800, 600, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
    
    const urlFinal = await storageService.subir(imagenProcesada, `productos/${productoId}.webp`);
    await productosRepo.actualizarImagen(productoId, urlFinal);
  }
}
```

---

## 4.4 Database Scaling

### Estrategias de escalado de DB

```
READ REPLICAS
─────────────
             ┌──────────────┐
             │  DB Primary   │  ← Escrituras (INSERT, UPDATE, DELETE)
             └──────┬───────┘
                    │ Replicación
         ┌──────────┼──────────┐
         ↓          ↓          ↓
    [Replica 1] [Replica 2] [Replica 3]  ← Solo lecturas (SELECT)
    
    Beneficio: 3x capacidad de lectura (el 80% de operaciones en apps típicas)


SHARDING (Partición Horizontal)
────────────────────────────────
              Usuarios
           ┌─────────────┐
           │   Router    │  Decide según userId
           └──────┬──────┘
      ┌───────────┼───────────┐
      ↓           ↓           ↓
  [Shard A]   [Shard B]   [Shard C]
  users 1-33% users 34-66% users 67-100%
  
  Beneficio: Escala escrituras también
  Complejidad: Alta (queries cross-shard son complicadas)
```

### Connection Pooling (fundamental en producción)

```typescript
// Sin connection pooling: cada request abre/cierra una conexión a la DB
// Con 1000 requests/seg → 1000 conexiones simultáneas → DB colapsa

// Con PgBouncer o pool de Prisma/TypeORM:
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  poolSize: 20,           // Máximo 20 conexiones activas
  connectTimeoutMS: 3000, // Timeout si no hay conexiones disponibles
  extra: {
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
});

// Resultado: 1000 requests comparten 20 conexiones → DB feliz
```

---

## 4.5 CDN: Red de Distribución de Contenido

```
Sin CDN:
Usuario en Argentina → Servidor en Virginia → 200ms

Con CDN:
Usuario en Argentina → Nodo CDN en São Paulo → 10ms
                       (archivos cacheados)
```

**¿Qué poner en CDN?**
- Assets estáticos (JS, CSS, imágenes, fuentes)
- HTML pre-generado (SSG/ISR)
- Respuestas de API que no cambian frecuentemente

---

## 4.6 Casos Reales de Escalabilidad

### WhatsApp: 50 ingenieros, 900 millones de usuarios

**Secreto**: Erlang (diseñado para telecomunicaciones), arquitectura de actor model, y la regla de NO sobrescalar prematuramente.

**Aprendizaje**: El lenguaje/tecnología correcta para el problema correcto > escalar con la tecnología incorrecta.

### Netflix: Streaming a escala global

**Estrategias clave**:
1. CDN propio (Open Connect) en ISPs de todo el mundo
2. Microservicios con circuit breakers (Hystrix)
3. Chaos Engineering (Chaos Monkey) para encontrar fallos antes que los usuarios
4. Encoding en múltiples calidades y formatos (AV1, H.265)

### Instagram: 13 empleados, 1 millón de usuarios al día

**Arquitectura inicial**:
- Django + PostgreSQL + Redis + Nginx
- Vertical scaling agresivo antes que microservicios
- **Mensaje**: Mantén la simplicidad el mayor tiempo posible

---

# 5. Pensamiento de Diseño de Software

## 5.1 Cómo Piensan los Ingenieros Senior

La diferencia fundamental entre un junior y un senior no es el conocimiento técnico — es **cómo piensan** ante un problema.

### El proceso mental de un Senior

```
Junior recibe tarea:
"Necesito una API para buscar usuarios"
→ Abre IDE → Empieza a codear

Senior recibe tarea:
"Necesito una API para buscar usuarios"
→ ¿Cuántos usuarios hay en la BD?
→ ¿Qué campos de búsqueda necesitan?
→ ¿Cuántas búsquedas por segundo?
→ ¿Necesitamos búsqueda full-text o solo por campo exacto?
→ ¿Hay paginación? ¿Ordenamiento?
→ ¿Los resultados cambian frecuentemente? (¿cache?)
→ ENTONCES abre el IDE
```

---

## 5.2 Sistemas de Pensamiento

### Descomposición de Problemas

Ante un sistema complejo, descompón en:

1. **Entidades**: ¿Qué objetos existen en este dominio?
2. **Relaciones**: ¿Cómo se relacionan entre sí?
3. **Flujos**: ¿Cuáles son los casos de uso principales?
4. **Fronteras**: ¿Dónde empieza y termina este sistema?
5. **Restricciones**: ¿Qué no puede hacer este sistema?

### Ejemplo: Diseñar un sistema de pedidos para e-commerce

```
1. ENTIDADES
   - Usuario (comprador)
   - Producto
   - Carrito
   - Pedido
   - Item de pedido
   - Pago
   - Envío
   - Dirección

2. RELACIONES
   Usuario —[tiene]→ Carrito (1:1)
   Carrito —[contiene]→ Items (1:N)
   Item —[referencia]→ Producto (N:1)
   Usuario —[tiene]→ Pedidos (1:N)
   Pedido —[tiene]→ Items (1:N)
   Pedido —[tiene]→ Pago (1:1)
   Pedido —[tiene]→ Envío (1:1)

3. FLUJOS PRINCIPALES
   - Agregar producto al carrito
   - Checkout (carrito → pedido)
   - Procesar pago
   - Confirmar y despachar pedido
   - Seguimiento del envío

4. PREGUNTAS DE DISEÑO
   - ¿Qué pasa si el producto se agota entre que se agrega al carrito y el checkout?
   - ¿Cómo manejamos pagos fallidos?
   - ¿Podemos cancelar un pedido una vez despachado?
```

---

## 5.3 Trade-offs de Ingeniería

Todo en ingeniería es un trade-off. No hay respuestas perfectas, solo decisiones informadas.

### El triángulo de hierro del sistema

```
          Consistencia
              /\
             /  \
            /    \
           /  CAP \
          /   Theorem\
         /______________\
   Disponibilidad    Tolerancia
                    a Particiones

Solo puedes tener 2 de 3 en un sistema distribuido.
```

### Ejemplos de trade-offs comunes

| Decisión | Opción A | Opción B | El trade-off |
|----------|----------|----------|-------------|
| SQL vs NoSQL | Consistencia, ACID | Escala, flexibilidad | Depende de tus datos |
| Monolito vs Microservicios | Simplicidad, deploy único | Escala independiente, complejidad alta | Tamaño del equipo |
| REST vs GraphQL | Simplicidad, caching | Flexibilidad, over-fetching eliminado | Complejidad del cliente |
| Sync vs Async | Simplicidad, respuesta inmediata | Escala, resiliencia | Complejidad del flujo |
| Cache agresivo | Performance alta | Datos potencialmente desactualizados | Tolerancia a stale data |

---

## 5.4 Evitar el Sobre-Ingeniería

El sobre-ingeniería es tan peligroso como el código mal diseñado.

### Señales de sobre-ingeniería

- Implementas microservicios para una app con 100 usuarios
- Tienes 5 capas de abstracción para una operación simple
- Tu arquitectura es más compleja que el problema que resuelve
- Pasas más tiempo configurando infraestructura que construyendo features

### El principio YAGNI (You Ain't Gonna Need It)

> "No agregues funcionalidad hasta que la necesites realmente."

```typescript
// ❌ Sobre-ingeniería prematura
class AbstractFactoryCreatorDeRepositorioDeUsuariosConStrategiaDeCache<T extends CacheStrategy> {
  // 200 líneas de abstracción que nadie va a necesitar
}

// ✅ Simple y funcional, escala cuando sea necesario
class RepositorioDeUsuarios {
  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }
}
```

### El framework de decisión: ¿Lo necesito ahora?

```
¿Tienes el problema hoy?
        │
   No   │   Sí
        │
   No lo│   ¿Es costoso de agregar después?
 implementes    │
           No   │   Sí
                │
           Agrégalo│  Agrégalo pero
           cuando  │  con planificación
           el problema│  y pruebas
           aparezca  │
```

---

# 6. Sistemas Modulares

## 6.1 La Evolución Natural de los Sistemas

```
Startup / MVP:                 Crecimiento:              Escala:
                               
┌──────────────┐           ┌──────────────┐         ┌────┐ ┌────┐ ┌────┐
│              │           │ ┌──────────┐ │         │Svc1│ │Svc2│ │Svc3│
│   Monolito   │  →        │ │ Módulo A │ │  →      └────┘ └────┘ └────┘
│   Simple     │           │ │ Módulo B │ │            Microservicios
│              │           │ │ Módulo C │ │
└──────────────┘           │ └──────────┘ │
                           │ Monolito     │
                           │ Modular      │
                           └──────────────┘
```

La **mayoría** de sistemas nunca necesitan llegar a microservicios. El monolito modular es el punto óptimo para el 80% de los proyectos.

---

## 6.2 Monolito Modular: El Punto Óptimo

Un monolito modular tiene la **simplicidad de un monolito** con la **organización de microservicios**.

### Estructura de un monolito modular

```
src/
├── modules/
│   ├── usuarios/        # Módulo autocontenido
│   │   ├── dominio/
│   │   │   ├── usuario.entity.ts
│   │   │   └── usuario.repository.interface.ts
│   │   ├── aplicacion/
│   │   │   ├── crear-usuario.use-case.ts
│   │   │   └── obtener-usuario.use-case.ts
│   │   ├── infraestructura/
│   │   │   └── usuario.repository.impl.ts
│   │   └── index.ts     # Solo expone lo necesario
│   │
│   ├── pagos/
│   │   ├── dominio/
│   │   ├── aplicacion/
│   │   ├── infraestructura/
│   │   └── index.ts
│   │
│   └── notificaciones/
│       └── ...
│
└── shared/
    ├── dominio/         # Tipos compartidos entre módulos
    └── infraestructura/ # DB connection, logger, etc.
```

### La regla de los módulos: Solo comunicación a través de interfaces públicas

```typescript
// ❌ Acceso directo entre módulos (acoplamiento fuerte)
// En el módulo de pagos:
import { UsuarioEntity } from '../usuarios/infraestructura/usuario.entity';
import { usuariosRepo } from '../usuarios/infraestructura/usuarios.repository';

// ✅ Comunicación a través de la API pública del módulo
// usuarios/index.ts (API pública)
export { Usuario } from './dominio/usuario.entity';
export { UsuariosService } from './aplicacion/usuarios.service';
export type { BuscarUsuarioQuery, UsuarioDTO } from './aplicacion/types';

// En pagos:
import { UsuariosService, UsuarioDTO } from '../usuarios'; // Solo lo público
```

---

## 6.3 Bounded Contexts (Contextos Acotados)

Un Bounded Context define el límite donde un modelo de dominio es válido y consistente.

### Ejemplo: "Usuario" en diferentes contextos

```
Contexto: Autenticación          Contexto: E-commerce
┌──────────────────┐            ┌──────────────────┐
│ Usuario          │            │ Cliente           │
│ ─────────────── │            │ ──────────────── │
│ id               │            │ id               │
│ email            │            │ nombre completo  │
│ contraseña_hash  │            │ direcciones[]    │
│ ultimo_login     │            │ historial_compras│
│ 2fa_secret       │            │ preferencias     │
└──────────────────┘            └──────────────────┘
     Es el mismo "usuario" del mundo real,
     pero diferentes modelos para diferentes propósitos
```

---

## 6.4 ¿Cuándo Migrar a Microservicios?

### Señales de que podrías necesitar microservicios

| Señal | Descripción |
|-------|-------------|
| **Equipos independientes** | 5+ equipos que se bloquean entre sí para deployer |
| **Escala diferencial** | Un módulo necesita 10x más recursos que el resto |
| **Tecnología especializada** | Un módulo necesita ML, stream processing, etc. |
| **SLAs diferentes** | Módulos con diferentes requerimientos de disponibilidad |
| **Compliance** | Módulos con datos sensibles que deben aislarse |

### Señales de que NO necesitas microservicios

- Equipo de menos de 20 personas
- Un solo dominio de negocio bien definido
- No tienes necesidades de escalado diferencial
- Tu monolito funciona bien y es mantenible

> "Los microservicios resuelven problemas de organización, no problemas de tecnología." — Sam Newman

---

# 7. Ingeniería Cloud-Ready

## 7.1 El Mindset Cloud-Native

Una aplicación "cloud-native" sigue los principios de **The Twelve-Factor App**:

| Factor | Principio |
|--------|-----------|
| **Base de código única** | Un repo, múltiples deploys |
| **Dependencias explícitas** | Declara todo en package.json / Dockerfile |
| **Configuración en entorno** | Variables de entorno, no en código |
| **Servicios de apoyo** | DB, cache = recursos conectables |
| **Build, release, run** | Etapas separadas estrictamente |
| **Procesos sin estado** | No guardes sesión en memoria del proceso |
| **Port binding** | La app es autocontenida |
| **Concurrencia** | Escala con procesos, no threads |
| **Descartabilidad** | Arranque rápido, apagado graceful |
| **Dev/prod equivalentes** | Mismo entorno en todos lados |
| **Logs como streams** | stdout, sin gestión interna de logs |
| **Admin processes** | Migraciones como procesos puntuales |

---

## 7.2 Docker: Contenedores en Producción

### Dockerfile de producción optimizado

```dockerfile
# ============================
# Stage 1: Dependencias
# ============================
FROM node:20-alpine AS deps
WORKDIR /app

# Copia solo los archivos de dependencias (aprovecha la cache de Docker)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ============================
# Stage 2: Builder
# ============================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ============================
# Stage 3: Imagen de producción (la más pequeña posible)
# ============================
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Crea usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copia solo lo necesario para correr
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs package.json .

USER nestjs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

### Docker Compose para desarrollo local

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      target: builder  # Usa stage de desarrollo, no producción
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run start:dev

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: miapp_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s

volumes:
  postgres_data:
```

---

## 7.3 CI/CD: Deployment Continuo

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Instalar dependencias
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Tests unitarios
        run: npm run test:unit
      
      - name: Tests de integración
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
      
      - name: Coverage check
        run: npm run test:coverage -- --coverageThreshold='{"global":{"lines":80}}'

  build-and-push:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: |
          docker build -t ${{ secrets.REGISTRY }}/miapp:${{ github.sha }} .
          docker tag ${{ secrets.REGISTRY }}/miapp:${{ github.sha }} ${{ secrets.REGISTRY }}/miapp:latest
      
      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker push ${{ secrets.REGISTRY }}/miapp:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/miapp:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy a producción
        run: |
          # Rolling deployment: sin downtime
          kubectl set image deployment/miapp \
            api=${{ secrets.REGISTRY }}/miapp:${{ github.sha }}
          kubectl rollout status deployment/miapp
```

---

## 7.4 Observabilidad: Los 3 Pilares

Sin observabilidad, estás volando a ciegas en producción.

```
Los 3 Pilares de Observabilidad
═══════════════════════════════

📊 MÉTRICAS              📝 LOGS               🔍 TRACES
─────────────────        ──────────────────     ──────────────────
¿Qué está pasando?       ¿Qué eventos           ¿Por qué tardó
en el sistema ahora?     ocurrieron?            tanto esta request?

Prometheus + Grafana     ELK Stack              Jaeger / Zipkin
Datadog                  Loki + Grafana         OpenTelemetry
New Relic                CloudWatch             AWS X-Ray

Ejemplos:                Ejemplos:              Ejemplos:
- Requests/segundo       - Error stacktraces    - Trace de DB lenta
- Latencia p99           - Logs de acceso       - Bottleneck de servicio
- Errores por minuto     - Eventos de negocio   - Latencia por endpoint
```

### Logging estructurado (la única forma correcta)

```typescript
// ❌ Logging sin estructura (imposible de filtrar/analizar)
console.log(`Usuario ${userId} realizó pago de ${monto}`);
console.error('Error al procesar: ' + error.message);

// ✅ Logging estructurado con contexto
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  serializers: pino.stdSerializers,
});

// Uso en servicio
logger.info({
  evento: 'pago_procesado',
  usuarioId,
  monto,
  moneda: 'ARS',
  pagoId: pago.id,
  duracionMs: Date.now() - inicio,
}, 'Pago procesado exitosamente');

logger.error({
  evento: 'pago_fallido',
  usuarioId,
  error: {
    mensaje: error.message,
    codigo: error.codigo,
    stack: error.stack,
  },
}, 'Error al procesar pago');

// Resultado: JSON estructurado que Loki/Elasticsearch pueden indexar y filtrar
// {"level":"info","evento":"pago_procesado","usuarioId":"123","monto":5000,...}
```

### Health Checks para Kubernetes/Cloud

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // DB responde?
      () => this.db.pingCheck('database', { timeout: 300 }),
      // Redis responde?
      () => this.redis.pingCheck('redis', { timeout: 300 }),
      // Disco disponible?
      () => this.health.check([...]),
    ]);
  }
}
// GET /health → 200 OK (todo bien) o 503 (algo falla)
// Kubernetes puede reiniciar pods que fallan el health check
```

---

## 7.5 Ecosistema Cloud Moderno

### Plataformas y sus casos de uso

| Plataforma | Tipo | Ideal para |
|-----------|------|-----------|
| **AWS** | IaaS/PaaS completo | Empresas grandes, control total |
| **Vercel** | Frontend/Edge | Next.js, frontends, Edge Functions |
| **Railway** | PaaS simple | Backends Node/Python, startups |
| **Render** | PaaS | APIs, workers, PostgreSQL managed |
| **Supabase** | BaaS | PostgreSQL + Auth + Realtime + Storage |
| **Neon** | Serverless PostgreSQL | DB serverless, branch por PR |
| **Cloudflare** | Edge | CDN, Workers, KV, DNS global |

### Stack moderno para una startup en 2025

```
Frontend: Next.js en Vercel (SSR + Edge)
Backend: NestJS en Railway o Render
Base de datos: Neon (Serverless PostgreSQL)
Cache: Upstash Redis (Serverless Redis)
Autenticación: Auth.js o Supabase Auth
Storage: Cloudflare R2 o AWS S3
Email: Resend o SendGrid
Monitoring: Sentry + Grafana Cloud
CI/CD: GitHub Actions
```

---

# 8. Caso de Estudio Práctico

## Plataforma SaaS de Logística: "FleetOps"

Diseñemos una plataforma completa para gestión de flotas de transporte.

### Requerimientos del sistema

- Empresas de transporte gestionan sus vehículos y conductores
- Seguimiento GPS en tiempo real de vehículos
- Asignación de rutas y pedidos
- Reportes y analytics para los managers
- App móvil para conductores
- Multi-tenant (múltiples empresas en la misma plataforma)

---

## 8.1 Diseño del Sistema

### Diagrama de arquitectura

```
                    CLIENTES
        ┌───────────────────────────────┐
        │  Web App   App Móvil   API     │
        │ (Next.js)  (React     (REST)  │
        │             Native)           │
        └───────────────────────────────┘
                         │
                         ▼
              ┌─────────────────┐
              │   API Gateway   │  ← Rate limiting, Auth, Routing
              │    (Nginx)      │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │  API     │  │ Tracking │  │Reporting │
  │Principal │  │Service   │  │Service   │
  │(NestJS)  │  │(Node.js) │  │(Python)  │
  └──────────┘  └──────────┘  └──────────┘
        │              │              │
        ▼              ▼              │
  ┌──────────┐  ┌──────────┐         │
  │PostgreSQL│  │ Redis    │         │
  │(Neon)    │  │(Tiempo   │         │
  │Principal │  │real GPS) │         │
  └──────────┘  └──────────┘         │
        │                            ▼
        │                     ┌──────────┐
        └────────────────────→│AnalyticDB│
                     (CDC)    │(ClickHouse│
                              │ o BigQuery│
                              └──────────┘
```

### WebSockets para GPS en tiempo real

```typescript
// tracking-service/src/tracking.gateway.ts
@WebSocketGateway({
  namespace: '/tracking',
  cors: { origin: process.env.ALLOWED_ORIGINS }
})
export class TrackingGateway {
  @WebSocketServer()
  servidor: Server;

  // El conductor envía su ubicación cada 5 segundos
  @SubscribeMessage('ubicacion:actualizar')
  async handleActualizarUbicacion(
    cliente: Socket,
    payload: { vehiculoId: string; lat: number; lng: number; velocidad: number }
  ): Promise<void> {
    const conductor = await this.validarConductor(cliente);
    
    // Guarda en Redis (tiempo real, baja latencia)
    await this.redis.setex(
      `vehiculo:${payload.vehiculoId}:ubicacion`,
      30, // expira en 30 segundos si deja de enviar
      JSON.stringify({ ...payload, timestamp: Date.now() })
    );
    
    // Emite a los managers que están viendo este vehículo
    this.servidor
      .to(`sala:empresa:${conductor.empresaId}`)
      .emit('vehiculo:ubicacion', payload);
    
    // Persiste en DB cada 30 segundos (no cada actualización)
    if (this.debePersistitr(payload.vehiculoId)) {
      await this.historialGPSRepo.guardar(payload);
    }
  }

  // Manager se suscribe a actualizaciones de su empresa
  @SubscribeMessage('empresa:suscribir')
  async handleSuscribir(cliente: Socket, empresaId: string): Promise<void> {
    await this.validarManager(cliente, empresaId);
    cliente.join(`sala:empresa:${empresaId}`);
  }
}
```

---

## 8.2 Diseño de Base de Datos

```sql
-- Multi-tenant: todas las empresas en la misma DB
-- Row-Level Security de PostgreSQL para aislamiento

-- Tabla raíz del tenant
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conductores pertenecen a una empresa
CREATE TABLE conductores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nombre VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  licencia VARCHAR(50) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas frecuentes
CREATE INDEX idx_conductores_empresa ON conductores(empresa_id) WHERE activo = true;

-- Vehículos con particionamiento por empresa
CREATE TABLE vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  placa VARCHAR(20) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  capacidad_kg DECIMAL(10,2),
  estado VARCHAR(50) NOT NULL DEFAULT 'disponible',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT vehiculos_placa_empresa_unique UNIQUE (empresa_id, placa)
);

-- Historial GPS (tabla de alta escritura, particionada por mes)
CREATE TABLE historial_gps (
  id BIGSERIAL,
  vehiculo_id UUID NOT NULL REFERENCES vehiculos(id),
  empresa_id UUID NOT NULL, -- Desnormalizado para filtros eficientes
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  velocidad_kmh DECIMAL(6,2),
  registrado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (registrado_en);

-- Particiones por mes (se crean automáticamente con pg_partman)
CREATE TABLE historial_gps_2025_01 PARTITION OF historial_gps
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Índice espacial para queries geográficas
CREATE INDEX idx_gps_vehiculo_tiempo ON historial_gps(vehiculo_id, registrado_en DESC);
```

---

## 8.3 Estrategia de Caching

```typescript
// Caching por capas para FleetOps

// Capa 1: CDN (Vercel Edge) - Assets estáticos
// next.config.js
const nextConfig = {
  headers: async () => [
    {
      source: '/static/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    }
  ]
};

// Capa 2: Redis - Datos semi-dinámicos
class CacheDeFlota {
  // Lista de vehículos de una empresa (cambia pocas veces al día)
  async obtenerVehiculos(empresaId: string): Promise<Vehiculo[]> {
    const clave = `empresa:${empresaId}:vehiculos`;
    const cached = await redis.get(clave);
    
    if (cached) return JSON.parse(cached);
    
    const vehiculos = await vehiculosRepo.listarPorEmpresa(empresaId);
    await redis.setex(clave, 300, JSON.stringify(vehiculos)); // 5 minutos
    return vehiculos;
  }
  
  // Ubicación actual de vehículo (alta frecuencia, TTL corto)
  async obtenerUbicacionActual(vehiculoId: string): Promise<UbicacionGPS | null> {
    const data = await redis.get(`vehiculo:${vehiculoId}:ubicacion`);
    return data ? JSON.parse(data) : null;
  }
}

// Capa 3: CDN + ISR - Reportes públicos
// app/reportes/[empresaId]/page.tsx
export const revalidate = 3600; // Se re-genera cada hora

export default async function ReporteEmpresa({ params }) {
  const reporte = await reportesService.generar(params.empresaId);
  return <DashboardReporte datos={reporte} />;
}
```

---

## 8.4 Estrategia de Deployment

```yaml
# Deployment en Kubernetes con zero-downtime

apiVersion: apps/v1
kind: Deployment
metadata:
  name: fleetops-api
spec:
  replicas: 3                    # Siempre 3 instancias mínimo
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1                # Máximo 1 instancia extra durante deploy
      maxUnavailable: 0          # Nunca bajar de 3 instancias
  template:
    spec:
      containers:
      - name: api
        image: fleetops/api:${IMAGE_TAG}
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:           # ¿Está vivo?
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:          # ¿Está listo para recibir tráfico?
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# Horizontal Pod Autoscaler: escala automáticamente según CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70   # Escala cuando CPU supera 70%
```

---

# 9. Errores Comunes de Ingeniería

## 9.1 Los 10 Errores Más Costosos

### Error 1: Microservicios prematuros

```
Equipo de 5 personas, año 1:
❌ "Vamos a hacer microservicios desde el principio, como Netflix"
✅ "Vamos a hacer un monolito modular bien organizado"

Resultado del error:
- 3 meses configurando infraestructura antes de escribir features
- Complejidad de deployment multiplicada x10
- La mayoría de equipos pequeños abandonan o vuelven al monolito
```

### Error 2: Ignorar el index en la base de datos

```sql
-- Tabla con 10 millones de registros

-- ❌ Sin índice: 5-10 segundos de query
SELECT * FROM pedidos WHERE cliente_id = '550e8400-e29b-41d4-a716-446655440000';
-- → Full table scan de 10 millones de filas

-- ✅ Con índice: 1-5 millisegundos
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
SELECT * FROM pedidos WHERE cliente_id = '550e8400-e29b-41d4-a716-446655440000';
-- → Index scan + lookup = 10,000x más rápido
```

> **Regla**: Cualquier columna usada en `WHERE`, `JOIN`, `ORDER BY` con alta cardinalidad debe tener un índice.

### Error 3: N+1 Query Problem

```typescript
// ❌ N+1: 1 query para pedidos + N queries para cada cliente
const pedidos = await db.query('SELECT * FROM pedidos LIMIT 100');
for (const pedido of pedidos) {
  // Esto ejecuta 100 queries adicionales!
  pedido.cliente = await db.query(`SELECT * FROM clientes WHERE id = '${pedido.clienteId}'`);
}

// ✅ JOIN o eager loading
const pedidos = await pedidosRepo.find({
  relations: ['cliente'],  // TypeORM hace 1 query con JOIN
  take: 100
});

// O con QueryBuilder explícito
const pedidos = await db
  .createQueryBuilder('pedido')
  .leftJoinAndSelect('pedido.cliente', 'cliente')
  .limit(100)
  .getMany();
```

### Error 4: Componentes Frontend gigantes

```
❌ Un componente de 800 líneas que:
- Fetchea datos
- Tiene 15 estados locales
- Renderiza 3 secciones distintas
- Maneja validación de formulario
- Tiene lógica de permisos

✅ Divide en:
- useProductosData() - fetching y cache
- ProductoForm - formulario aislado
- ProductoDetalle - vista del producto
- AccionesProducto - botones con lógica de permisos
```

### Error 5: Commits y branches directos a main sin revisión

```bash
# ❌ Flujo sin disciplina
git add .
git commit -m "fix"
git push origin main

# ✅ Flujo de desarrollo profesional
git checkout -b feature/agregar-filtro-pedidos
# ... trabajo ...
git commit -m "feat(pedidos): agregar filtro por estado y fecha

- Agrega query params: estado, fechaDesde, fechaHasta
- Valida rangos de fecha en el DTO
- Agrega índice compuesto en BD
- Tests unitarios para el servicio
- Tests de integración para el endpoint"

git push origin feature/agregar-filtro-pedidos
# → Abre Pull Request → Code Review → CI/CD → Merge
```

### Error 6: Variables de entorno hardcodeadas

```typescript
// ❌ Nunca, jamás
const stripe = new Stripe('sk_live_REAL_SECRET_KEY_AQUI');
const db = postgres('postgresql://admin:password123@prod-db.empresa.com/produccion');

// ✅ Siempre variables de entorno con validación en startup
import { z } from 'zod';

const EnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

// Valida al iniciar la app (falla rápido si algo falta)
export const env = EnvSchema.parse(process.env);
```

### Error 7: No versionar la API

```typescript
// ❌ Cambiar la API y romper clientes existentes
// Antes: GET /api/usuarios → { nombre: "Juan" }
// Después: GET /api/usuarios → { name: "Juan" } // Rompe todos los clientes!

// ✅ Versionar la API
// GET /api/v1/usuarios → { nombre: "Juan" }  // Sigue funcionando
// GET /api/v2/usuarios → { name: "Juan" }    // Nueva versión opt-in

@Controller('v1/usuarios')
class UsuariosV1Controller { ... }

@Controller('v2/usuarios')
class UsuariosV2Controller { ... }
```

### Error 8: No tener tests

```
El costo de un bug:
┌─────────────────────────────────────────────────┐
│ En desarrollo:     1x    (corriges en minutos)  │
│ En code review:    10x   (corriges en horas)    │
│ En staging:        25x   (corriges en días)     │
│ En producción:     100x  (corriges en semanas + │
│                           reputación dañada)    │
└─────────────────────────────────────────────────┘
```

```typescript
// Test bien escrito (sigue AAA: Arrange, Act, Assert)
describe('ServicioDePagos.procesarPago', () => {
  it('debe retornar error cuando el usuario está bloqueado', async () => {
    // Arrange
    const usuarioBloqueado = crearUsuarioMock({ estaBloqueado: true });
    mockRepositorioUsuarios.buscarPorId.mockResolvedValue(usuarioBloqueado);
    
    // Act & Assert
    await expect(
      servicioDePagos.procesarPago({ usuarioId: usuarioBloqueado.id, monto: 100, tokenTarjeta: 'tok_test' })
    ).rejects.toThrow(UsuarioBloqueado);
    
    // Verifica que NO se intentó cobrar
    expect(mockPasarelaDePago.cobrar).not.toHaveBeenCalled();
  });
});
```

### Error 9: Logging insuficiente o excesivo

```typescript
// ❌ Demasiado poco: imposible debuggear en producción
async function procesarPedido(pedidoId: string) {
  const resultado = await hacerCosas(pedidoId);
  return resultado;
}

// ❌ Demasiado: inunda los logs, caro de almacenar
logger.debug('Iniciando función procesarPedido');
logger.debug('Buscando pedido en DB');
logger.debug('Pedido encontrado:', JSON.stringify(pedido, null, 2));
// ... 50 líneas de debug en cada request

// ✅ Balance correcto
async function procesarPedido(pedidoId: string) {
  const inicio = Date.now();
  logger.info({ pedidoId }, 'Iniciando procesamiento de pedido');
  
  try {
    const resultado = await hacerCosas(pedidoId);
    logger.info({ pedidoId, duracionMs: Date.now() - inicio }, 'Pedido procesado exitosamente');
    return resultado;
  } catch (error) {
    logger.error({ pedidoId, error, duracionMs: Date.now() - inicio }, 'Error procesando pedido');
    throw error;
  }
}
```

### Error 10: Optimización prematura

> "La optimización prematura es la raíz de todo mal en programación." — Donald Knuth

```
❌ Proceso típico del perfeccionista:
1. Escribe el algoritmo más optimizado posible
2. Agrega caching desde el inicio
3. Implementa sharding en la DB "por si acaso"
4. Resultado: 3 meses de trabajo, 10 usuarios, 0 revenue

✅ Proceso correcto:
1. Haz que funcione (correcto)
2. Haz que sea claro (mantenible)
3. Mide el performance con datos reales
4. Optimiza solo los bottlenecks que mides
```

---

# 10. El Futuro de la Ingeniería de Software

## 10.1 IA en el Desarrollo de Software

La IA no va a reemplazar a los ingenieros. Va a reemplazar a los ingenieros que no saben usar IA.

### El ingeniero augmentado con IA (hoy, 2025)

```
Tareas que la IA hace bien hoy:
✅ Escribir boilerplate y código repetitivo
✅ Refactoring de código existente
✅ Escritura de tests unitarios
✅ Documentación de código
✅ Code review preliminar
✅ Explicar código desconocido
✅ Generar primeras versiones de componentes
✅ Debugging con contexto

Tareas donde el ingeniero sigue siendo irremplazable:
🧠 Diseño de arquitectura del sistema
🧠 Entender el dominio del negocio profundamente
🧠 Tomar decisiones de trade-offs complejos
🧠 Liderar y mentorear equipos
🧠 Definir qué construir (no solo cómo)
🧠 Evaluar la calidad y seguridad del código generado
```

### Flujo de trabajo con IA en 2025

```
1. Definir el problema con claridad (ingeniero)
         │
         ↓
2. Diseñar la solución a alto nivel (ingeniero)
         │
         ↓
3. Generar primera implementación (AI + ingeniero)
         │
         ↓
4. Revisar, corregir, mejorar (ingeniero)
         │
         ↓
5. Escribir tests (AI + ingeniero)
         │
         ↓
6. Code review (ingeniero + AI como asistente)
         │
         ↓
7. Deploy y monitoreo (ingeniero)
```

---

## 10.2 Agentes de IA en Ingeniería

Los agentes de IA (como Claude Code, Devin, etc.) pueden ejecutar ciclos completos de desarrollo con supervisión humana.

### Casos de uso actuales de agentes

| Caso de uso | Estado actual |
|-------------|---------------|
| Migrar código entre versiones | ✅ Funcional |
| Escribir tests para código existente | ✅ Funcional |
| Refactoring a gran escala | ✅ Funcional |
| Investigar y aplicar fixes de bugs | ⚠️ Funcional con supervisión |
| Diseñar nuevas features complejas | 🔄 En desarrollo |
| Sistemas autónomos end-to-end | 🔮 Futuro cercano |

---

## 10.3 Tendencias que Definirán la Próxima Década

### 1. Edge Computing se vuelve el default

```
2020: La mayoría de compute en centros de datos centralizados
2025: Edge Functions para latencia crítica (Cloudflare Workers, Vercel Edge)
2030: La lógica de negocio vive mayormente en el edge,
      cerca del usuario
```

### 2. Serverless y PaaS eliminan la gestión de infraestructura

```
2025: Los equipos pequeños nunca gestionan servidores
2030: Gestionar servidores directamente será como
      escribir assembler hoy (especialistas, no el promedio)
```

### 3. Developer Experience (DX) como ventaja competitiva

```
Las mejores herramientas del futuro:
- Zero configuration
- Feedback instantáneo (< 1 segundo de hot reload)
- Errores que se explican solos
- Deploy con un comando
- Observabilidad integrada por defecto
```

### 4. Software que se auto-observa y auto-optimiza

```
2030: Los sistemas detectarán sus propios bottlenecks,
      generarán PRs de optimización, y los ingenieros
      aprobarán o rechazarán los cambios propuestos.
```

### 5. La brecha entre "construir" y "operar" desaparece

```
Hoy: Developer escribe código → Ops team lo despliega → SRE lo monitorea
Futuro: Platform Engineering abstrae todo, el developer hace deploy
        con confianza total desde su PR
```

---

## 10.4 Las Habilidades que Siempre van a Importar

Sin importar cuánto cambie la tecnología, estas habilidades siempre serán críticas:

| Habilidad | Por qué importa siempre |
|-----------|------------------------|
| **Pensamiento sistémico** | Los sistemas complejos siempre necesitarán humanos que entiendan el todo |
| **Comunicación técnica** | Explicar ideas complejas seguirá siendo difícil y valioso |
| **Juicio sobre trade-offs** | Las decisiones de ingeniería siempre tendrán contexto humano |
| **Entender el dominio del negocio** | La tecnología sirve al negocio, no al revés |
| **Aprender continuamente** | La velocidad de cambio solo va a aumentar |
| **Colaboración y liderazgo** | Los sistemas grandes necesitan equipos coordinados |
| **Pensamiento crítico** | Evaluar el trabajo de IA y de otros ingenieros |

---

## Checklist Final: ¿Eres un Ingeniero o un Programador?

### Mentalidad de Ingeniería

- [ ] Piensas en el sistema completo antes de escribir la primera línea
- [ ] Consideras los trade-offs explícitamente en cada decisión
- [ ] Preguntas "¿por qué?" antes de "¿cómo?"
- [ ] Piensas en la mantenibilidad para el equipo que vendrá después
- [ ] Mides antes de optimizar
- [ ] Simplificas activamente en vez de agregar complejidad

### Código y Arquitectura

- [ ] Tu código puede ser entendido sin comentarios en el 90% de los casos
- [ ] Tus funciones hacen una sola cosa
- [ ] Tienes tests que dan confianza para refactorizar
- [ ] Tus errores son tipados y específicos
- [ ] Tu arquitectura puede evolucionar sin rewrites completos
- [ ] Tus módulos tienen responsabilidades claras y aisladas

### Producción y Escalabilidad

- [ ] Tienes observabilidad (logs, métricas, traces)
- [ ] Puedes deployar sin downtime
- [ ] Sabes dónde están los bottlenecks de tu sistema
- [ ] Tienes health checks y alertas configuradas
- [ ] Puedes hacer rollback en minutos si algo falla

### Equipo y Proceso

- [ ] Tu código es fácil de onboardear para nuevos miembros
- [ ] Haces code reviews que elevan al equipo
- [ ] Documentas las decisiones importantes (Architecture Decision Records)
- [ ] Tratas la deuda técnica como un riesgo de negocio real

---

> **Mensaje Final del Mentor**
>
> La ingeniería de software no se trata de conocer el framework más nuevo o el lenguaje más moderno. Se trata de construir sistemas que resuelven problemas reales de manera que otros puedan entender, mantener y evolucionar.
>
> Los mejores ingenieros que he conocido tienen algo en común: **humildad intelectual**. Saben que siempre hay más que aprender, que sus soluciones de hoy serán los legacy systems de mañana, y que el código más valioso es aquel que no necesita ser escrito porque entendiste el problema lo suficientemente bien.
>
> Escribe código como si la persona que lo va a mantener fuera un psicópata que sabe dónde vivís. Y la mayoría de las veces, esa persona eres tú mismo, 6 meses después.
>
> — *Sé el ingeniero que a tu yo del pasado le hubiera encantado tener como mentor.*

---

**📚 Recursos Recomendados para Profundizar**

- *Clean Code* — Robert C. Martin
- *Designing Data-Intensive Applications* — Martin Kleppmann
- *The Pragmatic Programmer* — David Thomas & Andrew Hunt
- *Building Microservices* — Sam Newman
- *A Philosophy of Software Design* — John Ousterhout
- *System Design Interview* — Alex Xu
- Documentación oficial de NestJS, Next.js, PostgreSQL, Redis
- Architecture of Open Source Applications (aosabook.org)
- High Scalability Blog (highscalability.com)
- The Twelve-Factor App (12factor.net)