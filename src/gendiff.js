import parseFile from './parsers.js';
import {
  getFileContent, getFileType,
} from './utils.js';
import calculateDiff from './processors.js'
import getFormatter from './formatters/index.js';

function genDiff(filepath1, filepath2, format) {
  const formatter = getFormatter(format)
  const [struct1, struct2] = [filepath1, filepath2]
    .map((filepath) => ({ type: getFileType(filepath), content: getFileContent(filepath) }))
    .map(({ type, content }) => parseFile({ content, type }))
  const ast = calculateDiff(struct1, struct2)
  const diff = formatter(ast)
  return diff
}

export default genDiff
