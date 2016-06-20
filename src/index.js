import { createDict, has, isPlain, defProps } from './modules/object'
import { query, queryDirect, queryLastDirect, queryAll, queryAllDirect, queryAllByMultipleKeys } from './modules/query'
import { attachEvent } from './modules/event'
import { Component } from './modules/component'
import { create } from './modules/create'

var Dominic = createDict()
defProps(Dominic, {
    create: {
        value: create
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
        value: function(name, creator) {
            Component.register(name, creator)
            return this
        }
    }
})

export default Dominic