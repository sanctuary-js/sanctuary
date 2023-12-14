import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import bimap from 'sanctuary/bimap';


test ('bimap', () => {

  eq (S.bimap === bimap, true);
  eq (String (S.bimap), 'bimap :: Bifunctor p => (a -> b) -> (c -> d) -> p a c -> p b d');

  eq (S.bimap (S.toUpper) (S.add (1)) (S.Left ('xxx')), S.Left ('XXX'));
  eq (S.bimap (S.toUpper) (S.add (1)) (S.Right (1000)), S.Right (1001));

});
