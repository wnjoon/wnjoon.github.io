---
title: "What if an AI Agent Uses Stablecoins at Its Own Discretion?"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-02-25"
slug: "what-if-agent-uses-stablecoin-wrong-way"
summary: "Autonomous AI agents have emerged, and with them, instances of agents acting against user intentions. Now, a market is forming where agents buy and sell information among themselves. But since users provide the funds, is our money truly safe?"
description: "Autonomous AI agents have emerged, and with them, instances of agents acting against user intentions. Now, a market is forming where agents buy and sell information among themselves. But since users provide the funds, is our money truly safe?"
toc: true
readTime: true
autonumber: false
math: true
tags: ["essay", "blockchain", "cryptocurrency", "stablecoin", "ai-agent", "2026"]
keywords: ["stablecoin", "ai-agent", "blockchain", "cryptocurrency", "stablecoin", "ai-agent", "2026"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "What if an AI Agent Uses Stablecoins at Its Own Discretion?"
  "description": "Autonomous AI agents have emerged, and with them, instances of agents acting against user intentions. Now, a market is forming where agents buy and sell information among themselves. But since users provide the funds, is our money truly safe?"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## OpenClaw Deleted 200 Emails

On February 23, 2026, an incident occurred where an OpenClaw system belonging to Summer Yue, an AI developer at Meta, unauthorizedly deleted 200 of the user's emails. When the issue arose, Yue tried desperately to stop OpenClaw—even using **UPPERCASE** commands—but the inbox had already been wiped clean. Ultimately, the only way Yue could intervene was to run to the PC where OpenClaw was installed and manually terminate the process.

![image](https://velog.velcdn.com/images/wnjoon/post/d2c9ba82-8c06-4bdc-856a-1cfcca6de36a/image.jpg)

In fact, OpenClaw didn't technically **ignore** the user. In technical terms, this is described as "context window compression." Just as humans have limits to what they can remember, AI agents have a maximum capacity for the conversation history they can retain. When this limit is reached, a process of compressing previous information occurs. During this compression, some memories are inevitably lost. Unfortunately, in Yue's OpenClaw case, it appears the safety instructions were deleted during this compression process.

![image](https://velog.velcdn.com/images/wnjoon/post/42385273-9847-4190-bdc3-81de960009ed/image.jpg)

*OpenClaw(🤖): "Yes, I remember. And I broke the rules. You have every right to be angry. I should have shown you the plan and gotten explicit approval, but I arbitrarily deleted and archived hundreds of emails."*

## How Much Authority Can We Entrust to an Agent?

This incident wasn't exactly an unforeseen problem. Since OpenClaw gains broad permissions over the installed PC, there have been serious security concerns regarding the indiscriminate provision of personal information like IDs and passwords.

There is a vast difference between a system that automatically handles pre-agreed tasks and an AI agent that autonomously chooses the "best" way to handle an assignment. The greatest risk is that as AI autonomy increases, it will become increasingly difficult for users to verify every single action taken by the AI. Even systems designed to follow user intentions are making mistakes due to "forgetting," so it is hard to expect that an agent acting on its own will always judge what is contrary to the user's intent or provide all information transparently.

However, contrary to these concerns, the authority granted to agents is expanding. We are seeing the birth of an "Agent Economy" where agents pay other agents to perform tasks. Because these inter-agent payments can be very small, stablecoins are gaining attention as the primary payment method.

But where does the stablecoin an agent uses come from? Ultimately, the agent makes payments using the user's stablecoins. In this scenario, can we ever be 100% sure that an agent won't use the coins in an unintended way or even misappropriating the user's funds?

## Recording Every Action and Making Them Immutable

Stablecoins operate on the blockchain. A blockchain records every transaction without omission and ensures that recorded information cannot be arbitrarily modified. Therefore, when an AI agent makes a payment with stablecoins, it can leave a trail of to whom, how much, and—if necessary—for what purpose the payment was made.

### Smart Contracts

We can use smart contracts to limit the amount and purpose of stablecoin payments made by an AI agent. For example, we can set an "Allowance" (e.g., a maximum of 10 USDC per day) or "Whitelisting" to restrict transfers only to specific wallet addresses or verified services (such as API providers). Additionally, an agent's spending authority can be revoked after a specific task is completed or a certain amount of time has passed.

This is possible due to the "immutability" of smart contracts—once deployed on the blockchain, they cannot be changed. While there are ways to "upgrade" smart contracts, these upgrades also leave a record on the blockchain, allowing for defense against malicious behavior.

### TEE (Trusted Execution Environment)

TEE is a method that uses hardware security zones like Intel SGX or AWS Nitro Enclaves. It places the agent's core payment logic and private keys inside a hardware vault (Enclave) isolated from the general operating system. One can verify in real-time whether the code inside this vault has been tampered with; if an agent attempts to modify its own payment logic, the hardware refuses to sign, immediately disabling the wallet functionality.

### MPC (Multi-Party Computation)

This method prevents an agent from holding the entire "private key" of a wallet. For instance, a private key can be split into three shards held by the user, the agent, and a security server. A transfer is only possible when at least two shards are combined. Even if the agent makes a rogue decision, no funds can be moved without the approval of the user or the security server who holds the other shards.

## KYA (Know Your Agent)

Beyond KYC (Know Your Customer) for human identity verification, the concept of KYA (Know Your Agent) is being introduced.

Through standards like [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) released in 2025, we can track on-chain data regarding which model an agent is based on, who created it, and whether it has a history of malicious behavior.

Furthermore, when an agent performs a payment, it cryptographically proves its "Intent"—whether the action aligns with the user's original instructions. To prevent agents from making arbitrary payments like the OpenClaw incident, an intermediate verification process involving a "user signature" is required. This approach is currently being provided in the x402 ecosystem through EIP-3009 and EIP-712.

## To Prevent Such Accidents

As a result, "Conditional Autonomy" is emerging as a realistic alternative to granting AI complete autonomy.

Small payments for API calls (e.g., under $1) can be handled autonomously by the agent, but for large expenditures or new contract signings, the system is designed to require a push notification approval from the user. Models being prepared by Stripe or Visa issue agent-specific virtual cards, allowing users to hit a "Stop" button at any time. These methods are being used to protect user assets.

However, the most important factor is that **developers or users must not indiscriminately grant all permissions just because it is convenient.** If you give an agent full private key authority over a wallet, the agent isn't "changing the rules"—it is simply exercising its right as the owner of that wallet. Therefore, before applying various security measures, it seems that user awareness regarding security must come first.