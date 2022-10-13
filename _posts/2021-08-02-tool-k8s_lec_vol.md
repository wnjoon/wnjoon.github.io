---
layout: post
title:  "Kubernetes: Volume - emptyDir, hostPath, PV/PVC" 
excerpt: "쿠버네티스의 Volume과 세부 종류인 emptyDir, hostPath, PV/PVC 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-02 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 볼륨(Volume)의 필요성

컨테이너로 이루어진 파드는 서비스 때 언급한 것과 마찬가지로 <u>생성과 삭제가 매우 빈번하게 이루어지는</u> 단위이다. 문제는 파드가 삭제되면 파드 내 컨테이너에 저장되어 있던 데이터 또한 삭제된다는 것이다. 이를 방지하기 위해 쿠버네티스에서는 다양한 방법으로 컨테이너 외부에 볼륨을 구성해서 데이터를 보존할 수 있도록 지원한다.  
크게 emptyDir, hostPath, PV/PVC로 구성된다. 그리고 PV의 성격에 따라 StorageClass와 내부 상태값이 존재한다.

![image](https://user-images.githubusercontent.com/39115630/161413652-8f1f74a8-05d9-4d59-8dc1-a32f840b8895.png)  
*@그림 1: 쿠버네티스에서 사용되는 볼륨의 전반적인 개요 - 출처: 강의자료*

<br>

## emptyDir

> 파드 안에서 생성되며 컨테이너들끼리 데이터를 한 곳에 공유하기 위해서 사용. 초기에 만들어질 때에는 빈공간으로 생성되기 때문에 emptyDir이라는 이름이 붙여짐.

![image](https://user-images.githubusercontent.com/39115630/137561215-d4d9f8e4-a5a1-4b15-a128-4eefcdceb0ca.png)  
*@그림 2: emptyDir 예시 그림 - 출처: dev.to*

위 그림의 Pod1를 예로 들어보자. 두 컨테이너는 하나의 볼륨을 공유하고 있다. 예로 컨테이너1은 웹서버 역할을, 컨테이너2는 DB 역할을 담당한다고 하자. 두 컨테이너는 서로의 데이터를 참조하기 위해 서로 통신할 필요 없이 공유되어 있는 emptyDir을 통해 바로 데이터를 주고받을 수 있게 된다. 즉 <u>emptyDir은 각 컨테이너의 내부 로컬 디렉토리처럼 사용</u>된다.  
파드 안에서 생성되는 구조이기 때문에, 당연히 파드가 생성될 때 생기고 삭제되면 같이 삭제된다. 그러므로 일시적인 사용 용도를 지닌 데이터를 넣을때에만 사용하는 것이 좋다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-volume1
spec:
  containers:
  - name: container1
    image: nginx
    volumeMounts:
    - name: empty-dir
      mountPath: /mount1
  - name: container2
    image: mariadb
    volumeMounts:
    - name: empty-dir
      mountPath: /mount2
  volumes:
  - name : empty-dir 
    emptyDir: {}
```

위의 예시는 서로 다른 두 컨테이너(container1, container2)가 파드 내부에 있는 empty-dir이라는 디렉토리를 공유하도록 설정한 yaml 파일이다. 각 컨테이너 내부의 마운트되는 디렉토리 이름이 달라도, volumes/name에 있는 empty-dir 이름으로 판별되기 때문에 상관없다.

<br>

## hostPath

> 파드가 올라가 있는 노드에 별도의 볼륨을 만들어서 파드가 노드의 데이터를 사용하기 위해서 구성.

![](https://res.cloudinary.com/practicaldev/image/fetch/s--lp1tEc81--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/c6evmxw9k2uqpjbvg8g9.png)  
*@그림 3: hostPath 예시 그림 - 출처: dev.to*

위의 그림과 같이 hostPath는 노드 내에 있는 파드가 노드에 있는 디렉토리의 자원을 사용하기 위해서 구성된다. 일반적으로 노드 안에 있는 시스템 파일과 같은 내용을 파드가 서로 사용하고자 할 때 구성된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-volume2
spec:
  nodeSelector:
    kubernetes.io/hostname: node1 
  containers:
  - name: container
    image: kubetm/init
    volumeMounts:
    - name: host-path
      mountPath: /mount1
  volumes:
  - name : host-path
    hostPath:
      path: /node-v  # 호스트(노드)에 있는 디렉토리 경로
      type: DirectoryOrCreate
```

하지만 앞에서 설명한 것과 같이, <u>파드는 생성과 삭제가 빈번할 뿐만 아니라, 노드의 자원 상태에 따라 스케쥴러가 기존의 노드가 아닌 다른 노드로 파드를 생성할 가능성도 존재</u>한다. 그렇게 되면 hostPath 경로가 달라지기 때문에 변경된 노드에 별도의 mount를 추가로해줘야 하는 번거로움이 발생할 수 있다. 위의 예시에서는 node1 안에 hostPath를 구성하고 있다.

추가로 hostPath의 type은 아래와 같이 4가지 중 하나로 구성 가능하다.
- DirectoryOrCreate : 실제 경로가 없다면 생성
- Directory : 실제 경로가 있어야됨
- FileOrCreate : 실제 경로에 파일이 없다면 생성
- File : 실제 파일이 었어야함

<br>

## PVC/PV

> Persistent Volume Claim / Persistent Volume  
> 파드에 영속성 있는 볼륨을 제공하기 위해서 사용. 다양한 외부 스토리지를 볼륨으로 연결하기 위해 구성.

![](https://res.cloudinary.com/practicaldev/image/fetch/s--diRyuUP4--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/x5n82ttcrkhol1ixycwy.png)  
*@그림 4: pvc/pv 예시 그림 - 출처: dev.to*

파드는 pv에 바로 연결하지 않고 pvc를 통해서만 pv와 연결할 수 있다. 사실 파드와 pv를 직접 연결하는게 좋을 것으로 보이지만, 쿠버네티스는 쿠버네티스를 관리하고 담당하는 admin과 파드의 서비스를 만들고 이를 배포하는 서비스 담당자인 user의 경계를 구분하기 위해 이와 같은 방법을 사용하고 있다. 실제로 <u>volume의 종류는 AWS, git, NFS 등 굉장히 많이 있으며, 각각의 종류마다 구성 방식 또한 다르기 때문에 admin에서 pv를 전담하여 만들고 user가 pvc를 이용하여 pv와 연결하는 것이 더 좋은 방법</u>이라고 볼 수 있다.

PV와 PVC를 이용하여 볼륨을 구성하는 순서는 아래와 같다.

**(1) PV를 정의한다.** 

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv
  labels: # 해당 label과 동일한 selector를 갖는 pvc만 연결 가능
    pv: pv
spec:
  capacity:
    storage: 2G # 해당 스토리지 범위를 충족하는 pvc만 연결 가능
  accessModes:
  - ReadWriteOnce # 해당 접근모드를 충족하는 pvc만 연결 가능
  local:
    path: /node-v
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - {key: kubernetes.io/hostname, operator: In, values: [node1]}
```

> {key: kubernetes.io/hostname, operator: In, values: [node1]}  
> 위의 예시는 pv에 연결되는 파드들은 node1 위에서만 만들어지도록 되어 있음(local 타입)  
> 데이터의 영속성은 유지해줄 수 있으나, 실제로는 잘 사용되지 않는 방법임

**(2) PVC를 정의한다.**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc
spec:
  accessModes:
  - ReadWriteOnce # 해당 접근모드가 필요
  resources:
    requests:
      storage: 2G # 해당 자원양만큼의 스토리지가 필요
  storageClassName: ""
  selector:
    matchLabels:
      pv: pv # 해당 label을 갖는 pv에 연결하려고 함
```

**(3) PVC와 PV를 연결한다.**

**(4) Pod를 생성하고, PVC를 마운트한다.**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
  - name: container
    image: nginx
    volumeMounts:
    - name: pvc-pv
      mountPath: /mount-v # 파드의 /mount-v라는 디렉토리에 pvc에 연결된 pv 연결
  volumes:
  - name : mount-v
    persistentVolumeClaim:
      claimName: pvc # 위에서 만든 pvc를 연결
```
<br>

## Dynamic Provisioning

사용자가 PVC를 만들면 자동으로 PV를 만들어서 실제 볼륨과 연결해주는 기능이다. 이 기능을 사용하려면 PV를 만들어줄 수 있는 스토리지 솔루션(예: StorageOS)을 사용해야 한다.  
스토리시 솔루션을 통해 PV를 만들면 Service, Pod 등의 오브젝트가 자동으로 생성되는데, 이 중 StorageClass라는 오브젝트를 이용하여 동적으로 PV를 만들게 된다. 

![image](https://user-images.githubusercontent.com/39115630/161413758-411d9e87-1609-4f48-bae7-8cd7336d3631.png)  
*@그림 5: Dynamic Provisioning - 출처: 강의자료*

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-fast1
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1G
  storageClassName: "fast"  
  # 위의 그림에서 StorageClass에 연결되는 파드의 라벨을 fast로 하였으므로, StorageClass와 연결된다.
  # 만약 storageClassName 자체를 작성하지 않으면, StorageClass에 작성된 PV로 연결된다.
```

StorageClass는 아래와 같은 yaml로 생성된다.  

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: default
  annotations:
    # Default StorageClass로 선택 
    storageclass.kubernetes.io/is-default-class: "true" 
# 동적으로 PV생성시 PersistentVolumeReclaimPolicy 선택 (Default:Delete)
reclaimPolicy: Retain, Delete, Recycle
provisioner: kubernetes.io/storageos
# provisioner 종류에 따라 parameters의 하위 내용 다름 
parameters:    
```

<br>

## Status & ReclaimPolicy

PV의 상태는 총 4가지(Available, Bound, Released, Failed)로 분류된다. 그 중 PV가 PVC로부터 반납(사용이 중단)된 상태일 경우에는 ReclaimPolicy(Retain, Delete, Recycle)에 따라 다른 동작이 수행된다.

- Availaible : PV가 만들어졌을 때의 상태
- Bound : PV에 특정 PVC가 연결되었을 때의 상태. PVC에 Pod가 연결되기 전까지는 실제 볼륨이 생성되지는 않음
- Released : PV에 연결되어 있던 PVC가 삭제되었을 때의 상태
  - Retain : 별도의 ReclaimPolicy를 설정하지 않았을 경우 기본값으로, 볼륨의 데이터는 보존되나 해당 PV를 다른 PVC에서 재사용할 수는 없다.
  - Delete : StorageClass를 사용하여 만들어진 PV의 경우 기본값으로, PV가 삭제되면 볼륨의 상태에 따라 연결되어있던 데이터의 삭제 여부가 결정된다. 해당 PV를 다른 PVC에서 재사용할 수 없다.
  - Recycle : 현재는 Deprecated 되어있음. 볼륨의 데이터가 삭제되나 다른 PVC에서 재사용할 수 있음.
- Failed : PV에 문제가 생 겼을 때의 상태

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-recycle1
spec:
  persistentVolumeReclaimPolicy: Recycle # Recycle 상태의 ReclaimPolicy를 부여하는 경우(현재는 deprecated)
  capacity:
    storage: 3G
  accessModes:
  - ReadWriteOnce
  hostPath:
    path: /tmp/recycle
    type: DirectoryOrCreate
```

<br>

## 참고자료
- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)
- [[k8s] Life cycle of volumes - Julian Chu](https://dev.to/julianchu/k8s-life-cycle-of-volumes-2h11)