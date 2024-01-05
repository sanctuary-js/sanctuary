import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('Right', () => {

  eq (String (S.Right), 'Right :: b -> Either a b');

  eq (S.Right (42), S.Right (42));

});
