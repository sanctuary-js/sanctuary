import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('T', () => {

  eq (String (S.T), 'T :: a -> (a -> b) -> b');

  eq (S.T ('!') (S.concat ('foo')), 'foo!');
  eq (S.T ('!') (S.concat ('bar')), 'bar!');

});
