---
title: "Comparison of String in Rust and Go"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-03-20"
slug: "go-rust-string-comparison"
summary: "Let's compare how strings work in Rust and Go."
description: "In this post, we compare how strings work in Rust and Go — especially in terms of mutability, memory handling, and how to modify them. If you’ve ever wondered why Rust has both &str and String, or why Go strings can’t be changed directly, this breakdown is for you."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "go", "rust", "2025"]
keywords: ["rust", "go", "string", "type"]
showTags: true
hideBackToTop: false
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "String Types in Rust and Go"
  "description": "In this post, we compare how strings work in Rust and Go — especially in terms of mutability, memory handling, and how to modify them. If you’ve ever wondered why Rust has both &str and String, or why Go strings can’t be changed directly, this breakdown is for you."
  "keywords": "rust, go, string, type"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Strings in Rust

### String Slice

```rust
let s = "hello"; // &str
```

- Immutable, read-only reference to a string
- Stored in static memory (binary section)
- Does not use the heap

```rust
let s = "hello"; 
// s points to the memory address of the "hello" string

s = "bye";
// s now points to a new memory address for "bye"
// The value isn't modified — the reference changes

// diagram
// "string type variable only points to the memory address"
// s -> 0x1234["hello"] 
// s -> 0x5678["bye"]
```

### Heap-Allocated Mutable String

```rust
let mut s = String::from("hello");
```

- Mutable, owns the data
- Stored on the heap
- You can modify it using methods like .push_str() and .clear()

```rust
let s1 = String::new(); 
// creates an empty string

s1 = String::from("hello"); // compile error — not mutable

let mut s2 = String::new(); // mutable

s2 = String::from("hello");
s2.push_str(" world");      // "hello world"
```

## Strings in Go

### string

```go
test := "first"
test = "second"
```

- Immutable value type
- Internally, a string is just a struct with a byte pointer and length:

```go
type string struct {
    data *byte
    len  int
}
```

- Assigning a new string creates a new string object in memory
- You cannot modify part of a string directly

### How to “Modify” Strings in Go

To modify a string in Go, convert it into a mutable byte slice:

```go
s := "hello"
b := []byte(s)   // Convert to byte slice
b[0] = 'H'       // Modify
s2 := string(b)  // Convert back to string

fmt.Println(s2)  // "Hello"
```

## Comparison of Rust and Go

| Concept | Go | Rust |
| --- | --- | --- |
| Immutable string | `string` | `&str` |
| Mutable string (heap allocated) | `[]byte`, `[]rune` | `String` |
| Modify string variable (new value) | s = "new" | s = `String::from(...)` |
| Modify string content | via `[]byte` conversion | via mutable `String` |

## Conclusion

- In both Rust and Go, default strings are immutable — they point to memory, but do not allow direct content modification.
- To change the content of a `string`:
  - In Rust, use a mutable `String`
  - In Go, convert to `[]byte` or `[]rune`
- If you’re just changing the entire string value, you’re assigning a new memory reference either way.
- Rust gives more fine-grained control over memory and mutability, while Go keeps things simple but less flexible when it comes to string manipulation.
