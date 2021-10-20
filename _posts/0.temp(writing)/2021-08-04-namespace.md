---
title:  "Namespace, ResourceQuota, LimitRange" 
excerpt: "쿠버네티스의 네임스페이스와 파드 사이의 적절한 자원 분배를 위한 제한 방법에 대하여 알아본다."

categories:
  -  Kubernetes
tags:
  - [Kubernetes, Network, Distributed Computing, InfraStructure]

toc: true
toc_sticky: true

date: 2021-08-04
last_modified_at: 2021-10-16
---

<br>

> 📒 본 포스팅은 인프런에서 제공하는 강의 ['대세는 쿠버네티스 [초급~중급] - 김태민'](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)를 본 후 내용을 정리하고 있습니다. 

## 자원 분배의 필요성

쿠버네티스는 클러스터에 따라 사용할 수 있는 자원의 한계가 있다. 마치 우리가 클라우드 혹은 외장하드와 같은 별도의 장치나 서비스를 사용하지 않는다면 PC에 연결된 하드 또는 SSD의 용량만 사용할 수 있는 것과 같다. 여기서의 자원은 CPU, Memory와 같은 종류를 포함한다.

![](https://kubetm.github.io/img/practice/beginner/Namespace,%20ResourceQuota,%20LimitRange%20for%20Kubernetes.jpg)  
*@그림 1: 한정된 자원을 네임스페이스와 파드에 적절히 분배해야만 한다. - 출처: 강의자료*

쿠버네티스 클러스터는 다양한 네임스페이스와 이러한 네임스페이스 내부에 존재하는 여러 개의 파드들을 구성할 수 있다. 이들은 클러스터의 자원을 '나누어서' 사용하게 되는데, 이러한 이유로 자원을 효율적으로 분배해서 되도록 많은 파드가 서비스를 수행할 수 있도록 해야 한다. 만약 하나의 네임스페이스에서 모든 자원을 사용해버린다면, 클러스터 내의 다른 네임스페이스에 속한 파드들은 자원을 하나도 사용하지 못하고 서비스가 이루어지지 못할 것이다.

이를 방지하기 위해 ResourceQuota와 LimitRange라는 옵션이 있다. ResourceQuota는 네임스페이스에 최대로 할당 가능한 자원의 크기를 한정하는 기능이고, 네임스페이스에 있는 자원을 특정 파드가 독식하지 않도록 네임스페이스에 할당될 수 있는 파드의 자원 크기를 제한하는 LimitRange가 있다. 물론 ResourceQuota와 LimitRange는 네임스페이스에만 설정할 수 있는 것이 아니며, 클러스터 전체에 대해서도 설정할 수 있다.

<br>

## ResourceQuota

 


## Env(Literal) : 환경변수(상수)

>  각 컨테이너를 생성할 때 해당 값을 상수형태로 작성하고, 이를 파드에서 참조하는 방식.

![](https://kubetm.github.io/img/practice/beginner/ConfigMap,%20Secret%20with%20Literal%20for%20Kubernetes.jpg)  
*@그림 2: ConfigMap, Secret 컨테이너에 직접 변수를 등록하고 이를 파드가 참조하는 방식 - 출처: 강의자료*

ConfigMap, Secret 각 컨테이너를 생성할 때, 내부에 해당 값을 상수형태로 작성하는 방식이다. 값이 변경될 일이 발생하지 않는 환경이나 간단한 테스트 용으로는 적합하지만, 값을 변경하려면 컨테이너를 다시 생성해야 하는 번거로움이 존재한다.

> 그림에서 볼 수 있듯이, Secret의 내부 값은 Base64로 인코딩되어 들어가야 한다. 컨테이너를 구성할 때 사용한 yaml 파일을 통해 Secret 값을 알아낼 수 없도록 하기 위한 방안이다. 파드에 참조될 때에는 다시 디코딩되어 원래 값이 들어간다.

**(1) Literal 방식의 ConfigMap 생성** 

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: configmap-literal
data:
  SSH: 'false'
  User: dev
```

```bash
# key1:value1 이라는 상수를 configMap에 적용하려는 경우
kubectl create configmap cm-file --from-literal=key1=value1
# 여러개의 key:value를 적용하려는 경우 (--from-literal을 계속 추가)
kubectl create configmap cm-file --from-literal=key1=value1 --from-literal=key2=value2
```

**(2) Literal 방식의 Secret 생성** 

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-literal
data:
  Key: MTIzNA== # 꼭 base64 인코딩한 값을 주입해야 한다!
```

```bash
# key1:value1 이라는 상수를 secret에 적용하려는 경우
kubectl create secret generic sec-file --from=literal=key1=value1
```

**(3) Literal 방식의 ConfigMap, Secret을 적용한 Pod**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
  - name: container
    image: nginx
    envFrom: # 위에서 생성한 각 오브젝트를 Ref 형태로 주입한다.
    - configMapRef:
        name: configmap-literal 
    - secretRef:
        name: secret-literal
```

<br>

## Env(File) : 환경변수(파일)

> 파일 형태로 작성된 값을 참조해서 ConfigMap, Secret을 컨테이너를 만들고, 파드가 이를 참조하는 방식

![](https://kubetm.github.io/img/practice/beginner/ConfigMap,%20Secret%20with%20File%20for%20Kubernetes.jpg)  
*@그림 3: 파일을 참조하여 ConfigMap, Secret를 만들고 이를 파드가 참조하는 방식 - 출처: 강의자료*

ConfigMap과 Secret에서 사용할 값을 파일로 작성하고, 이를 컨테이너로 만들어서 파드가 참조하는 방식이다. yaml 파일에 값을 넣어서 컨테이너로 만드느냐 파일로 작성한 것을 cli를 통해 컨테이너로 만드느냐의 차이일 뿐, 큰 차이는 없다. <u>다만 Secret 생성을 위한 파일 내부의 값은 Base64가 아닌 일반 값으로 작성되어야 한다. cli를 통해 Secret으로 만들어질 때 Base64 인코딩이 되기 때문에, 파일 내부에 인코딩 된 값을 작성한다면 컨테이너는 2번 인코딩된 값을 포함하기 때문이다.</u>

**(1) File에 작성된 내용을 이용하여 ConfigMap 컨테이너 생성**

```bash
kubectl create configmap cm-file --from-file=./file-configmap.txt
```

**(2) File에 작성된 내용을 이용하여 Secret 컨테이너 생성**

```bash
kubectl create secret generic sec-file --from-file=./file-secret.txt
```

**(3) File을 참조하여 만들어진 ConfigMap, Secret을 적용한 Pod**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod
spec:
  containers:
  - name: container
    image: nginx
    env:
    - name: file-c
      valueFrom:
        configMapKeyRef:
          name: cm-file
          key: file-configmap.txt
    - name: file-s
      valueFrom:
        secretKeyRef:
          name: sec-file
          key: file-secret.txt
```

<br>

## Volume Mount(File) : 볼륨마운트(파일)

> 파일이 존재하는 볼륨을 마운트하고, 해당 볼륨에 있는 파일을 파드가 참조하는 방식

![](https://kubetm.github.io/img/practice/beginner/ConfigMap,%20Secret%20with%20Mount%20for%20Kubernetes.jpg)  
*@그림 3: 파일이 존재하는 볼륨을 마운트하고 이를 파드가 참조하는 방식 - 출처: 강의자료*

위의 환경변수(파일) 방식과 ConfigMap, Secret을 만드는 과정은 동일하다. 단, 파드를 생성하는 yaml 파일에 env가 아닌 volumeMounts 값을 이용하여 파일이 존재하는 볼륨 위치를 등록하고 해당 파일의 값을 파드가 사용하도록 한다. 

그렇다면 두 방식의 차이는 무엇일까? 파드가 생성된 이후에 파일 내부의 값이 변경되는 경우 차이가 발생한다. 만약 파드가 생성된 후 ConfigMap 내부의 값을 변경했다고 하자. 환경변수(파일) 방식은 파드가 생성될 때 해당 내용이 주입되는 것이기 때문에, 파드가 삭제되었다가 다시 생성되지 않는 한 변경된 값이 적용되지 않는다. 하지만 볼륨마운트 방식은 파일의 원본을 직접 참조하기 때문에, 내용의 변경이 바로 파드에 적용된다.

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
    - name: file-volume
      mountPath: /mount
  volumes:
  - name: file-volume
    configMap:
      name: cm-file
```

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br>