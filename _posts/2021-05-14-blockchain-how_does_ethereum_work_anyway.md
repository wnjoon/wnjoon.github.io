---
layout: post
title:  "How does Ethereum work, anyway?"
excerpt: "Preethi Kasireddy의 'How does Ethereum work, anyway?'를 읽고 나름 번역해본 내용을 기술한다."
date:   2021-05-14 15:00:00 +0900
categories: blockchain
tags: [ethereum, 번역]
---

<br>

## 블록체인에 대한 정의

*Blockchain definition*

블록체인은 <u>"Cryptographically secure transitional singleton machine with shared-state"</u> 로 정의된다.

- Cryptographically secure: 깨기 어려운 복잡한 수학적 알고리즘을 기반으로 암호화폐가 생성된다.
- Transitional singleton machine: 정상적으로 생성된 하나의 객체는 시스템 상에서 생성되는 모든 트랜잭션에 대해 책임을 가지며, 이는 모든 구성원으로부터 신뢰받는 global truth를 생성한다.
- With shared-state: 저장되는 모든 상태(state)는 구성원 모두에게 공유되고 공개된다.

<br>

## 이더리움 블록체인의 패러다임

*The Ethereum blockchain paradigm explained*  
> 패러다임: 한 시대의 사람들의 견해나 사고를 근본적으로 규정하고 있는 인식의 체계. 또는, 사물에 대한 이론적인 틀이나 체계 - 구글 사전

이더리움은 트랜잭션에 기반한 state machine으로, state machine이란 일련의 정보들을 기반으로 state가 변경(이동)되는 시스템을 의미한다.

![image](https://user-images.githubusercontent.com/39115630/144012547-5cf1c87a-31bb-4054-9cf3-8ed46a24d290.png)  
*@그림 1: Transaction-based state machine의 예시 - 출처: Preethi Kasireddy*

이더리움의 state machine은 제네시스(genesis)라는 state에서부터 출발한다. 제네시스는 비어있는 공간, 즉 네트워크 상에서 어떠한 트랜잭션도 발생하지 않은 최초의 상태를 의미한다.

![image](https://user-images.githubusercontent.com/39115630/144012765-c8b1ec57-727c-48ba-ba30-4eb5eaf50996.png)  
*@그림 2: Genesis에서부터 출발하는 이더리움의 상태 - 출처: Preethi Kasireddy*

이더리움에서 하나의 state는 블록 단위로 구성되며, 블록은 수백만개의 트랜잭션들로 이루어진다. 각 블록은 이전의 블록들과 연결된 구조를 갖는다.

![image](https://user-images.githubusercontent.com/39115630/144012856-fdba3176-4fe4-4f57-9dfe-ca80a038cbf1.png)  
*@그림 3: 여러개의 트랜잭션으로 구성된 블록의 형태 - 출처: Preethi Kasireddy*

하나의 state에서 다음의 state로 넘어간다는 것은, 새로운 블록이 생성되어 이전의 블록과 연결되는 것을 의미한다. 이를 위해서는 트랜잭션이 유효(valid)하다는 판별 과정과 채굴(mining)이라는 증명 과정이 필요하다.  
<u>채굴은 노드(Node)라 불리는 개인 또는 집단이 그들의 컴퓨팅 자원을 활용(지불)하여 유효한 트랜잭션을 하나의 블록으로 생성하는 과정</u>을 의미한다. 이더리움과 같은 퍼블릭(Public) 블록체인에서는 누구나 채굴자 노드가 되어 블록을 생성하고 입증하는 과정에 참여할 수 있다. 블록을 생성하는 과정에서 가장 빠르게 수학적인 문제를 증명한 채굴자가 블록을 생성할 수 있는 명예(?)를 얻는데, 이와 같이 가장 빠르게 수학적인 증명을 완료한 채굴자에게 토큰을 보상하는 방식을 PoW(Proof of Work, 작업증명)라고 한다.  
채굴자는 수학적 해결에 대한 보상으로 전자 토큰을 부여받는다. 이더리움에서는 이러한 토큰의 단위를 Ether라고 한다. 

![image](https://user-images.githubusercontent.com/39115630/144014212-49061e55-bd15-4224-b197-220b2416216c.png)
*@그림 4: 여러개의 체인으로 구성되는 이더리움 네트워크 - 출처: Preethi Kasireddy*

블록의 생성 과정은 실시간이며 복잡하기 때문에, 하나의 시스템에 다수의 체인과 state가 존재할 수 있다. 이 중 가장 신뢰할 수 있는 하나의 체인을 올바르게 선택할 수 없다면, 시스템은 신뢰를 잃을 것이고 문제가 발생할 것이다.  
위의 그림과 같이 체인의 분기(fork)가 총 3번 일어났을 때, 한명의 사용자가 A체인에서는 10코인을, B체인에서는 20코인을, C체인에서는 30코인을 소유하고 있다고 가정하자. 이렇게 되면 어떠한 체인이 유효성을 갖느냐에 따라 사용자의 잔고는 변동이 생기게 된다.  
이러한 혼란을 막기 위해, 이더리움에서는 GHOST(Greedy Heaviest Observed Subtree) 프로토콜이라는 매커니즘을 사용한다. <u>GHOST 프로토콜은 분기 과정으로 발생한 여러개의 path 중 가장 많은 연산, 즉 가장 긴 길이의 체인을 유효한 path로 선정</u>한다. 이를 확인하기 위해 각 체인 별 가장 최신 블록번호(특정 체인으로 연결된 블록의 갯수)를 사용한다. 일반적으로 블록번호가 높을 수록 path는 더 길고 해당 블록까지 도달하기 위해 더 많은 채굴을 위한 노력이 소비되었다고 판단한다. 이러한 검증된 체인을 'canonical blockchain'이라고도 부른다. 

<br>

## 계정

*Account*

이더리움은 Account 기반으로 state가 구성된다. 각 account는 서로 상호작용하며, 자기 자신에 대한 정보와 20바이트로 이루어진 주소를 기반으로 서로를 식별한다.  
Account에는 EOA와 CA 두 종류가 있다.

![image](https://user-images.githubusercontent.com/39115630/144015176-9e12edfe-904e-4d26-88f7-918a5bb65aa9.png)  
*@그림 5: 이더리움에서 사용되는 Account의 종류 - 출처: Preethi Kasireddy*

**1. Externally Owned Account(EOA)**
- 개인키를 이용하여 트랜잭션을 생성, 서명하는 역할을 한다.
- 코드를 저장할 수 없다. 단, EOA 또는 CA로 메시지를 전송할 수 있다.
- EOA 간에는 단순 Ether의 전송(송금)만 가능하지만, EOA에서 CA로 전송할 때에는 CA 내부의 코드(Smart contract)를 활성화하여 토큰 전송, 내부 저장소에 작성, 새로운 토큰 mint, 계산 수행, 새로운 contract 생성 등 다양한 기능을 수행할 수 있다.

**2. Contract Account(CA)**
- EOA와 다르게, CA는 스스로 새로운 트랜잭션을 실행할 수 없다. 
- 단, 다른 EOA 또는 CA로부터 전송받은 트랜잭션에 대한 응답 역할로 트랜잭션 실행이 가능하다.

![image](https://user-images.githubusercontent.com/39115630/144015933-860f256f-3c80-4a3c-baef-4965eea4cd72.png)  
*@그림 6: 각 Account의 동작 방식에 대한 간략한 예시 - 출처: Preethi Kasireddy*

결국 이더리움에서 동작하는 모든 트랜잭션들은 EOA에서부터 시작한다고 보면 된다.

![image](https://user-images.githubusercontent.com/39115630/144016193-9181f297-cba8-48a4-8495-9a0e98c7285e.png)  
*@그림 7: EOA에서부터 시작하는 이더리움 상의 모든 트랜잭션 - 출처: Preethi Kasireddy*

### 구성 요소

*Account state*

Account는 EOA, CA에 상관 없이 4개의 요소로 구성된다.

![image](https://user-images.githubusercontent.com/39115630/144016642-ec4b2bb4-aae6-44ef-805d-9de638d2da5e.png)  
*@그림 8: Account의 구성 요소 - 출처: Preethi Kasireddy*

**1. Nonce**
- EOA: 해당 account에서 전송한 트랜잭션의 수
- CA: 해당 account에 의해 생성된 contract의 수

**2. Balance**
- Account가 갖는 Wei의 양
- 1 Ether = 1e+18 Wei

**3. StorageRoot**
- [머클 패트리시아 트리](https://ihpark92.tistory.com/48)의 루트 노드의 해시값

**4. CodeHash**
- 해당 account의 EVM(Ethereum Virtual Machine) 코드 해시값
- EOA: 비어있음(코드를 저장할 수 없으므로)
- CA: 실행시킬 코드의 해시값

### 이더리움에서의 상태

*World state*

이더리움의 전역 상태(global state)는 account의 주소와 상태 간 매핑구조로 구성되어 있다. 이러한 매핑구조는 Merkle Patricia 트리(머클 트리)라고 불리는 데이터구조에 저장된다.  

![image](https://user-images.githubusercontent.com/39115630/144017884-034a6770-3c03-48ed-8f01-4c6615b7e66d.png)  
*@그림 9: 머클 트리의 구조 - 출처: Preethi Kasireddy*

머클 트리는 일종의 2진 트리 구조로, 다음과 같은 노드들로 구성되어 있다.
- 데이터를 포함하고 있는, 가장 많은 수로 구성된 최하위 단의 리프(leaf) 노드
- 자신의 자식(child)노드들의 해시값을 가지고 있는 중간(intermediate) 노드
- 트리의 가장 최상단에 위치하고 있는 single root 노드

이더리움에서는 주소와 해당 주소에 연결된 account 사이의 정보를 매핑한 key/value 정보가 최하위 단의 리프 노드에 저장된다. 여기서의 정보는 위에서 설명한 account의 구성요소인 nonce, balance, codeHash, storageRoot가 포함된다. 

![image](https://user-images.githubusercontent.com/39115630/144018704-8cd13d91-8621-4c35-b405-ae196959505b.png)  
*@그림 10: 이더리움 상에서의 트리 구조 및 구성 요소 - 출처: Preethi Kasireddy, Ethereum whitepaper*

Account의 정보 외에도 트랜잭션이나 receipt(트랜잭션 처리 결과를 저장하는 내용)에 대한 내용도 트리에 저장된다. 모든 블록은 헤더(header)가 존재하며, 헤더에는 서로 다른 3가지 내용(State trie, Transactions trie, Receipts trie)을 포함한 루트 노드의 해시 값을 저장하고 있다.

![image](https://user-images.githubusercontent.com/39115630/144019566-c0d11fda-2256-4870-b254-325555b20b8f.png)  
*@그림 11: 블록 헤더에 저장되는 데이터의 구조 - 출처: Preethi Kasireddy*

결국 수많은 정보를 머클트리안에 효과적으로 저장할 수 있는 방법이 중요한데, 이더리움에서는 이를 light clients 또는 light nodes라고 부른다. 노드는 크게 full node와 light node로 구분된다. 

**1. Full node**
- 제네시스 블록부터 현재 블록까지의 모든 체인을 포함하는 노드
- 채굴자는 반드시 Full node를 포함해야 한다.
- 체인 내에 있는 모든 트랜잭션의 실행이 가능하나, 모든 블록의 데이터를 매 순간 저장하고 동기화해야 하는 부담이 있다.

**2. Light node**
- 전체 체인의 블록 헤더만을 다운로드하는 방식
- 전체 체인을 다운받지 않고도 과거의 데이터를 조회하고 사용하는 것이 가능하다.

Light node가 블록 헤더만을 가지고 데이터를 조회하고 사용할 수 있는 이유는, 머클 트리가 리프 노드로부터 최상위 루트 노드까지 해시값을 참조하는 구조로 되어 있기 때문이다.  
만약 악의적인 사용자가 머클 트리의 가장 하단 리프 노드에 거짓된 트랜잭션을 주입하려 한다면, 이러한 변화는 상위 노드의 해시값에 영향을 주게 될 것이고 결국 가장 상단의 루트 노드의 변화를 야기할 것이다. 이를 통해 위변조의 감지가 가능하게 된다.  

![image](https://user-images.githubusercontent.com/39115630/144020626-80e31c31-df77-4924-825b-167f32be11d5.png)  
*@그림 12: 머클 트리에서 각 노드의 해시 값을 참조하는 방식 - 출처: Preethi Kasireddy*

이렇게 <u>머클트리에 존재하는 데이터가 올바른지 입증하는 절차를 Merkle proof</u>라고 하는데, 이를 위해서는 총 3가지 값이 필요하다.
- (1) 증명하려는 데이터와 해당 데이터의 해시값(위 그림에서의 I9ak)
- (2) 머클트리의 루트 해시값(위 그림에서의 2f92)
- (3) Branch: 데이터에 해당하는 리프노드부터 루트노드까지의 경로를 계산하기 위해 사용되는 해시값들(위 그림에서 짙은 초록색에 해당하는 모든 값들)

결국 머클 패트리시아 트리에서 루트 노드는 트리에 저장되어 있는 데이터들로부터 암호학적으로 의존되는 형태가 되며, 루트의 해시값은 안전한 ID와 같이 사용될 수 있다. 또한 블록의 헤더는 위에서 설명한 것 처럼 State, Transaction, Receipt 트리의 루트 해시값을 포함하기 때문에 모든 State의 저장 없이 Light node만으로도 일부 State는 충분히 검증 가능하다.

<br>

## 가스와 비용

*Gas and payment*

이더리움에서 발생하는 모든 트랜잭션은 수수료를 동반한다. 여기서 수수료는 gas라는 것을 통해 지불된다.  
Gas는 어떠한 연산에 필요한 수수료를 측정하는데 사용된다. Gas 당 지불하려고 생각하는 Ether의 양을 gas price라고 하며, 단위로는 gwei를 사용한다. 모든 트랜잭션에서 송신자(보내는 사람)는 gas limit과 gas price를 생성하는데, 여기서 limit 값은 트랜잭션을 실행시키면서 지불할 의사가 있는 최대치의 gwei를 의미한다.

![image](https://user-images.githubusercontent.com/39115630/144021087-ff163b8d-50a9-4b9c-a831-c079ac50d5a5.png)  
*@그림 13: 이더리움에서 가스 비용을 계산하는 방식 예시 - 출처: Preethi Kasireddy*

위의 그림처럼 송신자가 gas limit을 50000, gas price를 20 gwei로 설정할 경우, 송신자는 최대 50000 * 20gwei = 10^15wei (0.001Ether)를 트랜잭션 실행에 사용하고 싶다는 의미로 보면 된다.

![image](https://user-images.githubusercontent.com/39115630/144021285-d06621bc-cb55-4e9d-8c52-c3edd3841306.png)  
*@그림 14: 충분한 가스가 존재할 경우 정상적으로 처리되는 트랜잭션 - 출처: Preethi Kasireddy*

위의 그림과 같이 최대치 이상의 Ether를 가지고 있는 Account라면, 트랜잭션이 원활하게 잘 동작할 것이다. 트랜잭션 이후에 남은 가스에 대해서 송신자는 환불을 받을 수 있고, 기존의 비율로 다시 교환된다. 

![image](https://user-images.githubusercontent.com/39115630/144021421-5c5bda9e-e295-43d9-bd21-a9fd60a46ec5.png)  
*@그림 15: 가스가 충분히 존재하지 않을 경우, 무효화 처리되는 트랜잭션 - 출처: Preethi Kasireddy*

만약 송신자가 트랜잭션을 수행하기에 충분한 양의 가스를 제공하지 못한다면, 트랜잭션은 가스 부족(out of gas)를 실행하고 트랜잭션은 무효화처리된다. 무효화처리 이후에는 트랜잭션 처리는 중단되고, 트랜잭션이 발생하기 전의 상태(state)로 되돌아간다.  
중요한 것은, 트랜잭션이 무효화처리되면 해당 트랜잭션이 어디서 왔으며 왜 무효화처리되었는지 등에 대한 기록이 남지 않게 된다. 또한 최대치의 가스를 미리 확인한 후 가능한지 여부를 판단하고 무효화 처리를 하는 것이 아닌, 위의 그림처럼 최대한 열심히 일하다가 가스가 부족해서 도저히 안되겠다고 느낄 때 무효화처리를 하게 되므로 송신자는 어떠한 가스도 환불받지 못한다.

![image](https://user-images.githubusercontent.com/39115630/144021550-2b588e73-7730-41e7-b250-b4ca2a5145a5.png)  
*@그림 16: 무효화 처리된 트랜잭션에 대한 잉여 가스를 가져가는 채굴자 - 출처: Preethi Kasireddy*

이렇게 사용된 가스는 모두 채굴자의 Account 주소(beneficiary 주소)로 이동한다. 채굴자는 가스를 받아서 연산을 대신 수행하고 트랜잭션의 유효성을 입증하는 '수고'에 대한 보상으로 가스만큼의 수수료를 가져가는 것이다.  
그러므로 가스 가격에 따라 채굴자의 이득은 비례하여 올라가기 때문에, 채굴자는 더 큰 수수료를 챙길 수 있는 트랜잭션을 선택하게 된다. 그러므로 가스비가 높게 책정된 트랜잭션일수록 채굴되는 확률이 높아지며, 채굴자는 '이정도는 되어야 채굴해줄 수 있어'라는 식의 홍보(?)활동도 하게 된다.

### 저장 공간에 대한 수수료

*There are fees for storage, too*

가스는 연산 단계 뿐만 아니라, Storage(저장공간) 사용에도 지불한다. 이 때 저장을 위한 수수료는 32바이트 단위에 비례하여 지불된다.  
예시로 새로운 변수를 할당할 때 20,000gas가 소모되고, 기존 변수를 변화하는데에는 5,000gas가 필요하다고 하자. 사용이 완료된 Storage를 비우는 것은 기존의 변수 값을 0으로 변경하는 방식으로 동작하는데, 이 경우 0으로 변경되는데 5,000gas가 소모되면서 이전에 소비되었던 20,000gas를 다시 돌려받게 된다. 결국 최종적으로 15,000gas를 되돌려받는 셈이 된다.

### 수수료의 목적

*What’s the purpose of fees?*

이더리움에서 트랜잭션 하나에 대한 유효성은 Full node(모든 노드)에 의해 동시에 입증되어야 효력을 지닌다. 단, EVM(Ethereum Virtual Machine)은 연산과정에서 요구하는 값이 비싸기 때문에, <u>이더리움 내에서의 스마트계약은 파일 저장, 머신러닝과 같은 높은 계산 프로세스를 요구하는 작업 보다는 단순 로직 실행이나 서명 증명 등의 단순 업무를 위해 사용하는 것이 좋다.</u>

이렇게 수수료는 네트워크 내에 과부하를 주는 작업을 줄이기 위한 방편으로 사용되고 있으며, 더 나아가 이더리움에서 사용되는 언어인 솔리디티(Solidity)가 반복문을 허용함에 따라 악의적인 사용자가 트랜잭션 내에 무한루프를 이용한 halting problem(무한정 실행되는 프로그램에 대한 종료 여부를 언어관점에서 정할 수 없는 문제)을 야기하는 경우 발생할 수 있는 네트워크의 파괴로부터 이더리움을 방어하기 위한 용도로도 사용된다.

<br>

## 트랜잭션과 메시지

*Transaction and messages*

트랜잭션(Transaction)은 암호학적으로 서명된 명령(instructions)을 의미하며, EOA(Externally Owned Account)에 의해 발생하고 여러개의 완료된 트랜잭션이 정렬되어 하나의 블록으로 구성된 후 블록체인으로 제출된다. 트랜잭션은 크게 message call과 contract creation(새로운 컨트랙트를 만드는 과정)으로 구분된다.  

![image](https://user-images.githubusercontent.com/39115630/144022459-3c2c5593-07c9-4e7e-a8da-eae822618b73.png)  
*@그림 17: 트랜잭션의 구성 요소 - 출처: Preethi Kasireddy*

모든 트랜잭션은 아래와 같은 구성요소를 갖고 있다.
- Nonce: 송신자에 의해 보내진 트랜잭션의 갯수
- Gas Price: 트랜잭션이 실행될 때 송신자가 지불할 의사가 있는 가스의 단위(Wei)
- Gas Limit: 송신자가 트랜잭션 실행 시 지불할 의사가 있는 가스의 양, 연산 실행 전에 미리 지불됨
- To: 수신자의 주소(Contract Account의 경우 비어있음)
- Value: 송신자에서 수신자로 전송되는 Wei의 양(Contract Account의 경우 초기 잔금을 의미)
- Init: Contract Account에서만 존재하며, 새로운 CA를 시작할 때 한번만 실행됨.
- v,r,s: 트랜잭션 송신자 식별을 위한 서명에 사용되는 변수
- data: Message call에서만 사용되며, 메시지 콜에 사용되는 입력 데이터(인자 값)

이더리움 내에 존재하는 Contract는 같은 범위 내에 존재하는 다른 Contract와 소통이 가능하다. 이를 위해서 메시지(Message) 또는 다른 Contract 내부의 트랜잭션을 사용한다.  
단 메시지와 내부 트랜잭션은 확연한 차이를 갖는데, <u>메시지들은 EOA에서 생성될 수 없다</u>는 것이다. 메시지는 오직 Contract에서만 생성되며, 트랜잭션과 별개로 이더리움 내에서만 존재하는 데이터 형태를 가지며 정렬화(Serialized)되지 않은 형태로 이더리움 실행 환경에서만 존재한다.

![image](https://user-images.githubusercontent.com/39115630/144022800-f434214f-4566-4b5d-8247-2a23debefa60.png)  
*@그림 18: 트랜잭션의 호출 예시 - 출처: Preethi Kasireddy*

위의 그림은 한 Contract가 내부 트랜잭션을 다른 Contract로 보내는 과정을 나타낸다. 여기서 주목할 부분은 내부 트랜잭션 또는 메시지는 gas limit을 포함하지 않는데, 트랜잭션이 외부 생성자(Externally Owned Account)에 의하여 생성되기 때문이다. EOA에서 설정한 gas limit은 Contract 간 메시지와 트랜잭션 처리에 모두 사용할 수 있을만큼 충분해야 한다.

<br>

## 블록

*Blocks*

모든 트랜잭션은 블록으로 구성되며, 이러한 블록들이 모인 체인을 블록체인이라고 한다. 블록은 아래와 같은 요소로 구성된다.
- 블록 헤더
- 블록에 포함되어 있는 트랜잭션 집합에 대한 정보
- 현재 블록의 ommers에 대한 정보

### Ommers란?

*Ommers explained*

<u>Ommers(Ommer 블록들)란 현재 블록의 부모와 동일한 부모를 두고 있는 블록, 일명 형제 블록을 의미</u>한다. 초창기 이더리움은 트랜잭션 처리를 빠르게 하기 위해 블록 생성 주기를 15초 이하로 설계했다. 단, 블록 생성 주기가 짧아질수록 채굴자들의 경쟁은 더욱 심화될 수 밖에 없었다. 수많은 채굴자들이 열심히 만든 블록들 중 유일하게 하나만 채굴되어 메인 체인에 등록되게 되는데, 이 때 등록되지 못한 나머지 블록들은 orphaned blocks(고아 블록)이라고 불린다.  
Ommers의 목적은 orphaned block(비트코인에서는 stale block으로 표현된다)을 포함함으로써 <u>채굴자에 대한 보상을 확대</u>하는 것에 있다. 즉, 메인체인에 등록되지 못했다 하더라도 채굴과정에 참여했다는 것에 대한 보상을 제공한다는 것이다. 이를 위해서는 orphaned block인지 여부를 증명하는 과정이 필요한데, 이는 orphaned block 이후에 생성되는 블록을 검사하는 과정으로 확인한다.

예를 들어, 노드 A에서 채굴이 완료된 10번 블록이 네트워크에 전파될 때 노드 B에서 근소한 차이로 등록되지 못한 10번 블록이 있다고 가정한다. 이 경우 노드 A는 11번 블록을 만들면서 동시에 지난번 늦게 제출된 10번 블록이 orphaned block 이었다는 것을 작성한다. 결국 11번 블록은 10번 블록이 orphaned block임을 증명할 수 있으며, 이후에 11번 블록을 통해 추가로 일정 보상을 받을 수 있다.  
혹은 11번 블록을 생성하는 과정에서 네트워크의 지연 또는 기타 장애로 인하여 이전에 만들어진 10번 orphaned block을 등록하지 못할 수도 있다. 이 경우 10번 블록의 내용은 다음 블록인 12번에서도 증명이 가능하며, 이 과정은 orphaned block 생성 이후 최대 7블록(예시에서는 17블록) 동안 10번에 대한 orphaned block 여부를 판단해준다.

물론 Ommers는 기존의 full 블록들보다는 낮은 보상을 받는다. 또한 orphaned block인지 발견되는 시기가 빠를수록 보상이 크며(기존 보상 * 7/8), 증명되는 블록이 멀어질수록 보상은 적어진다(7블록 이후에 겨우 증명이 되면 기존보상 * 1/8 만큼만 보상받게 된다). 증명된 ommers의 리스트는 블록 헤더에 포함된다.

### 블록 헤더

*Block header*

모든 블록은 동일한 헤더를 포함하며, 헤더는 다음의 구성 요소를 지닌다.
- parentHash: 부모 블록의 해시값
- ommersHash: 현재 블록의 ommers의 해시값들을 담은 리스트
- beneficiary: 블록을 채굴했을 때 수수료를 받을 account의 주소
- stateRoot: State 트리의 루트 노드 해시값, World State에서 언급한 라이트 클라이언트들이 State를 간편하게 입증하는 방법을 사용
- transactionsRoot: 블록에 포함된 모든 트랜잭션을 포함한 트리의 루트 노드 해시값
- receiptsRoot: 블록 내부의 모든 트랜잭션의 receipt(거래 영수증)을 포함한 트리의 루트 노드 해시값
- logsBloom: log 정보를 저장하며, bloom filter라는 자료 구조 형태를 가짐
- difficulty: 블록 생성 난이도
- number: 블록의 순서(Genesis 블록은 0번째 순서를 가지며, 이후 블록들마다 하나씩 값이 증가됨)
- gasLimit: 블록 당 현재 gas 제한량
- gasUsed: 현재 블록에서 사용된 총 가스의 량
- timestamp: 현재 블록이 개시(생성?)된 unix 형태의 시간
- nonce, mixHash: 두 값이 조합되어 현재 블록이 충분한 연산을 통해 만들어졌음을 입증하는 해시값
- mixHash: nonce를 조절하여 구한 유효한 범위 내의 해시 값
- nonce: 유효한 mixHash를 찾았을 때 사용된 nonce 값

![image](https://user-images.githubusercontent.com/39115630/144023843-372bb13d-616e-48b8-8645-f49833dc93f0.png)  
*@그림 19: 블록 헤더의 구성 요소 - 출처: Preethi Kasireddy*

각 블록 헤더 별로 state, transaction, receipts에 대한 트리 구조를 지니며, 이 구조는 머클 패트리시아 트리로만 구성된다.

### 로그

*Logs*

로그를 통해 다양한 트랜잭션과 메시지들의 추적이 가능하다. Contract의 내부 이벤트(event)들마다 선택적으로 로그를 발생시킬 수 있다. 로그의 구성요소는 다음과 같으며, 수많은 정보들을 효율적으로 저장할 수 있도록 [bloom filter](https://ko.wikipedia.org/wiki/%EB%B8%94%EB%A3%B8_%ED%95%84%ED%84%B0) 구조로 만들어진다.

- logger(로그를 작성하는) account의 주소
- 해당 트랜잭션에 의해 수행되는 event들(topic 형태로 표현)
- event에 관련된 데이터

### 트랜잭션 영수증

*Transaction receipt*

헤더에 저장된 로그들은 트랜잭션 receipt(영수증)에 포함된 정보로부터 만들어진다. 이더리움에서는 모든 트랜잭션마다 receipt를 발행하며, 각 receipt는 아래의 정보들을 포함한다.
- 블록 번호(number)
- 블록 해시값
- 트랜잭션 해시값
- 트랜잭션에 사용된 gas량
- 블록 내 모든 트랜잭션의 누적 gas량(receipt 발행을 위한 트랜잭션도 포함)
- 트랜잭션 실행과정에 생긴 로그들
- 기타

### 블록 난이도

*Block difficulty*

블록의 생성 주기를 일관화 하기 위하여 블록 난이도를 책정한다. 제네시스 블록의 경우 난이도는 131,072였다.  
난이도는 특별한 공식을 통하여 매 블록 생성 이후 새롭게 계산된다. 만약 10번 블록이 9번 블록보다 더 빠르게 생성되었다면, 이더리움 프로토콜은 11번 블록을 생성할 때 요구되는 난이도는 10번보다 더 높게 생성한다.  
블록의 난이도는 PoW(Proof of Work) 알고리즘을 사용하여 블록을 채굴할 때 사용되는 해시값을 계산할 때 필요한 nonce 값에 영향을 준다. 블록의 난이도와 nonce 사이의 수학적인 관계도는 다음과 같이 표현할 수 있다.

![image](https://user-images.githubusercontent.com/39115630/144024388-ce71bd41-08af-41db-9cba-d511f14931a3.png)  
*@그림 20: 블록 생성 난이도 공식 - 출처: Preethi Kasireddy*

Hd는 난이도를 의미하며, 해당 난이도에서의 조건을 만족시키는 n(nonce)을 찾기 위해서는 모든 가능성을 일일이 대입하는 PoW 알고리즘을 사용해야 한다. 그러므로 난이도가 높아질수록 알맞는 nonce를 찾는데 걸리는 시간은 증가하며, 이는 블록을 증명하는 것이 어려워짐에 따라 새로운 블록을 생성하는데 걸리는 시간도 증가하게 된다. 결국 난이도에 따라 블록 생성 시간을 조절할 수 있게 된다. 반대로 블록을 생성하는데 시간이 너무 오래 걸린다면, 프로토콜은 난이도를 낮춰서 적정 생성속도인 15초정도를 유지하게 될 것이다.

<br>

## 트랜잭션 실행

*Transaction Execution*

이더리움에서 사용자 간 발생하는 거래를 트랜잭션(Transaction)이라 하며, 트랜잭션을 통해 이더리움의 state가 변화된다.

![image](https://user-images.githubusercontent.com/39115630/144024663-0480e8fc-32d8-463b-973c-a356ba675d1c.png)  
*@그림 21: 트랜잭션에 의해 변화되는 이더리움의 상태 - 출처: Preethi Kasireddy*


트랜잭션을 실행할 때 필요한 초기 조건들은 다음과 같다.

**1. 적절한 RLP 형식**

[RLP(Recursive Length Prefix)](https://ihpark92.tistory.com/47)는 2진의 nested 배열을 암호화할 때 사용하는 데이터 형식이다. 여기서 nested 배열은 배열 안에 또다른 배열이 중첩적으로 들어있는 배열을 의미한다. RLP는 이더리움이 객체들을 정렬(Serialize)할 때 사용하는 포멧으로, 데이터를 최대한 단순하게 처리하기 위해 통일된 포멧을 사용한다고 보는게 맞다.

**2. 트랜잭션 송신자의 유효한 서명**

2.1. 유효한 트랜잭션의 nonce  

트랜잭션의 nonce가 트랜잭션 송신자의 nonce와 일치하는 경우, 이를 유효하다고 본다. 여기서의 nonce는 트랜잭션 송신자가 현재까지 몇개의 트랜잭션을 송신했는지를 나타낸다.  

2.2. 트랜잭션의 gas limit >= 트랜잭션이 사용할 instrinsic(고유한) gas의 양

instrinsic gas는 기본적으로 다음을 포함한다.

![image](https://user-images.githubusercontent.com/39115630/144025178-e4480a87-c328-42c4-9b8b-845fa5d7556a.png)  
*@그림 22: 트랜잭션이 사용할 고유 가스 양에 대한 정보 - 출처: Preethi Kasireddy*

- 트랜잭션을 실행하기 위해 미리 정의된 21,000 gas 비용
- 트랜잭션과 함께 보낼 데이터에 대한 gas 비용
  * 데이터 또는 코드 == 0 -> 바이트 당 4 gas
  * 데이터 또는 코드 != 0 -> 바이트 당 68 gas

송신자의 계좌 잔금은 송신자가 지불해야 할 gas 요금(upfront cost)을 충분히 낼 수 있어야 한다. upfront cost는 두 가지 단계로 계산된다.

![image](https://user-images.githubusercontent.com/39115630/144025594-673ec962-8b5b-40e1-9b0b-6a5fbb5b37a7.png)  
*@그림 23: 송신자가 지불해야 하는 가스 요금 책정 계산 방법 - 출처: Preethi Kasireddy*

- gas 비용의 최대값 = 트랜잭션의 gas limit * 트랜잭션의 gas price
- upfront cost = gas 비용의 최대값 + 송신자에서 수신자(recipient)로 전송될 총 Ether량

2.3. 남아있는 gas량 계산

![image](https://user-images.githubusercontent.com/39115630/144025763-35ccffc0-8808-45e1-a33b-b90ca92ceffe.png)  
*@그림 24: 남은 가스 계산 - 출처: Preethi Kasireddy*

송신자의 잔액에서 실행에 필요한 upfront cost를 빼고, 송신자의 account에서 현재 트랜잭션(gas 송금)에 대한 nonce값을 1 증가시킨다. 이를 통해 남아있는 gas 량 = 트랜잭션에 대한 총 gas limit - 사용된 instrinsic gas 으로 구할 수 있다.

이 모든 과정에 정상적으로 완료되면 트랜잭션이 실행된다. 이 과정에서 이더리움은 substate(트랜잭션이 실행되는 동안 변경되는 정보들을 저장하는 임시 공간)을 계속 추적한다. substate는 아래와 같은 구성요소를 갖는다.
- Self-destruct set: 트랜잭션 실행 과정에서만 사용되고 삭제될 수 있는 account 목록
- Log series: 가상 machine의 코드 실행 중에 발생하는 데이터 저장 및 단계 별 체크 포인트 제공을 위한 로그
- Refund balance: 트랜잭션이 완료된 후 송신자 account로 환불될 양. refund counter가 0에서부터 시작해서 컨트랙트가 저장소에서 특정 데이터를 꺼내올 때마다(삭제) 값은 증가한다. 이 값을 이용하여 이더리움 내에서 저장소가 가스를 소모하고, 저장소를 비우는 과정에서 송신자가 환불을 받게 된다.

트랜잭션에 의해 필요한 모든 단계들이 처리되고 더이상 유효하지 않은 state가 없다는 가정 하에, 송신자로 다시 환불될 (사용되지 않은) gas 양을 결정한다. 이 과정에서 유효하지 않다고 가정되어 있던 state 들이 substate 내용에 따라 수정되며 트랜잭션이 완료된다. 이후 refund balance에서 언급한대로, 송신자는 트랜잭션 이후 일정 금액을 환불받는다.

환불은 다음의 과정으로 진행된다.

1. 소모한 gas만큼의 Ether가 채굴자에게 전달된다.
2. 트랜잭션에 사용된 gas를 블록의 gas counter에 더한다. gas counter는 블록 내 트랜잭션의 총 gas 소모량을 확인하고 이를 이용하여 블록을 증명할 때 사용된다.
3. self-destruct set에 counter가 존재할 경우, 모두 삭제해준다.

환불 과정까지 모두 완료되면, 트랜잭션에 의해 생성되는 새로운 state와 로그들을 처리한다.

### 컨트랙트 생성

*Contract creation*

이더리움에 존재하는 두 가지 Account(Contract Account, Externally Owned Account) 중, 일반적으로 <u>Contract 생성 트랜잭션에 대해 언급할 때에는 새로운 Contract Account를 생성한다는 것을 의미</u>한다. 즉, Contract Account는 contract 생성 트랜잭션을 통해 생성된다.

새로운 CA를 생성하는 과정은 다음과 같다.

1. 특별한 공식을 사용하는 새로운 Account 주소를 생성한다.
2. Account의 nonce 값을 0으로 설정한다.
3. 송신자가 Account 생성 트랜잭션과 Ether를 함께 전송했을 경우, Account의 잔금을 해당 Ether 만큼 설정한다.
4. 송신자의 잔금에서 Ether만큼을 제외한다.
5. CA의 storage를 초기화 한다.
6. Contract의 codeHash를 빈 문자열의 해시값으로 설정한다. codeHash는 EOA에서 필요한 인자값으로 사용된다.

CA 생성 트랜잭션을 전송하면, 함께 전송된 init 코드를 사용하여 CA가 생성된다. init 코드는 contract 생성자에 따라 account의 storage를 갱신하거나 다른 contract account를 생성하기도 하고, 혹은 다른 메시지 콜을 보내는 등 여러가지 동작을 함께 수행할 수 있다.

<u>Contract 시작을 위한 코드 실행에도 gas는 소모된다.</u> 또한 이 과정에서 사용되는 gas 또한 남아있는 gas 내에서만 사용이 가능하다. 남아있는 gas가 부족하면 OOG(Out Of Gas) 오류와 함께 트랜잭션은 종료되며, state는 트랜잭션 실행 이전 시점으로 되돌아간다.

중요한 것은, <u>이 과정에서 소모된 gas에 대해서 송신자는 환불받을 수 없다.</u>

init 코드가 정상적으로 실행되고나면, storage에 대한 비용이 청구되며 contract 코드의 길이에 비례하여 책정된다. 이 또한 gas 비용을 요구하며, 남아있는 gas량이 부족할 경우 OOG 오류와 함께 비용 지불 과정은 중단된다. 이 과정까지 오류 없이 완료된다면, 사용하지 않은 남은 gas는 본래 송신자에게 환불되며 최종 state가 저장된다.

### 메시지 콜

*Message calls*

메시지는 함수와 같은 구조로 불리며, 메시지 호출은 CA와 다르게 init 코드를 포함하지 않는다. 또한 트랜잭션 송신자가 메시지에 사용될 입력값을 추가로 전달할 수 있다.

Contract 생성과 마찬가지로, 메시지 호출 과정에서 OGG 오류 혹은 트랜잭션의 유효성 검증 실패(Stack overflow, 유효하지 않은 점프 또는 지시 등)로 인한 중단이 발생할 수 있다. 이 경우에도 동일하게 사용된 gas는 환불되지 않고 사용되지 않은 gas만이 환불되며, 이전 state로 되돌아가게 된다.

<br>

## 실행 모델

*Execution model*

이더리움에서 트랜잭션을 실제로 처리하는 프로토콜은 EVM(Ethereum Virtual Machine)이라는 가상 머신이다. EVM은 [튜링 완전(Turing-complete) 기반](http://wiki.hash.kr/index.php/%ED%8A%9C%EB%A7%81%EC%99%84%EC%A0%84)의 가상 머신이나, 기존의 튜링 완전 기반의 머신과 달리 gas에 종속되어 있다는 차이점을 가지고 있다. 이는 EVM이 가지고 있는 유일한(?) 한계로 언급되며, 이 때문에 EVM 내에서 실행가능한 모든 연산들은 gas의 양에 종속적이다.

EVM은 LIFO(Last In First Out) 방식인 스택 구조를 갖는다. EVM에서 각 스택의 항목들은 256비트로 이루어지며, 최대 1024개의 항목들을 가질 수 있다.

![image](https://user-images.githubusercontent.com/39115630/144027271-351f3ecf-0283-41ba-bc17-382a5e9734f8.png)  
*@그림 25: EVM의 스택 구조 - 출처: Preethi Kasireddy*

EVM은 메모리에 word-address 형태의 바이트 배열로 저장된 item들을 저장한다. 메모리 외에도 저장소(storage)를 갖는데, 저장소는 시스템 state의 일부로 유지된다. 특히 프로그램 코드의 경우 특별한 instruction으로만 접근 가능한 가상 ROM에 개별 저장하는데, 이렇게 코드를 메모리 또는 저장소에 저장하는 방식은 전형적인 폰노이만 구조와는 차별성을 갖게 한다.

EVM이 가지고 있는 자체적인 언어인 EVM 바이트 코드는 일반적인 프로그래머들이 이더리움의 스마트 컨트랙트를 개발할 때 사용하는 솔리디티 언어를 EVM이 이해할 수 있도록 변형시킨다.

특정 연산을 실행하기 위해 프로세스가 이용할 수 있는 정보들은 다음과 같다.
- 시스템 상태(state)
- 연산을 위해 남아있는 gas
- 현재 실행중인 코드를 소유하고 있는 account의 주소
- 현재 실행중인 트랜잭션의 송신자 주소
- 실행할 코드를 지닌 account 주소(송신자가 다른 account의 코드를 실행할 수 있으므로, 송신자와 다를 수 있다)
- 실행중인 트랜잭션의 gas price
- 실행에 사용될 입력 데이터
- 실행 과정에 account로 보내진 value 값(wei로 표현)
- 실행될 machine 코드
- 현재 블록의 헤더(header)
- 현재 메시지 호출 또는 contract 생성 스택의 깊이

Execution이 시작되면 메모리, 스택, 저장소는 모두 비어있고 프로그램 카운터는 0이 된다.

> PC: 0 STACK: [] MEM: [], STORAGE: {}

EVM은 반복적으로 트랜잭션을 실행하면서 각 루프 별 시스템 state, 머신 state를 연산한다. 머신 state는 아래와 같다.
- 이용 가능한 gas
- 프로그램 카운터(PC)
- 메모리 내용
- 메모리 내에서 활성화 된 단어(word)의 수
- 스택 내용

스택의 내용이 증감하면서, 각 사이클마다 남아있는 gas 량에서 적정량 만큼의 gas가 감소(사용)되고 프로그램 카운터는 증가한다. 각 사이클 별로 발생할 수 있는 마지막 케이스는 3가지가 존재한다.

1. Machine이 예외(오류) state에 도달하는 경우: 불충분한 gas, 유효하지 않은 instruction, 유효하지 않은 스택 item, 유효하지 않은 jump 등으로 발생할 수 있으며, 이 경우 동작이 중지되고 모든 변경 사항들은 취소된다.
2. 다음 루프로 이동하는 경우: 일종의 continue
3. Machine이 실행 프로세스의 끝에 정상적으로 도달하여 실행을 멈추는 경우: 결과적으로 발생한 state와 실행 후 남은 gas, 발생한 substate(세부 state), 최종 출력값을 발생시킨다.

### 블록의 완결성 

*How a block gets finalized*

블록체인에서 블록이 완결된다는 프로세스는 어떤 블록인지에 따라 다른 의미를 가진다.
- 새로운 블록: 블록을 채굴하는 프로세스
- 기존 블록: 해당 블록을 입증하는 프로세스

그렇다면 블록의 완결 조건은 어떤것이 있을까?

1. Ommers 입증: 블록 헤더에는 Ommers에 대한 정보가 담겨있다. 현재 블록을 기점으로 6번째 이전의 블록 내에 Ommers의 정보가 포함되어 있어야 하며, 만약 채굴하는 과정이라면 해당 정보를 알아내야만 한다.
2. 트랜잭션 입증: 블록의 gasUsed는 블록 안에 있는 트랜잭션들에 사용된 총 gas량과 동일해야 한다. 실제로 트랜잭션 실행 시, 블록의 gas counter를 추적하고 이 과정에서 블록에 있는 모든 트랜잭션에 사용된 총 gas량을 계산한다.
3. 보상 적용(채굴 시): beneficiary 주소(블록을 채굴했을 때 수수료를 받는 account 주소)는 블록 채굴 마다 5 Ether를 보상받는다(EIP-649에 의하면 Ether의 보상은 5에서 3으로 줄어들 것이라고 발표). 추가로 Ommers가 존재하는 경우, 현재 블록의 beneficiary가 받을 보상의 1/32를 추가로 받을 수 있다. 또한 Ommers 각각의 beneficiary 또한 특정 양을 보상받게 된다.
4. State와 nonce의 증명: 트랜잭션의 결과는 state의 변화를 야기한다. 블록 채굴에 대한 보상의 과정은 헤더에 저장된 state 트리의 가장 마지막 state 점검을 통하여 증명(valid)할 수 있다.

<br>

## PoW에서의 채굴

*Mining proof of work*

블록이 생성(채굴)되는 과정에 중요한 요소 중 하나가 '블록의 난이도'이다. 이 난이도에 의미를 부여하는 알고리즘 방식을 PoW(Proof of Work)라고 한다. 

이더리움에서는 PoW 알고리즘을 Ethash라고 부르는데, 아래와 같이 정의된다.

![image](https://user-images.githubusercontent.com/39115630/144028449-c4664498-4749-421a-a497-d6d82eb7c284.png)  
*@그림 26: Ethash의 계산식 - 출처: Preethi Kasireddy*

- m: mixHash, nonce를 조절하여 구한 유효한 범위 내의 해시 값
- n: nonce, 유효한 mixHash를 찾았을 때 사용된 nonce 값
- Hn(첫번째인자): 새로운 블록의 헤더(nonce, mixHash를 제외한)
- Hn(두번째인자): 블록 헤더의 nonce
- d: [DAG(Directed Acyclic Graph, 비순환그래프)](https://steemit.com/dag/@cryptodreamers/dag-dag-directed-acyclic-graph) 기반의 데이터 집합

PoW 알고리즘은 mixHash와 nonce 값을 평가하기 위해 사용된다. 각 항목을 계산하는 방법은 아래와 같다.

**1. 각 블록에 대한 seed 생성**

seed는 epoch(3만개의 블록이 생성되는데 걸리는 정도의 시간) 주기마다 다르게 생성된다.

**2. cache 생성**

첫번째 epoch의 seed는 32바이트의 크기 0을 갖는 해시값이며, 그 다음부터는 이전 seed 해시값을 참조하여 만들어진다. 노드는 이 seed를 사용하여 cache라는 임의의 난수를 계산한다. 이 때 만들어진 cache는 라이트 노드(light node)에서 특정 트랜잭션을 증명하는데 필요하기도 하다.

**3. DAG(Directed Acyclic Graph, 비순환그래프) 생성**

cache로부터 임의로 랜덤하게 선별된 적은 항목수들의 집합으로, 노드는 cache DAG라는 데이터 집합을 생성한다. 채굴자는 반드시 이 DAG 데이터 집합을 생성하고 저장해야 하며, full node를 갖는 클라이언트는 DAG 데이터 집합을 꼭 저장해야 한다. 물론 이 DAG의 크기는 시간이 지날수록 늘어나는 데이터의 양에 비례하여 증가한다.

**4. mixHash 생성**

채굴자는 DAG에서 일부 데이터를 랜덤하게 추출하고 이를 mixHash와 함께 해시한다. 그리고 해시 된 결과 값이 nonce 값 아래로 출력될 때 까지 반복적으로 mixHash를 생성한다. 충족된 결과 값이 나오면, nonce는 유효하다고 판별되고 블록이 체인에 추가된다.

### 채굴의 안전성

*Mining as a security mechanism*

PoW의 목적은 암호학적으로 안전한 어떤 연산과정을 통해 특정 출력값(nonce)이 생성되었음을 증명하는 것이다. 실제로 이 적합한 nonce를 찾는 과정은 일명 brute force, 모든 과정을 일일이 대입해보는 방법 말고는 방법이 없다. 그러므로 해시 함수를 사용하여 만든 출력값들은 균일한 분포를 가지며, 적합한 nonce값을 찾는데 필요한 시간은 난이도에 달려있게 된다.

난이도가 높아진다는 것은 nonce를 찾는데 더 많은 시간이 걸린다는 의미로, 이 난이도가 채굴의 안전성과 이를 통한 블록체인의 안정성을 보장하고 있다고 할 수 있다.

그렇다면 블록체인의 안전성은 무슨 의미를 갖는가? 사용자가 믿을 수 있는 블록체인이 생성되는 것이다. 여러개의 체인이 존재한다는 것은 신뢰해야 할 내용이 하나가 아니라는 것이다. 이는 사용자들이 합리적인 방법으로 체인의 유효성을 검증할 수 없기 때문에, 블록체인의 신뢰를 떨어뜨리는 요인이 될 것이다. <u>그러므로 블록체인은 하나의 유효한 state를 표현하는, 신뢰 가능한 하나의 체인 'canonical(main) chain'을 구성할 수 있어야 한다.</u>

이에 PoW 알고리즘은 공격자가 과거의 특정 부분을 임의로 변경하거나 분기하는 것을 매우 어렵게 만든다. 이를 통해 특정 블록 체인이 향후에도 유효한 상태로 유지될 수 있도록(트랜잭션을 삭제하거나 거짓의 트랜잭션을 생성하지 못하도록) 보장한다.

![image](https://user-images.githubusercontent.com/39115630/144029238-7f0d14d4-5446-4fb8-8cd5-04b81708ac0c.png)  
*@그림 27: PoW 알고리즘을 이용한 블록체인의 안전성 확보 - 출처: Preethi Kasireddy*

공격자의 블록이 입증되려면, 네트워크에 있는 다른 누구보다도 빠른 속도로 nonce를 해결해야 한다. 이 방법만이 공격자가 자신이 만들고자 하는 체인을 가장 무거운(긴 블록을 가진) canonical chain으로 만드는 방법이다. 결국 공격자는 전체 네트워크의 채굴 파워의 절반 이상(51%)을 가지고 있지 않다면, 공격이 불가능하게 된다.

### 부의 분배를 위한 채굴 과정

*Mining as a wealth distribution mechanism*

PoW는 연산이 가능한(블록을 채굴한) 사용자에게 누구나 부를 분배할 수 있는 방법이기도 하다. 블록을 채굴하게 되면 보상이 주어지는데, 보상은 총 3가지 형태로 존재한다.
- 승리 블록에 대한 고정 블록 보상 = 3 Ether
- 블록에 포함된 트랜잭션을 실행하기 위하여 소모된 gas 비용
- 블록에 ommers를 포함한 것에 대한 추가 보상

안정성과 부의 분배를 위한 PoW 합의구조를 장기적이고 안전하게 보장하기 위한 이더리움의 2가지 특성이 있다.

1. 가능한 많은 사람들이 접근해야 한다. 특별하거나 흔하지 않은 하드웨어가 아닌, 누구나 Ether 보상이 가능한 연산능력을 제공할 수 있어야 한다.
2. 특정 노드가 불균형적으로 이윤을 가져갈 수 없어야 한다. 이는 네트워크의 안전성을 감소시킬 것이다.

이러한 방향성을 위하여 이더리움에서는 PoW 알고리즘을 사용하는 Ethash가 점점 메모리를 사용하도록 만들었다. 결국 nonce를 계산하기 위해서는 다량의 메모리와 대역폭(bandwidth)이 필요하다. 메모리를 많이 사용해야 하는 방법은 병렬로 컴퓨터를 구성하여 컴퓨터가 동시에 여러 nonce를 발견할 수 있는 방법을 어렵게 만들었다. 또한 높은 대역폭은 엄청 빠른 컴퓨터가 여러 nonce를 발견하게 하는 것도 어렵게 만들었다. 이런 방법들을 통해 중앙화에 대한 위험을 감소시키고 더 많은 노드들이 블록을 증명할 수 있도록 기회와 경쟁환경을 제공하였다. 

그리고 현재 이더리움의 알고리즘은 점점 PoS(Proof of Stake)로 변경되고 있다.

<br>

## 참고자료
- [How does Ethereum work, anyway? - Preethi Kasireddy](https://preethikasireddy.medium.com/how-does-ethereum-work-anyway-22d1df506369)
- [머클 패트리시아 트리 - 니르바나 블로그](https://ihpark92.tistory.com/48)
- [bloom filter - 위키피디아](https://ko.wikipedia.org/wiki/%EB%B8%94%EB%A3%B8_%ED%95%84%ED%84%B0)
- [RLP(Recursive Length Prefix) - 니르바나 블로그](https://ihpark92.tistory.com/47)
- [튜링 완전(Turing-complete) 기반 - 해시넷](http://wiki.hash.kr/index.php/%ED%8A%9C%EB%A7%81%EC%99%84%EC%A0%84)
- [DAG(Directed Acyclic Graph, 비순환그래프) - cryptodreamers](https://steemit.com/dag/@cryptodreamers/dag-dag-directed-acyclic-graph) 
