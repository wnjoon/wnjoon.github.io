---
layout: post
title:  "하이퍼레저 패브릭에서 생성된 블록은 어디에 있을까?" 
excerpt: "하이퍼레저 패브릭에서 생성된 블록이 피어 컨테이너 내부에서 데이터 형태로 실제 저장되는 위치를 알아본다."
date:   2021-02-18 15:00:00 +0900
categories: blockchain
tags: [hyperledger fabric]
---

<br>

## 컨테이너로 구성된 피어

하이퍼레저 패브릭에서 원장, 즉 블록을 저장하고 있는 주체인 피어(Peer)는 기본적으로 컨테이너 형태로 구성된다. 그러므로 피어에 생성되고 있는 블록 또한 컨테이너 내부에 위치하는 셈인데, 그렇다면 컨테이너의 어디에 블록이 위치하고 있을까? 

> To see the physical location of these data you can go to /var/hyperledger/production in each peer container in your fabric network. 

Stackoverflow의 한 답변에 의하면, 각 피어 컨테이너의 /var/hyperledger/production 디렉토리에서 생성된 블록을 확인할 수 있다고 한다.

<br>

## 확인

### 1. 블록

```bash
$ cd /var/hyperledger/production/ledgersData/chains/chains/{채널이름}
```

### 2. 데이터베이스

```bash
$ cd /var/hyperledger/production/ledgersData/stateLeveldb
```

원장이 아닌 데이터의 경우, 아래와 같은 구조로 구성되어 있다.

```bash
000001.log    CURRENT    LOCK    LOG    MANIFEST-000000
```

### 3. 체인코드

```bash
$ cd /var/hyperledger/production/chaincodes
```

install 및 instantiate 된 체인코드와 각 체인코드의 버전을 보여준다.

<br>

## 저장소에 대한 설명

### 1. Ledger

> [Ledger - Hyperledger Fabric docs](https://hyperledger-fabric.readthedocs.io/en/release/ledger.html)

실제 '블록체인'을 의미하며, 연속된 블록(Serialized block)을 저장하는 파일 기반으로 이루어져있다. 
각 블록에는 하나 이상의 트랜잭션(transaction, tx)이 존재하는데, 각 트랜잭션 별로 하나 이상의 key/value 쌍을 수정 또는 작성할 수 있는 Read/Write Set을 가지고 있다.  
원장은 Hyperledger Fabric 내에서 채널 마다 독립적으로 존재하며, 블록체인을 구성하는 데이터 그 자체이기 때문에 변경/삭제가 불가능하다.

### 2. The state database (World State)

Statedb(또는 World State)는 특정 키에 대해 최종적으로 커밋된(반영된) 값을 갖는다. 블록체인 내에서 각 피어가 트랜잭션의 유효성을 검사한 후 커밋을 완료할 때 statedb에 값이 반영된다. Statedb는 각 트랜잭션의 최종 값이지만 블록(원장)은 아니므로, 원장이 재 처리될 경우 statedb 값은 변경될 수 있다.  
현재 LevelDB 또는 CouchDB 두가지 옵션으로 구성할 수 있다.

### 3. Chain

체인은 해시(Hash) 링크 블록으로 구성된 트랜잭션의 로그들인데, 각 블록마다 N개의 트랜잭션이 존재한다. (블록 내에 존재하는 트랜잭션의 갯수는 블록체인 네트워크를 구성할 때 설정할 수 있다)  
각 블록의 헤더에는 블록 트랜잭션의 해시와 이전 블록 헤더의 해시가 포함되는데, 일정 수 이상의 트랜잭션들이 순서대로 하나의 블록을 이루는 과정에서 원장의 모든 거래가 암호화되어 연결된다.

<br>

## 참고자료
- [Where is the blockchain physically - Stackoverflow](https://stackoverflow.com/questions/48764151/where-is-the-blockchain-physically)
- [Ledger - Hyperledger Fabric docs](https://hyperledger-fabric.readthedocs.io/en/release/ledger.html)

