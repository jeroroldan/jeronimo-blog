---
title: 'Arquitectura Frontend Escalable'
code:"frontend"
description: 'Masterclass: Arquitectura Frontend Escalable'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Masterclass: Arquitectura Frontend Escalable

## React & React Native - De Principiante a Arquitecto Senior

---

## Introducción: El Dilema del Arquitecto Moderno

Imagina que estás construyendo una ciudad. Puedes empezar poniendo casas al azar, pero cuando lleguen 100,000 habitantes, el caos será inevitable. Las aplicaciones modernas enfrentan el mismo desafío: lo que funciona para 10 componentes puede colapsar con 1000.

**La Realidad Brutal:** El 70% de los proyectos frontend fallan no por falta de funcionalidades, sino por arquitectura deficiente que se vuelve imposible de mantener.

---

## CAPÍTULO 1: Los Pilares de la Arquitectura Moderna

### 1.1 Principios Fundamentales

#### Flujo Unidireccional de Datos

**Concepto:** Los datos fluyen en una sola dirección, como un río que nunca va hacia atrás.

```javascript
// ❌ MALO: Flujo bidireccional caótico
function BadComponent({ user, updateUser }) {
  // El componente modifica directamente el estado del padre
  const handleClick = () => {
    user.name = "Nuevo nombre"; // ¡Mutación directa!
    updateUser(user);
  };
}

// ✅ BUENO: Flujo unidireccional claro
function GoodComponent({ user, onUserUpdate }) {
  const handleClick = () => {
    // Emite una acción, no modifica directamente
    onUserUpdate({ ...user, name: "Nuevo nombre" });
  };
}
```

#### Separación de Responsabilidades

**Analogía:** Como una cocina profesional donde el chef no lava platos y el lavaplatos no cocina.

```javascript
// ❌ MALO: Componente que hace de todo
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Lógica de API mezclada con UI
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser)
      .catch(setError);
  }, [userId]);
  
  // Validación mezclada
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  
  // Renderizado mezclado con lógica
  return (
    <div>
      {loading && <Spinner />}
      {error && <Error message={error.message} />}
      {user && (
        <div>
          <h1>{user.name}</h1>
          <p style={{ color: isValidEmail(user.email) ? 'green' : 'red' }}>
            {user.email}
          </p>
        </div>
      )}
    </div>
  );
}

// ✅ BUENO: Responsabilidades separadas
// Hook personalizado para lógica de datos
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!userId) return;
  
    setLoading(true);
    userService.getUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}

// Utilidad de validación separada
const validators = {
  email: (email) => /\S+@\S+\.\S+/.test(email),
};

// Componente enfocado solo en presentación
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <EmptyState />;
  
  return <UserCard user={user} />;
}
```

---

## CAPÍTULO 2: Arquitecturas de Estado Global

### 2.1 Context API + useReducer: La Base Sólida

**Cuándo usar:** Aplicaciones pequeñas a medianas (< 50 componentes que necesitan estado global)

```javascript
// Estado y acciones tipadas
const initialState = {
  user: null,
  theme: 'light',
  notifications: [],
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
  
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
  
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
  
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
  
    default:
      return state;
  }
}

// Contexto y provider
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Actions creators encapsulados
  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    addNotification: (notification) => dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id: Date.now() }
    }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  };
  
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}

// Uso en componentes
function UserDashboard() {
  const { state, actions } = useApp();
  const { user, loading } = state;
  
  useEffect(() => {
    if (!user) {
      actions.setLoading(true);
      userService.getCurrentUser()
        .then(actions.setUser)
        .catch(actions.setError);
    }
  }, [user]);
  
  return (
    <div>
      {loading ? <Skeleton /> : <UserInfo user={user} />}
    </div>
  );
}
```

### 2.2 Zustand: La Elegancia Minimalista

**Cuándo usar:** Cuando quieres simplicidad sin sacrificar poder. Ideal para equipos que valoran la productividad.

```javascript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Store principal con middleware
export const useAppStore = create(
  subscribeWithSelector((set, get) => ({
    // Estado
    user: null,
    notifications: [],
    theme: 'light',
  
    // Acciones síncronas
    setUser: (user) => set({ user }),
    setTheme: (theme) => set({ theme }),
  
    // Acciones asíncronas
    login: async (credentials) => {
      set({ loading: true });
      try {
        const user = await authService.login(credentials);
        set({ user, loading: false });
        return user;
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },
  
    // Acciones complejas
    addNotification: (notification) => set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID(), timestamp: Date.now() }
      ]
    })),
  
    removeNotification: (id) => set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  
    // Computed values (getters)
    get unreadNotifications() {
      return get().notifications.filter(n => !n.read).length;
    }
  }))
);

// Stores especializados para dominios específicos
export const useCartStore = create((set, get) => ({
  items: [],
  
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),
  
  get total() {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  get itemCount() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));

// Hooks especializados para casos de uso específicos
export function useAuth() {
  const user = useAppStore(state => state.user);
  const login = useAppStore(state => state.login);
  const logout = useAppStore(state => state.logout);
  
  return {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
}

// Uso en componentes
function ShoppingCart() {
  const { items, total, addItem, removeItem } = useCartStore();
  const itemCount = useCartStore(state => state.itemCount);
  
  return (
    <div>
      <h2>Carrito ({itemCount} items)</h2>
      {items.map(item => (
        <CartItem 
          key={item.id} 
          item={item} 
          onRemove={removeItem}
        />
      ))}
      <div>Total: ${total}</div>
    </div>
  );
}
```

### 2.3 Redux Toolkit: La Artillería Pesada

**Cuándo usar:** Aplicaciones empresariales complejas con múltiples desarrolladores y necesidades de debugging avanzado.

```javascript
// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks asíncronos
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch user cases
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

// Hooks tipados
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Uso en componentes
function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  
  const handleSubmit = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Redirigir en caso de éxito
    } catch (error) {
      // Error ya está en el estado
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorMessage message={error} />}
      <button disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

---

## CAPÍTULO 3: Arquitectura de Datos y APIs

### 3.1 El Patrón Repository

**Analogía:** Como un bibliotecario que sabe exactamente dónde encontrar cualquier libro, sin importar si está en el estante, el archivo o prestado.

```javascript
// repositories/BaseRepository.js
class BaseRepository {
  constructor(apiClient, baseURL) {
    this.api = apiClient;
    this.baseURL = baseURL;
  }
  
  async findAll(params = {}) {
    const response = await this.api.get(this.baseURL, { params });
    return response.data;
  }
  
  async findById(id) {
    const response = await this.api.get(`${this.baseURL}/${id}`);
    return response.data;
  }
  
  async create(data) {
    const response = await this.api.post(this.baseURL, data);
    return response.data;
  }
  
  async update(id, data) {
    const response = await this.api.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }
  
  async delete(id) {
    const response = await this.api.delete(`${this.baseURL}/${id}`);
    return response.data;
  }
}

// repositories/UserRepository.js
class UserRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, '/users');
  }
  
  async findByEmail(email) {
    const response = await this.api.get(`${this.baseURL}/search`, {
      params: { email }
    });
    return response.data;
  }
  
  async updateProfile(userId, profileData) {
    const response = await this.api.patch(`${this.baseURL}/${userId}/profile`, profileData);
    return response.data;
  }
  
  async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);
  
    const response = await this.api.post(
      `${this.baseURL}/${userId}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }
}

// services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptores para manejo automático de tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, limpiar y redirigir
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// services/index.js - Factory de repositorios
import apiClient from './apiClient';
import UserRepository from '../repositories/UserRepository';
import ProductRepository from '../repositories/ProductRepository';

export const userRepository = new UserRepository(apiClient);
export const productRepository = new ProductRepository(apiClient);
```

### 3.2 React Query: El Cache Inteligente

**Analogía:** Como tener un asistente personal que recuerda todo lo que has preguntado y te da respuestas instantáneas, pero también sabe cuándo necesita hacer nuevas preguntas.

```javascript
// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userRepository } from '../services';

export function useUsers(filters = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userRepository.findAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => userRepository.findById(userId),
    enabled: !!userId, // Solo ejecutar si tenemos ID
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userRepository.create,
    onSuccess: (newUser) => {
      // Invalidar cache de usuarios
      queryClient.invalidateQueries({ queryKey: ['users'] });
  
      // Optimistic update: agregar el usuario al cache
      queryClient.setQueryData(['users', newUser.id], newUser);
  
      // Mostrar notificación
      toast.success('Usuario creado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear usuario');
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => userRepository.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', id] });
  
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['users', id]);
  
      // Optimistically update
      queryClient.setQueryData(['users', id], old => ({ ...old, ...data }));
  
      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['users', variables.id], context.previousUser);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    }
  });
}

// Uso en componentes
function UserList() {
  const [filters, setFilters] = useState({});
  const { data: users, isLoading, error } = useUsers(filters);
  const createUser = useCreateUser();
  
  if (isLoading) return <UserListSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <UserFilters onFiltersChange={setFilters} />
      <UserGrid users={users} />
      <CreateUserModal 
        onSubmit={createUser.mutate}
        isLoading={createUser.isPending}
      />
    </div>
  );
}

function UserProfile({ userId }) {
  const { data: user, isLoading } = useUser(userId);
  const updateUser = useUpdateUser();
  
  const handleSave = (userData) => {
    updateUser.mutate({ id: userId, data: userData });
  };
  
  if (isLoading) return <ProfileSkeleton />;
  
  return (
    <UserForm 
      user={user}
      onSave={handleSave}
      isSaving={updateUser.isPending}
    />
  );
}
```

### 3.3 Patrón de Servicios con Caché Local

```javascript
// services/UserService.js
class UserService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutos
  }
  
  async getUser(userId, options = {}) {
    const cacheKey = `user:${userId}`;
    const cached = this.cache.get(cacheKey);
  
    // Verificar cache válido
    if (cached && !options.force && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
  
    try {
      const user = await userRepository.findById(userId);
  
      // Guardar en cache
      this.cache.set(cacheKey, {
        data: user,
        timestamp: Date.now()
      });
  
      return user;
    } catch (error) {
      // Si hay error y tenemos cache, devolver cache
      if (cached && !options.force) {
        return cached.data;
      }
      throw error;
    }
  }
  
  async updateUser(userId, userData) {
    const updatedUser = await userRepository.update(userId, userData);
  
    // Actualizar cache
    const cacheKey = `user:${userId}`;
    this.cache.set(cacheKey, {
      data: updatedUser,
      timestamp: Date.now()
    });
  
    // Notificar a otros componentes
    this.notifyUserUpdate(updatedUser);
  
    return updatedUser;
  }
  
  notifyUserUpdate(user) {
    // EventEmitter pattern para notificaciones
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
  }
  
  clearCache(pattern) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export const userService = new UserService();
```

---

## CAPÍTULO 4: Arquitectura de Componentes Escalables

### 4.1 Patrón Compound Components

**Analogía:** Como un sistema de sonido donde cada pieza (amplificador, bocinas, ecualizador) funciona independientemente pero juntas crean una experiencia cohesiva.

```javascript
// components/DataTable/DataTable.jsx
const DataTableContext = createContext();

function DataTable({ data, onSelectionChange, children }) {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState({});
  
  // Lógica de filtrado y ordenamiento
  const processedData = useMemo(() => {
    let result = [...data];
  
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => 
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });
  
    // Aplicar ordenamiento
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
    
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  
    return result;
  }, [data, filters, sortConfig]);
  
  const contextValue = {
    data: processedData,
    selectedRows,
    setSelectedRows,
    sortConfig,
    setSortConfig,
    filters,
    setFilters,
    onSelectionChange
  };
  
  return (
    <DataTableContext.Provider value={contextValue}>
      <div className="data-table">
        {children}
      </div>
    </DataTableContext.Provider>
  );
}

// Subcomponentes
DataTable.Header = function DataTableHeader({ children }) {
  return <div className="data-table-header">{children}</div>;
};

DataTable.Filters = function DataTableFilters({ children }) {
  const { filters, setFilters } = useContext(DataTableContext);
  
  return (
    <div className="data-table-filters">
      {React.Children.map(children, child =>
        React.cloneElement(child, { filters, setFilters })
      )}
    </div>
  );
};

DataTable.Table = function DataTableTable({ children }) {
  return (
    <table className="data-table-table">
      {children}
    </table>
  );
};

DataTable.Head = function DataTableHead({ children }) {
  return <thead>{children}</thead>;
};

DataTable.Body = function DataTableBody({ children }) {
  const { data } = useContext(DataTableContext);
  
  return (
    <tbody>
      {data.map((row, index) =>
        React.Children.map(children, child =>
          React.cloneElement(child, { key: index, row, index })
        )
      )}
    </tbody>
  );
};

DataTable.Column = function DataTableColumn({ 
  dataKey, 
  title, 
  sortable = false, 
  render,
  width 
}) {
  const { sortConfig, setSortConfig } = useContext(DataTableContext);
  
  const handleSort = () => {
    if (!sortable) return;
  
    setSortConfig(prev => ({
      key: dataKey,
      direction: prev?.key === dataKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  return (
    <th 
      style={{ width }}
      className={sortable ? 'sortable' : ''}
      onClick={handleSort}
    >
      {title}
      {sortable && sortConfig?.key === dataKey && (
        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );
};

DataTable.Row = function DataTableRow({ row, children }) {
  const { selectedRows, setSelectedRows } = useContext(DataTableContext);
  const isSelected = selectedRows.has(row.id);
  
  return (
    <tr className={isSelected ? 'selected' : ''}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { row })
      )}
    </tr>
  );
};

DataTable.Cell = function DataTableCell({ dataKey, render, row }) {
  const value = row[dataKey];
  
  return (
    <td>
      {render ? render(value, row) : value}
    </td>
  );
};

// Uso del componente compuesto
function UserTable({ users }) {
  return (
    <DataTable data={users}>
      <DataTable.Header>
        <h2>Usuarios</h2>
        <DataTable.Filters>
          <FilterInput field="name" placeholder="Buscar por nombre..." />
          <FilterSelect field="status" options={['active', 'inactive']} />
        </DataTable.Filters>
      </DataTable.Header>
  
      <DataTable.Table>
        <DataTable.Head>
          <DataTable.Row>
            <DataTable.Column dataKey="name" title="Nombre" sortable />
            <DataTable.Column dataKey="email" title="Email" sortable />
            <DataTable.Column dataKey="status" title="Estado" />
            <DataTable.Column dataKey="actions" title="Acciones" />
          </DataTable.Row>
        </DataTable.Head>
    
        <DataTable.Body>
          <DataTable.Row>
            <DataTable.Cell dataKey="name" />
            <DataTable.Cell dataKey="email" />
            <DataTable.Cell 
              dataKey="status" 
              render={(status) => (
                <Badge variant={status === 'active' ? 'success' : 'secondary'}>
                  {status}
                </Badge>
              )}
            />
            <DataTable.Cell 
              dataKey="actions"
              render={(_, user) => (
                <div>
                  <Button size="sm" onClick={() => editUser(user)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteUser(user.id)}>
                    Eliminar
                  </Button>
                </div>
              )}
            />
          </DataTable.Row>
        </DataTable.Body>
      </DataTable.Table>
    </DataTable>
  );
}
```

### 4.2 Patrón Render Props con Hooks

```javascript
// hooks/useAsync.js
function useAsync(asyncFunction, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });
  
  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
  
    try {
      const result = await asyncFunction(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, dependencies);
  
  return { ...state, execute };
}

// components/AsyncRenderer.jsx
function AsyncRenderer({ 
  asyncFunction, 
  dependencies = [], 
  children, 
  loadingComponent: Loading = DefaultLoading,
  errorComponent: ErrorComponent = DefaultError 
}) {
  const { data, loading, error, execute } = useAsync(asyncFunction, dependencies);
  
  useEffect(() => {
    execute();
  }, [execute]);
  
  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} onRetry={execute} />;
  
  return children({ data, reload: execute });
}

// Uso con render props
function UserDashboard() {
  return (
    <AsyncRenderer 
      asyncFunction={userService.getCurrentUser}
      loadingComponent={() => <UserSkeleton />}
      errorComponent={({ error, onRetry }) => (
        <ErrorBoundary error={error} onRetry={onRetry} />
      )}
    >
      {({ data: user, reload }) => (
        <div>
          <UserProfile user={user} />
          <UserActions onUpdate={reload} />
        </div>
      )}
    </AsyncRenderer>
  );
}
```

---

## CAPÍTULO 5: Patrones de Performance y Optimización

### 5.1 Virtualización Inteligente

```javascript
// components/VirtualList.jsx
import { FixedSizeList as List, areEqual } from 'react-window';

// Componente optimizado con React.memo
const ListItem = memo(({ index, style, data }) => {
  const item = data.items[index];
  const { onItemClick, renderItem } = data;
  
  return (
    <div style={style} onClick={() => onItemClick(item)}>
      {renderItem(item, index)}
    </div>
  );
}, areEqual);

function VirtualList({ 
  items, 
  itemHeight = 50, 
  height = 400,
  renderItem,
  onItemClick = () => {},
  overscanCount = 5 
}) {
  const itemData = {
    items,
    onItemClick,
    renderItem
  };
  
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={itemData}
      overscanCount={overscanCount}
    >
      {ListItem}
    </List>
  );
}

// Uso con 10,000 elementos
function UserList() {
  const [users] = useState(() => generateUsers(10000));
  
  const renderUser = useCallback((user) => (
    <div className="user-item">
      <Avatar src={user.avatar} />
      <div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  ), []);
  
  return (
    <VirtualList
      items={users}
      itemHeight={80}
      height={600}
      renderItem={renderUser}
      onItemClick={(user) => navigateToUser(user.id)}
    />
  );
}
```

### 5.2 Patrón de Code Splitting Inteligente

```javascript
// utils/lazyImport.js
export function lazyImport(factory, name) {
  return lazy(() =>
    factory().then(module => ({ default: module[name] }))
  );
}

// Lazy loading con error boundaries
const UserDashboard = lazyImport(() => import('../pages/UserDashboard'), 'UserDashboard');
const AdminPanel = lazyImport(() => import('../pages/AdminPanel'), 'AdminPanel');
const Settings = lazyImport(() => import('../pages/Settings'), 'Settings');

// components/LazyRoute.jsx
function LazyRoute({ component: Component, fallback, ...props }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <PageSkeleton />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// router/AppRouter.jsx
function AppRouter() {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={<LazyRoute component={UserDashboard} />} 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <LazyRoute component={AdminPanel} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={<LazyRoute component={Settings} />} 
      />
    </Routes>
  );
}
```

### 5.3 Memoización Estratégica

```javascript
// hooks/useMemoizedSelectors.js
function useUserStats(userId) {
  return useMemo(() => {
    const user = useAppSelector(state => 
      state.users.entities[userId]
    );
  
    if (!user) return null;
  
    const stats = {
      totalPosts: user.posts?.length || 0,
      totalLikes: user.posts?.reduce((sum, post) => sum + post.likes, 0) || 0,
      avgLikesPerPost: 0,
      joinedDate: new Date(user.createdAt).toLocaleDateString()
    };
  
    stats.avgLikesPerPost = stats.totalPosts > 0 
      ? (stats.totalLikes / stats.totalPosts).toFixed(1) 
      : 0;
  
    return stats;
  }, [userId]);
}

// Componente optimizado
const UserCard = memo(({ userId, onEdit, onDelete }) => {
  const user = useAppSelector(state => state.users.entities[userId]);
  const stats = useUserStats(userId);
  
  // Memoizar callbacks para evitar re-renders
  const handleEdit = useCallback(() => onEdit(user), [onEdit, user]);
  const handleDelete = useCallback(() => onDelete(userId), [onDelete, userId]);
  
  if (!user) return null;
  
  return (
    <div className="user-card">
      <UserAvatar user={user} />
      <UserInfo user={user} stats={stats} />
      <UserActions onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
});

// Selector optimizado con createSelector
import { createSelector } from '@reduxjs/toolkit';

const selectUsersByStatus = createSelector(
  [state => state.users.entities, (state, status) => status],
  (entities, status) => 
    Object.values(entities).filter(user => user.status === status)
);

function ActiveUsersList() {
  const activeUsers = useAppSelector(state => 
    selectUsersByStatus(state, 'active')
  );
  
  return (
    <div>
      {activeUsers.map(user => (
        <UserCard key={user.id} userId={user.id} />
      ))}
    </div>
  );
}
```

---

## CAPÍTULO 6: React Native - Arquitectura Móvil Escalable

### 6.1 Navegación Robusta

```javascript
// navigation/AppNavigator.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configuración de navegación persistente
const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:userId',
      Settings: 'settings',
    },
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Search: 'search',
            Profile: 'person'
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuth();
  
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 6.2 Gestión de Estado Offline

```javascript
// hooks/useOfflineSync.js
import NetInfo from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState([]);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
  
      if (state.isConnected) {
        syncPendingActions();
      }
    });
  
    loadPendingActions();
  
    return unsubscribe;
  }, []);
  
  const addPendingAction = async (action) => {
    const updated = [...pendingActions, action];
    setPendingActions(updated);
    await AsyncStorage.setItem('pendingActions', JSON.stringify(updated));
  };
  
  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;
  
    try {
      for (const action of pendingActions) {
        await executeAction(action);
      }
  
      setPendingActions([]);
      await AsyncStorage.removeItem('pendingActions');
    } catch (error) {
      console.error('Error syncing actions:', error);
    }
  };
  
  const loadPendingActions = async () => {
    try {
      const stored = await AsyncStorage.getItem('pendingActions');
      if (stored) {
        setPendingActions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading pending actions:', error);
    }
  };
  
  return {
    isOnline,
    pendingActions,
    addPendingAction,
    syncPendingActions
  };
}

// stores/offlineStore.js
export const useOfflineStore = create((set, get) => ({
  cachedData: {},
  
  cacheData: (key, data) => set(state => ({
    cachedData: { ...state.cachedData, [key]: data }
  })),
  
  getCachedData: (key) => get().cachedData[key],
  
  createOfflineAction: async (action) => {
    const offlineAction = {
      id: Date.now().toString(),
      ...action,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
  
    // Guardar en AsyncStorage para persistencia
    const stored = await AsyncStorage.getItem('offlineActions');
    const actions = stored ? JSON.parse(stored) : [];
    actions.push(offlineAction);
    await AsyncStorage.setItem('offlineActions', JSON.stringify(actions));
  
    return offlineAction;
  }
}));
```

### 6.3 Optimización de Performance

```javascript
// components/OptimizedFlatList.jsx
import { FlashList } from '@shopify/flash-list';

const OptimizedUserList = memo(({ users, onUserPress }) => {
  const keyExtractor = useCallback((item) => item.id, []);
  
  const renderUser = useCallback(({ item }) => (
    <UserItem user={item} onPress={onUserPress} />
  ), [onUserPress]);
  
  const getItemType = useCallback((item) => {
    return item.isPremium ? 'premium' : 'regular';
  }, []);
  
  return (
    <FlashList
      data={users}
      renderItem={renderUser}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      estimatedItemSize={80}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
    />
  );
});

// Componente de item optimizado
const UserItem = memo(({ user, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(user);
  }, [user, onPress]);
  
  return (
    <Pressable 
      onPress={handlePress}
      style={({ pressed }) => [
        styles.userItem,
        pressed && styles.userItemPressed
      ]}
    >
      <FastImage
        source={{ uri: user.avatar }}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
    </Pressable>
  );
});
```

---

## CAPÍTULO 7: Testing de Arquitecturas Complejas

### 7.1 Testing de Estado Global

```javascript
// __tests__/stores/userStore.test.js
import { renderHook, act } from '@testing-library/react';
import { useUserStore } from '../stores/userStore';

describe('UserStore', () => {
  beforeEach(() => {
    useUserStore.getState().reset();
  });
  
  it('should handle user login flow', async () => {
    const { result } = renderHook(() => useUserStore());
  
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' });
    });
  
    expect(result.current.user).toMatchObject({
      email: 'test@test.com'
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
  
  it('should handle optimistic updates correctly', async () => {
    const { result } = renderHook(() => useUserStore());
  
    // Setup initial user
    act(() => {
      result.current.setUser({ id: 1, name: 'John', email: 'john@test.com' });
    });
  
    // Start optimistic update
    act(() => {
      result.current.updateUserOptimistic(1, { name: 'Jane' });
    });
  
    expect(result.current.user.name).toBe('Jane');
  
    // Simulate API failure
    await act(async () => {
      try {
        await result.current.confirmUpdate(1, new Error('API Error'));
      } catch (error) {
        // Should rollback
      }
    });
  
    expect(result.current.user.name).toBe('John');
  });
});
```

### 7.2 Integration Testing

```javascript
// __tests__/integration/userFlow.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProviders } from '../providers/AppProviders';
import App from '../App';

const renderWithProviders = (ui) => {
  return render(
    <AppProviders>
      {ui}
    </AppProviders>
  );
};

describe('User Management Flow', () => {
  it('should complete full user CRUD cycle', async () => {
    const user = userEvent.setup();
  
    renderWithProviders(<App />);
  
    // Navigate to users page
    await user.click(screen.getByRole('link', { name: /users/i }));
  
    // Create new user
    await user.click(screen.getByRole('button', { name: /add user/i }));
  
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  
    await user.click(screen.getByRole('button', { name: /save/i }));
  
    // Verify user appears in list
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  
    // Edit user
    await user.click(screen.getByRole('button', { name: /edit john doe/i }));
  
    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Doe');
  
    await user.click(screen.getByRole('button', { name: /update/i }));
  
    // Verify update
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  
    // Delete user
    await user.click(screen.getByRole('button', { name: /delete jane doe/i }));
    await user.click(screen.getByRole('button', { name: /confirm/i }));
  
    // Verify deletion
    await waitFor(() => {
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });
});
```

---

## CAPÍTULO 8: Monitoreo y Debugging

### 8.1 Error Boundary Avanzado

```javascript
// components/ErrorBoundary.jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  
    // Enviar error a servicio de monitoreo
    this.logErrorToService
```
