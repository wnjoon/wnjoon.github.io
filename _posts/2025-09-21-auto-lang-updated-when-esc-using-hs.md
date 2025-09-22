---
layout: post
title:  "vim에서 esc를 누르면 자동으로 영문으로 바꿔주기 with Hammerspoon"
description: "한국인들이 vim을 사용할때 자주 겪는 어려움 중 하나는 한글로 주석을 작성하다가 mode를 바꾸면 한글이 계속 인식되어 있어서 한영전환을 한번 더 해줘야 한다는 것이다. 이게 생각보다 생산성을 엄청나게 저하시키는데, 많은 곳에서 hammerspoon을 사용해서 이를 해결하고 있어서 이를 공유한다."
categories: dev
draft: false
keywords: "vim, hammerspoon, auto lang update"
comments: true
# external_url: https://brunch.co.kr/@wallee/25"
schema:
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  "headline": "vim에서 esc를 누르면 자동으로 영문으로 바꿔주기 with Hammerspoon"
  "description": "한국인들이 vim을 사용할때 자주 겪는 어려움 중 하나는 한글로 주석을 작성하다가 mode를 바꾸면 한글이 계속 인식되어 있어서 한영전환을 한번 더 해줘야 한다는 것이다. 이게 생각보다 생산성을 엄청나게 저하시키는데, 많은 곳에서 hammerspoon을 사용해서 이를 해결하고 있어서 이를 공유한다."
  "keywords": "vim, hammerspoon, auto lang update"
  "datePublished": "2025-09-21"
  "mainEntity": 
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "Vim에서 한영 자동 전환이 필요한 이유는 무엇인가요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "Vim의 Insert 모드에서 한글로 주석 등을 작성한 후, Normal 모드로 전환하기 위해 ESC 키를 누르면 입력기가 한글 상태로 남아있게 됩니다. Normal 모드의 명령어는 영문으로 입력해야 하므로, 사용자가 직접 한/영 키를 눌러 전환해야 하는 번거로움이 발생합니다. 이 과정은 생각보다 생산성을 크게 저하시키기 때문에 자동화가 필요합니다."
      - "@type": "Question"
        "name": "어떤 도구를 사용하여 이 문제를 해결하나요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "macOS 자동화 도구인 Hammerspoon을 사용합니다. Hammerspoon은 Lua 스크립트를 이용해 운영체제나 특정 애플리케이션의 동작을 제어할 수 있게 해줍니다. 이를 통해 '특정 앱에서 ESC 키가 눌렸을 때, 자동으로 입력기를 영문으로 전환'하는 것과 같은 사용자 맞춤형 기능을 구현할 수 있습니다."
      - "@type": "Question"
        "name": "Hammerspoon 스크립트가 특정 앱(예: VSCode)에서만 동작하도록 어떻게 설정하나요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "스크립트 내에서 목표 애플리케이션의 고유한 'Bundle ID'를 지정합니다. 스크립트는 ESC 키가 눌리는 이벤트를 감지한 후, 현재 활성화된 애플리케이션의 Bundle ID가 지정된 ID와 일치하는지 확인합니다. 일치할 경우에만 한영 전환 로직을 실행하여, 다른 앱에 영향을 주지 않고 원하는 앱에서만 기능이 동작하도록 만들 수 있습니다."
      - "@type": "Question"
        "name": "스크립트에 0.05초의 지연(delay)을 추가한 이유는 무엇인가요?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "ESC 키를 누르는 이벤트가 앱의 포커스 전환이나 모드 변경보다 미세하게 먼저 처리될 때가 있어, 스크립트가 간헐적으로 동작하지 않는 타이밍 문제가 발생할 수 있습니다. 0.05초의 짧은 지연을 추가함으로써 애플리케이션이 상태를 완전히 전환할 시간을 확보하여, 스크립트가 안정적으로 현재 앱의 상태를 인식하고 한영 전환을 실행할 수 있도록 보장하는 역할을 합니다."
---

## 왜 계속 mode 적용이 안됐지?

개발자라면 영어를 사용해서 주석을 작성하는것이 당연히 좋겠지만, 사실 한국인의 경우에는 모국어로 주석을 다는것만큼 빠르고 편리한 것이 없죠. 저도 되도록이면 영어를 사용하려고 노력하지만, 지금같이 포스팅을 작성하거나 제가 빠르게 이해하기 위한 글이나 주석을 작성할 때에는 일반적으로 한국어를 사용하곤 합니다.

지난번 포스팅 [Claude Code를 활용한 vim cheatsheet vscode extension 개발기](https://wnjoon.github.io/2025/09/17/vim-vscode-extenstion/)에서 말했듯이, 저는 항상 vim을 사용해서 멋지게(?) 개발하고싶은 욕심이 있습니다. 단축키가 잘 외워지지 않아 오히려 생산성을 떨어트리는 것 같아서 이를 도와줄 수 있는 [vscode 기반 extension](https://marketplace.visualstudio.com/items?itemName=xonxoon.quick-vim-cheatsheet)을 만들기도 했죠.

하지만 vim을 사용하기 어렵게 만드는 또 다른 이유가 있었는데 바로 '한/영 전환'입니다. vim은 normal/insert/visual 모드를 지원하고 있고, 명령어들은 normal, visual 모드에서 동작합니다. 명령어를 입력하기 위한 상태로 가려면 insert -> normal/visual 모드로 전환해야 하는데 이때 vim은 영문 단어를 이해합니다. 

그러다보니 한글로 열심히 글을 적다가 모드를 바꾸게 되면 한글이 계속 인식되어서 한영전환을 한번 더 해줘야 하는데 이는 굉장히 번거롭고 생산성을 저하시킵니다. 이 문제를 해결할 수 있는 방법을 찾다가 [hammerspoon](https://www.hammerspoon.org/)을 사용해서 해결할 수 있다는 것을 발견하여 공유합니다.

## Hammerspoon

Hammerspoon은 Lua라는 스크립트를 사용해서 MacOS의 일부 기능을 제어할 수 있도록 하는 도구입니다. 사용자는 스크립트 작성을 하고 이를 적용해서 OS와 어플리케이션 간에 발생하는 동작 사이에 Hook을 넣거나, 지금처럼 특정 버튼이 눌렸을때 원하는 커스텀 동작이 수행되도록 할 수 있습니다.

설치는 [이곳](https://github.com/Hammerspoon/hammerspoon/releases/tag/1.0.0)에서 할 수 있습니다.

## 스크립트 작성 및 적용 방법

Hammerspoon을 설치하면 메뉴바에 망치모양의 아이콘이 표시됩니다. 

- Open Config: Hammerspoon은 기본적으로 `~/Users/<YOUR_USERNAME>/.hammerspoon/init.lua` 파일을 통해 스크립트를 설정할 수 있습니다. 해당 메뉴는 이 설정 파일을 불러옵니다.
- Reload Config: `~/Users/<YOUR_USERNAME>/.hammerspoon/init.lua` 파일에 작성된 설정값으로 Hammerspoon을 재시작합니다. 변경된 스크립트를 즉시 적용할 때 사용합니다.
- Console: Hammerspoon의 콘솔을 열어 스크립트를 실행하거나 디버깅할 때 사용합니다. 

이 외에도 몇가지 메뉴들이 있지만, 일반적인 다른 앱들과 동일한 성격을 가집니다.

## 스크립트 적용하기

**1. 특정 앱에서만 동작할 것**

제가 목표하는 것은 'vscode에서 vim 작업을 하기 위해 esc 키를 눌렀을때 자동으로 영문으로 전환되도록 하는 것'입니다. 기존에는 karabiner를 이용해서 esc를 눌렀을때 무조건 한/영 전환이 되도록 설정했었는데요, 이렇게 하니 vscode와 무관하게 실제로는 한/영 전환이 필요하지 않은 어플리케이션에서도 한/영 전환이 되어버렸습니다. 

hammerspoon에서는 스크립트를 이용하여 이러한 부분을 세밀하게 조정할 수 있었기 때문에, `targetAppBundleID`를 이용하여 vscode에서 esc 키를 눌렀을때만 영문으로 전환되도록 설정할 수 있습니다. 

원하는 어플리케이션의 bundle ID를 확인하는 방법은 여러가지가 있는데요, 저는 hammerspoon의 console을 이용해보기로 했습니다. 아래의 코드를 콘솔에 넣으면 5초 후에 가장 앞에있는(활성화 되어있는) 앱의 bundle ID를 출력해줍니다.

```lua
-- print the bundle ID of the frontmost application after 5 seconds
hs.timer.doAfter(5, function()
  local app = hs.application.frontmostApplication()
  if app then
    print("Bundle ID of frontmost application: " .. app:bundleID())
    hs.alert.show("Bundle ID: " .. app:bundleID())
  else
    print("Could not find the frontmost application.")
  end
end)
```

처음에는 5초 후에 실행하는 조건을 넣지 않았었는데, 이렇게하니 console창의 bundle ID, 즉 hammerspoon의 bundle ID가 출력되었습니다. 그래서 console에 명령어를 넣고 원하는 앱을 누를 수 있을 정도의 여유로운 시간(사실 5초는 좀 길긴 합니다)을 설정해주었습니다.

저는 실제로 Windsurf를 사용하기 때문에, `com.exafunction.windsurf`가 출력되는 것을 확인할 수 있었습니다.

**2. 스크립트 적용하기** 

위에서 얻은 bundle ID를 이용하여 스크립트를 작성했습니다.

```lua
-- ID of the target application.
local targetAppBundleID = "com.exafunction.windsurf"

-- If a listener already exists upon reloading the config, stop it to prevent conflicts.
if escape_keyevent then
    escape_keyevent:stop()
end

-- Create a new event tap listener for key down events.
escape_keyevent = hs.eventtap.new({hs.eventtap.event.types.keyDown}, function(event)
    local flags = event:getFlags()
    local keycode = hs.keycodes.map[event:getKeyCode()]
    local frontApp = hs.application.frontmostApplication()

    -- 1. First, check if a key was pressed within the target application.
    if frontApp and frontApp:bundleID() == targetAppBundleID then

        -- 2. Check if the pressed key is ESC or the Ctrl+C combination.
        if keycode == 'escape' or (keycode == 'c' and flags.ctrl) then

            -- Add a 0.05-second delay to resolve timing issues.
            hs.timer.doAfter(0.03, function()
                local input_english = "com.apple.keylayout.ABC"
                local current_source = hs.keycodes.currentSourceID()

                -- [CASE 1] If the ESC key was pressed (original logic).
                if keycode == 'escape' then
                    if current_source ~= input_english then
                        hs.keycodes.currentSourceID(input_english)
                        -- print("ESC pressed: Switched to English.")
                    end
                
                -- [CASE 2] If the Ctrl+C key combination was pressed (new logic).
                elseif keycode == 'c' and flags.ctrl then
                    -- Perform this special action only if the current input source is not English.
                    if current_source ~= input_english then
                        -- print("Ctrl+C (in non-English): Intercepted.")
                        -- a. Change the input source to English.
                        hs.keycodes.currentSourceID(input_english)
                        -- b. Simulate an ESC key press.
                        hs.eventtap.keyStroke({}, 'escape')
                        -- print("--> Switched to English and sent ESC.")
                        -- c. Block the original Ctrl+C event from being processed. (Crucial)
                        return true
                    end
                end
            end)
        end
    end

    -- Allow all other key events to pass through.
    return false
end)

-- Start the listener.
escape_keyevent:start()
```

1. 중간에 보면 0.03s의 delay를 주는 부분이 있는데요, 이는 esc 키를 눌렀을때 앱이 포커스를 받는 시간이 필요하기 때문입니다. 이 부분이 없는 상태에서 작성했더니, 어느 시점에서는 아무리 esc 키를 눌러도 영문으로 전환되지 않았습니다. 확인해보니 실제로 esc가 동작하지 않더라구요. 정확한 원인을 파악하지는 못했지만, 아마 esc 키를 눌렀을때 앱이 포커스를 받는 시간이 필요하기 때문이라고 생각했고 해당 부분을 적용한 뒤에는 문제가 없었습니다. 

2. vim에서는 ctrl+c가 esc와 동일한 역할을 하는데요, 그래서 대부분 esc를 누르지 않고 ctrl+c를 사용합니다. 문제는 한글로 입력할 경우 ctrl+ㅊ으로 입력이 되어서 esc가 정상적으로 동작하지 않았습니다. 이를 해결하기 위해서 별도의 조건을 추가하였습니다.

혹시나 저와 같이 이러한 불편을 겪고계신 분들이 있다면 도움이 되었길 바랍니다.
