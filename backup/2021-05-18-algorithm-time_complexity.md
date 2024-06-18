---
layout: post
title:  "시간복잡도(Time Complexity)" 
excerpt: "Big-O는 알고리즘의 효율성을 나타내는 지표로, 알고리즘이 이전보다 빨라졌는지 혹은 느려졌는지, 혹은 이전보다 메모리를 더 많이 사용하는지 적게 사용하는지의 등을 판단하는 기준이 된다. 시간복잡도로서의 Big-O는 접근적 실행시간(asymptotic runtime)을 나타내는 지표로 사용되며, 특정 작업을 마무리하는데 걸리는 시간으로 표현된다."
date:   2021-05-18 15:00:00 +0900
categories: algorithm
tags: [complexity, big O]
---

<br>

## Big O

Big-O는 알고리즘의 효율성을 나타내는 지표로, 알고리즘이 이전보다 빨라졌는지 혹은 느려졌는지, 혹은 이전보다 메모리를 더 많이 사용하는지 적게 사용하는지의 등을 판단하는 기준이 된다.  
알고리즘에 대한 결과를 판단할 때 가장 중요하게 사용되며, 개발자라면 꼭 알고 계산할 수 있어야 하는 부분이다.

<br>

## 시간 복잡도

시간복잡도로서의 Big-O는 접근적 실행시간(asymptotic runtime)을 나타내는 지표로 사용된다. 특정 작업을 마무리하는데 걸리는 시간으로 표현되는데, 만약 크기가 s인 파일을 온라인으로 전송하는데 걸리는 시간은 O(s)로 표현할 수 있지만, 이 파일을 USB에 담아 비행기로 전송할 때 걸리는 시간은 O(1)으로 표현될 수 있다.  
여기서 O안에 들어갈 수 있는 값은 1(상수), N(정비례), NlogN(로그지수), N^2(제곱) 등 다양하게 존재할 수 있다.  
또한, 시간복잡도는 두 개 이상의 변수에 영향이 있을 수도 있다. 예를 들어 가로 w, 세로 h인 벽에 페인트칠을 하는데 걸리는 총 시간복잡도를 표현하려면 O(wh)와 같이 표현할 수 있으며, p개의 벽을 칠하는데 총 걸리는 시간은 O(whp)가 될 것이다.  
시간 복잡도를 표현하는 방식은 크게 3가지가 있는데, BIg-O, BIg-Θ, Big-Ω 로 구분할 수 있다.  
Θ는 Theta, Ω는 Omega라고 부른다.

<br>

### 1. Big-O

<u>작업을 마무리하는데 걸리는 시간의 상한</u>을 의미한다. N개의 값들 중 하나의 값을 선택하는 방법은 여러가지가 있을 수 있다. 해시맵을 사용한다면 O(1)이 될수도 있고, 일반 배열을 선택한다면 최대 O(N)개가 될수도 있다. 이 경우 Big-O는 도출 가능한 값들 중 하나보다 빠르면(만족시키면) 되며, 일반적으로 걸릴 수 있는 가장 긴 시간으로 표현된다.

### 2. Big-Ω (Omega)

Omega는 등가 혹은 하한을 의미하는데, <u>표현된 수행시간보다 빠를 수 없는(가장 빠른 수행시간을 나타내는) 척도</u>로 사용된다.

### 3. Big-Θ (Theta)

Big-O와 Big-Ω를 모두 표현하는(?) 방식인데, <u>특정 알고리즘을 수행하는 '딱맞는 시간'을 표현할 때 사용</u>된다. 특정 알고리즘의 수행 시간이 O(N)이면서 동시에 Ω(N)이면, 해당 알고리즘의 수행 시간을 Θ(N)으로 표현한다. <u>일반적으로 Θ와 O를 동일하게 표현하는 경우가 많으며, 업계에서는 단순하게 Big-O로 모두 표현</u>한다.

<br>

## 공간 복잡도

만약 n개의 배열을 만든다면, 공간복잡도는 O(n)이 될 것이다. 같은 크기를 2차원 배열로 만든다면 O(n^2)이 될 것이다.  
중요한 것은 호출되는 횟수와 공간 복잡도는 비례하지 않는다. 예를 들어 스택을 사용하는 2개의 코드가 있다고 가정하자.

```java
int sum(int n) { 
    if (n <= 0) { 
    	return 0; 
    } 
    return n + sum(n-1); 
}
```
위의 코드는 n이 0보다 클 때까지 계속 sum을 호출한다. 이 경우 호출에 사용되는 메모리 공간은 계속 증가하여 O(n)의 공간이 사용된다.

```java
int pairSumSequence(int n) { 
    int sum = 0; 
    for(int i=0; i<n; i++) { 
    	sum+= pairSum(i, i+1); 
    } 
    return sum; 
} 
 
int pairSum(int a, int b) { 
    return a+b; 
}
```

위의 코드는 pairSum 함수를 여러번 호출하는 것은 맞지만, pairSum이 메모리에 계속 적재되지는 않는다. 그러므로 O(1)의 공간을 사용한다

<br>

## 복잡도 계산 방법

### 1. 상수항의 무시

복잡도의 계산에 있어서 상수항은 무시될 수 있다. O(2N)이나 O(N+2) 모두 O(N)과 복잡도 측면에서는 동일하다.

### 2. 지배적이지 않은 항의 무시

프로세스에 가장 큰 영향을 줄 수 있는 항만 표현한다. 예를 들어 O(N^2+N)은 O(N^2)이 된다.  
N이 작은 숫자일수록 전체 식에 더 많은 영향을 줄 수 있다. 하지만 N이 엄청나게 큰 수라고 가정하자. N^2에 비해 N은 터무니 없이 작은 값으로 무시될 수 있다. 그러므로 가장 큰 항 외 나머지 항들은 모두 무시할 수 있다.

### 3. 여러 계산이 혼합된 알고리즘

두개의 독립된 프로세스가 별도로 일어난다면 덧셈을, 하나의 프로세스 내부에 또다른 프로세스가 중첩된다면 곱셈을 사용하는 것이 맞다.

```java
// A = arr1.length, B = arr2.length 
// 1. arr1 배열 출력 이후 arr2 배열을 출력한다 -> O(A+B) 
int sum(int[] arr1, int[] arr2) { 
    for(int i=0; i<arr1.length; i++) { 
    	print(arr1[i]); 
    } 
    for(int i=0; i<arr2.length; i++) { 
    	print(arr2[i]); 
    } 
} 
// 2. arr1 배열 내부에서 arr2 배열을 출력한다 -> O(AB) 
int mult(int[] arr1, int[] arr2) { 
    for(int i=0; i<arr1.length; i++) { 
    	for(int j=0; j<arr2.length; j++) { 
        	print(arr1[i] + " " + arr2[j]); 
        } 
    } 
}
```

### 4. 상환 시간

수행시간을 가장 오래 걸리게 만드는 최악의 상황이 발생은 하지만 그 빈도수가 많지 않거나 특정 주기별로 발생하는 경우, 수행 시간을 분할 상환해주는 것을 말한다.  
예시로 길이 n의 ArrayList가 있다고 하자. ArrayList는 특정 크기만큼 배열을 먼저 생성해놓는 구조이므로 평상시에는 O(1)의 삽입시간을 갖지만, 원소의 갯수가 특정 크기를 초과하면 2n만큼의 크기를 갖는 배열을 새로 만들고 기존 배열의 내용들을 새로운 배열에 복사한다. 배열의 크기가 2배씩 계속 증가한다고 할 때, 배열이 최대 크기 N까지 증가하는 방식은 1, 2, 4, 8, 16, ... , N이 될 것이고 대략 2N이 된다. 결국 삽입에 필요한 시간은 O(2N)이고, 이를 N개로 분할상환하면 O(1)이 된다.

### 5. logN

이진탐색에서 주로 수행되는 시간으로, 하나의 원소가 k번 이진트리로 분할된다고 할 때 나올 수 있는 총 결과 값은 2^k개가 된다. 그러므로 결과 값 N에 대하여 k=logN이 된다.  
이 방식은 여러개의 원소들 중 특정 값을 찾는 방법에서도 사용 가능하다. 원소들을 일렬로 정렬한 후, 정렬된 값들 중 중간 값을 기준으로 크거나 작거나를 반복하여 확인한 후 원하는 결과값을 도출하는 방식이다. 이를 균형 이진 탐색 트리라고 하는데, 매 단계마다 비교해야 할 원소의 갯수를 반씩 줄여나가기 때문이다.

### 6. 재귀적 방법

일반적으로 다수의 호출이 중첩적으로 이루어진 재귀 함수에서 수행시간은 O(분기^깊이)로 표현된다. 여기서 분기는 재귀 함수가 자신을 재호출하는 횟수를 말하는데, 아래의 코드를 살펴보자.

```java
int f(int n) { 
    if (n <= 1) { 
    	return 1; 
    } 
    return f(n-1) + f(n-1); 
}
```

n이 4라면, f(4)는 2개의 f(3)을 낳을 것이고, f(3)은 또 2개의 f(2)를, 이런식으로 f(1)이 return 1을 반환하는 총 갯수는 8개가 된다. n이 4일때 f함수가 호출되는 총 횟수는 '1+2+4+8 = 2^4 - 1 = 15' 가 된다.  
그러므로 전체 수행 시간은 O(2^n)이 되며, 공간복잡도는 재귀적인 호출에 사용되는 횟수만큼만 f함수의 공간이 필요하므로 O(N)이 된다.

<br>

## Big-O Complexity 비교

### 1. 복잡도 별 성능

![](https://he-s3.s3.amazonaws.com/media/uploads/ece920b.png)  
*@그림 1: 알고리즘의 복잡도에 따른 성능 차이*

빠른 순서대로 O(1) > O(logn) > O(n) > O(nlogn) > O(n^2) > O(2^n) > O(n!) 가 된다.

### 2. 기능 별 복잡도 성능

![](https://he-s3.s3.amazonaws.com/media/uploads/0728f0e.JPG)  
*@그림 2: 자료구조 별 성능 차이*

![](https://he-s3.s3.amazonaws.com/media/uploads/1e0079d.JPG)  
*@그림 3: 검색 방법 별 성능 차이*

![](https://he-s3.s3.amazonaws.com/media/uploads/2d5308d.JPG)  
*@그림 4: 정렬 방법 별 성능 차이*

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmNA5E%2FbtrfgZ1BCdk%2FzKg0eOarjRojctfKjcWSX1%2Fimg.jpg)  
*@그림 5: 힙 구조 별 성능 차이*

![](https://he-s3.s3.amazonaws.com/media/uploads/526213e.JPG)  
*@그림 6: 그래프 구조 별 성능 차이*

<br>

## 참고자료 
- Cracking The Coding Test - big-O
- [Big o Cheatsheet - Data structures and Algorithms with thier complexities](https://www.hackerearth.com/practice/notes/big-o-cheatsheet-series-data-structures-and-algorithms-with-thier-complexities-1/)
- [Know Thy Complexities!](https://www.bigocheatsheet.com)
