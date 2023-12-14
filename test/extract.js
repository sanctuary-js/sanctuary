import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';
import Identity from 'sanctuary-identity';

import * as S from 'sanctuary';
import extract from 'sanctuary/extract';


test ('extract', () => {

  eq (S.extract === extract, true);
  eq (String (S.extract), 'extract :: Comonad w => w a -> a');

  eq (S.extract (Identity (42)), 42);

});
