import * as vscode from 'vscode';

import * as child_process from 'child_process';
const exec = child_process.exec;

import * as util from './util';

const isMacOS = process.platform == 'darwin';
const SELF_EXTENSION_ID = 'stakiran.vscodescb-language-features';

function abort(message: string) {
	console.log(message);
	// Object is possibly 'undefined' を防げないので呼び出し元で.
	//throw new Error(`Error: ${message}`);
}

export function getSelfDirectory() {
	const selfExtension = vscode.extensions.getExtension(SELF_EXTENSION_ID);
	if (selfExtension === undefined) {
		abort('No extension found in getSelfDirectory()');
		throw new Error();
	}
	const selfDir = selfExtension.extensionPath;
	return selfDir;
}
function getFullpathOfActiveTextEditor() {
	const editor = getEditor();
	const fullpath = editor.document.uri.fsPath;
	return fullpath;
}

function input(message: string): Thenable<string | undefined> {
	const options = {
		placeHolder: message,
	};
	return vscode.window.showInputBox(options);
}

export function getEditor() {
	const editor = vscode.window.activeTextEditor;
	if (editor == null) {
		abort('activeTextEditor is null currently.');
		throw new Error();
	}
	return editor;
}

function showMenu() {
	vscode.commands.executeCommand('editor.action.showContextMenu');
}

export async function newOrOpen() {
	showMenu();

	const todaystring = util.DateTimeUtil.todayString();
	vscode.window.showInformationMessage(
		`今日は${todaystring}です。`
	);

	// 範囲選択状態だったら、ブラケティングしておしまい

	// url やファイルパスだったらそれを開いておしまい

	// ブラケットの内部かどうか判定して、内部「でない」ならおしまい

	// ブラケット内文字列をファイルとみなして、
	// 1: windowsで扱えるファイル名に変換
	// 2: 1のファイルが存在してるか調べて、してるならそれ開いておしまい
	// 3: 1のファイルを新規して開く
	//    できれば秀丸エディタみたいに「保存操作するまでファイルが存在しない」にしたい
}

export function activate(context: vscode.ExtensionContext): void {
	const _dummy_for_menu_separator = vscode.commands.registerCommand(
		'vscodescb.dummy',
		() => {} // eslint-disable-line @typescript-eslint/no-empty-function
	);

	const _new_or_open = vscode.commands.registerCommand('vscodescb.neworopen', () => {
		newOrOpen();
	});

	context.subscriptions.push(_dummy_for_menu_separator, _new_or_open);
}
