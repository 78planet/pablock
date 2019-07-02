//파일을 최적화,  코드의 변화가 있을때 마다 감지를 해서 브라우저의 변경사항을 새로고침할 필요 없이 반영을 해줌. 
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    career: "./src/career.js"
    // module: "./src/bmodul.js"
  },
  mode: 'development',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  plugins: [   
    new webpack.DefinePlugin({
      //전역상수 설정, 파일 시스템을 통해 deployedaddress파일을 읽고 안에 있는 contract주소를 전역 상수에 대입.
      DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI: fs.existsSync('deployedABI') && fs.readFileSync('deployedABI', 'utf8'),
      DEPLOYED_ADDRESS_2: JSON.stringify(fs.readFileSync('2_deployedAddress', 'utf8').replace(/\n|\r/g, "")),
      DEPLOYED_ABI_2: fs.existsSync('deployedABI') && fs.readFileSync('2_deployedABI', 'utf8'),

    }),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html"}])
  ],
  devServer: {
            contentBase: path.join(__dirname, "dist"), compress: true,  
            inline:true
            // host: '0.0.0.0',
            // port: 8008
           }
  }
