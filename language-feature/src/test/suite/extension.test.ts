import * as assert from 'assert';
import { before, beforeEach } from 'mocha';

import * as vscode from 'vscode';

import * as path from 'path'

import { getSelfDirectory, getEditor, endTask, copyTask } from '../../extension';
import { addTask, addInbox, startTask } from '../../extension';
import { LineTester } from '../../extension';

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

class IDE {
	static openTesteeFile(){
		const TESTEE_FILENAME = 'test.trita'
		const TESTEE_DIRECTORY = path.resolve(getSelfDirectory(), 'src', 'test', 'suite')
		const TESTEE_FULLLPATH = path.resolve(TESTEE_DIRECTORY, TESTEE_FILENAME)
		return vscode.workspace.openTextDocument(TESTEE_FULLLPATH)
	}

	static lineTextAt(lineNumber: number){
		const editor = getEditor();
		const doc = editor.document
		const line = doc.lineAt(lineNumber)
		return line.text
	}

	static goLineAt(lineNumber: number){
		const editor = getEditor();
		const curPos = editor.selection.active;
		const newY = lineNumber;
		const newX = curPos.character;
		const newPos = curPos.with(newY, newX);
		const sel = new vscode.Selection(newPos, newPos);
		editor.selection = sel;
	}
}
const L = IDE.lineTextAt

function assertTrue(b: boolean){
	return assert.strictEqual(b, true)
}

function assertInbox(line: string){
	assertTrue(LineTester.isInbox(line))
}

function assertTodo(line: string){
	const isToday = !(LineTester.isNotToday(line))
	assertTrue(isToday)
}

function assertStarting(line: string){
	const isToday = !(LineTester.isNotToday(line))
	const isStarted = !(LineTester.isNotStarted(line))
	const isNotEnded = LineTester.isNotEnded(line)
	assertTrue(isToday)
	assertTrue(isStarted)
	assertTrue(isNotEnded)
}

function assertDone(line: string){
	const isToday = !(LineTester.isNotToday(line))
	const isStarted = !(LineTester.isNotStarted(line))
	const isEnded = !(LineTester.isNotEnded(line))
	assertTrue(isToday)
	assertTrue(isStarted)
	assertTrue(isEnded)
}

suite('Test tritask operations on the VSCode Editor layer.', () => {
	before(() => {
		const promise = IDE.openTesteeFile()
		return promise.then(
			() => {
				// doc: vscode.TextDocument が渡ってきますが, 特にすることないです
			},
			(err) => {
				console.log(err)
				assert.fail('テスト用ファイルをopenできませんでした.')
			}
		)
	});

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

	test('add task and inbox', async () => {
		let isSuccess = false

		isSuccess = await addTask()
		assertTrue(isSuccess)
		isSuccess = await addInbox()
		assertTrue(isSuccess)
		isSuccess = await addInbox()
		assertTrue(isSuccess)
		isSuccess = await addTask()
		assertTrue(isSuccess)
		isSuccess = await addTask()
		assertTrue(isSuccess)

		const editor = getEditor()
		const lineCount = editor.document.lineCount
		const LINECOUNT_OF_EMPTYFILE = 1
		assert.strictEqual(lineCount, 5 + LINECOUNT_OF_EMPTYFILE)

		// a一つ上の行に add されていくので逆順に検査
		assertTodo(L(0))
		assertTodo(L(1))
		assertInbox(L(2))
		assertInbox(L(3))
		assertTodo(L(4))
	});

	test('start, end and copy task', async () => {
		let isSuccess = false

		isSuccess = await addInbox()
		assertTrue(isSuccess)
		isSuccess = await addTask()
		assertTrue(isSuccess)
		isSuccess = await addTask()
		assertTrue(isSuccess)
		isSuccess = await addTask()
		assertTrue(isSuccess)

		// line:0 4 add / これは todo task にする
		// line:1 3 add / これは starting task にする
		// line:2 2 add / これは done task にする
		// line:3 1 inbox
		IDE.goLineAt(1)
		await startTask()
		IDE.goLineAt(2)
		await startTask()
		await endTask()

		assertTodo(L(0))
		assertStarting(L(1))
		assertDone(L(2))
		assertInbox(L(3))

		// line:0 4 add / これは todo task にする
		// line:1 同上コピー <= todo のまま
		// line:2 3 add / これは starting task にする
		// line:3 同上コピー <= todo になる
		// line:4 2 add / これは done task にする
		// line:5 同上コピー <= todo になる
		// line:6 1 inbox
		// line:7 同上コピー <= inbox のまま
		//
		// コピーは上から順に行うが, 間にコピーされた行がはさまるので 2 行ずつズレながらやれば良い.
		IDE.goLineAt(0)
		await copyTask()
		IDE.goLineAt(2)
		await copyTask()
		IDE.goLineAt(4)
		await copyTask()
		IDE.goLineAt(6)
		await copyTask()

		assertTodo(L(1))
		assertTodo(L(3))
		assertTodo(L(5))
		assertInbox(L(7))
	});

	test('start and end all case', async () => {
		let isSuccess = false

		isSuccess = await addTask()
		assertTrue(isSuccess)
		assertTodo(L(0))

		IDE.goLineAt(0)

		// (start) (end)
		// o が time 記入している, x がしていない.
		//
		// o o -> o x  Pattern1
		// o o -> x o  Pattern2
		// o o -> x x  しない. 2step
		// o x -> o o  Pattern1
		// o x -> x x  Pattern1
		// o x -> x o  しない. 2step
		// x o -> o x  Don't care(加えて2step)
		// x o -> o o  Don't care
		// x o -> x x  Don't care
		// x x -> o o  しない. 2step
		// x x -> o x  Pattern1
		// x x -> x o  Pattern2

		// pattern1: x x -> o o -> x x と往復できるか
		// ---------

		// x x -> o x
		await startTask()
		assertStarting(L(0))

		// o x -> o o
		await endTask()
		assertDone(L(0))

		// o o -> o x
		await endTask()
		assertStarting(L(0))

		// o x -> x x
		await startTask()
		assertTodo(L(0))

		// pattern2: Don't care に至る入り口をガードできているか
		// ---------

		// x x -> x o はならない. 開始してないので終了できない.
		await endTask()
		assertTodo(L(0))

		// 事前に x x -> o o する.
		await startTask()
		await endTask()
		// o o -> x o はならない. 終了しているのに開始前にすることはできない.
		await startTask()
		assertDone(L(0))

	});

	test('peek current document', async (done) => {
		const editor = getEditor()
		console.log(editor.document)
		done()
	});

});

