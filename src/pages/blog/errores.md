---
title: "Errores Comunes en la Caza: Guía para Mejorar tus Habilidades Sociales"
description: "Los errores más frecuentes que cometen los hombres al intentar conquistar y cómo transformarlos en habilidades sociales genuinas."
pubDate: "2026-04-15"
code: "errores-seduccion"
category: "aprendizaje"
tags: ["seduccion", "relaciones", "habilidades-sociales", "error-comunes", "desarrollo-personal"]
difficulty: "principiante"
readingTime: 10
---


## ¿Qué vas a aprender

En este contenido desarrollarás tus habilidades sociales y de conexión interpersonal:

- Psicología de la atracción y principios de influencia aplicados éticamente
- Comunicación no verbal, lectura de señales y presencia magnética
- Habilidades conversacionales: iniciación, profundidad y cierre
- Construcción de confianza auténtica y vulnerabilidad como herramienta
- Errores comunes, anti-patrones y cómo corregirlos en la práctica


# Masterclass: Arquitectura de Manejo de Errores en React Native
### Con Axios, Fetch y mejores prácticas profesionales para apps chicas, medianas y grandes

> **Autor:** Especialista en React Native · **Nivel:** Intermedio–Avanzado  
> **Objetivo:** Construir una arquitectura de manejo de errores sólida, escalable y orientada al usuario real.

---

## Tabla de Contenidos

1. [Fundamentos: ¿Por qué fallan las apps?](#1-fundamentos)
2. [Tipos de errores y cómo clasificarlos](#2-tipos-de-errores)
3. [Fetch vs Axios: manejo de errores nativo](#3-fetch-vs-axios)
4. [Capa de red: HTTP Client profesional](#4-capa-de-red)
5. [Error Boundaries en React Native](#5-error-boundaries)
6. [Sistema de notificaciones al usuario](#6-sistema-de-notificaciones)
7. [Logging y monitoreo (Sentry, Crashlytics)](#7-logging-y-monitoreo)
8. [Arquitectura para apps CHICAS](#8-apps-chicas)
9. [Arquitectura para apps MEDIANAS](#9-apps-medianas)
10. [Arquitectura para apps GRANDES](#10-apps-grandes)
11. [Manejo de estados de error en UI](#11-estados-de-error-en-ui)
12. [Testing de errores](#12-testing-de-errores)
13. [Checklist profesional](#13-checklist)

---

## 1. Fundamentos

### ¿Por qué fallan las apps móviles?

Las apps React Native fallan por razones predecibles. Conocerlas es el primer paso para manejarlas.

```
┌─────────────────────────────────────────────┐
│           ÁRBOL DE CAUSAS DE FALLAS          │
├─────────────────────────────────────────────┤
│  RED           → Sin internet, timeout,      │
│                  servidor caído, CORS        │
│  SERVIDOR      → 4xx (cliente), 5xx          │
│                  (servidor), JSON malformado │
│  ESTADO LOCAL  → null/undefined, race        │
│                  conditions, stale data      │
│  RUNTIME JS    → TypeError, ReferenceError,  │
│                  Stack overflow              │
│  NATIVO        → Crash de módulos nativos,   │
│                  permisos denegados          │
└─────────────────────────────────────────────┘
```

### Principios que guiarán toda la arquitectura

**1. Fail Fast, Recover Gracefully**  
Detectá el error lo antes posible en el stack, pero mostralo al usuario de forma amable.

**2. Never Swallow Errors**  
Un `catch` vacío es el peor antipatrón. Si atrapás un error, hacé algo con él.

```javascript
// ❌ MAL - error tragado, invisble para todos
try {
  await fetchUser();
} catch (e) {}

// ✅ BIEN - siempre hacé algo
try {
  await fetchUser();
} catch (e) {
  logger.error('fetchUser failed', e);
  setError(e);
}
```

**3. Separar responsabilidades**  
- La capa de red transforma errores HTTP en errores de dominio.
- La capa de UI decide cómo mostrarlos.
- El sistema de logging los registra.

**4. Errores son ciudadanos de primera clase**  
Diseñá los tipos, no los improvises. Un `AppError` bien definido vale más que mil `catch (e: any)`.

---

## 2. Tipos de Errores

### Definir un sistema de tipos robusto

Este es el foundation de todo. Definí esto una vez y usalo en toda la app.

```typescript
// src/errors/AppError.ts

export enum ErrorCode {
  // Red
  NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE',
  REQUEST_TIMEOUT     = 'REQUEST_TIMEOUT',
  
  // HTTP
  UNAUTHORIZED        = 'UNAUTHORIZED',        // 401
  FORBIDDEN           = 'FORBIDDEN',           // 403
  NOT_FOUND           = 'NOT_FOUND',           // 404
  CONFLICT            = 'CONFLICT',            // 409
  UNPROCESSABLE       = 'UNPROCESSABLE',       // 422
  SERVER_ERROR        = 'SERVER_ERROR',        // 5xx
  
  // Negocio / Dominio
  VALIDATION_ERROR    = 'VALIDATION_ERROR',
  SESSION_EXPIRED     = 'SESSION_EXPIRED',
  
  // Desconocido
  UNKNOWN             = 'UNKNOWN',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean; // ¿Es un error esperado?
  public readonly timestamp: string;

  constructor({
    message,
    code,
    statusCode,
    details,
    isOperational = true,
  }: {
    message: string;
    code: ErrorCode;
    statusCode?: number;
    details?: Record<string, unknown>;
    isOperational?: boolean;
  }) {
    super(message);
    this.name = 'AppError';
    this.code  = code;
    this.statusCode  = statusCode;
    this.details     = details;
    this.isOperational = isOperational;
    this.timestamp   = new Date().toISOString();

    // Necesario para que instanceof funcione con clases que extienden Error en TS
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // Mensaje amigable para el usuario (nunca técnico)
  get userMessage(): string {
    return ERROR_USER_MESSAGES[this.code] ?? 'Ocurrió un error inesperado.';
  }

  // ¿Se debe reintentar esta request?
  get isRetryable(): boolean {
    return [
      ErrorCode.NETWORK_UNAVAILABLE,
      ErrorCode.REQUEST_TIMEOUT,
      ErrorCode.SERVER_ERROR,
    ].includes(this.code);
  }
}

// Mensajes para el usuario, centralizados
const ERROR_USER_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_UNAVAILABLE]: 'Sin conexión a internet. Revisá tu red.',
  [ErrorCode.REQUEST_TIMEOUT]:     'La solicitud tardó demasiado. Intentá de nuevo.',
  [ErrorCode.UNAUTHORIZED]:        'Tu sesión expiró. Iniciá sesión nuevamente.',
  [ErrorCode.FORBIDDEN]:           'No tenés permiso para realizar esta acción.',
  [ErrorCode.NOT_FOUND]:           'El recurso solicitado no existe.',
  [ErrorCode.CONFLICT]:            'Ya existe un registro con esos datos.',
  [ErrorCode.UNPROCESSABLE]:       'Los datos enviados son inválidos.',
  [ErrorCode.SERVER_ERROR]:        'Hay un problema en el servidor. Ya estamos trabajando en ello.',
  [ErrorCode.VALIDATION_ERROR]:    'Revisá los datos del formulario.',
  [ErrorCode.SESSION_EXPIRED]:     'Tu sesión expiró. Iniciá sesión nuevamente.',
  [ErrorCode.UNKNOWN]:             'Ocurrió un error inesperado. Intentá de nuevo.',
};
```

### Guard de tipo para detectar AppError

```typescript
// src/errors/guards.ts

import { AppError } from './AppError';

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isNetworkError(error: unknown): boolean {
  if (!isAppError(error)) return false;
  return [
    ErrorCode.NETWORK_UNAVAILABLE,
    ErrorCode.REQUEST_TIMEOUT,
  ].includes(error.code);
}
```

---

## 3. Fetch vs Axios

### El problema fundamental con `fetch`

`fetch` **NUNCA lanza un error** por respuestas HTTP 4xx o 5xx. Solo lanza en falla de red total.  
Este es el error más común que cometen los desarrolladores junior.

```javascript
// ❌ TRAMPA CLÁSICA con fetch
const response = await fetch('https://api.example.com/users/999');
const data = await response.json(); // Si el status es 404... data = { error: "Not found" }
// No hubo excepción. El código sigue como si todo estuviera bien. 💀

// ✅ fetch correcto
const response = await fetch('https://api.example.com/users/999');
if (!response.ok) {
  // response.ok = true solo para 200-299
  throw new Error(`HTTP Error: ${response.status}`);
}
const data = await response.json();
```

### Axios vs Fetch: tabla comparativa

| Característica | `fetch` (nativo) | `axios` |
|---|---|---|
| Lanza en 4xx/5xx | ❌ No | ✅ Sí |
| Interceptors | ❌ Manual | ✅ Nativo |
| Cancelación | `AbortController` | `CancelToken` / `AbortController` |
| Timeout | ❌ Manual | ✅ Configuración directa |
| Retry automático | ❌ No | Con `axios-retry` |
| Transformación de datos | Manual | `transformResponse` |
| Progress de upload | ❌ No | ✅ Sí |
| Bundle size | 0 KB (nativo) | ~14 KB |

**Consejo profesional:** En apps medianas y grandes, preferí Axios. En apps chicas o donde el peso importa, Fetch con un wrapper propio está bien.

---

## 4. Capa de Red

### HTTP Client con Axios (recomendado para proyectos serios)

```typescript
// src/api/httpClient.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import axiosRetry from 'axios-retry';
import NetInfo from '@react-native-community/netinfo';
import { AppError, ErrorCode } from '../errors/AppError';
import { tokenStorage } from '../storage/tokenStorage';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

// ──────────────────────────────────────────────
// 1. Crear instancia
// ──────────────────────────────────────────────
const httpClient: AxiosInstance = axios.create({
  baseURL:        process.env.API_BASE_URL,
  timeout:        15_000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept':        'application/json',
  },
});

// ──────────────────────────────────────────────
// 2. Retry automático para errores de red y 5xx
// ──────────────────────────────────────────────
axiosRetry(httpClient, {
  retries: 3,
  retryDelay:     axiosRetry.exponentialDelay, // 1s, 2s, 4s
  retryCondition: (error: AxiosError) => {
    // Reintentar en errores de red o 5xx (nunca en 4xx)
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error)
    );
  },
  onRetry: (retryCount, error) => {
    logger.warn(`Retry #${retryCount} for ${error.config?.url}`, {
      retryCount,
      url: error.config?.url,
    });
  },
});

// ──────────────────────────────────────────────
// 3. Request interceptor
// ──────────────────────────────────────────────
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Verificar conectividad antes de cada request
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      throw new AppError({
        message: 'No internet connection',
        code:    ErrorCode.NETWORK_UNAVAILABLE,
      });
    }

    // Adjuntar token de autenticación
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de request (solo en DEV)
    if (__DEV__) {
      logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data:   config.data,
      });
    }

    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// ──────────────────────────────────────────────
// 4. Response interceptor
// ──────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject:  (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      logger.debug(`← ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // ── Token refresh automático ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Poner la request en cola mientras se refresca
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(normalizeError(err)));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refreshToken();
        processQueue(null, newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Si el refresh falla, desloguear al usuario
        authService.logout();
        return Promise.reject(
          new AppError({
            message: 'Session expired',
            code:    ErrorCode.SESSION_EXPIRED,
          })
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// ──────────────────────────────────────────────
// 5. Normalizador de errores (el corazón del sistema)
// ──────────────────────────────────────────────
export function normalizeError(error: unknown): AppError {
  // Ya es un AppError, pasarlo tal cual
  if (error instanceof AppError) return error;

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    // Sin respuesta = error de red
    if (!axiosErr.response) {
      if (axiosErr.code === 'ECONNABORTED') {
        return new AppError({
          message: `Request timeout: ${axiosErr.config?.url}`,
          code:    ErrorCode.REQUEST_TIMEOUT,
        });
      }
      return new AppError({
        message: 'Network error',
        code:    ErrorCode.NETWORK_UNAVAILABLE,
      });
    }

    const { status, data } = axiosErr.response;
    const serverMessage = data?.message;

    const CODE_MAP: Record<number, ErrorCode> = {
      401: ErrorCode.UNAUTHORIZED,
      403: ErrorCode.FORBIDDEN,
      404: ErrorCode.NOT_FOUND,
      409: ErrorCode.CONFLICT,
      422: ErrorCode.UNPROCESSABLE,
    };

    return new AppError({
      message:    serverMessage ?? `HTTP Error ${status}`,
      code:       CODE_MAP[status] ?? ErrorCode.SERVER_ERROR,
      statusCode: status,
      details:    data?.errors,
    });
  }

  // Error de JS puro
  if (error instanceof Error) {
    return new AppError({
      message:       error.message,
      code:          ErrorCode.UNKNOWN,
      isOperational: false,
    });
  }

  return new AppError({
    message:       'Unknown error',
    code:          ErrorCode.UNKNOWN,
    isOperational: false,
  });
}

export default httpClient;
```

### HTTP Client con Fetch (para apps chicas)

```typescript
// src/api/fetchClient.ts

import NetInfo from '@react-native-community/netinfo';
import { AppError, ErrorCode } from '../errors/AppError';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

const BASE_URL = process.env.API_BASE_URL ?? '';

async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Verificar conectividad
  const netState = await NetInfo.fetch();
  if (!netState.isConnected) {
    throw new AppError({
      message: 'No internet connection',
      code:    ErrorCode.NETWORK_UNAVAILABLE,
    });
  }

  const { timeout = 15_000, ...fetchOptions } = options;

  // Timeout manual con AbortController
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal:  controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    // fetch NO lanza en 4xx/5xx - debemos verificar manualmente
    if (!response.ok) {
      let errorData: { message?: string } = {};
      try {
        errorData = await response.json();
      } catch {
        // Respuesta sin JSON válido
      }
      throw mapHttpError(response.status, errorData.message);
    }

    // Manejo de respuestas vacías (204 No Content)
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof AppError) throw error;

    // AbortController disparó el timeout
    if ((error as Error).name === 'AbortError') {
      throw new AppError({
        message: 'Request timed out',
        code:    ErrorCode.REQUEST_TIMEOUT,
      });
    }

    // Error de red real (sin conexión, DNS, etc.)
    throw new AppError({
      message: (error as Error).message,
      code:    ErrorCode.NETWORK_UNAVAILABLE,
    });
  }
}

function mapHttpError(status: number, message?: string): AppError {
  const CODE_MAP: Record<number, ErrorCode> = {
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    409: ErrorCode.CONFLICT,
    422: ErrorCode.UNPROCESSABLE,
  };

  return new AppError({
    message:    message ?? `HTTP ${status}`,
    code:       CODE_MAP[status] ?? ErrorCode.SERVER_ERROR,
    statusCode: status,
  });
}

// API pública del cliente
export const fetchClient = {
  get:    <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { method: 'GET', ...options }),
  post:   <T>(url: string, body: unknown, options?: FetchOptions) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put:    <T>(url: string, body: unknown, options?: FetchOptions) =>
    request<T>(url, { method: 'PUT',  body: JSON.stringify(body), ...options }),
  patch:  <T>(url: string, body: unknown, options?: FetchOptions) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { method: 'DELETE', ...options }),
};
```

---

## 5. Error Boundaries

### ¿Qué son y por qué son esenciales?

Los Error Boundaries son componentes de clase que capturan errores de JavaScript en el árbol de componentes hijo. Sin ellos, un error en render hace crashear **toda** la app.

> **Nota importante:** En React Native, los Error Boundaries capturan errores del árbol JS. Los crashes nativos requieren Crashlytics o similar.

### Error Boundary genérico y reutilizable

```typescript
// src/components/ErrorBoundary/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logger } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
  level?: 'screen' | 'component'; // Para diferenciar granularidad del error
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('ErrorBoundary caught error', error, {
      componentStack: info.componentStack,
      level:          this.props.level ?? 'component',
    });
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    // Fallback UI por defecto
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>💥</Text>
        <Text style={styles.title}>Algo salió mal</Text>
        <Text style={styles.message}>
          {this.props.level === 'screen'
            ? 'Ocurrió un error en esta pantalla.'
            : 'Este componente falló al cargar.'}
        </Text>
        {__DEV__ && (
          <Text style={styles.devError}>{this.state.error?.message}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji:      { fontSize: 48, marginBottom: 16 },
  title:      { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  message:    { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  devError:   { fontSize: 11, color: '#c00', backgroundColor: '#fee', padding: 8,
                borderRadius: 4, marginBottom: 16, fontFamily: 'monospace' },
  button:     { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12,
                borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
```

### Uso estratégico de Error Boundaries

```typescript
// Nivel app (raíz) - captura TODO
// src/App.tsx
export default function App() {
  return (
    <ErrorBoundary level="screen" onError={logger.critical}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

// Nivel pantalla - cada screen tiene su propio boundary
// src/screens/HomeScreen.tsx
export function HomeScreen() {
  return (
    <ErrorBoundary level="screen">
      <HomeContent />
    </ErrorBoundary>
  );
}

// Nivel componente - componentes críticos aislados
// src/components/RecommendedProducts.tsx
export function RecommendedProducts() {
  return (
    <ErrorBoundary
      level="component"
      fallback={<Text>No se pudieron cargar las recomendaciones</Text>}
    >
      <ProductList />
    </ErrorBoundary>
  );
}
```

### withErrorBoundary HOC (para aplicar rápidamente)

```typescript
// src/components/ErrorBoundary/withErrorBoundary.tsx

import React, { ComponentType } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options?: { level?: 'screen' | 'component' }
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary level={options?.level ?? 'component'}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Uso
const SafeProductCard = withErrorBoundary(ProductCard, { level: 'component' });
```

---

## 6. Sistema de Notificaciones al Usuario

### Principio fundamental: el usuario NO debe ver errores técnicos

```
❌ "AxiosError: Request failed with status code 500"
✅ "Hay un problema en el servidor. Ya estamos trabajando en ello."

❌ "TypeError: Cannot read property 'id' of undefined"
✅ "Algo salió mal. Intentá de nuevo."
```

### Toast / Notificación centralizada

```typescript
// src/services/notificationService.ts

import { Platform, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppError, ErrorCode } from '../errors/AppError';
import { isAppError } from '../errors/guards';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ShowOptions {
  duration?: number;
  action?:   { label: string; onPress: () => void };
}

class NotificationService {
  show(type: NotificationType, message: string, options?: ShowOptions) {
    Toast.show({
      type,
      text1: this.getTitle(type),
      text2: message,
      visibilityTime: options?.duration ?? 4000,
      position: 'top',
    });
  }

  success(message: string, options?: ShowOptions) {
    this.show('success', message, options);
  }

  error(message: string, options?: ShowOptions) {
    this.show('error', message, options);
  }

  warning(message: string, options?: ShowOptions) {
    this.show('warning', message, options);
  }

  // Maneja un AppError automáticamente
  handleError(error: unknown, fallback?: string) {
    const message = isAppError(error)
      ? error.userMessage
      : fallback ?? 'Ocurrió un error inesperado.';

    // Para errores críticos, usar Alert nativo (más prominente)
    if (isAppError(error) && !error.isOperational) {
      Alert.alert('Error', message, [{ text: 'Aceptar' }]);
      return;
    }

    this.error(message);
  }

  // Para errores de sesión expirada: acción requerida
  handleSessionExpired(onLogin: () => void) {
    Alert.alert(
      'Sesión expirada',
      'Tu sesión expiró. Iniciá sesión nuevamente para continuar.',
      [{ text: 'Iniciar sesión', onPress: onLogin }],
      { cancelable: false }
    );
  }

  private getTitle(type: NotificationType): string {
    const titles: Record<NotificationType, string> = {
      success: '¡Listo!',
      error:   'Error',
      warning: 'Atención',
      info:    'Información',
    };
    return titles[type];
  }
}

export const notificationService = new NotificationService();
```

### Validación de formularios con errores de campo

```typescript
// src/utils/formErrors.ts

// Los errores 422 del servidor suelen venir con un mapa de errores por campo
// Ejemplo: { errors: { email: ["ya está en uso"], password: ["es muy corto"] } }

export type FieldErrors = Record<string, string[]>;

export function extractFieldErrors(error: unknown): FieldErrors {
  if (!isAppError(error)) return {};
  if (error.code !== ErrorCode.UNPROCESSABLE) return {};
  return (error.details as FieldErrors) ?? {};
}

// Hook para formularios
export function useFormErrors(fieldErrors: FieldErrors) {
  const getFieldError = (field: string): string | undefined =>
    fieldErrors[field]?.[0];

  const hasFieldError = (field: string): boolean =>
    Boolean(fieldErrors[field]?.length);

  return { getFieldError, hasFieldError };
}

// Uso en componente de formulario
function RegisterForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { getFieldError } = useFormErrors(fieldErrors);

  const handleSubmit = async () => {
    try {
      await authService.register(formData);
    } catch (error) {
      const fields = extractFieldErrors(error);
      if (Object.keys(fields).length > 0) {
        setFieldErrors(fields); // Mostrar errores por campo
      } else {
        notificationService.handleError(error); // Mostrar toast
      }
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[styles.input, getFieldError('email') && styles.inputError]}
      />
      {getFieldError('email') && (
        <Text style={styles.errorText}>{getFieldError('email')}</Text>
      )}
    </View>
  );
}
```

---

## 7. Logging y Monitoreo

### Logger unificado

```typescript
// src/utils/logger.ts

import { Platform } from 'react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogEntry {
  level:     LogLevel;
  message:   string;
  timestamp: string;
  data?:     unknown;
  error?:    Error;
}

class Logger {
  private isDev = __DEV__;

  debug(message: string, data?: unknown) {
    if (!this.isDev) return;
    console.log(`[DEBUG] ${message}`, data ?? '');
  }

  info(message: string, data?: unknown) {
    console.info(`[INFO] ${message}`, data ?? '');
    this.sendToRemote({ level: 'info', message, data });
  }

  warn(message: string, data?: unknown) {
    console.warn(`[WARN] ${message}`, data ?? '');
    this.sendToRemote({ level: 'warn', message, data });
  }

  error(message: string, error?: unknown, data?: unknown) {
    console.error(`[ERROR] ${message}`, error, data ?? '');
    this.sendToRemote({ level: 'error', message, error: error as Error, data });
  }

  // Para errores críticos que rompen el flujo principal
  critical(message: string, error?: unknown, data?: unknown) {
    console.error(`[CRITICAL] ${message}`, error, data ?? '');
    this.sendToRemote({ level: 'critical', message, error: error as Error, data });
  }

  private sendToRemote(entry: Partial<LogEntry>) {
    // En producción, enviar a Sentry / Datadog / Crashlytics
    if (this.isDev) return;

    const fullEntry: LogEntry = {
      level:     entry.level ?? 'info',
      message:   entry.message ?? '',
      timestamp: new Date().toISOString(),
      data:      entry.data,
      error:     entry.error,
    };

    // Sentry (ver integración abajo)
    if (entry.error) {
      SentryIntegration.captureException(entry.error, { extra: entry.data });
    } else {
      SentryIntegration.addBreadcrumb({
        message: fullEntry.message,
        level:   fullEntry.level,
        data:    fullEntry.data as Record<string, unknown>,
      });
    }
  }
}

export const logger = new Logger();
```

### Integración con Sentry

```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative
```

```typescript
// src/utils/sentry.ts

import * as Sentry from '@sentry/react-native';
import { AppError } from '../errors/AppError';

export function initSentry() {
  Sentry.init({
    dsn:         process.env.SENTRY_DSN,
    environment: process.env.APP_ENV ?? 'production',
    // No capturar en desarrollo
    enabled:     !__DEV__,
    // Capturar el 100% de errores, pero solo el 10% de trazas de performance
    tracesSampleRate: 0.1,
    // Antes de enviar: filtrar errores de red comunes (no son bugs)
    beforeSend(event, hint) {
      const error = hint?.originalException;
      if (error instanceof AppError && error.isOperational) {
        // Los errores operacionales (404, sin red, etc.) no son bugs del código
        // Solo logguear, no alertar en Sentry
        Sentry.addBreadcrumb({
          message:  error.message,
          category: 'operational-error',
          level:    'warning',
          data:     { code: error.code },
        });
        return null; // No enviar como error
      }
      return event;
    },
  });
}

// Enriquecer contexto de usuario para debugging
export function setSentryUser(user: { id: string; email: string }) {
  Sentry.setUser({ id: user.id, email: user.email });
}

export function clearSentryUser() {
  Sentry.setUser(null);
}

export const SentryIntegration = {
  captureException: (error: Error, context?: Record<string, unknown>) => {
    Sentry.captureException(error, { extra: context });
  },
  addBreadcrumb: (breadcrumb: Sentry.Breadcrumb) => {
    Sentry.addBreadcrumb(breadcrumb);
  },
  captureMessage: (message: string, level: Sentry.SeverityLevel = 'info') => {
    Sentry.captureMessage(message, level);
  },
};
```

---

## 8. Apps Chicas

### Cuándo aplica esta arquitectura

- 1–3 devs, MVP o proyecto personal.
- 5–15 pantallas.
- 1–2 APIs externas.
- Sin estado global complejo (sin Redux, sin Zustand).

### Estructura de carpetas

```
src/
├── api/
│   └── fetchClient.ts       # Un solo archivo, fetch con wrapper
├── errors/
│   ├── AppError.ts
│   └── guards.ts
├── hooks/
│   └── useRequest.ts        # Hook genérico para todas las requests
├── components/
│   └── ErrorBoundary.tsx
└── utils/
    └── logger.ts
```

### Hook `useRequest` - el caballo de batalla de apps chicas

```typescript
// src/hooks/useRequest.ts

import { useState, useCallback, useRef } from 'react';
import { AppError } from '../errors/AppError';
import { isAppError } from '../errors/guards';
import { notificationService } from '../services/notificationService';
import { logger } from '../utils/logger';

interface UseRequestState<T> {
  data:    T | null;
  loading: boolean;
  error:   AppError | null;
}

interface UseRequestOptions {
  showErrorToast?:  boolean;  // Mostrar toast automáticamente
  onSuccess?:       (data: unknown) => void;
  onError?:         (error: AppError) => void;
}

export function useRequest<T>(
  requestFn: (...args: unknown[]) => Promise<T>,
  options: UseRequestOptions = {}
) {
  const [state, setState] = useState<UseRequestState<T>>({
    data:    null,
    loading: false,
    error:   null,
  });

  const { showErrorToast = true, onSuccess, onError } = options;
  const isMountedRef = useRef(true);

  // Usar useEffect para cleanup
  const execute = useCallback(
    async (...args: unknown[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await requestFn(...args);

        if (isMountedRef.current) {
          setState({ data: result, loading: false, error: null });
          onSuccess?.(result);
        }

        return result;
      } catch (err: unknown) {
        const appError = isAppError(err)
          ? err
          : new AppError({ message: String(err), code: ErrorCode.UNKNOWN });

        logger.error('useRequest error', appError);

        if (isMountedRef.current) {
          setState({ data: null, loading: false, error: appError });

          if (showErrorToast) {
            notificationService.handleError(appError);
          }

          onError?.(appError);
        }

        return null;
      }
    },
    [requestFn, showErrorToast, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// ────────────────────────────────────
// Uso en componente
// ────────────────────────────────────
function UserProfileScreen() {
  const {
    data:    user,
    loading,
    error,
    execute: loadUser,
  } = useRequest(userService.getProfile, {
    showErrorToast: true,
  });

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorView error={error} onRetry={loadUser} />;
  if (!user)   return null;

  return <UserProfile user={user} />;
}
```

---

## 9. Apps Medianas

### Cuándo aplica esta arquitectura

- 3–8 devs, producto en producción.
- 15–50 pantallas.
- Múltiples APIs y lógica de negocio considerable.
- Estado global (Zustand / Redux Toolkit).
- CI/CD, múltiples ambientes (dev, staging, prod).

### Estructura de carpetas

```
src/
├── api/
│   ├── httpClient.ts           # Axios con interceptors
│   └── endpoints/
│       ├── auth.api.ts
│       ├── users.api.ts
│       └── products.api.ts
├── errors/
│   ├── AppError.ts
│   ├── guards.ts
│   └── errorHandler.ts         # Manejador global centralizado
├── services/
│   ├── authService.ts
│   └── userService.ts
├── store/
│   └── slices/
│       └── errorSlice.ts       # Estado global de errores
├── hooks/
│   ├── useRequest.ts
│   └── useNetworkStatus.ts
├── components/
│   ├── ErrorBoundary/
│   ├── ErrorView/
│   └── NetworkStatus/
└── monitoring/
    ├── sentry.ts
    └── analytics.ts
```

### Servicio de API con Repository Pattern

```typescript
// src/services/userService.ts

import httpClient from '../api/httpClient';
import { AppError, ErrorCode } from '../errors/AppError';

export interface User {
  id:    string;
  name:  string;
  email: string;
}

export interface UpdateUserPayload {
  name?:  string;
  email?: string;
}

class UserService {
  async getProfile(): Promise<User> {
    const { data } = await httpClient.get<User>('/users/me');
    return data;
  }

  async updateProfile(payload: UpdateUserPayload): Promise<User> {
    const { data } = await httpClient.patch<User>('/users/me', payload);
    return data;
  }

  async getById(id: string): Promise<User> {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  }

  async deleteAccount(): Promise<void> {
    await httpClient.delete('/users/me');
  }
}

export const userService = new UserService();
```

### Manejador global de errores

```typescript
// src/errors/errorHandler.ts

import { AppError, ErrorCode } from './AppError';
import { isAppError } from './guards';
import { logger } from '../utils/logger';
import { notificationService } from '../services/notificationService';
import { navigationService } from '../services/navigationService';

class ErrorHandler {
  // Punto de entrada central para todos los errores no capturados
  handle(error: unknown, context?: string) {
    const appError = isAppError(error)
      ? error
      : new AppError({ message: String(error), code: ErrorCode.UNKNOWN });

    logger.error(`Error handled${context ? ` in ${context}` : ''}`, appError);

    // Ruteo por tipo de error
    this.route(appError);
  }

  private route(error: AppError) {
    switch (error.code) {
      case ErrorCode.SESSION_EXPIRED:
      case ErrorCode.UNAUTHORIZED:
        // Redirigir a login
        notificationService.handleSessionExpired(() =>
          navigationService.navigate('Login')
        );
        break;

      case ErrorCode.NETWORK_UNAVAILABLE:
        // El componente NetworkStatus ya muestra un banner
        // No mostrar toast duplicado si el banner está visible
        break;

      case ErrorCode.SERVER_ERROR:
        notificationService.error(error.userMessage);
        break;

      default:
        if (error.isOperational) {
          notificationService.handleError(error);
        } else {
          // Error inesperado de programa → Sentry + Alert crítico
          notificationService.handleError(error, 'Ocurrió un error inesperado.');
        }
    }
  }
}

export const errorHandler = new ErrorHandler();

// Capturar excepciones globales no manejadas en React Native
export function setupGlobalErrorHandlers() {
  // Errores JS no capturados
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    logger.critical('Unhandled JS error', error, { isFatal });
    if (!isFatal) errorHandler.handle(error, 'Global');
    originalHandler(error, isFatal);
  });

  // Promesas rechazadas sin .catch()
  // Requiere soporte del engine (Hermes lo soporta)
  if (global.HermesInternal) {
    // Configuración específica de Hermes para unhandled rejections
  }
}
```

### Estado de red con NetInfo

```typescript
// src/hooks/useNetworkStatus.ts

import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    // Estado inicial
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Suscripción a cambios
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isConnected, connectionType };
}

// Banner de estado de red
export function NetworkStatusBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected === null || isConnected) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>📵 Sin conexión a internet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF3B30',
    padding: 8,
    alignItems: 'center',
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
```

---

## 10. Apps Grandes

### Cuándo aplica esta arquitectura

- 8+ devs, múltiples equipos.
- 50+ pantallas, múltiples módulos de negocio.
- Múltiples APIs, microservicios, WebSockets.
- Estrictos requisitos de compliance y auditoría.
- CI/CD avanzado, feature flags, A/B testing.

### Estructura de carpetas (Feature-based / Modular)

```
src/
├── core/                          # Infraestructura compartida
│   ├── api/
│   │   ├── httpClient.ts
│   │   ├── graphqlClient.ts       # Si usan GraphQL
│   │   └── wsClient.ts            # WebSockets
│   ├── errors/
│   │   ├── AppError.ts
│   │   ├── guards.ts
│   │   ├── errorHandler.ts
│   │   └── errorReporter.ts      # Solo reporting/logging
│   ├── monitoring/
│   │   ├── sentry.ts
│   │   ├── analytics.ts
│   │   └── performance.ts        # Traces de performance
│   └── storage/
│       └── secureStorage.ts
│
├── features/                      # Módulos de negocio aislados
│   ├── auth/
│   │   ├── api/
│   │   ├── errors/               # Errores específicos del módulo
│   │   ├── hooks/
│   │   └── screens/
│   ├── payments/
│   │   ├── api/
│   │   ├── errors/
│   │   └── screens/
│   └── catalog/
│       └── ...
│
└── shared/
    ├── components/
    │   ├── ErrorBoundary/
    │   ├── ErrorView/
    │   └── NetworkStatus/
    └── hooks/
```

### Sistema de reporting de errores desacoplado

```typescript
// src/core/errors/errorReporter.ts
// Este módulo solo reporta. No muestra UI ni toma decisiones.

import * as Sentry from '@sentry/react-native';
import { AppError } from './AppError';
import { isAppError } from './guards';

interface ErrorReport {
  error:       Error;
  context?:    string;
  tags?:       Record<string, string>;
  extra?:      Record<string, unknown>;
  userId?:     string;
  severity?:   Sentry.SeverityLevel;
}

class ErrorReporter {
  report({
    error,
    context,
    tags,
    extra,
    userId,
    severity = 'error',
  }: ErrorReport) {
    Sentry.withScope((scope) => {
      if (userId) scope.setUser({ id: userId });
      if (tags)   scope.setTags(tags);
      if (context) scope.setTag('context', context);
      if (extra)   scope.setExtras(extra);
      scope.setLevel(severity);

      // Los errores operacionales se reportan como breadcrumbs, no como eventos
      if (isAppError(error) && error.isOperational) {
        scope.addBreadcrumb({
          message:  error.message,
          category: 'api.error',
          level:    'warning',
          data:     { code: error.code, statusCode: error.statusCode },
        });
        // No capturar como excepción de Sentry (evita ruido)
        return;
      }

      Sentry.captureException(error);
    });
  }

  // Añadir contexto de usuario a todos los reportes
  setUserContext(user: { id: string; email?: string; role?: string }) {
    Sentry.setUser(user);
  }

  clearUserContext() {
    Sentry.setUser(null);
  }

  // Para medir performance de operaciones críticas
  startTransaction(name: string, op: string) {
    return Sentry.startTransaction({ name, op });
  }
}

export const errorReporter = new ErrorReporter();
```

### Errores de módulo específicos

```typescript
// src/features/payments/errors/PaymentError.ts

import { AppError, ErrorCode } from '../../../core/errors/AppError';

export enum PaymentErrorCode {
  CARD_DECLINED        = 'PAYMENT_CARD_DECLINED',
  INSUFFICIENT_FUNDS   = 'PAYMENT_INSUFFICIENT_FUNDS',
  EXPIRED_CARD         = 'PAYMENT_EXPIRED_CARD',
  INVALID_CVV          = 'PAYMENT_INVALID_CVV',
  PROCESSING_ERROR     = 'PAYMENT_PROCESSING_ERROR',
}

const PAYMENT_MESSAGES: Record<PaymentErrorCode, string> = {
  [PaymentErrorCode.CARD_DECLINED]:      'Tu tarjeta fue rechazada. Probá con otra.',
  [PaymentErrorCode.INSUFFICIENT_FUNDS]: 'Fondos insuficientes en tu tarjeta.',
  [PaymentErrorCode.EXPIRED_CARD]:       'Tu tarjeta está vencida.',
  [PaymentErrorCode.INVALID_CVV]:        'El código de seguridad es incorrecto.',
  [PaymentErrorCode.PROCESSING_ERROR]:   'Error al procesar el pago. Intentá en unos minutos.',
};

export class PaymentError extends AppError {
  public readonly paymentCode: PaymentErrorCode;

  constructor(paymentCode: PaymentErrorCode, details?: Record<string, unknown>) {
    super({
      message:    PAYMENT_MESSAGES[paymentCode],
      code:       ErrorCode.SERVER_ERROR,
      details,
      isOperational: true,
    });
    this.paymentCode = paymentCode;
    Object.setPrototypeOf(this, PaymentError.prototype);
  }

  get userMessage(): string {
    return PAYMENT_MESSAGES[this.paymentCode];
  }
}

// Detector de errores de pago desde respuesta del servidor
export function parsePaymentError(
  serverCode: string,
  details?: Record<string, unknown>
): PaymentError | null {
  const CODE_MAP: Record<string, PaymentErrorCode> = {
    'card_declined':      PaymentErrorCode.CARD_DECLINED,
    'insufficient_funds': PaymentErrorCode.INSUFFICIENT_FUNDS,
    'expired_card':       PaymentErrorCode.EXPIRED_CARD,
    'incorrect_cvc':      PaymentErrorCode.INVALID_CVV,
  };

  const paymentCode = CODE_MAP[serverCode];
  if (!paymentCode) return null;

  return new PaymentError(paymentCode, details);
}
```

### Queue de errores offline

```typescript
// src/core/errors/offlineErrorQueue.ts
// Para apps con modo offline: encolar acciones fallidas y reintentar al reconectar

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface QueuedAction {
  id:        string;
  type:      string;
  payload:   unknown;
  timestamp: string;
  retries:   number;
}

class OfflineErrorQueue {
  private readonly STORAGE_KEY = '@offline_queue';
  private readonly MAX_RETRIES = 3;

  async enqueue(type: string, payload: unknown): Promise<void> {
    const queue = await this.getQueue();
    const action: QueuedAction = {
      id:        Math.random().toString(36).slice(2),
      type,
      payload,
      timestamp: new Date().toISOString(),
      retries:   0,
    };
    await AsyncStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify([...queue, action])
    );
  }

  async processQueue(
    executor: (action: QueuedAction) => Promise<void>
  ): Promise<void> {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const queue = await this.getQueue();
    const remaining: QueuedAction[] = [];

    for (const action of queue) {
      try {
        await executor(action);
        // Éxito: no agregar a remaining (se elimina)
      } catch {
        if (action.retries < this.MAX_RETRIES) {
          remaining.push({ ...action, retries: action.retries + 1 });
        }
        // Si superó MAX_RETRIES, se descarta
      }
    }

    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(remaining));
  }

  private async getQueue(): Promise<QueuedAction[]> {
    const raw = await AsyncStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}

export const offlineQueue = new OfflineErrorQueue();
```

---

## 11. Estados de Error en UI

### Componentes reutilizables de error

```typescript
// src/shared/components/ErrorView/ErrorView.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AppError, ErrorCode } from '../../../core/errors/AppError';
import { isAppError } from '../../../core/errors/guards';

interface ErrorViewProps {
  error:       unknown;
  onRetry?:    () => void;
  onGoBack?:   () => void;
  compact?:    boolean; // Para usar dentro de listas o cards
}

export function ErrorView({ error, onRetry, onGoBack, compact }: ErrorViewProps) {
  const config = getErrorConfig(error);

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.compactText}>{config.message}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry}>
            <Text style={styles.retryLink}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.message}>{config.message}</Text>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity style={styles.button} onPress={onRetry}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        )}
        {onGoBack && (
          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onGoBack}>
            <Text style={[styles.buttonText, styles.secondaryText]}>Volver</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface ErrorConfig {
  emoji:   string;
  title:   string;
  message: string;
}

function getErrorConfig(error: unknown): ErrorConfig {
  if (!isAppError(error)) {
    return { emoji: '💥', title: 'Error inesperado', message: 'Algo salió mal.' };
  }

  const configs: Partial<Record<ErrorCode, ErrorConfig>> = {
    [ErrorCode.NETWORK_UNAVAILABLE]: {
      emoji:   '📵',
      title:   'Sin conexión',
      message: 'Revisá tu conexión a internet e intentá de nuevo.',
    },
    [ErrorCode.REQUEST_TIMEOUT]: {
      emoji:   '⏱️',
      title:   'Tiempo de espera agotado',
      message: 'La solicitud tardó demasiado. Intentá de nuevo.',
    },
    [ErrorCode.NOT_FOUND]: {
      emoji:   '🔍',
      title:   'No encontrado',
      message: 'El recurso que buscás no existe.',
    },
    [ErrorCode.SERVER_ERROR]: {
      emoji:   '🔧',
      title:   'Error del servidor',
      message: 'Hay un problema temporal. Ya estamos trabajando en ello.',
    },
    [ErrorCode.UNAUTHORIZED]: {
      emoji:   '🔒',
      title:   'Sesión expirada',
      message: 'Tu sesión expiró. Iniciá sesión nuevamente.',
    },
  };

  return configs[error.code] ?? {
    emoji:   '⚠️',
    title:   'Error',
    message: error.userMessage,
  };
}

const styles = StyleSheet.create({
  container:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji:         { fontSize: 56, marginBottom: 16 },
  title:         { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  message:       { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  actions:       { gap: 12 },
  button:        { backgroundColor: '#007AFF', paddingHorizontal: 32, paddingVertical: 14,
                   borderRadius: 10, alignItems: 'center' },
  buttonText:    { color: '#fff', fontWeight: '600', fontSize: 15 },
  secondary:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  secondaryText: { color: '#007AFF' },
  compact:       { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  compactText:   { color: '#c00', fontSize: 13 },
  retryLink:     { color: '#007AFF', fontSize: 13, fontWeight: '600' },
});
```

### Skeleton + Error state para listas

```typescript
// src/shared/components/AsyncList/AsyncList.tsx

import React from 'react';
import { FlatList, View, FlatListProps } from 'react-native';
import { ErrorView } from '../ErrorView/ErrorView';
import { SkeletonList } from '../Skeleton/SkeletonList';

interface AsyncListProps<T> extends Omit<FlatListProps<T>, 'data'> {
  data:           T[] | null;
  loading:        boolean;
  error:          unknown;
  onRetry?:       () => void;
  skeletonCount?: number;
  emptyText?:     string;
}

export function AsyncList<T>({
  data,
  loading,
  error,
  onRetry,
  skeletonCount = 5,
  emptyText = 'No hay elementos',
  ...flatListProps
}: AsyncListProps<T>) {
  if (loading && !data) return <SkeletonList count={skeletonCount} />;

  if (error) {
    return <ErrorView error={error} onRetry={onRetry} />;
  }

  return (
    <FlatList
      data={data ?? []}
      ListEmptyComponent={<EmptyState text={emptyText} />}
      refreshing={loading}
      onRefresh={onRetry}
      {...flatListProps}
    />
  );
}
```

---

## 12. Testing de Errores

### Tests unitarios del normalizador

```typescript
// src/errors/__tests__/normalizeError.test.ts

import axios from 'axios';
import { normalizeError } from '../../api/httpClient';
import { AppError, ErrorCode } from '../AppError';

describe('normalizeError', () => {
  it('pasa AppError sin modificar', () => {
    const original = new AppError({ message: 'Test', code: ErrorCode.NOT_FOUND });
    expect(normalizeError(original)).toBe(original);
  });

  it('convierte AxiosError 404 a NOT_FOUND', () => {
    const axiosError = new axios.AxiosError('Not found');
    axiosError.response = { status: 404, data: {} } as any;
    const result = normalizeError(axiosError);
    expect(result.code).toBe(ErrorCode.NOT_FOUND);
    expect(result).toBeInstanceOf(AppError);
  });

  it('convierte AxiosError sin response a NETWORK_UNAVAILABLE', () => {
    const axiosError = new axios.AxiosError('Network error');
    const result = normalizeError(axiosError);
    expect(result.code).toBe(ErrorCode.NETWORK_UNAVAILABLE);
  });

  it('convierte timeout a REQUEST_TIMEOUT', () => {
    const axiosError = new axios.AxiosError('timeout');
    axiosError.code = 'ECONNABORTED';
    const result = normalizeError(axiosError);
    expect(result.code).toBe(ErrorCode.REQUEST_TIMEOUT);
  });

  it('convierte Error genérico a UNKNOWN', () => {
    const result = normalizeError(new Error('Algo raro'));
    expect(result.code).toBe(ErrorCode.UNKNOWN);
    expect(result.isOperational).toBe(false);
  });
});
```

### Tests de integración para hooks

```typescript
// src/hooks/__tests__/useRequest.test.tsx

import { renderHook, act } from '@testing-library/react-native';
import { useRequest } from '../useRequest';
import { AppError, ErrorCode } from '../../errors/AppError';

// Mock del servicio de notificaciones
jest.mock('../../services/notificationService', () => ({
  notificationService: { handleError: jest.fn() },
}));

describe('useRequest', () => {
  it('ejecuta correctamente y guarda data', async () => {
    const mockFn = jest.fn().mockResolvedValue({ id: 1, name: 'Juan' });
    const { result } = renderHook(() => useRequest(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual({ id: 1, name: 'Juan' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('captura el error y actualiza estado', async () => {
    const error = new AppError({ message: 'Fail', code: ErrorCode.SERVER_ERROR });
    const mockFn = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() =>
      useRequest(mockFn, { showErrorToast: false })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeNull();
  });
});
```

### Simular errores en desarrollo

```typescript
// src/dev/errorSimulator.ts
// Solo importar en __DEV__

export const errorSimulator = {
  networkError: () => {
    throw new AppError({
      message: 'Simulated network error',
      code:    ErrorCode.NETWORK_UNAVAILABLE,
    });
  },
  serverError: () => {
    throw new AppError({
      message: 'Simulated 500',
      code:    ErrorCode.SERVER_ERROR,
    });
  },
  unknownError: () => {
    throw new Error('Simulated unknown error');
  },
};

// Pantalla de dev tools para disparar errores manualmente
export function DevErrorPanel() {
  if (!__DEV__) return null;
  return (
    <View>
      <Button title="Simular error de red"
        onPress={() => try { errorSimulator.networkError() } catch(e) { errorHandler.handle(e) }} />
      <Button title="Simular 500"
        onPress={() => try { errorSimulator.serverError() } catch(e) { errorHandler.handle(e) }} />
    </View>
  );
}
```

---

## 13. Checklist Profesional

### ✅ Fundamentos

- [ ] Clase `AppError` con `ErrorCode` enum definida
- [ ] `normalizeError()` que convierte cualquier error a `AppError`
- [ ] Mensajes de usuario separados del mensaje técnico (`userMessage` vs `message`)
- [ ] Nunca `catch (e) {}` vacío en el código

### ✅ Capa de Red

- [ ] HTTP Client (Axios/Fetch) con timeout configurado
- [ ] Interceptor que verifica conectividad antes de cada request
- [ ] Interceptor que normaliza todos los errores de respuesta
- [ ] Manejo de token refresh automático (cola de requests pendientes)
- [ ] Retry automático para errores de red y 5xx (con backoff exponencial)
- [ ] Logs de request/response en DEV

### ✅ UI y UX

- [ ] `ErrorBoundary` en la raíz de la app
- [ ] `ErrorBoundary` en cada pantalla principal
- [ ] Componente `ErrorView` con estados diferenciados por tipo de error
- [ ] Banner de estado de red visible cuando no hay conexión
- [ ] Toast/notificaciones centralizadas (nunca Alert.alert disperso)
- [ ] Errores de validación de formulario mostrados por campo
- [ ] Estados de `loading` y `error` en cada fetch de datos

### ✅ Logging y Monitoreo

- [ ] Logger unificado (no `console.log` directo en producción)
- [ ] Sentry configurado con `beforeSend` que filtra errores operacionales
- [ ] Usuario y contexto añadidos a Sentry al loguear
- [ ] Errores críticos vs operacionales diferenciados en reportes
- [ ] `ErrorUtils.setGlobalHandler` configurado para errores no capturados

### ✅ Escalabilidad

- [ ] Errores de dominio/módulo específicos (ej: `PaymentError`)
- [ ] `ErrorHandler` centralizado que enruta errores
- [ ] Testing de la capa de normalización de errores
- [ ] Documentación del sistema de errores para el equipo

---

## Consejos Finales

> **"El manejo de errores no es un feature, es una mentalidad."**

**1. Empezá con los tipos.** Antes de escribir un solo `try/catch`, definí tu `AppError` y tus `ErrorCode`. Te ahorrará refactors dolorosos.

**2. El usuario es tu cliente.** Cada mensaje de error que muestra código o jerga técnica es una falla de UX. Jamás expongas stack traces en producción.

**3. Los errores operacionales no son bugs.** Un 404 o un error de red no deben llenar tu Sentry de ruido. Filtralos. Reservá las alertas para errores reales de programación.

**4. El retry no es gratis.** Reintentá solo en errores de red y 5xx. Nunca en 4xx. Un 422 que hace 3 retries es peor que uno solo.

**5. Monitoreá lo que no podés ver.** Los crashes que no llegan a tu pantalla de error son los más peligrosos. Sentry + Crashlytics son inversiones, no opciones.

**6. Testeá los errores, no solo el happy path.** La mayoría de los bugs de producción viven en los `catch`. Simulá errores en tus tests.

**7. Escalá la arquitectura según el tamaño real.** No implementes la arquitectura de apps grandes en un MVP. Agregá complejidad cuando el dolor lo justifique.

---

*Masterclass creada por Claude · React Native Error Handling Architecture Guide*