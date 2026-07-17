---
title: "Does Token Usage Always Scale with Productivity?"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-17"
slug: "tokenmaxxing"
summary: "It started with the idea that today's token price is the cheapest it will ever be. From there came tokenmaxxing — evaluating someone's work by how many tokens they burn. But does heavy token usage actually mean productivity? We should focus on cost per verified outcome, not cost per token — and think about where tokens are spent efficiently, and how to guide more of them toward the work that really matters."
description: "It started with the idea that today's token price is the cheapest it will ever be. From there came tokenmaxxing — evaluating someone's work by how many tokens they burn. But does heavy token usage actually mean productivity? We should focus on cost per verified outcome, not cost per token — and think about where tokens are spent efficiently, and how to guide more of them toward the work that really matters."
toc: true
readTime: true
autonumber: false
math: true
tags: ["essay", "AI", "Claude Code", "ai-agent", "2026"]
keywords: ["essay", "AI", "Claude Code", "ai-agent", "2026"]
showTags: false
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Does Token Usage Always Scale with Productivity?"
  "description": "It started with the idea that today's token price is the cheapest it will ever be. From there came tokenmaxxing — evaluating someone's work by how many tokens they burn. But does heavy token usage actually mean productivity? We should focus on cost per verified outcome, not cost per token — and think about where tokens are spent efficiently, and how to guide more of them toward the work that really matters."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## The Age of Burning Tokens — tokenmaxxing

Sometime this year, a strange kind of bragging became popular among developers who use AI coding tools: "I burned 210 billion tokens this week." According to press reports, Meta ran an internal dashboard ranking the token usage of its roughly 85,000 employees, and the top spot went to an employee who burned 281 billion tokens in a single month. Some companies are even said to factor token usage into performance reviews. Those who celebrate spending **more and more** tokens — rather than saving them — call this token maximalism (tokenmaxxing).

![image](https://velog.velcdn.com/images/wnjoon/post/e092d2c2-d3c8-4a65-8f91-c1a695f193b0/image.png)

Personally, I'm skeptical of tokenmaxxing. I can't shake the suspicion that a lot of that token usage grows out of handing everything over to AI, or out of users simply avoiding the tedious parts themselves. So in this post, I want to trace how the tokenmaxxing trend came about, organize the arguments from both the supporters and the critics, and then check which kinds of work actually consume the most tokens — to see whether tokenmaxxing genuinely helps get more work done.

1. Where this trend came from, and the logic that drives it
2. What the other side says
3. Where tokens are actually spent

---

## Where the Trend Began

The push to spend more tokens didn't appear out of nowhere.

In September 2024, OpenAI released o1 and proposed test-time compute scaling — the idea that spending more tokens at inference time produces better answers — which established a new scaling axis. This is where the equation "burning more tokens equals performance" began.

In November 2024, Guido Appenzeller of a16z published a piece called [LLMflation](https://a16z.com/llmflation-llm-inference-cost/) with a striking figure: **"For constant capability, LLM inference cost drops roughly 10x every year."** Indeed, GPT-3-level tokens cost $60 per million tokens in 2021 and had fallen to $0.06 by 2024. That's a 1,000x drop in just three years.

In January 2025, on the day the DeepSeek shock rattled AI stocks, Microsoft CEO Satya Nadella invoked [Jevons paradox](https://fortune.com/2025/01/27/microsoft-ceo-satya-nadella-deepseek-optimism-jevons-paradox/) — the 19th-century economic proposition that as a resource becomes more efficient to use, its consumption doesn't shrink but explodes. From this point on, many people began to believe that the cheaper tokens get, the more of them we will consume.

In March 2025, Steve Yegge concluded in [Revenge of the Junior Developer](https://sourcegraph.com/blog/revenge-of-the-junior-developer) that "a single coding agent burns $10–12 worth of tokens per hour, and giving each developer **a token budget of $80–100 per day** multiplies their productivity — a no-brainer." On LinkedIn, countless entrepreneurs described AI as "a worker that never stops, 24 hours a day," and a mood began to form that token prices were fairly reasonable and well worth the spend.

In June 2025, Anthropic published [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system), reporting that in more than 80% of their tasks, using more tokens led to better results. They even found that rather than one agent grinding away alone, a multi-agent approach — appointing the smartest model as the team lead and having it delegate work to lighter models — produced about 90.2% better results. Of course, running multiple agents this way consumed roughly 15x the tokens of a single agent. The takeaway — "if you want performance, let it spend tokens" — became the core evidence of the token-maximizing camp. That said, they also added a caveat: precisely because it burns so many tokens, **spend them only on work valuable enough to justify the cost.**

From mid-2025 to the present, practices kept pouring out: Claude Code's "ultrathink" keyword (a [hidden command](https://simonwillison.net/2025/Apr/19/claude-code-best-practices/) that raises the thinking-token budget to 32,000), the [Ralph Wiggum loop](https://ghuntley.com/ralph/) that re-feeds a prompt in an infinite loop, and Yegge's [Gas Town](https://steve-yegge.medium.com/welcome-to-gas-town-4f25ee16dd04), which runs 20–30 agents in parallel. Users began posting their `ccusage` token counts to [leaderboards](https://www.viberank.app/), competing and showing off as if it were a game.

## For: Tokens Are Cheap, People Are Expensive

Those who view tokenmaxxing favorably argue that **"in a market where token prices fall 10x every year while developer wages stay flat, any token spend that saves human time is pure profit."**

- According to Anthropic's own published findings, performance scales with tokens. Attaching verification agents in parallel, appointing judges across multiple agents, and letting the model search as widely as possible are all ways of buying quality by burning more tokens.
- [In Defense of Tokenmaxxing](https://aidailybrief.beehiiv.com/p/in-defense-of-tokenmaxxing) argues that since countless organizations are still learning how to use AI, we should "not be afraid of burning tokens on valuable mistakes." The piece also criticizes the culture in which a $600 Claude bill gets scrutinized more harshly than a $23 food-delivery expense.
- In an essay titled [Token Maximalism](https://www.alephic.com/token-maximalist), the author writes that "what's expensive today will be cheap tomorrow, and the value outweighs the cost" — urging readers to optimize for the capability they can acquire rather than today's unit price, and not to hold back on tokens.

---

## Against: Tokens and Productivity Are Two Different Things

Starting in the second quarter of 2026, more and more voices began arguing that token usage doesn't necessarily scale with productivity.

- Engineering analytics firm Jellyfish analyzed Q1 2026 data from 7,548 developers ([TechCrunch coverage](https://techcrunch.com/2026/04/17/tokenmaxxing-is-making-developers-less-productive-than-they-think/)) and found that **"the group that used the most tokens did create the most PRs — but they spent 10x the token cost for a 2x increase in throughput."** In the end, the productivity gain was small relative to the tokens spent. Other data cited in the same report pointed the same way: among heavy AI users, **churn — reworking code soon after it was written — rose by as much as 861%**.
- In a [randomized controlled trial by METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), experienced open-source developers were **actually 19% slower when using AI, while believing they were 20% faster**. It may read like a mere one-percent gap, but the argument it makes is that the productivity people *feel* is not the same as the productivity AI actually delivers.
- Tokens can scale code-writing without limit, but reading, reviewing, and taking responsibility for that code still falls on humans. One analysis found that in teams with heavy AI usage, PR merges rose 98% while review time rose only 91% (some argue the two don't have to move in lockstep, since AI also pre-organizes what needs to be reviewed). As curl maintainer Daniel Stenberg put it: "AI doesn't increase the capabilities of the humans in the loop. It shifts the cost to review."
- The moment token usage becomes the metric, the things that actually define productivity drop out of the evaluation entirely. [Don't Tokenmax](https://www.aiforswes.com/p/the-real-way-to-make-agentic-development) calls token-usage leaderboards a rerun of "KPIs measured in lines of code," and proposes measuring **code that survives (retention)** instead of output per token. There are also reports that Uber exhausted its annual AI budget just four months into its Claude Code rollout, and that Meta eventually put a cap on internal token spending.
- A paper by researchers at Stanford and Microsoft Research analyzing the token consumption of eight frontier models on SWE-bench ([How Do AI Agents Spend Your Money?](https://arxiv.org/abs/2604.22750)) found that agentic tasks consume roughly 1,000x the tokens of chat — and most of that cost comes from **input tokens (the "context snowball")**: the agent re-reading the entire context so far before every action. Even the same task swings up to 30x in token usage from run to run, and accuracy often hits its peak at a moderate level of token spend. In short, spending more tokens does not always produce a better result.

---

## Checking It Myself

To see for myself, I picked four of my recent Claude Code sessions and traced **where my tokens actually went**. Claude Code stores session logs as local JSONL files (`~/.claude/projects/…`), recording input, output, and cache tokens for every model response. I used four sessions from ten days of work on a Go-based backend project.

- Sessions analyzed: 4
- Human turns: 333
- Model responses: 5,507

I grouped each human input together with the model responses that followed it into one "turn," and categorized each turn by the pattern of tools used within it.

---

> *The measurements are rule-based approximations over four of my own Claude Code sessions (July 2026, 5,507 model responses). The classification script aggregates the per-message `usage` fields in the transcript JSONL, and costs are converted at list API prices (which may differ from actual spend on a subscription plan). Generalize with caution.*

- Any turn that edits files is classified as **coding** — and within those, responses that come after a tool-execution error (build failure, test failure, etc.) count as **rework**
- Turns containing commit, push, merge, or issue-close commands count as **cleanup**
- Turns with no edits count as **planning** — turns that end by asking me a question are **clarification**, and the rest are **exploration & planning**

Measuring token usage at the turn level invites error, and the rework judgment inevitably depends on tool state, so it can only be somewhat subjective. The results may be conservative — but the goal here isn't precise measurement, just a rough map of where the tokens flow, so please keep that in mind.

The results are below. Costs are converted at list API prices (based on Opus 4.8: $5 input / $25 output per MTok; cache reads at 0.1x the input price, cache writes at 1.25–2x).

| Category | Output tokens | Share | Est. cost | Share |
|---|---:|---:|---:|---:|
| Planning — clarification | 1.10M | 14.6% | $153 | 7.8% |
| Planning — exploration & planning | 1.39M | 18.4% | $337 | 17.2% |
| Coding — as planned | 2.72M | 36.2% | $690 | 35.1% |
| Coding — rework | 1.21M | 16.1% | $384 | 19.5% |
| Cleanup — commit, merge, docs | 1.10M | 14.6% | $399 | 20.3% |
| **Total** | **7.51M** | | **$1,964** | |

### 1. Pure coding is only a third

Tokens spent "writing code as planned" came out to 36% of the total. The other two-thirds were consumed aligning on plans, handling problems nobody anticipated, and cleaning up commits, docs, and lint. This is exactly why token totals can't be read as productivity: most tokens go not to the code itself, but to **the work surrounding the code**. Lint is arguably part of coding, but my workflow — asking for the code first, then following up with a review pass covering lint and documentation — probably pushed it into this bucket.

### 2. Rework comes up a lot

Rework — fixing problems that weren't in the plan — accounted for 31% of coding tokens (3.93M) and 19.5% of total cost. This is tied to my own coding habits: after asking the AI to write code, I usually ask it to review the code once more and check for anything missing or incorrect, which likely explains the number.

On the flip side, clarification — asking again because the explanation wasn't sufficient — came out to only 7.8% of cost. Personally, I often found Claude Code's phrasing hard to follow and had to ask follow-up questions, which probably explains it. At the same time, it made me wonder whether my own numbers were demonstrating exactly what the anti-token-maximizing side means by "bad specs burn tokens" — a jab at the "ask first, fix later" way of working.

### 3. 70% of the cost is "memory upkeep"

If you look at cost composition instead of token counts, the picture changes completely.

| Cost component | Tokens | Cost | Share |
|---|---:|---:|---:|
| Cache reads (context reuse) | 2,502M | $1,365 | 69.5% |
| Cache writes | 35M | $386 | 19.7% |
| Output (what the model actually produced) | 7.5M | $206 | 10.5% |
| Fresh input | 1.2M | $7 | 0.3% |

- 98.6% of all processed input tokens were prompt-cache re-reads, and they accounted for 70% of the cost.
- The model's actual output was only 10% of the cost. It made me wonder — cautiously — whether the enormous token counts on those dashboards are mostly cache re-reads as well.
- The headline token count looks explosive, but the unit price is a tenth of list price. That's why tokenmaxxing isn't as reckless as the raw numbers suggest — and, at the same time, why total token count may not mean much as a metric.

---

## Conclusion

In the end, when tokenmaxxing is reframed around cost per verified outcome rather than cost per token, the conclusion is that finishing the job in one pass with an expensive model beats retrying several times with a cheap one. Token usage alone tells you nothing about productivity — in practice, productivity came down not to how many tokens were used, but to how appropriately they were spent on a good model.

If I were advising a developer, I'd suggest keeping these four habits in day-to-day work:

1. Use a good model — and plenty of tokens — for planning and clarifying questions.
2. Spend tokens generously on verification. Parallel verification, testing, and review with a strong model is the kind of spending that efficiently converts into performance.
3. Never let token usage become the metric. Measure surviving code and cost per outcome instead.
4. If possible, check where your tokens actually go. Knowing exactly where you spend is the first step to deciding where to spend more and where to save.