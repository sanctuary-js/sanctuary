import {last} from '../..';

// $ExpectType Maybe<string>
last('foo');

// $ExpectType Maybe<number>
last([1, 2, 3]);

// $ExpectType Maybe<number>
last<number>([1, 2, 3]);

// $ExpectType Maybe<never>
last([]);
