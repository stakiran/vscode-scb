# vscode-scb
![](https://user-images.githubusercontent.com/23325839/177752042-1d46bdee-99d5-4ea5-9761-4c9d6e145daa.gif)

## What is vscode-scb?
- [Scrapbox](https://scrapbox.io/) like format
    - list, list and list
    - 1-space indent
    - `[single bracket]` to link to another file
- `.scb` file

```scb
line
line
indents
 indent1
  indent2
   indent3
     indent4
      indent5
special lines
 >quote
 literal `1+1=2`
codeblock
 pattern1
  code:hello.py
print('hello.')
  :c
 pattern2
  code:hello.py
   print('hello.')
  :c
```

## Why scrapbox like format?
Because:

- I love Scrapbox!
- Scrapbox like format is comfortable for writing roughly.

FYI: My scrapbox project is https://scrapbox.io/sta/ and over 10000+ pages.

## How to use
- 1: Install syntax
    - [vscode-scb syntax - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=stakiran.vscode-scb-syntax)
    - And **Write the settings to your settings.json** because turning on hilight.
        - https://github.com/stakiran/vscode-scb/blob/master/syntax/settings.json
- 2: Install commands
    - [vscode-scb commands - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=stakiran.vscode-scb-commands)

### Keyboard Shortcut
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>1</kbd>
    - Open link text as an existing or new file.

## Author
[stakiran](https://github.com/stakiran)
