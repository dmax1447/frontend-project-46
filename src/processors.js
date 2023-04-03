import _ from 'lodash';

function calculateDiff(obj1, obj2) {
  const merged = { ...obj1, ...obj2 };
  const normalizedKeys = _.sortBy([...new Set(Object.keys(merged))]);
  const ast = normalizedKeys.reduce((acc, key) => {
    const hasKeyObj1 = Object.prototype.hasOwnProperty.call(obj1, key);
    const hasKeyObj2 = Object.prototype.hasOwnProperty.call(obj2, key);
    const isNewKey = hasKeyObj2 && !hasKeyObj1;
    const isDeletedKey = hasKeyObj1 && !hasKeyObj2;
    const isBothExistedKey = hasKeyObj1 && hasKeyObj2;

    if (isNewKey) {
      return {
        ...acc,
        [key]: {
          state: 'new',
          value: obj2[key],
        },
      };
    }
    if (isDeletedKey) {
      return {
        ...acc,
        [key]: {
          state: 'deleted',
          value: obj1[key],
        },
      };
    }
    if (isBothExistedKey && _.isEqual(obj1[key], obj2[key])) {
      return {
        ...acc,
        [key]: {
          state: 'equal',
          value: obj1[key],
        },
      };
    }
    const values = [obj1[key], obj2[key]];
    const shouldProcessChildren = values.every((v) => v !== null && typeof v === 'object' && !Array.isArray(v));

    return {
      ...acc,
      [key]: {
        state: 'changed',
        hasChildren: shouldProcessChildren,
        value: shouldProcessChildren ? calculateDiff(...values) : values,
      },
    };
  }, {});
  return ast;
}

export default calculateDiff;
