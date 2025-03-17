---
layout: post
author: wonjoon
title:  "Importance of using interface while construct program and example of using go" 
description: By designing software around interfaces, we minimize dependencies, improve collaboration, and build scalable, maintainable systems.
categories: go
keywords: go, interface, design
comments: true
---

## Why Should We Design Applications Based on Interfaces?

Modern software applications are composed of multiple modules that interact with each other. To ensure scalability, maintainability, and flexibility, interface-based design is widely recommended.

Let’s take Netflix as an example. Netflix is not just a video streaming service; it includes user management, subscription payments, recommendations, advertising, and many other services. Each team within Netflix works on different components, often following their own schedules and priorities. Without a well-defined interface-based approach, collaboration and integration would become extremely complex.

The best way to address this challenge is to design and develop applications based on interfaces.

## How Interface-Based Design Improves the Development Process

Let’s assume we’re developing an app that enables users to purchase subscriptions.

Scenario

1. Team A is responsible for user management, and Team B is developing the payment system.
2. Team A needs to implement subscription purchases, which depend on Team B’s payment gateway (PG) integration.
3. Team B is busy with other tasks and cannot immediately implement the PG integration. However, Team A cannot wait indefinitely for them to complete it.
4. Team B provides an interface that defines the PG integration structure. Even though the actual implementation is not ready, the interface specifies what the final implementation will look like.
5. Team A develops a mock implementation based on the provided interface and proceeds with subscription feature development.
6. Once Team B completes the real PG integration, Team A replaces the mock implementation with the actual implementation.

By adopting interface-based design, modules remain decoupled and can be developed independently without waiting for other teams.

## Challenges of Interface-Based Design

Despite its benefits, interface-based design is challenging when business logic is not well-defined.

- Business requirements must be well-analyzed before development to determine what interfaces will be needed.
- Some Agile methodologies misinterpret speed as skipping planning. Fast development should not mean skipping clear business requirements and interface design.
- If Team A starts development without a clear understanding of what Team B will deliver, frequent changes to the interface can result in wasted effort.
- A well-defined interface can reduce development time, not increase it.

To prevent unnecessary changes, a clear interface design should be agreed upon before development begins.

## How Go Supports Interface-Based Design

Go encourages interface-based design and provides a simple yet powerful way to implement it.

Key Differences from Java and Other Languages

- No need for explicit interface declarations in implementing structs.
- No separate interface files are required.
- If a struct implements all the methods of an interface, it automatically satisfies that interface.

### Best Practices for Defining Interfaces in Go

- Use meaningful names ending in -er to describe the action performed.
- Example:
  - Printer: Prints output
  - Writer: Writes to a file

## Example: Designing an Ethereum Transaction Sender Interface

Let’s define an interface for sending signed Ethereum transactions.

```go
type Sender interface {
    SendTransaction(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error
}
```

### Transaction Sending Approaches

Ethereum transactions can be sent in two ways:

- Synchronous (Sync): Waits until the transaction is mined before returning a response.
- Asynchronous (Async): Sends the transaction without waiting for confirmation.

Since both approaches use the same parameters, we can define a single `Sender` interface.

### Using Dependency Injection for Flexibility

We create a `TxManager` struct that depends on a `Sender` interface rather than a specific implementation.

```go
type TxManager struct {
    sender Sender
}

// Injects an implementation of Sender into TxManager
func NewTxManager(sender Sender) *TxManager {
    return &TxManager{
        sender: sender,
    }
}
```

### Different Implementations of the Sender Interface

We now create two different implementations:

- SyncSender: Implements synchronous transactions.
- AsyncSender: Implements asynchronous transactions.
- Both implementations satisfy the `Sender` interface because they define the required method.

```go
// SyncSender
func (t *SyncSender) NewSyncSender() *SyncSender {}
func (t *SyncSender) SendTransaction(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error

// AsyncSender
func (t *AsyncSender) NewAsyncSender() *AsyncSender {}
func (t *AsyncSender) SendTransaction(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error
```

### Injecting the Implementations

We can now inject either `SyncSender` or `AsyncSender` into the TxManager dynamically.

```go
func main() {
    syncSender := NewSyncSender()
    asyncSender := NewAsyncSender()

    // Use synchronous transaction processing
    txm := NewTxManager(syncSender)

    // Use asynchronous transaction processing
    txm = NewTxManager(asyncSender)
}
```

## Advantages of Interface-Based Design

### Decouples Modules

- Teams can develop independently without waiting for other teams.
- Reduces dependencies between different components.

### Enables Dependency Injection

- Implementations can be easily replaced or modified without changing business logic.
- Useful for mock testing and swapping different implementations.

### Enhances Maintainability & Scalability

- Clear separation of concerns makes code easier to maintain.
- New features can be added without modifying existing components.

### Encourages Reusability

- The same interface can have multiple implementations, making it reusable across different scenarios.

## Conclusion

Why should we use interface-based design:

- Modularization – Develop and maintain different parts of a system independently.
- Flexibility – Swap implementations without changing business logic.
- Scalability – Extend and modify software without breaking existing functionality.
- Testing – Use mock implementations for unit tests.
