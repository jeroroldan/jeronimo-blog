---
title: 'Master Class: useEffect - Guía Completa para Expertos'
code: 'react'
description: 'UseEffect'
pubDate: 'Jun 19 2024'
heroImag



# Master Class: useEffect - Guía Completa para Expertos 🚀

## 📚 Tabla de Contenidos

1. [Fundamentos Esenciales](#fundamentos-esenciales)
2. [Anatomía del useEffect](#anatomía-del-useeffect)
3. [Patrones y Dependencias](#patrones-y-dependencias)
4. [Efectos Avanzados](#efectos-avanzados)
5. [Optimización y Performance](#optimización-y-performance)
6. [Anti-patrones Comunes](#anti-patrones-comunes)
7. [Testing de useEffect](#testing-de-useeffect)
8. [React Native Específico](#react-native-específico)
9. [Migración a React 18+](#migración-a-react-18)
10. [Casos de Uso del Mundo Real](#casos-de-uso-del-mundo-real)

---

## 🎯 Fundamentos Esenciales

### ¿Qué ES realmente useEffect?

`useEffect` es el hook que te permite **sincronizar tu componente con sistemas externos**. No es solo para "efectos secundarios" - es para **conectar React con el mundo exterior**.

```javascript
// ❌ Pensamiento incorrecto: "Para efectos secundarios"
// ✅ Pensamiento correcto: "Para sincronizar con sistemas externos"

useEffect(() => {
  // Conectar con: APIs, DOM, subscripciones, timers, etc.
}, [dependencies]);
```

### Los 3 Momentos Clave

1. **Sincronización**: Cuando el efecto se ejecuta
2. **Limpieza**: Cuando el efecto se desconecta  
3. **Re-sincronización**: Cuando las dependencias cambian

---

## 🔬 Anatomía del useEffect

### Estructura Completa

```javascript
useEffect(
  () => {           // 1. Setup function
    // Código de sincronización
    
    return () => {  // 2. Cleanup function (opcional)
      // Código de limpieza
    };
  }, 
  [dependencies]   // 3. Dependencies array (opcional)
);
```

### Los 4 Tipos de useEffect

#### 1. Sin Dependencias (Cada Render)

```javascript
useEffect(() => {
  console.log('Se ejecuta después de CADA render');
});
// ⚠️ Raramente útil, casi siempre es un error
```

#### 2. Array Vacío (Solo Una Vez)

```javascript
useEffect(() => {
  console.log('Se ejecuta solo al montar el componente');
  
  return () => {
    console.log('Se ejecuta solo al desmontar');
  };
}, []); // ← Array vacío
```

#### 3. Con Dependencias Específicas

```javascript
useEffect(() => {
  console.log('Se ejecuta cuando userId cambia');
  fetchUserData(userId);
}, [userId]); // ← Solo cuando userId cambie
```

#### 4. Con Múltiples Dependencias

```javascript
useEffect(() => {
  console.log('Se ejecuta cuando userId O searchTerm cambien');
  searchUsers(userId, searchTerm);
}, [userId, searchTerm]);
```

---

## 🎯 Patrones y Dependencias

### Regla de Oro de las Dependencias

**"Todo lo que uses dentro del useEffect y que pueda cambiar, DEBE estar en las dependencias"**

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ❌ Incorrecto - falta userId en dependencias
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, []);
  
  // ✅ Correcto
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
}
```

### Patrón: Estado Derivado vs useEffect

```javascript
// ❌ Innecesario - usar useEffect para estado derivado
function UserProfile({ firstName, lastName }) {
  const [fullName, setFullName] = useState('');
  
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);
}

// ✅ Mejor - cálculo directo durante el render
function UserProfile({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;
  // O usar useMemo si es costoso
  const fullName = useMemo(() => 
    expensiveCalculation(firstName, lastName), 
    [firstName, lastName]
  );
}
```

### Patrón: Funciones en Dependencias

```javascript
// ❌ Problemático - función se recrea cada render
function SearchComponent({ query }) {
  const handleSearch = (q) => {
    // lógica de búsqueda
  };
  
  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]); // handleSearch cambia cada render
}

// ✅ Solución 1: useCallback
function SearchComponent({ query }) {
  const handleSearch = useCallback((q) => {
    // lógica de búsqueda
  }, []);
  
  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);
}

// ✅ Solución 2: Función dentro del useEffect
function SearchComponent({ query }) {
  useEffect(() => {
    const handleSearch = (q) => {
      // lógica de búsqueda
    };
    
    handleSearch(query);
  }, [query]);
}
```

### Patrón: Objetos y Arrays en Dependencias

```javascript
// ❌ Problemático - objeto se recrea cada render
function UserList({ filters }) {
  useEffect(() => {
    fetchUsers(filters);
  }, [filters]); // filters es un objeto nuevo cada vez
}

// ✅ Solución 1: useMemo para estabilizar el objeto
function UserList({ searchTerm, category }) {
  const filters = useMemo(() => ({
    searchTerm,
    category
  }), [searchTerm, category]);
  
  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);
}

// ✅ Solución 2: Dependencias individuales
function UserList({ searchTerm, category }) {
  useEffect(() => {
    const filters = { searchTerm, category };
    fetchUsers(filters);
  }, [searchTerm, category]);
}
```

---

## 🚀 Efectos Avanzados

### Data Fetching con Cleanup

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await api.getUser(userId);
        
        // Solo actualizar si el efecto no fue cancelado
        if (!cancelled) {
          setUser(userData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  return { user, loading, error };
}
```

### Subscripciones con Cleanup

```javascript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const socket = new WebSocket(`ws://chat-server/${roomId}`);
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    socket.onopen = () => {
      console.log('Conectado al chat');
    };
    
    // ✅ Limpieza obligatoria para subscripciones
    return () => {
      socket.close();
      console.log('Desconectado del chat');
    };
  }, [roomId]);
  
  return <ChatMessages messages={messages} />;
}
```

### Timers y Intervalos

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    
    // ✅ Siempre limpiar timers
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]); // Solo cuando isActive cambie
  
  return (
    <div>
      <p>Tiempo: {seconds}s</p>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pausar' : 'Iniciar'}
      </button>
    </div>
  );
}
```

### Event Listeners

```javascript
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // ✅ Siempre remover event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Solo una vez
  
  return <div>{windowSize.width} x {windowSize.height}</div>;
}
```

---

## ⚡ Optimización y Performance

### useCallback para Funciones Estables

```javascript
function ExpensiveComponent({ userId, onUserUpdate }) {
  const [user, setUser] = useState(null);
  
  // ✅ Función estable para evitar re-renders innecesarios
  const updateUser = useCallback(async (newData) => {
    const updatedUser = await api.updateUser(userId, newData);
    setUser(updatedUser);
    onUserUpdate(updatedUser);
  }, [userId, onUserUpdate]);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <UserForm user={user} onUpdate={updateUser} />;
}
```

### Debouncing en useEffect

```javascript
function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    
    // ✅ Debouncing con timeout
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchAPI(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Error en búsqueda:', error);
      } finally {
        setLoading(false);
      }
    }, 500);
    
    // Cleanup: cancelar búsqueda anterior
    return () => {
      clearTimeout(timeoutId);
      setLoading(false);
    };
  }, [query]);
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      {loading && <p>Buscando...</p>}
      <SearchResults results={results} />
    </div>
  );
}
```

### Lazy Loading con Intersection Observer

```javascript
function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
  
  return (
    <div ref={imgRef}>
      {isVisible && (
        <img 
          src={src} 
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
```

---

## ❌ Anti-patrones Comunes

### 1. Olvidar las Dependencias

```javascript
// ❌ Bug común - estado obsoleto
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Siempre será 0 + 1
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // Falta 'count' en dependencias
  
  return <div>{count}</div>;
}

// ✅ Solución 1: Usar función de actualización
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1); // ✅ Usa el valor actual
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div>{count}</div>;
}

// ✅ Solución 2: Incluir en dependencias
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [count]); // ✅ Incluye count, pero reinicia cada segundo
  
  return <div>{count}</div>;
}
```

### 2. useEffect para Estado Derivado

```javascript
// ❌ Innecesario
function ShoppingCart({ items }) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [items]);
  
  return <div>Total: ${total}</div>;
}

// ✅ Mejor - cálculo directo
function ShoppingCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div>Total: ${total}</div>;
}
```

### 3. No Usar Cleanup

```javascript
// ❌ Memory leak
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // No cancela requests anteriores
}

// ✅ Con cleanup
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    fetchUser(userId, { signal: abortController.signal })
      .then(setUser)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });
    
    return () => abortController.abort();
  }, [userId]);
}
```

### 4. Dependencias Innecesarias

```javascript
// ❌ Re-ejecuta innecesariamente
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId, setUser]); // setUser es estable, no necesaria
}

// ✅ Solo dependencias necesarias
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Solo userId
}
```

---

## 🧪 Testing de useEffect

### Testing Básico

```javascript
import { render, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import UserProfile from './UserProfile';

// Mock de la API
jest.mock('./api', () => ({
  fetchUser: jest.fn()
}));

test('carga datos del usuario al montar', async () => {
  const mockUser = { id: 1, name: 'Juan' };
  api.fetchUser.mockResolvedValue(mockUser);
  
  const { getByText } = render(<UserProfile userId={1} />);
  
  // Verificar que se llama la API
  expect(api.fetchUser).toHaveBeenCalledWith(1);
  
  // Esperar que aparezca el nombre
  await waitFor(() => {
    expect(getByText('Juan')).toBeInTheDocument();
  });
});
```

### Testing Cleanup

```javascript
test('cancela requests al desmontar', async () => {
  const abortMock = jest.fn();
  const originalAbortController = global.AbortController;
  
  global.AbortController = jest.fn(() => ({
    signal: {},
    abort: abortMock
  }));
  
  const { unmount } = render(<UserProfile userId={1} />);
  
  unmount();
  
  expect(abortMock).toHaveBeenCalled();
  
  global.AbortController = originalAbortController;
});
```

### Testing Dependencias

```javascript
test('recarга datos cuando cambia userId', async () => {
  const { rerender } = render(<UserProfile userId={1} />);
  
  expect(api.fetchUser).toHaveBeenCalledWith(1);
  
  // Cambiar prop
  rerender(<UserProfile userId={2} />);
  
  expect(api.fetchUser).toHaveBeenCalledWith(2);
  expect(api.fetchUser).toHaveBeenCalledTimes(2);
});
```

---

## 📱 React Native Específico

### Permisos y Lifecycle

```javascript
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';

function LocationTracker() {
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    let locationSubscription;
    
    const requestPermissionAndStartTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
            },
            (newLocation) => {
              setLocation(newLocation);
            }
          );
        }
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };
    
    requestPermissionAndStartTracking();
    
    // ✅ Cleanup obligatorio
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);
  
  return hasPermission ? <LocationDisplay location={location} /> : <PermissionRequest />;
}
```

### App State y Background

```javascript
function BackgroundHandler() {
  const [appState, setAppState] = useState(AppState.currentState);
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App volvió al foreground');
        // Refrescar datos, reconectar websockets, etc.
      } else if (nextAppState === 'background') {
        console.log('App pasó a background');
        // Guardar datos, pausar timers, etc.
      }
      
      setAppState(nextAppState);
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // ✅ Cleanup
    return () => subscription?.remove();
  }, [appState]);
}
```

### Keyboard y Navigation

```javascript
import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function KeyboardAwareScreen() {
  const navigation = useNavigation();
  
  useEffect(() => {
    const keyboardDidShow = () => {
      console.log('Teclado mostrado');
    };
    
    const keyboardDidHide = () => {
      console.log('Teclado ocultado');
    };
    
    const showListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    
    // Navigation focus/blur
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('Pantalla enfocada');
    });
    
    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('Pantalla desenfocada');
    });
    
    // ✅ Cleanup múltiple
    return () => {
      showListener?.remove();
      hideListener?.remove();
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);
}
```

---

## 🔄 Migración a React 18+

### Strict Mode y Efectos Duplicados

```javascript
// En React 18+ Strict Mode, useEffect se ejecuta 2 veces en desarrollo
function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    console.log('Efecto ejecutado'); // Se verá 2 veces en desarrollo
    
    fetchData()
      .then(result => {
        if (!cancelled) {
          setData(result);
        }
      });
    
    // ✅ Cleanup que maneja la duplicación
    return () => {
      cancelled = true;
      console.log('Cleanup ejecutado');
    };
  }, []);
}
```

### Concurrent Features

```javascript
import { useDeferredValue, useTransition } from 'react';

function SearchWithConcurrency() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  // ✅ Valor diferido para búsquedas menos urgentes
  const deferredQuery = useDeferredValue(query);
  
  useEffect(() => {
    if (!deferredQuery) {
      setResults([]);
      return;
    }
    
    // Búsqueda no urgente
    startTransition(() => {
      searchAPI(deferredQuery).then(setResults);
    });
  }, [deferredQuery]);
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isPending && <div>Buscando...</div>}
      <Results results={results} />
    </div>
  );
}
```

---

## 🌟 Casos de Uso del Mundo Real

### E-commerce: Carrito Persistente

```javascript
function ShoppingCart() {
  const [items, setItems] = useState(() => {
    // Inicialización lazy desde localStorage
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Limpieza al cerrar ventana
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('cart', JSON.stringify(items));
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items]);
  
  return <CartItems items={items} onUpdateItems={setItems} />;
}
```

### Chat en Tiempo Real

```javascript
function ChatRoom({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  
  useEffect(() => {
    // Conectar a WebSocket
    const socket = new WebSocket(`ws://localhost:8080/chat/${roomId}`);
    socketRef.current = socket;
    
    socket.onopen = () => {
      setConnected(true);
      // Enviar identificación
      socket.send(JSON.stringify({
        type: 'join',
        userId,
        roomId
      }));
    };
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    socket.onclose = () => {
      setConnected(false);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // ✅ Cleanup completo
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'leave',
          userId,
          roomId
        }));
      }
      socket.close();
    };
  }, [roomId, userId]);
  
  const sendMessage = useCallback((text) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        text,
        userId,
        timestamp: Date.now()
      }));
    }
  }, [userId]);
  
  return (
    <div>
      <ConnectionStatus connected={connected} />
      <Messages messages={messages} />
      <MessageInput onSend={sendMessage} disabled={!connected} />
    </div>
  );
}
```

### Analytics y Tracking

```javascript
function AnalyticsProvider({ children }) {
  const [pageViews, setPageViews] = useState(0);
  const [sessionStart] = useState(Date.now());
  
  // Track page views
  useEffect(() => {
    const trackPageView = (path) => {
      setPageViews(prev => prev + 1);
      
      // Enviar a servicio de analytics
      analytics.track('page_view', {
        path,
        timestamp: Date.now(),
        sessionId: sessionStart
      });
    };
    
    // Escuchar cambios de ruta (ejemplo con React Router)
    const unlisten = history.listen(({ location }) => {
      trackPageView(location.pathname);
    });
    
    // Track inicial
    trackPageView(window.location.pathname);
    
    return unlisten;
  }, [sessionStart]);
  
  // Track session duration al salir
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStart;
      
      analytics.track('session_end', {
        duration: sessionDuration,
        pageViews,
        sessionId: sessionStart
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionStart, pageViews]);
  
  return children;
}
```

### Infinite Scroll

```javascript
function InfiniteList({ fetchMore, hasMore }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  
  // Fetch inicial
  useEffect(() => {
    setLoading(true);
    fetchMore(1)
      .then(newItems => {
        setItems(newItems);
        setLoading(false);
      });
  }, []);
  
  // Intersection Observer para infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoading(true);
          fetchMore(page + 1)
            .then(newItems => {
              setItems(prev => [...prev, ...newItems]);
              setPage(prev => prev + 1);
              setLoading(false);
            });
        }
      },
      { threshold: 1.0 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchMore]);
  
  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      {hasMore && (
        <div ref={loaderRef}>
          {loading ? 'Cargando...' : 'Cargar más'}
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Checklist de Experto en useEffect

### ✅ Antes de Escribir useEffect

- [ ] ¿Realmente necesito sincronizar con un sistema externo?
- [ ] ¿Puedo calcular esto durante el render?
- [ ] ¿Es estado derivado que debería ser calculado?

### ✅ Al Escribir useEffect

- [ ] ¿Tengo todas las dependencias necesarias?
- [ ] ¿Alguna dependencia cambia innecesariamente?
- [ ] ¿Necesito cleanup? (subscripciones, timers, requests)
- [ ] ¿Manejo el caso de efectos cancelados?

### ✅ Al Revisar useEffect

- [ ] ¿Se ejecuta el número correcto de veces?
- [ ] ¿Hay memory leaks potenciales?
- [ ]
