@echo off
setlocal
set version=0.0.3

call vsce package
code --install-extension vscode-scb-syntax-%version%.vsix
