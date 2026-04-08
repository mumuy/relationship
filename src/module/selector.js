/*
 * 选择器 - 非唯一性关系链，将【中文表述】转换为【关系链】
*/
import _filter from './rule/filter.js';
import _replace from './rule/replace.js';
import _similar from './rule/similar.js';

import { zh2number } from './utils.js';
import { reverseId, filterId, getGenById } from './id.js';
import { $cache } from './cache.js';

// 获得最简
const getOptimal = function (options) {
    let {
        from,
        to,
        sex
    } = options;
    let from_chain = from.split(',');
    let to_chain = to.split(',');
    for (let i = 0; i < from_chain.length && i < to_chain.length; i++) {
        if (from_chain[i] == to_chain[i]) {
            from = from_chain.slice(i + 1).join(',');
            to = to_chain.slice(i + 1).join(',');
            sex = from_chain[i].match(/^([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?/) ? 1 : 0;
            continue;
        } else {
            if (getGenById(from_chain[i]) == getGenById(to_chain[i]) && from_chain[i].match(/^[xol][bs]|^[sd]/) && to_chain[i].match(/^[xol][bs]|^[sd]/)) {
                let form_type = from_chain[i].replace(/&([ol\d]+)/, '').replace(/^[xol]([bs])/, '$1');
                let to_type = to_chain[i].replace(/&([ol\d]+)/, '').replace(/^[xol]([bs])/, '$1');
                if (form_type != to_type) {
                    break;
                }
                let from_attr = from_chain[i].match(/&([ol\d]+)/)?.[1] || from_chain[i].match(/([ol])[bs]/)?.[1] || '';
                let to_attr = to_chain[i].match(/&([ol\d]+)/)?.[1] || to_chain[i].match(/([ol])[bs]/)?.[1] || '';
                if (from_attr && to_attr) {
                    if (!isNaN(from_attr) && !isNaN(to_attr)) {
                        if (+from_attr > +to_attr) {
                            from_chain[i] = from_chain[i].replace(/^[xol]b|^s/, 'lb').replace(/^[xol]s|^d/, 'ls');
                        } else if (+from_attr < +to_attr) {
                            from_chain[i] = from_chain[i].replace(/^[xol]b|^s/, 'ob').replace(/^[xol]s|^d/, 'os');
                        }
                    } else if (!isNaN(from_attr) && to_attr == 'o' || from_attr == 'l' && !isNaN(to_attr)) {
                        from_chain[i] = from_chain[i].replace(/^[xol]b|^s/, 'lb').replace(/^[xol]s|^d/, 'ls');
                    } else if (!isNaN(from_attr) && to_attr == 'l' || from_attr == 'o' && !isNaN(to_attr)) {
                        from_chain[i] = from_chain[i].replace(/^[xol]b|^s/, 'ob').replace(/^[xol]s|^d/, 'os');
                    }
                    from = from_chain.slice(i).join(',');
                    to = to_chain.slice(i + 1).join(',');
                    sex = to_chain[i].match(/^([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?/) ? 1 : 0;
                } else if (options['optimal']) {
                    from_attr = from_chain[i].match(/([xol])[bs]/)?.[1] || '';
                    to_attr = to_chain[i].match(/([xol])[bs]/)?.[1] || '';
                    if (from_attr == 'x' || to_attr == 'x') {
                        from = from_chain.slice(i + 1).join(',');
                        to = to_chain.slice(i + 1).join(',');
                        sex = from_chain[i].match(/^([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?/) ? 1 : 0;
                        continue;
                    }
                }
            }
            break;
        }
    }
    return {
        from,
        to,
        sex
    };
};

// 中文获取选择器
export function getSelectors(str) {
    str = str.replace(/之/g, '的').replace(/吾之?(.+)/, '$1').replace(/我的?(.+)/, '$1');
    // 惯用口语标准化
    // str = str.replace(/(?<![娘婆岳亲])家的?(?=(孩子|儿子|女儿))/,'的');
    if (str.match(/[^娘婆岳亲]家的?(孩子|儿子|女儿)/)) {
        str = str.replace(/家的?/, '的');
    }
    str = str.replace(/(舅|姑)+(爸|父|丈|妈|母)?家的?(哥|姐|弟|妹)+/, '$1表$3').replace(/(舅|姑)+(爸|父|丈|妈|母)?家的?/, '$1表');
    str = str.replace(/(伯|叔)+(父|母)?家的?(哥|姐|弟|妹)+/, '堂$3').replace(/(伯|叔)+(父|母)?家的?/, '堂');
    str = str.replace(/姨+(爸|父|丈|妈|母)?家的?(哥|姐|弟|妹)+/, '姨$2').replace(/姨+(爸|父|丈|妈|母)?家的?/, '姨');

    const lists = str.split('的');
    let result = [];
    let isMatch = true;
    while (lists.length) {
        const name = lists.shift();           //当前匹配词
        let items = [];                     //当前匹配词可能性
        const keywords = [name];
        let getList = function (name) {
            // 词义扩展
            _replace.forEach(item => {
                item['arr'].forEach(word => {
                    const name1 = name.replace(item['exp'], word);
                    if (name1 != name) {
                        keywords.push(name1);
                        getList(name1);
                    }
                });
            });
            // 同义词替换
            for (const word in _similar) {
                const name1 = name.replace(word, _similar[word]);
                const name2 = name.replace(_similar[word], word);
                if (name1 != name) {
                    keywords.push(name1);
                }
                if (name2 != name) {
                    keywords.push(name2);
                }
            }
        };
        getList(name);
        // 通过关键词找关系
        const items_map = [[], [], []];
        keywords.forEach(function (name) {
            name = name.replace(/^[尕幺细满碎晚末尾幼]/, '小');
            const match = name.match(/^[大|小]|^[一|二|三|四|五|六|七|八|九|十]+/);
            if (match) {  // 匹配排序
                const x_name = name.replace(match[0], '几');
                const r_name = name.replace(match[0], '');
                const num = zh2number(match[0]);
                [x_name, r_name, name].forEach((name, index) => {
                    const ids = $cache.get(name);
                    if (ids && ids.length) {
                        ids.forEach(i => {
                            const id = i.replace(/(,[hw])$/, '&' + num + '$1').replace(/([^hw]+)$/, '$1&' + num);
                            if (!i.match(/^[mf,]+$/) && !name.match(/^[从世]/)) {  // 直系祖辈不参与排序
                                items_map[index].push(id);
                            }
                        });
                    }
                });
            }
            items = items.concat($cache.get(name) || []);
        });
        // console.log('[keywords]',keywords);
        // 如找不到结果，再是否存在称呼的排行问题(不直接判断，因存在"大舅""三从父兄""三世祖"这样特俗含义的情况)
        items_map.forEach(function (items_x) {
            if (!items.length) {
                items = items_x;
            }
        });
        // 完全匹配不到结果
        if (!items.length) {
            isMatch = false;
        }
        const res = [];
        if (!result.length) {
            result = [''];
        }
        result.forEach(function (a) {
            items.forEach(function (b) {
                res.push(a + (b ? ',' + b : ''));
            });
        });
        result = res;
    }
    return isMatch ? filterId(result) : [];
};

// 合并选择器，查找两个对象之间的关系
export function mergeSelector(param) {
    let {
        from: from_selector,
        to: to_selector,
        sex: my_sex
    } = param;
    if (my_sex < 0) {
        const fromSex = from_selector.match(/^,[w1]/) ? 1 : from_selector.match(/^,[h0]/) ? 0 : -1;
        const toSex = to_selector.match(/^,[w1]/) ? 1 : to_selector.match(/^,[h0]/) ? 0 : -1;
        if (fromSex === -1 && toSex > -1) {
            my_sex = toSex;
        } else if (fromSex > -1 && toSex === -1) {
            my_sex = fromSex;
        } else if (fromSex === toSex) {
            my_sex = fromSex;
        } else {
            return [];
        }
    }
    let from_ids = selector2id(param['from'], my_sex);
    let to_ids = selector2id(param['to'], my_sex);
    if (!from_ids.length || !to_ids.length) {
        return [];
    }
    const result = [];
    from_ids.forEach(from => {
        to_ids.forEach(to => {
            let sex = my_sex;
            let selector = ',' + to;
            if (selector.match(/,([fhs1](&[ol\d]+)?|[olx]b)(&[ol\d]+)?$/)) {
                sex = 1;
            }
            if (selector.match(/,([mwd0](&[ol\d]+)?|[olx]s)(&[ol\d]+)?$/)) {
                sex = 0;
            }
            if (from && to) {
                let isOptimal = param.optimal;
                if (from.match(/&\d+/) || to.match(/&\d+/)) {
                    isOptimal = true;
                }
                if (isOptimal) {
                    ({
                        from,
                        to,
                        sex: my_sex
                    } = getOptimal({
                        from,
                        to,
                        sex: my_sex,
                        optimal: param.optimal
                    }));
                }
            }
            let to_rids = to ? reverseId(to, my_sex) : [''];
            to_rids.forEach(function (to_r) {
                let selector = (to_r ? ',' + to_r : '') + (from ? ',' + from : '');
                result.push({
                    selector,
                    sex
                });
            });
        });
    });
    return result;
};

// 扩展选择器
export function expandSelector(selector) {
    const result = [];
    const hash = {};
    const getSelector = function (selector) {
        if (!hash[selector]) {
            hash[selector] = true;
            let s = '';
            do {
                s = selector;
                for (const item of _filter) {
                    // console.log('[filter]',item['exp'],selector);
                    selector = selector.replace(item['exp'], item['str']);
                    if (selector.includes('#')) {
                        selector.split('#').forEach(getSelector);
                        return false;
                    }
                }
            } while (s != selector);
            if (selector.match(/,[mwd0](&[ol\d+])?,w|,[hfs1](&[ol\d]+)?,h/)) {  //同志关系去除
                return false;
            }
            result.push(selector);
        }
    };
    getSelector(selector);
    return result;
};

// 选择器转ID
export function selector2id(selector, sex) {
    if (!selector.match(/^,/)) {
        selector = ',' + selector;
    }
    //性别判断
    if (sex < 0) {
        if (selector.match(/^,[w1]/)) {
            sex = 1;
        } else if (selector.match(/^,[h0]/)) {
            sex = 0;
        }
    } else if (sex == 1 && selector.match(/^,[h0]/)) {
        return [];
    } else if (sex == 0 && selector.match(/^,[w1]/)) {
        return [];
    }
    if (sex > -1 && !selector.includes(',1') && !selector.includes(',0')) {
        selector = ',' + sex + selector;
    }
    if (selector.match(/,[mwd0](&[ol\d]+)?,w|,[hfs1](&[ol\d]+)?,h/)) {  //同志关系去除
        return [];
    }
    const result = expandSelector(selector).map(selector => selector.replace(/,[01]/, '').substr(1));  //去前面逗号和性别信息
    return filterId(result);
};