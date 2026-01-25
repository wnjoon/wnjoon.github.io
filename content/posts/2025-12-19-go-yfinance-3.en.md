---
title: "Building a Go Yahoo Finance Library with Claude Code #3"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-12-19"
slug: "go-yfinance-3"
summary: "The third post in a series about building a Go version of the Yahoo Finance library based on Python's yfinance, utilizing Claude Code."
description: "The third post in a series about building a Go version of the Yahoo Finance library based on Python's yfinance, utilizing Claude Code."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "ai", "claude code", "go", "go-yfinance", "2025"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/12/19/go-yfinance-2-en/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Does it match yfinance?

The reason I'm implementing go-yfinance is simply that there isn't a Yahoo Finance library written in Go. It might seem primitive, but until recently, there were cases where a server was implemented using the Python yfinance library just to receive results via API calls. Of course, even back then, it would have been possible to create a library converted to Go. However, analyzing and implementing it one by one would have taken quite a long time.

Now, with AI, work that would have taken months can be done in days. The go-yfinance project I'm currently working on is no exception. I'm training Claude Code with the already excellent yfinance library, checking if it can be converted to Go, and proceeding step by step.

Today, I guided it to implement 'up to a practical level (~Phase 4)' and wrote a [blog post](https://wnjoon.github.io/go-yfinance-2/) about it. But suddenly, a question arose.

<br>

*👨🏻‍💻: Do the methods, parameters, and return values provided by go-yfinance match those supported by yfinance?*

<br>

This was actually a quite crucial part. My goal is **to allow developers familiar with yfinance to use functions in the same way even when using Go**. I believed there should be no hassle of having to relearn what methods exist, how to call them, or what the results would look like when calling a method.

So, before implementing the remaining Phases, I asked Claude Code.

<br>

*👨🏻‍💻: Please verify if the structure of methods, parameters, and result values provided by the currently written go-yfinance is identical to those provided by python's yfinance. To minimize user confusion, everything should be the same except for the language difference. Please review if everything is identical, excluding only case sensitivity due to Public/Private method differences which are characteristics of the language. ultrathink.*

<br>

## Analysis Results: Python yfinance vs. Go go-yfinance

Fortunately, most parts were confirmed to match, but there were some discrepancies.

### Method Name Mismatches

| Feature | Python yfinance | Go go-yfinance | Recommended Fix |
|---|---|---|---|
| History | `ticker.history(...)` | `ticker.History(params)` | ✅ OK (Case difference only) |
| Financials (income) | `ticker.income_stmt / get_income_stmt(freq="quarterly")` | `ticker.IncomeStatement(freq)` | ⚠️ Python uses income_stmt |
| Financials (balance) | `ticker.balance_sheet / get_balance_sheet()` | `ticker.BalanceSheet(freq)` | ⚠️ Python uses balance_sheet |
| Financials (cashflow) | `ticker.cash_flow / get_cash_flow()` | `ticker.CashFlow(freq)` | ⚠️ Python uses cash_flow |
| Options list | `ticker.options (property, tuple)` | `ticker.Options() (method, []time.Time)` | ⚠️ Python uses property |
| Option chain | `ticker.option_chain(date)` | `ticker.OptionChain(date)` | ✅ OK |
| Price target | `ticker.analyst_price_targets` | `ticker.PriceTarget()` | ⚠️ Name mismatch |
| Recommendations | `ticker.recommendations` | `ticker.Recommendations()` | ✅ OK |
| EPS Trend | `ticker.eps_trend` | `ticker.EPSTrend()` | ⚠️ Underscore vs CamelCase |
| EPS Revisions | `ticker.eps_revisions` | `ticker.EPSRevisions()` | ⚠️ Underscore vs CamelCase |
| Earnings Estimate | `ticker.earnings_estimate` | `ticker.EarningsEstimates()` | ⚠️ Singular vs Plural |
| Revenue Estimate | `ticker.revenue_estimate` | `ticker.RevenueEstimates()` | ⚠️ Singular vs Plural |
| Earnings History | `ticker.earnings_history` | `ticker.EarningsHistory()` | ✅ OK |
| Growth Estimates | `ticker.growth_estimates` | `ticker.GrowthEstimates()` | ✅ OK |

### Parameter Name Mismatches

**History Method**

| Python Parameter | Go Parameter | Mismatch |
|---|---|---|
| period | Period | ✅ OK |
| interval | Interval | ✅ OK |
| start | Start | ✅ OK |
| end | End | ✅ OK |
| prepost | PrePost | ✅ OK |
| auto_adjust | AutoAdjust | ⚠️ Python: snake_case |
| actions | Actions | ✅ OK |
| repair | Repair | ✅ OK |
| keepna | KeepNA | ⚠️ Python: keepna (lowercase) |
| back_adjust | ❌ None | ⚠️ Missing in Go |
| rounding | ❌ None | ⚠️ Missing in Go |
| timeout | ❌ None | ⚠️ Missing in Go (Set via Config) |
| raise_errors | ❌ None | ⚠️ Go uses error return |

**Financials Method**

| Python Parameter | Go Parameter | Mismatch |
|---|---|---|
| freq="yearly" | freq="annual" | ⚠️ "yearly" vs "annual" |
| freq="quarterly" | freq="quarterly" | ✅ OK |
| freq="trailing" | freq="trailing" | ✅ OK |
| pretty=True | ❌ None | ⚠️ Missing in Go |
| as_dict=False | ❌ None | ⚠️ Go returns struct |

### Return Value Structure Mismatches

**History Return Value**

| Python | Go | Mismatch |
|---|---|---|
| pd.DataFrame | []models.Bar | ⚠️ DataFrame vs Slice |
| Columns: Open, High, Low, Close, Adj Close, Volume | Fields: Open, High, Low, Close, AdjClose, Volume | ⚠️ Adj Close vs AdjClose |
| Columns: Dividends, Stock Splits | Fields: Dividends, Splits | ⚠️ Stock Splits vs Splits |
| Index: DatetimeIndex | Field: Date time.Time | ⚠️ Index vs Field |

**Options Return Value**

| Python | Go | Mismatch |
|---|---|---|
| tuple of date strings | []time.Time | ⚠️ string vs time.Time |
| OptionChain.calls → pd.DataFrame | OptionChain.Calls → []Option | ⚠️ DataFrame vs Slice |

**Financials Return Value**

| Python | Go | Mismatch |
|---|---|---|
| pd.DataFrame (rows=fields, cols=dates) | FinancialStatement (map[field][]items) | ⚠️ Different structure |
| Index: camelCase field names | Map keys: CamelCase | ✅ OK |
| Columns: pd.DatetimeIndex | Dates []time.Time | ⚠️ Different access method |

**FastInfo Return Value**

| Python Key | Go Field | Mismatch |
|---|---|---|
| currency | Currency | ✅ OK |
| quoteType | QuoteType | ✅ OK |
| lastPrice | LastPrice | ✅ OK |
| previousClose | PreviousClose | ✅ OK |
| regularMarketPreviousClose | RegularMarketPreviousClose | ✅ OK |
| fiftyDayAverage | FiftyDayAverage | ✅ OK |
| twoHundredDayAverage | TwoHundredDayAverage | ✅ OK |
| tenDayAverageVolume | TenDayAverageVolume | ✅ OK |
| threeMonthAverageVolume | ThreeMonthAverageVolume | ✅ OK |
| marketCap | MarketCap | ✅ OK |
| yearHigh | YearHigh | ✅ OK |
| yearLow | YearLow | ✅ OK |
| yearChange | YearChange | ✅ OK |

## Planning Corrections for Mismatches

Claude Code prioritized the mismatched parts and listed them in order of importance.

**High Priority (API Compatibility)**

- Financials `freq` parameter: Need to unify "yearly" → "annual"
  - Python: `get_income_stmt(freq="yearly")` is the default
  - Go: Currently uses "annual"
  - Recommendation: Map "yearly" to "annual" in Go as well

- Method Name Consistency
  - `PriceTarget()` → `AnalystPriceTargets()` (Matches Python)
  - `EarningsEstimates()` → `EarningsEstimate()` (Singular)
  - `RevenueEstimates()` → `RevenueEstimate()` (Singular)

**Medium Priority (Convenience)**

- Add History Parameters
  - Add `BackAdjust bool`
  - Add `Rounding bool`
- Bar Field Names
  - Consider adding `adj_close` or `adjclose` to JSON tags for `AdjClose`
  - Consider adding `StockSplits` (alias) for `Splits`

**Low Priority (Language Conventions)**

- Maintain Go Language Conventions
  - Keep CamelCase method names (Go Standard)
  - Keep using Methods instead of Properties (Go Standard)
  - Keep returning structs (Go has no DataFrame)

I confirmed that while core features mostly match, parameter values (freq="yearly" vs "annual") and some method names were inconsistent. Also, since the DataFrame structure provided by Python cannot be used in Go, I had to use Struct/Slice structures instead.

| Category | Match | Mismatch | Needs Fix |
|---|---|---|---|
| Method Names | 8 | 6 | 3 Recommended |
| Parameter Names | 6 | 6 | 1 Mandatory |
| Return Value Structure | - | 4 types different | Inevitable due to Go characteristics |
| Field Names | Mostly match | 2-3 | Optional |

## Implementation Results

### Summary of Changes

| Change | File | Description |
|---|---|---|
| Support `freq="yearly"` | financials.go | Maps "yearly" to "annual" to match Python yfinance |
| `AnalystPriceTargets()` | analysis.go | Matches Python's `analyst_price_targets` |
| `EarningsEstimate()` | analysis.go | Matches Python's `earnings_estimate` (Singular) |
| `RevenueEstimate()` | analysis.go | Matches Python's `revenue_estimate` (Singular) |
| Add Tests | financials_test.go | Added `TestNormalizeFrequency` |

### Backward Compatibility

Existing methods were kept as deprecated aliases to ensure they continue to work.

- `PriceTarget()` → Calls `AnalystPriceTargets()`
- `EarningsEstimates()` → Calls `EarningsEstimate()`
- `RevenueEstimates()` → Calls `RevenueEstimate()`