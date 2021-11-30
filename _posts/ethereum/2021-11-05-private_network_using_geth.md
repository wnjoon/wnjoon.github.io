---
title:  "Geth을 이용한 이더리움 private network 구성하기" 
excerpt: "MacOS에서 geth를 이용한 private ethereum network를 구성하는 방법을 공유한다."

categories:
  -  Ethereum
tags:
  - [Blockchain, Ethereum, geth]

toc: true
toc_sticky: true

date: 2021-11-05
last_modified_at: 2021-11-05
---

<br>

## Dev mode와 Private network의 차이

[이전 포스팅 'Geth을 이용한 이더리움 dev mode 구성하기'](https://wnjoon.github.io/ethereum/devmode_using_geth/)에서 geth를 이용한 개발모드를 구성하는 방법에 대해 공유했다. 개발모드는 자동으로 제네시스 블록을 생성해주는 것은 물론이고, 트랜잭션 처리에 필요한 가스 비용을 전부 0으로 만들어주고 심지어 PoA 방식의 합의 알고리즘을 통해 블록 생성 및 검증을 더욱 빠르게 하여 스마트컨트랙트를 개발하고 이를 테스트하기 좋은 환경을 만들어준다.  
Private network는 개발 모드와는 별개로 '퍼블릭하지 않은, 폐쇄된 환경의 이더리움 네트워크'를 구성해주는 것을 목적으로 한다. 그리고 퍼블릭 블록체인과 아주 유사한 환경으로 스마트컨트랙트를 손쉽게 테스트할 수도 있다. 이번 포스팅 이후에 이더리움 클라이언트 개발을 지원하는 자바 기반의 라이브러리인 [web3j](https://github.com/web3j/web3j)를 이용하여 이더리움 네트워크에서 각종 토큰을 전송하고 잔액을 조회하는 기능을 만들어보고 이를 공유해볼 계획인데, 이를 위해 PoW 기반의 Private network를 구성해보기로 했다.

### Dev mode의 한계점

사실 개발모드 외에 private network를 별도로 구성하게 된 이유는 개발모드의 한계점 때문이었다. 
1. 제네시스 블록을 자동으로 생성해주기 때문에, 네트워크의 세부적인 옵션을 정의할 수가 없었다. 테스트를 위해서는 별도의 계정을 미리 만들어두고 해당 계정에 다수의 이더를 넣어놓는 것이 굉장히 편할텐데, 개발모드에서는 일일이 계정을 만들어서 coinbase로부터 이더를 전송받아야만 했다.
2. PoA 방식의 특성상, 개발모드에서는 채굴이라는 과정이 진행되지 않는다. 결국 가스를 지급받으려면 채굴이 필수적인데, 이러한 과정 없이 토큰을 전송하는 트랜잭션을 날리면 동작하지 않았다. 최초의 트랜잭션이 발생될 때 소비되는 가스를 어떻게 마련하는지에 대한 확인이 추가로 필요할 것 같다.
3. 향후에 살펴보겠지만, web3j로 트랜잭션을 날릴 때 CHAIN ID가 필요했다. 개발모드는 일반적으로 1337을 사용하는데, 나중에 다양한 테스트를 위해서는 다양한 적용이 가능한 private network 구축이 더욱 좋을 것이라고 판단했다.

<br>

## Geth 설치 및 구성

Geth에 대한 설치 및 구성 과정은 [이전 포스팅 'Geth을 이용한 이더리움 dev mode 구성하기'](https://wnjoon.github.io/ethereum/devmode_using_geth/)을 참고한다.

<br>

## Private network 구성

### 1. genesis.json

제네시스 블록에 대한 설정 값을 저장하는 곳이다. 나는 향후 테스트를 위한 4개의 계정을 미리 생성하고, 각 계정마다 잔액을 미리 할당하였다.  
앞에서 설명한 것처럼, 네트워크의 아이디(chainId)를 별도로 설정할 수 있다. [이미 퍼블릭한 이더리움에서 공용으로 사용되고 있는 아이디들이 존재](https://medium.com/@pedrouid/chainid-vs-networkid-how-do-they-differ-on-ethereum-eec2ed41635b)하므로, 이를 피해서 사용해야 한다. 

> 말이 Private network 이지만, 결국 퍼블릭한 이더리움 외의 별도의 이더리움 네트워크를 구축하겠다는 것과 동일하다. 만들어진 private network가 외부에 노출되면 결국 퍼블릭 이더리움 네트워크와 겹치지 않는 chainId를 사용해야 한다.

```json
{
    "config": {
        "chainId": 17,
        "homesteadBlock": 0,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip158Block": 0,
        "byzantiumBlock": 0,
        "constantinopleBlock": 0
    },
    "alloc"         : {
        "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
                "privateKey": "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
                "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
                "balance": "90000000000000000000000"
        },
        "627306090abaB3A6e1400e9345bC60c78a8BEf57": {
                "privateKey": "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
                "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
                "balance": "90000000000000000000000"
        },
        "f17f52151EbEF6C7334FAD080c5704D77216b732": {
                "privateKey": "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
                "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
                "balance": "90000000000000000000000"
        },
        "90d48232C2873a76f2547CDa324b3C8bc761374c": {
                "privateKey": "a53e056ee968e2abe96d0ee178488606d9e3f140e1fe9d577a1a544cfa638a6d",
                "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
                "balance": "90000000000000000000000"
        }
    },
    "coinbase"      : "0x0000000000000000000000000000000000000000",
    "difficulty"    : "0x20000",
    "extraData"     : "",
    "gasLimit":"0x1fffffffffffff",
    "contractSizeLimit":2147483647,
    "nonce"         : "0x0000000000000042",
    "mixhash"       : "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp"     : "0x00"
}
```

### 2. 제네시스 블록 생성

위에서 정의한 genesis.json 파일을 이용하여 제네시스 블록을 생성한다. 

```sh
geth init genesis.json --datadir pow-chain-dir
```

geth를 이용하여 생성한 네트워크의 정보를 저장할 디렉토리로 pow-chain-dir라는 경로를 사용한다.

### 3. 계정 불러오기

나는 총 4개의 계정을 제네시스 블록 생성 과정에 미리 생성하고, 이를 불러와서 사용하려고 한다. import를 이용하면 미리 생성된 계정의 정보를 불러올 수 있다.  

```sh
geth --datadir=./pow-chain-dir --password ./init_accounts/password.txt account import ./init_accounts/account1
```

- --datadir : 생성하는 계정의 정보를 저장할 keystore 경로
- --password : 계정을 만들 때 사용할 passphrase가 작성된 파일의 경로
- import : 계정의 private key를 저장하고 있는 파일의 경로

### 4. 네트워크 실행

```sh
nohup geth --networkid 17 --datadir pow-chain-dir --miner.gasprice 0 --miner.gaslimit 0 --txpool.pricelimit 0  --http --http.port 8545 --http.api "personal,db,eth,net,web3,txpool,miner" --allow-insecure-unlock --nodiscover --snapshot=false --mine --ipcpath "/tmp/geth.ipc" > ./pow-chain-dir/gethNode.log &
```
- --networkid : 제네시스 블록에서 정의한 chainId 값
- --datadir : private network의 데이터를 저장할 디렉토리 경로
- --http.port : geth로 rpc 통신할 수 있는 포트.

<br>

## 마이닝

트랜잭션을 처리하기 위해서는 가스가 필요하고, 이러한 가스를 지불할 수 있는 수단인 이더를 얻으려면 '채굴'이 꼭 필요하다. PoW 기반의 이더리움에서는 어쩔 수 없는 부분이고, 그만큼 꼭 필요한 요소라고 볼 수 있다.  
geth를 이용하면 네트워크에 있는 각 계정들이 지속적으로 채굴하도록 할 수 있다. geth attach를 이용하여 콘솔내에서 실행할 수도 있고, 아래와 같이 호스트에서 geth 내부에 명령어만 실행하도록 할 수 있다.

```sh
# 채굴 시작
geth attach http://localhost:8545 --exec "miner.start()" 
# 채굴 종료
geth attach http://localhost:8545 --exec "miner.stop()" 
```

<br>

## 계정 unlock

계정에 대한 잠금/해제는 지갑 어플리케이션을 통해 진행되는데, 현재는 테스트를 위한 private network를 구성하는 것이 목적이므로 모든 계정에 대한 사전의 unlock을 진행하려고 한다.  
이번에는 geth console로 들어가 생성되어 있는 계정 4개에 대한 unlock을 스크립트 형식으로 진행해본다.

```sh 
# geth console 접속
geth attach http://localhost:8545 

# 접속 화면
Welcome to the Geth JavaScript console!

instance: Geth/v1.10.11-stable/darwin-amd64/go1.17.2
coinbase: 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73
at block: 2256 (Thu Nov 04 2021 20:29:18 GMT+0900 (KST))
 modules: eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

To exit, press ctrl-d or type exit
>

# 해당 스크립트 실행 (계정이 4개이므로)
# 계정의 passphrase 값을 이용하여 unlock -> password.txt 내부의 값('pwd') 사용
for (i=0;i<4;i++){personal.unlockAccount(eth.accounts[i],'pwd')}
```

<br>

## 정리

지금까지 private network 환경의 이더리움 네트워크를 구성하고, 테스트를 위한 계정 생성과 해당 계정의 unlock까지 진행했다. 다음 포스팅에서는 만들어진 네트워크 위에 web3j를 이용한 ERC20 토큰의 잔액 조회와 전송 어플리케이션을 만들어서 테스트할 것이다.

<br>

## 참고자료
- [Geth - Private network](https://geth.ethereum.org/docs/interface/private-network)
- [How to preallocate multiple accounts with ether for geth --dev chain? - Stackoverflow](https://ethereum.stackexchange.com/questions/7804/how-to-preallocate-multiple-accounts-with-ether-for-geth-dev-chain)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>