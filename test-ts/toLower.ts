import * as S from '..';

import eq from './internal/eq';


test('toLower', () => {

  eq(typeof S.toLower, 'function');
  eq(S.toLower.length, 1);
  eq(S.toLower.toString(), 'toLower :: String -> String');

  eq(S.toLower(''), '');
  eq(S.toLower('ABC def 123'), 'abc def 123');

});
