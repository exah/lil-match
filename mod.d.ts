declare type Pattern<Input> = Input extends string | number | boolean
  ? Input
  : { [K in keyof Input]?: Pattern<Input[K]> }

interface Match<Input, Output = never> {
  with<P extends Pattern<Input>, O>(
    pattern: P,
    callback: (value: Input extends P ? Input : never) => O,
  ): Match<Exclude<Input, P>, O | Output>
  exhaustive: [Input] extends [never] ? (errorMessage: string) => Output : never
  get<FallbackValue = undefined>(
    fallback?: FallbackValue,
  ): [Input] extends [never] ? Output : Output | FallbackValue
}

export declare function match<Input, Output = never>(
  input: Input,
): Match<Input, Output>
