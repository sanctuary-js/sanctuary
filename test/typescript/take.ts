import {take} from '../..';

// $ExpectType Maybe<string>
take(3)('abcdef');

// $ExpectType Maybe<string>
take(5)('abc');

// $ExpectType Maybe<number[]>
take(2)([1, 2, 3]);

// $ExpectType Maybe<(string | number)[]>
take(2)([1, 'bar', 3]);
