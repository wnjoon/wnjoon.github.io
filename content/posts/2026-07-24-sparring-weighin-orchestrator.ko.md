---
title: "리뷰 루프 위에 계획 실행을 얹기: sparring 0.4.0 개발기"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2026-07-24"
slug: "sparring-weighin-orchestrator"
summary: "sparring이 v0.2.0에서 v0.4.0으로 오면서 위험 기반 final sweep과 안전한 skip(Phase 4), 그리고 계획서를 리뷰 루프에 태우는 오케스트레이터 /spar-weighin(Phase 8)이 추가됐다. 개발 과정에서 마주친 Stop hook 순서 문제, 크로스모델 리뷰가 잡아낸 치명적 결함, 워크트리 격리 버그와 각각의 해결 방법을 정리한다."
description: "sparring 0.4.0의 새 기능(Phase 4 final sweep/skip, Phase 8 /spar-weighin 오케스트레이터)과, 이를 sparring 자신의 방법론으로 구현하면서 겪은 이슈와 해결 과정을 정리한다."
toc: true
readTime: true
autonumber: false
math: false
tags: ["dev", "AI", "Claude Code", "Codex", "ai-agent", "code-review", "orchestration", "2026"]
keywords: ["AI", "Claude Code", "Codex", "AI agent", "code review", "review loop", "sparring", "orchestrator", "weighin"]
showTags: true
hideBackToTop: false
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "headline": "리뷰 루프 위에 계획 실행을 얹기: sparring 0.4.0 개발기"
  "description": "sparring 0.4.0의 새 기능(Phase 4 final sweep/skip, Phase 8 /spar-weighin 오케스트레이터)과, 이를 sparring 자신의 방법론으로 구현하면서 겪은 이슈와 해결 과정을 정리한다."
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
---

## 지난 글 이후 무엇이 달라졌나

![sparring](https://raw.githubusercontent.com/wnjoon/sparring/dev/image/main.png)

[지난 글](/posts/sparring-cross-model-code-review-loop)에서는 AI가 작성한 코드를 독립된 reviewer가 `CONVERGED`를 선언할 때까지 검토하게 만드는 sparring의 배경과 Phase 1~3(v0.2.0)까지의 구현을 정리했습니다.

그 뒤로 두 가지가 더 진행됐습니다.

- **Phase 4 (v0.3.0)**: 위험 기반 final sweep, 작은 변경의 안전한 skip, 변경 범위에 맞춘 design-intent 힌트.
- **Phase 8 (v0.4.0)**: 계획서를 리뷰 루프에 태우는 오케스트레이터 `/spar-weighin`.

이 글은 이 두 단계에서 **추가된 기능**과, 특히 `/spar-weighin`을 만들면서 **마주친 문제와 해결 방법**을 정리합니다. 흥미로운 점은 이번 기능을 sparring이 스스로 검증하는 방식(브레인스토밍 → 계획 → 서브에이전트 구현 → 크로스모델 리뷰 → 릴리스)으로 만들었고, 그 과정에서 리뷰 루프가 실제로 치명적인 결함을 한 번 잡아냈다는 것입니다.

---

## Phase 4 — 안전한 생략과 위험 기반 최종 점검 (v0.3.0)

Phase 4는 루프의 "낭비"와 "빈틈"을 동시에 줄이는 단계였습니다.

- **안전한 skip**: 변경이 충분히 작고(대략 10줄·2개 경로 이하) 위험한 경로나 위험한 변경 종류(rename/delete/mode/binary/symlink 등)가 하나도 없을 때만, 리뷰 루프를 생략하고 그 사실을 정직하게 보고합니다. 크기만으로 생략하지 않고 종류와 위험도를 함께 봅니다.
- **design-intent 힌트**: 매 라운드 reviewer에게, 변경된 범위에 해당하는 저장소의 규칙과 근거(`.claude/rules`, 상위 `CLAUDE.md`/`AGENTS.md`의 rationale, 변경 인접 주석)를 함께 전달합니다. 다만 이 힌트는 의도를 설명할 뿐 결함을 덮지 못합니다.
- **위험 기반 final sweep**: 위험한 경로/저장소를 건드렸거나, 리뷰가 세 라운드 이상 이어졌거나, 설계 finding이 있었던 작업은 reviewer가 수렴한 뒤에도 **새로운 blind sweeper**가 한 번 더 전체 변경을 확인합니다. sweeper는 논쟁 기록을 보지 않고 코드와 요구사항만 봅니다.
- **정직한 종료 사유**: 모든 종료 경로가 `converged`, `cap`, `skipped`, `sweep-findings-at-cap` 같은 불변의 결과를 파일로 남깁니다. 이 중 `converged`만이 "리뷰가 통과했다"는 의미입니다.

---

## Phase 8 — /spar-weighin: 계획서를 리뷰 루프에 태우기 (v0.4.0)

기존 `/spar`는 "작업 하나를 구현하고, reviewer가 수렴을 선언할 때까지 검토하는" 한 사이클입니다. 그런데 실제 작업은 보통 여러 단계로 나뉩니다. 계획을 세우고, 작업 공간을 격리하고, 단계별로 구현하는 과정을 매번 손으로 이어붙여야 했고, 마지막 구현 단계는 결국 **작성한 모델이 자기 작업을 스스로 검토**하는 self-review로 끝나는 경우가 많았습니다. sparring이 없애려던 바로 그 지점입니다.

`/spar-weighin`은 이 흐름을 하나로 묶습니다. 이름은 경기 전 계체량(weigh-in)에서 따왔습니다. 링에 오르기 전에 준비를 끝내고 내보낸다는 의미입니다.

```text
/spar-weighin <스펙>
      ↓
전용 브랜치 생성 + 상태 초기화
      ↓
계획서 작성(writing-plans) → 체크박스 Task 목록
      ↓
Task 1을 /spar 루프로 실행
      ├─ 수렴 → 체크박스 채움 + 커밋 → 다음 Task
      └─ 비수렴(cap 등) → 정직하게 멈춤
      ↓
모든 Task 수렴 → 종료
```

핵심 성격은 다음과 같습니다.

- **단위 선택**: 기본은 계획의 Task를 하나씩 루프에 태워, Task마다 작은 diff로 리뷰합니다. `--whole`을 주면 계획 전체를 한 번에 태웁니다.
- **진행 추적이 곧 계획서**: 각 Task가 수렴할 때마다 계획서의 `- [ ]`를 `- [x]`로 바꾸고 커밋합니다. 계획서가 살아있는 진행판이 됩니다.
- **정직한 종료**: 어떤 Task가 라운드 상한 안에 수렴하지 못하면 다음 Task로 넘어가지 않고 그 자리에서 멈추고 보고합니다. self-review로 대충 끝내지 않는다는 sparring의 원칙을 그대로 따릅니다.

reviewer 선택(codex/claude)은 `/spar`와 동일하게 그대로 전달됩니다.

---

## 개발 과정에서 마주친 문제와 해결

이번 기능의 진짜 이야기는 여기에 있습니다. 세 가지 문제가 있었고, 그중 하나는 sparring 자신의 리뷰 루프가 잡아냈습니다.

### 1. Stop hook의 실행 순서를 신뢰할 수 없었다

처음 설계는 `/spar-weighin` 전용 Stop hook을 하나 더 등록해서, 기존 `/spar`의 hook 뒤에 실행되게 하는 것이었습니다. Task가 수렴하면 기존 hook이 상태를 정리하고, 그 뒤에 새 hook이 "다음 Task로 넘어가라"고 이어받는 그림이었습니다.

확인해보니 Claude Code는 여러 Stop hook이 등록됐을 때 **실행 순서를 보장하지 않았습니다.** 병렬로 돌 수 있고, 한 hook의 파일 삭제를 다른 hook이 관찰한다는 보장도 문서화돼 있지 않았습니다. "기존 hook이 먼저 정리하고 새 hook이 이어받는다"는 전제 자체가 성립하지 않았던 것입니다.

**해결**은 hook을 두 개로 나누지 않는 것이었습니다. Stop hook은 하나만 등록하고, 그 안에서 기존 `/spar`의 hook을 **같은 프로세스의 서브루틴으로 호출**한 뒤 결과를 받아, weigh-in이 활성 상태이고 `/spar`가 종료를 허용했을 때만 결정을 덮어씁니다. 한 프로세스 안의 순차 실행이라 순서와 부작용이 100% 보장됩니다. 기존 `/spar`의 hook 코드는 손대지 않았고, weigh-in이 비활성일 때는 `/spar`의 결정을 그대로 통과시키므로 **`/spar`만 쓰던 사용자는 아무 영향이 없습니다.**

### 2. 크로스모델 리뷰가 잡아낸 치명적 결함

이 오케스트레이터의 심장은 "Task가 수렴하면 다음 Task로 전진"하는 부분입니다. 여기서 상태 파일의 두 값(현재 Task 번호, 현재 리뷰 ID)을 **각각 따로** 저장하고 있었습니다.

적대적 리뷰(다른 모델로 돌린 독립 검토)가 이 지점을 짚었습니다. 두 번의 저장 **사이에** 프로세스가 죽으면(예: hook 타임아웃), "현재 Task 번호는 다음으로 넘어갔는데 리뷰 ID는 이미 소비된 옛 값"인 상태가 남습니다. 소비된 결과 파일이 그대로 남아 있어서, 다음 호출은 **구현도 리뷰도 되지 않은 Task를 완료로 표시하고 커밋**해 버릴 수 있었습니다. 최악의 경우 전체 계획을 "모두 수렴함"으로 **허위 선언**할 수 있는 결함이었습니다.

**해결**은 두 값을 **한 번의 원자적 쓰기**로 바꾸는 것이었습니다. 한 번의 `awk` 패스로 임시 파일에 쓴 뒤 `mv`로 교체하므로, "번호는 전진했는데 ID는 옛 값"인 중간 상태 자체가 도달 불가능해집니다. 이후 재검토에서 crash 시나리오 두 경우가 모두 안전(같은 Task를 멱등하게 다시 처리하거나, 안전하게 멈춤)함을 확인했고, 이 시나리오를 재현하는 회귀 테스트도 추가했습니다.

이 결함이 중요한 이유는, 이것이 조용히 지나갔다면 **"다 됐다"고 말하지만 실제로는 만들어지지 않은 코드**가 나올 수 있었기 때문입니다. sparring이 애초에 막으려던 바로 그 실패 유형입니다. 그리고 이것을 잡은 것은 작성한 모델 자신이 아니라 **독립된 크로스모델 리뷰**였습니다.

### 3. 워크트리가 상태 파일을 엉뚱한 곳에 남긴다

처음에는 작업 격리를 위해 별도의 git worktree를 만들려고 했습니다. 그런데 커맨드가 **상태 파일을 먼저 만든 뒤** 워크트리를 생성하면, 워크트리로 작업 디렉터리가 바뀌면서 상태 파일과 계획서는 원래 폴더에 남습니다. hook은 바뀐 디렉터리 기준으로 상태 파일을 찾으니 못 찾고, 루프가 전진하지 못합니다.

**해결**은 별도 워크트리 대신 **현재 디렉터리에 전용 브랜치**(`weighin/<슬러그>-<시각>`)를 만드는 것이었습니다. 작업 디렉터리가 바뀌지 않으니 hook이 읽는 모든 상태 경로가 그대로 유효합니다. `/spar`가 이미 baseline diff로 리뷰 범위를 격리하고 있고, 이 저장소도 원래 "task별 브랜치" 방식이라 자연스럽게 맞았습니다.

### 도구가 자기 방법론으로 자신을 만들다

세 문제 모두, 계획을 먼저 문서로 합의하고 → 작은 Task로 나눠 서브에이전트가 구현하고 → Task마다 독립 리뷰로 검증하고 → 마지막에 브랜치 전체를 한 번 더 리뷰하는 흐름 안에서 드러났습니다. 특히 2번 결함은 같은 계열의 여러 리뷰가 지나쳤을 수도 있는 것을, 적대적으로 설정한 독립 리뷰가 잡아냈습니다. 지난 글에서 세웠던 가설("독립된 blind review가 안전망이 된다")을 이번 개발이 스스로 한 번 더 확인해 준 셈입니다.

---

## 테스트와 현재 상태

2026년 7월 24일 기준으로 Phase 4와 Phase 8이 구현됐고 플러그인 버전은 [v0.4.0](https://github.com/wnjoon/sparring/releases/tag/v0.4.0)입니다.

- 순수 bash 테스트 스위트 **13개, 총 307개 어셈블리 전부 통과**.
- 그중 기존 Stop hook 스위트가 **180개 그대로 통과** — 새 dispatcher를 거쳐도 `/spar` 단독 동작이 완전히 보존됨을 확인.
- `/spar-weighin`의 상태 전이(통과/전진/종료/정직한 중단)와 fail-open(내부 오류에도 `/spar`의 결정을 잃지 않음)을 각각 테스트로 검증.

`/spar-weighin`은 새 커맨드이므로 semver상 minor를 올려 v0.4.0으로 릴리스했고, `dev → main` 병합과 tag를 릴리스 게이트로 사용했습니다.

---

## 향후 계획

[로드맵](https://github.com/wnjoon/sparring#roadmap) 기준으로 남은 단계는 다음과 같습니다.

- **Phase 5**: unattended mode와, 완료된 실행의 결과를 정리하는 최종 보고서.
- **Phase 6**: Codex가 작성하고 Claude가 검토하는 mirror adapter.
- **Phase 7**: diff 크기에 따른 reviewer reasoning effort와 저비용 fix writer 등 model economics.

개발 내내 유지하려는 원칙은 그대로입니다. 규칙을 모델이 기억하게 만드는 대신 상태 머신과 파일 구조가 지키게 하고, 완료 판정은 작성자가 아니라 독립된 reviewer만 내리며, 종료 사유는 언제나 정직하게 남깁니다. 이번 `/spar-weighin`은 그 원칙을 "한 번의 작업"에서 "여러 단계로 이루어진 작업 전체"로 넓히는 시도였습니다.

---

## 참고

- [sparring 저장소](https://github.com/wnjoon/sparring)
- [지난 글: AI가 작성한 코드를 다른 AI가 끝까지 검토하게 만들기](/posts/sparring-cross-model-code-review-loop)
- [claude-review-loop](https://github.com/hamelsmu/claude-review-loop)
- [jongwony/epistemic-protocols](https://github.com/jongwony/epistemic-protocols)
