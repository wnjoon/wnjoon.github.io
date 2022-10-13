---
layout: post
title:  "맥에서 외장모니터 음향과 밝기를 키보드로 조절하기" 
excerpt: "맥에 연결한 외장모니터의 음향과 밝기를 모니터에 있는 물리버튼이 아닌 키보드를 통해 조절해보자."
date:   2022-02-06 15:00:00 +0900
categories: tool
tags: [mac]
---

<br>

## 외장모니터 구매

![image](https://user-images.githubusercontent.com/39115630/152660375-78d80631-389c-4804-87f4-6bd71f8ef0e9.png)  

작년 수많은 재택을 하면서 몸과 마음의 편안함은 얻었지만, 그와 동시에 허리아픔과 눈의 침침함을 얻게 되었다.  
큰맘을 먹고 사무용 책상을 구매하면서 LG의 외장모니터도 같이 구매하게 되었는데, <u>맥에서는 울트라파인과 같이 공식모니터가 아닌 외장모니터를 사용하게 되면 키보드에 달려있는 버튼으로는 밝기나 음향조절이 불가능</u>하다는 것을 알게 되었다. 사실 밝기야 크게 어려움이 없는데, 음향의 경우 일일이 소리 조절할때마다 모니터를 만져야 한다는게 아주 큰 불편함이었다.  
구글링을 하던 중, 좋은 오픈소스가 있어서 설치해보았고 이를 공유하고자 한다.

<br>

## MonitorControl

[https://github.com/MonitorControl/MonitorControl/releases](https://github.com/MonitorControl/MonitorControl/releases)

현재 4.0.2 버전까지 출시되었으며, 설치 방법 또한 매우 간단하다. dmg 파일을 다운받아 설치한 후, 설치 과정 맨 마지막 가이드대로 'System Preferences > Security&Privacy > Privacy > Accessibility'에 해당 앱을 체크해주면 된다.

<br>

## 결과

![image](https://user-images.githubusercontent.com/39115630/152702089-ed163b38-0897-43bf-9482-c6ce4b77b90a.png)  

위와 같이 메뉴바에 앱이 생기게 되고, 키보드에서 모니터의 밝기와 음향을 조절할 수 있게 된다.