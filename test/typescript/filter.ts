import {filter, odd} from '../..';

// $ExpectType number[]
filter(odd)([]);

// $ExpectType number[]
filter(odd)([1, 2, 3]);

// $ExpectError Argument of type '(n: number) => 0' is not assignable to parameter of type '(q: number) => boolean'.
filter((n: number) => 0)([1, 2, 3]);
