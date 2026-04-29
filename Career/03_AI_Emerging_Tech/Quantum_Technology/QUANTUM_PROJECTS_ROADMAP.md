# Quantum Technology - Project-Based Learning Roadmap

## Level 1: Quantum Basics (Weeks 1-3)

### Project 1: Quantum Coin Flip
- Create superposition with Hadamard gate, measure outcomes
- **Concepts**: Qubits, Hadamard, measurement, probability
- **Difficulty**: ⭐

### Project 2: Quantum Entanglement (Bell States)
- Create all 4 Bell states, verify entanglement via measurement
- **Concepts**: CNOT, entanglement, Bell states, correlation
- **Difficulty**: ⭐⭐

### Project 3: Quantum Teleportation
- Implement quantum teleportation protocol
- **Concepts**: Entanglement, classical communication, reconstruction
- **Difficulty**: ⭐⭐

### Project 4: Superdense Coding
- Send 2 classical bits using 1 qubit (with entanglement)
- **Concepts**: Entanglement, encoding, decoding
- **Difficulty**: ⭐⭐

---

## Level 2: Quantum Algorithms (Weeks 4-7)

### Project 5: Deutsch-Jozsa Algorithm
- Determine if a function is constant or balanced in 1 query
- **Concepts**: Oracle, quantum parallelism, speedup
- **Difficulty**: ⭐⭐

### Project 6: Bernstein-Vazirani Algorithm
- Find a hidden binary string with one query
- **Concepts**: Inner product oracle, quantum query complexity
- **Difficulty**: ⭐⭐

### Project 7: Grover's Search Algorithm
- Search an unsorted database with quadratic speedup
- **Concepts**: Oracle, amplitude amplification, diffusion
- **Difficulty**: ⭐⭐⭐

### Project 8: Quantum Fourier Transform
- Implement QFT and inverse QFT circuit
- **Concepts**: Fourier transform, phase estimation, controlled rotations
- **Difficulty**: ⭐⭐⭐

---

## Level 3: Applied Quantum (Weeks 8-12)

### Project 9: Quantum Random Number Generator
- Generate truly random numbers using quantum mechanics
- **Concepts**: Measurement randomness, statistical tests
- **Difficulty**: ⭐⭐

### Project 10: Variational Quantum Eigensolver (VQE)
- Find ground state energy of H₂ molecule
- **Concepts**: Variational principle, parameterized circuits, optimization
- **Difficulty**: ⭐⭐⭐⭐

### Project 11: QAOA for MaxCut
- Solve graph MaxCut problem using QAOA
- **Concepts**: Combinatorial optimization, QAOA, landscape
- **Difficulty**: ⭐⭐⭐⭐

### Project 12: Quantum Key Distribution (BB84)
- Simulate BB84 QKD protocol for secure key exchange
- **Concepts**: Quantum cryptography, eavesdropping detection
- **Difficulty**: ⭐⭐⭐

---

## Level 4: Quantum Machine Learning (Weeks 13-17)

### Project 13: Quantum Classifier
- Build a variational quantum classifier for simple dataset
- **Concepts**: PennyLane, quantum kernels, training
- **Difficulty**: ⭐⭐⭐⭐

### Project 14: Quantum GAN
- Implement a quantum generative adversarial network
- **Concepts**: Quantum generator, classical discriminator
- **Difficulty**: ⭐⭐⭐⭐

### Project 15: Quantum Transfer Learning
- Hybrid classical-quantum model for image classification
- **Concepts**: ResNet + quantum layer, PennyLane + PyTorch
- **Difficulty**: ⭐⭐⭐⭐

### Project 16: Quantum Error Correction Demo
- Implement 3-qubit bit-flip and phase-flip error correction
- **Concepts**: Error syndromes, correction circuits, redundancy
- **Difficulty**: ⭐⭐⭐⭐

---

## Level 5: Advanced & Research (Weeks 18-24)

### Project 17: Shor's Algorithm (Small Numbers)
- Factor small numbers (15, 21) using Shor's algorithm
- **Concepts**: Period finding, modular exponentiation, QFT
- **Difficulty**: ⭐⭐⭐⭐

### Project 18: Quantum Walk Simulation
- Simulate quantum walk on a graph, compare to classical
- **Concepts**: Quantum walk, graph structure, speedup
- **Difficulty**: ⭐⭐⭐⭐

### Project 19: Noise-Aware Quantum Computing
- Run circuits on real IBM hardware, analyze noise effects
- **Concepts**: Noise models, error mitigation, transpilation
- **Difficulty**: ⭐⭐⭐⭐

### Project 20: Quantum Portfolio Optimization
- Optimize financial portfolio using QAOA/VQE
- **Concepts**: Quadratic optimization, finance, quantum advantage
- **Difficulty**: ⭐⭐⭐⭐

---

## Recommended Learning Path

**Week 1-3**: Projects 1-4 (Basics — use IBM Quantum)
**Week 4-7**: Projects 5-8 (Algorithms)
**Week 8-12**: Projects 9-12 (Applied)
**Week 13-17**: Projects 13-16 (QML)
**Week 18-24**: Projects 17-20 (Advanced)

## Where to Run These Projects
1. **IBM Quantum** — Free cloud quantum computers
2. **Google Colab** — Free Python notebook with Qiskit/Cirq
3. **Amazon Braket** — Free tier for simulators
4. **Local** — pip install qiskit cirq pennylane

## Tips for Success
1. Complete IBM Quantum Learning courses alongside projects
2. Run on REAL quantum hardware (not just simulators)
3. Join Qiskit community on Slack/Discord
4. Attend Qiskit Global Summer School (free, annual)
5. Read research papers on arXiv (quant-ph section)
6. Contribute to open-source quantum projects
7. Linear algebra practice is non-negotiable
