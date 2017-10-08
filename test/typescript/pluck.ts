import {pluck} from '../..';

// $ExpectType Functor<any>
pluck('x')([{x: 1}, {x: 2, y: 3}]);

// $ExpectType Functor<any>
pluck('x')([{x: 'foo'}, {x: 'bar', y: 'baz'}]);
