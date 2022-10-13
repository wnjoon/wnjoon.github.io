---
layout: post
title: "트랜잭션 해시(Transaction Hash)는 언제 만들어지는가?" 
excerpt: "트랜잭션 해시에 대한 내용과 생성되는 과정 및 시간에 대하여 알아본다. 결론부터 말하자면, 이더리움 블록체인에 전송되기 전에라도 트랜잭션 해시값은 얻을 수 있다."
date:   2022-05-20 15:00:00 +0900
categories: blockchain
tags: [ethereum, transaction, keccak]
---

<br>

## 트랜잭션 해시란?

트랜잭션 해시(Transaction Hash, 또는 줄여서 TXID)는 <u>트랜잭션에 대한 고유 ID</u>를 의미한다. 일반적으로 트랜잭션은 아래와 같은 정보를 갖는다.

```sh
{
  from : 송신자 지갑의 주소,
  to : 수신자 지갑의 주소,
  value : 전송한 이더 또는 토큰의 개수,
  gasPrice : 트랜잭션 전송에 사용되는 가스량,
  ....
}
```

<br>

## 트랜잭션 해시의 생성 과정

트랜잭션 해시가 만들어지기 위해서는 위에서 언급한 <u>1) 트랜잭션 정보</u>와 <u>2) 트랜잭션을 전송하는 지갑의 개인키</u>가 필요하다. 개인키를 통해 트랜잭션을 보낸 사람이 본인임을 증명할 수 있는데, 이러한 증명 과정을 <u>서명(signature)</u>이라고 한다.  

![image](https://user-images.githubusercontent.com/39115630/169449935-9f3ceda3-a64f-443e-b829-8d75d39f45a7.png)  
*@그림 1: 트랜잭션 해시가 생성되는 과정*

트랜잭션 정보와 서명이 블록체인 노드로 전달되면, 블록체인 노드는 두 정보를 RLP encoding을 통해 RawTransaction으로 만든다. 예시로 아래와 같은 RawTransaction이 있다고 할 때, 이를 해석(decode)하면 실제 전송했던 트랜잭션의 내용을 확인할 수 있다. 이 때 확인할 수 있는(들어있는) 내용은 아래와 같다.

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

위의 내용들이 특정 구문값과 함께 순서대로 조합되어 하나의 16진수 형태로 구성된다. 자세한 내용은 '[트랜잭션 해시(TXID)에 대한 오해](https://brunch.co.kr/@nujabes403/15#comment)'를 확인하면 좋다.  

<br>

## 트랜잭션 해시의 생성 방법

트랜잭션 해시는 결국 <u>keccak256(rawTransaction)</u>의 결과 값이다. [ONLINE SHA-3 Keccak CALCULATOR - CODE GENERATOR](https://leventozturk.com/engineering/sha3/)에서 RawTransaction을 keccak256을 통해 트랜잭션 해시로 만들어볼 수 있는데, 해당 트랜잭션이 이더리움 네트워크에 전송되어 있다면 이를 이더스캔([Etherscan](https://etherscan.io))에서 조회할 수 있다. 여기서 조회 조건인 트랜잭션해시값은 앞에 0x를 붙여줘야 한다.
- https://etherscan.io/tx/트랜잭션해시값 : 트랜잭션에 들어가있는 정보들을 볼 수 있다. 
- https://etherscan.io/getRawTx?tx=트랜잭션해시값  : 해당 트랜잭션의 RawTransaction을 확인할 수 있다.

<br>

## Web3js

### 1. 트랜잭션 해시 생성 : eth.sendTransaction

[web3js.readthedocs.io - eth.sendTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=sendTransaction#sendtransaction)에서는 Web3js를 활용한 트랜잭션 전송 및 해시 반환 방법에 대해 설명하고 있다.  

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

### 2. RawTransaction 생성 : eth.accounts.signTransaction

위의 내용이 트랜잭션을 전송하는 함수였다면, 이 함수([eth.accounts.signTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth-accounts.html?highlight=signTransaction#signtransaction))는 트랜잭션의 정보와 개인키를 이용하여 rawTransaction을 생성해주는 함수이다. 

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

결국 이 함수를 활용하면 트랜잭션을 블록체인에 전송하지 않고도 rawTransaction을 얻을 수 있고, 이를 keccak256 함수로 반환하여 미리 트랜잭션 해시값을 확인할 수도 있다.  

### 3. Nonce

그런데 위의 eth.accounts.signTransaction 함수를 보면 논스(nonce) 값이 필요하다. 블록체인에 실제 트랜잭션을 전송하지 않고도 어떻게 논스를 확인할 수 있을까?  
여기서의 논스는 <u>트랜잭션을 전송하는 지갑의 trasnaction count, 즉 특정 지갑(계정)이 지금까지 블록체인에 전송한 트랜잭션의 개수</u>를 의미한다. 이 값은 [getTransactionCount](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=getTransactionCount#gettransactioncount)를 통해 블록체인 노드로부터 가져올 수 있다. 

### 4. RawTransaction으로 트랜잭션 전송 : sendSignedTransaction

[sendSignedTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth.html?highlight=getTransactionCount#gettransactioncount)은 RawTransaction을 블록체인으로 전송하는 함수이다.  
위의 [eth.accounts.signTransaction](https://web3js.readthedocs.io/en/v1.7.3/web3-eth-accounts.html?highlight=signTransaction#signtransaction)로부터 생성된 값을 해당 함수에 넣어주면 이에 맞는 트랜잭션이 전송된다고 보면 된다.

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

## 결론

위에서 확인할 수 있었듯, rawTransaction을 keccak256 함수로 변환한 값이기 때문에 이더리움 블록체인에 전송되기 전에라도 트랜잭션 해시값은 얻을 수 있다. 

<br>

## 참고자료
- [트랜잭션 해시(TXID)에 대한 오해 - 김훈일](https://brunch.co.kr/@nujabes403/15#comment)
- [Inside an Ethereum transaction - Medium](https://medium.com/@codetractio/inside-an-ethereum-transaction-fa94ffca912f)
- [web3.js - Ethereum JavaScript API](https://web3js.readthedocs.io/en/v1.7.3/index.html)
- [Keccak256 - 해시넷](http://wiki.hash.kr/index.php/Keccak-256)