import type { TestInterface } from 'ava';
import anyTest from 'ava';
// Import UnusedFilesGlobbyWebpackPlugin from '.';

const test = anyTest as TestInterface<{
	TODO: true;
}>;

test.todo('todo');
