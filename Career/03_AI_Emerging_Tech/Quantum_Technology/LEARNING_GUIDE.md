# Quantum Technology - Learning Guide

## 🎯 Goal
Master quantum computing, quantum communication, and quantum sensing — from fundamental physics to programming quantum computers.

---

## Prerequisites
✅ Mathematics — Linear Algebra (CRITICAL), Complex Numbers, Probability
✅ Physics — Quantum Mechanics basics, wave-particle duality
✅ Programming — Python (primary), C++ (performance)
✅ Classical Computing — Logic gates, algorithms, complexity theory

---

## Core Concepts (in order)

1. **Quantum Mechanics Foundations** — Superposition, entanglement, measurement
2. **Qubits** — Bloch sphere, |0⟩ and |1⟩ states, superposition states
3. **Quantum Gates** — Hadamard, CNOT, Pauli-X/Y/Z, Toffoli, SWAP
4. **Quantum Circuits** — Gate composition, measurement, circuit depth
5. **Quantum Algorithms** — Deutsch-Jozsa, Grover's search, Shor's factoring
6. **Quantum Entanglement** — Bell states, quantum teleportation, superdense coding
7. **Quantum Error Correction** — Bit-flip, phase-flip, Shor code, surface codes
8. **Quantum Machine Learning** — Variational circuits, QAOA, quantum kernels
9. **Quantum Communication** — QKD (BB84, E91), quantum internet
10. **Quantum Hardware** — Superconducting qubits, trapped ions, photonics, topological
11. **Quantum Sensing** — Atomic clocks, quantum magnetometry, gravimetry

---

## Quick Reference

### The Math You MUST Know

#### Dirac Notation (Bra-Ket)
```
|0⟩ = [1, 0]ᵀ  (column vector)
|1⟩ = [0, 1]ᵀ  (column vector)
⟨0| = [1, 0]   (row vector)

Superposition: |ψ⟩ = α|0⟩ + β|1⟩
where |α|² + |β|² = 1

Measurement probability:
  P(0) = |α|²
  P(1) = |β|²
```

#### Key Quantum Gates (as matrices)
```
Pauli-X (NOT gate):     Hadamard (H):
[0  1]                  1/√2 × [1   1]
[1  0]                         [1  -1]

Pauli-Z:                CNOT:
[1   0]                 [1 0 0 0]
[0  -1]                 [0 1 0 0]
                        [0 0 0 1]
                        [0 0 1 0]
```

### Qiskit — IBM's Quantum Framework (Python)
```python
# Install: pip install qiskit qiskit-aer

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Create a 2-qubit circuit
qc = QuantumCircuit(2, 2)

# Apply gates
qc.h(0)          # Hadamard on qubit 0 (superposition)
qc.cx(0, 1)      # CNOT: entangle qubit 0 and 1

# Measure
qc.measure([0, 1], [0, 1])

# Simulate
simulator = AerSimulator()
compiled = transpile(qc, simulator)
result = simulator.run(compiled, shots=1024).result()
counts = result.get_counts()
print(counts)  # {'00': ~512, '11': ~512} → entangled!
```

### Cirq — Google's Framework
```python
# Install: pip install cirq

import cirq

# Create qubits
q0, q1 = cirq.LineQubit.range(2)

# Build circuit
circuit = cirq.Circuit([
    cirq.H(q0),           # Hadamard
    cirq.CNOT(q0, q1),    # CNOT
    cirq.measure(q0, q1, key='result')
])

# Simulate
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1000)
print(result.histogram(key='result'))
```

### PennyLane — Quantum ML
```python
# Install: pip install pennylane

import pennylane as qml
from pennylane import numpy as np

dev = qml.device("default.qubit", wires=2)

@qml.qnode(dev)
def quantum_circuit(params):
    qml.RX(params[0], wires=0)
    qml.RY(params[1], wires=1)
    qml.CNOT(wires=[0, 1])
    return qml.expval(qml.PauliZ(0))

# Evaluate
params = np.array([0.5, 0.3])
print(quantum_circuit(params))
```

---

## 🛠️ Tools & Platforms

| Category | Tools |
|----------|-------|
| **IBM** | Qiskit, IBM Quantum Experience (free cloud access!) |
| **Google** | Cirq, TensorFlow Quantum |
| **Amazon** | Amazon Braket |
| **Microsoft** | Azure Quantum, Q# |
| **Xanadu** | PennyLane, Strawberry Fields |
| **Simulation** | QuTiP, ProjectQ, Quirk (browser) |
| **Learning** | IBM Quantum Learning, Qiskit Textbook |

### Free Quantum Computers You Can Use TODAY:
1. **IBM Quantum** → quantum.ibm.com (up to 127 qubits!)
2. **Amazon Braket** → Free tier available
3. **Google Colab** → Run Cirq/Qiskit in notebooks

---

## Quantum Computing vs Classical Computing

| Aspect | Classical | Quantum |
|--------|-----------|---------|
| **Unit** | Bit (0 or 1) | Qubit (superposition of 0 and 1) |
| **Operations** | Logic gates (AND, OR, NOT) | Quantum gates (H, CNOT, etc.) |
| **Parallelism** | Sequential/limited | Exponential (via superposition) |
| **Key Advantage** | Deterministic | Solves specific problems exponentially faster |
| **Best For** | General computing | Optimization, cryptography, simulation |

---

## Key Quantum Algorithms

| Algorithm | Purpose | Speedup |
|-----------|---------|---------|
| **Grover's** | Unstructured search | √N (quadratic) |
| **Shor's** | Integer factoring | Exponential |
| **QAOA** | Optimization problems | Potential advantage |
| **VQE** | Chemistry simulation | Potential advantage |
| **Quantum Walk** | Graph problems | Polynomial/Exponential |

---

## Career Paths

| Role | Focus |
|------|-------|
| **Quantum Software Engineer** | Algorithm design, Qiskit/Cirq |
| **Quantum Hardware Engineer** | Qubit fabrication, cryogenics |
| **Quantum Researcher** | Algorithms, error correction |
| **Quantum ML Engineer** | QML, variational circuits |
| **Quantum Cryptographer** | QKD, post-quantum crypto |

---

## Companies Working on Quantum (India & Global)

| Company | Focus |
|---------|-------|
| **IBM** | Superconducting qubits, cloud |
| **Google** | Quantum supremacy, Willow chip |
| **Microsoft** | Topological qubits, Azure Quantum |
| **QNu Labs** (India) | Quantum key distribution |
| **BosonQ Psi** (India) | Quantum simulation |
| **TCS/Infosys/Wipro** | Quantum consulting |
| **IISc/IITs** | Quantum research groups |

### India's National Quantum Mission:
- ₹6,003 crore budget (2023-2031)
- Focus: Quantum computing, communication, sensing
- Goal: Build 1000+ qubit quantum computer
- Creating quantum research hubs at premier institutions

---

## Learning Roadmap

### Phase 1 (Weeks 1-2): Math & Physics Foundation
- Linear algebra: vectors, matrices, eigenvalues, tensor products
- Complex numbers: Euler's formula, complex conjugate
- Quantum mechanics: wave function, measurement, superposition

### Phase 2 (Weeks 3-5): Quantum Computing Basics
- Qubits, gates, circuits on IBM Quantum
- Implement basic algorithms (Deutsch-Jozsa, Bernstein-Vazirani)
- Complete IBM Quantum Learning courses

### Phase 3 (Weeks 6-9): Quantum Algorithms
- Grover's search algorithm
- Quantum Fourier Transform
- Phase estimation
- Shor's algorithm (conceptual understanding)

### Phase 4 (Weeks 10-14): Specialization
- Pick: Quantum ML, Quantum Communication, or Quantum Hardware
- Build capstone projects
- Contribute to open-source quantum projects

---

## Common Mistakes to Avoid

❌ **Wrong:** Skipping linear algebra → impossible to understand quantum
✅ **Right:** Master vectors, matrices, eigenvalues FIRST

❌ **Wrong:** Thinking quantum computers replace classical computers
✅ **Right:** Quantum excels at SPECIFIC problems, not general tasks

❌ **Wrong:** Only reading theory, never coding
✅ **Right:** Use IBM Quantum / Qiskit from Day 1

---

## Resources

| Resource | Type | Focus |
|----------|------|-------|
| Qiskit Textbook | Free Online | Comprehensive intro |
| IBM Quantum Learning | Interactive | Hands-on labs |
| Quantum Country | Essay | Intuitive understanding |
| 3Blue1Brown | Video | Math visualization |
| "Quantum Computing: An Applied Approach" (Hidary) | Book | Practical |
| Microsoft Quantum Katas | Interactive | Q# exercises |

---

## Remember:
- **Linear algebra IS quantum computing** — master it
- **Use real quantum computers** — IBM gives free access
- **Start with Qiskit** — best community and documentation
- **Quantum is the future** — India is investing ₹6000+ crore
- **Be patient** — it's conceptually challenging but rewarding
- **Don't need a PhD** — software engineers are in high demand

Welcome to the quantum revolution! ⚛️
