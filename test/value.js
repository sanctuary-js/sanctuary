import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import value from 'sanctuary/value';

import strMap from './internal/strMap.js';


test ('value', () => {

  eq (S.value === value, true);
  eq (String (S.value), 'value :: String -> StrMap a -> Maybe a');

  eq (S.value ('foo') ({foo: 1, bar: 2}), S.Just (1));
  eq (S.value ('bar') ({foo: 1, bar: 2}), S.Just (2));
  eq (S.value ('baz') ({foo: 1, bar: 2}), S.Nothing);

  eq (S.value ('valueOf') ({}), S.Nothing);

  eq (S.value ('non-enumerable inherited property') (strMap), S.Nothing);
  eq (S.value ('enumerable inherited property') (strMap), S.Nothing);
  eq (S.value ('non-enumerable own property') (strMap), S.Nothing);
  eq (S.value ('enumerable own property') (strMap), S.Just ('enumerable own property'));

});
