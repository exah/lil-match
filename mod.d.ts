declare type Pattern<Input> = Input extends number
  ? Input
  : Input extends string
  ? Input
  : Input extends boolean
  ? Input
  : Input extends Array<infer Item>
  ? Pattern<Item>[]
  : { [K in keyof Input]?: Pattern<Input[K]> }

interface Match<Input, Output, Result = never> {
  with<P extends Pattern<Input>, O>(
    pattern: P,
    callback: (value: Input extends P ? Input : never) => O,
  ): Match<Exclude<Input, P>, O, Output>
  exhaustive: [Input] extends [never] ? () => Output | Result : never
  run(): Output | Result | void
}

export declare function match<Input, Output, Result = never>(
  input: Input,
): Match<Input, Output, Result>
