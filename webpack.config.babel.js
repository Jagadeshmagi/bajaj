import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin'

const LAUNCH_COMMAND = process.env.npm_lifecycle_event

const isProduction = LAUNCH_COMMAND === 'production'
process.env.BABEL_ENV = LAUNCH_COMMAND

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'dist'),
}

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: PATHS.app + '/index.html',
  filename: 'index.html',
  inject: 'body'
})

const COPYWebPackPluginConfig = new CopyWebpackPlugin([
	{ from: PATHS.app+'/sharedStyles/customCSS.css', to: PATHS.build },
	{ from: PATHS.app+'/sharedStyles/react-select.css', to: PATHS.build },
	{ from: PATHS.app+'/sharedStyles/fixed-data-table.css', to: PATHS.build },
	{ from: PATHS.app+'/constants/NetworkConstants.js', to: PATHS.build },
  { from: PATHS.app+'/javascripts/inactivity.js', to: PATHS.build },
  { from: PATHS.app+'/assets/pulsar-icon.png', to: PATHS.build },
  // { from: PATHS.app+'/constants/api.html', to: PATHS.build },

])

const HtmlWebpackIncludeAssetsPluginConfig = new HtmlWebpackIncludeAssetsPlugin({
    files: ['index.html'],
    assets: ['customCSS.css','react-select.css','fixed-data-table.css','NetworkConstants.js'],
    append: true,
	hash: true
  })

const productionPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
})

const base = {
  entry: [
    PATHS.app
  ],
  output: {
    path: PATHS.build,
    filename: 'index_bundle_[hash:8].js'
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'html-loader' },
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]'},
      //{test: /\.(jpe?g|png|gif|svg)$/i,loaders: ['url?limit=8192','img']}
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },
  resolve: {
    root: path.resolve('./app'),
    extensions: ["", ".ts", ".tsx", ".js", ".json"]
  },
  node: {
      dns: 'empty',
      net: 'empty'
  },
}

const developmentConfig = {
  module: {
    loaders: [
      { test: /\.html$/, loader: 'html-loader' },
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]'},
      //{test: /\.(jpe?g|png|gif|svg)$/i,loaders: ['url?limit=8192','img']}
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },
  devtool: 'cheap-module-inline-source-map',
  devServer: {
    contentBase: PATHS.build,
	outputPath: PATHS.build,
    hot: true,
    inline: true,
    progress: true,
  },
  plugins: [HTMLWebpackPluginConfig,COPYWebPackPluginConfig,HtmlWebpackIncludeAssetsPluginConfig, new webpack.HotModuleReplacementPlugin()]
}

const productionConfig = {
  module: {
    loaders: [
      { test: /\.html$/, loader: 'html-loader' },
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]'},
      //{test: /\.(jpe?g|png|gif|svg)$/i,loaders: ['url?limit=8192','img']}
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: [HTMLWebpackPluginConfig, productionPlugin,COPYWebPackPluginConfig,HtmlWebpackIncludeAssetsPluginConfig]
}

export default Object.assign({}, base, isProduction === true ? productionConfig : developmentConfig)
