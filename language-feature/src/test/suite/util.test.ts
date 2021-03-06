import * as assert from 'assert';

import { fixInvalidFilename } from '../../util';

function eq(expect: string, actual: string){
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
	test('fixInvalidFilename 複数回置換の全パターン', async () => {
		const s = '_'.repeat(30);
		eq(
			`${s}.scb`,
			fixInvalidFilename(' \\/:*?"<>|\\/:*?"<>|\\/:*?"<>|  .scb'),
		);
	});
});

