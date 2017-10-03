import * as S from '..';

import eq from './internal/eq';


test('at', () => {

  eq(typeof S.at, 'function');
  eq(S.at.length, 2);
  eq(S.at.toString(), 'at :: Integer -> List a -> Maybe a');

  eq(S.at(-4)(['foo', 'bar', 'baz']), S.Nothing);
  eq(S.at(-3)(['foo', 'bar', 'baz']), S.Just('foo'));
  eq(S.at(-2)(['foo', 'bar', 'baz']), S.Just('bar'));
  eq(S.at(-1)(['foo', 'bar', 'baz']), S.Just('baz'));

  eq(S.at(0)(['foo', 'bar', 'baz']), S.Just('foo'));
  eq(S.at(1)(['foo', 'bar', 'baz']), S.Just('bar'));
  eq(S.at(2)(['foo', 'bar', 'baz']), S.Just('baz'));
  eq(S.at(3)(['foo', 'bar', 'baz']), S.Nothing);

});
