---
title:  "Geth을 이용한 이더리움 dev mode 구성하기" 
excerpt: "MacOS에서 이더리움의 스마트컨트랙트의 개발 및 테스트를 용이하게 할 수 있는 개발 모드(dev mode)를 geth를 이용하여 구성한다."

categories:
  -  Ethereum
tags:
  - [Blockchain, Ethereum, geth]

toc: true
toc_sticky: true

date: 2021-10-20
last_modified_at: 2021-10-20
---

<br>

## Geth란?

Geth는 Go Ethereum의 약자로, <u>이더리움에서 스마트컨트랙트를 호출할 수 있도록 하는 공식 클라이언트 어플리케이션 중 하나</u>이다.  
Geth를 이용하면 퍼블릭 이더리움과 연결하거나 프라이빗 이더리움을 별도로 구성할 수 있는데, 또한 노드 1개로 이루어진 이더리움을 구성해서 빠르고 간편하게 스마트컨트랙트를 개발하고 이를 테스트할 수도 있다. 본 포스팅에서는 위의 종류 중 3번째인 테스트용 이더리움, 개발 모드(dev mode)를 직접 구성해본다.  
참고로 굉장히 쉬운 내용이고, [공식 홈페이지](https://geth.ethereum.org/docs/getting-started/dev-mode)에 가도 동일한 내용이 적혀있으므로 해당 문서를 참고해도 좋다.

<br>

## Geth 설치

Geth를 설치하는 방식은 크게 3가지로 구분되며, 동작 방법은 바이너리 또는 컨테이너 형태로 나뉜다. 본 포스팅에서는 standalone 형태로 설치한 후 바이너리 모드로 geth를 구동해본다.

### 1. geth 압축파일 다운로드

[Download Geth - Sytau (2021.10.20일 기준 latest stable)](https://geth.ethereum.org/downloads/)

```bash
# 터미널에서 geth를 다운받는다. 만약 wget이 없다면 homebrew를 이용하여 설치한다.
$ wget https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.10-bb74230f.tar.gz

# 압축 풀기
# 필자는 geth 바이너리 파일을 geth_bin 디렉토리에 저장하였다. 
$ mkdir -p geth_bin && tar xvfz geth-darwin-amd64-1.10.10-bb74230f.tar.gz -C geth_bin
```

### 2. geth 바이너리 파일 등록

```bash
$ echo "export PATH=$PATH:{geth_bin 디렉토리 경로}" >> ~/.bash_profile
$ source ~/.bash_profile
```

geth -h로 geth의 정상 적용 여부와 geth에서 사용 가능한 커맨드 옵션을 확인할 수 있다.

<br>

## 개발 모드 실행

개발 모드에서는 기본적으로 아래와 같은 옵션이 적용된 genesis 블록을 생성한다.

- Initializes the data directory with a testing genesis block
- Sets max peers to 0
- Turns off discovery by other nodes
- <u>Sets the gas price to 0</u>
- <u>Uses the Clique PoA consensus engine</u> with which allows blocks to be mined as-needed without excessive CPU and memory consumption
- Uses on-demand block generation, producing blocks when transactions are waiting to be mined

### 1. 테스트 디렉토리 생성

체인베이스(database)가 in-memory 상태로 남지 않도록 데이터를 저장하고 유지할 수 있도록 테스트 디렉토리를 생성한다.

```bash
$ mkdir test-chain-dir
```

### 2. 개발 모드 시작

```bash
$ geth --datadir test-chain-dir --http --dev --http.corsdomain "https://remix.ethereum.org,http://remix.ethereum.org"
```
위의 코드를 보면 --datadir에 위에서 생성한 테스트 디렉토리를 매핑한다. --dev 옵션을 주면 geth를 개발 모드로 실행하게 된다.  
본 예시에서는 remix를 이용하여 dev mode로 구성한 이더리움과 연결하기 때문에, --http.corsdomain에 remix를 연결하였다. remix는 web 기반의 이더리움 IDE이다.

### 3. 노드 연결

```bash
geth attach <IPC_LOCATION>
# geth attach ${test-chain-dir 경로}/geth.ipc
```

위에서 생성한 개발 모드용 노드에서 제공하는 IPC 콘솔로 연결한다. IPC_LOCATION은 위에서 생성한 테스트 디렉토리 내부에 geth.ipc 파일로 존재한다.  
정상적으로 노드에 연결되면 > 와 같이 커맨드라인을 입력할 수 있는 화면이 뜬다.

<br>

## 계정 생성

``bash
> personal.newAccount()
`` 

<br>

## 트랜잭션 테스트
### 1. 코인베이스에서 테스트로 생성한 계정으로 이더 전송

```bash
> eth.sendTransaction({from:eth.coinbase, to:eth.accounts[1], value: web3.toWei(0.05, "ether")})
```

### 2. 테스트 계정의 잔액 확인

```bash
> eth.getBalance(eth.accounts[1])
```

<br>

## Remix 연결

위의 노드 구성 과정에 Remix를 연결하였기 때문에, [Remix 웹페이지(https://remix.ethereum.org)](https://remix.ethereum.org)에서 스마트컨트랙트의 개발과 테스트를 진행할 수 있다. 컨트랙트를 컴파일하는 것은 기존의 구성 그대로 가능하지만, 배포 혹은 실행을 테스트해보고자 할 때에는 web3 provider로 환경을 변경해주어야 한다.  
환경 변경 과정에서 http://127.0.0.1:8545 값을 Web3 Provider Endpoint로 설정해야 하며(기본값으로 되어있음), 이후 Deploy를 진행해야 한다.

<br>

## 참고자료
- [Geth - Dev mode](https://geth.ethereum.org/docs/getting-started/dev-mode)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>