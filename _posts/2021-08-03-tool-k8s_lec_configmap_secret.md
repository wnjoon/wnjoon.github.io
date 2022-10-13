---
layout: post
title:  "Kubernetes: Object - ConfigMap, Secret" 
excerpt: "운영 또는 개발환경에 따라 쿠버네티스에서 사용할 환경변수 및 키 값을 저장하고 관리하는 Object들에 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-03 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## ConfigMap과 Secret의 필요성

SSH를 예로 들어보자. ~~물론 개발환경에서도 SSH 적용을 하면 좋을 수 있지만,~~ 개발환경의 성능과 불필요한 귀찮음을 배제하기 위해서라도 사용하지 않는 경우가 많다. 개발환경과 운영환경에서 사용되는 ID, 비밀번호도 다를 것이다. 이러한 환경변수는 쿠버네티스 내 컨테이너 이미지에 들어가는데, 환경마다 컨테이너 이미지를 각자 관리한다는 것은 꽤 번거로운 일이다.

쿠버네티스는 이를 해결하기 위해 ConfigMap과 Secret라는 오브젝트를 제공한다. 각 환경마다 분리해야 하는 일반적인 상수형태의 환경변수(SSH 유무, User ID)를 갖는 오브젝트를 ConfigMap라고 하고, 비밀번호 또는 인증서와 같이 조심스러운 데이터를 담는 오브젝트를 Secret이라고 한다.

![](https://kubetm.github.io/img/practice/beginner/ConfigMap,%20Secret%20with%20Literal,%20File%20on%20Env,%20Mount%20for%20Kubernetes.jpg)  
*@그림 1: ConfigMap, Secret을 사용하는 간단한 예시 - 출처: 강의자료*

위 그림과 같이 Dev/Production 환경에 맞게 ConfigMap과 Secret에 대한 컨테이너를 만들어두고 이를 활용하는데, 이를 구성할 수 있는 방식은 총 3가지가 있다. 이 중 하나(Literal)는 상수 값을 바로 컨테이너에 등록하는 방법이고, 나머지 2개는 파일을 참조하는 방식이다.

<br>

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