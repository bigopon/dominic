var defProps = Object.defineProperties,
    defProp = Object.defineProperty,
    getKeys = Object.keys,
    getAllKeys = Object.getOwnPropertyNames,
    proto = Object.prototype,
    hasOwn = proto.hasOwnProperty,
    has = function(dict, key) {
        return hasOwn.call(dict, key)
    },
    toString = Object.prototype.toString,
    isPlain = function(obj) {
        return toString.call(obj) === '[object Object]'
    },
    create = Object.create,
    createDict = function(initValue) {
        var dict = create(null)
        for (var i in initValue)
            if (has(initValue, i))
                dict[i] = initValue[i]
        return dict
    },
    getDesc = Object.getOwnPropertyDescriptor

export { defProp, defProps, getKeys, getAllKeys, getDesc, createDict, isPlain, has }