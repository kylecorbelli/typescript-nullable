import {
  compose,
  curry,
  toUpper,
} from 'ramda'
import { Nullable } from '.'

describe('the Nullable module', () => {
  const name: string = 'noob noob'

  describe('Nullable.map', () => {
    describe('when given a None', () => {
      it('returns a None', () => {
        const result = Nullable.map(toUpper)(null)
        expect(result).toEqual(null)
      })
    })

    describe('when given a concrete value', () => {
      it('applies the provided function to the concrete value value', () => {
        const result = Nullable.map(toUpper)(name)
        expect(result).toEqual(toUpper(name))
      })
    })
  })

  describe('Nullable.andThen', () => {
    const safeDivide = curry((a: number, b: number): Nullable<number> => {
      return a === 0
        ? null
        : b / a
    })

    describe('when we encounter a None in a composition chain', () => {
      it('gracefully handles the absence', () => {
        const result = compose(
          Nullable.andThen(safeDivide(3)),
          Nullable.andThen(safeDivide(0)),
          Nullable.andThen(safeDivide(4)),
          safeDivide(2),
        )(32)
        expect(result).toEqual(null)
      })
    })

    describe('when a composition chain works out according to plan', () => {
      it('returns our desired result', () => {
        const result = compose(
          Nullable.andThen(safeDivide(3)),
          Nullable.andThen(safeDivide(5)),
          Nullable.andThen(safeDivide(4)),
          safeDivide(2),
        )(32)
        expect(result).toEqual(32 / 2 / 4 / 5 / 3)
      })
    })
  })

  describe('Nullable.withDefault', () => {
    describe('when given a default value and a None', () => {
      it('returns the default value', () => {
        const result = Nullable.withDefault(name)(null)
        expect(result).toBe(name)
      })
    })

    describe('when given a default value and a concrete value', () => {
      it('returns the concrete value value', () => {
        const result = Nullable.withDefault('foo')(name)
        expect(result).toBe(name)
      })
    })
  })

  describe('Nullable.ap', () => {
    describe('when the applicative Nullable is None', () => {
      it('returns a None', () => {
        const result = Nullable.ap(name)(null)
        expect(result).toEqual(null)
      })
    })

    describe('when the target Nullable is None', () => {
      it('returns a None', () => {
        const result = Nullable.ap(null as Nullable<string>)(toUpper)
        expect(result).toEqual(null)
      })
    })

    describe('when both the applicative and target Nullables are Justs', () => {
      it('applies the wrapped function in the applicative Nullable to value in the target Nullable', () => {
        const result = Nullable.ap(name)(toUpper)
        expect(result).toEqual(toUpper(name))
      })
    })

    describe('lifting functions', () => {
      const addThreeNumbers = (a: number) => (b: number) => (c: number) => a + b + c

      describe('when everything goes according to plan', () => {
        it('lifts a "regular" function into Nullable context and returns the correct value', () => {
          const result = compose(
            Nullable.ap(3),
            Nullable.ap(2),
            Nullable.ap(1),
          )(addThreeNumbers)
          expect(result).toBe(1 + 2 + 3)
        })
      })

      describe('when we exprience an absence', () => {
        it('lifts a "regular" function into Nullable context and returns null', () => {
          const result = compose(
            Nullable.ap(3),
            Nullable.ap(null as Nullable<number>),
            Nullable.ap(1),
          )(addThreeNumbers)
          expect(result).toBe(null)
        })
      })
    })
  })
})
