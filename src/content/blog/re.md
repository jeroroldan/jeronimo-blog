---
title: 'Principales de React Native con Expo'
code: 'react-native'
description: 'asterclass: APIs Principales de React Native con Expo'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Masterclass: APIs Principales de React Native con Expo

## Introducción

React Native con Expo es una plataforma poderosa para desarrollar aplicaciones móviles multiplataforma. Esta guía cubre las APIs más importantes con ejemplos prácticos que puedes implementar inmediatamente.

## 1. Configuración y Componentes Básicos

### Instalación y Setup
```bash
# Instalar Expo CLI
npm install -g @expo/cli

# Crear nuevo proyecto
npx create-expo-app MiApp
cd MiApp

# Ejecutar en desarrollo
npx expo start
```

### Componente Base
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi App React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

## 2. API de Navegación (React Navigation)

### Instalación
```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

### Navegación Stack Básica
```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Pantalla Principal</Text>
      <Button
        title="Ir a Detalles"
        onPress={() => navigation.navigate('Details', { userId: 123 })}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { userId } = route.params;
  
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Detalles</Text>
      <Text>ID del Usuario: {userId}</Text>
      <Button
        title="Volver"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{ title: 'Detalles del Usuario' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
```

### Navegación por Tabs
```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <View style={styles.screen}>
      <Text>Tab de Inicio</Text>
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={styles.screen}>
      <Text>Tab de Perfil</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Profile" component={ProfileTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

## 3. API de Estado (useState, useEffect, Context)

### Manejo de Estado Local
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  // useEffect para efectos secundarios
  useEffect(() => {
    console.log(`El contador cambió a: ${count}`);
  }, [count]);

  // useEffect para cargar datos al montar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data.slice(0, 3)); // Solo los primeros 3
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador: {count}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={() => setCount(count + 1)} />
        <Button title="-" onPress={() => setCount(count - 1)} />
        <Button title="Reset" onPress={() => setCount(0)} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
      />
      <Text>Hola, {name}</Text>

      <Text style={styles.subtitle}>Usuarios:</Text>
      {users.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
```

### Context API para Estado Global
```jsx
import React, { createContext, useContext, useReducer } from 'react';

// Crear contexto
const AppContext = createContext();

// Reducer para manejar acciones
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}

// Componente que usa el contexto
function UserProfile() {
  const { state, dispatch } = useApp();

  const handleLogin = () => {
    dispatch({
      type: 'SET_USER',
      payload: { id: 1, name: 'Juan Pérez', email: 'juan@email.com' }
    });
  };

  return (
    <View style={styles.container}>
      {state.user ? (
        <>
          <Text>Bienvenido, {state.user.name}</Text>
          <Button 
            title="Cerrar Sesión" 
            onPress={() => dispatch({ type: 'LOGOUT' })} 
          />
        </>
      ) : (
        <Button title="Iniciar Sesión" onPress={handleLogin} />
      )}
    </View>
  );
}
```

## 4. API de AsyncStorage (Almacenamiento Local)

### Instalación
```bash
npx expo install @react-native-async-storage/async-storage
```

### Implementación
```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function StorageExample() {
  const [data, setData] = useState('');
  const [savedData, setSavedData] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('userData', data);
      Alert.alert('Éxito', 'Datos guardados correctamente');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos');
    }
  };

  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData');
      if (value !== null) {
        setSavedData(value);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setSavedData('');
      Alert.alert('Éxito', 'Datos eliminados');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron eliminar los datos');
    }
  };

  // Guardar objetos complejos
  const saveUserProfile = async (userProfile) => {
    try {
      const jsonValue = JSON.stringify(userProfile);
      await AsyncStorage.setItem('userProfile', jsonValue);
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userProfile');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Example</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ingresa datos para guardar"
        value={data}
        onChangeText={setData}
      />
      
      <Button title="Guardar Datos" onPress={saveData} />
      
      <Text style={styles.subtitle}>Datos Guardados:</Text>
      <Text>{savedData}</Text>
      
      <Button title="Limpiar Datos" onPress={clearData} />
    </View>
  );
}
```

## 5. API de Cámara y Galería (expo-image-picker)

### Instalación
```bash
npx expo install expo-image-picker
```

### Implementación
```jsx
import React, { useState } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos permisos para acceder a la galería');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos permisos para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selector de Imágenes</Text>
      
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Seleccionar de Galería" onPress={pickImageFromGallery} />
        <Button title="Tomar Foto" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 10,
  },
});
```

## 6. API de Ubicación (expo-location)

### Instalación
```bash
npx expo install expo-location
```

### Implementación
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function LocationExample() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permiso de ubicación denegado');
      return;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
      
      // Obtener dirección desde coordenadas
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (reverseGeocode.length > 0) {
        setAddress(reverseGeocode[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const watchLocation = () => {
    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        setLocation(location);
      }
    );
    
    return subscription;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ubicación</Text>
      
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      
      {location && (
        <View style={styles.locationInfo}>
          <Text>Latitud: {location.coords.latitude}</Text>
          <Text>Longitud: {location.coords.longitude}</Text>
          <Text>Altitud: {location.coords.altitude}m</Text>
          <Text>Precisión: {location.coords.accuracy}m</Text>
        </View>
      )}
      
      {address && (
        <View style={styles.addressInfo}>
          <Text>Dirección:</Text>
          <Text>{address.street} {address.streetNumber}</Text>
          <Text>{address.city}, {address.region}</Text>
          <Text>{address.country} {address.postalCode}</Text>
        </View>
      )}
      
      <Button title="Obtener Ubicación" onPress={getCurrentLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  locationInfo: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addressInfo: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
});
```

## 7. API de Notificaciones (expo-notifications)

### Instalación
```bash
npx expo install expo-notifications expo-device expo-constants
```

### Implementación
```jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configurar como se manejan las notificaciones cuando la app está activa
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationExample() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Escuchar notificaciones recibidas
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Escuchar respuestas a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('¡Falló al obtener el token push para notificaciones push!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })).data;
    } else {
      alert('Debe usar un dispositivo físico para notificaciones Push');
    }

    return token;
  };

  const sendPushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Notificación Local!",
        body: 'Esta es una notificación programada localmente',
        data: { data: 'va aquí' },
      },
      trigger: { seconds: 2 },
    });
  };

  const sendImmediateNotification = async () => {
    await Notifications.presentNotificationAsync({
      title: "Notificación Inmediata",
      body: "Esta notificación se muestra inmediatamente",
      data: { screen: 'home' },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      
      <Text>Tu token Expo Push:</Text>
      <Text style={styles.token}>{expoPushToken}</Text>
      
      <Button
        title="Enviar Notificación en 2 segundos"
        onPress={sendPushNotification}
      />
      
      <Button
        title="Enviar Notificación Inmediata"
        onPress={sendImmediateNotification}
      />
      
      {notification && (
        <View style={styles.notificationInfo}>
          <Text>Última notificación:</Text>
          <Text>{notification.request.content.title}</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  token: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  notificationInfo: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
});
```

## 8. API de Sensores (expo-sensors)

### Instalación
```bash
npx expo install expo-sensors
```

### Implementación - Acelerómetro y Giroscopio
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';

export default function SensorsExample() {
  const [accelerometerData, setAccelerometerData] = useState({});
  const [gyroscopeData, setGyroscopeData] = useState({});
  const [magnetometerData, setMagnetometerData] = useState({});

  useEffect(() => {
    // Configurar acelerómetro
    Accelerometer.setUpdateInterval(1000); // 1 segundo
    const accelerometerSubscription = Accelerometer.addListener(setAccelerometerData);

    // Configurar giroscopio
    Gyroscope.setUpdateInterval(1000);
    const gyroscopeSubscription = Gyroscope.addListener(setGyroscopeData);

    // Configurar magnetómetro
    Magnetometer.setUpdateInterval(1000);
    const magnetometerSubscription = Magnetometer.addListener(setMagnetometerData);

    return () => {
      accelerometerSubscription && accelerometerSubscription.remove();
      gyroscopeSubscription && gyroscopeSubscription.remove();
      magnetometerSubscription && magnetometerSubscription.remove();
    };
  }, []);

  const round = (n) => {
    if (!n) return 0;
    return Math.floor(n * 100) / 100;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores del Dispositivo</Text>
      
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>Acelerómetro</Text>
        <Text>x: {round(accelerometerData.x)}</Text>
        <Text>y: {round(accelerometerData.y)}</Text>
        <Text>z: {round(accelerometerData.z)}</Text>
      </View>

      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>Giroscopio</Text>
        <Text>x: {round(gyroscopeData.x)}</Text>
        <Text>y: {round(gyroscopeData.y)}</Text>
        <Text>z: {round(gyroscopeData.z)}</Text>
      </View>

      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>Magnetómetro</Text>
        <Text>x: {round(magnetometerData.x)}</Text>
        <Text>y: {round(magnetometerData.y)}</Text>
        <Text>z: {round(magnetometerData.z)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sensorCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sensorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
```

## 9. API de Audio (expo-av)

### Instalación
```bash
npx expo install expo-av
```

### Implementación
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioExample() {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Reproducir audio desde URL
  async function playSound() {
    console.log('Cargando sonido');
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }
    );
    setSound(sound);

    console.log('Reproduciendo sonido');
    await sound.playAsync();
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  }

  // Pausar audio
  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  // Reanudar audio
  async function resumeSound() {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  // Iniciar grabación
  async function startRecording() {
    try {
      console.log('Solicitando permisos...');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Iniciando grabación...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Grabación iniciada');
    } catch (err) {
      console.error('Error al iniciar la grabación', err);
    }
  }

  // Detener grabación
  async function stopRecording() {
    console.log('Deteniendo grabación...');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Grabación guardada en', uri);
    
    // Reproducir la grabación
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    Alert.alert('Grabación completa', '¿Quieres reproducir la grabación?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reproducir', onPress: () => sound.playAsync() },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Player & Recorder</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Reproducir Audio</Text>
        <Button title="Reproducir Sonido Online" onPress={playSound} />
        {isPlaying && (
          <Button title="Pausar" onPress={pauseSound} />
        )}
        {!isPlaying && sound && (
          <Button title="Reanudar" onPress={resumeSound} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Grabación de Audio</Text>
        <Button
          title={recording ? 'Detener Grabación' : 'Iniciar Grabación'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
});
```

## 10. API de Conectividad (expo-network)

### Instalación
```bash
npx expo install expo-network
```

### Implementación
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Network from 'expo-network';

export default function NetworkExample() {
  const [networkState, setNetworkState] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    checkNetworkState();
    getIpAddress();
  }, []);

  const checkNetworkState = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setNetworkState(networkState);
    } catch (error) {
      console.error('Error al obtener estado de red:', error);
    }
  };

  const getIpAddress = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      setIpAddress(ip);
    } catch (error) {
      console.error('Error al obtener IP:', error);
    }
  };

  const testInternetConnection = async () => {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        timeout: 5000,
      });
      
      if (response.ok) {
        Alert.alert('Conexión exitosa', 'Internet está funcionando correctamente');
      } else {
        Alert.alert('Sin conexión', 'No hay acceso a internet');
      }
    } catch (error) {
      Alert.alert('Error de conexión', 'No se pudo conectar a internet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Conectividad</Text>
      
      {networkState && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Estado de Red:</Text>
          <Text>Conectado: {networkState.isConnected ? 'Sí' : 'No'}</Text>
          <Text>Internet: {networkState.isInternetReachable ? 'Disponible' : 'No disponible'}</Text>
          <Text>Tipo: {networkState.type}</Text>
        </View>
      )}

      {ipAddress && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Dirección IP:</Text>
          <Text>{ipAddress}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Verificar Estado de Red" onPress={checkNetworkState} />
        <Button title="Probar Conexión a Internet" onPress={testInternetConnection} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 10,
  },
});
```

## 11. API de Compartir (expo-sharing)

### Instalación
```bash
npx expo install expo-sharing expo-file-system
```

### Implementación
```jsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function SharingExample() {
  const [textToShare, setTextToShare] = useState('¡Hola desde mi app React Native!');

  const shareText = async () => {
    try {
      // Crear un archivo temporal con el texto
      const fileUri = FileSystem.documentDirectory + 'shared-text.txt';
      await FileSystem.writeAsStringAsync(fileUri, textToShare);
      
      // Compartir el archivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Compartir texto',
        });
      } else {
        Alert.alert('Error', 'Compartir no está disponible en este dispositivo');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el contenido');
    }
  };

  const shareUrl = async () => {
    try {
      const url = 'https://expo.dev';
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(url);
      } else {
        Alert.alert('Error', 'Compartir no está disponible');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir la URL');
    }
  };

  const createAndShareJson = async () => {
    try {
      const data = {
        usuario: 'Juan Pérez',
        fecha: new Date().toISOString(),
        mensaje: textToShare,
      };

      const fileUri = FileSystem.documentDirectory + 'datos.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Compartir datos JSON',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear y compartir el archivo JSON');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compartir Contenido</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Texto para compartir"
        value={textToShare}
        onChangeText={setTextToShare}
        multiline
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Compartir Texto" onPress={shareText} />
        <Button title="Compartir URL de Expo" onPress={shareUrl} />
        <Button title="Compartir Archivo JSON" onPress={createAndShareJson} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    gap: 10,
  },
});
```

## 12. API de Calendarios (expo-calendar)

### Instalación
```bash
npx expo install expo-calendar
```

### Implementación
```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function CalendarExample() {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    requestCalendarPermissions();
  }, []);

  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      getCalendars();
    } else {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso al calendario');
    }
  };

  const getCalendars = async () => {
    try {
      const calendarList = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      setCalendars(calendarList);
    } catch (error) {
      console.error('Error al obtener calendarios:', error);
    }
  };

  const createEvent = async () => {
    try {
      if (calendars.length === 0) {
        Alert.alert('Error', 'No hay calendarios disponibles');
        return;
      }

      const eventDetails = {
        title: 'Evento desde mi App',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hora después
        location: 'Mi ubicación',
        notes: 'Este evento fue creado desde React Native',
        alarms: [{ relativeOffset: -15 }], // Alarma 15 minutos antes
      };

      const eventId = await Calendar.createEventAsync(calendars[0].id, eventDetails);
      Alert.alert('Éxito', `Evento creado con ID: ${eventId}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el evento');
    }
  };

  const getUpcomingEvents = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Próximos 7 días

      const eventList = await Calendar.getEventsAsync(
        calendars.map(cal => cal.id),
        startDate,
        endDate
      );
      
      setEvents(eventList.slice(0, 5)); // Solo los primeros 5 eventos
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener los eventos');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Integración con Calendario</Text>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Calendarios Disponibles:</Text>
        {calendars.map(calendar => (
          <View key={calendar.id} style={styles.calendarItem}>
            <Text style={styles.calendarTitle}>{calendar.title}</Text>
            <Text style={styles.calendarSource}>{calendar.source.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Crear Evento de Prueba" onPress={createEvent} />
        <Button title="Ver Próximos Eventos" onPress={getUpcomingEvents} />
      </View>

      {events.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Próximos Eventos:</Text>
          {events.map(event => (
            <View key={event.id} style={styles.eventItem}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>
                {new Date(event.startDate).toLocaleDateString()}
              </Text>
              {event.location && (
                <Text style={styles.eventLocation}>{event.location}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendarItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarSource: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  eventItem: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
  },
  eventLocation: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});
```

## 13. API de Performance y Optimización

### Optimización con React.memo y useMemo
```jsx
import React, { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

// Componente optimizado con memo
const ExpensiveListItem = memo(({ item, onPress }) => {
  // Simular procesamiento costoso
  const expensiveValue = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000; i++) {
      result += Math.random();
    }
    return result.toFixed(2);
  }, [item.id]);

  return (
    <View style={styles.listItem}>
      <Text>{item.name}</Text>
      <Text>Valor procesado: {expensiveValue}</Text>
      <Button title="Seleccionar" onPress={() => onPress(item.id)} />
    </View>
  );
});

export default function PerformanceExample() {
  const [count, setCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Datos que no cambian frecuentemente
  const expensiveData = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      value: Math.random() * 100,
    }));
  }, []); // Solo se calcula una vez

  // Función optimizada con useCallback
  const handleItemPress = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Datos filtrados optimizados
  const filteredData = useMemo(() => {
    return expensiveData.filter(item => 
      count === 0 || item.value > count
    );
  }, [expensiveData, count]);

  const renderItem = useCallback(({ item }) => (
    <ExpensiveListItem 
      item={item} 
      onPress={handleItemPress}
    />
  ), [handleItemPress]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Optimización de Performance</Text>
      
      <View style={styles.controls}>
        <Text>Filtro: {count}</Text>
        <Button 
          title="Incrementar Filtro" 
          onPress={() => setCount(c => c + 10)} 
        />
        <Button 
          title="Reset" 
          onPress={() => setCount(0)} 
        />
        <Text>Items seleccionados: {selectedItems.size}</Text>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  controls: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
```

## 14. Patrones Avanzados y Best Practices

### Custom Hooks
```jsx
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook personalizado para manejo de datos persistentes
export function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error loading stored value:', error);
    } finally {
      setLoading(false);
    }
  };

  const setValue = useCallback(async (value) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing value:', error);
    }
  }, [key]);

  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing value:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, loading];
}

// Hook para manejo de API calls
export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Ejemplo de uso de los hooks personalizados
import React, { useState } from 'react';
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native';

export default function CustomHooksExample() {
  const [userPreferences, setUserPreferences, clearPreferences, prefLoading] = 
    useAsyncStorage('userPreferences', { theme: 'light', language: 'es' });
  
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const { data: apiData, loading: apiLoading, error: apiError, refetch } = useApi(apiUrl);

  const updateTheme = () => {
    setUserPreferences({
      ...userPreferences,
      theme: userPreferences.theme === 'light' ? 'dark' : 'light'
    });
  };

  if (prefLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando preferencias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Hooks Example</Text>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Preferencias del Usuario:</Text>
        <Text>Tema: {userPreferences.theme}</Text>
        <Text>Idioma: {userPreferences.language}</Text>
        <Button title="Cambiar Tema" onPress={updateTheme} />
        <Button title="Limpiar Preferencias" onPress={clearPreferences} />
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>API Data:</Text>
        {apiLoading && <ActivityIndicator />}
        {apiError && <Text style={styles.error}>Error: {apiError}</Text>}
        {apiData && (
          <View>
            <Text>Título: {apiData.title}</Text>
            <Text numberOfLines={3}>Contenido: {apiData.body}</Text>
          </View>
        )}
        <Button title="Recargar Datos" onPress={refetch} />
      </View>
    </View>
  );
}
```

## 15. Testing en React Native

### Jest y Testing Library
```jsx
// __tests__/LoginScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });

  test('shows error for invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const submitButton = getByText('Iniciar Sesión');
    
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Por favor ingresa un email válido'
      );
    });
  });

  test('calls login function with correct credentials', async () => {
    const mockLogin = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockLogin} />
    );
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Contraseña');
    const submitButton = getByText('Iniciar Sesión');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});

// utils/testUtils.js - Utilidades para testing
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Wrapper para componentes que usan navegación
export function renderWithNavigation(component) {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
}

// Mock para componentes que usan Context
export const MockContextProvider = ({ children, value }) => (
  <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
);
```

## Conclusión y Recursos Adicionales

Esta masterclass cubre las APIs más importantes de React Native con Expo. Para continuar tu aprendizaje:

### Próximos Pasos:
1. **Práctica**: Implementa cada ejemplo en tu propio proyecto
2. **Combine APIs**: Crea aplicaciones que usen múltiples APIs juntas
3. **Performance**: Profundiza en optimización y debugging
4. **Testing**: Implementa tests para tus componentes
5. **Deployment**: Aprende sobre publicación en stores

### Recursos Recomendados:
- [Documentación Oficial de Expo](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Testing Library React Native](https://testing-library.com/docs/react-native-testing-library/intro/)

### Bibliotecas Adicionales Útiles:
- **UI Libraries**: NativeBase, React Native Elements, Tamagui
- **State Management**: Redux Toolkit, Zustand, Jotai
- **Forms**: React Hook Form, Formik
- **Animation**: React Native Reanimated, Lottie
- **Charts**: Victory Native, React Native Chart Kit

¡Felicitaciones por completar esta masterclass! Ahora tienes una base sólida para crear aplicaciones móviles profesionales con React Native y Expo.