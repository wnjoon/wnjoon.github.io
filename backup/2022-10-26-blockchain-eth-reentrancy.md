---
layout: post
title:  "이더리움에서의 재진입성(Reentrancy) 공격에 대한 이해" 
excerpt: "재진입성 공격은 컨트랙트가 알 수 없는 주소(스마트 컨트랙트)로 이더를 전송하는 경우 발생한다. 내부 fallback 함수에 악성코드를 심어놓은 스마트 컨트랙트로 이더를 전송하게 되면, 악의적인 코드가 실행되면서 발생하는 공격이다. 이 공격을 예방하려면 transfer를 이용한 이더 전송과 상태 변수의 적절한 변경, 그리고 뮤텍스 등을 적용해야 한다."
date:   2022-10-26 15:00:00 +0900
categories: blockchain
tags: [ethereum, solidity, smart contract]
---

<br>

## 재진입성 공격이란?

재진입이라는 용어는 '외부의 악의적인 컨트랙트가 취약한 컨트랙트의 함수를 호출하면서 실행경로가 그 안으로 재진입하는' 방법이라고 표현한다. 사실 이렇게만 보면 어려운데, 이더리움과 스마트 컨트랙트의 특징을 먼저 살펴보면 좋을 것 같다.

1. 이더리움은 '다른 사용자 주소로 이더를 전송' 한다.
2. 이더리움에서 스마트 컨트랙트는 다른 외부의 스마트 컨트랙트를 호출하고, 그 내부의 기능을 활용할 수 있다.
3. 단순히 이더를 전송하거나 존재하지 않는 외부의 스마트 컨트랙트 내 기능을 호출하는 경우, 콜백을 포함한 다양한 대체 코드를 실행할 수 있다.

재진입성 공격은 <u>컨트랙트가 알 수 없는 주소(스마트 컨트랙트)로 이더를 전송하는 경우</u> 발생할 수 있다. 내부 fallback 함수에 악성코드를 심어놓은 스마트 컨트랙트로 이더를 전송하게 되면, 악의적인 코드가 실행되면서 발생하는 공격이다.

> fallback 함수 : 이름이 없는 함수로, 스마트 컨트랙트 내에 존재하지 않는 함수를 호출하면 대신 호출되는 함수.

가장 유명한 사례로는 [The DAO 해킹](https://hackingdistributed.com/2016/06/18/analysis-of-the-dao-exploit/)이 있다. 대략 1억 5천만 달러 이상의 잔액을 보유하고 있던 컨트랙트를 공격하였으며, 이 공격을 통해 이더리움에서 이더리움 클래식이 하드포크 되었다.

<br>

## 예시

여기 이더를 보관 및 인출해주는 은행 컨트랙트(Bank)와 이를 공격하기 위한 컨트랙트(Attack)가 있다고 하자. 

```solidity
// 은행 컨트랙트
contract Bank {
    mapping(address -> uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount);

        require(msg.sender.call.value(_amount)());
        balances[msg.sender] -= _amount;
    }
}
```

```solidity
contract Attack {
    Bank public bank;

    constructor(address _bankAddress) {
        bank = Bank(_bankAddress);
    }

    function attackBank() public payable {
        bank.deposit.value(1 ether)();
        bank.withdraw(1 ether);
    }

    function () payable {
        if (bank.balance > 1 ether) {
            bank.withdraw(1 ether);
        }
    }
}
```

공격자(Attacker)가 단일 트랜잭션만으로 Bank 컨트랙트에서 1이더만 남기고 모두 출금하는 과정을 그림으로 표현하면 아래와 같다. 단, Bank 컨트랙트에는 어느정도의 이더가 이미 존재하고 있다고 가정한다.

![](https://velog.velcdn.com/images/wnjoon/post/6502c25e-0cd0-4d45-89f8-a8e6cbfce390/image.PNG)

*@그림 1: 공격자가 Attack 컨트랙트를 이용하여 Bank 컨트랙트를 공격*

1. 공격자가 Attack 컨트랙트의 attackBank 함수를 실행한다.
2. attackBank 함수가 Bank 컨트랙트의 deposit 함수를 호출하여 1 이더를 입금한다.
3. attackBank 함수가 Bank 컨트랙트의 withdraw 함수를 호출하여 1 이더를 인출한다.
4. Bank 컨트랙트의 withdraw 함수 내부에서 msg.sender(Attack 컨트랙트)에게 1 이더를 전송한다. Attack 컨트랙트의 fallback 함수가 이를 처리한다.
5. Attack 컨트랙트의 fallback 함수 내부에서 다시 Bank 컨트랙트의 withdraw를 호출한다. Bank 컨트랙트의 잔액이 1 이더만 남을때까지 이 과정은 계속 반복된다.

<br>

## 어떻게 막을 수 있을까?

재진입 공격을 막기 위한 방법은 현재까지 3가지 정도 존재한다.

### 1. transfer 함수 사용

transfer 함수는 외부 컨트랙트 호출에 대해 총 2300개의 가스만 사용할 수 있도록 되어있다. 이는 이더 전송을 위한 단일 트랜잭션은 가능하나, 외부의 다른 컨트랙트를 호출하기에는 적은 양이다.

### 2. 엄격한 상태 변수 변경

컨트랙트 또는 외부의 다른 컨트랙트에서의 호출을 통해 이더가 전송되기 전 상태변수를 변경하는 방식이다. 이를 [체크 효과 상호작용 패턴(checks-effects-interactions pattern)](https://docs.soliditylang.org/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) 이라고 한다.

```solidity
// Bank 컨트랙트 예시
contract Bank {
    ...
    function withdraw(uint256 _amount) public {
        ...
        // 아래 두 코드의 위치를 변경해서,
        // 알 수 없는 주소로의 외부 호출을 수행하는 코드를 
        // 지역함수 또는 코드 실행 부분의 
        // 가장 마지막에 진행해야 한다.
        require(msg.sender.call.value(_amount)());
        balances[msg.sender] -= _amount;
    }
}
```

### 3. 뮤텍스(mutex) 사용

코드가 실행되는 동안에는 컨트랙트를 잠궈주는 상태 변수를 추가하여 재진입을 막을 수 있다.

<br>

## 개선된 코드

개선된 Bank 컨트랙트의 코드를 살펴보면 아래와 같다.

```solidity
// 개선된 은행 컨트랙트
contract Bank {
    // 1. 뮤텍스 추가
    bool mutex = false;
    mapping(address -> uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        
        // 2. 뮤텍스 확인
        require(!mutex);        
        require(balances[msg.sender] >= _amount);

        // 3. 상태 변수 우선 변경
        balances[msg.sender] -= _amount;

        // 4. 외부 호출 이전에 뮤텍스 설정
        mutex = true;

        // 5. call 대신 transfer 사용
        msg.sender.transfer(_amount);
        
        // 6. 외부 호출 이후 뮤텍스 해제
        mutex = false;
    }
}
```

<br>


## 참고자료

- [스마트 컨트랙트 보안::Re-entrancy - PROOFER](https://medium.com/proofer-tech/%EC%8A%A4%EB%A7%88%ED%8A%B8-%EC%BB%A8%ED%8A%B8%EB%9E%99%ED%8A%B8-%EB%B3%B4%EC%95%88-%EC%9D%B4%EC%8A%88-1-re-entrancy-%EC%9E%AC%EC%A7%84%EC%9E%85%EC%84%B1-7d4caf24803c)
- [The DAO 해킹 그리고 사망 - 브런치](https://brunch.co.kr/@ashhan/26)
- [Analysis of the DAO exploit - Hacking,Distributed](https://hackingdistributed.com/2016/06/18/analysis-of-the-dao-exploit/)