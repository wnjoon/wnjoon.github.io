---
layout: post
title:  "Personal Thoughts on Stablecoins"
description: "As a blockchain developer who has worked on CBDC and security tokens, I've organized my personal thoughts on stablecoins."
categories: crypto
lang: en
draft: false
keywords: CBDC, Security Tokens, Stablecoin, Blockchain, RWA, KRW Stablecoin
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Personal Thoughts on Stablecoins"
  "description": "Based on my experience developing the CBDC pilot and a Security Token (STO) platform, this article contains personal reflections on whether stablecoins are really necessary for general users in Korea, and what the true value of blockchain technology is."
  "keywords": "Stablecoin, Blockchain, CBDC, Security Token, STO, RWA, KRW Stablecoin, Developer, Financial Innovation"
  "url": "https://brunch.co.kr/@wallee/23"
  "mainEntity": 
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "What are the fundamental difficulties in introducing blockchain to the existing financial system?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "The difficulty begins with the conflict between blockchain's core feature of 'transparency' and currency's 'anonymity,' or the contradiction of wanting 'decentralization' while trying to maintain existing centralized operational methods. The biggest problem is the dilemma of wanting to adopt the technology but being unable to abandon familiar existing methods."
      - "@type": "Question"
        "name": "Why are you skeptical about the utility of a 'KRW Stablecoin' for domestic users?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "From a user's perspective, it's difficult to feel an essential difference between a KRW stablecoin and Naver Pay or Kakao Pay. It could even be more inconvenient and expensive due to separate wallet management or the fees (gas fees) incurred when using a public blockchain. Since Korea's current financial system is already very fast and cheap, I believe it's difficult for a stablecoin to offer clear convenience or financial advantages to users."
      - "@type": "Question"
        "name": "Then, what do you think are the conditions for blockchain technology and stablecoins to have true value?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "The true value of blockchain lies not in a closed (private) system for domestic use, but in 'openness' and 'connectivity' that allows users worldwide to freely share data and trade assets across borders. A KRW stablecoin, like USDT, must also secure global liquidity on a public blockchain to function as a meaningful asset beyond just a simple payment method."
---

This is a post containing my personal thoughts. If there are any shortcomings or incorrect information, please feel free to leave a comment at any time.

In 2020, I participated in the first phase of the CBDC pilot research at the Bank of Korea, which led me to deeply contemplate the gap between the potential of blockchain technology and reality for the first time. At that time, the main objectives of CBDC included 1) the digital transformation of physical currency and 2) the reduction of currency issuance and management costs through this transformation. However, when we tried to implement CBDC based on blockchain, we hit an unexpected obstacle. It was the problem where blockchain's characteristic of 'transparency' conflicted with the 'anonymity' that currency must inherently possess.

When we buy things with cash, 'who, where, and how much was spent' is not revealed to anyone other than the parties involved. But the moment you apply blockchain, where all transaction records remain on a ledger, a dilemma arises: all details could be transparently disclosed.

Later, I faced similar difficulties when building a Security Token Offering (STO) platform. Looking back, all the difficulties began with the contradictory desire to 'apply blockchain, but keep the current system's methods exactly as they are.' There were many challenges, such as regulations requiring the separation of STO issuance and distribution, and demands to selectively disclose data recorded on the blockchain.

This is a perhaps natural growing pain that we always face when trying to graft blockchain onto the current centralized system, often called Web2. It's the moment when even the developers themselves start to get confused about what the right answer is. In many cases, the misunderstanding begins with the client company perceiving 'blockchain = a decentralized database.'

(As an aside, because early blockchain lectures emphasized that 'data on the blockchain can never be tampered with,' many people misunderstood this as 'data entered on the blockchain can never be changed.' While many people's knowledge level has increased since then, to be precise, the core concept is that because the entire 'history of changes' to the data remains, 'data from a specific point in the past cannot be arbitrarily manipulated from the present.')

The company I worked for was the first among domestic securities firms to create an STO platform. Of course, it was at a Proof of Concept (PoC) level, but it was linked with the actual securities firm's application and was at a level where it could be operated, just without any products. However, under the judgment that it was 'a system that doesn't guarantee immediate profits,' the platform was sent straight to the warehouse after a report to the C-level. Honestly, even from the developer's standpoint, I could fully understand the company's decision. At that time, it wasn't just us; numerous companies were struggling to incorporate items already being reviewed in the market—such as art, real estate, and music rights—into STOs. In a way, it was the beginning of RWA (Real-World Asset tokenization).

However, I personally had a great sense of regret. What I really wanted to do was to create 'a platform that puts overseas unlisted stocks on the blockchain, tokenizes them, and allows investors worldwide to trade them.' I believed that to maximize the benefits of blockchain, while sharing various domestic data is meaningful, it should be possible to share data and trade assets across borders with the entire world.

Of course, this might have been the naive dream of a developer who didn't fully understand the complex legal regulations of the securities domain. However, seeing recent news articles about movements to trade tokenized stocks from the US in Korea, I received a small consolation thinking that my idea wasn't entirely absurd.

Based on these experiences, I would like to share my honest thoughts on 'stablecoins,' which have become a hot topic recently.

Honestly, I'm still not sure why so many people talk about the importance of stablecoins. As I understand it, stablecoins started from the idea of 'pegging their value to a real-world asset, like fiat currency, to stabilize the extreme price volatility of cryptocurrencies on the blockchain.' To do this, the stablecoin issuer must hold reserves of real-world assets corresponding to the value of the coins they hold, and these reserves are mostly filled with government bonds of that fiat currency's country.

So, who welcomes stablecoin issuance the most? Ironically, it could be the government. This is because stablecoin issuers buy up large quantities of bonds issued by the government to finance its operations. This relationship becomes even clearer when you look at the recent European crypto-asset regulation bill, MiCA, which mandates that stablecoin issuers hold capital reserves above a certain level. (For reference, Tether (USDT), the world's largest dollar stablecoin, did not meet this regulation.)

So, what advantages do stablecoins bring to regular users like us? There are many articles claiming that 'Korea's financial market can develop only if a KRW stablecoin is issued,' but I find it difficult to agree. Using a KRW stablecoin issued in Korea domestically is essentially the same as converting Naver Pay or Kakao Pay points into a coin, recording it on the blockchain, and then using it. From the user's perspective, it's hard to feel the difference.

For a user to feel the utility of a stablecoin, they must either gain a financial benefit from using it or feel a definite convenience greater than what currently exists. First, 'convenience' might not get better and could even become more inconvenient. This is because it might require a separate authentication process for a blockchain wallet, in addition to the existing simple authentication systems. Even if the issuer links the existing user account with the wallet, that, at best, only maintains 'the same level of convenience.'

What about 'financial benefit'? Something I've felt while experiencing various government and corporate blockchain projects is that Korea uniquely prefers private, or closed, blockchains. They are extremely reluctant to disclose customer data they worked hard to gather, rather than pursuing the mutual value gained from sharing data. Especially due to regulations that force most financial companies to develop and operate systems only in a closed-network environment since past hacking incidents in the financial sector, it is very difficult in reality to utilize a public blockchain.

In the end, if a stablecoin emerges in Korea, it's highly likely to be either created independently by individual companies or in a consortium form where several companies gather, much like STOs a few years ago. Either way, it will likely be a private blockchain, which ultimately boils down to the not-so-innovative question: 'We are providing the same service, so should we store the data in a traditional database, or on a blockchain?'

For a KRW stablecoin to have true competitiveness, it must ultimately be issued and circulated on a public blockchain that crosses borders. The story changes if an era comes where foreign users can freely trade and hold KRW stablecoins, just as we invest in the dollar through USDT and USDC. But if that's not the picture, it's highly likely to become their own league where, as mentioned earlier, 'the stablecoin issuer buys domestic bonds, and the government's operational funds increase.'

For example, let's assume we create a KRW stablecoin using the most popular ERC-20 standard and put it on the Ethereum network. The moment it goes on a public blockchain, we have to face the very real problem of 'fees (gas fees).' We might even realize just how fast and cheap our current financial system was—a service of incredible value. Sometimes, user-friendly UI/UX is spoken of as if it's a benefit of blockchain, but this has nothing to do with blockchain technology itself. As we can see from the case of 'Toss,' the best user experience can be fully implemented on top of the current financial system.

Of course, there is still more that I don't know than I do, so perhaps if I dig deeper, I might discover the innovative advantages that stablecoins can bring. I still buy USDT as a way to invest in the dollar. I've heard that overseas, people link USDT or USDC to physical cards and use them like real money, but at least in my everyday environment, I don't yet see any clear advantages that stablecoins will bring. Unless they offer overwhelmingly lower fees and greater convenience than using a credit card abroad, won't they just end up as just another payment method?