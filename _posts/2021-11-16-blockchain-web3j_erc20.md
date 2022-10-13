---
layout: post
title:  "Web3j를 이용하여 ERC20 토큰 다뤄보기" 
excerpt: "Java 기반의 이더리움 클라이언트 라이브러리 'web3j'를 이용하여 ERC20 토큰의 기본 기능을 다뤄본다."
date:   2021-11-16 15:00:00 +0900
categories: blockchain
tags: [ethereum, web3j, java]
---

<br>

## Web3j란?

![image](https://user-images.githubusercontent.com/39115630/141983740-16206a02-c879-424c-9847-d5978699dc79.png)  
*@그림 1: Web3j에 대한 간략한 구조 - 출처: docs.web3j*

Web3j는 이더리움 네트워크와 통신하거나 스마트컨트랙트를 배포 및 호출하는 등 전반적인 클라이언트 기능을 구현할 수 있도록 제공하는 자바 기반의 라이브러리이다. 비슷한 종류로 노드기반의 Web3js가 존재한다. 일반적으로 노드 기반의 Web3js가 널리 사용되는데, 웹 기반으로 구성되는 대부분의 이더리움 클라이언트의 성질을 반영한다고 보면 된다.  

### Web3j의 특징

[공식 홈페이지](https://docs.web3j.io/4.8.7/)에서는 아래와 같이 표현한다.
- Complete implementation of <u>Ethereum's JSON-RPC client API over HTTP and IPC</u>
- Ethereum wallet support
- <u>Auto-generation of Java smart contract wrappers</u> to create, deploy, transact with and call smart contracts from native Java code (Solidity and Truffle definition formats supported)
- Reactive-functional API for working with filters
- [Ethereum Name Service (ENS)](https://ens.domains/ko/) support
- Support for OpenEthereum's Personal, and Geth's <u>Personal</u> client APIs
- Support for Alchemy and Infura, so you don't have to run an Ethereum client yourself
- Support for <u>ERC20 and ERC721</u> token standards
- Comprehensive integration tests demonstrating a number of the above scenarios
- Command line tools
- Android compatible
- Support for JP Morgan's Quorum via web3j-quorum

왠만한(거의 모든) 이더리움의 기능들을 자바에서 호출할 수 있도록 지원하며, 이번 포스팅에는 Web3j에서 제공하는 '스마트 컨트랙트 Wrapper' 기능을 활용하여 'ERC20' 토큰의 잔액 조회와 타 계정으로의 전송 기능을 구현해보려 한다.

<br>

## Java smart contract wrappers

Web3j는 스마트컨트랙트의 Wrapper 기능을 제공한다. Wrapper는 솔리디티로 구현되어 있는 스마트컨트랙트를 자바 기반으로 변환시켜 Web3j에서 손쉽게 스마트컨트랙트의 기능을 호출할 수 있도록 한다. 물론 Wrapper 없이 직접 스마트컨트랙트를 호출할 수도 있다. 하지만 꽤 많은 소스 길이가 추가되어야 하고, 생각보다 가독성이 좋지 못하다. 

### Web3j CLI 설치

Web3j에서 사용할 수 있는 Wrapper를 생성하려면 터미널 상에서 명령어를 입력해야 한다. 그러므로 터미널에서 사용 가능한 Web3j를 설치해야 한다.

```sh
$ curl -L get.web3j.io | sh && source ~/.web3j/source.sh
$ web3j -v
```

정상적으로 버전이 출력된다면 설치가 완료된 것이다.

### Wrapper 생성

Wrapper는 터미널상에서 생성할 수 있다. 예시로 다음과 같은 환경이라고 가정하자.
- Deploy 된 ERC20 스마트컨트랙트(MyERC20.json)의 경로: /Users/joon/Workspace/simpple-nft-market/smartcontract/build/contracts/MyERC20.json
- 자바 어플리케이션의 main 디렉토리 경로: /Users/joon/Workspace/simpple-nft-market/app/src/main/java
- 컨트랙트의 패키지 명: com.example.contract

위의 내용은 디렉토리의 경로 또는 자바 어플리케이션의 패키지 명에 따라 상이할 수 있다. 이를 기반으로 Wrapper를 생성하면 아래와 같다.

```sh
$ web3j generate truffle 
\ --truffle-json=/Users/joon/Workspace/simpple-nft-market/smartcontract/build/contracts/MyERC20.json
\ -o /Users/joon/Workspace/simpple-nft-market/app/src/main/java
\ -p com.example.contract
```

정상적으로 된다면 자바 어플리케이션의 main 디렉토리 내에 contract라는 패키지로 MyERC20.java 파일이 생성된다. **중요한 점은 향후에 생성된 Wrapper 파일의 내부를 보고자 IDE에서 열기를 누른다면 대부분의 IDE가 멈추는 현상을 보게 될 것이다. 이유는 파일 내부에 존재하는 public static final String BINARY 라는 파일 떄문인데, 만약 내부를 보고싶다면 vi나 메모장 혹은 TextEdit과 같이 가벼운 프로그램을 사용하는 것을 추천한다.**

### Maven 세팅

필자는 Maven을 사용하였는데, 아래와 같은 환경으로 구성하였다. 
- Java: 1.8
- Web3j(Core): [4.8.8](https://mvnrepository.com/artifact/org.web3j/core/4.8.8) 
- okhttp: [4.9.1](https://mvnrepository.com/artifact/com.squareup.okhttp3/okhttp/4.9.1)

<br>

## Web3j를 통한 ERC20 스마트컨트랙트 호출

### 기본 구조

Web3j를 이용하여 Wrapper로 만들어진 스마트컨트랙트를 호출할 때 꼭 필요한 요소들이 있다.
- Web3j: geth로 띄워져 있는 클라이언트의 주소를 연결한다.
- Credentials: 스마트컨트랙트를 호출하는 계정의 개인키를 이용하여 생성해준다.
- ContractGasProvider: 스마트컨트랙트 호출에 사용되는 가스비에 대한 값을 정해놓는 부분이다.
- FastRawTransactionManager: 스마트컨트랙트 호출에 사용된 트랜잭션에 대한 정보를 담는 부분이다.
- ERC20 스마트컨트랙트 주소
- 체인 ID

Wrapper를 사용하지 않으면 위의 내용 중 일부가 달라진다. 각각의 차이점은 스마트컨트랙트 호출 부분을 참조하면서 비교해본다.

### 전제 사항

이전 포스팅 ['Geth을 이용한 이더리움 private network 구성하기'](https://wnjoon.github.io/ethereum/private_network_using_geth/)를 통해 구성한 프라이빗 네트워크에서 본 테스트를 진행한다. 기본적으로 로컬 환경에서의 프라이빗 네트워크는 8545번 포트를 사용하는데, 해당 주소를 Web3j 객체롤 매핑하는 작업이 필요하다. 이 작업은 Wrapper를 쓰고 안쓰고와 상관없이 이더리움 네트워크와 연결되어야 하기 때문에 필수적으로 진행된다. 프라이빗 네트워크가 아닌 다른 경우라도 사용 가능하다. (개발 모드 뿐만 아니라 실제 퍼블릭에서도!)

### 잔액 조회(balanceOf)

#### 1. Wrapper를 사용한 경우

```java
void balanceOf() throws Exception {

        String ERC20_CONTRACT_ADDRESS = "0x.....";
        String USER_ADDRESS = "0x....";
        String USER_PRIVATE_KEY = "0x...."; // 사용자의 개인키
        long TX_END_CHECK_DURATION = 3000;
        int TX_END_CHECK_RETRY = 3;

        // 로컬 환경에서 프라이빗 네트워크를 띄운 상태에서 진행한다.
        Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));
        Credentials credential = Credentials.create(USER_PRIVATE_KEY);
        ContractGasProvider gasProvider = new DefaultGasProvider();
        FastRawTransactionManager manager = new FastRawTransationManager(
                web3j, 
                credential, 
                new PollingTransactionReceiptProcessor(web3j, TX_END_CHECK_DURATION, TX_END_CHECK_RETRY)
        );

        // 위에서 생성한 Wrapper의 이름이 MyERC20이라고 가정한다.
        MyERC20 erc20 = MyERC20.load(ERC20_CONTRACT_ADDRESS, web3j, manager, gasProvider);
        BigInteger balance = erc20.balanceOf(USER_ADDRESS).send();

        System.out.println(balance);
}
```
#### 2. Wrapper를 사용하지 않은 경우

```java
void balanceOf() throws Exception {
        String USER_ADDRESS = "0x....";
        String ERC20_CONTRACT_ADDRESS = "0x.....";

        Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));

        // input parameters
        List<Type> params = new ArrayList<Type>();
        params.add(new Address(USER_ADDRESS));

        // output parameters
        List<TypeReference<?>> returnTypes = Arrays.<TypeReference<?>>asList(new TypeReferences<Uint256>() {});

        Function function = new Function(
                "balanceOf",
                params,
                returnTypes
        );

        String txData = FunctionEncoder.encode(function);
        org.web3j.protocol.core.methods.response.EthCall response = web3j.ethCall(
                Transaction.createEthCallTransaction(USER_ADDRESS, ERC20_CONTRACT_ADDRESS, txData),
                DefaultBlockParameterName.LATEST).sendAsync().get();
        )

        List<Type> results = FunctionReturnDecoder.decode(
                response.getValue(), function.getOutputParameters());

        BigInteger balance = (BigInteger)results.get(0).getValue();
        System.out.println(balance);
}
```

언듯 보기에도 Wrapper가 훨씬 간단하고 가독성이 좋다. 일반적으로 Wrapper를 쓰는 것이 더욱 편리하다는 것을 볼 수 있다.

### 자산 전송(transfer)

#### 1. Wrapper를 사용한 경우

```java
void transfer() throws Exception {
        String ERC20_CONTRACT_ADDRESS = "0x.....";
        
        // ERC20을 보내는 사용자
        // 내가 상대방에게 보내는 상황이다.
        String USER_ADDRESS = "0x....";
        String USER_PRIVATE_KEY = "0x...."; 

        // ERC20을 받는 사용자
        String RECEIVER_ADDRESS = "0x....";
        
        // 트랜잭션 처리에 대한 변수값 -> 기본적으로 3000, 3을 할당한다.
        // 네트워크 상황에 따라 변경가능하다.
        long TX_END_CHECK_DURATION = 3000;
        int TX_END_CHECK_RETRY = 3;
        
        // 이전에 만든 프라이빗 네트워크에서 사용한 CHAIN ID가 필요하다. 
        // 트랜잭션을 블록에 작성하는 경우에는 필수적이나, 조회하는 경우에는 써도 되고 안써도 된다.
        long CHAIN_ID = 17;

        String amount = "10"; // ERC20 10개를 RECEIVER_ADDRESS에 전송

        // 로컬 환경에서 프라이빗 네트워크를 띄운 상태에서 진행한다.
        Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));
        Credentials credential = Credentials.create(USER_PRIVATE_KEY);
        ContractGasProvider gasProvider = new DefaultGasProvider();
        FastRawTransactionManager manager = new FastRawTransationManager(
                web3j, 
                credential, 
                CHAIN_ID,
                new PollingTransactionReceiptProcessor(web3j, TX_END_CHECK_DURATION, TX_END_CHECK_RETRY)
        );

        MyERC20 erc20 = MyERC20.load(ERC20_CONTRACT_ADDRESS, web3j, manager, gasProvider);
        erc20.transfer(RECEIVER_ADDRESS, new BigInteger(amount)).send();
}
```

#### 2. Wrapper를 사용하지 않은 경우

```java
void transfer() throws Exception {
        String ERC20_CONTRACT_ADDRESS = "0x.....";
        
        // 위와 동일
        String USER_ADDRESS = "0x....";
        String USER_PRIVATE_KEY = "0x...."; 
        String RECEIVER_ADDRESS = "0x....";
        long TX_END_CHECK_DURATION = 5000;
        int TX_END_CHECK_RETRY = 3;
        long CHAIN_ID = 17;
        String amount = "10";

        Web3j web3j = Web3j.build(new HttpService("http://localhost:8545"));
        Credentials credential = Credentials.create(USER_PRIVATE_KEY);

        List<Type> params = new ArrayList<Type>();
        params.add(new Address(RECEIVER_ADDRESS));
        params.add(new Uint256(new BigInteger(amount)));

        // output parameters
        List<TypeReference<?>> returnTypes = Collections.<TypeReference<?>>emptyList();

        Function function = new Function(
                "transfer",
                params,
                returnTypes
        );

        String txData = FunctionEncoder.encode(function);

        TransactionReceiptProcessor receiptProcessor = new PollingTransactionReceiptProcessor(web3j, TX_END_CHECK_DURATION, TX_END_CHECK_RETRY);
        TransactionManager manager = new RawTransactionManager(web3j, credential, CHAIN_ID, receiptProcessor);
        ContractGasProvider gasProvider = new DefaultGasProvider();

        String txHash = manager.sendTransaction(
                gasProvider.getGasPrice("transfer"),
                gasProvider.getGasLimit("transfer"),
                ERC20_CONTRACT_ADDRESS,
                txData,
                BigInteger.ZERO
        ).getTransactionHash();

        TransactionReceipt receipt = receiptProcessor.waitForTrasactionReceipt(txHash);
        System.out.println(receipt.getStatus());
}
```

<br>

## 정리

Wrapper를 사용할때와 사용하지 않을때의 소스를 비교해보면, 월등히 Wrapper를 사용할 때가 더 간결하다는 것을 볼 수 있다. 게다가 입력해야 하는 파라미터의 수도 현저히 줄어들기 때문에 실수를 방지하기 위해서라도 Wrapper를 사용하는 것이 바람직할 것으로 보인다.  

단, Web3j의 버전이 낮은 경우 Wrapper를 열심히 만들어도 적용이 되지 않는 경우가 있다. 꼭 최신 버전으로 유지하는 것을 권장한다. 다음번 포스팅에서는 ERC721에 대한 여러가지 스마트컨트랙트 기능을 Web3j로 구현해본다.

<br>

## 참고자료
- [Geth - Private network](https://geth.ethereum.org/docs/interface/private-network)
- [web3j - docs](https://docs.web3j.io/4.8.7/)
