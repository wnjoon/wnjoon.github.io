---
layout: post
title:  "스마트 컨트랙트를 Go에 바인딩(Binding)하기" 
excerpt: "Truffle을 이용하여 컨트랙트를 컴파일하고, 이를 Golang에서 사용할 수 있도록 바인딩해본다."
date:   2022-04-28 15:00:00 +0900
categories: blockchain
tags: [ethereum, smart contract, truffle, go]
---

<br>

## Go를 이용한 이더리움 개발 

[Ethereum Development with Go](https://goethereumbook.org)에는 Golang을 이용해서 이더리움 클라이언트를 개발하는 방법에 대해 알려주고 있다. 가장 대중적으로 사용되는 방식이 JavaScript이지만, 개인적으로 이더리움의 Geth가 그러했듯이 Go를 이용하여 이더리움의 클라이언트를 개발하는 것은 마치 <u>태생적으로 딱 맞게 세팅된 옷을 입는 행위</u>와 같다고 생각이 된다.  
무튼 이러한 이유로 Java를 이용한 Web3j가 아닌 Go를 이용한 클라이언트 개발을 진행해보려고 하는데, 문제점(?)이 발생하였고 이를 해결하는 과정을 공유해보고자 한다.

<br>

## .sol -> .json(abi) -> .go

스마트 컨트랙트를 컴파일하는 과정에서 생성되는 Json 형태의 ABI를 바로 사용하는 Web3js와 다르게, Web3j나 본 포스팅에서 사용하고자 하는 Go와 같이 컴파일 기반의 언어는 스마트 컨트랙트를 해당 언어로 '변경'하는 작업이 필요하다. 이를 Web3j에서는 WrapperClass, Golang에서는 Binding이라고 표현한다.

<br>

> **[ABI(Application Binary Interface)](https://docs.soliditylang.org/en/develop/abi-spec.html)**  
>  
> The Contract Application Binary Interface (ABI) is the standard way to interact with contracts in the Ethereum ecosystem, both from outside the blockchain and for contract-to-contract interaction. Data is encoded according to its type, as described in this specification. The encoding is not self describing and thus requires a schema in order to decode.  
>
> 결국 '스마트 컨트랙트의 호출 방법과 이를 통해 어떤 데이터를 결과로 받을지에 대해 명시한 내용'으로, 컴파일 과정에서 생성된다.

<br>

Web3j도 이 과정이 생각보다 복잡+불편했는데, 상대적으로 적은(매우) 사용자수와 이를 뒷받침하는 적은 레퍼런스 떄문이었다. 문제는 생각보다 사용자 수가 많을 것으로 예상했던 Golang치고 이 과정에 대한 레퍼런스가 매우 부족했다는 것이다.  
[Ethereum Development with Go](https://goethereumbook.org)의 [Smart Contract Compilation & ABI](https://goethereumbook.org/en/smart-contract-compile/)에서는 이 과정에 대해 자세히 설명하고 있는데, 결론적으로 말하자면 <u>안된다</u>. 단순히 안된다고하면 그렇고, 이번에 내가 테스트하려는 스마트 컨트랙트를 기준으로 실행이 되지 않았는데 이 과정에 대해 설명해본다.

<br>

## Openzepellin을 참조하지 못하는 문제 발생

[Smart Contract Compilation & ABI](https://goethereumbook.org/en/smart-contract-compile/)에서는 solc를 이용하여 직접 컨트랙트를 컴파일하고 있는데, 여기서 사용하는 예시 컨트랙트는 **'아무것도 import하지 않고 오직 혼자서만 동작'**하고 있다.  

필자는 [Consensys - UniversalToken](https://github.com/ConsenSys/UniversalToken) 기반의 ST(Security Token - 증권형 토큰)를 테스트해보려고 하는데, ERC1400 뿐만 아니라 여기서 사용되는 대부분의 기능들이 [Openzepellin](https://github.com/OpenZeppelin/openzeppelin-contracts) 기반에서 동작한다.  

먼저 package.json 파일과 truffle-config.js 파일의 내용을 기반으로 node_modules를 만들어주었다. 이후 [Smart Contract Compilation & ABI](https://goethereumbook.org/en/smart-contract-compile/) 문서에 나온대로 스마트 컨트랙트 파일(.sol)을 ABI 형태로 변환하였다.  

![image](https://user-images.githubusercontent.com/39115630/165697006-0dc2e2b6-15d3-4ba0-bafa-40445faa035b.png)  
*@그림 1: solc --abi contracts/ERC1400.sol -o build ==> 오류 발생*  

위의 그림과 같이 Openzepellin에 대한 내용이 node_modules에 버젓이 있음에도 컴파일이 전혀 되지 않았다. 문서에 있는 내용 중 1단계부터 막혀버려서 멘붕이었는데, 이를 아무리 구글링해도 원하는 답변을 찾기 어려웠다.

<br>

## 해결 방법

[Creating Go Bindings for Ethereum Smart Contracts](https://www.metachris.com/2021/05/creating-go-bindings-for-ethereum-smart-contracts/#smart-contracts-with-truffle)에서 정확한 답을 찾아서 이를 직접 적용해보고 결과를 포스팅해보고자 한다.  

참고로 이번 포스팅에서 사용한 스마트 컨트랙트는 위에서 언급한 [Consensys - UniversalToken](https://github.com/ConsenSys/UniversalToken)으로, 디렉토리 또는 파일의 구조가 위의 리포지토리를 기반으로 진행한다.  

### 1. abigen 확인

참고로 abigen을 이용하려면 go-ethereum을 설치해야만 한다.  
```sh
# Download go-ethereum, build and install the devtools (which includes abigen)
$ git clone https://github.com/ethereum/go-ethereum.git
$ cd go-ethereum
$ make devtools

# Run abigen and print the version
$ abigen -version
$ abigen -help
```

### 2. truffle을 이용한 스마트컨트랙트 배포

필자는 truffle을 이용하여 스마트컨트랙트를 배포하였다. [Smart Contract Compilation & ABI](https://goethereumbook.org/en/smart-contract-compile/) 문서에 나와있는데로 solc를 이용하여 Openzepellin의 참조를 걸어주는 방법([docs.soliditylang.org - Import Remapping](https://docs.soliditylang.org/en/v0.8.13/path-resolution.html#import-remapping))을 찾았지만, 실제로 해본 결과 제대로 동작하지 않았다.  

**2.1. @chainsafe/truffle-plugin-abigen 설치**  

truffle 기반으로 만들어진 스마트컨트랙트 디렉토리에서 해당 모듈을 설치한다. 혹은 package.json에 이를 추가한다.  
아래 내용은 @openzeppelin/contracts가 이미 설치되어있다는 가정아래에 진행한다.

```sh
$ yarn add truffle @chainsafe/truffle-plugin-abigen

# 만약 @openzeppelin/contracts 또한 설치되어 있지 않다면
# $ yarn add truffle @openzeppelin/contracts @chainsafe/truffle-plugin-abigen
```

**2.2. truffle-config.js 수정**

truffle-config.js의 plugins에 위에서 설치한 모듈을 추가한다.  

```js
// truffle-config.js
...
  module.exports = {
    plugins: [
      "solidity-coverage", 
      "truffle-contract-size", 
      "truffle-plugin-verify", 
      "@chainsafe/truffle-plugin-abigen" // 추가
    ],
    compilers: {
        solc: {
            version: "0.8.7",    // Fetch exact version from solc-bin (default: truffle's version)
        }
    }
}
...
```

**2.3. 컨트랙트 배포**

필자는 ganache를 이용하여 네트워크를 구성하였고, 이곳에 해당 컨트랙트를 배포하였다. 추가로 ERC20을 직접 테스트해보기 위해 migrations 내부에 '13_erc20_token.js' 파일을 추가로 생성하였다.  

```js
// migrations/13_erc20_token.js
const ERC20Token = artifacts.require('./tokens/ERC20Token.sol');

module.exports = async function (deployer, network, accounts) {
  if (network == "test") return; // test maintains own contracts
  
  await deployer.deploy(ERC20Token, 'ERC20Token', 'GEN', 1);
  console.log('\n   > ERC20 token deployment: Success -->', ERC20Token.address);
};
```

이제 migrations에 적혀있던 기존 내용 + erc20을 ganache에 배포한다.

```sh
$ truffle migrate --network ganache
```

build/contracts에 해당 내용들이 생성된다.

**2.4. abi, bin 파일 생성**

truffle run 기능을 이용한다. 여기서 abi 파일은 위의 배포 과정에서 build/contracts 내부에 생성된 json 파일을 기준으로 생성되고, bin 파일은 이렇게 만들어진 abi를 기준으로 생성된다. 즉, 배포(또는 컴파일) 과정이 꼭 먼저 선행되어야 한다.  

```sh
# abi, bin 파일을 저장할 디렉토리가 필요하다.
# 이 디렉토리는 이름이 정해져 있으므로, 아래 명령어를 실행하는 곳에 생성한다.
# 본 예시에서는 UniversalToken 내부에서 아래 명령어를 실행한다.

# 디렉토리 생성
$ mkdir -p abigenBinding

# abi, bin 생성
# 1. ERC1400
$ truffle run abigen ERC1400
# 2. ERC20
$ truffle run abigen ERC20Token
```

truffle run abigen은 build/contracts에 생성된 파일을 기본값으로 확인하기 때문에, 확장자 없이 파일이름만 가지고 abi, bin을 생성한다.  

**2.5. abi, bin을 이용한 go 파일 생성**

필자의 경우 UniversalToken/go 아래에 해당 파일을 생성하도록 하였다. 해당 파일을 클라이언트에 옮기는 과정은 본 포스팅에서는 제외한다.  
--pkg의 경우 go 프로젝트 내에서 사용할 패키지를 담는 곳이다. 필자는 token 내에 바인딩 된 파일을 놓을 계획이라 아래와 같이 진행하였다.  

```
# UniversalToken 디렉토리 내에서 실행하였음

# 1. ERC1400
$ abigen --bin=abigenBindings/bin/ERC1400.bin --abi=abigenBindings/abi/ERC1400.abi --pkg=token --out=go/erc1400.go

# 2. ERC20
$ abigen --bin=abigenBindings/bin/ERC20Token.bin --abi=abigenBindings/abi/ERC20Token.abi --pkg=token --out=go/erc20.go
```

<br>

## 결론

결론이라 할것은 없지만, truffle을 이용하여 배포된 컨트랙트를 go client에서 사용할 수 있는 .go 파일로 바인딩하는 방법에 대해 알 수 있어서 좋았다. 지극히 개인적인 의견으로 javaScript 보다는 golang을 이용한 클라이언트가 속도면에서도 더 좋을것으로 기대중이지만, 아마 javaScript만이 가지는 프론트엔트와의 직관적인 연결로 대부분 javaScript를 사용하지 않나 생각한다. 향후에는 golang 기반의 클라이언트로 해당 토큰을 호출해보고 이를 포스팅해보도록 하겠다.  

이번 포스팅에서 작성한 스크립트는 '이곳([wnjoon/security-token-test : github](https://github.com/wnjoon/security-token-test/blob/main/smartcontract/UniversalToken/getGoFile.sh))'에서 확인할 수 있다.

<br>

## 참고자료
- [Creating Go Bindings for Ethereum Smart Contracts](https://www.metachris.com/2021/05/creating-go-bindings-for-ethereum-smart-contracts/#smart-contracts-with-truffle)
- [Smart Contract Compilation & ABI](https://goethereumbook.org/en/smart-contract-compile/)
