/*
 * 完整关系链数据 - 合并各类关系链数据
*/
import _prefix from './data/prefix.js';
import _branch from './data/branch.js';
import _main from './data/main.js';
import _multipie from './data/multiple.js';
import { expandSelector } from './selector.js';
import { objectToMap } from './utils.js';

let $map = objectToMap(_multipie);

// 分支 - 前缀处理
const prefixMap = {};
for (const key in _prefix) {
    prefixMap[key] = {};
    for (const selector in _prefix[key]) {
        expandSelector(selector).forEach(function (s) {
            prefixMap[key][s] = _prefix[key][selector];
        });
    }
}

// 分支 - 节点处理
const branchMap = {};
for (const selector in _branch) {
    expandSelector(selector).forEach(function (s) {
        branchMap[s] = _branch[selector];
    });
}

// 分支 - 合并
const getMap = function (prefixMap, branchMap) {
    const map = new Map();
    for (const key in branchMap) {
        const tag = key.match(/\{.+?\}/)[0];
        const nameList = branchMap[key];
        for (const k in prefixMap[tag]) {
            const prefixList = prefixMap[tag][k];
            const newKey = key.replace(tag, k);
            const isFilter = ['h,h', 'w,w', 'w,h', 'h,w'].some(pair => newKey.includes(pair));
            if (!isFilter) {
                const newList = prefixList.flatMap((prefix) =>
                    nameList.map((name) => (name.includes('?') ? name.replace('?', prefix) : prefix + name))
                );
                const existing = map.get(newKey) || $map.get(newKey) || [];
                map.set(newKey, newList.concat(existing));
            }
        }
    }
    return map;
};

const tempMap = getMap(prefixMap, branchMap);
tempMap.forEach((value, key) => {
    $map.set(key, value);
});

// 主要关系
for (let key in _main) {
    const existing = $map.get(key) || [];
    $map.set(key, [..._main[key], ...existing]);
}

// 版权彩蛋
$map.set('o', ['passer-by.com', '\u4f5c\u8005']);

// 配偶关系
const mateMap = {
    'w': ['妻', '内', '岳', '岳家', '丈人'],
    'h': ['夫', '外', '公', '婆家', '婆婆'],
};

const nameSet = new Set([...$map.values()].flat());

$map.keys().forEach(function(key){
    if (key.match(/^[fm]/) || key.match(/^[olx][bs]$|^[olx][bs],[^mf]/)) {
        for (const k in mateMap) {
            let newKey = k + ',' + key;
            if (key.match(/[fm]/)) {
                let newKey_x = newKey.replace(/,[ol]([sb])(,[wh])?$/, ',x$1$2').replace(/(,[sd])&[ol](,[wh])?$/, '$1$2');
                if (newKey_x != newKey && $map.has(newKey_x)) {
                    continue;
                }
            }
            if (!$map.has(newKey)) {
                $map.set(newKey, []);
            }
            const prefixList = mateMap[k];
            const nameList = $map.get(key);
            const targetList = $map.get(newKey);
            prefixList.forEach(function (prefix) {
                nameList.forEach(function (name) {
                    const newName = prefix + name;
                    if (!nameSet.has(newName)) {
                        targetList.push(newName);
                        $map.set(newKey,targetList);
                    }
                });
            });
        }
    }
});

export default $map;