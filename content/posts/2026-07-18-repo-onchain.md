---
title: "Tokenization Study in Major Financial Markets - Repo"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-18"
slug: "Repo-onchain"
summary: "On-chain infrastructure matters in short-term funding markets because it can make the movement of securities and cash easier to verify, reflect both sides of the transaction in shared records, and reduce the time before collateral can be reused."
description: "On-chain infrastructure matters in short-term funding markets because it can make the movement of securities and cash easier to verify, reflect both sides of the transaction in shared records, and reduce the time before collateral can be reused."
toc: true
readTime: true
autonumber: false
math: true
tags: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "2026"]
keywords: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "2026"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Tokenization Study in Major Financial Markets - Repo"
  "description": "On-chain infrastructure matters in short-term funding markets because it can make the movement of securities and cash easier to verify, reflect both sides of the transaction in shared records, and reduce the time before collateral can be reused."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

> This post includes my personal study notes based on the section about major financial markets in Tiger Research's report, ["Below the Surface: How Canton Network Is Changing Financial Infrastructure"](https://Reports.tiger-research.com/p/below-the-surface-how-canton-network-kor). In this post, I focus on the **short-term funding market**.

## Short-Term Funding Markets and Repo

The short-term funding market is, in simple terms, a market for very short-term collateralized lending between institutions.

![image](https://substackcdn.com/image/fetch/$s_!-IzT!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff905c540-2a6d-49cb-aba0-474cb259fd2d_2048x1151.png)
*Source: Tiger Research Reports: [Below the Surface: How Canton Network Is Changing Financial Infrastructure](https://Reports.tiger-research.com/p/below-the-surface-how-canton-network-kor)*

Repo is one of the most representative transactions in the short-term funding market. Imagine an institution that needs cash immediately and holds a large amount of safe securities, such as U.S. Treasuries, in its vault. A repo is a transaction where that institution temporarily transfers those securities to another institution and borrows cash against them. When the agreed time arrives, it repays the cash with a small amount of interest and receives the securities back.

Formally, it looks like a transaction where the institution "sells securities and later buys them back." In substance, however, it is closer to **a two-step exchange where an institution borrows money by posting securities as collateral**.

| Stage | Action |
|---|---|
| At the start | The borrower receives cash and transfers securities |
| At the end | The borrower repays cash plus interest and receives the securities back |

Repo can be broadly divided into three types based on maturity.

| Type | Maturity | Main issue | Potential on-chain benefit |
|---|---:|---|---|
| Intraday repo | A few hours, within the same day | Borrowing and repaying quickly | Settlement confirmation, collateral movement, collateral reuse |
| Overnight repo | Borrow today and repay on the next business day | Processing repeated daily transactions efficiently | Automation, ledger synchronization, lower reconciliation cost |
| Term repo | A few weeks to a few months | Collateral price changes and margin call management | Collateral valuation, additional collateral requests, contract management |

---

## Problems in Repo and How On-Chain Infrastructure Can Help

As described above, repo is a form of collateralized lending between institutions. In institutional finance, however, the transaction becomes complex because many systems are involved. The trading parties, custodians, settlement banks, clearing institutions, internal accounting systems, and risk management systems all need to stay aligned on the same information.

The main problems in the repo market can be grouped into five categories.

| Problem | Description |
|---|---|
| Settlement risk | Securities and cash may not move at exactly the same time. If one side has delivered but the other side is delayed, problems can occur |
| Ledger reconciliation | Multiple institutions must keep their records aligned. If the same trade is recorded differently, disputes and costs arise |
| Collateral mobility | Received collateral may not be reusable immediately. If collateral is stuck, funding efficiency declines |
| Margin management | If collateral value changes, additional collateral may be required. If collateral becomes insufficient, the cash lender takes on more risk |
| Repetitive operations | Similar trades are processed in large volumes every day. Even small manual steps and delays can become costly at scale |

### 1. Settlement Risk

In a repo transaction, cash and securities move in opposite directions. But these movements are not always perfectly synchronized. Securities may be processed first while cash is delayed, or cash may be sent before the securities are fully confirmed.

On-chain infrastructure can provide atomic transactions that bundle these steps together. Securities and cash move together, and if one side is not ready, neither side executes.

That said, simultaneous settlement already exists in traditional finance. The value of on-chain infrastructure is not that it invented simultaneous settlement. Its real value is that it can make settlement status and ledger records easier for multiple institutions to share.

### 2. Complex Ledgers

Repo transactions are recorded across multiple institutions' ledgers. The problem is that each institution records the trade in its own system, so the same transaction may appear differently across participants. For example, one party may record that collateral has been received, while another party may still show it as pending. Collateral value, interest, and maturity information may also be reflected differently.

The process of resolving these differences is called reconciliation. On-chain infrastructure can reduce this burden by allowing participants to refer to the same transaction record. The key point is not simply "recording it on a blockchain." The key is reducing the need to record separately first and reconcile later.

### 3. Faster Collateral Movement and Confirmation

In repo, institutions do not necessarily want collateral to sit idle. They often want to reuse the collateral they receive in other transactions. For example, cash or securities received in the morning may be used for another settlement, derivatives margin, or another repo transaction in the afternoon.

If ownership changes can be confirmed immediately on-chain, received collateral can be used more quickly in the next transaction. Time that previously had to be spent confirming ownership can instead be used for additional funding or investment activity. Broadridge describes this as reducing the inefficiency of [using a "24-hour solution for a 4-hour problem"](https://www.broadridge.com/insights/collateral-mobility-intraday-Repo-and-the-next-phase-of-market-evolution). This benefit becomes especially meaningful for short transactions such as intraday repo.

### 4. Margin Call

A margin call is **a request for additional collateral or cash when the value of posted collateral falls and the lender wants to avoid potential losses**. For example, suppose Institution A borrows money from Institution B and posts bonds worth KRW 10 billion as collateral. A few days later, interest rates rise or the market becomes volatile, and the value of those bonds falls to KRW 9.5 billion. From Institution B's perspective, the collateral may no longer be sufficient relative to the amount lent. Institution B may then ask Institution A to post more collateral or repay part of the cash.

On-chain infrastructure can help manage collateral value changes, additional collateral requests, and collateral substitution records in a single workflow by using a shared ledger and faster collateral verification.

### 5. Repetitive Operations

Many institutions process similar repo transactions in large volumes every day. The process includes many repetitive steps.

- Entering trade terms
- Checking eligible collateral
- Allocating securities
- Calculating collateral value and haircuts
- Settling cash and securities
- Reconciling both sides' ledgers
- Returning collateral at maturity
- Entering into a new repo contract when needed

On-chain infrastructure can automate this process through a shared ledger and smart contracts, reducing reconciliation work, disputes, and settlement failures. [Broadridge also describes the scope of on-chain DLR, or Digital Ledger Repo, as covering not only longer-term repo but also intraday, overnight, and term repo transactions](https://www.broadridge.com/press-release/2021/broadridge-launches-dlt-Repo-platform).

---

## Is On-Chain Infrastructure the Solution to Everything?

From the explanation above, it may sound like on-chain infrastructure can improve every weakness of repo. But several conditions must be met for that to be true.

- Tokenized securities or collateral
- Tokenized cash, deposit tokens, or another fast-settling cash system
- Internal systems of the trading counterparties
- Custody, settlement, accounting, and risk management systems
- A legal structure where the token represents the actual underlying rights

For example, if securities can move immediately on-chain but cash still moves slowly through the traditional banking network, the whole transaction will be limited by the slower side. If collateral moves quickly but cash does not settle, it is difficult to call the transaction true simultaneous settlement.

Ultimately, the key question is whether **collateral, cash, contracts, and ledgers can move at the same speed**.