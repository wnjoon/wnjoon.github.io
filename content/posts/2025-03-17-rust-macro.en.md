---
title: "Macros in Rust"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-03-17"
slug: "rust-macro"
summary: "Let's understading How macros in Rust work and comparing with C language"
description: "Macros in Rust allow code to be expanded at compile time and included in the final executable."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "rust", "c", "2025"]
keywords: ["rust", "c", "inline", "function", "performance", "optimization", "encapsulation", "stack", "usage", "macro"]
showTags: true
hideBackToTop: false
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Macro in Rust"
  "description": "Macros in Rust allow code to be expanded at compile time and included in the final executable."
  "keywords": "rust, c, inline, function, performance, optimization, encapsulation, stack, usage, macro"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Macros in Rust?

Macros in Rust allow code to be expanded at compile time and included in the final executable.

**Rust documentation commonly refers to macros as “expanded” at compile time.**

- However, this term can be **misleading**.
- The term “expanded” may suggest that the code dynamically changes at runtime. However, Rust macros operate entirely at compile time and do not modify execution at runtime.
- Instead of just being “expanded,” macros generate code, which is then compiled into the final executable.

A more precise way to explain macros:

- Macros generate code at compile time and include it in the final program.
- Once the executable is compiled, the macro-generated code is “fixed” and cannot change at runtime.

## Macros vs. Functions in Rust

| Feature | Macros (macro_rules!) | Functions (fn) |
| --- | --- | --- |
| Code Generation at Compile Time | Yes | No |
| Variable Number of Arguments | Yes | No |
| Supports Multiple Types | Yes (via code generation) | Yes (via generics) |
| Performance Optimization | Yes (no loops, direct code expansion) | No (loops execute at runtime) |
| Readability & Debugging | Hard to debug | Easy to debug |

### When Should You Use Macros?

- You need compile-time code generation to optimize performance.
- You need to support multiple types dynamically.
- You need variable-length arguments (e.g., `println!`).

### When Should You Use Functions?

- You need standard logic implementation.
- You need easier debugging.
- You have repetitive logic that doesn’t require compile-time expansion.

### Macros are not just about avoiding code repetition

- If simple repetition is needed, functions are usually a better choice.
- Use macros when you need compile-time optimizations, dynamic argument handling, or complex code generation.

## Compile-Time vs. Runtime Execution

| Feature | Compile Time (Macro Expansion) | Runtime (Function Execution) |
| --- | --- | --- |
| Macros (macro_rules!) | Code is expanded at compile time | Never executed directly |
| Functions (fn) | No expansion at compile time | Executed during runtime |
| Error Detection | Errors occur at compile time | Errors occur at runtime |

### Using Macros (macro_rules!)

```rust
macro_rules! repeat {
    ($msg:expr, $count:expr) => {
        $( println!("{}", $msg); )*
    };
}

fn main() {
    repeat!("Hello, Rust!", 3);
    
    // The macro expands into:
    println!("{}", "Hello, Rust!");
    println!("{}", "Hello, Rust!");
    println!("{}", "Hello, Rust!");
}
```

- The macro expands the `println!` calls at compile time, rather than looping at runtime.
- When compiled, the executable already contains three `println!` statements, eliminating any need for iteration at runtime.

### Using Functions (fn)

```rust
fn repeat(msg: &str, count: usize) {
    for _ in 0..count {
        println!("{}", msg);
    }
}

fn main() {
    repeat("Rust is awesome!", 3);
}
```

- The function executes a loop at runtime instead of unrolling at compile time.
- The compiled binary contains a loop, which adds execution overhead compared to macros.

## Advantages of Using Macros

Macros expand code at compile time, reducing runtime overhead.

- Functions require stack management and runtime execution.
- Macros allow code to be directly inserted into the final program, avoiding function calls.
- For example, match statements inside macros can be expanded into static branching logic, improving performance.

## Why Macros Are Hard to Debug

### Macros Expand Into New Code Before Compiling

```rust
macro_rules! bad_macro {
    ($val:expr) => {
        if $val {
            println!("True");
        } else {
            println!("False");
        }
    };
}

fn main() {
    bad_macro!(42);  // error
}
```

The macro expands before compilation, replacing `bad_macro!(42)`; with:

```rust
if 42 {
    println!("True");
} else {
    println!("False");
}
```

But if 42 is not valid in Rust -> this causes a type mismatch.

Rust’s error message points to the expanded code, not the macro definition:

```sh
error[E0308]: mismatched types
 --> src/main.rs:9:5
  |
9 |     bad_macro!(42);
  |     ^^^^^^^^^^^^^ expected `bool`, found integer
  |
  = note: expected type `bool`
             found type `{integer}`
```

Rust does not indicate that the error originated inside `bad_macro!`.
Instead, it shows an error where the macro was expanded, making debugging more difficult.

### Debugging Logs Are Limited

```rust
macro_rules! debug_macro {
    ($val:expr) => {
        let result = $val / 0; // Runtime error
        println!("{}", result);
    };
}

fn main() {
    debug_macro!(10);
}
```

- This macro expands before compilation, meaning `let result = 10 / 0;` is inserted directly.
- Rust won’t warn about division by zero at compile time, but it crashes at runtime.
- Debugging is difficult because Rust does not pinpoint where inside the macro the issue originated.

### How to Debug Macros?

```sh
cargo install cargo-expand
cargo expand
```

- Use `cargo expand` to view the expanded macro output

## Comparison with C Macros

Although C and Rust are both compiled languages, Rust macros provide safer and more structured compile-time code generation.

### #define

```c
#include <stdio.h>

#define SQUARE(x) (x * x)

int main() {
    int result = SQUARE(5); // Expands to: (5 * 5)
}
```

- C macros are text replacements, not structured code transformations.
- They lack type checking and can introduce subtle bugs.
- Rust macros, in contrast, operate within the compiler and ensure type safety.

### inline Functions

**Comparison with Rust Macros**

| Feature | C inline Function | Rust Macro (macro_rules!) |
| --- | --- | --- |
| Compile-Time Expansion | Compiler decides whether to inline | Always expands at compile time |
| Guaranteed Optimization | Not always inlined | Always replaces code directly |
| Code Size Consideration | Large functions may not be inlined | Can increase code size |
| Flexibility | Works with fixed types | Works with multiple types and patterns |

```c
#include <stdio.h>

inline int square(int x) {
    return x * x;
}

int main() {
    int result = square(5);
}
```

- Compilers may choose not to inline functions for performance reasons.
- Large or recursive functions will not be inlined.
- Rust macros, in contrast, always expand before compilation.

## Conclusion

**When to Use Rust Macros?**

- You need compile-time code generation for performance.
- You need flexible, generic behavior across multiple types.
- You need variadic arguments (e.g., `println!`).

**When to Avoid Rust Macros?**

- You need easier debugging -> Functions are better.
- You don’t need compile-time code transformation -> Functions work fine.
- Your macro logic is too complex -> Hard to maintain.
