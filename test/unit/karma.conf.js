// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var path = require('path')
var merge = require('webpack-merge')
var baseConfig = require('../../build/webpack.base.config')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../../')

var webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: false
    })
  ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'sinon-chai'],
/*    reporters: ['spec', 'coverage'],*/
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    // web server port
    port: 9876,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
/*    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }*/
  })
}
