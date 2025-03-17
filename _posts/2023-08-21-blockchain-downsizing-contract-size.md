---
layout: post
author: wonjoon
title:  "How to Reduce Smart Contract Size" 
description: Introduce post from ethereum official blog about how to reduce smart contract size by serveral ways.
# date:   2023-08-21 15:00:00 +0900
categories: ethereum
# tags: [ethereum, solidity, smartcontract]
keywords: blockchain, ethereum, smartcontract, solidity
comments: true
---

## Table of Contents

- [Summary](#summary)
- [EIP-170: Ethereum Smart Contract Size Limit](#eip-170-ethereum-smart-contract-size-limit)
- [Quadratic Vulnerability](#quadratic-vulnerability)
- [How to Check Smart Contract Size](#how-to-check-smart-contract-size)
- [How to Reduce Smart Contract Size](#how-to-reduce-smart-contract-size)

## Summary

EIP-170 introduced a size limit for smart contracts to prevent network congestion and DoS attacks.

To optimize smart contract size, developers should:

- Modularize contracts (split large contracts).
- Use libraries to offload reusable logic.
- Apply custom errors and shorter messages.
- Optimize Solidity compiler settings.
- Reduce function count and variable declarations.

## EIP-170: Ethereum Smart Contract Size Limit

[EIP-170](https://eips.ethereum.org/EIPS/eip-170) was introduced during the Spurious Dragon hard fork on November 22, 2016, to protect the Ethereum network from Denial of Service (DoS) attacks. This proposal limits the size of smart contracts to 24,576 bytes (24.576 KB).

### EIP-170 Implementation

```text
If block.number >= FORK_BLKNUM, then if contract creation initialization returns data with length of more than MAX_CODE_SIZE bytes, contract creation fails with an out of gas error.

- MAX_CODE_SIZE: 0x6000 (2**14 + 2**13)
- FORK_BLKNUM: 2,675,000
- CHAIN_ID: 1 (Mainnet)
```

## Quadratic Vulnerability

Ethereum transactions consume gas in two main ways:

### Pre-processing a smart contract

- Before execution, the Ethereum Virtual Machine (EVM) loads and processes the contract code (O(n) complexity).

### Merkle Proof Validation

- The blockchain validates transactions using Merkle proofs, requiring additional computation (O(n) complexity).

A Quadratic Vulnerability arises when a contract’s size significantly impacts execution performance. Even simple functions can become expensive and slow if the contract size is too large.

## How to Check Smart Contract Size

Smart contracts are compiled into bytecode, which determines their final size.

A common tool for checking smart contract sizes is [truffle-contract-size](https://github.com/IoBuilders/truffle-contract-size).

## How to Reduce Smart Contract Size

[The Ethereum Developer Guide](https://ethereum.org/en/developers/tutorials/downsizing-contracts-to-fight-the-contract-size-limit/) outlines three key strategies to optimize smart contract size.

- Step 1 (Big Impact): Major optimizations.
- Step 2 (Medium Impact): Code refactoring and simplifications.
- Step 3 (Small Impact): Minor optimizations.

### 1. Big Impact: Major Contract Optimizations

#### 1.1. Split Large Contracts

Breaking down smart contracts into smaller, modular components improves:

- Readability
- Maintainability
- Performance

Best Practices for Contract Separation

- Group related functions together.
- Separate functions that don't modify state.
- Decouple storage-heavy operations.

#### 1.2. Use Libraries

Libraries allow reusable code without increasing contract size.

Important Notes:

- Libraries cannot have internal functions (they must be external or public).
- Use Solidity’s using for keyword to apply libraries efficiently.

```solidity
pragma solidity >=0.6.0 <0.7.0;

struct Data { mapping(uint => bool) flags; }

library Set {
    function insert(Data storage self, uint value) public returns (bool) {
        if (self.flags[value]) return false; // Already exists
        self.flags[value] = true;
        return true;
    }
}

contract C {
    using Set for Data;
    Data knownValues;

    function register(uint value) public {
        require(knownValues.insert(value));
    }
}
```

#### 1.3. Implement Proxies

Proxies use delegatecall to execute logic from another contract, keeping the main contract lightweight.

- Common in upgradable smart contracts ([Guide](https://hackernoon.com/how-to-make-smart-contracts-upgradable-2612e771d5a2)).
- Increases complexity, so use only if absolutely necessary.

### 2. Medium Impact: Code Refactoring

#### 2.1. Reduce the Number of Functions

- External Functions: Minimize view functions unless necessary.
- Internal Functions: Inline single-use functions instead of defining them separately.

#### 2.2. Reuse Variables

Before Optimization:

```solidity
function get(uint id) returns (address, address) {
    MyStruct memory myStruct = myStructs[id];
    return (myStruct.addr1, myStruct.addr2);
}
```

After Optimization:

```solidity
function get(uint id) returns (address, address) {
    return (myStructs[id].addr1, myStructs[id].addr2);
}
```

This reduces contract size by 0.28 KB.

#### 2.3. Use Shorter Error Messages

Error messages contribute to contract size. Use error codes instead of full descriptions.

Before Optimization:

```solidity
require(msg.sender == owner, "Only the owner can call this function");
```

After Optimization:

```solidity
require(msg.sender == owner, "OW1");
```

#### 2.4. Use Custom Errors

[Solidity 0.8.4](https://soliditylang.org/blog/2021/04/21/custom-errors/) introduced custom errors, which reduce contract size by encoding errors efficiently.

```solidity
error Unauthorized();

if (msg.sender != owner) {
    revert Unauthorized();
}
```

#### 2.5. Adjust Solidity Optimizer Settings

Solidity’s optimizer reduces bytecode size based on call frequency. If a contract is rarely called, use low optimizer settings.

- Default value: 200
- Deployment Optimization: Set to 1 (reduces bytecode size but increases gas cost).
- Runtime Optimization: Set to a higher value to optimize gas usage.

### 3. Small Impact: Minor Optimizations

#### 3.1. Avoid Passing Structs as Parameters

Using structs as function parameters increases contract size. In this example, we can save ~0.1 KB by passing primitive variables instead of structs.

Before Optimization (Structs):

```solidity
function get(uint id) returns (address, address) {
    return _get(myStruct);
}

function _get(MyStruct memory myStruct) private view returns (address, address) {
    return (myStruct.addr1, myStruct.addr2);
}
```

After Optimization (Primitive Variables):

```solidity
function get(uint id) returns (address, address) {
    return _get(myStructs[id].addr1, myStructs[id].addr2);
}

function _get(address addr1, address addr2) private view returns (address, address) {
    return (addr1, addr2);
}
```

#### 3.2. Use Correct Visibility Modifiers

Optimize function visibility:

- Use public if the function is externally called.
- Use private/internal if it is only used within the contract.

#### 3.3. Remove Modifiers

Modifiers increase contract size. Use functions instead.

Before Optimization (Using Modifier):

```solidity
modifier checkStuff() {}
function doSomething() checkStuff {}
```

After Optimization (Using Functions):

```solidity
function checkStuff() private {}
function doSomething() { checkStuff(); }
```
