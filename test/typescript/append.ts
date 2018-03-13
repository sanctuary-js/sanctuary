import {append} from '../..';

// $ExpectType number[]
append(3)([1, 2]);

// $ExpectType Applicative<string>
append('foo')([1, 2]);
