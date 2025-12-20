---
layout: post
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #5"
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 다섯번째 포스팅입니다."
categories: dev
draft: false
lang: ko
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Claude Code를 활용해서 go 버전의 yahoo finance 라이브러리 만들기 #5"
  "description": "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 다섯번째 포스팅입니다."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## 남은 개발 범위 확인하기

Claude Code와 Gemini를 이용한 분석에 의하면, 현재까지 진행된 범위(~Phase 4)까지면 실용적으로 사용 가능한 기능은 모두 구현되어있는 상태입니다. 이제 남은 부분은 yfinance가 제공하고 있는 남은 기능들을 구현하는 일입니다.

대략 5개의 추가 Phase가 남았는데요, 각 단계별로 어떤 작업이 진행될지 먼저 정리해보았습니다.

### Phase 5: Holdings & Actions (난이도: ★★☆☆☆)

기존 quoteSummary API 패턴을 그대로 활용하므로 난이도가 낮을 것으로 예상되었습니다.

|메소드|설명|
|---|---|
|`MajorHolders()`|보유자 비율 분석|
|`InstitutionalHolders()`|기관 투자자 목록|
|`MutualFundHolders()`|뮤추얼 펀드 목록|
|`InsiderTransactions()`|내부자 거래 내역|
|`InsiderRoster()`|내부자 명단|
|`Calendar()`|배당일, 실적발표일 등|

### Phase 6: Search & Lookup (난이도: ★★☆☆☆)

새로운 패키지로 독립적 구현 가능했고, 다양한 지원 타입(equity, mutualfund, etf, index, future, currency, cryptocurrency)이 이미 구현되어 있었습니다.

|기능|API Endpoint|
|---|---|
|Search|/v1/finance/search|
|Lookup|/v1/finance/lookup|

### Phase 7: Multi-ticker & Batch (난이도: ★★★☆☆)

Go의 goroutine을 활용한 병렬 처리가 필요한 부분입니다.

### Phase 8: Real-time WebSocket (난이도: ★★★★☆)

가장 복잡한 단계로 예상되며, WebSocket + Protobuf 디코딩이 필요합니다.

- Endpoint: wss://streamer.finance.yahoo.com/?version=2
- 메시지 포맷: Base64 인코딩된 Protobuf
- 실시간 가격, 거래량, 호가 등 스트리밍

### Phase 9: Advanced Features (난이도: ★★★☆☆)

점진적으로 구현할 부가 기능들입니다. 아마 가장 중요도는 낮아 보였습니다.

|기능|설명|
|---|---|
|Caching|메모리/파일 캐시 (SQLite)|
|Price Repair|100x 환율 오류, 스플릿 미반영 보정|
|Timezone|거래소별 타임존 처리|
|Market Calendar|휴장일, 반장일 관리|
|News|종목별 뉴스 피드|

## Holdings & Actions 구현하기

아래와 같이 구현 계획을 수립하고, 이전까지와 동일한 방식으로 작업을 요청했습니다.

- Create phase5/holdings branch from main
- Implement holder models (pkg/models/holders.go)
- Implement calendar model (pkg/models/calendar.go)
- Implement holders methods (pkg/ticker/holders.go)
- Implement calendar method (pkg/ticker/calendar.go)
- Write tests for holders and calendar
- Update documentation (doc.go files)
- Merge to main and update STATUS.md

다른건 다 잘 진행되었는데, 중간에 마음을 찜찜하게 만드는 로그가 있었습니다.

<br>

*🤖: 문서 생성에 문제가 있지만, CI/CD가 설정되어 있으므로 push하면 자동으로 생성될 것입니다. Phase 5 작업을 완료 처리하고.."*

<br>

## yfinance와의 불일치성이 여전히 존재한다

문서의 생성에 문제가 생겼다는 말에 Claude Code가 말하지 않은 잘못된 부분이 존재하지 않을지 생각해보았습니다. 가장 큰 부분은 yfinance 라이브러리의 메소드와의 불일치입니다. 이미 이전 [포스팅](https://wnjoon.github.io/2025/12/19/go-yfinance-2/)에서 확인했지만, 향후의 작업에서도 동일하게 이 문제가 발생하지 않을것이라 장담하지 못했습니다.

사실 이러한 공통적인 개발 내용은 별도의 문서에 작성하고, 이 문서를 모든 개발 단계마다 참조하도록 설정합니다. 저는 하나의 세션에서 계속 작업을 진행하고 있었고, Claude Code가 어느정도의 기억까지 이어서 개발할지 조금 궁금하긴 했습니다. 솔직히 말씀드리면, 귀찮은 마음에 그냥 개발을 시킨 제 잘못도 있었습니다 😅

<br>

*👨🏻‍💻: Phase5에 작성된 내용들이 yfinance(파이썬)의 해당 메소드의 형식(인풋, 아웃풋, 함수명 등)과 동일한지 확인해줘. 앞으로 다음 Phase 작업할때마다 항상 이 부분을 확인해줘. 물론 언어의 특성상 다를수밖에 없는 부분은 무시해도 좋아.*

<br>

|Python	go-yfinance	상태|
|---|---|---|
|`major_holders`|`MajorHolders()`|✅ OK (언어 컨벤션 차이)|
|`institutional_holders`|`InstitutionalHolders()`|✅ OK|
|`mutualfund_holders`|`MutualFundHolders()`|✅ OK|
|`insider_purchases`|`InsiderPurchases()`|✅ OK|
|`insider_transactions`|`InsiderTransactions()`|✅ OK|
|`insider_roster_holders`|`InsiderRoster()`|⚠️ 수정 필요|
|`calendar`|`Calendar()`|✅ OK|

수정이 필요(`InsiderRoster()` → `InsiderRosterHolders()`)한 부분이 있었습니다. yfinance의 함수명을 꼭 그대로 유지해달라는 요청을 하지 않았더니, 이렇게 불필요한 작업이 한번 더 발생했네요. 앞으로의 단계에서는 이 부분을 꼭 명시해야겠다고 생각했습니다.

## 문서 생성 방식 변경

이제 본 문제로 돌아가서, 문서 생성에 문제가 발생했지만 어차피 github action에서 문서를 작성하기 때문에 완료한다는 문구가 좀 찜찜하게 느껴졌습니다. 왜냐하면 문서가 정확하게 생성되었는지 개발단계에서 확인할 수 없었기 떄문입니다.

<br>

*👨🏻‍💻: 문서 생성에 문제가 있다고 했는데, 이 부분이 자동으로 생성된게 맞는지 확인해줘.*

<br>

분석 결과는 예상대로 *현재 로컬 커밋들이 아직 remote에 push되지 않았고, CI/CD는 main에 push될 때 자동으로 docs/API.md 생성*되기 떄문에, 현재 확인하기 어렵다고 했습니다.

이전 [포스팅](https://wnjoon.github.io/2025/12/19/go-yfinance-3/)에서 gomarkdoc을 이용해서 문서를 만드는 시점을 github action에 정의해서, main으로 push할때마다 자동으로 생성되도록 했었습니다. 그런데 실제로 진행하다보니 문제가 좀 있더라구요. 우선 문서의 권한을 github에 맡겨버리니, 문서가 제대로 생성되었는지 확인하려면 다시 main에서 pull을 받아야 했습니다.

<br>

*👨🏻‍💻: 생각해보니까 Github Action으로 문서를 만들게되면, 그 문서가 정상적으로 생성되었는지 확인하는게 쉽지 않을것 같아. 차라리 로컬에서 문서를 모두 만들고 검증한다음 github action에서는 이 동작을 수행하지 않는건 어떻게 생각해?*

<br>

Claude Code와의 대화를 통해 문서 생성 방식을 아래와 같이 변경하기로 했습니다.

- GitHub Actions: 문서 생성 제거 (빌드/테스트만 유지)
- pre-commit hook: 사용 안 함
- Makefile: make docs 명령어 추가
- 수동 실행: Phase 완료 시 make docs 실행 후 커밋

결국 자동화가 아닌 일반적으로 사용되는 방식으로 돌아가기로 했습니다. 

