let TAG = Symbol()

let is = (type, input) =>
  input != null &&
  (type === Object ? typeof input === 'object' : Object(input) instanceof type)

let compare = (input) => (pattern) => {
  if (typeof pattern === 'function') {
    return pattern[TAG] ? pattern(input) : is(pattern, input)
  }

  if (is(Object, pattern) && is(Object, input)) {
    let keys = Object.keys(pattern)
    return keys.length
      ? keys.every((key) => compare(input[key])(pattern[key]))
      : !Object.keys(input).length
  }

  return Object.is(input, pattern)
}

export let when = (fn) => {
  fn[TAG] = 1
  return fn
}

export let list = (pattern) =>
  when((input) => is(Array, input) && compare(input)([pattern]))

export let match = (input, output = TAG) => ({
  with(...patterns) {
    let callback = patterns.pop()
    if (output === TAG && patterns.some(compare(input)))
      output = callback(input)
    return this
  },
  exhaustive(message) {
    if (output === TAG) throw Error(message)
    return output
  },
  otherwise(cb) {
    if (output === TAG) return cb(input)
    return output
  },
  run() {
    if (output === TAG) return
    return output
  },
})
