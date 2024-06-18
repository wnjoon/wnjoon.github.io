---
layout: post
title:  "Kubernetes: Controller - Ingress" 
excerpt: "쿠버네티스 클러스터 내에서 로드밸런싱(Load Balancing)을 담당하는 Ingress에 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-14 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 사용 목적

![image](https://user-images.githubusercontent.com/39115630/161417243-b13e0aae-db7a-47e5-9656-3dd5cdfcb012.png)  
*@그림 1: Ingress의 사용 목적 - 출처: 강의자료*

### Service Load Balancing

위의 그림처럼 서로 다른 업무(shopping, customer, order)별로 파드가 존재하고 해당 파드 별로 서비스가 존재할 때, 일반적으로는 L4 스위치 등으로 각 URL 경로를 연결하지만 쿠버네티스에서는 이를 Ingress가 관리해준다. 이를 통해 별도의 IP 로드밸런싱을 위한 장비가 필요없게 된다.

### Canary Upgrade

위의 그림처럼 테스트용 파드(App v2)가 존재한다고 할 때, 전체 트래픽 중 일부(10%)에 대해서만 테스트용 파드로 데이터를 보낼 수 있도록 할 수 있다. 

<br>

## Ingress 구성 요소

Ingress는 크게 Host와 Path, ServiceName으로 구성된다.
- Host : 외부로부터 접근 가능한 도메인 URL 주소
- Path : 세부 경로
- ServiceName : 세부 경로마다 연결되는 서비스

하지만 Ingress를 선언하는것만으로는 사용할 수가 없고, Ingress Controller가 추가로 필요하게 된다. Ingress Controller에는 대표적으로 nginx 또는 Kong 등이 있다. 만약 nginx를 설치하게 되면 다음의 순서로 Ingress Controller가 구성된다.

1. nginx에 대한 Namespace 생성
2. 해당 Namespace 위에 Deployment와 ReplicaSet이 만들어짐
3. ReplicaSet 안에 Ingress가 설정된 파드가 생성됨
4. 파드에 있는 Ingress 규칙에 따라 각 서비스에 연결
5. 외부의 사용자들이 Ingress를 사용할 수 있도록, Ingress가 설정된 파드와 연결되는 서비스(NodePort, LoadBalancer) 필요

또한 Ingress 설정 시 Host나 Path를 지정하지 않을 수도 있다.

### Ingress 예시

**Service LoadBalancing**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: service-loadbalancing
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths: # path 별로 서비스를 구별
      - path: /
        pathType: Prefix
        backend:
          service:
            name: home
            port:
              number: 8080
      - path: /customer
        pathType: Prefix
        backend:
          service:
            name: customer
            port:
              number: 8080
      - path: /order
        pathType: Prefix
        backend:
          service:
            name: order
            port:
              number: 8080
```

**Canary Upgrade**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10" # 전체 트래픽의 10%를 해당 서비스(svc-v2)로 보냄
spec:
  ingressClassName: nginx
  rules:
  - host: www.app.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: svc-v2
            port:
              number: 8080
```

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)