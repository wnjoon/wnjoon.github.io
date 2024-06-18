---
layout: post
title:  "HD(Hierarchical Deterministic) Wallet" 
excerpt: "HD Wallet은 하나의 마스터 키로부터 다수의 키들을 계층적으로 파생할 수 있는 지갑으로, 하나의 Root Key로부터 시작되는 계층적(Hierarchical)인 구조를 지닌다. 이번 포스팅에서는 go를 이용하여 HD Wallet에서 사용하는 Key를 생성하는 과정을 직접 구현한 내용을 공유한다."
date:   2021-08-06 15:00:00 +0900
categories: blockchain
tags: [wallet, go]
---

<br>

## HD wallet

HD(Hierarchical Deterministic) wallet은 하나의 마스터 키로부터 다수의 키들을 계층적으로 파생할 수 있는 지갑으로, 하나의 Root Key로부터 시작되는 계층적(Hierarchical)인 구조를 지닌다. 아래의 그림은 [BIP-32](http://wiki.hash.kr/index.php/BIP32) 기준의 HD wallet 흐름도이며, 계층적 구조라는 측면에서는 다른 버전의 BIP(39, 44)와 큰 차이를 갖지 않는다.

![](http://wiki.hash.kr/images/6/68/BIP32.png)

> BIP는 Bitcoin Improvement Proposal의 약자로, 비트코인의 기술을 논의하기 위해 작성하거나 공개된 제안 양식을 의미한다.

<br>

## HD wallet의 필요성

1. 보안성 : 한번 사용된 주소(공개키)와 키(개인키)는 재사용되지 않는데, 즉 거래가 발생할 때마다 주소가 달라진다. BIP-32에서 이러한 보안성 측면에서의 접근이 처음으로 제안되었으며, 이후 BIP-39에서 Mnemonic Code를 적용하여 사용자가 기억하기 쉬운 단어들의 집합으로 이루어진 코드를 적용할 수 있도록 하였다.
2. 멀티 코인 : 초기 HD wallet의 표준이었던 BIP-32, BIP-39가 비트코인에 한정된 기능을 제공하였다면, BIP-44에서는 이더리움을 포함한 다양한 암호화폐에서도 HD wallet을 적용할 수 있도록 하였다. 

<br>

## HD Wallet에서 키 생성하기

HD wallet에서 사용되는 키의 생성 순서는 다음과 같다.

1. Entropy(난수)를 이용한 Mnemonic Code 생성
2. Mnemonic Code를 이용하여 Binary Seed 도출
3. Binary Seed를 이용하여 마스터 키(Master Private Key) 생성
4. 만들어진 마스터 키를 이용하여 자식 키(Child Key), 그리고 자식 키를 이용하여 손자 키(Grand-Child Key)를 파생적으로 생성

### 1. Mnemonic Code

Mnemonic Sentence, Mnemonic Phrase라고도 불리며, 바이너리 데이터를 사람이 기억하기 쉬운 단어들의 집합으로 변환시킨 코드를 의미한다. 주어진 각 단어를 1:1로 매핑되는 바이너리 코드로 변환한 바이너리 시드(Binary Seed)를 만든다.

비트코인의 [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) 에서 Mnemonic Code와 이를 통한 Binary Seed를 생성하는 절차가 기술되어 있다. BIP-39에서 정의한 Mnemonic Code의 단어 수는 [12, 15, 18, 21, 24]개 인데, 그 중 12개와 24개의 단어가 가장 많이 사용되고 있다. 

|**Mnemonic Code 단어 수**|**Entrophy(난수) 비트 수**|
|---|---|
|12|128|
|15|160|
|18|192|
|21|224|
|24|256|

Mnemonic Code의 생성 순서는 다음과 같다.

1. Mnemonic Code의 단어 수에 해당하는 비트 수 만큼의 난수를 생성한다. 이 때의 난수를 엔트로피(Entropy)라고 하는데, 예를 들어 12개의 단어를 갖는 Mnemonic Code 생성에 필요한 엔트로피는 128비트(16바이트)로 생성되어야 한다.
2. 엔트로피를 SHA256으로 해싱한 비트 값을 체크섬에 사용한다. 체크섬은 엔트로피 뒤에 추가되어 에러를 체크하기 위해 사용되는 비트인데, '엔트로피 비트 수 / 32' 계산식으로 구할 수 있다. 위의 128 비트의 엔트로피를 예로 들면, SHA256 해시 결과 중 앞의 4비트가 체크섬이 된다.
3. 엔트로피와 엔트로피로부터 도출된 체크섬을 합친 데이터(엔트로피 + 체크섬)를 11비트씩 쪼갠 값에 매핑되는 단어를 BIP-39 단어 리스트로부터 찾는다. 11비트씩 단어를 쪼개기 때문에, 리스트에는 2048(2^11)개의 단어가 들어있다. 리스트의 인덱스는 0부터 2047까지 있는데, [여기서 사용되는 단어들은 모두 BIP-39에 미리 정의되어 있으며](https://github.com/NovaCrypto/BIP39/blob/master/src/main/java/io/github/novacrypto/bip39/wordlists/English.java) 대부분 영어로 구성되어 있다.

### 2. Binary Seed

Mnemonic Code가 HD wallet에서 사용되려면 Binary Seed로 변환되어야 한다. 변환된 Binary Seed를 이용하여 Master Private Key를 생성한다.  
Binary Seed는 PBKDF2 함수를 이용하여 생성된다. 생성 과정에서 Mnemonic Code와 Salt값이 필요하다. 일반적으로 Salt는 "mnemonic" 단어를 사용하나, 사용자가 옵션으로 뒤에 단어를 추가하여 사용할 수도 있다. PBKDF2 함수에는 HMAC-SHA512 해시함수를 사용하며, 총 2048번의 반복(iteration) 과정을 수행하며 최종 도출된 결과 키의 512비트를 사용한다. 

### 3. Private Master Key

위에서 도출된 512비트의 Binary Seed를 다시 HMAC-SHA512로 해싱하여 만든다. 이 때 만들어진 값은 Private Key와 기타 값을 포함한 Master Key(마스터 키, 또는 부모 키)라고 하는게 옳다. 

마스터 키는 Private Key와 체인코드(chaincode)로 구성된다. Hyperledger fabric을 다루던 블록체인 개발자에게 체인코드란 스마트 컨트랙트와 같은 개념으로 인식할 수 있지만, 여기서 체인코드는 마스터 키(부모 키)로부터 자식 키를 생성할 때의 엔트로피(난수) 제공 역할을 한다. 

![](https://i.stack.imgur.com/oXwRu.png)

그림에서 보이는 것과 같이, 마스터 키는 총 512비트로 구성되며 이 중 앞 256비트는 Private(또는 Public) key, 뒷부분 256비트는 체인코드로 구성된다.  
[Typer-smith(github) : go-bip32](https://github.com/tyler-smith/go-bip32/blob/master/bip32.go) 의 NewMasterKey를 보면 Private Key와 Public Key의 생성 과정이 코드로 구현되어 있으며, 필자 또한 샘플 소스 개발 과정에 해당 오픈라이브러리를 사용했다.

> 실제 구현 과정에서 엔트로피와 니모닉 코드, 그리고 바이너리 시드는 다양한 자료를 검색하면서 구현할 수 있었다. 하지만 마스터 키의 경우에는 [검증 사이트(iancoleman.io)](https://iancoleman.io/bip39/#english) 에서 출력하는 값과 계속 상이하여 오픈라이브러리를 사용했다. Tyler-smith의 소스 코드 내 B58Deserialize 함수를 확인 결과 Base58 encoding 과정을 거치는 것으로 보이는데, 이 부분은 설명 나와있는 곳을 찾지 못하여 이유를 아직 확인하기는 어려웠다.

### 4. Child Key

BIP32에서는 자식 키(Child Key) 생성 방식을 총 3가지로 구분한다.

1. 부모 Private Key -> 자식 Private Key
2. 부모 Private Key -> 자식 Public Key
3. 부모 Public Key -> 자식 Public Key

먼저 위의 마스터 키 생성 과정에서 도출된 체인코드를 HMAC-SHA512의 키(secret)로 사용하여 key+index 값을 해싱한다. 해싱된 결과 값은 부모 키와 동일한 구조로, 앞부분 256비트와 부모 키를 결합하여 Child Key가 생성된다. 뒷부분 256비트는 자식 키의 또 다른 자식 키 생성에 사용될 체인코드가 된다.

<br>

## Source code

[wnjoon/hdwallet-go](https://github.com/wnjoon/hdwallet-go)

2021.08.24까지 작업하였고, 최종적으로 PEM 파일로 생성된 공개키를 떨구는 작업까지 완료하였다.

<br>

## 참고자료
- [HD(Hierarchical Deterministic) Wallet(BIP32,39,44)](https://blog.naver.com/gksalswl222/221389359473)
- [Crypto 스터디 - Mnemonic Code](http://cryptostudy.xyz/crypto/article/8-Mnemonic-Code)
- [Crypto 스터디 - HD 키 생성](http://cryptostudy.xyz/crypto/article/9-HD-키-생성)
- [HD Wallet](https://blog.naver.com/forkblock/221559838087)
- [HD wallet 구조 설명 - 개발 이야기](https://potensj.tistory.com/57)