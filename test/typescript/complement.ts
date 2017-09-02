import {complement, odd} from '../..';

// $ExpectType boolean
complement(odd, 1);

// $ExpectType boolean
complement(odd, 2);

// $ExpectError Argument of type '"x"' is not assignable to parameter of type 'number'.
complement(odd, 'x');
