import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';

function getFileContent(filepath = '') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const normalizedPath = path.join(__dirname, '..', filepath)
  return fs.readFileSync(normalizedPath)
}
function getFileType(filepath = '') {
  const extensionToType = {
    yaml: 'yml',
    yml: 'yml',
    json: 'json',
  }

  const filetype = path.extname(filepath).replace('.', '')
  return extensionToType[filetype.toLowerCase()]
}

export { getFileContent, getFileType }
