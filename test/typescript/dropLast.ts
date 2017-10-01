import {dropLast} from '../..';

// $ExpectType Maybe<string>
dropLast(3)('abcdef');

// $ExpectType Maybe<string>
dropLast(5)('abc');

// $ExpectType Maybe<number[]>
dropLast(2)([1, 2, 3]);

// $ExpectType Maybe<(string | number)[]>
dropLast(2)([1, 'bar', 3]);
