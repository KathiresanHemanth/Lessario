# IoT Engineering - Project-Based Learning Roadmap

## Level 1: Getting Started (Weeks 1-3)

### Project 1: Wi-Fi Weather Station
- ESP32 reads DHT22 (temp/humidity), sends to ThingSpeak
- **Concepts**: ESP32 basics, sensor reading, HTTP POST, cloud
- **Difficulty**: ⭐

### Project 2: Smart LED Controller
- Control LED via web browser (ESP32 web server)
- **Concepts**: ESP32 web server, HTML, GPIO control
- **Difficulty**: ⭐

### Project 3: MQTT Temperature Monitor
- Publish sensor data via MQTT, subscribe from PC
- **Concepts**: MQTT, pub/sub, broker (HiveMQ), QoS
- **Difficulty**: ⭐⭐

### Project 4: Motion Detection Alert
- PIR sensor triggers notification to phone (via IFTTT/Blynk)
- **Concepts**: PIR sensor, webhook, push notifications
- **Difficulty**: ⭐⭐

---

## Level 2: Smart Home (Weeks 4-7)

### Project 5: Smart Home Dashboard
- Control multiple devices from a web dashboard
- **Concepts**: Node-RED, MQTT, web UI, multiple sensors
- **Difficulty**: ⭐⭐

### Project 6: Smart Door Lock
- RFID + keypad door lock with logging
- **Concepts**: RC522 RFID, keypad matrix, EEPROM, servo
- **Difficulty**: ⭐⭐⭐

### Project 7: Energy Monitor
- Measure AC current with CT sensor, track usage over time
- **Concepts**: Current transformer, ADC, power calculation
- **Difficulty**: ⭐⭐⭐

### Project 8: Automated Plant Watering
- Soil moisture sensor triggers water pump automatically
- **Concepts**: Soil sensor, relay, scheduling, alerts
- **Difficulty**: ⭐⭐

---

## Level 3: Cloud & Data (Weeks 8-11)

### Project 9: Firebase Real-Time Dashboard
- ESP32 → Firebase → React/HTML dashboard in real-time
- **Concepts**: Firebase RTDB, REST API, real-time sync
- **Difficulty**: ⭐⭐⭐

### Project 10: Data Logger with Grafana
- Log sensor data to InfluxDB, visualize in Grafana
- **Concepts**: Time-series DB, Grafana dashboards, Docker
- **Difficulty**: ⭐⭐⭐

### Project 11: OTA Firmware Update System
- Update ESP32 firmware wirelessly over Wi-Fi
- **Concepts**: OTA updates, version management, rollback
- **Difficulty**: ⭐⭐⭐

### Project 12: Multi-Sensor Gateway
- Raspberry Pi gateway collecting BLE sensor data → cloud
- **Concepts**: BLE, gateway architecture, edge processing
- **Difficulty**: ⭐⭐⭐

---

## Level 4: Advanced IoT (Weeks 12-16)

### Project 13: LoRa Farm Monitoring
- Long-range sensor network for agriculture
- **Concepts**: LoRa, low power, multi-node, range testing
- **Difficulty**: ⭐⭐⭐⭐

### Project 14: Voice-Controlled IoT (Alexa/Google)
- Control devices with voice commands
- **Concepts**: Alexa Skills, Google Actions, OAuth, Lambda
- **Difficulty**: ⭐⭐⭐⭐

### Project 15: TinyML — Edge AI
- Run ML model on ESP32 for anomaly detection
- **Concepts**: TensorFlow Lite Micro, edge inference, quantization
- **Difficulty**: ⭐⭐⭐⭐

### Project 16: Industrial IoT Dashboard
- Monitor industrial equipment (vibration, temp, status)
- **Concepts**: IIoT, predictive maintenance, alerting
- **Difficulty**: ⭐⭐⭐⭐

---

## Level 5: Production IoT (Weeks 17-20)

### Project 17: Secure IoT Device
- Implement TLS, device certificates, secure boot
- **Concepts**: mTLS, X.509 certificates, secure storage
- **Difficulty**: ⭐⭐⭐⭐

### Project 18: AWS IoT Core Integration
- Device → AWS IoT Core → DynamoDB → Lambda → Dashboard
- **Concepts**: AWS IoT, device shadows, rules engine
- **Difficulty**: ⭐⭐⭐⭐

### Project 19: Digital Twin
- Create digital twin of a physical device in cloud
- **Concepts**: Device shadow, state sync, simulation
- **Difficulty**: ⭐⭐⭐⭐

### Project 20: Fleet Management System
- Manage 10+ IoT devices remotely (provisioning, monitoring, OTA)
- **Concepts**: Device management, fleet ops, scalability
- **Difficulty**: ⭐⭐⭐⭐

---

## Recommended Learning Path

**Week 1-3**: Projects 1-4 (Getting Started)
**Week 4-7**: Projects 5-8 (Smart Home)
**Week 8-11**: Projects 9-12 (Cloud & Data)
**Week 12-16**: Projects 13-16 (Advanced)
**Week 17-20**: Projects 17-20 (Production)

## Hardware Shopping List

| Component | Cost (INR) |
|-----------|-----------|
| ESP32 DevKit | ₹350 |
| DHT22 Sensor | ₹200 |
| PIR Motion Sensor | ₹60 |
| Soil Moisture Sensor | ₹50 |
| Relay Module | ₹80 |
| OLED Display (0.96") | ₹200 |
| Breadboard + Wires | ₹150 |
| RC522 RFID Module | ₹120 |
| **Total Starter** | **~₹1,200** |

## Tips for Success
1. Start with ESP32 — cheapest way to learn IoT
2. Use Wokwi.com for free simulation before buying hardware
3. Learn MQTT — it's used in 90% of IoT projects
4. Always think about security from Day 1
5. Build a portfolio of working IoT projects on GitHub
6. Consider power consumption for battery-powered devices
