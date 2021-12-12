type Primitives = number | boolean | string | symbol | bigint | undefined | null

type IsOpaque<T> = T extends object
  ? T extends Primitives
    ? true
    : false
  : false

type IsEmpty<T> = {} extends T ? true : false
type NonEmpty<T> = IsEmpty<T> extends true ? never : T

type PickNever<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? K : never }[keyof T]
>

type ExcludeNever<T> = Exclude<T, NonEmpty<PickNever<T>>>

type DeepExtract<T, U> = IsOpaque<T> extends true
  ? Extract<T, U>
  : T extends object
  ? U extends object
    ? Extract<
        ExcludeNever<{
          [K in keyof T]: K extends keyof U ? DeepExtract<T[K], U[K]> : T[K]
        }>,
        U
      >
    : never
  : Extract<T, U>

type DeepExclude<T, U> = IsOpaque<T> extends true
  ? Exclude<T, U>
  : T extends object
  ? U extends object
    ? Exclude<
        ExcludeNever<{
          [K in keyof T]: K extends keyof U ? DeepExclude<T[K], U[K]> : T[K]
        }>,
        U
      >
    : never
  : Exclude<T, U>

interface Guard<Input, Type = Input> {
  (input: Input): input is Type extends Input ? Type : Input
}

type Pattern<Input> =
  | Guard<Input>
  | (Input extends Primitives
      ? Input
      : Input extends object
      ? { [K in keyof Input]?: Pattern<Input[K]> }
      : never)

type Invert<Pattern> = Pattern extends Guard<infer _, infer P>
  ? P
  : Pattern extends Primitives
  ? Pattern
  : Pattern extends object
  ? { [K in keyof Pattern]: Invert<Pattern[K]> }
  : never

interface NonExhaustive<_> {}

type i = string | symbol | number | bigint | boolean
type p = Guard<number | bigint, bigint>
type a = DeepExtract<i, Invert<p>>

interface Match<Input, Next = Input, Output = never> {
  with<P extends Pattern<Input>, O, I = Invert<P>, R = DeepExtract<Input, I>>(
    pattern: P,
    callback: (result: R) => O,
  ): Match<Exclude<Input, I>, DeepExclude<Next, I>, O | Output>
  with<
    P extends Pattern<Input>[],
    O,
    I = Invert<P[number]>,
    R = DeepExtract<Input, I>,
  >(
    ...args: [...patterns: P, callback: (result: R) => O]
  ): Match<Exclude<Input, I>, DeepExclude<Next, I>, O | Output>
  run(): [Next] extends [never] ? Output : Output | undefined
  otherwise: [Next] extends [never]
    ? never
    : <Fallback>(cb: (result: Next) => Fallback) => Output | Fallback
  exhaustive: [Next] extends [never]
    ? (errorMessage: string) => Output
    : NonExhaustive<Next>
}

export declare function is<
  T extends
    | NumberConstructor
    | StringConstructor
    | BooleanConstructor
    | SymbolConstructor
    | BigIntConstructor
    | ObjectConstructor
    | (abstract new (...args: any) => any),
>(
  type: T,
): (
  input: unknown,
) => input is T extends NumberConstructor
  ? number
  : T extends StringConstructor
  ? string
  : T extends BooleanConstructor
  ? boolean
  : T extends SymbolConstructor
  ? symbol
  : T extends BigIntConstructor
  ? bigint
  : T extends ObjectConstructor
  ? object
  : T extends abstract new (...args: any) => infer C
  ? C
  : never

export declare function match<Input>(input: Input): Match<Input>
