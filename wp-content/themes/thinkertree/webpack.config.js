/**
 * WordPress Webpack Config
 */

// Webpack Plugins
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

// Build Config
module.exports = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist/"),
    filename: "[name]-[contenthash].js",
    chunkFilename: "[id]-[contenthash].js",
    // clean the /dist folder before each build
    clean: true,
  },
  // Webpack default compiling mode is Production, changed to Development to see a verbose, human-readable file
  mode: "development",
  // Enable sourcemap
  devtool: "cheap-module-source-map",
  // Some optimization settings, including minifications
  optimization: {
    minimizer: [
      // JS minification
      new TerserPlugin({
        parallel: true,
      }),
      // CSS minification
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].css",
      chunkFilename: "[id]-[contenthash].css",
    }),
    // Move images, fonts, and docs from src to dist folder
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "src/docs", to: "docs" },
        { from: "src/fonts", to: "fonts" },
      ],
    }),
    // Add jQuery globally using ProvidePlugin
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    // generate a JSON file that matches the original filename with the hashed version
    new WebpackAssetsManifest({
      // Options go here
    }),
    // BrowserSync settings
    new BrowserSyncPlugin(
      {
        files: "**/*.php",
        proxy: "http://localhost:8000",
      },
      {
        // CSS changes will be injected instead of page refresh
        injectChanges: true,
        reload: false,
      }
    ),
  ],
  module: {
    rules: [
      {
        // Compile Sass/SCSS files into plain old CSS
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        // Compile image files
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          outputPath: "./dist/images/",
          name: "[name].[ext]",
        },
      },
      {
        // Compile SVG images
        test: /\.(svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./dist/images/",
              name: "[name].[ext]",
            },
          },
          {
            loader: "svgo-loader",
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
      {
        // Compile docs
        test: /\.(pdf|docx|xlsx)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./dist/docs/",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        // Compile fonts
        test: /\.(woff(2)?|ttf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./dist/fonts/",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        // Use 'expose-loader' to make jQuery available to other scripts on global scope
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"],
        },
      },
    ],
  },
};
