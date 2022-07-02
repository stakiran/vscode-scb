import * as assert from 'assert';
import { before, beforeEach } from 'mocha';

import { fixInvalidFilename } from '../../util';

function eq(expect: any, actual: any){
	return assert.strictEqual(expect, actual)
}

suite('', () => {
	test('fixInvalidFilename nochange', async () => {
		eq(
			'変化しないパターン.scb',
			fixInvalidFilename('変化しないパターン.scb'),
		);
	});
	test('fixInvalidFilename change', async () => {
		eq(
			'2022_07_03_07_09_26.scb',
			fixInvalidFilename('2022/07/03 07:09:26.scb'),
		);
		eq(
			'_c__Windows_System32_',
			fixInvalidFilename('"c:\\Windows\\System32"'),
		);
	});
});

