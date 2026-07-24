---
title: "기관의 블록체인 채택 현황 및 Besu와 Canton 사례 분석"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-22"
slug: "institutional-network-adoption-evidence"
summary: "금융기관이 블록체인 프로젝트에 참여했다는 사실만으로 해당 네트워크를 완전히 채택했다고 볼 수는 없다. Besu와 Canton 사례를 플랫폼의 공식 기술 선택, 실제 거래·발행 참여, 재단·워킹그룹 참여로 나누고, 기관별 채택 현황을 해석할 때 필요한 근거 기준을 정리한다."
description: "금융기관이 블록체인 프로젝트에 참여했다는 사실만으로 해당 네트워크를 완전히 채택했다고 볼 수는 없다. Besu와 Canton 사례를 플랫폼의 공식 기술 선택, 실제 거래·발행 참여, 재단·워킹그룹 참여로 나누고, 기관별 채택 현황을 해석할 때 필요한 근거 기준을 정리한다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "tokenization", "Besu", "Canton", "2026"]
keywords: ["essay", "blockchain", "finance", "investment", "cryptocurrency", "tokenization", "institutional adoption", "Hyperledger Besu", "Canton Network", "2026"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "기관의 블록체인 채택 현황 및 Besu와 Canton 사례 분석"
  "description": "금융기관이 블록체인 프로젝트에 참여했다는 사실만으로 해당 네트워크를 완전히 채택했다고 볼 수는 없다. Besu와 Canton 사례를 플랫폼의 공식 기술 선택, 실제 거래·발행 참여, 재단·워킹그룹 참여로 나누고, 기관별 채택 현황을 해석할 때 필요한 근거 기준을 정리한다."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## 기관별 블록체인 네트워크 채택 현황 비교 기준

기관용 블록체인 시장 현황에 대한 뉴스들을 보면, 아래와 같은 문구들을 자주 접하게 됩니다.

- 글로벌 금융기관이 네트워크에 참여했다.
- 여러 은행이 온체인 거래를 완료했다.
- 대형 기관이 재단 회원이나 validator로 합류했다.
- 수십 개 기관이 워킹그룹과 파일럿에 참여했다.

모두 의미가 있는 내용이긴 하지만, 그렇다고해서 **해당 기관이 특정 네트워크를 핵심 업무 시스템으로 채택했다** 고 보기는 어렵습니다. 예를 들어 Bank of America가 Canton Network에서 미국 국채 금융 거래에 참여했다는 사실만으로, Bank of America의 토큰증권 표준 네트워크가 Canton이라고 단정할 수는 없습니다. BlackRock의 MMF가 Goldman Sachs의 디지털자산 플랫폼에서 토큰화됐다고 해서 BlackRock이 자체 플랫폼을 Canton 기반으로 구축했다고 볼 수도 없죠.

따라서 기관별 네트워크 채택 현황을 비교하려면 다음 세 가지를 구분해야 합니다.

| 구분 | 확인할 수 있는 사실 | 채택 근거로서의 의미 |
|---|---|---|
| 플랫폼의 기반 기술 | 운영기관이 어떤 네트워크를 실제 시스템에 사용했는가 | 가장 강한 근거 |
| 실제 거래·발행 참여 | 기관이 해당 환경에서 거래나 발행을 수행했는가 | 사용 경험을 보여주는 보조 근거 |
| 재단·워킹그룹·파일럿 참여 | 기관이 생태계에 관심을 두고 협력하는가 | 관심도와 확장성을 보여주는 참고 근거 |

이 글에서는 대다수의 기관에서 채택하고 있는 Besu와 Canton을 중심으로, 다양한 공개 자료를 기반으로 한 채택 현황을 위의 3가지 기준을 중심으로 분석해 보았습니다.

---

## 출처에 따른 신뢰도 구분

네트워크 채택 여부를 판단할 때는 출처의 성격도 중요합니다. 이 글에서는 다음 기준을 사용했습니다.

- **A 등급:** 기관 또는 플랫폼 운영사가 기반 기술을 직접 밝힌 공식 자료
- **B 등급:** 네트워크 운영사, 기술 제공사 또는 공식 파트너가 밝힌 자료 
- **보류:** 현재 운영사의 최신 공식 자료에서 기반 기술을 확인하기 어려운 사례

---

## 기반 네트워크가 공식적으로 확인된 플랫폼

기관별 기술 선택을 비교할 때 가장 먼저 살펴봐야 하는 것은 **운영 중이거나 구축 중인 플랫폼의 기반 네트워크가 공식적으로 확인** 되었는지 입니다.

| 운영기관·플랫폼 | 확인된 네트워크 | 상태·용도 | 근거 수준 |
|---|---|---|---|
| DTCC Tokenization Service | DTCC AppChain(Besu) + Canton | DTC 보관증권 디지털 트윈, 2026년 7월 실제 운영 거래 | A |
| DTCC Collateral AppChain | Besu 기반 DTCC AppChain | 멀티자산 담보 관리, 생산 전환 단계 | A |
| Broadridge DLR | Canton | 상용 기관 Repo·토큰화 담보 플랫폼 | A |
| LSEG DiSH | Canton | 토큰화 은행예금·결제 시스템 | A |
| Swift Shared Ledger | Hyperledger Besu | 토큰화 예금 기반 국경 간 결제·오케스트레이션 | A |
| HKMA Project Evergreen | Besu Layer 1 + Canton/Daml Layer 2 | 2023년 홍콩 정부 토큰화 녹색채권 발행·결제 | A |
| Goldman Sachs GS DAP | Canton/Daml 생태계 | 디지털 채권·MMF 미러 토큰 플랫폼 | B |

**DTCC**

- [2026년 7월 15일 DTC가 보관 중인 증권을 토큰으로 전환해 실제 운영 거래에 사용했다고 발표](https://www.dtcc.com/news/2026/july/15/dtcc-turns-tokenization-into-reality)
- 디지털 전환은 DTCC의 프라이빗 네트워크인 LFDT Besu와 퍼블릭 네트워크인 Canton에서 진행
- 특정 네트워크 하나만 선택하는게 아닌, **업무와 자산에 따라 여러 네트워크를 연결하는 멀티체인 전략** 추진
- DTCC Tokenization Service와 Collateral AppChain을 구분
  - DTCC Tokenization Service: DTC 보관증권의 디지털 트윈을 여러 네트워크로 제공하는 서비스
  - Collateral AppChain: Besu 기반 AppChain에서 담보 이동과 관리 처리

>  LFDT: Linux Foundation Decentralized Trust의 약자로, 과거 하이퍼레저(Hyperledger) 재단 등이 확대 개편되어 출범한 리눅스 재단 산하의 분산 신탁·블록체인 오픈소스 협력 조직

**Broadridge DLR**

- 기관 간 Repo와 담보 업무를 처리하는 상용 플랫폼
- [2023년 Canton으로 이전](https://www.broadridge.com/article/capital-markets/dlr-transacts-1-trillion-a-month)
  - 월간 거래 규모가 1조 달러에 이르며 생산 환경에서 실제 운영중
  - 다만 이 거래량은 Broadridge 플랫폼의 처리 규모이지 Canton 전체의 시장점유율을 의미하지 않음

**LSEG DiSH**

- [2026년 1월 Digital Settlement House, DiSH를 출시](https://www.lseg.com/en/media-centre/press-releases/2026/lseg-launches-digital-settlement-house)
  - DiSH: 상업은행 예금을 디지털 장부에 기록하고, 여러 통화와 네트워크 사이에서 24시간 결제를 지원하는 서비스
  - 출시 전 PoC에서, Canton Network에서 상업은행 예금을 토큰화하여 거래의 현금 결제 수단으로 사용 
  - 서비스 자체가 온체인과 기존 결제망을 함께 연결하는 개방형 구조를 목표 → DiSH가 연결하는 모든 자산과 네트워크가 Canton에서만 운영된다고 해석하기는 어려움

**Swift Shared Ledger**

- [Hyperledger Besu 기반의 EVM 호환 구조로 구축되고 있다고 공식적으로 밝힘](https://www.swift.com/news-events/news/swifts-blockchain-based-shared-ledger-progresses-mvp-implementation)
- 토큰화 예금을 가치 표현의 도구로 사용하는, 은행 간 지급 약정을 기록·검증하는 오케스트레이션 계층
- 다만 Swift의 초기 그룹에 참여하는 은행들이 각자의 자체 플랫폼에도 Besu를 표준으로 채택했다고 보기는 어려움
  - Swift: 장부 운영
  - 참여 은행: 키·자산·자금·결제 방식에 대한 권한 유지

**HKMA(홍콩금융관리국) Project Evergreen**

- [Besu Layer 1과 Canton/Daml Layer 2를 결합해 8억 홍콩달러 규모의 토큰화 녹색채권을 발행·결제](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2023/20230824e3a1.pdf)
- 기반 기술이 공식 보고서에 명시되어 있음
- 지속적으로 운영되는 범용 플랫폼이 아니라 완료된 단발성 발행 프로젝트로, Broadridge DLR이나 DTCC의 상용 서비스와 같은 기준으로 보기는 어려움

**Goldman Sachs GS DAP**

- [디지털 채권과 MMF 미러 토큰에 활용되는 플랫폼](https://www.goldmansachs.com/pressroom/press-releases/2025/bny-goldman-sachs-launch-tokenized-money-market-funds-solution)
- [플랫폼 운영기관(Canton)이 직접 네트워크를 명시](https://www.canton.network/faq)

---

## 실제 거래 참여 현황

특정 네트워크에서 실제 거래나 발행을 수행한 경험은 파일럿보다 의미가 큽니다. 그러나 앞서 말했듯이, 참여 기관 각각이 그 네트워크를 전략적 표준으로 채택했다는 뜻은 아닙니다.

| 거래·프로젝트 | 주요 참여 기관 | 사용 환경 | 확인되는 사실 |
|---|---|---|---|
| DTCC 2026년 7월 생산 거래 | BlackRock, BNP Paribas Securities, Circle, Citadel Securities, CME, Goldman Sachs, J.P. Morgan, Nasdaq, NYSE, State Street, Vanguard, Virtu 등 30곳 이상 | Besu + Canton | 기관들이 DTC 토큰화 자산을 이용한 실제 운영 거래에 참여 |
| Canton 미국 국채 온체인 금융 | Bank of America, Circle, Citadel Securities, Cumberland DRW, DTCC, Société Générale, Tradeweb, Virtu 등 | Canton | 온체인 미국 국채와 USDC를 이용한 금융·결제 수행 |
| Canton 후속 국채 Repo·담보 재사용 | Bank of America, Circle, Citadel Securities, Cumberland DRW, M1X Global, Société Générale, Tradeweb, Virtu 등 | Canton | 실시간 담보 재사용과 후속 온체인 Repo 수행 |
| BNY·GS DAP 토큰화 MMF | BlackRock, BNY Investments Dreyfus, Federated Hermes, Fidelity Investments, Goldman Sachs Asset Management | GS DAP | MMF 지분의 미러 토큰화 초기 출시에 참여 |
| HKMA 토큰화 녹색채권 | 홍콩 정부, Bank of China (Hong Kong), Crédit Agricole CIB, Goldman Sachs, HSBC | Besu + Canton/Daml | 8억 홍콩달러 규모 채권의 발행·결제 수행 |
| LSEG DiSH PoC·출시 | LSEG와 참여 금융기관 컨소시엄 | Canton | 상업은행 예금을 토큰화해 현금 결제 수단으로 사용 |

**DTCC 실제 운영 거래**

- [담보 제공, 증권대차, 미국 국채·Repo DVP, 주식 DVP와 DVD, 주식 토큰 이전, 중앙청산소 증거금 업무 포함](https://www.dtcc.com/news/2026/july/15/dtcc-turns-tokenization-into-reality)
  - DVP(Delivery versus Payment): 증권 인도와 대금 지급을 동시에 처리하는 방식
  - DVD(Delivery versus Delivery): 서로 다른 자산의 인도를 동시에 맞바꾸는 방식입니다.
- 발표에는 참가 기관 전체가 공개됐지만, 각 기관이 Besu와 Canton 중 어느 환경을 사용했는지는 공개되지 않음
  - Nasdaq, NYSE 또는 Vanguard가 DTCC 거래에 참여했다는 사실을 해당 기관의 Besu 또는 Canton 채택 근거로 나눠 계산하기 어려움

**Canton의 미국 국채 온체인 금융 및 후속 Repo**

- Bank of America를 포함한 기관들이 [Canton에서 실제 금융 거래를 수행](https://blog.digitalasset.com/press-release/digital-asset-and-industry-working-group-complete-groundbreaking-on-chain-us-treasury-financing-on-canton-network)하고 [담보 재사용을 포함한 후속 거래](https://blog.digitalasset.com/press-release/the-canton-networks-industry-working-group-demonstrates-next-phase-of-onchain-u.s.-treasury-financing-on-canton-network)를 진행
- 하지만 거래 참여만 가지고 기관의 자체 원장이나 핵심 시스템 전체가 Canton으로 이전됐다고 보기는 어려움

---

## 재단 가입, 파일럿 참여

재단 회원, validator, 워킹그룹, 파일럿 참여는 네트워크의 제도적 신뢰와 확장 가능성을 살펴보는 데 유용합니다. 하지만 실제 플랫폼 채택이나 거래량과는 분리해야 합니다.

| 생태계·프로그램 | 참여 기관 | 참여 형태 | 해석상 한계 |
|---|---|---|---|
| Canton Foundation | DTCC | Euroclear와 공동 의장 | 거버넌스 참여가 DTCC 업무 전체의 Canton 이전을 의미하지 않음 |
| Global Synchronizer Foundation | Goldman Sachs, HKFMI, Moody’s Ratings 등 | 재단 회원 | 회원 가입만으로 실제 발행·거래 시스템 채택을 입증할 수 없음 |
| Canton RWA 파일럿 | BNY Mellon, Broadridge, DRW, EquiLend, Goldman Sachs, Paxos 등 | 애플리케이션·시장 전문성 제공, 모의 거래 | 생산 거래와 파일럿을 구분해야 함 |
| DTCC Industry Working Group | 50곳 이상의 금융기관·시장 참여자 | 서비스 설계와 운영 준비 협력 | 기관별로 Besu와 Canton 중 무엇을 사용했는지 알 수 없음 |
| Swift Shared Ledger 초기 그룹 | 17개 은행 | 초기 사용과 파일럿 거래 준비 | Swift의 Besu 선택과 각 은행의 자체 기술 선택은 별개 |
| Canton Network 초기 참여 그룹 | BNP Paribas, Deutsche Börse, Goldman Sachs, Broadridge, Cboe, EquiLend 등 | 네트워크 출범과 상호운용성 테스트 | 기관별 생산 시스템과 거래 규모를 별도로 확인해야 함 |

**DTCC의 Canton Foundation 거버넌스 참여**

- DTCC의 생태계에 대한 장기적인 관심과 영향력을 보여주지만, DTCC가 운영하는 모든 업무 시스템을 Canton으로 전환한다고 볼 수는 없음
- 실제로 DTCC는 Besu 기반 AppChain과 Canton을 함께 사용하는 멀티체인 전략 추진


**[Canton의 RWA 파일럿](https://www.canton.network/canton-network-press-releases/the-canton-network-completes-the-most-comprehensive-blockchain-pilot-to-date-for-tokenized-real-world-assets)**

- 여러 대형 금융기관이 참여했다는 사실은 기관 수요와 상호운용성 실험의 범위를 보여주지만, 모의 거래에 참여한 기관 수를 상용 플랫폼 고객 수나 실제 거래 기관 수로 해석하기는 어려움

---

## 현재 표에서 제외하거나 보류해야 하는 사례

과거 자료나 업계의 일반적인 인식만으로 기반 기술을 단정하기 어려운 사례도 있습니다.

| 기관·플랫폼 | 보류 이유 |
|---|---|
| Fnality | Besu 사용은 LFDT의 과거 기술자료에서 확인되지만, 현재 Fnality 공식 제품 페이지가 기반 기술을 명시하지 않음 |
| J.P. Morgan Kinexys | Quorum 계열의 private permissioned Ethereum 플랫폼이라는 점은 확인되지만, 현재 실행 클라이언트가 Besu인지 공식적으로 확인되지 않음 |
| HSBC Orion | 디지털 채권 플랫폼 운영은 확인되지만, 최신 공식 자료만으로 기반 네트워크를 Besu 또는 Canton이라고 단정하기 어려움 |
| Nasdaq·NYSE·Vanguard 등 DTCC 참가사 | DTCC 거래 참여는 확인되지만, 각 기관이 Besu와 Canton 중 어느 환경을 이용했는지 공개되지 않음 |

**Fnality**

- Linux Foundation의 생태계 개편도 함께 고려해야 함
  - 기존 Hyperledger 생태계는 2024년 LF Decentralized Trust로 편입됐고, Hyperledger Besu의 공식 프로젝트명도 Besu로 변경되었음
  - 따라서 과거 문서의 기술 명칭과 현재 제품 구조가 동일하게 유지되는지 별도로 확인 필요

**Kinexys**

- Ethereum 계열이라는 설명만으로 Besu라고 분류하기 어려움 → EVM 호환성, Quorum의 계보, 실행 클라이언트의 실제 선택은 서로 다른 문제

---

## 네트워크 점유율을 계산할 때 생기는 오류

위의 세 표를 단순히 합산하면 기관별 중복과 근거 수준의 차이가 사라집니다.

- 한 기관이 Canton Foundation 회원이면서 RWA 파일럿과 미국 국채 거래에도 참여했다면, 이를 세 개의 독립적인 채택으로 계산할 수 없음
- 반대로 DTCC처럼 Besu와 Canton을 서로 다른 업무에 함께 사용하는 기관을 하나의 네트워크에만 배정하는 것도 실제 구조를 왜곡할 수 있음

기관 채택이나 시장점유율을 비교하려면 최소한 다음 항목을 따로 기록해야 합니다.

- 플랫폼 운영 주체가 누구인가?
- 기반 네트워크를 누가 공식적으로 밝혔는가?
- 파일럿인가, 실제 운영 환경인가?
- 일회성 발행 프로젝트인가, 지속 운영되는 플랫폼인가?
- 참여 기관이 직접 노드를 운영하는가?
- 실제 자산과 현금이 이동했는가, 모의 거래인가?
- 거래량은 개별 플랫폼 기준인가, 네트워크 전체 기준인가?
- 동일 기관과 프로젝트가 여러 항목에 중복 포함됐는가?

따라서 가장 안전한 방법은 **플랫폼 수, 실제 거래 사례 수, 생태계 참여 기관 수를 각각 별도의 지표로 표시하는 것** 입니다. 하나의 숫자로 합치기보다 근거의 종류를 함께 보여주는 편이 실제 채택 수준을 더 정확하게 설명할 수 있습니다.

---

## Besu와 Canton 사례에서 보이는 차이

공개 자료를 기준으로 보면 Besu와 Canton은 모두 기관 금융 인프라에 사용되고 있지만, 확인되는 채택 형태에는 차이가 있습니다.

**Besu**

- DTCC의 프라이빗 AppChain, Swift Shared Ledger, HKMA Project Evergreen의 기반 계층
- **기관이 통제하는 전용 원장이나 EVM 호환 인프라** 
- 운영 주체가 명확하고 기존 시스템과 통합하기 쉬운 구조에서 채택

**Canton**

- Broadridge DLR, LSEG DiSH, DTCC Tokenization Service, 미국 국채 금융 거래
- **서로 다른 기관과 애플리케이션 사이의 연결과 동시 결제**
- 재단과 워킹그룹, 파일럿 참여 기관도 폭넓게 공개돼 있어 생태계 관여도를 확인하기 쉬움

다만 이것만으로 어느 네트워크의 시장점유율이 더 높다고 결론내릴 수는 없습니다.
Besu는 기관 내부의 프라이빗 배포가 외부에 모두 공개되지 않을 수 있고, Canton은 생태계 참여 정보가 상대적으로 많이 공개되기 때문에 단순 기관 수 비교에서 더 크게 보일 수 있습니다. 
공개 정보의 양과 실제 채택 규모는 같은 개념이 아닙니다.

---

## 결론

금융기관의 블록체인 채택을 판단할 때 가장 강한 근거는 **기관이나 플랫폼 운영사가 실제 시스템의 기반 기술을 직접 밝힌 공식 자료** 입니다. 
그 다음 실제 거래와 발행 경험이며, 재단 가입·validator·워킹그룹·파일럿 참여는 생태계 관심도를 보여주는 *참고 근거* 로 보는 것이 적절합니다.

현재 공개 자료에서 확인되는 핵심 내용들은 다음과 같습니다.

- DTCC는 Besu 기반 프라이빗 AppChain과 Canton을 함께 사용하는 멀티체인 전략을 추진하고 있음
- Broadridge DLR과 LSEG DiSH에서는 Canton 기반의 상용 또는 출시 사례가 확인됨
- Swift Shared Ledger는 Hyperledger Besu 기반의 EVM 호환 구조로 구현되고 있음
- HKMA Project Evergreen은 Besu와 Canton/Daml을 결합한 실제 채권 발행 사례이지만, 지속 운영 플랫폼과는 구분 필요
- GS DAP은 Canton/Daml 생태계와 연결되지만, 운영기관의 직접적인 네트워크 명시 여부를 고려해 한 단계 신중하게 분류할 필요가 있음
- 거래·재단·파일럿에 참여한 기관의 이름을 곧바로 자체 네트워크 채택으로 해석할 수 없음

| 질문 | 판단 |
|---|---|
| 플랫폼 운영기관이 기반 네트워크를 직접 밝혔는가? | 핵심 채택 근거로 사용 가능 |
| 기관이 실제 거래에 참여했는가? | 사용 경험은 확인되지만 자체 플랫폼 채택과는 구분 필요 |
| 재단 회원이나 워킹그룹에 참여했는가? | 관심도와 생태계 관여의 근거 |
| 파일럿에 참여했는가? | 기술 검증 경험의 근거이며 생산 거래와는 다름 |
| 여러 표에 같은 기관이 등장하는가? | 중복 제거 없이 합산하면 안 됨 |
| 기관별 사용 네트워크가 공개되지 않았는가? | Besu 또는 Canton 채택으로 개별 분류하면 안 됨 |
| 과거 자료에만 기반 기술이 명시돼 있는가? | 최신 공식 자료 확인 전까지 보류하는 편이 안전 |

---

## 출처

- [DTCC — DTCC Turns Tokenization into Reality](https://www.dtcc.com/news/2026/july/15/dtcc-turns-tokenization-into-reality)
- [DTCC — Tokenization](https://www.dtcc.com/digital-assets/tokenization)
- [DTCC — Collateral AppChain](https://www.dtcc.com/digital-assets/collateral-appchain)
- [Broadridge — DLR Transacts $1 Trillion a Month](https://www.broadridge.com/article/capital-markets/dlr-transacts-1-trillion-a-month)
- [Broadridge — Billions in Average Daily Processed Trade Volumes on DLR](https://www.broadridge.com/press-release/2025/billions-in-average-daily-processed-trade-volumes-on-broadridge-dlt-repo-platform)
- [LSEG — LSEG Launches Digital Settlement House](https://www.lseg.com/en/media-centre/press-releases/2026/lseg-launches-digital-settlement-house)
- [Swift — Shared Ledger Progresses to MVP Implementation](https://www.swift.com/news-events/news/swifts-blockchain-based-shared-ledger-progresses-mvp-implementation)
- [Swift — Blockchain Ledger Ready for Use](https://www.swift.com/news-events/press-releases/swifts-blockchain-ledger-ready-use-17-banks-set-pioneer-tokenised-cross-border-payments-trusted-global-infrastructure)
- [HKMA — Project Evergreen Report](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2023/20230824e3a1.pdf)
- [Goldman Sachs — BNY and Goldman Sachs Launch Tokenized MMF Solution](https://www.goldmansachs.com/pressroom/press-releases/2025/bny-goldman-sachs-launch-tokenized-money-market-funds-solution)
- [BNY — BNY and Goldman Sachs Launch Tokenized MMF Solution](https://www.bny.com/corporate/global/en/about-us/newsroom/company-news/bny-and-goldman-sachs-launch-tokenized-money-market-funds-solution.html)
- [Canton Network — FAQ](https://www.canton.network/faq)
- [Digital Asset — On-chain U.S. Treasury Financing on Canton](https://blog.digitalasset.com/press-release/digital-asset-and-industry-working-group-complete-groundbreaking-on-chain-us-treasury-financing-on-canton-network)
- [Digital Asset — Next Phase of On-chain U.S. Treasury Financing](https://blog.digitalasset.com/press-release/the-canton-networks-industry-working-group-demonstrates-next-phase-of-onchain-u.s.-treasury-financing-on-canton-network)
- [Canton Network — RWA Pilot Results](https://www.canton.network/canton-network-press-releases/the-canton-network-completes-the-most-comprehensive-blockchain-pilot-to-date-for-tokenized-real-world-assets)
- [Canton Network — Global Synchronizer Foundation Members](https://www.canton.network/canton-network-press-releases/goldman-sachs-hkfmi-and-moodys-ratings-join-the-global-synchronizer-foundation)
- [Canton Network — Network Launch](https://www.canton.network/canton-network-press-releases/canton-network-press-release)
- [LF Decentralized Trust — Launch Announcement](https://www.lfdecentralizedtrust.org/announcements/linux-foundation-decentralized-trust-launches-with-17-projects-100-founding-members)
