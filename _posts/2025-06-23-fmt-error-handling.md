---
layout: post
title:  "Go 에러 처리: fmt.Errorf는 언제, 어떻게 사용해야 할까요?"
description: "Go 언어에서 fmt.Errorf를 올바르게 사용하는 방법을 알아봅니다. 모든 에러를 fmt.Errorf로 감싸는 것이 왜 안티 패턴인지, 재시도 로직과 에러 래핑(wrapping)의 모범 사례를 실제 코드를 통해 명확히 설명합니다."
categories: dev
# tags: [ethereum, solidity, smartcontract]
keywords: go, error, fmt.Errorf, error handling, error wrapping, backoff, idiomatic go
comments: true
author: Wonjoon
schema:
  '@context': https://schema.org
  '@type': TechArticle
  headline: "SQLite FTS5 깊이 파고들기: 토크나이저와 인덱싱의 모든 것"
  description: "SQLite의 강력한 전문 검색 확장 기능인 FTS5의 동작 원리부터, 토크나이저(unicode61)와 접두어 인덱스(prefix)의 올바른 이해, 그리고 한글 검색의 한계점까지 자세히 알아봅니다."
  keywords: "SQLite, FTS5, Full-Text Search, 전문 검색, 데이터베이스, 토크나이저, 인덱싱, unicode61"
  mainEntity:
    '@type': FAQPage
    mainEntity:
      - '@type': Question
        name: "Q1: FTS5는 일반적인 LIKE 검색과 무엇이 다른가요?"
        acceptedAnswer:
          '@type': Answer
          text: "LIKE는 텍스트 전체를 일일이 비교하는 방식이라 데이터가 많아지면 매우 느려집니다. 반면, FTS5는 텍스트를 '토큰'이라는 단어 단위로 쪼개 미리 '색인(index)'을 만들어 두기 때문에, 수십만 건의 데이터 속에서도 압도적으로 빠르게 검색할 수 있습니다. 또한, 관련도 순 정렬 등 LIKE에는 없는 고급 검색 기능을 제공합니다."
      - '@type': Question
        name: "Q2: `tokenize = 'unicode61'` 옵션을 사용하면 한글 검색에 어떤 한계가 있나요?"
        acceptedAnswer:
          '@type': Answer
          text: "unicode61 토크나이저는 한글의 명사, 조사 같은 형태소를 분석하지 못하고 오직 공백과 문장부호를 기준으로만 단어를 나눕니다. 예를 들어 '최고의'라는 단어를 '최고'와 '의'로 분리하지 못하고 통째로 하나의 토큰으로 인식합니다. 따라서 사용자가 '최고'라고 검색하면 '최고의'가 포함된 문서를 찾지 못하는 한계가 있습니다."
      - '@type': Question
        name: "Q3: `prefix` 인덱스를 설정했는데도 왜 '최고'로 검색하면 '최고의'를 찾을 수 없나요?"
        acceptedAnswer:
          '@type': Answer
          text: "prefix 옵션은 새로운 토큰을 만드는 것이 아니라, 이미 존재하는 토큰('최고의')을 더 빨리 찾기 위한 '지름길(색인)'을 추가하는 역할만 합니다. 이 지름길은 검색어 뒤에 * 와일드카드를 붙여 `MATCH '최고*'`와 같이 명시적으로 접두어 검색을 요청할 때만 사용됩니다. * 없이 검색하면 FTS5는 '최고'라는 완전한 토큰을 찾으려 하기 때문에 '최고의'를 찾지 못합니다."
---

## 핵심 요약 (TL;DR)

- **언제 `fmt.Errorf`를 쓰면 안 되나요?**
    - 라이브러리(예: `backoff.Retry`)가 에러의 종류를 파악해야 할 때. **원본 에러를 그대로 반환**해야 라이브러리와의 '약속'을 지킬 수 있습니다.

- **언제 `fmt.Errorf`를 써야 하나요?**
    - 모든 재시도 등 정책적 판단이 끝난 후, 최종적으로 에러를 반환하는 시점. **"재시도 끝에 실패"와 같은 명확한 맥락(Context)을 추가**하기 위해 사용합니다.

- **가장 중요한 원칙은 무엇인가요?**
    - **역할 분리**. 에러를 발생시키는 '실무자' 함수와, 그 에러를 받아 정책을 결정하는 '매니저' 함수로 역할을 나누고 각 계층에 맞는 책임을 부여하는 것입니다.

---

## 질문 1: `fmt.Errorf`를 무조건 사용하면 왜 안 되나요?

많은 Go 개발자가 외부 API 호출과 같은 불안정한 작업을 처리할 때 `cenk/backoff` 같은 라이브러리로 재시도 로직을 구현합니다. 이때 모든 에러를 `fmt.Errorf`로 감싸는 실수를 하곤 합니다.

```go
func doRetry(ctx context.Context, c *Client, req *http.Request) ([]byte, int, error) {
    // ...
	if err := backoff.Retry(func() error {
		var err error
		bs, st, err = do(ctx, c, req)
		return err // <-- 여기서는 원본 에러를 그대로 반환
	}, ...); err != nil {
        // <-- 여기서는 컨텍스트를 추가하여 반환
		return nil, 0, fmt.Errorf("failed after retries %w", err)
	}
	return bs, st, nil
}
```

결론부터 말하면, **라이브러리가 에러의 종류를 보고 특정 행동(예: 재시도 중단)을 결정해야 할 때, `fmt.Errorf`로 에러를 감싸면 원본 에러의 정보가 가려져 라이브러리가 올바르게 동작하지 못하기 때문입니다.**

## 질문 2: 어떻게 역할을 분리해야 하나요?

견고한 에러 처리는 함수의 역할을 '실무자'와 '매니저'로 명확히 나누는 것에서 시작합니다.

- 실무자 (`do` 함수): 실제 작업을 딱 한 번 수행하고, 그 결과를 가공하지 않은 원본 에러 그대로 보고하는 역할만 합니다.
- 매니저 (`doRetry` 함수): 실무자의 보고(원본 에러)를 받아 정책적 결정을 내립니다. 예를 들어 '일시적 오류'는 재시도, '영구적 오류'는 즉시 중단 같은 결정을 합니다.

`backoff.Retry` 라이브러리는 매니저의 '비서'와 같습니다. 비서는 실무자가 제출한 원본 에러 보고서에 `backoff.PermanentError` 같은 특정 도장이 찍혀 있는지 확인합니다. 만약 `fmt.Errorf`라는 별도의 봉투에 담아 보고하면, 비서는 중요한 도장을 보지 못하고 재시도하면 안 되는 일에 불필요한 노력을 쏟게 됩니다.

이것이 `backoff.Retry` 안에서는 원본 에러(`return err`)를 그대로 반환해야 하는 이유입니다. 라이브러리와의 약속(Contract)을 지키는 것이죠.

## 질문 3: 에러에 컨텍스트는 언제 추가해야 가장 좋은가요?

"재시도 끝에 실패했다"와 같은 구체적인 맥락은 **매니저가 모든 정책적 판단을 끝낸 시점**에 추가하는 것이 가장 좋습니다.

`doRetry` 함수는 `backoff.Retry`가 최종적으로 실패했을 때, 비로소 `fmt.Errorf("failed after retries %w", err)`를 통해 더 자세한 컨텍스트를 담은 최종 에러를 생성하여 상위 호출자에게 반환합니다.

> **Go 에러 처리 철학**: 에러가 발생한 가장 낮은 수준에서는 원본을 유지하고, 계층을 따라 올라오며 각 계층의 역할에 맞는 컨텍스트를 추가합니다.

## 질문 4: `defer`를 사용할 때 에러는 어떻게 처리해야 하나요?

`defer`로 리소스를 정리할 때 발생하는 에러를 놓치지 않으면서, 더 중요한 원인 에러를 덮어쓰지 않는 것이 중요합니다. 아래는 매우 실용적인 Go의 표준 패턴(idiomatic Go)입니다.

```go
func do(...) (bs []byte, st int, err error) { // <-- 1. 반환 값을 'err'로 명명
    // ...
    // http 요청 등 주요 로직
    // ...
    defer func() {
        if closeErr := resp.Body.Close(); err == nil { // <-- 2. 기존 에러가 없을 때만
            err = closeErr // <-- 3. 뒷정리 에러를 최종 에러로 할당
        }
    }()
    // ...
    return
}
```

이 패턴의 핵심은 `if err == nil` 조건입니다.

- 주요 로직에서 에러가 없었을 경우 (`err`가 `nil`일 때): defer문에서 발생한 뒷정리 에러(`closeErr`)를 최종 반환 에러로 삼습니다.
- 주요 로직에서 이미 에러가 발생했을 경우 (`err`가 `nil`이 아닐 때): 덜 중요한 뒷정리 에러는 무시하고, 더 중요한 최초의 원인 에러를 그대로 보존하여 반환합니다.

이는 "함수가 실패했다면, 그 최초의 원인을 보존하라"는 Go의 중요한 에러 처리 철학을 잘 보여줍니다