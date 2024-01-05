import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('fromRight', () => {

  eq (String (S.fromRight), 'fromRight :: b -> Either a b -> b');

  eq (S.fromRight (123) (S.Right (789)), 789);
  eq (S.fromRight (123) (S.Left ('abc')), 123);

});
