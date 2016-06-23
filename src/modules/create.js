import { has, createDict, defProp, defProps, isPlain, getKeys } from './object'
import { isDom, isArray, isStrOrNum, isFn } from './check'
import { toStringNode, toBool, c2d } from './util'
import { each, every, map } from './collection'
import { setObserver } from './observer'
import { assign, assignExtend } from './assign'
import { attachEvent } from './event'
import { setReference } from './reference'
import { insertBefore } from './insert_node'
import { Component } from './component'

var pxChecks = ['width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight']
!['', 'Top', 'Right', 'Bottom', 'Left'].forEach(function (pos) {
    pxChecks.push('padding' + pos)
    pxChecks.push('margin' + pos)
})

var dimensionStyle = pxChecks,
    displayStyle = ['color', 'backgroundColor', 'background', 'display', 'position', 'border', 'transform', 'opacity', 'fontSize'],
    shareStyle = ['defaults'],
    specialChecks = ['style', 'attrs'],
    childrenChecks = [ 'children', 'items'],
    evtArrChecks = ['events'],
    directStyleChecks = dimensionStyle.concat(displayStyle)

var mouseEvts = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove'],
    dragEvts = ['dragstart', 'dragend', 'drag', 'dragover', 'dragenter', 'dragleave', 'drop'],
    focusEvts = ['blur', 'focus'],
    keyEvts = ['keydown', 'keypress', 'keyup'],
    formEvts = ['change', 'input', 'submit'],
    touchEvts = ['touchstart', 'touchmove', 'touchend'],
    scrEvts = ['wheel', 'scroll'],
    eventChecks = mouseEvts.concat(dragEvts,focusEvts,keyEvts,formEvts,touchEvts,scrEvts)

var cbChecks = ['created', 'appended'],
    classChecks = ['className', 'cls'],
    delayExtraClasses = ['xtraCls', 'xCls'],
    allClassNameChecks = delayExtraClasses.concat(classChecks),
    delayTextProps = ['text', 'textContent'],
    delayAppendTarget = ['parent'],
    allChecks = dimensionStyle.concat(
        displayStyle,
        shareStyle,
        specialChecks,
        childrenChecks,
        evtArrChecks,
        eventChecks,
        cbChecks,
        classChecks,
        delayExtraClasses,
        delayTextProps,
        delayAppendTarget
    )

var dimRange = dimensionStyle.length,
    disRange = dimRange + displayStyle.length,
    shareRange = disRange + shareStyle.length,
    specialRange = shareRange + specialChecks.length,
    childrenRange = specialRange + childrenChecks.length,
    evtArrRange = childrenRange + evtArrChecks.length,
    evtRange = evtArrRange + eventChecks.length,
    cbRange = evtRange + cbChecks.length,
    clsRange = cbRange + classChecks.length,
    xtraRange = clsRange + delayExtraClasses.length,
    textRange = xtraRange + delayTextProps.length
/**
 * @private specialKey {number} key for differentiating template groups
 */
var specialKey = Math.floor(Math.random() * 100000)
/**
 * @param el {Element}
 * @returns {Object}
 */
function getDefaults(el) {
    var elSetups = el.setups
    return elSetups ? elSetups.__configs.defaults : null
}
/**
 * Return children configs object when element is created by dominic
 * Return null if error / not found
 * @param el {Element}
 */
function getChildrenConfigs(el) {
    var elSetups = el.setups
    if (!elSetups) return null
    if (has(elSetups, 'items'))
        return elSetups.items
    if (has(elSetups, 'children'))
        return elSetups.children
    return null
}
/**
 * @param el {Element}
 * @param defs {Object} el definitions
 */
function setDefs(el, defs) {
    var elSetups = el.setups,
        configs = elSetups.__configs,
        events = elSetups.__events,
        evtLen = events.length,
        elStyle = el.style
    for (var key in defs) {
        if (has(defs, key)) {
            var val = defs[key],
                keyIdx = allChecks.indexOf(key)
            if (keyIdx == -1)
                el[key] = val
            else {
                if (keyIdx < dimRange) {
                    elStyle[key] = isNaN(val) ? val : (val + 'px')
                } else if (keyIdx < disRange) {
                    elStyle[key] = val
                } else if (keyIdx < shareRange) {
                    if (!has(configs, 'defaults')) {
                        defProp(configs, 'defaults', { value: createDict() })
                    }
                    assign(configs.defaults, val)
                } else if (keyIdx < specialRange) {
                    elSetups[key] = val
                } else if (keyIdx < childrenRange) {
                    elSetups.children = val
                } else if (keyIdx < evtArrRange) {
                    val.forEach(function (evtArgs) { events[evtLen++] = evtArgs })
                } else if (keyIdx < evtRange) {
                    events[evtLen++] = assign({ type: key }, val)
                } else if (keyIdx < cbRange) {
                    elSetups[key] = val
                } else if (keyIdx < xtraRange) {
                    if (!val) continue
                    if (!has(elSetups, 'cls')) {
                        elSetups.cls = ''
                    }
                    elSetups.cls += val + ' '
                } else if (keyIdx < textRange) {
                    el.appendChild(document.createTextNode(val))
                } else {
                    defProp(elSetups, 'parent', { value: val })
                }
            }
        }
    }
}
/**
 * @param el {Element}
 */
function setAttrs(el) {
    var elSetups = el.setups
    if (!elSetups || !has(elSetups, 'attrs')) return
    each(elSetups.attrs, function(value, attrName) {
        el.setAttribute(c2d(attrName), value)
    })
}
/**
 * @param el {Element}
 */
function setStyles(el) {
    var elSetups = el.setups
    if (!elSetups || !has(elSetups, 'style')) return
    var elStyle = el.style,
        styles = elSetups.style
    for (var s in styles) {
        if (has(styles, s)) {
            var styleVal = styles[s]
            if (pxChecks.indexOf(s) !== -1)
                elStyle[s] = isNaN(styleVal) ? styleVal : (styleVal + 'px')
            else
                elStyle[s] = styleVal
        }
    }
}
/**
 * @param el {Element}
 * @param root {Element}
 */
function setEvents(el, root) {
    var elSetups = el.setups
    if (!elSetups || !has(elSetups, '__events')) return
    for (var i = 0, elEvents = elSetups.__events, len = elEvents.length; i < len; i++) {
        var evtArgs = elEvents[i]
        attachEvent(el, evtArgs, root)
    }
}
/**
 * set class attribute for element, from el.setups
 * @param el {Element}
 */
function setCls(el) {
    var elSetups = el.setups
    if (!elSetups || !has(elSetups, 'cls') || !elSetups.cls) return
    el.className = elSetups.cls.trim()
}
function callCreated(el, root) {
    var elSetups = el.setups
    if (!elSetups || !has(elSetups, 'created')) return
    if (isFn(elSetups.created))
        elSetups.created.call(root, el, root)
}
/**
 * @param defs {Object} child definitions
 * @returns {Element}
 */
function createChildren(defs) {
    if (has(defs, 'if') && !toBool(defs.if)) return null  
    var tag = has(defs, 'tag') ? defs.tag : 'div',
        el = document.createElement(tag)
    createSetupsHolder(el)
    setDefs(el, defs)
    return el
}
/**
 * @param el {Element} parent -> for defaults configs purpose
 * @param object {Object} child definitions
 * {Element}
 */
function object2children(el, object, root) {
    var defaults = getDefaults(el),
        defs = assignExtend(object, defaults),
        child = createChildren(defs)
    if (!child) return null
    setAttrs(child)
    setStyles(child)
    setEvents(child, root)
    setCls(child)
    if (has(child, 'hide') && toBool(child.hide))
        child.style.display = 'none'
    child.root_ = root
    return child
}
/**
 * @param parent {Element}
 * @param child {Element}
 * @param root {Element}
 * @param [stop] {Element}
 */
function appendChild(parent, child, root, stop) {
    if (child === null || typeof child === 'undefined') return
    setReference(parent, child, root)
    insertBefore(parent, child, stop)
    if (has(child, 'd__isCmp')) {
        if (has(child, 'hide'))
            child.style.display = 'none'
        child.root_ = root
        return
    }
    var f2 = getChildrenConfigs(child)
    setChildren(child, f2, root)
    callCreated(child, root)
}
/**
 * Used by 'for', does not accept array as input
 * @param el {Element}
 * @param input {(string|number|Object)}
 * @param root {Element}
 * @param [groupKey] {number}
 */
function makeChild(el, input, root, groupKey) {
    var child = null
    if (isArray(input) || typeof input === 'function') {
        console.info('Return value in template function is an array or a function. Ingored')
        return null
    }
    if (isPlain(input)) {
        if (has(input, 'ctype'))
            child = createComponent(input)
        else
            child = object2children(el, input, root)
    } else if (isStrOrNum(input)) {
        child = document.createTextNode(input)
    } else if (isDom(input)) {
        child = input
    }
    if (groupKey && child)
        child.groupKey = groupKey
    return child
}
/**
 * @param el {Element}
 * @param forOpts {{for: Object, scope: (string|Object), tplFn: Function, root: string, alwaysIterate: bool, observeProp: string }}
 * @param groupKey {number}
 * @param rool {Element}
 */
function for2children(el, forOpts, groupKey, root, stop) {
    var val = forOpts.for
    if (!val) return
    var data = has(forOpts, 'root') ? val[forOpts.root] : val,
        fn = forOpts.tplFn,
        children,
        fnResult,
        child
    if (data && typeof fn === 'function') {
        var thisArg = root
        if (has(forOpts, 'scope')) {
            var scope = opts.scope
            thisArg = scope === 'root' ? root : (scope === 'parent' ? parent : scope)
        }
        if (isArray(data))
            data.forEach(function(d, i) {
                fnResult = fn.call(thisArg, d, i)
                child = makeChild(el, fnResult, root, groupKey)
                if (child)
                    appendChild(el, child, root, stop)
                // return child
            })
        else if (isPlain(data) && forOpts.alwaysIterate) {
            var keys = getKeys(data)
            children = keys.forEach(function (key, i) {
                fnResult = fn.call(thisArg, data[key], key)
                child = makeChild(el, fnResult, root, groupKey)
                if (child)
                    appendChild(el, child, root, stop)
                return child
            })
        }
        else {
            fnResult = fn.call(thisArg, data)
			if (!isArray(fnResult)) {
				fnResult = [fnResult]
            }
            children = fnResult.forEach(function(result, i) {
                child = makeChild(el, result, root, groupKey)
                if (child)
                    appendChild(el, child, root, stop)
                return child
            })
		}
    }
}
/**
 * @param el {Element}
 * @param tplOpts {Object}
 * @param root {Element}
 */
function setChildrenInFor(el, tplOpts, root) {
    var groupKey
    if (has(tplOpts, 'observeProp')) {
        var obsProp = tplOpts.observeProp,
            groupKey = specialKey++
        if (obsProp && isStrOrNum(obsProp) && obsProp !== '__owner') {
            var observer = setObserver(el, tplOpts, groupKey, root)
        }
    }
    for2children(el, tplOpts, groupKey, root)
}
/**
 * @param el {Element}
 * @param children {any}
 * @param root {Element}
 */
function setChildren(el, children, root) {
    if (!children) return
    var child
    if (isPlain(children)) {
        if (has(children, 'ctype')) {
            child = createComponent(children)
            appendChild(el, child, root)
            return
        }
        if (has(children, 'for')) {
            setChildrenInFor(el, children, root)
        }
        else {
            child = object2children(el, children, root)
            appendChild(el, child, root)
        }
        return
    }
    if (isArray(children)) {
        children.forEach(function(ch) {
            setChildren(el, ch, root)
        })
        return
    }
    if (typeof children === 'function') {
        var realChildren = children()
        setChildren(el, realChildren, root)
        return
    }
    if (isDom(children)) {
        appendChild(el, children, root)
    }
    else
        appendChild(el, document.createTextNode(children), root)
}
function setRootChildren(el) {
    var elSetups = el.setups
    if (!elSetups) return
    var children = getChildrenConfigs(el)
    setChildren(el, children, el)
}
/**
 * Define an object { setups: { __configs:Object, __events:[] } on an element
 * @param el {Element}
 */
function createSetupsHolder(el) {
    var setups = createDict()
    defProps(setups, {
        __configs: { value: createDict() },
        __events: { value: [] }
    })
    el.setups = setups
}
/**
 * Entry function, executed only once 
 * @param defs {Object} element definitions
 * @returns {Element}
 */
function createElement(defs) {
    var tag = has(defs, 'tag') ? defs.tag : 'div'
    var el = document.createElement(tag)
    defProp(el, 'd__isCmp', { value: true })
    createSetupsHolder(el)
    setDefs(el, defs)
    setAttrs(el)
    setStyles(el)
    setEvents(el, el)
    setCls(el)
    setRootChildren(el)
    var elSetups = el.setups
    if (has(elSetups, 'created') && isFn(elSetups.created)) {
        elSetups.created.call(el, el, el)
    }
    if (has(elSetups, 'parent')) {
        elSetups.parent.appendChild(el)
        if (has(elSetups, 'appended'))
            elSetups.appended.call(el)
    }
    return el
}
/**
 * Entry function, executed only once
 * @param defs {Object} component definitions
 * @return {Element}
 */
function createComponent(defs) {
    var ctype = defs.ctype
    var definitions = Component.get(ctype).create(defs)
    // Carry the reference to the component
    if (has(defs, 'ref')) {
        definitions.ref = defs.ref
        if (has(defs, 'refScope'))
            definitions.refScope = defs.refScope
    }
    else if (has(defs, 'directRef'))
        definitions.directRef = defs.directRef
    if (has(defs, 'hide'))
        definitions.hide = defs.hide
    var comp = createElement(definitions)
    comp.ctype = ctype
    return comp
}
/**
 * API function
 * @param defs {Object} Element definitions
 * @returns {Element}
 */
function create(defs) {
    if (has(defs, 'ctype')) {
        return createComponent(defs)
    }
    else {
        return createElement(defs)
    }
}

export { getDefaults, create, for2children }