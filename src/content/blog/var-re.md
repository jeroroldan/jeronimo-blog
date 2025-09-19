---
title: 'Master Class: Variables de Entorno'
code: 'react-native'
description: 'Master Class: Variables de Entorno con react-native-dotenv'
pubDate: 'Sep 16'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Master Class: Variables de Entorno con react-native-dotenv 🚀

## 🎯 Introducción: ¿Qué son las Variables de Entorno?

Imagina que tu aplicación React Native es como una casa. Las variables de entorno son como los interruptores de luz: necesitas diferentes configuraciones para diferentes situaciones (desarrollo, pruebas, producción), pero no quieres cambiar el cableado cada vez.

**¿Por qué usar variables de entorno?**
- **Seguridad**: Mantener claves API fuera del código
- **Flexibilidad**: Diferentes configuraciones sin recompilar
- **Mantenimiento**: Un solo lugar para cambiar configuraciones
- **Colaboración**: Cada desarrollador puede tener su propia configuración

## 🛠️ Instalación y Configuración Inicial

### Paso 1: Instalación
```bash
npm install react-native-dotenv
# o
yarn add react-native-dotenv
```

### Paso 2: Configuración de Babel
En tu `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      "envName": "APP_ENV",
      "moduleName": "@env",
      "path": ".env",
      "blacklist": null,
      "whitelist": null,
      "safe": false,
      "allowUndefined": true
    }]
  ]
};
```

### Paso 3: TypeScript (si lo usas)
Crea un archivo `types/env.d.ts`:

```typescript
declare module '@env' {
  export const API_URL: string;
  export const APP_ENV: string;
  export const API_KEY: string;
  export const DEBUG_MODE: string;
}
```

## 📁 Estructura de Archivos .env

Piensa en los archivos .env como diferentes "trajes" que tu aplicación puede usar:

```
proyecto/
├── .env                    # Configuración base (siempre se carga)
├── .env.development        # Solo en desarrollo
├── .env.staging           # Para ambiente de pruebas
├── .env.production        # Solo en producción
└── .env.local             # Configuración personal (no subir a git)
```

### Ejemplo de .env base:
```env
# API Configuration
API_URL=https://api.miapp.com
API_TIMEOUT=5000
API_VERSION=v1

# App Configuration
APP_NAME=MiAplicacion
APP_VERSION=1.0.0
DEBUG_MODE=false

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

### Ejemplo de .env.development:
```env
API_URL=http://localhost:3000
DEBUG_MODE=true
ENABLE_ANALYTICS=false
LOG_LEVEL=debug
```

### Ejemplo de .env.production:
```env
API_URL=https://prod.miapp.com
DEBUG_MODE=false
ENABLE_ANALYTICS=true
LOG_LEVEL=error
```

## 🔧 Configuraciones Avanzadas de Babel

### Configuración Básica vs Avanzada

**Configuración Básica:**
```javascript
['module:react-native-dotenv']
```

**Configuración Avanzada:**
```javascript
['module:react-native-dotenv', {
  // Nombre de la variable que determina el entorno
  "envName": "APP_ENV",
  
  // Nombre del módulo para importar
  "moduleName": "@env",
  
  // Ruta del archivo .env principal
  "path": ".env",
  
  // Variables que NO se incluirán
  "blacklist": ["SECRET_KEY", "PRIVATE_TOKEN"],
  
  // Solo estas variables se incluirán
  "whitelist": ["API_URL", "APP_NAME"],
  
  // Modo seguro: solo variables definidas en whitelist
  "safe": false,
  
  // Permitir variables undefined
  "allowUndefined": true,
  
  // Mostrar advertencias
  "verbose": false
}]
```

### 🎨 Analogía del Chef
Piensa en la configuración como las instrucciones de un chef:
- **envName**: "¿Qué tipo de cocina estamos usando?" (francesa, italiana, mexicana)
- **blacklist**: "Ingredientes que NUNCA usamos"
- **whitelist**: "Solo estos ingredientes están permitidos"
- **safe**: "¿Verificamos que tenemos todos los ingredientes antes de cocinar?"

## 💡 Patrones de Uso Fundamentales

### 1. Importación Básica
```javascript
import { API_URL, DEBUG_MODE } from '@env';

console.log('API URL:', API_URL);
console.log('Debug mode:', DEBUG_MODE === 'true');
```

### 2. Validación de Variables
```javascript
import { API_URL, API_KEY } from '@env';

const validateEnvVars = () => {
  const required = { API_URL, API_KEY };
  
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};

validateEnvVars();
```

### 3. Configuración de API Client
```javascript
import { API_URL, API_TIMEOUT, API_KEY } from '@env';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: parseInt(API_TIMEOUT) || 5000,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

### 4. Feature Flags
```javascript
import { ENABLE_ANALYTICS, ENABLE_CRASH_REPORTING } from '@env';

// Componente con feature flag
const AnalyticsComponent = () => {
  if (ENABLE_ANALYTICS !== 'true') {
    return null;
  }
  
  return <AnalyticsTracker />;
};

// Inicialización condicional
if (ENABLE_CRASH_REPORTING === 'true') {
  crashlytics().log('App started');
}
```

## 🏗️ Arquitectura de Configuración Escalable

### 1. Archivo de Configuración Centralizada
```javascript
// config/index.js
import {
  API_URL,
  API_KEY,
  DEBUG_MODE,
  ENABLE_ANALYTICS,
  APP_ENV
} from '@env';

class AppConfig {
  static get api() {
    return {
      baseURL: API_URL,
      key: API_KEY,
      timeout: 5000
    };
  }
  
  static get features() {
    return {
      analytics: ENABLE_ANALYTICS === 'true',
      debugMode: DEBUG_MODE === 'true'
    };
  }
  
  static get environment() {
    return APP_ENV || 'development';
  }
  
  static get isDevelopment() {
    return this.environment === 'development';
  }
  
  static get isProduction() {
    return this.environment === 'production';
  }
}

export default AppConfig;
```

### 2. Uso en la Aplicación
```javascript
// App.js
import AppConfig from './config';

const App = () => {
  useEffect(() => {
    if (AppConfig.features.analytics) {
      Analytics.initialize();
    }
    
    if (AppConfig.isDevelopment) {
      console.log('Running in development mode');
    }
  }, []);
  
  return (
    // Tu aplicación
  );
};
```

## 🎭 Manejo de Diferentes Entornos

### 1. Script de Build Condicional
```json
// package.json
{
  "scripts": {
    "android:dev": "APP_ENV=development react-native run-android",
    "android:staging": "APP_ENV=staging react-native run-android --variant=stagingRelease",
    "android:prod": "APP_ENV=production react-native run-android --variant=release"
  }
}
```

### 2. Configuración Dinámica por Entorno
```javascript
// utils/envConfig.js
import { APP_ENV } from '@env';

const configurations = {
  development: {
    apiUrl: 'http://localhost:3000',
    logLevel: 'debug',
    enableMocking: true
  },
  staging: {
    apiUrl: 'https://staging.miapp.com',
    logLevel: 'info',
    enableMocking: false
  },
  production: {
    apiUrl: 'https://api.miapp.com',
    logLevel: 'error',
    enableMocking: false
  }
};

export const getConfig = () => {
  return configurations[APP_ENV] || configurations.development;
};
```

## 🛡️ Seguridad y Mejores Prácticas

### 1. Variables Sensibles
```javascript
// ❌ MAL - Nunca hagas esto
const SECRET_KEY = "sk_1234567890abcdef";

// ✅ BIEN - Usa variables de entorno
import { SECRET_KEY } from '@env';
```

### 2. Validación de Seguridad
```javascript
// security/envValidator.js
import { API_KEY, SECRET_TOKEN } from '@env';

export const validateSecureVars = () => {
  const secureVars = { API_KEY, SECRET_TOKEN };
  
  for (const [key, value] of Object.entries(secureVars)) {
    if (!value || value.length < 10) {
      throw new Error(`Invalid ${key}: must be at least 10 characters`);
    }
  }
};
```

### 3. Blacklist de Producción
```javascript
// babel.config.js para producción
const productionConfig = {
  plugins: [
    ['module:react-native-dotenv', {
      blacklist: [
        'DEBUG_API_KEY',
        'TEST_USER_TOKEN',
        'DEVELOPMENT_SECRET'
      ]
    }]
  ]
};
```

## 🧪 Testing con Variables de Entorno

### 1. Setup de Testing
```javascript
// __tests__/setup.js
import mockEnv from 'mock-env';

beforeEach(() => {
  mockEnv({
    API_URL: 'http://test.api.com',
    DEBUG_MODE: 'true',
    ENABLE_ANALYTICS: 'false'
  });
});
```

### 2. Mocking Específico
```javascript
// __tests__/apiClient.test.js
jest.mock('@env', () => ({
  API_URL: 'http://mock.api.com',
  API_KEY: 'test-key'
}));

import { createApiClient } from '../api/client';

test('should create client with mocked env vars', () => {
  const client = createApiClient();
  expect(client.defaults.baseURL).toBe('http://mock.api.com');
});
```

## 🚨 Resolución de Problemas Comunes

### Problema 1: Variables no se cargan
**Síntoma**: `undefined` al importar variables

**Solución**:
```javascript
// Verifica que babel.config.js esté configurado correctamente
// Reinicia el bundler: npx react-native start --reset-cache
// Verifica que el archivo .env esté en la raíz del proyecto
```

### Problema 2: Variables no se actualizan
**Síntoma**: Cambios en .env no se reflejan

**Solución**:
```bash
# Limpia caché y reinicia
npx react-native start --reset-cache
# Para Android
cd android && ./gradlew clean && cd ..
# Para iOS
cd ios && xcodebuild clean && cd ..
```

### Problema 3: TypeScript errors
**Síntoma**: "Module '@env' not found"

**Solución**:
```typescript
// types/env.d.ts
declare module '@env' {
  export const API_URL: string;
  // ... otras variables
}

// Asegúrate de que esté incluido en tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```

## 📚 Casos de Uso Avanzados

### 1. Sistema de Feature Flags Avanzado
```javascript
// features/FeatureFlags.js
import {
  FEATURE_NEW_UI,
  FEATURE_PREMIUM,
  FEATURE_BETA_TESTING
} from '@env';

class FeatureFlags {
  static features = {
    newUI: FEATURE_NEW_UI === 'true',
    premium: FEATURE_PREMIUM === 'true',
    betaTesting: FEATURE_BETA_TESTING === 'true'
  };
  
  static isEnabled(feature) {
    return this.features[feature] || false;
  }
  
  static withFeature(feature, component) {
    return this.isEnabled(feature) ? component : null;
  }
}

// Uso en componentes
const MyComponent = () => (
  <View>
    {FeatureFlags.withFeature('newUI', <NewUIComponent />)}
    {!FeatureFlags.isEnabled('newUI') && <OldUIComponent />}
  </View>
);
```

### 2. Configuración Multi-Tenant
```javascript
// config/tenantConfig.js
import { TENANT_ID, TENANT_CONFIG } from '@env';

const tenantConfigurations = {
  client1: {
    theme: { primary: '#FF6B6B', secondary: '#4ECDC4' },
    features: ['analytics', 'chat'],
    apiEndpoint: '/client1'
  },
  client2: {
    theme: { primary: '#6C5CE7', secondary: '#00B894' },
    features: ['analytics'],
    apiEndpoint: '/client2'
  }
};

export const getTenantConfig = () => {
  return tenantConfigurations[TENANT_ID] || tenantConfigurations.client1;
};
```

## 🎯 Consejos de Experto

### 1. Nomenclatura Consistente
```env
# ✅ BIEN - Consistente y descriptivo
API_BASE_URL=https://api.miapp.com
API_TIMEOUT_MS=5000
API_RETRY_COUNT=3

FEATURE_ENABLE_ANALYTICS=true
FEATURE_ENABLE_CRASH_REPORTING=true

LOG_LEVEL=info
LOG_ENABLE_REMOTE=true

# ❌ MAL - Inconsistente
apiUrl=https://api.miapp.com
TIMEOUT=5000
retries=3
```

### 2. Documentación en .env.example
```env
# .env.example
# API Configuration
API_BASE_URL=https://api.example.com  # Base URL for API calls
API_KEY=your_api_key_here             # API authentication key
API_TIMEOUT_MS=5000                   # Request timeout in milliseconds

# Feature Flags
FEATURE_ENABLE_ANALYTICS=true         # Enable analytics tracking
FEATURE_ENABLE_PUSH=false             # Enable push notifications

# Debug Options
DEBUG_MODE=false                      # Enable debug logging
LOG_LEVEL=info                        # Logging level (debug|info|warn|error)
```

### 3. Validación en Runtime
```javascript
// utils/envValidator.js
import { 
  API_URL, 
  API_KEY, 
  APP_ENV 
} from '@env';

export class EnvValidator {
  static rules = {
    API_URL: {
      required: true,
      pattern: /^https?:\/\/.+/,
      message: 'API_URL must be a valid HTTP(S) URL'
    },
    API_KEY: {
      required: true,
      minLength: 20,
      message: 'API_KEY must be at least 20 characters'
    },
    APP_ENV: {
      required: true,
      enum: ['development', 'staging', 'production'],
      message: 'APP_ENV must be development, staging, or production'
    }
  };
  
  static validate() {
    const env = { API_URL, API_KEY, APP_ENV };
    const errors = [];
    
    for (const [key, rules] of Object.entries(this.rules)) {
      const value = env[key];
      
      if (rules.required && !value) {
        errors.push(`${key} is required`);
        continue;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.message);
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(rules.message);
      }
      
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(rules.message);
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
    
    return true;
  }
}
```

## 🎨 Proyecto Final: Sistema Completo

Vamos a crear un sistema completo que demuestre todos los conceptos:

```javascript
// config/AppConfig.js
import {
  API_URL,
  API_KEY,
  APP_ENV,
  DEBUG_MODE,
  FEATURE_ANALYTICS,
  FEATURE_PREMIUM,
  LOG_LEVEL
} from '@env';

import { EnvValidator } from '../utils/envValidator';

class AppConfig {
  constructor() {
    // Validar al inicializar
    EnvValidator.validate();
  }
  
  // API Configuration
  get api() {
    return {
      baseURL: API_URL,
      key: API_KEY,
      timeout: 5000,
      retries: 3
    };
  }
  
  // Environment Info
  get environment() {
    return APP_ENV || 'development';
  }
  
  get isDevelopment() {
    return this.environment === 'development';
  }
  
  get isProduction() {
    return this.environment === 'production';
  }
  
  // Features
  get features() {
    return {
      analytics: FEATURE_ANALYTICS === 'true',
      premium: FEATURE_PREMIUM === 'true',
      debug: DEBUG_MODE === 'true'
    };
  }
  
  // Logging
  get logging() {
    return {
      level: LOG_LEVEL || 'info',
      enabled: !this.isProduction || DEBUG_MODE === 'true'
    };
  }
}

export default new AppConfig();
```

## 🏆 Conclusión

Dominar `react-native-dotenv` es como aprender a ser un director de orquesta: necesitas coordinar múltiples elementos (entornos, configuraciones, secretos) para crear una sinfonía perfecta (tu aplicación).

### Puntos Clave para Recordar:
1. **Separa configuraciones** por entorno (.env.development, .env.production)
2. **Nunca hagas commit** de secretos reales
3. **Valida variables** en tiempo de ejecución
4. **Usa TypeScript** para mayor seguridad de tipos
5. **Centraliza la configuración** en una clase o módulo
6. **Documenta todo** en .env.example
7. **Implementa feature flags** para mayor flexibilidad

¡Ahora eres oficialmente un experto en manejo de variables de entorno con react-native-dotenv! 🎉