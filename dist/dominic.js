(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Dominic = factory();
    }
})(this, function() {
    var win = this || {};
    var doc = win.document;
    var Node = win.Node;
    var fakeArray = [];
    var fakeOpts = {};
    var fakeObj = fakeOpts;
    var is = function(obj, type) {
        return typeof obj === type;
    };
    var are = function(objs, type) {
        if (!Array.isArray(objs)) return false;
        var count = 0, length = objs.length;
        for (var i = 0; i < length; i++) count += typeof objs[i] === type ? 1 : 0;
        return count === length;
    };
    var isDom = function(obj) {
        return obj instanceof Node;
    };
    var isObj = function(obj) {
        var objType = typeof obj;
        return obj && objType === 'object' || objType === 'function';
    };
    var isStrOrNum = function(val) {
        var valType = typeof val;
        return valType === 'string' || valType === 'number';
    };
    var isFn = function(val) {
        return typeof val === 'function';
    };
    var c2d = function(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };
    var cap = function(str) {
        return str[0].toUpperCase() + str.slice(1);
    };
    var assign = function(dest) {
        dest = dest || {};
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            var keys = Object.keys(src);
            for (var j = 0; j < keys.length; j++) {
                dest[keys[j]] = src[keys[j]];
            }
        }
        return dest;
    };
    var assign2 = function(dest) {
        dest = dest || {};
        if (arguments.length < 2) return dest;
        var propsToCopyCfg = arguments[arguments.length - 1];
        if (typeof propsToCopyCfg !== 'string') return dest;
        var propsToCopy = propsToCopyCfg.split(',');
        if (!propsToCopy.length) return dest;
        for (var i = 1; i < arguments.length - 1; i++) {
            var src = arguments[i];
            var keys = Object.keys(arguments[i]);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                if (propsToCopy.indexOf(key) === -1) continue;
                var val = src[key];
                dest[key] = val;
            }
        }
        return dest;
    };
    var assign3 = function(dest) {
        dest = dest || {};
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            var keys = Object.keys(arguments[i]);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                if (Array.isArray(dest)) {
                    for (k = 0; k < dest.length; k++) if (!dest[k].hasOwnProperty(key)) dest[k][key] = src[key];
                } else {
                    if (!dest.hasOwnProperty(key)) dest[key] = src[key];
                }
            }
        }
        return dest;
    };
    var toSelector = function(dom) {
        var id = dom.id ? '#' + dom.id : '';
        var clsStr = dom.classList.toString();
        var classes = clsStr ? clsStr.split(' ') : fakeArray;
        var selector = dom.localName + id + (classes.length ? '.' + classes.join('.') : '');
        return selector;
    };
    var walkUpAndFindMatch = function(dest, current, selector) {
        while (current && current !== dest) {
            if (current.matches(selector)) return current;
            current = current.parentNode;
        }
        return null;
    };
    var HandleEvent = function(type, opts, thisArg) {
        opts = opts || {};
        var el = opts.el || doc.documentElement;
        var callback = opts.callback;
        var capture = opts.capture || false;
        var delegate = opts.delegate;
        var current = null;
        var handler = function(event) {
            var el = event.currentTarget;
            if (typeof delegate === 'string') {
                if (el === event.target) return;
                var match = walkUpAndFindMatch(el, event.target, delegate);
                if (!match) return;
                if (typeof callback === 'function') {
                    callback.call(thisArg, event, match, delegate);
                }
            } else {
                if (typeof callback === 'function') {
                    callback.call(thisArg, event);
                }
            }
        };
        handler.destroy = function() {
            this.el = null;
            return el.removeEventListener(type, handler, capture);
        };
        handler.el = el;
        handler.type = type;
        handler.capture = capture;
        el.addEventListener(type, handler, capture);
        return handler;
    };
    var defProps = Object.defineProperties;
    var defProp = Object.defineProperty;
    var Evt = function() {
        var Evt = function() {
            Array.call(this);
        };
        Evt.prototype = Object.create(Array.prototype);
        defProps(Evt.prototype, {
            remove: {
                value: function(expression) {
                    if (typeof expression !== 'function') return false;
                    var matches = [];
                    var successCount = 0;
                    for (var i = 0; i < this.length; i++) if (expression.call(null, this[i])) matches.push(this[i]);
                    for (var j = 0; j < matches.length; j++) {
                        var evt = matches[j];
                        evt.destroy();
                        this.splice(this.indexOf(evt), 1);
                        successCount++;
                    }
                    return successCount == matches.length;
                }
            },
            removeEvent: {
                value: function(type, el, capture) {
                    var _this = this;
                    var result = [];
                    this.forEach(function(e) {
                        if ((type === '*' || e.type === type) && (el === '*' || e.el === el) && (!capture || e.capture === capture)) result.push(e);
                    });
                    result.forEach(function(e) {
                        e.destroy();
                        _this.splice(_this.indexOf(e), 1);
                    });
                    return result.length;
                }
            },
            removeAll: {
                value: function() {
                    for (var i = 0; i < this.length; i++) this[i].destroy();
                    this.length = 0;
                }
            }
        });
        return Evt;
    }();
    var Refs = function() {
        var Refs = function() {};
        Refs.prototype = Object.create(Object.prototype);
        defProps(Refs.prototype, {
            remove: {
                value: function(expression) {
                    if (typeof expression !== 'function') return false;
                    var refKeys = Object.keys(this);
                    var successCount = 0;
                    for (var i = 0; i < refKeys.length; i++) {
                        var key = refKeys[i];
                        if (expression.call(null, this[key], key)) {
                            successCount += delete this[key] ? 1 : 0;
                        }
                    }
                    return successCount == refKeys.length;
                }
            },
            removeRef: {
                value: function(refName) {
                    if (this.hasOwnProperty(refName)) return delete this[refName];
                    return false;
                }
            },
            removeAll: {
                value: function() {
                    var allrefs = Object.keys(this);
                    var count = 0;
                    for (;count < allrefs.length; count++) delete this[allrefs[count]];
                    return count === allrefs.length;
                }
            }
        });
        return Refs;
    }();
    var setRefs = function(root, el, realRoot) {
        var ref = el.ref;
        if (!isStrOrNum(ref)) return;
        var refScope = el.refScope;
        var scope = refScope === 'parent' ? root : realRoot;
        scope.refs = scope.refs || new Refs();
        scope.refs[ref] = el;
    };
    var Obs = function() {
        var Obs = function(realRoot) {
            if (typeof realRoot === 'undefined') throw new Error('No root provided');
            defProps(this, {
                __owner: {
                    value: realRoot
                },
                __data: {
                    value: {}
                }
            });
        };
        Obs.prototype = Object.create(Object.prototype);
        function areDifferent(oldData, newData) {
            var diff = false;
            var oldKeys = Object.keys(oldData);
            var newKeys = Object.keys(newData);
            if (oldKeys.join('') !== newKeys.join('')) return true;
        }
        defProps(Obs.prototype, {
            add: {
                value: function(root, opts, injectOpts) {
                    var obsProp = opts.update ? opts.update.observeProp : '';
                    if (!obsProp || obsProp === '__owner' || !isStrOrNum(obsProp)) return false;
                    var defaultOpts = assign({}, injectOpts || {});
                    var cacheOpts = assign2({}, opts, {
                        obsProp: obsProp
                    }, 'tplFn,for,root,obsProp,update');
                    defProp(this, obsProp, {
                        get: function() {
                            return this.__data[obsProp];
                        },
                        set: function(root, cacheOpts, defaultOpts, val) {
                            var obsProp = cacheOpts.obsProp;
                            this.__data[obsProp] = val;
                            cacheOpts.for = val;
                            while (root.firstChild) {
                                var removedChild = root.removeChild(root.firstChild);
                                if (this.__owner.evts) this.__owner.evts.remove(function(evt) {
                                    return removedChild === evt.el || removedChild.contains(evt.el);
                                });
                                if (this.__owner.refs) this.__owner.refs.remove(function(el, ref) {
                                    return removedChild === el || removedChild.contains(el);
                                });
                            }
                            var newCFromTpl = tpl2dom(root, cacheOpts, this.__owner);
                            setChildren(root, newCFromTpl, this.__owner, defaultOpts);
                        }.bind(this, root, cacheOpts, defaultOpts)
                    });
                }
            },
            push: {
                value: function(key, data) {
                    key = '' + key;
                    var existingVal = this[key];
                    if (!existingVal || !Array.isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
                    if (Array.isArray(data)) for (var i = 0; i < data.length; i++) existingVal.push(data[i]); else existingVal.push(data);
                    this[key] = existingVal;
                    return existingVal.length;
                }
            }
        });
        return Obs;
    }();
    var tpl2dom = function(root, opts, realRoot) {
        var val = opts.for;
        if (!val) return null;
        var valRoot = opts.root || '';
        var data = valRoot ? val[valRoot] : val;
        var fn = opts['tplFn'];
        var children;
        if (data && typeof fn === 'function') {
            var scope = opts.scope;
            var scopeType = typeof scope;
            var thisArg = scope === 'root' ? realRoot : scope === 'parent' ? root : scope;
            if (Array.isArray(data)) children = data.map(fn, thisArg); else children = fn.call(thisArg, data);
        }
        return children;
    };
    var setObserver = function(root, opts, realRoot, injectOpts) {
        realRoot.observe = realRoot.observe || new Obs(realRoot);
        realRoot.observe.add(root, opts, injectOpts);
        return realRoot.observe;
    };
    var inject = function(opts, injectOpts) {};
    var setChildren = function(root, obj, realRoot, injectOpts) {
        'use strict';
        if (!isObj(obj)) return;
        if (isDom(obj)) {
            root.appendChild(obj);
            setRefs(root, obj, realRoot);
        } else {
            if (typeof obj === 'function') {
                var c = obj();
                if (injectOpts) assign3(c, injectOpts);
                setChildren(root, c, realRoot, injectOpts);
            } else if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var opts = obj[i];
                    if (injectOpts) assign3(opts, injectOpts);
                    setChildren(root, opts, realRoot, injectOpts);
                }
            } else {
                if (obj.hasOwnProperty('for')) {
                    if (isObj(obj.update)) {
                        var obsProp = obj.update.observeProp;
                        if (isStrOrNum(obsProp)) {
                            var observer = setObserver(root, obj, realRoot, injectOpts);
                            observer[obsProp] = obj.for;
                        }
                    } else {
                        var cFromTpl = tpl2dom(root, obj, realRoot);
                        setChildren(root, cFromTpl, realRoot, injectOpts);
                    }
                } else if (obj.hasOwnProperty('fn')) {
                    var fn = obj.fn;
                    if (typeof fn === 'function') {
                        var scope = obj.scope;
                        var thisArg = scope === 'root' ? realRoot : scope === 'parent' ? root : scope;
                        var children = fn.call(thisArg);
                        setChildren(root, children, realRoot, injectOpts);
                    }
                } else {
                    var tag = obj.tag || 'div';
                    if (tag && typeof tag === 'string') {
                        delete obj.tag;
                        if (injectOpts) assign3(obj, injectOpts);
                        var el = CreateElement(tag, obj, realRoot);
                        setChildren(root, el, realRoot, injectOpts);
                    }
                }
            }
        }
    };
    var attachEvent = function(root, evt, realRoot) {
        var type = evt.type;
        if (!type) throw new Error('No event type specified');
        var handler = evt.handler;
        var handlerRegType = typeof handler;
        var realHandler;
        realRoot = realRoot || root;
        var scope = evt.scope === 'root' ? realRoot : evt.scope ? evt.scope : root;
        if (handlerRegType === 'function') realHandler = handler; else if (handlerRegType === 'string') realHandler = scope[handler];
        if (typeof realHandler !== 'function') throw new Error('Cannot find handler: "' + handler + '" on element: [' + toSelector(scope) + '].');
        var capture = evt.capture;
        var delegate = evt.delegate;
        var handleType = HandleEvent(type, {
            el: root,
            callback: realHandler,
            capture: capture,
            delegate: delegate
        }, scope);
        realRoot.evts = realRoot.evts || new Evt();
        realRoot.evts.push(handleType);
    };
    var setEvents = function(root, eventArgs, realRoot) {
        if (Array.isArray(eventArgs)) for (var i = 0; i < eventArgs.length; i++) attachEvent(root, eventArgs[i], realRoot); else attachEvent(root, eventArgs, realRoot);
    };
    var setAttrs = function(el, attrs) {
        var attributes = Object.keys(attrs);
        for (var i = 0; i < attributes.length; i++) {
            var key = attributes[i];
            var val = attrs[key];
            el.setAttribute(c2d(key), val);
        }
    };
    var pxStyle = [ 'width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight' ];
    ![ '', 'Top', 'Right', 'Bottom', 'Left' ].forEach(function(pos) {
        pxStyle.push('padding' + pos);
        pxStyle.push('margin' + pos);
    });
    var setStyle = function(el, opts) {
        var styles = Object.keys(opts);
        for (var i = 0; i < styles.length; i++) {
            var styleKey = styles[i];
            var styleVal = opts[styleKey];
            if (pxStyle.indexOf(styleKey) !== -1) el.style[styleKey] = isNaN(styleVal) ? styleVal : styleVal + 'px'; else el.style[styleKey] = styleVal;
        }
    };
    var setters = {
        setevents: setEvents,
        setattrs: setAttrs,
        setstyle: setStyle,
        setchildren: setChildren,
        setitems: setChildren
    };
    var setDelaySetups = function(el, setups, root, injectOpts) {
        for (var i = 0, length = setups.length; i < length; i++) {
            var setup = setups[i];
            setters['set' + setup.key](el, setup.val, root, injectOpts);
        }
    };
    var setDelayEvts = function(el, events, root) {
        for (var i = 0, length = events.length; i < length; i++) {
            var evt = events[i];
            var evtArgs = assign({}, {
                type: evt.key
            }, evt.val);
            attachEvent(el, evtArgs, root);
        }
    };
    var evalIf = function(condition) {
        var bool;
        if (typeof condition === 'function') bool = condition(); else bool = condition;
        return Boolean(bool);
    };
    var dimensionStyle = [ 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'padding', 'margin' ];
    var displayStyle = [ 'color', 'backgroundColor', 'background', 'display', 'position', 'border', 'transform', 'opacity', 'fontSize' ];
    var shareStyle = [ 'defaults' ];
    var fnConfig = [ 'style', 'children', 'items', 'attrs', 'events' ];
    var mouseEvts = [ 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove' ];
    var dragEvts = [ 'dragstart', 'dragend', 'drag', 'dragover', 'dragenter', 'dragout', 'drop' ];
    var focusEvts = [ 'blur', 'focus' ];
    var keyEvts = [ 'keydown', 'keypress', 'keyup' ];
    var formEvts = [ 'change', 'input', 'submit' ];
    var touchEvts = [ 'touchstart', 'touchmove', 'touchend' ];
    var scrEvts = [ 'wheel', 'scroll' ];
    var evtConfig = mouseEvts.concat(dragEvts, focusEvts, keyEvts, formEvts, touchEvts, scrEvts);
    var delayCbProps = [ 'created', 'appended' ];
    var delayProps = [ 'className', 'cls' ];
    var delayExtraClasses = [ 'xtraCls', 'xCls' ];
    var delayTextProps = [ 'text', 'textContent' ];
    var delayAppendTarget = [ 'parent' ];
    var allChecks = dimensionStyle.concat(displayStyle, shareStyle, fnConfig, evtConfig, delayCbProps, delayProps, delayExtraClasses, delayTextProps, delayAppendTarget);
    var dimRange = dimensionStyle.length;
    var disRange = dimRange + displayStyle.length;
    var shareRange = disRange + shareStyle.length;
    var fnRange = shareRange + fnConfig.length;
    var evtRange = fnRange + evtConfig.length;
    var cbRange = evtRange + delayCbProps.length;
    var propRange = cbRange + delayProps.length;
    var xtraRange = propRange + delayExtraClasses.length;
    var textRange = xtraRange + delayTextProps.length;
    var CreateElement = function(name, attrs, root, data) {
        attrs = attrs || fakeOpts;
        if (attrs.hasOwnProperty('if') && !evalIf(attrs.if)) return null;
        var el = doc.createElement(name);
        root = root || el;
        var attributes = Object.keys(attrs);
        var delaySetups;
        var delayEvts;
        var delayCb;
        var delayClasses;
        var delayExtraClasses;
        var delayRoot;
        var injectOpts;
        var delayNoDisplay;
        if (attrs.hasOwnProperty('hide') && evalIf(attrs.hide)) {
            delete attrs.hide;
            delayNoDisplay = true;
        }
        for (var i = 0, length = attributes.length; i < length; i++) {
            var key = attributes[i];
            var val = attrs[key];
            var keyIdx = allChecks.indexOf(key);
            if (keyIdx == -1) el[key] = val; else {
                if (keyIdx < dimRange) {
                    el.style[key] = isNaN(val) ? val : val + 'px';
                } else if (keyIdx < disRange) {
                    el.style[key] = val;
                } else if (keyIdx < shareRange) {
                    assign(injectOpts = injectOpts || {}, val);
                } else if (keyIdx < fnRange) {
                    (delaySetups = delaySetups || []).push({
                        key: key,
                        val: val
                    });
                } else if (keyIdx < evtRange) {
                    (delayEvts = delayEvts || []).push({
                        key: key,
                        val: val
                    });
                } else if (keyIdx < cbRange) {
                    (delayCb = delayCb || {})[key] = val;
                } else if (keyIdx < propRange) {
                    delayClasses = (delayClasses || '') + ' ' + val;
                } else if (keyIdx < xtraRange) {
                    delayClasses = (delayClasses || '') + ' ' + val;
                } else if (keyIdx < textRange) {
                    el.appendChild(doc.createTextNode(val));
                } else delayRoot = val;
            }
        }
        if (delaySetups) setDelaySetups(el, delaySetups, root, injectOpts);
        if (delayClasses) el.className += (' ' + delayClasses).trim();
        if (delayEvts) setDelayEvts(el, delayEvts, root);
        if (delayCb && typeof delayCb.created === 'function') delayCb.created.call(el);
        if (delayRoot && isDom(delayRoot) && el === root) {
            delayRoot.appendChild(el);
            if (delayCb && typeof delayCb.appended === 'function') delayCb.appended.call(el, delayRoot);
        }
        if (delayNoDisplay) el.style.display = 'none';
        return el;
    };
    var Dominic = {
        createElement: function(name, opts) {
            return CreateElement(name, opts);
        },
        setWindow: function(obj) {
            win = obj;
            doc = win.document;
            Node = win.Node;
        }
    };
    return Dominic;
});