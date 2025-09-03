---
title: 'Masterclass: Configuración Profesional de Entornos React Native y React'
code: 'react-native'
description: 'Profesional de Entornos React Native y React'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---



# Masterclass: Configuración Profesional de Entornos React Native y React

## Tabla de Contenidos

1. [Configuración del Entorno de Desarrollo](#1-configuración-del-entorno-de-desarrollo)
2. [Estructura de Proyecto Profesional](#2-estructura-de-proyecto-profesional)
3. [Configuración de TypeScript](#3-configuración-de-typescript)
4. [ESLint y Prettier](#4-eslint-y-prettier)
5. [Husky y Lint-staged](#5-husky-y-lint-staged)
6. [Variables de Entorno](#6-variables-de-entorno)
7. [Configuración de Testing](#7-configuración-de-testing)
8. [CI/CD con GitHub Actions](#8-cicd-con-github-actions)
9. [Configuración de Metro (React Native)](#9-configuración-de-metro-react-native)
10. [Gestión de Estados](#10-gestión-de-estados)
11. [Configuración de Navegación](#11-configuración-de-navegación)
12. [Manejo de Assets y Fonts](#12-manejo-de-assets-y-fonts)
13. [Performance y Optimización](#13-performance-y-optimización)
14. [Debugging y DevTools](#14-debugging-y-devtools)
15. [Deployment](#15-deployment)

---

## 1. Configuración del Entorno de Desarrollo

### Requisitos Base

**Para React Native:**

```bash
# Node.js (versión LTS recomendada)
node --version # v18.x o superior

# React Native CLI
npm install -g react-native-cli
# o usar npx para evitar instalaciones globales
npx react-native --version

# Watchman (macOS/Linux)
brew install watchman

# Flipper para debugging
# Descargar desde: https://fbflipper.com/
```

**Configuración de Android (React Native):**

```bash
# Android Studio y SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Configuración de iOS (macOS):**

```bash
# Xcode desde App Store
xcode-select --install
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# CocoaPods
sudo gem install cocoapods
```

---

## 2. Estructura de Proyecto Profesional

### React Native Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── screens/
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   ├── storage/
│   │   └── notifications/
│   ├── store/
│   │   ├── slices/
│   │   └── index.ts
│   ├── utils/
│   ├── types/
│   ├── constants/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── navigation/
│   └── App.tsx
├── __tests__/
├── android/
├── ios/
├── .env.example
├── .env.development
├── .env.staging
├── .env.production
├── metro.config.js
├── babel.config.js
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── package.json
└── README.md
```

### React Web Project Structure

```
my-web-app/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── styles/
│   └── App.tsx
├── build/
├── .env.local
├── .env.development
├── .env.production
├── webpack.config.js (si usas webpack custom)
├── vite.config.ts (si usas Vite)
└── package.json
```

---

## 3. Configuración de TypeScript

### tsconfig.json para React Native

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["components/screens/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "include": [
    "src/**/*",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

### tsconfig.json para React Web

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@pages/*": ["pages/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tipos Globales

```typescript
// src/types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging';
      API_URL: string;
      API_KEY: string;
    }
  }
}

// src/types/navigation.ts (React Native)
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

---

## 4. ESLint y Prettier

### .eslintrc.js para React Native

```javascript
module.exports = {
  root: true,
  extends: [
    '@react-native',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'import'],
  rules: {
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
```

### .eslintrc.js para React Web

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
      },
    ],
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {},
    },
  },
};
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

---

## 5. Husky y Lint-staged

### Configuración

```bash
# Instalar dependencias
npm install --save-dev husky lint-staged

# Configurar husky
npx husky init
```

### package.json

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run type-check
```

### .husky/commit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Conventional commits validation
npx --no -- commitlint --edit $1
```

---

## 6. Variables de Entorno

### React Native con react-native-config

```bash
npm install react-native-config
cd ios && pod install # Solo para iOS
```

### .env.development

```
NODE_ENV=development
API_URL=https://api-dev.example.com
API_KEY=dev_api_key_here
SENTRY_DSN=your_sentry_dsn_dev
```

### .env.production

```
NODE_ENV=production
API_URL=https://api.example.com
API_KEY=prod_api_key_here
SENTRY_DSN=your_sentry_dsn_prod
```

### Uso en código

```typescript
// src/constants/config.ts
import Config from 'react-native-config';

export const config = {
  apiUrl: Config.API_URL!,
  apiKey: Config.API_KEY!,
  sentryDsn: Config.SENTRY_DSN!,
  isDevelopment: Config.NODE_ENV === 'development',
  isProduction: Config.NODE_ENV === 'production',
};
```

### Para React Web

```typescript
// src/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL,
  apiKey: import.meta.env.VITE_API_KEY || process.env.REACT_APP_API_KEY,
  isDevelopment: import.meta.env.DEV || process.env.NODE_ENV === 'development',
};
```

---

## 7. Configuración de Testing

### Jest Configuration (jest.config.js)

```javascript
module.exports = {
  preset: 'react-native', // o 'ts-jest' para React web
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### jest.setup.js

```javascript
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-config
jest.mock('react-native-config', () => ({
  API_URL: 'https://api-test.example.com',
  API_KEY: 'test_key',
}));

// Mock Flipper
jest.mock('react-native-flipper', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
```

### Testing Utilities

```typescript
// src/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '@store/index';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
```

---

## 8. CI/CD con GitHub Actions

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build-android:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Install dependencies
        run: npm ci

      - name: Build Android APK
        run: cd android && ./gradlew assembleDebug

      - name: Upload APK artifact
        uses: actions/upload-artifact@v3
        with:
          name: app-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          echo "Deploy to staging environment"
          # Add your staging deployment commands here

  deploy-production:
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Production
        run: |
          echo "Deploy to production environment"
          # Add your production deployment commands here
```

---

## 9. Configuración de Metro (React Native)

### metro.config.js

```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@screens': './src/components/screens',
      '@services': './src/services',
      '@store': './src/store',
      '@utils': './src/utils',
      '@types': './src/types',
      '@assets': './src/assets',
    },
  },
  transformer: {
    // Soporte para SVG
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

### babel.config.js

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/components/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@utils': './src/utils',
          '@types': './src/types',
          '@assets': './src/assets',
        },
      },
    ],
    'react-native-reanimated/plugin', // Debe ser el último
  ],
};
```

---

## 10. Gestión de Estados

### Redux Toolkit Configuration

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Solo persistir auth
};

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice Example

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@services/auth';
import type { User } from '@types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.login(email, password);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAsync.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

## 11. Configuración de Navegación

### React Navigation Setup

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { RootState } from '@store/index';
import type { RootStackParamList } from '@types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### Bottom Tab Navigator

```typescript
// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'lucide-react-native';

import HomeScreen from '@screens/HomeScreen';
import ProfileScreen from '@screens/ProfileScreen';
import SettingsScreen from '@screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
```

---

## 12. Manejo de Assets y Fonts

### Configuración de Fuentes

```javascript
// react-native.config.js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
};
```

### Tipografía con StyleSheet

```typescript
// src/styles/typography.ts
import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
});
```

### Sistema de Colores

```typescript
// src/styles/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    600: '#4b5563',
    900: '#111827',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof colors;
```

---

## 13. Performance y Optimización

### Lazy Loading Components

```typescript
// src/components/LazyComponent.tsx
import React, { Suspense, lazy } from 'react';
import { ActivityIndicator, View } from 'react-native';

const LazyScreen = lazy(() => import('@screens/HeavyScreen'));

const LazyComponent: React.FC = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <LazyScreen />
    </Suspense>
  );
};

export default LazyComponent;
```

### Memoización y Optimización

```typescript
// src/components/OptimizedList.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

interface Item {
  id: string;
  title: string;
  description: string;
}

interface OptimizedListProps {
  data: Item[];
  onItemPress: (item: Item) => void;
}

const ListItem = memo<{ item: Item; onPress: () => void }>(({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{item.title}</Text>
    <Text>{item.description}</Text>
  </TouchableOpacity>
));

const OptimizedList: React.FC<OptimizedListProps> = ({ data, onItemPress }) => {
  const keyExtractor = useCallback((item: Item) => item.id, []);

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <ListItem
        item={item}
        onPress={() => onItemPress(item)}
      />
    ),
    [onItemPress]
  );

  const memoizedData = useMemo(() => data, [data]);

  return (
    <FlatList
      data={memoizedData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};

export default memo(OptimizedList);
```

---

## 14. Debugging y DevTools

### Flipper Configuration

```typescript
// src/utils/flipper.ts
import { logger } from 'react-native-logs';

const config = {
  severity: __DEV__ ? 'debug' : 'error',
  transport: __DEV__ ? logger.consoleTransport : logger.fileAsyncTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
};

export const log = logger.createLogger(config);

// Uso en componentes
// log.debug('Debug message');
// log.info('Info message');
// log.warn('Warning message');
// log.error('Error message');
```

### React DevTools

```bash
# Instalar React DevTools globalmente
npm install -g react-devtools

# Ejecutar en terminal separada
react-devtools
```

### Debug Network con Reactotron

```typescript
// src/config/reactotron.ts
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
  Reactotron
    .setAsyncStorageHandler(AsyncStorage)
    .configure({ name: 'MyApp' })
    .useReactNative()
    .use(reactotronRedux())
    .connect();

  // Clear Reactotron on each app load
  Reactotron.clear();
}

export default Reactotron;
```

---

## 15. Deployment

### Android Build Configuration

```gradle
// android/app/build.gradle
android {
    ...
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Gradle Properties

```properties
# android/gradle.properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****

# Performance optimizations
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true

# AndroidX
android.useAndroidX=true
android.enableJetifier=true

# React Native
react.gradle.notifyOnApkSuccess=false
```

### iOS Build Configuration

```ruby
# ios/Podfile
platform :ios, '11.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

target 'MyApp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => flags[:fabric_enabled],
    :flipper_configuration => FlipperConfiguration.enabled,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
    
    # Fix for React Native 0.72+
    installer.pods_project.targets.each do |target|
      if target.respond_to?(:product_type) and target.product_type == "com.apple.product-type.bundle"
        target.build_configurations.each do |config|
          config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
        end
      end
    end
  end
end
```

### Fastlane Configuration

```ruby
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "MyApp.xcodeproj")
    build_app(workspace: "MyApp.xcworkspace", scheme: "MyApp")
    upload_to_testflight
  end

  desc "Build and upload to App Store"
  lane :release do
    increment_build_number(xcodeproj: "MyApp.xcodeproj")
    build_app(workspace: "MyApp.xcworkspace", scheme: "MyApp")
    upload_to_app_store
  end
end

platform :android do
  desc "Build and upload to Play Store"
  lane :beta do
    gradle(task: "clean assembleRelease")
    upload_to_play_store(track: 'internal')
  end

  desc "Deploy a new version to the Google Play"
  lane :deploy do
    gradle(task: "clean assembleRelease")
    upload_to_play_store
  end
end
```

---

## 16. Configuraciones Adicionales de Producción

### Code Splitting y Bundle Analyzer

```javascript
// webpack.config.js (React Web)
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // ... otras configuraciones
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
  plugins: [
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
};
```

### Performance Monitoring

```typescript
// src/services/performance.ts
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';

export class PerformanceMonitor {
  static startTrace(identifier: string) {
    if (!__DEV__) {
      return perf().startTrace(identifier);
    }
  }

  static recordError(error: Error, context?: Record<string, any>) {
    if (!__DEV__) {
      crashlytics().recordError(error);
      if (context) {
        crashlytics().setAttributes(context);
      }
    }
  }

  static setUserId(userId: string) {
    if (!__DEV__) {
      crashlytics().setUserId(userId);
    }
  }
}
```

### Security Best Practices

```typescript
// src/utils/security.ts
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export class SecurityUtils {
  static async isDeviceSecure(): Promise<boolean> {
    try {
      const isEmulator = await DeviceInfo.isEmulator();
      const isRooted = await DeviceInfo.isRooted();
      
      return !isEmulator && !isRooted;
    } catch (error) {
      console.warn('Could not check device security:', error);
      return true;
    }
  }

  static validateURL(url: string): boolean {
    const allowedDomains = ['https://api.myapp.com', 'https://myapp.com'];
    return allowedDomains.some(domain => url.startsWith(domain));
  }

  static sanitizeInput(input: string): string {
    return input.replace(/[<>]/g, '');
  }
}
```

---

## 17. Monitoreo y Analytics

### Sentry Configuration

```typescript
// src/config/sentry.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  debug: __DEV__,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
});

export { Sentry };
```

### Custom Hooks para Analytics

```typescript
// src/hooks/useAnalytics.ts
import { useCallback } from 'react';
import analytics from '@react-native-firebase/analytics';

export const useAnalytics = () => {
  const logEvent = useCallback(async (eventName: string, parameters?: object) => {
    if (!__DEV__) {
      await analytics().logEvent(eventName, parameters);
    }
  }, []);

  const setUserProperty = useCallback(async (name: string, value: string) => {
    if (!__DEV__) {
      await analytics().setUserProperty(name, value);
    }
  }, []);

  const setUserId = useCallback(async (userId: string) => {
    if (!__DEV__) {
      await analytics().setUserId(userId);
    }
  }, []);

  return {
    logEvent,
    setUserProperty,
    setUserId,
  };
};
```

---

## 18. Scripts de Automación

### package.json Scripts Completos

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "clean": "react-native clean-project-auto",
    "android:clean": "cd android && ./gradlew clean && cd ..",
    "ios:clean": "cd ios && xcodebuild clean && cd ..",
    "pods:install": "cd ios && pod install && cd ..",
    "pods:update": "cd ios && pod update && cd ..",
    "build:android:debug": "cd android && ./gradlew assembleDebug",
    "build:android:release": "cd android && ./gradlew assembleRelease",
    "build:ios:debug": "react-native run-ios --configuration Debug",
    "build:ios:release": "react-native run-ios --configuration Release",
    "bundle:android": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle",
    "bundle:ios": "react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle",
    "postinstall": "cd ios && pod install",
    "prepare": "husky install"
  }
}
```

### Bash Scripts Utilities

```bash
#!/bin/bash
# scripts/setup-dev.sh

echo "🚀 Setting up development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup iOS dependencies
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Installing iOS dependencies..."
    cd ios && pod install && cd ..
fi

# Setup Husky
echo "🐕 Setting up Husky..."
npm run prepare

# Setup environment files
echo "📋 Setting up environment files..."
if [ ! -f .env.development ]; then
    cp .env.example .env.development
    echo "✅ Created .env.development"
fi

echo "✨ Setup complete! You can now run 'npm start' to begin development."
```

---

## 19. Mejores Prácticas de Código

### Component Patterns

```typescript
// src/components/common/Button/Button.tsx
import React, { forwardRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';
import { buttonStyles } from './Button.styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}, ref) => {
  const buttonStyle = [
    buttonStyles.base,
    buttonStyles[variant],
    buttonStyles[size],
    disabled && buttonStyles.disabled,
    style,
  ];

  const textStyle = [
    buttonStyles.text,
    buttonStyles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
  ];

  return (
    <TouchableOpacity
      ref={ref}
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
      {rightIcon && !loading && rightIcon}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default Button;
```

### Custom Hooks Patterns

```typescript
// src/hooks/useAPI.ts
import { useState, useEffect, useCallback } from 'react';

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAPIOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAPI<T>(
  apiCall: () => Promise<T>,
  options: UseAPIOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
      throw error;
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}
```

---

## 20. Configuración de Desarrollo Local

### Docker Setup (opcional)

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

EXPOSE 3000
EXPOSE 8081

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
      - "8081:8081"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

### VS Code Configuration

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Android",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    },
    {
      "name": "Debug iOS",
      "cwd": "${workspaceFolder}",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios"
    }
  ]
}
```

---

## Conclusiones y Siguientes Pasos

Esta configuración profesional incluye:

✅ **Configuración completa del entorno de desarrollo**
✅ **Estructura de proyecto escalable**
✅ **TypeScript con configuración estricta**
✅ **Linting y formateo automatizado**
✅ **Testing configurado**
✅ **CI/CD pipelines**
✅ **Gestión de estados robusta**
✅ **Navegación optimizada**
✅ **Performance monitoring**
✅ **Security best practices**
✅ **Scripts de automatización**

### Próximos Pasos

1. **Clona esta configuración** para tu proyecto
2. **Adapta las configuraciones** según tus necesidades específicas
3. **Configura las variables de entorno** para tus servicios
4. **Personaliza los scripts** según tu flujo de trabajo
5. **Añade las dependencias específicas** que necesites

### Recursos Adicionales

- [React Native Documentation](https://reactnative.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)

¿Tienes alguna sección específica que quieres que profundice más o alguna configuración particular que necesites?
