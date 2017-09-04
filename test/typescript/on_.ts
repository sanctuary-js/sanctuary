import {on_} from '../..';

function add(x: number, y: number): number {
  return x + y;
}

function double(x: number): number {
  return x * 2;
}

// $ExpectType number
on_(add, double, 5, 10);

// $ExpectType number
on_(add, double)(5, 10);

// // $ExpectType number
on_(add, double)(5)(10);

// $ExpectType number
on_(add)(double)(5)(10);

// These typecheck without explicit types. Blame parameter bivariance.

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
on_<number, number, number>(add)(double)(5)('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
on_<number, number, number>(add)(double)('x')(5);
