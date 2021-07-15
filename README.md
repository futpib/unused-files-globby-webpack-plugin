# unused-files-globby-webpack-plugin
> Glob all files that are not compiled by webpack under webpack's context

Install with npm:

```bash
npm i --save-dev unused-files-globby-webpack-plugin
```

Install with yarn:

```bash
yarn add --dev unused-files-globby-webpack-plugin
```

## Example usage

### `webpack.config.js`

```js
const { UnusedFilesWebpackPlugin } = require("unused-files-globby-webpack-plugin");

module.exports = {
  plugins: [
    new UnusedFilesWebpackPlugin({
      failOnUnused: true,
      globby: {
        patterns: [
          'src/**/*',
          'assets/**/*',
        ],
      },
    }),
  ],
};
```


## Options

```js
new UnusedFilesWebpackPlugin(options)
```

### options.failOnUnused

Emit _error_ instead of _warning_ in webpack compilation result.

* Default: `false`
* Explicitly set it to `true` to enable this feature

### options.globby.patterns

The (array of) pattern(s) to glob all files within the context.

* Default: `'**/*.*'`
* Directly passed to [`globby`](https://github.com/sindresorhus/globby#globbypatterns-options)

### options.globby.options

The options object pass to second parameter of `globby`.

* Default: `{ gitignore: true }`
* Directly passed to [`globby`](https://github.com/sindresorhus/globby#globbypatterns-options)
