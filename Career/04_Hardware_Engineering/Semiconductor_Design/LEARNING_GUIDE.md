# Semiconductor & Chip Design - Learning Guide

## 🎯 Goal
Master chip design — VLSI, RISC-V, ASIC/FPGA. Semiconductors are the foundation of ALL technology. China (SMIC, HiSilicon, YMTC) and the US (NVIDIA, Intel, AMD) are in a race — this is the most strategic tech skill.

## 💰 Salary Range
| Level | India | Global |
|-------|-------|--------|
| Fresher | ₹6-12 LPA | $80-120K |
| Mid (3-5 yrs) | ₹15-35 LPA | $120-200K |
| Senior | ₹35-70 LPA | $200-350K |
| Architect | ₹60-1.5 Cr+ | $300K+ |

*India is becoming a semiconductor hub — ₹76,000 crore govt investment (India Semiconductor Mission)*

---

## Core Concepts

1. **Digital Logic** — Gates, flip-flops, FSM, counters, mux/demux
2. **Computer Architecture** — CPU pipeline, cache, memory hierarchy
3. **RISC-V** — Open-source ISA, instruction encoding, microarchitecture
4. **Verilog/SystemVerilog** — RTL design, testbenches, assertions
5. **FPGA Design** — Synthesis, place & route, timing closure
6. **ASIC Design Flow** — RTL → Synthesis → DFT → PnR → Signoff
7. **Verification** — UVM, constrained random, coverage-driven
8. **Physical Design** — Floorplanning, clock tree, routing, DRC/LVS
9. **Analog/Mixed-Signal** — ADC, DAC, PLL, op-amps, SPICE
10. **Embedded Processors** — SoC design, bus protocols (AXI, APB)

---

## Quick Reference

### Verilog — 4-bit Counter
```verilog
module counter (
    input  wire clk,
    input  wire reset,
    output reg [3:0] count
);
    always @(posedge clk or posedge reset) begin
        if (reset)
            count <= 4'b0000;
        else
            count <= count + 1;
    end
endmodule
```

### Verilog — Simple ALU
```verilog
module alu (
    input  wire [7:0] a, b,
    input  wire [1:0] op,
    output reg  [7:0] result
);
    always @(*) begin
        case (op)
            2'b00: result = a + b;   // ADD
            2'b01: result = a - b;   // SUB
            2'b10: result = a & b;   // AND
            2'b11: result = a | b;   // OR
        endcase
    end
endmodule
```

### RISC-V Assembly
```assembly
# Add two numbers
addi x1, x0, 5      # x1 = 5
addi x2, x0, 3      # x2 = 3
add  x3, x1, x2     # x3 = x1 + x2 = 8
```

---

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **RTL Design** | Verilog, SystemVerilog, VHDL |
| **Simulation** | ModelSim, Verilator, Icarus Verilog (free!) |
| **FPGA** | Vivado (Xilinx/AMD), Quartus (Intel), Gowin |
| **ASIC** | Synopsys (DC, ICC2), Cadence (Genus, Innovus) |
| **Analog** | SPICE, Cadence Virtuoso, LTSpice |
| **RISC-V** | RISC-V GNU toolchain, Spike, QEMU |
| **Verification** | UVM, cocotb (Python), Verilator |
| **Open Source** | OpenLane, SKY130 PDK, Yosys |

---

## China's Semiconductor Landscape
| Company | Focus |
|---------|-------|
| **SMIC** | Foundry (7nm and below) |
| **HiSilicon (Huawei)** | Kirin SoC, Ascend AI chips |
| **YMTC** | NAND Flash memory |
| **CXMT** | DRAM memory |
| **Biren Tech** | GPU / AI accelerators |
| **Cambricon** | AI processors |
| **Loongson** | Desktop/Server CPUs (LoongArch ISA) |

## India's Semiconductor Push
- **India Semiconductor Mission** — ₹76,000 crore investment
- **Tata Electronics** — Building fab in Gujarat (with PSMC)
- **Micron** — Assembly/Test facility in Gujarat
- **CG Power** — OSAT plant (with Renesas)
- **ISRO/DRDO** — Custom chip design for defense/space

---

## SpaceX/Tesla Relevance
- **SpaceX** designs custom radiation-hardened chips for Starlink satellites
- **Tesla** designed its own **FSD (Full Self-Driving) chip** — 144 TOPS
- **xAI** needs custom AI accelerators for training
- **Neuralink** designs custom mixed-signal ASICs for brain interfaces
- Chip design = the ultimate engineering skill at Musk companies

---

## Career Paths
| Role | Focus |
|------|-------|
| **RTL Design Engineer** | Verilog, microarchitecture |
| **Verification Engineer** | UVM, testbenches (highest demand!) |
| **Physical Design Engineer** | Floorplan, PnR, timing |
| **FPGA Engineer** | Embedded, prototyping |
| **RISC-V Architect** | Open-source processor design |
| **Analog Engineer** | ADC/DAC, PLL, power management |

---

## Tips
- **Verilog first** — it's more used than VHDL in India
- **RISC-V is the future** — open source, China/India are adopting massively
- **Verification is 70% of chip design** — huge job market
- **Use Icarus Verilog + GTKWave** — free tools to start immediately
- **OpenLane + SKY130** — design a real chip for FREE (Google/Efabless)
- **FPGA boards are cheap** — Tang Nano 9K (₹800), iCE40 (₹1000)

Design the future's foundation! 🔬
