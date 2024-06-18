---
layout: post
title:  "Kubernetes: API - Authentication, Authorization" 
excerpt: "쿠버네티스 API 사용에 대한 권한과 이를 통한 자원의 접근권한에 대하여 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-12 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## Authentication

### X509 Client Cert

![image](https://user-images.githubusercontent.com/39115630/161414212-3c4060a5-ef74-4a2b-9be2-8293bcf477d5.png)  
*@그림 1: 쿠버네티스 클러스터에서 API 사용 권한 획득 방법 - 출처: 강의자료*

기본적으로 쿠버네티스 API 서버는 6443번 포트를 통해 https 요청을 받는데, 사용자가 https 요청을 사용할 수 있는 권한을 얻으려면 쿠버네티스 클러스터 생성 시점에 kubeconfig라는 디렉토리 내부에 있는 인증서 파일과 사용자의 개인키를 조합한 인증서 파일을 생성(client key, client crt)해서 사용자가 이를 가져와야 한다. 생성 방법은 그림 하단에 표시된 순서를 참조한다.  
생성이 완료되면 kubectl로 kubeconfig 전체를 복사해서 kubectl을 사용할 수 있는 권한을 가져온다. 이러한 과정이 있기 때문에 사용자는 kubectl을 이용하여 쿠버네티스 클러스터의 자원에 접근할 수 있게 된다.  
추가로 그림과 같이 kubectl에서 accept-hosts 기능으로 프록시를 열어둘 경우, 사용자는 8001번 포트를 이용하여 http 통신으로도 쿠버테니스 클러스터의 자원에 접근할 수 있게 된다.

### Kubectl

![image](https://user-images.githubusercontent.com/39115630/161414489-ead1e4dd-0762-4773-aedc-2315c3b85384.png)  
*@그림 2: 외부 서버에 kubectl을 설치하여 멀티 클러스터에 접근하는 방법 - 출처: 강의자료*

이를 위해서는 사전에 '클러스터의 kubeconfig 파일이 나의 kubectl에도 존재'해야 한다.  
kubeconfig 파일 내부를 살펴보면 다음과 같다.
- clusters : 클러스터에 대한 정보를 나타내며, 클러스터의 이름, 연결 정보, CA 인증서를 포함한다.
- users : 사용자에 대한 정보를 나타내며, 사용자의 이름과 개인키, 인증서를 포함한다.
- contexts : clusters와 users의 정보를 매핑한 내용을 포함한다.

사용자는 'kubectl config user-context ${context 이름}' 으로 원하는 context를 선택하고 해당 권한으로 노드의 클러스터를 조회할 수 있게 된다.

### Service Account

![image](https://user-images.githubusercontent.com/39115630/161414723-ca5e3a45-3453-4f20-8736-ce070189cc70.png)  
*@그림 3: Service Account 예시 - 출처: 강의자료*

클러스터에서 네임스페이스를 생성하면 기본적으로 default라는 이름의 Service Account가 생성된다. Service Account에는 Secret이 연결되는데, 추후에 파드가 생성되고 Service Account가 연결되면 Secret에 있는 토큰값을 통해서 쿠버네티스 API 서버에 접근할 수 있게 된다.  

<br>

## Authorization 

### RBAC

쿠버네티스가 자원에 대한 권한을 관리하는 가장 대표적인 방법으로, 역할 기반으로 이를 관리하며 Role과 RoleBinding이 있다.  
쿠버네티스에는 클러스터 단위로 생성되는 오브젝트(Node, PV, Namespace)와 네임스페이스 단위로 생성되는 오브젝트(Pod, Service)가 있다. 특히 네임스페이스에는 하나 이상의 Service Account가 존재하는데, 이러한 <u>Service Account에 Role과 RoleBinding을 어떻게 설정하느냐에 따라 사용자가 해당 네임스페이스 내부에 있는 자원에만 접근할지 혹은 클러스터 단위의 자원까지 접근할 수 있는지가 결정</u>된다.  

![image](https://user-images.githubusercontent.com/39115630/161415090-fd2e195e-aa03-4743-bb12-e0b058d0e66d.png)  
*@그림 4: Role과 RoleBinding 예시 - 출처: 강의자료*

#### Namespace 단위에서의 자원 접근

위의 그림처럼, Role은 여러개 생성할 수 있으나 하나의 RoldBinding에는 하나의 Role만 연결할 수 있게 된다. 하나의 RoleBinding은 여러 개의 Service Account에서 사용이 가능하다. 

#### Cluster 단위에서의 자원 접근

ClusterRole로 클러스터 단위의 자원에 접근할 수 있는 역할을 부여하고, 이를 ClusterRoleBinding에 연결하면 된다. 해당 ClusterRoleBinding을 Service Account에 연결하면 해당 Service Account가 속해있는 네임스페이스에서도 클러스터의 자원에 접근할 수 있는 권한이 생긴다.  
그림에서 Namespace B는 Service Account가 아닌 RoleBinding이 clusterRole과 연결되어 있는 것을 볼 수 있는데, 이렇게 되면 Service Account는 클러스터에 있는 자원에는 접근하지 못하게 된다. 그러면 Role과 RoleBinding을 사용하는 것과 전혀 다른점이 없다고 느껴질 수 있는데, <u>ClusterRole을 만들어서 이를 RoleBinding과 연결하게 되면 모든 네임스페이스에 동일한 Role을 부여해야 하는 경우 모든 네임스페이스마다 Role을 관리하는 것보다 변화에 대한 반영이 손쉽게 되고 관리가 편하게 된다</u>.  

### Role, RoleBinding

#### 네임스페이스 별로 권한을 부여하는 경우

![image](https://user-images.githubusercontent.com/39115630/161415404-8e06fde9-e54b-4a25-9906-936039bd039e.png)  
*@그림 5: 네임스페이스 별로 Role을 부여하는 예시 - 출처: 강의자료*

RoleBinding에 있는 roleReg에 생성된 Role을 연결하고, subjects에 해당 Service Account를 연결한다.  
Role의 각 속성에 해당하는 자원의 속성에 맞게 값을 넣어주는데, 파드의 경우에는 apiGroups를 ""로 설정한다.  

**Role**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: r-01
  namespace: nm-01
rules:
- apiGroups: [""]
  verbs: ["get", "list"]
  resources: ["pods"]
```

**RoleBinding**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: rb-01
  namespace: nm-01
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: r-01
subjects:
- kind: ServiceAccount
  name: default
  namespace: nm-01
```

#### 클러스터 별로 권한을 부여하는 경우

![image](https://user-images.githubusercontent.com/39115630/161415506-c9037f1e-dfec-43a9-972b-b8224ea8a8ed.png)  
*@그림 5: 클러스터 별로 Role을 부여하는 예시 - 출처: 강의자료*

clusterRole의 모든 내용에 *(all) 값을 설정하고, clusterRoleBinding에 해당 ClusterRole을 연결하고 subjects에 해당 Service Account를 연결한다.  

새로운 Service Account를 생성하고, 이를 ClusterRole과 연결해보는 과정을 진행해본다.   

**Service Account**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sa-01
  namespace: nm-01
```

**ClusterRole**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cr-01
rules:
- apiGroups: ["*"]
  verbs: ["*"]
  resources: ["*"]
```

**ClusterRoleBinding**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: rb-01
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cr-01
subjects:
- kind: ServiceAccount
  name: sa-01
  namespace: nm-01
```

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)