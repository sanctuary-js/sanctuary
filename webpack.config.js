const webpack = require('webpack')
const package = require('./package')

module.exports = {

  output: {
    library: 'sanctuary',
    libraryTarget: 'umd'
  },

  externals: Object.keys(package.dependencies),

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  node: {
    Buffer: false
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

}
