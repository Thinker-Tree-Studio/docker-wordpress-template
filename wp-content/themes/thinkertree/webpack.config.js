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
      // enable the js minification plugin
  		new UglifyJsPlugin({
  			cache: true,
  			parallel: true,
  			sourceMap: true
  		}),
      // enable the css minification plugin
  		new OptimizeCssAssetsPlugin({})
  	]
  },
  module: {
  	rules: [
      // compile all .scss files to plain old css
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
    // extract css into dedicated file
  	new MiniCssExtractPlugin({
  		filename: '[name].css'
  	})
  ]
}