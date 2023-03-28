import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';
import _ from 'lodash';

const baseIndent = '  '

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
      const shouldProcessChildren = values.every((v) => typeof v === 'object' && !Array.isArray(v))
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

function stringifyAst(ast, level, shift = 0) {
  const keys = Object.keys(ast)

  const formattedLevel = keys.reduce((acc, key) => {
    const nodeInfo = ast[key]
    const { state, value, hasChildren } = nodeInfo
    const indent = baseIndent.repeat(level) + baseIndent.repeat(shift)
    let newEntry = ''

    switch (state) {
      case 'new':
        newEntry = `\n${indent}+ ${key}: ${value}`
        break
      case 'deleted':
        newEntry = `\n${indent}- ${key}: ${value}`
        break
      case 'equal':
        newEntry = `\n${indent}  ${key}: ${value}`
        break
      case 'changed':
        if (!hasChildren) {
          newEntry = `\n${indent}- ${key}: ${value[0]}\n${indent}+ ${key}: ${value[1]}`
        } else {
          newEntry = `\n${indent}  ${key}: ${stringifyAst(value, level + 1, 1)}`
        }
        break
      default:
        break
    }

    return acc + newEntry
  }, '')
  let indent = baseIndent.repeat(level - 1)
  if (level > 1) {
    indent += '  '
  }
  return `{${formattedLevel}\n${indent}}`
}

function stylish(ast) {
  return stringifyAst(ast, 1)
}

export {
  calculateDiff, stylish, getFileContent, getFileType,
}
