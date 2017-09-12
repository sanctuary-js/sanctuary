import {drop} from '../..';

// $ExpectType Maybe<string>
drop(3)('abcdef');

// $ExpectType Maybe<string>
drop(5)('abc');

// $ExpectType Maybe<number[]>
drop<number>(2)([1, 2, 3]);

// Inferred generic doesn't pass number[] through. This is not ideal.
// $ExpectType Maybe<{}[]>
drop(2)([1, 2, 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
drop<number>(2)([1, 'bar', 3]);
