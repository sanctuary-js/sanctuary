import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import Left from 'sanctuary/Left';


test ('Left', () => {

  eq (S.Left === Left, true);
  eq (String (S.Left), 'Left :: a -> Either a b');

  eq (S.Left (42), S.Left (42));

});
