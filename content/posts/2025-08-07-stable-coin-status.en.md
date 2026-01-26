---
title: "The Current State of Stablecoins: Market Structure and Key Players"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-08-07"
slug: "stable-coin-status"
summary: "This post analyzes and tracks the current state of stablecoins, including their market structure, key players, and future prospects."
description: "As of 2025, this post covers the definition of stablecoins, the arbitrage principle that maintains their $1 value, the market's development process, analysis of major players like USDT and USDC, and future prospects."
toc: true
readTime: true
autonumber: false
math: false
tags: ["essay", "blockchain", "cryptocurrency", "investment", "stablecoin", "2025"]
keywords: ["stablecoin", "stablecoin market", "stablecoin analysis", "stablecoin future"]
showTags: true
hideBackToTop: false
aliases:
  - /2025/08/07/stable-coin-en/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  "headline": "The Current State of Stablecoins: Market Structure and Key Players"
  "description": "As of 2025, this post covers the definition of stablecoins, the arbitrage principle that maintains their $1 value, the market's development process, analysis of major players like USDT and USDC, and future prospects."
  "keywords": "stablecoin, stablecoin market, stablecoin analysis, stablecoin future"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
  mainEntity:
    - '@type': Question
      name: "Q1: How do stablecoins maintain their $1 value despite market volatility?"
      acceptedAnswer:
        '@type': Answer
        text: "They maintain their value through an 'arbitrage' mechanism between the issuer and designated arbitrageurs. If the market price goes above $1, arbitrageurs issue new coins to sell, increasing supply and lowering the price. If it falls below $1, they buy coins from the market and redeem them, reducing supply and raising the price. This self-regulating principle is at work."
    - '@type': Question
      name: "Q2: What is the biggest difference between the top two players, USDT and USDC?"
      acceptedAnswer:
        '@type': Answer
        text: "USDT (Tether) has the advantage of being the first to market, securing overwhelming liquidity and user numbers, but its regulatory transparency is often questioned. In contrast, USDC (Circle) is growing rapidly, especially in institutional and regulated markets, through a 'trust' strategy of actively complying with regulations and transparently disclosing its reserves."
    - '@type': Question
      name: "Q3: How are US and European stablecoin regulations affecting the market?"
      acceptedAnswer:
        '@type': Answer
        text: "Regulation is having a divergent effect, dividing the market into 'compliant coins' (e.g., USDC) and 'non-compliant coins' (e.g., USDT). Additionally, the rising costs of audits and ensuring transparency are increasing the entry barriers for new operators, creating an environment that favors large, well-capitalized issuers."
---

## Introduction

Recently, the term 'Stablecoin' has been frequently mentioned in the financial and technology sectors. As of August 2025, when this article is being written, Kakao has formed a group-level task force for stablecoins ([News](https://www.mk.co.kr/news/stock/11386047)), and Circle, one of the two major global stablecoin issuers we will discuss, is planning a visit to South Korea ([News](https://www.sedaily.com/NewsView/2GWIS82LOS)).

So, I asked Perplexity what reports issued by 'large institutions' have summarized stablecoins as of July 2025.

| |Institution/Publisher|Report/Article Title (Publication Date)|Core Content|
|---|---|---|---|
|✔️|McKinsey & Company|The stable door opens: how tokenized cash enables next-gen payments (2025-07-21)|- Diagnoses 2025 as an inflection point for stablecoin growth<br>- Comprehensive summary of global regulations: EU MiCA, UK FSMA, US GENIUS Act<br>- Scenarios and market size estimation for payments, securities settlement, and asset tokenization|
|✔️|CertiK Skynet|H1 2025 Comprehensive Stablecoin Report (2025-07-23)|- Presents measured data: total supply $250B, monthly payment volume $1.4T<br>- Analysis of security incidents, reserve transparency, and regulatory risks|
|✔️|Samsung Securities Research Center|Stablecoin Currency Hegemony Competition, a New Opportunity? (2025-06-13)|- Interprets the conflict: dollar hegemony defense vs. national currency sovereignty<br>- Compares strategies of new projects amidst the USDT/USDC duopoly|
| |TRM Labs|Stablecoins – Risks & Compliance Cheat-Sheet (2025-05-28)|- FATF Travel Rule & AML/KYC checklists<br>- On-chain forensic cases and issuer sanction risks|
|✔️|Amberdata|Stablecoin Q1 2025: Insights on Trends & Regulation (2025-05-16)|- Demand analysis with quarterly issuance/redemption charts<br>- Impact assessment of events: Circle-ICE partnership, FDUSD de-pegging|
| |FXC Intelligence|State of Stablecoins in Cross-border Payments 2025 (2025-07-22)|- Case studies on remittance/trade settlement fee reductions, financial institution interviews|
|✔️|Bank for International Settlements (BIS)|Stablecoins and Safe-Asset Pricing (Summary Article 2025-07-25)|- Warning on safe-asset shortage and 'coin run' scenarios<br>- Suggests potential links between stablecoins, interest rates, and the repo market|

From the list above, I selected five reports and asked NotebookLM to summarize the overall flow and content. I then wrote this article based on that summary.

## Stablecoin

As the name suggests, a stablecoin is a **'digital asset designed to maintain a stable value.'** It is generally pegged 1:1 to the value of a specific fiat currency, such as the US dollar. In simple terms, it is designed so that **1 stablecoin always maintains a value of $1**.

This is the biggest feature that distinguishes stablecoins from other cryptocurrencies with high price volatility. This value stability is usually secured by **holding reserves of cash or cash equivalents, such as US Treasury bills (T-bills), equal to the amount of coins issued**.

> Reserves refer to funds set aside in advance by a company to prepare for future uncertain situations. They are divided into legal reserves, which are legally mandated for corporate stability, and voluntary reserves, which are at the-company's discretion. These reserves are used for various purposes, such as capital preservation and limiting dividend sources.

In fact, stablecoins did not appear suddenly. The first stablecoin emerged in 2014, created with the aim of reducing volatility by using stable assets like US Treasury bonds. As of the first half of 2025, the total stablecoin market size has reached approximately **$252 billion (about 350 trillion KRW)**, with a monthly payment and transfer volume of **$1.39 trillion (about 1,930 trillion KRW)**. These figures show that stablecoins have established themselves as a significant sector within the digital asset ecosystem.


### How Can Stablecoins Maintain Their 1:1 Value?

This raises a question. When users buy and sell coins, the price should fluctuate according to supply and demand, so how can the $1 value be maintained?

Stablecoins maintain their $1 value through the principle of **'Arbitrage.'** When the market price deviates from $1, arbitrageurs intervene to make a profit, and in the process of restoring the price to $1, the 1:1 value is naturally maintained.

Before explaining the principle of arbitrage, it's necessary to understand the issuers, arbitrageurs, and general investors.

**Issuer**

- The entity that creates (issues) and destroys (burns/redeems) stablecoins.
- For example, Tether Limited, which makes the stablecoin USDT, falls into this category.
- The issuer must hold reserves greater than or equal to the total amount of stablecoins issued. These reserves must be held in actual dollars or cash equivalents like government bonds. This allows the value of the stablecoin to be maintained 1:1.

**Arbitrageur**

- An entity that profits by trading with the issuer when a gap (disparity) occurs between the stablecoin's market price and the fiat currency (e.g., US dollar), thereby stabilizing the price.
- Not just anyone can be an arbitrageur. They must be able to pass strict customer verification (KYC/AML) and must have a direct contract with the issuer.
- This typically includes large cryptocurrency exchanges (like Binance, Kraken), large crypto funds, and professional trading firms.
- For example, Tether sets the minimum unit for issuance and redemption at $100,000 (about 140 million KRW).

**General Investor**

- Buys and sells stablecoins on cryptocurrency exchanges according to the market price.
- They influence the supply and demand of stablecoins, which is the cause of market price fluctuations.

Now, let's look at how arbitrage works in two situations. We'll use USDT as an example.

**Situation 1: Price Rises Above $1 Due to Increased Demand**

1.  When the market price of USDT becomes $1.01, an arbitrageur gives $1 to the issuer and receives 1 USDT (it is not issued at the higher price).
2.  They immediately sell this 1 USDT on the market for $1.01, making a profit of $0.01.
3.  As this arbitrage continues, the supply of USDT in the market increases, and the price comes back down to $1.

**Situation 2: Price Falls Below $1 Due to Increased Supply**

1.  When the market price of USDT drops to $0.99, an arbitrageur buys 1 USDT from the market for $0.99.
2.  They take this 1 USDT to the issuer and redeem it for $1, making a profit of $0.01.
3.  As this arbitrage continues, the demand for USDT in the market increases, and the price goes back up to $1.

In this way, arbitrage acts as an 'invisible hand' that keeps the stablecoin's price pegged to the $1 benchmark. Of course, this mechanism only works smoothly when there is market trust that **"the issuer holds 1:1 reserves and will exchange them at any time."**

## The Evolution of the Stablecoin Market

### 2021-2023: Market Growth and Stability Tests

During this period, the stablecoin market grew in scale along with the overall growth of the cryptocurrency market. A duopoly structure formed, with USDT and USDC occupying most of the market. Meanwhile, in March 2023, in the aftermath of the Silicon Valley Bank (SVB) collapse, USDC's $1 peg was temporarily shaken. This event clearly demonstrated to the market that the stability of stablecoins depends entirely on the issuer's reserve management capabilities and highlighted potential risks.

### 2024: Expansion of Transaction Volume and Network

In 2024, the annual transaction volume of stablecoins exceeded $27 trillion, indicating a significant increase in their utilization. In this process, users began to prioritize transaction efficiency (speed, cost), and stablecoin transaction volume on alternative blockchain networks like Solana, in addition to Ethereum, increased significantly, showing clear network expansion.

### First Half of 2025: Increased Policy Interest and Market Structure Changes

**US Policy Changes**

As the market size grew, so did policy interest. On January 23, the US President issued an executive order setting a direction to support privately issued, fiat-backed stablecoins.

This executive order also affected CBDC (Central Bank Digital Currency), which is a digital currency issued directly by the central bank. In 2025, Representative Tom Emmer introduced a bill to block the Federal Reserve from developing or deploying a digital currency. As a result, the 'Anti-CBDC Surveillance State Act,' which would completely ban CBDC issuance, is being deliberated in both the House and Senate. Ultimately, a policy shift has emerged, such as halting CBDC development and directing support for fiat-backed stablecoins, indicating that stablecoins are beginning to be recognized as an element of the financial system ([News](https://www.g-enews.com/article/Global-Biz/2025/07/202507041553356500906806b77b_1)).

> **fiat-backed**: This means the stablecoin is collateralized by fiat currency. Here, fiat currency refers to real money issued and guaranteed by a government, like the US dollar. Most stablecoins, including USDT, USDC, and PYUSD, fall into this category. Most stablecoins hold short-term US Treasury bonds as reserves. According to a BIS report, stablecoin net inflows tend to lower short-term T-bill yields. A stablecoin inflow of about 2 standard deviations (approx. $3.5 billion) lowers the 3-month T-bill yield by about 2-2.5 bp (basis points) within 10 days.

**Europe's MiCA Regulation**

MiCA (Markets in Crypto-Assets Regulation) is a law established by the European Union to increase transparency and stability in the crypto-asset market and to protect investors. ([Link](https://kdaxa.org/support/report.php?mNum=3&sNum=2&boardid=data&mode=view&idx=202))

- Businesses issuing virtual assets must mandatorily publish a white paper.
- Virtual asset service providers must meet certain levels of capital and risk management.
- Virtual asset service providers must establish internal control systems for anti-money laundering and anti-terrorist financing.
- Stablecoins are subject to different regulations than generally accepted virtual assets.

In fact, after MiCA was first implemented in June 2024 and fully enforced in December 2024, Tether withdrew from the European market as it did not meet the MiCA standards. Currently, Tether plans to enter the European market by supporting the issuance of stablecoins by European partners.

In addition, the UK, Singapore, Hong Kong, and Japan are also introducing or promoting stablecoin regulatory frameworks.

**Background of Regulation: Security Risks**

The reason for these high regulatory demands in various countries is the various security incidents and risks that have occurred in the stablecoin market. In the first half of 2025 alone, there were 344 virtual asset security incidents, resulting in approximately $2.47 billion in damages. Rather than vulnerabilities in smart contract code, which previously accounted for a high percentage of security incident causes, operational loopholes such as private key mismanagement and logical flaws in liquidity pools now account for a larger share. For example, the approximately $1.5 billion in damages at Bybit and the $49.5 million loss at Infin both stemmed from hacking. There is also the problem that stablecoin holders may be treated as legally unsecured creditors in the event of an issuer's bankruptcy and may not be guaranteed protection by the central bank or government.

**The Impact of Regulation on the Market**

However, the impact of these regulations on the market is larger and more complex than one might think. First, a clear gap is emerging between 'compliance leaders' who meet regulatory requirements and 'non-compliant laggards' who evade or fail to meet regulations. Even USDT, the first to market and the largest in scale, is also a non-compliant laggard that failed to meet MiCA regulations.

Furthermore, as regulations become stricter, standards for security audits and transparency have risen. For example, Circle, the issuer of USDC, spends $50 million annually to ensure transparency. This impact also makes the size of the issuer important; ultimately, an environment favorable to large issuers is being created.

## Major Stablecoins and Market Structure

As of 2025, the stablecoin market is a competitive landscape with several key players, each with distinct characteristics.

**USDT (Tether)**

With a circulating supply of approximately $154 billion as of the first half of 2025, it holds the largest market share and liquidity. In particular, it shows high transaction activity, with more than half of its total supply circulating on the TRON network, which has low fees.

> Tron is a blockchain network created by Justin Sun in 2017. It offers nearly free transaction fees and fast speeds, capable of processing 2,000 transactions per second (2,000 TPS).

USDT was the first to enter the market, acquiring many users and securing stable liquidity. However, it has faced various discussions regarding the transparency of its reserve composition since the past, and it recently withdrew from the European market for failing to meet MiCA. How it will respond to the increasingly strengthening regulatory environment not only in Europe but also worldwide is a critical issue.

**USDC (Circle)**

With a supply of approximately $61 billion as of the first half of 2025, it is the second-largest player in the market alongside USDT. Circle, in particular, employs a strategy of transparently disclosing its reserves through regular audits and actively complying with the regulatory frameworks of major countries like the US.

In 2025, it successfully completed its IPO and is seeking to expand into the institutional market through partnerships with traditional financial companies like Visa and BlackRock. It is also establishing a separate corporation in France and introducing a new issuance structure to comply with MiCA regulations.

**PYUSD (PayPal)**

Its market capitalization more than doubled in the first half of 2025, rapidly increasing its market share. Its significant advantages include PayPal's proven infrastructure and its existing user base of about 400 million. As a latecomer, it is pursuing aggressive strategies to increase user adoption, such as introducing the Solana network for fast transaction speeds and offering a 3.7% annual reward to holders.

**DAI (MakerDAO)**

Represents a 'decentralized' model managed by a protocol, without a specific centralized issuer. It is recently seeking development by rebranding to 'USDS' and expanding to multiple blockchains.

**FDUSD (First Digital USD)**

In March 2025, it faced a de-pegging crisis due to market rumors but recovered its value within 12 hours after the issuer promptly disclosed its reserve details. This is analyzed as a case that demonstrated the crisis management capabilities and the importance of transparency for centralized stablecoins.

## Future Outlook and Implications

Recently, 'RWA-backed stablecoins' issued with RWAs as collateral and 'yield-bearing stablecoins' are growing trends in the stablecoin market. RWA (Real-World Asset) tokens are real-world assets digitized through blockchain technology. This means ownership of assets we own and trade in reality—such as real estate, art, gold, bonds, and copyrights—is recorded on the blockchain in the form of tokens. Some predict that this type of stablecoin will account for 8-10% of the total market size by the end of 2025.

Furthermore, major banks like Société Générale, Santander, and Bank of America, as well as payment networks like Visa and Stripe, are expanding their stablecoin pilot programs. This shows that the integration of traditional financial systems and stablecoins is accelerating.

In South Korea, there is ongoing discussion about the need to institutionalize a Korean-style stablecoin. There are many opinions that establishing a regulatory framework is urgent, especially to address the continued rise in the KRW/USD exchange rate, the possibility of bypassing existing foreign exchange regulations, the protection of the private market (payment companies, banks, investors, altcoin issuers, etc.), and the creation of demand for government bonds.

However, it does not seem easy for a Korean-style KRW stablecoin to survive in the market. First, South Korea's fintech infrastructure is already highly advanced, making it difficult for a stablecoin to have a high competitive edge over the traditional financial system in the market, based simply on openness and trust. To overcome this, a 'hybrid stablecoin model' that combines gold-based RWA and foreign currency management capabilities is seen as promising for Korea.

What will be the relationship between Bitcoin, already called digital gold, and stablecoins? Some reports judge that if stablecoins become active, it will also affect the demand for Bitcoin in the short term. However, in the long term, Bitcoin is expected to strengthen its value as a 'strategic hedge and structural complementary asset' within the stablecoin system. This movement is a method already being used not only in the stablecoin market but also in the virtual asset market, so it seems like a realistic approach.