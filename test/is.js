import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';
import $ from 'sanctuary-def';

import * as S from 'sanctuary';
import is from 'sanctuary/is';

import {Sum} from './internal/Sum.js';


test ('is', () => {

  eq (S.is === is, true);
  eq (String (S.is), 'is :: Type -> Any -> Boolean');

  eq (S.is ($.Boolean) (true), true);
  eq (S.is ($.Boolean) (false), true);
  eq (S.is ($.Boolean) (new Boolean (true)), false);
  eq (S.is ($.Boolean) (new Boolean (false)), false);

  eq (S.is ($.Array ($.Integer)) (null), false);
  eq (S.is ($.Array ($.Integer)) (undefined), false);
  eq (S.is ($.Array ($.Integer)) (['1', '2', '3']), false);
  eq (S.is ($.Array ($.Integer)) ([1, 2, 3.14]), false);
  eq (S.is ($.Array ($.Integer)) ([1, 2, 3]), true);
  eq (S.is ($.Array ($.Integer)) ([]), true);

  eq (S.is ($.Maybe ($.Integer)) (S.Nothing), true);
  eq (S.is ($.Maybe ($.Integer)) (S.Just (0)), true);
  eq (S.is ($.Maybe ($.Integer)) (S.Left (0)), false);
  eq (S.is ($.Maybe ($.Integer)) (S.Right (0)), false);

  eq (S.is ($.Either ($.String) ($.Integer)) (S.Nothing), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Just (0)), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Left (0)), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Right ('')), false);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Left ('')), true);
  eq (S.is ($.Either ($.String) ($.Integer)) (S.Right (0)), true);

  const a = $.TypeVariable ('a');

  eq (S.is ($.Array (a)) ([]), true);
  eq (S.is ($.Array (a)) ([1, 2, 3]), true);
  eq (S.is ($.Array (a)) (['foo', 'bar', 'baz']), true);
  eq (S.is ($.Array (a)) (['foo', true, 42]), false);
  eq (S.is ($.Array (a)) ([Sum (1), Sum (2), Sum (3)]), true);

});
