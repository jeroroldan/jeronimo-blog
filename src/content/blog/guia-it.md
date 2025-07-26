---
title: 'Protocolos de Comunicación IoT'
description: 'Guía Completa de Protocolos de Comunicación IoT'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# 🌐 Guía Completa de Protocolos de Comunicación IoT

## 📋 Índice

1. [Introducción a Protocolos IoT](#introducción-a-protocolos-iot)
2. [Protocolos de Conectividad Local](#protocolos-de-conectividad-local)
3. [Protocolos de Area Amplia](#protocolos-de-area-amplia)
4. [Protocolos de Aplicación](#protocolos-de-aplicación)
5. [Protocolos de Red Mesh](#protocolos-de-red-mesh)
6. [Comparación y Selección](#comparación-y-selección)
7. [Implementaciones Prácticas](#implementaciones-prácticas)
8. [Seguridad en Protocolos IoT](#seguridad-en-protocolos-iot)
9. [Casos de Uso por Industria](#casos-de-uso-por-industria)
10. [Futuro de los Protocolos IoT](#futuro-de-los-protocolos-iot)

---

## 🎯 Introducción a Protocolos IoT

### Clasificación de Protocolos IoT

```mermaid
graph TD
    A[Protocolos IoT] --> B[Por Alcance]
    A --> C[Por Capa OSI]
    A --> D[Por Consumo]
  
    B --> E[PAN - Personal Area Network]
    B --> F[LAN - Local Area Network]
    B --> G[WAN - Wide Area Network]
  
    C --> H[Física/Enlace]
    C --> I[Red/Transporte]
    C --> J[Aplicación]
  
    D --> K[Alto Consumo]
    D --> L[Bajo Consumo]
    D --> M[Ultra Bajo Consumo]
  
    E --> N[Bluetooth LE, Zigbee]
    F --> O[Wi-Fi, Ethernet]
    G --> P[LoRaWAN, Cellular]
  
    H --> Q[802.11, 802.15.4]
    I --> R[IPv6, UDP, TCP]
    J --> S[MQTT, CoAP, HTTP]
```

### Parámetros Clave de Evaluación


| Parámetro     | Descripción                       | Unidades            |
| -------------- | ---------------------------------- | ------------------- |
| **Alcance**    | Distancia máxima de comunicación | metros/kilómetros  |
| **Throughput** | Velocidad de transmisión de datos | bps, kbps, Mbps     |
| **Latencia**   | Tiempo de respuesta                | milisegundos        |
| **Consumo**    | Energía requerida                 | mW, µW             |
| **Topología** | Estructura de red                  | Estrella, Mesh, P2P |
| **Seguridad**  | Nivel de encriptación             | AES-128/256, etc.   |

---

## 📡 Protocolos de Conectividad Local

### 1. Wi-Fi (IEEE 802.11)

#### **Características Técnicas**

```
📊 Especificaciones:
- Frecuencia: 2.4 GHz, 5 GHz, 6 GHz (Wi-Fi 6E)
- Alcance: 30-100 metros (interior)
- Throughput: 1 Mbps - 9.6 Gbps
- Consumo: Alto (100-1000 mW)
- Topología: Infraestructura/Ad-hoc
- Latencia: 1-10 ms
```

#### **Casos de Uso**

```
🏠 Smart Home:
- Cámaras de seguridad IP
- Smart TVs y streaming devices
- Electrodomésticos inteligentes
- Sistemas de automatización

🏢 Industrial:
- Monitoreo de maquinaria pesada
- Sistemas SCADA
- Cámaras de vigilancia industrial
- Tablets y dispositivos móviles
```

#### **Ejemplo de Implementación ESP32**

```cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "IoT_Network";
const char* password = "IoT_Password123";

WebServer server(80);

void setup() {
  Serial.begin(115200);
  
  // Conectar a Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }
  
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Configurar endpoints
  server.on("/", handleRoot);
  server.on("/sensor", handleSensor);
  server.begin();
}

void handleRoot() {
  String html = "<h1>IoT Device Status</h1>";
  html += "<p>Temperature: " + String(readTemperature()) + "°C</p>";
  html += "<p>Humidity: " + String(readHumidity()) + "%</p>";
  server.send(200, "text/html", html);
}

void handleSensor() {
  String json = "{";
  json += "\"temperature\":" + String(readTemperature()) + ",";
  json += "\"humidity\":" + String(readHumidity()) + ",";
  json += "\"timestamp\":" + String(millis());
  json += "}";
  server.send(200, "application/json", json);
}

void loop() {
  server.handleClient();
}
```

### 2. Bluetooth Low Energy (BLE)

#### **Características Técnicas**

```
📊 Especificaciones:
- Frecuencia: 2.4 GHz ISM
- Alcance: 1-100 metros
- Throughput: 1-3 Mbps
- Consumo: Muy bajo (1-15 mW)
- Topología: Estrella, Mesh (BLE 5.0+)
- Latencia: 3-6 ms
```

#### **Perfiles BLE Comunes**

```
🔧 Perfiles de Aplicación:
- GATT (Generic Attribute Profile)
- GAP (Generic Access Profile)
- HID (Human Interface Device)
- HRS (Heart Rate Service)
- BAS (Battery Service)
- DIS (Device Information Service)
```

#### **Ejemplo de Implementación Arduino**

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "87654321-4321-4321-4321-cba987654321"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Cliente conectado");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Cliente desconectado");
      BLEDevice::startAdvertising(); // Restart advertising
    }
};

void setup() {
  Serial.begin(115200);

  // Inicializar BLE
  BLEDevice::init("IoT Temperature Sensor");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Crear servicio
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Crear característica
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_WRITE |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->addDescriptor(new BLE2902());

  // Iniciar servicio
  pService->start();

  // Iniciar advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();
  
  Serial.println("Dispositivo BLE listo para conexiones");
}

void loop() {
  if (deviceConnected) {
    // Leer sensor de temperatura
    float temperature = readTemperature();
    String tempStr = String(temperature, 2);
  
    // Enviar notificación
    pCharacteristic->setValue(tempStr.c_str());
    pCharacteristic->notify();
  
    Serial.println("Temperatura enviada: " + tempStr + "°C");
  }
  delay(1000);
}

float readTemperature() {
  // Simulación de lectura de sensor
  return 20.0 + random(-50, 50) / 10.0;
}
```

### 3. Zigbee (IEEE 802.15.4)

#### **Características Técnicas**

```
📊 Especificaciones:
- Frecuencia: 2.4 GHz, 915 MHz, 868 MHz
- Alcance: 10-100 metros
- Throughput: 20-250 kbps
- Consumo: Bajo (1-100 mW)
- Topología: Mesh, Estrella, Árbol
- Nodos: Hasta 65,000 por red
```

#### **Tipos de Dispositivos Zigbee**

```
🏗️ Arquitectura de Red:
- Coordinator (ZC): Un por red, mantiene la red
- Router (ZR): Extiende la red, rutea mensajes
- End Device (ZED): Dispositivos finales, bajo consumo

🔧 Perfiles de Aplicación:
- Home Automation (HA)
- Smart Energy (SE)
- Health Care (HC)
- Building Automation (BA)
```

#### **Ejemplo de Configuración Zigbee**

```python
# Configuración de red Zigbee usando Python-XBee
from xbee import XBee
import serial

# Configurar puerto serial
ser = serial.Serial('/dev/ttyUSB0', 9600)
xbee = XBee(ser)

def send_temperature_data(temperature, humidity):
    """Enviar datos de sensor por Zigbee"""
  
    # Formato de datos
    data = {
        'temperature': temperature,
        'humidity': humidity,
        'timestamp': time.time(),
        'device_id': 'TEMP_001'
    }
  
    # Convertir a JSON
    json_data = json.dumps(data).encode('utf-8')
  
    # Enviar a coordinador
    xbee.send('tx', 
              dest_addr=b'\x00\x00',  # Coordinador
              data=json_data)
  
    print(f"Datos enviados: Temp={temperature}°C, Hum={humidity}%")

def handle_received_data(data):
    """Manejar datos recibidos"""
    try:
        received = json.loads(data['data'].decode('utf-8'))
        print(f"Recibido de {received['device_id']}:")
        print(f"  Temperatura: {received['temperature']}°C")
        print(f"  Humedad: {received['humidity']}%")
      
        # Procesar datos (guardar en DB, activar actuadores, etc.)
        process_sensor_data(received)
      
    except Exception as e:
        print(f"Error procesando datos: {e}")

# Configurar callback para datos recibidos
xbee.add_data_received_callback(handle_received_data)

# Loop principal
while True:
    # Leer sensores locales
    temp = read_temperature_sensor()
    hum = read_humidity_sensor()
  
    # Enviar datos cada 30 segundos
    send_temperature_data(temp, hum)
    time.sleep(30)
```

---

## 🌍 Protocolos de Area Amplia

### 1. LoRaWAN (Long Range Wide Area Network)

#### **Características Técnicas**

```
📊 Especificaciones:
- Frecuencia: 868 MHz (EU), 915 MHz (US), 433 MHz
- Alcance: 2-15 km (urbano), 15-45 km (rural)
- Throughput: 0.3-50 kbps
- Consumo: Ultra bajo (10-100 µW)
- Topología: Estrella de estrellas
- Battery life: 5-10 años
```

#### **Arquitectura LoRaWAN**

```
🏗️ Componentes de Red:
- End Devices: Sensores y actuadores
- Gateways: Concentradores de datos
- Network Server: Gestión de red
- Application Server: Lógica de aplicación

📡 Clases de Dispositivos:
- Clase A: Bidireccional, bajo consumo
- Clase B: Recepción programada
- Clase C: Recepción continua
```

#### **Ejemplo de Implementación LoRaWAN**

```cpp
// Ejemplo para módulo RN2483 (Microchip)
#include <SoftwareSerial.h>

SoftwareSerial loraSerial(2, 3);

// Configuración LoRaWAN
String devEUI = "0004A30B001B8C01";
String appEUI = "70B3D57ED000985F";
String appKey = "A23C96EE13804963F8C2BD6285448198";

void setup() {
  Serial.begin(9600);
  loraSerial.begin(57600);
  
  // Reset del módulo
  resetModule();
  
  // Configurar parámetros LoRaWAN
  configureLoRaWAN();
  
  // Unirse a la red (OTAA)
  joinNetwork();
}

void loop() {
  // Leer sensores
  float temperature = readTemperature();
  float humidity = readHumidity();
  int batteryLevel = readBatteryLevel();
  
  // Crear payload
  String payload = createPayload(temperature, humidity, batteryLevel);
  
  // Enviar datos
  sendData(payload);
  
  // Dormir por 10 minutos (ahorro de energía)
  enterDeepSleep(600000); // 10 minutos en ms
}

void resetModule() {
  loraSerial.println("sys reset");
  delay(1000);
  Serial.println("Módulo LoRa reseteado");
}

void configureLoRaWAN() {
  // Configurar región
  loraSerial.println("mac set deveui " + devEUI);
  delay(100);
  loraSerial.println("mac set appeui " + appEUI);
  delay(100);
  loraSerial.println("mac set appkey " + appKey);
  delay(100);
  
  // Configurar región (EU868)
  loraSerial.println("mac set dr 5"); // Data rate
  delay(100);
  loraSerial.println("mac set adr on"); // Adaptive data rate
  delay(100);
  
  Serial.println("LoRaWAN configurado");
}

void joinNetwork() {
  Serial.println("Intentando unirse a la red LoRaWAN...");
  loraSerial.println("mac join otaa");
  
  // Esperar confirmación
  String response = "";
  unsigned long timeout = millis() + 30000; // 30 segundos timeout
  
  while (millis() < timeout) {
    if (loraSerial.available()) {
      response = loraSerial.readString();
      if (response.indexOf("accepted") > -1) {
        Serial.println("¡Unido a la red LoRaWAN exitosamente!");
        return;
      }
    }
    delay(1000);
  }
  
  Serial.println("Error: No se pudo unir a la red");
}

String createPayload(float temp, float hum, int battery) {
  // Crear payload eficiente (bytes)
  // Formato: [temp_high, temp_low, hum, battery]
  
  int tempInt = (int)(temp * 100); // Temperatura x100
  int humInt = (int)(hum);
  
  String payload = "";
  payload += String(tempInt >> 8, HEX); // Byte alto temperatura
  payload += String(tempInt & 0xFF, HEX); // Byte bajo temperatura
  payload += String(humInt, HEX); // Humedad
  payload += String(battery, HEX); // Batería
  
  return payload;
}

void sendData(String payload) {
  Serial.println("Enviando datos: " + payload);
  loraSerial.println("mac tx uncnf 1 " + payload);
  
  // Esperar confirmación
  delay(5000);
  String response = loraSerial.readString();
  
  if (response.indexOf("mac_tx_ok") > -1) {
    Serial.println("Datos enviados exitosamente");
  } else {
    Serial.println("Error enviando datos: " + response);
  }
}
```

### 2. NB-IoT (Narrowband IoT)

#### **Características Técnicas**

```
📊 Especificaciones:
- Frecuencia: Bandas LTE (700-2100 MHz)
- Alcance: 1-35 km
- Throughput: 26 kbps (uplink), 127 kbps (downlink)
- Consumo: Bajo (20-220 mW en transmisión)
- Topología: Celular (estrella)
- Latencia: 1.6-10 segundos
```

#### **Casos de Uso NB-IoT**

```
🏢 Aplicaciones Típicas:
- Smart metering (agua, gas, electricidad)
- Asset tracking y logística
- Smart parking
- Agricultura inteligente
- Monitoreo ambiental
- Gestión de residuos

💡 Ventajas:
- Cobertura extensa
- Penetración en edificios
- Baja complejidad de dispositivos
- Seguridad nivel carrier
```

#### **Ejemplo de Implementación NB-IoT**

```cpp
// Ejemplo para módulo SIM7020E
#include <SoftwareSerial.h>

SoftwareSerial nbiot(7, 8);

// Configuración de red
String apn = "iot.1nce.net"; // APN del operador IoT
String server = "iot.mycompany.com";
String port = "1883";

void setup() {
  Serial.begin(9600);
  nbiot.begin(9600);
  
  Serial.println("Inicializando NB-IoT...");
  
  // Configurar módulo
  initializeModule();
  
  // Conectar a red
  connectToNetwork();
  
  Serial.println("NB-IoT listo");
}

void loop() {
  // Recolectar datos de sensores
  SensorData data = collectSensorData();
  
  // Enviar datos al servidor
  sendDataToServer(data);
  
  // Entrar en modo de bajo consumo
  enterPowerSaveMode(900); // 15 minutos
}

void initializeModule() {
  // Reset del módulo
  nbiot.println("AT+CFUN=0");
  delay(2000);
  nbiot.println("AT+CFUN=1");
  delay(5000);
  
  // Configurar bandas NB-IoT
  nbiot.println("AT+CBAND=20"); // Banda 20 (800 MHz)
  delay(1000);
  
  // Configurar APN
  nbiot.println("AT+CGDCONT=1,\"IP\",\"" + apn + "\"");
  delay(1000);
  
  Serial.println("Módulo NB-IoT inicializado");
}

void connectToNetwork() {
  Serial.println("Conectando a red NB-IoT...");
  
  // Buscar red
  nbiot.println("AT+COPS=0");
  delay(30000); // Esperar hasta 30 segundos
  
  // Verificar registro
  bool registered = false;
  for (int i = 0; i < 30; i++) {
    nbiot.println("AT+CEREG?");
    delay(2000);
  
    String response = nbiot.readString();
    if (response.indexOf("+CEREG: 0,1") > -1 || 
        response.indexOf("+CEREG: 0,5") > -1) {
      registered = true;
      break;
    }
    delay(5000);
  }
  
  if (registered) {
    Serial.println("Conectado a red NB-IoT");
  
    // Activar contexto PDP
    nbiot.println("AT+CGACT=1,1");
    delay(5000);
  } else {
    Serial.println("Error: No se pudo conectar a la red");
  }
}

struct SensorData {
  float temperature;
  float humidity;
  float pressure;
  int batteryLevel;
  String timestamp;
};

SensorData collectSensorData() {
  SensorData data;
  
  data.temperature = readTemperature();
  data.humidity = readHumidity();
  data.pressure = readPressure();
  data.batteryLevel = readBatteryLevel();
  data.timestamp = getCurrentTimestamp();
  
  return data;
}

void sendDataToServer(SensorData data) {
  // Crear payload JSON
  String payload = "{";
  payload += "\"temperature\":" + String(data.temperature, 2) + ",";
  payload += "\"humidity\":" + String(data.humidity, 1) + ",";
  payload += "\"pressure\":" + String(data.pressure, 1) + ",";
  payload += "\"battery\":" + String(data.batteryLevel) + ",";
  payload += "\"timestamp\":\"" + data.timestamp + "\"";
  payload += "}";
  
  // Enviar vía HTTP POST
  sendHTTPPost(server, "/api/sensors/data", payload);
}

void sendHTTPPost(String host, String path, String data) {
  // Abrir conexión TCP
  nbiot.println("AT+CSOC=1,1,1");
  delay(1000);
  
  // Conectar al servidor
  nbiot.println("AT+CSOCON=0,1883,\"" + host + "\"");
  delay(5000);
  
  // Preparar HTTP request
  String httpRequest = "POST " + path + " HTTP/1.1\r\n";
  httpRequest += "Host: " + host + "\r\n";
  httpRequest += "Content-Type: application/json\r\n";
  httpRequest += "Content-Length: " + String(data.length()) + "\r\n";
  httpRequest += "Connection: close\r\n\r\n";
  httpRequest += data;
  
  // Enviar datos
  nbiot.println("AT+CSOSEND=0," + String(httpRequest.length()));
  delay(1000);
  nbiot.print(httpRequest);
  delay(5000);
  
  // Cerrar conexión
  nbiot.println("AT+CSOCL=0");
  delay(1000);
  
  Serial.println("Datos enviados vía NB-IoT");
}
```

### 3. Sigfox

#### **Características Técnicas**

```
📊 Especificaciones:
- Frecuencia: 868 MHz (EU), 902 MHz (US)
- Alcance: 3-50 km
- Throughput: 100-600 bps
- Mensajes: 140 uplink/día, 4 downlink/día
- Payload: 12 bytes máximo
- Consumo: Ultra bajo
- Topología: Estrella
```

#### **Ejemplo de Implementación Sigfox**

```cpp
// Ejemplo para módulo WISOL SFM10R1
#include <SoftwareSerial.h>

SoftwareSerial sigfox(4, 5);

void setup() {
  Serial.begin(9600);
  sigfox.begin(9600);
  
  Serial.println("Inicializando Sigfox...");
  
  // Configurar módulo
  configureSigfox();
  
  Serial.println("Dispositivo Sigfox listo");
}

void loop() {
  // Leer sensores (ejemplo: temperatura, humedad, batería)
  int temperature = (int)(readTemperature() * 100); // Temp x100
  int humidity = (int)(readHumidity());
  int battery = readBatteryLevel();
  
  // Crear payload compacto (12 bytes máximo)
  String payload = createCompactPayload(temperature, humidity, battery);
  
  // Enviar mensaje Sigfox
  sendSigfoxMessage(payload);
  
  // Dormir por 1 hora (ahorro de batería y límite de mensajes)
  enterDeepSleep(3600000); // 1 hora
}

void configureSigfox() {
  // Obtener ID del dispositivo
  sigfox.println("AT$I=10");
  delay(1000);
  String deviceId = sigfox.readString();
  Serial.println("Device ID: " + deviceId);
  
  // Obtener PAC (Porting Authorization Code)
  sigfox.println("AT$I=11");
  delay(1000);
  String pac = sigfox.readString();
  Serial.println("PAC: " + pac);
  
  // Test de conectividad
  Serial.println("Realizando test de conectividad...");
  sigfox.println("AT$SF=00");
  delay(10000); // Esperar respuesta de red
  
  String response = sigfox.readString();
  if (response.indexOf("OK") > -1) {
    Serial.println("Test de conectividad exitoso");
  } else {
    Serial.println("Error en test de conectividad");
  }
}

String createCompactPayload(int temp, int hum, int bat) {
  // Formato compacto para maximizar información en 12 bytes
  // Bytes 0-1: Temperatura (signed int16)
  // Byte 2: Humedad (0-100%)
  // Byte 3: Batería (0-100%)
  // Bytes 4-7: Timestamp (uint32)
  // Bytes 8-11: Reservados para expansión
  
  String payload = "";
  
  // Temperatura (2 bytes)
  payload += String((temp >> 8) & 0xFF, HEX);
  payload += String(temp & 0xFF, HEX);
  
  // Humedad (1 byte)
  payload += String(hum, HEX);
  
  // Batería (1 byte)
  payload += String(bat, HEX);
  
  // Timestamp simplificado (4 bytes)
  uint32_t timestamp = millis() / 1000; // Segundos desde inicio
  payload += String((timestamp >> 24) & 0xFF, HEX);
  payload += String((timestamp >> 16) & 0xFF, HEX);
  payload += String((timestamp >> 8) & 0xFF, HEX);
  payload += String(timestamp & 0xFF, HEX);
  
  // Padding para completar 12 bytes
  while (payload.length() < 24) { // 24 caracteres hex = 12 bytes
    payload += "00";
  }
  
  return payload;
}

void sendSigfoxMessage(String payload) {
  Serial.println("Enviando mensaje Sigfox: " + payload);
  
  // Enviar comando AT
  sigfox.println("AT$SF=" + payload);
  
  // Esperar respuesta (puede tomar varios segundos)
  delay(15000);
  
  String response = sigfox.readString();
  
  if (response.indexOf("OK") > -1) {
    Serial.println("Mensaje enviado exitosamente");
  } else {
    Serial.println("Error enviando mensaje: " + response);
  }
}

// Funciones auxiliares de sensores
float readTemperature() {
  // Implementar lectura de sensor real
  return 25.5; // Ejemplo
}

float readHumidity() {
  return 60.0; // Ejemplo
}

int readBatteryLevel() {
  // Leer nivel de batería (0-100%)
  return 85; // Ejemplo
}

void enterDeepSleep(unsigned long milliseconds) {
  Serial.println("Entrando en modo de bajo consumo...");
  delay(100);
  
  // Configurar deep sleep (implementación específica del MCU)
  // Para ESP32:
  // esp_sleep_enable_timer_wakeup(milliseconds * 1000);
  // esp_deep_sleep_start();
  
  // Para ATmega328P, usar watchdog timer
  // Para este ejemplo, usamos delay normal
  delay(milliseconds);
}
```

---

## 📨 Protocolos de Aplicación

### 1. MQTT (Message Queuing Telemetry Transport)

#### **Características Técnicas**

```
📊 Especificaciones:
- Transporte: TCP/IP (Puerto 1883/8883)
- QoS Levels: 0 (At most once), 1 (At least once), 2 (Exactly once)
- Payload: Hasta 256 MB
- Topología: Publish/Subscribe
- Seguridad: TLS/SSL, autenticación
- Keep-alive: Configurable
```

#### **Arquitectura MQTT**

```
🏗️ Componentes:
- Broker: Servidor central de mensajes
- Publisher: Dispositivo que publica datos
- Subscriber: Dispositivo que recibe datos
- Topic: Canal de comunicación

📝 Estructura de Topics:
home/livingroom/temperature
factory/line1/machine01/status
sensors/outdoor/weather/humidity
```

#### **Ejemplo Completo MQTT**

```cpp
// Cliente MQTT para ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Configuración WiFi
const char* ssid = "IoT_Network";
const char* password = "IoT_Password123";

// Configuración MQTT
const char* mqttServer = "iot.eclipse.org";
const int mqttPort = 1883;
const char* mqttUser = "iot_device_001";
const char* mqttPassword = "device_password";

// Topics
const char* sensorTopic = "sensors/outdoor/weather";
const char* commandTopic = "commands/outdoor/actuators";
const char* statusTopic = "status/outdoor/device001";

WiFiClient espClient;
PubSubClient client(espClient);

// Variables de sensores
float temperature = 0.0;
float humidity = 0.0;
float pressure = 0.0;

void setup() {
  Serial.begin(115200);
  
  // Conectar WiFi
  connectWiFi();
  
  // Configurar MQTT
  client.setServer(mqttServer, mqttPort);
  client.setCallback(onMqttMessage);
  
  // Conectar a broker MQTT
  connectMQTT();
  
  // Suscribirse a topics de comandos
  client.subscribe(commandTopic);
  
  // Enviar mensaje de estado inicial
  publishStatus("online");
}

void loop() {
  // Mantener conexión MQTT
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();
  
  // Leer sensores cada 30 segundos
  static unsigned long lastReading = 0;
  if (millis() - lastReading > 30000) {
    readSensors();
    publishSensorData();
    lastReading = millis();
  }
  
  delay(100);
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("WiFi conectado. IP: ");
  Serial.println(WiFi.localIP());
}

void connectMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
  
    // Intentar conexión con Last Will Testament
    if (client.connect("ESP32Client", mqttUser, mqttPassword, 
                       statusTopic, 1, true, "offline")) {
      Serial.println(" conectado");
    
      // Suscribirse a topics
      client.subscribe(commandTopic);
    
      // Publicar estado online
      publishStatus("online");
    
    } else {
      Serial.print(" falló, rc=");
      Serial.print(client.state());
      Serial.println(" reintentando en 5 segundos");
      delay(5000);
    }
  }
}

void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  // Convertir payload a string
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.println("Mensaje recibido [" + String(topic) + "]: " + message);
  
  // Procesar comandos
  if (String(topic) == commandTopic) {
    processCommand(message);
  }
}

void readSensors() {
  // Simular lectura de sensores (reemplazar con sensores reales)
  temperature = 20.0 + random(-50, 50) / 10.0;
  humidity = 50.0 + random(-200, 200) / 10.0;
  pressure = 1013.25 + random(-100, 100) / 10.0;
  
  Serial.printf("Sensores - Temp: %.1f°C, Hum: %.1f%%, Pres: %.1fhPa\n", 
                temperature, humidity, pressure);
}

void publishSensorData() {
  // Crear JSON con datos de sensores
  StaticJsonDocument<200> doc;
  doc["timestamp"] = millis();
  doc["temperature"] = round(temperature * 10) / 10.0;
  doc["humidity"] = round(humidity * 10) / 10.0;
  doc["pressure"] = round(pressure * 10) / 10.0;
  doc["device_id"] = "ESP32_WEATHER_001";
  
  char jsonBuffer[200];
  serializeJson(doc, jsonBuffer);
  
  // Publicar con QoS 1 (at least once)
  if (client.publish(sensorTopic, jsonBuffer, true)) {
    Serial.println("Datos de sensores publicados");
  } else {
    Serial.println("Error publicando datos de sensores");
  }
}

void publishStatus(const char* status) {
  StaticJsonDocument<100> doc;
  doc["status"] = status;
  doc["timestamp"] = millis();
  doc["uptime"] = millis() / 1000;
  
  char jsonBuffer[100];
  serializeJson(doc, jsonBuffer);
  
  client.publish(statusTopic, jsonBuffer, true);
  Serial.println("Estado publicado: " + String(status));
}

void processCommand(String command) {
  // Parsear comando JSON
  StaticJsonDocument<100> doc;
  DeserializationError error = deserializeJson(doc, command);
  
  if (error) {
    Serial.println("Error parseando comando JSON");
    return;
  }
  
  // Procesar diferentes tipos de comandos
  if (doc.containsKey("action")) {
    String action = doc["action"];
  
    if (action == "restart") {
      Serial.println("Reiniciando dispositivo...");
      publishStatus("restarting");
      delay(1000);
      ESP.restart();
    
    } else if (action == "config") {
      // Actualizar configuración
      if (doc.containsKey("interval")) {
        int newInterval = doc["interval"];
        Serial.println("Nuevo intervalo: " + String(newInterval) + " segundos");
        // Implementar cambio de intervalo
      }
    
    } else if (action == "calibrate") {
      Serial.println("Calibrando sensores...");
      // Implementar calibración
      publishStatus("calibrating");
      delay(5000);
      publishStatus("online");
    }
  }
}
```

### 2. CoAP (Constrained Application Protocol)

#### **Características Técnicas**

```
📊 Especificaciones:
- Transporte: UDP (Puerto 5683/5684)
- Payload: Hasta 1024 bytes recomendado
- Métodos: GET, POST, PUT, DELETE
- Topología: Cliente/Servidor, REST-like
- Seguridad: DTLS
- Confirmación: Confirmable/Non-confirmable
```

#### **Ejemplo de Implementación CoAP**

```cpp
// Servidor CoAP para ESP32
#include <WiFi.h>
#include <coap_server.h>

const char* ssid = "IoT_Network";
const char* password = "IoT_Password123";

// Instancia del servidor CoAP
coapServer coap;

// Variables globales de sensores
float currentTemperature = 25.0;
float currentHumidity = 60.0;
bool ledState = false;

void setup() {
  Serial.begin(115200);
  
  // Configurar pin LED
  pinMode(LED_BUILTIN, OUTPUT);
  
  // Conectar WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  // Configurar recursos CoAP
  setupCoapResources();
  
  // Iniciar servidor CoAP
  coap.start();
  Serial.println("Servidor CoAP iniciado en puerto 5683");
}

void loop() {
  coap.loop();
  
  // Actualizar lecturas de sensores
  updateSensors();
  
  delay(100);
}

void setupCoapResources() {
  // Recurso de temperatura (GET)
  coap.server(callback_temperature, "sensors/temperature");
  
  // Recurso de humedad (GET)
  coap.server(callback_humidity, "sensors/humidity");
  
  // Recurso de LED (GET/PUT)
  coap.server(callback_led, "actuators/led");
  
  // Recurso de información del dispositivo (GET)
  coap.server(callback_info, "device/info");
  
  // Recurso observable para datos en tiempo real
  coap.server(callback_realtime, "sensors/realtime");
}

// Callback para temperatura
void callback_temperature(coapPacket &packet, IPAddress ip, int port) {
  char response[64];
  
  if (packet.code == COAP_GET) {
    // Responder con temperatura actual
    snprintf(response, sizeof(response), 
             "{\"temperature\":%.1f,\"unit\":\"celsius\"}", 
             currentTemperature);
  
    coap.sendResponse(ip, port, packet.messageid, response, 
                      strlen(response), COAP_CONTENT, 
                      COAP_APPLICATION_JSON, packet.token, packet.tokenlen);
  } else {
    // Método no permitido
    coap.sendResponse(ip, port, packet.messageid, "", 0, 
                      COAP_METHOD_NOT_ALLOWED, COAP_NONE, 
                      packet.token, packet.tokenlen);
  }
}

// Callback para humedad
void callback_humidity(coapPacket &packet, IPAddress ip, int port) {
  char response[64];
  
  if (packet.code == COAP_GET) {
    snprintf(response, sizeof(response), 
             "{\"humidity\":%.1f,\"unit\":\"percent\"}", 
             currentHumidity);
  
    coap.sendResponse(ip, port, packet.messageid, response, 
                      strlen(response), COAP_CONTENT, 
                      COAP_APPLICATION_JSON, packet.token, packet.tokenlen);
  } else {
    coap.sendResponse(ip, port, packet.messageid, "", 0, 
                      COAP_METHOD_NOT_ALLOWED, COAP_NONE, 
                      packet.token, packet.tokenlen);
  }
}

// Callback para LED (GET/PUT)
void callback_led(coapPacket &packet, IPAddress ip, int port) {
  char response[64];
  
  if (packet.code == COAP_GET) {
    // Obtener estado actual del LED
    snprintf(response, sizeof(response), 
             "{\"led\":\"%s\"}", 
             ledState ? "on" : "off");
  
    coap.sendResponse(ip, port, packet.messageid, response, 
                      strlen(response), COAP_CONTENT, 
                      COAP_APPLICATION_JSON, packet.token, packet.tokenlen);
                    
  } else if (packet.code == COAP_PUT) {
    // Cambiar estado del LED
    String payload = String((char*)packet.payload, packet.payloadlen);
  
    if (payload.indexOf("\"on\"") > -1) {
      ledState = true;
      digitalWrite(LED_BUILTIN, HIGH);
    } else if (payload.indexOf("\"off\"") > -1) {
      ledState = false;
      digitalWrite(LED_BUILTIN, LOW);
    }
  
    // Responder con nuevo estado
    snprintf(response, sizeof(response), 
             "{\"led\":\"%s\",\"result\":\"ok\"}", 
             ledState ? "on" : "off");
  
    coap.sendResponse(ip, port, packet.messageid, response, 
                      strlen(response), COAP_CHANGED, 
                      COAP_APPLICATION_JSON, packet.token, packet.tokenlen);
  } else {
    coap.sendResponse(ip, port, packet.messageid, "", 0, 
                      COAP_METHOD_NOT_ALLOWED, COAP_NONE, 
                      packet.token, packet.tokenlen);
  }
}

// Callback para información del dispositivo
void callback_info(coapPacket &packet, IPAddress ip, int port) {
  if (packet.code == COAP_GET) {
    char response[200];
    snprintf(response, sizeof(response), 
             "{"
             "\"device\":\"ESP32_IoT_Device\","
             "\"firmware\":\"1.0.0\","
             "\"uptime\":%lu,"
             "\"ip\":\"%s\","
             "\"mac\":\"%s\""
             "}", 
             millis() / 1000, 
             WiFi.localIP().toString().c_str(),
             WiFi.macAddress().c_str());
  
    coap.sendResponse(ip, port, packet.messageid, response, 
                      strlen(response), COAP_CONTENT, 
                      COAP_APPLICATION_JSON, packet.token, packet.tokenlen);
  } else {
    coap.sendResponse(ip, port, packet.messageid, "", 0, 
                      COAP_METHOD_NOT_ALLOWED, COAP_NONE, 
                      packet.token, packet.tokenlen);
  }
}

// Callback para datos en tiempo real (observable)
void callback_realtime(coapPacket &packet, IPAddress ip, int port) {
  if (packet.code == COAP_GET) {
    char response[128];
    snprintf(response, sizeof(response), 
             "{"
             "\"timestamp\":%lu,"
             "\"temperature\":%.1f,"
             "\"humidity\":%.1f,"
             "\"led\":\"%s\""
             "}", 
             millis(), 
             currentTemperature, 
             currentHumidity,
             ledState ? "on" : "off");
  
    coap.sendResponse(ip, port, packet.messageid, response, 
                      strlen(response), COAP_CONTENT, 
                      COAP_APPLICATION_JSON, packet.token, packet.tokenlen);
  }
}

void updateSensors() {
  // Simular variación de sensores
  currentTemperature += (random(-10, 10) / 100.0);
  currentHumidity += (random(-10, 10) / 100.0);
  
  // Mantener valores en rangos realistas
  currentTemperature = constrain(currentTemperature, 15.0, 35.0);
  currentHumidity = constrain(currentHumidity, 30.0, 90.0);
}
```

### 3. HTTP/HTTPS REST API

#### **Ejemplo de API REST para IoT**

```cpp
// Servidor HTTP REST para ESP32
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>

const char* ssid = "IoT_Network";
const char* password = "IoT_Password123";

WebServer server(80);

// Estado del dispositivo
struct DeviceState {
  float temperature;
  float humidity;
  bool ledState;
  unsigned long lastUpdate;
  String deviceId;
} deviceState;

void setup() {
  Serial.begin(115200);
  
  // Inicializar SPIFFS para almacenamiento
  if (!SPIFFS.begin(true)) {
    Serial.println("Error montando SPIFFS");
  }
  
  // Inicializar estado del dispositivo
  deviceState.temperature = 25.0;
  deviceState.humidity = 60.0;
  deviceState.ledState = false;
  deviceState.lastUpdate = millis();
  deviceState.deviceId = "ESP32_REST_001";
  
  pinMode(LED_BUILTIN, OUTPUT);
  
  // Conectar WiFi
  connectWiFi();
  
  // Configurar rutas REST API
  setupRestRoutes();
  
  // Iniciar servidor
  server.begin();
  Serial.println("Servidor HTTP REST iniciado");
  Serial.println("API Base URL: http://" + WiFi.localIP().toString());
  printAPIDocumentation();
}

void loop() {
  server.handleClient();
  
  // Actualizar sensores cada 5 segundos
  static unsigned long lastSensorUpdate = 0;
  if (millis() - lastSensorUpdate > 5000) {
    updateSensors();
    lastSensorUpdate = millis();
  }
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("WiFi conectado. IP: ");
  Serial.println(WiFi.localIP());
}

void setupRestRoutes() {
  // CORS headers para todas las respuestas
  server.onNotFound([](){
    if (server.method() == HTTP_OPTIONS) {
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.sendHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
      server.send(200);
    } else {
      server.send(404, "text/plain", "Not Found");
    }
  });
  
  // GET /api/status - Estado general del dispositivo
  server.on("/api/status", HTTP_GET, handleGetStatus);
  
  // GET /api/sensors - Todos los sensores
  server.on("/api/sensors", HTTP_GET, handleGetSensors);
  
  // GET /api/sensors/temperature - Solo temperatura
  server.on("/api/sensors/temperature", HTTP_GET, handleGetTemperature);
  
  // GET /api/sensors/humidity - Solo humedad
  server.on("/api/sensors/humidity", HTTP_GET, handleGetHumidity);
  
  // GET /api/actuators/led - Estado del LED
  server.on("/api/actuators/led", HTTP_GET, handleGetLed);
  
  // PUT /api/actuators/led - Controlar LED
  server.on("/api/actuators/led", HTTP_PUT, handlePutLed);
  
  // POST /api/config - Configurar dispositivo
  server.on("/api/config", HTTP_POST, handlePostConfig);
  
  // GET /api/history - Historial de datos
  server.on("/api/history", HTTP_GET, handleGetHistory);
  
  // GET /api/info - Información del dispositivo
  server.on("/api/info", HTTP_GET, handleGetInfo);
  
  // GET / - Documentación de la API
  server.on("/", HTTP_GET, handleGetDocs);
}

void handleGetStatus() {
  setCORSHeaders();
  
  StaticJsonDocument<200> doc;
  doc["status"] = "online";
  doc["uptime"] = millis() / 1000;
  doc["timestamp"] = millis();
  doc["device_id"] = deviceState.deviceId;
  doc["wifi_rssi"] = WiFi.RSSI();
  doc["free_heap"] = ESP.getFreeHeap();
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleGetSensors() {
  setCORSHeaders();
  
  StaticJsonDocument<200> doc;
  doc["temperature"] = deviceState.temperature;
  doc["humidity"] = deviceState.humidity;
  doc["timestamp"] = deviceState.lastUpdate;
  doc["device_id"] = deviceState.deviceId;
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleGetTemperature() {
  setCORSHeaders();
  
  StaticJsonDocument<100> doc;
  doc["temperature"] = deviceState.temperature;
  doc["unit"] = "celsius";
  doc["timestamp"] = deviceState.lastUpdate;
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleGetHumidity() {
  setCORSHeaders();
  
  StaticJsonDocument<100> doc;
  doc["humidity"] = deviceState.humidity;
  doc["unit"] = "percent";
  doc["timestamp"] = deviceState.lastUpdate;
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleGetLed() {
  setCORSHeaders();
  
  StaticJsonDocument<100> doc;
  doc["led"] = deviceState.ledState ? "on" : "off";
  doc["timestamp"] = millis();
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handlePutLed() {
  setCORSHeaders();
  
  if (server.hasArg("plain")) {
    StaticJsonDocument<100> requestDoc;
    DeserializationError error = deserializeJson(requestDoc, server.arg("plain"));
  
    if (!error && requestDoc.containsKey("state")) {
      String state = requestDoc["state"];
    
      if (state == "on") {
        deviceState.ledState = true;
        digitalWrite(LED_BUILTIN, HIGH);
      } else if (state == "off") {
        deviceState.ledState = false;
        digitalWrite(LED_BUILTIN, LOW);
      } else {
        server.send(400, "application/json", "{\"error\":\"Invalid state. Use 'on' or 'off'\"}");
        return;
      }
    
      // Respuesta exitosa
      StaticJsonDocument<100> responseDoc;
      responseDoc["led"] = deviceState.ledState ? "on" : "off";
      responseDoc["result"] = "success";
      responseDoc["timestamp"] = millis();
    
      String response;
      serializeJson(responseDoc, response);
      server.send(200, "application/json", response);
    
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid JSON or missing 'state' field\"}");
    }
  } else {
    server.send(400, "application/json", "{\"error\":\"No JSON body provided\"}");
  }
}

void handlePostConfig() {
  setCORSHeaders();
  
  if (server.hasArg("plain")) {
    StaticJsonDocument<200> configDoc;
    DeserializationError error = deserializeJson(configDoc, server.arg("plain"));
  
    if (!error) {
      // Procesar configuración
      bool configChanged = false;
    
      if (configDoc.containsKey("device_id")) {
        deviceState.deviceId = configDoc["device_id"].as<String>();
        configChanged = true;
      }
    
      if (configDoc.containsKey("sensor_interval")) {
        // Implementar cambio de intervalo de sensores
        configChanged = true;
      }
    
      if (configChanged) {
        // Guardar configuración en SPIFFS
        saveConfig();
      
        server.send(200, "application/json", "{\"result\":\"Configuration updated\"}");
      } else {
        server.send(400, "application/json", "{\"error\":\"No valid configuration parameters\"}");
      }
    } else {
      server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    }
  } else {
    server.send(400, "application/json", "{\"error\":\"No JSON body provided\"}");
  }
}

void handleGetHistory() {
  setCORSHeaders();
  
  // Leer historial desde SPIFFS (implementación simplificada)
  File historyFile = SPIFFS.open("/history.json", "r");
  
  if (historyFile) {
    String historyData = historyFile.readString();
    historyFile.close();
    server.send(200, "application/json", historyData);
  } else {
    server.send(200, "application/json", "{\"history\":[],\"message\":\"No history available\"}");
  }
}

void handleGetInfo() {
  setCORSHeaders();
  
  StaticJsonDocument<300> doc;
  doc["device_id"] = deviceState.deviceId;
  doc["firmware_version"] = "1.0.0";
  doc["hardware"] = "ESP32";
  doc["ip_address"] = WiFi.localIP().toString();
  doc["mac_address"] = WiFi.macAddress();
  doc["wifi_ssid"] = WiFi.SSID();
  doc["wifi_rssi"] = WiFi.RSSI();
  doc["uptime_seconds"] = millis() / 1000;
  doc["free_heap"] = ESP.getFreeHeap();
  doc["flash_size"] = ESP.getFlashChipSize();
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleGetDocs() {
  String html = R"(
<!DOCTYPE html>
<html>
<head>
    <title>IoT Device REST API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .method { font-weight: bold; color: #2196F3; }
        code { background: #f5f5f5; padding: 2px 4px; }
    </style>
</head>
<body>
    <h1>IoT Device REST API Documentation</h1>
  
    <div class="endpoint">
        <div class="method">GET /api/status</div>
        <p>Get device status and general information</p>
    </div>
  
    <div class="endpoint">
        <div class="method">GET /api/sensors</div>
        <p>Get all sensor readings</p>
    </div>
  
    <div class="endpoint">
        <div class="method">GET /api/sensors/temperature</div>
        <p>Get temperature reading only</p>
    </div>
  
    <div class="endpoint">
        <div class="method">GET /api/actuators/led</div>
        <p>Get LED state</p>
    </div>
  
    <div class="endpoint">
        <div class="method">PUT /api/actuators/led</div>
        <p>Control LED state</p>
        <p>Body: <code>{"state": "on"}</code> or <code>{"state": "off"}</code></p>
    </div>
  
    <div class="endpoint">
        <div class="method">GET /api/info</div>
        <p>Get detailed device information</p>
    </div>
</body>
</html>
  )";
  
  server.send(200, "text/html", html);
}

void setCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void updateSensors() {
  // Simular lecturas de sensores
  deviceState.temperature += (random(-20, 20) / 100.0);
  deviceState.humidity += (random(-30, 30) / 100.0);
  
  // Mantener valores realistas
  deviceState.temperature = constrain(deviceState.temperature, 15.0, 35.0);
  deviceState.humidity = constrain(deviceState.humidity, 30.0, 90.0);
  
  deviceState.lastUpdate = millis();
  
  // Guardar en historial periódicamente
  static unsigned long lastSave = 0;
  if (millis() - lastSave > 60000) { // Cada minuto
    saveToHistory();
    lastSave = millis();
  }
}

void saveConfig() {
  StaticJsonDocument<200> doc;
  doc["device_id"] = deviceState.deviceId;
  
  File configFile = SPIFFS.open("/config.json", "w");
  if (configFile) {
    serializeJson(doc, configFile);
    configFile.close();
  }
}

void saveToHistory() {
  // Implementación simplificada del historial
  StaticJsonDocument<1000> historyDoc;
  
  // Cargar historial existente
  File historyFile = SPIFFS.open("/history.json", "r");
  if (historyFile) {
    deserializeJson(historyDoc, historyFile);
    historyFile.close();
  }
  
  // Agregar nueva entrada
  JsonArray history = historyDoc["history"];
  if (history.isNull()) {
    history = historyDoc.createNestedArray("history");
  }
  
  JsonObject entry = history.createNestedObject();
  entry["timestamp"] = deviceState.lastUpdate;
  entry["temperature"] = deviceState.temperature;
  entry["humidity"] = deviceState.humidity;
  
  // Mantener solo las últimas 100 entradas
  if (history.size() > 100) {
    history.remove(0);
  }
  
  // Guardar historial actualizado
  historyFile = SPIFFS.open("/history.json", "w");
  if (historyFile) {
    serializeJson(historyDoc, historyFile);
    historyFile.close();
  }
}

void printAPIDocumentation() {
  Serial.println("\n=== API Documentation ===");
  Serial.println("GET  /api/status           - Device status");
  Serial.println("GET  /api/sensors          - All sensors");
  Serial.println("GET  /api/sensors/temperature - Temperature only");
  Serial.println("GET  /api/sensors/humidity - Humidity only");
  Serial.println("GET  /api/actuators/led    - LED state");
  Serial.println("PUT  /api/actuators/led    - Control LED");
  Serial.println("POST /api/config           - Update config");
  Serial.println("GET  /api/history          - Data history");
  Serial.println("GET  /api/info             - Device info");
  Serial.println("GET  /                     - API documentation");
  Serial.println("=========================\n");
}
```

---

## 🕸️ Protocolos de Red Mesh

### 1. Thread

#### **Características Técnicas**

```
📊 Especificaciones:
- Base: IEEE 802.15.4
- Frecuencia: 2.4 GHz
- Alcance: 10-30 metros por hop
- Topología: Mesh auto-organizante
- Nodos: Hasta 250 por red
- IPv6: Nativo
- Seguridad: AES-128
```

#### **Tipos de Dispositivos Thread**

```
🏗️ Roles en la Red:
- Leader: Gestiona la red, único por red
- Router: Rutea tráfico, máximo 32 activos
- Router Eligible End Device (REED): Puede convertirse en router
- Minimal Thread Device (MTD): Solo end device
- Sleepy End Device: Modo de bajo consumo

🔧 Servicios:
- Border Router: Conecta Thread a internet
- Commissioner: Autoriza nuevos dispositivos
- Joiner: Dispositivo que se une a la red
```

### 2. Matter (Project CHIP)

#### **Características del Protocolo**

```
📊 Especificaciones Matter:
- Transporte: Thread, Wi-Fi, Ethernet
- Aplicación: Basado en clusters
- Interoperabilidad: Cross-platform
- Seguridad: PKI, certificados
- Discovery: mDNS/DNS-SD
- Comisioning: QR codes, NFC
```

#### **Ejemplo de Implementación Matter**

```cpp
// Ejemplo simplificado de dispositivo Matter (Light Bulb)
#include <platform/CHIPDeviceLayer.h>
#include <app/server/Server.h>
#include <app/util/af.h>

using namespace chip;
using namespace chip::app;
using namespace chip::DeviceLayer;

// Endpoints del dispositivo
constexpr EndpointId kLightEndpointId = 1;

// Estado del dispositivo
bool lightState = false;
uint8_t lightLevel = 254; // Máximo brillo

void setup() {
  Serial.begin(115200);
  
  // Inicializar Matter stack
  CHIP_ERROR err = PlatformMgr().InitChipStack();
  if (err != CHIP_NO_ERROR) {
    Serial.println("Error inicializando Matter stack");
    return;
  }
  
  // Configurar callbacks para clusters
  setupMatterCallbacks();
  
  // Inicializar servidor Matter
  Server::GetInstance().Init();
  
  // Configurar LED físico
  pinMode(LED_BUILTIN, OUTPUT);
  updatePhysicalLight();
  
  Serial.println("Dispositivo Matter inicializado");
  Serial.println("Esperando comisionado...");
}

void loop() {
  // Procesar eventos Matter
  PlatformMgr().RunEventLoop();
}

void setupMatterCallbacks() {
  // Callback para On/Off cluster
  emberAfOnOffClusterServerAttributeChangedCallback(
    kLightEndpointId,
    ZCL_ON_OFF_ATTRIBUTE_ID
  );
  
  // Callback para Level Control cluster
  emberAfLevelControlClusterServerAttributeChangedCallback(
    kLightEndpointId,
    ZCL_CURRENT_LEVEL_ATTRIBUTE_ID
  );
}

// Callback cuando cambia el estado On/Off
void emberAfOnOffClusterServerAttributeChangedCallback(EndpointId endpoint, AttributeId attributeId) {
  if (endpoint == kLightEndpointId && attributeId == ZCL_ON_OFF_ATTRIBUTE_ID) {
    // Leer nuevo estado
    bool newState;
    Attributes::OnOff::Get(endpoint, &newState);
  
    if (newState != lightState) {
      lightState = newState;
      updatePhysicalLight();
    
      Serial.printf("Luz %s\n", lightState ? "encendida" : "apagada");
    }
  }
}

// Callback cuando cambia el nivel de brillo
void emberAfLevelControlClusterServerAttributeChangedCallback(EndpointId endpoint, AttributeId attributeId) {
  if (endpoint == kLightEndpointId && attributeId == ZCL_CURRENT_LEVEL_ATTRIBUTE_ID) {
    // Leer nuevo nivel
    uint8_t newLevel;
    Attributes::CurrentLevel::Get(endpoint, &newLevel);
  
    if (newLevel != lightLevel) {
      lightLevel = newLevel;
      updatePhysicalLight();
    
      Serial.printf("Nivel de brillo: %d\n", lightLevel);
    }
  }
}

void updatePhysicalLight() {
  if (lightState) {
    // Encender LED con el nivel apropiado
    // Para este ejemplo simple, usamos PWM
    int pwmValue = map(lightLevel, 0, 254, 0, 255);
    analogWrite(LED_BUILTIN, pwmValue);
  } else {
    // Apagar LED
    digitalWrite(LED_BUILTIN, LOW);
  }
}

// Función para reportar cambios de estado al cluster
void reportStateChange() {
  // Reportar estado On/Off
  Attributes::OnOff::Set(kLightEndpointId, lightState);
  
  // Reportar nivel actual
  Attributes::CurrentLevel::Set(kLightEndpointId, lightLevel);
}
```

---

## ⚖️ Comparación y Selección

### Tabla Comparativa Completa


| Protocolo   | Alcance | Throughput    | Consumo    | Topología      | Uso Principal             |
| ----------- | ------- | ------------- | ---------- | --------------- | ------------------------- |
| **Wi-Fi**   | 30-100m | 1Mbps-9.6Gbps | Alto       | Infraestructura | Multimedia, datos pesados |
| **BLE**     | 1-100m  | 1-3 Mbps      | Muy bajo   | Estrella/Mesh   | Wearables, beacons        |
| **Zigbee**  | 10-100m | 20-250 kbps   | Bajo       | Mesh            | Smart home, sensores      |
| **Thread**  | 10-30m  | 250 kbps      | Bajo       | Mesh            | Smart home, Matter        |
| **LoRaWAN** | 2-45km  | 0.3-50 kbps   | Ultra bajo | Estrella        | IoT urbano, agricultura   |
| **NB-IoT**  | 1-35km  | 26-127 kbps   | Bajo       | Celular         | Smart cities, medidores   |
| **Sigfox**  | 3-50km  | 100-600 bps   | Ultra bajo | Estrella        | Tracking, monitoreo       |

### Matriz de Decisión

```mermaid
graph TD
    A[Seleccionar Protocolo IoT] --> B{Alcance Requerido}
  
    B -->|Local < 100m| C{Throughput}
    B -->|Urbano 1-10km| D{Infraestructura}
    B -->|Rural > 10km| E[LoRaWAN/Sigfox]
  
    C -->|Alto > 1Mbps| F[Wi-Fi]
    C -->|Medio 100kbps-1Mbps| G[BLE/Thread]
    C -->|Bajo < 100kbps| H[Zigbee]
  
    D -->|Existente| I[NB-IoT/LTE-M]
    D -->|Nueva| J[LoRaWAN]
  
    E -->|Pocos mensajes| K[Sigfox]
    E -->|Más flexibilidad| L[LoRaWAN]
```

### Casos de Uso por Aplicación

#### **Smart Home**

```
🏠 Recomendaciones por Dispositivo:

Termostatos/Luces:
✅ Primera opción: Thread/Matter
✅ Segunda opción: Zigbee
❌ Evitar: Wi-Fi (consumo), LoRaWAN (overkill)

Cámaras de Seguridad:
✅ Primera opción: Wi-Fi
✅ Segunda opción: Ethernet
❌ Evitar: BLE (throughput), Zigbee (ancho de banda)

Sensores de Puerta/Ventana:
✅ Primera opción: Zigbee
✅ Segunda opción: Thread
❌ Evitar: Wi-Fi (consumo), LoRaWAN (latencia)

Asistentes de Voz:
✅ Primera opción: Wi-Fi
✅ Segunda opción: Ethernet
❌ Evitar: Protocolos de baja velocidad
```

#### **Industrial IoT**

```
🏭 Recomendaciones por Aplicación:

Monitoreo de Maquinaria:
✅ Primera opción: Wi-Fi (datos críticos)
✅ Segunda opción: NB-IoT (remote)
❌ Evitar: BLE (alcance), Sigfox (latencia)

Sensores Ambientales:
✅ Primera opción: LoRaWAN
✅ Segunda opción: NB-IoT
❌ Evitar: Wi-Fi (cobertura), Thread (alcance)

Asset Tracking:
✅ Primera opción: NB-IoT + GPS
✅ Segunda opción: LoRaWAN + GPS
❌ Evitar: Protocolos de corto alcance

Mantenimiento Predictivo:
✅ Primera opción: Wi-Fi (datos en tiempo real)
✅ Segunda opción: Ethernet industrial
❌ Evitar: Protocolos con límites de datos
```

#### **Smart Cities**

```
🏙️ Recomendaciones por Infraestructura:

Smart Parking:
✅ Primera opción: LoRaWAN
✅ Segunda opción: NB-IoT
❌ Evitar: Wi-Fi (cobertura), BLE (alcance)

Calidad del Aire:
✅ Primera opción: LoRaWAN
✅ Segunda opción: NB-IoT
❌ Evitar: Sigfox (frecuencia de datos)

Smart Lighting:
✅ Primera opción: Thread/Matter
✅ Segunda opción: LoRaWAN
❌ Evitar: Wi-Fi (infraestructura), BLE (mesh)

Gestión de Residuos:
✅ Primera opción: LoRaWAN
✅ Segunda opción: Sigfox
❌ Evitar: Wi-Fi (ubicación), cellular (costo)
```

---

## 🔒 Seguridad en Protocolos IoT

### Niveles de Seguridad por Protocolo

#### **Encriptación y Autenticación**

```
🔐 Análisis de Seguridad:

Wi-Fi (WPA3):
- Encriptación: AES-256
- Autenticación: SAE (Simultaneous Authentication of Equals)
- Vulnerabilidades: Ataques de diccionario, WPS
- Mitigación: Desactivar WPS, contraseñas fuertes

BLE (Bluetooth 5.0+):
- Encriptación: AES-128
- Autenticación: Numeric comparison, passkey
- Vulnerabilidades: MITM durante pairing
- Mitigación: Out-of-band pairing, regular re-pairing

Zigbee 3.0:
- Encriptación: AES-128
- Autenticación: Install codes, certificates
- Vulnerabilidades: Ataques durante commissioning
- Mitigación: Secure commissioning, network keys rotativos

LoRaWAN:
- Encriptación: AES-128 (doble capa)
- Autenticación: OTAA (Over-The-Air Activation)
- Vulnerabilidades: Replay attacks, key management
- Mitigación: Frame counters, secure key storage
```

#### **Implementación de Seguridad**

```cpp
// Ejemplo de implementación segura para MQTT over TLS
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// Certificados (en producción, almacenar en secure element)
const char* ca_cert = R"(
-----BEGIN CERTIFICATE-----
MIIDSjCCAjKgAwIBAgIQRK+wgNajJ7qJMDmGLvhAazANBgkqhkiG9w0BAQUFADA/
...
-----END CERTIFICATE-----
)";

const char* client_cert = R"(
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
...
-----END CERTIFICATE-----
)";

const char* client_key = R"(
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btNjcmQ
...
-----END RSA PRIVATE KEY-----
)";

WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

void setupSecureMQTT() {
  // Configurar certificados
  espClient.setCACert(ca_cert);
  espClient.setCertificate(client_cert);
  espClient.setPrivateKey(client_key);
  
  // Configurar servidor MQTT con TLS
  mqttClient.setServer("secure-mqtt.example.com", 8883);
  mqttClient.setCallback(onMqttMessage);
  
  // Conectar con autenticación mutua
  connectSecureMQTT();
}

void connectSecureMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Conectando a MQTT seguro...");
  
    // Usar client ID único basado en MAC
    String clientId = "SecureDevice_" + WiFi.macAddress();
    clientId.replace(":", "");
  
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println(" conectado");
    
      // Suscribirse a topics con validación
      mqttClient.subscribe("commands/+/validate");
    
    } else {
      Serial.print(" falló, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" reintentando en 5 segundos");
      delay(5000);
    }
  }
}

void onMqttMessage(char* topic, byte* payload, unsigned int length) {
  // Validar mensaje antes de procesar
  if (!validateMessage(topic, payload, length)) {
    Serial.println("Mensaje rechazado: validación falló");
    return;
  }
  
  // Procesar mensaje validado
  processValidatedMessage(topic, payload, length);
}

bool validateMessage(char* topic, byte* payload, unsigned int length) {
  // Implementar validación de:
  // 1. Formato del topic
  // 2. Tamaño del payload
  // 3. Estructura JSON válida
  // 4. Timestamp reciente (prevenir replay attacks)
  // 5. Firma digital si es requerida
  
  // Validar tamaño máximo
  if (length > 1024) {
    return false;
  }
  
  // Validar formato JSON
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    return false;
  }
  
  // Validar timestamp (ventana de 5 minutos)
  if (doc.containsKey("timestamp")) {
    unsigned long msgTimestamp = doc["timestamp"];
    unsigned long currentTime = millis() / 1000;
  
    if (abs((long)(currentTime - msgTimestamp)) > 300) {
      return false; // Mensaje muy antiguo o futuro
    }
  }
  
  return true;
}

// Función para enviar datos con firma digital
void publishSecureData(const char* topic, JsonDocument& data) {
  // Agregar timestamp
  data["timestamp"] = millis() / 1000;
  
  // Calcular hash del mensaje
  String messageStr;
  serializeJson(data, messageStr);
  data["hash"] = calculateHash(messageStr);
  
  // Serializar mensaje final
  String finalMessage;
  serializeJson(data, finalMessage);
  
  // Publicar con QoS 1 para garantizar entrega
  if (!mqttClient.publish(topic, finalMessage.c_str(), true)) {
    Serial.println("Error publicando mensaje seguro");
  }
}

String calculateHash(const String& message) {
  // Implementar hash SHA-256 del mensaje
  // En producción, usar library como mbedtls
  // Para este ejemplo, usamos un hash simple
  
  uint32_t hash = 0;
  for (int i = 0; i < message.length(); i++) {
    hash = hash * 31 + message[i];
  }
  
  return String(hash, HEX);
}
```

### Best Practices de Seguridad

#### **Gestión de Claves**

```cpp
// Ejemplo de rotación de claves automática
class KeyManager {
private:
  String currentKey;
  String nextKey;
  unsigned long keyRotationInterval = 86400000; // 24 horas
  unsigned long lastRotation = 0;
  
public:
  void initializeKeys() {
    // Cargar claves desde secure storage
    currentKey = loadFromSecureStorage("current_key");
    nextKey = generateNewKey();
    lastRotation = millis();
  }
  
  void checkKeyRotation() {
    if (millis() - lastRotation > keyRotationInterval) {
      rotateKeys();
    }
  }
  
  void rotateKeys() {
    Serial.println("Rotando claves de seguridad...");
  
    // Mover next key a current
    currentKey = nextKey;
  
    // Generar nueva next key
    nextKey = generateNewKey();
  
    // Guardar en secure storage
    saveToSecureStorage("current_key", currentKey);
    saveToSecureStorage("next_key", nextKey);
  
    // Notificar al servidor sobre nueva clave
    notifyKeyRotation();
  
    lastRotation = millis();
  }
  
  String getCurrentKey() {
    return currentKey;
  }
  
private:
  String generateNewKey() {
    // Generar clave criptográficamente segura
    String key = "";
    for (int i = 0; i < 32; i++) {
      key += String(random(0, 256), HEX);
    }
    return key;
  }
  
  void notifyKeyRotation() {
    // Enviar notificación segura al servidor
    StaticJsonDocument<200> notification;
    notification["action"] = "key_rotation";
    notification["device_id"] = WiFi.macAddress();
    notification["new_key_hash"] = calculateHash(nextKey);
    notification["timestamp"] = millis() / 1000;
  
    publishSecureData("security/key_rotation", notification);
  }
};

KeyManager keyManager;

void setup() {
  // Inicializar gestor de claves
  keyManager.initializeKeys();
}

void loop() {
  // Verificar rotación de claves
  keyManager.checkKeyRotation();
  
  // Resto de la lógica
  delay(1000);
}
```

---

## 🚀 Futuro de los Protocolos IoT

### Tendencias Emergentes

#### **1. Protocols Convergence**

```
🔄 Convergencia de Protocolos:

Matter over Thread:
- Unificación de smart home
- Interoperabilidad cross-vendor
- IPv6 end-to-end
- Secure commissioning

5G IoT Evolution:
- Network slicing para IoT
- Ultra-low latency (1ms)
- Massive IoT connections (1M devices/km²)
- Energy efficiency improvements

AI-Driven Protocol Selection:
- Adaptive protocol switching
- Context-aware communication
- Predictive maintenance
- Self-healing networks
```

#### **2. Edge Computing Integration**

```cpp
// Ejemplo de protocolo adaptativo con edge computing
class AdaptiveProtocol {
private:
  enum ProtocolType { WIFI, BLE, ZIGBEE, LORAWAN };
  ProtocolType currentProtocol = WIFI;
  
  struct NetworkMetrics {
    int signalStrength;
    float batteryLevel;
    int dataSize;
    bool isCritical;
    int latencyRequirement;
  };

public:
  void optimizeProtocol(NetworkMetrics metrics) {
    ProtocolType optimalProtocol = selectOptimalProtocol(metrics);
  
    if (optimalProtocol != currentProtocol) {
      switchProtocol(optimalProtocol);
    }
  }
  
private:
  ProtocolType selectOptimalProtocol(NetworkMetrics metrics) {
    // AI-driven protocol selection
    float wifiScore = calculateWiFiScore(metrics);
    float bleScore = calculateBLEScore(metrics);
    float zigbeeScore = calculateZigbeeScore(metrics);
    float lorawanScore = calculateLoRaWANScore(metrics);
  
    // Return protocol with highest score
    float maxScore = max({wifiScore, bleScore, zigbeeScore, lorawanScore});
  
    if (maxScore == wifiScore) return WIFI;
    if (maxScore == bleScore) return BLE;
    if (maxScore == zigbeeScore) return ZIGBEE;
    return LORAWAN;
  }
  
  float calculateWiFiScore(NetworkMetrics metrics) {
    float score = 0.0;
  
    // High throughput bonus
    if (metrics.dataSize > 1000) score += 0.4;
  
    // Signal strength factor
    score += (metrics.signalStrength + 100) / 100.0 * 0.3;
  
    // Battery penalty
    if (metrics.batteryLevel < 20) score -= 0.5;
  
    // Critical data bonus
    if (metrics.isCritical) score += 0.2;
  
    return constrain(score, 0.0, 1.0);
  }
  
  void switchProtocol(ProtocolType newProtocol) {
    Serial.println("Cambiando protocolo a: " + getProtocolName(newProtocol));
  
    // Gracefully disconnect current protocol
    disconnectCurrentProtocol();
  
    // Initialize new protocol
    initializeProtocol(newProtocol);
  
    currentProtocol = newProtocol;
  }
};
```

### Roadmap Tecnológico 2024-2030

```mermaid
timeline
    title Evolución de Protocolos IoT
  
    2024 : Matter 1.2 Release
         : Wi-Fi 7 IoT adaptations
         : LoRaWAN 1.1 widespread
  
    2025 : 5G RedCap deployment
         : Thread 1.4 with ML
         : Quantum-safe protocols
  
    2026 : 6G IoT research
         : AI-native protocols
         : Satellite IoT integration
  
    2027 : Holographic IoT apps
         : Brain-computer interfaces
         : Ambient computing protocols
  
    2028 : Quantum IoT networks
         : Self-evolving protocols
         : Molecular communication
  
    2030 : Neural protocol networks
         : Consciousness-aware IoT
         : Universal IoT language
```

---

Esta guía completa de protocolos IoT te proporciona todo lo necesario para seleccionar e implementar el protocolo correcto para cualquier proyecto IoT. Cada protocolo tiene su lugar específico en el ecosistema, y la clave está en entender cuándo y cómo usar cada uno para maximizar la eficiencia y funcionalidad de tu sistema IoT.

¡Implementa estos ejemplos y crea dispositivos IoT robustos y escalables! 🚀
