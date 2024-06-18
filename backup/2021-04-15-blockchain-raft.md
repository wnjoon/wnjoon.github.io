---
layout: post
title:  "Raft 합의 알고리즘에 대하여" 
excerpt: "분산 합의 알고리즘의 하나로, CFT 블록체인 계열에서 주로 사용되는 Raft에 대하여 알아본다."
date:   2021-04-15 15:00:00 +0900
categories: blockchain
tags: [합의알고리즘]
---

<br>

## Raft란?

클라이언트가 입력한 데이터를 분산된 노드(특정 서버) 간 동기화 하기 위한 알고리즘으로, Distributed consensus의 한 방법이다.  

기존에는 Paxos 모델을 사용했으나 현재는 Leader-follower 모델을 사용한다. Leader-follower 모델은 전체 노드 중 하나의 리더를 선정하고, 해당 리더가 클라이언트로부터 데이터를 받아 이를 다른 노드들에 전달하는 방식을 말한다.

<br>

## Raft에서의 노드 상태(State)

Raft 알고리즘은 노드를 총 3가지 상태로 구분한다.
- Follower: 모든 노드의 초기 상태(리더가 선정되지 않은 경우)
- Candidiate: 리더로 선출할 수 있는 상태의 노드(리더가 선정되지 않은 경우)
- Leader: 리더로 선출된 노드

<br>

## 리더 선출 조건

그렇다면 리더는 언제 선출되기 시작할까? <u>각 노드는 리더로부터 주기적인 heartbeat 메시지를 받는데, 이 메시지가 일정 기간 오지 않아 timeout이 발생하면 리더는 candidate가 되고 다시 리더의 선출 과정이 진행된다.</u>

### 1. Election timeout

Follower가 Candidate로 변경되는데 걸리는 시간으로, 대략 150ms ~ 300ms 사이의 랜덤값으로 각 노드가 각자 설정하는 값이다.
각 노드별로 이 시간이 다르다는 의미는, Candidate가 되는 순서가 달라지고 request vote를 보내는 것도 제각각이라는 말이다.

### 2. Heartbeat timeout

리더가 주기적으로 보내는 메시지로, 특정 시간(timeout)동안 리더로부터 해당 메시지가 오지 않는 경우 리더는 자동으로 Candidate가 된다.

<br>

## 리더 선출 과정

1. 선거 시작! (선거 기간을 election term이라고 하자 + termCount = 1)
2. 우선 나한테 먼저 투표하고(voteCount = 1)
3. 다른 노드한테 나 투표해달라고 부탁해야지(request vote).
4. 이제 정해진 시간동안 과반수의 투표를 받아야되(timeout)
5. 어, 다른 녀석이 갑자기 자기가 이미 리더라네? -> termCount비교 -> 어 나보다 높네? -> follower로 변경 -> 끝
6. request vote를 받은 각 노드들은 '가장 빨리 요청을 보낸 하나의 candidate'에 투표.
7. 과반수 이상의 투표를 받은 candidate는 리더로 선정
8. 어, 어떤 candidate도 과반수 이상을 받은적이 없네? -> 그럼 election term 다시 시작!

<br>

## 리더가 된 다음 노드의 행보

리더는 계속 자기가 리더라는 것을 말해줘야 한다. 이를 heartbeat 메시지라고 하는데, Append Entries Message라는 구조를 사용한다. 노드들은 리더가 보내는 heartbeat 메시지에 계속 응답하게 되고, 이 상태가 유지되는 동안 election term은 같은 id로 유지된다.  

만약 hearbeat 메시지가 멈추면 해당 리더는 곧바로 Candidate로 변경되고 리더 선출 과정은 다시 시작된다. 

> 간혹 Follower가 메시지를 의도적으로 받지 않는(멈추는) 상황도 있다고 하는데, 이 부분은 다시 확인해보아야 할 것 같다.

<br>

## 명령어 전달 방법 : Log replication

만약 클라이언트가 DB에 X라는 값을 10으로 변경하라는 쿼리를 전송했다고 하자. 단일 노드인 경우에는 그냥 바꿔주면 되는데, 노드가 여러개있는 분산 환경에서는 정확하게 모든 노드가 변경되어야만 하는 요구조건이 생긴다.  

특정 변경사항에 대해 모든 노드가 OK하는 과정을 Consensus, 동의라고 표현하는데, 이 동의과정은 결국 모든 노드가 OK하는 시간이 필요하므로 변경되려는 내용을 누군가가 잘 보존하고 있어야 한다. 이를 위해 해당 명령어를 잠시 담아두는 Log를 사용하는데, 그래서 이 명령어 전달 과정을 Log replication(로그 복제)라고도 표현한다.  

로그 복제는 클라이언트로부터 직접 명령어를 받는 리더를 통해 진행된다. <u>리더는 heartbeat 메시지에 사용되는 Append Entries Message 구조에 해당 변경사항을 작성하고, 이를 노드들에게 전달한다.</u>

1. 리더가 클라이언트로부터 명령어를 받는다.
2. 해당 명령어를 수행하지 않고, 잠시 Log에 적어둔다.
3. 다른 노드들에게 이런 명령어가 전달되었다고 알려준다. 즉 명령어를 노드들에게 전달한다.
4. 다른 노드들이 명령어를 받는다.
5. 다른 노드들도 해당 명령어를 Log에 적고, 나도 Log에 적었다는 응답을 리더에게 전달한다.
6. 리더는 과반수 이상으로부터 응답이 온 경우 해당 명령어를 실제로 수행(Commit)한다.
7. 리더는 클라이언트에게 명령어를 수행했다고 알려준다.
8. 리더는 다른 노드들에게 자신은 명령어를 수행(Commit)했다고 알려준다.
9. 다른 노드들은 Log에 적혀있는 명령어를 실제로 수행(Commit)한다.

만약 7.에서 클라이언트가 응답을 받지 못한다면, 명령어가 실행되더라도 클라이언트가 이에 대한 결과를 모르기 때문에 계속 위의 작업을 반복하게 된다. 이를 막기 위해 명령어 내부에는 Unique Serial Number를 포함시켜서, 해당 작업의 완료여부를 명확하게 구분한다.

<br>

## 참고자료 
- [In Search of an Understandable Consensus Algorithm - Diego Ongaro and John Ousterhout](https://raft.github.io/raft.pdf)
- [Raft 알고리즘 - 내가 알고 있는 모든 지식](http://i5on9i.blogspot.com/2016/09/raft.html)
- [Raft - The Secret Lives of Data](http://thesecretlivesofdata.com/raft/)

