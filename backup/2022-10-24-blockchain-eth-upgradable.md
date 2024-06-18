---
layout: post
title:  "Upgradable 스마트 컨트랙트란?" 
excerpt: "스마트 컨트랙트의 가장 큰 특징은 한번 배포되면 절대로 내부를 수정할 수 없다는 것이다. 하지만 스마트 컨트랙트 내부 로직이 변경되어야만 하는 경우가 생긴다면 어떻게 해야할까? delegate call을 이용하면, 스토리지를 담당하는 컨트랙트와 기능을 담당하는 컨트랙트를 서로 분리해서 기능을 변경하더라도 스토리지(토큰)에 영향을 주지 않는 구조를 설계할 수 있다."
date:   2022-10-24 15:00:00 +0900
categories: blockchain
tags: [ethereum, solidity, smart contract]
---

<br>

## Upgradable 컨트랙트의 필요성

스마트 컨트랙트의 가장 큰 특징은 '한번 배포되면 절대로 내부를 수정할 수 없다'는 것이다. 하지만 스마트 컨트랙트 내부 로직이 변경되어야만 하는 경우가 생긴다면 어떻게 해야할까? 

> 예를 들어, 약 100개의 토큰이 이미 발행된 스마트 컨트랙트의 내부의 로직을 변경해야 한다고 하자. 우리는 이미 '배포된 컨트랙트는 수정이 불가능'하다는 것을 알고있다. 결국 방법은 '컨트랙트를 새로 배포'하는 것 밖에 없다. 그리고 컨트랙트를 새로 배포하게 되면, 발행된 토큰 뿐만 아니라 컨트랙트 내부에 저장되어 있는 많은 정보들이 무효화된다. 결국 기존에 있던 정보들을 앞으로 사용할 수 없다는 것이다.

이러한 문제점을 해결하는 방안이 'Upgradable' 스마트 컨트랙트이고, 이를 위해 delegate call 이라는 호출 방법을 사용한다.

<br>

## 호출 방법에 따른 분류

이를 위해 이더리움에서는 '변경할 일이 발생할 수 있는 로직을 별도로 갖는 스마트 컨트랙트'를 만들고, '토큰을 보유한 스마트 컨트랙트가 해당 스마트 컨트랙트를 호출' 하는 방법인 delegate call이라는 기능이 있다. 

### 1. call

![](https://velog.velcdn.com/images/wnjoon/post/cae1f3f6-c7ed-4995-a87c-3c881a87a6e5/image.PNG)

*@그림 1 : call을 사용하여 add() 호출*

call은 말 그대로 스마트 컨트랙트 내부에 있는 함수를 직접 호출한다. 그림 1을 단계별로 작성해보면 아래와 같다.

1. EOA(0x1)가 스마트 컨트랙트 A의 callB 함수를 호출
2. 스마트 컨트랙트 A가 스마트 컨트랙트 B의 add 함수를 호출
3. 스마트 컨트랙트 B 내부의 num 값이 스마트 컨트랙트 B의 add 함수를 통해 변경

결국 스마트 컨트랙트의 호출자(msg.sender)는 각 스마트 컨트랙트를 호출한 주소가 될 것이고, 변경되는 값 최종적으로 호출되는 스마트 컨트랙트 내부의 값이 될 것이다.

### 2. delegate call

![](https://velog.velcdn.com/images/wnjoon/post/b725f4ea-ef42-441d-990c-ed2bddcf958f/image.PNG)

*@그림 2 : delegate call을 사용하여 add() 호출*

delegate call은 번역 그대로 '대행 호출'이다. 그림 2를 단계별로 작성해보면 아래와 같다.

1. EOA(0x1)가 스마트 컨트랙트 A의 delegatecallB 함수를 호출
2. 스마트 컨트랙트 A를 통해 스마트 컨트랙트 B의 add 함수가 호출됨 (마치 add 함수가 스마트 컨트랙트 A에 위치한 것처럼)
3. 스마트 컨트랙트 B의 add 함수를 통해 스마트 컨트랙트 A의 num 변수 값을 변경

2번에서 작성한 것 처럼, delegate call을 사용하면 다른 스마트 컨트랙트에 있는 특정 기능을 '<u>가져와서 사용</u>'하는 효과를 가져올 수 있다. 위의 그림 2를 통해 다시 표현하자면, 스마트 컨트랙트 A는 껍데기가 되고, 스마트 컨트랙트 B에서 실제 기능을 수행할 수 있는 것이다.

<br>

## 결론

결국 delegate call을 이용하면, 스토리지를 담당하는 컨트랙트와 기능을 담당하는 컨트랙트를 서로 분리해서 기능을 변경하더라도 스토리지(토큰)에 영향을 주지 않는 구조를 설계할 수 있다. 

<br>

## 참고 

- [call Vs delegate call - dayone](https://dayone.tistory.com/38)
- [call, delegatecall - 멍개의 연구소](https://meongae.tistory.com/57)
- [DelegateCall: Calling Another Contract Function in Solidity - medium](https://medium.com/coinmonks/delegatecall-calling-another-contract-function-in-solidity-b579f804178c)
