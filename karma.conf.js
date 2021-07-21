const webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    preprocessors: {
      'src/js/blogPage/posts.js': ['webpack'],
      'src/js/plugins/slider.js': ['webpack'],
      'spec/*.js': ['webpack'],
    },
    files: [
      {pattern: 'src/js/blogPage/posts.js', watched: true},
      {pattern: 'src/js/plugins/slider.js', watched: true},
      {pattern: 'spec/*.spec.js', watched: true},
    ],
    plugins: [
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-webpack',
    ],
    reporters: ['kjhtml', 'coverage'],
    coverageIstanbluReporter: {
      report: ['text-summary'],
      fixWebpackSourcePath: true
    },
    colors: true,
    browsers: ['Chrome'],
    singleRun: false,
    client:{
      clearContext: false
    },
    coverageReporter: {
      dir: './coverage',
      includeAllSources: true
    },
    webpack: webpackConfig,
  })
};
