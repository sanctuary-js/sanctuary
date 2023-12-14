import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import toLower from 'sanctuary/toLower';


test ('toLower', () => {

  eq (S.toLower === toLower, true);
  eq (String (S.toLower), 'toLower :: String -> String');

  eq (S.toLower (''), '');
  eq (S.toLower ('ABC def 123'), 'abc def 123');

});
