import {sortBy} from '../..';

// $ExpectType { [k: string]: number; }[]
sortBy((x: {[k: string]: number}) => x.foo)([{foo: 1}, {foo: 2, bar: 3}]);

// $ExpectType string[]
sortBy((x: string) => x.length)(['a', 'abc', 'ab']);
