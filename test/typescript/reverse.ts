import {reverse} from '../..';

// $ExpectType number[]
reverse([1, 2, 3]);

// $ExpectType never[]
reverse([]);
