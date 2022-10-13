---
layout: post
title: "이더리움은 왜 RLP 인코딩을 사용할까?" 
excerpt: "RLP는 Recursive Length Prefix의 약자로, '특정 데이터에 정해진 규칙을 반복적으로 적용하는 인코딩 방식' 이다. 이더리움에서 RLP를 사용하는 이유는 크게 구현의 단순성(Simplicity of implementation)과 언제나 일관된 바이트 형태를 보장(Guaranteed absolute byte-perfect consistency)하기 때문이다."
date:   2022-09-12 15:00:00 +0900
categories: blockchain
tags: [ethereum, RLP, encoding]
---

<br>

## RLP란?

RLP는 Recursive Length Prefix의 약자로, 직역하면 '반복 길이 접두어'이다. 이렇게 보면 당최 무슨 의미인지 알 수 없는데, 쉽게 표현하면 '특정 데이터에 정해진 규칙을 반복적으로 적용하는 인코딩 방식' 이다.  

> 인터넷을 잘 찾아보면 RLP의 규칙에 대해 자세히 적어놓은 글들이 많다. 사실 이더리움과 같은 코어 시스템을 직접 만든다 할지라도, RLP와 같은 인코딩 기능은 'Well-made'된 라이브러리를 그대로 사용하는 경우가 많기 때문에 본 포스팅에서도 RLP에 대한 자세한 내용을 담지는 않는다.

RLP는 매우 최소화된 직렬화 인코딩 방식으로, 위에서 언급한 Protobuf, BSON 등 다양한 솔루션들과 다르게 boolean, float, double, 심지어 integer와 같은 타입을 전혀 다루지 않는다. 대신 RLP는 오로지 중첩된 배열 구조로 이루어진 데이터를 '저장'한다. 그 데이터가 어떠한 의미를 가졌는지는 프로토콜에서 알아서 판단하라는 것이다.

Key/Value 형태의 맵 구조 또한 공식적으로는 지원되지 않지만,  [[k1, v1], [k2, v2], ...] 와 같이 K' 키 값을 갖는 문자열 배열 형태로 데이터를 변환하여 처리하는 'semi-official' 방식이 존재하기도 한다.

<br>

## 이더리움과 RLP

사실 중요한건 '이더리움은 왜 RLP 인코딩 방식을 적용했는가?'이다. 사실 Protobuf, BSON 등 인코딩 방식은 꽤 다양하게 존재한다. 이에 대해 [Ethereum Wiki](https://github.com/ethereum/wiki/wiki/%5BKorean%5D-White-Paper) 에서 답변한 내용이 있어서 포스팅을 통해 공유하고자 한다.

이더리움에서 RLP를 사용하는 이유는 크게 구현의 단순성(Simplicity of implementation)과 언제나 일관된 바이트 형태를 보장(Guaranteed absolute byte-perfect consistency)하기 때문이다.

(Semi-official한 방법이 존재하기는 하지만) 일반적으로 Key/Value 맵 구조는 명시적으로 순서가 정해져있지 않는다. 즉, 데이터의 순서에 따라 결과가 달라질 수 있는 직렬화 인코딩 방식에는 사용이 불가능하다.  

실수형(Float) 타입은 다양한 특수 케이스들이 존재할 수 있다. 어디까지 소수점을 적용할지부터, 시스템의 특성에 따라 값이 반올림되기도, 버림처리되기도 한다. 결국 다양한 타입을 허용할수록 잠재적인 값의 변형이 발생할 수 있는 확률이 매우 높아지게 된다.

결론적으로, 인코딩하기 위한 데이터의 결과값이 항상 동일하기 위해서는 값의 변형이 발생할 수 있는 확률을 최대한으로 줄이는 것이 필요하다. 그리고 이를 위해 이더리움은 (중첩된 배열이지만) 문자열로 표현된 데이터만을 처리하는 RLP 방식을 이용하여, 데이터를 바이트 형태로 인코딩하는 것으로 보인다.

<br>

## 참고자료

- [Ethereum Wiki](https://github.com/ethereum/wiki/wiki/%5BKorean%5D-White-Paper)
- [Why was RLP chosen as the low level protocol encoding algorithm? - StackExchange](https://ethereum.stackexchange.com/questions/19092/why-was-rlp-chosen-as-the-low-level-protocol-encoding-algorithm)
- [RLP 인코딩 및 디코딩 - intrepidgeeks](https://intrepidgeeks.com/tutorial/rlp-encoding-and-decoding)