# Full Stack Web Development - Learning Guide

## 🎯 Goal
Build complete web applications — frontend + backend + database. The most versatile and hireable skill in tech.

## 💰 Salary Range (India)
| Level | Salary |
|-------|--------|
| Fresher | ₹4-10 LPA |
| Mid (2-4 yrs) | ₹12-25 LPA |
| Senior | ₹25-50 LPA |
| Lead / Architect | ₹40-80+ LPA |

---

## Core Concepts

1. **HTML/CSS** — Semantic HTML, Flexbox, Grid, responsive design
2. **JavaScript** — ES6+, DOM, async/await, closures, prototypes
3. **TypeScript** — Types, interfaces, generics, utility types
4. **React** — Components, hooks, state, context, routing
5. **Next.js** — SSR, SSG, API routes, middleware, App Router
6. **Node.js** — Express/Fastify, middleware, REST APIs
7. **Databases** — PostgreSQL, MongoDB, Prisma/Drizzle ORM
8. **Authentication** — JWT, OAuth2, NextAuth, session management
9. **State Management** — Zustand, Redux Toolkit, React Query
10. **Testing** — Jest, React Testing Library, Playwright, Cypress
11. **Deployment** — Vercel, AWS, Docker, CI/CD
12. **Performance** — Core Web Vitals, lazy loading, caching, CDN

---

## The 2026 Stack (Most In-Demand)

```
Frontend:  React / Next.js + TypeScript + Tailwind CSS
Backend:   Node.js (Express/Fastify) or Python (FastAPI)
Database:  PostgreSQL + Prisma ORM + Redis
Auth:      NextAuth / Clerk / Auth0
Deploy:    Vercel / AWS / Docker + K8s
Testing:   Vitest + Playwright
```

---

## Quick Reference

### React + TypeScript Component
```tsx
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      {todos.map(t => (
        <div key={t.id}>{t.text}</div>
      ))}
    </div>
  );
}
```

### Next.js API Route
```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = await prisma.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

---

## Tips
- **Learn TypeScript from Day 1** — no one writes plain JS anymore
- **Next.js is the default** for React in 2026
- **Prisma** simplifies database work massively
- **Build full projects** — todo apps don't count for portfolios
- **Deploy everything** — a live URL beats any resume bullet

Build the web! 🌍
