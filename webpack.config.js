const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');   //JS压缩插件
const htmlPlugin = require('html-webpack-plugin');   //html打包工具
const extractTextPlugin = require('extract-text-webpack-plugin');   //css 分离打包工具
const glob = require('glob');         //node 的glob 对象，用于同步检测html模板
const purifyCSSPlugin = require('purifycss-webpack');   //消除未使用的css
const entry = require('./webpack_config/entry_webpack.js');        //js模块化引入
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

console.log('------------------------->'+encodeURIComponent(process.env.type));
if(process.env.type == "build"){
    var website = {
        publicPath: "http://jspang.com:1717/"
    }
}else{
    var website = {
        publicPath: "http://10.150.130.65:1717/"
    }
}


module.exports = {
    /*devtool: "source-map",    //打包后如何调试     */
    //入口文件的配置项
    entry: entry.path,
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
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: "babel-loader",
                    /*options: {     //配置到.babelrc文件中
                        presets: ['env', 'react']
                    }*/
                },
                exclude: /node_modules/
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
            // Give paths to parsen for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
            //purifycss-webpack  插件必须配合 extract-text-webpack-plugin 插件使用
        }),
        new webpack.ProvidePlugin({     //引用第三方类库
            $: "jquery",
        }),
        new webpack.BannerPlugin('add by yy 2018年6月7日10:58:52'),
        /*new webpack.optimize.CommonsChunkPlugin({        //旧版本的方法，现已不适用
            name: 'jquery',                         //name对应入口文件中的名字，我们起的是jQuery
            filename: "assets/js/jquery.min.js",    //把文件打包到哪里，是一个路径
            minChunks: 2                            //最小打包的文件模块数，这里直接写2就好
        })*/
        new copyWebpackPlugin([{       //   ！！！注意：这里的数据先用数组包裹，然后才是对象
            from: __dirname+ '/src/public',
            to: './public'              //   由于出口配置了目录为dist，因此只需要编写后面的地址即可
        }]),
        new webpack.HotModuleReplacementPlugin()     //整个界面刷新
    ],
    /*optimization: {
        splitChunks: {
            chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 0,                // 最小尺寸，默认0
            minChunks: 1,              // 最小 chunk ，默认1
            maxAsyncRequests: 1,       // 最大异步请求数， 默认1
            maxInitialRequests: 1,    // 最大初始化请求书，默认1
            name: () => {},              // 名称，此选项课接收 function
            cacheGroups: {                 // 这里开始设置缓存的 chunks
                priority: "0",                // 缓存组优先级 false | object |
                vendor: {                   // key 为entry中定义的 入口名称
                    chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    test: /jquery|vue/,     // 正则规则验证，如果符合就提取 chunk
                    name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 1,       // 最大异步请求数， 默认1
                    maxInitialRequests: 1,    // 最大初始化请求书，默认1
                    reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
                }
            }
        }
    },*/
    //配置开发服务功能
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),   //配置基本目录结构，用于找到程序打包地址
        host: "10.150.130.65",                               //配置服务器的IP地址，或者用localhost
        compress: true,                                  //配置是否开启服务端压缩
        port: 1717                                        //配置端口号
    },
    watchOptions: {
        poll: 1000,         //检测修改的时间，以毫秒为单位
        aggregateTimeout: 500,  //防止重复保存而发生重复编译的错误，这里的设置是指：半秒内重复保存，不进行打包操作
        ignored: /node_modules/     //不监听的目录
    }
};