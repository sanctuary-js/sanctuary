import {__, allPass, test} from '../..';

// $ExpectType boolean
allPass([], 'abacus');

// $ExpectType boolean
allPass([test(/a/), test(/b/), test(/c/)], 'abacus');

// $ExpectType boolean
allPass([test(/a/), test(/b/), test(/c/)])('abacus');

// $ExpectType boolean
allPass(__, 'abacus')([test(/a/), test(/b/), test(/c/)]);

// $ExpectError Argument of type '((s: string) => boolean)[]' is not assignable to parameter of type 'Placeholder'.
allPass([test(/a/), test(/b/), test(/c/)], 1);
