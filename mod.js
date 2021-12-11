let PRIMITIVES = [Number, String, BigInt, Symbol, Boolean]

export let is = (type) => (input) =>
  input != null &&
  (type === Object ? typeof input === 'object' : Object(input) instanceof type)

let compare = (input) => (pattern) => {
  if (typeof pattern === 'function') {
    return PRIMITIVES.includes(pattern) ? is(pattern)(input) : pattern(input)
  }

  if (is(Object)(pattern)) {
    return (
      is(Object)(input) &&
      Object.keys(pattern).every((key) => compare(input[key])(pattern[key]))
    )
  }

  return Object.is(input, pattern)
}

export let match = (input, output = PRIMITIVES) => ({
  with(...patterns) {
    let callback = patterns.pop()
    if (patterns.some(compare(input))) output = callback(input)
    return this
  },
  exhaustive(message) {
    if (output === PRIMITIVES) throw Error(message)
    return output
  },
  otherwise(cb) {
    if (output === PRIMITIVES) return cb(input)
    return output
  },
  run() {
    if (output === PRIMITIVES) return
    return output
  },
})
