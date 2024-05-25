---
layout: post
title:  "가스비 절감의 효과를 갖는 솔리디티의 custom error 사용 방법" 
description: How to Use custom error in solditiy for reducing smart contract size and gas price.
date:   2023-08-22 15:00:00 +0900
categories: 블록체인
tags: [ethereum, solidity, smartcontract]
keywords: blockchain, ethereum, smartcontract, solidity
comments: true

---

<br>

## 커스텀 에러

[솔리디티 v0.8.4](https://github.com/ethereum/solidity/releases/tag/v0.8.4)에서 소개된 방법으로, 기존의 에러 표현 방식에 비해 가스비를 줄이면서 에러 발생의 원인을 설명할 수 있다.  
아래는 기존의 방식과 커스텀 에러 방식 각각을 예시로 표현한 내용이다.

```
# Before
revert("Insufficient funds."); // 사용 (선언 없음)

# Custom errors
error Unauthorized(); // 선언
...
revert Unauthorized(); // 사용
```

가스비는 스마트 컨트랙트의 배포(deploy)에 영향을 주는데, 이 외에도 기존의 방식은 에러에 대한 정보를 동적으로 관리하기 어렵다는 단점이 있었다.  
커스텀 에러는 'error' 구문을 사용한다. 그리고 외부(인터페이스 또는 라이브러리)에서 선언한 에러를 스마트 컨트랙트에 불러와서 사용할 수도 있다.

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

error Unauthorized(); // Custom error

contract VendingMachine {
    address payable owner = payable(msg.sender);

    function withdraw() public {
        if (msg.sender != owner)
            revert Unauthorized();  // Using custom error with revert statement

        owner.transfer(address(this).balance);
    }
    // ...
}
```

위의 예시를 보면 [이벤트(event)](https://docs.soliditylang.org/en/latest/contracts.html?color=dark#events)와 구문이 비슷한 것을 볼 수 있는데, 차이점은 [revert 구문](https://docs.soliditylang.org/en/latest/control-structures.html?color=dark#revert-statement)과 같이 사용해야 한다는 것이다. revert를 사용하면 현재까지 진행되던 상태 변환 프로세스가 모두 중단되고 에러 메시지를 호출자에게 전달한다. [require 구문의 사용은 현재 포스팅 시점(2023.08.23)에는 제공되지 않고 있는데](https://github.com/ethereum/solidity/issues/11278), 아래의 예시를 보면 이해가 쉬울 것이다.

```
# This Error message with require statement 
require(condition, "error message")

# Should be translated to
if (!condition) revert CustomError()
```

<br>

## 파라미터를 추가한 커스텀 에러

커스텀 에러는 파라미터를 추가할 수도 있다.

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/// Insufficient balance for transfer. Needed `required` but only
/// `available` available.
/// @param available balance available.
/// @param required requested amount to transfer.
error InsufficientBalance(uint256 available, uint256 required);

contract TestToken {
    mapping(address => uint) balance;
    function transfer(address to, uint256 amount) public {
        if (amount > balance[msg.sender])
            // Error call using named parameters. Equivalent to
            // revert InsufficientBalance(balance[msg.sender], amount);
            revert InsufficientBalance({
                available: balance[msg.sender],
                required: amount
            });
        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
    // ...
}
```

위의 예시를 보면 커스텀 에러를 아래와 같이 선언하고,

```
error InsufficientBalance(uint256 available, uint256 required);
```

아래와 같이 사용한다.

```
revert InsufficientBalance({
    available: balance[msg.sender],
    required: amount
});
```

사용 시점의 에러 데이터는 abi.encodeWithSignature("InsufficientBalance(uint256,uint256)", balance[msg.sender], amount)로 ABI 인코딩된다.  

<br>

## 실제로 얼마나 스마트 컨트랙트 사이즈가 줄어드는가?

위에서 예시로 든 VendingMachine 스마트 컨트랙트 기준으로 커스텀 에러 사용 여부에 따른 사이즈를 비교해보았다.

```
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

error Unauthorized(); // Custom error

contract VendingMachine {
    address payable owner = payable(msg.sender);

    function withdraw() public {
        if (msg.sender != owner)
            revert Unauthorized();  // 커스텀 에러 사용 시
            revert("Insufficient funds."); // 커스텀 에러 미사용 시

        owner.transfer(address(this).balance);
    }
    // ...
}
```

[truffle-contract-size](https://github.com/IoBuilders/truffle-contract-size)를 사용하여 각 상황별로 스마트 컨트랙트 사이즈를 계산한 결과는 아래와 같다. 
- 커스텀 에러 사용 : 0.33 KiB
- 커스텀 에러 미사용 : 0.46 KiB

단순한 에러라 할지라도 대략 0.13 KiB 정도의 차이가 나는 것을 보면, 복잡한 로직이 들어간 스마트 컨트랙트 일수록 커스텀 에러의 적용이 꽤 유의미한 가치를 가져올 수 있을 것이라고 생각된다.

<br>

## 좀더 깊이 커스텀 에러 들여다보기

파라미터를 포함하지 않는 기본적인 커스텀 에러 'revert Unauthorized()'를 [Yul 코드](https://docs.soliditylang.org/en/latest/yul.html)로 확인해보면 아래와 같다.

> Yul 코드는 다양한 백엔드에서 바이트코트 형태로 컴파일될 수 있도록 하는 중간 언어(intermediate language)를 의미한다.

```
# revert Unauthorized();
let free_mem_ptr := mload(64)
mstore(free_mem_ptr, 0x82b4290000000000000000000000000000000000000000000000000000000000)
revert(free_mem_ptr, 4)
```

위의 0x82b42900은 Unauthourized() 커스텀 에러의 selector를 의미한다. 그렇다면 커스텀 에러를 사용하지 않고 revert("Unauthorized")와 같이 에러 메시지를 그대로 사용하면 어떻게 될까?

```
# revert("Unauthorized");
let free_mem_ptr := mload(64)
mstore(free_mem_ptr, 0x08c379a000000000000000000000000000000000000000000000000000000000)
mstore(add(free_mem_ptr, 4), 32)
mstore(add(free_mem_ptr, 36), 12)
mstore(add(free_mem_ptr, 68), "Unauthorized")
revert(free_mem_ptr, 100)
```

0x08c379a0 값은 Error(에러메시지 문자열)의 selector를 의미한다. 단순히 코드만 봐도 커스텀 에러를 사용할 때가 더 적은 가스비를 소모하는 것을 볼 수 있다. 런타임 시점의 가스비는 revert 조건을 만족하는 경우에 대해서만 연관이 있다는 것을 기억하자.

<br>

## 커스텀 에러 확인하기

그렇다면 커스텀 에러는 어떻게 확인할 수 있을까? 가장 최근 버전의 ethers.js를 사용하면 커스텀 에러 메시지를 디코딩한 값을 확인할 수 있다.  
아래 예시는 위의 InsufficientBalance 커스텀 에러를 확인하는 경우를 나타낸다.

```
import { ethers } from 'ethers'

// As a workaround, we have a function with the
// same name and parameters as the error in the abi.
const abi = [
  'function InsufficientBalance(uint256 available, uint256 required)',
]

const interface = new ethers.utils.Interface(abi)
const error_data =
  '0xcf479181000000000000000000000000000000000000' +
  '0000000000000000000000000100000000000000000000' +
  '0000000000000000000000000000000000000100000000'

const decoded = interface.decodeFunctionData(
  interface.functions['InsufficientBalance(uint256,uint256)'],
  error_data
)
// Contents of decoded:
// [
//   BigNumber { _hex: '0x0100', _isBigNumber: true },
//   BigNumber { _hex: '0x0100000000', _isBigNumber: true },
//   available: BigNumber { _hex: '0x0100', _isBigNumber: true },
//   required: BigNumber { _hex: '0x0100000000', _isBigNumber: true }
// ]
console.log(
  'Insufficient balance for transfer. ' +
    `Needed ${decoded.required.toString()} but only ` +
    `${decoded.available.toString()} available.`
)
// Insufficient balance for transfer. Needed 4294967296 but only 256 available.
```

<br>

## 주의점

스마트 컨트랙트를 컴파일해서 ABI 형태의 JSON 파일로 만드는 과정에서, 컴파일러는 해당 스마트 컨트랙트가 나타낼 수 있는(emit) 모든 에러를 해당 파일에 포함시킨다. 여기서 중요한 것은 이 과정에 <u>external call로 호출되는 에러 메시지들은 포함되지 않는다</u>는 것이다. 
이러한 이유로 개발자들은 에러 마다 [NatSpec](https://docs.soliditylang.org/en/latest/natspec-format.html?color=dark) 형식을 준수하는 설명을 달아놓기도 한다. NatSpec은 개발자와 사용자가 추가 비용없이 에러 메시지에 대해 서로 이해할 수 있도록 하는 좋은 방법 중 하나이다.

어쨋든 에러 메시지의 출처를 추적할 수 없기 때문에, 에러 데이터는 신중하게 사용해야 한다. external call 호출 횟수가 계속 늘어날수록, 발생하는 에러 메시지가 어디서부터 온 것인지 추적하기 점점 어려워진다는 것을 의미한다. 게다가 실제 에러가 아님에도 불구하고 에러메시지(처럼 보이는 문구)를 호출하도록 악의적으로 스마트 컨트랙트를 작성할 수도 있다. 

<br>
<br>

## 참고

- [Custom Errors in Solidity - Soliditylang.org](https://soliditylang.org/blog/2021/04/21/custom-errors/)
