const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const PLUGIN_VARS = {
  local: {
    __API_WS_ENDPOINT__: "'ws://localhost:8080/graphql'",
    __API_HTTP_ENDPOINT__: "'http://localhost:8080/graphql'",
    __LOGGING_LEVEL__: "'local'"
  },
  production: {
    __API_WS_ENDPOINT__: "'https://playlists-api.sillysideprojects.com/graphql'",
    __API_HTTP_ENDPOINT__: "'https://playlists-api.sillysideprojects.com/graphql'",
    __LOGGING_LEVEL__: "'sentry'"
  }
}

const getEnvVariables = () => {
  return PLUGIN_VARS[process.env.NODE_ENV || 'production']
}

const envVariables = getEnvVariables()

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'app.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      sharedComponents: path.resolve(__dirname, 'src/sharedComponents/'),
      sharedTypes: path.resolve(__dirname, 'src/sharedTypes/index.ts'),
      theme: path.resolve(__dirname, 'src/theme.tsx'),
      utilities: path.resolve(__dirname, 'src/utilities.ts'),
      context: path.resolve(__dirname, 'src/Context.tsx')
    }
  },
  devServer: {
    compress: true,
    port: 3001,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.DefinePlugin(envVariables),
    new HtmlWebpackPlugin({
      template: './src/static/index.template.ejs',
      favicon: './src/static/favicon.png',
      inject: 'body',
      title: 'Playlist Generator'
    })
  ],
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
