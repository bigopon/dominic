import { has, createDict, defProps } from './object'
import { isStrOrNum, isFn } from './check'

function ReferenceHolder() {}

defProps(ReferenceHolder.prototype, {
    remove: {
        value: function (expression) {
            if (typeof expression !== 'function') return false
            var refKeys = Object.keys(this)
            var successCount = 0
            for (var i = 0; i < refKeys.length; i++) {
                var key = refKeys[i]
                if (expression.call(null, this[key], key)) {
                    successCount += (delete this[key] ? 1 : 0)
                }
            }
            return successCount == refKeys.length
        }
    },
    removeRef: {
        value: function (value) {
            if (isStrOrNum(value)) {
                value = '' + value
                if (has(this, value))
                    return delete this[value]
            }
            else if (isFn(value)) {
                var refKeys = Object.keys(this),
                    successCount = 0
                for (var i = 0; i < refKeys.length; i++) {
                    var key = refKeys[i]
                    if (expression.call(null, this[key], key)) {
                        successCount += (delete this[key] ? 1 : 0)
                    }
                }
                return successCount == refKeys.length
            }
            return false
        }
    },
    removeAll: {
        value: function () {
            var allrefs = Object.keys(this)
            for (var count = 0; count < allrefs.length; count++)
                delete this[allrefs[count]]
            return count === allrefs.length
        }
    }
})

function setReference(parent, el, root) {
    var ref, holder
    if (has(el, 'ref')) {
        ref = el.ref
        if (ref === '' || !isStrOrNum(ref)) return
        var scope = has(el, 'refScope') && el.refScope === 'parent' ? parent : root
        if (!(has(scope, 'refs')))
            scope.refs = new ReferenceHolder()
        holder = scope.refs
    }
    else if (has(el, 'directRef')) {
        ref = el.directRef
        if (ref === '' || !isStrOrNum(ref)) return;
        holder = root
    }
    else {
        return
    }
    holder[ref] = el
    el.hsr = true
}

export { setReference }