import { has } from './object'
import { isArray } from './check'
/**
 * Assign value to an object, does overwrite
 * @param dest {Object}
 */
function assign(dest) {
    dest = dest || {}
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i]
        if (!src) continue
        for (var key in src) {
            if (has(src, key))
                dest[key] = src[key]
        }
    }
    return dest
}
/**
 * Extend an object within given properties
 * @param dest {Object}
 */
function assignOnly(dest) {
    dest = dest || {}
    var argLen = arguments.length
    if (argLen < 3) return dest
    var propsToCopyCfg = arguments[argLen - 1]
    if (typeof propsToCopyCfg !== 'string') return dest
    var propsToCopy = propsToCopyCfg.split(',')
    if (!propsToCopy.length) return dest
    for (var i = 1; i < argLen - 1; i++) {
        var src = arguments[i]
        if (!src) continue
        for (var key in src) {
            if (has(src, key)) {
                if (propsToCopy.indexOf(key) === -1) continue
                var val = src[key]
                dest[key] = val
            }
        }
    }
    return dest
}
/**
 * Extend an object, does not overwrite
 * @param dest {Object}
 */
function assignExtend(dest) {
    dest = dest || {}
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i]
        if (!src) continue
        for (var key in src) {
            if (has(src, key)) {
                var val = src[key]
                if (isArray(dest)) {
                    for (var j = 0; j < dest.length; j++) {
                        var destMem = dest[j]
                        if (!has(destMem, key))
                            destMem[key] = val
                    }
                }
                else {
                    if (!has(dest, key))
                        dest[key] = val
                }
            }
        }
    }
    return dest
}

export { assign, assignExtend, assignOnly }