---
layout: post
title:  "Kubernetes: Pod - ReadinessProbe, LivenessProbe" 
excerpt: "쿠버네티스가 파드의 생성 과정에서의 무결성을 보장하기 위한 방법인 ReadinessProbe와 LivenessProbe에 대해서 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-10 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## QoS는 언제 사용될까?

하나의 노드에 3개의 파드가 올라가 있고, 각 파드가 동일한 자원을 사용하고 있다고 가정한다. 이 중 하나의 파드에서 자원을 좀 더 사용해야 하는데 노드에서는 더 이상 가용할 수 있는 자원이 없을 경우, 존재하는 파드 중 하나를 지워야 하는 상황이 발생할 수 있다.  
이 때 우리는 2가지 상황을 예상해볼 수 있다.
1. 자원을 더 사용해야 하는 파드를 죽이고, 그대로 자원을 사용하고 있던 나머지 파드를 살려둔다.
2. 자원을 더 사용해야 하는 파드 외에 나머지 한 파드를 죽이고, 해당 파드가 가지고 있던 자원을 필요로하는 파드에게 제공한다.

이 중 어떠한 방법을 선택하는지는 QoS Classes에 명시되어 있는 내용을 따른다. QoS Classes는 총 3가지가 존재하는데, 중요도(삭제해서는 안되는)에 따라 Quaranteed > Burstable > BestEffort로 순서가 매겨진다.  

- Pod1 : Guaranteed
- Pod2 : Burstable
- Pod3 : BestEffort

만약 파드 3개가 위와 같은 QoS 정책을 가지고 있다면, Pod3 -> Pod2 -> Pod1 순서대로 파드가 삭제될 가능성이 높다. 즉, Guranteed로 설정된 파드가 가장 오랫동안(?) 유지될 수 있다.

### Guranteed 

- 모든 컨테이너에 Request와 Limit가 명시되어야 함
- 모든 Request와 Limit에 CPU와 Memory 값이 명시되어야 함
- 각 컨테이너의 Request에 명시된 CPU와 Memory 값은, Limit에 명시된 CPU와 Memory 값과 일치해야 함

### Burstable

- 파드 내 컨테이너 중 어느 하나라도 Request 또는 Limit 중 하나만 설정되어 있는 경우
- 파드 내 컨테이너의 Request 내부 CPU와 Memory 값이 Limit의 CPU와 Memory 값보다 작은 경우
- 파드 내 컨테이너들 중 하나는 Request와 Limit의 CPU, Memory 값이 일치하지만, 나머지 하나는 설정되어 있지 않은 경우

### BestEffort

- 어떠한 컨테이너에서도 Request와 Limit이 설정되어 있지 않은 경우

### OOM(Out Of Memory) Score

노드 내에 동일한 Request 값을 가지는 파드가 2개 이상 존재한다고 할 때, 이 중 어떤 파드를 삭제해야할지 정하는 정책이다.  
기준은 <u>구동되는 앱에서 사용하는 자원 / Request 값에 명시된 자원</u>으로 구분하는데, 이 중 더 큰 값을 갖는 파드를 먼저 삭제한다.  

> 예시
> 동일한 App(Memory 4G)을 기준으로,  
> - PodA : Request(Memory 5G)  
> - PodB : Request(Memory 8G)
> 라고 한다면, PodA = 75%, PodB = 50%의 OOM 값을 갖는다.   
>  
> 그러므로, PodA가 먼저 삭제된다.

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)