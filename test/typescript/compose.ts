import {add, sub, compose} from '../..';

// $ExpectType number
compose(add(1), sub(1), 10);

// $ExpectType number
compose(add(1), sub(1))(10);

// $ExpectType number
compose(add(1))(sub(1))(10);
