---
layout: post
title:  "Infura로 이더리움 테스트용 노드 만들기" 
excerpt: "Infura를 이용하여 간편하게 이더리움 테스트를 위한 노드를 만들어본다."
date:   2021-05-14 15:00:00 +0900
categories: blockchain
tags: [ethereum, infura]
---

<br>

## Infura

일반적으로 디앱(DApp)를 개발할 때에는 로컬에서 Ganashe 또는 Truffle develop을 사용하거나 geth를 이용한 private network를 구성한다. 물론 디앱에 국한되지 않더라도 대부분의 앱 또한 로컬에서 개발 -> 테스트 -> 실제 환경과 유사한 개발환경에서 테스트 -> 배포와 같은 순서를 갖는다.   
디앱은 여기서 조금 다른 부분이 테스트넷 환경에서 실제로 구성된 노드에 직접 테스트해봐야 한다는 점이다. 물론 풀노드(full node)로 테스트할 수도 있지만, 저장 공간이나 시간부터 꽤 많은 비용과 관리가 들어가는 등 실제로 개발에 들어가는 공수보다 배꼽이 더 큰 경우가 생길 수 있다.  
이러한 번거로움을 해결할 수 있는 것이 Infura를 사용하는 것이다. Infura는 Consensys에 속한 프로젝트 중 하나로, Infura에서 제공하는 이더리움 노드를 사용함으로써 제품과 서비스에 대한 개발에만 집중할 수 있도록 한다. 이는 Infura가 갖고 있는 미션에서도 잘 표현된다. 

> Our suite of high availability APIs and Developer Tools <u>provide quick, reliable access to the Ethereum and IPFS networks</u> so you can focus on building and scaling next generation software.

Infura의 특징을 정리해보면 다음과 같다.
- Accessubility : Minimal hardware requirements
- Convenience : No waiting to sync and no installs
- Redundancy : Either build into the gateway service or switch to new endpoint
- Security : Signing without a web-connection

<br>

## Infura 사용하기

### 1. 회원가입

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FNHn56%2Fbtre1bgLN0O%2FKNtO5p6MNQVoWuqiFx4Y6k%2Fimg.png){: width="40%" height="40%"}  
*@그림 1: Infura 홈페이지에서 회원 가입하기*

딱히 복잡한게 없다. 그냥 이메일 주소랑 비밀번호만 입력하면 된다

### 2. 프로젝트 생성

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FUfHlw%2Fbtre7sOHSKs%2FqyZgxZq2lW9TU65YGYktm0%2Fimg.png)  
*@그림 2: Infura에서 testnet이라는 이름의 프로젝트를 생성한 결과*

Testnet이라는 프로젝트를 하나 만들고나면, 위와 같은 결과 화면을 볼 수 있다.

### 3. API KEY 확인

필자는 요즘 Loom network에 대해 공부하고 있는데(이 포스팅을 작성하게 된 가장 큰 원인이기도 하다), 튜토리얼을 진행하려면 Infura에서 만든 노드의 API KEY를 Rinkeby에 연결하라고 했지만 어디에서도 API KEY가 보이지 않는다.

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FZZu7t%2Fbtre1aCd15g%2Fh8QY2tVMM0zqUXM7lsXsK0%2Fimg.png){: width="70%" height="70%"}  
*@그림 3: Testnet 프로젝트에 접근할 수 있는 API 키*

위 그림에서 ENDPOINTS에 해당하는 다음 URL이 API KEY를 나타내는 내용이다. 이 중 /v3/ 이후의 내용이 API KEY라고 보면 된다.

<br>

## 참고자료
- [Infura 사용해보기](https://medium.com/@sungjoon.yoon/infura-사용해보기-24af9bf12c4c)