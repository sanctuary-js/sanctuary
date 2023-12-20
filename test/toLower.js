import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('toLower', () => {

  eq (String (S.toLower), 'toLower :: String -> String');

  eq (S.toLower (''), '');
  eq (S.toLower ('ABC def 123'), 'abc def 123');

});
