import {getFileContent, getDiff} from "./utils.js";

function genDiff({filepath1, filepath2, options= {}}) {
  const [file1, file2] = [filepath1, filepath2].map(getFileContent)
  const diff = getDiff(file1, file2)
  console.log('\n' + diff)
  return diff
}

export default genDiff
