---
layout: post
title:  "Kubernetes: Pod - ReadinessProbe, LivenessProbe" 
excerpt: "쿠버네티스에서 파드의 생성 과정에서의 무결성을 보장하기 위한 방법인 ReadinessProbe와 LivenessProbe에 대해서 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-09 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 개요

파드 생성 과정과 생성된 파드의 운영 모두의 과정에서 발생할 수 있는 트래픽 장애를 방지하기 위한 방법으로, 파드 생성 시 꼭 필요한 요소이다.

![image](https://user-images.githubusercontent.com/39115630/159629757-ff865741-f7f8-410c-9c4d-154fb9484eb9.png)  
*@그림 1: ReadinessProbe와 LivenessProbe에 대한 간략한 설명 - 출처: 강의자료*

파드가 이미지를 정상적으로 다운로드하면 Running 상태가 되지만, 아래에 있는 Probe를 정상적으로 완료하지 않으면 ContainerReady 상태를 갖게 된다. Probe가 완료되기 전에는 파드가 정상적으로 생성되더라도 해당 파드로 트래픽이 전달되지 않는다.

### ReadinessProbe

만약 서로 다른 두 노드에 각각 파드가 하나씩 존재(replicas = 2)한다고 가정한다. 그 중 하나의 노드에 장애가 발생해서 파드가 삭제되었다면, 또 다른 노드에 해당 파드가 새로 생성되어야 할 것이다.  
하지만 새로운 노드에 파드가 '정상적'으로 구동되기 전까지는, 50%의 확률로 생성중인 파드에 접근하면서 장애가 발생할 가능성이 존재한다.  
ReadinessProbe는 파드가 실행 가능한 상태가 되었는지를 확인한 뒤 해당 파드에 트래픽을 전달함으로써, 파드 구동 중에 발생할 수 있는 장애를 막아준다.

### LivenessProbe

정상적으로 구동되고 있는 파드가 있다고 하자. 만약 중간에 파드 내에 존재하는 컨테이너(App)에 오류가 발생하면 어떻게 될까? 파드는 분명 정상이라는 상태를 보여주지만, 파드 내에서 실제 동작을 수행하는 컨테이너에 문제가 있기 때문에 장애가 발생할 것이다.  
LivenessProbe는 파드 내에서 구동되는 컨테이너(App)에 장애가 발생하는지를 확인하고, 이를 조치한다. <u>구동중인 파드 내의 앱 상태를 확인하기 때문에, 발생할 수 있는 장애를 원천적으로 막을 수는 없지만</u>, 지속적인 트래픽 장애를 막을 수 있다는 장점이 있다.

<br>

## 사용 방법

기본적으로 ReadinessProbe와 LivenessProbe는 사용 목적만 다를뿐, 구성하는 방식에 대해서는 동일하다.

아래의 3가지 값 중 <u>1개는 꼭 존재</u>해야 한다.
- httpGet : Port, Host, Path, Httpeader, Scheme를 체크  
- exec : 특정 명령어를 통해 결과를 확인  
- tcpSocket : 포트 번호와 호스트명을 통해 실행 결과를 체크  

추가로 아래의 값들을 통해 세부적인 설정이 가능하다.
- initialDelaySeconds : 최초 probe 전 대기 시간 (default = 0s)
- periodSeconds : probe 체크 간격 (default = 10s)
- timeoutSeconds : probe 결과를 받아야 하는 시간 (default = 1s)
- successThreshold : 몇번 성공값을 받아야 최종적인 성공이 되는지 (default = 1회)
- failureThreshold : 몇번 실패값을 받아야 최종적인 실패가 되는지 (default = 3회)

<br>

## Sample yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-probe
  labels:
    app: probe
spec:
  containers:
  - name: probe
    image: kubetm/app
    ports:
    - containerPort: 8080	
    readinessProbe:
      exec:                     # command 내용으로 점검
        command: ["cat", "/readiness/ready.txt"]   
      initialDelaySeconds: 10
      periodSeconds: 5
      successThreshold: 3       # 3번 성공시 Service와 연결됨
    livenessProbe:
      httpGet:                  # HttpGet 메소드로 점검
        path: /health           # 체크할 경로
        port: 8080              # 체크할 Port
      initialDelaySeconds: 5    # 최초 5초 후에 LivenessProbe 체크를 시작함
      periodSeconds: 10         # 10초마다 LivenessProbe 체크
      failureThreshold: 3       # 3번 실패시 Pod Restart
```

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)