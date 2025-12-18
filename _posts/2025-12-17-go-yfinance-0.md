---
layout: post
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #1"
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 첫번째 포스팅입니다."
categories: dev
draft: false
lang: ko
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Claude Code를 활용해서 go 버전의 yahoo finance 라이브러리 만들기 #1"
  "description": "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 첫번째 포스팅입니다."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## Go 언어로 된 Yahoo Finance 라이브러리가 없나?

얼마전부터 AI agent를 만드는 일에 흥미가 생겨서 열심히 [강의](https://nomadcoders.co/ai-agents-masterclass?gad_source=1&gad_campaignid=18141167485&gbraid=0AAAAACQEcGgB28vYn3MvB7rhLJ-guDeaI&gclid=Cj0KCQiA6Y7KBhCkARIsAOxhqtM01uDU_sqgVSqN3XMhxFpk9dDyzL1A6kZ0a1GY_Y7gsTcbOAwz8gIaAtf1EALw_wcB)를 듣고 있습니다. 강의가 정말 유익하고 재미있지만, 한가지 아쉬운 점이 있습니다. 저는 주로 Go 언어를 사용하고 있는데([gophercon 참석 후기](https://wnjoon.github.io/2025/11/12/gophercon-korea/)), 대부분의 AI 관련 강의들은 Python을 활용해서 AI agent를 만들더라구요. 아마 대부분의 agent가 Python만 지원하거나, 가끔 Javascript 계열만 지원해서 그런건지도 모르겠습니다.

Go를 공식적으로 지원하는 가장 대표적인 프레임워크는 Google ADK, 그리고 Genkit이 있습니다. 제가 듣고있는 강의에서는 Crew AI 부터 Langraph까지 다양한 AI agent를 사용해서 프로젝트를 만들어보고 있는데요, 마침 Google ADK도 그중에 포함되어 있었습니다. 마침 잘되었다 싶어서 Google ADK를 강의하는 부분에서는 제공되는 프롬프트와 개념을 바탕으로 Go를 이용해서 Google ADK를 호출해보기로 했습니다.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/837169e2-2211-4efc-b944-8f82dcc51568/image.png)

*[Golang Korea에 작성한 댓글](https://discord.com/channels/1250370848343195669/1250370848859230301/1439830901805682779)에도 보이듯이, 개인적으로 저는 AI agent의 개발이 아직도 Python을 메인으로 이루어지고 있다는 것에 아쉽다는 생각입니다. 프롬프트를 읽는 것부터 LLM 데이터를 처리해서 결과를 만드는 것 까지, 시간이 갈수록 점점 작업량이 무거워질 것이 당연한 AI agent 개발에서 Go는 훨씬 좋은 성능 뿐만 아니라 컴파일 언어라는 안정성까지 제공할 것이라고 생각하거든요.*

<br>

그래서 Google ADk를 사용한 첫번째 AI agent인 '투자 전략 에이전트'를 Go로 개발하기 시작했습니다...만 시작부터 아주 제대로 난관에 봉착했습니다. 바로 이 프로젝트에서 가장 중요한 'Yahoo Finance 라이브러리'가 Go로 작성되어 있지 않았습니다. 사실 사용되는 Python 라이브러리([yfinance](https://github.com/ranaroussi/yfinance))도 Yahoo Finance에서 공식적으로 지원하는게 아니었죠. 

Curl이나 Websocket으로 제공하는 호출 방식이 있었다면 좋았겠지만, 그런 방법도 없다는 것에 조금 당황했습니다. 간혹 개인이 개발하던 Go 라이브러리들([joetats/goFinance](https://github.com/joetats/goFinance), [svarlamov/goyhfin](https://github.com/svarlamov/goyhfin), [oscarli916/yahoo-finance-api](https://github.com/oscarli916/yahoo-finance-api))이 있었지만, 개발된 범위도 Python 기반의 라이브러리에 비하면 현저히 부족했고 심지어 최소 몇개월 이상 어떠한 업데이트도 이루어지고 있지 않았습니다.

## Python의 yfinance를 그대로 go로 컨버팅할 수 있을까?

그래서 발칙한 생각을 좀 해봤습니다. **'이미 매우 잘 구현되어 있는 yfinance의 기능을 그대로 go로 컨버팅한 라이브러리를 만들 수 있으면 좋겠다.'** 라고 말이죠. 그런데 정말 가능할지 모르겠어서, Claude Code에게 yfinance 리포지토리 전체를 분석해서 Go로 컨버팅이 가능한지 질문했습니다. 

모델은 `opus-4.5`를 사용했습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/e64c717c-fa23-498f-9743-af84ac0268d3/image.png)

한참을 조사해서 꽤나 길고 정교한 결과를 알려줬는데요, 간략하게 표로 요약된 결과는 아래와 같았습니다.

|질문|답변|
|---|---|
|Go 컨버팅 가능한가?|✅ 가능|
|Claude Code로 무난히 가능한가?|⚠️ TLS 위장 부분 제외하면 가능|
|전체 작업 난이도|중상 (Medium-High)|
|핵심 기술적 위험|TLS fingerprint 위장|
|권장 사항|PoC로 TLS 위장 검증 후 진행|

### Yahoo Finance의 인증 방식

Claude Code가 분석한 Yahoo Finance의 Cookie/Crumb 인증 시스템은 아래와 같습니다.

```
Cookie/Crumb 인증 시스템                      

[전략 1: Basic] 
  1. GET https://fc.yahoo.com → A3 쿠키 획득                    
  2. GET https://query1.finance.yahoo.com/v1/test/getcrumb      
    → crumb 토큰 획득                                          
  3. 모든 요청에 ?crumb={crumb} 파라미터 추가                   
                                                                
[전략 2: CSRF] (Basic 실패 시 폴백)
  1. GET https://guce.yahoo.com/consent → CSRF 토큰 추출        
  2. POST https://consent.yahoo.com/v2/collectConsent          
  3. GET https://guce.yahoo.com/copyConsent                     
  4. GET https://query2.finance.yahoo.com/v1/test/getcrumb                                                       
```

Yahoo Finance는 이 인증 과정에서 일반적인 HTTP 클라이언트로부터 접속을 차단합니다. 그래서 yfinance는 이를 우회하기 위해 Chrome 브라우저로 위장된 요청을 보내는데요, Python에서 [curl_cffi](https://github.com/lexiforest/curl_cffi) 라이브러리를 사용하면 TLS fingerprint까지 Chrome 방식으로 변경해줄 수 있습니다.

그래서 이러한 동작을 수행할 수 있는 Go의 라이브러리로 [CycleTLS](https://github.com/Danny-Dasilva/CycleTLS)를 사용하기로 했습니다. 다른 비슷한 라이브러리로 [utls](https://github.com/refraction-networking/utls)가 있는데요, 일반적으로 utls를 많이 사용하지만 상대적으로 설정이 간단하고 JA3 fingerprint를 직접 지정할 수 있다는 점에서 유지보수나 구현이 편리할 것으로 생각되는 CycleTLS를 사용해보기로 했습니다.

## 전체적인 분석 및 작업 계획 세우기

그래서 Yahoo Finance와의 연결 및 인증과 같은 기초 구성부터 기본 동작, 그리고 최종적으로 yfinance에서 제공하는 부가적인 기능들까지 단계별로 Phase를 구성하고 이를 문서화해달라고 요청했습니다. 세션 간에 작업 진행 내용을 공유하기 위해서이기도 했고, 전체적으로 어떻게 진행할 것인지에 대한 계획서를 제가 다시한번 확인하고 싶기도 했습니다.

Claude Code가 작성해준 [DESIGN.md](https://github.com/wnjoon/go-yfinance/blob/main/DESIGN.md) 문서를 간단히 요약하면 아래의 내용을 포함하고 있습니다.
- yfinance 라이브러리 분석 결과
  - 제공하는 API Endpoint 목록
  - 인증 방식 (Cookie/Crumb)
- Go 프로젝트 구조
- 디자인 원칙
- 개발 단계(로드맵)
  - 총 10단계로 진행

특히 개발단계에서는 각 단계별로 중요도가 어떻게 되는지, 그리고 각 단계별로 예상되는 코드량까지 대략적으로 파악해서 알려주었습니다. 각 단계별로 자세한 내용은 [DESIGN.md](https://github.com/wnjoon/go-yfinance/blob/main/DESIGN.md) 파일에 작성되어 있습니다.

| Phase | 이름 | 우선순위 | 예상 코드량 | 누적 |
| --- | --- | --- | --- | --- |
| 0 | Foundation | 🔴 필수 | ~500줄 | 500줄 |
| 1 | Core Data | 🔴 필수 | ~600줄 | 1,100줄 |
| 2 | Options | 🟡 권장 | ~300줄 | 1,400줄 |
| 3 | Financials | 🟡 권장 | ~500줄 | 1,900줄 |
| 4 | Analysis | 🟡 권장 | ~400줄 | 2,300줄 |
| 5 | Holdings | 🟢 선택 | ~500줄 | 2,800줄 |
| 6 | Search | 🟢 선택 | ~400줄 | 3,200줄 |
| 7 | Multi-ticker | 🟢 선택 | ~300줄 | 3,500줄 |
| 8 | Real-time | 🔵 고급 | ~400줄 | 3,900줄 |
| 9 | Advanced | 🔵 고급 | ~600줄 | 4,500줄 |

이를 기준으로 크게 3개의 Phase로 묶어서 개발을 진행할 것을 권장했습니다. 

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

## 단계별, 기능별로 항상 브랜치를 구분할 것

예전에 Claude Code에게 개발 작업을 위임했을때, 같이 개발 계획을 세우고 제가 HITL(Human In The Loop: 옆에서 같이 확인하고 결과를 검증하는 단계)를 진행했지만 한가지 놓치고 있던게 있었습니다. 바로 Claude Code가 기본적으로 브랜치를 구성하면서 개발하지 않더라구요. 처음부터 요구사항을 정의하거나 개발 정책을 수립할때 명시했어야 했는데, 이전에는 그걸 제대로 생각하지 못해서 모든 개발을 진행하고 한번에 main에 올린다거나 커밋을 분리하더라도 main에서 모두 진행해서 향후에 리포지토리를 되돌려야 하거나 특정 시점으로 소스를 버저닝할 때 꽤 어려운 부분이 있었습니다.

그래서 이번에는 개발 과정마다 꼭 브랜치를 구성하고, 기능별로 세부 브랜치를 나눠서 과정마다 커밋하면서 완성되는 단계마다 상위 브랜치로 머지할 것을 **'다행이도 개발 시작 전에 생각하고'** 요청했습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/c81cfba0-0538-46ce-a017-76c15fb59263/image.png)

## 현재까지의 진행 결과

**👉 Repository: [wnjoon/go-yfinance](https://github.com/wnjoon/go-yfinance)**

이 글을 작성하는 시점까지 Phase0, Phase1 개발을 완료했습니다. [README.md](https://github.com/wnjoon/go-yfinance/blob/main/README.md)에 실제로 테스트해볼 수 있는 예제도 포함되어 있는데요, [cmd/example/main.go](https://github.com/wnjoon/go-yfinance/blob/main/cmd/example/main.go)를 실행하시면 아래와 같은 결과를 확인할 수 있습니다. 출력되지 않는 일부 내용에 대해서는 향후에 추가 기능을 개발하면서 업데이트 될 예정입니다. 

```sh
=== go-yfinance Example: AAPL ===

1. Current Quote
----------------
Symbol: AAPL (Apple Inc.)
Price: $271.84
Change: -2.77 (-1.01%)
Day Range: $271.69 - $276.16
52 Week Range: $169.21 - $288.62
Volume: 49406521
Market Cap: $4034211348480
PE Ratio: 36.49
Market State: PREPRE

2. Historical Data (Last 10 Days)
----------------------------------
Date               Open       High        Low      Close       Volume
2025-12-04       284.10     284.73     278.59     280.70     43989100
2025-12-05       280.54     281.14     278.05     278.78     47265800
2025-12-08       278.13     279.67     276.15     277.89     38211800
2025-12-09       278.16     280.03     276.92     277.18     32193300
2025-12-10       277.75     279.75     276.44     278.78     33038300
2025-12-11       279.10     279.59     273.81     278.03     33248000
2025-12-12       277.90     279.22     276.82     278.28     39532900
2025-12-15       280.15     280.15     272.84     274.11     50409100
2025-12-16       272.82     275.50     271.79     274.61     37648600
2025-12-17       275.01     276.16     271.64     271.84     50100600

3. Company Info
---------------
Name: Apple Inc.
Sector: Technology
Industry: Consumer Electronics
Country: United States
Employees: 166000
Website: https://www.apple.com

Key Statistics:
  Market Cap: $4034211348480
  Enterprise Value: $4074483744768
  Trailing PE: 36.49
  Forward PE: 29.80
  PEG Ratio: 0.00
  Price to Book: 54.47
  Revenue: $416161005568
  Profit Margins: 26.92%
  Recommendation: buy (2.00)

4. Recent Dividends
-------------------
No dividend history

5. Stock Splits
---------------
No split history

=== Example Complete ===
```

## 여담

AI Agent 개발 강의 듣다가 갑자기 새로운 라이브러리를 만들다니.. 다른길로 완전히 세어버렸네요 😅

