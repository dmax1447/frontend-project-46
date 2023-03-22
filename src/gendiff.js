import { getFileContent, calculateDiff } from './utils.js';

function genDiff({ filepath1, filepath2 }) {
  const [file1, file2] = [filepath1, filepath2].map(getFileContent)
  const diff = calculateDiff(file1, file2)
  return diff
}

export default genDiff
