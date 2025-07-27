---
title: 'Estados de carga'
description: 'Guía Completa de Estados de carga'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
```
// Reglas de decisión basadas en contexto
const rules = [
  {
    condition: () => 
      operationType === 'navigation' && 
      userImpact === 'high',
    strategy: 'global',
    reason: 'Navegación crítica requiere atención completa del usuario'
  },
  {
    condition: () => 
      operationType === 'form-submit' && 
      userContext === 'completing-task',
    strategy: 'global',
    reason: 'Evita interrupciones durante completado de tareas importantes'
  },
  {
    condition: () => 
      dataSize === 'large' && 
      dependencies === 'many',
    strategy: 'sectional',
    reason: 'Datos complejos se benefician de carga progresiva'
  },
  {
    condition: () => 
      operationType === 'action' && 
      duration === 'instant',
    strategy: 'individual',
    reason: 'Acciones rápidas necesitan feedback inmediato localizado'
  },
  {
    condition: () => 
      userContext === 'browsing' && 
      userImpact === 'low',
    strategy: 'individual',
    reason: 'Durante exploración, mantener resto de UI interactiva'
  },
  {
    condition: () => 
      duration === 'very-slow' && 
      userImpact === 'critical',
    strategy: 'progressive',
    reason: 'Operaciones largas críticas necesitan progreso visible'
  }
];

// Encuentra la primera regla que aplica
const matchingRule = rules.find(rule => rule.condition());

return matchingRule || {
  strategy: 'individual',
  reason: 'Estrategia por defecto para casos no específicos'
};
```

},

// Configuraciones recomendadas por estrategia getStrategyConfig: (strategy, context) => { const configs = { global: { showProgress: context.duration === 'slow' || context.duration === 'very-slow', allowCancel: context.userImpact !== 'critical', showEstimatedTime: context.duration === 'very-slow', blockInteraction: true, showSpinner: true, overlayStyle: 'full', zIndex: 9999 },

```
  sectional: {
    showProgress: true,
    allowPartialInteraction: true,
    showSkeletons: context.dataSize === 'large',
    progressiveReveal: true,
    retryIndividualSections: true,
    showSectionStatus: true
  },
  
  individual: {
    showProgress: context.duration !== 'instant',
    showSpinner: true,
    disableComponent: true,
    showTooltipFeedback: context.userImpact === 'low',
    allowOptimisticUpdates: context.operationType === 'action',
    quickFeedback: context.duration === 'fast'
  },
  
  progressive: {
    showDetailedProgress: true,
    showStepProgress: true,
    allowStepSkipping: false,
    showTimeEstimates: true,
    showCurrentAction: true,
    allowPause: context.userImpact !== 'critical'
  }
};

return configs[strategy] || configs.individual;
```

} };

// Hook para usar la estrategia automáticamente export const useSmartLoadingStrategy = (context) => { const recommendation = LoadingStrategy.getRecommendedStrategy(context); const config = LoadingStrategy.getStrategyConfig(recommendation.strategy, context);

return { strategy: recommendation.strategy, config, reason: recommendation.reason,

```
// Helpers para implementar
shouldUseGlobal: () => recommendation.strategy === 'global',
shouldUseSectional: () => recommendation.strategy === 'sectional',
shouldUseIndividual: () => recommendation.strategy === 'individual',
shouldUseProgressive: () => recommendation.strategy === 'progressive'
```

}; };

```

### Ejemplos de Aplicación de Estrategias

```javascript
// components/SmartLoadingExample.js
import React from 'react';
import { useSmartLoadingStrategy } from '../utils/loadingStrategy';

// Ejemplo 1: Navegación Principal
const MainNavigation = ({ onNavigate, destination }) => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'navigation',
    userImpact: 'high',
    duration: 'fast',
    userContext: 'browsing'
  });

  if (strategy.shouldUseGlobal()) {
    return <GlobalNavigationLoader onNavigate={onNavigate} />;
  }
  
  return <RegularNavigation onNavigate={onNavigate} />;
};

// Ejemplo 2: Dashboard con Múltiples Métricas
const MetricsDashboard = () => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'data-fetch',
    dataSize: 'large',
    userImpact: 'medium',
    duration: 'slow',
    dependencies: 'many',
    userContext: 'working'
  });

  if (strategy.shouldUseSectional()) {
    return <SectionalDashboard config={strategy.config} />;
  }
  
  return <SimpleDashboard />;
};

// Ejemplo 3: Botón de Acción Rápida
const QuickActionButton = ({ onClick, children }) => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'action',
    userImpact: 'low',
    duration: 'instant',
    userContext: 'browsing'
  });

  return (
    <LoadingButton
      onClick={onClick}
      showProgress={strategy.config.showProgress}
      optimistic={strategy.config.allowOptimisticUpdates}
    >
      {children}
    </LoadingButton>
  );
};

// Ejemplo 4: Subida de Archivo Grande
const FileUploader = ({ onUpload }) => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'form-submit',
    dataSize: 'large',
    userImpact: 'critical',
    duration: 'very-slow',
    userContext: 'completing-task'
  });

  if (strategy.shouldUseProgressive()) {
    return (
      <ProgressiveFileUploader 
        onUpload={onUpload}
        config={strategy.config}
      />
    );
  }

  return (
    <GlobalFileUploader 
      onUpload={onUpload}
      config={strategy.config}
    />
  );
};
```

---

## 📱 Consideraciones para Mobile y Performance

### Optimizaciones Específicas para Mobile

```javascript
// hooks/useMobileLoadingOptimizations.js
import { useState, useEffect, useMemo } from 'react';

export const useMobileLoadingOptimizations = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEnd: false,
    connectionType: 'unknown',
    batteryLevel: 1,
    reducedMotion: false
  });

  useEffect(() => {
    // Detectar dispositivo móvil
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);

    // Detectar dispositivos de baja gama
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     navigator.deviceMemory <= 2;

    // Detectar tipo de conexión
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection ? connection.effectiveType : 'unknown';

    // Detectar preferencia de movimiento reducido
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Monitorear batería (si está disponible)
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setDeviceInfo(prev => ({
          ...prev,
          batteryLevel: battery.level
        }));

        battery.addEventListener('levelchange', () => {
          setDeviceInfo(prev => ({
            ...prev,
            batteryLevel: battery.level
          }));
        });
      });
    }

    setDeviceInfo(prev => ({
      ...prev,
      isMobile,
      isLowEnd,
      connectionType,
      reducedMotion
    }));
  }, []);

  // Configuraciones optimizadas basadas en el dispositivo
  const optimizedConfig = useMemo(() => {
    const config = {
      shouldReduceAnimations: deviceInfo.isLowEnd || 
                             deviceInfo.reducedMotion || 
                             deviceInfo.batteryLevel < 0.2,
    
      shouldSimplifySkeletons: deviceInfo.isLowEnd || 
                              deviceInfo.connectionType === 'slow-2g',
    
      shouldReduceRefreshRate: deviceInfo.batteryLevel < 0.3,
    
      shouldPreferStaticLoaders: deviceInfo.connectionType === 'slow-2g' || 
                                deviceInfo.isLowEnd,
    
      shouldBatchUpdates: deviceInfo.isLowEnd,
    
      shouldReduceProgressGranularity: deviceInfo.isLowEnd,
    
      maxConcurrentLoaders: deviceInfo.isLowEnd ? 2 : 
                           deviceInfo.isMobile ? 3 : 5,
    
      debounceDelay: deviceInfo.isLowEnd ? 300 : 
                    deviceInfo.isMobile ? 200 : 100,
    
      skeletonStyle: deviceInfo.shouldSimplifySkeletons ? 'simple' : 'detailed'
    };

    return config;
  }, [deviceInfo]);

  return {
    deviceInfo,
    optimizedConfig,
  
    // Helpers para componentes
    getOptimizedSpinner: () => {
      if (optimizedConfig.shouldPreferStaticLoaders) {
        return 'dots'; // Spinner simple con puntos
      }
      if (optimizedConfig.shouldReduceAnimations) {
        return 'pulse'; // Animación suave
      }
      return 'spin'; // Spinner completo
    },
  
    getSkeletonConfig: () => ({
      animated: !optimizedConfig.shouldReduceAnimations,
      style: optimizedConfig.skeletonStyle,
      shimmer: !optimizedConfig.shouldPreferStaticLoaders
    }),
  
    getProgressConfig: () => ({
      granularity: optimizedConfig.shouldReduceProgressGranularity ? 10 : 1,
      smoothTransitions: !optimizedConfig.shouldReduceAnimations
    })
  };
};

// Componente optimizado para mobile
const MobileOptimizedLoader = ({ children, type = 'default' }) => {
  const { optimizedConfig, getOptimizedSpinner, getSkeletonConfig } = useMobileLoadingOptimizations();
  
  const spinnerType = getOptimizedSpinner();
  const skeletonConfig = getSkeletonConfig();

  if (type === 'skeleton') {
    return (
      <SmartSkeleton 
        animated={skeletonConfig.animated}
        shimmer={skeletonConfig.shimmer}
        style={skeletonConfig.style}
      />
    );
  }

  return (
    <div className={`mobile-optimized-loader mobile-optimized-loader--${spinnerType}`}>
      {spinnerType === 'dots' && <DotsLoader />}
      {spinnerType === 'pulse' && <PulseLoader />}
      {spinnerType === 'spin' && <SpinLoader />}
      {children}
    </div>
  );
};
```

### Gestión de Memoria y Performance

```javascript
// hooks/usePerformanceOptimizedLoading.js
import { useCallback, useRef, useEffect, useState } from 'react';

export const usePerformanceOptimizedLoading = () => {
  const activeLoaders = useRef(new Set());
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalLoaders: 0,
    memoryUsage: 0,
    averageLoadTime: 0
  });

  // Throttle de actualizaciones de UI
  const throttledUpdate = useRef(null);

  const registerLoader = useCallback((id, priority = 'normal') => {
    activeLoaders.current.add({ id, priority, startTime: Date.now() });
  
    // Límite de loaders concurrentes
    if (activeLoaders.current.size > 5) {
      const lowPriorityLoaders = Array.from(activeLoaders.current)
        .filter(loader => loader.priority === 'low')
        .sort((a, b) => a.startTime - b.startTime);
    
      if (lowPriorityLoaders.length > 0) {
        activeLoaders.current.delete(lowPriorityLoaders[0]);
      }
    }

    updateMetrics();
  }, []);

  const unregisterLoader = useCallback((id) => {
    const loader = Array.from(activeLoaders.current).find(l => l.id === id);
    if (loader) {
      activeLoaders.current.delete(loader);
      updateMetrics();
    }
  }, []);

  const updateMetrics = useCallback(() => {
    if (throttledUpdate.current) return;
  
    throttledUpdate.current = setTimeout(() => {
      setPerformanceMetrics({
        totalLoaders: activeLoaders.current.size,
        memoryUsage: getMemoryUsage(),
        averageLoadTime: calculateAverageLoadTime()
      });
      throttledUpdate.current = null;
    }, 100);
  }, []);

  const getMemoryUsage = () => {
    if ('memory' in performance) {
      return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  };

  const calculateAverageLoadTime = () => {
    const now = Date.now();
    const times = Array.from(activeLoaders.current).map(loader => now - loader.startTime);
    return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0;
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (throttledUpdate.current) {
        clearTimeout(throttledUpdate.current);
      }
    };
  }, []);

  return {
    registerLoader,
    unregisterLoader,
    performanceMetrics,
    shouldReduceLoaders: performanceMetrics.totalLoaders > 3,
    shouldOptimizeAnimations: performanceMetrics.memoryUsage > 50
  };
};

// Hook para lazy loading inteligente
export const useIntelligentLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      
        if (entry.isIntersecting) {
          // Delay adicional basado en la velocidad de scroll
          const scrollSpeed = Math.abs(window.scrollY - (window.lastScrollY || 0));
          const delay = scrollSpeed > 100 ? 500 : 0; // Si scroll rápido, espera más
        
          setTimeout(() => {
            setShouldLoad(true);
          }, delay);
        }
      
        window.lastScrollY = window.scrollY;
      },
      { threshold, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return {
    elementRef,
    isVisible,
    shouldLoad: shouldLoad && isVisible
  };
};
```

---

## 🎭 Patrones de UX Avanzados para Loading

### Storytelling con Loading States

**Analogía: Narración Cinematográfica** Como un director de cine, cada loading state cuenta una historia. El suspense, la revelación, y la resolución deben fluir naturalmente.

```javascript
// components/StorytellingLoader.js
const StorytellingLoader = ({ 
  story, 
  currentChapter, 
  onChapterComplete,
  estimatedDuration 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);

  const chapters = story.chapters || [];
  const currentChapterData = chapters[currentChapter];
  
  useEffect(() => {
    if (!currentChapterData) return;

    const scenes = currentChapterData.scenes;
    const sceneInterval = estimatedDuration / scenes.length;
  
    const timer = setInterval(() => {
      setCurrentScene(prev => {
        const next = prev + 1;
        if (next >= scenes.length) {
          clearInterval(timer);
          onChapterComplete?.();
          return prev;
        }
        return next;
      });
    }, sceneInterval);

    return () => clearInterval(timer);
  }, [currentChapter, currentChapterData, estimatedDuration, onChapterComplete]);

  const currentSceneData = currentChapterData?.scenes[currentScene];

  return (
    <div className="storytelling-loader">
      <div className="story-header">
        <h2>{story.title}</h2>
        <div className="chapter-indicator">
          Capítulo {currentChapter + 1} de {chapters.length}
        </div>
      </div>

      <div className="story-scene">
        <div className="scene-illustration">
          {currentSceneData?.illustration || '⏳'}
        </div>
      
        <div className="scene-narrative">
          <h3>{currentChapterData?.title}</h3>
          <p>{currentSceneData?.description}</p>
        </div>
      </div>

      <div className="story-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((currentScene + 1) / currentChapterData?.scenes.length) * 100}%` 
            }}
          />
        </div>
        <div className="scene-indicators">
          {currentChapterData?.scenes.map((_, index) => (
            <div 
              key={index}
              className={`
                scene-dot 
                ${index <= currentScene ? 'completed' : ''}
                ${index === currentScene ? 'active' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso para onboarding
const OnboardingLoader = () => {
  const [currentChapter, setCurrentChapter] = useState(0);

  const onboardingStory = {
    title: "Preparando tu experiencia personalizada",
    chapters: [
      {
        title: "Configurando tu perfil",
        scenes: [
          {
            description: "Analizando tus preferencias...",
            illustration: "🔍"
          },
          {
            description: "Personalizando la interfaz...",
            illustration: "🎨"
          },
          {
            description: "Configurando notificaciones...",
            illustration: "🔔"
          }
        ]
      },
      {
        title: "Cargando contenido relevante",
        scenes: [
          {
            description: "Buscando recomendaciones...",
            illustration: "🎯"
          },
          {
            description: "Preparando tu dashboard...",
            illustration: "📊"
          }
        ]
      },
      {
        title: "Finalizando configuración",
        scenes: [
          {
            description: "Últimos ajustes...",
            illustration: "⚙️"
          },
          {
            description: "¡Listo para comenzar!",
            illustration: "🚀"
          }
        ]
      }
    ]
  };

  const handleChapterComplete = () => {
    if (currentChapter < onboardingStory.chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  return (
    <StorytellingLoader
      story={onboardingStory}
      currentChapter={currentChapter}
      onChapterComplete={handleChapterComplete}
      estimatedDuration={3000}
    />
  );
};
```

### Microinteracciones y Feedback Inmediato

```javascript
// components/MicroInteractionLoader.js
const MicroInteractionButton = ({ 
  onClick, 
  children, 
  microFeedback = true,
  hapticFeedback = false
}) => {
  const [interactionState, setInteractionState] = useState('idle');
  const [ripples, setRipples] = useState([]);

  const handleClick = async (e) => {
    if (interactionState !== 'idle') return;

    // Microinteracción inmediata
    if (microFeedback) {
      addRipple(e);
    }

    // Haptic feedback en mobile
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setInteractionState('processing');

    try {
      await onClick(e);
      setInteractionState('success');
    
      // Auto-reset después del éxito
      setTimeout(() => {
        setInteractionState('idle');
      }, 1500);
    } catch (error) {
      setInteractionState('error');
    
      // Shake animation en error
      setTimeout(() => {
        setInteractionState('idle');
      }, 2000);
    }
  };

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
  
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
  
    setRipples(prev => [...prev, newRipple]);
  
    // Remover ripple después de la animación
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      className={`
        micro-interaction-button
        micro-interaction-button--${interactionState}
      `}
      onClick={handleClick}
      disabled={interactionState === 'processing'}
    >
      <span className="button-content">
        {interactionState === 'processing' && (
          <span className="processing-indicator">
            <span className="pulse-dot" />
            <span className="pulse-dot" />
            <span className="pulse-dot" />
          </span>
        )}
      
        {interactionState === 'success' && (
          <span className="success-indicator">✓</span>
        )}
      
        {interactionState === 'error' && (
          <span className="error-indicator">⚠</span>
        )}
      
        {(interactionState === 'idle' || interactionState === 'processing') && children}
        {interactionState === 'success' && '¡Completado!'}
        {interactionState === 'error' && 'Error - Reintentar'}
      </span>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );
};
```

---

## 🔮 Reflexión Final: El Arte de la Espera

### La Paradoja del Loading Perfecto

**"El mejor loading state es el que no necesitas, pero cuando lo necesitas, debe ser excepcional."**

Los estados de carga no son solo indicadores técnicos; son **oportunidades de construir confianza y deleitarr a tus usuarios**. Como un buen anfitrión que mantiene entretenidos a sus invitados mientras prepara la cena, un loading state bien diseñado transforma la espera de una frustración en una experiencia anticipada.

### Las Tres Verdades Universales del Loading

**1. La Percepción es Realidad** Un loading de 2 segundos que se siente como 30 segundos es peor que uno de 5 segundos que se siente como 2 segundos. La **psicología del tiempo** es más importante que la velocidad real.

**2. El Contexto lo es Todo** El mismo loading state puede ser perfecto en una situación y terrible en otra. Un loading global durante una compra crítica es apropiado; durante la navegación casual, es molesto.

**3. La Consistencia Construye Confianza** Los usuarios aprenden los patrones de tu aplicación. Cambiar estrategias constantemente genera ansiedad e incertidumbre.

### El Framework Mental: "Las 4 C's del Loading"

1. **Clarity (Claridad)**: ¿El usuario entiende qué está pasando?
2. **Control (Control)**: ¿El usuario siente que puede influir en la situación?
3. **Comfort (Comodidad)**: ¿La experiencia es agradable o al menos tolerable?
4. **Completion (Completitud)**: ¿El usuario sabe cuándo terminará?

### Antipatrones Comunes que Debes Evitar

**🚫 El "Loading Mentiroso"**

```javascript
// ❌ MAL: Progreso que no refleja la realidad
setProgress(90); // Cuando realmente falta mucho tiempo
```

**🚫 El "Loading Zombie"**

```javascript
// ❌ MAL: Loading que nunca termina
if (isLoading) return <Spinner />; // Sin manejo de errores
```

**🚫 El "Loading Esquizofrénico"**

```javascript
// ❌ MAL: Múltiples loaders conflictivos
{isLoadingUsers && <Spinner />}
{isLoadingPosts && <Spinner />}
{isLoadingComments && <Spinner />}
```

### Principios para Loading States Excepcionales

**✅ Principio de Anticipación**

```javascript
// ✅ BIEN: Prepara lo que viene después
const { prefetchNextPage } = usePrefetch();
onMouseEnter={() => prefetchNextPage()}
```

**✅ Principio de Gracia Progresiva**

```javascript
// ✅ BIEN: Mejora según capacidades del dispositivo
const LoadingComponent = ({ useAdvancedAnimations }) => {
  return useAdvancedAnimations ? <AdvancedLoader /> : <SimpleLoader />;
};
```

**✅ Principio de Recuperación Elegante**

```javascript
// ✅ BIEN: Siempre hay un plan B
{error ? <RetryInterface /> : isLoading ? <LoadingState /> : <Content />}
```

### El Futuro de los Loading States

**Tendencias Emergentes:**

1. **IA Predictiva**: Loading states que aprenden de patrones de uso
2. **Realidad Aumentada**: Loading en contexto espacial
3. **Biometric Feedback**: Adaptación basada en estrés del usuario
4. **Edge Computing**: Loading distribuido e inteligente

### Métricas que Realmente Importan

**No solo midas velocidad, mide experiencia:**

* **Perceived Performance Index (PPI)**: Velocidad percibida vs real
* **Loading Anxiety Score (LAS)**: Nivel de estrés durante la espera
* **Completion Confidence Rate (CCR)**: Confianza en que el proceso terminará
* **Interruption Tolerance Index (ITI)**: Facilidad para retomar tras interrupciones

### Tu Manifiesto Personal del Loading

Como desarrollador, comprométete a:

1. **Nunca dejar al usuario en la incertidumbre**
2. **Siempre proporcionar una salida de emergencia**
3. **Respetar el contexto del usuario**
4. **Celebrar los pequeños logros en el viaje**
5. **Hacer que la espera valga la pena**

### Conclusión: Maestría a Través de la Empatía

Los loading states excepcionales nacen de la **empatía profunda** con tus usuarios. No son solo características técnicas; son momentos de cuidado humano expresados a través del código.

Cada spinner, cada barra de progreso, cada skeleton screen es una oportunidad de decir: **"Entiendo que tu tiempo es valioso, y estoy trabajando para ti."**

La próxima vez que implementes un loading state, pregúntate:

* ¿Cómo se sentiría mi madre usando esto?
* ¿Qué esperaría si fuera yo quien estuviera esperando?
* ¿Cómo puedo hacer que esta espera sea menos espera y más anticipación?

**Recuerda**: En un mundo de interfaces instantáneas, los momentos de carga son donde realmente demuestras tu maestría como desarrollador. No los desperdicies.

---

*"El código más elegante no es el que funciona más rápido, sino el que hace sentir al usuario que su tiempo es respetado y su experiencia valorada."*

🎯 **¡Ahora tienes las herramientas para crear loading states que no solo informen, sino que deleiten!**

```
      <button 
        onClick={() => handleQuantityChange(item.quantity + 1)}
        disabled={isDisabled}
        className="quantity-btn"
      >
        +
      </button>
    </div>
  
    <button 
      onClick={() => handleQuantityChange(0)}
      disabled={isDisabled}
      className={`remove-btn ${removeState.isLoading ? 'removing' : ''}`}
    >
      {removeState.isLoading ? (
        <>
          <span className="spinner-small" />
          Eliminando...
        </>
      ) : (
        '🗑️ Eliminar'
      )}
    </button>
  </div>
</div>
```

); };

const ShoppingCart = ({ items, onUpdateQuantity, onRemove, onCheckout }) => { const checkoutState = useLoadingState();

const handleCheckout = async () => { await checkoutState.executeAsync( async (updateProgress) => { updateProgress(20, 'Validando carrito...'); await new Promise(resolve => setTimeout(resolve, 1000));

```
    updateProgress(50, 'Procesando pago...');
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    updateProgress(80, 'Confirmando orden...');
    await onCheckout();
  
    updateProgress(100, 'Orden completada');
  },
  {
    loadingMessage: 'Procesando compra...',
    successMessage: '¡Compra realizada exitosamente!',
    showProgress: true
  }
);
```

};

const total = items.reduce((sum, item) => sum + (item.price \* item.quantity), 0);

return ( <div className="shopping-cart"> <h2>Carrito de Compras</h2>

```
  <div className="cart-items">
    {items.map(item => (
      <ShoppingCartItem
        key={item.id}
        item={item}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
    ))}
  </div>
  
  <div className="cart-summary">
    <div className="total">
      <strong>Total: ${total.toFixed(2)}</strong>
    </div>
  
    <LoadingButton
      onClick={handleCheckout}
      variant="primary"
      size="large"
      showProgress={true}
      loadingText="Procesando..."
      successText="¡Compra completada!"
      disabled={items.length === 0}
      className="checkout-btn"
    >
      Proceder al Pago
    </LoadingButton>
  
    {checkoutState.isSuccess && (
      <div className="checkout-success">
        <h3>✅ ¡Orden procesada exitosamente!</h3>
        <p>Recibirás un email de confirmación pronto.</p>
      </div>
    )}
  </div>
</div>
```

); };

```

### 2. Sistema de Notificaciones con Estados Dinámicos

```javascript
// components/NotificationCenter.js
import React, { useState, useEffect } from 'react';
import { useSectionLoading } from '../hooks/useSectionLoading';

const NotificationItem = ({ notification, onMarkRead, onArchive }) => {
  const readState = useLoadingState();
  const archiveState = useLoadingState();

  const handleMarkRead = async () => {
    if (notification.isRead) return;
  
    await readState.executeAsync(
      () => onMarkRead(notification.id),
      {
        successMessage: 'Marcada como leída'
      }
    );
  };

  const handleArchive = async () => {
    await archiveState.executeAsync(
      () => onArchive(notification.id),
      {
        loadingMessage: 'Archivando...',
        successMessage: 'Notificación archivada'
      }
    );
  };

  const isLoading = readState.isLoading || archiveState.isLoading;

  return (
    <div className={`
      notification-item 
      ${notification.isRead ? 'notification--read' : 'notification--unread'}
      ${isLoading ? 'notification--updating' : ''}
    `}>
      <div className="notification-indicator">
        {!notification.isRead && <div className="unread-dot" />}
      </div>
    
      <div className="notification-content" onClick={handleMarkRead}>
        <div className="notification-header">
          <h4>{notification.title}</h4>
          <span className="notification-time">{notification.timeAgo}</span>
        </div>
        <p>{notification.message}</p>
      
        {readState.isSuccess && (
          <div className="action-feedback">
            ✓ Marcada como leída
          </div>
        )}
      </div>
    
      <div className="notification-actions">
        <button
          onClick={handleArchive}
          disabled={isLoading}
          className="archive-btn"
        >
          {archiveState.isLoading ? (
            <span className="spinner-small" />
          ) : (
            '📁'
          )}
        </button>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const [filter, setFilter] = useState('all');
  const {
    getSectionState,
    executeSectionAsync,
    isAnySectionLoading
  } = useSectionLoading(['notifications', 'unreadCount']);

  // Cargar notificaciones por categoría
  const loadNotifications = async (filterType) => {
    await executeSectionAsync(
      'notifications',
      async (updateProgress) => {
        updateProgress(30, 'Conectando con servidor...');
        await new Promise(resolve => setTimeout(resolve, 800));
      
        updateProgress(70, 'Filtrando notificaciones...');
        await new Promise(resolve => setTimeout(resolve, 400));
      
        // Simular datos
        const mockNotifications = [
          {
            id: 1,
            title: 'Nueva orden recibida',
            message: 'Tienes una nueva orden de Juan Pérez por $150.00',
            timeAgo: '2 min',
            isRead: false,
            category: 'orders'
          },
          {
            id: 2,
            title: 'Pago procesado',
            message: 'El pago de la orden #1234 ha sido procesado exitosamente',
            timeAgo: '10 min',
            isRead: true,
            category: 'payments'
          }
        ];
      
        return filterType === 'all' 
          ? mockNotifications 
          : mockNotifications.filter(n => n.category === filterType);
      },
      {
        loadingMessage: 'Cargando notificaciones...',
        showProgress: true
      }
    );
  };

  // Cargar contador de no leídas
  const loadUnreadCount = async () => {
    await executeSectionAsync(
      'unreadCount',
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return 3; // Mock count
      }
    );
  };

  useEffect(() => {
    loadNotifications(filter);
    loadUnreadCount();
  }, [filter]);

  const notificationsState = getSectionState('notifications');
  const unreadCountState = getSectionState('unreadCount');

  const handleMarkRead = async (notificationId) => {
    // Optimistic update
    const updatedNotifications = notificationsState.data.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
  
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // Update local state
    notificationsState.data = updatedNotifications;
  };

  const handleArchive = async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
  
    // Remove from list
    const filteredNotifications = notificationsState.data.filter(
      n => n.id !== notificationId
    );
    notificationsState.data = filteredNotifications;
  };

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>
          Notificaciones
          {unreadCountState.data > 0 && (
            <span className="unread-badge">
              {unreadCountState.data}
            </span>
          )}
        </h2>
      
        <div className="notification-filters">
          {['all', 'orders', 'payments', 'system'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`filter-btn ${filter === filterType ? 'active' : ''}`}
              disabled={isAnySectionLoading}
            >
              {filterType === 'all' ? 'Todas' : filterType}
            </button>
          ))}
        </div>
      </div>
    
      <div className="notification-list">
        {notificationsState.state === 'loading' && (
          <div className="loading-state">
            <SmartSkeleton type="list" count={3} />
            {notificationsState.message && (
              <p className="loading-message">{notificationsState.message}</p>
            )}
          </div>
        )}
      
        {notificationsState.state === 'success' && (
          <>
            {notificationsState.data?.length > 0 ? (
              notificationsState.data.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onArchive={handleArchive}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>📭 No hay notificaciones</h3>
                <p>Todas las notificaciones aparecerán aquí</p>
              </div>
            )}
          </>
        )}
      
        {notificationsState.state === 'error' && (
          <div className="error-state">
            <h3>⚠️ Error al cargar notificaciones</h3>
            <p>{notificationsState.message}</p>
            <button onClick={() => loadNotifications(filter)}>
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 3. Formulario Multi-Paso con Estados Avanzados

```javascript
// components/MultiStepForm.js
import React, { useState } from 'react';
import { useFormLoadingState } from '../hooks/useLoadingState';

const FormStep = ({ title, children, isActive, isCompleted, hasError }) => {
  return (
    <div className={`
      form-step 
      ${isActive ? 'form-step--active' : ''}
      ${isCompleted ? 'form-step--completed' : ''}
      ${hasError ? 'form-step--error' : ''}
    `}>
      <div className="step-header">
        <div className="step-indicator">
          {isCompleted ? '✓' : hasError ? '⚠' : ''}
        </div>
        <h3>{title}</h3>
      </div>
      {isActive && (
        <div className="step-content">
          {children}
        </div>
      )}
    </div>
  );
};

const MultiStepForm = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    contact: {},
    preferences: {}
  });
  const [stepErrors, setStepErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  const formState = useFormLoadingState();

  const steps = [
    {
      id: 'personal',
      title: 'Información Personal',
      fields: ['firstName', 'lastName', 'birthDate']
    },
    {
      id: 'contact',
      title: 'Información de Contacto',
      fields: ['email', 'phone', 'address']
    },
    {
      id: 'preferences',
      title: 'Preferencias',
      fields: ['notifications', 'theme', 'language']
    }
  ];

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const stepData = formData[step.id];
    const errors = {};

    step.fields.forEach(field => {
      if (!stepData[field]) {
        errors[field] = 'Este campo es requerido';
      }
    });

    if (Object.keys(errors).length > 0) {
      setStepErrors(prev => ({
        ...prev,
        [step.id]: errors
      }));
      return false;
    } else {
      setStepErrors(prev => ({
        ...prev,
        [step.id]: {}
      }));
      return true;
    }
  };

  const handleStepSubmit = async (stepIndex) => {
    const isValid = validateStep(stepIndex);
    if (!isValid) return;

    // Simular validación en servidor
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCompletedSteps(prev => [...prev, stepIndex]);

    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      // Último paso, enviar formulario completo
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    await formState.submitForm(formData, async (data) => {
      // Simular envío al servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onSubmit(data);
    });
  };

  const updateFormData = (stepId, fieldData) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        ...fieldData
      }
    }));
  };

  const currentStepData = steps[currentStep];
  const currentStepErrors = stepErrors[currentStepData?.id] || {};

  if (formState.isSuccess) {
    return (
      <div className="form-success">
        <div className="success-animation">✅</div>
        <h2>¡Formulario enviado exitosamente!</h2>
        <p>Recibirás una confirmación por email pronto.</p>
      </div>
    );
  }

  return (
    <div className="multi-step-form">
      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
        <div className="step-indicators">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                step-indicator
                ${index <= currentStep ? 'active' : ''}
                ${completedSteps.includes(index) ? 'completed' : ''}
                ${stepErrors[step.id] && Object.keys(stepErrors[step.id]).length > 0 ? 'error' : ''}
              `}
            >
              <span>{index + 1}</span>
              <label>{step.title}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-steps">
        {steps.map((step, index) => (
          <FormStep
            key={step.id}
            title={step.title}
            isActive={index === currentStep}
            isCompleted={completedSteps.includes(index)}
            hasError={stepErrors[step.id] && Object.keys(stepErrors[step.id]).length > 0}
          >
            {/* Render específico para cada paso */}
            {step.id === 'personal' && (
              <PersonalInfoStep
                data={formData.personal}
                errors={currentStepErrors}
                onChange={(data) => updateFormData('personal', data)}
              />
            )}
          
            {step.id === 'contact' && (
              <ContactInfoStep
                data={formData.contact}
                errors={currentStepErrors}
                onChange={(data) => updateFormData('contact', data)}
              />
            )}
          
            {step.id === 'preferences' && (
              <PreferencesStep
                data={formData.preferences}
                errors={currentStepErrors}
                onChange={(data) => updateFormData('preferences', data)}
              />
            )}
          </FormStep>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || formState.isLoading}
          className="btn-secondary"
        >
          Anterior
        </button>

        <LoadingButton
          onClick={() => handleStepSubmit(currentStep)}
          variant="primary"
          showProgress={true}
          loadingText={
            currentStep === steps.length - 1 
              ? "Enviando formulario..." 
              : "Validando paso..."
          }
          disabled={formState.isLoading}
        >
          {currentStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
        </LoadingButton>
      </div>

      {formState.progress !== null && (
        <div className="submission-progress">
          <div className="progress-info">
            <span>Enviando formulario...</span>
            <span>{formState.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${formState.progress}%` }}
            />
          </div>
          {formState.message && (
            <p className="progress-message">{formState.message}</p>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 CSS para Estados de Carga

### Estilos Base para Loading States

```css
/* styles/loadingStates.css */

/* Variables CSS para consistency */
:root {
  --loading-color: #3498db;
  --success-color: #2ecc71;
  --error-color: #e74c3c;
  --warning-color: #f39c12;
  --skeleton-color: #f0f0f0;
  --skeleton-shimmer: #e0e0e0;
  
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
  
  --border-radius: 8px;
  --shadow-light: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 8px rgba(0,0,0,0.15);
}

/* Spinner base */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--loading-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}

.spinner-large {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Loading Button States */
.loading-button {
  position: relative;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.loading-button--primary {
  background: var(--loading-color);
  color: white;
}

.loading-button--secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.loading-button--loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.loading-button--success {
  background: var(--success-color);
  color: white;
}

.loading-button--error {
  background: var(--error-color);
  color: white;
}

.loading-content,
.success-content,
.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.button-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  transition: width var(--transition-normal);
}

/* Skeleton Loading */
.skeleton-container {
  width: 100%;
}

.skeleton-animated {
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

@keyframes skeletonPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.skeleton-item {
  margin-bottom: 16px;
}

.skeleton-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.skeleton-image {
  background: var(--skeleton-color);
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 24px;
  background: var(--skeleton-color);
  border-radius: 4px;
  margin-bottom: 12px;
  width: 80%;
}

.skeleton-subtitle {
  height: 18px;
  background: var(--skeleton-color);
  border-radius: 4px;
  margin-bottom: 8px;
  width: 60%;
}

.skeleton-text {
  height: 16px;
  background: var(--skeleton-color);
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;
}

.skeleton-text.short {
  width: 40%;
}

.skeleton-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.skeleton-button {
  height: 36px;
  background: var(--skeleton-color);
  border-radius: var(--border-radius);
  flex: 1;
}

.skeleton-button.secondary {
  flex: 0.6;
}

/* Shimmer effect */
.skeleton-animated .skeleton-image::before,
.skeleton-animated .skeleton-title::before,
.skeleton-animated .skeleton-subtitle::before,
.skeleton-animated .skeleton-text::before,
.skeleton-animated .skeleton-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--skeleton-shimmer),
    transparent
  );
  animation: shimmer 1.8s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Section Loading */
.section-container {
  border: 1px solid #e9ecef;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
}

.section-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.section-status {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
}

.status-indicator.loading {
  background: var(--loading-color);
  animation: pulse 1.5s infinite;
}

.status-indicator.success {
  background: var(--success-color);
}

.status-indicator.error {
  background: var(--error-color);
}

.status-indicator.refreshing {
  background: var(--warning-color);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.section-content {
  padding: 16px;
  min-height: 100px;
}

.section-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.section-refreshing {
  position: relative;
}

.refreshing-overlay {
  position: absolute;
  top: 8px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--warning-color);
  box-shadow: var(--shadow-light);
}

.section-error {
  text-align: center;
  padding: 32px;
}

.error-content h4 {
  color: var(--error-color);
  margin-bottom: 8px;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 16px;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background var(--transition-normal);
}

.retry-button:hover {
  background: #c0392b;
}

/* Progress bars */
.progress-container {
  width: 100%;
  margin: 16px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--loading-color), var(--success-color));
  transition: width var(--transition-normal);
  border-radius: 4px;
}

.progress-text {
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

/* Success messages */
.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success-color);
  font-size: 14px;
  margin-top: 8px;
  animation: slideInDown var(--transition-normal);
}

.success-icon {
  font-weight: bold;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Error messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--error-color);
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

/* Loading overlay utilities */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.loading-overlay-content {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-header {
    padding: 12px;
  }
  
  .section-content {
    padding: 12px;
  }
  
  .loading-button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .skeleton-content {
    padding: 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --skeleton-color: #2d2d2d;
    --skeleton-shimmer: #404040;
  }
  
  .section-container {
    border-color: #404040;
    background: #1a1a1a;
  }
  
  .section-header {
    background: #2d2d2d;
    border-color: #404040;
  }
  
  .loading-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .loading-overlay-content {
    background: #2d2d2d;
    color: white;
  }
}
```

---

## 🧠 Estrategias de Decisión: Cuándo Usar Cada Tipo

### Matriz de Decisión

**Analogía: Sistemas de Transporte Urbano** Como una ciudad tiene diferentes tipos de transporte (metro global, autobuses seccionales, taxis individuales), tu app necesita diferentes tipos de loading.

```javascript
// utils/loadingStrategy.js
export const LoadingStrategy = {# Estados de Carga: Guía Completa para Experiencias de Usuario Excepcionales

## 🎯 Introducción: La Psicología de la Espera

Los estados de carga son como **las salas de espera de un hospital**: pueden ser una experiencia estresante o sorprendentemente agradable, dependiendo de cómo las diseñes. La diferencia entre una aplicación que se siente "lenta" y una que se siente "fluida" no está en la velocidad real, sino en cómo manejas la percepción del tiempo.

### ¿Por qué son Críticos los Estados de Carga?

**Analogía: El Semáforo Inteligente**
Imagina dos semáforos:
- **Semáforo A**: Solo muestra luz roja, no sabes cuánto falta
- **Semáforo B**: Muestra un contador regresivo y el progreso

Ambos duran lo mismo, pero el B se siente más rápido porque **reduces la incertidumbre**.

### Principios Fundamentales

1. **Feedback Inmediato**: Como tocar un instrumento, cada acción debe tener respuesta
2. **Progreso Visible**: Como una barra de descarga, muestra avance
3. **Contexto Preservado**: Como marcadores en un libro, mantén el lugar del usuario
4. **Graceful Degradation**: Como un paraguas, funciona incluso cuando las cosas van mal

---

## 🏗️ Anatomía de los Estados de Carga

### Estados Básicos Universales

```javascript
// Estados fundamentales que toda aplicación necesita
const LoadingStates = {
  IDLE: 'idle',           // Esperando acción del usuario
  LOADING: 'loading',     // Procesando, primera vez
  SUCCESS: 'success',     // Completado exitosamente
  ERROR: 'error',         // Algo salió mal
  REFRESHING: 'refreshing', // Actualizando datos existentes
  RETRYING: 'retrying'    // Intentando de nuevo tras error
};

// Estados avanzados para casos específicos
const AdvancedStates = {
  PENDING: 'pending',     // Esperando confirmación
  OPTIMISTIC: 'optimistic', // Asumiendo éxito antes de confirmar
  STALE: 'stale',         // Datos viejos mientras se actualizan
  OFFLINE: 'offline'      // Sin conexión
};
```

### Tipos de Loading por Contexto

**1. Estados Globales (Global Loading)** Como las **luces de una ciudad**: afectan todo el paisaje visual.

**2. Estados Individuales (Component Loading)** Como **semáforos específicos**: controlan intersecciones particulares.

**3. Estados Seccionales (Section Loading)** Como **indicadores de zona**: muestran actividad en áreas específicas.

---

## 🌍 Estados de Carga Globales

### Cuándo Usar Loading Global

**Analogía: El Telón de un Teatro** El loading global es como bajar el telón entre actos. Usalo cuando:

* Cambias de "acto" completo (navegación entre páginas)
* Cargas datos críticos sin los cuales la página no tiene sentido
* Hay procesos que afectan toda la aplicación

### Implementación con Context API

```javascript
// contexts/LoadingContext.js
import React, { createContext, useContext, useReducer } from 'react';

const LoadingContext = createContext();

const loadingReducer = (state, action) => {
  switch (action.type) {
    case 'START_GLOBAL_LOADING':
      return {
        ...state,
        isGlobalLoading: true,
        globalMessage: action.payload.message || 'Cargando...',
        globalProgress: action.payload.progress || null
      };
  
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        globalProgress: action.payload.progress,
        globalMessage: action.payload.message || state.globalMessage
      };
  
    case 'STOP_GLOBAL_LOADING':
      return {
        ...state,
        isGlobalLoading: false,
        globalMessage: null,
        globalProgress: null
      };
  
    case 'SET_BLOCKING_OPERATION':
      return {
        ...state,
        blockingOperations: {
          ...state.blockingOperations,
          [action.payload.id]: {
            message: action.payload.message,
            progress: action.payload.progress
          }
        }
      };
  
    case 'REMOVE_BLOCKING_OPERATION':
      const newBlockingOps = { ...state.blockingOperations };
      delete newBlockingOps[action.payload.id];
      return {
        ...state,
        blockingOperations: newBlockingOps,
        isGlobalLoading: Object.keys(newBlockingOps).length > 0
      };
  
    default:
      return state;
  }
};

const initialState = {
  isGlobalLoading: false,
  globalMessage: null,
  globalProgress: null,
  blockingOperations: {}
};

export const LoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  const startGlobalLoading = (message, progress) => {
    dispatch({
      type: 'START_GLOBAL_LOADING',
      payload: { message, progress }
    });
  };

  const updateProgress = (progress, message) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: { progress, message }
    });
  };

  const stopGlobalLoading = () => {
    dispatch({ type: 'STOP_GLOBAL_LOADING' });
  };

  const addBlockingOperation = (id, message, progress) => {
    dispatch({
      type: 'SET_BLOCKING_OPERATION',
      payload: { id, message, progress }
    });
  };

  const removeBlockingOperation = (id) => {
    dispatch({
      type: 'REMOVE_BLOCKING_OPERATION',
      payload: { id }
    });
  };

  const value = {
    ...state,
    startGlobalLoading,
    updateProgress,
    stopGlobalLoading,
    addBlockingOperation,
    removeBlockingOperation
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
};
```

### Hook para Operaciones Globales

```javascript
// hooks/useGlobalOperation.js
import { useGlobalLoading } from '../contexts/LoadingContext';
import { useCallback } from 'react';

export const useGlobalOperation = () => {
  const { addBlockingOperation, removeBlockingOperation } = useGlobalLoading();
  
  const executeGlobalOperation = useCallback(async (
    operationFn,
    options = {}
  ) => {
    const {
      id = Date.now().toString(),
      message = 'Procesando...',
      showProgress = false,
      onProgress = null
    } = options;

    addBlockingOperation(id, message, showProgress ? 0 : null);

    try {
      const result = await operationFn((progress, newMessage) => {
        if (showProgress && onProgress) {
          addBlockingOperation(id, newMessage || message, progress);
          onProgress(progress);
        }
      });

      removeBlockingOperation(id);
      return result;
    } catch (error) {
      removeBlockingOperation(id);
      throw error;
    }
  }, [addBlockingOperation, removeBlockingOperation]);

  return { executeGlobalOperation };
};

// Ejemplo de uso
function FileUpload() {
  const { executeGlobalOperation } = useGlobalOperation();

  const handleFileUpload = async (file) => {
    try {
      await executeGlobalOperation(
        async (updateProgress) => {
          return uploadFileWithProgress(file, (progress) => {
            updateProgress(progress, `Subiendo archivo... ${progress}%`);
          });
        },
        {
          message: 'Subiendo archivo...',
          showProgress: true,
          onProgress: (progress) => {
            console.log(`Upload progress: ${progress}%`);
          }
        }
      );
    
      alert('Archivo subido exitosamente');
    } catch (error) {
      alert('Error al subir archivo');
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => handleFileUpload(e.target.files[0])}
    />
  );
}
```

### Componente Global Loading

```javascript
// components/GlobalLoadingOverlay.js
import React from 'react';
import { useGlobalLoading } from '../contexts/LoadingContext';
import { createPortal } from 'react-dom';

const GlobalLoadingOverlay = () => {
  const { isGlobalLoading, globalMessage, globalProgress, blockingOperations } = useGlobalLoading();

  if (!isGlobalLoading) return null;

  const operations = Object.values(blockingOperations);
  const currentOperation = operations[operations.length - 1]; // Última operación
  const displayMessage = currentOperation?.message || globalMessage;
  const displayProgress = currentOperation?.progress ?? globalProgress;

  return createPortal(
    <div className="global-loading-overlay">
      <div className="loading-backdrop" />
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
      
        <h3 className="loading-title">{displayMessage}</h3>
      
        {displayProgress !== null && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <span className="progress-text">{displayProgress}%</span>
          </div>
        )}
      
        {operations.length > 1 && (
          <div className="operations-queue">
            <p>{operations.length} operaciones en progreso</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default GlobalLoadingOverlay;
```

### CSS para Global Loading

```css
/* styles/globalLoading.css */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.loading-content {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 32px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.progress-container {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.operations-queue {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.operations-queue p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🎯 Estados de Carga Individuales

### Cuándo Usar Loading Individual

**Analogía: Luces de Habitación** Cada componente es como una habitación con su propia luz. Usalo cuando:

* Solo una parte específica está cargando
* Los datos son independientes de otros componentes
* Quieres mantener el resto de la UI interactiva

### Hook Universal para Loading States

```javascript
// hooks/useLoadingState.js
import { useState, useCallback } from 'react';

export const useLoadingState = (initialState = 'idle') => {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);

  const startLoading = useCallback((loadingMessage) => {
    setState('loading');
    setError(null);
    setProgress(null);
    setMessage(loadingMessage || null);
  }, []);

  const setLoadingProgress = useCallback((progressValue, progressMessage) => {
    setProgress(progressValue);
    if (progressMessage) setMessage(progressMessage);
  }, []);

  const setSuccess = useCallback((successMessage) => {
    setState('success');
    setError(null);
    setProgress(null);
    setMessage(successMessage || null);
  }, []);

  const setError = useCallback((errorValue, errorMessage) => {
    setState('error');
    setError(errorValue);
    setProgress(null);
    setMessage(errorMessage || null);
  }, []);

  const startRefreshing = useCallback(() => {
    setState('refreshing');
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setError(null);
    setProgress(null);
    setMessage(null);
  }, []);

  const executeAsync = useCallback(async (asyncFn, options = {}) => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showProgress = false,
      onProgress = null
    } = options;

    try {
      startLoading(loadingMessage);

      const result = await asyncFn((progressValue, progressMessage) => {
        if (showProgress) {
          setLoadingProgress(progressValue, progressMessage);
        }
        if (onProgress) {
          onProgress(progressValue, progressMessage);
        }
      });

      setSuccess(successMessage);
      return result;
    } catch (err) {
      setError(err, errorMessage || err.message);
      throw err;
    }
  }, [startLoading, setLoadingProgress, setSuccess, setError]);

  return {
    // Estados
    state,
    isIdle: state === 'idle',
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isRefreshing: state === 'refreshing',
  
    // Datos
    error,
    progress,
    message,
  
    // Acciones
    startLoading,
    setLoadingProgress,
    setSuccess,
    setError,
    startRefreshing,
    reset,
    executeAsync
  };
};

// Hook especializado para formularios
export const useFormLoadingState = () => {
  const loadingState = useLoadingState();
  
  const submitForm = useCallback(async (formData, submitFn) => {
    return loadingState.executeAsync(
      async (updateProgress) => {
        updateProgress(10, 'Validando datos...');
      
        // Simulación de validación
        await new Promise(resolve => setTimeout(resolve, 500));
        updateProgress(50, 'Enviando datos...');
      
        const result = await submitFn(formData);
        updateProgress(100, 'Completado');
      
        return result;
      },
      {
        loadingMessage: 'Enviando formulario...',
        successMessage: 'Formulario enviado exitosamente',
        showProgress: true
      }
    );
  }, [loadingState]);

  return {
    ...loadingState,
    submitForm
  };
};
```

### Componente de Loading Reutilizable

```javascript
// components/LoadingButton.js
import React from 'react';
import { useLoadingState } from '../hooks/useLoadingState';

const LoadingButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  showProgress = false,
  loadingText = 'Cargando...',
  successText = null,
  className = '',
  ...props
}) => {
  const {
    isLoading,
    isSuccess,
    isError,
    progress,
    message,
    executeAsync
  } = useLoadingState();

  const handleClick = async (e) => {
    if (!onClick || isLoading) return;

    try {
      await executeAsync(
        async (updateProgress) => {
          return await onClick(e, updateProgress);
        },
        {
          loadingMessage: loadingText,
          successMessage: successText,
          showProgress
        }
      );
    } catch (error) {
      // Error ya manejado por executeAsync
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="loading-content">
          <span className="spinner" />
          <span>{message || loadingText}</span>
          {showProgress && progress !== null && (
            <span className="progress">({progress}%)</span>
          )}
        </div>
      );
    }

    if (isSuccess && successText) {
      return (
        <div className="success-content">
          <span className="success-icon">✓</span>
          <span>{successText}</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="error-content">
          <span className="error-icon">⚠</span>
          <span>Error - Intentar de nuevo</span>
        </div>
      );
    }

    return children;
  };

  return (
    <button
      className={`
        loading-button 
        loading-button--${variant} 
        loading-button--${size}
        ${isLoading ? 'loading-button--loading' : ''}
        ${isSuccess ? 'loading-button--success' : ''}
        ${isError ? 'loading-button--error' : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {getButtonContent()}
    
      {showProgress && isLoading && (
        <div 
          className="button-progress-bar"
          style={{ width: `${progress || 0}%` }}
        />
      )}
    </button>
  );
};

export default LoadingButton;
```

### Ejemplo de Uso en Componente Real

```javascript
// components/ProductCard.js
import React from 'react';
import { useLoadingState } from '../hooks/useLoadingState';
import LoadingButton from './LoadingButton';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const favoriteState = useLoadingState();
  const cartState = useLoadingState();

  const handleAddToCart = async (e, updateProgress) => {
    updateProgress(25, 'Verificando stock...');
    await new Promise(resolve => setTimeout(resolve, 500));
  
    updateProgress(50, 'Agregando al carrito...');
    await onAddToCart(product.id);
  
    updateProgress(100, 'Agregado');
  };

  const handleToggleFavorite = async () => {
    await favoriteState.executeAsync(
      () => onToggleFavorite(product.id),
      {
        loadingMessage: 'Actualizando...',
        successMessage: product.isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos'
      }
    );
  };

  return (
    <div className={`product-card ${cartState.isLoading ? 'adding-to-cart' : ''}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      
        {/* Botón de favorito con estado individual */}
        <button
          className={`
            favorite-button 
            ${product.isFavorite ? 'favorite-button--active' : ''}
            ${favoriteState.isLoading ? 'favorite-button--loading' : ''}
          `}
          onClick={handleToggleFavorite}
          disabled={favoriteState.isLoading}
        >
          {favoriteState.isLoading ? (
            <span className="spinner-small" />
          ) : (
            product.isFavorite ? '❤️' : '🤍'
          )}
        </button>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
      
        {/* Estado de éxito para favoritos */}
        {favoriteState.isSuccess && favoriteState.message && (
          <div className="success-message">
            {favoriteState.message}
          </div>
        )}
      </div>

      <div className="product-actions">
        <LoadingButton
          onClick={handleAddToCart}
          variant="primary"
          size="medium"
          showProgress={true}
          loadingText="Agregando..."
          successText="¡Agregado!"
          disabled={!product.inStock}
        >
          {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
        </LoadingButton>
      </div>
    </div>
  );
};

export default ProductCard;
```

---

## 📊 Estados de Carga Seccionales

### Cuándo Usar Loading Seccional

**Analogía: Pantallas Divididas en TV** Como cuando ves las noticias y cada sección se actualiza independientemente. Usalo cuando:

* Tienes múltiples secciones de datos independientes
* Quieres mostrar contenido parcial mientras otras partes cargan
* Los usuarios pueden interactuar con secciones ya cargadas

### Implementación con Hook Seccional

```javascript
// hooks/useSectionLoading.js
import { useState, useCallback, useRef } from 'react';

export const useSectionLoading = (sections = []) => {
  const [sectionStates, setSectionStates] = useState(() => {
    return sections.reduce((acc, section) => {
      acc[section] = {
        state: 'idle',
        error: null,
        progress: null,
        message: null,
        data: null
      };
      return acc;
    }, {});
  });

  const timeouts = useRef({});

  const updateSection = useCallback((sectionId, updates) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        ...updates
      }
    }));
  }, []);

  const startSectionLoading = useCallback((sectionId, message) => {
    updateSection(sectionId, {
      state: 'loading',
      error: null,
      progress: null,
      message
    });
  }, [updateSection]);

  const setSectionSuccess = useCallback((sectionId, data, message) => {
    updateSection(sectionId, {
      state: 'success',
      data,
      error: null,
      message
    });

    // Auto-hide success message after 3 seconds
    if (message) {
      clearTimeout(timeouts.current[sectionId]);
      timeouts.current[sectionId] = setTimeout(() => {
        updateSection(sectionId, { message: null });
      }, 3000);
    }
  }, [updateSection]);

  const setSectionError = useCallback((sectionId, error, message) => {
    updateSection(sectionId, {
      state: 'error',
      error,
      message: message || error.message
    });
  }, [updateSection]);

  const setSectionProgress = useCallback((sectionId, progress, message) => {
    updateSection(sectionId, {
      progress,
      message: message || `${progress}%`
    });
  }, [updateSection]);

  const refreshSection = useCallback((sectionId) => {
    updateSection(sectionId, {
      state: 'refreshing',
      error: null
    });
  }, [updateSection]);

  const executeSectionAsync = useCallback(async (
    sectionId,
    asyncFn,
    options = {}
  ) => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showProgress = false
    } = options;

    try {
      startSectionLoading(sectionId, loadingMessage);

      const result = await asyncFn((progress, progressMessage) => {
        if (showProgress) {
          setSectionProgress(sectionId, progress, progressMessage);
        }
      });

      setSectionSuccess(sectionId, result, successMessage);
      return result;
    } catch (error) {
      setSectionError(sectionId, error, errorMessage);
      throw error;
    }
  }, [startSectionLoading, setSectionSuccess, setSectionError, setSectionProgress]);

  // Getters para estados globales
  const isAnySectionLoading = Object.values(sectionStates)
    .some(section => section.state === 'loading' || section.state === 'refreshing');

  const getAllErrors = () => Object.entries(sectionStates)
    .filter(([, section]) => section.error)
    .map(([id, section]) => ({ id, error: section.error }));

  const getLoadedSections = () => Object.entries(sectionStates)
    .filter(([, section]) => section.state === 'success')
    .map(([id, section]) => ({ id, data: section.data }));

  const getSectionState = useCallback((sectionId) => {
    return sectionStates[sectionId] || {
      state: 'idle',
      error: null,
      progress: null,
      message: null,
      data: null
    };
  }, [sectionStates]);

  return {
    sectionStates,
    getSectionState,
    updateSection,
    startSectionLoading,
    setSectionSuccess,
    setSectionError,
    setSectionProgress,
    refreshSection,
    executeSectionAsync,
    isAnySectionLoading,
    getAllErrors,
    getLoadedSections
  };
};

// Hook especializado para dashboards
export const useDashboardSections = () => {
  const sections = ['analytics', 'sales', 'traffic', 'conversion', 'topProducts'];
  const sectionLoading = useSectionLoading(sections);

  const loadAllSections = useCallback(async (apiCalls) => {
    const promises = sections.map(async (section) => {
      if (apiCalls[section]) {
        return sectionLoading.executeSectionAsync(
          section,
          apiCalls[section],
          {
            loadingMessage: `Cargando ${section}...`,
            successMessage: `${section} actualizado`,
            showProgress: true
          }
        );
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error loading dashboard sections:', error);
    }
  }, [sectionLoading, sections]);

  const refreshAllSections = useCallback(async (apiCalls) => {
    sections.forEach(section => {
      sectionLoading.refreshSection(section);
    });
  
    await loadAllSections(apiCalls);
  }, [sectionLoading, sections, loadAllSections]);

  return {
    ...sectionLoading,
    sections,
    loadAllSections,
    refreshAllSections
  };
};
```

### Componente Dashboard con Secciones

```javascript
// components/Dashboard.js
import React, { useEffect } from 'react';
import { useDashboardSections } from '../hooks/useSectionLoading';
import SectionLoader from './SectionLoader';
import ErrorBoundary from './ErrorBoundary';

const Dashboard = () => {
  const {
    getSectionState,
    loadAllSections,
    refreshAllSections,
    isAnySectionLoading,
    getAllErrors
  } = useDashboardSections();

  // API calls para cada sección
  const apiCalls = {
    analytics: async (updateProgress) => {
      updateProgress(25, 'Conectando con analytics...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateProgress(75, 'Procesando datos...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { views: 15420, users: 3240 };
    },
  
    sales: async (updateProgress) => {
      updateProgress(30, 'Obteniendo ventas...');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress(90, 'Calculando totales...');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { total: 125400, orders: 234 };
    },
  
    traffic: async (updateProgress) => {
      updateProgress(40, 'Analizando tráfico...');
      await new Promise(resolve => setTimeout(resolve, 600));
      return { visitors: 8950, bounceRate: '23%' };
    },
  
    conversion: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { rate: '3.2%', improvement: '+0.8%' };
    },
  
    topProducts: async (updateProgress) => {
      updateProgress(20, 'Consultando productos...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateProgress(80, 'Ordenando por ventas...');
      await new Promise(resolve => setTimeout(resolve, 400));
      return [
        { name: 'iPhone 15', sales: 450 },
        { name: 'MacBook Pro', sales: 320 },
        { name: 'AirPods Pro', sales: 280 }
      ];
    }
  };

  useEffect(() => {
    loadAllSections(apiCalls);
  }, [loadAllSections]);

  const handleRefreshAll = () => {
    refreshAllSections(apiCalls);
  };

  const errors = getAllErrors();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <button
            onClick={handleRefreshAll}
            disabled={isAnySectionLoading}
            className="refresh-button"
          >
            {isAnySectionLoading ? (
              <>
                <span className="spinner-small" />
                Actualizando...
              </>
            ) : (
              <>
                🔄 Actualizar Todo
              </>
            )}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-summary">
          <h3>⚠️ Errores detectados en {errors.length} sección(es)</h3>
          <ul>
            {errors.map(({ id, error }) => (
              <li key={id}>{id}: {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Sección Analytics */}
        <ErrorBoundary fallback={<div>Error en Analytics</div>}>
          <SectionLoader
            sectionId="analytics"
            getSectionState={getSectionState}
            title="Analytics"
            icon="📊"
          >
            {(data) => (
              <div className="analytics-section">
                <div className="metric">
                  <span className="metric-value">{data.views?.toLocaleString()}</span>
                  <span className="metric-label">Views</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.users?.toLocaleString()}</span>
                  <span className="metric-label">Users</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Sales */}
        <ErrorBoundary fallback={<div>Error en Sales</div>}>
          <SectionLoader
            sectionId="sales"
            getSectionState={getSectionState}
            title="Sales"
            icon="💰"
          >
            {(data) => (
              <div className="sales-section">
                <div className="metric">
                  <span className="metric-value">${data.total?.toLocaleString()}</span>
                  <span className="metric-label">Revenue</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.orders}</span>
                  <span className="metric-label">Orders</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Traffic */}
        <ErrorBoundary fallback={<div>Error en Traffic</div>}>
          <SectionLoader
            sectionId="traffic"
            getSectionState={getSectionState}
            title="Traffic"
            icon="🚦"
          >
            {(data) => (
              <div className="traffic-section">
                <div className="metric">
                  <span className="metric-value">{data.visitors?.toLocaleString()}</span>
                  <span className="metric-label">Visitors</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.bounceRate}</span>
                  <span className="metric-label">Bounce Rate</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Conversion */}
        <ErrorBoundary fallback={<div>Error en Conversion</div>}>
          <SectionLoader
            sectionId="conversion"
            getSectionState={getSectionState}
            title="Conversion"
            icon="📈"
          >
            {(data) => (
              <div className="conversion-section">
                <div className="metric">
                  <span className="metric-value">{data.rate}</span>
                  <span className="metric-label">Rate</span>
                </div>
                <div className="metric improvement">
                  <span className="metric-value">{data.improvement}</span>
                  <span className="metric-label">vs Last Month</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Top Products */}
        <ErrorBoundary fallback={<div>Error en Top Products</div>}>
          <SectionLoader
            sectionId="topProducts"
            getSectionState={getSectionState}
            title="Top Products"
            icon="🏆"
            className="top-products-section"
          >
            {(data) => (
              <div className="products-list">
                {data.map((product, index) => (
                  <div key={product.name} className="product-item">
                    <span className="product-rank">#{index + 1}</span>
                    <span className="product-name">{product.name}</span>
                    <span className="product-sales">{product.sales} sales</span>
                  </div>
                ))}
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;
```

### Componente Section Loader

```javascript
// components/SectionLoader.js
import React from 'react';

const SectionLoader = ({
  sectionId,
  getSectionState,
  title,
  icon,
  children,
  className = '',
  showRetry = true,
  onRetry = null
}) => {
  const sectionState = getSectionState(sectionId);
  const { state, data, error, progress, message } = sectionState;

  const handleRetry = () => {
    if (onRetry) {
      onRetry(sectionId);
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="section-loading">
            <div className="loading-spinner" />
            <div className="loading-info">
              <p>{message || 'Cargando...'}</p>
              {progress !== null && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'refreshing':
        return (
          <div className="section-refreshing">
            <div className="refreshing-overlay">
              <span className="spinner-small" />
              <span>Actualizando...</span>
            </div>
            {data && children(data)}
          </div>
        );

      case 'success':
        return (
          <div className="section-success">
            {message && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <span>{message}</span>
              </div>
            )}
            {data && children(data)}
          </div>
        );

      case 'error':
        return (
          <div className="section-error">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <h4>Error al cargar {title}</h4>
              <p>{message || 'Ocurrió un error inesperado'}</p>
              {showRetry && (
                <button onClick={handleRetry} className="retry-button">
                  Reintentar
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="section-idle">
            <p>Listo para cargar {title}</p>
          </div>
        );
    }
  };

  return (
    <div className={`section-container ${className}`}>
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <div className="section-status">
          {state === 'loading' && <span className="status-indicator loading" />}
          {state === 'success' && <span className="status-indicator success" />}
          {state === 'error' && <span className="status-indicator error" />}
          {state === 'refreshing' && <span className="status-indicator refreshing" />}
        </div>
      </div>
      <div className="section-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SectionLoader;
```

---

## 🎨 Patrones de UX Avanzados

### 1. Skeleton Loading Inteligente

**Analogía: Radiografías vs Fotografías** Los skeletons son como radiografías: muestran la estructura antes de que llegue la "imagen completa".

```javascript
// components/SmartSkeleton.js
import React from 'react';

const SmartSkeleton = ({
  type = 'card',
  count = 1,
  animated = true,
  aspectRatio = null,
  customShape = null
}) => {
  const getSkeletonShape = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image" style={{ aspectRatio: aspectRatio || '16/9' }} />
            <div className="skeleton-content">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
              <div className="skeleton-text" />
              <div className="skeleton-actions">
                <div className="skeleton-button" />
                <div className="skeleton-button secondary" />
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-avatar" />
            <div className="skeleton-list-content">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
            <div className="skeleton-action" />
          </div>
        );

      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-th" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-table-row">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="skeleton-td" />
                ))}
              </div>
            ))}
          </div>
        );

      case 'dashboard':
        return (
          <div className="skeleton-dashboard">
            <div className="skeleton-header">
              <div className="skeleton-title large" />
              <div className="skeleton-button" />
            </div>
            <div className="skeleton-metrics">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-metric-card">
                  <div className="skeleton-metric-value" />
                  <div className="skeleton-metric-label" />
                </div>
              ))}
            </div>
            <div className="skeleton-chart" />
          </div>
        );

      case 'custom':
        return customShape;

      default:
        return (
          <div className="skeleton-default">
            <div className="skeleton-title" />
            <div className="skeleton-text" />
            <div className="skeleton-text short" />
          </div>
        );
    }
  };

  return (
    <div className={`skeleton-container ${animated ? 'skeleton-animated' : ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          {getSkeletonShape()}
        </div>
      ))}
    </div>
  );
};

export default SmartSkeleton;

// Hook para detectar cuándo mostrar skeleton
export const useSkeletonStrategy = (query, options = {}) => {
  const {
    showSkeletonThreshold = 300, // ms antes de mostrar skeleton
    minSkeletonTime = 500, // tiempo mínimo de skeleton
    preserveLayoutShift = true
  } = options;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [skeletonStartTime, setSkeletonStartTime] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (query.isLoading && !query.data) {
      // Espera antes de mostrar skeleton para loads rápidos
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(true);
        setSkeletonStartTime(Date.now());
      }, showSkeletonThreshold);
    } else if (query.data && showSkeleton) {
      // Asegura tiempo mínimo de skeleton para evitar flashes
      const elapsed = Date.now() - (skeletonStartTime || 0);
      const remainingTime = Math.max(0, minSkeletonTime - elapsed);

      setTimeout(() => {
        setShowSkeleton(false);
        setSkeletonStartTime(null);
      }, remainingTime);
    } else {
      clearTimeout(timeoutRef.current);
      setShowSkeleton(false);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [query.isLoading, query.data, showSkeleton, skeletonStartTime, showSkeletonThreshold, minSkeletonTime]);

  return {
    showSkeleton: showSkeleton && query.isLoading,
    showContent: query.data && !showSkeleton,
    showStaleContent: query.isFetching && query.data && !showSkeleton,
    preserveLayout: preserveLayoutShift && (showSkeleton || query.data)
  };
};
```

### 2. Progressive Loading Pattern

```javascript
// hooks/useProgressiveLoading.js
import { useState, useEffect, useCallback } from 'react';

export const useProgressiveLoading = (loadingSteps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepData, setStepData] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  const executeStep = useCallback(async (stepIndex) => {
    const step = loadingSteps[stepIndex];
    if (!step) return;

    try {
      setCurrentStep(stepIndex);
      setError(null);
    
      const result = await step.execute();
    
      setStepData(prev => ({
        ...prev,
        [step.id]: result
      }));
    
      setCompletedSteps(prev => [...prev, stepIndex]);
    
      // Si hay más pasos, continúa automáticamente
      if (stepIndex < loadingSteps.length - 1) {
        setTimeout(() => {
          executeStep(stepIndex + 1);
        }, step.delay || 0);
      } else {
        setIsComplete(true);
      }
    } catch (err) {
      setError({ step: stepIndex, error: err });
    }
  }, [loadingSteps]);

  const start = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setStepData({});
    setIsComplete(false);
    setError(null);
    executeStep(0);
  }, [executeStep]);

  const retry = useCallback(() => {
    if (error) {
      executeStep(error.step);
    }
  }, [error, executeStep]);

  const getCurrentStepInfo = () => {
    return loadingSteps[currentStep] || null;
  };

  const getProgress = () => {
    return ((completedSteps.length) / loadingSteps.length) * 100;
  };

  return {
    currentStep,
    completedSteps,
    stepData,
    isComplete,
    error,
    start,
    retry,
    getCurrentStepInfo,
    getProgress,
    totalSteps: loadingSteps.length
  };
};

// Componente Progressive Loader
const ProgressiveLoader = ({ steps, onComplete, children }) => {
  const {
    currentStep,
    completedSteps,
    stepData,
    isComplete,
    error,
    start,
    retry,
    getCurrentStepInfo,
    getProgress
  } = useProgressiveLoading(steps);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete(stepData);
    }
  }, [isComplete, stepData, onComplete]);

  const currentStepInfo = getCurrentStepInfo();
  const progress = getProgress();

  if (isComplete) {
    return children(stepData);
  }

  return (
    <div className="progressive-loader">
      <div className="loader-header">
        <h3>Cargando aplicación...</h3>
        <div className="progress-info">
          {completedSteps.length} / {steps.length} completado
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>

      <div className="steps-list">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`
              step-item
              ${completedSteps.includes(index) ? 'step-completed' : ''}
              ${currentStep === index ? 'step-active' : ''}
              ${error?.step === index ? 'step-error' : ''}
            `}
          >
            <div className="step-indicator">
              {completedSteps.includes(index) ? (
                <span className="step-check">✓</span>
              ) : currentStep === index ? (
                <span className="step-spinner" />
              ) : error?.step === index ? (
                <span className="step-error-icon">⚠</span>
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="error-container">
          <p>Error en el paso: {steps[error.step]?.title}</p>
          <p>{error.error.message}</p>
          <button onClick={retry} className="retry-button">
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

// Ejemplo de uso para inicialización de app
const AppInitializer = ({ children }) => {
  const initSteps = [
    {
      id: 'auth',
      title: 'Verificando autenticación',
      description: 'Validando credenciales de usuario...',
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { user: { id: 1, name: 'Juan' } };
      }
    },
    {
      id: 'config',
      title: 'Cargando configuración',
      description: 'Obteniendo configuraciones de la aplicación...',
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { theme: 'dark', language: 'es' };
      }
    },
    {
      id: 'permissions',
      title: 'Verificando permisos',
      description: 'Cargando permisos de usuario...',
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { canEdit: true, canDelete: false };
      }
    },
    {
      id: 'data',
      title: 'Precargando datos',
      description: 'Cargando datos iniciales de la aplicación...',
      delay: 200,
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return { initialData: 'loaded' };
      }
    }
  ];

  return (
    <ProgressiveLoader steps={initSteps}>
      {(data) => children(data)}
    </ProgressiveLoader>
  );
};
```

### 3. Smart Refresh Pattern

```javascript
// hooks/useSmartRefresh.js
import { useState, useCallback, useRef, useEffect } from 'react';

export const useSmartRefresh = (refreshFn, options = {}) => {
  const {
    cooldownTime = 2000, // 2 segundos entre refreshes
    autoRefreshInterval = null,
    onlineOnly = true,
    showSuccessMessage = true,
    successDuration = 2000
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const cooldownTimer = useRef(null);
  const successTimer = useRef(null);
  const autoRefreshTimer = useRef(null);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto refresh
  useEffect(() => {
    if (autoRefreshInterval && isOnline) {
      autoRefreshTimer.current = setInterval(() => {
        refresh(true); // Silent refresh
      }, autoRefreshInterval);
    }

    return () => {
      if (autoRefreshTimer.current) {
        clearInterval(autoRefreshTimer.current);
      }
    };
  }, [autoRefreshInterval, isOnline]);

  const refresh = useCallback(async (silent = false) => {
    // Verificaciones previas
    if (isRefreshing) return;
    if (!canRefresh && !silent) return;
    if (onlineOnly && !isOnline) return;

    try {
      if (!silent) {
        setIsRefreshing(true);
        setCanRefresh(false);
      }

      await refreshFn();

      setLastRefresh(new Date());

      if (showSuccessMessage && !silent) {
        setShowSuccess(true);
        successTimer.current = setTimeout(() => {
          setShowSuccess(false);
        }, successDuration);
      }

      // Cooldown
      cooldownTimer.current = setTimeout(() => {
        setCanRefresh(true);
      }, cooldownTime);

    } catch (error) {
      console.error('Error during refresh:', error);
      throw error;
    } finally {
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  }, [refreshFn, cooldownTime, onlineOnly, isOnline, showSuccessMessage, successDuration, isRefreshing, canRefresh]);

  const forceRefresh = useCallback(async () => {
    // Fuerza refresh ignorando cooldown
    setCanRefresh(true);
    await refresh();
  }, [refresh]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (successTimer.current) clearTimeout(successTimer.current);
      if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
    };
  }, []);

  const getTimeSinceLastRefresh = () => {
    if (!lastRefresh) return null;
    return Date.now() - lastRefresh.getTime();
  };

  return {
    isRefreshing,
    canRefresh: canRefresh && isOnline,
    showSuccess,
    lastRefresh,
    isOnline,
    refresh,
    forceRefresh,
    getTimeSinceLastRefresh
  };
};

// Componente Pull to Refresh
const PullToRefresh = ({ onRefresh, children, threshold = 80 }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
  const {
    isRefreshing,
    canRefresh,
    showSuccess,
    refresh
  } = useSmartRefresh(onRefresh, {
    showSuccessMessage: true,
    cooldownTime: 3000
  });

  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0 && canRefresh) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
  
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
      setShouldRefresh(distance >= threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);
  
    if (shouldRefresh && !isRefreshing) {
      await refresh();
    }
  
    setPullDistance(0);
    setShouldRefresh(false);
  };

  const pullPercentage = Math.min((pullDistance / threshold) * 100, 100);

  return (
    <div 
      ref={containerRef}
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="pull-indicator"
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          opacity: pullDistance > 10 ? 1 : 0
        }}
      >
        <div className="pull-spinner-container">
          <div 
            className={`
              pull-spinner 
              ${isRefreshing ? 'spinning' : ''}
              ${shouldRefresh ? 'ready' : ''}
            `}
            style={{
              transform: `rotate(${pullPercentage * 3.6}deg)`
            }}
          >
            {isRefreshing ? '⟳' : shouldRefresh ? '↓' : '↓'}
          </div>
        </div>
        <div className="pull-text">
          {isRefreshing 
            ? 'Actualizando...' 
            : shouldRefresh 
              ? 'Suelta para actualizar'
              : 'Tira para actualizar'
          }
        </div>
      </div>

      {showSuccess && (
        <div className="refresh-success-message">
          ✓ Actualizado exitosamente
        </div>
      )}

      <div 
        className="content"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance * 0.5, 40) : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

---

## 🎪 Casos de Uso del Mundo Real

### 1. E-commerce: Carrito de Compras con Estados Complejos

```javascript
// components/ShoppingCart.js
import React from 'react';
import { useLoadingState } from '../hooks/useLoadingState';

const ShoppingCartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const updateState = useLoadingState();
  const removeState = useLoadingState();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === 0) {
      await removeState.executeAsync(
        () => onRemove(item.id),
        {
          loadingMessage: 'Eliminando...',
          successMessage: 'Producto eliminado'
        }
      );
    } else {
      await updateState.executeAsync(
        () => onUpdateQuantity(item.id, newQuantity),
        {
          loadingMessage: 'Actualizando...',
          successMessage: null // Sin mensaje para cambios de cantidad
        }
      );
    }
  };

  const isDisabled = updateState.isLoading || removeState.isLoading;

  return (
    <div className={`cart-item ${isDisabled ? 'cart-item--updating' : ''}`}>
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>
  
      <div className="item-details">
        <h4>{item.name}</h4>
        <p>${item.price}</p>
    
        {updateState.isSuccess && updateState.message && (
          <div className="success-message">{updateState.message}</div>
        )}
      </div>
  
      <div className="item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isDisabled || item.quantity <= 1}
            className="quantity-btn"
          >
            -
          </button>
      
          <span className="quantity-display">
            {updateState.isLoading ? (
              <span className="spinner-small"
```


```
// Reglas de decisión basadas en contexto
const rules = [
  {
    condition: () => 
      operationType === 'navigation' && 
      userImpact === 'high',
    strategy: 'global',
    reason: 'Navegación crítica requiere atención completa del usuario'
  },
  {
    condition: () => 
      operationType === 'form-submit' && 
      userContext === 'completing-task',
    strategy: 'global',
    reason: 'Evita interrupciones durante completado de tareas importantes'
  },
  {
    condition: () => 
      dataSize === 'large' && 
      dependencies === 'many',
    strategy: 'sectional',
    reason: 'Datos complejos se benefician de carga progresiva'
  },
  {
    condition: () => 
      operationType === 'action' && 
      duration === 'instant',
    strategy: 'individual',
    reason: 'Acciones rápidas necesitan feedback inmediato localizado'
  },
  {
    condition: () => 
      userContext === 'browsing' && 
      userImpact === 'low',
    strategy: 'individual',
    reason: 'Durante exploración, mantener resto de UI interactiva'
  },
  {
    condition: () => 
      duration === 'very-slow' && 
      userImpact === 'critical',
    strategy: 'progressive',
    reason: 'Operaciones largas críticas necesitan progreso visible'
  }
];

// Encuentra la primera regla que aplica
const matchingRule = rules.find(rule => rule.condition());

return matchingRule || {
  strategy: 'individual',
  reason: 'Estrategia por defecto para casos no específicos'
};
```

},

// Configuraciones recomendadas por estrategia getStrategyConfig: (strategy, context) => { const configs = { global: { showProgress: context.duration === 'slow' || context.duration === 'very-slow', allowCancel: context.userImpact !== 'critical', showEstimatedTime: context.duration === 'very-slow', blockInteraction: true, showSpinner: true, overlayStyle: 'full', zIndex: 9999 },

```
  sectional: {
    showProgress: true,
    allowPartialInteraction: true,
    showSkeletons: context.dataSize === 'large',
    progressiveReveal: true,
    retryIndividualSections: true,
    showSectionStatus: true
  },
  
  individual: {
    showProgress: context.duration !== 'instant',
    showSpinner: true,
    disableComponent: true,
    showTooltipFeedback: context.userImpact === 'low',
    allowOptimisticUpdates: context.operationType === 'action',
    quickFeedback: context.duration === 'fast'
  },
  
  progressive: {
    showDetailedProgress: true,
    showStepProgress: true,
    allowStepSkipping: false,
    showTimeEstimates: true,
    showCurrentAction: true,
    allowPause: context.userImpact !== 'critical'
  }
};

return configs[strategy] || configs.individual;
```

} };

// Hook para usar la estrategia automáticamente export const useSmartLoadingStrategy = (context) => { const recommendation = LoadingStrategy.getRecommendedStrategy(context); const config = LoadingStrategy.getStrategyConfig(recommendation.strategy, context);

return { strategy: recommendation.strategy, config, reason: recommendation.reason,

```
// Helpers para implementar
shouldUseGlobal: () => recommendation.strategy === 'global',
shouldUseSectional: () => recommendation.strategy === 'sectional',
shouldUseIndividual: () => recommendation.strategy === 'individual',
shouldUseProgressive: () => recommendation.strategy === 'progressive'
```

}; };

```

### Ejemplos de Aplicación de Estrategias

```javascript
// components/SmartLoadingExample.js
import React from 'react';
import { useSmartLoadingStrategy } from '../utils/loadingStrategy';

// Ejemplo 1: Navegación Principal
const MainNavigation = ({ onNavigate, destination }) => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'navigation',
    userImpact: 'high',
    duration: 'fast',
    userContext: 'browsing'
  });

  if (strategy.shouldUseGlobal()) {
    return <GlobalNavigationLoader onNavigate={onNavigate} />;
  }
  
  return <RegularNavigation onNavigate={onNavigate} />;
};

// Ejemplo 2: Dashboard con Múltiples Métricas
const MetricsDashboard = () => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'data-fetch',
    dataSize: 'large',
    userImpact: 'medium',
    duration: 'slow',
    dependencies: 'many',
    userContext: 'working'
  });

  if (strategy.shouldUseSectional()) {
    return <SectionalDashboard config={strategy.config} />;
  }
  
  return <SimpleDashboard />;
};

// Ejemplo 3: Botón de Acción Rápida
const QuickActionButton = ({ onClick, children }) => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'action',
    userImpact: 'low',
    duration: 'instant',
    userContext: 'browsing'
  });

  return (
    <LoadingButton
      onClick={onClick}
      showProgress={strategy.config.showProgress}
      optimistic={strategy.config.allowOptimisticUpdates}
    >
      {children}
    </LoadingButton>
  );
};

// Ejemplo 4: Subida de Archivo Grande
const FileUploader = ({ onUpload }) => {
  const strategy = useSmartLoadingStrategy({
    operationType: 'form-submit',
    dataSize: 'large',
    userImpact: 'critical',
    duration: 'very-slow',
    userContext: 'completing-task'
  });

  if (strategy.shouldUseProgressive()) {
    return (
      <ProgressiveFileUploader 
        onUpload={onUpload}
        config={strategy.config}
      />
    );
  }

  return (
    <GlobalFileUploader 
      onUpload={onUpload}
      config={strategy.config}
    />
  );
};
```

---

## 📱 Consideraciones para Mobile y Performance

### Optimizaciones Específicas para Mobile

```javascript
// hooks/useMobileLoadingOptimizations.js
import { useState, useEffect, useMemo } from 'react';

export const useMobileLoadingOptimizations = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEnd: false,
    connectionType: 'unknown',
    batteryLevel: 1,
    reducedMotion: false
  });

  useEffect(() => {
    // Detectar dispositivo móvil
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);

    // Detectar dispositivos de baja gama
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     navigator.deviceMemory <= 2;

    // Detectar tipo de conexión
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection ? connection.effectiveType : 'unknown';

    // Detectar preferencia de movimiento reducido
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Monitorear batería (si está disponible)
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setDeviceInfo(prev => ({
          ...prev,
          batteryLevel: battery.level
        }));

        battery.addEventListener('levelchange', () => {
          setDeviceInfo(prev => ({
            ...prev,
            batteryLevel: battery.level
          }));
        });
      });
    }

    setDeviceInfo(prev => ({
      ...prev,
      isMobile,
      isLowEnd,
      connectionType,
      reducedMotion
    }));
  }, []);

  // Configuraciones optimizadas basadas en el dispositivo
  const optimizedConfig = useMemo(() => {
    const config = {
      shouldReduceAnimations: deviceInfo.isLowEnd || 
                             deviceInfo.reducedMotion || 
                             deviceInfo.batteryLevel < 0.2,
  
      shouldSimplifySkeletons: deviceInfo.isLowEnd || 
                              deviceInfo.connectionType === 'slow-2g',
  
      shouldReduceRefreshRate: deviceInfo.batteryLevel < 0.3,
  
      shouldPreferStaticLoaders: deviceInfo.connectionType === 'slow-2g' || 
                                deviceInfo.isLowEnd,
  
      shouldBatchUpdates: deviceInfo.isLowEnd,
  
      shouldReduceProgressGranularity: deviceInfo.isLowEnd,
  
      maxConcurrentLoaders: deviceInfo.isLowEnd ? 2 : 
                           deviceInfo.isMobile ? 3 : 5,
  
      debounceDelay: deviceInfo.isLowEnd ? 300 : 
                    deviceInfo.isMobile ? 200 : 100,
  
      skeletonStyle: deviceInfo.shouldSimplifySkeletons ? 'simple' : 'detailed'
    };

    return config;
  }, [deviceInfo]);

  return {
    deviceInfo,
    optimizedConfig,
  
    // Helpers para componentes
    getOptimizedSpinner: () => {
      if (optimizedConfig.shouldPreferStaticLoaders) {
        return 'dots'; // Spinner simple con puntos
      }
      if (optimizedConfig.shouldReduceAnimations) {
        return 'pulse'; // Animación suave
      }
      return 'spin'; // Spinner completo
    },
  
    getSkeletonConfig: () => ({
      animated: !optimizedConfig.shouldReduceAnimations,
      style: optimizedConfig.skeletonStyle,
      shimmer: !optimizedConfig.shouldPreferStaticLoaders
    }),
  
    getProgressConfig: () => ({
      granularity: optimizedConfig.shouldReduceProgressGranularity ? 10 : 1,
      smoothTransitions: !optimizedConfig.shouldReduceAnimations
    })
  };
};

// Componente optimizado para mobile
const MobileOptimizedLoader = ({ children, type = 'default' }) => {
  const { optimizedConfig, getOptimizedSpinner, getSkeletonConfig } = useMobileLoadingOptimizations();
  
  const spinnerType = getOptimizedSpinner();
  const skeletonConfig = getSkeletonConfig();

  if (type === 'skeleton') {
    return (
      <SmartSkeleton 
        animated={skeletonConfig.animated}
        shimmer={skeletonConfig.shimmer}
        style={skeletonConfig.style}
      />
    );
  }

  return (
    <div className={`mobile-optimized-loader mobile-optimized-loader--${spinnerType}`}>
      {spinnerType === 'dots' && <DotsLoader />}
      {spinnerType === 'pulse' && <PulseLoader />}
      {spinnerType === 'spin' && <SpinLoader />}
      {children}
    </div>
  );
};
```

### Gestión de Memoria y Performance

```javascript
// hooks/usePerformanceOptimizedLoading.js
import { useCallback, useRef, useEffect, useState } from 'react';

export const usePerformanceOptimizedLoading = () => {
  const activeLoaders = useRef(new Set());
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalLoaders: 0,
    memoryUsage: 0,
    averageLoadTime: 0
  });

  // Throttle de actualizaciones de UI
  const throttledUpdate = useRef(null);

  const registerLoader = useCallback((id, priority = 'normal') => {
    activeLoaders.current.add({ id, priority, startTime: Date.now() });
  
    // Límite de loaders concurrentes
    if (activeLoaders.current.size > 5) {
      const lowPriorityLoaders = Array.from(activeLoaders.current)
        .filter(loader => loader.priority === 'low')
        .sort((a, b) => a.startTime - b.startTime);
  
      if (lowPriorityLoaders.length > 0) {
        activeLoaders.current.delete(lowPriorityLoaders[0]);
      }
    }

    updateMetrics();
  }, []);

  const unregisterLoader = useCallback((id) => {
    const loader = Array.from(activeLoaders.current).find(l => l.id === id);
    if (loader) {
      activeLoaders.current.delete(loader);
      updateMetrics();
    }
  }, []);

  const updateMetrics = useCallback(() => {
    if (throttledUpdate.current) return;
  
    throttledUpdate.current = setTimeout(() => {
      setPerformanceMetrics({
        totalLoaders: activeLoaders.current.size,
        memoryUsage: getMemoryUsage(),
        averageLoadTime: calculateAverageLoadTime()
      });
      throttledUpdate.current = null;
    }, 100);
  }, []);

  const getMemoryUsage = () => {
    if ('memory' in performance) {
      return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  };

  const calculateAverageLoadTime = () => {
    const now = Date.now();
    const times = Array.from(activeLoaders.current).map(loader => now - loader.startTime);
    return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0;
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (throttledUpdate.current) {
        clearTimeout(throttledUpdate.current);
      }
    };
  }, []);

  return {
    registerLoader,
    unregisterLoader,
    performanceMetrics,
    shouldReduceLoaders: performanceMetrics.totalLoaders > 3,
    shouldOptimizeAnimations: performanceMetrics.memoryUsage > 50
  };
};

// Hook para lazy loading inteligente
export const useIntelligentLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
    
        if (entry.isIntersecting) {
          // Delay adicional basado en la velocidad de scroll
          const scrollSpeed = Math.abs(window.scrollY - (window.lastScrollY || 0));
          const delay = scrollSpeed > 100 ? 500 : 0; // Si scroll rápido, espera más
      
          setTimeout(() => {
            setShouldLoad(true);
          }, delay);
        }
    
        window.lastScrollY = window.scrollY;
      },
      { threshold, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return {
    elementRef,
    isVisible,
    shouldLoad: shouldLoad && isVisible
  };
};
```

---

## 🎭 Patrones de UX Avanzados para Loading

### Storytelling con Loading States

**Analogía: Narración Cinematográfica** Como un director de cine, cada loading state cuenta una historia. El suspense, la revelación, y la resolución deben fluir naturalmente.

```javascript
// components/StorytellingLoader.js
const StorytellingLoader = ({ 
  story, 
  currentChapter, 
  onChapterComplete,
  estimatedDuration 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);

  const chapters = story.chapters || [];
  const currentChapterData = chapters[currentChapter];
  
  useEffect(() => {
    if (!currentChapterData) return;

    const scenes = currentChapterData.scenes;
    const sceneInterval = estimatedDuration / scenes.length;
  
    const timer = setInterval(() => {
      setCurrentScene(prev => {
        const next = prev + 1;
        if (next >= scenes.length) {
          clearInterval(timer);
          onChapterComplete?.();
          return prev;
        }
        return next;
      });
    }, sceneInterval);

    return () => clearInterval(timer);
  }, [currentChapter, currentChapterData, estimatedDuration, onChapterComplete]);

  const currentSceneData = currentChapterData?.scenes[currentScene];

  return (
    <div className="storytelling-loader">
      <div className="story-header">
        <h2>{story.title}</h2>
        <div className="chapter-indicator">
          Capítulo {currentChapter + 1} de {chapters.length}
        </div>
      </div>

      <div className="story-scene">
        <div className="scene-illustration">
          {currentSceneData?.illustration || '⏳'}
        </div>
    
        <div className="scene-narrative">
          <h3>{currentChapterData?.title}</h3>
          <p>{currentSceneData?.description}</p>
        </div>
      </div>

      <div className="story-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((currentScene + 1) / currentChapterData?.scenes.length) * 100}%` 
            }}
          />
        </div>
        <div className="scene-indicators">
          {currentChapterData?.scenes.map((_, index) => (
            <div 
              key={index}
              className={`
                scene-dot 
                ${index <= currentScene ? 'completed' : ''}
                ${index === currentScene ? 'active' : ''}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso para onboarding
const OnboardingLoader = () => {
  const [currentChapter, setCurrentChapter] = useState(0);

  const onboardingStory = {
    title: "Preparando tu experiencia personalizada",
    chapters: [
      {
        title: "Configurando tu perfil",
        scenes: [
          {
            description: "Analizando tus preferencias...",
            illustration: "🔍"
          },
          {
            description: "Personalizando la interfaz...",
            illustration: "🎨"
          },
          {
            description: "Configurando notificaciones...",
            illustration: "🔔"
          }
        ]
      },
      {
        title: "Cargando contenido relevante",
        scenes: [
          {
            description: "Buscando recomendaciones...",
            illustration: "🎯"
          },
          {
            description: "Preparando tu dashboard...",
            illustration: "📊"
          }
        ]
      },
      {
        title: "Finalizando configuración",
        scenes: [
          {
            description: "Últimos ajustes...",
            illustration: "⚙️"
          },
          {
            description: "¡Listo para comenzar!",
            illustration: "🚀"
          }
        ]
      }
    ]
  };

  const handleChapterComplete = () => {
    if (currentChapter < onboardingStory.chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  return (
    <StorytellingLoader
      story={onboardingStory}
      currentChapter={currentChapter}
      onChapterComplete={handleChapterComplete}
      estimatedDuration={3000}
    />
  );
};
```

### Microinteracciones y Feedback Inmediato

```javascript
// components/MicroInteractionLoader.js
const MicroInteractionButton = ({ 
  onClick, 
  children, 
  microFeedback = true,
  hapticFeedback = false
}) => {
  const [interactionState, setInteractionState] = useState('idle');
  const [ripples, setRipples] = useState([]);

  const handleClick = async (e) => {
    if (interactionState !== 'idle') return;

    // Microinteracción inmediata
    if (microFeedback) {
      addRipple(e);
    }

    // Haptic feedback en mobile
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setInteractionState('processing');

    try {
      await onClick(e);
      setInteractionState('success');
  
      // Auto-reset después del éxito
      setTimeout(() => {
        setInteractionState('idle');
      }, 1500);
    } catch (error) {
      setInteractionState('error');
  
      // Shake animation en error
      setTimeout(() => {
        setInteractionState('idle');
      }, 2000);
    }
  };

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
  
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
  
    setRipples(prev => [...prev, newRipple]);
  
    // Remover ripple después de la animación
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      className={`
        micro-interaction-button
        micro-interaction-button--${interactionState}
      `}
      onClick={handleClick}
      disabled={interactionState === 'processing'}
    >
      <span className="button-content">
        {interactionState === 'processing' && (
          <span className="processing-indicator">
            <span className="pulse-dot" />
            <span className="pulse-dot" />
            <span className="pulse-dot" />
          </span>
        )}
    
        {interactionState === 'success' && (
          <span className="success-indicator">✓</span>
        )}
    
        {interactionState === 'error' && (
          <span className="error-indicator">⚠</span>
        )}
    
        {(interactionState === 'idle' || interactionState === 'processing') && children}
        {interactionState === 'success' && '¡Completado!'}
        {interactionState === 'error' && 'Error - Reintentar'}
      </span>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );
};
```

---

## 🔮 Reflexión Final: El Arte de la Espera

### La Paradoja del Loading Perfecto

**"El mejor loading state es el que no necesitas, pero cuando lo necesitas, debe ser excepcional."**

Los estados de carga no son solo indicadores técnicos; son **oportunidades de construir confianza y deleitarr a tus usuarios**. Como un buen anfitrión que mantiene entretenidos a sus invitados mientras prepara la cena, un loading state bien diseñado transforma la espera de una frustración en una experiencia anticipada.

### Las Tres Verdades Universales del Loading

**1. La Percepción es Realidad** Un loading de 2 segundos que se siente como 30 segundos es peor que uno de 5 segundos que se siente como 2 segundos. La **psicología del tiempo** es más importante que la velocidad real.

**2. El Contexto lo es Todo** El mismo loading state puede ser perfecto en una situación y terrible en otra. Un loading global durante una compra crítica es apropiado; durante la navegación casual, es molesto.

**3. La Consistencia Construye Confianza** Los usuarios aprenden los patrones de tu aplicación. Cambiar estrategias constantemente genera ansiedad e incertidumbre.

### El Framework Mental: "Las 4 C's del Loading"

1. **Clarity (Claridad)**: ¿El usuario entiende qué está pasando?
2. **Control (Control)**: ¿El usuario siente que puede influir en la situación?
3. **Comfort (Comodidad)**: ¿La experiencia es agradable o al menos tolerable?
4. **Completion (Completitud)**: ¿El usuario sabe cuándo terminará?

### Antipatrones Comunes que Debes Evitar

**🚫 El "Loading Mentiroso"**

```javascript
// ❌ MAL: Progreso que no refleja la realidad
setProgress(90); // Cuando realmente falta mucho tiempo
```

**🚫 El "Loading Zombie"**

```javascript
// ❌ MAL: Loading que nunca termina
if (isLoading) return <Spinner />; // Sin manejo de errores
```

**🚫 El "Loading Esquizofrénico"**

```javascript
// ❌ MAL: Múltiples loaders conflictivos
{isLoadingUsers && <Spinner />}
{isLoadingPosts && <Spinner />}
{isLoadingComments && <Spinner />}
```

### Principios para Loading States Excepcionales

**✅ Principio de Anticipación**

```javascript
// ✅ BIEN: Prepara lo que viene después
const { prefetchNextPage } = usePrefetch();
onMouseEnter={() => prefetchNextPage()}
```

**✅ Principio de Gracia Progresiva**

```javascript
// ✅ BIEN: Mejora según capacidades del dispositivo
const LoadingComponent = ({ useAdvancedAnimations }) => {
  return useAdvancedAnimations ? <AdvancedLoader /> : <SimpleLoader />;
};
```

**✅ Principio de Recuperación Elegante**

```javascript
// ✅ BIEN: Siempre hay un plan B
{error ? <RetryInterface /> : isLoading ? <LoadingState /> : <Content />}
```

### El Futuro de los Loading States

**Tendencias Emergentes:**

1. **IA Predictiva**: Loading states que aprenden de patrones de uso
2. **Realidad Aumentada**: Loading en contexto espacial
3. **Biometric Feedback**: Adaptación basada en estrés del usuario
4. **Edge Computing**: Loading distribuido e inteligente

### Métricas que Realmente Importan

**No solo midas velocidad, mide experiencia:**

* **Perceived Performance Index (PPI)**: Velocidad percibida vs real
* **Loading Anxiety Score (LAS)**: Nivel de estrés durante la espera
* **Completion Confidence Rate (CCR)**: Confianza en que el proceso terminará
* **Interruption Tolerance Index (ITI)**: Facilidad para retomar tras interrupciones

### Tu Manifiesto Personal del Loading

Como desarrollador, comprométete a:

1. **Nunca dejar al usuario en la incertidumbre**
2. **Siempre proporcionar una salida de emergencia**
3. **Respetar el contexto del usuario**
4. **Celebrar los pequeños logros en el viaje**
5. **Hacer que la espera valga la pena**

### Conclusión: Maestría a Través de la Empatía

Los loading states excepcionales nacen de la **empatía profunda** con tus usuarios. No son solo características técnicas; son momentos de cuidado humano expresados a través del código.

Cada spinner, cada barra de progreso, cada skeleton screen es una oportunidad de decir: **"Entiendo que tu tiempo es valioso, y estoy trabajando para ti."**

La próxima vez que implementes un loading state, pregúntate:

* ¿Cómo se sentiría mi madre usando esto?
* ¿Qué esperaría si fuera yo quien estuviera esperando?
* ¿Cómo puedo hacer que esta espera sea menos espera y más anticipación?

**Recuerda**: En un mundo de interfaces instantáneas, los momentos de carga son donde realmente demuestras tu maestría como desarrollador. No los desperdicies.

---

*"El código más elegante no es el que funciona más rápido, sino el que hace sentir al usuario que su tiempo es respetado y su experiencia valorada."*

🎯 **¡Ahora tienes las herramientas para crear loading states que no solo informen, sino que deleiten!**

```
      <button 
        onClick={() => handleQuantityChange(item.quantity + 1)}
        disabled={isDisabled}
        className="quantity-btn"
      >
        +
      </button>
    </div>
  
    <button 
      onClick={() => handleQuantityChange(0)}
      disabled={isDisabled}
      className={`remove-btn ${removeState.isLoading ? 'removing' : ''}`}
    >
      {removeState.isLoading ? (
        <>
          <span className="spinner-small" />
          Eliminando...
        </>
      ) : (
        '🗑️ Eliminar'
      )}
    </button>
  </div>
</div>
```

); };

const ShoppingCart = ({ items, onUpdateQuantity, onRemove, onCheckout }) => { const checkoutState = useLoadingState();

const handleCheckout = async () => { await checkoutState.executeAsync( async (updateProgress) => { updateProgress(20, 'Validando carrito...'); await new Promise(resolve => setTimeout(resolve, 1000));

```
    updateProgress(50, 'Procesando pago...');
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    updateProgress(80, 'Confirmando orden...');
    await onCheckout();
  
    updateProgress(100, 'Orden completada');
  },
  {
    loadingMessage: 'Procesando compra...',
    successMessage: '¡Compra realizada exitosamente!',
    showProgress: true
  }
);
```

};

const total = items.reduce((sum, item) => sum + (item.price \* item.quantity), 0);

return ( <div className="shopping-cart"> <h2>Carrito de Compras</h2>

```
  <div className="cart-items">
    {items.map(item => (
      <ShoppingCartItem
        key={item.id}
        item={item}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
    ))}
  </div>
  
  <div className="cart-summary">
    <div className="total">
      <strong>Total: ${total.toFixed(2)}</strong>
    </div>
  
    <LoadingButton
      onClick={handleCheckout}
      variant="primary"
      size="large"
      showProgress={true}
      loadingText="Procesando..."
      successText="¡Compra completada!"
      disabled={items.length === 0}
      className="checkout-btn"
    >
      Proceder al Pago
    </LoadingButton>
  
    {checkoutState.isSuccess && (
      <div className="checkout-success">
        <h3>✅ ¡Orden procesada exitosamente!</h3>
        <p>Recibirás un email de confirmación pronto.</p>
      </div>
    )}
  </div>
</div>
```

); };

```

### 2. Sistema de Notificaciones con Estados Dinámicos

```javascript
// components/NotificationCenter.js
import React, { useState, useEffect } from 'react';
import { useSectionLoading } from '../hooks/useSectionLoading';

const NotificationItem = ({ notification, onMarkRead, onArchive }) => {
  const readState = useLoadingState();
  const archiveState = useLoadingState();

  const handleMarkRead = async () => {
    if (notification.isRead) return;
  
    await readState.executeAsync(
      () => onMarkRead(notification.id),
      {
        successMessage: 'Marcada como leída'
      }
    );
  };

  const handleArchive = async () => {
    await archiveState.executeAsync(
      () => onArchive(notification.id),
      {
        loadingMessage: 'Archivando...',
        successMessage: 'Notificación archivada'
      }
    );
  };

  const isLoading = readState.isLoading || archiveState.isLoading;

  return (
    <div className={`
      notification-item 
      ${notification.isRead ? 'notification--read' : 'notification--unread'}
      ${isLoading ? 'notification--updating' : ''}
    `}>
      <div className="notification-indicator">
        {!notification.isRead && <div className="unread-dot" />}
      </div>
  
      <div className="notification-content" onClick={handleMarkRead}>
        <div className="notification-header">
          <h4>{notification.title}</h4>
          <span className="notification-time">{notification.timeAgo}</span>
        </div>
        <p>{notification.message}</p>
    
        {readState.isSuccess && (
          <div className="action-feedback">
            ✓ Marcada como leída
          </div>
        )}
      </div>
  
      <div className="notification-actions">
        <button
          onClick={handleArchive}
          disabled={isLoading}
          className="archive-btn"
        >
          {archiveState.isLoading ? (
            <span className="spinner-small" />
          ) : (
            '📁'
          )}
        </button>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const [filter, setFilter] = useState('all');
  const {
    getSectionState,
    executeSectionAsync,
    isAnySectionLoading
  } = useSectionLoading(['notifications', 'unreadCount']);

  // Cargar notificaciones por categoría
  const loadNotifications = async (filterType) => {
    await executeSectionAsync(
      'notifications',
      async (updateProgress) => {
        updateProgress(30, 'Conectando con servidor...');
        await new Promise(resolve => setTimeout(resolve, 800));
    
        updateProgress(70, 'Filtrando notificaciones...');
        await new Promise(resolve => setTimeout(resolve, 400));
    
        // Simular datos
        const mockNotifications = [
          {
            id: 1,
            title: 'Nueva orden recibida',
            message: 'Tienes una nueva orden de Juan Pérez por $150.00',
            timeAgo: '2 min',
            isRead: false,
            category: 'orders'
          },
          {
            id: 2,
            title: 'Pago procesado',
            message: 'El pago de la orden #1234 ha sido procesado exitosamente',
            timeAgo: '10 min',
            isRead: true,
            category: 'payments'
          }
        ];
    
        return filterType === 'all' 
          ? mockNotifications 
          : mockNotifications.filter(n => n.category === filterType);
      },
      {
        loadingMessage: 'Cargando notificaciones...',
        showProgress: true
      }
    );
  };

  // Cargar contador de no leídas
  const loadUnreadCount = async () => {
    await executeSectionAsync(
      'unreadCount',
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return 3; // Mock count
      }
    );
  };

  useEffect(() => {
    loadNotifications(filter);
    loadUnreadCount();
  }, [filter]);

  const notificationsState = getSectionState('notifications');
  const unreadCountState = getSectionState('unreadCount');

  const handleMarkRead = async (notificationId) => {
    // Optimistic update
    const updatedNotifications = notificationsState.data.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
  
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // Update local state
    notificationsState.data = updatedNotifications;
  };

  const handleArchive = async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
  
    // Remove from list
    const filteredNotifications = notificationsState.data.filter(
      n => n.id !== notificationId
    );
    notificationsState.data = filteredNotifications;
  };

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>
          Notificaciones
          {unreadCountState.data > 0 && (
            <span className="unread-badge">
              {unreadCountState.data}
            </span>
          )}
        </h2>
    
        <div className="notification-filters">
          {['all', 'orders', 'payments', 'system'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`filter-btn ${filter === filterType ? 'active' : ''}`}
              disabled={isAnySectionLoading}
            >
              {filterType === 'all' ? 'Todas' : filterType}
            </button>
          ))}
        </div>
      </div>
  
      <div className="notification-list">
        {notificationsState.state === 'loading' && (
          <div className="loading-state">
            <SmartSkeleton type="list" count={3} />
            {notificationsState.message && (
              <p className="loading-message">{notificationsState.message}</p>
            )}
          </div>
        )}
    
        {notificationsState.state === 'success' && (
          <>
            {notificationsState.data?.length > 0 ? (
              notificationsState.data.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onArchive={handleArchive}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>📭 No hay notificaciones</h3>
                <p>Todas las notificaciones aparecerán aquí</p>
              </div>
            )}
          </>
        )}
    
        {notificationsState.state === 'error' && (
          <div className="error-state">
            <h3>⚠️ Error al cargar notificaciones</h3>
            <p>{notificationsState.message}</p>
            <button onClick={() => loadNotifications(filter)}>
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 3. Formulario Multi-Paso con Estados Avanzados

```javascript
// components/MultiStepForm.js
import React, { useState } from 'react';
import { useFormLoadingState } from '../hooks/useLoadingState';

const FormStep = ({ title, children, isActive, isCompleted, hasError }) => {
  return (
    <div className={`
      form-step 
      ${isActive ? 'form-step--active' : ''}
      ${isCompleted ? 'form-step--completed' : ''}
      ${hasError ? 'form-step--error' : ''}
    `}>
      <div className="step-header">
        <div className="step-indicator">
          {isCompleted ? '✓' : hasError ? '⚠' : ''}
        </div>
        <h3>{title}</h3>
      </div>
      {isActive && (
        <div className="step-content">
          {children}
        </div>
      )}
    </div>
  );
};

const MultiStepForm = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    contact: {},
    preferences: {}
  });
  const [stepErrors, setStepErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  const formState = useFormLoadingState();

  const steps = [
    {
      id: 'personal',
      title: 'Información Personal',
      fields: ['firstName', 'lastName', 'birthDate']
    },
    {
      id: 'contact',
      title: 'Información de Contacto',
      fields: ['email', 'phone', 'address']
    },
    {
      id: 'preferences',
      title: 'Preferencias',
      fields: ['notifications', 'theme', 'language']
    }
  ];

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const stepData = formData[step.id];
    const errors = {};

    step.fields.forEach(field => {
      if (!stepData[field]) {
        errors[field] = 'Este campo es requerido';
      }
    });

    if (Object.keys(errors).length > 0) {
      setStepErrors(prev => ({
        ...prev,
        [step.id]: errors
      }));
      return false;
    } else {
      setStepErrors(prev => ({
        ...prev,
        [step.id]: {}
      }));
      return true;
    }
  };

  const handleStepSubmit = async (stepIndex) => {
    const isValid = validateStep(stepIndex);
    if (!isValid) return;

    // Simular validación en servidor
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCompletedSteps(prev => [...prev, stepIndex]);

    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      // Último paso, enviar formulario completo
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    await formState.submitForm(formData, async (data) => {
      // Simular envío al servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onSubmit(data);
    });
  };

  const updateFormData = (stepId, fieldData) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        ...fieldData
      }
    }));
  };

  const currentStepData = steps[currentStep];
  const currentStepErrors = stepErrors[currentStepData?.id] || {};

  if (formState.isSuccess) {
    return (
      <div className="form-success">
        <div className="success-animation">✅</div>
        <h2>¡Formulario enviado exitosamente!</h2>
        <p>Recibirás una confirmación por email pronto.</p>
      </div>
    );
  }

  return (
    <div className="multi-step-form">
      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
        <div className="step-indicators">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                step-indicator
                ${index <= currentStep ? 'active' : ''}
                ${completedSteps.includes(index) ? 'completed' : ''}
                ${stepErrors[step.id] && Object.keys(stepErrors[step.id]).length > 0 ? 'error' : ''}
              `}
            >
              <span>{index + 1}</span>
              <label>{step.title}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-steps">
        {steps.map((step, index) => (
          <FormStep
            key={step.id}
            title={step.title}
            isActive={index === currentStep}
            isCompleted={completedSteps.includes(index)}
            hasError={stepErrors[step.id] && Object.keys(stepErrors[step.id]).length > 0}
          >
            {/* Render específico para cada paso */}
            {step.id === 'personal' && (
              <PersonalInfoStep
                data={formData.personal}
                errors={currentStepErrors}
                onChange={(data) => updateFormData('personal', data)}
              />
            )}
        
            {step.id === 'contact' && (
              <ContactInfoStep
                data={formData.contact}
                errors={currentStepErrors}
                onChange={(data) => updateFormData('contact', data)}
              />
            )}
        
            {step.id === 'preferences' && (
              <PreferencesStep
                data={formData.preferences}
                errors={currentStepErrors}
                onChange={(data) => updateFormData('preferences', data)}
              />
            )}
          </FormStep>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || formState.isLoading}
          className="btn-secondary"
        >
          Anterior
        </button>

        <LoadingButton
          onClick={() => handleStepSubmit(currentStep)}
          variant="primary"
          showProgress={true}
          loadingText={
            currentStep === steps.length - 1 
              ? "Enviando formulario..." 
              : "Validando paso..."
          }
          disabled={formState.isLoading}
        >
          {currentStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
        </LoadingButton>
      </div>

      {formState.progress !== null && (
        <div className="submission-progress">
          <div className="progress-info">
            <span>Enviando formulario...</span>
            <span>{formState.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${formState.progress}%` }}
            />
          </div>
          {formState.message && (
            <p className="progress-message">{formState.message}</p>
          )}
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 CSS para Estados de Carga

### Estilos Base para Loading States

```css
/* styles/loadingStates.css */

/* Variables CSS para consistency */
:root {
  --loading-color: #3498db;
  --success-color: #2ecc71;
  --error-color: #e74c3c;
  --warning-color: #f39c12;
  --skeleton-color: #f0f0f0;
  --skeleton-shimmer: #e0e0e0;
  
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
  
  --border-radius: 8px;
  --shadow-light: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 8px rgba(0,0,0,0.15);
}

/* Spinner base */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--loading-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 14px;
  height: 14px;
  border-width: 1.5px;
}

.spinner-large {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Loading Button States */
.loading-button {
  position: relative;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.loading-button--primary {
  background: var(--loading-color);
  color: white;
}

.loading-button--secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.loading-button--loading {
  cursor: not-allowed;
  opacity: 0.8;
}

.loading-button--success {
  background: var(--success-color);
  color: white;
}

.loading-button--error {
  background: var(--error-color);
  color: white;
}

.loading-content,
.success-content,
.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.button-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  transition: width var(--transition-normal);
}

/* Skeleton Loading */
.skeleton-container {
  width: 100%;
}

.skeleton-animated {
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

@keyframes skeletonPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.skeleton-item {
  margin-bottom: 16px;
}

.skeleton-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.skeleton-image {
  background: var(--skeleton-color);
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 24px;
  background: var(--skeleton-color);
  border-radius: 4px;
  margin-bottom: 12px;
  width: 80%;
}

.skeleton-subtitle {
  height: 18px;
  background: var(--skeleton-color);
  border-radius: 4px;
  margin-bottom: 8px;
  width: 60%;
}

.skeleton-text {
  height: 16px;
  background: var(--skeleton-color);
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;
}

.skeleton-text.short {
  width: 40%;
}

.skeleton-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.skeleton-button {
  height: 36px;
  background: var(--skeleton-color);
  border-radius: var(--border-radius);
  flex: 1;
}

.skeleton-button.secondary {
  flex: 0.6;
}

/* Shimmer effect */
.skeleton-animated .skeleton-image::before,
.skeleton-animated .skeleton-title::before,
.skeleton-animated .skeleton-subtitle::before,
.skeleton-animated .skeleton-text::before,
.skeleton-animated .skeleton-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--skeleton-shimmer),
    transparent
  );
  animation: shimmer 1.8s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Section Loading */
.section-container {
  border: 1px solid #e9ecef;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
}

.section-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.section-status {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
}

.status-indicator.loading {
  background: var(--loading-color);
  animation: pulse 1.5s infinite;
}

.status-indicator.success {
  background: var(--success-color);
}

.status-indicator.error {
  background: var(--error-color);
}

.status-indicator.refreshing {
  background: var(--warning-color);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.section-content {
  padding: 16px;
  min-height: 100px;
}

.section-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.section-refreshing {
  position: relative;
}

.refreshing-overlay {
  position: absolute;
  top: 8px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--warning-color);
  box-shadow: var(--shadow-light);
}

.section-error {
  text-align: center;
  padding: 32px;
}

.error-content h4 {
  color: var(--error-color);
  margin-bottom: 8px;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 16px;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background var(--transition-normal);
}

.retry-button:hover {
  background: #c0392b;
}

/* Progress bars */
.progress-container {
  width: 100%;
  margin: 16px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--loading-color), var(--success-color));
  transition: width var(--transition-normal);
  border-radius: 4px;
}

.progress-text {
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

/* Success messages */
.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success-color);
  font-size: 14px;
  margin-top: 8px;
  animation: slideInDown var(--transition-normal);
}

.success-icon {
  font-weight: bold;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Error messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--error-color);
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

/* Loading overlay utilities */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.loading-overlay-content {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-medium);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-header {
    padding: 12px;
  }
  
  .section-content {
    padding: 12px;
  }
  
  .loading-button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .skeleton-content {
    padding: 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --skeleton-color: #2d2d2d;
    --skeleton-shimmer: #404040;
  }
  
  .section-container {
    border-color: #404040;
    background: #1a1a1a;
  }
  
  .section-header {
    background: #2d2d2d;
    border-color: #404040;
  }
  
  .loading-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .loading-overlay-content {
    background: #2d2d2d;
    color: white;
  }
}
```

---

## 🧠 Estrategias de Decisión: Cuándo Usar Cada Tipo

### Matriz de Decisión

**Analogía: Sistemas de Transporte Urbano** Como una ciudad tiene diferentes tipos de transporte (metro global, autobuses seccionales, taxis individuales), tu app necesita diferentes tipos de loading.

```javascript
// utils/loadingStrategy.js
export const LoadingStrategy = {# Estados de Carga: Guía Completa para Experiencias de Usuario Excepcionales

## 🎯 Introducción: La Psicología de la Espera

Los estados de carga son como **las salas de espera de un hospital**: pueden ser una experiencia estresante o sorprendentemente agradable, dependiendo de cómo las diseñes. La diferencia entre una aplicación que se siente "lenta" y una que se siente "fluida" no está en la velocidad real, sino en cómo manejas la percepción del tiempo.

### ¿Por qué son Críticos los Estados de Carga?

**Analogía: El Semáforo Inteligente**
Imagina dos semáforos:
- **Semáforo A**: Solo muestra luz roja, no sabes cuánto falta
- **Semáforo B**: Muestra un contador regresivo y el progreso

Ambos duran lo mismo, pero el B se siente más rápido porque **reduces la incertidumbre**.

### Principios Fundamentales

1. **Feedback Inmediato**: Como tocar un instrumento, cada acción debe tener respuesta
2. **Progreso Visible**: Como una barra de descarga, muestra avance
3. **Contexto Preservado**: Como marcadores en un libro, mantén el lugar del usuario
4. **Graceful Degradation**: Como un paraguas, funciona incluso cuando las cosas van mal

---

## 🏗️ Anatomía de los Estados de Carga

### Estados Básicos Universales

```javascript
// Estados fundamentales que toda aplicación necesita
const LoadingStates = {
  IDLE: 'idle',           // Esperando acción del usuario
  LOADING: 'loading',     // Procesando, primera vez
  SUCCESS: 'success',     // Completado exitosamente
  ERROR: 'error',         // Algo salió mal
  REFRESHING: 'refreshing', // Actualizando datos existentes
  RETRYING: 'retrying'    // Intentando de nuevo tras error
};

// Estados avanzados para casos específicos
const AdvancedStates = {
  PENDING: 'pending',     // Esperando confirmación
  OPTIMISTIC: 'optimistic', // Asumiendo éxito antes de confirmar
  STALE: 'stale',         // Datos viejos mientras se actualizan
  OFFLINE: 'offline'      // Sin conexión
};
```

### Tipos de Loading por Contexto

**1. Estados Globales (Global Loading)** Como las **luces de una ciudad**: afectan todo el paisaje visual.

**2. Estados Individuales (Component Loading)** Como **semáforos específicos**: controlan intersecciones particulares.

**3. Estados Seccionales (Section Loading)** Como **indicadores de zona**: muestran actividad en áreas específicas.

---

## 🌍 Estados de Carga Globales

### Cuándo Usar Loading Global

**Analogía: El Telón de un Teatro** El loading global es como bajar el telón entre actos. Usalo cuando:

* Cambias de "acto" completo (navegación entre páginas)
* Cargas datos críticos sin los cuales la página no tiene sentido
* Hay procesos que afectan toda la aplicación

### Implementación con Context API

```javascript
// contexts/LoadingContext.js
import React, { createContext, useContext, useReducer } from 'react';

const LoadingContext = createContext();

const loadingReducer = (state, action) => {
  switch (action.type) {
    case 'START_GLOBAL_LOADING':
      return {
        ...state,
        isGlobalLoading: true,
        globalMessage: action.payload.message || 'Cargando...',
        globalProgress: action.payload.progress || null
      };
  
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        globalProgress: action.payload.progress,
        globalMessage: action.payload.message || state.globalMessage
      };
  
    case 'STOP_GLOBAL_LOADING':
      return {
        ...state,
        isGlobalLoading: false,
        globalMessage: null,
        globalProgress: null
      };
  
    case 'SET_BLOCKING_OPERATION':
      return {
        ...state,
        blockingOperations: {
          ...state.blockingOperations,
          [action.payload.id]: {
            message: action.payload.message,
            progress: action.payload.progress
          }
        }
      };
  
    case 'REMOVE_BLOCKING_OPERATION':
      const newBlockingOps = { ...state.blockingOperations };
      delete newBlockingOps[action.payload.id];
      return {
        ...state,
        blockingOperations: newBlockingOps,
        isGlobalLoading: Object.keys(newBlockingOps).length > 0
      };
  
    default:
      return state;
  }
};

const initialState = {
  isGlobalLoading: false,
  globalMessage: null,
  globalProgress: null,
  blockingOperations: {}
};

export const LoadingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);

  const startGlobalLoading = (message, progress) => {
    dispatch({
      type: 'START_GLOBAL_LOADING',
      payload: { message, progress }
    });
  };

  const updateProgress = (progress, message) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: { progress, message }
    });
  };

  const stopGlobalLoading = () => {
    dispatch({ type: 'STOP_GLOBAL_LOADING' });
  };

  const addBlockingOperation = (id, message, progress) => {
    dispatch({
      type: 'SET_BLOCKING_OPERATION',
      payload: { id, message, progress }
    });
  };

  const removeBlockingOperation = (id) => {
    dispatch({
      type: 'REMOVE_BLOCKING_OPERATION',
      payload: { id }
    });
  };

  const value = {
    ...state,
    startGlobalLoading,
    updateProgress,
    stopGlobalLoading,
    addBlockingOperation,
    removeBlockingOperation
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
};
```

### Hook para Operaciones Globales

```javascript
// hooks/useGlobalOperation.js
import { useGlobalLoading } from '../contexts/LoadingContext';
import { useCallback } from 'react';

export const useGlobalOperation = () => {
  const { addBlockingOperation, removeBlockingOperation } = useGlobalLoading();
  
  const executeGlobalOperation = useCallback(async (
    operationFn,
    options = {}
  ) => {
    const {
      id = Date.now().toString(),
      message = 'Procesando...',
      showProgress = false,
      onProgress = null
    } = options;

    addBlockingOperation(id, message, showProgress ? 0 : null);

    try {
      const result = await operationFn((progress, newMessage) => {
        if (showProgress && onProgress) {
          addBlockingOperation(id, newMessage || message, progress);
          onProgress(progress);
        }
      });

      removeBlockingOperation(id);
      return result;
    } catch (error) {
      removeBlockingOperation(id);
      throw error;
    }
  }, [addBlockingOperation, removeBlockingOperation]);

  return { executeGlobalOperation };
};

// Ejemplo de uso
function FileUpload() {
  const { executeGlobalOperation } = useGlobalOperation();

  const handleFileUpload = async (file) => {
    try {
      await executeGlobalOperation(
        async (updateProgress) => {
          return uploadFileWithProgress(file, (progress) => {
            updateProgress(progress, `Subiendo archivo... ${progress}%`);
          });
        },
        {
          message: 'Subiendo archivo...',
          showProgress: true,
          onProgress: (progress) => {
            console.log(`Upload progress: ${progress}%`);
          }
        }
      );
  
      alert('Archivo subido exitosamente');
    } catch (error) {
      alert('Error al subir archivo');
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => handleFileUpload(e.target.files[0])}
    />
  );
}
```

### Componente Global Loading

```javascript
// components/GlobalLoadingOverlay.js
import React from 'react';
import { useGlobalLoading } from '../contexts/LoadingContext';
import { createPortal } from 'react-dom';

const GlobalLoadingOverlay = () => {
  const { isGlobalLoading, globalMessage, globalProgress, blockingOperations } = useGlobalLoading();

  if (!isGlobalLoading) return null;

  const operations = Object.values(blockingOperations);
  const currentOperation = operations[operations.length - 1]; // Última operación
  const displayMessage = currentOperation?.message || globalMessage;
  const displayProgress = currentOperation?.progress ?? globalProgress;

  return createPortal(
    <div className="global-loading-overlay">
      <div className="loading-backdrop" />
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
    
        <h3 className="loading-title">{displayMessage}</h3>
    
        {displayProgress !== null && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <span className="progress-text">{displayProgress}%</span>
          </div>
        )}
    
        {operations.length > 1 && (
          <div className="operations-queue">
            <p>{operations.length} operaciones en progreso</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default GlobalLoadingOverlay;
```

### CSS para Global Loading

```css
/* styles/globalLoading.css */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.loading-content {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 32px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.progress-container {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.operations-queue {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.operations-queue p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🎯 Estados de Carga Individuales

### Cuándo Usar Loading Individual

**Analogía: Luces de Habitación** Cada componente es como una habitación con su propia luz. Usalo cuando:

* Solo una parte específica está cargando
* Los datos son independientes de otros componentes
* Quieres mantener el resto de la UI interactiva

### Hook Universal para Loading States

```javascript
// hooks/useLoadingState.js
import { useState, useCallback } from 'react';

export const useLoadingState = (initialState = 'idle') => {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState(null);

  const startLoading = useCallback((loadingMessage) => {
    setState('loading');
    setError(null);
    setProgress(null);
    setMessage(loadingMessage || null);
  }, []);

  const setLoadingProgress = useCallback((progressValue, progressMessage) => {
    setProgress(progressValue);
    if (progressMessage) setMessage(progressMessage);
  }, []);

  const setSuccess = useCallback((successMessage) => {
    setState('success');
    setError(null);
    setProgress(null);
    setMessage(successMessage || null);
  }, []);

  const setError = useCallback((errorValue, errorMessage) => {
    setState('error');
    setError(errorValue);
    setProgress(null);
    setMessage(errorMessage || null);
  }, []);

  const startRefreshing = useCallback(() => {
    setState('refreshing');
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setError(null);
    setProgress(null);
    setMessage(null);
  }, []);

  const executeAsync = useCallback(async (asyncFn, options = {}) => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showProgress = false,
      onProgress = null
    } = options;

    try {
      startLoading(loadingMessage);

      const result = await asyncFn((progressValue, progressMessage) => {
        if (showProgress) {
          setLoadingProgress(progressValue, progressMessage);
        }
        if (onProgress) {
          onProgress(progressValue, progressMessage);
        }
      });

      setSuccess(successMessage);
      return result;
    } catch (err) {
      setError(err, errorMessage || err.message);
      throw err;
    }
  }, [startLoading, setLoadingProgress, setSuccess, setError]);

  return {
    // Estados
    state,
    isIdle: state === 'idle',
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isRefreshing: state === 'refreshing',
  
    // Datos
    error,
    progress,
    message,
  
    // Acciones
    startLoading,
    setLoadingProgress,
    setSuccess,
    setError,
    startRefreshing,
    reset,
    executeAsync
  };
};

// Hook especializado para formularios
export const useFormLoadingState = () => {
  const loadingState = useLoadingState();
  
  const submitForm = useCallback(async (formData, submitFn) => {
    return loadingState.executeAsync(
      async (updateProgress) => {
        updateProgress(10, 'Validando datos...');
    
        // Simulación de validación
        await new Promise(resolve => setTimeout(resolve, 500));
        updateProgress(50, 'Enviando datos...');
    
        const result = await submitFn(formData);
        updateProgress(100, 'Completado');
    
        return result;
      },
      {
        loadingMessage: 'Enviando formulario...',
        successMessage: 'Formulario enviado exitosamente',
        showProgress: true
      }
    );
  }, [loadingState]);

  return {
    ...loadingState,
    submitForm
  };
};
```

### Componente de Loading Reutilizable

```javascript
// components/LoadingButton.js
import React from 'react';
import { useLoadingState } from '../hooks/useLoadingState';

const LoadingButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  showProgress = false,
  loadingText = 'Cargando...',
  successText = null,
  className = '',
  ...props
}) => {
  const {
    isLoading,
    isSuccess,
    isError,
    progress,
    message,
    executeAsync
  } = useLoadingState();

  const handleClick = async (e) => {
    if (!onClick || isLoading) return;

    try {
      await executeAsync(
        async (updateProgress) => {
          return await onClick(e, updateProgress);
        },
        {
          loadingMessage: loadingText,
          successMessage: successText,
          showProgress
        }
      );
    } catch (error) {
      // Error ya manejado por executeAsync
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="loading-content">
          <span className="spinner" />
          <span>{message || loadingText}</span>
          {showProgress && progress !== null && (
            <span className="progress">({progress}%)</span>
          )}
        </div>
      );
    }

    if (isSuccess && successText) {
      return (
        <div className="success-content">
          <span className="success-icon">✓</span>
          <span>{successText}</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="error-content">
          <span className="error-icon">⚠</span>
          <span>Error - Intentar de nuevo</span>
        </div>
      );
    }

    return children;
  };

  return (
    <button
      className={`
        loading-button 
        loading-button--${variant} 
        loading-button--${size}
        ${isLoading ? 'loading-button--loading' : ''}
        ${isSuccess ? 'loading-button--success' : ''}
        ${isError ? 'loading-button--error' : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {getButtonContent()}
  
      {showProgress && isLoading && (
        <div 
          className="button-progress-bar"
          style={{ width: `${progress || 0}%` }}
        />
      )}
    </button>
  );
};

export default LoadingButton;
```

### Ejemplo de Uso en Componente Real

```javascript
// components/ProductCard.js
import React from 'react';
import { useLoadingState } from '../hooks/useLoadingState';
import LoadingButton from './LoadingButton';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const favoriteState = useLoadingState();
  const cartState = useLoadingState();

  const handleAddToCart = async (e, updateProgress) => {
    updateProgress(25, 'Verificando stock...');
    await new Promise(resolve => setTimeout(resolve, 500));
  
    updateProgress(50, 'Agregando al carrito...');
    await onAddToCart(product.id);
  
    updateProgress(100, 'Agregado');
  };

  const handleToggleFavorite = async () => {
    await favoriteState.executeAsync(
      () => onToggleFavorite(product.id),
      {
        loadingMessage: 'Actualizando...',
        successMessage: product.isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos'
      }
    );
  };

  return (
    <div className={`product-card ${cartState.isLoading ? 'adding-to-cart' : ''}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
    
        {/* Botón de favorito con estado individual */}
        <button
          className={`
            favorite-button 
            ${product.isFavorite ? 'favorite-button--active' : ''}
            ${favoriteState.isLoading ? 'favorite-button--loading' : ''}
          `}
          onClick={handleToggleFavorite}
          disabled={favoriteState.isLoading}
        >
          {favoriteState.isLoading ? (
            <span className="spinner-small" />
          ) : (
            product.isFavorite ? '❤️' : '🤍'
          )}
        </button>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
    
        {/* Estado de éxito para favoritos */}
        {favoriteState.isSuccess && favoriteState.message && (
          <div className="success-message">
            {favoriteState.message}
          </div>
        )}
      </div>

      <div className="product-actions">
        <LoadingButton
          onClick={handleAddToCart}
          variant="primary"
          size="medium"
          showProgress={true}
          loadingText="Agregando..."
          successText="¡Agregado!"
          disabled={!product.inStock}
        >
          {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
        </LoadingButton>
      </div>
    </div>
  );
};

export default ProductCard;
```

---

## 📊 Estados de Carga Seccionales

### Cuándo Usar Loading Seccional

**Analogía: Pantallas Divididas en TV** Como cuando ves las noticias y cada sección se actualiza independientemente. Usalo cuando:

* Tienes múltiples secciones de datos independientes
* Quieres mostrar contenido parcial mientras otras partes cargan
* Los usuarios pueden interactuar con secciones ya cargadas

### Implementación con Hook Seccional

```javascript
// hooks/useSectionLoading.js
import { useState, useCallback, useRef } from 'react';

export const useSectionLoading = (sections = []) => {
  const [sectionStates, setSectionStates] = useState(() => {
    return sections.reduce((acc, section) => {
      acc[section] = {
        state: 'idle',
        error: null,
        progress: null,
        message: null,
        data: null
      };
      return acc;
    }, {});
  });

  const timeouts = useRef({});

  const updateSection = useCallback((sectionId, updates) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        ...updates
      }
    }));
  }, []);

  const startSectionLoading = useCallback((sectionId, message) => {
    updateSection(sectionId, {
      state: 'loading',
      error: null,
      progress: null,
      message
    });
  }, [updateSection]);

  const setSectionSuccess = useCallback((sectionId, data, message) => {
    updateSection(sectionId, {
      state: 'success',
      data,
      error: null,
      message
    });

    // Auto-hide success message after 3 seconds
    if (message) {
      clearTimeout(timeouts.current[sectionId]);
      timeouts.current[sectionId] = setTimeout(() => {
        updateSection(sectionId, { message: null });
      }, 3000);
    }
  }, [updateSection]);

  const setSectionError = useCallback((sectionId, error, message) => {
    updateSection(sectionId, {
      state: 'error',
      error,
      message: message || error.message
    });
  }, [updateSection]);

  const setSectionProgress = useCallback((sectionId, progress, message) => {
    updateSection(sectionId, {
      progress,
      message: message || `${progress}%`
    });
  }, [updateSection]);

  const refreshSection = useCallback((sectionId) => {
    updateSection(sectionId, {
      state: 'refreshing',
      error: null
    });
  }, [updateSection]);

  const executeSectionAsync = useCallback(async (
    sectionId,
    asyncFn,
    options = {}
  ) => {
    const {
      loadingMessage,
      successMessage,
      errorMessage,
      showProgress = false
    } = options;

    try {
      startSectionLoading(sectionId, loadingMessage);

      const result = await asyncFn((progress, progressMessage) => {
        if (showProgress) {
          setSectionProgress(sectionId, progress, progressMessage);
        }
      });

      setSectionSuccess(sectionId, result, successMessage);
      return result;
    } catch (error) {
      setSectionError(sectionId, error, errorMessage);
      throw error;
    }
  }, [startSectionLoading, setSectionSuccess, setSectionError, setSectionProgress]);

  // Getters para estados globales
  const isAnySectionLoading = Object.values(sectionStates)
    .some(section => section.state === 'loading' || section.state === 'refreshing');

  const getAllErrors = () => Object.entries(sectionStates)
    .filter(([, section]) => section.error)
    .map(([id, section]) => ({ id, error: section.error }));

  const getLoadedSections = () => Object.entries(sectionStates)
    .filter(([, section]) => section.state === 'success')
    .map(([id, section]) => ({ id, data: section.data }));

  const getSectionState = useCallback((sectionId) => {
    return sectionStates[sectionId] || {
      state: 'idle',
      error: null,
      progress: null,
      message: null,
      data: null
    };
  }, [sectionStates]);

  return {
    sectionStates,
    getSectionState,
    updateSection,
    startSectionLoading,
    setSectionSuccess,
    setSectionError,
    setSectionProgress,
    refreshSection,
    executeSectionAsync,
    isAnySectionLoading,
    getAllErrors,
    getLoadedSections
  };
};

// Hook especializado para dashboards
export const useDashboardSections = () => {
  const sections = ['analytics', 'sales', 'traffic', 'conversion', 'topProducts'];
  const sectionLoading = useSectionLoading(sections);

  const loadAllSections = useCallback(async (apiCalls) => {
    const promises = sections.map(async (section) => {
      if (apiCalls[section]) {
        return sectionLoading.executeSectionAsync(
          section,
          apiCalls[section],
          {
            loadingMessage: `Cargando ${section}...`,
            successMessage: `${section} actualizado`,
            showProgress: true
          }
        );
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error loading dashboard sections:', error);
    }
  }, [sectionLoading, sections]);

  const refreshAllSections = useCallback(async (apiCalls) => {
    sections.forEach(section => {
      sectionLoading.refreshSection(section);
    });
  
    await loadAllSections(apiCalls);
  }, [sectionLoading, sections, loadAllSections]);

  return {
    ...sectionLoading,
    sections,
    loadAllSections,
    refreshAllSections
  };
};
```

### Componente Dashboard con Secciones

```javascript
// components/Dashboard.js
import React, { useEffect } from 'react';
import { useDashboardSections } from '../hooks/useSectionLoading';
import SectionLoader from './SectionLoader';
import ErrorBoundary from './ErrorBoundary';

const Dashboard = () => {
  const {
    getSectionState,
    loadAllSections,
    refreshAllSections,
    isAnySectionLoading,
    getAllErrors
  } = useDashboardSections();

  // API calls para cada sección
  const apiCalls = {
    analytics: async (updateProgress) => {
      updateProgress(25, 'Conectando con analytics...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateProgress(75, 'Procesando datos...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { views: 15420, users: 3240 };
    },
  
    sales: async (updateProgress) => {
      updateProgress(30, 'Obteniendo ventas...');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress(90, 'Calculando totales...');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { total: 125400, orders: 234 };
    },
  
    traffic: async (updateProgress) => {
      updateProgress(40, 'Analizando tráfico...');
      await new Promise(resolve => setTimeout(resolve, 600));
      return { visitors: 8950, bounceRate: '23%' };
    },
  
    conversion: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { rate: '3.2%', improvement: '+0.8%' };
    },
  
    topProducts: async (updateProgress) => {
      updateProgress(20, 'Consultando productos...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateProgress(80, 'Ordenando por ventas...');
      await new Promise(resolve => setTimeout(resolve, 400));
      return [
        { name: 'iPhone 15', sales: 450 },
        { name: 'MacBook Pro', sales: 320 },
        { name: 'AirPods Pro', sales: 280 }
      ];
    }
  };

  useEffect(() => {
    loadAllSections(apiCalls);
  }, [loadAllSections]);

  const handleRefreshAll = () => {
    refreshAllSections(apiCalls);
  };

  const errors = getAllErrors();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <button
            onClick={handleRefreshAll}
            disabled={isAnySectionLoading}
            className="refresh-button"
          >
            {isAnySectionLoading ? (
              <>
                <span className="spinner-small" />
                Actualizando...
              </>
            ) : (
              <>
                🔄 Actualizar Todo
              </>
            )}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-summary">
          <h3>⚠️ Errores detectados en {errors.length} sección(es)</h3>
          <ul>
            {errors.map(({ id, error }) => (
              <li key={id}>{id}: {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Sección Analytics */}
        <ErrorBoundary fallback={<div>Error en Analytics</div>}>
          <SectionLoader
            sectionId="analytics"
            getSectionState={getSectionState}
            title="Analytics"
            icon="📊"
          >
            {(data) => (
              <div className="analytics-section">
                <div className="metric">
                  <span className="metric-value">{data.views?.toLocaleString()}</span>
                  <span className="metric-label">Views</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.users?.toLocaleString()}</span>
                  <span className="metric-label">Users</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Sales */}
        <ErrorBoundary fallback={<div>Error en Sales</div>}>
          <SectionLoader
            sectionId="sales"
            getSectionState={getSectionState}
            title="Sales"
            icon="💰"
          >
            {(data) => (
              <div className="sales-section">
                <div className="metric">
                  <span className="metric-value">${data.total?.toLocaleString()}</span>
                  <span className="metric-label">Revenue</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.orders}</span>
                  <span className="metric-label">Orders</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Traffic */}
        <ErrorBoundary fallback={<div>Error en Traffic</div>}>
          <SectionLoader
            sectionId="traffic"
            getSectionState={getSectionState}
            title="Traffic"
            icon="🚦"
          >
            {(data) => (
              <div className="traffic-section">
                <div className="metric">
                  <span className="metric-value">{data.visitors?.toLocaleString()}</span>
                  <span className="metric-label">Visitors</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{data.bounceRate}</span>
                  <span className="metric-label">Bounce Rate</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Conversion */}
        <ErrorBoundary fallback={<div>Error en Conversion</div>}>
          <SectionLoader
            sectionId="conversion"
            getSectionState={getSectionState}
            title="Conversion"
            icon="📈"
          >
            {(data) => (
              <div className="conversion-section">
                <div className="metric">
                  <span className="metric-value">{data.rate}</span>
                  <span className="metric-label">Rate</span>
                </div>
                <div className="metric improvement">
                  <span className="metric-value">{data.improvement}</span>
                  <span className="metric-label">vs Last Month</span>
                </div>
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>

        {/* Sección Top Products */}
        <ErrorBoundary fallback={<div>Error en Top Products</div>}>
          <SectionLoader
            sectionId="topProducts"
            getSectionState={getSectionState}
            title="Top Products"
            icon="🏆"
            className="top-products-section"
          >
            {(data) => (
              <div className="products-list">
                {data.map((product, index) => (
                  <div key={product.name} className="product-item">
                    <span className="product-rank">#{index + 1}</span>
                    <span className="product-name">{product.name}</span>
                    <span className="product-sales">{product.sales} sales</span>
                  </div>
                ))}
              </div>
            )}
          </SectionLoader>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;
```

### Componente Section Loader

```javascript
// components/SectionLoader.js
import React from 'react';

const SectionLoader = ({
  sectionId,
  getSectionState,
  title,
  icon,
  children,
  className = '',
  showRetry = true,
  onRetry = null
}) => {
  const sectionState = getSectionState(sectionId);
  const { state, data, error, progress, message } = sectionState;

  const handleRetry = () => {
    if (onRetry) {
      onRetry(sectionId);
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="section-loading">
            <div className="loading-spinner" />
            <div className="loading-info">
              <p>{message || 'Cargando...'}</p>
              {progress !== null && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'refreshing':
        return (
          <div className="section-refreshing">
            <div className="refreshing-overlay">
              <span className="spinner-small" />
              <span>Actualizando...</span>
            </div>
            {data && children(data)}
          </div>
        );

      case 'success':
        return (
          <div className="section-success">
            {message && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <span>{message}</span>
              </div>
            )}
            {data && children(data)}
          </div>
        );

      case 'error':
        return (
          <div className="section-error">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <h4>Error al cargar {title}</h4>
              <p>{message || 'Ocurrió un error inesperado'}</p>
              {showRetry && (
                <button onClick={handleRetry} className="retry-button">
                  Reintentar
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="section-idle">
            <p>Listo para cargar {title}</p>
          </div>
        );
    }
  };

  return (
    <div className={`section-container ${className}`}>
      <div className="section-header">
        <div className="section-title">
          <span className="section-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <div className="section-status">
          {state === 'loading' && <span className="status-indicator loading" />}
          {state === 'success' && <span className="status-indicator success" />}
          {state === 'error' && <span className="status-indicator error" />}
          {state === 'refreshing' && <span className="status-indicator refreshing" />}
        </div>
      </div>
      <div className="section-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SectionLoader;
```

---

## 🎨 Patrones de UX Avanzados

### 1. Skeleton Loading Inteligente

**Analogía: Radiografías vs Fotografías** Los skeletons son como radiografías: muestran la estructura antes de que llegue la "imagen completa".

```javascript
// components/SmartSkeleton.js
import React from 'react';

const SmartSkeleton = ({
  type = 'card',
  count = 1,
  animated = true,
  aspectRatio = null,
  customShape = null
}) => {
  const getSkeletonShape = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image" style={{ aspectRatio: aspectRatio || '16/9' }} />
            <div className="skeleton-content">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
              <div className="skeleton-text" />
              <div className="skeleton-actions">
                <div className="skeleton-button" />
                <div className="skeleton-button secondary" />
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-avatar" />
            <div className="skeleton-list-content">
              <div className="skeleton-title" />
              <div className="skeleton-subtitle" />
            </div>
            <div className="skeleton-action" />
          </div>
        );

      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-th" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-table-row">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="skeleton-td" />
                ))}
              </div>
            ))}
          </div>
        );

      case 'dashboard':
        return (
          <div className="skeleton-dashboard">
            <div className="skeleton-header">
              <div className="skeleton-title large" />
              <div className="skeleton-button" />
            </div>
            <div className="skeleton-metrics">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-metric-card">
                  <div className="skeleton-metric-value" />
                  <div className="skeleton-metric-label" />
                </div>
              ))}
            </div>
            <div className="skeleton-chart" />
          </div>
        );

      case 'custom':
        return customShape;

      default:
        return (
          <div className="skeleton-default">
            <div className="skeleton-title" />
            <div className="skeleton-text" />
            <div className="skeleton-text short" />
          </div>
        );
    }
  };

  return (
    <div className={`skeleton-container ${animated ? 'skeleton-animated' : ''}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          {getSkeletonShape()}
        </div>
      ))}
    </div>
  );
};

export default SmartSkeleton;

// Hook para detectar cuándo mostrar skeleton
export const useSkeletonStrategy = (query, options = {}) => {
  const {
    showSkeletonThreshold = 300, // ms antes de mostrar skeleton
    minSkeletonTime = 500, // tiempo mínimo de skeleton
    preserveLayoutShift = true
  } = options;

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [skeletonStartTime, setSkeletonStartTime] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (query.isLoading && !query.data) {
      // Espera antes de mostrar skeleton para loads rápidos
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(true);
        setSkeletonStartTime(Date.now());
      }, showSkeletonThreshold);
    } else if (query.data && showSkeleton) {
      // Asegura tiempo mínimo de skeleton para evitar flashes
      const elapsed = Date.now() - (skeletonStartTime || 0);
      const remainingTime = Math.max(0, minSkeletonTime - elapsed);

      setTimeout(() => {
        setShowSkeleton(false);
        setSkeletonStartTime(null);
      }, remainingTime);
    } else {
      clearTimeout(timeoutRef.current);
      setShowSkeleton(false);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [query.isLoading, query.data, showSkeleton, skeletonStartTime, showSkeletonThreshold, minSkeletonTime]);

  return {
    showSkeleton: showSkeleton && query.isLoading,
    showContent: query.data && !showSkeleton,
    showStaleContent: query.isFetching && query.data && !showSkeleton,
    preserveLayout: preserveLayoutShift && (showSkeleton || query.data)
  };
};
```

### 2. Progressive Loading Pattern

```javascript
// hooks/useProgressiveLoading.js
import { useState, useEffect, useCallback } from 'react';

export const useProgressiveLoading = (loadingSteps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepData, setStepData] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  const executeStep = useCallback(async (stepIndex) => {
    const step = loadingSteps[stepIndex];
    if (!step) return;

    try {
      setCurrentStep(stepIndex);
      setError(null);
  
      const result = await step.execute();
  
      setStepData(prev => ({
        ...prev,
        [step.id]: result
      }));
  
      setCompletedSteps(prev => [...prev, stepIndex]);
  
      // Si hay más pasos, continúa automáticamente
      if (stepIndex < loadingSteps.length - 1) {
        setTimeout(() => {
          executeStep(stepIndex + 1);
        }, step.delay || 0);
      } else {
        setIsComplete(true);
      }
    } catch (err) {
      setError({ step: stepIndex, error: err });
    }
  }, [loadingSteps]);

  const start = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setStepData({});
    setIsComplete(false);
    setError(null);
    executeStep(0);
  }, [executeStep]);

  const retry = useCallback(() => {
    if (error) {
      executeStep(error.step);
    }
  }, [error, executeStep]);

  const getCurrentStepInfo = () => {
    return loadingSteps[currentStep] || null;
  };

  const getProgress = () => {
    return ((completedSteps.length) / loadingSteps.length) * 100;
  };

  return {
    currentStep,
    completedSteps,
    stepData,
    isComplete,
    error,
    start,
    retry,
    getCurrentStepInfo,
    getProgress,
    totalSteps: loadingSteps.length
  };
};

// Componente Progressive Loader
const ProgressiveLoader = ({ steps, onComplete, children }) => {
  const {
    currentStep,
    completedSteps,
    stepData,
    isComplete,
    error,
    start,
    retry,
    getCurrentStepInfo,
    getProgress
  } = useProgressiveLoading(steps);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete(stepData);
    }
  }, [isComplete, stepData, onComplete]);

  const currentStepInfo = getCurrentStepInfo();
  const progress = getProgress();

  if (isComplete) {
    return children(stepData);
  }

  return (
    <div className="progressive-loader">
      <div className="loader-header">
        <h3>Cargando aplicación...</h3>
        <div className="progress-info">
          {completedSteps.length} / {steps.length} completado
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>

      <div className="steps-list">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`
              step-item
              ${completedSteps.includes(index) ? 'step-completed' : ''}
              ${currentStep === index ? 'step-active' : ''}
              ${error?.step === index ? 'step-error' : ''}
            `}
          >
            <div className="step-indicator">
              {completedSteps.includes(index) ? (
                <span className="step-check">✓</span>
              ) : currentStep === index ? (
                <span className="step-spinner" />
              ) : error?.step === index ? (
                <span className="step-error-icon">⚠</span>
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="error-container">
          <p>Error en el paso: {steps[error.step]?.title}</p>
          <p>{error.error.message}</p>
          <button onClick={retry} className="retry-button">
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

// Ejemplo de uso para inicialización de app
const AppInitializer = ({ children }) => {
  const initSteps = [
    {
      id: 'auth',
      title: 'Verificando autenticación',
      description: 'Validando credenciales de usuario...',
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { user: { id: 1, name: 'Juan' } };
      }
    },
    {
      id: 'config',
      title: 'Cargando configuración',
      description: 'Obteniendo configuraciones de la aplicación...',
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { theme: 'dark', language: 'es' };
      }
    },
    {
      id: 'permissions',
      title: 'Verificando permisos',
      description: 'Cargando permisos de usuario...',
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { canEdit: true, canDelete: false };
      }
    },
    {
      id: 'data',
      title: 'Precargando datos',
      description: 'Cargando datos iniciales de la aplicación...',
      delay: 200,
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return { initialData: 'loaded' };
      }
    }
  ];

  return (
    <ProgressiveLoader steps={initSteps}>
      {(data) => children(data)}
    </ProgressiveLoader>
  );
};
```

### 3. Smart Refresh Pattern

```javascript
// hooks/useSmartRefresh.js
import { useState, useCallback, useRef, useEffect } from 'react';

export const useSmartRefresh = (refreshFn, options = {}) => {
  const {
    cooldownTime = 2000, // 2 segundos entre refreshes
    autoRefreshInterval = null,
    onlineOnly = true,
    showSuccessMessage = true,
    successDuration = 2000
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const cooldownTimer = useRef(null);
  const successTimer = useRef(null);
  const autoRefreshTimer = useRef(null);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto refresh
  useEffect(() => {
    if (autoRefreshInterval && isOnline) {
      autoRefreshTimer.current = setInterval(() => {
        refresh(true); // Silent refresh
      }, autoRefreshInterval);
    }

    return () => {
      if (autoRefreshTimer.current) {
        clearInterval(autoRefreshTimer.current);
      }
    };
  }, [autoRefreshInterval, isOnline]);

  const refresh = useCallback(async (silent = false) => {
    // Verificaciones previas
    if (isRefreshing) return;
    if (!canRefresh && !silent) return;
    if (onlineOnly && !isOnline) return;

    try {
      if (!silent) {
        setIsRefreshing(true);
        setCanRefresh(false);
      }

      await refreshFn();

      setLastRefresh(new Date());

      if (showSuccessMessage && !silent) {
        setShowSuccess(true);
        successTimer.current = setTimeout(() => {
          setShowSuccess(false);
        }, successDuration);
      }

      // Cooldown
      cooldownTimer.current = setTimeout(() => {
        setCanRefresh(true);
      }, cooldownTime);

    } catch (error) {
      console.error('Error during refresh:', error);
      throw error;
    } finally {
      if (!silent) {
        setIsRefreshing(false);
      }
    }
  }, [refreshFn, cooldownTime, onlineOnly, isOnline, showSuccessMessage, successDuration, isRefreshing, canRefresh]);

  const forceRefresh = useCallback(async () => {
    // Fuerza refresh ignorando cooldown
    setCanRefresh(true);
    await refresh();
  }, [refresh]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (successTimer.current) clearTimeout(successTimer.current);
      if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
    };
  }, []);

  const getTimeSinceLastRefresh = () => {
    if (!lastRefresh) return null;
    return Date.now() - lastRefresh.getTime();
  };

  return {
    isRefreshing,
    canRefresh: canRefresh && isOnline,
    showSuccess,
    lastRefresh,
    isOnline,
    refresh,
    forceRefresh,
    getTimeSinceLastRefresh
  };
};

// Componente Pull to Refresh
const PullToRefresh = ({ onRefresh, children, threshold = 80 }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
  const {
    isRefreshing,
    canRefresh,
    showSuccess,
    refresh
  } = useSmartRefresh(onRefresh, {
    showSuccessMessage: true,
    cooldownTime: 3000
  });

  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    if (containerRef.current?.scrollTop === 0 && canRefresh) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
  
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
      setShouldRefresh(distance >= threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);
  
    if (shouldRefresh && !isRefreshing) {
      await refresh();
    }
  
    setPullDistance(0);
    setShouldRefresh(false);
  };

  const pullPercentage = Math.min((pullDistance / threshold) * 100, 100);

  return (
    <div 
      ref={containerRef}
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="pull-indicator"
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          opacity: pullDistance > 10 ? 1 : 0
        }}
      >
        <div className="pull-spinner-container">
          <div 
            className={`
              pull-spinner 
              ${isRefreshing ? 'spinning' : ''}
              ${shouldRefresh ? 'ready' : ''}
            `}
            style={{
              transform: `rotate(${pullPercentage * 3.6}deg)`
            }}
          >
            {isRefreshing ? '⟳' : shouldRefresh ? '↓' : '↓'}
          </div>
        </div>
        <div className="pull-text">
          {isRefreshing 
            ? 'Actualizando...' 
            : shouldRefresh 
              ? 'Suelta para actualizar'
              : 'Tira para actualizar'
          }
        </div>
      </div>

      {showSuccess && (
        <div className="refresh-success-message">
          ✓ Actualizado exitosamente
        </div>
      )}

      <div 
        className="content"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance * 0.5, 40) : 0}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

---

## 🎪 Casos de Uso del Mundo Real

### 1. E-commerce: Carrito de Compras con Estados Complejos

```javascript
// components/ShoppingCart.js
import React from 'react';
import { useLoadingState } from '../hooks/useLoadingState';

const ShoppingCartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const updateState = useLoadingState();
  const removeState = useLoadingState();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === 0) {
      await removeState.executeAsync(
        () => onRemove(item.id),
        {
          loadingMessage: 'Eliminando...',
          successMessage: 'Producto eliminado'
        }
      );
    } else {
      await updateState.executeAsync(
        () => onUpdateQuantity(item.id, newQuantity),
        {
          loadingMessage: 'Actualizando...',
          successMessage: null // Sin mensaje para cambios de cantidad
        }
      );
    }
  };

  const isDisabled = updateState.isLoading || removeState.isLoading;

  return (
    <div className={`cart-item ${isDisabled ? 'cart-item--updating' : ''}`}>
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>
  
      <div className="item-details">
        <h4>{item.name}</h4>
        <p>${item.price}</p>
  
        {updateState.isSuccess && updateState.message && (
          <div className="success-message">{updateState.message}</div>
        )}
      </div>
  
      <div className="item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isDisabled || item.quantity <= 1}
            className="quantity-btn"
          >
            -
          </button>
    
          <span className="quantity-display">
            {updateState.isLoading ? (
              <span className="spinner-small"
```
