import {when} from '../..';

function gte0(x: number): boolean {
  return x >= 0;
}

// $ExpectType number
when(gte0, Math.sqrt, 16);

// $ExpectType number
when(gte0, Math.sqrt, -1);

// $ExpectType number
when(gte0, Math.sqrt)(-1);

// $ExpectType number
when(gte0)(Math.sqrt, -1);

// $ExpectType number
when(gte0)(Math.sqrt)(-1);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
when(gte0, Math.sqrt, 'x');
