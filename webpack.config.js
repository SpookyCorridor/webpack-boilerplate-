var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname); //equivalent to using 'cd' but .join
                                         // is an alternative
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
  entry: APP_PATH,
  resolve: { //evaluated from left to right, can use it to control which code 
             //gets loaded for given configuration. 
    extensions: ['', '.js', '.jsx'] //allow referring to JSX files without extension 
  },
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/, //files ending with .css should invoke given loaders
        loaders: ['style', 'css'], //loaders are evaluated from right to left
        // css-loader will resolve @import and url statements in our CSS 
        // style-loader deals with require statements in JS  -- similar to LESS
        include: APP_PATH
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: APP_PATH
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Kanban app'
    })
  ]
};

//share config between targets with merge  -- single file config approach 

if(TARGET === 'start' || !TARGET) { //default if running Webpack outside of npm
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true, //allow HTML5 history API routes to work 
      hot: true,
      inline: true, //embeds webpack-dev-server runtime into the bundle allowing HMR
                  //to work easily. Otherwisse more entry paths are needed. 
      progress: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}