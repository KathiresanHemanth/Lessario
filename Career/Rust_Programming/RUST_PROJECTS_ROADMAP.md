# Rust Programming - Project-Based Roadmap

## Level 1: Basics (Weeks 1-3)

### Project 1: CLI Todo App
- Add, list, complete, delete tasks from terminal
- **Concepts**: Ownership, structs, enums, file I/O, serde
- **Difficulty**: ⭐

### Project 2: Grep Clone (minigrep)
- Search for patterns in files (from Rust Book)
- **Concepts**: Error handling, iterators, closures, CLI args
- **Difficulty**: ⭐⭐

### Project 3: JSON Parser
- Parse JSON strings into Rust data structures
- **Concepts**: Enums, recursion, pattern matching, String handling
- **Difficulty**: ⭐⭐

### Project 4: Markdown to HTML Converter
- Convert markdown files to HTML
- **Concepts**: String processing, regex, file I/O
- **Difficulty**: ⭐⭐

---

## Level 2: Systems (Weeks 4-7)

### Project 5: HTTP Server from Scratch
- Build a multi-threaded HTTP/1.1 server
- **Concepts**: TCP, threading, Arc/Mutex, HTTP protocol
- **Difficulty**: ⭐⭐⭐

### Project 6: Key-Value Store
- In-memory KV store with persistence to disk
- **Concepts**: HashMap, serialization, file I/O, traits
- **Difficulty**: ⭐⭐⭐

### Project 7: Shell (Command Line Interpreter)
- Build a basic Unix shell — parse commands, fork processes
- **Concepts**: Process spawning, pipes, environment vars
- **Difficulty**: ⭐⭐⭐

### Project 8: Memory Allocator
- Custom memory allocator implementing GlobalAlloc
- **Concepts**: Unsafe Rust, raw pointers, memory layout
- **Difficulty**: ⭐⭐⭐⭐

---

## Level 3: Web & Async (Weeks 8-11)

### Project 9: REST API with Axum
- Full CRUD API with PostgreSQL, JWT auth
- **Concepts**: Axum, sqlx, tower, async/await, middleware
- **Difficulty**: ⭐⭐⭐

### Project 10: URL Shortener
- Shorten URLs with Redis caching, rate limiting
- **Concepts**: Redis, Axum, connection pooling, tokio
- **Difficulty**: ⭐⭐⭐

### Project 11: WebSocket Chat Server
- Real-time chat with rooms using tokio + tungstenite
- **Concepts**: WebSocket, async channels, broadcast
- **Difficulty**: ⭐⭐⭐

### Project 12: Web Crawler
- Concurrent web crawler with depth limit and politeness
- **Concepts**: reqwest, tokio, semaphores, HTML parsing
- **Difficulty**: ⭐⭐⭐⭐

---

## Level 4: Advanced (Weeks 12-16)

### Project 13: Database Engine (Simple)
- B-tree based storage engine with basic SQL parsing
- **Concepts**: B-trees, page management, query parsing
- **Difficulty**: ⭐⭐⭐⭐

### Project 14: Blockchain Node
- Simple blockchain with proof-of-work, P2P networking
- **Concepts**: Hashing, consensus, networking, serialization
- **Difficulty**: ⭐⭐⭐⭐

### Project 15: WASM App with Yew
- Full web app compiled to WebAssembly using Yew framework
- **Concepts**: wasm-pack, Yew components, web APIs
- **Difficulty**: ⭐⭐⭐⭐

### Project 16: Embedded Rust (STM32)
- Blink LED and read sensor on STM32 in Rust
- **Concepts**: embedded-hal, no_std, probe-rs, RTIC
- **Difficulty**: ⭐⭐⭐⭐

---

## Recommended Path
**Week 1-3**: Projects 1-4 → **Week 4-7**: Projects 5-8 → **Week 8-11**: Projects 9-12 → **Week 12-16**: Projects 13-16
