import {__, anyPass, test} from '../..';

// $ExpectType boolean
anyPass([], 'abacus');

// $ExpectType boolean
anyPass([test(/a/), test(/b/), test(/c/)], 'abacus');

// $ExpectType boolean
anyPass([test(/a/), test(/b/), test(/c/)])('abacus');

// $ExpectType boolean
anyPass(__, 'abacus')([test(/a/), test(/b/), test(/c/)]);

// $ExpectError Argument of type '((s: string) => boolean)[]' is not assignable to parameter of type 'Placeholder'.
anyPass([test(/a/), test(/b/), test(/c/)], 1);
