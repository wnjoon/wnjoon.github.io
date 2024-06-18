---
layout: post
title:  "Kubernetes: Controller - Autoscaler" 
excerpt: "쿠버네티스를 구성하는 다양한 요소들의 갯수를 관리하는 Autoscaler에 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-15 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## Autoscaler의 종류

### HPA(Horizontal Pod Autoscaler)

파드의 갯수를 조절하는 컨트롤러. 파드의 증가와 감소에 따라 Scale In/Out으로 나뉜다.  
- Scale Out : 파드에 할당된 리소스가 많은 트래픽으로 인해 전부 사용되어 파드가 죽을 수도 있는 경우, HPA에서 이를 감지하고 있다가 파드의 갯수(replicas)를 증가시킨다. 파드가 증가하면 트래픽 또한 파드 갯수에 반비례하여 감소하고, 파드 별 자원 사용량 또한 감소하게 된다.
- Scale In : 트래픽이 감소하여 자원의 낭비를 줄이고자 파드를 줄이는 경우를 말한다.
일반적으로 빠르게 기동되는, 특히 <u>Stateless 성격의 어플리케이션에서만 사용</u>된다.

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: hpa-resource-cpu
spec:
  maxReplicas: 10
  minReplicas: 2
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: stateless-cpu1
  metrics:
  - type: Resource # 파드의 리소스를 통해 Scale In/Out을 결정
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50 # 사용 자원이 평균 50%를 넘어가면 Scale Out
```
- averageUtilization 예시 : HPA에서 관리하는 모든 파드의 평균 CPU Request가 200m일 때, 50%는 100m이 된다. 그러므로 실제 CPU 사용률이 100m가 넘으면 Scale Out을 하게 된다.
- 그렇다면 몇개를 증가시켜야 할까? 쿠버네티스에서 사용하는 공식은 '현재 replicas * 평균값 * 파드 증가 조건 CPU 사용률'이다. 총 replicas를 2개라고 하고, 위의 값을 그대로 사용하면 '2 * 200(평균) / 사용률(100)' = 4가 된다.
- 그렇다면 CPU가 50m로 줄어들었을 때 Scale In은 몇개까지 진행될까? 위의 공식에 그대로 대입하면 4 * 50 / 100 = 2개로 줄여야 한다. 이렇게 줄어든 최종 갯수가 minReplicas보다 작거나 같을 경우에는 더이상 파드를 삭제하지 않는다.

### VPA(Vertical Pod Autoscaler)

파드의 리소스를 관리하는 컨트롤러. HPA와 다르게 파드 내 리소스양의 조절에 따라 Scale Up/Down으로 나뉜다.  
- Scale Up : 파드에 할당된 리소스를 거의 다 사용할 경우, VPA가 이를 감지하고 있다가 파드를 재시작함과 동시에 파드의 리소스를 증가시킨다. 
- Scale Down : 트래픽이 예전처럼 감소하는 경우, 다시 리소스양을 낮추는 경우를 말한다.  
HPA와 다르게 <u>Stateful한 성격의 어플리케이션에서만 사용 가능</u>하며, <u>하나의 컨트롤러에서 HPA와 VPA는 동시에 사용할 수 없다</u>.

### CA(Cluster Autoscaler)

클러스터에 워커(Worker) 노드를 추가하는 컨트롤러. 클러스터 내 모든 워커 노드에서 리소스 고갈과 같은 이유로 더이상 파드를 생성할 수 없는 경우, CA가 이를 감지하고 있다가 워커 노드를 클러스터 내에 추가한다.  
특히 CA를 AWS, GCP, Azure와 같은 외부 클라우드에 구성할 경우, CA가 해당 클라우드 프로바이더(Provider) 서버 내에 노드를 구성하고 해당 노드에 파드를 생성한다.  

> 만약 로컬 환경의 노드에 리소스 여유가 생긴다면 어떻게될까? 기본적으로 클라우드 프로바이더는 사용 시간에 따라 과금을 부여하기 때문에, 쿠버네티스는 클라우드 프로바이더의 노드를 삭제하고 해당 노드에 있던 파드를 그대로 로컬 환경에서 기동시킨다.

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)
