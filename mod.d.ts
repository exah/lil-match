declare const TOKEN: unique symbol
declare type TOKEN = typeof TOKEN

declare type Primitives =
  | number
  | boolean
  | string
  | symbol
  | bigint
  | undefined
  | null

declare type IsPlainObject<T> = T extends object
  ? T extends Primitives
    ? false
    : true
  : false

declare type OmitToken<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends TOKEN ? K : never }[keyof T]
>

declare type NonEmpty<T> = {} extends T ? never : T
declare type OmitValue<T> = Exclude<T, NonEmpty<OmitToken<T>>>

declare type DeepExtract<T, U, N = never> = T extends object
  ? U extends object
    ? OmitValue<{
        [K in keyof T]: K extends keyof U
          ? DeepExtract<T[K], U[K], TOKEN>
          : T[K]
      }>
    : N
  : T extends U
  ? T
  : N

declare type Pattern<Input> = Input extends number
  ? Input | NumberConstructor
  : Input extends string
  ? Input | StringConstructor
  : Input extends boolean
  ? Input | BooleanConstructor
  : Input extends symbol
  ? Input | SymbolConstructor
  : Input extends bigint
  ? Input | BigIntConstructor
  : Input extends Primitives
  ? Input
  : IsPlainObject<Input> extends true
  ? { [K in keyof Input]?: Pattern<Input[K]> }
  : never

declare type Invert<Pattern> = Pattern extends NumberConstructor
  ? number
  : Pattern extends StringConstructor
  ? string
  : Pattern extends BooleanConstructor
  ? boolean
  : Pattern extends SymbolConstructor
  ? symbol
  : Pattern extends BigIntConstructor
  ? bigint
  : Pattern extends Primitives
  ? Pattern
  : IsPlainObject<Pattern> extends true
  ? { [K in keyof Pattern]: Invert<Pattern[K]> }
  : never

declare type DeepExclude<T, U, N = never> = T extends object
  ? U extends object
    ? OmitValue<{
        [K in keyof T]: K extends keyof U
          ? DeepExclude<T[K], U[K], TOKEN>
          : T[K]
      }>
    : N
  : T extends U
  ? N
  : T

declare interface NonExhaustive<_> {}

declare interface Match<Input, Next = Input, Output = never> {
  with<P extends Pattern<Input>, O, I = Invert<P>, R = DeepExtract<Input, I>>(
    pattern: P,
    callback: (result: R) => O,
  ): Match<Exclude<Input, I>, DeepExclude<Next, I>, O | Output>
  with<
    P extends [Pattern<Input>, ...Pattern<Input>[]],
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

export declare function match<Input>(input: Input): Match<Input>
