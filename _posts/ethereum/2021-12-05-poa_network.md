---
title:  "PoA 기반의 이더리움 네트워크 구축하기" 
excerpt: "geth를 이용하여 PoA 기반의 이더리움 네트워크를 구성하는 방법을 공유한다."

categories:
  -  Ethereum
tags:
  - [Blockchain, Ethereum, geth, poa]

toc: true
toc_sticky: true

date: 2021-12-05
last_modified_at: 2021-12-05
---

<br>

## Dev mode와 PoW의 장단점

이전 포스팅 ['Geth을 이용한 이더리움 dev mode 구성하기'](https://wnjoon.github.io/ethereum/devmode_using_geth/)에서 geth의 Dev mode를 활용한 네트워크 구성 및 이에 대한 장단점을 분석하고, 범용적인 테스트 환경의 이더리움 네트워크를 구축하기 위해 PoW 기반의 합의 알고리즘을 적용해보았다. 이를 간략하게 정리해보면 다음과 같다.  

|**종류**|**장점**|**단점**|
|---|---|---|
|Dev mode|- 환경을 쉽게 구성할 수 있음<br>- Genesis 블록을 위한 별도의 파일을 작성할 필요 없음<br>- 커밋 요청 시에만 블록이 생성됨|- 기능을 세분화하여 구성하는 것이 어려움(불가능)<br>- 각 계정별로 이더를 할당하는 등의 구체적인 설계가 불가능|
|PoW|- 기존의 퍼블릭 블록체인을 그대로 표방할 수 있음<br>- 세세한 기능을 적용하고 이를 테스트 할 수 있음<br>- 테스트를 위한 계정과 각 계정 별 이더를 미리 할당할 수 있음|- 지속적으로 채굴(mining) 작업이 발생<br>- CPU가 계속해서 사용되기 때문에, 테스트 환경에 사용하는 PC에 부담이 생김<br>- 장기간 채굴과정을 진행하면, 이더리움 네트워크가 중단되는 현상이 발생|

<br>

## PoA(Proof-of-Authority)

결국 PoW와 Dev mode의 장점을 적절히 조합한 PoA([위키피디아 - PoA](http://wiki.hash.kr/index.php/권위증명))가 테스트환경에 굉장히 유용할 것이라 판단되었고, 이를 이더리움 네트워크로 구성해보려 한다.  
PoA로 구축한 이더리움 네트워크의 장점을 간단히 정리해보면 아래와 같다.
- 채굴이 계속 진행되지 않고 커밋 시점에서만 블록이 생성되기 때문에, 테스트에 사용하는 PC의 부담을 크게 줄일 수 있다.
- PoW 방식처럼 테스트를 위한 계정 및 이더와 같은 세세한 내용을 미리 설정할 수 있다.

<br>

## Genesis block 

### 1. Authority 생성

PoA는 검증자(validator)라고 불리는 Authority들이 정해진 주기별로 돌아가면서 블록을 생성하는 구조로 되어있다. 그렇기 때문에 <u>몇 개의 Authority를 네트워크에 구성할 것인가</u>는 매우 중요한 부분이다. Authority에 대한 정보는 genesis 파일을 설계할 때 입력해야 하는데, 이더리움이 처음 제안될 때 PoW 기반이기도 했고 PoA에 대한 고민을 하지 않아서인지 몰라도 <u>Authority에 대한 정보는 extraData라는 별도의 항목에 작성</u>해야 한다.

우선 Authority로 사용할 계정이 필요하다. 이를 위해 각 계정별로 독립된 공개키/개인키 쌍이 필요하다. 필자는 이를 위해 별도의 테스트 계정 디렉토리를 별도로 구성하였다. ([예시 - Authority 계정 목록](https://github.com/wnjoon/nft-marketplace/tree/master/ethereum/poa/data))

개인적으로 계정을 만들기 위해서는 아래와 같이 진행하면 된다. 
```sh
$ geth --datadir {계정 이름}/ account new
```

### 2. Genesis 설정 파일 작성

```json
{
    "config": {
        ...
        "clique": {
                "period": 0,
                "epoch": 30000
        }
    },
    "alloc"         : {
        "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
                ...
        },
        ...
    },
    "nonce"         : "0x0",
    "timestamp": "0x5a722c92",
    "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f70e0E6Ba284481DEB1d53765fCE4A49DF5e16240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "gasLimit":"0x1fffffffffffff",
    "contractSizeLimit":2147483647,
    "difficulty": "0x01",
    "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "number": "0x0",
    "gasUsed": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```
Genesis 파일에 대한 전체 소스는 [이곳](https://github.com/wnjoon/nft-marketplace/blob/master/ethereum/poa/genesis.json)을 참조하면된다.  
[PoW 기반의 Genesis 파일](https://github.com/wnjoon/nft-marketplace/blob/master/ethereum/pow/genesis.json)과 비교해보면 clique와 extraData 부분이 다름을 볼 수 있다. 

> 이더리움에서 제공하는 합의 알고리즘에는 제각각 이름이 존재한다.
> - PoW : Ethash
> - PoA : Clique
> - PoS : Casper

#### 2.1. clique
- period : 블록이 몇 초마다 생성될지에 대한 주기
- epoch : 노드가 채굴하기 위해 필요한 DAG(Directed Acycle Graph - 방향성 비순환 그래프)를 만들어주는 주기를 의미한다. 위의 예시대로라면 30000개의 블록마다 1번의 epoch가 발생한다. 

이더리움은 CliqueConfig([config.go - github](https://github.com/ethereum/go-ethereum/blob/master/params/config.go#L313))에 이러한 내용을 정의하고 있다.
```go
// CliqueConfig is the consensus engine configs for proof-of-authority based sealing.
type CliqueConfig struct {
	Period uint64 `json:"period"` // Number of seconds between blocks to enforce
	Epoch  uint64 `json:"epoch"`  // Epoch length to reset votes and checkpoint
}
```

#### 2.2. extraData
PoA 환경에서 블록을 생성(채굴)하는 주체인 Authority들의 목록을 저장한다. 만약 주소가 0xabcd라고 할 때, 0x를 제외한 abcd를 0x00000.....0 뒤에 차례대로 추가해주면 된다. 본 예시에서는 테스트 환경을 위한 PoA 구성이라는 특성에 맞추어 하나의 Authority만을 추가한다.

<br>

## 네트워크 구동

네트워크 구동 방법은 PoW와 매우 유사하다. 해당 스크립트를 [이곳](https://github.com/wnjoon/nft-marketplace/blob/master/ethereum/poa/network.sh)에 올려두니 참고하길 바란다. PoW와 차이점이라고 한다면, --nodeKey에 Authority로 생성할 계정의 키가 명시되어 있는 디렉토리를 연결해주고 해당 계정을 뒤에 unlock으로 풀어줘야 한다는 것이다. 

```sh
nohup geth --networkid 13691 --datadir poa-chain-dir --nodekey ./data/key \
--http --http.port 8545 --http.api "personal,db,eth,net,web3,txpool,miner" \
--http.corsdomain "*" --allow-insecure-unlock --nodiscover --snapshot=false \
--unlock 'f70e0e6ba284481deb1d53765fce4a49df5e1624' \
--password $ACCOUNTDIR/password.txt --mine --ipcpath "/tmp/geth.ipc" \
> ./poa-chain-dir/gethNode.log &
```

<br>

## 참고자료
- [POA 합의 알고리즘으로 구현하는 Private Network - Blockchain.Dev](http://blockchaindev.kr/models/content/97)
- [이더리움 합의 알고리즘 추가하기 - Luke Park](https://medium.com/curg/이더리움-합의-알고리즘-추가하기-part-1-a8a0fc7b985)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>