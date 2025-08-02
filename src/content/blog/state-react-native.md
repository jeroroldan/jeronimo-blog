---
title: 'Estado Global en React Native'
code: 'react-native'
description: 'Guía Completa: Estado Global en React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa: Estado Global en React Native

## Context API, Zustand y Redux con Arquitectura Limpia

## 🏠 ¿Qué es el Estado Global? - La Analogía de la Casa Inteligente

Imagina tu aplicación React Native como una **casa inteligente moderna** donde cada pantalla es una habitación diferente:

- **Sala**: Pantalla principal donde ves el resumen
- **Cocina**: Pantalla de pedidos de comida
- **Dormitorio**: Pantalla de perfil del usuario
- **Garage**: Pantalla de configuración

El **estado global** es como el **sistema nervioso central** de la casa que permite que todas las habitaciones se comuniquen y compartan información instantáneamente.

### 🔄 Los Tres Enfoques Principales


| Enfoque           | Analogía                            | Cuándo Usar                               | Complejidad |
| ----------------- | ------------------------------------ | ------------------------------------------ | ----------- |
| **Context API**   | Sistema de intercomunicador familiar | Apps pequeñas-medianas, equipos pequeños | Baja        |
| **Zustand**       | Asistente personal eficiente         | Apps medianas, equipos ágiles             | Media       |
| **Redux Toolkit** | Sistema corporativo enterprise       | Apps grandes, equipos grandes              | Alta        |

---

## 🗣️ Context API - El Sistema Familiar

**Analogía**: *Como el intercomunicador de una casa familiar donde todos pueden escuchar los anuncios importantes*

### Paso 1: Configuración Básica del Context

```typescript
// src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos - como las reglas de comunicación de la familia
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: boolean;
  };
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
}

interface AppState {
  // Estado del usuario - como la información personal de cada miembro de la familia
  user: User | null;
  isAuthenticated: boolean;
  
  // Estado del carrito - como la lista de compras familiar
  cart: CartItem[];
  cartTotal: number;
  
  // Estado de la UI - como el ambiente general de la casa
  isLoading: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: Date;
  }>;
}

// Estado inicial - como la configuración por defecto de la casa
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  cartTotal: 0,
  isLoading: false,
  notifications: [],
};

// Acciones - como los tipos de anuncios que se pueden hacer por el intercomunicador
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Reducer - como el cerebro de la casa que procesa todos los anuncios
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      console.log('👤 Usuario conectado:', action.payload.name);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'LOGOUT':
      console.log('👋 Usuario desconectado');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [], // Limpiar carrito al cerrar sesión
      };

    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      let newCart: CartItem[];
    
      if (existingItem) {
        // Si ya existe, incrementar cantidad - como agregar más del mismo item a la lista
        newCart = state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Agregar nuevo item - como anotar algo nuevo en la lista
        newCart = [...state.cart, action.payload];
      }
    
      const newTotal = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
      console.log(`🛒 Agregado al carrito: ${action.payload.name} (Total: $${newTotal})`);
    
      return {
        ...state,
        cart: newCart,
        cartTotal: newTotal,
      };

    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter(item => item.id !== action.payload);
      const updatedTotal = filteredCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
      console.log(`🗑️ Removido del carrito (Total: $${updatedTotal})`);
    
      return {
        ...state,
        cart: filteredCart,
        cartTotal: updatedTotal,
      };

    case 'UPDATE_CART_QUANTITY':
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remover items con cantidad 0
    
      const recalculatedTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
      return {
        ...state,
        cart: updatedCart,
        cartTotal: recalculatedTotal,
      };

    case 'CLEAR_CART':
      console.log('🧹 Carrito vaciado');
      return {
        ...state,
        cart: [],
        cartTotal: 0,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'ADD_NOTIFICATION':
      const notification = {
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: new Date(),
      };
    
      return {
        ...state,
        notifications: [...state.notifications, notification],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    default:
      return state;
  }
};

// Context - como el canal de comunicación de la familia
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider - como la instalación del sistema de intercomunicador
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado - como tener un control remoto del intercomunicador
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  
  return context;
};

// Hooks especializados - como controles específicos para cada función
export const useAuth = () => {
  const { state, dispatch } = useApp();
  
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
  
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
    
      const user: User = {
        id: '1',
        name: 'María González',
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        preferences: {
          theme: 'light',
          language: 'es',
          notifications: true,
        },
      };
    
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: '¡Bienvenido de vuelta!', type: 'success' }
      });
    
    } catch (error) {
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message: 'Error al iniciar sesión', type: 'error' }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { message: 'Sesión cerrada correctamente', type: 'info' }
    });
  };
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
  };
};

export const useCart = () => {
  const { state, dispatch } = useApp();
  
  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { ...item, quantity }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_CART_QUANTITY', 
      payload: { id: itemId, quantity }
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return {
    cart: state.cart,
    cartTotal: state.cartTotal,
    itemCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
```

### Paso 2: Configuración en App Principal

```typescript
// App.tsx
import React from 'react';
import { AppProvider } from './src/contexts/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    // Envolver toda la app con el Provider - como instalar el intercomunicador en toda la casa
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
```

### Paso 3: Uso en Componentes

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth, useCart } from '../contexts/AppContext';

const HomeScreen: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const { addToCart, itemCount } = useCart();
  
  // Productos de ejemplo - como el menú del restaurante
  const products = [
    { id: '1', name: 'Pizza Margherita', price: 15.99, restaurant: 'Italian Bistro' },
    { id: '2', name: 'Hamburguesa Clásica', price: 12.99, restaurant: 'Burger House' },
    { id: '3', name: 'Sushi Variado', price: 22.99, restaurant: 'Tokyo Sushi' },
  ];
  
  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      restaurant: product.restaurant,
    });
  };
  
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🍽️ Food Delivery</Text>
        <Text style={styles.subtitle}>Inicia sesión para ver el menú</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => login('maria@ejemplo.com', 'password123')}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Hola, {user?.name}! 👋</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartText}>🛒 {itemCount}</Text>
        </View>
      </View>
    
      <Text style={styles.sectionTitle}>🍕 Productos Destacados</Text>
    
      {products.map(product => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.restaurantName}>{product.restaurant}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddToCart(product)}
          >
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  cartBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
```

---

## 🎯 Zustand - El Asistente Personal Eficiente

**Analogía**: *Como un asistente personal súper eficiente que conoce todo sobre ti y te ayuda sin complicaciones*

### Paso 1: Instalación y Configuración Básica

```bash
npm install zustand
# o
yarn add zustand
```

### Paso 2: Creación de Stores Especializados

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: boolean;
  };
}

interface AuthState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Acciones - como comandos que le das a tu asistente personal
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  
  // Getters computados - como preguntas que le haces a tu asistente
  getDisplayName: () => string;
  isProfileComplete: () => boolean;
}

// Store de autenticación - como la libreta personal de tu asistente
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    
      // Acción de login - como pedirle a tu asistente que verifique tu identidad
      login: async (email: string, password: string) => {
        set({ isLoading: true });
      
        try {
          console.log('🔐 Iniciando sesión para:', email);
        
          // Simular llamada a API
          await new Promise(resolve => setTimeout(resolve, 1500));
        
          // Simular respuesta exitosa
          const userData: User = {
            id: '1',
            name: 'María González',
            email: email,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            preferences: {
              theme: 'light',
              language: 'es',
              notifications: true,
            },
          };
        
          const token = 'jwt_token_here_' + Date.now();
        
          set({ 
            user: userData, 
            isAuthenticated: true, 
            token,
            isLoading: false 
          });
        
          console.log('✅ Login exitoso para:', userData.name);
        
        } catch (error) {
          console.error('❌ Error en login:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    
      // Acción de logout - como pedirle a tu asistente que olvide tu información
      logout: () => {
        console.log('👋 Cerrando sesión');
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null 
        });
      },
    
      // Actualizar perfil - como darle nueva información a tu asistente
      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          console.log('👤 Perfil actualizado:', updates);
        }
      },
    
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    
      // Getter para nombre de display - como preguntarle a tu asistente cómo presentarte
      getDisplayName: () => {
        const user = get().user;
        return user?.name || 'Usuario';
      },
    
      // Verificar si el perfil está completo
      isProfileComplete: () => {
        const user = get().user;
        return !!(user?.name && user?.email && user?.avatar);
      },
    }),
    {
      name: 'auth-storage', // Clave para AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir datos importantes
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);
```

```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  image?: string;
}

interface CartState {
  // Estado
  items: CartItem[];
  isOpen: boolean;
  lastAddedItem: CartItem | null;
  
  // Acciones
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Getters computados
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => CartItem | undefined;
  isEmpty: () => boolean;
  getRestaurants: () => string[];
}

export const useCartStore = create<CartState>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    items: [],
    isOpen: false,
    lastAddedItem: null,
  
    // Agregar item - como pedirle a tu asistente que anote algo en tu lista de compras
    addItem: (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
      
        let newItems: CartItem[];
        let addedItem: CartItem;
      
        if (existingItem) {
          // Si ya existe, incrementar cantidad
          newItems = state.items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
          addedItem = { ...existingItem, quantity: existingItem.quantity + quantity };
        } else {
          // Agregar nuevo item
          addedItem = { ...item, quantity };
          newItems = [...state.items, addedItem];
        }
      
        console.log(`🛒 Agregado: ${item.name} x${quantity}`);
      
        return {
          ...state,
          items: newItems,
          lastAddedItem: addedItem,
        };
      });
    },
  
    // Remover item
    removeItem: (itemId: string) => {
      set((state) => {
        const item = state.items.find(i => i.id === itemId);
        if (item) {
          console.log(`🗑️ Removido: ${item.name}`);
        }
      
        return {
          ...state,
          items: state.items.filter(i => i.id !== itemId),
        };
      });
    },
  
    // Actualizar cantidad
    updateQuantity: (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        get().removeItem(itemId);
        return;
      }
    
      set((state) => ({
        ...state,
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity }
            : item
        ),
      }));
    },
  
    // Limpiar carrito
    clearCart: () => {
      console.log('🧹 Carrito vaciado');
      set({ items: [], lastAddedItem: null });
    },
  
    // Toggle carrito
    toggleCart: () => {
      set((state) => ({ ...state, isOpen: !state.isOpen }));
    },
  
    // Getters computados
    getTotalItems: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },
  
    getTotalPrice: () => {
      return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  
    getItemById: (id: string) => {
      return get().items.find(item => item.id === id);
    },
  
    isEmpty: () => {
      return get().items.length === 0;
    },
  
    getRestaurants: () => {
      const restaurants = get().items.map(item => item.restaurant);
      return [...new Set(restaurants)];
    },
  }))
);

// Suscriptor para efectos secundarios - como notificaciones automáticas
useCartStore.subscribe(
  (state) => state.items,
  (items, previousItems) => {
    // Detectar cuando se agrega un nuevo item
    if (items.length > previousItems.length) {
      const newItem = items[items.length - 1];
      console.log(`🔔 Notificación: ${newItem.name} agregado al carrito`);
    
      // Aquí podrías mostrar una notificación push o toast
      // showNotification(`${newItem.name} agregado al carrito`);
    }
  }
);
```

```typescript
// src/stores/notificationStore.ts
import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
  
  // Acciones
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  
  // Getters
  getByType: (type: Notification['type']) => Notification[];
  hasUnread: () => boolean;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
  
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
  
    // Auto-remover después de la duración especificada
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, notification.duration);
    }
  
    console.log(`📢 Notificación: ${notification.message}`);
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  },
  
  getByType: (type: Notification['type']) => {
    return get().notifications.filter(n => n.type === type);
  },
  
  hasUnread: () => {
    return get().notifications.length > 0;
  },
}));
```

### Paso 3: Hook Personalizado para Integración

```typescript
// src/hooks/useAppState.ts
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useNotificationStore } from '../stores/notificationStore';

// Hook combinado - como tener un control maestro de todos tus asistentes
export const useAppState = () => {
  const auth = useAuthStore();
  const cart = useCartStore();
  const notifications = useNotificationStore();
  
  // Acciones combinadas
  const loginWithNotification = async (email: string, password: string) => {
    try {
      await auth.login(email, password);
      notifications.addNotification({
        message: `¡Bienvenido de vuelta, ${auth.getDisplayName()}!`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      notifications.addNotification({
        message: 'Error al iniciar sesión. Por favor intenta de nuevo.',
        type: 'error',
        duration: 5000,
      });
    }
  };
  
  const logoutWithCleanup = () => {
    const userName = auth.getDisplayName();
    auth.logout();
    cart.clearCart();
    notifications.addNotification({
      message: `¡Hasta pronto, ${userName}!`,
      type: 'info',
      duration: 3000,
    });
  };
  
  const addToCartWithNotification = (item: any, quantity = 1) => {
    cart.addItem(item, quantity);
    notifications.addNotification({
      message: `${item.name} agregado al carrito`,
      type: 'success',
      duration: 2000,
    });
  };
  
  return {
    // Estados
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    cartItems: cart.items,
    cartTotal: cart.getTotalPrice(),
    cartItemCount: cart.getTotalItems(),
    notifications: notifications.notifications,
  
    // Acciones combinadas
    loginWithNotification,
    logoutWithCleanup,
    addToCartWithNotification,
  
    // Acciones individuales
    ...auth,
    ...cart,
    ...notifications,
  };
};
```

### Paso 4: Uso en Componentes

```typescript
// src/screens/HomeScreenZustand.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppState } from '../hooks/useAppState';

const HomeScreenZustand: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    cartItemCount,
    loginWithNotification,
    addToCartWithNotification 
  } = useAppState();
  
  const products = [
    { id: '1', name: 'Pizza Margherita', price: 15.99, restaurant: 'Italian Bistro' },
    { id: '2', name: 'Hamburguesa Clásica', price: 12.99, restaurant: 'Burger House' },
    { id: '3', name: 'Sushi Variado', price: 22.99, restaurant: 'Tokyo Sushi' },
  ];
  
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🍽️ Food Delivery con Zustand</Text>
        <Text style={styles.subtitle}>Tu asistente personal para comida</Text>
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={() => loginWithNotification('maria@ejemplo.com', 'password123')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Hola, {user?.name}! 🎯</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartText}>🛒 {cartItemCount}</Text>
        </View>
      </View>
    
      <Text style={styles.sectionTitle}>🍕 Menú Recomendado</Text>
    
      {products.map(product => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.restaurantName}>{product.restaurant}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToCartWithNotification(product)}
          >
            <Text style={styles.addButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... estilos similares al ejemplo anterior
});

export default HomeScreenZustand;
```

---

## 🏢 Redux Toolkit - El Sistema Corporativo Enterprise

**Analogía**: *Como el sistema de una gran corporación con departamentos especializados, procesos bien definidos y documentación exhaustiva*

### Paso 1: Instalación y Configuración

```bash
npm install @reduxjs/toolkit react-redux
# o
yarn add @reduxjs/toolkit react-redux
```

### Paso 2: Configuración del Store Principal

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Importar slices - como departamentos de la empresa
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import notificationSlice from './slices/notificationSlice';
import orderSlice from './slices/orderSlice';

// Configuración de persistencia - como el archivo central de la empresa
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart'], // Solo persistir estos reducers
};

// Combinar reducers - como organizar los departamentos
const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  notifications: notificationSlice,
  orders: orderSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurar store - como establecer la estructura corporativa
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__, // Solo en desarrollo
});

export const persistor = persistStore(store);

// Tipos TypeScript - como el manual de procedimientos de la empresa
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Paso 3: Slice de Autenticación (Departamento de Recursos Humanos)

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Tipos - como los formularios oficiales de la empresa
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin' | 'restaurant';
  preferences: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    notifications: boolean;
  };
  metadata: {
    lastLogin: string;
    loginCount: number;
    isVerified: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
};

// Async Thunks - como procesos oficiales de la empresa que requieren aprobación

// Proceso de Login - como el procedimiento oficial de ingreso a la empresa
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🏢 Iniciando proceso de autenticación corporativa...');
    
      // Simular llamada a API corporativa
      await new Promise(resolve => setTimeout(resolve, 2000));
    
      // Simular validación
      if (email === 'admin@empresa.com' && password === 'admin123') {
        throw new Error('Credenciales inválidas');
      }
    
      const userData: User = {
        id: '1',
        name: 'María González',
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        role: 'user',
        preferences: {
          theme: 'light',
          language: 'es',
          notifications: true,
        },
        metadata: {
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          isVerified: true,
        },
      };
    
      const tokens = {
        token: 'jwt_access_token_' + Date.now(),
        refreshToken: 'jwt_refresh_token_' + Date.now(),
      };
    
      console.log('✅ Autenticación corporativa exitosa');
    
      return {
        user: userData,
        ...tokens,
      };
    } catch (error: any) {
      console.error('❌ Error en autenticación corporativa:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Proceso de Logout - como el procedimiento oficial de salida
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
  
    console.log(`👋 Cerrando sesión corporativa para: ${state.auth.user?.name}`);
  
    // Simular llamada para invalidar token en el servidor
    await new Promise(resolve => setTimeout(resolve, 500));
  
    return null;
  }
);

// Proceso de Refresh Token - como renovación automática de credenciales
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const { refreshToken } = state.auth;
  
    if (!refreshToken) {
      return rejectWithValue('No refresh token available');
    }
  
    try {
      // Simular renovación de token
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      const newToken = 'jwt_access_token_refreshed_' + Date.now();
    
      console.log('🔄 Token renovado automáticamente');
    
      return { token: newToken };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice - como el departamento de Recursos Humanos
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acciones síncronas - como procedimientos internos del departamento
    clearError: (state) => {
      state.error = null;
    },
  
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        console.log('👤 Perfil actualizado en sistema corporativo');
      }
    },
  
    updatePreferences: (
      state, 
      action: PayloadAction<Partial<User['preferences']>>
    ) => {
      if (state.user) {
        state.user.preferences = {
          ...state.user.preferences,
          ...action.payload,
        };
        console.log('⚙️ Preferencias actualizadas:', action.payload);
      }
    },
  
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
  },
  extraReducers: (builder) => {
    // Manejo de acciones asíncronas - como respuestas a procesos oficiales
  
    // Login Cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastLoginAttempt = new Date().toISOString();
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        state.loginAttempts = 0;
      
        // Actualizar metadata
        if (state.user) {
          state.user.metadata.loginCount += 1;
          state.user.metadata.lastLogin = new Date().toISOString();
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.loginAttempts += 1;
      
        // Bloquear después de muchos intentos
        if (state.loginAttempts >= 5) {
          state.error = 'Cuenta temporalmente bloqueada por seguridad';
        }
      })
    
    // Logout Cases
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        // Reset completo - como limpiar el escritorio al salir de la oficina
        return {
          ...initialState,
          loginAttempts: state.loginAttempts, // Mantener intentos para seguridad
        };
      })
    
    // Refresh Token Cases
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        console.log('🔄 Credenciales renovadas automáticamente');
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        // Si falla el refresh, cerrar sesión
        return initialState;
      });
  },
});

// Exportar acciones - como los formularios disponibles del departamento
export const {
  clearError,
  updateUserProfile,
  updatePreferences,
  resetLoginAttempts,
} = authSlice.actions;

// Selectores - como consultas especializadas al departamento
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
```

### Paso 4: Slice del Carrito (Departamento de Ventas)

```typescript
// src/store/slices/cartSlice.ts
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  image?: string;
  modifiers?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupons: Array<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  }>;
  deliveryFee: number;
  isOpen: boolean;
  lastModified: string;
  estimatedDeliveryTime: number; // en minutos
}

const initialState: CartState = {
  items: [],
  appliedCoupons: [],
  deliveryFee: 3.99,
  isOpen: false,
  lastModified: '',
  estimatedDeliveryTime: 30,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Agregar item - como registrar una venta en el sistema
    addItem: (state, action: PayloadAction<{
      item: Omit<CartItem, 'quantity'>;
      quantity?: number;
    }>) => {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
    
      if (existingItem) {
        existingItem.quantity += quantity;
        console.log(`📦 Cantidad actualizada: ${item.name} (${existingItem.quantity})`);
      } else {
        state.items.push({ ...item, quantity });
        console.log(`➕ Nuevo item agregado: ${item.name}`);
      }
    
      state.lastModified = new Date().toISOString();
    
      // Recalcular tiempo de entrega basado en restaurantes
      const restaurants = [...new Set(state.items.map(i => i.restaurant))];
      state.estimatedDeliveryTime = restaurants.length > 1 ? 45 : 30;
    },
  
    // Remover item
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find(i => i.id === itemId);
    
      if (item) {
        console.log(`🗑️ Item removido: ${item.name}`);
        state.items = state.items.filter(i => i.id !== itemId);
        state.lastModified = new Date().toISOString();
      }
    },
  
    // Actualizar cantidad
    updateQuantity: (state, action: PayloadAction<{
      itemId: string;
      quantity: number;
    }>) => {
      const { itemId, quantity } = action.payload;
    
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        const item = state.items.find(i => i.id === itemId);
        if (item) {
          console.log(`🗑️ Item removido por cantidad 0: ${item.name}`);
        }
        state.items = state.items.filter(i => i.id !== itemId);
      } else {
        const item = state.items.find(i => i.id === itemId);
        if (item) {
          item.quantity = quantity;
          console.log(`🔢 Cantidad actualizada: ${item.name} (${quantity})`);
        }
      }
    
      state.lastModified = new Date().toISOString();
    },
  
    // Aplicar cupón
    applyCoupon: (state, action: PayloadAction<{
      code: string;
      discount: number;
      type: 'percentage' | 'fixed';
    }>) => {
      const coupon = action.payload;
      const existingCoupon = state.appliedCoupons.find(c => c.code === coupon.code);
    
      if (!existingCoupon) {
        state.appliedCoupons.push(coupon);
        console.log(`🎟️ Cupón aplicado: ${coupon.code} (-${coupon.discount}${coupon.type === 'percentage' ? '%' : '$'})`);
      }
    },
  
    // Remover cupón
    removeCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      state.appliedCoupons = state.appliedCoupons.filter(c => c.code !== code);
      console.log(`❌ Cupón removido: ${code}`);
    },
  
    // Limpiar carrito
    clearCart: (state) => {
      console.log('🧹 Carrito completamente vaciado');
      state.items = [];
      state.appliedCoupons = [];
      state.lastModified = new Date().toISOString();
    },
  
    // Toggle carrito
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  
    // Actualizar tarifa de entrega
    updateDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },
  },
});

// Selectores avanzados - como reportes especializados del departamento
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectAppliedCoupons = (state: { cart: CartState }) => state.cart.appliedCoupons;

// Selector computado para total de items
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

// Selector computado para subtotal
export const selectCartSubtotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const modifiersTotal = (item.modifiers || []).reduce((modSum, mod) => modSum + mod.price, 0) * item.quantity;
    return sum + itemTotal + modifiersTotal;
  }, 0)
);

// Selector computado para descuentos
export const selectCartDiscount = createSelector(
  [selectCartSubtotal, selectAppliedCoupons],
  (subtotal, coupons) => {
    return coupons.reduce((totalDiscount, coupon) => {
      if (coupon.type === 'percentage') {
        return totalDiscount + (subtotal * coupon.discount / 100);
      } else {
        return totalDiscount + coupon.discount;
      }
    }, 0);
  }
);

// Selector computado para total final
export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartDiscount, (state: { cart: CartState }) => state.cart.deliveryFee],
  (subtotal, discount, deliveryFee) => {
    return Math.max(0, subtotal - discount + deliveryFee);
  }
);

// Selector para verificar si el carrito está vacío
export const selectCartIsEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

// Selector para obtener restaurantes únicos
export const selectCartRestaurants = createSelector(
  [selectCartItems],
  (items) => [...new Set(items.map(item => item.restaurant))]
);

// Exportar acciones
export const {
  addItem,
  removeItem,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  toggleCart,
  updateDeliveryFee,
} = cartSlice.actions;

export default cartSlice.reducer;
```

### Paso 5: Hooks Tipados para Redux

```typescript
// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hooks tipados - como tener formularios pre-llenados para cada departamento
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook personalizado para autenticación
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  
  return {
    ...auth,
    login: (email: string, password: string) => 
      dispatch(loginUser({ email, password })),
    logout: () => dispatch(logoutUser()),
    updateProfile: (updates: any) => 
      dispatch(updateUserProfile(updates)),
  };
};

// Hook personalizado para carrito
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = useAppSelector(selectCartTotal);
  const discount = useAppSelector(selectCartDiscount);
  const isEmpty = useAppSelector(selectCartIsEmpty);
  const isOpen = useAppSelector(selectCartIsOpen);
  
  return {
    items: cartItems,
    itemCount,
    subtotal,
    total,
    discount,
    isEmpty,
    isOpen,
    addItem: (item: any, quantity?: number) => 
      dispatch(addItem({ item, quantity })),
    removeItem: (itemId: string) => 
      dispatch(removeItem(itemId)),
    updateQuantity: (itemId: string, quantity: number) => 
      dispatch(updateQuantity({ itemId, quantity })),
    clearCart: () => dispatch(clearCart()),
    toggleCart: () => dispatch(toggleCart()),
  };
};
```

### Paso 6: Configuración en App Principal

```typescript
// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Importar pantallas
import HomeScreen from './src/screens/HomeScreenRedux';
import CartScreen from './src/screens/CartScreenRedux';
import ProfileScreen from './src/screens/ProfileScreenRedux';

const Tab = createBottomTabNavigator();

// Componente de carga mientras se restaura el estado
const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>🏢 Cargando sistema corporativo...</Text>
  </View>
);

const App: React.FC = () => {
  return (
    // Provider Redux - como establecer la sede corporativa
    <Provider store={store}>
      {/* PersistGate - como el sistema de backup corporativo */}
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
```

---

## 🔄 Comparación Práctica: Las Tres Opciones en Acción

### Caso de Uso: Agregar un Producto al Carrito

#### Context API (Familia comunicándose)

```typescript
const { addToCart } = useCart();
addToCart({
  id: '1',
  name: 'Pizza',
  price: 15.99,
  restaurant: 'Italian Bistro'
});
```

#### Zustand (Asistente personal)

```typescript
const addToCart = useCartStore(state => state.addItem);
addToCart({
  id: '1',
  name: 'Pizza',
  price: 15.99,
  restaurant: 'Italian Bistro'
});
```

#### Redux Toolkit (Proceso corporativo)

```typescript
const dispatch = useAppDispatch();
dispatch(addItem({
  item: {
    id: '1',
    name: 'Pizza',
    price: 15.99,
    restaurant: 'Italian Bistro'
  },
  quantity: 1
}));
```

### Rendimiento Comparativo


| Aspecto                  | Context API  | Zustand    | Redux Toolkit |
| ------------------------ | ------------ | ---------- | ------------- |
| **Bundle Size**          | 0kb (nativo) | ~2.5kb     | ~15kb         |
| **Boilerplate**          | Medio        | Mínimo    | Alto          |
| **Curva de Aprendizaje** | Baja         | Muy Baja   | Alta          |
| **DevTools**             | Limitadas    | Excelentes | Excelentes    |
| **Rendimiento**          | Bueno*       | Excelente  | Excelente     |
| **Escalabilidad**        | Limitada     | Alta       | Muy Alta      |

*Context puede causar re-renders innecesarios si no se optimiza correctamente.

---

## 🎯 Patrones de Arquitectura Limpia

### 1. Separación de Responsabilidades

```typescript
// src/domain/entities/User.ts (Entidades del dominio)
export interface User {
  id: string;
  name: string;
  email: string;
  // ... propiedades del dominio
}

// src/domain/repositories/UserRepository.ts (Contratos)
export interface UserRepository {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

// src/infrastructure/repositories/ApiUserRepository.ts (Implementación)
export class ApiUserRepository implements UserRepository {
  async login(email: string, password: string): Promise<User> {
    // Implementación real de API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    return response.json();
  }
  
  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  }
  
  async getCurrentUser(): Promise<User | null> {
    const response = await fetch('/api/auth/me');
    return response.ok ? response.json() : null;
  }
}

// src/application/usecases/AuthUseCases.ts (Casos de uso)
export class AuthUseCases {
  constructor(private userRepository: UserRepository) {}
  
  async loginUser(email: string, password: string): Promise<User> {
    // Validaciones de negocio
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }
  
    if (!this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }
  
    return this.userRepository.login(email, password);
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### 2. Inyección de Dependencias

```typescript
// src/infrastructure/di/Container.ts
import { UserRepository } from '../../domain/repositories/UserRepository';
import { ApiUserRepository } from '../repositories/ApiUserRepository';
import { AuthUseCases } from '../../application/usecases/AuthUseCases';

class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }
  
  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }
  
  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not found`);
    }
    return factory();
  }
}

// Configuración de dependencias
const container = DIContainer.getInstance();

container.register<UserRepository>('UserRepository', () => 
  new ApiUserRepository()
);

container.register<AuthUseCases>('AuthUseCases', () => 
  new AuthUseCases(container.resolve<UserRepository>('UserRepository'))
);

export { container };
```

### 3. Custom Hook con Arquitectura Limpia

```typescript
// src/presentation/hooks/useAuthClean.ts
import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/Container';
import { AuthUseCases } from '../../application/usecases/AuthUseCases';
import { User } from '../../domain/entities/User';

export const useAuthClean = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Inyectar casos de uso
  const authUseCases = container.resolve<AuthUseCases>('AuthUseCases');
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const loggedUser = await authUseCases.loginUser(email, password);
      setUser(loggedUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authUseCases.logoutUser();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    clearError: () => setError(null),
  };
};
```

---

## 🚀 Mejores Prácticas y Optimizaciones

### 1. Optimización de Re-renders (Context API)

```typescript
// ❌ MALO - Causa re-renders innecesarios
const AppContext = createContext({
  user: null,
  cart: [],
  updateUser: () => {},
  addToCart: () => {},
});

// ✅ BUENO - Separar contextos por responsabilidad
const UserContext = createContext(null);
const CartContext = createContext(null);

// ✅ MEJOR - Usar useMemo para valores del provider
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state]);
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

### 2. Optimización de Selectores (Redux)

```typescript
// ❌ MALO - Nuevo objeto en cada render
const useCartItems = () => {
  return useAppSelector(state => 
    state.cart.items.map(item => ({
      ...item,
      total: item.price * item.quantity
    }))
  );
};

// ✅ BUENO - Usar createSelector para memoización
const selectCartItemsWithTotals = createSelector(
  [selectCartItems],
  (items) => items.map(item => ({
    ...item,
    total: item.price * item.quantity
  }))
);

const useCartItems = () => useAppSelector(selectCartItemsWithTotals);
```

### 3. Patrones de Carga de Datos

```typescript
// Patrón RTK Query para Redux Toolkit
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User', 'Product', 'Order'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => 'products',
      providesTags: ['Product'],
    }),
    addToCart: builder.mutation<void, { productId: string; quantity: number }>({
      query: (data) => ({
        url: 'cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useGetProductsQuery, useAddToCartMutation } = api;
```

---

## 🎨 Reflexión Final: Eligiendo la Herramienta Correcta

Después de explorar estas tres opciones, la elección depende de tu contexto específico:

### 🏠 **Context API - La Familia Unida**

**Elige cuando:**

- Tu app tiene menos de 10-15 pantallas
- El equipo es pequeño (1-3 desarrolladores)
- Necesitas algo rápido y sin dependencias externas
- El estado es relativamente simple
- Ya estás familiarizado con React

**Analogía perfecta**: Es como la comunicación en una familia pequeña donde todos se conocen y pueden hablar directamente entre ellos.

### 🎯 **Zustand - El Asistente Eficiente**

**Elige cuando:**

- Tu app está creciendo pero aún es manejable
- Quieres simplicidad sin sacrificar potencia
- El equipo valora la productividad sobre la estructura rígida
- Necesitas algo moderno y minimalista
- Quieres fácil testing y debugging

**Analogía perfecta**: Es como tener un asistente personal que entiende exactamente lo que necesitas sin que tengas que explicar procesos complicados.

### 🏢 **Redux Toolkit - La Corporación Organizada**

**Elige cuando:**

- Tu app es grande y compleja (15+ pantallas)
- Tienes un equipo grande con diferentes niveles de experiencia
- Necesitas predictibilidad y estructura estricta
- El debugging y la trazabilidad son críticos
- Planeas integrar con muchas herramientas externas

**Analogía perfecta**: Es como una gran corporación donde hay procesos bien definidos, departamentos especializados y documentación exhaustiva para todo.

### 🌟 **Mi Recomendación Personal**

Para la mayoría de proyectos React Native modernos, recomiendo **Zustand** por estas razones:

1. **Simplicidad**: Código más limpio y menos boilerplate
2. **Rendimiento**: Optimizado por defecto, sin configuration
3. **Flexibilidad**: Puedes empezar simple y crecer según necesites
4. **Developer Experience**: Excelentes DevTools y debugging
5. **Futuro-prueba**: Fácil migrar a Redux si creces mucho

**Pero recuerda**: No hay una "bala de plata". La mejor herramienta es la que tu equipo puede usar efectivamente y mantener a largo plazo.

### 🔄 **Estrategia de Migración**

Si ya tienes una app existente:

1. **De Context a Zustand**: Relativamente fácil, cambios graduales
2. **De Context a Redux**: Más trabajo, pero vale la pena para apps grandes
3. **De Zustand a Redux**: Fácil, solo cambiar la implementación de stores

### 🎯 **Conclusión Final**

El estado global es como el sistema nervioso de tu aplicación. Así como en la vida real elegimos diferentes formas de comunicarnos según el contexto (WhatsApp para amigos, email para trabajo, reuniones formales para decisiones importantes), en React Native debemos elegir la herramienta de estado global que mejor se adapte a nuestro contexto específico.

**La clave no está en usar la herramienta más popular o avanzada, sino en usar la que mejor resuelva los problemas reales de tu equipo y tu aplicación.**

¡Recuerda: el mejor código es el que funciona, se mantiene fácilmente y tu equipo puede entender! 🚀
