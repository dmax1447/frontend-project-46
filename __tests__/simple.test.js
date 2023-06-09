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
};

test('getFileContent should return correct file content', () => {
  const content = getFileContent('./__fixtures__/read_test.txt');
  const expected = 'test\n';
  expect(content.toString()).toBe(expected);
});

test('getFileType should return correct file type', () => {
  const types = ['json', 'yml'];
  types.forEach((expectedType) => {
    const type = getFileType(`./__fixtures__/file1.${expectedType}`);
    expect(type).toBe(expectedType);
  });
});

test('parse should correct process all file types', () => {
  const extensions = ['json', 'yml'];
  extensions.forEach((extension) => {
    const content = getFileContent(`./__fixtures__/file1.${extension}`);
    const parsed = parse({ content, type: extension });
    expect(parsed).toStrictEqual(struct1);
  });
});

test('genDiff should generate correct output with "stylish" formatter', () => {
  const extensions = ['json', 'yml'];
  extensions.forEach((extension) => {
    const diffNested = genDiff(
      `./__fixtures__/file1n.${extension}`,
      `./__fixtures__/file2n.${extension}`,
    );
    const expectedDiffNested = getFileContent('./__fixtures__/log_nested.txt').toString();
    expect(diffNested.trim()).toBe(expectedDiffNested.trim());
  });
});

test('genDiff should generate correct output with "plain" formatter', () => {
  const extensions = ['json', 'yml'];
  extensions.forEach((extension) => {
    const diffPlain = genDiff(
      `./__fixtures__/file1n.${extension}`,
      `./__fixtures__/file2n.${extension}`,
      'plain',
    );
    const expectedDiffPlain = getFileContent('./__fixtures__/log_nested_plain.txt').toString();
    expect(diffPlain.trim()).toBe(expectedDiffPlain.trim());
  });
});

test('genDiff should generate correct output with "json" formatter', () => {
  const extensions = ['json', 'yml'];
  extensions.forEach((extension) => {
    const diffPlain = genDiff(
      `./__fixtures__/file1n.${extension}`,
      `./__fixtures__/file2n.${extension}`,
      'json',
    );
    const expectedDiffPlain = getFileContent('./__fixtures__/output.json').toString();
    expect(diffPlain.trim()).toBe(expectedDiffPlain.trim());
  });
});
