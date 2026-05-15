# vscode-scb
VSCode 上で Scrapbox ライクにガシガシ書く。

![](https://user-images.githubusercontent.com/23325839/177752042-1d46bdee-99d5-4ea5-9761-4c9d6e145daa.gif)

## 特徴
- [Scrapbox](https://scrapbox.io/) ライクなフォーマット
    - 箇条書きベース
    - 1-スペースインデント
    - `[ブラケット一つ]` で別ファイルにリンクする
- 素早い遷移
    - <kbd>Shift</kbd> + <kbd>Enter</kbd> でリンク先を新規 or 既存なら開ける
- .scb ファイルとしてつくります

以下例:

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

## なぜ Scrapbox ライクなのか？
- Scrapbox が好きだから
- 快適かつ雑に書きやすいから
- Scrapbox で 2 万ページ以上書いてきたからこそ、このフォーマットの強さを知っているから
- しかし Scrapbox はオフラインでは使えず、オフラインでは Markdown が主流だし、Obsidian も専用エディタかつ `[[ブラケットが二重]]` でイマイチだから

## 使い方
- 拡張機能としてインストールできる
    - [vscode-scb - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=stakiran.vscode-scb)
    - インストールすると、`.scb` ファイルに対してシンタックスハイライトその他機能が使えるようになります
- (v0.2.0以前をお使いの方):
    - 以下はアンインストールしてください（v0.3.0以降は統合されました）:
        - [vscode-scb syntax - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=stakiran.vscode-scb-syntax)
        - [vscode-scb commands - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=stakiran.vscode-scb-commands)
    - `settings.json` への記載も不要になったので、消して OK です

### キーボードショートカット
- <kbd>Shift</kbd> + <kbd>Enter</kbd>
    - `[リンク]` から `リンク.scb` を開きます
    - 存在しない場合は新規かつ未保存として開き、存在する場合はそのまま開きます
    - Windows ファイル名としての対策も万全です: スペースと特殊文字は `_` に置換します

カスタマイズしたければ、`vscodescb` でフィルタリングして各自設定してください:

![](https://user-images.githubusercontent.com/23325839/178083110-7459a456-c335-4880-a3f1-abe7e664a62f.png)

## Author
[stakiran](https://github.com/stakiran)
