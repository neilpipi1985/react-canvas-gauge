import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';

const WEB_PATH = 'http://localhost';
const renderRoot = 'index.js';

async function webpackCompile(opts = {}) {
  const config = merge.smart(Object.assign({
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['env', { targets: { browsers: ['last 2 Chrome versions', 'ie >= 11'] } }],
                'react',
                'stage-0'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif|woff|woff2)$/,
          use: 'url-loader?limit=8192'
        },
        {
          test: /\.(mp4|ogg|eot|ttf|svg)$/,
          use: 'file-loader'
        }
      ]
    }
  }, opts));

  return webpack(config);
}

async function run() {
  try {
    const Demo = require('./demo');

    const entry = ['babel-polyfill', path.resolve(__dirname, `./render/${renderRoot}`)];
    const output = {
      path: path.resolve(__dirname, '../dev/render'),
      filename: renderRoot,
      publicPath: WEB_PATH,
      libraryTarget: 'var'
    };

    const compile = await webpackCompile({
      target: 'web',
      mode: 'development',
      entry,
      output,
      plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({})
      ],
      devtool: 'cheap-module-eval-source-map'
    }, true);

    Demo.webApp.use(devMiddleware(compile, {
      // public path to bind the middleware to
      // use the same as in webpack
      publicPath: WEB_PATH,
      // options for formating the statistics
      stats: {
        colors: true
      }
    }));
    Demo.webApp.use(hotMiddleware(compile));

    await Demo.initialize({ port: 80, renderRoot });
  } catch (err) {
    console.log(err.message);
  }
}

run();
