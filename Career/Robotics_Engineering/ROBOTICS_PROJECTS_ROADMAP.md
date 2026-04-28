# Robotics Engineering - Project-Based Learning Roadmap

## Level 1: Electronics Basics (Weeks 1-2)

### Project 1: LED Traffic Light
- Simulate a traffic light with 3 LEDs (red, yellow, green)
- **Concepts**: Arduino, digital output, timing
- **Difficulty**: ⭐

### Project 2: Button-Controlled LED
- Toggle LED with a push button, add debouncing
- **Concepts**: Digital input, pull-up resistors, debouncing
- **Difficulty**: ⭐

### Project 3: Light Sensor Night Lamp
- Auto-turn on LED when it gets dark using LDR
- **Concepts**: Analog input, threshold logic, sensors
- **Difficulty**: ⭐

### Project 4: Buzzer Alarm System
- PIR motion sensor triggers a buzzer alarm
- **Concepts**: PIR sensor, digital I/O, interrupts
- **Difficulty**: ⭐⭐

---

## Level 2: Motor Control (Weeks 3-4)

### Project 5: DC Motor Speed Controller
- Control motor speed with potentiometer via PWM
- **Concepts**: PWM, analog read, motor drivers (L298N)
- **Difficulty**: ⭐⭐

### Project 6: Servo Motor Sweep
- Sweep servo 0-180° and control with potentiometer
- **Concepts**: Servo library, analog mapping
- **Difficulty**: ⭐⭐

### Project 7: Two-Wheel Robot Car
- Build a basic robot car, drive forward/backward/turn
- **Concepts**: Dual motor control, chassis assembly
- **Difficulty**: ⭐⭐

### Project 8: Remote Controlled Car
- Control robot car with IR remote or Bluetooth
- **Concepts**: IR receiver, Bluetooth (HC-05), serial
- **Difficulty**: ⭐⭐⭐

---

## Level 3: Sensors & Feedback (Weeks 5-7)

### Project 9: Obstacle Avoiding Robot
- Robot avoids obstacles using ultrasonic sensor
- **Concepts**: HC-SR04, decision logic, servo sweep
- **Difficulty**: ⭐⭐⭐

### Project 10: Line Following Robot
- Robot follows a black line on white surface
- **Concepts**: IR sensors, PID control, calibration
- **Difficulty**: ⭐⭐⭐

### Project 11: Temperature & Humidity Monitor
- Display sensor data on LCD screen
- **Concepts**: DHT11/22, I2C LCD, data display
- **Difficulty**: ⭐⭐

### Project 12: IMU Balance Indicator
- Read accelerometer/gyroscope, display tilt angle
- **Concepts**: MPU6050, I2C, sensor fusion basics
- **Difficulty**: ⭐⭐⭐

---

## Level 4: Advanced Robotics (Weeks 8-11)

### Project 13: PID Line Follower
- Smooth line following with PID tuned controller
- **Concepts**: PID tuning, error calculation, smooth motion
- **Difficulty**: ⭐⭐⭐

### Project 14: Robotic Arm (3-DOF)
- Build a 3-servo robotic arm, control via serial/joystick
- **Concepts**: Inverse kinematics basics, servo coordination
- **Difficulty**: ⭐⭐⭐⭐

### Project 15: Self-Balancing Robot
- Two-wheeled robot that balances upright
- **Concepts**: MPU6050, PID, complementary filter
- **Difficulty**: ⭐⭐⭐⭐

### Project 16: Maze Solving Robot
- Robot navigates a maze using wall-following algorithm
- **Concepts**: Algorithm design, multiple sensors, state machine
- **Difficulty**: ⭐⭐⭐⭐

---

## Level 5: ROS & Autonomous Systems (Weeks 12-16)

### Project 17: ROS 2 Turtlebot Simulation
- Control a simulated robot in Gazebo using ROS 2
- **Concepts**: ROS nodes, topics, Gazebo, teleop
- **Difficulty**: ⭐⭐⭐

### Project 18: SLAM Mapping
- Build a 2D map of environment using LIDAR simulation
- **Concepts**: SLAM, occupancy grid, ROS nav stack
- **Difficulty**: ⭐⭐⭐⭐

### Project 19: Autonomous Navigation
- Navigate robot to goal while avoiding obstacles
- **Concepts**: Nav2, path planning, costmaps
- **Difficulty**: ⭐⭐⭐⭐

### Project 20: Vision-Based Object Follower
- Robot follows a colored object using camera
- **Concepts**: OpenCV, color tracking, ROS + vision
- **Difficulty**: ⭐⭐⭐⭐

---

## Recommended Learning Path

**Week 1-2**: Projects 1-4 (Electronics Basics)
**Week 3-4**: Projects 5-8 (Motor Control)
**Week 5-7**: Projects 9-12 (Sensors & Feedback)
**Week 8-11**: Projects 13-16 (Advanced Robotics)
**Week 12-16**: Projects 17-20 (ROS & Autonomous Systems)

## Hardware Shopping List (Starter Kit)

| Component | Approx. Cost (INR) |
|-----------|-------------------|
| Arduino Uno | ₹500 |
| Breadboard + Jumper Wires | ₹150 |
| LEDs, Resistors, Buttons | ₹100 |
| Ultrasonic Sensor HC-SR04 | ₹80 |
| L298N Motor Driver | ₹150 |
| 2x DC Motors + Wheels | ₹200 |
| Servo Motor SG90 | ₹100 |
| IR Sensor Module (x2) | ₹100 |
| MPU6050 IMU | ₹150 |
| Robot Car Chassis | ₹300 |
| **Total Starter** | **~₹1,800** |

## Tips for Success
1. Buy a starter kit — saves money and time
2. Start with simulation (Tinkercad, Wokwi) if no hardware
3. Read datasheets for every sensor and actuator
4. Document every project with photos and code
5. Join robotics communities (Reddit r/robotics, ROS Discourse)
6. Enter competitions (Robocon, TechFest, college events)
