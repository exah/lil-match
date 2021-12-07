<h1 align="center"><img src="./lil-match.png" width="40" height="40" /> lil-match</h1>

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

let input: Response

let output: string = match(input)
  .with({ type: 'pending' }, (res) => `⏳`)
  .with({ type: 'failed' }, (res) => `⚠️ ${res.error.message}`)
  .with({ type: 'ready' }, (res) => `👋 ${res.data.name}!`)
  .exhaustive('Unhandled input')
```

## 📖 Docs

### `match(input)`

Returns an object based on `input` with methods for chaining. Use [`.with`](#withpattern-callbackmatch) method to create patterns, close the chain with [`.otherwise`](#otherwise), [`.run`](#run), or [`.exhaustive`](#exhaustive) methods.

#### Params

- `input` — a value you'll be testing

#### Returns object

- [`.with`](#withpattern-callbackmatch)
- [`.otherwise`](#otherwise)
- [`.run`](#run)
- [`.exhaustive`](#exhaustive)

#### Examples

```ts
let input: 'something' | 'nothing'

let output = match(input)
  .with('something', (val) => /* */)
  .with('nothing', (val) => /* */)
  .exhaustive('Unhandled input')
```

### `.with(pattern, callback(match))`

Create a match pattern based on `input`. Pattern can be object, primitive value, or `Number`, `String`, `Boolean`, `Symbol`, `BigInt` constructors for creating wildcard patterns. Use `callback` to access matched value. Returns an object with all [match](#matchinput) methods for chaining.

#### Params

- `pattern`
  - can be an object, literal value, primitive, or `Number`, `String`, `Boolean`, `Symbol`, `BigInt` constructors
- `callback(match)`
  - access matched value
  - returned value will be used for output type of end of [`match`](#matchinput) chain

#### Returns object

- [`.with`](#withpattern-callbackmatch)
- [`.otherwise`](#otherwise)
- [`.run`](#run)
- [`.exhaustive`](#exhaustive)

#### Examples

##### Literals

```ts
let input: 'something' | 'nothing'

let output = match(input)
  .with('something', (val) => /* */)
  .with('nothing', (val) => /* */)
  .exhaustive('Unhandled input')
```

##### Enums

```ts
enum Type {
  ONE,
  TWO
}

let input: Type

let output = match(input)
  .with(Type.ONE, (val) => /* */)
  .with(Type.TWO, (val) => /* */)
  .exhaustive('Unhandled input')
```

##### Match primitives with constructors

```ts
let input: string | number

let output = match(input)
  .with(String, (val) => /* */)
  .with(Number, (val) => /* */)
  .exhaustive('Unhandled input')
```

##### Objects

```ts
let input:
  | { type: 'pending' }
  | { type: 'failed' }
  | { type: 'ready', data: { type: 'image' } | { type: 'text' } }

let output = match(input)
  .with({ type: 'ready', data: { type: 'image' } }, (val) => /* */)
  .with({ type: 'ready', data: { type: 'text' } }, (val) => /* */)
  .with({ type: 'pending' }, (val) => /* */)
  .with({ type: 'failed' }, (val) => /* */)
  .exhaustive('Unhandled input')
```

### `.run()`

Execute [`match`](#matchinput) chain and return result. If all cases are matched result value will be exactly what was returned in callback of [`.with`](#withpattern-callbackmatch) method. However if even one case not handled result will include `undefined`.

#### Params

The method does not accept any arguments.

#### Returns

The output of [`match`](#matchinput) chain. Can be optional if not all the conditions has been matched using [`.with`](#withpattern-callbackmatch) patterns. Use [`.otherwise`](#otherwisecallback) if you want to provide fallback value or to handle unknown case.

#### Examples

##### All the conditions are matched

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | 'nothing' = match(input)
  .with({ text: 'something' }, (val) => val.text)
  .with({ text: 'nothing' }, (val) => val.text)
  .run()
```

##### Condition is missing

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | undefined = match(input)
  .with({ text: 'something' }, (val) => val.text)
  .run()
```

##### No conditions

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: undefined = match(input).run()
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

### `.otherwise(callback(unmatched))`

Just like [`.run`](#run), `.otherwise` executes [`match`](#matchinput) chain and returns result, but can must be used with callback to handled `unknown` value. Return value of callback will be combined with output type of the [`match`](#matchinput) chain. It's not possible to call `.otherwise` if all the conditions are matched.

#### Params

- `callback(unmatched)`

#### Returns

The output of [`match`](#matchinput) chain, plus result of the `callback`.

#### Examples

##### Condition is missing

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | null = match(input)
  .with({ text: 'something' }, (val) => val.text)
  .otherwise((unmatched) => {
    console.log(unmatched.text) // will be 'nothing'
    return null
  })
```

##### No conditions

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: null = match(input).otherwise((unmatched) => {
  console.log(unmatched.text) // will be 'something' or 'nothing'
  return null
})
```

##### Impossible to call when all cases are matched

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | 'nothing' = match(input)
  .with({ text: 'something' }, (val) => val.text)
  .with({ text: 'nothing' }, (val) => val.text)
  // Impossible to call because all conditions are matched
  // .otherwise((_) => '🤷‍♂️')
  .run()
```
