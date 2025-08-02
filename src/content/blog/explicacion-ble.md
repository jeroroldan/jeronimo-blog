---
title: 'DeviceListScreen'
code: "react"
description: 'DeviceListScreen - Documentación Técnica'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# DeviceListScreen - Documentación Técnica

## Descripción General

`DeviceListScreen` es una pantalla React Native que gestiona una lista de dispositivos IoT (sensores WAIOT). Permite escanear, activar, instalar y administrar sensores que se conectan vía Bluetooth y envían datos a través de la red celular.

## Funcionalidades Principales

### 1. **Gestión de Estados de Dispositivos**

La aplicación maneja dos tipos de sensores:

- **Sensores Pendientes**: Dispositivos agregados pero no activados
- **Sensores Instalados**: Dispositivos completamente configurados y operativos

```javascript
enum TitleValues {
  PENDING = "Sensores pendientes",
  INSTALLED = "Sensores instalados",
}
```

### 2. **Almacenamiento Local**

Utiliza AsyncStorage para persistir la información de los dispositivos:

```javascript
// Guardar datos
await AsyncStorage.setItem("data", JSON.stringify(updatedData));

// Obtener datos
const dataDevice = await AsyncStorage.getItem("data");
const parsedData = JSON.parse(dataDevice);
```

**Estructura de datos del dispositivo:**

```javascript
{
  imei: "123456789012345",           // Identificador único
  powerOn: false,                   // ¿Está encendido?
  checked: false,                   // ¿Está instalado?
  inProgress: false,                // ¿Proceso en curso?
  date: new Date(),                 // Fecha de instalación
  ICCID: "89123456789012345678",    // ID de la SIM
  bat_v_h: 4.2,                     // Voltaje batería alta
  bat_v_s: 3.8,                     // Voltaje batería baja
  battery_status: "good",           // Estado de batería
  rssi: -70,                        // Intensidad de señal
  rssi_status: "excellent"          // Estado de señal
}
```

## Flujo de Trabajo Paso a Paso

### **Paso 1: Carga Inicial**

```javascript
useEffect(() => {
  getData(); // Carga dispositivos desde AsyncStorage
}, [title]);
```

### **Paso 2: Verificación de Encendido (Bluetooth)**

Cuando el usuario presiona "Verificar encendido":

```javascript
const handleScanDevices = async (device: Device) => {
  // 1. Verificar permisos de Bluetooth
  if (!(await areAllPermissionsGranted(["bluetoothGranted", "bluetoothOn"]))) {
    navigation.navigate("Permissions");
    return;
  }
  
  // 2. Mostrar spinner de carga
  setSpinner({ visible: true, title: "Verificando encendido..." });
  
  // 3. Iniciar escaneo BLE
  await manager.startDeviceScan(null, null, async (error, deviceOn) => {
    if (deviceOn && deviceOn.name === "WAIOT") {
      // 4. Marcar dispositivo como encendido
      device.powerOn = true;
      // 5. Guardar en AsyncStorage
      await AsyncStorage.setItem("data", JSON.stringify(updatedData));
    }
  });
}
```

### **Paso 3: Activación/Instalación del Dispositivo**

Proceso más complejo que incluye ubicación y comunicación con servidor:

```javascript
const handleActivation = async (device: Device) => {
  // 1. Verificar permisos de ubicación
  if (!(await areAllPermissionsGranted(["locationGranted", "locationOn"]))) {
    navigation.navigate("Permissions");
    return;
  }

  // 2. Verificar conexión a internet
  const netInfoState = await NetInfo.fetch();
  if (!netInfoState.isConnected) {
    Alert.alert("Error", "Requiere conexión a Internet");
    return;
  }

  // 3. Obtener ubicación GPS
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  // 4. Enviar datos al servidor
  const response = await getInit(device, lat, long);
  
  // 5. Si exitoso, marcar como instalado
  if (response?.data?.rssi_status) {
    await updateDeviceData((item) => ({
      ...item,
      checked: true,        // Marca como instalado
      inProgress: false,    // Termina el proceso
      // ... otros datos del servidor
    }));
  
    setTitle(TitleValues.INSTALLED); // Cambia a vista "Instalados"
  }
}
```

## Casos de Uso Detallados

### **Caso 1: Agregar un Nuevo Sensor**

1. Usuario presiona el botón "+" (IconAddDevice)
2. Navega a pantalla de agregar dispositivo
3. Ingresa IMEI del sensor
4. Sensor aparece en lista "Pendientes"

### **Caso 2: Verificar que un Sensor Está Encendido**

AsyncStorage ←→ DeviceListScreen ←→ Server API
↓
CardDevice Components
↓
User Interactions

```
Usuario selecciona "Verificar encendido"
    ↓
¿Bluetooth activado? → No → Mostrar alerta para activar
    ↓ Sí
Escanear dispositivos BLE cercanos
    ↓
¿Encontró "WAIOT"? → No → Continúa escaneando
    ↓ Sí
Marca dispositivo como "powerOn: true"
    ↓
Muestra alerta "Dispositivo encontrado"
```

### **Caso 3: Instalar un Sensor**

```
Usuario selecciona "Activar"
    ↓
¿Permisos de ubicación? → No → Redirige a permisos
    ↓ Sí
¿Hay internet? → No → Error de conexión
    ↓ Sí
Obtiene coordenadas GPS
    ↓
Envía datos al servidor (getInit)
    ↓
¿Respuesta exitosa? → No → Error de validación
    ↓ Sí
Actualiza dispositivo con datos del servidor
    ↓
Mueve a lista "Instalados"
```

## Estados de la UI

### **Loading States**

```javascript
// Spinner global para operaciones largas
const [spinner, setSpinner] = useState({
  visible: false,
  title: ""
});

// Loading para refresh de datos
const [loading, setLoading] = useState(true);
```

### **Selección Múltiple**

```javascript
const [selected, setSelected] = useState<string[]>([]);

// Seleccionar/deseleccionar dispositivo
const selectedItem = (imei: string) => {
  setSelected(prevSelected => 
    prevSelected.includes(imei) 
      ? prevSelected.filter(e => e !== imei)  // Deseleccionar
      : [...prevSelected, imei]               // Seleccionar
  );
};
```

## Componentes Hijos Principales

### **HeaderDeviceList**

- Muestra el título actual ("Pendientes" o "Instalados")
- Permite cambiar entre vistas
- Botón para abrir drawer de navegación

### **CardDevice**

Cada tarjeta de dispositivo muestra:

- IMEI del dispositivo
- Estado actual (encendido, instalado, etc.)
- Botones de acción según el estado:
  - "Verificar encendido" (si no está encendido)
  - "Activar" (si está encendido pero no instalado)
  - "Reset" (si está instalado)

### **SelectedList**

Aparece cuando hay dispositivos seleccionados:

- Contador de seleccionados
- Botón para limpiar selección
- Botón para eliminar seleccionados

## Manejo de Errores

### **Errores de Permisos**

```javascript
if (!(await areAllPermissionsGranted(["bluetoothGranted"]))) {
  navigation.navigate("Permissions"); // Redirige a pantalla de permisos
}
```

### **Errores de Bluetooth**

```javascript
function check() {
  Alert.alert("Error", "Necesitas prender el Bluetooth", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "OK",
      onPress: async () => {
        try {
          await manager.enable(); // Intenta activar Bluetooth
        } catch (error) {
          Alert.alert("No se pudo activar Bluetooth");
        }
      }
    }
  ]);
}
```

### **Errores de Red**

```javascript
catch (error: any) {
  Alert.alert(
    "Error al validar",
    error?.data?.message || "Error inesperado"
  );
}
```

## Funciones de Utilidad

### **Cancelar Operaciones**

```javascript
const cancelActivation = async () => {
  // Detener todos los procesos en curso
  const filterData = data.map(item => ({
    ...item,
    inProgress: false
  }));
  
  await manager.stopDeviceScan(); // Detener escaneo BLE
  setSpinner({ visible: false, title: "" }); // Ocultar spinner
};
```

### **Reset de Dispositivo**

```javascript
const handleReset = async (device: Device) => {
  // Volver dispositivo a estado inicial
  const resetDevice = {
    ...device,
    inProgress: false,
    checked: false,
    powerOn: false,
    date: undefined,
    // ... limpiar todos los datos de instalación
  };
  
  await AsyncStorage.setItem("data", JSON.stringify(updatedData));
  setTitle(TitleValues.PENDING); // Volver a vista "Pendientes"
};
```

## Consideraciones Técnicas

### **Gestión de Memoria**

- Usa `useRef` para `inProgressRef` para evitar re-renders innecesarios
- Limpia suscripciones de Bluetooth en `useEffect` cleanup

### **Navegación**

- Integrado con React Navigation (Drawer)
- Usa `useBackHandler` para manejar botón físico de retroceso

### **Permisos Requeridos**

- **Bluetooth**: Para escanear dispositivos WAIOT
- **Ubicación**: Para GPS durante instalación
- **Internet**: Para comunicación con servidor

### **Dependencias Principales**

- `react-native-ble-plx`: Bluetooth Low Energy
- `@react-native-async-storage/async-storage`: Almacenamiento local
- `expo-location`: Servicios de ubicación
- `@react-native-community/netinfo`: Estado de conectividad

## Flujo de Datos

```
AsyncStorage ←→ DeviceListScreen ←→ Server API
                       ↓
              CardDevice Components
                       ↓
              User Interactions
```

Este componente es el núcleo de la gestión de dispositivos IoT, manejando todo el ciclo de vida desde el registro inicial hasta la instalación completa y operación de los sensores WAIOT.
