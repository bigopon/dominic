
import { has, defProps, defProp } from './object'
import { toSelector } from './util'
import { are, isNum, isFn } from './check'

var elP = Element.prototype
var matchesSelector = (
    elP.matches ||
    elP.matchesSelector ||
    elP.msMatchesSelector ||
    elP.webkitMatchesSelector ||
    elP.mozMatchesSelector ||
    elP.oMatchesSelector
)

function match(node, selector) {
    return matchesSelector.call(node, selector)
}

function walkupAndFindMatch(dest, current, selector) {
    while (current && (current !== dest)) {
        if (match(current, selector)) return current
        current = current.parentNode
    }
    return null
}

var keyEvts = ['keydown', 'keypress', 'keyup', 'input'],
    focusEvts = ['blur', 'focus']
function EventHolder() {}
EventHolder.__proto__ = Array.prototype
EventHolder.prototype = Object.create(Array.prototype)
defProps(EventHolder.prototype, {
    removeAll: {
        value: function removeAll() {
            for (var i = 0; i < this.length; i++)
                this[i].destroy()
            this.length = 0
        }
    },
    remove: {
        value: function remove(handler) {
            for (var i = 0; i < this.length; i++)
                if (this[i] === handler) {
                    this.splice(i, 1)
                    handler.destroy()
                    return
                }
        }
    }
})

function makeNormalHandler({ type, el, callback, capture, count, validator, finishCount }, thisArg) {
    function handler(event) {
        if (validator && !validator.call(thisArg, event))
            return
        if (count > -1) {
            if (count--)
                callback.call(thisArg, event)
            if (!count) {
                el.evts.remove(handler)
                if (finishCount)
                    finishCount.call(thisArg, event)
            }
        }
        else {
            callback.call(thisArg, event)
        }
    }
    handler.destroy = function() {
        return el.removeEventListener(type, handler, capture)
    }
    el.addEventListener(type, handler, capture)
    return handler
}

function makeDelegateNormalHandler({ type, el, callback, capture, delegate, count, validator, finishCount }, thisArg) {
    function handler(event) {
        if (el === event.target) return
        var match = walkupAndFindMatch(el, event.target, delegate)
        if (!match)
            return
        if (validator && !validator.call(thisArg, event, match, delegate))
            return
        if (count > -1) {
            if (count--)
                callback.call(thisArg, event, match, delegate)
            if (!count) {
                el.evts.remove(handler)
                if (finishCount)
                    finishCount.call(thisArg, event, match, delegate)
            }
        }
        else
            callback.call(thisArg, event, match, delegate)
    }
    handler.destroy = function() {
        return el.removeEventListener(type, handler, capture)
    }
    el.addEventListener(type, handler, capture)
    return handler
}

function makeNormalKeyHandler({ type, el, callback, capture, keys, count, validator, finishCount }, thisArg) {
    function handler(event) {
        if (keys && keys.indexOf(event.keyCode) === -1)
            return
        if (validator && !validator.call(thisArg, event))
            return
        if (count > -1) {
            if (count--)
                callback.call(thisArg, event)
            if (!count) {
                el.evts.remove(handler)
                if (finishCount)
                    finishCount.call(thisArg, event)
            }
        }
        else
            callback.call(thisArg, event)
    }
    handler.destroy = function() {
        return el.removeEventListener(type, handler, capture)
    }
    el.addEventListener(type, handler, capture)
    return handler
}

function makeDelegateKeyHandler({ type, el, callback, capture, delegate, keys, count, validator, finishCount }, thisArg) {
    function handler(event) {
        if (el === event.target) return
        var match = walkupAndFindMatch(el, event.target, delegate)
        if (!match)
            return
        if (keys && keys.indexOf(event.keyCode) === -1)
            return
        if (validator && !validator.call(thisArg, event, match, delegate))
            return
        if (count > -1) {
            if (count--)
                callback.call(thisArg, event, match, delegate)
            if (!count) {
                el.evts.remove(handler)
                if (finishCount)
                    finishCount.call(thisArg, event, match, delegate)
            }
        }
        else
            callback.call(thisArg, event, match, delegate)
    }
    handler.destroy = function() {
        return el.removeEventListener(type, handler, capture)
    }
    el.addEventListener(type, handler, capture)
    return handler
}

/**
 * @param el {Element}
 * @param evt {{ type:string, scope:(string|Object), handler:Function, delegate:string, key}}
 * @param root {Element}
 */
function attachEvent(el, evtArgs, root) {
    var type = evtArgs.type
    if (!type)
        throw new Error('No event type specified')
    var handler = evtArgs.handler,
        handlerRegType = typeof handler,
        realHandler,
        scope = evtArgs.scope === 'root' ?
            root :
            (has(evtArgs, 'scope') ? evtArgs.scope : el)

    if (handlerRegType === 'function')
        realHandler = handler
    else if (handlerRegType === 'string')
        realHandler = scope[handler]

    if (typeof realHandler !== 'function') {
        throw new Error('Cannot find handler: "' + handler + '" on element: [' + toSelector(scope) + '].')
    }

    var capture = !!evtArgs.capture,
        delegate = evtArgs.delegate,
        isKeyEvt = keyEvts.indexOf(type) !== -1,
        isFocusEvt = focusEvts.indexOf(type) !== -1,
        count = has(evtArgs, 'count') && isNum(evtArgs.count) ? evtArgs.count : -1,
        single = evtArgs.single === true,
        evtHandler,
        validator = null,
        finishCount = null
    if (has(evtArgs, 'validator')) {
        var v = evtArgs.validator,
            validatorType = typeof v
        // Validator handler check
        if (validatorType === 'string')
            validator = scope[v]
        else if (validatorType === 'function')
            validator = v
        if (typeof validator !== 'function')
            validator = null
    }
    if (has(evtArgs, 'finishCount')) {
        var fC = evtArgs.finishCount,
            finishCountType = typeof fC
        // Finish count handler check
        if (finishCountType === 'string')
            finishCount = scope[fC]
        else if (finishCountType === 'function')
            finishCount = fC
        if (typeof finishCount !== 'function')
            finishCount = null
    }

    if (isKeyEvt) {
        var keys = null
        if (has(evtArgs, 'key')) {
            if (typeof evtArgs.key === 'number')
                keys = [evtArgs.key]
            else if (are(evtArgs.key, 'number'))
                keys = evtArgs.key
        }
        if (!delegate || typeof delegate !== 'string')
            evtHandler = makeNormalKeyHandler({ type, el, callback: realHandler, capture, keys, count, validator, finishCount }, scope)
        else
            evtHandler = makeDelegateKeyHandler({ type, el, callback: realHandler, capture, delegate, keys, count, validator, finishCount }, scope)
    }
    else {
        if (isFocusEvt && delegate) {
            capture = true
        }
        if (!delegate || typeof delegate !== 'string')
            evtHandler = makeNormalHandler({ type, el, callback: realHandler, capture, count, validator, finishCount }, scope)
        else
            evtHandler = makeDelegateNormalHandler({ type, el, callback: realHandler, capture, delegate, count, validator, finishCount }, scope)
    }
        
    if (!has(el, 'evts'))
        el.evts = new EventHolder()
    el.evts.push(evtHandler)
    el.hse = true
}

export { attachEvent }