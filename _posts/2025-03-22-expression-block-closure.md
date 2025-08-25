---
layout: post
title:  "Using labels while looping in Rust: Breaking or Continuing Exactly Where You Mean To"
description: "Rust allows you to label loops and precisely control break and continue flow — even across nested loop, while, and for blocks. Learn how to avoid confusion in complex loop structures with simple, powerful labels."
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: rust, loop-label
comments: true
draft: true
---

## Table of Contents

- [Why Use Loop Labels in Rust?](#why-use-loop-labels-in-rust)
- [Using loop with labels](#using-loop-with-labels)
- [Using while with labels](#using-while-with-labels)
- [Using for with labels](#using-for-with-labels)
- [Using continue with labels](#using-continue-with-labels)
- [Summary](#summary)

## Why Use Loop Labels in Rust?

When you have nested loops, calling `break` or `continue` may only affect the nearest loop.
If you want to target an outer loop, Rust lets you assign a label using the `label_name:` syntax.

## Using loop with labels

```rust
fn main() {
    let mut count = 0;

    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            
            if remaining == 9 {
                break; // exits this inner loop only
            }

            if count == 2 {
                break 'counting_up; // exits the labeled outer loop
            }

            remaining -= 1;
        }

        count += 1;
    }

    println!("End count = {count}");
}
```

- `break` exits the inner loop
- `break 'counting_up` exits the outer labeled loop
- You can apply labels to any loop, not just loop blocks

## Using while with labels

```rust
fn main() {
    let mut i = 0;

    'outer: while i < 5 {
        let mut j = 0;
        while j < 5 {
            if i == 2 && j == 2 {
                break 'outer; // exits the outer while loop
            }
            j += 1;
        }
        i += 1;
    }

    println!("Done: i = {i}");
}
```

## Using for with labels

```rust
fn main() {
    'outer: for x in 0..5 {
        for y in 0..5 {
            if x == 2 && y == 2 {
                break 'outer; // exits the outer for loop
            }
            println!("x = {x}, y = {y}");
        }
    }
}
```

## Using continue with labels

```rust
'outer: for x in 0..3 {
    for y in 0..3 {
        if y == 1 {
            continue 'outer; // skips rest of inner loop and moves to next outer iteration
        }
        println!("x = {x}, y = {y}");
    }
}
```

## Summary

| Concept | Description |
| --- | --- |
| break | Exits the nearest loop |
| break 'label | Exits the specific loop with the given label |
| continue 'label | Skips to the next iteration of the labeled loop |
| Label works on | `loop`, `while`, `for`, and `continue` |
