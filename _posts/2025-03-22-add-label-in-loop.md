---
layout: post
title:  "Expression Blocks vs Closures in Rust – What’s the Difference?"
description: "In Rust, both expression blocks ({}) and closures (|| {}) can return values — but they serve different purposes. This post breaks down their differences, when to use each, and how they compare to Go’s func()."
categories: rust
# tags: [ethereum, solidity, smartcontract]
keywords: rust, expression-block, closure
comments: true
---

## Table of Contents

- [Expression Blocks vs Closures](#expression-blocks-vs-closures)
  - [Key Differences](#key-differences)
  - [Expression Blocks: Inline One-Time Calculations](#expression-blocks-inline-one-time-calculations)
  - [Closures: Anonymous Functions for Reuse and Flexibility](#closures-anonymous-functions-for-reuse-and-flexibility)
- [Comparison with Go](#comparison-with-go)
- [Summary: When to Use What?](#summary-when-to-use-what)

## Expression Blocks vs Closures

### Key Differences

| Feature | Expression Block | Closure |
| --- | --- | --- |
| What it is | Inline calculation block | Anonymous function |
| Execution timing | Immediately | When called |
| Parameters | Not allowed | Allowed |
| Captures outer variables | No | Yes |
| Reusable | One-time | Yes |
| Passable to other funcs | No | Yes |
| Return value | Last expression | Last expression |

### Expression Blocks: Inline One-Time Calculations

```rust
let y = {
    let x = 10;
    x + 5
};
println!("{y}"); // 15
```

- Block used just for computing a value
- Executed immediately
- Returns the last expression (no semicolon)
- Does not take parameters or capture external variables
- Great for one-off logic that doesn’t need to be reused

#### When to Use Expression Blocks

- You need a value from a mini logic block
- You don’t need parameters
- You want instant evaluation
- You’re not planning to reuse the logic

#### Example: Using if, match, or even loop as a value

```rust
let is_even = {
    let n = 4;
    if n % 2 == 0 { true } else { false }
};

let result = match 2 {
    1 => "one",
    2 => "two",
    _ => "many",
};

let loop_value = {
    let mut n = 0;
    loop {
        n += 1;
        if n == 3 { break n * 10; }
    }
};
// loop_value == 30
```

**Note: `while` and `for` are statements, not expressions — they can’t be used like this.**

### Closures: Anonymous Functions for Reuse and Flexibility

```rust
let add = |a: i32, b: i32| a + b;
let result = add(3, 4); // 7
```

- Similar to anonymous functions in Go, JavaScript, etc.
- Executed only when called
- Can take parameters and capture external variables
- Useful when passing logic into another function (e.g. `map`, `filter`)
- Can be reused multiple times

#### When to Use Closures

- You need to reuse logic
- You want to pass logic as a parameter to another function
- You need to delay execution
- You need to capture external values

#### Common Use Cases

##### 1. Parameterized Logic

```rust
let square = |x| x * x;
println!("{}", square(5)); // 25
```

##### 2. Passing to Higher-Order Functions

```rust
let nums = vec![1, 2, 3];
let doubled: Vec<_> = nums.iter().map(|x| x * 2).collect();
// Result: [2, 4, 6]
```

##### 3. Threaded or Async Code

```rust
std::thread::spawn(|| {
    println!("Hello from thread");
});
```

##### 4. Capturing External Variables

```rust
let greeting = "Hi";
let say_hello = |name| format!("{greeting}, {name}");
println!("{}", say_hello("Alice")); // "Hi, Alice"
```

## Comparison with Go

Go only has function literals (`func() { ... }`) — no concept of expression blocks as values.

```go
val := func() {
    fmt.Println("hello")
}
val() // Must be called
```

In Rust:

- Use closures for what you'd use `func() { ... }` in Go
- Use expression blocks for inline logic to assign values quickly

## Summary: When to Use What?

| Situation | Use | Why |
| --- | --- | --- |
| Simple inline calculation | Expression block | Less syntax, faster execution |
| Passing logic to another function | Closure | Closures are first-class citizens |
| Accepting dynamic inputs | Closure | Accepting dynamic inputs |
| Passing logic to another function | Closure | Closures take parameters |
| Referencing external values | Closure | Can capture and use outer scope |
| Like func() in Go | Closure | Closures = Go's anonymous functions |
