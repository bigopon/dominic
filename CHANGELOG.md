0.1.45 / 2016-06-22
==================
* Auto assign reference to component definitions before create
```javascript
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
        // component can be accessed via root.refs.nameInput
        // previously have to define ref in component definitions
        { ctype: 'input', ref: 'nameInput', label: 'Name: ' },
        // accessed via root.nameInput2
        { ctype: 'input', directRef: 'nameInput2', label: 'Name 2: ' }
    ]
})
```
* Add to readme what style rules will be directly applied to element's styles without
 the need of putting them in a style object

0.1.44 / 2016-06-21
==================
* Change to created callback. Now call with 2 params (element itself and the root)
* Add config to make direct reference to element from root via `directRef: refName'`
  usage: `root[refName]` instead of `root.refs[refName]` for reference.
  Notice: el with `ref` will ignore `directRef` 
* Fix bug in query function

0.1.42 / 2016-06-19
==================
  * Added changelog
  * Temporarily remove ability to render on server (was broken anyway)
  * Refactored with some breaking changes
- Element not created by Dominic will not take defaults configs from parent.
    This was supported in 0.1.41
- API changed to `Dominic.create` from `Dominic.createElement`. This
    is to make it easier when combine with creating component
  * #### Creating children with template now have more helpers
1. push (now real push, previous was reset)
2. insert
3. remove
4. pop
5. shift
6. unshift
  * #### Support multiple templates observing same property
  * #### Now support predefined component to help avoid some repeatitive
1. `Dominic.register(name, creatorFunction)`
2. `Dominic.create({ ctype: 'component-name' })`
