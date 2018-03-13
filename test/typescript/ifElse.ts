import {add, ifElse, odd, sub} from '../..';

// $ExpectType number
ifElse<number, number>(odd)(sub(1))(add(1))(8);
