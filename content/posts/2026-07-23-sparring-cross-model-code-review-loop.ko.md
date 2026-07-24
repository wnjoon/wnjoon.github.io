---
title: "AI가 작성한 코드를 다른 AI가 끝까지 검토하게 만들기: sparring 개발기"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-23"
slug: "sparring-cross-model-code-review-loop"
summary: "Claude Code가 작성한 코드를 Codex 또는 독립된 Claude가 검토하고, reviewer가 수렴을 선언할 때까지 수정과 재검토를 강제하는 sparring을 만들었다. 개발 계기부터 설계 원칙, Phase 1~3 구현 과정, 작은 효과 벤치마크와 앞으로의 계획을 정리한다."
description: "Claude Code의 Stop hook과 읽기 전용 reviewer를 이용해 AI 코드 작성과 완료 판정을 분리한 sparring의 개발 배경, 참고 프로젝트, 설계, 구현 현황, 벤치마크 및 향후 계획을 소개한다."
toc: true
readTime: true
autonumber: false
math: false
tags: ["dev", "AI", "Claude Code", "Codex", "ai-agent", "code-review", "sparring", "2026"]
keywords: ["AI", "Claude Code", "Codex", "AI agent", "code review", "review loop", "sparring"]
showTags: true
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "AI가 작성한 코드를 다른 AI가 끝까지 검토하게 만들기: sparring 개발기"
  "description": "Claude Code의 Stop hook과 읽기 전용 reviewer를 이용해 AI 코드 작성과 완료 판정을 분리한 sparring의 개발 배경, 참고 프로젝트, 설계, 구현 현황, 벤치마크 및 향후 계획을 소개한다."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## 개발하게 된 계기

![sparring](https://raw.githubusercontent.com/wnjoon/sparring/dev/image/main.png)

AI 코딩 에이전트를 사용하면서 코드 작성 속도는 눈에 띄게 빨라졌습니다. 그런데 작업이 빨리 끝나는 것과, 올바르게 끝나는 것은 다른 문제였습니다. 
특히 에이전트에게 구현을 맡긴 뒤 같은 에이전트에게 다시 검토를 요청하면, 자신이 방금 선택한 구조와 논리를 그대로 공유하기 때문에 놓친 문제를 반복해서 놓치는 경우가 있었습니다. 

AI가 만든 코드를 검토하는 가장 단순한 방법은 같은 세션에 "다시 확인해줘"라고 요청하는 것입니다. 저도 오랫동안 이 방식을 사용했는데요, 하지만 이 방식에는 몇 가지 약점이 있었습니다.

- 리뷰 실행 여부가 사용자의 기억과 프롬프트에 의존합니다.
- 작성자와 reviewer가 같은 대화 문맥과 선입견을 공유합니다.
- 첫 리뷰에서 문제를 수정해도, 그 수정 자체가 다시 검토된다는 보장이 없습니다.
- 작성자가 reviewer의 지적을 받아들이지 않고도 작업을 끝낼 수 있습니다.
- 설계상 이견과 실제 버그가 섞이면 누가 맞는지보다 누가 더 자신 있게 설명하는지가 결론에 영향을 줄 수 있습니다.

그래서 처음에는 교차 검증(parallel-verify)을 위한 별도의 스킬을 만들어서 Claude ↔ Codex 중 한곳에서 코드를 작성하면 교차 검증을 따로 요청해서 상대 에이전트가 작성한 코드를 검증하도록 했습니다.
하지만 이 스킬은 **상대 에이전트가 작성한 코드의 잘못된 점을 꼬집어 내는 역할** 에만 그칠 뿐, 실제로 작업까지 해주지는 못했습니다. 
엄밀히 말하면 작업하지 않도록 설계한 것이 맞습니다. 최종적인 결과에는 사용자의 검증이 꼭 필요하다고 판단했기 때문인데, 점점 시간이 갈수록 **여러번의 교차 검증 이후에 각 에이전트가 서로 합의한 내용에 대해서는 언제나 동의** 하는 저의 모습을 보면서 최종적으로는 서로 합의하고 개발까지 완료하는 스킬을 만들어야겠다는 생각이 들게 되었습니다.

그래서 sparring에서는 "리뷰를 잘하라"는 프롬프트보다 리뷰를 꼭 하는 구조를 만들기로 했습니다. Claude Code가 작업을 끝내려 할 때 `Stop hook`이 종료를 멈추고, 독립된 reviewer의 검토 결과가 나오기 전에는 다음 단계로 넘어가지 못하게 했습니다.

여기서 reviewer의 역할은 **작성한 모델이 자기 작업의 완료 여부까지 판정하지 않도록** 하기 위해 존재합니다. 예시로 Claude Code가 작업을 작성하면 Codex 또는 별도의 Claude 프로세스가 읽기 전용으로 검토하고, reviewer가 `CONVERGED`를 선언할 때까지 수정과 재검토를 반복합니다.

여기에는 4가지 핵심 원칙이 존재합니다.

1. **Single writer**: 코드 수정은 작성자만 합니다. reviewer는 읽기 전용입니다.
2. **Reviewer declares**: 완료 여부는 reviewer만 선언합니다.
3. **Deterministic enforcement**: 프롬프트가 아니라 hook과 상태 머신이 절차를 강제합니다.
4. **Blind adjudication**: 판정자와 최종 검증자는 논쟁 기록을 보지 않고 코드와 요구사항만 봅니다.

이 구조에서 reviewer는 단순히 의견을 한 번 남기는 역할이 아닙니다. 코드를 다시 읽고, 수정 결과까지 재검토하며, 더 이상 고칠 문제가 없다고 판단했을 때만 루프를 끝냅니다.

---

## 참조한 리포지토리와 문서

처음 골격을 잡는 데 가장 직접적인 영향을 준 프로젝트는 Hamel Husain의 [claude-review-loop](https://github.com/hamelsmu/claude-review-loop)입니다. Claude Code의 `Stop hook` 으로 세션 종료를 막고 Codex 리뷰를 실행한다는 아이디어를 이 프로젝트에서 배웠습니다. 특히 "리뷰를 요청하는 것"과 "리뷰가 실행되도록 강제하는 것"은 전혀 다른 문제라는 점이 특히 인상적이었습니다.

여기에 [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols)의 review-loop protocol에서 다음 아이디어를 참고했습니다.

- 리뷰 기준이 중간 커밋 때문에 줄어들지 않도록 시작 시점의 baseline을 고정할 것
- reviewer에게 작성자의 "수정했다" 또는 "거절했다"는 설명을 전달하지 않을 것
- 설계 결정은 decision ledger에 남기되, 그 결정 때문에 생긴 실제 결함을 reviewer가 다시 지적할 자유는 유지할 것
- 논쟁의 설득력에 끌려가지 않도록 factual stalemate는 토론 내용을 보지 않은 blind judge가 판정할 것
- 위험도가 높거나 논쟁이 길었던 작업은 마지막에 새로운 관점으로 한 번 더 검사할 것

구현 과정에서 Claude Code의 [Hooks 문서](https://docs.anthropic.com/en/docs/claude-code/hooks)와 Codex CLI의 읽기 전용 sandbox 동작도 함께 확인했습니다. 

프로젝트 내부에서는 다음 문서를 기준으로 설계와 구현을 분리했습니다.

- [README](https://github.com/wnjoon/sparring/blob/dev/README.md): 사용자 관점의 현재 기능과 로드맵
- [Design decisions](https://github.com/wnjoon/sparring/blob/dev/docs/design-decisions.md): 합의됐지만 아직 구현되지 않은 결정
- [Phase별 구현 계획](https://github.com/wnjoon/sparring/tree/dev/docs/superpowers/plans): 실제 작업 단위와 검증 방법
- [Effect benchmark](https://github.com/wnjoon/sparring/blob/dev/bench/README.md): 효과 측정 방법, 결과와 한계

`policy.md`는 현재 구현된 동작의 source of truth이고, `design-decisions.md`는 이제까지 진행했고 앞으로 진행할 Phase의 기준입니다. 미래 설계가 구현되면 정책으로 옮기고, README에는 사용자가 실제로 쓸 수 있는 기능과 계획된 기능을 구분해 표시하였습니다.

---

## sparring의 동작 방식

사용자는 Claude Code에서 다음과 같이 작업을 시작합니다.

```text
/spar 로그인 토큰 갱신 로직을 구현하고 테스트를 추가해줘
```

작성자가 구현을 마치고 종료하려 하면 `Stop hook` 이 상태 파일을 확인한 뒤 reviewer 실행 파일과 prompt를 준비합니다. 여기서 작성자는 사용자가 아니라 **현재 코드를 구현하는 작성 에이전트** 입니다.
reviewer는 작업 요구사항과 변경 내용을 읽고 첫 줄에 둘 중 하나를 반환합니다.

```text
STATUS: CONVERGED
```

또는

```text
STATUS: FINDINGS
```

finding은 두 종류로 나뉩니다.

- `[MECHANICAL]`: 버그, 누락된 검사, 요구사항 위반처럼 객관적으로 수정할 수 있는 문제
- `[DESIGN]`: API 구조나 트레이드오프처럼 여러 선택지가 유효한 문제

작성자는 각 finding에 대해 `FIXED` 또는 근거를 포함한 `REJECTED` 응답을 남겨야 합니다. 
다음 reviewer는 이 응답을 보지 않고 frozen baseline부터 전체 변경을 다시 검토합니다. "수정했다"는 작성자의 주장을 신뢰하는 대신, 실제 코드가 달라졌는지를 새로 판단하게 만드는 것입니다.

```text
구현
  ↓
Stop hook이 종료 차단
  ↓
읽기 전용 reviewer의 blind review
  ├─ CONVERGED → 종료
  └─ FINDINGS
       ├─ MECHANICAL → 수정 또는 근거 있는 반박
       └─ DESIGN → 먼저 모델 간 논의
  ↓
전체 변경 재검토
```

같은 finding이 표현만 바뀌어 반복될 수 있기 때문에 file과 normalized title을 기반으로 deterministic fingerprint를 만들고, 애매한 경우에만 별도의 blind matcher가 같은 문제인지 판정합니다. 
동일 finding이 두 라운드 연속 제기되고 작성자가 계속 거절하면 stalemate로 봅니다.

reviewer는 같은 문제를 라운드마다 조금 다른 표현으로 지적할 수 있습니다. 

예를 들어 첫 리뷰에서는 “페이지 계산 오류”, 다음 리뷰에서는 “offset이 1부터 시작하는 문제”라고 쓸 수 있습니다. 

sparring은 먼저 파일명과 단순화한 제목을 비교해 같은 finding인지 확인합니다. 그래도 판단하기 어려우면, 별도의 blind matcher가 두 지적이 실제로 같은 문제인지만 판정합니다.
같은 문제가 두 라운드 연속 제기됐는데도 작성 에이전트가 계속 근거를 들어 거절하면 stalemate로 판단합니다. 
실제 버그인지에 관한 논쟁은 독립된 blind judge가 판정합니다. 반면 정답이 하나가 아닌 설계 선택이라면 우선 보류한 뒤, 다른 finding을 모두 처리한 시점에 관련 질문을 모아 사용자에게 한 번만 전달합니다.

- 실제 버그인지에 대한 다툼이면 blind judge가 `UPHELD` 또는 `DISMISSED`를 판정합니다.
- 진짜 설계 선택이면 바로 작업을 멈추지 않고 parked 상태로 둔 뒤, 다른 문제를 모두 처리한 시점에 사용자 질문을 한 번으로 묶습니다.

루프가 고장 나 사용자가 영원히 갇히는 것을 막기 위해 내부 오류에서는 fail-open하고, 기본적으로 5라운드 cap을 두고 있습니다. 여기서 cap 도달은 성공이 아니라, reviewer가 수렴하지 못했다는 사실을 그대로 보고하고 종료하는 circuit breaker로 보고 있습니다.

---

## 개발 계획

처음부터 모든 기능을 한꺼번에 구현하지 않고, 검증 가능한 Phase로 나눴습니다.

| Phase | 내용 | 현재 상태 |
|---|---|---|
| 1 | `/spar`, Stop hook, 반복 리뷰, 응답 파일, frozen baseline, round cap | 구현 완료 |
| 2 | conveyance boundary, finding registry, stalemate, blind judge, batched design gate, semantic matcher | 구현 완료 |
| 3 | Codex가 없어도 동작하는 Claude–Claude single-agent mode | 구현 완료 |
| 4 | 위험 기반 final sweep, 작은 변경의 skip 조건, design-intent harvest | 계획 |
| 5 | unattended mode와 최종 감사 보고서 | 계획 |
| 6 | Codex가 작성하고 Claude가 검토하는 mirror adapter | 계획 |
| 7 | reviewer model, reasoning effort, 저비용 fix writer 등 model economics | 계획 |

각 Phase에서는 먼저 설계 결정을 문서화하고, 구현 계획을 작은 작업으로 나눈 뒤, hook 코드와 테스트 또는 짧은 prompt 변경으로 규칙을 옮겼습니다. 
규칙을 모델이 기억하게 만드는 대신 가능한 한 상태 머신과 파일 구조가 지키게 하는 것을 원칙으로 하고 개발 중입니다.

---

## 현재 진행 상황

2026년 7월 23일 `dev` 브랜치 기준으로 Phase 1~3이 구현됐고 플러그인 버전은 [v0.2.0](https://github.com/wnjoon/sparring/releases/tag/v0.2.0)입니다. 

현재 `/spar`는 reviewer family를 한 번 결정해 reviewer, judge, matcher에 동일하게 적용합니다.

- Codex CLI가 있으면 Claude 작성자와 Codex reviewer의 cross-model 구성을 기본으로 사용합니다.
- Codex가 없으면 읽기 전용·격리된 `claude -p` reviewer를 사용합니다.
- `/spar --reviewer codex|claude -- <task>`로 reviewer를 명시할 수 있습니다.
- same-family 모드에서는 **cross-vendor blind spot 다양성이 줄어든다**는 사실을 사용자에게 표시합니다.

Claude reviewer에는 `Read`, `Grep`, `Glob` 등 검사 도구만 허용하고, `--safe-mode`로 프로젝트의 CLAUDE.md, memory, plugin, hook 등의 문맥을 격리했습니다. 같은 모델 계열을 사용하더라도 현재 작성 세션의 논쟁과 결론을 그대로 물려받지 않게 하기 위해서입니다.

---

## 테스트 및 벤치마크 결과

현재 코드 기준 테스트 결과는 다음과 같습니다.

- Stop hook 상태 전이 및 reviewer/judge/gate/matcher 테스트: **120개 통과**
- reviewer family 선택과 argument 안전성 테스트: **12개 통과**
- 합계: **132개 통과, 실패 0개**
- 실제 Codex reviewer를 이용한 planted-bug E2E: `FINDINGS → 수정 → blind re-review → CONVERGED`
- 실제 Claude reviewer의 읽기 전용·격리 실행 및 same-family E2E 검증 완료

추가로 review loop가 실제 결과를 개선하는지 확인하기 위해 작은 paired benchmark를 만들었습니다. 
이 실험은 통계적인 성능 평가가 아니라, reviewer가 있을 때와 없을 때 동일한 시작 코드가 어떻게 달라지는지 확인하는 demonstration입니다.

방법은 다음과 같습니다.

1. Claude Sonnet subagent가 `spec.md`만 보고 첫 구현 P0를 작성합니다.
2. 숨겨진 `oracle.py`로 P0를 채점합니다.
3. 동일한 P0에서 Claude–Codex cross-model loop와 Claude–Claude same-family loop를 각각 실행합니다.
4. reviewer와 작성자는 oracle을 볼 수 없고, 두 구성의 결과를 같은 oracle로 다시 채점합니다.

먼저 작은 범위에 요구사항이 명확한 4개의 과제에서는 첫 구현부터 모든 테스트를 통과했습니다.

| 과제 | 리뷰 전 자연 생성 P0 |
|---|---:|
| duration parser | 12/12 |
| pagination | 8/8 |
| LRU cache | 4/4 |
| semantic version 비교 | 12/12 |
| **합계** | **36/36** |

이미 맞는 코드에서는 review loop가 품질을 더 높이지 않았습니다. 
이를 통해 sparring이 항상 코드를 더 좋게 만드는 도구라기보다, 작성자가 실수했을 때 작동하는 안전망으로 보는 것이 낫다는 점을 보여주고 있습니다.

다음으로 duration parser, pagination, LRU cache에 그럴듯한 실수를 하나씩 심었습니다.

| 과제 | 심은 버그 | 리뷰 없음 | Claude–Codex | Claude–Claude |
|---|---|---:|---:|---:|
| duration parser | 문자열 전체가 아닌 일부만 매칭 | 10/12 | **12/12** | **12/12** |
| pagination | 1-based page의 off-by-one | 4/8 | **8/8** | **8/8** |
| LRU cache | `get`에서 recency를 갱신하지 않음 | 3/4 | **4/4** | **4/4** |
| **합계** | | **17/24 (71%)** | **24/24 (100%)** | **24/24 (100%)** |

두 reviewer 모두 세 가지 결함을 정확히 찾아냈고 한 번의 review→fix로 71%에서 100%가 됐습니다. 
특히 명백한 spec 위반에서는 cross-model과 same-family의 결과 차이가 없었습니다.

하지만 아래 숫자들에 대해서는 신중하게 접근해야 할 필요가 있습니다.

- 과제는 3~4개이고 trial은 한 번뿐입니다.
- 자연 발생 버그가 아니라 의도적으로 심은 버그입니다.
- 과제가 작고 요구사항이 명확합니다.
- 작성자는 Sonnet이며, 더 강한 작성자는 처음부터 실수할 가능성이 낮습니다.
- reviewer도 전달받지 못한 요구사항은 찾아낼 수 없습니다.
- vendor별 blind spot을 드러낼 만큼 미묘한 과제가 아직 없습니다.

따라서 **71% → 100%는 일반적인 성능 향상률이 아닙니다.** 현재 벤치마크가 말해주는 것은 제한적이며, "명확한 요구사항을 위반한 결함이 존재했을 때, 강제된 blind review loop가 이 작은 표본에서는 3개 모두 찾아 수정했다"의 정도로 이해하는게 좋습니다.

---

## 향후 계획

[로드맵](https://github.com/wnjoon/sparring#roadmap) 기준으로 다음 우선순위는 Phase 4의 final sweep입니다. 
인증, 데이터베이스 migration, CI와 hook처럼 위험한 경로를 수정했거나, 리뷰가 세 라운드 이상 이어졌거나, 설계 finding이 발생한 작업은 수렴 후에도 새로운 blind sweeper가 한 번 더 확인하게 할 계획입니다. 
반대로 작은 변경은 크기뿐 아니라 파일 종류와 위험도를 함께 만족할 때 선택적으로 review loop를 생략하는 기능을 포함할 계획입니다.

아래의 원칙은 개발 과정에서 계속 유지할것이고, 앞으로 점차 개선할 계획입니다.

- reviewer가 다른 회사의 모델이어도 작성자의 해명을 그대로 전달받으면 논쟁에 끌릴 수 있다.
- 같은 모델 계열이어도 새로운 프로세스에서 세션 기록을 보지 않고 전체 코드를 다시 읽으면 독립적인 안전망이 될 수 있다.
- reviewer가 읽기 전용이어야 작성자와 판정자의 역할이 섞이지 않을 것이다.
- round cap은 품질 보장이 아니라 무한 반복을 막는 장치여야 한다.
- reviewer의 `CONVERGED`도 객관적 무결성의 증명은 아니다. stateless reviewer가 이전 결함을 우연히 놓칠 위험은 계속 존재할 수 있다.

이후 작업은 아래와 같이 순차적으로 진행하려고 합니다.

- unattended mode에서도 mechanical fix는 진행하되 설계 결정은 다음 세션에 정직하게 남기기
- `converged`, `cap`, `error-bypass`, `cancelled`, `skipped` 등을 구분하는 최종 감사 보고서 만들기
- Codex가 작성자이고 Claude가 reviewer인 mirror adapter 구현하기
- diff 크기에 따른 reviewer reasoning effort와 writer tier 설정하기
- multi-file, stateful, concurrent 과제로 benchmark 확장하기
- 자연 발생 버그와 vendor별 blind spot을 측정할 수 있도록 trial 수 늘리기
- benchmark 실행을 수동 orchestration에서 재현 가능한 runner로 자동화하기

기능을 모두 구현한 뒤에는 `dev`와 실제 정책 문서를 다시 맞추고, `main` 병합, tag, GitHub release, 원격 설치 검증을 release gate로 사용할 계획입니다.

---

## 참고

- [claude-review-loop](https://github.com/hamelsmu/claude-review-loop)
- [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols)