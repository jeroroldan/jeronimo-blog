---
title: 'Expo & React Native Masterclass'
code: 'react'
description: 'Expo & React Native Masterclass - Guía del Experto'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Expo & React Native Masterclass - Guía del Experto

## 🏗️ 1. Arquitectura Fundamental

### React Native vs Native - El Traductor Universal

React Native es como tener un traductor que convierte tu código JavaScript en instrucciones que tanto iOS como Android entienden perfectamente.

```jsx
// Un componente que funciona en ambas plataformas
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const UniversalButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        Platform.OS === 'ios' ? styles.iosButton : styles.androidButton
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  iosButton: {
    backgroundColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  androidButton: {
    backgroundColor: '#2196F3',
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### Expo vs Bare React Native - El Asistente vs DIY

**Expo** es como tener un asistente personal que se encarga de toda la configuración compleja:

```jsx
// Con Expo - Simple y directo
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const MyApp = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      // Permisos simplificados con Expo
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <View style={styles.container}>
      {hasPermission && <Camera style={styles.camera} />}
    </View>
  );
};
```

**Bare React Native** es como construir tu casa desde cero - más control, más trabajo:

```jsx
// Bare RN requiere configuración nativa manual
// android/app/src/main/AndroidManifest.xml
// <uses-permission android:name="android.permission.CAMERA" />
// ios/MyApp/Info.plist
// <key>NSCameraUsageDescription</key>
```

## 📱 2. Components Fundamentales - Los Bloques de Construcción

### Core Components - Los Ladrillos Básicos

```jsx
import {
  View,        // El contenedor div
  Text,        // El span/p para texto
  ScrollView,  // El contenedor scrolleable
  Image,       // Para mostrar imágenes
  TextInput,   // Input de texto
  TouchableOpacity, // Botón táctil
  FlatList,    // Lista optimizada
  Modal,       // Ventanas emergentes
  StyleSheet,  // CSS-in-JS
} from 'react-native';

// Componente básico bien estructurado
const UserProfile = ({ user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar}
          defaultSource={require('../assets/default-avatar.png')}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    
      <View style={styles.stats}>
        <StatItem label="Posts" value={user.postsCount} />
        <StatItem label="Seguidores" value={user.followersCount} />
        <StatItem label="Siguiendo" value={user.followingCount} />
      </View>
    </ScrollView>
  );
};
```

### Custom Components - Tus Propios Ladrillos

```jsx
// Componente reutilizable inteligente
const SmartInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  type = 'text',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(type === 'password');

  const getKeyboardType = () => {
    switch (type) {
      case 'email': return 'email-address';
      case 'phone': return 'phone-pad';
      case 'number': return 'numeric';
      default: return 'default';
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isFocused && styles.labelFocused]}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={getKeyboardType()}
          secureTextEntry={isSecure}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          {...props}
        />
        {type === 'password' && (
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Text>{isSecure ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
```

### FlatList - La Lista Inteligente

```jsx
// Lista optimizada para grandes cantidades de datos
const ProductList = ({ products, onProductPress }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => onProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <View style={styles.rating}>
          <StarRating rating={item.rating} />
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // Recargar datos
    await fetchProducts();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loading) {
      setLoading(true);
      // Cargar más productos
      fetchMoreProducts().finally(() => setLoading(false));
    }
  };

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<EmptyState />}
      ListFooterComponent={loading && <LoadingSpinner />}
      getItemLayout={(data, index) => ({
        length: 200,
        offset: 200 * index,
        index,
      })}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

## 🧭 3. Navigation - El Sistema de Carreteras

### Stack Navigation - Apilar Pantallas

```jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Inicio',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.headerButton}>Perfil</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={({ route }) => ({
            title: route.params.productName,
            headerBackTitle: 'Atrás',
          })}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            presentation: 'modal', // Presentación modal
            gestureEnabled: false,  // Deshabilitar gesto de cerrar
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### Tab Navigation - Pestañas Inteligentes

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ 
          tabBarLabel: 'Inicio',
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ 
          tabBarLabel: 'Buscar',
          tabBarBadge: searchResults.length > 0 ? searchResults.length : null
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          tabBarLabel: 'Carrito',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : null
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};
```

### Drawer Navigation - Menú Lateral

```jsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 280,
        },
        drawerActiveTintColor: '#2196F3',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
```

## 🧠 4. State Management - El Cerebro de la App

### useState y useEffect - Los Básicos

```jsx
const ProductScreen = ({ route }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [route.params.productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const response = await api.getProduct(route.params.productId);
      setProduct(response.data);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    // Lógica para agregar al carrito
    cartStore.addItem(product, quantity);
  
    // Mostrar feedback
    Toast.show({
      type: 'success',
      text1: 'Agregado al carrito',
      text2: `${product.name} x${quantity}`
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProduct} />;
  if (!product) return <NotFound />;

  return (
    <ScrollView style={styles.container}>
      <ProductImageCarousel images={product.images} />
      <ProductInfo product={product} />
      <QuantitySelector 
        quantity={quantity}
        onQuantityChange={setQuantity}
        maxQuantity={product.stock}
      />
      <AddToCartButton 
        onPress={addToCart}
        disabled={product.stock === 0}
      />
    </ScrollView>
  );
};
```

### Context API - El Estado Global Inteligente

```jsx
// UserContext.js - Contexto de usuario
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const userData = await api.getUserProfile(token);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      await AsyncStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const { user, token } = response.data;
    
      await AsyncStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
    
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await api.updateProfile(updates);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar perfil'
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

### Redux Toolkit - El Estado Empresarial

```jsx
// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.login(email, password);
      const { user, token } = response.data;
    
      await AsyncStorage.setItem('authToken', token);
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await api.getUserProfile(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = userSlice.actions;
export default userSlice.reducer;

// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
```

## 🌐 5. APIs y Networking - La Comunicación Externa

### Fetch API con Error Handling

```jsx
// api/client.js - Cliente API robusto
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    // Agregar token de autenticación
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
    
      // Manejar respuestas no exitosas
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
    
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
    
      // Errores de red
      throw new ApiError('Error de conexión. Verifica tu internet.', 0, error);
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload de archivos
  async upload(endpoint, file, onProgress) {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'image.jpg',
    });

    const token = await AsyncStorage.getItem('authToken');
  
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
    
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export const api = new ApiClient('https://api.myapp.com');
```

### Custom Hooks para APIs

```jsx
// hooks/useApi.js
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// hooks/useProducts.js
export const useProducts = (category, searchTerm) => {
  const apiCall = useCallback(
    () => api.get('/products', { category, search: searchTerm }),
    [category, searchTerm]
  );

  const { data, loading, error, refetch } = useApi(apiCall, [category, searchTerm]);

  const products = data?.products || [];
  const hasMore = data?.hasMore || false;

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = Math.ceil(products.length / 20) + 1;
      const result = await api.get('/products', {
        category,
        search: searchTerm,
        page: nextPage
      });
    
      setData(prevData => ({
        ...result,
        products: [...prevData.products, ...result.products]
      }));
    } catch (err) {
      console.error('Load more error:', err);
    }
  }, [hasMore, loading, products.length, category, searchTerm]);

  return {
    products,
    loading,
    error,
    hasMore,
    refetch,
    loadMore
  };
};

// Uso en componente
const ProductListScreen = ({ route }) => {
  const { category } = route.params;
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    products,
    loading,
    error,
    hasMore,
    refetch,
    loadMore
  } = useProducts(category, searchTerm);

  if (loading && products.length === 0) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <SearchBar 
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar productos..."
      />
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        onRefresh={refetch}
        ListFooterComponent={hasMore && <LoadingSpinner />}
      />
    </View>
  );
};
```

### WebSocket y Real-time

```jsx
// hooks/useWebSocket.js
export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);
  
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        options.onMessage?.(data);
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, connected]);

  return { connected, error, sendMessage };
};

// Uso para chat en tiempo real
const ChatScreen = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const { connected, sendMessage } = useWebSocket(
    `wss://api.myapp.com/chat/${chatId}`,
    {
      onMessage: (data) => {
        switch (data.type) {
          case 'new_message':
            setMessages(prev => [...prev, data.message]);
            break;
          case 'user_typing':
            // Manejar indicador de escritura
            break;
          case 'message_read':
            setMessages(prev => 
              prev.map(msg => 
                msg.id === data.messageId 
                  ? { ...msg, read: true }
                  : msg
              )
            );
            break;
        }
      }
    }
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && connected) {
      sendMessage({
        type: 'send_message',
        content: newMessage.trim(),
        chatId
      });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={item => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe un mensaje..."
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!connected}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## 💾 6. Storage Local - La Memoria Persistente

### AsyncStorage - El Almacén Básico

```jsx
// utils/storage.js
class StorageManager {
  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw new Error('Failed to save data');
    }
  }

  static async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  static async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Métodos de conveniencia
  static async setUserPreferences(preferences) {
    await this.setItem('userPreferences', preferences);
  }

  static async getUserPreferences() {
    return await this.getItem('userPreferences') || {
      theme: 'light',
      notifications: true,
      language: 'es',
    };
  }

  static async setRecentSearches(searches) {
    // Mantener solo las últimas 10 búsquedas
    const recentSearches = searches.slice(0, 10);
    await this.setItem('recentSearches', recentSearches);
  }

  static async addRecentSearch(searchTerm) {
    const recent = await this.getItem('recentSearches') || [];
    const filtered = recent.filter(item => item !== searchTerm);
    const updated = [searchTerm, ...filtered].slice(0, 10);
    await this.setRecentSearches(updated);
  }
}

export default StorageManager;
```

### SQLite - Base de Datos Local

```jsx
import * as SQLite from 'expo-sqlite';

// database/database.js
class Database {
  constructor() {
    this.db = SQLite.openDatabase('myapp.db');
    this.initDatabase();
  }

  initDatabase() {
    this.db.transaction(tx => {
      // Tabla de productos favoritos
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla de historial de búsquedas
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS search_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          search_term TEXT NOT NULL,
          category TEXT,
          result_count INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla de carrito offline
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          price REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }

  // Favoritos
  addFavorite(product) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO favorites (product_id, name, price, image_url) VALUES (?, ?, ?, ?)',
          [product.id, product.name, product.price, product.image_url],
          (_, result) => resolve(result.insertId),
          (_, error) => reject(error)
        );
      });
    });
  }

  getFavorites() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM favorites ORDER BY created_at DESC',
          [],
          (_, { rows: { _array } }) => resolve(_array),
          (_, error) => reject(error)
        );
      });
    });
  }

  removeFavorite(productId) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM favorites WHERE product_id = ?',
          [productId],
          (_, result) => resolve(result.rowsAffected),
          (_, error) => reject(error)
        );
      });
    });
  }

  // Carrito offline
  addToCart(product, quantity) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        // Verificar si ya existe
        tx.executeSql(
          'SELECT * FROM cart_items WHERE product_id = ?',
          [product.id],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              // Actualizar cantidad
              tx.executeSql(
                'UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?',
                [quantity, product.id],
                () => resolve('updated'),
                (_, error) => reject(error)
              );
            } else {
              // Insertar nuevo
              tx.executeSql(
                'INSERT INTO cart_items (product_id, quantity, price) VALUES (?, ?, ?)',
                [product.id, quantity, product.price],
                () => resolve('inserted'),
                (_, error) => reject(error)
              );
            }
          },
          (_, error) => reject(error)
        );
      });
    });
  }

  getCartItems() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM cart_items ORDER BY created_at DESC',
          [],
          (_, { rows: { _array } }) => resolve(_array),
          (_, error) => reject(error)
        );
      });
    });
  }

  clearCart() {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM cart_items',
          [],
          (_, result) => resolve(result.rowsAffected),
          (_, error) => reject(error)
        );
      });
    });
  }
}

export const database = new Database();
```

## 🎁 7. Expo SDK Features - Las Herramientas Mágicas

### Camera y ImagePicker

```jsx
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const PhotoCaptureScreen = ({ onPhotoSelected }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
      
        onPhotoSelected(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.cancelled) {
        onPhotoSelected(result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={type}
        ref={ref => setCameraRef(ref)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        
          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
          >
            <Text style={styles.text}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};
```

### Location Services

```jsx
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
    
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      setErrorMsg('Error getting location');
      console.error('Location error:', error);
    }
  };

  const startWatchingLocation = () => {
    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 100, // 100 meters
      },
      (newLocation) => {
        setLocation(newLocation);
        setRegion({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );
  };

  const geocodeAddress = async (address) => {
    try {
      const geocoded = await Location.geocodeAsync(address);
      if (geocoded.length > 0) {
        const { latitude, longitude } = geocoded[0];
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity onPress={getCurrentLocation}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChange={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {location && (
            <>
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Tu ubicación"
                description={`Precisión: ${location.coords.accuracy}m`}
              />
              <Circle
                center={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                radius={location.coords.accuracy}
                strokeColor="rgba(0,0,255,0.5)"
                fillColor="rgba(0,0,255,0.1)"
              />
            </>
          )}
        </MapView>
      )}
    
      <View style={styles.info}>
        {location && (
          <Text>
            Lat: {location.coords.latitude.toFixed(6)}, 
            Lon: {location.coords.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    </View>
  );
};
```

### Push Notifications

```jsx
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationManager = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Listener para notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener para respuestas a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      // Navegar a pantalla específica basada en la notificación
      const data = response.notification.request.content.data;
      if (data.screen) {
        navigation.navigate(data.screen, data.params);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
  
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
    
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  };

  const sendPushNotification = async (pushToken, title, body, data = {}) => {
    const message = {
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  return { expoPushToken, schedulePushNotification, sendPushNotification };
};
```

## 🚀 8. Performance Optimization - La Velocidad

### Optimización de Renderizado

```jsx
import { memo, useCallback, useMemo } from 'react';

// Componente optimizado con memo
const ProductCard = memo(({ product, onPress, onFavorite }) => {
  const handlePress = useCallback(() => {
    onPress(product.id);
  }, [product.id, onPress]);

  const handleFavorite = useCallback(() => {
    onFavorite(product.id);
  }, [product.id, onFavorite]);

  const discountPercentage = useMemo(() => {
    if (product.originalPrice && product.price) {
      return Math.round((1 - product.price / product.originalPrice) * 100);
    }
    return 0;
  }, [product.originalPrice, product.price]);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <FastImage
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price}</Text>
          {discountPercentage > 0 && (
            <Text style={styles.discount}>{discountPercentage}% OFF</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavorite}
      >
        <Icon
          name={product.isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={product.isFavorite ? '#ff4757' : '#666'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

// Lista optimizada
const ProductList = ({ products, onProductPress, onFavoritePress }) => {
  const keyExtractor = useCallback((item) => item.id.toString(), []);
  
  const renderItem = useCallback(({ item }) => (
    <ProductCard
      product={item}
      onPress={onProductPress}
      onFavorite={onFavoritePress}
    />
  ), [onProductPress, onFavoritePress]);

  const getItemLayout = useCallback((data, index) => ({
    length: 200, // altura fija del item
    offset: 200 * index,
    index,
  }), []);

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
      updateCellsBatchingPeriod={50}
    />
  );
};
```

### Lazy Loading y Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// Lazy loading de pantallas
const ProductDetailScreen = lazy(() => import('../screens/ProductDetailScreen'));
const CheckoutScreen = lazy(() => import('../screens/CheckoutScreen'));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen'));

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="ProductDetail" 
          component={() => (
            <Suspense fallback={<LoadingScreen />}>
              <ProductDetailScreen />
            </Suspense>
          )}
        />
        <Stack.Screen 
          name="Checkout" 
          component={() => (
            <Suspense fallback={<LoadingScreen />}>
              <CheckoutScreen />
            </Suspense>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Hook para lazy loading de datos
const useLazyData = (fetchFunction, dependencies) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadData = useCallback(async () => {
    if (loaded || loading) return;
  
    setLoading(true);
    try {
      const result = await fetchFunction();
      setData(result);
      setLoaded(true);
    } catch (error) {
      console.error('Lazy loading error:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, loaded, loading]);

  return { data, loading, loaded, loadData };
};

// Componente con lazy loading
const ProductReviews = ({ productId }) => {
  const fetchReviews = useCallback(
    () => api.getProductReviews(productId),
    [productId]
  );

  const { data: reviews, loading, loaded, loadData } = useLazyData(fetchReviews);

  if (!loaded) {
    return (
      <TouchableOpacity onPress={loadData} style={styles.loadButton}>
        <Text>Cargar reseñas</Text>
      </TouchableOpacity>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View>
      {reviews?.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </View>
  );
};
```

### Image Optimization

```jsx
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ 
  source, 
  style, 
  placeholder,
  resizeMode = 'cover',
  priority = 'normal',
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={[style, styles.imageContainer]}>
      <FastImage
        style={StyleSheet.absoluteFillObject}
        source={{
          uri: source,
          priority: FastImage.priority[priority],
          cache: FastImage.cacheControl.web,
        }}
        resizeMode={FastImage.resizeMode[resizeMode]}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        {...props}
      />
    
      {loading && (
        <View style={styles.placeholder}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
    
      {error && placeholder && (
        <FastImage
          style={StyleSheet.absoluteFillObject}
          source={placeholder}
          resizeMode={FastImage.resizeMode[resizeMode]}
        />
      )}
    </View>
  );
};

// Hook para precargar imágenes
const useImagePreloader = (imageUrls) => {
  useEffect(() => {
    if (imageUrls.length > 0) {
      FastImage.preload(imageUrls.map(url => ({
        uri: url,
        priority: FastImage.priority.normal,
      })));
    }
  }, [imageUrls]);
};

// Componente con precarga de imágenes
const ProductGallery = ({ images }) => {
  useImagePreloader(images);

  return (
    <ScrollView horizontal pagingEnabled>
      {images.map((image, index) => (
        <OptimizedImage
          key={index}
          source={image}
          style={styles.galleryImage}
          priority="high"
        />
      ))}
    </ScrollView>
  );
};
```

## 🧪 9. Testing - El Laboratorio de Calidad

### Unit Testing con Jest

```jsx
// __tests__/utils/formatters.test.js
import { formatPrice, formatDate, validateEmail } from '../utils/formatters';

describe('Formatters', () => {
  describe('formatPrice', () => {
    test('should format price correctly', () => {
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(1000)).toBe('$1,000.00');
    });

    test('should handle invalid input', () => {
      expect(formatPrice(null)).toBe('$0.00');
      expect(formatPrice(undefined)).toBe('$0.00');
      expect(formatPrice('invalid')).toBe('$0.00');
    });
  });

  describe('validateEmail', () => {
    test('should validate email correctly', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });
});

// __tests__/hooks/useApi.test.js
import { renderHook, waitFor } from '@testing-library/react-native';
import { useApi } from '../hooks/useApi';

// Mock de la API
jest.mock('../services/api', () => ({
  getProducts: jest.fn(),
}));

import { api } from '../services/api';

describe('useApi hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch data successfully', async () => {
    const mockData = { products: [{ id: 1, name: 'Test Product' }] };
    api.getProducts.mockResolvedValue(mockData);

    const { result } = renderHook(() => 
      useApi(() => api.getProducts())
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  test('should handle API errors', async () => {
    const mockError = new Error('API Error');
    api.getProducts.mockRejectedValue(mockError);

    const { result } = renderHook(() => 
      useApi(() => api.getProducts())
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('API Error');
  });
});
```

### Component Testing

```jsx
// __tests__/components/ProductCard.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  isFavorite: false,
};

describe('ProductCard', () => {
  test('should render product information correctly', () => {
    const { getByText, getByTestId } = render(
      <ProductCard product={mockProduct} onPress={jest.fn()} />
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
    expect(getByTestId('product-image')).toBeTruthy();
  });

  test('should call onPress when card is tapped', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByTestId('product-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockProduct.id);
  });

  test('should call onFavorite when heart is tapped', () => {
    const mockOnFavorite = jest.fn();
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        onPress={jest.fn()}
        onFavorite={mockOnFavorite}
      />
    );

    fireEvent.press(getByTestId('favorite-button'));
    expect(mockOnFavorite).toHaveBeenCalledWith(mockProduct.id);
  });

  test('should show favorite state correctly', () => {
    const favoriteProduct = { ...mockProduct, isFavorite: true };
    const { getByTestId } = render(
      <ProductCard 
        product={favoriteProduct} 
        onPress={jest.fn()}
      />
    );

    const heartIcon = getByTestId('heart-icon');
    expect(heartIcon.props.name).toBe('heart');
  });
});
```

### Integration Testing

```jsx
// __tests__/integration/ProductList.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProductListScreen from '../screens/ProductListScreen';

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock de API
jest.mock('../services/api', () => ({
  getProducts: jest.fn(),
}));

import { api } from '../services/api';

const Wrapper = ({ children }) => (
  <NavigationContainer>
    {children}
  </NavigationContainer>
);

describe('ProductListScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should load and display products', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 99.99 },
      { id: 2, name: 'Product 2', price: 149.99 },
    ];

    api.getProducts.mockResolvedValue({ products: mockProducts });

    const { getByText, queryByTestId } = render(
      <ProductListScreen />,
      { wrapper: Wrapper }
    );

    // Debe mostrar loading inicialmente
    expect(queryByTestId('loading-spinner')).toBeTruthy();

    // Esperar a que carguen los productos
    await waitFor(() => {
      expect(getByText('Product 1')).toBeTruthy();
      expect(getByText('Product 2')).toBeTruthy();
    });

    // Loading debe desaparecer
    expect(queryByTestId('loading-spinner')).toBeFalsy();
  });

  test('should navigate to product detail when product is tapped', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 99.99 },
    ];

    api.getProducts.mockResolvedValue({ products: mockProducts });

    const { getByText } = render(
      <ProductListScreen />,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(getByText('Product 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Product 1'));

    expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', {
      productId: 1,
    });
  });

  test('should show error message when API fails', async () => {
    api.getProducts.mockRejectedValue(new Error('Network Error'));

    const { getByText } = render(
      <ProductListScreen />,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(getByText(/error/i)).toBeTruthy();
    });
  });
});
```

### E2E Testing con Detox

```javascript
// e2e/productFlow.test.js
describe('Product Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate through product flow', async () => {
    // Verificar que la pantalla principal carga
    await expect(element(by.testID('home-screen'))).toBeVisible();

    // Navegar a lista de productos
    await element(by.testID('products-tab')).tap();

    // Verificar que la lista de productos aparece
    await expect(element(by.testID('product-list'))).toBeVisible();

    // Tocar el primer producto
    await element(by.testID('product-card-1')).tap();

    // Verificar que se abre el detalle del producto
    await expect(element(by.testID('product-detail'))).toBeVisible();
    await expect(element(by.text('Test Product'))).toBeVisible();

    // Agregar al carrito
    await element(by.testID('add-to-cart-button')).tap();

    // Verificar mensaje de confirmación
    await expect(element(by.text('Agregado al carrito'))).toBeVisible();

    // Ir al carrito
    await element(by.testID('cart-tab')).tap();

    // Verificar que el producto está en el carrito
    await expect(element(by.testID('cart-item-1'))).toBeVisible();

    // Proceder al checkout
    await element(by.testID('checkout-button')).tap();

    // Verificar pantalla de checkout
    await expect(element(by.testID('checkout-screen'))).toBeVisible();
  });

  it('should handle search functionality', async () => {
    await element(by.testID('search-tab')).tap();
  
    // Escribir en el campo de búsqueda
    await element(by.testID('search-input')).typeText('iPhone');
  
    // Verificar que aparecen resultados
    await expect(element(by.testID('search-results'))).toBeVisible();
  
    // Verificar que hay al menos un resultado
    await expect(element(by.testID('search-result-0'))).toBeVisible();
  });
});
```

## 🚀 10. Deployment y Distribution

### Build Configuration

```javascript
// app.json / app.config.js
export default {
  expo: {
    name: "My Awesome App",
    slug: "my-awesome-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/[your-project-id]"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mycompany.myawesomeapp",
      buildNumber: "1.0.0",
      infoPlist: {
        NSCameraUsageDescription: "Esta app necesita acceso a la cámara para tomar fotos de productos.",
        NSLocationWhenInUseUsageDescription: "Esta app necesita tu ubicación para mostrarte tiendas cercanas."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.mycompany.myawesomeapp",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "[your-project-id]"
      }
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission: "La app accede a tus fotos para seleccionar imágenes de perfil.",
          cameraPermission: "La app accede a tu cámara para tomar fotos de perfil."
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Permite a la app usar tu ubicación para funciones de geolocalización."
        }
      ]
    ]
  }
};
```

### EAS Build Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEFGHIJ"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

### Environment Variables

```javascript
// config/environment.js
import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
    stripePublishableKey: 'pk_test_...',
    amplitudeApiKey: 'test_key',
  },
  staging: {
    apiUrl: 'https://staging-api.myapp.com/api',
    stripePublishableKey: 'pk_test_...',
    amplitudeApiKey: 'staging_key',
  },
  prod: {
    apiUrl: 'https://api.myapp.com/api',
    stripePublishableKey: 'pk_live_...',
    amplitudeApiKey: 'prod_key',
  }
};

const getEnvVars = (env = Constants.releaseChannel) => {
  // Si es desarrollo local
  if (__DEV__) {
    return ENV.dev;
  }
  
  // Si es release channel de staging
  if (env === 'staging') {
    return ENV.staging;
  }
  
  // Por defecto, producción
  return ENV.prod;
};

export default getEnvVars();
```

### Deployment Scripts

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Iniciando deployment..."

# Validar que estamos en la rama correcta
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Debes estar en la rama 'main' para hacer deploy"
  exit 1
fi

# Asegurar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Hay cambios sin commitear. Commit o stash tus cambios primero."
  exit 1
fi

# Actualizar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test -- --watchAll=false

# Ejecutar linting
echo "🔍 Ejecutando linting..."
npm run lint

# Build para producción
echo "🏗️ Construyendo para producción..."
eas build --platform all --profile production --non-interactive

echo "✅ Build completado. Revisa el progreso en https://expo.dev"

# Opcional: Auto-submit si el build es exitoso
read -p "¿Quieres enviar automáticamente a las tiendas? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📱 Enviando a App Store y Google Play..."
    eas submit --platform all --profile production --non-interactive
fi

echo "🎉 Deployment completado!"
```

### Code Signing y Certificates

```bash
# Configurar credenciales para iOS
eas credentials -p ios

# Configurar credenciales para Android
eas credentials -p android

# Ver todas las credenciales
eas credentials
```

## 🌟 11. Mejores Prácticas de Producción

### Error Boundary

```jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Sentry from 'sentry-expo';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  
    // Reportar a Sentry
    Sentry.captureException(error, {
      contexts: {
        errorBoundary: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>¡Oops! Algo salió mal</Text>
          <Text style={styles.errorMessage}>
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
          </TouchableOpacity>
        
          {__DEV__ && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText}>
                {this.state.error?.toString()}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

// Uso
const App = () => (
  <ErrorBoundary>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </ErrorBoundary>
);
```

### Logging y Analytics

```jsx
import * as Sentry from 'sentry-expo';
import { Analytics } from 'expo-analytics';

// Configuración de Sentry
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInExpoDevelopment: true,
  debug: __DEV__,
});

// Logger personalizado
class Logger {
  static info(message, extra = {}) {
    console.log(`[INFO] ${message}`, extra);
  
    if (!__DEV__) {
      Sentry.addBreadcrumb({
        message,
        category: 'info',
        data: extra,
      });
    }
  }

  static warn(message, extra = {}) {
    console.warn(`[WARN] ${message}`, extra);
  
    if (!__DEV__) {
      Sentry.captureMessage(message, 'warning');
    }
  }

  static error(message, error, extra = {}) {
    console.error(`[ERROR] ${message}`, error, extra);
  
    if (!__DEV__) {
      Sentry.captureException(error || new Error(message), {
        extra,
      });
    }
  }

  static setUser(user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  }

  static addTag(key, value) {
    Sentry.setTag(key, value);
  }
}

// Analytics personalizado
class AppAnalytics {
  constructor() {
    this.analytics = new Analytics('YOUR_ANALYTICS_ID');
  }

  trackScreenView(screenName, userId = null) {
    this.analytics.screen(screenName, { userId });
    Logger.info('Screen viewed', { screenName, userId });
  }

  trackEvent(eventName, properties = {}) {
    this.analytics.track(eventName, properties);
    Logger.info('Event tracked', { eventName, properties });
  }

  trackPurchase(productId, price, currency = 'USD') {
    this.analytics.track('Purchase', {
      productId,
      price,
      currency,
      timestamp: new Date().toISOString(),
    });
  
    Logger.info('Purchase tracked', { productId, price, currency });
  }

  setUserProperties(properties) {
    this.analytics.identify(properties);
    Logger.setUser(properties);
  }
}

export const logger = Logger;
export const analytics = new AppAnalytics();
```

### Security Best Practices

```jsx
// utils/security.js
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

class SecurityManager {
  // Almacenar tokens de forma segura
  static async storeSecurely(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error('Failed to store securely', error, { key });
      throw error;
    }
  }

  static async getSecurely(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error('Failed to retrieve securely', error, { key });
      return null;
    }
  }

  static async removeSecurely(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error('Failed to remove securely', error, { key });
    }
  }

  // Encriptar datos sensibles
  static encrypt(text, secretKey) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  }

  static decrypt(cipherText, secretKey) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Validar entrada del usuario
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return '';
    }
  
    // Remover caracteres peligrosos
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // Validar URLs
  static isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  }

  // Generar nonce para CSP
  static generateNonce() {
    return CryptoJS.lib.WordArray.random(16).toString();
  }
}

// API Client con seguridad mejorada
class SecureApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.requestTimeout = 10000; // 10 segundos
  }

  async request(endpoint, options = {}) {
    // Sanitizar endpoint
    const cleanEndpoint = SecurityManager.sanitizeInput(endpoint);
  
    // Timeout automático
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      // Obtener token de forma segura
      const token = await SecurityManager.getSecurely('authToken');
    
      const config = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${cleanEndpoint}`, config);
    
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
    
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
    
      throw error;
    }
  }
}
```

## 📚 Resumen de Conceptos Clave

### 🎯 Los 15 Principios del Maestro React Native/Expo

1. **Component Composition**: Combina componentes pequeños para crear interfaces complejas
2. **State Management**: Usa el estado apropiado para cada nivel (local, global, persistente)
3. **Performance First**: Optimiza desde el principio, no como afterthought
4. **Async Everything**: Maneja asincronía correctamente con proper error handling
5. **Security by Design**: Protege datos sensibles y valida todas las entradas
6. **Offline Support**: Tu app debe funcionar sin conexión cuando sea posible
7. **Platform Awareness**: Respeta las convenciones de cada plataforma
8. **Test Driven**: Escribe tests que den confianza, no solo coverage
9. **User Experience**: La velocidad percibida es tan importante como la real
10. **Error Recovery**: Los errores van a pasar, prepárate para manejarlos bien
11. **Memory Management**: En móviles, la memoria es limitada y preciosa
12. **Network Efficiency**: Minimiza requests y optimiza payloads
13. **Progressive Enhancement**: Carga lo básico primero, mejora después
14. **Accessibility First**: Diseña para todos desde el inicio
15. **Analytics Driven**: Mide todo lo importante para tomar decisiones basadas en datos

### 🛠️ Comandos Expo Esenciales

```bash
# Crear proyecto
npx create-expo-app MyApp --template tabs
cd MyApp

# Desarrollo
npx expo start
npx expo start --clear  # Con cache limpio
npx expo start --web     # Para web

# Builds
eas build --platform ios --profile preview
eas build --platform android --profile production
eas build --platform all --profile production

# Testing en dispositivos
eas device:create         # Registrar dispositivo iOS
eas build --platform ios --profile development

# Deployment
eas submit --platform ios --profile production
eas submit --platform android --profile production

# Updates OTA
eas update --branch preview
eas update --branch production --message "Bug fixes"

# Utilidades
npx expo install          # Instalar dependencias compatibles
npx expo doctor          # Diagnosticar problemas
npx expo prebuild        # Generar código nativo (si necesario)
```

### 🏆 Patrones de Código de Elite

**Estado Optimizado**:

```jsx
// ❌ Re-renders innecesarios
const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Todo se re-renderiza cuando cambia cualquier cosa
  return <AppContent user={user} products={products} cart={cart} />;
};

// ✅ Estado segregado
const App = () => (
  <UserProvider>
    <ProductsProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductsProvider>
  </UserProvider>
);
```

**Manejo de Errores**:

```jsx
// ❌ Sin manejo
const fetchData = async () => {
  const data = await api.getData();
  setData(data);
};

// ✅ Con manejo completo
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await api.getData();
    setData(data);
  } catch (error) {
    setError(error.message);
    logger.error('Failed to fetch data', error);
  } finally {
    setLoading(false);
  }
};
```

**Performance**:

```jsx
// ❌ Recreación en cada render
const ProductList = ({ products, onProductPress }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard 
          product={item} 
          onPress={() => onProductPress(item.id)}
        />
      )}
    />
  );
};

// ✅ Optimizado con callbacks
const ProductList = ({ products, onProductPress }) => {
  const renderItem = useCallback(({ item }) => (
    <ProductCard 
      product={item} 
      onPress={onProductPress}
    />
  ), [onProductPress]);

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
    />
  );
};
```

---

¡Felicidades! 🎉 Has completado la Expo & React Native Masterclass. Con estos conocimientos estás preparado para crear aplicaciones móviles robustas, performantes y profesionales.

Recuerda: React Native te da el poder de crear apps nativas con JavaScript, pero con gran poder viene gran responsabilidad. Usa estas herramientas sabiamente, siempre pensando en la experiencia del usuario final. ¡A construir apps increíbles! 🚀📱
