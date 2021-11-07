const UNKNOWN = Symbol()

function isObject(input) {
  return input !== null && typeof input === 'object'
}

function compare(input, pattern) {
  if (isObject(pattern)) {
    return isObject(input)
      ? Object.keys(pattern).every(function (key) {
          return compare(input[key], pattern[key])
        })
      : false
  }

  return Object.is(input, pattern)
}

export function match(input, output = UNKNOWN) {
  return {
    with(pattern, callback) {
      return match(input, compare(input, pattern) ? callback(input) : output)
    },
    exhaustive() {
      if (output === UNKNOWN) throw new Error('Not exhaustive')
      return output
    },
    run() {
      if (output === UNKNOWN) return
      return output
    },
  }
}
