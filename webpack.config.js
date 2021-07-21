const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: '@js/mainPage/index',
    blog: '@js/blogPage/index',
    authors: '@js/authorsPage/index'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@js': path.join(__dirname, 'src', 'js')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
      template: './src/index.html'
    }),
    new HTMLWebpackPlugin({
      filename: 'blog.html',
      chunks: ['blog'],
      template: './src/blog.html'
    }),
    new HTMLWebpackPlugin({
      filename: 'authors.html',
      chunks: ['authors'],
      template: './src/authors.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use:[MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: ['file-loader']
      },
      {
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/
      },
      {
        test: /\.js$/,
        use: { loader: 'istanbul-instrumenter-loader' },
        include: path.resolve('src/js/*/*.js')
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false
            }
          }
        ]
      },
    ]
  },
  devServer: {
    open: true,
  }
}