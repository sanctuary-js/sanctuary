import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import Just from 'sanctuary/Just';


test ('Just', () => {

  eq (S.Just === Just, true);
  eq (String (S.Just), 'Just :: a -> Maybe a');

  eq (S.Just (42), S.Just (42));

});
