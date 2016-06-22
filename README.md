## Dominic
Helper to quickly build up dom in javascript object format
* v.0.1.42 contains breaking changes. See [changelog](https://github.com/bigopon/dominic/blob/master/CHANGELOG.md "v.0.1.42 changelog")

Basic feature list:

 * Just dom
 * Basic dom construction by javascript object format
 * Event
 * Reference
 * Template by function
 * Components
 * ~~Server side render to Html (with helper, see API)~~ (temporarily)

* Version: 0.1.46
* Outline
  - [1. Basic](#basic1)
  - [2. Div all the elements](#basic2)
  - [3a Share configs](#basic3)
  - [3b Share configs with extra classes](#basic3b)
  - [4. Condition `if` | `hide`](#basic4)
  - [5. Attributes](#attributes)
  - [6. Reference](#reference1)
  - [7. Direct Reference](#reference2)
  - [8. Events 1: Basic](#event1)
  - [9. Events 2: Delegate](#event2)
  - [10 Events 3: Key Code Hook](#event3)
  - [11 Events 4: Counter & Validator](#event4)
  - [12 Template 1: Basic](#template1)
  - [13 Template 2: Object loop](#template2)
  - [14 Template 3: Data change reaction](#template3)
  - [15 Template 4: All functions](#template4)
  - [16 Component: Basic 1](#component1)
  - [17 Component: Basic 2](#component2)
  - [Installation](#install)
  - [API](#api)
  - [Plan](#plan)
  - [License MIT](#license)


And here's some code! :+1:

#### Basic 1: <a id="basic1"></a>
```javascript
var root = Dominic.create({
    cls: 'root', // or className: 'root' | cls as alias for className
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    items: [ // or: children
        // also accept string, number as children, will be converted to text node
        { tag: 'div', width: 50, height: 50, text: 'Intro', display: 'inline-block', background: 'yellowgreen' },
        { tag: 'div', width: 200, background: 'lightgreen',
            items: [
                { tag: 'div', width: 20, height: 20, background: 'red' },
                { tag: 'div', width: 20, height: 20, background: 'orange' },
            ],
            created: function(el, root) {
                // el: the div element with background: 'lightgreen' and 2 children 'red' & 'orange'
                // root: the root elemnt directly created by Dominic.create
                // this: = root element
            }
        }
    ],
    created: function (el, root) {
        // called when finished every setup
    },
    appended: function () {
        // called when
        // 1. element is root (created by Dominic.create)
        // 2. parent is Node and appended element successfully
    }
})
```
###### Result
![alt tag](http://img.prntscr.com/img?url=http://i.imgur.com/XFBYYe4.png)

###### Styling
* `color`, `backgroundColor`, `background`, `display`, `position`, `border`,
  `transform`, `opacity`, `fontSize`
  will be applied directly to element style without the need of putting them
  in a style object. Same with: 
* `width`, `height`, `minHeight`, `maxHeight`,  `minWidth`, `maxWidth`
* `margin`, `padding`, `margin` and `padding` + `(Top - Left - Right - Bottom)`
 will be converted to proper CSS value if value is number

#### Basic 2: Function as item & div all the elements <a id="basic2"></a>
* Tag name is 'div' by default
```javascript
var outerScopeDataSource = [
    { name: 'yellow' },
    { name: 'green' },
    { name: 'pink' }
]
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    items: [
        { width: 50, height: 50, text: 'Intro', display: 'inline-block', background: 'yellowgreen',
            items: [
                function () {
                    return outerScopeDataSource.map(function (data) {
                        return { tag: 'custom-el', text: data.name }
                    })
                }
            ]
        },
        { width: 200, background: 'lightgreen',
            items: ['color', 'material'].map(function (val) {
                return { text: val }
            })
        }
    ]
})
```
###### Result
![](http://image.prntscr.com/image/96b684409c2847a9bd92aa691ea4d294.png)

#### Basic 3a: Share configs <a id="basic3"></a>
```javascript
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    width: '100%',
    height: '100%',
    defaults: {
        display: 'inline-block',
        height: '100%',
        cls: 'default-class',
        style: {
            verticalAlign: 'top'
        }
    },
    items: [
        { cls: 'sidebar', width: 200, ref: 'sidebar', background: 'lightgreen' },
        { cls: 'main', width: 'calc(100% - 200px)', ref: 'main', background: 'lightblue',
            defaults: {
                background: 'tomato',
                margin: 5,
                height: 50,
                width: 50,
                display: 'inline-block'
            },
            items: [
                { text: 1 },
                { text: 2 },
                [3,4,5,6].map(function (v) { return { text: v } }),
                function () {
                    return [5,6,7,8].map(function (v) { return { text: v } })
                }
            ]
        },
        { tag: 'test' }
    ]
})
```
* All direct children of root will have `display = 'inline-block', height = '100%'`
* Only last child of root will have `class = 'default-class'`

###### Result
![](http://img.prntscr.com/img?url=http://i.imgur.com/o8Nt3GZ.png)

#### Basic 3b: Share configs with extra class <a id="basic3b"></a>
`xtraCls`, `xCls`: `string`
```javascript
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    width: '100%',
    height: '100%',
    defaults: {
        cls: 'default-class',
    },
    items: [
        { xCls: 'sidebar' },
        { xtraCls: 'main' },
        { tag: 'test' }
    ]
})
```
###### Result
![](http://image.prntscr.com/image/6f45032d704043bfaf4f84df6cdf1613.png)

#### Basic 4: Condition `if`/ `hide` <a id="basic4"></a>
```javascript
var root = Dominic.create({
    className: 'root',
    parent: document.body,
    width: '100%',
    height: '100%',
    defaults: {
        display: 'inline-block',
        height: '100%',
        className: 'default-class',
        style: {
            verticalAlign: 'top'
        }
    },
    items: [
        { cls: 'sidebar', width: 200, ref: 'sidebar', background: 'lightgreen' },
        { cls: 'main',
            width: 'calc(100% - 200px)',
            ref: 'main',
            background: 'lightblue',
            defaults: {
                background: 'tomato',
                margin: 5,
                height: 50,
                width: 50,
                display: 'inline-block'
            },
            items: [
                { text: 'First' },
                { text: 'Second' },
                [3,4,5,6].map(function (v, i) {
                    return { text: 'Value is: ' + v, if: v < 4 }
                }),
                function () {
                    return [5,6,7,8].map(function (v) { return { text: v, hide: v > 6 } })
                }
            ]
        }
    ]
})
```
###### Result
![](http://img.prntscr.com/img?url=http://i.imgur.com/poLwTtM.png)


#### Attributes <a id="attributes"></a>
```javascript
var root = Dominic.create({
    className: 'root',
    id: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    padding: 5,
    attrs: {
        class: 'original',
        dataTooltip: 'halo this is tip',
        'data-id': 5
    }
})
```
###### Result
![alt tag](http://img.prntscr.com/img?url=http://i.imgur.com/WQP5QQ3.png)

#### Reference 1 <a id="reference1"></a>
```javascript
var root = Dominic.create({
    className: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    items: [
        { width: 50, height: 50, text: 'Intro', display: 'inline-block' },
        { width: 200, ref: 'orange', // access by root.refs.orange
            items: [
                { width: 20, height: 20, background: 'red',
                    ref: 'lightgreen' // access by root.refs.lightgreen
                },
                { width: 20, height: 20, background: 'orange',
                    // access by root.refs.orange.refs.orange
                    ref: 'orange', refScope: 'parent'
                },
            ]
        }
    ]
})
```

#### Reference 2: Direct reference <a id="reference2"></a>
```javascript
var root = Dominic.create({
    className: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    items: [
        { width: 50, height: 50, text: 'Intro', display: 'inline-block' },
        { width: 200, ref: 'orange', // access by root.refs.orange
            items: [
                { width: 20, height: 20, background: 'red',
                    ref: 'lightgreen' // access by root.refs.lightgreen
                },
                { width: 20, height: 20, background: 'orange',
                    // access by root['orange-f2']
                    // ref: 'orange', // using ref will get dominic ignore directRef
                    directRef: 'orange-f2'
                },
            ]
        }
    ]
})

// example
Dominic.register('input', function(defs) {
    return {
        items: [
            { tag: 'span', text: defs.label },
            { tag: 'input', placeholder: 'Choose name...' }
        ]
    }
})
// usage
var root = Dominic.create({
    cls: 'root', 
    items: [
        // accessed by root.refs.nameInput
        // previously have to define ref in component definitions
        { ctype: 'input', ref: 'nameInput', label: 'Name: ' },
        // accessed by root.nameInput2
        { ctype: 'input', directRef: 'nameInput2', label: 'Name 2: ' }
    ]
})
```

#### Events 1: <a id="event1"></a>
Reserved keyword for events:
* Mouse: `click` `mousedown` `mouseup` `mouseover` `mouseout` `mouseenter` `mouseleave` `mousemove`
* Drag: `dragstart` `dragend` `drag` `dragover` `dragenter` `dragleave` `drop`
* Focus: `blur` `focus` 
* Keyboard: `keydown` `keypress` `keyup`
* Form: `change` `input` `submit`
* Touch: `touchstart` `touchmove` `touchend`
* Scroll: `wheel` `scroll`

```javascript
var root = Dominic.create({
    className: 'root',
    id: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    items: [
        { tag: 'div', width: 50, height: 50, text: 'Intro', display: 'inline-block', background: 'yellowgreen' },
        { tag: 'div', width: 200, background: 'lightgreen',
            items: [
                { tag: 'div', className: 'red', width: 20, height: 20, background: 'red',
                    // normal click handler
                    click: {
                        handler: function (e) {
                            // div.red
                            console.log('This is:', this.localName + '.' + this.className)
                        }
                    }
                },
                { tag: 'div', className: 'orange', width: 20, height: 20, background: 'orange',
                    click: {
                        // change scope to root element
                        scope: 'root',
                        handler: function (e) {
                            // div.root
                            console.log('This is:', this.localName + '.' + this.className)
                        }
                    },
                    events: [
                        { type: 'custom:event', handler: function () { 
                            console.log('This is div.orange')
                        }}
                    ]
                },
                { tag: 'div', className: 'yellow', width: 20, height: 20, background: 'yellow',
                    click: {
                        scope: 'root',
                        // Will look up for `onClickYellow` on root element
                        // Throw error if not found
                        handler: 'onClickYellow',
                        capture: true
                    }
                }
            ]
        }
    ],
    onClickYellow: function (e) {
        var t = e.target
        // From div.yellow to div.root
        console.log('From ', t.localName + '.' + t.className + ' to ' + this.localName + '.' + this.className)
    },
    events: [
        { type: 'mouseout', handler: function (e) {
            console.log('Out of:', e.target)
        }}
    ]
})
```

#### Events 2: Delegate <a id="event2"></a>
```javascript
var root = Dominic.create({
    cls: 'root',
    id: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    items: [
        { width: 50, height: 50, text: 'Intro', display: 'inline-block', background: 'yellowgreen' },
        { width: 200, background: 'lightgreen',
            items: [
                { cls: 'child red', width: 20, height: 20, background: 'red' },
                { cls: 'child orange', width: 20, height: 20, background: 'orange' },
                { cls: 'child yellow', width: 20, height: 20, background: 'yellow' }
            ],
            click: { scope: 'root', handler: 'onClickLightgreen', delegate: '.child' }
        }
    ],
    onClickLightgreen: function (e, match, delegate) {
        // this: scope when register event listener. Default: element has listener
        // e: event object
        // match: element matching delegate
        // delegate: delegate css selector passed when register event listener
        console.log('This is: ' + match.localName + '.' + match.className.replace(' ', '.'))
    }
})
```

#### Events 3: Key code hook <a id="event3"></a>
- Only trigger key event with specified key codes
```javascript
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    width: '100%',
    height: '100%',
    defaults: {
        cls: 'default-class',
    },
    items: [
        { xCls: 'sidebar' },
        { xtraCls: 'main' },
        { tag: 'input',
            keydown: { scope: 'root', handler: 'sayHelo', key: 13 }
        },
        { tag: 'input',
            keydown: { scope: 'root', handler: 'onArrowKey', key: [37,38,39,40] }
        }
    ],
    sayHelo: function (e) {
        console.log('helo', e.target.value)
    },
    onArrowKey: function (e) {
        console.log('Navigating:', e.keyCode)
    }
})
```

#### Events 4: Event counter and validator <a id="event4"></a>
```javascript
// This example second input only let user navigate by arrow key
// if user has already 'sayHelo' with a validated name
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    width: '100%',
    height: '100%',
    defaults: {
        cls: 'default-class',
    },
    items: [
        { xCls: 'sidebar' },
        { xtraCls: 'main' },
        { tag: 'input',
            keydown: { scope: 'root', handler: 'sayHelo', key: 13,
                // count 1 to remove this listener after user say helo
                // to not let user change name
                count: 1,
                // validator's logic
                // * validator will run right before real handler,
                // * return false to stop handler
                // * counter will not decrease if validator returns false
                // * if event is delgated to child, then validator will have same
                //     parameters with handler (event, match, delegate)
                validator: function(e) {
                    return e.target.value
                }
            }
        },
        { tag: 'input',
            keydown: { scope: 'root', handler: 'onArrowKey', key: [37,38,39,40],
                // check if user is allowed to go by validator
                validator: 'isAllowedToGo'
                // only let user navigate 10 times
                count: 10,
            }
        }
    ],
    sayHelo: function (e) {
        this.name = e.target.value
        console.log('helo', e.target.value)
    },
    onArrowKey: function (e) {
        console.log('Navigating:', e.keyCode)
    },
    isAllowedToGo: function() {
        return this.name
    }
})
```

#### Template 1a <a id="template1"></a>
1. `for`: data source
2. `TplFn`: function (item, itemIndex)
* If data source provided is an array, item is record of array and itemIndex is record index
* If data source provided is an object, item is data object and itemIndex will be undefined

```javascript
var root = Dominic.create({
    className: 'root',
    id: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    padding: 5,
    items: {
        // data source
        for: [
            { name: 'apple', cost: 0.5 },
            { name: 'mango', cost: 0.5 },
            { name: 'grape', cost: 0.6,
                suppliers: { data: [
                    { name: 'US', time: 5 },
                    { name: 'UK', time: 4 }
                ]}
            }
        ],
        tplFn: function (item, itemIdx) {
            return { tag: 'div', text: item.name, padding: 5, margin: '5px 0 0 5px', background: 'tomato',
                items: {
                    for: item.suppliers,
                    root: 'data', // specify which property to look for data
                    tplFn: function (sup, supIdx) {
                        return { tag: 'div',
                            padding: 5,
                            background: 'lightblue',
                            text: sup.name + '. Time: ' + sup.time + ' days'
                        }
                    }
                }
            }
        }
    }
})
```
###### Result
![](http://img.prntscr.com/img?url=http://i.imgur.com/aZVNQe8.png)

#### Template 1b: Object loop <a id="template2"></a>
* Can also loop through object property if specified with `alwaysIterate`.

```javascript
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    defaults: {
        cls: 'default-class'
    },
    items: [
        { for: { a: 5, b: 6, c: 7},
            observeProp: 'data1',
            alwaysIterate: true,
            // value & key instead value & index
            tplFn: function (v, key) {
                return { text: 'Value is: [' + v + ']. Key is: [' + key + ']' }
            }
        },
        { xCls: 'sidebar' },
        { xtraCls: 'main', items: {
            for: [5,6,7,8],
            observeProp: 'data2',
            tplFn: function (v) { return v }
        }},
    ]
})

// change:
root.observe.data1 = { name: 'Dominic', purpose: 'Helper', target: 'quick dom for test' }
root.observe.data2 = [ 'Helo ', 'This ', 'is ', 'a ', 'test ' ]
```
###### Result
![](http://image.prntscr.com/image/bc5ae70b6911427897014bf17dee57b0.png)

#### Template with data change reaction <a id="template3"></a>
```javascript
var src = [
    { name: 'apple', cost: 0.5 },
    { name: 'mango', cost: 0.5 },
    { name: 'grape', cost: 0.6,
        suppliers: { data: [
            { name: 'US', time: 5 },
            { name: 'UK', time: 4 }
        ]}
    }
]
var root = Dominic.create({
    className: 'root',
    id: 'root',
    parent: document.body,
    width: 300,
    height: 300,
    background: 'darkgreen',
    padding: 5,
    items: {
        // data source
        for: null,
        // update this when root.observe.data = src
        observeProp: 'data',
        tplFn: function (item, itemIdx) {
            return { tag: 'div', text: item.name, padding: 5, margin: '5px 0 0 5px', background: 'tomato',
                items: {
                    for: item.suppliers,
                    root: 'data', // specify which property to look for data
                    tplFn: function (sup, supIdx) {
                        return {
                            tag: 'div',
                            padding: 5,
                            background: 'lightblue',
                            text: sup.name + '. Time: ' + sup.time + ' days',
                            click: { scope: 'root', handler: 'onClickSupplier' }
                        }
                    }
                }
            }
        }
    },
    onClickSupplier: function (e) {
        // Do something
    },
    events: [
        { type: 'mouseout', handler: function (e) {
            console.log('Out of:', e.target)
        }}
    ]
})

// first change
root.observe.data = src
// add more value
root.observe.push('data', {
    name: 'mangox',
    cost: 0.5,
    suppliers: { data: [
        { name: 'Russia', time: 4 },
        { name: 'China', time: 5 }
    ]}
})
```
#### All template functions <a id="template4"></a>
* Only work when template data is array
* Now support multiple templates observing same property
* APIs:
  1. push (now real push, was previously reset)
  2. insert
  3. remove
  4. pop
  5. shift
  6. unshift
* Example:
```javascript
    /**
     * @param observeProperty {string}
     * @param data {any}
     */
    root.observe.push(observeProperty, data)
    /**
     * If index is absent, insert at the end, same behavior with push
     * @param index? {int}
     */
    root.observe.insert(observeProperty, index, data)
    /**
     * @param indexes {int[] | int}
     */
    root.observe.remove(observeProperty, indexes)
    /**
     * These following methods have same behavior like in an array
     */
    root.observe.pop(observeProperty)
    root.observe.shift(observeProperty)
    root.observe.unshift(observeProperty, data)
```

#### Component (v.0.1.42)
#### Basic 1 <a id="component1"></a>
```javascript
Dominic.register('input', function Input(defs) {
    return {
        tag: 'label',
        parent: defs.parent,
        display: 'block',
        items: [
            { tag: 'span', items: { tag: 'b', text: 'Label name:' } },
            { tag: 'input', placeholder: 'Choose label name' }
        ]
    }
})

Dominic.create({
    ctype: 'input',
    parent: document.body
})
```
###### Result
![](http://image.prntscr.com/image/9ce1ca1c21f44430beaa3c32e5cc5859.png)

#### Basic 2 <a id="component2"></a>
```javascript
// Define
Dominic.register('input', function Input(defs) {
    return {
        tag: 'label',
        display: 'block',
        items: [
            { tag: 'span', items: { tag: 'b', text: defs.label } },
            { tag: 'input', placeholder: 'Choose label name' }
        ]
    }
})
// Define
Dominic.register('tab', function Tab(defs) {
    var configs = {
        cls: 'd-tab-ct',
        parent: defs.parent,
        items: [
            { cls: 'd-tab-btns',
                defaults: {
                    tag: 'span',
                    display: 'inline-block',
                    height: 22,
                    padding: 4
                },
                items: {
                    for: defs.tabs,
                    observeProp: 'tabs',
                    tplFn: function(tab, i) {
                        return { text: tab.name }
                    }
                }
            },
            { cls: 'd-tab-tabs', items: {
                for: defs.tabs,
                observeProp: 'tabs',
                tplFn: function(tab, i) {
                    console.log('tab data is', tab)
                    // Usage
                    return { ctype: 'input', label: 'Tab number ' + i }
                }
            }},
        ]
    }
    if (defs.created)
        configs.created = defs.created
    if (defs.appended)
        configs.appended = defs.appended
    return configs
})

Dominic.create({
    ctype: 'tab',
    parent: document.body,
    tabs: [
        { name: 'Tab 1' },
        { name: 'Tab 2' },
        { name: 'Tab 3' }
    ],
    created: function() {
        console.log('finished initiating tab')
    },
    appended: function() {
        console.log('Now in document')
    }
})
```
###### Result
![](http://image.prntscr.com/image/aef511129257415085307e63bd09584d.png)

## Motivation
Prototyping some design and testing event/ interaction made a bit more convinient when
- No dependencies & everything in javascript
- There are Events & reference & template supports

## Installation <a id="install"></a>
```HTML
<script src="dominic.min.js"></script>
```
```javascript
npm i dominic
```

## API <a id="api"></a>

  1. Create new DOM element
```javascript
/**
 * @param defs {Object} opts options for root element, className, id, children etc... 
 * @return {DOM}
 */
Dominic.create(defs)
```
  2. Register a component
```javascript
/**
 * @param name {string} component name
 * @param fn {Function} function used by dominic to create component. should return an definition object
 */
Dominic.register(name, fn)
```

## Plan <a id="plan"></a>
- [x] Have mixed components and normal elements
- [ ] Have data binding/ linking
- [ ] Have diffing when updating in template
- [ ] Have basic layouts: `facebook`, `twitter`, `pinterest`
- [ ] Have basic components: `tab`, `combobox`, `table` 


## License <a id="license"></a>
.MIT
