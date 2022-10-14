---
layout: post
title:  "이더리움에서의 Badge, 그리고 ERC-1238" 
excerpt: "배지(Badge)란, 거래가 불가능한 속성을 갖는 토큰을 의미한다. 사용자의 경험에 대한 산물일 수도 있고, 혹은 명예 또는 자격증과 같은 성격을 가질 수도 있다. 현재 ERC-1238이라는 형태의 토큰으로 만들 수 있으며, 또 다른 이름으로 NTT(Non-Transferable Token)라고 불리기도 한다."
date:   2022-10-13 15:00:00 +0900
categories: blockchain
tags: [ethereum, erc]
---

<br>

## Non-Transferable Token(NTT)

ERC-1238은 NTT라고도 불리는데, NTT는 말 그대로 '거래가 될 수 없는 토큰'을 의미한다. 처음 이슈가 시작된 스레드([Original ERC thread](https://github.com/ethereum/EIPs/issues/1238))를 기점으로 '경험 또는 성과에 대한 증명에 대한 기능만을 수행'하는 토큰에 대한 정의가 시작되었고, 현재 NTT 표준에서는 다양한 dApp 또는 스마트 컨트랙트로부터 <u>배지 형태로 표현되는 사용자 별 고유 특성을 관리 및 확인할 수 있는 기능을 제공하는 API 목록</u>을 포함하고 있다.

결국 NTT, 배지라는 것은 어떠한 가치가 아닌 사용자의 특성을 나타내는 용도이기 때문에 다른 누군가에게 거래(양도)되지 않는다. 하지만 분실되거나 만료될 수는 있다.

![image](https://9to5fortnite.com/de/wp-content/uploads/2022/03/Forza-Horizon-5-Solar-Panels-Standort-und-wo-zu-finden.jpg)  
*@그림 1: Forza horizon 5에서 표시되는 사용자의 경험에 따른 배지 - 9to5fortnite.com*

공식 사이트에서는 NTT에 대한 사용 예시를 아래와 같이 작성하고 있다.

- 권한 부여: 학술 기관의 학위 여부, 회의용 종이 간행물, 건물 또는 특별 채팅으로의 접근
- 경험치: 게임에서의 점수 또는 이를 통해 부여된 자격
- 내용 증명: 온체인 상에 존재하는 사용자 별 DAO 또는 스마트 컨트랙트로부터 발행 및 서명된 모든 내용에 대한 증명
- 구독 여부: 구독을 통한 컨텐츠의 접근 가능 여부

### 1. Requirement

- NTT는 주소에서 다른 주소로 양도(Transfer)되어서는 안된다. 잔고의 업데이트는 발행 또는 소각을 통해서만 이루어져야 한다.
- NTT는 NFT일수도, FT(경험치 포인트, 신용점수 등)일수도 있다. 즉, 어느걸로 표현되어도 상관없다.
- NTT는 동의 없이 발행되어서는 안된다. 그 위치가 EOA 또는 스마트 컨트랙트 어느곳이던.
- NTT는 스마트 컨트랙트 내에서 스테이킹(locked)될 수 있어야 한다.

표준은 아니지만, 아래와 같은 내용도 있다.

- 각 NTT는 자신만의 토큰 URI가 있을 수 있다.
- NFT 형태의 NTT는 하나의 컬렉션 형태로 묶어질 수 있는데, 예를 들어 '무이자 대출을 받을 수 있도록 하는 NTT 시리즈 중 하나'와 같이 만들어질 수 있다.

### 2. 역시나 세부사항은 dApp으로

*여느 스마트 컨트랙트의 사상과 비슷하게* NTT의 생성 및 회수 등에 필요한 요구사항(로직)은 모두 어플리케이션에서 진행된다. 스마트 컨트랙트에서는 '단일 기능'의 관점으로만 접근해야 한다.

<br>

## Specification

violetprotocol에서 표준에 맞는 ERC-1238을 개발하였다. [violetprotocol/ERC1238-token - github](https://github.com/violetprotocol/ERC1238-token)에 해당 소스가 모두 공개되어 있기 때문에 살펴보면 좋을 것이다.

### 1. ERC-1238 Interface

[ERC-1238 interface](https://github.com/violetprotocol/ERC1238-token/blob/main/contracts/ERC1238/IERC1238.sol)를 참조하면 누구나 자신만의 NTT를 만들 수 있다. 위의 Requirement에 적혀있는, 아래와 같은 사항을 준수해야 한다.

- MUST NOT
    - Trnasfer 기능은 활성화하지 않을 것. 토큰 갯수의 변동은 발행 또는 소각을 통해서만 가능해야 한다.
    - 발행된 토큰은 특정 주소에서 다른 주소로 전송되어서는 안된다.
- MUST
    - 토큰은 보유자가 자신의 마음대로 소각할 수 있어야 한다.
    - 토큰은 수신자가 동의한 경우에만 해당 수신자에게 발행될 수 있어야 한다.
- MAY
    - 토큰의 발행자는 발행된 토큰을 소각할 수 있어야 한다.

### 2. ERC-1238 TokenReceiver Interface

작성된 ERC-1238 스마트 컨트랙트는 [ERC1238TokenReceiver 인터페이스](https://github.com/violetprotocol/ERC1238-token/blob/main/contracts/ERC1238/IERC1238Receiver.sol)를 상속받아야만 토큰의 발행 기능을 적용할 수 있다.

### 3. URI Storage Exention

[IERC1238URIStorage](https://github.com/violetprotocol/ERC1238-token/blob/main/contracts/ERC1238/extensions/IERC1238URIStorage.sol)는 필요에 따라 추가하면 되는데, 발행된 토큰의 ID 별 URI를 가질 수 있도록 한다. 

### 4. Expirable Extension

[IERC1238Expirable](https://github.com/violetprotocol/ERC1238-token/blob/main/contracts/ERC1238/extensions/IERC1238Expirable.sol)는 필요에 따라 추가하면 되는데, 발행된 토큰마다 만기일을 가질 수 있도록 한다.

### 5. Collection Extension

[IERC1238Collection](https://github.com/violetprotocol/ERC1238-token/blob/main/contracts/ERC1238/extensions/IERC1238Collection.sol)는 필요에 따라 추가하면 되는데, 토큰 보유자가 자신의 토큰을 다른 주소에서 보유하거나 다른 스마트 컨트랙트로 스테이킹 할 수 있도록 한다.

<br>

## 좀 더 깊이 들여다보기

### 1. ERC-1155

#### 1.1. 채택 이유

ERC-1238은 하나의 스마트 컨트랙트 내에 다양한 성격(특성)의 토큰을 관리할 수 있는 ERC-1155로부터 영감을 받았다. 추가로 이름, 기호와 같은 추상적인 내용을 뺴고 표현적인 정의만을 다루도록 설계되었다.

#### 1.2. 특성

ERC-1155의 특성을 간단하게 정리해보면 아래와 같다.

- 토큰 컬렉션 별로 스마트 컨트랙트를 배포할 필요가 없다. 즉 가스를 절약할 수 있다.
- ERC-1155는 FT 또는 NFT 모두의 특성을 지닌다. 즉, 둘 중 어느것으로도 토큰을 만들어낼 수 있다.
- 발행과 여러 토큰에 대한 잔고조회의 두 기능을 한번의 call로 처리할 수 있다.
- ERC1155TokenReceiver 인터페이스가 없는 스마트 컨트랙트로 ERC-1155가 잘못 전송되는 경우, 해당 전송은 손쉽게 revert된다.
- ERC1155TokenReceiver 인터페이스가 구현된 스마트 컨트랙트로 ERC-1155가 전송되어도, 잔고의 증가가 불가능하도록 한다.

ERC-1155의 경우 배치(batch)기능이 있는데, 동일한 ID를 갖는 토큰을 단일 트랜잭션을 통해 여러 개 동시 발행할 수 있다. 하지만 발행된 토큰이 다수의 사용자에게 동시 배포되는 것까지 단일 트랜잭션으로 가능한 것은 아니다. 이를 해결하기 위해 bundle이라는 기능이 만들어졌다.

#### 1.3. 호환성

ERC-1155와 대부분의 개념 및 방법이 동일하게 유지된다. 단 NTT라는 이름의 특성 답게 Transfer라는 이름은 표준을 그대로 사용하지 않고 MintSingle, MintBatch, BurnSingle, BurnBatch 등으로 대체한다.

### 2. 토큰의 다형성

이러한 접근방법으로 만들어진 인터페이스는 ERC-1238로 하여금 불가지론을 유지할 수 있도록 한다. (불가지론 : 어떤 명제나 대상에 대해서 그 진위나 실존의 여부를 현재로선 알 수 없다고 보는 철학적 관점) 이는 토큰이 꼭 NFT여야 하거나 FT여야만 한다는 기준 없이 경우에 따라 선택적으로 만들어질 수 있다는 의미를 준다. 

> 예를 들어 한 온라인 게임에서 레벨업을 할 경우, NFT 형태의 보상 아이템과 FT 형태의 경험치 포인트를 NTT로 제공할 수 있다.


### 3. 동의가 필요한 프로세스

만약 누군가의 평판을 저해하는 배지가 무분별하게 사용자에게 전달된다면 어떨까? 이러한 문제를 막기 위해 NTT는 수신자의 동의가 선행되어야만 해당 사용자에게 발행될 수 있도록 한다.

IERC1238Receiver 인터페이스는 수신자가 발행 동의 여부를 특정 값의 반환을 통해 나타내도록 한다. 이를 위해 토큰의 발행 시점에 EIP-712 방식의 서명이 이루어져야 한다.

<br>


## 보안적인 측면

NTT는 양도가 불가능하기 때문에, 특정 계정에 문제가 생겨도 다른 주소로 해당 토큰을 이전하는 것이 불가능하다. 결국 잘못된 주소로 발행된 토큰을 소각하고, 새로운 주소로 재발행해야 한다.

소유권의 변경이 용이하게 이루어지기 위해 스마트 컨트랙트 기반의 지갑을 사용하는 것을 권장한다. 

다른 스마트 컨트랙트와 동일하게, 발행자는 ERC-1238에 사용자의 개인정보를 입력받아 이를 체인에 저장해서는 안된다. 또한 블록체인의 특성상 체인에 올라간 데이터는 불변하기 때문에, 토큰 수신자로부터 선동의가 꼭 수행되어야 한다.

<br>

## NTT를 Transferable 하게 만들 수 없을까?

솔리디티는 인터페이스에 명시된 기능 외에도 추가적인 기능을 갖는 스마트 컨트랙트 생성이 가능하다. 그러므로 IERC1238 인터페이스를 충실하게 따른다고 해서 해당 컨트랙트가 Non-Trasferable 하다고 보장할 수 없다.

결론적으로, 표준과 반대되더라도 Transfer 기능의 추가는 가능하다. 하지만 이것은 DYOR(Do Your Own Research), 본인의 책임인 것이다.

<br>

## NTT와 soulbound token은 동일한가?

2022년 1월 비탈릭 부테린은 한 [블로그](https://vitalik.ca/general/2022/01/26/soulbound.html)에서 Soulbound 토큰에 대해 설명했다. [DeSoc 논문](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763)에도 나와있는 것 처럼, Non-Transferable 토큰은 Soulbound 토큰의 원시적인 형태일 뿐, 완전히 동일하다고 볼 수는 없다.

> Soulbound는 월드 오브 워크래프트라는 게임에서 파생된 용어로, 한 번 획득하면 다른 플레이어에게 양도하거나 판매할 수 없는 특성을 의미합니다. 즉, 한 번 획득을 통해 본인의 속성을 하나 추가하게 되는 것입니다. 현실에는 국적, 주민등록등본, 학력, 이력 등 거래해서는 안되는 개인정보가 이런 예시입니다.
> <br><br> 출처: [Soulbound Token 이해하기(안수빈의 블로그)](https://ansubin.com/understanding-soulboundtoken-poap/)

<br>

## 참고자료

- [ERC1238: Non-transferable Token (NTT) Standard - Raphael Roullet, Nicola Greco, Chris Chung](https://erc1238.notion.site/ERC1238-Non-transferable-Token-NTT-Standard-b6dcad89005f4c16a5a79471e90b3946)
- [Soulbound Token 이해하기 - Subin An](https://ansubin.com/understanding-soulboundtoken-poap/)