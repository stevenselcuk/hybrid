const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const WebpackBar = require('webpackbar')

module.exports = {
  mode: 'production',
  entry: ['./src/server.js'],
  target: 'node',
  watch: false,
  externals: [nodeExternals()],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false // and __filename return blank or /
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: 'commonjs',
                  targets: {
                    node: 13
                  },
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3,
                    proposals: true
                  }
                }
              ]
            ]
            //       plugins: ['add-module-exports']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.prod.js',
    libraryTarget: 'commonjs'
  },
  plugins: [
    new WebpackBar(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PORT: JSON.stringify(process.env.PORT),
        REDIS_HOST: JSON.stringify(process.env.REDIS_HOST),
        REDIS_PORT: JSON.stringify(process.env.REDIS_PORT)
      }
    })
  ]
}
