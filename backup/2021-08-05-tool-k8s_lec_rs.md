---
layout: post
title:  "Kubernetes: Controller - ReplicaSet" 
excerpt: "쿠버네티스에서 제공하는 컨트롤러의 하나로, 파드 개수를 관리하여 시스템 또는 성능의 장애를 대처하기 위해 사용되는 ReplicaSet에 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-05 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 컨트롤러의 기능

![](https://kubetm.github.io/img/practice/beginner/Controller%20with%20Replicastion%20Controller,%20ReplicaSet%20for%20Kubernetes.jpg)  
*@그림 1: Controller가 제공하는 기능 - 출처: 강의자료*

컨트롤러는 쿠버네티스의 서비스를 관리 및 운영하는데 사용된다.

(1) Auto Healing
- 특정 파드 혹은 노드 전체에 장애가 발생하였을 때, 이를 복구해주는 기능이다. 단순히 파드를 재생성할 수도 있고, 노드 전체에 장애가 발생하면 해당 노드에 있던 파드를 다른 노드에 생성할 수도 있다.
- ReplicaSet(Replication Controller), StatefulSet, DaemonSet이 이에 해당한다.

(2) Software Update
- 여러 파드의 버전을 관리하는데 사용된다. 버전 업그레이드 뿐만 아니라, 사용 중 문제가 있을 경우 해당 버전을 다운그레이드 할 때에도 사용된다.
- Deployment가 이에 해당한다.

(3) Auto Scaling
- 파드의 자원이 부족하면 같은 서비스를 하는 파드를 늘임으로써, 각 파드에 가는 부하를 줄여 안정적인 서비스를 제공하기 위해 사용된다.
- HPA가 이에 해당한다.

(4) Job
- 그림에는 없지만, 일시적인 작업에 필요한 파드를 만들었다가 작업이 끝나면 다시 파드 개수를 원상복귀 시키는 방법이다. 순간적으로 많은 양의 데이터를 처리해야 할 때, 시스템에 무리가 가지 않도록 하기 위하여 사용된다.
- CronJob, Job이 이에 해당한다.

<br>

## ReplicaSet

> 예전 버전에는 Replication Controller가 존재하였으나, 현재는 deprecated 되었으므로 본 포스팅에서도 생략한다.

위에서 설명한대로, ReplicaSet은 파드의 개수를 관리할 때 사용된다. 일반적으로 파드를 생성할 때 파드를 감싸고 있는 Deployment 단위로 생성하게 되는데, Deployment 내부에서 파드의 개수를 관리하기 위한 ReplicaSet을 함께 정의한다.  
ReplicaSet은 Template, Replicas, Selector 총 3가지 부분으로 구성된다.

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: rs
spec:
  replicas: 3 # replicas: 파드 개수
  selector: # selector: 생성할 파드의 공통 속성
    matchLabels:
      type: web
  template: # template: 생성할 파드의 형태
    metadata:
      name: pod-rs
      labels:
        type: web
    spec:
      containers:
      - name: container
        image: nginx:v1
      terminationGracePeriodSeconds: 0
```

### 1. Template


![](https://kubetm.github.io/img/practice/beginner/Controller%20with%20Replication,%20ReplicaSet%20for%20Kubernetes.jpg)  
*@그림 2: ReplicaSet의 Template, Replicas 예시 - 출처: 강의자료*

ReplicaSet을 통해 만들어질 파드의 형태를 나타낸다. ReplicaSet을 통해 관리되기 때문에, <u>template.metadata.labels 내용을 sepc.selector.matchLabels 내용이 일치하게 작성해야 한다.</u>  
template 내용이 변경되면 해당 ReplicaSet을 통해 만들어진 모든 파드에 자동으로 변경된 내용이 적용된다. 예로 컨테이너의 버전을 v1 -> v2로 변경하면, ReplicaSet으로 만들어진 3개의 파드(replicas에 명시된) 모두의 버전이 변경된다.

### 2. Replicas

ReplicaSet을 통해 관리할(생성해야 하는) 파드의 개수를 나타낸다. Replicas의 숫자를 늘이고 줄이는 경우에 따라 scale-in 또는 scale-out으로 표현된다.
- scale-in: replicas의 숫자를 기존보다 감소시킴 -> 파드 개수 감소
- scale-out: replicas의 숫자를 기존보다 증가시킴 -> 파드 개수 증가

> 그렇다면 scale-out할 때 각 파드의 이름은 어떻게 정해질까? template.metadata.name에 파드의 이름을 pod-rs 정해놓으면 뒤에 무작위의 숫자 혹은 문자가 추가될까? ReplicaSet으로 생성된 파드는 기본적으로 ReplicaSet의 metadata(위에서는 rs)를 따라간다. rs-1234 혹은 rs-a12vd와 같은 이름이 자동으로 생성된다. 단, Replicas가 1일 경우에는 template.metadata.name에 적힌 파드의 이름을 따라가지만, 이 경우도 scale in/out 과정에서 자연스럽게 변경된다.

### 3. Selector


![](https://kubetm.github.io/img/practice/beginner/Match%20with%20Replication,%20ReplicaSet%20for%20Kubernetes.jpg)  
*@그림 3: ReplicaSet의 Selector 예시 - 출처: 강의자료*

ReplicaSet을 통해 관리될 파드의 속성을 정의한다. 

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: rs
spec:
  replicas: 1
  selector:
    matchLabels:
      type: web
      ver: v1
    matchExpressions:
    - {key: type, operator: In, values: [web]}
    - {key: ver, operator: Exists}
  template:
    metadata:
      labels:
        type: web
        ver: v1
        location: dev
    spec:
      containers:
      - name: container
        image: nginx
      terminationGracePeriodSeconds: 0
```

위의 예시를 보면 Template에서 언급한 내용과 동일하게 파드의 labels 속성은 ReplicaSet의 selector.matchLabels 속성 내용을 모두 포함해야 한다. 만약 matchExpressions를 사용한다면 조건을 세밀하게 구분하기 때문에 완벽하게 같지 않은 '포함관계'만 성립해도 된다.

![](https://kubetm.github.io/img/practice/beginner/Match2%20with%20Replication,%20ReplicaSet%20for%20Kubernetes.jpg)  
*@그림 4: ReplicaSet의 Selector 중 matchExpressions 예시 - 출처: 강의자료*
- Exists: 사용자가 정한 키를 모두 가지고 있는 파드만 연결
- DoesNotExists: 사용자가 정한 키를 가지고 있지 않은 파드만 연결
- In: 사용자가 정한 키와 값을 모두 갖고 있는 파드만 연결
- NotIn: 사용자가 정한 키를 포함하지만, 값은 포함하지 않는 파드만 연결

위의 조건에 따르면 가장 필터링이 많이 되는 순서로 In > NotIn > Exists = DoesNotExists 가 될 것이다.

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)