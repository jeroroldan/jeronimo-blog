---
title: 'React Native'
code: 'react-native'
description: 'Guía Completa: Error Boundaries en React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---



## ¿Qué vas a aprender

En este contenido dominarás los conceptos y herramientas del desarrollo frontend moderno:

- El funcionamiento del runtime JavaScript y el ecosistema de paquetes
- Patrones de componentes, estado y renderizado en tu framework de elección
- Optimización de rendimiento, carga y experiencia de usuario
- Pruebas, tipado, arquitectura y escalabilidad de proyectos frontend
- Integración con backends, APIs y despliegue en producción


# 📱 Guía Completa: Error Boundaries en React Native

## 🎯 Introducción

Los Error Boundaries en React Native funcionan **exactamente igual** que en React web, pero con algunas consideraciones específicas para el entorno móvil. Esta guía te explica todo lo que necesitas saber para implementarlos correctamente en tus apps móviles.

---

## 📋 Diferencias Clave entre React Web y React Native

### Similitudes ✅

- **Misma funcionalidad**: Capturan errores de rendering y ciclo de vida
- **Mismas limitaciones**: No capturan errores en event handlers, async, etc.
- **Misma librería**: `react-error-boundary` funciona perfectamente
- **Mismos hooks**: `useErrorHandler` disponible

### Diferencias Específicas de React Native 📱

#### 1. **Componentes de UI Nativos**

- Usas `View`, `Text`, `TouchableOpacity` en lugar de `div`, `span`, `button`
- Necesitas `SafeAreaView` para manejar las áreas seguras del dispositivo
- `ScrollView` para contenido que puede desbordar la pantalla

#### 2. **Navegación**

- Los errores pueden afectar la navegación entre pantallas
- Puedes resetear el stack de navegación desde el error boundary
- Cada pantalla puede tener su propio error boundary

#### 3. **Plataforma Específica**

- Diferentes comportamientos entre iOS y Android
- Acceso a APIs nativas para crash reporting
- Integración con herramientas como Flipper para debugging

---

## 🛠️ Opciones de Implementación

### Opción 1: react-error-boundary (Recomendada)

**¿Por qué elegir esta opción?**

- ✅ Misma API que React web (código reutilizable)
- ✅ Más flexible y configurable
- ✅ Mejor documentación y comunidad
- ✅ Soporte activo y actualizaciones frecuentes

**Instalación:**

```bash
npm install react-error-boundary
```

### Opción 2: react-native-error-boundary

**¿Cuándo usar esta opción?**

- ✅ Solo desarrollas para React Native (no web)
- ✅ Quieres una implementación más simple
- ✅ Necesitas componentes pre-configurados para móvil

**Instalación:**

```bash
npm install react-native-error-boundary
```

---

## 🏗️ Arquitectura Recomendada para React Native

### Nivel 1: Error Boundary Global (App Level)

**Ubicación**: En el componente raíz de tu app
**Propósito**: Capturar errores críticos que rompen toda la aplicación
**Comportamiento**: Mostrar pantalla de error completa con opción de reinicio

### Nivel 2: Error Boundary de Navegación

**Ubicación**: Dentro del NavigationContainer
**Propósito**: Capturar errores de navegación sin romper la app completa
**Comportamiento**: Resetear navegación o ir a pantalla principal

### Nivel 3: Error Boundary por Pantalla

**Ubicación**: En cada pantalla principal
**Propósito**: Aislar errores de pantallas específicas
**Comportamiento**: Mostrar error de pantalla con opción de volver

### Nivel 4: Error Boundary por Feature

**Ubicación**: En componentes o features específicos
**Propósito**: Aislar errores de funcionalidades no críticas
**Comportamiento**: Mostrar mensaje de feature no disponible

---

## 📱 Consideraciones Específicas de UX Móvil

### 1. **Pantallas de Error Amigables**

- **Usa emojis**: Los usuarios móviles responden bien a elementos visuales
- **Mensajes claros**: Explica qué pasó sin jerga técnica
- **Botones grandes**: Fáciles de tocar en pantallas táctiles
- **Scroll disponible**: Para detalles técnicos opcionales

### 2. **Opciones de Recuperación Múltiples**

- **Reintentar**: Volver a cargar el componente
- **Ir atrás**: Usar navegación para salir del error
- **Ir al inicio**: Resetear a la pantalla principal
- **Reportar**: Permitir al usuario reportar el error

### 3. **Contexto del Dispositivo**

- **Offline/Online**: Diferente mensaje según conectividad
- **Batería baja**: Considerar estado de batería
- **Almacenamiento**: Verificar espacio disponible
- **Permisos**: Errores relacionados con permisos nativos

---

## 🔧 Integración con Herramientas Nativas

### Firebase Crashlytics

**¿Por qué usar Crashlytics?**

- Tracking automático de crashes nativos
- Métricas detalladas de estabilidad
- Reportes organizados por versión/dispositivo
- Gratuito y fácil de implementar

**Implementación:**

```javascript
// En tu Error Boundary
onError={(error, errorInfo) => {
  crashlytics().recordError(error);
  crashlytics().setAttributes({
    screen: getCurrentScreenName(),
    userId: getCurrentUserId(),
    errorBoundary: true
  });
}}
```

### Sentry para React Native

**¿Cuándo usar Sentry?**

- Necesitas más control sobre el tracking
- Quieres performance monitoring
- Necesitas release tracking avanzado
- Tu equipo ya usa Sentry en web

### Flipper (Desarrollo)

**Beneficios durante desarrollo:**

- Debugging en tiempo real
- Logs estructurados
- Network inspection
- Redux DevTools integrado

---

## 🎨 Patrones de UI para Error Boundaries

### 1. **Error Global - Pantalla Completa**

**Cuándo usar**: Errores que rompen toda la aplicación
**Elementos clave**:

- SafeAreaView para áreas seguras
- Botón prominente de "Reintentar"
- Opción de reportar error
- Información de contacto de soporte

### 2. **Error de Pantalla - Parcial**

**Cuándo usar**: Error en una pantalla específica
**Elementos clave**:

- Botón de "Volver" usando navigation.goBack()
- Mensaje específico de la pantalla
- Opción de ir al home
- Preservar header de navegación si es posible

### 3. **Error de Componente - Inline**

**Cuándo usar**: Error en un componente no crítico
**Elementos clave**:

- Mensaje pequeño y discreto
- Botón de reintentar inline
- No interrumpir el flujo principal
- Placeholder o skeleton loader como fallback

### 4. **Error de Red - Contextual**

**Cuándo usar**: Problemas de conectividad
**Elementos clave**:

- Ícono de conectividad
- Mensaje específico de red
- Botón de verificar conexión
- Retry automático cuando vuelva la conexión

---

## 🚨 Manejo de Casos Especiales

### Errores de Navegación

**Problema**: Error al navegar entre pantallas
**Solución**: Error boundary que resetea el navigation stack
**Consideraciones**:

- Guardar el estado de navegación anterior
- Permitir volver al estado previo válido
- Log específico de errores de navegación

### Errores de APIs Nativas

**Problema**: Errores al acceder a cámara, GPS, etc.
**Solución**: Hook personalizado con useErrorHandler
**Consideraciones**:

- Verificar permisos antes de usar APIs
- Mensajes específicos por tipo de permiso
- Dirigir al usuario a configuración si es necesario

### Errores de Rendering Pesado

**Problema**: Listas grandes o imágenes que causan OOM
**Solución**: Error boundary con estrategia de reducción de memoria
**Consideraciones**:

- Implementar lazy loading
- Reducir calidad de imágenes en retry
- Pagination automática en listas

### Errores en Background

**Problema**: Errores cuando la app está en background
**Solución**: Queue de errores para cuando la app vuelva al foreground
**Consideraciones**:

- AppState listener para detectar foreground
- Batch de errores acumulados
- Priorización de errores críticos

---

## 📊 Métricas y Monitoring

### KPIs Importantes para Mobile

1. **Error Rate por Pantalla**: Identificar pantallas problemáticas
2. **Recovery Rate**: % de usuarios que se recuperan del error
3. **Time to Recovery**: Tiempo promedio de recuperación
4. **Device/OS Correlation**: Errores específicos por dispositivo
5. **Network Correlation**: Errores relacionados con conectividad

### Implementación de Métricas

```javascript
// En tu Error Boundary
onError={(error, errorInfo) => {
  analytics.track('error_boundary_triggered', {
    error_message: error.message,
    component_stack: errorInfo.componentStack,
    screen_name: getCurrentScreen(),
    device_info: getDeviceInfo(),
    network_status: getNetworkStatus(),
    user_id: getUserId(),
    session_id: getSessionId(),
    timestamp: Date.now()
  });
}}
```

---

## 🧪 Testing en React Native

### Diferencias en Testing

- **Simuladores**: Testing en iOS Simulator y Android Emulator
- **Dispositivos físicos**: Testing en dispositivos reales
- **Detox**: Framework de testing E2E específico para RN
- **Flipper integration**: Para debugging durante tests

### Testing Strategy

1. **Unit Tests**: Testing de componentes con error boundaries
2. **Integration Tests**: Testing de flujos con errores
3. **E2E Tests**: Testing de recovery en dispositivos reales
4. **Manual Testing**: Testing en diferentes dispositivos/OS

---

## 🔄 Estrategias de Recovery Específicas para Mobile

### 1. **Progressive Recovery**

- Primer intento: Retry del componente
- Segundo intento: Recargar datos
- Tercer intento: Reiniciar pantalla
- Último recurso: Reiniciar app

### 2. **Context-Aware Recovery**

- **Conectividad**: Esperar conexión antes de retry
- **Batería**: Reducir funcionalidad si batería baja
- **Almacenamiento**: Limpiar caché si espacio bajo
- **Performance**: Reducir calidad/funciones en dispositivos lentos

### 3. **User-Guided Recovery**

- Opciones claras de qué hacer
- Explicación de por qué falló
- Pasos para prevenir futuros errores
- Opción de contactar soporte

---

## 💡 Mejores Prácticas Específicas para Mobile

### DO ✅

- **Usar SafeAreaView**: Para evitar problemas con notch/barras de estado
- **Considerar orientación**: Error boundaries que funcionen en ambas orientaciones
- **Optimizar para touch**: Botones suficientemente grandes para dedos
- **Considerar conectividad**: Diferentes mensajes para online/offline
- **Preservar estado**: Mantener datos del usuario cuando sea posible
- **Usar crash reporting**: Firebase Crashlytics o Sentry
- **Testing en dispositivos reales**: No solo en simuladores

### DON'T ❌

- **No bloquear gestos nativos**: Como swipe back en iOS
- **No mostrar stack traces**: A usuarios finales en producción
- **No ignorar permisos**: Verificar permisos de APIs nativas
- **No usar solo console.log**: Implementar logging estructurado
- **No olvidar Android back button**: Manejar hardware back button
- **No asumir conexión**: Siempre verificar estado de red
- **No hacer error boundaries demasiado granulares**: En mobile, menos es más

---

## 🎯 Checklist de Implementación

### Configuración Inicial

- [ ] Instalar `react-error-boundary`
- [ ] Configurar error boundary global en App.js
- [ ] Integrar con servicio de crash reporting
- [ ] Configurar logging estructurado

### Por Pantalla

- [ ] Error boundary en pantallas críticas
- [ ] Fallback UI apropiado para cada pantalla
- [ ] Botones de recovery funcionales
- [ ] Testing en simuladores y dispositivos

### Monitoring

- [ ] Configurar métricas de error
- [ ] Dashboard de monitoring
- [ ] Alertas automáticas para errores críticos
- [ ] Review periódico de errores más frecuentes

### Testing

- [ ] Unit tests para error boundaries
- [ ] E2E tests con Detox
- [ ] Testing en diferentes dispositivos
- [ ] Testing de scenarios offline/online

---

## 🚀 Próximos Pasos

1. **Implementa gradualmente**: Empieza con error boundary global
2. **Monitorea métricas**: Configura tracking desde el día 1
3. **Itera basado en datos**: Mejora basándote en errores reales
4. **Educa al equipo**: Asegúrate que todos entiendan cuándo y cómo usar
5. **Mantente actualizado**: Revisa regularmente nuevas herramientas y patterns

---

## 📚 Recursos Adicionales

- [React Native Error Boundaries Documentation](https://reactnative.dev/docs/error-boundaries)
- [Firebase Crashlytics for React Native](https://rnfirebase.io/crashlytics/usage)
- [Sentry React Native Guide](https://docs.sentry.io/platforms/react-native/)
- [Flipper React Native Plugin](https://fbflipper.com/docs/getting-started/react-native/)
- [Detox Testing Framework](https://wix.github.io/Detox/)

---

## 🏆 Conclusión

Error Boundaries en React Native son **esenciales** para crear apps móviles robustas. La clave está en implementarlos estratégicamente, considerando las particularidades del entorno móvil y la experiencia de usuario específica de dispositivos táctiles.

Con esta guía, ya tienes todo lo necesario para implementar un sistema de manejo de errores profesional en tus apps React Native. ¡Empieza con lo básico y ve evolucionando según las necesidades de tu aplicación!
