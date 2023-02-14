---
layout: post
title:  "스마트 컨트랙트 호출 과정을 바이트코드로 알아보기" 
excerpt: "어셈블리어라는 것을 들어본적이 있는가? 우리가 사용하는 모든 프로그래밍 언어는 결국 바이트로, 그리고 최종적으로 0과 1로 변환되어 컴퓨터에게 전달된다. 사용하기 쉬울수록 그 사이에 수많은 계층이 존재하는데, 이더리움 또한 솔리디티로 작성된 내용을 EVM에서 바이트코드로 변환하여 컴퓨터에게 전달한다. 그 중 스마트 컨트랙트의 호출과정을 한번 바이트코드로 알아본다."
date:   2023-02-01 15:00:00 +0900
categories: blockchain
tags: [ethereum]
comments: true
---

<br>

## 디셈블러 도구

디셈블러는 '사람이 절대 읽을 수 없는 기계어를 어셈블리어로 변경해주는 것'을 말한다. 이러한 역할을 하는 도구를 디컴파일러(decompiler)라고 한다. 솔리디티 또한 여러가지 도구를 통해 미리 바이트코드를 확인할 수 있다.

![image](https://user-images.githubusercontent.com/39115630/216486862-7b57efcd-9559-4488-a0e2-13deb3f4f9d3.png)  
*@그림 1 : 컴파일 된 어떠한 스마트 컨트랙트 - coinpressokr*

스마트 컨트랙트가 컴파일되면 위의 그림과 같이 사람으로선 절대 알아볼 수 없는, 오직 컴퓨터만이 알아볼법한 형태의 결과물이 생성된다. 그렇다면 이를 디컴파일 해줄 수 있는 도구가 무엇이 있을까? 솔리디티를 활용할 수 있는 도구들은 아래와 같다.

- porosity ([Github link](https://github.com/msuiche/porosity))
    - 가장 처음으로 만들어진 솔리디티 디컴파일러
    - 취약점 분석 및 스마트 컨트랙트의 내용 검증 가능
- Ethersplay ([Github link](https://github.com/crytic/ethersplay))
    - [바이너리 닌자(Binary Ninja)](https://crasy.tistory.com/137)용 EVM 플러그인 
- IDA_EVM ([Github link](https://github.com/crytic/ida-evm))

<br>

## 디스어셈블링 해보기

Faucet.sol이라는 컨트랙트가 있다.

```solidity
pragma solidity ^0.4.19;

contract Faucet {
    // 이더 전달
    function withdraw(uint withdraw_amount) public {
        // 출금 이더 제한
        require(withdraw_amount <= 100000000000000000);
        // 이더 전송
        msg.sender.transfer(withdraw_amount);
    }
    // 입금 가능
    function () public payable {}
}
```

컴파일된 Faucet 스마트 컨트랙트를 Ethersplay로 디컴파일링하면 아래와 같은 결과물을 얻을 수 있다.

![image](https://user-images.githubusercontent.com/39115630/216518320-d81aa32a-a87b-4868-8d6b-ff7873fa9ff2.png)  
*@그림 2 : 디컴파일 된 Faucet 스마트 컨트랙트 - Mastering Ethereum*

<br>

## Faucet.sol의 바이트코드 분석하기

Faucet.sol은 withdraw 함수와 payable(Fallback) 함수로 구성되어 있다. 

### 1. 트랜잭션 전송

스마트 컨트랙트로 트랜잭션이 전송되면, 해당 트랜잭션은 스마트 컨트랙트의 디스패처(dispatcher)로 들어간다. <u>디스패처는 트랜잭션의 data 필드를 확인하고, 이 중 트랜잭션과 관련된 함수로 내용을 전달한다.</u>

### 2. 함수가 존재하지 않는 경우 (노란박스)

![image](https://user-images.githubusercontent.com/39115630/216518225-bb6c6e4b-d721-43da-945d-7787e0052595.png)  
*@그림 3 : 함수가 존재하지 않는 경우*

1. PUSH1 0x4
    - 0x4를 스택의 가장 위에 PUSH한다.
2. CALLDATASIZE
    - 트랜잭션(calldata)과 함께 전송된 데이터의 크기(바이트)를 가져와 스택 가장 위에 PUSH한다.
3. LT
    - 스택의 가장 위 항목값(S[0])과 그 아래 항목값(S[1])을 POP하고 이를 비교한다. (S[0] < S[1])
    - 즉, CALLDATASIZE의 결과가 4바이트(0x4)보다 작은지 확인한다.
    - S[0] < S[1] 이면 1을, 아니면 0을 PUSH한다.
    - S[0] < S[1]이 1이고 Fallback 함수가 존재한다면, 해당 주소를 스택 맨 위에 PUSH한다.

<br>

> 4바이트를 확인하는 이유는, EVM에서 함수를 식별하기 위해 각 함수를 Keccak-256으로 해시한 결과 값의 처음 4바이트를 사용하기 때문이다. 만약 값이 존재하지 않으면, 함수가 존재하지 않다고 판단한다. 예로 keccak256("withdraw(uint256)") = 0x2e1a7d4d.... 라고 할 때, 해시의 처음 4바이트인 0x2e1a7d4d가 함수 식별자가 된다. 결국 전송된 트랜잭션의 전체 data 필드가 4바이트보다 작은 경우, 함수가 없다고 판단한다.

<br>

4. JUMPI
    - jumpi(label, cond)로, cond(S[1])가 True일 때 label(S[0])로 점프한다.
    - S[0]과 S[1]을 POP한다.
    - S[1]이 True라면, S[0] 주소 위치로 JUMP 한다.

### 3. 함수가 존재하는 경우 (파란박스)

위 그림에서 LT(S[0] > S[1]), 즉 CALLDATASIZE가 4바이트 이상인 경우 해당 함수가 존재한다고 판단한다. 위 그림 3에서 파란 칸으로 되어있는 부분(PUSH1 0x0)부터 시작한다.

![image](https://user-images.githubusercontent.com/39115630/216518402-95c5aac7-ad9a-4a18-b2d5-855924f8ddee.png)  
*@그림 4 : 함수가 존재하는 경우*

1. CALLDATALOAD
    - 스마트 컨트랙트로 전송된 calldata를 읽는다.
    - 스택에서 값을 POP한다. 이 경우 이전에 PUSH한 0이 나온다.
    - POP한 값을 시작 인덱스로 하여 32바이트 까지 calldata를 읽어 이를 스택에 PUSH한다. 항상 0부터 32바이트까지가 된다.
2. PUSH29
    - 맨 앞이 1인 29바이트의 0x10....값을 스택에 PUSH한다.
3. SWAP1 
    - 스택 최상단의 값과 두번째(S[1]) 값의 위치를 서로 교환한다. 
    - 실제로는 SWAPi(스택 최상단과 i번째 값을 교환)이다.
4. DIV
    - S[0]을 S[1]로 나눈다.

<br>

> 1234000 / 1000의 몫은 1234가 된다. 즉, 32바이트의 길이로 되어있는 값을 29바이트로 구성된(맨앞이 1이고 나머지가 0인) 값으로 나누면 앞의 4바이트만 결과값으로 얻을 수 있다. EVM은 이러한 방식으로 4바이트 길이의 함수식별자를 얻는다.

<br>

5. PUSH 0xffffffff 
    - 0xffffffff를 스택 최상단에 PUSH한다.
6. AND
    - S[0]과 S[1]을 POP한다.
    - 두 값을 AND한 결과(S[1)를 스택에 PUSH한다.
7. DUP
    - 스택의 첫번째 값을 복제한다.
8. PUSH4 0x2e1a7d4d
    - 위에서 미리 계산한 4바이트 길이의 함수식별자(withdraw를 예시로 함)를 PUSH한다.
9. EQ
    - 스택에서 상위 2개의 값(S[0], S[1])을 POP하고, 이 둘이 동일한지 비교한다.
    - 만약 동일하다면 1, 동일하지 않다면 0을 PUSH한다.
10. PUSH1 
    - 실행할 함수가 위치한 주소값을 PUSH한다.
11. JUMPI
    - S[0]과 S[1]을 POP하고, S[1]이 True라면 S[0] 주소 위치로 JUMP 한다.

<br>

## 참고자료

- [Disassembling the Bytecode - Mastering Ethereum, 346p](https://dl.ebooksworld.ir/motoman/Mastering_Ethereum_Andreas.M.Antonopoulos.www.EBooksWorld.ir.pdf)
- [Porosity 디컴파일러, JP Morgan 당신은 도대체 - coinpressokr](https://steemit.com/coinkorea/@coinpressokr/porosity-jp-morgan)
- ['First' Ethereum Decompiler Launches With JP Morgan Quorum Integration - Coindesk](https://www.coindesk.com/markets/2017/07/27/first-ethereum-decompiler-launches-with-jp-morgan-quorum-integration/)
- [binary ninja 설치 하기 - HELLO_HELL?](https://crasy.tistory.com/137)