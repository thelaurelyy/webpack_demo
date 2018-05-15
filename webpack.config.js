const path = require('path');

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
    module: {},
    //配置插件：根据功能需要配置不同的插件
    plugins: [],
    //配置开发服务功能
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),   //配置基本目录结构，用于找到程序打包地址
        host: "localhost",                               //配置服务器的IP地址，或者用localhost
        compress: true,                                  //配置是否开启服务端压缩
        port: 1717                                        //配置端口号
    }
}