---
layout: post
title: "인터페이스 기반 설계의 중요성과 go언어를 이용한 구현 방법"
excerpt: "인터페이스는 사용자와 시스템 간 입출력 형식을 약속함으로써, 내부 구현 방식에 제한받지 않고 시스템 간 연계 방법을 설계할 수 있도록 하는 중요한 방법이다. 특히 여러 사람이 함께 협업하는 환경에서 인터페이스 기반의 시스템 구현은 응집성을 낮추고 시스템 간 독립적인 개발이 가능하도록 한다. 본 포스팅에서는 go언어를 이용하여 인터페이스 기반의 설계를 직접 진행한 내용까지 함께 다루어본다."
description: Way to use interface architecture and demonstrate in go language
date: 2023-12-02 15:00:00 +0900
categories: [아키텍처, go]
tags: [software architecture, design pattern, go]
keywords: [software architecture, design pattern, go, interface]
comments: true
---

<br>

## 여러 사람이 협업하는 환경에서 인터페이스의 효과

대부분의 회사를 다니는 개발자들은 여러 사람과 함께 하나의 시스템을 만들어간다. 개인 프로젝트나 간단한 테스트의 경우에는 상관없지만, 인원이 3-4명만 되더라도 깃헙 리포지토리를 함께 사용하면서 일어나는 다양한 문제부터 코드의 구현 형식을 맞추는 일까지 협업해야 하는 상황은 계속 늘어난다.

하지만 가장 크게 두드러지는 문제는 상대방이 개발한 내용을 내가 사용해야 하는, 혹은 그 반대의 경우다. 아무래도 다양한 시스템을 여러 사람이 나누어 개발하기 때문에 나의 개발 범위가 상대방의 개발 범위에 의존적인 상황이 생겨날 수 밖에 없다. 가장 좋은 시나리오는 맡겨진 업무를 서로가 일정에 맞춰서 개발하는 것이지만, 그렇게 될 확률은 극히 낮다. 결국 <u>개발하게 될 내용에 대한 규격을 정하고, 실제 테스트는 Mock형태로 진행</u>하는 것이 가장 깔끔하다. 상대방이 개발할 내용은 상대방에게 책임을 맡기고, 정상적으로 개발되었을 경우에 진행될 다음 로직(내 업무 범위)에 신경을 쏟는 것이다.

결국 인터페이스 기반의 시스템 설계는, 이미 오래전부터 중요한 개발방법으로 자리잡아오는 MSA(Micro Service Architecture)와 매우 닮아있다. 인터페이스와 인터페이스가 만나 하나의 시스템을 만들고, 그렇게 만들어진 각 시스템들이 만나 하나의 서비스가 된다.

그렇다면 인터페이스는 어떻게 설계해야할까? 인터페이스의 기준은 '기능(function)'이다. 기능 내부 구현은 책임자가 맡아서 개발하겠지만, 그걸 사용하는 입장에서는 이러이러한 기능이 있다라는 것만 알면 된다. 인터페이스의 규격에 맞게 Mock형태의 객체를 만들어 테스트하고, 향후에 개발이 완료되면 실제 객체로 바꿔 적용하면 된다. 그럼 이러한 일련의 과정을 go언어를 통해 살펴보자.

<br>

## 이더리움 트랜잭션 전송 방법에 따른 인터페이스 설계

### 1. 시나리오

이더리움에서 트랜잭션을 관리하는 기능을 go언어로 구현하며, 이 때 전송 기능을 인터페이스로 설계해보자.

- 트랜잭션을 빌드, 전송하는 일련의 모든 과정을 담당하는 구현체가 있다.
- 트랜잭션을 전송하는 방법에는 2가지가 있다.
  - 직접 이더리움 클라이언트에 전송
  - 카프카 producer에 전송하고, consumer가 이를 받아 이더리움 클라이언트에 전송

> 카프카에 대한 설명은 ([이곳(대량의 실시간 데이터를 빠르고 안전하게 처리하기 위한 분산형 플랫폼, 카프카)](https://wnjoon.github.io/2022/12/23/tool-kafka/))를 참조하자.

여기서 중요한것은 카프카의 존재 유무와 상관없이, 사용자 입장에서 트랜잭션의 전송은 이더리움에 직접하거나 producer에 전송하거나 둘중 하나가 된다.

### 2. 인터페이스 설계

이더리움에 트랜잭션을 전송하려면 아래와 같은 파라미터가 필요하다.

- [Context](https://deku.posstree.com/ko/golang/context/#google_vignette) : 작업 가능한 시간, 작업 취소 등 작업의 흐름을 제어
- from : 트랜잭션 송신자의 주소 (여기서는 EOA 주소를 받아 내부에서 개인키로 서명한다고 가정)
- to : 스마트 컨트랙트의 주소
- value : 가스비
- data : 이더리움으로 전송할 데이터를 바이트코드로 변환한 값

위에서 설명한대로 하면, <u>트랜잭션 전송을 요청하는 곳에서는 트랜잭션 전송 구현체하고 상관없이 위의 규격에 맞는 트랜잭션 전송 기능을 호출하기만 하면 된다.</u>

이를 인터페이스로 만들면 아래와 같다.

```go
type TxSender interface {
    Sender(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error
}
```

### 3. 인터페이스 구현

go는 동일 패키지 내에서 인터페이스로 선언된 함수와 동일한 입출력 방식을 갖도록 구현하면, 인터페이스를 지킨 구현체라고 인지한다.

위에서 말한대로 직접 이더리움에 트랜잭션을 전송하는 구현체와 카프카 producer로 전송하는 구현체를 각각 만들어보자.

```go
type DirectTxSender struct {...}
type KafkaTxSender struct {...}
```

각 구현체 별로 Sender 기능을 구현한다. 내부 로직은 다를 수 있지만, 중요한 것은 함수명, 입출력 파라미터가 동일하기만 하면 된다.

```go
func (t *DirectTxSender) Sender(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error {...}
func (q *KafkaTxSender) Sender(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error {...}
```

### 4. 구현체 생성

트랜잭션 빌드 및 전송 등 모든 업무를 처리하는 TxManager라는 구현체를 만들어보자. 구현체 내부에는 트랜잭션 전송을 담당하는 sender 객체를 만들 것이다.  
여기서 중요한 점은 <u>sender 변수에 대입하는 객체가 위에서 생성한 Sender 인터페이스</u>라는 것이다.

```go
type TxManager struct {
    ...
    sender Sender // Sender 인터페이스를 따르고 있는 구현체라면 누구든지 환영합니다!
}

func NewTxManager(sender Sender) *TxManager {
    return &TxManager{
        sender: sender,
    }
}
```

이러한 방식은 **Sender 인터페이스를 구현한(트랜잭션을 전송하는 기능을 구현한) 어떠한 객체라도 상관없이 모두 대입 가능** 하다는 의미가 된다. 결국 인터페이스란 객체와 객체의 연결이 아닌 기능과 기능을 연결하는, 기존의 객체끼리 연결하는 과정에서 발생하는 응집도를 더욱 낮추는 장점을 갖게 된다.

그렇다면 실제로 구현체를 대입하는 과정은 어떻게 할까?

```go
dt := NewDirectTxSender(...)
kt := NewKafkaTxSender(...)

txm := NewTxManager(dt) // 직접 이더리움으로 트랜잭션을 전송하고자 하는 경우
txm := NewTxManager(kt) // 카프카를 이용하여 트랜잭션을 전송하고자 하는 경우
```

이와같이 실제 기능을 사용하고자 하는 곳에서 원하는대로 인터페이스에 맞도록 구현된 구현체를 대입하기만 하면 된다.

이처럼 Go언어에서 인터페이스 기반으로 기능을 설계하는 것은 타언어에 비해 굉장히 유연하고 쉽다. 서비스 안에서 하나의 기능에 여러 개발자가 협업하게 되는 경우가 많은데, 인터페이스를 활용하면 서로간의 종속성은 낮아지고 효율적인 개발이 가능하다.

<br>
<br>

---

## 참고자료

- [[Golang] 컨텍스트 - deku](https://deku.posstree.com/ko/golang/context/)
