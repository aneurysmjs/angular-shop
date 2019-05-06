const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const { setupPath } = require('./helpers');
const paths = require('./paths');

const isDev = process.env.NODE_ENV !== 'production';

const progressHandler = (percentage, message, ...args) => {
  // eslint-disable-next-line no-console
  console.info(percentage, message, ...args);
};

const postCssLoader = {
  loader: 'postcss-loader', // Run post css actions
  options: {
    plugins() { // post css plugins, can be exported to postcss.config.js
      return [
        // eslint-disable-next-line global-require
        // require('precss'),
        // eslint-disable-next-line global-require
        require('autoprefixer'),
        postcssPresetEnv(),
      ];
    },
  },
};

module.exports = (mode) => {
  const prodMode = mode === 'production';
  return {

    entry: {
      vendor: './src/vendor.ts',
      polyfills: './src/polyfills.ts',
      main: './src/main.ts',
    },

    resolve: {
      alias: {
        api$: `${paths.src}/api/api.ts`,
        '@': `${paths.src}`,
      },
      extensions: ['.js', '.json', '.ts', '.scss'],
    },

    module: {
      // rules for modules (configure loaders, parser options, etc.)
      rules: [
        // {
        //   enforce: 'pre',
        //   test: /\.(js|ts)$/,
        //   loader: 'eslint-loader',
        //   exclude: /node_modules/,
        // },
       
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|sass)$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                sourceMap: isDev
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev
              }
            }
          ],
          include: `${paths.src}/assets`
        },
        {
          test: /\.(scss|sass)$/,
          use: [
            'to-string-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev
              }
            },
            postCssLoader,
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev
              }
            }
          ],
          include: `${paths.src}/app`
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader?name=assets/img/[name].[ext]',
            },
          ],
        },
        {
          test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/', // where the fonts will go
            },
          }],
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(progressHandler),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: prodMode ? '[name].[hash].css' : '[name].css',
        chunkFilename: prodMode ? '[id].[hash].css' : '[id].css',
      }),
      new HtmlWebpackPlugin({
        template: setupPath('../src/index.html'),
      }),
    ],
  };
};
