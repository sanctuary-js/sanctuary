import * as S from '..';

import eq from './internal/eq';


test('maybeToNullable', () => {

  eq(typeof S.maybeToNullable, 'function');
  eq(S.maybeToNullable.length, 1);
  eq(S.maybeToNullable.toString(), 'maybeToNullable :: Maybe a -> Nullable a');

  eq(S.maybeToNullable(S.Nothing), null);
  eq(S.maybeToNullable(S.Just(42)), 42);

});
