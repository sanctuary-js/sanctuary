import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';
import Identity from 'sanctuary-identity';

import S from './internal/sanctuary.js';


test ('extract', () => {

  eq (String (S.extract), 'extract :: Comonad w => w a -> a');

  eq (S.extract (Identity (42)), 42);

});
