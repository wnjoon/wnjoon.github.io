---
title: "go-yfinance v1.2.0 업데이트"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-02-19"
slug: "go-yfinance-v1-2-0-release-note"
summary: "단순 버전 업데이트를 넘어 Screener 모듈의 전면 재구현을 통해 python-yfinance와의 기능적 동등성을 완성했습니다."
description: "python-yfinance v1.2.0의 변경사항을 분석하고, 그 과정에서 발견된 Screener 모듈의 미구현 기능을 전면 보완하였습니다. 150여 개 거래소 매핑, 100여 개 필드 지원, 그리고 Yahoo Finance API의 숨겨진 버그에 대한 워커라운드까지 포함된 v1.2.0 업데이트를 소개합니다."
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
  "headline": "go-yfinance v1.2.0 업데이트"
  "description": "python-yfinance v1.2.0 반영 및 Screener 모듈 전면 재구현"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## ranaroussi/yfinance v1.2.0 업데이트 

[ranaroussi/yfinance가 v1.2.0으로 업데이트](https://github.com/ranaroussi/yfinance/releases/tag/1.2.0) 되었습니다. v1.0.0 릴리즈 이후에 마이너 버전 업데이트가 꽤 자주 이루어지는 것 같습니다.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/fda20c39-de8f-405d-90cb-42e2ed491ced/image.png)

<br>

## v1.1.0까지의 진행 상황

- 2025-12-18: go-yfinance 프로젝트 시작 — python-yfinance를 Go로 완전히 포팅하는 것이 목표
- 2025-12-23: v1.0.0 태그 릴리스 (Ticker, Multi, Screener, Market, Sector, Industry, Calendars 등 기본 패키지)
- 2026-01-26: v1.1.0 릴리스 — Price Repair 시스템 5개 Phase 구현 완료
  - Phase 1: 통계 유틸리티 (percentile, zscore, filter)
  - Phase 2: Capital Gains 이중계산 감지 + Stock Split 수리
  - Phase 3: 100x 통화 단위 오류 + 제로값 보간
  - Phase 4: 배당금 7가지 오류 유형 수정
  - Phase 5: ISO 10383 MIC 코드 60+ 거래소 매핑
  - 총 ~5,400줄, 96개 테스트 100% 통과
  
## v1.2.0 개발 히스토리

### 1. python-yfinance v1.2.0 변경사항 분석

python-yfinance v1.2.0의 변경사항을 Go에 반영해야 할 것이 있는지 분석했습니다. 
Non-screener 변경사항이 4건 있었는데, 모두 Go에 반영할 필요는 없어보였습니다.

- df._consolidate() 추가: Go 슬라이스는 이미 연속 메모리, pandas 블록 단편화 문제 없음
- flags.writeable 가드:  Go repair 패키지가 이미 make+copy 방어적 복사 수행
- 오타 수정 recieved→received: go-yfinance에 해당 오타 없음
- version.py 1.1.0→1.2.0: go-yfinance는 git 태그로 버전 관리

### 2. Screener 분석에서 v1.1.0부터의 미구현 기능 발견

하지만 python-yfinance v1.2.0의 screener exchange 맵 확장을 반영하려고 분석하던 중, go-yfinance에 v1.1.0부터 존재해야 할 screener 기능들이 통째로 빠져 있었다는 사실을 발견했습니다. 처음에 Claude Code에서 "초기에는 exchange 맵이 Go에 없으니 반영할 게 없다"고 결론을 내렸는데, **Python yfinance의 모든 기능을 정확히 구현**해야하는 목표와 맞지 않은것 같아 다시한번 제대로 분석해달라고 요청했습니다. 결국 Claude Code가 잘못 구현했음을 시인했고, 프로젝트 목표(python-yfinance 완전 동등 구현)를 재확인하고 방향을 수정했습니다.

무엇보다 v1.1.0을 배포할때, 누락된 기능이 있었다는걸 눈치채지 못한 제 잘못이 가장 컷습니다. 이미 존재하는 서비스를 새로운 언어로 혼자 포팅한다고 했을때, 아무리 꼼꼼하게 확인하고 테스트한다 하더라도 이러한 빈틈이 생기는건 어쩔수 없는 것 같습니다. 이런걸 보면 과연 AI에게 업무의 100%를 위임할 수 있는가에 대해서는 아직도 고민이 됩니다. 최근 읽은 책에서 '엔지니어링을 함께 해야하는 동료'로 AI를 접근해야한다는 말이 이해가 가는 상황이었습니다.

| 미구현 항목 | 설명 |
| --- | --- |
| EQUITY_SCREENER_EQ_MAP | 58개 region, ~150개 exchange 코드, 11개 sector, 118개 industry, 74개 peer group — 0% 구현 |
| FUND_SCREENER_EQ_MAP | 58개 region, ~140개 exchange 코드 — 0% 구현 |
| EQUITY_SCREENER_FIELDS | 12개 카테고리, ~91개 필드명 — 0% 구현 |
| FUND_SCREENER_FIELDS | 9개 필드명 — 0% 구현 |
| FundQuery 타입 | python-yfinance의 `FundQuery` 클래스에 대응하는 Go 타입 없음 |
| IS-IN 연산자 | 클라이언트 사이드에서 OR-of-EQ로 확장하는 연산자 미구현 |
| 쿼리 유효성 검증 | `_validate_eq_operand()` 등 클라이언트 사이드 검증 로직 전무 |
| Predefined Screener Queries | 15개 predefined 쿼리 바디 정의 없음 |
| quoteType 하드코딩 | `ScreenWithQuery`가 "equity"로 하드코딩 → Fund 스크리닝 구조적 불가능 |

### 3. feature/screener-parity 브랜치 생성 및 구현

feature/screener-parity 브랜치를 만들고 다음을 순차적으로 구현했습니다.

신규 파일(3개) 추가

- `pkg/models/screener_const.go` — Python `const.py`의 모든 screener 상수 Go 포팅
  - 11개 섹터 + 118개 산업 매핑
  - 57개 equity exchange region + 56개 fund exchange region
  - 74개 peer group
  - ~91개 equity 필드 + 9개 fund 필드
  - Python 버그도 그대로 재현 (income_statement의 쉼표 누락 문자열 연결)

- `pkg/models/screener_query.go` — `EquityQuery/FundQuery` 타입 + `ScreenerQueryBuilder` 인터페이스
  - `ToDict()`, `QuoteType()` 메서드
  - IS-IN → OR-of-EQ 자동 확장
  - 필드명/값 유효성 검증 로직

- `pkg/screener/predefined.go` — 15개 predefined screener 쿼리
  - Equity 9개 + Fund 6개
  - `init()`에서 `mustEquityQuery/mustFundQuery`로 fail-fast 구성

기존 파일(2개) 수정

- `pkg/models/screener.go` — Fund 전용 필드 6개 추가, `UserID/UserIDType`, `OpISIN` 상수
- `pkg/screener/screener.go` — `ScreenerQueryBuilder` 인터페이스 수용, `quoteType` 동적 결정, `offset>0 POST` 전환 워커라운드

### 4. Yahoo Finance API 내 숨겨진 버그 발견

구현 과정에서 `GET predefined endpoint`가 `offset` 파라미터를 조용히 무시하는 버그가 있음을 발견했습니다. `offset > 0` 으로 페이지네이션 하기 위해, `POST custom query endpoint`를 `Screen()` 메소드에 구현했습니다.

### 5. 테스트 및 마무리

- 11개 테스트 함수 추가 (쿼리 생성, 유효성 검증, IS-IN 확장, predefined, count 제한 등)
- 17개 패키지 전체 테스트 통과, golangci-lint 0 이슈
- docs/API.md 전면 업데이트 (ScreenerQueryBuilder, EquityQuery, FundQuery, OpISIN 등)
- 4개 커밋: models(02cc12f) → screener(89c27ef) → tests(5f9db60) → docs(5b0c371)
- 2026-02-19: main 브랜치 머지, GitHub Pages 문서 배포 완료

## 설치 및 업데이트

```bash
go get https://github.com/wnjoon/go-yfinance@v1.2.0
```