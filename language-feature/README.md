# vscode-scb-commands

## How to use
See root page: https://github.com/stakiran/vscode-scb

## Development

### Start develop

```
$ git clone https://github.com/stakiran/vscode-scb
$ cd vscode-scb/language-features
$ npm install
$ code .
```

### Debug
事前準備:

- 1: .scb ファイルを適当に準備する
- 2: シンタックスハイライト(vscode-scb syntax のインストールと settings.json への記入) を行っておく
    - これしないと .scb ファイルがシンタックスハイライトされず読みづらいです

デバッグ:

- 1: デバッグペインから Run Extension を選ぶ
- 2: F5 キーで実行する

実行すると VSCode のウィンドウが新たに立ち上がるので、そのウィンドウで .scb ファイルを開きます。

### Test
unittest コードがあります。

- 1: デバッグペインから Extension Tests を選ぶ
- 2: F5 キーで実行する

実行すると VSCode のウィンドウが立ち上がり、テストが実行されます（終わったら自動で閉じられます）。結果は DEBUG CONSOLE に表示されます。

### Build

```
$ vsce package
```

### Lint

```
$ npm run lint -s
```

### Pretty sources

```
$ npm run pretty 
```

## Author
[stakiran](https://github.com/stakiran)
