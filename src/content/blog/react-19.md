---
title: 'Desarrolladores 2025'
code: 'react'
description: 'React 19 - Guía Completa para Desarrolladores 2025'
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


# React 19 - Guía Completa para Desarrolladores 2025

*Estilo Meta/Facebook - Mejores prácticas y patrones modernos*

## 🚀 Índice

1. [Nuevas Características de React 19](#nuevas-características-de-react-19)
2. [React Compiler - Adiós a la Optimización Manual](#react-compiler---adiós-a-la-optimización-manual)
3. [Actions API - Manejo Simplificado de Estados Async](#actions-api---manejo-simplificado-de-estados-async)
4. [Nuevos Hooks Esenciales](#nuevos-hooks-esenciales)
5. [Server Components y Rendering](#server-components-y-rendering)
6. [Patrones de Diseño Modernos](#patrones-de-diseño-modernos)
7. [TypeScript Best Practices](#typescript-best-practices)
8. [State Management 2025](#state-management-2025)
9. [Performance y Optimización](#performance-y-optimización)
10. [Testing Strategies](#testing-strategies)
11. [Accessibility First](#accessibility-first)
12. [Tooling y Ecosystem](#tooling-y-ecosystem)

---

## 🎯 Nuevas Características de React 19

### Resumen de Cambios Clave

React 19 se enfoca en **simplificar** el desarrollo y **eliminar complejidad**, no agregarla:

- ✅ **React Compiler**: Optimización automática
- ✅ **Actions API**: Async workflows simplificados
- ✅ **New Hooks**: `use()`, `useOptimistic()`, `useFormStatus()`
- ✅ **Server Components**: Renderizado híbrido
- ✅ **Document Metadata**: Sin react-helmet
- ✅ **Asset Loading**: Preload automático

---

## 🤖 React Compiler - Adiós a la Optimización Manual

### El Problema Anterior

```javascript
// React 18 - Optimización manual requerida
function ExpensiveComponent({ data, filter }) {
  const filteredData = useMemo(() => 
    data.filter(item => item.category === filter), 
    [data, filter]
  );
  
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <div>
      {filteredData.map(item => 
        <Item key={item.id} onClick={handleClick} />
      )}
    </div>
  );
}

export default memo(ExpensiveComponent);
```

### La Solución de React 19

```javascript
// React 19 - Compiler se encarga automáticamente
function ExpensiveComponent({ data, filter }) {
  // El compiler optimiza automáticamente
  const filteredData = data.filter(item => item.category === filter);
  
  const handleClick = (id) => {
    onItemClick(id);
  };
  
  return (
    <div>
      {filteredData.map(item => 
        <Item key={item.id} onClick={handleClick} />
      )}
    </div>
  );
}
// No memo(), useMemo(), useCallback() necesarios!
```

### 🎯 Meta Best Practice: Cuando usar Compiler

```javascript
// ✅ Permite que el compiler maneje la optimización
function ProductList({ products, searchTerm }) {
  // Lógica directa - compiler optimiza
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return <div>{filtered.map(renderProduct)}</div>;
}

// ❌ Solo usa optimización manual si necesitas control específico
function SpecialCase({ data }) {
  // Control manual solo cuando sea crítico
  const expensiveValue = useMemo(() => 
    heavyComputation(data), [data]
  );
  
  return <div>{expensiveValue}</div>;
}
```

---

## ⚡ Actions API - Manejo Simplificado de Estados Async

### El Poder de Actions

```typescript
// React 19 - Actions manejan todo automáticamente
interface UserFormData {
  name: string;
  email: string;
}

function UpdateUserForm({ userId }: { userId: string }) {
  // Action maneja pending, error, y success automáticamente
  const updateUser = async (formData: FormData) => {
    'use action'; // Marca como Action
  
    const userData: UserFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };
  
    await api.updateUser(userId, userData);
    // React maneja el estado automáticamente
  };

  return (
    <form action={updateUser}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">
        Update User
      </button>
    </form>
  );
}
```

### Patrón Meta: Actions con Error Handling

```typescript
function AdvancedForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submitAction = async (formData: FormData) => {
    'use action';
  
    try {
      setStatus('pending');
      setError(null);
    
      await api.submitForm(formData);
      setStatus('success');
    
      // Reset form automático en React 19
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <form action={submitAction}>
      <input name="data" required />
      <button type="submit" disabled={status === 'pending'}>
        {status === 'pending' ? 'Submitting...' : 'Submit'}
      </button>
    
      {error && <div className="error">{error}</div>}
      {status === 'success' && <div className="success">Success!</div>}
    </form>
  );
}
```

---

## 🎣 Nuevos Hooks Esenciales

### `use()` Hook - Data Fetching Revolucionario

```typescript
// Reemplaza useEffect para data fetching
function UserProfile({ userId }: { userId: string }) {
  // use() puede ser condicional (a diferencia de useEffect)
  const user = use(fetchUser(userId));
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Con Context condicional
function ConditionalTheme({ darkMode }: { darkMode: boolean }) {
  // use() puede estar después de early returns
  if (!darkMode) {
    return <div>Light mode</div>;
  }
  
  const theme = use(ThemeContext);
  return <div style={{ color: theme.color }}>Dark mode</div>;
}
```

### `useOptimistic()` - UI Optimista Sin Complejidad

```typescript
interface Message {
  id: string;
  text: string;
  sending?: boolean;
}

function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // useOptimistic maneja UI optimista automáticamente
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: Date.now().toString(), text: newMessage, sending: true }
    ]
  );

  const sendMessage = async (formData: FormData) => {
    'use action';
  
    const message = formData.get('message') as string;
  
    // Actualización optimista inmediata
    addOptimisticMessage(message);
  
    try {
      const savedMessage = await api.sendMessage(message);
      setMessages(prev => [...prev, savedMessage]);
    } catch (error) {
      // React automáticamente revierte el estado optimista
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <div className="messages">
        {optimisticMessages.map(msg => (
          <div 
            key={msg.id} 
            className={msg.sending ? 'sending' : 'sent'}
          >
            {msg.text}
          </div>
        ))}
      </div>
    
      <form action={sendMessage}>
        <input name="message" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### `useFormStatus()` - Estado de Formularios

```typescript
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function FormWithStatus() {
  const submitAction = async (formData: FormData) => {
    'use action';
    await api.submit(formData);
  };

  return (
    <form action={submitAction}>
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  );
}
```

---

## 🖥️ Server Components y Rendering

### Patrón Meta: Hybrid Rendering

```typescript
// UserProfile.server.tsx - Server Component
async function UserProfile({ userId }: { userId: string }) {
  // Fetch en el servidor - sin loading states
  const user = await db.user.findUnique({ 
    where: { id: userId },
    include: { posts: true }
  });
  
  return (
    <div>
      <h1>{user.name}</h1>
      {/* Client Component para interactividad */}
      <InteractiveUserCard user={user} />
    </div>
  );
}

// InteractiveUserCard.client.tsx - Client Component
'use client';

function InteractiveUserCard({ user }: { user: User }) {
  const [following, setFollowing] = useState(user.isFollowing);
  
  const toggleFollow = async () => {
    'use action';
    setFollowing(!following);
    await api.toggleFollow(user.id);
  };
  
  return (
    <div>
      <button onClick={toggleFollow}>
        {following ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

### Document Metadata - Sin react-helmet

```typescript
function BlogPost({ slug }: { slug: string }) {
  const post = use(fetchPost(slug));
  
  return (
    <>
      {/* Metadata nativo en React 19 */}
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <meta property="og:title" content={post.title} />
      <meta property="og:image" content={post.image} />
    
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}
```

---

## 🏗️ Patrones de Diseño Modernos

### Composition Over Inheritance

```typescript
// ✅ Patrón Compound Components (Meta style)
interface ModalContextType {
  isOpen: boolean;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

function Modal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const close = () => setIsOpen(false);
  
  return (
    <ModalContext.Provider value={{ isOpen, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function ModalTrigger({ children }: { children: ReactNode }) {
  const context = use(ModalContext);
  return <div onClick={() => setIsOpen(true)}>{children}</div>;
}

function ModalContent({ children }: { children: ReactNode }) {
  const { isOpen, close } = use(ModalContext);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Uso elegante y composable
function App() {
  return (
    <Modal>
      <ModalTrigger>
        <button>Open Modal</button>
      </ModalTrigger>
      <ModalContent>
        <h2>Modal Title</h2>
        <p>Modal content here</p>
      </ModalContent>
    </Modal>
  );
}
```

### Custom Hooks Pattern - Meta Style

```typescript
// Custom hook para data fetching con cache
function useQuery<T>(
  key: string, 
  fetcher: () => Promise<T>,
  options: { staleTime?: number; retry?: number } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
  
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
      
        const result = await fetcher();
      
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      cancelled = true;
    };
  }, [key]);
  
  return { data, loading, error };
}

// Uso
function UserList() {
  const { data: users, loading, error } = useQuery(
    'users',
    () => api.getUsers(),
    { staleTime: 5000 }
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

---

## 📘 TypeScript Best Practices

### Props Interface Patterns

```typescript
// ✅ Base props con variantes
interface BaseButtonProps {
  children: ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
}

interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  onClick: () => void;
}

interface LinkButtonProps extends BaseButtonProps {
  variant: 'link';
  href: string;
  external?: boolean;
}

type ButtonProps = PrimaryButtonProps | LinkButtonProps;

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    return (
      <a 
        href={props.href}
        target={props.external ? '_blank' : undefined}
        className="btn btn-link"
        aria-label={props['aria-label']}
      >
        {props.children}
      </a>
    );
  }
  
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className="btn btn-primary"
      aria-label={props['aria-label']}
    >
      {props.children}
    </button>
  );
}
```

### Generic Components

```typescript
// Component genérico tipo-seguro
interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
}

function DataList<T>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available'
}: DataListProps<T>) {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (data.length === 0) {
    return <div className="empty">{emptyMessage}</div>;
  }
  
  return (
    <div className="data-list">
      {data.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// Uso tipo-seguro
interface User {
  id: number;
  name: string;
  email: string;
}

function UsersList({ users }: { users: User[] }) {
  return (
    <DataList
      data={users}
      keyExtractor={user => user.id}
      renderItem={user => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
      emptyMessage="No users found"
    />
  );
}
```

---

## 🗃️ State Management 2025

### Cuándo NO necesitas una librería

```typescript
// ✅ React built-in hooks son suficientes para la mayoría de casos
function useShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = (product: Product) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
    
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
    
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
  
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    total,
    itemCount: items.length
  };
}

// Context solo para estado global crítico
const CartContext = createContext<ReturnType<typeof useShoppingCart> | null>(null);

function CartProvider({ children }: { children: ReactNode }) {
  const cart = useShoppingCart();
  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}
```

### Patrón Reducer para Lógica Compleja

```typescript
interface AppState {
  user: User | null;
  notifications: Notification[];
  theme: 'light' | 'dark';
  loading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    
    case 'LOGOUT':
      return { ...state, user: null };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
}

function useAppState() {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    notifications: [],
    theme: 'light',
    loading: false
  });
  
  return { state, dispatch };
}
```

---

## ⚡ Performance y Optimización

### Asset Loading Automático

```typescript
// React 19 - Asset preloading automático
function ProductGallery({ images }: { images: string[] }) {
  return (
    <div className="gallery">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Product ${index + 1}`}
          // React 19 preload automáticamente imágenes siguientes
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

// Preload manual para casos específicos
function CriticalImage({ src, alt }: { src: string; alt: string }) {
  useEffect(() => {
    // Preload crítico
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  
    return () => {
      document.head.removeChild(link);
    };
  }, [src]);
  
  return <img src={src} alt={alt} />;
}
```

### Code Splitting Estratégico

```typescript
// Lazy loading con Suspense
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/admin" 
            element={
              <RequireAuth>
                <AdminPanel />
              </RequireAuth>
            } 
          />
          <Route 
            path="/heavy" 
            element={<HeavyComponent />} 
          />
        </Routes>
      </Router>
    </Suspense>
  );
}

// Feature-based splitting
const FeatureModal = lazy(() => 
  import('./features/SpecialFeature').then(module => ({
    default: module.SpecialFeatureModal
  }))
);
```

### Virtual Scrolling para Listas Grandes

```typescript
function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem
}: {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(height / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      style={{ height, overflow: 'auto' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Strategies

### Testing con React Testing Library

```typescript
// Component bajo prueba
function LoginForm({ onSubmit }: { onSubmit: (data: LoginData) => void }) {
  const handleSubmit = async (formData: FormData) => {
    'use action';
  
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };
  
    onSubmit(data);
  };
  
  return (
    <form action={handleSubmit}>
      <input 
        name="email" 
        type="email" 
        placeholder="Email"
        required 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Password"
        required 
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('should submit form with correct data', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
  
    render(<LoginForm onSubmit={mockSubmit} />);
  
    // Fill form
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
  
    // Submit
    await user.click(screen.getByRole('button', { name: 'Login' }));
  
    // Assert
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
  
  it('should require email and password', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
  
    render(<LoginForm onSubmit={mockSubmit} />);
  
    await user.click(screen.getByRole('button', { name: 'Login' }));
  
    // Form should not submit without required fields
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useShoppingCart', () => {
  it('should add items to cart', () => {
    const { result } = renderHook(() => useShoppingCart());
  
    const product = { id: '1', name: 'Test Product', price: 10 };
  
    act(() => {
      result.current.addItem(product);
    });
  
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      ...product,
      quantity: 1
    });
    expect(result.current.total).toBe(10);
  });
  
  it('should increase quantity for existing items', () => {
    const { result } = renderHook(() => useShoppingCart());
  
    const product = { id: '1', name: 'Test Product', price: 10 };
  
    act(() => {
      result.current.addItem(product);
      result.current.addItem(product);
    });
  
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.total).toBe(20);
  });
});
```

---

## ♿ Accessibility First

### ARIA Patterns Modernos

```typescript
function AccessibleModal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  
  // Focus management
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    
      // Trap focus
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
    
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="close-button"
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
```

### Form Accessibility

```typescript
function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailId = useId();
  const passwordId = useId();
  
  const validate = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
  
    const email = formData.get('email') as string;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
  
    const password = formData.get('password') as string;
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
  
    return newErrors;
  };
  
  const handleSubmit = async (formData: FormData) => {
    'use action';
  
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      // Submit form
      await api.submitForm(formData);
    }
  };
  
  return (
    <form action={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={emailId}>Email *</label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
        />
        {errors.email && (
          <div id={`${emailId}-error`} className="error" role="alert">
            {errors.email}
          </div>
        )}
      </div>
    
      <div className="field">
        <label htmlFor={passwordId}>Password *</label>
        <input
          id={passwordId}
          name="password"
          type="password"
          required
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? `${passwordId}-error` : undefined}
        />
        {errors.password && (
          <div id={`${passwordId}-error`} className="error" role="alert">
            {errors.password}
          </div>
        )}
      </div>
    
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🛠️ Tooling y Ecosystem

### Vite + React 19 Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // React 19 compiler
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
```

### Next.js 15 + React 19

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true, // Enable React Compiler
    ppr: true, // Partial Prerendering
  },
  
  // Asset optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  
  // Performance
  swcMinify: true,
  
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': './src',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### ESLint + TypeScript + React 19

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "plugins": ["@typescript-eslint", "react-compiler"],
  "rules": {
    "react-compiler/react-compiler": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "error",
    "prefer-const": "error"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  }
}
```

---

## 🚀 Migration Guide React 18 → 19

### Step 1: Update Dependencies

```bash
npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19
npm install --save-dev @babel/plugin-react-compiler
```

### Step 2: Remove Manual Optimizations

```typescript
// ❌ React 18 - Manual optimization
const MemoizedComponent = memo(function Component({ data }) {
  const expensiveValue = useMemo(() => {
    return data.filter(item => item.active);
  }, [data]);
  
  const handleClick = useCallback((id) => {
    onClick(id);
  }, [onClick]);
  
  return <div>{/* component JSX */}</div>;
});

// ✅ React 19 - Let compiler optimize
function Component({ data }) {
  const expensiveValue = data.filter(item => item.active);
  
  const handleClick = (id) => {
    onClick(id);
  };
  
  return <div>{/* component JSX */}</div>;
}
```

### Step 3: Migrate to Actions

```typescript
// ❌ React 18 - Manual state management
function FormComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData(e.target);
      await api.submit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form JSX */}
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </form>
  );
}

// ✅ React 19 - Actions handle everything
function FormComponent() {
  const submitAction = async (formData) => {
    'use action';
    await api.submit(formData);
  };
  
  return (
    <form action={submitAction}>
      {/* form JSX */}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

---

## 🎯 Conclusión y Próximos Pasos

### Key Takeaways de React 19

1. **🤖 Compiler Automático**: Adiós a `useMemo`, `useCallback`, `memo`
2. **⚡ Actions API**: Async workflows simplificados
3. **🎣 New Hooks**: `use()`, `useOptimistic()`, `useFormStatus()`
4. **🖥️ Server Components**: Rendering híbrido estable
5. **📱 Built-in Features**: Metadata, asset loading, form handling

### Best Practices Summary

- ✅ **Simplicidad sobre complejidad** - Deja que React 19 optimice
- ✅ **TypeScript first** - Type safety desde el día 1
- ✅ **Composition over inheritance** - Componentes reutilizables
- ✅ **Accessibility first** - Accesible por defecto
- ✅ **Performance automática** - Confía en el compiler
- ✅ **Testing integral** - Unit + Integration + E2E

### Recursos para Seguir Aprendiendo

- 📚 [React 19 Official Docs](https://react.dev/blog/2024/12/05/react-19)
- 🔨 [React Compiler Playground](https://playground.react.dev/)
- 📖 [Next.js 15 Documentation](https://nextjs.org/docs)
- 🧪 [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)

---

<!-- 
*Esta guía refleja las mejores prácticas utilizadas en Meta/Facebook y empresas tech líderes. Mantente actualizado con las últimas features y patrones para construir aplicaciones React de clase mundial.* 🚀 -->
