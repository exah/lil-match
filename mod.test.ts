import { expectType } from 'tsd'
import { match } from '.'

const ERROR = 'ERROR'
const FALLBACK = 'FALLBACK'
const NOT_EXHAUSTIVE = 'NOT_EXHAUSTIVE'

enum Enum {
  PENDING,
  READY,
  FAILED,
}

type DiscriminatingUnion<Value> =
  | { type: Enum.PENDING; value?: never; error?: never }
  | { type: Enum.READY; value: Value; error?: never }
  | { type: Enum.FAILED; value?: Value; error: Error }

describe('enum', () => {
  test('get value', () => {
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
        .get()

      expectType<Enum>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(fn(Enum.FAILED)).toBe(2)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('get fallback', () => {
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
        .get(FALLBACK)

      expectType<Enum | typeof FALLBACK>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(fn(Enum.FAILED)).toBe(FALLBACK)
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
          return res
        })
        .exhaustive(ERROR)

      expectType<Enum>(result)
      return result
    }

    expect(fn(Enum.PENDING)).toBe(0)
    expect(fn(Enum.READY)).toBe(1)
    expect(fn(Enum.FAILED)).toBe(2)

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
  test('get value', () => {
    function fn<Data>(input: DiscriminatingUnion<Data>) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.FAILED }, (res) => {
          expectType<Enum.FAILED>(res.type)
          expectType<Data | undefined>(res.value)
          expectType<Error>(res.error)
          return res
        })
        .get()

      expectType<DiscriminatingUnion<Data>>(result)
      return result
    }

    const pending = { type: Enum.PENDING as const }
    const ready = { type: Enum.READY as const, value: 'value' }
    const failed = { type: Enum.FAILED as const, error: new Error() }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(failed)

    // @ts-expect-error
    expect(fn(NOT_EXHAUSTIVE)).toBe(undefined)
  })

  test('get fallback', () => {
    function fn<Data>(input: DiscriminatingUnion<Data>) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .get(FALLBACK)

      expectType<DiscriminatingUnion<Data> | typeof FALLBACK>(result)
      return result
    }

    const pending = { type: Enum.PENDING as const }
    const ready = { type: Enum.READY as const, value: 'value' }
    const failed = { type: Enum.FAILED as const, error: new Error() }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(FALLBACK)
  })

  test('exhaustive', () => {
    function fn<Data>(input: DiscriminatingUnion<Data>) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.FAILED }, (res) => {
          expectType<Enum.FAILED>(res.type)
          expectType<Data | undefined>(res.value)
          expectType<Error>(res.error)
          return res
        })
        .exhaustive(ERROR)

      expectType<DiscriminatingUnion<Data>>(result)
      return result
    }

    const pending = { type: Enum.PENDING as const }
    const ready = { type: Enum.READY as const, value: 'value' }
    const failed = { type: Enum.FAILED as const, error: new Error() }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(fn(failed)).toBe(failed)

    // @ts-expect-error
    expect(() => fn(NOT_EXHAUSTIVE)).toThrow(new Error(ERROR))
  })

  test('not exhaustive', () => {
    function fn<Data>(input: DiscriminatingUnion<Data>) {
      const result = match(input)
        .with({ type: Enum.PENDING }, (res) => {
          expectType<Enum.PENDING>(res.type)
          expectType<undefined>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        .with({ type: Enum.READY }, (res) => {
          expectType<Enum.READY>(res.type)
          expectType<Data>(res.value)
          expectType<undefined>(res.error)
          return res
        })
        // @ts-expect-error
        .exhaustive(ERROR)

      expectType<DiscriminatingUnion<Data>>(result)
      return result
    }

    const pending = { type: Enum.PENDING as const }
    const ready = { type: Enum.READY as const, value: 'value' }
    const failed = { type: Enum.FAILED as const, error: new Error() }

    expect(fn(pending)).toBe(pending)
    expect(fn(ready)).toBe(ready)
    expect(() => fn(failed)).toThrow(new Error(ERROR))
  })
})
