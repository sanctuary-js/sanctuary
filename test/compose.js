import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('compose', () => {

  eq (String (S.compose), 'compose :: Semigroupoid s => s b c -> s a b -> s a c');

  eq (S.compose (S.mult (2)) (S.add (1)) (20), 42);

});
