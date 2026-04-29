# Rust Programming - Learning Guide

## 🎯 Goal
Master Rust — the most loved language 8 years running. Used for systems programming, WebAssembly, blockchain, game engines, and replacing C/C++ everywhere.

## 💰 Salary Range (India / Global)
| Level | India | Global (Remote) |
|-------|-------|-----------------|
| Fresher | ₹8-15 LPA | $80-120K |
| Mid (2-4 yrs) | ₹18-35 LPA | $120-180K |
| Senior (5+ yrs) | ₹35-60+ LPA | $180-300K+ |

*Rust developers are extremely rare = extremely high demand*

---

## Core Concepts (in order)

1. **Ownership & Borrowing** — THE core concept, unique to Rust
2. **Variables & Types** — let, mut, i32, f64, String, &str, bool
3. **Control Flow** — if/else, loop, while, for, match (pattern matching)
4. **Functions & Closures** — fn, closures, higher-order functions
5. **Structs & Enums** — Custom types, Option<T>, Result<T, E>
6. **Error Handling** — Result, ?, unwrap, expect, custom errors (thiserror, anyhow)
7. **Traits** — Interfaces, generics, trait bounds, impl
8. **Collections** — Vec, HashMap, HashSet, BTreeMap
9. **Lifetimes** — 'a, lifetime annotations, elision rules
10. **Smart Pointers** — Box, Rc, Arc, RefCell, Mutex
11. **Concurrency** — threads, channels, async/await, tokio
12. **Macros** — macro_rules!, procedural macros, derive
13. **Unsafe Rust** — raw pointers, FFI, when to use unsafe
14. **Cargo & Ecosystem** — cargo, crates.io, workspaces, features

---

## Quick Reference

### Ownership — The Key Concept
```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;           // s1 is MOVED to s2, s1 is invalid now
    // println!("{s1}");    // ERROR! s1 was moved

    let s3 = s2.clone();   // Deep copy — both valid
    println!("{s2} {s3}");  // OK

    // Borrowing — pass reference without taking ownership
    let len = calculate_length(&s2);
    println!("{s2} has length {len}");  // s2 still valid
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### Error Handling with Result
```rust
use std::fs;
use std::io;

fn read_config(path: &str) -> Result<String, io::Error> {
    let content = fs::read_to_string(path)?; // ? propagates error
    Ok(content)
}

fn main() {
    match read_config("config.toml") {
        Ok(config) => println!("Config: {config}"),
        Err(e) => eprintln!("Error: {e}"),
    }
}
```

### Structs, Traits, Generics
```rust
trait Describable {
    fn describe(&self) -> String;
}

struct Engineer {
    name: String,
    field: String,
}

impl Describable for Engineer {
    fn describe(&self) -> String {
        format!("{} specializes in {}", self.name, self.field)
    }
}

fn print_description(item: &impl Describable) {
    println!("{}", item.describe());
}
```

### Async with Tokio
```rust
use tokio;
use reqwest;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let body = reqwest::get("https://httpbin.org/get")
        .await?
        .text()
        .await?;
    println!("Response: {}", &body[..100]);
    Ok(())
}
```

---

## 🛠️ Tools

| Category | Tools |
|----------|-------|
| **Build** | cargo, rustup, rust-analyzer |
| **Web** | Actix-web, Axum, Rocket, Warp |
| **Async** | Tokio, async-std |
| **CLI** | clap, indicatif, dialoguer |
| **Serialization** | serde, serde_json, toml |
| **Database** | sqlx, diesel, sea-orm |
| **Error** | thiserror, anyhow, color-eyre |
| **WASM** | wasm-pack, wasm-bindgen, yew |
| **Embedded** | embedded-hal, probe-rs, RTIC |
| **Blockchain** | Solana SDK, Substrate (Polkadot) |

---

## Where Rust Is Used

| Company | Usage |
|---------|-------|
| **Discord** | Replaced Go with Rust for performance |
| **Cloudflare** | Edge computing, proxy servers |
| **Meta** | Source control (Sapling), backend |
| **AWS** | Firecracker (Lambda/Fargate engine) |
| **Google** | Android (Rust in kernel), Chrome |
| **Microsoft** | Windows kernel components |
| **Solana** | Entire blockchain in Rust |
| **Huawei** | Trusted computing, OS components |

---

## Tips
- **Ownership is HARD at first** — spend 2 weeks just on this
- **Fight the borrow checker** — it makes you write better code
- **Read "The Rust Book"** — official, free, essential: doc.rust-lang.org/book
- **Rust for blockchain** = extremely lucrative (Solana, Polkadot)
- **Rust + WASM** = future of high-perf web apps
- **Rust replacing C/C++** = career opportunity in systems/embedded

Think in ownership! 🦀
