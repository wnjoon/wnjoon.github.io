---
layout: post
title:  "정렬(Sorting) : 퀵(quick)과 병합(merge)" 
excerpt: "정렬을 구현하는 두 가지 방식인 배열과 리스트 중 배열을 이용하여 데이터 정렬 방식 중 하나인 퀵(quick)정렬과 병합(merge)정렬에 대해 알아본다."
date:   2021-10-15 15:00:00 +0900
categories: algorithm
tags: [sort]
---

<br>

## 배열 vs 리스트

정렬을 구현하는 방식은 크게 배열을 이용하거나 리스트를 이용하는 두가지 방법이 존재한다.  
- 배열: 구현이 용이함, 병합할 부분 배열을 담아 둘 추가적인 보조 배열이 필요함.
- 리스트: 구현이 복잡함, 병합할 부분 배열을 담아 둘 추가적인 보조 배열이 필요하지 않음.

본 포스팅에서는 각 정렬의 구현 방식을 일반적으로 사용되는 '배열(array)'로 진행한다. 

<br>

## Quick Sort (퀵 정렬)

무작위로 선정된 한 원소(pivot)를 사용하여 배열을 분할하고, 선정된 원소보다 작은 원소들은 앞으로 보내고 큰 원소는 뒤로 보내는 과정을 반복하여 데이터를 정렬하는 방식이다.  
어떠한 원소를 pivot으로 정하느냐에 따라 수행시간이 확연히 달라질 수 있다. 예를 들어 pivot이 항상 분할된 배열의 가장 작거나 큰 원소를 선택한다면, 최악으로 O(n^2)의 수행시간이 정해질 수 있다. <u>가장 좋은 경우는 선택된 원소가 항상 분할된 배열의 중간값</u>일 때이다.

### 구현 방식

pivot을 기준으로 하나의 배열을 두개로 분할한다. 이 때 분할된 배열의 크기는 서로 동일하지 않을 수 있다. 분할된 각 부분 배열을 정렬한 뒤, 정렬된 두개의 부분 배열을 다시 합하는 과정을 반복하여 최종적으로 전체가 정렬된 배열이 되도록 한다.
- 분할(divide) : pivot을 기준으로 1개의 배열을 2개의 부분 배열로 분할한다. 이 때 pivot의 왼쪽에는 pivot보다 작은 요소들을 놓고, 오른쪽에는 pivot보다 큰 요소들을 놓는다.
- 정복(conquer) : 각 부분 배열을 정렬한다. 정렬된 각 부분 배열은 크기가 충분히 작은 시점까지 계속해서 분할과 정복을 반복한다. 이 과정은 recursive(순환)하게 동작하는데, 결국 한번의 recursive가 종료된다는 말은 하나의 pivot의 위치가 최종적으로 정해지고 퀵 정렬은 언젠가 종료된다는 의미가 된다.
- 결합(combine) : 정렬된 부분 배열을 하나의 배열에 병합한다.

![](https://gmlwjd9405.github.io/images/algorithm-quick-sort/quick-sort.png)  
*@그림 1: 분할(divide) → 정복(conquer) → 결합(combine) 과정으로 진행되는 퀵 정렬*

일반적으로 pivot은 분할된 배열의 중간에 위치한 원소가 되는데, 일부에서는 배열의 가장 앞 원소를 pivot으로 선정하고 부분 정렬 이후에 중간 값과 해당 값을 swap하는 경우도 있다. 배열의 가장 앞부분을 pivot으로 할 경우의 구현 방식 및 샘플 코드는 [이곳(퀵 정렬 알고리즘의 예제)](https://gmlwjd9405.github.io/2018/05/10/algorithm-quick-sort.html)을 참조하면 좋다.

### Source Code

```java
void quickSort(int[] arr, int left, int right) {
    // 중간값 구하는 부분
    int index = partition(arr, left, right);
    
    // 왼쪽 분할된 배열 정렬
    if(left < index - 1) {
        quickSort(arr, left, index - 1);
    }
    // 오른쪽 분할된 배열 정렬
    if(index < right) {
        quickSort(arr, index, right);
    }
}

int partition(int[] arr, int left, int right) {
    // 배열을 분할할 기준이 될 원소 설정 -> 배열의 중간 위치의 원소
    int pivot = arr[(left + right) / 2];
    
    while(left <= right) {
        // pivot보다 값이 작으면, 배열의 왼쪽에서 오른쪽으로 이동(->)
        while(arr[left] < pivot) {
            left++;
        }
        // pivot보다 값이 크면, 배열의 오른쪽에서 왼쪽으로 이동(<-)
        while(arr[right] > pivot) {
            right--;
        }
        
        // 가운데 기점을 중심으로 left가 왼쪽, right가 오른쪽에 있을 때,
        if(left <= right) {
            // 배열의 left 위치에 있는 값과 right 위치에 있는 값을 교환
            swap(arr, left, right);	
            // 다음 위치 값을 확인하기 위해 각각 왼쪽과 오른쪽으로 한칸씩 이동
            left++;
            right--;
        }
    }
    // left => pivot의 위치까지 오게 되므로, 즉 중간값이 됨
    return left;
}
```

### 복잡도
원소가 n개라고 할 때,
- 시간 복잡도: O(nlogn), 단 pivot이 계속 분할된 배열의 가장 작거나 큰 원소로만 선택된다면, 최악으로 O(n^2).
- 공간 복잡도: O(logn), swap에 사용되는 추가적인 메모리가 원인.

<br>

## Merge Sort(병합 정렬)

배열을 절반씩 나누어 각각을 정렬하고 다시 이 둘을 합하여 다시 정렬하는 Divide and conquer 방식으로 동작한다. 결국 하나의 배열을 한개의 원소를 갖는 두 배열이 나올 때까지 계속 쪼갠 후, 두 개의 원소가 서로 정렬 후 병합되는 과정을 반복하여 원소가 전체적으로 정렬되도록 하는 방식이다. 

![image](https://user-images.githubusercontent.com/39115630/137437519-9a43835b-401e-4ebe-bce9-7b1ab432efea.png)  
*@그림 2: 하나의 배열을 원소 단위로 쪼갠 후, 이를 정렬하는 과정을 다시 반복하는 병합 정렬*

### 구현 방식

위의 개요에서 설명한 것과 같이, 주어진 배열을 절반씩 나누어 최종적으로 한개의 원소들로만 이루어진 부분배열이 나올 때 까지 분할한다. 이후 분할된 각 배열을 정렬하고 병합하는 과정을 recursive하게 호출하여 최종적으로 정렬된 하나의 배열이 나오도록 한다.  
아래 소스코드에서와 같이 <u>왼쪽 배열에 있는 모든 원소가 정렬된 이후 오른쪽 분할 배열에 원소가 남아있게되면, 남아있는 원소들에 대해서는 더이상 고려하지 않는 것을 볼 수 있는데, 이유는 **왼쪽과 오른쪽의 배열을 비교해서 원소를 이동하는 것이 중요**하고 어차피 **남아있는 오른쪽 분할배열의 원소들은 이전 divide and conquer 과정에서 이미 정렬되었기 때문에 더이상 움직여질 필요가 없기 때문**이다.</u> 

> 예시로 %로 분할되어 있는 [1,4,5 % 2,8,9] 배열이 있다면, [1] -> [2] -> [4] -> [5] 순으로 값이 채워지고 최종적으로 오른쪽 분할배열에는 [8,9]만이 남게 된다. 결국 이 원소들은 어차피 이전 과정에서 정렬이 완료되었고, 왼쪽 부분 배열에서 정렬되어야 하는 내용들은 이미 정렬이 완료되었기 때문에 더 이상 고려될 필요가 없게 된다.

### Source Code

```java
void mergeSort(int[] array) {
    int[] temp = new int[array.length];
    mergeSort(array, temp, 0, array.length - 1);    
}

void mergeSort(int[] array, int temp, int start, int end) {
    // 분할된 배열의 원소 갯수가 1개일 때 -> return
    if(start == end) {
    	return;
    }
    
    int mid = (start + end) / 2;
    
    // 배열의 앞에서부터 가운데까지의 분할 배열을 만듬
    mergeSort(array, temp, start, mid);
    // 배열의 가운데 +1 부터 맨 뒤까지의 분할 배열을 만듬
    mergeSort(array, temp, mid + 1, end);
    
    // 나누어진 두 배열을 병합
    merge(array, temp, start, mid, end);	
}

void merge(int[] array, int[] temp, int start, int mid, int end) {
    // 보조 배열에 정렬해야 하는 분할된 배열을 복사
    for(int i = start; i <= end; i++) {
    	temp[i] = array[i];	
    }
    
    // [1,4,5,2,6,5,3,8] -> left = 1, right = 6
    // [1,4,5,2 || 6,5,3,8] 과 같이 반을 나누어서 인덱스별로 원소를 비교하는 방식
    int left = start;
    int right = mid + 1;
    int current = start;
    
    while(left <= mid && right <= end) {
        if(temp[left] <= temp[right]) {
            // 위의 예시 배열 상에서 처음으로 [1]과 [6]을 비교 
            array[current] = temp[left];
            left++;
        } else {
            array[current] = temp[right];
            right++;
        }
        current++;
    }
    
    // 왼쪽 분할 배열에 남아있는 원소들을 배열에 복사한다
    int remain_numbers = mid - left;
    for(int i = 0; i <= remain_numbers; i++) {
    	array[current + i] = temp[left + i];
    }
}
```

### 복잡도
원소가 n개라고 할 때,
- 시간 복잡도: O(nlogn), 하나의 배열을 계속 반으로 분할하고 이를 병합하면서 정렬하기 때문.
- 공간 복잡도: O(n), n개의 원소를 위해 크기 n의 보조 배열을 만들어야 하기 때문(리스트의 경우 필요없을 듯).

<br>

## 참고자료 
- Cracking The Coding Test - 널리 사용되는 정렬 알고리즘
- [[알고리즘] 퀵 정렬(quick sort)이란](https://gmlwjd9405.github.io/2018/05/10/algorithm-quick-sort.html)
- [[JAVA] 병합정렬,합병정렬(Merge Sort)](https://cornswrold.tistory.com/30)

