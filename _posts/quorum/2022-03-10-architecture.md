---
title:  "[📝 GoQuorum Docs] Architecture" 
excerpt: "GoQuorum의 아키텍처 및 특징에 대해서 알아본다."

categories:
  -  Quorum
tags:
  - [Quorum, Blockchain]

toc: true
toc_sticky: true

date: 2022-03-10
last_modified_at: 2022-03-10
---

<br>

## GoQuorum에 대한 High-level 구조도

![image](https://user-images.githubusercontent.com/39115630/157575006-8312a4e0-abe2-4cd8-99ff-7b4a35e0a400.png)  
*<그림 1: High-level 구조로 보는 GoQuorum>*

### Geth와 GoQuorum 간의 관계

> '[Geth에 대하여 포스팅한 내용](https://wnjoon.github.io/ethereum/devmode_using_geth/)'이 있으므로, 이를 참조하면 좋다.

Geth는 Go Ethereum의 약자로, 이더리움에서 스마트컨트랙트를 호출할 수 있도록 하는 공식 클라이언트 어플리케이션 중 하나를 말한다. GoQuorum은 기본적으로 Geth의 성질을 따라가지만, 이더리움의 Public한 환경이 아닌 Private한 네트워크를 구성하므로 일부 상이한 점이 존재한다.  
GoQuorum은 geth를 경량화(lightweight)하여 fork한 것으로, geth로부터 파생되었기 때문에 geth와 거의 동일한 주기로 업데이트가 이루어진다.

### Geth와 다른 GoQuorum의 성질

- PoW(Proof of Work)가 아닌 Istanbul BFT, QBFT, Raft와 같은 PoA(Proof of Authority)합의 알고리즘을 사용
- P2P 계층은 권한이 부여된(permissioned) 노드간의 연결만 허용하도록 수정
- 블록 생성 및 검증 과정에서 사용되는 데이터를 global state root -> global public state root로 변경
- The State Patricia trie를 public state trie와 private state trie  두 가지로 구분
- Private transaction을 처리할 수 있도록 블록 유효성 검증 로직 수정
- 개인정보 등 민감한 데이터를 포함하는 transaction을 암호화된 해시 값으로 대체 가능
- 모든 사용자가 아닌, 특정 사용자에게만 공유되는 transaction 생성 가능
- 가스에 대한 개념은 존재하지만, 실제 네트워크에서 사용되지 않음

<br>

## 참고자료
- [GoQuorum Docs - Architecture](https://consensys.net/docs/goquorum/en/latest/concepts/architecture/)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>