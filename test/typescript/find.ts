import {find, odd} from '../..';

// $ExpectType Maybe<number>
find(odd)([1, 2, 3]);

// $ExpectType Maybe<number>
find(odd)(['foo', 'bar']);
