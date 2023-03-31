const baseIndent = '  '

const isObject = (obj) => obj !== null && typeof obj === 'object'
const stateSymbol = {
  new: '+',
  deleted: '-',
  equal: ' ',
}
function stringifyObject(obj, bodyIndentCount) {
  const keys = Object.keys(obj)
  const indent = baseIndent.repeat(bodyIndentCount)
  const keyIndent = baseIndent.repeat(bodyIndentCount + 2)
  const serializedKeys = keys.reduce((acc, key) => {
    const value = obj[key]
    const normalizedValue = isObject(value)
      ? stringifyObject(value, bodyIndentCount + 2)
      : value
    const entry = `\n${keyIndent}${key}: ${normalizedValue}`
    return acc + entry
  }, '')

  return `{${serializedKeys}\n${indent}}`
}

function stringifyAst(ast, bodyIndentCount) {
  const keys = Object.keys(ast)
  const indent = baseIndent.repeat(bodyIndentCount)
  const getEntry = (nodeInfo, entryKey) => {
    const { state, value, hasChildren } = nodeInfo
    const valueIsObject = isObject(value)
    const normalizeValue = (v) => (isObject(v) ? stringifyObject(v, bodyIndentCount + 1) : v)
    if (state === 'changed') {
      const normalizedValues = Array.isArray(value) ? value.map(normalizeValue) : value
      return hasChildren
        ? `\n${indent}  ${entryKey}: ${stringifyAst(value, bodyIndentCount + 2)}`
        : `\n${indent}- ${entryKey}: ${normalizedValues[0]}\n${indent}+ ${entryKey}: ${normalizedValues[1]}`
    }
    return valueIsObject ? `\n${indent}${stateSymbol[state]} ${entryKey}: ${stringifyObject(value, bodyIndentCount + 1)}` : `\n${indent}${stateSymbol[state]} ${entryKey}: ${value}`
  }

  const formattedLevel = keys.reduce((acc, key) => acc + getEntry(ast[key], key), '')
  const trialIndentCount = bodyIndentCount > 0 ? bodyIndentCount - 1 : 0
  const trialIndent = baseIndent.repeat(trialIndentCount)

  return `{${formattedLevel}\n${trialIndent}}`
}

export default {
  stylish(ast) {
    return stringifyAst(ast, 1)
  },
}
