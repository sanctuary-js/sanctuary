import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('isJust', () => {

  eq (String (S.isJust), 'isJust :: Maybe a -> Boolean');

  eq (S.isJust (S.Nothing), false);
  eq (S.isJust (S.Just (42)), true);

});
