---
title: "Inline Functions in C"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-03-16"
slug: "c-inline-functions"
summary: "Inline function is used for performance optimization, encapsulation, and reduced stack usage"
description: "inline functions in C allow code to be expanded at compile time and included in the final executable."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "c", "2025"]
keywords: ["c", "inline", "function", "performance", "optimization", "encapsulation", "stack", "usage", "macro"]
showTags: true
hideBackToTop: false
aliases:
  - /2025/03/17/inline-function-c/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Inline Functions in C"
  "description": "inline functions in C allow code to be expanded at compile time and included in the final executable."
  "keywords": "c, inline, function, performance, optimization, encapsulation, stack, usage, macro"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Inline Function

An `inline` function is a special function in C that suggests the compiler replace the function call with its actual code to optimize performance.

```c
#include <stdio.h>

inline int square(int x) {
    return x * x;
}

int main() {
    int result = square(5); // Expands to: int result = (5 * 5);
    printf("%d\n", result);
}
```

- When the compiler processes `square(5)`, it replaces the function call with its definition: `int result = (5 * 5);`
- This eliminates the overhead of function calls, potentially improving performance.

## Why Use inline Functions?

- Performance Optimization – Reduces function call overhead.
- Encapsulation – Keeps function logic organized while avoiding extra calls.
- Reduced Stack Usage – No need to store function call metadata in the stack.

## When Does the Compiler Ignore inline?

However, unlike Rust macros, inline in C is just a hint to the compiler—it does not guarantee inlining. The compiler decides whether to actually inline the function based on various optimization criteria.

Despite marking a function as inline, the compiler might not inline it in the following cases:

### 1️. The Function Is Too Large

If a function contains too many instructions, inlining it could increase code size unnecessarily.

```c
inline int big_function(int x) {
    int result = x;
    for (int i = 0; i < 1000; i++) { // Large loop
        result += i;
    }
    return result;
}
```

- Expanding this function in multiple places increases binary size.
- Too much code duplication can harm performance rather than improve it.
- The compiler might keep it as a regular function instead.

### 2. Recursive Functions

```c
inline int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1); // Recursive call
}
```

- Inlining a recursive function is impossible in most cases because the function keeps calling itself.
- The compiler would need to unroll the recursion into a loop, which is not always feasible.
- If recursion depth is small and known in advance, consider manual loop unrolling instead.

### 3. Function Pointers Prevent Inlining

```c
inline int add(int a, int b) { return a + b; }

int main() {
    int (*func_ptr)(int, int) = add; // Assign function to pointer
    int result = func_ptr(3, 4);     // Compiler does not know function at compile time
    printf("%d\n", result);
}
```

- When using function pointers, the actual function call is determined at runtime, not at compile time.
- The compiler cannot replace function calls with direct code expansion because the target function is unknown during compilation.
- Use direct function calls instead of function pointers when inlining is critical.

## Forcing the Compiler to Inline a Function

If the compiler ignores inline, you can explicitly force inlining using compiler-specific attributes.

### 1. GCC and Clang

```c
inline __attribute__((always_inline)) int add(int a, int b) {
    return a + b;
}
```

- Ensures the function will always be inlined, even if it’s large.
- Only works if optimizations are enabled (-O2 or higher).
- Forcing inlining on a large function can increase binary size and reduce cache efficiency.

### 2. MSVC (Microsoft Compiler): __forceinline

```c
__forceinline int add(int a, int b) {
    return a + b;
}
```

- Forces the function to be inlined in Microsoft compilers (MSVC).
- Ensures consistent inlining behavior across different builds.

## Conclusion

Use inline for:

- Small, frequently used functions.
- Performance-sensitive calculations (e.g., mathematical operations).
- Functions that replace macros for better type safety.

Avoid inline for:

- Large functions (can increase binary size).
- Recursive functions.
- Functions used with pointers or virtual functions (C++).
