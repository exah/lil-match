import { expectType, expectNotType } from 'tsd'
import { match } from '.'

type Value =
  | {
      type: 'foo'
    }
  | {
      type: 'bar'
      meta: 100
    }

test('return', () => {
  const value = { type: 'foo' } as Value

  const result = match(value)
    .with({ type: 'foo' }, (val) => val.type)
    .with({ type: 'bar' }, (val) => val.meta)
    .run()

  expect(result).toBe('foo')
  expectType<'foo' | 100 | void>(result)
})

test('exhaustive', () => {
  const value = { type: 'foo' } as Value

  const result = match(value)
    .with({ type: 'foo' }, (val) => val.type)
    .with({ type: 'bar' }, (val) => val.meta)
    .exhaustive()

  expect(result).toBe('foo')
  expectType<'foo' | 100>(result)
  expectNotType<void>(result)
})

test('throw not exhaustive', () => {
  const value = { type: 'foo' } as Value
  const matcher = match(value).with({ type: 'foo' }, (val) => val.type)

  // @ts-expect-error
  expect(matcher.exhaustive()).toBe('foo')
})
