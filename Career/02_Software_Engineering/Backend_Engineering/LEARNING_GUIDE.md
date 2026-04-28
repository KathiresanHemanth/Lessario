# Backend Engineering - Learning Guide

## 🎯 Goal
Master backend development — APIs, databases, system design, scalability. Backend engineers are the backbone of every tech company.

## 💰 Salary Range (India)
| Level | Salary |
|-------|--------|
| Fresher | ₹6-12 LPA |
| Mid (2-4 yrs) | ₹15-30 LPA |
| Senior (5+ yrs) | ₹30-60 LPA |
| Staff/Principal | ₹60-1.2 Cr+ |

---

## Core Concepts (in order)

1. **HTTP & REST** — Methods, status codes, headers, REST principles
2. **API Design** — REST, GraphQL, gRPC, WebSocket, versioning
3. **Databases** — SQL (PostgreSQL, MySQL), NoSQL (MongoDB, Redis)
4. **Authentication** — JWT, OAuth2, sessions, API keys, RBAC
5. **Caching** — Redis, Memcached, CDN, cache invalidation
6. **Message Queues** — RabbitMQ, Kafka, Redis Pub/Sub, SQS
7. **Microservices** — Service decomposition, API gateway, service mesh
8. **System Design** — Load balancing, sharding, replication, CAP theorem
9. **Containerization** — Docker, Docker Compose, Kubernetes
10. **CI/CD** — GitHub Actions, Jenkins, automated testing
11. **Monitoring** — Logging (ELK), metrics (Prometheus), tracing (Jaeger)
12. **Security** — OWASP Top 10, rate limiting, input validation, encryption

---

## Quick Reference

### Node.js + Express API
```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [];

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const user = { id: users.length + 1, ...req.body };
    users.push(user);
    res.status(201).json(user);
});

app.listen(3000, () => console.log('Server on :3000'));
```

### FastAPI (Python)
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

items = []

@app.post("/items/", status_code=201)
def create_item(item: Item):
    items.append(item)
    return item

@app.get("/items/")
def list_items(skip: int = 0, limit: int = 10):
    return items[skip : skip + limit]
```

### PostgreSQL Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
```

### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on: [db, cache]

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes: ["pgdata:/var/lib/postgresql/data"]

  cache:
    image: redis:7-alpine

volumes:
  pgdata:
```

---

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **Languages** | Node.js, Python, Go, Java, Rust |
| **Frameworks** | Express, FastAPI, Spring Boot, Gin, Axum |
| **SQL DB** | PostgreSQL, MySQL, SQLite |
| **NoSQL** | MongoDB, Redis, DynamoDB, Cassandra |
| **Queue** | RabbitMQ, Kafka, Redis Streams, SQS |
| **Container** | Docker, Kubernetes, Docker Compose |
| **API** | REST, GraphQL, gRPC, tRPC |
| **Auth** | JWT, OAuth2, Passport.js, Auth0 |
| **Monitor** | Prometheus, Grafana, ELK, Datadog |

---

## System Design Cheatsheet

| Problem | Solution |
|---------|----------|
| High traffic | Load balancer (Nginx, HAProxy) |
| Slow queries | Database indexing, query optimization |
| Repeated requests | Caching (Redis) |
| Data growth | Database sharding, partitioning |
| Service coupling | Message queue (Kafka, RabbitMQ) |
| Single point of failure | Replication, multi-AZ |
| API versioning | URL path (/v1/) or header |
| Rate limiting | Token bucket, sliding window |

---

## Interview Topics
- ✅ REST API design and best practices
- ✅ SQL queries, joins, indexes, transactions
- ✅ System design (URL shortener, Twitter, WhatsApp)
- ✅ CAP theorem, ACID, BASE
- ✅ Caching strategies and invalidation
- ✅ Database normalization vs denormalization
- ✅ Microservices vs monolith tradeoffs
- ✅ Authentication and authorization flows

Build systems that scale! ⚙️
