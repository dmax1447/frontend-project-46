function processAst(ast, parentPath) {
  const keys = Object.keys(ast)
  const formattedLevel = keys.reduce((acc, key) => {
    const node = ast[key]
    const path = [...parentPath, key]
    const { state, value, hasChildren } = node
    if (state === 'equal') return acc
    if (hasChildren) {
      return [...acc, processAst(value, path)]
    }
    const entry = {
      path: path.join('.'),
      state,
      value,
    }
    return [...acc, entry]
  }, [])
  return formattedLevel
}

export default (ast) => JSON.stringify(processAst(ast, []))
