import {slice} from '../..';

// $ExpectType Maybe<string>
slice(1)(2)('abcdef');

// $ExpectType Maybe<number[]>
slice<number>(1)(2)([1, 2, 3]);

// Inferred generic doesn't pass number[] through. This is not ideal.
// $ExpectType Maybe<{}[]>
slice(1)(2)([1, 2, 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
slice<number>(1)(2)([1, 'foo', 3]);
