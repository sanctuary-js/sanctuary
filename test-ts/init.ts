import * as S from '..';

import eq from './internal/eq';


test('init', () => {

  eq(typeof S.init, 'function');
  eq(S.init.length, 1);
  eq(S.init.toString(), 'init :: List a -> Maybe (List a)');

  eq(S.init([]), S.Nothing);
  eq(S.init(['foo']), S.Just([]));
  eq(S.init(['foo', 'bar']), S.Just(['foo']));
  eq(S.init(['foo', 'bar', 'baz']), S.Just(['foo', 'bar']));

});
