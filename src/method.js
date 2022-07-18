// 通用方法
import _filter from './filter';
import _map from './map';

var _mode = {};                         // 模式数据
var _data = Object.assign({},_map);     // 最终数据

// 数组去重
export function unique(arr){
    var sameList = arr.filter(item=>item==item.replace(/[ol](?=s|b)/,'x').replace(/&[ol]/,''));
    return arr.filter(item=>{
        var temp = item.replace(/[ol](?=s|b)/,'x').replace(/&[ol]/,'');
        return sameList.indexOf(item)>-1||item!=temp&&sameList.indexOf(temp)==-1;
    }).filter((item,idx,arr) => arr.indexOf(item) === idx);
};

// 中文获取选择器
export function getSelectors(str){
    str = str.replace(/之/,'的').replace(/我的?(.+)/,'$1');
    if(str.match(/[^娘婆岳亲]家的?/)){
        str = str.replace(/家的?/,'的');
    }
    var lists = str.split('的');
    var result = [];
    var isMatch = true;
    // 双向替换
    var replaceMap = {
        '晜':'兄',
        '哥':'兄',
        '姐':'姊',
        '侄':'姪',
        '婿':'壻',
        '祖父':'王父',
        '祖母':'王母',
        '弟媳':'弟妇',
        '嫂':'兄妇',
        '孙女婿':'孙婿',
        '甥女婿':'甥婿',
        '侄女婿':'侄婿',
        '孙媳妇':'孙妇',
        '甥媳妇':'甥妇',
        '侄媳妇':'侄妇',
    };
    // 含义扩展
    var replaceFilter = {
        '^从表':['从父姑表','从父舅表','从父姨表','从母姑表','从母舅表','从母叔表'],
        '^表表':['姑表叔表','姑表姑表','姑表舅表','姑表姨表','舅表叔表','舅表姑表','舅表舅表','舅表姨表'],
        '^([夫妻]?)表':['$1姑表','$1舅表'],
        '^([姑舅])表(?=[^伯叔])':['$1表伯','$1表叔'],
        '^姻':['姑姻','姨姻','姊妹姻','女姻'],
        '^眷':['叔眷','舅眷','兄弟眷','男眷'],
        '^亲家':['姊妹姻','兄弟眷'],
        '^([堂表姨]?)([曾高天烈太远鼻]?)([伯叔姑舅姨])':['$1$3$2'],
        '^([曾玄来晜仍云耳])([侄甥])':['$2$1'],
        '^外表([伯叔姑舅姨])':['姑表$1外','舅表$1外'],
        '^([堂表姨]?)外甥':['$1甥'],
        '^([舅叔])([曾玄外]*)孙':['$1侄$2孙'],
        '^([姨姑])([曾玄外]*)孙':['$1甥$2孙'],
        '([孙甥侄])$':['$1男','$1女'],
        '([姑舅姨叔])([孙外]*)([男女])$':['$1表侄$2$3','$1表甥$2$3'],
        '祖$':['祖父'],
        '嫂$':['兄妇'],
        '女儿$':['女'],
        '外甥$':['甥'],
    };
    while(lists.length){
        var name = lists.shift();           //当前匹配词
        var items = [];                     //当前匹配词可能性
        var x_items = [];
        var r_items = [];
        var keywords = [name];
        var getList = function(name){
            for(var filter in replaceFilter){
                var word_list = replaceFilter[filter];
                word_list.forEach(function(word){
                    var name1 = name.replace(new RegExp(filter),word);
                    if(name1!=name){
                        keywords.push(name1);
                        getList(name1);
                    }
                });
            }
            for(var word in replaceMap){
                var name1 = name.replace(word,replaceMap[word]);
                var name2 = name.replace(replaceMap[word],word);
                if(name1!=name){
                    keywords.push(name1);
                }
                if(name2!=name){
                    keywords.push(name2);
                }
            }
        };
        getList(name);
        // 通过关键词找关系
        keywords.forEach(function(name){
            var x_name = name.replace(/^[大|小|老]|^[一|二|三|四|五|六|七|八|九|十]{1,2}/,'几');
            var r_name = name.replace(/^[大|小|老]|^[一|二|三|四|五|六|七|八|九|十]{1,2}/,'');
            for(var i in _data){
                if(_data[i].indexOf(name)>-1){
                    items.push(i);
                }
                if(name!=x_name&&_data[i].indexOf(x_name)>-1){
                    x_items.push(i);
                }
                if(name!=r_name&&_data[i].indexOf(r_name)>-1){
                    if(!i.match(/^[mf,]+$/)&&!r_name.match(/^[从世]/)){  // 直系祖辈不参与排序
                        r_items.push(i);
                    }
                }
            }
        });
        // console.log('[keywords]',keywords);
        // 如找不到结果，再是否存在称呼的排行问题(不直接判断，因存在"大舅""三从父兄""三世祖"这样特俗含义的情况)
        if(!items.length){
            items = x_items;
        }
        if(!items.length){
            items = r_items;
        }
        // 完全匹配不到结果
        if(!items.length){
            isMatch = false;
        }
        var res = [];
        if(!result.length){
            result = [''];
        }
        result.forEach(function(a){
            items.forEach(function(b){
                res.push(a+(b?','+b:''));
            });
        });
        result = res;
    }
    return isMatch?result:[];
};

// 选择器转ID
export function selector2id(selector,sex){
    var result = [];
    var hash = {};
    //性别判断
    if(sex<0){
        if(selector.match(/^,[w1]/)){
            sex = 1;
        }else if(selector.match(/^,[h0]/)){
            sex = 0;
        }
    }else if(sex==1&&selector.match(/^,[h0]/)){
        return false;
    }else if(sex==0&&selector.match(/^,[w1]/)){
        return false;
    }
    // console.log('[selector]',selector);
    var getId = function(selector,sex){
        if(sex>-1&&selector.indexOf(',1')==-1&&selector.indexOf(',0')==-1){
            selector = ','+sex+selector;
        }
        if(selector.match(/,[mwd0](&[ol])?,w|,[hfs1](&[ol])?,h/)){  //同志关系去除
            return false;
        }
        var s='';
        if(!hash[selector]){
            hash[selector] = true;
            do{
                s = selector;
                for(var i in _filter){
                    var item = _filter[i];
                    // console.log('[filter]',item['exp'],selector);
                    selector = selector.replace(item['exp'],item['str']);
                    if(selector.indexOf('#')>-1){
                        selector.split('#').forEach(getId);
                        return false;
                    }
                }
            }while(s!=selector);
            if(selector.match(/,[mwd0](&[ol])?,w|,[hfs1](&[ol])?,h/)){  //同志关系去除
                return false;
            }
            selector = selector.replace(/,[01]/,'').substr(1);  //去前面逗号和性别信息
            result.push(selector);
        }
    }
    getId(selector,sex);
    return unique(result);
};

// 通过ID获取数据
export function getItemsById(id){
    var items = [];
    var getData = function(d){
        var res = [];
        if(_data[d]){
            res.push(_data[d][0]);
        }else{
            for(var i in _data){
                if(i.replace(/&[ol]/g,'')==d){
                    res.push(_data[i][0]);
                }else{
                    var expr = d;
                    while (expr.match(/[ol](b|s)/)){
                        expr = expr.replace(/[ol](b|s)/,'x$1');
                        if(expr==i){
                            res.push(_data[i][0]);
                            break;
                        }
                    }
                }
            }
        }
        return res;
    };
    if(_data[id]){  // 直接匹配称呼
        items.push(_data[id][0]);
    }else{
        items = getData(id);
        // 忽略年龄条件查找
        if(!items.length){
            id = id.replace(/&[ol]/g,'');
            items = getData(id);
        }
        // 忽略年龄条件查找
        if(!items.length){
            id = id.replace(/[ol](b|s)/g,'x$1');
            items = getData(id);
        }
        // 缩小访问查找
        if(!items.length){
            var l = id.replace(/x/g,'l');
            var o = id.replace(/x/g,'o');
            items = items.concat(getData(o),getData(l));
        }
    }
    return items;
};

// 逆转ID
export function reverseId(id,sex){
    var hash = {
        f:['d','s'],
        m:['d','s'],
        h:['w',''],
        w:['','h'],
        s:['m','f'],
        d:['m','f'],
        lb:['os','ob'],
        ob:['ls','lb'],
        xb:['xs','xb'],
        ls:['os','ob'],
        os:['ls','lb'],
        xs:['xs','xb']
    };
    var age = '';
    if(id.match(/&o$/)){
        age = '&l';
    }else if(id.match(/&l$/)){
        age = '&o';
    }
    if(id){
        id = id.replace(/&[ol]/g,'');
        //性别判断
        if(sex<0){
            if(id.match(/^w/)){
                sex = 1;
            }else if(id.match(/^h/)){
                sex = 0;
            }
        }
        var result = [];
        var doing = function(sex){
            var sid = (','+sex+','+id).replace(/,[fhs]|,[olx]b/g,',1').replace(/,[mwd]|,[olx]s/g,',0');
            sid = sid.substring(0,sid.length-2);
            var id_arr = id.split(',').reverse();
            var sid_arr = sid.split(',').reverse();
            var arr = id_arr.map((id,i)=>hash[id][sid_arr[i]]);
            var g = 0;
            var gMap = {'f':1,'m':1,'s':-1,'d':-1};
            arr.forEach(function(r){
                g += gMap[r]||0;
            });
            return arr.join(',')+(g?'':age);
        };
        if(sex<0){
            result.push(doing(1));
            result.push(doing(0));
        }else{
            result.push(doing(sex));
        }
        return result;
    }
    return [''];
};

// 通过ID获取关系链条
export function getChainById(id){
    var arr = id.split(',');
    return arr.map(function(sign){
        var key = sign.replace(/&[ol]/,'');
        var data = Object.assign({},_data,{
            'xb':['兄弟'],
            'xs':['姐妹'],
        });
        return data[key][0];
    }).join('的');
};

// 合并选择器，查找两个对象之间的关系
export function mergeSelector(from,to,my_sex){
    if(my_sex<0){
        var to_sex = -1;
        var from_sex = -1;
        if(from.match(/^,[w1]/)){
            from_sex = 1;
        }else if(from.match(/^,[h0]/)){
            from_sex = 0;
        }
        if(to.match(/^,[w1]/)){
            to_sex = 1;
        }else if(to.match(/^,[h0]/)){
            to_sex = 0;
        }
        if(from_sex==-1&&to_sex>-1){
            my_sex = to_sex;
        }else if(from_sex>-1&&to_sex==-1){
            my_sex = from_sex;
        }else if(from_sex==to_sex){
            my_sex = from_sex;
        }else{
            return false;
        }
    }
    var sex = my_sex;
    var from_ids = selector2id(from,my_sex);
    var to_ids = selector2id(to,my_sex);
    var to_rids = [];
    if(!from_ids.length||!to_ids.length){
        return false;
    }
    if(to){
        var toIsMale = false;
        var toIsFemale = false;
        to_ids.forEach(function(id){
            if(id.match(/([fhs1](&[ol])?|[olx]b)$/)){
                toIsMale = true;
            }
            if(id.match(/([mwd0](&[ol])?|[olx]s)$/)){
                toIsFemale = true;
            }
            to_rids = to_rids.concat(reverseId(id,my_sex));
        });
        to_rids = unique(to_rids);
        if(toIsMale&&toIsFemale){
            sex = -1;
        }else if(toIsMale){
            sex = 1;
        }else if(toIsFemale){
            sex = 0;
        }
    }else{
        to_rids = [''];
    }
    // console.log('[from_ids]',from_ids,'to_rids',to_rids);
    var from_selector = from_ids.length>1?'['+from_ids.join('|')+']':from_ids[0];
    var to_selector = to_rids.length>1?'['+to_rids.join('|')+']':to_rids[0];
    return {
        'selector':(to?','+to_selector:'')+(from?','+from_selector:''),
        'sex':sex
    };
};

// 设置模式
export function setMode(sign,data){
    _mode[sign] = Object.assign(_mode[sign]||{},data);
};

// 获取指定模式数据
export function getDataByMode(sign){
    var data = Object.assign({},_map);
    if(sign&&_mode[sign]){
        for(var key in _mode[sign]){
            data[key] = [].concat(_mode[sign][key],_map[key]||[]);
        }
    }
    return data;
};
