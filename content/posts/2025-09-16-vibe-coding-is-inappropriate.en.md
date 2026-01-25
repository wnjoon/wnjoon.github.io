---
title: "The Term Vibe Coding is Inappropriate"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-09-16"
slug: "vibe-coding-is-inappropriate"
summary: "Share my thoughts on why this term 'vibe coding' is wrong."
description: "'Vibe coding' is a neologism referring to the act of a developer writing code with the help of generative AI. The name 'vibe coding' was given because it implies programming based on intuition and feeling, rather than on rigorous logic or design beforehand. I want to share my thoughts on why this term 'vibe coding' is wrong."
toc: false
readTime: true
autonumber: false
math: true
tags: ["essay", "ai", "2025"]
keywords: ["AI", "Vibe Coding", "Generative AI", "Developer"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/09/16/vibe-coding-en/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
  "headline": "The Term Vibe Coding is Inappropriate"
  "description": "'Vibe coding' is a neologism referring to the act of a developer writing code with the help of generative AI. The name 'vibe coding' was given because it implies programming based on intuition and feeling, rather than on rigorous logic or design beforehand. I want to share my thoughts on why this term 'vibe coding' is wrong."
  "keywords": ["AI", "Vibe Coding", "Generative AI", "Developer"]
  "mainEntity": 
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "What is 'Vibe Coding'?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "It's a neologism for the act of writing code with the help of generative AI. It carries the meaning of developing based on intuition and feeling rather than rigorous logic or design, and is often used with the nuance that even non-developers can create programs just by explaining well to the AI."
      - "@type": "Question"
        "name": "Why does the author think the term 'Vibe Coding' is inappropriate?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "Because this term creates the illusion that one can easily develop without professional knowledge just by using AI. Actual AI coding requires professional development knowledge to verify errors like 'hallucinations' and to guide the AI to develop in the right direction. The author points out that the word 'vibe' can cause one to overlook this complexity and responsibility, thereby encouraging reckless dependence on AI."
      - "@type": "Question"
        "name": "So, what does the author say is the proper role of a developer in AI-assisted coding?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "Developers should not just be in the role of giving commands to the AI. The author emphasizes that they must design clear ideas and development steps, verify errors in the AI-generated code, suggest solutions when problems arise, and perform the role of a 'product engineer' who actively leads the entire development process."
---

From some sources, vibe coding is defined as:

> "Vibe coding is a neologism referring to the act of a developer writing code with the help of generative AI. The name 'vibe coding' was given because it implies programming based on intuition and feeling, rather than on rigorous logic or design beforehand."

These days, the term "vibe coding" is used in countless places, including YouTube and LinkedIn. It implies that even if I can't code, or even if I can, I can develop a program without writing a single line of code myself, just by using AI. Personally, I think they might have wanted to capture the cool image from movies—where a program is magically created with a single press of the 'Enter' key—in the word "vibe."

However, the coding that AI does is not always so full of "vibes." Even when we use AI for general purposes, not development, we experience information discrepancies called "hallucinations." This is because AI is "designed not to say 'I don't know'."

When someone asks me something I don't know, I either tell them the truth that I don't know, or I pretend to know. If I admit I don't know, no information discrepancy occurs. But the moment I pretend to know, the other person incurs the additional burden of "having to constantly verify if this information is actually true." What's more dangerous is that the moment the questioner believes this false information is true, they have to continue working in the wrong direction until they learn the answer was false.

The book [Co-Intelligence: Living and Working with AI (from Ethan Mollick)](https://www.amazon.com/Co-Intelligence-Living-Working-Ethan-Mollick/dp/059371671X) argues that the LLM's characteristic of having to create an answer for any question, even ones it doesn't know, has led to hallucinations, and this is the reason why humans still cannot 100% trust AI. This is why services like Perplexity also provide all the external sources used for the answer, seeking validation from the user for the legitimacy of their response.

Many courses and YouTube videos talk about "vibe coding" as if it's the "ultimate answer for non-developers to build programs." They say that if you can explain the program you want to build well (context), and if you can guide the AI well, you can have the AI develop the program.

However, the majority of people who advertise "vibe coding" this way are developers. They are people who know how a program is structured, what technologies to use, and can explain the content of an error to the AI when one occurs. If the AI continuously fails to solve an error, they also need to be able to look at the code, figure out what the problem is, and suggest a section that can be fixed.

<br>

![image](https://img1.daumcdn.net/thumb/R1280x0.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6eZt/image/alOPQIFByf77Qjq6Fg0j1ZKd-lg.png)

<br>

In that respect, the word "vibe" feels more like exaggerated advertising that plants a fantasy about AI-assisted development. We need to handle AI wisely and well. We must guide the AI so that it can proceed with tasks step-by-step, using its tokens efficiently for the development of the target program, without straying. We shouldn't end up in a relationship where we just delegate everything to the AI, like Claude Code's **dangerously-skip-permissions**, as if we have just become an "enter-key launcher." This looks less like cool "vibe" coding and more like irresponsible coding—wanting to get the work done but not wanting to make my own choices or do my own thinking.

Of course, it's true that AI's coding skills are getting better and better. Its ability to read entire codebases and its process for solving problems have definitely improved. It feels like we are becoming true "product engineers," where humans just need to define the idea and the development steps well, and it seems an era where that is required has truly come.

But personally, the word "vibe" doesn't look that good. It seems "vibe" was chosen as a cooler, more stylish word, but I worry that this might be "the very thing that causes mindless dependency on AI." That said, a better word doesn't come to mind. No matter how much I think, I can't think of a word as impressive as "vibe."


*Assuming whatever pops up on your screen is correct just because it compiled is dangerously naive. You need expertise to read, understand, review, and modify that code yourself. Otherwise, you’re just an amateur with a magic wand, hoping for the best.*

*[Vibe coding is one of the stupidest things I’ve ever heard - Alexis Charp](https://alexischarp.medium.com/vibe-coding-is-one-of-the-stupidest-things-ive-ever-heard-4d876b9aadca)*