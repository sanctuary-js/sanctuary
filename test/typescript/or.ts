import {__, or} from '../..';

// $ExpectType boolean
or(false, false);

// $ExpectType boolean
or(__, true)(false);

// $ExpectType boolean
or(true)(false);
