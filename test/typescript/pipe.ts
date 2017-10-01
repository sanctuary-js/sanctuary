import {add, sub, pipe} from '../..';

// $ExpectType number
pipe([add(1), sub(1)])(10);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
pipe([add(1), sub(1)])('x');
