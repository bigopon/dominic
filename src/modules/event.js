
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
            var idx = this.indexOf(handler)
            if (idx !== -1) {
                handler.destroy()
                this.splice(idx, 1)
            }
        }
    }
})

function makeHandler({ type, el, callback, capture, delegate, single, count, validator }, thisArg) {
    function handler(event) {
        var isValid
        if (typeof delegate === 'string') {
            if (el === event.target) return
            var match = walkupAndFindMatch(el, event.target, delegate)
            if (!match) return
            if (typeof callback === 'function') {
                if (validator) {
                    isValid = validator.call(thisArg, event, match, delegate)
                    if (!isValid) return
                }
                if (handler.count > -1) {
                    if (handler.count--)
                        callback.call(thisArg, event, match, delegate)
                    if (!handler.count)
                        el.evts.remove(handler)
                }
                else
                    callback.call(thisArg, event, match, delegate)
            }
        }
        else {
            if (typeof callback === 'function') {
                if (validator) {
                    isValid = validator.call(thisArg, event)
                    if (!isValid) return
                }
                if (handler.count > -1) {
                    if (handler.count--)
                        callback.call(thisArg, event)
                    if (!handler.count)
                        el.evts.remove(handler)
                }
                else
                    callback.call(thisArg, event)
            }
        }
    }
    handler.count = count
    handler.destroy = function() {
        return el.removeEventListener(type, handler, capture)
    }
    el.addEventListener(type, handler, capture)
    return handler
}

function makeKeyHandler({ type, el, callback, capture, delegate, keys, count, validator }, thisArg) {
    function handler(event) {
        var isValid
        if (typeof delegate === 'string') {
            if (el === event.target) return
            var match = walkupAndFindMatch(el, event.target, delegate)
            if (!match) return
            if (keys && keys.indexOf(event.keyCode) === -1) return
            if (typeof callback === 'function') {
                if (validator) {
                    isValid = validator.call(thisArg, event, match, delegate)
                    if (!isValid) return
                }
                if (handler.count > -1) {
                    if (handler.count--)
                        callback.call(thisArg, event, match, delegate)
                    if (!handler.count)
                        el.evts.remove(handler)
                }
                else
                    callback.call(thisArg, event, match, delegate)
            }
        }
        else {
            if (keys && keys.indexOf(event.keyCode) === -1) return
            if (typeof callback === 'function') {
                if (validator) {
                    isValid = validator.call(thisArg, event)
                    if (!isValid) return
                }
                if (handler.count > -1) {
                    if (handler.count--)
                        callback.call(thisArg, event)
                    if (!handler.count)
                        el.evts.remove(handler)
                }
                else
                    callback.call(thisArg, event)
            }
        }
    }
    handler.count = count
    handler.destroy = function () {
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
        realHandler
    root = root || el
    var scope = evtArgs.scope === 'root' ?
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
        evtHandler
    var validatorType = typeof evtArgs.validator,
        validator = null
    if (validatorType === 'string')
        validator = scope[evtArgs.validator]
    else if (validatorType === 'function')
        validator = evtArgs.validator
    if (isKeyEvt) {
        var keys = null
        if (has(evtArgs, 'key')) {
            if (typeof evtArgs.key === 'number')
                keys = [evtArgs.key]
            else if (are(evtArgs.key, 'number'))
                keys = evtArgs.key
        }
        evtHandler = makeKeyHandler({ type, el, callback: realHandler, capture, delegate, keys, single, count, validator }, scope)
    }
    else {
        if (isFocusEvt && delegate) {
            capture = true
        }
        evtHandler = makeHandler({ type, el, callback: realHandler, capture, delegate, single, count, validator }, scope)
    }
        
    if (!has(el, 'evts'))
        el.evts = new EventHolder()
    el.evts.push(evtHandler)
    el.hse = true
}

export { attachEvent }