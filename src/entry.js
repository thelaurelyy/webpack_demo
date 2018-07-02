import css from "./css/index.css";
import less from "./less/black.less";
import scss from "./scss/test.scss";
/*import $ from "jquery"; */          //jquery 引入

{
    let tempStr = "Hello yy !";
    document.getElementById('title').innerHTML = tempStr;
}


/* json配置文件使用 */
var json = require('../config.json');
document.getElementById('json').innerHTML = json.sex;



/*
webpack src/entry.js --output  dist/bundle.js --mode development
*/
