
import {and} from '../..';

// $ExpectType boolean
and(false, false);
// $ExpectType boolean
and(false, true);
// $ExpectType boolean
and(true, false);
// $ExpectType boolean
and(true, true);
