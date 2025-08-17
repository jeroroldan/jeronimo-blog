---
title: 'APIs Principales de React'
code: 'react-native'
description: 'Masterclass: APIs Principales de React Native'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass: APIs Principales de React Native

## 1. LAYOUT Y DIMENSIONES

### Dimensions API
```javascript
import { Dimensions } from 'react-native';

// Obtener dimensiones de pantalla
const { width, height } = Dimensions.get('window');
const screenData = Dimensions.get('screen');

// Listener para cambios de orientación
const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
  console.log('Nueva dimensión:', window.width, window.height);
});

// Limpiar listener
subscription?.remove();
```

### useWindowDimensions Hook (Recomendado)
```javascript
import { useWindowDimensions } from 'react-native';

const MyComponent = () => {
  const { width, height, scale, fontScale } = useWindowDimensions();
  
  return (
    <View style={{ width: width * 0.8, height: height * 0.5 }}>
      <Text>Ancho: {width}px</Text>
    </View>
  );
};
```

## 2. NAVEGACIÓN Y LINKING

### Linking API
```javascript
import { Linking, Alert } from 'react-native';

// Abrir URL externa
const openURL = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Error', 'No se puede abrir esta URL');
  }
};

// Deep linking - Escuchar URLs entrantes
useEffect(() => {
  const getInitialURL = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      handleDeepLink(initialUrl);
    }
  };

  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  getInitialURL();
  return () => subscription?.remove();
}, []);

// Ejemplos de uso
openURL('https://google.com');
openURL('tel:+1234567890');
openURL('mailto:test@example.com');
openURL('geo:37.484847,-122.148386');
```

## 3. ESTADO DE LA APLICACIÓN

### AppState API
```javascript
import { AppState } from 'react-native';

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App volvió al foreground');
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState]);

  // Estados: 'active', 'background', 'inactive'
  return <Text>Estado actual: {appState}</Text>;
};
```

## 4. INFORMACIÓN DEL DISPOSITIVO

### DeviceInfo (usando react-native-device-info)
```javascript
import DeviceInfo from 'react-native-device-info';

// Información básica del dispositivo
const getDeviceInfo = async () => {
  const brand = DeviceInfo.getBrand();
  const model = DeviceInfo.getModel();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const uniqueId = await DeviceInfo.getUniqueId();
  const isEmulator = await DeviceInfo.isEmulator();
  
  return {
    brand,
    model,
    systemName,
    systemVersion,
    uniqueId,
    isEmulator
  };
};
```

## 5. PLATAFORMA Y UTILIDADES

### Platform API
```javascript
import { Platform } from 'react-native';

// Detección de plataforma
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
        shadowOffset: { width: 2, height: 2 },
      },
      android: {
        backgroundColor: 'blue',
        elevation: 5,
      },
    }),
  },
});

// Versión específica
if (Platform.OS === 'android' && Platform.Version >= 23) {
  // Android API 23+
}

// Constantes útiles
console.log(Platform.OS); // 'ios' | 'android'
console.log(Platform.Version); // Número de versión
console.log(Platform.isPad); // Solo iOS
console.log(Platform.isTV); // Para TV
```

## 6. PERMISOS

### PermissionsAndroid (Android)
```javascript
import { PermissionsAndroid } from 'react-native';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permiso de Cámara',
        message: 'La app necesita acceso a tu cámara',
        buttonNeutral: 'Preguntar después',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permiso concedido');
    } else {
      console.log('Permiso denegado');
    }
  } catch (err) {
    console.warn(err);
  }
};

// Múltiples permisos
const requestMultiplePermissions = async () => {
  const permissions = [
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ];

  const granted = await PermissionsAndroid.requestMultiple(permissions);
  
  return {
    camera: granted['android.permission.CAMERA'] === 'granted',
    audio: granted['android.permission.RECORD_AUDIO'] === 'granted',
    storage: granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted',
  };
};
```

## 7. VIBRACIÓN Y FEEDBACK HÁPTICO

### Vibration API
```javascript
import { Vibration } from 'react-native';

// Vibración simple
Vibration.vibrate();

// Patrón de vibración [pausa, vibra, pausa, vibra...]
Vibration.vibrate([0, 500, 200, 500]);

// Vibración continua (solo Android)
Vibration.vibrate(1000); // 1 segundo

// Cancelar vibración
Vibration.cancel();
```

## 8. SHARE API

### Compartir contenido
```javascript
import { Share } from 'react-native';

const shareContent = async () => {
  try {
    const result = await Share.share({
      message: 'Mira esta app increíble!',
      url: 'https://myapp.com', // Solo iOS
      title: 'Mi App', // Solo Android
    }, {
      // Opciones adicionales
      dialogTitle: 'Compartir con...', // Solo Android
      subject: 'Asunto del email', // Para email
      tintColor: '#ff0000', // Solo iOS
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Compartido via:', result.activityType);
      } else {
        console.log('Compartido exitosamente');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Compartir cancelado');
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Compartir archivo (requiere URI local)
const shareFile = async () => {
  const result = await Share.share({
    url: 'file:///path/to/file.pdf',
    title: 'Mi documento',
  });
};
```

## 9. CLIPBOARD API

### Portapapeles
```javascript
import Clipboard from '@react-native-clipboard/clipboard';

// Copiar texto
const copyToClipboard = (text) => {
  Clipboard.setString(text);
  Alert.alert('Copiado', 'Texto copiado al portapapeles');
};

// Leer del portapapeles
const readFromClipboard = async () => {
  const text = await Clipboard.getString();
  console.log('Contenido del portapapeles:', text);
  return text;
};

// Verificar si hay contenido
const checkClipboard = async () => {
  const hasContent = await Clipboard.hasString();
  if (hasContent) {
    const content = await Clipboard.getString();
    return content;
  }
  return null;
};
```

## 10. ALERT Y TOASTS

### Alert API
```javascript
import { Alert } from 'react-native';

// Alert simple
Alert.alert('Título', 'Mensaje');

// Alert con botones
Alert.alert(
  'Confirmar',
  '¿Estás seguro de eliminar?',
  [
    { text: 'Cancelar', style: 'cancel' },
    { 
      text: 'Eliminar', 
      style: 'destructive',
      onPress: () => console.log('Eliminado')
    },
  ],
  { cancelable: false }
);

// Prompt (solo iOS)
Alert.prompt(
  'Ingresa tu nombre',
  'Por favor ingresa tu nombre completo',
  [
    { text: 'Cancelar', style: 'cancel' },
    { 
      text: 'OK', 
      onPress: (text) => console.log('Nombre:', text)
    },
  ],
  'plain-text',
  'Nombre por defecto'
);
```

## 11. TECLADO

### Keyboard API
```javascript
import { Keyboard } from 'react-native';

const MyComponent = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      console.log('Teclado mostrado');
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      console.log('Teclado oculto');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={{ paddingBottom: keyboardHeight }}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View>
          <TextInput placeholder="Escribe aquí..." />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
```

## 12. PICKER (SELECTOR)

### Picker Component
```javascript
import { Picker } from '@react-native-picker/picker';

const MyPicker = () => {
  const [selectedValue, setSelectedValue] = useState('javascript');

  return (
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: 150 }}
      onValueChange={(itemValue) => setSelectedValue(itemValue)}
    >
      <Picker.Item label="JavaScript" value="javascript" />
      <Picker.Item label="Python" value="python" />
      <Picker.Item label="Java" value="java" />
      <Picker.Item label="C++" value="cpp" />
    </Picker>
  );
};
```

## 13. STORAGE LOCAL

### AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar datos
const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error guardando datos:', e);
  }
};

// Leer datos
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error leyendo datos:', e);
  }
};

// Eliminar datos
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error eliminando datos:', e);
  }
};

// Obtener todas las claves
const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.error('Error obteniendo claves:', e);
  }
};

// Limpiar todo el storage
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Error limpiando storage:', e);
  }
};
```

## 14. NETWORKING

### Fetch API y Network Info
```javascript
import NetInfo from '@react-native-netinfo';

// Verificar estado de conexión
const checkConnection = async () => {
  const state = await NetInfo.fetch();
  
  console.log('Conectado:', state.isConnected);
  console.log('Tipo de conexión:', state.type);
  console.log('Detalles:', state.details);
  
  return {
    isConnected: state.isConnected,
    type: state.type, // wifi, cellular, bluetooth, ethernet, etc.
    isWifiEnabled: state.isWifiEnabled,
    details: state.details
  };
};

// Listener para cambios de conexión
const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, connectionType };
};

// Fetch con timeout y manejo de errores
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};
```

## 15. GEOLOCALIZACIÓN

### Geolocation API
```javascript
import Geolocation from '@react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

// Solicitar permisos de ubicación
const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS maneja permisos automáticamente
};

// Obtener ubicación actual
const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();
  
  if (!hasPermission) {
    throw new Error('Permisos de ubicación denegados');
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

// Observar cambios de ubicación
const watchLocation = (callback) => {
  return Geolocation.watchPosition(
    callback,
    (error) => console.error('Error ubicación:', error),
    {
      enableHighAccuracy: true,
      distanceFilter: 10, // metros
      interval: 5000, // milisegundos
      fastestInterval: 2000,
    }
  );
};

// Usar en componente
const LocationComponent = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const watchId = watchLocation((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });

    return () => Geolocation.clearWatch(watchId);
  }, []);

  const getLocation = async () => {
    try {
      const position = await getCurrentLocation();
      setLocation(position);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Button title="Obtener Ubicación" onPress={getLocation} />
      {location && (
        <Text>
          Lat: {location.latitude}, Lng: {location.longitude}
        </Text>
      )}
    </View>
  );
};
```

## 16. CAMERA Y GALERÍA

### ImagePicker (react-native-image-picker)
```javascript
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';

const ImagePickerComponent = () => {
  const [imageUri, setImageUri] = useState(null);

  const options = {
    mediaType: 'photo' as MediaType,
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  };

  const openCamera = () => {
    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        console.log('Camera cancelled or error');
        return;
      }
      
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        console.log('Gallery cancelled or error');
        return;
      }
      
      if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const showImagePicker = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        { text: 'Cámara', onPress: openCamera },
        { text: 'Galería', onPress: openGallery },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <View>
      <Button title="Seleccionar Imagen" onPress={showImagePicker} />
      {imageUri && (
        <Image 
          source={{ uri: imageUri }} 
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
    </View>
  );
};
```

## 17. NOTIFICACIONES PUSH

### Push Notifications Setup
```javascript
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-push-notification-ios/push-notification-ios';

// Configuración inicial
const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
      // Enviar token al servidor
    },

    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      
      if (notification.userInteraction) {
        // Usuario tocó la notificación
        handleNotificationTap(notification);
      }
      
      // Solo iOS
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
};

// Notificación local
const scheduleLocalNotification = () => {
  PushNotification.localNotification({
    title: 'Mi App',
    message: 'Esta es una notificación local!',
    date: new Date(Date.now() + 5000), // 5 segundos
    allowWhileIdle: false,
  });
};

// Notificación programada
const scheduleRepeatingNotification = () => {
  PushNotification.localNotificationSchedule({
    title: 'Recordatorio diario',
    message: 'No olvides revisar la app!',
    date: new Date(Date.now() + 10000),
    repeatType: 'day', // 'week', 'day', 'hour', 'minute', 'time'
  });
};

// Cancelar notificaciones
const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

// Obtener badge count (iOS)
const getBadgeCount = () => {
  PushNotificationIOS.getApplicationIconBadgeNumber((number) => {
    console.log('Badge count:', number);
  });
};

// Configurar badge (iOS)
const setBadgeCount = (count) => {
  PushNotificationIOS.setApplicationIconBadgeNumber(count);
};
```

## 18. MEJORES PRÁCTICAS Y PATTERNS

### Custom Hooks Útiles
```javascript
// Hook para manejo de API calls
const useAPI = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Hook para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para previous value
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
```

### Context Pattern para Estado Global
```javascript
// AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authenticateUser(email, password);
      setUser(response.user);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

## CONSEJOS FINALES

1. **Performance**: Usa `useMemo`, `useCallback` y `React.memo` para optimizar re-renders
2. **Testing**: Implementa tests con Jest y React Native Testing Library
3. **Type Safety**: Considera usar TypeScript para mejor desarrollo
4. **Error Boundaries**: Implementa manejo de errores global
5. **Code Splitting**: Usa lazy loading para componentes pesados
6. **Debugging**: Utiliza Flipper o React Native Debugger
7. **Security**: Nunca hardcodees API keys, usa react-native-keychain para datos sensibles
8. **Updates**: Mantente actualizado con las versiones de React Native y sus dependencias

Esta masterclass cubre las APIs más importantes que usarás día a día en React Native. Cada sección incluye código funcional que puedes implementar directamente en tus proyectos.