import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('empty', () => {

  eq (String (S.empty), 'empty :: Monoid a => TypeRep a -> a');

  eq (S.empty (String), '');
  eq (S.empty (Array), []);
  eq (S.empty (Object), {});

});
