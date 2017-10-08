import {prepend} from '../..';

// $ExpectType number[]
prepend(3)([1, 2]);

// $ExpectType Applicative<string>
prepend('foo')([1, 2]);
