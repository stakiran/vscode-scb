import * as assert from 'assert';
import { before, beforeEach } from 'mocha';

import * as vscode from 'vscode';

import * as path from 'path'

import { getSelfDirectory, getEditor } from '../../extension';

// ここで採用している mocha + 非同期テストの書き方.
// - suite と test を使う.
//   - suite は describe, test は it の糖衣構文(たぶん)
//   - わかりやすいネーミングだと思うので採用
// - before や test の中では promise object を返す.
//   - これにより, (当該非同期処理が終わるまで)次の test に行くのを待たせることができる
//   - (mocha 側が await 的なのを頑張ってくれてる)
// - テストコードの終わりでは done() する
//   - これしないと Error: Timeout of 2000ms exceeded. になる
//   - mocha 曰く
//     - 非同期処理がいつ終わるかわからん
//     - デフォではタイムアウト 2000ms にしてます( Error: Timeout of 2000ms exceeded. を出します
//     - いつ終わるかわからんけど、いつか終わる ← これできないと困るでしょ？
//       - だったら done() を使ってね
//       - done は test(), もっというと it() に渡しますんで

function assertTrue(b: boolean){
	return assert.strictEqual(b, true)
}

suite('hello', () => {
	before(() => {});

	beforeEach(() => {
		const editor = getEditor();
		const doc = editor.document
		const lineCount = doc.lineCount
		const overEof = lineCount + 1

		const fofPos = new vscode.Position(0, 0)
		const eofPos = new vscode.Position(overEof, 0)
		const allRange = new vscode.Range(fofPos, eofPos);

		const clear = function(editBuilder: vscode.TextEditorEdit): void{
			const empty = ""
			editBuilder.replace(allRange, empty);
		}
		return editor.edit(clear)
	});

	test('hello1', async () => {
		assertTrue(1==99-98)
	});

	test('peek current document', async (done) => {
		const editor = getEditor()
		console.log(editor.document)
		done()
	});

});

