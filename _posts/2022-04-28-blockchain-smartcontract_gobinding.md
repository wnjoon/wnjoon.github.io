---
layout: post
title: "솔리디티 형태의 스마트 컨트랙트를 go언어 형태로 변환하여 사용할 수 있는 abigen"
excerpt: "이더리움에서 사용하는 스마트 컨트랙트는 솔리디티라는 언어로 작성되며 Truffle 또는 Hardhat을 통해 컴파일된다. abigen은 이러한 컴파일된 스마트 컨트랙트를 go 형태의 파일로 변경하여 go언어에서 직접 스마트 컨트랙트를 호출 및 제어할 수 있도록 해주는 라이브러리로, 본 포스팅에서는 abigen을 설치한 후 이를 이용하여 컴파일된 erc20 파일을 go형태로 변경하고 호출 및 사용하는 방법을 설명한다."
description: "Instructions on how to install and use abigen, which changes compiled Solidity-based smart contracts into go files."
date: 2022-04-28 15:00:00 +0900
categories: [블록체인, go]
tags: [ethereum, smart contract]
keywords: [blockchain, ethereum, web3, go]
comments: true
---

<br>

## Go-Ethereum으로 이더리움 클라이언트 개발

[Ethereum Development with Go](https://goethereumbook.org)에는 Golang을 이용해서 이더리움 클라이언트를 개발하는 방법에 대해 알려주고 있다. 가장 대중적으로 사용되는 방식이 JavaScript이지만, 개인적으로 이더리움의 Geth가 그러했듯이 Go를 이용하여 이더리움의 클라이언트를 개발하는 것은 마치 <u>태생적으로 딱 맞게 세팅된 옷을 입는 행위</u>와 같다고 생각이 된다.  
무튼 이러한 이유로 Java를 이용한 Web3j가 아닌 Go를 이용한 클라이언트 개발을 진행해보려고 하는데, 문제점(?)이 발생하였고 이를 해결하는 과정을 공유해보고자 한다.

<br>

## 스마트 컨트랙트 컴파일

### 1. solcjs

먼저 스마트 컨트랙트트 컴파일해야 하는데, 일반적으로 [solcjs](https://github.com/ethereum/solc-js) 라이브러리를 사용한다.

[solcjs를 설치하는 방법](https://solidity-kr.readthedocs.io/ko/latest/installing-solidity.html)에 보면 다양한 설치방법이 존재한다. 일반적으로 향후 버전 관리나 패키지 단위로 관리하기에 용이하여 npm을 활용하여 설치하는 것을 추천하는 편이다.  
이번 포스팅에서는 시스템 전역에서 사용하고자 하기 위해 global 옵션을 추가하여 설치하도록 한다.

```sh
$ npm install -g solc
```

설치가 완료되면 스마트 컨트랙트를 컴파일한다. 이번 포스팅에서는 SimpleStorage라는 스마트 컨트랙트를 사용한다.

```javascript
// SPDX-License-Identifier: LGPL-3.0-only
pragmsa solidity >=0.8.13 <=0.8.19;

contract SimpleStorage {
    uint256 public storedData;
    event stored(address _to, uint _amount);

    constructor(uint256 initVal) {
        emit stored(msg.sender, initVal);
        storedData = initVal;
    }

    function set(uint256 x) public {
        emit stored(msg.sender, x);
        storedData = x;
    }

    function get() public view returns (uint retVal) {
        return storedData;
    }
}
```

스마트 컨트랙트 최상단 디렉토리에서 solcjs를 사용하여 작성된 스마트 컨트랙트를 컴파일한다.

```sh
solcjs --abi ./contracts/SimpleStorage.sol -o build
solcjs --bin ./contracts/SimpleStorage.sol -o build
```

컴파일이 완료되면 아래와 같이 build 디렉토리가 새로 생성되며, 내부에 abi, bytecode를 문자열 값으로 저장하고 있는 파일이 생성된다.

```sh
smartcontract
ㄴ build
   ㄴ contracts_SimpleStorage_sol_SimpleStorage.abi
   ㄴ contracts_SimpleStorage_sol_SimpleStorage.bin
ㄴ contracts
   ㄴ SimpleStorage.sol
...
```

bytecode는 컴파일된 스마트 컨트랙트를 실행할 수 있는 바이너리 파일을 의미한다. [abi(Application Binary Interface)](https://docs.soliditylang.org/en/develop/abi-spec.html)는 스마트 컨트랙트의 호출 방법과 이를 통해 어떤 데이터를 결과로 받을지에 대해 명시한 내용으로 일반적으로 JSON 형태로 표현된다.

### 2. abigen 설치

abigen은 go-ethereum 리포지토리를 통해 얻을 수 있다. 리포지토리 내부에서 제공하는 devtools를 이용하여 abigen을 생성한다.

```sh
# Download go-ethereum, build and install the devtools (which includes abigen)
$ git clone https://github.com/ethereum/go-ethereum.git
$ cd go-ethereum
$ make devtools

# Run abigen and print the version
$ abigen -version
$ abigen -help
```

참고로 abigen은 리포지토리를 Clone한 운영체제의 성격에 영향을 받는다. 즉 MacOS에서 빌드한 abigen은 리눅스 또는 윈도우에서 사용할 경우 잘못된 결과값을 생성할 수 있는 가능성이 존재하기 때문에, 운영체제 별로 빌드하여 사용할 것을 추천한다.

### 3. 컴파일된 솔리디티 변환

```sh
./abigen --bin=./build/contracts_SimpleStorage_sol_SimpleStorage.bin --abi=./build/contracts_SimpleStorage_sol_SimpleStorage.abi --pkg=smartcontract --type=Simple --out=./golang/SimpleStorage.go
```

- bin : 컴파일된 바이너리 파일의 위치
- abi : 컴파일된 abi 파일의 위치
- pkg : 생성된 go 파일이 갖게 될 패키지명
- type : 생성된 go 파일이 해당 스마트 컨트랙트를 표현할 때 사용할 타입
- out : 생성된 go 파일이 위치하게 될 경로

<br>

## abigen으로 생성된 Go 파일을 사용하기

[go-ethereum book](https://goethereumbook.org/en/)에 가면 abigen으로 만들어진 go 파일을 이용하여 스마트 컨트랙트를 호출하는 방법을 매우 자세하게 작성해두었다. 해당 내용을 읽어보면 어렵지 않게 go를 활용하여 스마트 컨트랙트를 사용할 수 있을 것이다.

<br>
<br>

---

## 참고자료

- [Creating Go Bindings for Ethereum Smart Contracts](https://www.metachris.com/2021/05/creating-go-bindings-for-ethereum-smart-contracts/#smart-contracts-with-truffle)
- [Ethereum Development with Go](https://goethereumbook.org/en/)
