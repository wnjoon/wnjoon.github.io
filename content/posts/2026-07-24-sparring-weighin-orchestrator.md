---
title: "Putting Plan Execution on Top of the Review Loop: Building sparring 0.4.0"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-24"
slug: "sparring-weighin-orchestrator"
summary: "As sparring went from v0.2.0 to v0.4.0, it gained a risk-triggered final sweep and safe skips (Phase 4), and /spar-weighin (Phase 8): an orchestrator that runs a checkbox plan through the review loop task by task. This post covers the new features and the issues I hit while building them — an unreliable Stop hook ordering, a critical defect the cross-model review caught, and a worktree isolation bug — along with how each was resolved."
description: "The new features in sparring 0.4.0 (Phase 4 final sweep/skip, the Phase 8 /spar-weighin orchestrator) and the issues encountered while building them with sparring's own methodology, with the resolutions."
toc: true
readTime: true
autonumber: false
math: false
tags: ["dev", "AI", "Claude Code", "Codex", "ai-agent", "code-review", "orchestration", "sparring", "2026"]
keywords: ["AI", "Claude Code", "Codex", "AI agent", "code review", "review loop", "sparring", "orchestrator", "weighin"]
showTags: true
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Putting Plan Execution on Top of the Review Loop: Building sparring 0.4.0"
  "description": "The new features in sparring 0.4.0 (Phase 4 final sweep/skip, the Phase 8 /spar-weighin orchestrator) and the issues encountered while building them with sparring's own methodology, with the resolutions."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## What Changed Since the Last Post

![sparring](https://raw.githubusercontent.com/wnjoon/sparring/dev/image/main.png)

In the [previous post](/posts/sparring-cross-model-code-review-loop) I covered the background of sparring — making an independent reviewer keep reviewing AI-written code until it declares `CONVERGED` — and the implementation through Phases 1–3 (v0.2.0).

Two more steps have landed since then.

- **Phase 4 (v0.3.0)**: a risk-triggered final sweep, a safe skip for small changes, and change-scoped design-intent hints.
- **Phase 8 (v0.4.0)**: `/spar-weighin`, an orchestrator that runs a checkbox plan through the review loop.

This post covers the **features added** in these two steps and, in particular, the **problems I hit and how I resolved them** while building `/spar-weighin`. One thing worth noting up front: I built this feature using the very workflow sparring is meant to enforce (brainstorm → plan → subagent implementation → cross-model review → release), and in the process the review loop caught a genuinely critical defect.

---

## Phase 4 — Safe Skips and a Risk-Triggered Final Sweep (v0.3.0)

Phase 4 was about reducing both the loop's waste and its blind spots at the same time.

- **Safe skip**: only when a change is small enough (roughly 10 lines / 2 paths or fewer) and touches no risky path or risky change kind (rename/delete/mode/binary/symlink, etc.) does the loop skip review — and it reports that it did. It never skips on size alone; it weighs the kind and risk of the change too.
- **Design-intent hints**: each round hands the reviewer the repository's own rules and rationale scoped to the changed surface (`.claude/rules`, rationale in ancestor `CLAUDE.md`/`AGENTS.md`, comments adjacent to the change). These hints explain intent but never excuse a defect.
- **Risk-triggered final sweep**: work that touched a risky path/repository, ran three or more review rounds, or produced a design finding gets one more pass — a **fresh blind sweeper** re-checks the whole change after the reviewer converges. The sweeper never sees the debate, only the code and the requirements.
- **Honest exit reasons**: every terminal path writes an immutable result to a file — `converged`, `cap`, `skipped`, `sweep-findings-at-cap`, and so on. Only `converged` means "the review passed."

---

## Phase 8 — /spar-weighin: Running a Plan Through the Review Loop (v0.4.0)

The existing `/spar` is a single cycle: implement one task, then review until the reviewer declares convergence. But real work usually breaks into several steps. I kept stitching together the same sequence by hand — plan, isolate a workspace, implement step by step — and the final implementation step often ended as a **self-review**, where the model that wrote the code judged its own work. That is exactly the failure sparring was built to remove.

`/spar-weighin` folds this into one command. The name comes from a pre-fight weigh-in: get ready and step into the ring before the sparring starts.

```text
/spar-weighin <spec>
      ↓
create a dedicated branch + init state
      ↓
write the plan (writing-plans) → a checkbox task list
      ↓
run Task 1 through the /spar loop
      ├─ converged → check the boxes + commit → next task
      └─ not converged (cap, etc.) → stop honestly
      ↓
all tasks converged → done
```

Its key traits:

- **Choice of granularity**: by default each task in the plan runs through the loop on its own, so every task is reviewed as a small diff. Pass `--whole` to run the entire plan as one task.
- **The plan is the progress board**: whenever a task converges, its `- [ ]` boxes become `- [x]` and get committed. The plan document doubles as a live progress tracker.
- **Honest termination**: if a task fails to converge within the round cap, the loop does not move on to the next task — it stops there and reports. It follows sparring's rule of never wrapping up a task with a self-review.

Reviewer selection (codex/claude) is passed through exactly as in `/spar`.

---

## Problems I Hit and How I Resolved Them

The real story of this feature is here. There were three problems, and one of them was caught by sparring's own review loop.

### 1. I couldn't trust the order Stop hooks run in

The first design registered a second Stop hook for `/spar-weighin` that would run after `/spar`'s existing hook: when a task converged, the existing hook would clean up state, and then the new hook would take over and move to the next task.

It turned out Claude Code does **not guarantee the execution order** of multiple registered Stop hooks. They may run in parallel, and there is no documented guarantee that one hook observes a file another hook deleted. The whole premise — "the existing hook cleans up first, then the new hook takes over" — did not hold.

**The fix** was to not split the hook in two. I register a single Stop hook and, inside it, call `/spar`'s existing hook **as a subroutine in the same process**, capture its decision, and only override that decision when a weigh-in is active and `/spar` has released the session. Because it is sequential execution within one process, ordering and side effects are fully guaranteed. `/spar`'s own hook code is untouched, and when no weigh-in is active the dispatcher passes `/spar`'s decision straight through — so **users who only use `/spar` are entirely unaffected.**

### 2. A critical defect the cross-model review caught

The heart of this orchestrator is the "advance to the next task on convergence" step. There, I was saving two values in the state file — the current task number and the current review ID — in **two separate writes.**

An adversarial review (an independent pass run on a different model) flagged this. If the process dies **between** the two writes (a hook timeout, say), you're left with "the current task number has advanced, but the review ID is still the old, already-consumed value." The consumed outcome file is still present, so the next invocation could **mark a task that was never implemented or reviewed as done, and commit it.** In the worst case it could **falsely declare the entire plan converged.**

**The fix** was to make the two values change in a **single atomic write** — one `awk` pass into a temp file, then a `mv` to swap it in — so the intermediate "advanced number, stale ID" state is simply unreachable. A follow-up review confirmed both crash windows are safe (either the same task is reprocessed idempotently, or the loop halts safely), and I added a regression test that reproduces the scenario.

This defect matters because, had it slipped through, it could have produced **code that claims to be done but was never actually built** — precisely the failure mode sparring exists to prevent. And what caught it was not the authoring model itself but an **independent, cross-model review.**

### 3. A worktree left the state file in the wrong place

I initially tried to isolate the work in a separate git worktree. But if the command **writes the state file first** and then creates the worktree, the working directory switches to the worktree while the state file and plan stay in the original folder. The hook looks for the state file relative to the new directory, doesn't find it, and the loop never advances.

**The fix** was to use a **dedicated branch in the current directory** (`weighin/<slug>-<timestamp>`) instead of a separate worktree. The working directory never changes, so every state path the hook reads stays valid. `/spar` already isolates the review scope via the baseline diff, and this repository already works in per-task branches, so it fit naturally.

### A tool building itself with its own methodology

All three problems surfaced inside the same flow: agree on a plan as a document first → split it into small tasks a subagent implements → verify each task with an independent review → review the whole branch once more at the end. In particular, defect #2 — which several same-family reviews might have missed — was caught by an independent review set up adversarially. The hypothesis from the last post ("an independent blind review acts as a safety net") got confirmed once more, this time by building the tool itself.

---

## Tests and Current State

As of July 24, 2026, Phases 4 and 8 are implemented and the plugin is at [v0.4.0](https://github.com/wnjoon/sparring/releases/tag/v0.4.0).

- Pure-bash test suites: **13 suites, 307 assertions, all passing.**
- Of those, the existing Stop hook suite still passes **all 180 assertions** — confirming that `/spar`'s standalone behavior is fully preserved through the new dispatcher.
- The `/spar-weighin` state transitions (pass / advance / finish / honest stop) and fail-open behavior (an internal error never loses `/spar`'s decision) are each covered by tests.

Since `/spar-weighin` is a new command, I bumped the minor version and released v0.4.0, using the `dev → main` merge and tag as the release gate.

---

## What is Next

By the [roadmap](https://github.com/wnjoon/sparring#roadmap), the remaining steps are:

- **Phase 5**: unattended mode, and a final report summarizing a completed run.
- **Phase 6**: a mirror adapter where Codex authors and Claude reviews.
- **Phase 7**: model economics, such as reviewer reasoning effort tied to diff size and a lower-cost fix writer.

The principles I'm holding throughout stay the same: let the state machine and file structure enforce the rules rather than asking the model to remember them; let only an independent reviewer — never the author — decide completion; and always record the exit reason honestly. `/spar-weighin` was an attempt to widen that discipline from "a single task" to "a whole multi-step piece of work."

---

## References

- [sparring repository](https://github.com/wnjoon/sparring)
- [Previous post: Making Another AI Review AI-Written Code Until It Converges](/posts/sparring-cross-model-code-review-loop)
- [claude-review-loop](https://github.com/hamelsmu/claude-review-loop)
- [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols)
