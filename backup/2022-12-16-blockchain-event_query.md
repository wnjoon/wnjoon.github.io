---
layout: post
title:  "이더리움에서 발생하는 이벤트 조회 어플리케이션 만들기" 
excerpt: "이더리움에서는 이벤트라는 도구를 통해 스마트 컨트랙트로부터 발생한 결과를 외부로 전달한다. 그렇기 때문에 특정 시간대에 대한 이벤트를 조회하거나, 혹은 이벤트를 계속해서 구독하는 어플리케이션은 이더리움의 모니터링을 위해 꼭 필요하다고 볼 수 있다. 이번 포스팅에서는 이벤트에 대해 간략히 알아보고, 이를 조회하는 어플리케이션을 golang으로 직접 만들어본다."
date:   2022-12-16 15:00:00 +0900
categories: blockchain
tags: [ethereum, smart contract, event, golang]
---

<br>

## 이더리움에서 말하는 이벤트란?

먼저 정의하자면, 이더리움에서 말하는 이벤트는 '로그(log)'를 의미한다. 이더리움에서 트랜잭션이 발생하면, 해당 트랜잭션이 성공하거나 실패하거나 상관없이 트랜잭션 영수증(receipt)을 발행한다. 이 영수증에는 트랜잭션이 실행되는 동안 발생한 여러 상황들에 대한 로그들이 포함되어 있는데, 이벤트는 이러한 로그들을 객체화한 내용이라고 보면 된다.

아래에는 Openzeppelin에서 제공하는 ERC20 인터페이스 내에 정의되어 있는 이벤트를 보여준다. 

[IERC20.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol)  
```solidity
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    ...
}
```

위의 내용을 보면 직관적으로 Transfer 이벤트는 transfer 행위가 이루어질 때 발생하는 것이라고 추측할 수 있다. 이벤트는 스마트 컨트랙트 내에서 emit이라는 키워드를 이용하여 발생시킬 수 있다. 아래는 실제 ERC20 구현 컨트랙트에서 transfer를 실행할 때 Transfer 이벤트를 발생시키는 것을 보여준다. 

<br>

> indexed : 솔리디티 내에서 특정 타입의 이벤트들은 인덱싱 처리될 수 있다. 데이터베이스에서 인덱스화 하는 것과 같은 논리인데, 전체 검색 결과 중 특정 조건에 맞는 내용들만 빠르게 필터링 할 수 있도록 지원한다. indexed 키워드가 붙어있는 값은 이벤트 조회 조건으로 사용할 수 있다. 

<br>

IERC20.sol에서 정의한 Transfer 이벤트에 맞게 파라미터를 세팅해서 emit과 함께 호출하면, 실제 _transfer 함수를 통해 트랜잭션이 발생할 때 해당 이벤트가 트랜잭션 영수증의 log 부분에 들어가게 된다.

[ERC20.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)  
```solidity
contract ERC20 is Context, IERC20, IERC20Metadata {
    function _transfer(address from, address to, uint256 amount) 
    internal virtual {
        ...
        emit Transfer(from, to, amount);
        ...
    }
}
```

실제로 web3js를 이용해 transfer 트랜잭션을 날리고, 이에 대한 영수증을 받아오면 아래와 같이 출력된다. 아래는 Hardhat을 이용하여 transfer를 테스트한 코드의 일부분과, 그 하단에 테스트에 대한 결과를 보여준다.

[erc20.test.ts]()

```typescript
// Test 스크립트
context('Transfer', async () => {
    it('- Transfer tokens from user1 to user2', async() => {
        const tx = await erc20Token.transfer(user2.address, 3000)
        const receipt = await tx.wait();
        console.log("Transaction Receipt : ", receipt)
    })        
})

// Test 결과 => console.log("Transaction Receipt : ", receipt)
Transaction Receipt :  {
  to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  contractAddress: null,
  transactionIndex: 0,
  gasUsed: BigNumber { _hex: '0xd667', _isBigNumber: true },
  logsBloom: '0x00000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000840000000000000000100000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000042000000200000000000000000000000002000000000000000000000000000000000000000000000000000000001000000000000000000000000000000',
  blockHash: '0x2d8ea364a263dde1bd8d3fe570d7200c36466787fb2b43b0969e1ae84ab0f14e',
  transactionHash: '0x4fa1ef1271b5de3cfa4b0b2ae8519aa01d0ae20fff1a2649b8f2b3fec66f9356',
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 3,
      transactionHash: '0x4fa1ef1271b5de3cfa4b0b2ae8519aa01d0ae20fff1a2649b8f2b3fec66f9356',
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000bb8',
      logIndex: 0,
      blockHash: '0x2d8ea364a263dde1bd8d3fe570d7200c36466787fb2b43b0969e1ae84ab0f14e'
    }
  ],
  blockNumber: 3,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { _hex: '0xd667', _isBigNumber: true },
  effectiveGasPrice: BigNumber { _hex: '0x83a3860c', _isBigNumber: true },
  status: 1,
  type: 2,
  byzantium: true,
  events: [
    {
      transactionIndex: 0,
      blockNumber: 3,
      transactionHash: '0x4fa1ef1271b5de3cfa4b0b2ae8519aa01d0ae20fff1a2649b8f2b3fec66f9356',
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000bb8',
      logIndex: 0,
      blockHash: '0x2d8ea364a263dde1bd8d3fe570d7200c36466787fb2b43b0969e1ae84ab0f14e',
      args: [Array],
      decode: [Function (anonymous)],
      event: 'Transfer',
      eventSignature: 'Transfer(address,address,uint256)',
      removeListener: [Function (anonymous)],
      getBlock: [Function (anonymous)],
      getTransaction: [Function (anonymous)],
      getTransactionReceipt: [Function (anonymous)]
    }
  ]
}
```

events라는 항목 아래에 Transfer 이벤트 호출에 대한 결과가 들어있음을 볼 수 있다. data에 보면 amount로 보낸 3000이 16진수인 bb8로 변환되어 추가되어 있음을 볼 수 있다.

다음부터는 해당 항목을 블록 구간, 스마트 컨트랙트, 이벤트 이름 등에 따라 선택적으로 조회하거나 이를 실시간으로 구독할 수 있는 어플리케이션을 직접 만들고 테스트 해보려고 한다.

<br>

## 이벤트 어플리케이션 설계

### 1. abigen을 이용해 자동으로 생성되는 조회 기능

실제 abigen을 이용해서 solidity로 개발된 스마트 컨트랙트를 golang으로 변환하면, 해당 컨트랙트에서 조회할 수 있는 이벤트가 자동으로 golang 형태로 생성되는 것을 볼 수 있다. 

```go
func (_ERC20Burnable *ERC20BurnableFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address) (*ERC20BurnableTransferIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _ERC20Burnable.contract.FilterLogs(opts, "Transfer", fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &ERC20BurnableTransferIterator{contract: _ERC20Burnable.contract, event: "Transfer", logs: logs, sub: sub}, nil
}
```

위의 예시를 보면, ERC20Burnable이라는 컨트랙트에서 발생한 Transfer라는 이벤트에 대한 내역을 indexed가 붙은 조건(from, to)에 맞게 필터링해서 반환해주는 것을 볼 수 있다. 이 외에도 컨트랙트 내에 선언한 모든 이벤트에 대한 조회, 심지어 구독까지도 자동으로 코드화하여 지원해주고 있다.


### 2. abigen으로 만들어진 코드를 사용할 때의 한계점

하지만 위의 방법은 아래와 같은 한계점을 갖고 있다.
1. 사용자가 해당 컨트랙트를 abigen한 결과인 golang 형태의 파일을 갖고 있어야 한다.
2. 사용자는 정해진 틀 안에서만 해당 이벤트를 구독할 수 있다. 
3. 사용자가 indexed 된 파라미터를 통해 검색 조건을 설정하고자 하는 경우, 해당 파라미터의 타입까지 명확하게 전달된 내역에 대해서만 이벤트 조회를 할 수 있다.

필자가 만들어보고 싶은 이벤트 구독, 조회 어플리케이션은 아래와 같이 동작할 것이다.
1. 사용자는 문자열 형태로 전달받은 컨트랙트의 ABI만을 가지고 이벤트를 조회할 수 있다. 
2. 사용자는 이벤트에 필요한 파라미터의 순서까지 알 필요는 없다. 다만 무슨 파라미터가 있는지는 알아야 한다.
3. 사용자는 indexed된 파라미터의 타입까지 알 필요가 없다. 모든 조회 조건 값들은 문자열로 전달되며, 어플리케이션 내부에서 해당 값을 알아서 타입 전환(convertion)해서 전달한다.

<br>

### 3. 이벤트 구독, 조회 순서

이벤트를 조회하느냐 구독하느냐의 차이는 <u>실시간 + 지속적인 조회인지의 여부</u>에 따라 나뉘어진다. 결국 모든 과정은 동일하나, 실시간으로 계속 보여줘야 하는 구독의 경우 go routine을 활용하는 차이가 존재한다. 

그 외에는 아래처럼 동일한 순서를 거친다.
1. 전달받은 내용을 가지고 쿼리문 작성 (ethereum.FilterQuery)
2. 쿼리문에 검색 조건에 맞는 Topic 설정
    - 검색하고자 하는 이벤트가 정해져있다면, 해당 이벤트의 signature 등록
    - 필터링하고자 하는 indexed 조건이 있다면, 해당 조건을 등록
    - 등록된 전체 내용을 해싱한 후, 쿼리문에 등록
3. 구독 또는 조회에 따라 분기
    - 구독 : 쿼리문에 해당하는 내용이 이더리움으로부터 이벤트로 발생하는 경우, 이를 go 채널로 전달
    - 조회 : 쿼리문에 해당하는 내용을 이더리움에서 발생했던 이벤트로부터 찾은 후, 이를 반환

<br>

## 이벤트 어플리케이션 개발 과정

### 1. 전체적인 구조

![image](https://user-images.githubusercontent.com/39115630/209032140-34428b29-d813-48ec-b559-e434d2b49c32.png)  
*@그림 1 : 이벤트 구독 어플리케이션의 간략한 도식*

- [event_factory.go](https://github.com/wnjoon/tiny-blockchain-app/blob/master/app/pkg/blockchain/event/event_factory.go) : 이벤트를 구독 또는 조회할 때 필요한 공통적인 값을 포함한 객체를 만든다. 해당 객체를 이용해서 이벤트 조회 모듈 또는 구독을 위한 객체를 만든다.

- [event_manager.go](https://github.com/wnjoon/tiny-blockchain-app/blob/master/app/pkg/blockchain/event/event_manager.go) : 이벤트 구독, 조회를 위한 객체를 만든다. 그리고 해당 기능을 수행하기 위한 함수 및 세부 기능 함수를 수행한다.
    - EventSubscriber : 이벤트 구독을 위한 객체
    - EventHistoryFinder : 이벤트 조회를 위한 객체
    - EventRequest : 이벤트 구독 또는 조회를 요청할 때 필요한 데이터 및 조건을 포함하는 객체
    - EventDescription : 이벤트 이름 및 조회 조건을 포함하는 객체
    - EventResponse : 이벤트 구독 또는 조회에 대한 응답 값을 나타내는 객체

<br>

### 2. 조회 요청 객체 만들기

본 어플리케이션에서는 EventRequest라는 객체를 이용하여 조회하고자 하는 컨트랙트, 그리고 세부 이벤트의 내용을 정의한다.

```go
type EventRequest struct {
	ABI       abi.ABI
	Addresses []common.Address
	Events EventDescription 
}

type EventDescription struct {
	Name  string
	Rules map[string][]interface{}
}
```
- EventRequest
    - ABI : 컨트랙트의 ABI
    - Addresses : 컨트랙트가 배포된 주소들
    - Events : 이벤트 세부 내용 (없으면 모든 이벤트 조회, 구독 시 사용)
        - Name : 이벤트 이름
        - Rules : 세부 조건 

<br>

> 향후 계획으로는 Events에 2개 이상의 이벤트를 넣어서 한번의 조회로 다수의 이벤트를 동시에 관리하는 것이 목표이다. 이번 문서에서는 하나의 조회 당 하나의 이벤트만을 처리하는 것으로 작성하였다. 

<br>

만약 Transfer(address indexed from, address indexed to, uint256 value)에 대한 세부 조건을 정의한다고 할 경우, 아래와 같을 것이다.

```go
desc := EventDescription {
    Name: "Transfer",
    Rules: map[string][]interface{}{
        "from": {"0xa11c095c7262e0f1c001c397dfb288cc2c1c516b"},
        "to": {"0x9ade886ede77a25501a404f5b38430819971f65b"},
    },
}
```

### 3. ABI 파일을 이용하여 이벤트 가져오기

ABI(Application Binary Interface)에 대해서는 [아래 참고자료에 있는 내용](https://medium.com/pocs/ethereum-abi와-관련된-q-a-정리-40e639ee1a03)을 읽어보면 도움이 될 것이다. 이더리움의 입장에서 이를 간략하게 설명하면, 컨트랙트 내의 함수를 호출하거나 컨트랙트로부터 데이터를 읽어오기 위하여 사용하는 인터페이스로 보면 된다.

실제로 퍼블릭과 프라이빗에 무관하게 이더리움과 스마트컨트랙트 간 통신을 하려면 ABI가 필요하다. abigen을 통해 golang 형식의 파일이 만들어졌다 하더라도, 파일 내부에 ABI가 존재하고 이를 사용한다.

아래에 작성한 모든 내용에 대한 자세한 구현 결과는 아래 [깃헙](#github)에서 확인하면 된다.

#### **3.1. 문자열 형태의 ABI 변환하기**

ABI 파일을 다루기 위해서는 abi.ABI 형태로 변환해야 한다. 본 어플리케이션은 '특정 컨트랙트에 대한 ABI 파일을 외부로부터 문자열 형태로 받아서 처리'하는 것이 목적이기 때문에, 별도의 변환과정이 필요하다. 다행스럽게도, go-ethereum에서는 간단하게 변환할 수 있는 방법을 제공한다.

```go
var abiString string = "....."
contractABI, err := abi.JSON(strings.NewReader(string(abiString)))
```

abiString을 abi.JSON으로 디코딩하면, ABI 타입의 구조체로 해당 내용을 받아오게 된다. 

```go
type ABI struct {
	Constructor Method
	Methods     map[string]Method
	Events      map[string]Event
	Errors      map[string]Error
    Fallback Method
	Receive  Method
}
```

사용자는 Events에 담긴 내용을 가지고 컨트랙트에 어떠한 이벤트가 어떠한 내용으로 정의되어 있는지에 대해 확인할 수 있다.

#### **3.2. ABI에서 특정 이벤트에 대한 내용 반환하기**

이제 abi.ABI 형태로 변환된 ABI에서 특정 이벤트에 대한 정보를 가져와야 한다. 위에서 설명한 것 처럼, ABI 구조체의 Events 맵 안에 모든 이벤트들이 정의된다. 

단 맵의 구조이기 때문에, 실제 이벤트에서 정의하는 파라미터의 순서가 그대로 유지될 수는 없다. 그렇기 때문에 abiInput이라는 구조체를 만들고, ABI 문서의 순서에 맞게 이벤트 내의 파라미터를 담고 있도록 한다.

```go
type abiInput struct {
	Indexed bool
	Type    string
	Name    string
}

...

func getEventAbiInput(abi abi.ABI, event string) []abiInput {
	inputs := abi.Events[event].Inputs
	eventConstruct := make([]abiInput, len(inputs))

	for i, input := range inputs {
		eventDescription := abiInput{
			Indexed: input.Indexed,
			Type:    input.Type.String(),
			Name:    input.Name,
		}
		eventConstruct[i] = eventDescription
	}
	return eventConstruct
}
```

#### **3.3. 조건에 맞는 이벤트 쿼리문 생성하기**

ABI를 통해 검색하고자 하는 이벤트의 명세를 확인하고 이를 abiInput으로 저장했다면, EventRequest로부터 전달된 검색 조건을 확인해서 이를 이더리움에서 이벤트를 검색할 수 있도록 하는 쿼리 형태(ethereum.FilterQuery)로 만들어야 한다.

```go
type FilterQuery struct {
	BlockHash *common.Hash 
	FromBlock *big.Int
	ToBlock   *big.Int
	Addresses []common.Address
	Topics [][]common.Hash
}
```

FilterQuery에 대한 내용 중 이벤트 조회 조건에 필요한 내용을 간략하게 살펴보면 다음과 같다.

- FromBlock : 조회 시작 블록번호. 값이 없으면 0번.
- ToBlock : 조회 끝 블록번호. 값이 없으면 최신 블록.
- Addresses : 해당 컨트랙트가 배포된 모든 주소를 배열 형태로 받는다.
- Topics : 컨트랙트의 이벤트 시그니터 및 이벤트를 조회하기 위한 조건을 담는다.

여기서 중요한건 Topics 부분인데, 검색 조건은 아래와 같다. 

![image](https://user-images.githubusercontent.com/39115630/209061806-fdca1bcb-fa35-4851-97e0-1498c613912d.png)  
*@그림 2 : 이벤트 구독에 사용될 토픽의 검색 조건 설정 방식*

<br>

> 여기서 n번째 파라미터란 특정 이벤트에서 출력되는 파라미터의 순서를 의미한다. 예를 들어 Transfer(address indexed from, address indexed to, uint256 value)의 경우 첫번째는 from, 두번째는 to이다. 세번째 값인 value는 indexed 되어있지 않기 때문에, 검색 조건으로 사용할 수 없다.

<br>

이제 EventRequest로 정의된 이벤트 요청 내역과 ABI로부터 받아온 특정 이벤트의 내용을 비교하면서, 순서에 맞게 검색 조건 값들을 설정하면 된다. 검색 조건 맨 윗부분과 같이, 내용이 없다는 것은 전체 또는 해당 파라미터에 대해서는 조건 없이 모두 반환하라는 의미이기 때문에 이를 확인하면서 값을 채워나갔다.

```go
func queryRequest(r EventRequest, from, to *big.Int) (ethereum.FilterQuery, error) {
	addresses := make([]common.Address, 0)
	addresses = append(addresses, r.Addresses...)

	query := ethereum.FilterQuery{
		Addresses: addresses,
		FromBlock: from,
		ToBlock:   to,
	}

	// Events에 아무런 값이 없는 경우 -> 모든 값을 조회 = query.Topics = nil
	// Events에 단 하나라도 조건이 있는 경우 -> Topic 필터링
	if !reflect.ValueOf(r.Events).IsZero() {
		topics, err := filterTopics(r.ABI, r.Events)
		if err != nil {
			return ethereum.FilterQuery{}, err
		}
		query.Topics = topics
	}

	return query, nil
}

...

func filterTopics(contractAbi abi.ABI, d EventDescription) ([][]common.Hash, error) {

	// ethereum.FilterQuery와 동일한 형태의 인터페이스 타입 배열 생성
	totalRules := make([][]interface{}, 0)
	// ABI 문서로부터 이벤트 내에 파라미터의 순서에 맞게 이름, 타입 반환
	abiInputs := getEventAbiInput(contractAbi, d.Name)

	for _, input := range abiInputs {
		if d.Rules != nil {
			// Indexed => 검색 조건으로 사용 가능한 파라미터라면
			if input.Indexed {
				rules := make([]interface{}, 0)
				item, exist := d.Rules[input.Name]
				if exist {
					// [중요!] 타입을 변경해주어야 한다.
					// 3.4에서 설명
					typedRule := typeConverter(input.Type, item)
					rules = append(rules, typedRule...)
				}
				totalRules = append(totalRules, rules)
			}
		}
	}
	result := append([][]interface{}{{contractAbi.Events[d.Name].ID}}, totalRules...)

	// 2차원 인터페이스 배열을 common.Hash 타입의 2차원 배열로 변경
	topics, err := abi.MakeTopics(result...)
	if err != nil {
		return nil, err
	}
	return topics, nil
}
```

이더리움에서 이벤트에 대한 검색 조건은 모두 common.Hash 값으로 변경되어서 전달된다. abi 라이브러리에서 제공되는 MakeTopic를 이용하면, 해당 값의 타입에 맞게 해시값이 자동으로 생성되기 때문에 편리하게 변경할 수 있다.

#### **3.4. 타입 변경**

위의 filterTopics 함수에 보면 typeConverter를 호출하는 것을 볼 수 있다. 실제로 이벤트 조회에 사용 가능한 값들의 타입은 다양한데, [위에서 설명한대로 abigen을 이용한 파일에서는 해당 파라미터를 지정된 타입에 맞게 주입하도록 되어있다](#1-abigen을-이용해-자동으로-생성되는-조회-기능). 

하지만 본 어플리케이션에서는 모든 조건 파라미터를 문자열로 받고, 이를 타입에 맞게 변경해주는 방식을 적용하려고 하기 때문에 문자열로 전달된 값을 실제 타입에 맞게 변경해주어야 한다. 모든 타입에 맞게 변경하는 작업은 추후에 진행하도록 하고, 이번 포스팅에서는 가장 많이 사용되는 <u>주소 값(common.Address)</u>인 경우에 대해서만 타입의 변환을 진행하려고 한다.

```go
func typeConverter(ruleType string, rules []interface{}) []interface{} {
	convertedRules := make([]interface{}, 0)
	for _, rule := range rules {
		str := fmt.Sprintf("%v", rule)
		switch ruleType {
		case "string":
			rule = str
		case "address":
			rule = common.HexToAddress(str)
		case "hash":
			rule = common.HexToHash(str)
		case "bool":
			rule, _ = strconv.ParseBool(str)
		}
		convertedRules = append(convertedRules, rule)
	}
	return convertedRules
}
```

filterTopics 함수 내에 abiInputs := getEventAbiInput(contractAbi, d.Name) 부분을 통해 생성된 이벤트 내역서에는 각 파라미터의 타입 또한 명시되어 있다. 이를 확인해서 해당 타입에 맞게 문자열을 변환시켜주도록 하였다.

#### **3.5. 과거 이력 조회(History) 또는 구독(Subscribe)**

두 기능 모두 이벤트를 조회하는 행위지만, 하나는 과거의 이력을 조회하고 나머지 하나는 실시간으로 조회하는 차이가 존재한다. 이를 간략하게 정리해보면 아래와 같다.

|분류|설명|사용 함수 및 기능|
|------|---|---|
|History|과거 이벤트 이력 조회|- ethClient의 FilterLogs|
|Subscribe|실시간으로 계속 이벤트 조회|- ethClient의 SubscribeFilterLogs<br>- go routine|

<br>

> 본 포스팅에서는 Subscribe에서 사용되는 go routine에 대해 자세히 다루지는 않지만, 간략하게 설명하면 '특정 데이터의 교환을 위한 별도의 채널을 만들어서, 프로그램 전체 또는 채널의 종료가 있기 전까지는 계속해서 데이터를 교환하도록 하는 방법'을 사용한다. 또 다른 말로는 '쓰레드(thread)'라고 하는데, golang에서는 이를 다른 언어에 비해 <u>매우 간단한 방법</u>으로 구현할 수 있다.

<br>

자세한 구현 결과는 아래 [깃헙](#github)에서 확인하면 된다.

#### **3.6. Pretty한 결과 값 반환**

3.5에서 조회된 결과값은 [types.Log](https://pkg.go.dev/github.com/ethereum/go-ethereum@v1.10.17/core/types#Log) 형태로 반환된다.


```go
type Log struct {
	Address common.Address `json:"address" gencodec:"required"`
	Topics []common.Hash `json:"topics" gencodec:"required"`
	Data []byte `json:"data" gencodec:"required"`
	BlockNumber uint64 `json:"blockNumber"`
	TxHash common.Hash `json:"transactionHash" gencodec:"required"`
	TxIndex uint `json:"transactionIndex"`
	BlockHash common.Hash `json:"blockHash"`
	Index uint `json:"logIndex"`
	Removed bool `json:"removed"`
}
```

하지만 조금 더 편리한(?) 가독성을 위해 EventResponse라는 객체에 해당 내용을 다시 재조합해서 담아 이를 반환한다. getEvent 함수에서 abi에서 명시한 이벤트의 파라미터 순서에 따라 결과값을 분류하고, UnpackIntoMap 함수로 맵의 형태로 만든 다음 EventReponse 객체에 필요한 값을 넣어서 반환한다. 

자세한 구현 결과는 아래 [깃헙](#github)에서 확인하면 된다.

<br>

## Github

[tiny-blockchain-app : app/pkg/blockchain/event](https://github.com/wnjoon/tiny-blockchain-app/tree/master/app/pkg/blockchain/event)

<br>

## 참고자료

- [Ethereum:: ABI와 관련된 Q&A 정리 - Denver](https://medium.com/pocs/ethereum-abi와-관련된-q-a-정리-40e639ee1a03)
- [Subscribing to Event Logs - goethereumbook](https://goethereumbook.org/event-subscribe/)
- [Reading Event Logs - goethereumbook](https://goethereumbook.org/event-read/)
- [Reading ERC-20 Token Event Logs - goethereumbook](https://goethereumbook.org/event-read-erc20/)