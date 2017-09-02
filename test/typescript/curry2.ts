import {and, curry2} from '../..';

// $ExpectType boolean
curry2(and)(false)(true);

// $ExpectType boolean
curry2(and, false)(true);

// $ExpectType boolean
curry2(and)(false, true);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'boolean'.
curry2(and)('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'boolean'.
curry2(and)(false)('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'boolean'.
curry2(and, false)('x');
