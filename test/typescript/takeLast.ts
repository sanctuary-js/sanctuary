import {takeLast} from '../..';

// $ExpectType Maybe<string>
takeLast(3)('abcdef');

// $ExpectType Maybe<string>
takeLast(5)('abc');

// $ExpectType Maybe<number[]>
takeLast<number>(2)([1, 2, 3]);

// Inferred generic doesn't pass number[] through. This is not ideal.
// $ExpectType Maybe<{}[]>
takeLast(2)([1, 2, 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
takeLast<number>(2)([1, 'bar', 3]);
