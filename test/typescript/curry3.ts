import {curry3} from '../..';

function mult3(x: number, y: number, z: number): number {
  return x * y * z;
}

const curried = curry3(mult3);

// $ExpectType number
curried(1)(2)(3);

// $ExpectType number
curried(1, 2)(3);

// $ExpectType number
curried(1, 2, 3);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
curried(1)(2)('x');
