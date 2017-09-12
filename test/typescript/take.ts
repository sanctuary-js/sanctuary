import {take} from '../..';

// $ExpectType Maybe<string>
take(3)('abcdef');

// $ExpectType Maybe<string>
take(5)('abc');

// $ExpectType Maybe<number[]>
take<number>(2)([1, 2, 3]);

// Inferred generic doesn't pass number[] through. This is not ideal.
// $ExpectType Maybe<{}[]>
take(2)([1, 2, 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
take<number>(2)([1, 'bar', 3]);
