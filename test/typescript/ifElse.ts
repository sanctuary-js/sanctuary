import {add, ifElse, odd, sub} from '../..';

// $ExpectType number
ifElse(odd, sub(1), add(1), 9);

// $ExpectType number
ifElse(odd, sub(1), add(1), 8);
