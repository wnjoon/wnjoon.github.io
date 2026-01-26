---
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #2"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-12-18"
slug: "go-yfinance-2"
summary: "Yahoo Finance 인증 우회 테스트를 해보고, 구현 계획을 세워보았습니다."
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 두번째 포스팅입니다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "ai", "claude code", "go", "go-yfinance", "2025"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/12/19/go-yfinance-1/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## 실용적 수준을 구현하기 전에, CycleTLS를 이용한 인증 우회 테스트를 해보자.

[이전 포스팅 'Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #1'](https://wnjoon.github.io/ko/go-yfinance-1/)에서 작성했던 것 처럼, Claude Code가 제시한 Go 기반의 yfinance 라이브러리는 크게 3단계의 Phase로 구성되어 있습니다.

```
MVP (최소 실행 가능 제품)
- Phase 0 + Phase 1 = ~1,100줄
- 기본적인 가격 조회 가능

실용적 수준
- Phase 0~4 = ~2,300줄
- 대부분의 투자 분석 가능

Python yfinance 동등
- Phase 0~7 = ~3,500줄
- 거의 모든 기능 사용 가능
```

지난번에 MVP 단계를 구현했기 때문에, 이제는 실용적 단계의 구현을 요청하려고 했는데요. 그전에 과연 CycleTLS를 사용해서 Yahoo Finance 인증과정에서의 우회가 정상적으로 일어나고 있는지 먼저 확인해야할 것 같았습니다. Phase1에서 구현해준 샘플 코드에서는 애플(AAPL)이라는 단기 종목에 대한 조회만 하고 있었는데, 그것보다는 더 많은 양을 조회해봐야 할 것 같더라구요.

그래서 Gemini에게 아래와 같이 질문했습니다.

<br>

*👨🏻‍💻: CycleTLS를 사용해서 Yahoo Finance로의 호출이 정상적으로 우회되는지 확인하려면 최소 몇회 정도의 종목 조회를 동시에 호출해보면 좋을까?*

*🤖: ... 동시 요청(Concurrency) 10개, 총 50개 조회로 시작해보세요. 모두 성공한다면 동시 요청을 20개, 30개로 늘리면서 429 에러가 뜨는 임계점을 찾으시면 됩니다.*

<br>

Gemini는 Yahoo Finance 입장에서 DDoS 공격이나 비정상적인 트래픽으로 간주할 수 있는 상황을 피하기 위해 동시 요청되는 갯수를 조절하라고 제안했습니다. 아마 작성하고 있는 코드가 하나의 어플리케이션이라고 인식하는 것 같았습니다. 

저의 목적은 Go로 Yahoo Finance를 호출할 수 있는 라이브러리를 구현하는 것이기 때문에, 도구 자체로의 기능만 제대로 구현하면 된다고 생각했습니다. 즉 Yahoo Finance에서 오류를 받지 않도록 하는 것은 이 라이브러리를 사용해서 어플리케이션을 구현하는 곳에서 제어할 문제고, 저는 단순히 호출하는 방식만 제대로 구현하면 되는 것이었습니다. 다만 CycleTLS를 사용해서 Yahoo Finance로의 호출을 우회해주는 기능만 추가하면 된다고 생각했죠.

그래서 Gemini가 열심히 작성해준 답변을 살짝 무시하고, 최대 110개의 종목을 goroutine으로 동시에 호출해보았습니다. 이정도면 무리되지 않는 선에서 동시요청을 통한 정상적인 우회가 이루어지는지 확인할 수 있다고 생각했습니다. 결과는 아래와 같았습니다. 오류도 나지 않았고, 그렇게 좋지 않는 로컬의 성능(M3 Air, 16GB RAM)에서도 꽤나 준수한 속도로 동작한 것 같습니다. 

```sh
[Parallel] Batch call completed in 3.332168875s for 110 symbols (avg: 30.292444ms per symbol)
```

위에서도 적었듯이, 몇개의 요청에 대해서 Yahoo Finance가 429 에러를 반환하는지를 확인하는 것은 저의 범위가 아니라고 생각했습니다. 그래서 더이상 테스트는 하지 않았는데요, 향후에는 110개의 종목을 짧은 시간차를 두고 여러번 호출하는 방식으로 확인해보는 것도 나쁘지 않을 것 같았습니다.

## 구현 계획 세우기

실용적 수준 카테고리는 세부적으로 3개의 단계로 구성됩니다.

**Phase 2: Options (옵션 데이터)**

- API 엔드포인트: query2.finance.yahoo.com/v7/finance/options/{symbol}
- 구현 항목
  - Options(): 옵션 체인 조회 (콜/풋)
  - ExpirationDates(): 만기일 목록
  - 옵션 모델 구조체: Call, Put, OptionChain
- 예상 메서드
  - t.Options(): 모든 옵션 체인
  - t.OptionsAtExpiry(date): 특정 만기일 옵션
  - t.ExpirationDates(): 만기일 목록

**Phase 3: Financials (재무제표)**

- API 엔드포인트: query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/{symbol} 
- 구현 항목
  - IncomeStatement(): 손익계산서
  - BalanceSheet(): 재무상태표
  - CashFlow(): 현금흐름표
  - Annual / Quarterly 지원
- 예상 메서드
  - t.IncomeStatement(annual bool): 손익계산서
  - t.BalanceSheet(annual bool): 재무상태표
  - t.CashFlow(annual bool): 현금흐름표
  - t.Financials(): 전체 재무제표

**Phase 4: Analysis (분석 데이터)**

- API 엔드포인트: QuoteSummary API의 분석 모듈 사용
  - recommendationTrend, earningsTrend, earningsHistory 등
- 구현 항목
  - Recommendations(): 애널리스트 추천
  - PriceTargets(): 목표가
  - EarningsEstimate(): 실적 예상
  - RevenueEstimate(): 매출 예상
  - GrowthEstimates(): 성장률 예상
- 예상 메서드
  - t.Recommendations(): 매수/매도/보유 추천
  - t.PriceTargets(): 목표가 (현재/평균/고/저)
  - t.EarningsEstimate(): EPS 예상
  - t.RevenueEstimate(): 매출 예상
  - t.EarningsDates(): 실적 발표일

각각이 종속관계를 갖지 않는 내용이었기 때문에, 순서대로 개발해달라고 요청했습니다. 각 단계별로 세부적인 내용은 아래와 같습니다.

1. Phase 2 (Options): 단일 API 엔드포인트로 비교적 간단
2. Phase 3 (Financials): Timeseries API 파싱이 복잡하지만 핵심 기능
3. Phase 4 (Analysis): QuoteSummary 모듈 확장으로 Info 코드 재사용 가능

그리고 지난번 포스팅에서 MVP 수준으로 개발을 요청할때에는, 제가 테스트 요구사항을 정확하게 명시하지 않았더라구요. 그러다보니 Claude Code가 제가 생각했던 것보단 간단한 수준의 테스트만 작성하고 넘어갔습니다. 그래서 이번에는 좀더 테스트를 꼼꼼하게 하고, 정확하게 구현되는지 하나씩 꼭 확인해달라고 요청했습니다.

<br>

*👨🏻‍💻: ... STATUS.md에 진행과정 정확하게 표시해주고, 각 기능별로 테스트 꼼꼼하게 해서 정확하게 구현이 완료되는지 확인하면서 진행해줘.*

<br>

## TODO 목록

Claude Code에게 각 Phase별로 구현해야 할 목록을 꼼꼼하게 파악하고, 각 기능을 주제별로 묶어서 미리 TODO에 작성해서 단계별로 처리하고 검사하도록 요청했습니다. 아래는 각 Phase별로 Claude Code가 작성하고 관리한 TODO 목록입니다.

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

## 구현 결과

### Phase 2: Options

**구현 내용**

|항목	|파일	|설명|
|---|---|---|
|Option 모델|`pkg/models/option.go`|Option, OptionQuote, OptionChain 구조체|
|Options 메서드|`pkg/ticker/options.go`|Options(), OptionChain(), Strikes() 등|
|유닛 테스트|`pkg/ticker/options_test.go`|캐시 및 구조체 테스트|

**사용 예시**

```go
t, _ := ticker.New("AAPL")
defer t.Close()

// 만기일 목록
expirations, _ := t.Options()

// 옵션 체인 (가장 가까운 만기)
chain, _ := t.OptionChain("")

// 특정 만기일 옵션 체인
chain, _ := t.OptionChain("2025-12-26")

// 행사가 목록
strikes, _ := t.Strikes()
```

**이슈 사항**

개발 중간에 아래와 같은 이슈사항이 발생했습니다.

<br>

*🤖: `options.go`에서 Underlying이 이제 `*models.OptionQuote` 타입이어야 합니다. 코드를 확인해보니 이미 `&result.Quote`를 사용하고 있는데, `Quote` 타입이 `OptionQuote`로 변경되었으므로 자동으로 호환됩니다. 테스트 파일도 업데이트하고 `cmd/test_options/main.go`도 수정해야 합니다.*

<br>

기능을 추가하면서, 새로운 타입을 기존 코드에서 사용하던 타입에 적용해야 하는 부분이 생겼습니다. 이 부분도 Claude Code가 정확히 판단하고 수정했습니다. 

- `pkg/models/option.go` - OptionQuote 타입 추가 완료
  - `OptionChain.Underlying`이 `*OptionQuote` 타입으로 변경됨
  - `OptionChainResponse.Quote`도 `OptionQuote` 타입으로 변경됨
- `pkg/ticker/options.go` - 자동 호환
  - `&result.Quote`가 `*models.OptionQuote`를 반환하므로 수정 불필요
- `cmd/test_options/main.go` - 테스트 후 임시 파일이라 삭제됨

**라이브 테스트 결과**

- Underlying Price: $271.84
- Calls: 99
- Puts: 91

### Phase 3: Financials

**새로 추가된 파일**

- `pkg/models/financials.go`: 재무제표 데이터 모델
- `pkg/ticker/financials.go`: 재무제표 API 메서드
- `pkg/ticker/financials_test.go`: 유닛 테스트

**수정된 파일**

- `internal/endpoints/endpoints.go`: 재무제표 키 상수 추가
- `pkg/ticker/ticker.go`: financialsCache 필드 추가

**구현된 API 메서드**

|메서드	|설명|
|---|---|
|`IncomeStatement(freq)`	|손익계산서 (annual/quarterly)|
|`BalanceSheet(freq)`	|대차대조표 (annual/quarterly)|
|`CashFlow(freq)`	|현금흐름표 (annual/quarterly)|
|`FinancialsJSON()`	|디버깅용 Raw JSON|

**라이브 테스트 결과 (AAPL)**

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

**새로 추가된 파일**

- `pkg/models/analysis.go`: 분석 데이터 모델 (116 lines)
- `pkg/ticker/analysis.go`: 분석 API 메서드 (664 lines)
- `pkg/ticker/analysis_test.go`: 유닛 테스트 (196 lines)

**수정된 파일**

- `pkg/ticker/ticker.go`: analysisCache 필드 추가

**구현된 API 메서드**

|메서드|설명|소스 모듈|
|---|---|---|
|`Recommendations()`|애널리스트 추천|recommendationTrend|
|`PriceTarget()`|목표가|financialData|
|`EarningsEstimates()`|실적 예상|earningsTrend|
|`RevenueEstimates()`|매출 예상|earningsTrend|
|`EPSTrend()`|EPS 추이|earningsTrend|
|`EPSRevisions()`|EPS 수정|earningsTrend|
|`EarningsHistory()`|실적 이력|earningsHistory|
|`GrowthEstimates()`|성장 예상|industryTrend, sectorTrend, indexTrend|

**라이브 테스트 결과 (AAPL)**

- Recommendations: 4 periods (StrongBuy=5, Buy=24, Hold=15, Sell=1, StrongSell=3)
- Price Targets: Current=$272.19, Mean=$287.71, High=$350, Low=$215
- Earnings Estimates: 4 periods (0q, +1q, 0y, +1y)
- Revenue Estimates: 4 periods with growth rates
- Earnings History: 4 quarters with surprise %

**계획 대비 변경사항**

원래 계획

- Analyst Recommendations ✅
- Price Targets ✅
- Earnings Estimates ✅
- Revenue Estimates ✅
- EPS Trend/Revisions ✅
- Growth Estimates ✅

추가 구현

- `EarningsHistory()`: 과거 실적 대비 실제 결과 (surprise %) 제공
- 캐싱 시스템: earningsTrend 데이터를 한 번만 fetch하여 여러 메서드에서 재사용

구조적 변경

- 초기 계획은 별도의 API 엔드포인트를 사용할 것으로 예상했으나, 실제로는 `quoteSummary` API의 여러 모듈을 조합하여 구현
- `getFloat` → `getFloat64` 함수명 통일 (`info.go`와 충돌 방지)

## yfinance와의 중간 검증

지금까지 개발된 내용이 yfinance에서 제공하는 기능 및 방법과 동일하게 구현되어 있는지 Claude Code에게 확인해보았습니다. 

<br>

*👨🏻‍💻: 지금까지 구현된 모든 Phase들이 기존에 Python 기반의 yfinance에서 제공하는 모든 기능들을 정확하게 구현하고 있는지 다시한번 꼼꼼하게 확인해줘. ultrathink. 테스트가 필요하다면 진행해도 좋아.*

<br>

### 검증 계획

Claude Code가 세운 TODO 목록입니다. 각 Phase별로 테스트를 진행하고, 최종적으로 Go Test를 진행한 후 차이점이 존재하는지 분석하는 순으로 진행합니다.

- Compare Phase 0 (Foundation): HTTP Client, Auth, Errors, Config
- Compare Phase 1 (Core Data): Quote, History, Info
- Compare Phase 2 (Options): Options chain and expiration
- Compare Phase 3 (Financials): Income, Balance, CashFlow
- Compare Phase 4 (Analysis): Recommendations, Price Targets, Estimates
- Run Go tests to verify all implementations
- Report findings and identify any gaps

### 검증 결과

**Phase 0: Foundation** (구현 완료)

|Python yfinance|Go 구현|상태|
|---|---|---|
|curl_cffi TLS fingerprint|CycleTLS (Chrome JA3)|✅|
|Cookie/Crumb auth|AuthManager (Basic + CSRF)|✅|
|Proxy 설정|Config.SetProxy()|✅|
|Timeout 설정|Config.SetTimeout()|✅|
|Error 처리|YFError with codes|✅|

**Phase 1: Core Data** (구현 완료)

|Python 메서드|Go 메서드|상태|
|---|---|---|
|`ticker.info`|`Info()`|✅|
|`ticker.fast_info`|`FastInfo()`|✅|
|`ticker.history()`|`History()`|✅|
|`ticker.dividends`|`Dividends()`|✅|
|`ticker.splits`|`Splits()`|✅|
|`ticker.actions`|`Actions()`|✅|
|`Quote data`|`Quote()`|✅|
|`History metadata`|`GetHistoryMetadata()`|✅|

**Phase 2: Options** (구현 완료)

|Python 메서드|Go 메서드|상태|
|---|---|---|
|`ticker.options`|`Options()`|✅|
|`ticker.option_chain()`|`OptionChain()`|✅|
|Expiration dates|`OptionChainAtExpiry()`|✅|
|Strike prices|`Strikes()`|✅|

**Phase 3: Financials** (구현 완료)

|Python 메서드|Go 메서드|상태|
|---|---|---|
|`ticker.income_stmt`|`IncomeStatement("annual")`|✅|
|`ticker.quarterly_income_stmt`|`IncomeStatement("quarterly")`|✅|
|`ticker.balance_sheet`|`BalanceSheet("annual")`|✅|
|`ticker.quarterly_balance_sheet`|`BalanceSheet("quarterly")`|✅|
|`ticker.cash_flow`|`CashFlow("annual")`|✅|
|`ticker.quarterly_cash_flow`|`CashFlow("quarterly")`|✅|

- 참고: Python의 `ttm_income_stmt`, `ttm_cash_flow` (trailing 12 months)는 Go에서 `freq="trailing"` 파라미터로 지원

**Phase 4: Analysis** (구현 완료)

|Python 메서드|Go 메서드|상태|
|---|---|---|
|`ticker.recommendations`|`Recommendations()`|✅|
|`ticker.analyst_price_targets`|`PriceTarget()`|✅|
|`ticker.earnings_estimate`|`EarningsEstimates()`|✅|
|`ticker.revenue_estimate`|`RevenueEstimates()`|✅|
|`ticker.eps_trend`|`EPSTrend()`|✅|
|`ticker.eps_revisions`|`EPSRevisions()`|✅|
|`ticker.earnings_history`|`EarningsHistory()`|✅|
|`ticker.growth_estimates`|`GrowthEstimates()`|✅|

**미구현 기능 (Phase 5 이후 예정)**

|Python 기능|Phase|
|---|---|
|major_holders|Phase 5|
|institutional_holders|Phase 5|
|mutualfund_holders|Phase 5|
|insider_transactions|Phase 5|
|insider_purchases|Phase 5|
|insider_roster_holders|Phase 5|
|calendar|Phase 5|
|sustainability|Phase 9|
|isin|Phase 9|
|news|Phase 9|
|earnings_dates|Phase 9|
|upgrades_downgrades|Phase 4 확장 가능|
|sec_filings|Phase 9|
|shares / shares_full|Phase 5|
|capital_gains|Phase 1 확장 가능|
|funds_data|Phase 9|
|live() WebSocket|Phase 8|

### 평가

- 모든 핵심 기능(Quote, History, Options, Financials, Analysis) 완벽 구현
- Python과 동일한 API 엔드포인트 사용
- 캐싱 전략 일관성 있게 적용
- 적절한 에러 처리 및 타입 안전성
- 38개 단위 테스트 모두 통과

### 개선 가능 사항

- upgrades_downgrades: Python에서 `quote.py`의 `_quote` 데이터에서 가져옴 → Phase 4에 추가 가능
- capital_gains: History API에서 이미 데이터 수신 중, 별도 메서드 추가 가능
- TTM(Trailing Twelve Months) 재무제표: 현재 `freq="trailing` 지원됨