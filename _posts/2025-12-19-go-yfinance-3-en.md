---
layout: post
title: "Building a Go Yahoo Finance Library with Claude Code #4"
description: "The fourth post covering the story of building a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
categories: [dev, go-yfinance]
draft: false
lang: en
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Building a Go version of the yahoo finance library using Claude Code #4"
  "description": "The fourth post covering the story of building a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## The Need for Documentation

After [verifying the consistency between yfinance and go-yfinance](https://wnjoon.github.io/2025/12/19/go-yfinance-2-en/), it suddenly occurred to me that the library I'm developing needs documentation. Initially, I planned to write the documentation after the library development was finished. However, since the library has now surpassed the MVP stage and reached a level where it's practically usable, I thought it would be good to start documenting it now.

If this were an API, I would have naturally thought of Swagger, but nothing immediately came to mind for a Go library. I could use the documentation automatically generated when uploading a Go library to `pkg.go.dev`, but just as yfinance operates a [separate documentation webpage](https://ranaroussi.github.io/yfinance/), I felt I should have a separate user manual as well.

I mainly used `go doc`, but honestly, perhaps because I didn't know much about it, I wasn't very satisfied. The web-formatted documentation it generated was quite poor. So, I decided to look for other methods.

<br>

*👨🏻‍💻: What do you think about applying gomarkdoc to the currently developed go-yfinance? Or please let me know if there are other good ways to create user documentation.*

<br>

## Various Documentation Tools

I asked the question above to both Claude Code and Gemini. Here is a summary of the answers I received from both AIs. Among them, I decided to use **[gomarkdoc](https://github.com/princjef/gomarkdoc)**.

**gomarkdoc**

- Pros:
  - Outputs in Markdown format → Renders directly on GitHub/GitLab
  - Easy integration with existing README.md
  - Can be automatically generated in CI/CD
  - Customizable templates
- Cons:
  - Requires external tool installation (`go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest`)

**godoc**

- Pros:
  - Official Go tool, no separate installation required
  - Same format as pkg.go.dev
  - Automatically generates documentation on pkg.go.dev when the library is published
- Cons:
  - Provided only as an HTML server (`godoc -http=:6060`)
  - Difficult to generate static files

**pkgsite**

- Pros:
  - UI identical to pkg.go.dev (Local version of pkg.go.dev)
  - Latest Go documentation standard
- Cons:
  - Difficult to export statically

If the library grows later and I want to create a website including not just simple API specifications but also tutorials and guides, I can use [MkDocs](https://www.mkdocs.org/) or [Docusaurus](https://docusaurus.io/). I was told that Markdown documents created using gomarkdoc can be directly used in MkDocs or Docusaurus to build a website. I plan to try this later and write a post about it.

## Setting up GitHub Actions Automation

I learned this time that you can use GitHub Actions to automatically update documentation whenever a new feature is developed and pushed to the repository. I decided to update the documentation whenever a specific stage of development is completed and pushed to `main`.



You can write the following in the `.github/workflows/docs.yml` file:

```yml
name: Generate Documentation

on:
  push:
    branches:
      - main  # Triggers when pushed to the main branch
    paths:
      - 'pkg/**' # Triggers only when code inside the pkg folder changes

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v3
        with:
          go-version: 1.23 # Go version in use

      - name: Install gomarkdoc
        run: go install [github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest](https://github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest)

      - name: Generate API Documentation
        # Scans the pkg folder recursively and regenerates the API.md file
        run: gomarkdoc --output API.md ./pkg/...

      - name: Commit and Push changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "docs: update API documentation via gomarkdoc"
          file_pattern: API.md
```

The sequence is as follows:

1. Modify the code and upload it to GitHub.
2. The Action runs and modifies API.md according to the changed code.
3. The bot automatically leaves a commit saying "docs: update...".

## Requesting Documentation Generation

I asked Claude Code to write documentation based on the development progress so far.

<br>

*👨🏻‍💻: Please write documentation for the content developed so far using gomarkdoc. Write each method, parameter, and result value according to standards. Please proceed while carefully checking if there are any missing comments or if anything is written insufficiently or missing compared to the gomarkdoc method. Also, set up CI/CD so that this document is automatically updated whenever I push to main.*

<br>

## Documentation Results

**Added Files**

| File | Description |
|---|---|
| `.github/workflows/docs.yml` | Automatic documentation generation on main push |
| `.github/workflows/test.yml` | Test and lint CI |
| `docs/API.md` | Generated API documentation (2,790 lines) |
| `pkg/client/doc.go` | client package documentation |
| `pkg/ticker/doc.go` | ticker package documentation |
| `pkg/models/doc.go` | models package documentation |
| `pkg/config/doc.go` | config package documentation |
| `internal/endpoints/doc.go` | endpoints package documentation |

**Improved Method Documentation**

- `History()` - Added parameters and examples
- `HistoryPeriod()` - Added description of valid periods
- `HistoryRange()` - Added parameter description
- `Dividends()`, `Splits()`, `Actions()` - Added return value description
- `IncomeStatement()`, `BalanceSheet()`, `CashFlow()` - Added examples and field descriptions

**CI/CD Behavior**

- `docs.yml`: When `pkg/**/*.go` or `internal/**/*.go` changes → Runs `gomarkdoc` → Automatically updates and commits `docs/API.md`
- `test.yml`: On PR/push → Runs tests, uploads coverage, runs `golangci-lint`

**How to View the Documentation**

- [API.md](https://github.com/wnjoon/go-yfinance/blob/main/docs/API.md)