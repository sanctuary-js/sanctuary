import {add, concat, reduce} from '../..';

// $ExpectType number
reduce(add, 0, [1, 2, 3]);

// $ExpectType string
reduce(s1 => s2 => s1 + s2, 'a', ['b', 'c']);

// $ExpectType string[]
reduce(a1 => a2 => concat(a1, a2), [], [['a'], [], ['b', 'c']]);

// This type checks. Sucks and it's TypeScript's fault. (see: parameter bivariance)
// $ExpectType number
reduce(add, 0, [1, 'foo', 3]);

// This is how the user fixes the above in TS's current state. Sucks.
// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'Foldable<number>'.
reduce<number, number>(add, 0, [1, 'foo', 3]);

// Curried usage also behaves better.
// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
reduce(add)(0)([1, 'foo', 3]);

// TODO: Placeholder tests, foldable tests, curried version tests, type error tests
