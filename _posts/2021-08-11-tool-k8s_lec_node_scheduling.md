---
layout: post
title:  "Kubernetes: Pod - Node Scheduling" 
excerpt: "쿠버네티스 내에서 파드를 어떤 노드에 생성해야 하는지, 혹은 어떤 노드는 피해야하는지 등을 관리하는 노드 스케쥴링 방식에 대하여 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-11 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 개요

쿠버네티스를 이용하면 어떠한 파드를 어떠한 노드에 구성할지에 대한 가이드라인을 제시할 수 있다. 특정 노드를 지정하지 않은 상태에서 아무런 설정값이 없다면, 일반적으로 파드는 가장 자원의 상태가 여유로운 노드에 자동으로 생성된다.  
하지만 자원의 상태 외에도 파드를 특정 노드에 설치해야 하는 이유가 존재할 수 있다. 예를 들어 클라우드 서버의 Region을 묶어야 할 수도 있고, 하나의 기능을 같이 수행하는 파드를 같은 서버에 배치해야 할 수도 있다. 또는 실제 업무에 사용되는 파드와 백업용으로 사용하는 파드를 서로 다른 노드에 분리배치해야 할수도 있다.  
이러한 여러 정책을 관리하기 위해 쿠버네티스에서는 Node Scheduling 방식을 제공하고 있다.

![image](https://user-images.githubusercontent.com/39115630/160231603-69621f1e-09de-4843-9a6e-cd3621dc088a.png)  
*@그림 1: 노드 스케쥴링 방식에 대한 전체적인 개요 - 출처: 강의자료*

<br>

## Node 선택

### NodeName

말 그대로, 특정 노드를 명시하고 해당 노드에 파드를 생성하는 static한 방식이다.  
쿠버네티스 상에서 노드에 장애가 발생하고 해당 노드의 이름이 변경되는 경우, 이 방식은 해당 노드와 연결된 모든 파드의 정보를 변경해주어야 한다는 점에서 매우 비효율적이다.

### NodeSelector

파드에 명시되어 있는 라벨 값과 동일한 라벨을 갖는 노드에 파드를 생성하는 방식이다.  
물론 라벨 단위로 파드를 생성할 노드를 지정하기 때문에 좋아보이지만, 라벨 값이 모두 일치하는 서버에만 생성된다는 점에서 까다로운 방식이다.

### NodeAffinity

파드에 명시되어 있는 라벨 값과 동일한 라벨을 갖는 노드에 파드를 생성하지만, 그 범위가 조금 여유롭다.  
모든 라벨이 정확하게 일치하지 않아도 정책에 따라 노드를 선택하며, 가장 많이 사용되는 방식이다.

![image](https://user-images.githubusercontent.com/39115630/160231621-dd0932ac-e8e8-406e-be08-1c4a9dc5bc40.png)  
*@그림 2 : Node Affinity 사용 예시 - 출처: 강의자료*

- matchExpressions : 명시된 key값에 해당하는 라벨을 갖는 파드를 operator에 작성된 옵션에 따라 생성할지 여부를 결정하는 방식이다. operator는 총 6개의 종류가 있다.  
- required : 무조건 해당 key가 있는 노드에만 파드를 생성하는 방식  
- preferred : 해당 key를 가진 노드가 없을 경우, 자원의 상태가 괜찮은 다른 노드에 파드를 생성하는 방식  
  - preferred weight : preferred 상태에서 서로 다른 노드 중 어떤 노드에 파드를 생성할지 결정하는 기준으로, weight 값을 가중치로 추가해서 최종 값을 계산하여 높은 값을 갖는 노드에 파드를 생성한다.

#### Sample Source

**Node labeling**

```sh
$ kubectl label nodes k8s-node1 kr=az-1
$ kubectl label nodes k8s-node2 us=az-1
```

**Match Expressions : Required**

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: pod-match-expressions
spec:
 affinity:
  nodeAffinity:
   requiredDuringSchedulingIgnoredDuringExecution:   # <- required
    nodeSelectorTerms:
    - matchExpressions:
      -  {key: kr, operator: Exists}
 containers:
 - name: nginx
   image: nginx
 terminationGracePeriodSeconds: 0
```

**Preferred**

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: pod-preferred
spec:
 affinity:
  nodeAffinity:
   preferredDuringSchedulingIgnoredDuringExecution:  # <- preferred
    - weight: 1    # <- preferred weight
      preference:
       matchExpressions:
       - {key: ch, operator: Exists}
 containers:
 - name: nginx
   image: nginx
 terminationGracePeriodSeconds: 0
```

<br>

## Pod간 집중/분산

![image](https://user-images.githubusercontent.com/39115630/160231628-f91b8ab3-0710-4129-98fe-001f81aa9426.png)  
*@그림 3 : Pod Affinity 및 Anti Affinity 사용 예시 - 출처: 강의자료*

### Pod Affinity

만약 WebServer를 구동하는 두개의 파드(App, Database)가 있다고 가정하자. 이 두개의 파드를 꼭 하나의 서버(노드)에서 같이 관리하고 싶다면 이 방법을 사용한다.  
같이 묶여야 하는 파드 중 가장 먼저 노드에 생성된 파드의 라벨을 따라가는 방식인데, 위의 그림을 예시로 Web(Type:Web) 파드가 Node3에 생성되면 Server(Type:Web) 파드가 Scheduler에 명시되어 있는 정보를 보고 해당 노드에 같이 생성한다.  
NodeAffinity와 다르게 PodAffinity 내에 작성된 matchExpressions는 파드의 라벨을 확인한다. topologyKey가 노드의 key 값을 확인할 때 사용된다. 만약 topologyKey에 해당하는 노드가 없다면 파드는 생성되지 않는 Pending 상태가 된다.

### Pod Anti-Affinity

Pod Affinity와 반대되는 개념으로, 서로 같이 있으면 안되는 두 파드를 서로 다른 노드에 분할하여 생성하는 방식이다. 위에서 언급한 업무-백업 파드를 분리하는 것과 동일하다고 보면 된다.  
matchExpressions에 작성된 내용을 포함하는 파드가 존재하는 노드를 제외한 다른 곳에 생성되며, 이 경우에 topologyKey에 해당하는 노드 중 한 노드를 선택한다. 즉, topologyKey에 해당하는 노드 중 matchExpressions에 작성된 파드는 포함하지 않는 노드에 파드를 생성한다.

### Sample Source

**Node labeling**

```sh
$ kubectl label nodes k8s-node1 a-team=1
$ kubectl label nodes k8s-node2 a-team=2
```

**Pod Affinity**

```yaml
apiVersion: v1
kind: Pod
spec:
 affinity:
  podAffinity:  # <- pod affinity
   requiredDuringSchedulingIgnoredDuringExecution:   
   - topologyKey: a-team
     labelSelector:
      matchExpressions:
      -  {key: type, operator: In, values: [web1]}
 containers:
 - name: nginx
   image: nginx
 terminationGracePeriodSeconds: 0
```

**Pod Anti-Affinity**

```yaml
apiVersion: v1
kind: Pod
spec:
 affinity:
  podAntiAffinity: # <- pod anti-affinity
   requiredDuringSchedulingIgnoredDuringExecution:   
   - topologyKey: a-team
     labelSelector:
      matchExpressions:
      -  {key: type, operator: In, values: [master]}
 containers:
 - name: nginx
   image: nginx
 terminationGracePeriodSeconds: 0
```

<br>

## Node에 할당제한

![image](https://user-images.githubusercontent.com/39115630/160231652-5a675260-9903-4361-99cd-3bedd2856aaf.png)  
*@그림 4 : Taint 및 Toleration 사용 예시 - 출처: 강의자료*

### Taint

위의 그림에서 Node5는 GPU 기반의 고성능 프로그램을 구동하기 위해 존재한다. 이 경우 일반적인 업무를 하는 파드는 해당 노드에 생성되면 불필요한 자원에 대한 낭비가 생길 수 있다.  
이 경우 Node5에 Taint를 걸어주면, 해당 노드에 파드가 생성되지 않는다. 이 노드에 파드를 생성하고 싶다면, Toleration을 파드 생성과정에 명시해주어야 한다.  
taint를 식별해주는 key:value를 작성하고 effect를 통해 파드의 할당 여부를 작성한다. effect는 아래와 같은 종류가 있다.
- NoSchedule : 다른 파드는 절대 생성되지 않음
- PreferNoSchedule : 가급적 스케쥴링이 되지 않도록 하는 방식. 파드가 정 다른 노드에 배치될 수 없으면 생성을 허용

### Toleration

Taint가 걸려있는 노드는 위의 NodeName(static하게 노드 이름을 명시)과 같은 방식으로도 파드를 생성할 수 없다. 유일한 방법은 생성하고자 하는 파드 내부에 Toleration으로 특정 노드를 명시해주어야 한다.  
Toleration에 작성된 key, operator, value가 노드에 작성된 Taint와 일치하는 노드에 파드가 생성된다.  
<u>단, Toleration에 작성된 내용과 부합하는 노드에 작성할 수 있는 '가능성'이 존재하는 것이기 때문에, 파드 생성 시 nodeSelector를 이용하여 특정 노드에 추가될 수 있도록 설정해주어야 한다.</u>  

### Sample Source

**Node labeling**

```sh
$ kubectl label nodes k8s-node1 gpu=no1
```

**Taint in Node1**

```sh
$ kubectl taint nodes k8s-node1 hw=gpu:NoSchedule
```

**Pod with toleration**

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: pod-with-toleration
spec:
 nodeSelector:
  gpu: no1
 tolerations:
 - effect: NoSchedule
   key: hw
   operator: Equal
   value: gpu
 containers:
 - name: nginx
   image: nginx
 terminationGracePeriodSeconds: 0
```

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)