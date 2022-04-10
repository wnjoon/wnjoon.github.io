---
title:  "[🧑‍🏫 시험 준비] CKA - Exam Simulator 1" 
excerpt: "쿠버네티스 시험(CKA) 준비용 테스트 시험 첫번째를 치뤄본다."

categories:
  -  Kubernetes
tags:
  - [Kubernetes, Network, InfraStructure, 시험]


toc: true
toc_sticky: true

date: 2021-09-01
last_modified_at: 2021-10-21
---

<br> 

## Pre setup

미리 설정해두면 시험보는동안 매우 유용하게 사용할 수 있음

```
alias k=kubectl                         # will already be pre-configured
export do="--dry-run=client -o yaml"    # k get pod x $do
export now="--force --grace-period 0"   # k delete pod x $now
```

vim 또한 아래와 같이 해놓으면 좋지만, 사실 꼭 해야하는 것은 아님

```
# vi ~/.vimrc
set tabstop=2
set expandtab
set shiftwidth=2
```

<br>

## Question 1 | Context

- You have access to multiple clusters from your main terminal through kubectl contexts. Write all those context names into /opt/course/1/contexts.
- Next write a command to display the current context into /opt/course/1/context_default_kubectl.sh, the command should use kubectl.
- Finally write a second command doing the same thing into /opt/course/1/context_default_no_kubectl.sh, but without the use of kubectl.

```sh
$ kubectl config get-contexts -o name > /opt/course/1/contexts
# display the current context using kubectl
$ kubectl config current-context
# display the current context without using kubectl
# JSON 사용 방법에 대해 알아야 할 듯(이해 안감)
$ cat ~/.kube/config | grep current | sed -e "s/current-context: //"
```

## Question 2 | Schedule Pod on Master Node

- Use context: kubectl config use-context k8s-c1-H
- Create a single Pod of image httpd:2.4.41-alpine in Namespace default. The Pod should be named pod1 and the container should be named pod1-container. This Pod should only be scheduled on a master node, do not add new labels any nodes.
- Shortly write the reason on why Pods are by default not scheduled on master nodes into /opt/course/2/master_schedule_reason .

```sh
$ kubectl get node # find master node
$ kubectl describe node cluster1-master1 | grep Taint # get master node taints

Taints:             node-role.kubernetes.io/master:NoSchedule

$ kubectl describe node cluster1-master1 | grep Labels -A 10 # get master node labels

Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=cluster1-master1
                    kubernetes.io/os=linux
                    node-role.kubernetes.io/control-plane=
                    node-role.kubernetes.io/master= # master node에 해당하는 라벨
                    node.kubernetes.io/exclude-from-external-load-balancers=

$ kubectl get node cluster1-master1 --show-labels # OR: get master node labels (개인적으로 이게 더 보기 어려움)
```

```yaml
# kubectl run pod1 --image=httpd:2.4.41-alpine --dry-run=client -o yaml > 2.yaml
# vi 2.yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: pod1
  name: pod1
spec:
  containers:
  - image: httpd:2.4.41-alpine
    name: pod1-container                  # modify
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
  tolerations:                            # add
  - effect: NoSchedule                    # add
    key: node-role.kubernetes.io/master   # add
  nodeSelector:                           # add
    node-role.kubernetes.io/master: ""    # add
status: {}
```

```sh
$ kubectl apply -f 2.yaml

# short reason why Pods are not scheduled on master nodes by default
$ /opt/course/2/master_schedule_reason -> master nodes usually have a taint defined
```

## Question 3 | Scale down StatefulSet

- Use context: kubectl config use-context k8s-c1-H
- There are two Pods named o3db-* in Namespace project-c13. C13 management asked you to scale the Pods down to one replica to save resources. Record the action.

```sh
# check the Pods we see two replicas (From their name it looks like these are managed by a StatefulSet)
$ kubectl get pods --namespace=project-c13 | grep o3db
# check which resources manage Pods
$ kubectl get deployment,replicaset,statefulset  --namespace=project-c13 | grep o3db

statefulset.apps/o3db   2/2     92d

# check labels
$ kubectl get pods --show-labels | grep o3db

o3db-0                                  1/1     Running   0          92d   app=nginx,controller-revision-hash=o3db-5fbd4bb9cc,statefulset.kubernetes.io/pod-name=o3db-0
o3db-1                                  1/1     Running   0          92d   app=nginx,controller-revision-hash=o3db-5fbd4bb9cc,statefulset.kubernetes.io/pod-name=o3db-1

# scale the Pods down to one replica with record
$ kubectl --namespace=project-c13 scale statefulset o3db --replicas=1 --record

Flag --record has been deprecated, --record will be removed in the future
statefulset.apps/o3db scaled
```

## Question 4 | Pod Ready if Service is reachable

- Use context: kubectl config use-context k8s-c1-H
- Do the following in Namespace default. Create a single Pod named ready-if-service-ready of image nginx:1.16.1-alpine. Configure a LivenessProbe which simply runs true. Also configure a ReadinessProbe which does check if the url http://service-am-i-ready:80 is reachable, you can use wget -T2 -O- http://service-am-i-ready:80 for this. Start the Pod and confirm it isn't ready because of the ReadinessProbe.
- Create a second Pod named am-i-ready of image nginx:1.16.1-alpine with label id: cross-server-ready. The already existing Service service-am-i-ready should now have that second Pod as endpoint.
- Now the first Pod should be in ready state, confirm that.

```sh
# Create a single Pod named ready-if-service-ready of image nginx:1.16.1-alpine.
$ kubectl run ready-if-service-ready --namespace=default --image=nginx:1.16.1-alpine --dry-run=client -o yaml > 4.yaml
```

```yaml
# modify 4.yaml with livenessprobe and readinessprobe
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: ready-if-service-ready
  name: ready-if-service-ready
  namespace: default
spec:
  containers:
  - image: nginx:1.16.1-alpine
    name: ready-if-service-ready
    resources: {}
    livenessProbe:                               # add from here
      exec:
        command:
        - 'true'
    readinessProbe:
      exec:
        command:
        - sh
        - -c
        - 'wget -T2 -O- http://service-am-i-ready:80'   # to here
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

```sh
# check pod 
$ kubectl describe --namespace=default pod ready-if-service-ready

Events:
  Type     Reason     Age                  From               Message
  ----     ------     ----                 ----               -------
  ...
  Warning  Unhealthy  18s (x22 over 3m6s)  kubelet            Readiness probe failed: command "sh -c wget -T2 -O- http://service-am-i-ready:80" timed out
```

```sh
# Create a second Pod named am-i-ready of image nginx:1.16.1-alpine with label id: cross-server-ready.
$ kubectl run am-i-ready --image=nginx:1.16.1-alpine --labels="id=cross-server-ready"

# find existing service 'service-am-i-ready'
$ kubectl describe --namespace=default service service-am-i-ready

# check pod 'ready-if-service-ready' is working
$ kubectl get pods --namespace=default

NAME                        READY   STATUS    RESTARTS   AGE
...
ready-if-service-ready      0/1     Running   0          8m4s
...
```

## Question 5 | Kubectl sorting

- Use context: kubectl config use-context k8s-c1-H
- There are various Pods in all namespaces. Write a command into /opt/course/5/find_pods.sh which lists all Pods sorted by their AGE (metadata.creationTimestamp).
- Write a second command into /opt/course/5/find_pods_uid.sh which lists all Pods sorted by field metadata.uid. Use kubectl sorting for both commands.

```sh
# lists all Pods sorted by their AGE (metadata.creationTimestamp).
$ kubectl get pods -A --sort-by=.metadata.creationTimestamp

# lists all Pods sorted by field metadata.uid.
$ kubectl get pods -A --sort-by=.metadata.uid
```

## Question 6 | Storage, PV, PVC, Pod volume

- Use context: kubectl config use-context k8s-c1-H
- Create a new PersistentVolume named safari-pv. It should have a capacity of 2Gi, accessMode ReadWriteOnce, hostPath /Volumes/Data and no storageClassName defined.
- Next create a new PersistentVolumeClaim in Namespace project-tiger named safari-pvc. It should request 2Gi storage, accessMode ReadWriteOnce and should not define a storageClassName. The PVC should bound to the PV correctly.
- Finally create a new Deployment safari in Namespace project-tiger which mounts that volume at /tmp/safari-data. The Pods of that Deployment should be of image httpd:2.4.41-alpine. 

```yaml
# Create a new PersistentVolume named safari-pv.
kind: PersistentVolume
apiVersion: v1
metadata:
 name: safari-pv
spec:
 capacity:
  storage: 2Gi
 accessModes:
  - ReadWriteOnce
 hostPath:
  path: "/Volumes/Data"
```

```yaml
# create a new PersistentVolumeClaim in Namespace project-tiger named safari-pvc.
# capacity와 accessModes를 충족하는 PV하고만 연결
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: safari-pvc
  namespace: project-tiger
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
     storage: 2Gi
```

```sh
# check pv, pvc
$ kubectl --namespace=project-tiger get pv,pvc

NAME                         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                      STORAGECLASS   REASON   AGE
persistentvolume/safari-pv   2Gi        RWO            Retain           Bound    project-tiger/safari-pvc                           51s

NAME                               STATUS   VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/safari-pvc   Bound    safari-pv   2Gi        RWO                           20s
```

```sh
# create a new Deployment safari in Namespace project-tiger which mounts that volume at /tmp/safari-data.
$ kubectl --namespace=project-tiger create deployment safari --image=httpd:2.4.41-alpine --dry-run=client -o yaml > 6_deployment.yaml
```

```yaml
# modify 6_deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: safari
  name: safari
  namespace: project-tiger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: safari
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: safari
    spec:
      volumes:                                      # add
      - name: data                                  # add
        persistentVolumeClaim:                      # add
          claimName: safari-pvc                     # add
      containers:
      - image: httpd:2.4.41-alpine
        name: httpdi
        volumeMounts:                               # add
        - name: data                                # add
          mountPath: /tmp/safari-data               # add
        resources: {}
status: {}
```

## Question 7 | Node and Pod Resource Usage

- Use context: kubectl config use-context k8s-c1-H
- The metrics-server hasn't been installed yet in the cluster, but it's something that should be done soon. Your college would already like to know the kubectl commands to:
  - show node resource usage
  - show Pod and their containers resource usage
- Please write the commands into /opt/course/7/node.sh and /opt/course/7/pod.sh.

```sh
# show node resource usage
$ kubectl top node

# show Pod and their containers resource usage
$ kubectl get pod --containers=true
```

## Question 8 | Get Master Information

- Use context: kubectl config use-context k8s-c1-H
- Ssh into the master node with ssh cluster1-master1. Check how the master components kubelet, kube-apiserver, kube-scheduler, kube-controller-manager and etcd are started/installed on the master node. Also find out the name of the DNS application and how it's started/installed on the master node.
- Write your findings into file /opt/course/8/master-components.txt. The file should be structured like:
  > /opt/course/8/master-components.txt  
  > kubelet: [TYPE]  
  > kube-apiserver: [TYPE]  
  > kube-scheduler: [TYPE]  
  > kube-controller-manager: [TYPE]  
  > etcd: [TYPE]  
  > dns: [TYPE] [NAME]  
- Choices of [TYPE] are: not-installed, process, static-pod, pod

```sh
# Ssh into the master node with ssh cluster1-master1
$ ssh cluster1-master1

# which components are controlled via systemd
$ find /etc/systemd/system/ | grep kube

/etc/systemd/system/kubelet.service.d
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf
/etc/systemd/system/multi-user.target.wants/kubelet.service

# no other service named kube nor etcd -> check kubeadm
# main 4 master services are setup as static Pods
$ find /etc/kubernetes/manifests/

/etc/kubernetes/manifests/
/etc/kubernetes/manifests/kube-apiserver.yaml
/etc/kubernetes/manifests/kube-controller-manager.yaml
/etc/kubernetes/manifests/etcd.yaml
/etc/kubernetes/manifests/kube-scheduler.yaml
/etc/kubernetes/manifests/kube-scheduler-special.yaml

# check all Pods running on in the kube-system Namespace on the master node
$ kubectl get pods -o wide --namespace=kube-system | grep cluster1-master1

coredns-5644d7b6d9-c4f68                   1/1     Running            ...   cluster1-master1
coredns-5644d7b6d9-t84sc                   1/1     Running            ...   cluster1-master1
etcd-cluster1-master1                      1/1     Running            ...   cluster1-master1
kube-apiserver-cluster1-master1            1/1     Running            ...   cluster1-master1
kube-controller-manager-cluster1-master1   1/1     Running            ...   cluster1-master1
kube-proxy-q955p                           1/1     Running            ...   cluster1-master1
kube-scheduler-cluster1-master1            1/1     Running            ...   cluster1-master1
kube-scheduler-special-cluster1-master1    0/1     CrashLoopBackOff   ...   cluster1-master1
weave-net-mwj47        

# 5 static-pods : with -cluster1-master1 as suffix.
# - etcd-cluster1-master1
# - kube-apiserver-cluster1-master1
# - kube-controller-manager-cluster1-master1
# - kube-scheduler-cluster1-master1
# - kube-scheduler-special-cluster1-master1

# find coredns
# DaemonSet
$ kubectl -n kube-system get ds

NAME         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
kube-proxy   3         3         3       3            3           kubernetes.io/os=linux   92d
weave-net    3         3         3       3            3           <none>                   92d

# Deployment
$ kubectl -n kube-system get deployments

NAME      READY   UP-TO-DATE   AVAILABLE   AGE
coredns   2/2     2            2           92d
```

Result file(/opt/course/8/master-components.txt)
- kubelet: process
- kube-apiserver: static-pod
- kube-scheduler: static-pod
- kube-scheduler-special: static-pod (status CrashLoopBackOff)
- kube-controller-manager: static-pod
- etcd: static-pod
- dns: pod coredns

## Question 9 | Kill Scheduler, Manual Scheduling

- Use context: kubectl config use-context k8s-c2-AC
- Ssh into the master node with ssh cluster2-master1. Temporarily stop the kube-scheduler, this means in a way that you can start it again afterwards.
- Create a single Pod named manual-schedule of image httpd:2.4-alpine, confirm its created but not scheduled on any node.
- Now you're the scheduler and have all its power, manually schedule that Pod on node cluster2-master1. Make sure it's running.
- Start the kube-scheduler again and confirm its running correctly by creating a second Pod named manual-schedule2 of image httpd:2.4-alpine and check if it's running on cluster2-worker1.

```sh
# Find pod for schedule
$ kubectl get pods --namespace=kube-system | grep schedule

kube-scheduler-cluster2-master1            1/1     Running   1             92d

# Temporarily stop the kube-scheduler
$ cd /etc/kubernetes/manifests

etcd.yaml  kube-apiserver.yaml  kube-controller-manager.yaml  kube-scheduler.yaml

# /etc/kubernetes/manifests 안에 파일을 넣어놓으면 스케쥴러에 포함 -> 해당 파일을 다른곳으로 이동하면 일시적으로 정지시킬 수 있다.
$ mv kube-scheduler.yaml ..
$ kubectl -n kube-system get pod | grep schedule -> 이번에는 아무것도 뜨지 않음
```

```sh
# Create a single Pod, not scheduled on any node.
$ kubectl get pod manual-schedule -o yaml > 9_pod.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
spec:
  nodeName: cluster2-master1 # Add this
  containers:
  - image: httpd:2.4-alpine
    ...
```

```sh
# Replace pod
$ kubectl -f 9_pod.yaml replace --force
```

## Question 10 | RBAC ServiceAccount Role RoleBinding

- Create a new ServiceAccount processor in Namespace project-hamster. 
- Create a Role and RoleBinding, both named processor as well. These should allow the new SA to only create Secrets and ConfigMaps in that Namespace.



<br>

## 참고자료

<br>

[맨 위로 이동하기](#){: .btn .btn--primary }{: .align-right}

<br> 