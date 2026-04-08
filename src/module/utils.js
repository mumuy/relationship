/*
 * 数值转换
*/

const textAttr = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

// 中文数字转阿拉伯数字
export function zh2number(text) {
    let num = 0;
    const map = { '大': 1, '小': 99 };
    if (map[text]) {
        num = map[text];
    } else {
        let [unit, dec = 0] = text.replace(/^十/, '一十').split('十').map(word => textAttr.indexOf(word)).reverse();
        num = dec * 10 + unit;
    }
    return num;
};

// 阿拉伯数字转中文数字
export function number2zh(num) {
    let text = '';
    const map = { 1: '大', 99: '小' };
    if (map[num]) {
        text = map[num];
    } else {
        let dec = ~~(num / 10);
        let unit = num % 10;
        text = (dec ? (textAttr[dec] + '十').replace('一十', '十') : '') + textAttr[unit];
    }
    return text;
};

// 合并Map
export function mergeMap(target, source) {
    source.forEach((value, key) => {
        const names = target.get(key) || [];
        target.set(key, names.concat(value));
    });
    return target;
}

// 对象转Map
export function objectToMap(obj) {
    return new Map(Object.entries(obj));
}