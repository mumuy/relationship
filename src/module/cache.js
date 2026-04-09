/*
 * 缓存数据
*/
import _input from './data/input.js';
import _sort from './data/sort.js';
import { $mode } from './mode.js';
import { mergeMap, objectToMap } from './utils.js';

let $key = mergeMap($mode, objectToMap(_input));
$key = mergeMap($key, objectToMap(_sort));

let $cache = new Map();
$key.forEach((names, key) => {
    names.forEach((name) => {
        const list = $cache.get(name) || [];
        list.push(key);
        $cache.set(name, list);
    });
});

export { $cache };