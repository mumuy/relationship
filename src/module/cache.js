/*
 * 缓存数据
*/
import _input from './data/input.js';
import {modeData} from './mode.js';

let _hash = Object.assign({},modeData,_input);
let cacheData = {};

for(let key in _hash){
    _hash[key].forEach(function(name){
        if(typeof cacheData[name]=='undefined'){
            cacheData[name] = [];
        }
        cacheData[name].push(key);
    });
}

export {cacheData};
