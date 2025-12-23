---
layout: post
title: "go-yfinance v1.0.0 Update"
description: "Released go-yfinance v1.0.0. I used Claude Code to analyze ranaroussi/yfinance v1.0.0, identified the changes, and reviewed the development feasibility, scope, timeline, and implementation approach. Based on this, I implemented go-yfinance v1.0.0."
categories: [dev, go-yfinance]
draft: false
lang: en
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "go-yfinance v1.0.0 Update"
  "description": "Released go-yfinance v1.0.0. I used Claude Code to analyze ranaroussi/yfinance v1.0.0, identified the changes, and reviewed the development feasibility, scope, timeline, and implementation approach. Based on this, I implemented go-yfinance v1.0.0."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## ranaroussi/yfinance v1.0.0 Update

On December 23rd (KST), [ranaroussi/yfinance was updated to v1.0.0](https://github.com/ranaroussi/yfinance/commit/d12c4b3c8c114f3547d284b868fc374ca181b432). 

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/7f6ccf6f-966c-48b9-94cc-ad3e9f4fa190/image.png)

<br>

The update introduces `Calendars`, a new feature for querying market-wide events, and `Lookup`, which expands ticker search capabilities. Additionally, `Sector`, `Industry`, and `Market` features have been added, enabling analysis by sector, industry, and market.

## v1.0.0 Major Changes

| Change                | Description                                |
|-----------------------|--------------------------------------------|
| Calendars Module (New)| Query market-wide calendar events          |
| Config Module (New)   | Global configuration management (yf.config)|
| Network Retry         | Automatic retry on network errors          |

## Feature Comparison: go-yfinance vs. ranaroussi/yfinance v1.0.0

| Feature                | Python v1.0.0 | Go  | Note                 |
|------------------------|---------------|-----|----------------------|
| Ticker (Basic)         |      ✅       | ✅  | Identical            |
| History (Price Data)   |      ✅       | ✅  | Identical            |
| Info (Company Info)    |      ✅       | ✅  | Identical            |
| Financials             |      ✅       | ✅  | Identical            |
| Options                |      ✅       | ✅  | Identical            |
| Holders                |      ✅       | ✅  | Identical            |
| Analysis               |      ✅       | ✅  | Identical            |
| Calendar (Per Ticker)  |      ✅       | ✅  | Identical            |
| News                   |      ✅       | ✅  | Identical            |
| WebSocket (Real-time)  |      ✅       | ✅  | Identical            |
| Search                 |      ✅       | ✅  | Identical            |
| Screener               |      ✅       | ✅  | Identical            |
| Multi/Download         |      ✅       | ✅  | Identical            |
| Lookup                 |      ✅       | ❌  | Not Implemented      |
| Sector/Industry/Market |      ✅       | ❌  | Not Implemented      |
| Calendars (Global)     |      ✅       | ❌  | New in v1.0.0        |
| Config (Global)        |      ✅       | 🔶  | Partially Implemented|

- All existing features are identical; however, four features from v1.0.0 were missing in `go-yfinance`.

## Analysis of Unimplemented Modules

### Lookup

**API Analysis**

| Item        | Details                    |
|-------------|----------------------------|
| Endpoint    | GET /v1/finance/lookup     |
| go-yfinance | LookupURL already defined ✅|
| Python Impl | yfinance/lookup.py (221 lines) |

**Usage (Python)**

```python
yf.Lookup(query="AAPL")  # Search ticker by ISIN, CUSIP, etc.
```

**Request Parameters**

- query: Search term (Required)
- type: all, equity, mutualfund, etf, index, future, currency, cryptocurrency
- count: Number of results (Default 25)
- start: Pagination
- formatted: false
- fetchPricingData: true
- lang: en-US
- region: US

**Response Structure**

```
{
  "finance": {
    "result": [{
      "documents": [
        {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NMS", ...}
      ]
    }]
  }
}
```

**Implementation Plan**

- Model Definition: `pkg/models/lookup.go`
- Implementation: `pkg/lookup/lookup.go`
- Testing: `pkg/lookup/lookup_test.go`
- Estimated Workload: ~300 lines

### Calendars

**API Analysis**

| Item        | Details                        |
|-------------|--------------------------------|
| Endpoint    | POST /v1/finance/visualization |
| go-yfinance | Definition Needed ❌           |
| Python Impl | yfinance/calendars.py (547 lines)|

- `go-yfinance`'s `Calendar()` only supports calendars for individual Tickers.
- Python's `Calendars` supports querying market-wide calendar events.

**Usage (Python)**

```python
calendars = yf.Calendars(start="2025-01-01", end="2025-01-07")
calendars.get_earnings_calendar()        # Earnings schedule
calendars.get_ipo_info_calendar()        # IPO schedule
calendars.get_economic_events_calendar() # Economic events
calendars.get_splits_calendar()          # Stock splits schedule
```

**Request Structure (POST Body)**

```
{
  "sortType": "DESC",
  "entityIdType": "sp_earnings|ipo_info|economic_event|splits",
  "sortField": "intradaymarketcap|startdatetime",
  "includeFields": ["ticker", "companyshortname", ...],
  "size": 100,
  "offset": 0,
  "query": {
    "operator": "AND",
    "operands": [
      {"operator": "eq", "operands": ["region", "us"]},
      {"operator": "gte", "operands": ["startdatetime", "2025-01-01"]}
    ]
  }
}
```

**Supported Calendar Types**

| Type           | Description     | Fields                                                |
|----------------|-----------------|-------------------------------------------------------|
| sp_earnings    | Earnings        | ticker, companyshortname, epsestimate, epsactual, ... |
| ipo_info       | IPO Info        | ticker, filingdate, pricefrom, priceto, shares, ...   |
| economic_event | Economic Events | econ_release, country_code, consensus_estimate, ...   |
| splits         | Splits          | ticker, startdatetime, old_share_worth, share_worth   |

**Implementation Plan**

- Model Definition: `pkg/models/calendar_market.go`
- Query Builder: `pkg/calendars/query.go`
- Implementation: `pkg/calendars/calendars.go`
- Testing: `pkg/calendars/calendars_test.go`
- Estimated Workload: ~700 lines

### Domain (Sector/Industry/Market)

**Usage (Python)**

```python
yf.Sector("technology")   # Sector info
yf.Industry("software")   # Industry info
yf.Market("us_market")    # Market info
```

**Sector**

| Item        | Details                               |
|-------------|---------------------------------------|
| Endpoint    | GET /v1/finance/sectors/{key}         |
| go-yfinance | Definition Needed ❌                  |
| Python Impl | yfinance/domain/sector.py (153 lines) |

Provided Data:
- name, symbol, overview (market cap, company count, industry count, etc.)
- top_companies
- top_etfs, top_mutual_funds
- industries (list of included industries)
- research_reports

**Industry**

| Item        | Details                                 |
|-------------|-----------------------------------------|
| Endpoint    | GET /v1/finance/industries/{key}        |
| go-yfinance | Definition Needed ❌                    |
| Python Impl | yfinance/domain/industry.py (154 lines) |

Provided Data:
- name, symbol, overview
- sector_key, sector_name (Parent Sector)
- top_companies, top_performing_companies, top_growth_companies
- research_reports

**Market**

| Item        | Details                                                         |
|-------------|-----------------------------------------------------------------|
| Endpoint    | GET /v6/finance/quote/marketSummary, GET /v6/finance/markettime |
| go-yfinance | MarketSummaryURL defined ✅                                     |
| Python Impl | yfinance/domain/market.py (108 lines)                           |

Provided Data:
- status (market state, open/close times, timezone)
- summary (price and change rate by major index)

**Implementation Plan**

- Models: pkg/models/domain.go
- Common Interface: pkg/domain/domain.go
- Sector: pkg/domain/sector.go
- Industry: pkg/domain/industry.go
- Market: pkg/domain/market.go
- Testing: pkg/domain/*_test.go
- Estimated Workload: ~920 lines

### Config

`go-yfinance` already implements a richer Config than Python v1.0.0.

| Setting         | Python v1.0.0 | go-yfinance |
|-----------------|---------------|-------------|
| Proxy           |      ✅       |     ✅      |
| Retries         |      ✅       |     ✅      |
| Debug/Logging   |      ✅       |     ✅      |
| Timeout         |      ❌       |     ✅      |
| UserAgent       |      ❌       |     ✅      |
| JA3 Fingerprint |      ❌       |     ✅      |
| Retry Delay     |      ❌       |     ✅      |
| Max Concurrent  |      ❌       |     ✅      |
| Cache TTL       |      ❌       |     ✅      |

Due to language characteristics, Python uses a nested style (`config.network.proxy`), while Go uses a method chain style (`SetProxy()`) in its API. However, since Config is set once at application startup and only read thereafter, I determined that there is no practical performance difference, so no changes are necessary.

**Performance Comparison**

| Item               | Nested Style   | Method Chain |
|--------------------|----------------|--------------|
| Memory             | Slightly more  | Efficient    |
| Runtime Overhead   | Dynamic lookup | Direct call  |
| Compile-time Check | ❌ Impossible  | ✅ Possible  |

## Issues Resolved

**Calendars Earnings API 500 Error**

- Cause: Query structure issue - date queries were wrapped in a nested AND.
- Resolution: Added `buildDateQueries()` to pass GTE/LTE as individual operands.

```go
// Before (Error)
Operands: []interface{}{
    query{Operator: "EQ", ...},
    query{Operator: "AND", Operands: [GTE, LTE]},  // Nested AND
}

// After (Success)
Operands: []interface{}{
    query{Operator: "EQ", ...},
    gteQuery,  // Included directly
    lteQuery,  // Included directly
}
```

**SplitEvent Type Conflict**

- Cause: `SplitEvent` was already defined in `pkg/models/response.go`.
- Resolution: Renamed to `CalendarSplitEvent`.

**Post Method Signature Mismatch**

- Cause: `client.Post` accepted `map[string]string`, but Calendars required `map[string]interface{}`.
- Resolution: Used `client.PostJSON` + `json.Marshal` for body serialization.

## Result

[go-yfinance v1.0.0 Release Note](https://github.com/wnjoon/go-yfinance/releases/tag/v1.0.0)