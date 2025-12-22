---
layout: post
title: "Building a Go Yahoo Finance Library with Claude Code #6"
description: "The sixth post in the story of creating a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
categories: dev
draft: false
lang: en
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Building a Go Yahoo Finance Library with Claude Code #6"
  "description": "The sixth post in the story of creating a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## Creating CLAUDE.md (Finally)

I asked Claude Code to develop the remaining Phases, but it proceeded with an unexpected task. The current working repository is structured as follows:

```
yfinance-main 
ㄴ yfinance 
ㄴ go-yfinance 
ㄴ ...
```

So far, I had downloaded the [ranaroussi/yfinance](https://github.com/ranaroussi/yfinance) repository locally. Inside it, I created the `go-yfinance` repository to implement functions by checking and comparing them one by one with `yfinance`.

However, Claude Code suddenly asked to retrieve the list of yfinance APIs from the Web. It hadn't done this when developing previous phases. I realized this wouldn't work, so I decided to define the working method in `CLAUDE.md`. Yes, my previous decision to **just let it code out of laziness** seemed to result in it suddenly changing its usual workflow.

<br>

*👨🏻‍💻: Please write the policies we've adopted so far during development into CLAUDE.md. Configure it so that it only operates within this project.*

<br>

The written [CLAUDE.md](https://github.com/wnjoon/go-yfinance/blob/main/CLAUDE.md) includes the content below. When work starts in `go-yfinance`, `CLAUDE.md` is automatically loaded, and all development guidelines are applied automatically.

**Project Identity & Reference Principles**

- Goal: A project to port the Python `yfinance` library to the Go language.
- Reference Principles (CRITICAL):
  - Do NOT search the web for feature implementation; directly analyze and reference the local Python `yfinance` source code.
  - Maintain consistency with the Python version regarding method names, parameters, return types, etc.

**Development Workflow**

- Observe the following steps when developing new features:
  - Preparation: Check `STATUS.md` and sync with the `main` branch.
  - Development:
    - Create `phase{N}/{feature-name}` branch.
    - Adhere to existing code patterns (`pkg/ticker`, `pkg/models`).
    - Unit tests must be written.
  - Documentation: Add comments to `doc.go` files and update `STATUS.md`.

**API Consistency**

- Strictly manage method mapping between Python `yfinance` and Go `go-yfinance`.
  - Naming: Convert Python's snake_case to Go's PascalCase (e.g., `major_holders` → `MajorHolders`).
  - Mapping Table: Adhere to specifically stated mapping rules like `InsiderRosterHolders`, `AnalystPriceTargets`.

**Definition of Done**

- Perform the following before merging into the main branch:
  - Pass tests (`go test`) and build (`go build`).
  - Verify API correspondence with the Python version.
  - Generate Documentation: Execute `make docs` to generate and verify `docs/API.md` locally (Do not rely on CI/CD).
  - Commit and push including the generated documents.

**Code Style & Tools**

- Comments: Include `gomarkdoc` compatible comments and Examples.
- Backward Compatibility: Maintain Deprecated Aliases when method names change to ensure compatibility.
- Makefile: Use `build`, `test`, `docs`, `lint` commands.

**Issue Response**

- Includes guidelines for CycleTLS panic handling and Git environment variable settings.

## Trusting Completely, But With a Touch of Interference

After writing `CLAUDE.md`, I thought Claude Code would handle things well on its own. However, just like the sudden attempt to fetch APIs from the Web, I felt that continuous checking was necessary, even though I had created the guideline document.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/4a30789d-edb7-4193-bdb5-6c1a928ac4ec/image.png)

<br>

As mentioned in a [post](https://www.linkedin.com/posts/wooing_claude-code%EB%A5%BC-%EC%93%B8-%EB%95%8C%EB%8A%94-%EB%82%B4%EA%B0%80-%EC%97%84%EC%B2%AD-%EC%9E%90%EC%A3%BC-%EA%B0%9C%EC%9E%85%ED%95%B4%EC%A4%98%EC%95%BC-%ED%95%9C%EB%8B%A4-%EA%B0%9C%EC%9E%85%EC%9D%84-activity-7408090307247976449-sBPP?utm_source=share&utm_medium=member_desktop&rcm=ACoAACX_74kB5FHdEvU5kLzcald4RDFZSjBrrKA) by [Kim Wooyeong](https://www.linkedin.com/in/wooing/), simply writing down all guidelines in Claude Code doesn't mean you can delegate everything. I definitely felt the quality improve when I continued to give feedback and proceeded with additional verification and questions at each step.

### Should We Strictly Follow Go Function Naming Rules?

For example, in Claude Code's report stating that Phase 7 implementation was complete, the Python `yfinance` API mapping result was as follows:

|Python|Go|
|---|---|
|`yf.Tickers(symbols)`|`multi.NewTickers(symbols)`|
|`tickers.tickers[symbol]`|`tickers.Get(symbol)`|
|`tickers.history()`|`tickers.History(params)`|
|`yf.download(symbols)`|`multi.Download(symbols, params)`|

The part I questioned here was writing `tickers.tickers[symbol]` as `tickers.Get(symbol)`. I had requested strict adherence to `yfinance` principles, but Claude Code created the function with the name `Get`. So, I asked Claude Code:

<br>

*👨🏻‍💻: I want to strictly follow yfinance's function naming rules. Is writing tickers.tickers[symbol] as tickers.Get(symbol) a good approach?*

*🤖: In the Go implementation, I created it as a Get(symbol) method, which is more idiomatic in Go. To expose it as a public field like Python, you have Option 1: keep the current method style using tickers.Get("AAPL"), or Option 2: expose a public map field using tickers.Tickers["AAPL"]. To exactly match the Python API, we could expose the Tickers field publicly.*

<br>

I suspected it was created this way to satisfy Go's implementation philosophy. However, as I thought when first starting this library conversion: **It is important to follow Python yfinance's principles as much as possible, but there will definitely be cases where we must implement differently due to the language's characteristics.**

So I asked if other features were also maintaining this Go style. If other methods were strictly following `yfinance` principles, I would need to change this part, but if other parts were also satisfying Go style, I considered the implementation direction to be consistent.

The following is the analysis result of all methods developed up to Phase 7:

|Python yfinance|Go go-yfinance|Match Status|
|---|---|---|
|**Core**|-|-|
|`Ticker(symbol)`|`ticker.New(symbol)`|✅ Go Style|
|`ticker.ticker`|`t.Symbol()`|✅|
|`ticker.history()`|`t.History(params)`|✅|
|`ticker.info`|`t.Info()`|✅|
|`ticker.fast_info`|`t.FastInfo()`|✅|
|**Quote**|-|-|
|`ticker.quote (internal)`|`t.Quote()`|✅|
|**Options**|-|-|
|`ticker.options`|`t.Options()`|✅|
|`ticker.option_chain(date)`|`t.OptionChain(date)`|✅|
|**Financials**|-|-|
|`ticker.get_income_stmt(freq)`|`t.IncomeStatement(freq)`|✅|
|`ticker.get_balance_sheet(freq)`|`t.BalanceSheet(freq)`|✅|
|`ticker.get_cashflow(freq)`|`t.CashFlow(freq)`|✅|
|**Analysis**|-|-|
|`ticker.get_recommendations()`|`t.Recommendations()`|✅|
|`ticker.get_analyst_price_targets()`|`t.AnalystPriceTargets()`|✅|
|`ticker.get_earnings_estimate()`|`t.EarningsEstimate()`|✅|
|`ticker.get_revenue_estimate()`|`t.RevenueEstimate()`|✅|
|`ticker.get_eps_trend()`|`t.EPSTrend()`|✅|
|`ticker.get_eps_revisions()`|`t.EPSRevisions()`|✅|
|`ticker.get_earnings_history()`|`t.EarningsHistory()`|✅|
|`ticker.get_growth_estimates()`|`t.GrowthEstimates()`|✅|
|**Holders**|-|-|
|`ticker.get_major_holders()`|`t.MajorHolders()`|✅|
|`ticker.get_institutional_holders()`|`t.InstitutionalHolders()`|✅|
|`ticker.get_mutualfund_holders()`|`t.MutualFundHolders()`|✅|
|`ticker.get_insider_transactions()`|`t.InsiderTransactions()`|✅|
|`ticker.get_insider_roster_holders()`|`t.InsiderRosterHolders()`|✅|
|`ticker.get_insider_purchases()`|`t.InsiderPurchases()`|✅|
|**Calendar**|-|-|
|`ticker.get_calendar()`|`t.Calendar()`|✅|
|**History**|-|-|
|`ticker.dividends`|`t.Dividends()`|✅|
|`ticker.splits`|`t.Splits()`|✅|
|`ticker.actions`|`t.Actions()`|✅|
|**Multi-ticker**|-|-|
|`yf.Tickers(symbols)`|`multi.NewTickers(symbols)`|✅ Go Style|
|`tickers.tickers[symbol]`|`tickers.Get(symbol)`|✅ Go Style|
|`tickers.history()`|`tickers.History(params)`|✅|
|`yf.download()`|`multi.Download()`|✅|
|**Search**|-|-|
|`yf.Search(query)`|`search.Search(query)`|✅|
|**Screener**|-|-|
|`yf.Screener.get_screeners()`|`screener.Screen()`|✅|

Excluding the unimplemented functions in Phases 8-9, I could confirm that all implemented content was mapped consistently.

Additionally, as each step proceeded, I made sure to check again whether the documentation was written correctly (though it might seem unnecessary). This is partly because I can't delegate 100% of the work to Claude Code, but also because I believe it is a manager's duty to verify the work done.

### Is it Okay if Package Names are Different?

During the implementation of Phase 8, the package for Websocket was named `live`. Consequently, the part called as `yf.WebSocket()` in Python changed to `live.New()` in Go. I asked for the reason behind this implementation.

<br>

*👨🏻‍💻: Is there a reason why the Websocket-related package name is 'live'?*

<br>

It turned out that Python `yfinance`'s filename is `live.py`, and the classes `WebSocket` and `AsyncWebSocket` are also inside the `live` module, so it was matched identically.

```python
# Python yfinance
from yfinance.live import WebSocket
```

Although there were alternative names suggested by Claude Code such as stream, websocket, and realtime, I judged that keeping it identical to Python was more correct. And actually, when using it in Go, I thought it would be usable without confusion due to the consistency with Python yfinance.

```go
import "github.com/wnjoon/go-yfinance/pkg/live"

ws, _ := live.New()
ws.Subscribe([]string{"AAPL"})
ws.Listen(handler)
```

## Implementation Results of Phase 6-9

### Phase 6: Search & Lookup

**Code Implementation**

- Search Package (`pkg/search/search.go`): `Search`, `SearchWithParams`, `Quotes`, `News` methods
- Screener Package (`pkg/screener/screener.go`): `Screen`, `ScreenWithQuery`, `DayGainers`, `DayLosers`, `MostActives` methods
- Models (`pkg/models/search.go`, `pkg/models/screener.go`): All data structures

**Testing**

- All tests passed (`go test ./pkg/search/... ./pkg/screener/... -v`)

**Documentation**

- `pkg/search/doc.go`, `pkg/screener/doc.go` - Package documentation
- `pkg/models/doc.go` - Added Search/Screener types
- `STATUS.md` - Updated Phase 6 completion status
- `docs/API.md` - Automatically generated via `make docs`

**Python yfinance API Consistency**

|Python yfinance|Go Implementation|
|---|---|
|`yf.search(query)`|`search.Search(query)`|
|`Screener().set_predefined_body(name)`|`screener.Screen(name, params)`|
|`Screener().set_body(query)`|`screener.ScreenWithQuery(query, params)`|
|Query Operators (EQ, GT, LT, AND, OR, etc.)|Identical to `models.OpEQ`, `models.OpGT`, etc.|
|Predefined screeners (day_gainers, etc.)|Identical to `models.ScreenerDayGainers`, etc.|

### Phase 7: Multi-ticker & Batch

**New Files**

- `pkg/models/multi.go`: `DownloadParams`, `MultiTickerResult` models
- `pkg/multi/multi.go`: `Tickers` struct, `Download` function
- `pkg/multi/multi_test.go`: Unit tests

**Key Features**

- `multi.NewTickers(symbols)`: Create Tickers with symbol slice
- `multi.NewTickersFromString(str)`: Create Tickers from string (space/comma separated)
- `tickers.Get(symbol)`: Access individual ticker
- `tickers.History(params)`: Download full ticker history
- `multi.Download(symbols, params)`: Batch download as an independent function
- Parallel processing support via Worker pool (`Threads` parameter)

**Python yfinance API Mapping**

|Python|Go|
|---|---|
|`yf.Tickers(symbols)`|`multi.NewTickers(symbols)`|
|`tickers.tickers[symbol]`|`tickers.Get(symbol)`|
|`tickers.history()`|`tickers.History(params)`|
|`yf.download(symbols)`|`multi.Download(symbols, params)`|

### Phase 8: Real-time WebSocket

**New Files**

- `pkg/models/live.go`: `PricingData` struct (33 fields), `MarketState` type
- `pkg/live/proto.go`: Protobuf decoder (Base64 + protobuf parsing)
- `pkg/live/websocket.go`: WebSocket client
- `pkg/live/doc.go`: Package documentation
- `pkg/live/live_test.go`: Unit tests

**Key Features**

- `live.New()`: Create WebSocket client
- `ws.Subscribe(symbols)`: Subscribe to symbols
- `ws.Unsubscribe(symbols)`: Unsubscribe
- `ws.Listen(handler)`: Blocking listening
- `ws.ListenAsync(handler)`: Asynchronous listening
- `ws.Close()`: Close connection
- Auto heartbeat (resubscribe every 15 seconds)
- Auto reconnect

**Python yfinance API Mapping**

|Python|Go|
|---|---|
|`yf.WebSocket()`|`live.New()`|
|`ws.subscribe(symbols)`|`ws.Subscribe(symbols)`|
|`ws.listen(handler)`|`ws.Listen(handler)`|
|`ws.close()`|`ws.Close()`|

### Phase 9: Python yfinance Advanced Features

**Added Features**

- News Feed (`pkg/ticker/news.go`)
  - `ticker.News(count, tab)`: Fetch news articles
  - `ticker.GetNews()`: Fetch news with default parameters
  - Includes ad filtering
- Cache Layer (`pkg/cache/cache.go`)
  - Thread-safe TTL-based in-memory cache
  - Auto-cleanup of expired items
  - Global cache instance
- Timezone Utilities (`pkg/utils/timezone.go`)
  - Mapping of 50+ global exchange timezones
  - `GetTimezone()`, `IsValidTimezone()`, `ConvertToTimezone()`
  - `MarketIsOpen()`: Basic market hour check

## Summary

In this way, I analyzed `yfinance` and asked Claude Code to create a Go library with the same functions. In terms of duration, it took about 3 days, but in actual working hours, it took roughly 6-7 hours. I probably could have worked much faster if I had written `CLAUDE.md` more meticulously or hadn't requested redundant verification continuously.

Initially, I started this side project because there was no `yfinance` library in Go while building an **Investment Strategy Agent** in a [course](https://nomadcoders.co/ai-agents-masterclass?gad_source=1&gad_campaignid=18141167485&gbraid=0AAAAACQEcGgB28vYn3MvB7rhLJ-guDeaI&gclid=Cj0KCQiA6Y7KBhCkARIsAOxhqtM01uDU_sqgVSqN3XMhxFpk9dDyzL1A6kZ0a1GY_Y7gsTcbOAwz8gIaAtf1EALw_wcB). I could have just followed the course using Python, thinking of it as studying Python, but since Google ADK supports Go, I thought, "Is there any reason not to try using Go?" and that led me here.

Although I borrowed the ideas and logic from open source, I left an inquiry in the [Discussion section of `ranaroussi/yfinance`](https://github.com/ranaroussi/yfinance/discussions/2647#discussioncomment-15310537) just in case.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/e6f0189a-828a-4679-8a8f-943b27067274/image.png)

<br>

I also asked Gemini a few questions out of curiosity regarding potential issues.

<br>

*👨🏻‍💻: I made a library for Go by referencing the logic and structure of yfinance used in Python. Although yfinance is open source, I sent an email asking if it's okay to implement and create a library like this, but I haven't received a reply yet. Could there be any problems in this case?*

<br>

Here is a summary of Gemini's response:

- `yfinance` likely follows a Permissive license like **Apache License 2.0** (or MIT depending on the version). Converting Python code to Go is a form of **porting**. Open source licenses generally allow code modification, distribution, and porting to other languages.
- The logic of fetching data from Yahoo Finance or the function structure itself is closer to an 'idea' or 'function' rather than 'expression,' which is subject to copyright protection. Therefore, if you didn't just copy and paste the Python code but **re-implemented** it to fit the characteristics of the Go language, the possibility of copyright infringement is low.
- To respect the original author and follow license regulations, it is customary and safe to state in the GitHub README, etc., that **"This project is inspired by the Python yfinance library"** and provide a link to the original.
- Yahoo Finance currently does not officially provide a free API. `yfinance` or user-created Go libraries likely use methods of crawling web pages or calling unofficial internal API endpoints. However, Yahoo's Terms of Service generally prohibit automated data collection (scraping).
- Yahoo may block IPs or change structures at any time, and if you use this commercially or cause excessive traffic, you may face legal sanctions.

Finally, it suggested clearly stating in the `README.md` that it is an "Unofficial library implemented in Go referencing the logic of `ranaroussi/yfinance`," and giving notice that "This is not an official API of Yahoo Finance, and data collection may be blocked at any time."

So, I decided to add the following content to `README.md`.

```md
## Credits

This project is a Go implementation inspired by the Python library [yfinance](https://github.com/ranaroussi/yfinance).
Special thanks to [Ran Aroussi](https://github.com/ranaroussi) and all contributors of the original project for their excellent work.

...

## Disclaimer

> **Please read this carefully before using this library.**

1. **Unofficial API**: This library is **not affiliated with, endorsed by, or connected to Yahoo! Finance**. It wraps unofficial API endpoints intended for web browser consumption.

2. **Terms of Service**: Use of this library must comply with [Yahoo!'s Terms of Service](https://policies.yahoo.com/us/en/yahoo/terms/index.htm). Users are solely responsible for ensuring their usage is compliant.

3. **Risk of Blocking**: Since this library relies on unofficial methods, Yahoo! Finance may change their API structure or block IP addresses making excessive requests at any time without notice.

4. **No Warranty**: This software is provided "as is", without warranty of any kind, express or implied. The authors shall not be held liable for any damages or legal issues arising from the use of this software.
```

Next time, I plan to actually register it as a Go library. I'm thinking of letting Claude Code handle this part as well.