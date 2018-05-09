import { curry } from 'ramda'

export type None = null | undefined

export type Nullable<T> = T | None

function isNone<T> (nullable: Nullable<T>): boolean {
  return nullable === null || nullable === undefined
}

function nullableMap<A, B> (func: (val: A) => B, nullable: Nullable<A>): Nullable<B> {
  return isNone(nullable)
    ? null
    : func(nullable as A)
}

function nullableWithDefault<T> (defaultVal: T, nullable: Nullable<T>): T {
  return isNone(nullable)
    ? defaultVal
    : nullable as T
}

function nullableAndThen<A, B> (func: (val: A) => Nullable<B>, nullable: Nullable<A>): Nullable<B> {
  return isNone(nullable)
    ? null
    : func(nullable as A)
}

function nullableAp<A, B> (
  applicativeNullable: Nullable<(val: A) => B>,
  targetNullable: Nullable<A>,
): Nullable<B> {
  return isNone(applicativeNullable) || isNone(targetNullable)
    ? null
    : (applicativeNullable as (val: A) => B)(targetNullable as A)
}

export const Nullable = {
  andThen: curry(nullableAndThen),
  ap: curry(nullableAp),
  map: curry(nullableMap),
  withDefault: curry(nullableWithDefault),
}
