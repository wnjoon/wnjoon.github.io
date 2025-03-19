---
layout: post
title:  "Understanding Channel Iteration in Go: for range vs. select vs. switch"
description: "In Go, channels are commonly used for communication between goroutines. This post explores different ways to read from channels and handle incoming values efficiently."
categories: go
# tags: [ethereum, solidity, smartcontract]
keywords: go, channel, iteration
comments: true
---

## Table of Contents

- [Code Example: Donation Goal Tracker](#code-example-donation-goal-tracker)
- [Using for range to Read from a Channel](#using-for-range-to-read-from-a-channel)
- [Using select to Listen for Channel Data](#using-select-to-listen-for-channel-data)
- [Comparison Table: `for range` vs. `select` vs. `switch`](#comparison-table-for-range-vs-select-vs-switch)
- [Conclusion](#conclusion)

## Code Example: Donation Goal Tracker

Below is a Go program that tracks donations using channels. Two goroutines (`f(10)` and `f(15)`) listen for updates on the donation balance, and another goroutine increments the balance every second.

```go
package main

import (
    "fmt"
    "time"
)

type Donation struct {
    balance int
    ch      chan int
}

func main() {
    donation := &Donation{ch: make(chan int)}

    // Listener Goroutine (Checks if goal amount is reached)
    f := func(goal int) {
        for balance := range donation.ch {
            if balance >= goal {
                fmt.Printf("%d goal reached\n", balance)
                return
            }
        }
    }

    go f(10)
    go f(15)

    // Updater Goroutine (Increases balance)
    go func() {
        for {
            time.Sleep(time.Second)
            donation.balance++
            donation.ch <- donation.balance
        }
    }()

    time.Sleep(25 * time.Second) // Keep the program running
}
```

## Using for range to Read from a Channel

This is same as the previous example, but written in a more concise way.

```go
for balance := range donation.ch {
    if balance >= goal {
        fmt.Printf("%d goal reached\n", balance)
        return
    }
}
```

### How for range Works

- `range donation.ch`: Iterates over incoming values from the channel.
- Each time a new value is sent to `donation.ch`, it is immediately read and assigned to `balance`.
- The loop continues waiting for new values until the channel is closed.

### Key Characteristics of for range

- Automatically waits for new values.
- Stops when the channel is closed.
- Simple and efficient for single-channel reading.

## Using select to Listen for Channel Data

```go
f := func(goal int) {
    for {
        select {
        case balance := <-donation.ch: // Process incoming value
            if balance >= goal {
                fmt.Printf("%d goal reached\n", balance)
                return
            }
        }
    }
}
```

### How select Works

- `case balance := <-donation.ch`: Reads from the channel only when data is available.
- Useful when monitoring multiple channels simultaneously.
- Requires an explicit return or break to exit the loop.

### Key Characteristics of select

- Can handle multiple channels.
- Only executes when a channel has data.
- Requires an explicit exit condition.

## Why switch is Not Used

A switch statement is not suitable for continuously reading from a channel.

```go
for {
    balance := <-donation.ch
    switch {
    case balance >= goal:
        fmt.Printf("%d goal reached\n", balance)
        return
    default:
    }
}
```

### Problems with Using switch

- `balance := <-donation.ch`: Directly blocks waiting for a value (inefficient).
- `default`: Executes unconditionally when no case matches, which prevents proper subscription behavior.

### Key Characteristics of switch

- Cannot wait for channel updates.
- Inefficient because it forces direct value retrieval.
- `default` runs even when there’s no new data.

## Comparison Table: for range vs. select vs. switch

| **Method** | **How It Works** | **Can Monitor Channels?** | **Exit Condition** |
| --- | --- | --- | --- |
| `for range` | Iterates when new values arrive | Yes | Automatically stops when the channel is closed |
| `select` | Handles multiple channels | Yes | Requires explicit break or return |
| `switch` | Simple conditional statement | No | Must manually read values |

## Conclusion

- Use `for range` when working with a single channel that continuously receives values.
- Use `select` when handling multiple channels or managing timeouts.
- Avoid `switch` for channel reading, as it lacks proper subscription behavior.
