# DRDO Engineering - Project-Based Learning Roadmap

## Hardware Track

### Project H1: LED Matrix Display
- Drive an 8x8 LED matrix with shift registers
- **Concepts**: 74HC595, multiplexing, timing
- **Difficulty**: ⭐⭐

### Project H2: Digital Voltmeter
- Measure voltage with ADC, display on LCD
- **Concepts**: ADC, voltage divider, calibration
- **Difficulty**: ⭐⭐

### Project H3: PCB Design — Sensor Board
- Design a custom PCB with temperature + humidity sensor
- **Concepts**: KiCad, schematic, layout, Gerber files
- **Difficulty**: ⭐⭐⭐

### Project H4: FPGA — Traffic Light Controller
- Implement traffic light FSM on FPGA
- **Concepts**: Verilog, FSM, synthesis, simulation
- **Difficulty**: ⭐⭐⭐

### Project H5: Radar Signal Simulator
- Simulate radar pulse generation and echo processing
- **Concepts**: Pulse radar, range calculation, signal processing
- **Difficulty**: ⭐⭐⭐⭐

---

## Software Track

### Project S1: UART Communication
- Two microcontrollers communicating via UART
- **Concepts**: Serial protocol, baud rate, data framing
- **Difficulty**: ⭐⭐

### Project S2: FreeRTOS Multi-Task System
- Run multiple tasks (LED, sensor, display) on FreeRTOS
- **Concepts**: RTOS tasks, priorities, semaphores
- **Difficulty**: ⭐⭐⭐

### Project S3: Kalman Filter Implementation
- Fuse accelerometer + gyroscope data for angle estimation
- **Concepts**: Kalman filter, sensor fusion, noise
- **Difficulty**: ⭐⭐⭐

### Project S4: Encrypted Communication System
- AES-encrypted message passing between two nodes
- **Concepts**: AES, key exchange, secure protocols
- **Difficulty**: ⭐⭐⭐⭐

### Project S5: Real-Time Signal Processor
- FFT-based spectrum analyzer on embedded platform
- **Concepts**: DSP, FFT, sampling, frequency analysis
- **Difficulty**: ⭐⭐⭐⭐

---

## Automobile Track

### Project A1: CAN Bus Vehicle Network
- Simulate military vehicle CAN network with multiple nodes
- **Concepts**: CAN protocol, message IDs, arbitration
- **Difficulty**: ⭐⭐⭐

### Project A2: GPS Navigation Logger
- Log GPS coordinates, calculate distance and heading
- **Concepts**: GPS module, NMEA parsing, haversine formula
- **Difficulty**: ⭐⭐⭐

### Project A3: Vehicle Health Monitor
- Monitor engine temp, battery, oil pressure with alerts
- **Concepts**: Multiple sensors, thresholds, alert system
- **Difficulty**: ⭐⭐⭐

### Project A4: Terrain Mapping Display
- Display elevation map from sensor data on screen
- **Concepts**: Barometric altitude, data visualization
- **Difficulty**: ⭐⭐⭐⭐

### Project A5: Remote Vehicle Control System
- Control a model vehicle remotely via radio + camera feed
- **Concepts**: RF communication, video streaming, telemetry
- **Difficulty**: ⭐⭐⭐⭐

---

## Recommended Learning Path

**Week 1-3**: Pick one track, do Projects 1-2
**Week 4-6**: Projects 3-4 in your track
**Week 7-10**: Project 5 (capstone) + start second track
**Week 11-16**: Cross-track projects for integration

## Tips for Success
1. Focus on ONE track first, then expand
2. Build a portfolio of embedded systems projects
3. Document everything with schematics and photos
4. Learn to read datasheets — essential skill for DRDO
5. Practice GATE problems alongside projects
