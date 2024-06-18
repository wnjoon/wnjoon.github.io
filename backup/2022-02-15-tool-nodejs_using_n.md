---
layout: post
title:  "n을 이용하여 Nodejs 버전 간단하게 변경하기" 
excerpt: "n은 npm에서 제공하는 Nodejs 버전 관리용 패키지로, 이전까지는 nvm이 더욱 많이 사용되었다. n을 이용하면 Nodejs의 버전을 손쉽게 변경 및 관리할 수 있다."
date:   2022-02-15 15:00:00 +0900
categories: tool
tags: [nodejs]
---

<br>

## n

n은 npm에서 제공하는 Nodejs 버전 관리용 패키지로, 이전까지는 nvm이 더욱 많이 사용되었다.  
하지만 최근에는 n을 이용한 버전관리가 훨씬 많이 사용되는데, 이는 <u>극도의 간편함</u> 때문이라고 볼 수 있다.

[https://www.npmjs.com/package/n](https://www.npmjs.com/package/n)

<br>

## 설치 방법

```sh
$ sudo npm install -g n  
$ n --version  # n의 버전을 확인할 수 있다.
```

<br>

## 사용 방법

- n stable : 안정 버전
- n latest : 최신 버전
- n lts : lts 버전
- n x.x.x : 특정 x.x.x 버전
- n ls : 설치된 node 버전들 보기
- n rm <version> : 특정 버전 삭제

단, root에 대한 권한이 없는 경우 앞에 <u>sudo</u>를 꼭 붙여주도록 하자.

```sh
# 에시 (lts 버전을 설치하고자 할 때)
$ sudo n lts 
```

<br>

## 버전 변경이 안되는 경우

일반적으로 위의 사용방법을 실행하면 자동으로 버전이 변경되는데, 간혹 이러지 못하는 경우가 존재한다. 예시로 위에서 lts 버전(16.14.0)을 설치했지만, node의 버전을 확인해보면 이전 버전(17.4.0)이 설치되어 있다고 표시되는 경우이다.  

```sh
$ sudo n lts
  installing : node-v16.14.0
       mkdir : /usr/local/n/versions/node/16.14.0
       fetch : https://nodejs.org/dist/v16.14.0/node-v16.14.0-darwin-x64.tar.xz
   installed : v16.14.0 to /usr/local/bin/node
      active : v17.4.0 at /Users/joon/.nvm/versions/node/v17.4.0/bin/node
$ sudo n ls
node/16.14.0
$ node -v
v17.4.0
```

구글링 결과, Nodejs에서 async를 인식하지 못하는 경우로 직접 Symbolic link를 걸어주어야 한다.

```bash
# ln -sf installed경로 active경로
$ sudo n lts
   installed : v16.14.0 to /usr/local/bin/node
      active : v17.4.0 at /Users/joon/.nvm/versions/node/v17.4.0/bin/node
$ ln -sf /usr/local/bin/node /Users/joon/.nvm/versions/node/v17.4.0/bin/node
$ node -v
v16.14.0
```

<br>

## 참고자료
- [node version 변경하기 - Code in the trap](https://velog.io/@zlemzlem5656/node-version-%EB%B3%80%EA%B2%BD%ED%95%98%EA%B8%B0)
- [Nodejs : n 모듈로 Node 버전 변경이 안될 때 - DevChung](https://velog.io/@jvn4dev/Nodejs-n-%EB%AA%A8%EB%93%88%EB%A1%9C-Node-%EB%B2%84%EC%A0%84-%EB%B3%80%EA%B2%BD%EC%9D%B4-%EC%95%88%EB%90%A0-%EB%95%8C)