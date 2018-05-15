const path = require('path');

module.exports={
    //入口文件的配置项
    entry: {
        entry: "./src/entry.js"
    },
    //出口文件的配置项
    output: {
        path: path.resolve(__dirname, 'dist'),  //获取项目的绝对路径
        filename: "bundle.js"    //打包的文件名称
    },
    //配置模块：主要是解析CSS，图片转换压缩功能等
    module: {},
    //配置插件：根据功能需要配置不同的插件
    plugins: [],
    //配置开发服务功能 ？
    devServer: {}
}