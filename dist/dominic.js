<<<<<<< HEAD
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('Dominic', factory) :
  (global.Dominic = factory());
}(this, function () { 'use strict';

  var defProps = Object.defineProperties;
  var defProp = Object.defineProperty;
  var getKeys = Object.keys;
  var proto = Object.prototype;
  var hasOwn = proto.hasOwnProperty;
  var has = function has(dict, key) {
      return hasOwn.call(dict, key);
  };
var   toString$1 = Object.prototype.toString;
  var isPlain = function isPlain(obj) {
      return toString$1.call(obj) === '[object Object]';
  };
  var create = Object.create;
  var createDict = function createDict(initValue) {
      var dict = create(null);
      for (var i in initValue) {
          if (has(initValue, i)) dict[i] = initValue[i];
      }return dict;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var isArray = Array.isArray;

  function isStrOrNum(val) {
      var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
      return valType === 'string' || valType === 'number';
  }
  function isFn(obj) {
      return typeof obj === 'function';
  }
  function are(objs, type) {
      if (!isArray(objs)) return false;
      var count = 0,
          length = objs.length;
      for (var i = 0; i < length; i++) {
          if (_typeof(objs[i]) !== type) return false;
      }return true;
  }
  function isDom(node) {
      return node instanceof Node;
  }

  /**
   * @param arr {[any]}
   */
  function extend(arr) {
      arr = arr || [];
      var argLen = arguments.length;
      if (argLen < 2) return arr;
      var currIdx = arr.length;
      for (var i = 1; i < argLen; i++) {
          var src = arguments[i];
          for (var j = 0; j < src.length; j++) {
              arr[currIdx++] = src[j];
          }
      }
      return arr;
  }
  /**
   * use to 
   * @param object {Object}
   * @param fn {Function}
   * @param thisArg {any}
   */
  function each(object, fn, thisArg) {
      for (var prop in object) {
          if (has(object, prop)) fn.call(thisArg, object[prop], prop);
      }
  }
  /**
   * true if any member of list satisfied condition
   * @param list {any[]}
   * @param fn {Function}
   * @param thisArg {any}
   */
  function any(list, fn, thisArg) {
      if (!list || !list.length) return false;
      var len = list.length;
      for (var i = 0; i < len; i++) {
          if (fn.call(thisArg, list[i], i, list)) return true;
      }return false;
  }

  /**
   * @param nodeList {Element[]}
   */
  function last(nodeList) {
      return nodeList ? nodeList[nodeList.length - 1] : null;
  }

  /**
   * Minic version of Element.querySelector for prop name & value matching key & value params
   * @param root {Element}
   * @param key {string}
   * @param value {any}
   * @returns {Element}
   */
  function query(root, key, value) {
      var result = null,
          childNodes = root.childNodes,
          len = childNodes.length;
      for (var i = 0; i < len; i++) {
          var child = childNodes[i];
          if (hasOwnProperty.call(child, key) && (typeof value === 'undefined' || child[key] === value)) result = child;else result = query(child, key, value);
          if (result) return result;
      }
      return result;
  }
  /**
   * Query first direct child having prop name & value matching key & value params
   * @param root {Element}
   * @param key {string}
   * @param value {any}
   * @returns {Element}
   */
  function queryDirect(root, key, value) {
      var childNodes = root.childNodes,
          len = childNodes.length;
      for (var i = 0; i < len; i++) {
          var child = childNodes[i];
          if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) return child;
      }
      return null;
  }

  /**
   * Query the last child having prop name & value matching key & value params
   * @param root {Element} The element has children to query
   * @returns {Element}
   */
  function queryLastDirect(root, key, value) {
      var childNodes = root.childNodes,
          len = childNodes.length;
      for (var i = len - 1; i > -1; i++) {
          var child = childNodes[i];
          if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) return child;
      }
      return null;
  }
  /**
   * Query the first direct child having
   *  1. prop name & value matching key & value params
   *  2. relative index equals with idx param
   * @param root {Element}
   * @param idx {number}
   * @param key {string}
   * @param value {any}
   * @return {Element} 
   */
  function queryDirectByIndex(root, idx, key, value) {
      var childNodes = root.childNodes,
          len = childNodes.length,
          startIdx = -1;
      for (var i = 0; i < len; i++) {
          var child = childNodes[i];
          if (startIdx === -1) {
              if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) {
                  if (startIdx === -1) startIdx = i;
              }
          }
          if (startIdx !== -1 && i - startIdx === idx) return child;
      }
      return null;
  }
  /**
   * Query all direct children having prop name & value matching key value params
   * @param root {Element}
   * @param key {string}
   * @param value {any}
   * @returns {Element[]}
   */
  function queryAllDirect(root, key, value) {
      var result = [],
          childNodes = root.childNodes,
          length = childNodes.length,
          curr = 0;
      for (var i = 0; i < length; i++) {
          var child = childNodes[i];
          if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) result[curr++] = child;
      }
      return result;
  }
  /**
   * Query all children having prop name & value match key value params
   * @param root {Element}
   * @param key {string}
   * @param value {any}
   * @returns {Element[]}
   */
  function queryAll(root, key, value) {
      var result = [],
          childNodes = root.childNodes,
          length = childNodes.length;
      for (var i = 0; i < length; i++) {
          var child = childNodes[i];
          if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) result[result.length] = child;
          extend(result, queryAll(child, key, value));
      }
      return result;
  }
  /**
   * Query all children having prop name & value match any pair in dictionary param
   * @param root {Element}
   * @param dict {{key: string, value: any}}
   * @returns {Element[]}
   */
  function queryAllByMultipleKeys(root, dict) {
      if (!dict) return;
      var keys = Object.keys(dict),
          keyLen = keys.length,
          result = [],
          childNodes = root.childNodes,
          length = childNodes.length,
          resultIdx = 0;
      for (var i = 0; i < length; i++) {
          var child = childNodes[i];
          for (var j = 0; j < keyLen; j++) {
              var key = keys[j];
              if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) {
                  result[resultIdx++] = child;
                  break;
              }
          }
          extend(result, queryAllByMultipleKeys(child, dict));
      }
  }

  var startUpperCaseRegex = /([A-Z])/g;
  var fakeArray = [];

  function toBool(val) {
      return !!(typeof val === 'function' ? val() : val);
  }
  function c2d(str) {
      return str.replace(startUpperCaseRegex, '-$1').toLowerCase();
  }
  function toSelector(dom) {
      var id = dom.id ? '#' + dom.id : '',
          clsStr = dom.classList.toString(),
          classes = clsStr ? clsStr.split(' ') : fakeArray,
          selector = dom.localName + id + (classes.length ? '.' + classes.join('.') : '');
      return selector;
  }

  var elP = Element.prototype;
  var matchesSelector = elP.matches || elP.matchesSelector || elP.msMatchesSelector || elP.webkitMatchesSelector || elP.mozMatchesSelector || elP.oMatchesSelector;

  function match(node, selector) {
      return matchesSelector.call(node, selector);
  }

  function walkupAndFindMatch(dest, current, selector) {
      while (current && current !== dest) {
          if (match(current, selector)) return current;
          current = current.parentNode;
      }
      return null;
  }

  var keyEvts = ['keydown', 'keypress', 'keyup', 'input'];
  var focusEvts = ['blur', 'focus'];
  function EventHolder() {}
  EventHolder.__proto__ = Array.prototype;
  EventHolder.prototype = Object.create(Array.prototype);
  defProps(EventHolder.prototype, {
      removeAll: {
          value: function removeAll() {
              for (var i = 0; i < this.length; i++) {
                  this[i].destroy();
              }this.length = 0;
          }
      }
  });

  function makeHandler(_ref, thisArg) {
      var type = _ref.type;
      var el = _ref.el;
      var callback = _ref.callback;
      var capture = _ref.capture;
      var delegate = _ref.delegate;

      function handler(event) {
          if (typeof delegate === 'string') {
              if (el === event.target) return;
              var match = walkupAndFindMatch(el, event.target, delegate);
              if (!match) return;
              if (typeof callback === 'function') callback.call(thisArg, event, match, delegate);
          } else {
              if (typeof callback === 'function') callback.call(thisArg, event);
          }
      }
      handler.destroy = function () {
          return el.removeEventListener(type, handler, capture);
      };
      el.addEventListener(type, handler, capture);
      return handler;
  }

  function makeKeyHandler(_ref2, thisArg) {
      var type = _ref2.type;
      var el = _ref2.el;
      var callback = _ref2.callback;
      var capture = _ref2.capture;
      var delegate = _ref2.delegate;
      var keys = _ref2.keys;

      function handler(event) {
          if (typeof delegate === 'string') {
              if (el === event.target) return;
              var match = walkupAndFindMatch(el, event.target, delegate);
              if (!match) return;
              if (keys && keys.indexOf(event.keyCode) === -1) return;
              if (typeof callback === 'function') callback.call(thisArg, event, match, delegate);
          } else {
              if (keys && keys.indexOf(event.keyCode) === -1) return;
              if (typeof callback === 'function') callback.call(thisArg, event);
          }
      }
      handler.destroy = function () {
          return el.removeEventListener(type, handler, capture);
      };
      el.addEventListener(type, handler, capture);
      return handler;
  }

  /**
   * @param el {Element}
   * @param evt {{ type:string, scope:(string|Object), handler:Function, delegate:string, key}}
   * @param root {Element}
   */
  function attachEvent(el, evtArgs, root) {
      var type = evtArgs.type;
      if (!type) throw new Error('No event type specified');
      var handler = evtArgs.handler,
          handlerRegType = typeof handler === 'undefined' ? 'undefined' : _typeof(handler),
          realHandler;
      root = root || el;
      var scope = evtArgs.scope === 'root' ? root : has(evtArgs, 'scope') ? evtArgs.scope : el;

      if (handlerRegType === 'function') realHandler = handler;else if (handlerRegType === 'string') realHandler = scope[handler];

      if (typeof realHandler !== 'function') {
          throw new Error('Cannot find handler: "' + handler + '" on element: [' + toSelector(scope) + '].');
      }

      var capture = !!evtArgs.capture,
          delegate = evtArgs.delegate,
          isKeyEvt = keyEvts.indexOf(type) !== -1,
          isFocusEvt = focusEvts.indexOf(type) !== -1,
          evtHandler;
      if (isKeyEvt) {
          var keys = null;
          if (has(evtArgs, 'key')) {
              if (typeof evtArgs.key === 'number') keys = [evtArgs.key];else if (are(evtArgs.key, 'number')) keys = evtArgs.key;
          }
          evtHandler = makeKeyHandler({ type: type, el: el, callback: realHandler, capture: capture, delegate: delegate, keys: keys }, scope);
      } else {
          if (isFocusEvt && delegate) {
              capture = true;
          }
          evtHandler = makeHandler({ type: type, el: el, callback: realHandler, capture: capture, delegate: delegate }, scope);
      }

      if (!has(el, 'evts')) el.evts = new EventHolder();
      el.evts.push(evtHandler);
      el.hse = true;
  }

  var registered = createDict();
  var Component = createDict();
  defProps(Component, {
      register: {
          value: function value(name, create) {
              if (has(registered, name)) throw Error('Name already registered');
              // if (!isPlain(definitions))
              //     throw Error('Not valid definitions')
              if (!isFn(create)) throw Error('Not valid definitions');
              defProp(registered, name, {
                  value: createDict({
                      create: create
                  })
              });
              return this;
          }
      },
      get: {
          value: function value(name) {
              if (!registered[name]) throw Error('No component registered');
              return registered[name];
          }
      }
  });

  /**
   * Assign value to an object, does overwrite
   * @param dest {Object}
   */
  function assign(dest) {
      dest = dest || {};
      for (var i = 1; i < arguments.length; i++) {
          var src = arguments[i];
          if (!src) continue;
          for (var key in src) {
              if (has(src, key)) dest[key] = src[key];
          }
      }
      return dest;
  }
  /**
   * Extend an object within given properties
   * @param dest {Object}
   */
  function assignOnly(dest) {
      dest = dest || {};
      var argLen = arguments.length;
      if (argLen < 3) return dest;
      var propsToCopyCfg = arguments[argLen - 1];
      if (typeof propsToCopyCfg !== 'string') return dest;
      var propsToCopy = propsToCopyCfg.split(',');
      if (!propsToCopy.length) return dest;
      for (var i = 1; i < argLen - 1; i++) {
          var src = arguments[i];
          if (!src) continue;
          for (var key in src) {
              if (has(src, key)) {
                  if (propsToCopy.indexOf(key) === -1) continue;
                  var val = src[key];
                  dest[key] = val;
              }
          }
      }
      return dest;
  }
  /**
   * Extend an object, does not overwrite
   * @param dest {Object}
   */
  function assignExtend(dest) {
      dest = dest || {};
      for (var i = 1; i < arguments.length; i++) {
          var src = arguments[i];
          if (!src) continue;
          for (var key in src) {
              if (has(src, key)) {
                  var val = src[key];
                  if (Array.isArray(dest)) {
                      for (var j = 0; j < dest.length; j++) {
                          var destMem = dest[j];
                          if (!has(destMem, key)) destMem[key] = val;
                      }
                  } else {
                      if (!has(dest, key)) dest[key] = val;
                  }
              }
          }
      }
      return dest;
  }

  function removeEvt(el) {
      el.evts.removeAll();
      delete el.evts;
  }
  function removeAllEvts(el) {
      if (has(el, 'evts')) removeEvt(el);
      var hasEvtEls = queryAll(el, 'hse', true);
      hasEvtEls.forEach(removeEvt);
  }
  function removeRef(el) {
      var refHolder = has(el, 'refScope') && el.refScope === 'parent' ? el.parentNode : el.root;
      refHolder.refs.removeRef(el.ref);
  }
  function removeAllRefs(el, root) {
      if (has(el, 'refs')) {
          el.refs.removeAll();
          delete el.refs;
      }
      if (has(el, 'ref')) removeRef(el, root);
      var hasRefEls = queryAll(el, 'hsr', true);
      hasRefEls.forEach(removeRef);
  }
  function removeEls(els, root) {
      els.forEach(function (el, elIdx) {
          if (el.nodeType === Node.ELEMENT_NODE) {
              removeAllRefs(el);
              removeAllEvts(el);
          }
          el.parentNode.removeChild(el);
      });
  }

  function handleGetter(observeProp) {
      return this.__data[observeProp];
  }

  function handleSetter(obsProp, val) {
      var allTpls = this.__tpl[obsProp],
          root = this.__owner;
      this.__data[obsProp] = val;
      for (var i = 0, len = allTpls.length; i < len; i++) {
          var tplOpts = allTpls[i],
              parent = tplOpts.parent,
              groupKey = tplOpts.groupKey,
              stop,
              tobeRemoved = queryAllDirect(parent, 'groupKey', groupKey),
              root = this.__owner;
          tplOpts.for = val;
          if (tobeRemoved.length) {
              stop = last(tobeRemoved).nextSibling;
          }
          removeEls(tobeRemoved);
          for2children(parent, tplOpts, groupKey, root, stop);
      }
  }

  var Observer = function Observer(root) {
      if (!root) throw new Error('No root provided');
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
      });
  };

  defProps(Observer.prototype, {
      add: {
          value: function value(parent, tplOpts, groupKey, root) {
              var obsProp = tplOpts.observeProp,
                  tplOpts = assignOnly(createDict({ parent: parent, groupKey: groupKey }), tplOpts, 'tplFn,scope,for,root,observeProp,alwaysIterate'),
                  val = tplOpts.for,
                  alreadyRegistered = has(this, obsProp);
              if (alreadyRegistered) {
                  this.__tpl[obsProp].push(tplOpts);
              } else {
                  // set initial
                  this.__data[obsProp] = val;
                  this.__tpl[obsProp] = [tplOpts];
                  defProp(this, obsProp, {
                      get: handleGetter.bind(this, obsProp),
                      set: handleSetter.bind(this, obsProp)
                  });
              }
          }
      },
      insert: {
          value: function insert(key, index, data) {
              key = '' + key;
              var existingVal = this[key];
              if (!existingVal || !isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
              if (isNaN(index)) {
                  if (arguments.length > 1) this.push.apply(this, arguments);
                  return;
              }
              var currLen = existingVal.length,
                  newData,
                  currIdx = index;
              if (index > currLen || index < 0) return;
              if (isArray(data)) {
                  newData = data;
                  for (var i = 0; i < data.length; i++) {
                      existingVal.splice(currIdx++, 0, data[i]);
                  }
              } else {
                  newData = [data];
                  existingVal.splice(currIdx, 0, data);
              }
              var allTpls = this.__tpl[key];
              for (var i = 0, len = allTpls.length; i < len; i++) {
                  var tplOpts = allTpls[i],
                      parent = tplOpts.parent,
                      groupKey = tplOpts.groupKey,
                      stop = queryDirectByIndex(parent, index, 'groupKey', groupKey),
                      root = this.__owner;
                  if (stop) {
                      tplOpts.for = newData;
                      for2children(parent, tplOpts, groupKey, root, stop);
                  }
              }
          }
      },
      remove: {
          value: function remove(key, indexes) {
              key = '' + key;
              var existingVal = this[key];
              if (!existingVal || !isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
              var currLen = existingVal.length;
              if (!isArray(indexes)) indexes = [indexes];
              if (any(indexes, isNaN)) return;
              var allTpls = this.__tpl[key],
                  tobeRemoved = [];
              // make sure remove from lowest index to highest index
              indexes.sort();
              for (var i = 0, len = allTpls.length; i < len; i++) {
                  var tplOpts = allTpls[i],
                      parent = tplOpts.parent,
                      groupKey = tplOpts.groupKey,
                      noOfRemovedChild = 0;
                  for (var j = 0, indexLen = indexes.length; j < indexLen; j++) {
                      var index = indexes[i];
                      if (index > currLen || indexes < 0) continue;
                      var childToRemove = queryDirectByIndex(parent, index, 'groupKey', groupKey);
                      if (childToRemove) {
                          parent.removeChild(childToRemove);
                          existingVal.splice(index - noOfRemovedChild++, 1);
                      }
                  }
              }
          }
      },
      push: {
          value: function value(key, data) {
              key = '' + key;
              var existingVal = this[key];
              if (!existingVal || !isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
              var currIdx = existingVal.length,
                  newData;
              if (isArray(data)) {
                  newData = data;
                  for (var i = 0; i < data.length; i++) {
                      existingVal[currIdx++] = data[i];
                  }
              } else {
                  newData = [data];
                  existingVal[currIdx++] = data;
              }
              var allTpls = this.__tpl[key];
              for (var i = 0, len = allTpls.length; i < len; i++) {
                  var tplOpts = allTpls[i],
                      parent = tplOpts.parent,
                      groupKey = tplOpts.groupKey,
                      lastTplEl = last(queryAllDirect(parent, 'groupKey', groupKey)),
                      stop,
                      root = this.__owner;
                  if (lastTplEl) stop = lastTplEl.nextSibling;
                  tplOpts.for = newData;
                  for2children(parent, tplOpts, groupKey, root, stop);
              }
              return existingVal.length;
          }
      },
      pop: {
          value: function value(key) {
              key = '' + key;
              var existingVal = this[key];
              if (!existingVal || !isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
              var allTpls = this.__tpl[key],
                  tobeRemoved = [],
                  rLen = 0;
              for (var i = 0, len = allTpls.length; i < len; i++) {
                  var tplOpts = allTpls[i],
                      parent = tplOpts.parent,
                      groupKey = tplOpts.groupKey,
                      lastTplEl = queryLastDirect(parent, 'groupKey', groupKey);
                  if (lastTplEl) {
                      tobeRemoved[rLen++] = lastTplEl;
                  }
              }
              removeEls(tobeRemoved);
              existingVal.pop();
          }
      },
      shift: {
          value: function value(key) {
              key = '' + key;
              var existingVal = this[key];
              if (!existingVal || !isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
              var allTpls = this.__tpl[key],
                  tobeRemoved = [],
                  rLen = 0;
              for (var i = 0, len = allTpls.length; i < len; i++) {
                  var tplOpts = allTpls[i],
                      parent = tplOpts.parent,
                      groupKey = tplOpts.groupKey,
                      firstTplEl = queryDirect(parent, 'groupKey', groupKey);
                  if (firstTplEl) {
                      tobeRemoved[rLen++] = firstTplEl;
                  }
              }
              removeEls(tobeRemoved);
              existingVal.shift();
          }
      },
      unshift: {
          value: function value(key, data) {
              key = '' + key;
              var existingVal = this[key];
              if (!existingVal || !isArray(existingVal)) throw new Error('Value for property [' + key + '] is not an array.');
              var currIdx = existingVal.length,
                  newData;
              if (isArray(data)) {
                  newData = data;
                  for (var i = 0; i < data.length; i++) {
                      existingVal.unshift(data[i]);
                  }
              } else {
                  newData = [data];
                  existingVal.unshift(data);
              }
              var allTpls = this.__tpl[key];
              for (var i = 0, len = allTpls.length; i < len; i++) {
                  var tplOpts = allTpls[i],
                      parent = tplOpts.parent,
                      groupKey = tplOpts.groupKey,
                      lastTplEl = last(queryAllDirect(parent, 'groupKey', groupKey)),
                      stop = queryDirect(parent, 'groupKey', groupKey),
                      root = this.__owner;
                  tplOpts.for = newData;
                  for2children(parent, tplOpts, groupKey, root, stop);
              }
              return existingVal.length;
          }
      }
  });

  function setObserver(el, tplOpts, groupKey, root) {
      if (!has(root, 'observe')) root.observe = new Observer(root);
      root.observe.add(el, tplOpts, groupKey, root);
      return root.observe;
  }

  function ReferenceHolder() {}

  defProps(ReferenceHolder.prototype, {
      remove: {
          value: function value(expression) {
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
          value: function value(_value) {
              if (isStrOrNum(_value)) {
                  _value = '' + _value;
                  if (has(this, _value)) return delete this[_value];
              } else if (isFn(_value)) {
                  var refKeys = Object.keys(this),
                      successCount = 0;
                  for (var i = 0; i < refKeys.length; i++) {
                      var key = refKeys[i];
                      if (expression.call(null, this[key], key)) {
                          successCount += delete this[key] ? 1 : 0;
                      }
                  }
                  return successCount == refKeys.length;
              }
              return false;
          }
      },
      removeAll: {
          value: function value() {
              var allrefs = Object.keys(this);
              for (var count = 0; count < allrefs.length; count++) {
                  delete this[allrefs[count]];
              }return count === allrefs.length;
          }
      }
  });

  function setReference(parent, el, root) {
      var ref = el.ref;
      if (!isStrOrNum(ref)) return;
      var refScope = el.refScope,
          scope = refScope === 'parent' ? parent : root;
      if (!has(scope, 'refs')) scope.refs = new ReferenceHolder();
      scope.refs[ref] = el;
      el.hsr = true;
  }

  function insertBefore(parent, node, stop) {
      if (stop) parent.insertBefore(node, stop);else parent.appendChild(node);
  }

  var pxChecks = ['width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight'];
  !['', 'Top', 'Right', 'Bottom', 'Left'].forEach(function (pos) {
      pxChecks.push('padding' + pos);
      pxChecks.push('margin' + pos);
  });

  var dimensionStyle = pxChecks;
  var displayStyle = ['color', 'backgroundColor', 'background', 'display', 'position', 'border', 'transform', 'opacity', 'fontSize'];
  var shareStyle = ['defaults'];
  var specialChecks = ['style', 'attrs'];
  var childrenChecks = ['children', 'items'];
  var evtArrChecks = ['events'];
  var directStyleChecks = dimensionStyle.concat(displayStyle);
  var mouseEvts = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove'];
  var dragEvts = ['dragstart', 'dragend', 'drag', 'dragover', 'dragenter', 'dragleave', 'drop'];
var   focusEvts$1 = ['blur', 'focus'];
var   keyEvts$1 = ['keydown', 'keypress', 'keyup'];
  var formEvts = ['change', 'input', 'submit'];
  var touchEvts = ['touchstart', 'touchmove', 'touchend'];
  var scrEvts = ['wheel', 'scroll'];
  var eventChecks = mouseEvts.concat(dragEvts, focusEvts$1, keyEvts$1, formEvts, touchEvts, scrEvts);
  var cbChecks = ['created', 'appended'];
  var classChecks = ['className', 'cls'];
  var delayExtraClasses = ['xtraCls', 'xCls'];
  var allClassNameChecks = delayExtraClasses.concat(classChecks);
  var delayTextProps = ['text', 'textContent'];
  var delayAppendTarget = ['parent'];
  var allChecks = dimensionStyle.concat(displayStyle, shareStyle, specialChecks, childrenChecks, evtArrChecks, eventChecks, cbChecks, classChecks, delayExtraClasses, delayTextProps, delayAppendTarget);
  var dimRange = dimensionStyle.length;
  var disRange = dimRange + displayStyle.length;
  var shareRange = disRange + shareStyle.length;
  var specialRange = shareRange + specialChecks.length;
  var childrenRange = specialRange + childrenChecks.length;
  var evtArrRange = childrenRange + evtArrChecks.length;
  var evtRange = evtArrRange + eventChecks.length;
  var cbRange = evtRange + cbChecks.length;
  var clsRange = cbRange + classChecks.length;
  var xtraRange = clsRange + delayExtraClasses.length;
  var textRange = xtraRange + delayTextProps.length;
  /**
   * @private specialKey {number} key for differentiating template groups
   */
  var specialKey = Math.floor(Math.random() * 100000);
  /**
   * @param el {Element}
   * @returns {Object}
   */
  function getDefaults(el) {
      var elSetups = el.setups;
      return elSetups ? elSetups.__configs.defaults : null;
  }
  /**
   * Return children configs object when element is created by dominic
   * Return null if error / not found
   * @param el {Element}
   */
  function getChildrenConfigs(el) {
      var elSetups = el.setups;
      if (!elSetups) return null;
      if (has(elSetups, 'items')) return elSetups.items;
      if (has(elSetups, 'children')) return elSetups.children;
      return null;
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
          elStyle = el.style;
      for (var key in defs) {
          if (has(defs, key)) {
              var val = defs[key],
                  keyIdx = allChecks.indexOf(key);
              if (keyIdx == -1) el[key] = val;else {
                  if (keyIdx < dimRange) {
                      elStyle[key] = isNaN(val) ? val : val + 'px';
                  } else if (keyIdx < disRange) {
                      elStyle[key] = val;
                  } else if (keyIdx < shareRange) {
                      if (!has(configs, 'defaults')) {
                          defProp(configs, 'defaults', { value: createDict() });
                      }
                      assign(configs.defaults, val);
                  } else if (keyIdx < specialRange) {
                      elSetups[key] = val;
                  } else if (keyIdx < childrenRange) {
                      elSetups.children = val;
                  } else if (keyIdx < evtArrRange) {
                      val.forEach(function (evtArgs) {
                          events[evtLen++] = evtArgs;
                      });
                  } else if (keyIdx < evtRange) {
                      events[evtLen++] = assign({ type: key }, val);
                  } else if (keyIdx < cbRange) {
                      elSetups[key] = val;
                  } else if (keyIdx < xtraRange) {
                      if (!val) continue;
                      if (!has(elSetups, 'cls')) {
                          elSetups.cls = '';
                      }
                      elSetups.cls += val + ' ';
                  } else if (keyIdx < textRange) {
                      el.appendChild(document.createTextNode(val));
                  } else {
                      defProp(elSetups, 'parent', { value: val });
                  }
              }
          }
      }
  }
  /**
   * @param el {Element}
   */
  function setAttrs(el) {
      var elSetups = el.setups;
      if (!elSetups || !has(elSetups, 'attrs')) return;
      each(elSetups.attrs, function (value, attrName) {
          el.setAttribute(c2d(attrName), value);
      });
  }
  /**
   * @param el {Element}
   */
  function setStyles(el) {
      var elSetups = el.setups;
      if (!elSetups || !has(elSetups, 'style')) return;
      var elStyle = el.style,
          styles = elSetups.style;
      for (var s in styles) {
          if (has(styles, s)) {
              var styleVal = styles[s];
              if (pxChecks.indexOf(s) !== -1) elStyle[s] = isNaN(styleVal) ? styleVal : styleVal + 'px';else elStyle[s] = styleVal;
          }
      }
  }
  /**
   * @param el {Element}
   * @param root {Element}
   */
  function setEvents(el, root) {
      var elSetups = el.setups;
      if (!elSetups || !has(elSetups, '__events')) return;
      for (var i = 0, elEvents = elSetups.__events, len = elEvents.length; i < len; i++) {
          var evtArgs = elEvents[i];
          attachEvent(el, evtArgs, root);
      }
  }
  /**
   * set class attribute for element, from el.setups
   * @param el {Element}
   */
  function setCls(el) {
      var elSetups = el.setups;
      if (!elSetups || !has(elSetups, 'cls') || !elSetups.cls) return;
      el.className = elSetups.cls.trim();
  }
  function callCreated(el) {
      var elSetups = el.setups;
      if (!elSetups || !has(elSetups, 'created')) return;
      elSetups.created.call(el);
  }
  /**
   * @param defs {Object} child definitions
   * @returns {Element}
   */
  function createChildren(defs) {
      if (has(defs, 'if') && !toBool(defs.if)) return null;
      var tag = has(defs, 'tag') ? defs.tag : 'div',
          el = document.createElement(tag);
      createSetupsHolder(el);
      setDefs(el, defs);
      return el;
  }
  /**
   * @param el {Element} parent -> for defaults configs purpose
   * @param object {Object} child definitions
   * {Element}
   */
  function object2children(el, object, root) {
      var defaults = getDefaults(el),
          defs = assignExtend(object, defaults),
          child = createChildren(defs);
      if (!child) return null;
      setAttrs(child);
      setStyles(child);
      setEvents(child, root);
      setCls(child);
      return child;
  }
  /**
   * @param parent {Element}
   * @param child {Element}
   * @param root {Element}
   * @param [stop] {Element}
   */
  function appendChild(parent, child, root, stop) {
      if (child === null || typeof child === 'undefined') return;
      setReference(parent, child, root);
      insertBefore(parent, child, stop);
      if (has(child, 'd__isCmp')) return;
      var f2 = getChildrenConfigs(child);
      setChildren(child, f2, root);
      callCreated(child);
  }
  /**
   * Used by 'for', does not accept array as input
   * @param el {Element}
   * @param input {(string|number|Object)}
   * @param root {Element}
   * @param [groupKey] {number}
   */
  function makeChild(el, input, root, groupKey) {
      var child = null;
      if (isArray(input) || typeof input === 'function') {
          console.info('Return value in template function is an array or a function. Ingored');
          return null;
      }
      if (isPlain(input)) {
          if (has(input, 'ctype')) child = createComponent(input);else child = object2children(el, input, root);
      } else if (isStrOrNum(input)) {
          child = document.createTextNode(input);
      } else if (isDom(input)) {
          child = input;
      }
      if (groupKey && child) child.groupKey = groupKey;
      return child;
  }
  /**
   * @param el {Element}
   * @param forOpts {{for: Object, scope: (string|Object), tplFn: Function, root: string, alwaysIterate: bool, observeProp: string }}
   * @param groupKey {number}
   * @param rool {Element}
   */
  function for2children(el, forOpts, groupKey, root, stop) {
      var val = forOpts.for;
      if (!val) return;
      var data = has(forOpts, 'root') ? val[forOpts.root] : val,
          fn = forOpts.tplFn,
          children,
          fnResult,
          child;
      if (data && typeof fn === 'function') {
          var thisArg = root;
          if (has(forOpts, 'scope')) {
              var scope = opts.scope;
              thisArg = scope === 'root' ? root : scope === 'parent' ? parent : scope;
          }
          if (isArray(data)) data.forEach(function (d, i) {
              fnResult = fn.call(thisArg, d, i);
              child = makeChild(el, fnResult, root, groupKey);
              if (child) appendChild(el, child, root, stop);
              // return child
          });else if (isPlain(data) && forOpts.alwaysIterate) {
                  var keys = getKeys(data);
                  children = keys.forEach(function (key, i) {
                      fnResult = fn.call(thisArg, data[key], key);
                      child = makeChild(el, fnResult, root, groupKey);
                      if (child) appendChild(el, child, root, stop);
                      return child;
                  });
              } else {
                  fnResult = fn.call(thisArg, data);
                  if (!isArray(fnResult)) {
                      fnResult = [fnResult];
                  }
                  children = fnResult.forEach(function (result, i) {
                      child = makeChild(el, result, root, groupKey);
                      if (child) appendChild(el, child, root, stop);
                      return child;
                  });
              }
      }
  }
  /**
   * @param el {Element}
   * @param tplOpts {Object}
   * @param root {Element}
   */
  function setChildrenInFor(el, tplOpts, root) {
      var groupKey;
      if (has(tplOpts, 'observeProp')) {
          var obsProp = tplOpts.observeProp,
              groupKey = specialKey++;
          if (obsProp && isStrOrNum(obsProp) && obsProp !== '__owner') {
              var observer = setObserver(el, tplOpts, groupKey, root);
          }
      }
      for2children(el, tplOpts, groupKey, root);
  }
  /**
   * @param el {Element}
   * @param children {any}
   * @param root {Element}
   */
  function setChildren(el, children, root) {
      if (!children) return;
      var child;
      if (isPlain(children)) {
          if (has(children, 'ctype')) {
              child = createComponent(children);
              appendChild(el, child, root);
              return;
          }
          if (has(children, 'for')) {
              setChildrenInFor(el, children, root);
          } else {
              child = object2children(el, children, root);
              appendChild(el, child, root);
          }
          return;
      }
      if (isArray(children)) {
          children.forEach(function (ch) {
              setChildren(el, ch, root);
          });
          return;
      }
      if (typeof children === 'function') {
          var realChildren = children();
          setChildren(el, realChildren, root);
          return;
      }
      if (isDom(children)) {
          appendChild(el, children, root);
      } else appendChild(el, document.createTextNode(children), root);
  }
  function setRootChildren(el) {
      var elSetups = el.setups;
      if (!elSetups) return;
      var children = getChildrenConfigs(el);
      setChildren(el, children, el);
  }
  /**
   * Define an object { setups: { __configs:Object, __events:[] } on an element
   * @param el {Element}
   */
  function createSetupsHolder(el) {
      var setups = createDict();
      defProps(setups, {
          __configs: { value: createDict() },
          __events: { value: [] }
      });
      el.setups = setups;
  }
  /**
   * Entry function, executed only once 
   * @param defs {Object} element definitions
   * @returns {Element}
   */
  function createElement(defs) {
      var tag = has(defs, 'tag') ? defs.tag : 'div';
      var el = document.createElement(tag);
      defProp(el, 'd__isCmp', { value: true });
      createSetupsHolder(el);
      setDefs(el, defs);
      setAttrs(el);
      setStyles(el);
      setEvents(el, el);
      setCls(el);
      setRootChildren(el);
      var elSetups = el.setups;
      if (has(elSetups, 'created')) {
          elSetups.created.call(el);
      }
      if (has(elSetups, 'parent')) {
          elSetups.parent.appendChild(el);
          if (has(elSetups, 'appended')) elSetups.appended.call(el);
      }
      return el;
  }
  /**
   * Entry function, executed only once
   * @param defs {Object} component definitions
   * @return {Element}
   */
  function createComponent(defs) {
      var ctype = defs.ctype;
      var definitions = Component.get(ctype).create(defs);
      var comp = createElement(definitions);
      return comp;
  }
  /**
   * API function
   * @param defs {Object} Element definitions
   * @returns {Element}
   */
  function create$1(defs) {
      if (has(defs, 'ctype')) {
          return createComponent(defs);
      } else {
          return createElement(defs);
      }
  }

  var Dominic = createDict();
  defProps(Dominic, {
      create: {
          value: create$1
      },
      query: {
          value: query
      },
      queryDirect: {
          value: queryDirect
      },
      queryLastDirect: {
          value: queryLastDirect
      },
      queryAll: {
          value: queryAll
      },
      queryAllDirect: {
          value: queryAllDirect
      },
      queryAllByMultipleKeys: {
          value: queryAllByMultipleKeys
      },
      attachEvent: {
          value: attachEvent
      },
      register: {
          value: function value(name, creator) {
              Component.register(name, creator);
              return this;
          }
      }
  });

  return Dominic;

}));
=======
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
    var fakeOpts = {}, toString = fakeOpts.__proto__.toString, hasOwn = fakeOpts.__proto__.hasOwnProperty;
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
    var areDom = function(objs) {
        if (!Array.isArray(objs)) return false;
        var count = 0, length = objs.length;
        for (var i = 0; i < length; i++) count += objs[i] instanceof Node ? 1 : 0;
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
    var areStrOrNum = function(vals) {
        if (!Array.isArray(vals)) return false;
        var count = 0, length = vals.length;
        for (var i = 0; i < length; i++) count += isStrOrNum(vals[i]) ? 1 : 0;
        return count === length;
    };
    var isFn = function(val) {
        return typeof val === 'function';
    };
    var c2d = function(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    };
    var cap = function(str) {
        return str[0].toUpperCase() + str.slice(1);
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function isPlainObject(obj) {
        return toString.call(obj) === '[object Object]';
    }
    function extend(destArr) {
        destArr = destArr || [];
        if (arguments.length < 2) return destArr;
        var currIdx = destArr.length;
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            for (var j = 0; j < src.length; j++) destArr[currIdx++] = src[j];
        }
        return destArr;
    }
    function forEach(nodeList, expression, thisArg) {
        if (nodeList) for (var i = 0; i < nodeList.length; i++) expression.call(thisArg, nodeList[i], i);
    }
    function map(nodeList, expression, thisArg) {
        if (nodeList) {
            var result = [];
            for (var i = 0; i < nodeList.length; i++) {
                var node = nodeList[i];
                if (expression.call(thisArg, node, i)) result.push(node);
            }
            return result;
        }
        return null;
    }
    function indexOf(el, nodeList) {
        return Array.prototype.indexOf.call(nodeList, el);
    }
    function assign(dest) {
        dest = dest || {};
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (!src) continue;
            var keys = Object.keys(src);
            for (var j = 0; j < keys.length; j++) {
                dest[keys[j]] = src[keys[j]];
            }
        }
        return dest;
    }
    function assign2(dest) {
        dest = dest || {};
        if (arguments.length < 2) return dest;
        var propsToCopyCfg = arguments[arguments.length - 1];
        if (typeof propsToCopyCfg !== 'string') return dest;
        var propsToCopy = propsToCopyCfg.split(',');
        if (!propsToCopy.length) return dest;
        for (var i = 1; i < arguments.length - 1; i++) {
            var src = arguments[i];
            if (!src) continue;
            var keys = Object.keys(arguments[i]);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                if (propsToCopy.indexOf(key) === -1) continue;
                var val = src[key];
                dest[key] = val;
            }
        }
        return dest;
    }
    function assign3(dest) {
        dest = dest || {};
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (!src) continue;
            var keys = Object.keys(arguments[i]);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                if (Array.isArray(dest)) {
                    for (var k = 0; k < dest.length; k++) if (!dest[k].hasOwnProperty(key)) dest[k][key] = src[key];
                } else {
                    if (!dest.hasOwnProperty(key)) dest[key] = src[key];
                }
            }
        }
        return dest;
    }
    function toSelector(dom) {
        var id = dom.id ? '#' + dom.id : '';
        var clsStr = dom.classList.toString();
        var classes = clsStr ? clsStr.split(' ') : fakeArray;
        var selector = dom.localName + id + (classes.length ? '.' + classes.join('.') : '');
        return selector;
    }
    function query(root, key, value) {
        var result = null, childNodes = root.childNodes, len = childNodes.length;
        for (var i = 0; i < len; i++) {
            var child = childNodes[i];
            if (hasOwnProperty.call(child, key) && (typeof value === 'undefined' || child[key] === value)) result = child; else result = query(child, key, value);
            if (result) return result;
        }
        return result;
    }
    function queryDirect(root, key, value) {
        var childNodes = root.childNodes, len = childNodes.length;
        for (var i = 0; i < len; i++) {
            var child = childNodes[i];
            if (hasOwnProperty.call(child, key) && (typeof value === 'undefined' || child[key] === value)) return child;
        }
        return null;
    }
    function queryAllDirect(root, key, value) {
        var result = [], childNodes = root.childNodes, length = childNodes.length;
        for (var i = 0; i < length; i++) {
            var child = childNodes[i];
            if (hasOwnProperty.call(child, key) && child[key] === value) result[result.length] = child;
        }
        return result;
    }
    function queryAll(root, key, value) {
        var result = [], childNodes = root.childNodes, length = childNodes.length;
        for (var i = 0; i < length; i++) {
            var child = childNodes[i];
            if (hasOwnProperty.call(child, key) && child[key] === value) result[result.length] = child;
            extend(result, queryAll(child, key, value));
        }
        return result;
    }
    function queryAllByMultipleKeys(root, dict) {
        if (!dict) return;
        var keys = Object.keys(dict), keyLen = keys.length, result = [], childNodes = root.childNodes, length = childNodes.length, resultIdx = 0;
        for (var i = 0; i < length; i++) {
            var child = childNodes[i];
            for (var j = 0; j < keyLen; j++) {
                var key = keys[j];
                if (hasOwnProperty.call(child, key) && child[key] === dict[key]) {
                    result[resultIdx++] = child;
                    break;
                }
            }
            extend(result, queryAllByMultipleKeys(child, dict));
        }
    }
    var matchesSelector = function() {
        var html = win.HTMLElement;
        var elP = html ? html.prototype : {};
        var matchesSelector = elP.matches || elP.matchesSelector || elP.msMatchesSelector || elP.webkitMatchesSelector || elP.mozMatchesSelector || elP.oMatchesSelector;
        return matchesSelector;
    }();
    function walkUpAndFindMatch(dest, current, selector) {
        while (current && current !== dest) {
            if (matchesSelector.call(current, selector)) return current;
            current = current.parentNode;
        }
        return null;
    }
    function HandleEvent(type, opts, thisArg) {
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
    }
    function HandleKeyEvent(type, opts, thisArg) {
        opts = opts || {};
        var el = opts.el || doc.documentElement;
        var callback = opts.callback;
        var capture = opts.capture;
        var delegate = opts.delegate;
        var keys;
        if (hasOwnProperty.call(opts, 'key')) {
            if (typeof opts.key === 'number') keys = [ opts.key ]; else if (are(opts.key, 'number')) keys = opts.key;
        }
        var handler = function(event) {
            var el = event.currentTarget;
            if (typeof delegate === 'string') {
                if (el === event.target) return;
                var match = walkUpAndFindMatch(el, event.target, delegate);
                if (!match) return;
                if (keys && keys.indexOf(event.keyCode) === -1) return;
                if (typeof callback === 'function') {
                    callback.call(thisArg, event, match, delegate);
                }
            } else {
                if (keys && keys.indexOf(event.keyCode) === -1) return;
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
    }
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
                    if (hasOwnProperty.call(this, refName)) return delete this[refName];
                    return false;
                }
            },
            removeAll: {
                value: function() {
                    var allrefs = Object.keys(this);
                    for (var count = 0; count < allrefs.length; count++) delete this[allrefs[count]];
                    return count === allrefs.length;
                }
            }
        });
        return Refs;
    }();
    function setRefs(root, el, realRoot) {
        var ref = el.ref;
        if (!isStrOrNum(ref)) return;
        var refScope = el.refScope;
        var scope = refScope === 'parent' ? root : realRoot;
        scope.refs = scope.refs || new Refs();
        scope.refs[ref] = el;
        el['__hr'] = true;
    }
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
        function removeEvt(el) {
            el.evts.removeAll();
            delete el.evts;
        }
        function removeAllEvts(el) {
            if (hasOwnProperty.call(el, 'evts')) removeEvt(el);
            var hasEvtEls = queryAll(el, '__he', true);
            forEach(hasEvtEls, removeEvt);
        }
        function removeRef(el, root) {
            var elRefType = hasOwnProperty.call(el, 'refScope') && el.refScope === 'parent' ? 'p' : 'r';
            if (elRefType === 'p') el.parentNode.refs.removeRef(el.ref); else root.refs.removeRef(el.ref);
        }
        function removeAllRefs(el, root) {
            if (hasOwnProperty.call(el, 'refs')) {
                el.refs.removeAll();
                delete el.refs;
            }
            if (hasOwnProperty.call(el, 'ref')) removeRef(el, root);
            var hasRefEls = queryAll(el, '__hr', true);
            forEach(hasRefEls, function(hasRefEl) {
                removeRef(hasRefEl, root);
            });
        }
        function removeEls(els, root) {
            forEach(els, function(el, elIdx) {
                if (el.nodeType === Node.ELEMENT_NODE) {
                    removeAllRefs(el, root);
                    removeAllEvts(el);
                }
                el.parentNode.removeChild(el);
            });
        }
        function handleSetter(root, cacheOpts, defaultOpts, thisTplKey, val) {
            var obsProp = cacheOpts.observeProp;
            this.__data[obsProp] = val;
            cacheOpts.for = val;
            var tobeRemoved = queryAllDirect(root, '__key', thisTplKey);
            var toStartEl;
            var shouldRemoveAfterAppend = false;
            if (tobeRemoved.length) {
                toStartEl = tobeRemoved[0].previousSibling;
                if (toStartEl === null) {
                    var currentChildNodes = root.childNodes;
                    if (currentChildNodes.length > tobeRemoved.length) {
                        toStartEl = root.insertBefore(doc.createElement('a'), currentChildNodes[0]);
                        shouldRemoveAfterAppend = true;
                    }
                }
                removeEls(tobeRemoved, this.__owner);
            } else {
                toStartEl = root.lastChild;
            }
            var newCFromTpl = tpl2dom(root, cacheOpts, this.__owner);
            if (isDom(newCFromTpl)) {
                assignDefs2Node(newCFromTpl, defaultOpts);
            }
            setChildren(root, newCFromTpl, this.__owner, defaultOpts, {
                startEl: toStartEl
            });
            if (shouldRemoveAfterAppend) root.removeChild(toStartEl);
        }
        var specialKey = Math.floor(Math.random() * 1e5);
        defProps(Obs.prototype, {
            add: {
                value: function(root, opts, injectOpts) {
                    var obsProp = opts.observeProp;
                    if (!obsProp || obsProp === '__owner') return;
                    var thisTplKey = specialKey++ + '';
                    var defaultOpts = assign({
                        __key: thisTplKey
                    }, injectOpts);
                    var cacheOpts = assign2({}, opts, 'tplFn,scope,for,root,observeProp,alwaysIterate');
                    defProp(this, obsProp, {
                        get: function(observeProperty) {
                            return this.__data[observeProperty];
                        }.bind(this, obsProp),
                        set: handleSetter.bind(this, root, cacheOpts, defaultOpts, thisTplKey)
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
    function tpl2dom(root, opts, realRoot) {
        var val = opts.for;
        if (!val) return null;
        var valRoot = opts.root || '';
        var data = valRoot ? val[valRoot] : val;
        var fn = opts['tplFn'];
        var children;
        if (data && typeof fn === 'function') {
            var scope = opts.scope;
            var thisArg = scope === 'root' ? realRoot : scope === 'parent' ? root : scope;
            if (Array.isArray(data)) children = data.map(fn, thisArg); else if (isObj(data) && opts.alwaysIterate) {
                var keys = Object.keys(data);
                children = keys.map(function(key) {
                    return fn.call(thisArg, data[key], key);
                });
            } else children = fn.call(thisArg, data);
        }
        return children;
    }
    function setObserver(root, opts, realRoot, injectOpts) {
        realRoot.observe = realRoot.observe || new Obs(realRoot);
        realRoot.observe.add(root, opts, injectOpts);
        return realRoot.observe;
    }
    function fn2dom(root, defs, realRoot, injectOpts, start) {
        var fn = defs.fn;
        if (typeof fn === 'function') {
            var scope = defs.scope;
            var thisArg = scope === 'root' ? realRoot : scope === 'parent' ? root : scope;
            var children = fn.call(thisArg);
            setChildren(root, children, realRoot, injectOpts, start);
        }
    }
    function for2dom(root, defs, realRoot, injectOpts, start) {
        if (hasOwnProperty.call(defs, 'observeProp')) {
            var obsProp = defs.observeProp;
            if (isStrOrNum(obsProp)) {
                var observer = setObserver(root, defs, realRoot, injectOpts);
                observer[obsProp] = defs.for;
            }
        } else {
            var cFromTpl = tpl2dom(root, defs, realRoot);
            if (isDom(cFromTpl)) {
                assignDefs2Node(cFromTpl, injectOpts);
            }
            setChildren(root, cFromTpl, realRoot, injectOpts, start);
        }
    }
    function setStyleNoOverride(el, opts) {
        var styles = Object.keys(opts), elStyle = el.style;
        for (var i = 0; i < styles.length; i++) {
            var styleKey = styles[i];
            if (elStyle[styleKey] !== '') continue;
            var styleVal = opts[styleKey];
            if (pxStyle.indexOf(styleKey) !== -1) elStyle[styleKey] = isNaN(styleVal) ? styleVal : styleVal + 'px'; else elStyle[styleKey] = styleVal;
        }
    }
    function setAttrsNoOverride(el, attrs) {
        var attributes = Object.keys(attrs);
        for (var i = 0; i < attributes.length; i++) {
            var key = attributes[i];
            var realKey = c2d(key);
            if (el.hasAttribute(realKey)) continue;
            var val = attrs[key];
            el.setAttribute(realKey, val);
        }
    }
    function assignDefs2Node(node, injectOpts) {
        for (var opt in injectOpts) {
            if (injectOpts.hasOwnProperty(opt)) {
                var val = injectOpts[opt];
                if (opt === 'style') setStyleNoOverride(node, val); else if (opt === 'attrs') setAttrsNoOverride(node, val); else node[opt] = val;
            }
        }
    }
    function assignDefs2NodeList(nodes, injectOpts) {
        for (var i = 0; i < nodes.length; i++) assignDefs2Node(nodes[i], injectOpts);
    }
    function arrV2dom(root, defs, realRoot, injectOpts, start) {
        for (var i = 0; i < defs.length; i++) {
            var opts = defs[i];
            if (isDom(opts)) {
                assignDefs2Node(opts, injectOpts);
                setChildren(root, opts, realRoot, injectOpts, start);
            } else {
                if (injectOpts && !isStrOrNum(opts)) assign3(opts, injectOpts);
                setChildren(root, opts, realRoot, injectOpts, start);
            }
        }
    }
    function v2dom(root, defs, realRoot, injectOpts, start) {
        var tag = '' + (defs.tag || 'div');
        delete defs.tag;
        if (injectOpts) assign3(defs, injectOpts);
        var el = CreateElement(tag, defs, realRoot);
        setChildren(root, el, realRoot, injectOpts, start);
    }
    function insertAt(root, el, startIndex) {
        var pushedNode = root.childNodes[startIndex + 1];
        if (pushedNode) {
            root.insertBefore(el, pushedNode);
        } else {
            root.appendChild(el);
        }
    }
    function getNextDifferentElByKey(startEl, key) {
        if (startEl) {
            if (!hasOwnProperty.call(startEl, '__key') || startEl.__key !== key) return startEl; else return getNextDifferentElByKey(startEl.nextSibling, key);
        }
        return null;
    }
    function insertAfter(root, el, start) {
        var nextEl = start.startEl.nextSibling;
        if (!nextEl) root.appendChild(el); else {
            var elKey = el.__key;
            var tailEl = getNextDifferentElByKey(nextEl, elKey);
            if (tailEl) root.insertBefore(el, tailEl); else root.appendChild(el);
        }
    }
    function setChildren(root, obj, realRoot, injectOpts, start) {
        'use strict';
        if (!obj) return;
        if (isStrOrNum(obj)) {
            var textNode = doc.createTextNode(obj);
            assignDefs2Node(textNode, injectOpts);
            if (start && start.startEl) {
                insertAfter(root, textNode, start);
                start.startEl = textNode;
            } else root.appendChild(textNode);
            return;
        }
        if (isDom(obj)) {
            if (start && start.startEl) {
                insertAfter(root, obj, start);
                start.startEl = obj;
            } else root.appendChild(obj);
            setRefs(root, obj, realRoot);
        } else {
            if (typeof obj === 'function') {
                var c = obj();
                if (injectOpts) assign3(c, injectOpts);
                setChildren(root, c, realRoot, injectOpts, start);
            } else if (Array.isArray(obj)) {
                arrV2dom.apply(null, arguments);
            } else {
                if (hasOwnProperty.call(obj, 'for')) {
                    for2dom.apply(null, arguments);
                } else if (hasOwnProperty.call(obj, 'fn')) {
                    fn2dom.apply(null, arguments);
                } else {
                    v2dom.apply(null, arguments);
                }
            }
        }
    }
    function attachEvent(el, evt, realRoot) {
        var type = evt.type;
        if (!type) throw new Error('No event type specified');
        var handler = evt.handler;
        var handlerRegType = typeof handler;
        var realHandler;
        realRoot = realRoot || el;
        var scope = evt.scope === 'root' ? realRoot : evt.scope ? evt.scope : el;
        if (handlerRegType === 'function') realHandler = handler; else if (handlerRegType === 'string') realHandler = scope[handler];
        if (typeof realHandler !== 'function') throw new Error('Cannot find handler: "' + handler + '" on element: [' + toSelector(scope) + '].');
        var capture = evt.capture;
        var delegate = evt.delegate;
        var isKeyEvt = keyEvts.indexOf(type) !== -1;
        var evtHandler;
        if (isKeyEvt) evtHandler = HandleKeyEvent(type, {
            el: el,
            callback: realHandler,
            capture: capture,
            delegate: delegate,
            key: evt.key
        }, scope); else evtHandler = HandleEvent(type, {
            el: el,
            callback: realHandler,
            capture: capture,
            delegate: delegate,
            key: evt.key
        }, scope);
        if (el) el.evts = el.evts || new Evt();
        el.evts.push(evtHandler);
        el.__he = true;
    }
    function setEvents(el, eventArgs, realRoot) {
        if (Array.isArray(eventArgs)) for (var i = 0; i < eventArgs.length; i++) attachEvent(el, eventArgs[i], realRoot); else attachEvent(el, eventArgs, realRoot);
    }
    function setAttrs(el, attrs) {
        var attributes = Object.keys(attrs);
        for (var i = 0; i < attributes.length; i++) {
            var key = attributes[i];
            var val = attrs[key];
            var realKey = c2d(key);
            el.setAttribute(realKey, val);
        }
    }
    var pxStyle = [ 'width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight' ];
    ![ '', 'Top', 'Right', 'Bottom', 'Left' ].forEach(function(pos) {
        pxStyle.push('padding' + pos);
        pxStyle.push('margin' + pos);
    });
    function setStyle(el, opts) {
        var styles = Object.keys(opts), elStyle = el.style;
        for (var i = 0; i < styles.length; i++) {
            var styleKey = styles[i];
            var styleVal = opts[styleKey];
            if (pxStyle.indexOf(styleKey) !== -1) elStyle[styleKey] = isNaN(styleVal) ? styleVal : styleVal + 'px'; else elStyle[styleKey] = styleVal;
        }
    }
    var setters = {
        setevents: setEvents,
        setattrs: setAttrs,
        setstyle: setStyle,
        setchildren: setChildren,
        setitems: setChildren
    };
    function setDelaySetups(el, setups, root, injectOpts) {
        for (var i = 0, length = setups.length; i < length; i++) {
            var setup = setups[i];
            setters['set' + setup.key](el, setup.val, root, injectOpts);
        }
    }
    function setDelayEvts(el, events, root) {
        for (var i = 0, length = events.length; i < length; i++) {
            var evt = events[i];
            var evtArgs = assign({}, {
                type: evt.key
            }, evt.val);
            attachEvent(el, evtArgs, root);
        }
    }
    function evalIf(condition) {
        var bool;
        if (typeof condition === 'function') bool = condition(); else bool = condition;
        return Boolean(bool);
    }
    var dimensionStyle = pxStyle;
    var displayStyle = [ 'color', 'backgroundColor', 'background', 'display', 'position', 'border', 'transform', 'opacity', 'fontSize' ];
    var shareStyle = [ 'defaults' ];
    var fnConfig = [ 'style', 'children', 'items', 'attrs', 'events' ];
    var mouseEvts = [ 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove' ];
    var dragEvts = [ 'dragstart', 'dragend', 'drag', 'dragover', 'dragenter', 'dragleave', 'drop' ];
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
    var CreateElement = function(name, defs, root, data) {
        defs = defs || fakeOpts;
        if (defs.hasOwnProperty('if') && !evalIf(defs.if)) return null;
        var el = doc.createElement(name);
        root = root || el;
        var definitions = Object.keys(defs);
        var delaySetups;
        var delayEvts;
        var delayCb;
        var delayClasses;
        var delayExtraClasses;
        var delayRoot;
        var injectOpts;
        var delayNoDisplay;
        var elStyle = el.style;
        if (defs.hasOwnProperty('hide') && evalIf(defs.hide)) {
            delayNoDisplay = true;
        }
        for (var i = 0, length = definitions.length; i < length; i++) {
            var key = definitions[i];
            var val = defs[key];
            var keyIdx = allChecks.indexOf(key);
            if (keyIdx == -1) el[key] = val; else {
                if (keyIdx < dimRange) {
                    elStyle[key] = isNaN(val) ? val : val + 'px';
                } else if (keyIdx < disRange) {
                    elStyle[key] = val;
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
        if (el === root) {
            if (delayRoot && isDom(delayRoot)) {
                delayRoot.appendChild(el);
                if (delayCb && typeof delayCb.appended === 'function') delayCb.appended.call(el, delayRoot);
            }
        } else {
            el.root = root;
        }
        if (delayNoDisplay) elStyle.display = 'none';
        return el;
    };
    var Dominic = {
        __proto__: null
    };
    defProps(Dominic, {
        isPlainObject: {
            value: function(obj) {
                return isPlainObject(obj);
            }
        },
        createElement: {
            value: function(name, opts) {
                var firstArgType = typeof name;
                if (firstArgType === 'number') throw Error('Invalid element tag name');
                if (firstArgType === 'string') return CreateElement(name, opts); else return CreateElement('div', name);
            }
        },
        handleEvent: {
            value: function(el, opts, thisArg) {
                var realThis = el;
                if (thisArg === 'root') realThis = el.root || el; else if (typeof thisArg !== 'undefined') realThis = thisArg;
                if (isPlainObject(opts)) {
                    var evtTypes = Object.keys(opts);
                    var evts = [];
                    for (var i = 0; i < evtTypes.length; i++) {
                        var eType = evtTypes[i];
                        var evtOpts = opts[eType];
                        evts.push({
                            key: eType,
                            val: evtOpts
                        });
                        setters['setevents'](el, assign({
                            type: eType
                        }, evtOpts), realThis);
                    }
                } else setters['setevents'](el, opts, realThis);
            }
        },
        setWindow: {
            value: function(obj) {
                win = obj, doc = win.document;
                Node = win.Node;
            }
        },
        queryAll: {
            value: queryAll
        },
        queryAllDirect: {
            value: queryAllDirect
        },
        query: {
            value: query
        },
        queryDirect: {
            value: queryDirect
        }
    });
    return Dominic;
});
>>>>>>> b4fa2e49bee556848df2b70fcba328b6bb16de00
