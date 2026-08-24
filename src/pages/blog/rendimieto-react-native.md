---
title: 'React Native'
code: "react"
description: 'Guía Maestra de Rendimiento en React Native: De 0 a Fórmula 1'
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


# Guía Maestra de Rendimiento en React Native: De 0 a Fórmula 1

## Optimización Completa con Ejemplos Reales y Analogías

## 🏎️ La Gran Analogía: Tu App como un Auto de Carreras

Tu aplicación React Native es como un **auto de carreras** compitiendo en una pista. Para ganar la carrera (tener una app fluida), necesitas optimizar cada componente:

* **Motor (JavaScript Engine)**: Debe ejecutar código eficientemente
* **Transmisión (Bridge)**: Comunicación entre JS y Native debe ser fluida
* **Combustible (Memoria)**: No puedes quedarte sin gasolina (memory leaks)
* **Neumáticos (Re-renders)**: Deben cambiar solo cuando es necesario
* **Aerodinámica (Bundle Size)**: Menos peso = más velocidad
* **Piloto (Developer)**: Debe conocer las mejores técnicas de manejo

---

## 🎯 Los 7 Pilares del Rendimiento Supremo

### 1. 🎭 Re-renders Inteligentes - Como Cambiar de Ropa Solo Cuando Es Necesario

**Analogía**: *Imagina que cambias de ropa completa cada vez que te manchas solo una manga. Sería agotador e innecesario.*

#### ❌ Problema Común: Re-renders Excesivos

```typescript
// ❌ MALO - Se re-renderiza toda la lista cuando cambia cualquier cosa
const BadProductList = ({ products, cart, onAddToCart }) => {
  console.log('🔴 Lista completa re-renderizada'); // Esto se ejecuta muchas veces
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        // Este componente se re-crea en cada render de la lista
        <View style={styles.productCard}>
          <Text>{item.name}</Text>
          <Text>${item.price}</Text>
          <TouchableOpacity onPress={() => onAddToCart(item)}>
            <Text>Add to Cart ({cart.length})</Text> {/* Muestra contador del cart */}
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

// ❌ MALO - Padre que causa re-renders innecesarios
const BadShoppingApp = () => {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Cada tecla causa re-render total
  
  // Función que se re-crea en cada render
  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };
  
  // Filtro que se recalcula en cada render
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <View>
      <TextInput 
        value={searchTerm}
        onChangeText={setSearchTerm} // Cada tecla re-renderiza TODO
        placeholder="Buscar productos..."
      />
      {/* Toda la lista se re-renderiza cuando cambias searchTerm */}
      <BadProductList 
        products={filteredProducts}
        cart={cart}
        onAddToCart={addToCart}
      />
    </View>
  );
};
```

#### ✅ Solución: Optimización con React.memo y Hooks

```typescript
// ✅ BUENO - Componente optimizado que solo se re-renderiza cuando es necesario
const OptimizedProductCard = React.memo(({ 
  product, 
  isInCart, 
  onAddToCart 
}) => {
  console.log(`🟢 Card re-renderizada para: ${product.name}`); // Solo se ejecuta cuando es necesario
  
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <View style={styles.productFooter}>
        <Text style={styles.categoryBadge}>{product.category}</Text>
        <TouchableOpacity 
          style={[
            styles.addButton,
            isInCart && styles.addButtonInCart
          ]}
          onPress={() => onAddToCart(product)}
        >
          <Text style={styles.addButtonText}>
            {isInCart ? '✓ En Carrito' : '+ Agregar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada - como decidir si realmente necesitas cambiar de ropa
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.isInCart === nextProps.isInCart
  );
});

// ✅ BUENO - Lista optimizada con separación de responsabilidades
const OptimizedProductList = React.memo(({ 
  products, 
  cartItems, 
  onAddToCart 
}) => {
  // Crear Set para búsquedas O(1) en lugar de O(n)
  const cartItemIds = useMemo(() => 
    new Set(cartItems.map(item => item.id))
  , [cartItems]);
  
  // Función de renderizado memoizada
  const renderProduct = useCallback(({ item }) => (
    <OptimizedProductCard
      product={item}
      isInCart={cartItemIds.has(item.id)}
      onAddToCart={onAddToCart}
    />
  ), [cartItemIds, onAddToCart]);
  
  // Key extractor optimizado
  const keyExtractor = useCallback((item) => item.id, []);
  
  // Configuración de FlatList optimizada
  const getItemLayout = useCallback((data, index) => ({
    length: 120, // Altura fija del item
    offset: 120 * index,
    index,
  }), []);
  
  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout} // Mejora scrolling performance
      removeClippedSubviews={true} // Remueve elementos fuera de pantalla
      maxToRenderPerBatch={10} // Renderiza 10 items por lote
      updateCellsBatchingPeriod={50} // Actualiza cada 50ms
      initialNumToRender={8} // Renderiza 8 items inicialmente
      windowSize={10} // Mantiene 10 items en memoria
    />
  );
});

// ✅ BUENO - App principal optimizada
const OptimizedShoppingApp = () => {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Función memoizada que no se re-crea
  const addToCart = useCallback((product) => {
    setCart(prev => {
      // Evitar duplicados
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);
  
  // Búsqueda debounced para evitar filtrado excesivo
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Espera 300ms después de que el usuario pare de escribir
  
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Filtrado memoizado que solo se recalcula cuando es necesario
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;
  
    return products.filter(product =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [products, debouncedSearchTerm]);
  
  return (
    <View style={styles.container}>
      <SearchHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={cart.length}
      />
      <OptimizedProductList
        products={filteredProducts}
        cartItems={cart}
        onAddToCart={addToCart}
      />
    </View>
  );
};

// Componente de búsqueda separado y memoizado
const SearchHeader = React.memo(({ searchTerm, onSearchChange, cartCount }) => (
  <View style={styles.searchHeader}>
    <TextInput
      style={styles.searchInput}
      value={searchTerm}
      onChangeText={onSearchChange}
      placeholder="🔍 Buscar productos..."
      returnKeyType="search"
    />
    <View style={styles.cartBadge}>
      <Text style={styles.cartCount}>🛒 {cartCount}</Text>
    </View>
  </View>
));
```

### 2. 📊 Manejo Inteligente de Listas - Como un Restaurante Eficiente

**Analogía**: *Un restaurante inteligente no prepara todos los platos al mismo tiempo, sino solo los que ve que van a necesitar pronto. Así no desperdicia recursos ni tiempo.*

#### ✅ FlatList Súper Optimizada

```typescript
// ✅ BUENO - FlatList configurada como un restaurante de élite
const SuperOptimizedList = ({ data, onItemPress }) => {
  // Configuración de rendimiento avanzada
  const flatListConfig = useMemo(() => ({
    // Renderizado inicial mínimo
    initialNumToRender: 10,
    // Tamaño de la ventana de items activos
    windowSize: 21,
    // Máximo de items a renderizar por lote
    maxToRenderPerBatch: 5,
    // Período de actualización de lotes
    updateCellsBatchingPeriod: 100,
    // Remover elementos fuera de vista
    removeClippedSubviews: true,
    // Scroll throttling para mejor performance
    scrollEventThrottle: 16,
  }), []);
  
  // Función de renderizado optimizada
  const renderItem = useCallback(({ item, index }) => (
    <ListItem 
      item={item} 
      index={index}
      onPress={onItemPress}
    />
  ), [onItemPress]);
  
  // Key extractor optimizado
  const keyExtractor = useCallback((item, index) => 
    item.id || `item-${index}`, []);
  
  // getItemLayout para items de altura fija (SÚPER IMPORTANTE)
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      {...flatListConfig}
    />
  );
};

// Componente de item optimizado
const ListItem = React.memo(({ item, index, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item, index);
  }, [item, index, onPress]);
  
  return (
    <TouchableOpacity style={styles.listItem} onPress={handlePress}>
      <FastImage
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode={FastImage.resizeMode.cover}
        // Placeholder mientras carga
        placeholder={<View style={styles.imagePlaceholder} />}
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <Text style={styles.itemRating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Para listas con altura variable, usa esto:
const VariableHeightList = ({ data }) => {
  // Cache de alturas calculadas
  const [itemHeights, setItemHeights] = useState(new Map());
  
  const onLayout = useCallback((event, itemId) => {
    const { height } = event.nativeEvent.layout;
    setItemHeights(prev => new Map(prev.set(itemId, height)));
  }, []);
  
  const renderItem = useCallback(({ item }) => (
    <View onLayout={(event) => onLayout(event, item.id)}>
      <VariableHeightItem item={item} />
    </View>
  ), [onLayout]);
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      // Para alturas variables, no uses getItemLayout
      estimatedItemSize={100} // Altura estimada
      removeClippedSubviews={true}
    />
  );
};
```

### 3. 🖼️ Optimización de Imágenes - Como un Fotógrafo Profesional

**Analogía**: *Un fotógrafo profesional no guarda fotos en RAW de 50MB cuando solo necesita mostrarlas en Instagram. Optimiza el tamaño para cada uso.*

#### ❌ Problema: Imágenes Sin Optimizar

```typescript
// ❌ MALO - Carga imágenes gigantes innecesariamente
const BadImageGallery = ({ images }) => {
  return (
    <ScrollView>
      {images.map(image => (
        <Image
          key={image.id}
          source={{ uri: image.url }} // URL de imagen full-size 4K
          style={{ width: 300, height: 200 }} // Pero solo se muestra pequeña
          // Sin caching, sin placeholder, sin optimización
        />
      ))}
    </ScrollView>
  );
};
```

#### ✅ Solución: Fast Image con Optimización Completa

```typescript
import FastImage from 'react-native-fast-image';

// ✅ BUENO - Galería optimizada como un fotógrafo pro
const OptimizedImageGallery = ({ images }) => {
  // Pre-cargar imágenes críticas
  useEffect(() => {
    const preloadImages = images.slice(0, 5).map(image => ({
      uri: image.thumbnailUrl,
      priority: FastImage.priority.high,
    }));
  
    FastImage.preload(preloadImages);
  }, [images]);
  
  return (
    <FlatList
      data={images}
      renderItem={({ item, index }) => (
        <OptimizedImageCard image={item} index={index} />
      )}
      numColumns={2}
      removeClippedSubviews={true}
    />
  );
};

const OptimizedImageCard = React.memo(({ image, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Lazy loading para imágenes fuera de viewport inicial
  const shouldLoad = index < 10 || imageLoaded;
  
  return (
    <View style={styles.imageCard}>
      {shouldLoad && (
        <FastImage
          source={{
            uri: image.thumbnailUrl, // Usa thumbnail, no imagen full-size
            priority: index < 4 ? FastImage.priority.high : FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.cardImage}
          resizeMode={FastImage.resizeMode.cover}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          fallback={true} // Fallback a Image nativo si FastImage falla
        />
      )}
  
      {/* Placeholder mientras carga */}
      {!imageLoaded && !imageError && (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>📷</Text>
        </View>
      )}
  
      {/* Error state */}
      {imageError && (
        <View style={styles.imageError}>
          <Text style={styles.errorText}>❌ Error</Text>
        </View>
      )}
  
      <Text style={styles.imageTitle} numberOfLines={2}>
        {image.title}
      </Text>
    </View>
  );
});

// Configuración global de FastImage para toda la app
const setupImageOptimization = () => {
  // Configurar cache disk
  FastImage.clearDiskCache();
  
  // Pre-cargar imágenes críticas globales
  FastImage.preload([
    {
      uri: 'https://app.com/logo.png',
      priority: FastImage.priority.high,
    },
    {
      uri: 'https://app.com/default-avatar.png',
      priority: FastImage.priority.high,
    },
  ]);
};
```

### 4. 🎣 Hooks Eficientes - Como un Pescador Experto

**Analogía**: *Un pescador experto no cambia de caña cada vez que mueve el anzuelo. Usa las herramientas adecuadas y las mantiene listas para cuando las necesite.*

#### ❌ Problema: Hooks Ineficientes

```typescript
// ❌ MALO - Hooks que causan trabajo innecesario
const BadHooksComponent = ({ userId, filters }) => {
  // Este efecto se ejecuta en CADA render porque no tiene dependencias bien definidas
  useEffect(() => {
    fetchUserData(userId);
  }); // ← Sin array de dependencias = se ejecuta siempre
  
  // Este valor se recalcula en cada render
  const expensiveCalculation = heavyComputationFunction(filters);
  
  // Esta función se re-crea en cada render
  const handleSubmit = (data) => {
    submitData(data);
  };
  
  // Este efecto tiene dependencias innecesarias
  useEffect(() => {
    console.log('User changed');
  }, [userId, filters, expensiveCalculation]); // ← Dependencias que cambian constantemente
  
  return <div>Content</div>;
};
```

#### ✅ Solución: Hooks Como un Pescador Experto

```typescript
// ✅ BUENO - Hooks optimizados como un pescador profesional
const OptimizedHooksComponent = ({ userId, filters }) => {
  // Estado local optimizado
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Efecto con dependencias específicas - solo se ejecuta cuando userId cambia
  useEffect(() => {
    let cancelled = false;
  
    const loadUserData = async () => {
      if (!userId) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const data = await fetchUserData(userId);
        if (!cancelled) {
          setUserData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
  
    loadUserData();
  
    // Cleanup function - como guardar la caña de pescar
    return () => {
      cancelled = true;
    };
  }, [userId]); // Solo depende de userId
  
  // Cálculo memoizado - solo se recalcula cuando filters cambia
  const expensiveCalculation = useMemo(() => {
    console.log('🔄 Recalculando...');
    return heavyComputationFunction(filters);
  }, [filters]);
  
  // Función memoizada - no se re-crea en cada render
  const handleSubmit = useCallback(async (data) => {
    setLoading(true);
    try {
      await submitData(data);
      // Mostrar éxito
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // No depende de nada, se crea una vez
  
  // Efecto para logging con dependencia específica
  useEffect(() => {
    if (userData) {
      console.log('✅ Usuario cargado:', userData.name);
    }
  }, [userData?.id]); // Solo depende del ID del usuario
  
  // Custom hook para lógica reutilizable
  const { formData, handleInputChange, validateForm } = useFormValidation({
    initialData: userData,
    validationRules: VALIDATION_RULES,
  });
  
  // Early returns para evitar renders innecesarios
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage error={error} onRetry={() => window.location.reload()} />;
  }
  
  if (!userData) {
    return <EmptyState message="No user data available" />;
  }
  
  return (
    <UserForm
      userData={userData}
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      calculatedValue={expensiveCalculation}
      isValid={validateForm()}
    />
  );
};

// Custom hook optimizado para manejo de formularios
const useFormValidation = ({ initialData, validationRules }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});
  
  // Memoizar reglas de validación
  const rules = useMemo(() => validationRules, [validationRules]);
  
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  
    // Limpiar error específico cuando el usuario corrige
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);
  
  const validateForm = useCallback(() => {
    const newErrors = {};
  
    Object.entries(rules).forEach(([field, rule]) => {
      const value = formData[field];
      if (!rule.validate(value)) {
        newErrors[field] = rule.message;
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, rules]);
  
  // Efecto para sincronizar con datos externos
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    isValid: Object.keys(errors).length === 0,
  };
};
```

### 5. 🌉 Optimización del Bridge - Como un Traductor Eficiente

**Analogía**: *El bridge entre JavaScript y código nativo es como un traductor en una conferencia internacional. Si el traductor es lento o hace traducciones innecesarias, toda la comunicación se vuelve lenta.*

#### ❌ Problema: Bridge Sobrecargado

```typescript
// ❌ MALO - Comunicación excesiva con el bridge
const BadAnimationComponent = () => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    // Animación que actualiza estado 60 veces por segundo
    const interval = setInterval(() => {
      setPosition(prev => {
        const newPos = prev + 1;
        // Cada actualización pasa por el bridge
        return newPos > 300 ? 0 : newPos;
      });
    }, 16); // 60 FPS
  
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={{ transform: [{ translateX: position }] }}>
      <Text>Moving element</Text>
    </View>
  );
};

// ❌ MALO - Comunicación innecesaria durante scroll
const BadScrollHandler = () => {
  const [scrollY, setScrollY] = useState(0);
  
  const handleScroll = (event) => {
    // Cada evento de scroll pasa por el bridge
    setScrollY(event.nativeEvent.contentOffset.y);
  
    // Cálculos costosos en cada scroll
    const opacity = Math.max(0, 1 - scrollY / 200);
    setHeaderOpacity(opacity);
  };
  
  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={1} // ¡Demasiado frecuente!
    >
      {/* Content */}
    </ScrollView>
  );
};
```

#### ✅ Solución: Bridge Optimizado

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

// ✅ BUENO - Animaciones nativas sin bridge
const OptimizedAnimationComponent = () => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  // Animación que corre completamente en el hilo nativo
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });
  
  const startAnimation = () => {
    // Animación secuencial sin pasar por el bridge
    translateX.value = withTiming(300, { duration: 1000 }, (finished) => {
      if (finished) {
        translateX.value = withTiming(0, { duration: 1000 });
      }
    });
  };
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedBox, animatedStyle]}>
        <Text>Smooth Animation</Text>
      </Animated.View>
      <TouchableOpacity onPress={startAnimation}>
        <Text>Start Animation</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ BUENO - Scroll handler optimizado
const OptimizedScrollComponent = () => {
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  
  // Scroll handler que corre en el hilo nativo
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
  
      // Cálculos que corren en el hilo nativo
      headerOpacity.value = Math.max(0, 1 - scrollY.value / 200);
    },
    onEndDrag: () => {
      // Solo comunica con JS cuando es necesario
      runOnJS(handleScrollEnd)();
    },
  });
  
  // Estilo animado del header
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: -scrollY.value * 0.5, // Efecto parallax
      },
    ],
  }));
  
  const handleScrollEnd = () => {
    console.log('Scroll ended');
    // Lógica que necesita correr en JavaScript
  };
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.headerTitle}>Optimized Header</Text>
      </Animated.View>
  
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16} // 60 FPS es suficiente
      >
        {[...Array(50)].map((_, index) => (
          <View key={index} style={styles.listItem}>
            <Text>Item {index + 1}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

// ✅ BUENO - Gesture handler optimizado
const OptimizedGestureComponent = () => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      // Guardar posición inicial
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // Gestos que corren en el hilo nativo
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
      scale.value = event.scale;
    },
    onEnd: () => {
      // Animación de regreso
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      scale.value = withTiming(1);
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.gestureBox, animatedStyle]}>
        <Text>Drag and Scale Me!</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};
```

### 6. 💾 Gestión de Memoria - Como un Bibliotecario Organizado

**Analogía**: *Un bibliotecario organizado no deja todos los libros abiertos en las mesas. Guarda los que no se usan y mantiene solo los necesarios a mano.*

#### ❌ Problemas de Memoria Comunes

```typescript
// ❌ MALO - Memory leaks por listeners no limpiados
const BadComponentWithLeaks = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Listener que nunca se limpia
    const subscription = EventEmitter.addListener('dataUpdate', (newData) => {
      setData(prevData => [...prevData, ...newData]); // Array que crece infinitamente
    });
  
    // Timer que nunca se limpia
    const interval = setInterval(() => {
      fetchMoreData().then(setData); // Posible acumulación de requests
    }, 1000);
  
    // ❌ FALTA el cleanup!
  }, []);
  
  return (
    <FlatList
      data={data} // Array que puede crecer sin límite
      renderItem={({ item }) => <HeavyComponent item={item} />}
    />
  );
};

// ❌ MALO - Componentes pesados sin limpieza
const HeavyComponent = ({ item }) => {
  // Carga imagen completa sin optimización
  const [imageData, setImageData] = useState(null);
  
  useEffect(() => {
    loadFullResolutionImage(item.imageUrl).then(setImageData);
    // No se limpia cuando el componente se desmonta
  }, [item.imageUrl]);
  
  return (
    <View>
      {imageData && <Image source={{ uri: imageData }} />}
    </View>
  );
};
```

#### ✅ Solución: Gestión de Memoria Como un Bibliotecario Experto

```typescript
// ✅ BUENO - Gestión perfecta de memoria
const OptimizedComponentWithCleanup = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  
  // Límite máximo de items para prevenir crecimiento infinito
  const MAX_ITEMS = 1000;
  
  useEffect(() => {
    let subscription = null;
    let interval = null;
  
    const setupListeners = () => {
      // Listener con cleanup automático
      subscription = EventEmitter.addListener('dataUpdate', (newData) => {
        setData(prevData => {
          const combined = [...prevData, ...newData];
          // Mantener solo los últimos MAX_ITEMS
          return combined.slice(-MAX_ITEMS);
        });
      });
  
      // Timer con cleanup
      interval = setInterval(() => {
        if (!loading) {
          loadMoreDataSafely();
        }
      }, 5000); // Menos frecuente
    };
  
    const loadMoreDataSafely = async () => {
      // Cancelar request anterior si está en progreso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
  
      abortControllerRef.current = new AbortController();
      setLoading(true);
  
      try {
        const newData = await fetchMoreData({
          signal: abortControllerRef.current.signal
        });
  
        setData(prevData => {
          const combined = [...prevData, ...newData];
          return combined.slice(-MAX_ITEMS); // Limitar tamaño
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error loading data:', error);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    };
  
    setupListeners();
  
    // ✅ CRUCIAL: Cleanup completo
    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (interval) {
        clearInterval(interval);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loading]);
  
  // Limpiar datos antiguos periódicamente
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setData(prevData => {
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
        return prevData.filter(item => item.timestamp > cutoffTime);
      });
    }, 60000); // Cada minuto
  
    return () => clearInterval(cleanupInterval);
  }, []);
  
  return (
    <OptimizedList
      data={data}
      loading={loading}
      maxItems={MAX_ITEMS}
    />
  );
};

// ✅ BUENO - Lista con gestión de memoria optimizada
const OptimizedList = React.memo(({ data, loading, maxItems }) => {
  // Virtualización para listas grandes
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const start = viewableItems[0].index;
      const end = viewableItems[viewableItems.length - 1].index;
      setVisibleRange({ start: Math.max(0, start - 5), end: end + 5 });
    }
  }, []);
  
  const renderItem = useCallback(({ item, index }) => (
    <OptimizedListItem
      item={item}
      index={index}
      isVisible={index >= visibleRange.start && index <= visibleRange.end}
    />
  ), [visibleRange]);
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 100,
      }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={21}
      initialNumToRender={15}
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
      ListFooterComponent={loading ? <LoadingIndicator /> : null}
    />
  );
});

// ✅ BUENO - Item de lista con gestión de recursos
const OptimizedListItem = React.memo(({ item, index, isVisible }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  
  useEffect(() => {
    // Solo cargar imagen si el item es visible
    if (isVisible && item.imageUrl && !imageLoaded) {
      const loadImage = async () => {
        try {
          await FastImage.preload([{
            uri: item.thumbnailUrl, // Usar thumbnail en lugar de imagen completa
            priority: FastImage.priority.normal,
          }]);
          setImageLoaded(true);
        } catch (error) {
          console.log('Error preloading image:', error);
        }
      };
  
      loadImage();
    }
  }, [isVisible, item.imageUrl, item.thumbnailUrl, imageLoaded]);
  
  // Limpiar recursos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (imageRef.current) {
        // Limpiar referencia de imagen
        imageRef.current = null;
      }
    };
  }, []);
  
  return (
    <View style={styles.listItem}>
      {isVisible ? (
        <>
          <FastImage
            ref={imageRef}
            source={{ 
              uri: item.thumbnailUrl,
              cache: FastImage.cacheControl.web
            }}
            style={styles.itemImage}
            onLoad={() => setImageLoaded(true)}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.itemDescription} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
        </>
      ) : (
        // Placeholder para items no visibles
        <View style={styles.itemPlaceholder}>
          <View style={styles.placeholderImage} />
          <View style={styles.placeholderContent}>
            <View style={styles.placeholderTitle} />
            <View style={styles.placeholderDescription} />
          </View>
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.isVisible === nextProps.isVisible
  );
});

// Hook personalizado para gestión de memoria
const useMemoryMonitor = () => {
  useEffect(() => {
    if (__DEV__) {
      const memoryInterval = setInterval(() => {
        if (performance.memory) {
          const memory = performance.memory;
          console.log('📊 Memory Usage:', {
            used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
            total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
            limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`,
          });
        }
      }, 10000); // Cada 10 segundos
  
      return () => clearInterval(memoryInterval);
    }
  }, []);
};
```

---

## 🚫 LO QUE NUNCA DEBES HACER - Los Pecados Mortales

### 1. ❌ Nunca Hagas Esto: Inline Functions en Render

```typescript
// ❌ PECADO MORTAL - Funciones inline que matan performance
<FlatList
  data={items}
  renderItem={({ item }) => ( // ← Nueva función en cada render
    <TouchableOpacity onPress={() => handlePress(item)}> {/* ← Nueva función en cada render */}
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
  keyExtractor={(item) => item.id} // ← Nueva función en cada render
/>

// ✅ CORRECTO - Funciones memoizadas
const renderItem = useCallback(({ item }) => (
  <ListItem item={item} onPress={handlePress} />
), [handlePress]);

const keyExtractor = useCallback((item) => item.id, []);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
/>
```

### 2. ❌ Nunca: Objetos o Arrays en Props Sin Memoización

```typescript
// ❌ PECADO MORTAL - Nuevo objeto en cada render
<MyComponent 
  style={{ backgroundColor: 'red', padding: 10 }} // ← Nuevo objeto siempre
  data={items.filter(item => item.visible)} // ← Nuevo array siempre
/>

// ✅ CORRECTO - Objetos y arrays memoizados
const componentStyle = useMemo(() => ({
  backgroundColor: 'red',
  padding: 10
}), []);

const visibleItems = useMemo(() => 
  items.filter(item => item.visible)
, [items]);

<MyComponent 
  style={componentStyle}
  data={visibleItems}
/>
```

### 3. ❌ Nunca: Efectos Sin Dependencias o Con Dependencias Incorrectas

```typescript
// ❌ PECADO MORTAL - Efecto que se ejecuta siempre
useEffect(() => {
  fetchData();
}); // ← Sin array de dependencias

// ❌ PECADO MORTAL - Dependencias incorrectas
useEffect(() => {
  fetchData(userId);
}, []); // ← userId no está en dependencias

// ✅ CORRECTO - Dependencias exactas
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## 🛠️ Herramientas de Monitoreo y Debug

### 1. 📊 Performance Monitor Custom

```typescript
// Hook para monitorear performance en tiempo real
const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
  
    if (__DEV__) {
      const elapsed = Date.now() - startTime.current;
      console.log(`🎯 ${componentName} - Render #${renderCount.current} (${elapsed}ms)`);
  
      // Alert si hay demasiados re-renders
      if (renderCount.current > 10 && elapsed < 1000) {
        console.warn(`⚠️ ${componentName} re-renderizando mucho!`);
      }
    }
  });
  
  useEffect(() => {
    if (__DEV__) {
      console.log(`🚀 ${componentName} montado`);
      return () => {
        console.log(`🔥 ${componentName} desmontado`);
      };
    }
  }, [componentName]);
};

// Wrapper HOC para monitoreo automático
const withPerformanceMonitor = (WrappedComponent) => {
  return React.memo((props) => {
    usePerformanceMonitor(WrappedComponent.displayName || WrappedComponent.name);
    return <WrappedComponent {...props} />;
  });
};
```

### 2. 🔍 Memory Leak Detector

```typescript
// Detector de memory leaks
const useMemoryLeakDetector = () => {
  const mountedComponents = useRef(new Set());
  
  useEffect(() => {
    const componentId = `component_${Date.now()}_${Math.random()}`;
    mountedComponents.current.add(componentId);
  
    if (__DEV__) {
      console.log(`📈 Componentes montados: ${mountedComponents.current.size}`);
  
      if (mountedComponents.current.size > 100) {
        console.warn('⚠️ Posible memory leak: demasiados componentes montados');
      }
    }
  
    return () => {
      mountedComponents.current.delete(componentId);
      if (__DEV__) {
        console.log(`📉 Componentes montados: ${mountedComponents.current.size}`);
      }
    };
  }, []);
};
```

---

## 📋 Checklist de Rendimiento

### ✅ Pre-Launch Checklist

```typescript
// Checklist automático que puedes correr antes de release
const performanceChecklist = {
  // ✅ Re-renders
  '1. Componentes con React.memo': '✓',
  '2. Funciones memoizadas con useCallback': '✓', 
  '3. Valores computados con useMemo': '✓',
  '4. Props inline eliminadas': '✓',
  
  // ✅ Listas
  '5. FlatList con getItemLayout': '✓',
  '6. Keys únicos y estables': '✓',
  '7. removeClippedSubviews habilitado': '✓',
  '8. maxToRenderPerBatch configurado': '✓',
  
  // ✅ Imágenes
  '9. FastImage implementado': '✓',
  '10. Imágenes redimensionadas al tamaño correcto': '✓',
  '11. Lazy loading para imágenes': '✓',
  '12. Placeholders mientras cargan': '✓',
  
  // ✅ Animaciones
  '13. Reanimated para animaciones complejas': '✓',
  '14. Animaciones corriendo en UI thread': '✓',
  '15. Gestures optimizados': '✓',
  
  // ✅ Memoria
  '16. Cleanup de listeners en useEffect': '✓',
  '17. Abort controllers para requests': '✓',
  '18. Límites en listas que crecen': '✓',
  '19. Monitoring de memory usage': '✓',
  
  // ✅ Bundle
  '20. Bundle analyzer ejecutado': '✓',
  '21. Dead code eliminado': '✓',
  '22. Lazy loading de pantallas': '✓',
  '23. Assets optimizados': '✓',
};

console.table(performanceChecklist);
```

---

## 🎯 Resumen y Reflexión Final

### 🏆 Los 7 Mandamientos del Rendimiento

1. **🎭 Memoiza Todo Lo Necesario**: Como un actor que solo cambia de vestuario cuando cambia de escena
2. **📊 Optimiza Tus Listas**: Como un restaurante que solo prepara lo que va a servir
3. **🖼️ Trata Las Imágenes Como Oro**: Como un fotógrafo que optimiza cada foto para su uso específico
4. **🎣 Usa Hooks Como Un Experto**: Como un pescador que mantiene sus herramientas listas
5. **🌉 Minimiza El Bridge**: Como un traductor eficiente que solo traduce lo esencial
6. **💾 Gestiona La Memoria**: Como un bibliotecario que mantiene orden y limpieza
7. **📊 Monitorea Constantemente**: Como un piloto que revisa constantemente sus instrumentos

### 🎯 Reflexión: La Mentalidad del Performance

El rendimiento en React Native no es algo que agregas al final, **es una mentalidad que adoptas desde el primer día**. Es como mantener tu casa limpia: es más fácil mantenerla ordenada día a día que hacer una limpieza general cada mes.

#### 🧠 Piensa Como Un Piloto de Fórmula 1:

1. **🔍 Observación Constante**: Siempre estás monitoreando tus instrumentos
2. **⚡ Optimización Continua**: Cada vuelta es una oportunidad de mejorar
3. **🎯 Precisión Quirúrgica**: Cada cambio debe ser intencional y medido
4. **🛠️ Mantenimiento Preventivo**: Mejor prevenir que reparar
5. **📊 Decisiones Basadas en Datos**: Los números no mienten

#### 🌟 La Fórmula Secreta:

```typescript
const performanceSuccess = (
  consistentMonitoring +
  proactiveOptimization +
  rightToolsForTheJob +
  teamEducation +
  userFocusedMindset
) * timeAndDiscipline;
```

#### 💎 Principios Eternos:

* **"Optimiza para el 80% de casos de uso"**: No todas las pantallas necesitan el mismo nivel de optimización
* **"Mide antes de optimizar"**: La intuición miente, los datos no
* **"El mejor código es el que no se ejecuta"**: Evita trabajo innecesario
* **"User Experience > Developer Experience"**: Siempre prioriza al usuario final
* **"Performance is a feature"**: No es opcional, es parte del producto

#### 🚀 El Camino del Maestro:

1. **Principiante**: "Mi app funciona"
2. **Intermedio**: "Mi app funciona rápido"
3. **Avanzado**: "Mi app funciona rápido consistentemente"
4. **Experto**: "Mi app se anticipa a las necesidades del usuario"
5. **Maestro**: "Mi app es invisible - el usuario solo ve su contenido"

### 🏁 Tu Próximo Sprint:

Esta semana, audita una pantalla de tu app usando esta guía. Identifica 3 optimizaciones que puedes implementar. La próxima semana, implementa 1. La semana siguiente, mide el impacto.

**Recuerda**: Una app rápida no se construye en un día, pero tampoco necesitas esperar meses para ver mejoras. Cada optimización cuenta, cada milisegundo importa, y cada usuario lo notará.

¡Tu app merece ser una máquina de Fórmula 1, no un auto viejo! 🏎️💨

---

**"En React Native, la performance no es un destino, es un viaje. Y como todo viaje épico, se disfruta más cuando sabes exactamente dónde vas y cómo llegar."** 🎯✨
