import {__, complement, odd} from '../..';

// $ExpectType boolean
complement(odd, 1);

// $ExpectType boolean
complement(odd, 2);

// $ExpectType boolean
complement(odd)(2);

// $ExpectType boolean
complement(__, 2)(odd);

// $ExpectError Argument of type '(n: number) => boolean' is not assignable to parameter of type 'Placeholder'.
complement(odd, 'x');
