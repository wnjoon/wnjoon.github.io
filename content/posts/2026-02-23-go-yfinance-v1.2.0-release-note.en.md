---
title: "go-yfinance v1.2.0 Update"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-02-19"
slug: "go-yfinance-v1-2-0-release-note"
summary: "Beyond a simple version sync, we have achieved full functional parity with python-yfinance by completely re-implementing the Screener module."
description: "An analysis of python-yfinance v1.2.0 changes led to the discovery and total overhaul of missing Screener features. This update includes mapping for 150+ exchanges, support for 100+ fields, and critical workarounds for hidden Yahoo Finance API bugs."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "go", "go-yfinance", "open-source", "2026"]
keywords: ["AI", "python", "yfinance", "go", "yahoo finance", "screener", "fintech"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "go-yfinance v1.2.0 Release Note"
  "description": "Full parity of Screener module and python-yfinance v1.2.0 updates."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## ranaroussi/yfinance v1.2.0 Update 

[ranaroussi/yfinance has been updated to v1.2.0](https://github.com/ranaroussi/yfinance/releases/tag/1.2.0). Minor updates seem to be occurring quite frequently since the v1.0.0 release.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/fda20c39-de8f-405d-90cb-42e2ed491ced/image.png)

<br>

## Progress up to v1.1.0

- **2025-12-18**: Project started — Goal: Fully port `python-yfinance` to Go.
- **2025-12-23**: v1.0.0 Tag Release (Core packages: Ticker, Multi, Screener, Market, Sector, Industry, Calendars, etc.).
- **2026-01-26**: v1.1.0 Release — Completed 5 phases of the **Price Repair** system.
  - Phase 1: Statistical utilities (percentile, zscore, filter).
  - Phase 2: Capital Gains double-counting fix + Stock Split repair.
  - Phase 3: 100x currency unit error fix + zero-value interpolation.
  - Phase 4: Fixes for 7 types of dividend errors.
  - Phase 5: ISO 10383 MIC code mapping for 60+ exchanges.
  - **Stats**: ~5,400 lines of code, 96 tests (100% pass).

## v1.2.0 Development History

### 1. Analysis of python-yfinance v1.2.0 Changes

I analyzed the changes in `python-yfinance v1.2.0` to see what needed to be reflected in Go. There were 4 non-screener changes, all of which were deemed unnecessary for the Go implementation:

- **df._consolidate()**: Go slices use contiguous memory; no pandas block fragmentation issues.
- **flags.writeable guard**: The Go `repair` package already performs defensive copying (make+copy).
- **Typo fix (recieved→received)**: This typo did not exist in `go-yfinance`.
- **version.py update**: `go-yfinance` manages versions via git tags.

### 2. Identifying Missing Features in the Screener Module

While analyzing the screener exchange map expansion for v1.2.0, I discovered that several core screener features that should have been in v1.1.0 were entirely missing. Initially, an AI tool suggested that no action was needed because the exchange maps weren't in Go yet. However, realizing this contradicted the goal of **exact functional parity**, I pushed for a deeper analysis. 

This experience highlighted the importance of human oversight. Even when porting a service solo with AI assistance, gaps can occur. It served as a reminder that AI should be treated as a "collaborative peer" rather than a tool for 100% delegation.

| Missing Item | Description |
| --- | --- |
| **EQUITY_SCREENER_EQ_MAP** | 58 regions, ~150 exchange codes, 11 sectors, 118 industries, 74 peer groups — 0% implemented. |
| **FUND_SCREENER_EQ_MAP** | 58 regions, ~140 exchange codes — 0% implemented. |
| **EQUITY_SCREENER_FIELDS** | 12 categories, ~91 field names — 0% implemented. |
| **FUND_SCREENER_FIELDS** | 9 field names — 0% implemented. |
| **FundQuery Type** | No Go type corresponding to Python's `FundQuery` class. |
| **IS-IN Operator** | Missing client-side expansion from `IS-IN` to `OR-of-EQ`. |
| **Query Validation** | No client-side validation logic (e.g., `_validate_eq_operand()`). |
| **Predefined Queries** | No definitions for the 15 predefined query bodies. |
| **quoteType Hardcoding** | `ScreenWithQuery` was hardcoded to "equity", making Fund screening impossible. |

### 3. Implementation: feature/screener-parity 

I created a dedicated branch and implemented the following:

**New Files (3)**
- `pkg/models/screener_const.go`: Ported all constants from Python's `const.py`.
  - Mapped all sectors, industries, regions, and peer groups.
  - Intentionally reproduced a Python bug (missing comma in `income_statement`) for compatibility.
- `pkg/models/screener_query.go`: Added `EquityQuery/FundQuery` types and `ScreenerQueryBuilder` interface.
  - Implemented `ToDict()` and `QuoteType()` methods.
  - Added logic for `IS-IN` expansion and field validation.
- `pkg/screener/predefined.go`: Implemented 15 predefined queries (9 Equity, 6 Fund).
  - Configured with `fail-fast` logic using `init()`.

**Updated Files (2)**
- `pkg/models/screener.go`: Added fund-specific fields and `OpISIN` constants.
- `pkg/screener/screener.go`: Integrated the new interface and implemented a dynamic `quoteType` logic.

### 4. Discovery: Hidden Yahoo Finance API Bug

During implementation, I found that the `GET predefined` endpoint silently ignores the `offset` parameter. To support pagination, I implemented a workaround in the `Screen()` method that switches to the `POST custom query` endpoint when `offset > 0`.

### 5. Testing and Finalization

- Added 11 new test functions covering query generation, validation, and expansion.
- All 17 packages passed tests; `golangci-lint` reported 0 issues.
- Fully updated `docs/API.md`.
- **2026-02-19**: Merged into `main` and deployed documentation.

## Installation and Update

```bash
go get https://github.com/wnjoon/go-yfinance@v1.2.0
```