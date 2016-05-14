(function(root, factory) {
	if (typeof define === 'function' && define.amd)
		define([], factory);
	else if (typeof exports === 'object')
		module.exports = factory();
	else
		root.CreateElement = factory();
})(this, function () {
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
	var isDom = function (obj) { return obj instanceof Node }
	var isObj = function (obj) { var objType = typeof obj; return objType === 'object' || objType === 'function' }
	var isStrOrNum = function (val) { var valType = typeof val; return valType === 'string' || valType === 'number' }
	var isFn = function (val) { return typeof val === 'function' }
	var c2d = function (str) { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() }
	var cap = function (str) { return str[0].toUpperCase() + str.slice(1) }
	var assign = function (dest) {
		dest = dest || {}
		for (var i = 1; i < arguments.length; i++) {
			var src = arguments[i]
			var keys = Object.keys(arguments[i])
			for (var j = 0; j < keys.length; j++) {
				dest[keys[j]] = src[keys[j]]
			}
		}
		return dest
	}
	var assign2 = function (dest) {
		dest = dest || {}
		if (arguments.length < 2) return dest
		var propsToCopyCfg = arguments[arguments.length - 1]
		if (typeof propsToCopyCfg !== 'string') return dest
		var propsToCopy = propsToCopyCfg.split(',')
		if (!propsToCopy.length) return dest
		for (var i = 1; i < arguments.length - 1; i++) {
			var src = arguments[i]
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
	var assign3 = function (dest) {
		dest = dest || {}
		for (var i = 1; i < arguments.length; i++) {
			var src = arguments[i]
			var keys = Object.keys(arguments[i])
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j]
				if (!dest.hasOwnProperty(key))
					dest[key] = src[key]
			}
		}
		return dest
	}
	var toSelector = function (dom) {
		var id = dom.id ? '#' + dom.id : ''
		var clsStr = dom.classList.toString()
		var classes = clsStr ? clsStr.split(' ') : fakeArray
		var selector = dom.localName + id + (classes.length ? ('.' + classes.join('.')) : '')
		return selector
	}

	var walkUpAndFindMatch = function (dest, current, selector) {
		while (current !== dest) {
			if (current.matches(selector)) return current
			current = current.parentNode
		}
		return null
	}

	var HandleEvent = function (type, opts, thisArg) {
		opts = opts || {}
		var el = opts.el || document.documentElement
		var callback = opts.callback
		var capture = opts.capture || false
		var delegate = opts.delegate
		var current = null
		var handler = function (event) {
			if (typeof delegate === 'string') {
				if (el === event.target) return;
				var match = walkUpAndFindMatch(/* destination */el, /* current */ event.target, /* selector */ delegate);
				// var target = el.querySelector(delegate)
				// if (!target || !event.target.contains(target)) return;
				
				// var target = event.target
				// if (!target.matches(delegate)) return;
				if (!match) return;
				if (typeof callback === 'function') {
					// callback.call(target, event)
					callback.call(match, event)
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
						if ((type === '*' || e.type === type) && (el === '*' || e.el === el) && (!capture || e.capture === capture ))
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
					var count = 0
					for (; count < allrefs.length; count++)
						delete this[allrefs[count]]
					return count === allrefs.length
				}
			}
		})
		return Refs
	})()

	var Obs = (function () {
		var Obs = function (realRoot) {
			if (typeof realRoot === 'undefined') throw new Error('No root provided')
			this.__owner = realRoot
		}
		Obs.prototype = Object.create(Object.prototype)
		defProps(Obs.prototype, {
			add: {
				value: function (root, opts) {
					var obsProp = opts.update ? opts.update.observeProp : '' 
					if (!obsProp || obsProp === '__owner' || !isStrOrNum(obsProp)) return false
					var cacheOpt = assign2({}, opts, { appendTo: root, obsProp: obsProp }, 'tplFn,for,root,appendTo,obsProp,update')
					defProp(this, obsProp, {
						set: function (val) {
							cacheOpt.for = val
							while (root.firstChild) {
								var removedChild = root.removeChild(root.firstChild)
								this.__owner.evts.remove(function (evt) {
									return removedChild.contains(evt.el)
								})
								this.__owner.refs.remove(function (el, ref) {
									return removedChild === el || removedChild.contains(el)
								})
							}
							var newCFromTpl = tpl2dom(root, cacheOpt, this.__owner)
							setChildren(root, newCFromTpl, this.__owner)
						}
					})
				}
			}
		})
		return Obs
	})()

	var setRefs = function (root, el, realRoot) {
		var ref = el.ref
		if (!isStrOrNum(ref)) return;
		var refScope = el.refScope
		var scope = refScope === 'parent' ? root : realRoot;
		scope.refs = scope.refs || new Refs()
		scope.refs[ref] = el
	}

	var isDifferent = function (oldData, newData) {
		var isDiff = false;
		var oldKeys = Object.keys(oldData)
		var newKeys = Object.keys(newData)
		if (oldKeys.join('') !== newKeys.join('')) return true
		
	}

	var tpl2dom = function (root, opts, realRoot) {
		var val = opts.for
		var valRoot = opts.root || ''
		var data = valRoot ? val[valRoot] : val
		var fn = opts['tplFn']
		var children
		if (data && typeof fn === 'function') {
			var scope = opts.scope
			var scopeType = typeof scope
			var thisArg = scope === 'root' ? realRoot : (scope === 'parent' ? root : scope)
			if (Array.isArray(data))
				children = data.map(fn, thisArg)
			else
				children = fn.call(thisArg, data)
		}
		return children
	}

	var setObserver = function (root, opts, realRoot) {
		realRoot.observe = realRoot.observe || new Obs(realRoot)
		realRoot.observe.add(root, opts)
	}

	var setChildren = function (root, obj, realRoot, injectOpts) {
		'use strict'
		if (!isObj(obj)) return;
		if (isDom(obj)) {
			root.appendChild(obj)
            setRefs(root, obj, realRoot)
		}
		else {
			if (typeof obj === 'function') {
				var c = obj()
				setChildren(root, c, realRoot, injectOpts)
			}
			else if (Array.isArray(obj)) {
				for (var i = 0; i < obj.length; i++) {
					var opts = obj[i]
					if (injectOpts) assign3(opts, injectOpts)
					setChildren(root, obj[i], realRoot)
				}
			}
			else {
				var tag = obj.tag
				if (tag) {
					delete obj.tag
					if (injectOpts) assign3(opj, injectOpts)
					var el = CreateElement(tag, obj, realRoot)
					setChildren(root, el, realRoot)
				}
				else if (obj.hasOwnProperty('for')) {
					if (!isObj(obj.for)) return;
					var cFromTpl = tpl2dom(root, obj, realRoot)
					setChildren(root, cFromTpl, realRoot, injectOpts)
					if (isObj(obj.update)) {
						setObserver(root, obj, realRoot)
					}
				}
				else {
					var fn = obj.fn
					if (typeof fn === 'function') {
						var scope = obj.scope
						var thisArg = scope === 'root' ? realRoot : (scope === 'parent' ? root : scope)
						var children = fn.call(thisArg)
						setChildren(root, children, realRoot, injectOpts)
					}
				}
			}
		}
	}

	var attachEvent = function (root, evt, realRoot) {
		var type = evt.type
		if (!type) throw new Error('No event type specified')
		var handler = evt.handler
		var handlerRegType = typeof handler
		var realHandler
		realRoot = realRoot || root
		var scope = evt.scope === 'root' ? realRoot : (evt.scope ? evt.scope : root)
		if (handlerRegType === 'function')
			realHandler = handler
		else if (handlerRegType === 'string')
			realHandler = scope[handler]
		// if (!type || handlerRegType !== 'function' || handlerRegType !== 'string') return;
		// if (handlerRegType === 'string')
		// 	handler = realRoot[handler]
		if (typeof realHandler !== 'function') throw new Error('Cannot find handler: "' + handler + '" on element: [' + toSelector(scope) + '].')
		var capture = evt.capture
		var delegate = evt.delegate
		var handleType = HandleEvent(type, { el: root, callback: realHandler, capture: capture, delegate: delegate }, scope)
		realRoot.evts = realRoot.evts || new Evt()
		realRoot.evts.push(handleType)
	}

	var setEvents = function (root, eventArgs, realRoot) {
		if (Array.isArray(eventArgs))
			for (var i = 0; i < eventArgs.length; i++)
				attachEvent(root, eventArgs[i], realRoot)
		else
			attachEvent(root, eventArgs, realRoot)
	}
	var setAttrs = function (el, attrs) {
		var attributes = Object.keys(attrs)
		for (var i = 0; i < attributes.length; i++) {
			var key = attributes[i]
			var val = attrs[key]
			el.setAttribute(c2d(key), val)
		}
	}
	var setStyle = function (el, opts) {
		var styles = Object.keys(opts)
		for (var i = 0; i < styles.length; i++) {
			var styleKey = styles[i]
			var styleVal = opts[styleKey]
			el.style[styleKey] = isNaN(styleVal) ? styleVal : (styleVal + 'px')
		}
	}

	var setters = {
		setevents: setEvents,
		setattrs: setAttrs,
		setstyle: setStyle,
		setchildren: setChildren,
		setitems: setChildren
	}
	
	var setDelayProps = function (el, props) {
		var propNames = Object.keys(props), length = propNames.length
		for (var i = 0; i < length; i++) {
			var prop = propNames[i]
			var val = props[prop]
			el[prop] = (el[prop] + val).trim()
		}
	}
	var setDelaySetups = function (el, setups, root, injectOpts) {
		for (var i = 0, length = setups.length; i < length; i++) {
            var setup = setups[i]
			setters['set' + setup.key](el, setup.val, root, injectOpts)
        }
	}
	var setDelayEvts = function (el, events, root) {
		for (var i = 0, length = events.length; i < length; i++) {
			var evt = events[i]
			var evtArgs = assign({}, {type: evt.key}, evt.val)
			attachEvent(el, evtArgs, root)
		}
	}
	
	var evalIf = function (condition) {
		var bool
		if (typeof condition === 'function') bool = condition()
		else bool = condition
		return Boolean(bool)
	}
	var dimensionStyle = ['width', 'height', 'maxWidth', 'maxHeight', 'padding', 'margin']
	var displayStyle = ['color', 'backgroundColor', 'background', 'display', 'position', 'opacity']
	var shareStyle = ['defaults']
	var fnConfig = ['style', 'children', 'items', 'attrs', 'events']
	var evtConfig = [
		'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave',
		'dragstart', 'dragend', 'drag', 'dragover', 'dragenter', 'dragout', 'drop',
		'blur', 'focus',
		'keydown', 'keypress', 'keyup',
		'change', 'input', 'submit',
		'touchstart', 'touchmove', 'touchend',
		'wheel', 'scroll',
	]
	var delayCbProps = ['created', 'appended']
	var delayProps = ['className', 'id']
	var delayTextProps = ['text', 'textContent']
	var delayAppendTarget = ['parent']
	var allChecks = dimensionStyle.concat(displayStyle, shareStyle, fnConfig, evtConfig, delayCbProps, delayProps, delayTextProps, delayAppendTarget)
	
	var dimRange = dimensionStyle.length
	var disRange = dimRange + displayStyle.length
	var shareRange = disRange + shareStyle.length
	var fnRange = shareRange + fnConfig.length
	var evtRange = fnRange + evtConfig.length
	var cbRange = evtRange + delayCbProps.length
	var propRange = cbRange + delayProps.length
	var textRange = propRange + delayTextProps.length
	
	var CreateElement = function (name, attrs, root, data) {
		attrs = attrs || fakeOpts
		var el = document.createElement(name)
		root = root || el
		var attributes = Object.keys(attrs)
		var delaySetups
		var delayEvts
		var delayCb
		var delayProps
		var delayRoot
		var injectOpts
		if (attrs.hasOwnProperty('if') && !evalIf(attrs.if)) return null
		for (var i = 0, length = attributes.length; i < length; i++) {
			var key = attributes[i]
			var val = attrs[key]
			var keyIdx = allChecks.indexOf(key)
			if (keyIdx == -1)
				el[key] = val
			else {
				if (keyIdx < dimRange)
					el.style[key] = isNaN(val) ? val : (val + 'px')
				else if (keyIdx < disRange)
					el.style[key] = val
				else if (keyIdx < shareRange)
					assign((injectOpts = injectOpts || {}), val)
				else if (keyIdx < fnRange)
					(delaySetups = delaySetups || []).push({ key: key, val: val })
				else if (keyIdx < evtRange)
					(delayEvts = delayEvts || []).push({ key: key, val: val })
				else if (keyIdx < cbRange)
					(delayCb = delayCb || {})[key] = val
				else if (keyIdx < propRange)
					(delayProps = delayProps || {})[key] = val
				else if (keyIdx < textRange)
					el.appendChild(document.createTextNode(val))
				else
					delayRoot = val
			}
		}
		
		if (delayProps)
			setDelayProps(el, delayProps)
		if (delaySetups)
			setDelaySetups(el, delaySetups, root, injectOpts)
		if (delayEvts)
			setDelayEvts(el, delayEvts, root)
		if (delayCb && typeof delayCb.created === 'function')
			delayCb.created.call(el)
		if (delayRoot && isDom(delayRoot) && el === root) {
			delayRoot.appendChild(el)
			if (delayCb && typeof delayCb.appended === 'function')
				delayCb.appended.call(el, delayRoot)
		}
		return el
	}
	
	var publicCreateElement = function (name, opts) {
		return CreateElement(name, opts)
	}
	return publicCreateElement
});
