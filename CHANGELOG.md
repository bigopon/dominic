0.1.47 / 2016-06-23
==================
* Add `finishCount: string|function` to events.
  This is to help have one final action after finish the count

```javascript
// This fake game is to show the purpose of [finishCount] together with [count] and [validator]
var root = Dominic.create({
    cls: 'root',
    parent: document.body,
    point: 0,
    items: [
        { tag: 'input', placeholder: 'Choose a name to start the game...',
            display: 'block',
            width: 300,
            keydown: { scope: 'root', handler: 'sayHelo', key: 13,
                count: 1,
                validator: function(e) {
                    return e.target.value
                },
                // start the game after input name
                finishCount: function hideInput(e) {
                    e.target.style.display = 'none'
                    this.guessInput.disabled = false
                    this.guessInput.focus()
                }
            }
        },
        { tag: 'input',
            cls: 'guess-name',
            // use directRef for faster reference
            directRef: 'guessInput',
            placeholder: 'Guess the name 3 times...',
            // dont let user guess when they haven't entered name
            disabled: true
        }
    ],
    keydown: {
        delegate: '.guess-name',
        // only execute handler 3 times
        count: 3,
        // put a validator to avoid user mistakenly guess empty name
        // or user haven't submitted a name to start the game
        validator: 'validateGuess',
        // call this on every guess
        handler: 'onGuess',
        // if finished 3 tries, call this
        finishCount: 'gameFinish',
        // only guess when hit enter key
        key: 13
    },
    sayHelo: function (e) {
        this.name = e.target.value
        console.log('helo', e.target.value, '\nLets start')
    },
    validateGuess: function(e, match) {
        // e.target === this.guessInput === match
        return match.value
    },
    onGuess: function(e, match) {
        console.log('Your guess:', match.value)
        var point = match.value === this.name ? 1 : 0
        console.log('You got:', point, 'point')
        this.point += point
        // empty input to guess new round
        match.value = ''
    },
    gameFinish: function(e, match) {
        console.log('----\nFinish.\nYour points:', this.point)
        if (this.point < 3)
            return console.info('Game over. Did you type in the name?')
        console.info('You won!!!')
        // disable to make it look like a game
        match.disabled = true
    }
})
```
* Fix bug `hide` did not set display component / element to `none`

0.1.46 / 2016-06-23
==================
* Add counter and validator to event `counter: int`, `validator: string|function`
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
* Improve readme

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
