---
layout: post
title:  "스마트 컨트랙트를 이용해서 서로 다른 두 종류의 토큰 교환하기"
excerpt: "서로 다른 두 EOA가 갖고 있는 토큰을 약속에 맞게 교환하는 방법은 무엇이 있을까? 일반적으로는 두번의 Transfer를 호출하는 방법이 있을 것이다. 이번 포스팅에서는 Swap이라는 컨트랙트를 별도로 만들고, 해당 컨트랙트가 대리로 토큰을 교환할 수 있도록 승인하여 실제로 EOA가 아닌 Swap 컨트랙트를 통해 토큰을 교환해본다."
date:   2022-12-18 15:00:00 +0900
categories: blockchain
tags: [ethereum, smart contract, hardhat, solidity, dex]
---

<br>

## 서로 다른 두 토큰을 교환하기

ERC 표준을 따르는 모든 토큰은 기본적으로 transfer라는 함수를 갖고 있다. 의미상으로는 '전송'이 맞는데, 실제 블록체인 입장에서는 A라는 주소에서 B라는 주소로 해당 토큰의 소유주를 변경하는 행위가 발생한다. 

```solidity
contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;
	...
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }
        emit Transfer(from, to, amount);
        _afterTokenTransfer(from, to, amount);
    }
	...
}
```

위의 예시를 보면 _balance라는 맵이 존재하고, 각 주소마다 보유하고 있는 토큰의 양을 담고 있는 것을 볼 수 있다. 그리고 _transfer 함수가 호출되면 실제로 데이터를 전송하는 것이 아닌, _balance[A]가 소유하고 있는 값과 _balance[B]가 소유하고 있는 값을 변경하게 된다.

결국 단일 토큰의 경우 어떠한 중앙화 된 시스템 없이도 스마트 컨트랙트만으로도 거래할 수 있게 된다. 그렇다면 서로 다른 두 토큰을 거래하고 싶으면 어떻게 해야 할까?

<br>

**방법 1. 어플리케이션에서 각 토큰마다 한번씩, 총 2번의 거래를 일으킨다.**

가장 일반적으로 생각할 수 있는, 중앙화 된 시스템에 익숙해진 우리가 바로 도출해낼 수 있는 방법이다. 하지만 딱 보더라도 '블록체인의 사상과는 전혀 맞지 않는' 방식이다. 분산화 된 환경에서 각 Peer가 누구의 간섭도 없이 오직 스마트 컨트랙트만 의지해서 거래를 일으키는, DEX와 같은 경우에서는 전혀 사용할 수 없다.

무엇보다 거래의 과정을 투명하게 확인할 수 없다는 점에서도 문제다. 블록체인은 모든 사용자가 확인할 수 있도록 공개된 스마트 컨트랙트를 기반으로 거래가 발생한다는 특징이 있는데, 이 방법은 그러한 투명성이 보장되지 않는다. 

<br>

**방법 2. 별도의 스마트 컨트랙트를 활용하여 두 토큰 간의 거래를 일으킨다.**

이번 포스팅에서는 방법 2에 대해서 설명한다. 이를 위해서는 먼저 스마트 컨트랙트의 기능 중 call에 대해서 알고 있는 것이 좋으며, 이는 이전 포스팅 [Upgradable 스마트 컨트랙트란?](https://wnjoon.github.io/2022/10/24/blockchain-eth-upgradable/)을 참조하면 될 것이다.

간단하게 되짚어보면, call은 A 스마트 컨트랙트에서 B 스마트 컨트랙트 내부에 있는 함수를 원격으로 호출할 수 있도록 한다. 여기서 B 스마트 컨트랙트의 함수를 호출한 대상은 EOA가 아닌 A 스마트 컨트랙트가 된다. 

```
1. EOA -> A 스마트 컨트랙트 호출
2. A 스마트 컨트랙트 -> B 스마트 컨트랙트 호출
```

그렇다면 무엇을 근거로 본래 EOA의 소유였던 B 스마트 컨트랙트의 토큰을 A 스마트 컨트랙트가 거래할 수 있도록 할 수 있을까? 이를 위해서는 approval이라는 기능이 필요하다.

```solidity
contract ERC20 is Context, IERC20, IERC20Metadata {
    ...
    mapping(address => mapping(address => uint256)) private _allowances;
    ...
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }
    ...
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }
    ...
}
```

위의 ERC20 컨트랙트를 토대로, hardhat을 통해 해당 내용을 작성해보자.

```typescript
it('- Approve', async() => {
    await B.connect(EOA).approve(A.address, 30);
    expect (await B.allowance(EOA.address, A.address)).to.be.equal(30)
})
```

1. EOA는 approve 함수를 이용하여, A 스마트 컨트랙트가 B 스마트 컨트랙트에 있는 자신의 토큰의 일정 부분(30)을 거래할 수 있는 권한을 부여한다. 
2. B 스마트 컨트랙트의 allowance 함수를 호출하면, B 스마트 컨트랙트의 approve 결과로 allowances에 등록된 EOA의 주소와 A 스마트 컨트랙트의 주소 맵을 확인할 수 있다.

정리하면,
- 서로 다른 두 토큰의 거래를 위한 별도의 컨트랙트 작성
- 해당 컨트랙트가 각 토큰의 소유자들이 보유한 토큰을 거래할 수 있도록 approve 설정
- 해당 컨트랙트 내부에서 call을 이용하여 각 토큰을 소유자들에게 전달(교환)


<br>

## Swap 컨트랙트 구현

본 포스팅에서는 ERC20과 ERC1400 토큰을 서로 교환하는 별도의 Swap 컨트랙트를 만들고, 이를 테스트한다. ERC1400은 Consensys에서 만든 증권형 모델 기반의 토큰 컨트랙트로, ERC20과 유사하나 Partition이라는 개념이 추가되어 거래 가능 여부와 같은 기능단위로 전체 토큰을 분리시켜서 관리하는 등의 기능을 보유하고 있다.

```
contract Swap {

    address _owner;

    // 거래를 위한 TrasnferFrom 호출
    bytes4 private constant TRANSFER_FROM_FUNC =
        bytes4(keccak256("transferFrom(address,address,uint256)"));

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    event SwapSuccess(address indexed erc20Owner, uint256 erc20Amount, address indexed erc1400Owner, uint256 erc1400Amount);
    
    /*
     * ERC1400과 ERC20 교환
     */
    function swapToken(
        address erc20Token, address erc20Owner, uint256 erc20Amount, 
        address erc1400Token, address erc1400Owner, uint256 erc1400Amount
    ) public {

        require(msg.sender == _owner, "only owner can call swap");

        // send erc20 from erc20owner to erc1400owner
        (bool successCallTransferErc20, ) = erc20Token.call(
            abi.encodeWithSelector(
                TRANSFER_FROM_FUNC, 
                erc20Owner,
                erc1400Owner,
                erc20Amount
            )
        );
        require(successCallTransferErc20, "failed to transfer erc20");
        
        // send erc1400 from erc1400owner to erc20owner
        (bool successCallTransferErc1400, ) = erc1400Token.call(
            abi.encodeWithSelector(
                TRANSFER_FROM_FUNC, 
                erc1400Owner,
                erc20Owner,
                erc1400Amount
            )
        );
        require(successCallTransferErc1400, "failed to transfer erc1400");
        
        // Emit event
        emit SwapSuccess(erc20Owner, erc20Amount, erc1400Owner, erc1400Amount);
    }
}
```
- 각 토큰별로 Swap 컨트랙트를 spender로 지정하여 approve를 완료했다고 가정한다.
- 컨트랙트의 파라미터로 각 토큰의 주소, 소유자, 교환하고자 하는 양을 입력받는다.
- 모든 토큰이 정상적으로 거래되면, SwapSuccess 이벤트를 생성한다.

### transferFrom

Swap 컨트랙트는 TransferFrom을 이용하여 토큰을 전송한다. ERC20 기준으로 transferfrom은 아래와 같이 구성되어 있다.

```solidity
contract ERC20 is Context, IERC20, IERC20Metadata {
    ...
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    ...
}
```

transfer과 다른 점은, 해당 토큰을 전송하는 from을 별도로 명시한다는 점이다. EOA로부터 approve 받은 Swap 컨트랙트에서 거래를 일으키되, 실제 컨트랙트 상에는 각 토큰의 소유자로부터 전달되었다는 명시가 되어야하기 때문에 이를 사용한다.

```
bytes4 private constant TRANSFER_FROM_FUNC = 
    bytes4(keccak256("transferFrom(address,address,uint256)"));
```

<br>

## Hardhat을 이용한 테스트

- master: Swap 컨트랙트를 배포한 EOA
- user1 : erc20 소유자
- user2 : erc1400 소유자

```typescript
context('Swap contract test', async () => {
    it('- Approve 30 erc20 from user1 to swap contract', async() => {
        await erc20.connect(user1).approve(swap.address, 30);
        expect (await erc20.allowance(user1.address, swap.address)).to.be.equal(30)
    })
    it('- Approve 10 erc1400 from user2 to swap contract ', async() => {
        await erc1400.connect(user2).approve(swap.address, 10);
        expect (await erc1400.allowance(user2.address, swap.address)).to.be.equal(10)
    })
    it('- Swap', async() => {
        await expect (swap.connect(master)
        .swapToken(erc20.address, user1.address, 20, erc1400.address, user2.address, 10))
        .to.emit(swap, "SwapSuccess")
        .withArgs(user1.address, 20, user2.address, 10);

        // check allowance
        expect (await erc20.allowance(user1.address, swap.address)).to.be.equal(10);
        expect (await erc1400.allowance(user2.address, swap.address)).to.be.equal(0);
    })
})
```

위의 테스트코드를 보면 Swap 컨트랙트가 user1의 erc20에 대해 approve된 내역은 30이지만, 실제 거래된 양은 20임을 볼 수 있다. 이는 approve된 이후 해당 컨트랙트의 allowances에 등록된 '승인된 양'보다 같거나 작은 경우에 대해서는 승인된 spender가 얼마든지 처리해도 좋도록 컨트랙트가 구현되어 있기 때문이다.

위에서 ERC20의 _transferFrom 내부에 있는 _spendAllowance를 확인하면 아래와 같다.

```
function _spendAllowance(
    address owner,
    address spender,
    uint256 amount
) internal virtual {
    uint256 currentAllowance = allowance(owner, spender);
    if (currentAllowance != type(uint256).max) {
        require(currentAllowance >= amount, "ERC20: insufficient allowance");
        unchecked {
            _approve(owner, spender, currentAllowance - amount);
        }
    }
}
```

<br>

## Github

[tiny-blockchain-app : smartcontract/solidity](https://github.com/wnjoon/tiny-blockchain-app/tree/master/smartcontract/solidity)

<br>

## 참고자료

- [Upgradable 스마트 컨트랙트란?](https://wnjoon.github.io/2022/10/24/blockchain-eth-upgradable/)