import {prepend} from '../..';

// $ExpectType number[]
prepend(3)([1, 2]);

// $ExpectError Argument of type 'number[]' is not assignable to parameter of type 'string[]'.
prepend('foo')([1, 2]);
