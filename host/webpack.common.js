const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
require('dotenv').config();

// 환경 변수에서 Remote URL 가져오기
const REMOTE1_URL = process.env.REMOTE1_URL || 'http://localhost:5001';
const REMOTE2_URL = process.env.REMOTE2_URL || 'http://localhost:5002';

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
        test: /\.(tsx?|jsx?)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../lib/dist')
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
      },
      // 이미지 및 폰트 최적화
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB 이하는 인라인 base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom')
    }
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        '@resume': `remote1@${REMOTE1_URL}/remoteEntry.js`,
        '@blog': `blog@${REMOTE2_URL}/remoteEntry.js`
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.2.1' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^19.2.1' },
        'react-router-dom': { singleton: true, eager: true },
        '@reduxjs/toolkit': { singleton: true, eager: true },
        'react-redux': { singleton: true, eager: true },
        '@sonhoseong/mfa-lib': { singleton: true, eager: true }
      }

    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
    })
  ]
};
