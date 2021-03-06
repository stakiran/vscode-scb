import * as assert from 'assert';
import { before, beforeEach } from 'mocha';

import { getEditor } from '../../extension';

function assertTrue(b: boolean){
	return assert.strictEqual(b, true)
}

suite('hello', () => {
	before(() => {
		console.log('before on mocha');
	});

	beforeEach(() => {
		console.log('beforeEach on mocha');
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

