import {init} from '../..';

// $ExpectType Maybe<string>
init('foo');

// $ExpectType Maybe<number[]>
init([1, 2, 3]);

// $ExpectType Maybe<number[]>
init<number>([1, 2, 3]);

// $ExpectType Maybe<never[]>
init([]);
