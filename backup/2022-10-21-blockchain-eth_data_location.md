---
layout: post
title:  "Storage, Memory, Calldata의 차이" 
excerpt: "솔리디티에서 레퍼런스 타입 변수를 선언할 때에는 데이터 위치(storage, memory, calldata)를 꼭 명시해야 한다. 상태 변수의 변경이 블록체인에 저장되어야 한다면 storage 키워드를 사용하고, 블록체인으로의 상태 변수 업데이트가 필요 없다면 memory, calldata를 사용한다. 단 변수 값의 수정이 이루어지지 않는 단순 읽기만 요구된다면, 가스비 절약을 위해서라도 calldata를 사용하는 것이 더 바람직하다."
date:   2022-10-21 15:00:00 +0900
categories: blockchain
tags: [ethereum, solidity]
---

<br>

## 레퍼런스(Reference) 타입 변수

다이나믹(Dynamic) 타입이라고도 불리는데, 솔리디티에서 사용하는 데이터의 위치(location)을 명시하지 않으면 컴파일 과정에서 에러를 발생시킨다. 레퍼런스 타입은 아래와 같다.

- Array (솔리디티에서는 bytes, string 타입을 special array로 취급한다)
- Struct
- Mapping 

<br>

## 데이터 위치(location)

**Storage**
- 모든 상태 변수를 저장한다. 즉, 블록체인에 저장되는 데이터는 모두 Storage에 저장된다.

**Memory**
- 함수 호출(External) 과정에 휘발성으로 존재하는 데이터를 잠시 저장하는 곳이다.
- 수정이 가능하다.

**Calldata**
- 함수 호출 시 파라미터에 포함되는 데이터를 잠시 저장하는 곳이다. 
- 수정이 불가능하다.

<br>

## 예시

```solidity
contract sample {
    uint public a;
    uint public b;

    struct MyStruct {        
        string val;
    }

    mapping(address => MyStruct) public myStructList;

    // (1)
    function setVariable(address _address, string calldata _val) external {
        // (2) 
        MyStruct storage ms = myStructList[_address];
        ms.val = _val;
    }

    // (3)
    function getVariable(address _address) external view returns (string memory) {
        return myStructList[_address].val;
    }
}
```

- (1) : 파라미터로 전달된 _val 값을 그대로 받아서 변경 없이 새롭게 만들어진 MyStruct에 넣는다. 그렇기 때문에 수정이 불가능한 calldata 키워드를 사용한다.
- (2) : myStructList 상태 변수를 변경하기 위해 storage 키워드 사용한다. memory 키워드를 사용하게 되면 myStructList 데이터를 복사해서 사용하기 때문에, 실제 myStructList 내부의 값은 절대 변하지 않는다.
- (3) : 값의 return에 memory 키워드를 사용한다. 어차피 myStructList 내부 값을 변경하는 것이 아니기 때문에, 상태 변수에 변화를 주지 않는 memory 키워드를 사용하면 된다. 사실 값을 그대로 받아다가 변경하지 않고 반환하기 때문에, calldata를 사용해도 무방하다.

<br>

## calldata와 memory의 동작 차이

왜 calldata와 memory가 모두 블록체인에 데이터를 저장하지 않으면서 누구는 변경이 가능하고 누구는 불가능한 것일까? memory 키워드로 데이터를 가져올 경우의 순서를 살펴보면 이해하기 쉽다.

1. calldata 형태로 데이터를 가지고 온다.
2. 새로운 memory에 데이터를 복사한다.
3. memory 형태의 데이터를 전달한다.

솔리디티에서 함수를 통해 전달되는 모든 파라미터는 트랜잭션 내 Data field에 포함되는데, 이 부분은 함수 호출에 필요한 데이터들(function identifier, argument 등)이 포함되기 떄문에 일반적으로 input data, 또는 calldata 등으로 부른다.

즉 <u>calldata 키워드의 의미는 Data field에 포함된 데이터를 그대로 사용하겠다는 말이고, memory 키워드는 Data field를 통해 가져온 데이터에 대한 복사본을 만들어서 사용하겠다는 말</u>이 된다.

사실 복사본을 사용한다는 말은 자연스럽게 가스비 증가를 의미하게 된다. 그러므로 데이터의 변경이 없을 것 같은 경우에는 calldata 키워드를 사용하는것이 무분별한 memory 키워드 사용보다는 더 좋을 것이다.

<br>

## 추가 (2023.02.23)

```solidity
mapping(uint256 => Order) _orders;
...
function getOrder(uint256 id) external view returns (Order calldata) /* <- Return에 calldata 사용 */{
    return _orders[id]; /* <- 오류 발생 */
}
```

위의 예시처럼 함수의 리턴에 calldata를 사용하면 오류가 발생한다.

```sh
Return argument type struct MatchingEngine.Order storage ref is not implicitly convertible to expected type (type of first return variable) struct MatchingEngine.Order calldata.
```

확인 결과([StackExchange](https://ethereum.stackexchange.com/questions/117770/how-to-use-calldata-return-values-in-solidity-and-when-are-they-useful)), calldata는 input 파라미터로만 적용 가능하며 return 값에서는 사용이 불가능하다. 그러므로 Return 값에서는 memory를 사용하자.

<br>


## 요약

포스팅을 다시 요약해보면,
- 레퍼런스 타입 변수는 선언 시 데이터 위치(storage, memory, calldata)를 꼭 명시해야 한다.
- 상태 변수의 변경이 블록체인에 저장되어야 한다면 storage 키워드를 사용한다.
- 블록체인으로의 상태 변수 업데이트가 필요 없다면 memory, calldata를 사용한다. 단 변수 값의 수정이 이루어지지 않는 단순 읽기만 요구된다면, 가스비 절약을 위해서라도 calldata를 사용하는 것이 더 바람직하다.
- (추가) calldata는 함수의 리턴값에서는 사용할 수 없다. 오직 인풋 파라미터에서만 사용가능하다.

<br>

## 참고자료

- [Data Locations - Storage, Memory and Calldata](https://solidity-by-example.org/data-locations/)
- [은근 헷갈리는 Data Location - Solidity 씨-리즈](https://medium.com/@aiden.p/solidity-%EC%94%A8-%EB%A6%AC%EC%A6%88-%EC%9D%80%EA%B7%BC-%ED%97%B7%EA%B0%88%EB%A6%AC%EB%8A%94-data-location-2690cefb72db)
- [Storage vs Memory vs Calldata - YBM](https://medium.com/coinmonks/solidity-storage-vs-memory-vs-calldata-8c7e8c38bce)
- [How to use calldata return values in Solidity and when are they useful? - StackExchange](https://ethereum.stackexchange.com/questions/117770/how-to-use-calldata-return-values-in-solidity-and-when-are-they-useful)
