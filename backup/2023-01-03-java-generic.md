---
layout: post
title:  "유연한 타입 사용을 지원하는 제네릭(Generic) 알아보기" 
excerpt: "정적 언어의 하나인 자바에는 클래스 내부에서 사용될 타입을 클래스의 외부에서 적용하도록 하는 제네릭(Generic)이라는 것이 존재한다. 제네릭을 사용하면 컴파일 시점에 타입의 오류를 막을 수도 있고, 클래스 외부에서 타입을 제공하기 때문에 굳이 내부에서 별도의 타입 체크를 할 필요가 없다. 그리고 가장 중요한 코드의 재사용성이 높아지는 장점이 있다."
date:   2023-01-03 15:00:00 +0900
categories: java
tags: [language]
comments: true
---

<br>

## 제네릭(Generic)의 등장 목적

일반적으로 우리는 변수를 어떻게 생성할까? ArrayList 객체를 예로 들어보자.

```java
ArrayList<Integer>  arrayList1 = new ArrayList<Integer>();
ArrayList<String>   arrayList2 = new ArrayList<Integer>();
```

일반적으로 우리는 위와 같은 형태로 새로운 객체를 생성한다. 하지만 이게 사실 꽤 비효율적인 방법이라는 것을 우리는 알고 있다. arrayList1은 무조건 Integer(정수)형태의 자료만 받을 수 있고, arrayList2는 String(문자열) 형태의 자료만 받을 수 있다. 즉, 우리는 새로운 자료형(타입)을 받을 수 있는 객체를 만들기 위해서는 또 다른 변수를 만들어야 한다.

즉, 제네릭을 이용함으로써 우리는 클래스 내부가 아닌 외부에서 필요에 따라 직접 타입을 지정할 수 있게 된다. 엄밀히 말하면 타입의 범위를 지정하게 되는데, 아래에서 자세하게 기술한다.

<br>

## 사용 방법

일반적으로 사용되는 타입은 아래와 같다. 타입명은 보편적으로 통용되는 내용으로, 꼭 이대로 할 필요는 없으나 대부분이 이대로 사용하고 있으므로 협업을 위해서는 그대로 사용하는 것이 좋다고 생각한다.

|Type|Description|
|------|--------------|
|\<T\>|타입(Type)|
|\<E\>|요소(Element)|
|\<K\>|키(Key)|
|\<V\>|값(Value)|
|\<N\>|숫자(Number)|

### 1. 기본(primitive) , 참조(reference) 타입

우선 제네릭에 사용할 수 있는 타입은 참조(reference) 타입이어야만 한다는 것을 알아야 한다. 객체가 가질 수 있는 타입은 크게 기본(primitive) 또는 참조(reference) 타입이 있다.

- 기본(primitive) 타입: byte, char, short, int, long, float, double, boolean
- 참조(reference) 타입: String, 배열, 열거(enum), 클래스, 인터페이스

기본 타입으로 선언된 변수는 실제 값을 변수 안에 저장하지만, 참조 타입으로 선언된 변수는 메모리의 주소를 값으로 갖는다. 즉, 주소를 통해 객체를 참조하기 때문에 참조 타입으로 불린다. 즉 위에서도 int, double과 같은 기본 타입이 아닌, Integer, Double과 같은 Wrapper 타입을 사용해야 한다. 

### 2. Wrapper Class

Wrapper 타입 또는 클래스라고 말하는데, 기본 타입을 객체로 다루기 위해서 사용하는 클래스를 의미한다. 이름 그대로 기본 타입의 값을 객체로 '포장'한다는 의미로 보면 된다. 자바에 존재하는 모든 기본타입은 Wrapper 클래스로 생성할 수 있는데, 아래와 같다.

|기본(primitive) 타입|참조(reference) 타입|
|--------------|--------------|
|byte|Byte|
|char|Character|
|int|Integer|
|float|Float|
|double|Double|
|boolean|Boolean|
|long|Long|
|short|Short|

추가로 기본 타입에서 참조 타입으로 포장하는 것을 Boxing, 반대의 경우를 Unboxing이라고도 표현한다.

```java
public void test() {
    // Boxing
    Integer ref_number = new Integer(10);
    // Unboxing
    int pri_number = ref_number.intValue();
}
```

### 3. 선언

클래스 또는 인터페이스에 제네릭 사용을 선언하는 것은 아래와 같다. 선언된 제네릭은 클래스 또는 인터페이스 내에서만 유효하다.

```java
// 제네릭 타입 선언
public class SampleClass <T> {}
public interface SampleInterface <T> {}

// 제네릭 타입을 2개로 선언하는 경우
public class SampleClass <T, K> {}
public interface SampleInterface <T, K> {}
```

특히 제네릭 타입 2개 중에는 우리가 일상적으로 사용하는 유명한 객체가 하나 있다. 바로 HashMap이다.

```java
public class HashMap <K, V> {}
```

이렇게 선언된 제네릭은 실제로 어떻게 사용할 수 있을까?

```java
public class SampleClass <T, K> {}

public class Main {
    public static void main(string[] args) {
        SampleClass<Integer, String> sc = new SampleClass<Integer, String>();
    }
}
```

위와 같이 제네릭 클래스를 생성하는 시점에 구체적인 참조 타입을 명시해준다. 위의 예시는 T에 Integer, K에 String 타입을 갖는 SampleClass 객체를 하나 생성하였음을 보여준다. 참조 타입을 사용할 수 있다는 말은, 사용자가 정의한 별도의 클래스도 사용할 수 있다는 말이다. 아래는 Store라는 타입을 별도로 만들고, 이를 제네릭 타입에 사용한 것을 예시로 보여준다.

```java
public class Store {}
public class SampleClass<T> {}

public class Main {
    public static void main(string[] args) {
        SampleClass<Store> sc = new SampleClass<Store>();
    }
}
```

### 4. 클래스에서의 사용

```java
class SampleClass<E> {
    
    // 제네릭 타입을 갖는 변수
    private E elem; 

    void set(E elem) {
        this.elem = elem;
    }

    E get() {
        return elem;
    }
}

// 제네릭 값을 2개 갖는 클래스
class SampleClass2<K, V> {
    private K elem1;
    private V elem2;
    
    void set(K elem1, V elem2) {
        this.elem1 = elem1;
        this.elem2 = elem2;
    }

    // get은 생략
}

// 일부는 Pseudo code로 작성하였음
class Main {
    public static void main(...) {
        SampleClass<String> sc1 = new SampleClass<String>();
        SampleClass<Integer> sc2 = new SampleClass<Integer>();

        sc1.set("hello");
        sc2.set(100);

        Print(sc1.get());   // sc1 변수 값 : hello
        Print(sc1.get().getClass().getName()); // sc1 변수 타입 : java.lang.String
        Print(sc2.get());   // sc2 변수 값 : 100
        Print(sc2.get().getClass().getName()); // sc2 변수 타입 : java.lang.Integer

        SampleClass2<String, Integer> sc = new SampleClass<String, Integer>();
        sc.set("hi", 10);

        Print(sc.getElem1());   // sc의 elem1 변수 값 : hi
        Print(sc.getElem1().getClass().getName()); // sc의 elem1 변수 타입 : java.lang.String
        Print(sc.getElem2());   // sc의 elem1 변수 값 : 10
        Print(sc.getElem2().getClass().getName()); // sc의 elem2 변수 타입 : java.lang.Integer
    }
}
```

### 5. 메소드에서의 사용

만약 클래스가 아닌 메소드에만 제네릭을 한정하고싶다면 어떻게 해야 할까? 클래스와 다르게 메소드의 리턴타입 앞에 제네릭 타입을 선언해주면 된다.

```java
// 접근제어자 <제네릭타입> 리턴타입 메소드이름(제네릭타입 파라미터)
public <T> T sampleMethod(T param) {}
```

위에서 만든 SampleClass 내부에 제네릭 타입을 갖는 메소드를 새롭게 추가해보자.

```java
class SampleClass<E> {
    
    // 제네릭 타입을 갖는 변수
    private E elem; 

    // 동일 내용 생략
    ...

    // 제네릭 타입을 갖는 메소드
    public <T> T sampleMethod(T param) {
        return param;
    }
}

class Main {
    public static void main(...) {
        SampleClass<String> sc1 = new SampleClass<String>();
        SampleClass<Integer> sc2 = new SampleClass<String>();

        Print(sc1.sampleMethod(10).getClass().getName()); // (1)  
        Print(sc1.sampleMethod("good").getClass().getName()); // (2) 
        Print(sc1.sampleMethod(sc2).getClass().getName()); // (3)
    }
}
```

위의 예시에서 우리는 SampleClass를 제네릭 타입을 갖도록 선언하였고, 각 String, Integer 타입을 갖는 객체를 생성하였다. 그래서 SampleClass 내부에 있는 E 타입을 갖는 elem 변수는 String 또는 Integer 타입이 될텐데, 자세히보면 sampleMethod는 파라미터에 별도의 제네릭 타입을 명시해두었다. 즉, 함수의 선언 시점에 입력한 파라미터의 타입에 맞게 타입 T가 설정된다.

위의 코드 결과는 아래와 같을 것이다.
- (1) : java.lang.Integer
- (2) : java.lang.String
- (3) : SampleClass

#### 5.1. 제네릭 타입의 정적(static) 메소드 선언

위의 내용을 정리하면 <u>클래스 객체를 생성하는 시점에 입력한 타입과 별개로 클래스 내부의 메소드 또한 독립적인 타입 선언이 가능</u>하다는 말인데, 왜 이러한 기능이 필요할까? 

자바에는 static 이라는 키워드를 통해 변수 또는 메소드를 정적으로 만들 수 있다. 이렇게 생성된 객체는 프로그램 실행시 메모리에 할당되어 종료때까지 계속 남아있게 된다. 자바에서 일반적인 객체는 Heap 영역에 생성되어 GC(Garbage Collector)의 관리대상이 되지만, 정적 변수는 GC가 관여하지 않기 때문에 메모리에 계속 남아있게 되는 것이다.

사실 중요한건 GC가 아니라, 정적 변수(메소드)가 된다는 것은 객체가 생성되기 전에 메모리에 해당 내용이 올라간다는 것이다.

```java
class SampleClass<E> {
    ...
    static E sampleMethodWithErr(E param) {
        return param;
    }
}

class Main {
    public static void main(...) {
        SampleClass.sampleMethodWithErr(10);
    }
}
```

위의 호출은 에러를 발생시킨다. static으로 선언한 메소드이기 때문에 객체를 생성하지 않고도 해당 메소드를 호출할수 있는데, 이 메소드의 타입을 지정한적이 없기 때문이다. 결국 제네릭을 사용하면서 동시에 정적인 메소드를 만들고싶다면, 제네릭 클래스 내부가 아닌 독립적인 위치에서 사용해야한다. 즉 메소드 리턴타입 앞에 제네릭타입을 명시해주면 된다.

```java
class SampleClass<E> {
    ...
    static <E> E sampleMethodWithStatic(E param) {
        return param;
    }
}

class Main {
    public static void main(...) {
        Print(SampleClass.sampleMethodWithStatic(10).getClass().getName()); // java.lang.Integer
        Print(SampleClass.sampleMethodWithStatic("hello").getClass().getName()); // java.lang.String
    }
}
```

### 6. 와일드카드(wild card)

아래와 같은 예시가 있다고 하자. 모든 타입에서 공통적으로 사용 가능한 print() 메소드를 만들었다.

```java
void test() {
    ArrayList<Integer> arrayList = Arrays.asList(1,2,3,4,5);
    print(arrayList);
}

void print(Collection<Object> collection) {
    for(Object o : collection) {
        System.out.println(o);
    }
}
```

위의 예시는 에러를 발생시킨다. 왜냐하면 새롭게 생성된 arrayList 객체의 타입인 Integer가 Object의 하위 타입이기 때문이다. 제네릭의 특성상 파라미터를 받는 곳이 더욱 세밀한 조건을 받아야 해당 타입을 정할 수 있기 때문이다. 즉, 실용성에서 한계가 발생한다.

이러한 문제를 해결하기 위해 모든 타입을 대신할 수 있도록 하는 와일드카드 타입이 생겨났다. 와일드카드는 '?' 표시를 통해 타입의 범위를 무제한으로 확장시킬 수 있다. 

```java
void print(Collection<?> collection) {
    // 위와 동일
}
```

그런데 중요한 것은 와일드카드의 타입이 '모든(any) 타입'이 아니라 '정해지지 않은(unknown) 타입'이라는 점이다. 

```java
void test() {
    Collection<?> collection = new ArrayList<String>();
    collection.add(new Object());
}
```

위의 예시는 컴파일 중 에러를 출력한다. 아래의 순서를 잘 따라가보면 이해할 수 있을 것이다.
1. 제네릭 타입으로 새롭게 생성된 collection 객체에 add를 한다. add가 가능한 객체는 collection의 타입 또는 그의 자식 타입이어야 한다.
2. 하지만 와일드카드로 선언되었기 때문에 collection 객체는 무제한의 범위를 갖는다.
3. add 하는 파라미터가 unknown의 자식 타입, 즉 정해지지 않은 타입의 자식이어야 하므로 타입을 알 수 없기 때문에 자식 검사를 할 수 없어 컴파일 오류가 생긴다.
4. 단, 값을 반환(get)하는 시점에는 이미 검사가 완료되어 저장되어있다는 가정이 있기 때문에 오류가 발생하지 않는다.

### 7. 한정적 와일드카드

결국 위의 문제를 해결하기 위해 제네릭은 상한 또는 하한의 경계를 갖는 한정적 와일드카드를 제공한다. 특정한 타입을 기준으로 사용할 타입의 범위를 지정해주는 것이다. 아래와 같은 클래스가 있다고 가정하자.

```java
class Company {}
class Samsung extends Company {}
class Electronics extends Samsung {}
```

#### 7.1. 상한 경계 와일드카드

extends 키워드를 통해 와일드카드 타입의 최상위 타입을 정의한다. 아래의 예시를 보면 이해가 더 쉬울 것이다. <u>*얼마전 어처구니 없는 결말로 화제를 모았던 재벌집 막내아들의 진양철-진영기-진성준 3대의 객체를 기준으로 설명해본다.*</u>

```java
void print(Collection<? extends 진영기> c) {    
    for(진성준 e : c) {print}  // 컴파일 ERROR!
    for(진영기 e : c) {print}
    for(진양철 e : c) {print}
    for(Object e : c) {print}
}
```

결국 위에서 선언한 'Collection<? extends 진영기>'에서 가능한 타입은 진영기 및 그의 자손들을 의미한다. 그의 자손들 중 누가 될지는 모른다는 의미로 진성준일수도 혹은 진도준일수도 있는 것이다. 즉 더 넓은 범위를 갖는 객체에 대해서는 오류를 뱉어내게 된다.

```java
void add(Collection<? extends 진영기> c) {
    c.add(new 진성준());    // 컴파일 ERROR!
    c.add(new 진영기());    // 컴파일 ERROR!
    c.add(new 진양철());    // 컴파일 ERROR!
    c.add(new Object());  // 컴파일 ERROR!
}
```

위와 동일한 상황이다. 진영기 또는 그의 자식 클래스만 가능한 상황에서 우리는 c의 타입이 진성준인지 진도준인지 알 수 없는 것이다. 추가로 진양철인 경우 진영기와는 다른 타입이기 때문에 진영기 내부에서 진양철을 사용하는 것 또한 불가능하다. 그러므로 이럴 때에는 하한 경계를 사용하면 문제를 해결할 수 있다.

#### 7.2. 하한 경계 와일드카드

super 키워드를 사용하여 와일드카드가 사용할 수 있는 최하위 타입을 정의한다. 위에서 전부 컴파일 오류를 뱉어낸 예시를 다시 살펴본다.

```java
void add(Collection<? super 진영기> c) {
    c.add(new 진성준());    
    c.add(new 진영기());    
    c.add(new 진양철());    // 컴파일 ERROR!
    c.add(new Object());  // 컴파일 ERROR!
}
```

컬렉션 c가 의미하는 내용이 진영기 및 진영기의 부모(최하위) 타입이라고 할 때, 컬렉션은 진성준 또는 진영기 자신이면 안전하게 컬렉션에 추가할 수 있게 된다. 즉 범위가 제한된 상태라는 것이 인증되기 때문에, 그의 부모 타입에 대해서만 컴파일 에러가 발생하게 된다. 그런데 재미있는것은 오히려 print의 경우에는 상황이 다르다.

```java
void print(Collection<? super 진영기> c) {    
    for(진성준 e : c) {print}   // 컴파일 ERROR!
    for(진영기 e : c) {print}   // 컴파일 ERROR!
    for(진양철 e : c) {print}   // 컴파일 ERROR!
    for(Object e : c) {print}
}
```

이 경우 컬렉션 c는 진영기 또는 진양철을 포함한 진영기의 알 수 없는 부모들이기 때문에 부모 타입을 명확하게 특정할 수 없어 컴파일 에러가 발생하게 된다. Object의 경우에는 객체의 타입 자체가 따로 지정되지 않기 때문에 컴파일이 가능하다.

#### 7.3. PECS(Producer-Extends, Consumer-Super) 공식

**사실 위에 복잡한 예시보다 이게 더 간단하고 이해가 쉬울 것 같지만**, Effective Java에서는 와일드카드를 사용할 때의 혼란을 막기 위해 PECS라는 공식을 사용할 것을 권장한다. 
- extends : 컬렉션으로부터 와일드 카드 타입의 객체를 생성(produce) -> print
- super : 가지고 있는 객체를 컬렉션에 사용(consumer) -> add

```java
void print(Collection<? extends 진영기> c) {    
    for(진영기 e : c) {print}
}

void add(Collection<? super 진영기> c) {
    c.add(new 진영기());    
}
```

<br>

## 참고자료

- [제네릭(Generic)의 이해 - st-lab](https://st-lab.tistory.com/153)
- [자바의 참조타입 - chloe.log](https://velog.io/@gkscodus11/%EC%9E%90%EB%B0%94%EC%9D%98-%EC%B0%B8%EC%A1%B0%ED%83%80%EC%9E%85)
- [래퍼 클래스(Wrapper Class)란 무엇일까? - 코딩팩토리](https://coding-factory.tistory.com/547)
- [자바 static의 의미와 사용법 - 코딩팩토리](https://coding-factory.tistory.com/524)
- [제네릭과 와일드카드 타입에 대해 쉽고 완벽하게 이해하기(공변과 불공변, 상한 타입과 하한 타입) - 망나니개발자](https://mangkyu.tistory.com/241)
- [Java Tutorial, Wildcard - Oracle](https://docs.oracle.com/javase/tutorial/extra/generics/wildcards.html)