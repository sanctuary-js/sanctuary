import {filter, odd} from '../..';

// $ExpectType number[]
filter(odd, [1, 2, 3, 4, 5]);

// $ExpectType number[]
filter(odd, []);

// $ExpectType number[]
filter(odd)([1, 2, 3]);

// $ExpectError Argument of type '(n: number) => 0' is not assignable to parameter of type '(q: number) => boolean'.
filter((n: number) => 0, [1, 2, 3]);

// This type checks. Sucks and it's TypeScript's fault. (see: parameter bivariance)
// $ExpectType (string | number)[]
filter(odd, [1, 'foo', 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
filter<number>(odd, [1, 'foo', 3]);

// $ExpectError Argument of type '(string | number)[]' is not assignable to parameter of type 'number[]'.
filter(odd)([1, 'foo', 3]);
