/**
 * WordPress Webpack Config
 */

// Webpack Plugins
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Build Config
module.exports = {
  entry: {
    'site': './src/site/index.js'
  },
  'output': {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/')
  },
  optimization: {
  	minimizer: [
  		new UglifyJsPlugin({
  			cache: true,
  			parallel: true,
  			sourceMap: true
  		}),
  		new OptimizeCssAssetsPlugin({})
  	]
  },
  module: {
  	rules: [
  		{
  			test: /\.scss$/,
  			use: [
  				MiniCssExtractPlugin.loader,
  				'css-loader',
  				'sass-loader'
  			]
  		}
  	]
  },
  plugins: [
  	new MiniCssExtractPlugin({
  		filename: '[name].css'
  	})
  ]
}