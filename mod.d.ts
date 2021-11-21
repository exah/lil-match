declare const MATCH: unique symbol
declare type MATCH = typeof MATCH

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

declare type OmitMatch<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends MATCH ? K : never }[keyof T]
>

declare type NonEmpty<T> = {} extends T ? never : T
declare type OmitValue<T> = Exclude<T, NonEmpty<OmitMatch<T>>>

declare type DeepExtract<A, B, N = never> = A extends object
  ? B extends object
    ? OmitValue<{
        [K in keyof A]: K extends keyof B
          ? DeepExtract<A[K], B[K], MATCH>
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

declare interface Match<Input, Next = Input, Output = never> {
  with<P extends Pattern<Input>, O, R = DeepExtract<Input, P>>(
    pattern: P,
    callback: (result: R) => O,
  ): Match<Input, Exclude<Next, P>, O | Output>
  run(): [Next] extends [never] ? Output : Output | undefined
  otherwise: [Next] extends [never]
    ? never
    : <Fallback>(cb: (result: Next) => Fallback) => Output | Fallback
  exhaustive: [Next] extends [never] ? (errorMessage: string) => Output : never
}

export declare function match<Input>(input: Input): Match<Input>
