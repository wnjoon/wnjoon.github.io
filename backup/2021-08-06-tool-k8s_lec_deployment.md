---
layout: post
title:  "Kubernetes: Controller - Deployment" 
excerpt: "쿠버네티스가 제공하는 컨트롤러의 하나로, 파드의 버전 변경에 따른 재배포를 담당하는 Deployment에 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-06 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 버전 변경(업그레이드) 방법

![](https://kubetm.github.io/img/practice/beginner/Deployment%20with%20ReCreate,%20RollingUpdate%20for%20Kubernetes.jpg)  
*@그림 1: 버전 변경 방법에 대한 간략한 예시 - 출처: 강의자료*

쿠버네티스에서는 각 파드의 버전에 따른 업그레이드와 다운그레이드를 위해 Deployment를 사용한다. 아래의 4가지 방법은 쿠버네티스에서 제공하는 버전 관리 방법으로, 이 중 Recreate와 Rolling Update는 Deployment 생성 과정에서 적용할 수 있는 부분이며 Blue-Green 방법은 Service를, Canary 방법은 Ingress 컨트롤러를 이용하여 적용할 수 있다.

> 상용환경에서는 일반적으로 여러개의 파드가 묶여서 만들어지기 때문에, Deployment 단위로 파드가 생성된다. 

### 1. Recreate

![](https://kubetm.github.io/img/practice/beginner/Deployment%20with%20ReCreate%20for%20Kubernetes.jpg)  
*@그림 2: Recreate 방식을 통한 버전 관리 방법 - 출처: 강의자료*

- 업그레이드에 해당하는 모든 파드를 한번에 삭제한 후 생성하는 방식이다.
- 일시적인 Downtime이 존재하지만, 추가적인 파드 자원을 사용하지 않는다는 장점도 있다.
- 일시적인 서비스 중단이 허용되는 경우 사용 가능하다.

### 2. Rolling Update

![](https://kubetm.github.io/img/practice/beginner/Deployment%20with%20RollingUpdate%20for%20Kubernetes.jpg)  
*@그림 3: Rolling Update 방식을 통한 버전 관리 방법 - 출처: 강의자료*

- 업그레이드에 해당하는 파드를 하나씩 추가로 생성한 후, 기존에 있는 파드를 하나씩 삭제하는 방식이다.
- v1 버전의 파드 2개를 v2로 업그레이드 한다고 가정하면 아래와 같다.
1. v2 버전의 파드 1개 생성 (전체 파드 3개)
2. v1 버전의 파드 1개 삭제 (전체 파드 2개)
3. v2 버전의 파드 1개 생성 (전체 파드 3개)
4. v1 버전의 파드 1개 삭제 (전체 파드 2개)
- Downtime 없이 업그레이드가 가능하지만, 새로운 파드를 하나씩 생성할 때의 추가적인 자원이 필요하다.
- 배포 과정에 서로 다른 버전의 파드가 동시에 존재하기 때문에 문제가 발생할 수도 있지만, 해당 파드에 접근하기 위한 Service에서 접근하는 파드의 버전을 label로 관리한다면 잘못된 접근을 방지할 수 있다.

### 3. Blue-Green

- ReplicaSet을 사용하여 버전을 관리하는 방법이다. 
- v1 버전의 파드 2개를 v2로 업그레이드 한다고 가정하면 아래와 같다.
1. v2 버전의 파드를 2개 새로 생성 (전체 파드 4개)
2. Service의 label 부분을 v1 -> v2로 변경
3. v2에서 문제가 발생하지 않고 정상적으로 동작한다면 v1에 해당하는 ReplicaSet의 replicas 숫자를 0으로 변경
- Service를 이용하여 버전을 관리하기 때문에 순간적으로 업그레이드가 가능하며 Downtime이 발생하지 않지만, 자원을 기존 파드 갯수의 2배를 사용해야 한다.
- 현재 가장 많이 사용되고 있는 업그레이드 방식이다.

### 4. Canary

- 시스템 내 위험요소를 먼저 감지하고, 이 후 업그레이드를 진행하는 방식이다.
- 서로 다른 버전에 대한 Service를 만들어서, 두 버전에 대한 서비스를 동시에 진행한다. 
- Ingress 컨트롤러를 이용하여 각 버전마다 경로를 나누어준다(/v1/order, /v2/order).
- Downtime은 발생하지 않지만, 자원 사용률이 기존 파드의 개수에 따라 비례한다.

<br>

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-1
spec:
  selector:
    matchLabels:
      type: app
  replicas: 2 # Deployment에 사용될 파드의 갯수
  strategy:
    type: Recreate # 업그레이드 방식(Recreate / RollingUpdate)
  revisionHistoryLimit: 2 # 업그레이드 히스토리 개수
  template:
    metadata:
      labels:
        type: app
    spec:
      containers:
      - name: container
        image: nginx/v1
      terminationGracePeriodSeconds: 10 # 파드 삭제 후 대기 시간
```

revisionHistoryLimit은 각 Deployment의 업그레이드 내역을 몇개까지 관리할 것인가를 나타낸다. 예시와 같이 2로 설정하고 v1 -> v2 -> v3 -> v4까지 업그레이드를 진행했다고 가정하자. v3까지는 v1, v2의 내역이 남지만, v4부터는 v1의 내역이 남지 않는다.   

```bash
kubectl rollout history deployment deployment-1
```

내역을 남기는 이유는, <u>업그레이드 과정에서 문제가 발생하였을 때, 이전의 버전으로 revision 하기 위해서</u>이다. 위의 명령어를 통해 revision 번호를 확인할 수 있으며, 해당 버전으로 돌아가고 싶으면 아래의 명령어를 사용한다. 예시에서는 revision=2로 돌아간다.

```bash
kubectl rollout undo deployment deployment-1 --to-revision=2
```

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)