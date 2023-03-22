import { test, expect } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { calculateDiff, getFileContent } from '../src/utils.js';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const struct1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
}

const struct2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
}

const diffExpected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`

test('calculateDiff should generate correct diff from objects', () => {
  const diff = calculateDiff(struct1, struct2)
  expect(diff).toBe(diffExpected);
})

test('getFileContent should return correct content for JSON file', () => {
  const content = getFileContent(getFixturePath('file1.json'))
  expect(content).toStrictEqual(struct1)
})

test('genDiff should generate correct diff from JSON files', () => {
  const filepath1 = getFixturePath('file1.json')
  const filepath2 = getFixturePath('file2.json')
  const diff = genDiff({ filepath1, filepath2 })
  expect(diff).toBe(diffExpected)
})
