const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');   //JS压缩插件
const htmlPlugin = require('html-webpack-plugin');   //html打包工具
const extractTextPlugin = require('extract-text-webpack-plugin');   //css 分离打包工具

const glob = require('glob');         //node 的glob 对象，用于同步检测html模板
const purifyCSSPlugin = require('purifycss-webpack');   //消除未使用的css

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
                  use: extractTextPlugin.extract({       //css分离打包
                      fallback: "style-loader",
                      use: [
                          { loader: "css-loader", options: { importLoaders: 1}},
                          "postcss-loader"
                      ]
                  })
            },
            {
                test: /\.(jpg|png|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,            //小于500000B的文件打成Base64的格式，写入JS
                        outputPath: "images/"
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,         //html内img标签元素打包
                use: ['html-withimg-loader']
            },
            {
                test: /\.less$/i,
                /*use: [
                    { loader: "style-loader"},      // creates style nodes from JS strings
                    { loader: "css-loader"},        // translates CSS into CommonJS
                    { loader: "less-loader"}        // compiles Less to CSS
                ]*/
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader"]
                })
                // use: [{ loader: "css-loader"}, {loader: "less-loader"}]
                // 注意： 这里引用的三个loader的顺序是固定的，不可打乱！！
            },
            {
                test: /\.scss$/i,
                /*use: ["style-loader", "css-loader", "sass-loader"]*/
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"]
                })
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
        new extractTextPlugin("css/index.css"),     //这里是存放打包后css文件的地址
        new purifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
            //purifycss-webpack  插件必须配合 extract-text-webpack-plugin 插件使用
        })
    ],
    //配置开发服务功能
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),   //配置基本目录结构，用于找到程序打包地址
        host: "172.17.1.110",                               //配置服务器的IP地址，或者用localhost
        compress: true,                                  //配置是否开启服务端压缩
        port: 1717                                        //配置端口号
    }
};