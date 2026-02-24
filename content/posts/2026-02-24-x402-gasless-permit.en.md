---
title: "How does x402 enable payments without gas fees?"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-02-24"
slug: "x402-gasless-permit"
summary: "The x402 client signs EIP-3009 standard data according to the EIP-712 format. Another name for EIP-3009 is TransferWithAuthorization. This enables gasless transfers within x402"
description: "The x402 client signs EIP-3009 standard data according to the EIP-712 format. Another name for EIP-3009 is TransferWithAuthorization. This enables gasless transfers within x402"
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "x402", "blockchain", "cryptocurrency", "ethereum", "open-source", "2026"]
keywords: ["x402", "ethereum", "gasless", "permit", "transfer", "authorization", "EIP-3009", "EIP-712", "Permit2"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "How does x402 enable payments without gas fees?"
  "description": "The x402 client signs EIP-3009 standard data according to the EIP-712 format. Another name for EIP-3009 is TransferWithAuthorization. This enables gasless transfers within x402"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## The Relationship Between EIP-712 and EIP-3009

To put the conclusion first, the x402 client signs EIP-3009 standard data formatted according to the EIP-712 standard.

- EIP-712: A standard for how to structure signing data so it can be clearly displayed in a wallet. (The box/frame)
- EIP-3009: A protocol defining what specific data should be included to transfer tokens without gas fees. (The contents)

## EIP-712

In the traditional `eth_sign` method, the data to be signed was shown only as a hexadecimal hash, making it difficult for users to know what they were signing.

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_sign",
  "params": [
    "0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", // Address
    "0xdeadbeaf"                                  // Message (hex-encoded)
  ]
}
```

EIP-712 improves upon this by allowing the signing of structured data (Typed Data), which in this case is called EIP-3009.

## EIP-3009

As the name **Transfer with Authorization** suggests, EIP-3009 is a standard that allows users to authorize token transfers through offline signatures without paying gas fees (network fees). USDC has adopted this standard, and it serves as a core infrastructure technology for payment protocols like x402.

### Problems to Solve

Traditionally, ERC-20 token transfers required two steps:

1. `Approve`: Granting permission for someone to take your tokens (Costs gas)
2. `TransferFrom`: The actual movement of tokens (Costs gas)

This method is cumbersome because it requires the user's wallet to hold native coins (like ETH) for gas and necessitates sending two separate transactions. EIP-3009 enables a method where you say, "I’ll give you this signed paper (Authorization), so you pay the gas and take the tokens."

While EIP-2612 previously allowed the use of `Permit`, it still often required a transaction process for approval. EIP-3009 allows for direct transfer using the signature, thereby reducing the number of transactions and saving gas costs. Naturally, it also reduces unnecessary network traffic.

One of the goals of x402 is to enable devices using the internet (like AI agents) to pay for themselves. It is difficult for AI agents to directly manage gas-fee coins like ETH. Instead, an AI can simply submit an EIP-3009 authorization, previously signed by a user, to a resource server. Since the server or facilitator pays the gas fee and completes the payment, the AI can receive paid data without interruption.

### Key Features

- **Gasless**: Users only need to sign. The actual transaction is sent by a server (or facilitator).
- **Single Transaction**: A single transfer (`TransferWithAuthorization`) is performed without the approve step.
- **Optimized for Micropayments**: Facilitates small payments since the gas burden can be handled by the server or processed in batches.
- **Validity Period**: The `validAfter` and `validBefore` fields allow control over when the signature is valid.

### Micropayments

One might wonder about the term "micropayments" here. In reality, gas fees do not change based on the payment amount. From the blockchain network's perspective, recording data costs the same, so the fee remains constant.

The "micropayments" mentioned in EIP-3009 refers to making the user's gas burden nearly zero by having a facilitator pay the gas fees. Instead of the user sending a transaction directly, they submit a signature to the server, and the facilitator pays the gas and sends the final transaction. Consequently, users who are freed from the gas burden can make very small payments without hesitation.

In this scenario, the entity operating the facilitator would incur losses by paying for everyone's gas. Facilitators solve this by batching numerous payment signatures received from various users into a single transaction.

Until recorded on-chain via batching, this payment data remains as offline signature data. But what happens if an invalid payment exists?

Until the batch is complete, the EIP-3009 signature delivered to the server is like a check that says, "If you present this to the bank (blockchain) later, you may withdraw money from my account." The server doesn't go to the bank immediately, but it can immediately verify offline whether the check is authentic (Signature Validity) and if there is a balance (Balance Check). If the verification passes, the server provides the resource (data, etc.) even before the actual money is deposited. (This is also called Optimistic UI/Execution).

Problems can arise before or during the batching process:

- **Insufficient Balance**: This occurs when there was a balance at the time of signing, but the user moved the funds elsewhere before the server processed the batch. The server monitors the user's balance in real-time; if it becomes insufficient, it immediately revokes access to the resource or blacklists the user. Furthermore, high-priority payments are processed immediately without waiting for a batch.

- **Double Spending**: This occurs when a user tries to pay multiple times with a single nonce or resends a used signature. The server records `used_nonces` in memory or Redis to reject duplicate signatures with a `402` error. On-chain, the smart contract itself does not allow the reuse of the same nonce, so even if a facilitator attempts to batch it, it will be rejected (`Revert`) by the blockchain.

In actual operations, this is approached from a Risk Management perspective. For low-value resources, the resource may be provided immediately after verifying the signature, regardless of final payment success. For high-value resources, the server might request the user to wait until the payment is confirmed on-chain, sending the transaction immediately instead of adding it to a batch.

### Data Structure

```typescript
const types = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },        // Sender
    { name: "to", type: "address" },          // Receiver
    { name: "value", type: "uint256" },       // Amount
    { name: "validAfter", type: "uint256" },  // Valid After
    { name: "validBefore", type: "uint256" }, // Valid Before
    { name: "nonce", type: "bytes32" }        // Nonce
  ]
};
```

### ValidAfter and ValidBefore

`ValidAfter` indicates the start time when the token transfer becomes valid, and `ValidBefore` indicates the expiration time. Setting `ValidAfter` to 0 makes the token valid immediately. Generally, `ValidBefore` is set to 60 seconds (1 minute) after `ValidAfter`. The longer the validity period, the higher the risk of signature theft.

### Nonce

Ethereum accounts (EOA) also have nonces. While EOA nonces increase sequentially, the nonces used in EIP-712 or EIP-3009 signatures use random values (Random Bytes).


| Category	| Ethereum Account Nonce (EOA Nonce) | x402/EIP-3009 Payment Nonce |
| --- | --- | --- |
| Purpose	| Ensuring transaction order & preventing duplication |	Preventing reuse of the same signature (Replay) |
| Mechanism	| Must increase sequentially (0, 1, 2...)	| Any value is fine as long as it hasn't been used |
| Manager	| Ethereum Network (Nodes)	| `usedNonces` map within the Smart Contract |
| Generation	| `last_nonce` + 1	| `crypto.randomBytes(32)` (Random) |

Why does EIP-712 use random values for nonces? It’s due to the nature of x402 payments, which can occur asynchronously offline.

- Concurrency Issues: If nonces had to be sequential (0, 1, 2...), an AI agent would have to check the next nonce on-chain or through a central server every time it requests payments from multiple resource servers simultaneously. This could cause a performance bottleneck.

- Collision Prevention: A 32-byte (256-bit) random value can have $2^{256}$ different values, which is approximately $10^{77}$. This is a massive number, comparable to the number of atoms in the universe. Therefore, a client can generate a random nonce and sign it instantly without asking a server or the blockchain.

Thus, the smart contract is designed to verify only whether a nonce has already been used. 

```solidity
// Smart Contract Example Code
mapping(address => mapping(bytes32 => bool)) public usedNonces;

function _useNonce(address authorizer, bytes32 nonce) internal {
    require(!usedNonces[authorizer][nonce], "NONCE_ALREADY_USED");
    usedNonces[authorizer][nonce] = true; // Record as used
}
```

Generally, the nonce is generated by the client. As mentioned above, the probability of a nonce collision is near zero, and since it is further validated by the facilitator or the contract, it does not pose a problem.

```go
// createEIP3009Payload(): go/mechanism/evm/exact/client/schema.go
// -> CreateNonce(): go/mechanism/evm/utils.go

// CreateNonce generates a random 32-byte nonce for EIP-3009
func CreateNonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}
	return "0x" + hex.EncodeToString(nonce), nil
}
```

### Permit2

Looking at the code, there is another protocol called `Permit2` alongside EIP-3009. These two protocols have different nonce formats.

```go
//go/mechanism/evm/utils.go

// CreateNonce generates a random 32-byte nonce for EIP-3009
func CreateNonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}
	return "0x" + hex.EncodeToString(nonce), nil
}

// CreatePermit2Nonce generates a random 256-bit nonce for Permit2.
// Permit2 uses uint256 nonces (not bytes32 like EIP-3009).
func CreatePermit2Nonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}
	// Convert to uint256 string representation
	nonceInt := new(big.Int).SetBytes(nonce)
	return nonceInt.String(), nil
}
```

Permit2 is a next-generation shared token approval protocol developed by Uniswap.

Previously, sending a separate approve transaction every time you used a new app (DEX, etc.) was not only tedious but also inefficient because gas fees were paid twice. Because of this inconvenience, many people opted for "infinite approval," which risked all assets in the wallet if an app was hacked.

With `Permit2`, a user performs an infinite approval only once for the `Permit2` contract. Afterwards, when using other apps (e.g., x402-supported services), they generate an EIP-712 signature instead of a gas-consuming transaction and deliver it to the app. The app submits the user's signature to `Permit2`, which verifies the signature and moves only the amount of tokens requested by the app.

So, why are the nonce formats different? It’s because each standard interprets the nonce differently.

**EIP-3009 (bytes32)**

- Designed primarily for signature-based transfers (Transfer with Authorization).
- Treats the nonce simply as 32-byte data to prevent duplication. Therefore, using a hexadecimal (0x...) string is standard.
- A gasless transfer standard supported natively by specific tokens (like USDC).

**Permit2 (uint256)**

- Manages more complex orders and expiration times within the Uniswap ecosystem and beyond.
- Manages nonces as numbers internally and sometimes uses bitmasking on the nonce values to process multiple orders in parallel. Thus, it is common to convert them to decimal numeric strings (`big.Int`).
- A management contract designed to grant gasless signature capabilities to all ERC-20 tokens.

x402 appears to have applied this structure to allow Permit2 users to access resource servers without gas fees as well.

## Summary

Ultimately, the reason x402 actively embraces EIP-3009 and Permit2 lies in the **abstraction of the payment experience**. Users do not need to worry about whether they have gas fees in their wallet or what their nonce number is. They simply need to sign through a trusted interface (EIP-712).

This gasless infrastructure will play a critical role, especially in the AI agent economy where humans cannot intervene in every step. Complex on-chain logic is handled silently in the background by facilitators and smart contracts, allowing users and service providers to focus solely on the "exchange of valuable resources." This appears to be the vision of a blockchain-based internet that x402 dreams of.