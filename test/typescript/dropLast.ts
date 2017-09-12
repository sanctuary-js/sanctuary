import {dropLast} from '../..';

// $ExpectType Maybe<string>
dropLast(3)('abcdef');

// $ExpectType Maybe<string>
dropLast(5)('abc');

// $ExpectType Maybe<number[]>
dropLast<number>(2)([1, 2, 3]);

// Inferred generic doesn't pass number[] through. This is not ideal.
// $ExpectType Maybe<{}[]>
dropLast(2)([1, 2, 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
dropLast<number>(2)([1, 'bar', 3]);
