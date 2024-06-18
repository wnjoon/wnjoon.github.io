---
layout: post
title:  "Flutter를 이용한 앱 개발환경 구성하기" 
excerpt: "2023년 꼭 해보고싶은 일 중 하나가 앱 만들기이다. 최근 Flutter를 이용해서 굉장히 쉽고 빠르게 앱을 만들 수 있다고 하여 이를 공부해보기로 하였다. Flutter는 Google에서 만들었으며, 공식 홈페이지에서는 '하나의 코드베이스로 모바일, 웹, 데스크톱에서 네이티브로 컴파일 되는 구글의 아름다운 UI 툴킷'이라고 표현하고 있다. 이번 포스팅에서는 Apple M1 macOS에서 Flutter 개발환경을 구성한 내용을 작성해본다."
date:   2023-01-06 15:00:00 +0900
categories: mobile
tags: [flutter]
comments: true
---

<br>

## Flutter란

구글에서 2017년 5월 출시된 모바일/웹/데스크톱 크로스 플랫폼 GUI SDK이다. 하나의 코드 베이스로 안드로이드, 리눅스, Windows, macOS, iOS 및 웹 브라우저에서 모두 동작되는 앱을 위해 출시되었다. 사용되는 언어는 역시 구글에 의해 제창된 Dart를 사용한다([나무위키](https://namu.wiki/w/Flutter(%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC))).

자세한 설명은 위에 있는 나무위키 링크를 따라가면 확인할 수 있다. 무튼 얼마전까지만 해도 React 네이티브가 앱 개발에 굉장히 좋은 언어로 사용되고 있었는데, Flutter가 점유율에서 더 앞서가며 최근에는 가장 많이 사용되는 앱 개발용 프레임워크로 자리잡는 중이라고 한다. 특징 중 하나로 소스 코드를 네이티브 CPU 머신 코드로 직접 컴파일하고 UI를 렌더링 엔진 Skia로 직접하기 때문에 성능이 뛰어나다고 하는데(?), 무튼 굉장히 빠른 성능을 보인다라고 이해하면 좋을 것 같다. (사실 나도 잘 모르겠다. 앱개발은 처음이라..)

하지만 가장 중요한 요소는 선택적으로 하나의 프레임워크로 iOS와 안드로이드 모두 적용 가능한 앱을 개발할 수 있다는 것이다. 플랫폼에 관계 없이 Flutter용 테마 디자인 라이브러리를 적용하고 이를 커스터마이즈도 가능하다. 정리하면 각 플랫폼(iOS, 안드로이드)하고 관련없이 Flutter 자체가 디자인하고 렌더링 한 앱이 그대로 플랫폼에서 <u>그려지기 때문</u>인데, 이젠 플랫폼간 경계마저도 허물어가는 문명의 발달이 신기하기만 하다.

이를 위해 Flutter와 함께 안드로이드와 iOS용 앱을 각각 개발할 수 있는 IDE를 설치해본다.

<br>

## 개발환경 구성

### 1. 기본 세팅(Flutter 및 기타) 

**1.1. brew**

[공식 홈페이지](https://brew.sh/index_ko)에 있는 스크립트를 터미널에서 실행하여 설치한다. 

```bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
$ brew --version

Homebrew 3.6.17
Homebrew/homebrew-core (git revision 39dcf409ef1; last commit 2023-01-09)
Homebrew/homebrew-cask (git revision 6c7390b3da; last commit 2023-01-09)
```
**1.2. openjdk 11**

포스팅 작성 시점으로는 더 높은 버전의 자바가 존재하지만, 아직까지 일반적으로 사용되고 있는 11버전으로 설치해본다.

```zsh
$ brew install openjdk@11
$ java --version

openjdk 11.0.17 2022-10-18 LTS
OpenJDK Runtime Environment Zulu11.60+19-CA (build 11.0.17+8-LTS)
OpenJDK 64-Bit Server VM Zulu11.60+19-CA (build 11.0.17+8-LTS, mixed mode)
```

**1.3. flutter**

[flutter 공식 사이트 - Get Started](https://docs.flutter.dev/get-started/install)에서 파일을 다운로드 할 수 있다. 
1. 해당하는 OS에 맞게 파일을 다운로드 한다. 필자는 macOS -> Apple Silicon을 선택하였음
2. 다운로드한 파일 압축해제
3. 압축해제한 파일을 홈(home)으로 이동
4. 환경변수에 flutter 실행파일을 PATH로 등록. 필자는 zsh을 사용하고 있음
    ```bash
    $ vi ~/.zshrc

    # 등록
    export PATH=$PATH:/Users/{본인의홈계정}/flutter/bin    

    # path가 제대로 잡혔는지 확인
    $ flutter --version

    Flutter 3.3.10 • channel stable • https://github.com/flutter/flutter.git
    Framework • revision 135454af32 (4 weeks ago) • 2022-12-15 07:36:55 -0800
    Engine • revision 3316dd8728
    Tools • Dart 2.18.6 • DevTools 2.15.0
    ```

<u>(중요!) 만약 필자와 같이 Apple Silicon을 사용하고 있다면, 추가로 rosetta를 설치해주어야 한다.</u>

```bash
$ /usr/sbin/softwareupdate --install-rosetta --agree-to-license
```

**1.4. Android License 동의**

Flutter를 이용하여 안드로이드 앱을 개발하기 전에 꼭 동의해야 하는 부분이다.

```bash
$ flutter doctor

...
# Android toolchain을 동의해주어야 함
[!] Android toolchain - develop for Android devices (Android SDK version 33.0.1)
...

$ flutter doctor --android-licenses
# 모든 라이센스에 대해 동의(y)
```

### 2. Android

**2.1. Android Studio**

안드로이드 스튜디오는 구글이 안드로이드 앱 개발을 위해 JetBrain사의 IntelliJ IDEA를 기반으로 만든 통합 개발 환경이다(그래서 UI가 IntelliJ와 매우 유사하다). 

[Android Developers : Android Studio](https://developer.android.com/studio)에 들어가서 다운로드를 한다. 필자의 PC는 Apple M1 기반이므로, 이를 선택하였다.

설치가 완료되었다면, 실행 후 선택 과정은 아래와 같다.
1. Import Android Studio Settings -> 처음 시작하였으므로 Do not import settings
2. Install Type -> Standard
3. Select UI Theme -> 하고싶은대로 선택
4. Verify Settings -> 설치할 목록을 보여줌. 넘어가자
5. License Agreement -> 모든 License에 대해 Accept 선택 -> Finish
6. 권한 여부에 대한 동의 여부 나올 수 있음. 이는 Android Studio의 성능을 최적화 하기 위함이므로 동의

**2.2. Plugin**

Android Studio에서 Flutter 개발을 위해 사용할 플러그인을 설치해야 한다.
1. Android Studio 메인화면 -> Plugins
2. flutter 검색 후 설치(install). dart가 자동으로 같이 설치되는지 확인
3. Restart IDE

**2.3. Android SDK Command-line Tools**

Android Studio에서 Flutter 앱을 실행할 때 필요한 도구로, Android Studio에서 동일하게 설치한다.
1. Android Studio 메인화면 -> More Actions -> SDK Manager
2. SDK Tools 탭 -> Android SDK Command-line Tools 선택 -> Apply -> Ok

**2.4. 애뮬레이터**

안드로이드 기기와 동일한 앱 테스트 환경을 구성해주는 애뮬레이터를 구성한다.
1. Android Studio 메인화면 -> More Actions -> Virtual Device Manager
2. Play Store가 가능한 새로운 기기 생성
    - Create device -> Pixel 4
    - Android 11.0(Google Play)

### 3. iOS

**3.1. Xcode**

iOS 개발을 위한 IDE를 설치한다. 
- App Store -> xcode 검색 후 설치

**3.2. Cocoapods**

iOS 앱에 필요한 외부 패키지를 설치할 때 사용되는 cocoapods를 설치한다.  
brew를 이용하여 설치한다.

```bash
$ brew install cocoapods
$ pod --version

1.11.3
```

**3.3. 애뮬레이터**

따로 설치할 필요는 없고, 어떻게 실행하는지만 알면 된다.
- Xcode 실행 -> 메뉴바 -> Open Developer Tool -> Simulator
- 포스팅 작성 시점에서는 Apple iPhone 14 pro max로 실행되는 것을 볼 수 있다.

<br>

## 참고자료

- [Flutter(프레임워크) - 나무위키](https://namu.wiki/w/Flutter(%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC))
- [안드로이드 스튜디오 - 나무위키](https://namu.wiki/w/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C%20%EC%8A%A4%ED%8A%9C%EB%94%94%EC%98%A4)
- [Android Studio - Official Website](https://developer.android.com/studio)
