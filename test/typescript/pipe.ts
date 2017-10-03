import {add, sub, pipe} from '../..';

// $ExpectType any
pipe([add(1), sub(1)])(10);

// $ExpectType any
pipe([add(1), sub(1)])('x');
