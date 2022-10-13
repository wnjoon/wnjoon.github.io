---
layout: post
title: "이더리움과 상태 머신" 
excerpt: "이더리움이 왜 상태머신(State machine)인가에 대해 알아본다."
date:   2022-09-10 15:00:00 +0900
categories: blockchain
tags: [ethereum, state machine]
---

<br>

## 이더리움에서의 상태 변화

이더리움 공식 사이트 ([https://ethereum.org](https://ethereum.org)) 에서는 이더리움을 아래와 같이 표현하고 있다.

> Instead of a distributed ledger, Ethereum is a <u>distributed state machine</u>. Ethereum's state is a large data structure which holds not only all accounts and balances, but a machine state, which can change from block to block according to a pre-defined set of rules, and which can execute arbitrary machine code.

우리가 상태(state)라고 표현하는 것은, 그 대상이 변화가능하다는 것을 의미한다. 이더리움에서는 상태를 '다수의 데이터로 이루어진 구조'로 표현한다. 블록체인은 시스템에서 일어나는 모든 변화를 블록에 기록한다. 그리고 그 안에서 우리가 가시적으로 볼 수 있는 변화는 '계정(account)' 과 그 계정이 갖는 '잔고(balance)' 이다.   

정리하면, "<u>정해진 규칙 만족 -> 트랜잭션 발생 -> 블록 생성 -> 상태(계정 내용) 변화</u>" 가 된다.

<br>

## State Machine

컴퓨터 전공 학생이라면 계산이론 수업에서 이 이론을 들어보았을 것이다. 당시에는 무슨 말인지 이해가 가지 않았지만, 결국 '<u>하나의 프로그램이 동작하는 동안 만들어낼 수 있는 유한한 갯수의 분기점(이벤트)</u>'를 의미한다. 

![](https://blog.kakaocdn.net/dn/CUI3j/btrCqpbC1Sy/KefqhEInv9ozvfkkKIIOz1/img.png)  
*@그림 1 : 무자비하게 뻗어나가는 멀티버스의 분기점*

> 위의 그림 1는 (마블빠라면 누구나 알고 있을) 로키가 정복자 캉을 죽임으로써 예상할 수 없는 여러개의 멀티버스 분기점이 쏟아져 나오는 장면이다. 사실 캉을 '프로그래머'로 본다면, 위의 경우는 생각만해도 끔찍한 상황이다. 프로그램이 전혀 예상하지 못한 결과를 언제라도 만들 수 있기 때문이다.

![](https://yrnana.dev/static/2de2bf98863ec891bb1612b11a5f5976/5a190/image.png)  
*@그림 2 : Finite State Machine - nana's blog*

그래서 상태 머신(State Machine, 또는 Finite State Machine)이 존재한다. FSM은 '한번에 한가지 상태'만을 갖도록 설게되며, '상태의 변화는 Transition 이라고 불리는 특정 이벤트를 통해서만' 가능하다.

그림 2는 가장 일반적인 FSM 모델 중 하나인 Data Fetching을 나타낸다. 각 상태(Idle, Fetching, Error)로 이동할 수 있는 방법은 하나만 존재한다. 그리고 특정한 시점에서의 상태는 오로지 하나만 존재한다.

<br>

## 사용 목적 및 장단점

발생 가능한 분기(이벤트)를 미리 예측하고 제어할 수 있다. 특히 if문과 같이 분기 과정에서 예측하지 못한 변수 변경 또는 플로우 진행을 방지할 수 있다.  

그림 2에서 동그란원은 상태를, 화살표는 이벤트를 나타낸다. 즉, Idle을 시작으로 특정 이벤트마다 정확히 하나의 분기만을 처리한다. 

### 장점

위의 그림 2는 간단한 예시를 보였지만, 실제로 프로그램은 수많은 이벤트와 다양한 상태를 포함한다. 자연스럽게 예상하지 못한 장애들이 발생할 수 있는데, 이벤트와 발생 가능한 상태가 명확하게 표현된 상태 머신을 통해 장애 발생지점을 어느정도 짐작하고 빠르게 디버깅할 수 있다.

또한 프로그램이 상태머신으로 표현되면, 상대적으로 설계 자체를 단순화시키고 이를 문서화하기에도 편리하다 (<i>실제로 사람은 글보다 그림으로 전체적인 맥락을 더 쉽게 이해한다고 한다</i>). 즉 전체적인 코드 진행이 한눈에 명확하게 그려지기 쉬운데, 그렇기 때문에 다른 개발자가 스펙에 맞게 프로그램을 구현하기에도 편리해진다. 

### 단점

사실 단점이라기 모호하지만, 상태머신을 적용할 수 있는 오픈소스 라이브러리가 C 또는 C++로 작성되어 있다. 타 언어로는 오픈소스의 라이브러리를 통해 이를 적용할 수 없기 때문에 직접 구현해야 한다. 

<br>

## 이더리움은 그렇다면 왜 상태머신인가?

사실 이 글의 본론이면서 결론인데, 정리하자면

- 이더리움은 스마트 컨트랙트를 통해 발생된 정해진 요청에 의해서만 트랜잭션이 발생
- 상태는 이벤트의 성공으로 인한 변화, 혹은 실패해서 이전 상태로 회귀하는 두 가지 경우만 존재
- 결국 이더리움의 상태는 이벤트의 성공 또는 실패에 따라 예측이 가능하며, 각 경우에 따라 변화할 수 있는 상태 또한 정해져 있음

<br>

## 참고자료