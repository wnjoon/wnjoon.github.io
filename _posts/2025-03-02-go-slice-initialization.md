---
layout: post
title:  "Understanding Slice Initialization and Capacity in Go"
description: "Understanding slice capacity behavior is essential for writing efficient Go programs, especially when dealing with large or dynamic data structures."
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: go, slice, capacity
comments: true
---

## Contents

- [Summary](#summary)
- [How to Initialize a Slice](#how-to-initialize-a-slice)
- [Advantages of Preallocating Capacity](#advantages-of-preallocating-capacity)
- [Creating a Slice with an Initial Length](#creating-a-slice-with-an-initial-length)

## Summary

1. Preallocating capacity improves performance by reducing the number of reallocations when appending elements.
2. If a slice is initialized with a non-zero length, it is pre-filled with zero values.
3. Appending elements can trigger capacity expansion, usually doubling the size of the underlying array.

## How to Initialize a Slice

In Go, the following code snippet creates a slice with length 0 and capacity 1:

```go
// Create a slice with length 0 and capacity 1
slice := make([]int, 0, 1)
```

- `Length(len)`: The number of elements currently stored in the slice. This represents the number of initialized elements.
- `Capacity(cap)`: The total allocated size of the underlying array, which determines how many elements can be stored before reallocation is required.

## Advantages of Preallocating Capacity

In Go, when a slice reaches its capacity, the underlying array doubles in size upon expansion.
If you expect a slice to grow significantly, preallocating capacity can improve performance by reducing memory reallocations.

Here is an example of capacity expansion in slices:

```go
s := make([]int, 0, 1) // Initial capacity of 1
fmt.Println(len(s), cap(s)) // Output: 0 1

s = append(s, 10) // Fits within current capacity (1)
fmt.Println(len(s), cap(s)) // Output: 1 1

s = append(s, 20) // Exceeds capacity → reallocates (new capacity: 2)
fmt.Println(len(s), cap(s)) // Output: 2 2

s = append(s, 30) // Exceeds capacity again → reallocates (new capacity: 4)
fmt.Println(len(s), cap(s)) // Output: 3 4
```

- When `append` is called, if the slice exceeds its current capacity, a new array is allocated with double the previous capacity.
- This reduces the number of reallocations when appending elements, optimizing performance.

## Creating a Slice with an Initial Length

You can also specify the length when initializing a slice:

```go
s1 := make([]int, 0, 1) // Length 0, Capacity 1
s2 := make([]int, 1, 1) // Length 1, Capacity 1

fmt.Println(s1) // Output: []
fmt.Println(s2) // Output: [0]
```

### Effect of Initializing a Slice with a Non-Zero Length

If you specify a non-zero length, the slice will be pre-filled with zero values.
This affects how append operations work:

```go
s1 = append(s1, 1) 
s2 = append(s2, 1) 

fmt.Println(s1, cap(s1)) // Output: [1] 1
fmt.Println(s2, cap(s2)) // Output: [0,1] 2
```

### Why Does s2 Expand Its Capacity?

- s2 was initialized with a length of 1, so it already contains a zero ([0]).
- When appending a new element (1), it exceeds the initial capacity of 1, causing Go to double the capacity to 2.
- On the other hand, s1 starts with length 0, so appending a single element does not exceed its initial capacity.
