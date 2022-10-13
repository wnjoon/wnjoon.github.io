---
layout: post
title: "솔리디티의 encodePacked, ethers의 solidityPack " 
excerpt: "Web3js에서 합친 문자열을 솔리디티내에서 동일하게 사용할 수 있는 방법에 대해 알아본다."
date:   2022-05-26 15:00:00 +0900
categories: blockchain
tags: [ethereum, smart contract, keccak, solidity]
---

<br>

## encodePacked

[Solidity documentation](https://docs.soliditylang.org/en/v0.8.13/abi-spec.html#non-standard-packed-mode)에서는 'Non-standard Packed Mode'라고 부르는데, <u>정해지지 않은 타입으로 구성된 일련의 데이터를 하나로 결합</u>해주는 기능이다.  
솔리디티에서는 string이라는 타입은 지원하지만 이를 concat(연결)하는 기능은 따로 없는데, 솔리디티 내부에 존재하는 모든 데이터들은 바이트 형태로 다루어지기 때문이다.  

위의 공식 문서에서는 해당 기능을 아래와 같이 표현한다.
- types shorter than 32 bytes are concatenated directly, without padding or sign extension
- dynamic types are encoded in-place and without the length
- array elements are padded, but still encoded in-place

예시로 '[int16(-1), bytes1(0x42), uint16(0x03), string("Hello, world!")]' 4개를 encodePacked한다고 하면 아래와 같은 결과가 나온다.

```yaml
0xffff42000348656c6c6f2c20776f726c6421
  ^^^^                                 int16(-1)
      ^^                               bytes1(0x42)
        ^^^^                           uint16(0x03)
            ^^^^^^^^^^^^^^^^^^^^^^^^^^ string("Hello, world!") without a length field
```

정리하면,
- 데이터는 순서대로 인코딩되며, 시작과 끝이 별도로 표현되지 않는다. 또한 배열의 길이가 인코딩되지 않는다.
- 인코딩의 결과는 array 또는 string, bytes가 아니다. 
  - <b>하지만 실제 코딩해본 결과, <u>솔리디티에서는 bytes memory 타입으로 결과값을 반환</u>한다.</b>
- string, bytes, uint[]와 같이 동적인 크기를 갖는 타입들은 각자의 길이를 패딩으로 갖지 않고 인코딩된다.
- 배열 타입이 인코딩되면 내부 값들의 타입이 갖는 패딩길이를 포함해서 인코딩된다. 단, string, bytes 타입은 일괄적으로 32 bytes 만큼의 크기가 자동으로 패딩된다.
- 결국 길이 필드가 별도로 존재하지 않기 때문에, 동적인 타입을 여러 개 인코딩할 경우 모호한 결과값이 만들어질 수 있다.
  - <i>예시로 abi.encodePacked("a", "bc") == abi.encodePacked("ab", "c")와 같은 상황이 발생할 수 있다.</i>
- 만약 패딩이 필요하다면, abi.encodePacked(uint16(0x12)) == hex"0012" 와 같이 명시적인 타입변환을 같이 해주어야 한다.

<br>

## ethers.js

[ethers.js](https://docs.ethers.io/v5/)는 이더리움 블록체인(또는 이를 사용하는 생태계)과 상호작용하기 위한 라이브러리로, 본 포스팅에서는 hardhat과 연결하여 결과값을 보여주고자 한다. 

### ethers.utils.solidityPack

[solidityPack](https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityPack)은 여러개의 타입으로 구성된 데이터들을 non-standard하게 인코딩한 결과 값을 반환해주는 ethers 내부의 함수로, 솔리디티의 abi.encodePacked 함수와 동일한 기능을 한다.  

```sh 
# solidityPack의 한 예시
ethers.utils.solidityPack([ "string", "uint8" ], [ "Hello", 3 ])
> '0x48656c6c6f03'
```

<br>

## 샘플 소스

abi.encodePacked()와 ethers.utils.solidityPack()을 비교하는 부분만 별도로 포스팅한다.

### 시나리오

1. Hardhat 기반의 Typescript로 구성한 테스트 소스에서 다양한 타입으로 이루어진 값들을 ethers.utils.solidityPack을 사용하여 인코딩한다.
2. 해당 값을 솔리디티로 구성한 컨트랙트에 전송한다.
3. 솔리디티에서 다양한 타입으로 이루어진 값들을 abi.encodePacked를 이용하여 인코딩해보고, Hardhat으로부터 전달받은 값과 동일한지 확인한다.

이를 소스코드로 정리하면, 

```sh
# hardhat
func encodeInHardhat(var _addressValue, var _intValue, var _bytesData) {
  var encodedValue = ethers.utils.solidityPack(...)
}

# solidity
function encodeInSolidity(address _addressValue, uint256 _intValue, bytes memory _bytesData, bytes calldata dataFromHardhat) {
  bytes memory encodedValue = abi.encodePacked(...);
  require(encodeValue == dataFromHardhat);
}
```

### Hardhat

타입스크립트를 활용하였으며, 아래와 같이 데이터를 작성할 수 있다.

```ts
import { waffle, ethers, web3 } from "hardhat";
...
const [user1] = waffle.provider.getWallets()
const value = ethers.BigNumber.from("0")
const data = "0x0000000000000000000000000000000000000000000000000000000000000000"
...
const combinedMsg = ethers.utils.solidityPack(
                ["address", "uint256", "bytes"],
                [user1.address, value, data])
```

### Solidity

```solidity
function compareMsg(address _addr, 
                    uint256 _val, 
                    bytes memory _data, 
                    bytes memory calldata _encodedMsg) {
    bytes memory combineMsg = abi.encoded(_addr, _val, _data);
    require(combineMsg == _encodeMsg , "Should be same"); 
}
```
<br>

## 참고자료
- [Solidity documentation](https://docs.soliditylang.org/en/v0.8.13/abi-spec.html#non-standard-packed-mode)
- [ethers documentatioin](https://docs.ethers.io/v5/)