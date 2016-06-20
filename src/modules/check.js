var isArray = Array.isArray

function isStrOrNum(val) {
    var valType = typeof val;
    return valType === 'string' || valType === 'number'
}
function isPlain(obj) {
    return toString.call(obj) === '[object Object]'
}
function isFn(obj) {
    return typeof obj === 'function'
}
function is(obj, type) {
    return typeof obj === type
}
function are(objs, type) {
    if (!isArray(objs)) return false
    var count = 0, length = objs.length;
    for (var i = 0; i < length; i++)
        if (typeof objs[i] !== type)
            return false
    return true
}
function isDom(node) {
    return node instanceof Node
}
function isNum(val) {
    return !isNaN(val)
}

export { isStrOrNum, isPlain, isArray, isFn, is, are, isDom, isNum }