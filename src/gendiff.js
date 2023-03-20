import fs from 'fs'
import path from 'path'

function getFileContent(filepath) {
  const cwd = process.cwd()
  const fileType = path.extname(filepath).replace('.', '')
  const isAbsolutePath = path.isAbsolute(filepath)
  const content = fs.readFileSync(isAbsolutePath ? path.resolve(filepath) : path.resolve(cwd, path.normalize(filepath)))
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

function genDiff({filepath1, filepath2, options= {}}) {
  const parsedFiles = [filepath1, filepath2].map(getFileContent)
  console.log(parsedFiles)
}

export default genDiff
