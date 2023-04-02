import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (type) => {
  let formatter
  switch (type) {
    case 'plain':
      formatter = plain
      break
    case 'json':
      formatter = json
      break
    default:
      formatter = stylish
      break
  }
  return formatter
}
