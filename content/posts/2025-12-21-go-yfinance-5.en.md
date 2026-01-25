---
title: "Building a Go Yahoo Finance Library with Claude Code #5"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-12-21"
slug: "go-yfinance-5"
summary: "The fifth post in a series about building a Go version of the Yahoo Finance library based on Python's yfinance, utilizing Claude Code."
description: "The fifth post in a series about building a Go version of the Yahoo Finance library based on Python's yfinance, utilizing Claude Code."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "ai", "claude code", "go", "go-yfinance", "2025"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/12/20/go-yfinance-4-en/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Checking the Remaining Development Scope

According to the analysis using Claude Code and Gemini, the scope covered so far (~Phase 4) means that all practically usable features have been implemented. The remaining part is to implement the rest of the features provided by yfinance.

There are approximately 5 additional Phases left, and I first organized what work would be done in each stage.

### Phase 5: Holdings & Actions (Difficulty: ★★☆☆☆)

Expected to be low difficulty as it utilizes the existing quoteSummary API pattern.

| Method | Description |
|---|---|
| `MajorHolders()` | Analysis of major holder ratios |
| `InstitutionalHolders()` | List of institutional holders |
| `MutualFundHolders()` | List of mutual fund holders |
| `InsiderTransactions()` | Insider transaction history |
| `InsiderRoster()` | List of insiders |
| `Calendar()` | Dividend dates, earnings announcement dates, etc. |

### Phase 6: Search & Lookup (Difficulty: ★★☆☆☆)

Can be implemented independently as a new package, and various support types (equity, mutualfund, etf, index, future, currency, cryptocurrency) were already implemented.

| Feature | API Endpoint |
|---|---|
| Search | /v1/finance/search |
| Lookup | /v1/finance/lookup |

### Phase 7: Multi-ticker & Batch (Difficulty: ★★★☆☆)

This part requires parallel processing using Go's goroutines.

### Phase 8: Real-time WebSocket (Difficulty: ★★★★☆)

Expected to be the most complex stage, requiring WebSocket + Protobuf decoding.

- Endpoint: `wss://streamer.finance.yahoo.com/?version=2`
- Message Format: Base64 encoded Protobuf
- Streaming real-time prices, volume, quotes, etc.

### Phase 9: Advanced Features (Difficulty: ★★★☆☆)

Additional features to be implemented incrementally. These seemed to be of the lowest priority.

| Feature | Description |
|---|---|
| Caching | Memory/File cache (SQLite) |
| Price Repair | Correction for 100x exchange rate errors, unreflected splits |
| Timezone | Timezone handling per exchange |
| Market Calendar | Management of market holidays and half-days |
| News | News feed per ticker |

## Implementing Holdings & Actions

I established the implementation plan as follows and requested the work in the same manner as before.

- Create phase5/holdings branch from main
- Implement holder models (pkg/models/holders.go)
- Implement calendar model (pkg/models/calendar.go)
- Implement holders methods (pkg/ticker/holders.go)
- Implement calendar method (pkg/ticker/calendar.go)
- Write tests for holders and calendar
- Update documentation (doc.go files)
- Merge to main and update STATUS.md

Everything went well, but there was one log in the middle that made me feel uneasy.

<br>

*🤖: There is an issue with documentation generation, but since CI/CD is set up, it will be automatically generated upon push. Marking Phase 5 work as complete..."*

<br>

## Inconsistencies with yfinance Still Exist

The comment about the documentation generation issue made me wonder if there were other incorrect parts that Claude Code hadn't mentioned. The biggest concern was the inconsistency with the yfinance library's methods. I had already checked this in the [previous post](https://wnjoon.github.io/go-yfinance-4/), but I couldn't guarantee that this issue wouldn't occur again in future tasks.

In fact, such common development requirements should be written in a separate document and configured to be referenced at every development stage. I was working continuously in a single session, and I was curious about how much context Claude Code would retain. Honestly speaking, it was partly my fault for just letting it develop out of laziness 😅.

<br>

*👨🏻‍💻: Check if the contents written in Phase 5 match the format (input, output, function name, etc.) of the corresponding methods in yfinance (Python). Please check this part every time you work on the next Phase from now on. Of course, you can ignore parts that are inevitably different due to language characteristics.*

<br>

| Python | go-yfinance Status | Note |
|---|---|---|
| `major_holders` | `MajorHolders()` | ✅ OK (Language convention difference) |
| `institutional_holders` | `InstitutionalHolders()` | ✅ OK |
| `mutualfund_holders` | `MutualFundHolders()` | ✅ OK |
| `insider_purchases` | `InsiderPurchases()` | ✅ OK |
| `insider_transactions` | `InsiderTransactions()` | ✅ OK |
| `insider_roster_holders` | `InsiderRoster()` | ⚠️ Fix Needed |
| `calendar` | `Calendar()` | ✅ OK |

There was a part that needed correction (`InsiderRoster()` → `InsiderRosterHolders()`). Since I didn't explicitly request to keep the yfinance function names exactly, this resulted in unnecessary extra work. I decided I must explicitly state this in future stages.

## Changing the Documentation Generation Strategy

Returning to the original issue, although documentation would be generated by GitHub Actions, the phrase about completing the task despite generation issues felt a bit unsettling. This was because I couldn't verify if the documentation was generated correctly during the development stage.

<br>

*👨🏻‍💻: You mentioned there was a problem with documentation generation. Please check if this part was generated correctly automatically.*

<br>

The analysis result was as expected: *Since the current local commits have not been pushed to remote yet, and CI/CD generates `docs/API.md` automatically when pushed to main, it is difficult to verify at this moment.*

In the [previous post](https://wnjoon.github.io/go-yfinance-4/), I defined the documentation generation point using `gomarkdoc` in GitHub Actions so that it would be automatically generated whenever pushed to main. However, proceeding with this revealed some issues. First, by delegating documentation authority to GitHub, I had to pull from main again to verify if the documentation was generated properly.

<br>

*👨🏻‍💻: Come to think of it, if I generate documentation via GitHub Actions, it seems difficult to verify if the document was generated correctly. How about generating and verifying all documents locally and not performing this action in GitHub Actions instead?*

<br>

Through the conversation with Claude Code, we decided to change the documentation generation method as follows:

- **GitHub Actions:** Remove documentation generation (Keep build/test only)
- **pre-commit hook:** Do not use
- **Makefile:** Add `make docs` command
- **Manual Execution:** Run `make docs` upon Phase completion and then commit

In the end, I decided to return to the generally used method rather than automation.