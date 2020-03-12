const path = require('path')
const webpack = require('webpack')
const NodemonPlugin = require('nodemon-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const WebpackBar = require('webpackbar')

module.exports = {
  mode: 'development',
  watch: true,
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: 'eval',
  entry: ['./src/server.js'],
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false // and __filename return blank or /
  },
  externals: [nodeExternals()],
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
                    node: 'current'
                  },
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3,
                    proposals: true
                  }
                }
              ]
            ]
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
  plugins: [
    new WebpackBar(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new NodemonPlugin()
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.dev.js'
  }
}
