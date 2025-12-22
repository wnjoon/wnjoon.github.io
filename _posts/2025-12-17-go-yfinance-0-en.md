---
layout: post
title: "Building a Go Yahoo Finance Library with Claude Code #1"
description: "The first post in a series about building a Go version of the Yahoo Finance library based on Python's yfinance, utilizing Claude Code."
categories: [dev, go-yfinance]
draft: false
lang: en
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Building a Go Yahoo Finance Library with Claude Code #1"
  "description": "The first post in a series about building a Go version of the Yahoo Finance library based on Python's yfinance, utilizing Claude Code."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## Is there no Yahoo Finance library for Go?

I recently became interested in building AI agents and have been diligently taking a [course](https://nomadcoders.co/ai-agents-masterclass?gad_source=1&gad_campaignid=18141167485&gbraid=0AAAAACQEcGgB28vYn3MvB7rhLJ-guDeaI&gclid=Cj0KCQiA6Y7KBhCkARIsAOxhqtM01uDU_sqgVSqN3XMhxFpk9dDyzL1A6kZ0a1GY_Y7gsTcbOAwz8gIaAtf1EALw_wcB) on the subject. While the lectures are incredibly useful and fun, there is one downside. I primarily use the Go language (check out my [GopherCon Korea review](https://wnjoon.github.io/2025/11/12/gophercon-korea/)), but most AI-related courses utilize Python to build agents. This is likely because most agents only support Python, or occasionally Javascript-based stacks.

The most representative frameworks that officially support Go are the Google ADK and Genkit. In the course I'm taking, we are building projects using various AI agent frameworks ranging from Crew AI to LangGraph. Fortunately, the Google ADK was included in the curriculum. I decided to take this opportunity to use Go to call the Google ADK, applying the prompts and concepts provided in the lectures.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/837169e2-2211-4efc-b944-8f82dcc51568/image.png)

*As seen in my [comment on Golang Korea](https://discord.com/channels/1250370848343195669/1250370848859230301/1439830901805682779), I personally find it regrettable that AI agent development is still predominantly centered around Python. From reading prompts to processing LLM data and generating results, the workload is bound to get heavier over time. I believe Go would offer not only much better performance but also the stability of a compiled language for AI agent development.*

<br>

So, I started developing my first AI agent using the Google ADK, an "Investment Strategy Agent," in Go. However, I hit a major roadblock right from the start. The most critical component of this project, a "Yahoo Finance Library," did not exist for Go. In fact, even the Python library used ([yfinance](https://github.com/ranaroussi/yfinance)) is not officially supported by Yahoo Finance.

I would have been happy if there were a simple Curl or Websocket invocation method provided, but I was slightly taken aback to find none. There were a few Go libraries developed by individuals ([joetats/goFinance](https://github.com/joetats/goFinance), [svarlamov/goyhfin](https://github.com/svarlamov/goyhfin), [oscarli916/yahoo-finance-api](https://github.com/oscarli916/yahoo-finance-api)), but their scope was significantly lacking compared to the Python-based library. To make matters worse, none of them had received any updates for at least several months.

## Can we convert Python's yfinance directly to Go?

So, I had a bold idea: **"It would be great if I could create a library that ports the functionality of the well-implemented yfinance directly to Go."** Not knowing if it was actually feasible, I asked **Claude Code** to analyze the entire `yfinance` repository and determine if it could be converted to Go.

I used the `opus-4.5` model.

![image](https://velog.velcdn.com/images/wnjoon/post/e64c717c-fa23-498f-9743-af84ac0268d3/image.png)

After a lengthy investigation, it gave me a quite long and sophisticated result. The summary is as follows:

| Question | Answer |
|---|---|
| Is Go conversion possible? | ✅ Yes |
| Is it feasible with Claude Code? | ⚠️ Feasible, except for TLS spoofing |
| Overall Difficulty | Medium-High |
| Key Technical Risk | TLS Fingerprint Spoofing |
| Recommendation | Proceed after verifying TLS spoofing with a PoC |

### Yahoo Finance Authentication Mechanism

According to Claude Code's analysis, the Cookie/Crumb authentication system of Yahoo Finance works as follows:

```
Cookie/Crumb Authentication System

[Strategy 1: Basic]

1. GET https://fc.yahoo.com → Obtain A3 Cookie
2. GET https://query1.finance.yahoo.com/v1/test/getcrumb → Obtain crumb token
3. Add ?crumb={crumb} parameter to all requests

[Strategy 2: CSRF] (Fallback if Basic fails)

1. GET https://guce.yahoo.com/consent → Extract CSRF token
2. POST https://consent.yahoo.com/v2/collectConsent
3. GET https://guce.yahoo.com/copyConsent
4. GET https://query2.finance.yahoo.com/v1/test/getcrumb
```

Yahoo Finance blocks connections from standard HTTP clients during this authentication process. To bypass this, `yfinance` sends requests disguised as a Chrome browser. In Python, using the [curl_cffi](https://github.com/lexiforest/curl_cffi) library allows changing the TLS fingerprint to match Chrome's.

For Go, I decided to use [CycleTLS](https://github.com/Danny-Dasilva/CycleTLS) to perform these operations. Another similar library is [utls](https://github.com/refraction-networking/utls), which is commonly used. However, I chose CycleTLS because it is relatively easier to configure and allows for direct specification of JA3 fingerprints, which I thought would be more convenient for maintenance and implementation.

## Overall Analysis and Planning

I requested Claude to structure the project into phases—starting from basic configuration like connection and authentication with Yahoo Finance, to basic operations, and finally to the advanced features provided by `yfinance`—and to document them. This was intended both to share progress between sessions and to allow me to double-check the overall plan.

The [DESIGN.md](https://github.com/wnjoon/go-yfinance/blob/backup/claude-docs/DESIGN.md) document written by Claude Code can be summarized as follows:

- **yfinance Library Analysis Results**
  - List of provided API Endpoints
  - Authentication methods (Cookie/Crumb)
- **Go Project Structure**
- **Design Principles**
- **Development Roadmap**
  - Divided into a total of 10 phases

For the roadmap, it provided the priority for each phase and an estimated amount of code. Detailed information for each phase is available in the [DESIGN.md](https://github.com/wnjoon/go-yfinance/blob/backup/claude-docs/DESIGN.md) file.

| Phase | Name | Priority | Est. Code Size | Cumulative |
| --- | --- | --- | --- | --- |
| 0 | Foundation | 🔴 Essential | ~500 lines | 500 lines |
| 1 | Core Data | 🔴 Essential | ~600 lines | 1,100 lines |
| 2 | Options | 🟡 Recommended | ~300 lines | 1,400 lines |
| 3 | Financials | 🟡 Recommended | ~500 lines | 1,900 lines |
| 4 | Analysis | 🟡 Recommended | ~400 lines | 2,300 lines |
| 5 | Holdings | 🟢 Optional | ~500 lines | 2,800 lines |
| 6 | Search | 🟢 Optional | ~400 lines | 3,200 lines |
| 7 | Multi-ticker | 🟢 Optional | ~300 lines | 3,500 lines |
| 8 | Real-time | 🔵 Advanced | ~400 lines | 3,900 lines |
| 9 | Advanced | 🔵 Advanced | ~600 lines | 4,500 lines |

Based on this, it recommended grouping the development into three main stages:

```
MVP (Minimum Viable Product)
- Phase 0 + Phase 1 = ~1,100 lines
- Basic price lookup available

Practical Level
- Phase 0~4 = ~2,300 lines
- Most investment analysis available

Python yfinance Parity
- Phase 0~7 = ~3,500 lines
- Almost all features available
```
## Always separate branches by phase and feature

When I previously delegated development tasks to Claude Code, we planned together and I performed HITL (Human In The Loop), but I missed one thing. Claude Code does not create branches by default. I should have specified this when defining requirements or establishing development policies from the start. Because I hadn't considered this properly before, everything was either pushed to `main` at once, or even if commits were separated, they were all on `main`. This made it quite difficult to revert the repository or version the source at specific points later on.

So this time, I made sure to request—**fortunately, I thought of this before development started**—that we configure branches for every development process, split detailed branches by feature, commit at each step, and merge into the parent branch only when a stage is complete.

![image](https://velog.velcdn.com/images/wnjoon/post/c81cfba0-0538-46ce-a017-76c15fb59263/image.png)

## Current Progress

**👉 Repository: [wnjoon/go-yfinance](https://github.com/wnjoon/go-yfinance)**

As of writing this post, I have completed the development of Phase 0 and Phase 1. The [README.md](https://github.com/wnjoon/go-yfinance/blob/main/README.md) includes examples you can actually test. If you run [cmd/example/main.go](https://github.com/wnjoon/go-yfinance/blob/main/cmd/example/main.go), you can see the results below. Some missing content will be updated as additional features are developed in the future.

```sh
=== go-yfinance Example: AAPL ===

1. Current Quote
----------------
Symbol: AAPL (Apple Inc.)
Price: $271.84
Change: -2.77 (-1.01%)
Day Range: $271.69 - $276.16
52 Week Range: $169.21 - $288.62
Volume: 49406521
Market Cap: $4034211348480
PE Ratio: 36.49
Market State: PREPRE

2. Historical Data (Last 10 Days)
----------------------------------
Date               Open       High        Low      Close       Volume
2025-12-04       284.10     284.73     278.59     280.70     43989100
2025-12-05       280.54     281.14     278.05     278.78     47265800
2025-12-08       278.13     279.67     276.15     277.89     38211800
2025-12-09       278.16     280.03     276.92     277.18     32193300
2025-12-10       277.75     279.75     276.44     278.78     33038300
2025-12-11       279.10     279.59     273.81     278.03     33248000
2025-12-12       277.90     279.22     276.82     278.28     39532900
2025-12-15       280.15     280.15     272.84     274.11     50409100
2025-12-16       272.82     275.50     271.79     274.61     37648600
2025-12-17       275.01     276.16     271.64     271.84     50100600

3. Company Info
---------------
Name: Apple Inc.
Sector: Technology
Industry: Consumer Electronics
Country: United States
Employees: 166000
Website: [https://www.apple.com](https://www.apple.com)

Key Statistics:
  Market Cap: $4034211348480
  Enterprise Value: $4074483744768
  Trailing PE: 36.49
  Forward PE: 29.80
  PEG Ratio: 0.00
  Price to Book: 54.47
  Revenue: $416161005568
  Profit Margins: 26.92%
  Recommendation: buy (2.00)

4. Recent Dividends
-------------------
No dividend history

5. Stock Splits
---------------
No split history

=== Example Complete ===
```

## Side Note

I started out taking a course on developing AI Agents, and suddenly I'm building a new library... I’ve gone completely off on a tangent 😅