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
          if (has(child, key) && (typeof value === 'undefined' || child[key] === value)) result = child;else result = query(child, key, value);
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
                  if (isArray(dest)) {
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
      if (has(el, 'ref')) {
          var refHolder = has(el, 'refScope') && el.refScope === 'parent' ? el.parentNode : el.root_;
          // case when component is direct root of parent,
          // refs holder will be gone before this execution
          if (has(refHolder, 'refs')) refHolder.refs.removeRef(el.ref);
          return;
      }
      if (has(el, 'directRef')) {
          var directRef = el.directRef;
          if (isStrOrNum(directRef) && directRef !== '') {
              delete el.root_[directRef];
          }
      }
  }
  function removeAllRefs(el) {
      if (has(el, 'refs')) {
          el.refs.removeAll();
          delete el.refs;
      }
      if (has(el, 'ref')) {
          removeRef(el);
      } else if (has(el, 'directRef')) {
          delete root[el.directRef];
      }
      var hasRefEls = queryAll(el, 'hsr', true);
      hasRefEls.forEach(removeRef);
  }
  function removeEls(els) {
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
                          removeEls([childToRemove]);
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
      var ref, holder;
      if (has(el, 'ref')) {
          ref = el.ref;
          if (ref === '' || !isStrOrNum(ref)) return;
          var scope = has(el, 'refScope') && el.refScope === 'parent' ? parent : root;
          if (!has(scope, 'refs')) scope.refs = new ReferenceHolder();
          holder = scope.refs;
      } else if (has(el, 'directRef')) {
          ref = el.directRef;
          if (ref === '' || !isStrOrNum(ref)) return;
          holder = root;
      } else {
          return;
      }
      holder[ref] = el;
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
  function callCreated(el, root) {
      var elSetups = el.setups;
      if (!elSetups || !has(elSetups, 'created')) return;
      if (isFn(elSetups.created)) elSetups.created.call(root, el, root);
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
      child.root_ = root;
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
      if (has(child, 'd__isCmp')) {
          child.root_ = root;
          return;
      }
      var f2 = getChildrenConfigs(child);
      setChildren(child, f2, root);
      callCreated(child, root);
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
      if (has(elSetups, 'created') && isFn(elSetups.created)) {
          elSetups.created.call(el, el, el);
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
      // Carry the reference to the component
      if (has(defs, 'ref')) {
          definitions.ref = defs.ref;
          if (has(defs, 'refScope')) definitions.refScope = defs.refScope;
      } else if (has(defs, 'directRef')) definitions.directRef = defs.directRef;
      var comp = createElement(definitions);
      comp.ctype = ctype;
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