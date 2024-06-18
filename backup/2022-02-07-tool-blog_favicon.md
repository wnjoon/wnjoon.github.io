---
layout: post
title:  "블로그에 favicon 적용하기" 
excerpt: "깃헙 블로그에 favicon을 이용하여 웹사이트에 나만의 아이덴티티를 부여해본다."
date:   2022-02-07 15:00:00 +0900
categories: tool
tags: [blog, favicon]
---

<br>

## favicon

> <b>favicon</b>
> 즐겨찾기 아이콘. 즐겨찾기(favorites)와 아이콘(icon)의 합성어로, 주소창에 조그만 아이콘으로 표시되어 있다. 
> 아이콘 에디터로 16x16 크기의 적당한 아이콘을 만든 후 그 이름을 favicon.ico로 한 다음 웹 사이트의 루트 디렉터리에 갖다 넣으면 된다. (출처: 아보느 포스트)

favicon을 정상적으로 적용할 경우, 웹브라우저 상단에 내가 적용한 아이콘이 같이 표출된다.

<br>

## 적용 방법

1. 아이콘으로 사용할 그림을 준비한다. 만약 마땅한 것이 없다면 아래 웹사이트에서 적당한 아이콘들을 제공해준다.
 - [https://www.flaticon.com/](https://www.flaticon.com/)
 - [https://icooon-mono.com/](https://icooon-mono.com/)
 - [https://thenounproject.com/](https://thenounproject.com/)
 - [https://www.iconfinder.com/](https://www.iconfinder.com/)
 - [https://www.freepik.com/](https://www.freepik.com/)
 - [https://www.freevectors.net/](https://www.freevectors.net/)
2. [https://www.favicon-generator.org/](https://www.favicon-generator.org/) 에 접속한다.
3. 미리 준비한 이미지를 넣고 create favicon을 해준다.
4. 생성된 favicon 압축을 풀어서 블로그 디렉토리에 옮겨준다. 참고로 필자는 assets/logo 아래에 해당 파일들을 옮겨놓았다.
5. _include/head/custom.html에 생성된 HTML 문구를 저장한다. 기본적으로는 favicon 파일이 블로그 루트 디렉토리에 위치하도록 설정되어있는데, 관리하기에도 불편하고 보기에도 좋지 않아 4번에서처럼 특정 폴더를 만든 후 이곳에 favicon 파일을 저장하였으므로 파일 위치도 이에 맞게 변경해준다.

```html
<link rel="apple-touch-icon" sizes="57x57" href="{{site.baseurl}}/assets/logo/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="{{site.baseurl}}/assets/logo/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="{{site.baseurl}}/assets/logo/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="{{site.baseurl}}/assets/logo/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="{{site.baseurl}}/assets/logo/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="{{site.baseurl}}/assets/logo/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="{{site.baseurl}}/assets/logo/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="{{site.baseurl}}/assets/logo/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="{{site.baseurl}}/assets/logo/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="{{site.baseurl}}/assets/logo/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="{{site.baseurl}}/assets/logo/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="{{site.baseurl}}/assets/logo/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="{{site.baseurl}}/assets/logo/favicon-16x16.png">
<link rel="manifest" href="{{site.baseurl}}/assets/logo/manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="{{site.baseurl}}/assets/logo/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">
```

위와 같이 {{site.baseurl}}을 적어주면 해당 블로그의 루트 위치를 받아올 수 있다.

<br>

## 참고자료
- [파비콘 생성기 : ico파일 만들기 - 아보느 포스트](https://post.naver.com/viewer/postView.nhn?volumeNo=25256173)
- [[Github Blog] 파비콘(Favicon) 세팅하기 - eona1301](https://velog.io/@eona1301/Github-Blog-%ED%8C%8C%EB%B9%84%EC%BD%98Favicon-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0)
