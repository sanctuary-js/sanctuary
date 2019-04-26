'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const strMap = require ('./internal/strMap');


test ('value', () => {

  eq (S.show (S.value)) ('value :: String -> StrMap a -> Maybe a');

  eq (S.value ('foo') ({foo: 1, bar: 2})) (S.Just (1));
  eq (S.value ('bar') ({foo: 1, bar: 2})) (S.Just (2));
  eq (S.value ('baz') ({foo: 1, bar: 2})) (S.Nothing);

  eq (S.value ('valueOf') ({})) (S.Nothing);

  eq (S.value ('non-enumerable inherited property') (strMap)) (S.Nothing);
  eq (S.value ('enumerable inherited property') (strMap)) (S.Nothing);
  eq (S.value ('non-enumerable own property') (strMap)) (S.Nothing);
  eq (S.value ('enumerable own property') (strMap)) (S.Just ('enumerable own property'));

});
