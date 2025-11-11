---
layout: post
title:  "Go HTTP 라이브러리 비교: fasthttp vs net/http"                                                     
description: "Go HTTP 라이브러리 비교: fasthttp vs net/http"
categories: dev 
draft: false
lang: ko
keywords: "golang, fasthttp, net/http, HTTP/2, 성능, 서버 프레임워크"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  "headline": "Go HTTP 라이브러리 비교: fasthttp vs net/http"
  "description": "Go HTTP 라이브러리 비교: fasthttp vs net/http"
  "keywords": "golang, fasthttp, net/http, HTTP/2, 성능, 서버 프레임워크"
  "author":
    "@type": "Person"
    "name": "xonxoon"
  "datePublished": "2025-11-11"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://wnjoon.github.io/2025/11/11/comparison-go-http-lib/"
  "mainEntity": 
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "fasthttp가 HTTP/2를 지원하지 않는 근본적인 이유는 무엇인가요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "fasthttp는 HTTP/1.1의 성능을 극단적으로 최적화하기 위해 'RequestCtx' 객체를 재사용하는 아키텍처를 사용합니다. 이는 '하나의 연결 = 다중 스트림'을 전제로 하는 HTTP/2의 복잡한 상태 관리 및 멀티플렉싱 모델과 근본적으로 충돌합니다. HTTP/2를 지원하려면 라이브러리 핵심을 완전히 새로 작성해야 합니다."
      - "@type": "Question"
        "name": "fasthttp가 net/http보다 훨씬 빠른 이유는 무엇인가요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "두 가지 핵심 이유가 있습니다. 첫째, '메모리 할당 최소화(Zero Allocation)'입니다. fasthttp는 sync.Pool을 사용해 객체를 재사용하여 GC(가비지 컬렉션) 오버헤드를 최소화합니다. 둘째, '[]byte 중심 설계'입니다. 불필요한 string 변환을 피해 메모리 복사와 할당을 줄입니다."
      - "@type": "Question"
        "name": "언제 net/http를, 그리고 언제 fasthttp를 사용해야 하나요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "거의 모든 일반적인 웹 애플리케이션, API 서버, HTTP/2 지원이 필요한 서비스에는 표준 라이브러리인 'net/http'를 사용해야 합니다. 'fasthttp'는 광고 입찰(RTB)이나 내부 마이크로서비스처럼 극단적인 초고성능이 필요하고, 프로파일링 결과 net/http가 명백한 병목이며, HTTP/1.1 환경이어도 괜찮은 특수한 경우에만 제한적으로 사용해야 합니다."
---

Go 언어로 웹서버를 구축할 때, 기본적으로 제공하는 라이브러리인 net/http를 외에도 다양한 서버 프레임워크들을 사용할 수 있습니다. 가장 유명한 3개의 프레임워크인 Gin, Fiber, Echo가 있는데요, 각 프레임워크들이 사용하는 내부 라이브러리들은 아래와 같습니다.
- [Gin](https://github.com/gin-gonic/gin), [Echo](https://github.com/labstack/echo): net/http
- [Fiber](https://github.com/gofiber/fiber): fasthttp

결국 개발자는 net/http, [fasthttp](https://github.com/valyala/fasthttp)중 하나의 라이브러리를 선택하게 되는데요, fasthttp는 압도적인 성능을 제공하고 net/http는 범용성과 안정성을 제공합니다. 이번 포스팅에서는 두 라이브러리의 근본적인 차이점을 비교 분석하려고 합니다. 더 나아가 fasthttp가 왜 HTTP/2를 지원하지 않는지, 성능 차이는 어디에서 오는지, 그리고 각 라이브러리의 구체적인 사용 사례와 코드 레벨의 차이점까지 작성해보려고 합니다.

## fasthttp와 HTTP/2: 지원되지 않는 이유

fasthttp가 HTTP/2를 지원하지 않는 이유는 단순한 기능 누락이 아니라, 라이브러리의 핵심 철학 및 아키텍처와 HTTP/2의 구조가 근본적으로 충돌하기 때문입니다. 

fasthttp의 HTTP/2를 지원 가능에 대한 이슈는 2016년부터 이어진 주제입니서. [공식 github 리포지토리](https://github.com/valyala/fasthttp)의 이슈에서 가져온 아래 그림을 보면, 그 당시부터 http2는 fasthttp의 TODO 리스트에 존재했습니다. 

![](https://velog.velcdn.com/images/wnjoon/post/dbe0c31b-09d7-4956-8d75-a8d9b28c718d/image.png)

최근에는 [fasthttp/http2](https://github.com/fasthttp/http2)에서 HTTP/2를 지원하는 라이브러리를 개발하고 있습니다. 아직은 Under construction 단계로, 정식 버전이 개발되진 않았습니다. 

fasthttp는 "HTTP/1.1 환경에서 극한의 성능과 낮은 메모리 사용량"을 목표로 할때 net/http를 대신하여 사용하기 좋은 라이브러리입니다. HTTP/2 지원은 이 목표와 상충될 뿐만 아니라 net/http라는 훌륭한 대안이 존재하기 때문에, fasthttp는 자신의 영역(HTTP/1.1 고성능)에 집중하고 있습니다. 좀더 자세히 살펴보면 아래의 3가지 원인이 있습니다.

![](https://velog.velcdn.com/images/wnjoon/post/8434c87c-8a19-46f8-90fd-6ffc82073a97/image.png)

### 1. 아키텍처의 근본적인 불일치

fasthttp는 HTTP/1.1 프로토콜에 극단적으로 최적화되어 있습니다.

- fasthttp (HTTP/1.1 기반)
  - '하나의 연결 = 하나의 요청' (Keep-alive 제외)이라는 단순한 모델을 전제로 합니다. 즉, 요청과 응답이 순차적으로 처리되는 간단한 구조입니다.
  - `RequestCtx` 객체를 재사용하여 GC(가비지 컬렉션) 오버헤드를 최소화하는 메모리 재사용에 중점을 둡니다. 
- HTTP/2
  - '하나의 연결 = 다중 스트림(Streams)' (Multiplexing)을 사용합니다. 
  - 하나의 TCP 연결을 통해 여러 요청과 응답이 동시에, 순서에 상관없이 오고 갈 수 있으며, 스트림별 흐름 제어(Flow Control), 우선순위 지정(Prioritization) 등 복잡한 상태 관리가 필요합니다.

fasthttp의 단순한 메모리 재사용 아키텍처로는 HTTP/2의 복잡한 다중 스트림과 상태를 관리하기가 사실상 불가능합니다. HTTP/2를 지원하려면 라이브러리의 핵심 로직을 완전히 새로 작성해야하는데, 이는 fasthttp가 추구하는 장점을 바꿔버리는 수준의 완전히 새로운 라이브러리가 됩니다.

### 2. 구현의 복잡성

fasthttp의 메인 개발자([valyala](https://github.com/valyala))는 HTTP/2를 구현하는 것이 "기존 라이브러리 유지보수와 맞먹는, 혹은 그 이상의 노력이 드는 거대한 작업"이라고 여러 차례 언급했습니다. 

![](https://velog.velcdn.com/images/wnjoon/post/58194363-af18-48bc-84cd-14b4333b9ff6/image.png)

HTTP/2는 바이너리(Binary) 프로토콜이며, 헤더 압축을 위한 HPACK, 서버 푸시(Server Push), 스트림 제어 등 매우 복잡한 스펙을 정확히 구현해야 합니다. 이는 사실상 fasthttp 내부에 완전히 새로운 HTTP/2 라이브러리를 하나 더 만드는 것과 같은 업무량입니다.

### 3. 표준 라이브러리의 존재 (net/http)

Go 언어는 이미 표준 라이브러리인 net/http에서 매우 훌륭하고 안정적인 HTTP/2를 지원합니다. net/http는 Go 1.6(2016년)부터 별도 설정 없이도 자동으로 HTTP/2를 지원하며, fasthttp 개발팀의 공식 입장도 "HTTP/2가 필요하다면 표준 라이브러리 net/http를 사용하라"는 것입니다. 심지어 'For most cases net/http is much better as it's easier to use and can handle more cases' 라고 언급하면서, fasthttp가 꼭 필요한 고성능의 환경이 필요하지 않은 대부분의 환경에서는 net/http가 더 좋은 선택이라고 말합니다.

![](https://velog.velcdn.com/images/wnjoon/post/8434c87c-8a19-46f8-90fd-6ffc82073a97/image.png)

또한 fasthttp와 net/http 사이에 일치하는 API도 없는데요. [공식 문서](https://github.com/valyala/fasthttp?tab=readme-ov-file#switching-from-nethttp-to-fasthttp)에 따르면, net/http -> fasthttp로 변형해주는 컨버터가 존재하지만, fasthttp를 적용하고 싶다면 차라리 처음부터 다시 적용하는 것이 훨씬 좋을 것이라고 권장하고 있습니다.

> Unfortunately, fasthttp doesn't provide API identical to net/http. See the FAQ for details. There is net/http -> fasthttp handler converter, but it is better to write fasthttp request handlers by hand in order to use all of the fasthttp advantages.

## 그렇다면 fasthttp는 왜 더 빠른가?

[fasthttp에서 제공하는 벤치마크](https://github.com/valyala/fasthttp?tab=readme-ov-file#http-server-performance-comparison-with-nethttp)에 따르면, fasthttp는 net/http보다 6배 더 빠른 성능을 보여줍니다. 

- 메모리 할당 최소화 (Zero Allocation):
  - net/http는 모든 요청마다 http.Request와 http.ResponseWriter 객체를 새로 생성하여 GC에 부담을 줍니다.
  - fasthttp는 sync.Pool을 적극적으로 사용하여 fasthttp.RequestCtx라는 단일 구조체를 재사용합니다. 요청이 끝나면 객체를 풀(Pool)에 반환하여 GC 발생을 최소화하고 시스템 전체의 지연 시간을 줄입니다.

- 바이트 슬라이스([]byte) 중심 설계:
  - net/http는 헤더 키, URL 파라미터 등을 문자열(string)로 변환하여 사용 편의성을 높입니다.
  - fasthttp는 대부분의 데이터를 []byte로 직접 처리하여, 문자열로의 불필요한 변환 및 메모리 복사/할당을 줄입니다.
  - 성능 향상이 제일 중요한 경우, []byte와 string을 변환할때 Go에서 기본적으로 제공하는 방식을 사용하는 것보다 [fasthttp에서 제공하는 unsafe, zero-allocation](https://github.com/valyala/fasthttp?tab=readme-ov-file#unsafe-zero-allocation-conversions)을 사용할 것을 권장합니다. 

## 속도와 트레이드오프

fasthttp는 빠른 속도를 제공하지만, 아래와 같은 단점 또한 존재합니다.

- API 호환성: net/http는 http.Handler라는 표준 인터페이스를 따릅니다. 반면 fasthttp는 `RequestHandler`라는 비표준 인터페이스를 사용합니다.
- 미들웨어 생태계: net/http는 Gin, Chi, Echo 등 거의 모든 Go 미들웨어 및 라우터와 호환됩니다. fasthttp는 전용 미들웨어만 사용 가능하여 생태계가 매우 제한적입니다. (유일하게 Fiber 프레임워크가 fasthttp를 기반으로 만들어졌습니다)
- 프로토콜 지원: net/http는 HTTP/2와 HTTP/3를 완벽하게 자동 지원합니다. fasthttp는 미지원입니다.
- 메모리 관리: net/http는 GC가 자동으로 처리합니다. fasthttp는 RequestCtx를 오래 잡고 있으면 안 되는 등 개발자의 수동 관리가 필요합니다.
- 사용 편의성: net/http는 직관적이고 안전합니다. fasthttp는 규칙을 어기면 메모리 누수나 버그가 발생하기 쉬워 사용 편의성이 낮습니다.
- 스트리밍: net/http는 대용량 스트리밍을 완벽 지원하지만, fasthttp는 제한적입니다.

## 구체적인 사용 사례

### net/http

- 거의 모든 웹 애플리케이션 및 API 서버에서 사용 가능
- 프로젝트를 처음 시작할 때 (구체적인 요구사항이 정의되지 않았을 경우)
- Gin, Chi 등 표준 미들웨어 생태계가 필요한 경우
- HTTP/2 또는 HTTP/3 지원이 필수적인 클라이언트 대면 서비스
- 대용량 파일 업로드/다운로드 등 스트리밍 처리가 필요한 경우
- 개발 편의성, 안정성, 유지보수성이 성능보다 중요한 경우

### fasthttp

- 극단적인 초고성능(High-Throughput)이 요구되는 경우
- 초당 수십만 건 이상의 요청을 처리해야 하는 내부 마이크로서비스
- 광고 입찰(RTB), 대규모 프록시 서버, 하이 퍼포먼스 API 게이트웨이
- net/http로 프로파일링 결과, HTTP 요청 처리 자체가 명백한 병목임이 입증된 경우

## 코드 레벨 비교

두 라이브러리의 가장 큰 코드 레벨 차이점은 net/http가 `http.ResponseWriter`와 `*http.Request` 인터페이스를 사용하는 반면, fasthttp는 모든 것을 `*fasthttp.RequestCtx` 단일 구조체로 처리한다는 것입니다.

- 시그니처: net/http는 (w, r), fasthttp는 (ctx).
- 데이터 접근: net/http는 string (`r.URL.Path`), fasthttp는 []byte (`ctx.Path()`).
- 객체 생명주기: net/http의 r과 w는 요청 처리 내내 유효합니다.

중요한 점은, **fasthttp의 ctx 객체는 핸들러 함수가 반환(return)되는 즉시 풀(Pool)로 돌아가 재사용**됩니다. 만약 fasthttp 핸들러 내에서 고루틴(goroutine)을 실행하며 ctx를 전달하면, 고루틴이 실행될 시점에는 ctx가 이미 다른 요청을 처리하고 있을 수 있어 동시성 문제와 같은 심각한 문제가 발생할 수 있습니다.

두 방식의 핸들러 예시를 통해 차이점을 살펴보겠습니다.

### net/http

net/http는 요청과 응답 객체가 별도로 핸들러 함수에 전달됩니다.

```go
package main

import (
	"fmt"
	"net/http"
)

// 핸들러 시그니처: http.ResponseWriter, *http.Request
func helloHandler(w http.ResponseWriter, r *http.Request) {
	// 쿼리 파라미터 (string)
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "World"
	}
	// 응답 작성
	fmt.Fprintf(w, "Hello, %s!", name)
}

func main() {
	http.HandleFunc("/hello", helloHandler)
	fmt.Println("net/http server starting on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
```

위의 예시에서 볼 수 있듯이, 핸들러 시그니처가 `func(http.ResponseWriter, *http.Request)`이며, 요청(r)과 응답(w) 객체가 분리되어 직관적으로 이해할 수 있습니다.

### fasthttp

fasthttp는 컨텍스트 객체 `*fasthttp.RequestCtx` 하나만 핸들러에 전달합니다. 

```go
package main

import (
	"fmt"
	"github.com/valyala/fasthttp"
)

// 핸들러 시그니처: *fasthttp.RequestCtx
func helloHandler(ctx *fasthttp.RequestCtx) {
	// 쿼리 파라미터 ([]byte)
	name := string(ctx.QueryArgs().Peek("name"))
	if name == "" {
		name = "World"
	}
	// 응답 작성 (ctx에 직접)
	fmt.Fprintf(ctx, "Hello, %s!", name)
}

func main() {
	requestHandler := func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/hello":
			helloHandler(ctx)
		default:
			ctx.Error("Unsupported path", fasthttp.StatusNotFound)
		}
	}

	fmt.Println("fasthttp server starting on :8081")
	if err := fasthttp.ListenAndServe(":8081", requestHandler); err != nil {
		panic(err)
	}
}
```

net/http와 다르게, fasthttp에서는 `func(*fasthttp.RequestCtx)` 핸들러 시그니처를 사용하며, ctx 객체 하나로 요청 정보 접근과 응답 작성을 모두 처리합니다. 또한 데이터가 []byte로 처리됩니다.

## 결론

예전에 제가 서버 API를 설계할 때를 돌아보면, '얼마나 빠르게 요청을 처리할 수 있는가'를 먼저 고민했던 것 같습니다. 그래서 대부분 fasthttp를 제공하는 fiber를 사용했었는데요. 하지만 서버가 어떤 데이터를 처리할지, 그리고 서버가 어떤 환경에서 동작해야하는지 등의 요구사항을 먼저 명확하게 정의했다면 성능이 아닌 다른 관점에서 net/http를 직접 사용하거나 혹은 이를 지원하는 프레임워크를 사용하지 않았을까 싶습니다.

최근에 gophercon을 다녀왔는데요. [발표자](https://gophercon.kr/program/sessions/session-3)분께서 '명확한 요구사항이 없는 일반적인 서버를 Go로 구현할 경우, net/http를 직접 사용하거나 Gin 프레임워크 사용을 가장 권장한다'고 말씀하셨습니다. 극도의 성능 개선이 요구되는 경우가 아니라면, 가장 범용적으로 설계하고 사용할 수 있는 프레임워크를 적용하거나, 혹은 Go에서 제공하는 순수 라이브러리를 적용하는 것이 향후 유지보수 측면에서도 더욱 좋은 선택이 될 수 있겠다고 생각할 수 있는 시간이었습니다.

결론적으로, 높은 성능을 요구하는 서버에서 데이터 동시처리를 정확하게 제어할 수 있는 경우에 fasthttp를, 그 외에는 net/http를 사용하는 것이 좋은 선택이 되지 않을까 생각합니다.