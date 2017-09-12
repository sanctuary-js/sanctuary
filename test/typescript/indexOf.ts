import {indexOf} from '../..';

// $ExpectType Maybe<number>
indexOf('a')('abc');

// $ExpectType Maybe<number>
indexOf(1)([1, 2, 3]);
