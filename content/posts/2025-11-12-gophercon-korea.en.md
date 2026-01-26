---
title: "GopherCon Korea 2025 Review"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-11-12"
slug: "gophercon-korea-2025"
summary: "A detailed review of GopherCon Korea 2025, covering various sessions with amazing speakers."
description: "A detailed review of GopherCon Korea 2025, covering sessions on AI agents with Go, WebRTC concurrency, HTTP frameworks, and idiomatic Go practices."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "go", "meetup", "2025"]
keywords: ["golang", "gophercon", "gophercon korea", "gophercon korea 2025", "conference", "backend"]
showTags: true
hideBackToTop: false
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
  "headline": "GopherCon Korea 2025 Review"
  "description": "A detailed review of GopherCon Korea 2025, covering sessions on AI agents with Go, WebRTC concurrency, HTTP frameworks, and idiomatic Go practices."
  "keywords": ["golang", "gophercon", "gophercon korea", "gophercon korea 2025", "conference", "backend"]
---

## An 8-Year Golang Developer's First Conference

I first experienced the Go language in 2018 during a blockchain development project at LG CNS. Even before that, I had an interest in it simply because it was "the language made by Google." However, like many developers, finding the time to learn a new language unrelated to my daily work was a challenge. Then, the blockchain platform my company used shifted to Go, and now, I’ve become the developer who uses Go the most (honestly, it feels like it’s the only thing I use).

Ashamedly, despite my years of using Go, I had never attended a conference, seminar, or even a meetup related to it. Perhaps I thought of language merely as a tool, or maybe I felt that "exploring a language" was too philosophical. Looking back now, I think it was simply because I didn't realize its importance.

Moving from a System Integration (SI) company—where we developed based on client requirements—to a company that builds platforms and researches internal technologies, I realized how crucial it is to keep up with updates, new features, and deprecations in the language I use. After all, the language is the tool I use most frequently in my work; I wondered if I had been too indifferent.

Long story short, I heard the news that [GopherCon Korea 2025](https://gophercon.kr/) was being held. Although the registration fee was 'a bit steep by my standards,' I happily paid and attended.

![image](https://velog.velcdn.com/images/wnjoon/post/671bb182-5115-42bd-ac1c-e125fb1e42ec/image.png)

I was so excited that when I discovered there was no information about GopherCon Korea 2025 on the Go Wiki site, I even went to Discord to report it.

![image](https://velog.velcdn.com/images/wnjoon/post/0e97821e-4b43-4bf1-813a-8a0a53e7f06c/image.png)

## Session Summary

My first GopherCon experience was incredibly satisfying. The venue was comfortable, and the environment was perfectly set up for the speakers' presentations and slides to be conveyed clearly.

There were plenty of stickers—a developer's favorite—and with no limit on how many we could take, I grabbed quite a few. The goods at the flea market were also quite attractive; I bought a keycap that I'm currently using very well.

![image](https://velog.velcdn.com/images/wnjoon/post/34edac4f-7a7b-48b8-83e3-dcdf24e0248b/image.JPG)

Here is a summary of the sessions presented at the event, along with my personal thoughts.

![image](https://velog.velcdn.com/images/wnjoon/post/b13300e8-276c-40a3-a6c6-947cfa43ab1d/image.png)

### AI Stock Recommendation and Auto-trading System Built with Go

I actually had a personal schedule around the time of the event, so I thought I might miss the first presentation starting at 10:30 AM. However, the moment I saw the topic, I rushed to the venue just to catch it.

I've been learning how to create AI agents recently, and most tutorials explain how to write programs based on Python.

This is likely because most AI libraries, starting from data science tools, are built in Python, and Python is relatively easy to learn. However, I found it ironic to relegate Go to a secondary option for AI agents, which likely require handling much more processing than general programs. So, I couldn't miss a presentation about building an AI agent with Go.

- [github repo](https://github.com/suapapa/go_kinvest)
- [demo website](https://ss-demo.homin.dev/)

The most interesting part was [Genkit](https://github.com/firebase/genkit). Genkit is a library that allows you to develop LLM agents based on Go. It is a framework that supports not only Gemini but also OpenAI, Anthropic, and Ollama. (Interestingly, unlike other tools, Python is in the 'Early' stage and seems the least stable among the supported languages here).

![image](https://velog.velcdn.com/images/wnjoon/post/e2c63bb1-9f87-404e-b45a-711028f48e9b/image.png)

The speaker mentioned designing the investment direction based on a book called *Seven Split* and implementing the necessary functions and prompts for the AI agent based on that. Personally, I believe we are moving into an era where a developer's competence is measured not by coding speed or the number of tools they can use, but by how well they understand the business and how quickly they can design and implement it using AI.

Therefore, I think we must constantly learn how to use AI tools well and keep an interest in high-level features, even if we don't use them immediately. From that perspective, while Go was just a tool for implementation, the speaker's presentation was excellent from a career standpoint. He mentioned that he had been seriously studying investing for about three months, and the completeness of the implemented AI agent was impressive. It was a session with a lot to learn.

### Creating Simultaneous Interpretation with Go - Real-time AI Inference, WebRTC

Go's biggest advantage is undoubtedly **Channels**. While other languages support parallel processing, none make it as simple as Go. If you create channels and control them with mutexes at the right time, you can handle complex concurrency control sufficiently.

The biggest advantage of parallel processing is the ability to process the same tasks faster. In simultaneous interpretation, which was the topic of this presentation, processing speed is critical. You need to understand and translate the other person's speech quickly so that the conversation doesn't break or become awkward. The WebRTC mentioned here operates on P2P (Peer-to-Peer) and does not have a relay server in the middle.

There are two main libraries available for WebRTC:
- [pion](https://github.com/pion): Open source, good for implementing simple projects.
- [livekit](https://github.com/livekit/livekit): Enterprise-grade.

Additionally, the speaker mentioned configuring a **buffered channel** to resolve **backpressure**. Backpressure is a mechanism to manage problems that arise when a consumer (subscriber) cannot process data faster than the producer produces it. For example, if the other person speaks quickly, data might be lost or the order might change during parallel processing, creating unintended content. To solve this, it seemed they applied a method of storing the conversation in an appropriately sized buffer and managing the order internally.

> For more details on backpressure, please refer to [this link](https://looco.tistory.com/12#:~:text=%F0%9F%93%96%20Backpressure%EB%9E%80?,%EC%8B%9C%EC%8A%A4%ED%85%9C%20%EC%95%88%EC%A0%95%EC%84%B1%EC%9D%84%20%EB%B3%B4%EC%9E%A5%ED%95%A9%EB%8B%88%EB%8B%A4.) (Korean).

### Framework or Not: That is net/http

Developers often stand at a crossroads where they must choose between performance and flexibility. This applies to selecting a server framework as well. Generally, the most used frameworks are Gin, Echo, and Fiber.

- [gin](https://github.com/gin-gonic/gin)
  - Lowest difficulty among frameworks.
  - Not recommended for expected high traffic, but covers a decent amount.
- [echo](https://github.com/labstack/echo)
  - The most "Go-like" framework.
  - More complex compared to Gin.
- [fiber](https://github.com/gofiber/fiber)
  - Good if you don't need HTTP/2 and speed is paramount.
  - However, memory control is essential.

These frameworks can be largely divided into two types:
- **net/http**: Gin, Echo
- **[fasthttp](https://github.com/valyala/fasthttp)**: Fiber

`fasthttp` offers performance six times higher than `net/http`, so it is used when high performance is required. However, it has the disadvantage of not supporting HTTP/2 or higher. The speaker recommended using **Gin** unless there is a specific purpose, and if detailed settings are needed within it, recommended using Go's standard library `net/http` directly. I have summarized more details in [Comparison of Go HTTP Libraries: fasthttp vs net/http](https://wnjoon.github.io/2025/11/11/comparison-go-http-lib/), so please check it out.

### Effect-ive Go: Completely Go-like Functional Programming

This presentation was very difficult and challenging. The speaker introduced himself as someone who loves Go immensely. As I mentioned earlier, I didn't treat the language as anything more than a tool for work. I didn't feel the need to understand the philosophy and culture of the language, so I didn't pay much attention to how it was changing. But the speaker was the opposite. He looked for improvements within the powerful interface-based design provided by Go and implemented them as a library.

The speaker believed that minimizing abstractions, removing unnecessary ones, and keeping existing abstractions as small as possible are important values that follow Go's philosophy. However, as we minimize abstractions, we sometimes encounter situations where we have to implement many devices, including Mocks, for testing, to the point where it's confusing whether it's testing or debugging. The speaker introduced a library that improved this, called [effect-ive go](https://github.com/on-the-ground/effect_ive_go).

> Effect-ive Go proposes the minimal idiomatic interface for delegating effects, staying true to Go
> - Uses context and teardown for idiomatic effect handler binding/unbinding
> - Effects declared with type and payload
> - Effect payloads are sent over channels to matching handlers found in context

In addition, there were many features, such as significantly improving performance by "Tableizing" pure functions. I thought it would be good to read through it carefully later. I met the speaker on LinkedIn afterward and sent him a message to express my personal respect.

![image](https://velog.velcdn.com/images/wnjoon/post/3a30efbb-d377-44b4-9e3d-da9301d41cc1/image.png)

### Test Reality Not Mocks: Reliable Go Tests in the AI Era

Personally, I don't really like Mock-based testing. It feels... uncomfortable? While it is possible to verify that a function returns the expected result, I always thought that Mock-based testing had limitations in testing situations that could actually occur in business logic in detail. Perhaps it was just a feeling, but I felt that a senior developer *should* use Mock-based testing well, so I sometimes forced myself to create Mocks for testing. However, mostly I set up a real environment locally and tested based on that. After hearing the speaker, I thought, "Ah, I wasn't wrong."

The speaker expressed that "Testing Mocks isn't testing the actual application." He emphasized that nowadays, testing the application directly based on AI allows for much more accurate testing. He shared several methods for good testing, including this point.

**How to test the entire application (main)**
- While it's impossible to test the `main` function itself, you can test it if you make the `main` function a single execution point that calls a specific function.
- For example, if you implement it so that `main` calls a `Run()` function, you just need to test the `Run()` function.
- You can test if the `Run()` function executes correctly by calling a `waitForHealthCheck` function (waiting until it returns 200) in the test code.
- More details on this can be found in [How I write HTTP services in Go after 13 years](https://grafana.com/blog/2024/02/09/how-i-write-http-services-in-go-after-13-years/).

**How to monitor production code using `go test`**
- `*/10 * * * * go test -run ...`
- You can periodically test the developed application using tools like cronjobs.

**Testing Concurrency Issues**
- Using `t.Parallel()` allows you to discover numerous bugs caused by concurrency issues during the testing process.
- When using `t.Parallel()`, you must use unique data.
- You can use `flag.Parse` to test multiple environments simultaneously (e.g., Test environment, Dev environment, Production environment).

Thankfully, he shared the presentation on [slideshare](https://docs.google.com/presentation/u/0/d/1P0BJFU0cjZuf5l-dHfg4pgOqJ24ZAXQ-/mobilepresent) and also introduced an application development and testing tool called [readworld](https://github.com/raeperd/realworld.go).

### Dev in Go way

What is "Go-like" development? I believe Go's **Duck Typing** is a prime example showing how highly scalable an application designed based on interfaces can be. The speaker delivered more in-depth content regarding this interface-perspective design.

**Small Interface**

The larger you define an interface, the more likely you are to depend on unnecessary functions. For example, let's assume there is a `Storage` interface.

```go
type Storage interface {
    Save(key string, value []byte) error
    Load(key string) ([]byte, error)
    Delete(key string) error
}
```

Let's assume there is a `Backup` object that only needs the function to save data (`Save`). If the Storage interface is defined as above, a problem arises where you have to depend on `Load` and `Delete`, which are not needed.

In this case, it is better to define an interface called `Saver`. And Storage should be designed to include these small, split interfaces. This allows for small and clear separation of responsibilities.

```go
type Saver interface {
    Save(key string, value []byte) error
}

type Storage interface {
    Saver
    Loader
    Deleter
}
```

### Discover Interface, Not Design

What happens if you use excessive imagination to develop an interface in the early stages of development? You might end up defining functions you thought were necessary but actually aren't, leading to code waste.

Therefore, it is better to understand the domain first and then proceed with the necessary abstractions. Attempting to predict the perfect interface before implementation is the wrong approach. Additionally, if you implement a functional adapter, you can check and replace it with an interface that has the same specifications when a separate interface is needed.

### Accept interface, return structs

Design to require the minimum and provide the maximum. If you don't necessarily need to return an interface type, it is better to return a struct type.

```go
ProcessData(f *os.File) (x) -> ProcessData(r io.Reader) (o)
```
### Options pattern

If the number of arguments keeps increasing, the ambiguity of the code can increase. This is also called the **Telescoping Constructor Anti-Pattern**, meaning 'extending a telescope further out to see distant stars'. As shown below, if you create a function every time an additional argument is needed to call function A, it can make the code harder to understand.

```go
// Bad Example: Arguments keep increasing
func NewServer(addr string) *Server { ... }
func NewServerWithTimeout(addr string, timeout time.Duration) *Server { ... }
func NewServerWithTimeoutAndMaxConn(addr string, timeout time.Duration, maxConn int) *Server { ... }
// Continues to grow...
```

Sometimes the Builder pattern is used, but it is not recommended in Go. The biggest reason is that validation logic tends to become concentrated during the build process. So, would doing validation in each `SetX` function solve it? Rather, if an error occurs in a `SetX` function, a problem might arise where various errors cannot be chained properly.

The best solution is to create a private options struct and use the **Functional Options Pattern**.

- Extensibility: No impact on existing code even if new options are added.
- Readability: The meaning of each option is clear (e.g., `WithTimeout(60*time.Second)`).
- Optional Configuration: Only necessary options can be set.
- Default Values: Default values are used if options are not specified.
- Order Independence: Can be set regardless of the order of options.

```go
package main

import (
    "fmt"
    "time"
)

// Server Struct
type Server struct {
    addr    string
    timeout time.Duration
    maxConn int
    tls     bool
}

// private options struct
type options struct {
    timeout time.Duration
    maxConn int
    tls     bool
}

// Option function type definition
type Option func(*options)

// Functions setting each option
func WithTimeout(t time.Duration) Option {
    return func(o *options) {
        o.timeout = t
    }
}

func WithMaxConnections(n int) Option {
    return func(o *options) {
        o.maxConn = n
    }
}

func WithTLS(enabled bool) Option {
    return func(o *options) {
        o.tls = enabled
    }
}

// NewServer Constructor - Receives Option as variadic arguments
func NewServer(addr string, opts ...Option) *Server {
    // Default settings
    options := options{
        timeout: 30 * time.Second,
        maxConn: 100,
        tls:     false,
    }
    
    // Apply passed options
    for _, opt := range opts {
        opt(&options)
    }
    
    return &Server{
        addr:    addr,
        timeout: options.timeout,
        maxConn: options.maxConn,
        tls:     options.tls,
    }
}

func main() {
    // Usage Examples
    
    // 1. Use defaults
    s1 := NewServer("localhost:8080")
    fmt.Printf("Server 1: %+v\n", s1)
    
    // 2. Set some options
    s2 := NewServer("localhost:8080",
        WithTimeout(60*time.Second),
    )
    fmt.Printf("Server 2: %+v\n", s2)
    
    // 3. Set multiple options
    s3 := NewServer("localhost:8080",
        WithTimeout(60*time.Second),
        WithMaxConnections(200),
        WithTLS(true),
    )
    fmt.Printf("Server 3: %+v\n", s3)
    
    // 4. Order doesn't matter
    s4 := NewServer("localhost:8080",
        WithTLS(true),
        WithTimeout(45*time.Second),
    )
    fmt.Printf("Server 4: %+v\n", s4)
}
```

### Building a P2P Blockchain Network from Scratch in Go

I couldn't hear this presentation due to personal matters 😭.

### Creating Powerful Buffering using the Sync Package / Subtitle: Go's Easy Concurrency Programming via Real-world Examples

Actually, this was a topic I was very interested in, but I had to leave early due to an important schedule after the conference 😭. I personally wished this session was a bit earlier, but the other sessions were so good that I decided to accept it as unavoidable.

Since blockchain keeps all stored data in blocks, the time it takes to query blocks and extract meaningful data continues to increase over time. To compensate for this, a service called an **Indexer** is used. An Indexer periodically saves transaction contents or block information contained in the blockchain to a database and helps check the internal information of the blockchain in real-time based on this stored information.

Of course, it's fine if the data you want to query is from a block that has already been synchronized to the database for some time. However, problems can arise, such as requesting information on a block generated in real-time from the Indexer, or attempting to query information from the Indexer at the very moment the block is being synchronized.

It seems the speaker intended to explain how to store block information in a specific buffer called a **Worker Pool** and synchronize it safely and efficiently with the database using the **Sync package**. It's hard to provide exact details since I missed the full talk, but I'm sure it was very informative, which makes it all the more regrettable.

## Conclusion

One speaker mentioned, "I am happy to gather with people who love Go in one place to share interests and talk," and being there in person, I really felt that atmosphere.

I'm not usually sentimental about programming languages, but it was a great experience to attend an event where I could seriously think about the technology I use most, explore better directions, and share insights. I look forward to GopherCon continuing with great content in 2026.