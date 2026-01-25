---
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #7"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-12-23"
slug: "go-yfinance-7"
summary: "Claude Code를 이용해 Go의 Yahoo Finance 라이브러리를 구현하는 과정을 공유합니다."
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 일곱번째 포스팅입니다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "ai", "claude code", "go", "go-yfinance", "2025"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/12/22/go-yfinance-6/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## 메인테이너와의 대화

저는 이 사이드 프로젝트를 시작하면서부터 Python yfinance의 Discussion에 해당 리포지토리를 참고하여 Go 기반의 yfinance를 구현하고 있다고 말했습니다. 그중 한 메인테이너가 저의 질문에 답하면서 여러가지 내용들이 오갔습니다.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/20569d0b-92cd-44b5-9d6f-83817238fdcf/image.png)

<br>

솔직한 마음으로 APACHE 2.0 라이센스를 사용하고 있기 때문에, 해당 리포지토리에서 사용되는 로직이나 구현 방식을 참조하는 것은 문제가 아니었습니다. 하지만 원작자에게 이를 참조해서 새로운 프로그램을 개발하고 있다고 언급하는 것은 당연한 예의라고 생각했습니다.

처음 이 메인테이너가 저에게 질문한 것은, 이미 잘 작성된 Python이 있는데 굳이 새로운 언어로 개발해야하는 이유였습니다. Python에서 반환하는 Pandas Dataframe을 받아서 Go 기반의 구조체로 변환해주는 Wrapper만 개발하면 쉽지 않겠느냐는 말이었죠.

사실 많은 개발자들이 이렇게 사용하고 있습니다. 하지만 이를 위해서는 Go 프로그램인데도 불구하고 Python 환경을 구성하고 해당 라이브러리를 호출하기 위한 별도의 서버를 구축해야 하죠. 저는 이에 대한 오버헤드가 분명히 있을 것이라고 생각했고, 답장에 적지는 않았지만 예상보다 쉽게 Claude Code를 이용해서 이를 해결할 수 있을 것이라 생각했습니다.

Python yfinance를 Go로 변환하는 것은 당연히 그대로 배끼는 Port가 아닌, Rewrite의 과정이었습니다. URL, 파라미터, 그리고 crumb 처리 로직을 참고하긴 하지만, 코드 구조는 완전히 Go 스타일로 변경했습니다.

이에 대한 내용을 Discussion에 답변했고, [README.md](https://github.com/wnjoon/go-yfinance/blob/main/README.md#legal--license)에 원작자에 대한 감사의 의미를 포함한 추가적인 정보를 기술했습니다.

```md
## Legal & License

**go-yfinance** is distributed under the **Apache Software License 2.0**. See the `LICENSE` file in the repository for details.

### Disclaimer

> **Please read this carefully before using this library.**

1.  **Unofficial API**: This library is **not affiliated with, endorsed by, or connected to Yahoo! Finance**. It wraps unofficial API endpoints intended for web browser consumption.

2.  **Research & Educational Use**: This library is intended for **research and educational purposes**.

3.  **Terms of Service**: Use of this library must comply with [Yahoo!'s Terms of Service](https://policies.yahoo.com/us/en/yahoo/terms/index.htm). Users are solely responsible for ensuring their usage is compliant.

4.  **Risk of Blocking**: Since this library relies on unofficial methods, Yahoo! Finance may change their API structure or block IP addresses making excessive requests at any time without notice.

5.  **No Warranty**: This software is provided "as is", without warranty of any kind, express or implied. The authors shall not be held liable for any damages or legal issues arising from the use of this software.

### Credits

This project is a Go implementation based on the logic of [yfinance](https://github.com/ranaroussi/yfinance). Special thanks to **Ran Aroussi** and all contributors of the original project for their excellent work.
```

## 추가적인 정보 등록하기

먼저 [README.md](https://github.com/wnjoon/go-yfinance/blob/main/README.md#legal--license) 상단에 현재 리포지토리에 대한 추가적인 정보(배지)를 기술했습니다.

- Go Reference: `pkg.go.dev` 문서로 바로 이동
- Go Report Card: 코드 품질 점수
- License: Apache 2.0 라이선스임을 표시

### Go Report Card

Go Report Card는 현재 리포지토리가 go_vet, gofmt, gocyclo, ineffassign, license, misspell 항목에 대해서 얼마나 만족하고 있는지를 퍼센트로 표시해주는 기능입니다. 

기본적으로 golanglint-cli를 사용해서 항상 코드 품질을 검사하는데요, 마지막 Phase들을 작성하면서 일부 검사가 누락된 부분이 있었는지 처음에는 80% 점수를 받고 있었습니다. 그래서 Claude Code에게 lint를 검사를 다시 요청했고, 이를 모두 반영하고 main에 머지 했습니다.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/8b7aa1bd-b4c1-4bbf-be68-800d11ff877b/image.png)

<br>

`gocyclo`의 경우에는 아직 92%를 받고 있는데요, 대부분이 함수의 복잡도에서 발생하는 문제들이었습니다. 

약 8개의 함수에서 복잡도 기준치(15) 이상을 초과했는데요, 이 함수들은 외부 데이터(JSON, Protobuf)를 파싱하는 로직이라, 필드를 추출하기 위해 수많은 if나 switch 문이 포함되어 있습니다. 해당 로직을 억지로 쪼개서 수많은 헬퍼 함수를 생성하는 과정에서 버그가 발생할 확률이 높아질 것 같고, 더 나아가 이를 해결하기 위한 시간이 많이 소요될 것으로 보였습니다.

점수를 높이는 것 외에 기능상으로 문제는 없었기 때문에, 이 부분은 향후에 점진적으로 개선하기로 계획했습니다.

## Mkdocs를 활용한 정적 문서 생성하기

지난번 [포스팅](https://wnjoon.github.io/ko/go-yfinance-3/)에서 각 메소드에 대한 문서를 만들고, 이를 정적인 페이지로 변환하는 것을 계획하고 있다고 말씀드렸습니다. 그래서 Mkdocs를 활용해서 [API 문서](https://github.com/wnjoon/go-yfinance/blob/main/docs/API.md)를 정적 페이지로 변환해보았습니다.

이를 위해서 먼저 go.mod와 동일한 경로에 [mkdocs.yml](https://github.com/wnjoon/go-yfinance/blob/main/mkdocs.yml) 파일을 생성했습니다. 가장 상단에 해당 리포지토리의 URL과 정적페이지가 표시될 URL을 작성했습니다. github page를 사용하면 일반적으로 정적 페이지의 URL은 `https://<username>.github.io/<repository>` 형태로 표시됩니다.

theme는 light/dark 모드를 모두 지원하도록 설정했습니다. 그래서 상단 Search란 옆에 톱니바퀴를 누르면 테마를 변경할 수 있습니다.

![image](https://velog.velcdn.com/images/wnjoon/post/1fd2c953-d6e6-4025-8947-ee4d6055f79b/image.png)

그리고 [Makefile](https://github.com/wnjoon/go-yfinance/blob/main/Makefile)에 문서 파일을 기반으로 정적인 웹페이지를 테스트, 빌드하는 명령어도 추가했습니다.

```makefile
$(MKDOCS):
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install mkdocs-material

# Serve documentation locally (http://localhost:8000)
docs-serve: $(MKDOCS)
	$(MKDOCS) serve

# Build documentation site
docs-build: $(MKDOCS)
	$(MKDOCS) build
```

마지막으로 github action에 리포지토리가 main으로 머지되면 자동으로 웹사이트를 최신으로 빌드해서 배포하도록 [docs.yml](https://github.com/wnjoon/go-yfinance/blob/main/.github/workflows/docs.yml) 파일을 수정했습니다. 

현재 배포되어 있는 정적 웹페이지는 **[https://wnjoon.github.io/go-yfinance/](https://wnjoon.github.io/go-yfinance/)**를 통해 확인할 수 있습니다.

## pkg.go.dev에 배포하기

생성된 라이브러리를 pkg.go.dev에 배포하는 것은 정말 쉽습니다. 3가지 단계만 거치면 되는데요,

1. README.md에 변경사항을 기록한다.
2. 새로운 태그를 붙여서 푸시한다.
    - git tag v0.1.0
    - git push origin v0.1.0
3. 웹브라우저에서 "https://pkg.go.dev/github.com/wnjoon/go-yfinance@v0.1.0"로 접속해서, **Request** 버튼을 클릭한다.
   
대략 5분 이내로 pkg.go.dev에 등록되었던 것 같습니다.

## 향후 개발 계획

개발을 마무리 하고, 전체적인 디렉토리 구조를 정리했습니다.

```
yfinance-main
ㄴ python-yfinance (ranaroussi/yfinance)
ㄴ go-yfinance
ㄴ .claude
ㄴ ...
```

그리고 앞으로 아래와 같은 단계로 개발을 진행할 계획입니다.

- python-yfinance에서 새로운 릴리즈가 나오면, 이를 claude code를 이용하여 분석
- go-yfinance의 현재 버전과 비교했을때 달라진 점이 어떤건지 파악
- 어떠한 부분에서 변경이 발생한건지, 기능상 업데이트가 필요한 부분인지 확인
- 해당 변경 부분을 업데이트하고 새로운 릴리즈 배포

## 소감

사실 go-yfinance를 개발해보면서, 앞으로 나와 같은 개발자들은 어떤 역량을 길러야할지에 대해 굉장히 많은 생각을 하게 되었습니다. 작년에 사이드잡을 할 때, 실무에서 한번도 사용해본적 없던 쿠버네티스를 실제로 적용할때 ChatGPT와 Windsurf의 도움을 정말 많이 받았습니다. 정말 복잡한 업무가 아니었고, 대부분 규칙이 정의되어 있는 인프라 업무였음에도 불구하고 AI를 활용해서 가끔은 엉뚱한 답변와 해결책이 나와서 꽤 많이 고생했던 적도 있었습니다.

이제 겨우 1년이 지났는데, Claude Code를 활용한 개발은 정말 놀라울 정도입니다. 단순 노동과 같은 개발은 말할 것도 없고, 복잡한 업무의 경우 처음에는 명확한 이해와 설계가 필요한 시간이 존재하지만, 이마저도 굉장히 빠르게 이해하고 제가 예상한 것보다 훨씬 빠르고 정확하게 개발하는 것을 볼 수 있었습니다. 어떻게보면 지시하는 사람의 역량에 따라 사람이 이해하는 것보다 훨씬 빠르고 정확하게 이해할 수도 있겠다는 생각이 들었습니다.

얼마전 미국에서 일하고 계신 한분이 **샌프란시스코에 가면 구인구직하는 전광판이 굉장히 많은데, AI 에이전트 또는 Web3 관련 개발자를 엄청나게 구하고 있더라**는 말을 했습니다. 저는 앞으로 모든 개발자들은 AI 에이전트 개발자가 되어야 한다고 생각합니다. 마치 Java, Python, Go와 같은 언어가 덧셈과 뺄셈이라면, AI 에이전트 개발자는 계산기를 사용하는 것처럼 표준화된 기술이 될 것이라고 생각합니다. ChatGPT, Gemini, Perplexity와 같은 AI 도구에게 질문을 잘 하는 것을 넘어서, 이제는 LLM을 활용해서 내가 가치를 창출하는 프로그램을 개발하는 것에 집중해야겠다고 느끼게 된 시간이었습니다.



   

