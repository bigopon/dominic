import { has } from './object'
import { extend } from './collection'

/**
 * Minic version of Element.querySelector for prop name & value matching key & value params
 * @param root {Element}
 * @param key {string}
 * @param value {any}
 * @returns {Element}
 */
function query(root, key, value) {
    var result = null,
        childNodes = root.childNodes,
        len = childNodes.length
    for (var i = 0; i < len; i++) {
        var child = childNodes[i]
        if (has(child, key) && (typeof value === 'undefined' || child[key] === value))
            result = child
        else
            result = query(child, key, value)
        if (result)
            return result
    }
    return result
}
/**
 * Query first direct child having prop name & value matching key & value params
 * @param root {Element}
 * @param key {string}
 * @param value {any}
 * @returns {Element}
 */
function queryDirect(root, key, value) {
    var childNodes = root.childNodes,
        len = childNodes.length
    for (var i = 0; i < len; i++) {
        var child = childNodes[i]
        if (has(child, key) && (typeof value === 'undefined' || child[key] === value))
            return child
    }
    return null
}

/**
 * Query the last child having prop name & value matching key & value params
 * @param root {Element} The element has children to query
 * @returns {Element}
 */
function queryLastDirect(root, key, value) {
    var childNodes = root.childNodes,
        len = childNodes.length
    for (var i = len - 1; i > -1; i++) {
        var child = childNodes[i]
        if (has(child, key) && (typeof value === 'undefined' || child[key] === value))
            return child
    }
    return null
}
/**
 * Query the first direct child having
 *  1. prop name & value matching key & value params
 *  2. relative index equals with idx param
 * @param root {Element}
 * @param idx {number}
 * @param key {string}
 * @param value {any}
 * @return {Element} 
 */
function queryDirectByIndex(root, idx, key, value) {
    var childNodes = root.childNodes,
        len = childNodes.length,
        startIdx = -1
    for (var i = 0; i < len; i++) {
        var child = childNodes[i]
        if (startIdx === -1) {
            if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) {
                if (startIdx === -1)
                    startIdx = i
            }
        }
        if (startIdx !== -1 && (i - startIdx) === idx)
            return child
    }
    return null
}
/**
 * Query all direct children having prop name & value matching key value params
 * @param root {Element}
 * @param key {string}
 * @param value {any}
 * @returns {Element[]}
 */
function queryAllDirect(root, key, value) {
    var result = [],
        childNodes = root.childNodes,
        length = childNodes.length,
        curr = 0
    for (var i = 0; i < length; i++) {
        var child = childNodes[i]
        if (has(child, key) && (typeof value === 'undefined' || child[key] === value))
            result[curr++] = child
    }
    return result
}
/**
 * Query all children having prop name & value match key value params
 * @param root {Element}
 * @param key {string}
 * @param value {any}
 * @returns {Element[]}
 */
function queryAll(root, key, value) {
    var result = [],
        childNodes = root.childNodes,
        length = childNodes.length
    for (var i = 0; i < length; i++) {
        var child = childNodes[i]
        if (has(child, key) && (typeof value === 'undefined' || child[key] === value))
            result[result.length] = child
        extend(result, queryAll(child, key, value))
    }
    return result
}
/**
 * Query all children having prop name & value match any pair in dictionary param
 * @param root {Element}
 * @param dict {{key: string, value: any}}
 * @returns {Element[]}
 */
function queryAllByMultipleKeys(root, dict) {
    if (!dict) return;
    var keys = Object.keys(dict),
        keyLen = keys.length,
        result = [],
        childNodes = root.childNodes,
        length = childNodes.length,
        resultIdx = 0
    for (var i = 0; i < length; i++) {
        var child = childNodes[i]
        for (var j = 0; j < keyLen; j++) {
            var key = keys[j]
            if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) {
                result[resultIdx++] = child
                break
            }
        }
        extend(result, queryAllByMultipleKeys(child, dict))
    }
}

export { query, queryDirect, queryLastDirect, queryDirectByIndex, queryAll, queryAllDirect, queryAllByMultipleKeys }