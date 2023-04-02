function processAst(ast, parentPath) {
  const keys = Object.keys(ast)
  const formattedLevel = keys.reduce((acc, key) => {
    const node = ast[key]
    const path = [...parentPath, key]
    const { state, value, hasChildren } = node
    if (state === 'equal') return acc
    let entry
    if (hasChildren) {
      entry = processAst(value, path)
    } else {
      entry = {
        path: path.join('.'),
        state,
        value,
      }
    }

    return [...acc, entry]
  }, [])
  return formattedLevel
}

export default (ast) => JSON.stringify(processAst(ast, []))
