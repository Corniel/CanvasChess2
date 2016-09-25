module.exports = {
    entry: './src/canvaschess.js',
    output: {
        path: './dist',
        filename: 'canvaschess.bundle.js',
        libraryTarget: 'var',
        library: 'CanvasChess'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: [/node_modules/, /\.spec\.js/],
            loader: 'babel-loader'
        }]
    }
};
