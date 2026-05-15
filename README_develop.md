# 開発者向け情報

## 開発方法
compile:

```
$ npm run compile
```

build:

```
$ vsce package
```

install from vsix:

```
$ code --install-extension vscode-scb-VERSION.vsix
```

publish(author only):

```
$ vsce login stakiran (once)
$ vsce publish
```

参考:

- PAT の取り方
    - azure devops にログインする必要がある: <https://aex.dev.azure.com/me?mkt=ja-JP>
- Marketplace の publish 状況確認
    - <[Manage Extensions | Visual Studio Marketplace](https://marketplace.visualstudio.com/manage/publishers/stakiran)>

## Claude の活用
- v0.3.0 以降は Claude Code に任せてつくっている
- CLAUDE.md: v0.4.0 のときに init でつくらせた
