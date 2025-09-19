---
title: 'Master Class: Masked Views en React Native'
code: 'react-native'
description: 'Masked Views en React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Master Class: Masked Views en React Native 🎭

## 🎯 Introducción: ¿Qué son las Masked Views?

Imagina que tienes una plantilla de stencil para pintar. La MaskedView es exactamente eso: un "stencil digital" que permite mostrar contenido solo a través de las formas definidas por una máscara.

**Analogía del Teatro:**
- **Máscara (maskElement)**: El telón con recortes que define qué se puede ver
- **Contenido**: Los actores detrás del telón
- **Resultado**: Solo vemos a los actores a través de los recortes del telón

**¿Por qué usar MaskedView?**
- **Efectos visuales únicos**: Crear interfaces impactantes
- **Branding**: Mostrar contenido a través de logos o formas
- **UX mejorada**: Revelar contenido de forma creativa
- **Gradientes con formas**: Combinar colores con formas personalizadas

## 🛠️ Instalación y Configuración

### Instalación
```bash
npm install @react-native-masked-view/masked-view
# o
yarn add @react-native-masked-view/masked-view

# Para iOS (si usas React Native 0.60+)
cd ios && pod install

# Para versiones anteriores
react-native link @react-native-masked-view/masked-view
```

### Configuración Android (Gradle)
```gradle
// android/app/build.gradle
android {
    ...
    compileSdkVersion 28 // o superior
}
```

### Configuración iOS (Podfile)
```ruby
# ios/Podfile
target 'YourApp' do
  pod 'RNCMaskedView', :path => '../node_modules/@react-native-masked-view/masked-view'
end
```

## 🏗️ Conceptos Fundamentales

### 1. Estructura Básica
```javascript
import MaskedView from '@react-native-masked-view/masked-view';

<MaskedView
  style={{ flex: 1 }}
  maskElement={
    // La MÁSCARA - define QUÉ se ve
    <View>
      <Text>Solo esto se verá</Text>
    </View>
  }
>
  {/* El CONTENIDO - lo que se muestra a través de la máscara */}
  <View>
    <Text>Contenido detrás de la máscara</Text>
  </View>
</MaskedView>
```

### 2. Principio de Funcionamiento
```
┌─────────────────┐
│   maskElement   │ ← Define las "ventanas" transparentes
├─────────────────┤
│    Contenido    │ ← Solo se ve donde la máscara es opaca
└─────────────────┘
```

**Regla de Oro**: La máscara funciona como un filtro. Solo el contenido que está "detrás" de las partes opacas de la máscara será visible.

## 🎨 Patrones de Uso Básicos

### 1. Texto como Máscara
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = ({ children }) => (
  <MaskedView
    style={styles.maskedContainer}
    maskElement={
      <Text style={styles.maskText}>
        {children}
      </Text>
    }
  >
    <LinearGradient
      colors={['#FF6B6B', '#4ECDC4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientFill}
    />
  </MaskedView>
);

const styles = StyleSheet.create({
  maskedContainer: {
    height: 60,
    justifyContent: 'center',
  },
  maskText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black', // Color no importa, solo la opacidad
  },
  gradientFill: {
    flex: 1,
  },
});
```

### 2. Imagen como Máscara
```javascript
const LogoMask = ({ children }) => (
  <MaskedView
    style={styles.logoContainer}
    maskElement={
      <Image
        source={require('./assets/logo.png')}
        style={styles.logoMask}
        resizeMode="contain"
      />
    }
  >
    {children}
  </MaskedView>
);

const styles = StyleSheet.create({
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoMask: {
    width: 200,
    height: 200,
  },
});
```

### 3. Formas Geométricas como Máscaras
```javascript
const CircleMask = ({ children, size = 100 }) => (
  <MaskedView
    style={[styles.circleMaskContainer, { width: size, height: size }]}
    maskElement={
      <View
        style={[
          styles.circleMask,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    }
  >
    {children}
  </MaskedView>
);

const styles = StyleSheet.create({
  circleMaskContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleMask: {
    backgroundColor: 'black', // La opacidad define la máscara
  },
});
```

## 🎭 Casos de Uso Avanzados

### 1. Sistema de Revelación Progresiva
```javascript
import React, { useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const ProgressiveReveal = ({ children, progress = 0 }) => {
  const [animatedProgress] = useState(new Animated.Value(progress));
  
  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [progress]);
  
  return (
    <MaskedView
      style={styles.revealContainer}
      maskElement={
        <Animated.View
          style={[
            styles.revealMask,
            {
              width: animatedProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      }
    >
      {children}
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  revealContainer: {
    width: '100%',
    height: 50,
  },
  revealMask: {
    height: '100%',
    backgroundColor: 'black',
  },
});

// Uso
const App = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(1), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ProgressiveReveal progress={progress}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={{ flex: 1 }}
      />
    </ProgressiveReveal>
  );
};
```

### 2. Múltiples Máscaras Combinadas
```javascript
const MultiMask = ({ children }) => (
  <MaskedView
    style={styles.multiMaskContainer}
    maskElement={
      <View style={styles.multiMaskWrapper}>
        {/* Primera máscara: Texto */}
        <Text style={styles.titleMask}>TÍTULO</Text>
        
        {/* Segunda máscara: Formas */}
        <View style={styles.shapeRow}>
          <View style={styles.circleMask} />
          <View style={styles.squareMask} />
          <View style={styles.triangleMask} />
        </View>
        
        {/* Tercera máscara: Texto más pequeño */}
        <Text style={styles.subtitleMask}>Subtítulo aquí</Text>
      </View>
    }
  >
    {children}
  </MaskedView>
);

const styles = StyleSheet.create({
  multiMaskContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
  },
  multiMaskWrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  titleMask: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  shapeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  circleMask: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'black',
  },
  squareMask: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
  },
  triangleMask: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
  },
  subtitleMask: {
    fontSize: 18,
    color: 'black',
  },
});
```

### 3. Máscara Animada con Ondas
```javascript
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const WaveMask = ({ children }) => {
  const waveAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  
  useEffect(() => {
    const startWaveAnimation = () => {
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    };
    
    startWaveAnimation();
  }, []);
  
  return (
    <MaskedView
      style={styles.waveContainer}
      maskElement={
        <Animated.View
          style={[
            styles.waveMask,
            {
              transform: [
                {
                  translateX: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width, width],
                  }),
                },
              ],
            },
          ]}
        >
          {/* SVG o forma de onda personalizada */}
          <View style={styles.waveShape} />
        </Animated.View>
      }
    >
      {children}
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  waveContainer: {
    width: '100%',
    height: 200,
  },
  waveMask: {
    width: '200%',
    height: '100%',
    justifyContent: 'center',
  },
  waveShape: {
    width: '100%',
    height: 100,
    backgroundColor: 'black',
    borderRadius: 50,
  },
});
```

## 🎨 Biblioteca de Componentes Reutilizables

### 1. GradientText Component
```javascript
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

export const GradientText = ({
  children,
  colors = ['#FF6B6B', '#4ECDC4'],
  style,
  textStyle,
  gradientProps = {},
}) => (
  <MaskedView
    style={[styles.container, style]}
    maskElement={
      <Text style={[styles.maskText, textStyle]}>
        {children}
      </Text>
    }
  >
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
      {...gradientProps}
    />
  </MaskedView>
);

const styles = StyleSheet.create({
  container: {
    height: 'auto',
  },
  maskText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  gradient: {
    flex: 1,
  },
});
```

### 2. ShapeMask Component
```javascript
export const ShapeMask = ({
  children,
  shape = 'circle',
  size = 100,
  style,
}) => {
  const getShapeStyle = () => {
    switch (shape) {
      case 'circle':
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
      case 'square':
        return {
          width: size,
          height: size,
        };
      case 'diamond':
        return {
          width: size,
          height: size,
          transform: [{ rotate: '45deg' }],
        };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'black',
        };
      default:
        return { width: size, height: size };
    }
  };
  
  return (
    <MaskedView
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      maskElement={
        <View
          style={[
            { backgroundColor: shape !== 'triangle' ? 'black' : 'transparent' },
            getShapeStyle(),
          ]}
        />
      }
    >
      {children}
    </MaskedView>
  );
};
```

### 3. AnimatedMask Component
```javascript
import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const AnimatedMask = ({
  children,
  animationType = 'slideRight',
  duration = 1000,
  delay = 0,
  style,
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(animation, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }, delay);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'slideRight':
        return {
          width: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        };
      case 'slideLeft':
        return {
          width: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          alignSelf: 'flex-end',
        };
      case 'slideUp':
        return {
          height: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
          alignSelf: 'flex-end',
        };
      case 'fade':
        return {
          opacity: animation,
        };
      case 'scale':
        return {
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };
  
  return (
    <MaskedView
      style={[{ flex: 1 }, style]}
      maskElement={
        <Animated.View
          style={[
            {
              flex: 1,
              backgroundColor: 'black',
            },
            getAnimatedStyle(),
          ]}
        />
      }
    >
      {children}
    </MaskedView>
  );
};
```

## 🎪 Efectos Especiales y Trucos Avanzados

### 1. Efecto de Escritura Máquina
```javascript
const TypewriterMask = ({ text, speed = 50 }) => {
  const [visibleText, setVisibleText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setVisibleText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return (
    <MaskedView
      style={styles.typewriterContainer}
      maskElement={
        <Text style={styles.typewriterMask}>
          {visibleText}
          <Text style={styles.cursor}>|</Text>
        </Text>
      }
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientFill}
      />
    </MaskedView>
  );
};
```

### 2. Máscara de Partículas
```javascript
const ParticleMask = ({ children, particleCount = 20 }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
  }));
  
  return (
    <MaskedView
      style={styles.particleContainer}
      maskElement={
        <View style={styles.particleWrapper}>
          {particles.map((particle) => (
            <View
              key={particle.id}
              style={[
                styles.particle,
                {
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  borderRadius: particle.size / 2,
                },
              ]}
            />
          ))}
        </View>
      }
    >
      {children}
    </MaskedView>
  );
};
```

### 3. Máscara con Bordes Difusos (Usando sombras)
```javascript
const BlurredMask = ({ children, blurRadius = 10 }) => (
  <MaskedView
    style={styles.blurredContainer}
    maskElement={
      <View
        style={[
          styles.blurredMask,
          {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: blurRadius,
            elevation: blurRadius,
          },
        ]}
      />
    }
  >
    {children}
  </MaskedView>
);
```

## 🎮 Interactividad con MaskedView

### 1. Máscara Controlada por Gestos
```javascript
import { PanGestureHandler } from 'react-native-gesture-handler';

const GestureMask = ({ children }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.translateX + event.translationX;
      translateY.value = context.translateY + event.translationY;
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));
  
  return (
    <MaskedView
      style={styles.gestureContainer}
      maskElement={
        <PanGestureHandler onGestureEvent={panGesture}>
          <Animated.View style={[styles.gestureMask, animatedStyle]} />
        </PanGestureHandler>
      }
    >
      {children}
    </MaskedView>
  );
};
```

### 2. Máscara Responsiva al Touch
```javascript
const TouchMask = ({ children }) => {
  const [maskPosition, setMaskPosition] = useState({ x: 50, y: 50 });
  const [maskSize, setMaskSize] = useState(100);
  
  const handleTouch = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setMaskPosition({ x: locationX, y: locationY });
  };
  
  const handlePressIn = () => {
    setMaskSize(150);
  };
  
  const handlePressOut = () => {
    setMaskSize(100);
  };
  
  return (
    <View
      style={styles.touchContainer}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <MaskedView
        style={styles.touchMaskedView}
        maskElement={
          <View
            style={[
              styles.touchMask,
              {
                left: maskPosition.x - maskSize / 2,
                top: maskPosition.y - maskSize / 2,
                width: maskSize,
                height: maskSize,
                borderRadius: maskSize / 2,
              },
            ]}
          />
        }
      >
        {children}
      </MaskedView>
    </View>
  );
};
```

## 🎨 Integración con Otras Librerías

### 1. Con React Native SVG
```javascript
import Svg, { Path, Circle } from 'react-native-svg';

const SVGMask = ({ children }) => (
  <MaskedView
    style={styles.svgContainer}
    maskElement={
      <Svg width="200" height="200" viewBox="0 0 200 200">
        {/* Corazón SVG */}
        <Path
          d="M100,180 C60,140 20,100 20,60 C20,20 50,20 100,60 C150,20 180,20 180,60 C180,100 140,140 100,180 Z"
          fill="black"
        />
        {/* Círculos decorativos */}
        <Circle cx="50" cy="50" r="10" fill="black" />
        <Circle cx="150" cy="50" r="10" fill="black" />
      </Svg>
    }
  >
    {children}
  </MaskedView>
);
```

### 2. Con Lottie Animations
```javascript
import LottieView from 'lottie-react-native';

const LottieMask = ({ children, animationSource }) => (
  <MaskedView
    style={styles.lottieContainer}
    maskElement={
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={styles.lottieAnimation}
        colorFilters={[
          {
            keypath: '*', // Aplicar a todos los elementos
            color: 'black', // Convertir a negro para la máscara
          },
        ]}
      />
    }
  >
    {children}
  </MaskedView>
);
```

### 3. Con React Native Reanimated
```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const ReanimatedMask = ({ children }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, []);
  
  const animatedMaskStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));
  
  return (
    <MaskedView
      style={styles.reanimatedContainer}
      maskElement={
        <Animated.View style={[styles.reanimatedMask, animatedMaskStyle]} />
      }
    >
      {children}
    </MaskedView>
  );
};
```

## 🚨 Troubleshooting y Mejores Prácticas

### Problemas Comunes y Soluciones

### 1. Máscara no se muestra en Android
**Problema**: La máscara aparece transparente en Android

**Solución**:
```javascript
// ❌ Problemático en Android
maskElement={
  <Text style={{ color: 'white' }}>Texto</Text>
}

// ✅ Correcto para Android
maskElement={
  <Text style={{ color: 'black', opacity: 1 }}>Texto</Text>
}
```

### 2. Performance Issues
**Problema**: Lag en animaciones con máscaras complejas

**Solución**:
```javascript
// ✅ Optimizar con shouldRasterizeIOS
<MaskedView
  style={styles.container}
  maskElement={maskElement}
  shouldRasterizeIOS={true} // Mejora performance en iOS
>
  {children}
</MaskedView>

// ✅ Usar useNativeDriver cuando sea posible
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
}), [], true); // useNativeDriver: true
```

### 3. Máscaras que no se alinean correctamente
**Problema**: El contenido no se alinea con la máscara

**Solución**:
```javascript
// ✅ Asegurar mismas dimensiones
<MaskedView
  style={{ width: 200, height: 100 }} // Contenedor
  maskElement={
    <View style={{ width: 200, height: 100 }}> {/* Mismo tamaño */}
      <Text>Máscara</Text>
    </View>
  }
>
  <View style={{ width: 200, height: 100 }}> {/* Mismo tamaño */}
    <Text>Contenido</Text>
  </View>
</MaskedView>
```

### Mejores Prácticas

### 1. Estructura de Componente Óptima
```javascript
// ✅ Estructura recomendada
const OptimizedMask = React.memo(({ children, maskElement, style }) => (
  <MaskedView
    style={[styles.defaultContainer, style]}
    maskElement={React.cloneElement(maskElement, {
      // Asegurar propiedades necesarias para la máscara
      style: [
        { backgroundColor: 'transparent' },
        maskElement.props.style,
      ],
    })}
  >
    {children}
  </MaskedView>
));
```

### 2. Testing de Máscaras
```javascript
// __tests__/MaskedView.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import { GradientText } from '../components/GradientText';

describe('GradientText', () => {
  it('should render mask element correctly', () => {
    const { getByText } = render(
      <GradientText>Test Text</GradientText>
    );
    
    expect(getByText('Test Text')).toBeTruthy();
  });
  
  it('should apply custom styles', () => {
    const customStyle = { fontSize: 32 };
    const { getByText } = render(
      <GradientText textStyle={customStyle}>
        Test Text
      </GradientText>
    );
    
    const textElement = getByText('Test Text');
    expect(textElement.props.style).toMatchObject(customStyle);
  });
});
```

### 3. Accessibility
```javascript
// ✅ Hacer máscaras accesibles
const AccessibleMask = ({ children, maskText, accessibilityLabel }) => (
  <MaskedView
    style={styles.container}
    accessible={true}
    accessibilityLabel={accessibilityLabel || maskText}
    maskElement={
      <Text 
        style={styles.mask}
        accessible={false} // Evitar doble lectura
      >
        {maskText}
      </Text>
    }
  >
    {children}
  </MaskedView>
);
```

## 🎨 Proyecto Final: Sistema de Masked Components

Vamos a crear un sistema completo de componentes con máscaras:

```javascript
// components/MaskSystem.js
import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

// Contexto para configuración global
const MaskContext = createContext({
  defaultColors: ['#FF6B6B', '#4ECDC4'],
  defaultAnimationDuration: 1000,
});

export const MaskProvider = ({ children, value }) => (
  <MaskContext.Provider value={value}>
    {children}
  </MaskContext.Provider>
);

export const useMask = () => useContext(MaskContext);

// Sistema de componentes base
export class MaskFactory {
  static createGradientText = ({
    text,
    colors,
    style,
    textStyle,
    animated = false,
    animationDuration = 1000,
  }) => {
    const GradientTextComponent = () => {
      const maskContext = useMask();
      const finalColors = colors || maskContext.defaultColors;
      const [animationValue] = useState(new Animated.Value(0));
      
      React.useEffect(() => {
        if (animated) {
          Animated.timing(animationValue, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: false,
          }).start();
        }
      }, [animated]);
      
      const animatedStyle = animated ? {
        opacity: animationValue,
        transform: [{
          scale: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        }],
      } : {};
      
      return (
        <Animated.View style={animatedStyle}>
          <MaskedView
            style={[styles.gradientTextContainer, style]}
            maskElement={
              <Text style={[styles.gradientTextMask, textStyle]}>
                {text}
              </Text>
            }
          >
            <LinearGradient
              colors={finalColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientFill}
            />
          </MaskedView>
        </Animated.View>
      );
    };
    
    return GradientTextComponent;
  };
  
  static createShapeMask = ({
    shape,
    size,
    colors,
    animated = false,
  }) => {
    const ShapeMaskComponent = ({ children }) => {
      const maskContext = useMask();
      const finalColors = colors || maskContext.defaultColors;
      const [rotationValue] = useState(new Animated.Value(0));
      
      React.useEffect(() => {
        if (animated) {
          Animated.loop(
            Animated.timing(rotationValue, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            })
          ).start();
        }
      }, [animated]);
      
      const getShapeElement = () => {
        const baseStyle = {
          backgroundColor: 'black',
          width: size,
          height: size,
        };
        
        switch (shape) {
          case 'circle':
            return <View style={[baseStyle, { borderRadius: size / 2 }]} />;
          case 'square':
            return <View style={baseStyle} />;
          case 'diamond':
            return (
              <View
                style={[
                  baseStyle,
                  { transform: [{ rotate: '45deg' }] },
                ]}
              />
            );
          default:
            return <View style={baseStyle} />;
        }
      };
      
      const animatedMaskStyle = animated ? {
        transform: [{
          rotate: rotationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        }],
      } : {};
      
      return (
        <MaskedView
          style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          maskElement={
            <Animated.View style={animatedMaskStyle}>
              {getShapeElement()}
            </Animated.View>
          }
        >
          {children || (
            <LinearGradient
              colors={finalColors}
              style={{ flex: 1 }}
            />
          )}
        </MaskedView>
      );
    };
    
    return ShapeMaskComponent;
  };
}

// Componente de demostración completa
export const MaskShowcase = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  
  const demos = [
    {
      title: 'Gradient Text',
      component: () => {
        const GradientText = MaskFactory.createGradientText({
          text: 'AMAZING!',
          colors: ['#667eea', '#764ba2'],
          animated: true,
          textStyle: { fontSize: 48, fontWeight: 'bold' },
        });
        return <GradientText />;
      },
    },
    {
      title: 'Animated Shape',
      component: () => {
        const AnimatedCircle = MaskFactory.createShapeMask({
          shape: 'circle',
          size: 150,
          colors: ['#f093fb', '#f5576c'],
          animated: true,
        });
        return <AnimatedCircle />;
      },
    },
    {
      title: 'Complex Composition',
      component: () => (
        <View style={styles.compositionContainer}>
          <MaskedView
            style={styles.compositionMask}
            maskElement={
              <View style={styles.complexMaskLayout}>
                <Text style={styles.complexTitle}>CREATIVE</Text>
                <View style={styles.shapesRow}>
                  <View style={styles.miniCircle} />
                  <View style={styles.miniSquare} />
                  <View style={styles.miniDiamond} />
                </View>
                <Text style={styles.complexSubtitle}>DESIGN</Text>
              </View>
            }
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientFill}
            />
          </MaskedView>
        </View>
      ),
    },
  ];
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demos.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.demoTitle}>{demos[currentDemo].title}</Text>
      {demos[currentDemo].component()}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientTextContainer: {
    height: 60,
    justifyContent: 'center',
  },
  gradientTextMask: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  gradientFill: {
    flex: 1,
  },
  compositionContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compositionMask: {
    width: '100%',
    height: '100%',
  },
  complexMaskLayout: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  complexTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  shapesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  miniCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'black',
  },
  miniSquare: {
    width: 30,
    height: 30,
    backgroundColor: 'black',
  },
  miniDiamond: {
    width: 30,
    height: 30,
    backgroundColor: 'black',
    transform: [{ rotate: '45deg' }],
  },
  complexSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  showcaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
  },
});
```

## 🎨 Casos de Uso del Mundo Real

### 1. Loading Screen Animado
```javascript
const LoadingMask = ({ isLoading, children }) => {
  const [progress] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(0.8));
  
  React.useEffect(() => {
    if (isLoading) {
      // Animación de progreso
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
      
      // Animación de logo
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading]);
  
  if (!isLoading) return children;
  
  return (
    <View style={styles.loadingContainer}>
      <MaskedView
        style={styles.loadingMask}
        maskElement={
          <View style={styles.loadingMaskLayout}>
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }] }
              ]}
            >
              <Text style={styles.logoText}>LOGO</Text>
            </Animated.View>
            
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        }
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientFill}
        />
      </MaskedView>
    </View>
  );
};
```

### 2. Revelación de Contenido con Scroll
```javascript
import { useScrollHandler } from 'react-native-reanimated';

const ScrollRevealMask = ({ children, scrollY }) => {
  const maskHeight = useSharedValue(0);
  
  const scrollHandler = useScrollHandler({
    onScroll: (event) => {
      const scrollProgress = event.contentOffset.y / 500; // 500px para completar
      maskHeight.value = Math.min(Math.max(scrollProgress, 0), 1);
    },
  });
  
  const animatedMaskStyle = useAnimatedStyle(() => ({
    height: `${maskHeight.value * 100}%`,
  }));
  
  return (
    <MaskedView
      style={styles.scrollRevealContainer}
      maskElement={
        <Animated.View
          style={[styles.scrollRevealMask, animatedMaskStyle]}
        />
      }
    >
      {children}
    </MaskedView>
  );
};
```

### 3. Sistema de Onboarding con Máscaras
```javascript
const OnboardingMask = ({ step, totalSteps, children }) => {
  const [currentMask, setCurrentMask] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (step !== currentMask) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentMask(step);
      });
    }
  }, [step]);
  
  const getMaskForStep = () => {
    const masks = [
      // Paso 1: Círculo pequeño
      <View style={[styles.onboardingMask, { width: 100, height: 100, borderRadius: 50 }]} />,
      // Paso 2: Rectángulo
      <View style={[styles.onboardingMask, { width: 200, height: 150 }]} />,
      // Paso 3: Forma compleja
      <View style={styles.complexOnboardingMask}>
        <Text style={styles.onboardingText}>¡Listo!</Text>
      </View>,
    ];
    
    return masks[currentMask] || masks[0];
  };
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <MaskedView
        style={styles.onboardingContainer}
        maskElement={getMaskForStep()}
      >
        {children}
      </MaskedView>
    </Animated.View>
  );
};
```

## 🎯 Performance y Optimización

### 1. Memoización de Máscaras Complejas
```javascript
const OptimizedComplexMask = React.memo(({ 
  text, 
  shapes, 
  colors 
}) => {
  const memoizedMask = React.useMemo(() => (
    <View style={styles.complexMaskContainer}>
      <Text style={styles.maskTitle}>{text}</Text>
      <View style={styles.shapesContainer}>
        {shapes.map((shape, index) => (
          <View
            key={`${shape.type}-${index}`}
            style={[
              styles.shapeBase,
              shape.style,
              { backgroundColor: 'black' }
            ]}
          />
        ))}
      </View>
    </View>
  ), [text, shapes]);
  
  const memoizedGradient = React.useMemo(() => (
    <LinearGradient
      colors={colors}
      style={styles.gradientFill}
    />
  ), [colors]);
  
  return (
    <MaskedView
      style={styles.optimizedContainer}
      maskElement={memoizedMask}
    >
      {memoizedGradient}
    </MaskedView>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.text === nextProps.text &&
    JSON.stringify(prevProps.shapes) === JSON.stringify(nextProps.shapes) &&
    JSON.stringify(prevProps.colors) === JSON.stringify(nextProps.colors)
  );
});
```

### 2. Lazy Loading de Máscaras
```javascript
const LazyMask = ({ maskType, ...props }) => {
  const [MaskComponent, setMaskComponent] = useState(null);
  
  React.useEffect(() => {
    const loadMask = async () => {
      try {
        let Component;
        switch (maskType) {
          case 'gradient':
            Component = await import('./masks/GradientMask');
            break;
          case 'shape':
            Component = await import('./masks/ShapeMask');
            break;
          case 'complex':
            Component = await import('./masks/ComplexMask');
            break;
          default:
            Component = { default: View };
        }
        setMaskComponent(() => Component.default);
      } catch (error) {
        console.error('Error loading mask component:', error);
        setMaskComponent(() => View);
      }
    };
    
    loadMask();
  }, [maskType]);
  
  if (!MaskComponent) {
    return (
      <View style={styles.loadingPlaceholder}>
        <Text>Cargando máscara...</Text>
      </View>
    );
  }
  
  return <MaskComponent {...props} />;
};
```

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Texto con Gradiente Dinámico
**Objetivo**: Crear un componente que cambie los colores del gradiente basado en el estado de la aplicación.

```javascript
// Tu implementación aquí
const DynamicGradientText = ({ text, mood }) => {
  const getMoodColors = (mood) => {
    const moodPalettes = {
      happy: ['#FFD700', '#FF6B6B'],
      sad: ['#4A90E2', '#7B68EE'],
      energetic: ['#FF4500', '#FF1493'],
      calm: ['#00CED1', '#98FB98'],
    };
    return moodPalettes[mood] || moodPalettes.happy;
  };
  
  // Implementa la lógica de transición entre colores
  // Tip: usa Animated.timing para transiciones suaves
};
```

### Ejercicio 2: Máscara Interactiva
**Objetivo**: Crear una máscara que responda a gestos del usuario.

```javascript
// Implementa un componente que:
// 1. Permita mover la máscara con pan gestures
// 2. Cambie el tamaño de la máscara con pinch gestures
// 3. Rote la máscara con rotation gestures

const InteractiveMask = ({ children }) => {
  // Tu implementación aquí
  // Usa react-native-gesture-handler
};
```

### Ejercicio 3: Sistema de Revelación
**Objetivo**: Crear un sistema que revele contenido progresivamente.

```javascript
// Implementa un componente que:
// 1. Revele contenido basado en el scroll
// 2. Tenga diferentes tipos de revelación (slide, fade, wipe)
// 3. Permita configurar la dirección de la revelación

const RevealSystem = ({ 
  children, 
  revealType = 'slide',
  direction = 'right',
  triggerOffset = 100 
}) => {
  // Tu implementación aquí
};
```

## 🏆 Conclusión: Dominando las Masked Views

Dominar `@react-native-masked-view/masked-view` es como aprender a usar un pincel mágico que puede crear efectos visuales imposibles con CSS tradicional. Has aprendido desde los conceptos básicos hasta implementaciones avanzadas que te permitirán crear interfaces verdaderamente únicas.

### 🎯 Puntos Clave para Recordar:

1. **Concepto Nuclear**: La máscara define QUÉ se ve, no CÓMO se ve
2. **Performance**: Usa memoización y lazy loading para máscaras complejas
3. **Compatibilidad**: Testea siempre en Android e iOS
4. **Accesibilidad**: No olvides hacer tus máscaras accesibles
5. **Composición**: Las máscaras más impactantes combinan múltiples elementos
6. **Animaciones**: Las máscaras animadas crean experiencias memorables
7. **Optimización**: Usa `shouldRasterizeIOS` y `useNativeDriver` cuando sea posible

### 🚀 Próximos Pasos:

1. **Experimenta** con diferentes formas y animaciones
2. **Combina** con otras librerías como SVG, Lottie, y Reanimated
3. **Crea** tu propia biblioteca de componentes reutilizables
4. **Optimiza** para diferentes dispositivos y versiones de Android/iOS
5. **Comparte** tus creaciones con la comunidad

¡Ahora eres oficialmente un maestro de las Masked Views en React Native! 🎭✨

### 📚 Recursos Adicionales:
- [Documentación Oficial](https://github.com/react-native-masked-view/masked-view)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native SVG](https://github.com/react-native-svg/react-native-svg)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)