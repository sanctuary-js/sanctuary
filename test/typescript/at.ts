import {at} from '../..';

// $ExpectType Maybe<string>
at(3)('foo');

// $ExpectType Maybe<number>
at(3)([1, 2, 3]);
