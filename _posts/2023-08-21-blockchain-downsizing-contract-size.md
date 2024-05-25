---
layout: post
author: wonjoon
title:  "스마트 컨트랙트의 사이즈를 줄이는 방법" 
# description: Introduce post from ethereum official blog about how to reduce smart contract size by serveral ways.
# date:   2023-08-21 15:00:00 +0900
categories: 블록체인
# tags: [ethereum, solidity, smartcontract]
# keywords: blockchain, ethereum, smartcontract, solidity
# comments: true
---

<br>

## EIP-170

[EIP-170](https://eips.ethereum.org/EIPS/eip-170)은 2016년 11월 22일에 발생한 하드포크 ['Suprious Dragon'](https://blog.ethereum.org/2016/11/18/hard-fork-no-4-spurious-dragon) 시기에 공개되었으며, DoS(Denial of Service) 공격으로부터 이더리움 네트워크를 보호하기 위해 스마트 컨트랙트의 사이즈를 24,576kb로 제한하는 규칙을 제안한 내용이다.  

```
If block.number >= FORK_BLKNUM, then if contract creation initialization returns data with length of more than MAX_CODE_SIZE bytes, contract creation fails with an out of gas error.

- MAX_CODE_SIZE: 0x6000 (2**14 + 2**13)
- FORK_BLKNUM: 2,675,000
- CHAIN_ID: 1 (Mainnet)
```

이더리움 네트워크에서는 잠재적으로 최소 2번의 O(n) 만큼 가스가 사용될 수 있다.
1. 디스크에서 읽어온 스마트 컨트랙트에 대한 코드를 VM 환경에서 실행하기 위해 전처리하는 과정에서 O(n)
2. 블록의 유효성 증명을 위해 데이터를 머클 증명에 추가하는 과정의 O(n)

이를 이더리움에서는 2차 취약점(Quadratic Vulnerability) 이라고 언급하는데, 결국 스마트 컨트랙트 자체의 크기로 인하여 트랜잭션 처리 성능에 영향을 주는 경우가 발생하게 된다.  
그리고 꼭 DoS가 아니더라도 굉장히 간단한 기능만을 사용하려는 사용자의 경우 단순히 <u>스마트 컨트랙트가 길다</u>는 이유만으로 많은 가스비와 시간을 소비해야 할 수도 있게 된다. 

<br>

## 스마트 컨트랙트의 사이즈를 확인하는 방법

스마트 컨트랙트 바이트코드의 크기를 확인하려면 [truffle-contract-size](https://github.com/IoBuilders/truffle-contract-size)를 사용하면 된다.  

<br>

## 단계별로 스마트 컨트랙트의 사이즈를 줄이는 방법

본문에서는 3단계로 스마트 컨트랙트의 사이즈를 줄이는 방법을 제시한다.  
1단계가 가장 큰 효과를 줄 수 있는(Big impact) 방법이고, 단계가 올라갈수록 소소하게 효과를 줄 수 있는 방법으로 보면 된다.

### 1. Big impact

#### 1.1. 스마트 컨트랙트 분리하기

스마트 컨트랙트 분리의 첫걸음은 좋은 구조(Good Architecture)로부터 시작한다. 스마트 컨트랙트가 작아질수록 가독성은 높아진다.  

스마트 컨트랙트 분리 시 생각해보아야 하는 점들은 아래와 같다.
- 함께 동작하는 기능들은 모아두는 것이 좋다.
- 상태(state)값을 확인 또는 변경하지 않는 기능은 분리해도 좋다.
- 스토리지(storage)에 접근하지 않는다면 분리해도 좋다.

#### 1.2. 라이브러리 사용하기

라이브러리를 사용하면 효율적으로 특정 기능들을 별도의 스마트 컨트랙트로 분리할 수 있다. 라이브러리는 다른 스마트 컨트랙트에서 컴파일 과정에 추가되어 사용되기 때문에 internal로 선언되어서는 안된다.  
라이브러리를 사용할 때에는 [using for](https://solidity.readthedocs.io/en/v0.6.10/contracts.html#using-for)을 사용한다.

```
pragma solidity >=0.6.0 <0.7.0;

struct Data { mapping(uint => bool) flags; }

library Set {
    function insert(Data storage self, uint value)
        public
        returns (bool)
    {
        if (self.flags[value])
            return false; // already there
        self.flags[value] = true;
        return true;
    }
    ...
}

contract C {
    using Set for Data; // this is the crucial change
    Data knownValues;

    function register(uint value) public {
        require(knownValues.insert(value));
    }
}
```

> 만약 public 함수로 외부에서 직접 사용할 수 있도록 선언하고자 한다면, 별도의 스마트 컨트랙트로 배포하는 것이 옳다.

#### 1.3. 프록시 적용하기

본문에서는 프록시를 가장 진보한(advanced) 방법이라고 표현하는데, 다른 스마트 컨트랙트의 기능을 통해 본래 스마트 컨트랙트의 상태를 변경하는 delegatecall 호출 방식을 사용한다.  
프록시 방법의 대표적인 예가 [upgradable한 스마트 컨트랙트](https://hackernoon.com/how-to-make-smart-contracts-upgradable-2612e771d5a2)인데, 단점은 그만큼 코드가 복잡해진다는 것이다.  
만약 단순히 스마트 컨트랙트의 사이즈만 줄이기 위해서는 사용을 권장하지 않는다고 한다.

### 2. Medium impact

#### 2.1. 함수 개수 줄이기

- External : 편리한 사용성을 위해 우리는 view 함수를 자주 작성하곤 한다. 스마트 컨트랙트 제한 크기 이하라면 전혀 상관이 없다만, 아니라면 가장 필요로하는 한개만 남긴다는 생각으로 함수를 줄이는 것이 좋다.
- Internal : 단발성으로 호출되는 internal 또는 private 함수를 줄이고, 이를 사용하는 함수 내부에 인라인 코드로 작성하자.

#### 2.2. 새로운 변수 선언 줄이기

```
# Before
function get(uint id) returns (address,address) {
    MyStruct memory myStruct = myStructs[id];
    return (myStruct.addr1, myStruct.addr2);
}

# After
function get(uint id) returns (address,address) {
    return (myStructs[id].addr1, myStructs[id].addr2);
}
```

별도의 변수를 선언하지 않았을 때, 무려(?) 0.28kb의 크기를 감소시킬 수 있다. 꼭 별도로 선언해야 하는 변수가 아니라면, 선언되어 있는 변수를 재활용하자.

#### 2.3. 짧은 에러메시지

에러메시지의 길이 또한 스마트 컨트랙트의 크기를 변화시키는 요인이 된다. 에러 상황을 나타낼 때 메시지 보다는 코드를 사용할 것을 권장한다.

```
# Before
require(msg.sender == owner, "Only the owner of this contract can call this function");

# After
require(msg.sender == owner, "OW1");
```

#### 2.4. 커스텀 에러 사용하기

[솔리디티 0.8.4에서 소개된 커스텀 에러 방식](https://soliditylang.org/blog/2021/04/21/custom-errors/)은 스마트 컨트랙트의 사이즈를 줄일 수 있는 꽤나 효과적인 방법이다.

```
error Unauthorized();

if (msg.sender != owner) {
    revert Unauthorized();
}
```

위의 방식이 커스텀 에러인데, 이처럼 선언하게 되면 해당 에러가 selector 형식으로 ABI 인코딩된다. 커스텀 에러 안에서도 다양한 방식이 있는데, 추후 포스팅하겠다.

#### 2.5. Optimizer 수정하기

기본값 200은 것은 함수가 200번 호출될 경우를 대비한 바이트코드의 최적화를 의미한다. 만약 값을 1로 한다면 단일 호출인 경우에 대한 바이트코드 최적화를 의미하게 되는데, 다른 의미로 배포(deployment)를 나타내게 된다.  
Optimizer에 사용되는 값이 증가할수록 가스비가 증가하므로, 배포된 이후 해당 컨트랙트를 직접 호출하는 경우가 없다면 값을 최소화하여 적용하는 방안을 고려하는 것을 권장한다.

### 3. Small impact

#### 3.1. 함수 파라미터로 구조체 전달하지 않기

ABIEncoderV2에서는 함수의 파라미터로 구조체를 전달할 수 있다. 편의성은 올라갈 수 있지만 스마트 컨트랙트의 사이즈는 증가한다.

```
# Passing struct
function get(uint id) returns (address,address) {
    return _get(myStruct);
}

function _get(MyStruct memory myStruct) private view returns(address,address) {
    return (myStruct.addr1, myStruct.addr2);
}

# Passing variables
function get(uint id) returns(address,address) {
    return _get(myStructs[id].addr1, myStructs[id].addr2);
}

function _get(address addr1, address addr2) private view returns(address,address) {
    return (addr1, addr2);
}
```

구조체가 아닌 파라미터를 전달할 경우, 0.1kb의 크기가 차이난다.

#### 3.2. 기능에 맞는 visibility 적용하기

- 함수가 무조건 외부에서만 호출되는 경우 : public
- 함수가 다른 스마트 컨트랙트를 통해서만 호출되는 경우 : private 또는 internal

#### 3.3. Modifier 삭제하기

Modifier는 스마트 컨트랙트 사이즈에 큰 영향을 준다. 차라리 함수를 사용할 것을 권장한다.

```
# Use modifier
modifier checkStuff() {}
function doSomething() checkStuff {}

# Use only functions
function checkStuff() private {}
function doSomething() { checkStuff(); }
```

<br>
<br>

## 참고

- [DOWNSIZING CONTRACTS TO FIGHT THE CONTRACT SIZE LIMIT - ethereum.org](https://ethereum.org/en/developers/tutorials/downsizing-contracts-to-fight-the-contract-size-limit/)
