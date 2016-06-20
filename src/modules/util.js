import { each } from './collection'

const wordRegex = /\w+/gi
const startUpperCaseRegex = /([A-Z])/g
const fakeArray = []

function toBool(val) {
    return !!(typeof val === 'function' ? val() : val)
}
function c2d(str) {
    return str.replace(startUpperCaseRegex, '-$1').toLowerCase()
}
function d2c(str) {
    return str.toLowerCase().match(wordRegex).map(function(s, i) {
        return i ? s[0].toUpperCase() + s.substr(1) : s
    }).join('')
}
function toSelector(dom) {
    var id = dom.id ? '#' + dom.id : '',
        clsStr = dom.classList.toString(),
        classes = clsStr ? clsStr.split(' ') : fakeArray,
        selector = dom.localName + id + (classes.length ? ('.' + classes.join('.')) : '')
    return selector
}
function toStringNode(node) {
    var name = node.localName ? (node.localName + '\n\t>') : '',
        childNodes = node.childNodes
    for (var i = 0, len = childNodes.length; i < len; i++) {
        var child = childNodes[i]
        name += toStringNode(child)
    }
    return name
}
export { toStringNode, toSelector, toBool, c2d, d2c }

