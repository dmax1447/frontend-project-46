import { test, expect } from '@jest/globals';
import {
  getFileContent, getFileType,
} from '../src/utils.js';
import parse from '../src/parsers.js';
import genDiff from '../src/gendiff.js';

const struct1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
}

test('getFileContent should return correct file content', () => {
  const content = getFileContent('./__fixtures__/read_test.txt')
  const expected = 'test\n'
  expect(content.toString()).toBe(expected);
})

test('getFileType should return correct file type', () => {
  const types = ['json', 'yml']
  types.forEach((expectedType) => {
    const type = getFileType(`./__fixtures__/file1.${expectedType}`)
    expect(type).toBe(expectedType);
  })
})

test('parse should correct process all file types', () => {
  const extensions = ['json', 'yml']
  extensions.forEach((extension) => {
    const content = getFileContent(`./__fixtures__/file1.${extension}`)
    const parsed = parse({ content, type: extension })
    expect(parsed).toStrictEqual(struct1)
  })
})

test('genDiff should generate correct diff for all file types with plain objects', () => {
  const extensions = ['json', 'yml']
  extensions.forEach((extension) => {
    const diff = genDiff({
      filepath1: `./__fixtures__/file1.${extension}`,
      filepath2: `./__fixtures__/file2.${extension}`,
    })
    const expectedOutput = getFileContent('./__fixtures__/log_simple.txt').toString()
    expect(diff.trim()).toBe(expectedOutput.trim())
  })
})

test('genDiff should generate correct diff for all file types with nested objects', () => {
  const extensions = ['json', 'yml']
  extensions.forEach((extension) => {
    const diff = genDiff({
      filepath1: `./__fixtures__/file1n.${extension}`,
      filepath2: `./__fixtures__/file2n.${extension}`,
    })
    const expectedOutput = getFileContent('./__fixtures__/log_nested.txt').toString()
    expect(diff.trim()).toBe(expectedOutput.trim())
  })
})
