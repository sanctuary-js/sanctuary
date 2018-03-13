import {slice} from '../..';

// $ExpectType Maybe<string>
slice(1)(2)('abcdef');

// $ExpectType Maybe<number[]>
slice(1)(2)([1, 2, 3]);

// $ExpectType Maybe<(string | number)[]>
slice(1)(2)([1, 'foo', 3]);
