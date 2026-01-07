const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

// 환경 변수에서 Remote URL 가져오기
const REMOTE1_URL = process.env.REMOTE1_URL || 'http://localhost:5001';
const REMOTE2_URL = process.env.REMOTE2_URL || 'http://localhost:5002';
const REMOTE3_URL = process.env.REMOTE3_URL || 'http://localhost:5003';

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path:
        path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '..', 'lib', 'src')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@mfa/lib': path.resolve(__dirname, '..', 'lib', 'src')
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        '@resume': `remote1@${REMOTE1_URL}/remoteEntry.js`,
        '@blog': `blog@${REMOTE2_URL}/remoteEntry.js`,
        '@portfolio': `portfolio@${REMOTE3_URL}/remoteEntry.js`
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.2.1' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^19.2.1' },
        'react-router-dom': { singleton: true, eager: true },
        '@reduxjs/toolkit': { singleton: true, eager: true },
        'react-redux': { singleton: true, eager: true }
      }

    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
