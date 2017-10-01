import {add, concat, reduce} from '../..';

// $ExpectType number
reduce(add)(0)([1, 2, 3]);

// $ExpectType string
reduce((s1: string) => s2 => s1 + s2)('a')(['b', 'c']);

// $ExpectType string[]
reduce((a1: string[]) => a2 => concat(a1)(a2))([])([['a'], [], ['b', 'c']]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
reduce(add)(0)([1, 'foo', 3]);

// TODO: Placeholder tests, foldable tests, curried version tests, type error tests
