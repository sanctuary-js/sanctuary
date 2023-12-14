import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import T from 'sanctuary/T';


test ('T', () => {

  eq (S.T === T, true);
  eq (String (S.T), 'T :: a -> (a -> b) -> b');

  eq (S.T ('!') (S.concat ('foo')), 'foo!');
  eq (S.T ('!') (S.concat ('bar')), 'bar!');

});
