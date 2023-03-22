import parseFile from './parsers.js';
import { calculateDiff, getFileContent, getFileType } from './utils.js';

function genDiff({ filepath1, filepath2 }) {
  const [struct1, struct2] = [filepath1, filepath2]
    .map((filepath) => ({ type: getFileType(filepath), content: getFileContent(filepath) }))
    .map(({ type, content }) => parseFile({ content, type }))
  const diff = calculateDiff(struct1, struct2)
  return diff
}

export default genDiff
