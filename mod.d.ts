declare type Pattern<Input> = Input extends string | number | boolean
  ? Input
  : { [K in keyof Input]?: Pattern<Input[K]> }

interface Match<Input, Output = never> {
  with<P extends Pattern<Input>, O>(
    pattern: P,
    callback: (result: Input extends P ? Input : never) => O,
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
