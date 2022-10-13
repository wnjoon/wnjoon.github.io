---
layout: post
title:  "Colima를 활용한 M1에서 x86/64 기반의 컨테이너 구동하기" 
excerpt: "M1 맥북에서 동작하지 않던 x86/64 기반의 컨테이너를 Colima라는 툴을 이용하여 가상환경 처럼 구동해본다. Colima는 Docker desktop 어플리케이션을 사용하지 않고 간단하게 런타임 환경에서 CLI를 이용하여 컨테이너를 구동할 수 있도록 하는 오픈소스 프로그램이다."
date:   2022-09-04 15:00:00 +0900
categories: tool
tags: [docker, colima]
---

<br>

## Oracle을 M1에서 테스트 할 수 없다?

회사에서 사용하는 맥북은 M1 기반인데, Oracle 컨테이너를 도커로 구동할 수 없었다. 컨테이너 자체가 x86/64 기반이라 그랬는데, 어쩔 수 없이(필자를 포함해서 대부분의 사람들이) Oracle Cloud Database 또는 AWS에 x86/64 기반의 인스턴스를 구성하고 거기에 Oracle을 구동하는 방식으로 테스트했다. 

그러던 중 한 [블로그(Shane's Planet 👍)](https://shanepark.tistory.com/400)에서 Colima를 이용해 x86/64 기반의 컨테이너를 M1에서 실행할 수 있는 방법을 보게되었고, 이를 잊어버리지 않게 공유해놓고자 한다. 

<br>

## Colima

[Colima](https://github.com/abiosoft/colima)는 Docker desktop 어플리케이션을 사용하지 않고 간단하게 런타임 환경에서 CLI를 이용하여 컨테이너를 구동할 수 있도록 하는 오픈소스 프로그램이다. 즉 Colima를 실핼할 때 아키텍처를 M1이 아닌 x86/64 환경으로 설정하면, M1이 도커를 x86/64 환경으로 구동하여 M1에서 구동되지 않았던 x86/64 환경의 컨테이너를 구동할 수 있게 된다. 

### 1. 설치

brew를 이용하면 간단하게 설치가 가능하다.

```sh
$ brew install colima
```

### 2. 실행

```sh
$ colima start --memory 4 --arch x86_64
```

기존에 M1 Docker desktop이 설치되어 있더라도, Colima가 같이 설치도 되며 동시에 실행도 가능하다. 단 Shane's Planet 블로그에 의하면 동시에 실행하는 경우, Docker 명령어는 Colima에서 처리하는 것으로 확인된다고 한다.

### 3. 컨테이너 실행

```sh
$ docker run -e ORACLE_PASSWORD=pass -p 1521:1521 -d gvenzl/oracle-xe
```

이후 DBeaver를 이용하여 로컬호스트에 접근하였을 때, 정상적으로 동작하는 것을 확인할 수 있었다.


## 참고자료
- [[MacOS] M1 맥북 도커로 ORACLE DB 실행하기 - Shane's Planet](https://shanepark.tistory.com/400)
- [Colima - Official github](https://github.com/abiosoft/colima)
