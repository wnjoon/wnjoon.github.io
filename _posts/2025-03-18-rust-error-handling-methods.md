---
layout: post
title:  "Rust Error Handling: unwrap, expect, and unwrap_or"
description: "Learn how Rust enforces error handling at compile time and explore different techniques for dealing with Result<T, E> effectively using unwrap, expect, unwrap_or, and pattern matching."
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: rust, error, unwrap, expect, pattern matching
comments: true
draft: true
---

## Table of Contents

- [Why Rust Forces You to Handle Errors](#why-rust-forces-you-to-handle-errors)
- [Handling Errors: unwrap, expect, unwrap_or](#handling-errors-unwrap-expect-unwrap_or)
- [More Idiomatic Alternatives](#more-idiomatic-alternatives)
- [Comparison with Go](#comparison-with-go)
- [Summary](#summary)

## Why Rust Forces You to Handle Errors

In Rust, functions that can fail typically return a Result<T, E> type. You must handle the result, even if you are confident the operation will succeed.

```rust
let num = "42".parse::<i32>();
// Result<i32, ParseIntError>
```

Trying to ignore the Result leads to a compile-time warning:

```sh
warning: unused `Result` that must be used
 --> main.rs:2:9
  |
2 |     let num = "42".parse::<i32>();
  |         ^^^^^^^^^^^^^^^^^^^^^^^^^
  |         |
  |         this `Result` may be an `Err` variant, which should be handled
```

You can’t use the result as if it’s already a number:

```rust
let result = "42".parse::<i32>(); // Ok(42)
let doubled = result * 2;         // Error: result is not i32 but Result<i32, _>
```

## Handling Errors: unwrap, expect, unwrap_or

Rust provides several built-in ways to handle Result values.

| Method | Panics on Error? | Provides Default Value? | Custom Message? | Use Case |
| --- | --- | --- | --- | --- |
| unwrap() | Yes | No | No | Quick tests, throwaway code |
| expect("msg") | Yes | No | Yes | Debugging with context |
| unwrap_or(x) | No | Yes | No | Fallback/default values |

### unwrap()

```rust
let x = "42".parse::<i32>().unwrap();    // Returns 42
let y = "abc".parse::<i32>().unwrap();   // Panics!
```

When an error occurs, `unwrap()` panics with a default error message:

```sh
thread 'main' panicked at 'called `Result::unwrap()` on an `Err` value: ParseIntError'
```

Not safe for production code—use only when you’re absolutely sure it will not fail.

### expect("custom message")

```rust
let x = "abc"
    .parse::<i32>()
    .expect("number type is required");
```

Customizes the panic message:

```sh
thread 'main' panicked at 'number type is required: ParseIntError'
```

Helps during debugging by giving clearer failure context than `unwrap()`.

### unwrap_or(default_value)

```rust
let x = "abc".parse::<i32>().unwrap_or(0); // 0 when parse fails
println!("{x}"); // Output: 0
```

No panic. Returns a default fallback instead of crashing.

## More Idiomatic Alternatives

These methods avoid panic and allow graceful error handling.

### Pattern Matching with match

```rust
let result = "42".parse::<i32>();

match result {
    Ok(n) => println!("Parsed number: {}", n),
    Err(e) => println!("Error occurred: {}", e),
}
```

### if let for Simpler Matching

```rust
if let Ok(n) = "42".parse::<i32>() {
    println!("Parsed number: {}", n);
} else {
    println!("Not a valid number.");
}
```

### Propagating Errors with ? Operator

```rust
fn parse_number() -> Result<i32, std::num::ParseIntError> {
    let n = "42".parse()?;  // If parse fails, early return
    Ok(n)
}
```

- Only works inside functions that return `Result`.

## Comparison with Go

| Rust | Go |
| --- | --- |
| .unwrap() | panic(err) |
| .unwrap_or(default_value) | if err != nil { return default_value } |
| .expect("msg") | panic("msg: " + err.Error()) |

## Summary

Rust enforces error handling at compile time to eliminate runtime surprises. You have multiple tools at your disposal—choose based on the level of control and safety you need:

- `unwrap()` – Fast, but dangerous.
- `expect("msg")` – Safer panic with clear context.
- `unwrap_or(default_value)` – Clean fallbacks.
- `match`, `if let`, `?` – Idiomatic and safe.
