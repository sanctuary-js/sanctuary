import {pluck} from '../..';

// $ExpectType number[]
pluck('x')([{x: 1}, {x: 2, y: 3}]);

// $ExpectType string[]
pluck('x')([{x: 'foo'}, {x: 'bar', y: 'baz'}]);
