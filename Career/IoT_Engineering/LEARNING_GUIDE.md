# IoT Engineering - Learning Guide

## 🎯 Goal
Master Internet of Things — connecting sensors, devices, and the cloud to build smart systems for homes, industry, agriculture, and cities.

---

## Prerequisites
✅ Programming — C/C++ (embedded), Python (cloud/ML), JavaScript (web dashboards)
✅ Electronics — Basic circuits, sensors, microcontrollers
✅ Networking — TCP/IP, HTTP, DNS, Wi-Fi basics

---

## Core Concepts (in order)

1. **IoT Architecture** — Edge → Gateway → Cloud → Application
2. **Microcontrollers** — Arduino, ESP32, ESP8266, Raspberry Pi
3. **Sensors & Actuators** — Temperature, humidity, motion, relays, motors
4. **Wireless Communication** — Wi-Fi, Bluetooth, LoRa, Zigbee, NB-IoT
5. **IoT Protocols** — MQTT, CoAP, HTTP REST, WebSocket
6. **Cloud Platforms** — AWS IoT, Azure IoT, Google IoT, ThingSpeak
7. **Data Storage** — InfluxDB, MongoDB, Firebase, time-series DBs
8. **Dashboards** — Grafana, Node-RED, Blynk, custom web apps
9. **Edge Computing** — Local processing, TinyML, edge AI
10. **Security** — TLS, authentication, OTA updates, device identity
11. **Industrial IoT (IIoT)** — SCADA, PLC, Industry 4.0, digital twins

---

## Quick Reference

### ESP32 — Connect to Wi-Fi & Send Data
```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("Connected!");
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("http://api.example.com/data");
        http.addHeader("Content-Type", "application/json");
        
        String payload = "{\"temperature\": 25.5, \"humidity\": 60}";
        int responseCode = http.POST(payload);
        
        Serial.println(responseCode);
        http.end();
    }
    delay(30000); // Send every 30 seconds
}
```

### MQTT — Publish Sensor Data
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    WiFi.begin("SSID", "PASS");
    client.setServer("broker.hivemq.com", 1883);
    client.connect("ESP32_Device");
}

void loop() {
    float temp = readTemperature(); // Your sensor function
    char msg[50];
    sprintf(msg, "%.2f", temp);
    client.publish("home/temperature", msg);
    client.loop();
    delay(5000);
}
```

### Python — MQTT Subscriber (Cloud Side)
```python
import paho.mqtt.client as mqtt

def on_message(client, userdata, msg):
    print(f"Topic: {msg.topic}")
    print(f"Data: {msg.payload.decode()}")

client = mqtt.Client()
client.on_message = on_message
client.connect("broker.hivemq.com", 1883)
client.subscribe("home/temperature")
client.loop_forever()
```

### Node-RED — Visual IoT Programming
```
Install: npm install -g node-red
Run:     node-red
Open:    http://localhost:1880
```

---

## 🛠️ Tools & Platforms

| Category | Tools |
|----------|-------|
| **MCUs** | ESP32, ESP8266, Arduino, Raspberry Pi, STM32 |
| **Protocols** | MQTT, CoAP, HTTP, WebSocket, LoRaWAN |
| **Cloud** | AWS IoT Core, Azure IoT Hub, Google Cloud IoT |
| **Free Cloud** | ThingSpeak, Blynk, Adafruit IO, Firebase |
| **Dashboards** | Grafana, Node-RED, Blynk app |
| **Databases** | InfluxDB, MongoDB, Firebase Realtime DB |
| **IDE** | Arduino IDE, PlatformIO, VS Code |
| **Simulation** | Wokwi (free ESP32 simulator!) |

---

## IoT Protocol Comparison

| Protocol | Best For | Port | QoS |
|----------|----------|------|-----|
| **MQTT** | Lightweight messaging | 1883 | 0,1,2 |
| **HTTP** | Request-response, REST APIs | 80/443 | N/A |
| **CoAP** | Constrained devices | 5683 | Confirmable |
| **WebSocket** | Real-time bidirectional | 80/443 | N/A |
| **LoRaWAN** | Long range, low power | N/A | N/A |

---

## Wireless Technology Comparison

| Technology | Range | Power | Data Rate | Use Case |
|------------|-------|-------|-----------|----------|
| **Wi-Fi** | 50m | High | 100+ Mbps | Home IoT |
| **Bluetooth** | 10m | Low | 1-3 Mbps | Wearables |
| **BLE** | 30m | Very Low | 1 Mbps | Sensors |
| **LoRa** | 15km | Very Low | 50 kbps | Agriculture |
| **Zigbee** | 100m | Low | 250 kbps | Smart home |
| **NB-IoT** | 10km | Low | 200 kbps | Metering |

---

## Career Paths

| Role | Focus |
|------|-------|
| **IoT Developer** | Embedded + cloud, full-stack IoT |
| **Embedded Engineer** | Firmware, MCU programming |
| **Cloud IoT Engineer** | AWS/Azure IoT, data pipelines |
| **IoT Solutions Architect** | System design, integration |
| **Edge AI Engineer** | TinyML, local inference |
| **IIoT Engineer** | Industrial automation, SCADA |

---

## Companies (India)
- Tata Elxsi, Wipro, Infosys (IoT divisions)
- Bosch India, Honeywell
- Smartron, Stellapps (agri-IoT)
- Entrib, Altizon (IIoT)
- Reliance Jio (JioThings)

---

## Tips
- **Start with ESP32** — best value MCU with Wi-Fi + Bluetooth
- **Learn MQTT** — it's THE IoT protocol
- **Use Wokwi.com** — free online ESP32 simulator
- **Build real projects** — smart home is the easiest starting point
- **Security matters** — never hardcode credentials, use TLS
- **Think about power** — battery life is critical for real deployments

Connect everything! 🌐
