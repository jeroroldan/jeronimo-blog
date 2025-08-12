---
title: 'Principales de React Native'
code: "react-native"
description: 'Guía Completa: Componentes Principales de React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa: Componentes Principales de React Native
## *El Arsenal Completo del Desarrollador Mobile*

---

## 🎯 Introducción: El Ecosistema de Componentes

### ¿Qué Hace Especial a React Native?

**Analogía de los Bloques LEGO:** React Native es como tener un set completo de bloques LEGO especializados para construir apps móviles. Cada componente es una pieza perfectamente diseñada que se conecta con otras para crear experiencias nativas.

**Ventajas Clave:**
- **Write Once, Run Everywhere** (iOS + Android)
- **Performance nativa** (no webview)
- **Hot Reload** para desarrollo rápido
- **Comunidad masiva** y ecosistema robusto
- **Flexbox layout** familiar para web developers

### Arquitectura de Componentes

```
📱 App Level
├── 🧱 Core Components (View, Text, Image)
├── 📝 Input Components (TextInput, Button, Switch)
├── 📋 List Components (FlatList, SectionList)
├── 🧭 Navigation Components (Stack, Tab, Drawer)
├── 🎨 UI Components (Modal, Alert, StatusBar)
└── 🚀 Custom Components (Tu creación)
```

---

## 🧱 PARTE 1: Componentes Core - Los Fundamentos

### 1.1 View - El Constructor Universal

**Analogía:** `View` es como un `<div>` en web, pero para móviles. Es el contenedor básico que soporta layout, styling, touch handling y accessibility.

#### Implementación Básica

```jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const BasicView = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Header content */}
      </View>
      <View style={styles.content}>
        {/* Main content */}
      </View>
      <View style={styles.footer}>
        {/* Footer content */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 80,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    height: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

#### View Avanzado con Gestos

```jsx
import React from 'react';
import { View, PanGestureHandler, Animated } from 'react-native';

const InteractiveView = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = (event) => {
    translateX.setValue(event.nativeEvent.translationX);
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          styles.draggableView,
          { transform: [{ translateX }] }
        ]}
      >
        {/* Contenido draggable */}
      </Animated.View>
    </PanGestureHandler>
  );
};
```

### 1.2 Text - El Comunicador

**Analogía:** Como un `<p>`, `<h1>`, o `<span>` en web, pero optimizado para móviles con soporte nativo para diferentes tamaños de pantalla.

#### Text Básico y Estilizado

```jsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const TextShowcase = () => {
  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>
        Bienvenido a Mi App
      </Text>
      
      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        La mejor experiencia móvil
      </Text>
      
      {/* Párrafo con texto anidado */}
      <Text style={styles.paragraph}>
        Esta es una app construida con 
        <Text style={styles.highlight}> React Native</Text>, 
        que permite crear aplicaciones 
        <Text style={styles.bold}> nativas increíbles</Text>.
      </Text>
      
      {/* Texto con número de líneas limitado */}
      <Text style={styles.description} numberOfLines={2}>
        Este es un texto muy largo que será truncado después de dos líneas 
        para mantener el layout limpio y organizado en la interfaz móvil.
      </Text>
      
      {/* Texto seleccionable */}
      <Text style={styles.selectableText} selectable={true}>
        Este texto se puede seleccionar y copiar
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 15,
  },
  highlight: {
    color: '#2196F3',
    fontWeight: '600',
  },
  bold: {
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  selectableText: {
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
});
```

### 1.3 Image - El Visual

**Analogía:** Como `<img>` en web, pero con superpoderes móviles: lazy loading, caching automático, múltiples fuentes.

#### Image Completo con Optimizaciones

```jsx
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';

const ImageShowcase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Imagen local */}
      <View style={styles.imageContainer}>
        <Text style={styles.label}>Imagen Local:</Text>
        <Image
          source={require('../assets/logo.png')}
          style={styles.localImage}
          resizeMode="contain"
        />
      </View>

      {/* Imagen remota con loading */}
      <View style={styles.imageContainer}>
        <Text style={styles.label}>Imagen Remota:</Text>
        <View style={styles.remoteImageWrapper}>
          <Image
            source={{
              uri: 'https://picsum.photos/300/200',
              headers: {
                'User-Agent': 'MyApp/1.0',
              },
            }}
            style={styles.remoteImage}
            resizeMode="cover"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
          
          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          )}
          
          {/* Error state */}
          {error && (
            <View style={styles.errorOverlay}>
              <Text style={styles.errorText}>Error al cargar imagen</Text>
            </View>
          )}
        </View>
      </View>

      {/* Imagen con background */}
      <View style={styles.imageContainer}>
        <Text style={styles.label}>Image Background:</Text>
        <ImageBackground
          source={{ uri: 'https://picsum.photos/400/150' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Texto sobre imagen</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  localImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  remoteImageWrapper: {
    position: 'relative',
  },
  remoteImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  backgroundImage: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

---

## 📝 PARTE 2: Componentes de Input - La Interacción

### 2.1 TextInput - El Conversador

**Analogía:** Como `<input>` en web, pero diseñado específicamente para teclados móviles y diferentes tipos de entrada.

#### TextInput Completo con Validación

```jsx
import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FormShowcase = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Referencias para navigation entre campos
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const descriptionRef = useRef();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <View style={styles.container}>
      {/* Nombre */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Ingresa tu nombre"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          blurOnSubmit={false}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          ref={emailRef}
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="tu@email.com"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Teléfono */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          ref={phoneRef}
          style={styles.input}
          placeholder="+54 11 1234-5678"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
      </View>

      {/* Password con toggle */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordRef}
            style={[styles.input, styles.passwordInput]}
            placeholder="Contraseña"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current?.focus()}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TextArea */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          ref={descriptionRef}
          style={[styles.input, styles.textArea]}
          placeholder="Cuéntanos sobre ti..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### 2.2 Button y TouchableOpacity - Los Activadores

**Analogía:** Como `<button>` en web, pero optimizado para touch interfaces con feedback táctil.

#### Botones Avanzados con Estados

```jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, 
         Pressable, ActivityIndicator, Alert } from 'react-native';

const ButtonShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const handleAsyncAction = async () => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Éxito', 'Acción completada');
    } catch (error) {
      Alert.alert('Error', 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Button básico */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Botón Primario</Text>
      </TouchableOpacity>

      {/* Button con loading */}
      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={handleAsyncAction}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" size="small" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        ) : (
          <Text style={styles.primaryButtonText}>Botón con Loading</Text>
        )}
      </TouchableOpacity>

      {/* Button secundario */}
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Botón Secundario</Text>
      </TouchableOpacity>

      {/* Button outline */}
      <TouchableOpacity style={styles.outlineButton}>
        <Text style={styles.outlineButtonText}>Botón Outline</Text>
      </TouchableOpacity>

      {/* Toggle button */}
      <TouchableOpacity
        style={[styles.toggleButton, liked && styles.toggleButtonActive]}
        onPress={() => setLiked(!liked)}
      >
        <Text style={[styles.toggleButtonText, liked && styles.toggleButtonTextActive]}>
          {liked ? '❤️ Te gusta' : '🤍 Me gusta'}
        </Text>
      </TouchableOpacity>

      {/* Counter button */}
      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.counterDisplay}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Pressable con feedback avanzado */}
      <Pressable
        style={({ pressed }) => [
          styles.pressableButton,
          pressed && styles.pressableButtonPressed
        ]}
        onPress={() => Alert.alert('Pressable', 'Botón presionado')}
        android_ripple={{ color: '#rgba(0,0,0,0.1)' }}
      >
        {({ pressed }) => (
          <Text style={[styles.pressableButtonText, pressed && styles.pressableButtonTextPressed]}>
            Pressable Button
          </Text>
        )}
      </Pressable>

      {/* Button con icono */}
      <TouchableOpacity style={styles.iconButton}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.iconButtonText}>Enviar Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  outlineButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButtonActive: {
    backgroundColor: '#ffebee',
    borderColor: '#e91e63',
  },
  toggleButtonText: {
    color: '#666',
    fontSize: 16,
  },
  toggleButtonTextActive: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  counterButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterDisplay: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pressableButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  pressableButtonPressed: {
    backgroundColor: '#45a049',
    transform: [{ scale: 0.98 }],
  },
  pressableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressableButtonTextPressed: {
    opacity: 0.8,
  },
  iconButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 📋 PARTE 3: Componentes de Lista - El Organizador

### 3.1 FlatList - El Rendimiento King

**Analogía:** Como un `RecyclerView` en Android o `UITableView` en iOS, pero multiplataforma. Optimizado para listas largas con lazy loading automático.

#### FlatList Completo con Funcionalidades Avanzadas

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, 
         RefreshControl, ActivityIndicator, Alert } from 'react-native';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Simular API call
  const fetchProducts = async (pageNum = 1, refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProducts = Array.from({ length: 10 }, (_, index) => ({
        id: `${pageNum}-${index}`,
        name: `Producto ${(pageNum - 1) * 10 + index + 1}`,
        price: Math.floor(Math.random() * 1000) + 50,
        image: `https://picsum.photos/100/100?random=${(pageNum - 1) * 10 + index}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        inStock: Math.random() > 0.2,
      }));

      if (refresh || pageNum === 1) {
        setProducts(newProducts);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(pageNum + 1);
      }

      // Simular fin de datos
      if (pageNum >= 5) {
        setHasMoreData(false);
      }

    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = useCallback(() => {
    setHasMoreData(true);
    fetchProducts(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData) {
      fetchProducts(page);
    }
  };

  const handleProductPress = (product) => {
    Alert.alert('Producto Seleccionado', `${product.name} - $${product.price}`);
  };

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.stockContainer}>
          <Text style={[
            styles.stockText,
            { color: item.inStock ? '#4CAF50' : '#f44336' }
          ]}>
            {item.inStock ? 'En stock' : 'Sin stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Productos Destacados</Text>
      <Text style={styles.headerSubtitle}>
        {products.length} productos encontrados
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#2196F3" />
        <Text style={styles.footerText}>Cargando más productos...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>📦</Text>
      <Text style={styles.emptyMessage}>No hay productos disponibles</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts(1, true)}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = (item) => item.id;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  ratingContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  stockContainer: {
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductList;
```

### 3.2 SectionList - El Organizador Categorizado

**Analogía:** Como tener un organizador con separadores - perfecto para listas con categorías, como contactos por letra o productos por categoría.

#### SectionList con Funcionalidades Completas

```jsx
import React, { useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, 
         Alert, Image } from 'react-native';

const ContactList = () => {
  const [contacts] = useState([
    {
      title: 'A',
      data: [
        { id: '1', name: 'Ana García', phone: '+54 11 1234-5678', avatar: '👩‍💼' },
        { id: '2', name: 'Alberto Martín', phone: '+54 11 2345-6789', avatar: '👨‍💻' },
      ]
    },
    {
      title: 'B',
      data: [
        { id: '3', name: 'Beatriz López', phone: '+54 11 3456-7890', avatar: '👩‍🎨' },
        { id: '4', name: 'Bruno Silva', phone: '+54 11 4567-8901', avatar: '👨‍🍳' },
      ]
    },
    {
      title: 'C',
      data: [
        { id: '5', name: 'Carlos Mendoza', phone: '+54 11 5678-9012', avatar: '👨‍⚕️' },
        { id: '6', name: 'Carmen Ruiz', phone: '+54 11 6789-0123', avatar: '👩‍🏫' },
        { id: '7', name: 'Cristian Torres', phone: '+54 11 7890-1234', avatar: '👨‍🎤' },
      ]
    },
    {
      title: 'D',
      data: [
        { id: '8', name: 'Diana Vega', phone: '+54 11 8901-2345', avatar: '👩‍⚖️' },
      ]
    },
  ]);

  const handleContactPress = (contact) => {
    Alert.alert(
      contact.name,
      `¿Qué quieres hacer?`,
      [
        { text: 'Llamar', onPress: () => console.log(`Calling ${contact.phone}`) },
        { text: 'Mensaje', onPress: () => console.log(`Messaging ${contact.name}`) },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      
      <View style={styles.contactActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => console.log(`Calling ${item.phone}`)}
        >
          <Text style={styles.actionIcon}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => console.log(`Messaging ${item.name}`)}
        >
          <Text style={styles.actionIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  const renderSectionFooter = ({ section }) => (
    <View style={styles.sectionFooter}>
      <Text style={styles.sectionCount}>
        {section.data.length} contacto{section.data.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const getItemLayout = (data, index) => {
    const ITEM_HEIGHT = 80;
    const SECTION_HEADER_HEIGHT = 40;
    const SECTION_FOOTER_HEIGHT = 20;
    
    let offset = 0;
    let itemIndex = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (itemIndex === index) break;
      
      offset += SECTION_HEADER_HEIGHT; // Section header
      offset += data[i].data.length * ITEM_HEIGHT; // Items
      offset += SECTION_FOOTER_HEIGHT; // Section footer
      
      itemIndex += data[i].data.length;
    }
    
    return {
      length: ITEM_HEIGHT,
      offset,
      index,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contactos</Text>
        <Text style={styles.headerSubtitle}>
          {contacts.reduce((total, section) => total + section.data.length, 0)} contactos
        </Text>
      </View>
      
      <SectionList
        sections={contacts}
        renderItem={renderContact}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
        // getItemLayout={getItemLayout} // Uncomment for better performance
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionHeader: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginRight: 10,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#bbdefb',
  },
  sectionFooter: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  sectionCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  contactItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionIcon: {
    fontSize: 18,
  },
});

export default ContactList;
```

---

## 🧭 PARTE 4: Navegación - El GPS de tu App

### 4.1 React Navigation - El Sistema Nervioso

**Analogía:** Como el sistema de carreteras de una ciudad, React Navigation conecta todas las "pantallas" de tu app de manera fluida y lógica.

#### Stack Navigation Completo

```jsx
// App.js - Configuración principal
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        
        if (route.name === 'Home') {
          iconName = focused ? '🏠' : '🏡';
        } else if (route.name === 'Profile') {
          iconName = focused ? '👤' : '👥';
        } else if (route.name === 'Settings') {
          iconName = focused ? '⚙️' : '🔧';
        }
        
        return <Text style={{ fontSize: size }}>{iconName}</Text>;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

// Main Stack Navigator
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen}
              options={({ route }) => ({
                title: route.params?.productName || 'Producto',
                headerBackTitleVisible: false,
              })}
            />
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

export default App;
```

#### HomeScreen con Navegación Avanzada

```jsx
// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([
    { id: '1', name: 'iPhone 15 Pro', price: 999, category: 'Smartphones' },
    { id: '2', name: 'MacBook Air M2', price: 1199, category: 'Laptops' },
    { id: '3', name: 'AirPods Pro', price: 249, category: 'Audio' },
  ]);

  // Hook que se ejecuta cuando la pantalla recibe focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeScreen focused');
      // Actualizar datos, analytics, etc.
      
      return () => {
        console.log('HomeScreen unfocused');
        // Cleanup cuando pierde focus
      };
    }, [])
  );

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.name,
      product: product,
    });
  };

  const handleSearch = () => {
    // Navegar con stack reset
    navigation.reset({
      index: 0,
      routes: [
        { 
          name: 'Search',
          params: { query: 'initial search' }
        }
      ],
    });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      <Text style={styles.arrow}>▶️</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos Destacados</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>🔍 Buscar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* Navigation Examples */}
      <View style={styles.navExamples}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.navButtonText}>Ir a Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.navButtonText}>Configuración</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 14,
  },
  productCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  arrow: {
    fontSize: 16,
    color: '#ccc',
  },
  navExamples: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
```

---

## 🎨 PARTE 5: Componentes UI Avanzados

### 5.1 Modal - El Overlay Maestro

```jsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, 
         Animated, Dimensions, PanGestureHandler } from 'react-native';

const ModalShowcase = () => {
  const [basicModalVisible, setBasicModalVisible] = useState(false);
  const [fullScreenModalVisible, setFullScreenModalVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  
  const screenHeight = Dimensions.get('window').height;
  const translateY = new Animated.Value(screenHeight);

  const showBottomSheet = () => {
    setBottomSheetVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const hideBottomSheet = () => {
    Animated.spring(translateY, {
      toValue: screenHeight,
      useNativeDriver: true,
    }).start(() => {
      setBottomSheetVisible(false);
    });
  };

  return (
    <View style={styles.container}>
      {/* Trigger Buttons */}
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setBasicModalVisible(true)}
      >
        <Text style={styles.triggerButtonText}>Modal Básico</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setFullScreenModalVisible(true)}
      >
        <Text style={styles.triggerButtonText}>Modal Full Screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.triggerButton}
        onPress={showBottomSheet}
      >
        <Text style={styles.triggerButtonText}>Bottom Sheet</Text>
      </TouchableOpacity>

      {/* Basic Modal */}
      <Modal
        visible={basicModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBasicModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modal Básico</Text>
            <Text style={styles.modalText}>
              Este es un modal básico con overlay transparente.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBasicModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setBasicModalVisible(false);
                  Alert.alert('Confirmado', 'Acción realizada');
                }}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full Screen Modal */}
      <Modal
        visible={fullScreenModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity
              onPress={() => setFullScreenModalVisible(false)}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>Pantalla Completa</Text>
            <View style={{ width: 30 }} />
          </View>
          
          <View style={styles.fullScreenContent}>
            <Text style={styles.fullScreenText}>
              Esta es una modal que ocupa toda la pantalla.
              Perfecta para formularios complejos o flujos detallados.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={bottomSheetVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideBottomSheet}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackground}
            activeOpacity={1}
            onPress={hideBottomSheet}
          />
          
          <Animated.View
            style={[
              styles.bottomSheetContent,
              { transform: [{ translateY }] }
            ]}
          >
            <View style={styles.bottomSheetHandle} />
            
            <Text style={styles.bottomSheetTitle}>Opciones</Text>
            
            <TouchableOpacity style={styles.bottomSheetOption}>
              <Text style={styles.bottomSheetOptionText}>📷 Tomar Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bottomSheetOption}>
              <Text style={styles.bottomSheetOptionText}>🖼️ Seleccionar de Galería</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bottomSheetOption}>
              <Text style={styles.bottomSheetOptionText}>📁 Explorar Archivos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.bottomSheetOption, styles.cancelOption]}
              onPress={hideBottomSheet}
            >
              <Text style={[styles.bottomSheetOptionText, styles.cancelOptionText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  triggerButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
  },
  triggerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Basic Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    minWidth: 300,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Full Screen Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  fullScreenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fullScreenContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  fullScreenText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  
  // Bottom Sheet Styles
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomSheetOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bottomSheetOptionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  cancelOptionText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
```

---

## 🚀 PARTE 6: Performance y Optimización

### 6.1 Memo y Callbacks para Performance

```jsx
import React, { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

// Componente optimizado con memo
const ProductItem = memo(({ product, onPress, onAddToCart }) => {
  console.log(`Rendering product: ${product.name}`);
  
  return (
    <TouchableOpacity style={styles.productItem} onPress={() => onPress(product)}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => onAddToCart(product)}
      >
        <Text style={styles.addToCartText}>Agregar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison para optimizar re-renders
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price
  );
});

const OptimizedProductList = () => {
  const [products] = useState([
    { id: '1', name: 'iPhone 15', price: 999, category: 'phone' },
    { id: '2', name: 'MacBook Pro', price: 1999, category: 'laptop' },
    { id: '3', name: 'AirPods', price: 199, category: 'audio' },
  ]);
  
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState('all');

  // useCallback para evitar re-creación de funciones
  const handleProductPress = useCallback((product) => {
    console.log('Product pressed:', product.name);
  }, []);

  const handleAddToCart = useCallback((product) => {
    setCart(prevCart => [...prevCart, product]);
  }, []);

  // useMemo para cálculos expensive
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    if (filter === 'all') return products;
    return products.filter(product => product.category === filter);
  }, [products, filter]);

  const totalCartValue = useMemo(() => {
    console.log('Calculating cart total...');
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  const renderProduct = useCallback(({ item }) => (
    <ProductItem
      product={item}
      onPress={handleProductPress}
      onAddToCart={handleAddToCart}
    />
  ), [handleProductPress, handleAddToCart]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos ({filteredProducts.length})</Text>
        <Text style={styles.cartTotal}>Cart: ${totalCartValue}</Text>
      </View>

      <View style={styles.filters}>
        {['all', 'phone', 'laptop', 'audio'].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              filter === category && styles.activeFilter
            ]}
            onPress={() => setFilter(category)}
          >
            <Text style={[
              styles.filterText,
              filter === category && styles.activeFilterText
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />
    </View>
  );
};
```

### 6.2 Best Practices y Anti-Patterns

```jsx
// ❌ BAD: Re-rendering innecesario
const BadComponent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <ExpensiveChild data={getData()} /> {/* Se ejecuta en cada render */}
      <Button onPress={() => setCount(count + 1)}>Count: {count}</Button>
    </View>
  );
};

// ✅ GOOD: Optimizado
const GoodComponent = () => {
  const [count, setCount] = useState(0);
  
  const memoizedData = useMemo(() => getData(), []); // Solo se ejecuta una vez
  
  return (
    <View>
      <ExpensiveChild data={memoizedData} />
      <Button onPress={() => setCount(prev => prev + 1)}>Count: {count}</Button>
    </View>
  );
};

// ❌ BAD: Inline functions en FlatList
<FlatList
  data={items}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}> {/* Nueva función cada render */}
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>

// ✅ GOOD: Callbacks optimizados
const renderItem = useCallback(({ item }) => (
  <TouchableOpacity onPress={() => handlePress(item)}>
    <Text>{item.name}</Text>
  </TouchableOpacity>
), [handlePress]);

<FlatList
  data={items}
  renderItem={renderItem}
/>
```

---

## 🎯 Conclusión: Tu Roadmap de Dominio

### Plan de Aprendizaje 30-60-90 Días

#### Primeros 30 Días: Fundamentos
```
Semana 1: View, Text, Image, StyleSheet
Semana 2: TextInput, Button, TouchableOpacity
Semana 3: FlatList básico, navegación simple
Semana 4: Proyecto: Lista de tareas con navegación
```

#### 60 Días: Intermedio
```
Semana 5-6: SectionList, Modal, animaciones básicas
Semana 7-8: React Navigation avanzado, formularios complejos
Proyecto: App de e-commerce básica
```

#### 90 Días: Avanzado
```
Semana 9-12: Performance optimization, custom hooks
             Animaciones avanzadas, gestures
             Testing, deployment
Proyecto: App completa con backend integration
```

### Los 10 Componentes Que Todo Developer RN Debe Dominar

1. **View** - El fundamento de todo layout
2. **Text** - Comunicación con el usuario
3. **TextInput** - Captura de datos
4. **FlatList** - Performance en listas largas
5. **TouchableOpacity** - Interacciones táctiles
6. **Image** - Contenido visual optimizado
7. **Modal** - Overlays y pop-ups
8. **Navigation** - Flujo entre pantallas
9. **StatusBar** - Control de la barra de estado
10. **SafeAreaView** - Compatibilidad con notches

### Key Takeaways

🚀 **Performance First**: Siempre piensa en optimización desde el inicio
📱 **Platform Awareness**: Considera las diferencias iOS vs Android
🎨 **Consistent Design**: Usa un design system coherente
🔄 **State Management**: Keep it simple, scale when needed
🧪 **Test Early**: Prueba en dispositivos reales frecuentemente

**Tu próximo paso:** Elige un componente de esta guía e impleméntalo en un proyecto real. La práctica es la única forma de dominar React Native.

---

*"El mejor código es el que funciona, es mantenible y hace felices a los usuarios."*

**¡Tu journey como React Native developer empieza ahora! 🚀📱**