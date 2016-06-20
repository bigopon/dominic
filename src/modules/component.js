import { defProp, defProps, has, createDict, isPlain } from './object'
import { isFn } from './check'

var registered = createDict()
var Component = createDict()
defProps(Component, {
    register: {
        value: function(name, create) {
            if (has(registered, name))
                throw Error('Name already registered')
            // if (!isPlain(definitions))
            //     throw Error('Not valid definitions')
            if (!isFn(create))
                throw Error('Not valid definitions')
            defProp(registered, name, {
                value: createDict({
                    create
                })
            })
            return this
        }
    },
    get: {
        value: function(name) {
            if (!registered[name])
                throw Error('No component registered')
            return registered[name]
        }
    }
})

export { Component }
