---
title: 'BLE Advertising'
code: "react"
description: 'BLE Advertising: Conceptos Fundamentales'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

## ¿Qué vas a aprender

En este contenido explorarás los conceptos clave y su aplicación práctica:

- Fundamentos teóricos y contexto necesario para entender el tema
- Aplicaciones prácticas y casos de uso reales
- Herramientas, técnicas y mejores prácticas recomendadas
- Ejemplos guiados paso a paso
- Errores comunes, anti-patrones y cómo evitarlos


# 📡 BLE Advertising: Conceptos Fundamentales

## 🎯 **¿Qué es BLE Advertising?**

**Advertising** en BLE (Bluetooth Low Energy) es el proceso donde un dispositivo **transmite señales** para que otros dispositivos puedan **descubrirlo y conectarse** a él.

### 📊 **Roles en BLE:**

```
┌─────────────────┐         ┌─────────────────┐
│   PERIPHERAL    │  ◄───►  │    CENTRAL      │
│   (Advertiser)  │         │   (Scanner)     │
│                 │         │                 │
│ • Transmite     │         │ • Escanea       │
│ • Anuncia       │         │ • Detecta       │
│ • Es detectado  │         │ • Se conecta    │
└─────────────────┘         └─────────────────┘

     WAIOT Device                Tu App
    (iBeacon Real)           (Modo Scanner)
```

## 🔧 **Advertising Nativo vs No Nativo**

### ✅ **Advertising NATIVO (Nivel OS)**

```typescript
// Código que FUNCIONA a nivel del sistema operativo
await BluetoothAdapter.startAdvertising({
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  major: 1,
  minor: 1,
  name: "WAIOT"
});
```

**Características:**

- ⚡ **Máximo rendimiento** - Acceso directo al hardware
- 🔋 **Eficiencia energética** - Optimizado por el OS
- 📡 **Alcance completo** - Potencia de transmisión máxima
- 🎯 **Compatibilidad total** - Funciona con todos los estándares BLE
- ⏰ **Background support** - Puede funcionar en segundo plano

### ❌ **Advertising NO NATIVO (Simulado)**

```typescript
// Código que SIMULA el comportamiento
setTimeout(() => {
  // Pretender que hay un dispositivo
  simulateDeviceFound("WAIOT");
}, 2000);
```

**Características:**

- 🎭 **Solo simulación** - No hay transmisión BLE real
- 📱 **Solo dentro de la app** - Otros dispositivos NO lo detectan
- ⚡ **Inmediato** - No requiere permisos especiales
- 🧪 **Perfecto para testing** - Desarrollo rápido

## 🚫 **¿Por qué react-native-ble-plx NO soporta advertising nativo?**

### **Limitaciones Técnicas:**

1. **🎯 Enfoque de la Librería:**

   ```typescript
   // react-native-ble-plx está diseñado para ESCANEAR, no para ADVERTISE

   ✅ SOPORTA (Central Role):
   manager.startDeviceScan()     // Escanear dispositivos
   device.connect()              // Conectarse a dispositivos
   device.readCharacteristic()   // Leer datos

   ❌ NO SOPORTA (Peripheral Role):
   manager.startAdvertising()    // ← Esta función NO EXISTE
   manager.addService()          // ← Esta función NO EXISTE
   ```
2. **📱 Limitaciones de la Plataforma:**

   ```typescript
   // iOS: Restricciones de Apple
   - Solo apps autorizadas pueden hacer advertising en background
   - Limitaciones en el formato de los datos
   - Restricciones de energía

   // Android: Permisos complejos
   - Requiere BLUETOOTH_ADVERTISE (API 31+)
   - Diferentes comportamientos por fabricante
   - Limitaciones de hardware
   ```

## 🛠️ **Librerías que SÍ soportan Advertising Nativo**

### **1. react-native-ble-advertiser**

```bash
npm install react-native-ble-advertiser
```

```typescript
import BLEAdvertiser from 'react-native-ble-advertiser';

// ✅ ADVERTISING NATIVO REAL
await BLEAdvertiser.broadcast(
  "550e8400-e29b-41d4-a716-446655440000", // UUID
  1,                                        // Major
  1                                         // Minor
);

// ✅ Otros dispositivos PUEDEN detectar este iBeacon
```

### **2. react-native-beacon**

```bash
npm install react-native-beacon
```

```typescript
import { Beacon } from 'react-native-beacon';

// ✅ ADVERTISING NATIVO REAL
await Beacon.startAdvertising({
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  identifier: "WAIOT-Beacon",
  major: 1,
  minor: 1
});
```

### **3. @react-native-community/ble-advertiser**

```bash
npm install @react-native-community/ble-advertiser
```

## 🎯 **¿Cuál es la Diferencia Práctica?**

### 🧪 **Para tu Caso de Testing:**

```typescript
// ❌ SIMULACIÓN (Lo que tienes ahora)
const simulateVirtualBeacon = async (device: Device) => {
  // Solo tu app "cree" que encontró un dispositivo
  device.powerOn = true;
  Alert.alert("Dispositivo Virtual Encontrado"); // ← Solo en tu app
};

// ✅ ADVERTISING NATIVO (Con librería adicional)
const startRealVirtualBeacon = async () => {
  await BLEAdvertiser.broadcast(uuid, major, minor);
  // CUALQUIER dispositivo con BLE puede detectar este iBeacon
  // Aparece en apps como "nRF Connect", "Bluetooth Scanner", etc.
};
```

### 📱 **Testing Real:**

```typescript
// Con ADVERTISING NATIVO puedes:

1. 📲 Abrir "nRF Connect" en otro teléfono
2. 🔍 Escanear dispositivos BLE  
3. 👀 Ver tu "WAIOT" virtual en la lista
4. 📡 Medir RSSI, distancia, etc.
5. 🔗 Conectarte desde otra app

// Con SIMULACIÓN solo puedes:
1. 🎭 Testear la lógica de tu app
2. ⚡ Desarrollo rápido sin hardware
3. 🧪 Pruebas unitarias
```

## 🎮 **¿Cuál Deberías Usar?**

### **Para Desarrollo Rápido: SIMULACIÓN** ⚡

```typescript
✅ Ventajas:
- Funciona inmediatamente
- No requiere permisos complejos
- Perfecto para testear lógica de la app
- No consume batería

❌ Desventajas:
- No es un test real de BLE
- Solo funciona dentro de tu app
```

### **Para Testing Avanzado: ADVERTISING NATIVO** 📡

```typescript
✅ Ventajas:
- Test real de comunicación BLE
- Otros dispositivos pueden detectarlo
- Simula comportamiento real del hardware
- Puedes medir RSSI, proximidad, etc.

❌ Desventajas:
- Requiere librerías adicionales
- Configuración más compleja
- Permisos adicionales necesarios
- Consume más batería
```

## 🚀 **Recomendación para tu Proyecto**

1. **Empieza con SIMULACIÓN** (ya la tienes funcionando)
2. **Cuando necesites testing real**, agrega `react-native-ble-advertiser`
3. **Usa ambos enfoques** según la fase de desarrollo

¿Te ayudo a implementar el advertising nativo real o prefieres profundizar en algún aspecto específico?
