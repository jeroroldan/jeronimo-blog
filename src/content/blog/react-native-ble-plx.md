---
title: 'react-native-ble-plx'
description: 'Guía Completa de react-native-ble-plx'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de react-native-ble-plx

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Conceptos Básicos de BLE](#conceptos-básicos-de-ble)
4. [API Principal](#api-principal)
5. [Funciones Principales](#funciones-principales)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Buenas Prácticas](#buenas-prácticas)
8. [Simulación de Beacons](#simulación-de-beacons)
9. [Casos de Uso Comunes](#casos-de-uso-comunes)
10. [Troubleshooting](#troubleshooting)

## Introducción

`react-native-ble-plx` es una librería de React Native que proporciona una interfaz JavaScript para interactuar con dispositivos Bluetooth Low Energy (BLE). Es la implementación más robusta y completa para BLE en React Native.

### Características principales

- Escaneo de dispositivos BLE
- Conexión y desconexión de dispositivos
- Lectura y escritura de características
- Notificaciones de características
- Gestión de servicios BLE
- Soporte para beacons
- Compatible con iOS y Android

## Instalación y Configuración

### Instalación

```bash
npm install react-native-ble-plx
# o
yarn add react-native-ble-plx
```

### Configuración iOS

Agrega los permisos necesarios en `ios/YourProject/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Esta app necesita acceso a Bluetooth para conectarse con dispositivos BLE</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>Esta app necesita acceso a Bluetooth para conectarse con dispositivos BLE</string>
```

### Configuración Android

Agrega los permisos en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
```

## Conceptos Básicos de BLE

### Terminología

- **Peripheral**: Dispositivo que anuncia sus servicios
- **Central**: Dispositivo que escanea y se conecta a peripherals
- **Service**: Colección de características relacionadas
- **Characteristic**: Punto de datos que puede ser leído, escrito o notificado
- **UUID**: Identificador único universal para servicios y características

## API Principal

### BleManager

La clase principal para gestionar operaciones BLE:

```javascript
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();
```

## Funciones Principales

### 1. Inicialización y Estado

#### `state()`

Obtiene el estado actual del Bluetooth.

```javascript
const checkBluetoothState = async () => {
  const state = await manager.state();
  console.log('Estado Bluetooth:', state);
  // Posibles estados: Unknown, Resetting, Unsupported, Unauthorized, PoweredOff, PoweredOn
};
```

#### `onStateChange()`

Escucha cambios en el estado del Bluetooth.

```javascript
const subscription = manager.onStateChange((state) => {
  console.log('Bluetooth state changed:', state);
  if (state === 'PoweredOn') {
    startScanning();
  }
}, true); // true para obtener el estado inicial
```

### 2. Escaneo de Dispositivos

#### `startDeviceScan()`

Inicia el escaneo de dispositivos BLE.

```javascript
const startScanning = () => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error('Error al escanear:', error);
      return;
    }
  
    if (device) {
      console.log('Dispositivo encontrado:', device.name, device.id);
    }
  });
};
```

#### `stopDeviceScan()`

Detiene el escaneo de dispositivos.

```javascript
const stopScanning = () => {
  manager.stopDeviceScan();
};
```

### 3. Conexión de Dispositivos

#### `connectToDevice()`

Se conecta a un dispositivo específico.

```javascript
const connectToDevice = async (deviceId) => {
  try {
    const device = await manager.connectToDevice(deviceId);
    console.log('Conectado a:', device.name);
    return device;
  } catch (error) {
    console.error('Error al conectar:', error);
  }
};
```

#### `isDeviceConnected()`

Verifica si un dispositivo está conectado.

```javascript
const checkConnection = async (deviceId) => {
  const isConnected = await manager.isDeviceConnected(deviceId);
  console.log('¿Está conectado?', isConnected);
};
```

### 4. Descubrimiento de Servicios

#### `discoverAllServicesAndCharacteristics()`

Descubre todos los servicios y características de un dispositivo.

```javascript
const discoverServices = async (device) => {
  try {
    const deviceWithServices = await device.discoverAllServicesAndCharacteristics();
    const services = await deviceWithServices.services();
  
    for (const service of services) {
      console.log('Servicio:', service.uuid);
      const characteristics = await service.characteristics();
    
      for (const characteristic of characteristics) {
        console.log('Característica:', characteristic.uuid);
      }
    }
  } catch (error) {
    console.error('Error al descubrir servicios:', error);
  }
};
```

### 5. Lectura y Escritura

#### `readCharacteristicForDevice()`

Lee una característica específica.

```javascript
const readCharacteristic = async (deviceId, serviceUUID, characteristicUUID) => {
  try {
    const characteristic = await manager.readCharacteristicForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID
    );
  
    const value = characteristic.value;
    // Decodificar base64 a string
    const decodedValue = Buffer.from(value, 'base64').toString('utf-8');
    console.log('Valor leído:', decodedValue);
  } catch (error) {
    console.error('Error al leer:', error);
  }
};
```

#### `writeCharacteristicWithResponseForDevice()`

Escribe en una característica con respuesta.

```javascript
const writeCharacteristic = async (deviceId, serviceUUID, characteristicUUID, data) => {
  try {
    // Codificar string a base64
    const encodedData = Buffer.from(data, 'utf-8').toString('base64');
  
    const characteristic = await manager.writeCharacteristicWithResponseForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      encodedData
    );
  
    console.log('Escritura exitosa');
  } catch (error) {
    console.error('Error al escribir:', error);
  }
};
```

### 6. Notificaciones

#### `monitorCharacteristicForDevice()`

Monitorea cambios en una característica.

```javascript
const startMonitoring = (deviceId, serviceUUID, characteristicUUID) => {
  const subscription = manager.monitorCharacteristicForDevice(
    deviceId,
    serviceUUID,
    characteristicUUID,
    (error, characteristic) => {
      if (error) {
        console.error('Error en monitoreo:', error);
        return;
      }
    
      if (characteristic) {
        const value = Buffer.from(characteristic.value, 'base64').toString('utf-8');
        console.log('Notificación recibida:', value);
      }
    }
  );
  
  return subscription;
};
```

## Ejemplos Prácticos

### Ejemplo 1: Escáner Básico de Dispositivos

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BLEScanner = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log('Bluetooth listo');
      }
    }, true);

    return () => {
      manager.destroy();
      subscription.remove();
    };
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        setDevices(prevDevices => {
          const exists = prevDevices.find(d => d.id === device.id);
          if (!exists) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Detener escaneo después de 10 segundos
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ fontSize: 12, color: 'gray' }}>{item.id}</Text>
      <Text style={{ fontSize: 12, color: 'gray' }}>RSSI: {item.rssi}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity 
        onPress={startScan}
        disabled={isScanning}
        style={{ 
          backgroundColor: isScanning ? 'gray' : 'blue',
          padding: 15,
          borderRadius: 5,
          marginBottom: 20
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isScanning ? 'Escaneando...' : 'Iniciar Escaneo'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={renderDevice}
      />
    </View>
  );
};

export default BLEScanner;
```

### Ejemplo 2: Conexión y Comunicación

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BLEConnection = () => {
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedData, setReceivedData] = useState('');

  const connectToDevice = async (deviceId) => {
    try {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);
    
      // Iniciar monitoreo de notificaciones
      startMonitoring(device);
    
    } catch (error) {
      console.error('Error al conectar:', error);
    }
  };

  const startMonitoring = (device) => {
    const serviceUUID = 'your-service-uuid';
    const characteristicUUID = 'your-characteristic-uuid';

    manager.monitorCharacteristicForDevice(
      device.id,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Error en monitoreo:', error);
          return;
        }

        if (characteristic) {
          const value = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          setReceivedData(value);
        }
      }
    );
  };

  const sendMessage = async () => {
    if (!connectedDevice || !message) return;

    try {
      const serviceUUID = 'your-service-uuid';
      const characteristicUUID = 'your-characteristic-uuid';
      const encodedMessage = Buffer.from(message, 'utf-8').toString('base64');

      await manager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        serviceUUID,
        characteristicUUID,
        encodedMessage
      );

      console.log('Mensaje enviado:', message);
      setMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const disconnect = async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Estado: {connectedDevice ? 'Conectado' : 'Desconectado'}
      </Text>

      {connectedDevice && (
        <View>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Mensaje a enviar"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
        
          <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: 'green', padding: 15 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Enviar Mensaje</Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 20, fontSize: 16 }}>Datos recibidos:</Text>
          <Text style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0' }}>
            {receivedData}
          </Text>

          <TouchableOpacity onPress={disconnect} style={{ backgroundColor: 'red', padding: 15, marginTop: 20 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BLEConnection;
```

## Buenas Prácticas

### 1. Gestión de Estado del Bluetooth

```javascript
const useBluetoothState = () => {
  const [bluetoothState, setBluetoothState] = useState('Unknown');
  const [manager] = useState(new BleManager());

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      setBluetoothState(state);
    }, true);

    return () => subscription.remove();
  }, []);

  return { bluetoothState, manager };
};
```

### 2. Manejo de Permisos

```javascript
import { PermissionsAndroid, Platform } from 'react-native';

const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return Object.values(granted).every(
      permission => permission === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};
```

### 3. Cleanup y Gestión de Memoria

```javascript
useEffect(() => {
  return () => {
    // Detener escaneo
    manager.stopDeviceScan();
  
    // Cancelar todas las conexiones
    manager.connectedDevices([]).then(devices => {
      devices.forEach(device => {
        manager.cancelDeviceConnection(device.id);
      });
    });
  
    // Destruir manager
    manager.destroy();
  };
}, []);
```

### 4. Timeout en Operaciones

```javascript
const connectWithTimeout = async (deviceId, timeout = 10000) => {
  return Promise.race([
    manager.connectToDevice(deviceId),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};
```

### 5. Reintentos Automáticos

```javascript
const connectWithRetry = async (deviceId, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await manager.connectToDevice(deviceId);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

## Simulación de Beacons

### Configuración de Beacon Simulado

Para simular un beacon sin dispositivo físico, puedes usar tu dispositivo móvil como emisor:

```javascript
import { BleManager } from 'react-native-ble-plx';

class BeaconSimulator {
  constructor() {
    this.manager = new BleManager();
  }

  // Simular un iBeacon
  simulateIBeacon = async () => {
    const beaconData = {
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      major: 1,
      minor: 1,
      measuredPower: -59
    };

    try {
      // En una app real, necesitarías usar bibliotecas adicionales
      // para transmitir como beacon
      console.log('Simulando iBeacon:', beaconData);
    
      // Alternativa: crear un servicio personalizado que simule un beacon
      await this.createBeaconService(beaconData);
    } catch (error) {
      console.error('Error al simular beacon:', error);
    }
  };

  createBeaconService = async (beaconData) => {
    // Crear un servicio personalizado que otros dispositivos puedan detectar
    const serviceUUID = '550e8400-e29b-41d4-a716-446655440000';
    const characteristicUUID = '550e8400-e29b-41d4-a716-446655440001';

    // Nota: react-native-ble-plx principalmente funciona como central
    // Para transmitir como peripheral, necesitas bibliotecas adicionales
    console.log('Servicio beacon creado virtualmente');
  };
}
```

### Detector de Beacons

```javascript
const BeaconDetector = () => {
  const [manager] = useState(new BleManager());
  const [beacons, setBeacons] = useState([]);

  const startBeaconScan = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error:', error);
        return;
      }

      if (device && device.manufacturerData) {
        const beaconInfo = parseBeaconData(device);
        if (beaconInfo) {
          setBeacons(prev => {
            const exists = prev.find(b => b.id === device.id);
            if (!exists) {
              return [...prev, { ...beaconInfo, device }];
            }
            return prev;
          });
        }
      }
    });
  };

  const parseBeaconData = (device) => {
    // Parsear datos de manufacturer para identificar beacons
    const data = device.manufacturerData;
    if (!data) return null;

    try {
      const buffer = Buffer.from(data, 'base64');
    
      // Verificar si es un iBeacon (identificador Apple: 0x004C)
      if (buffer.length >= 25 && buffer[0] === 0x4C && buffer[1] === 0x00) {
        return {
          type: 'iBeacon',
          uuid: buffer.slice(4, 20).toString('hex'),
          major: buffer.readUInt16BE(20),
          minor: buffer.readUInt16BE(22),
          txPower: buffer.readInt8(24),
          rssi: device.rssi,
          distance: calculateDistance(device.rssi, buffer.readInt8(24))
        };
      }
    } catch (error) {
      console.error('Error parsing beacon data:', error);
    }

    return null;
  };

  const calculateDistance = (rssi, txPower) => {
    if (rssi === 0) return -1;
  
    const ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
      return Math.pow(ratio, 10);
    } else {
      const accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
      return accuracy;
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={startBeaconScan}>
        <Text>Buscar Beacons</Text>
      </TouchableOpacity>
    
      {beacons.map((beacon, index) => (
        <View key={index} style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>Tipo: {beacon.type}</Text>
          <Text>UUID: {beacon.uuid}</Text>
          <Text>Major: {beacon.major}, Minor: {beacon.minor}</Text>
          <Text>Distancia: {beacon.distance?.toFixed(2)}m</Text>
          <Text>RSSI: {beacon.rssi}</Text>
        </View>
      ))}
    </View>
  );
};
```

### Simulador de Eddystone Beacon

```javascript
const EddystoneSimulator = () => {
  const [manager] = useState(new BleManager());

  const simulateEddystoneURL = async (url) => {
    // Codificar URL según especificación Eddystone
    const encodedUrl = encodeEddystoneURL(url);
  
    console.log('Simulando Eddystone URL:', url);
    console.log('Datos codificados:', encodedUrl);
  
    // En una implementación real, transmitirías estos datos
    return encodedUrl;
  };

  const encodeEddystoneURL = (url) => {
    const schemes = [
      'http://www.',
      'https://www.',
      'http://',
      'https://'
    ];

    const extensions = [
      '.com/',
      '.org/',
      '.edu/',
      '.net/',
      '.info/',
      '.biz/',
      '.gov/',
      '.com',
      '.org',
      '.edu',
      '.net',
      '.info',
      '.biz',
      '.gov'
    ];

    let encoded = url;
  
    // Buscar y reemplazar esquemas
    for (let i = 0; i < schemes.length; i++) {
      if (encoded.startsWith(schemes[i])) {
        encoded = String.fromCharCode(i) + encoded.substring(schemes[i].length);
        break;
      }
    }

    // Buscar y reemplazar extensiones
    for (let i = 0; i < extensions.length; i++) {
      const pos = encoded.indexOf(extensions[i]);
      if (pos !== -1) {
        encoded = encoded.substring(0, pos) + 
                  String.fromCharCode(i) + 
                  encoded.substring(pos + extensions[i].length);
        break;
      }
    }

    return Buffer.from(encoded, 'utf8').toString('base64');
  };

  return (
    <View>
      <TouchableOpacity onPress={() => simulateEddystoneURL('https://www.example.com')}>
        <Text>Simular Eddystone URL</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Casos de Uso Comunes

### 1. Monitor de Salud

```javascript
const HealthMonitor = () => {
  const [heartRate, setHeartRate] = useState(0);
  const [manager] = useState(new BleManager());

  const connectToHeartRateMonitor = async (deviceId) => {
    try {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();

      // UUID estándar para servicio de frecuencia cardíaca
      const heartRateServiceUUID = '180D';
      const heartRateCharacteristicUUID = '2A37';

      manager.monitorCharacteristicForDevice(
        device.id,
        heartRateServiceUUID,
        heartRateCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.error('Error:', error);
            return;
          }

          if (characteristic) {
            const data = Buffer.from(characteristic.value, 'base64');
            // Parsear datos de frecuencia cardíaca según especificación BLE
            const heartRateValue = data[1];
            setHeartRate(heartRateValue);
          }
        }
      );
    } catch (error) {
      console.error('Error al conectar:', error);
    }
  };

  return (
    <View>
      <Text>Frecuencia Cardíaca: {heartRate} BPM</Text>
    </View>
  );
};
```

### 2. Control de Dispositivos IoT

```javascript
const IoTController = () => {
  const [manager] = useState(new BleManager());
  const [connectedDevice, setConnectedDevice] = useState(null);

  const sendCommand = async (command) => {
    if (!connectedDevice) return;

    const serviceUUID = 'your-iot-service-uuid';
    const commandCharacteristicUUID = 'your-command-characteristic-uuid';

    try {
      const encodedCommand = Buffer.from(JSON.stringify(command), 'utf-8').toString('base64');
    
      await manager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        serviceUUID,
        commandCharacteristicUUID,
        encodedCommand
      );

      console.log('Comando enviado:', command);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleLight = () => {
    sendCommand({ type: 'light', action: 'toggle' });
  };

  const setTemperature = (temp) => {
    sendCommand({ type: 'thermostat', action: 'setTemp', value: temp });
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleLight}>
        <Text>Toggle Light</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setTemperature(22)}>
        <Text>Set Temperature to 22°C</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Troubleshooting

### Problemas Comunes

#### 1. Bluetooth no se enciende automáticamente

```javascript
const ensureBluetoothEnabled = async () => {
  const state = await manager.state();
  if (state !== 'PoweredOn') {
    // En Android, puedes solicitar que se encienda
    if (Platform.OS === 'android') {
      await manager.enable();
    } else {
      Alert.alert('Bluetooth', 'Por favor, enciende el Bluetooth');
    }
  }
};
```

#### 2. Dispositivos no aparecen en el escaneo

```javascript
const scanWithFilters = () => {
  // Escanear solo dispositivos con servicios específicos
  const serviceUUIDs = ['180D', '180F']; // Heart Rate y Battery Service
  
  manager.startDeviceScan(serviceUUIDs, null, (error, device) => {
    // Los dispositivos deben anunciar estos servicios para aparecer
  });
};
```

#### 3. Conexión se pierde frecuentemente

```javascript
const setupConnectionMonitoring = (device) => {
  const subscription = manager.onDeviceDisconnected(device.id, (error, disconnectedDevice) => {
    console.log('Dispositivo desconectado:', disconnectedDevice.id);
  
    // Intentar reconexión automática
    setTimeout(() => {
      connectToDevice(disconnectedDevice.id);
    }, 2000);
  });

  return subscription;
};
```

#### 4. Problemas de permisos en Android

```javascript
const checkPermissions = async () => {
  if (Platform.OS === 'android') {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ];

    const results = await PermissionsAndroid.requestMultiple(permissions);
  
    const allGranted = Object.values(results).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      Alert.alert('Permisos', 'Se necesitan permisos de ubicación y Bluetooth');
      return false;
    }
  }
  return true;
};
```

### Debugging

#### Habilitar logs detallados

```javascript
import { LogLevel } from 'react-native-ble-plx';

const manager = new BleManager({
  restoreStateIdentifier: 'BleManagerState',
  restoreStateFunction: (bleManager) => {
    // Restaurar estado después de que la app se cierre
  }
});

// Habilitar logs para debugging
manager.setLogLevel(LogLevel.Verbose);
```

#### Monitor de estado completo

```javascript
const BLEStatusMonitor = () => {
  const [status, setStatus] = useState({});
  const [manager] = useState(new BleManager());

  useEffect(() => {
    const updateStatus = async () => {
      const state = await manager.state();
      const connectedDevices = await manager.connectedDevices([]);
    
      setStatus({
        bluetoothState: state,
        connectedDevices: connectedDevices.length,
        timestamp: new Date().toISOString()
      });
    };

    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text>Estado BLE: {status.bluetoothState}</Text>
      <Text>Dispositivos conectados: {status.connectedDevices}</Text>
      <Text>Última actualización: {status.timestamp}</Text>
    </View>
  );
};
```

---
