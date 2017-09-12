import {tail} from '../..';

// $ExpectType Maybe<string>
tail('foo');

// $ExpectType Maybe<number[]>
tail([1, 2, 3]);

// $ExpectType Maybe<number[]>
tail<number>([1, 2, 3]);

// $ExpectType Maybe<never[]>
tail([]);
