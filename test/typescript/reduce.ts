import {Just, Nothing, add, reduce} from '../..';

// $ExpectType number
reduce(add)(0)([1, 2, 3]);

// $ExpectType string
reduce((s1: string) => s2 => s1 + s2)('a')(['b', 'c']);

// $ExpectType string[]
reduce((a1: Array<string>) => a2 => a1.concat(a2))([])([['a'], [], ['b', 'c']]);

// $ExpectType number
reduce(add)(0)([1, 'foo', 3]);

// TODO: Placeholder tests, foldable tests, curried version tests, type error tests

//  $ExpectType number
reduce(add)(0)(Nothing);

//  $ExpectType number
reduce(add)(0)(Just(1));
