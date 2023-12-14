import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import empty from 'sanctuary/empty';


test ('empty', () => {

  eq (S.empty === empty, true);
  eq (String (S.empty), 'empty :: Monoid a => TypeRep a -> a');

  eq (S.empty (String), '');
  eq (S.empty (Array), []);
  eq (S.empty (Object), {});

});
