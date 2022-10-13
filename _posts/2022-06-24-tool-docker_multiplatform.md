---
layout: post
title:  "멀티플랫폼(multi-platform) 형태의 도커 컨테이너 구동하기" 
excerpt: "M1 맥북에서 띄운 도커 컨테이너 내부의 Golang을 실행할 때의 문제점을 통해, 컨테이너 멀티플랫픔을 알아보고 이를 통한 해결 방안을 알아본다."
date:   2022-06-24 15:00:00 +0900
categories: tool
tags: [docker]
---

<br>

## 사용 목적

아래 내용을 읽기전에 간단하게 정리하면, 도커의 이미지를 빌드하는 시점에 해당 이미지의 하드웨어 플랫폼을 '가상으로' 설정해주는 역할이라고 보면 된다. 일반적으로 도커 빌드 시점에 빌드를 진행하는 OS의 플랫폼 아키택처를 따라가는 경우가 많은데, 이 방법을 사용하면 해당 이미지를 x86 또는 x64와 같이 선택적인 아키텍처 기반으로 만들어낼 수 있게 된다.

## M1과 도커, 친해지길 바래

애플에서 만든 M1 칩이 성능 측면에서 굉장히 호평을 받고 있지만, 개발자 혹은 디자이너에게는 호환되지 않는 여러 프로그램으로 인해 골머리를 앓게 하는 경우가 많이 발생한다. 필자도 동일한 스마트 컨트랙트를 테스트할 때, 집에 있는 Intel 맥북 프로와 회사의 M1 맥북 프로 간 매우 큰 성능 차이가 생기는 것을 느낀다.  

특히 대부분의 어플리케이션이 컨테이너화 되고 있는 최근 상황에 맞추어볼 때, '멀티 플랫폼'을 추구하던 도커가 유독 애플의 M1 칩 앞에서는 많은 이슈를 일으킨다. 호스트에서 사용하고 있는 OS에 전혀 영향을 주지 않으면서 또 다른 OS를 동적으로 사용할 수 있는 것이 컨테이너화의 가장 큰 장점인데, M1에서는 이를 위해 별도의 옵션을 추가해야 하는 상황이 생긴 것이다.  

> Docker Desktop for Apple silicon also supports multi-platform images, which allows you to build and run images for both x86 and ARM architectures without having to set up a complex cross-compilation development environment. Additionally, you can use docker buildx to seamlessly integrate multi-platform builds into your build pipeline, and use Docker Hub to identify and share repositories that provide multi-platform images. ([Docker Desktop for Apple silicon - Official Site](https://docs.docker.com/desktop/mac/apple-silicon/))

도커에서는 '우리는 M1 칩에 대하여 멀티 플랫폼을 지원하고 있다' 라고 명시하고 있고, 실제로 옵션을 추가하면 이러한 기능이 가능하기는 하다. 다만 자동으로 이를 충족시켜주지는 못하고 사용자가 직접 이를 입력해야 하지만, 생각보다 복잡하지 않으므로 아주 간단하게 살펴보고자 한다.

<br>

## 문제: Ubuntu 20.04 컨테이너에서 Golang 실행 실패

[Ubuntu 20.04 Official image](https://hub.docker.com/_/ubuntu)에서 이미지를 받고 Golang을 설치 후 실행하면 아래와 같은 오류 메시지가 출력된다.

> qemu-x86_64: Could not open '/lib64/ld-linux-x86-64.so.2': No such file or directory

그렇다면 해당 우분투 이미지는 무슨 아키텍처를 가지고 있을까? 

```sh
$ docker image inspect ubuntu:20.04

[
    {
        "Id": "sha256:d25e19480966fa8f42600158cd5bd24bb4feb96bf92ca038e381aac617e7364e",
        "RepoTags": [
            "ubuntu:20.04"
        ],
        ...
        "Architecture": "arm64",
        ...
    }
]
```

위에서 보이는 것 처럼, arm64로 되어있다. M1에서 docker pull image를 할 때 M1의 OS에 맞게 우분투가 arm64로 다운로드 되었기 때문에, amd64 형식의 golang이 실행되지 않는 것이다.

<br>

## 해결책

### 1. arm64 형태의 Golang 사용

가장 원초적이면서 무식(?)한 방법이다. [go1.18.3.linux-arm64.tar.gz](https://go.dev/dl/go1.18.3.linux-arm64.tar.gz)를 다운받아서 사용하면 되는데, 사실 이걸 위해 이렇게 열심히 포스팅을 작성하는 것은 아니므로 바로 넘어간다. 그리고 우리는 컨테이너의 멀티플랫폼으로 이를 해결할 것이다.

### 2. Docker build 시점에 적용

필자는 Dockerfile을 이용하여 우분투 이미지를 한번 더 포장했는데, 이 때 FROM에 해당 플랫폼을 명시해주면 된다. 이런식으로 플랫폼을 다양하게 명시함으로써 도커 이미지가 멀티플랫폼 빌드될 수 있다.

```yaml
FROM --platform=linux/amd64 ubuntu:20.04
...
```

혹은 Dockerfile은 그대로 두되, 커맨드라인에서 이를 설정할 수도 있다. 

```sh
$ docker buildx build --platform=linux/amd64,linux/arm64 .
```

특히 위와 같이 **두 개 이상의 플랫폼을 동시에 명시** 할 수도 있으며, 이러한 방법을 통해 하나의 컨테이너가 멀티플랫폼으로 돌아갈 수도 있도록 한다.

### 3. Docker run 시점에 적용

```sh
$ docker run --rm -ti --platform linux/arm/v7 ubuntu:latest uname -m
# armv7l

$ docker run --rm -ti --platform linux/amd64 ubuntu:latest uname -m
# x86_64
```

위와 같이 docker run 시점에 플랫폼을 설정할 수도 있다. 결국 이미지 자체가 아니라 컨테이너가 구동되는 순간 플랫폼 아키텍처가 결정되는 구조라고 볼 수 있을 것 같다.

<br>

## 참고자료
- [Docker Desktop for Apple silicon - docker official](https://docs.docker.com/desktop/mac/apple-silicon/)
- [how to run amd64 docker images on arm64 host platform - stackoverflow](https://stackoverflow.com/questions/67458621/how-to-run-amd64-docker-images-on-arm64-host-platform)
- [Faster Multi-Platform Builds: Dockerfile Cross-Compilation Guide - docker official](https://www.docker.com/blog/faster-multi-platform-builds-dockerfile-cross-compilation-guide/)