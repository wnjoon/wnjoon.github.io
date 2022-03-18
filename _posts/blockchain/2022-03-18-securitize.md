---
title:  "Full 블록체인으로 구성하는 STO 사례 - Securitize" 
excerpt: "증권형 토큰 발행 중 Full 노드 기반의 블록체인으로 구성한 사례를 확인한다"

categories:
  -  Blockchain
tags:
  - [Blockchain, STO]

toc: true
toc_sticky: true

date: 2022-03-18
last_modified_at: 2022-03-18
---

<br>

## 증권 거래에서 사용되는 블록체인

증권형 토큰을 발행하는 시스템을 블록체인으로 구성할 경우와 블록체인이 아닌 기존의 시스템으로 구성할 경우, 그리고 블록체인의 적용 범위에 따라 크게 3가지로 구분해볼 수 있다.  
현재 대부분의 암호화폐 거래소에서는 Hybrid 블록체인 시스템을 적용하고 있다.

|**블록체인 유무**|**노드**|**설명**|
|---|---|---|
|O|Full 블록체인|- 모든 시스템을 블록체인 기반으로 구축<br>- STO 전용 토큰을 활용|
|O|Hybrid 블록체인|- 발행, 거래 : 블록체인<br>- 매매, 원장 : 별도의 시스템에서 관리|
|X|기존의 증권거래 방식|- 현재 증권거래에서 사용되는 중개기관 형태의 시스템|

이 중 본 포스팅에서는 [Securitize](https://securitize.io/) 사에서 작성한 자료 '[DS Protocol - Securitize’s Digital Ownership Architecture for Complete Lifecycle Management of Digital Securities : User Journeys](https://s3.us-east-2.amazonaws.com/securitizemarkets.io/Securitize%E2%80%99s+Digital+Ownership+Architecture+for+Complete+Lifecycle+Management+of+Digital+Securities.pdf)'를 통해 Full 블록체인으로 STO를 구성할 경우의 발행, 배당금 지급, 투표, 매매 처리에 대한 프로세스를 알아본다.

<br>

## 발행(Issuance)

![image](https://user-images.githubusercontent.com/39115630/158927013-c520a00f-4e0b-4584-a496-f46bf08dbfe5.png)  
*<그림 1: 발행 프로세스>*

1. 발행인이 DS 발행 플랫폼 또는 DS App을 이용하여 발행에 필요한 절차를 시작
2. 발행인이 투자자를 모집하고 투자 협약 체결. 이 과정에서 KYC, AML 등의 본인인증 절차가 수행됨
3. 발행인이 Registry Service에 투자자 정보를 등록. 이 과정에서 DS 발행 플랫폼 또는 DS Protocol의 registerinverstor()를 이용하여 블록체인에 내용을 등록
4. 자금 모집이 완료되면, 발행인은 DS 발행 플랫폼을 통해 DS Token을 발행하고 이를 투자자에게 제공 

<br>

## 배당금 지급(Dividend Issuance)

![image](https://user-images.githubusercontent.com/39115630/158926929-408ace30-1bd0-43ee-977b-cb0358a24b28.png)    
*<그림 2: 특정 토큰에 대한 배당금 지급 프로세스>*

1. 발행인은 DS 발행 플랫폼을 통해 배당금 지불을 처리
2. DS 발행 플랫폼 내 issueDividends()를 이용하여 배당금을 지급할 대상과 금액을 설정
3. 배당금에 해당하는 토큰 선택
4. 투자자의 전자지갑에 배당금을 입금하고 Register Service 내용 확인 및 조치
5. 투자자에게 전송할 배당금 관련 안내 문구 작성
6. 배당금 관련 안내 문구 전달

<br>

## 투표(Voting Process)

![image](https://user-images.githubusercontent.com/39115630/158927110-e8a18b06-ffaf-48f2-87a0-22861b9a4bb4.png)  
*<그림 3: 투표 프로세스>*

1. 발행인이 투표 이벤트 생성
2. proposeVote()를 통해 투표 기능 실행
3. 투표 대상 토큰 접근
4. 투자자에게 전송할 투표 안내 문구 작성
5. 투표 안내 문구 전달
6. 투자자들은 vote()를 이용해 투표
7. 투표 기간이 종료되면, 발행인은 투표 마감
8. closeVote() 기능을 호출하여 DS App에 투표가 마감되었음을 반영
9. 토큰에 결과 입력
10. 투자자에게 투표 결과 공지 준비
11. 투자자에게 투표 결과 공지

<br>

## 매매(Trading DS Tokens)

![image](https://user-images.githubusercontent.com/39115630/158927061-b97df837-904e-48d4-901c-72edba9e0608.png)  
*<그림 4: 매매 프로세스>*

1. 토큰을 구매하고자 하는 구매자 접속
2. registerinvestor()을 이용하여 신규 투자자 등록
3. 스마트컨트랙트를 통한 거래 수행
4. transferFrom 호출 및 토큰 소유자 변경
5. 거래 적정성 유무 검증

<br>

## 참고자료
- [DS Protocol - Securitize’s Digital Ownership Architecture for Complete Lifecycle Management of Digital Securities](https://s3.us-east-2.amazonaws.com/securitizemarkets.io/Securitize%E2%80%99s+Digital+Ownership+Architecture+for+Complete+Lifecycle+Management+of+Digital+Securities.pdf)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>