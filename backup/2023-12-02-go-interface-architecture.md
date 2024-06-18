---
layout: post
title:  "Go언어에서 인터페이스 기반 설계하기" 
excerpt: "좋은 아키텍처를 구성하려면 SOLID 원칙을 따라야 한다고 말한다. 그중 인터페이스 기반의 설계는 향후 확장성 및 유연한 환경을 위해 꼭 필요한 방법인데, 이번 포스팅에서는 go언어를 사용하여 인터페이스 기반의 설계를 경험한 내용을 공유하고자 한다."
description: Way to use interface architecture in go language
date:   2023-12-02 15:00:00 +0900
categories: go
tags: [go, architecture]
keywords: golang, architecture
comments: true

---

<br>

## 기존의 방식

필자는 현재 블록체인(Hyperledger Besu) 기반의 다양한 비지니스를 처리할 수 있는 플랫폼 형태의 클라이언트를 golang으로 개발하고 있다. 필자의 선임은 필자에게 항상 인터페이스 기반으로 설계하고, 개발자가 기호에 따라 만든 구현체를 해당 인터페이스로 주입해야 한다고 늘 가르쳐왔다. 어찌어찌해서 개발은 해왔지만 사실 정확하게 이해하고 개발했다고 볼수는 없었는데, 이번에 해당 방식에 대해 제대로 이해했다고 생각했고 이를 포스팅에 남겨놓기로 했다.

```go
type DirectTransactionManager struct {...}
type QueueTransactionManager struct {...}
...
```

DirectTransactionManager 트랜잭션을 가공하고 이를 바로 블록체인 노드에 전송하고, QueueTransactionManager는 가공한 트랜잭션을 카프카와 같은 큐 형태의 서비스에 전달하고 해당 서비스가 트랜잭션을 블록체인 노드로 전송한다.  

```go
func (t *DirectTransactionManager) funcA(...) {}
func (t *DirectTransactionManager) funcB(...) {}
func (t *DirectTransactionManager) SendTransaction(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error
func (t *DirectTransactionManager) funcC(...) {}
...
func (q *QueueTransactionManager) funcD(...) {}
func (q *QueueTransactionManager) SendTransaction(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error
func (q *QueueTransactionManager) funcE(...) {}
func (q *QueueTransactionManager) funcF(...) {}
...
```

위처럼 DirectTransactionManager와 QueueTransactionManager는 다양한 기능들을 포함하고 있지만, 이중 트랜잭션 전송을 요청하는 SendTransaction이라는 동일한 기능을 가질 수 있다.

```go
// 예시이기 떄문에 함수의 이름들이 영 별로인 것을 감안해주길 바란다

type DirectTransactionSender struct {}
type QueueTransactionSender struct {}

func NewTransactionSenderWithDirect(t *DirectTransactionManager) *DirectTransactionSender
func NewTransactionSenderWithQueue(q *QueueTransactionManager) *QueueTransactionSender
```

위의 TransactionManager들을 이용하여 Sender 구현체를 생성한다고 하자. 나에게 필요한건 DirectTransactionManager 또는 QueueTransactionManager 전체가 아닌 그 내부의 SendTransaction임에도 불구하고 각각을 위한 구현체(DirectTransactionSender, QueueTransactionSender)를 모두 만들어줘야 한다.  
이 방법으로 해도 동작은 할 수 있겠지만, 결국 Sender 구현체가 트랜잭션을 처리하는(그 중 전송하는 방식을 갖는) 각 구현체(TransactionManager)들에 종속적이게 된다. 클린 아키텍처에서 말하는 SOLID 원칙에 맞지 않는다.

> 복잡한 내용을 정리하면, 실제 개발자가 필요한 기능은 트랜잭션 전송임에도 불구하고 트랜잭션 처리 방식에 대해 모두 알고 각각에 맞는 구현체들을 만들어줘야 한다는 것이다.

<br>

## 인터페이스 기반으로 설계하기

Go언어에서는 인터페이스를 굉장히 간단하게 구현할 수 있도록 해준다. 일명 Duck Typing이라고도 부르는데, <u>그냥 함수명과 파라미터, 그리고 반환값이 일치하기만 하면 해당 함수는 인터페이스를 따르고 있다고 컴파일러는 이해한다.</u>

```go
type Sender interface {
    SendTransaction(ctx context.Context, from common.Address, to *common.Address, value *big.Int, data []byte) error
}
```

이러면 끝이다. TransactionSender는 '누군지는 관심없고, 나에게 SendTransaction 기능을 제공할 수만 있으면 됩니다' 라고 파라미터를 열어두기만 하면 된다.

```go
type TransactionSender struct {
    ...
    sender Sender // Sender 인터페이스를 따르고 있는 구현체라면 누구든지 환영합니다!
}

func NewTransactionSender(sender Sender) *TransactionSender {
    return &TransactionSender{
        sender: sender,
    }
}
```

이처럼 파라미터에 Sender 인터페이스를 지키고 있는 구현체를 주입해달라고 요청하면 된다. 그러면 실제 주입은 어떻게 이루어질까?

```go
func main() {
    ...

    qtm := NewQueueTransactionManager(...)
    dtm := NewDirectTransactionManager(...)
    
    transactionSender := NewTransactionSender(qtm) // queue 기반으로 트랜잭션을 전송하고자 하는 경우
    transactionSender := NewTransactionSender(dtm) // 직접 트랜잭션을 전송하고자 하는 경우
}
```

이처럼 Go언어에서 인터페이스 기반으로 기능을 설계하는 것은 타언어에 비해 굉장히 유연하고 쉽다. 서비스 안에서 하나의 기능에 여러 개발자가 협업하게 되는 경우가 많은데, 인터페이스를 활용하면 서로간의 종속성은 낮아지고 효율적인 개발이 가능하다.  

