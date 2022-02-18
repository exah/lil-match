import { expectType } from 'tsd'
import { describe, test, expect } from 'vitest'
import { Opaque } from 'type-fest'
import { match, when, list } from '.'

const ERROR = 'ERROR'
const NOT_EXHAUSTIVE = 'NOT_EXHAUSTIVE'

const LITERAL = 'LITERAL'
type LITERAL = typeof LITERAL

type UUID = Opaque<string, 'UUID'>

class Post {
  id: UUID
  title: string

  constructor(title: string) {
    this.id = id
    this.title = title
  }
}

enum Type {
  PENDING,
  READY,
  FAILED,
}

type Data =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'post'; value: Post }

type Result =
  | { type: Type.PENDING; data?: never; error?: never }
  | { type: Type.READY; data: Data; error?: never }
  | { type: Type.FAILED; data?: Data; error: Error }

const id = 'xxxx' as UUID

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
    expect(fn(number)).toBe(number)
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
    expect(fn(number)).toBe(number)
    expect(fn(string)).toBe(string)
    expect(fn(boolean)).toBe(boolean)
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
    expect(fn(number)).toBe(null)
    expect(fn(string)).toBe(null)
    expect(fn(boolean)).toBe(null)
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
    expect(fn(number)).toBe(number)
    expect(fn(string)).toBe(string)
    expect(fn(boolean)).toBe(boolean)
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
    expect(fn(number)).toBe(number)
    expect(fn(string)).toBe(string)
    expect(fn(boolean)).toBe(boolean)
    expect(() => fn(failed)).toThrow(new Error(ERROR))
  })
})

describe('nested union', () => {
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
        .with({ type: Type.READY, data: { type: 'post' } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'post'>(res.data.type)
          expectType<Post>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .otherwise((res) => {
          expectType<Type.PENDING | Type.FAILED>(res.type)
          expectType<undefined>(res.data)
          expectType<Error | undefined>(res.error)
          return null
        })

      expectType<'number' | 'string' | 'boolean' | 'post' | null>(result)
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

describe('match constructor', () => {
  test('run', () => {
    function fn(input: Result) {
      const result = match(input)
        .with({ type: Type.READY, data: { value: Number } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: String } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: Boolean } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: Post } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'post'>(res.data.type)
          expectType<Post>(res.data.value)
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

      expectType<'number' | 'string' | 'boolean' | 'post' | null>(result)
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
        .with({ type: Type.READY, data: { value: Number } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: String } }, (res) => {
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
        .with({ type: Type.READY, data: { value: Number } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: String } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: Boolean } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: Post } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'post'>(res.data.type)
          expectType<Post>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .otherwise((res) => {
          expectType<Type.PENDING | Type.FAILED>(res.type)
          expectType<undefined>(res.data)
          expectType<Error | undefined>(res.error)
          return null
        })

      expectType<'number' | 'string' | 'boolean' | 'post' | null>(result)
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
        .with({ type: Type.READY, data: { value: Number } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: String } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: Boolean } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: Post } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'post'>(res.data.type)
          expectType<Post>(res.data.value)
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

      expectType<'number' | 'string' | 'boolean' | 'post' | null>(result)
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
        .with({ type: Type.READY, data: { value: Number } }, (res) => {
          expectType<Type.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Type.READY, data: { value: String } }, (res) => {
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

  test('multiple pattern of primitives', () => {
    function fn(
      input: string | symbol | number | bigint | boolean | [string, string],
    ) {
      const result = match(input)
        .with(Number, BigInt, (res) => {
          expectType<number | bigint>(res)
          return `number-like: ${res}` as const
        })
        .with(Boolean, (res) => {
          expectType<boolean>(res)
          return `boolean: ${res}` as const
        })
        .with(String, Symbol, (res) => {
          expectType<string | symbol>(res)
          return `string | symbol: ${res.toString()}` as const
        })
        .with([String, String], (res) => {
          expectType<[string, string]>(res)
          return `tuple: [${res[0]}, ${res[1]}]` as const
        })
        .exhaustive('Unhandled input')

      type Result =
        | `number-like: ${number | bigint}`
        | `boolean: ${boolean}`
        | `string | symbol: ${string | boolean}`
        | `tuple: [${string}, ${string}]`

      expectType<Result>(result)
      return result
    }

    expect(fn(100)).toBe(`number-like: 100`)
    expect(fn(100n)).toBe(`number-like: 100`)
    expect(fn('text')).toBe(`string | symbol: text`)
    expect(fn(Symbol('unique'))).toBe(`string | symbol: Symbol(unique)`)
    expect(fn(['one', 'two'])).toBe(`tuple: [one, two]`)
    expect(fn(true)).toBe(`boolean: true`)
  })
})

describe('multi pattern union', () => {
  test('run', () => {
    function fn(input: Type) {
      const result = match(input)
        .with(Type.PENDING, Type.FAILED, (res) => {
          expectType<Type.PENDING | Type.FAILED>(res)
          return res
        })
        .with(Type.READY, (res) => {
          expectType<Type.READY>(res)
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
    function fn(input: LITERAL | Type) {
      const result = match(input)
        .with(Type.PENDING, Type.READY, (res) => {
          expectType<Type.PENDING | Type.READY>(res)
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
    function fn(input: LITERAL | Type) {
      const result = match(input)
        .with(LITERAL, Type.PENDING, (res) => {
          expectType<LITERAL | Type.PENDING>(res)
          return res
        })
        .otherwise((res) => {
          expectType<Type.READY | Type.FAILED>(res)
          return null
        })

      expectType<LITERAL | Type.PENDING | null>(result)
      return result
    }

    expect(fn(LITERAL)).toBe(LITERAL)
    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(null)
    expect(fn(Type.FAILED)).toBe(null)
  })

  test('otherwise never', () => {
    function fn(input: LITERAL | Type) {
      const result = match(input)
        .with(LITERAL, Type.PENDING, Type.READY, Type.FAILED, (res) => {
          expectType<LITERAL | Type.PENDING | Type.READY | Type.FAILED>(res)
          return res
        })
        .otherwise((res) => {
          expectType<never>(res)
          return null
        })

      expectType<LITERAL | Type | null>(result)
      return result
    }

    expect(fn(LITERAL)).toBe(LITERAL)
    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(fn(Type.FAILED)).toBe(2)
    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(null)
  })

  test('exhaustive', () => {
    function fn(input: LITERAL | Type) {
      const result = match(input)
        .with(LITERAL, Type.PENDING, (res) => {
          expectType<LITERAL | Type.PENDING>(res)
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

      expectType<LITERAL | Type | void>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(fn(Type.FAILED)).toBe(undefined)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn(input: LITERAL | Type) {
      const result = match(input)
        .with(LITERAL, Type.PENDING, (res) => {
          expectType<LITERAL | Type.PENDING>(res)
          return res
        })
        .with(Type.READY, (res) => {
          expectType<Type.READY>(res)
          return res
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<LITERAL | Type>(result)
      return result
    }

    expect(fn(Type.PENDING)).toBe(0)
    expect(fn(Type.READY)).toBe(1)
    expect(() => fn(Type.FAILED)).toThrow(new Error(ERROR))
  })
})

describe('when', () => {
  interface Author {
    id: UUID
    name: string
  }

  type Input = { data: Author } | { data: Post } | number[]

  function isAuthor(input: unknown): input is Author {
    return (
      typeof input === 'object' &&
      input != null &&
      'id' in input &&
      'name' in input
    )
  }

  function isPost(input: unknown): input is Post {
    return input instanceof Post
  }

  test('run', () => {
    function fn(input: Input) {
      const result = match(input)
        .with({ data: when(isAuthor) }, (res) => {
          expectType<UUID>(res.data.id)
          expectType<string>(res.data.name)

          return `Author: ${res.data.name}` as const
        })
        .with({ data: when(isPost) }, (res) => {
          expectType<UUID>(res.data.id)
          expectType<string>(res.data.title)

          return `Post: ${res.data.title}` as const
        })
        .with(when(Array.isArray), (res) => {
          expectType<number[]>(res)
          return `Array: ${res.join(', ')}` as const
        })
        .run()

      expectType<`Author: ${string}` | `Post: ${string}` | `Array: ${string}`>(
        result,
      )
      return result
    }

    expect(fn({ data: { id, name: 'John' } })).toBe('Author: John')
    expect(fn({ data: new Post('Bar') })).toBe('Post: Bar')
    expect(fn([1, 2, 3])).toBe('Array: 1, 2, 3')
    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })
})

describe('list', () => {
  test('exhaustive', () => {
    interface User {
      name: string
    }

    function isUser(input: unknown): input is User {
      return input != null && typeof input === 'object' && 'name' in input
    }

    function fn(input: User | User[]) {
      const result = match(input)
        .with(when(isUser), (res) => `👋 ${res.name}` as const)
        .with(list(isUser), (res) => `👯‍♀️ ${res.length}` as const)
        .exhaustive(ERROR)

      expectType<`👋 ${string}` | `👯‍♀️ ${number}`>(result)
      return result
    }

    expect(fn({ name: 'John' })).toBe('👋 John')
    expect(fn([])).toBe('👯‍♀️ 0')
    expect(fn([{ name: 'John' }, { name: 'Kate' }])).toBe('👯‍♀️ 2')
    // @ts-expect-error
    expect(() => fn([{}])).toThrow(new Error(ERROR))
  })
})
