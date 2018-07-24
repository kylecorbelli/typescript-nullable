export type None = null | undefined

export type Nullable<T> = T | None

const isNone = <T>(nullable: Nullable<T>): nullable is None =>
  nullable === null || nullable === undefined

const isSome = <T>(nullable: Nullable<T>): nullable is T =>
  nullable !== null && nullable !== undefined

const mapHelper = <A, B> (func: (val: A) => B, nullable: Nullable<A>): Nullable<B> =>
  nullable !== undefined && nullable !== null
    ? func(nullable)
    : null

function map <A, B> (func: (val: A) => B, nullable: Nullable<A>): Nullable<B>
function map <A, B> (func: (val: A) => B): (nullable: Nullable<A>) => Nullable<B>
function map <A, B> (func: (val: A) => B, nullable?: Nullable<A>) {
  return arguments.length === 1
    ? (nullable_: Nullable<A>): Nullable<B> => mapHelper(func, nullable_)
    : mapHelper(func, nullable)
}

const maybeHelper = <A, B> (defaultVal: B, f: (a: A) => B, nullable: Nullable<A>): B =>
  nullable !== undefined && nullable !== null
    ? f(nullable)
    : defaultVal

function maybe <A, B> (defaultVal: B, f: (a: A) => B, nullable: Nullable<A>): B
function maybe <A, B> (defaultVal: B, f: (a: A) => B): (nullable: Nullable<A>) => B
function maybe <A, B> (defaultVal: B, f: (a: A) => B, nullable?: Nullable<A>) {
  return arguments.length === 2
    ? (nullable_: Nullable<A>): B => maybeHelper(defaultVal, f, nullable_)
    : maybeHelper(defaultVal, f, nullable)
}

const withDefaultHelper = <T> (defaultVal: T, nullable: Nullable<T>): T =>
  nullable !== undefined && nullable !== null
    ? nullable
    : defaultVal

function withDefault <T> (defaultVal: T, nullable: Nullable<T>): T
function withDefault <T> (defaultVal: T): (nullable: Nullable<T>) => T
function withDefault <T> (defaultVal: T, nullable?: Nullable<T>) {
  return arguments.length === 1
    ? (nullable_: Nullable<T>): T => withDefaultHelper(defaultVal, nullable_)
    : withDefaultHelper(defaultVal, nullable)
}

const andThenHelper = <A, B> (func: (val: A) => Nullable<B>, nullable: Nullable<A>): Nullable<B> =>
  nullable !== undefined && nullable !== null
    ? func(nullable)
    : null

function andThen <A, B> (func: (val: A) => Nullable<B>, nullable: Nullable<A>): Nullable<B>
function andThen <A, B> (func: (val: A) => Nullable<B>): (nullable: Nullable<A>) => Nullable<B>
function andThen <A, B> (func: (val: A) => Nullable<B>, nullable?: Nullable<A>) {
  return arguments.length === 1
    ? (nullable_: Nullable<A>): Nullable<B> => andThenHelper(func, nullable_)
    : andThenHelper(func, nullable)
}

const apHelper = <A, B> (targetNullable: Nullable<A>, applicativeNullable: Nullable<(val: A) => B>): Nullable<B> =>
  (targetNullable !== undefined && targetNullable !== null)
    && (applicativeNullable !== undefined && applicativeNullable !== null)
      ? applicativeNullable(targetNullable)
      : null

function ap <A, B> (targetNullable: Nullable<A>, applicativeNullable: Nullable<(val: A) => B>): Nullable<B>
function ap <A, B> (targetNullable: Nullable<A>): (applicativeNullable: Nullable<(val: A) => B>) => Nullable<B>
function ap <A, B> (targetNullable: Nullable<A>, applicativeNullable?: Nullable<(val: A) => B>) {
  return arguments.length === 1
    ? (applicativeNullable_: Nullable<(val: A) => B>): Nullable<B> => apHelper(targetNullable, applicativeNullable_)
    : apHelper(targetNullable, applicativeNullable)
}

export const Nullable = {
  andThen,
  ap,
  isNone,
  isSome,
  map,
  maybe,
  withDefault,
}
