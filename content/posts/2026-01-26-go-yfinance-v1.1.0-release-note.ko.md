---
title: "go-yfinance v1.1.0 업데이트"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-01-26"
slug: "go-yfinance-v1-1-0-release-note"
summary: "go-yfinance v1.1.0에 신뢰성 확보를 위한 데이터 보정 기능을 포함하여 전 세계 60여개 거래소를 지원하는 기능이 추가되었습니다."
description: "go-yfinance v1.0.0을 출시했습니다. Python yfinance의 강력한 데이터 보정(Price Repair) 로직을 이식하여 데이터 신뢰성을 확보하고, 전 세계 60여 개 거래소(MIC) 지원을 통해 글로벌 확장성을 강화한 yfinance의 v1.1.0의 업데이트를 모두 반영하였습니다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "go", "go-yfinance", "claude code", "2026"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: false
hideBackToTop: false
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "go-yfinance v1.1.0 업데이트"
  "description": "go-yfinance v1.0.0을 출시했습니다. Python yfinance의 강력한 데이터 보정(Price Repair) 로직을 이식하여 데이터 신뢰성을 확보하고, 전 세계 60여 개 거래소(MIC) 지원을 통해 글로벌 확장성을 강화한 yfinance의 v1.1.0의 업데이트를 모두 반영하였습니다."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## ranaroussi/yfinance v1.1.0 업데이트 

한국시간 2026년 1월 24일, [ranaroussi/yfinance가 v1.1.0으로 업데이트](https://github.com/ranaroussi/yfinance/releases/tag/1.1.0) 되었습니다. 

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/9c217f68-49ca-4407-b5f3-1452d265cadc/image.png)

<br>

## v1.1.0 주요 변경사항

### 1. Price Repair System: 데이터 무결성 확보

Yahoo Finance 데이터에서 간헐적으로 발생하는 오류들을 자동으로 감지하고 보정하는 시스템이 탑재되었습니다. 이제 별도의 전처리 없이도 신뢰할 수 있는 금융 데이터를 얻을 수 있습니다.

- 자본 이득 중복 계산 수정 (Capital Gains Double-Counting Fix): ETF나 뮤추얼 펀드에서 자본 이득이 수정 주가(Adj Close)에 중복 반영되는 오류를 감지하고 수정합니다.
- 주식 분할 보정 (Stock Split Repair): IQR 기반의 이상치 탐지를 통해 누락되거나 잘못된 주식 분할 데이터를 바로잡습니다.
- 단위 오류 보정 (Unit Mixup Repair): 통화 단위 혼동으로 인해 주가가 100배 또는 1/100배로 표기되는 오류(예: 펜스 vs 파운드)를 자동으로 수정합니다.
- 결측치 및 배당 보정: 0으로 표기된 데이터(Zero Value)를 보간하고, 중복되거나 비정상적인 배당(Dividend) 데이터를 정제합니다.

### 2. MIC Code Mapping: 글로벌 거래소 지원 강화

ISO 10383 표준인 **MIC(Market Identifier Code)**와 Yahoo Finance의 티커 접미사(Suffix)를 매핑하는 기능을 추가했습니다.

- 60개 이상의 글로벌 거래소 지원: 미국(NYSE, NASDAQ)은 물론 유럽(LSE, XETRA), 아시아(HKEX, TSE), 중동 등 전 세계 주요 거래소를 지원합니다.
- 간편한 티커 변환: `utils` 패키지를 통해 MIC 코드로 정확한 Yahoo Finance 티커를 생성하거나 파싱할 수 있습니다.

### 3. 통계 패키지 및 편의성 개선

데이터 분석을 위한 `pkg/stats` 패키지가 신설되었습니다. `Percentile`, `ZScore`, `Moving Average` 등 금융 데이터 분석에 필수적인 통계 함수들을 기본적으로 제공하여 개발 생산성을 높였습니다.

## 설치 및 호환성

이번 버전은 v1.0.0과 완전한 하위 호환성을 유지합니다. 기존 코드를 수정할 필요 없이 바로 업데이트하여 새로운 기능을 활용해 보세요.

```
go get github.com/wnjoon/go-yfinance@v1.1.0
```

## 릴리즈 노트 전체 보기

더 자세한 기술적 사항과 API 사용법은 아래 릴리즈 노트에서 확인하실 수 있습니다.

[👉 go-yfinance v1.1.0 릴리즈 노트](https://github.com/wnjoon/go-yfinance/blob/main/RELEASE_NOTES_v1.1.0.md)