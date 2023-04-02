const isObject = (obj) => obj !== null && typeof obj === 'object';

const stateToActionName = {
  new: 'was added with value:',
  deleted: 'was removed',
  changed: 'was updated.',
};

function stringifyPlain(ast, parentPath) {
  const getNormalaizedValue = (node) => {
    const { value, state } = node;
    const normalizeValue = (val) => {
      if (isObject(val)) {
        return '[complex value]';
      }
      if (typeof val === 'string') {
        return `'${val}'`;
      }
      return val;
    };

    switch (state) {
      case 'new':
        return `${normalizeValue(value)}`;
      case 'deleted':
        return '';
      case 'changed':
        return `From ${normalizeValue(value[0])} to ${normalizeValue(value[1])}`;
      default:
        return '';
    }
  };

  const keys = Object.keys(ast);
  const formattedLevel = keys.reduce((acc, key) => {
    const node = ast[key];
    const path = [...parentPath, key];
    const { state, value, hasChildren } = node;
    if (state === 'equal') return acc;
    if (hasChildren) {
      return acc + stringifyPlain(value, path).trimEnd();
    }
    return acc + `\nProperty '${path.join('.')}' ${stateToActionName[node.state]} ${getNormalaizedValue(node)}`.trimEnd();
  }, '');
  return formattedLevel;
}

export default (ast) => stringifyPlain(ast, []).trim();
