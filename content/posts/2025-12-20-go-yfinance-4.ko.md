---
title: "Claude Code로 Go의 Yahoo Finance 라이브러리 만들기 #4"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-12-20"
slug: "go-yfinance-4"
summary: "Claude Code를 이용해 Go의 Yahoo Finance 라이브러리를 구현하는 과정을 공유합니다."
description: "Claude Code를 활용해서 python 버전의 yfinance 라이브러리를 기반으로 go 버전의 yahoo finance 라이브러리를 만들어가는 이야기를 담은 네번째 포스팅입니다."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "ai", "claude code", "go", "go-yfinance", "2025"]
keywords: ["AI", "Claude Code", "python", "yfinance", "go", "yahoo finance"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/12/19/go-yfinance-3/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## 문서의 필요성

[yfinance와 go-yfinance의 일치성을 확인](https://wnjoon.github.io/ko/go-yfinance-3/)하고 나니, 문득 현재 개발중인 라이브러리의 문서가 필요하다는 생각이 들었습니다. 처음에는 라이브러리 개발이 끝난 다음에 문서를 작성할 계획이었습니다. 하지만 현재 라이브러리가 MVP 기능을 넘어서 실용적으로 사용 가능한 수준까지 개발된 상태에서, 문서를 미리 작성하기 시작하는 것도 좋을 것 같다는 생각이 들었습니다.

API인 경우 일반적으로 사용되는 Swagger를 자연스럽게 떠올렸을텐데, Go 라이브러리는 마땅히 생각나는것이 없었습니다. Go 라이브러리를 `pkg.go.dev`에 올리면 자동으로 만들어지는 문서를 사용할 수도 있지만, yfinance 또한 [별도의 문서 웹페이지](https://ranaroussi.github.io/yfinance/)를 운영하는 것 처럼, 저도 별도의 사용 설명서만큼은 있어야겠다고 생각했습니다.

저는 주로 `go doc`을 사용했는데요, 사실 알고 있는게 별로 없어서 그렇지 별로 만족스럽지는 못했습니다. 만들어지는 웹페이지 형식의 문서는 정말 형편없었거든요. 그래서 다른 방식을 좀 찾아봐야겠다고 생각했습니다.

<br>

*👨🏻‍💻: 현재까지 개발된 go-yfinance에 gomarkdoc을 적용하는것에 대해 어떻게 생각해? 혹은 사용자 문서를 만들 수 있는 다른 좋은 방식이 있다면 알려줘.*

<br>

## 다양한 문서 작성 도구들

위의 질문을 Claude Code와 Gemini 모두에게 물어봤는데요, 두 AI에게서 받은 답변을 정리하면 다음과 같습니다. 이중에서 저는 **[gomarkdoc](https://github.com/princjef/gomarkdoc)**을 사용하기로 했습니다.

**gomarkdoc**

- 장점
  - Markdown 형식으로 출력 → GitHub/GitLab에서 바로 렌더링
  - 기존 README.md와 쉽게 통합
  - CI/CD에서 자동 생성 가능
  - 커스터마이징 가능한 템플릿
- 단점
  - 외부 도구 설치 필요 (`go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest`)

**godoc**

- 장점:
  - Go 공식 도구, 별도 설치 불필요
  - pkg.go.dev와 동일한 형식
  - 라이브러리 공개 시 자동으로 pkg.go.dev에 문서 생성
- 단점:
  - HTML 서버로만 제공 (`godoc -http=:6060`)
  - 정적 파일 생성이 어려움


**pkgsite**

- 장점:
  - pkg.go.dev와 완전히 동일한 UI (pkg.go.dev 로컬 버전)
  - 최신 Go 문서 표준
- 단점:
  - 정적 export 어려움

나중에 라이브러리가 커져서 단순 API 명세 뿐만 아니라 튜토리얼, 가이드 등을 포함한 웹사이트를 만들고자 할 경우 [MkDocs](https://www.mkdocs.org/), [Docusaurus](https://docusaurus.io/) 등을 사용한다고 합니다. 이 때 gomarkdoc을 사용해서 만든 마크다운 문서를 MkDocs나 Docusaurus에서 바로 사용해서 웹사이트를 만들 수 있다고 하네요. 이부분은 나중에 한번 시도해보고 포스팅하겠습니다.

## GitHub Actions 자동화 설정하기

이번에 알게된 사실입니다만, 새로운 기능이 개발되어 리포지토리에 push되는 시점에 Github Action을 이용해서 자동으로 문서를 업데이트 할 수 있습니다. 저는 특정 단계의 개발이 완료되고 main에 push되는 시점에 문서를 업데이트하기로 결정했습니다. 

`.github/workflows/docs.yml` 파일에 아래와 같이 작성하면 됩니다.

```yml
name: Generate Documentation

on:
  push:
    branches:
      - main  # main 브랜치에 push 될 때 동작
    paths:
      - 'pkg/**' # pkg 폴더 내의 코드가 변경될 때만 동작

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v3
        with:
          go-version: 1.23 # 사용 중인 Go 버전

      - name: Install gomarkdoc
        run: go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest

      - name: Generate API Documentation
        # pkg 폴더 하위를 스캔해서 API.md 파일을 다시 만듭니다.
        run: gomarkdoc --output API.md ./pkg/...

      - name: Commit and Push changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "docs: update API documentation via gomarkdoc"
          file_pattern: API.md
```

순서는 다음과 같습니다.

1. 코드를 수정해서 GitHub에 올립니다.
2. Action이 돌면서 변경된 코드에 맞춰 `API.md`를 수정합니다.
3. 봇이 자동으로 "docs: update..."라는 커밋을 남깁니다.

## 문서 작성 요청

Claude Code에게 현재까지 개발된 내용을 토대로 문서를 작성해달라고 요청했습니다.

<br>

*👨🏻‍💻: gomarkdoc을 사용해서 현재까지 개발된 내용에 대한 문서를 작성해줘. 각 메소드, 파라미터, 결과값을 표준에 맞게 잘 작성해줘. 혹시 지금 주석이 제대로 달려있지 않은건 없는지, gomarkdoc 방식에 비해 부족하게 작성되거나 작성되지 않은건 없는지 꼼꼼하게 확인하면서 진행해줘. 그리고 main으로 push할때마다 자동으로 이 문서가 업데이트되도록 ci/cd도 설정해줘.*

<br>

## 문서 작성 결과

**추가된 파일**

|파일|설명|
|---|---|
|`.github/workflows/docs.yml`|main push 시 자동 문서 생성|
|`.github/workflows/test.yml`|테스트 및 lint CI|
|`docs/API.md`|생성된 API 문서 (2790줄)|
|`pkg/client/doc.go`|client 패키지 문서|
|`pkg/ticker/doc.go`|ticker 패키지 문서|
|`pkg/models/doc.go`|models 패키지 문서|
|`pkg/config/doc.go`|config 패키지 문서|
|`internal/endpoints/doc.go`|endpoints 패키지 문서|

**개선된 메서드 문서**

- History() - 파라미터 및 예제 추가
- HistoryPeriod() - valid periods 설명 추가
- HistoryRange() - 파라미터 설명 추가
- Dividends(), Splits(), Actions() - 반환값 설명 추가
- IncomeStatement(), BalanceSheet(), CashFlow() - 예제 및 필드 설명 추가

**CI/CD 동작 방식**

- `docs.yml`: pkg/**/*.go 또는 internal/**/*.go 변경 시 → gomarkdoc 실행 → docs/API.md 자동 업데이트 및 커밋
- `test.yml`: PR/push 시 → 테스트 실행, 커버리지 업로드, golangci-lint 실행

**문서 확인 방법**

- [API.md](https://github.com/wnjoon/go-yfinance/blob/main/docs/API.md)