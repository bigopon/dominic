import { has } from './object'
import { isArray } from './check'

var idxOf = Array.prototype.indexOf
/**
 * @param arr {[any]}
 */
function extend(arr) {
    arr = arr || []
    var argLen = arguments.length
    if (argLen < 2) return arr
    var currIdx = arr.length
    for (var i = 1; i < argLen; i++) {
        var src = arguments[i]
        for (var j = 0; j < src.length; j++)
            arr[currIdx++] = src[j]
    }
    return arr
}
/**
 * use to 
 * @param object {Object}
 * @param fn {Function}
 * @param thisArg {any}
 */
function each(object, fn, thisArg) {
    for (var prop in object)
        if (has(object, prop))
            fn.call(thisArg, object[prop], prop)
}
/**
 * Helper to iterate nodelist
 * @param nodeList {any[]}
 * @param fn {Function}
 * @param thisArg {any}
 */
function forEach(list, fn, thisArg) {
    if (list)
        for (var i = 0; i < list.length; i++)
            fn.call(thisArg, list[i], i, list)
}

/**
 * Custom map version without falsy values
 * @param nodeList {Element[]}
 * @param fn {Function}
 * @param thisArg {any}
 */
function map(nodeList, fn, thisArg) {
    if (nodeList) {
        var result = []
        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i],
                res = fn.call(thisArg, node, i, nodeList) 
            if (res)
                result.push(res)
        }
        return result
    }
    return null
}

/**
 * Helper to run condition against each member in a list
 * @param nodeList {any[]}
 * @param fn {Function}
 * @param thisArg {any}
 */
function every(list, fn, thisArg) {
    if (!list || !list.length) return false
    var len = list.length
    for (var i = 0; i < len; i++) {
        var node = list[i]
        if (!fn.call(thisArg, node, i, list))
            return false
    }
    return true
}

/**
 * true if any member of list satisfied condition
 * @param list {any[]}
 * @param fn {Function}
 * @param thisArg {any}
 */
function any(list, fn, thisArg) {
    if (!list || !list.length) return false
    var len = list.length
    for (var i = 0; i < len; i++)
        if (fn.call(thisArg, list[i], i, list))
            return true
    return false
}

/**
 * split an array by idx
 * @param arr {any[]}
 * @param idx {int} index where to split
 */
function split(arr, idx) {
    if (!isArray(arr)) return null
    var len = arr.length
    if (idx < len) {
        var left = [], currL = 0,
            right = [], currR = 0
        for (var i = 0; i < len; i++) {
            if (i < idx)
                left[currL++] = arr[i]
            else
                right[currR++] = arr[i]
        }
        return [left, right]
    }
    return arr
}
/**
 * @param nodeList {Element[]}
 */
function last(nodeList) {
    return nodeList ? nodeList[nodeList.length - 1] : null
}
/**
 * IndexOf function that can work with node list
 * @param list {any[]}
 * @param item {any}
 */
function indexOf(list, item) {
    return idxOf.call(list, item)
}

export { extend, each, forEach, map, every, any, split, last, indexOf }