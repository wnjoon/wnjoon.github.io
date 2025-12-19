---
layout: post
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #3"
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 세번째 포스팅입니다."
categories: dev
draft: false
lang: ko
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Claude Code를 활용해서 go 버전의 yahoo finance 라이브러리 만들기 #3"
  "description": "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 세번째 포스팅입니다."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## yfinance와 일치하고 있을까?

제가 go-yfinance를 구현하는 목적은 Go로 작성된 Yahoo Finance 라이브러리가 없기 때문입니다. 무식해 보일수도 있지만, 불과 얼마전까지만 해도 Python으로 구현된 yfinance를 서버로 구현해서 API 호출을 통해 결과를 받는 경우도 있었습니다. 물론 그 당시에도 Go로 컨버팅된 라이브러리를 만들 수 있었을겁니다. 다만 하나씩 분석하고 구현하는데 꽤 오랜 시간이 걸렸을테죠.

지금은 AI를 가지고 몇달이 걸릴 일을 몇일만에 해낼 수 있게 되었습니다. 지금 제가 진행하고 있는 go-yfinance도 마찬가지입니다. 이미 너무나 잘 구현되어 있는 yfinance 라이브러리를 Claude Code에게 학습시키고, Go로 컨버팅 가능한지 확인한 후 단계별로 작업을 진행하고 있습니다. 

오늘도 '실용적인 수준으로 사용 가능한 범위(~Phase 4)'를 구현하도록 가이드했고, [블로그 글](https://wnjoon.github.io/2025/12/19/go-yfinance-1/)도 작성했습니다. 그런데 문득 이런 궁금증이 생겼습니다.

<br>

*👨🏻‍💻: go-yfinance에서 제공하는 메소드, 파라미터, 그리고 결과값이 yfinance와 동일하게 지원되고 있을까?*

<br>

사실 꽤 중요한 부분이었습니다. 왜냐하면 제 목적은 **yfinance를 익숙하게 사용하던 개발자들이, Go를 사용하더라도 동일한 방식으로 함수를 사용할 수 있도록 하는 것**이기 때문입니다. 어떠한 메소드가 있는지, 그리고 어떻게 호출해야 하는지 다시 학습해야 한다거나, 메소드를 호출했을 때의 결과가 어떻게 나올지 다시 알아야 하는 등의 수고로움이 없어야 한다고 생각했습니다.

그래서 나머지 Phase를 구현하기 전에, Claude Code에게 질문했습니다.

<br>

*👨🏻‍💻: 지금까지 작성된 go-yfinance에서 제공하는 메소드, 파라미터, 그리고 결과값의 구조가 python의 yfinance에서 제공하는것과 동일한지 확인해줘. 사용자의 혼란을 줄이기 위해서는 사용되는 언어만 다르고 나머지는 모두 동일해야 할 것 같거든? 언어의 특성상 Public/Private 메소드의 차이로 인한 대소문자 구분 정도만 제외하고 나머지가 모두 동일한지 한번 검토해줘. ultrathink.*

<br>

## Python yfinance와 Go go-yfinance 분석 결과

다행이도 대부분이 일치하는 상태로 확인되었지만, 일부 달라진 부분이 있었습니다. 

### 메서드 이름 불일치

|기능|Python yfinance|Go go-yfinance|권장 수정|
|---|---|---|---|
|History|`ticker.history(...)`|ticker.History(params)|✅ OK (대소문자만 다름)
|Financials (income)|`ticker.income_stmt / get_income_stmt(freq="quarterly")`|`ticker.IncomeStatement(freq)`|⚠️ Python은 income_stmt|
|Financials (balance)|`ticker.balance_sheet / get_balance_sheet()`|`ticker.BalanceSheet(freq)`|⚠️ Python은 balance_sheet|
|Financials (cashflow)|`ticker.cash_flow / get_cash_flow()`|`ticker.CashFlow(freq)`|⚠️ Python은 cash_flow|
|Options list|`ticker.options (property, tuple)`|`ticker.Options() (method, []time.Time)`|⚠️ Python은 property|
|Option chain|`ticker.option_chain(date)`|`ticker.OptionChain(date)`|✅ OK|
|Price target|`ticker.analyst_price_targets`|`ticker.PriceTarget()`|⚠️ 이름 불일치|
|Recommendations|`ticker.recommendations`|`ticker.Recommendations()`|✅ OK|
|EPS Trend|`ticker.eps_trend`|`ticker.EPSTrend()`|⚠️ 언더스코어 vs CamelCase|
|EPS Revisions|`ticker.eps_revisions`|`ticker.EPSRevisions()`|⚠️ 언더스코어 vs CamelCase|
|Earnings Estimate|`ticker.earnings_estimate`|`ticker.EarningsEstimates()`|⚠️ 단수 vs 복수|
|Revenue Estimate|`ticker.revenue_estimate`|`ticker.RevenueEstimates()`|⚠️ 단수 vs 복수|
|Earnings History|`ticker.earnings_history`|`ticker.EarningsHistory()`|✅ OK|
|Growth Estimates|`ticker.growth_estimates`|`ticker.GrowthEstimates()`|✅ OK|

### 파라미터 이름 불일치

**History 메서드**

|Python 파라미터|Go 파라미터|불일치|
|---|---|---|
|period|Period|✅ OK|
|interval|Interval|✅ OK|
|start|Start|✅ OK|
|end|End|✅ OK|
|prepost|PrePost|✅ OK|
|auto_adjust|AutoAdjust|⚠️ Python: snake_case|
|actions|Actions|✅ OK|
|repair|Repair|✅ OK|
|keepna|KeepNA|⚠️ Python: keepna (소문자)|
|back_adjust|❌ 없음|⚠️ Go에 없음|
|rounding|❌ 없음|⚠️ Go에 없음|
|timeout|❌ 없음|⚠️ Go에 없음 (Config에서 설정)|
|raise_errors|❌ 없음|⚠️ Go는 error 반환 방식 사용|

**Financials 메서드**

|Python 파라미터|Go 파라미터|불일치|
|---|---|---|
|freq="yearly"|freq="annual"|⚠️ "yearly" vs "annual"|
|freq="quarterly"|freq="quarterly"|✅ OK|
|freq="trailing"|freq="trailing"|✅ OK|
|pretty=True|❌ 없음|⚠️ Go에 없음|
|as_dict=False|❌ 없음|⚠️ Go는 struct 반환|

### 반환값 구조 불일치

**History 반환값**

|Python|Go|불일치|
|---|---|---|
|pd.DataFrame|[]models.Bar|⚠️ DataFrame vs Slice|
|컬럼: Open, High, Low, Close, Adj Close, Volume|필드: Open, High, Low, Close, AdjClose, Volume|⚠️ Adj Close vs AdjClose|
|컬럼: Dividends, Stock Splits|필드: Dividends, Splits|⚠️ Stock Splits vs Splits|
|Index: DatetimeIndex|필드: Date time.Time|⚠️ Index vs 필드|

**Options 반환값**

|Python|Go|불일치|
|---|---|---|
|tuple of date strings|[]time.Time|⚠️ string vs time.Time|
|OptionChain.calls → pd.DataFrame|OptionChain.Calls → []Option|⚠️ DataFrame vs Slice|

**Financials 반환값**

|Python|Go|불일치|
|---|---|---|
|pd.DataFrame (rows=fields, cols=dates)|FinancialStatement (map[field][]items)|⚠️ 구조 다름|
|Index: camelCase field names|Map keys: CamelCase|✅ OK|
|Columns: pd.DatetimeIndex|Dates []time.Time|⚠️ 접근 방식 다름|

**FastInfo 반환값**

|Python 키|Go 필드|불일치|
|---|---|---|
|currency|Currency|✅ OK|
|quoteType|QuoteType|✅ OK|
|lastPrice|LastPrice|✅ OK|
|previousClose|PreviousClose|✅ OK|
|regularMarketPreviousClose|RegularMarketPreviousClose|✅ OK|
|fiftyDayAverage|FiftyDayAverage|✅ OK|
|twoHundredDayAverage|TwoHundredDayAverage|✅ OK|
|tenDayAverageVolume|TenDayAverageVolume|✅ OK|
|threeMonthAverageVolume|ThreeMonthAverageVolume|✅ OK|
|marketCap|MarketCap|✅ OK|
|yearHigh|YearHigh|✅ OK|
|yearLow|YearLow|✅ OK|
|yearChange|YearChange|✅ OK|

## 불일치하는 부분 수정할 계획 세우기

Claude Code는 불일치한 부분들을 정리해서, 중요도 순으로 나열해주었습니다.

**높은 우선순위 (API 호환성)**

- Financials freq 파라미터: "yearly" → "annual" 통일 필요
  - Python: `get_income_stmt(freq="yearly")` 가 기본값
  - Go: "annual" 사용 중
  - 권장: Go에서 "yearly"도 "annual"로 매핑하도록 수정

- 메서드 이름 일관성
  - `PriceTarget()` → `AnalystPriceTargets()` (Python과 일치)
  - `EarningsEstimates()` → `EarningsEstimate()` (단수형)
  - `RevenueEstimates()` → `RevenueEstimate()` (단수형)

**중간 우선순위 (편의성)**

- History 파라미터 추가
  - `BackAdjust bool` 추가
  - `Rounding bool` 추가
- Bar 필드 이름
  - `AdjClose` → JSON tag에 `adj_close` 또는 `adjclose` 추가 고려
  - `Splits` → `StockSplits` 추가 고려 (alias)

**낮은 우선순위 (언어 관례)**

- Go 언어 관례 유지
  - CamelCase 메서드명 유지 (Go 표준)
  - Property 대신 Method 사용 유지 (Go 표준)
  - struct 반환 유지 (Go는 DataFrame 없음)

핵심기능은 대부분 일치하나, 파라미터 값(freq="yearly" vs "annual")이 다른 점과 일부 메소드 이름이 일치하지 않다는 것을 확인했습니다. 그리고 Python에서 제공하는 DataFrame 구조를 Go에서 사용할 수 없기 때문에, 대신 Struct/Slice 구조를 사용할 수 밖에 없었습니다.

|카테고리|일치|불일치|수정 필요|
|---|---|---|---|
|메서드 이름|8|6|3개 권장|
|파라미터 이름|6|6|1개 필수|
|반환값 구조|-|4개 타입 다름|Go 언어 특성상 불가피|
|필드 이름|대부분 일치|2-3개|선택적|

## 작업 결과

### 변경 사항 요약

|변경 내용|파일|설명|
|---|---|---|
|`freq="yearly"` 지원|financials.go|Python yfinance와 동일하게 "yearly"를 "annual"로 매핑|
|`AnalystPriceTargets()`|analysis.go|Python의 `analyst_price_targets`와 일치|
|`EarningsEstimate()`|analysis.go|Python의 `earnings_estimate`와 일치 (단수형)|
|`RevenueEstimate()`|analysis.go|Python의 `revenue_estimate`와 일치 (단수형)|
|테스트 추가|financials_test.go|`TestNormalizeFrequency` 추가|

### 하위 호환성

기존 메서드도 deprecated alias로 계속 동작하도록 유지했습니다.

- `PriceTarget()` → `AnalystPriceTargets()` 호출
- `EarningsEstimates()` → `EarningsEstimate()` 호출
- `RevenueEstimates()` → `RevenueEstimate()` 호출

