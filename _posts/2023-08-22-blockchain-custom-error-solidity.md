---
layout: post
author: wonjoon
title:  "Custom Errors in Solidity: A Gas-Efficient Alternative" 
description: By adopting custom errors, Solidity developers can write more efficient and scalable smart contracts, saving gas and improving contract execution..
# date:   2023-08-22 15:00:00 +0900
categories: ethereum
# tags: [ethereum, solidity, smartcontract]
keywords: blockchain, ethereum, smartcontract, solidity
comments: true
---

## Table of Contents

- [Custom Error](#custom-error)
- [How to Use Custom Errors in Solidity](#how-to-use-custom-errors-in-solidity)
- [How Much Gas is Saved?](#how-much-gas-is-saved)
- [Comparing Yul Code: Custom Errors vs. String Errors](#comparing-yul-code-custom-errors-vs-string-errors)
- [Decoding Custom Errors with ethers.js](#decoding-custom-errors-with-ethersjs)
- [Caution: external call & Custom Errors](#caution-external-call--custom-errors)
- [Conclusion](#conclusion)

## Custom Error

[Solidity v0.8.4](https://github.com/ethereum/solidity/releases/tag/v0.8.4) introduced custom errors, a new way to handle errors in smart contracts. Instead of using string-based revert messages, developers can now define error variables and use them efficiently.

### Why Use Custom Errors?

- Lower gas costs compared to traditional string-based errors.
- Reusability in external interfaces or libraries.
- Easier error management across multiple smart contracts.

Comparison: String-Based vs. Custom Errors

```solidity
// Before (Traditional Revert)
revert("Insufficient funds."); // No predefined error

// After (Custom Error)
error Unauthorized();   // Declare the error
revert Unauthorized();  // Use the error
```

## How to Use Custom Errors in Solidity

### 1. Using revert with Custom Errors

Custom errors function similar to Solidity’s event mechanism, but must be used with the revert statement.

```solidity
// Example: Custom Error for Unauthorized Access
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

error Unauthorized(); // Custom error

contract VendingMachine {
    address payable owner = payable(msg.sender);

    function withdraw() public {
        if (msg.sender != owner)
            revert Unauthorized();  // Using custom error with revert statement

        owner.transfer(address(this).balance);
    }
}
```

- `revert` halts execution and returns the error.
- As of Solidity v0.8.4, `require` does not support custom errors ([Issue in github](https://github.com/ethereum/solidity/issues/11278)).

Equivalent Code Transformation between `revert` and `require`:

```solidity
// Traditional require statement:
require(condition, "error message");

// Translates to:
if (!condition) revert CustomError();
```

### 2. Custom Errors with Parameters

Custom errors can accept parameters, allowing developers to pass relevant data.

```solidity
// Example: Custom Error with Parameters
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/// Error: Insufficient balance for transfer.
/// @param available balance available.
/// @param required requested amount to transfer.
error InsufficientBalance(uint256 available, uint256 required);

contract TestToken {
    mapping(address => uint256) balance;

    function transfer(address to, uint256 amount) public {
        if (amount > balance[msg.sender])
            revert InsufficientBalance({
                available: balance[msg.sender],
                required: amount
            });

        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
}
```

- The error is ABI-encoded: `abi.encodeWithSignature("InsufficientBalance(uint256,uint256)", balance[msg.sender], amount)`.
- Helps return specific error information to external applications.

## How Much Gas is Saved?

Using [truffle-contract-size](https://github.com/IoBuilders/truffle-contract-size), we compared contract sizes with and without custom errors.

```solidity
// Example: Vending Machine Contract
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

error Unauthorized(); // Custom error

contract VendingMachine {
    address payable owner = payable(msg.sender);

    function withdraw() public {
        if (msg.sender != owner)
            revert Unauthorized();  // With custom error
            revert("Insufficient funds."); // Without custom error

        owner.transfer(address(this).balance);
    }
}
```

Contract Size Results:

|Method|Contract Size|
|---|---|
|With Custom Errors|0.33 KiB|
|Without Custom Errors|0.46 KiB|

Even for simple errors, custom errors reduce contract size by ~0.13 KiB.
For larger smart contracts, the savings are even more significant.

## Comparing Yul Code: Custom Errors vs. String Errors

[Yul](https://docs.soliditylang.org/en/latest/yul.html) is an intermediate representation for Solidity bytecode.

### 1. Custom Error: revert Unauthorized()

```sh
# revert Unauthorized();
let free_mem_ptr := mload(64)
mstore(free_mem_ptr, 0x82b4290000000000000000000000000000000000000000000000000000000000)
revert(free_mem_ptr, 4)
```

- 0x82b42900: Custom error selector.
- Minimal gas cost due to compact encoding.

### 2. String-Based Error: revert("Unauthorized")

```sh
# Example: Decoding InsufficientBalance Error
# revert("Unauthorized");
let free_mem_ptr := mload(64)
mstore(free_mem_ptr, 0x08c379a000000000000000000000000000000000000000000000000000000000)
mstore(add(free_mem_ptr, 4), 32)
mstore(add(free_mem_ptr, 36), 12)
mstore(add(free_mem_ptr, 68), "Unauthorized")
revert(free_mem_ptr, 100)
```

- 0x08c379a0: String error selector.
- More storage operations, higher gas consumption.
- Longer execution time compared to custom errors.

## Decoding Custom Errors with ethers.js

Custom errors can be decoded in ethers.js to retrieve detailed error information.

```javascript
import { ethers } from 'ethers';

// Define an interface to match the custom error
const abi = [
  'function InsufficientBalance(uint256 available, uint256 required)',
];

const interface = new ethers.utils.Interface(abi);
const error_data =
  '0xcf479181000000000000000000000000000000000000' +
  '0000000000000000000000000100000000000000000000' +
  '0000000000000000000000000000000000000100000000';

const decoded = interface.decodeFunctionData(
  interface.functions['InsufficientBalance(uint256,uint256)'],
  error_data
);

console.log(
  `Insufficient balance for transfer. ` +
  `Needed ${decoded.required.toString()} but only ` +
  `${decoded.available.toString()} available.`
);
// Output: Insufficient balance for transfer. Needed 4294967296 but only 256 available.
```

- ethers.js can decode ABI-encoded errors for better debugging.
- Error parameters are extracted and converted into human-readable messages.

## Caution: external call & Custom Errors

### Smart Contract Compilation & External Calls

When compiling a contract:

- The Solidity compiler includes all defined custom errors in the contract’s ABI.
- However, external calls do not include errors from other contracts.

### Security Concern: Manipulated Error Messages

- Malicious contracts can fake errors by crafting misleading return messages.
- Developers must verify whether the error originates internally or externally.
- Use [NatSpec](https://docs.soliditylang.org/en/latest/natspec-format.html) documentation to provide clear explanations for custom errors.

## Conclusion

Why Use Custom Errors:

- Lower Gas Costs – Reduces contract size & execution gas.
- Improved Debugging – Encodes detailed error information.
- Better Maintainability – Centralized error management across contracts.
- Efficient ABI Encoding – Works seamlessly with Solidity tooling & ethers.js.

When Should You Use Custom Errors:

- Large contracts with complex logic.
- Contracts where gas efficiency is critical.
- Reusable libraries and interfaces.
