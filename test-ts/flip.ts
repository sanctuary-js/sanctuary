import * as S from '..';

import eq from './internal/eq';


test('flip', () => {

  eq(typeof S.flip, 'function');
  eq(S.flip.length, 3);
  eq(S.flip.toString(), 'flip :: (a -> b -> c) -> b -> a -> c');

  eq(S.flip(S.concat)('foo')('bar'), 'barfoo');
  eq(S.map(S.flip(S.concat)('!'))(['BAM', 'POW', 'KA-POW']), ['BAM!', 'POW!', 'KA-POW!']);

});
