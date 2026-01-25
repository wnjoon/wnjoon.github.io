---
title: "Understanding Reentrancy Attacks in Smart Contracts"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2022-10-26"
slug: "understanding-reentrancy-attacks-in-smartcontract"
summary: "Let's understanding reentrancy attacks in smart contracts, and how to prevent them."
description: "A reentrancy attack occurs when an external malicious contract repeatedly calls a vulnerable contract’s function before the previous execution is completed."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "blockchain", "ethereum", "solidity", "smart contract", "2022"]
keywords: ["blockchain", "ethereum", "smart contract", "solidity"]
showTags: true
hideBackToTop: false
aliases:
  - /2022/10/26/blockchain-eth-reentrancy/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Understanding Reentrancy Attacks in Smart Contracts"
  "description": "A reentrancy attack occurs when an external malicious contract repeatedly calls a vulnerable contract’s function before the previous execution is completed."
  "keywords": "blockchain, ethereum, smart contract, solidity"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Reentrancy Attack

A reentrancy attack occurs when a malicious external contract calls a vulnerable contract’s function recursively before the previous execution is completed.

To understand this attack in the context of Ethereum and smart contracts, let’s go through some key properties:

- Ethereum allows transferring Ether between user addresses.
- Smart contracts in Ethereum can call external contracts and interact with their functions.
- If a contract sends Ether to an unknown address or calls a nonexistent function in another contract, a `fallback` function can execute alternative code.

A reentrancy attack happens when a contract sends Ether to an external malicious contract with a malicious `fallback` function that recursively calls the vulnerable contract before it updates its state.

A `fallback` function is a function without a name in Solidity. It gets triggered when a contract receives Ether or when a nonexistent function is called.

One of the most famous reentrancy attacks was "The DAO Hack". In this attack, the attacker exploited a vulnerable contract holding over $150 million in Ether. This attack led to the Ethereum hard fork, splitting the network into Ethereum (ETH) and Ethereum Classic (ETC).

## Example: Reentrancy Attack on a Bank Contract

### Smart Contracts Setup

We have two contracts:

- Bank Contract: Holds and allows withdrawals of Ether.
- Attack Contract: Exploits the Bank contract’s vulnerability.

```solidity
// Vulnerable Bank Contract
contract Bank {
    mapping(address -> uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount);

        require(msg.sender.call.value(_amount)());
        balances[msg.sender] -= _amount;
    }
}
```

```solidity
// Malicious Attack Contract
contract Attack {
    Bank public bank;

    constructor(address _bankAddress) {
        bank = Bank(_bankAddress);
    }

    function attackBank() public payable {
        bank.deposit.value(1 ether)();
        bank.withdraw(1 ether);
    }

    function () payable {
        if (bank.balance > 1 ether) {
            bank.withdraw(1 ether);
        }
    }
}
```

### Attack Scenario: How the Exploit Works

The attacker withdraws almost all Ether from the Bank contract in a single transaction. Assume the Bank contract already has sufficient Ether.

![attach scenario](https://velog.velcdn.com/images/wnjoon/post/6502c25e-0cd0-4d45-89f8-a8e6cbfce390/image.PNG)

Step-by-Step Attack Process:

1. The attacker calls `attackBank()` from the Attack contract.
2. `attackBank()` deposits 1 Ether into the Bank contract.
3. `attackBank()` then calls `withdraw(1 ether)`, triggering the Bank contract’s withdrawal function.
4. The Bank contract sends 1 Ether to the Attack contract.
5. The Attack contract’s fallback function gets triggered before the Bank contract updates the balance.
6. The fallback function recursively calls `withdraw(1 ether)` before the previous call completes.
7. This loop continues until only 1 Ether remains in the Bank contract.

## How to Prevent Reentrancy Attacks?

There are three main strategies to mitigate reentrancy attacks.

### 1. Use transfer() Instead of call.value()

- Solidity’s `transfer()` function only allows 2300 gas for external calls.
- This prevents the `fallback` function from making further reentrant calls.

```solidity
msg.sender.transfer(_amount); // Safer alternative
```

### 2. Follow the Checks-Effects-Interactions Pattern

The [Checks-Effects-Interactions pattern](https://docs.soliditylang.org/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) ensures state variables are updated before making external calls.

**Vulnerable Code**

```solidity
function withdraw(uint256 _amount) public {
    require(balances[msg.sender] >= _amount);

    require(msg.sender.call.value(_amount)()); // External call before updating state
    balances[msg.sender] -= _amount;
}
```

**Fixed Code**

```solidity
function withdraw(uint256 _amount) public {
    require(balances[msg.sender] >= _amount);

    balances[msg.sender] -= _amount;  // Update state first
    msg.sender.transfer(_amount);  // External call after state update
}
```

### 3. Use a Mutex (Reentrancy Lock)

A mutex (boolean flag) prevents reentrant calls by locking the function until execution is complete.

**Improved Bank Contract with Reentrancy Protection**

```solidity
// Secure Bank Contract
contract Bank {
    bool mutex = false; // Mutex variable to prevent reentrancy
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(!mutex);  // Ensure no reentrancy
        require(balances[msg.sender] >= _amount);

        balances[msg.sender] -= _amount;
        mutex = true;  // Lock the contract

        msg.sender.transfer(_amount);

        mutex = false;  // Unlock after transfer
    }
}
```

## Summary: How to Defend Against Reentrancy Attacks

| Method | Description | Effectiveness |
| --- | --- | --- |
| Use transfer() instead of call.value() | Limits gas usage for external calls, preventing reentrancy | Highly effective |
| Checks-Effects-Interactions pattern | Updates state variables before external calls to prevent recursion | Strong protection |
| Mutex (Reentrancy Lock) | Uses a flag to prevent multiple executions | Effective but requires careful implementation |

## Conclusion

- Reentrancy attacks exploit the ability of external contracts to reenter a function before state updates occur.
- The DAO hack was a real-world example, causing Ethereum’s first hard fork.
- Three main defense strategies:
- Use `transfer()` instead of `call.value()` to limit gas usage.
- Apply the Checks-Effects-Interactions pattern to update state before making external calls.
- Implement mutex (reentrancy locks) to prevent multiple function executions.
