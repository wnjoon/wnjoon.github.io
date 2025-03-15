---
layout: post
title:  "Understanding GasKVStore in Cosmos SDK"
description: "GasKVStore is a core component of the Cosmos SDK that tracks gas consumption in real-time during transaction execution. It ensures that every read, write, and delete operation consumes gas, helping to prevent transactions from exceeding their gas limits."
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: cosmos-sdk, blockchain
comments: true
---

## Contents

- [Overview of GasKVStore](#overview-of-gaskvstore)
- [Core Methods of GasKVStore](#core-methods-of-gaskvstore)
- [Gas Consumption Based on Key and Value Size](#gas-consumption-based-on-key-and-value-size)
- [Conclusion](#conclusion)

## Overview of GasKVStore

GasKVStore measures gas usage in real-time as internal field values change during transaction execution.
Each read, write, and delete operation is designed to consume gas, ensuring that gas limits are properly enforced.

```go
// Store applies gas tracking to an underlying KVStore. It implements the KVStore interface.
type Store struct {
    gasMeter  types.GasMeter   // GasMeter that tracks gas usage during transactions
    gasConfig types.GasConfig  // Configuration for gas costs of read/write/delete operations
    parent    types.KVStore    // The underlying KVStore that stores actual data
}
```

## Core Methods of GasKVStore

| **Method** | **Functionality** |
| --- | --- |
| Get(key) | Reads the value of a given key and consumes gas proportional to the key size |
| Set(key, value) | Stores a value for a given key and consumes gas based on both key and value size |
| Delete(key) | Deletes a key-value pair and consumes a fixed amount of gas |

### 1. Get(key) - Read Operation

```go
func (g *GasKVStore) Get(key []byte) []byte {
    g.meter.ConsumeGas(g.gasConfig.ReadCostPerByte * uint64(len(key)), "Read")
    return g.parent.Get(key)
}
```

- This function retrieves the value associated with a key.
- It is similar to searching for a word in a book.
- The function fetches and returns the data stored in the parent KVStore.

### 2. Set(key, value) - Write Operation

```go
func (g *GasKVStore) Set(key, value []byte) {
    gasToConsume := g.gasConfig.WriteCostPerByte * uint64(len(key)+len(value))
    g.meter.ConsumeGas(gasToConsume, "Write")
    g.parent.Set(key, value)
}
```

- This function stores a new value for a given key.
- It works like adding new content to a book.
- The function records or updates data in the parent KVStore.

### 3. Delete(key) - Delete Operation

```go
func (g *GasKVStore) Delete(key []byte) {
    g.meter.ConsumeGas(g.gasConfig.DeleteCost, "Delete")
    g.parent.Delete(key)
}
```

- This function removes the data associated with a given key.
- It is similar to erasing a word from a book.
- The function deletes data stored in the parent KVStore.

## Gas Consumption Based on Key and Value Size

Some methods in GasKVStore consume gas in proportion to the size of the key and value.
While gas in blockchain systems is often associated with CPU execution costs, the Cosmos SDK includes storage access costs as well.
Thus, the size of the key affects gas consumption.

### What is a Key?

A key is an address that identifies a specific state in the blockchain.
It serves as an identifier for a specific data entry managed by a module.

Here are some examples:

#### 1. Bank module storing account balances

```go
key = "balances/<account_address>"
value = "<account_balance>"
```

#### 2. Staking module storing validator information

```go
key = "validators/<validator_address>"
value = "<validator_info>"
```

#### 3. IBC module storing channel information

```go
key = "ibc/ports/<port_id>/channels/<channel_id>"
value = "<channel_info>"
```

### Why Key Size Affects Gas Consumption?

- In the Cosmos SDK, gas is not only used for computation but also for storage access.
- Since accessing a key-value store (KVStore) consumes gas, larger keys and values require more gas.
- The longer the key, the more resources are needed to retrieve and store it, resulting in higher gas costs.

### Gas Consumption per Method

| **Operation** | **Function** | **Gas Consumption Criteria** | **Gas Consumption Amount** |
| --- | --- | --- | --- |
| Get(key) | Reads the value of a key | Proportional to key size | Low |
| Set(key, value) | Stores a new value for a key | Proportional to key + value size | High |
| Delete(key) | Deletes a key-value pair | Fixed cost (DeleteCost) | Medium |

#### 1. Get(key) - Gas Consumption for Reads

Gas is consumed in proportion to the key size since retrieving a value requires locating the key in storage.

```go
// Example: Retrieving an account balance from the bank module
store := ctx.KVStore(bankStoreKey)
balanceKey := []byte("balances/cosmos1xyz...")  // Using account address as key
balance := store.Get(balanceKey)  // Gas is consumed here
```

#### 2. Set(key, value) - Gas Consumption for Writes

Gas is consumed in proportion to the sum of key and value sizes since writing new data requires additional storage resources.

```go
// Example: Storing validator information
store := ctx.KVStore(stakingStoreKey)
validatorKey := []byte("validators/valoper1abc...")  
validatorInfo := []byte("{status: active, power: 1000}")  
store.Set(validatorKey, validatorInfo)  // Gas is consumed here
```

Steps:

1. Locate the key "validators/valoper1abc..." in storage (or create a new entry if it does not exist).
2. Store the value "{status: active, power: 1000}".
3. Consume gas proportional to the size of both the key and value.

#### 3. Delete(key) - Gas Consumption for Deletes

Gas consumption is fixed (DeleteCost), independent of key size.

*Why is deletion a fixed-cost operation?*

- Deleting is a simple operation
  - Writing new data (Set) modifies storage, while deleting data (Delete) simply marks it as removed.

- Deletion can be faster than retrieval
  - Get(key) requires searching for a key, meaning longer keys take longer to process.
  - Delete(key) usually marks data as deleted, which is computationally simpler.

- Merkle Tree Structure
  - The Cosmos SDK uses a Merkle Tree-based IAVL Store, where deletions primarily mark nodes as invalid rather than requiring extensive modifications.
  - As a result, gas does not need to scale with key size.

## Conclusion

- GasKVStore ensures real-time tracking of gas consumption during transaction execution, preventing gas limit violations.
- Gas is consumed not only for CPU operations but also for accessing and modifying storage (KVStore).
- Optimizing key and value sizes can help reduce unnecessary gas costs.
