import stylish from './stylish.js';
import plain from './plain.js';

export default (type) => {
  let formatter
  switch (type) {
    case 'plain':
      formatter = plain
      break
    default:
      formatter = stylish
      break
  }
  return formatter
}
