# TypeScript Nullable

[![npm version](https://img.shields.io/npm/v/typescript-nullable.svg?style=shield)](https://www.npmjs.com/package/typescript-nullable) [![CircleCI](https://circleci.com/gh/kylecorbelli/typescript-nullable.svg?style=shield)](https://circleci.com/gh/kylecorbelli/typescript-nullable) [![codecov](https://codecov.io/gh/kylecorbelli/typescript-nullable/branch/master/graph/badge.svg)](https://codecov.io/gh/kylecorbelli/typescript-nullable)

## What is This?
Glad you asked. This is a type-safe formalization of the concept of possibly absent values in TypeScript. It is perhaps even more importantly a module of type-safe utility functions that deal with possibly absent values.

Think of it roughly like a JavaScript-friendly version of Haskell’s or Elm’s `Maybe` type and corresponding module of functions for dealing with `Maybe`. It is functional to its core, with typed and curried pure functions.

## Installation
From the command line:
```
$ npm install --save typescript-nullable
```
In your TypeScript files:
```TypeScript
import { Nullable } from 'typescript-nullable'
```

## Nullable Type Definition
```TypeScript
type None = null | undefined

type Nullable<T> = T | None
```

## Module Utility Functions
This module also ships with a `Nullable` object that contains multiple useful functions for dealing with potentially absent values. Thus we have both a `Nullable` type and a `Nullable` object of utility functions.

All utility functions are curried to the extent that their _final_ argument is optional. If a final argument is not provided, the function will return another function that expects that final argument.

#### Nullable.isNone
Determines if a provided `Nullable` is `None` and provides a type guard.
###### Type Annotation
```
<T>(nullable: Nullable<T>): nullable is None
```
###### Example Usage
```TypeScript
Nullable.isNone('noob noob') // false
Nullable.isNone(null) // true
Nullable.isNone(undefined) // true

const possiblyNullValue: Nullable<string> = 'noob noob'

if (Nullable.isNone(possiblyNullValue)) {
  // in this scope, TypeScript knows possiblyNullValue is a None
}
```

#### Nullable.isSome
Determines if a provided `Nullable` is a concrete value and provides a type guard.
###### Type Annotation
```
<T>(nullable: Nullable<T>): nullable is T
```
###### Example Usage
```TypeScript
Nullable.isNone('noob noob') // true
Nullable.isNone(null) // false
Nullable.isNone(undefined) // false

const possiblyNullValue: Nullable<string> = 'noob noob'

if (Nullable.isSome(possiblyNullValue)) {
  // in this scope, TypeScript knows possiblyNullValue is a concrete string
}
```

#### Nullable.map
Applies the provided function to the provided `Nullable` only if it is not `None`. Returns `null` otherwise.
###### Type Annotation
```
<A, B>(func: (val: A) => B): (nullable: Nullable<A>) => Nullable<B>
```
###### Example Usage
```TypeScript
const toUpper = (text: string): string => text.toUpperCase()
Nullable.map(toUpper, 'noob noob') // NOOB NOOB
Nullable.map(toUpper, null) // null
Nullable.map(toUpper, undefined) // null
```

#### Nullable.withDefault
Provided a default value and a `Nullable`, will return the default value when the `Nullable` is `None`. Will return the concrete value of the `Nullable` if it is, in fact, concrete.
###### Type Annotation
```
<T>(defaultVal: T): (nullable: Nullable<T>) => T
```
###### Example Usage
```TypeScript
Nullable.withDefault('morty')('rick') // 'rick'
Nullable.withDefault('morty')(null) // 'morty'
```

#### Nullable.maybe
Provided a default value, a function, and a `Nullable`, will return the default value when the `Nullable` is `None`. Will return the provided function applied to the concrete value of the `Nullable` if it is, in fact, concrete.
###### Type Annotation
```
<A, B>(defaultVal: B, f: (a: A) => B): (nullable: Nullable<A>) => B
```
###### Example Usage
```TypeScript
import { add } from 'ramda'
Nullable.maybe(7, add(83), null)) // 7
Nullable.maybe(7, add(83), 34)) // 117
```

#### Nullable.andThen
Used for chaining functions that take a raw value of type `T` but return a `Nullable<T>`. This is like Haskell's `bind` or `>>=`.
###### Type Annotation
```
Nullable.andThen<A, B>(func: (val: A) => Nullable<B>): (nullable: Nullable<A>) => Nullable<B>
```
###### Example Usage
```TypeScript
import { compose, curry } from 'ramda'

// Some arbitrary function that returns a Nullable:
const safeDivide = curry((a: number, b: number): Nullable<number> => {
  return a === 0
    ? null
    : b / a
})

compose(
  Nullable.andThen(safeDivide(3)),
  Nullable.andThen(safeDivide(0)), // this line results in a None value so the rest of the composition chain passes along None without blowing up or throwing an exception
  Nullable.andThen(safeDivide(4)),
  safeDivide(2),
)(32) // null

compose(
  Nullable.andThen(safeDivide(3)),
  Nullable.andThen(safeDivide(5)),
  Nullable.andThen(safeDivide(4)),
  safeDivide(2),
)(32) // 0.5333333333333333
```

#### Nullable.ap
Used for writing in the applicative style. For "lifting" functions into the `Nullable` context.
###### Type Annotation
```
Nullable.ap<A, B>(targetNullable: Nullable<A>): (applicativeNullable: Nullable<(val: A) => B>) => Nullable<B>
```
###### Example Usage
```TypeScript
// Some arbitrary curried function that takes 3 concrete values:
const addThreeNumbers = (a: number) => (b: number) => (c: number) => a + b + c

compose(
  Nullable.ap(3),
  Nullable.ap(2),
  Nullable.ap(1),
)(addThreeNumbers) // 6

// This can be thought of as "lifting" addThreeNumbers into the context of its passed-in arguments being Nullable:
compose(
  Nullable.ap(3),
  Nullable.ap(null as Nullable<number>), // note we have to typecast this here because TypeScript can’t be sure what kind of Nullable<T> it has at this point.
  Nullable.ap(1),
)(addThreeNumbers) // null
```
