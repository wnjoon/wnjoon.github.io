---
title: "South Korea's Security Token (STO) Legislation and the Possibility of Public Node Participation"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-20"
slug: "public-node-available-in-korea"
summary: "South Korea's security token legislation does not explicitly prohibit public nodes or public blockchains. However, the node composition and no-separate-digital-asset requirements presented by the Financial Services Commission in 2023 effectively exclude the use of public, permissionless networks and assume a permissioned structure of institutional nodes. Because those standards were not directly incorporated into the 2026 amended legislation and were instead delegated to subordinate statutes, the final scope of public chain use will be determined through enforcement decrees and guidelines."
description: "South Korea's security token legislation does not explicitly prohibit public nodes or public blockchains. However, the node composition and no-separate-digital-asset requirements presented by the Financial Services Commission in 2023 effectively exclude the use of public, permissionless networks and assume a permissioned structure of institutional nodes. Because those standards were not directly incorporated into the 2026 amended legislation and were instead delegated to subordinate statutes, the final scope of public chain use will be determined through enforcement decrees and guidelines."
toc: true
readTime: true
autonumber: false
math: true
tags: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "sto", "2026"]
keywords: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "sto", "2026"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "South Korea's Security Token (STO) Legislation and the Possibility of Public Node Participation"
  "description": "South Korea's security token legislation does not explicitly prohibit public nodes or public blockchains. However, the node composition and no-separate-digital-asset requirements presented by the Financial Services Commission in 2023 effectively exclude the use of public, permissionless networks and assume a permissioned structure of institutional nodes. Because those standards were not directly incorporated into the 2026 amended legislation and were instead delegated to subordinate statutes, the final scope of public chain use will be determined through enforcement decrees and guidelines."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Note

This document is a research summary based on publicly available statutes and policy materials and does not constitute a legal opinion on any specific business structure. To determine the legality of a particular public chain or node configuration, a separate review based on the subordinate statutes and Financial Services Commission guidelines to be finalized in the future is recommended.

---

## No Prohibition on Public Nodes in the Amended Legislation

The amended **[Act on Electronic Registration of Stocks and Bonds](https://www.law.go.kr/법령/주식ㆍ사채%20등의%20전자등록에%20관한%20법률)**, promulgated on February 3, 2026, defines a distributed ledger as follows:

> A ledger and its management system, or an equivalent thereof prescribed by Presidential Decree, in which information is recorded by multiple participants according to certain standards prescribed by Presidential Decree, such as chronological order, and is protected against unauthorized deletion and ex-post modification through joint management and technical measures.

The amended legislation does not contain any of the following direct restrictions:

- A prohibition on public blockchains
- A prohibition on permissionless blockchains
- A prohibition on node operation by members of the general public
- A requirement that all nodes be operated by financial institutions

The legislation defines only the basic concept of a distributed ledger, delegating the specific distributed-ledger requirements and scope of application to a Presidential Decree. Thus, based on the statutory language alone, no particular type of blockchain is directly excluded, but actual eligibility is expected to depend on the requirements set out in subordinate statutes.

The amended Act is scheduled to take effect on **February 4, 2027**.

---

## Legislation Premised on the Existence of Nodes or Multiple Participants

The amended Act defines a distributed ledger as **a ledger and management system in which “multiple participants” record information and jointly manage it**. [In its 2023 supplementary Q&A, the Financial Services Commission also described the characteristics of distributed-ledger-based security tokens as follows]((https://www.fsc.go.kr/po020201/79388?curPage=4&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=)).

> Because multiple nodes participate in verifying records, ex-post manipulation and modification can be prevented.

The legal framework for security tokens therefore clearly assumes a structure involving multiple nodes or participants in a distributed ledger.

However, the amended Act does not directly prescribe the following matters:

- The specific types of nodes
- The distinction between validator nodes and read-only nodes
- Qualifications for node operators
- Whether public nodes may participate in validating the legally recognized account book
- The legal liability of individual nodes

Accordingly, merely reading data from a public chain or operating an independent read-only node should be distinguished from participating in the validation, creation, and management of an electronically registered account book with legal effect. Publicly available materials do not appear to expressly prohibit the former. The central regulatory question, however, is **whether public nodes can be recognized as validator or management nodes for a legally recognized securities account book**.

---

## Public Node Participation Is Effectively Difficult Under the FSC's 2023 Standards

In response to the question, [“Can any blockchain technology be used without restriction as long as there is no risk of forgery or alteration?” in its 2023 supplementary Q&A](https://www.fsc.go.kr/po020201/79388?curPage=4&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=), the Financial Services Commission presented the following requirements:

- At least 51% of the nodes must consist of other financial institutions or similar entities, and the network must be suitable for processing matters related to the securities to be issued
- No separate digital asset must be required to record rights holders, transaction information, or similar data

The Commission explained that **other financial institutions or similar entities** refers to the following institutions:

- Other financial institutions
- Electronic registration institutions
- Account management institutions that are not specially related parties of the issuer

These standards can be understood as requiring that the identity and legal responsibility of node participants be verifiable and that regulated institutions constitute a majority of the network. Accordingly, public, permissionless blockchains in which an unspecified number of people can freely participate as validators would have difficulty meeting the requirements for the following reasons:

- It is difficult to ensure that at least 51% of validator nodes consist of domestic financial institutions or similar entities
- It is difficult to impose domestic supervision and liability on overseas or anonymous validator nodes
- If a native coin is used for fees or validator rewards, it may conflict with the **no-separate-digital-asset requirement**

Under these standards, a mainnet such as Ethereum, which uses a native asset and permits anyone to participate as a validator, would be unlikely to qualify as a legally recognized electronic registration account book for domestic security tokens. However, a separate permissioned network or application layer that uses public blockchain technology while restricting the validator set should be considered separately from a general public, permissionless mainnet.

---

## The Problem with Public Chains That Require a Separate Digital Asset

In its 2023 reform plan, the Financial Services Commission presented the following as illustrative conditions for an eligible distributed ledger:

- Multiple participants must confirm and verify transaction records
- Ex-post manipulation and modification must be prevented
- **No separate virtual asset must be required to issue or trade security tokens**

The supplementary Q&A also explained that if a virtual asset is required for security token transactions, the distributed-ledger requirements under the current framework cannot be met, effectively restricting such transactions. Therefore, if a public chain's native coin is mandatory for any of the following purposes, it is highly likely to conflict with the standards in place at the time:

- Payment of gas fees
- Transaction recording fees
- Validator rewards
- On-chain settlement

This is a separate issue from whether a security token is legally classified as a security. Paying with a virtual asset does not by itself eliminate the token's status as a security, but the distributed ledger may fail to satisfy the eligibility requirements recognized under the security token framework.

---

## The Korea Capital Market Institute's Interpretation

In a 2024 report, the Korea Capital Market Institute analyzed the Financial Services Commission's standards as follows:

- Public distributed ledgers such as Ethereum use a structure in which virtual assets are paid as rewards for block production and transaction recording
- They therefore have difficulty meeting the eligibility requirements for distributed ledgers used for domestic security tokens
- A distributed ledger for domestic security tokens is more likely to be recognized as eligible if it is built as a permissioned network

The report also identified the following issues regarding the use of public blockchains:

- Overseas nodes outside South Korean regulatory jurisdiction may validate transaction records
- The authority and responsibilities of participating nodes may be unclear
- Issues involving network reliability and investor protection may arise

At the same time, it concluded that the proposed amendment to the Electronic Securities Act at the time did not specifically define the roles and responsibilities of nodes. Because nodes can take different forms depending on validation functions, data availability, and other factors, a proposal has also been made to determine their roles and responsibilities through self-regulation and agreements among electronic registration institutions and account management institutions.

It therefore appears more accurate to say that, rather than public nodes being directly prohibited by law, **public, permissionless networks are effectively excluded because of the Financial Services Commission's eligibility requirements and liability structure**.

---

## Responsibility for Account Book Management and the Aggregate Quantity Control Structure Under the Amended Act

Under the amended Act, responsibility for creating and managing a distributed-ledger account book lies with an electronic registration institution or account management institution, not with unspecified nodes. In addition, an account management institution that intends to use a distributed ledger must notify the electronic registration institution in advance, and the electronic registration institution must be able to inspect, print, or copy customer account books to control the aggregate quantity of securities.

This structure requires the following characteristics:

- The operating entities that bear responsibility must be identifiable
- Access to and control over the legally recognized account book must be possible
- Aggregate quantity control by an electronic registration institution such as the Korea Securities Depository must be possible
- Errors, over-issuance, or incorrect entries must be correctable and responsibility must be enforceable

For this reason, the operating structure of the amended Act is better suited to a permissioned network with designated management entities and validation participants than to a public blockchain that entrusts the finality of the account book entirely to anonymous, permissionless validators.

---

## The 51% Node Requirement Omitted from the 2026 Amended Act

One important change is that the Financial Services Commission's 2023 requirement that at least 51% of nodes consist of financial institutions or similar entities **was not directly incorporated into the 2026 amended legislation**.

The amended Act delegated the following matters to subordinate statutes such as Presidential Decrees:

- The detailed definition of a distributed ledger
- Securities suitable for the use of a distributed ledger
- Specific requirements that a distributed ledger must satisfy
- Technical standards for creating and managing electronically registered account books
- The scope and management method of linked ledgers

The details therefore need to be distinguished as follows:

- **At the statutory level:** Public blockchains are not explicitly prohibited
- **Under the 2023 policy standards:** A permissioned structure centered on institutional nodes was effectively required
- **In final practical application:** Eligibility will be determined by the specific requirements in enforcement decrees, supervisory regulations, and guidelines

---

## 2026 Subordinate-Legislation Discussions and Calls to Permit Public Chains

At the [second meeting of the public-private Security Token Consultative Body in May 2026]((https://www.fsc.go.kr/no010101/86906?curPage=5&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=)), the Financial Services Commission discussed the following matters:

- Preparation to announce proposed amendments to subordinate regulations and guidelines in July 2026
- Consideration of tokenizing standardized securities such as stocks, bonds, and money market funds (MMFs)
- Consideration of a phased roadmap for on-chain settlement
- Detailed institutional design for issuance, distribution, and infrastructure

At a National Assembly seminar in June 2026, representatives from the financial and legal sectors called for the following:

- Expanding distributed-ledger requirements centered on private blockchains to include public blockchains
- Ensuring connectivity between overseas public chains and domestic security token infrastructure
- Permitting the tokenization of standardized securities such as MMFs and bonds

These demands should be understood as industry opinions rather than a final decision by financial regulators. Nevertheless, they provide evidence that the industry understood the domestic policy standards at the time as being centered on private chains or as effectively not permitting public chains.

As of July 20, 2026, the research cutoff date, [publicly available materials from the Financial Services Commission]((https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=04559206645484344)) do not indicate that subordinate regulations determining the final scope of permitted public-chain use have been finalized. It therefore appears necessary to continue monitoring forthcoming proposed enforcement decrees and guidelines.

---

## Conclusion

The amended security-token legislation promulgated in February 2026 **contains no explicit language prohibiting public nodes or public blockchains.** However, if the distributed-ledger requirements presented by the Financial Services Commission in 2023 are applied as they stand, public, permissionless networks in which anyone can participate as a validator would effectively be difficult to use.

- At least 51% of nodes must consist of other financial institutions, electronic registration institutions, or account management institutions that are not specially related parties of the issuer
- No separate digital asset must be required to record rights holders and transaction information

The policy design at the time can therefore be interpreted as assuming a **permissioned, consortium blockchain** in which participants and responsible entities can be identified, rather than a public-node structure open to unspecified members of the general public. However, because these requirements were not directly incorporated into the 2026 amended legislation and were delegated to subordinate statutes such as Presidential Decrees, the final scope of public blockchain and public node use may vary depending on how the forthcoming enforcement decrees and guidelines evolve.

| Question | Assessment |
|---|---|
| Does the legislation explicitly state that “public node participation is prohibited”? | No |
| Does the legislation explicitly state that “public blockchains are prohibited”? | No |
| Does the legislation assume the existence of nodes or multiple participants? | Yes. It provides for a structure in which multiple participants record information and jointly manage it |
| Are node qualifications and roles specifically prescribed by law? | No. Many aspects are delegated to subordinate statutes such as Presidential Decrees |
| Under the Financial Services Commission's 2023 standards, can ordinary public nodes participate in validation? | Effectively, this would be difficult |
| Why? | Because at least 51% of nodes had to consist of financial institutions or similar entities, and no separate digital asset could be required for recordkeeping |
| Is operating a read-only public node also prohibited? | No explicit prohibition has been identified in publicly available materials |
| Can the Ethereum mainnet be used directly as a legally recognized account book? | Under the 2023 standards, its native asset and permissionless validation structure make it difficult to satisfy the eligibility requirements |
| Did the 2026 amended Act completely exclude public chains? | No. There is no explicit statutory exclusion, but restrictions may be imposed by subordinate-legislation requirements |
| Could public chains be permitted in the future? | The possibility is not entirely foreclosed by law, but the final subordinate statutes must be reviewed |

---

## Sources

- [Korean Law Information Center – Enactment and Amendment Text of the Amended Electronic Securities Act](https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283195&viewCls=lsRvsDocInfoR)
- [Korean Law Information Center – Reasons for the Amendment to the Electronic Securities Act](https://law.go.kr/LSW/lsRvsRsnListP.do?chrClsCd=010202&lsId=012514&lsRvsGubun=all)
- [Financial Services Commission – Amendments to the Electronic Securities Act and Capital Markets Act Pass the National Assembly Plenary Session](https://www.fsc.go.kr/no010101/86064?curPage=1&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=cn&srchText=)
- [Financial Services Commission – Supplementary Q&A on the “Plan to Reform the Regulatory Framework for the Issuance and Distribution of Security Tokens”](https://www.fsc.go.kr/po020201/79388?curPage=4&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=)
- [Financial Services Commission – Plan to Reform the Regulatory Framework for the Issuance and Distribution of Security Tokens](https://www.fsc.go.kr/no010101/79386)
- [Financial Services Commission – Supplementary Security Token Q&A: Response Regarding Virtual Asset Payments](https://www.fsc.go.kr/po020201/79388?curPage=&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=)
- [Korea Capital Market Institute – Key Issues and Development Measures in Establishing a Security Token Issuance and Distribution Framework](https://www.kcmi.re.kr/kcmifile/report_data/1790/reportpdf_1790.pdf)
- [Korean Law Information Center – Article 23-2 of the Amended Electronic Securities Act](https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283195&viewCls=lsRvsDocInfoR)
- [Kim & Chang – Key Provisions of the Amended Legislation for Introducing Security Tokens and Distributing Investment Contract Securities](https://www.kimchang.com/ko/insights/detail.kc?idx=34390&sch_section=4)
- [Financial Services Commission – Second Meeting of the Public-Private Security Token Consultative Body](https://www.fsc.go.kr/no010101/86906?curPage=5&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=)
- [Edaily – “July Security Token Subordinate-Legislation Proposal Should Permit Standardized Securities and Public Chains”](https://www.edaily.co.kr/News/Read?mediaCodeNo=257&newsId=04559206645484344)
