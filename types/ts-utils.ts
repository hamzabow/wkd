// Helper type to extract all values of a union type
type UnionToArray<T> = T extends any ? (arg: T) => void : never
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void ? I
  : never

export type UnionToTuple<T> = UnionToIntersection<UnionToArray<T>> extends
  (_: infer E) => void ? [...UnionToTuple<Exclude<T, E>>, E]
  : []

export type Prettify<T> =
  & {
    [K in keyof T]: T[K]
  }
  & {}

export type ObjectValues<T> = T[keyof T]

// Utility type to enforce "subset" relationship
export type SubUnion<T, U extends T> = U
export type Satisfies<T, U extends T> = U

export type ConditionalProperty<O, T, U> = T extends U ? O : {}
