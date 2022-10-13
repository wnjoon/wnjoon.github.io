---
layout: post
title:  "웹브라우저 형식의 VScode, code-server 구성하기" 
excerpt: "VScode에서 제공하는 웹브라우저 기반의 IDE인 code-server를 활용하자. 더 나아가 이녀석은 아이패드에서도 사용이 가능하다."
date:   2021-07-15 15:00:00 +0900
categories: tool
tags: [vscode, ide, iPad]
---

<br>

## code-server

개발자들에게 가장 사랑받는 IDE가 무엇일까? 재미있는건 개발자들이 사랑한다고 해서 점유율이 높은건 아닌데, 기존에 많이 사용되었던 IDE일수록 기존에 있던 기능들을 deprecated 하기가 쉽지 않고 이를 통해 시스템이 점점 더 무거워지기 때문은 아닐까 생각된다.  
개발자 입장에서는 가볍고, 확장성이 좋고, 단순한 IDE를 사랑할 수 밖에 없다. 내가 원하는 코드를 가벼운 환경에서 작성할 수 있는게 가장 중요하기 때문이다. 그런 점에서 Microsoft의 vscode는 '굉장히 잘 만들어 놓은' IDE이다. 필자와 같이 나름 오래된 컴공 학부생에게는 Microsoft사의 IDE라 하면 무겁고 느린 Visual Studio로 열심히 C언어를 작성했던 경험이 떠오를텐데, vscode는 이 점에서 엄청난 발전과 신선한 느낌을 준다.  
더 놀라운 것은 '이미 빠르고 가벼운' vscode를 code-server라는 웹브라우저 기반의 IDE로 제공한다는 것이다. 이미 예전부터 제공되어왔고, 많은 개발자분들이 설치하고 구성하는 방법을 포스팅해놓았다. 조금 더 자세한 내용을 확인하기 위해서는 조금만 더 구글링해보면 찾을 수 있다.

<br>

## 설치 환경

필자는 우분투 16.04 환경에서 설치해보았고, 상위 버전에서도 설치와 동작이 가능하다.  
code-server는 이미 오픈소스로 제공되어있고, https://github.com/cdr/code-server 에서 설치하는 방식을 모두 확인할 수 있다.  
최소한의 요구사항은 https://github.com/cdr/code-server/blob/main/docs/requirements.md 에서 확인할 수 있는데, 최소한으로 1 GB of RAM, 2 CPU cores는 만족해야 한다. 물론 외부에서 접속 가능한 소켓(포트)이 열려있어야 한다.  
설치 방법은 docker를 활용한 컨테이너 방식과 바이너리 설치 방식이 있는데, 필자는 바이너리 방식으로 설치하였다.

## 설치 및 구성

**1) 설치 단계 확인(1번째 줄) 및 code-server 설치(2번째 줄)**

```bash
$ curl -fsSL https://code-server.dev/install.sh | sh -s -- --dry-run
$ curl -fsSL https://code-server.dev/install.sh | sh
```

이러면 설치가 끝난다(너무 간단하다).

**2) code-server 실행**

```bash
$ sudo systemctl start code-server@{CURRENT_USER}
$ sudo systemctl enable code-server@{CURRENT_USER}
```
여기서 CURRENT_USER는 현재 code-server를 설치한 사용자를 넣어주면 된다. 두번째 줄을 넣어주면 서버가 기동될때마다 자동으로 code-server를 실행해준다.

**3) 외부에서 접근 가능하도록 포트 설정**

```bash
$ vi /home/{CURRENT_USER}/.config/code-server/config.yaml
```

위의 파일로 들어가면 code-server의 접근 권한을 설정할 수 있다.

```bash
bind-addr: 0.0.0.0:4000
auth: password
password: $myNewPassword
cert: false
```

- bind-addr: 0.0.0.0:포트로 설정한다. 여기서 설정한 포트를 기준으로 외부에서 접속이 가능하다.
- auth: password로 하면 외부에서 code-server를 들어갔을 때 비밀번호를 요구한다. none으로 하면 비밀번호 없이 접속한다.
- password: 위의 auth를 password로 할 경우, 입력해야 하는 비밀번호를 작성한다.
- cert: TLS, 인증서 사용 여부를 작성하는 곳이다.

중요한 것은 bind-addr 부분을 0.0.0.0으로 해야 외부에서 접근이 가능하다.  
일반적으로 code-server를 외부에서 사용하기 위해 클라우드 환경을 이용할텐데, 꼭 해당 서버의 외부 포트를 열어주어야 한다.

**4) code-server 재시작**

```bash
$ sudo systemctl restart code-server@{CURRENT_USER}
```

config.yaml 파일을 변경했기 때문에 code-server를 재시작해준다.

**5) External IP 확인**

가장 중요한 부분인데, 대부분 클라우드 환경에서 code-server를 구성하는 가장 큰 이유는 '외부에서도 편리하게 vscode를 사용하기 위해서' 일 것이다. 서버를 재시작할일이 없으면 상관없지만, 사용할 때마다 서버를 구동시키는 경우라면(혹은 그 외의 다양한 이유에도) External(외부, 공용) IP 설정은 필수다.  
클라우드 서비스마다 해당 방식은 다르니, 여기서는 생략한다.

<br>

## 실행 결과

위의 순서대로 진행했다면, http://{External IP}:4000에 접속하면 code-server가 구동되는 것을 볼 수 있다.  
위에서 설정한 password를 입력하면 PC에서 보던 vscode가 동일하게 웹에서 동작하는 것을 확인하게 된다.

<br>

## 누구에게 가장 필요할까?

필자를 포함한 많은 개발자들이 '가장 살까 말까 고민하는 제품' 중 하나가 아이패드와 같은 태블릿일 것이다. <u>태블릿을 들고 다니면서 편하게 개발하는 개발자</u>의 모습을 상상하지만, 이를 가능하게 할 IDE가 거의 없고 대부분 서버에서 직접 Vim을 쓰는 경우가 많다. 파이썬의 경우에는 약간의 IDE가 있기는 하지만, 그 외에는 Vim 외에는 방법이 '전혀' 없는 것이 문제다.  
이러한 상황에 웹브라우저 형식의 code-server는 매우 좋은 해결책이 될 것으로 보인다. 작성한 코드는 git으로 관리하고, 어디서나 언제든지 쉽고 편하게 코드를 작성해보자!