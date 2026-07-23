---
title: "Making Another AI Review AI-Written Code to the End: Building sparring"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-23"
slug: "sparring-cross-model-code-review-loop"
summary: "I built sparring, a review loop in which Codex or an independent Claude instance reviews code written by Claude Code and keeps the author in a fix-and-review cycle until the reviewer declares convergence. This post covers why I built it, its design principles, the implementation of Phases 1–3, a small effect benchmark, and what comes next."
description: "An introduction to sparring: why I built it, the projects that inspired it, its design and implementation, current progress, benchmark results, and the roadmap for separating AI code authorship from completion judgment."
toc: true
readTime: true
autonumber: false
math: false
tags: ["dev", "AI", "Claude Code", "Codex", "ai-agent", "code-review", "2026"]
keywords: ["AI", "Claude Code", "Codex", "AI agent", "code review", "review loop", "sparring"]
showTags: true
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Making Another AI Review AI-Written Code to the End: Building sparring"
  "description": "An introduction to sparring: why I built it, the projects that inspired it, its design and implementation, current progress, benchmark results, and the roadmap for separating AI code authorship from completion judgment."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Why I Built It

![sparring](https://raw.githubusercontent.com/wnjoon/sparring/dev/image/main.png)

AI coding agents have made writing code noticeably faster. But finishing a task quickly and finishing it correctly are two different things.
In particular, when I asked the same agent to review an implementation it had just written, it sometimes missed the same problem again because it still shared the assumptions and reasoning behind its original choices.

The simplest way to review AI-generated code is to ask the same session to “check it again.” I used this approach for a long time, but it has several weaknesses.

- Whether a review happens depends on the user's memory and prompt.
- The author and reviewer share the same conversational context and assumptions.
- Even if the first review finds a problem, there is no guarantee that the resulting fix will itself be reviewed.
- The author can finish the task without accepting the reviewer's findings.
- When design disagreements and real bugs are mixed together, the outcome can depend more on who argues with greater confidence than on who is actually right.

At first, I created a separate skill for cross-verification, called `parallel-verify`. When either Claude or Codex wrote code, I could request a separate verification pass from the other agent.
However, this skill only **pointed out what was wrong with the other agent's code**; it did not carry the work through to completion.
Strictly speaking, that was intentional. I believed the final result always needed user verification. Over time, though, I noticed that after several rounds of cross-verification I almost always agreed with the conclusions the agents had reached together. That made me want a skill that could let the agents reach agreement and complete the implementation as well.

With sparring, I therefore decided to build a structure in which review is unavoidable, rather than merely writing a prompt that says “review carefully.” When Claude Code attempts to finish a task, a `Stop hook` blocks the exit and prevents the workflow from moving on until an independent reviewer has produced a result.

The reviewer exists to ensure that **the model that wrote the work does not also decide whether its own work is complete**. For example, when Claude Code writes the implementation, Codex or a separate Claude process reviews it in read-only mode. Fixes and reviews continue until the reviewer declares `CONVERGED`.

The design has four core principles.

1. **Single writer**: Only the author modifies the code. The reviewer is read-only.
2. **Reviewer declares**: Only the reviewer decides when the work is complete.
3. **Deterministic enforcement**: Hooks and a state machine enforce the process, rather than relying on prompt compliance.
4. **Blind adjudication**: Judges and final verifiers see only the code and requirements, never the debate history.

In this structure, the reviewer does more than leave a one-time opinion. It reads the code again, reviews the fixes, and ends the loop only when it concludes that nothing worth fixing remains.

---

## Repositories and Documents I Referenced

The project that most directly influenced the initial structure was Hamel Husain's [claude-review-loop](https://github.com/hamelsmu/claude-review-loop). It taught me the idea of using Claude Code's `Stop hook` to block the end of a session and run a Codex review. I was especially struck by the fact that “requesting a review” and “enforcing that a review takes place” are entirely different problems.

I also adapted the following ideas from the review-loop protocol in [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols).

- Freeze the review baseline at the beginning so intermediate commits cannot shrink the review surface.
- Do not tell the reviewer that the author “fixed” or “rejected” a finding.
- Record design decisions in a decision ledger while preserving the reviewer's freedom to flag real defects caused by those decisions.
- When a factual dispute reaches a stalemate, have a blind judge that never saw the debate decide it, so the ruling is not pulled toward the more persuasive argument.
- Give risky work or long-running debates one final review from a fresh perspective.

During implementation, I also checked Claude Code's [Hooks documentation](https://docs.anthropic.com/en/docs/claude-code/hooks) and the behavior of the Codex CLI's read-only sandbox.

Within the project, I separated design and implementation around the following documents.

- [README](https://github.com/wnjoon/sparring/blob/dev/README.md): Current user-facing features and roadmap
- [Design decisions](https://github.com/wnjoon/sparring/blob/dev/docs/design-decisions.md): Decisions that have been agreed upon but are not yet implemented
- [Phase implementation plans](https://github.com/wnjoon/sparring/tree/dev/docs/superpowers/plans): Concrete work units and verification methods
- [Effect benchmark](https://github.com/wnjoon/sparring/blob/dev/bench/README.md): Measurement method, results, and limitations

`policy.md` is the source of truth for currently implemented behavior, while `design-decisions.md` records the phases completed so far and the decisions that guide future phases. When a future design is implemented, it moves into policy, and the README distinguishes between features users can use today and features that are still planned.

---

## How sparring Works

The user starts a task in Claude Code like this:

```text
/spar Implement the login token refresh logic and add tests
```

When the author finishes the implementation and attempts to stop, the `Stop hook` checks the state file and prepares the reviewer runner and prompt. Here, the author is not the user; it is **the authoring agent currently implementing the code**.
The reviewer reads the task requirements and changes, then returns one of two values on its first line.

```text
STATUS: CONVERGED
```

or

```text
STATUS: FINDINGS
```

Findings are divided into two categories.

- `[MECHANICAL]`: Objectively fixable problems such as bugs, missing checks, or requirement violations
- `[DESIGN]`: Decisions with multiple valid alternatives, such as API structure or tradeoffs

For each finding, the author must record either `FIXED` or `REJECTED` with a grounded reason.
The next reviewer does not see this response. Instead, it reviews the entire change again from the frozen baseline. Rather than trusting the author's claim that something was fixed, it judges the actual code afresh.

```text
Implementation
  ↓
Stop hook blocks exit
  ↓
Read-only reviewer's blind review
  ├─ CONVERGED → exit
  └─ FINDINGS
       ├─ MECHANICAL → fix or reject with evidence
       └─ DESIGN → debate between models first
  ↓
Full re-review of the changes
```

A reviewer may describe the same problem differently from one round to the next.

For example, the first review might call something a “page calculation error,” while the next calls it “an offset that starts at one.”

sparring first compares the file name and a simplified version of the title to determine whether they refer to the same finding. If that is still ambiguous, a separate blind matcher decides only whether the two findings describe the same underlying problem.
If the same problem is raised in two consecutive rounds and the authoring agent continues to reject it with supporting reasons, sparring treats the disagreement as a stalemate.
A dispute over whether something is a real bug goes to an independent blind judge. If it is instead a design choice with no single correct answer, sparring parks it, handles the remaining findings, and presents all related questions to the user together at the end.

- For a factual dispute about a bug, the blind judge returns `UPHELD` or `DISMISSED`.
- For a genuine design choice, sparring does not stop all progress immediately. It parks the choice and batches it into a single user gate after the other findings have been handled.

To prevent a broken loop from trapping the user forever, internal errors fail open, and the loop has a default cap of five rounds. Reaching the cap is not success. It is a circuit breaker that reports honestly that the reviewer did not converge and then exits.

---

## Development Plan

Rather than implementing every feature at once, I divided the work into verifiable phases.

| Phase | Scope | Current status |
|---|---|---|
| 1 | `/spar`, Stop hook, iterative review, response files, frozen baseline, round cap | Complete |
| 2 | Conveyance boundary, finding registry, stalemate handling, blind judge, batched design gate, semantic matcher | Complete |
| 3 | Claude–Claude single-agent mode that works without Codex | Complete |
| 4 | Risk-based final sweep, skip conditions for small changes, design-intent harvest | Planned |
| 5 | Unattended mode and final audit report | Planned |
| 6 | Mirror adapter in which Codex writes and Claude reviews | Planned |
| 7 | Model economics: reviewer model, reasoning effort, low-cost fix writer, and related controls | Planned |

For each phase, I first document the design decisions, break the implementation plan into small tasks, and then move the rules into hook code, tests, or small prompt changes.
The guiding principle is to make the state machine and file structure enforce the rules wherever possible, instead of asking the model to remember them.

---

## Current Progress

As of July 23, 2026, Phases 1–3 are implemented on the `dev` branch, and the plugin version is [v0.2.0](https://github.com/wnjoon/sparring/releases/tag/v0.2.0).

Today, `/spar` resolves the reviewer family once and applies it consistently to the reviewer, judge, and matcher.

- If the Codex CLI is installed, the default is a cross-model setup with a Claude author and Codex reviewer.
- Without Codex, sparring uses an isolated, read-only `claude -p` reviewer.
- The reviewer can be selected explicitly with `/spar --reviewer codex|claude -- <task>`.
- In same-family mode, sparring tells the user that **cross-vendor blind-spot diversity is reduced**.

The Claude reviewer is limited to inspection tools such as `Read`, `Grep`, and `Glob`. It also runs with `--safe-mode`, isolating it from project context such as CLAUDE.md, memory, plugins, and hooks. The goal is to keep it from inheriting the active authoring session's debate and conclusions even when both agents belong to the same model family.

---

## Test and Benchmark Results

The current test results are:

- Stop hook state transitions and reviewer/judge/gate/matcher tests: **120 passed**
- Reviewer-family selection and argument-safety tests: **12 passed**
- Total: **132 passed, 0 failed**
- Planted-bug E2E with a real Codex reviewer: `FINDINGS → fix → blind re-review → CONVERGED`
- Read-only, isolated Claude reviewer execution and same-family E2E verified

I also created a small paired benchmark to check whether the review loop actually improves the result.
This is not a statistically rigorous performance evaluation. It is a demonstration of how the same starting implementation changes with and without a reviewer.

The method is as follows.

1. A Claude Sonnet subagent writes a first-pass implementation, P0, using only `spec.md`.
2. A hidden `oracle.py` grades P0.
3. Starting from the same P0, I separately run the Claude–Codex cross-model loop and the Claude–Claude same-family loop.
4. Neither the reviewer nor the author can see the oracle, and both results are graded with the same oracle.

First, the initial implementation passed every test on four small tasks with clear requirements.

| Task | Natural P0 before review |
|---|---:|
| Duration parser | 12/12 |
| Pagination | 8/8 |
| LRU cache | 4/4 |
| Semantic version comparison | 12/12 |
| **Total** | **36/36** |

The review loop could not improve code that was already correct. This suggests that sparring is better understood not as a tool that always makes code better, but as a safety net that activates when the author makes a mistake.

Next, I planted one plausible mistake in each of the duration parser, pagination, and LRU cache tasks.

| Task | Planted bug | No review | Claude–Codex | Claude–Claude |
|---|---|---:|---:|---:|
| Duration parser | Matches only part of the string instead of the entire input | 10/12 | **12/12** | **12/12** |
| Pagination | Off-by-one error in a 1-based page index | 4/8 | **8/8** | **8/8** |
| LRU cache | `get` does not update recency | 3/4 | **4/4** | **4/4** |
| **Total** | | **17/24 (71%)** | **24/24 (100%)** | **24/24 (100%)** |

Both reviewers found all three defects precisely, and one review→fix pass improved the score from 71% to 100%.
For these clear specification violations, there was no difference between the cross-model and same-family results.

However, these numbers need to be treated carefully.

- There are only three to four tasks and a single trial.
- The bugs were deliberately planted rather than naturally occurring.
- The tasks are small and have clear requirements.
- The author is Sonnet; a stronger author may be less likely to make an initial mistake.
- A reviewer cannot catch requirements it was never given.
- The benchmark does not yet contain subtle cases that reveal vendor-specific blind spots.

Therefore, **71% → 100% is not a general performance improvement rate.** The current benchmark supports only a narrow conclusion: when defects that clearly violated the stated requirements were present, the enforced blind review loop found and fixed all three in this small sample.

---

## What's Next

According to the [roadmap](https://github.com/wnjoon/sparring#roadmap), the next priority is Phase 4's final sweep.
When a task touches risky areas such as authentication, database migrations, CI, or hooks—or when review lasts at least three rounds or produces a design finding—a fresh blind sweeper will review it once more after convergence.
For small changes, the plan is to allow the review loop to be skipped selectively only when both the size and the type of files indicate low risk.

I plan to preserve and gradually strengthen the following principles throughout development.

- Even a reviewer from another vendor can be pulled into the debate if it receives the author's explanation.
- Even within the same model family, a fresh process that does not see the session history and re-reads the full change can still provide an independent safety net.
- The reviewer must remain read-only so that authorship and judgment do not blur together.
- The round cap must prevent infinite loops, not masquerade as a quality guarantee.
- A reviewer's `CONVERGED` is not proof of objective correctness. A stateless reviewer can still miss a previous defect by chance.

After that, I plan to work through the following items in sequence.

- In unattended mode, continue mechanical fixes while carrying unresolved design decisions honestly into the next session
- Produce a final audit report that distinguishes `converged`, `cap`, `error-bypass`, `cancelled`, `skipped`, and other exit reasons
- Build a mirror adapter in which Codex is the author and Claude is the reviewer
- Configure reviewer reasoning effort and writer tier according to diff size
- Extend the benchmark with multi-file, stateful, and concurrent tasks
- Increase the number of trials so that natural bugs and vendor-specific blind spots can be measured
- Replace manual benchmark orchestration with a reproducible runner

Once all planned features are implemented, I will reconcile `dev` with the actual policy documents and use the merge to `main`, tagging, a GitHub release, and remote installation verification as the release gate.

---

## References

- [claude-review-loop](https://github.com/hamelsmu/claude-review-loop)
- [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols)
