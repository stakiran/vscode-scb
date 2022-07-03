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

function infoDialog(message: string) {
	vscode.window.showInformationMessage(message);		
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

export function getEditor() {
	const editor = vscode.window.activeTextEditor;
	if (editor == null) {
		abort('activeTextEditor is null currently.');
		throw new Error();
	}
	return editor;
}

function getCurrentLine(){
	const editor = getEditor();
	const doc = editor.document;
	const currentLine = doc.lineAt(CursorPositioner.current()).text;
	return currentLine;
}

class CursorPositioner {
	static current(): vscode.Position {
		const editor = getEditor();
		const curPos = editor.selection.active;
		return curPos;
	}

	static currentSelection(): vscode.Selection {
		const editor = getEditor();
		return editor.selection;
	}

	static rangeBetweenCurrentSelection(): vscode.Range {
		const curSel = this.currentSelection();
		const range = new vscode.Range(curSel.start, curSel.end);
		return range;
	}
}

function isSelectedSingleLine() {
	const curSel = CursorPositioner.currentSelection();
	if (curSel.start.line != curSel.end.line) {
		return false;
	}
	if (curSel.start.character != curSel.end.character) {
		return true;
	}
	return false;
}

async function doBracketBasedOnCurrentPosition(){
	const curSel = CursorPositioner.currentSelection();

	// 手抜きだが以下、単一行選択がされていると仮定しちゃう。

	const curRange = CursorPositioner.rangeBetweenCurrentSelection();
	const currentLine = getCurrentLine();
	const currentSelectedText = currentLine.substring(
		curRange.start.character,
		curRange.end.character
	);
	const afterString = `[${currentSelectedText}]`;

	const editor = getEditor();
	const f = function (editBuilder: vscode.TextEditorEdit): void {
		editBuilder.replace(curRange, afterString);
	};
	return editor.edit(f).then((isSucceedEdit) => {
		return isSucceedEdit;
	});
}

export async function newOrOpen() {
	// 範囲選択状態だったら、ブラケティングしておしまい
	if(isSelectedSingleLine()){
		return doBracketBasedOnCurrentPosition();
	}

	// url やファイルパスだったらそれを開いておしまい

	// ブラケットの内部かどうか判定して、内部「でない」ならおしまい

	// ブラケット内文字列をファイルとみなして、
	// 1: windowsで扱えるファイル名に変換
	// 2: 1のファイルが存在してるか調べて、してるならそれ開いておしまい
	// 3: 1のファイルを新規して開く
	//    できれば秀丸エディタみたいに「保存操作するまでファイルが存在しない」にしたい

	return Promise.resolve(true);
}

export function activate(context: vscode.ExtensionContext): void {
	const _dummy_for_menu_separator = vscode.commands.registerCommand(
		'vscodescb.dummy',
		() => {} // eslint-disable-line @typescript-eslint/no-empty-function
	);

	const _new_or_open = vscode.commands.registerCommand(
		'vscodescb.neworopen',
		() => {
			newOrOpen();
		}
	);

	context.subscriptions.push(_dummy_for_menu_separator, _new_or_open);
}
