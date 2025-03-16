---
layout: post
title:  "Using sync.Cond for Goroutine Synchronization in Go"
description: "In Go, sync.Cond is a synchronization primitive that allows goroutines to efficiently wait until a certain condition is met. It helps coordinate multiple goroutines by providing a mechanism to wait (Wait()) and notify (Signal() or Broadcast()) when conditions change."
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: go, channel, mutex, sync, cond
comments: true
---

## Contents

- [What is `sync.Cond`?](#what-is-synccond)
- [How `sync.Cond` Works](#how-synccond-works)
- [Example: Donation Goal Tracker Using `sync.Cond`](#example-donation-goal-tracker-using-synccond)
- [Comparison: `Signal()` vs. `Broadcast()`](#comparison-signal-vs-broadcast)
- [Conclusion](#conclusion)

## What is sync.Cond?

- `sync.Cond` is a condition variable that helps synchronize multiple goroutines.
- It is typically used when one or more goroutines must wait until a shared resource reaches a specific state.
- One goroutine waits (`Wait()`) until a condition is satisfied, and another goroutine notifies (`Signal()` or `Broadcast()`) the waiting goroutines when the condition is met.

## How sync.Cond Works

| **Method** | **Description** |
| --- | --- |
| `Wait()` | Makes a goroutine wait until a condition is met (automatically unlocks the mutex) |
| `Signal()` | Wakes only one waiting goroutine (even if multiple goroutines are waiting) |
| `Broadcast()` | Wakes all waiting goroutines |

## Example: Donation Goal Tracker Using sync.Cond

The following example demonstrates how `sync.Cond` can be used to coordinate multiple goroutines that monitor a donation goal.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Donation struct {
    cond    *sync.Cond // Condition variable
    balance int
}

func main() {
    donation := &Donation{
        cond: sync.NewCond(&sync.Mutex{}), // Create a condition variable with a mutex
    }

    // Listener goroutine (checks if goal is reached)
    f := func(goal int) {
        donation.cond.L.Lock() // Acquire mutex lock
        for donation.balance < goal {
            donation.cond.Wait() // Wait until balance >= goal
        }
        fmt.Printf("%d goal reached\n", donation.balance)
        donation.cond.L.Unlock() // Release mutex lock
    }

    go f(10)
    go f(15)

    // Updater goroutine (increments balance)
    go func() {
        for {
            time.Sleep(time.Second)
            donation.cond.L.Lock()
            donation.balance++ // Increase balance
            donation.cond.L.Unlock()
            donation.cond.Broadcast() // Wake all waiting goroutines
        }
    }()

    time.Sleep(20 * time.Second) // Keep program running
}
```

### Step 1: Creating a sync.Cond Object

```go
type Donation struct {
    cond    *sync.Cond  
    balance int
}

donation := &Donation{
    cond: sync.NewCond(&sync.Mutex{}), 
}
```

- `cond`: A condition variable based on `sync.Mutex`.
- `sync.Cond` provides synchronization between multiple goroutines using `Wait()`, `Signal()`, and `Broadcast()`.

### Step 2: Listener Goroutine (`f(goal int)`)

```go
f := func(goal int) {
    donation.cond.L.Lock()  
    for donation.balance < goal {
        donation.cond.Wait() // Wait until condition is met
    }
    fmt.Printf("%d goal reached\n", donation.balance)
    donation.cond.L.Unlock() 
}
```

How It Works:

1. `donation.cond.L.Lock()`: Acquires mutex lock before checking `donation.balance`.
2. `for donation.balance < goal`: Checks if goal is reached.
3. `donation.cond.Wait()`:
   - Pauses execution until another goroutine calls `Signal()` or `Broadcast()`.
   - Automatically releases the mutex lock while waiting.
4. Once woken up, the goroutine resumes execution, prints the message, and releases the lock (`L.Unlock()`).

### Step 3: Updater Goroutine

```go
for {
    time.Sleep(time.Second)
    donation.cond.L.Lock()
    donation.balance++      
    donation.cond.L.Unlock()
    donation.cond.Broadcast()
}
```

How It Works:

1. Acquires the lock (`donation.cond.L.Lock()`).
2. Increments the balance every second (`donation.balance++`).
3. Releases the lock (`donation.cond.L.Unlock()`).
4. Calls `donation.cond.Broadcast()`:
   - Wakes up all waiting goroutines.
   - Each waiting goroutine checks if its goal is met and either continues waiting or exits.

### Overall Execution Flow

| **Step** | **Active Goroutine(s)** | **Balance** | **After Broadcast()** |
| --- | --- | --- | --- |
| 1 | f(10), f(15) (waiting) | 0 | Still waiting |
| 2 | Updater goroutine | 1 -> 9 | Still waiting |
| 3 | Updater goroutine | 10 | f(10) wakes up and exits |
| 4 | f(15) (still waiting) | 11 -> 14 | Still waiting |
| 5 | Updater goroutine | 15 | f(15) wakes up and exits |

Key Observations:

- Each time balance increases, `Broadcast()` wakes all waiting goroutines.
- If a goroutine’s goal is not met, it goes back to `Wait()`.
- If a goroutine’s goal is met, it exits after printing the result.
- Once all goals are reached, no goroutines are waiting, so `Broadcast()` no longer has any effect.

## Comparison: Signal() vs. Broadcast()

| **Method** | **Behavior** | **Use Case** |
| --- | --- | --- |
| `Wait()` | Makes a goroutine wait until a condition is met (automatically unlocks the mutex) | Used when waiting for a condition |
| `Signal()` | Wakes only one waiting goroutine (even if multiple goroutines are waiting) | Use when a single goroutine should proceed |
| `Broadcast()` | Wakes all waiting goroutines | Use when all goroutines should be notified |

When to Use `Signal()` vs. `Broadcast()`

- `Signal()`: Use when only one goroutine needs to proceed.
- `Broadcast()`: Use when all waiting goroutines should be notified (e.g., donation.balance updates).

## Conclusion

- `sync.Cond` helps synchronize multiple goroutines by allowing them to wait for a condition to be met.
- `Wait()` makes goroutines wait, while `Signal()` and `Broadcast()` notify them.
- Use `Broadcast()` when all waiting goroutines should proceed, and use `Signal()` when only one goroutine should continue.
- `sync.Cond` is useful for implementing event-based synchronization, such as resource availability or state changes.
