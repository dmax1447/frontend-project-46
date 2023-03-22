import fs from 'fs'
import path from 'path'

function getFileContent(filepath) {
  const cwd = process.cwd()
  const fileType = path.extname(filepath).replace('.', '')
  const isAbsolutePath = path.isAbsolute(filepath)

  const content = fs.readFileSync(isAbsolutePath
    ? path.resolve(filepath) : path.resolve(cwd, path.normalize(filepath)))

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

function calculateDiff(obj1, obj2) {
  const merged = { ...obj1, ...obj2 }
  const normalaizedKeys = [...new Set(Object.keys(merged))]
    .sort((el1, el2) => (el1 > el2 ? 1 : -1))

  const diff = normalaizedKeys.reduce((acc, key) => {
    let newAcc = ''
    const hasKeyObj1 = Object.prototype.hasOwnProperty.call(obj1, key)
    const hasKeyObj2 = Object.prototype.hasOwnProperty.call(obj2, key)
    if (!hasKeyObj2) {
      newAcc = `${acc
      }  - ${key}: ${obj1[key]}\n`
    } else

    if (!hasKeyObj1) {
      newAcc = `${acc
      }  + ${key}: ${obj2[key]}\n`
    } else

    if (obj1[key] === obj2[key]) {
      newAcc = `${acc
      }    ${key}: ${obj1[key]}\n`
    } else {
      newAcc = `${acc
      }  - ${key}: ${obj1[key]}\n`
        + `  + ${key}: ${obj2[key]}\n`
    }
    return newAcc
  }, '\n')
  return `{${diff}}`
}

export { calculateDiff, getFileContent }
