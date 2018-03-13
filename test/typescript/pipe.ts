import {add, pipe} from '../..';

// $ExpectType {}
pipe([])(0);

// $ExpectType number
pipe([add(1)])(0);

// $ExpectType number
pipe([add(1), add(1)])(0);

// $ExpectType number
pipe([add(1), add(1), add(1)])(0);

// $ExpectType number
pipe([add(1), add(1), add(1), add(1)])(0);

// $ExpectType number
pipe([add(1), add(1), add(1), add(1), add(1)])(0);

// $ExpectType number
pipe([add(1), add(1), add(1), add(1), add(1), add(1)])(0);

// $ExpectType number
pipe([add(1), add(1), add(1), add(1), add(1), add(1), add(1)])(0);

// $ExpectType string
pipe([(s: string) => s.length, add(1), add(1), (n: number) => n.toFixed(2)])('');
