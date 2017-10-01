import {drop} from '../..';

// $ExpectType Maybe<string>
drop(3)('abcdef');

// $ExpectType Maybe<string>
drop(5)('abc');

// $ExpectType Maybe<number[]>
drop(2)([1, 2, 3]);

// $ExpectType Maybe<(string | number)[]>
drop(2)([1, 'bar', 3]);
