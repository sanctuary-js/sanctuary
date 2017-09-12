import {lastIndexOf} from '../..';

// $ExpectType Maybe<number>
lastIndexOf('a')('abc');

// $ExpectType Maybe<number>
lastIndexOf(1)([1, 2, 3]);
