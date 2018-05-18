const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');   //JS压缩插件
const htmlPlugin = require('html-webpack-plugin');   //html打包工具

module.exports={
    //入口文件的配置项
    entry: {
        entry: "./src/entry.js",
        entry2: "./src/entry2.js"
    },
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'),  //获取项目的绝对路径
        filename: "[name].js"    //打包的文件名称
    },
    //配置模块：主要是解析CSS，图片转换压缩功能等
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader','css-loader']
        }]
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
        })
    ],
    //配置开发服务功能
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),   //配置基本目录结构，用于找到程序打包地址
        host: "172.17.1.110",                               //配置服务器的IP地址，或者用localhost
        compress: true,                                  //配置是否开启服务端压缩
        port: 1717                                        //配置端口号
    }
}