# TypeScript Nullable

[![CircleCI](https://circleci.com/gh/kylecorbelli/typescript-nullable.svg?style=shield)](https://circleci.com/gh/kylecorbelli/typescript-nullable)

[![codecov](https://codecov.io/gh/kylecorbelli/typescript-nullable/branch/master/graph/badge.svg)](https://codecov.io/gh/kylecorbelli/typescript-nullable)

## What is This?
Glad you asked. This is a type-safe formalization of the concept of possibly absent values in TypeScript. It is perhaps even more importantly a module of type-safe utility functions that deal with possibly absent values.

Think of it like Haskell’s or Elm’s `Maybe` type and corresponding module of functions for dealing with `Maybe`. It is functional to its core, with typed and curried pure functions.

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
export type None = null | undefined

export type Nullable<T> = T | None
```

## Module Utility Functions
Note: none of these functions takes more than one argument at a time. If one of them does require more than one input, it takes them one at a time. For example, instead of something like `add(2, 5)` it would be called like `add(2)(5)`. Like Haskell but with parens.

#### Nullable.isNone
Determines if a provided `Nullable` is `None`.
###### Type Annotation
```
Nullable.isNone<T> :: (nullable: Nullable<T>): boolean
```
###### Example Usage
```TypeScript
Nullable.isNone('noob noob') // false
Nullable.isNone(null) // true
Nullable.isNone(undefined) // true
```

#### Nullable.map
Applies the provided function to the provided `Nullable` only if it is not `None`. Returns `null` otherwise.
###### Type Annotation
```
Nullable.map<A, B> :: (func: (val: A) => B): (nullable: Nullable<A>) => Nullable<B>
```
###### Example Usage
```TypeScript
const toUpper = (text: string): string => text.toUpperCase()
Nullable.map(toUpper)('noob noob') // NOOB NOOB
Nullable.map(toUpper)(null) // null
Nullable.map(toUpper)(undefined) // null
```

#### Nullable.withDefault
Provided a default value and a `Nullable`, will return the default value when the `Nullable` is `None`. Will return the concrete value of the `Nullable` if it is, in fact, concrete.
###### Type Annotation
```
Nullable.withDefault<T> :: (defaultVal: T): (nullable: Nullable<T>) => T
```
###### Example Usage
```TypeScript
Nullable.withDefault('morty')('rick') // 'rick'
Nullable.withDefault('morty')(null) // 'morty'
```

#### Nullable.andThen
Used for chaining functions that take a raw value of type `T` but return a `Nullable<T>`. This is like Haskell's `bind` or `>>=`.
###### Type Annotation
```
Nullable.andThen<A, B> :: (func: (val: A) => Nullable<B>): (nullable: Nullable<A>) => Nullable<B>
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
  Nullable.andThen(safeDivide(0)),
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
Nullable.ap<A, B> :: (targetNullable: Nullable<A>): (applicativeNullable: Nullable<(val: A) => B>) => Nullable<B>
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
