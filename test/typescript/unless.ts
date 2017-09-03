import {__, unless} from '../..';

function lt0(x: number): boolean {
  return x < 0;
}

// $ExpectType number
unless(lt0, Math.sqrt, 16);

// $ExpectType number
unless(lt0, Math.sqrt, -1);

// $ExpectType number
unless(lt0, Math.sqrt)(-1);

// $ExpectType number
unless(lt0)(Math.sqrt, -1);

// $ExpectType number
unless(lt0)(Math.sqrt)(-1);

// $ExpectType number
unless(__, Math.sqrt, -1)(lt0);

// $ExpectType number
unless(__, Math.sqrt)(lt0)(-1);

// $ExpectType number
unless(lt0, __, -1)(Math.sqrt);

// $ExpectType number
unless(__, __, -1)(lt0)(Math.sqrt);

// $ExpectError Argument of type '(x: number) => boolean' is not assignable to parameter of type 'Placeholder'.
unless(lt0, Math.sqrt, 'x');
