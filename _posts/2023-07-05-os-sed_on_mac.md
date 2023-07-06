---
layout: post
title:  "맥OS에서 sed를 사용할 때의 문제점 해결" 
excerpt: "sed는 유닉스 계열의 OS에서 손쉽게 파일 내부의 특정 값을 수정할 수 있는 명령어다. 그런데 말입니다(?) 혹시 command expects \ followed by text 라는 글을 보신적이 있으신가요?"
date:   2023-07-05 15:00:00 +0900
categories: os
tags: [mac, linux]
comments: true

---

<br>

## 테스트 환경

- Apple M1 Pro
- Ventura 13.4.1

참고로 인텔칩이냐 M1이냐의 문제라기보단, MacOS에서 발생할 수 있는 문제점이다.

<br>

## 맥OS에서 sed 사용하기

config.json 파일의 \_id\_ 값을 입력받은 파라미터로 변경하기 위해 아래와 같이 스크립트를 작성했다. 

```shell
$ sed -i "s|_id_|${ID}|g" "config.json"
```

하지만 아래와 같은 오류가 발생했다.

```
sed: 1: "config.json": command c expects \ followed by text
```

<br>

## 문제 해결

다양한 해결방법들이 존재하는데, 개인적으로 gnu-sed를 추가로 설치하는 것이 가장 편했다.

```shell
$ brew install gnu-sed
...

GNU "sed" has been installed as "gsed".
If you need to use it as "sed", you can add a "gnubin" directory
to your PATH from your bashrc like:

    PATH="/opt/homebrew/opt/gnu-sed/libexec/gnubin:$PATH"
==> Summary
🍺  /opt/homebrew/Cellar/gnu-sed/4.9: 12 files, 613.6KB
==> Running `brew cleanup gnu-sed`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
```

설치 이후에 zshrc에 해당 PATH를 추가해주면 된다.

```
$ echo PATH="/opt/homebrew/opt/gnu-sed/libexec/gnubin:$PATH" >> ~/.zshrc
```

<br>

## 참고

- [HOW TO FIX THE “SED COMMAND EXPECTS \” ERROR ON MAC OS](https://ben.lobaugh.net/blog/205337/how-to-fix-the-sed-command-expects-error-on-mac-os)








