import {head} from '../..';

// $ExpectType Maybe<string>
head('foo');

// $ExpectType Maybe<number>
head([1, 2, 3]);

// $ExpectType Maybe<number>
head<number>([1, 2, 3]);

// $ExpectType Maybe<never>
head([]);
