---
layout: post
title:  "Design Pattern: Factory Method pattern" 
excerpt: "클래스의 객체를 명확하게 생성할 수 있도록 인터페이스를 제공하는 팩토리 메서드 패턴에 대해 알아본다."
date:   2021-11-04 15:00:00 +0900
categories: swe
tags: [design pattern]
---

<br>

## 팩토리 메서드 패턴이란?

어떤 클래스의 객체를 생성하기 위한 <u>인터페이스를 제공해서, 하위 클래스에서 어떤 클래스로 생성할지 결정할 수 있도록 도와주는 디자인 패턴</u>이다. 구현 방법은 크게 2가지가 있다.
- Factory 메서드 자체에 대한 구현은 제공하지 않고, 객체를 생성하는 클래스를 abstract로 선언하는 방법
- Factory 메서드를 실제로 구현한 Creator(생성)클래스를 만들고, 인자 값으로 생성해야 하는 클래스를 넘겨주는 방법

<br>

## 팩토리 메서드 패턴 적용 예시

Factory 메서드를 실제로 구현한 Creator(생성)클래스를 만들고, 인자 값으로 생성해야 하는 클래스를 넘겨주는 과정에 대한 자바 기반 예시는 다음과 같다. 이 경우에는 Factory 메서드에 <u>생성해야 할 클래스를 인자로 전달</u>해주어야 한다.

```java
public class CardGame {
	
    public static CardGame createCardGame(GameType type) {
    	if (type == GameType.Poker) {
        	return new PokerGame();
        } else if (type == GameType.BlackJack) {
        	return new BlackJackGame();
        }
        return null;
    }
}
```

<br>

## 팩토리 메서드 구조

아래의 그림과 같이 팩토리 메서드를 사용하면 마치 super(상위)객체 구현을 참조로 하는 'Abstract Factory(추상 메서드)' 방식과 매우 유사하다는 것을 알 수 있다

![image](https://user-images.githubusercontent.com/39115630/140273911-2f05746f-502f-4900-9325-f09c9ab362f5.png)  
*@그림 1: 추상 메서드(abstract method)와 유사한 구조를 갖는 팩토리 메서드*

혹은 아래와 같이 클래스의 타입을 반환하는 static 메서드를 사용하더라도, 실제 반환되는 객체는 하위 클래스의 인스턴스(ProductOne 또는 ProductTwo)가 된다. 이처럼 ProductOne이나 ProductTwo 객체 생성을 위한 클래스를 따로 만들지 않고 Product 클래스를 그대로 재사용할 수 있다. 그리고 <u>팩토리 메서드를 통해 생성되는 각 객체들은 종속성을 갖지 않기 때문에, 다형성(ploymorphic)을 갖는 객체를 생성할 수 있게 된다.</u> 이는 팩토리 메서드가 인터페이스(껍데기) 형태를 갖기 때문이다.

![image](https://user-images.githubusercontent.com/39115630/140274145-47d269d1-9bd1-4b57-b0c8-481342817ce3.png)  
*@그림 2: 다형성을 갖는 객체 생성이 가능한 팩토리 메서드*

<br>

## 고려사항

- 상속되는(팩토리 메서드를 사용하여 생성하려는) 객체에 static이 있는 경우, 이를 팩토리 메서드로 정의하여 다형성을 갖는 객체를 생성하는 것이 좋다.
- 팩토리 메서드에서 사용되는 argument에 불필요한 값이 없도록 잘 디자인해야 한다.
- 재사용할 수 있는 객체를 미리 확인해서 내부에 'object pool'을 설계하는 것이 중요하다.
- 모든 생성자는 private 또는 protected로 구성하는 것이 좋다.
- 대부분 팩토리 메서드는 <u>'덜 복잡하고, 커스터마이즈가 자주있고, 하위클래스가 늘어나기 좋은' 경우에 사용</u>되며, 더욱 유연하고 복잡한 클래스로 넘어가는 과정에서 Abstract factory(추상 팩토리), Prototype, Builder와 같은 방식을 사용한다.
- 서브클래싱(sub-classing)이 없는 대신 초기화가 필요한 Prototype 방식과 달리, 팩토리 메서드는 초기화는 필요하지 않지만 서브클래싱은 필요하다.
- 동일한 인스턴스를 여러번 반환해야 하는 경우에 좋다.
- 정확한 유형이 정의되지는 않았지만, 서브 클래스를 사용할 것은 명확한 객체의 경우 적용하면 좋다.

<br>

## 참고자료 
- Cracking The Coding Test - 187p
- [Factory Method Design Pattern - SourceMaking](https://sourcemaking.com/design_patterns/factory_method)
