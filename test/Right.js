import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import Right from 'sanctuary/Right';


test ('Right', () => {

  eq (S.Right === Right, true);
  eq (String (S.Right), 'Right :: b -> Either a b');

  eq (S.Right (42), S.Right (42));

});
