---
title: "Automatically Switch to English When Pressing ESC in Vim with Hammerspoon"
author: "wonjoon"
authorAvatarPath: "/avatar.jpeg"
date: "2025-09-21"
slug: "hammerspoon-key-switch"
summary: "Sharing my experience of improving productivity by creating a custom script using Hammerspoon"
description: "One of the common difficulties Koreans face when using Vim is that after writing comments in Korean, changing the mode leaves the input source as Korean, requiring an extra step to switch back to English. This causes a significant drop in productivity, and many are using Hammerspoon to solve it, so I'm sharing the method."
toc: true
readTime: true
autonumber: false
math: true
tags: ["dev", "vscode", "vim", "tools", "2025"]
keywords: ["vim", "hammerspoon", "auto lang update"]
showTags: true
hideBackToTop: false
aliases: 
  - /2025/09/21/auto-lang-updated-when-esc-using-hs-en/
# fediverse: "@username@instance.url"
schema:
  "@context": "https://schema.org"
  "@type": "Article"
  "author": {
    "@type": "Person",
    "name": "wonjoon"
  }
  "headline": "Automatically Switch to English When Pressing ESC in Vim with Hammerspoon"
  "description": "One of the common difficulties Koreans face when using Vim is that after writing comments in Korean, changing the mode leaves the input source as Korean, requiring an extra step to switch back to English. This causes a significant drop in productivity, and many are using Hammerspoon to solve it, so I'm sharing the method."
  "keywords": ["vim", "hammerspoon", "auto lang update"]
  "mainEntity": 
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "Why is automatic Korean/English switching needed in Vim?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "After writing comments in Korean in Vim's Insert mode, pressing the ESC key to switch to Normal mode leaves the input source in the Korean state. Since Normal mode commands must be entered in English, the user must manually press the Korean/English key to switch, which is cumbersome. This process significantly reduces productivity more than one might think, which is why automation is needed."
      - "@type": "Question"
        "name": "What tool is used to solve this problem?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "We use the macOS automation tool, Hammerspoon. Hammerspoon allows you to control the OS or specific application behaviors using Lua scripts. This makes it possible to implement custom features like 'Automatically switch the input source to English when the ESC key is pressed in a specific app'."
      - "@type": "Question"
        "name": "How do you configure the Hammerspoon script to only run in a specific app (e.g., VSCode)?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "You specify the target application's unique 'Bundle ID' within the script. The script detects the ESC key press event, then checks if the currently active application's Bundle ID matches the specified ID. The language switching logic is executed only if it matches, allowing the feature to work only in the desired app without affecting other apps."
      - "@type": "Question"
        "name": "Why was a 0.05-second delay added to the script?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "Sometimes, the ESC key press event is processed slightly before the app focus or mode change, which can cause timing issues where the script intermittently fails to work. By adding a short 0.05-second delay, it ensures the application has time to fully transition its state, allowing the script to reliably recognize the current app's state and execute the language switch."
---

## Why wasn't the mode applying properly

It's obviously good for developers to write comments in English, but for Koreans, there's nothing as fast and convenient as writing comments in their native language. I also try to use English as much as possible, but when I'm writing a post like this one or writing notes or comments for my own quick understanding, I generally use Korean.

As I mentioned in my last post, [Development Story: Creating a Vim Cheatsheet VSCode Extension Using Claude Code](https://wnjoon.github.io/2025/09/17/vim-vscode-extenstion/), I always have the ambition to code stylishly(?) using Vim. Because I couldn't memorize the shortcuts well, it seemed to be decreasing my productivity, so I even made a [VSCode-based extension](https://marketplace.visualstudio.com/items?itemName=xonxoon.quick-vim-cheatsheet) to help with this.

However, there was another reason that made Vim difficult to use: **'Korean/English switching'**. Vim supports normal/insert/visual modes, and the commands operate in normal and visual modes. To get to the state for entering commands, you have to switch from insert -> normal/visual mode, and at this time, Vim understands English words.

As a result, if you're writing in Korean and then change modes, the input source remains Korean, forcing you to switch the language one more time, which is very cumbersome and reduces productivity. While searching for a way to solve this problem, I discovered it can be solved using [Hammerspoon](https://www.hammerspoon.org/) and am sharing it.

## Hammerspoon

Hammerspoon is a tool that allows you to control parts of a MacOS's functionality using a script called Lua. Users can write and apply scripts to insert Hooks between actions occurring between the OS and applications, or, as in this case, make a custom action execute when a specific button is pressed.

You can install it from [here](https://github.com/Hammerspoon/hammerspoon/releases/tag/1.0.0).

## How to Write and Apply the Script

When you install Hammerspoon, a hammer-shaped icon will appear in the menu bar.

- Open Config: By default, Hammerspoon allows you to configure scripts via the `~/Users/<YOUR_USERNAME>/.hammerspoon/init.lua` file. This menu loads that configuration file.
- Reload Config: Restarts Hammerspoon with the settings written in the `~/Users/<YOUR_USERNAME>/.hammerspoon/init.lua` file. Used to apply changed scripts immediately.
- Console: Opens the Hammerspoon console to run or debug scripts.

There are a few other menus, but they have the same functions as in other typical apps.

## Applying the Script

**1. Make it work only in a specific app**

My goal is 'to automatically switch to English when the ESC key is pressed while working in Vim within VSCode'. Previously, I used Karabiner to make it switch to Korean/English unconditionally when ESC was pressed, but this caused the language to switch even in applications unrelated to VSCode where the switch wasn't necessary.

In Hammerspoon, these aspects could be finely tuned using a script, so I was able to set it to switch to English only when the ESC key is pressed in VSCode by using the `targetAppBundleID`.

There are several ways to check the bundle ID of the desired application, but I decided to try using the Hammerspoon console. If you put the code below into the console, it will print the bundle ID of the frontmost (active) app after 5 seconds.

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

At first, I didn't include the condition to run it after 5 seconds, and doing so printed the console window's bundle ID, i.e., Hammerspoon's bundle ID. So, I set a leisurely amount of time (frankly, 5 seconds is a bit long) to be able to put the command in the console and click the desired app.

Since I actually use Windsurf, I was able to confirm that com.exafunction.windsurf was printed.

**2. Applying the script**

I wrote the script using the bundle ID obtained above.

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

            -- Add a 0.03-second delay to resolve timing issues.
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

1. You'll notice a part in the middle that gives a 0.03s delay. This is because the app needs time to receive focus when the ESC key is pressed. When I wrote it without this part, at some point, it wouldn't switch to English no matter how many times I pressed ESC. Upon checking, I found that ESC wasn't actually working. I couldn't pinpoint the exact cause, but I assumed this was because the app needs time to receive focus when the ESC key is pressed, and after applying that part, the problem was gone.

2. In Vim, Ctrl+C serves the same role as ESC, so most people use Ctrl+C instead of pressing ESC. The problem was that when typing in Korean, it would be entered as Ctrl+ㅊ, causing ESC to not work properly. To solve this, I added a separate condition.

I hope this helps anyone who has been experiencing the same inconvenience as me.
