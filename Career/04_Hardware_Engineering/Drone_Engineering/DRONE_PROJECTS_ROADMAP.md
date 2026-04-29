# Drone Engineering - Project-Based Learning Roadmap

## Level 1: Basics (Weeks 1-3)

### Project 1: Motor & ESC Test Bench
- Test brushless motor thrust at different throttle levels
- **Concepts**: BLDC motors, ESC calibration, thrust measurement
- **Difficulty**: ⭐

### Project 2: IMU Data Reader
- Read accelerometer/gyroscope data, display orientation
- **Concepts**: MPU6050, I2C, sensor reading, filtering
- **Difficulty**: ⭐⭐

### Project 3: RC Receiver Decoder
- Decode RC receiver PWM signals on Arduino
- **Concepts**: PWM reading, channel mapping, dead zones
- **Difficulty**: ⭐⭐

### Project 4: Battery Monitor
- Monitor LiPo voltage per cell, low voltage alarm
- **Concepts**: Voltage divider, ADC, LiPo safety
- **Difficulty**: ⭐⭐

---

## Level 2: Build & Fly (Weeks 4-7)

### Project 5: First Quadcopter Build
- Assemble F450 quadcopter with Pixhawk, first flight
- **Concepts**: Assembly, wiring, calibration, basic flying
- **Difficulty**: ⭐⭐⭐

### Project 6: PID Tuning
- Tune roll/pitch/yaw PID for stable hover
- **Concepts**: PID controller, oscillation, damping
- **Difficulty**: ⭐⭐⭐

### Project 7: GPS Waypoint Mission
- Program autonomous waypoint following mission
- **Concepts**: Mission Planner, waypoints, RTL, geofence
- **Difficulty**: ⭐⭐⭐

### Project 8: FPV Setup
- Add FPV camera and video transmitter for live view
- **Concepts**: FPV camera, VTX, goggles, video link
- **Difficulty**: ⭐⭐

---

## Level 3: Autonomous Systems (Weeks 8-12)

### Project 9: ArduPilot SITL Simulation
- Run ArduPilot in software simulation, test missions
- **Concepts**: SITL, MAVProxy, DroneKit, scripting
- **Difficulty**: ⭐⭐⭐

### Project 10: Follow-Me Drone
- Drone follows a GPS target (phone/tracker)
- **Concepts**: MAVLink, position tracking, relative navigation
- **Difficulty**: ⭐⭐⭐

### Project 11: Obstacle Avoidance
- Add rangefinders for basic obstacle avoidance
- **Concepts**: Proximity sensors, avoidance algorithms
- **Difficulty**: ⭐⭐⭐⭐

### Project 12: Aerial Photography Gimbal
- Build a 2-axis gimbal for camera stabilization
- **Concepts**: Servo control, IMU feedback, stabilization
- **Difficulty**: ⭐⭐⭐

---

## Level 4: Advanced (Weeks 13-18)

### Project 13: Computer Vision Landing
- Precision landing on ArUco marker using camera
- **Concepts**: OpenCV, ArUco detection, visual servoing
- **Difficulty**: ⭐⭐⭐⭐

### Project 14: Drone Delivery System
- Pickup and drop payload at target location
- **Concepts**: Servo gripper, payload management, mission
- **Difficulty**: ⭐⭐⭐⭐

### Project 15: Mapping & Survey
- Create orthomosaic map from aerial photos
- **Concepts**: Photogrammetry, OpenDroneMap, GIS
- **Difficulty**: ⭐⭐⭐⭐

### Project 16: Swarm Coordination (Simulation)
- Coordinate multiple drones in formation (Gazebo)
- **Concepts**: Multi-agent, formation control, consensus
- **Difficulty**: ⭐⭐⭐⭐

---

## Recommended Learning Path

**Week 1-3**: Projects 1-4 (Basics)
**Week 4-7**: Projects 5-8 (Build & Fly)
**Week 8-12**: Projects 9-12 (Autonomous)
**Week 13-18**: Projects 13-16 (Advanced)

## Safety Rules
⚠️ Always fly in open areas away from people
⚠️ Never fly near airports or restricted zones
⚠️ Keep LiPo batteries in fireproof bags
⚠️ Have a spotter when testing new features
⚠️ Start in stabilize mode, not acro
⚠️ Always set failsafe (RTL on signal loss)
