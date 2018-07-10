'use strict';

const path = require('path');
const merge = require('webpack-merge');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      root: path.join(__dirname, '../'),
    }),
    new CopyWebpackPlugin([
      {
        from: './src/styles/',
        to: 'styles/'
      }
    ]),
  ]
});