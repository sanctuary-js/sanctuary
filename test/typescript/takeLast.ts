import {takeLast} from '../..';

// $ExpectType Maybe<string>
takeLast(3)('abcdef');

// $ExpectType Maybe<string>
takeLast(5)('abc');

// $ExpectType Maybe<number[]>
takeLast(2)([1, 2, 3]);

// $ExpectType Maybe<(string | number)[]>
takeLast(2)([1, 'bar', 3]);
