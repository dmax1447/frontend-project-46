import { test, expect } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { calculateDiff, getFileContent, getFileType } from '../src/utils.js';
import parse from '../src/parsers.js';
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

test('parse should correct process JSON', () => {
  const content = getFileContent('./__fixtures__/file1.json')
  const parsed = parse({ content, type: 'json' })
  expect(parsed).toStrictEqual(struct1)
})

test('parse should correct process YAML', () => {
  const content = getFileContent('./__fixtures__/file1.yml')
  const parsed = parse({ content, type: 'yml' })
  expect(parsed).toStrictEqual(struct1)
})

test('genDiff should generate correct diff from JSON files', () => {
  const diff = genDiff({ filepath1: './__fixtures__/file1.json', filepath2: './__fixtures__/file2.json' })
  expect(diff).toBe(diffExpected)
})

test('genDiff should generate correct diff from YML files', () => {
  const diff = genDiff({ filepath1: './__fixtures__/file1.yml', filepath2: './__fixtures__/file2.yml' })
  expect(diff).toBe(diffExpected)
})
