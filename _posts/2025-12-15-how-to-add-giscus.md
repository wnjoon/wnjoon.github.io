---
layout: post
title: "Giscus로 댓글 기능 추가하기"
description: "Github Pages로 만든 블로그에서 Giscus를 이용하여 포스팅에 댓글을 달아봅니다."
categories: dev
draft: false
lang: ko
keywords: "Giscus, Github Pages, Comment, 댓글"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Giscus로 댓글 기능 추가하기"
  "description": "Github Pages로 만든 블로그에서 Giscus를 이용하여 포스팅에 댓글을 달아봅니다."
  "keywords": "Giscus, Github Pages, Comment, 댓글"
---

## Giscus로 댓글 기능 추가하기

Github Pages로 블로그를 운영하면 기본적으로 제공되지 않는 기능들이 많아서 이것저것 추가해야줘야 할 때가 많습니다. 댓글은 그중에 하나인데요, 사실 저는 포스팅에 댓글이 없는 스타일을 좋아합니다. 이더리움의 창시자인 비탈릭 부테린의 블로그 '[Vitalik Buterin's website](https://vitalik.eth.limo/)'를 보면 포스팅에 댓글 기능이 없죠.

제가 유명한 블로거도 아니고, 작성하는 글들이 대부분 제가 경험하고 생각한 것에 대한 기록이기 때문에 딱히 댓글이 필요한 상황은 아닙니다. 하지만 가끔 댓글로 의견을 물어보는 글도 생기지 않을까 하는 생각이 들더라구요. 그래서 방법을 알아보다 Giscus를 사용하여 댓글 기능을 추가해보기로 했습니다.

## Giscus 설치하기

설치에 앞서, Github Pages에서 댓글 기능을 적용할 수 있는 방법은 크게 3가지 정도 있습니다.

- Giscus
- Utterances
- Disqus

Giscus는 GitHub Discussions 기반이라 UI, 스팸, 관리 면에서 가장 무난합니다. 하지만 repo, category, mapping, repo id, category id 같은 값을 생성해서 블로그에 적용해줘야 합니다. 물론 리포지토리에서 세팅할 것도 있구요.

Utterances는 Issues 기반으로 설정은 단순합니다. 다만 Issues가 댓글로 쌓이기 때문에, 개발자들의 성향에는 딱히 맞지 않아보였습니다. 

Disqus는 외부 서비스, 광고 및 트래킹 이슈 때문에 요즘은 별로 추천되지 않는다고 하더라구요. 그래서 저는 Giscus를 한번 사용해보기로 했습니다.

### Giscus 앱 설치하기

[Github에서 Giscus 앱을 설치](https://github.com/apps/giscus)해야 합니다. 저는 블로그를 운영하는 리포지토리와 동일한 리포지토리에서 댓글을 관리할거라, 블로그 리포지토리에만 권한을 부여해서 설치했습니다.

### 리포지토리 Discussion 활성화하기

위에서 말씀드렸듯이, 저는 블로그 리포지토리에서 댓글을 관리할 것이기 때문에, 해당 리포지토리의 Discussion을 활성화 했습니다. Giscus는 댓글을 Discussion으로 관리하기 때문에, 필수로 이 기능이 활성화되어야 합니다.

1. 저장소 메인 화면에서 Settings 클릭
2. General (기본 페이지) 아래에 있는 Features 섹션 찾기
3. Discussions 체크박스 활성화
4. (표시되면) Set up discussions 버튼을 눌러 사용하고자 하는 카테고리를 확인

저는 이중 General 카테고리를 사용하기로 했습니다. 만약 다른 카테고리에서 댓글을 관리하고 싶다면, 새로운 카테고리를 만들어서 이를 Giscus에 적용하면 됩니다.

### Giscus 설정하기

[giscus 웹사이트](https://giscus.app/ko)에 들어가면 **설정**이 있습니다. 여기서 아래의 순서대로 진행하면 됩니다.

- **언어** : 저는 한국어를 설정했습니다.
- **저장소** : Repository에 Giscus 저장소로 사용하기 위해 Discussion을 활성화한 리포지토리를 입력합니다.
  - `계정명/리포지토리 주소` (`wnjoon/wnjoon.github.io`)

- **페이지 ↔️ Discussions 연결** : 대부분 기본값(pathname)을 권장하길래, 저도 기본값인 "Discussion 제목이 페이지 경로를 포함" 으로 설정했습니다.
- **Discussion 카테고리** : 사용하기로 한 카테고리를 선택합니다. 저는 General로 선택했습니다. 그리고 이 카테고리에서만 Discussion을 찾도록 했습니다. 아마 블로그라서 다른 곳에 Discussion이 작성될 것 같지 않았습니다.
- **기능** : 저는 메인포스트에 반응을 남기도록 설정했는데요, 일종의 **좋아요** 같은 기능입니다. 한번 관종이 되어보고 싶었습니다 😅 나머지 기능은 필요에 따라서 선택하시면 됩니다. 
- **테마** : 이건 블로그의 성격과 기호에 맞게 선택하시면 됩니다.
- **giscus 사용** : 여기까지 하시면 스크립트 하나가 생성됩니다. 여기서 `data-repo-id`와 `data-category-id`를 복사해두면 됩니다. 

## Giscus 적용하기

먼저 포스트 하단에 댓글이 추가될 수 있도록 설정해야 합니다. 저는 댓글을 달고 싶은 포스트의 front matter에 `comments: true`가 있는 경우에만 댓글을 달 수 있도록 설정했습니다. 이를 위해 [_layouts/post.html](https://github.com/wnjoon/wnjoon.github.io/blob/main/_layouts/post.html) 파일을 수정했습니다. 글과 댓글이 딱 붙어있는게 싫어서 약간의 여백을 추가했습니다.

그리고 [_includes/giscus.html](https://github.com/wnjoon/wnjoon.github.io/blob/main/_includes/giscus.html) 파일을 생성했습니다. 여기는 giscus embed 템플릿이 작성되어 있는데, 아래와 같이 작성했습니다.

마지막으로 [_config.yml](https://github.com/wnjoon/wnjoon.github.io/blob/main/_config.yml)에서 아까 복사했던 `data-repo-id`와 `data-category-id`를 포함한 내용을 추가합니다.

```yml
giscus:
  repo: "wnjoon/wnjoon.github.io"
  repo_id: {data-repo-id}
  category: "General"
  category_id: {data-category-id}
  mapping: "pathname"
  strict: 1
  reactions_enabled: 1
  emit_metadata: 0
  input_position: "bottom"
  theme: "preferred_color_scheme"
  lang: "ko"
```

이렇게 하면 댓글창을 포스트 하단에 적용할 수 있게 됩니다. 