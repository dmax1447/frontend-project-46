import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';

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

export { calculateDiff, getFileContent, getFileType }
