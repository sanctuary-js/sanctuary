import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('isLeft', () => {

  eq (String (S.isLeft), 'isLeft :: Either a b -> Boolean');

  eq (S.isLeft (S.Left (42)), true);
  eq (S.isLeft (S.Right (42)), false);

});
