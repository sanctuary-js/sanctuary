const Z = require('sanctuary-type-classes');

import * as S from '..';

import eq from './internal/eq';


test('T', () => {

  eq(typeof S.T, 'function');
  eq(S.T.length, 2);
  eq(S.T.toString(), 'T :: a -> (a -> b) -> b');

  eq(S.T(42)(S.add(1)), 43);
  eq(Z.map(S.T(100), [S.add(1), Math.sqrt]), [101, 10]);

});
