---
title: "Implementation of Multi-Party Matching Trade using Smart Contract"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2023-02-13"
slug: "implement-orderbook-by-smartcontract"
summary: "The advantages and disadvantages of implementing multi-party matching trades using smart contracts."
description: "Blockchain-based multi-party matching could provide secure & transparent unlisted stock trading. However, challenges in speed and efficiency need to be addressed before full adoption in financial markets."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "blockchain", "ethereum", "solidity", "smartcontract", "2023"]
keywords: ["blockchain", "ethereum", "smartcontract", "solidity", "securities"]
showTags: true
hideBackToTop: false
aliases:
  - /2023/02/13/blockchain-mc-trade-contract/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Implementation of Multi-Party Matching Trade using Smart Contract"
  "description": "Blockchain-based multi-party matching could provide secure & transparent unlisted stock trading. However, challenges in speed and efficiency need to be addressed before full adoption in financial markets."
  "keywords": "blockchain, ethereum, smartcontract, solidity, securities"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## What Are Unlisted Stocks?

Unlisted stocks are stocks that are not listed on public stock exchanges such as the KOSPI or KOSDAQ. This can occur due to companies not meeting listing requirements or choosing not to go public (IPO) despite eligibility (Source: Yuanta Securities).

How Unlisted Stocks Are Traded

In Korea, unlisted stocks are primarily traded through:

- Trading Platforms – Online services linking buyers and sellers.
- K-OTC (Korea Over-the-Counter Market) – A regulated OTC market for trading unlisted stocks.
- Community Boards – Informal forums where individuals post buy/sell offers.

## Trading Methods for Unlisted Stocks

### 1. One-to-One Negotiated Trade

- Buyer and seller negotiate directly on price and quantity.
- Commonly referred to as “bulletin board trading”, as buyers and sellers communicate through posts.

### 2. Multi-Party Matching Trade

- Sellers list stocks at a price, and buyers submit orders at a price.
- If buy and sell prices match, the trade is executed automatically.
- If prices do not match, buyers or sellers adjust their orders.
- This method is used in modern stock exchange systems.

## Multi-Party Matching Trades

- Trades execute when buy and sell prices match.
- If the buy order is less than or equal to available sell orders, the trade is fully executed.
- If the buy order exceeds available sell orders, remaining shares wait for new sell orders.

## Implementing Multi-Party Matching with Smart Contracts

### Can This Be Implemented?

Yes! The essential components required for matching trades:

- Stock Symbol: Identifies the asset being traded.
- Price: The price the user is willing to buy/sell at.
- Quantity: The number of shares being traded.

### The Need for Utility Tokens

If implemented on Ethereum or blockchain, an additional utility token (typically ERC-20) is required:

- Tokenized stock must be tradable 1:1 with a stable utility token.
- This enables decentralized and on-chain execution.

### Challenges and Considerations

**Maintaining Order in a Smart Contract**

- Solidity does not support LinkedLists.
- Mapping does not guarantee order.
- Custom list structures need to be implemented.

**Gas Cost and Execution Risks**

- Ethereum charges gas fees per line of execution.
- If gas limits are exceeded, the transaction fails.
- Pre-estimating gas costs is essential to prevent failures.
- Before executing a trade, check if gas limits are likely to halt execution.

## Advantages of Smart Contracts for Multi-Party Matching Trades

### 1. Security and Immutability

- Smart contracts are tamper-proof and cannot be modified once deployed.
- Reduces risk of fraudulent manipulation.

### 2. Transparency and Fairness

- All trade orders are publicly recorded on the blockchain.
- Ensures fair matching without manual intervention.

### 3. Consortium Blockchain for Regulatory Compliance

- Many financial regulations do not support public blockchains.
- Private (consortium) blockchains allow regulated institutions to control transaction rules.
- Example: Korea’s Financial Services Commission (FSC) favors consortium blockchains for tokenized securities.

## Challenges of Smart Contracts for Multi-Party Matching Trades

### 1. Speed (TPS)

- Traditional stock exchanges operate much faster than blockchain.
- Ethereum’s TPS (transactions per second) is limited.
- This makes real-time stock trading difficult on public blockchains.

### 2. Blockchain Confirmation Time

- Trades must be confirmed in a block before being finalized.
- Slower block times may delay trade settlements.

## Should Smart Contracts Be Used for Unlisted Stocks?

### When It Makes Sense

- Low-frequency trading markets (e.g., OTC, private equity)
- Markets where transparency is critical
- Decentralized trading platforms looking for security & automation

### When It’s Not Ideal

- High-frequency stock trading (due to blockchain speed limits)
- Markets requiring ultra-low latency (<1ms execution time)

## Conclusion

Can Smart Contracts Improve Unlisted Stock Trading?

- Yes, but with trade-offs.
- Security & Transparency: No manual intervention, no tampering.
- Trustless Execution: Eliminates middlemen.
- Regulatory Considerations: May need private blockchains for compliance.
- Performance Limitations: Blockchain speed & gas fees are constraints.
