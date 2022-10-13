---
layout: post
title:  "Kubernetes: Controller - DaemonSet, Job, CronJob" 
excerpt: "쿠버네티스에서 제공하는 컨트롤러의 하나로, 특수한 목적을 갖는 파드를 생성하고 이를 관리하기 위한 방법 3가지에 대해 알아본다. 본 포스팅은 인프런에서 제공하는 강의 '대세는 쿠버네티스 (초급~중급) - 김태민' 내용을 정리한 내용을 포함한다."
date:   2021-08-07 15:00:00 +0900
categories: tool
tags: [k8s, 강의]
---

<br>

## 특수한 목적에 맞게 사용되는 파드

![](https://kubetm.github.io/img/practice/beginner/Controller%20with%20DatemonSet,%20Job,%20CronJob%20for%20Kubernetes.jpg)  
*@그림 1: DaemonSet과 Job, CronJob 예시 - 출처: 강의자료*

파드는 일종의 유목민(?)과 같이 여러 노드에 필요에 따라 생성과 삭제가 빈번히 발생한다고 생각할 수 있지만, 특수한 목적을 가진 파드들은 이러한 성격과 다르게 관리되기도 한다. 예를 들어 로그를 수집하고 모니터링하는 파드들은 각 노드에 필수적으로 하나씩 존재해야 할 수 있다. 또는 DB 백업과 같이 하루 중 일정 시간에만 반짝 사용되는 경우에는 파드가 굳이 계속 노드에 존재할 필요가 없을 수 있다.  
각 노드마다 필수로 올라가는 파드를 관리하는 컨트롤러를 DaemonSet, 특수한 업무에만 사용되는 임시적인 파드를 관리하는 컨트롤러를 Job 또는 CronJob이라고 한다. 이들은 ReplicaSet과 유사하게 보일 수 있지만, 서로 다른 성격들을 갖고 있다.

<br>

## DaemonSet

![](https://kubetm.github.io/img/practice/beginner/HostPort,%20NodeSelector%20with%20DaemonSet%20for%20Kubernetes.jpg)  
*@그림 2: DaemonSet 예시 - 출처: 강의자료*

- DaemonSet은 자원의 상태와 관계 없이 각 노드 별로 무조건 하나의 파드를 생성한다. 
- 쿠버네티스에서는 마스터가 각 노드를 관리하거나 각 노드별로 통신할 수 있도록 네트워크 프록시를 제공하기 위해 DaemonSet을 사용한다. 이 외에도 성능측정도구(Prometheus), 로그 수집(fluentd), 스토리지(GlusterFS) 등 다양한 어플리케이션에 활용되기도 한다.
- <u>DaemonSet은 특정 노드에 대해서만 파드를 만들지 않도록 할 수 있다.</u> 하지만 특정 노드에서만 파드를 만들도록 할 수는 없다. 결국 기본적으로 모든 파드에 생성되나, 특정 파드에 대해서만 이를 예외처리하는 방식이다.

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: daemonset-1
spec:
  selector:
    matchLabels:
      type: app
  template:
    metadata:
      labels:
        type: app
    spec:
      nodeSelector: # 노드 필터링(생략하면 모든 노드에 파드를 하나씩 생성)
        os: centos
      containers:
      - name: container
        image: nginx
        ports:
        - containerPort: 8080
          hostPort: 18080
```

hostPort는 Service의 externalTrafficPolicy와 같은 역할을 수행한다. 위의 예시는 노드의 18080 포트를 통해 파드의 8080 포트가 자동으로 연결되도록 설정한다. 그러면 외부에서 18080포트로 접속하여 파드의 컨테이너(8080포트)를 사용할 수 있다.  
nodeSelector를 사용하려면 노드마다 label을 붙여야 하는데, 아래의 명령어를 통해 적용할 수 있다.  

```bash
# 라벨 적용
kubectl label nodes {노드명} {key=value}
kubectl label nodes node1 os=ubuntu

# 라벨 삭제
kubectl label nodes node1 os-
```

<br>

## Job

![](https://kubetm.github.io/img/practice/beginner/Parrallelism,%20Completions%20with%20Job%20for%20Kubernetes.jpg)  
*@그림 3: Job 예시 - 출처: 강의자료*

- Job은 특정 상황에 따라 파드를 scale-out(증가)하고, 상황이 종료되면 scale-in(감소)한다.
- Job은 역할이 끝난 파드를 삭제하지 않고, 종료 상태로 둔다. 이는 실행이 완료된 파드의 로그를 확인해야 하는 경우가 발생할 수 있기 때문이다. 그렇기 때문에 그림 1과 같이 Job은 ReplicaSet과 다르게 파드의 최종상태를 Restart(계속 개수를 유지)하지 않고 Finish로 종료한다.
- Job을 삭제하면 Job이 관리하고 있는 모든 파드들이 삭제된다. 관리 대상에는 역할이 끝난 후 종료상태로 남아있는 파드도 포함이다.
- 데이터 백업, 주기적인 업데이트 관리, 특정 시간 대량 메시지 발송 등에서 사용된다.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-1
spec:
  completions: 6 # optional : Job을 통해 생성해야 하는 총 파드 개수
  parallelism: 2 # optional : 실행 단위의 파드 개수(한번에 실행되는 파드 개수)
  activeDeadlineSeconds: 30 # optional : Job의 전체 진행 시간
  template:
    spec:
      restartPolicy: Never # Job이 끝났을 때의 정책
      containers:
      - name: container
        image: nginx
        command: ["sh", "-c", "echo 'job start';sleep 20; echo 'job end'"]
      terminationGracePeriodSeconds: 0
```

위의 예시에 의하면, 총 6개의 파드가 생성되어야 하는데 한번에 2개씩 생성된다. activeDeadlineSeconds 시간이 지나면 completions에 맞는 개수의 파드가 생성되지 않았더라도 Job은 종료되고 존재하던 파드는 모두 삭제된다. 이는 Job 내부에 오류가 발생하였을 경우 무한루프에 빠질 수 있기 때문에 넉넉한 시간을 두고 이보다 더 시간이 오래걸리는 경우 Job을 종료시킬 수 있도록 한다.

<br>

## CronJob

![](https://kubetm.github.io/img/practice/beginner/Allow%20with%20CronJob%20for%20Kubernetes.jpg)  
*@그림 4: CronJob 예시 - 출처: 강의자료*

- CronJob은 Job을 주기에 따라 계속 실행하고자 할 때 사용한다.
- schedule: "*/1 * * * *" : Job을 1분 주기마다 실행하겠다는 의미이다. 
- CronJob이 삭제되면 해당 CronJob을 통해 만들어진 모든 Job은 삭제된다. 이는 메뉴얼로 생성된 Job의 경우도 포함이다.

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cron-job-2
spec:
  schedule: "*/1 * * * *"
  concurrencyPolicy: Replace # optional : 하단에 설명
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
          - name: container
            image: nginx
            command: ["sh", "-c", "echo 'job start';sleep 140; echo 'job end'"]
          terminationGracePeriodSeconds: 0
```

cli를 이용한 CronJob 생성(manual) 방법은 다음과 같다.

```bash
kubectl create job --from=cronjob/cron-job cron-job-manual-001
```

만약 suspend를 true로 해주면, 남아있는 주기와 관련 없이 진행중이던 CronJob에서의 Job 생성이 중단된다.

```bash
kubectl patch cronjobs cron-job -p '{"spec" : {"suspend" : false }}'
```

### ConcurrencyPolicy

![](https://kubetm.github.io/img/practice/beginner/ConcurencyPolicy%201.19%20with%20CronJob%20for%20Kubernetes.jpg)  
*@그림 5: CronJob의 ConcurrencyPolicy 예시 - 출처: 강의자료*

1. Allow : 주기마다 무조건 Job을 생성한다.
2. Forbid : 생성 주기에 실행중인 파드가 아직 있다면, 더이상 생성하지 않는다. 실행중인 파드가 없거나 종료되어 있는 경우에만 생성한다.
3. Replace : 생성 주기에 실행중인 파드가 아직 있다면, 새로운 파드를 생성한 후 기존에 진행중이던 파드를 삭제한다. 

<br>

## 참고자료

- [대세는 쿠버네티스 [초급~중급] - 김태민](https://www.inflearn.com/course/쿠버네티스-기초/dashboard)