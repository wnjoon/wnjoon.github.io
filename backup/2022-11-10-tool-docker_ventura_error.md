---
layout: post
title:  "맥 OS 업데이트 이후에 잘 돌아가던 Docker가 아예 동작하지 않는다면?" 
excerpt: "잘 돌아가던 Docker가 어느 순간 'Cannot connect to the Docker daemon at unix:///Users/ssbc/.colima/default/docker.sock. Is the docker daemon running?' 오류를 계속 내뱉는다면? 재설치를 아무리 해도 오류가 사라지지 않는다면?"
date:   2022-11-10 15:00:00 +0900
categories: tool
tags: [docker]
---

<br>

## Ventura 업데이트 이후에 갑자기 도커가 동작하지 않는다

[2022년 10월 24일, Ventura가 출시된 날](https://www.apple.com/kr/newsroom/2022/10/macos-ventura-is-now-available/)에 맞춰 신나게 맥 OS를 업데이트했다. *이 때 까지만 해도, 오류가 계속해서 생겨날지는 꿈에도 몰랐다.*  
사실 도커 이전에 git에서 오류가 발생했고, 이를 ['xcode-select --install'을 이용하여 해결](https://velog.io/@uhan2/Mac-OS-Ventura-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%9D%B4%ED%9B%84-git-path-%EB%AC%B8%EC%A0%9C-%EC%83%9D%EA%B8%B8-%EB%95%8C)했다. 이번 업데이트가 생각보다 자잘한 오류를 만든다고는 들었지만, 이번에 docker에서도 아래와 같이 '도커 데몬이 동작하지 않는다'는 오류가 발생한 것을 확인하였고 이를 해결한 과정을 공유한다.

```
$ docker ps
Cannot connect to the Docker daemon at unix:///Users/ssbc/.colima/default/docker.sock. Is the docker daemon running?
```

<br>

## 해결방안

기본적으로 아래의 두 방법을 먼저 진행해볼 수 있다.
- Docker desktop을 재시작 또는 재설치해본다.
- brew install --cask docker를 이용하여 도커를 시스템 상에서 재설치한다.

물론, 필자의 경우 위의 두가지로 해결되지 않았기 때문에 아래의 경우를 사용한다.

```sh
$ sudo rm -rf ~/Library/Caches/com.docker.docker ~/Library/Cookies/com.docker.docker.binarycookies ~/Library/Group\ Containers/group.com.docker ~/Library/Logs/Docker\ Desktop ~/Library/Preferences/com.docker.docker.plist ~/Library/Preferences/com.electron.docker-frontend.plist ~/Library/Saved\ Application\ State/com.electron.docker-frontend.savedState ~/.docker /Library/LaunchDaemons/com.docker.vmnetd.plist /Library/PrivilegedHelperTools/com.docker.vmnetd /usr/local/lib/docker
```

결론적으로 도커를 완전히 삭제한 후 재설치하는 것이 목표인데, 그냥 Docker desktop을 삭제하고 설치해서는 데이터를 완전히 지울 수 없다. 그래서 위와 같이 도커의 잔재(?)를 모조리 지운 후 재시작하면 정상적으로 동작하는 것을 확인할 수 있다.

> Docker community forum에 의하면, 홈디렉토리 경로에 에러가 발생했을 경우 위의 방법으로 해결이 가능하다고 한다. 이 말은 Ventura로 업데이트 하는 과정에서 맥 OS의 홈디렉토리 경로가 영향을 받았을 수도 있다는 의심을 해 볼 수도 있을 것 같다.

<br>

## 참고자료

- [2 Ways to Completely Uninstall Docker Desktop on Mac - Dr.Buho](https://www.drbuho.com/how-to/uninstall-docker-mac)
- [Rename Home Directory broke docker desktop - Docker community forum](https://forums.docker.com/t/rename-home-directory-broke-docker-desktop/129604)