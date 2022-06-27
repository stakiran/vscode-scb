# vscode-scb

## TODO
- build.bat, build.sh の修正

## システム要件
- Visual Studio Code
- Windows 10+

## インストール
vscode-scb は以下から構成されます。

- シンタックスハイライトをつかさどる syntax
- 各種操作をつかさどる language-features

インストールには上記二点のインストールが必要です。

手順:

- 1: syntax の vsix ファイルを VSCode にインストールする
- 2: syntax の settings.json を、あなたの settings.json に追記する
  - **これをしないと .scb ファイルの中身がハイライトされません**
- 3: language-features の vsix ファイルを VSCode にインストールする

なお、vsix ファイルのインストールは Command Palette > Install from VSIX あるいは `code --install-extension xxxxx.vsix` にて行なえます。

インストールが完了すると、拡張機能 vscode-scb syntax と vscode-scb command の二つが enabled になります。

## 使い方
.scb ファイルを開くと、シンタックスハイライトが効いているはずです。また .scb ファイル内に限り、各操作が有効になっています。以下方法より呼び出せます。

- editor/context(エディタ上での右クリックメニュー)
- Command palette(Ctrl + Shift + P) > `vscode-scb` で検索
- Key bindings(キーボードショートカット)

## License
[MIT license](LICENSE)

## Author
[stakiran](https://github.com/stakiran)

## おわりに
その他詳しい情報は、各々の README を見てください。
