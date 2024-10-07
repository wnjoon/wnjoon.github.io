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
