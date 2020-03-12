/* eslint global-require: off */

const developmentEnvironments = ['development', 'test']
const developmentPlugins = []
const productionPlugins = [require('babel-plugin-dev-expression')]

module.exports = api => {
  const development = api.env(developmentEnvironments)
  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { node: 'current' },
          useBuiltIns: 'usage',
          corejs: 3
        }
      ],
      require('@babel/preset-flow')
    ],
    plugins: [
      [
        'babel-plugin-root-import',
        {
          paths: [{ rootPathPrefix: '~', rootPathSuffix: 'src' }]
        }
      ],
      require('@babel/plugin-proposal-function-bind'),
      require('@babel/plugin-proposal-export-default-from'),
      require('@babel/plugin-proposal-logical-assignment-operators'),
      [require('@babel/plugin-proposal-optional-chaining'), { loose: false }],
      [
        require('@babel/plugin-proposal-pipeline-operator'),
        { proposal: 'minimal' }
      ],
      [
        require('@babel/plugin-proposal-nullish-coalescing-operator'),
        { loose: false }
      ],
      require('@babel/plugin-proposal-do-expressions'),
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      require('@babel/plugin-proposal-function-sent'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-throw-expressions'),
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      ['lodash'],
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      require('@babel/plugin-proposal-json-strings'),
      ...(development ? developmentPlugins : productionPlugins)
    ]
  }
}
