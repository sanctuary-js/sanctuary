import {and} from '../..';

// $ExpectType boolean
and(false, false);

// $ExpectType boolean
and(true)(false);
