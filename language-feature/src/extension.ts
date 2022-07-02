import * as vscode from 'vscode';

import * as moment from 'moment';
import * as child_process from 'child_process';
const exec = child_process.exec;

moment.locale('ja');

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

class DateTime {
	private _momentinst: moment.Moment;
	private _format: string;

	public constructor() {
		this._momentinst = moment();
		this._format = 'YYYY/MM/DD';
	}

	public toString() {
		return this._momentinst.format(this._format);
	}
}

class DateTimeUtil {
	static todayString(): string {
		const dtobj = new DateTime();
		return dtobj.toString();
	}

	static nowtimeString(): string {
		return moment().format('HH:mm');
	}
}

function showMenu() {
	vscode.commands.executeCommand('editor.action.showContextMenu');
}

export async function newOrOpen() {
	showMenu();

	const todaystring = DateTimeUtil.todayString();
	vscode.window.showInformationMessage(
		`今日は${todaystring}です。`
	);
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
