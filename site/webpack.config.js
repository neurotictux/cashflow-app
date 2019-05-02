const webpack = require('webpack')
const path = require('path')
const ProgressBar = require('progress-bar-webpack-plugin')

module.exports = {
  entry: './src/App.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader?name=public/fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ttf']
  },
  output: {
    path: path.join(__dirname, '..', '/wwwroot'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBar()
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}