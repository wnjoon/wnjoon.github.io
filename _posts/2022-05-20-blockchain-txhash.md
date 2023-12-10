---
layout: post
title: "트랜잭션 해시(Transaction Hash)에 대한 설명과 생성 과정"
excerpt: "이더리움에서는 모든 서명된 트랜잭션마다 해시값을 가지며, 이 값을 이용하여 블록에 배포된 트랜잭션의 정보들을 손쉽게 조회할 수 있다. 그렇다면 블록에 배포되지 못하고 실패한 트랜잭션은 어떻게 조회할 수 있을까? 이번 포스팅에서는 트랜잭션 해시가 어떻게 만들어지고, 언제 확인할 수 있는지에 대해 설명한다."
description: "An explanation of what a transaction hash is and how it is created in Ethereum."
date: 2022-05-20 15:00:00 +0900
categories: 블록체인
tags: [ethereum, web3js]
keywords: [blockchain, ethereum, keccak]
comments: true
---

<br>

## 서명은 되었지만 아직 블록으로 만들어지지 못한 트랜잭션, RawTransaction

트랜잭션 해시(Transaction Hash)는 <u>트랜잭션에 대한 고유 ID</u>를 의미한다. 일반적으로 트랜잭션은 아래와 같은 정보를 갖는다.

```sh
{
  from : 송신자 지갑의 주소,
  to : 수신자 지갑의 주소,
  value : 전송한 이더 또는 토큰의 개수,
  gasPrice : 트랜잭션 전송에 사용되는 가스량,
  ....
}
```

이러한 트랜잭션 해시가 만들어지기 위해서는 위에서 언급한 <u>트랜잭션 정보</u>와 <u>트랜잭션을 전송하는 사용자(EOA)의 개인키</u>가 필요하다. 개인키를 통해 트랜잭션을 보낸 사람이 누구인지를 증명할 수 있는데, 이러한 증명 과정을 <u>서명(signature)</u>이라고 한다.

<p align="center" style="color:gray">
  <img src="https://user-images.githubusercontent.com/39115630/169449935-9f3ceda3-a64f-443e-b829-8d75d39f45a7.png" alt="트랜잭션 해시의 생성 과정" />
  <br />
   트랜잭션 해시의 생성 과정 (이더리움으로 갔다고 해서 배포된 것은 아니라는 것을 향후에 설명할 것)
</p><br>

트랜잭션 정보와 서명이 블록체인 노드로 전달되면, 블록체인 노드는 두 정보를 포함한 데이터를 [RLP 방식](https://wnjoon.github.io/2022/09/12/blockchain-rlp)을 통해 인코딩하게 되는데, 이 때 만들어지는 것이 RawTransaction이다. RawTransaction 내부를 확인해보면 아래와 같다.

```sh
{
  nonce : 해당 트랜잭션의 논스값,
  gasPrice : 해당 트랜잭션의 가스 수수료,
  gas : 해당 트랜잭션을 수행할 때의 가스리밋(gasLimit),
  to : 수신자 지갑 주소,
  value : 전송량,
  data : 트랜잭션에 추가로 보내는 데이터,
  v : 서명 값,
  r : 서명 값,
  s : 서명 값
}
```

위의 내용들이 특정 구문값과 함께 순서대로 조합되어 하나의 16진수 형태로 구성된다. 자세한 내용은 아래 참고자료에 추가한 '[트랜잭션 해시(TXID)에 대한 오해](https://brunch.co.kr/@nujabes403/15#comment)'를 확인하면 좋다.

그렇다면 실제 트랜잭션의 해시는 어떻게 얻을 수 있을까? 이더리움에서는 서명까지 완료된 RawTransaction을 Keccak256 방식으로 해싱하여 트랜잭션 해시를 생성한다. 즉, 블록체인에 배포되어 블록으로 생성되기 전에도 트랜잭션 해시 값은 미리 확인할 수 있다.

<br>

## Web3js로 알아보기

### 2.1. eth.sendTransaction

[sendTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=sendTransaction#sendtransaction)은 파라미터로 전달된 값을 바이트 형태로 조합한 후, 함께 전달된 사용자 주소에 해당하는 개인키로 서명하여 블록체인에 전송하는 일련의 과정을 한번에 처리해준다.  
뒤에서 다룰 내용인 동일한 데이터값을 블록체인에 전송하기 전 서명하여 트랜잭션 해시로 만들었을 때의 값과 비교하기 위해 실행해본다.

```js
// using the event emitter
web3.eth.sendTransaction({
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
    value: '1000000000000000'
})
.on('transactionHash', function(hash){
    ...
})
.on('receipt', function(receipt){
    ...
})
.on('confirmation', function(confirmationNumber, receipt){ ... })
.on('error', console.error); // If a out of gas error, the second parameter is the receipt.
```

위의 코드에서 .on으로 시작되는 내용들에 대한 설명은 아래와 같다.

- on('transactionHash' ...) : 트랜잭션 해시가 노드로부터 반환되었을 경우 실행할 내용들
- on('receipt' ...) : 트랜잭션이 블록에 포함되었을 경우 실행할 내용들
- on('confirmation' ...) : 트랜잭션이 블록체인에서 confirm 되었을 경우 실행할 내용들
- on('error' ...) : 트랜잭션 전송 과정에서 에러가 발생하였을 경우 실행할 내용들

### 2.2. eth.accounts.signTransaction

[signTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth-accounts.html?highlight=signTransaction#signtransaction)은 말그대로 트랜잭션 형태로 만들어진 바이트 데이터를 전달된 사용자의 개인키로 서명한다. 이 때 생성된 값이 RawTransaction이 된다.

```js
web3.eth.accounts.signTransaction({
    to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
    value: '1000000000',
    gas: 2000000,
    gasPrice: '234567897654321',
    nonce: 0,
    chainId: 1
}, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
.then(console.log);
> {
    messageHash: '0x6893a6ee8df79b0f5d64a180cd1ef35d030f3e296a5361cf04d02ce720d32ec5',
    r: '0x9ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9c',
    s: '0x440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428',
    v: '0x25',
    rawTransaction: '0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428'
    transactionHash: '0xd8f64a42b57be0d565f385378db2f6bf324ce14a594afc05de90436e9ce01f60'
}

}
```

결과 값을 보면 transactionHash를 볼 수 있는데, 결국 트랜잭션이 블록에 포함되지 않아도(더 나아가 블록체인에 트랜잭션을 전송하지 않아도) 생성된 rawTransaction을 keccak256 함수로 해싱하여 미리 트랜잭션 해시값을 확인할 수 있다.

> **Nonce**
>
> 논스는 <u>트랜잭션을 전송하는 지갑의 trasnaction count, 즉 특정 지갑(계정)이 지금까지 블록체인에 전송한 트랜잭션의 개수</u>를 의미한다.
> 위의 eth.accounts.signTransaction 함수를 보면 트랜잭션 전송에는 필히 논스(nonce) 값이 필요하다는 것을 알 수 있는데, [getTransactionCount](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=getTransactionCount#gettransactioncount)를 통해 현재까지 해당 사용자가 블록체인으로 전송한 트랜잭션의 수를 미리 확인할 수 있다.  
> 즉 모든 트랜잭션은 전송하기 전 블록체인으로부터 현재 사용자가 사용할 수 있는 논스값을 먼저 확인해야 하는데, 이러한 블록체인 접근 과정을 최소화하여 성능을 개선 하기 위해 redis와 같은 별도의 논스 관리 시스템을 사용하기도 한다.

### 2.3. eth.sendSignedTransaction

[sendSignedTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=getTransactionCount#gettransactioncount)은 서명된 트랜잭션인 RawTransaction을 블록체인으로 전송할때 사용한다.

```js
var Tx = require('@ethereumjs/tx').Transaction;
var privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex');

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

var tx = new Tx(rawTx, {'chain':'ropsten'});
tx.sign(privateKey);

var serializedTx = tx.serialize();

// console.log(serializedTx.toString('hex'));
// 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', console.log);

> // see eth.getTransactionReceipt() for details
```

<br>
<br>

---

## 참고자료

- [트랜잭션 해시(TXID)에 대한 오해 - 김훈일](https://brunch.co.kr/@nujabes403/15#comment)
- [Inside an Ethereum transaction - Medium](https://medium.com/@codetractio/inside-an-ethereum-transaction-fa94ffca912f)
- [web3.js - Ethereum JavaScript API](https://web3js.readthedocs.io/en/v1.7.3/index.html)
- [Keccak256 - 해시넷](http://wiki.hash.kr/index.php/Keccak-256)
