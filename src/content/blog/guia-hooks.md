---
title: 'React Hooks'
description: 'Guía Maestra de React Hooks - Dominio Completo para el Desarrollo Diario'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Maestra de React Hooks - Dominio Completo para el Desarrollo Diario

## Introducción: La Revolución de los Hooks

Los Hooks revolucionaron React al permitirnos usar estado y características de ciclo de vida en componentes funcionales. Son como "poderes especiales" que puedes agregar a tus componentes según necesites. Esta guía te convertirá en un maestro de todos los hooks, sabiendo exactamente cuándo y cómo usar cada uno.

---

## HOOKS BÁSICOS

### 1. useState - El Guardián del Estado

**¿Qué hace?** Permite agregar estado local a componentes funcionales.

**Anatomía básica:**

```javascript
const [state, setState] = useState(initialValue);
```

#### Implementaciones Avanzadas

**1. Estado Complejo con Objetos**

```javascript
const [user, setUser] = useState({
  name: '',
  email: '',
  preferences: {
    theme: 'light',
    notifications: true
  }
});

// ❌ Incorrecto - Mutación directa
const updateTheme = () => {
  user.preferences.theme = 'dark';
  setUser(user);
};

// ✅ Correcto - Inmutabilidad
const updateTheme = () => {
  setUser(prev => ({
    ...prev,
    preferences: {
      ...prev.preferences,
      theme: 'dark'
    }
  }));
};
```

**2. Estado con Función de Inicialización Lazy**

```javascript
// ❌ Ineficiente - Se ejecuta en cada render
const [data, setData] = useState(expensiveCalculation());

// ✅ Eficiente - Solo se ejecuta una vez
const [data, setData] = useState(() => expensiveCalculation());
```

**3. Actualizaciones Basadas en Estado Anterior**

```javascript
const [count, setCount] = useState(0);

// ❌ Problemático con múltiples actualizaciones
const increment = () => setCount(count + 1);

// ✅ Seguro - Siempre usa el valor más reciente
const increment = () => setCount(prev => prev + 1);
```

#### Cuándo Usar useState

* ✅ **Estado local simple** del componente
* ✅ **Formularios** con pocos campos
* ✅ **Toggles** y estados booleanos
* ✅ **Listas pequeñas** que se modifican localmente

#### Cuándo NO Usar useState

* ❌ **Estado compartido** entre múltiples componentes
* ❌ **Estado complejo** con muchas propiedades relacionadas
* ❌ **Datos que vienen de APIs** (mejor usar useQuery o similar)
* ❌ **Estado global** de la aplicación

---

### 2. useEffect - El Orquestador de Efectos Secundarios

**¿Qué hace?** Maneja efectos secundarios como llamadas a APIs, suscripciones, y limpieza.

#### Patrones de useEffect

**1. Effect sin Dependencias (componentDidMount)**

```javascript
useEffect(() => {
  // Se ejecuta solo una vez después del primer render
  fetchUserData();
}, []); // Array vacío = solo una vez
```

**2. Effect con Dependencias**

```javascript
useEffect(() => {
  fetchUserPosts(userId);
}, [userId]); // Se ejecuta cuando userId cambia
```

**3. Effect con Cleanup**

```javascript
useEffect(() => {
  const subscription = subscribeToMessages();
  
  return () => {
    // Cleanup function
    subscription.unsubscribe();
  };
}, []);
```

**4. Effect Complejo con Múltiples Operaciones**

```javascript
useEffect(() => {
  let isCancelled = false;
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getUser(userId);
    
      if (!isCancelled) {
        setUser(response.data);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setUser(null);
      }
    } finally {
      if (!isCancelled) {
        setLoading(false);
      }
    }
  };
  
  fetchData();
  
  return () => {
    isCancelled = true; // Previene memory leaks
  };
}, [userId]);
```

#### Anti-patrones Comunes

**❌ Dependencias Faltantes**

```javascript
useEffect(() => {
  fetchData(userId, token); // userId y token deberían estar en dependencias
}, []); // ESLint te advertirá sobre esto
```

**❌ Dependencias Innecesarias**

```javascript
useEffect(() => {
  setLocalState('some value');
}, [someUnrelatedProp]); // someUnrelatedProp no se usa
```

#### Cuándo Usar useEffect

* ✅ **Data fetching** inicial
* ✅ **Suscripciones** (WebSockets, eventos)
* ✅ **Timers** e intervalos
* ✅ **Limpieza** de recursos
* ✅ **Side effects** que dependen de props/state

#### Cuándo NO Usar useEffect

* ❌ **Transformaciones de datos** (usar useMemo)
* ❌ **Event handlers** (usar callbacks directos)
* ❌ **Estado derivado** simple (calcularlo directamente)

---

### 3. useContext - El Comunicador Global

**¿Qué hace?** Consume valores de un Context sin anidar Consumer components.

#### Implementación Completa

**1. Creación del Context**

```javascript
// contexts/ThemeContext.js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    fontSize,
    toggleTheme,
    setFontSize,
    colors: theme === 'light' ? lightColors : darkColors
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

#### useFetch - Data Fetching Inteligente

```javascript
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache para evitar requests duplicados
  const cache = useRef(new Map());
  
  const fetchData = useCallback(async (fetchUrl, fetchOptions) => {
    const cacheKey = `${fetchUrl}${JSON.stringify(fetchOptions)}`;
  
    // Verificar cache
    if (cache.current.has(cacheKey)) {
      setData(cache.current.get(cacheKey));
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
    
      const response = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions?.headers
        },
        ...fetchOptions
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const result = await response.json();
    
      // Guardar en cache
      cache.current.set(cacheKey, result);
      setData(result);
    
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (url) {
      fetchData(url, options);
    }
  }, [url, JSON.stringify(options), fetchData]);
  
  const refetch = useCallback(() => {
    if (url) {
      // Limpiar cache para este request
      const cacheKey = `${url}${JSON.stringify(options)}`;
      cache.current.delete(cacheKey);
      fetchData(url, options);
    }
  }, [url, options, fetchData]);
  
  return { data, loading, error, refetch };
};

// Uso
const UserProfile = ({ userId }) => {
  const { data: user, loading, error, refetch } = useFetch(
    userId ? `/api/users/${userId}` : null
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

#### useToggle - Gestor de Estados Booleanos

```javascript
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse, setValue }];
};

// Uso
const Modal = () => {
  const [isOpen, { toggle, setFalse }] = useToggle(false);
  
  return (
    <div>
      <button onClick={toggle}>Toggle Modal</button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={setFalse}>Close</button>
            <p>Modal content here</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### useWindowSize - Responsive Design Hook

```javascript
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
  
    // Establecer tamaño inicial
    handleResize();
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};

// Hook derivado para breakpoints
const useBreakpoint = () => {
  const { width } = useWindowSize();
  
  return useMemo(() => {
    if (width === undefined) return 'unknown';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  }, [width]);
};

// Uso
const ResponsiveComponent = () => {
  const breakpoint = useBreakpoint();
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Screen: {width} x {height}</p>
      <p>Breakpoint: {breakpoint}</p>
      {breakpoint === 'sm' ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
};
```

#### useDebounce - Control de Input Frecuente

```javascript
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Hook más avanzado con cancel
const useDebouncedCallback = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);
  
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    return cancel;
  }, [cancel]);
  
  return [debouncedCallback, cancel];
};

// Uso
const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <SearchResults results={results} />
    </div>
  );
};
```

#### useForm - Gestión Completa de Formularios

```javascript
const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);
  
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  const validateField = useCallback((name, value) => {
    const fieldSchema = validationSchema[name];
    if (!fieldSchema) return null;
  
    for (const rule of fieldSchema) {
      const error = rule(value, values);
      if (error) return error;
    }
  
    return null;
  }, [validationSchema, values]);
  
  const validateForm = useCallback(() => {
    const newErrors = {};
  
    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationSchema, values, validateField]);
  
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Marcar todos los campos como touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
  
    const isValid = validateForm();
  
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  
    setIsSubmitting(false);
  }, [values, validateForm]);
  
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Validadores helper
const validators = {
  required: (message = 'This field is required') => (value) => {
    return !value || value.trim() === '' ? message : null;
  },
  
  email: (message = 'Invalid email address') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? message : null;
  },
  
  minLength: (min, message) => (value) => {
    return value && value.length < min 
      ? message || `Must be at least ${min} characters` 
      : null;
  },
  
  matchField: (fieldName, message) => (value, allValues) => {
    return value !== allValues[fieldName] 
      ? message || `Must match ${fieldName}` 
      : null;
  }
};

// Uso del useForm
const LoginForm = () => {
  const form = useForm(
    { email: '', password: '' },
    {
      email: [
        validators.required(),
        validators.email()
      ],
      password: [
        validators.required(),
        validators.minLength(6)
      ]
    }
  );
  
  const handleSubmit = async (values) => {
    await authAPI.login(values);
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={form.values.email}
          onChange={(e) => form.setValue('email', e.target.value)}
          onBlur={() => form.setFieldTouched('email')}
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>
    
      <div>
        <input
          type="password"
          placeholder="Password"
          value={form.values.password}
          onChange={(e) => form.setValue('password', e.target.value)}
          onBlur={() => form.setFieldTouched('password')}
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>
    
      <button 
        type="submit" 
        disabled={form.isSubmitting || !form.isValid}
      >
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## PATRONES AVANZADOS DE HOOKS

### Compound Hooks Pattern

```javascript
// Hook compuesto que maneja estado complejo relacionado
const useShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(null);
  const [shipping, setShipping] = useState(0);
  
  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
    
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
    
      return [...prev, { ...product, quantity }];
    });
  }, []);
  
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);
  
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
  
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);
  
  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(null);
  }, []);
  
  // Computed values
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);
  
  const discountAmount = useMemo(() => {
    if (!discount) return 0;
    return discount.type === 'percentage' 
      ? subtotal * (discount.value / 100)
      : discount.value;
  }, [subtotal, discount]);
  
  const total = useMemo(() => {
    return subtotal - discountAmount + shipping;
  }, [subtotal, discountAmount, shipping]);
  
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);
  
  return {
    // State
    items,
    discount,
    shipping,
  
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDiscount,
    setShipping,
  
    // Computed
    subtotal,
    discountAmount,
    total,
    itemCount,
    isEmpty: items.length === 0
  };
};
```

### Factory Hook Pattern

```javascript
// Factory que crea hooks especializados
const createApiHook = (endpoint, options = {}) => {
  return (params = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const query = useMemo(() => 
      new URLSearchParams(params).toString(), [params]
    );
  
    const url = useMemo(() => 
      `${endpoint}${query ? `?${query}` : ''}`, [endpoint, query]
    );
  
    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
      
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(response.statusText);
      
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [url]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    return { data, loading, error, refetch: fetchData };
  };
};

// Hooks especializados creados con la factory
const useUsers = createApiHook('/api/users');
const useProducts = createApiHook('/api/products');
const usePosts = createApiHook('/api/posts', {
  headers: { 'Authorization': 'Bearer token' }
});

// Uso
const UsersList = () => {
  const { data: users, loading, error } = useUsers({ page: 1, limit: 10 });
  
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

---

## MEJORES PRÁCTICAS Y PATTERNS

### 1. Reglas de los Hooks (Rules of Hooks)

```javascript
// ❌ MAL - Hooks en condicionales
const BadComponent = ({ condition }) => {
  if (condition) {
    const [state, setState] = useState(''); // ¡Error!
  }
  
  return <div>Bad component</div>;
};

// ✅ BIEN - Hooks siempre en el top level
const GoodComponent = ({ condition }) => {
  const [state, setState] = useState('');
  
  if (condition) {
    // Lógica condicional aquí
  }
  
  return <div>Good component</div>;
};
```

### 2. Separación de Responsabilidades

```javascript
// ❌ Hook que hace demasiadas cosas
const useBadUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Demasiada lógica en un solo hook...
  
  return { user, posts, friends, notifications };
};

// ✅ Hooks especializados
const useUser = (userId) => {
  const [user, setUser] = useState(null);
  // Lógica específica para usuario
  return { user, setUser };
};

const useUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  // Lógica específica para posts
  return { posts, setPosts };
};

// Composición en el componente
const UserProfile = ({ userId }) => {
  const { user } = useUser(userId);
  const { posts } = useUserPosts(userId);
  
  return <div>{/* UI */}</div>;
};
```

### 3. Error Boundaries con Hooks

```javascript
const useErrorHandler = () => {
  const [error, setError] = useState(null);
  
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  const handleError = useCallback((error) => {
    console.error('Caught error:', error);
    setError(error);
  }, []);
  
  // Reset error cuando el componente se unmount
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);
  
  return { error, handleError, resetError };
};

// Uso con try-catch async
const DataComponent = () => {
  const { error, handleError, resetError } = useErrorHandler();
  const [data, setData] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      const result = await api.getData();
      setData(result);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);
  
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={resetError}>Try Again</button>
      </div>
    );
  }
  
  return <div>{/* Render data */}</div>;
};
```

---

## TESTING DE HOOKS

### Testing Hooks Personalizados

```javascript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));
  
    act(() => {
      result.current.increment();
    });
  
    expect(result.current.count).toBe(1);
  });
  
  test('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));
  
    act(() => {
      result.current.decrement();
    });
  
    expect(result.current.count).toBe(4);
  });
  
  test('should reset counter', () => {
    const { result } = renderHook(() => useCounter(10));
  
    act(() => {
      result.current.increment();
      result.current.reset();
    });
  
    expect(result.current.count).toBe(10);
  });
});
```

---

## REFLEXIÓN FINAL: El Arte de Dominar los Hooks

### La Evolución del Desarrollador React

Después de años trabajando con React y observando cómo evolucionan los desarrolladores, he identificado **tres etapas críticas** en el dominio de los hooks:

#### 1. **El Novato Entusiasta (Months 1-6)**

* Usa hooks básicos sin entender completamente cuándo y por qué
* Tiende a sobre-optimizar con useMemo y useCallback en todo
* Crea efectos con dependencias incorrectas
* **Error común**: "Si useMemo hace que sea más rápido, lo usaré en todas partes"

#### 2. **El Pragmático Cauteloso (Months 6-18)**

* Entiende las reglas pero es extremadamente conservador
* Evita hooks avanzados por miedo a la complejidad
* Sabe cuándo NO usar optimizaciones
* **Mentalidad**: "Prefiero código simple que funcione a código optimizado que no entiendo"

#### 3. **El Maestro Estratégico (18+ months)**

* Usa hooks como herramientas específicas para problemas específicos
* Crea abstracciones elegantes sin over-engineering
* Balancea performance, legibilidad y mantenibilidad
* **Filosofía**: "El mejor código es el que resuelve el problema real con la menor complejidad necesaria"

### Los 5 Principios del Dominio de Hooks

#### 1. **Principio de Responsabilidad Única**

Cada hook debe tener una responsabilidad clara y bien definida. Si tu hook maneja autenticación, caching, validación de forms y notificaciones push, probablemente necesitas dividirlo.

```javascript
// ❌ Hook que hace demasiado
const useEverything = () => {
  // 200 líneas de código mezclando conceptos
};

// ✅ Hooks especializados
const useAuth = () => { /* Solo autenticación */ };
const useCache = () => { /* Solo caching */ };
const useNotifications = () => { /* Solo notificaciones */ };
```

#### 2. **Principio de Composición sobre Configuración**

En lugar de crear hooks masivamente configurables, crea hooks pequeños que se compongan bien juntos.

```javascript
// ❌ Monolito configurable
const useDataManager = ({ 
  endpoint, 
  caching, 
  retries, 
  optimisticUpdates, 
  realtime,
  // ... 20 más opciones
}) => {
  // Lógica compleja y difícil de mantener
};

// ✅ Composición de hooks especializados
const useFetch = (url) => { /* Simple data fetching */ };
const useCache = (key, data) => { /* Simple caching */ };
const useRetry = (operation) => { /* Simple retry logic */ };

// Composición en el componente
const MyComponent = () => {
  const { data, error } = useFetch('/api/data');
  const cachedData = useCache('myData', data);
  const retryFetch = useRetry(fetchData);
  
  return <div>...</div>;
};
```

#### 3. **Principio de Optimización Tardía**

No optimices hasta que tengas un problema real de performance medido y documentado.

```javascript
// ❌ Optimización prematura
const Component = ({ data }) => {
  const expensiveValue = useMemo(() => data.value * 2, [data.value]); // Innecesario
  const simpleCallback = useCallback(() => console.log('hi'), []); // Innecesario
  
  return <div>{expensiveValue}</div>;
};

// ✅ Optimización cuando es necesaria
const Component = ({ largeDataSet, complexFilters }) => {
  // ESTO sí justifica useMemo - operación costosa con datos grandes
  const filteredData = useMemo(() => {
    return largeDataSet
      .filter(item => matchesComplexFilter(item, complexFilters))
      .sort(complexSortingAlgorithm);
  }, [largeDataSet, complexFilters]);
  
  return <div>{filteredData.map(...)}</div>;
};
```

#### 4. **Principio de Predictibilidad**

Tu hook debe comportarse de manera predecible. Los mismos inputs deben producir los mismos outputs.

```javascript
// ❌ Comportamiento impredecible
const useBadTimer = () => {
  const [time, setTime] = useState(Date.now()); // ¡Diferente en cada render!
  
  useEffect(() => {
    const interval = Math.random() > 0.5 ? 1000 : 2000; // ¡Inconsistente!
    const id = setInterval(() => setTime(Date.now()), interval);
    return () => clearInterval(id);
  }, []); // Dependencias inconsistentes
  
  return time;
};

// ✅ Comportamiento predecible
const useTimer = (interval = 1000) => {
  const [time, setTime] = useState(() => Date.now()); // Consistente
  
  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]); // Dependencias claras
  
  return time;
};
```

#### 5. **Principio de Testing Amigable**

Diseña tus hooks pensando en cómo se van a testear.

```javascript
// ❌ Difícil de testear
const useBadApi = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Lógica hardcodeada, difícil de mockear
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return data;
};

// ✅ Fácil de testear
const useApi = (url, fetcher = fetch) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher(url);
        const result = await response.json();
      
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
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
  }, [url, fetcher]);
  
  return { data, loading, error };
};
```

### El Roadmap hacia la Maestría

#### Meses 1-3: Fundamentos Sólidos

* **Objetivo**: Domina useState, useEffect, useContext
* **Proyecto práctica**: Todo app con Context API
* **Meta semanal**: 1 hook nuevo + 1 refactor de código existente

#### Meses 4-6: Optimización Inteligente

* **Objetivo**: Aprende useMemo, useCallback, React.memo
* **Proyecto práctica**: Dashboard con listas grandes y filtering complejo
* **Meta semanal**: Identifica 1 bottleneck de performance real y optimízalo
* **Herramientas**: React DevTools Profiler, Chrome DevTools

#### Meses 7-12: Hooks Avanzados y Personalizados

* **Objetivo**: useReducer, useRef, hooks personalizados
* **Proyecto práctica**: E-commerce con shopping cart, forms complejos, y estado global
* **Meta semanal**: Crea 1 hook personalizado reutilizable
* **Focus**: Abstracción sin over-engineering

#### Meses 13-18: Arquitectura y Patterns

* **Objetivo**: Patrones avanzados, testing, arquitectura escalable
* **Proyecto práctica**: App multi-módulo con diferentes contexts y estados
* **Meta semanal**: Refactoriza código legacy usando mejores patrones
* **Skills clave**: Compound patterns, render props con hooks, testing strategies

#### Meses 18+: Maestría y Innovación

* **Objetivo**: Crear soluciones elegantes para problemas complejos
* **Proyecto práctica**: Contribuir a librerías open source de hooks
* **Meta continua**: Enseñar y mentorar a otros desarrolladores
* **Focus**: Balancear performance, mantenibilidad y developer experience

### Los Errores Más Costosos que Debes Evitar

#### 1. **El Síndrome del "Hook para Todo"**

```javascript
// ❌ Hook que pretende resolver todos los problemas
const useGodHook = () => {
  // 500+ líneas que manejan:
  // - Authentication
  // - Data fetching
  // - Form validation  
  // - Routing
  // - Theme management
  // - Notifications
  // - Shopping cart
  // - WebSocket connections
  
  return {
    // 50+ propiedades y métodos
  };
};
```

**Solución**: Un hook = una responsabilidad. Si tu hook exporta más de 10 propiedades, probablemente necesitas dividirlo.

#### 2. **Dependencias Fantasma en useEffect**

```javascript
// ❌ Bug sutil y peligroso
const UserProfile = ({ userId, onUserLoad }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(userData => {
      setUser(userData);
      onUserLoad(userData); // ¡onUserLoad no está en dependencias!
    });
  }, [userId]); // ESLint exhaustive-deps encontrará esto
  
  return <div>{user?.name}</div>;
};
```

**Solución**: Siempre incluye TODAS las dependencias. Usa ESLint plugin para React hooks.

#### 3. **La Trampa del useCallback Inútil**

```javascript
// ❌ useCallback sin valor real
const Component = ({ items }) => {
  const [filter, setFilter] = useState('');
  
  // Este useCallback no ayuda en nada
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []); // setFilter es estable, no necesita estar en deps
  
  return (
    <div>
      <input onChange={handleFilterChange} /> {/* No está memoizado */}
      {items.map(item => <Item key={item.id} item={item} />)}
    </div>
  );
};
```

**Solución**: useCallback solo vale la pena si el callback se pasa a componentes memoizados o está en dependencias de otros hooks.

#### 4. **Estado Derivado Innecesario**

```javascript
// ❌ Estado que debería ser calculado
const ShoppingCart = ({ items }) => {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [items]);
  
  return <div>Total: ${total}</div>;
};

// ✅ Cálculo directo - más simple y sin bugs
const ShoppingCart = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return <div>Total: ${total}</div>;
};
```

### Herramientas Esenciales para el Desarrollo con Hooks

#### 1. **React DevTools**

```javascript
// Hook con información de debugging
const useApiWithDebug = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Visible en React DevTools
  useDebugValue(data ? `Loaded: ${url}` : `Loading: ${url}`);
  
  useEffect(() => {
    // Lógica de fetch...
  }, [url]);
  
  return { data, loading };
};
```

#### 2. **ESLint Rules**

```json
// .eslintrc.js
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### 3. **Testing Utilities**

```javascript
// Custom render para providers
const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  );
  
  return render(ui, { wrapper: Wrapper, ...options });
};
```

### La Mentalidad del Hook Master

#### **Pregunta 1: ¿Realmente necesito este hook?**

Antes de crear cualquier hook personalizado, pregúntate:

* ¿Este código se va a reutilizar en al menos 3 lugares?
* ¿La abstracción hace el código más claro o más confuso?
* ¿Estoy resolviendo un problema real o inventando uno?

#### **Pregunta 2: ¿Cuál es el costo de esta optimización?**

Cada useMemo y useCallback tiene un costo:

* Memoria para almacenar dependencias
* Comparación en cada render
* Complejidad cognitiva para el próximo desarrollador

#### **Pregunta 3: ¿Cómo voy a testear esto?**

Si tu hook es difícil de testear, probablemente:

* Tiene demasiadas responsabilidades
* Depende de efectos secundarios ocultos
* No es suficientemente puro o predecible

### El Futuro de los Hooks

#### **Nuevas Tendencias**

* **Concurrent Features**: Hooks que funcionan con Suspense y Concurrent Mode
* **Server Components**: Hooks que funcionan en el servidor
* **React 18+ Features**: useId, useDeferredValue, useTransition

#### **Evolución Esperada**

Los hooks van hacia ser más:

* **Declarativos**: Describes qué quieres, no cómo conseguirlo
* **Componibles**: Hooks pequeños que se combinan en lugar de monolitos
* **Type-safe**: Mejor integración con TypeScript
* **Performance-aware**: Optimizaciones automáticas inteligentes

### Tu Plan de Acción Inmediato

#### **Esta Semana:**

1. **Audita tu código actual**: Identifica 3 componentes que podrían beneficiarse de hooks personalizados
2. **Refactoriza un useEffect**: Encuentra uno con dependencias incorrectas y arréglalo
3. **Elimina una optimización prematura**: Quita un useMemo o useCallback innecesario

#### **Este Mes:**

1. **Crea tu primer hook personalizado** para un caso de uso real en tu proyecto
2. **Implementa testing** para al menos 2 de tus hooks
3. **Aprende un hook avanzado** que no hayas usado antes

#### **Este Trimestre:**

1. **Refactoriza un componente complejo** usando la composición de hooks pequeños
2. **Contribuye a un proyecto open source** con hooks
3. **Mentoriza a alguien** enseñándole hooks desde lo básico

### Palabras Finales: De Principiante a Maestro

Los hooks no son solo una API de React; son una **filosofía de programación**. Representan la idea de que la complejidad debe ser manejable, el estado debe ser predecible, y los efectos secundarios deben ser controlados.

El dominio real de los hooks no viene de memorizar todos los APIs, sino de desarrollar **intuición** para:

* Cuándo abstraer y cuándo mantener simple
* Cómo balancear performance con legibilidad
* Cuándo optimizar y cuándo NO optimizar
* Cómo diseñar APIs que otros desarrolladores van a amar usar

Los mejores desarrolladores React que conozco no son los que usan más hooks, sino los que usan los hooks **correctos** en el **momento correcto** para resolver **problemas reales**.

Tu viaje hacia la maestría no termina cuando aprendes todos los hooks. Termina cuando puedes enseñar a otros desarrolladores no solo CÓMO usar hooks, sino CUÁNDO y POR QUÉ usarlos.

**El verdadero test de maestría**: ¿Puedes explicar a un desarrollador junior por qué elegiste NOT usar un hook en una situación específica? Si puedes articular claramente cuándo NO usar una herramienta, entonces realmente entiendes esa herramienta.

---

*Recuerda: Los hooks son herramientas poderosas, pero como todas las herramientas poderosas, requieren sabiduría para ser usadas efectivamente. El código más elegante no es el que usa todas las características avanzadas, sino el que resuelve el problema con la menor complejidad necesaria.*

// Custom hook para usar el context export const useTheme = () => { const context = useContext(ThemeContext); if (!context) { throw new Error('useTheme must be used within ThemeProvider'); } return context; };

```

**2. Usando el Context**
```javascript
const Header = () => {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <header style={{ backgroundColor: colors.primary }}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
};
```

#### Patrón Avanzado: Multiple Contexts

```javascript
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  
  return (
    <UserContext.Provider value={{ user, permissions, setUser, setPermissions }}>
      {children}
    </UserContext.Provider>
  );
};

// Composición de providers
const AppProviders = ({ children }) => (
  <ThemeProvider>
    <UserProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </UserProvider>
  </ThemeProvider>
);
```

#### Cuándo Usar useContext

* ✅ **Estado global** de la aplicación
* ✅ **Tema** y configuraciones UI
* ✅ **Usuario autenticado** y permisos
* ✅ **Configuración** de la aplicación
* ✅ Evitar **prop drilling** profundo

#### Cuándo NO Usar useContext

* ❌ **Estado local** de componente
* ❌ **Datos que cambian frecuentemente** (puede causar re-renders masivos)
* ❌ **Estado que no necesita ser compartido**

---

## HOOKS AVANZADOS

### 4. useReducer - El Gestor de Estado Complejo

**¿Qué hace?** Maneja estado complejo con lógica de actualización más predecible.

#### Implementación Avanzada

**1. Reducer Complejo para Form Management**

```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        },
        errors: {
          ...state.errors,
          [action.field]: null // Limpiar error al editar
        }
      };
  
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isSubmitting: false
      };
  
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
  
    case 'RESET_FORM':
      return {
        ...state,
        values: action.initialValues || {},
        errors: {},
        isSubmitting: false
      };
  
    default:
      return state;
  }
};

const useForm = (initialValues = {}) => {
  const [state, dispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: {},
    isSubmitting: false
  });
  
  const setField = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };
  
  const setErrors = (errors) => {
    dispatch({ type: 'SET_ERRORS', errors });
  };
  
  const reset = (newInitialValues) => {
    dispatch({ type: 'RESET_FORM', initialValues: newInitialValues });
  };
  
  return {
    ...state,
    setField,
    setErrors,
    reset
  };
};
```

**2. Reducer para Shopping Cart**

```javascript
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.item.id);
    
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
    
      return {
        ...state,
        items: [...state.items, { ...action.item, quantity: 1 }]
      };
  
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.itemId)
      };
  
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.itemId
            ? { ...item, quantity: Math.max(0, action.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
  
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.discount
      };
  
    case 'CLEAR_CART':
      return {
        items: [],
        discount: null
      };
  
    default:
      return state;
  }
};
```

#### Cuándo Usar useReducer

* ✅ **Estado complejo** con múltiples sub-valores
* ✅ **Lógica de actualización compleja**
* ✅ **Estado que depende del estado anterior**
* ✅ **Múltiples componentes** que necesitan actualizar el mismo estado
* ✅ **Testing** (más fácil testear reducers puros)

#### Cuándo NO Usar useReducer

* ❌ **Estado simple** (un string, number, boolean)
* ❌ **Estado que no tiene lógica de actualización compleja**
* ❌ **Overkill** para casos simples

---

### 5. useMemo - El Optimizador de Cálculos

**¿Qué hace?** Memoriza el resultado de cálculos costosos.

#### Implementaciones Prácticas

**1. Cálculos Costosos**

```javascript
const ExpensiveComponent = ({ items, filters }) => {
  const filteredAndSortedItems = useMemo(() => {
    console.log('Recalculando items...'); // Solo debería aparecer cuando cambian las dependencias
  
    return items
      .filter(item => {
        return filters.category ? item.category === filters.category : true;
      })
      .filter(item => {
        return filters.search ? 
          item.name.toLowerCase().includes(filters.search.toLowerCase()) : true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'price': return a.price - b.price;
          case 'date': return new Date(b.createdAt) - new Date(a.createdAt);
          default: return 0;
        }
      });
  }, [items, filters.category, filters.search, filters.sortBy]);
  
  return (
    <div>
      {filteredAndSortedItems.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};
```

**2. Objetos y Arrays Derivados**

```javascript
const Dashboard = ({ user, orders, products }) => {
  const dashboardData = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const topProducts = products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    const monthlyStats = calculateMonthlyStats(orders);
  
    return {
      totalRevenue,
      topProducts,
      monthlyStats,
      averageOrderValue: totalRevenue / orders.length || 0
    };
  }, [orders, products]);
  
  return (
    <div>
      <RevenueChart data={dashboardData.monthlyStats} />
      <TopProducts products={dashboardData.topProducts} />
    </div>
  );
};
```

**3. Configuraciones de Componentes**

```javascript
const Chart = ({ data, type, theme }) => {
  const chartConfig = useMemo(() => ({
    type,
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Sales Chart'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: theme === 'dark' ? '#374151' : '#e5e7eb'
          }
        }
      }
    }
  }), [data, type, theme]);
  
  return <ChartComponent {...chartConfig} />;
};
```

#### Anti-patrones Comunes

**❌ Usar useMemo para todo**

```javascript
// Innecesario para cálculos simples
const doubled = useMemo(() => value * 2, [value]);
```

**❌ Dependencias incorrectas**

```javascript
const memoizedValue = useMemo(() => {
  return items.filter(item => item.userId === user.id);
}, [items]); // Falta user.id en las dependencias
```

#### Cuándo Usar useMemo

* ✅ **Cálculos costosos** que se ejecutan frecuentemente
* ✅ **Filtrado/ordenamiento** de listas grandes
* ✅ **Objetos/arrays derivados** que causan re-renders
* ✅ **Transformaciones de datos** complejas

#### Cuándo NO Usar useMemo

* ❌ **Cálculos simples** (suma, multiplicación básica)
* ❌ **Optimización prematura**
* ❌ **Valores primitivos** simples
* ❌ **Funciones** (usar useCallback en su lugar)

---

### 6. useCallback - El Memorizador de Funciones

**¿Qué hace?** Memoriza funciones para prevenir re-creaciones innecesarias.

#### Implementaciones Avanzadas

**1. Event Handlers Optimizados**

```javascript
const TodoList = ({ todos, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState('all');
  
  // ✅ Memorizar handler que usa props
  const handleToggleTodo = useCallback((id) => {
    onUpdate(id, { completed: !todos.find(t => t.id === id).completed });
  }, [todos, onUpdate]);
  
  // ✅ Memorizar handler con lógica compleja
  const handleDeleteTodo = useCallback((id) => {
    if (window.confirm('¿Estás seguro?')) {
      onDelete(id);
    }
  }, [onDelete]);
  
  // ✅ Handler local que no necesita dependencias externas
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);
  
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed': return todos.filter(t => t.completed);
      case 'pending': return todos.filter(t => !t.completed);
      default: return todos;
    }
  }, [todos, filter]);
  
  return (
    <div>
      <FilterButtons filter={filter} onFilterChange={handleFilterChange} />
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      ))}
    </div>
  );
};
```

**2. Hooks Personalizados con useCallback**

```javascript
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const request = useCallback(async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);
    
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const get = useCallback((url) => request(url), [request]);
  const post = useCallback((url, data) => request(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }), [request]);
  
  return { loading, error, get, post, request };
};
```

**3. Debounced Callbacks**

```javascript
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedCallback;
};

// Uso
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const searchApi = useCallback(async (searchQuery) => {
    if (searchQuery.trim()) {
      const data = await api.search(searchQuery);
      setResults(data);
    }
  }, []);
  
  const debouncedSearch = useDebounce(searchApi, 300);
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <SearchResults results={results} />
    </div>
  );
};
```

#### Cuándo Usar useCallback

* ✅ **Funciones pasadas a componentes hijos** que están optimizados con memo
* ✅ **Dependencies de otros hooks** (useEffect, useMemo)
* ✅ **Event handlers** que se crean en cada render
* ✅ **Funciones costosas de crear**

#### Cuándo NO Usar useCallback

* ❌ **Funciones que siempre cambian** sus dependencias
* ❌ **Optimización prematura**
* ❌ **Funciones simples** sin dependencias externas

---

## HOOKS DE PERFORMANCE

### 7. React.memo y useCallback/useMemo - La Trinidad de Optimización

**Trabajando Juntos:**

```javascript
// Componente hijo optimizado
const ExpensiveChild = React.memo(({ data, onAction, config }) => {
  console.log('ExpensiveChild render');
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onAction(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

// Componente padre optimizado
const ParentComponent = ({ items, userId }) => {
  const [filter, setFilter] = useState('');
  
  // ✅ Datos memorizados
  const filteredData = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // ✅ Función memorizada
  const handleAction = useCallback((itemId) => {
    console.log('Action on item:', itemId);
    // Lógica de acción...
  }, []);
  
  // ✅ Configuración memorizada
  const config = useMemo(() => ({
    theme: 'dark',
    showIcons: true,
    userId
  }), [userId]);
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <ExpensiveChild
        data={filteredData}
        onAction={handleAction}
        config={config}
      />
    </div>
  );
};
```

---

## HOOKS DE REFERENCIAS

### 8. useRef - El Guardián de Referencias

**¿Qué hace?** Mantiene una referencia mutable que persiste entre renders.

#### Casos de Uso Avanzados

**1. Acceso Directo al DOM**

```javascript
const AutoFocusInput = ({ shouldFocus }) => {
  const inputRef = useRef(null);
  const previousShouldFocus = useRef(shouldFocus);
  
  useEffect(() => {
    // Solo hacer focus si el prop cambió de false a true
    if (shouldFocus && !previousShouldFocus.current) {
      inputRef.current?.focus();
    }
    previousShouldFocus.current = shouldFocus;
  }, [shouldFocus]);
  
  return <input ref={inputRef} placeholder="Auto-focus input" />;
};
```

**2. Valores Anteriores**

```javascript
const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Uso
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const previousUserId = usePrevious(userId);
  
  useEffect(() => {
    // Solo fetch si userId realmente cambió
    if (userId !== previousUserId) {
      fetchUser(userId).then(setUser);
    }
  }, [userId, previousUserId]);
  
  return <div>{user?.name}</div>;
};
```

**3. Cleanup de Timers y Subscriptions**

```javascript
const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  
  // Guardar el callback más reciente
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Configurar el interval
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// Uso
const Timer = () => {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(count => count + 1);
  }, 1000);
  
  return <div>Count: {count}</div>;
};
```

**4. Caching de Valores Costosos**

```javascript
const useExpensiveValue = (input) => {
  const cache = useRef(new Map());
  
  return useMemo(() => {
    if (cache.current.has(input)) {
      return cache.current.get(input);
    }
  
    const result = expensiveCalculation(input);
    cache.current.set(input, result);
  
    // Limitar el tamaño del cache
    if (cache.current.size > 100) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
  
    return result;
  }, [input]);
};
```

#### Cuándo Usar useRef

* ✅ **Acceso directo al DOM**
* ✅ **Valores que no deben causar re-renders**
* ✅ **Referencias a timers/intervals**
* ✅ **Caching** de valores
* ✅ **Valores anteriores** para comparación

#### Cuándo NO Usar useRef

* ❌ **Estado que debe causar re-renders**
* ❌ **Datos que se muestran en la UI** directamente

---

## HOOKS ESPECIALIZADOS

### 9. useLayoutEffect - El Sincronizador Visual

**¿Qué hace?** Similar a useEffect pero se ejecuta síncronamente después de todas las mutaciones del DOM.

```javascript
const MeasuredComponent = ({ children }) => {
  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);
  
  useLayoutEffect(() => {
    // Se ejecuta antes de que el browser pinte
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [children]); // Re-medir cuando el contenido cambie
  
  return (
    <div>
      <div>Height: {height}px</div>
      <div ref={elementRef}>
        {children}
      </div>
    </div>
  );
};
```

#### Cuándo Usar useLayoutEffect

* ✅ **Mediciones del DOM** que afectan el render
* ✅ **Animaciones** que necesitan ejecutarse antes del paint
* ✅ **Prevenir flickering** visual
* ✅ **Scroll position** management

#### Cuándo NO Usar useLayoutEffect

* ❌ **Data fetching** (usar useEffect)
* ❌ **Efectos que no afectan el layout**

---

### 10. useImperativeHandle - El Controlador de Refs

**¿Qué hace?** Personaliza el valor expuesto cuando se usa ref en un componente.

```javascript
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  const [value, setValue] = useState('');
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      setValue('');
      inputRef.current.focus();
    },
    getValue: () => value,
    setValue: (newValue) => setValue(newValue)
  }), [value]);
  
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

// Uso
const Parent = () => {
  const customInputRef = useRef();
  
  const handleClear = () => {
    customInputRef.current.clear();
  };
  
  const handleGetValue = () => {
    console.log(customInputRef.current.getValue());
  };
  
  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleGetValue}>Get Value</button>
    </div>
  );
};
```

---

### 11. useDebugValue - El Debugger de Hooks

**¿Qué hace?** Permite mostrar información adicional en React DevTools.

```javascript
const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchUser(userId)
        .then(setUser)
        .finally(() => setLoading(false));
    }
  }, [userId]);
  
  // Información visible en React DevTools
  useDebugValue(user ? `User: ${user.name}` : 'No user');
  
  return { user, loading };
};
```

---

## HOOKS PERSONALIZADOS AVANZADOS

### 12. Hooks Personalizados para Casos Comunes

#### useLocalStorage - Persistencia Local

```javascript
const useLocalStorage = (key, initialValue) => {
  // Función para obtener el valor inicial
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = useCallback((value) => {
    try {
      // Permitir que value sea una función como en useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
  
      // Guardar en localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// Uso
const UserSettings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};
```
