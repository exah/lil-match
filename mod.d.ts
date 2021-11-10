declare const UNKNOWN: unique symbol
declare type UNKNOWN = typeof UNKNOWN

declare type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>
}

declare type OmitUnknown<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends UNKNOWN ? K : never }[keyof T]
>

declare type NonEmpty<T> = {} extends T ? never : T
declare type OmitValue<T> = Exclude<T, NonEmpty<OmitUnknown<T>>>

declare type DeepExtract<
  A,
  B extends DeepPartial<A>,
  N = never,
> = A extends object
  ? B extends object
    ? OmitValue<{
        [K in keyof A]: K extends keyof B
          ? DeepExtract<A[K], B[K], UNKNOWN>
          : A[K]
      }>
    : UNKNOWN
  : A extends B
  ? A
  : N

declare type Primitives =
  | number
  | boolean
  | string
  | symbol
  | bigint
  | undefined
  | null

declare type Pattern<Input> = Input extends Primitives
  ? Input
  : { readonly [K in keyof Input]?: Pattern<Input[K]> }

interface Match<Input, Output = never> {
  with<P extends Pattern<Input>, O>(
    pattern: P,
    callback: (result: DeepExtract<Input, P>) => O,
  ): Match<Exclude<Input, P>, O | Output>
  run(): [Input] extends [never] ? Output : Output | undefined
  otherwise: [Input] extends [never]
    ? never
    : <Fallback>(cb: (result: Input) => Fallback) => Output | Fallback
  exhaustive: [Input] extends [never] ? (errorMessage: string) => Output : never
}

export declare function match<Input, Output = never>(
  input: Input,
): Match<Input, Output>
