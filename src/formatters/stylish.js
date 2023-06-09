const baseIndent = '  ';

const isObject = (obj) => obj !== null && typeof obj === 'object';
const stateSymbol = {
  new: '+',
  deleted: '-',
  equal: ' ',
};

function stringifyObject(obj, bodyIndentCount) {
  const keys = Object.keys(obj);
  const indent = baseIndent.repeat(bodyIndentCount);
  const keyIndent = baseIndent.repeat(bodyIndentCount + 2);
  const serializedKeys = keys.reduce((acc, key) => {
    const value = obj[key];
    const normalizedValue = isObject(value)
      ? stringifyObject(value, bodyIndentCount + 2)
      : value;
    const entry = `\n${keyIndent}${key}: ${normalizedValue}`;
    return acc + entry;
  }, '');

  return `{${serializedKeys}\n${indent}}`;
}

function stringifyAst(ast, bodyIndentCount) {
  const keys = Object.keys(ast);
  const indent = baseIndent.repeat(bodyIndentCount);
  const getEntry = (nodeInfo, entryKey) => {
    const { state, value, hasChildren } = nodeInfo;
    const normalizeValue = (v) => (isObject(v) ? stringifyObject(v, bodyIndentCount + 1) : v);
    const normalizedValues = Array.isArray(value) ? value.map(normalizeValue) : value;
    switch (state) {
      case 'changed':
        if (hasChildren) {
          return `\n${indent}  ${entryKey}: ${stringifyAst(value, bodyIndentCount + 2)}`;
        }
        return `\n${indent}- ${entryKey}: ${normalizedValues[0]}\n${indent}+ ${entryKey}: ${normalizedValues[1]}`;
      default:
        return isObject(value)
          ? `\n${indent}${stateSymbol[state]} ${entryKey}: ${stringifyObject(value, bodyIndentCount + 1)}`
          : `\n${indent}${stateSymbol[state]} ${entryKey}: ${value}`;
    }
  };

  const formattedLevel = keys.reduce((acc, key) => acc + getEntry(ast[key], key), '');
  const trialIndent = baseIndent.repeat(bodyIndentCount - 1);

  return `{${formattedLevel}\n${trialIndent}}`;
}

export default (ast) => stringifyAst(ast, 1);
