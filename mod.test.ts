import { expectType } from 'tsd'
import { match } from '.'

const ERROR = 'ERROR'
const NOT_EXHAUSTIVE = 'NOT_EXHAUSTIVE'

enum Enum {
  PENDING,
  READY,
  FAILED,
}

type Data =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }

type DiscriminatingUnion =
  | { type: Enum.PENDING; data?: never; error?: never }
  | { type: Enum.READY; data: Data; error?: never }
  | { type: Enum.FAILED; data?: Data; error: Error }

describe('enum', () => {
  test('run', () => {
    function fn(input: Enum) {
      const result = match(input)
        .with(Enum.PENDING, (res) => {
          expectType<Enum.PENDING>(res)
          return res
        })
        .with(Enum.READY, (res) => {
          expectType<Enum.READY>(res)
          return res
        })
        .with(Enum.FAILED, (res) => {
          expectType<Enum.FAILED>(res)
          return res
        })
        .run()

      expectType<Enum>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(fn(Enum.FAILED)).toBe(2)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('undefined on unhandled', () => {
    function fn(input: Enum) {
      const result = match(input)
        .with(Enum.PENDING, (res) => {
          expectType<Enum.PENDING>(res)
          return res
        })
        .with(Enum.READY, (res) => {
          expectType<Enum.READY>(res)
          return res
        })
        .run()

      expectType<Enum | undefined>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(fn(Enum.FAILED)).toBe(undefined)
  })

  test('otherwise', () => {
    function fn(input: Enum) {
      const result = match(input)
        .with(Enum.PENDING, (res) => {
          expectType<Enum.PENDING>(res)
          return res
        })
        .otherwise((res) => {
          expectType<Enum.READY | Enum.FAILED>(res)
          return null
        })

      expectType<Enum.PENDING | null>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(null)
    expect(fn(Enum.FAILED)).toBe(null)
  })

  test('exhaustive', () => {
    function fn(input: Enum) {
      const result = match(input)
        .with(Enum.PENDING, (res) => {
          expectType<Enum.PENDING>(res)
          return res
        })
        .with(Enum.READY, (res) => {
          expectType<Enum.READY>(res)
          return res
        })
        .with(Enum.FAILED, (res) => {
          expectType<Enum.FAILED>(res)
          return
        })
        .exhaustive(ERROR)

      expectType<Enum | void>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(fn(Enum.FAILED)).toBe(undefined)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn(input: Enum) {
      const result = match(input)
        .with(Enum.PENDING, (res) => {
          expectType<Enum.PENDING>(res)
          return res
        })
        .with(Enum.READY, (res) => {
          expectType<Enum.READY>(res)
          return res
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<Enum>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(() => fn(Enum.FAILED)).toThrow(new Error(ERROR))
  })
})

describe('discriminating union', () => {
  const pending = {
    type: Enum.PENDING,
  } as const

  const ready = {
    type: Enum.READY,
    data: { type: 'number', value: 0 },
  } as const

  const failed = {
    type: Enum.FAILED,
    error: new Error(),
  } as const

  test('run', () => {
    function fn(input: DiscriminatingUnion) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.FAILED }, (res) => {
          expectType<Enum.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)
          return res
        })
        .run()

      expectType<DiscriminatingUnion>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(failed)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('undefined on unhandled', () => {
    function fn(input: DiscriminatingUnion) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .run()

      expectType<DiscriminatingUnion | undefined>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(undefined)
  })

  test('otherwise', () => {
    function fn(input: DiscriminatingUnion) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .otherwise((res) => {
          expectType<Enum.READY | Enum.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error | undefined>(res.error)
          return null
        })

      expectType<DiscriminatingUnion | null>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(null)
    expect(fn(failed)).toBe(null)
  })

  test('exhaustive', () => {
    function fn(input: DiscriminatingUnion) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.FAILED }, (res) => {
          expectType<Enum.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)
          return
        })
        .exhaustive(ERROR)

      expectType<DiscriminatingUnion | void>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(undefined)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn(input: DiscriminatingUnion) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.data)
          expectType<undefined>(res.error)
          return res
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<DiscriminatingUnion>(result)
      return result
    }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(() => fn(failed)).toThrow(new Error(ERROR))
  })

  test('nested', () => {
    function fn(input: DiscriminatingUnion) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.data)
          expectType<undefined>(res.error)

          return res
        })
        .with({ type: Enum.FAILED }, (res) => {
          expectType<Enum.FAILED>(res.type)
          expectType<Data | undefined>(res.data)
          expectType<Error>(res.error)

          return res
        })
        .with({ type: Enum.READY, data: { type: 'number' } }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<'number'>(res.data.type)
          expectType<number>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Enum.READY, data: { type: 'string' } }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<'string'>(res.data.type)
          expectType<string>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .with({ type: Enum.READY, data: { type: 'boolean' } }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<'boolean'>(res.data.type)
          expectType<boolean>(res.data.value)
          expectType<undefined>(res.error)

          return res.data.type
        })
        .run()

      expectType<DiscriminatingUnion>(result)
      return result
    }

    expect(
      fn({
        type: Enum.READY,
        data: { type: 'number', value: 0 },
      }),
    ).toBe('number')

    expect(
      fn({
        type: Enum.READY,
        data: { type: 'string', value: 'value' },
      }),
    ).toBe('string')

    expect(
      fn({
        type: Enum.READY,
        data: { type: 'boolean', value: true },
      }),
    ).toBe('boolean')
  })
})
