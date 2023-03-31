import parseFile from './parsers.js';
import {
  calculateDiff, getFileContent, getFileType,
} from './utils.js';
import formatters from './formatters.js';

function genDiff({ filepath1, filepath2, options = { format: 'stylish' } }) {
  const { format } = options
  const formatter = formatters[format]
  const [struct1, struct2] = [filepath1, filepath2]
    .map((filepath) => ({ type: getFileType(filepath), content: getFileContent(filepath) }))
    .map(({ type, content }) => parseFile({ content, type }))
  const ast = calculateDiff(struct1, struct2)
  const diff = formatter(ast)
  return diff
}

export default genDiff
