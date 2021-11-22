import { expectType } from 'tsd'
import { match } from '.'

const ERROR = 'ERROR'
const NOT_EXHAUSTIVE = 'NOT_EXHAUSTIVE'

enum Type {
  PENDING,
  READY,
  FAILED,
}

type Data =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }

type Result =
  | { type: Type.PENDING; data?: never; error?: never }
  | { type: Type.READY; data: Data; error?: never }
  | { type: Type.FAILED; data?: Data; error: Error }

describe('enum', () => {
  test('run', () => {
    function fn(input: Type) {
      const result = match(input)
        .with(Type.PENDING, (res) => {
          expectType<Type.PENDING>(res)
          return res
        })
        .with(Type.READY, (res) => {
          expectType<Type.READY>(res)
          return res
        })
        .with(Type.FAILED, (res) => {
          expectType<Type.FAILED>(res)
          return res
        })
        .run()

      expectType<Type>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(fn(Type.FAILED)).toBe(2)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('undefined on unhandled', () => {
    function fn(input: Type) {
      const result = match(input)
        .with(Type.PENDING, (res) => {
          expectType<Type.PENDING>(res)
          return res
        })
        .with(Type.READY, (res) => {
          expectType<Type.READY>(res)
          return res
        })
        .run()

      expectType<Type | undefined>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(fn(Type.FAILED)).toBe(undefined)
  })

  test('otherwise', () => {
    function fn(input: Type) {
      const result = match(input)
        .with(Type.PENDING, (res) => {
          expectType<Type.PENDING>(res)
          return res
        })
        .otherwise((res) => {
          expectType<Type.READY | Type.FAILED>(res)
          return null
        })

      expectType<Type.PENDING | null>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(null)
    expect(fn(Type.FAILED)).toBe(null)
  })

  test('exhaustive', () => {
    function fn(input: Type) {
      const result = match(input)
        .with(Type.PENDING, (res) => {
          expectType<Type.PENDING>(res)
          return res
        })
        .with(Type.READY, (res) => {
          expectType<Type.READY>(res)
          return res
        })
        .with(Type.FAILED, (res) => {
          expectType<Type.FAILED>(res)
          return
        })
        .exhaustive(ERROR)

      expectType<Type | void>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(fn(Type.FAILED)).toBe(undefined)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn(input: Type) {
      const result = match(input)
        .with(Type.PENDING, (res) => {
          expectType<Type.PENDING>(res)
          return res
        })
        .with(Type.READY, (res) => {
          expectType<Type.READY>(res)
          return res
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<Type>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(() => fn(Type.FAILED)).toThrow(new Error(ERROR))
  })
})

describe('union', () => {
  const pending = {
    type: Type.PENDING,
  } as const

  const ready = {
    type: Type.READY,
    data: { type: 'number', value: 0 },
  } as const

  const failed = {
    type: Type.FAILED,
    error: new Error(),
  } as const

  test('run', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Type.READY }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Type.FAILED }, (res) => {
          expectType<Type.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)
          return res
        })
        .run()

      expectType<Result>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(failed)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('undefined on unhandled', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Type.READY }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .run()

      expectType<Result | undefined>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(undefined)
  })

  test('otherwise', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .otherwise((res) => {
          expectType<Type.READY | Type.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error | undefined>(res.error)
          return null
        })

      expectType<Result | null>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(null)
    expect(fn(failed)).toBe(null)
  })

  test('exhaustive', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Type.READY }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Type.FAILED }, (res) => {
          expectType<Type.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)
          return
        })
        .exhaustive(ERROR)

      expectType<Result | void>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(undefined)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Type.READY }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<Result>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(() => fn(failed)).toThrow(new Error(ERROR))
  })
})

describe('nested union', () => {
  const number = {
    type: Type.READY,
    data: { type: 'number', value: 0 },
  } as const

  const string = {
    type: Type.READY,
    data: { type: 'string', value: '' },
  } as const

  const boolean = {
    type: Type.READY,
    data: { type: 'boolean', value: true },
  } as const

  const pending = {
    type: Type.PENDING,
  } as const

  const failed = {
    type: Type.FAILED,
    error: new Error(),
  } as const

  test('run', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.READY, data: { type: 'number' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'string' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'boolean' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)

          return null
        })
        .with({ type: Type.FAILED }, (res) => {
          expectType<Type.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)

          return null
        })
        .run()

      expectType<'number' | 'string' | 'boolean' | null>(result)
      return result
    }

    expect(fn(number)).toBe('number')
    expect(fn(string)).toBe('string')
    expect(fn(boolean)).toBe('boolean')
    expect(fn(pending)).toBe(null)
    expect(fn(failed)).toBe(null)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('undefined on unhandled', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.READY, data: { type: 'number' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'string' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .run()

      expectType<'number' | 'string' | undefined>(result)
      return result
    }

    expect(fn(number)).toBe('number')
    expect(fn(string)).toBe('string')
    expect(fn(boolean)).toBe(undefined)
    expect(fn(pending)).toBe(undefined)
    expect(fn(failed)).toBe(undefined)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('otherwise', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.READY, data: { type: 'number' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'string' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'boolean' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .otherwise((res) => {
          expectType<Type.PENDING | Type.FAILED>(res.type)
          expectType<undefined>(res.data)
          expectType<Error | undefined>(res.error)
          return null
        })

      expectType<'number' | 'string' | 'boolean' | null>(result)
      return result
    }

    expect(fn(number)).toBe('number')
    expect(fn(string)).toBe('string')
    expect(fn(boolean)).toBe('boolean')
    expect(fn(pending)).toBe(null)
    expect(fn(failed)).toBe(null)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(null)
  })

  test('exhaustive', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.READY, data: { type: 'number' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'string' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'boolean' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.PENDING }, (res) => {
          expectType<Type.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)

          return null
        })
        .with({ type: Type.FAILED }, (res) => {
          expectType<Type.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)

          return null
        })
        .exhaustive(ERROR)

      expectType<'number' | 'string' | 'boolean' | null>(result)
      return result
    }

    expect(fn(number)).toBe('number')
    expect(fn(string)).toBe('string')
    expect(fn(boolean)).toBe('boolean')
    expect(fn(pending)).toBe(null)
    expect(fn(failed)).toBe(null)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.READY, data: { type: 'number' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { type: 'string' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<'number' | 'string' | undefined>(result)
      return result
    }

    expect(fn(number)).toBe('number')
    expect(fn(string)).toBe('string')
    expect(() => fn(boolean)).toThrow(new Error(ERROR))
    expect(() => fn(pending)).toThrow(new Error(ERROR))
    expect(() => fn(failed)).toThrow(new Error(ERROR))
  })
})
