import path from 'path';
import globby from 'globby';
import { outdent } from 'outdent';
import deepExtend from 'deep-extend';
import type { Compilation, Compiler, WebpackError } from 'webpack';

function getFileDepsMap(compilation: Compilation) {
	const fileDepsBy = [ ...compilation.fileDependencies ].reduce<Record<string, boolean>>(
		(acc, usedFilepath) => {
			acc[usedFilepath] = true;
			return acc;
		},
		{},
	);

	const { assets } = compilation;
	for (const assetRelpath of Object.keys(assets)) {
		// @ts-expect-error
		const { existsAt } = assets[assetRelpath];
		fileDepsBy[existsAt] = true;
	}

	return fileDepsBy;
}

async function applyAfterEmit(compiler: Compiler, compilation: Compilation, plugin: UnusedFilesGlobbyWebpackPlugin) {
	try {
		const fileDepsMap = getFileDepsMap(compilation);

		const files = await globby(...plugin.getGlobbyArguments());

		const unused = files.filter(
			it => !fileDepsMap[path.join(compiler.context, it)],
		);

		if (unused.length > 0) {
			throw new Error(outdent`
				Found unused files:
				${unused.join('\n')}
			`);
		}
	} catch (error: unknown) {
		if (plugin.options.failOnUnused && compilation.bail) {
			throw error;
		}

		const errorsList = plugin.options.failOnUnused
			? compilation.errors
			: compilation.warnings;
		errorsList.push(error as WebpackError);
	}
}

export interface UnusedFilesGlobbyWebpackPluginOptions {
	failOnUnused?: boolean;

	globby?: {
		patterns?: string | readonly string[];
		options?: globby.GlobbyOptions;
	};
}

export class UnusedFilesGlobbyWebpackPlugin {
	static defaultOptions: UnusedFilesGlobbyWebpackPluginOptions = {
		globby: {
			patterns: '**/*.*',
			options: {
				gitignore: true,
			},
		},
	};

	options: UnusedFilesGlobbyWebpackPluginOptions;

	constructor(options: UnusedFilesGlobbyWebpackPluginOptions = {}) {
		this.options = deepExtend({}, UnusedFilesGlobbyWebpackPlugin.defaultOptions, options);
	}

	getGlobbyArguments(): Parameters<typeof globby> {
		return [
			this.options?.globby?.patterns ?? [],
			this.options?.globby?.options,
		];
	}

	apply(compiler: Compiler) {
		compiler.hooks.afterEmit.tapAsync(
			UnusedFilesGlobbyWebpackPlugin.name,
			async (compilation, done) => {
				try {
					await applyAfterEmit(compiler, compilation, this);
					done();
				} catch (error: unknown) {
					done(error as Error);
				}
			},
		);
	}
}

export default UnusedFilesGlobbyWebpackPlugin;
