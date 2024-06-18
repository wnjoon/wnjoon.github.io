---
layout: post
title: "스마트 컨트랙트의 주소는 어떻게 만들어지는가?" 
excerpt: "일반적으로 스마트 컨트랙트의 주소는 전적으로 '컨트랙트를 생성하는 주체의 정보' 의해 결정된다."
date:   2022-09-11 15:00:00 +0900
categories: blockchain
tags: [ethereum, smart contract]
---

<br>

## 이더리움에서 사용되는 계정

이더리움에는 2가지 계정 종류가 있다. 하나는 EOA(Externall Owned Accounts)로 불리는 사용자 계정 주소이고, 다른 하나는 CA(Contract Accountzzz)로 불리는 스마트 컨트랙트의 주소다.

스마트 컨트랙트는 '스스로 생성될 수 없고, 스스로 실행될 수도 없는' 특성을 갖는다. 결국 <u>'어떠한 EOA 또는 CA가 만들고 실행'</u>시키는 역할을 수행해야만 하는데, 특이하게도 EOA와 동일한 규칙(Hex)과 길이(40 Bytes)를 갖는다.

> 여기 2개의 서로 다른 주소가 있다.  
> - 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B
> - 0xfd2215f9e02c635b56084f13399e949dd66c1552  
>
> 둘 중 하나는 비탈릭 부테린의 EOA 주소, 나머지 하나는 그냥 생성해 본 CA 주소이다. 이렇게 똑같은 구조를 갖기 때문에, 사용자가 실수로 CA 주소에 이더를 보내면 돌려받을 수 없는 경우가 생긴다.

이렇듯 이더리움에서 사용되는 계정은 동일한 4개의 외형적 특성을 갖는다.

- 논스(Nonce)
- 잔고(Balance in Wei)
- 해시(Hash of storage trie root)
- 코드(Code)

<br>

## 스마트 컨트랙트 주소 생성 과정

### 1. 기본적인 방법

스마트 컨트랙트의 주소는 전적으로 '컨트랙트를 생성하는 EOA'에 의해 결정된다. EOA 주소와 해당 EOA가 컨트랙트 주소를 생성할 때 사용한 논스(Nonce)를 이더리움 표준 방식으로 인코딩(RLP)하고 이를 해싱(Keccak256)하여 생성한다. 

```sh
keccak(rlp.encode([to_bytes(sender), nonce]))[12:]
```

> RLP(Recursive Length Prefix)와 Keccak256에 대한 설명은 본 포스팅에서는 생략한다. 대신 해당 내용에 대해 자세히 나와있는 레퍼런스들을 아래에 추가한다.

### 2. CREATE2

[EIP-1014](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1014.md)에서 새롭게 제시된 이 기능은 아래와 같이 새로운 컨트랙트 주소를 생성한다.

```sh
keccak256( 0xff ++ senderAddress ++ salt ++ keccak256(init_code))[12:]
```

<br>

## 컨트랙트가 또 다른 컨트랙트를 생성하는 경우

위에서 언급했듯이, 스마트 컨트랙트를 생성하거나 실행할 수 있는 주체가 꼭 EOA만 있는 것은 아니다. 당연히(?) 스마트 컨트랙트가 또 다른 스마트 컨트랙트를 생성하거나 실행을 대행할 수도 있다.  

> 실제로 스마트 컨트랙트가 직접 실행한다고 보기는 어렵고, EOA로부터 전달된 트랜잭션을 call 또는 delegatecall을 이용하여 대행(전달)한다고 보는 것이 맞다고 생각한다.

여기서 궁금한 점이 생길 것인데, "과연 이 경우 논스는 어떻게 계산하는가?" 이다. 결론부터 말하자면, 스마트 컨트랙트에도 논스가 존재한다.  

[EIP-161](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md#specification)을 기점으로 스마트 컨트랙트의 논스는 0이 아닌 1부터 시작하도록 변경되었다. 그리고 스마트 컨트랙트의 논스는 오직 "해당 컨트랙트가 다른 컨트랙트를 생성하는 경우" 에만 증가한다. 즉, 컨트랙트가 다른 컨트랙트의 '기능'을 호출(internal transaction)하는 경우에는 논스가 증가하지 않는다.

<br>

## 참고자료
- [How is the address of an Ethereum contract computed? - StackExchange](https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed)
- [Do contracts also have a nonce? - StackExchange](https://ethereum.stackexchange.com/questions/764/do-contracts-also-have-a-nonce)
- [Difference between keccak256 and sha3 - StackExchange](https://ethereum.stackexchange.com/questions/30369/difference-between-keccak256-and-sha3)
- [Smart contract address creation method & difference between smart contract address and wallet address (EOA) - Medium](https://medium.com/coinmonks/smart-contract-address-creation-method-difference-between-smart-contract-address-and-wallet-97b421506455)
- [RLP 이해하기 - Medium](https://medium.com/ethereum-core-research/rlp-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1c05a8150a04)
- [SHA3 - 해시넷](http://wiki.hash.kr/index.php/SHA3)