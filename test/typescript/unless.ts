import {unless} from '../..';

function lt0(x: number): boolean {
  return x < 0;
}

// $ExpectType number
unless(lt0)(Math.sqrt)(16);

// $ExpectType number
unless(lt0)(Math.sqrt)(-1);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
unless(lt0)(Math.sqrt)('x');
