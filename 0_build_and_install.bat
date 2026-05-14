@echo off
setlocal
set version=0.3.0

call vsce package
code --install-extension vscode-scb-%version%.vsix
