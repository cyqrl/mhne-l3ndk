
const path = require('path');

module.exports = {
    entry: './src/app.js', // Update the entry point to your new src folder
    output: {
        path: path.resolve(__dirname, 'public'), // Output to the public folder
        filename: 'bundle.js'
    },
    resolve: {
        fallback: {
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            assert: require.resolve('assert/'),
            net: require.resolve('net-browserify'),
            tls: require.resolve('tls-browserify'),
            assert: require.resolve('assert'),
            zlib: require.resolve('browserify-zlib'),
            querystring: require.resolve('querystring-es3'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            fs: require.resolve('fs')
        }
    }    
};