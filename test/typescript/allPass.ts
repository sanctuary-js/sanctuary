import {allPass, test} from '../..';

// $ExpectType boolean
allPass([], 'abacus');

// $ExpectType boolean
allPass([test(/a/), test(/b/), test(/c/)], 'abacus');

// $ExpectType boolean
allPass([test(/a/), test(/b/), test(/c/)])('abacus');

// $ExpectError Argument of type '1' is not assignable to parameter of type 'string'.
allPass([test(/a/), test(/b/), test(/c/)], 1);
