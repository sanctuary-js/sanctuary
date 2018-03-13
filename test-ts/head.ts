import * as S from '..';

import eq from './internal/eq';


test('head', () => {

  eq(typeof S.head, 'function');
  eq(S.head.length, 1);
  eq(S.head.toString(), 'head :: List a -> Maybe a');

  eq(S.head([]), S.Nothing);
  eq(S.head(['foo']), S.Just('foo'));
  eq(S.head(['foo', 'bar']), S.Just('foo'));
  eq(S.head(['foo', 'bar', 'baz']), S.Just('foo'));

});
