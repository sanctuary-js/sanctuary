import {append} from '../..';

// $ExpectType number[]
append(3)([1, 2]);

// $ExpectError Argument of type 'number[]' is not assignable to parameter of type 'string[]'.
append('foo')([1, 2]);
