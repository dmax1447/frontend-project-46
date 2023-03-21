import fs from 'fs'
import path from 'path'

function getFileContent(filepath) {
  const cwd = process.cwd()
  const fileType = path.extname(filepath).replace('.', '')
  const isAbsolutePath = path.isAbsolute(filepath)

  let content
  try {
    content = fs.readFileSync(isAbsolutePath ? path.resolve(filepath) : path.resolve(cwd, path.normalize(filepath)))
  } catch (e) {
    console.log(e)
    throw new Error('error reading file')
  }

  let parsed
  switch (fileType) {
    case 'json':
      parsed = JSON.parse(content)
      break
    default:
      throw new Error('not supported file type')
  }
  return parsed
}

function getDiff(obj1, obj2) {
  const merged = Object.assign({}, obj1, obj2)
  const normalaizedKeys = [...new Set(Object.keys(merged))]
    .sort((el1, el2) => el1 > el2 ? 1 : -1)
  normalaizedKeys
  const diff = normalaizedKeys.reduce((acc, key) => {
    let newAcc = ''
    const hasKeyObj1 = obj1.hasOwnProperty(key)
    const hasKeyObj2 = obj2.hasOwnProperty(key)
    if (!hasKeyObj2) {
      newAcc = acc +
        `  - ${key}: ${obj1[key]}\n`
    } else

    if (!hasKeyObj1) {
      newAcc = acc +
        `  + ${key}: ${obj2[key]}\n`

    } else

    if (obj1[key] === obj2[key]) {
      newAcc = acc +
        `    ${key}: ${obj1[key]}\n`
    } else {
      newAcc = acc +
        `  - ${key}: ${obj1[key]}\n` +
        `  + ${key}: ${obj2[key]}\n`
    }
    return newAcc
  }, '\n')
  return `{${diff}}`
}

export {getDiff, getFileContent}
