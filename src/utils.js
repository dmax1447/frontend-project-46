import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';
import _ from 'lodash';

const baseIndent = '  '

const isObject = (obj) => obj !== null && typeof obj === 'object'
const stateSymbol = {
  new: '+',
  deleted: '-',
  equal: ' ',
}

function getFileContent(filepath) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const normalizedPath = path.join(__dirname, '..', filepath)
  return fs.readFileSync(normalizedPath)
}
function getFileType(filepath) {
  const extensionToType = {
    yaml: 'yml',
    yml: 'yml',
    json: 'json',
  }

  const filetype = path.extname(filepath).replace('.', '')
  return extensionToType[filetype.toLowerCase()]
}

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

  const formattedLevel = keys.reduce((acc, key) => {
    const indent = baseIndent.repeat(bodyIndentCount)

    const getEntry = (nodeInfo) => {
      const { state, value, hasChildren } = nodeInfo
      const valueIsObject = isObject(value)
      const normalizeValue = (v) => (isObject(v) ? stringifyObject(v, bodyIndentCount + 1) : v)

      if (state === 'changed') {
        const normalizedValues = Array.isArray(value) ? value.map(normalizeValue) : value
        return hasChildren
          ? `\n${indent}  ${key}: ${stringifyAst(value, bodyIndentCount + 2)}`
          : `\n${indent}- ${key}: ${normalizedValues[0]}\n${indent}+ ${key}: ${normalizedValues[1]}`
      }
      return valueIsObject ? `\n${indent}${stateSymbol[state]} ${key}: ${stringifyObject(value, bodyIndentCount + 1)}` : `\n${indent}${stateSymbol[state]} ${key}: ${value}`
    }

    return acc + getEntry(ast[key])
  }, '')

  const trialIndentCount = bodyIndentCount > 0 ? bodyIndentCount - 1 : 0
  const trialIndent = baseIndent.repeat(trialIndentCount)

  return `{${formattedLevel}\n${trialIndent}}`
}

function stylish(ast) {
  return stringifyAst(ast, 1)
}

export {
  calculateDiff, stylish, getFileContent, getFileType, stringifyObject,
}
