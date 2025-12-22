---
layout: post
title: "Building a Go Yahoo Finance Library with Claude Code #7"
description: "The seventh post covering the story of building a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
categories: [dev, go-yfinance]
draft: false
lang: en
keywords: "AI, Claude Code, python, yfinance, go, yahoo finance"
comments: true
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Building a Go version of the yahoo finance library using Claude Code #7"
  "description": "The seventh post covering the story of building a Go version of the yahoo finance library based on the Python yfinance library using Claude Code."
  "keywords": "AI, Claude Code, python, yfinance, go, yahoo finance"
---

## Conversation with the Maintainer

From the very beginning of this side project, I mentioned in the Discussions tab of the Python yfinance repository that I was implementing a Go-based yfinance by referencing their repository. One of the maintainers responded to my inquiry, leading to an exchange of ideas.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/20569d0b-92cd-44b5-9d6f-83817238fdcf/image.png)

<br>

Honestly, since they are using the APACHE 2.0 license, referencing the logic or implementation methods used in that repository isn't an issue. However, I believed it was proper etiquette to inform the original author that I was developing a new program based on their work.

The first question the maintainer asked was why I needed to develop it in a new language when the well-written Python version already exists. They suggested that it might be easier to just develop a wrapper that receives the Pandas DataFrame returned by Python and converts it into a Go-based structure.

In fact, many developers use it this way. However, to do this, despite it being a Go program, one would need to set up a Python environment and build a separate server to call the library. I thought there would definitely be overhead associated with this, and although I didn't write it in my reply, I believed I could solve this more easily than expected using Claude Code.

Transforming Python yfinance into Go was naturally a process of a "Rewrite," not a direct copy-paste "Port." While I referenced the URLs, parameters, and crumb handling logic, I completely changed the code structure to follow the Go style.

I replied with this content in the Discussion and included additional information expressing gratitude to the original author in the [README.md](https://github.com/wnjoon/go-yfinance/blob/main/README.md#legal--license).

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

## Registering Additional Information

First, I added badges providing additional information about the current repository at the top of the [README.md](https://github.com/wnjoon/go-yfinance/blob/main/README.md#legal--license).

- **Go Reference:** Links directly to the `pkg.go.dev` documentation.
- **Go Report Card:** Shows code quality score.
- **License:** Indicates that it uses the Apache 2.0 license.

### Go Report Card

Go Report Card is a feature that displays the compliance percentage for the current repository regarding checks like `go_vet`, `gofmt`, `gocyclo`, `ineffassign`, `license`, and `misspell`.

Basically, I use `golangci-lint` to always check code quality. However, while writing the final Phases, some checks were missed, so I initially received a score of 80%. I asked Claude Code to check the linting again, reflected all the changes, and merged them into main.

<br>

![image](https://velog.velcdn.com/images/wnjoon/post/8b7aa1bd-b4c1-4bbf-be68-800d11ff877b/image.png)

<br>

In the case of `gocyclo`, the score is currently at 92%, with most issues stemming from function complexity.

About 8 functions exceeded the complexity threshold (15). These functions contain logic for parsing external data (JSON, Protobuf), so they inevitably include numerous `if` or `switch` statements to extract fields. Forcing this logic to be broken down into numerous helper functions seemed likely to increase the probability of introducing bugs and, moreover, appeared to require a significant amount of time to resolve.

Since there were no functional issues other than the score, I planned to improve this part incrementally in the future.

## Generating Static Documentation Using MkDocs

In the [previous post](https://wnjoon.github.io/2025/12/19/go-yfinance-2/), I mentioned that I planned to create documentation for each method and convert it into a static page. So, I used MkDocs to convert the [API documentation](https://github.com/wnjoon/go-yfinance/blob/main/docs/API.md) into a static page.

To do this, I first created a [mkdocs.yml](https://github.com/wnjoon/go-yfinance/blob/main/mkdocs.yml) file in the same path as `go.mod`. At the very top, I wrote the repository URL and the URL where the static page would be displayed. When using GitHub Pages, the static page URL typically takes the form `https://<username>.github.io/<repository>`.

I configured the theme to support both light and dark modes. You can change the theme by clicking the gear icon next to the Search bar at the top.

![image](https://velog.velcdn.com/images/wnjoon/post/1fd2c953-d6e6-4025-8947-ee4d6055f79b/image.png)

I also added commands to the [Makefile](https://github.com/wnjoon/go-yfinance/blob/main/Makefile) to test and build the static webpage based on the documentation files.

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

Finally, I modified the [docs.yml](https://github.com/wnjoon/go-yfinance/blob/main/.github/workflows/docs.yml) file so that when the repository is merged into main, GitHub Actions automatically builds and deploys the latest version of the website.

The currently deployed static webpage can be found at **[https://wnjoon.github.io/go-yfinance/](https://wnjoon.github.io/go-yfinance/)**.

## Deploying to pkg.go.dev

Deploying the generated library to pkg.go.dev is incredibly easy. You only need to go through three steps:

1.  Record changes in `README.md`.
2.  Tag a new version and push it.
    -   `git tag v0.1.0`
    -   `git push origin v0.1.0`
3.  Access "https://pkg.go.dev/github.com/wnjoon/go-yfinance@v0.1.0" in a web browser and click the **Request** button.

It seems to have been registered on pkg.go.dev within about 5 minutes.

## Future Development Plans

With development wrapped up, I organized the overall directory structure.

```
yfinance-main
ㄴ python-yfinance (ranaroussi/yfinance)
ㄴ go-yfinance
ㄴ .claude
ㄴ ...
```

I plan to proceed with development in the following stages:

-   When a new release comes out in `python-yfinance`, analyze it using Claude Code.
-   Identify what is different compared to the current version of `go-yfinance`.
-   Check where the changes occurred and if functional updates are needed.
-   Update the relevant parts and deploy a new release.

## Reflections

Actually, while developing `go-yfinance`, I thought a lot about what capabilities developers like myself need to cultivate in the future. Last year, when I was doing a side job, I received a lot of help from ChatGPT and Windsurf when applying Kubernetes, which I had never used in practice. Even though it wasn't a very complex task and was mostly infrastructure work with defined rules, I sometimes struggled quite a bit because the AI provided off-the-mark answers and solutions.

It has barely been a year since then, but development using Claude Code is truly amazing. Not only for rote coding tasks, but even for complex tasks that initially require time for clear understanding and design, I could see it understanding incredibly quickly and developing much faster and more accurately than I expected. In a way, I thought that depending on the capability of the person giving instructions, the AI might understand much faster and more accurately than a human could.

Recently, someone working in the US mentioned, "When you go to San Francisco, there are so many job boards, and they are hiring AI Agent or Web3 related developers aggressively." I believe that in the future, all developers must become AI Agent developers. Just as languages like Java, Python, and Go are like addition and subtraction, I think AI Agent development will become a standardized skill, like using a calculator. Beyond just being good at asking questions to AI tools like ChatGPT, Gemini, and Perplexity, this was a time where I felt I must now focus on developing programs that create value by utilizing LLMs.
