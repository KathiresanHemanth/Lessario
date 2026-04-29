# Python Development - Learning Guide

## 🎯 Goal
Master Python end-to-end — scripting, automation, web backends, data science, and system tools. Python is the #1 most in-demand language globally.

---

## 💰 Salary Range (India)
| Level | Salary |
|-------|--------|
| Fresher | ₹4-8 LPA |
| Mid (2-4 yrs) | ₹10-20 LPA |
| Senior (5+ yrs) | ₹20-45 LPA |
| Specialist (ML/Backend) | ₹30-60+ LPA |

---

## Core Concepts (in order)

1. **Basics** — Variables, data types, operators, strings
2. **Control Flow** — if/else, for, while, comprehensions
3. **Functions** — args, kwargs, decorators, closures, generators
4. **OOP** — Classes, inheritance, polymorphism, magic methods
5. **Data Structures** — Lists, dicts, sets, tuples, collections module
6. **File I/O** — Reading/writing files, CSV, JSON, YAML
7. **Error Handling** — try/except, custom exceptions, logging
8. **Modules & Packages** — pip, virtualenv, creating packages
9. **Iterators & Generators** — yield, lazy evaluation, itertools
10. **Concurrency** — threading, multiprocessing, asyncio, aiohttp
11. **Testing** — unittest, pytest, mocking, coverage
12. **Type Hints** — typing module, mypy, Pydantic
13. **Web Frameworks** — FastAPI, Django, Flask
14. **Databases** — SQLAlchemy, psycopg2, pymongo
15. **DevOps** — Docker, CI/CD, linting (ruff, black)

---

## Quick Reference

### Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install fastapi uvicorn
pip freeze > requirements.txt
```

### Modern Python Features (3.10+)
```python
# Pattern matching (3.10)
match command:
    case "quit":
        exit()
    case "hello" | "hi":
        print("Hello!")
    case _:
        print("Unknown command")

# Walrus operator (3.8)
if (n := len(data)) > 10:
    print(f"Too long: {n} items")

# F-strings with = (3.8)
name = "Python"
print(f"{name=}")  # name='Python'

# Type hints (3.9+)
def greet(name: str, times: int = 1) -> list[str]:
    return [f"Hello {name}!"] * times
```

### FastAPI — Modern Web Framework
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    email: str
    age: int

users_db: list[User] = []

@app.post("/users/")
def create_user(user: User):
    users_db.append(user)
    return {"message": "User created", "user": user}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    if user_id >= len(users_db):
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]
```

### Async Programming
```python
import asyncio
import aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = ["https://api.github.com", "https://httpbin.org/get"]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        for r in results:
            print(r[:100])

asyncio.run(main())
```

### Decorators
```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def heavy_computation(n):
    return sum(i**2 for i in range(n))
```

---

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **IDE** | VS Code + Python extension, PyCharm |
| **Package Mgr** | pip, poetry, uv (fast!) |
| **Linting** | ruff, black, isort, mypy |
| **Testing** | pytest, coverage, hypothesis |
| **Web** | FastAPI, Django, Flask |
| **Data** | Pandas, NumPy, Polars |
| **Async** | asyncio, aiohttp, httpx |
| **ORM** | SQLAlchemy, Tortoise, Django ORM |
| **Task Queue** | Celery, RQ, Dramatiq |

---

## Interview Topics
- ✅ List comprehensions, generators, decorators
- ✅ GIL (Global Interpreter Lock) and concurrency
- ✅ Memory management and garbage collection
- ✅ `*args` and `**kwargs`, closures
- ✅ Difference between `is` and `==`
- ✅ Mutable vs immutable types
- ✅ Context managers (`with` statement)
- ✅ async/await and event loop
- ✅ Design patterns in Python

---

## Tips
- Use **type hints everywhere** — modern Python demands it
- Learn **FastAPI** over Flask — it's the future
- Master **pytest** — every company uses it
- Use **uv** or **poetry** instead of raw pip
- Read Python Enhancement Proposals (PEPs) — especially PEP 8, 484, 572

Python powers everything! 🐍
