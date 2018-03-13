import {range} from '../..';

// $ExpectType number[]
range(1)(5);

// $ExpectError Argument of type '"foo"' is not assignable to parameter of type 'number'.
range('foo');
