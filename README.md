# <img src="./lil-match.png" width="48" height="48" /> lil-match

> Super small pattern matching library for TS projects

- [x] Only 255 B when minified & gziped
- [x] Designed for `TypeScript` projects
- [x] No dependencies

## 📦 Install

```sh
npm i -S lil-match
```

```sh
npm add lil-match
```

## 💻 Use

```ts
import { match } from 'lil-match'

type Response =
  | { type: 'pending' }
  | { type: 'failed'; error: Error }
  | { type: 'ready'; data: { name: 'John' } }

let response: Response

match(response)
  .with({ type: 'pending' }, (res) => `⏳`)
  .with({ type: 'failed' }, (res) => `⚠️ ${res.error.message}`)
  .with({ type: 'ready' }, (res) => `👋 ${res.data.name}!`)
  .exhaustive('Unhandled response')
```

## 📖 Docs

### `match(input)`

Returns [`Match`](#match) interface based on `input` for chaining. Use [`.with`](#with) method to create patterns, close the chain with [`.otherwise`](#otherwise), [`.run`](#run), or [`.exhaustive`](#exhaustive) methods.

#### Params

- `input` — **required**, a value you'll be testing

#### Returns

- Object for chaining, includes all the methods: [`.with`](#with), [`.otherwise`](#otherwise), [`.run`](#run), [`.exhaustive`](#exhaustive)

#### Examples

```ts
let input: 'something' | 'nothing'

match(input)
// .with('something', (val) => /* */)
// .run()
// .otherwise()
// .exhaustive('Unhandled input')
```

#### `.with(pattern, callback)`

Create a match pattern based on `input`. Pattern can be object, primitive value, or `Number`, `String`, `Boolean`, `Symbol`, `BigInt` constructor for creating wildcard patterns.

##### Params

- `pattern` — **required**,
- `callback` — **required**,

##### Examples

###### Primitives

```ts
let input: 'something' | 'nothing'

match(input)
  .with('something', (val) => /* */)
  .with('nothing', (val) => /* */)
  .exhaustive('Unhandled input')
```

###### Constructors

```ts
let input: string | number

match(input)
  .with(String, (val) => /* */)
  .with(Number, (val) => /* */)
  .exhaustive('Unhandled input')
```

###### Enums

```ts
enum Type {
  ONE,
  TWO
}

let input: Type

match(input)
  .with(Type.ONE, (val) => /* */)
  .with(Type.TWO, (val) => /* */)
  .exhaustive('Unhandled input')
```

###### Object

```ts
enum Data {
  IMAGE
  TEXT
}

let input:
  | { type: 'pending' }
  | { type: 'failed' }
  | { type: 'ready', data: { type: Data.IMAGE } | { type: Data.TEXT } }

match(input)
  .with({ type: 'ready', data: {  type: Data.IMAGE } }, (val) => /* */)
  .with({ type: 'ready', data: {  type: Data.TEXT } }, (val) => /* */)
  .with({ type: 'pending' }, (val) => /* */)
  .with({ type: 'failed' }, (val) => /* */)
  .exhaustive('Unhandled input')
```

<!-- ### Exhaustive check

Use `exhaustive` to enforce matching every possible case. Will show TS error during the build on unhandled cases, plus will throw error if `response` of unhandled type. If every cases has been matched it will return value of

```ts
match(response)
  .with({ type: 'pending' }, (res) => 'Pending...')
  .with({ type: 'failed' }, (res) => 'Something went wrong!')
  // Will throw an Error because `'ready'` not handled
  .exhaustive('Unhandled response type')
``` -->
