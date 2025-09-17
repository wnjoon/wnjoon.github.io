---
layout: post
title:  "Claude Code를 활용한 vim cheatsheet vscode extension 개발기"
description: "HHKB 배열의 키보드는 구매했는데, 모르는 단축어가 나올때마다 웹사이트를 찾는것이 너무 귀찮아서 vim을 설치했다 지웠다만 수없이 반복했습니다. 차라리 vscode에서 단축어를 바로바로 알려줄수만 있으면 좋겠다고 생각해서, claude code를 사용해서 vscode extension을 만들어본 경험을 공유합니다."
categories: dev
draft: false
keywords: "AI, Claude Code, vim cheatsheet, vscode extension"
comments: true
# external_url: https://brunch.co.kr/@wallee/25"
schema:
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  "headline": "Claude Code를 활용한 vim cheatsheet vscode extension 개발기"
  "description": "HHKB 배열 키보드 구매 후 vim 단축키 암기의 어려움을 해결하기 위해, Claude Code AI를 활용하여 VSCode 익스텐션을 직접 개발한 경험을 공유합니다."
  "keywords": "AI, Claude Code, vim cheatsheet, vscode extension, HHKB, Keychron, 개발기, 바이브 코딩"
  "image": "https://velog.velcdn.com/images/wnjoon/post/dbcce4ac-dc2d-4a82-9fcb-78d2b5d5290f/image.png"
  "author":
    "@type": "Person"
    "name": "xonxoon"
  "datePublished": "2025-09-17"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "여기에-블로그-포스트의-전체-URL을-입력하세요"
  "mainEntity": 
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "이 프로젝트를 시작하게 된 계기는 무엇인가요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "HHKB 배열 키보드를 구매한 후 Vim을 제대로 사용하고 싶었지만, 단축키를 외우는 과정이 번거롭고 생산성을 저하시켰습니다. 개발 중 에디터를 벗어나지 않고 바로 단축키를 확인할 수 있는 도구가 필요하다고 느껴 직접 VSCode 익스텐션을 개발하게 되었습니다."
      - "@type": "Question"
        "name": "AI(Claude Code)를 활용한 개발 과정은 어땠나요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "Gemini를 통해 개발 계획 문서(CLAUDE.md)를 작성하고, 이를 기반으로 Claude Code에게 단계별 개발을 요청했습니다. 데이터 스크래핑, 다국어 지원, 단축키 변경 기능 추가 등 전체 과정을 AI와 협업하여 약 1시간 내외로 빠르게 완료할 수 있었습니다."
      - "@type": "Question"
        "name": "AI 코딩 도구를 사용하면서 느낀 개발자의 역할 변화는 무엇인가요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "AI는 개발자의 '똑똑한 조수'와 같습니다. AI가 생성한 코드를 검토하고, 오류를 수정하며, 더 나은 개선 방향을 제시하는 역할이 중요해졌습니다. 기본적인 지식과 전문 역량을 바탕으로 전체 개발 과정을 주도하는 역량이 더욱 필요해질 것이라고 생각합니다."
---


## HHKB 배열의 키보드를 구매한 것이 시작이었다

제 아내를 포함해서 저와 가까운 사람들이 항상 하는 이야기가 있습니다. 제가 물욕이 없다는 것입니다. 저는 개발자치고는 주변기기에 관심도 욕심도 없어서 주는대로 사용하는 편인데요, 여느때처럼 그냥 개발을 하다가 문득 이 상황이 지루하다고 느껴진 때가 있었습니다. 남들처럼 달그락 소리가 나는 멋진 키보드가 한번 써보고 싶었달까요. 그리고 제가 또 평범한건 별로 안좋아합니다. 

사실 vim은 대학생 시절부터 써오던, 특히 미국에서 일하던 임베디드 개발자 시기에 굉장히 많이 사용했던 도구입니다. 그렇다고 잘 사용한건 아닙니다. 그냥 어쩔수없이 사용했고, xcode에서 c를 포팅해서 사용할 수 있는 방법을 알고나서부터는 사용하지 않았습니다. 앞서 말씀드린것처럼 저는 평범하지 않은것에 굉장히 흥미를 느끼는데요, '찐개발자라면 vim을 사용해야한다'는 영상이 그당시에는 왜 그리 흥미로웠는지 모르겠지만, 그렇게 저는 '명색이 개발자라면 vim을 사용하기에 좋은 키보드를 한번쯤 써봐야한다'는 마음으로 HHKB 배열의 키보드를 구매했습니다.

원래 마음같아선 해피해킹을 구입하려고 했습니다만, 여기서도 평범한것을 원치 않았던 저는 키크론에서 HHKB 배열로 만든 [Q60 Pro Max](https://keychron.kr/q60max/)를 구입했습니다. 키보드에 대한 사용기는 나중에 블로그로 작성해보려고 합니다.

<br>

![](https://tbnws.hgodo.com/wordpress/keychorn/products/q60max/products_thumb_q60max_2.jpg)

<br>

결국 평범하지 않은 키배열의 키보드를 구매하고나니, vim을 꼭 제대로 익혀서 남들과 다른 모습의 개발자가 되고싶다는 욕심이 생겼습니다. 그래서 바로 vim extension을 설치했고, 1주일이 채 지나지 않아 해당 기능을 다시 disable하는 사태가 발생하고 말았습니다. 오늘 외운 단축키가 내일 생각이 나지 않았고, 익숙해지기 어려운 구조 덕분에 점점 업무 진행속도가 느려지게 되니 어쩔수 없었습니다. 

한참뒤에 다시 또 욕심이 생겨서 vim extension을 설치했지만, 이 과정은 그냥 도르마무마냥 반복되고 있었습니다.

<!-- ![](https://img.extmovie.com/files/attach/images/135/139/200/068/873e05f63a07c1cbd17782f793d970bf.gif) -->
![](https://velog.velcdn.com/images/wnjoon/post/5bcb4010-a9a1-4641-a9e4-7323deafdd0d/image.gif)


## 단축키를 바로 확인할 수는 없을까?

저에게는 vim을 잘 다루고싶다는 동기는 확실했습니다. 문제는 이 동기를 끝까지 이룰 수 있도록 해주는 좋은 방법이 없었습니다. vim 단축키를 화면에 띄워놓기도 해봤고, 프린팅해서 모니터 옆에 놓기도 해봤습니다만 결국 개발 중간에 '내가 원하는 단축어를 찾아내는 과정'이 굉장히 불편했습니다. 

제가 요즘 AI 에이전트를 이용해서 이것저것 개발해보고싶은 마음에 claude code도 유료로 구독하고, 책도 사는 등 굉장히 열정적입니다. 일명 '바이브 코딩(저는 이 단어를 별로 좋아하지는 않습니다만)'이라고 부르는 것을 좀 해보고싶은데, 막상 개발하고싶은 프로그램은 또 없어서 고민중이었는데요. 원래 본인이 가장 필요하다고 느끼는 것을 개발하는 것 부터가 바이브코딩의 시작이라고 하더라구요? 그때 무릎을 탁 치면서 떠올렸습니다.

"아! vim 단축키를 vscode extension으로 만들면 나도 사용할 수 있겠구나!"

## 다양한 언어로 vim 단축키를 제공하는 extension 만들기

[vim.rtorr.com](https://vim.rtorr.com/)는 다양한 언어로 vim 단축키를 제공하는 사이트입니다. 이 사이트에는 약 37개의 언어로 vim 단축키를 제공하고 있었고, MIT 라이센스 기반으로 되어있었기 때문에 이 사이트를 참조하여 extension에 필요한 데이터를 수집할 수 있었습니다. 

처음에는 37개 모든 언어를 제공하는 extension을 만들고자 헀으나, 최종적으로는 가장 많이 사용되는 8개의 언어를 기준으로 extension을 만들었습니다.

1. English
2. 한국어
3. 简体中文
4. 日本語
5. Español
6. Deutsch
7. Français
8. Português

## CLAUDE.md 설정하기

요즘 바이브코딩을 할때 추천하는 순서가 아래와 같다고 합니다.

1. gemini에게 전체적인 흐름, 아이디어를 검토받고 이를 claude code에게 전달할 수 있는 문서(CLAUDE.md)를 만든다.
2. claude code에게 CLAUDE.md를 참고하여 개발하도록 요청한다. 
3. 만들어진 프로그램을 감상한다.

그래서 저도 똑같이 gemini에게 먼저 프로그램에 대한 저의 아이디어와 개발 방향을 이야기했습니다.

*"HHKB(해피해킹배열) 키보드를 거금주고 구매해서 vim을 사용한 개발을 좀 해보려고하는데, 시도는 여러번해도 이게 손에 잘 익혀지지가 않네.. 일반적으로 개발하던 습관이 몸에 베어있어서 그런가. 그래서 vim 단축키를 별도의 창으로 띄워두고 해봤는데, 그러다보니 생산성이 너무 떨어져. 혹시 vscode에서 vim을 사용할때 즉각즉각 단축키를 확인할 수 있는 익스텐션이나 기능들이 있을까? 만약 없으면, 이런 기능을 만들어서 extension으로 만드는건 어려운일일까?"*

gemini는 저의 애틋한 마음을 알아주었고, claude code가 잘 이해하고 개발해줄 수 있도록 멋드러진 CLAUDE.md를 작성해주었습니다. 물론 채팅을 하면서 생기는 문제점이나 고민들을 해결해가면서 아래와 같이 최종본을 다듬어갔습니다.

- 사용한 CLAUDE.md 파일은 [여기](https://github.com/wnjoon/vscode-vm-cheet-sheet/blob/main/CLAUDE.md)에서 확인할 수 있습니다.

## claude code에게 CLAUDE.md를 참고하여 개발하도록 요청하기

이제 CLAUDE.md 파일을 개발할 디렉토리에 넣고 claude를 호출했습니다. 바로 CLAUDE.md를 사용해서 개발하기 전에, 전체적인 목차를 보고 혹시 미비하거나 먼저 해결해야 할 사항이 있는지 물어보았습니다. 명확하지 않은 부분들을 claude와 해결하고 난 뒤에 하나씩 작업을 진행했습니다.

진행된 전체적인 단계를 간략하게 요약해보면,

1. vim.rtorr.com로부터 각 언어별로 vim 단축키를 스크래핑할 수 있는 기능을 먼저 만들었습니다. 그리고 초기에 설정했던 한국어와 영어에 대해 먼저 데이터를 수집했습니다.

2. 처음에는 한국어와 영어만 지원하려고 했으나, 이왕 하는거 몇개 더 추가해보자는 생각으로 어떤 언어를 추가하면 좋을지 claude와 논의했습니다. 37개 모두를 추가하면 배포 가능한 extension 크기보다 데이터가 커질 수 있기 때문에, 8개정도로 한정하자는 claude의 의견을 받아들였습니다. 최대한 효율적으로(?) 일을 줄여나가는 claude의 모습에 감탄했습니다. 스크래핑 함수를 먼저 만들어놓았기 때문에 나머지 언어들은 금방 수집할 수 있었습니다.

3. 누군가는 이미 기본 단축키(Cmd+K+V)를 사용하고 있을 수도 있다고 생각했습니다. 그래서 단축키를 변경하는 기능을 extension에서 제공하도록 해서 설정 메뉴에 들어가는 수고로움을 줄이자고 했습니다. 이부분은 claude도 매우 찬성해주었습니다. 

## Extension 배포하기

이부분은 저도 처음하는거라 claude가 알려주는 방법 + 구글링([참조사이트](https://velog.io/@bo-like-chicken/%EC%9E%91%EA%B3%A0-%EC%86%8C%EC%A4%91%ED%95%9C-Viusal-Studio-Code-%ED%99%95%EC%9E%A5%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8-%EB%A7%8C%EB%93%A4%EA%B8%B0))을 통해 진행했습니다.

1. Azure DevOps에서 계정을 만들어야 합니다.
2. [Marketplace](https://marketplace.visualstudio.com/)의 Publisher로 등록해야 합니다.
3. Personal Access Token을 발급받아야 합니다.
4. extension을 배포하려는 터미널(로컬)에서 `vsce login` 명령어를 사용하여 publisher ID와 Personal Access Token을 입력합니다.
5. `vsce package` 명령어를 사용하여 extension을 패키징합니다.
6. `vsce publish` 명령어를 사용하여 extension을 배포합니다.

추가로 개발된 extension의 package.json의 내용과 publisher 정보(ID), extension의 정보등이 일치해야 합니다. 이 부분은 구글링 또는 AI에게 질문하면 너무 잘 알려주기 때문에 이 글에서는 생략하도록 하겠습니다. 

그리고 vsce publish 명령어를 사용하면, Marketplace에 동일한 이름을 가진 extension이 있는지 확인합니다. 중복된 이름이 있는 경우에는 ERROR가 발생하기 때문에, 이를 방지하려면 미리 생각하고 있는 extension의 이름이 중복되지는 않았는지 확인해야 합니다.

## 굉장히 만족스러운 결과

이렇게 해서 총 걸린 작업은 약 1시간 이내였습니다. 중간에 초콜릿도 먹고 커피도 먹었던 시간을 제외하면 30분 내외로도 충분히 가능할 것 같았습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/dbcce4ac-dc2d-4a82-9fcb-78d2b5d5290f/image.png)

- 배포된 extension은 [여기](https://marketplace.visualstudio.com/items?itemName=xonxoon.quick-vim-cheatsheet)에서 확인할 수 있습니다.
- Marketplace에서 조회가 되지 않으시다면, [v1.0.0-release](https://github.com/wnjoon/vscode-vm-cheet-sheet/releases/tag/v1.0.0)를 통해 설치하실 수 있습니다. 
- [github](https://github.com/wnjoon/vscode-vm-cheet-sheet) 리포지토리를 통해서는 작성된 코드를 확인하실 수 있습니다.

## 후기

이전 글에서도 제가 바이브코딩에 대한 생각을 짧게나마 적어보았지만, AI가 점점 발전해가면서 저와 같은 개발자들은 오히려 '엄청나게 똑똑한 조수'를 둔 것 같은 느낌이 듭니다. 조수라고 표현한 이유는, 앞에서 언급하지는 않았지만, AI가 개발하는 중간 결과들에 대해서 이를 주문한 사용자는 꼭 검토를 해야하기 때문입니다.

놀라운 것은 불과 몇달전, 아니 몇주전보다도 점점 AI가 만들어내는 오류가 줄어들고 있다는 것입니다. 이번에 만들어본 extension과 같이 정말 간단한 프로그램의 경우에는 오류를 전혀 발생시키지 않았습니다. 오히려 개발 중간에 제가 수정사항을 요구하거나 좀더 나은 개선 방향을 제시하면 다른 부분과 충돌하지 않으면서 굉장히 빠르게 이를 반영해주는 모습이 보였습니다. 

저는 평소에는 windsurf에서 제공하는 탭발사대와 중간중간 개발하면서 이해가 안가거나 귀찮은 작업들을 AI에게 질문하곤 했습니다. 하지만 이번에 claude code를 사용해서 처음부터 끝까지 개발해보니 생각보다 간단한 작업들에 대해서 AI의 도움을 받으니 편리하다는 생각이 들었습니다. 예전에는 새로운 언어나 플랫폼을 학습하고 이를 익숙하게 사용하기까지 시간이 필요했다면, 이제는 전체적인 흐름과 코드를 읽을 줄 아는 기술만 있다면 새로운 언어나 플랫폼을 사용하더라도 크게 제약이 없는 시대가 오는 것 같았습니다. 

물론 이번에도 느꼈지만, 개발자를 완전히 대체하는 것은 어려워보입니다. 우선 개발 단계마다 요청자가 잘 이해하고 좋은 방향으로 요청하기 위해서는 기본적인 지식, 아니 그 이상의 전문적인 역량이 필요할 것이라는 생각이 들었습니다. 오히려 AI가 코딩이라는 분야를 선택적인 누군가만 할 수 있는 기술이라기 보다, 인간이 사용할 수 있는 하나의 언어로써 좀더 친숙하게 다가오게 만드는 계기가 되었으면 좋겠다는 생각도 들었습니다.
