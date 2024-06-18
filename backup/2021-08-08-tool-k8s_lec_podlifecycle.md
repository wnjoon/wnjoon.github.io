---
layout: post
title:  "Kubernetes: Pod - Lifecycle" 
excerpt: "쿠버네티스 내에서 구성 및 운영되는 객체의 단위인 파드의 생명주기에 대해서 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-08 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 파드의 생명주기(lifecycle)

쿠버네티스는 모든 프로세스가 파드를 기반으로 이루어진다. 이는 파드의 생성부터 삭제, 그리고 그 과정에서 이루어지는 성공 또는 실패의 과정이 모두 쿠버네티스에서 가장 중요한 요소가 된다는 말이다.  
파드의 생명주기는 크게 4가지인 'Pending, Running, Succeeded, Failed'로 구분된다. 그리고 각 단계별로 중요한 특징들은 다음과 같다.
- Pending : ReadinessProbe, Policy
- Running : LivenessProbe, QoS
- Succeeded, Failed : Policy

파드를 갓 생성한 후 해당 파드의 정보를 확인하면, 아래와 같은 여러 상태값들을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/39115630/159387036-078e1caf-60d3-43df-928f-3e41baf38ccb.png)  
*@그림 1: 파드에 대한 여러 상태 값 - 출처: 강의자료*

- Phase : 파드의 전체 상태 (Pending, Running, Succeeded, Failed, Unknown)
- Conditions : 파드가 생성되면서 실행되는 단계 (Initialized, ContainerReady, PodScheduled, Ready)
  - Reason : Conditions에 대한 세부 내용 (ContainersNotReady, PodCompleted)
- State : 파드 내에 존재하는 컨테이너 별 상태 (Waiting, Running, Terminated)
  - Reason : State에 대한 세부 내용 (ContainerCreating, CrashLoopBackOff, Error, Completed)

<br>

![image](https://user-images.githubusercontent.com/39115630/159387089-da4c8cb4-73b4-45c2-a217-81044d9a1803.png)  
*@그림 2: 파드의 상태에 대한 세부 내용 - 출처: 강의자료*

### Pending

파드의 최초 상태를 의미한다.  
파드는 Node Scheduling 정책에 따라 특정 노드에만 만들어지거나, 여러 노드 중 가장 적합한 자원상태를 갖는 노드에 생성되기도 한다. 이렇게 파드가 노드에 생성되면 PodScheduled 상태가 된다.  
파드가 정상적으로 생성되면 보안 설정과 같이 컨테이너가 기동되기 전 초기화해야 하는 내용을 포함한 initContainer를 실행한다. 정상완료되면 Initialized 상태가 된다.  
파드가 생성되면 파드는 컨테이너에 해당하는 이미지(image)를 다운로드한다. 이 때 ContainerCreating 이유를 갖는 Waiting 상태가 된다.

### Running

정상기동이 되면 Running이 된다.  
만약 컨테이너가 생성되는 과정에서 오류가 발생하면 CrashLoopBackOff 이유를 갖는 Waiting 상태가 유지된다. 다시 정상복귀되면 Running 상태가 된다.  
CronJob 또는 Job과 같이 특정 업무를 수행하고 파드가 종료(삭제)되는 경우, 파드의 상태는 Succeeded 또는 Failed로 나뉘어질 수 있다.

### Succeeded

작업 중인 컨테이너가 정상적으로 종료되는 경우 발생한다.

### Failed

작업 중인 컨테이너에 하나라도 오류가 나는 경우 발생한다.

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)