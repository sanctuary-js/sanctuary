import {__, when} from '../..';

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

// $ExpectType number
when(__, Math.sqrt, -1)(gte0);

// $ExpectType number
when(__, Math.sqrt)(gte0)(-1);

// $ExpectType number
when(gte0, __, -1)(Math.sqrt);

// $ExpectType number
when(__, __, -1)(gte0)(Math.sqrt);

// $ExpectError Argument of type '(x: number) => boolean' is not assignable to parameter of type 'Placeholder'.
when(gte0, Math.sqrt, 'x');
