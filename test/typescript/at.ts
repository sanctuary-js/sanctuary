import {at} from '../..';

// $ExpectType Maybe<string>
at(3)('foo');

// $ExpectType Maybe<number>
at<number>(3)([1, 2, 3]);

// Inferred generic doesn't pass number through. Not ideal.
// $ExpectType Maybe<{}>
at(3)([1, 2, 3]);
