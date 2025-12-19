---
layout: post
title: "Building a Go Yahoo Finance Library with Claude Code #2"
description: "The second post covering the story of building a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
categories: dev
draft: false
lang: en
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Building a Go version of the yahoo finance library using Claude Code #1"
  "description": "The second post covering the story of building a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## Before implementing the practical level, let's test authentication bypass using CycleTLS.

As written in the [previous post 'Building a Go Yahoo Finance Library with Claude Code #1'](https://wnjoon.github.io/2025/12/17/go-yfinance-0/), the Go-based yfinance library proposed by Claude Code consists of three major phases.

```text
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

Since we implemented the MVP stage last time, I intended to request the implementation of the practical stage now. However, before that, I needed to confirm whether the bypass process in Yahoo Finance authentication using CycleTLS was working correctly. The sample code implemented in Phase 1 only queried a single ticker, Apple (AAPL). I felt it was necessary to test querying a larger volume to ensure stability.

So, I asked Gemini the following:


<br>

*👨🏻‍💻: To verify if calls to Yahoo Finance using CycleTLS are being successfully bypassed, what would be the minimum number of simultaneous ticker queries I should try?*

*🤖: ... Start with 10 concurrent requests and a total of 50 queries. If all succeed, increase the concurrency to 20 or 30 to find the threshold where 429 errors occur.*

<br>

Gemini suggested adjusting the number of concurrent requests to avoid situations where Yahoo Finance might consider the traffic as a DDoS attack or abnormal activity. It seemed to perceive the code I was writing as a single application.

Since my goal is to implement a library that can call Yahoo Finance in Go, I believed I only needed to implement the function of the tool itself correctly. In other words, avoiding errors from Yahoo Finance is a control issue for the application that uses this library, and I simply needed to implement the calling method correctly. I just needed to add the function to bypass calls to Yahoo Finance using CycleTLS.

So, I decided to slightly disregard Gemini's well-crafted advice and tried calling up to 110 tickers simultaneously using goroutines. I thought this would be enough to verify if the bypass was working normally through concurrent requests without overloading the system. The results were as follows. No errors occurred, and it operated at a fairly decent speed even on a local environment with modest performance (M3 Air, 16GB RAM).

```sh
[Parallel] Batch call completed in 3.332168875s for 110 symbols (avg: 30.292444ms per symbol)
```

As mentioned above, verifying how many requests trigger a 429 error from Yahoo Finance was not within my scope. Therefore, I did not perform further testing. However, in the future, it might not be a bad idea to verify this by calling 110 tickers multiple times with short time intervals.

## Establishing the Implementation Plan

The "Practical Level" category is detailed into three specific phases.

**Phase 2: Options (Option Data)**

- API Endpoint: `query2.finance.yahoo.com/v7/finance/options/{symbol}`
- Implementation Items
  - `Options()`: Option chain lookup (Call/Put)
  - `ExpirationDates()`: List of expiration dates
  - Option Model Structs: Call, Put, OptionChain
- Expected Methods
  - `t.Options()`: All option chains
  - `t.OptionsAtExpiry(date)`: Option chain for a specific expiration date
  - `t.ExpirationDates()`: List of expiration dates

**Phase 3: Financials (Financial Statements)**

- API Endpoint: `query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/{symbol}`
- Implementation Items
  - `IncomeStatement()`: Income Statement
  - `BalanceSheet()`: Balance Sheet
  - `CashFlow()`: Cash Flow Statement
  - Annual / Quarterly support
- Expected Methods
  - `t.IncomeStatement(annual bool)`
  - `t.BalanceSheet(annual bool)`
  - `t.CashFlow(annual bool)`
  - `t.Financials()`: All financial statements

**Phase 4: Analysis (Analysis Data)**

- API Endpoint: Uses analysis modules from QuoteSummary API
  - `recommendationTrend`, `earningsTrend`, `earningsHistory`, etc.
- Implementation Items
  - `Recommendations()`: Analyst recommendations
  - `PriceTargets()`: Price targets
  - `EarningsEstimate()`: Earnings estimates
  - `RevenueEstimate()`: Revenue estimates
  - `GrowthEstimates()`: Growth rate estimates
- Expected Methods
  - `t.Recommendations()`: Buy/Sell/Hold recommendations
  - `t.PriceTargets()`: Price targets (Current/Mean/High/Low)
  - `t.EarningsEstimate()`: EPS estimates
  - `t.RevenueEstimate()`: Revenue estimates
  - `t.EarningsDates()`: Earnings announcement dates

Since these phases do not have dependencies on each other, I requested development in sequential order.

1. **Phase 2 (Options):** Relatively simple with a single API endpoint.
2. **Phase 3 (Financials):** Parsing the Timeseries API is complex but it's a core feature.
3. **Phase 4 (Analysis):** Reusing Info code by extending the QuoteSummary module.

Also, when I requested the MVP development in the last post, I hadn't explicitly specified testing requirements. Consequently, Claude Code only wrote simple tests. This time, I requested thorough testing to ensure each function is implemented correctly.

<br>

*👨🏻‍💻: ... Please explicitly mark the progress in STATUS.md, and for each function, perform thorough testing to ensure the implementation is complete and accurate as you proceed.*

<br>

## TODO List

I asked Claude Code to carefully identify the list of items to implement for each Phase, group the functions by topic, write them in the TODO list in advance, and process/check them step by step. Below is the TODO list drafted and managed by Claude Code for each Phase.

**Phase 2: Options**

- Create phase2/options branch from main
- Implement Option models (option.go)
- Implement Options methods in ticker package
- Write unit tests for Options
- Test with live API data
- Merge to main and update STATUS.md

**Phase 3: Financials**

- Create phase3/financials branch from main
- Research Yahoo Finance Financials API structure
- Implement Financial models
- Implement Financials methods in ticker package
- Write unit tests for Financials
- Test with live API data
- Merge to main and update STATUS.md

## Implementation Results

### Phase 2: Options

**Implementation Details**

| Item | File | Description |
|---|---|---|
| Option Models | `pkg/models/option.go` | Option, OptionQuote, OptionChain structs |
| Options Methods | `pkg/ticker/options.go` | Options(), OptionChain(), Strikes(), etc. |
| Unit Tests | `pkg/ticker/options_test.go` | Cache and struct tests |

**Usage Example**

```go
t, _ := ticker.New("AAPL")
defer t.Close()

// List of expiration dates
expirations, _ := t.Options()

// Option chain (nearest expiration)
chain, _ := t.OptionChain("")

// Option chain for a specific date
chain, _ := t.OptionChain("2025-12-26")

// List of strike prices
strikes, _ := t.Strikes()
```

**Issues Encountered**

During development, the following issue occurred:

<br>

*🤖: The Underlying in `options.go` must now be of type `*models.OptionQuote`. Checking the code, it is already using `&result.Quote`, and since the `Quote` type has been changed to `OptionQuote`, it is automatically compatible. I need to update the test file and modify `cmd/test_options/main.go` as well.*

<br>

As features were added, a new type needed to be applied to parts where an existing type was used. Claude Code correctly identified this and made the necessary modifications.

- `pkg/models/option.go`: Added OptionQuote type
  - `OptionChain.Underlying` changed to `*OptionQuote` type
  - `OptionChainResponse.Quote` also changed to `OptionQuote` type
- `pkg/ticker/options.go`: Automatic compatibility
  - No changes needed as `&result.Quote` returns `*models.OptionQuote`
- `cmd/test_options/main.go`: Deleted as it was a temporary file after testing

**Live Test Results**

- Underlying Price: $271.84
- Calls: 99
- Puts: 91

### Phase 3: Financials

**Newly Added Files**

- `pkg/models/financials.go`: Financials data models
- `pkg/ticker/financials.go`: Financials API methods
- `pkg/ticker/financials_test.go`: Unit tests

**Modified Files**

- `internal/endpoints/endpoints.go`: Added Financials key constants
- `pkg/ticker/ticker.go`: Added financialsCache field

**Implemented API Methods**

| Method | Description |
|---|---|
| `IncomeStatement(freq)` | Income Statement (annual/quarterly) |
| `BalanceSheet(freq)` | Balance Sheet (annual/quarterly) |
| `CashFlow(freq)` | Cash Flow (annual/quarterly) |
| `FinancialsJSON()` | Raw JSON for debugging |

**Live Test Results (AAPL)**

- Income Statement: 5 periods, 26 fields
- Total Revenue: $416.16B
- Net Income: $112.01B
- Diluted EPS: $7.46
- Balance Sheet: 4 periods, 34 fields
- Total Assets: $359.24B
- Total Debt: $98.66B
- Cash Flow: 5 periods, 38 fields
- Operating Cash Flow: $111.48B
- Free Cash Flow: $98.77B

### Phase 4: Analysis

**Newly Added Files**

- `pkg/models/analysis.go`: Analysis data models (116 lines)
- `pkg/ticker/analysis.go`: Analysis API methods (664 lines)
- `pkg/ticker/analysis_test.go`: Unit tests (196 lines)

**Modified Files**

- `pkg/ticker/ticker.go`: Added analysisCache field

**Implemented API Methods**

| Method | Description | Source Module |
|---|---|---|
| `Recommendations()` | Analyst recommendations | recommendationTrend |
| `PriceTarget()` | Price targets | financialData |
| `EarningsEstimates()` | Earnings estimates | earningsTrend |
| `RevenueEstimates()` | Revenue estimates | earningsTrend |
| `EPSTrend()` | EPS trend | earningsTrend |
| `EPSRevisions()` | EPS revisions | earningsTrend |
| `EarningsHistory()` | Earnings history | earningsHistory |
| `GrowthEstimates()` | Growth estimates | industryTrend, sectorTrend, indexTrend |

**Live Test Results (AAPL)**

- Recommendations: 4 periods (StrongBuy=5, Buy=24, Hold=15, Sell=1, StrongSell=3)
- Price Targets: Current=$272.19, Mean=$287.71, High=$350, Low=$215
- Earnings Estimates: 4 periods (0q, +1q, 0y, +1y)
- Revenue Estimates: 4 periods with growth rates
- Earnings History: 4 quarters with surprise %

**Changes vs Plan**

Original Plan

- Analyst Recommendations ✅
- Price Targets ✅
- Earnings Estimates ✅
- Revenue Estimates ✅
- EPS Trend/Revisions ✅
- Growth Estimates ✅

Additional Implementations

- `EarningsHistory()`: Provides actual results vs past estimates (surprise %)
- Caching System: Fetches `earningsTrend` data once and reuses it across multiple methods

Structural Changes

- Initially expected to use separate API endpoints, but implemented by combining multiple modules of the `quoteSummary` API.
- Unified function name `getFloat` → `getFloat64` (to avoid conflict with `info.go`).

## Intermediate Verification with yfinance

I asked Claude Code to verify if all the phases developed so far are implemented identically to the features and methods provided by the existing Python-based yfinance.

<br>

*👨🏻‍💻: Please double-check thoroughly that all Phases implemented so far accurately replicate all features provided by the existing Python-based yfinance. ultrathink. You may proceed with tests if necessary.*

<br>

### Verification Plan

This is the TODO list set up by Claude Code. It plans to test each Phase, run Go Tests, and finally analyze any discrepancies.

- Compare Phase 0 (Foundation): HTTP Client, Auth, Errors, Config
- Compare Phase 1 (Core Data): Quote, History, Info
- Compare Phase 2 (Options): Options chain and expiration
- Compare Phase 3 (Financials): Income, Balance, CashFlow
- Compare Phase 4 (Analysis): Recommendations, Price Targets, Estimates
- Run Go tests to verify all implementations
- Report findings and identify any gaps

### Verification Results

**Phase 0: Foundation** (Completed)

| Python yfinance | Go Implementation | Status |
|---|---|---|
| curl_cffi TLS fingerprint | CycleTLS (Chrome JA3) | ✅ |
| Cookie/Crumb auth | AuthManager (Basic + CSRF) | ✅ |
| Proxy settings | Config.SetProxy() | ✅ |
| Timeout settings | Config.SetTimeout() | ✅ |
| Error handling | YFError with codes | ✅ |

**Phase 1: Core Data** (Completed)

| Python Method | Go Method | Status |
|---|---|---|
| `ticker.info` | `Info()` | ✅ |
| `ticker.fast_info` | `FastInfo()` | ✅ |
| `ticker.history()` | `History()` | ✅ |
| `ticker.dividends` | `Dividends()` | ✅ |
| `ticker.splits` | `Splits()` | ✅ |
| `ticker.actions` | `Actions()` | ✅ |
| `Quote data` | `Quote()` | ✅ |
| `History metadata` | `GetHistoryMetadata()` | ✅ |

**Phase 2: Options** (Completed)

| Python Method | Go Method | Status |
|---|---|---|
| `ticker.options` | `Options()` | ✅ |
| `ticker.option_chain()` | `OptionChain()` | ✅ |
| Expiration dates | `OptionChainAtExpiry()` | ✅ |
| Strike prices | `Strikes()` | ✅ |

**Phase 3: Financials** (Completed)

| Python Method | Go Method | Status |
|---|---|---|
| `ticker.income_stmt` | `IncomeStatement("annual")` | ✅ |
| `ticker.quarterly_income_stmt` | `IncomeStatement("quarterly")` | ✅ |
| `ticker.balance_sheet` | `BalanceSheet("annual")` | ✅ |
| `ticker.quarterly_balance_sheet` | `BalanceSheet("quarterly")` | ✅ |
| `ticker.cash_flow` | `CashFlow("annual")` | ✅ |
| `ticker.quarterly_cash_flow` | `CashFlow("quarterly")` | ✅ |

- Note: Python's `ttm_income_stmt` and `ttm_cash_flow` (trailing 12 months) are supported in Go via the `freq="trailing"` parameter.

**Phase 4: Analysis** (Completed)

| Python Method | Go Method | Status |
|---|---|---|
| `ticker.recommendations` | `Recommendations()` | ✅ |
| `ticker.analyst_price_targets` | `PriceTarget()` | ✅ |
| `ticker.earnings_estimate` | `EarningsEstimates()` | ✅ |
| `ticker.revenue_estimate` | `RevenueEstimates()` | ✅ |
| `ticker.eps_trend` | `EPSTrend()` | ✅ |
| `ticker.eps_revisions` | `EPSRevisions()` | ✅ |
| `ticker.earnings_history` | `EarningsHistory()` | ✅ |
| `ticker.growth_estimates` | `GrowthEstimates()` | ✅ |

**Unimplemented Features (Scheduled for Phase 5 and beyond)**

| Python Feature | Phase |
|---|---|
| major_holders | Phase 5 |
| institutional_holders | Phase 5 |
| mutualfund_holders | Phase 5 |
| insider_transactions | Phase 5 |
| insider_purchases | Phase 5 |
| insider_roster_holders | Phase 5 |
| calendar | Phase 5 |
| sustainability | Phase 9 |
| isin | Phase 9 |
| news | Phase 9 |
| earnings_dates | Phase 9 |
| upgrades_downgrades | Expandable in Phase 4 |
| sec_filings | Phase 9 |
| shares / shares_full | Phase 5 |
| capital_gains | Expandable in Phase 1 |
| funds_data | Phase 9 |
| live() WebSocket | Phase 8 |

### Evaluation

- All core features (Quote, History, Options, Financials, Analysis) are perfectly implemented.
- Uses the same API endpoints as Python.
- Caching strategy applied consistently.
- Appropriate error handling and type safety.
- All 38 unit tests passed.

### Areas for Improvement

- **upgrades_downgrades:** Fetched from `_quote` data in Python's `quote.py` → Can be added to Phase 4.
- **capital_gains:** Data already being received in History API, can add a separate method.
- **TTM (Trailing Twelve Months) Financials:** Currently supported via `freq="trailing"`.