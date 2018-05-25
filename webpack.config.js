const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');   //JS压缩插件
const htmlPlugin = require('html-webpack-plugin');   //html打包工具
const extractTextPlugin = require('extract-text-webpack-plugin');     //css分离打包工具

var website = {
    publicPath: "http://172.17.1.110:1717/"
}

module.exports = {
    //入口文件的配置项
    entry: {
        entry: "./src/entry.js",
        entry2: "./src/entry2.js"
    },
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'),  //输出的路径，用了node语法
        filename: "[name].js",    //打包的文件名称
        publicPath: website.publicPath
    },
    //配置模块：主要是解析CSS，图片转换压缩功能等
    module: {
        rules: [
            {
                  test: /\.css$/,
                  /*use: ['style-loader','css-loader']*/
                  use: extractTextPlugin.extract({
                      fallback: "style-loader",
                      use: "css-loader"
                  })
            },
            {
                test: /\.(jpg|png|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000        //小于500000B的文件打成Base64的格式，写入JS
                    }
                }]
            }
        ]
    },
    //配置插件：根据功能需要配置不同的插件
    plugins: [
        new uglify(),
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: "./src/index.html"
        }),
        new extractTextPlugin("/css/index.css"),
    ],
    //配置开发服务功能
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),   //配置基本目录结构，用于找到程序打包地址
        host: "172.17.1.110",                               //配置服务器的IP地址，或者用localhost
        compress: true,                                  //配置是否开启服务端压缩
        port: 1717                                        //配置端口号
    }
};