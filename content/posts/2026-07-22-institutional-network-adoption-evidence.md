---
title: "Institutional Blockchain Adoption: Evidence from Besu and Canton"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-22"
slug: "institutional-network-adoption-evidence"
summary: "A financial institution's participation in a blockchain project does not necessarily mean that it has fully adopted the network. This post examines Besu and Canton by separating official platform technology choices, participation in live transactions and issuance, and involvement in foundations and working groups, then sets out the evidence needed to evaluate institutional adoption."
description: "A financial institution's participation in a blockchain project does not necessarily mean that it has fully adopted the network. This post examines Besu and Canton by separating official platform technology choices, participation in live transactions and issuance, and involvement in foundations and working groups, then sets out the evidence needed to evaluate institutional adoption."
toc: true
readTime: true
autonumber: false
math: true
tags: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "tokenization", "Besu", "Canton", "2026"]
keywords: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "tokenization", "institutional adoption", "Hyperledger Besu", "Canton Network", "2026"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Institutional Blockchain Adoption: Evidence from Besu and Canton"
  "description": "A financial institution's participation in a blockchain project does not necessarily mean that it has fully adopted the network. This post examines Besu and Canton by separating official platform technology choices, participation in live transactions and issuance, and involvement in foundations and working groups, then sets out the evidence needed to evaluate institutional adoption."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## A Framework for Comparing Institutional Blockchain Adoption

News about institutional blockchain adoption often contains statements like these:

- A global financial institution has joined the network.
- Several banks have completed on-chain transactions.
- A major institution has joined a foundation or become a validator.
- Dozens of institutions are participating in a working group or pilot.

All of these developments are meaningful, but they do not necessarily mean that **an institution has adopted a particular network as a core business system**. For example, Bank of America's participation in a U.S. Treasury financing transaction on Canton Network does not establish that Canton is the bank's standard network for tokenized securities. Likewise, the tokenization of a BlackRock money market fund on Goldman Sachs's digital asset platform does not mean that BlackRock built its own platform on Canton.

Institutional network adoption should therefore be evaluated across three separate categories.

| Category | What can be confirmed | Significance as evidence of adoption |
|---|---|---|
| Platform's underlying technology | Which network the operator actually used in its system | Strongest evidence |
| Participation in live transactions or issuance | Whether an institution transacted or issued assets in that environment | Supporting evidence of practical experience |
| Participation in foundations, working groups, or pilots | Whether an institution is interested in and collaborating with the ecosystem | Contextual evidence of interest and potential expansion |

This post focuses on Besu and Canton, which have been adopted by many institutions, and analyzes their adoption using these three criteria and a range of public sources.

---

## Classifying Source Reliability

The nature of the source also matters when assessing network adoption. This post uses the following classifications:

- **Grade A:** Official material in which the institution or platform operator directly identifies the underlying technology
- **Grade B:** Material published by the network operator, technology provider, or an official partner
- **Pending:** Cases in which the underlying technology is difficult to verify from the operator's latest official materials

---

## Platforms Whose Underlying Networks Have Been Officially Confirmed

The first question in comparing institutional technology choices is whether **the underlying network of an operational or in-development platform has been officially confirmed**.

| Operator or platform | Confirmed network | Status and purpose | Evidence level |
|---|---|---|---|
| DTCC Tokenization Service | DTCC AppChain (Besu) + Canton | Digital twins of DTC-custodied securities; live production transactions in July 2026 | A |
| DTCC Collateral AppChain | Besu-based DTCC AppChain | Multi-asset collateral management; moving toward production | A |
| Broadridge DLR | Canton | Commercial institutional repo and tokenized collateral platform | A |
| LSEG DiSH | Canton | Tokenized commercial bank deposit and settlement system | A |
| Swift Shared Ledger | Hyperledger Besu | Cross-border payments and orchestration using tokenized deposits | A |
| HKMA Project Evergreen | Besu Layer 1 + Canton/Daml Layer 2 | Issuance and settlement of a tokenized Hong Kong government green bond in 2023 | A |
| Goldman Sachs GS DAP | Canton/Daml ecosystem | Digital bond and MMF mirror-token platform | B |

**DTCC**

- [On July 15, 2026, DTCC announced that securities held at DTC had been converted into tokens and used in live production transactions](https://www.dtcc.com/news/2026/july/15/dtcc-turns-tokenization-into-reality).
- The digital conversion took place on LFDT Besu, DTCC's private network, and Canton, a public network.
- Rather than choosing only one network, DTCC is pursuing a **multi-chain strategy that connects different networks according to workflow and asset type**.
- The DTCC Tokenization Service and the Collateral AppChain should be treated as separate systems.
  - DTCC Tokenization Service: provides digital twins of DTC-custodied securities across multiple networks
  - Collateral AppChain: processes collateral movement and management on a Besu-based AppChain

> LFDT stands for Linux Foundation Decentralized Trust, a Linux Foundation organization for open-source collaboration on decentralized trust and blockchain technologies. It was formed through an expansion and reorganization that included the former Hyperledger Foundation.

**Broadridge DLR**

- A commercial platform for inter-institutional repo and collateral workflows
- [Migrated to Canton in 2023](https://www.broadridge.com/article/capital-markets/dlr-transacts-1-trillion-a-month)
  - Processes $1 trillion in monthly transaction volume and is operating in a production environment
  - This figure represents the volume processed by Broadridge's platform, not Canton's share of the overall market

**LSEG DiSH**

- [LSEG launched Digital Settlement House, or DiSH, in January 2026](https://www.lseg.com/en/media-centre/press-releases/2026/lseg-launches-digital-settlement-house).
  - DiSH records commercial bank deposits on a digital ledger and supports 24-hour settlement across multiple currencies and networks.
  - In the pre-launch proof of concept, commercial bank deposits were tokenized on Canton Network and used as the cash settlement leg of transactions.
  - The service itself is intended to provide an open architecture connecting on-chain assets with traditional payment networks. It would therefore be difficult to conclude that every asset and network connected through DiSH operates exclusively on Canton.

**Swift Shared Ledger**

- [Swift has officially stated that the shared ledger is being built as an EVM-compatible architecture based on Hyperledger Besu](https://www.swift.com/news-events/news/swifts-blockchain-based-shared-ledger-progresses-mvp-implementation).
- It serves as an orchestration layer for recording and validating interbank payment commitments, with tokenized deposits representing value.
- However, the participation of banks in Swift's initial group does not mean that those banks have also adopted Besu as the standard for their own platforms.
  - Swift: operates the ledger
  - Participating banks: retain control over their keys, assets, funds, and settlement methods

**HKMA Project Evergreen**

- [The Hong Kong Monetary Authority combined Besu Layer 1 with Canton/Daml Layer 2 to issue and settle an HKD 800 million tokenized green bond](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2023/20230824e3a1.pdf).
- The underlying technology is identified in the official report.
- Because this was a completed, one-off issuance rather than a continuously operating general-purpose platform, it should not be assessed on the same basis as commercial services such as Broadridge DLR or DTCC.

**Goldman Sachs GS DAP**

- [A platform used for digital bonds and MMF mirror tokens](https://www.goldmansachs.com/pressroom/press-releases/2025/bny-goldman-sachs-launch-tokenized-money-market-funds-solution)
- [The platform operator, Canton, directly identifies the network](https://www.canton.network/faq)

---

## Participation in Live Transactions

Experience executing transactions or issuing assets on a particular network is more meaningful than participation in a pilot. As noted above, however, it does not mean that every participating institution has adopted the network as a strategic standard.

| Transaction or project | Major participants | Environment | What is confirmed |
|---|---|---|---|
| DTCC live production transactions, July 2026 | BlackRock, BNP Paribas Securities, Circle, Citadel Securities, CME, Goldman Sachs, J.P. Morgan, Nasdaq, NYSE, State Street, Vanguard, Virtu, and more than 30 others | Besu + Canton | Institutions participated in live production transactions using DTC-tokenized assets |
| On-chain U.S. Treasury financing on Canton | Bank of America, Circle, Citadel Securities, Cumberland DRW, DTCC, Société Générale, Tradeweb, Virtu, and others | Canton | Financing and settlement using on-chain U.S. Treasuries and USDC |
| Subsequent Treasury repo and collateral reuse on Canton | Bank of America, Circle, Citadel Securities, Cumberland DRW, M1X Global, Société Générale, Tradeweb, Virtu, and others | Canton | Real-time collateral reuse and subsequent on-chain repo transactions |
| BNY and GS DAP tokenized MMFs | BlackRock, BNY Investments Dreyfus, Federated Hermes, Fidelity Investments, Goldman Sachs Asset Management | GS DAP | Participation in the initial launch of mirror tokens representing MMF shares |
| HKMA tokenized green bond | Hong Kong government, Bank of China (Hong Kong), Crédit Agricole CIB, Goldman Sachs, HSBC | Besu + Canton/Daml | Issuance and settlement of an HKD 800 million bond |
| LSEG DiSH proof of concept and launch | LSEG and a consortium of participating financial institutions | Canton | Commercial bank deposits tokenized and used as the cash settlement leg |

**DTCC live production transactions**

- [The event included collateral pledges, securities lending, U.S. Treasury and repo DVP, equity DVP and DVD, equity token transfers, and central counterparty margin workflows](https://www.dtcc.com/news/2026/july/15/dtcc-turns-tokenization-into-reality).
  - DVP (Delivery versus Payment): the simultaneous delivery of securities and payment
  - DVD (Delivery versus Delivery): the simultaneous exchange of two different assets
- Although the announcement names all participants, it does not disclose whether each institution used the Besu or Canton environment.
  - Nasdaq's, NYSE's, or Vanguard's participation in the DTCC transactions cannot therefore be counted separately as evidence that the institution adopted either Besu or Canton.

**On-chain U.S. Treasury financing and subsequent repo transactions on Canton**

- Institutions including Bank of America [executed financing transactions on Canton](https://blog.digitalasset.com/press-release/digital-asset-and-industry-working-group-complete-groundbreaking-on-chain-us-treasury-financing-on-canton-network) and later completed [transactions involving collateral reuse](https://blog.digitalasset.com/press-release/the-canton-networks-industry-working-group-demonstrates-next-phase-of-onchain-u.s.-treasury-financing-on-canton-network).
- Transaction participation alone, however, does not establish that an institution has migrated its proprietary ledger or entire core system to Canton.

---

## Foundation Membership and Pilot Participation

Membership in a foundation, service as a validator, and participation in a working group or pilot can help indicate a network's institutional credibility and potential for expansion. These signals should nevertheless remain separate from evidence of platform adoption or transaction volume.

| Ecosystem or program | Participating institutions | Form of participation | Limitation in interpretation |
|---|---|---|---|
| Canton Foundation | DTCC | Co-chair with Euroclear | Governance participation does not mean that every DTCC workflow is moving to Canton |
| Global Synchronizer Foundation | Goldman Sachs, HKFMI, Moody's Ratings, and others | Foundation membership | Membership alone does not prove adoption for live issuance or transaction systems |
| Canton RWA pilot | BNY Mellon, Broadridge, DRW, EquiLend, Goldman Sachs, Paxos, and others | Application and market expertise; simulated transactions | Production transactions must be distinguished from pilot activity |
| DTCC Industry Working Group | More than 50 financial institutions and market participants | Collaboration on service design and operational readiness | Does not reveal whether each institution used Besu or Canton |
| Swift Shared Ledger initial group | 17 banks | Preparation for early use and pilot transactions | Swift's selection of Besu is separate from each bank's own technology choices |
| Canton Network initial participant group | BNP Paribas, Deutsche Börse, Goldman Sachs, Broadridge, Cboe, EquiLend, and others | Network launch and interoperability testing | Each institution's production systems and transaction volume must be verified separately |

**DTCC's participation in Canton Foundation governance**

- It demonstrates DTCC's long-term interest and influence in the ecosystem, but it does not mean that all DTCC business systems will migrate to Canton.
- DTCC is in fact pursuing a multi-chain strategy using both a Besu-based AppChain and Canton.

**[Canton's RWA pilot](https://www.canton.network/canton-network-press-releases/the-canton-network-completes-the-most-comprehensive-blockchain-pilot-to-date-for-tokenized-real-world-assets)**

- The participation of several major financial institutions demonstrates the scope of institutional demand and interoperability testing. The number of institutions involved in simulated transactions, however, should not be interpreted as the number of commercial platform customers or institutions executing live transactions.

---

## Cases That Should Currently Be Excluded or Left Pending

For some platforms, the underlying technology cannot safely be determined from historical sources or general industry assumptions alone.

| Institution or platform | Reason for pending status |
|---|---|
| Fnality | Its use of Besu appears in older LFDT technical materials, but Fnality's current official product pages do not identify the underlying technology |
| J.P. Morgan Kinexys | It is confirmed to be a private, permissioned Ethereum platform descended from Quorum, but its current execution client has not been officially confirmed as Besu |
| HSBC Orion | The operation of the digital bond platform is confirmed, but the latest official materials do not establish whether the underlying network is Besu or Canton |
| DTCC participants such as Nasdaq, NYSE, and Vanguard | Participation in DTCC transactions is confirmed, but the environment used by each institution—Besu or Canton—has not been disclosed |

**Fnality**

- Changes in the Linux Foundation ecosystem must also be taken into account.
  - The former Hyperledger ecosystem became part of LF Decentralized Trust in 2024, and Hyperledger Besu's official project name was changed to Besu.
  - It is therefore necessary to verify separately whether the technical terminology in older documents and the current product architecture remain the same.

**Kinexys**

- A description of the platform as Ethereum-based is not enough to classify it as Besu. EVM compatibility, Quorum's lineage, and the actual choice of execution client are separate questions.

---

## Errors in Calculating Network Market Share

Simply combining the three tables above erases both institutional duplication and differences in the strength of the evidence.

- If an institution is a Canton Foundation member and also participated in both the RWA pilot and a U.S. Treasury transaction, those activities cannot be counted as three independent instances of adoption.
- Conversely, assigning an institution such as DTCC—which uses Besu and Canton for different workflows—to only one network would also misrepresent the actual architecture.

At a minimum, any comparison of institutional adoption or market share should record the following separately:

- Who operates the platform?
- Who officially identified the underlying network?
- Is it a pilot or a production environment?
- Is it a one-off issuance project or a continuously operated platform?
- Does the participating institution operate a node directly?
- Did real assets and cash move, or were the transactions simulated?
- Does the reported volume represent an individual platform or the network as a whole?
- Are the same institution and project counted in multiple categories?

The safest approach is therefore to **report the number of platforms, the number of live transaction cases, and the number of ecosystem participants as separate metrics**. Showing each type of evidence is more accurate than collapsing them into a single figure.

---

## Differences Visible in the Besu and Canton Cases

Public materials show that Besu and Canton are both being used in institutional financial infrastructure, but the forms of adoption that can be verified differ.

**Besu**

- The underlying layer for DTCC's private AppChain, Swift Shared Ledger, and HKMA Project Evergreen
- **Dedicated ledgers or EVM-compatible infrastructure controlled by institutions**
- Adopted in architectures with a clear operator and straightforward integration with existing systems

**Canton**

- Used in Broadridge DLR, LSEG DiSH, DTCC Tokenization Service, and U.S. Treasury financing transactions
- **Connectivity and synchronized settlement across different institutions and applications**
- Broad disclosure of participating foundations, working groups, and pilot institutions makes ecosystem involvement relatively easy to observe

These observations alone are not enough to conclude that either network has a larger market share. Private Besu deployments within institutions may not all be publicly disclosed, while Canton publishes relatively extensive information about ecosystem participation and may therefore appear larger in a simple institutional count.

The amount of public information and the actual scale of adoption are not the same thing.

---

## Conclusion

The strongest evidence of institutional blockchain adoption is **an official source in which the institution or platform operator directly identifies the technology underlying a live system**. Experience with live transactions and issuance is the next strongest signal. Foundation membership, validator activity, and participation in working groups or pilots are best treated as *supporting evidence* of ecosystem interest.

The key findings from currently available public materials are as follows:

- DTCC is pursuing a multi-chain strategy that combines a private Besu-based AppChain with Canton.
- Commercial or launched Canton-based implementations have been confirmed for Broadridge DLR and LSEG DiSH.
- Swift Shared Ledger is being implemented as an EVM-compatible architecture based on Hyperledger Besu.
- HKMA Project Evergreen was a live bond issuance combining Besu and Canton/Daml, but it should be distinguished from a continuously operated platform.
- GS DAP is connected to the Canton/Daml ecosystem, but its classification warrants an additional degree of caution depending on whether the platform operator directly identifies the network.
- The names of institutions participating in transactions, foundations, or pilots cannot automatically be treated as evidence that they have adopted the network for their own systems.

| Question | Assessment |
|---|---|
| Has the platform operator directly identified the underlying network? | Can be used as primary evidence of adoption |
| Has the institution participated in a live transaction? | Confirms practical experience, but should be distinguished from adoption for its own platform |
| Is the institution a foundation member or working-group participant? | Evidence of interest and ecosystem involvement |
| Has the institution participated in a pilot? | Evidence of technical validation experience, not the same as a production transaction |
| Does the same institution appear in multiple tables? | The figures should not be combined without removing duplicates |
| Has the network used by each institution not been disclosed? | The institution should not be individually classified as having adopted either Besu or Canton |
| Is the underlying technology identified only in historical sources? | It is safer to leave the case pending until current official materials are available |

---

## References

- [DTCC — DTCC Turns Tokenization into Reality](https://www.dtcc.com/news/2026/july/15/dtcc-turns-tokenization-into-reality)
- [DTCC — Tokenization](https://www.dtcc.com/digital-assets/tokenization)
- [DTCC — Collateral AppChain](https://www.dtcc.com/digital-assets/collateral-appchain)
- [Broadridge — DLR Transacts $1 Trillion a Month](https://www.broadridge.com/article/capital-markets/dlr-transacts-1-trillion-a-month)
- [Broadridge — Billions in Average Daily Processed Trade Volumes on DLR](https://www.broadridge.com/press-release/2025/billions-in-average-daily-processed-trade-volumes-on-broadridge-dlt-repo-platform)
- [LSEG — LSEG Launches Digital Settlement House](https://www.lseg.com/en/media-centre/press-releases/2026/lseg-launches-digital-settlement-house)
- [Swift — Shared Ledger Progresses to MVP Implementation](https://www.swift.com/news-events/news/swifts-blockchain-based-shared-ledger-progresses-mvp-implementation)
- [Swift — Blockchain Ledger Ready for Use](https://www.swift.com/news-events/press-releases/swifts-blockchain-ledger-ready-use-17-banks-set-pioneer-tokenised-cross-border-payments-trusted-global-infrastructure)
- [HKMA — Project Evergreen Report](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2023/20230824e3a1.pdf)
- [Goldman Sachs — BNY and Goldman Sachs Launch Tokenized MMF Solution](https://www.goldmansachs.com/pressroom/press-releases/2025/bny-goldman-sachs-launch-tokenized-money-market-funds-solution)
- [BNY — BNY and Goldman Sachs Launch Tokenized MMF Solution](https://www.bny.com/corporate/global/en/about-us/newsroom/company-news/bny-and-goldman-sachs-launch-tokenized-money-market-funds-solution.html)
- [Canton Network — FAQ](https://www.canton.network/faq)
- [Digital Asset — On-chain U.S. Treasury Financing on Canton](https://blog.digitalasset.com/press-release/digital-asset-and-industry-working-group-complete-groundbreaking-on-chain-us-treasury-financing-on-canton-network)
- [Digital Asset — Next Phase of On-chain U.S. Treasury Financing](https://blog.digitalasset.com/press-release/the-canton-networks-industry-working-group-demonstrates-next-phase-of-onchain-u.s.-treasury-financing-on-canton-network)
- [Canton Network — RWA Pilot Results](https://www.canton.network/canton-network-press-releases/the-canton-network-completes-the-most-comprehensive-blockchain-pilot-to-date-for-tokenized-real-world-assets)
- [Canton Network — Global Synchronizer Foundation Members](https://www.canton.network/canton-network-press-releases/goldman-sachs-hkfmi-and-moodys-ratings-join-the-global-synchronizer-foundation)
- [Canton Network — Network Launch](https://www.canton.network/canton-network-press-releases/canton-network-press-release)
- [LF Decentralized Trust — Launch Announcement](https://www.lfdecentralizedtrust.org/announcements/linux-foundation-decentralized-trust-launches-with-17-projects-100-founding-members)
