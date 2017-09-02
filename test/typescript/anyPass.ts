import {anyPass, test} from '../..';

// $ExpectType boolean
anyPass([], 'abacus');

// $ExpectType boolean
anyPass([test(/a/), test(/b/), test(/c/)], 'abacus');

// $ExpectError Argument of type '1' is not assignable to parameter of type 'string'.
anyPass([test(/a/), test(/b/), test(/c/)], 1);
