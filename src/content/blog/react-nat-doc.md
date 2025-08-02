---
title: 'React Native + TypeScript'
code: 'react-native'
description: 'Guía Práctica: React Native + TypeScript + Clean Architecture'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Práctica: React Native + TypeScript + Clean Architecture

## Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Clean Architecture](#clean-architecture)
4. [TypeScript Patterns](#typescript-patterns)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Manejo de Estado](#manejo-de-estado)
7. [Navegación](#navegación)
8. [Testing](#testing)
9. [Mejores Prácticas](#mejores-prácticas)

---

## Configuración Inicial

### Crear proyecto con TypeScript

```bash
npx react-native@latest init MyApp --template react-native-template-typescript
# o con Expo
npx create-expo-app --template
```markdown

### Configurar TypeScript estricto

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/presentation/components/*"],
      "@/screens/*": ["src/presentation/screens/*"],
      "@/hooks/*": ["src/presentation/hooks/*"],
      "@/services/*": ["src/infrastructure/services/*"],
      "@/domain/*": ["src/domain/*"]
    }
  },
  "include": [
    "src",
    "App.tsx"
  ]
}
```

---

## Estructura de Carpetas

### Organización por Clean Architecture

```
src/
├── domain/                    # Capa de Dominio
│   ├── entities/             # Entidades de negocio
│   ├── repositories/         # Interfaces de repositorios
│   ├── usecases/            # Casos de uso
│   └── types/               # Types del dominio
├── infrastructure/           # Capa de Infraestructura
│   ├── repositories/        # Implementaciones
│   ├── services/           # Servicios externos
│   ├── storage/            # Almacenamiento
│   └── network/            # Cliente HTTP
├── presentation/            # Capa de Presentación
│   ├── components/         # Componentes reutilizables
│   ├── screens/           # Pantallas
│   ├── hooks/             # Custom hooks
│   ├── navigation/        # Configuración de navegación
│   └── context/           # Context providers
└── shared/                 # Código compartido
    ├── constants/
    ├── utils/
    └── types/
```

---

## Clean Architecture

### 1. Entidades del Dominio

```typescript
// src/domain/entities/User.ts
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly isActive: boolean;
}

// src/domain/entities/Product.ts
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly imageUrl?: string;
}
```

### 2. Repositorios (Interfaces)

```typescript
// src/domain/repositories/UserRepository.ts
import { User } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// src/domain/repositories/ProductRepository.ts
import { Product } from '../entities/Product';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
}
```

### 3. Casos de Uso

```typescript
// src/domain/usecases/GetUserProfile.ts
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await this.userRepository.findById(userId);
  
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

// src/domain/usecases/CreateUser.ts
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export interface CreateUserRequest {
  email: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<User> {
    // Validaciones de negocio
    if (!request.email || !request.name) {
      throw new Error('Email and name are required');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Crear el usuario
    return await this.userRepository.create({
      email: request.email,
      name: request.name,
      isActive: true,
    });
  }
}
```

### 4. Implementaciones de Repositorios

```typescript
// src/infrastructure/repositories/ApiUserRepository.ts
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { ApiClient } from '../network/ApiClient';

export class ApiUserRepository implements UserRepository {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User[]>(`/users?email=${email}`);
      return response.data[0] || null;
    } catch (error) {
      throw error;
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await this.apiClient.post<User>('/users', userData);
    return response.data;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const response = await this.apiClient.put<User>(`/users/${id}`, updates);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/users/${id}`);
  }
}
```

### 5. Cliente API

```typescript
// src/infrastructure/network/ApiClient.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || 'Request failed',
          details: responseData,
        } as ApiError;
      }

      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  }
}
```

---

## TypeScript Patterns

### 1. Tipado de Props

```typescript
// src/presentation/components/UserCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../../domain/entities/User';

interface UserCardProps {
  user: User;
  onPress?: (user: User) => void;
  variant?: 'default' | 'compact';
  showActions?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onPress,
  variant = 'default',
  showActions = true,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, variant === 'compact' && styles.compact]}
      onPress={() => onPress?.(user)}
      disabled={!onPress}
    >
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      {showActions && (
        <View style={styles.actions}>
          <Text style={styles.status}>
            {user.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    elevation: 2,
  },
  compact: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    marginTop: 8,
  },
  status: {
    fontSize: 12,
    color: '#007AFF',
  },
});

export default UserCard;
```

### 2. Utility Types

```typescript
// src/shared/types/utils.ts

// Hacer todas las propiedades opcionales excepto las especificadas
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Ejemplo de uso:
// type UpdateUserRequest = PartialExcept<User, 'id'>;

// Omitir múltiples keys
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

// Crear tipos para formularios
export type FormData<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
  };
};

// Estados de carga asíncrona
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Resultado de operaciones
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### 3. Enum y Union Types

```typescript
// src/shared/types/common.ts

// Enums
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// Union Types
export type Theme = 'light' | 'dark' | 'system';
export type ScreenOrientation = 'portrait' | 'landscape';
export type Platform = 'ios' | 'android' | 'web';

// Discriminated Unions
export type ApiResult<T> = 
  | { type: 'loading' }
  | { type: 'success'; data: T }
  | { type: 'error'; error: string };
```

---

## Hooks Personalizados

### 1. Hook para Casos de Uso

```typescript
// src/presentation/hooks/useAsyncOperation.ts
import { useState, useCallback } from 'react';
import { AsyncState } from '../../shared/types/utils';

export function useAsyncOperation<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
  
    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
```

### 2. Hook para Usuarios

```typescript
// src/presentation/hooks/useUser.ts
import { useCallback } from 'react';
import { User } from '../../domain/entities/User';
import { GetUserProfileUseCase } from '../../domain/usecases/GetUserProfile';
import { CreateUserUseCase, CreateUserRequest } from '../../domain/usecases/CreateUser';
import { useAsyncOperation } from './useAsyncOperation';
import { useDependencies } from './useDependencies';

export function useUser() {
  const { userRepository } = useDependencies();
  const getUserProfile = new GetUserProfileUseCase(userRepository);
  const createUser = new CreateUserUseCase(userRepository);

  const {
    data: user,
    loading: userLoading,
    error: userError,
    execute: executeGetUser,
  } = useAsyncOperation<User>();

  const {
    data: newUser,
    loading: createLoading,
    error: createError,
    execute: executeCreateUser,
  } = useAsyncOperation<User>();

  const loadUser = useCallback(
    (userId: string) => executeGetUser(() => getUserProfile.execute(userId)),
    [executeGetUser, getUserProfile]
  );

  const handleCreateUser = useCallback(
    (userData: CreateUserRequest) => 
      executeCreateUser(() => createUser.execute(userData)),
    [executeCreateUser, createUser]
  );

  return {
    // User data
    user,
    userLoading,
    userError,
    loadUser,
  
    // Create user
    newUser,
    createLoading,
    createError,
    createUser: handleCreateUser,
  };
}
```

### 3. Hook para Formularios

```typescript
// src/presentation/hooks/useForm.ts
import { useState, useCallback } from 'react';
import { FormData } from '../../shared/types/utils';

type ValidationRule<T> = (value: T) => string | undefined;

interface UseFormConfig<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormConfig<T>) {
  const [formData, setFormData] = useState<FormData<T>>(() => {
    const initial: FormData<T> = {} as FormData<T>;
    Object.keys(initialValues).forEach((key) => {
      const k = key as keyof T;
      initial[k] = {
        value: initialValues[k],
        error: undefined,
        touched: false,
      };
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar valor de campo
  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        touched: true,
        error: validationRules[field]?.(value),
      },
    }));
  }, [validationRules]);

  // Marcar campo como tocado
  const setTouched = useCallback((field: keyof T, touched: boolean = true) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched,
      },
    }));
  }, []);

  // Validar todos los campos
  const validate = useCallback(() => {
    const newFormData = { ...formData };
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const k = key as keyof T;
      const rule = validationRules[k];
      if (rule) {
        const error = rule(formData[k].value);
        newFormData[k] = {
          ...newFormData[k],
          error,
          touched: true,
        };
        if (error) isValid = false;
      }
    });

    setFormData(newFormData);
    return isValid;
  }, [formData, validationRules]);

  // Submit del formulario
  const handleSubmit = useCallback(async () => {
    if (!validate() || !onSubmit) return;

    setIsSubmitting(true);
    try {
      const values: T = {} as T;
      Object.keys(formData).forEach((key) => {
        const k = key as keyof T;
        values[k] = formData[k].value;
      });

      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, onSubmit]);

  // Reset del formulario
  const reset = useCallback(() => {
    const resetData: FormData<T> = {} as FormData<T>;
    Object.keys(initialValues).forEach((key) => {
      const k = key as keyof T;
      resetData[k] = {
        value: initialValues[k],
        error: undefined,
        touched: false,
      };
    });
    setFormData(resetData);
  }, [initialValues]);

  // Obtener valores actuales
  const getValues = useCallback(() => {
    const values: T = {} as T;
    Object.keys(formData).forEach((key) => {
      const k = key as keyof T;
      values[k] = formData[k].value;
    });
    return values;
  }, [formData]);

  // Verificar si hay errores
  const hasErrors = Object.values(formData).some((field) => Boolean(field.error));

  return {
    formData,
    setValue,
    setTouched,
    validate,
    handleSubmit,
    reset,
    getValues,
    hasErrors,
    isSubmitting,
  };
}
```

---

## Manejo de Estado

### 1. Context con TypeScript

```typescript
// src/presentation/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from '../../domain/entities/User';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
  
    try {
      // Aquí iría la lógica de autenticación
      // const user = await authService.login(email, password);
      const user: User = {
        id: '1',
        email,
        name: 'Usuario Test',
        createdAt: new Date(),
        isActive: true,
      };
  
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Error desconocido' 
      });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Dependency Injection

```typescript
// src/presentation/context/DependencyContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';
import { ApiProductRepository } from '../../infrastructure/repositories/ApiProductRepository';
import { ApiClient } from '../../infrastructure/network/ApiClient';

interface Dependencies {
  userRepository: UserRepository;
  productRepository: ProductRepository;
  apiClient: ApiClient;
}

const DependencyContext = createContext<Dependencies | undefined>(undefined);

interface DependencyProviderProps {
  children: ReactNode;
}

export const DependencyProvider: React.FC<DependencyProviderProps> = ({ children }) => {
  const apiClient = new ApiClient('https://api.example.com');
  const userRepository = new ApiUserRepository(apiClient);
  const productRepository = new ApiProductRepository(apiClient);

  const dependencies: Dependencies = {
    userRepository,
    productRepository,
    apiClient,
  };

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
};

export const useDependencies = (): Dependencies => {
  const context = useContext(DependencyContext);
  if (context === undefined) {
    throw new Error('useDependencies must be used within a DependencyProvider');
  }
  return context;
};
```

---

## Navegación

### Configuración con React Navigation

```typescript
// src/presentation/navigation/types.ts
import { User } from '../../domain/entities/User';

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  UserDetail: { user: User };
  Settings: undefined;
  Login: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

```typescript
// src/presentation/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import { useAuth } from '../context/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

---

## Testing

### 1. Setup de Testing

```typescript
// src/__tests__/setup.ts
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

### 2. Test de Casos de Uso

```typescript
// src/__tests__/usecases/GetUserProfile.test.ts
import { GetUserProfileUseCase } from '../../domain/usecases/GetUserProfile';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetUserProfileUseCase(mockUserRepository);
  });

  it('should return user when found', async () => {
    // Arrange
    const userId = '123';
    const expectedUser: User = {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      isActive: true,
    };
    mockUserRepository.findById.mockResolvedValue(expectedUser);

    // Act
    const result = await useCase.execute(userId);

    // Assert
    expect(result).toEqual(expectedUser);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw error when user not found', async () => {
    // Arrange
    const userId = '123';
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(userId)).rejects.toThrow('User not found');
  });

  it('should throw error when userId is empty', async () => {
    // Act & Assert
    await expect(useCase.execute('')).rejects.toThrow('User ID is required');
  });
});
```

### 3. Test de Componentes

```typescript
// src/__tests__/components/UserCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserCard from '../../presentation/components/UserCard';
import { User } from '../../domain/entities/User';

describe('UserCard', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    isActive: true,
  };

  it('renders user information correctly', () => {
    const { getByText } = render(<UserCard user={mockUser} />);
  
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('Activo')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <UserCard user={mockUser} onPress={mockOnPress} />
    );
  
    fireEvent.press(getByText('Test User'));
    expect(mockOnPress).toHaveBeenCalledWith(mockUser);
  });

  it('hides actions when showActions is false', () => {
    const { queryByText } = render(
      <UserCard user={mockUser} showActions={false} />
    );
  
    expect(queryByText('Activo')).toBeNull();
  });
});
```

### 4. Test de Hooks

```typescript
// src/__tests__/hooks/useUser.test.tsx
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useUser } from '../../presentation/hooks/useUser';
import { DependencyProvider } from '../../presentation/context/DependencyContext';

// Mock de dependencias
const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../presentation/hooks/useDependencies', () => ({
  useDependencies: () => ({
    userRepository: mockUserRepository,
  }),
}));

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load user successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      isActive: true,
    };
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser());

    expect(result.current.userLoading).toBe(false);
    expect(result.current.user).toBeNull();

    await act(async () => {
      await result.current.loadUser('1');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.userLoading).toBe(false);
    expect(result.current.userError).toBeNull();
  });

  it('should handle user loading error', async () => {
    const errorMessage = 'User not found';
    mockUserRepository.findById.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUser());

    await act(async () => {
      try {
        await result.current.loadUser('1');
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.userLoading).toBe(false);
    expect(result.current.userError).toBe(errorMessage);
  });
});
```

---

## Mejores Prácticas

### 1. Estructura de Archivos

```typescript
// ✅ Correcto: Un componente por archivo
// src/presentation/components/Button/Button.tsx
// src/presentation/components/Button/Button.styles.ts
// src/presentation/components/Button/Button.test.tsx
// src/presentation/components/Button/index.ts

// ❌ Incorrecto: Múltiples componentes en un archivo
// src/presentation/components/AllComponents.tsx
```

### 2. Naming Conventions

```typescript
// ✅ Interfaces y Types en PascalCase
interface UserProfile {}
type ApiResponse<T> = {};

// ✅ Enums en PascalCase
enum LoadingState {}

// ✅ Variables y funciones en camelCase
const userName = 'john';
const getUserProfile = () => {};

// ✅ Componentes en PascalCase
const UserCard: React.FC = () => {};

// ✅ Hooks empiezan con 'use'
const useUser = () => {};

// ✅ Casos de uso terminan en 'UseCase'
class GetUserProfileUseCase {}
```

### 3. Error Handling

```typescript
// src/shared/errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

// Uso en casos de uso
export class GetUserProfileUseCase {
  async execute(userId: string): Promise<User> {
    if (!userId) {
      throw new ValidationError('User ID is required', 'userId');
    }

    const user = await this.userRepository.findById(userId);
  
    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }
}
```

### 4. Performance Optimization

```typescript
// src/presentation/components/OptimizedUserList.tsx
import React, { memo, useMemo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { User } from '../../domain/entities/User';
import UserCard from './UserCard';

interface OptimizedUserListProps {
  users: User[];
  onUserPress: (user: User) => void;
  searchQuery?: string;
}

const OptimizedUserList: React.FC<OptimizedUserListProps> = memo(({
  users,
  onUserPress,
  searchQuery = '',
}) => {
  // Memoizar usuarios filtrados
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
  
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Memoizar función de renderizado
  const renderUser: ListRenderItem<User> = useCallback(({ item }) => (
    <UserCard user={item} onPress={onUserPress} />
  ), [onUserPress]);

  // Key extractor optimizado
  const keyExtractor = useCallback((item: User) => item.id, []);

  return (
    <FlatList
      data={filteredUsers}
      renderItem={renderUser}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    />
  );
});

OptimizedUserList.displayName = 'OptimizedUserList';

export default OptimizedUserList;
```

### 5. Custom Hooks Avanzados

```typescript
// src/presentation/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// src/presentation/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      throw error;
    }
  };

  return [storedValue, setValue, loading];
}

// src/presentation/hooks/useInfiniteScroll.ts
import { useState, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchMore: (page: number) => Promise<T[]>;
  initialData?: T[];
  pageSize?: number;
}

export function useInfiniteScroll<T>({
  fetchMore,
  initialData = [],
  pageSize = 20,
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchMore(page);
  
      if (newItems.length < pageSize) {
        setHasMore(false);
      }

      setData(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, hasMore, pageSize]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);

    try {
      const newItems = await fetchMore(1);
      setData(newItems);
      setPage(2);
  
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error refreshing items:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, pageSize]);

  return {
    data,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
}
```

### 6. Configuración de ESLint y Prettier

```json
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    '@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};

// .prettierrc.js
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  tabWidth: 2,
  printWidth: 80,
};
```

### 7. Scripts útiles para package.json

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "react-native clean",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "cd ios && xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Release -archivePath MyApp.xcarchive archive"
  }
}
```

---

## Conclusión

Esta guía cubre los aspectos fundamentales para desarrollar aplicaciones React Native con TypeScript siguiendo principios de Clean Architecture. Las principales ventajas de este enfoque son:

- **Separación de responsabilidades**: Cada capa tiene un propósito específico
- **Testabilidad**: Fácil de probar cada componente por separado
- **Mantenibilidad**: Código organizado y fácil de mantener
- **Escalabilidad**: Estructura que crece bien con el proyecto
- **Type Safety**: TypeScript previene muchos errores en tiempo de desarrollo

### Próximos pasos recomendados

1. Implementar autenticación completa con JWT
2. Agregar persistencia de datos con SQLite o Realm
3. Implementar notificaciones push
4. Configurar CI/CD para automatizar builds y tests
5. Añadir internacionalización (i18n)
6. Implementar deep linking
7. Optimizar performance con herramientas como Flipper
