import * as S from '..';

import eq from './internal/eq';


test('compose', () => {

  eq(typeof S.compose, 'function');
  eq(S.compose.length, 2);
  eq(S.compose.toString(), 'compose :: Semigroupoid s => s b c -> s a b -> s a c');

  eq(S.compose(S.mult(2))(S.add(1))(20), 42);

});
