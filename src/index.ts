export type None = null | undefined

export type Nullable<T> = T | None

function nullableIsNone<T> (nullable: Nullable<T>): boolean {
  return nullable === null || nullable === undefined
}

function nullableMap<A, B> (func: (val: A) => B): (nullable: Nullable<A>) => Nullable<B> {
  return function (nullable: Nullable<A>): Nullable<B> {
    return nullableIsNone(nullable)
      ? null
      : func(nullable as A)
  }
}

function nullableWithDefault<T> (defaultVal: T): (nullable: Nullable<T>) => T {
  return function (nullable: Nullable<T>): T {
    return nullableIsNone(nullable)
      ? defaultVal
      : nullable as T
  }
}

function nullableAndThen<A, B> (func: (val: A) => Nullable<B>): (nullable: Nullable<A>) => Nullable<B> {
  return function (nullable: Nullable<A>): Nullable<B> {
    return nullableIsNone(nullable)
      ? null
      : func(nullable as A)
  }
}

function nullableAp<A, B> (applicativeNullable: Nullable<(val: A) => B>): (targetNullable: Nullable<A>) => Nullable<B> {
  return function (targetNullable: Nullable<A>): Nullable<B> {
    return nullableIsNone(applicativeNullable) || nullableIsNone(targetNullable)
      ? null
      : (applicativeNullable as (val: A) => B)(targetNullable as A)
  }
}

export const Nullable = {
  andThen: nullableAndThen,
  ap: nullableAp,
  isNone: nullableIsNone,
  map: nullableMap,
  withDefault: nullableWithDefault,
}
