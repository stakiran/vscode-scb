# vscode-scb syntax

## build

```
$ vsce package
```

## test

### with vsix file

```
$ code --install-extension vscode-scb-0.0.1.vsix
```

VSCode の再起動をして scb ファイルを開き直す。あるいは ctrl + shift + x から installed の vscode-scb syntax を見つけて disable → enable をする（「Extension: vscode-scb syntax - syntax - Visual Studio Code」のタブを開いておくと便利）。

## ノート

```json
    "editor.renderWhitespace": "none"
```

## Author
[stakiran](https://github.com/stakiran)
