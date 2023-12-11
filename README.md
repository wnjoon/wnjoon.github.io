# Development Branch

## How to make blog

Since [whiteglass theme](https://github.com/yous/whiteglass) is no longer available to use in github pages, I made a static pages.

> - Jekyll 3 now recommends using Gem-based themes.
> - There was no 'whiteglass' them in Gem-based repository.
> - So, This theme cannot be adjusted directly through github-pages.

I referred to [Pulkit Sharma's blog - Using Jekyll and Github Pages (in 2017)](https://pulkitsharma07.github.io/2017/09/23/using-jekyll-and-github-pages/), and it worked very well.

<br>

## Comment

I adjust ['Utterances'](https://utteranc.es/) and refer to ['[Github 블로그] utterances 으로 댓글 기능 만들기 (+ disqus 비추후기)'](https://ansohxxn.github.io/blog/utterances/).

- Add [custom_comments_provider.html](./_includes/) in \_includes.
- Set comments to true in [\_config.yml](./_config.yml).

<br>

## Clone repository to new location

```shell
$ sudo gem install bundler:2.4.2
$ sudo bundle install
```

<br>

## Already push force

Changed deploy script to push force to repository

[deploy](deploy)

```shell
41: if git push -f origin master; then
```

## Test in local

```shell
$ bundle exec jekyll serve
```
