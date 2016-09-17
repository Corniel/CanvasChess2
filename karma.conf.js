module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.spec.js'
    ],

    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
        'src/**/*.spec.js': ['webpack']
    },

    webpack: {
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }]
        }
    },

    webpackMiddleware: {
        noInfo: true
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
}
