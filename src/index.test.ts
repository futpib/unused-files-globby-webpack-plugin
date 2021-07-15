import type { TestInterface } from 'ava'; // eslint-disable-line ava/use-test
import anyTest from 'ava';
// Import UnusedFilesGlobbyWebpackPlugin from '.';

const test = anyTest as TestInterface<{
	EDITOR: string;
}>;

test.beforeEach(t => {
	const { EDITOR } = process.env;
	process.env.EDITOR = 'cat';
	Object.assign(t.context, {
		EDITOR,
	});
});

test.afterEach(t => {
	const { EDITOR } = t.context;
	Object.assign(process.env, {
		EDITOR,
	});
});

test.todo('todo');
