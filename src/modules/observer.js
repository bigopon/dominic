import { has, createDict, defProps, defProp } from './object'
import { isArray, isNum, isStrOrNum } from './check'
import { assignOnly } from './assign'
import { getDefaults, appendChild, for2children } from './create'
import { last, every, any } from './collection'
import { queryDirect, query, queryDirectByIndex, queryAllDirect, queryAll, queryLastDirect } from './query'

function removeEvt(el) {
	el.evts.removeAll()
	delete el.evts
}
function removeAllEvts(el) {
	if (has(el, 'evts'))
		removeEvt(el)
	var hasEvtEls = queryAll(el, 'hse', true)
	hasEvtEls.forEach(removeEvt)
}
function removeRef(el) {
    if (has(el, 'ref')) {
        var refHolder = has(el, 'refScope') && el.refScope === 'parent' ? el.parentNode : el.root_
        // case when component is direct root of parent,
        // refs holder will be gone before this execution
        if (has(refHolder, 'refs'))
            refHolder.refs.removeRef(el.ref)
        return
    }
    if (has(el, 'directRef')) {
        var directRef = el.directRef
        if (isStrOrNum(directRef) && directRef !== '') {
            delete el.root_[directRef]
        }
    }
}
function removeAllRefs(el) {
	if (has(el, 'refs')) {
		el.refs.removeAll()
		delete el.refs
	}
	if (has(el, 'ref')) {
		removeRef(el)
    } else if (has(el, 'directRef')) {
        delete root[el.directRef]
    }
	var hasRefEls = queryAll(el, 'hsr', true)
	hasRefEls.forEach(removeRef)
}
function removeEls(els) {
    els.forEach(function(el, elIdx) {
        if (el.nodeType === Node.ELEMENT_NODE) {
            removeAllRefs(el)
            removeAllEvts(el)
        }
        el.parentNode.removeChild(el)
    })
}

function handleGetter(observeProp) {
    return this.__data[observeProp]
}

function handleSetter(obsProp, val) {
    var allTpls = this.__tpl[obsProp],
        root = this.__owner
    this.__data[obsProp] = val    
    for (var i = 0, len = allTpls.length; i < len; i++) {
        var tplOpts = allTpls[i],
            parent = tplOpts.parent,
            groupKey = tplOpts.groupKey,
            stop,
            tobeRemoved = queryAllDirect(parent, 'groupKey', groupKey),
            root = this.__owner
        tplOpts.for = val
        if (tobeRemoved.length) {
            stop = last(tobeRemoved).nextSibling
        }
        removeEls(tobeRemoved)
        for2children(parent, tplOpts, groupKey, root, stop)
    }
}

const Observer = function (root) {
    if (!root) throw new Error('No root provided')
    defProps(this, {
        __owner: {
            value: root
        },
        __data: {
            value: createDict()
        },
		__tpl: {
			value: createDict()
		}
    })
}

defProps(Observer.prototype, {
    add: {
        value: function (parent, tplOpts, groupKey, root) {
            var obsProp = tplOpts.observeProp,
                tplOpts = assignOnly(createDict({ parent, groupKey }), tplOpts, 'tplFn,scope,for,root,observeProp,alwaysIterate'),
                val = tplOpts.for,
                alreadyRegistered = has(this, obsProp)
            if (alreadyRegistered) {
                this.__tpl[obsProp].push(tplOpts)
            }
            else {
                // set initial
                this.__data[obsProp] = val
                this.__tpl[obsProp] = [tplOpts]
                defProp(this, obsProp, {
                    get: handleGetter.bind(this, obsProp),
                    set: handleSetter.bind(this, obsProp)
                })
            }
        }
    },
    insert: {
        value: function insert(key, index, data) {
            key = '' + key
			var existingVal = this[key]
			if (!existingVal || !isArray(existingVal))
				throw new Error('Value for property [' + key + '] is not an array.')
            if (isNaN(index)) {
                if (arguments.length > 1)
                    this.push.apply(this, arguments)
                return
            }
            var currLen = existingVal.length,
                newData,
                currIdx = index
            if (index > currLen || index < 0) return
            if (isArray(data)) {
				newData = data
				for (var i = 0; i < data.length; i++)
					existingVal.splice(currIdx++, 0, data[i])
			}
			else {
				newData = [data]
                existingVal.splice(currIdx, 0, data)
			}
            var allTpls = this.__tpl[key]
            for (var i = 0, len = allTpls.length; i < len; i++) {
                var tplOpts = allTpls[i],
                    parent = tplOpts.parent,
                    groupKey = tplOpts.groupKey,
                    stop = queryDirectByIndex(parent, index, 'groupKey', groupKey),
                    root = this.__owner
                if (stop) {
                    tplOpts.for = newData
                    for2children(parent, tplOpts, groupKey, root, stop)
                }
            }
        }
    },
    remove: {
        value: function remove(key, indexes) {
            key = '' + key
            var existingVal = this[key]
			if (!existingVal || !isArray(existingVal))
				throw new Error('Value for property [' + key + '] is not an array.')
            var currLen = existingVal.length
            if (!isArray(indexes))
                indexes = [indexes]
            if (any(indexes, isNaN))
                return
            var allTpls = this.__tpl[key],
                tobeRemoved = []
            // make sure remove from lowest index to highest index 
            indexes.sort()
            for (var i = 0, len = allTpls.length; i < len; i++) {
                var tplOpts = allTpls[i],
                    parent = tplOpts.parent,
                    groupKey = tplOpts.groupKey,
                    noOfRemovedChild = 0
                for (var j = 0, indexLen = indexes.length; j < indexLen; j++) {
                    var index = indexes[i]
                    if (index > currLen || indexes < 0) continue
                    var childToRemove = queryDirectByIndex(parent, index, 'groupKey', groupKey)
                    if (childToRemove) {
                        removeEls([childToRemove])
                        existingVal.splice(index - noOfRemovedChild++, 1)
                    }
                }
            }
        }
    },
    push: {
		value: function (key, data) {
			key = '' + key
			var existingVal = this[key]
			if (!existingVal || !isArray(existingVal))
				throw new Error('Value for property [' + key + '] is not an array.')
			var currIdx = existingVal.length,
				newData
			if (isArray(data)) {
				newData = data
				for (var i = 0; i < data.length; i++) 
					existingVal[currIdx++] = data[i]
			}
			else {
				newData = [data]
				existingVal[currIdx++] = data
			}
            var allTpls = this.__tpl[key]
            for (var i = 0, len = allTpls.length; i < len; i++) {
                var tplOpts = allTpls[i],
                    parent = tplOpts.parent,
                    groupKey = tplOpts.groupKey,
                    lastTplEl = last(queryAllDirect(parent, 'groupKey', groupKey)),
                    stop,
                    root = this.__owner
                if (lastTplEl)
                    stop = lastTplEl.nextSibling
                tplOpts.for = newData
                for2children(parent, tplOpts, groupKey, root, stop)
            }
			return existingVal.length
		}
	},
	pop: {
		value: function(key) {
			key = '' + key
			var existingVal = this[key]
			if (!existingVal || !isArray(existingVal))
				throw new Error('Value for property [' + key + '] is not an array.')
            var allTpls = this.__tpl[key],
                tobeRemoved = [],
                rLen = 0
            for (var i = 0, len = allTpls.length; i < len; i++) {
                var tplOpts = allTpls[i],
                    parent = tplOpts.parent,
                    groupKey = tplOpts.groupKey,
                    lastTplEl = queryLastDirect(parent, 'groupKey', groupKey)
                if (lastTplEl) {
                    tobeRemoved[rLen++] = lastTplEl
                }
            }
            removeEls(tobeRemoved)
            existingVal.pop()
		}
	},
	shift: {
		value: function(key) {
			key = '' + key
			var existingVal = this[key]
			if (!existingVal || !isArray(existingVal))
				throw new Error('Value for property [' + key + '] is not an array.')
            var allTpls = this.__tpl[key],
                tobeRemoved = [],
                rLen = 0
            for (var i = 0, len = allTpls.length; i < len; i++) {
                var tplOpts = allTpls[i],
                    parent = tplOpts.parent,
                    groupKey = tplOpts.groupKey,
                    firstTplEl = queryDirect(parent, 'groupKey', groupKey)
                if (firstTplEl) {
                    tobeRemoved[rLen++] = firstTplEl
                }
            }
            removeEls(tobeRemoved)
            existingVal.shift()
		}
	},
	unshift: {
		value: function(key, data) {
			key = '' + key
			var existingVal = this[key]
			if (!existingVal || !isArray(existingVal))
				throw new Error('Value for property [' + key + '] is not an array.')
			var currIdx = existingVal.length,
				newData
			if (isArray(data)) {
				newData = data
				for (var i = 0; i < data.length; i++) 
					existingVal.unshift(data[i])
			}
			else {
				newData = [data] 
				existingVal.unshift(data)
			}
            var allTpls = this.__tpl[key]
            for (var i = 0, len = allTpls.length; i < len; i++) {
                var tplOpts = allTpls[i],
                    parent = tplOpts.parent,
                    groupKey = tplOpts.groupKey,
                    lastTplEl = last(queryAllDirect(parent, 'groupKey', groupKey)),
                    stop = queryDirect(parent, 'groupKey', groupKey),
                    root = this.__owner
                tplOpts.for = newData
                for2children(parent, tplOpts, groupKey, root, stop)
            }
			return existingVal.length
		}
	}
})

function setObserver(el, tplOpts, groupKey, root) {
    if (!has(root, 'observe'))
        root.observe = new Observer(root)
    root.observe.add(el, tplOpts, groupKey, root)
    return root.observe
}

export { setObserver }