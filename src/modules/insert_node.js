function insertBefore(parent, node, stop) {
    if (stop)
        parent.insertBefore(node, stop)
    else
        parent.appendChild(node)
}

function insertAfter(root, el, start) {
    var nextEl = start.nextSibling
    insertBefore(root, el, nextEl)
}

export { insertBefore, insertAfter }