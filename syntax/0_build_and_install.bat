@echo off
setlocal
set version=0.0.1

call vsce package
code --install-extension vscode-scb-%version%.vsix
