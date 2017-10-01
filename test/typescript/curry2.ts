import {curry2} from '../..';

function add(a: number, b: number): number {
  return a + b;
}

// $ExpectType number
curry2(add)(1)(2);

// $ExpectType number
curry2(add, 1)(2);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
curry2(add)('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
curry2(add)(1)('x');
