import {map, mult} from '../..';

// $ExpectType number[]
map(n => n * 2)([1, 2, 3]);

// $ExpectType string[]
map(a => a + 's')(['cat', 'dog']);

// $ExpectType number[]
map(mult(2))([1, 2, 3]);

// $ExpectError The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.
map(n => n * 2)(['foo', 1, 2]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
map(mult(2))(['foo', 1, 2]);

// TODO: Add tests using Maybe, Either, Functor, placeholder params
