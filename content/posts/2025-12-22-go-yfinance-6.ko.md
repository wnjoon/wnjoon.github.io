---
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #6"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-12-22"
slug: "go-yfinance-6"
summary: "Claude Code로 개발한다는 놈이 왜 CLAUDE.md에 소홀했을까요. 반성합니다."
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 여섯번째 포스팅입니다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "ai", "claude code", "go", "go-yfinance", "2025"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/12/20/go-yfinance-5/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## CLAUDE.md 만들기 (이제서야)

남은 Phase들을 개발해달라고 요청했는데, Claude Code가 예상하지 못한 작업을 진행했습니다. 현재 작업 리포지토리는 아래와 같이 구성되어 있습니다.

```
yfinance-main
ㄴ yfinance
ㄴ go-yfinance
ㄴ ...
```

지금까지 [ranaroussi/yfinance](https://github.com/ranaroussi/yfinance) 리포지토리를 직접 다운받은 후, 이 내부에 go-yfinance 리포지토리를 생성해서 yfinance의 기능들을 하나씩 확인하고 비교하면서 구현하고 있었습니다. 

그런데 갑자기 Claude Code가 yfinance의 API 목록을 Web으로부터 조회할 수 있게 해달라고 요청하더라구요. 이전까지 다른 Phase를 개발할떄에는 이러지 않았는데, 안되겠다 싶어서 우선 작업 방식을 CLAUDE.md에 정의해야겠다고 생각했습니다. 네, 이전 포스팅에서 제가 **귀찮은 마음에 그냥 개발을 시킨** 결과가 항상 잘 해오던 작업을 갑자기 변경하는 결과를 만든 것 같았습니다.

<br>

*👨🏻‍💻: 지금까지 우리가 개발하면서 가져왔던 정책들을 CLAUDE.md 안에다 작성해줘. 이 프로젝트안에서만 동작할 수 있도록 설정해줘.*

<br>

작성된 [CLAUDE.md](https://github.com/wnjoon/go-yfinance/blob/main/CLAUDE.md)는 아래의 내용을 포함합니다. go-yfinance에서 작업이 시작되면 자동으로 CLAUDE.md가 로드되고, 모든 개발지침이 자동으로 적용됩니다.

**프로젝트 정체성 및 참조 원칙**

- 목표: Python의 yfinance 라이브러리를 Go 언어로 포팅(이식)하는 프로젝트
- 참조 원칙 (CRITICAL):
  - 기능 구현 시 웹 검색을 하지 않고, 로컬에 위치한 Python yfinance 소스 코드를 직접 분석하여 참조
  - 메서드 이름, 파라미터, 반환 타입 등은 Python 버전과 일관성을 유지

**개발 워크플로우 (Workflow)**

- 새로운 기능을 개발할 때 다음 단계를 준수할 것
  - 준비: `STATUS.md` 확인 및 `main` 브랜치 동기화
  - 개발:
    - `phase{N}/{feature-name}` 브랜치 생성
    - 기존 코드 패턴(`pkg/ticker`, `pkg/models`) 준수
    - 반드시 유닛 테스트 작성
  - 문서화: `doc.go` 파일들에 주석 추가하고 `STATUS.md` 업데이트

**API 일관성 (Consistency)**

- Python yfinance와 Go go-yfinance 간의 메서드 매핑을 엄격히 관리
  - 네이밍: Python의 snake_case를 Go의 PascalCase로 변환 (예: `major_holders` → `MajorHolders`)
  - 매핑 테이블: `InsiderRosterHolders`, `AnalystPriceTargets` 등 구체적으로 명시된 매핑 규칙 준수

**완료 체크리스트 (Definition of Done)**

- main 브랜치에 병합하기 전 다음 과정을 수행
  - 테스트(go test) 및 빌드(go build) 통과
  - Python 버전과의 API 일치 여부 검증
  - 문서 생성: make docs 명령어를 실행하여 로컬에서 docs/API.md를 생성 및 검증 (CI/CD 의존 X)
  - 생성된 문서를 포함하여 커밋 및 푸시

**코드 스타일 및 도구**

- 주석: gomarkdoc 호환 주석 및 예제(Example) 포함
- 하위 호환성: 메서드 이름 변경 시 Deprecated Alias를 유지하여 호환성 보장
- Makefile: build, test, docs, lint 명령어 사용

**이슈 대응**

- CycleTLS 패닉 처리 및 Git 환경변수 설정 관련 지침 포함

## 이제는 온전히 맡기기, 하지만 간섭을 곁들인.

CLAUDE.md까지 작성하고나서 Claude Code가 알아서 잘 만들어주고 있다고 생각했습니다. 하지만 이전처럼 '갑자기 Web에서 API를 조회하는 일'처럼, 물론 지침문서를 만들긴 했지만 계속해서 확인은 필요하다고 생각했습니다.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/4a30789d-edb7-4193-bdb5-6c1a928ac4ec/image.png)

<br>

[Kim Wooyeong](https://www.linkedin.com/in/wooing/)님이 작성하신 [포스트](https://www.linkedin.com/posts/wooing_claude-code%EB%A5%BC-%EC%93%B8-%EB%95%8C%EB%8A%94-%EB%82%B4%EA%B0%80-%EC%97%84%EC%B2%AD-%EC%9E%90%EC%A3%BC-%EA%B0%9C%EC%9E%85%ED%95%B4%EC%A4%98%EC%95%BC-%ED%95%9C%EB%8B%A4-%EA%B0%9C%EC%9E%85%EC%9D%84-activity-7408090307247976449-sBPP?utm_source=share&utm_medium=member_desktop&rcm=ACoAACX_74kB5FHdEvU5kLzcald4RDFZSjBrrKA)애도 나와있듯이, Claude Code에 모든 지침을 적었다고 생각해서 모든것을 위임하면 안된다고 생각합니다. 계속 피드백을 주고, 추가적인 검증과 질문을 단계마다 진행했을 때 확실히 퀄리티가 올라가는 것을 느꼈습니다.

### Go 함수명 규칙을 지켜야할까?

예를 들어, Phase7의 구현이 완료되었다고 한 Claude Code의 보고서에서 Python yfinance API 매핑 결과는 다음과 같았습니다.

|Python|Go|
|---|---|
|`yf.Tickers(symbols)`|`multi.NewTickers(symbols)`|
|`tickers.tickers[symbol]`|`tickers.Get(symbol)`|
|`tickers.history()`|`tickers.History(params)`|
|`yf.download(symbols)`|`multi.Download(symbols, params)`|

이중 제가 의문이 생긴것은 `tickers.tickers[symbol]` -> `tickers.Get(symbol)` 로 작성한 부분이었습니다. yfinance의 원칙을 그대로 준수할 것을 요청했는데, Claude Code는 Get이라는 이름으로 함수를 생성했습니다. 그래서 Claude Code에게 질문했습니다.

<br>

*👨🏻‍💻: yfinance의 함수명 규칙을 그대로 준수하고 싶은데, ticers.tickers[symbol] 부분을 tickers.Get(symbol)로 작성하는게 좋은 방법일까?*

*🤖: Go 구현에서는 Get(symbol) 메서드로 만들었는데, 이는 Go에서 더 관용적인 방식입니다. Python처럼 public 필드로 노출하려면 옵션 1인 tickers.Get("AAPL")을 사용해서 Go 스타일 메서드로 생성하는 현재 방식이나, 옵션 2인 tickers.Tickers["AAPL"]를 사용해서 public map 필드로 노출하는 방식이 있습니다. Python API와 정확히 일치시키려면 Tickers 필드를 public으로 노출할 수 있습니다*

<br>

아마도 Go의 구현 철학을 만족하기 위한 방법으로 이렇게 함수를 만든 것이라고 예상은 했습니다. 하지만 처음에 이 라이브러리를 컨버팅하면서도 생각했지만, **최대한 Python yfinance의 원칙을 그대로 준수하는 것이 중요하나, 언어의 특성상 어쩔 수 없이 다르게 구현해야할 경우가 분명 있을 수 있다**고도 생각했습니다. 그래서 이미 다른 기능들도 이렇게 Go 스타일을 유지하고 있는지 질문했습니다. 만약 다른 메소드들이 yfinance의 원칙을 그대로 유지하고 있다면 이 부분을 같이 바꿔줘야겠지만, 다른 부분들도 Go 스타일을 만족하고 있다면 구현 방향은 일치하고 있다고 생각했습니다.

다음은 Phase7까지 개발된 모든 메소드들의 분석 결과입니다.

|Python yfinance|Go go-yfinance|일치 여부|
|---|---|---|
|**Core**|-|-|
|`Ticker(symbol)`|`ticker.New(symbol)`|✅ Go 스타일|
|`ticker.ticker`|`t.Symbol()`|✅|
|`ticker.history()`|`t.History(params)`|✅|
|`ticker.info`|`t.Info()`|✅|
|`ticker.fast_info`|`t.FastInfo()`|✅|
|**Quote**|-|-|
|`ticker.quote (내부)`|`t.Quote()`|✅|
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
|`yf.Tickers(symbols)`|`multi.NewTickers(symbols)`|✅ Go 스타일|
|`tickers.tickers[symbol]`|`tickers.Get(symbol)`|✅ Go 스타일|
|`tickers.history()`|`tickers.History(params)`|✅|
|`yf.download()`|`multi.Download()`|✅|
|**Search**|-|-|
|`yf.Search(query)`|`search.Search(query)`|✅|
|**Screener**|-|-|
|`yf.Screener.get_screeners()`|`screener.Screen()`|✅|

Phase 8-9에 있는 미구현된 함수들을 제외하면, 구현된 모든 내용이 일관성있게 매핑되어 있음을 확인할 수 있었습니다.

추가로 매 단계가 진행될때마다, (불필요할 수 있지만) 문서가 제대로 작성되었는지를 꼭 다시한번 확인했습니다. 사실 이건 제가 Claude Code에게 100% 업무를 위임하지 못한다는 것도 있지만, 또 한편으로는 관리자로써 당연히 작업된 내용을 확인하는 것은 의무라고 생각했기 때문입니다.

### 패키지명이 달라도 괜찮을까?

Phase8을 구현하던 중, Websocket에 대한 패키지의 이름이 `live`로 구현되어 있었습니다. 그래서 python에서 `yf.WebSocket()`으로 호출되던 	부분이 Go에서는 `live.New()`로 변경되었는데, 이렇게 구현한 이유에 대해 물어보았습니다.

<br>

*👨🏻‍💻: Websocket과 관련된 패키지 이름을 live로 한 이유가 있을까?*

<br>

알고보니 Python yfinance의 파일명이 `live.py`이고, 클래스들도 `WebSocket`, `AsyncWebSocket`이 `live` 모듈에 있어서 동일하게 맞춰졌던 것 이었습니다. 

```python
# Python yfinance
from yfinance.live import WebSocket
```

stream, websocket, realtime 등 Claude Code가 차선책으로 제시한 이름들도 있었지만, Python과 동일하게 가져가는 것이 더 옳다고 판단했습니다. 그리고 실제로 Go에서 사용했을 때, Python yfinance와 일관성이 있어서 혼란없이 사용 가능하다고 생각했습니다.

```go
import "github.com/wnjoon/go-yfinance/pkg/live"

ws, _ := live.New()
ws.Subscribe([]string{"AAPL"})
ws.Listen(handler)
```

## Phase 6-9까지의 구현 결과

### Phase 6: Search & Lookup

**코드 구현**

- Search 패키지(`pkg/search/search.go`): Search, SearchWithParams, Quotes, News 메서드
- Screener 패키지(`pkg/screener/screener.go`): Screen, ScreenWithQuery, DayGainers, DayLosers, MostActives 메서드
- Models(`pkg/models/search.go`, `pkg/models/screener.go`): 모든 데이터 구조체

**테스트**

- 모든 테스트 통과 (go test ./pkg/search/... ./pkg/screener/... -v)

**문서**

- `pkg/search/doc.go`, `pkg/screener/doc.go` - 패키지 문서
- `pkg/models/doc.go` - Search/Screener 타입 추가
- `STATUS.md` - Phase 6 완료 상태 업데이트
- `docs/API.md` - make docs로 자동 생성 완료

**Python yfinance API 일관성**

|Python yfinance|Go 구현|
|---|---|
|`yf.search(query)`|`search.Search(query)`|
|`Screener().set_predefined_body(name)`|`screener.Screen(name, params)`|
|`Screener().set_body(query)`|`screener.ScreenWithQuery(query, params)`|
|쿼리 연산자 (EQ, GT, LT, AND, OR 등)|`models.OpEQ`, `models.OpGT` 등 동일|
|Predefined screeners (day_gainers 등)|`models.ScreenerDayGainers` 등 동일|

### Phase 7: Multi-ticker & Batch

**신규 파일**

- `pkg/models/multi.go`: `DownloadParams`, `MultiTickerResult` 모델
- `pkg/multi/multi.go`: `Tickers` 구조체, `Download` 함수
- `pkg/multi/multi_test.go`: 유닛 테스트

**주요 기능**

- `multi.NewTickers(symbols)`: 심볼 슬라이스로 Tickers 생성
- `multi.NewTickersFromString(str)`: 문자열로 Tickers 생성 (공백/쉼표 구분)
- `tickers.Get(symbol)`: 개별 티커 접근
- `tickers.History(params)`: 전체 티커 히스토리 다운로드
- `multi.Download(symbols, params)`: 독립 함수로 배치 다운로드
- Worker pool 패턴으로 병렬 처리 지원 (Threads 파라미터)

**Python yfinance API 매핑**

|Python	Go|
|---|---|
|`yf.Tickers(symbols)`|`multi.NewTickers(symbols)`|
|`tickers.tickers[symbol]`|`tickers.Get(symbol)`|
|`tickers.history()`|`tickers.History(params)`|
|`yf.download(symbols)`|`multi.Download(symbols, params)`|

### Phase 8: Real-time WebSocket

**신규 파일**

- `pkg/models/live.go`: `PricingData` 구조체 (33개 필드), `MarketState` 타입
- `pkg/live/proto.go`: Protobuf 디코더 (Base64 + protobuf 파싱)
- `pkg/live/websocket.go`: WebSocket 클라이언트
- `pkg/live/doc.go`: 패키지 문서
- `pkg/live/live_test.go`: 유닛 테스트

**주요 기능**

- `live.New()`: WebSocket 클라이언트 생성
- `ws.Subscribe(symbols)`: 심볼 구독
- `ws.Unsubscribe(symbols)`: 구독 해제
- `ws.Listen(handler)`: 블로킹 리스닝
- `ws.ListenAsync(handler)`: 비동기 리스닝
- `ws.Close()`: 연결 종료
- 자동 heartbeat (15초마다 재구독)
- 자동 재연결

**Python yfinance API 매핑**

|Python|Go|
|---|---|
|`yf.WebSocket()`|`live.New()`|
|`ws.subscribe(symbols)`|`ws.Subscribe(symbols)`|
|`ws.listen(handler)`|`ws.Listen(handler)`|
|`ws.close()`|`ws.Close()`|

### Phase 9: Python yfinance Advanced Features

**추가된 기능**

- News Feed (`pkg/ticker/news.go`)
  - `ticker.News(count, tab)`: 뉴스 기사 조회
  - `ticker.GetNews()`: 기본 파라미터로 뉴스 조회
  - 광고 필터링 포함
- Cache Layer (`pkg/cache/cache.go`)
  - Thread-safe TTL 기반 인메모리 캐시
  - 자동 만료 항목 정리
  - 글로벌 캐시 인스턴스
- Timezone Utilities (`pkg/utils/timezone.go`)
  - 50+ 글로벌 거래소 시간대 매핑
  - `GetTimezone()`, `IsValidTimezone()`, `ConvertToTimezone()`
  - `MarketIsOpen()`: 기본 시장 시간 체크

## 정리

이렇게 yfinance를 분석해서 Claude Code에게 동일한 기능을 갖는 Go 라이브러리 제작을 요청해보았습니다. 기간으로 보면 약 3일정도 걸렸는데, 실제로 작업한 시간으로 보면 대략 6-7시간 정도 걸렸습니다. 아마 CLAUDE.md를 더욱 꼼꼼하게 작성했거나, 중복된 검증을 계속해서 요청하지 않았더라면 훨씬 빠르게 작업할 수 있었을 것 같습니다.

처음에는 [강의](https://nomadcoders.co/ai-agents-masterclass?gad_source=1&gad_campaignid=18141167485&gbraid=0AAAAACQEcGgB28vYn3MvB7rhLJ-guDeaI&gclid=Cj0KCQiA6Y7KBhCkARIsAOxhqtM01uDU_sqgVSqN3XMhxFpk9dDyzL1A6kZ0a1GY_Y7gsTcbOAwz8gIaAtf1EALw_wcB)에서 진행하는 **투자 전략 에이전트**를 만들다가 Go로 된 yfinance 라이브러리가 없어서 시작한 사이드 프로젝트였습니다. 그냥 Python 공부한다고 생각하고 강의를 그대로 따라갔어도 되었을텐데, Google ADK에서 Go를 지원하는데 굳이 Go를 사용해보지 않을 이유가 있나 하고 생각하고 시작한게 여기까지 왔네요.

물론 오픈소스의 아이디어와 로직을 차용했지만, 혹시 몰라 [ranaroussi/yfinance의 Discussion](https://github.com/ranaroussi/yfinance/discussions/2647#discussioncomment-15310537)란에 아래와 같이 문의를 남겨놓았습니다.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/e6f0189a-828a-4679-8a8f-943b27067274/image.png)

<br>

Gemini에게 혹시나 하는 궁금증에 질문을 좀 해봤습니다.

<br>

*👨🏻‍💻: Python에서 사용하는 yfinance의 로직과 구조를 참조해서 Go에서 사용 가능한 라이브러리를 한번 만들어봤어. yfinance가 오픈소스이긴 하지만, 혹시 이렇게 구현해서 라이브러리로 만들어도 괜찮을지 메일을 보냈는데 아직 답장이 없네. 혹시 이런 경우에 문제가 되는 경우가 있을까?*

<br>

Gemini의 답변을 정리해보면 다음과 같습니다.

- yfinance는 현재 Apache License 2.0 (또는 프로젝트 버전에 따라 MIT 등)과 같은 퍼미시브(Permissive) 라이선스를 따르고 있을 확률이 높습니다. 파이썬 코드를 Go로 변환하는 것은 일종의 **포팅**입니다. 오픈소스 라이선스는 대부분 코드를 수정, 배포, 다른 언어로의 이식을 허용합니다.
- Yahoo Finance에서 데이터를 가져오는 로직이나 함수 구조 자체는 저작권 보호 대상인 '표현' 이라기보다는 '아이디어'나 '기능'에 가깝습니다. 따라서 파이썬 코드를 그대로 복사+붙여넣기 한 것이 아니라, Go 언어의 특성에 맞게 재구현(Re-implementation) 했다면 코드 저작권 침해 가능성은 낮습니다. 
- 원작자를 존중하고 라이선스 규정을 지키기 위해, 깃허브 README 등에 **이 프로젝트는 Python의 yfinance 라이브러리에서 영감을 받아 제작되었습니다(Inspired by yfinance)** 라고 명시하고 원본 링크를 거는 것이 관례이자 안전한 방법입니다.
- Yahoo Finance는 현재 공식적으로 무료 API를 제공하지 않습니다. yfinance나 사용자가 만든 Go 라이브러리는 웹 페이지를 크롤링하거나 비공식 내부 API 엔드포인트를 호출하는 방식을 사용할 것입니다. 단, Yahoo의 이용 약관은 일반적으로 자동화된 데이터 수집(스크래핑)을 금지합니다.
- Yahoo 측에서 언제든 IP를 차단하거나 구조를 변경할 수 있으며, 만약 이를 상업적으로 이용하거나 과도한 트래픽을 유발하면 법적 제재를 받을 소지가 있습니다.

그리고 최종적으로 README.md에 ranaroussi/yfinance의 로직을 참조하여 Go로 구현한 비공식(Unofficial) 라이브러리입니다"라고 명확히 적고, Yahoo Finance의 공식 API가 아니며, 언제든 데이터 수집이 막힐 수 있다"는 점을 고지할 것을 제안했습니다.

그래서 README.md에 아래와 같은 내용을 추가하기로 했습니다.

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

이제 다음에는 실제로 go 라이브러리에 등록해보려고 합니다. 이부분도 한번 Claude Code에게 맡겨볼 생각입니다.