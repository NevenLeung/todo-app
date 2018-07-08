'use strict';

const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: 'bundle.[hash:8].js'
  }
});