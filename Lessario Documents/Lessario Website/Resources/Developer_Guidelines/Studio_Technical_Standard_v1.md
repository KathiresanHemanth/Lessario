# Lessario Studios: Technical Standard & Developer Stack (v1.0)

## 🏢 Overview
This document defines the official technical architecture for Lessario Studios' web and digital infrastructure. All internal projects and client deliverables must adhere to these standards to ensure maximum performance, SEO, and visual fidelity.

## 🛠️ The Core Stack (The "Gold Standard")
For all new web applications and official studio platforms, the **Next.js / T3 Ecosystem** is the mandatory standard.

### 1. Unified Framework: Next.js (App Router)
*   **Rationale**: Replaces the fragmented MERN (React + Express) approach. Provides superior SEO, Server-Side Rendering (SSR), and faster page transitions.
*   **Navigation**: All public-facing sites must use the `app` directory architecture for performance optimization.

### 2. Language: TypeScript
*   **Requirement**: Type-safety is mandatory for all production code. 
*   **Goal**: Minimize runtime errors and ensure scalability as the technical team (Vaishnavi, Pranav, et al.) collaborates.

### 3. Database & ORM: PostgreSQL + Prisma/Supabase
*   **Standard**: Relational data structures are preferred for CRM, project management, and high-complexity business logic.
*   **Fallback**: MongoDB (Atlas) is permitted only for non-relational project logs or specific unstructured data needs.

### 4. Styles & Animation: Tailwind CSS + Framer Motion
*   **Visual Direction**: "Rich Aesthetics" with a "Premium Feel."
*   **Standard**: Use utility-first CSS (Tailwind) for speed and Framer Motion for micro-interactions and high-end animations.

---

## 🎨 The "Lessario Special" (3D & Immersive)
As a high-end technical studio, our web presence must reflect our **Unreal Engine / VFX** roots.

*   **3D Web Assets**: **React Three Fiber (R3F)** is the standard for embedding interactive 3D models.
*   **Rich Media**: Optimization of 4K video background assets using HLS/Dash for seamless streaming.

---

## 🚀 Comparison: MERN vs. Next.js (2026 Perspective)
| Feature | MERN (Legacy Standard) | Next.js / T3 (Lessario Standard) |
| :--- | :--- | :--- |
| **SEO** | Difficult / Manual | **Automatic / Built-in** |
| **Bundle Size** | Large (CSR) | **Small / Optimized (SSR)** |
| **Dev Speed** | High (Common) | **Extreme (Unified Backend/Frontend)**|
| **Type Safety** | Optional | **Mandatory (TypeScript)** |

---

## 📋 Compliance & Review
All external freelance developers and internal technical staff must review this standard before commencing project work.

*Maintained by: Founder's Office | Technical Authority: Hemanth Kumar PK*
