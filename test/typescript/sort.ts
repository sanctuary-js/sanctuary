import {sort} from '../..';

// $ExpectType number[]
sort([2, 3, 1]);

// $ExpectType (string | number)[]
sort([1, 'foo', 3]);
