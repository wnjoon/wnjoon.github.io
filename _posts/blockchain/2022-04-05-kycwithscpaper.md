---
title: "[📝 번역 정리] Know Your Customer(KYC) Implementation with Smart Contracts on a Privacy‐Oriented Decentralized Architecture" 
excerpt: "분산형 구조에서 스마트 컨트랙트 기반의 KYC 적용 사례에 대하여 알아본다."

categories:
  -  Blockchain
tags:
  - [Blockchain, STO, KYC]

toc: true
toc_sticky: true

date: 2022-04-05
last_modified_at: 2022-04-05
---

<br>

> 📒 본 포스팅은 Nikolaos Kapsoulis 외 5명이 작성한 Article '[Know Your Customer(KYC) Implementation with Smart Contracts on a Privacy‐Oriented Decentralized Architecture](https://www.researchgate.net/publication/339477911_Know_Your_Customer_KYC_Implementation_with_Smart_Contracts_on_a_Privacy-Oriented_Decentralized_Architecture)' 내용을 학습한 후 작성하였습니다.


## 연구 주제

암호화폐, 콘텐츠 제작 등 다양한 분야에서 블록체인이 활용되면서, 블록체인 내에서 사용자의 신원을 증명할 수 있는 방법에 대한 연구가 지속되고 있다.  

KYC는 대표적인 신원 관리 방식으로, 금융 기관을 비롯한 다양한 조직에서의 자금 세탁 방지를 위한 근간을 제공한다. 이에 블록체인이 계속해서 금융 기술과 연관성을 가질수록, KYC 프로세스를 적용하기 위한 다양한 노력 및 접근 방법이 필요하다. 이에 <u>블록체인을 통해 분산화 된 환경에서 실행할 수 있는 효율적인 KYC 프로세스를 설계하고, 이를 위해 Quorum 블록체인 환경 내에 IPFS(InterPlanetary File System)을 사용하는 아키텍처를 설계</u>한다. 

### [Bloomen 프로젝트](http://bloomen.io/)

위에서 제시한 검증 방법을 구현한 프로젝트로, 미디어 콘텐츠의 제작과 배포를 위한 디지털 기술 사용의 증가로 인하여 블록체인을 통한 개인 정보 및 저작권 보호 등을 통한 콘텐츠 제작자 보상을 위한 모델을 제공한다. 스마트컨트랙트를 통해 KYC를 구현하고, 중앙 시스템이 아닌 곳에서 사용자 혹은 기타 제3자가 신원을 확인하고 이를 관리하여 ID의 관리 체계를 분산시킨다.

<br>

## Authorization with KYC 

KYC를 위한 스마트 컨트랙트를 Private/Public 방법으로 구성한다.
- public : KYC 승인 사용자의 CRUD 트랜잭션 수행
- private : IPFS와 같은 저장소로 CRUD 트랜잭션을 제출

### 간략화한 전체 아키텍처

![image](https://user-images.githubusercontent.com/39115630/161875299-dfadbcbf-5777-4bad-8eeb-d5aeb6906131.png)  
*<그림 1: 설계 구조 - 출처: 본문자료>*

위의 그림은 어플리케이션의 단계별 프로세스를 나타낸 것으로, 전체 시스템의 아키텍처는 블록체인을 중심으로 단순화됨을 볼 수 있다.
1. 사용자(User)는 KYC UI라는 사용자 인터페이스를 통해 KYC 등록 프로세스를 진행한다. 이 과정에서 사용자의 개인 정보(documentation)가 제출된다. 이 과정에서 적절한 정보를 올바르게 전달하는 것은 사용자의 책임이고, 부적절한 사용자를 걸러내는 것은 프로세스에서 진행해야 한다.
2. 작성된 KYC 문서를 IPFS에 저장한다. IPFS는 저장할 데이터의 해시 결과(Content ID - CID)를 저장한다. 향후 해당 데이터에 접근하려면 CID가 필요하다.
3. 블록체인에는 KYC 승인을 받은 사용자를 식별하기 위한 필수 정보 또는 KYC 승인 유효기간만 들어가고, 민감한 개인정보는 포함하지 않는다. 이러한 데이터를 저장하기 위한 블록체인으로 Quorum을 사용한다.

### IPFS를 이용한 스마트 컨트랙트 구현

![image](https://user-images.githubusercontent.com/39115630/161880588-6fa76e69-f41a-42d1-bdbf-eccf4d73c578.png)  
*<그림 2: Private 또는 Public 스마트 컨트랙트>*

IPFS에는 모든 사용자 정보를 저장하며, 내부에는 각 사용자의 정보들을 link 형태로 연결하고 있게 된다. 즉 특정 데이터에 접근하기 위해서는 해당 위치의 주소를 알아야 한다. IPFS에 저장된 사용자 정보에 CRUD하기 위한 기능을 Quorum 내에서 private 또는 public 형태의 스마트 컨트랙트로 구현한다. 

1. Public 스마트 컨트랙트 기능

|**기능 이름**|**설명**|**Input**|**Response**|
|---|---|---|---|
|GetKYCMemberApproval()|- 요청받은 내용에 대한 KYC 정보를 전달<br>- 사용자의 민감정보를 제외한 최소한의 정보만 포함<br>- 해당 사용자(회원)의 유효기간 식별|- Address : 사용자 계정 주소|- Date : KYC 승인 유효기간<br>- String : 자격 승인 엔티티|
|UpdateKYCMember()|- 블록체인에 저장된 KYC 정보 업데이트<br>- 승인기간이 지난 사용자 또는 악의적인 활동으로 인하여 차단할 사용자 내역 업데이트|- Address : 사용자 계정 주소<br>- Date : 갱신된 날짜<br>- String : 자격 승인 엔티티<br>- String : 관리자 계정 개인키|- 성공 여부 메시지|
|CreateKYCMember()|- 새로운 회원 정보를 저장|- Address : 사용자 계정 주소<br>- Date : 갱신된 날짜<br>- String : 자격 승인 엔티티<br>- Bytes32 : 관리자 계정 개인키|- 성공 여부 메시지|

> (QUESTION) 왜 UpdateKYCMember와 CreateKYCMember의 Input에서 관리자 계정 개인키의 타입이 다른걸까? 문서상 오류일 수도 있다고 생각됨

2. Private 스마트 컨트랙트 기능

평가 또는 업데이트 목적으로 IPFS 내에 저장된 모든 IPFS 문서에 접근할 수 있는 기능을 제공한다. 위에서 언급한것처럼 IPFS에서 사용자의 KYC 문서에 접근하려면 CID가 필요하고, IPFS는 해당 값을 이용하여 특정 권한이 있는 사용자가 자신의 개인 정보에 접근할 수 있도록 할 수 있다.

![image](https://user-images.githubusercontent.com/39115630/161882668-fbddcc95-c360-478d-bc7d-8e0f34753d24.png)  
*<그림 3: IPFS 내에서 사용되는 CID 기반의 파일 시스템>*

이러한 주요 정보인 CID는 Private 스마트 컨트랙트에서 안전하게 저장되며, 특정 권한이 있는 관리자만 해당 파일에 접근하여 사용자의 CID를 선택적으로 반환해줄 수 있어야 한다. 

|**기능 이름**|**설명**|**Input**|**Response**|
|---|---|---|---|
|GetUserCID()|- KYC 문서가 포함된 경로의 CID를 반환<br>- 해당 정보에 접근하는 사용자가 이전에(어플리케이션 레벨) 보안 허가를 받은 상태임을 전제로 함<br>- 본 기능을 사용할 수 있도록 사용자의 해시된 개인키 필요|- String : 사용자 계정 ID<br>- String : 관리자의 해시된 개인키|- String : 해당 경로의 CID|
|CreateUserCID()|- KYC 문서를 IPFS에 저장한 후, 해당 경로의 CID를 블록체인에 저장하는 기능|- String : 사용자 계정 ID<br>- String : 경로(폴더) CID<br>- String : 관리자의 해시된 개인키|- 성공 여부 메시지|

### 사용 사례

블록체인에 KYC를 적용함에 있어 가장 중요한 부분은 <u>블록체인 네트워크 상에 금융 기록, 가족 상태 등 민감한 사용자 데이터가 공유되지 않는</u>것이다. 이를 위해 Permissioned 블록체인을 사용하여 사용자의 개인정보를 보호하면서 이들간의 KYC를 스마트 컨트랙트로 구조화하고 캡슐화하여 자동화 처리한다.   
위에서 언급한 스마트 컨트랙트 기능을 순서대로 나열한 구현 결과는 다음과 같다.

1. 새로운 사용자가 KYC UI에 자신의 정보를 제공한다. 
  - KYC 문서 업로드
  - KYC 유효 기간 정의(블록체인 네트워크의 일부가 되는 기간의 만료일)
2. 관리자 계정이 CreateUserCID()을 호출 -> 사용자 승인 프로세스 진행 -> KYC 문서 IPFS에 저장
4. GetUserCID()를 통해 CID를 관리자 프로필로 반환(전달) -> 사용자의 블록체인 네트워크 접근 승인
5. CreateKYCMember()를 통해 신규 회원의 네트워크 정보 생성 및 만료일 설정 -> 블록체인에 해당 내역 저장 -> 사용자에게 네트워크 접근 권한 부여
  - 관리자가 사용자의 정보와 만료 날짜를 식별하려면 GetKYCMemberApproval() 호출
  ```solidity
  # 회원의 민감하지 않은 정보는 블록체인에 저장하고, 민감한 정보는 IPFS에 저장
  # IPFS의 정보는 관리자의 승인에 의해서만 접근 가능
  struct registeredMember {
    address memberAddr;
    uint256 time;
    string approveEntity;
  }
  ```
  - UpdateKYCMember()는 회원의 유효성 검증 기간을 갱신하는 기능으로, 위 구조에서의 time 또는 approveEntity 필드의 업데이트를 통해 기간 갱신 혹은 비허가된 접근을 수행하는 회원을 차단한다.

<br>

## 결론

블록체인에 저장된 데이터는 변경될 수 없다는 특징 때문에, 블록체인에서 사용자의 개인정보를 처리하도록 설계하는 부분은 항상 중요한 점이다. 이를 위해 외부 데이터 저장소에 보관된 데이터를 참조할 수 있는 타임스탬프를 블록체인에 저장하는 방식이 주로 사용된다. 이러한 방식은 향후 데이터가 증가할때마다 외부 저장소에 이를 저장하여 유연하고 확장성있는 시스템 구성이 가능하다는 장점이 있다.  

또는 데이터가 블록체인에 저장되는 시점에 해당 데이터를 추가로 암호화하는 방법이 있다. 하지만 이 떄 사용된 키가 외부로 노출되면 모든 사람이 해당 데이터에 접근할 수 있다는 문제점이 있다. 결국 블록체인이 트랜잭션 데이터를 포함한다는 특징 때문에, 개인 정보를 어떻게 보호할 수 있는지에 대한 검토가 필수적이다.  

본 문서에서는 향후 블록체인에서 계속해서 중요해질 이슈인 KYC를 블록체인 상에 어떠한 모듈과 아키텍처로 구성할 수 있을지에 대한 아이디어를 제시한다. 이를 위해 Permissioned 블록체인의 하나인 Quorum과 IPFS를 연결하여 이를 증명한다. 

<br>

## 참고자료
- [DS Protocol - Securitize’s Digital Ownership Architecture for Complete Lifecycle Management of Digital Securities](https://s3.us-east-2.amazonaws.com/securitizemarkets.io/Securitize%E2%80%99s+Digital+Ownership+Architecture+for+Complete+Lifecycle+Management+of+Digital+Securities.pdf)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>