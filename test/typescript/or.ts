import {or} from '../..';

// $ExpectType boolean
or(false, false);

// $ExpectType boolean
or(true)(false);
