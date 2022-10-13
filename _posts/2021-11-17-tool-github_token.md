---
layout: post
title:  "Github 리포지토리에 Token 적용하기" 
excerpt: "2021년 8월부터 변경된 깃헙의 정책에 따라 리포지토리에 Token을 적용하는 방식을 알아본다."
date:   2021-11-17 15:00:00 +0900
categories: tool
tags: [github, authorization]
---

<br>

## Password -> Token

2021년 8월 13일 기준으로 깃헙에서 기존의 패스워드 방식의 인증을 더이상 사용하지 않고 토큰을 이용하여 사용자를 인증하겠다고 발표했다.

![image](https://user-images.githubusercontent.com/39115630/142071463-f8230552-964a-42c8-975d-99034810bfbf.png)

이미 필자는 토큰 방식으로 변경해놓은 상태이지만, 오늘 만료기간이 지나 토큰을 재생성해야 하는 상황이 생겼고 이를 기록으로 남겨놓으면 좋을 것 같다고 생각하여 글을 작성한다. 

<br>

## 토큰 생성

토큰을 생성하는 방법에 대해서는 여러 포스팅들이 존재하고 있으며, 이 중 한곳을 아래에 링크로 남겨놓는다. 
- [Access Token 인증 방식 변경 적용 방법 - gil.log](https://velog.io/@gillog/Github-MacOS-Access-Token-인증-방식-변경-적용-방법-remote-Support-for-password-authentication-was-removed-on-August-13-2021)

참고로 최종 생성된 토큰값은 페이지를 나가면 더이상 확인할 수 없기 때문에 별도의 공간에 잘 보관해야 한다. *(물론 잊어버리면 다시 생성하면 그만이지만 귀찮기 때문)*

<br>

## 토큰 적용

토큰을 적용하는 방법은 크게 터미널에서 하느냐 vs 운영체제에서 제공하는 프로그램에서 하느냐로 나눌 수 있다. 필자는 맥을 사용하고 있으며 두가지 방법에 대해 모두 기술해보려고 한다.

### git config

혹시 git config를 하지 않았다면 미리 터미널에서 본인의 계정과 이메일주소를 등록해준다.
- git config --global user.name "본인의 계정명"
- git config --global user.email "본인의 깃헙 이메일"

앞으로는 비밀번호를 물어보는 란에 토큰값을 넣게 되는데, 매번 이를 넣어주는 귀찮음을 해결하고 싶다면 다음과 같이 입력해준다.
- git config --global credential.helper cache

토큰 값(비밀번호)을 캐시에 넣어주는 과정으로, 이 과정 이후에는 더이상 토큰 값을 물어보지 않는다.  
캐시를 지우고 싶다면 아래와 같이 입력한다,
- git config --global --unset credential.helper

### Terminal에서 리포지토리에 토큰 적용하기

1. 본인의 git repository 디렉토리에 접근 
2. 디렉토리 내 .git 디렉토리 접근
3. config 파일 편집

```sh
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
[remote "origin"]
  #url = xxxxxxxxxxxxxx
  fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
  remote = origin
  merge = refs/heads/master
```

remote "origin" 부분의 url을 변경해준다. (기존의 url 앞에 계정명과 토큰값을 넣어준다고 생각하면 된다)

```sh
# 기존 url
url = https://github.com/${본인의 계정}/${리포지토리명}.git

# 변경 url
url = https://${본인의 계정}:${앞에서 생성한 토큰 값}@github.com/${본인의 계정}/${리포지토리명}.git
```

<br>

### Keychain 활용하기 (MacOS)

1. Keychain 실행
2. github 검색
3. 등록된 아이디에 해당하는 패스워드를 토큰값으로 변경

<br>

## 참고자료
- [Github Token 깃헙 토큰 설정하기 - 드리프트의 코-자-경](https://cpro95.tistory.com/456)
- [Access Token 인증 방식 변경 적용 방법 - gil.log](https://velog.io/@gillog/Github-MacOS-Access-Token-인증-방식-변경-적용-방법-remote-Support-for-password-authentication-was-removed-on-August-13-2021)
