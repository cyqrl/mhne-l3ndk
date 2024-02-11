
const path = require('path');

module.exports = {
    entry: './src/app.js', // Update the entry point to your new src folder
    output: {
        path: path.resolve(__dirname, 'public'), // Output to the public folder
        filename: 'bundle.js'
    },
    // other webpack configuration...
};