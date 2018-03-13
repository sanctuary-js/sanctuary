import {mult} from '../..';

// $ExpectType number
mult(2)(2);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
mult('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
mult(2)('x');

// $ExpectError Argument of type 'null' is not assignable to parameter of type 'number'.
mult(null);
