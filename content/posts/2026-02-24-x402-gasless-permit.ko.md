---
title: "x402는 어떻게 가스비 없이 결제를 할 수 있을까?"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-02-24"
slug: "x402-gasless-permit"
summary: "x402 클라이언트는 EIP-3009 규격의 데이터를 EIP-712 형식에 맞춰서 서명합니다. EIP-3009의 또다른 이름은 TransferWithAuthorization 입니다. 이를 통해 x402 안에서 gasless한 transfer가 가능합니다."
description: "x402 클라이언트는 EIP-3009 규격의 데이터를 EIP-712 형식에 맞춰서 서명합니다. EIP-3009의 또다른 이름은 TransferWithAuthorization 입니다. 이를 통해 x402 안에서 gasless한 transfer가 가능합니다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "x402", "blockchain", "cryptocurrency", "ethereum", "open-source", "2026"]
keywords: ["x402", "ethereum", "gasless", "permit", "transfer", "authorization", "EIP-3009", "EIP-712", "Permit2"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "x402는 어떻게 가스비 없이 결제를 할 수 있을까?"
  "description": "x402 클라이언트는 EIP-3009 규격의 데이터를 EIP-712 형식에 맞춰서 서명합니다. EIP-3009의 또다른 이름은 TransferWithAuthorization 입니다. 이를 통해 x402 안에서 gasless한 transfer가 가능합니다."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## EIP-712와 EIP-3009의 관계

결론부터 말하자면, x402 클라이언트는 EIP-3009 규격의 데이터를 EIP-712 형식에 맞춰서 서명합니다.

- EIP-712: 서명 데이터를 어떻게 구조화해서 지갑에 보여줄 것인가에 대한 표준 규격입니다. (상자/틀)
- EIP-3009: 가스비 없이 토큰을 전송하기 위해 어떤 데이터를 담을 것인가에 대한 약속입니다. (내용물)

## EIP-712

기존의 `eth_sign` 방식은 서명할 데이터가 16진수 해시값으로만 보여서 사용자가 무엇에 서명하는지 알기 어려웠습니다. 

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_sign",
  "params": [
    "0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", // Address
    "0xdeadbeaf"                                  // Message (hex-encoded)
  ]
}
```

EIP-712는 이를 개선하여 EIP-3009라고 불리는 구조화된 데이터(Typed Data)를 서명할 수 있게 합니다. 

## EIP-3009

EIP-3009는 **Transfer with Authorization**이라는 이름에서 알 수 있듯, 사용자가 가스비(네트워크 수수료)를 내지 않고도 오프라인 서명만으로 토큰 전송을 승인할 수 있게 만든 표준입니다. USDC가 이 표준을 채택하고 있고, x402와 같은 결제 프로토콜의 핵심 기반 기술이 됩니다.

### 해결하고자 하는 문제

기존 ERC-20 토큰 전송은 항상 두 단계가 필요했습니다.

1. Approve: 내 토큰을 가져가도 좋다고 승인 (가스비 발생)
2. TransferFrom: 실제 토큰 이동 (가스비 발생)

이 방식은 사용자 지갑에 가스비용 코인(ETH 등)이 반드시 있어야 하고, 두 번이나 트랜잭션을 보내야 해서 매우 번거롭습니다. EIP-3009는 **내가 서명한 종이(Authorization)를 줄 테니, 네가 가스비 내고 가져가**라는 방식을 가능하게 합니다. 

기존에도 EIP-2612에서 Permit 사용이 가능했지만, 여전히 Approve를 위한 트랜잭션 전송 과정이 필요했었습니다. EIP-3009에서는 서명을 가지고 직접 전송할 수 있도록 하기 때문에, 트랜잭션의 갯수를 줄이고 가스비를 절약하는 효과가 있습니다. 물론 불필요한 네트워크 트래픽도 줄일 수 있죠.

x402의 목표 중 하나는 **인터넷을 사용하는 기기(AI 에이전트 등)가 스스로 결제하게 만드는 것**입니다. AI 에이전트의 경우 ETH 같은 가스비용 코인을 직접 관리하기 어려운데요, AI가 사용자가 미리 서명해준 EIP-3009 권한을 사용하여 리소스 서버에 이 서명을 제출하기만 하면 됩니다. 서버나 퍼실리테이터가 가스비를 대신 내주고 결제를 완료하므로, AI는 끊김 없이 유료 데이터를 받아볼 수 있습니다.

### 주요 특징

- 가스리스 (Gasless): 사용자는 서명만 하면 됩니다. 실제 트랜잭션은 서버(또는 퍼실리테이터)가 전송합니다.
- 단일 트랜잭션: `approve` 과정 없이 한 번의 전송(`TransferWithAuthorization`)만 하면 됩니다.
- 초소액 결제(Micropayment)에 최적: 가스비 부담을 서버가 지거나 배치(Batch)로 처리할 수 있어 소액 결제에 유리합니다.
- 유효 기간 설정 가능: `validAfter`와 `validBefore` 필드를 통해 서명이 언제부터 언제까지 유효한지 제어할 수 있습니다.

### 초소액 결제

여기서 우리는 초소액 결제라는 단어에 의문을 가질 수 있습니다. 실제로 가스비(트랜잭션 수수료)는 결제 금액에 따라 달라지지 않거든요. 블록체인 네트워크 입장에서는 **데이터를 기록**하는 것은 동일하기 때문에, 수수료는 동일합니다.

EIP-3009가 말하는 초소액 결제는 **퍼실리테이터가 가스비를 대납**함으로써 사용자의 가스비 부담을 거의 0으로 만든다는 것에 있습니다. 사용자가 직접 트랜잭션을 날리는 것이 아니라 서명만 서버에 제출하고, 퍼실리테이터가 최종적으로 가스비를 내고 트랜잭션을 전송하는 방식입니다. 결국 가스비 부담이 사라진 사용자는 매우 작은 단위의 결제도 부담없이 할 수 있게 된다는 의미입니다.

이 경우 퍼실리테이터를 운영하는 곳에서는 가스비를 대납해줌으로써 발생하는 손해가 있을겁니다. 퍼실리테이터는 여러 사용자로부터 받은 수많은 결제 서명들을 한번의 트랜잭션으로 배치(Batch) 처리함으로써 이러한 문제를 해결합니다. 

이때 배치를 통해 온체인에 기록되기 전까지 해당 결제 데이터는 오프라인 상태의 서명 데이터로 남게 되는데요, 만약 잘못된 내용의 결제가 존재한다면 어떻게 해야할까요? 

배치가 완료되기 전까지 사용자가 서버에 전달한 EIP-3009 서명은 나중에 이 서명을 은행(블록체인)에 제출하면 내 계좌에서 돈을 빼가도 좋다는 약속이 담긴 수표와 같습니다. 서버는 이 수표를 받자마자 은행에 가진 않지만, 수표가 진짜인지(서명 유효성), 잔고는 있는지(Balance Check)를 오프라인에서 즉시 확인할 수 있습니다. 확인 결과 문제가 없다면, 실제 돈이 입금되기 전이라도 서버는 리소스(데이터 등)를 먼저 제공합니다. (이를 Optimistic UI/Execution이라고도 부릅니다)

배치 처리 전이나 처리 과정에서 다음과 같은 문제가 생길 수 있습니다.

- 잔액 부족 (Insufficient Balance): 서명을 보낼 때는 잔액이 있었는데, 서버가 배치를 돌리기 전에 사용자가 다른 곳으로 돈을 다 옮겨버린 경우입니다. 서버는 사용자의 잔액을 실시간으로 모니터링하여, 잔액이 부족해지면 즉시 리소스 접근 권한을 박탈하거나 해당 사용자를 블랙리스트에 등록합니다. 또한, 중요도가 높은 결제라면 배치를 기다리지 않고 즉시 처리하도록 우선순위를 부여합니다.
- 이중 지불 (Double Spending): 하나의 논스로 여러 번 결제를 시도하거나, 이미 사용된 서명을 다시 보내는 경우입니다. 서버는 메모리나 Redis 등에 `used_nonces`를 기록하여 중복된 서명이 들어오면 `402` 에러를 다시 던져 거절합니다. 온체인에서는 스마트 컨트랙트 자체가 동일한 논스의 재사용을 허용하지 않으므로, 퍼실리테이터가 배치를 올려도 블록체인에서 최종적으로 거절(`Revert`)됩니다.

실제 업무에서는 리스크 관리(Risk Management) 차원에서 접근합니다. 소액 리소스의 경우 결제 성공 여부와 상관없이 서명만 확인하고 바로 리소스를 제공하기도 합니다. 만약 고액 리소스의 경우 서버에서 결제가 온체인에서 확정될때까지 기다리도록 요청한 후, 배치에 등록하지 않고 바로 트랜잭션을 전송하여 확인을 받을 수도 있습니다.

### 데이터 구조

```typescript
const types = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },        // Sender
    { name: "to", type: "address" },          // Receiver
    { name: "value", type: "uint256" },       // Amount
    { name: "validAfter", type: "uint256" },  // Valid After
    { name: "validBefore", type: "uint256" }, // Valid Before
    { name: "nonce", type: "bytes32" }        // Nonce
  ]
};
```

### ValidAfter와 ValidBefore

`ValidAfter`는 토큰 전송이 유효한 시작시간을, `ValidBefore`는 토큰 전송이 유효한 종료시간을 나타냅니다. `ValidAfter`를 0으로 설정하면 현재시간부터 즉시 유효한 토큰이 됩니다. 일반적으로 `ValidBefore`는 `ValidAfter`보다 60초(1분) 뒤의 값으로 설정합니다. 유효 기간이 길어질수록 서명 도용 위험이 높아지기 때문입니다.

### Nonce

이더리움 계정(EOA)에도 논스가 존재합니다. EOA 논스의 경우 순차적으로 증가하는데 반해, EIP-712나 EIP-3009 서명에서 사용하는 논스는 무작위 값(Random Bytes)을 사용합니다. 

| 구분	| 이더리움 계정 논스 (EOA Nonce) | x402/EIP-3009 결제 논스 |
| --- | --- | --- |
| 목적	| 트랜잭션의 순서 보장 및 중복 방지	| 동일 서명의 재사용(Replay) 방지 |
| 작동 방식	| 0, 1, 2... 순차적으로 증가해야 함 |	어떤 값이든 이전에 쓴 적만 없으면 됨 |
| 관리 주체	| 이더리움 네트워크(노드) | 스마트 컨트랙트 내 `usedNonces` 맵 |
| 생성 방식	| `last_nonce` + 1 | `crypto.randomBytes(32)` (랜덤) |

왜 EIP-712에서는 논스를 무작위 값으로 설정할까요? x402 결제의 특성 때문인데요, 오프라인에서 비동기적으로 일어날 수 있기 때문입니다. 

- 동시성 문제: 만약 논스가 순차적(0, 1, 2...)이어야 한다면, AI 에이전트가 여러 리소스 서버에 동시에 결제를 요청할 때마다 다음 논스가 무엇인지를 매번 온체인에서 확인하거나 중앙 서버에서 관리해야 합니다. 이는 성능 병목을 일으킬 수 있습니다.
- 충돌 방지: 32바이트(256비트) 무작위 값은 $2^{256}$개의 다른 값을 가질 수 있으며, 이는 약 $10^{77}$입니다. 이는 우주에 있는 원자 수와 비슷한 수준의 어마어마하게 큰 수입니다. 따라서 클라이언트는 서버나 블록체인에 물어볼 필요 없이 즉석에서 랜덤 논스를 생성해 서명할 수 있습니다.

그래서 스마트 컨트랙트에서는 사용된 논스인지 여부만을 검증하도록 되어있습니다.

```solidity
// 스마트 컨트랙트 예시 코드
mapping(address => mapping(bytes32 => bool)) public usedNonces;

function _useNonce(address authorizer, bytes32 nonce) internal {
    require(!usedNonces[authorizer][nonce], "NONCE_ALREADY_USED");
    usedNonces[authorizer][nonce] = true; // 사용된 논스로 기록
}
```

일반적으로 논스는 클라이언트에서 생성합니다. 위에서 언급한것처럼 논스가 중복될 확률은 0에 가까운데다가, 퍼실리테이터(Facilitator) 또는 컨트랙트에서 추가로 검증이 되기 때문에 문제가 되지 않습니다. 

```go
// createEIP3009Payload(): go/mechanism/evm/exact/client/schema.go
// -> CreateNonce(): go/mechanism/evm/utils.go

// CreateNonce generates a random 32-byte nonce for EIP-3009
func CreateNonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}
	return "0x" + hex.EncodeToString(nonce), nil
}
```

### Permit2

코드를 살펴보면 EIP-3009 외에도 **Permit2**라는 프로토콜이 존재합니다. 그리고 이 두개의 프로토콜은 서로 다른 논스 형식을 갖고 있습니다.

```go
//go/mechanism/evm/utils.go

// CreateNonce generates a random 32-byte nonce for EIP-3009
func CreateNonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}
	return "0x" + hex.EncodeToString(nonce), nil
}

// CreatePermit2Nonce generates a random 256-bit nonce for Permit2.
// Permit2 uses uint256 nonces (not bytes32 like EIP-3009).
func CreatePermit2Nonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}
	// Convert to uint256 string representation
	nonceInt := new(big.Int).SetBytes(nonce)
	return nonceInt.String(), nil
}
```

Permit2는 Uniswap에서 개발한 **차세대 토큰 승인(Approval) 공유 프로토콜**입니다.

기존에는 새로운 앱(DEX 등)을 쓸 때마다 approve 트랜잭션을 따로 보내야 해서 번거롭기도 했지만, 무엇보다 가스비가 이중으로 들어가서 비효율적이었습니다. 이러한 귀찮음 때문에 보통 무한 승인을 해두는 경우가 많았고, 결국 앱의 해킹으로 지갑에 있는 모든 자산이 위험해지는 문제가 있었습니다.

사용자는 `Permit2` 컨트랙트에 대해서만 딱 한 번 무한 승인을 해둡니다. 이후 다른 앱(예: x402 지원 서비스)을 이용할 때는 가스비를 내는 트랜잭션 대신, EIP-712 서명만 생성해서 앱에 전달합니다. 앱은 사용자의 서명을 `Permit2`에 제출하고, `Permit2`는 서명을 검증한 뒤 앱이 요청한 만큼의 토큰만 옮겨줍니다.

그렇다면 논스의 형식이 왜 다른걸까요? 이유는 각 표준이 논스를 해석하는 방식에 차이가 있기 떄문입니다.

**EIP-3009 (bytes32)**

- 주로 서명 기반 전송(Transfer with Authorization)을 위해 설계되었습니다.
- 논스를 단순히 중복을 막기 위한 32바이트 데이터로 취급합니다. 그래서 보통 16진수(0x...) 문자열을 그대로 사용합니다.
- 특정 토큰(USDC 등)이 자체적으로 지원하는 가스리스(Gasless) 전송 표준입니다.

**Permit2 (uint256)**

- Uniswap 생태계 등에서 더 복잡한 주문(Order)과 만료 시간을 관리합니다.
- 내부적으로 숫자로 관리하며, 논스 값을 비트마스킹(Bitmasking)하여 여러 개의 주문을 병렬로 처리하기도 합니다. 그래서 10진수 숫자 문자열(`big.Int`)로 변환하여 처리하는 것이 일반적입니다.
- 모든 ERC-20 토큰에 대해 가스리스 서명 기능을 부여하기 위한 관리 컨트랙트입니다.

x402에서는 Permit2 사용자도 가스비 없이 리소스 서버에 접근할 수 있도록 하기 위해 이러한 구조를 적용한 것으로 보입니다.

## 정리

결국 x402가 EIP-3009와 Permit2를 적극적으로 수용하는 이유는 **결제 경험의 추상화**에 있습니다. 사용자는 자신의 지갑에 가스비가 있는지, 논스가 몇 번인지 고민할 필요가 없습니다. 그저 신뢰할 수 있는 인터페이스(EIP-712)를 통해 서명만 하면 됩니다.

이러한 가스리스(Gasless) 인프라는 특히 사람이 일일이 개입할 수 없는 AI 에이전트 경제에서 핵심적인 역할을 할 것입니다. 복잡한 온체인 로직은 퍼실리테이터와 스마트 컨트랙트가 뒤에서 묵묵히 처리하고, 사용자와 서비스 제공자는 오직 '가치 있는 리소스의 교환'에만 집중할 수 있는 세상. 그것이 x402가 꿈꾸는 블록체인 기반 인터넷의 모습으로 보입니다.