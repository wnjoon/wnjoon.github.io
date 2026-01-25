---
title: "Defer doesn’t always reflect the latest value in Go"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-03-14"
slug: "go-defer-issue-last-value"
summary: "Learn common issues when using defer in Go."
description: "In Go, deferred functions capture arguments immediately, not when they actually run. Learn how to fix this common issue using closures or pointers to ensure your deferred calls use the latest variable values."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "go", "2025"]
keywords: ["go", "defer", "channel", "mutex", "sync", "cond", "goroutine", "synchronization"]
showTags: true
hideBackToTop: false
aliases:
  - /2025/03/14/go-defer-value/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Goroutine Synchronization in Go"
  "description": "sync.Cond is a condition variable that helps synchronize multiple goroutines."
  "keywords": "go, channel, mutex, sync, cond, goroutine, synchronization"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## The Problem

Consider the following Go function:

```go
func f() error {
    var status string  // Initialized as an empty string
    defer notify(status)

    if err := foo(); err != nil {
        status = "error"  // Status changes here, but defer does not reflect this change
        return err
    }

    status = "success"
    return nil
}
```

We might expect notify(status) to reflect the latest value of status.
However, in reality, it always receives an empty string (`""`), regardless of how status is updated later.

## The Reason why status is not updated

```go
var status string // ""
```

- `status` is initialized as an empty string
- `defer` evaluates its arguments immediately when declared.
  - When `defer notify(status)` is called, `status` is still an empty string.
  - Thus, `defer` captures the empty string(`""`) at this moment and never updates, even if `status` changes later.
- Even though `status` is modified in the function, the deferred function call was already bound to the original value of `status` (empty string).
- In Go, when a function is deferred, its arguments are evaluated and stored immediately—not when the function actually executes.

## How to Fix It?

To ensure that notify(status) receives the latest value of status, we can use two different approaches.

### 1. Using a Closure (Anonymous Function)

```go
defer func() { notify(status) }()
```

- Instead of immediately passing `status` to `notify`, we defer an anonymous function.
- This function captures `status` at the moment `defer` executes, ensuring it reflects the latest value.
- When `notify(status)` is finally called, it uses the updated value of `status`.

### 2. Passing a Pointer

```go
defer notify(&status)
```

- Instead of passing the value of `status`, we pass its memory address (`&status`).
- Since `defer` captures the pointer, any changes to `status` are reflected at execution time.
- However, this requires modifying `notify` to accept a pointer parameter.

```go
// If using a pointer, notify must be updated:
// Dereference the pointer to get the latest value
func notify(status *string) {
    fmt.Println(*status) 
}
```

### 3. Comparison of Solutions

| Approach | How it Works | Requires Function Signature Change? | Best Use Case |
| --- | --- | --- | --- |
| Closure (Anonymous Function) | Captures `status` at execution time | No | Works for most cases |
| Pointer Passing (&status) | Passes a pointer, reflects latest value | Yes | When working with functions that support pointers |

## Conclusion

- Deferred functions capture arguments immediately, not when they actually run.
- If the deferred function needs the latest value, use:
  - Closures (Anonymous Functions): Recommended, as they don’t require modifying function signatures.
  - Pointers (&status): Useful when modifying function behavior explicitly.
