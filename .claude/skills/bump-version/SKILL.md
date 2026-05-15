---
name: bump-version
description: vscode-scb のバージョンを更新する。package.json の version を上げ、CHANGELOG.md に新セクションを追加し、vsce package で .vsix をビルドする。
---

# bump-version

vscode-scb 拡張のリリース準備を行うスキル。以下を順番に実行する。

## 手順

### 1. 新バージョン番号をユーザーに確認

現在の `package.json` の `version` を読み取り、ユーザーに次のバージョンを聞く。

- 選択肢として patch / minor / major の3つを提示し、それぞれの具体的な番号も併記する
  - 例: 現在 `0.3.1` なら patch=`0.3.2` / minor=`0.4.0` / major=`1.0.0`
- ユーザーが任意の番号を直接指定することも許可する

ユーザーの回答を得るまで以降のステップに進まない。

### 2. package.json と package-lock.json の version を更新

以下のコマンドを実行する。

```
npm version <新バージョン> --no-git-tag-version
```

これで `package.json` と `package-lock.json`（トップレベルおよび `packages[""]` の2箇所）の version が一括で更新され、git タグは作成されない。

### 3. CHANGELOG.md に新セクションの枠だけ追加

`# Change Log` の直後（既存の最新セクションの上）に新しいセクションの**ヘッダーだけ**を挿入する。変更内容はユーザーが後から自分で書くので、本文には触らない。

挿入する内容:

```
## v<新バージョン>

```

（ヘッダー行と空行のみ。`- ...` の箇条書きは追加しない）

### 4. vsce package を実行

```
vsce package
```

を実行して `.vsix` ファイルをビルドする。

- 成果物が `vscode-scb-<新バージョン>.vsix` として生成されることを確認する
- エラーが出た場合はその内容をユーザーに報告して止まる

### 5. 完了報告

以下を1〜2文で報告する。

- 新しいバージョン番号
- 生成された .vsix ファイル名
- 「CHANGELOG.md に `## v<新バージョン>` の枠を追加したので、変更点を記入してください」とユーザーに案内する

git commit や vsce publish は **行わない**。ユーザーが手動で行う。

## 注意事項

- バージョン更新中にユーザーの確認なしで勝手にコミットしない
- CHANGELOG.md の既存セクションは絶対に書き換えない（追記のみ）
- `npm version` は `--no-git-tag-version` を必ず付けること。付け忘れると勝手に git commit と tag が作られてしまう
