const path = require('path');

module.exports = {
  entry: './src/index.js', // Main JavaScript file (client-side code)
  output: {
    path: path.resolve(__dirname, 'public'), // Output directory
    filename: 'bundle.js' // Output bundled file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  }
};
