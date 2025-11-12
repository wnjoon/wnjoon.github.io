---
layout: post
title:  "GopherCon Korea 2025 후기"                                                     
description: "2025.11.09에 진행되었던 GopherCon Korea 2025에 참석한 후기와 소감을 적어본다."
categories: dev
draft: false
lang: ko
keywords: "golang, gophercon, gophercon korea, golang conference, golang conference korea"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  "headline": "GopherCon Korea 2025 후기"
  "description": "2025.11.09에 진행되었던 GopherCon Korea 2025에 참석한 후기와 소감을 적어본다."
  "keywords": "golang, gophercon, gophercon korea, golang conference, golang conference korea"
  "author":
    "@type": "Person"
    "name": "xonxoon"
  "datePublished": "2025-11-12"
---

## 나름 8년차 Golang 개발자이지만, 컨퍼런스는 처음

제가 처음으로 Go 언어를 경험한 것은 2018년 LG CNS에서 블록체인을 개발하는 프로젝트였습니다. 그전에도 Google에서 만든 언어라는 꽤 매력적인 타이틀 덕분에 관심을 갖고 있었지만, 다른 개발자들과 마찬가지로 업무와 관련없이 새로운 언어를 배우는 것이 쉽지 않았던 것 같습니다. 그러던 중 회사에서 사용하는 블록체인 플랫폼이 Go 언어를 사용하고 있었고, 지금은 Go 언어를 가장 많이 사용하는(거의 이것만 사용하는 것 같은) 개발자가 되어있네요.

하지만 부끄럽게도, Go 언어를 사용한 횟수에 비해 컨퍼런스나 세미나, 하물며 특정 모임에 참석한 요은 한번도 없었습니다. 언어는 단순히 도구라고 생각해서였을지, 혹은 언어를 탐구한다는 것이 너무 철학적인 것 같다고 느껴서였을지 모르지만, 요즘 생각으로는 단지 '중요성을 몰라서'였기 때문이었던 것 같습니다. 누군가의 요구사항에 맞춰 단발성 프로젝트 형식으다 개발하는 일명 SI 회사에서, 플랫폼을 만들고 내부 기술을 연구하는 회사로 갈수록, 제가 사용하는 언어가 어떻게 업데이트 되어가는지, 그리고 어떤 기능들이 추가되고 삭제되는지 관심있게 보는 것이 꽤 중요하다는 것을 느꼈습니다. 어찌보면 언어 또한 일하면서 가장 많이 사용하는 도구 중 하나인데, 너무 관심없던 것은 아니었나 싶네요.

서론이 조금 길었지만, 그러던 중 GopherCon Korea 2025가 열린다는 소식을 접하게 되었고, '제 기준에서는 약간은 큰 돈이지만' 기쁜 마음으로 참가비를 내고 참석하게 되었습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/671bb182-5115-42bd-ac1c-e125fb1e42ec/image.png)

얼마나 기대가 되었던지(?), Go Wiki 사이트에 GopherCon Korea 2025에 대한 정보가 없다는 것을 발견하고 디스코드에 일러바치기도 했네요.

![image](https://velog.velcdn.com/images/wnjoon/post/0e97821e-4b43-4bf1-813a-8a0a53e7f06c/image.png)

## 세션 요약

처음으로 참석한 이번 GopherCon 2025 행사는 정말 만족스러웠습니다. 무엇보다 장소가 정말 쾌적했고, 연사분들의 발표와 슬라이드가 정말 잘 전달되는 환경이 조성되어 있었습니다.

그리고 개발자들이 가장 좋아하는 스티커가 넘쳐났고, 심지어 갯수 제한도 없어서 마음껏 가져올 수 있었습니다. 플리마켓에서 파는 굿즈들도 꽤나 매력적이었는데, 저는 그중 키캡 하나를 구매해서 잘 사용하고 있습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/34edac4f-7a7b-48b8-83e3-dcdf24e0248b/image.JPG)

이번 행사에서 진행된 발표는 아래와 같습니다. 각 발표의 내용과 개인적인 생각을 간략하게 정리해보겠습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/b13300e8-276c-40a3-a6c6-947cfa43ab1d/image.png)

### Go 로 만든 AI 주식 추천 및 자동매매 시스템

사실 이날 행사 전후로 개인적인 일정이 있었습니다. 그래서 10시 반에 시작하는 첫 발표는 못들을수도 있겠다고 생각했는데, 발표 주제를 보는순간 서둘러서라도 듣고싶은 마음에 최대한 시간을 맞춰서 행사장으로 뛰어왔습니다.

요즘 저는 AI 에이전트를 만드는 방법에 대해 학습하고 있는데, 대부분의 강의들이 Python 기반으로 프로그램을 작성하도록 설명하고 있습니다. 아무래도 데이터 사이언스부터 시작해서 AI 라이브러리의 대부분이 Python으로 되어있기 때문일것이고, Python이 상대적으로 배우기 쉬운 언어라 그럴수도 있을 것 같지만, 처리해야할 내용들이 일반적인 프로그램보다 상대적으로 훨씬 많을 것 같은 AI 에이전트에서 Go 언어를 후순위로 생각한다는 것이 조금 아이러니 하다고 생각하고 있었습니다. 그러던 참에 Go 언어를 가지고 AI 에이전트를 작성한 발표를 놓칠수가 없었습니다.

- [github repo](https://github.com/suapapa/go_kinvest)
- [demo website](https://ss-demo.homin.dev/)

가장 흥미로웠던 것은 [Genkit](https://github.com/firebase/genkit) 이었습니다. Genkit은 Go 기반으로 LLM 에이전트를 개발할 수 있는 라이브러리로, Gemini 뿐만 아니라, OpenAI, Anthropic, 그리고 Ollama까지 지원하는 프레임워크입니다. (신기하게도 다른 도구들과 반대로, 지원하는 언어들 중 Python이 가장 안정적이지 않은 Early 단계에 있네요)

![image](https://velog.velcdn.com/images/wnjoon/post/e2c63bb1-9f87-404e-b45a-711028f48e9b/image.png)

발표자분은 [세븐 스플릿](https://product.kyobobook.co.kr/detail/S000212731844) 이라는 책을 보고 투자 방향을 설계하고 이를 기반으로 AI 에이전트에 필요한 기능과 프롬프트를 구현했다고 했습니다. 개인적으로 이제는 코딩, 사용 가능한 도구 갯수 등이 개발자의 실력을 평가하는 시대가 아니라, 얼마나 비지니스를 잘 이해하고 빠르게 설계해서 AI를 통해 구현하는가가 더 중요한 실력의 척도가 되어가고 있다 생각합니다. 그래서 AI 도구를 잘 사용하는 방법에 대해서 꾸준히 학습하고, 비록 내가 사용하지 않는 고차원적인 기능이라도 지속적으로 관심을 갖고 따라해봐야 한다고 생각합니다. 그런 관점에서 발표자분의 내용은, Go라는 언어가 단순히 구현에 사용한 하나의 도구에서 끝날 수 있지만, 개발자 커리어 관점에서 보면 굉장히 좋은 발표라고 생각했습니다. 특히 투자를 진지하게 공부한지 약 3개월정도 되었다고 말씀하셨는데, 그에 비해 구현된 AI 에이전트의 완성도는 굉장히 인상깊었습니다. 배울점이 많은 발표라고 생각했습니다.

### 동시통역 Go로 만들기 - 실시간 AI 인퍼런스, WebRTC

Go 언어의 가장 큰 장점은 뭐니뭐니해도 채널입니다. 다른 언어들도 물론 병렬 프로세싱이 가능하지만, Go 만큼 이를 간편하게 해주는 언어는 없습니다. 채널을 생성하고 적절한 시기에 뮤텍스를 통해 제어해준다면, 복잡한 동시성 제어도 충분히 할 수 있습니다. 병렬 프로세싱이 가져오는 가장 큰 장점은 동일한 업무를 더욱 빠르게 처리할 수 있다는 것입니다. 특히 이번 발표 내용인 동시 통역은, 빠른 처리시간이 정말 중요합니다. 상대방의 말을 빠르게 이해하고 번역해야, 대화가 끊기거나 어색해지지 않을 것입니다. 여기서 사용된 WebRTC는 P2P 기반으로 동작하며, 중간에 통신을 릴레이하는 서버가 없습니다. 

WebRTC로 사용할 수 있는 라이브러리는 크게 2가지가 있습니다.
- [pion](https://github.com/pion): 오픈소스, 간단한 프로젝트에 구현
- [livekit](https://github.com/livekit/livekit): enterprise

추가로 backpressure를 해결하기 위해 buffered channel을 구성하였다고 발표하셨는데요, backpressure는 소비자(subscriber)가 데이터를 생산자(producer)보다 빠르게 처리할 수 없을 때 발생하는 문제를 관리하기 위한 메커니즘입니다. 예를 들어, 상대방이 꽤 많은 말을 빠르게 할때, 병렬로 처리하는 과정에서 중간에 데이터가 유실되거나 순서가 변경되면 의도하지 않은 내용이 만들어질 수 있습니다. 이를 해결하기 위해 상대방의 대화를 적절한 크기의 공간에 담아두고, 내부에서 순서를 관리하는 방식을 적용한 것으로 보였습니다.

> backpressure에 대한 자세한 내용은 [이곳](https://looco.tistory.com/12#:~:text=%F0%9F%93%96%20Backpressure%EB%9E%80?,%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%95%88%EC%A0%95%EC%84%B1%EC%9D%84%20%EB%B3%B4%EC%9E%A5%ED%95%A9%EB%8B%88%EB%8B%A4.)을 참고해주세요.

### 프레임워크냐, 아니냐: 그것이 net/http로다

개발자라면 성능과 유연성 중 하나를 선택해야 하는 기로에 서게 되는 상황이 있습니다. 서버 프레임워크를 선택하는 경우도 이에 해당하는데요, 일반적으로 가장 많이 사용되는 프레임워크로 Gin, Echo, Fiber가 있습니다.

- [gin](https://github.com/gin-gonic/gin)
  - 프레임워크중 가장 난이도가 낮음
  - 높은 트래픽이 예상된다면 gin 사용을 추천하지는 않지만, 그래도 어느정도는 커버 가능
- [echo](https://github.com/labstack/echo)
  - 가장 go스러운 프레임워크
  - gin에 비해서 복잡함
- [fiber](https://github.com/gofiber/fiber)
  - http2가 필요없고 속도가 함장 중요하다면 좋음
  - 단, 메모리 제어가 꼭 필요함


이 프레임워크들은 크게 2가지 종류로 구분이 됩니다.
- net/http: gin, echo
- [fasthttp](https://github.com/valyala/fasthttp): fiber

fastttp는 net/http에 비해 6배나 높은 성능 제공하기 때문에, 고성능을 요구하는 경우에 사용됩니다. 하지만 HTTP2 이상을 지원하지 않는다는 단점이 있습니다. 발표자분은 특별한 목적이 없다면, Gin을 사용할 것을 권장하였고, 그 안에서 세부적인 설정이 필요하다면 차라리 Go에서 제공하는 기본 라이브러리인 net/http를 직접 사용할 것을 권장했습니다. 자세한 내용은 [Go HTTP 라이브러리 비교: fasthttp vs net/http](https://wnjoon.github.io/2025/11/11/comparison-go-http-lib/)에 정리해두었으니 참고하시면 좋을 것 같습니다.

### Effect-ive Go: 완전히 Go 다운 함수형 프로그래밍

이번 발표는 굉장히 어렵고, 또 도전적이었습니다. 발표자분은 처음부터 본인을 Go를 너무나 사랑하는 사람으로 소개했습니다. 앞에서 적었듯이, 저는 언어를 단순히 일할때 사용하는 도구 이상으로는 여기지 않았던 것 같습니다. 그 언어의 철학과 문화를 이해해야 한다는 필요성도 느끼지 못했고, 그래서 언어가 어떻게 변화하고 있는지도 그렇게 관심을 두지 않았습니다. 하지만 발표자분은 정 반대였습니다. Go 언어가 제공하는 강력한 인터페이스 기반의 설계 안에서도 개선할 점을 찾아보고, 이를 직접 라이브러리로 구현했습니다. 

발표자분은 추상을 최대한 적게만들고, 불필요한 추상은 겉어내고, 있는 추상도 최대한 작게 만드는 것이 Go 언어의 철학을 따르는 중요한 가치라고 생각했습니다. 하지만 이렇게 추상을 최소화할수록, 우리는 점점 이게 테스트인지 디버깅인지 헷갈릴 정도로 테스트를 위해 Mock을 포함한 많은 장치를 구현해야 하는 경우가 생기기도 합니다. 발표자분은 이를 개선한 라이브러리를 [effect-ive go](https://github.com/on-the-ground/effect_ive_go)라고 소개했습니다.

Effect-ive Go proposes the minimal idiomatic interface for delegating effects, staying true to Go
- Uses context and teardown for idiomatic effect handler binding/unbinding
- Effects declared with type and payload
- Effect payloads are sent over channels to matching handlers found in context

이 외에도 순수함수를 Tableizable 하여 성능을 대폭 개선하는 등 정말 많은 기능들이 있었고, 나중에 꼼꼼히 읽어보면 좋겠다는 생각이 들었습니다. 이후에 링크드인에서 발표자님을 만나게 되었는데, 개인적인 존경의 의미를 담아 메시지도 드렸습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/3a30efbb-d377-44b4-9e3d-da9301d41cc1/image.png)

### Test Reality Not Mocks: Reliable Go Tests in the AI Era

저는 개인적으로 Mock 기반의 테스트를 별로 좋아하지 않습니다. 뭔가 찜찜하다고 할까요. 작성된 함수가 예상하는 결과를 보여주는 것 까지는 가능하지만, 실제로 비지니스에서 발생할 수 있는 상황을 세밀하게 테스트하는 것은 Mock 기반의 테스트에서 한계가 있다고 늘 생각했었습니다. 하지만 *기분탓인지 모르겠지만* 시니어 개발자라면 Mock 기반의 테스트를 잘 사용해야 한다고 느껴서, 억지로 Mock을 만들어서 테스트하는 경우도 간혹 있었습니다. 하지만 대부분은 실제 환경를 로컬에 구성해서 이를 기반으로 테스트하는 경우가 많았는데요, 발표자분의 내용을 듣고나서 '아, 내가 틀린것은 아니었구나'하는 생각이 들었습니다.

발표자분은 "Mock을 테스트하는건 실제 어플리케이션을 테스트하는게 아니다"라고 표현했는데요, 요즘에는 AI를 기반으로 어플리케이션을 직접 테스트함으로써 훨씬 정확한 테스트를 할 수 있다는 점을 강조했습니다. 이를 포함해서 좋은 테스트를 위한 방법을 여러가지 공유해주셨습니다.

어플리케이션 전체를 테스트하는 방법(main)
- main 함수를 테스트하는 것은 불가능하지만, main 함수를 특정 함수를 실행하는 단일 실행지점으로 만들 수 있다면 테스트 할 수 있습니다.
- 예로 main 함수에서 `Run()` 함수를 호출하도록 구현하였다면, `Run()` 함수를 테스트하면 됩니다. 
- 테스트 코드에서 `waitForHealthCheck` (200을 반환할때까지 대기) 함수를 호출하여 `Run()` 함수가 정상적으로 실행되는지 테스트할 수 있습니다.
- 이에 대한 내용은 [How I write HTTP services in Go after 13 years](https://grafana.com/blog/2024/02/09/how-i-write-http-services-in-go-after-13-years/)에 좀 더 자세히 나와있습니다.

go test를 활용하여 프로덕션 코드를 모니터링 하는 방법
- `*/10 * * * * go test -run ...`
- 개발된 어플리케이션을 cronjob 등을 활용하여 주기적으로 테스트해볼 수 있습니다.
- docs/prompts/TDD.md -> 확인 필요

동시성 문제 테스트
- `t.Parallel()`를 사용하면, 동시성 문제로 발생하는 수많은 버그들을 테스트 과정에서 발견할 수 있음
- `t.Parallel()`을 사용할 때는 unique data를 사용해야 함
- `flag.Parse`를 사용하여 여러 환경을 동시에 테스트할 수 있음 (예: 테스트 환경, 개발 환경, 프로덕션 환경)

감사하게도 발표 내용을 [slideshare](https://docs.google.com/presentation/u/0/d/1P0BJFU0cjZuf5l-dHfg4pgOqJ24ZAXQ-/mobilepresent)에 공유해주셨고, [readworld](https://github.com/raeperd/realworld.go)라는 어플리케이션 개발 및 테스트 도구도 소개해주셨습니다.

### Dev in Go way (Go스러움)

Go 스러운 개발은 무엇일까요? Go의 가장 큰 장점 중 하나인 Duck Typing은 인터페이스 기반으로 설계된 어플리케이션이 얼마나 높은 확장성을 가질 수 있는지를 단적으로 보여준다고 생각합니다. 발표자분은 이러한 인터페이스 관점의 설계에 대해서 조금 더 심도있는 내용을 전달해주셨습니다.

**Small Interface**

인터페이스를 크게 정의할수록, 불필요한 기능을 의존하게 될 가능성이 높아집니다. 예로 Storage라는 인터페이스가 있다고 가정해봅니다.

```go
type Storage interface {
    Save(key string, value []byte) error
    Load(key string) ([]byte, error)
    Delete(key string) error
}
```

Backup이라는 객체가 있고, 데이터를 저장(Save)하는 기능만 필요하다고 가정해봅시다. 위처럼 Storage 인터페이스가 정의되어 있으면, 필요하지 않은 Load, Delete를 의존해야 하는 문제가 생길 수 있습니다.
이러한 경우에는 Saver라는 인터페이스를 정의하는 것이 좋습니다. 그리고 Storage는 이렇게 작게 쪼개진 각각의 인터페이스를 포함하도록 설계하는 것이 좋습니다. 이를 통해 작고 명확하게 책임을 분리할 수 있습니다.

```go
type Saver interface {
    Save(key string, value []byte) error
}

type Storage interface {
    Saver
    Loader
    Deleter
}
```

**Discover Interface, Not Design**

개발초기에 과도한 상상력을 동원해서 인터페이스를 개발하면 어떻게 될까요? 필요하다고 생각해서 정의한 기능을 실제로 사용하지 않아서 불필요하게 코드가 낭비될 수 있습니다.
따라서 도메인을 먼저 파악하고 필요한 추상화만 진행하는 것이 좋습니다. 구현전에 완벽한 인터페이스를 예측하려고 시도하는 것은 잘못된 방식입니다. 
추가로 함수형 어댑터를 구현하면, 별도의 인터페이스가 필요할 때 동일한 규격을 갖는 인터페이스 여부를 확인하고 대체할 수 있습니다.

**Accept interface, return structs**

최소한만 요구하고, 최대한으로 제공할 수 있도록 설계해야 합니다. 꼭 인터페이스 타입으로 반환하지 않아도 된다면, 구조체 타입으로 반환하는 것도 좋습니다.

```go
ProcessData(f *os.File) (x) -> ProcessData(r io.Reader) (o)
```

**Options pattern**

인자값이 계속 늘어나게 되면, 코드의 모호함이 증가할 수 있습니다. 이를 '멀리 있는 별을 보기 위해 망원경을 계속 앞으로 뺀다'는 의미로 Telescoping Constructer Anti-Pattern라고도 부릅니다. 아래와 같이 A라는 함수가 있을 때, A라는 함수를 호출하기 위해 추가적인 인자가 필요할때마다 함수를 만들게 되면 오히려 코드를 이해하기 어렵게 될 수도 있습니다.

```go
// 나쁜 예: 인자가 계속 늘어나는 경우
func NewServer(addr string) *Server { ... }
func NewServerWithTimeout(addr string, timeout time.Duration) *Server { ... }
func NewServerWithTimeoutAndMaxConn(addr string, timeout time.Duration, maxConn int) *Server { ... }
// 계속 늘어남...
```

간혹 Builder 패턴을 사용하기도 하지만 추천하지는 않습니다. 가장 큰 이유로 build 과정에 validation이 집중될 수 있기 때문입니다. 그렇다면 SetX 함수에서 validation을 하면 해결될까요? 오히려 SetX 함수에서 에러가 발생하는 경우, 각 SetX 함수에서 발생하는 여러 에러들이 체이닝되지 않는 문제가 생길 수도 있습니다.

가장 좋은 해결방안은 private 형태의 `option` 구조체를 만들고, 이걸 사용하는 것입니다.

- 확장성: 새로운 옵션을 추가해도 기존 코드에 영향 없음
- 가독성: 각 옵션의 의미가 명확함 (`WithTimeout(60*time.Second)`)
- 선택적 설정: 필요한 옵션만 설정 가능
- 기본값: 옵션을 지정하지 않으면 기본값 사용
- 순서 무관: 옵션의 순서에 상관없이 설정 가능

```go
package main

import (
    "fmt"
    "time"
)

// Server 구조체
type Server struct {
    addr    string
    timeout time.Duration
    maxConn int
    tls     bool
}

// private options 구조체
type options struct {
    timeout time.Duration
    maxConn int
    tls     bool
}

// Option 함수 타입 정의
type Option func(*options)

// 각 옵션을 설정하는 함수들
func WithTimeout(t time.Duration) Option {
    return func(o *options) {
        o.timeout = t
    }
}

func WithMaxConnections(n int) Option {
    return func(o *options) {
        o.maxConn = n
    }
}

func WithTLS(enabled bool) Option {
    return func(o *options) {
        o.tls = enabled
    }
}

// NewServer 생성자 - 가변 인자로 Option을 받음
func NewServer(addr string, opts ...Option) *Server {
    // 기본값 설정
    options := options{
        timeout: 30 * time.Second,
        maxConn: 100,
        tls:     false,
    }
    
    // 전달받은 옵션들을 적용
    for _, opt := range opts {
        opt(&options)
    }
    
    return &Server{
        addr:    addr,
        timeout: options.timeout,
        maxConn: options.maxConn,
        tls:     options.tls,
    }
}

func main() {
    // 사용 예시
    
    // 1. 기본값만 사용
    s1 := NewServer("localhost:8080")
    fmt.Printf("Server 1: %+v\n", s1)
    
    // 2. 일부 옵션만 설정
    s2 := NewServer("localhost:8080",
        WithTimeout(60*time.Second),
    )
    fmt.Printf("Server 2: %+v\n", s2)
    
    // 3. 여러 옵션 설정
    s3 := NewServer("localhost:8080",
        WithTimeout(60*time.Second),
        WithMaxConnections(200),
        WithTLS(true),
    )
    fmt.Printf("Server 3: %+v\n", s3)
    
    // 4. 순서에 상관없이 설정 가능
    s4 := NewServer("localhost:8080",
        WithTLS(true),
        WithTimeout(45*time.Second),
    )
    fmt.Printf("Server 4: %+v\n", s4)
}
```

### Go로 밑바닥부터 맨 땅에 헤딩하듯 만드는 P2P 블록체인 네트워크

이 발표가 있을때 개인적인 일이 있어서 듣지 못했네요😭.

### sync 패키지를 활용해서 강력한 버퍼링 만들기 / 부제: 실제 사례로 살펴보는 Go의 간편한 동시성 프로그래밍

사실 굉장히 관심있는 내용이었는데, 이날 컨퍼런스 이후에 중요한 일정이 있어서 다 듣지 못하고 나왔습니다😭. 이 내용이 조금 앞에 있었으면 좋았을 것 같다는 개인적인 아쉬움이 있었지만, 한편으로는 나머지 내용들이 너무 좋았어서 어쩔수 없는 상황이었다고 생각하기로 했습니다.

블록체인은 저장한 모든 데이터를 블록에 보관하기 때문에, 시간이 길어질수록 블록을 조회하고 의미있는 데이터를 추출하는데 걸리는 시간이 계속 증가하게 됩니다. 이를 보완하기 위해서 Indexer라는 블록체인 네트워크 조회용 서비스를 사용하는데, Indexer는 블록체인에 담긴 트랜잭션의 내용 또는 블록의 정보를 주기적으로 데이터베이스에 저장하고, 이 저장된 정보를 바탕으로 블록체인의 내부 정보를 실시간으로 확인할 수 있도록 도와주는 도구를 지칭하는 이름입니다. 물론 조회하고자 하는 데이터가 이미 데이터베이스에 동기화 되어있는, 시간이 어느정도 지난 블록이면 괜찮겠지만, 실시간으로 생성된 블록의 정보를 Indexer로부터 요구한다던가, 혹은 블록이 동기화되고 있는 시점에 Indexer로부터 정보 조회를 시도하는 등의 문제들이 발생할 수도 있습니다. 

발표자분께서는 블록 정보들을 Worker Pool 이라는 특정 버퍼에 담아두고, 이걸 Sync 패키지를 사용하여 안전하고 빠르게 데이터베이스와 동기화하는 방법을 설명하려고 했던 것 같습니다. 내용을 듣지 못해 정확히 적기는 어렵지만, 정말 유익한 내용이었을텐데 아쉽네요.

## 후기

한 발표자분께서 'Go언어를 사랑하는 사람들이 한자리에 모여서 관심사를 공유하고 이야기를 나눌 수 있어서 행복하다'고 하셨는데, 실제로 현장에 와보니 그런 분위기가 많이 느껴졌습니다. 언어에 대해 크게 감수성이 있는 편은 아니지만, 적어도 내가 가장 많이 사용하고 있는 기술에 대해서 진지하게 고민하고 더 나은 방향을 찾아가면서 인사이트를 공유할 수 있는 행사에 참석할 수 있어서 정말 좋았습니다. 2026년에도 좋은 내용이 담긴 GopherCon이 이어지길 기대해봅니다.