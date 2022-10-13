---
layout: post
title:  "Design Pattern: Singleton pattern" 
excerpt: "클래스 별로 오직 하나의 객체만을 갖도록 하는 싱글톤 패턴에 대해 알아본다."
date:   2021-11-02 15:00:00 +0900
categories: swe
tags: [design pattern]
---

<br>

## 싱글톤 패턴이란?

싱글톤 패턴은 어떤 클래스가 오직 하나의 객체만을 갖도록 하는 방식을 말하며, 프로그램 전반에 걸쳐 그 객체 하나만 사용되도록 보장해야 한다. 그렇기 때문에 정확히 하나만 생성되어야 하는 '전역 객체(global object)'를 구현해야 할 때 유용하다.  
생성 시점은 객체가 필요한 시기(just-in-time) 혹은 프로그램이 초기화(initialization on first use)될 때 두가지로 구분된다.

<br>

## 싱글톤 패턴 적용 예시

![](https://user-images.githubusercontent.com/39115630/140270885-2ae131b8-5246-46c2-b44f-097ec5fb215b.png)  
*<@그림 1: Client 객체에 싱글톤 패턴을 적용할 경우*

```java
public class Restaurant {

    private static Restaurant _instance = null;	// (1)
    protected Restaurant() {...}                // (2)
    
    public static Restaurant getInstance() {	// (3)
    	if (_instance == null) {
        	_instance = new Restaurant();
        }
        return _instance;
    }
}
```
- (1) : Declare the instance as a private static data member
- (2) : Define all constructors to be protected or private.
- (3) : Provide a public static member function that encapsulates all initialization code, and provides access to the instance. (객체를 생성하거나 생성된 객체를 사용(참조)할 때에는, getInstance 함수를 사용할 것)

<br>

## 고려사항

싱글톤 패턴은 다음의 3가지 고려사항이 모두 충족되는 경우에만 사용하는 것이 좋다.

- Ownership of the single instance cannot be reasonably assigned
- Lazy initialization is desirable
- Global access is not otherwise provided for

객체의 소유권이 특정 사람에게 정해져있지 않은, 말그대로 객체의 보안성이 크게 중요하지 않은 경우에는 싱글톤이 꼭 필요하진 않다. 혹은 언제든지 초기화(생성)할 수 있는 객체이거나, 얼마든지 전역변수로 객체를 사용할 수 있다면 굳이 싱글톤을 사용할 필요가 없다.

<br>

## 특징
### 1. 장점
- 전역변수에 비해 싱글톤은 인스턴스가 원하는 갯수만큼만 생성되어 있다는 것을 보장할 수 있기 때문에, 인스턴스의 관리가 매우 용이하다.
- 어떻게보면 전역변수와 이름만 다르지 하는 행동은 비슷하다고 할 수 있지만, 전역변수가 프로그램 전체에서 사용될 수 밖에 없는 객체라면 싱글톤은 프로그램 전체에서 사용할수도 있고 특정 목적(클래스)에서만 사용할 수도 있다. 즉 <u>객체의 노출을 줄이고 전역적으로 사용할 수 있도록 균형을 맞춰줄 수 있다.</u>

### 2. 단점
- 단위테스트(unit test)에 방해가 되는 형태이다. 이 때문에 일부에서는 싱글톤을 안티 패턴(anti-pattern)이라고 부르기도 한다.

<br>

## 참고자료 
- Cracking The Coding Test - 187p
- [Singleton Design Pattern - SourceMaking](https://sourcemaking.com/design_patterns/singleton)
