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

declare type DeepExtract<A, B, N = never> = A extends object
  ? B extends object
    ? OmitValue<{
        [K in keyof A]: K extends keyof B
          ? DeepExtract<A[K], B[K], TOKEN>
          : A[K]
      }>
    : N
  : A extends B
  ? A
  : N

declare type Pattern<Input> = Input extends Primitives
  ? Input
  : IsPlainObject<Input> extends true
  ? { [K in keyof Input]?: Pattern<Input[K]> }
  : never

declare type DeepExclude<A, B, N = never> = A extends object
  ? A extends string
    ? N
    : B extends object
    ? OmitValue<{
        [K in keyof A]: K extends keyof B
          ? DeepExclude<A[K], B[K], TOKEN>
          : A[K]
      }>
    : N
  : A extends B
  ? N
  : A

declare interface NonExhaustive<_> {}

declare interface Match<Input, Next = Input, Output = never> {
  with<P extends Pattern<Input>, O, R = DeepExtract<Input, P>>(
    pattern: P,
    callback: (result: R) => O,
  ): Match<Input, DeepExclude<Next, P>, O | Output>
  run(): [Next] extends [never] ? Output : Output | undefined
  otherwise: [Next] extends [never]
    ? never
    : <Fallback>(cb: (result: Next) => Fallback) => Output | Fallback
  exhaustive: [Next] extends [never]
    ? (errorMessage: string) => Output
    : NonExhaustive<Next>
}

export declare function match<Input>(input: Input): Match<Input>
