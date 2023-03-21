// import {getDiff} from "../src/gendiff.js";

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
  return `
  {
    ${diff}
  }
  `
}

const file1 = {
  "host": "hexlet.io",
  "timeout": 50,
  "proxy": "123.234.53.22",
  "follow": false
}

const file2 = {
  "timeout": 20,
  "verbose": true,
  "host": "hexlet.io"
}

const diff1 = getDiff(file1, file2) //?

console.log(diff1)
