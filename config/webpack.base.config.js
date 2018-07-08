'use strict';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '../'),
  mode: 'production',
  entry: './src/scripts/app.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "scripts/bundle.[hash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|temp/,
        use: {
          loader: "babel-loader",
        }
      },
      // {
      //   test: /\.css$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       name: '[name].[ext]',
      //       outputPath: 'styles/'
      //     }
      //   }
      // }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Todo App test',
      template: './src/index.html',
      minify: {
        removeComments: true
      }
    })
  ]
};