import jsYaml from 'js-yaml';

function parse({ content, type }) {
  const parser = type === 'json' ? JSON.parse : jsYaml.load;
  return parser(content);
}

export default parse;
