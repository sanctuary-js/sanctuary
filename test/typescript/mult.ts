import {mult, __} from '../..';

// $ExpectType number
mult(2, 2);

// $ExpectType number
mult(2)(2);

// $ExpectType number
mult(__, 2)(2);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
mult('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
mult(2, 'x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
mult(2)('x');

// $ExpectError Argument of type 'Placeholder' is not assignable to parameter of type 'number'.
mult(__, 'x');

// $ExpectError Argument of type 'null' is not assignable to parameter of type 'number'.
mult(null);
