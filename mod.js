let UNKNOWN = []

export let is = (type) => (input) =>
  input != null &&
  (type === Object ? typeof input === 'object' : Object(input) instanceof type)

let compare = (input) => (pattern) => {
  if (typeof pattern === 'function') return pattern(input)

  if (is(Object)(pattern)) {
    return (
      is(Object)(input) &&
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
