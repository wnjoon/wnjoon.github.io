---
layout: post
title:  "하이퍼레저 패브릭의 MVCC(다중 버전 동시성 제어)" 
excerpt: "하이퍼레저 패브릭에서 발생 가능한 MVCC 오류에 대해서 알아본다."
date:   2021-04-07 15:00:00 +0900
categories: blockchain
tags: [hyperledger fabric, database, mvcc]
---

<br>

## Concurrency Control(동시성 제어)

![image](https://user-images.githubusercontent.com/39115630/143964658-5fe6434a-1a24-4719-b034-306febc84ce8.png)  
*@그림 1: 동시성 제어 예시 그림*

DBMS에서 다수의 사용자 간 동시에 처리되는 트랜잭션으로부터 데이터베이스를 보호하는 방법으로, 동시에 하나의 컬럼에 접근하는 경우 값의 일관성이 낮아질 수 있는 오류를 막기 위하여 사용된다.

위의 그림을 보면 Commit이 이루어지지 않은, 값이 변경되고 있는 도중에 해당 값을 사용하는 과정에서 의도하지 않은 결과가 도출될 수 있다는 것을 볼 수 있다. 이를 방지하기 위해 일반적으로 <u>값을 읽고 쓰는 모든 순간에 Lock을 걸어서 해결</u>한다.  
하지만, <u>이러한 동시성 제어 방식을 사용하더라도 읽기와 쓰기의 작업이 빈번하게 발생하는 데이터베이스의 경우 완벽한 보호가 어렵다는 것이 현실</u>이다. 결국에는 Lock의 시간을 조정해야 하는데, 안전한 시스템을 위해 충분한 시간을 제공하게 되면 성능 이슈의 발생을 피하기는 어렵게 된다.

<br>

## MVCC(Multi-Version Concurrency Control)

![image](https://user-images.githubusercontent.com/39115630/143964921-459e73a6-7983-41dd-a4a0-5fb459d6985b.png)  
*@그림 2: MVCC 예시 그림*

MVCC는 기존의 Lock 방식과 다르게 <u>해당 데이터 값에 순서를 매긴다. 이를 버저닝(Versioning)</u>이라고 하는데, 조금 더 전문적으로 표현하자면 아래의 순서대로 진행된다.
1. 사용자가 특정 데이터에 접근하게 되면 해당 시점의 데이터베이스 스냅샷(snapshot)을 읽는다.
2. 이 스냅샷은 사용자가 데이터의 변경을 완료하는 시점(commit)까지 데이터베이스에 실제로 반영되지 않는다.
3. 사용자의 업데이트가 완료되는 시점에 새로운 버전의 데이터로 별도의 영역에 생성된다.

이러한 방식을 사용하면 장점도 있지만 단점도 존재한다.
- 장점: 읽기와 쓰기 과정에 다른 사용자의 영향을 받지 않기 때문에 기존의 방식에 비해 매우 빠른 속도의 데이터베이스를 구성할 수 있음
- 단점: 
  1. 같은 값을 계속 업데이트 하던 방식과 다르게 사용 되지 않는 이전의 데이터가 계속 쌓이게 되므로 이를 꾸준히 정리해야한다. 
  2. 데이터의 버전 관리를 데이터베이스에서 하지 않기 때문에 이를 어플리케이션 레벨에서 해결해야 한다는 어려움이 있다.

<br>

## Hyperledger Fabric에서의 MVCC 사용법

하이퍼레저 패브릭은 MVCC 기법을 사용하여 StateDB를 관리한다. 그러므로 읽기 과정에서 발생할 수 있는 버전의 충돌 문제를 가지고 있다. <u>해당 트랜잭션이 아직 블록에 작성(commit) 되지 않았을 때 이를 조회하거나, 혹은 작성 되지 않은 시점에서 같은 값을 또 다시 접근하게 되는 경우에 이런 문제점이 발생</u>하게 된다. 이러한 경우를 <u>Double spending(이중 지불)</u>이라고 표현하며, MVCC는 이러한 문제점을 해결할 수 있도록 하는 방법이다.

[validateAndPrepareBatch](https://github.com/hyperledger/fabric/blob/dead74ff9d009105344b07b0f26a657eada61563/core/ledger/kvledger/txmgmt/validation/validator.go#L81)는 하이퍼레저 패브릭에서 블록에 최종 커밋하기 전 트랜잭션의 검증을 수행하는 소스 코드이다.  
추가로 [validateTx](https://github.com/hyperledger/fabric/blob/dead74ff9d009105344b07b0f26a657eada61563/core/ledger/kvledger/txmgmt/validation/validator.go#L129)에서는 실제로 MVCC 오류 여부를 판단해준다.

<br>

## MVCC 외 Double spending 해결 방법

소스에서 보았던 것 처럼 하이퍼레저 패브릭에서도 여러가지 방법을 통해 MVCC 오류의 발생을 막기 위해 노력하고 있지만, 다수의 분산된 환경에서 하나의 트랜잭션에 동시에 접근할 확률이 조금이라도 있는 한 완벽한 해결책을 제시하기는 어려운 상황이다.  
그렇기 때문에 이러한 오류가 발생할 확률을 조금이라도 낮추기 위한 구조를 개발하는 것이 중요한데, 이러한 방법에 대해 [How to prevent key collision in Hyperledger Fabric chaincode](https://medium.com/@gatakka/how-to-prevent-key-collisions-in-hyperledger-fabric-chaincode-303700716733) 라는 글에서는 다음과 같이 조언하고 있다.

### 1. No duplicated keys

이 방법은 <u>트랜잭션이 하나 발생할 때마다 키를 다르게 구성함으로써 중복된 키의 생성을 막아야 한다</u>는 의미이다. 기본적으로 하이퍼레저 패브릭은 LevelDB 기반이기 때문에 key-value 형식으로 구성되므로, 기존의 RDB 형식과 같이 인덱스를 두지 않고 단순히 키를 순차적으로 정렬하여 사용한다.

> 곧 deprecated 될 수 있다는 말이 있지만, 현재 하이퍼레저 패브릭은 CouchDB도 제공하고 있으며 향후 LevelDB와 CouchDB를 어느정도 혼합한 MongoDB도 계획에 있다고 한다.

일반적으로 블록에 데이터를 새롭게 저장하는 경우는 키가 새롭게 만들어지기 때문에 문제가 되지 않는다. 하지만 <u>데이터가 수정되는 경우</u>가 문제다. StateDB상에는 같은 컬럼에 접근하기 때문에 동일한 키를 사용하고 내부 값만 변경해야 한다고 생각되지만, 이러한 경우 아직 변경되지 않은(블록에 커밋이 완료되지 않은) 값을 조회하거나 심지어 또 다시 변경을 진행하려고 할 경우 문제가 발생할 수 있다. 이를 막기 위해서는 키 구조를 매우 신중하게 가져가야하며, 되도록이면 <u>블록에 write하는 과정에서는 별도의 키를 만들어서 저장하는 것을 권장</u>한다.

### 2. Put requests in queue

여러개의 쓰레드를 사용하는 것이 아닌, 하나의 큐에서 모든 트랜잭션을 관리하는 방법이다. <u>앞의 트랜잭션이 완벽하게 처리된 후 다음 트랜잭션을 이어가는 방식</u>인데, 보기만 해도 성능 이슈가 뻔히 떠오르는 방식이다. 원문에서는 키와 Client-Server간 의존도를 높여서 특정 키를 업데이트 하는 다수의 트랜잭션들만 선별하여 큐로 보내는 방식을 제안한다.

### 3. Running total

우선 트랜잭션을 다 보내고, 나중에 주기적으로 다시 정리해주는 방식이다. 일종의 처리 후 관리(정산?) 방식인데, 실시간으로 처리되어야 하는 도메인에서는 사용하기가 어려울 것으로 보인다.

### 4. Batching

여러개의 트랜잭션을 우선 모아두었다가 한번에 블록에 작성하는 방식이다. 이를 위해서는 트랜잭션 객체를 하나로 묶을 수 있는 리스트/배열 형태의 구조가 체인코드 내에서 개발되어야 한다. 또한 다수의 트랜잭션을 한번에 담을 수 있도록 블록의 사이즈(batchSize)와 블록 생성 주기(batchTimeout) 설정 값들이 충분히 할당되어야 한다.

> 필자의 경우 지난번에 수행한 프로젝트 중, 일간 10만건 이상의 트랜잭션 데이터를 블록에 매일 담아야 하는 배치 업무를 개발한 적이 있다. 다행이도 모든 트랜잭션들이 중복되지 않는 키 값을 가질 수 있었고, 각 트랜잭션의 크기가 그렇게 크지 않는 점을 감안하여 블록에 저장할 수 있는 최대치의 트랜잭션을 계산한 후 이를 리스트로 모아 한번에 블록에 저장하는 방식을 개발하였다.
명확한 수치가 기억나지 않지만, 하나씩 블록에 던져서 처리하는 시간모다 대략 100~150개씩 트랜잭션을 묶어서 블록체인에 호출했을 때 수십배 이상의 시간 단축(!)이 일어났던 것으로 기억한다. 물론 MVCC 오류 또한 발생하지 않았다.

<br>

## 참고자료
- [Hyperledger Fabric에서의 MVCC Read Conflict - byron1st](https://velog.io/@byron1st/Hyperledger-Fabric%EC%97%90%EC%84%9C%EC%9D%98-MVCC-Read-Conflict)
- [MVCC(다중 버전 동시성 제어)란? - 망나니개발자](https://mangkyu.tistory.com/53)
- [How to prevent key collisions in Hyperledger Fabric chaincode - Ivan Vankov (gatakka)](https://medium.com/@gatakka/how-to-prevent-key-collisions-in-hyperledger-fabric-chaincode-303700716733)