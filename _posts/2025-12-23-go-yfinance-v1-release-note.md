---
layout: post
title: "go-yfinance v1.0.0 업데이트"
description: "go-yfinance v1.0.0을 출시했습니다. Claude Code를 이용해서 ranaroussi/yfinance v1.0.0을 분석하고, 달라진 점을 파악하고 개발 가능성과 범위, 시간, 그리고 구현 방식을 검토했습니다. 이를 기반으로 go-yfinance v1.0.0을 구현했습니다."
categories: [dev, go-yfinance]
draft: false
lang: ko
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "go-yfinance v1.0.0 업데이트"
  "description": "go-yfinance v1.0.0을 출시했습니다. Claude Code를 이용해서 ranaroussi/yfinance v1.0.0을 분석하고, 달라진 점을 파악하고 개발 가능성과 범위, 시간, 그리고 구현 방식을 검토했습니다. 이를 기반으로 go-yfinance v1.0.0을 구현했습니다."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## ranaroussi/yfinance v1.0.0 업데이트 

한국시간 12/23일, [ranaroussi/yfinance가 v1.0.0으로 업데이트](https://github.com/ranaroussi/yfinance/commit/d12c4b3c8c114f3547d284b868fc374ca181b432) 되었습니다. 시장 전체 이벤트를 조회할 수 있는 신규 기능 `Calendars`와 티커 검색 기능을 확장한 `Lookup`이 추가되었습니다. 또한 `Sector`, `Industry`, `Market` 기능이 추가되어 섹터, 산업, 시장별 분석이 가능해졌습니다.

## v1.0.0 주요 변경사항

| 변경사항              | 설명                         |
|-----------------------|------------------------------|
| Calendars 모듈 (신규) | 시장 전체 캘린더 이벤트 조회 |
| Config 모듈 (신규)    | 전역 설정 관리 (yf.config)   |
| Network Retry         | 네트워크 에러 시 자동 재시도 |

## 기존 go-yfinance와 ranaroussi/yfinance v1.0.0 기능 전체 비교표

| 기능                   | Python v1.0.0 | Go  | 비고        |
|------------------------|---------------|-----|-------------|
| Ticker 기본            |      ✅       | ✅  | 동일        |
| History (가격 데이터)  |      ✅       | ✅  | 동일        |
| Info (기업 정보)       |      ✅       | ✅  | 동일        |
| Financials (재무제표)  |      ✅       | ✅  | 동일        |
| Options (옵션)         |      ✅       | ✅  | 동일        |
| Holders (주주 정보)    |      ✅       | ✅  | 동일        |
| Analysis (애널리스트)  |      ✅       | ✅  | 동일        |
| Calendar (Ticker별)    |      ✅       | ✅  | 동일        |
| News (뉴스)            |      ✅       | ✅  | 동일        |
| WebSocket (실시간)     |      ✅       | ✅  | 동일        |
| Search (검색)          |      ✅       | ✅  | 동일        |
| Screener (스크리너)    |      ✅       | ✅  | 동일        |
| Multi/Download         |      ✅       | ✅  | 동일        |
| Lookup                 |      ✅       | ❌  | 미구현      |
| Sector/Industry/Market |      ✅       | ❌  | 미구현      |
| Calendars (전역)       |      ✅       | ❌  | v1.0.0 신규 |
| Config (전역)          |      ✅       | 🔶  | 일부 구현   |

- 구현되어 있는 기능들은 모두 동일하며, v1.0.0의 기능 중 4개가 go-yfinance에서 미구현되었습니다.

## 미구현 모듈별 분석

### Lookup

**API 분석**

| 항목        | 내용                       |
|-------------|--------------------------|
| 엔드포인트  | GET /v1/finance/lookup     |
| go-yfinance | LookupURL 이미 정의됨 ✅   |
| Python 구현 | yfinance/lookup.py (221줄) |

**호출 방법 (python)**

```python
yf.Lookup(query="AAPL")  # ISIN, CUSIP 등으로 티커 검색
```

**요청 파라미터**

- query: 검색어 (필수)
- type: all, equity, mutualfund, etf, index, future, currency, cryptocurrency
- count: 결과 개수 (기본 25)
- start: 페이지네이션
- formatted: false
- fetchPricingData: true
- lang: en-US
- region: US

**응답 구조**

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

**구현 계획**

- 모델 정의: pkg/models/lookup.go
- 구현: pkg/lookup/lookup.go
- 테스트: pkg/lookup/lookup_test.go
- 예상 작업량: ~300 lines

### Calendars

**API 분석**

| 항목        | 내용                           |
|-------------|--------------------------------|
| 엔드포인트  | POST /v1/finance/visualization |
| go-yfinance | 정의 필요 ❌                   |
| Python 구현 | yfinance/calendars.py (547줄)  |

- go-yfinance의 `Calendar()`는 개별 Ticker의 캘린더만 지원
- Python의 `Calendars`는 시장 전체의 캘린더 이벤트 조회

**호출 방법 (python)**

```python
calendars = yf.Calendars(start="2025-01-01", end="2025-01-07")
calendars.get_earnings_calendar()      # 실적 발표 일정
calendars.get_ipo_info_calendar()      # IPO 일정
calendars.get_economic_events_calendar() # 경제 이벤트
calendars.get_splits_calendar()        # 주식 분할 일정
```

**요청 구조 (POST Body)**

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

**지원 캘린더 타입**

| 타입           | 설명        | 필드                                                  |
|----------------|-------------|-------------------------------------------------------|
| sp_earnings    | 실적 발표   | ticker, companyshortname, epsestimate, epsactual, ... |
| ipo_info       | IPO 일정    | ticker, filingdate, pricefrom, priceto, shares, ...   |
| economic_event | 경제 이벤트 | econ_release, country_code, consensus_estimate, ...   |
| splits         | 주식 분할   | ticker, startdatetime, old_share_worth, share_worth   |

**구현 계획**

- 모델 정의: pkg/models/calendar_market.go
- Query 빌더: pkg/calendars/query.go
- 구현: pkg/calendars/calendars.go
- 테스트: pkg/calendars/calendars_test.go
- 예상 작업량: ~700 lines

### Domain (Sector/Industry/Market)

**호출 방법(python)**

```python
yf.Sector("technology")   # 섹터별 정보
yf.Industry("software")   # 산업별 정보
yf.Market("us_market")    # 시장별 정보
```

**Sector**

| 항목        | 내용                              |
|-------------|-----------------------------------|
| 엔드포인트  | GET /v1/finance/sectors/{key}     |
| go-yfinance | 정의 필요 ❌                      |
| Python 구현 | yfinance/domain/sector.py (153줄) |

제공 데이터:

- name, symbol, overview (시가총액, 기업수, 산업수 등)
- top_companies (상위 기업)
- top_etfs, top_mutual_funds (관련 ETF/펀드)
- industries (포함 산업 목록)
- research_reports (리서치 보고서)

**Industry**

| 항목        | 내용                                |
|-------------|-------------------------------------|
| 엔드포인트  | GET /v1/finance/industries/{key}    |
| go-yfinance | 정의 필요 ❌                        |
| Python 구현 | yfinance/domain/industry.py (154줄) |

제공 데이터:

- name, symbol, overview
- sector_key, sector_name (소속 섹터)
- top_companies, top_performing_companies, top_growth_companies
- research_reports

**Market**

| 항목        | 내용                                                            |
|-------------|-----------------------------------------------------------------|
| 엔드포인트  | GET /v6/finance/quote/marketSummary, GET /v6/finance/markettime |
| go-yfinance | MarketSummaryURL 정의됨 ✅                                      |
| Python 구현 | yfinance/domain/market.py (108줄)                               |

제공 데이터:

- status (시장 상태, 개장/폐장 시간, 타임존)
- summary (주요 지수별 가격, 변동률)
  
**구현 계획**

- 모델: pkg/models/domain.go
- 공통 인터페이스: pkg/domain/domain.go
- Sector: pkg/domain/sector.go
- Industry: pkg/domain/industry.go
- Market: pkg/domain/market.go
- 테스트: pkg/domain/*_test.go
- 예상 작업량: ~920 lines

### Config

go-yfinance가 이미 Python v1.0.0보다 더 풍부한 Config를 구현하고 있습니다.

| 설정            | Python v1.0.0 | go-yfinance |
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

다만 언어적 특성에 따라, Python에서는 nested 스타일(config.network.proxy)을 사용하고 Go에서는 메서드 체인 스타일(SetProxy())을 API에서 사용합니다. 하지만 Config의 경우 애플리케이션 시작 시점에 한번만 설정되고 이후에는 읽기만 하기 때문에, 실질적인 성능차이가 없으므로 변경이 필요하지 않다고 판단했습니다.

**성능 비교**

| 항목             | Nested Style | Method Chain |
|------------------|--------------|--------------|
| 메모리           | 약간 더 사용 |    효율적    |
| 런타임 오버헤드  |  동적 조회   |  직접 호출   |
| 컴파일 타임 체크 |  ❌ 불가능   |   ✅ 가능    |

## 이슈 정리

**Calendars Earnings API 500 에러**

- 원인: 쿼리 구조 문제 - 날짜 쿼리가 중첩 AND로 감싸짐
- 해결: buildDateQueries() 추가하여 GTE/LTE를 개별 operands로 전달

```go
// Before (에러)
Operands: []interface{}{
    query{Operator: "EQ", ...},
    query{Operator: "AND", Operands: [GTE, LTE]},  // 중첩 AND
}

// After (정상)
Operands: []interface{}{
    query{Operator: "EQ", ...},
    gteQuery,  // 직접 포함
    lteQuery,  // 직접 포함
}
```

**SplitEvent 타입 충돌**

- 원인: `pkg/models/response.go`에 이미 `SplitEvent` 정의됨
- 해결: `CalendarSplitEvent`로 이름 변경

**Post 메서드 시그니처 불일치**

- 원인: `client.Post`는 `map[string]string`, 캘린더는 `map[string]interface{}` 필요
- 해결: `client.PostJSON` 사용 + `json.Marshal`로 바디 직렬화

## 결과

[go-yfinance v1.0.0 Release Note](https://github.com/wnjoon/go-yfinance/releases/tag/v1.0.0)