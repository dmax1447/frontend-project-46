import _ from 'lodash';

const struct1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
  nested_deleted: {
    property2: 'some value 2',
  },
  nested_changed: {
    equal_key: 'val',
    deleted_key: 'val1',
    changed_key: 'old_val',
  },
}

const struct2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
  nested_new: {
    property1: 'some value',
  },
  nested_changed: {
    equal_key: 'val',
    new_key: 'val3',
    changed_key: 'new_val',
  },
}

function calcDiff(obj1, obj2) {
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
      const shouldProcessChildren = values.every((v) => typeof v === 'object' && !Array.isArray(v))
      node.state = 'changed'
      if (shouldProcessChildren) {
        node.hasChildren = true
        node.value = calcDiff(obj1[key], obj2[key])
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

const ast = calcDiff(struct1, struct2)
console.dir(ast)
