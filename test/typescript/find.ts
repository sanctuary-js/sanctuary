import {find, odd} from '../..';

// $ExpectType boolean
find(odd)([1, 2, 3]);

// $ExpectError Argument of type 'string[]' is not assignable to parameter of type 'number[]'.
find(odd)(['foo', 'bar']);
