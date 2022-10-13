---
layout: post
title:  "Jenkins에 대해 알아보기" 
excerpt: "CI/CD(소스 형상관리)의 대명사 도구인 젠킨스(Jenkins, 이하 인상좋은 아저씨)를 설치해본다."
date:   2021-03-04 15:00:00 +0900
categories: tool
tags: [ci/cd, jenkins]
---

<br>

## TDD(Test Driven Development)가 좋기는하다. 하지만..

사실 형상관리는 이미 개발과정에서는 필수요소가 된지 오래다. CI를 단순히 '손쉬운 형상관리 + 자동 배포'로만 인식하면 이전과 크게 다를바 없어 보이지만, 테스트 자동화의 관점에서 보면 TDD가 가지고 있던 단점들을 어느정도 해결해준다.

일반적으로 TDD는 유닛테스트 기반으로, 우리가 학부시절에 코딩하던 수준이 아닌 production level에서 볼 수 있는 엄청난 양의 유닛을 하나씩 테스트 한다는 것은 꽤 버거운 일이다. 게다가 수많은 라이브러리와 기능들이 서로 연관되어 있는 경우에는 테스트 프로그램을 작성하는 것이 실제 운영 프로그램을 작성하는 것보다 더 큰 공수를 가져오기도 한다.

물론 최근에는 MSA 방식이 주로 사용되면서, 하나의 프로그램이 하나의 유닛으로 이루어져 있는 경우가 많다. 이러한 경우 각 유닛을 테스트 하는 것이 이전보다 수월할 수 있지만, 결국 MSA의 특성 상 유닛의 개수가 증가하게 되므로 복잡성은 비슷하다는 것이 다수의 의견이다.

이런 상황에서 CI는 개발자들에게 꽤나 큰 도움이 된다. 파이프라인 형식으로 잘 구성해 놓은 CI 위에서 개발자는 개발 -> 테스트 -> 배포의 단계를 고민할 필요 없이 맨 앞의 '개발'만 신경쓰면 되기 때문이다.

<br>

## Jenkins?

![image](https://user-images.githubusercontent.com/39115630/144053641-7eb9a9e4-ebba-4ff5-afe5-0a1c796d93c6.png)

> 젠킨스(Jenkins)는 거의 모든 언어의 조합과 소스코드 리포지토리(Repository)에 대한 지속적인 통합과 지속적인 전달 환경을 구축하기 위한 간단한 방법을 제공한다.
> 젠킨스는 다른 일상적인 개발 작업을 자동화할 뿐 아니라 파이프라인(Pipeline)을 사용해 거의 모든 언어의 조합과 소스코드 리포지토리에 대한 지속적인 통합과 지속적인 전달 환경을 구축하기 위한 간단한 방법을 제공한다.
> 
> "젠킨스란 무엇인가, CI(Continuous Integration) 서버의 이해, itworld"

젠킨스는 CI(Continuous Integration) 도구인데, CI를 단계별로 보면 다음과 같다.

1. 다양한 형상관리 도구(git, svn 등)로부터 최근에 push된 소스 코드를 가져온다.
2. 소스 코드를 빌드(build)한다.
3. 빌드한 프로그램을 테스트 한다.
4. 테스트가 정상적으로 될 경우, 프로그램을 배포가 가능한 형태로 패키징한다.

최근 애자일, 그리고 데브옵스와 같은 개발 방법론이 주목받으면서, 개발과 배포 사이의 업무를 줄이고 단계를 최소화할 수 있는 방법이 계속 고민되어져 왔다. 개발한 소스를 어딘가에 관리하고, 이 관리한 소스를 다시 가져와서 테스트해보고, 또 수작업으로 배포하는 모든 과정을 단순화 + 자동화 함으로써 각 단계에서 발생할 수 있는 문제를 최소화하고 또 테스트 과정에서 발생할 수 있는 문제를 미리 확인함으로써 고객과의 피드백을 용이하게 할 수 있게 되었다.

<br>

## Jenkins 설치하기

나는 CentOS 7에서 설치를 진행하였다. (참고 사이트: [Installing Jenkins](https://www.jenkins.io/doc/book/installing/linux/))

### 1. Requirement

**Minimum hardware requirements:**
- 256 MB of RAM
- 1 GB of drive space (although 10 GB is a recommended minimum if running Jenkins as a Docker container)
- Recommended hardware configuration for a small team:
- 1 GB+ of RAM
- 50 GB+ of drive space
- Comprehensive hardware recommendations:

**Software requirements:**
- Java: see the Java Requirements page
- Web browser: see the Web Browser Compatibility page
- For Windows operating system: Windows Support Policy
- <u>설치 과정에 Software requirements가 함께 설치된다.</u>

### 2. 설치

LTS 버전으로 설치하였다.

```bash
$ sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo 
$ sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key 
$ sudo yum upgrade 
$ sudo yum install jenkins java-1.8.0-openjdk-devel 
$ sudo systemctl daemon-reload
```

<br>

## Jenkins 구동하기

```bash
$ sudo systemctl start jenkins 
$ sudo systemctl status jenkins
```

상태가 active로 나오면 정상적으로 설치된 것이다.

```bash
Loaded: loaded (/etc/rc.d/init.d/jenkins; generated) 
Active: active (running) since ...
```

<br>

## Jenkins 열기

젠킨스는 기본적으로 8080포트를 활용해서 웹 어플리케이션을 제공한다. 그러므로 해당 포트의 inbound가 가능해야 한다.

![image](https://user-images.githubusercontent.com/39115630/144054822-351859f2-2368-428f-a25b-79e6ab7f75da.png)  
*@그림 1: Jenkins를 처음 열었을 때의 화면*

비밀번호를 입력해야 하는데, /var/lib/jenkins/secrets/initialAdminPassword 경로를 확인하면 비밀번호 확인이 가능하다.

```bash
$ cat /var/lib/jenkins/secrets/initialAdminPassword
```

![image](https://user-images.githubusercontent.com/39115630/144054980-7267fda5-0462-4a7d-93c1-104a0c58610a.png)  
*@그림 2: Jenkins 확장 프로그램 설치 유무 선택 화면*

해당 비밀번호를 입력하면 Customize Jenkins라고 해서 확장 프로그램 설치하는 페이지가 나온다. 나는 잘 모르기도 하고, 설명에 젠킨스 커뮤니티에서 가장 많이 사용하는 플러그인이라고 하여 Install suggested plugins를 설치했다.

![image](https://user-images.githubusercontent.com/39115630/144055136-3492f786-a2ce-4cb8-99ca-5ed84ad1e9f6.png)  
*@그림 3: 사용자 아이디 및 비밀번호 생성*

설치가 완료되면 First Admin User를 생성하라는 페이지가 뜬다. 어차피 테스트 용도이기 때문에, 본인이 기억하기 쉬운 내용을 작성한다. 굳이 작성하지 않고 싶다면, 아래에 skip and continue as admin이 있다. 그러면 admin 계정으로 진행할 수 있게 된다. 이후에 젠킨스의 접속 주소를 다시한번 확인한 후, 시작을 하게 된다.

<br>

## Jenkins 살펴보기

![image](https://user-images.githubusercontent.com/39115630/144055293-83cd33ef-5260-43e5-98c3-4570201dcbb5.png)  
*@그림 4: Jenkins 메인 화면*

- New Item : 새로운 작업(new job)을 만든다. 젠킨스는 작업 단위로 빌드를 관리하며, 일반적으로 git 혹은 svn 프로젝트가 작업이 된다.
- People : 유저의 정보들을 확인할 수 있다.
- Build History: 빌드의 성공 혹은 실패에 대한 정보들을 확인할 수 있다.
- Manage Jenkins: 젠킨스에 대한 환경설정을 할 수 있다.

젠킨스는 내부적으로 빌드 큐(queue)를 관리하며, 다음과 같은 단계로 진행된다.

- 빌드를 요청한다.
- 요청된 내용이 큐에 들어간다.
- 젠킨스의 빌드 엔진이 큐의 내용을 하나씩 꺼내서 빌드를 실행한다.

빌드 큐를 이용함으로써 여러 개의 프로젝트가 동시에 관리되는 장점을 얻을 수 있다. 또한 빌드가 진행되는 과정에도 다른 프로그램의 빌드 상태가 어떤지 동시에 확인도 가능하다.
