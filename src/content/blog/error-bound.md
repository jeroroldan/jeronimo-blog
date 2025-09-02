---
title: 'Masterclass: Error Boundaries con Hooks'
code: 'react'
description: 'La Guía Definitiva para Manejo de Errores en React y React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# 🚨 Masterclass: Error Boundaries con Hooks

## La Guía Definitiva para Manejo de Errores en React y React Native

---

## 📋 Índice

1. [Fundamentos de Error Boundaries](#fundamentos)
2. [Error Boundaries Tradicionales vs Hooks](#comparacion)
3. [react-error-boundary: La Solución Moderna](#react-error-boundary)
4. [Implementación Práctica Paso a Paso](#implementacion)
5. [Patterns Avanzados](#patterns-avanzados)
6. [Error Boundaries en React Native](#react-native)
7. [Testing y Debugging](#testing)
8. [Mejores Prácticas y Antipatrones](#mejores-practicas)
9. [Casos de Uso Reales](#casos-uso)
10. [Troubleshooting Común](#troubleshooting)

---

## 1. Fundamentos de Error Boundaries {#fundamentos}

### ¿Qué son los Error Boundaries?

Los Error Boundaries son componentes especiales en React que **capturan errores de JavaScript** que ocurren en cualquier lugar del árbol de componentes hijo, registran esos errores y muestran una UI de respaldo en lugar de que se rompa toda la aplicación.

### ¿Por qué son Importantes?

```javascript
// ❌ SIN Error Boundary - La app se rompe completamente
function App() {
  return (
    <div>
      <Header />
      <ProblematicComponent /> {/* Si esto falla, toda la app se rompe */}
      <Footer />
    </div>
  );
}

// ✅ CON Error Boundary - Solo falla esa sección
function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ProblematicComponent /> {/* Si esto falla, solo muestra el fallback */}
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```

### Tipos de Errores que Capturan

**✅ Error Boundaries CAPTURAN:**

- Errores en métodos de ciclo de vida
- Errores en constructores
- Errores en el método render
- Errores en componentes hijos

**❌ Error Boundaries NO CAPTURAN:**

- Errores en event handlers
- Errores asíncronos (setTimeout, Promises)
- Errores durante el server-side rendering
- Errores en el propio Error Boundary

---

## 2. Error Boundaries Tradicionales vs Hooks {#comparacion}

### Implementación Tradicional (Class Component)

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de logging
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>;
    }

    return this.props.children;
  }
}
```

### ❌ Problema: No Hay Hook Nativo

React **NO** proporciona hooks nativos para Error Boundaries porque:

1. Los hooks no pueden capturar errores de renderizado
2. `getDerivedStateFromError` y `componentDidCatch` son específicos de class components
3. Los errores de render ocurren antes de que los hooks puedan ejecutarse

### ✅ Solución: react-error-boundary

La librería `react-error-boundary` nos permite usar Error Boundaries con una sintaxis moderna y funcional.

---

## 3. react-error-boundary: La Solución Moderna {#react-error-boundary}

### Instalación

```bash
npm install react-error-boundary
# o
yarn add react-error-boundary
```

### Componentes Principales

#### ErrorBoundary Component

```javascript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: '20px', color: 'red' }}>
      <h2>¡Oops! Algo salió mal:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Intentar de nuevo</button>
    </div>
  );
}

function MyApp() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error capturado:', error, errorInfo);
      }}
      onReset={() => {
        // Limpiar estado, recargar datos, etc.
        window.location.reload();
      }}
    >
      <Header />
      <MainContent />
      <Footer />
    </ErrorBoundary>
  );
}
```

#### useErrorHandler Hook

```javascript
import { useErrorHandler } from 'react-error-boundary';

function ProblematicComponent() {
  const handleError = useErrorHandler();

  const handleAsyncError = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Error al cargar datos');
      }
    } catch (error) {
      // Propaga el error al Error Boundary más cercano
      handleError(error);
    }
  };

  return (
    <button onClick={handleAsyncError}>
      Cargar Datos
    </button>
  );
}
```

---

## 4. Implementación Práctica Paso a Paso {#implementacion}

### Paso 1: Configuración Básica

```javascript
// ErrorBoundary.jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary">
      <h2>🚨 Error de Aplicación</h2>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        <summary>Detalles del error</summary>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </details>
      <button onClick={resetErrorBoundary}>
        🔄 Reintentar
      </button>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Enviar error a servicio de logging (Sentry, LogRocket, etc.)
        console.error('Error capturado por ErrorBoundary:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Paso 2: Implementación en App Principal

```javascript
// App.jsx
import AppErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

function App() {
  return (
    <AppErrorBoundary>
      <div className="app">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </AppErrorBoundary>
  );
}

export default App;
```

### Paso 3: Error Boundaries Granulares

```javascript
// components/UserProfile.jsx
import { ErrorBoundary } from 'react-error-boundary';

function ProfileErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="profile-error">
      <h3>❌ Error al cargar perfil</h3>
      <p>No pudimos cargar la información del usuario</p>
      <button onClick={resetErrorBoundary}>Reintentar</button>
    </div>
  );
}

function UserProfile({ userId }) {
  return (
    <ErrorBoundary
      FallbackComponent={ProfileErrorFallback}
      resetKeys={[userId]} // Reset cuando cambie el userId
      onReset={() => {
        // Limpiar caché del usuario, etc.
        console.log('Reseteando perfil de usuario');
      }}
    >
      <ProfileContent userId={userId} />
    </ErrorBoundary>
  );
}
```

### Paso 4: Manejo de Errores Asíncronos con useErrorHandler

```javascript
// hooks/useApiCall.js
import { useState, useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';

export function useApiCall(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleError = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        // Propaga el error al Error Boundary
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, handleError]);

  return { data, loading };
}
```

### Paso 5: Componente que Usa el Hook

```javascript
// components/DataDisplay.jsx
import { useApiCall } from '../hooks/useApiCall';

function DataDisplay({ endpoint }) {
  const { data, loading } = useApiCall(endpoint);

  if (loading) {
    return <div>🔄 Cargando...</div>;
  }

  return (
    <div>
      <h2>Datos de la API:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataDisplay;
```

---

## 5. Patterns Avanzados {#patterns-avanzados}

### Pattern 1: Error Boundaries por Feature

```javascript
// features/UserManagement/UserErrorBoundary.jsx
import { ErrorBoundary } from 'react-error-boundary';

function UserManagementErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="user-management-error">
      <h2>🔧 Módulo de Usuarios Temporalmente No Disponible</h2>
      <p>Estamos trabajando para resolver este problema.</p>
      <button onClick={resetErrorBoundary}>Reintentar</button>
      <button onClick={() => window.location.href = '/dashboard'}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export function UserManagementErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={UserManagementErrorFallback}
      onError={(error) => {
        // Logging específico del módulo de usuarios
        analytics.track('user_management_error', {
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Pattern 2: Retry con Backoff Strategy

```javascript
// hooks/useRetryableErrorBoundary.js
import { useState, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function useRetryableErrorBoundary() {
  const [retryCount, setRetryCount] = useState(0);
  const [retryDelay, setRetryDelay] = useState(1000);

  const resetErrorBoundary = useCallback(() => {
    const newRetryCount = retryCount + 1;
    const newDelay = Math.min(1000 * Math.pow(2, newRetryCount), 30000); // Max 30 segundos
    
    setRetryCount(newRetryCount);
    setRetryDelay(newDelay);
    
    // Esperar antes de reintentar
    setTimeout(() => {
      window.location.reload();
    }, newDelay);
  }, [retryCount]);

  const RetryableErrorFallback = useCallback(({ error }) => (
    <div className="retryable-error">
      <h2>⚠️ Error Temporal</h2>
      <p>Reintento #{retryCount + 1}</p>
      <p>Próximo intento en {retryDelay / 1000} segundos...</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Reintentar Ahora</button>
    </div>
  ), [retryCount, retryDelay, resetErrorBoundary]);

  return { RetryableErrorFallback, resetErrorBoundary, retryCount };
}
```

### Pattern 3: Error Boundaries Contextuales

```javascript
// contexts/ErrorContext.js
import { createContext, useContext } from 'react';

const ErrorContext = createContext();

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext debe usarse dentro de ErrorProvider');
  }
  return context;
}

export function ErrorProvider({ children }) {
  const errorHandlers = {
    authentication: (error) => {
      console.error('Auth error:', error);
      // Redirect to login
      window.location.href = '/login';
    },
    network: (error) => {
      console.error('Network error:', error);
      // Show toast notification
      showToast('Problema de conexión. Verificando...', 'warning');
    },
    validation: (error) => {
      console.error('Validation error:', error);
      // Show form errors
      showFormErrors(error.validationErrors);
    },
  };

  return (
    <ErrorContext.Provider value={{ errorHandlers }}>
      {children}
    </ErrorContext.Provider>
  );
}
```

### Pattern 4: Error Boundaries con Suspense

```javascript
// components/DataWithSuspense.jsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function DataErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="data-error">
      <h3>❌ Error al cargar datos</h3>
      <button onClick={resetErrorBoundary}>Reintentar</button>
    </div>
  );
}

function DataLoadingFallback() {
  return (
    <div className="data-loading">
      <div className="spinner">🔄</div>
      <p>Cargando datos...</p>
    </div>
  );
}

export function DataWithSuspense({ children }) {
  return (
    <ErrorBoundary FallbackComponent={DataErrorFallback}>
      <Suspense fallback={<DataLoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## 6. Error Boundaries en React Native {#react-native}

### Diferencias Clave en React Native

React Native tiene algunas particularidades en el manejo de errores:

```javascript
// ErrorBoundary.native.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';

function MobileErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Oops! Algo salió mal</Text>
      <Text style={styles.subtitle}>
        No te preocupes, puedes seguir usando la app
      </Text>
      
      <ScrollView style={styles.errorDetails}>
        <Text style={styles.errorText}>{error.message}</Text>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={resetErrorBoundary}
      >
        <Text style={styles.buttonText}>🔄 Reintentar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => {
          // Navegar a pantalla principal
          navigation.navigate('Home');
        }}
      >
        <Text style={styles.buttonText}>🏠 Ir al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorDetails: {
    maxHeight: 200,
    backgroundColor: '#f1f3f4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### Navigation Error Handling

```javascript
// navigation/NavigationErrorBoundary.jsx
import { NavigationContainer } from '@react-navigation/native';
import { ErrorBoundary } from 'react-error-boundary';

function NavigationErrorFallback({ error, resetErrorBoundary }) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Error de navegación</Text>
      <TouchableOpacity onPress={resetErrorBoundary}>
        <Text>Reiniciar navegación</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export function AppNavigationContainer({ children }) {
  return (
    <ErrorBoundary FallbackComponent={NavigationErrorFallback}>
      <NavigationContainer
        onStateChange={(state) => {
          // Log navigation state changes
          console.log('Navigation state:', state);
        }}
        onError={(error) => {
          // Log navigation errors
          console.error('Navigation error:', error);
        }}
      >
        {children}
      </NavigationContainer>
    </ErrorBoundary>
  );
}
```

### Crash Reporting Integration

```javascript
// services/crashReporting.js
import crashlytics from '@react-native-firebase/crashlytics';

export function logErrorToCrashlytics(error, errorInfo) {
  crashlytics().recordError(error);
  crashlytics().setAttributes({
    component_stack: errorInfo.componentStack,
    error_boundary: true,
  });
}

// En tu ErrorBoundary
<ErrorBoundary
  FallbackComponent={MobileErrorFallback}
  onError={(error, errorInfo) => {
    logErrorToCrashlytics(error, errorInfo);
  }}
>
  {children}
</ErrorBoundary>
```

---

## 7. Testing y Debugging {#testing}

### Testing Error Boundaries

```javascript
// __tests__/ErrorBoundary.test.jsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';

// Mock console.error para silenciar en tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

function ThrowError({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

function TestErrorFallback({ error }) {
  return <div>Error caught: {error.message}</div>;
}

test('should catch and display error', () => {
  render(
    <ErrorBoundary FallbackComponent={TestErrorFallback}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  );

  expect(screen.getByText('Error caught: Test error')).toBeInTheDocument();
});

test('should not display error fallback when no error', () => {
  render(
    <ErrorBoundary FallbackComponent={TestErrorFallback}>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  );

  expect(screen.getByText('No error')).toBeInTheDocument();
  expect(screen.queryByText(/Error caught/)).not.toBeInTheDocument();
});
```

### Testing useErrorHandler Hook

```javascript
// __tests__/useErrorHandler.test.jsx
import { renderHook } from '@testing-library/react';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';

function TestWrapper({ children }) {
  return (
    <ErrorBoundary FallbackComponent={() => <div>Error boundary triggered</div>}>
      {children}
    </ErrorBoundary>
  );
}

test('useErrorHandler should trigger error boundary', () => {
  let handleError;
  
  const { result } = renderHook(
    () => {
      handleError = useErrorHandler();
      return handleError;
    },
    { wrapper: TestWrapper }
  );

  expect(() => {
    result.current(new Error('Async error'));
  }).toThrow('Async error');
});
```

### Debugging Técnicas

```javascript
// utils/errorDebug.js
export function createDetailedErrorInfo(error, errorInfo, additionalContext = {}) {
  return {
    // Información básica del error
    message: error.message,
    stack: error.stack,
    name: error.name,
    
    // Información del componente
    componentStack: errorInfo?.componentStack,
    
    // Contexto adicional
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: localStorage.getItem('userId'), // Si tienes auth
    
    // Estado de la aplicación
    reduxState: window.__REDUX_STATE__, // Si usas Redux
    
    // Contexto personalizado
    ...additionalContext,
  };
}

// Uso en ErrorBoundary
<ErrorBoundary
  onError={(error, errorInfo) => {
    const detailedInfo = createDetailedErrorInfo(error, errorInfo, {
      featureFlag: 'user-management-v2',
      experimentGroup: 'control',
    });
    
    // Enviar a servicio de logging
    logService.error('React Error Boundary', detailedInfo);
  }}
>
  {children}
</ErrorBoundary>
```

### Development vs Production Error Handling

```javascript
// utils/errorHandling.js
const isDevelopment = process.env.NODE_ENV === 'development';

export function createErrorFallback(componentName) {
  return function ErrorFallback({ error, resetErrorBoundary }) {
    return (
      <div className="error-fallback">
        <h2>🚨 Error en {componentName}</h2>
        
        {isDevelopment && (
          <details open>
            <summary>Información de desarrollo</summary>
            <pre style={{ color: 'red', fontSize: '12px' }}>
              {error.stack}
            </pre>
          </details>
        )}
        
        {!isDevelopment && (
          <p>Algo salió mal. Nuestro equipo ha sido notificado.</p>
        )}
        
        <button onClick={resetErrorBoundary}>
          Reintentar
        </button>
      </div>
    );
  };
}
```

---

## 8. Mejores Prácticas y Antipatrones {#mejores-practicas}

### ✅ Mejores Prácticas

#### 1. Granularidad Apropiada

```javascript
// ✅ CORRECTO - Error boundaries granulares
function App() {
  return (
    <div>
      <Header /> {/* Sin Error Boundary - header siempre debe funcionar */}
      
      <ErrorBoundary fallback={<SidebarError />}>
        <Sidebar />
      </ErrorBoundary>
      
      <main>
        <ErrorBoundary fallback={<MainContentError />}>
          <MainContent />
        </ErrorBoundary>
      </main>
      
      <Footer /> {/* Sin Error Boundary - footer siempre debe funcionar */}
    </div>
  );
}

// ❌ INCORRECTO - Error boundary demasiado amplio
function App() {
  return (
    <ErrorBoundary fallback={<AppBrokenError />}>
      <div>
        <Header />
        <Sidebar />
        <MainContent />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
```

#### 2. Reset Keys Apropiadas

```javascript
// ✅ CORRECTO - Reset cuando cambian datos críticos
<ErrorBoundary
  resetKeys={[userId, routeId]} // Reset cuando cambie el contexto
  onReset={() => {
    // Limpiar estado relacionado
    queryClient.invalidateQueries(['user', userId]);
  }}
>
  <UserProfile userId={userId} />
</ErrorBoundary>

// ❌ INCORRECTO - Reset innecesario
<ErrorBoundary
  resetKeys={[timestamp]} // Se reseteará constantemente
>
  <UserProfile />
</ErrorBoundary>
```

#### 3. Fallbacks Informativos y Útiles

```javascript
// ✅ CORRECTO - Fallback útil e informativo
function UserProfileErrorFallback({ error, resetErrorBoundary }) {
  const isNetworkError = error.message.includes('fetch');
  
  return (
    <div className="user-profile-error">
      <h3>No pudimos cargar tu perfil</h3>
      
      {isNetworkError ? (
        <p>Parece que hay un problema de conexión.</p>
      ) : (
        <p>Ocurrió un error inesperado.</p>
      )}
      
      <div className="error-actions">
        <button onClick={resetErrorBoundary}>
          Reintentar
        </button>
        <button onClick={() => navigate('/dashboard')}>
          Ir al Dashboard
        </button>
        <button onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    </div>
  );
}

// ❌ INCORRECTO - Fallback inútil
function BadErrorFallback() {
  return <div>Error</div>; // No da información ni opciones al usuario
}
```

#### 4. Logging Estructurado

```javascript
// ✅ CORRECTO - Logging estructurado y útil
function logError(error, errorInfo, context = {}) {
  const errorData = {
    // Error info
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    
    // User context
    userId: auth.currentUser?.id,
    userRole: auth.currentUser?.role,
    
    // App context
    route: location.pathname,
    timestamp: Date.now(),
    buildVersion: process.env.REACT_APP_VERSION,
    
    // Custom context
    ...context,
  };
  
  // Diferentes servicios según el entorno
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { errorBoundary: true },
      extra: errorData,
    });
  } else {
    console.group('🚨 Error Boundary');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Context:', context);
    console.groupEnd();
  }
}
```

### ❌ Antipatrones Comunes

#### 1. Usar Error Boundaries para Lógica de Negocio

```javascript
// ❌ MAL - Usar error boundary para manejo de estados de negocio
function LoginForm() {
  const handleSubmit = (data) => {
    if (!data.email) {
      throw new Error('Email is required'); // NO hagas esto
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ BIEN - Manejo apropiado de validación
function LoginForm() {
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (data) => {
    const validationErrors = {};
    if (!data.email) {
      validationErrors.email = 'Email es requerido';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Proceder con login...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {errors.email && <span className="error">{errors.email}</span>}
      {/* resto del form */}
    </form>
  );
}
```

#### 2. Error Boundaries en Lugares Incorrectos

```javascript
// ❌ MAL - Error boundary en event handler
function BadButton() {
  const handleClick = () => {
    return (
      <ErrorBoundary> {/* Esto no funcionará */}
        {riskyOperation()}
      </ErrorBoundary>
    );
  };
  
  return <button onClick={handleClick}>Click</button>;
}

// ✅ BIEN - Error boundary en el lugar correcto
function GoodButton() {
  const handleError = useErrorHandler();
  
  const handleClick = async () => {
    try {
      await riskyAsyncOperation();
    } catch (error) {
      handleError(error); // Propaga al Error Boundary
    }
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

#### 3. Error Boundaries Anidados Innecesariamente

```javascript
// ❌ MAL - Anidamiento innecesario
function OverEngineeredComponent() {
  return (
    <ErrorBoundary fallback={<AppError />}>
      <ErrorBoundary fallback={<SectionError />}>
        <ErrorBoundary fallback={<ComponentError />}>
          <ErrorBoundary fallback={<SubComponentError />}>
            <SimpleComponent />
          </ErrorBoundary>
        </ErrorBoundary>
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

// ✅ BIEN - Anidamiento lógico y necesario
function WellStructuredApp() {
  return (
    <ErrorBoundary fallback={<AppCrashFallback />}>
      <Header />
      <main>
        <ErrorBoundary fallback={<FeatureUnavailable />}>
          <CriticalFeature />
        </ErrorBoundary>
        <StableContent />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
```

#### 4. No Proveer Información de Contexto

```javascript
// ❌ MAL - Error sin contexto
function BadErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={<GenericError />}
      onError={(error) => {
        console.log(error); // Información limitada
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// ✅ BIEN - Error con contexto rico
function GoodErrorBoundary({ featureName, userId, children }) {
  return (
    <ErrorBoundary
      fallback={<ContextualError featureName={featureName} />}
      onError={(error, errorInfo) => {
        logError(error, errorInfo, {
          feature: featureName,
          userId: userId,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## 9. Casos de Uso Reales {#casos-uso}

### Caso 1: E-commerce - Carrito de Compras

```javascript
// components/ShoppingCart/ShoppingCartErrorBoundary.jsx
import { ErrorBoundary } from 'react-error-boundary';
import { useShoppingCart } from '../../hooks/useShoppingCart';

function ShoppingCartErrorFallback({ error, resetErrorBoundary }) {
  const { itemCount } = useShoppingCart();
  
  return (
    <div className="cart-error">
      <h3>🛒 Problema con el carrito</h3>
      <p>
        {itemCount > 0 
          ? `Tienes ${itemCount} productos en tu carrito. No los perderás.`
          : 'Tu carrito está vacío.'
        }
      </p>
      
      <div className="cart-error-actions">
        <button onClick={resetErrorBoundary}>
          🔄 Reintentar carrito
        </button>
        <button onClick={() => navigate('/products')}>
          🛍️ Seguir comprando
        </button>
        {itemCount > 0 && (
          <button onClick={() => navigate('/checkout')}>
            💳 Proceder al pago
          </button>
        )}
      </div>
    </div>
  );
}

export function ShoppingCartWithErrorBoundary({ children }) {
  const { cartId } = useShoppingCart();
  
  return (
    <ErrorBoundary
      FallbackComponent={ShoppingCartErrorFallback}
      resetKeys={[cartId]}
      onError={(error, errorInfo) => {
        analytics.track('shopping_cart_error', {
          error: error.message,
          cartId,
          itemCount: getCartItemCount(),
          userType: getUserType(),
        });
      }}
      onReset={() => {
        // Sincronizar carrito con servidor
        syncCartWithServer();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Caso 2: Dashboard Analítico

```javascript
// components/Dashboard/DashboardErrorBoundary.jsx
import { ErrorBoundary } from 'react-error-boundary';

function DashboardWidgetErrorFallback({ error, resetErrorBoundary, widgetName }) {
  const isDataError = error.message.includes('data');
  const isNetworkError = error.message.includes('fetch') || error.name === 'NetworkError';
  
  return (
    <div className="widget-error">
      <div className="widget-error-header">
        <h4>📊 {widgetName}</h4>
        <span className="error-status">
          {isNetworkError ? '🔌 Sin conexión' : '⚠️ Error de datos'}
        </span>
      </div>
      
      <div className="widget-error-body">
        {isNetworkError ? (
          <p>Verificando conexión...</p>
        ) : isDataError ? (
          <p>Los datos no están disponibles temporalmente</p>
        ) : (
          <p>Error al cargar el widget</p>
        )}
      </div>
      
      <div className="widget-error-actions">
        <button onClick={resetErrorBoundary} className="btn-retry">
          🔄 Reintentar
        </button>
        <button onClick={() => exportWidgetData(widgetName)} className="btn-export">
          📥 Exportar datos anteriores
        </button>
      </div>
    </div>
  );
}

export function DashboardWidget({ children, widgetName, refreshInterval }) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <DashboardWidgetErrorFallback {...props} widgetName={widgetName} />
      )}
      resetKeys={[widgetName]}
      onError={(error, errorInfo) => {
        dashboardLogger.error(`Widget ${widgetName} failed`, {
          error: error.message,
          widget: widgetName,
          refreshInterval,
          componentStack: errorInfo.componentStack,
        });
      }}
      onReset={() => {
        // Refrescar datos del widget específico
        refreshWidgetData(widgetName);
      }}
    >
      <div className="dashboard-widget" data-widget={widgetName}>
        {children}
      </div>
    </ErrorBoundary>
  );
}
```

### Caso 3: Chat en Tiempo Real

```javascript
// components/Chat/ChatErrorBoundary.jsx
import { ErrorBoundary } from 'react-error-boundary';
import { useChatConnection } from '../../hooks/useChatConnection';

function ChatErrorFallback({ error, resetErrorBoundary }) {
  const { connectionStatus, reconnect } = useChatConnection();
  
  const isConnectionError = error.message.includes('WebSocket') || 
                           error.message.includes('connection');
  
  return (
    <div className="chat-error">
      <div className="chat-error-header">
        💬 <span className="chat-title">Chat</span>
        <span className={`connection-status ${connectionStatus}`}>
          {connectionStatus === 'connected' && '🟢 Conectado'}
          {connectionStatus === 'connecting' && '🟡 Conectando...'}
          {connectionStatus === 'disconnected' && '🔴 Desconectado'}
        </span>
      </div>
      
      <div className="chat-error-content">
        {isConnectionError ? (
          <>
            <p>⚡ Se perdió la conexión del chat</p>
            <p>Los mensajes se guardarán localmente y se enviarán cuando se restablezca la conexión.</p>
          </>
        ) : (
          <>
            <p>🔧 Problema técnico del chat</p>
            <p>Estamos trabajando para solucionarlo.</p>
          </>
        )}
      </div>
      
      <div className="chat-error-actions">
        <button onClick={reconnect} disabled={connectionStatus === 'connecting'}>
          {connectionStatus === 'connecting' ? '⏳ Conectando...' : '🔄 Reconectar'}
        </button>
        <button onClick={resetErrorBoundary}>
          🆕 Reiniciar chat
        </button>
        <button onClick={() => openOfflineMode()}>
          📝 Continuar sin conexión
        </button>
      </div>
    </div>
  );
}

export function ChatErrorBoundary({ children, chatRoomId }) {
  const { connectionStatus } = useChatConnection();
  
  return (
    <ErrorBoundary
      FallbackComponent={ChatErrorFallback}
      resetKeys={[chatRoomId, connectionStatus]}
      onError={(error, errorInfo) => {
        chatLogger.error('Chat component error', {
          error: error.message,
          chatRoomId,
          connectionStatus,
          activeUsers: getActiveUserCount(),
          messageQueue: getPendingMessageCount(),
        });
      }}
      onReset={() => {
        // Limpiar estado del chat y reconectar
        clearChatState();
        reconnectToChat(chatRoomId);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Caso 4: Formulario Complejo con Múltiples Pasos

```javascript
// components/Forms/MultiStepFormErrorBoundary.jsx
import { ErrorBoundary } from 'react-error-boundary';
import { useFormProgress } from '../../hooks/useFormProgress';

function FormStepErrorFallback({ error, resetErrorBoundary }) {
  const { currentStep, totalSteps, canGoBack, goToPreviousStep, saveProgress } = useFormProgress();
  
  const isValidationError = error.message.includes('validation');
  const isNetworkError = error.message.includes('fetch');
  
  return (
    <div className="form-step-error">
      <div className="form-progress">
        <span>Paso {currentStep} de {totalSteps}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="error-content">
        <h3>⚠️ Problema en el formulario</h3>
        
        {isValidationError && (
          <div className="validation-error">
            <p>Algunos campos tienen errores de validación.</p>
            <p>Puedes corregirlos y continuar.</p>
          </div>
        )}
        
        {isNetworkError && (
          <div className="network-error">
            <p>No se pudo guardar el progreso.</p>
            <p>Tu información está segura localmente.</p>
          </div>
        )}
        
        {!isValidationError && !isNetworkError && (
          <div className="generic-error">
            <p>Ocurrió un error inesperado.</p>
            <p>Tu progreso ha sido guardado.</p>
          </div>
        )}
      </div>
      
      <div className="form-error-actions">
        <button onClick={resetErrorBoundary} className="btn-primary">
          🔄 Reintentar
        </button>
        
        {canGoBack && (
          <button onClick={goToPreviousStep} className="btn-secondary">
            ⬅️ Paso anterior
          </button>
        )}
        
        <button onClick={saveProgress} className="btn-secondary">
          💾 Guardar progreso
        </button>
        
        <button 
          onClick={() => navigate('/forms/saved')} 
          className="btn-link"
        >
          📋 Ver formularios guardados
        </button>
      </div>
    </div>
  );
}

export function MultiStepFormErrorBoundary({ children, formId }) {
  const { currentStep, formData } = useFormProgress();
  
  return (
    <ErrorBoundary
      FallbackComponent={FormStepErrorFallback}
      resetKeys={[currentStep]}
      onError={(error, errorInfo) => {
        formLogger.error('Multi-step form error', {
          error: error.message,
          formId,
          currentStep,
          completedFields: getCompletedFieldsCount(formData),
          totalFields: getTotalFieldsCount(),
          timeSpent: getFormTimeSpent(),
        });
      }}
      onReset={() => {
        // Auto-guardar progreso antes de reset
        autoSaveFormProgress(formId, formData);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## 10. Troubleshooting Común {#troubleshooting}

### Problema 1: Error Boundary No Captura Errores Asíncronos

```javascript
// ❌ PROBLEMA - Error async no capturado
function ProblematicComponent() {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('Error asíncrono'); // No será capturado
    }, 1000);
  }, []);
  
  return <div>Componente con error async</div>;
}

// ✅ SOLUCIÓN - Usar useErrorHandler
function FixedComponent() {
  const handleError = useErrorHandler();
  
  useEffect(() => {
    setTimeout(() => {
      try {
        throw new Error('Error asíncrono');
      } catch (error) {
        handleError(error); // Será capturado por Error Boundary
      }
    }, 1000);
  }, [handleError]);
  
  return <div>Componente con manejo correcto</div>;
}

// ✅ SOLUCIÓN ALTERNATIVA - Hook personalizado
function useAsyncErrorHandler() {
  const handleError = useErrorHandler();
  
  return useCallback((asyncFunction) => {
    return async (...args) => {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        handleError(error);
      }
    };
  }, [handleError]);
}

function ComponentWithCustomHook() {
  const safeAsyncCall = useAsyncErrorHandler();
  
  const handleClick = safeAsyncCall(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('API Error');
    return response.json();
  });
  
  return <button onClick={handleClick}>Cargar datos</button>;
}
```

### Problema 2: Error Boundaries No se Resetean Correctamente

```javascript
// ❌ PROBLEMA - Reset key no cambia
function ProblematicUsage() {
  const [userData, setUserData] = useState(null);
  
  return (
    <ErrorBoundary
      resetKeys={[userData]} // userData puede ser null por mucho tiempo
      onReset={() => {
        console.log('Resetting...'); // Puede no ejecutarse
      }}
    >
      <UserProfile userData={userData} />
    </ErrorBoundary>
  );
}

// ✅ SOLUCIÓN - Reset keys más específicas
function FixedUsage() {
  const [userId, setUserId] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  
  const forceReset = () => setResetKey(prev => prev + 1);
  
  return (
    <ErrorBoundary
      resetKeys={[userId, resetKey]} // Keys que realmente cambian
      onReset={() => {
        console.log('Resetting user profile...');
        // Limpiar estado relacionado
        clearUserCache(userId);
      }}
    >
      <UserProfile userId={userId} onForceReset={forceReset} />
    </ErrorBoundary>
  );
}
```

### Problema 3: Loops Infinitos de Error

```javascript
// ❌ PROBLEMA - Loop infinito de errores
function InfiniteErrorLoop() {
  const [count, setCount] = useState(0);
  
  return (
    <ErrorBoundary
      resetKeys={[count]}
      onReset={() => {
        setCount(prev => prev + 1); // Esto puede causar nuevo error
      }}
    >
      <ProblematicComponent count={count} />
    </ErrorBoundary>
  );
}

// ✅ SOLUCIÓN - Limitar reintentos
function SafeErrorHandling() {
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  const handleReset = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
    } else {
      // Mostrar error permanente o redireccionar
      navigate('/error-page');
    }
  };
  
  if (retryCount >= MAX_RETRIES) {
    return (
      <div className="max-retries-reached">
        <h3>🚫 Demasiados intentos fallidos</h3>
        <p>Por favor, contacta al soporte técnico.</p>
        <button onClick={() => setRetryCount(0)}>
          Reiniciar contador
        </button>
      </div>
    );
  }
  
  return (
    <ErrorBoundary
      resetKeys={[retryCount]}
      onReset={handleReset}
      FallbackComponent={({ resetErrorBoundary }) => (
        <div>
          <p>Intento {retryCount + 1} de {MAX_RETRIES}</p>
          <button onClick={resetErrorBoundary}>Reintentar</button>
        </div>
      )}
    >
      <ProblematicComponent />
    </ErrorBoundary>
  );
}
```

### Problema 4: Error Boundaries en Tests

```javascript
// ❌ PROBLEMA - Tests que fallan por console.error
test('should handle error gracefully', () => {
  render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ComponentThatThrows />
    </ErrorBoundary>
  );
  // Test falla por console.error no mockeado
});

// ✅ SOLUCIÓN - Mockear console.error
describe('Error Boundary Tests', () => {
  let consoleSpy;
  
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  
  test('should handle error gracefully', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ComponentThatThrows />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

// ✅ SOLUCIÓN ALTERNATIVA - Custom render helper
function renderWithErrorBoundary(ui, options = {}) {
  const { fallback = ErrorFallback, ...renderOptions } = options;
  
  // Silenciar console.error automáticamente
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  const result = render(
    <ErrorBoundary FallbackComponent={fallback}>
      {ui}
    </ErrorBoundary>,
    renderOptions
  );
  
  return {
    ...result,
    consoleSpy,
    cleanup: () => consoleSpy.mockRestore(),
  };
}
```

### Problema 5: Rendimiento con Error Boundaries

```javascript
// ❌ PROBLEMA - Re-renders innecesarios
function ExpensiveErrorBoundary({ children, userId, complexData }) {
  return (
    <ErrorBoundary
      resetKeys={[userId, complexData]} // complexData cambia frecuentemente
      onError={(error) => {
        // Operación costosa en cada error
        performExpensiveLogging(error, complexData);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// ✅ SOLUCIÓN - Optimizar reset keys y callbacks
function OptimizedErrorBoundary({ children, userId, complexData }) {
  // Solo usar partes específicas de complexData que importan
  const stableResetKey = useMemo(() => {
    return complexData?.criticalField || null;
  }, [complexData?.criticalField]);
  
  // Memoizar callback costoso
  const handleError = useCallback((error) => {
    // Defer expensive operations
    setTimeout(() => {
      performExpensiveLogging(error, {
        userId,
        criticalField: complexData?.criticalField,
        timestamp: Date.now(),
      });
    }, 0);
  }, [userId, complexData?.criticalField]);
  
  return (
    <ErrorBoundary
      resetKeys={[userId, stableResetKey]}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## 🎓 Resumen y Certificación de Maestría

### Conceptos Clave Dominados

Al completar esta masterclass, ya dominas:

1. **Fundamentos**: Qué son, cuándo usar, y limitaciones de Error Boundaries
2. **Implementación Moderna**: react-error-boundary y hooks asociados
3. **Patterns Avanzados**: Granularidad, retry strategies, contextos
4. **React Native**: Adaptaciones específicas para móvil
5. **Testing**: Estrategias de prueba y debugging
6. **Mejores Prácticas**: Qué hacer y qué evitar
7. **Casos Reales**: Implementaciones en aplicaciones del mundo real
8. **Troubleshooting**: Solución a problemas comunes

### Checklist de Dominio ✅

- [ ] Puedo explicar la diferencia entre Error Boundaries tradicionales y con hooks
- [ ] Sé cuándo y dónde colocar Error Boundaries en mi aplicación
- [ ] Puedo manejar errores asíncronos con useErrorHandler
- [ ] Entiendo cómo implementar retry strategies y backoff
- [ ] Puedo crear fallbacks informativos y útiles para usuarios
- [ ] Sé cómo integrar Error Boundaries con servicios de logging
- [ ] Puedo testear Error Boundaries correctamente
- [ ] Entiendo las particularidades en React Native
- [ ] Puedo evitar antipatrones comunes
- [ ] Sé cómo debuggear y solucionar problemas comunes

### Próximos Pasos 🚀

1. **Implementa** Error Boundaries en tu proyecto actual
2. **Experimenta** con diferentes patterns según tus necesidades
3. **Integra** con servicios de monitoring (Sentry, LogRocket, etc.)
4. **Comparte** conocimiento con tu equipo
5. **Mantente actualizado** con nuevos patterns y herramientas

### Recursos Adicionales 📚

- [Documentación oficial de React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [react-error-boundary en GitHub](https://github.com/bvaughn/react-error-boundary)
- [Error Handling en React Native](https://reactnative.dev/docs/error-boundaries)
- [Sentry para React](https://docs.sentry.io/platforms/javascript/guides/react/)

---

## 🏆 ¡Felicitaciones

Has completado la masterclass más completa sobre Error Boundaries con Hooks. Ahora tienes todas las herramientas y conocimientos necesarios para implementar manejo de errores robusto y profesional en tus aplicaciones React y React Native.

**¿Tienes dudas específicas o quieres profundizar en algún tema particular?** ¡No dudes en preguntar!
