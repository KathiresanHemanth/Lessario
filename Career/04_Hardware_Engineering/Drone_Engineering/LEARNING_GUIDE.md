# Drone Engineering - Learning Guide

## 🎯 Goal
Master UAV technology — from building quadcopters to programming autonomous flight systems.

---

## Prerequisites
✅ Programming — C/C++ (flight controllers), Python (mission planning)
✅ Physics — Aerodynamics, mechanics, forces
✅ Electronics — Motors, ESCs, sensors, power systems
✅ Control Theory — PID, feedback systems

---

## Core Concepts (in order)

1. **Drone Types** — Multirotor, fixed-wing, VTOL, hybrid
2. **Aerodynamics** — Lift, drag, thrust, weight balance
3. **Components** — Frame, motors, ESCs, propellers, battery
4. **Flight Controllers** — Pixhawk, Betaflight, ArduPilot
5. **Sensors** — IMU, barometer, GPS, compass, LIDAR, camera
6. **PID Tuning** — Roll/pitch/yaw PID for stable flight
7. **Communication** — RC transmitter/receiver, telemetry, MAVLink
8. **Autonomous Flight** — Waypoints, mission planning, geofencing
9. **Computer Vision** — Object tracking, follow-me, obstacle avoidance
10. **Swarm Technology** — Multi-drone coordination, formation flying

---

## Key Formulas

```
Thrust Required = Total Weight × Safety Factor (1.5-2x)
Flight Time = Battery Capacity (mAh) × 60 / (Avg Current Draw × 1000)
Motor KV × Voltage = Max RPM (no load)
```

---

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **Flight Controller** | Pixhawk, Betaflight FC, ArduPilot |
| **Software** | Mission Planner, QGroundControl, Betaflight Configurator |
| **Simulation** | Gazebo + ArduPilot SITL, AirSim |
| **Programming** | DroneKit (Python), MAVLink, MAVSDK |
| **CAD** | Fusion 360, SolidWorks |
| **Vision** | OpenCV, ROS |

---

## Hardware Components (Starter Quadcopter)

| Component | Example | Cost (INR) |
|-----------|---------|-----------|
| Frame | F450 | ₹600 |
| Motors (x4) | 2212 920KV | ₹1,200 |
| ESCs (x4) | 30A SimonK | ₹800 |
| Props (x4) | 1045 | ₹200 |
| Flight Controller | Pixhawk 2.4.8 | ₹2,500 |
| GPS Module | Ublox M8N | ₹800 |
| Battery | 3S 5000mAh LiPo | ₹1,500 |
| RC TX/RX | FlySky FS-i6 | ₹2,500 |
| **Total** | | **~₹10,000** |

---

## Indian Drone Regulations (DGCA)

- Register drone on Digital Sky platform
- Categories: Nano (<250g), Micro, Small, Medium, Large
- Nano drones: No license needed (below 50m)
- Others: Remote Pilot License required
- No-fly zones: Airports, military areas, border areas
- Always check latest DGCA drone rules

---

## Career Paths

| Role | Focus |
|------|-------|
| **Drone Pilot** | Commercial operations, survey |
| **Flight Controller Engineer** | Firmware, PID, sensor fusion |
| **Autonomy Engineer** | Path planning, AI, SLAM |
| **Hardware Engineer** | Frame, power, payload design |
| **GIS/Survey Specialist** | Mapping, agriculture, inspection |

---

## Tips
- Start with a simulator before flying real drones
- Build a cheap quadcopter first — you WILL crash
- Learn PID tuning — it's the most important skill
- Understand LiPo battery safety (fire risk!)
- Join FPV communities for racing drones
- Follow DGCA regulations strictly

Fly high! 🛸
