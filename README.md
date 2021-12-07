<h1 align="center">
 <img src="./lil-match.png" width="40" height="40" /> lil-match
</h1>

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

Returns an object based on `input` with methods for chaining. Use [`.with`](#withpattern-callbackmatch) method to create patterns, close the chain with [`.otherwise`](#otherwisecallbackunmatched), [`.run`](#run), or [`.exhaustive`](#exhaustiveerrormessage) methods.

#### Params

- `input` — a value you'll be testing

#### Returns object

- [`.with`](#withpattern-callbackmatch)
- [`.otherwise`](#otherwisecallbackunmatched)
- [`.run`](#run)
- [`.exhaustive`](#exhaustiveerrormessage)

#### Examples

```ts
let input: 'something' | 'nothing'

let output = match(input)
  .with('something', (res) => res)
  .with('nothing', (res) => res)
  .exhaustive('Unhandled input')
```

### `.with(pattern, callback(match))`

Create a match pattern based on `input`. The pattern can be an object, primitive value, or `Number`, `String`, `Boolean`, `Symbol`, `BigInt` constructors for creating wildcard patterns. Use `callback` to access matched value. Returns an object with all [match](#matchinput) methods for chaining.

#### Params

- `pattern`
- can be an object, literal value, primitive, or `Number`, `String`, `Boolean`, `Symbol`, `BigInt` constructors
- `callback(match)`
- access matched value
- returned value will be used for the output type of end of [`match`](#matchinput) chain

#### Returns object

- [`.with`](#withpattern-callbackmatch)
- [`.otherwise`](#otherwisecallbackunmatched)
- [`.run`](#run)
- [`.exhaustive`](#exhaustiveerrormessage)

#### Examples

##### Literals

```ts
let input: 'something' | 'nothing'

let output = match(input)
  .with('something', (res) => res)
  .with('nothing', (res) => res)
  .exhaustive('Unhandled input')
```

##### Enums

```ts
enum Type {
  ONE,
  TWO,
}

let input: Type

let output = match(input)
  .with(Type.ONE, (res) => res)
  .with(Type.TWO, (res) => res)
  .exhaustive('Unhandled input')
```

##### Match primitives with constructors

```ts
let input: string | number

let output = match(input)
  .with(String, (res) => res)
  .with(Number, (res) => res)
  .exhaustive('Unhandled input')
```

##### Objects

```ts
let input:
  | { type: 'pending' }
  | { type: 'failed' }
  | { type: 'ready'; data: { type: 'image' } | { type: 'text' } }

let output = match(input)
  .with({ type: 'ready', data: { type: 'image' } }, (res) => res)
  .with({ type: 'ready', data: { type: 'text' } }, (res) => res)
  .with({ type: 'pending' }, (res) => res)
  .with({ type: 'failed' }, (res) => res)
  .exhaustive('Unhandled input')
```

### `.run()`

Execute [`match`](#matchinput) chain and return result. If all cases are matched result value will be exactly what was returned in the callback of [`.with`](#withpattern-callbackmatch) method. However, if even one case was not handled result will include `undefined`.

#### Params

The method does not accept any arguments.

#### Returns

The output of [`match`](#matchinput) chain. Can be optional if not all the conditions have been matched using [`.with`](#withpattern-callbackmatch) patterns. Use [`.otherwise`](#otherwisecallbackunmatched) if you want to provide a fallback value or to handle unknown cases.

#### Examples

##### Every case is handled

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | 'nothing' = match(input)
  .with({ text: 'something' }, (res) => res.text)
  .with({ text: 'nothing' }, (res) => res.text)
  .run()
```

##### Unhandled case

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | undefined = match(input)
  .with({ text: 'something' }, (res) => res.text)
  .run()
```

##### No cases

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: undefined = match(input).run()
```

### `.exhaustive(errorMessage)`

Use the `exhaustive` method to enforce matching in every possible case. If [`match`](#matchinput) has any unhandled errors it will show TS error during the type check. Plus it will throw an error if the unhandled case will be passed as input. This method returns strictly what has been returned using callback of [`.with`](#withpattern-callbackmatch). This method is designed to check strongly typed cases.

#### Params

- `errorMessage`
- the message of `Error` which will be thrown in case of an unhandled case
- ideally, the error should never throw, but it's useful to catch cases not typed yet immediately

#### Returns

The output of [`match`](#matchinput) chain. Use [`.run`](#run) for an optional result, or [`.otherwise`](#otherwisecallbackunmatched) if you need to handle an unknown condition.

#### Examples

##### Every case is handled

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | 'nothing' = match(input)
  .with({ text: 'something' }, (res) => res.text)
  .with({ text: 'nothing' }, (res) => res.text)
  .exhaustive('Unhandled input')
```

##### Unhandled case

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' = match(input)
  .with({ text: 'something' }, (res) => res.text)
  // will show error of unhandled `{ text: 'nothing' }` case during the type check
  // @ts-expect-error
  .exhaustive('Unhandled input')
```

### `.otherwise(callback(unmatched))`

Just like [`.run`](#run), `.otherwise` execute [`match`](#matchinput) chain and returns the result, but can be used with a callback to handle `unknown` value. The return value of callback will be combined with the output type of the [`match`](#matchinput) chain. It's not possible to call `.otherwise` if Every case is handled.

#### Params

- `callback(unmatched)`

#### Returns

The output of [`match`](#matchinput) chain, plus the result of the `callback`.

#### Examples

##### Unhandled case

```ts
let input: { text: 'something' } | { text: 'nothing' }

let output: 'something' | null = match(input)
  .with({ text: 'something' }, (res) => res.text)
  .otherwise((unmatched) => {
    console.log(unmatched.text) // will be 'nothing'
    return null
  })
```

##### No cases

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
  .with({ text: 'something' }, (res) => res.text)
  .with({ text: 'nothing' }, (res) => res.text)
  // Impossible to call because all conditions are matched
  // .otherwise((_) => '🤷‍♂️')
  .run()
```

## 🙋‍♂️ FAQ

### How it's different from the other solutions?

The difference is mostly in the size of the library. It's designed to be as small as possible and **not** to handle every possible use case. A tiny footprint of the library means more understandable code, simpler types, and almost no effect on your app bundle size.

If your project requires advanced pattern matching features, please have a look at amazing [`ts-pattern`](https://github.com/gvergnaud/ts-pattern) by [@gvergnaud](https://github.com/gvergnaud).

### Is it better than native `switch` & `case`?

It's not better, it's just a bit different. In my opinion, the result code is cleaner, especially when you need to handle nested unions, for example:

```ts
let input:
  | { type: 'idle' }
  | { type: 'ready'; data: { type: 'image' } | { type: 'text' } }

let output = match(input)
  .with({ type: 'idle' }, (res) => res)
  .with({ type: 'ready', data: { type: 'image' } }, (res) => res)
  .with({ type: 'ready', data: { type: 'text' } }, (res) => res)
  .exhaustive('Unhandled input')
```

<details><summary>The same code using <code>switch</code> statement</summary>

```ts
let input:
  | { type: 'idle' }
  | { type: 'ready'; data: { type: 'image' } | { type: 'text' } }

function exhaustive(input: never) {
  throw new Error('Unhandled input')
}

switch (input.type) {
  case 'idle': {
    /* do something */
    break
  }
  case 'ready': {
    switch (input.data.type) {
      case 'image': {
        /* do something */
        break
      }
      case 'text': {
        /* do something */
        break
      }
      default:
        exhaustive(input.data)
    }
    break
  }
  default:
    exhaustive(input)
}
```

</details>

Additionally `switch` statement can't handle checking against a type of value, which is pretty easy with `lil-match` by using constructors.

```ts
let input: number | string | boolean

let output = match(input)
  .with(Number, (res) => res)
  .with(String, (res) => res)
  .with(Boolean, (res) => res)
  .exhaustive('Unhandled input')
```

<details><summary>The same code using <code>if</code> statement</summary>

```ts
let input: number | string | boolean

function exhaustive(input: never) {
  throw new Error('Unhandled input')
}

if (typeof input === 'string') {
  /* do something */
} else if (typeof input === 'number') {
  /* do something */
} else if (typeof input === 'boolean') {
  /* do something */
} else {
  exhaustive(input)
}
```

</details>

## 🙏 Acknowledgments

- The library was heavily inspired by amazing [`ts-pattern`](https://github.com/gvergnaud/ts-pattern) and [`ts-pattern-matching`](https://github.com/WimJongeneel/ts-pattern-matching) libraries
- The icon in the title designed by [@keytofreedom](https://www.instagram.com/keytofreedom)

---

MIT © John Grishin
