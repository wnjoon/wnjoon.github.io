---
layout: post
title:  "Kubernetes: Object - Namespace, ResourceQuota, LimitRange" 
excerpt: "쿠버네티스의 네임스페이스와 파드 사이의 적절한 자원 분배를 위한 제한 방법에 대하여 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-04 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 자원 분배의 필요성

쿠버네티스는 클러스터에 따라 사용할 수 있는 자원의 한계가 있다. 마치 우리가 클라우드 혹은 외장하드와 같은 별도의 장치나 서비스를 사용하지 않는다면 PC에 연결된 하드 또는 SSD의 용량만 사용할 수 있는 것과 같다. 여기서의 자원은 CPU, Memory와 같은 종류를 포함한다.

![](https://kubetm.github.io/img/practice/beginner/Namespace,%20ResourceQuota,%20LimitRange%20for%20Kubernetes.jpg)  
*@그림 1: 한정된 자원을 네임스페이스와 파드에 적절히 분배해야만 한다. - 출처: 강의자료*

쿠버네티스 클러스터는 다양한 네임스페이스와 이러한 네임스페이스 내부에 존재하는 여러 개의 파드들을 구성할 수 있다. 이들은 <u>클러스터의 자원을 '나누어서' 사용</u>하게 되는데, 이러한 이유로 자원을 효율적으로 분배해서 되도록 많은 파드가 서비스를 수행할 수 있도록 해야 한다. 만약 하나의 네임스페이스에서 모든 자원을 사용해버린다면, 클러스터 내의 다른 네임스페이스에 속한 파드들은 자원을 하나도 사용하지 못하고 서비스가 이루어지지 못할 것이다.

이를 방지하기 위해 ResourceQuota와 LimitRange라는 옵션이 있다. <u>ResourceQuota는 네임스페이스에 최대로 할당 가능한 자원의 크기를 한정</u>하는 기능이고, <u>LimitRange는 네임스페이스에 있는 자원을 특정 파드가 모두 사용하지 않도록 네임스페이스에 할당할 수 있는 파드의 자원 크기를 제한</u>한다. 물론 ResourceQuota와 LimitRange는 네임스페이스에만 설정할 수 있는 것이 아니며, 클러스터 전체에 대해서도 설정할 수 있다.

<br>

## Namespace

Namespace는 쿠버네티스 클러스터 내부에 존재하는 또 다른 가상 클러스터 공간이다. 서로 다른 Namespace의 파드끼리는 Network Policy를 이용해서만 통신이 가능하다. Namespace 안에 생성된 모든 오브젝트(파드, 서비스 등)는 Namespace에 종속적이기 때문에, Namespace가 삭제되면 해당 오브젝트 또한 삭제된다.

![](https://kubetm.github.io/img/practice/beginner/How%20to%20use%20Namespace%20for%20Kubernetes.jpg)    
*@그림 2: Namespace에 대한 간략한 예시 - 출처: 강의자료*

### 1. Namespace 생성

그림 2에서의 1-1, 1-1'를 나타낸다. 예시에서는 1-1의 nm-1 Namespace를 생성한다.

```yaml
# 1-1
apiVersion: v1
kind: Namespace
metadata:
  name: nm-1
```

cli를 이용하여 생성할 수도 있다.

```bash
kubectl create namespace nm-1
```

### 2. Namespace 내 오브젝트(파드, 서비스) 생성

그림 2에서의 1-2, 1-3, 1-2'를 나타낸다. 
- 오브젝트를 생성할 때 Namespace를 명시해주지 않으면, 기본값인 default Namespace에 오브젝트가 생성된다.  
- 1-2에서 볼 수 있는 것 처럼, <u>Namespace 안에는 동일한 이름의 파드가 존재할 수 없다.</u>   
- 서로 다른 Namespace에 존재하는 파드끼리 직접 통신하려면 Network policy를 별도로 사용해야 한다.
- 서비스 또한 기본적으로는 만들어진 Namespace 안에서만 동작할 수 있지만, PV 또는 NodePort와 같이 모든 Namespace에서 사용 가능한 오브젝트도 존재한다.
- Namespace를 지우면, 내부에 있는 오브젝트 또한 모두 삭제된다.


```yaml
# 1-2
apiVersion: v1
kind: Pod
metadata:
  name: pod-1
  namespace: nm-1 # 이부분을 명시하지 않으면 default로 자동 생성된다.
  labels:
    app: pod
spec:
  ...
```

<br>

## ResourceQuota

![](https://kubetm.github.io/img/practice/beginner/How%20to%20use%20ResourceQuota%20for%20Kubernetes.jpg)  
*@그림 3: ResourceQuota 대한 간략한 예시 - 출처: 강의자료*

ResourceQuota는 위에서 설명한 것과 같이, Namespace에서 사용 가능한 자원(CPU, Memory, Storage 등)의 한계를 정한다. <u>ResourceQuota가 만들어진 이후에 생성되는 모든 파드는 ResourceQuota가 작성되어 있어야 하며, 이에 대한 기준이 맞았을 경우에만 파드가 생성된다.</u>

### 1. ResourceQuota 생성

그림 3에서의 2-2를 나타낸다. 
- requests: 컨테이너를 생성할 때 요청 가능한 최대 자원 크기
- limits: 생성된 컨테이너가 추가로 사용할 수 있는 자원의 한계치

```yaml
# 2-2
apiVersion: v1
kind: ResourceQuota
metadata:
  name: rq
  namespace: nm-2
spec:
  hard: # 한계치를 명시하는 부분
    requests.memory: 1Gi
    limits.memory: 1Gi
```

ResourceQuota는 자원의 한계치 뿐만 아니라, <u>Namespace에 생성가능한 오브젝트의 수도 제한</u>할 수 있다. RequestQuota가 잘 생성되었는지 확인하려면 아래의 명령어를 사용한다.

```bash
kubectl describe resourcequotas --namespace=nm-2
```

### 2. 파드 생성

```yaml
# 2-4
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
  - name: container
    image: nginx
    resources:  # 이 부분이 명시되지 않으면 파드가 생성되지 않는다.
      requests:
        memory: 0.5Gi 
      limits:
        memory: 0.5Gi 
```        

만약 namespace 내 모든 파드의 requests와 limits의 합이 requestQuota에 설정한 값보다 초과한다면, 파드는 생성되지 않는다.

<br>

## LimitRange
 
![](https://kubetm.github.io/img/practice/beginner/How%20to%20use%20LimitRange1%20for%20Kubernetes.jpg)  
*@그림 4: LimitRange 대한 간략한 예시 - 출처: 강의자료*

각 파드가 Namespace에 들어올 수 있는지 여부를 확인할 때 사용한다. 그림 4의 3-2가 이에 해당한다.
- min: 파드가 충족해야 하는 자원의 최소 크기
- max: 파드가 충족해야 하는 자원의 최대 크기. 그림에서 파드(3-3)은 limit의 값이 max를 초과하기 때문에 생성되지 않는다.
- maxLimitRequestRatio: request와 limit의 최대 비율. 그림에서 파드(3-3)은 request와 limit의 비율이 5이므로, 3보다 크기 때문에 생성되지 않는다.
- defaultRequest: request와 limit를 명시하지 않고 파드를 생성할 때 기본값. 그림의 3-3'이 이에 해당한다.
- Namespace 및 클러스터에 적용 가능한 ResourceQuota와 다르게 <u>LimitRange는 오직 namespace 내에서만 사용 가능</u>하다.

### 1. LimitRange 생성

```yaml
# 3-2
apiVersion: v1
kind: LimitRange
metadata:
  name: lr
spec:
  limits:
  - type: Container
    min:
      memory: 0.1Gi
    max:
      memory: 0.4Gi
    maxLimitRequestRatio:
      memory: 3
    defaultRequest:
      memory: 0.1Gi
    default:
      memory: 0.2Gi
```

RequestQuota가 잘 생성되었는지 확인하려면 아래의 명령어를 사용한다.

```bash
kubectl describe limitranges --namespace={namespace 이름}
```

### 2. 파드 생성

```yaml
# 3-3'
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
  - name: container
    image: nginx
    resources:
      requests:
        memory: 0.2Gi
      limits:
        memory: 0.4Gi
```

### 3.LimitRange가 중복된다면?

만약 하나의 Namespace 내에 서로 다른 request와 limit를 갖는 LimitRange가 2개 이상 존재한다면 어떻게 될까? 예시로 max는 더 작은 값을 기준이라고 판단하는데, 이 경우 파드를 더 큰 max로 맞추고 생성하면 생성이 안될 수 있다. 이러한 혼선을 방지하기 위해 LimitRange는 꼭 약속된 하나의 기준으로 적용될 수 있도록 해야 한다.

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)