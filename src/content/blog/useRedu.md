---
title: 'Master Class: Context API'
description: 'aster Class: Context API en React Native para Datos de Usuario'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# 🚀 Master Class: Context API en React Native para Datos de Usuario

## 📁 Estructura de Archivos Recomendada

```
src/
├── contexts/
│   ├── UserContext.js
│   └── index.js
├── hooks/
│   └── useUser.js
├── services/
│   └── AuthService.js
├── utils/
│   └── storage.js
├── screens/
│   ├── LoginScreen.js
│   ├── ProfileScreen.js
│   └── HomeScreen.js
├── components/
│   └── UserAvatar.js
└── App.js
```

## 🎯 Paso 1: Crear el Context y Provider

### `src/contexts/UserContext.js`

```javascript
import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estados posibles del usuario
const USER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
};

// Estado inicial
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Reducer para manejar el estado
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };

    case USER_ACTIONS.CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Crear el Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Función para cargar usuario desde AsyncStorage
  const loadUserFromStorage = async () => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
    
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
    
      if (userData && token) {
        const user = JSON.parse(userData);
        dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
      } else {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Función para hacer login
  const login = async (userData, token) => {
    try {
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);
    
      // Actualizar estado
      dispatch({ type: USER_ACTIONS.SET_USER, payload: userData });
    
      return { success: true };
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Función para hacer logout
  const logout = async () => {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.multiRemove(['user', 'token']);
    
      // Limpiar estado
      dispatch({ type: USER_ACTIONS.CLEAR_USER });
    
      return { success: true };
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = async (updates) => {
    try {
      const updatedUser = { ...state.user, ...updates };
    
      // Actualizar AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    
      // Actualizar estado
      dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: updates });
    
      return { success: true };
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Función para obtener token
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Cargar usuario al inicializar
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Valor del contexto
  const contextValue = {
    // Estado
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
  
    // Funciones
    login,
    logout,
    updateUser,
    getToken,
    loadUserFromStorage,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export { USER_ACTIONS };
```

### `src/contexts/index.js`

```javascript
export { UserContext, UserProvider, USER_ACTIONS } from './UserContext';
```

## 🎣 Paso 2: Crear Hook Personalizado

### `src/hooks/useUser.js`

```javascript
import { useContext } from 'react';
import { UserContext } from '../contexts';

export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  
  return context;
};

// Hook específico para datos del usuario
export const useUserData = () => {
  const { user, isAuthenticated } = useUser();
  return { user, isAuthenticated };
};

// Hook específico para funciones de autenticación
export const useAuth = () => {
  const { login, logout, isAuthenticated, isLoading } = useUser();
  return { login, logout, isAuthenticated, isLoading };
};
```

## 🔧 Paso 3: Servicio de Autenticación

### `src/services/AuthService.js`

```javascript
const API_BASE_URL = 'https://your-api.com/api';

export class AuthService {
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async updateProfile(token, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error actualizando perfil');
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
```

## 📱 Paso 4: Configurar la App Principal

### `src/App.js`

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './src/contexts';
import { AppNavigator } from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
```

## 📺 Paso 5: Pantallas de Ejemplo

### `src/screens/LoginScreen.js`

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useUser';
import { AuthService } from '../services/AuthService';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
  
    try {
      // Llamar al servicio de autenticación
      const result = await AuthService.login(email, password);
    
      if (result.success) {
        // Usar el contexto para guardar los datos
        const loginResult = await login(result.user, result.token);
      
        if (loginResult.success) {
          // La navegación se manejará automáticamente por el cambio de estado
          console.log('Login exitoso');
        } else {
          Alert.alert('Error', loginResult.error);
        }
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Error inesperado durante el login');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigation.replace('Home');
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
    
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#white" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### `src/screens/HomeScreen.js`

```javascript
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useUser } from '../hooks/useUser';
import { UserAvatar } from '../components/UserAvatar';

export const HomeScreen = ({ navigation }) => {
  const { user, logout } = useUser();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <UserAvatar />
        <Text style={styles.welcome}>
          ¡Hola, {user?.name || 'Usuario'}!
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{user?.id}</Text>
      
        {user?.employee_id && (
          <>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{user.employee_id}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Ver Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userInfo: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### `src/screens/ProfileScreen.js`

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useUser } from '../hooks/useUser';
import { AuthService } from '../services/AuthService';

export const ProfileScreen = () => {
  const { user, updateUser, getToken } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
  
    try {
      const token = await getToken();
      const updates = { name, phone };
    
      // Llamar al API
      const result = await AuthService.updateProfile(token, updates);
    
      if (result.success) {
        // Actualizar el contexto
        await updateUser(result.user);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Error actualizando el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
    
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
        />
      
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Tu teléfono"
          keyboardType="phone-pad"
        />
      
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabled]}
          value={user?.email}
          editable={false}
        />
      
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## 🎨 Paso 6: Componente de Avatar

### `src/components/UserAvatar.js`

```javascript
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUserData } from '../hooks/useUser';

export const UserAvatar = ({ size = 60 }) => {
  const { user } = useUserData();
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (user?.avatar) {
    return (
      <Image
        source={{ uri: user.avatar }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarPlaceholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
        {getInitials(user?.name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: '#ddd',
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontWeight: 'bold',
  },
});
```

## ⚡ Paso 7: Optimizaciones y Buenas Prácticas

### Loading Component Global

```javascript
// src/components/LoadingScreen.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export const LoadingScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.text}>Cargando...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
```

### Context con Múltiples Reducers

```javascript
// src/contexts/AppContext.js - Para expandir funcionalidad
import React, { createContext, useReducer, useContext } from 'react';
import { userReducer, initialUserState } from './reducers/userReducer';
import { themeReducer, initialThemeState } from './reducers/themeReducer';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);
  const [themeState, themeDispatch] = useReducer(themeReducer, initialThemeState);

  return (
    <AppContext.Provider
      value={{
        user: userState,
        theme: themeState,
        userDispatch,
        themeDispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

## 🔒 Implementación de Seguridad

### Token Refresh Automático

```javascript
// src/services/TokenService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export class TokenService {
  static async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
    
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        return data.token;
      }
    
      throw new Error('Token refresh failed');
    } catch (error) {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      throw error;
    }
  }
}
```

## 📋 Checklist de Implementación

* ✅ Crear estructura de archivos
* ✅ Implementar UserContext con reducer
* ✅ Crear hooks personalizados
* ✅ Configurar AsyncStorage para persistencia
* ✅ Implementar servicios de autenticación
* ✅ Crear pantallas de ejemplo
* ✅ Manejar estados de loading y error
* ✅ Implementar componentes reutilizables
* ✅ Configurar navegación condicional
* ✅ Añadir validaciones y seguridad

## 🚀 Uso en Cualquier Componente

```javascript
// En cualquier componente de tu app
import { useUser, useUserData, useAuth } from '../hooks/useUser';

const MiComponente = () => {
  const { user, updateUser } = useUser();
  const { isAuthenticated } = useUserData();
  const { logout } = useAuth();

  // ¡Ya tienes acceso a todos los datos del usuario!
  
  return (
    <View>
      <Text>Hola {user?.name}</Text>
    </View>
  );
};
```

## 🎯 Ventajas de esta Implementación

1. **Centralizado**: Todos los datos del usuario en un solo lugar
2. **Persistente**: Los datos se guardan automáticamente
3. **Reactivo**: Los componentes se actualizan automáticamente
4. **Reutilizable**: Hooks personalizados para diferentes necesidades
5. **Escalable**: Fácil de expandir con más funcionalidades
6. **Tipado**: Preparado para TypeScript
7. **Performante**: Evita prop drilling y re-renders innecesarios

¡Con esta implementación tendrás un sistema robusto para manejar los datos del usuario en toda tu aplicación React Native! 🎉
