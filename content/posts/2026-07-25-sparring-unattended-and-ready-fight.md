---
title: "Stopping Honestly When No One Is Watching: sparring v0.5.0"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-25"
slug: "sparring-unattended-and-ready-fight"
summary: "sparring v0.5.0 adds an unattended mode that preserves unresolved design decisions and stops honestly when the user is away. This post also covers why I split planning and execution into /spar:ready and /spar:fight, the defects cross-model review found in the persistent queue, and how the tool hit its own circuit breaker before converging on a retry."
description: "A look at sparring v0.5.0: unattended mode, the new /spar:ready and /spar:fight commands, and the cross-model review process that hardened its persistent decision queue."
toc: true
readTime: true
autonumber: false
math: false
tags: ["dev", "AI", "Claude Code", "Codex", "ai-agent", "code-review", "orchestration", "sparring", "2026"]
keywords: ["AI", "Claude Code", "Codex", "AI agent", "code review", "review loop", "sparring", "unattended", "ready", "fight"]
showTags: true
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "Stopping Honestly When No One Is Watching: sparring v0.5.0"
  "description": "A look at sparring v0.5.0: unattended mode, the new /spar:ready and /spar:fight commands, and the cross-model review process that hardened its persistent decision queue."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## How Should an Agent Stop When No One Is Watching?

![sparring](https://raw.githubusercontent.com/wnjoon/sparring/dev/image/main.png)

In the [previous post](/posts/sparring-weighin-orchestrator), I introduced `/spar-weighin`, an orchestrator that runs a multi-step plan through independent review loops. It breaks a plan into tasks and advances only after each task has converged.

One part of that flow still required a person, however: the **design gate**. When reviewers could not resolve a design question, the loop stopped and waited for the user to decide. That is the right behavior while someone is watching, but it leaves a scheduled or long-running session hanging indefinitely when the user is away.

v0.5.0 addresses that problem and reorganizes the command surface at the same time.

- **Unattended mode** preserves unresolved design decisions and ends the session without inventing completion.
- **`/spar:ready` and `/spar:fight`** separate planning from execution, which had previously been bundled into one command.

Both changes point in the same direction. Running an automation longer matters less than leaving an honest record of **how far it got and why it stopped**.

---

## Unattended Mode: Defer the Decision, Release the Session

When a `[DESIGN]` finding remains unresolved for two consecutive rounds, sparring marks it as `parked`. Previously, the loop would wait at that point for the user to respond.

With `--unattended`, it follows a different exit path:

```text
unresolved design finding
        ↓
persist to reviews/spar-pending.md
        ↓
record blocked-pending-user
        ↓
attempt report → clean up state → end session
```

Mechanically fixable issues still proceed as before. Only design stalemates that remain at the end are treated as **essential decisions** that require human judgment.

Pending items are stored in `reviews/spar-pending.md`, outside the state that normal cleanup removes. If the same issue appears across multiple runs, sparring merges and deduplicates it using the review ID and a fingerprint of the finding. On the next session start, a SessionStart hook quietly reports how many design decisions are waiting.

The most important detail is the terminal state. A task that could not proceed without a person is never recorded as `converged`. It ends as `blocked-pending-user`, and the decision carries over to a future session.

In other words, unattended mode is not about **impersonating the user**. It is about **stopping safely without losing the exact point where the user is needed**.

The mode is enabled only through an explicit `--unattended` flag. sparring does not infer it from a pipe or a CI environment. Whether the user is present is not something the tool should guess.

---

## Separating Planning from Execution: `/spar:ready` and `/spar:fight`

The name `/spar-weighin` came from the pre-fight weigh-in. In practice, however, the command did much more than prepare for a fight: it created a plan and then immediately executed every task. The name described preparation, while the behavior went all the way through execution.

That mismatch was inconvenient in use as well. There was no natural point to read and revise the plan before implementation began. I therefore split the command into separate planning and execution steps.

| Command | Role |
|---|---|
| `/spar:ready <spec>` | Turn the spec into a checkbox plan, put it on a dedicated branch, and stop. |
| `/spar:fight` | Execute the prepared plan one task at a time. If no plan exists, run a single task supplied as an argument. |
| `/spar:cancel` | Cancel the active run. |

The new flow is straightforward:

```text
/spar:ready <spec>
        ↓
review and edit the plan
        ↓
/spar:fight
```

Because `ready` stops after planning, there is now a natural checkpoint where I can inspect and adjust the plan. Once it looks right, I start execution with `fight`.

I also added one safety rule: if a prepared plan already exists, `/spar:fight` rejects a separate one-line task passed at the same time. This prevents an accidental side task from overriding or bypassing the plan already in progress.

The internal vocabulary now uses `ready`, `fight`, and `plan` consistently as well. The boxing metaphor remains, but the commands I type every day now describe their behavior directly.

---

## How Cross-Model Review Hardened the Persistent Queue

The purpose of unattended mode is to keep unresolved decisions from disappearing between sessions. That makes the persistent queue part of the feature's trust boundary, not a minor convenience.

An independent reviewer found a different real defect in it on nearly every round.

### 1. A Header-Only Entry Could Be Mistaken for a Duplicate

The first implementation appended the heading and body separately. If writing the body failed after the heading succeeded, the queue was left with a heading and no content. A retry would see the heading, assume the item was already present, and permanently skip the missing body.

The fix was to construct the complete queue in a temporary file and then replace the original with `mv`. If a write fails midway, the previous queue remains intact.

### 2. The Symlink Check Happened at the Wrong Time

The queue path was checked for symlinks, but the check ran before waiting for the lock. That left a race: while the process waited, the queue could be replaced with a symlink and bypass the earlier validation.

I also reproduced a particularly dangerous case. If the destination passed to `mv` is a symlink to an external directory, `mv` can place the file inside that external directory and still return success. I moved the check to after lock acquisition and added another validation immediately before replacement.

### 3. A Path Could Be Parsed as a Command-Line Option

A path beginning with `-` could be interpreted as an option by commands such as `cat` or `mv`, rather than as a filename. I changed the calls to separate paths unambiguously from command options.

These were not production incidents discovered after release. Independent cross-model review found them while following the real execution paths before v0.5.0 shipped.

---

## The Tool Hit Its Own Circuit Breaker

The first implementation of the persistent queue reached the five-round review cap and ended as **not converged**.

This was not because an unfixable defect remained. The reviewer kept finding a new issue in each round, and after the fifth fix there was no round left to verify it.

sparring did not call the work complete. The round cap is not a mechanism that passes a task after enough attempts; it is a circuit breaker that prevents an endless fix-and-review loop. Reaching the cap always means the run did not converge.

I read the exit reason and retried with all five rounds of fixes as the new baseline. The major defects were already gone, so the second run converged within one or two rounds.

The experience also clarified when a retry is appropriate.

- If each round found a different concrete defect and every one was fixed, the problem may simply be that the run ran out of review rounds.
- If the same issue keeps returning, or the current approach cannot resolve it in principle, another retry is the wrong response; the design or implementation strategy needs to change.

A non-converged result is not a failure state to hide. It is a signal to **read the cause before deciding what to do next**.

---

## Why I Did Not Use sparring for the Rename Refactor

Splitting `/spar-weighin` into `/spar:ready` and `/spar:fight` also meant renaming and changing the roles of hook scripts such as `stop-weighin.sh` and `spar-weighin-launch.sh`.

The problem is that sparring itself runs on those hooks. Whenever the authoring agent tries to stop, the hooks inspect the current task state and decide whether to advance. If the active loop renames its own hooks, the next stop may try to invoke a file that no longer exists.

It is like replacing a car's engine while the car is still moving.

Phase 5 could be built with sparring because it mostly added a new path without removing the existing one. This refactor was different: it deleted and renamed the very path that kept the loop running. The self-modification risk was much higher.

I used ordinary TDD instead.

1. Update or add tests for the intended behavior.
2. Refactor the scripts and commands incrementally.
3. Run the full test suite after each step.
4. Reproduce the complete `ready → inspect plan → fight → advance task` handoff in a temporary repository.

Applying a tool's own methodology to the tool itself is not automatically the safest choice. When the subject under test is the execution machinery of the test workflow, an independent test harness is the better safety net.

---

## Tests and Current State

Phase 5 and the command reorganization are included in [v0.5.0](https://github.com/wnjoon/sparring/releases/tag/v0.5.0).

- **387 assertions** pass across 16 pure-bash test suites.
- The core stop-hook suite passes **195 assertions**.
- Existing attended behavior remains intact after adding the unattended exit path.
- A grep check confirms that no `weighin`, `wgn`, or `worktree:` tokens remain in the plugin or tests after the rename.

The final report generator, `spar-report.sh`, requires a separate design and is not part of this release. The unattended exit path already contains a fail-open call site for it, however. If the generator is missing or fails, it cannot interfere with the original exit and cleanup behavior.

The plugin must be reinstalled at v0.5.0 to use the new commands because the installed plugin cache is a separate copy from the repository.

---

## What Is Next

According to the [roadmap](https://github.com/wnjoon/sparring#roadmap), the remaining work is:

- **Remaining Phase 5 work**: a final report generator (`/spar-report`) that summarizes completed runs
- **Phase 6**: a mirror adapter where Codex authors and Claude reviews
- **Phase 7**: model economics, including reviewer reasoning effort based on diff size and a lower-cost fix writer

sparring's principles remain the same:

- Let the state machine and file structure enforce the rules instead of asking the model to remember them.
- Let an independent reviewer, never the author, decide whether the work is complete.
- If the loop does not converge, preserve the reason rather than hiding it.

v0.5.0 extends those principles to sessions where no one is watching. Even in unattended execution, sparring does not invent completion. It preserves decisions that require a person and carries them into the next session.

At the same time, the command surface now matches the work more closely: use `ready` to make the plan, inspect it, and then use `fight` to execute it.

Running longer without supervision is useful. Knowing when to stop honestly is more important.

---

## References

- [sparring repository](https://github.com/wnjoon/sparring)
- [Previous post: Putting Plan Execution on Top of the Review Loop (v0.4.0)](/posts/sparring-weighin-orchestrator)
- [Previous post: Making Another AI Review AI-Written Code Until It Converges](/posts/sparring-cross-model-code-review-loop)
