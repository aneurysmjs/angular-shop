const Webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { setupPath } = require('./helpers');
const paths = require('./paths');

module.exports = ({ mode }) => {
  // eslint-disable-next-line global-require
  const commonConfig = require('./webpack.common.js')(mode);

  return webpackMerge(commonConfig, {
    mode: 'production',
    devtool: 'source-map',

    output: {
      path: paths.dist,
      publicPath: '/',
      filename: '[name].[hash].js',
      chunkFilename: '[id].[hash].chunk.js',
    },

    performance: {
      hints: 'warning', // enum
      maxAssetSize: 200000, // int (in bytes),
      maxEntrypointSize: 400000, // int (in bytes)
      assetFilter: assetFilename => (
        // Function predicate that provides asset filenames
        assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
      ),
    },

    plugins: [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        // eslint-disable-next-line
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: [
            'default', {
              discardComments: {
                removeAll: true,
              },
            }],
        },
        canPrint: true,
      }),
      new HtmlWebpackPlugin({
        template: setupPath('./templates/index.html'),
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
      }),
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new CompressionPlugin({
        test: /\.(png|jpe?g|gif)$/,
      }),
    ],
  });
};
