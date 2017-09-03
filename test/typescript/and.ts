import {__, and} from '../..';

// $ExpectType boolean
and(false, false);

// $ExpectType boolean
and(__, true)(false);

// $ExpectType boolean
and(true)(false);
