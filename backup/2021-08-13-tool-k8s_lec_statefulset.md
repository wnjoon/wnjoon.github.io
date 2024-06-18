---
layout: post
title:  "Kubernetes: Controller - StatefulSet" 
excerpt: "쿠버네티스 내에서 데이터베이스와 같이 각 파드가 서로 다른 상태를 갖고 있는 StatefulSet에 대해서 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-13 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## Stateless / Stateful 어플리케이션

![image](https://user-images.githubusercontent.com/39115630/161416087-4237a6d3-37e6-4769-bb24-c31fd1c2f379.png)  
*@그림 1: Stateless / Stateful 어플리케이션 - 출처: 강의자료*

### Stateless 어플리케이션

Web 서버와 같이 서버마다 올라간 서비스가 동일한 동작을 하는, 단순 분산처리를 목적으로 하는 어플리케이션을 의미한다. 장애가 발생해서 새로 생겨나는 서비스가 이전의 서비스와 연관성을 가질 필요가 없으며, 서비스 별로 볼륨을 꼭 가지고 있지 않아도 된다.  
쿠버네티스에서는 <u>ReplicaSet</u>을 이용하여 Stateless 어플리케이션을 관리한다.

### Stateful 어플리케이션

Database와 같이 서버마다 서로 다른 서비스가 동작하는 어플리케이션을 말한다. 예시로 MongoDB의 경우 메인 DB 역할을 담당하는 Master, Master가 죽었을 경우 백업 용도로 사용하는 Secondary, 각 DB 서비스가 살아있는지 확인하는 Arbiter로 구성되는데, 각 서비스 별로 명확한 역할이 주어지기 때문에 특정 서비스가 죽었을 경우 이와 동일한 서비스와 그에 따른 역할을 선택적으로 구동시켜야 한다.  
추가로 각 서비스는 독립적인 볼륨을 가지게 되는데, 이로 인해 각 볼륨은 서로 다른 데이터를 포함하고 있고 장애 복구 시 이를 그대로 유지해야 한다.  
쿠버네티스에서는 <u>StatefulSet</u>을 이용하여 Stateful 어플리케이션을 관리한다.

<br>

## StatefulSet과 ReplicaSet의 비교

### Pod 관리

![image](https://user-images.githubusercontent.com/39115630/161416566-fc06d158-1d50-443e-94b7-c36a44e85712.png)  
*@그림 2: Pod 관리 시 StatefulSet과 ReplicaSet 비교 - 출처: 강의자료*

|**상황**|**ReplicaSet**|**StatefulSet과**|
|---|---|---|
|replicas = 1|- Random한 이름으로 생성<br>- 예: Pod-dkf39|- 순차적인 번호를 붙여서 생성<br>- 예: Pod-0|
|replicas = 3|- Random한 이름으로 생성<br>- 예: Pod-dkf39, Pod-bod98, Pod-abi87|- 순차적인 번호를 붙여서 생성<br>- 예: Pod-0, Pod-1, Pod-2|
|replicas = 0|- 파드가 동시에 삭제|- 가장 최근에 생성된(높은 번호를 갖는 파드) 순서로 삭제<br>- 예: Pod-2 -> Pod-1 -> Pod-0|

```yaml
apiVersion: apps/v1
kind: StatefulSet # ReplicaSet 또는 StatefulSet으로 설정한다. 나머지 내용은 거의 동일
metadata:
  name: replicas-1
spec:
  replicas: 1
  selector:
    ...
```

## PersistentVolumeClaim

![image](https://user-images.githubusercontent.com/39115630/161416940-f0359b7c-2710-4b2c-b166-0e8327cdaffd.png)  
*@그림 3: PVC 관리에 대한 StatefulSet과 ReplicaSet 비교 - 출처: 강의자료*

|**상황**|**ReplicaSet**|**StatefulSet과**|
|---|---|---|
|replicas = 1|- PVC를 별도로 직접 생성한 후 파드에 연결<br>- 파드의 template에 해당 PVC를 직접 연결|- 파드의 생성 시점에 volumeClaimTemplates를 통해 동적으로 PVC가 생성됨<br>- 이후 파드와 동적으로 생성된 PVC가 자동으로 연결|
|replicas = 3|- 모든 파드가 동일한 PVC를 가지고, 동일한 PV와 연결<br>- PVC와 연결되는 파드는 지정된 노드에 생성되어야 하기 때문에 꼭 nodeSelector를 이용하여 노드를 지정해줘야 함|- 새로운 파드가 생성될 때마다 새로운 PVC가 동적으로 생성, 그러므로 nodeSelector를 꼭 명시할 필요 없음<br>- 특정 파드가 삭제되었다가 재생성되면, 해당 파드와 연결되어있던 PVC를 그대로 다시 연결해줌|
|replicas = 0|- PVC는 삭제되지 않음|- 파드는 순차적으로 삭제되지만, PVC는 삭제되지 않음<br>- 사용자가 직접 PVC를 삭제해야 함|

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: stateful-pvc
spec:
  replicas: 1
  selector:
    matchLabels:
      type: db2
  serviceName: "stateful-headless" # 하단의 Headless 설명 참조
  template: 
    metadata:
      labels:
        type: db2
    spec:
      containers:
      - name: container
        image: mongo-db
        volumeMounts:
        - name: volume
          mountPath: /applog
      terminationGracePeriodSeconds: 10
  volumeClaimTemplates: # 파드 생성 시점에 동적으로 PVC를 생성하기 위한 템플릿
  - metadata:
      name: volume
    spec:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 1G
      storageClassName: "fast" # StorageClass 사용
```

<br>

## Headless

![image](https://user-images.githubusercontent.com/39115630/161416976-1dc564df-711c-42e8-95df-fc6317291fa4.png)  
*@그림 4: StatefulSet에서의 Headless 적용 - 출처: 강의자료*

ServiceName = "stateful-headless"를 작성하면, 파드에 예측 가능한 도메인 이름(예: Pod-2.Headless)이 생성된다. 내부 서버에서는 이를 이용하여 원하는 StatefulSet을 갖는 파드에 연결할 수 있게 된다.

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)