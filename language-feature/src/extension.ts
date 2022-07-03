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

function getCurrentLine() {
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

function getStringBetweenBracket() {
	// 処理はだいぶ甘い。たとえば以下のケースも検出されてしまう。
	//   [google http:/...] これも検出される
	//   `リテラルの中の[リンク]` これも検出される
	//   コードブロック中でも検出される etc
	// が、回避手段はなさそう
	//   たとえば textmate scope を取得する VSCode API はなさそう
	//
	// まあ上記のケースで new or open 操作することも普通はないだろうから甘くていいか。

	const curPos = CursorPositioner.current();
	const curX = curPos.character;
	const currentLine = getCurrentLine();

	let leftpos = -1;
	let rightpos = -1;
	// <-- 方向に [ がないかを調べる
	let foundLeft = false;
	for (let x = curX - 1; x >= 0; x--) {
		const c = currentLine.charAt(x);
		if (c == ']') {
			break;
		}
		if (c == '[') {
			foundLeft = true;
			leftpos = x;
			break;
		}
	}
	// --> 方向に ] がないかを調べる
	let foundRight = false;
	for (let x = curX + 1; x < currentLine.length; x++) {
		const c = currentLine.charAt(x);
		if (c == '[') {
			break;
		}
		if (c == ']') {
			foundRight = true;
			rightpos = x;
			break;
		}
	}

	const RESULT_IN_CASE_OF_NOTFOUND = '';
	if (!foundLeft) {
		return RESULT_IN_CASE_OF_NOTFOUND;
	}
	if (!foundRight) {
		return RESULT_IN_CASE_OF_NOTFOUND;
	}
	const betweenString = currentLine.substring(leftpos + 1, rightpos);
	return betweenString;
}

async function doBracketBasedOnCurrentPosition() {
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

async function openLinkIfPossible() {
	const promise = vscode.commands.executeCommand('editor.action.openLink');
	return promise.then(
		() => {
			// 上手く判定してくれると思ったけど、常にこっちに来るみたい……
			return true;
		},
		() => {
			throw new Error('こっちには来ないみたいでーす in openlinkifpossible');
		}
	);
}

export async function newOrOpen() {
	// 範囲選択状態だったら、ブラケティングしておしまい
	if (isSelectedSingleLine()) {
		return doBracketBasedOnCurrentPosition();
	}

	// url やファイルパスだったらそれを開いておしまい……
	//   だけど仕様で「開けた」を検出できないのでおしまいにできない。
	//   が、開けた場合はブラケット内にいないはずなので下記の処理も通らないはず、
	//   というわけでスルーでいいと判断。
	await openLinkIfPossible();

	// ブラケットの内部かどうか判定して、内部「でない」ならおしまい
	const emptyOrBetweenString = getStringBetweenBracket();
	console.log(`"${emptyOrBetweenString}"`);

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
