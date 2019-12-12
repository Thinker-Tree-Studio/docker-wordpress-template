/**
 * WordPress Webpack Config
 */

// Webpack Dependencies
const path = require('path');

// Build Config
module.exports = {
  entry: {
    'site': './src/site/index.js'
  },
  'output': {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/')
  }
}