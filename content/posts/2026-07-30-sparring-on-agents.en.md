---
title: "Keeping Agents from Grading Their Own Code: sparring"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-30"
slug: "sparring-on-agents"
summary: "AI coding agents are good at writing code, but they often miss defects in their own work. This post explains how sparring uses a Stop hook based review loop to separate the author from the reviewer and make review a condition for stopping, not a polite request."
description: "A plain-language explanation of how sparring handles the self-review problem in AI coding agents through Stop hooks, independent reviewers, review rounds, deadlock handling, planning, and safety boundaries."
toc: true
readTime: true
autonumber: false
math: false
tags: ["dev", "AI", "Claude Code", "Codex", "ai-agent", "code-review", "orchestration", "sparring", "2026"]
keywords: ["AI", "Claude Code", "Codex", "AI agent", "code review", "review loop", "sparring", "Stop hook", "self-review"]
showTags: true
hideBackToTop: false
draft: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Keeping Agents from Grading Their Own Code"
  "description": "A plain-language explanation of how sparring handles the self-review problem in AI coding agents through Stop hooks, independent reviewers, review rounds, deadlock handling, planning, and safety boundaries."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## Agents Often Do Not Know What They Got Wrong

These days, I ask AI to write code far more often than I open an IDE and write everything myself. To be honest, I am not really hand-coding as much anymore.

After using AI coding agents for a few days, one pattern becomes obvious. They are quite good at writing code. They are much worse at noticing what they got wrong.

The fastest and most natural response is to ask the agent for a review.

```text
Review the code you just wrote.
```

But when the same session reviews its own work, one of two things often happens.

1. It becomes too generous toward its own result.
2. It keeps the same blind spot that created the bug in the first place.

In the second case, asking it to look again does not help much. What it failed to see the first time often remains invisible the second time.

**sparring** is designed to handle this problem at the harness layer, not at the prompt layer.

- Separate the author model and the reviewer model.
- Treat review as a stopping condition, not a request.

So when the agent says "I am done" and tries to end the session, the hook stops it.

---

## Where the Stop Is Enforced

Claude Code has a `Stop` hook. It is a script that runs when the agent is about to end its turn. Depending on the JSON returned by the hook, the session either ends or continues.

```bash
approve() { printf '{}\n'; exit 0; }
block() {   # $1=reason passed back to the model  $2=status bar message
  jq -nc --arg r "$1" --arg s "${2:-sparring}" \
    '{decision:"block", reason:$r, systemMessage:$s}'
  exit 0
}
```

In simple terms:

1. If the hook returns `block`, the `reason` becomes a new instruction to the model.
2. The hook keeps returning `block` until the reviewer declares convergence.

The author has no direct way to bypass this loop. This is different from writing "please make sure to get a review" in a prompt. The rule no longer depends on whether the model remembers or decides to follow it.

An empty object `{}` means approval. This detail matters because explicitly returning `decision: "approve"` was rejected by the Codex hook wiring. The one response shape that both harnesses treated as "continue normally" was the empty object, so that became the approval path.

> In Codex 0.144.1, returning `decision: "approve"` caused an "invalid stop hook JSON output" error and prevented a converged run from being released.

If the hook itself crashes, it approves by default. Missing one review is bad, but trapping the user in a broken session is worse. The gatekeeper should fail open.

---

## How One Round Works

The command `/spar:fight <task>` means "make this change through the sparring review loop." It first writes a state file.

```text
---
active: true
phase: task
round: 0
review_id: 20260730-104512-9ac31f
base_sha: 4f2a1c...          # fixed baseline for the whole loop
reviewer: codex
max_rounds: 5
---
Fix the pagination offset bug described in the spec
```

Then the agent writes code as usual. When it believes the work is done and tries to stop, the hook runs.

```text
[Implementation]  The author writes code and tries to stop
   |
   v
Stop hook -- 10 lines or fewer + 2 paths or fewer + no risky path? --> skipped (recorded)
   |
   v
[Round N]  A read-only reviewer checks the diff and the requirement
   |- STATUS: FINDINGS
   |    |- [MECHANICAL] -> fix immediately, no need to ask the user
   |    |- [DESIGN]     -> debate first, then ask the user if it cannot be resolved
   |    |- deadlock, meaning the same finding is raised and rejected for 2 rounds
   |    |    |- factual issue -> blind judge
   |    |    `- design issue -> user gate + decision ledger
   |    `- write responses for each finding -> round N+1
   `- STATUS: CONVERGED -> optional final sweep -> stop
```

For each round, the hook creates a reviewer runner script on the spot. The script depends on which reviewer family is being used.

```bash
# Codex reviewer
codex exec --sandbox read-only --skip-git-repo-check \
  --output-last-message "$tmp" < "$prompt"

# Claude reviewer, used in single-vendor mode
{ cat "$prompt"; echo '--- Changes under review ---'; cat "$diff"; } \
  | claude -p --safe-mode --tools Read Grep Glob > "$tmp"
```

In both cases, the reviewer has no write permission. A Codex reviewer inspects the diff in a read-only sandbox. A Claude reviewer receives the diff through the prompt and can only use read-oriented tools such as `Read`, `Grep`, and `Glob`. Only the author can modify code.

The reviewer output follows a strict format because the hook parses that text to decide what happens next.

- The first line must be `STATUS: CONVERGED` or `STATUS: FINDINGS`.
- Each finding must include a heading such as `### F3-2 [MECHANICAL] Offset is calculated as zero-based`, followed by the file, the problem, and the suggested fix.

If there are findings, the author must respond to all of them. Items marked `[MECHANICAL]` should be fixed. If the author rejects a finding, the rejection must be based on code or requirements. "I do not like this suggestion" is not enough. The author also writes a response file for each finding ID.

```text
### F3-1: FIXED — changed offset to (page-1)*size and added two boundary tests
### F3-2: REJECTED — this path is explicitly 1-based in section 4 of the spec
```

If the response file is missing, or if any finding remains unanswered, the hook returns `block` again. The next round starts only after the responses are written.

---

## Preventing Persuasion from Winning

When a review loop runs for multiple rounds, the failure mode is not only "the reviewer missed a bug." Another dangerous failure mode is that the author persuades the reviewer to let the work pass.

If the more confident side wins the argument, the loop stops being a quality mechanism and becomes a debate. The louder explanation wins.

sparring avoids this structurally.

- **The reviewer is not told what the author claims to have fixed.** Each round is a fresh review against the fixed baseline. Sentences like "I already addressed last round's feedback" do not cross into the next reviewer prompt. The reviewer sees the code and requirement again, as if for the first time.
- **If the same finding appears for two rounds and keeps being rejected, it becomes a deadlock.** A factual issue marked `[MECHANICAL]` goes to a blind judge. The judge sees only the code and that finding, not the previous debate. If the result is `RULING: UPHELD`, the author must fix it. If the result is `DISMISSED`, the finding is dropped. The point is to keep the judge from being influenced by who argued better.
- **Design decisions go to the user.** A judge should not decide between two valid product or design choices. If only parked design issues remain, the hook opens a user gate and asks the unresolved questions together. The answer is recorded in `.claude/spar-ledger.md` and later injected as an already-decided design decision, so the same issue does not keep returning.
- **Repeated findings with different wording are grouped together.** A finding is identified by a fingerprint built from the file name and normalized title. If a new fingerprint appears in a file that already has a tracked finding, a blind matcher checks whether they are really the same defect. If they are, the new finding becomes an alias of the original, and the deadlock count continues from there.

---

## What Happens If Five Rounds Are Not Enough

Some issues do not resolve quickly. If the loop can continue forever, the agents may spend all their time arguing.

To prevent that, sparring has a cap. At first, I thought a simple maximum of five rounds would be enough. Later, I realized that round count alone cannot tell the difference between a productive review and a stuck debate.

So the cap became two-stage.

1. **Soft cap, default 5 rounds.** If the previous rounds were productive but not yet fully verified, the loop can continue until the hard cap, usually twice the soft cap. A round is considered productive only under strict conditions: every finding was clearly answered as `FIXED`, there were no rejections, unanswered items, vague answers, pending judge rulings, parked design findings, or repeated findings from earlier rounds.
2. **No extension if the same issue returns.** If the same finding appears again, the fix probably did not solve the problem. That is not progress. Even one repeated finding blocks extension.

The rule is intentionally strict. It is easier to loosen a strict rule later than to spend too much time in expensive loops from the beginning.

There is also one more layer after convergence.

If the task touched a risky path, took three or more rounds, or had any design finding, sparring runs a final sweep. A fresh instance from the author side reads the snapshot without knowing the loop history and does a last check.

The sweep uses its own status words:

```text
SWEEP: CLEAN
SWEEP: FINDINGS
```

It does not use the reviewer's `STATUS: CONVERGED`. Anything outside the actual review loop should not be mistaken for convergence.

---

## Making It Work from Codex Too

Codex CLI also has a `Stop` hook and respects `decision: block`. That means the same structure can run in the opposite direction.

Codex can write the code, `claude -p` can review it, and the same gatekeeper script can prevent the session from ending. A single policy document becomes the source of truth, and the user can choose which agent sits in the author seat.

The important rule remains the same: only the author writes code. The author never decides whether the work has converged. The hook enforces the process, and the prompt is not treated as the safety mechanism. Judges and sweepers are kept blind to the debate.

---

## Planning Before the Fight

Many tasks do not fit into a single step. So sparring adds a planning layer above the code review loop.

```text
/spar:ready <spec>
```

This command turns the spec into a checkbox plan and prepares a dedicated branch.

```text
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

Then `/spar:fight` runs the plan one task at a time. When a task converges, sparring checks the box and commits the result. The next task starts only if the previous task left a converged result file. If a task does not converge, the loop stops immediately. It does not quietly move on.

The plan itself is reviewed once before coding starts. The reviewer checks whether the plan's claims about the code are correct, whether each step is actionable, and whether the plan covers the spec. The result is written as:

```text
PLAN-REVIEW: CLEAN
PLAN-REVIEW: FINDINGS
```

It does not use `STATUS:` for the same reason the final sweep does not use it. Convergence is a word reserved for the review loop.

Before `/spar:fight` can start executing a prepared plan, every plan-review item must be dispositioned. The disposition can be accepted, or it can be rejected with a reason grounded in the plan, spec, or code. A well-supported rejection still clears the item. The plan is reviewed only once because there is no testable implementation yet for the plan to converge on.

---

## Did It Actually Help?

I ran a small benchmark. I prepared three example coding tasks and inserted a plausible bug into each one. Then I compared the score without review and the score after one review loop, using a hidden oracle.

- Without review: 17 out of 24 points, or 71%
- After the review loop: 24 out of 24 points

The result was the same in cross-vendor mode and same-vendor mode. Both reviewers named the planted defects accurately.

This should not be overclaimed. It is an example, not a statistical study. The tasks were small, and the specs were clear. Still, it showed the thing I cared about: an independent review loop can catch defects that the author missed.

---

## What I Learned from Building It as a Hook

The biggest lesson was that "asking the model to follow a rule" and "making the system enforce the rule" are completely different.

If the prompt says "do not finish without review," the model is still responsible for following that rule. If the Stop hook enforces it, the session cannot end before the review is done, even if the model says it is finished. The rule moves from words into structure.

That also means there are more things to protect.

- Review results and judge rulings must not be editable or deletable by the author. If you can rewrite the paper that graded you, it is not a real grade. So review results have to be stored safely, and concurrent processes must be kept from writing the same file at the same time.
- The information shown to the reviewer has to be controlled. If the reviewer keeps seeing the author's explanations such as "I fixed this" or "the reviewer was wrong," the next review may be influenced by the debate rather than the code. So the reviewer is made to look at the code and requirement again, and the author's response files are hidden from the reviewer.
- There are still limits. The hook can check whether the author wrote "fixed." It cannot know whether the fix is actually correct. The next review round has to verify that.

The boundary in sparring can be summarized like this.

```text
Things the system can forcibly prevent
    -> finishing without review
    -> moving to the next round without responses
    -> giving the reviewer write permission

Things repeated review has to verify
    -> whether the fix is actually correct
    -> whether a new bug was introduced
    -> whether the design judgment is sound
```

Separating those two categories was the most important part of building a review loop with hooks.

You can install it as a plugin for each agent. It requires `jq`. If Codex CLI is available, Claude and Codex can be split into cross-review roles. If Codex CLI is not available, Claude can act as the reviewer by itself. The reverse direction is also possible.

```text
claude plugin marketplace add wnjoon/sparring
claude plugin install spar@sparring
```

---

## References

- [hamelsmu/claude-review-loop](https://github.com/hamelsmu/claude-review-loop)
- [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols)
