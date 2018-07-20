'use strict';

const path = require('path');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../docs')
  },
  plugins: [
    new CleanWebpackPlugin('docs', {
      root: path.join(__dirname, '../'),
      // allowExternal: true
    }),
    new CopyWebpackPlugin([
      {
        from: './src/styles/',
        to: 'styles/'
      }
    ]),
  ]
});