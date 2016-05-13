## Dominic
Helper to quickly build up dom in javascript object format

Basic feature list:

 * Basic dom construction by javascript object format
 * Event
 * Template by function


And here's some code! :+1:

#### Basic
```javascript
var root = CreateElement('div', {
  className: 'root',
  parent: document.body,
  width: 300,
  height: 300,
  background: 'darkgreen',
  items: [
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
##### Result
![alt tag](http://img.prntscr.com/img?url=http://i.imgur.com/XFBYYe4.png)

#### Reference
```javascript
var root = CreateElement('div', {
  className: 'root',
  parent: document.body,
  width: 300,
  height: 300,
  background: 'darkgreen',
  items: [
    { tag: 'div', width: 50, height: 50, text: 'Intro', display: 'inline-block', background: 'yellowgreen' },
    { tag: 'div', width: 200, background: 'lightgreen',
      items: [
       { tag: 'div', width: 20, height: 20, background: 'red',
         ref: 'lightgreen' // access by root.refs.lightgreen
       },
       { tag: 'div', width: 20, height: 20, background: 'orange', ref: 'orange',
         ref: 'orange', refScope: 'parent' // access by root.refs.orange.refs.orange
       },
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

#### Events
```javascript
var root = CreateElement('div', {
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

#### Template
```javascript
var root = CreateElement('div', {
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
            return { tag: 'div', padding: 5, background: 'lightblue', text: sup.name + '. Time: ' + sup.time + ' days' }
          }
        }
      }
    }
  }
})
```
#### Result
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
var root = CreateElement('div', {
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
    // 
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
              click: { scope: 'this', handler: 'onClickSupplier' }
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
```javascript
CreateElement(name, opts)
name: String
opts: Object
```

## Plan
- [ ] Support server side rendering (to Html string)
- [ ] Proper event delegation with CSS selector (Working but not nice)

## License
.MIT
