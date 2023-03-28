import parseFile from './parsers.js';
import {
  calculateDiff, stylish, getFileContent, getFileType,
} from './utils.js';

function genDiff({ filepath1, filepath2 }) {
  const [struct1, struct2] = [filepath1, filepath2]
    .map((filepath) => ({ type: getFileType(filepath), content: getFileContent(filepath) }))
    .map(({ type, content }) => parseFile({ content, type }))
  const ast = calculateDiff(struct1, struct2)
  const diff = stylish(ast)
  return diff
}

export default genDiff
