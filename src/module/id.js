/*
 * 标识符 - 唯一性关系链，将【关系链】转换成【中文表述】
*/
import _pair from './data/pair.js';
import _sort from './data/sort.js';

import { number2zh } from './utils.js';
import { selector2id } from './selector.js';
import { $mode } from './mode.js';

// 逆转ID
export function reverseId(id, sex) {
    if (!id) {
        return [''];
    }
    // 映射关系
    let hash = {
        f: ['d', 's'],
        m: ['d', 's'],
        h: ['w', ''],
        w: ['', 'h'],
        s: ['m', 'f'],
        d: ['m', 'f'],
        lb: ['os', 'ob'],
        ob: ['ls', 'lb'],
        xb: ['xs', 'xb'],
        ls: ['os', 'ob'],
        os: ['ls', 'lb'],
        xs: ['xs', 'xb']
    };
    // 年纪判断
    let age = '';
    if (id.match(/&o$/)) {
        age = '&l';
    } else if (id.match(/&l$/)) {
        age = '&o';
    }
    id = id.replace(/&[ol\d+]/g, '');
    // 性别判断
    if (sex < 0) {
        if (id.match(/^w/)) {
            sex = 1;
        } else if (id.match(/^h/)) {
            sex = 0;
        }
    }
    const doing = function (sex) {
        const sid = (',' + sex + ',' + id).replace(/,[fhs]|,[olx]b/g, ',1').replace(/,[mwd]|,[olx]s/g, ',0');
        const sid_arr = sid.slice(0, sid.length - 2).split(',').reverse();
        const r_id = id.split(',').reverse().map((id, i) => hash[id][sid_arr[i]]).join(',');
        const gen = getGenById(r_id);
        return r_id + (gen ? '' : age);
    };
    if (sex < 0) {
        return [doing(1), doing(0)];
    } else {
        return [doing(sex)];
    }
};

// ID列表去重
export function filterId(arr) {
    const sameList = arr.filter(item => item === item.replace(/[ol](?=[s|b])/g, 'x').replace(/&[ol]/, ''));
    return arr.filter(item => {
        const temp = item.replace(/[ol](?=[s|b])/g, 'x').replace(/&[ol]/, '');
        return sameList.includes(item) || item != temp && !sameList.includes(temp);
    }).filter((item, idx, arr) => arr.indexOf(item) === idx);
};

// 通过ID获取世代数
export function getGenById(id) {
    const gMap = { 'f': 1, 'm': 1, 's': -1, 'd': -1 };
    let gen = 0;
    id.split(',').forEach(sub => {
        const s = sub.replace(/&[ol\d]+/, '');
        gen += gMap[s] || 0;
    });
    return gen;
};

// 通过ID获取关系称呼
export function getItemsById(id) {
    let items = [];
    const getData = function (key) {
        let ids = [];
        const k1 = key.replace(/(,[sd])(,[wh])?$/, '$1&o$2');
        const k2 = key.replace(/(,[sd])(,[wh])?$/, '$1&l$2');
        if ($mode.has(k1) && $mode.has(k2)) {
            ids = [k1, k2];
        } else if ($mode.has(key)) {
            ids = [key];
        }
        return filterId(ids).map(id => $mode.get(id)[0]);
    };
    // 对排序进行处理
    if (id.match(/&([\d]+)(,[hw])?$/)) {
        const num = id.match(/&([\d]+)(,[hw])?$/)[1];
        const zh = number2zh(num);
        id = id.replace(/&\d+/g, '');
        if (_sort[id]) {
            items.push(_sort[id][0].replace('几', zh));
        } else if ($mode.has(id)) {
            const gen = getGenById(id);
            let item = '';
            if (gen < 3 && !id.match(/[hw],/)) {
                $mode.get(id).forEach(function (name) {
                    if (!item && name.includes('几')) {
                        item = name.replace('几', zh);
                    }
                });
                if (!item) {
                    item = $mode.get(id)[0];
                    item = item.match(/^[大小]/) ? item.replace(/^[大小]/, zh) : zh + item;
                }
            }
            items.push(item);
        }
    }
    // 直接匹配称呼
    if (!items.length) {
        id = id.replace(/&\d+/g, '');
        items = getData(id);
    }
    // 忽略年龄条件查找
    if (!items.length) {
        id = id.replace(/&[ol]/g, '');
        items = getData(id);
    }
    // 忽略年龄条件查找
    if (!items.length) {
        id = id.replace(/[ol](b|s)/g, 'x$1');
        items = getData(id);
    }
    // 缩小访问查找
    if (!items.length) {
        let l = id.replace(/x/g, 'l');
        let o = id.replace(/x/g, 'o');
        items = items.concat(getData(o), getData(l));
    }
    return items;
};

// 通过ID获取关系链
const data = new Map($mode);
data.set('xb', ['兄弟']);
data.set('xs', ['姐妹']);

export function getChainById(id, sex = -1) {
    let item = id.split(',').map(sign => {
        const key = sign.replace(/&[ol\d]+/, '');
        return data.get(key)[0];
    }).join('的');
    if (sex > -1 && data.has(sex + ',' + id)) {
        if (sex == 0) {
            item = '(女性)' + item;
        } else if (sex == 1) {
            item = '(男性)' + item;
        }
    }
    return item;
};

// 通过ID获取关系合称
export function getPairsById(id1, id2) {
    id1 = id1.replace(/&\d+/g, '');
    id2 = id2.replace(/&\d+/g, '');
    const id1_x = id1.replace(/([ol])([bs])/g, 'x$2');
    const id2_x = id2.replace(/([ol])([bs])/g, 'x$2');
    const id1_r = id1.replace(/&[ol]/g, '');
    const id2_r = id2.replace(/&[ol]/g, '');

    let result = [];
    let result_x = [];
    let result_r = [];
    for (const key in _pair) {
        const selectors = key.split('#');
        if (selectors.length > 1) {
            const list1 = selector2id(selectors[0]);
            const list2 = selector2id(selectors[1]);
            const list1_r = list1.map(selector => selector.replace(/&[ol\d]+/, '').replace(/([ol])([bs])/, 'x$2'));
            const list2_r = list2.map(selector => selector.replace(/&[ol\d]+/, '').replace(/([ol])([bs])/, 'x$2'));
            if (list1.includes(id1) && list2.includes(id2) || list1.includes(id2) && list2.includes(id1)) {
                result.push(_pair[key][0]);
            }
            if (list1_r.includes(id1_x) && list2_r.includes(id2_x) || list1_r.includes(id2_x) && list2_r.includes(id1_x)) {
                result_x.push(_pair[key][0]);
            }
            if (list1_r.includes(id1_r) && list2_r.includes(id2_r) || list1_r.includes(id2_r) && list2_r.includes(id1_r)) {
                result_r.push(_pair[key][0]);
            }
        }
    }
    if (!result.length) {
        result = result_x;
    }
    if (!result.length) {
        result = result_r;
    }
    return result;
};