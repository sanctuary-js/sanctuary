import * as S from '..';

import eq from './internal/eq';


test('or', () => {

  eq(typeof S.or, 'function');
  eq(S.or.length, 2);
  eq(S.or.toString(), 'or :: Boolean -> Boolean -> Boolean');

  eq(S.or(false)(false), false);
  eq(S.or(false)(true), true);
  eq(S.or(true)(false), true);
  eq(S.or(true)(true), true);

});
