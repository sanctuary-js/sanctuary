import {on} from '../..';

const add = (x: number) => (y: number) => x + y;

const double = (x: number) => x * 2;

// $ExpectType number
on(add)(double)(5)(10);

// These typecheck without explicit types. Blame parameter bivariance.

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
on<number, number, number>(add)(double)(5)('x');

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
on<number, number, number>(add)(double)('x')(5);
