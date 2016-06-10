(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Dominic = factory();
	}
})(this, function () {
	var win = this || {}
	var doc = win.document
	var Node = win.Node

	var fakeArray = []
	var fakeOpts = {}
	var fakeObj = fakeOpts
	var is = function (obj, type) { return typeof obj === type }
	var are = function (objs, type) {
		if (!Array.isArray(objs)) return false
		var count = 0, length = objs.length;
		for (var i = 0; i < length; i++)
			count += (typeof objs[i] === type ? 1 : 0)
		return count === length
	}
	var areDom = function (objs) {
		if (!Array.isArray(obj)) return false
		var count = 0, length = objs.length;
		for (var i = 0; i < length; i++)
			count += (objs[i] instanceof Node ? 1 : 0)
		return count === length
	}
	var isDom = function (obj) { return obj instanceof Node }
	var isObj = function (obj) { var objType = typeof obj; return obj && objType === 'object' || objType === 'function' }
	var isStrOrNum = function (val) { var valType = typeof val; return valType === 'string' || valType === 'number' }
	var isFn = function (val) { return typeof val === 'function' }
	var c2d = function (str) { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() }
	var cap = function (str) { return str[0].toUpperCase() + str.slice(1) }

	function forEach(nodeList, expression, thisArg) {
		if (nodeList)
			for (var i = 0; i < nodeList.length; i++)
				expression.call(thisArg, nodeList[i], i)
	}
	function map(nodeList, expression, thisArg) {
		if (nodeList) {
			var result = []
			for (var i = 0; i < nodeList.length; i++) {
				var node = nodeList[i]
				if (expression.call(thisArg, node, i))
					result.push(node)
			}
			return result
		}
		return null
	}
	function indexOf(el, nodeList) {
		return Array.prototype.indexOf.call(nodeList, el)
	}
	function assign(dest) {
		dest = dest || {}
		for (var i = 1; i < arguments.length; i++) {
			var src = arguments[i]
			if (!src) continue
			var keys = Object.keys(src)
			for (var j = 0; j < keys.length; j++) {
				dest[keys[j]] = src[keys[j]]
			}
		}
		return dest
	}
	function assign2(dest) {
		dest = dest || {}
		if (arguments.length < 2) return dest
		var propsToCopyCfg = arguments[arguments.length - 1]
		if (typeof propsToCopyCfg !== 'string') return dest
		var propsToCopy = propsToCopyCfg.split(',')
		if (!propsToCopy.length) return dest
		for (var i = 1; i < arguments.length - 1; i++) {
			var src = arguments[i]
			if (!src) continue
			var keys = Object.keys(arguments[i])
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j]
				if (propsToCopy.indexOf(key) === -1) continue
				var val = src[key]
				dest[key] = val
			}
		}
		return dest
	}
	function assign3(dest) {
		dest = dest || {}
		for (var i = 1; i < arguments.length; i++) {
			var src = arguments[i]
			if (!src) continue
			var keys = Object.keys(arguments[i])
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j]
				if (Array.isArray(dest)) {
					for (k = 0; k < dest.length; k++)
						if (!dest[k].hasOwnProperty(key))
							dest[k][key] = src[key]
				}
				else {
					if (!dest.hasOwnProperty(key))
						dest[key] = src[key]
				}
			}
		}
		return dest
	}
	function toSelector(dom) {
		var id = dom.id ? '#' + dom.id : ''
		var clsStr = dom.classList.toString()
		var classes = clsStr ? clsStr.split(' ') : fakeArray
		var selector = dom.localName + id + (classes.length ? ('.' + classes.join('.')) : '')
		return selector
	}

	function walkUpAndFindMatch(dest, current, selector) {
		while (current && (current !== dest)) {
			if (current.matches(selector)) return current
			current = current.parentNode
		}
		return null
	}

	function HandleEvent(type, opts, thisArg) {
		opts = opts || {}
		var el = opts.el || doc.documentElement
		var callback = opts.callback
		var capture = opts.capture || false
		var delegate = opts.delegate
		var current = null
		var handler = function (event) {
            var el = event.currentTarget
			if (typeof delegate === 'string') {
				if (el === event.target) return;
				var match = walkUpAndFindMatch(/* destination */el, /* current */ event.target, /* selector */ delegate);
				if (!match) return;
				if (typeof callback === 'function') {
					callback.call(thisArg, event, match, delegate)
				}
			}
			else {
				if (typeof callback === 'function') {
					callback.call(thisArg, event)
				}
			}
		}
		handler.destroy = function () {
			this.el = null
			return el.removeEventListener(type, handler, capture)
		}
		handler.el = el
		handler.type = type
		handler.capture = capture
		el.addEventListener(type, handler, capture)
		return handler
	}

	function HandleKeyEvent(type, opts, thisArg) {
		opts = opts || {}
		var el = opts.el || doc.documentElement
		var callback = opts.callback
		var capture = opts.capture
		var delegate = opts.delegate
		var keys
		if (typeof opts.key === 'number')
			keys = [opts.key]
		else if (are(opts.key, 'number'))
			keys = opts.key
		var handler = function (event) {
            var el = event.currentTarget
			if (typeof delegate === 'string') {
				if (el === event.target) return;
				var match = walkUpAndFindMatch(/* destination */el, /* current */ event.target, /* selector */ delegate);
				if (!match) return;
				if (keys && keys.indexOf(event.keyCode) === -1) return;
				if (typeof callback === 'function') {
					callback.call(thisArg, event, match, delegate)
				}
			}
			else {
				if (keys && keys.indexOf(event.keyCode) === -1) return;
				if (typeof callback === 'function') {
					callback.call(thisArg, event)
				}
			}
		}
		handler.destroy = function () {
			this.el = null
			return el.removeEventListener(type, handler, capture)
		}
		handler.el = el
		handler.type = type
		handler.capture = capture
		el.addEventListener(type, handler, capture)
		return handler
	}

	var defProps = Object.defineProperties
	var defProp = Object.defineProperty

	var Evt = (function () {
		var Evt = function () {
			Array.call(this)
		}
		Evt.prototype = Object.create(Array.prototype)
		defProps(Evt.prototype, {
			remove: {
				value: function (expression) {
					if (typeof expression !== 'function') return false
					var matches = []
					var successCount = 0
					for (var i = 0; i < this.length; i++)
						if (expression.call(null, this[i])) matches.push(this[i])
					for (var j = 0; j < matches.length; j++) {
						var evt = matches[j]
						evt.destroy()
						this.splice(this.indexOf(evt), 1)
						successCount++
					}
					return successCount == matches.length
				}
			},
			removeEvent: {
				value: function (type, el, capture) {
					var _this = this
					var result = []
					this.forEach(function (e) {
						if ((type === '*' || e.type === type) && (el === '*' || e.el === el) && (!capture || e.capture === capture))
							result.push(e)
					})
					result.forEach(function (e) {
						e.destroy()
						_this.splice(_this.indexOf(e), 1)
					})
					return result.length
				}
			},
			removeAll: {
				value: function () {
					for (var i = 0; i < this.length; i++)
						this[i].destroy()
					this.length = 0
				}
			}
		})
		return Evt
	})()

	var Refs = (function () {
		var Refs = function () { }
		Refs.prototype = Object.create(Object.prototype)
		defProps(Refs.prototype, {
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
				value: function (refName) {
					if (this.hasOwnProperty(refName))
						return delete this[refName]
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
		return Refs
	})()

	function setRefs(root, el, realRoot) {
		var ref = el.ref
		if (!isStrOrNum(ref)) return;
		var refScope = el.refScope
		var scope = refScope === 'parent' ? root : realRoot;
		scope.refs = scope.refs || new Refs()
		scope.refs[ref] = el
		el.setAttribute('data-hr', refScope === 'parent' ? 'pr' : 'rr')
	}

	var Obs = (function () {
		var Obs = function (realRoot) {
			if (typeof realRoot === 'undefined') throw new Error('No root provided')
			defProps(this, {
				__owner: {
					value: realRoot
				},
				__data: {
					value: {},
				}
			})
		}
		Obs.prototype = Object.create(Object.prototype)
        
        function areDifferent(oldData, newData) {
            var diff = false;
            var oldKeys = Object.keys(oldData)
            var newKeys = Object.keys(newData)
            if (oldKeys.join('') !== newKeys.join('')) return true
        }
		function removeEvt(el) {
			el.evts.removeAll()
			delete el.evts
		}
		function removeAllEvts(el) {
			if (el.evts)
				removeEvt(el)
			var hasEvtCEl = el.querySelectorAll('[data-he]')
			forEach(hasEvtCEl, removeEvt)
		}
		function removeAllRefInParent(el) {
			var parent = el.parentNode
			if (parent.refs) {
				parent.refs.removeAll()
				delete parent.refs
			}
		}
		function removeRefInRoot(el, root) {
			if (root.refs)
				root.refs.remove(function (refdEl, key) {
					return el === refdEl || el.contains(refdEl) 
				})
		}
		function removeRef(el, root) {
			var elRefType = el.getAttribute('data-hr')
			if (elRefType === 'pr')
				removeAllRefInParent(el)
			else if (elRefType === 'rr')
				removeRefInRoot(el, root)
		}
		function removeAllRefs(el, root) {
			if (el.refs) {
				el.refs.removeAll()
				delete el.refs
			}
			removeRef(el, root)
			var hasRefEls = el.querySelectorAll('[data-hr]')
			forEach(hasRefEls, function(hasRefEl) {
				removeRef(hasRefEl, root)
			})
		}
		/**
		 * @param els {Element[]}
		 * @param root {Element}
		 */
		function removeEls(els, root) {
			forEach(els, function(el, elIdx) {
				removeAllEvts(el)
				removeAllRefs(el, root)
				el.parentNode.removeChild(el)
			})
		}

		var specialKey = Math.floor(Math.random() * 100000)

		defProps(Obs.prototype, {
			add: {
				value: function (root, opts, injectOpts) {
					var obsProp = opts.update ? opts.update.observeProp : ''
					if (!obsProp || obsProp === '__owner' || !isStrOrNum(obsProp)) return;
					var thisTplKey = specialKey++ + ''
                    var defaultOpts = assign({ __key: thisTplKey }, injectOpts)
					var cacheOpts = assign2({}, opts, { obsProp: obsProp }, 'tplFn,for,root,obsProp,update,alwaysIterate')
					defProp(this, obsProp, {
						get: function (observeProperty) { return this.__data[observeProperty]}.bind(this, obsProp),
						set: function (root, cacheOpts, defaultOpts, thisTplKey, val) {
                            var obsProp = cacheOpts.obsProp
							this.__data[obsProp] = val
							cacheOpts.for = val
							var tobeRemoved = map(root.childNodes, function (node) { return node.__key === thisTplKey })
							var toStartEl
							var shouldRemoveAfterAppend = false
							if (tobeRemoved.length) {
								toStartEl = tobeRemoved[0].previousSibling
								if (toStartEl === null) {
									var currentChildNodes = root.childNodes
									if (currentChildNodes.length > tobeRemoved.length) {
										toStartEl = root.insertBefore(doc.createElement('a'), currentChildNodes[0])
										shouldRemoveAfterAppend = true
									}
								}
								removeEls(tobeRemoved, this.__owner)
							}
							else {
								toStartEl = root.lastChild
							}
							var newCFromTpl = tpl2dom(root, cacheOpts, this.__owner)
							if (isDom(newCFromTpl)) {
								assignDefs2Node(newCFromTpl, defaultOpts)
							}
							setChildren(root, newCFromTpl, this.__owner, defaultOpts, { startEl: toStartEl })
							if (shouldRemoveAfterAppend)
								root.removeChild(toStartEl)
						}.bind(this, root, cacheOpts, defaultOpts, thisTplKey)
					})
				}
			},
			push: {
				value: function (key, data) {
					key = '' + key
					var existingVal = this[key]
					if (!existingVal || !Array.isArray(existingVal))
						throw new Error('Value for property [' + key + '] is not an array.')
					if (Array.isArray(data))
						for (var i = 0; i < data.length; i++)
							existingVal.push(data[i])
					else
						existingVal.push(data)
					this[key] = existingVal
					return existingVal.length
				}
			}
		})
		return Obs
	})()

	function tpl2dom(root, opts, realRoot) {
		var val = opts.for
		if (!val) return null;
		var valRoot = opts.root || ''
		var data = valRoot ? val[valRoot] : val
		var fn = opts['tplFn']
		var children
		if (data && typeof fn === 'function') {
			var scope = opts.scope
			var thisArg = scope === 'root' ? realRoot : (scope === 'parent' ? root : scope)
			if (Array.isArray(data))
				children = data.map(fn, thisArg)
			else if (isObj(data) && opts.alwaysIterate) {
				var keys = Object.keys(data)
				children = keys.map(function (key) {
					return fn.call(thisArg, data[key], key)
				})
			}
			else
				children = fn.call(thisArg, data)
		}
		return children
	}

	function setObserver(root, opts, realRoot, injectOpts) {
		realRoot.observe = realRoot.observe || new Obs(realRoot)
		realRoot.observe.add(root, opts, injectOpts)
        return realRoot.observe
	}
	
	function fn2dom(root, defs, realRoot, injectOpts, start) {
		var fn = defs.fn
		if (typeof fn === 'function') {
			var scope = defs.scope
			var thisArg = scope === 'root' ? realRoot : (scope === 'parent' ? root : scope)
			var children = fn.call(thisArg)
			setChildren(root, children, realRoot, injectOpts, start)
		}
	}

	function for2dom(root, defs, realRoot, injectOpts, start) {
		if (isObj(defs.update)) {
			var obsProp = defs.update.observeProp
			if (isStrOrNum(obsProp)) {
				var observer = setObserver(root, defs, realRoot, injectOpts)
				observer[obsProp] = defs.for
			}
		}
		else {
			var cFromTpl = tpl2dom(root, defs, realRoot)
			if (isDom(cFromTpl)) {
				assignDefs2Node(cFromTpl, injectOpts)
			}
			setChildren(root, cFromTpl, realRoot, injectOpts, start)
		}
	}

	function setStyleNoOverride(el, opts) {
		var styles = Object.keys(opts)
		for (var i = 0; i < styles.length; i++) {
			var styleKey = styles[i]
			if (el.style[styleKey] !== '') continue;
			var styleVal = opts[styleKey]
			if (pxStyle.indexOf(styleKey) !== -1)
				el.style[styleKey] = isNaN(styleVal) ? styleVal : (styleVal + 'px')
			else
				el.style[styleKey] = styleVal
		}
	}

	function setAttrsNoOverride(el, attrs) {
		var attributes = Object.keys(attrs)
		for (var i = 0; i < attributes.length; i++) {
			var key = attributes[i]
			var realKey = c2d(key) 
			if (el.hasAttribute(realKey)) continue;
			var val = attrs[key]
			el.setAttribute(realKey, val)
		}
	}

	function assignDefs2Node(node, injectOpts) {
		for (var opt in injectOpts) {
			if (injectOpts.hasOwnProperty(opt)) {
				var val = injectOpts[opt]
				if (opt === 'style')
					setStyleNoOverride(node, val)
				else if (opt === 'attrs')
					setAttrsNoOverride(node, val)
				else
					node[opt] = val
			}
		}
	}

	function arrV2dom(root, defs, realRoot, injectOpts, start) {
		for (var i = 0; i < defs.length; i++) {
			var opts = defs[i]
			if (isDom(opts)) {
				assignDefs2Node(opts, injectOpts)
				setChildren(root, opts, realRoot, injectOpts, start)
			}
			else {
				if (injectOpts) assign3(opts, injectOpts)
				setChildren(root, opts, realRoot, injectOpts, start)
			}
		}
	}

	function v2dom(root, defs, realRoot, injectOpts, start) {
		var tag = '' + (defs.tag || 'div')
		delete defs.tag
		if (injectOpts) assign3(defs, injectOpts)
		var el = CreateElement(tag, defs, realRoot)
		setChildren(root, el, realRoot, injectOpts, start)
	}

	function insertAt(root, el, startIndex) {
		var pushedNode = root.childNodes[startIndex + 1]
		if (pushedNode) {
			root.insertBefore(el, pushedNode)
		}
		else {
			root.appendChild(el)
		}
	}

	/**
	 * @param key {string} key for detecting if node was not created in template
	 */
	function getNextDifferentElByKey(startEl, key) {
		if (startEl) {
			if (!startEl.hasOwnProperty('__key') || startEl.__key !== key)
				return startEl
			else
				return getNextDifferentElByKey(startEl.nextSibling, key)
		}
		return null
	}

	function insertAfter(root, el, start) {
		var nextEl = start.startEl.nextSibling
		if (!nextEl)
			root.appendChild(el)
		else {
			var elKey = el.__key
			var tailEl = getNextDifferentElByKey(nextEl, elKey)
			if (tailEl)
				root.insertBefore(el, tailEl)
			else
				root.appendChild(el)
		}
	}

	function setChildren(root, obj, realRoot, injectOpts, start) {
		'use strict'
		if (!obj) return;
		if (isStrOrNum(obj)) {
			var textNode = doc.createTextNode(obj)
			if (start && start.startEl) {
				insertAfter(root, textNode, start)
				start.startEl = textNode
			}
			else
				root.appendChild(textNode)
			return
		}
		if (isDom(obj)) {
			if (start && start.startEl) {
				insertAfter(root, obj, start)
				start.startEl = obj
			}
			else
				root.appendChild(obj)
			setRefs(root, obj, realRoot)
		}
		else {
			if (typeof obj === 'function') {
				var c = obj()
				if (injectOpts) assign3(c, injectOpts)
				setChildren(root, c, realRoot, injectOpts, start)
			}
			else if (Array.isArray(obj)) {
				arrV2dom.apply(null, arguments)
			}
			else {
				if (obj.hasOwnProperty('for')) {
					for2dom.apply(null, arguments)
				}
				else if (obj.hasOwnProperty('fn')) {
					fn2dom.apply(null, arguments)
				} else {
					v2dom.apply(null, arguments)
				}
			}
		}
	}

	function attachEvent(el, evt, realRoot) {
		var type = evt.type
		if (!type) throw new Error('No event type specified')
		var handler = evt.handler
		var handlerRegType = typeof handler
		var realHandler
		realRoot = realRoot || el
		var scope = evt.scope === 'root' ? realRoot : (evt.scope ? evt.scope : el)
		if (handlerRegType === 'function')
			realHandler = handler
		else if (handlerRegType === 'string')
			realHandler = scope[handler]
		if (typeof realHandler !== 'function') throw new Error('Cannot find handler: "' + handler + '" on element: [' + toSelector(scope) + '].')
		var capture = evt.capture
		var delegate = evt.delegate
		var isKeyEvt = keyEvts.indexOf(type) !== -1
		var evtHandler
		if (isKeyEvt)
			evtHandler = HandleKeyEvent(type, { el: el, callback: realHandler, capture: capture, delegate: delegate, key: evt.key }, scope)
		else
			evtHandler = HandleEvent(type, { el: el, callback: realHandler, capture: capture, delegate: delegate, key: evt.key }, scope)
		if (el)
		el.evts = el.evts || new Evt()
		el.evts.push(evtHandler)
		if (el.hasAttribute('data-he') == false)
			el.setAttribute('data-he', '')
	}

	function setEvents(el, eventArgs, realRoot) {
		if (Array.isArray(eventArgs))
			for (var i = 0; i < eventArgs.length; i++)
				attachEvent(el, eventArgs[i], realRoot)
		else
			attachEvent(el, eventArgs, realRoot)
	}
	function setAttrs(el, attrs) {
		var attributes = Object.keys(attrs)
		for (var i = 0; i < attributes.length; i++) {
			var key = attributes[i]
			var val = attrs[key]
			var realKey = c2d(key)
			el.setAttribute(realKey, val)
		}
	}
    
    var pxStyle = ['width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight']
    !['', 'Top', 'Right', 'Bottom', 'Left'].forEach(function (pos) {
        pxStyle.push('padding' + pos)
        pxStyle.push('margin' + pos)
    })
	function setStyle(el, opts) {
		var styles = Object.keys(opts)
		for (var i = 0; i < styles.length; i++) {
			var styleKey = styles[i]
			var styleVal = opts[styleKey]
			if (pxStyle.indexOf(styleKey) !== -1)
				el.style[styleKey] = isNaN(styleVal) ? styleVal : (styleVal + 'px')
			else
				el.style[styleKey] = styleVal
		}
	}

	var setters = {
		setevents: setEvents,
		setattrs: setAttrs,
		setstyle: setStyle,
		setchildren: setChildren,
		setitems: setChildren
	}

	function setDelaySetups(el, setups, root, injectOpts) {
		for (var i = 0, length = setups.length; i < length; i++) {
			var setup = setups[i]
			setters['set' + setup.key](el, setup.val, root, injectOpts)
		}
	}
	function setDelayEvts(el, events, root) {
		for (var i = 0, length = events.length; i < length; i++) {
			var evt = events[i]
			var evtArgs = assign({}, { type: evt.key }, evt.val)
			attachEvent(el, evtArgs, root)
		}
	}

	function evalIf(condition) {
		var bool
		if (typeof condition === 'function') bool = condition()
		else bool = condition
		return Boolean(bool)
	}
	var dimensionStyle = pxStyle
	var displayStyle = ['color', 'backgroundColor', 'background', 'display', 'position', 'border', 'transform', 'opacity', 'fontSize']
	var shareStyle = ['defaults']
	var fnConfig = ['style', 'children', 'items', 'attrs', 'events']

	var mouseEvts = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove']
	var dragEvts = ['dragstart', 'dragend', 'drag', 'dragover', 'dragenter', 'dragleave', 'drop']
	var focusEvts = ['blur', 'focus']
	var keyEvts = ['keydown', 'keypress', 'keyup']
	var formEvts = ['change', 'input', 'submit']
	var touchEvts = ['touchstart', 'touchmove', 'touchend']
	var scrEvts = ['wheel', 'scroll']
	var evtConfig = mouseEvts.concat(dragEvts,focusEvts,keyEvts,formEvts,touchEvts,scrEvts)

	var delayCbProps = ['created', 'appended']
	var delayProps = ['className', 'cls']
	var delayExtraClasses = ['xtraCls', 'xCls']
	var delayTextProps = ['text', 'textContent']
	var delayAppendTarget = ['parent']
	var allChecks = dimensionStyle.concat(displayStyle, shareStyle, fnConfig, evtConfig, delayCbProps, delayProps, delayExtraClasses, delayTextProps, delayAppendTarget)

	var dimRange = dimensionStyle.length
	var disRange = dimRange + displayStyle.length
	var shareRange = disRange + shareStyle.length
	var fnRange = shareRange + fnConfig.length
	var evtRange = fnRange + evtConfig.length
	var cbRange = evtRange + delayCbProps.length
	var propRange = cbRange + delayProps.length
	var xtraRange = propRange + delayExtraClasses.length
	var textRange = xtraRange + delayTextProps.length

	var CreateElement = function (name, defs, root, data) {
		defs = defs || fakeOpts
		if (defs.hasOwnProperty('if') && !evalIf(defs.if)) return null
		var el = doc.createElement(name)
		root = root || el
		var definitions = Object.keys(defs)
		var delaySetups
		var delayEvts
		var delayCb
		var delayClasses
		var delayExtraClasses
		var delayRoot
		var injectOpts
		var delayNoDisplay
		if (defs.hasOwnProperty('hide') && evalIf(defs.hide)) {
			delayNoDisplay = true
		}
		for (var i = 0, length = definitions.length; i < length; i++) {
			var key = definitions[i]
			var val = defs[key]
			var keyIdx = allChecks.indexOf(key)
			if (keyIdx == -1)
				el[key] = val
			else {
				if (keyIdx < dimRange) {
					el.style[key] = isNaN(val) ? val : (val + 'px')
				} else if (keyIdx < disRange) {
					el.style[key] = val
				} else if (keyIdx < shareRange) {
					assign((injectOpts = injectOpts || {}), val)
				} else if (keyIdx < fnRange) {
					(delaySetups = delaySetups || []).push({ key: key, val: val })
				} else if (keyIdx < evtRange) {
					(delayEvts = delayEvts || []).push({ key: key, val: val })
				} else if (keyIdx < cbRange) {
					(delayCb = delayCb || {})[key] = val
				} else if (keyIdx < propRange) {
					delayClasses = (delayClasses || '') + ' ' + val
				} else if (keyIdx < xtraRange) {
					delayClasses = (delayClasses || '') + ' ' + val
				} else if (keyIdx < textRange) {
					el.appendChild(doc.createTextNode(val))
				} else
					delayRoot = val
			}
		}

		if (delaySetups)
			setDelaySetups(el, delaySetups, root, injectOpts)
		if (delayClasses)
			el.className += (' ' + delayClasses).trim()
		if (delayEvts)
			setDelayEvts(el, delayEvts, root)
		if (delayCb && typeof delayCb.created === 'function')
			delayCb.created.call(el)
		if (delayRoot && isDom(delayRoot) && el === root) {
			delayRoot.appendChild(el)
			if (delayCb && typeof delayCb.appended === 'function')
				delayCb.appended.call(el, delayRoot)
		}
		if (delayNoDisplay)
			el.style.display = 'none'
		return el
	}

	var Dominic = {}
	defProps(Dominic, {
		createElement: {
			value: function(name, opts) {
				return CreateElement(name, opts)
			}
		},
		/**
		 * @Description set up window object for usage in non browser environment
		 * the Object should have document and Node that mimic document and Node of browser
		 */
		setWindow: {
			value: function(obj) {
				win = obj,
				doc = win.document
				Node = win.Node
			}
		}
	})

    return Dominic
});
