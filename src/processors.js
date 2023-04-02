import _ from 'lodash';

function calculateDiff(obj1, obj2) {
  const merged = { ...obj1, ...obj2 }
  const normalizedKeys = [...new Set(Object.keys(merged))]
    .sort((el1, el2) => (el1 > el2 ? 1 : -1))
  const ast = normalizedKeys.reduce((acc, key) => {
    const type = typeof key
    const node = {
      type,
    }
    const hasKeyObj1 = Object.prototype.hasOwnProperty.call(obj1, key)
    const hasKeyObj2 = Object.prototype.hasOwnProperty.call(obj2, key)
    const isNewKey = hasKeyObj2 && !hasKeyObj1
    const isDeletedKey = hasKeyObj1 && !hasKeyObj2
    const isBothExistedKey = hasKeyObj1 && hasKeyObj2

    if (isNewKey) {
      node.state = 'new'
      node.value = obj2[key]
    } else
    if (isDeletedKey) {
      node.state = 'deleted'
      node.value = obj1[key]
    } else
    if (isBothExistedKey && _.isEqual(obj1[key], obj2[key])) {
      node.state = 'equal'
      node.value = obj1[key]
    } else {
      const values = [obj1[key], obj2[key]]
      const shouldProcessChildren = values.every((v) => v !== null && typeof v === 'object' && !Array.isArray(v))
      node.state = 'changed'
      if (shouldProcessChildren) {
        node.hasChildren = true
        node.value = calculateDiff(obj1[key], obj2[key])
      } else {
        node.value = [obj1[key], obj2[key]]
      }
    }
    return {
      ...acc,
      [key]: node,
    }
  }, {})
  return ast
}

export default calculateDiff
