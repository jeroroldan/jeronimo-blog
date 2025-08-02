---
title: 'Arquitecto frontend'
code: 'frontend'
description: 'Guía Completa de Arquitecto frontend'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass: Arquitectura Frontend Escalable

## Guía Completa del Experto

### ÍNDICE

1. [Fundamentos de Arquitectura Frontend](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#fundamentos)
2. [Principios de Diseño de Software](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#principios)
3. [Patrones de Arquitectura Esenciales](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#patrones)
4. [Gestión de Estado y Datos](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#estado)
5. [Modularización y Componentización](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#modularizacion)
6. [Performance y Optimización](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#performance)
7. [Testing y Calidad](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#testing)
8. [Escalabilidad y Mantenibilidad](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#escalabilidad)
9. [Herramientas y Ecosistema Moderno](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#herramientas)
10. [Arquitecturas Avanzadas](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#arquitecturas-avanzadas)
11. [Plan de Desarrollo del Experto](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#desarrollo)
12. [Reflexión Final](https://claude.ai/chat/061b299d-76c3-4df8-8d42-1f9aba84170d#reflexion)

---

## 1. FUNDAMENTOS DE ARQUITECTURA FRONTEND {#fundamentos}

### ¿Qué es la Arquitectura Frontend?

**Analogía: El Plano de una Ciudad** Imagina que estás diseñando una ciudad. No puedes simplemente poner edificios al azar. Necesitas:

* **Zonificación** (áreas residenciales, comerciales, industriales) = Separación de responsabilidades
* **Sistema de transporte** (calles, autopistas, metro) = Flujo de datos
* **Servicios públicos** (agua, electricidad, internet) = APIs y servicios compartidos
* **Normativas de construcción** = Estándares y convenciones de código

La arquitectura frontend es el **plano maestro** de tu aplicación web.

### Los 4 Pilares de la Arquitectura Frontend

**1. Separación de Responsabilidades**

```
┌─────────────────┐
│   Presentación  │ ← Lo que ve el usuario
├─────────────────┤
│   Lógica        │ ← Cómo funciona la app
├─────────────────┤
│   Datos         │ ← Qué información maneja
├─────────────────┤
│   Comunicación  │ ← Cómo habla con el servidor
└─────────────────┘
```

**2. Escalabilidad**

* **Horizontal**: Agregar nuevas features sin romper las existentes
* **Vertical**: Manejar más usuarios/datos sin degradar performance
* **Temporal**: Facilitar cambios futuros sin reescribir todo

**3. Mantenibilidad**

* **Legibilidad**: Código que se explica a sí mismo
* **Modificabilidad**: Cambios localizados y seguros
* **Testabilidad**: Componentes que se pueden probar aisladamente

**4. Performance**

* **Carga inicial**: Tiempo hasta que el usuario puede interactuar
* **Runtime**: Respuesta fluida durante el uso
* **Memoria**: Uso eficiente de recursos del navegador

### Ejemplo Real: Netflix vs. Sitio Web Simple

**Sitio Web Simple (Blog Personal):**

```html
<!-- Arquitectura monolítica simple -->
<html>
  <head>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header>...</header>
    <main id="content">...</main>
    <footer>...</footer>
    <script src="script.js"></script>
  </body>
</html>
```

**Netflix (Aplicación Compleja):**

```
┌─ Micro-frontends ─────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Header  │ │ Search  │ │ Player  │ │
│ │ Team A  │ │ Team B  │ │ Team C  │ │
│ └─────────┘ └─────────┘ └─────────┘ │
└───────────────────────────────────────┘
┌─ Estado Global ───────────────────────┐
│ User Profile | Viewing History       │
│ Preferences | Content Metadata      │
└───────────────────────────────────────┘
┌─ Servicios ───────────────────────────┐
│ Recommendation | Analytics | A/B Test │
└───────────────────────────────────────┘
```

---

## 2. PRINCIPIOS DE DISEÑO DE SOFTWARE {#principios}

### SOLID para Frontend

**S - Single Responsibility Principle***Analogía: Un Chef Especializado*

❌ **Mal ejemplo - El "Chef Todo-en-Uno":**

```javascript
// Componente que hace DEMASIADO
class UserDashboard extends Component {
  constructor() {
    this.state = { user: null, posts: [], notifications: [] };
  }
  
  fetchUser() { /* lógica de API */ }
  updateUser() { /* lógica de actualización */ }
  fetchPosts() { /* lógica de posts */ }
  renderHeader() { /* lógica de UI */ }
  handleNotifications() { /* lógica de notificaciones */ }
  validateForm() { /* lógica de validación */ }
  // ... 15 métodos más
}
```

✅ **Buen ejemplo - Especialización:**

```javascript
// Cada componente tiene UNA responsabilidad
const UserProfile = ({ user, onUpdate }) => {
  return <ProfileView user={user} onUpdate={onUpdate} />;
};

const PostsList = ({ posts }) => {
  return <PostsView posts={posts} />;
};

const NotificationCenter = ({ notifications }) => {
  return <NotificationsView notifications={notifications} />;
};

// Orquestador que combina especialistas
const UserDashboard = () => {
  const { user, posts, notifications } = useUserData();
  
  return (
    <div>
      <UserProfile user={user} onUpdate={updateUser} />
      <PostsList posts={posts} />
      <NotificationCenter notifications={notifications} />
    </div>
  );
};
```

**O - Open/Closed Principle***Analogía: Plugin System*

```javascript
// Sistema base CERRADO para modificación
class NotificationService {
  send(notification) {
    const sender = NotificationSenderFactory.create(notification.type);
    return sender.send(notification);
  }
}

// ABIERTO para extensión - Nuevos tipos sin modificar código existente
class EmailSender {
  send(notification) {
    // lógica de email
  }
}

class PushSender {
  send(notification) {
    // lógica de push
  }
}

class SlackSender { // ← Nuevo tipo agregado sin tocar código existente
  send(notification) {
    // lógica de Slack
  }
}
```

**L - Liskov Substitution Principle***Analogía: Intercambiabilidad de Piezas*

```javascript
// Contrato base
interface DataLoader {
  load(id: string): Promise<Data>;
}

// Implementaciones intercambiables
class APILoader implements DataLoader {
  async load(id: string) {
    const response = await fetch(`/api/data/${id}`);
    return response.json();
  }
}

class CacheLoader implements DataLoader {
  async load(id: string) {
    return localStorage.getItem(`data_${id}`);
  }
}

class MockLoader implements DataLoader {
  async load(id: string) {
    return { id, name: `Mock Data ${id}` };
  }
}

// El componente no necesita saber QUÉ tipo de loader usa
const DataComponent = ({ loader }: { loader: DataLoader }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    loader.load('123').then(setData); // Funciona con cualquier implementación
  }, []);
  
  return <div>{data?.name}</div>;
};
```

**I - Interface Segregation Principle***Analogía: Controles Específicos*

❌ **Interfaz "Gorda":**

```typescript
interface MegaComponent {
  // Props para funcionalidad de lista
  items: Item[];
  onItemClick: (item: Item) => void;
  
  // Props para funcionalidad de filtro
  filter: string;
  onFilterChange: (filter: string) => void;
  
  // Props para funcionalidad de paginación
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  
  // Props para funcionalidad de exportación
  exportFormat: string;
  onExport: () => void;
}
```

✅ **Interfaces específicas:**

```typescript
interface ListProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

interface FilterProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Cada componente usa solo lo que necesita
const ItemList = ({ items, onItemClick }: ListProps) => { /* */ };
const SearchFilter = ({ filter, onFilterChange }: FilterProps) => { /* */ };
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => { /* */ };
```

**D - Dependency Inversion Principle***Analogía: Conectores Universales*

❌ **Dependencia directa:**

```javascript
class UserComponent {
  constructor() {
    this.api = new RestAPI(); // ← Dependencia concreta
  }
  
  async loadUser() {
    return this.api.get('/users/me'); // ← Acoplado a REST
  }
}
```

✅ **Inversión de dependencia:**

```javascript
interface APIService {
  get(url: string): Promise<any>;
}

class UserComponent {
  constructor(private api: APIService) {} // ← Depende de abstracción
  
  async loadUser() {
    return this.api.get('/users/me'); // ← Funciona con cualquier implementación
  }
}

// Diferentes implementaciones
class RestAPI implements APIService {
  async get(url: string) { /* REST logic */ }
}

class GraphQLAPI implements APIService {
  async get(url: string) { /* GraphQL logic */ }
}

class MockAPI implements APIService {
  async get(url: string) { /* Mock data */ }
}
```

### DRY vs. WET Principle

**DRY (Don't Repeat Yourself)***Analogía: Moldes de Cocina*

❌ **Repetición (WET - Write Everything Twice):**

```javascript
// Botón de Login
const LoginButton = () => (
  <button 
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
    onClick={handleLogin}
  >
    Login
  </button>
);

// Botón de Signup
const SignupButton = () => (
  <button 
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
    onClick={handleSignup}
  >
    Sign Up
  </button>
);
```

✅ **DRY - Componente reutilizable:**

```javascript
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false 
}) => {
  const baseClasses = "font-bold rounded transition-colors duration-200";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };
  const sizes = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-4",
    large: "py-3 px-6 text-lg"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Uso
<Button onClick={handleLogin}>Login</Button>
<Button onClick={handleSignup}>Sign Up</Button>
<Button variant="danger" onClick={handleDelete}>Delete</Button>
```

---

## 3. PATRONES DE ARQUITECTURA ESENCIALES {#patrones}

### Model-View-Controller (MVC)

*Analogía: Restaurant Operations*

```
┌─────────────────┐
│     VIEW        │ ← Mesero (presenta la comida al cliente)
│   (Components)  │
└─────────────────┘
         │
┌─────────────────┐
│   CONTROLLER    │ ← Chef (coordina operaciones)
│  (Event Handlers) │
└─────────────────┘
         │
┌─────────────────┐
│     MODEL       │ ← Inventario (datos y reglas de negocio)
│   (Data Store)  │
└─────────────────┘
```

**Implementación React:**

```javascript
// MODEL - Estado y lógica de negocio
class UserModel {
  constructor() {
    this.users = [];
    this.loading = false;
  }
  
  async fetchUsers() {
    this.loading = true;
    this.users = await api.getUsers();
    this.loading = false;
  }
  
  addUser(user) {
    if (this.validateUser(user)) {
      this.users.push(user);
      return true;
    }
    return false;
  }
  
  validateUser(user) {
    return user.email && user.name;
  }
}

// CONTROLLER - Lógica de aplicación
class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  
  async loadUsers() {
    await this.model.fetchUsers();
    this.view.render();
  }
  
  handleAddUser(userData) {
    if (this.model.addUser(userData)) {
      this.view.showSuccess("User added!");
    } else {
      this.view.showError("Invalid user data");
    }
  }
}

// VIEW - Presentación
const UserView = ({ controller, model }) => {
  return (
    <div>
      <UserList 
        users={model.users} 
        loading={model.loading}
      />
      <AddUserForm 
        onSubmit={controller.handleAddUser}
      />
    </div>
  );
};
```

### Observer Pattern

*Analogía: Newsletter Subscription*

```javascript
// Sujeto observable (Publisher)
class EventBus {
  constructor() {
    this.subscribers = new Map();
  }
  
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  
    // Retorna función de cleanup
    return () => {
      const callbacks = this.subscribers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  emit(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => {
        callback(data);
      });
    }
  }
}

// Uso en componentes
const useEventBus = () => {
  const eventBus = useRef(new EventBus()).current;
  
  const subscribe = useCallback((event, callback) => {
    return eventBus.subscribe(event, callback);
  }, []);
  
  const emit = useCallback((event, data) => {
    eventBus.emit(event, data);
  }, []);
  
  return { subscribe, emit };
};

// Componente que escucha
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const { subscribe } = useEventBus();
  
  useEffect(() => {
    const unsubscribe = subscribe('notification', (notification) => {
      setNotifications(prev => [...prev, notification]);
    });
  
    return unsubscribe; // Cleanup
  }, []);
  
  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id}>{notification.message}</div>
      ))}
    </div>
  );
};

// Componente que emite
const UserActions = () => {
  const { emit } = useEventBus();
  
  const handleUserCreated = (user) => {
    emit('notification', {
      id: Date.now(),
      message: `User ${user.name} created successfully!`,
      type: 'success'
    });
  };
  
  return <button onClick={() => handleUserCreated({ name: 'John' })}>Create User</button>;
};
```

### Command Pattern

*Analogía: Remote Control*

```javascript
// Interfaz Command
class Command {
  execute() { throw new Error('Execute method must be implemented'); }
  undo() { throw new Error('Undo method must be implemented'); }
}

// Comandos concretos
class AddItemCommand extends Command {
  constructor(list, item) {
    super();
    this.list = list;
    this.item = item;
  }
  
  execute() {
    this.list.push(this.item);
  }
  
  undo() {
    const index = this.list.indexOf(this.item);
    if (index > -1) {
      this.list.splice(index, 1);
    }
  }
}

class DeleteItemCommand extends Command {
  constructor(list, item) {
    super();
    this.list = list;
    this.item = item;
    this.index = -1;
  }
  
  execute() {
    this.index = this.list.indexOf(this.item);
    if (this.index > -1) {
      this.list.splice(this.index, 1);
    }
  }
  
  undo() {
    if (this.index > -1) {
      this.list.splice(this.index, 0, this.item);
    }
  }
}

// Invoker (Control Remoto)
class UndoRedoManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }
  
  execute(command) {
    // Elimina comandos futuros si estamos en el medio del historial
    this.history = this.history.slice(0, this.currentIndex + 1);
  
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }
  
  undo() {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
    }
  }
  
  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
    }
  }
  
  canUndo() {
    return this.currentIndex >= 0;
  }
  
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}

// Uso en React
const useUndoRedo = (initialState) => {
  const [state, setState] = useState(initialState);
  const manager = useRef(new UndoRedoManager()).current;
  
  const executeCommand = (command) => {
    manager.execute(command);
    setState([...state]); // Trigger re-render
  };
  
  const undo = () => {
    manager.undo();
    setState([...state]); // Trigger re-render
  };
  
  const redo = () => {
    manager.redo();
    setState([...state]); // Trigger re-render
  };
  
  return {
    state,
    executeCommand,
    undo,
    redo,
    canUndo: manager.canUndo(),
    canRedo: manager.canRedo()
  };
};

// Componente con Undo/Redo
const TodoList = () => {
  const { state: todos, executeCommand, undo, redo, canUndo, canRedo } = useUndoRedo([]);
  
  const addTodo = (text) => {
    const todo = { id: Date.now(), text };
    executeCommand(new AddItemCommand(todos, todo));
  };
  
  const deleteTodo = (todo) => {
    executeCommand(new DeleteItemCommand(todos, todo));
  };
  
  return (
    <div>
      <div>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
    
      <input 
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addTodo(e.target.value);
            e.target.value = '';
          }
        }}
        placeholder="Add todo..."
      />
    
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Strategy Pattern

*Analogía: Payment Methods*

```javascript
// Estrategias de validación
class ValidationStrategy {
  validate(value) {
    throw new Error('Validate method must be implemented');
  }
}

class EmailValidationStrategy extends ValidationStrategy {
  validate(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? '' : 'Invalid email format'
    };
  }
}

class PasswordValidationStrategy extends ValidationStrategy {
  validate(password) {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
  
    const isValid = minLength && hasUpper && hasLower && hasNumber;
  
    return {
      isValid,
      message: isValid ? '' : 'Password must contain at least 8 characters, uppercase, lowercase, and number'
    };
  }
}

class PhoneValidationStrategy extends ValidationStrategy {
  validate(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    const isValid = phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  
    return {
      isValid,
      message: isValid ? '' : 'Invalid phone number'
    };
  }
}

// Context que usa las estrategias
const useValidation = (strategy) => {
  const [error, setError] = useState('');
  
  const validate = (value) => {
    const result = strategy.validate(value);
    setError(result.message);
    return result.isValid;
  };
  
  return { validate, error };
};

// Componente que usa diferentes estrategias
const FormField = ({ type, value, onChange, label }) => {
  const getStrategy = () => {
    switch (type) {
      case 'email': return new EmailValidationStrategy();
      case 'password': return new PasswordValidationStrategy();
      case 'phone': return new PhoneValidationStrategy();
      default: return null;
    }
  };
  
  const strategy = getStrategy();
  const { validate, error } = useValidation(strategy);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (strategy) {
      validate(newValue);
    }
  };
  
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className={error ? 'border-red-500' : 'border-gray-300'}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
```

---

## 4. GESTIÓN DE ESTADO Y DATOS {#estado}

### Tipos de Estado

*Analogía: Niveles de Memoria Humana*

```
┌─ Estado Local (Memoria de Trabajo) ────┐
│ • Formulario actual                    │
│ • Animaciones en progreso              │
│ • UI temporales (modals, tooltips)     │
└────────────────────────────────────────┘

┌─ Estado de Componente (Memoria Personal) ─┐
│ • Preferencias de usuario               │
│ • Configuración de vista                │
│ • Cache de datos específicos            │
└─────────────────────────────────────────┘

┌─ Estado Global (Memoria Colectiva) ────┐
│ • Usuario autenticado                  │
│ • Configuración de la aplicación       │
│ • Datos compartidos entre componentes  │
└────────────────────────────────────────┘

┌─ Estado del Servidor (Memoria Externa) ┐
│ • Base de datos                        │
│ • APIs externas                        │
│ • Cache distribuido                    │
└────────────────────────────────────────┘
```

### Patrón de Gestión de Estado Escalable

**1. Estado Local con useState/useReducer**

```javascript
// Para estado simple
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
};

// Para estado complejo
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message }
      };
    case 'RESET':
      return action.initialState;
    default:
      return state;
  }
};

const useForm = (initialState, validationSchema) => {
  const [state, dispatch] = useReducer(formReducer, {
    ...initialState,
    errors: {}
  });
  
  const setField = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  
    // Validación asíncrona
    if (validationSchema[field]) {
      const error = validationSchema[field](value);
      if (error) {
        dispatch({ type: 'SET_ERROR', field, message: error });
      }
    }
  };
  
  const reset = () => {
    dispatch({ type: 'RESET', initialState });
  };
  
  return { state, setField, reset };
};
```

**2. Estado Global con Context + Reducer**

```javascript
// Store global
const AppStateContext = createContext();
const AppDispatchContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.notification]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id)
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    isAuthenticated: false,
    theme: 'light',
    notifications: []
  });
  
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Hooks personalizados para acceso tipado
const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};

const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
};

// Actions creators tipados
const actions = {
  setUser: (user) => ({ type: 'SET_USER', user }),
  logout: () => ({ type: 'LOGOUT' }),
  setTheme: (theme) => ({ type: 'SET_THEME', theme }),
  addNotification: (message, type = 'info') => ({
    type: 'ADD_NOTIFICATION',
    notification: { id: Date.now(), message, type }
  }),
  removeNotification: (id) => ({ type: 'REMOVE_NOTIFICATION', id })
};

// Hook de alto nivel
const useAuth = () => {
  const { user, isAuthenticated } = useAppState();
  const dispatch = useAppDispatch();
  
  const login = async (credentials) => {
    try {
      const user = await authAPI.login(credentials);
      dispatch(actions.setUser(user));
      dispatch(actions.addNotification('Login successful!', 'success'));
    } catch (error) {
      dispatch(actions.addNotification('Login failed', 'error'));
    }
  };
  
  const logout = () => {
    dispatch(actions.logout());
    dispatch(actions.addNotification('Logged out successfully', 'info'));
  };
  
  return { user, isAuthenticated, login, logout };
};
```

**3. Estado del Servidor con React Query/SWR**

```javascript
// Custom hook para gestión de datos del servidor
const useApiData = (key, fetcher, options = {}) => {
  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    ...options
  });
  
  return {
    data,
    error,
    isLoading,
    refresh: mutate,
    isError: !!error
  };
};

// Hook específico para usuarios
const useUsers = () => {
  const { data, error, isLoading, refresh } = useApiData(
    '/api/users',
    () => fetch('/api/users').then(r => r.json())
  );
  
  const addUser = async (userData) => {
    try {
      const newUser = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(r => r.json());
    
      // Optimistic update
      refresh([...data, newUser], false);
    
      return newUser;
    } catch (error) {
      refresh(); // Revert on error
      throw error;
    }
  };
  
  const updateUser = async (id, updates) => {
    const originalData = data;
  
    try {
      // Optimistic update
      const updatedUsers = data.map(user => 
        user.id === id ? { ...user, ...updates } : user
      );
      refresh(updatedUsers, false);
    
      const updatedUser = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then(r => r.json());
    
      return updatedUser;
    } catch (error) {
      refresh(originalData, false); // Revert
      throw error;
    }
  };
  
  return {
    users: data || [],
    error,
    isLoading,
    refresh,
    addUser,
    updateUser
  };
};

// Componente que usa el hook
const UserList = () => {
  const { users, isLoading, error, addUser, updateUser } = useUsers();
  const { addNotification } = useNotifications();
  
  const handleAddUser = async (userData) => {
    try {
      await addUser(userData);
      addNotification('User added successfully!', 'success');
    } catch (error) {
      addNotification('Failed to add user', 'error');
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <AddUserForm onSubmit={handleAddUser} />
      <div>
        {users.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            onUpdate={(updates) => updateUser(user.id, updates)}
          />
        ))}
      </div>
    </div>
  );
};
```

### Patrón de Normalización de Datos

*Analogía: Base de Datos Relacional*

```javascript
// Estado normalizado
const normalizedState = {
  users: {
    entities: {
      '1': { id: '1', name: 'John', postIds: ['101', '102'] },
      '2': { id: '2', name: 'Jane', postIds: ['103'] }
    },
    ids: ['1', '2']
  },
  posts: {
    entities: {
      '101': { id: '101', title: 'Post 1', authorId: '1' },
      '102': { id: '102', title: 'Post 2', authorId: '1' },
      '103': { id: '103', title: 'Post 3', authorId: '2' }
    },
    ids: ['101', '102', '103']
  }
};

// Selectores para acceso eficiente
const createSelectors = (state) => ({
  // Obtener todos los usuarios
  getAllUsers: () => state.users.ids.map(id => state.users.entities[id]),
  
  // Obtener usuario por ID
  getUserById: (id) => state.users.entities[id],
  
  // Obtener posts de un usuario
  getUserPosts: (userId) => {
    const user = state.users.entities[userId];
    return user ? user.postIds.map(postId => state.posts.entities[postId]) : [];
  },
  
  // Obtener post con autor
  getPostWithAuthor: (postId) => {
    const post = state.posts.entities[postId];
    return post ? {
      ...post,
      author: state.users.entities[post.authorId]
    } : null;
  }
});

// Hook para usar selectores
const useSelectors = () => {
  const state = useAppState();
  return useMemo(() => createSelectors(state), [state]);
};
```

---

## 5. MODULARIZACIÓN Y COMPONENTIZACIÓN {#modularizacion}

### Atomic Design

*Analogía: Construcción con LEGO*

```
┌─ ÁTOMOS ──────────────────┐
│ Button, Input, Label      │ ← Piezas básicas de LEGO
│ Icon, Text, Image         │
└───────────────────────────┘
           │
┌─ MOLÉCULAS ───────────────┐
│ SearchBox, FormField      │ ← Combinaciones simples
│ Navigation Item           │
└───────────────────────────┘
           │
┌─ ORGANISMOS ──────────────┐
│ Header, UserCard          │ ← Secciones funcionales
│ ProductList, Footer       │
└───────────────────────────┘
           │
┌─ TEMPLATES ───────────────┐
│ PageLayout, GridLayout    │ ← Estructura sin contenido
│ FormLayout, ListLayout    │
└───────────────────────────┘
           │
┌─ PÁGINAS ─────────────────┐
│ HomePage, ProfilePage     │ ← Instancias específicas
│ CheckoutPage              │
└───────────────────────────┘
```

**Implementación práctica:**

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.js
│   │   │   ├── Button.stories.js
│   │   │   └── Button.module.css
│   │   ├── Input/
│   │   └── Icon/
│   ├── molecules/
│   │   ├── SearchBox/
│   │   ├── FormField/
│   │   └── UserAvatar/
│   ├── organisms/
│   │   ├── Header/
│   │   ├── ProductGrid/
│   │   └── UserProfile/
│   ├── templates/
│   │   ├── PageLayout/
│   │   └── DashboardLayout/
│   └── pages/
│       ├── HomePage/
│       └── ProfilePage/
```

**Átomo - Button:**

```javascript
// atoms/Button/Button.jsx
import { forwardRef } from 'react';
import styles from './Button.module.css';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    disabled && styles.disabled
  ].filter(Boolean).join(' ');
  
  return (
    <button
      ref={ref}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
```

**Molécula - SearchBox:**

```javascript
// molecules/SearchBox/SearchBox.jsx
import { useState, useCallback, useMemo } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBox = ({
  placeholder = 'Search...',
  onSearch,
  onClear,
  suggestions = [],
  loading = false,
  autoFocus = false
}) => {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedValue = useDebounce(value, 300);
  
  const handleSearch = useCallback(() => {
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  }, [value, onSearch]);
  
  const handleClear = useCallback(() => {
    setValue('');
    setShowSuggestions(false);
    onClear?.();
  }, [onClear]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleSearch, handleClear]);
  
  const filteredSuggestions = useMemo(() => {
    if (!debouncedValue) return [];
    return suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(debouncedValue.toLowerCase())
    ).slice(0, 5);
  }, [suggestions, debouncedValue]);
  
  return (
    <div className={styles.searchBox}>
      <div className={styles.inputContainer}>
        <Input
          value={value}
          onChange={setValue}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      
        {loading && <Icon name="spinner" className={styles.spinner} />}
      
        {value && (
          <Button
            variant="ghost"
            size="small"
            onClick={handleClear}
            className={styles.clearButton}
          >
            <Icon name="x" />
          </Button>
        )}
      
        <Button
          onClick={handleSearch}
          disabled={!value.trim() || loading}
          className={styles.searchButton}
        >
          <Icon name="search" />
        </Button>
      </div>
    
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className={styles.suggestions}>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className={styles.suggestion}
              onClick={() => {
                setValue(suggestion);
                onSearch(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
```

**Organismo - Header:**

```javascript
// organisms/Header/Header.jsx
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { SearchBox } from '../molecules/SearchBox';
import { UserMenu } from '../molecules/UserMenu';
import { NotificationBadge } from '../molecules/NotificationBadge';

const Header = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
          <nav className={styles.navigation}>
            <Button variant="ghost" href="/dashboard">Dashboard</Button>
            <Button variant="ghost" href="/projects">Projects</Button>
            <Button variant="ghost" href="/team">Team</Button>
          </nav>
        </div>
      
        <div className={styles.center}>
          <SearchBox
            onSearch={onSearch}
            placeholder="Search projects, files, people..."
            suggestions={['React', 'TypeScript', 'Node.js']}
          />
        </div>
      
        <div className={styles.right}>
          {isAuthenticated ? (
            <>
              <NotificationBadge 
                count={unreadCount}
                notifications={notifications}
              />
              <UserMenu 
                user={user}
                onLogout={logout}
              />
            </>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="ghost" href="/login">Login</Button>
              <Button variant="primary" href="/signup">Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### Patrón de Compound Components

*Analogía: Sistema de Audio Modular*

```javascript
// Compound Component - Tab System
const TabsContext = createContext();

const Tabs = ({ children, defaultValue, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    onChange?.(value);
  };
  
  const contextValue = {
    activeTab,
    onTabChange: handleTabChange
  };
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div className={styles.tabs}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children }) => {
  return (
    <div className={styles.tabsList} role="tablist">
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, disabled = false }) => {
  const { activeTab, onTabChange } = useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`${styles.tabsTrigger} ${isActive ? styles.active : ''}`}
      onClick={() => onTabChange(value)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return (
    <div className={styles.tabsContent} role="tabpanel">
      {children}
    </div>
  );
};

// Asignar sub-componentes
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

// Uso del compound component
const ProfilePage = () => {
  return (
    <Tabs defaultValue="personal" onChange={(tab) => console.log(tab)}>
      <Tabs.List>
        <Tabs.Trigger value="personal">Personal Info</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
      </Tabs.List>
    
      <Tabs.Content value="personal">
        <PersonalInfoForm />
      </Tabs.Content>
    
      <Tabs.Content value="security">
        <SecuritySettingsForm />
      </Tabs.Content>
    
      <Tabs.Content value="preferences">
        <PreferencesForm />
      </Tabs.Content>
    </Tabs>
  );
};
```

### Render Props y Higher-Order Components

**Render Props Pattern:**

```javascript
// Hook personalizado para lógica reutilizable
const useDataFetcher = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};

// Componente con Render Props
const DataFetcher = ({ url, children }) => {
  const fetcherState = useDataFetcher(url);
  return children(fetcherState);
};

// Uso con render props
const UserList = () => {
  return (
    <DataFetcher url="/api/users">
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />;
        if (error) return <ErrorMessage error={error} />;
      
        return (
          <div>
            {data.map(user => <UserCard key={user.id} user={user} />)}
          </div>
        );
      }}
    </DataFetcher>
  );
};
```

**Higher-Order Component:**

```javascript
// HOC para autenticación
const withAuth = (WrappedComponent, { redirectTo = '/login', roles = [] } = {}) => {
  const AuthenticatedComponent = (props) => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [loading, isAuthenticated, router]);
  
    // Verificar roles si se especifican
    const hasRequiredRole = roles.length === 0 || 
      roles.some(role => user?.roles?.includes(role));
  
    if (loading) {
      return <LoadingSpinner />;
    }
  
    if (!isAuthenticated) {
      return null; // Se redirigirá
    }
  
    if (!hasRequiredRole) {
      return <UnauthorizedMessage />;
    }
  
    return <WrappedComponent {...props} user={user} />;
  };
  
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
};

// Uso del HOC
const AdminDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {/* Dashboard content */}
    </div>
  );
};

export default withAuth(AdminDashboard, { 
  redirectTo: '/login', 
  roles: ['admin', 'moderator'] 
});
```

---

## 6. PERFORMANCE Y OPTIMIZACIÓN {#performance}

### Lazy Loading y Code Splitting

*Analogía: Netflix Loading Strategy*

```javascript
// 1. Component-level lazy loading
const LazyDashboard = lazy(() => import('./pages/Dashboard'));
const LazyProfile = lazy(() => import('./pages/Profile'));
const LazySettings = lazy(() => import('./pages/Settings'));

// 2. Route-based code splitting
const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/profile" element={<LazyProfile />} />
          <Route path="/settings" element={<LazySettings />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// 3. Dynamic imports con condiciones
const DynamicChartLoader = ({ chartType, data }) => {
  const [ChartComponent, setChartComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadChart = async () => {
      try {
        let component;
        switch (chartType) {
          case 'line':
            component = await import('./charts/LineChart');
            break;
          case 'bar':
            component = await import('./charts/BarChart');
            break;
          case 'pie':
            component = await import('./charts/PieChart');
            break;
          default:
            component = await import('./charts/DefaultChart');
        }
        setChartComponent(() => component.default);
      } catch (error) {
        console.error('Failed to load chart:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadChart();
  }, [chartType]);
  
  if (loading) return <ChartSkeleton />;
  if (!ChartComponent) return <ErrorFallback />;
  
  return <ChartComponent data={data} />;
};

// 4. Module federation (Micro-frontends)
const RemoteComponent = lazy(() => 
  import('remote-app/Component').catch(() => ({ 
    default: () => <div>Remote component unavailable</div> 
  }))
);
```

### Optimización de Re-renders

*Analogía: Smart TV Updates*

```javascript
// 1. React.memo con comparación personalizada
const UserCard = memo(({ user, onEdit, onDelete }) => {
  console.log('UserCard rendered for:', user.name);
  
  return (
    <div className={styles.userCard}>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div>
        <Button onClick={() => onEdit(user)}>Edit</Button>
        <Button onClick={() => onDelete(user)} variant="danger">Delete</Button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.user.avatar === nextProps.user.avatar
  );
});

// 2. useMemo para cálculos costosos
const ExpensiveUserList = ({ users, searchTerm, sortBy }) => {
  const processedUsers = useMemo(() => {
    console.log('Processing users...');
  
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate);
        default:
          return 0;
      }
    });
  }, [users, searchTerm, sortBy]);
  
  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      premium: users.filter(u => u.isPremium).length
    };
  }, [users]);
  
  return (
    <div>
      <UserStats stats={userStats} />
      <div>
        {processedUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

// 3. useCallback para funciones estables
const UserListManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  
  // ❌ Función recreada en cada render
  const handleEdit = (user) => {
    setEditingUser(user);
  };
  
  // ✅ Función memoizada
  const handleEditMemo = useCallback((user) => {
    setEditingUser(user);
  }, []); // No dependencies
  
  const handleDelete = useCallback((user) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
  }, []); // No dependencies porque usa functional update
  
  const handleSave = useCallback((updatedUser) => {
    setUsers(prev => prev.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    ));
    setEditingUser(null);
  }, []); // No dependencies
  
  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={handleEditMemo}
          onDelete={handleDelete}
        />
      ))}
    
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSave}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

// 4. Optimización con refs para evitar re-renders
const OptimizedFormField = ({ name, validation, onFieldChange }) => {
  const inputRef = useRef();
  const [localValue, setLocalValue] = useState('');
  const [error, setError] = useState('');
  
  // Debounce para validación
  const debouncedValidation = useCallback(
    debounce(async (value) => {
      if (validation) {
        const errorMessage = await validation(value);
        setError(errorMessage || '');
      }
    }, 300),
    [validation]
  );
  
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setLocalValue(value);
    debouncedValidation(value);
  
    // Notify parent sin causar re-render del parent
    onFieldChange(name, value);
  }, [name, onFieldChange, debouncedValidation]);
  
  return (
    <div>
      <input
        ref={inputRef}
        value={localValue}
        onChange={handleChange}
        className={error ? styles.error : ''}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
```

### Virtual Scrolling

*Analogía: Telescope View*

```javascript
// Hook para virtual scrolling
const useVirtualScrolling = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
  
    const visibleStartIndex = Math.max(0, startIndex - overscan);
  
    return {
      startIndex: visibleStartIndex,
      endIndex,
      items: items.slice(visibleStartIndex, endIndex),
      offsetY: visibleStartIndex * itemHeight
    };
  }, [scrollTop, itemHeight, containerHeight, items, overscan]);
  
  const totalHeight = items.length * itemHeight;
  
  return {
    ...visibleItems,
    totalHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop)
  };
};

// Componente de lista virtual
const VirtualizedList = ({ 
  items, 
  itemHeight = 50, 
  height = 400,
  renderItem 
}) => {
  const containerRef = useRef();
  
  const {
    startIndex,
    endIndex,
    items: visibleItems,
    offsetY,
    totalHeight,
    onScroll
  } = useVirtualScrolling({
    items,
    itemHeight,
    containerHeight: height
  });
  
  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Uso de la lista virtual
const LargeDataList = () => {
  const [data] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`
    }))
  );
  
  const renderItem = useCallback((item, index) => (
    <div className={styles.listItem}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <small>Index: {index}</small>
    </div>
  ), []);
  
  return (
    <VirtualizedList
      items={data}
      itemHeight={80}
      height={600}
      renderItem={renderItem}
    />
  );
};
```

### Optimización de Imágenes y Assets

```javascript
// 1. Lazy loading de imágenes con intersection observer
const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '/placeholder.svg',
  className,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
  
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
  
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isInView, src]);
  
  return (
    <div ref={imgRef} className={className}>
      <img
        src={imageSrc}
        alt={alt}
        className={`${isLoaded ? styles.loaded : styles.loading}`}
        {...props}
      />
    </div>
  );
};

// 2. Progressive loading de imágenes
const ProgressiveImage = ({ src, placeholder, alt, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    img.src = src;
  }, [src]);
  
  return (
    <div className={styles.progressiveImageContainer}>
      <img
        src={currentSrc}
        alt={alt}
        className={`${styles.progressiveImage} ${loading ? styles.loading : styles.loaded}`}
        {...props}
      />
      {loading && <div className={styles.loadingOverlay} />}
    </div>
  );
};

// 3. Image optimization hook
const useOptimizedImage = (src, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fallback = 'jpg'
  } = options;
  
  return useMemo(() => {
    if (!src) return src;
  
    // Para servicios como Cloudinary, ImageKit, etc.
    const params = new URLSearchParams();
    if (width) params.append('w', width);
    if (height) params.append('h', height);
    if (quality) params.append('q', quality);
    if (format) params.append('f', format);
  
    const optimizedSrc = `${src}?${params.toString()}`;
  
    // Generar srcSet para diferentes densidades
    const srcSet = [1, 2, 3].map(density => {
      const densityParams = new URLSearchParams(params);
      if (width) densityParams.set('w', width * density);
      if (height) densityParams.set('h', height * density);
      return `${src}?${densityParams.toString()} ${density}x`;
    }).join(', ');
  
    return {
      src: optimizedSrc,
      srcSet,
      fallbackSrc: src.replace(/\.(webp|avif)$/, `.${fallback}`)
    };
  }, [src, width, height, quality, format, fallback]);
};

// 4. Asset preloading
const useAssetPreloader = (assets) => {
  const [loadedAssets, setLoadedAssets] = useState(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (!assets.length) return;
  
    let loadedCount = 0;
  
    const preloadAsset = (asset) => {
      return new Promise((resolve, reject) => {
        if (asset.type === 'image') {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            setLoadedAssets(prev => new Set([...prev, asset.src]));
            setLoadingProgress((loadedCount / assets.length) * 100);
            resolve(asset);
          };
          img.onerror = reject;
          img.src = asset.src;
        } else if (asset.type === 'script') {
          import(asset.src)
            .then(() => {
              loadedCount++;
              setLoadedAssets(prev => new Set([...prev, asset.src]));
              setLoadingProgress((loadedCount / assets.length) * 100);
              resolve(asset);
            })
            .catch(reject);
        }
      });
    };
  
    Promise.allSettled(assets.map(preloadAsset));
  }, [assets]);
  
  return {
    loadedAssets,
    loadingProgress,
    isComplete: loadedAssets.size === assets.length
  };
};
```

---

## 7. TESTING Y CALIDAD {#testing}

### Pirámide de Testing

*Analogía: Control de Calidad en Fábrica*

```
┌─ E2E Tests (5%) ──────────┐
│ User journeys completos   │ ← Inspector final de calidad
│ Cross-browser testing     │
└───────────────────────────┘
         │
┌─ Integration Tests (15%) ─┐
│ Componentes + API        │ ← Control de línea de producción
│ Flujos de usuario        │
└──────────────────────────┘
         │
┌─ Unit Tests (80%) ────────┐
│ Funciones individuales   │ ← Control de cada pieza
│ Componentes aislados     │
└──────────────────────────┘
```

### Unit Testing con Jest y React Testing Library

```javascript
// utils/formatters.test.js
import { formatCurrency, formatDate, validateEmail } from './formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
      expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
    });
  
    it('should handle different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
    });
  
    it('should handle invalid inputs gracefully', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency('invalid')).toBe('$0.00');
    });
  });
  
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email+tag@domain.co.uk',
        'user123@test-domain.com'
      ];
    
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });
  
    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        'user@',
        '@domain.com',
        'user..double.dot@domain.com'
      ];
    
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
});

// components/Button/Button.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
  
    render(<Button onClick={handleClick}>Click me</Button>);
  
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('should show loading spinner when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
  
  it('should apply correct CSS classes based on variant', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-primary');
  
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-secondary');
  });
  
  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// hooks/useApi.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from './useApi';

// Mock fetch
global.fetch = jest.fn();

describe('useApi Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'John' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
  
    const { result } = renderHook(() => useApi('/api/users/1'));
  
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
  
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });
  
  it('should handle fetch errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
  
    const { result } = renderHook(() => useApi('/api/users/1'));
  
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  
    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(new Error('Network error'));
  });
  
  it('should refetch data when URL changes', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'mocked' })
    });
  
    const { result, rerender } = renderHook(
      ({ url }) => useApi(url),
      { initialProps: { url: '/api/users/1' } }
    );
  
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  
    rerender({ url: '/api/users/2' });
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/users/2');
    });
  });
});
```

### Integration Testing

```javascript
// components/UserForm/UserForm.integration.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import UserForm from './UserForm';
import { server } from '../../mocks/server';

// Mock service worker para APIs
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('UserForm Integration', () => {
  it('should create user successfully', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
  
    renderWithProviders(<UserForm onSuccess={onSuccess} />);
  
    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123');
  
    // Submit form
    await user.click(screen.getByRole('button', { name: /create user/i }));
  
    // Wait for API call and success callback
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        id: expect.any(Number),
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
  
    // Check success message
    expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
  });
  
  it('should show validation errors', async () => {
    const user = userEvent.setup();
  
    renderWithProviders(<UserForm />);
  
    // Submit empty form
    await user.click(screen.getByRole('button', { name: /create user/i }));
  
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
  
  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
  
    // Override mock to return error
    server.use(
      rest.post('/api/users', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ message: 'Email already exists' })
        );
      })
    );
  
    renderWithProviders(<UserForm />);
  
    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123');
    await user.click(screen.getByRole('button', { name: /create user/i }));
  
    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing con Playwright/Cypress

```javascript
// e2e/user-journey.spec.js (Playwright)
import { test, expect } from '@playwright/test';

test.describe('User Management Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login as admin
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'admin@example.com');
    await page.fill('[data-testid=password]', 'adminpass123');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard');
  });
  
  test('should complete full user lifecycle', async ({ page }) => {
    // Navigate to users page
    await page.click('[data-testid=users-nav]');
    await page.waitForURL('/users');
  
    // Create new user
    await page.click('[data-testid=add-user-button]');
    await page.fill('[data-testid=user-name]', 'Test User');
    await page.fill('[data-testid=user-email]', 'test@example.com');
    await page.fill('[data-testid=user-password]', 'testpass123');
    await page.click('[data-testid=save-user-button]');
  
    // Verify user appears in list
    await expect(page.locator('[data-testid=user-list]')).toContainText('Test User');
    await expect(page.locator('[data-testid=user-list]')).toContainText('test@example.com');
  
    // Edit user
    await page.click('[data-testid=edit-user-test@example.com]');
    await page.fill('[data-testid=user-name]', 'Updated Test User');
    await page.click('[data-testid=save-user-button]');
  
    // Verify update
    await expect(page.locator('[data-testid=user-list]')).toContainText('Updated Test User');
  
    // Delete user
    await page.click('[data-testid=delete-user-test@example.com]');
    await page.click('[data-testid=confirm-delete]');
  
    // Verify deletion
    await expect(page.locator('[data-testid=user-list]')).not.toContainText('Updated Test User');
  });
  
  test('should handle form validation', async ({ page }) => {
    await page.goto('/users');
    await page.click('[data-testid=add-user-button]');
  
    // Try to submit empty form
    await page.click('[data-testid=save-user-button]');
  
    // Check validation messages
    await expect(page.locator('[data-testid=name-error]')).toContainText('Name is required');
    await expect(page.locator('[data-testid=email-error]')).toContainText('Email is required');
  
    // Fill invalid email
    await page.fill('[data-testid=user-email]', 'invalid-email');
    await page.click('[data-testid=save-user-button]');
  
    await expect(page.locator('[data-testid=email-error]')).toContainText('Invalid email format');
  });
  
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  
    await page.goto('/users');
  
    // Check mobile navigation
    await expect(page.locator('[data-testid=mobile-menu-button]')).toBeVisible();
    await page.click('[data-testid=mobile-menu-button]');
    await expect(page.locator('[data-testid=mobile-menu]')).toBeVisible();
  
    // Check responsive table/cards
    await expect(page.locator('[data-testid=user-card]')).toBeVisible();
    await expect(page.locator('[data-testid=user-table]')).not.toBeVisible();
  });
});

// Visual regression testing
test('should have consistent visual appearance', async ({ page }) => {
  await page.goto('/users');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot and compare
  await expect(page).toHaveScreenshot('users-page.png');
  
  // Test dark mode
  await page.click('[data-testid=theme-toggle]');
  await expect(page).toHaveScreenshot('users-page-dark.png');
});
```

### Testing de Performance

```javascript
// performance/lighthouse.test.js
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

describe('Performance Tests', () => {
  let chrome;
  
  beforeAll(async () => {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  });
  
  afterAll(async () => {
    await chrome.kill();
  });
  
  test('should meet performance thresholds', async () => {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port,
    };
  
    const runnerResult = await lighthouse('http://localhost:3000', options);
    const { lhr } = runnerResult;
  
    // Performance thresholds
    expect(lhr.categories.performance.score).toBeGreaterThan(0.9); // 90%
    expect(lhr.audits['first-contentful-paint'].numericValue).toBeLessThan(2000); // 2s
    expect(lhr.audits['largest-contentful-paint'].numericValue).toBeLessThan(4000); // 4s
    expect(lhr.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
  });
  
  test('should have good accessibility score', async () => {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['accessibility'],
      port: chrome.port,
    };
  
    const runnerResult = await lighthouse('http://localhost:3000', options);
    const { lhr } = runnerResult;
  
    expect(lhr.categories.accessibility.score).toBeGreaterThan(0.95); // 95%
  });
});

// Bundle size testing
// scripts/test-bundle-size.js
import { readFileSync } from 'fs';
import { gzipSync } from 'zlib';
import chalk from 'chalk';

const BUNDLE_SIZE_LIMITS = {
  'main.js': 250 * 1024, // 250KB
  'vendor.js': 500 * 1024, // 500KB
  'main.css': 50 * 1024, // 50KB
};

const testBundleSize = () => {
  const buildPath = './dist';
  const results = [];
  
  Object.entries(BUNDLE_SIZE_LIMITS).forEach(([filename, limit]) => {
    try {
      const filePath = `${buildPath}/${filename}`;
      const content = readFileSync(filePath);
      const gzippedSize = gzipSync(content).length;
    
      const passed = gzippedSize <= limit;
      results.push({
        filename,
        size: gzippedSize,
        limit,
        passed,
        percentage: (gzippedSize / limit) * 100
      });
    
      const status = passed ? chalk.green('✓') : chalk.red('✗');
      const sizeStr = chalk.yellow(`${(gzippedSize / 1024).toFixed(1)}KB`);
      const limitStr = `${(limit / 1024).toFixed(1)}KB`;
      const percentageStr = chalk.blue(`${results[results.length - 1].percentage.toFixed(1)}%`);
    
      console.log(`${status} ${filename}: ${sizeStr} / ${limitStr} (${percentageStr})`);
    } catch (error) {
      console.log(chalk.red(`✗ ${filename}: File not found`));
      results.push({ filename, passed: false, error: error.message });
    }
  });
  
  const allPassed = results.every(r => r.passed);
  if (!allPassed) {
    console.log(chalk.red('\nBundle size test failed!'));
    process.exit(1);
  } else {
    console.log(chalk.green('\nAll bundle size tests passed!'));
  }
};

testBundleSize();
```

---

## 8. ESCALABILIDAD Y MANTENIBILIDAD {#escalabilidad}

### Arquitectura Escalable

*Analogía: Diseño de Ciudad vs. Pueblo*

**Estructura de Proyecto Escalable:**

```
src/
├── app/                    # Configuración de la aplicación
│   ├── store/             # Estado global
│   ├── router/            # Configuración de rutas
│   └── providers/         # Providers de contexto
├── shared/                # Código compartido
│   ├── components/        # Componentes reutilizables
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilidades
│   ├── constants/         # Constantes
│   └── types/             # TypeScript types
├── features/              # Features organizadas por dominio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── users/
│   └── projects/
├── pages/                 # Páginas de la aplicación
└── assets/               # Assets estáticos
```

### Feature-Based Architecture

```javascript
// features/auth/index.ts - Public API del feature
export { AuthProvider, useAuth } from './contexts/AuthContext';
export { LoginForm, SignupForm } from './components';
export { authService } from './services/authService';
export type { User, AuthState } from './types';

// features/auth/components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateLoginForm } from '../utils/validation';
import { Button, Input, FormField } from '../../../shared/components';

export const LoginForm = ({ onSuccess, redirectTo = '/dashboard' }) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
  
    try {
      await login(formData);
      onSuccess?.(redirectTo);
    } catch (err) {
      // Error is handled by AuthContext
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <FormField
        label="Email"
        error={validationErrors.email || error?.field === 'email' ? error.message : ''}
      >
        <Input
          type="email"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="Enter your email"
        />
      </FormField>
    
      <FormField
        label="Password"
        error={validationErrors.password || error?.field === 'password' ? error.message : ''}
      >
        <Input
          type="password"
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          placeholder="Enter your password"
        />
      </FormField>
    
      <Button
        type="submit"
        loading={loading}
        disabled={!formData.email || !formData.password}
        fullWidth
      >
        Sign In
      </Button>
    </form>
  );
};

// features/auth/services/authService.ts
class AuthService {
  private baseURL = process.env.REACT_APP_API_URL;
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new AuthError(error.message, error.code);
    }
  
    return response.json();
  }
  
  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  
    if (!response.ok) {
      throw new AuthError('Token refresh failed');
    }
  
    return response.json();
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

export const authService = new AuthService();

// features/auth/contexts/AuthContext.tsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { authReducer, initialAuthState } from '../reducers/authReducer';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
  
    try {
      const response = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    
      // Store tokens
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error });
      throw error;
    }
  };
  
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };
  
  // Auto-login on app start
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch({ type: 'RESTORE_SESSION', payload: { token } });
    }
  }, []);
  
  const value = {
    ...state,
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Micro-frontends Architecture

*Analogía: Centro Comercial vs. Tienda Única*

```javascript
// Configuración de Module Federation (Webpack 5)
// webpack.config.js - Host App
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        userMicroApp: 'userMicroApp@http://localhost:3001/remoteEntry.js',
        productMicroApp: 'productMicroApp@http://localhost:3002/remoteEntry.js',
      },
    }),
  ],
};

// webpack.config.js - User Micro App
module.exports = {
  mode: 'development',
  plugins: [
    new ModuleFederationPlugin({
      name: 'userMicroApp',
      filename: 'remoteEntry.js',
      exposes: {
        './UserList': './src/components/UserList',
        './UserProfile': './src/components/UserProfile',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};

// Host App - Dynamic Loading
const UserList = lazy(() => import('userMicroApp/UserList'));
const ProductCatalog = lazy(() => import('productMicroApp/ProductCatalog'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/users" element={<UserList />} />
          <Route path="/products" element={<ProductCatalog />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Error Boundary para Micro-frontends
class MicroFrontendErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Microfrontend failed to load:', error, errorInfo);
    // Log to monitoring service
    this.props.onError?.(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <MicroFrontendFallback />;
    }
  
    return this.props.children;
  }
}

// Wrapper para cargar micro-frontends con fallback
const MicroFrontendWrapper = ({ 
  children, 
  fallback = <div>Service temporarily unavailable</div>,
  onError 
}) => {
  return (
    <MicroFrontendErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </MicroFrontendErrorBoundary>
  );
};
```

### Design System y Component Library

```javascript
// design-system/tokens/colors.js
export const colors = {
  // Primary palette
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  
  // Semantic colors
  success: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  
  warning: {
    light: '#f59e0b',
    DEFAULT: '#d97706',
    dark: '#b45309',
  },
  
  error: {
    light: '#ef4444',
    DEFAULT: '#dc2626',
    dark: '#b91c1c',
  },
  
  // Neutral palette
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    900: '#111827',
  },
};

// design-system/tokens/typography.js
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// design-system/components/ThemeProvider.jsx
import { createContext, useContext } from 'react';
import { colors, typography, spacing, shadows } from '../tokens';

const ThemeContext = createContext();

export const ThemeProvider = ({ theme = 'light', children }) => {
  const themeTokens = {
    colors: theme === 'dark' ? colors.dark : colors.light,
    typography,
    spacing,
    shadows,
    // Theme-specific overrides
    ...(theme === 'dark' && {
      background: colors.gray[900],
      text: colors.gray[100],
    }),
  };
  
  return (
    <ThemeContext.Provider value={themeTokens}>
      <div className={`theme-${theme}`} style={{ '--theme': theme }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// design-system/components/Button/Button.jsx
import { forwardRef } from 'react';
import { useTheme } from '../ThemeProvider';
import { getButtonStyles } from './Button.styles';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props
}, ref) => {
  const theme = useTheme();
  const styles = getButtonStyles({ variant, size, disabled, loading, theme });
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };
  
  return (
    <button
      ref={ref}
      className={styles.button}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {loading ? <Spinner size={size} /> : children}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
});

// design-system/components/Button/Button.styles.js
export const getButtonStyles = ({ variant, size, disabled, loading, theme }) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variantStyles = {
    primary: `
      bg-primary-600 text-white border border-transparent
      hover:bg-primary-700 focus:ring-primary-500
    `,
    secondary: `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50 focus:ring-primary-500
    `,
    ghost: `
      bg-transparent text-gray-700 border border-transparent
      hover:bg-gray-100 focus:ring-gray-500
    `,
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return {
    button: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`,
    leftIcon: 'mr-2 -ml-1',
    rightIcon: 'ml-2 -mr-1',
  };
};
```

### Monorepo Management

*Analogía: Gestión de Rascacielos vs. Casa Unifamiliar*

```javascript
// lerna.json - Configuración de Lerna
{
  "version": "independent",
  "npmClient": "yarn",
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish",
      "registry": "https://registry.npmjs.org/"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": [
    "packages/*"
  ]
}

// package.json - Root package
{
  "name": "frontend-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "lerna run build",
    "test": "lerna run test",
    "lint": "lerna run lint",
    "dev": "lerna run dev --parallel",
    "clean": "lerna clean",
    "bootstrap": "lerna bootstrap"
  },
  "devDependencies": {
    "lerna": "^6.0.0",
    "@commitlint/cli": "^17.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}

// packages/design-system/package.json
{
  "name": "@company/design-system",
  "version": "1.2.3",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "storybook": "start-storybook -p 6006"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  }
}

// packages/utils/package.json
{
  "name": "@company/utils",
  "version": "0.8.1",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest"
  }
}

// Shared Rollup config - rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};
```

---

## 9. HERRAMIENTAS Y ECOSISTEMA MODERNO {#herramientas}

### Build Tools y Bundlers

**Vite vs. Webpack Comparison:**

```javascript
// vite.config.js - Configuración moderna
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Alias para imports absolutos
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash'],
    exclude: ['some-large-dep'],
  },
  
  // Configuración de build
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'framer-motion'],
        },
      },
    },
  
    // Code splitting automático
    chunkSizeWarningLimit: 1000,
  },
  
  // Servidor de desarrollo
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // Variables de entorno tipadas
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});

// Comparación: webpack.config.js (tradicional)
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new MiniCssExtractPlugin(),
  ],
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

### Desarrollo con TypeScript

```typescript
// types/api.ts - Tipos compartidos
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// hooks/useApi.ts - Hook tipado
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async (): Promise<T> => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const result: ApiResponse<T> = await response.json();
    
      if (result.status === 'error') {
        throw new Error(result.message || 'API Error');
      }
    
      setData(result.data);
      options.onSuccess?.(result.data);
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);
  
  return { data, loading, error, execute, reset };
}

// components/UserList.tsx - Componente tipado
interface UserListProps {
  filters?: {
    role?: User['role'];
    isActive?: boolean;
    search?: string;
  };
  onUserSelect?: (user: User) => void;
  renderActions?: (user: User) => React.ReactNode;
}

export const UserList: React.FC<UserListProps> = ({
  filters = {},
  onUserSelect,
  renderActions,
}) => {
  const { data: users, loading, error } = useApi<User[]>(
    `/api/users?${new URLSearchParams(filters).toString()}`,
    { immediate: true }
  );
  
  const handleUserClick = useCallback((user: User) => {
    onUserSelect?.(user);
  }, [onUserSelect]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!users?.length) return <EmptyState message="No users found" />;
  
  return (
    <div className="user-list">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => handleUserClick(user)}
          actions={renderActions?.(user)}
        />
      ))}
    </div>
  );
};

// Utility types avanzados
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Ejemplo de uso de utility types
interface CreateUserRequest extends Optional<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
}

interface UpdateUserRequest extends DeepPartial<Omit<User, 'id' | 'createdAt'>> {
  id: string;
}
```

### Desarrollo con DevTools

```javascript
// utils/devtools.js - Herramientas de desarrollo
export const createDevtools = () => {
  if (process.env.NODE_ENV !== 'development') {
    return { log: () => {}, time: () => {}, timeEnd: () => {} };
  }
  
  return {
    // Enhanced logging
    log: (component, action, data) => {
      console.group(`🔧 ${component} - ${action}`);
      console.log('Data:', data);
      console.log('Timestamp:', new Date().toISOString());
      console.trace('Call stack');
      console.groupEnd();
    },
  
    // Performance timing
    time: (label) => {
      console.time(`⏱️ ${label}`);
    },
  
    timeEnd: (label) => {
      console.timeEnd(`⏱️ ${label}`);
    },
  
    // Component render tracking
    trackRender: (componentName, props, renderCount) => {
      console.log(`🎨 ${componentName} rendered (${renderCount})`, props);
    },
  
    // State change tracking
    trackStateChange: (stateName, oldValue, newValue) => {
      console.group(`📊 State: ${stateName}`);
      console.log('Previous:', oldValue);
      console.log('Current:', newValue);
      console.groupEnd();
    },
  };
};

// hooks/useDevtools.js
export const useDevtools = (componentName) => {
  const devtools = useRef(createDevtools()).current;
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    devtools.trackRender(componentName, {}, renderCount.current);
  });
  
  const logAction = useCallback((action, data) => {
    devtools.log(componentName, action, data);
  }, [componentName, devtools]);
  
  const timeAction = useCallback((actionName, fn) => {
    devtools.time(`${componentName} - ${actionName}`);
    const result = fn();
    devtools.timeEnd(`${componentName} - ${actionName}`);
    return result;
  }, [componentName, devtools]);
  
  return { logAction, timeAction };
};

// React DevTools Profiler integration
const ProfilerWrapper = ({ id, children, onRender }) => {
  const handleRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Profiler ${id}:`, {
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      });
    }
  
    onRender?.(id, phase, actualDuration, baseDuration, startTime, commitTime);
  };
  
  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
};

// Error tracking para desarrollo
const ErrorTracker = ({ children }) => {
  useEffect(() => {
    const handleError = (error) => {
      console.error('Global error caught:', error);
      // En producción, enviar a servicio de monitoreo
      if (process.env.NODE_ENV === 'production') {
        // sendToErrorService(error);
      }
    };
  
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
  
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  return children;
};
```

---

## 10. ARQUITECTURAS AVANZADAS {#arquitecturas-avanzadas}

### Server-Side Rendering (SSR) con Next.js

```javascript
// pages/users/[id].js - Dynamic SSR page
import { GetServerSideProps } from 'next';
import { UserProfile } from '../../components/UserProfile';
import { userService } from '../../services/userService';

interface UserPageProps {
  user: User;
  posts: Post[];
  initialError?: string;
}

export default function UserPage({ user, posts, initialError }: UserPageProps) {
  if (initialError) {
    return <ErrorPage message={initialError} />;
  }
  
  return (
    <Layout>
      <Head>
        <title>{user.name} - User Profile</title>
        <meta name="description" content={`Profile page for ${user.name}`} />
        <meta property="og:title" content={user.name} />
        <meta property="og:image" content={user.avatar} />
      </Head>
    
      <UserProfile user={user} posts={posts} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  try {
    // Parallel data fetching
    const [user, posts] = await Promise.all([
      userService.getUser(id as string),
      userService.getUserPosts(id as string),
    ]);
  
    // Redirect if user not found
    if (!user) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: {
        user,
        posts,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
  
    return {
      props: {
        initialError: 'Failed to load user data',
        user: null,
        posts: [],
      },
    };
  }
};

// Static Generation with ISR
// pages/blog/[slug].js
export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params!;
  
  try {
    const post = await blogService.getPost(slug as string);
  
    if (!post) {
      return { notFound: true };
    }
  
    return {
      props: { post },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-generate most popular posts
  const popularPosts = await blogService.getPopularPosts(50);
  
  const paths = popularPosts.map((post) => ({
    params: { slug: post.slug },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Generate other pages on-demand
  };
};
```

### Progressive Web Apps (PWA)

```javascript
// next.config.js - PWA configuration
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 86400, // 24 hours
          },
        },
      },
    ],
  },
});

// components/PWAInstallPrompt.jsx
export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
  
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
  
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
  
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
  
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };
  
  if (!showInstallPrompt) return null;
  
  return (
    <div className="pwa-install-prompt">
      <p>Install our app for a better experience!</p>
      <button onClick={handleInstallClick}>Install</button>
      <button onClick={() => setShowInstallPrompt(false)}>Later</button>
    </div>
  );
};

// hooks/useOfflineStatus.js
export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
  
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOffline;
};

// components/OfflineIndicator.jsx
export const OfflineIndicator = () => {
  const isOffline = useOfflineStatus();
  
  if (!isOffline) return null;
  
  return (
    <div className="offline-indicator">
      <Icon name="wifi-off" />
      <span>You're offline. Some features may be limited.</span>
    </div>
  );
};
```

### Edge Computing y CDN

```javascript
// pages/api/edge/location.js - Vercel Edge Function
export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  const { nextUrl: url, geo } = request;
  
  return new Response(
    JSON.stringify({
      city: geo.city,
      country: geo.country,
      region: geo.region,
      latitude: geo.latitude,
      longitude: geo.longitude,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=3600',
      },
    }
  );
}

// utils/edgeCache.js - Edge caching strategy
export const createEdgeCacheStrategy = (ttl = 3600) => {
  return {
    // Cache-First strategy
    cacheFirst: (key, fetchFn) => {
      return async () => {
        const cached = await caches.default.match(key);
        if (cached) return cached;
      
        const response = await fetchFn();
        const cacheResponse = response.clone();
      
        cacheResponse.headers.set('Cache-Control', `public, max-age=${ttl}`);
        await caches.default.put(key, cacheResponse);
      
        return response;
      };
    },
  
    // Network-First strategy
    networkFirst: (key, fetchFn) => {
      return async () => {
        try {
          const response = await fetchFn();
          const cacheResponse = response.clone();
        
          cacheResponse.headers.set('Cache-Control', `public, max-age=${ttl}`);
          await caches.default.put(key, cacheResponse);
        
          return response;
        } catch (error) {
          const cached = await caches.default.match(key);
          if (cached) return cached;
          throw error;
        }
      };
    },
  };
};
```

---

## 11. PLAN DE DESARROLLO DEL EXPERTO {#desarrollo}

### Nivel 1: Fundamentos Sólidos (Meses 1-3)

**Objetivos:**

* Dominar React + TypeScript
* Implementar arquitecturas básicas
* Establecer buenas prácticas de testing

**Proyecto Práctico: Todo App Avanzada**

```javascript
// Características requeridas:
- Autenticación JWT
- CRUD completo con API
- Estado global con Context
- Testing completo (Unit + Integration)
- PWA básica
- Responsive design
- Dark/Light theme
```

**Stack Tecnológico:**

* React 18 + TypeScript
* React Router v6
* React Query / SWR
* Styled Components / Tailwind
* Jest + React Testing Library
* MSW (Mock Service Worker)

**Evaluación:**

* [ ]  Separación correcta de responsabilidades
* [ ]  Componentes reutilizables
* [ ]  Testing coverage > 80%
* [ ]  Performance Lighthouse > 90
* [ ]  Accesibilidad WCAG AA
* [ ]  Code review de senior developer

### Nivel 2: Arquitectura Intermedia (Meses 4-8)

**Objetivos:**

* Implementar patrones avanzados
* Manejar aplicaciones de mediana escala
* Optimización de performance

**Proyecto Práctico: E-commerce Platform**

```javascript
// Características requeridas:
- Micro-frontends básicos
- SSR con Next.js
- Design System propio
- Advanced State Management
- Real-time features (WebSockets)
- Payment integration
- Advanced caching strategies
```

**Nuevas Tecnologías:**

* Next.js 13+ (App Router)
* Zustand / Redux Toolkit
* Storybook
* Module Federation
* Socket.io
* React Hook Form + Zod
* Framer Motion

**Proyectos Específicos:**

1. **Dashboard Admin** (2 semanas)
   * Data visualization
   * Advanced tables
   * Real-time updates
2. **Customer Portal** (3 semanas)
   * Product catalog
   * Shopping cart
   * Checkout flow
3. **Mobile App** (2 semanas)
   * React Native
   * Shared business logic
   * Native features

**Evaluación:**

* [ ]  Arquitectura escalable demostrada
* [ ]  Performance bajo carga
* [ ]  Cross-browser compatibility
* [ ]  Mobile-first approach
* [ ]  SEO optimization

### Nivel 3: Arquitectura Avanzada (Meses 9-15)

**Objetivos:**

* Diseñar sistemas distribuidos
* Liderar equipos técnicos
* Implementar arquitecturas complejas

**Proyecto Práctico: Multi-tenant SaaS Platform**

```javascript
// Características requeridas:
- Multiple micro-frontends
- Multi-tenancy
- Advanced security
- Monitoring & Analytics
- CI/CD pipelines
- Load balancing
- Internationalization
```

**Arquitectura de Sistema:**

```
┌─ CDN (Cloudflare) ────────────────────┐
│                                       │
├─ Load Balancer ──────────────────────┤
│                                       │
├─ Shell App (Host) ───────────────────┤
│  ├─ Auth Micro-app                    │
│  ├─ Dashboard Micro-app               │
│  ├─ Analytics Micro-app               │
│  └─ Settings Micro-app                │
│                                       │
├─ Edge Functions ─────────────────────┤
│  ├─ User routing                      │
│  ├─ A/B testing                       │
│  └─ Feature flags                     │
│                                       │
└─ Monitoring ────────────────────────┘
   ├─ Error tracking (Sentry)
   ├─ Performance (DataDog)
   └─ Analytics (Segment)
```

**Tecnologías Avanzadas:**

* Module Federation avanzado
* Webpack 5 + Vite hybrid
* GraphQL Federation
* Web Workers
* Service Workers avanzados
* WebAssembly integration
* Micro-frontend orchestration

### Nivel 4: Experto y Líder Técnico (Meses 15+)

**Objetivos:**

* Innovar en arquitecturas
* Mentorear otros desarrolladores
* Contribuir al ecosistema open source

**Actividades Principales:**

1. **Arquitectura de Sistemas Complejos**
   * Netflix-scale applications
   * Edge computing implementations
   * AI/ML integration en frontend
2. **Liderazgo Técnico**
   * Design reviews
   * Technical RFC process
   * Team mentoring programs
3. **Contribución al Ecosistema**
   * Open source contributions
   * Conference speaking
   * Technical writing
4. **Investigación y Desarrollo**
   * Emerging technologies evaluation
   * POC development
   * Innovation labs

**Proyecto Final: Framework/Library Creation**

```javascript
// Crear una biblioteca open source que resuelva
// un problema real del ecosistema frontend
// Ejemplos:
- Advanced state management library
- Performance monitoring tools
- Developer experience utilities
- Testing framework enhancements
```

---

## 12. REFLEXIÓN FINAL {#reflexion}

Al completar esta masterclass, has adquirido mucho más que conocimientos técnicos sobre arquitectura frontend. Has desarrollado una mentalidad arquitectónica que trasciende las tecnologías específicas y te posiciona como un verdadero experto en el diseño de experiencias digitales escalables y sostenibles.

### La Evolución del Pensamiento Arquitectónico

El viaje que acabas de completar te ha llevado desde pensar en componentes individuales hasta diseñar ecosistemas completos de software. Esta evolución representa uno de los saltos cognitivos más significativos en el desarrollo profesional. Ya no eres solo alguien que escribe código; eres alguien que diseña soluciones.

Has aprendido a ver más allá del código inmediato y a considerar:

* **Las implicaciones temporales**: Cómo tus decisiones de hoy afectarán el mantenimiento de mañana
* **La escalabilidad humana**: Cómo tu arquitectura facilitará o dificultará el trabajo de equipos más grandes
* **La adaptabilidad**: Cómo preparar sistemas para cambios que aún no puedes prever
* **El impacto del usuario**: Cómo cada decisión técnica se traduce en experiencia humana

### La Responsabilidad del Arquitecto

Con esta expertise viene una responsabilidad considerable. Tus decisiones arquitectónicas afectan no solo la experiencia del usuario final, sino también la productividad de equipos enteros, la escalabilidad de productos, y en última instancia, el éxito de organizaciones completas.

Un arquitecto frontend experto debe ser:

* **Un traductor entre mundos**: Capaz de comunicar complejidades técnicas a stakeholders no técnicos
* **Un visionario pragmático**: Con visión de futuro pero con los pies en la realidad presente
* **Un optimizador sistémico**: Que entiende que la optimización local puede llevar a la sub-optimización global
* **Un facilitador humano**: Que reconoce que la mejor arquitectura es inútil si el equipo no puede trabajar efectivamente con ella

### La Paradoja de la Especialización

Una paradoja fascinante emerge cuando alcanzas este nivel de expertise: mientras más especializado te vuelves en frontend, más te das cuenta de la importancia de entender el sistema completo. La mejor arquitectura frontend es la que se integra armoniosamente con backend, infraestructura, diseño, y procesos de negocio.

Esta comprensión holística te convierte en un profesional más valioso, capaz de tomar decisiones que optimizan no solo el frontend, sino todo el ecosistema digital de una organización.

### El Futuro de la Arquitectura Frontend

El campo de la arquitectura frontend está en constante evolución. Tecnologías como WebAssembly, Edge Computing, AI/ML en el navegador, y nuevos paradigmas de interacción humano-computadora están redefiniendo constantemente lo que es posible.

Tu expertise no reside en conocer todas las tecnologías actuales, sino en haber desarrollado los principios y la metodología para evaluar, adoptar, y arquitecturar con tecnologías futuras que aún no existen.

### La Dimensión Humana de la Tecnología

Quizás la lección más importante de esta masterclass es que la arquitectura frontend, en su esencia, es sobre personas. Cada decisión técnica que tomas afecta:

* **Usuarios finales**: Cuya productividad, satisfacción, y capacidad para lograr sus objetivos depende de tus diseños
* **Desarrolladores**: Cuya creatividad y eficiencia se potencia o se limita por las estructuras que creas
* **Organizaciones**: Cuya capacidad de adaptación y crecimiento está determinada por la flexibilidad de sus sistemas

### El Legado del Experto

Tu verdadero legado como arquitecto frontend no será el código que escribas, sino los sistemas que diseñes, los equipos que empoderes, y las experiencias que hagas posibles. Cada aplicación web bien arquitecturada que crees será utilizada por miles o millones de personas, mejorando sus vidas de maneras que quizás nunca llegues a conocer completamente.

### La Mentalidad de Mejora Continua

El dominio de la arquitectura frontend no es un destino, sino un viaje continuo. Las tecnologías evolucionan, los patrones se refinan, y las mejores prácticas se actualizan constantemente. Tu expertise se mantiene relevante no por lo que sabes hoy, sino por tu capacidad de aprender, adaptar, y evolucionar mañana.

### La Invitación a la Innovación

Como experto, ahora tienes la responsabilidad y la oportunidad de contribuir al avance del campo. Cada problema que resuelves, cada patrón que desarrollas, cada optimización que descubres puede beneficiar a toda la comunidad de desarrolladores.

**El futuro de la web está en tus manos.** Los principios que has aprendido, las habilidades que has desarrollado, y la mentalidad arquitectónica que has adquirido te posicionan para ser parte de la próxima generación de innovaciones que definirán cómo las personas interactúan con la tecnología.

Ahora sal y construye el futuro digital. Cada línea de código que escribas, cada arquitectura que diseñes, cada equipo que lideres es una oportunidad para hacer que la web sea más rápida, más accesible, más bella, y más útil para todos.

**La masterclass termina, pero tu journey como arquitecto frontend experto apenas comienza.**
