import * as S from '..';

import eq from './internal/eq';


test('id', () => {

  eq(typeof S.id, 'function');
  eq(S.id.length, 1);
  eq(S.id.toString(), 'id :: Category c => TypeRep c -> c');

  eq(S.id(Function)(42), 42);

});
