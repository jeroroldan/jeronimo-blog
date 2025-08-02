---
title: 'React Query'
code: "react"
description: 'React Query: Guía Completa y Práctica'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# React Query: Guía Completa y Práctica

## 🎯 Introducción: ¿Qué es React Query?

React Query es como el **asistente personal más eficiente** que puedas imaginar para manejar datos en tus aplicaciones React. Si tu app fuera una oficina, React Query sería ese empleado que:

* Siempre sabe dónde están los documentos importantes (caché)
* Actualiza la información automáticamente cuando hay cambios
* Evita trabajo duplicado (no hace la misma petición dos veces)
* Te mantiene informado del estado de todo en tiempo real

### ¿Por qué usar React Query?

**Sin React Query:**

```javascript
// El caos tradicional
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/users')
    .then(res => res.json())
    .then(data => {
      setUsers(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
}, []);
```

**Con React Query:**

```javascript
// Simplicidad y poder
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json())
});
```

---

## 🏗️ Configuración Inicial

### Instalación

```bash
npm install @tanstack/react-query
# o
yarn add @tanstack/react-query
```

### Setup Básico

```javascript
// App.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Analogía:** Imagina que QueryClient es el **gerente de una biblioteca moderna**. Establece las reglas sobre cuánto tiempo mantener los libros en el mostrador (staleTime), cuándo renovar el inventario (retry), y si debe revisar actualizaciones cuando alguien entra a la biblioteca (refetchOnWindowFocus).

---

## 📖 useQuery: El Corazón de React Query

### Conceptos Fundamentales

**QueryKey:** Es como la **dirección postal** de tus datos. React Query usa esta clave para identificar, cachear y actualizar datos específicos.

```javascript
// ✅ Claves simples
useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// ✅ Claves con parámetros
useQuery({ 
  queryKey: ['user', userId], 
  queryFn: () => fetchUser(userId) 
});

// ✅ Claves complejas
useQuery({ 
  queryKey: ['posts', { status: 'published', page: 1 }], 
  queryFn: () => fetchPosts({ status: 'published', page: 1 })
});
```

### Ejemplo Práctico: Lista de Productos

```javascript
// hooks/useProducts.js
import { useQuery } from '@tanstack/react-query';

const fetchProducts = async ({ queryKey }) => {
  const [, filters] = queryKey;
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/products?${params}`);
  
  if (!response.ok) {
    throw new Error('Error al cargar productos');
  }
  
  return response.json();
};

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: fetchProducts,
    enabled: true, // Solo ejecuta si es true
    staleTime: 5 * 60 * 1000, // Datos frescos por 5 min
    select: (data) => {
      // Transforma los datos antes de devolverlos
      return data.map(product => ({
        ...product,
        formattedPrice: `$${product.price.toFixed(2)}`
      }));
    }
  });
};

// Componente
function ProductList() {
  const [filters, setFilters] = useState({ category: 'electronics' });
  const { 
    data: products = [], 
    isLoading, 
    error, 
    isFetching, // Diferente a isLoading
    refetch 
  } = useProducts(filters);

  if (isLoading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>
        {isFetching ? 'Actualizando...' : 'Actualizar'}
      </button>
  
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.formattedPrice}</p>
        </div>
      ))}
    </div>
  );
}
```

**Analogía:**`isLoading` es como cuando entras a un restaurante por primera vez y esperas el menú. `isFetching` es cuando ya tienes el menú pero el mesero está verificando si hay platos nuevos del día.

---

## 🔄 useMutation: Modificando Datos

### Conceptos Básicos

Las mutaciones son como **hacer transacciones bancarias**: necesitas confirmación, manejo de errores, y posiblemente actualizar tu saldo después.

```javascript
// hooks/useCreateProduct.js
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createProduct = async (productData) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  
  if (!response.ok) {
    throw new Error('Error al crear producto');
  }
  
  return response.json();
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      // Actualiza la lista de productos
      queryClient.setQueryData(['products'], (oldProducts) => {
        return [...(oldProducts || []), newProduct];
      });
  
      // O invalida para refetch automático
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });
};

// Componente
function CreateProductForm() {
  const [formData, setFormData] = useState({ name: '', price: 0 });
  const createProduct = useCreateProduct();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    createProduct.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: '', price: 0 });
        alert('¡Producto creado exitosamente!');
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          name: e.target.value 
        }))}
        placeholder="Nombre del producto"
        disabled={createProduct.isPending}
      />
  
      <input
        type="number"
        value={formData.price}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          price: parseFloat(e.target.value) 
        }))}
        placeholder="Precio"
        disabled={createProduct.isPending}
      />
  
      <button 
        type="submit" 
        disabled={createProduct.isPending}
      >
        {createProduct.isPending ? 'Creando...' : 'Crear Producto'}
      </button>
  
      {createProduct.error && (
        <div style={{ color: 'red' }}>
          Error: {createProduct.error.message}
        </div>
      )}
    </form>
  );
}
```

---

## 🎯 Actualizaciones Optimistas

Las actualizaciones optimistas son como **pagar con tarjeta de crédito**: asumes que la transacción será exitosa y actúas inmediatamente, pero si falla, reviertes todo.

```javascript
// hooks/useUpdateProduct.js
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }) => 
      fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then(res => res.json()),
  
    onMutate: async ({ id, updates }) => {
      // Cancela queries en proceso para evitar conflictos
      await queryClient.cancelQueries({ queryKey: ['products'] });
  
      // Snapshot del estado actual (por si hay que revertir)
      const previousProducts = queryClient.getQueryData(['products']);
  
      // Actualización optimista
      queryClient.setQueryData(['products'], (oldProducts) => {
        return oldProducts.map(product => 
          product.id === id 
            ? { ...product, ...updates }
            : product
        );
      });
  
      // Retorna contexto para rollback
      return { previousProducts };
    },
  
    onError: (error, variables, context) => {
      // Rollback en caso de error
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },
  
    onSettled: () => {
      // Siempre invalida al final para sincronizar
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// Uso en componente
function ProductItem({ product }) {
  const updateProduct = useUpdateProduct();
  
  const handleToggleFavorite = () => {
    updateProduct.mutate({
      id: product.id,
      updates: { isFavorite: !product.isFavorite }
    });
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button 
        onClick={handleToggleFavorite}
        style={{ 
          color: product.isFavorite ? 'red' : 'gray',
          opacity: updateProduct.isPending ? 0.7 : 1 
        }}
      >
        {product.isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

---

## ♾️ useInfiniteQuery: Paginación Infinita

La paginación infinita es como **leer un libro digital**: no necesitas saber cuántas páginas tiene, solo sigues leyendo y el libro se va cargando automáticamente.

```javascript
// hooks/useInfiniteProducts.js
export const useInfiniteProducts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        ...filters,
        page: pageParam,
        limit: 10
      });
  
      const response = await fetch(`/api/products?${params}`);
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Si la última página tiene menos de 10 items, no hay más páginas
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    }
  });
};

// Componente con scroll infinito
function InfiniteProductList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteProducts({ category: 'electronics' });

  const observer = useRef();
  
  // Ref callback para el último elemento
  const lastProductElementRef = useCallback(node => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
  
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
  
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

  if (status === 'pending') return <div>Cargando...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.map((product, productIndex) => {
            // El último elemento de la última página
            const isLast = pageIndex === data.pages.length - 1 && 
                          productIndex === page.length - 1;
        
            return (
              <div
                key={product.id}
                ref={isLast ? lastProductElementRef : null}
                style={{ 
                  padding: '20px', 
                  border: '1px solid #ddd',
                  margin: '10px 0' 
                }}
              >
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            );
          })}
        </div>
      ))}
  
      {isFetchingNextPage && <div>Cargando más productos...</div>}
  
      {!hasNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          🎉 ¡Has visto todos los productos!
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Sincronización en Tiempo Real

### Con WebSockets

```javascript
// hooks/useRealtimeProducts.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useRealtimeProducts = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: Infinity, // Los datos nunca se consideran stale
  });
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/products');
  
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
  
      switch (type) {
        case 'PRODUCT_CREATED':
          queryClient.setQueryData(['products'], (oldProducts) => {
            return [...(oldProducts || []), data];
          });
          break;
      
        case 'PRODUCT_UPDATED':
          queryClient.setQueryData(['products'], (oldProducts) => {
            return oldProducts.map(product => 
              product.id === data.id ? { ...product, ...data } : product
            );
          });
          break;
      
        case 'PRODUCT_DELETED':
          queryClient.setQueryData(['products'], (oldProducts) => {
            return oldProducts.filter(product => product.id !== data.id);
          });
          break;
      }
    };
  
    return () => ws.close();
  }, [queryClient]);
  
  return query;
};
```

### Con Server-Sent Events (SSE)

```javascript
// hooks/useSSEProducts.js
export const useSSEProducts = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  useEffect(() => {
    const eventSource = new EventSource('/api/products/stream');
  
    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
  
      queryClient.setQueryData(['products'], (oldData) => {
        // Actualiza según el tipo de evento
        return processRealtimeUpdate(oldData, update);
      });
    };
  
    eventSource.onerror = () => {
      console.error('SSE connection error');
    };
  
    return () => eventSource.close();
  }, [queryClient]);
  
  return query;
};
```

---

## 🎨 Patrones Avanzados

### 1. Queries Dependientes

Como **una cadena de montaje**: cada paso depende del anterior.

```javascript
// Primero obtén el usuario
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId)
});

// Luego sus preferencias (solo si el usuario existe)
const { data: preferences } = useQuery({
  queryKey: ['preferences', user?.id],
  queryFn: () => fetchUserPreferences(user.id),
  enabled: !!user?.id // Solo ejecuta si user.id existe
});

// Finalmente, productos recomendados
const { data: recommendations } = useQuery({
  queryKey: ['recommendations', preferences?.categories],
  queryFn: () => fetchRecommendations(preferences.categories),
  enabled: !!preferences?.categories
});
```

### 2. Queries Paralelas

```javascript
// Hook personalizado que combina múltiples queries
export const useDashboardData = (userId) => {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });
  
  const ordersQuery = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => fetchUserOrders(userId),
    enabled: !!userId
  });
  
  const analyticsQuery = useQuery({
    queryKey: ['analytics', userId],
    queryFn: () => fetchUserAnalytics(userId),
    enabled: !!userId
  });
  
  return {
    user: userQuery.data,
    orders: ordersQuery.data,
    analytics: analyticsQuery.data,
    isLoading: userQuery.isLoading || ordersQuery.isLoading || analyticsQuery.isLoading,
    error: userQuery.error || ordersQuery.error || analyticsQuery.error
  };
};
```

### 3. Prefetching Inteligente

```javascript
// hooks/usePrefetchedProducts.js
export const usePrefetchedProducts = () => {
  const queryClient = useQueryClient();
  
  const prefetchNextPage = (currentPage) => {
    queryClient.prefetchQuery({
      queryKey: ['products', { page: currentPage + 1 }],
      queryFn: () => fetchProducts({ page: currentPage + 1 }),
      staleTime: 5 * 60 * 1000
    });
  };
  
  const prefetchProductDetails = (productId) => {
    queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: () => fetchProduct(productId),
      staleTime: 5 * 60 * 1000
    });
  };
  
  return { prefetchNextPage, prefetchProductDetails };
};

// En el componente
function ProductCard({ product }) {
  const { prefetchProductDetails } = usePrefetchedProducts();
  
  return (
    <div
      onMouseEnter={() => prefetchProductDetails(product.id)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}
```

---

## 🔧 Configuraciones Avanzadas

### Query Client Personalizado

```javascript
// utils/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración global para queries
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        // Lógica de retry personalizada
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Configuración global para mutaciones
      retry: 1,
      onError: (error) => {
        // Manejo global de errores
        console.error('Mutation error:', error);
      }
    }
  }
});

// Query cache persistente
import { persistQueryClient } from '@tanstack/react-query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});
```

### Error Boundaries Específicos

```javascript
// components/QueryErrorBoundary.js
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function QueryErrorBoundary({ children }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              <h2>Algo salió mal</h2>
              <button onClick={() => resetErrorBoundary()}>
                Intentar de nuevo
              </button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

---

## 📱 React Query con React Native

### Configuración para Mobile

```javascript
// App.js (React Native)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetInfo from '@react-native-netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState } from 'react-native';

// Configuración específica para mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // En mobile, datos más time-sensitive
      staleTime: 2 * 60 * 1000, // 2 minutos
      cacheTime: 5 * 60 * 1000, // 5 minutos
      retry: 2, // Menos intentos en mobile
      networkMode: 'offlineFirst', // Funciona offline
    },
  },
});

// Manejo de conectividad
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

// Manejo de focus de la app
focusManager.setEventListener(handleFocus => {
  const subscription = AppState.addEventListener('change', state => {
    handleFocus(state === 'active');
  });

  return () => subscription?.remove();
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

### Hook para Datos Offline

```javascript
// hooks/useOfflineQuery.js
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOfflineQuery = (queryKey, queryFn, options = {}) => {
  const offlineKey = `offline_${JSON.stringify(queryKey)}`;
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await queryFn();
        // Guarda en storage local
        await AsyncStorage.setItem(offlineKey, JSON.stringify(data));
        return data;
      } catch (error) {
        // Si falla, intenta cargar datos offline
        const offlineData = await AsyncStorage.getItem(offlineKey);
        if (offlineData) {
          return JSON.parse(offlineData);
        }
        throw error;
      }
    },
    ...options
  });
};
```

---

## 🧪 Testing con React Query

### Setup de Tests

```javascript
// utils/test-utils.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // No retry en tests
      cacheTime: Infinity,
    },
  },
});

export const renderWithQueryClient = (ui, client) => {
  const testQueryClient = client ?? createTestQueryClient();
  
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
};
```

### Test de Query

```javascript
// __tests__/useProducts.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../hooks/useProducts';
import { createTestQueryClient, renderWithQueryClient } from '../utils/test-utils';

// Mock de la API
global.fetch = jest.fn();

describe('useProducts', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch products successfully', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const { result } = renderHook(() => useProducts(), {
      wrapper: ({ children }) => {
        const client = createTestQueryClient();
        return (
          <QueryClientProvider client={client}>
            {children}
          </QueryClientProvider>
        );
      },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProducts);
  });
});
```

### Test de Mutation

```javascript
// __tests__/useCreateProduct.test.js
import { act, renderHook, waitFor } from '@testing-library/react';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { createTestQueryClient } from '../utils/test-utils';

test('should create product successfully', async () => {
  const mockProduct = { id: 3, name: 'New Product', price: 300 };
  
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockProduct,
  });

  const queryClient = createTestQueryClient();
  const { result } = renderHook(() => useCreateProduct(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  });

  await act(async () => {
    result.current.mutate({ name: 'New Product', price: 300 });
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockProduct);
});
```

---

## 🚀 Optimizaciones de Performance

### 1. Lazy Loading de Queries

```javascript
// hooks/useLazyQuery.js
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useLazyQuery = (queryKey, queryFn, options = {}) => {
  const [enabled, setEnabled] = useState(false);
  
  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    ...options
  });
  
  const execute = () => setEnabled(true);
  
  return [execute, query];
};

// Uso
function LazyProductDetails({ productId }) {
  const [loadDetails, { data, isLoading }] = useLazyQuery(
    ['product', productId],
    () => fetchProductDetails(productId)
  );
  
  return (
    <div>
      <button onClick={loadDetails}>
        Cargar detalles
      </button>
      {isLoading && <div>Cargando...</div>}
      {data && <ProductDetails data={data} />}
    </div>
  );
}
```

### 2. Query Cancelation

```javascript
// hooks/useCancelableQuery.js
export const useSearchProducts = (searchTerm) => {
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/products/search?q=${searchTerm}`,
        { signal } // Pasa el signal para cancelación
      );
      return response.json();
    },
    enabled: searchTerm.length > 2, // Solo busca con 3+ caracteres
    staleTime: 30000, // Cache por 30 segundos
  });
};
```

### 3. Selective Query Invalidation

```javascript
// utils/queryInvalidation.js
export const invalidateProductQueries = (queryClient, productId) => {
  // Invalida queries específicas
  queryClient.invalidateQueries({
    queryKey: ['products'],
    exact: false // Invalida todas las variaciones
  });
  
  // Invalida producto específico
  queryClient.invalidateQueries({
    queryKey: ['product', productId],
    exact: true
  });
  
  // NO invalida queries no relacionadas
  // queryClient.invalidateQueries(['users']) // ❌
};
```

---

## 🎯 Casos de Uso del Mundo Real

### 1. E-commerce: Carrito de Compras

```javascript
// hooks/useShoppingCart.js
export const useShoppingCart = () => {
  const queryClient = useQueryClient();
  
  // Query para obtener el carrito
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: Infinity, // El carrito no se vuelve stale automáticamente
  });
  
  // Mutación para agregar productos
  const addToCart = useMutation({
    mutationFn: ({ productId, quantity }) => 
      addProductToCart(productId, quantity),
  
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
  
      const previousCart = queryClient.getQueryData(['cart']);
  
      // Actualización optimista
      queryClient.setQueryData(['cart'], (oldCart) => {
        const existingItem = oldCart?.items?.find(item => item.productId === productId);
    
        if (existingItem) {
          return {
            ...oldCart,
            items: oldCart.items.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            total: oldCart.total + (existingItem.price * quantity)
          };
        } else {
          // Necesitamos el precio del producto
          const product = queryClient.getQueryData(['product', productId]);
          return {
            ...oldCart,
            items: [...(oldCart?.items || []), {
              productId,
              quantity,
              price: product?.price || 0
            }],
            total: (oldCart?.total || 0) + ((product?.price || 0) * quantity)
          };
        }
      });
  
      return { previousCart };
    },
  
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
  
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
  
  // Mutación para actualizar cantidad
  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }) => 
      updateCartItemQuantity(productId, quantity),
  
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
  
      const previousCart = queryClient.getQueryData(['cart']);
  
      queryClient.setQueryData(['cart'], (oldCart) => {
        const updatedItems = quantity === 0 
          ? oldCart.items.filter(item => item.productId !== productId)
          : oldCart.items.map(item =>
              item.productId === productId
                ? { ...item, quantity }
                : item
            );
    
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
    
        return {
          ...oldCart,
          items: updatedItems,
          total: newTotal
        };
      });
  
      return { previousCart };
    },
  
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    }
  });
  
  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    addToCart: addToCart.mutate,
    updateQuantity: updateQuantity.mutate,
    isAddingToCart: addToCart.isPending,
    isUpdating: updateQuantity.isPending
  };
};

// Componente del carrito
function ShoppingCart() {
  const { cart, addToCart, updateQuantity, isUpdating } = useShoppingCart();
  
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity({ productId, quantity: Math.max(0, newQuantity) });
  };
  
  if (!cart?.items?.length) {
    return <div>Tu carrito está vacío</div>;
  }
  
  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cart.items.map(item => (
        <div key={item.productId} style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          opacity: isUpdating ? 0.7 : 1 
        }}>
          <span>{item.name}</span>
          <div>
            <button 
              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div><strong>Total: ${cart.total.toFixed(2)}</strong></div>
    </div>
  );
}
```

### 2. Sistema de Notificaciones en Tiempo Real

```javascript
// hooks/useNotifications.js
export const useNotifications = () => {
  const queryClient = useQueryClient();
  
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // Refetch cada 30 segundos como fallback
  });
  
  // Marcar como leída
  const markAsRead = useMutation({
    mutationFn: (notificationId) => markNotificationAsRead(notificationId),
  
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
  
      const previousNotifications = queryClient.getQueryData(['notifications']);
  
      queryClient.setQueryData(['notifications'], (old) => ({
        ...old,
        items: old.items.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, old.unreadCount - 1)
      }));
  
      return { previousNotifications };
    },
  
    onError: (err, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    }
  });
  
  // Conexión WebSocket para notificaciones en tiempo real
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/notifications');
  
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
  
      queryClient.setQueryData(['notifications'], (old) => ({
        ...old,
        items: [notification, ...old.items],
        unreadCount: old.unreadCount + 1
      }));
  
      // Mostrar notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/notification-icon.png'
        });
      }
    };
  
    return () => ws.close();
  }, [queryClient]);
  
  return {
    notifications: notificationsQuery.data?.items || [],
    unreadCount: notificationsQuery.data?.unreadCount || 0,
    isLoading: notificationsQuery.isLoading,
    markAsRead: markAsRead.mutate,
    isMarkingAsRead: markAsRead.isPending
  };
};
```

### 3. Dashboard con Múltiples Métricas

```javascript
// hooks/useDashboard.js
export const useDashboard = (dateRange) => {
  // Queries paralelas para diferentes métricas
  const salesQuery = useQuery({
    queryKey: ['sales', dateRange],
    queryFn: () => fetchSalesData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  const trafficQuery = useQuery({
    queryKey: ['traffic', dateRange],
    queryFn: () => fetchTrafficData(dateRange),
    staleTime: 2 * 60 * 1000, // 2 minutos (más frecuente)
  });
  
  const conversionQuery = useQuery({
    queryKey: ['conversion', dateRange],
    queryFn: () => fetchConversionData(dateRange),
    staleTime: 10 * 60 * 1000, // 10 minutos (menos frecuente)
  });
  
  // Query dependiente que necesita datos de ventas
  const topProductsQuery = useQuery({
    queryKey: ['topProducts', dateRange, salesQuery.data?.totalSales],
    queryFn: () => fetchTopProducts(dateRange, salesQuery.data.totalSales),
    enabled: !!salesQuery.data?.totalSales,
    staleTime: 15 * 60 * 1000,
  });
  
  // Prefetch para el siguiente período
  const queryClient = useQueryClient();
  useEffect(() => {
    const nextDateRange = getNextDateRange(dateRange);
  
    // Prefetch datos del siguiente período
    queryClient.prefetchQuery({
      queryKey: ['sales', nextDateRange],
      queryFn: () => fetchSalesData(nextDateRange),
      staleTime: 5 * 60 * 1000,
    });
  }, [dateRange, queryClient]);
  
  const isLoading = salesQuery.isLoading || trafficQuery.isLoading || conversionQuery.isLoading;
  const hasError = salesQuery.error || trafficQuery.error || conversionQuery.error;
  
  return {
    sales: salesQuery.data,
    traffic: trafficQuery.data,
    conversion: conversionQuery.data,
    topProducts: topProductsQuery.data,
    isLoading,
    hasError,
    refetchAll: () => {
      salesQuery.refetch();
      trafficQuery.refetch();
      conversionQuery.refetch();
    }
  };
};

// Componente Dashboard
function Dashboard() {
  const [dateRange, setDateRange] = useState({ 
    start: '2024-01-01', 
    end: '2024-01-31' 
  });
  
  const {
    sales,
    traffic,
    conversion,
    topProducts,
    isLoading,
    hasError,
    refetchAll
  } = useDashboard(dateRange);
  
  if (isLoading) {
    return (
      <div>
        <DashboardSkeleton />
        <p>Cargando métricas del dashboard...</p>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div>
        <h2>Error al cargar el dashboard</h2>
        <button onClick={refetchAll}>Reintentar</button>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      <DateRangePicker 
        value={dateRange} 
        onChange={setDateRange} 
      />
  
      <div className="metrics-grid">
        <MetricCard 
          title="Ventas Totales"
          value={sales?.total}
          change={sales?.changePercent}
        />
        <MetricCard 
          title="Tráfico"
          value={traffic?.visitors}
          change={traffic?.changePercent}
        />
        <MetricCard 
          title="Conversión"
          value={`${conversion?.rate}%`}
          change={conversion?.changePercent}
        />
      </div>
  
      {topProducts && (
        <TopProductsChart products={topProducts} />
      )}
    </div>
  );
}
```

---

## 🛡️ Manejo de Errores Avanzado

### Error Boundary con React Query

```javascript
// components/QueryErrorHandler.js
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  const getErrorMessage = (error) => {
    if (error.status === 404) return 'Recurso no encontrado';
    if (error.status === 403) return 'No tienes permisos para ver este contenido';
    if (error.status >= 500) return 'Error del servidor. Intenta más tarde';
    return 'Algo salió mal. Por favor intenta de nuevo';
  };
  
  return (
    <div role="alert" className="error-container">
      <h2>¡Oops! Algo salió mal</h2>
      <p>{getErrorMessage(error)}</p>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        {error.message}
      </details>
      <button onClick={resetErrorBoundary}>
        Intentar de nuevo
      </button>
    </div>
  );
}

export function QueryErrorHandler({ children }) {
  const { reset } = useQueryErrorResetBoundary();
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={reset}
      resetKeys={['queryError']} // Reset cuando cambie esta key
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Hook para Manejo Global de Errores

```javascript
// hooks/useGlobalErrorHandler.js
export const useGlobalErrorHandler = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'observerResultsUpdated') {
        const { query } = event;
    
        if (query.state.error) {
          const error = query.state.error;
      
          // Manejo específico por tipo de error
          switch (error.status) {
            case 401:
              // Token expirado, redirigir al login
              logout();
              window.location.href = '/login';
              break;
          
            case 403:
              // Sin permisos, mostrar mensaje
              toast.error('No tienes permisos para realizar esta acción');
              break;
          
            case 500:
              // Error del servidor, reportar
              reportError(error, query.queryKey);
              toast.error('Error del servidor. Nuestro equipo ha sido notificado');
              break;
          
            default:
              // Error genérico
              if (error.message) {
                toast.error(error.message);
              }
          }
        }
      }
    });
  
    return unsubscribe;
  }, [queryClient]);
};
```

---

## 🎭 Patrones de UI con React Query

### 1. Skeleton Loading Inteligente

```javascript
// components/SkeletonLoader.js
function ProductListSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-300 h-48 rounded"></div>
          <div className="mt-2 space-y-2">
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook con skeleton inteligente
export const useProductsWithSkeleton = (filters) => {
  const query = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: (previousData) => previousData, // Mantén datos anteriores
  });
  
  const showSkeleton = query.isLoading && !query.data;
  const showStaleData = query.isFetching && query.data;
  
  return {
    ...query,
    showSkeleton,
    showStaleData
  };
};

// Componente con skeleton
function ProductList({ filters }) {
  const { data: products, showSkeleton, showStaleData } = useProductsWithSkeleton(filters);
  
  if (showSkeleton) {
    return <ProductListSkeleton />;
  }
  
  return (
    <div className={showStaleData ? 'opacity-75' : 'opacity-100'}>
      {showStaleData && (
        <div className="text-sm text-gray-500 mb-2">
          Actualizando productos...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### 2. Estado de Búsqueda con Debounce

```javascript
// hooks/useSearchWithDebounce.js
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export const useSearchProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const searchQuery = useQuery({
    queryKey: ['products', 'search', debouncedSearchTerm],
    queryFn: ({ signal }) => searchProducts(debouncedSearchTerm, { signal }),
    enabled: debouncedSearchTerm.length >= 2,
    keepPreviousData: true, // Mantén resultados anteriores mientras carga
  });
  
  // Estados derivados para mejor UX
  const isSearching = searchQuery.isFetching && debouncedSearchTerm.length >= 2;
  const hasSearched = debouncedSearchTerm.length >= 2;
  const noResults = hasSearched && !isSearching && (!searchQuery.data || searchQuery.data.length === 0);
  
  return {
    searchTerm,
    setSearchTerm,
    results: searchQuery.data || [],
    isSearching,
    hasSearched,
    noResults,
    error: searchQuery.error
  };
};

// Componente de búsqueda
function ProductSearch() {
  const {
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
    hasSearched,
    noResults
  } = useSearchProducts();
  
  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full p-2 border rounded"
        />
        {isSearching && (
          <div className="absolute right-2 top-2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
  
      <div className="mt-4">
        {!hasSearched && (
          <div className="text-gray-500">
            Escribe al menos 2 caracteres para buscar
          </div>
        )}
    
        {noResults && (
          <div className="text-gray-500">
            No se encontraron productos para "{searchTerm}"
          </div>
        )}
    
        {results.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {results.length} resultados para "{searchTerm}"
            </p>
            <div className="space-y-2">
              {results.map(product => (
                <SearchResultItem key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔮 React Query v5 - Nuevas Características

### Nuevas APIs y Mejoras

```javascript
// 1. Nuevos nombres de propiedades
const { data, isPending, isError } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  // isPending reemplaza isLoading
  // isError reemplaza error (booleano)
});

// 2. Nuevas opciones de configuración
const query = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  
  // Nueva opción: gcTime (antes cacheTime)
  gcTime: 10 * 60 * 1000,
  
  // Nueva opción: throwOnError
  throwOnError: (error) => error.status >= 500,
  
  // Nueva opción: notifyOnChangeProps
  notifyOnChangeProps: ['data', 'error'],
});

// 3. Simplified Mutations
const mutation = useMutation({
  mutationFn: createProduct,
  
  // Meta para pasar datos adicionales
  meta: {
    errorMessage: 'No se pudo crear el producto',
    successMessage: 'Producto creado exitosamente'
  }
});

// 4. Mejoras en TypeScript
interface Product {
  id: number;
  name: string;
  price: number;
}

const { data } = useQuery<Product[]>({
  queryKey: ['products'],
  queryFn: fetchProducts,
  // TypeScript infiere automáticamente el tipo de data
});
```

### Suspense Integration Mejorada

```javascript
// components/SuspenseProductList.js
function ProductList() {
  // Con suspense: true, el componente se suspende automáticamente
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    suspense: true, // Habilita Suspense
  });
  
  // No necesitas manejar loading aquí
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Componente padre con Suspense
function App() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  );
}
```

---

## 📊 Monitoreo y Analytics

### Métricas de Performance

```javascript
// utils/queryMetrics.js
export const setupQueryMetrics = (queryClient) => {
  let metrics = {
    totalQueries: 0,
    failedQueries: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageLoadTime: 0
  };
  
  queryClient.getQueryCache().subscribe((event) => {
    switch (event.type) {
      case 'observerAdded':
        metrics.totalQueries++;
        break;
    
      case 'observerResultsUpdated':
        const { query } = event;
    
        if (query.state.error) {
          metrics.failedQueries++;
        }
    
        if (query.state.dataUpdatedAt > query.state.dataUpdateCount) {
          metrics.cacheHits++;
        } else {
          metrics.cacheMisses++;
        }
    
        // Calcular tiempo de carga
        if (query.state.fetchStatus === 'idle' && query.state.data) {
          const loadTime = Date.now() - query.state.dataUpdatedAt;
          metrics.averageLoadTime = 
            (metrics.averageLoadTime + loadTime) / 2;
        }
        break;
    }
  
    // Enviar métricas a servicio de analytics
    if (metrics.totalQueries % 10 === 0) {
      sendMetricsToAnalytics(metrics);
    }
  });
  
  return metrics;
};

// Hook para métricas en componentes
export const useQueryMetrics = () => {
  const queryClient = useQueryClient();
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
  
      const currentMetrics = {
        totalQueries: queries.length,
        activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
        stalQueries: queries.filter(q => q.isStale()).length,
        errorQueries: queries.filter(q => q.state.error).length,
        cacheSize: cache.getAll().reduce((size, query) => {
          return size + JSON.stringify(query.state.data || {}).length;
        }, 0)
      };
  
      setMetrics(currentMetrics);
    }, 5000);
  
    return () => clearInterval(interval);
  }, [queryClient]);
  
  return metrics;
};
```

---

## 🏆 Mejores Prácticas y Recomendaciones

### 1. Estructura de Carpetas Recomendada

```
src/
├── hooks/
│   ├── queries/
│   │   ├── useProducts.js
│   │   ├── useUsers.js
│   │   └── index.js
│   ├── mutations/
│   │   ├── useCreateProduct.js
│   │   ├── useUpdateProduct.js
│   │   └── index.js
│   └── utils/
│       ├── useDebounce.js
│       └── useLocalStorage.js
├── services/
│   ├── api.js
│   ├── products.js
│   └── users.js
├── utils/
│   ├── queryClient.js
│   └── queryKeys.js
└── components/
    ├── ui/
    └── features/
```

### 2. Convenciones de Naming

```javascript
// utils/queryKeys.js - Centraliza todas las query keys
export const queryKeys = {
  // Productos
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => 
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => 
      [...queryKeys.products.details(), id] as const,
  },
  
  // Usuarios
  users: {
    all: ['users'] as const,
    profile: (id: number) => [...queryKeys.users.all, 'profile', id] as const,
    preferences: (id: number) => 
      [...queryKeys.users.all, 'preferences', id] as const,
  }
};

// Uso en hooks
export const useProducts = (filters) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetchProducts(filters)
  });
};
```

### 3. Patrones de Error Handling

```javascript
// utils/errorHandlers.js
export const createErrorHandler = (context) => ({
  onError: (error, variables, rollbackContext) => {
    // Log del error
    console.error(`Error in ${context}:`, error);
  
    // Rollback si es necesario
    if (rollbackContext) {
      // Implementar rollback específico
    }
  
    // Notificación al usuario
    toast.error(getErrorMessage(error));
  
    // Reportar a servicio de monitoring
    reportError(error, { context, variables });
  }
});

export const getErrorMessage = (error) => {
  const messages = {
    400: 'Datos inválidos. Por favor revisa la información',
    401: 'Sesión expirada. Por favor inicia sesión nuevamente',
    403: 'No tienes permisos para realizar esta acción',
    404: 'El recurso solicitado no fue encontrado',
    500: 'Error interno del servidor. Intenta más tarde',
    503: 'Servicio no disponible. Intenta más tarde'
  };
  
  return messages[error.status] || error.message || 'Error inesperado';
};
```

### 4. Testing Patterns

```javascript
// __tests__/utils/testUtils.js
export const createMockQueryClient = (options = {}) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
        ...options.queries
      },
      mutations: {
        retry: false,
        ...options.mutations
      }
    }
  });
};

export const renderWithQuery = (component, queryClient) => {
  const client = queryClient || createMockQueryClient();
  
  return {
    ...render(
      <QueryClientProvider client={client}>
        {component}
      </QueryClientProvider>
    ),
    queryClient: client
  };
};

// Helpers para tests de mutaciones
export const waitForMutationToFinish = async (result) => {
  await waitFor(() => {
    expect(result.current.isPending).toBe(false);
  });
};
```

---

## 📱 Consideraciones para React Native

### Configuración Específica para Mobile

```javascript
// config/queryClient.native.js
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client-core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo';

export const createNativeQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Configuración más agresiva para mobile
        staleTime: 1 * 60 * 1000, // 1 minuto
        cacheTime: 5 * 60 * 1000, // 5 minutos
        retry: 2, // Menos reintentos
        networkMode: 'offlineFirst', // Prioriza datos cached
        refetchOnReconnect: true, // Refetch al reconectar
        refetchOnMount: 'always', // Siempre refetch al montar
      },
  
      mutations: {
        networkMode: 'offlineFirst',
        retry: 1
      }
    }
  });
  
  // Persistencia con AsyncStorage
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: 'REACT_QUERY_OFFLINE_CACHE',
  });
  
  persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  });

  // Configuración de red para React Native
  NetInfo.configure({
    reachabilityUrl: 'https://clients3.google.com/generate_204',
    reachabilityTest: async (response) => response.status === 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
  });

  return queryClient;
};
```

### Hook para Manejo de Conectividad

```javascript
// hooks/useNetworkStatus.native.js
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-netinfo';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      setConnectionType(state.type);
  
      // Si volvemos a estar online, refetch queries importantes
      if (state.isConnected) {
        queryClient.refetchQueries({
          predicate: (query) => {
            // Solo refetch queries marcadas como críticas
            return query.meta?.refetchOnReconnect === true;
          }
        });
      }
    });

    return unsubscribe;
  }, [queryClient]);

  return {
    isOnline,
    connectionType,
    isWifi: connectionType === 'wifi',
    isCellular: connectionType === 'cellular'
  };
};

// Hook para queries que se adaptan a la conectividad
export const useAdaptiveQuery = (queryKey, queryFn, options = {}) => {
  const { isOnline, isWifi } = useNetworkStatus();
  
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  
    // Adapta configuración según conectividad
    enabled: options.enabled !== false && isOnline,
    refetchInterval: isWifi ? options.refetchInterval : false,
    staleTime: isWifi ? options.staleTime : 10 * 60 * 1000, // Más tiempo si no es wifi
  });
};
```

### Background Sync para Mutaciones

```javascript
// hooks/useBackgroundMutations.native.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_MUTATIONS_KEY = 'pending_mutations';

export const useOfflineMutation = (mutationKey, mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (variables) => {
      try {
        // Intenta ejecutar la mutación
        const result = await mutationFn(variables);
    
        // Si funciona, elimina de pending si estaba ahí
        await removePendingMutation(mutationKey, variables);
    
        return result;
      } catch (error) {
        // Si falla, guarda para ejecutar después
        await savePendingMutation(mutationKey, variables, mutationFn);
        throw error;
      }
    },
    ...options
  });
  
  return mutation;
};

const savePendingMutation = async (key, variables, mutationFn) => {
  try {
    const pending = await AsyncStorage.getItem(PENDING_MUTATIONS_KEY);
    const mutations = pending ? JSON.parse(pending) : [];
  
    mutations.push({
      id: `${key}_${Date.now()}`,
      key,
      variables,
      timestamp: Date.now(),
      retryCount: 0
    });
  
    await AsyncStorage.setItem(PENDING_MUTATIONS_KEY, JSON.stringify(mutations));
  } catch (error) {
    console.error('Error saving pending mutation:', error);
  }
};

const removePendingMutation = async (key, variables) => {
  try {
    const pending = await AsyncStorage.getItem(PENDING_MUTATIONS_KEY);
    if (!pending) return;
  
    const mutations = JSON.parse(pending);
    const filtered = mutations.filter(m => 
      !(m.key === key && JSON.stringify(m.variables) === JSON.stringify(variables))
    );
  
    await AsyncStorage.setItem(PENDING_MUTATIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing pending mutation:', error);
  }
};

// Hook para ejecutar mutaciones pendientes al reconectar
export const usePendingMutationsProcessor = () => {
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (isOnline) {
      processPendingMutations();
    }
  }, [isOnline]);
  
  const processPendingMutations = async () => {
    try {
      const pending = await AsyncStorage.getItem(PENDING_MUTATIONS_KEY);
      if (!pending) return;
  
      const mutations = JSON.parse(pending);
      const successful = [];
  
      for (const mutation of mutations) {
        try {
          // Aquí necesitarías un registry de mutation functions
          await executeMutation(mutation);
          successful.push(mutation.id);
        } catch (error) {
          console.error('Failed to process pending mutation:', error);
      
          // Incrementa retry count
          mutation.retryCount = (mutation.retryCount || 0) + 1;
      
          // Si ha fallado demasiado, elimínalo
          if (mutation.retryCount > 3) {
            successful.push(mutation.id);
          }
        }
      }
  
      // Elimina las exitosas
      const remaining = mutations.filter(m => !successful.includes(m.id));
      await AsyncStorage.setItem(PENDING_MUTATIONS_KEY, JSON.stringify(remaining));
  
      // Invalida queries relacionadas
      queryClient.invalidateQueries();
  
    } catch (error) {
      console.error('Error processing pending mutations:', error);
    }
  };
};
```

---

## 🎯 Optimizaciones Avanzadas

### 1. Query Deduplication Personalizada

```javascript
// utils/customDeduplication.js
export const createDedupedQueryFn = (originalQueryFn) => {
  const pendingQueries = new Map();
  
  return async (context) => {
    const queryKey = JSON.stringify(context.queryKey);
  
    // Si ya hay una query pendiente con la misma key
    if (pendingQueries.has(queryKey)) {
      return pendingQueries.get(queryKey);
    }
  
    // Ejecuta la query y guarda la promesa
    const promise = originalQueryFn(context);
    pendingQueries.set(queryKey, promise);
  
    try {
      const result = await promise;
      pendingQueries.delete(queryKey);
      return result;
    } catch (error) {
      pendingQueries.delete(queryKey);
      throw error;
    }
  };
};

// Uso
const fetchProducts = createDedupedQueryFn(async ({ queryKey }) => {
  const [, filters] = queryKey;
  const response = await fetch(`/api/products?${new URLSearchParams(filters)}`);
  return response.json();
});
```

### 2. Smart Caching Strategy

```javascript
// utils/smartCaching.js
export const createSmartCachingStrategy = () => {
  const getSmartStaleTime = (queryKey, data) => {
    // Datos que cambian frecuentemente
    if (queryKey.includes('realtime') || queryKey.includes('live')) {
      return 30 * 1000; // 30 segundos
    }
  
    // Datos de usuario (cambian ocasionalmente)
    if (queryKey.includes('user') || queryKey.includes('profile')) {
      return 5 * 60 * 1000; // 5 minutos
    }
  
    // Datos de catálogo (cambian raramente)
    if (queryKey.includes('products') || queryKey.includes('categories')) {
      return 15 * 60 * 1000; // 15 minutos
    }
  
    // Configuración y datos estáticos
    if (queryKey.includes('config') || queryKey.includes('settings')) {
      return 60 * 60 * 1000; // 1 hora
    }
  
    // Por defecto
    return 5 * 60 * 1000;
  };
  
  const getSmartCacheTime = (queryKey, data) => {
    // Datos críticos se mantienen más tiempo
    if (queryKey.includes('critical') || queryKey.includes('important')) {
      return 30 * 60 * 1000; // 30 minutos
    }
  
    // Datos grandes se eliminan más rápido
    if (data && JSON.stringify(data).length > 100000) { // > 100KB
      return 2 * 60 * 1000; // 2 minutos
    }
  
    return 10 * 60 * 1000; // 10 minutos por defecto
  };
  
  return {
    getSmartStaleTime,
    getSmartCacheTime
  };
};

// Hook que usa smart caching
export const useSmartQuery = (queryKey, queryFn, options = {}) => {
  const { getSmartStaleTime, getSmartCacheTime } = createSmartCachingStrategy();
  
  return useQuery({
    queryKey,
    queryFn,
    staleTime: getSmartStaleTime(queryKey),
    cacheTime: getSmartCacheTime(queryKey),
    ...options
  });
};
```

### 3. Conditional Fetching Pattern

```javascript
// hooks/useConditionalFetch.js
export const useConditionalFetch = (conditions) => {
  const queryClient = useQueryClient();
  
  const { userPermissions, featureFlags, networkStatus } = conditions;
  
  const shouldFetch = (queryKey, context = {}) => {
    // Verifica permisos
    if (context.requiresPermission) {
      const hasPermission = userPermissions?.includes(context.requiresPermission);
      if (!hasPermission) return false;
    }
  
    // Verifica feature flags
    if (context.featureFlag) {
      const isEnabled = featureFlags?.[context.featureFlag];
      if (!isEnabled) return false;
    }
  
    // Verifica conectividad para datos críticos
    if (context.critical && !networkStatus?.isOnline) {
      return false;
    }
  
    return true;
  };
  
  const conditionalQuery = (queryKey, queryFn, options = {}) => {
    const enabled = shouldFetch(queryKey, options.context) && (options.enabled !== false);
  
    return useQuery({
      queryKey,
      queryFn,
      ...options,
      enabled
    });
  };
  
  return { conditionalQuery, shouldFetch };
};

// Uso
function UserDashboard() {
  const { conditionalQuery } = useConditionalFetch({
    userPermissions: ['read:analytics', 'read:reports'],
    featureFlags: { advancedAnalytics: true },
    networkStatus: { isOnline: true }
  });
  
  const analyticsQuery = conditionalQuery(
    ['analytics'],
    fetchAnalytics,
    {
      context: {
        requiresPermission: 'read:analytics',
        featureFlag: 'advancedAnalytics',
        critical: true
      }
    }
  );
  
  return (
    <div>
      {analyticsQuery.data && <AnalyticsChart data={analyticsQuery.data} />}
    </div>
  );
}
```

---

## 🧪 Patrones de Testing Avanzados

### 1. Mock Server con MSW

```javascript
// __tests__/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // Products
  rest.get('/api/products', (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const limit = req.url.searchParams.get('limit') || '10';
  
    const products = Array.from({ length: parseInt(limit) }, (_, index) => ({
      id: (parseInt(page) - 1) * parseInt(limit) + index + 1,
      name: `Product ${index + 1}`,
      price: 100 + index * 10,
      category: 'electronics'
    }));
  
    return res(
      ctx.status(200),
      ctx.json(products)
    );
  }),
  
  rest.post('/api/products', (req, res, ctx) => {
    const newProduct = req.body;
  
    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now(),
        ...newProduct,
        createdAt: new Date().toISOString()
      })
    );
  }),
  
  // Error scenarios
  rest.get('/api/products/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal server error' })
    );
  })
];

// __tests__/setup.js
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 2. Test Utils Avanzados

```javascript
// __tests__/utils/queryTestUtils.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const createTestQueryClient = (overrides = {}) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
        ...overrides.queries
      },
      mutations: {
        retry: false,
        ...overrides.mutations
      }
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {} // Silencia errores en tests
    }
  });
};

export const renderWithQueryClient = (ui, options = {}) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;
  
  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }
  
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient
  };
};

// Helper para esperar que una query se complete
export const waitForQuery = async (queryClient, queryKey) => {
  await waitFor(() => {
    const query = queryClient.getQueryCache().find(queryKey);
    expect(query?.state.status).toBe('success');
  });
};

// Helper para simular errores de red
export const simulateNetworkError = (server, endpoint) => {
  server.use(
    rest.get(endpoint, (req, res, ctx) => {
      return res.networkError('Failed to connect');
    })
  );
};
```

### 3. Integration Tests

```javascript
// __tests__/integration/ProductManagement.test.js
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithQueryClient, waitForQuery } from '../utils/queryTestUtils';
import { server } from '../setup';
import { rest } from 'msw';
import ProductManagement from '../../components/ProductManagement';

describe('Product Management Integration', () => {
  test('should create, update and delete product successfully', async () => {
    const user = userEvent.setup();
    const { queryClient } = renderWithQueryClient(<ProductManagement />);
  
    // Espera a que carguen los productos iniciales
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });
  
    // Crear nuevo producto
    await user.click(screen.getByText('Crear Producto'));
    await user.type(screen.getByPlaceholderText('Nombre'), 'Test Product');
    await user.type(screen.getByPlaceholderText('Precio'), '299');
    await user.click(screen.getByText('Guardar'));
  
    // Verificar que aparece en la lista
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  
    // Actualizar producto
    const editButton = screen.getByLabelText('Editar Test Product');
    await user.click(editButton);
  
    const nameInput = screen.getByDisplayValue('Test Product');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Product');
    await user.click(screen.getByText('Actualizar'));
  
    // Verificar actualización
    await waitFor(() => {
      expect(screen.getByText('Updated Product')).toBeInTheDocument();
      expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
    });
  
    // Eliminar producto
    const deleteButton = screen.getByLabelText('Eliminar Updated Product');
    await user.click(deleteButton);
    await user.click(screen.getByText('Confirmar'));
  
    // Verificar eliminación
    await waitFor(() => {
      expect(screen.queryByText('Updated Product')).not.toBeInTheDocument();
    });
  });
  
  test('should handle network errors gracefully', async () => {
    // Simula error en la carga inicial
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );
  
    renderWithQueryClient(<ProductManagement />);
  
    // Verifica que se muestra el error
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  
    // Simula recuperación del servidor
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
          { id: 1, name: 'Recovered Product', price: 100 }
        ]));
      })
    );
  
    // Retry
    const retryButton = screen.getByText('Reintentar');
    await userEvent.click(retryButton);
  
    // Verifica recuperación
    await waitFor(() => {
      expect(screen.getByText('Recovered Product')).toBeInTheDocument();
    });
  });
});
```

---

## 🎨 UI Patterns Avanzados

### 1. Optimistic UI con Rollback Visual

```javascript
// components/OptimisticProductCard.js
import { useState } from 'react';
import { useUpdateProduct } from '../hooks/useUpdateProduct';

function OptimisticProductCard({ product }) {
  const [isRollingBack, setIsRollingBack] = useState(false);
  const updateProduct = useUpdateProduct();
  
  const handleToggleFavorite = async () => {
    const previousValue = product.isFavorite;
  
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        updates: { isFavorite: !product.isFavorite }
      });
    } catch (error) {
      // Animación de rollback
      setIsRollingBack(true);
  
      setTimeout(() => {
        setIsRollingBack(false);
      }, 500);
    }
  };
  
  return (
    <div 
      className={`
        product-card 
        ${updateProduct.isPending ? 'opacity-75' : ''}
        ${isRollingBack ? 'animate-shake' : ''}
      `}
    >
      <h3>{product.name}</h3>
      <p>${product.price}</p>
  
      <button
        onClick={handleToggleFavorite}
        disabled={updateProduct.isPending}
        className={`
          heart-button
          ${product.isFavorite ? 'text-red-500' : 'text-gray-400'}
          ${isRollingBack ? 'animate-pulse' : ''}
        `}
      >
        {product.isFavorite ? '❤️' : '🤍'}
      </button>
  
      {updateProduct.error && isRollingBack && (
        <div className="error-toast">
          No se pudo actualizar. Revertido.
        </div>
      )}
    </div>
  );
}
```

### 2. Smart Loading States

```javascript
// hooks/useSmartLoading.js
export const useSmartLoading = (queries) => {
  const isInitialLoading = queries.some(q => q.isLoading && !q.data);
  const isRefreshing = queries.some(q => q.isFetching && q.data);
  const hasError = queries.some(q => q.error);
  const isEmpty = queries.every(q => !q.data || (Array.isArray(q.data) && q.data.length === 0));
  
  return {
    isInitialLoading,
    isRefreshing,
    hasError,
    isEmpty,
    showSkeleton: isInitialLoading,
    showRefreshIndicator: isRefreshing,
    showEmptyState: !isInitialLoading && isEmpty && !hasError,
    showErrorState: hasError && !isRefreshing
  };
};

// Componente con smart loading
function SmartProductList() {
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  
  const {
    showSkeleton,
    showRefreshIndicator,
    showEmptyState,
    showErrorState
  } = useSmartLoading([productsQuery, categoriesQuery]);
  
  if (showSkeleton) {
    return <ProductListSkeleton />;
  }
  
  if (showErrorState) {
    return <ErrorState onRetry={() => {
      productsQuery.refetch();
      categoriesQuery.refetch();
    }} />;
  }
  
  if (showEmptyState) {
    return <EmptyState />;
  }
  
  return (
    <div>
      {showRefreshIndicator && (
        <div className="refresh-indicator">
          Actualizando...
        </div>
      )}
  
      <ProductGrid products={productsQuery.data} />
    </div>
  );
}
```

---

## 🎯 Conclusión: Dominando React Query en el Mundo Real

React Query es mucho más que una librería para hacer peticiones HTTP. Es un **sistema completo de gestión de estado del servidor** que transforma cómo construimos aplicaciones modernas.

### 🏆 Beneficios Clave que Obtienes

**1. Simplicidad que Escala** Como un **arquitecto experimentado**, React Query te da los planos perfectos para construir desde una casa pequeña hasta un rascacielos, sin tener que rehacer los cimientos.

**2. Performance sin Esfuerzo** Es como tener un **asistente personal súper eficiente** que:

* Recuerda todo lo que necesitas (caché inteligente)
* Nunca hace trabajo duplicado (deduplicación)
* Te mantiene informado de cambios importantes (actualizaciones automáticas)
* Predice lo que vas a necesitar (prefetching)

**3. Experiencia de Usuario Superior** Tus usuarios experimentan aplicaciones que se sienten como **aplicaciones nativas**:

* Cargas instantáneas con datos cached
* Actualizaciones optimistas que responden inmediatamente
* Sincronización en tiempo real sin parpadeos
* Funcionamiento fluido incluso offline

### 🎯 Cuándo Usar Cada Patrón

**useQuery**: Tu herramienta diaria para leer datos

* Listas, detalles, configuraciones
* Cualquier dato que viene del servidor

**useMutation**: Para cambiar el estado del mundo

* Crear, actualizar, eliminar
* Cualquier acción que modifica datos

**useInfiniteQuery**: Para datos que nunca terminan

* Feeds sociales, listas de productos, búsquedas
* Cuando la paginación tradicional no es suficiente

**Optimistic Updates**: Para acciones que "siempre funcionan"

* Likes, favoritos, cambios simples
* Cuando la experiencia importa más que la precisión momentánea

### 🚀 Tu Camino hacia la Maestría

**Nivel Principiante**: Domina useQuery y useMutation básicos **Nivel Intermedio**: Implementa optimistic updates y manejo de errores **Nivel Avanzado**: Crea patrones personalizados y optimizaciones de performance **Nivel Experto**: Construye sistemas complejos con sincronización en tiempo real

### 🎪 Analogía Final: React Query como un Director de Orquesta

Imagina que tu aplicación es una **orquesta sinfónica**:

* **Los músicos** son tus componentes
* **Las partituras** son los datos del servidor
* **React Query es el director** que:
  * Coordina cuándo cada músico debe tocar (cuándo hacer fetch)
  * Se asegura de que todos tengan la partitura correcta (caché sincronizado)
  * Adapta la interpretación en tiempo real (actualizaciones automáticas)
  * Mantiene la armonía incluso cuando algo sale mal (error handling)

Sin React Query, cada músico tendría que adivinar cuándo tocar y qué tocar. Con React Query, tienes una sinfonía perfectamente coordinada.

### 🎯 Llamada a la Acción

Ahora tienes el conocimiento para transformar tus aplicaciones React. Comienza con algo simple:

1. **Reemplaza un useState + useEffect** con useQuery
2. **Implementa tu primera mutación optimista**
3. **Agrega manejo de errores global**
4. **Experimenta con sincronización en tiempo real**

Recuerda: React Query no es solo una librería, es una **nueva forma de pensar** sobre el estado en aplicaciones modernas. Una vez que lo domines, no podrás imaginar desarrollar sin él.

¡Ahora ve y construye aplicaciones increíbles! 🚀

---

*"El código más elegante es el que no necesitas escribir"* - React Query te permite escribir menos código y lograr más resultados. Es la diferencia entre ser un desarrollador que lucha contra la complejidad y uno que la abraza con las herramientas correctas.
