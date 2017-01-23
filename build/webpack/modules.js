/**
 * Created by linxiaojie on 2016/12/5.
 */
const util = require('../util')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const dirVars = require('./dir-vars')
const config = require('./config')
module.exports = {
  rules: [
    /*js eslint格式校验*/
    {
      test: /\.js$/,
      enforce: "pre",
      include: dirVars.SRC_PATH,
      use: [
        {
          loader: "eslint-loader",
          options: require('./eslint')
        }
      ]
    },
    /*js es6*/
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            "presets": [
              ["es2015", { "modules": false }]
            ]
          }
        }
      ]
    },
    /*解析css*/
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: "style-loader",
        loader: [
          'css-loader',
          {
            loader: 'postcss-loader',
            /*插件配置参数形式有bug使用postcss全局配置文件的方式*/
/*            options: {
              ident: 'postcss',
              plugins: () => [require('autoprefixer')]
            }*/
          },
          'less-loader'
        ],
        publicPath: config.cssRelAssets
      })
      /*include: []*/
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    /*加载图片*/
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 1000,
        name: util.assetsPath('img/[name].[ext]')
      }
    },
    {
      test: /\.html$/,
      loader: 'html-loader',
    },
    {
      test: /\.ejs$/,
      loader: 'ejs-loader',
    },
    /*字体*/
    {
      // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
      test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
      loader: 'file-loader',
      query: {
        name: util.assetsPath('fonts/[name].[ext]')
      }
    }
  ]
}