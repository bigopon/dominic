## Dominic
Helper to quickly build up dom in javascript object format

Basic feature list:

 * Just dom
 * Basic dom construction by javascript object format
 * Event
 * Template by function
 * Server side render to Html (with helper, see API)


And here's some code! :+1:

#### Basic 1:
```javascript
var root = Dominic.createElement('div', {
  cls: 'root', // or cls: 'root' | cls as alias for className
  parent: document.body,
  width: 300,
  height: 300,
  background: 'darkgreen',
  // items can be replace with children
  items: [
    // also accept string, number as children, will be converted to text node
    { tag: 'div', width: 50, height: 50, text: 'Intro', display: 'inline-block', background: 'yellowgreen' },
    { tag: 'div', width: 200, background: 'lightgreen',
      items: [
       { tag: 'div', width: 20, height: 20, background: 'red' },
       { tag: 'div', width: 20, height: 20, background: 'orange' },
      ]
    }
  ],
  created: function () {
    // called when finished every setup
  },
  appended: function () {
    // called when
    // 1. element is root (created by CreateElement)
    // 2. parent is Node and appended element successfully
  }
})
```
###### Result
![alt tag](http://img.prntscr.com/img?url=http://i.imgur.com/XFBYYe4.png)

###### Styling
* `width`, `height`, `minHeight`, `maxHeight`,  `minWidth`, `maxWidth`
* `margin`, `padding`, `margin` and `padding` + `(Top - Left - Right - Bottom)`
 will be converted to proper CSS value if value is number

#### Basic 2: Function as item & div all the elements
* Tag name is 'div' by default
```javascript
var outerScopeDataSource = [
  { name: 'yellow' },
  { name: 'green' },
  { name: 'pink' }
]
var root = Dominic.createElement('div', {
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

#### Basic 3a: Share configs
```javascript
var root = Dominic.createElement('div', {
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

#### Basic 3b: Share configs with extra class
`xtraCls`, `xCls`: `string`
```javascript
var root = Dominic.createElement('div', {
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

#### Basic 4: Condition `if`/ `hide`
```javascript
var root = Dominic.createElement('div', {
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


#### Attributes
```javascript
var root = Dominic.createElement('div', {
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

#### Reference
```javascript
var root = Dominic.createElement('div', {
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

#### Events 1:
Reserved keyword for events:
* Mouse: `click` `mousedown` `mouseup` `mouseover` `mouseout` `mouseenter` `mouseleave` `mousemove`
* Drag: `dragstart` `dragend` `drag` `dragover` `dragenter` `dragout` `drop`
* Focus: `blur` `focus` 
* Keyboard: `keydown` `keypress` `keyup`
* Form: `change` `input` `submit`
* Touch: `touchstart` `touchmove` `touchend`
* Scroll: `wheel` `scroll`

```javascript
var root = Dominic.createElement('div', {
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
         click: {
           handler: function (e) {
             console.log('This is:', this.localName + '.' + this.className) // div.red
           }
         }
       },
       { tag: 'div', className: 'orange', width: 20, height: 20, background: 'orange',
         click: {
           scope: 'root',
           handler: function (e) {
             console.log('This is:', this.localName + '.' + this.className) // div.root
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

#### Events 2: Delegate
```javascript
var root = Dominic.createElement('div', {
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

#### Events 3: Key code hook
- Only trigger key event with specified key codes
```javascript
var root = Dominic.createElement('div', {
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

#### Template
1. `for`: data source
2. `TplFn`: function (item, itemIndex)
* If data source provided is an array, item is record of array and itemIndex is record index
* If data source provided is an object, item is data object and itemIndex will be undefined

```javascript
var root = Dominic.createElement('div', {
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
      { name: 'grape', cost: 0.6, suppliers: {
        data: [
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

#### Template with data change reaction
```javascript
var src = [
  { name: 'apple', cost: 0.5 },
  { name: 'mango', cost: 0.5 },
  { name: 'grape', cost: 0.6, suppliers: {
    data: [
      { name: 'US', time: 5 },
      { name: 'UK', time: 4 }
    ]}
  }
]
var root = Dominic.createElement('div', {
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
    update: {
      // update this when root.observe.data = src
      observeProp: 'data'
    },
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
root.observe.push('data', { name: 'mangox', cost: 0.5, suppliers: {
  data: [
    { name: 'Russia', time: 4 },
    { name: 'China', time: 5 }
  ]
}})
```

## Motivation
Prototyping some design and testing event/ interaction made a bit more convinient when
- No dependencies & everything in javascript
- There are Events & reference & template supports

## Installation
```HTML
<script src="dominic.min.js"></script>
```
```javascript
npm i dominic
```

## API

1. Create new DOM element
```javascript
/**
 * @param {String} name tag name of the root dom element
 * @param {Object} opts options for root element, className, id, children etc... 
 * @return {DOM}
 */
Dominic.createElement(name, opts)
```
2. `For Node:` Change global window object
```javascript
Dominic.setWindow(windowObj)
```
* window obj must have:
- Node class with same behavior of a normal HTML element (`appendChild`, `removeChild`, `etc...`)
- document with `createElement`, `createTextNode` methods which will create Node or TextNode
* Suggestion: `fakecument`: `npm i fakecument`
```javascript
var fakecument = require('fakecument')
var Dominic = require('dominic')

Dominic.setWindow(fakecument)
var root = Dominic.createElement('div', {
  className: 'abcd',
  children: [
    { tag: 'div', text: 'hello' }
  ]
})
console.log('' + root)
// <div class="abcd"><div>hello</div></div>
```

## Plan
- [ ] Have basic layouts: `facebook`, `twitter`, `pinterest`
- [ ] Have basic components: `tab`, `combobox`, `table` 


## License
.MIT
