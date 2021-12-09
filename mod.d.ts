declare type Primitives =
  | number
  | boolean
  | string
  | symbol
  | bigint
  | undefined
  | null

declare type PickNever<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? K : never }[keyof T]
>

declare type NonEmpty<T> = {} extends T ? never : T
declare type ExcludeNever<T> = Exclude<T, NonEmpty<PickNever<T>>>

declare type DeepExtract<T, U> = T extends object
  ? U extends object
    ? Extract<
        ExcludeNever<{
          [K in keyof T]: K extends keyof U ? DeepExtract<T[K], U[K]> : T[K]
        }>,
        U
      >
    : never
  : Extract<T, U>

declare type DeepExclude<T, U> = T extends object
  ? U extends object
    ? Exclude<
        ExcludeNever<{
          [K in keyof T]: K extends keyof U ? DeepExclude<T[K], U[K]> : T[K]
        }>,
        U
      >
    : never
  : Exclude<T, U>

declare interface Guard<Input, Type extends Input> {
  (input: Input): input is Type
}

declare type Pattern<Input> =
  | Guard<Input, Input>
  | (Input extends number
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
      : Input extends object
      ? { [K in keyof Input]?: Pattern<Input[K]> }
      : never)

declare type Invert<Pattern> = Pattern extends Guard<infer _, infer P>
  ? P
  : Pattern extends NumberConstructor
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
  : Pattern extends object
  ? { [K in keyof Pattern]: Invert<Pattern[K]> }
  : never

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
