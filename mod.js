let UNKNOWN = Symbol()

function isObject(input) {
  return input != null && typeof input === 'object'
}

function compare(input) {
  return function (pattern) {
    if (pattern === Boolean) return typeof input === 'boolean'
    if (pattern === String) return typeof input === 'string'
    if (pattern === Number) return typeof input === 'number'
    if (pattern === Symbol) return typeof input === 'symbol'
    if (pattern === BigInt) return typeof input === 'bigint'

    if (isObject(pattern)) {
      return isObject(input)
        ? Object.keys(pattern).every(function (key) {
            return compare(input[key])(pattern[key])
          })
        : false
    }

    return Object.is(input, pattern)
  }
}

export function match(input, output = UNKNOWN) {
  return {
    with(...patterns) {
      let callback = patterns.pop()
      if (patterns.some(compare(input))) output = callback(input)
      return this
    },
    exhaustive(message) {
      if (output === UNKNOWN) throw new Error(message)
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
  }
}
