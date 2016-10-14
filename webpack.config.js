var path = require('path');
var webpack = require('webpack');

var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var options = {
  resolve: {
    root: path.resolve('./src'),
  },
  entry: {
    js: './src/app.js',
    vendor: [
      'bluebird',
      'classnames',
      'deep-equal',
      'es6-map',
      'isomorphic-fetch',
      'moment',
      'qs',
      'react',
      'react-addons-update',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk',
      'schema-inspector',
      'socket.io-client',
      'store',
      'underscore',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'www/dist/'),
    filename: '/bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015','stage-1'],
        }
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css', 'postcss')
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000'
      }
    ],
  },
  postcss: [autoprefixer],
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin('/dist/init.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      DEBUG: process.env.NODE_ENV !== 'production',
      VERSION: JSON.stringify(require('./package.json').version),
    }),
    new ExtractTextPlugin('/css/weui.min.css'),
    new webpack.optimize.CommonsChunkPlugin('vendor', '/vendor.bundle.js'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'www/index-template.html')
    }),
    // new OpenBrowserPlugin({ url: 'http://m.tlf.bosc.local/' })
  ]
};

if (process.env.NODE_ENV == 'production') {
  options.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false,
      // warnings: false,
      compress: {
        warnings: false,
      }
    })
  );
}

module.exports = options;
