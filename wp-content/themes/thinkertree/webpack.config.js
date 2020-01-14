/**
 * WordPress Webpack Config
 */

// Webpack Plugins
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

// Build Config
module.exports = {
  entry: {
    'site': './src/site/index.js'
  },
  'output': {
    path: path.join(__dirname, 'dist/'),
    filename: '[name]-[hash].js',
    chunkFilename: '[id]-[hash].js',
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
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
      },
      {
        // Compile images
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './images/',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        // Compile svg images
        test: /\.(svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './images/',
              name: '[name].[ext]',
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ]
      },
      {
        // Compile docs
        test: /\.(pdf|docx|xlsx)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './docs/',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        // Compile fonts
        test: /\.(woff(2)?|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './fonts/',
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        // Use 'expose-loader' to make jQuery available to other scripts on global scope
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },{
            loader: 'expose-loader',
            options: '$'
        }]
      }
    ]
  },
  plugins: [
    // extract css into dedicated file
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
      chunkFilename: '[id]-[hash].css',
    }),
    // clean out dist directories on each build
    new CleanWebpackPlugin(),
    // generate a JSON file that matches the original filename with the hashed version
    new WebpackAssetsManifest({
      // Options go here
    }),
    // Add jQuery globally using ProvidePlugin
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    })
  ]
}