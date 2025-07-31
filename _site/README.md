# Blog

## Error Handling

### An error occurred while installing strscan (3.1.0), and Bundler cannot continue

An error occurred while installing strscan (3.1.0), and Bundler cannot continue.
Make sure that gem install strscan -v '3.1.0' --source 'https://rubygems.org/' succeeds before bundling.

strscan gem이 현재 시스템 환경에서 제대로 설치되지 않아서 발생하는 문제

> $ sudo apt-get update
> $ sudo apt-get install build-essential libssl-dev zlib1g-dev
> $ gem install strscan -v '3.1.0'

그럼에도 불구하고 에러가 발생하는 경우, Gemfile.lock을 삭제하고 다시 bundle install을 진행한다.

> $ rm Gemfile.lock

## Schema Types

이 카테고리는 "이 페이지는 어떤 종류의 글인가?"를 AI에게 알려주는 가장 중요한 정보입니다. 블로그 글에 사용할 수 있는 대표적인 타입은 다음과 같습니다.

- BlogPosting: 가장 보편적인 블로그 글에 사용됩니다. 개인적인 생각, 에세이, 여행 후기, 개발 일지 등 대부분의 블로그 콘텐츠에 잘 맞습니다.
- Article: BlogPosting보다 조금 더 포괄적인 '기사' 또는 '글'을 의미합니다. 정보 전달이 목적인 일반적인 글에 무난하게 사용할 수 있습니다.
- NewsArticle: 특정 사건이나 최신 소식, 발표 등 뉴스 형식의 글에 특화된 타입입니다.
- TechArticle: 기술적인 주제를 다루는 글에 사용됩니다. 코드, 특정 기술 설명, 개발 튜토리얼 등에 최적화되어 있습니다.
- ScholarlyArticle: 논문, 연구 보고서 등 학술적인 내용을 담은 글에 사용됩니다.
- Report: 특정 주제에 대한 조사나 분석 결과를 담은 보고서 형식의 글에 사용됩니다.
- SatiricalArticle: 풍자적인 내용의 글에 사용됩니다.

> 팁: 어떤 타입을 써야 할지 헷갈릴 때는 가장 포괄적인 **Article**이나 가장 일반적인 **BlogPosting**을 사용하면 대부분의 경우에 문제없습니다.

## Content structure

이것들은 위에서 선택한 메인 카테고리 안에 포함되어, "이 글은 어떤 특별한 구조나 정보를 담고 있나요?"를 AI에게 더 자세히 알려주는 '추가 정보'입니다.

- howTo: 단계별 방법을 안내하는 구조가 있을 때 사용합니다.
  - 포함 정보: 각 단계(step)의 제목, 설명(text), 이미지 등

- mainEntity (FAQPage 타입과 함께 사용): Q&A 형식의 구조가 있을 때 사용합니다. mainEntity 속성 값으로 FAQPage 타입을 지정합니다.
  - 포함 정보: 각 질문(Question)과 답변(Answer)

- review: 제품, 책, 장소 등에 대한 리뷰가 포함되어 있을 때 사용합니다.
  - 포함 정보: 리뷰 대상(itemReviewed), 리뷰 내용(reviewBody), 평점(reviewRating) 등

- video: 글의 핵심 내용으로 동영상이 포함되어 있을 때 사용합니다.
  - 포함 정보: 동영상 URL(contentUrl), 썸네일(thumbnailUrl), 업로드 날짜(uploadDate), 길이(duration) 등

## Content basic information

- headline: 글의 제목
- description: 글의 요약 설명
- image: 글을 대표하는 이미지
- author: 글의 작성자
- publisher: 글의 게시자 (보통 회사나 단체)
- datePublished: 글이 처음 게시된 날짜
- dateModified: 글이 마지막으로 수정된 날짜
- keywords: 글의 핵심 키워드

## Rich Results Test

AI 검색엔진(구글)이 내 글의 스키마를 제대로 이해하고 있는지 직접 테스트할 것

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- 테스트 방법:
    - 수정한 블로그 글을 웹사이트에 게시(배포)
    - 게시된 글의 URL을 복사
    - 리치 결과 테스트 페이지 접속
    - URL 붙여넣고 테스트 실행
    - 테스트 결과에서 "발견된 구조화된 데이터" 항목에 `TechArticle`과 `HowTo` 초록색 체크 표시 확인
    - "1개 이상의 유효한 항목이 발견되었습니다" 메시지 확인