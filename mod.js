let UNKNOWN = []

let isObject = (input) => input && typeof input === 'object'
let compare = (input) => (pattern) => {
  if (pattern === Boolean) return typeof input === 'boolean'
  if (pattern === String) return typeof input === 'string'
  if (pattern === Number) return typeof input === 'number'
  if (pattern === Symbol) return typeof input === 'symbol'
  if (pattern === BigInt) return typeof input === 'bigint'
  if (typeof pattern === 'function') return pattern(input)

  if (isObject(pattern)) {
    return (
      isObject(input) &&
      Object.keys(pattern).every((key) => compare(input[key])(pattern[key]))
    )
  }

  return Object.is(input, pattern)
}

export let match = (input, output = UNKNOWN) => ({
  with(...patterns) {
    let callback = patterns.pop()
    if (patterns.some(compare(input))) output = callback(input)
    return this
  },
  exhaustive(message) {
    if (output === UNKNOWN) throw Error(message)
    return output
  },
  otherwise(cb) {
    if (output === UNKNOWN) return cb(input)
    return output
  },
  run() {
    if (output === UNKNOWN) return
    return output
  },
})
