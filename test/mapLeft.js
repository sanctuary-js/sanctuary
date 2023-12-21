import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('mapLeft', () => {

  eq (String (S.mapLeft), 'mapLeft :: Bifunctor p => (a -> b) -> p a c -> p b c');

  eq (S.mapLeft (S.toUpper) (S.Left ('xxx')), S.Left ('XXX'));
  eq (S.mapLeft (S.toUpper) (S.Right (1000)), S.Right (1000));

});
