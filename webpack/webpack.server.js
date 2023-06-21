const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = () => ({
  entry: path.resolve('./src/index.ts'),
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            exclude: [/node_modules/, /build/],
            loader: 'ts-loader',
         },
    ],
  },
  externalsPresets: {
    node: true,
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve('./tsconfig.json') })],
  },
  output: {
    path: path.resolve('build'),
    filename: 'index.js',
  },
  target: 'node',
});